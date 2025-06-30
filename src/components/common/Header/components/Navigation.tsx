import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import type { NavigationProps } from '../types';

export const Navigation: React.FC<NavigationProps> = ({
  menuItems,
  isScrolled,
  activeSubmenu,
  setActiveSubmenu,
}) => {
  return (
    <nav className="hidden lg:flex items-center justify-center flex-1">
      <div className="flex items-center space-x-8">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className="relative group"
            onMouseEnter={() => setActiveSubmenu(item.label)}
            onMouseLeave={() => setActiveSubmenu(null)}
          >
            <Link
              href={item.href}
              className={`font-medium transition-colors duration-300 hover:text-primary-600 flex items-center ${
                isScrolled ? 'text-gray-700' : 'text-white hover:text-primary-200'
              }`}
            >
              {item.label}
              {item.submenu && (
                <ChevronDownIcon className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              )}
            </Link>

            {/* Submenu Dropdown */}
            <AnimatePresence>
              {item.submenu && activeSubmenu === item.label && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
                >
                  <div className="py-2">
                    {item.submenu.map((subItem, index) => (
                      <Link
                        key={index}
                        href={subItem.href}
                        className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <div className="font-medium">{subItem.label}</div>
                        {subItem.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {subItem.description}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </nav>
  );
}; 