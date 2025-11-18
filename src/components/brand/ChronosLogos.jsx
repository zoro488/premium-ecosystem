/**
 * 🌟 CHRONOS LOGOS - Componentes SVG Animados
 * Basados en los diseños minimalistas cósmicos proporcionados
 * 3 versiones: Full, Compact, Icon
 */
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

// ============================================
// LOGO VERSION 1: COMPLETO - PLANETA CON ÓRBITA VERTICAL
// Basado en: 24b09eaa5933dae87d2eed3345c018b4.jpg
// ============================================
export function ChronosLogoFull({
  size = 200,
  animated = true,
  glowIntensity = 'medium',
  className = '',
}) {
  const glowValues = {
    low: '2',
    medium: '4',
    high: '8',
  };

  return (
    <motion.svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 200 300"
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
    >
      <defs>
        {/* Glow Filter */}
        <filter id="chronos-glow">
          <feGaussianBlur stdDeviation={glowValues[glowIntensity]} result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Gradient Definitions */}
        <linearGradient id="chronos-gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="50%" stopColor="#764ba2" />
          <stop offset="100%" stopColor="#f093fb" />
        </linearGradient>

        <radialGradient id="chronos-radial" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#667eea" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#764ba2" stopOpacity="0.2" />
        </radialGradient>
      </defs>

      {/* Estrella Superior */}
      <motion.g
        animate={
          animated
            ? {
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ transformOrigin: '100px 10px' }}
      >
        <path
          d="M100 5 L103 10 L100 15 L97 10 Z"
          fill="url(#chronos-gradient-primary)"
          filter="url(#chronos-glow)"
        />
      </motion.g>

      {/* Planeta Central con Anillos */}
      <g>
        {/* Círculo Exterior Principal */}
        <motion.circle
          cx="100"
          cy="100"
          r="40"
          fill="none"
          stroke="url(#chronos-gradient-primary)"
          strokeWidth="2"
          filter="url(#chronos-glow)"
          animate={
            animated
              ? {
                  scale: [1, 1.03, 1],
                }
              : {}
          }
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '100px 100px' }}
        />

        {/* Círculo Interior */}
        <circle
          cx="100"
          cy="100"
          r="30"
          fill="none"
          stroke="url(#chronos-gradient-primary)"
          strokeWidth="1"
          opacity="0.4"
        />

        {/* Círculo Central Pequeño */}
        <circle cx="100" cy="100" r="8" fill="url(#chronos-radial)" filter="url(#chronos-glow)" />

        {/* Anillo Orbital Horizontal Animado */}
        <motion.ellipse
          cx="100"
          cy="100"
          rx="70"
          ry="18"
          fill="none"
          stroke="url(#chronos-gradient-primary)"
          strokeWidth="2"
          opacity="0.6"
          filter="url(#chronos-glow)"
          animate={
            animated
              ? {
                  rotateZ: 360,
                }
              : {}
          }
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ transformOrigin: '100px 100px' }}
        />

        {/* Partículas Orbitales */}
        {animated &&
          [0, 120, 240].map((angle, i) => {
            const uniqueId = `orbital-${angle}-${Math.random().toString(36).substr(2, 9)}`;
            return (
              <motion.circle
                key={uniqueId}
                cx="100"
                cy="100"
                r="4"
                fill="#ffffff"
                filter="url(#chronos-glow)"
                animate={{
                  x: [
                    Math.cos((angle * Math.PI) / 180) * 70,
                    Math.cos(((angle + 360) * Math.PI) / 180) * 70,
                  ],
                  y: [
                    Math.sin((angle * Math.PI) / 180) * 18,
                    Math.sin(((angle + 360) * Math.PI) / 180) * 18,
                  ],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 0.3,
                }}
              />
            );
          })}
      </g>

      {/* Línea Vertical Central (Cruz Cósmica) */}
      <g>
        {/* Línea Punteada Animada */}
        <motion.line
          x1="100"
          y1="150"
          x2="100"
          y2="280"
          stroke="url(#chronos-gradient-primary)"
          strokeWidth="1.5"
          strokeDasharray="8,6"
          opacity="0.5"
          animate={
            animated
              ? {
                  strokeDashoffset: [0, -14],
                }
              : {}
          }
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Línea Sólida */}
        <line
          x1="100"
          y1="150"
          x2="100"
          y2="280"
          stroke="url(#chronos-gradient-primary)"
          strokeWidth="2"
          filter="url(#chronos-glow)"
        />

        {/* Rectángulo Decorativo Medio */}
        <rect
          x="95"
          y="200"
          width="10"
          height="40"
          fill="none"
          stroke="url(#chronos-gradient-primary)"
          strokeWidth="1"
          opacity="0.3"
        />
      </g>

      {/* Estrella Inferior */}
      <motion.g
        animate={
          animated
            ? {
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        style={{ transformOrigin: '100px 290px' }}
      >
        <path
          d="M100 295 L103 290 L100 285 L97 290 Z"
          fill="url(#chronos-gradient-primary)"
          filter="url(#chronos-glow)"
        />
      </motion.g>

      {/* Partículas Flotantes Decorativas */}
      {animated &&
        [...Array(8)].map((_, i) => {
          const uniqueId = `particle-deco-${i}-${Math.random().toString(36).substr(2, 9)}`;
          return (
            <motion.circle
              key={uniqueId}
              cx={60 + i * 12}
              cy={210 + (i % 2) * 30}
              r="1.5"
              fill="#ffffff"
              opacity="0.4"
              animate={{
                y: [0, -25, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            />
          );
        })}

      {/* Cruz Lateral Pequeña (Detalle Minimalista) */}
      <motion.g
        animate={
          animated
            ? {
                opacity: [0.3, 0.7, 0.3],
              }
            : {}
        }
        transition={{
          duration: 2.5,
          repeat: Infinity,
        }}
      >
        <line
          x1="35"
          y1="180"
          x2="35"
          y2="195"
          stroke="url(#chronos-gradient-primary)"
          strokeWidth="1"
          opacity="0.4"
        />
        <line
          x1="27.5"
          y1="187.5"
          x2="42.5"
          y2="187.5"
          stroke="url(#chronos-gradient-primary)"
          strokeWidth="1"
          opacity="0.4"
        />
      </motion.g>
    </motion.svg>
  );
}

ChronosLogoFull.propTypes = {
  size: PropTypes.number,
  animated: PropTypes.bool,
  glowIntensity: PropTypes.oneOf(['low', 'medium', 'high']),
  className: PropTypes.string,
};

// ============================================
// LOGO VERSION 2: COMPACTO - RELOJ CÓSMICO
// Basado en: 0a81b9489e1abf5a9bd4b709471a8cf8.jpg
// ============================================
export function ChronosLogoCompact({ size = 120, animated = true, className = '' }) {
  return (
    <motion.svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 120 180"
      className={className}
      whileHover={{ scale: 1.08, rotate: 3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <defs>
        <linearGradient id="chronos-compact-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4facfe" />
          <stop offset="50%" stopColor="#00f2fe" />
          <stop offset="100%" stopColor="#667eea" />
        </linearGradient>

        <filter id="chronos-compact-glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Estrella Superior */}
      <motion.g
        animate={
          animated
            ? {
                rotate: 360,
                scale: [1, 1.2, 1],
              }
            : {}
        }
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          scale: { duration: 2, repeat: Infinity },
        }}
        style={{ transformOrigin: '60px 8px' }}
      >
        <path
          d="M60 4 L62 8 L60 12 L58 8 Z"
          fill="url(#chronos-compact-gradient)"
          filter="url(#chronos-compact-glow)"
        />
      </motion.g>

      {/* Semicírculo Superior */}
      <path
        d="M30 60 Q60 30 90 60"
        fill="none"
        stroke="url(#chronos-compact-gradient)"
        strokeWidth="2"
        filter="url(#chronos-compact-glow)"
      />

      {/* Círculo Central con Segmentos de Reloj */}
      <g>
        <motion.circle
          cx="60"
          cy="60"
          r="28"
          fill="none"
          stroke="url(#chronos-compact-gradient)"
          strokeWidth="2"
          filter="url(#chronos-compact-glow)"
          animate={
            animated
              ? {
                  rotate: -360,
                  strokeDashoffset: [0, -175],
                }
              : {}
          }
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
          strokeDasharray="175"
          style={{ transformOrigin: '60px 60px' }}
        />

        {/* Líneas Radiales (Marcadores de Reloj) */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
          const uniqueId = `radial-${angle}-${Math.random().toString(36).substr(2, 9)}`;
          return (
            <motion.line
              key={uniqueId}
              x1="60"
              y1="60"
              x2={60 + Math.cos(((angle - 90) * Math.PI) / 180) * 22}
              y2={60 + Math.sin(((angle - 90) * Math.PI) / 180) * 22}
              stroke="url(#chronos-compact-gradient)"
              strokeWidth={angle % 90 === 0 ? '2' : '1'}
              opacity={angle % 90 === 0 ? '0.8' : '0.4'}
              animate={
                animated
                  ? {
                      opacity: [0.2, 1, 0.2],
                    }
                  : {}
              }
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            />
          );
        })}

        {/* Centro del Reloj */}
        <circle
          cx="60"
          cy="60"
          r="4"
          fill="url(#chronos-compact-gradient)"
          filter="url(#chronos-compact-glow)"
        />
      </g>

      {/* Anillo Orbital Diagonal */}
      <motion.ellipse
        cx="60"
        cy="60"
        rx="50"
        ry="12"
        fill="none"
        stroke="url(#chronos-compact-gradient)"
        strokeWidth="2"
        opacity="0.6"
        filter="url(#chronos-compact-glow)"
        animate={
          animated
            ? {
                rotateZ: 360,
              }
            : {}
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ transformOrigin: '60px 60px' }}
      />

      {/* Cruz Vertical Inferior */}
      <line
        x1="60"
        y1="95"
        x2="60"
        y2="170"
        stroke="url(#chronos-compact-gradient)"
        strokeWidth="2"
        filter="url(#chronos-compact-glow)"
      />

      {/* Estrellas Laterales */}
      <motion.g
        animate={
          animated
            ? {
                x: [-3, 0, -3],
                opacity: [0.4, 1, 0.4],
              }
            : {}
        }
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <path
          d="M18 110 L20 115 L18 120 L16 115 Z"
          fill="url(#chronos-compact-gradient)"
          filter="url(#chronos-compact-glow)"
        />
      </motion.g>

      {/* Puntos Decorativos Inferiores */}
      {[130, 145, 160].map((y, i) => {
        const uniqueId = `dot-y${y}-${Math.random().toString(36).substr(2, 9)}`;
        return (
          <motion.circle
            key={uniqueId}
            cx="60"
            cy={y}
            r="2"
            fill="#ffffff"
            opacity="0.6"
            animate={
              animated
                ? {
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 1, 0.4],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        );
      })}
    </motion.svg>
  );
}

ChronosLogoCompact.propTypes = {
  size: PropTypes.number,
  animated: PropTypes.bool,
  className: PropTypes.string,
};

// ============================================
// LOGO VERSION 3: MINIMAL ICON
// Basado en: ac3f1b2235cd690784e32349baacd146.jpg
// ============================================
export function ChronosLogoIcon({ size = 60, animated = true, className = '' }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      className={className}
      whileHover={{ scale: 1.15, rotate: 360 }}
      transition={{ duration: 0.6 }}
    >
      <defs>
        <linearGradient id="chronos-icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f093fb" />
          <stop offset="50%" stopColor="#f5576c" />
          <stop offset="100%" stopColor="#667eea" />
        </linearGradient>

        <filter id="chronos-icon-glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Estrella Superior */}
      <motion.path
        d="M30 4 L31.5 8 L30 12 L28.5 8 Z"
        fill="url(#chronos-icon-gradient)"
        filter="url(#chronos-icon-glow)"
        animate={
          animated
            ? {
                scale: [1, 1.4, 1],
                rotate: [0, 180, 360],
              }
            : {}
        }
        transition={{
          scale: { duration: 1.5, repeat: Infinity },
          rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
        }}
        style={{ transformOrigin: '30px 8px' }}
      />

      {/* Anillo Horizontal Principal */}
      <motion.ellipse
        cx="30"
        cy="30"
        rx="22"
        ry="6"
        fill="none"
        stroke="url(#chronos-icon-gradient)"
        strokeWidth="2"
        filter="url(#chronos-icon-glow)"
        animate={
          animated
            ? {
                scaleX: [1, 1.08, 1],
                opacity: [0.7, 1, 0.7],
              }
            : {}
        }
        transition={{
          duration: 2.5,
          repeat: Infinity,
        }}
      />

      {/* Líneas Verticales Paralelas */}
      <g>
        <motion.line
          x1="24"
          y1="18"
          x2="24"
          y2="42"
          stroke="url(#chronos-icon-gradient)"
          strokeWidth="1.5"
          animate={
            animated
              ? {
                  y1: [18, 20, 18],
                  y2: [42, 40, 42],
                  opacity: [0.5, 1, 0.5],
                }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.line
          x1="30"
          y1="14"
          x2="30"
          y2="46"
          stroke="url(#chronos-icon-gradient)"
          strokeWidth="2"
          filter="url(#chronos-icon-glow)"
          animate={
            animated
              ? {
                  scaleY: [1, 1.05, 1],
                }
              : {}
          }
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{ transformOrigin: '30px 30px' }}
        />
        <motion.line
          x1="36"
          y1="18"
          x2="36"
          y2="42"
          stroke="url(#chronos-icon-gradient)"
          strokeWidth="1.5"
          animate={
            animated
              ? {
                  y1: [18, 16, 18],
                  y2: [42, 44, 42],
                  opacity: [0.5, 1, 0.5],
                }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        />
      </g>

      {/* Cruz Decorativa Inferior */}
      <motion.g
        animate={
          animated
            ? {
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.1, 1],
              }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: '30px 52px' }}
      >
        <line
          x1="30"
          y1="48"
          x2="30"
          y2="56"
          stroke="url(#chronos-icon-gradient)"
          strokeWidth="1"
        />
        <line
          x1="26"
          y1="52"
          x2="34"
          y2="52"
          stroke="url(#chronos-icon-gradient)"
          strokeWidth="1"
        />
      </motion.g>
    </motion.svg>
  );
}

ChronosLogoIcon.propTypes = {
  size: PropTypes.number,
  animated: PropTypes.bool,
  className: PropTypes.string,
};

// ============================================
// LOGO CON TEXTO "CHRONOS"
// ============================================
export function ChronosLogoWithText({ size = 300, logoVariant = 'full', className = '' }) {
  const LogoComponent = {
    full: ChronosLogoFull,
    compact: ChronosLogoCompact,
    icon: ChronosLogoIcon,
  }[logoVariant];

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      <LogoComponent size={size} animated={true} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-center"
      >
        <motion.h1
          className="text-6xl md:text-8xl font-black tracking-widest"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          animate={{
            backgroundPosition: ['0% center', '200% center', '0% center'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          CHRONOS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-gray-400 text-xl md:text-2xl mt-4 tracking-[0.3em] font-light"
        >
          PREMIUM ECOSYSTEM
        </motion.p>
      </motion.div>
    </div>
  );
}

ChronosLogoWithText.propTypes = {
  size: PropTypes.number,
  logoVariant: PropTypes.oneOf(['full', 'compact', 'icon']),
  className: PropTypes.string,
};

// ============================================
// DEFAULT EXPORT
// ============================================
export default {
  Full: ChronosLogoFull,
  Compact: ChronosLogoCompact,
  Icon: ChronosLogoIcon,
  WithText: ChronosLogoWithText,
};
