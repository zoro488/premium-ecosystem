/**
 * ⏰ CHRONOS LOGO - DISEÑO ABSTRACTO COMPLEJO
 *
 * Logo cinematográfico avanzado con:
 * - Geometría fractal y patrones complejos
 * - Múltiples capas de animación sincronizadas
 * - Efectos de partículas y distorsión temporal
 * - Inspirado en: mecánica cuántica, cosmos, tecnología futurista
 */

import { motion } from 'framer-motion';
import { memo, useMemo } from 'react';

interface ChronosLogoProps {
  size?: 'sm' | 'md' | 'lg';
  position?: 'header' | 'floating';
  onClick?: () => void;
  showText?: boolean;
}

const sizeMap = {
  sm: { svg: 45, text: 'text-xs' },
  md: { svg: 70, text: 'text-sm' },
  lg: { svg: 100, text: 'text-base' },
};

const ChronosLogo = memo(({
  size = 'md',
  position = 'header',
  onClick,
  showText = true
}: ChronosLogoProps) => {
  const { svg: logoSize, text: textSize } = sizeMap[size];
  const viewBox = 200;
  const center = viewBox / 2;

  // Generar puntos para patrones geométricos complejos
  const hexagonPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const x = center + 50 * Math.cos(angle);
      const y = center + 50 * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  }, [center]);

  const starPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI / 4) * i;
      const radius = i % 2 === 0 ? 35 : 20;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  }, [center]);

  // Fragmentos orbitales
  const orbitalFragments = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (360 / 12) * i;
      const radius = 70;
      return {
        id: i,
        angle,
        delay: i * 0.08,
        radius,
      };
    });
  }, []);

  return (
    <motion.div
      className={`flex items-center gap-3 cursor-pointer select-none ${
        position === 'floating' ? 'fixed top-6 left-6 z-50' : ''
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Logo SVG - Diseño Complejo */}
      <div className="relative" style={{ width: logoSize, height: logoSize }}>
        <motion.svg
          width={logoSize}
          height={logoSize}
          viewBox={`0 0 ${viewBox} ${viewBox}`}
          className="filter drop-shadow-2xl"
        >
          <defs>
            {/* Gradientes complejos */}
            <linearGradient id="chrono-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0.8" />
              <stop offset="50%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor="white" stopOpacity="0.1" />
            </linearGradient>

            <radialGradient id="chrono-grad-radial">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="70%" stopColor="white" stopOpacity="0.3" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>

            {/* Filtro de glow */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Capa 1: Anillos externos con geometría compleja */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            style={{ originX: `${center}px`, originY: `${center}px` }}
          >
            {[85, 75, 65].map((r, i) => (
              <motion.circle
                key={`outer-${i}`}
                cx={center}
                cy={center}
                r={r}
                fill="none"
                stroke="url(#chrono-grad-1)"
                strokeWidth={i === 1 ? "2" : "1"}
                strokeDasharray={i === 0 ? "8 4" : i === 1 ? "4 8" : "2 12"}
                opacity={0.3 + i * 0.1}
                animate={{
                  strokeDashoffset: [0, i % 2 === 0 ? -24 : 24],
                  opacity: [0.3 + i * 0.1, 0.6 + i * 0.1, 0.3 + i * 0.1]
                }}
                transition={{
                  strokeDashoffset: { duration: 3 + i, repeat: Infinity, ease: 'linear' },
                  opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }}
              />
            ))}
          </motion.g>

          {/* Capa 2: Hexágono giratorio */}
          <motion.g
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            style={{ originX: `${center}px`, originY: `${center}px` }}
          >
            <motion.polygon
              points={hexagonPoints}
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              opacity="0.4"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ originX: `${center}px`, originY: `${center}px` }}
            />

            {/* Líneas conectoras del hexágono */}
            {Array.from({ length: 6 }).map((_, i) => {
              const angle1 = (Math.PI / 3) * i - Math.PI / 2;
              const angle2 = (Math.PI / 3) * ((i + 2) % 6) - Math.PI / 2;
              const x1 = center + 50 * Math.cos(angle1);
              const y1 = center + 50 * Math.sin(angle1);
              const x2 = center + 50 * Math.cos(angle2);
              const y2 = center + 50 * Math.sin(angle2);

              return (
                <motion.line
                  key={`hex-line-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="white"
                  strokeWidth="0.5"
                  opacity="0.2"
                  animate={{ opacity: [0.1, 0.4, 0.1] }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
              );
            })}
          </motion.g>

          {/* Capa 3: Fragmentos orbitales */}
          {orbitalFragments.map((frag) => {
            const x = center + frag.radius * Math.cos((frag.angle * Math.PI) / 180);
            const y = center + frag.radius * Math.sin((frag.angle * Math.PI) / 180);

            return (
              <motion.g
                key={`orbital-${frag.id}`}
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: 'linear', delay: frag.delay },
                  scale: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: frag.delay }
                }}
                style={{ originX: `${center}px`, originY: `${center}px` }}
              >
                <motion.rect
                  x={x - 2}
                  y={y - 2}
                  width="4"
                  height="4"
                  fill="white"
                  opacity="0.6"
                  animate={{ opacity: [0.3, 0.9, 0.3] }}
                  transition={{ duration: 1.5, delay: frag.delay, repeat: Infinity }}
                />
                <motion.circle
                  cx={x}
                  cy={y}
                  r="1"
                  fill="white"
                  opacity="0.8"
                />
              </motion.g>
            );
          })}

          {/* Capa 4: Estrella interna abstracta */}
          <motion.g
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{
              rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
              scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
            }}
            style={{ originX: `${center}px`, originY: `${center}px` }}
          >
            <polygon
              points={starPoints}
              fill="none"
              stroke="white"
              strokeWidth="2"
              opacity="0.5"
              filter="url(#glow)"
            />
          </motion.g>

          {/* Capa 5: Núcleo central con geometría compleja */}
          <motion.g
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 15, repeat: Infinity, ease: 'linear' }
            }}
            style={{ originX: `${center}px`, originY: `${center}px` }}
          >
            {/* Triángulos entrelazados */}
            <path
              d={`M ${center} ${center - 20} L ${center + 17} ${center + 10} L ${center - 17} ${center + 10} Z`}
              fill="white"
              opacity="0.8"
            />
            <motion.path
              d={`M ${center} ${center + 20} L ${center - 17} ${center - 10} L ${center + 17} ${center - 10} Z`}
              fill="white"
              opacity="0.6"
              animate={{ opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.g>

          {/* Capa 6: Círculo central pulsante */}
          <motion.circle
            cx={center}
            cy={center}
            r="8"
            fill="url(#chrono-grad-radial)"
            animate={{
              r: [8, 12, 8],
              opacity: [1, 0.7, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Capa 7: Líneas de energía radiales */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (360 / 16) * i;
            const x1 = center + 25 * Math.cos((angle * Math.PI) / 180);
            const y1 = center + 25 * Math.sin((angle * Math.PI) / 180);
            const x2 = center + 55 * Math.cos((angle * Math.PI) / 180);
            const y2 = center + 55 * Math.sin((angle * Math.PI) / 180);

            return (
              <motion.line
                key={`energy-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="white"
                strokeWidth="0.5"
                opacity="0.3"
                animate={{
                  opacity: [0.1, 0.5, 0.1],
                  strokeWidth: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.05,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            );
          })}
        </motion.svg>

        {/* Efectos de partículas flotantes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${20 + (i * 10)}%`,
                top: `${30 + (i * 5)}%`,
              }}
              animate={{
                y: [-20, 20],
                x: [-10, 10],
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 3 + i * 0.3,
                delay: i * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Glow effect múltiple */}
        <motion.div
          className="absolute inset-0 bg-white rounded-full blur-2xl opacity-10 pointer-events-none"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.05, 0.2, 0.05],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute inset-0 bg-cyan-400 rounded-full blur-xl opacity-10 pointer-events-none"
          animate={{
            scale: [1.2, 1.6, 1.2],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 5,
            delay: 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Texto con efectos */}
      {showText && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="text-white relative"
        >
          <motion.h1
            className={`font-bold tracking-[0.3em] ${textSize}`}
            animate={{
              textShadow: [
                '0 0 10px rgba(255,255,255,0.3)',
                '0 0 20px rgba(255,255,255,0.5)',
                '0 0 10px rgba(255,255,255,0.3)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            CHRONOS
          </motion.h1>
          <motion.div className="flex items-center gap-1 mt-0.5">
            {['F', 'L', 'O', 'W'].map((letter, i) => (
              <motion.span
                key={i}
                className="text-white/60 text-[0.55rem] tracking-widest font-mono"
                animate={{
                  opacity: [0.4, 0.9, 0.4],
                  y: [0, -2, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
});

ChronosLogo.displayName = 'ChronosLogo';

export default ChronosLogo;
