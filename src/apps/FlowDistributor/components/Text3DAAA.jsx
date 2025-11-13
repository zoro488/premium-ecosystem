/**
 * ✨ TEXT 3D AAA - SISTEMA DE TEXTO 3D PREMIUM
 * ============================================
 * Texto 3D de alta calidad tipo Spline
 * Con capas de profundidad, sombras dinámicas y efectos de luz
 */
import { memo } from 'react';

import { motion } from 'framer-motion';

// Variantes de estilo
const VARIANTS = {
  // Estilo Hero - Para títulos principales
  hero: {
    fontSize: '4rem',
    fontWeight: 900,
    letterSpacing: '-0.02em',
    depth: 8,
  },
  // Estilo Title - Para títulos de sección
  title: {
    fontSize: '2.5rem',
    fontWeight: 800,
    letterSpacing: '-0.01em',
    depth: 6,
  },
  // Estilo Subtitle - Para subtítulos
  subtitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    letterSpacing: '0em',
    depth: 4,
  },
  // Estilo Label - Para etiquetas
  label: {
    fontSize: '1rem',
    fontWeight: 600,
    letterSpacing: '0.01em',
    depth: 2,
  },
};

// Temas de color
const THEMES = {
  gradient: {
    base: 'from-cyan-400 via-blue-500 to-purple-600',
    glow: 'rgba(59, 130, 246, 0.5)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
  gold: {
    base: 'from-yellow-400 via-orange-500 to-red-600',
    glow: 'rgba(251, 191, 36, 0.5)',
    shadow: 'rgba(0, 0, 0, 0.4)',
  },
  neon: {
    base: 'from-pink-500 via-purple-500 to-indigo-600',
    glow: 'rgba(168, 85, 247, 0.6)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
  emerald: {
    base: 'from-emerald-400 via-teal-500 to-cyan-600',
    glow: 'rgba(16, 185, 129, 0.5)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};

/**
 * Texto 3D Premium
 */
export const Text3DAAA = memo(
  ({
    children,
    variant = 'title',
    theme = 'gradient',
    align = 'left',
    glow = true,
    animate = true,
    className = '',
  }) => {
    const style = VARIANTS[variant];
    const colors = THEMES[theme];

    return (
      <motion.div
        className={`relative inline-block ${className}`}
        style={{
          textAlign: align,
          perspective: '1000px',
        }}
        initial={animate ? { opacity: 0, y: 20, rotateX: -15 } : false}
        animate={animate ? { opacity: 1, y: 0, rotateX: 0 } : false}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* Capas de profundidad - Sombras 3D */}
        {[...Array(style.depth)].map((_, i) => (
          <div
            key={`depth-${i}`}
            className={`absolute inset-0 bg-gradient-to-br ${colors.base}`}
            style={{
              fontSize: style.fontSize,
              fontWeight: style.fontWeight,
              letterSpacing: style.letterSpacing,
              transform: `translateZ(-${(i + 1) * 2}px) translateY(${i * 1}px)`,
              opacity: 1 - i * 0.1,
              filter: `blur(${i * 0.5}px)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              zIndex: -i - 1,
            }}
          >
            {children}
          </div>
        ))}

        {/* Glow effect */}
        {glow && (
          <div
            className="absolute inset-0 blur-2xl"
            style={{
              fontSize: style.fontSize,
              fontWeight: style.fontWeight,
              letterSpacing: style.letterSpacing,
              background: colors.glow,
              opacity: 0.6,
              zIndex: -style.depth - 1,
            }}
          >
            {children}
          </div>
        )}

        {/* Texto principal con gradiente */}
        <div
          className={`relative bg-gradient-to-br ${colors.base} font-display`}
          style={{
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            letterSpacing: style.letterSpacing,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: `0 0 40px ${colors.glow}`,
            zIndex: 1,
          }}
        >
          {children}
        </div>

        {/* Reflejo sutil */}
        <div
          className={`absolute left-0 right-0 bg-gradient-to-br ${colors.base}`}
          style={{
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            letterSpacing: style.letterSpacing,
            top: '100%',
            transform: 'scaleY(-1)',
            opacity: 0.1,
            filter: 'blur(8px)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)',
          }}
        >
          {children}
        </div>
      </motion.div>
    );
  }
);

Text3DAAA.displayName = 'Text3DAAA';

/**
 * Variantes predefinidas
 */
export const HeroText3D = (props) => <Text3DAAA variant="hero" {...props} />;
export const TitleText3D = (props) => <Text3DAAA variant="title" {...props} />;
export const SubtitleText3D = (props) => <Text3DAAA variant="subtitle" {...props} />;
export const LabelText3D = (props) => <Text3DAAA variant="label" {...props} />;

/**
 * Texto flotante animado
 */
export const FloatingText3D = memo(({ children, ...props }) => {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
        rotateX: [0, 5, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <Text3DAAA {...props}>{children}</Text3DAAA>
    </motion.div>
  );
});

FloatingText3D.displayName = 'FloatingText3D';

// Eliminado export default para evitar problemas de inicialización durante minificación
// Usar solo named exports
