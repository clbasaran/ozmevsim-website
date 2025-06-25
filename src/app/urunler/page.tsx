import { Metadata } from 'next';
import ProductsPageClient from './ProductsPageClient';

export const metadata: Metadata = {
  title: 'Ürünler - Öz Mevsim',
  description: 'Kaliteli kombi, klima ve ısıtma sistemleri. DemirDöküm, Bosch ve diğer markaların resmi bayii.',
};

// Server-side data fetching for SSR with better error handling
async function getProductsData() {
  try {
    console.log('🔧 Server-side: Fetching products data');

    // Runtime API call for dynamic updates
    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://13edf8b0.ozmevsim-website.pages.dev';
    
    const response = await fetch(`${baseUrl}/products`, {
      headers: {
        'User-Agent': 'ProductsPage/1.0'
      },
      // Add cache settings but more conservative
      next: { revalidate: 300 } // Revalidate every 5 minutes 
    });

    if (!response.ok) {
      console.log('⚠️ API request failed:', response.status);
      return [];
    }

    const result = await response.json();
    if (result.success && result.data && Array.isArray(result.data)) {
      console.log('✅ Found real products data:', result.data.length, 'products');
      return result.data;
    } else {
      console.log('⚠️ API response indicates failure:', result);
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching products data:', error);
    return [];
  }
}

export default async function ProductsPage() {
  const initialProducts = await getProductsData();
  
  return <ProductsPageClient initialProducts={initialProducts} />;
} 