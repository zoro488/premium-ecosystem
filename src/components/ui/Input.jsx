import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className,
  label,
  error,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-200 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        )}
        
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={clsx(
            // Estilos base
            'w-full rounded-xl transition-all duration-200',
            'bg-white/5 backdrop-blur-xl border border-white/10',
            'text-white placeholder-slate-400',
            'focus:bg-white/10 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            
            // Padding dependiendo del icono
            Icon && iconPosition === 'left' ? 'pl-10 pr-4 py-3' : 'px-4 py-3',
            Icon && iconPosition === 'right' ? 'pl-4 pr-10 py-3' : '',
            !Icon ? 'px-4 py-3' : '',
            
            // Error state
            error ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/20' : '',
            
            // Clases adicionales
            className
          )}
          {...props}
        />
        
        {Icon && iconPosition === 'right' && (
          <Icon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

const Textarea = ({
  placeholder,
  value,
  onChange,
  className,
  label,
  error,
  disabled = false,
  rows = 4,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-200 mb-2">
          {label}
        </label>
      )}
      
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        className={clsx(
          // Estilos base
          'w-full px-4 py-3 rounded-xl transition-all duration-200 resize-none',
          'bg-white/5 backdrop-blur-xl border border-white/10',
          'text-white placeholder-slate-400',
          'focus:bg-white/10 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          
          // Error state
          error ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/20' : '',
          
          // Clases adicionales
          className
        )}
        {...props}
      />
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export { Input, Textarea };
export default Input;