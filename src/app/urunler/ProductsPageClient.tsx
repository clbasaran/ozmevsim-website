'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Star, Tag, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface Product {
  id: number;
  title: string;
  description: string;
  image_url: string;
  all_images?: string;
  category: string;
  brand: string;
  features: string;
  specifications: string;
  status: string;
  price?: number;
}

interface ProductsPageClientProps {
  initialProducts: Product[];
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

export default function ProductsPageClient({ initialProducts }: ProductsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [selectedBrand, setSelectedBrand] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dynamicProducts, setDynamicProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch fresh data from API on component mount
  useEffect(() => {
    const loadFreshProducts = async () => {
      setIsLoading(true);
      try {
        console.log('🔄 ProductsPageClient: Fetching fresh products from API...');
        const response = await fetch('/api/products/');
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.success && result.data) {
          console.log('✅ ProductsPageClient: Loaded fresh products:', result.data.length);
          setDynamicProducts(result.data);
        } else {
          console.error('❌ ProductsPageClient: API response indicates failure:', result);
          // Keep initial products if API fails
        }
      } catch (error) {
        console.error('❌ ProductsPageClient: Error loading fresh products:', error);
        // Keep initial products if API fails
      } finally {
        setIsLoading(false);
      }
    };

    loadFreshProducts();
  }, []);

  // Transform products to match expected format
  const products = useMemo(() => {
    return dynamicProducts.map(product => {
      // Get image URL from all_images (prioritized) or fallback to image_url
      let imageUrl = '';
      try {
        if (product.all_images && product.all_images !== '' && product.all_images !== '[]') {
          const imagesArray = JSON.parse(product.all_images);
          if (Array.isArray(imagesArray) && imagesArray.length > 0) {
            imageUrl = imagesArray[0]; // Use first image from all_images
          }
        }
      } catch (e) {
        console.warn('Invalid all_images JSON for product:', product.id, product.all_images);
      }
      
      // Fallback to image_url if all_images is not available
      if (!imageUrl) {
        imageUrl = product.image_url;
      }

      return {
        id: product.id,
        name: product.title || `Ürün ${product.id}`,
        description: product.description || '',
        image: getImageUrl(imageUrl),
        category: product.category || 'Diğer',
        brand: product.brand || 'Bilinmeyen',
        features: (() => {
          try {
            if (!product.features || product.features === '' || product.features === '[]') return [];
            return JSON.parse(product.features);
          } catch (e) {
            console.warn('Invalid features JSON for product:', product.id, product.features);
            return [];
          }
        })(),
        isActive: product.status === 'active',
        featured: false,
        inStock: true
      };
    });
  }, [dynamicProducts]);

  // Get unique categories and brands from loaded products
  const categories = useMemo(() => {
    const uniqueCategories = ['Tümü', ...Array.from(new Set(products.map(p => p.category)))];
    return uniqueCategories;
  }, [products]);

  const brands = useMemo(() => {
    const uniqueBrands = ['Tümü', ...Array.from(new Set(products.map(p => p.brand)))];
    return uniqueBrands;
  }, [products]);

  // WhatsApp redirect function
  const handleWhatsAppRedirect = (productName: string) => {
    const phoneNumber = '+905324467367'; // WhatsApp number
    const message = `Merhaba! ${productName} ürünü için teklif almak istiyorum. Detaylı bilgi verir misiniz?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => p.isActive);

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'Tümü') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Brand filter
    if (selectedBrand !== 'Tümü') {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    return filtered;
  }, [selectedCategory, selectedBrand, searchQuery, products]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <Header />

      {/* Content with proper top margin to account for fixed header */}
      <div className="page-content">
        {/* Header Section with Back Button */}
        <div className="pt-40 pb-20 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors group"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Ana Sayfaya Dön</span>
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Ürünlerimiz</h1>
            <p className="text-lg text-gray-200 max-w-2xl">
              Dünya standartlarında kaliteli ısıtma ve soğutma sistemleri ile konforunuzu artırın.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-800 rounded-t-3xl mt-8">
          {/* Search and Filters Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Ürün ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-primary-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-primary-700 transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filtreler
              </button>
            </div>

            {/* Filters */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${showFilters ? 'block' : 'hidden lg:grid'}`}>
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 transition-colors"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="text-gray-900">{category}</option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marka</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 transition-colors"
                >
                  {brands.map(brand => (
                    <option key={brand} value={brand} className="text-gray-900">{brand}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{filteredProducts.length}</span> ürün bulundu
                {selectedCategory !== 'Tümü' && <span className="text-primary-600"> • {selectedCategory}</span>}
                {selectedBrand !== 'Tümü' && <span className="text-primary-600"> • {selectedBrand}</span>}
              </p>
            </div>
            
            {/* Clear Filters */}
            {(selectedCategory !== 'Tümü' || selectedBrand !== 'Tümü' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('Tümü');
                  setSelectedBrand('Tümü');
                  setSearchQuery('');
                }}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
              >
                Filtreleri Temizle
              </button>
            )}
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aradığınız kriterlere uygun ürün bulunamadı.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-contain p-4 w-full h-full"
                      loading="lazy"
                      onError={(e) => {
                        console.log('🖼️ Image load error for:', product.image);
                        // Fallback to placeholder if image fails to load
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    {product.featured && (
                      <div className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
                        Öne Çıkan
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Brand */}
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 font-medium">{product.brand}</span>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Category */}
                    <p className="text-sm text-gray-600 mb-2">{product.category}</p>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Features */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {product.features.slice(0, 2).map((feature: string, index: number) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                        {product.features.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{product.features.length - 2} özellik
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stock Status */}
                    <div className="mb-4">
                      {product.inStock ? (
                        <span className="text-sm text-green-600 font-medium">✓ Stokta</span>
                      ) : (
                        <span className="text-sm text-red-600 font-medium">✗ Stokta Yok</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/urunler/${product.id}`}
                        className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-center text-sm font-medium"
                      >
                        Detayları Gör
                      </Link>
                      <button
                        onClick={() => handleWhatsAppRedirect(product.name)}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-center text-sm font-medium"
                      >
                        Teklif Al
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
} 