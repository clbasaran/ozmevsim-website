import React from 'react';
import { cn } from '@/utils/helpers';

export type LoaderVariant = 'spinner' | 'dots' | 'pulse' | 'bars';
export type LoaderSize = 'sm' | 'md' | 'lg' | 'xl';

export interface LoaderProps {
  variant?: LoaderVariant;
  size?: LoaderSize;
  color?: string;
  text?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  variant = 'spinner',
  size = 'md',
  color = 'text-blue-600',
  text,
  className
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const baseClasses = cn(
    sizeClasses[size],
    color,
    className
  );

  const renderSpinner = () => (
    <div
      className={cn(
        baseClasses,
        'animate-spin rounded-full border-2 border-current border-t-transparent'
      )}
    />
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            sizeClasses[size],
            color,
            'rounded-full animate-pulse'
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      className={cn(
        baseClasses,
        'rounded-full animate-pulse bg-current'
      )}
    />
  );

  const renderBars = () => (
    <div className="flex space-x-1 items-end">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            'w-1 bg-current animate-pulse',
            size === 'sm' ? 'h-3' : size === 'md' ? 'h-4' : size === 'lg' ? 'h-6' : 'h-8',
            color
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.8s'
          }}
        />
      ))}
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'bars':
        return renderBars();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {renderLoader()}
      {text && (
        <p className={cn(
          'text-gray-600 font-medium',
          textSizeClasses[size]
        )}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader; 