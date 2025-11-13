// ============================================================================
// CHRONOS BUTTON - Premium Button Component
// Botón con variantes glassmorphism y animaciones
// ============================================================================

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ChronosButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses = {
  primary: 'btn-primary',
  secondary: 'px-6 py-3 rounded-xl glass text-chronos-pearl font-medium hover:scale-105 active:scale-95 transition-all duration-200 border border-chronos-smoke hover:border-metal-titanium',
  ghost: 'px-4 py-2 rounded-lg text-chronos-silver font-medium hover:bg-chronos-graphite active:bg-chronos-charcoal transition-colors duration-150',
  danger: 'px-6 py-3 rounded-xl glass-dark text-neon-red font-medium hover:scale-105 active:scale-95 transition-all duration-200 border border-neon-red/30 hover:border-neon-red shadow-neon-red/20',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function ChronosButton({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  onClick,
  type,
}: ChronosButtonProps) {
  const baseClass = variantClasses[variant];
  const sizeClass = variant !== 'primary' && variant !== 'secondary' ? sizeClasses[size] : '';

  return (
    <motion.button
      className={`
        ${baseClass}
        ${sizeClass}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
        flex items-center justify-center gap-2
      `}
      whileTap={!disabled && !loading ? { scale: 0.95 } : undefined}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-chronos-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        </>
      )}
    </motion.button>
  );
}

export default ChronosButton;
