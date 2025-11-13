import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * 🎯 CHRONOS BUTTON - Botón premium con variantes y animaciones
 */
export const ChronosButton = ({
  children,
  variant = 'primary', // primary, secondary, ghost, danger
  size = 'md', // sm, md, lg
  icon: Icon,
  iconPosition = 'left',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  fullWidth = false
}) => {
  const variants = {
    primary: 'bg-white text-black hover:bg-white/90',
    secondary: 'bg-white/10 text-white hover:bg-white/15 border border-white/20',
    ghost: 'bg-transparent text-white hover:bg-white/5 border border-white/10',
    danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden rounded-sm font-light tracking-wide
        transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={{
        boxShadow: variant === 'primary' ? '0 4px 14px rgba(255,255,255,0.1)' : 'none'
      }}
    >
      {/* Loading spinner */}
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      )}

      {/* Icon left */}
      {Icon && iconPosition === 'left' && !loading && (
        <Icon className={sizes[size] === 'text-xs' ? 'w-3 h-3' : 'w-4 h-4'} />
      )}

      {/* Text */}
      {!loading && children}

      {/* Icon right */}
      {Icon && iconPosition === 'right' && !loading && (
        <Icon className={sizes[size] === 'text-xs' ? 'w-3 h-3' : 'w-4 h-4'} />
      )}

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
        animate={{
          x: ['-200%', '200%']
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'linear'
        }}
      />
    </motion.button>
  );
};

/**
 * 🎯 CHRONOS INPUT - Input premium con efectos
 */
export const ChronosInput = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  label,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = React.useState(false);

  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label className="block text-xs text-white/60 mb-2 tracking-wide">
          {label}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {/* Icon */}
        {Icon && (
          <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
            focused ? 'text-white' : 'text-white/40'
          }`} />
        )}

        {/* Input */}
        <motion.input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          animate={{
            borderColor: focused
              ? 'rgba(255,255,255,0.3)'
              : error
              ? 'rgba(239,68,68,0.3)'
              : 'rgba(255,255,255,0.1)'
          }}
          className={`
            w-full px-4 py-2.5 bg-white/5 border rounded-sm
            text-white text-sm placeholder-white/30 outline-none
            transition-all duration-300
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500/30' : 'border-white/10'}
          `}
          {...props}
        />

        {/* Glow effect */}
        {focused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 rounded-sm pointer-events-none"
            style={{
              boxShadow: '0 0 20px rgba(255,255,255,0.1)'
            }}
          />
        )}
      </div>

      {/* Error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400 mt-2"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

/**
 * 🎯 CHRONOS MODAL - Modal premium con backdrop blur
 */
export const ChronosModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'md', // sm, md, lg, xl
  showClose = true
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 backdrop-blur-xl bg-black/60"
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className={`
          relative z-10 w-full ${sizes[size]}
          backdrop-blur-xl bg-white/10 border border-white/20 rounded-sm
          shadow-[0_20px_60px_rgba(0,0,0,0.3)]
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-light text-white tracking-wider">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-white/50 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {showClose && (
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-sm transition-colors"
            >
              <X className="w-5 h-5 text-white/70" />
            </motion.button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChronosButton;
