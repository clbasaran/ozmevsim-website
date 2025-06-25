import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PortfolioSection from '@/components/sections/PortfolioSection';

export default function ReferencesPage() {
  return (
    <main className="min-h-screen main-content">
      {/* Header */}
      <Header />

      {/* Portfolio Section */}
        <PortfolioSection />

      {/* Footer */}
        <Footer />
    </main>
  );
} 