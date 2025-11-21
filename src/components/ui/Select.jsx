import { useEffect, useRef, useState } from 'react';

import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = 'Seleccionar...',
  label,
  error,
  disabled = false,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2" ref={selectRef}>
      {label && <label className="block text-sm font-medium text-slate-200 mb-2">{label}</label>}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={clsx(
            // Estilos base
            'w-full px-4 py-3 rounded-xl transition-all duration-200',
            'bg-white/5 backdrop-blur-xl border border-white/10',
            'text-left flex items-center justify-between',
            'focus:bg-white/10 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20',
            'disabled:opacity-50 disabled:cursor-not-allowed',

            // Estado de error
            error ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/20' : '',

            // Clases adicionales
            className
          )}
          {...props}
        >
          <span className={selectedOption ? 'text-white' : 'text-slate-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </motion.div>
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={clsx(
                'absolute top-full left-0 right-0 z-50 mt-2',
                'glass-strong rounded-xl border border-white/20',
                'shadow-2xl shadow-black/50',
                'max-h-60 overflow-y-auto'
              )}
            >
              {options.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={clsx(
                    'w-full px-4 py-3 text-left transition-colors duration-150',
                    'flex items-center justify-between',
                    'hover:bg-white/10 focus:bg-white/10 focus:outline-none',
                    'first:rounded-t-xl last:rounded-b-xl',
                    option.value === value ? 'bg-blue-500/20 text-blue-300' : 'text-slate-200'
                  )}
                >
                  <span>{option.label}</span>
                  {option.value === value && <Check className="w-4 h-4 text-blue-400" />}
                </motion.button>
              ))}

              {options.length === 0 && (
                <div className="px-4 py-3 text-slate-400 text-sm text-center">
                  No hay opciones disponibles
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
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

// Subcomponentes para compatibilidad con shadcn/ui API
export const SelectTrigger = ({ children, className, ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

export const SelectValue = ({ placeholder }) => <span>{placeholder}</span>;

export const SelectContent = ({ children, className, ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

export const SelectItem = ({ value, children, ...props }) => (
  <div data-value={value} {...props}>
    {children}
  </div>
);

export { Select };
export default Select;
