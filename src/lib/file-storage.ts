import fs from 'fs';
import path from 'path';

// File-based storage for development (simulates database)
const STORAGE_DIR = path.join(process.cwd(), '.storage');
const PRODUCTS_FILE = path.join(STORAGE_DIR, 'products.json');

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

// Default products data
const DEFAULT_PRODUCTS: Product[] = [
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
    features: JSON.stringify(['Nitro teknolojisi', 'Türk malı', '+1 özellik']),
    specifications: JSON.stringify([{ key: 'Güç', value: '20 kW' }, { key: 'Üretim', value: 'Türkiye' }]),
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
    features: JSON.stringify(['Avrupa kalitesi', 'Premium seri', '+1 özellik']),
    specifications: JSON.stringify([{ key: 'Güç', value: '28 kW' }, { key: 'Seri', value: 'Premium' }]),
    status: 'active',
    price: 18000,
    created_at: new Date().toISOString()
  }
];

class FileStorage {
  constructor() {
    this.ensureStorageDir();
    this.initializeProducts();
  }

  private ensureStorageDir() {
    if (!fs.existsSync(STORAGE_DIR)) {
      fs.mkdirSync(STORAGE_DIR, { recursive: true });
      console.log('📁 Storage directory created:', STORAGE_DIR);
    }
  }

  private initializeProducts() {
    if (!fs.existsSync(PRODUCTS_FILE)) {
      this.saveProducts(DEFAULT_PRODUCTS);
      console.log('🔄 Products file initialized with default data');
    }
  }

  private loadProducts(): Product[] {
    try {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('❌ Error loading products:', error);
      return DEFAULT_PRODUCTS;
    }
  }

  private saveProducts(products: Product[]) {
    try {
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
      console.log('💾 Products saved to file:', products.length, 'items');
    } catch (error) {
      console.error('❌ Error saving products:', error);
    }
  }

  getAll(): Product[] {
    return this.loadProducts();
  }

  getById(id: number): Product | null {
    const products = this.loadProducts();
    return products.find(p => p.id === id) || null;
  }

  create(productData: Omit<Product, 'id' | 'created_at'>): Product {
    const products = this.loadProducts();
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    
    const newProduct: Product = {
      id: newId,
      ...productData,
      created_at: new Date().toISOString()
    };
    
    products.push(newProduct);
    this.saveProducts(products);
    
    console.log('✅ Product created with ID:', newId);
    return newProduct;
  }

  update(id: number, productData: Partial<Product>): Product | null {
    const products = this.loadProducts();
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
      return null;
    }
    
    products[index] = {
      ...products[index],
      ...productData,
      updated_at: new Date().toISOString()
    };
    
    this.saveProducts(products);
    console.log('✅ Product updated ID:', id);
    return products[index];
  }

  delete(id: number): boolean {
    const products = this.loadProducts();
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
      return false;
    }
    
    products.splice(index, 1);
    this.saveProducts(products);
    console.log('✅ Product deleted ID:', id);
    return true;
  }
}

// Global singleton instance
export const ProductStorage = new FileStorage(); 