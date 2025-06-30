import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const dynamic = 'force-dynamic';
export const runtime = 'edge'; // Re-enable edge runtime for D1 compatibility

// D1 Database helper functions
function getDB() {
  try {
    const { env } = getRequestContext();
    if (env?.ozmevsim_d1) {
      return env.ozmevsim_d1;
    }
  } catch (error) {
    console.log('⚠️ getRequestContext() not available, using fallback data');
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

// GET - Get individual product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const db = getDB();
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID'
      }, { status: 400 });
    }

    console.log(`🔍 Individual API - Fetching product ID: ${id}`);
    
    if (!db) {
      // Use fallback data when D1 not available
      const product = fallbackProducts.find(p => p.id === id);
      
      if (!product) {
        console.log(`❌ Product ${id} not found in fallback data`);
        return NextResponse.json({
          success: false,
          error: 'Product not found'
        }, { status: 404 });
      }

      console.log(`✅ Product ${id} found in fallback data:`, product.title);
      return NextResponse.json({
        success: true,
        data: product
      });
    }
    
    const product = await db.prepare(
      'SELECT * FROM products WHERE id = ? AND status = ?'
    ).bind(id, 'active').first();
    
    if (!product) {
      console.log(`❌ Product ${id} not found in D1 database`);
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    console.log(`✅ Product ${id} found in D1 database:`, product.title);

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error(`❌ Error fetching product ${params?.id}:`, error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// PUT - Update individual product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const db = getDB();
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID'
      }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({
        success: false,
        error: 'Database not available'
      }, { status: 503 });
    }

    const body = await request.json();
    console.log(`📝 Updating product ID: ${id}`);

    const result = await db.prepare(`
      UPDATE products 
      SET title = ?, description = ?, image_url = ?, category = ?, brand = ?, 
          features = ?, specifications = ?, status = ?, price = ?
      WHERE id = ?
    `).bind(
      body.title,
      body.description,
      body.image_url,
      body.category,
      body.brand,
      body.features,
      body.specifications,
      body.status,
      parseInt(body.price),
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
    console.error(`❌ Error updating product ${params?.id}:`, error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update product'
    }, { status: 500 });
  }
}

// DELETE - Delete individual product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const db = getDB();
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID'
      }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({
        success: false,
        error: 'Database not available'
      }, { status: 503 });
    }

    console.log(`🗑️ Deleting product ID: ${id}`);

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
    console.error(`❌ Error deleting product ${params?.id}:`, error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete product'
    }, { status: 500 });
  }
} 