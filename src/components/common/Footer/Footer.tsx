import React from 'react';
import Link from 'next/link';
import { APP_CONFIG } from '@/config/app.config';
import { ROUTES } from '@/config/routes.config';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-2">
            <Link href={ROUTES.HOME} className="inline-block mb-4">
              <img
                src="/logo-white.png"
                alt={APP_CONFIG.name}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-gray-300 mb-4 max-w-md">
              {APP_CONFIG.description}
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <p>
                <strong>Adres:</strong> {APP_CONFIG.contact.address}
              </p>
              <p>
                <strong>Telefon:</strong>{' '}
                <a 
                  href={`tel:${APP_CONFIG.contact.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {APP_CONFIG.contact.phone}
                </a>
              </p>
              <p>
                <strong>E-posta:</strong>{' '}
                <a 
                  href={`mailto:${APP_CONFIG.contact.email}`}
                  className="hover:text-white transition-colors"
                >
                  {APP_CONFIG.contact.email}
                </a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href={ROUTES.ABOUT}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link 
                  href={ROUTES.SERVICES}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Hizmetlerimiz
                </Link>
              </li>
              <li>
                <Link 
                  href={ROUTES.PRODUCTS}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Ürünler
                </Link>
              </li>
              <li>
                <Link 
                  href={ROUTES.REFERENCES}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Referanslar
                </Link>
              </li>
              <li>
                <Link 
                  href={ROUTES.CONTACT}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Yasal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href={ROUTES.PRIVACY}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link 
                  href={ROUTES.TERMS}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Kullanım Şartları
                </Link>
              </li>
              <li>
                <Link 
                  href={ROUTES.COOKIES}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Çerez Politikası
                </Link>
              </li>
              <li>
                <Link 
                  href={ROUTES.KVKK}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  KVKK
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} {APP_CONFIG.name}. Tüm hakları saklıdır.
          </div>
          
          {/* Social Media Links */}
          <div className="flex space-x-4">
            {APP_CONFIG.social.facebook && (
              <a
                href={APP_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            )}
            
            {APP_CONFIG.social.twitter && (
              <a
                href={APP_CONFIG.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            )}
            
            {APP_CONFIG.social.linkedin && (
              <a
                href={APP_CONFIG.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            )}
            
            {APP_CONFIG.social.instagram && (
              <a
                href={APP_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.014 5.367 18.635.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.926 3.708 13.775 3.708 12.478s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-7.83c-.928-.875-2.026-1.418-3.323-1.418s-2.448.543-3.323 1.418c-.875.928-1.418 2.026-1.418 3.323s.543 2.448 1.418 3.323c.875.928 2.026 1.418 3.323 1.418s2.448-.49 3.323-1.418c.928-.875 1.418-2.026 1.418-3.323s-.49-2.448-1.418-3.323z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 