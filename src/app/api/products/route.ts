import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Edge runtime for Cloudflare Pages
export const runtime = 'edge';

// Memory storage for products
let memoryStorage: any[] = [
  {
    id: 1,
    title: 'Vaillant EcoTEC Plus',
    description: 'Yüksek verimli kondanse kombi sistemi',
    price: 35000,
    image_url: '/uploads/products/vaillant-ecotec.jpg',
    category: 'Kombi',
    brand: 'Vaillant',
    model: 'EcoTEC Plus',
    features: ['ErP A+ sınıfı', 'Modülasyon', 'Uzun ömürlü'],
    specifications: { güç: '35 kW', marka: 'Vaillant' },
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Bosch Condens 8300iW',
    description: 'Premium kondanse kombi sistemi',
    price: 42000,
    image_url: '/uploads/products/bosch-kombi.jpg',
    category: 'Kombi',
    brand: 'Bosch',
    model: 'Condens 8300iW',
    features: ['Yüksek verim', 'Kompakt tasarım', 'Sessiz çalışma'],
    specifications: { güç: '30 kW', marka: 'Bosch' },
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Products API - Memory only version');
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status') || 'active';

    // Filter by status
    let allProducts = memoryStorage.filter(p => p.status === status);

    // If ID is provided, fetch single product
    if (id) {
      const numericId = parseInt(id);
      const product = allProducts.find(p => p.id === numericId);
      
      if (!product) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Product not found',
            id: id 
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: product,
        source: 'memory'
      });
    }

    return NextResponse.json({
      success: true,
      data: allProducts,
      source: 'memory',
      count: allProducts.length
    });

  } catch (error: any) {
    console.error('Products API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch products',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, price, image_url, category, brand, model, features, specifications, status } = body;

    // Validation
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const newProduct = {
      id: Date.now(),
      title,
      description,
      price: price || 0,
      image_url: image_url || '/uploads/placeholder.jpg',
      category: category || 'general',
      brand: brand || '',
      model: model || '',
      features: Array.isArray(features) ? features : [],
      specifications: typeof specifications === 'object' ? specifications : {},
      status: status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    memoryStorage.push(newProduct);

    return NextResponse.json({
      success: true,
      data: newProduct,
      source: 'memory'
    });

  } catch (error: any) {
    console.error('Products POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, price, image_url, category, brand, model, features, specifications, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const productIndex = memoryStorage.findIndex(p => p.id === parseInt(id));
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    memoryStorage[productIndex] = {
      ...memoryStorage[productIndex],
      title: title || memoryStorage[productIndex].title,
      description: description || memoryStorage[productIndex].description,
      price: price !== undefined ? price : memoryStorage[productIndex].price,
      image_url: image_url || memoryStorage[productIndex].image_url,
      category: category || memoryStorage[productIndex].category,
      brand: brand || memoryStorage[productIndex].brand,
      model: model || memoryStorage[productIndex].model,
      features: features !== undefined ? features : memoryStorage[productIndex].features,
      specifications: specifications !== undefined ? specifications : memoryStorage[productIndex].specifications,
      status: status || memoryStorage[productIndex].status,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: memoryStorage[productIndex],
      source: 'memory'
    });

  } catch (error: any) {
    console.error('Products PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const productIndex = memoryStorage.findIndex(p => p.id === parseInt(id));
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    memoryStorage.splice(productIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      source: 'memory'
    });

  } catch (error: any) {
    console.error('Products DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 