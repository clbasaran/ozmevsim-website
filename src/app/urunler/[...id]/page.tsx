import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

// Dynamic product pages compatible with output: export mode
export const dynamicParams = true;

interface ProductData {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  brand: string;
  features: string;
  specifications: string;
  status: string;
  price?: number;
}

// Helper function to get proper image URL
const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) {
    return 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
  }

  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // TEMPORARY FIX: Use direct /uploads/ paths instead of R2 proxy until MEDIA_BUCKET is configured
  // Convert R2 proxy URLs back to direct paths
  if (imageUrl.startsWith('/api/r2-proxy')) {
    const urlParams = new URLSearchParams(imageUrl.split('?')[1]);
    const filePath = urlParams.get('file');
    if (filePath) {
      return `/${filePath}`;
    }
  }

  // If it's a relative path starting with /uploads/, return as is
  if (imageUrl.startsWith('/uploads/')) {
    return imageUrl;
  }

  // If it's just a filename, assume it's in uploads folder
  if (!imageUrl.includes('/')) {
    return `/uploads/${imageUrl}`;
  }

  // For any other path, ensure it starts with /uploads/
  return imageUrl.startsWith('uploads/') ? `/${imageUrl}` : `/uploads/${imageUrl}`;
};

// Server-side data fetching for product details
async function getProductData(id: string) {
  try {
    console.log('🔧 Server-side: Fetching product data for ID:', id);
    
    // Try API call first for both development and production
    console.log('🔧 Attempting API call for product data');
    
    // Runtime API call - updated base URL
    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : (process.env.NEXT_PUBLIC_SITE_URL || 'https://35552196.ozmevsim-website.pages.dev');
    
    try {
      const response = await fetch(`${baseUrl}/api/products?id=${id}`, {
        headers: {
          'User-Agent': 'ProductDetailPage/1.0'
        },
        // Reduced cache time for faster updates
        next: { revalidate: 30 } // Revalidate every 30 seconds
      });

      if (response.ok) {
        console.log('✅ API response successful');
        const result = await response.json();
        if (result.success && result.data) {
          // Handle both single product and array responses
          let product;
          if (Array.isArray(result.data)) {
            // Find product by ID in array
            product = result.data.find((p: any) => p.id.toString() === id.toString());
          } else {
            // Single product response
            product = result.data;
          }
          
          if (product) {
            const processedProduct = { ...product };
            // Fix image URL
            processedProduct.image_url = getImageUrl(processedProduct.image_url);
            console.log('✅ Found real product data from API:', processedProduct.title);
            return processedProduct;
          } else {
            console.log('⚠️ Product not found in API response');
          }
        } else {
          console.log('⚠️ API response indicates failure:', result);
        }
      } else {
        console.log('⚠️ API request failed:', response.status);
      }
    } catch (apiError) {
      console.error('❌ API call failed:', apiError);
    }

    // Always fall back to static data if API call fails
    console.log('🔧 Using fallback product data for ID:', id);
    
    // Map of known product IDs to their data
    const productMap: Record<string, ProductData> = {
      '109': {
        id: 109,
        title: '🧪 TEST ÜRÜN - Admin Panel Test',
        description: 'Bu test ürünü admin panel işlevselliğini kontrol etmek için eklenmiştir. Görünüyorsa admin panel çalışıyor!',
        image_url: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        category: 'Test',
        brand: 'Test Brand',
        features: '["Test özelliği 1", "Test özelliği 2", "Admin panel testi"]',
        specifications: '[{"key":"Test Spec","value":"Admin Panel Test"}]',
        status: 'active',
        price: 999
      },
      '5': {
        id: 5,
        title: 'Nitromix',
        description: 'DemirDöküm Nitromix kombi, nitro teknolojisi ile yüksek verimlilik ve temiz yanma sağlar.',
        image_url: '/uploads/kombiler/demirdokum/nitromix.png',
        category: 'Kombi',
        brand: 'DemirDöküm',
        features: '[]',
        specifications: '[{"key":"Güç","value":"24 kW"},{"key":"Enerji Sınıfı","value":"B"}]',
        status: 'active',
        price: 0
      },
      '6': {
        id: 6,
        title: 'Nitromix Ioni',
        description: 'DemirDöküm Nitromix Ioni kombi, iyonik alev teknolojisi ile üstün performans ve enerji tasarrufu sunar.',
        image_url: '/uploads/kombiler/demirdokum/nitromix ioni.png',
        category: 'Kombi',
        brand: 'DemirDöküm',
        features: '[]',
        specifications: '[{"key":"Güç","value":"24 kW"},{"key":"Enerji Sınıfı","value":"A"}]',
        status: 'active',
        price: 0
      },
      '8': {
        id: 8,
        title: 'IsoMix',
        description: 'DemirDöküm IsoMix kombi, izolasyon teknolojisi ile enerji kaybını minimize eder.',
        image_url: '/uploads/kombiler/demirdokum/isomix.png',
        category: 'Kombi',
        brand: 'DemirDöküm',
        features: '[]',
        specifications: '[{"key":"Güç","value":"24 kW"},{"key":"Enerji Sınıfı","value":"A"}]',
        status: 'active',
        price: 0
      },
      '2': {
        id: 2,
        title: 'Condens 2200i',
        description: 'Bosch Condens 2200i akıllı kombi sistemi, modern teknoloji ve üstün performans ile öne çıkar.',
        image_url: '/uploads/kombiler/bosch/codens 2200i.png',
        category: 'Kombi',
        brand: 'Bosch',
        features: '[]',
        specifications: '[{"key":"Güç","value":"24-30 kW"},{"key":"Enerji Sınıfı","value":"A++"}]',
        status: 'active',
        price: 0
      },
      '3': {
        id: 3,
        title: 'AdemiX',
        description: 'DemirDöküm AdemiX kombi, yerli üretim kalitesi ve güvenilir performans sunar.',
        image_url: '/uploads/kombiler/demirdokum/ademiX.png',
        category: 'Kombi',
        brand: 'DemirDöküm',
        features: '[]',
        specifications: '[{"key":"Güç","value":"24 kW"},{"key":"Enerji Sınıfı","value":"B"}]',
        status: 'active',
        price: 0
      },
      '4': {
        id: 4,
        title: 'VintomiX',
        description: 'DemirDöküm VintomiX kombi, modern tasarım ve güçlü performans ile evinizde konfor sağlar.',
        image_url: '/uploads/kombiler/demirdokum/vintomiX.png',
        category: 'Kombi',
        brand: 'DemirDöküm',
        features: '[]',
        specifications: '[{"key":"Güç","value":"24 kW"},{"key":"Enerji Sınıfı","value":"B"}]',
        status: 'active',
        price: 0
      }
    };

    if (productMap[id]) {
      const product = { ...productMap[id] };
      // Fix image URL
      product.image_url = getImageUrl(product.image_url);
      console.log('🔧 Server-side: Found real product data:', product.title);
      return product;
    } else {
      console.log('🔧 Server-side: Using fallback data for product:', `Ürün ${id}`);
      return {
        id: parseInt(id),
        title: `Ürün ${id}`,
        description: `Bu ${id} numaralı ürün için detaylı bilgi yakında eklenecektir.`,
        image_url: getImageUrl('/uploads/placeholder.jpg'),
        category: 'Genel',
        brand: 'Öz Mevsim',
        features: '[]',
        specifications: '[]',
        status: 'active',
        price: 0
      };
    }
  } catch (error) {
    console.error('❌ Error fetching product data:', error);
    return null;
  }
}

// COMPLETELY DYNAMIC: No static generation, all product pages created on-demand
// This ensures that any new product added through admin panel will have a working detail page immediately
// export async function generateStaticParams() - REMOVED FOR FULL DYNAMIC SUPPORT

// Static generation for known products, dynamic rendering for new ones
export async function generateStaticParams() {
  console.log('🎯 HYBRID MODE: Static pages for known products, client-side for new ones');
  
  try {
    // Fetch existing products from API for static generation
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://ozmevsim.com'}/api/products`);
    
    if (response.ok) {
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        const productIds = result.data.map((product: any) => ({ id: [product.id.toString()] }));
        console.log('✅ Static generation for existing products:', productIds.map((p: any) => p.id[0]));
        return productIds;
      }
    }
  } catch (error) {
    console.warn('⚠️ API fetch failed, using fallback product IDs');
  }
  
  // Fallback: Generate static pages for known products
  // New products (added through admin) will be rendered client-side
  const knownProductIds = ['3', '4', '5', '6', '8', '121', '122', '123', '126', '127', '128', '129', '131'];
  console.log('📦 Static generation fallback:', knownProductIds);
  return knownProductIds.map(id => ({ id: [id] }));
}

// Generate metadata
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProductData(params.id);
  
  if (!product) {
    return {
      title: 'Ürün Bulunamadı - Öz Mevsim',
      description: 'Aradığınız ürün bulunamadı.',
    };
  }

  return {
    title: `${product.title} - Öz Mevsim`,
    description: product.description,
    openGraph: {
      title: `${product.title} - Öz Mevsim`,
      description: product.description,
      images: product.image_url ? [product.image_url] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { id: string[] } }) {
  // Extract actual ID from catch-all params
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  // Try to get product data, but don't fail if not found
  const product = await getProductData(productId);
  
  // Always render the client component - it will handle loading and 404 states
  return <ProductDetailClient productId={productId} initialProduct={product} />;
} 