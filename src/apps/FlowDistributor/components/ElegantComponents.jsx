/**
 * 🎨 ELEGANT COMPONENTS LIBRARY - PREMIUM REUSABLE
 * ================================================
 * Componentes elegantes, creativos y animados para todos los paneles
 *
 * ✨ Micro-animaciones fluidas
 * 💎 Efectos visuales impactantes
 * 🎭 Personalización por tema
 * 🚀 Performance optimizado
 */
import { memo, useEffect, useMemo, useState } from 'react';

import { motion } from 'framer-motion';

// ============================================
// PARTÍCULAS CREATIVAS ANIMADAS
// ============================================
export const CreativeParticles = memo(({ count = 30, colors }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 25 + 15,
        delay: Math.random() * 10,
        rotate: Math.random() * 360,
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.3, 1],
            rotate: [p.rotate, p.rotate + 180, p.rotate],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
});

CreativeParticles.displayName = 'CreativeParticles';

// ============================================
// KPI CARD PREMIUM CON ANIMACIONES
// ============================================
export const PremiumKPI = memo(({ title, value, icon: Icon, colors, trend }) => {
  const [count, setCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Counter animation
  useEffect(() => {
    const target =
      typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, '')) || 0;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-md bg-white/5 border border-white/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.03, borderColor: 'rgba(255,255,255,0.15)' }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
        }}
        animate={{
          scale: isHovered ? 1.1 : 1,
          opacity: isHovered ? 0.4 : 0.2,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Glowing border effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          boxShadow: `0 0 20px ${colors[0]}40`,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <motion.p
            className="text-xs font-semibold text-slate-300 uppercase tracking-wider"
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {title}
          </motion.p>
          <motion.div
            animate={{
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.2 : 1,
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <Icon className="w-6 h-6" style={{ color: colors[0] }} />
          </motion.div>
        </div>

        <motion.div
          className="text-4xl font-bold text-white mb-2"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        >
          ${Math.floor(count).toLocaleString()}
        </motion.div>

        {/* Trend indicator */}
        {trend && (
          <motion.div
            className={`text-xs font-medium ${trend > 0 ? 'text-zinc-200' : 'text-zinc-200'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </motion.div>
        )}

        {/* Animated accent bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl"
          style={{
            background: `linear-gradient(90deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
});

PremiumKPI.displayName = 'PremiumKPI';

// ============================================
// TABLA PREMIUM CON ANIMACIONES
// ============================================
export const PremiumTable = memo(({ columns, data, accentColor, onRowClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            {columns.map((col, idx) => (
              <motion.th
                key={idx}
                className="px-4 py-3 text-left font-semibold text-slate-300 text-xs uppercase tracking-wider"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                style={{ textAlign: col.align || 'left' }}
              >
                {col.header}
              </motion.th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((row, rowIdx) => (
            <motion.tr
              key={rowIdx}
              className="group cursor-pointer"
              onClick={() => onRowClick?.(row)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: rowIdx * 0.02 }}
              whileHover={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                x: 5,
                transition: { duration: 0.2 },
              }}
            >
              {columns.map((col, colIdx) => (
                <motion.td
                  key={colIdx}
                  className={`px-4 py-3 ${col.className || 'text-slate-300'}`}
                  style={{ textAlign: col.align || 'left' }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </motion.td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <motion.div
          className="text-center py-12 text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-4xl mb-3">📊</div>
          <p>No hay datos disponibles</p>
        </motion.div>
      )}
    </div>
  );
});

PremiumTable.displayName = 'PremiumTable';

// ============================================
// BOTÓN ANIMADO PREMIUM
// ============================================
export const AnimatedButton = memo(
  ({ children, onClick, variant = 'primary', colors, icon: Icon }) => {
    const [isPressed, setIsPressed] = useState(false);

    const variants = {
      primary: {
        bg: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
        hoverBg: `linear-gradient(135deg, ${colors[0]}dd 0%, ${colors[1]}dd 100%)`,
        shadow: `0 4px 15px ${colors[0]}40`,
      },
      secondary: {
        bg: `${colors[0]}15`,
        hoverBg: `${colors[0]}25`,
        shadow: 'none',
        border: `1px solid ${colors[0]}30`,
      },
    };

    const style = variants[variant];

    return (
      <motion.button
        onClick={onClick}
        className="relative overflow-hidden rounded-xl px-5 py-2.5 font-semibold text-sm flex items-center gap-2 transition-all"
        style={{
          background: style.bg,
          boxShadow: style.shadow,
          border: style.border,
        }}
        whileHover={{
          scale: 1.05,
          boxShadow: `0 6px 25px ${colors[0]}50`,
        }}
        whileTap={{ scale: 0.95 }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        transition={{ duration: 0.2 }}
      >
        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 bg-white/20"
          initial={{ scale: 0, opacity: 1 }}
          animate={isPressed ? { scale: 2, opacity: 0 } : {}}
          transition={{ duration: 0.5 }}
        />

        {Icon && (
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
          >
            <Icon className="w-4 h-4" />
          </motion.div>
        )}

        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

// ============================================
// TAB BAR ANIMADO
// ============================================
export const AnimatedTabBar = memo(({ tabs, activeTab, onChange, accentColor }) => {
  return (
    <div className="relative flex gap-1 p-1 backdrop-blur-md bg-white/5 rounded-2xl border border-white/5">
      {tabs.map((tab, _idx) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative px-5 py-3 rounded-xl font-medium text-sm flex items-center gap-2 transition-colors ${
              isActive ? 'text-white' : 'text-slate-400 hover:text-slate-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}30 0%, ${accentColor}20 100%)`,
                  boxShadow: `0 0 20px ${accentColor}40`,
                }}
                layoutId="activeTab"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}

            <motion.div
              className="relative z-10"
              animate={{
                rotate: isActive ? [0, 5, -5, 0] : 0,
                scale: isActive ? 1.1 : 1,
              }}
              transition={{ duration: 0.5 }}
            >
              <Icon className="w-4 h-4" />
            </motion.div>

            <span className="relative z-10">{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
});

AnimatedTabBar.displayName = 'AnimatedTabBar';

// ============================================
// MODAL ELEGANTE
// ============================================
export const ElegantModal = memo(({ isOpen, onClose, title, children, accentColor }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative backdrop-blur-2xl bg-slate-900/95 rounded-3xl p-8 max-w-2xl w-full border border-white/10"
        style={{
          boxShadow: `0 0 50px ${accentColor}30`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated gradient border */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${accentColor}30, transparent)`,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <motion.button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        </motion.div>

        {/* Content */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
});

ElegantModal.displayName = 'ElegantModal';

// ============================================
// SCROLL PROGRESS BAR
// ============================================
export const ScrollProgress = memo(({ color }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
      style={{
        background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
        scaleX: scrollProgress / 100,
      }}
      initial={{ scaleX: 0 }}
    />
  );
});

ScrollProgress.displayName = 'ScrollProgress';

export default {
  CreativeParticles,
  PremiumKPI,
  PremiumTable,
  AnimatedButton,
  AnimatedTabBar,
  ElegantModal,
  ScrollProgress,
};
