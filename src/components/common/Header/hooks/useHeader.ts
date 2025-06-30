import { useState, useEffect } from 'react';
import { ROUTES } from '@/config/routes.config';
import type { MenuItemType } from '../types';

export function useHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };

    // Listen for route changes if using Next.js router
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handleRouteChange);
      return () => window.removeEventListener('popstate', handleRouteChange);
    }
  }, []);

  // Menu items configuration
  const menuItems: MenuItemType[] = [
    {
      label: 'Ana Sayfa',
      href: ROUTES.HOME
    },
    {
      label: 'Hakkımızda',
      href: ROUTES.ABOUT
    },
    {
      label: 'Hizmetler',
      href: ROUTES.SERVICES,
      submenu: [
        {
          label: 'IoT Hizmetleri',
          href: ROUTES.IOT_SERVICE,
          description: 'Akıllı ısı sistemleri ve IoT çözümleri'
        }
      ]
    },
    {
      label: 'Ürünler',
      href: ROUTES.PRODUCTS
    },
    {
      label: 'Projeler',
      href: ROUTES.PROJECTS
    },
    {
      label: 'Referanslar',
      href: ROUTES.REFERENCES
    },
    {
      label: 'Blog',
      href: ROUTES.BLOG
    },
    {
      label: 'S.S.S',
      href: ROUTES.FAQ
    },
    {
      label: 'İletişim',
      href: ROUTES.CONTACT
    }
  ];

  return {
    isMenuOpen,
    setIsMenuOpen,
    isScrolled,
    activeSubmenu,
    setActiveSubmenu,
    menuItems,
  };
} 