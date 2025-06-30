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
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: STATIC_PRODUCTS,
    source: 'static',
    count: STATIC_PRODUCTS.length
  });
} 