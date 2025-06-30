'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  CheckCircleIcon, 
  TagIcon, 
  StarIcon,
  ShoppingCartIcon,
  ShieldCheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { getProducts, getProductById } from '@/lib/data';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface ProductDetailClientProps {
  productId?: string;
  initialProduct?: any;
  product?: any;
}

interface Product {
  id: number;
  name: string;
  title?: string;
  description: string;
  image: string;
  image_url?: string;
  category: string;
  brand: string;
  features: string[];
  isActive: boolean;
  featured?: boolean;
  specifications?: Record<string, string>;
  status?: string;
  price?: number;
}

export default function ProductDetailClient({ productId, initialProduct, product: externalProduct }: ProductDetailClientProps) {
  // Get productId with fallback
  const id = productId || (externalProduct?.id?.toString()) || '1';
  // Transform initial product data immediately if available
  const getInitialProductState = () => {
    if (!initialProduct) return null;
    
    return {
      id: initialProduct.id,
      name: initialProduct.title || initialProduct.name || 'Ürün Adı',
      title: initialProduct.title,
      description: initialProduct.description || 'Açıklama bulunmuyor.',
      image: (() => {
        // Prioritize all_images field for multiple images support
        try {
          if (initialProduct.all_images) {
            const allImages = typeof initialProduct.all_images === 'string' 
              ? JSON.parse(initialProduct.all_images)
              : initialProduct.all_images;
            if (Array.isArray(allImages) && allImages.length > 0) {
              return allImages[0]; // Use first image as main image
            }
          }
        } catch (error) {
          console.warn('Error parsing all_images:', error);
        }
        // Fallback to original image fields
        return initialProduct.image_url || initialProduct.image || '/images/products/placeholder.jpg';
      })(),
      image_url: initialProduct.image_url,
      category: initialProduct.category || 'Genel',
      brand: initialProduct.brand || 'Marka',
      features: (() => {
        try {
          if (!initialProduct.features) return ['Yüksek kalite', 'Güvenilir', 'Uzun ömürlü'];
          
          if (typeof initialProduct.features === 'string') {
            // Handle empty array string
            if (initialProduct.features === '[]' || initialProduct.features === '') {
              return ['Yüksek kalite', 'Güvenilir', 'Uzun ömürlü'];
            }
            
            // Try to parse JSON array
            try {
              const parsed = JSON.parse(initialProduct.features);
              if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
              }
            } catch (parseError) {
              console.warn('🚨 Features JSON parse error:', parseError);
              console.log('🔍 Features raw value:', initialProduct.features);
              
              // If it's a stringified array that looks like "[item1, item2]", try to handle it
              if (initialProduct.features.startsWith('[') && initialProduct.features.endsWith(']')) {
                const content = initialProduct.features.slice(1, -1);
                if (content.trim()) {
                                     // Split by comma and clean up quotes
                   const items = content.split(',').map((item: string) => 
                     item.trim().replace(/^['"]|['"]$/g, '')
                   ).filter((item: string) => item.length > 0);
                  if (items.length > 0) {
                    return items;
                  }
                }
              }
            }
            
            return ['Yüksek kalite', 'Güvenilir', 'Uzun ömürlü'];
          }
          
          if (Array.isArray(initialProduct.features)) {
            return initialProduct.features.length > 0 ? initialProduct.features : ['Yüksek kalite', 'Güvenilir', 'Uzun ömürlü'];
          }
          
          return ['Yüksek kalite', 'Güvenilir', 'Uzun ömürlü'];
        } catch (error) {
          console.warn('🚨 Error processing features:', error);
          return ['Yüksek kalite', 'Güvenilir', 'Uzun ömürlü'];
        }
      })(),
      specifications: (() => {
        try {
          if (!initialProduct.specifications) return { 'Garanti': '2 yıl', 'Kurulum': 'Ücretsiz' };
          if (typeof initialProduct.specifications === 'string') {
                         if (initialProduct.specifications === '{}' || initialProduct.specifications === '') return { 'Garanti': '2 yıl', 'Kurulum': 'Ücretsiz' };
             const parsed = JSON.parse(initialProduct.specifications);
             
             // Handle both object format and array format from database
             if (Array.isArray(parsed)) {
               // Convert array of {key, value} objects to key-value pairs
               const converted: Record<string, string> = {};
               parsed.forEach((item: any) => {
                 if (item && typeof item === 'object' && item.key && item.value) {
                   converted[item.key] = item.value;
                 }
               });
               return Object.keys(converted).length > 0 ? converted : { 'Garanti': '2 yıl', 'Kurulum': 'Ücretsiz' };
             }
             
             return typeof parsed === 'object' && parsed !== null ? parsed : { 'Garanti': '2 yıl', 'Kurulum': 'Ücretsiz' };
          }
          if (typeof initialProduct.specifications === 'object' && initialProduct.specifications !== null) {
            return initialProduct.specifications;
          }
          return { 'Garanti': '2 yıl', 'Kurulum': 'Ücretsiz' };
        } catch (error) {
          console.warn('🚨 Error parsing specifications:', error);
          return { 'Garanti': '2 yıl', 'Kurulum': 'Ücretsiz' };
        }
      })(),
      isActive: initialProduct.status === 'active',
      status: initialProduct.status,
      featured: initialProduct.featured || false,
      price: initialProduct.price || 0
    } as Product;
  };

  const [product, setProduct] = useState<Product | null>(getInitialProductState());
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(!initialProduct); // Don't show loading if we have initial data
  const [selectedTab, setSelectedTab] = useState('features');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    // If we have initial product data, just log it (data is already in state)
    if (initialProduct && product) {
      console.log('🔍 ProductDetailClient - Using initial product data:', initialProduct);
      console.log('🔍 ProductDetailClient - Transformed product:', product);
      return;
    }
  }, [initialProduct, product]);

  useEffect(() => {
    // Always fetch from API to get the latest data
    const loadProductData = async () => {
      try {
        setIsLoading(true);
        console.log('🔍 ProductDetailClient - Loading product ID:', id);
        console.log('🔍 ProductDetailClient - Current URL:', window.location.href);
        
        // Use individual product API endpoint
        const apiUrl = `/api/products/${id}`;
        console.log('🔍 Making API request to:', apiUrl);
        const response = await fetch(apiUrl);
        console.log('🔍 API response status:', response.status);
        console.log('🔍 API response URL:', response.url);
        if (!response.ok) {
          console.error('❌ API request failed with status:', response.status);
          throw new Error(`API request failed: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('🔍 ProductDetailClient - API response:', result);
        
        if (result.success && result.data) {
          // Individual API returns single product directly
          const rawProductData = result.data;
          console.log('🔍 ProductDetailClient - Raw product data:', rawProductData);
          
          if (rawProductData) {
            // Transform API data to component format
            const productData: Product = {
              id: rawProductData.id,
              name: rawProductData.title || rawProductData.name || 'Ürün Adı',
              title: rawProductData.title,
              description: rawProductData.description || 'Açıklama bulunmuyor.',
              image: (() => {
                // Prioritize all_images field for multiple images support
                try {
                  if (rawProductData.all_images) {
                    const allImages = typeof rawProductData.all_images === 'string' 
                      ? JSON.parse(rawProductData.all_images)
                      : rawProductData.all_images;
                    if (Array.isArray(allImages) && allImages.length > 0) {
                      return allImages[0]; // Use first image as main image
                    }
                  }
                } catch (error) {
                  console.warn('Error parsing all_images:', error);
                }
                // Fallback to original image fields
                return rawProductData.image_url || rawProductData.image || '/images/products/placeholder.jpg';
              })(),
              image_url: rawProductData.image_url,
              category: rawProductData.category || 'Genel',
              brand: rawProductData.brand || 'Marka',
              features: (() => {
                try {
                  if (!rawProductData.features) return ['Yüksek kalite', 'Güvenilir', 'Uzun ömürlü'];
                  
                  if (typeof rawProductData.features === 'string') {
                    // Handle empty array string
                    if (rawProductData.features === '[]' || rawProductData.features === '') {
                      return ['Yüksek kalite', 'Güvenilir', 'Uzun ömürlü'];
                    }
                    
                    // Try to parse JSON array
                    try {
                      const parsed = JSON.parse(rawProductData.features);
                      if (Array.isArray(parsed) && parsed.length > 0) {
                        return parsed;
                      }
                    } catch (parseError) {
                      console.warn('🚨 Features JSON parse error:', parseError);
                      console.log('🔍 Features raw value:', rawProductData.features);
                      
                      // If it's a stringified array that looks like "[item1, item2]", try to handle it
                      if (rawProductData.features.startsWith('[') && rawProductData.features.endsWith(']')) {
                        const content = rawProductData.features.slice(1, -1);
                        if (content.trim()) {
                          // Split by comma and clean up quotes
                          const items = content.split(',').map((item: string) => 
                            item.trim().replace(/^['"]|['"]$/g, '')
                          ).filter((item: string) => item.length > 0);
                          if (items.length > 0) {
                            return items;
                          }
                        }
                      }
                    }
                    
                    return ['Yüksek kalite', 'Güvenilir', 'Uzun ömürlü'];
                  }
                  
                  if (Array.isArray(rawProductData.features)) {
                    return rawProductData.features.length > 0 ? rawProductData.features : ['Yüksek kalite', 'Güvenilir', 'Uzun ömürlü'];
                  }
                  
                  return ['Yüksek kalite', 'Güvenilir', 'Uzun ömürlü'];
                } catch (error) {
                  console.warn('🚨 Error processing features:', error);
                  return ['Yüksek kalite', 'Güvenilir', 'Uzun ömürlü'];
                }
              })(),
              specifications: (() => {
                try {
                  if (!rawProductData.specifications) return { 'Garanti': '2 yıl', 'Kurulum': 'Ücretsiz' };
                  if (typeof rawProductData.specifications === 'string') {
                                         if (rawProductData.specifications === '{}' || rawProductData.specifications === '') return { 'Garanti': '2 yıl', 'Kurulum': 'Ücretsiz' };
                     const parsed = JSON.parse(rawProductData.specifications);
                     
                     // Handle both object format and array format from database
                     if (Array.isArray(parsed)) {
                       // Convert array of {key, value} objects to key-value pairs
                       const converted: Record<string, string> = {};
                       parsed.forEach((item: any) => {
                         if (item && typeof item === 'object' && item.key && item.value) {
                           converted[item.key] = item.value;
                         }
                       });
                       return Object.keys(converted).length > 0 ? converted : { 'Garanti': '2 yıl', 'Kurulum': 'Ücretsiz' };
                     }
                     
                     return typeof parsed === 'object' && parsed !== null ? parsed : { 'Garanti': '2 yıl', 'Kurulum': 'Ücretsiz' };
                  }
                  if (typeof rawProductData.specifications === 'object' && rawProductData.specifications !== null) {
                    return rawProductData.specifications;
                  }
                  return { 'Garanti': '2 yıl', 'Kurulum': 'Ücretsiz' };
                } catch (error) {
                  console.warn('🚨 Error parsing specifications:', error);
                  return { 'Garanti': '2 yıl', 'Kurulum': 'Ücretsiz' };
                }
              })(),
              isActive: rawProductData.status === 'active',
              status: rawProductData.status,
              featured: rawProductData.featured || false,
              price: rawProductData.price || 0
            };
            
            console.log('🔍 ProductDetailClient - Transformed product:', productData);
            setProduct(productData);
            
            // Set empty related products for now (would need separate API call)
            setRelatedProducts([]);
          } else {
            console.error('❌ Product not found for ID:', id);
          }
        } else {
          console.error('❌ API response indicates failure:', result);
        }
      } catch (error) {
        console.error('❌ Error loading product:', error);
        console.error('❌ Product ID that failed:', id);
        // Set a fallback product to prevent infinite loading
        const fallbackProduct: Product = {
          id: parseInt(id),
          name: `Ürün ${productId}`,
          title: `Ürün ${productId}`,
          description: 'Bu ürün hakkında detaylı bilgi için lütfen bizimle iletişime geçin.',
          image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&h=600&fit=crop',
          category: 'Genel',
          brand: 'Öz Mevsim',
          features: ['Yüksek kalite', 'Güvenilir', 'Uzun ömürlü', 'Profesyonel kurulum'],
          specifications: { 'Garanti': '2 yıl', 'Kurulum': 'Ücretsiz', 'Servis': '7/24' },
          isActive: true,
          featured: false,
          price: 0
        };
        setProduct(fallbackProduct);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductData();
  }, [id]);

  // WhatsApp redirect function
  const handleWhatsAppRedirect = (productName: string) => {
    const phoneNumber = '+905324467367'; // WhatsApp number
    const message = `Merhaba! ${productName} ürünü için teklif almak istiyorum. Detaylı bilgi verir misiniz?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-32 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Ürün yükleniyor...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-32 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Ürün Bulunamadı</h1>
            <p className="text-gray-600 mb-8">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Ürünlere Dön
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const tabs = [
    { id: 'features', name: 'Özellikler', icon: CheckCircleIcon },
    { id: 'specs', name: 'Teknik Özellikler', icon: TagIcon },
    { id: 'warranty', name: 'Garanti & Servis', icon: ShieldCheckIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Content with proper top margin for fixed header */}
      <div className="page-content">
        {/* Breadcrumb */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Ana Sayfa
              </Link>
              <span className="text-gray-400">/</span>
              <Link
                href="/urunler"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Ürünler
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Product Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div 
                className="aspect-square bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer group relative"
                onClick={() => setIsImageModalOpen(true)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-contain p-8 w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                {/* Zoom overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-3">
                    <MagnifyingGlassIcon className="h-6 w-6 text-gray-700" />
                  </div>
                </div>
                {/* Click hint */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-white bg-opacity-90 text-gray-700 text-xs px-2 py-1 rounded">
                    Büyütmek için tıkla
                  </span>
                </div>
              </div>
              {product.featured && (
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                  Öne Çıkan
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Brand & Category */}
              <div className="flex items-center gap-2 mb-4">
                <TagIcon className="h-5 w-5 text-gray-400" />
                <span className="text-lg text-gray-600 font-medium">{product.brand}</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500">{product.category}</span>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">(4.5) • 127 değerlendirme</span>
              </div>

              {/* Description */}
              <p className="text-lg text-gray-700 mb-6">
                {product.description}
              </p>

              {/* Stock Status */}
              <div className="mb-8">
                <div className="text-sm text-green-600 font-medium">
                  ✓ Stokta mevcut • Ücretsiz kargo
                </div>
              </div>

              {/* Quick Features */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {product.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => handleWhatsAppRedirect(product.name)}
                  className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  Teklif Al
                </button>
                <button className="bg-gray-100 text-gray-700 px-6 py-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  Favorilere Ekle
                </button>
              </div>

              {/* Contact Info */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Ücretsiz Danışmanlık</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Uzman ekibimizden ürün hakkında detaylı bilgi alın.
                </p>
                <div className="flex gap-3">
                  <a
                    href="tel:+903123570600"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Hemen Ara
                  </a>
                  <Link
                    href="/iletisim"
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium border border-blue-200"
                  >
                    Mesaj Gönder
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Product Details Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            {/* Tab Navigation */}
            <div className="flex gap-1 mb-8 bg-gray-100 p-1 rounded-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                    selectedTab === tab.id
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              {selectedTab === 'features' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Ürün Özellikleri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTab === 'specs' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Teknik Özellikler</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {product.specifications && typeof product.specifications === 'object' && Object.entries(product.specifications).map(([key, value], index) => {
                      // Skip invalid entries that show as [object Object]
                      if (typeof value === 'object' && value !== null) {
                        return null;
                      }
                      if (key === 'length' || typeof key === 'number') {
                        return null;
                      }
                      return (
                        <div key={`spec-${index}-${key}`} className="flex justify-between items-center py-3 border-b border-gray-100">
                          <span className="font-medium text-gray-600">{String(key)}</span>
                          <span className="text-gray-900">{String(value)}</span>
                        </div>
                      );
                    }).filter(Boolean)}
                    {(!product.specifications || typeof product.specifications !== 'object' || Object.keys(product.specifications).length === 0) && (
                      <p className="text-gray-500 col-span-2">Teknik özellikler henüz eklenmemiş.</p>
                    )}
                  </div>
                </div>
              )}

              {selectedTab === 'warranty' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Garanti & Servis</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Garanti Kapsamı</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center gap-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                          2 yıl üretici garantisi
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                          Ücretsiz kurulum hizmeti
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                          24/7 teknik destek
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                          Orijinal yedek parça garantisi
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Servis Ağı</h4>
                      <p className="text-gray-700">
                        Ankara genelinde geniş servis ağımız ile hızlı ve güvenilir servis hizmeti sunuyoruz.
                        Acil durumlar için 7/24 çağrı merkezimiz hizmetinizdedir.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Benzer Ürünler</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/urunler/${relatedProduct.id}`}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                  >
                    <div className="relative h-48 bg-gray-100">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300 w-full h-full"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-600 font-medium">{relatedProduct.brand}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <div className="text-sm text-green-600 font-medium">
                        ✓ Stokta
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsImageModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-4xl max-h-[90vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 z-10 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-full p-2 transition-all duration-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              {/* Product info overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-10 bg-black bg-opacity-60 text-white p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                <p className="text-gray-300 text-sm">{product.brand} • {product.category}</p>
              </div>

              {/* Image container */}
              <div className="w-full h-full bg-white rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 