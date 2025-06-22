import { NextRequest, NextResponse } from 'next/server';
import { createDatabaseService } from '@/lib/database';

// Edge runtime for Cloudflare Pages
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // Get database service
    const dbService = createDatabaseService();
    if (!dbService) {
      throw new Error('Database not available');
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';

    // Fetch products from D1
    const products = await dbService.getProducts(status);

    // Parse JSON fields
    const processedProducts = products.map((product: any) => ({
      ...product,
      features: typeof product.features === 'string' ? JSON.parse(product.features) : product.features,
      specifications: typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications,
    }));

    return NextResponse.json({
      success: true,
      data: processedProducts
    });

  } catch (error: any) {
    console.error('Products GET API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
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

    // Get database service
    const dbService = createDatabaseService();
    if (!dbService) {
      throw new Error('Database not available');
    }

    // Create product in D1
    const result = await dbService.createProduct({
      title,
      description,
      price: price || 0,
      image_url: image_url || '',
      category: category || 'general',
      brand: brand || '',
      model: model || '',
      features: features || [],
      specifications: specifications || {},
      status: status || 'active'
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to create product');
    }

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      id: result.id
    });

  } catch (error: any) {
    console.error('Products POST API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 