import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const STATIC_PRODUCTS = [
  {
    id: 1,
    title: 'Vaillant EcoTEC Plus',
    description: 'Yüksek verimli kondanse kombi sistemi',
    price: 35000,
    image_url: '/uploads/products/vaillant-ecotec-plus.png',
    category: 'Kombi',
    brand: 'Vaillant',
    status: 'active'
  },
  {
    id: 2,
    title: 'Bosch Condens 8300iW',
    description: 'Şık tasarımlı kondanse kombi',
    price: 28000,
    image_url: '/uploads/products/bosch-condens-8300iw.png',
    category: 'Kombi',
    brand: 'Bosch',
    status: 'active'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const id = searchParams.get('id');

    let products = STATIC_PRODUCTS;

    // Filter static data if needed
    if (category) {
      products = products.filter(p => p.category === category);
    }
    if (brand) {
      products = products.filter(p => p.brand === brand);
    }
    if (id) {
      products = products.filter(p => p.id === parseInt(id));
    }

    return NextResponse.json({
      success: true,
      data: products,
      source: 'static',
      count: products.length
    });

  } catch (error: any) {
    console.error('Products API Error:', error);
    return NextResponse.json({
      success: true,
      data: STATIC_PRODUCTS,
      source: 'fallback',
      count: STATIC_PRODUCTS.length
    });
  }
} 