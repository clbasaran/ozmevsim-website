import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge'; // Re-enable edge runtime for D1 compatibility

// D1 Database helper functions
function getDB(env: any) {
  if (env?.ozmevsim_d1) {
    return env.ozmevsim_d1;
  }
  
  // Fallback to in-memory products for development
  console.log('⚠️ No D1 database available, using fallback data');
  return null;
}

// Fallback products for development/testing
const fallbackProducts = [
  {
    id: 1,
    title: 'Bosch Condens 8300iW',
    description: 'Yüksek verimli kombi sistemi',
    image_url: '/uploads/products/bosch/bosch-condens-8300iw.png',
    category: 'Kombi',
    brand: 'Bosch',
    features: '["Yüksek verim", "Düşük emisyon", "Sessiz çalışma"]',
    specifications: '[{"key":"Güç","value":"24 kW"},{"key":"Verim","value":"%93"}]',
    status: 'active',
    price: 15000,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'DemirDöküm Nitromix',
    description: 'Güvenilir ve dayanıklı kombi',
    image_url: '/uploads/products/demirdokum/demirdokum-nitromix-kombi.png',
    category: 'Kombi',
    brand: 'DemirDöküm',
    features: '["Uzun ömür", "Kolay bakım", "Güvenli"]',
    specifications: '[{"key":"Güç","value":"28 kW"},{"key":"Garanti","value":"5 yıl"}]',
    status: 'active',
    price: 12000,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Vaillant EcoTec Plus',
    description: 'Premium kalite kombi sistemi',
    image_url: '/uploads/products/vaillant/vaillant-ecotec-plus.png',
    category: 'Kombi',
    brand: 'Vaillant',
    features: '["Premium kalite", "Akıllı kontrol", "Enerji tasarrufu"]',
    specifications: '[{"key":"Güç","value":"32 kW"},{"key":"Sınıf","value":"A+"}]',
    status: 'active',
    price: 18000,
    created_at: new Date().toISOString()
  }
];

// GET - Retrieve products (all or by ID)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Access environment variables from the request's context
    // @ts-ignore - Cloudflare Pages specific binding
    const env = request.cf?.env || process.env;
    const db = getDB(env);

    if (!db) {
      // Use fallback data when D1 not available
      if (id) {
        const product = fallbackProducts.find(p => p.id === parseInt(id));
        if (!product) {
          return NextResponse.json({
            success: false,
            error: 'Product not found'
          }, { status: 404 });
        }
        return NextResponse.json({
          success: true,
          data: product
        });
      } else {
        console.log('✅ Products API - Retrieved fallback products:', fallbackProducts.length);
        return NextResponse.json({
          success: true,
          data: fallbackProducts
        });
      }
    }

    if (id) {
      // Get specific product by ID from D1
      const product = await db.prepare(
        'SELECT * FROM products WHERE id = ?'
      ).bind(id).first();
      
      if (!product) {
        return NextResponse.json({
          success: false,
          error: 'Product not found'
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        data: product
      });
    } else {
      // Get all products from D1
      const { results } = await db.prepare(
        'SELECT * FROM products WHERE status = ? ORDER BY created_at DESC'
      ).bind('active').all();
      
      console.log('✅ Products API - Retrieved D1 products:', results.length);
      return NextResponse.json({
        success: true,
        data: results
      });
    }
  } catch (error) {
    console.error('❌ Error in products GET:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Access environment variables from the request's context
    // @ts-ignore - Cloudflare Pages specific binding
    const env = request.cf?.env || process.env;
    const db = getDB(env);
    
    console.log('📝 Creating new product:', body.title);

    if (!db) {
      return NextResponse.json({
        success: false,
        error: 'Database not available'
      }, { status: 503 });
    }

    const newProduct = {
      title: body.title || '',
      description: body.description || '',
      image_url: body.image_url || '',
      category: body.category || '',
      brand: body.brand || '',
      features: body.features || '[]',
      specifications: body.specifications || '[]',
      status: body.status || 'active',
      price: parseInt(body.price) || 0,
      created_at: new Date().toISOString()
    };

    const result = await db.prepare(`
      INSERT INTO products (title, description, image_url, category, brand, features, specifications, status, price, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      newProduct.title,
      newProduct.description,
      newProduct.image_url,
      newProduct.category,
      newProduct.brand,
      newProduct.features,
      newProduct.specifications,
      newProduct.status,
      newProduct.price,
      newProduct.created_at
    ).run();

    const createdProduct = {
      id: result.meta.last_row_id,
      ...newProduct
    };

    console.log('✅ Product created successfully:', createdProduct.id);
    
    return NextResponse.json({
      success: true,
      data: createdProduct,
      message: 'Product created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create product'
    }, { status: 500 });
  }
}

// PUT - Update existing product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    // Access environment variables from the request's context
    // @ts-ignore - Cloudflare Pages specific binding
    const env = request.cf?.env || process.env;
    const db = getDB(env);

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({
        success: false,
        error: 'Database not available'
      }, { status: 503 });
    }

    const result = await db.prepare(`
      UPDATE products 
      SET title = ?, description = ?, image_url = ?, category = ?, brand = ?, 
          features = ?, specifications = ?, status = ?, price = ?
      WHERE id = ?
    `).bind(
      updateData.title,
      updateData.description,
      updateData.image_url,
      updateData.category,
      updateData.brand,
      updateData.features,
      updateData.specifications,
      updateData.status,
      parseInt(updateData.price),
      id
    ).run();

    if (result.changes === 0) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    const updatedProduct = await db.prepare(
      'SELECT * FROM products WHERE id = ?'
    ).bind(id).first();

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update product'
    }, { status: 500 });
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Access environment variables from the request's context
    // @ts-ignore - Cloudflare Pages specific binding
    const env = request.cf?.env || process.env;
    const db = getDB(env);

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({
        success: false,
        error: 'Database not available'
      }, { status: 503 });
    }

    const result = await db.prepare(
      'DELETE FROM products WHERE id = ?'
    ).bind(id).run();
    
    if (result.changes === 0) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete product'
    }, { status: 500 });
  }
} 