import React from 'react';
import { 
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { APP_CONFIG } from '@/config/app.config';
import type { TopBarProps } from '../types';

export const TopBar: React.FC<TopBarProps> = ({ isScrolled }) => {
  return (
    <div className={`bg-primary-600 text-white py-2 text-sm transition-all duration-300 ${
      isScrolled ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100'
    } hidden lg:block`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <PhoneIcon className="h-4 w-4" />
              <span>{APP_CONFIG.contact.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <EnvelopeIcon className="h-4 w-4" />
              <span>{APP_CONFIG.contact.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-4 w-4" />
              <span>Pazartesi - Cumartesi: 08:00 - 18:00</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <MapPinIcon className="h-4 w-4" />
            <span>{APP_CONFIG.contact.address}</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 