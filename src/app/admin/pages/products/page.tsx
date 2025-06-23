'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  PhotoIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  XMarkIcon,
  CheckIcon,
  StarIcon,
  CubeIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

// No longer importing static products - will fetch from D1 API

interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  subcategory: string;
  shortDescription: string;
  description: string;
  specifications: { key: string; value: string }[];
  images: string[];
  catalogPdf: string;
  price: number;
  stockStatus: 'in-stock' | 'out-of-stock' | 'limited';
  featured: boolean;
  sortOrder: number;
  status: 'active' | 'inactive';
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  subcategories: string[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Kombi',
      subcategories: ['Bosch', 'DemirDöküm', 'Vaillant', 'Buderus', 'Baymak']
    },
    {
      id: '2',
      name: 'VRF Sistemler',
      subcategories: ['İç Üniteler', 'Dış Üniteler', 'Kontrol Sistemleri']
    },
    {
      id: '3',
      name: 'Chiller Sistemler',
      subcategories: ['Su Soğutmalı', 'Hava Soğutmalı', 'Absorpsiyonlu']
    },
    {
      id: '4',
      name: 'Fan Coil Üniteler',
      subcategories: ['Duvar Tipi', 'Tavan Tipi', 'Kaset Tipi']
    }
  ]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('sortOrder');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Load products from D1 API
  const loadProductsFromAPI = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      if (data.success && data.data) {
        // Convert API products to admin format
        const adminProducts = data.data.map((product: any, index: number) => ({
          id: product.id.toString(),
          name: product.title || '',
          code: `${product.brand || 'UNKNOWN'}-${product.id}`,
          category: product.category || '',
          subcategory: product.brand || '',
          shortDescription: (product.description || '').substring(0, 100) + '...',
          description: product.description || '',
          specifications: Array.isArray(product.specifications) 
            ? product.specifications 
            : Object.entries(product.specifications || {}).map(([key, value]) => ({
                key,
                value: value as string
              })),
          images: product.image_url ? [product.image_url] : [],
          catalogPdf: '',
          price: product.price || 0,
          stockStatus: 'in-stock' as const,
          featured: false,
          sortOrder: index + 1,
          status: product.status === 'active' ? 'active' as const : 'inactive' as const,
          metaTitle: product.title || '',
          metaDescription: product.description || '',
          createdAt: product.created_at || new Date().toISOString().split('T')[0],
          updatedAt: product.updated_at || new Date().toISOString().split('T')[0]
        }));
        
        setProducts(adminProducts);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      alert('Ürünler yüklenirken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadProductsFromAPI();
  }, []);

  // Filter and search products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    const matchesStatus = !filterStatus || product.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aValue = a[sortBy as keyof Product];
    const bValue = b[sortBy as keyof Product];
    
    // Handle numeric comparisons for sortOrder and price
    if (sortBy === 'sortOrder' || sortBy === 'price') {
      const aNum = Number(aValue);
      const bNum = Number(bValue);
      if (sortOrder === 'asc') {
        return aNum - bNum;
      } else {
        return bNum - aNum;
      }
    }
    
    // Handle string comparisons
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleCreateProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: '',
      code: '',
      category: '',
      subcategory: '',
      shortDescription: '',
      description: '',
      specifications: [],
      images: [],
      catalogPdf: '',
      price: 0,
      stockStatus: 'in-stock',
      featured: false,
      sortOrder: products.length + 1,
      status: 'active',
      metaTitle: '',
      metaDescription: '',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setSelectedProduct(newProduct);
    setIsCreating(true);
    setIsEditing(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsCreating(false);
    setIsEditing(true);
  };

  const handleSaveProduct = async () => {
    if (!selectedProduct) return;

    // Validation - check required fields
    if (!selectedProduct.name || !selectedProduct.description) {
      alert('❌ Ürün adı ve açıklama zorunludur!');
      return;
    }

    if (!selectedProduct.category) {
      alert('❌ Kategori seçimi zorunludur!');
      return;
    }

    const updatedProduct = {
      ...selectedProduct,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    try {
      // Save directly to D1 database via API
      const apiData = {
        title: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
        image_url: updatedProduct.images[0] || '',
        category: updatedProduct.category,
        brand: updatedProduct.subcategory || '',
        model: '',
        features: [],
        specifications: updatedProduct.specifications.reduce((acc, spec) => {
          acc[spec.key] = spec.value;
          return acc;
        }, {} as Record<string, string>),
        status: updatedProduct.status,
        created_at: updatedProduct.createdAt,
        updated_at: updatedProduct.updatedAt
      };

      const response = await fetch('/api/products', {
        method: isCreating ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isCreating ? apiData : { ...apiData, id: updatedProduct.id })
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      const result = await response.json();
      if (result.success) {
        // Update local state
        if (isCreating) {
          setProducts([...products, { ...updatedProduct, id: result.data.id.toString() }]);
        } else {
          setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        }
        
        setIsEditing(false);
        setSelectedProduct(null);
        setIsCreating(false);
        alert('✅ Ürün başarıyla kaydedildi!');
      } else {
        throw new Error(result.error || 'Save failed');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('❌ Ürün kaydedilirken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch('/api/products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      const result = await response.json();
      if (result.success) {
        // Update local state
        setProducts(products.filter(p => p.id !== id));
        alert('✅ Ürün başarıyla silindi!');
      } else {
        throw new Error(result.error || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('❌ Ürün silinirken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    }
  };

  const addSpecification = () => {
    if (!selectedProduct) return;
    setSelectedProduct({
      ...selectedProduct,
      specifications: [...selectedProduct.specifications, { key: '', value: '' }]
    });
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    if (!selectedProduct) return;
    const updatedSpecs = [...selectedProduct.specifications];
    updatedSpecs[index] = { ...updatedSpecs[index], [field]: value };
    setSelectedProduct({ ...selectedProduct, specifications: updatedSpecs });
  };

  const removeSpecification = (index: number) => {
    if (!selectedProduct) return;
    const updatedSpecs = selectedProduct.specifications.filter((_, i) => i !== index);
    setSelectedProduct({ ...selectedProduct, specifications: updatedSpecs });
  };

  const moveSortOrder = (productId: string, direction: 'up' | 'down') => {
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) return;
    
    const newIndex = direction === 'up' ? productIndex - 1 : productIndex + 1;
    if (newIndex < 0 || newIndex >= products.length) return;
    
    const updatedProducts = [...products];
    [updatedProducts[productIndex], updatedProducts[newIndex]] = [updatedProducts[newIndex], updatedProducts[productIndex]];
    
    // Update sort orders
    updatedProducts.forEach((product, index) => {
      product.sortOrder = index + 1;
    });
    
    setProducts(updatedProducts);
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatusText = (status: string) => {
    switch (status) {
      case 'in-stock': return 'Stokta';
      case 'out-of-stock': return 'Stok Yok';
      case 'limited': return 'Sınırlı';
      default: return 'Bilinmiyor';
    }
  };

  const handleBulkExport = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ozmevsim-products-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      alert('Silmek için ürün seçin!');
      return;
    }

    if (!confirm(`${selectedProducts.length} ürünü silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      // Delete selected products one by one
      for (const productId of selectedProducts) {
        const response = await fetch('/api/products', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: productId })
        });

        if (!response.ok) {
          throw new Error(`Failed to delete product ${productId}`);
        }
      }

      // Update local state
      setProducts(products.filter(p => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
      alert('✅ Seçili ürünler başarıyla silindi!');
    } catch (error) {
      console.error('Error deleting products:', error);
      alert('❌ Ürünler silinirken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedProducts.map(p => p.id));
    }
  };

  const handleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Ürünler yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ürün Yönetimi</h1>
          <p className="text-gray-600 mt-1">
            Toplam {products.length} ürün • {filteredProducts.length} gösteriliyor
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          {selectedProducts.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              <TrashIcon className="w-4 h-4" />
              Seçilenleri Sil ({selectedProducts.length})
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            <FunnelIcon className="w-4 h-4" />
            Filtrele
          </button>
          <button
            onClick={handleBulkExport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            <DocumentArrowUpIcon className="w-4 h-4" />
            Dışa Aktar
          </button>
          <button
            onClick={handleCreateProduct}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
          >
            <PlusIcon className="w-4 h-4" />
            Yeni Ürün
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Ürün adı veya kodu ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white font-medium"
              />
            </div>
          </div>
          
          {showFilters && (
            <div className="flex flex-wrap gap-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white font-medium"
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white font-medium"
              >
                <option value="">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                  >
                    Ürün
                    {sortBy === 'name' && (
                      <ChevronDownIcon className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('category')}
                    className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                  >
                    Kategori
                    {sortBy === 'category' && (
                      <ChevronDownIcon className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('price')}
                    className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                  >
                    Fiyat
                    {sortBy === 'price' && (
                      <ChevronDownIcon className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('stockStatus')}
                    className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                  >
                    Stok
                    {sortBy === 'stockStatus' && (
                      <ChevronDownIcon className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                  >
                    Durum
                    {sortBy === 'status' && (
                      <ChevronDownIcon className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('sortOrder')}
                    className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                  >
                    Sıralama
                    {sortBy === 'sortOrder' && (
                      <ChevronDownIcon className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        {product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <CubeIcon className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {product.name}
                          {product.featured && (
                            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{product.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.category}</div>
                    <div className="text-sm text-gray-500">{product.subcategory}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.price > 0 ? `₺${product.price.toLocaleString()}` : 'Fiyat Yok'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockStatusColor(product.stockStatus)}`}>
                      {getStockStatusText(product.stockStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status === 'active' ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.sortOrder}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveSortOrder(product.id, 'up')}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="Yukarı Taşı"
                          disabled={product.sortOrder === 1}
                        >
                          <ChevronUpIcon className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => moveSortOrder(product.id, 'down')}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="Aşağı Taşı"
                          disabled={product.sortOrder === products.length}
                        >
                          <ChevronDownIcon className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-orange-600 hover:text-orange-900"
                        title="Düzenle"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Görüntüle"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Sil"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-900 font-bold">
                <span>{startIndex + 1}</span> - <span>{Math.min(startIndex + itemsPerPage, sortedProducts.length)}</span> arası,
                toplam <span>{sortedProducts.length}</span> sonuç
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border-2 border-gray-500 rounded disabled:opacity-50 bg-white text-gray-900 font-medium hover:bg-gray-100"
                >
                  Önceki
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 border-2 rounded font-medium ${
                      currentPage === page
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'border-gray-500 hover:bg-gray-100 bg-white text-gray-900'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border-2 border-gray-500 rounded disabled:opacity-50 bg-white text-gray-900 font-medium hover:bg-gray-100"
                >
                  Sonraki
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {isEditing && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsEditing(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b-2 border-gray-300 bg-gray-50 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isCreating ? 'Yeni Ürün Ekle' : 'Ürün Düzenle'}
                </h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2 font-bold">
                      Ürün Adı *
                    </label>
                    <input
                      type="text"
                      value={selectedProduct.name}
                      onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-500 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2 font-bold">
                      Ürün Kodu *
                    </label>
                    <input
                      type="text"
                      value={selectedProduct.code}
                      onChange={(e) => setSelectedProduct({...selectedProduct, code: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-500 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2 font-bold">
                      Kategori *
                    </label>
                    <select
                      value={selectedProduct.category}
                      onChange={(e) => setSelectedProduct({...selectedProduct, category: e.target.value, subcategory: ''})}
                      className="w-full px-3 py-2 border-2 border-gray-500 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                      required
                    >
                      <option value="">Kategori Seçin</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2 font-bold">
                      Alt Kategori
                    </label>
                    <select
                      value={selectedProduct.subcategory}
                      onChange={(e) => setSelectedProduct({...selectedProduct, subcategory: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-500 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                      disabled={!selectedProduct.category}
                    >
                      <option value="">Alt Kategori Seçin</option>
                      {categories
                        .find(cat => cat.name === selectedProduct.category)
                        ?.subcategories.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2 font-bold">
                      Fiyat (₺)
                    </label>
                    <input
                      type="number"
                      value={selectedProduct.price}
                      onChange={(e) => setSelectedProduct({...selectedProduct, price: Number(e.target.value)})}
                      className="w-full px-3 py-2 border-2 border-gray-500 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2 font-bold">
                      Stok Durumu
                    </label>
                    <select
                      value={selectedProduct.stockStatus}
                      onChange={(e) => setSelectedProduct({...selectedProduct, stockStatus: e.target.value as any})}
                      className="w-full px-3 py-2 border-2 border-gray-500 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                    >
                      <option value="in-stock">Stokta</option>
                      <option value="limited">Sınırlı</option>
                      <option value="out-of-stock">Tükendi</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2 font-bold">
                    Kısa Açıklama
                  </label>
                  <textarea
                    value={selectedProduct.shortDescription}
                    onChange={(e) => setSelectedProduct({...selectedProduct, shortDescription: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border-2 border-gray-500 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2 font-bold">
                    Detaylı Açıklama
                  </label>
                  <textarea
                    value={selectedProduct.description}
                    onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border-2 border-gray-500 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                    placeholder="HTML etiketleri kullanabilirsiniz..."
                  />
                </div>

                {/* Specifications */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-900 font-bold">
                      Teknik Özellikler
                    </label>
                    <button
                      type="button"
                      onClick={addSpecification}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Özellik Ekle
                    </button>
                  </div>
                  <div className="space-y-3">
                    {selectedProduct.specifications.map((spec, index) => (
                      <div key={index} className="flex gap-3">
                        <input
                          type="text"
                          placeholder="Özellik adı"
                          value={spec.key}
                          onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                          className="flex-1 px-3 py-2 border-2 border-gray-500 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Değer"
                          value={spec.value}
                          onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                          className="flex-1 px-3 py-2 border-2 border-gray-500 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpecification(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedProduct.featured}
                      onChange={(e) => setSelectedProduct({...selectedProduct, featured: e.target.checked})}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label className="ml-2 text-sm text-gray-900 font-bold">Öne Çıkan Ürün</label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2 font-bold">
                      Durum
                    </label>
                    <select
                      value={selectedProduct.status}
                      onChange={(e) => setSelectedProduct({...selectedProduct, status: e.target.value as any})}
                      className="w-full px-3 py-2 border-2 border-gray-500 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                    >
                      <option value="active">Aktif</option>
                      <option value="inactive">Pasif</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2 font-bold">
                      Sıralama
                    </label>
                    <input
                      type="number"
                      value={selectedProduct.sortOrder}
                      onChange={(e) => setSelectedProduct({...selectedProduct, sortOrder: Number(e.target.value)})}
                      className="w-full px-3 py-2 border-2 border-gray-500 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                      min="1"
                    />
                  </div>
                </div>

                {/* SEO Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2 font-bold">
                      Meta Başlık
                    </label>
                    <input
                      type="text"
                      value={selectedProduct.metaTitle}
                      onChange={(e) => setSelectedProduct({...selectedProduct, metaTitle: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-500 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                      maxLength={60}
                    />
                    <p className="text-xs text-gray-500 mt-1">{selectedProduct.metaTitle.length}/60 karakter</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2 font-bold">
                      Meta Açıklama
                    </label>
                    <textarea
                      value={selectedProduct.metaDescription}
                      onChange={(e) => setSelectedProduct({...selectedProduct, metaDescription: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border-2 border-gray-500 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-500 mt-1">{selectedProduct.metaDescription.length}/160 karakter</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t-2 border-gray-300 bg-gray-50 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border-2 border-gray-400 rounded-lg hover:bg-gray-100 text-gray-900 font-medium"
                >
                  İptal
                </button>
                <button
                  onClick={handleSaveProduct}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-bold"
                >
                  {isCreating ? 'Ürün Ekle' : 'Güncelle'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 