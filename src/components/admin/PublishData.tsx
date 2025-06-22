'use client';

import { useState } from 'react';
import { publishAllData } from '@/lib/publish-data';
import { exportAdminChanges } from '@/lib/data-sync';

export default function PublishData() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handlePublish = async () => {
    setIsPublishing(true);
    setError('');
    setResult('');

    try {
      // Export all localStorage data as JSON
      const exportData: any = {};
      
      // Get all localStorage keys that start with 'ozmevsim_'
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ozmevsim_')) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              exportData[key] = JSON.parse(data);
            } catch {
              exportData[key] = data;
            }
          }
        }
      }

      // Add metadata
      exportData._metadata = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        site: 'ozmevsim.com',
        description: 'Öz Mevsim Website Database Export'
      };

      // Create downloadable JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      // Download file
      const link = document.createElement('a');
      link.href = url;
      link.download = `ozmevsim-database-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      // Also save to KV for real-time sync
      try {
        const response = await fetch('/api/data-kv', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key: 'ozmevsim_full_backup',
            data: exportData
          })
        });
        
        if (response.ok) {
          setResult(`✅ Veriler export edildi ve cloud'a yedeklendi! Dosyayı da indirdiniz.`);
        } else {
          setResult(`✅ Veriler export edildi! Cloud yedekleme başarısız oldu ama dosyayı indirdiniz.`);
        }
      } catch (cloudError) {
        setResult(`✅ Veriler export edildi! Cloud yedekleme mevcut değil ama dosyayı indirdiniz.`);
      }
      
    } catch (error: any) {
      setError(`❌ Export hatası: ${error.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleShowData = () => {
    // Show all localStorage data in console
    console.log('=== OZMEVSIM LOCALSTORAGE VERİLERİ ===');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('ozmevsim_')) {
        const data = localStorage.getItem(key);
        console.log(`${key}:`, data ? JSON.parse(data) : null);
      }
    }
    setResult('Veriler console\'da gösterildi. F12 ile developer tools\'u açın.');
  };

  const handleImportData = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const importData = JSON.parse(text);
        
        // Verify this is an Özmevsim backup
        if (!importData._metadata || !importData._metadata.site?.includes('ozmevsim')) {
          if (!confirm('Bu dosya Öz Mevsim backup dosyası değil gibi görünüyor. Devam etmek istediğinizden emin misiniz?')) {
            return;
          }
        }
        
        let importCount = 0;
        
        // Import each localStorage key
        Object.entries(importData).forEach(([key, value]) => {
          if (key.startsWith('ozmevsim_') && key !== '_metadata') {
            localStorage.setItem(key, JSON.stringify(value));
            importCount++;
          }
        });
        
        setResult(`✅ ${importCount} adet veri başarıyla import edildi! Sayfa yenilenecek...`);
        
        // Refresh page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        
      } catch (error: any) {
        setError(`❌ Import hatası: ${error.message}`);
      }
    };
    
    fileInput.click();
  };

  const handleClearAll = () => {
    if (confirm('Tüm localStorage verilerini silmek istediğinizden emin misiniz?')) {
      const keysToDelete = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ozmevsim_')) {
          keysToDelete.push(key);
        }
      }
      
      keysToDelete.forEach(key => localStorage.removeItem(key));
      setResult(`✅ ${keysToDelete.length} adet localStorage verisi silindi.`);
      
      // Refresh page to reset to defaults
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">📤 Veri Yayınlama</h2>
      
      <div className="space-y-4">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-medium text-yellow-800 mb-2">⚠️ Önemli Not:</h3>
          <p className="text-sm text-yellow-700">
            Admin panelinden yaptığınız değişiklikler şu anda sadece bu tarayıcıda görünüyor. 
            Değişiklikleri canlı siteye yansıtmak için aşağıdaki adımları takip edin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <button
            onClick={handleShowData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            🔍 Verileri Göster
          </button>

          <button
            onClick={async () => {
              try {
                setError('');
                setResult('');
                await exportAdminChanges();
                setResult('✅ Admin değişiklikleri export edildi! Geliştirici ile paylaşın.');
              } catch (error: any) {
                setError(`❌ Export hatası: ${error.message}`);
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            🚀 Akıllı Export
          </button>

          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 transition-colors"
          >
            {isPublishing ? '⏳ Export ediliyor...' : '📤 Full Export'}
          </button>

          <button
            onClick={handleImportData}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            📥 Import Data
          </button>

          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            🗑️ Tümünü Sil
          </button>
        </div>

        {result && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-800">{result}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-2">📋 Yayınlama Adımları:</h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. "Export Et" butonuna tıklayın</li>
            <li>2. İndirilen JSON dosyasını geliştiricinize gönderin</li>
            <li>3. Geliştirici dosyayı sisteme entegre edecek</li>
            <li>4. Değişiklikler canlı siteye yansıyacak</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 