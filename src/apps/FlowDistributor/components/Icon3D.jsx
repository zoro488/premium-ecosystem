/**
 * 🎯 ICON 3D PREMIUM - SISTEMA UNIVERSAL
 * ========================================
 * Sistema de iconos 3D reutilizable para toda la aplicación
 *
 * Características:
 * - 🎨 Wrapper universal para cualquier icono de Lucide
 * - ✨ Efectos 3D automáticos (profundidad, glow, float)
 * - 💎 Múltiples variantes (solid, outline, glass, neon)
 * - 🌊 Animaciones hover premium
 * - 🎭 Temas de color personalizables
 * - 🔮 Perspective y transformaciones 3D
 * - ⚡ Optimizado con memo
 */
import { memo, useState } from 'react';

import { motion } from 'framer-motion';

// ============================================================================
// TEMAS DE COLOR PREDEFINIDOS
// ============================================================================

const COLOR_THEMES = {
  purple: {
    gradient: 'from-purple-500 to-purple-600',
    glow: 'rgba(139, 92, 246, 0.6)',
    shadow: 'rgba(139, 92, 246, 0.4)',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
  },
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    glow: 'rgba(59, 130, 246, 0.6)',
    shadow: 'rgba(59, 130, 246, 0.4)',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
  },
  green: {
    gradient: 'from-emerald-500 to-emerald-600',
    glow: 'rgba(16, 185, 129, 0.6)',
    shadow: 'rgba(16, 185, 129, 0.4)',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
  },
  red: {
    gradient: 'from-red-500 to-red-600',
    glow: 'rgba(239, 68, 68, 0.6)',
    shadow: 'rgba(239, 68, 68, 0.4)',
    border: 'border-red-500/30',
    bg: 'bg-red-500/10',
  },
  amber: {
    gradient: 'from-amber-500 to-amber-600',
    glow: 'rgba(245, 158, 11, 0.6)',
    shadow: 'rgba(245, 158, 11, 0.4)',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
  },
  cyan: {
    gradient: 'from-cyan-500 to-cyan-600',
    glow: 'rgba(6, 182, 212, 0.6)',
    shadow: 'rgba(6, 182, 212, 0.4)',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10',
  },
  pink: {
    gradient: 'from-pink-500 to-pink-600',
    glow: 'rgba(236, 72, 153, 0.6)',
    shadow: 'rgba(236, 72, 153, 0.4)',
    border: 'border-pink-500/30',
    bg: 'bg-pink-500/10',
  },
  slate: {
    gradient: 'from-slate-500 to-slate-600',
    glow: 'rgba(100, 116, 139, 0.6)',
    shadow: 'rgba(100, 116, 139, 0.4)',
    border: 'border-slate-500/30',
    bg: 'bg-slate-500/10',
  },
};

// ============================================================================
// TAMAÑOS PREDEFINIDOS
// ============================================================================

const SIZES = {
  xs: { icon: 'w-3 h-3', container: 'p-1.5', text: 'text-xs' },
  sm: { icon: 'w-4 h-4', container: 'p-2', text: 'text-sm' },
  md: { icon: 'w-5 h-5', container: 'p-2.5', text: 'text-base' },
  lg: { icon: 'w-6 h-6', container: 'p-3', text: 'text-lg' },
  xl: { icon: 'w-8 h-8', container: 'p-4', text: 'text-xl' },
  '2xl': { icon: 'w-10 h-10', container: 'p-5', text: 'text-2xl' },
};

// ============================================================================
// ICON 3D - VARIANTE SOLID (Fondo sólido con profundidad)
// ============================================================================

const Icon3DSolid = memo(
  ({
    icon: Icon,
    theme = 'purple',
    size = 'md',
    animate = true,
    depth = 3,
    className = '',
    onClick,
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const colorTheme = COLOR_THEMES[theme];
    const sizeConfig = SIZES[size];

    return (
      <motion.div
        className={`relative inline-flex items-center justify-center ${sizeConfig.container} rounded-xl cursor-pointer ${className}`}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 -m-2 blur-xl rounded-xl"
          style={{ background: colorTheme.glow }}
          animate={{
            opacity: isHovered ? 0.6 : 0.3,
            scale: isHovered ? 1.2 : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Depth layers */}
        {[...Array(depth)].map((_, i) => (
          <div
            key={i}
            className={`absolute inset-0 rounded-xl bg-gradient-to-br ${colorTheme.gradient} ${colorTheme.border} border`}
            style={{
              transform: `translateZ(-${(i + 1) * 3}px)`,
              opacity: 1 - i * 0.2,
            }}
          />
        ))}

        {/* Front face with icon */}
        <motion.div
          className={`relative z-10 rounded-xl bg-gradient-to-br ${colorTheme.gradient} ${colorTheme.border} border flex items-center justify-center`}
          style={{
            transform: 'translateZ(0px)',
            boxShadow: `0 8px 32px -8px ${colorTheme.shadow}`,
          }}
          animate={
            animate
              ? {
                  rotateY: isHovered ? [0, 5, -5, 0] : 0,
                  rotateX: isHovered ? [0, -5, 5, 0] : 0,
                }
              : {}
          }
          transition={{ duration: 0.6 }}
        >
          <Icon className={`${sizeConfig.icon} text-white drop-shadow-lg`} strokeWidth={2.5} />
        </motion.div>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background:
              'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: isHovered ? ['0% 0%', '200% 200%'] : '0% 0%',
          }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
    );
  }
);

Icon3DSolid.displayName = 'Icon3DSolid';

// ============================================================================
// ICON 3D - VARIANTE GLASS (Glassmorphism)
// ============================================================================

const Icon3DGlass = memo(
  ({ icon: Icon, theme = 'purple', size = 'md', animate = true, className = '', onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const colorTheme = COLOR_THEMES[theme] || COLOR_THEMES.purple;
    const sizeConfig = SIZES[size] || SIZES.md;

    return (
      <motion.div
        className={`relative inline-flex items-center justify-center ${sizeConfig.container} rounded-2xl cursor-pointer ${className}`}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 blur-xl rounded-2xl"
          style={{ background: colorTheme.glow }}
          animate={{
            opacity: isHovered ? 0.5 : 0.2,
          }}
        />

        {/* Glass container */}
        <motion.div
          className={`relative backdrop-blur-xl ${colorTheme.bg} ${colorTheme.border} border rounded-2xl p-2.5`}
          style={{
            boxShadow: isHovered
              ? `0 12px 40px -8px ${colorTheme.shadow}`
              : `0 8px 24px -8px ${colorTheme.shadow}`,
          }}
          animate={
            animate
              ? {
                  y: isHovered ? -4 : 0,
                }
              : {}
          }
        >
          <motion.div
            animate={
              animate
                ? {
                    rotate: isHovered ? [0, 5, -5, 0] : 0,
                    scale: isHovered ? 1.1 : 1,
                  }
                : {}
            }
            transition={{ duration: 0.4 }}
          >
            <Icon
              className={`${sizeConfig.icon} drop-shadow-lg`}
              style={{ color: colorTheme.glow }}
              strokeWidth={2}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }
);

Icon3DGlass.displayName = 'Icon3DGlass';

// ============================================================================
// ICON 3D - VARIANTE OUTLINE (Solo borde con efecto 3D)
// ============================================================================

const Icon3DOutline = memo(
  ({ icon: Icon, theme = 'purple', size = 'md', animate = true, className = '', onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const colorTheme = COLOR_THEMES[theme] || COLOR_THEMES.purple;
    const sizeConfig = SIZES[size] || SIZES.md;

    return (
      <motion.div
        className={`relative inline-flex items-center justify-center ${sizeConfig.container} rounded-xl border-2 ${colorTheme.border} cursor-pointer ${className}`}
        style={{
          transformStyle: 'preserve-3d',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        whileHover={{ scale: 1.1, borderColor: colorTheme.glow }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow on hover */}
        <motion.div
          className="absolute inset-0 blur-lg rounded-xl"
          style={{ background: colorTheme.glow }}
          animate={{
            opacity: isHovered ? 0.4 : 0,
          }}
        />

        <motion.div
          animate={
            animate
              ? {
                  rotate: isHovered ? 360 : 0,
                  scale: isHovered ? 1.1 : 1,
                }
              : {}
          }
          transition={{ duration: 0.5 }}
        >
          <Icon
            className={`${sizeConfig.icon}`}
            style={{ color: isHovered ? colorTheme.glow : 'currentColor' }}
            strokeWidth={2}
          />
        </motion.div>
      </motion.div>
    );
  }
);

Icon3DOutline.displayName = 'Icon3DOutline';

// ============================================================================
// ICON 3D - VARIANTE NEON (Efecto neón brillante)
// ============================================================================

const Icon3DNeon = memo(
  ({ icon: Icon, theme = 'purple', size = 'md', animate = true, className = '', onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const colorTheme = COLOR_THEMES[theme] || COLOR_THEMES.purple;
    const sizeConfig = SIZES[size] || SIZES.md;

    return (
      <motion.div
        className={`relative inline-flex items-center justify-center ${sizeConfig.container} cursor-pointer ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        whileHover={{ scale: 1.15, y: -4 }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Multiple glow layers for neon effect */}
        <motion.div
          className="absolute inset-0 blur-2xl rounded-full"
          style={{ background: colorTheme.glow }}
          animate={{
            scale: isHovered ? [1, 1.3, 1] : 1,
            opacity: isHovered ? [0.6, 0.9, 0.6] : 0.4,
          }}
          transition={{ duration: 1, repeat: animate && isHovered ? Infinity : 0 }}
        />
        <motion.div
          className="absolute inset-0 blur-xl rounded-full"
          style={{ background: colorTheme.glow }}
          animate={{
            scale: isHovered ? [1, 1.2, 1] : 1,
            opacity: 0.8,
          }}
          transition={{ duration: 0.8, repeat: animate && isHovered ? Infinity : 0 }}
        />

        <motion.div
          animate={
            animate
              ? {
                  rotate: isHovered ? [0, 360] : 0,
                }
              : {}
          }
          transition={{ duration: 1, ease: 'linear', repeat: animate && isHovered ? Infinity : 0 }}
        >
          <Icon
            className={`${sizeConfig.icon} relative z-10`}
            style={{
              color: 'white',
              filter: `drop-shadow(0 0 8px ${colorTheme.glow}) drop-shadow(0 0 12px ${colorTheme.glow})`,
            }}
            strokeWidth={2.5}
          />
        </motion.div>
      </motion.div>
    );
  }
);

Icon3DNeon.displayName = 'Icon3DNeon';

// ============================================================================
// ICON 3D PRINCIPAL - Wrapper con selección de variante
// ============================================================================

const Icon3D = memo(
  ({
    icon,
    variant = 'solid',
    theme = 'purple',
    size = 'md',
    animate = true,
    depth = 3,
    className = '',
    onClick,
  }) => {
    const variants = {
      solid: Icon3DSolid,
      glass: Icon3DGlass,
      outline: Icon3DOutline,
      neon: Icon3DNeon,
    };

    const SelectedVariant = variants[variant] || Icon3DSolid;

    return (
      <SelectedVariant
        icon={icon}
        theme={theme}
        size={size}
        animate={animate}
        depth={depth}
        className={className}
        onClick={onClick}
      />
    );
  }
);

Icon3D.displayName = 'Icon3D';

// ============================================================================
// EXPORTS
// ============================================================================

export default Icon3D;
export { COLOR_THEMES, Icon3DGlass, Icon3DNeon, Icon3DOutline, Icon3DSolid, SIZES };
