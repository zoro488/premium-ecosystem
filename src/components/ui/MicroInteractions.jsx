/**
 * 💫 SISTEMA DE MICROINTERACCIONES PREMIUM
 * Componentes con animaciones sutiles y feedback táctil
 */
import { useEffect, useRef, useState } from 'react';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';

/**
 * 🌊 RIPPLE BUTTON - Botón con efecto ripple táctil
 */
export const RippleButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) => {
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);

  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30',
    secondary: 'bg-gray-800/60 border border-gray-700/50 text-white',
    success:
      'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30',
    danger: 'bg-gradient-to-r from-zinc-700 to-rose-500 text-white shadow-lg shadow-red-500/30',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const handleClick = (e) => {
    if (disabled) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      x,
      y,
      id: Date.now(),
    };

    setRipples([...ripples, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 800);

    onClick?.(e);
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        relative overflow-hidden rounded-xl font-semibold
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
          initial={{ width: 0, height: 0, x: '-50%', y: '-50%' }}
          animate={{ width: 300, height: 300, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      ))}
      {children}
    </motion.button>
  );
};

/**
 * 🏷️ FLOATING LABEL INPUT - Input con label flotante animado
 */
export const FloatingInput = ({
  label,
  value,
  onChange,
  type = 'text',
  error = '',
  success = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const shouldFloat = isFocused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className={`
          relative flex items-center rounded-xl border backdrop-blur-xl
          transition-all duration-300
          ${
            error
              ? 'border-red-500/50 bg-red-500/5'
              : success
                ? 'border-green-500/50 bg-green-500/5'
                : isFocused
                  ? 'border-blue-500/50 bg-blue-500/5 shadow-lg shadow-blue-500/20'
                  : 'border-gray-700/50 bg-gray-800/40'
          }
        `}
        animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
      >
        {Icon && (
          <motion.div
            className="ml-4"
            animate={{
              rotate: isFocused ? [0, -10, 10, -10, 0] : 0,
              color: error ? '#ef4444' : success ? '#10b981' : '#94a3b8',
            }}
            transition={{ duration: 0.5 }}
          >
            <Icon size={20} />
          </motion.div>
        )}

        <div className="relative flex-1">
          <input
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
              w-full px-4 py-4 bg-transparent text-white
              focus:outline-none transition-all
              ${Icon ? 'pl-2' : ''}
              ${shouldFloat ? 'pt-6 pb-2' : ''}
            `}
            {...props}
          />

          <motion.label
            className={`
              absolute left-4 pointer-events-none
              transition-all duration-200
              ${Icon ? 'left-2' : ''}
              ${error ? 'text-red-400' : success ? 'text-green-400' : 'text-gray-400'}
            `}
            animate={{
              top: shouldFloat ? '8px' : '50%',
              fontSize: shouldFloat ? '0.75rem' : '1rem',
              y: shouldFloat ? 0 : '-50%',
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {label}
          </motion.label>
        </div>

        {success && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="mr-4 text-green-400"
          >
            <Check size={20} />
          </motion.div>
        )}
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-400 flex items-center gap-2"
        >
          <span className="w-1 h-1 bg-red-400 rounded-full" />
          {error}
        </motion.p>
      )}
    </div>
  );
};

/**
 * 🔘 LIQUID TOGGLE - Toggle switch con efecto líquido
 */
export const LiquidToggle = ({ checked, onChange, label, disabled = false, size = 'md' }) => {
  const sizes = {
    sm: { width: 44, height: 24, circle: 18 },
    md: { width: 56, height: 28, circle: 22 },
    lg: { width: 68, height: 34, circle: 28 },
  };

  const s = sizes[size];
  const x = useMotionValue(checked ? s.width - s.circle - 4 : 2);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });

  useEffect(() => {
    x.set(checked ? s.width - s.circle - 4 : 2);
  }, [checked, s.width, s.circle, x]);

  return (
    <div className={`flex items-center gap-3 ${disabled ? 'opacity-50' : ''}`}>
      <motion.button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative rounded-full transition-all duration-300
          ${
            checked
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30'
              : 'bg-gray-700/50'
          }
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
        style={{ width: s.width, height: s.height }}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
      >
        <motion.div
          className="absolute top-1 bg-white rounded-full shadow-lg"
          style={{
            width: s.circle,
            height: s.circle,
            x: springX,
          }}
          animate={
            checked
              ? {
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                }
              : {}
          }
        />
      </motion.button>

      {label && <span className="text-sm text-gray-300">{label}</span>}
    </div>
  );
};

/**
 * ☑️ LIQUID CHECKBOX - Checkbox con animación líquida
 */
export const LiquidCheckbox = ({ checked, onChange, label, disabled = false }) => {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50' : ''}`}>
      <motion.div
        className={`
          relative w-6 h-6 rounded-lg border-2 flex items-center justify-center
          transition-all duration-300
          ${
            checked
              ? 'bg-gradient-to-br from-blue-500 to-cyan-500 border-blue-500'
              : 'bg-gray-800/40 border-gray-600'
          }
        `}
        whileHover={!disabled ? { scale: 1.1 } : {}}
        whileTap={!disabled ? { scale: 0.9 } : {}}
        onClick={() => !disabled && onChange(!checked)}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: checked ? 1 : 0,
            rotate: checked ? 0 : -180,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <Check size={16} className="text-white" />
        </motion.div>
      </motion.div>

      {label && <span className="text-sm text-gray-300">{label}</span>}
    </label>
  );
};

/**
 * 📋 ORIGAMI DROPDOWN - Dropdown con animación tipo origami
 */
export const OrigamiDropdown = ({
  value,
  onChange,
  options = [],
  placeholder = 'Seleccionar...',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`}>
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3 rounded-xl flex items-center justify-between
          backdrop-blur-xl border transition-all
          ${
            isOpen
              ? 'border-blue-500/50 bg-blue-500/5 shadow-lg shadow-blue-500/20'
              : 'border-gray-700/50 bg-gray-800/40'
          }
        `}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <span className={selectedOption ? 'text-white' : 'text-gray-400'}>
          {selectedOption?.label || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} className="text-gray-400" />
        </motion.div>
      </motion.button>

      <motion.div
        initial={false}
        animate={
          isOpen
            ? {
                opacity: 1,
                scale: 1,
                y: 0,
                rotateX: 0,
              }
            : {
                opacity: 0,
                scale: 0.95,
                y: -10,
                rotateX: -15,
              }
        }
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="absolute z-50 w-full mt-2 origin-top"
        style={{
          pointerEvents: isOpen ? 'auto' : 'none',
          perspective: '1000px',
        }}
      >
        <div className="backdrop-blur-xl bg-gray-800/95 border border-gray-700/50 rounded-xl overflow-hidden shadow-2xl">
          {options.map((option, index) => (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`
                w-full px-4 py-3 text-left transition-all
                ${
                  value === option.value
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-gray-300 hover:bg-gray-700/50'
                }
              `}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 5, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
};

/**
 * 🎛️ SLIDER WITH TOOLTIP - Slider con tooltip animado
 */
export const AnimatedSlider = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">{label}</span>
          {showValue && (
            <motion.span
              className="text-sm font-semibold text-blue-400"
              animate={{ scale: isDragging ? 1.2 : 1 }}
            >
              {value}
            </motion.span>
          )}
        </div>
      )}

      <div className="relative">
        <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
            style={{ width: `${percentage}%` }}
            animate={{
              boxShadow: isDragging
                ? '0 0 20px rgba(59, 130, 246, 0.5)'
                : '0 0 0px rgba(59, 130, 246, 0)',
            }}
          />
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />

        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg pointer-events-none"
          style={{ left: `${percentage}%`, x: '-50%' }}
          animate={{ scale: isDragging ? 1.3 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      </div>
    </div>
  );
};

export default {
  RippleButton,
  FloatingInput,
  LiquidToggle,
  LiquidCheckbox,
  OrigamiDropdown,
  AnimatedSlider,
};
