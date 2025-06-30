import { NextRequest, NextResponse } from 'next/server';
import { ProductStorage } from '@/lib/file-storage';

export const dynamic = 'force-dynamic';
// export const runtime = 'edge'; // REMOVED - File operations need Node.js runtime

// GET - Retrieve products (all or by ID)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Get specific product by ID
      const product = ProductStorage.getById(parseInt(id));
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
      // Get all products
      const products = ProductStorage.getAll();
      console.log('✅ Products API - Retrieved products:', products.length);
      return NextResponse.json({
        success: true,
        data: products
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
    console.log('📝 Creating new product:', body.title);

    const newProduct = ProductStorage.create({
      title: body.title || '',
      description: body.description || '',
      image_url: body.image_url || '',
      category: body.category || '',
      brand: body.brand || '',
      features: body.features || '[]',
      specifications: body.specifications || '[]',
      status: body.status || 'active',
      price: parseInt(body.price) || 0
    });

    console.log('✅ Product created successfully:', newProduct.id);
    
    return NextResponse.json({
      success: true,
      data: newProduct,
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

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 });
    }

    const updatedProduct = ProductStorage.update(parseInt(id), updateData);
    
    if (!updatedProduct) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

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

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 });
    }

    const success = ProductStorage.delete(parseInt(id));
    
    if (!success) {
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