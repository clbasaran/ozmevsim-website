import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { MobileMenuProps } from '../types';

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  menuItems,
}) => {
  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="fixed top-20 left-0 right-0 z-40 bg-white dark:bg-gray-900 shadow-lg lg:hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="space-y-4">
              {menuItems.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    onClick={handleMenuItemClick}
                    className="block py-3 px-4 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-300 font-medium"
                  >
                    {item.label}
                  </Link>
                  
                  {/* Submenu items for mobile */}
                  {item.submenu && (
                    <div className="ml-4 mt-2 space-y-2">
                      {item.submenu.map((subItem, index) => (
                        <Link
                          key={index}
                          href={subItem.href}
                          onClick={handleMenuItemClick}
                          className="block py-2 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-300 text-sm"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 