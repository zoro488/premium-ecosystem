/**
 * 🌌 UI COMPONENTS - SPATIAL GLASSMORPHISM PREMIUM
 * Componentes base con diseño espacial unificado
 * Inspired by: Apple, Stripe, Linear, Vercel
 */

import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2, LucideIcon } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'glass';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

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
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

const animations = {
  button: {
    initial: { scale: 1 },
    hover: {
      scale: 1.02,
      y: -2,
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as any }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  },
  card: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as any }
    },
    hover: {
      y: -4,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as any }
    }
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  spinner: {
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity, ease: 'linear' as any }
  }
};

// ═══════════════════════════════════════════════════════════════════
// BUTTON SPATIAL PREMIUM
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
      'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none backdrop-blur-lg relative overflow-hidden group';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 text-white border border-blue-400/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] focus:ring-blue-500 animate-gradient bg-[length:200%_200%]',
      secondary:
        'bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 text-white border border-purple-400/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] focus:ring-purple-500 animate-gradient bg-[length:200%_200%]',
      success:
        'bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 text-white border border-emerald-400/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] focus:ring-emerald-500',
      danger:
        'bg-gradient-to-br from-red-500 via-rose-500 to-red-600 text-white border border-red-400/30 hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] focus:ring-red-500',
      ghost:
        'bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-white/20 focus:ring-cyan-500',
      glass:
        'bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/15 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] focus:ring-white/50',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
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
        {/* Shine Effect */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        {loading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
        <span className="relative">{children}</span>
        {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

// ═══════════════════════════════════════════════════════════════════
// CARD SPATIAL PREMIUM
// ═══════════════════════════════════════════════════════════════════

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'glass' | 'glass-light' | 'glass-dark' | 'mirror' | 'holo';
  hover?: boolean;
  glow?: 'blue' | 'cyan' | 'purple' | 'pink' | 'none';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'glass', hover = true, glow = 'none', className = '', children, ...props }, ref) => {
    const baseStyles = 'rounded-2xl p-6 transition-all duration-300 backdrop-blur-2xl relative overflow-hidden group';

    const variants = {
      glass:
        'bg-white/5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.1)]',
      'glass-light':
        'bg-white/10 border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.15)]',
      'glass-dark':
        'bg-black/60 border border-white/8 shadow-[0_8px_32px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.08)]',
      mirror:
        'bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.9),inset_0_2px_0_rgba(255,255,255,0.2)]',
      holo:
        'bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.9)] animate-gradient bg-[length:200%_200%]',
    };

    const glowStyles = {
      blue: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.4),0_8px_32px_rgba(0,0,0,0.9)]',
      cyan: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.4),0_8px_32px_rgba(0,0,0,0.9)]',
      purple: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.4),0_8px_32px_rgba(0,0,0,0.9)]',
      pink: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.4),0_8px_32px_rgba(0,0,0,0.9)]',
      none: '',
    };

    return (
      <motion.div
        ref={ref}
        variants={hover ? animations.card : undefined}
        initial="initial"
        animate="animate"
        whileHover={hover ? 'hover' : undefined}
        className={`${baseStyles} ${variants[variant]} ${glowStyles[glow]} ${className}`}
        {...props}
      >
        {/* Top Border Glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

// ═══════════════════════════════════════════════════════════════════
// BADGE SPATIAL PREMIUM
// ═══════════════════════════════════════════════════════════════════

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  pulse?: boolean;
  icon?: LucideIcon;
  className?: string;
  children: ReactNode;
}

const badgeAnimations = {
  idle: { scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut' as any
    }
  }
};

export const Badge = ({
  variant = 'neutral',
  pulse = false,
  icon: Icon,
  className = '',
  children,
}: BadgeProps) => {
  const baseStyles =
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xl transition-all duration-300';

  const variants: Record<BadgeVariant, string> = {
    success: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    warning: 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
    danger: 'bg-red-500/20 text-red-300 border border-red-400/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
    info: 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    neutral: 'bg-white/10 text-slate-200 border border-white/20',
  };

  return (
    <motion.span
      variants={pulse ? badgeAnimations : undefined}
      initial="idle"
      animate={pulse ? 'pulse' : 'idle'}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </motion.span>
  );
};

// ═══════════════════════════════════════════════════════════════════
// INPUT SPATIAL PREMIUM
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
      'w-full px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:bg-white/8 transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.5)]';

    const errorStyles = error ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' : '';
    const iconPadding = Icon ? (iconPosition === 'left' ? 'pl-12' : 'pr-12') : '';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-slate-200 mb-2 tracking-wide">
            {label}
          </label>
        )}
        <div className="relative group">
          {Icon && iconPosition === 'left' && (
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors duration-300" />
          )}
          <input
            ref={ref}
            className={`${baseStyles} ${errorStyles} ${iconPadding} ${className}`}
            {...props}
          />
          {Icon && iconPosition === 'right' && (
            <Icon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors duration-300" />
          )}
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-400 font-medium"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ═══════════════════════════════════════════════════════════════════
// SELECT SPATIAL PREMIUM
// ═══════════════════════════════════════════════════════════════════

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string | number; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    const baseStyles =
      'w-full px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:bg-white/8 transition-all duration-300 cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.5)]';

    const errorStyles = error ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' : '';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-slate-200 mb-2 tracking-wide">
            {label}
          </label>
        )}
        <select ref={ref} className={`${baseStyles} ${errorStyles} ${className}`} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-black/95 text-white py-2">
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-400 font-medium"
          >
            {error}
          </motion.p>
        )}
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
