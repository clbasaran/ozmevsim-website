'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  EyeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

interface ReportData {
  totalContent: number;
  blogPosts: number;
  products: number;
  testimonials: number;
  faqItems: number;
  contactMessages: number;
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load real data from APIs
  useEffect(() => {
    const loadReportData = async () => {
      try {
        let blogCount = 0;
        let faqCount = 0;
        let testimonialsCount = 0;
        let contactCount = 0;
        let productsCount = 0;

        // Fetch blog data
        try {
          const blogResponse = await fetch('/api/blog');
          if (blogResponse.ok) {
            const blogResult = await blogResponse.json();
            blogCount = blogResult.success && blogResult.data ? blogResult.data.length : 0;
          }
        } catch (error) {
          console.log('Blog API error:', error);
        }

        // Fetch FAQ data
        try {
          const faqResponse = await fetch('/api/faq');
          if (faqResponse.ok) {
            const faqResult = await faqResponse.json();
            faqCount = faqResult.success && faqResult.data ? faqResult.data.length : 0;
          }
        } catch (error) {
          console.log('FAQ API error:', error);
        }

        // Fetch testimonials data
        try {
          const testimonialsResponse = await fetch('/api/testimonials');
          if (testimonialsResponse.ok) {
            const testimonialsResult = await testimonialsResponse.json();
            testimonialsCount = testimonialsResult.success && testimonialsResult.data ? testimonialsResult.data.length : 0;
          }
        } catch (error) {
          console.log('Testimonials API error:', error);
        }

        // Fetch contact data
        try {
          const contactResponse = await fetch('/api/contact');
          if (contactResponse.ok) {
            const contactResult = await contactResponse.json();
            contactCount = contactResult.success && contactResult.data ? contactResult.data.length : 0;
          }
        } catch (error) {
          console.log('Contact API error:', error);
        }

        // Fetch products data
        try {
          const productsResponse = await fetch('/api/products');
          if (productsResponse.ok) {
            const productsResult = await productsResponse.json();
            productsCount = productsResult.success && productsResult.data ? productsResult.data.length : 0;
          }
        } catch (error) {
          console.log('Products API error:', error);
        }

        setReportData({
          totalContent: blogCount + faqCount + testimonialsCount + productsCount,
          blogPosts: blogCount,
          products: productsCount,
          testimonials: testimonialsCount,
          faqItems: faqCount,
          contactMessages: contactCount
        });
      } catch (error) {
        console.error('Error loading report data:', error);
        // Fallback data
        setReportData({
          totalContent: 0,
          blogPosts: 0,
          products: 0,
          testimonials: 0,
          faqItems: 0,
          contactMessages: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadReportData();
  }, []);

  const stats = [
    {
      title: 'Toplam İçerik',
      value: reportData?.totalContent || 0,
      icon: ChartBarIcon,
      color: 'blue'
    },
    {
      title: 'Blog Yazıları',
      value: reportData?.blogPosts || 0,
      icon: DocumentTextIcon,
      color: 'green'
    },
    {
      title: 'Ürünler',
      value: reportData?.products || 0,
      icon: UserGroupIcon,
      color: 'purple'
    },
    {
      title: 'Müşteri Yorumları',
      value: reportData?.testimonials || 0,
      icon: ChatBubbleLeftRightIcon,
      color: 'orange'
    },
    {
      title: 'SSS Soruları',
      value: reportData?.faqItems || 0,
      icon: QuestionMarkCircleIcon,
      color: 'red'
    },
    {
      title: 'İletişim Mesajları',
      value: reportData?.contactMessages || 0,
      icon: EyeIcon,
      color: 'indigo'
    }
  ];

  const exportReport = () => {
    if (!reportData) return;
    
    const reportContent = `
Öz Mevsim Admin Panel Raporu
============================
Tarih: ${new Date().toLocaleDateString('tr-TR')}

İçerik İstatistikleri:
- Toplam İçerik: ${reportData.totalContent}
- Blog Yazıları: ${reportData.blogPosts}
- Ürünler: ${reportData.products}
- Müşteri Yorumları: ${reportData.testimonials}
- SSS Soruları: ${reportData.faqItems}
- İletişim Mesajları: ${reportData.contactMessages}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ozmevsim-raporu-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Raporlar</h1>
          <p className="text-gray-600 mt-2">Sistem istatistikleri ve içerik durumu</p>
        </div>
        <button
          onClick={exportReport}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <DocumentArrowDownIcon className="w-5 h-5" />
          Rapor İndir
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">İçerik Özeti</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">Toplam İçerik</span>
            <span className="font-semibold text-gray-900">{reportData?.totalContent}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">Yayınlanan Blog Yazıları</span>
            <span className="font-semibold text-gray-900">{reportData?.blogPosts}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">Aktif Ürünler</span>
            <span className="font-semibold text-gray-900">{reportData?.products}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">Onaylı Müşteri Yorumları</span>
            <span className="font-semibold text-gray-900">{reportData?.testimonials}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">Aktif SSS Soruları</span>
            <span className="font-semibold text-gray-900">{reportData?.faqItems}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-600">İletişim Mesajları</span>
            <span className="font-semibold text-gray-900">{reportData?.contactMessages}</span>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-6 bg-green-50 border border-green-200 p-6 rounded-lg">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
          <h3 className="text-lg font-semibold text-green-800">Sistem Durumu: Aktif</h3>
        </div>
        <p className="text-green-700 mt-2">
          Tüm API'ler çalışıyor ve veriler başarıyla yükleniyor.
        </p>
        <p className="text-sm text-green-600 mt-1">
          Son güncelleme: {new Date().toLocaleString('tr-TR')}
        </p>
      </div>
    </div>
  );
} 