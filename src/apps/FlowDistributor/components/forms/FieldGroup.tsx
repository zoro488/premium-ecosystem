/**
 * FieldGroup Component
 * Groups related form fields
 */
import React from 'react';

interface FieldGroupProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FieldGroup: React.FC<FieldGroupProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {(title || description) && (
        <div>
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
};
