'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  UserIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
  location: string;
  service: string;
  featured: boolean;
  status: 'published' | 'draft' | 'pending';
  createdAt: string;
  updatedAt: string;
}

const services = [
  'Kombi Montajı',
  'Kombi Onarımı',
  'Kombi Bakımı',
  'Klima Montajı',
  'Klima Onarımı',
  'Klima Bakımı',
  'Doğalgaz Tesisatı',
  'Ticari Isıtma Sistemi',
  'Endüstriyel Sistem',
  'Diğer'
];

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterService, setFilterService] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Load testimonials from D1 API
  const loadTestimonialsFromAPI = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/testimonials');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setTestimonials(result.data);
        }
      }
    } catch (error) {
      console.error('Failed to load testimonials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonialsFromAPI();
  }, []);

  // Filter and search testimonials
  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = !filterService || testimonial.service === filterService;
    const matchesStatus = !filterStatus || testimonial.status === filterStatus;
    
    return matchesSearch && matchesService && matchesStatus;
  });

  // Sort testimonials
  const sortedTestimonials = [...filteredTestimonials].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'rating':
        aValue = a.rating;
        bValue = b.rating;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        aValue = a[sortBy as keyof Testimonial];
        bValue = b[sortBy as keyof Testimonial];
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedTestimonials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTestimonials = sortedTestimonials.slice(startIndex, startIndex + itemsPerPage);

  const handleCreateTestimonial = () => {
    setSelectedTestimonial({
      id: Date.now().toString(),
      name: '',
      title: '',
      company: '',
      content: '',
      rating: 5,
      avatar: '',
      location: '',
      service: 'Kombi Montajı',
      featured: false,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setIsCreating(true);
    setIsEditing(true);
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsCreating(false);
    setIsEditing(true);
  };

  const handleSaveTestimonial = async () => {
    if (!selectedTestimonial) return;

    // Validation
    if (!selectedTestimonial.name || !selectedTestimonial.content) {
      alert('❌ İsim ve yorum alanları zorunludur!');
      return;
    }

    if (!selectedTestimonial.service) {
      alert('❌ Hizmet seçimi zorunludur!');
      return;
    }

    try {
      const apiData = {
        name: selectedTestimonial.name,
        title: selectedTestimonial.title,
        company: selectedTestimonial.company,
        content: selectedTestimonial.content,
        rating: selectedTestimonial.rating,
        avatar: selectedTestimonial.avatar,
        location: selectedTestimonial.location,
        service: selectedTestimonial.service,
        featured: selectedTestimonial.featured,
        status: selectedTestimonial.status
      };

      const response = await fetch('/api/testimonials', {
        method: isCreating ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isCreating ? apiData : { ...apiData, id: selectedTestimonial.id })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Testimonial saved to D1:', result);

      const updatedTestimonial = {
        ...selectedTestimonial,
        updatedAt: new Date().toISOString()
      };

      // Update local state
      if (isCreating) {
        setTestimonials(prev => [...prev, { ...updatedTestimonial, id: result.data?.id || selectedTestimonial.id }]);
      } else {
        setTestimonials(prev => prev.map(t => t.id === selectedTestimonial.id ? updatedTestimonial : t));
      }

      setSelectedTestimonial(null);
      setIsEditing(false);
      setIsCreating(false);
      alert('✅ Müşteri yorumu başarıyla kaydedildi!');
    } catch (error) {
      console.error('❌ Testimonial save error:', error);
      alert('❌ Müşteri yorumu kaydedilirken hata oluştu!');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (confirm('Bu müşteri yorumunu silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/testimonials?id=${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        // Update local state
        setTestimonials(prev => prev.filter(t => t.id !== id));
        alert('✅ Müşteri yorumu başarıyla silindi!');
      } catch (error) {
        console.error('❌ Testimonial delete error:', error);
        alert('❌ Müşteri yorumu silinirken hata oluştu!');
      }
    }
  };

  const toggleTestimonialStatus = (id: string) => {
    setTestimonials(prev => prev.map(t => 
      t.id === id ? { 
        ...t, 
        status: t.status === 'published' ? 'draft' : 'published',
        updatedAt: new Date().toISOString()
      } : t
    ));
  };

  const toggleFeatured = (id: string) => {
    setTestimonials(prev => prev.map(t => 
      t.id === id ? { 
        ...t, 
        featured: !t.featured,
        updatedAt: new Date().toISOString()
      } : t
    ));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Yayında';
      case 'draft':
        return 'Taslak';
      case 'pending':
        return 'Beklemede';
      default:
        return 'Bilinmiyor';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Müşteri yorumları yükleniyor...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Müşteri Yorumları</h1>
          <p className="text-gray-600 mt-1">
            Toplam {testimonials.length} yorum • {filteredTestimonials.length} gösteriliyor
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FunnelIcon className="w-4 h-4" />
            Filtrele
          </button>
          <button
            onClick={handleCreateTestimonial}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <PlusIcon className="w-4 h-4" />
            Yeni Yorum
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
                placeholder="İsim, şirket veya yorum ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {showFilters && (
            <div className="flex flex-wrap gap-4">
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Tüm Hizmetler</option>
                {services.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Tüm Durumlar</option>
                <option value="published">Yayında</option>
                <option value="draft">Taslak</option>
                <option value="pending">Beklemede</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="createdAt">Tarihe Göre</option>
                <option value="rating">Puana Göre</option>
                <option value="name">İsme Göre</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedTestimonials.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow ${
              testimonial.featured ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
            }`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    {testimonial.title && (
                      <p className="text-sm text-gray-600">{testimonial.title}</p>
                    )}
                    {testimonial.company && (
                      <p className="text-sm text-gray-500">{testimonial.company}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEditTestimonial(testimonial)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="Düzenle"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTestimonial(testimonial.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Sil"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {renderStars(testimonial.rating)}
                </div>
                <span className="text-sm text-gray-600">({testimonial.rating}/5)</span>
              </div>

              {/* Content */}
              <p className="text-gray-700 text-sm mb-4 italic">"{testimonial.content}"</p>

              {/* Service & Location */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BuildingOfficeIcon className="w-4 h-4" />
                  <span>{testimonial.service}</span>
                </div>
                {testimonial.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{testimonial.location}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(testimonial.status)}`}>
                    {getStatusText(testimonial.status)}
                  </span>
                  {testimonial.featured && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                      Öne Çıkan
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleTestimonialStatus(testimonial.id)}
                    className={`p-1 rounded ${
                      testimonial.status === 'published' 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    title={testimonial.status === 'published' ? 'Yayından Kaldır' : 'Yayınla'}
                  >
                    {testimonial.status === 'published' ? (
                      <CheckCircleIcon className="w-4 h-4" />
                    ) : (
                      <XCircleIcon className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => toggleFeatured(testimonial.id)}
                    className={`p-1 rounded ${
                      testimonial.featured 
                        ? 'text-orange-600 hover:bg-orange-50' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    title={testimonial.featured ? 'Öne Çıkarmayı Kaldır' : 'Öne Çıkar'}
                  >
                    <StarIcon className={`w-4 h-4 ${testimonial.featured ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-900">
              <span>{startIndex + 1}</span> - <span>{Math.min(startIndex + itemsPerPage, sortedTestimonials.length)}</span> arası,
              toplam <span>{sortedTestimonials.length}</span> sonuç
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 bg-white text-gray-900 hover:bg-gray-100"
              >
                Önceki
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border rounded ${
                    currentPage === page
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 bg-white text-gray-900 hover:bg-gray-100"
              >
                Sonraki
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && selectedTestimonial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {isCreating ? 'Yeni Müşteri Yorumu' : 'Müşteri Yorumunu Düzenle'}
                  </h2>
                  <button
                    onClick={() => {
                      setSelectedTestimonial(null);
                      setIsEditing(false);
                      setIsCreating(false);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        İsim *
                      </label>
                      <input
                        type="text"
                        value={selectedTestimonial.name}
                        onChange={(e) => setSelectedTestimonial({ ...selectedTestimonial, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Müşteri ismi"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ünvan
                      </label>
                      <input
                        type="text"
                        value={selectedTestimonial.title}
                        onChange={(e) => setSelectedTestimonial({ ...selectedTestimonial, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Ör: Ev Sahibi, İşletme Sahibi"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Şirket/Kurum
                      </label>
                      <input
                        type="text"
                        value={selectedTestimonial.company}
                        onChange={(e) => setSelectedTestimonial({ ...selectedTestimonial, company: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Şirket veya kurum adı"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lokasyon
                      </label>
                      <input
                        type="text"
                        value={selectedTestimonial.location}
                        onChange={(e) => setSelectedTestimonial({ ...selectedTestimonial, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Ör: Kadıköy, İstanbul"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Yorum *
                    </label>
                    <textarea
                      value={selectedTestimonial.content}
                      onChange={(e) => setSelectedTestimonial({ ...selectedTestimonial, content: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Müşteri yorumu..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hizmet *
                      </label>
                      <select
                        value={selectedTestimonial.service}
                        onChange={(e) => setSelectedTestimonial({ ...selectedTestimonial, service: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {services.map(service => (
                          <option key={service} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Puan
                      </label>
                      <select
                        value={selectedTestimonial.rating}
                        onChange={(e) => setSelectedTestimonial({ ...selectedTestimonial, rating: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {[1, 2, 3, 4, 5].map(rating => (
                          <option key={rating} value={rating}>{rating} Yıldız</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Avatar URL
                      </label>
                      <input
                        type="url"
                        value={selectedTestimonial.avatar}
                        onChange={(e) => setSelectedTestimonial({ ...selectedTestimonial, avatar: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Durum
                      </label>
                      <select
                        value={selectedTestimonial.status}
                        onChange={(e) => setSelectedTestimonial({ ...selectedTestimonial, status: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="pending">Beklemede</option>
                        <option value="published">Yayında</option>
                        <option value="draft">Taslak</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTestimonial.featured}
                        onChange={(e) => setSelectedTestimonial({ ...selectedTestimonial, featured: e.target.checked })}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Öne Çıkar</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setSelectedTestimonial(null);
                      setIsEditing(false);
                      setIsCreating(false);
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleSaveTestimonial}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    {isCreating ? 'Oluştur' : 'Güncelle'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 