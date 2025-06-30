// Simple data management system for website content
// In a real application, this would be connected to a database

// Import static data for production
import { getStaticData, STATIC_HERO_SLIDES, STATIC_SERVICES } from '@/data/default-data';

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  stats: Array<{ value: string; label: string }>;
  primaryCTA: { text: string; href: string };
  secondaryCTA: { text: string; href: string };
  isActive: boolean;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
  isActive: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  brand: string;
  features: string[];
  specifications?: Record<string, string>;
  isActive: boolean;
}

export interface Reference {
  id: number;
  title: string;
  description: string;
  client: string;
  location: string;
  category: string;
  completedDate: string;
  image: string;
  status: 'active' | 'inactive';
  featured: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

// Default data
const defaultHeroSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'Öz Mevsim Isı Sistemleri',
    subtitle: 'Mühendislik Çözümleri',
    description: '25 yıllık deneyimle Ankara\'da kombi, klima ve doğalgaz sistemleri kurulum hizmetleri.',
    backgroundImage: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?ixlib=rb-4.0.3',
    stats: [
      { value: '25+', label: 'Yıllık Deneyim' },
      { value: '10.000+', label: 'Mutlu Müşteri' },
      { value: '%98', label: 'Memnuniyet' },
      { value: '7/24', label: 'Destek' }
    ],
    primaryCTA: { text: 'İletişim', href: 'tel:+903123570600' },
    secondaryCTA: { text: 'Online Randevu', href: '/randevu' },
    isActive: true
  },
  {
    id: 2,
    title: 'Akıllı İklimlendirme',
    subtitle: 'IoT Teknolojisi ile',
    description: 'Cihazlarınızı uzaktan kontrol edin, enerji tasarrufu sağlayın ve konforunuzu artırın.',
    backgroundImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3',
    stats: [
      { value: '%40', label: 'Enerji Tasarrufu' },
      { value: '365', label: 'Gün Takip' },
      { value: '24/7', label: 'Monitoring' },
      { value: '100+', label: 'IoT Cihaz' }
    ],
    primaryCTA: { text: 'Keşfet', href: '/hizmetler/iot' },
    secondaryCTA: { text: 'Demo İzle', href: '/demo' },
    isActive: true
  },
  {
    id: 3,
    title: 'Enerji Verimliliği',
    subtitle: 'Sürdürülebilir Gelecek',
    description: 'Çevre dostu çözümlerle %40\'a varan tasarruf ve sürdürülebilir enerji sistemleri.',
    backgroundImage: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?ixlib=rb-4.0.3',
    stats: [
      { value: '%40', label: 'Tasarruf' },
      { value: '50+', label: 'Yeşil Proje' },
      { value: 'LEED', label: 'Sertifika' },
      { value: 'CO2-', label: 'Azaltım' }
    ],
    primaryCTA: { text: 'Danışmanlık Al', href: '/iletisim' },
    secondaryCTA: { text: 'Projeler', href: '/projeler' },
    isActive: true
  },
  {
    id: 4,
    title: 'İş Ortaklarımız',
    subtitle: 'Güvenilir Markalar',
    description: 'Dünya lideri markaların yetkili bayisi olarak kaliteli ürünler ve güvenilir hizmet sunuyoruz.',
    backgroundImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    stats: [
      { value: '6+', label: 'Global Marka' },
      { value: '1000+', label: 'Ürün Çeşidi' },
      { value: '%100', label: 'Orijinal Ürün' },
      { value: '10', label: 'Yıl Garanti' }
    ],
    primaryCTA: { text: 'Ürünleri İncele', href: '/urunler' },
    secondaryCTA: { text: 'Fiyat Al', href: '/iletisim' },
    isActive: true
  },
  {
    id: 5,
    title: 'Çevre Dostu Çözümler',
    subtitle: 'Sürdürülebilir Gelecek',
    description: 'Yenilenebilir enerji sistemleri ve çevre dostu teknolojilerle doğayı koruyoruz.',
    backgroundImage: '/uploads/SAMPLE/prasopchok-gVWHKo2D63g-unsplash.jpg',
    stats: [
      { value: '%50', label: 'Karbon Azaltım' },
      { value: 'A++', label: 'Enerji Sınıfı' },
      { value: '100+', label: 'Yeşil Proje' },
      { value: 'ISO 14001', label: 'Çevre Sertifikası' }
    ],
    primaryCTA: { text: 'Yeşil Teknolojiler', href: '/urunler' },
    secondaryCTA: { text: 'Çevre Danışmanlığı', href: '/iletisim' },
    isActive: true
  }
];

const defaultServices: Service[] = [
  {
    id: 1,
    title: 'Kombi Kurulumu',
    description: 'Profesyonel kombi kurulum ve bakım hizmetleri',
    icon: 'fire',
    features: ['Ücretsiz Keşif', 'Garanti Kapsamında', '24/7 Destek'],
    isActive: true
  },
  {
    id: 2,
    title: 'Klima Montajı',
    description: 'Tüm marka klima montaj ve servis hizmetleri',
    icon: 'snowflake',
    features: ['Hızlı Montaj', 'Temizlik Dahil', 'Garanti'],
    isActive: true
  },
  {
    id: 3,
    title: 'Doğalgaz Tesisatı',
    description: 'Güvenli doğalgaz tesisatı kurulum ve onarım',
    icon: 'flame',
    features: ['TSE Sertifikalı', 'Güvenlik Testi', 'Resmi Belge'],
    isActive: true
  }
];

// No static products - all data comes from D1 database

const defaultReferences: Reference[] = [
  {
    id: 1,
    title: 'Ankara Plaza Kombi Sistemi',
    description: 'Büyük ölçekli kombi sistemi kurulumu ve bakımı. Modern teknoloji ile enerji verimli çözüm.',
    client: 'Ankara Plaza AVM',
    location: 'Ankara, Çankaya',
    category: 'Ticari',
    completedDate: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600',
    status: 'active',
    featured: true,
    rating: 5,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: 2,
    title: 'Yeşil Vadi Sitesi Merkezi Sistem',
    description: 'Merkezi ısıtma sistemi modernizasyonu. 200 daireli sitede komple sistem yenileme.',
    client: 'Yeşil Vadi Sitesi',
    location: 'Ankara, Keçiören',
    category: 'Konut',
    completedDate: '2024-01-10',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
    status: 'active',
    featured: true,
    rating: 5,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: 3,
    title: 'Teknik Makina Fabrika Klima Sistemi',
    description: 'Endüstriyel klima sistemi kurulumu. 5000 m² alanda merkezi klima sistemi.',
    client: 'Teknik Makina Ltd.',
    location: 'Ankara, Ostim',
    category: 'Endüstriyel',
    completedDate: '2024-01-05',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600',
    status: 'active',
    featured: true,
    rating: 5,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-15'
  },
  {
    id: 4,
    title: 'Çankaya Belediyesi Hizmet Binası',
    description: 'Belediye hizmet binasında kombi ve radyatör sistemi kurulumu.',
    client: 'Çankaya Belediyesi',
    location: 'Ankara, Çankaya',
    category: 'Kamu',
    completedDate: '2023-12-20',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600',
    status: 'active',
    featured: false,
    rating: 4,
    createdAt: '2023-12-20',
    updatedAt: '2024-01-10'
  },
  {
    id: 5,
    title: 'Luxury Residence Klima Sistemi',
    description: 'Lüks konut projesinde VRF klima sistemi kurulumu ve bakımı.',
    client: 'Luxury Residence',
    location: 'Ankara, Çayyolu',
    category: 'Konut',
    completedDate: '2023-12-15',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
    status: 'active',
    featured: false,
    rating: 5,
    createdAt: '2023-12-15',
    updatedAt: '2024-01-05'
  }
];

// Data storage with localStorage support
export const STORAGE_KEYS = {
  HERO_SLIDES: 'ozmevsim_hero_slides',
  SERVICES: 'ozmevsim_services',
  PRODUCTS: 'ozmevsim_products',
  REFERENCES: 'ozmevsim_references'
};

// Initialize data from localStorage or use defaults
const initializeData = () => {
  if (typeof window === 'undefined') {
    // Server-side: use defaults
    return {
      heroSlides: [...defaultHeroSlides],
      services: [...defaultServices],
      products: [], // No static products
      references: [...defaultReferences]
    };
  }

  // Client-side: try to load from localStorage
  try {
    const storedHeroSlides = localStorage.getItem(STORAGE_KEYS.HERO_SLIDES);
    const storedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
    const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const storedReferences = localStorage.getItem(STORAGE_KEYS.REFERENCES);

    return {
      heroSlides: storedHeroSlides ? JSON.parse(storedHeroSlides) : [...defaultHeroSlides],
      services: storedServices ? JSON.parse(storedServices) : [...defaultServices],
      products: storedProducts ? JSON.parse(storedProducts) : [], // No static products
      references: storedReferences ? JSON.parse(storedReferences) : [...defaultReferences]
    };
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return {
      heroSlides: [...defaultHeroSlides],
      services: [...defaultServices],
      products: [], // No static products
      references: [...defaultReferences]
    };
  }
};

// Initialize data
const initialData = initializeData();
let heroSlides: HeroSlide[] = initialData.heroSlides;
let services: Service[] = initialData.services;
let products: Product[] = initialData.products; // Will be empty array
let references = [...initialData.references];

// Storage management with KV sync
const saveToStorage = async (key: string, data: any) => {
  try {
    // Save to localStorage for immediate UI updates
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
    
    // Sync to KV store for persistence across sessions
    if (typeof window !== 'undefined') {
      try {
        const response = await fetch('/api/data-kv', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key: key,
            data: data
          })
        });
        
        if (!response.ok) {
          console.warn('KV sync failed, using localStorage only');
        }
      } catch (error) {
        console.warn('KV sync error:', error);
      }
    }
  } catch (error) {
    console.error('Storage error:', error);
  }
};

const loadFromStorage = async (key: string, defaultValue: any) => {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    // Production check - use static data for ozmevsim.com
    const staticData = getStaticData(key);
    if (staticData) {
      return staticData;
    }

    // First try to load from KV store
    try {
      const response = await fetch(`/api/data-kv?key=${key}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          // Update localStorage with KV data
          localStorage.setItem(key, JSON.stringify(result.data));
          return result.data;
        }
      }
    } catch (kvError) {
      console.warn('KV load failed, using localStorage');
    }
    
    // Fallback to localStorage
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error('Load from storage error:', error);
    return defaultValue;
  }
};

// Hero Slides Management - REMOVED - All data must come from API/database
// export const getHeroSlides = (): HeroSlide[] => {
//   return heroSlides.filter(slide => slide.isActive);
// };

// export const getAllHeroSlides = (): HeroSlide[] => {
//   return heroSlides;
// };

export const updateHeroSlide = (id: number, updatedSlide: Partial<HeroSlide>): boolean => {
  const index = heroSlides.findIndex(slide => slide.id === id);
  if (index !== -1) {
    heroSlides[index] = { ...heroSlides[index], ...updatedSlide };
    saveToStorage(STORAGE_KEYS.HERO_SLIDES, heroSlides);
    return true;
  }
  return false;
};

export const addHeroSlide = (slide: Omit<HeroSlide, 'id'>): HeroSlide => {
  const newId = Math.max(...heroSlides.map(s => s.id), 0) + 1;
  const newSlide = { ...slide, id: newId };
  heroSlides.push(newSlide);
  saveToStorage(STORAGE_KEYS.HERO_SLIDES, heroSlides);
  return newSlide;
};

export const deleteHeroSlide = (id: number): boolean => {
  const index = heroSlides.findIndex(slide => slide.id === id);
  if (index !== -1) {
    heroSlides.splice(index, 1);
    saveToStorage(STORAGE_KEYS.HERO_SLIDES, heroSlides);
    return true;
  }
  return false;
};

// Services Management
export const getServices = (): Service[] => {
  return services.filter(service => service.isActive);
};

export const getAllServices = (): Service[] => {
  return services;
};

export const updateService = (id: number, updatedService: Partial<Service>): boolean => {
  const index = services.findIndex(service => service.id === id);
  if (index !== -1) {
    services[index] = { ...services[index], ...updatedService };
    saveToStorage(STORAGE_KEYS.SERVICES, services);
    return true;
  }
  return false;
};

export const addService = (service: Omit<Service, 'id'>): Service => {
  const newId = Math.max(...services.map(s => s.id), 0) + 1;
  const newService = { ...service, id: newId };
  services.push(newService);
  saveToStorage(STORAGE_KEYS.SERVICES, services);
  return newService;
};

export const deleteService = (id: number): boolean => {
  const index = services.findIndex(service => service.id === id);
  if (index !== -1) {
    services.splice(index, 1);
    saveToStorage(STORAGE_KEYS.SERVICES, services);
    return true;
  }
  return false;
};

// Helper function to get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    console.log('🔄 Fetching product by ID:', id);
    
    // Use absolute URL for client-side requests
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/products?id=${id}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Product API response:', result);
      
      const product = result.data || result;
      
      if (product) {
        const processedProduct = {
          id: product.id,
          name: product.title || product.name,
          description: product.description,
          image: product.image_url || product.image,
          category: product.category,
          brand: product.brand,
          features: Array.isArray(product.features) ? product.features : [],
          specifications: product.specifications || {},
          isActive: product.status === 'active'
        };
        
        console.log('✅ Processed product:', processedProduct);
        return processedProduct;
      }
    } else {
      console.error('❌ Product API failed with status:', response.status);
    }
  } catch (error) {
    console.error('❌ Error fetching product by ID:', error);
  }
  
  console.log('❌ Product not found for ID:', id);
  return null;
};

// Products Management
export const getProducts = async (): Promise<Product[]> => {
  // Always try to fetch from D1 database first
  try {
    console.log('🔄 Fetching products from D1 database...');
    
    const response = await fetch('/api/products');
    if (response.ok) {
      const result = await response.json();
      const products = result.data || result;
      
      console.log('✅ Fetched products from D1:', products.length, 'products');
      
      return products.map((product: any) => ({
        id: product.id,
        name: product.title || product.name,
        description: product.description,
        image: product.image_url || product.image,
        category: product.category,
        brand: product.brand,
        features: Array.isArray(product.features) ? product.features : [],
        specifications: product.specifications || {},
        isActive: product.status === 'active'
      }));
    } else {
      console.error('❌ D1 API failed with status:', response.status);
      throw new Error(`API failed with status ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Error fetching products from D1:', error);
    
    // Return empty array instead of fallback to static data
    console.log('📦 No products available - returning empty array');
    return [];
  }
};

// Product management functions removed - all product operations now use D1 database via API

// References API functions
export const getReferences = (): Reference[] => {
  if (typeof window === 'undefined') {
    // Server-side: return default references
    return references.filter(ref => ref.status === 'active');
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REFERENCES);
    if (stored) {
      references = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading references:', error);
  }
  return references.filter(ref => ref.status === 'active');
};

export const getAllReferences = (): Reference[] => {
  if (typeof window === 'undefined') {
    // Server-side: return default references
    return references;
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REFERENCES);
    if (stored) {
      references = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading references:', error);
  }
  return references;
};

export const getFeaturedReferences = (): Reference[] => {
  return getReferences().filter(ref => ref.featured);
};

export const addReference = (reference: Omit<Reference, 'id'>): Reference => {
  const newId = Math.max(...references.map(r => r.id), 0) + 1;
  const newReference = { ...reference, id: newId };
  references.push(newReference);
  saveToStorage(STORAGE_KEYS.REFERENCES, references);
  return newReference;
};

export const updateReference = (id: number, updates: Partial<Reference>): Reference | null => {
  const index = references.findIndex(r => r.id === id);
  if (index === -1) return null;
  
  references[index] = { ...references[index], ...updates };
  saveToStorage(STORAGE_KEYS.REFERENCES, references);
  return references[index];
};

export const deleteReference = (id: number): boolean => {
  const index = references.findIndex(r => r.id === id);
  if (index === -1) return false;
  
  references.splice(index, 1);
  saveToStorage(STORAGE_KEYS.REFERENCES, references);
  return true; 
}; 