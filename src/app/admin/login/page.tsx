'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('admin_token') || 
                     document.cookie.split('; ').find(row => row.startsWith('admin_token='))?.split('=')[1];
        if (token) {
          // Verify token with server
          const response = await fetch('/api/admin-auth', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const result = await response.json() as { success: boolean; authenticated: boolean };
            if (result.success && result.authenticated) {
              router.push('/admin');
              return;
            }
          }
          
          // Invalid token, remove it
          localStorage.removeItem('admin_token');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('admin_token');
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json() as { success: boolean; token?: string; error?: string };

      if (result.success && result.token) {
        // Store token securely in both localStorage and cookie
        localStorage.setItem('admin_token', result.token);
        
        // Set cookie for middleware protection (without secure for localhost testing)
        document.cookie = `admin_token=${result.token}; path=/; max-age=86400; samesite=strict`;
        
        // Redirect to admin panel
        router.push('/admin');
      } else {
        setError(result.error || 'Giriş başarısız');
        setPassword('');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center font-bold text-2xl text-white mx-auto mb-4 shadow-lg">
            ÖM
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Öz Mevsim Yönetim Sistemi</p>
          <p className="text-xs text-gray-500 mt-2">Güvenli Database Authentication</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Şifresi
            </label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 placeholder-gray-500 bg-white"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
                placeholder="Database'den doğrulanacak şifre"
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Database'den doğrulanıyor...
              </div>
            ) : (
              'Güvenli Giriş'
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500">
              🔒 Şifre database'den güvenli olarak doğrulanır
            </p>
            <p className="text-xs text-gray-500">
              🛡️ Session token ile oturum yönetimi
            </p>
            <p className="text-xs text-gray-500">
              © 2024 Öz Mevsim. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 