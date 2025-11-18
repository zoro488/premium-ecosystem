/**
 * 🎨 BACKGROUND EFFECTS SYSTEM - Efectos de fondo ultra-premium
 * Floating particles, gradient orbs, animated grids, radial glows
 */
import { useMemo } from 'react';

import { motion } from 'framer-motion';

/**
 * Floating Particles Background
 */
export const FloatingParticles = ({ count = 50, colors = ['cyan', 'purple', 'pink'] }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: `particle-${i}-${Date.now()}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 10 + 15,
        delay: Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
      })),
    [count, colors]
  );

  const colorClasses = {
    cyan: 'bg-cyan-400',
    purple: 'bg-purple-400',
    pink: 'bg-pink-400',
    blue: 'bg-blue-400',
    emerald: 'bg-emerald-400',
    yellow: 'bg-yellow-400',
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${colorClasses[particle.color]}/20`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

/**
 * Gradient Orbs - Orbes con gradientes que se mueven
 */
export const GradientOrbs = ({ count = 3 }) => {
  const orbs = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: `orb-${i}-${Date.now()}`,
        initialX: Math.random() * 80 + 10,
        initialY: Math.random() * 80 + 10,
        size: Math.random() * 300 + 200,
        duration: Math.random() * 20 + 20,
        gradient: i % 3 === 0 ? 'cyan-purple' : i % 3 === 1 ? 'purple-pink' : 'pink-cyan',
      })),
    [count]
  );

  const gradients = {
    'cyan-purple': 'from-cyan-500 to-purple-500',
    'purple-pink': 'from-purple-500 to-pink-500',
    'pink-cyan': 'from-pink-500 to-cyan-500',
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className={`absolute rounded-full bg-gradient-to-br ${gradients[orb.gradient]} blur-3xl opacity-20`}
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.initialX}%`,
            top: `${orb.initialY}%`,
          }}
          animate={{
            x: [0, 200, -100, 0],
            y: [0, -150, 100, 0],
            scale: [1, 1.3, 0.9, 1],
            opacity: [0.1, 0.3, 0.15, 0.1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

/**
 * Animated Grid Background
 */
export const AnimatedGrid = ({ size = 50, opacity = 0.1, color = 'indigo' }) => {
  const colorClasses = {
    indigo: 'rgba(99, 102, 241, {opacity})',
    cyan: 'rgba(6, 182, 212, {opacity})',
    purple: 'rgba(168, 85, 247, {opacity})',
    pink: 'rgba(236, 72, 153, {opacity})',
  };

  const colorValue = colorClasses[color].replace('{opacity}', opacity.toString());

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `
          linear-gradient(${colorValue} 1px, transparent 1px),
          linear-gradient(90deg, ${colorValue} 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
      }}
      animate={{
        backgroundPosition: ['0 0', `${size}px ${size}px`],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

/**
 * Radial Glow - Resplandor radial que pulsa
 */
export const RadialGlow = ({ position = 'center', color = 'cyan', size = 'lg' }) => {
  const positions = {
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  };

  const sizes = {
    sm: 'w-64 h-64',
    md: 'w-96 h-96',
    lg: 'w-[600px] h-[600px]',
    xl: 'w-[800px] h-[800px]',
  };

  const colors = {
    cyan: 'bg-cyan-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
  };

  return (
    <motion.div
      className={`fixed ${positions[position]} ${sizes[size]} ${colors[color]} rounded-full blur-3xl pointer-events-none z-0`}
      animate={{
        opacity: [0.05, 0.15, 0.05],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

/**
 * Spotlight Effect - Foco de luz que sigue el cursor
 */
export const SpotlightEffect = ({ intensity = 0.3 }) => {
  const handleMouseMove = (e) => {
    const spotlight = document.getElementById('spotlight-effect');
    if (spotlight) {
      spotlight.style.background = `radial-gradient(600px at ${e.clientX}px ${e.clientY}px, rgba(99, 102, 241, ${intensity}), transparent 80%)`;
    }
  };

  return (
    <div
      id="spotlight-effect"
      className="fixed inset-0 pointer-events-none z-0"
      onMouseMove={handleMouseMove}
    />
  );
};

/**
 * Mesh Gradient Background
 */
export const MeshGradient = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(at 0% 0%, rgba(6, 182, 212, 0.3) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(168, 85, 247, 0.3) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.3) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(6, 182, 212, 0.3) 0px, transparent 50%)
          `,
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

/**
 * Composite Background - Combina múltiples efectos
 */
export const UltraPremiumBackground = ({
  showParticles = true,
  showOrbs = true,
  showGrid = false,
  showGlow = true,
  showMesh = false,
}) => {
  return (
    <>
      {showMesh && <MeshGradient />}
      {showOrbs && <GradientOrbs count={3} />}
      {showParticles && <FloatingParticles count={40} />}
      {showGrid && <AnimatedGrid size={50} opacity={0.05} color="indigo" />}
      {showGlow && (
        <>
          <RadialGlow position="top-left" color="cyan" size="lg" />
          <RadialGlow position="bottom-right" color="purple" size="lg" />
        </>
      )}
    </>
  );
};

export default {
  FloatingParticles,
  GradientOrbs,
  AnimatedGrid,
  RadialGlow,
  SpotlightEffect,
  MeshGradient,
  UltraPremiumBackground,
};
