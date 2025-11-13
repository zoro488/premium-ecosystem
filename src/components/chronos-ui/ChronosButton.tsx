import { motion } from 'framer-motion';
import { Loader2, LucideIcon } from 'lucide-react';
import React from 'react';

interface ChronosButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  Icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const variantStyles = {
  primary: 'bg-gradient-to-r from-neon-blue to-neon-cyan text-white hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]',
  secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20',
  success: 'bg-gradient-to-r from-neon-green to-emerald-400 text-white hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]',
  danger: 'bg-gradient-to-r from-neon-pink to-red-500 text-white hover:shadow-[0_0_30px_rgba(236,72,153,0.5)]',
  ghost: 'bg-transparent text-white hover:bg-white/5',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const ChronosButton: React.FC<ChronosButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      className={`
        relative font-semibold rounded-xl
        transition-all duration-300
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <span className="flex items-center justify-center space-x-2">
        {loading && <Loader2 className="animate-spin" size={18} />}
        {!loading && Icon && iconPosition === 'left' && <Icon size={18} />}
        <span>{children}</span>
        {!loading && Icon && iconPosition === 'right' && <Icon size={18} />}
      </span>
    </motion.button>
  );
};

export default ChronosButton;
