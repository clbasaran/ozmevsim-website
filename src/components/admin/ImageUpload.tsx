'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CloudArrowUpIcon,
  PhotoIcon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  disabled?: boolean;
  folder?: string;
}

export default function ImageUpload({ 
  onUpload, 
  currentImage, 
  disabled = false, 
  folder = 'products' 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Lütfen sadece resim dosyası seçin');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Dosya boyutu 10MB\'dan küçük olmalıdır');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('files', file);
      formData.append('folder', folder);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/upload-r2', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (result.success && result.data && result.data.length > 0) {
        const uploadedFile = result.data[0];
        console.log('✅ File uploaded successfully:', uploadedFile.url);
        onUpload(uploadedFile.url);
        setUploadProgress(0);
      } else {
        throw new Error(result.error || 'Yükleme başarısız');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Yükleme sırasında hata oluştu');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Ürün Görseli
      </label>
      
      {/* Current Image Preview */}
      {currentImage && (
        <div className="relative">
          <img
            src={currentImage}
            alt="Mevcut görsel"
            className="w-32 h-32 object-cover rounded-lg border border-gray-300"
          />
          <div className="absolute top-1 right-1">
            <CheckCircleIcon className="w-5 h-5 text-green-500 bg-white rounded-full" />
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={disabled || isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className={`
            flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${isUploading || disabled 
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
              : 'border-orange-300 bg-orange-50 hover:bg-orange-100 hover:border-orange-400'
            }
          `}
        >
          {isUploading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <CloudArrowUpIcon className="w-8 h-8 text-orange-500 mx-auto mb-2 animate-bounce" />
              <p className="text-sm font-medium text-orange-600">Yükleniyor...</p>
              <div className="w-32 h-2 bg-gray-200 rounded-full mt-2">
                <motion.div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
            </motion.div>
          ) : (
            <div className="text-center">
              <PhotoIcon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-orange-600">
                Görsel yüklemek için tıklayın
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, WEBP (maks. 10MB)
              </p>
            </div>
          )}
        </label>
      </div>

      {/* Upload Error */}
      {uploadError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <XMarkIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600">{uploadError}</p>
        </motion.div>
      )}

      {/* Upload Success */}
      {currentImage && !uploadError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"
        >
          <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p className="text-sm text-green-600">Görsel başarıyla yüklendi</p>
        </motion.div>
      )}
    </div>
  );
} 