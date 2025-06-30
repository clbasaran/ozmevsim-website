import React, { forwardRef } from 'react';
import { cn } from '@/utils/helpers';
import type { InputProps } from './types';

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    type = 'text',
    variant = 'default',
    size = 'md',
    error,
    success,
    disabled = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    label,
    helperText,
    placeholder,
    className,
    ...props
  }, ref) => {
    const baseClasses = [
      'border rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'placeholder:text-gray-400'
    ];

    const variantClasses = {
      default: [
        'border-gray-300 bg-white text-gray-900',
        'focus:border-blue-500 focus:ring-blue-500',
        'hover:border-gray-400'
      ],
      filled: [
        'border-transparent bg-gray-100 text-gray-900',
        'focus:bg-white focus:border-blue-500 focus:ring-blue-500',
        'hover:bg-gray-200'
      ],
      outline: [
        'border-2 border-gray-300 bg-transparent text-gray-900',
        'focus:border-blue-500 focus:ring-blue-500',
        'hover:border-gray-400'
      ]
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-4 py-3 text-lg'
    };

    const stateClasses = {
      error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
      success: 'border-green-500 focus:border-green-500 focus:ring-green-500'
    };

    const widthClasses = fullWidth ? 'w-full' : '';

    const inputClasses = cn(
      baseClasses,
      variantClasses[variant as keyof typeof variantClasses],
      sizeClasses[size as keyof typeof sizeClasses],
      error && stateClasses.error,
      success && stateClasses.success,
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      widthClasses,
      className
    );

    const containerClasses = cn(
      'relative',
      fullWidth ? 'w-full' : 'inline-block'
    );

    return (
      <div className={containerClasses}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">{leftIcon}</span>
            </div>
          )}
          
          <input
            ref={ref}
            type={type}
            className={inputClasses}
            placeholder={placeholder}
            disabled={disabled}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400">{rightIcon}</span>
            </div>
          )}
        </div>
        
        {(helperText || error) && (
          <p className={cn(
            'mt-1 text-sm',
            error ? 'text-red-600' : success ? 'text-green-600' : 'text-gray-500'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 