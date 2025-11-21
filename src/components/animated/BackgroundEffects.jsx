/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                    ULTRA PREMIUM BACKGROUND EFFECTS                        ║
 * ║              Efectos de fondo animados de alta calidad                    ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */
import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';

/**
 * UltraPremiumBackground - Fondo animado con gradientes y partículas
 */
export const UltraPremiumBackground = ({ variant = 'default', children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const gradients = {
    default: 'from-slate-950 via-slate-900 to-slate-950',
    blue: 'from-blue-950 via-slate-900 to-indigo-950',
    purple: 'from-purple-950 via-slate-900 to-blue-950',
    dark: 'from-gray-950 via-black to-gray-950',
  };

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {/* Gradiente base animado */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${gradients[variant]}`}
        animate={{
          backgroundPosition: [`${mousePosition.x}% ${mousePosition.y}%`, '50% 50%'],
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Efectos de luz radial */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Partículas flotantes */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}-${Math.random()}`}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Grid sutil */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Contenido hijo */}
      {children}
    </div>
  );
};

/**
 * AnimatedGradient - Gradiente animado simple
 */
export const AnimatedGradient = ({ className = '', children }) => {
  return (
    <motion.div
      className={`bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 ${className}`}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        backgroundSize: '200% 200%',
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * GlowEffect - Efecto de brillo animado
 */
export const GlowEffect = ({ color = 'blue', intensity = 'medium', children }) => {
  const intensities = {
    low: 'shadow-lg',
    medium: 'shadow-xl',
    high: 'shadow-2xl',
  };

  const colors = {
    blue: 'shadow-blue-500/50',
    purple: 'shadow-purple-500/50',
    pink: 'shadow-pink-500/50',
    green: 'shadow-green-500/50',
  };

  return (
    <motion.div
      className={`${intensities[intensity]} ${colors[color]}`}
      animate={{
        boxShadow: [
          `0 0 20px rgba(59, 130, 246, 0.5)`,
          `0 0 40px rgba(59, 130, 246, 0.8)`,
          `0 0 20px rgba(59, 130, 246, 0.5)`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * ParticleField - Campo de partículas animadas
 */
export const ParticleField = ({ count = 50, color = 'white' }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={`field-particle-${i}-${Math.random()}`}
          className={`absolute w-1 h-1 bg-${color} rounded-full`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 100],
            y: [0, (Math.random() - 0.5) * 100],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

/**
 * WaveBackground - Fondo con ondas animadas
 */
export const WaveBackground = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <svg
        className="absolute bottom-0 w-full h-64"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <motion.path
          fill="rgba(59, 130, 246, 0.1)"
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          animate={{
            d: [
              'M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
              'M0,160L48,144C96,128,192,96,288,96C384,96,480,128,576,144C672,160,768,160,864,144C960,128,1056,96,1152,96C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
              'M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </svg>
    </div>
  );
};

export default {
  UltraPremiumBackground,
  AnimatedGradient,
  GlowEffect,
  ParticleField,
  WaveBackground,
};
