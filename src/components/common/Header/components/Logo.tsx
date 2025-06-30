import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/config/routes.config';
import { APP_CONFIG } from '@/config/app.config';
import type { LogoProps } from '../types';

export const Logo: React.FC<LogoProps> = ({ isScrolled, className = '' }) => {
  return (
    <Link href={ROUTES.HOME} className={`flex items-center space-x-3 flex-shrink-0 ${className}`}>
      <div className="relative w-24 h-24">
        <Image
          src="/Mevsim-4.png"
          alt="Öz Mevsim Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="flex flex-col">
        <span className={`text-xl font-bold ${
          isScrolled ? 'text-gray-900' : 'text-white'
        }`}>
          {APP_CONFIG.name}
        </span>
        <span className={`text-sm ${
          isScrolled ? 'text-gray-600' : 'text-gray-200'
        }`}>
          Isı Sistemleri Mühendislik
        </span>
      </div>
    </Link>
  );
}; 