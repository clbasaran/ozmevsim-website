import React from 'react';
import { cn } from '@/utils/helpers';

export type CardVariant = 'default' | 'outlined' | 'elevated' | 'flat';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type CardShadow = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  shadow?: CardShadow;
  border?: boolean;
  hover?: boolean;
  children: React.ReactNode;
  className?: string;
}

interface CardComponent extends React.FC<CardProps> {
  Header: React.FC<{ children: React.ReactNode; className?: string }>;
  Body: React.FC<{ children: React.ReactNode; className?: string }>;
  Footer: React.FC<{ children: React.ReactNode; className?: string }>;
  Title: React.FC<{ children: React.ReactNode; className?: string }>;
  Description: React.FC<{ children: React.ReactNode; className?: string }>;
}

const Card: CardComponent = ({
  variant = 'default',
  padding = 'md',
  shadow = 'md',
  border = true,
  hover = false,
  children,
  className,
  ...props
}) => {
  const baseClasses = [
    'bg-white rounded-lg transition-all duration-200'
  ];

  const variantClasses = {
    default: 'text-gray-900',
    outlined: 'border-2 border-gray-200',
    elevated: 'shadow-lg',
    flat: 'shadow-none'
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  const shadowClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const borderClasses = border ? 'border border-gray-200' : '';
  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1' : '';

  const cardClasses = cn(
    baseClasses,
    variantClasses[variant as keyof typeof variantClasses],
    paddingClasses[padding as keyof typeof paddingClasses],
    shadowClasses[shadow as keyof typeof shadowClasses],
    borderClasses,
    hoverClasses,
    className
  );

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

// Card Header Component
const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn('pb-4 border-b border-gray-200', className)}>
    {children}
  </div>
);

// Card Body Component
const CardBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn('py-4', className)}>
    {children}
  </div>
);

// Card Footer Component
const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn('pt-4 border-t border-gray-200', className)}>
    {children}
  </div>
);

// Card Title Component
const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <h3 className={cn('text-lg font-semibold text-gray-900', className)}>
    {children}
  </h3>
);

// Card Description Component
const CardDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <p className={cn('text-gray-600 mt-1', className)}>
    {children}
  </p>
);

// Attach sub-components to main Card component
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Description = CardDescription;

export default Card; 