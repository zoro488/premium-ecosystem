/**
 * 🎨 ANIMATED BACKGROUND COMPONENT
 *
 * Fondo animado reutilizable con:
 * - Gradientes dinámicos que cambian de color
 * - Partículas flotantes con física realista
 * - Patrones geométricos animados
 * - Efectos de luz y resplandor
 * - Tema personalizable
 * - Performance optimizado
 *
 * @version 1.0.0
 */

import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { memo, useEffect, useMemo, useRef } from 'react';

interface AnimatedBackgroundProps {
  /**
   * Tema de colores (preset o custom)
   */
  theme?:
    | 'purple'    // Morado/Rosa (default)
    | 'blue'      // Azul/Cyan
    | 'green'     // Verde/Esmeralda
    | 'orange'    // Naranja/Amarillo
    | 'red'       // Rojo/Rosa
    | 'teal'      // Teal/Aqua
    | 'indigo';   // Índigo/Violeta

  /**
   * Colores personalizados [from, via, to]
   */
  customColors?: [string, string, string];

  /**
   * Número de partículas (5-50 recomendado)
   */
  particleCount?: number;

  /**
   * Mostrar patrones geométricos de fondo
   */
  showPatterns?: boolean;

  /**
   * Intensidad de animación (0-1)
   */
  intensity?: number;

  /**
   * Clase CSS adicional
   */
  className?: string;
}

// Presets de colores
const COLOR_THEMES = {
  purple: ['#7c3aed', '#a855f7', '#ec4899'],
  blue: ['#1d4ed8', '#3b82f6', '#06b6d4'],
  green: ['#059669', '#10b981', '#34d399'],
  orange: ['#ea580c', '#f97316', '#fb923c'],
  red: ['#dc2626', '#ef4444', '#f87171'],
  teal: ['#0d9488', '#14b8a6', '#2dd4bf'],
  indigo: ['#4f46e5', '#6366f1', '#818cf8'],
};

/**
 * ✨ Componente de Partícula Individual
 */
const Particle = memo(({ color, intensity }: { color: string; intensity: number }) => {
  const x = useMotionValue(Math.random() * 100);
  const y = useMotionValue(Math.random() * 100);
  const size = useMemo(() => 2 + Math.random() * 4, []);
  const duration = useMemo(() => 20 + Math.random() * 30, []);
  const delay = useMemo(() => Math.random() * 5, []);
  const opacity = useTransform(x, [0, 100], [0.1, 0.5]);

  return (
    <motion.div
      className="absolute rounded-full blur-sm"
      style={{
        left: `${x.get()}%`,
        top: `${y.get()}%`,
        width: size,
        height: size,
        backgroundColor: color,
        opacity,
      }}
      animate={{
        x: ['0%', '100%', '0%'],
        y: ['0%', '50%', '100%', '0%'],
      }}
      transition={{
        duration: duration * intensity,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
        delay,
      }}
    />
  );
});

Particle.displayName = 'Particle';

/**
 * 🎨 Componente Principal: Animated Background
 */
export const AnimatedBackground = memo<AnimatedBackgroundProps>(({
  theme = 'purple',
  customColors,
  particleCount = 20,
  showPatterns = true,
  intensity = 0.7,
  className = '',
}) => {
  const colors = customColors || COLOR_THEMES[theme];
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Animación del gradiente de fondo
  useEffect(() => {
    const animate = async () => {
      await controls.start({
        background: [
          `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
          `linear-gradient(225deg, ${colors[1]}, ${colors[2]}, ${colors[0]})`,
          `linear-gradient(315deg, ${colors[2]}, ${colors[0]}, ${colors[1]})`,
          `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
        ],
        transition: {
          duration: 15 / intensity,
          ease: 'easeInOut',
          repeat: Infinity,
        },
      });
    };
    animate();
  }, [colors, intensity, controls]);

  // Generar partículas
  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => (
        <Particle
          key={i}
          index={i}
          color={colors[i % colors.length] || colors[0]}
          intensity={intensity}
        />
      )),
    [particleCount, colors, intensity]
  );

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    >
      {/* Gradiente animado de fondo */}
      <motion.div
        className="absolute inset-0"
        animate={controls}
        style={{
          background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
        }}
      />

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/90" />

      {/* Partículas flotantes */}
      <div className="absolute inset-0">{particles}</div>

      {/* Patrones geométricos */}
      {showPatterns && (
        <>
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(${colors[0]} 1px, transparent 1px),
                linear-gradient(90deg, ${colors[0]} 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />

          {/* Círculos decorativos */}
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: colors[1] }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20 / intensity,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          <motion.div
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: colors[2] }}
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25 / intensity,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Ondas radiales */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: '200%', height: '200%' }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 border rounded-full opacity-5"
                style={{ borderColor: colors[i] }}
                animate={{
                  scale: [0.8, 1.5],
                  opacity: [0.1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 1.3,
                  ease: 'easeOut',
                }}
              />
            ))}
          </motion.div>
        </>
      )}

      {/* Efecto de resplandor superior */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${colors[0]}, transparent)`,
          boxShadow: `0 0 30px 10px ${colors[0]}`,
        }}
      />
    </div>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';

export default AnimatedBackground;
