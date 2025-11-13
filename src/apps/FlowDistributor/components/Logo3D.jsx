/**
 * 🌟 LOGO 3D PREMIUM - NIVEL AAA
 * ===============================
 * Logo empresarial en 3D con efectos cinematográficos
 *
 * Características:
 * - 🎨 Diseño 3D con profundidad real
 * - ✨ Animaciones de rotación y floating
 * - 💎 Efectos de glow y glassmorphism
 * - 🌊 Parallax en hover
 * - 🎭 Múltiples variantes (header, sidebar, splash)
 * - 🔮 Perspectiva y transformaciones 3D
 */
import { memo, useState } from 'react';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

// ============================================================================
// VARIANTES DE TAMAÑO
// ============================================================================

const SIZES = {
  xs: {
    container: 'w-8 h-8',
    icon: 'w-4 h-4',
    text: 'text-xs',
    glow: 'w-12 h-12',
  },
  sm: {
    container: 'w-12 h-12',
    icon: 'w-6 h-6',
    text: 'text-sm',
    glow: 'w-16 h-16',
  },
  md: {
    container: 'w-16 h-16',
    icon: 'w-8 h-8',
    text: 'text-base',
    glow: 'w-20 h-20',
  },
  lg: {
    container: 'w-24 h-24',
    icon: 'w-12 h-12',
    text: 'text-2xl',
    glow: 'w-32 h-32',
  },
  xl: {
    container: 'w-32 h-32',
    icon: 'w-16 h-16',
    text: 'text-4xl',
    glow: 'w-40 h-40',
  },
};

// ============================================================================
// LOGO ICON 3D (Símbolo)
// ============================================================================

const LogoIcon3D = memo(({ size = 'md', animate = true, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const sizeConfig = SIZES[size];

  return (
    <div
      className={`relative ${sizeConfig.container} ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect background */}
      <motion.div
        className={`absolute inset-0 -m-4 ${sizeConfig.glow} blur-2xl rounded-full opacity-50`}
        style={{
          background:
            'radial-gradient(circle, rgba(139,92,246,0.6) 0%, rgba(99,102,241,0.3) 50%, transparent 100%)',
        }}
        animate={{
          scale: isHovered ? 1.2 : 1,
          opacity: isHovered ? 0.8 : 0.5,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Main logo container */}
      <motion.div
        className="relative w-full h-full"
        animate={
          animate
            ? {
                rotateY: isHovered ? 360 : 0,
                rotateX: isHovered ? 10 : 0,
                scale: isHovered ? 1.1 : 1,
              }
            : {}
        }
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Back layer (depth) */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/40 to-blue-600/40 backdrop-blur-sm border border-white/10"
          style={{
            transform: 'translateZ(-20px)',
          }}
        />

        {/* Middle layer */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/50 to-blue-500/50 backdrop-blur-md border border-white/20"
          style={{
            transform: 'translateZ(-10px)',
          }}
        />

        {/* Front layer with icon */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 backdrop-blur-lg border border-white/30 flex items-center justify-center shadow-2xl"
          style={{
            transform: 'translateZ(0px)',
            boxShadow: '0 20px 60px -15px rgba(139, 92, 246, 0.5)',
          }}
          animate={{
            boxShadow: isHovered
              ? '0 30px 80px -10px rgba(139, 92, 246, 0.8)'
              : '0 20px 60px -15px rgba(139, 92, 246, 0.5)',
          }}
        >
          <motion.div
            animate={
              animate
                ? {
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Zap className={`${sizeConfig.icon} text-white drop-shadow-lg`} fill="white" />
          </motion.div>
        </motion.div>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0"
          style={{
            background:
              'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: isHovered ? ['0% 0%', '200% 200%'] : '0% 0%',
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
    </div>
  );
});

LogoIcon3D.displayName = 'LogoIcon3D';

// ============================================================================
// LOGO COMPLETO CON TEXTO
// ============================================================================

const Logo3D = memo(
  ({
    size = 'md',
    showText = true,
    text = 'Premium Ecosystem',
    subtitle = 'Flow Distributor',
    variant = 'full',
    animate = true,
    className = '',
    onClick,
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const sizeConfig = SIZES[size];

    // Variant: icon-only
    if (variant === 'icon') {
      return <LogoIcon3D size={size} animate={animate} className={className} />;
    }

    // Variant: full (icon + text)
    return (
      <motion.div
        className={`flex items-center gap-4 cursor-pointer ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1500px',
        }}
      >
        {/* Logo Icon */}
        <LogoIcon3D size={size} animate={animate} />

        {/* Text Section */}
        {showText && (
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Main Title */}
            <motion.h1
              className={`font-bold leading-none bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent ${sizeConfig.text}`}
              animate={{
                rotateX: isHovered ? 5 : 0,
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.3 }}
              style={{
                transform: 'translateZ(20px)',
                textShadow: '0 2px 10px rgba(139, 92, 246, 0.3)',
              }}
            >
              {text}
            </motion.h1>

            {/* Subtitle */}
            {subtitle && (
              <motion.p
                className="text-xs text-slate-400 font-medium tracking-wider"
                style={{
                  transform: 'translateZ(10px)',
                }}
                animate={{
                  opacity: isHovered ? 1 : 0.7,
                }}
              >
                {subtitle}
              </motion.p>
            )}
          </motion.div>
        )}
      </motion.div>
    );
  }
);

Logo3D.displayName = 'Logo3D';

// ============================================================================
// LOGO SPLASH (Para pantallas de carga)
// ============================================================================

export const LogoSplash3D = memo(({ onComplete }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              delay: i * 0.1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Main logo */}
      <motion.div
        initial={{ scale: 0, rotateY: -180 }}
        animate={{ scale: 1, rotateY: 0 }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 15,
          delay: 0.2,
        }}
      >
        <Logo3D size="xl" showText={true} animate={true} />
      </motion.div>

      {/* Loading bar */}
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64 h-1 bg-white/10 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, delay: 0.8 }}
          onAnimationComplete={onComplete}
        />
      </motion.div>

      {/* Loading text */}
      <motion.p
        className="absolute bottom-10 text-sm text-slate-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Cargando experiencia premium...
      </motion.p>
    </motion.div>
  );
});

LogoSplash3D.displayName = 'LogoSplash3D';

// ============================================================================
// LOGO MINIMAL (Para espacios reducidos)
// ============================================================================

export const LogoMinimal3D = memo(({ size = 'sm', className = '' }) => {
  return (
    <motion.div
      className={`inline-flex items-center gap-2 ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      <LogoIcon3D size={size} animate={false} />
      <span className="text-sm font-bold text-white/90">PE</span>
    </motion.div>
  );
});

LogoMinimal3D.displayName = 'LogoMinimal3D';

export default Logo3D;
