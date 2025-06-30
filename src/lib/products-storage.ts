// Shared in-memory product storage
// In production, this would connect to Cloudflare D1 database

interface Product {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  brand: string;
  features: string;
  specifications: string;
  status: 'active' | 'inactive';
  price: number;
  created_at: string;
  updated_at?: string;
}

// Global shared product storage
const products: Product[] = [
  {
    id: 1,
    title: 'Bosch Condens 8300iW',
    description: 'Yoğuşmalı kombi sistemi - A sınıfı verimlilik ve akıllı kontrol',
    image_url: '/uploads/products/bosch/bosch-condens-8300iw.png',
    category: 'Kombi',
    brand: 'Bosch',
    features: JSON.stringify(['Yoğuşmalı teknoloji', 'A sınıfı verimlilik', 'Akıllı kontrol']),
    specifications: JSON.stringify([{ key: 'Güç', value: '24 kW' }, { key: 'Verim', value: '%109' }]),
    status: 'active',
    price: 15000,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'DemirDöküm Nitromix',
    description: 'Türkiye üretimi kaliteli kombi - Uzun ömürlü ve güvenilir',
    image_url: '/uploads/products/demirdokum/demirdokum-nitromix-kombi.png',
    category: 'Kombi',
    brand: 'DemirDöküm',
    features: JSON.stringify(['Nitro teknolojisi', 'Türk malı', 'Uzun ömürlü']),
    specifications: JSON.stringify([{ key: 'Güç', value: '24 kW' }, { key: 'Enerji Sınıfı', value: 'B' }]),
    status: 'active',
    price: 12000,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Vaillant EcoTec Plus',
    description: 'Avrupa kalitesi kombi sistemi - Premium seri',
    image_url: '/uploads/products/vaillant/vaillant-ecotec-plus.png',
    category: 'Kombi',
    brand: 'Vaillant',
    features: JSON.stringify(['Avrupa kalitesi', 'Premium seri', 'Sessiz çalışma']),
    specifications: JSON.stringify([{ key: 'Güç', value: '28 kW' }, { key: 'Verim', value: '%108' }]),
    status: 'active',
    price: 18000,
    created_at: new Date().toISOString()
  }
];

let nextId = 4; // For auto-incrementing IDs

export class ProductsStorage {
  // Get all products
  static getAll(): Product[] {
    return products;
  }

  // Get product by ID
  static getById(id: number): Product | undefined {
    return products.find(p => p.id === id);
  }

  // Create new product
  static create(productData: Omit<Product, 'id' | 'created_at'>): Product {
    const newProduct: Product = {
      id: nextId++,
      ...productData,
      created_at: new Date().toISOString()
    };

    products.push(newProduct);
    console.log('✅ Product created and added to shared storage:', newProduct);
    return newProduct;
  }

  // Update existing product
  static update(id: number, updates: Partial<Product>): Product | null {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    console.log('✅ Product updated in shared storage:', products[index]);
    return products[index];
  }

  // Delete product
  static delete(id: number): boolean {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;

    const deleted = products.splice(index, 1)[0];
    console.log('✅ Product deleted from shared storage:', deleted);
    return true;
  }

  // Get next ID
  static getNextId(): number {
    return nextId;
  }
}

export type { Product }; 