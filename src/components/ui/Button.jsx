
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const buttonVariants = {
  // Tamaños
  sizes: {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  },
  // Variantes de estilo
  variants: {
    primary:
      'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/25',
    secondary: 'glass-strong hover:glass-card text-slate-200 border-slate-600/50',
    outline: 'border border-blue-500/50 hover:border-blue-400 hover:bg-blue-500/10 text-blue-400',
    ghost: 'hover:bg-white/5 text-slate-300 hover:text-white',
    danger:
      'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25',
    success:
      'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/25',
  },
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={clsx(
        // Estilos base
        'inline-flex items-center justify-center gap-2 font-medium rounded-xl',
        'transition-all duration-200 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-slate-900',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',

        // Tamaños
        buttonVariants.sizes[size],

        // Variantes
        buttonVariants.variants[variant],

        // Clases adicionales
        className
      )}
      {...props}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      )}
      {children}
    </motion.button>
  );
};

export default Button;
