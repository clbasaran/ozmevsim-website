'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShoppingCartIcon,
  StarIcon,
  TagIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { getFeaturedProducts, categories } from '@/data/products';

interface Product {
  id: number;
  title: string;
  name: string;
  description: string;
  image_url: string;
  image: string;
  category: string;
  brand: string;
  features: string[] | string;
  specifications: string;
  status: string;
  price?: number;
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

const ProductsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [filteredFeaturedProducts, setFilteredFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load products from D1 database API - same as /urunler page
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        console.log('🔄 ProductsSection: Fetching products from API...');
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.success && result.data) {
          // Show max 6 products on homepage
          const products = result.data.slice(0, 6);
          
          // Transform products to match expected format - same as ProductsPageClient
          const transformedProducts = products.map((p: any) => {
            // Get image URL from all_images (prioritized) or fallback to image_url
            let imageUrl = '';
            try {
              if (p.all_images && p.all_images !== '' && p.all_images !== '[]') {
                const imagesArray = JSON.parse(p.all_images);
                if (Array.isArray(imagesArray) && imagesArray.length > 0) {
                  imageUrl = imagesArray[0]; // Use first image from all_images
                }
              }
            } catch (e) {
              console.warn('Invalid all_images JSON for product:', p.id, p.all_images);
            }
            
            // Fallback to image_url if all_images is not available
            if (!imageUrl) {
              imageUrl = p.image_url;
            }

            return {
              ...p,
              name: p.title || `Ürün ${p.id}`,
              title: p.title || `Ürün ${p.id}`,
              image: getImageUrl(imageUrl),
              features: (() => {
                try {
                  if (!p.features || p.features === '' || p.features === '[]') return [];
                  return JSON.parse(p.features);
                } catch (e) {
                  console.warn('Invalid features JSON for product:', p.id, p.features);
                  return [];
                }
              })(),
              isActive: p.status === 'active'
            };
          }).filter((p: any) => p.isActive);
          
          console.log('✅ ProductsSection: Loaded products:', transformedProducts.length);
          console.log('🔍 ProductsSection - Products:', transformedProducts.map((p: any) => ({ 
            id: p.id, 
            name: p.name,
            title: p.title,
            image: p.image
          })));
          
          setFilteredFeaturedProducts(transformedProducts);
        } else {
          console.error('❌ ProductsSection: API response indicates failure:', result);
          setFilteredFeaturedProducts([]);
        }
      } catch (error) {
        console.error('❌ ProductsSection: Error loading products:', error);
        setFilteredFeaturedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // WhatsApp redirect function
  const handleWhatsAppRedirect = (productName: string) => {
    const phoneNumber = '+905324467367'; // WhatsApp number
    const message = `Merhaba! ${productName} ürünü için teklif almak istiyorum. Detaylı bilgi verir misiniz?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredProducts = selectedCategory === 'Tümü' 
    ? filteredFeaturedProducts 
    : filteredFeaturedProducts.filter(product => product?.category === selectedCategory);

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Premium Ürünlerimiz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ürünler yükleniyor...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Premium Ürünlerimiz
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dünya standartlarında kaliteli ısıtma ve soğutma sistemleri ile konforunuzu artırın.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="flex flex-wrap gap-2 bg-white rounded-lg p-2 shadow-sm">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        {filteredProducts && filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-gray-50 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name || 'Ürün'}
                    className="object-contain p-6 group-hover:scale-105 transition-transform duration-300 w-full h-full"
                    loading="lazy"
                    onError={(e) => {
                      console.log('🖼️ Image load error for:', product.image);
                      // Fallback to placeholder if image fails to load
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  {index < 3 && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Öne Çıkan
                    </div>
                  )}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full">
                      <TagIcon className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  {/* Brand & Category */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-blue-600">{product.brand || 'Marka'}</span>
                    <span className="text-sm text-gray-500">{product.category || 'Kategori'}</span>
                  </div>

                  {/* Product Name */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {product.name || 'Ürün Adı'}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {product.description || 'Açıklama bulunmuyor.'}
                  </p>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(product.features) && product.features.slice(0, 2).map((feature: string, index: number) => (
                        <span
                          key={index}
                          className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                      {Array.isArray(product.features) && product.features.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{product.features.length - 2} özellik
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">(4.5)</span>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-sm text-green-600 font-medium">
                      ✓ Stokta
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link
                      href={`/urunler/${product.id}`}
                      onClick={() => console.log('🔗 Clicking product link from homepage:', { 
                        id: product.id, 
                        name: product.name || product.title, 
                        href: `/urunler/${product.id}`,
                        product: product 
                      })}
                      className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                    >
                      Detayları Gör
                    </Link>
                    <button
                      onClick={() => handleWhatsAppRedirect(product.name || 'Ürün')}
                      className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Products Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg group"
            >
              Tüm Ürünleri Görüntüle
              <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Henüz ürün bulunmuyor.</p>
            <Link
              href="/admin"
              className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Admin panelinden ürün ekleyebilirsiniz
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection; 