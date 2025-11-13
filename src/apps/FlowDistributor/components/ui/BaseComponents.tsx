/**
 * 🎨 UI COMPONENTS - ULTRA PREMIUM
 * Componentes base reutilizables con glassmorphism y animaciones
 */

import { motion, type HTMLMotionProps } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { animations } from '../utils/animations';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'glass';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}

// ═══════════════════════════════════════════════════════════════════
// BUTTON
// ═══════════════════════════════════════════════════════════════════

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      loading = false,
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 focus:ring-cyan-500 shadow-glow-blue',
      secondary:
        'bg-slate-800 text-slate-100 hover:bg-slate-700 focus:ring-slate-600 border border-slate-700',
      success:
        'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 focus:ring-emerald-500',
      danger:
        'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 focus:ring-red-500',
      ghost:
        'bg-transparent text-slate-300 hover:bg-white/5 hover:text-white focus:ring-slate-600',
      glass:
        'bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 focus:ring-cyan-500',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <motion.button
        ref={ref}
        variants={animations.button}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        disabled={disabled || loading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
        {...props}
      >
        {loading && (
          <motion.div
            variants={animations.spinner}
            animate="animate"
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          />
        )}
        {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
        {children}
        {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

// ═══════════════════════════════════════════════════════════════════
// CARD
// ═══════════════════════════════════════════════════════════════════

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'glass' | 'solid';
  hover?: boolean;
  glow?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'glass', hover = true, glow = false, className = '', children, ...props }, ref) => {
    const baseStyles = 'rounded-xl p-6 transition-all duration-300';

    const variants = {
      glass:
        'bg-white/5 backdrop-blur-xl border border-white/10 shadow-glass hover:shadow-glass-lg',
      solid: 'bg-slate-900 border border-slate-800 shadow-xl',
    };

    const glowStyle = glow ? 'shadow-glow-cyan' : '';

    return (
      <motion.div
        ref={ref}
        variants={hover ? animations.cardGlass : undefined}
        initial="initial"
        whileHover={hover ? 'hover' : undefined}
        className={`${baseStyles} ${variants[variant]} ${glowStyle} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

// ═══════════════════════════════════════════════════════════════════
// BADGE
// ═══════════════════════════════════════════════════════════════════

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  pulse?: boolean;
  icon?: LucideIcon;
  className?: string;
  children: ReactNode;
}

export const Badge = ({
  variant = 'neutral',
  pulse = false,
  icon: Icon,
  className = '',
  children,
}: BadgeProps) => {
  const baseStyles =
    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium';

  const variants: Record<BadgeVariant, string> = {
    success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
    info: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
    neutral: 'bg-slate-700/50 text-slate-300 border border-slate-600/50',
  };

  return (
    <motion.span
      variants={pulse ? animations.badge : undefined}
      initial="idle"
      animate={pulse ? 'pulse' : 'idle'}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </motion.span>
  );
};

// ═══════════════════════════════════════════════════════════════════
// INPUT
// ═══════════════════════════════════════════════════════════════════

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, iconPosition = 'left', className = '', ...props }, ref) => {
    const baseStyles =
      'w-full px-4 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200';

    const errorStyles = error ? 'border-red-500/50 focus:ring-red-500' : '';
    const iconPadding = Icon ? (iconPosition === 'left' ? 'pl-11' : 'pr-11') : '';

    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>}
        <div className="relative">
          {Icon && iconPosition === 'left' && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          )}
          <input
            ref={ref}
            className={`${baseStyles} ${errorStyles} ${iconPadding} ${className}`}
            {...props}
          />
          {Icon && iconPosition === 'right' && (
            <Icon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ═══════════════════════════════════════════════════════════════════
// SELECT
// ═══════════════════════════════════════════════════════════════════

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string | number; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    const baseStyles =
      'w-full px-4 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 cursor-pointer';

    const errorStyles = error ? 'border-red-500/50 focus:ring-red-500' : '';

    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>}
        <select ref={ref} className={`${baseStyles} ${errorStyles} ${className}`} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-900">
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

// ═══════════════════════════════════════════════════════════════════
// SKELETON
// ═══════════════════════════════════════════════════════════════════

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton = ({ className = '', variant = 'rectangular' }: SkeletonProps) => {
  const baseStyles = 'animate-pulse bg-slate-800/50';

  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return <div className={`${baseStyles} ${variants[variant]} ${className}`} />;
};

// ═══════════════════════════════════════════════════════════════════
// TOOLTIP
// ═══════════════════════════════════════════════════════════════════

interface TooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactNode;
}

export const Tooltip = ({ content, position = 'top', children }: TooltipProps) => {
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative group">
      {children}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileHover={{ opacity: 1, scale: 1 }}
        className={`absolute ${positions[position]} px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-xl`}
      >
        {content}
      </motion.div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// SPINNER
// ═══════════════════════════════════════════════════════════════════

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <motion.div
      variants={animations.spinner}
      animate="animate"
      className={`${sizes[size]} border-cyan-500/30 border-t-cyan-500 rounded-full ${className}`}
    />
  );
};
