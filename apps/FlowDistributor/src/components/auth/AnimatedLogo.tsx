/**
 * 🎨 ANIMATED LOGO - Logo Premium con SVG Path Drawing
 *
 * Características:
 * - ✨ SVG path drawing animation (strokeDashoffset)
 * - 🌟 Gradient fills animados
 * - 💫 Rotation y scale effects
 * - 🎭 Múltiples modos: splash, login, header
 * - 🔄 Loop infinito opcional
 */

import { motion } from 'framer-motion';

interface AnimatedLogoProps {
  size?: number;
  mode?: 'splash' | 'login' | 'header';
  onComplete?: () => void;
  loop?: boolean;
  className?: string;
}

/**
 * Logo Animado Premium FlowDistributor
 */
export function AnimatedLogo({
  size = 120,
  mode = 'splash',
  onComplete,
  loop = false,
  className = ''
}: AnimatedLogoProps) {

  // Configuración por modo
  const config = {
    splash: {
      duration: 2.5,
      delay: 0,
      scale: [0.8, 1.2, 1],
      rotate: [0, 360],
    },
    login: {
      duration: 1.5,
      delay: 0.3,
      scale: [0.9, 1],
      rotate: [0, 0],
    },
    header: {
      duration: 1,
      delay: 0,
      scale: [1],
      rotate: [0],
    },
  };

  const cfg = config[mode];

    // Path del logo (Forma abstracta de flujo/distribucion)
  const pathData = "M60,20 Q80,30 80,50 T80,80 Q80,100 60,100 Q40,100 40,80 T40,50 Q40,30 60,20 Z M30,50 L90,50 M60,30 L60,90";

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: cfg.scale,
        rotate: cfg.rotate,
      }}
      transition={{
        duration: cfg.duration,
        delay: cfg.delay,
        ease: [0.25, 0.1, 0.25, 1],
        repeat: loop ? Infinity : 0,
        repeatDelay: loop ? 1 : 0,
      }}
      onAnimationComplete={onComplete}
    >
      {/* Glow Background */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background: 'radial-gradient(circle, rgba(0,217,255,0.4) 0%, rgba(139,92,246,0.2) 50%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* SVG Logo */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="logoGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d9ff" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>

          <linearGradient id="logoGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#00d9ff" />
          </linearGradient>

          <radialGradient id="logoGlow">
            <stop offset="0%" stopColor="#00d9ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background Circle Glow */}
        <motion.circle
          cx="60"
          cy="60"
          r="55"
          fill="url(#logoGlow)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.3, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Main Path - Draw Animation */}
        <motion.path
          d={pathData}
          stroke="url(#logoGradient1)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#glow)"
          initial={{
            pathLength: 0,
            opacity: 0,
          }}
          animate={{
            pathLength: 1,
            opacity: 1,
          }}
          transition={{
            pathLength: {
              duration: cfg.duration * 0.8,
              ease: 'easeInOut',
            },
            opacity: {
              duration: 0.3,
            },
          }}
        />

        {/* Fill Animation (after path is drawn) */}
        <motion.path
          d={pathData}
          fill="url(#logoGradient2)"
          opacity="0.3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{
            delay: cfg.duration * 0.6,
            duration: cfg.duration * 0.4,
            ease: 'easeOut',
          }}
        />

        {/* Center Dot */}
        <motion.circle
          cx="60"
          cy="60"
          r="8"
          fill="#00d9ff"
          filter="url(#glow)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: 1 }}
          transition={{
            delay: cfg.duration * 0.7,
            duration: 0.5,
            ease: 'backOut',
          }}
        />

        {/* Outer Ring */}
        <motion.circle
          cx="60"
          cy="60"
          r="50"
          stroke="url(#logoGradient1)"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
          initial={{
            pathLength: 0,
            rotate: 0,
          }}
          animate={{
            pathLength: 1,
            rotate: loop ? 360 : 0,
          }}
          transition={{
            pathLength: {
              duration: cfg.duration,
              ease: 'easeInOut',
            },
            rotate: {
              duration: 20,
              repeat: loop ? Infinity : 0,
              ease: 'linear',
            },
          }}
          style={{ originX: '60px', originY: '60px' }}
        />

        {/* Orbital Dots */}
        {[0, 120, 240].map((angle, idx) => (
          <motion.circle
            key={idx}
            cx={60 + 45 * Math.cos((angle * Math.PI) / 180)}
            cy={60 + 45 * Math.sin((angle * Math.PI) / 180)}
            r="3"
            fill="#8b5cf6"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1],
              opacity: [0, 1, 1],
            }}
            transition={{
              delay: cfg.duration * 0.5 + idx * 0.1,
              duration: 0.5,
              ease: 'backOut',
            }}
          />
        ))}
      </svg>

      {/* Sparkle Effects */}
      {mode === 'splash' && (
        <>
          {[...Array(8)].map((_, idx) => {
            const angle = (idx * 360) / 8;
            const radius = size * 0.6;
            return (
              <motion.div
                key={idx}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  x: (radius * Math.cos((angle * Math.PI) / 180)),
                  y: (radius * Math.sin((angle * Math.PI) / 180)),
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  delay: cfg.duration * 0.8 + idx * 0.05,
                  duration: 0.6,
                  ease: 'easeOut',
                }}
              />
            );
          })}
        </>
      )}

      {/* Text Label (for header mode) */}
      {mode === 'header' && (
        <motion.div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <span className="text-sm font-bold bg-gradient-to-r from-neon-cyan via-white to-neon-purple bg-clip-text text-transparent">
            FlowDistributor
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

export default AnimatedLogo;
