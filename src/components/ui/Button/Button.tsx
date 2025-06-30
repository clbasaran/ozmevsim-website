import React from 'react';
import { cn } from '@/utils/helpers';
import type { ButtonProps } from './types';

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className,
  ...props
}) => {
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-medium rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'relative overflow-hidden'
  ];

  const variantClasses = {
    primary: [
      'bg-blue-600 text-white hover:bg-blue-700',
      'focus:ring-blue-500 active:bg-blue-800'
    ],
    secondary: [
      'bg-gray-200 text-gray-900 hover:bg-gray-300',
      'focus:ring-gray-500 active:bg-gray-400'
    ],
    outline: [
      'border-2 border-blue-600 text-blue-600 bg-transparent',
      'hover:bg-blue-50 focus:ring-blue-500 active:bg-blue-100'
    ],
    ghost: [
      'text-gray-700 bg-transparent hover:bg-gray-100',
      'focus:ring-gray-500 active:bg-gray-200'
    ],
    danger: [
      'bg-red-600 text-white hover:bg-red-700',
      'focus:ring-red-500 active:bg-red-800'
    ],
    success: [
      'bg-green-600 text-white hover:bg-green-700',
      'focus:ring-green-500 active:bg-green-800'
    ]
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  const buttonClasses = cn(
    baseClasses,
    variantClasses[variant as keyof typeof variantClasses],
    sizeClasses[size as keyof typeof sizeClasses],
    widthClasses,
    className
  );

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <span className={cn('flex items-center gap-2', loading && 'opacity-0')}>
        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </span>
    </button>
  );
};

export default Button; 