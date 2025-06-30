import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Edge runtime for Cloudflare Pages
export const runtime = 'edge';

// Memory storage for development persistence (no file system in Edge runtime)
let memoryStorage: any[] = [];

// Get D1 database from Cloudflare runtime
function getD1Database(request: NextRequest): any {
  // Try different binding access patterns for Cloudflare Pages
  
  // Pattern 1: Direct process.env access (most common)
  if (typeof process !== 'undefined' && process.env) {
    const binding = (process.env as any).ozmevsim_d1;
    if (binding) {
      console.log('🎯 Found binding in process.env.ozmevsim_d1');
      return binding;
    }
  }
  
  // Pattern 2: globalThis access
  if (typeof globalThis !== 'undefined') {
    const binding1 = (globalThis as any).ozmevsim_d1;
    const binding2 = (globalThis as any).DB;
    if (binding1) {
      console.log('🎯 Found binding in globalThis.ozmevsim_d1');
      return binding1;
    }
    if (binding2) {
      console.log('🎯 Found binding in globalThis.DB');
      return binding2;
    }
  }
  
  // Pattern 3: Check for cloudflare runtime
  if (typeof window === 'undefined' && typeof global !== 'undefined') {
    const binding = (global as any).ozmevsim_d1;
    if (binding) {
      console.log('🎯 Found binding in global.ozmevsim_d1');
      return binding;
    }
  }
  
  return null;
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API /products called');
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status') || 'active';

    // Try different binding access methods for Cloudflare Pages
    let db = null;
    
    // Method 1: Direct process.env
    if (typeof process !== 'undefined' && process.env) {
      console.log('🔍 Checking process.env...');
      db = (process.env as any).ozmevsim_d1;
      if (db) console.log('🎯 Found DB in process.env.ozmevsim_d1');
    }
    
    // Method 2: globalThis
    if (!db && typeof globalThis !== 'undefined') {
      console.log('🔍 Checking globalThis...');
      db = (globalThis as any).ozmevsim_d1 || (globalThis as any).DB;
      if (db) console.log('🎯 Found DB in globalThis');
    }
    
    console.log('🔍 Final DB status:', db ? 'FOUND' : 'NULL - using memory');
    
    let allProducts: any[] = [];
    let source = 'unknown';
    
    if (db) {
      try {
        // Create database service with D1 instance
        const dbService = new DatabaseService(db);
        // Try to get from database first
        allProducts = await dbService.getProducts(status);
        source = 'database';
        console.log('✅ Products loaded from D1 database:', allProducts.length);
      } catch (dbError) {
        console.log('⚠️ D1 Database fetch failed:', dbError);
        allProducts = memoryStorage.filter(p => p.status === status);
        source = 'memory';
      }
    } else {
      // Use memory storage
      allProducts = memoryStorage.filter(p => p.status === status);
      source = 'memory';
      console.log('🔧 Using memory storage. Products:', allProducts.length);
    }
    
    // If no products found and we have memory products, use them
    if (allProducts.length === 0 && memoryStorage.length > 0) {
      allProducts = memoryStorage.filter(p => p.status === status);
      source = 'memory-fallback';
    }

    // If ID is provided, fetch single product
    if (id) {
      const numericId = parseInt(id);
      let product = null;
      
      if (!isNaN(numericId)) {
        // Try database first
        if (db) {
          try {
            const dbService = new DatabaseService(db);
            product = await dbService.getProduct(numericId);
          } catch (dbError) {
            console.log('Database single product fetch failed:', dbError);
          }
        }
        
        // If not found in database, check memory
        if (!product) {
          console.log('🔍 Searching in memory for ID:', id, 'numericId:', numericId);
          console.log('🔍 Memory products:', memoryStorage.map(p => ({ id: p.id, title: p.title })));
          product = memoryStorage.find(p => p.id === numericId || p.id.toString() === id);
          console.log('🔍 Found product:', product ? product.title : 'NOT FOUND');
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
        features: (() => {
          try {
            if (typeof product.features === 'string') {
              return JSON.parse(product.features);
            } else if (Array.isArray(product.features)) {
              return product.features;
            }
            return [];
          } catch (e) {
            console.log('⚠️ Invalid features JSON for product:', product.id, product.features);
            return Array.isArray(product.features) ? product.features : [];
          }
        })(),
        specifications: (() => {
          try {
            if (typeof product.specifications === 'string') {
              return JSON.parse(product.specifications);
            } else if (typeof product.specifications === 'object') {
              return product.specifications;
            }
            return {};
          } catch (e) {
            console.log('⚠️ Invalid specifications JSON for product:', product.id);
            return {};
          }
        })(),
      };

      return NextResponse.json({
        success: true,
        data: processedProduct,
        source: source
      });
    }

    // Parse JSON fields for all products
    const processedProducts = allProducts.map((product: any) => ({
      ...product,
      features: (() => {
        try {
          if (typeof product.features === 'string') {
            return JSON.parse(product.features);
          } else if (Array.isArray(product.features)) {
            return product.features;
          }
          return [];
        } catch (e) {
          console.log('⚠️ Invalid features JSON for product:', product.id, product.features);
          return Array.isArray(product.features) ? product.features : [];
        }
      })(),
      specifications: (() => {
        try {
          if (typeof product.specifications === 'string') {
            return JSON.parse(product.specifications);
          } else if (typeof product.specifications === 'object') {
            return product.specifications;
          }
          return {};
        } catch (e) {
          console.log('⚠️ Invalid specifications JSON for product:', product.id);
          return {};
        }
      })(),
    }));

    return NextResponse.json({
      success: true,
      data: processedProducts,
      source: source
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

    // Get D1 database from runtime
    let db = getD1Database(request);
    
    const newProduct = {
      id: Date.now(), // Simple ID generation
      title,
      description,
      price: price || 0,
      image_url: image_url || '/uploads/placeholder.jpg',
      all_images: all_images || '[]',
      category: category || 'general',
      brand: brand || '',
      model: model || '',
      features: Array.isArray(features) ? JSON.stringify(features) : (features || '[]'),
      specifications: typeof specifications === 'object' ? JSON.stringify(specifications) : (specifications || '{}'),
      status: status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (db) {
      try {
        const dbService = new DatabaseService(db);
        const result = await dbService.createProduct(newProduct);
        if (result.success) {
          console.log('✅ Product added to D1 database');
          return NextResponse.json({ success: true, data: { ...newProduct, id: result.id } });
        } else {
          console.log('❌ D1 database insert failed:', result.error);
          // Fall back to memory storage
        }
      } catch (dbError) {
        console.log('❌ D1 database error:', dbError);
        // Fall back to memory storage
      }
    }

    // Memory storage fallback
    memoryStorage.push(newProduct);
    console.log('✅ Product added to memory storage. Total products:', memoryStorage.length);

    return NextResponse.json({
      success: true,
      data: newProduct
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

    // Get D1 database from runtime
    let db = getD1Database(request);

    const updatedProduct = {
      title,
      description,
      price: price || 0,
      image_url: image_url || '/uploads/placeholder.jpg',
      all_images: all_images || '[]',
      category: category || 'general',
      brand: brand || '',
      model: model || '',
      features: Array.isArray(features) ? JSON.stringify(features) : features || '[]',
      specifications: typeof specifications === 'object' ? JSON.stringify(specifications) : specifications || '{}',
      status: status || 'active'
    };

    let updatedInDatabase = false;

    if (db) {
      try {
        const dbService = new DatabaseService(db);
        const result = await dbService.updateProduct(parseInt(id), updatedProduct);
        if (result.success) {
          console.log('✅ Product updated in database:', id);
          updatedInDatabase = true;
        }
      } catch (dbError) {
        console.log('⚠️ Database update failed:', dbError);
      }
    }

    // Update in memory storage
    const productIndex = memoryStorage.findIndex(p => p.id === parseInt(id));
    if (productIndex !== -1) {
      memoryStorage[productIndex] = { 
        ...memoryStorage[productIndex], 
        ...updatedProduct,
        updated_at: new Date().toISOString()
      };
      console.log('✅ Product updated in memory storage');
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      id: id,
      source: updatedInDatabase ? 'database+memory' : 'memory'
    });

  } catch (error: any) {
    console.error('Products PUT API Error:', error);
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

    // Get D1 database from runtime
    let db = getD1Database(request);

    let deletedFromDatabase = false;

    if (db) {
      try {
        const dbService = new DatabaseService(db);
        const result = await dbService.deleteProduct(parseInt(id));
        if (result.success) {
          console.log('✅ Product deleted from database:', id);
          deletedFromDatabase = true;
        }
      } catch (dbError) {
        console.log('⚠️ Database delete failed:', dbError);
      }
    }

    // Delete from memory storage
    const productIndex = memoryStorage.findIndex(p => p.id === parseInt(id));
    if (productIndex !== -1) {
      memoryStorage.splice(productIndex, 1);
      console.log('✅ Product deleted from memory storage');
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      source: deletedFromDatabase ? 'database+memory' : 'memory'
    });

  } catch (error: any) {
    console.error('Products DELETE API Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 