'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamic imports for better performance
const Header = dynamic(() => import('@/components/layout/Header'), {
  loading: () => <div className="h-20 bg-white shadow-sm animate-pulse" />
});

const HeroSection = dynamic(() => import('@/components/sections/HeroSection'), {
  loading: () => <div className="h-screen bg-gradient-to-br from-blue-900 to-blue-700 animate-pulse" />
});



const ProductsSection = dynamic(() => import('@/components/sections/ProductsSection'), {
  loading: () => <div className="h-96 bg-white animate-pulse" />
});

const ContactSection = dynamic(() => import('@/components/sections/ContactSection'), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />
});

const Footer = dynamic(() => import('@/components/layout/Footer'), {
  loading: () => <div className="h-96 bg-gray-900 animate-pulse" />
});

export default function Home() {
  // Dynamic metadata loading
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const response = await fetch('/settings', {
          cache: 'no-cache'
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            const { site_name, site_description } = result.data;
            
            // Update document title
            if (site_name) {
              document.title = site_name;
              console.log('📄 Updated page title to:', site_name);
            }
            
            // Update meta description
            if (site_description) {
              const metaDescription = document.querySelector('meta[name="description"]');
              if (metaDescription) {
                metaDescription.setAttribute('content', site_description);
                console.log('📄 Updated meta description to:', site_description);
              }
            }
          }
        }
      } catch (error) {
        console.log('📄 Using default metadata:', error);
      }
    };

    loadMetadata();
  }, []);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Suspense fallback={<div className="h-screen bg-gradient-to-br from-blue-900 to-blue-700 animate-pulse" />}>
        <HeroSection />
      </Suspense>

      {/* Products Section */}
      <Suspense fallback={<div className="h-96 bg-white animate-pulse" />}>
        <ProductsSection />
      </Suspense>

      {/* Contact Section */}
      <Suspense fallback={<div className="h-96 bg-gray-50 animate-pulse" />}>
        <ContactSection />
      </Suspense>

      {/* Footer */}
      <Suspense fallback={<div className="h-96 bg-gray-900 animate-pulse" />}>
        <Footer />
      </Suspense>
    </main>
  );
} 