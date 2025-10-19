import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}) => {
  const variants = {
    default: 'bg-slate-100/10 text-slate-200 border border-slate-700/50',
    primary: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    secondary: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
    success: 'bg-green-500/20 text-green-300 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-300 border border-red-500/30',
    info: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
    purple: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={clsx(
        // Estilos base
        'inline-flex items-center gap-1 font-medium rounded-lg backdrop-blur-xl',
        'transition-all duration-200 ease-in-out',
        
        // Tamaños
        sizes[size],
        
        // Variantes
        variants[variant],
        
        // Clases adicionales
        className
      )}
      {...props}
    >
      {children}
    </motion.span>
  );
};

export default Badge;