import { Metadata } from 'next';
import ProductsPageClient from './ProductsPageClient';

export const metadata: Metadata = {
  title: 'Ürünler - Öz Mevsim',
  description: 'Kaliteli kombi, klima ve ısıtma sistemleri. DemirDöküm, Bosch ve diğer markaların resmi bayii.',
};

// Server-side data fetching for SSR
async function getProductsData() {
  try {
    console.log('🔧 Server-side: Fetching products data');
    
    // PRODUCTION: Always fetch from dynamic API - no more static fallback
    console.log('🔧 Production: Fetching dynamic products data from API');

    // Runtime API call for dynamic updates
    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://aab05017.ozmevsim-website.pages.dev';
    
    const response = await fetch(`${baseUrl}/api/products`, {
      headers: {
        'User-Agent': 'ProductsPage/1.0'
      },
      // Add cache settings for dynamic data
      next: { revalidate: 60 } // Revalidate every 1 minute for fresh data
    });

    if (!response.ok) {
      console.log('⚠️ API request failed:', response.status);
      // Return fallback data on API failure
      return [];
    }

    const result = await response.json();
    if (result.success && result.data) {
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