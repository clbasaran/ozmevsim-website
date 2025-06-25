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
    const id = searchParams.get('id');
    const status = searchParams.get('status') || 'active';

    // If ID is provided, fetch single product
    if (id) {
      let product;
      const numericId = parseInt(id);
      
      if (!isNaN(numericId)) {
        // Numeric ID - use regular getProduct
        product = await dbService.getProduct(numericId);
      } else {
        // String ID (like UNKNOWN-112) - search by title/code
        try {
          const products = await dbService.getProducts('active');
          product = products.find(p => 
            p.id.toString() === id || 
            p.title?.includes(id) ||
            p.model === id
          );
        } catch (err) {
          console.log('Fallback search failed:', err);
        }
      }
      
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

      // Parse JSON fields for single product
      const processedProduct = {
        ...product,
        features: typeof product.features === 'string' ? JSON.parse(product.features) : product.features,
        specifications: typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications,
      };

      return NextResponse.json({
        success: true,
        data: processedProduct
      });
    }

    // Fetch all products from D1
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
    const { title, description, price, image_url, all_images, category, brand, model, features, specifications, status } = body;

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
      all_images: all_images || '[]',
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, price, image_url, all_images, category, brand, model, features, specifications, status } = body;

    // Validation
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

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

    console.log('🔄 PUT Request - Updating product:', {
      id,
      title,
      image_url,
      all_images: all_images ? all_images.substring(0, 100) + '...' : 'none'
    });

    // Update product in D1
    const result = await dbService.updateProduct(parseInt(id), {
      title,
      description,
      price: price || 0,
      image_url: image_url || '',
      all_images: all_images || '[]',
      category: category || 'general',
      brand: brand || '',
      model: model || '',
      features: Array.isArray(features) ? JSON.stringify(features) : features || '[]',
      specifications: typeof specifications === 'object' ? JSON.stringify(specifications) : specifications || '{}',
      status: status || 'active'
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to update product');
    }

    console.log('✅ PUT Request - Product updated successfully:', id);

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      id: id
    });

  } catch (error: any) {
    console.error('Products PUT API Error:', error);
    return NextResponse.json(
      { error: 'Failed to update product: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    // Validation
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get database service
    const dbService = createDatabaseService();
    if (!dbService) {
      throw new Error('Database not available');
    }

    // Delete product from D1
    const result = await dbService.deleteProduct(parseInt(id));

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete product');
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error: any) {
    console.error('Products DELETE API Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 