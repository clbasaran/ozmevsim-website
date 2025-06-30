import React from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
  containerClassName?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
  className = '',
  containerClassName = ''
}) => {
  return (
    <ErrorBoundary>
      <div className={`min-h-screen flex flex-col ${className}`}>
        {showHeader && <Header />}
        
        <main className={`flex-1 ${containerClassName}`}>
          {children}
        </main>
        
        {showFooter && <Footer />}
      </div>
    </ErrorBoundary>
  );
};

export default Layout; 