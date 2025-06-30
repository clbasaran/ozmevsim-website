import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/helpers';
import type { ModalProps } from './types';

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
  backdropClassName,
  contentClassName
}) => {
  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  const backdropClasses = cn(
    'fixed inset-0 z-50 flex items-center justify-center',
    'bg-black bg-opacity-50 backdrop-blur-sm',
    'animate-in fade-in duration-200',
    backdropClassName
  );

  const contentClasses = cn(
    'relative bg-white rounded-lg shadow-xl',
    'max-h-[90vh] overflow-hidden',
    'animate-in zoom-in-95 duration-200',
    sizeClasses[size as keyof typeof sizeClasses],
    'w-full',
    contentClassName
  );

  const modalContent = (
    <div
      className={backdropClasses}
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        className={contentClasses}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Modalı kapat"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={cn('overflow-y-auto', className)}>
          {children}
        </div>
      </div>
    </div>
  );

  // Render modal in portal
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return null;
};

export default Modal; 