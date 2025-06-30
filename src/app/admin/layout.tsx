'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeAdminSync } from '@/lib/data-sync';
import {
  HomeIcon,
  DocumentDuplicateIcon,
  CubeIcon,
  PhotoIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  CloudArrowUpIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  FolderIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  badge?: number;
  subItems?: { title: string; href: string; badge?: number }[];
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  console.log('🏗️ AdminLayout component rendering - SERVER:', typeof window === 'undefined');
  console.log('🏗️ AdminLayout component rendering - CLIENT:', typeof window !== 'undefined');
  
  const pathname = usePathname();
  const router = useRouter();

  // Debug pathname
  console.log('🔍 ADMIN LAYOUT - Current pathname:', pathname);
  
  // Skip layout completely for login page
  if (pathname === '/admin/login' || pathname === '/admin/login/' || pathname.endsWith('/admin/login') || pathname.endsWith('/admin/login/')) {
    console.log('🚪 LOGIN PAGE - Skipping admin layout completely for:', pathname);
    return <>{children}</>;
  }
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Sayfa Yönetimi', 'İçerik Yönetimi']);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // CRITICAL: Server-side authentication check for static export compatibility
  useEffect(() => {
    const performAuthCheck = async () => {
      console.log('🔒 CRITICAL: Performing authentication check...');
      
      try {
        // Skip authentication during static generation
        if (typeof window === 'undefined') {
          console.log('🏗️ Static generation detected - skipping auth check');
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
        
        // Development mode - bypass authentication
        if (process.env.NODE_ENV === 'development') {
          console.log('🔓 DEVELOPMENT MODE - Bypassing authentication');
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
        
        // Check multiple token sources
        const token = localStorage.getItem('admin_token') || 
                     document.cookie.split('; ').find(row => row.startsWith('admin_token='))?.split('=')[1];
        
        console.log('🎫 Token found:', !!token);
        
        if (!token) {
          console.log('🚫 NO TOKEN - Showing access denied');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Verify token with server
        const response = await fetch('/api/admin-auth', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json() as { authenticated: boolean };
          if (result.authenticated) {
            console.log('✅ Authentication verified');
            setIsAuthenticated(true);
          } else {
            console.log('❌ Authentication failed - Invalid token');
            localStorage.removeItem('admin_token');
            document.cookie = 'admin_token=; path=/; max-age=0';
            setIsAuthenticated(false);
          }
        } else {
          console.log('❌ Auth server error');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('🚨 Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Only run on client side
    if (typeof window !== 'undefined') {
      performAuthCheck();
    } else {
      // For server-side rendering, assume authenticated for static generation
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, []); // Remove router dependency to prevent infinite loop

  // Re-verify periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      console.log('🔄 Periodic auth verification...');
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        console.log('🚫 Token lost during session');
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch('/api/admin-auth', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          console.log('🚨 Session expired');
          setIsAuthenticated(false);
          localStorage.removeItem('admin_token');
          document.cookie = 'admin_token=; path=/; max-age=0';
        }
      } catch (error) {
        console.error('🚨 Periodic auth error:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated]); // Remove router dependency

  const handleLogout = async () => {
    console.log('🚪 Logging out...');
    
    const token = localStorage.getItem('admin_token');
    if (token) {
      try {
        await fetch('/api/admin-auth', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    localStorage.removeItem('admin_token');
    document.cookie = 'admin_token=; path=/; max-age=0; samesite=strict';
    setIsAuthenticated(false);
  };

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: <HomeIcon className="w-5 h-5" />,
      href: '/admin',
    },
    {
      title: 'Sayfa Yönetimi',
      icon: <DocumentTextIcon className="w-5 h-5" />,
      subItems: [
        { title: 'Hakkımızda', href: '/admin/pages/about' },
        { title: 'Referanslar', href: '/admin/pages/references' },
        { title: 'İletişim', href: '/admin/pages/contact' },
        { title: 'Blog', href: '/admin/pages/blog' },
        { title: 'SSS', href: '/admin/pages/faq' },
        { title: 'Müşteri Yorumları', href: '/admin/pages/testimonials' },
      ],
    },
    {
      title: 'Ürün Yönetimi',
      icon: <CubeIcon className="w-5 h-5" />,
      href: '/admin/products',
    },
    {
      title: 'İçerik Yönetimi',
      icon: <CubeIcon className="w-5 h-5" />,
      subItems: [
        { title: 'Ana Sayfa', href: '/admin/pages/home' },
        { title: 'Hizmetler', href: '/admin/pages/services' },
        { title: 'Katalog', href: '/admin/pages/catalog' },
        { title: 'Tüm İçerikler', href: '/admin/content' },
      ],
    },
    {
      title: 'Medya Kütüphanesi',
      icon: <PhotoIcon className="w-5 h-5" />,
      href: '/admin/media',
    },
    {
      title: 'Site Ayarları',
      icon: <Cog6ToothIcon className="w-5 h-5" />,
      subItems: [
        { title: 'Genel Ayarlar', href: '/admin/settings/general' },
        { title: 'SEO Ayarları', href: '/admin/settings/seo' },
      ],
    },
    {
      title: 'Raporlar',
      icon: <ChartBarIcon className="w-5 h-5" />,
      href: '/admin/reports',
    },
    {
      title: 'Yedekleme',
      icon: <FolderIcon className="w-5 h-5" />,
      href: '/admin/backup',
    },
  ];

  const toggleMenu = (title: string) => {
    setExpandedMenus(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isParentActive = (subItems: any[]) => 
    subItems.some(item => pathname === item.href);

  // Initialize admin sync system only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('🎭 Admin Layout useEffect running - CLIENT SIDE');
      console.log('🔄 Calling initializeAdminSync...');
      console.log('🌍 Window check:', typeof window !== 'undefined');
      initializeAdminSync();
    }
  }, [isAuthenticated]);

  // Show loading screen during auth check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-white mt-4">🔒 Güvenlik kontrolü yapılıyor...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <ShieldCheckIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">🚫 Erişim Reddedildi</h1>
          <p className="text-gray-400 mb-4">Admin paneline erişim için kimlik doğrulama gerekli</p>
          <button 
            onClick={() => {
              console.log('🔄 Navigating to login...');
              window.location.href = '/admin/login';
            }}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Giriş Sayfasına Git
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'w-64' : 'w-20'
          } bg-gradient-to-b from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 text-white transition-all duration-300 ease-in-out flex flex-col`}
        >
          {/* Logo */}
          <div className="p-4 flex items-center justify-between border-b border-gray-700">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg">
                ÖM
              </div>
              {isSidebarOpen && (
                <div>
                  <h1 className="font-bold text-lg">Öz Mevsim</h1>
                  <p className="text-xs text-gray-400">Güvenli Admin Panel</p>
                </div>
              )}
            </Link>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {isSidebarOpen ? (
                <ChevronRightIcon className="w-5 h-5" />
              ) : (
                <Bars3Icon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.title}>
                  {item.subItems ? (
                    <div>
                      <button
                        onClick={() => toggleMenu(item.title)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                          isParentActive(item.subItems) ? 'bg-gray-700' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          {isSidebarOpen && (
                            <span className="font-medium">{item.title}</span>
                          )}
                        </div>
                        {isSidebarOpen && (
                          <motion.div
                            animate={{ rotate: expandedMenus.includes(item.title) ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRightIcon className="w-4 h-4" />
                          </motion.div>
                        )}
                      </button>
                      <AnimatePresence>
                        {expandedMenus.includes(item.title) && isSidebarOpen && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-2 ml-4 space-y-1 overflow-hidden"
                          >
                            {item.subItems.map((subItem) => (
                              <li key={subItem.href}>
                                <Link
                                  href={subItem.href}
                                  className={`flex items-center justify-between p-2 pl-8 rounded-lg hover:bg-gray-700 transition-colors ${
                                    isActive(subItem.href) ? 'bg-orange-600 hover:bg-orange-700' : ''
                                  }`}
                                >
                                  <span className="text-sm">{subItem.title}</span>
                                  {subItem.badge && (
                                    <span className="text-xs bg-orange-500 px-2 py-0.5 rounded-full">
                                      {subItem.badge}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href || '#'}
                      className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                        isActive(item.href || '') ? 'bg-orange-600 hover:bg-orange-700' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        {isSidebarOpen && (
                          <span className="font-medium">{item.title}</span>
                        )}
                      </div>
                      {item.badge && isSidebarOpen && (
                        <span className="text-xs bg-orange-500 px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Admin Menu */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold relative">
                <ShieldCheckIcon className="w-5 h-5 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              {isSidebarOpen && (
                <div className="flex-1">
                  <p className="font-medium text-sm">Admin</p>
                  <p className="text-xs text-green-400 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                    Database Authenticated
                  </p>
                </div>
              )}
              {isSidebarOpen && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-red-400 hover:text-white bg-red-500/10 border border-red-500/20"
                  title="Güvenli Çıkış"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  <span className="text-xs font-medium">Çıkış</span>
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex items-center justify-between p-4">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>

              {/* Search Bar */}
              <div className="flex-1 max-w-xl mx-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="admin-search"
                    type="text"
                    placeholder="Ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  <ShieldCheckIcon className="w-3 h-3" />
                  <span>Güvenli</span>
                </div>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {isDarkMode ? (
                    <SunIcon className="w-5 h-5" />
                  ) : (
                    <MoonIcon className="w-5 h-5" />
                  )}
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
                  <BellIcon className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <Link
                  href="/"
                  target="_blank"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                >
                  Siteyi Görüntüle
                </Link>
              </div>
            </div>

            {/* Breadcrumb */}
            <div className="px-4 pb-4">
              <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Link href="/admin" className="hover:text-gray-900 dark:hover:text-gray-200">
                  Admin
                </Link>
                <ChevronRightIcon className="w-4 h-4" />
                <span className="text-gray-900 dark:text-gray-200">
                  {pathname.split('/').slice(2).join(' / ') || 'Dashboard'}
                </span>
              </nav>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className="w-64 h-full bg-gray-900 text-white p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg">
                      ÖM
                    </div>
                    <div>
                      <h1 className="font-bold text-lg">Öz Mevsim</h1>
                      <p className="text-xs text-gray-400">Güvenli Admin Panel</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                {/* Mobile menu items - same structure as desktop */}
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <div key={item.title}>
                      {item.subItems ? (
                        <div>
                          <button
                            onClick={() => toggleMenu(item.title)}
                            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {item.icon}
                              <span className="font-medium">{item.title}</span>
                            </div>
                            <ChevronRightIcon className="w-4 h-4" />
                          </button>
                          {expandedMenus.includes(item.title) && (
                            <div className="ml-6 mt-2 space-y-1">
                              {item.subItems.map((subItem) => (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block p-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                                >
                                  {subItem.title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={item.href || '#'}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          {item.icon}
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 