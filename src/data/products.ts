// Product types and interfaces
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  image: string;
  features: string[];
  specifications: Record<string, string>;
  inStock: boolean;
  featured: boolean;
  tags: string[];
}

// NO STATIC PRODUCTS - All product data comes from D1 database
export const products: Product[] = [];

// Helper functions that now work with empty array
export const getProductsByCategory = (category: string) => {
  console.warn('Static product functions deprecated - use D1 database API instead');
  return [];
};

export const getProductsByBrand = (brand: string) => {
  console.warn('Static product functions deprecated - use D1 database API instead');
  return [];
};

export const getFeaturedProducts = () => {
  console.warn('Static product functions deprecated - use D1 database API instead');
  return [];
};

export const getProductById = (id: string) => {
  console.warn('Static product functions deprecated - use D1 database API instead');
  return null;
};

export const getAllBrands = () => {
  console.warn('Static product functions deprecated - use D1 database API instead');
  return [];
};

export const getAllCategories = () => {
  console.warn('Static product functions deprecated - use D1 database API instead');
  return [];
};

export const categories = [
  'Tümü',
  'Kombi',
  'Klima',
  'Isı Pompası', 
  'Su Isıtıcısı'
];

export const brands = [
  'Tümü',
  'Bosch',
  'DemirDöküm',
  'Vaillant', 
  'Buderus',
  'Baymak',
  'ECA'
];

export const searchProducts = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.brand.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}; 