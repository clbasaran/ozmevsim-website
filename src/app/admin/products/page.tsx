'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PhotoIcon,
  TagIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

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
  price?: number;
  created_at?: string;
}

interface ProductFormData {
  title: string;
  description: string;
  image_url: string;
  category: string;
  brand: string;
  features: string[];
  specifications: Record<string, string>;
  status: 'active' | 'inactive';
  price: number;
}

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');

  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    image_url: '',
    category: 'Kombi',
    brand: '',
    features: [],
    specifications: {},
    status: 'active',
    price: 0
  });

  // Load products
  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setProducts(result.data || []);
        }
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Create or update product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        features: JSON.stringify(formData.features),
        specifications: JSON.stringify(Object.entries(formData.specifications).map(([key, value]) => ({ key, value })))
      };

      const url = editingProduct ? `/api/products?id=${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          console.log('✅ Product saved successfully:', result);
          
          // If it's a new product, automatically create its detail page
          if (!editingProduct && result.data?.id) {
            console.log('🎯 New product created with ID:', result.data.id);
            console.log('📄 Detail page will be accessible at: /urunler/' + result.data.id);
          }
          
          await loadProducts();
          setShowAddModal(false);
          setEditingProduct(null);
          resetForm();
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          await loadProducts();
        }
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      category: 'Kombi',
      brand: '',
      features: [],
      specifications: {},
      status: 'active',
      price: 0
    });
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    
    // Parse features and specifications
    let features: string[] = [];
    let specifications: Record<string, string> = {};
    
    try {
      features = JSON.parse(product.features || '[]');
    } catch (e) {
      features = [];
    }
    
    try {
      const specs = JSON.parse(product.specifications || '[]');
      if (Array.isArray(specs)) {
        specifications = specs.reduce((acc: Record<string, string>, spec: any) => {
          if (spec.key && spec.value) {
            acc[spec.key] = spec.value;
          }
          return acc;
        }, {});
      }
    } catch (e) {
      specifications = {};
    }

    setFormData({
      title: product.title,
      description: product.description,
      image_url: product.image_url,
      category: product.category,
      brand: product.brand,
      features,
      specifications,
      status: product.status,
      price: product.price || 0
    });
    setShowAddModal(true);
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesBrand = filterBrand === 'all' || product.brand === filterBrand;
    return matchesSearch && matchesCategory && matchesBrand;
  });

  // Get unique categories and brands
  const categories = Array.from(new Set(products.map(p => p.category)));
  const brands = Array.from(new Set(products.map(p => p.brand)));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BuildingStorefrontIcon className="h-8 w-8 text-blue-600" />
              Ürün Yönetimi
            </h1>
            <p className="text-gray-600 mt-2">Ürünleri ekleyin, düzenleyin ve yönetin</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingProduct(null);
              setShowAddModal(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Yeni Ürün Ekle
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Ürün veya marka ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tüm Kategoriler</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tüm Markalar</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            <FunnelIcon className="h-4 w-4 mr-2" />
            {filteredProducts.length} ürün gösteriliyor
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-lg shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Ürünler yükleniyor...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center">
            <BuildingStorefrontIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Henüz ürün eklenmemiş</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marka</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiyat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={product.image_url || '/images/placeholder.jpg'}
                            alt={product.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.brand}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status === 'active' ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.price ? `₺${product.price.toLocaleString()}` : 'Fiyat girilmemiş'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => window.open(`/urunler/${product.id}`, '_blank')}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Görüntüle"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(product)}
                        className="text-yellow-600 hover:text-yellow-900 p-1"
                        title="Düzenle"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Sil"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <form onSubmit={handleSaveProduct} className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ürün Adı *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Örn: Bosch Condens 8300iW"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Açıklama *
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ürün açıklaması..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kategori *
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Kombi">Kombi</option>
                        <option value="Klima">Klima</option>
                        <option value="Radyatör">Radyatör</option>
                        <option value="Isı Pompası">Isı Pompası</option>
                        <option value="Şofben">Şofben</option>
                        <option value="Elektrikli Isıtıcı">Elektrikli Isıtıcı</option>
                        <option value="Test">Test</option>
                        <option value="MCP Test">MCP Test</option>
                        <option value="File Test">File Test</option>
                        <option value="Live Test">Live Test</option>
                        <option value="Web Eval">Web Eval</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Marka *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Örn: Bosch"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Görsel URL
                    </label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg veya /uploads/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fiyat (₺)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Özellikler (her satıra bir özellik)
                    </label>
                    <textarea
                      value={formData.features.join('\n')}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        features: e.target.value.split('\n').filter(f => f.trim() !== '') 
                      })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Yüksek verimlilik&#10;Akıllı kontrol&#10;2 yıl garanti"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teknik Özellikler (Anahtar: Değer formatında)
                    </label>
                    <textarea
                      value={Object.entries(formData.specifications).map(([key, value]) => `${key}: ${value}`).join('\n')}
                      onChange={(e) => {
                        const specs: Record<string, string> = {};
                        e.target.value.split('\n').forEach(line => {
                          const [key, ...valueParts] = line.split(':');
                          if (key && valueParts.length > 0) {
                            specs[key.trim()] = valueParts.join(':').trim();
                          }
                        });
                        setFormData({ ...formData, specifications: specs });
                      }}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Güç: 24 kW&#10;Verim: %109&#10;Boyutlar: 40x60x80 cm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Durum
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Aktif</option>
                      <option value="inactive">Pasif</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingProduct ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProductsPage;