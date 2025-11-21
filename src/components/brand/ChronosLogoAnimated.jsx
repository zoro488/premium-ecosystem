import { motion } from 'framer-motion';

// ============================================
// LOGO VERSION 1: MINIMAL (Imagen 4)
// Estrella + Elipse + 3 Líneas Verticales
// ============================================
export function ChronosLogoMinimal({
  size = 80,
  animated = true,
  glowIntensity = 0.6,
  className = '',
}) {
  return (
    <motion.svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 100 120"
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={animated ? { scale: 1.1, rotate: 5 } : {}}
      transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
    >
      <defs>
        {/* Glow filter */}
        <filter id="glow-minimal" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Gradient */}
        <linearGradient id="grad-minimal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Estrella superior (4 puntos) */}
      <motion.g
        animate={
          animated
            ? {
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ transformOrigin: '50px 10px' }}
      >
        <path
          d="M50 5 L52 10 L50 15 L48 10 Z"
          fill="url(#grad-minimal)"
          filter={`url(#glow-minimal)`}
          opacity={glowIntensity}
        />
      </motion.g>

      {/* Elipse horizontal central */}
      <motion.ellipse
        cx="50"
        cy="50"
        rx="30"
        ry="8"
        fill="none"
        stroke="url(#grad-minimal)"
        strokeWidth="2"
        filter="url(#glow-minimal)"
        animate={
          animated
            ? {
                scaleX: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8],
              }
            : {}
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ transformOrigin: '50px 50px' }}
      />

      {/* Líneas verticales (3 líneas) */}
      {/* Línea izquierda */}
      <motion.line
        x1="35"
        y1="35"
        x2="35"
        y2="65"
        stroke="url(#grad-minimal)"
        strokeWidth="2"
        strokeLinecap="round"
        animate={
          animated
            ? {
                opacity: [0.6, 1, 0.6],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 0,
        }}
      />

      {/* Línea central (más larga) */}
      <motion.line
        x1="50"
        y1="20"
        x2="50"
        y2="110"
        stroke="url(#grad-minimal)"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#glow-minimal)"
        animate={
          animated
            ? {
                opacity: [0.8, 1, 0.8],
                scaleY: [1, 1.02, 1],
              }
            : {}
        }
        transition={{
          duration: 2.5,
          repeat: Infinity,
        }}
        style={{ transformOrigin: '50px 65px' }}
      />

      {/* Línea derecha */}
      <motion.line
        x1="65"
        y1="35"
        x2="65"
        y2="65"
        stroke="url(#grad-minimal)"
        strokeWidth="2"
        strokeLinecap="round"
        animate={
          animated
            ? {
                opacity: [0.6, 1, 0.6],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 0.5,
        }}
      />
    </motion.svg>
  );
}

// ============================================
// LOGO VERSION 2: VERTICAL FULL (Imagen 5)
// Estrella + Planeta con Anillo + Cruz Vertical
// ============================================
export function ChronosLogoFull({ size = 150, animated = true, className = '' }) {
  return (
    <motion.svg
      width={size}
      height={size * 2}
      viewBox="0 0 150 300"
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
    >
      <defs>
        <filter id="glow-full" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="grad-full" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#4facfe', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#f093fb', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Estrella superior */}
      <motion.g
        animate={
          animated
            ? {
                rotate: [0, 90, 180, 270, 360],
                scale: [1, 1.1, 1],
              }
            : {}
        }
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{ transformOrigin: '75px 15px' }}
      >
        <path d="M75 5 L79 15 L75 25 L71 15 Z" fill="url(#grad-full)" filter="url(#glow-full)" />
      </motion.g>

      {/* Círculo principal (planeta) */}
      <motion.circle
        cx="75"
        cy="80"
        r="35"
        fill="none"
        stroke="url(#grad-full)"
        strokeWidth="2"
        filter="url(#glow-full)"
        animate={
          animated
            ? {
                scale: [1, 1.03, 1],
                opacity: [0.9, 1, 0.9],
              }
            : {}
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ transformOrigin: '75px 80px' }}
      />

      {/* Círculo interior */}
      <circle
        cx="75"
        cy="80"
        r="27"
        fill="none"
        stroke="url(#grad-full)"
        strokeWidth="1.5"
        opacity="0.5"
      />

      {/* Anillo orbital (elipse) - ANIMADO */}
      <motion.ellipse
        cx="75"
        cy="80"
        rx="60"
        ry="18"
        fill="none"
        stroke="url(#grad-full)"
        strokeWidth="2"
        filter="url(#glow-full)"
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
        style={{ transformOrigin: '75px 80px' }}
      />

      {/* Partículas en órbita (3 puntos) */}
      {[0, 120, 240].map((angle, i) => (
        <motion.circle
          key={i}
          cx="75"
          cy="80"
          r="2.5"
          fill="#ffffff"
          filter="url(#glow-full)"
          animate={
            animated
              ? {
                  x: [
                    Math.cos((angle * Math.PI) / 180) * 60,
                    Math.cos(((angle + 360) * Math.PI) / 180) * 60,
                  ],
                  y: [
                    Math.sin((angle * Math.PI) / 180) * 18,
                    Math.sin(((angle + 360) * Math.PI) / 180) * 18,
                  ],
                }
              : {}
          }
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Cruz vertical - parte superior */}
      <line
        x1="75"
        y1="125"
        x2="75"
        y2="145"
        stroke="url(#grad-full)"
        strokeWidth="2"
        filter="url(#glow-full)"
      />

      {/* Rectángulo central */}
      <rect
        x="68"
        y="145"
        width="14"
        height="40"
        fill="none"
        stroke="url(#grad-full)"
        strokeWidth="2"
        opacity="0.7"
      />

      {/* Línea punteada */}
      <motion.line
        x1="65"
        y1="145"
        x2="65"
        y2="230"
        stroke="url(#grad-full)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        animate={
          animated
            ? {
                strokeDashoffset: [0, -8],
              }
            : {}
        }
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Línea sólida larga */}
      <line
        x1="75"
        y1="145"
        x2="75"
        y2="280"
        stroke="url(#grad-full)"
        strokeWidth="2"
        filter="url(#glow-full)"
      />

      {/* Partículas flotantes */}
      {[155, 175, 195, 215].map((y, i) => (
        <motion.circle
          key={`particle-${i}`}
          cx={80 + i * 5}
          cy={y}
          r="1.5"
          fill="#ffffff"
          opacity="0.6"
          animate={
            animated
              ? {
                  y: [0, -10, 0],
                  opacity: [0.4, 1, 0.4],
                }
              : {}
          }
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Estrellas decorativas laterales */}
      <motion.path
        d="M55 150 L57 153 L55 156 L53 153 Z"
        fill="url(#grad-full)"
        opacity="0.6"
        animate={
          animated
            ? {
                opacity: [0.4, 1, 0.4],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 0.5,
        }}
      />

      {/* Estrella inferior */}
      <motion.path
        d="M75 285 L79 290 L75 295 L71 290 Z"
        fill="url(#grad-full)"
        filter="url(#glow-full)"
        animate={
          animated
            ? {
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 1,
        }}
        style={{ transformOrigin: '75px 290px' }}
      />
    </motion.svg>
  );
}

// ============================================
// LOGO VERSION 3: COMPACT WITH CLOCK (Imagen 6)
// Semicírculo + Reloj + Anillo Orbital
// ============================================
export function ChronosLogoCompact({ size = 120, animated = true, className = '' }) {
  return (
    <motion.svg
      width={size}
      height={size * 1.8}
      viewBox="0 0 120 216"
      className={className}
      whileHover={{ scale: 1.08 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <defs>
        <filter id="glow-compact">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="grad-compact" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#fa709a', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#fee140', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Estrella superior */}
      <motion.path
        d="M60 5 L63 10 L60 15 L57 10 Z"
        fill="url(#grad-compact)"
        filter="url(#glow-compact)"
        animate={
          animated
            ? {
                rotate: 360,
                scale: [1, 1.1, 1],
              }
            : {}
        }
        transition={{
          rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
          scale: { duration: 2, repeat: Infinity },
        }}
        style={{ transformOrigin: '60px 10px' }}
      />

      {/* Semicírculo superior */}
      <path
        d="M25 60 Q60 30 95 60"
        fill="none"
        stroke="url(#grad-compact)"
        strokeWidth="2"
        filter="url(#glow-compact)"
      />

      {/* Círculo central (reloj) */}
      <motion.circle
        cx="60"
        cy="60"
        r="25"
        fill="none"
        stroke="url(#grad-compact)"
        strokeWidth="2"
        filter="url(#glow-compact)"
        animate={
          animated
            ? {
                rotate: -360,
              }
            : {}
        }
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ transformOrigin: '60px 60px' }}
      />

      {/* Líneas radiales del reloj (8 líneas como en la imagen) */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const length = i % 2 === 0 ? 18 : 15; // Alternar longitud
        return (
          <motion.line
            key={i}
            x1="60"
            y1="60"
            x2={60 + Math.cos((angle * Math.PI) / 180) * length}
            y2={60 + Math.sin((angle * Math.PI) / 180) * length}
            stroke="url(#grad-compact)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
            animate={
              animated
                ? {
                    opacity: [0.4, 1, 0.4],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        );
      })}

      {/* Anillo orbital elíptico */}
      <motion.ellipse
        cx="60"
        cy="60"
        rx="48"
        ry="14"
        fill="none"
        stroke="url(#grad-compact)"
        strokeWidth="2"
        filter="url(#glow-compact)"
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

      {/* Línea vertical principal */}
      <line
        x1="60"
        y1="90"
        x2="60"
        y2="210"
        stroke="url(#grad-compact)"
        strokeWidth="2"
        filter="url(#glow-compact)"
      />

      {/* Estrella lateral izquierda */}
      <motion.path
        d="M20 110 L23 115 L20 120 L17 115 Z"
        fill="url(#grad-compact)"
        filter="url(#glow-compact)"
        animate={
          animated
            ? {
                x: [-3, 0, -3],
                opacity: [0.5, 1, 0.5],
              }
            : {}
        }
        transition={{
          duration: 2.5,
          repeat: Infinity,
        }}
      />
    </motion.svg>
  );
}

// ============================================
// LOGO UNIVERSAL - Auto-detecta cuál usar
// ============================================
export function ChronosLogo({
  variant = 'full',
  size = undefined,
  animated = true,
  className = '',
}) {
  switch (variant) {
    case 'minimal':
      return <ChronosLogoMinimal size={size || 80} animated={animated} className={className} />;
    case 'compact':
      return <ChronosLogoCompact size={size || 120} animated={animated} className={className} />;
    case 'full':
    default:
      return <ChronosLogoFull size={size || 150} animated={animated} className={className} />;
  }
}

// ============================================
// EXPORT DEFAULT
// ============================================
export default ChronosLogo;
