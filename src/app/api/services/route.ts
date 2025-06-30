import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Edge runtime for Cloudflare Pages
export const runtime = 'edge';

interface Service {
  id?: number;
  title: string;
  description: string;
  icon: string;
  features: string; // JSON string
  is_active?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

// GET - Fetch all services
export async function GET() {
  try {
    const env = process.env as any;
    if (!env.ozmevsim_d1) {
      console.error('D1 database not available');
      return NextResponse.json({ 
        success: false, 
        error: 'Database not available',
        data: []
      });
    }

    const { results } = await env.ozmevsim_d1.prepare(`
      SELECT * FROM services 
      ORDER BY sort_order ASC, created_at DESC
    `).all();

    // Parse JSON fields
    const services = results.map((service: any) => ({
      ...service,
      features: service.features ? JSON.parse(service.features) : [],
      isActive: service.is_active
    }));

    return NextResponse.json({ 
      success: true, 
      data: services 
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch services',
      data: []
    });
  }
}

// POST - Create new service
export async function POST(request: NextRequest) {
  try {
    const env = process.env as any;
    if (!env.ozmevsim_d1) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database not available' 
      });
    }

    const data: any = await request.json();
    
    // Validate required fields
    if (!data.title || !data.description) {
      return NextResponse.json({ 
        success: false, 
        error: 'Title and description are required' 
      });
    }

    // Stringify features array
    const features = Array.isArray(data.features) ? JSON.stringify(data.features) : data.features || '[]';

    const result = await env.ozmevsim_d1.prepare(`
      INSERT INTO services (
        title, description, icon, features, is_active, sort_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.title,
      data.description,
      data.icon || 'cog',
      features,
      data.isActive !== undefined ? data.isActive : (data.is_active !== undefined ? data.is_active : true),
      data.sort_order || 0,
      new Date().toISOString(),
      new Date().toISOString()
    ).run();

    return NextResponse.json({ 
      success: true, 
      data: { id: result.meta.last_row_id, ...data } 
    });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create service' 
    });
  }
}

// PUT - Update service
export async function PUT(request: NextRequest) {
  try {
    const env = process.env as any;
    if (!env.ozmevsim_d1) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database not available' 
      });
    }

    const data: any = await request.json();
    
    if (!data.id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Service ID is required' 
      });
    }

    // Stringify features array
    const features = Array.isArray(data.features) ? JSON.stringify(data.features) : data.features || '[]';

    await env.ozmevsim_d1.prepare(`
      UPDATE services SET
        title = ?, description = ?, icon = ?, features = ?, is_active = ?, sort_order = ?, updated_at = ?
      WHERE id = ?
    `).bind(
      data.title,
      data.description,
      data.icon || 'cog',
      features,
      data.isActive !== undefined ? data.isActive : (data.is_active !== undefined ? data.is_active : true),
      data.sort_order || 0,
      new Date().toISOString(),
      data.id
    ).run();

    return NextResponse.json({ 
      success: true, 
      data: data 
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update service' 
    });
  }
}

// DELETE - Delete service
export async function DELETE(request: NextRequest) {
  try {
    const env = process.env as any;
    if (!env.ozmevsim_d1) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database not available' 
      });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Service ID is required' 
      });
    }

    await env.ozmevsim_d1.prepare(`
      DELETE FROM services WHERE id = ?
    `).bind(id).run();

    return NextResponse.json({ 
      success: true, 
      message: 'Service deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete service' 
    });
  }
} 