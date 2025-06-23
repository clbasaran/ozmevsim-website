import ProductDetailClient from './ProductDetailClient';
import { createDatabaseService } from '@/lib/database';

// Generate static params for all products from D1 database
export async function generateStaticParams() {
  try {
    // Try to get products directly from database
    const dbService = createDatabaseService();
    if (dbService) {
      const products = await dbService.getProducts('active');
      return products.map((product: any) => ({
        id: product.id.toString(),
      }));
    }
  } catch (error) {
    console.error('Error generating static params:', error);
  }
  
  // Fallback: return some default product IDs
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
    { id: '10' },
    { id: '12' },
    { id: '13' },
    { id: '15' }
  ];
}

// Server-side data fetching
async function getProductData(id: string) {
  try {
    const dbService = createDatabaseService();
    if (dbService) {
      const product = await dbService.getProduct(parseInt(id));
      
      if (product) {
        // Parse JSON fields
        const processedProduct = {
          ...product,
          features: typeof product.features === 'string' ? JSON.parse(product.features) : product.features,
          specifications: typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications,
        };
        
        return processedProduct;
      }
    }
  } catch (error) {
    console.error('Error fetching product:', error);
  }
  
  // Fallback product data if database fails
  const fallbackProduct = {
    id: parseInt(id),
    title: `Ürün ${id}`,
    name: `Ürün ${id}`,
    description: 'Bu ürün hakkında detaylı bilgi için lütfen bizimle iletişime geçin.',
    image_url: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Genel',
    brand: 'Öz Mevsim',
    features: ['Yüksek kalite', 'Güvenilir', 'Uzun ömürlü', 'Profesyonel kurulum'],
    specifications: {
      'Garanti': '2 yıl',
      'Kurulum': 'Ücretsiz',
      'Servis': '7/24'
    },
    status: 'active'
  };
  
  return fallbackProduct;
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <ProductDetailClient productId={params.id} />;
} 