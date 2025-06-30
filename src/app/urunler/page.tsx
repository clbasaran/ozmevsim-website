import { Metadata } from 'next';
import ProductsPageClient from './ProductsPageClient';

// STATIC PAGE - Remove all dynamic and edge configurations
// export const dynamic = 'force-dynamic';  // REMOVED
// export const revalidate = 0;              // REMOVED  
// export const runtime = 'edge';            // REMOVED

export const metadata: Metadata = {
  title: 'Ürünler - Öz Mevsim',
  description: 'Kaliteli kombi, klima ve ısıtma sistemleri. DemirDöküm, Bosch ve diğer markaların resmi bayii.',
};

// No initial products - client will fetch them dynamically
function getEmptyProducts() {
  return []; // Empty array - products will be loaded client-side
}

export default function ProductsPage() {
  const emptyProducts = getEmptyProducts();
  
  return <ProductsPageClient initialProducts={emptyProducts} />;
} 