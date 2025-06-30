'use client';

import React from 'react';
import { useHeader } from './hooks/useHeader';
import { TopBar } from './components/TopBar';
import { Logo } from './components/Logo';
import { Navigation } from './components/Navigation';
import { MobileMenu } from './components/MobileMenu';
import { MobileMenuButton } from './components/MobileMenuButton';

const Header: React.FC = () => {
  const {
    isMenuOpen,
    setIsMenuOpen,
    isScrolled,
    activeSubmenu,
    setActiveSubmenu,
    menuItems,
  } = useHeader();

  return (
    <>
      {/* Unified Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 shadow-lg backdrop-blur-lg backdrop-saturate-150' 
            : 'bg-black/10 backdrop-blur-sm'
        }`}
      >
        <TopBar isScrolled={isScrolled} />

        {/* Main Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Logo isScrolled={isScrolled} />
            
            <Navigation
              menuItems={menuItems}
              isScrolled={isScrolled}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
            />

            <MobileMenuButton
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              isScrolled={isScrolled}
            />
          </div>
        </div>
      </header>

      <MobileMenu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        menuItems={menuItems}
      />
    </>
  );
};

export default Header; 