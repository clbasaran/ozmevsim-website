'use client';

import React, { useState, useEffect } from 'react';
import { DataMigration } from '@/lib/migration';
import { 
  CloudArrowUpIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

interface MigrationResult {
  success: boolean;
  message: string;
  details?: any;
}

const MigrationPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [migrationResults, setMigrationResults] = useState<MigrationResult[]>([]);
  const [migrationStatus, setMigrationStatus] = useState<any>(null);
  const [showDetails, setShowDetails] = useState<number | null>(null);

  // Migration status kontrolü
  const checkStatus = async () => {
    try {
      setIsLoading(true);
      const status = await DataMigration.checkMigrationStatus();
      setMigrationStatus(status);
    } catch (error) {
      console.error('Status check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Tek bir veri tipini migrate et
  const migrateDataType = async (type: 'products' | 'blog' | 'faq' | 'testimonials') => {
    setIsLoading(true);
    try {
      let result: MigrationResult;
      
      switch (type) {
        case 'products':
          result = await DataMigration.migrateProducts();
          break;
        case 'blog':
          result = await DataMigration.migrateBlogPosts();
          break;
        case 'faq':
          result = await DataMigration.migrateFAQs();
          break;
        case 'testimonials':
          result = await DataMigration.migrateTestimonials();
          break;
        default:
          throw new Error('Unknown migration type');
      }
      
      setMigrationResults(prev => [...prev, { ...result, type }]);
      
      // Status'u yenile
      await checkStatus();
      
    } catch (error) {
      setMigrationResults(prev => [...prev, {
        success: false,
        message: `Migration failed: ${error}`,
        type
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Tüm verileri migrate et
  const migrateAll = async () => {
    setIsLoading(true);
    setMigrationResults([]);
    
    try {
      const results = await DataMigration.migrateAll();
      setMigrationResults(results);
      
      // Status'u yenile
      await checkStatus();
      
    } catch (error) {
      setMigrationResults([{
        success: false,
        message: `Full migration failed: ${error}`,
        details: error
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const getDataTypeInfo = (type: string) => {
    const info = {
      products: { 
        icon: <ShoppingBagIcon className="w-5 h-5" />, 
        label: 'Ürünler',
        description: 'Kombi, klima ve diğer ürün bilgileri'
      },
      blog: { 
        icon: <DocumentTextIcon className="w-5 h-5" />, 
        label: 'Blog Yazıları',
        description: 'Tüm blog gönderileri ve içerikleri'
      },
      faq: { 
        icon: <QuestionMarkCircleIcon className="w-5 h-5" />, 
        label: 'SSS',
        description: 'Sıkça sorulan sorular ve cevapları'
      },
      testimonials: { 
        icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />, 
        label: 'Müşteri Yorumları',
        description: 'Testimonial ve referanslar'
      }
    };
    return info[type as keyof typeof info] || { icon: null, label: type, description: '' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <CloudArrowUpIcon className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Veri Migrasyonu</h2>
        </div>
        <p className="text-blue-100">
          localStorage'daki verilerinizi kalıcı database'e aktarın
        </p>
      </div>

      {/* Status Panel */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Durum Kontrolü</h3>
          <button
            onClick={checkStatus}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Yenile
          </button>
        </div>

        {migrationStatus && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* localStorage Verileri */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-3">localStorage Verileri</h4>
              <div className="space-y-2">
                {Object.entries(migrationStatus.localStorageData).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-blue-700">{key.replace('ozmevsim_', '')}</span>
                    <span className="text-blue-600 font-medium">
                      {Array.isArray(value) ? `${value.length} item` : 'data'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Database Durumu */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-3">Database Durumu</h4>
              <div className="space-y-2">
                {Object.entries(migrationStatus.databaseStatus).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-green-700">{key}</span>
                    <span className="text-green-600 font-medium">
                      {(value as any)?.success ? 
                        `${(value as any).data?.length || 0} item` : 
                        '❌ Hata'
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Migration Buttons */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Veri Aktarımı</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {['products', 'blog', 'faq', 'testimonials'].map((type) => {
            const info = getDataTypeInfo(type);
            return (
              <button
                key={type}
                onClick={() => migrateDataType(type as any)}
                disabled={isLoading}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50"
              >
                <div className="text-blue-600 mb-2">{info.icon}</div>
                <div className="text-sm font-medium text-gray-900">{info.label}</div>
                <div className="text-xs text-gray-500 text-center mt-1">{info.description}</div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-4">
          <button
            onClick={migrateAll}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <PlayIcon className="w-5 h-5" />
            {isLoading ? 'Aktarılıyor...' : 'Tümünü Aktar'}
          </button>
        </div>
      </div>

      {/* Migration Results */}
      {migrationResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Migration Sonuçları</h3>
          
          <div className="space-y-3">
            {migrationResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    ) : (
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      result.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {result.message}
                    </span>
                  </div>
                  
                  {result.details && (
                    <button
                      onClick={() => setShowDetails(showDetails === index ? null : index)}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                      <EyeIcon className="w-4 h-4" />
                      Detaylar
                    </button>
                  )}
                </div>
                
                {showDetails === index && result.details && (
                  <div className="mt-3 p-3 bg-gray-50 rounded border text-sm">
                    <pre className="whitespace-pre-wrap text-xs">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MigrationPanel;