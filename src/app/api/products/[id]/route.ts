import { NextRequest, NextResponse } from 'next/server';
import { ProductStorage } from '@/lib/file-storage';

export const dynamic = 'force-dynamic';
// export const runtime = 'edge'; // REMOVED - File operations need Node.js runtime

// GET - Get individual product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID'
      }, { status: 400 });
    }

    console.log(`🔍 Individual API - Fetching product ID: ${id}`);
    
    const product = ProductStorage.getById(id);
    
    if (!product) {
      console.log(`❌ Product ${id} not found in file storage`);
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    console.log(`✅ Product ${id} found in file storage:`, product.title);

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error(`❌ Error fetching product ${params.id}:`, error);
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
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID'
      }, { status: 400 });
    }

    const body = await request.json();
    console.log(`📝 Updating product ID: ${id}`);

    const updatedProduct = ProductStorage.update(id, body);
    
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
    console.error(`❌ Error updating product ${params.id}:`, error);
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
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID'
      }, { status: 400 });
    }

    console.log(`🗑️ Deleting product ID: ${id}`);

    const success = ProductStorage.delete(id);
    
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
    console.error(`❌ Error deleting product ${params.id}:`, error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete product'
    }, { status: 500 });
  }
} 