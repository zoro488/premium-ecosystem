// <� COMPONENTES UI ULTRA-PREMIUM - NIVEL AWWWARDS 2025
// Componentes elegantes, fluidos, modernos con efectos avanzados
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import {
  GlassmorphismCard,
  HolographicCard,
  MagneticButton,
  MagneticElement,
} from '../../apps/FlowDistributor/components/MicroInteraccionesAAA';

// =� Premium KPI Card - Tarjeta KPI con efectos hologr�ficos
export const PremiumKPICard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'cyan',
  className = '',
}) => {
  const colors = {
    cyan: { from: 'from-cyan-500', to: 'to-blue-500', text: 'text-cyan-400' },
    purple: { from: 'from-purple-500', to: 'to-pink-500', text: 'text-purple-400' },
    green: { from: 'from-green-500', to: 'to-emerald-500', text: 'text-green-400' },
    orange: { from: 'from-orange-500', to: 'to-red-500', text: 'text-orange-400' },
  };

  const currentColor = colors[color];

  return (
    <HolographicCard className={className}>
      <GlassmorphismCard blur="xl" tint="white">
        <motion.div className="p-6 relative overflow-hidden" whileHover={{ scale: 1.02 }}>
          {/* Gradient background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${currentColor.from} ${currentColor.to} opacity-5`}
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${currentColor.from} ${currentColor.to}`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>

              {trend && (
                <div
                  className={`flex items-center gap-1 ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}
                >
                  <motion.span
                    initial={{ y: 0 }}
                    animate={{ y: trend === 'up' ? -2 : 2 }}
                    transition={{ repeat: Infinity, duration: 1, repeatType: 'reverse' }}
                  >
                    {trend === 'up' ? '�' : '�'}
                  </motion.span>
                  <span className="text-sm font-semibold">{trendValue}</span>
                </div>
              )}
            </div>

            <h3 className="text-white/60 text-sm font-medium mb-2">{title}</h3>
            <p className={`text-3xl font-bold ${currentColor.text}`}>{value}</p>

            {/* Progress bar animation */}
            <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${currentColor.from} ${currentColor.to}`}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Animated glow */}
          <motion.div
            className={`absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br ${currentColor.from} ${currentColor.to} rounded-full blur-3xl opacity-20`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
      </GlassmorphismCard>
    </HolographicCard>
  );
};

// =� Premium Chart Container - Contenedor de gr�ficos con efectos premium
export const PremiumChartContainer = ({ title, children, actions, className = '' }) => {
  return (
    <HolographicCard className={className}>
      <GlassmorphismCard blur="xl" tint="white">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            {actions && <div className="flex gap-2">{actions}</div>}
          </div>

          {/* Chart content */}
          <div className="relative">{children}</div>
        </div>
      </GlassmorphismCard>
    </HolographicCard>
  );
};

// =� Premium Table - Tabla con efectos premium
export const PremiumTable = ({ columns, data, onRowClick }) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <HolographicCard>
      <GlassmorphismCard blur="xl" tint="white">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="border-b border-white/10">
                {columns.map((col, idx) => (
                  <th key={idx} className="px-6 py-4 text-left text-sm font-semibold text-white/80">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              <AnimatePresence>
                {data.map((row, rowIdx) => (
                  <motion.tr
                    key={rowIdx}
                    className="border-b border-white/5 cursor-pointer relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: rowIdx * 0.05 }}
                    onMouseEnter={() => setHoveredRow(rowIdx)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => onRowClick?.(row)}
                    whileHover={{ backgroundColor: 'rgba(6, 182, 212, 0.05)' }}
                  >
                    {/* Hover effect */}
                    {hoveredRow === rowIdx && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent"
                        layoutId="tableRowHover"
                        transition={{ duration: 0.2 }}
                      />
                    )}

                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className="px-6 py-4 relative z-10">
                        {col.render ? col.render(row) : row[col.accessor]}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </GlassmorphismCard>
    </HolographicCard>
  );
};

// <� Premium Badge - Badge con animaciones
export const PremiumBadge = ({ children, variant = 'default', pulse = false }) => {
  const variants = {
    default: 'bg-gray-500/20 text-gray-300',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-orange-500/20 text-orange-400',
    error: 'bg-red-500/20 text-red-400',
    info: 'bg-cyan-500/20 text-cyan-400',
  };

  return (
    <motion.span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${variants[variant]}`}
      animate={pulse ? { scale: [1, 1.05, 1] } : {}}
      transition={pulse ? { duration: 2, repeat: Infinity } : {}}
    >
      {pulse && <span className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse" />}
      {children}
    </motion.span>
  );
};

// = Premium Notification - Notificaci�n con efectos premium
export const PremiumNotification = ({ title, message, type = 'info', onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const types = {
    success: { color: 'from-green-500 to-emerald-500', icon: '' },
    error: { color: 'from-red-500 to-pink-500', icon: '' },
    warning: { color: 'from-orange-500 to-yellow-500', icon: '!' },
    info: { color: 'from-cyan-500 to-blue-500', icon: 'i' },
  };

  const currentType = types[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          className="fixed top-4 right-4 z-[9999]"
        >
          <HolographicCard>
            <GlassmorphismCard blur="2xl" tint="black">
              <div className="p-4 min-w-[300px] flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${currentType.color} flex items-center justify-center text-white font-bold`}
                >
                  {currentType.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-1">{title}</h4>
                  <p className="text-white/60 text-sm">{message}</p>
                </div>

                {/* Close button */}
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  
                </button>
              </div>
            </GlassmorphismCard>
          </HolographicCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// =� Premium Modal - Modal con efectos premium
export const PremiumModal = ({ isOpen, onClose, title, children, footer }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl"
            >
              <HolographicCard>
                <GlassmorphismCard blur="2xl" tint="black">
                  <div className="relative">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                      <h3 className="text-2xl font-bold text-white">{title}</h3>
                      <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">{children}</div>

                    {/* Footer */}
                    {footer && (
                      <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
                        {footer}
                      </div>
                    )}
                  </div>
                </GlassmorphismCard>
              </HolographicCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// <� Premium Input - Input con efectos premium
export const PremiumInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  icon: Icon,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-white/80">{label}</label>}

      <div className="relative">
        <GlassmorphismCard blur="md" tint="white">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${isFocused ? 'border-cyan-500/50' : 'border-white/10'}`}
          >
            {Icon && <Icon className="w-5 h-5 text-white/40" />}

            <input
              type={type}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none"
            />
          </div>
        </GlassmorphismCard>

        {/* Focus glow */}
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-cyan-500/20 blur-xl -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </div>
    </div>
  );
};

// <� Premium Select - Select con efectos premium
export const PremiumSelect = ({ label, value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-white/80">{label}</label>}

      <div className="relative">
        <GlassmorphismCard blur="md" tint="white">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 hover:border-cyan-500/50 transition-all text-white"
          >
            <span>{value || 'Seleccionar...'}</span>
            <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
              �
            </span>
          </button>
        </GlassmorphismCard>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 z-50"
            >
              <GlassmorphismCard blur="2xl" tint="black">
                <div className="rounded-xl border border-white/10 overflow-hidden">
                  {options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      className="w-full px-4 py-3 text-left text-white hover:bg-cyan-500/10 transition-colors"
                      onClick={() => {
                        onChange(option);
                        setIsOpen(false);
                      }}
                      whileHover={{ x: 4 }}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </GlassmorphismCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export { MagneticButton, MagneticElement, HolographicCard, GlassmorphismCard };
