import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Edge runtime for Cloudflare Pages
export const runtime = 'edge';

interface MenuItem {
  id?: number;
  location_key: string;
  parent_id?: number;
  title: string;
  url: string;
  target: string;
  icon?: string;
  description?: string;
  css_classes?: string;
  position: number;
  is_active: boolean;
  visibility: string;
  created_at?: string;
  updated_at?: string;
  children?: MenuItem[];
}

interface MenuLocation {
  id?: number;
  key: string;
  name: string;
  description?: string;
  max_depth: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// GET /api/menu - Get menu items by location or all menus
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const includeInactive = searchParams.get('include_inactive') === 'true';
    const flat = searchParams.get('flat') === 'true';

    const env = process.env as any;
    
    if (!env.ozmevsim_d1) {
      return NextResponse.json({
        success: false,
        error: 'Database not available'
      }, { status: 503 });
    }

    if (location) {
      // Get menu items for specific location
      const menuItems = await getMenuItems(env.ozmevsim_d1, location, includeInactive);
      
      if (flat) {
        return NextResponse.json({
          success: true,
          data: menuItems,
          location
        });
      }

      // Build hierarchical menu structure
      const hierarchicalMenu = buildMenuHierarchy(menuItems);

      return NextResponse.json({
        success: true,
        data: hierarchicalMenu,
        location
      });
    } else {
      // Get all menu locations
      const locations = await getMenuLocations(env.ozmevsim_d1);
      
      return NextResponse.json({
        success: true,
        data: locations
      });
    }

  } catch (error) {
    console.error('Menu API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch menu'
    }, { status: 500 });
  }
}

// POST /api/menu - Create new menu item or location
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    const env = process.env as any;
    
    if (!env.ozmevsim_d1) {
      return NextResponse.json({
        success: false,
        error: 'Database not available'
      }, { status: 503 });
    }

    let result: any;

    if (type === 'location') {
      result = await createMenuLocation(env.ozmevsim_d1, data);
    } else {
      result = await createMenuItem(env.ozmevsim_d1, data);
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Menu ${type} created successfully`
    }, { status: 201 });

  } catch (error) {
    console.error('Menu create error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create menu item'
    }, { status: 500 });
  }
}

// PUT /api/menu - Update menu item or location
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, ...data } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID is required'
      }, { status: 400 });
    }

    const env = process.env as any;
    
    if (!env.ozmevsim_d1) {
      return NextResponse.json({
        success: false,
        error: 'Database not available'
      }, { status: 503 });
    }

    let result: any;

    if (type === 'location') {
      result = await updateMenuLocation(env.ozmevsim_d1, id, data);
    } else {
      result = await updateMenuItem(env.ozmevsim_d1, id, data);
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Menu ${type} updated successfully`
    });

  } catch (error) {
    console.error('Menu update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update menu item'
    }, { status: 500 });
  }
}

// DELETE /api/menu - Delete menu item or location
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({
        success: false,
        error: 'Type and ID are required'
      }, { status: 400 });
    }

    const env = process.env as any;
    
    if (!env.ozmevsim_d1) {
      return NextResponse.json({
        success: false,
        error: 'Database not available'
      }, { status: 503 });
    }

    let result: any;

    if (type === 'location') {
      result = await deleteMenuLocation(env.ozmevsim_d1, id);
    } else {
      result = await deleteMenuItem(env.ozmevsim_d1, id);
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Menu ${type} deleted successfully`
    });

  } catch (error) {
    console.error('Menu delete error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete menu item'
    }, { status: 500 });
  }
}

// Helper functions

async function getMenuItems(db: any, location: string, includeInactive: boolean = false) {
  let query = `
    SELECT * FROM menu_items 
    WHERE location_key = ?
  `;
  const params = [location];

  if (!includeInactive) {
    query += ' AND is_active = 1';
  }

  query += ' ORDER BY position, created_at';

  const result = await db.prepare(query).bind(...params).all();
  
  return result.results || [];
}

async function getMenuLocations(db: any) {
  const query = 'SELECT * FROM menu_locations WHERE is_active = 1 ORDER BY key';
  
  const result = await db.prepare(query).all();
  
  return result.results || [];
}

function buildMenuHierarchy(items: MenuItem[]): MenuItem[] {
  const itemMap = new Map<number, MenuItem>();
  const rootItems: MenuItem[] = [];

  // First pass: create map of all items
  items.forEach(item => {
    if (item.id) {
      itemMap.set(item.id, { ...item, children: [] });
    }
  });

  // Second pass: build hierarchy
  items.forEach(item => {
    if (item.id) {
      const menuItem = itemMap.get(item.id);
      if (menuItem) {
        if (item.parent_id) {
          const parent = itemMap.get(item.parent_id);
          if (parent) {
            if (!parent.children) {
              parent.children = [];
            }
            parent.children.push(menuItem);
          }
        } else {
          rootItems.push(menuItem);
        }
      }
    }
  });

  // Sort children by position
  const sortByPosition = (items: MenuItem[]) => {
    items.sort((a, b) => a.position - b.position);
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        sortByPosition(item.children);
      }
    });
  };

  sortByPosition(rootItems);
  
  return rootItems;
}

async function createMenuItem(db: any, data: MenuItem) {
  const query = `
    INSERT INTO menu_items (
      location_key, parent_id, title, url, target, icon, description, 
      css_classes, position, is_active, visibility
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const result = await db.prepare(query).bind(
    data.location_key,
    data.parent_id || null,
    data.title,
    data.url,
    data.target || '_self',
    data.icon || null,
    data.description || null,
    data.css_classes || null,
    data.position || 0,
    data.is_active !== false,
    data.visibility || 'public'
  ).run();

  if (!result.success) {
    throw new Error('Failed to create menu item');
  }

  return { id: result.meta?.last_row_id, ...data };
}

async function createMenuLocation(db: any, data: MenuLocation) {
  const query = `
    INSERT INTO menu_locations (key, name, description, max_depth, is_active)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  const result = await db.prepare(query).bind(
    data.key,
    data.name,
    data.description || null,
    data.max_depth || 3,
    data.is_active !== false
  ).run();

  if (!result.success) {
    throw new Error('Failed to create menu location');
  }

  return { id: result.meta?.last_row_id, ...data };
}

async function updateMenuItem(db: any, id: string, data: Partial<MenuItem>) {
  const fields = [];
  const params = [];

  // Build dynamic update query
  if (data.title !== undefined) {
    fields.push('title = ?');
    params.push(data.title);
  }
  if (data.url !== undefined) {
    fields.push('url = ?');
    params.push(data.url);
  }
  if (data.target !== undefined) {
    fields.push('target = ?');
    params.push(data.target);
  }
  if (data.icon !== undefined) {
    fields.push('icon = ?');
    params.push(data.icon);
  }
  if (data.description !== undefined) {
    fields.push('description = ?');
    params.push(data.description);
  }
  if (data.css_classes !== undefined) {
    fields.push('css_classes = ?');
    params.push(data.css_classes);
  }
  if (data.position !== undefined) {
    fields.push('position = ?');
    params.push(data.position);
  }
  if (data.is_active !== undefined) {
    fields.push('is_active = ?');
    params.push(data.is_active);
  }
  if (data.visibility !== undefined) {
    fields.push('visibility = ?');
    params.push(data.visibility);
  }
  if (data.parent_id !== undefined) {
    fields.push('parent_id = ?');
    params.push(data.parent_id);
  }

  if (fields.length === 0) {
    return { id, message: 'No fields to update' };
  }

  fields.push('updated_at = datetime(\'now\')');
  params.push(id);

  const query = `UPDATE menu_items SET ${fields.join(', ')} WHERE id = ?`;
  
  const result = await db.prepare(query).bind(...params).run();

  if (!result.success) {
    throw new Error('Failed to update menu item');
  }

  if (result.changes === 0) {
    throw new Error('Menu item not found');
  }

  return { id, changes: result.changes, ...data };
}

async function updateMenuLocation(db: any, id: string, data: Partial<MenuLocation>) {
  const fields = [];
  const params = [];

  if (data.name !== undefined) {
    fields.push('name = ?');
    params.push(data.name);
  }
  if (data.description !== undefined) {
    fields.push('description = ?');
    params.push(data.description);
  }
  if (data.max_depth !== undefined) {
    fields.push('max_depth = ?');
    params.push(data.max_depth);
  }
  if (data.is_active !== undefined) {
    fields.push('is_active = ?');
    params.push(data.is_active);
  }

  if (fields.length === 0) {
    return { id, message: 'No fields to update' };
  }

  fields.push('updated_at = datetime(\'now\')');
  params.push(id);

  const query = `UPDATE menu_locations SET ${fields.join(', ')} WHERE id = ?`;
  
  const result = await db.prepare(query).bind(...params).run();

  if (!result.success) {
    throw new Error('Failed to update menu location');
  }

  if (result.changes === 0) {
    throw new Error('Menu location not found');
  }

  return { id, changes: result.changes, ...data };
}

async function deleteMenuItem(db: any, id: string) {
  // First, update child items to remove parent reference
  await db.prepare('UPDATE menu_items SET parent_id = NULL WHERE parent_id = ?').bind(id).run();
  
  // Then delete the item
  const result = await db.prepare('DELETE FROM menu_items WHERE id = ?').bind(id).run();

  if (!result.success) {
    throw new Error('Failed to delete menu item');
  }

  if (result.changes === 0) {
    throw new Error('Menu item not found');
  }

  return { id, changes: result.changes };
}

async function deleteMenuLocation(db: any, id: string) {
  // First, delete all menu items in this location
  await db.prepare('DELETE FROM menu_items WHERE location_key = (SELECT key FROM menu_locations WHERE id = ?)').bind(id).run();
  
  // Then delete the location
  const result = await db.prepare('DELETE FROM menu_locations WHERE id = ?').bind(id).run();

  if (!result.success) {
    throw new Error('Failed to delete menu location');
  }

  if (result.changes === 0) {
    throw new Error('Menu location not found');
  }

  return { id, changes: result.changes };
} 