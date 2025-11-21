/**
 * ButtonGroup Component
 * Groups action buttons
 */
import React from 'react';

interface ButtonGroupProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  align = 'right',
  className = '',
}) => {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div className={`flex items-center gap-3 ${alignClasses[align]} ${className}`}>
      {children}
    </div>
  );
};
