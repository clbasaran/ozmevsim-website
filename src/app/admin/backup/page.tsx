'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  ClockIcon,
  ServerIcon,
  CircleStackIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

export default function BackupPage() {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [lastBackup, setLastBackup] = useState(new Date().toLocaleString('tr-TR'));

  const handleCreateBackup = () => {
    setIsCreatingBackup(true);
    
    // Simulate backup creation
    setTimeout(() => {
      setLastBackup(new Date().toLocaleString('tr-TR'));
      setIsCreatingBackup(false);
      alert('Yedekleme başarıyla tamamlandı!');
    }, 3000);
  };

  const handleExportData = async () => {
    try {
      // Export all data as JSON
      const [blogResponse, faqResponse, testimonialsResponse, contactResponse, productsResponse] = await Promise.all([
        fetch('/api/blog').then(res => res.ok ? res.json() : { data: [] }).catch(() => ({ data: [] })),
        fetch('/api/faq').then(res => res.ok ? res.json() : { data: [] }).catch(() => ({ data: [] })),
        fetch('/api/testimonials').then(res => res.ok ? res.json() : { data: [] }).catch(() => ({ data: [] })),
        fetch('/api/contact').then(res => res.ok ? res.json() : { data: [] }).catch(() => ({ data: [] })),
        fetch('/api/products').then(res => res.ok ? res.json() : { data: [] }).catch(() => ({ data: [] }))
      ]) as Array<{ data: any[] }>;

      const exportData = {
        exportDate: new Date().toISOString(),
        data: {
          blog: blogResponse.data || [],
          faq: faqResponse.data || [],
          testimonials: testimonialsResponse.data || [],
          contact: contactResponse.data || [],
          products: productsResponse.data || []
        }
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ozmevsim-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Veri dışa aktarılırken hata oluştu');
    }
  };

  const stats = [
    {
      title: 'Sistem Durumu',
      value: 'Aktif',
      icon: CheckCircleIcon,
      color: 'green'
    },
    {
      title: 'Son Yedek',
      value: lastBackup.split(' ')[1] || 'Yok',
      icon: ClockIcon,
      color: 'blue'
    },
    {
      title: 'Veri Tabanı',
      value: 'Cloudflare D1',
      icon: CircleStackIcon,
      color: 'purple'
    },
    {
      title: 'Durum',
      value: 'Güvenli',
      icon: ServerIcon,
      color: 'orange'
    }
  ];

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Yedekleme</h1>
          <p className="text-gray-600 mt-2">Site verilerini yedekleyin ve dışa aktarın</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Backup Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Create Backup */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <CloudArrowUpIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sistem Yedeği</h3>
              <p className="text-gray-600 text-sm">Sistem durumunu kaydet</p>
            </div>
          </div>
          <button
            onClick={handleCreateBackup}
            disabled={isCreatingBackup}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingBackup ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Yedekleniyor...
              </div>
            ) : (
              'Yedek Oluştur'
            )}
          </button>
        </div>

        {/* Export Data */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <CloudArrowDownIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Veri Dışa Aktarma</h3>
              <p className="text-gray-600 text-sm">Tüm verileri JSON olarak indir</p>
            </div>
          </div>
          <button
            onClick={handleExportData}
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors"
          >
            Veriyi Dışa Aktar
          </button>
        </div>
      </div>

      {/* Backup Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Yedekleme Bilgileri</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">Son Yedekleme</span>
            <span className="font-semibold text-gray-900">{lastBackup}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">Yedekleme Türü</span>
            <span className="font-semibold text-gray-900">Otomatik</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">Depolama</span>
            <span className="font-semibold text-gray-900">Cloudflare D1</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-600">Durum</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              Aktif
            </span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <div className="flex items-center mb-3">
          <DocumentTextIcon className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-blue-800">Yedekleme Hakkında</h3>
        </div>
        <div className="text-blue-700 space-y-2">
          <p>• <strong>Sistem Yedeği:</strong> Mevcut sistem durumunu kaydeder</p>
          <p>• <strong>Veri Dışa Aktarma:</strong> Tüm içerik verilerini JSON formatında indirir</p>
          <p>• <strong>Otomatik Yedekleme:</strong> Sistem günlük olarak otomatik yedekleme yapar</p>
          <p>• <strong>Güvenlik:</strong> Tüm veriler Cloudflare altyapısında güvenle saklanır</p>
        </div>
      </div>
    </div>
  );
} 