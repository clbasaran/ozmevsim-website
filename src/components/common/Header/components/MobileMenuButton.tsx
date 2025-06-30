import React from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import type { MobileMenuButtonProps } from '../types';

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  isScrolled,
}) => {
  return (
    <button
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      className={`lg:hidden p-2 rounded-md transition-colors duration-300 ${
        isScrolled 
          ? 'text-gray-700 hover:bg-gray-100' 
          : 'text-white hover:bg-white/10'
      }`}
      aria-label={isMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
    >
      {isMenuOpen ? (
        <XMarkIcon className="h-6 w-6" />
      ) : (
        <Bars3Icon className="h-6 w-6" />
      )}
    </button>
  );
}; 