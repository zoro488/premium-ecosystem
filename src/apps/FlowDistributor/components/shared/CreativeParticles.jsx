/**
 * 🎨 CREATIVE PARTICLES
 * Sistema de partículas elegante para fondos
 */
import { memo, useRef } from 'react';

import { motion } from 'framer-motion';

/**
 * 🌟 Componente de partículas creativas
 */
export const CreativeParticles = memo(
  ({
    count = 50,
    colors = ['#3b82f6', '#8b5cf6', '#06b6d4'],
    size = { min: 1, max: 4 },
    speed = { min: 20, max: 40 },
    className = '',
  }) => {
    const containerRef = useRef(null);

    // Generar partículas aleatorias
    const particles = Array.from({ length: count }, (_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (size.max - size.min) + size.min,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * (speed.max - speed.min) + speed.min,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.6 + 0.2,
    }));

    return (
      <div
        ref={containerRef}
        className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      >
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
            }}
            initial={{
              opacity: 0,
              scale: 0,
              y: 0,
            }}
            animate={{
              opacity: [0, particle.opacity, 0],
              scale: [0, 1, 0],
              y: [-20, -100, -180],
              x: [0, Math.random() * 40 - 20, Math.random() * 80 - 40],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Partículas de estrellas más elegantes */}
        {Array.from({ length: Math.floor(count / 3) }).map((_, index) => (
          <motion.div
            key={`star-${index}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          >
            {/* Estrella de 4 puntas */}
            <div className="relative w-2 h-2">
              <div
                className="absolute inset-0 bg-white rotate-45 opacity-60"
                style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
              />
              <div
                className="absolute inset-0 bg-white opacity-40"
                style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
              />
            </div>
          </motion.div>
        ))}

        {/* Ondas de energía */}
        {Array.from({ length: 3 }).map((_, index) => (
          <motion.div
            key={`wave-${index}`}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${50 + index * 20}% ${30 + index * 25}%, ${colors[index % colors.length]}15 0%, transparent 50%)`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 8 + index * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 2,
            }}
          />
        ))}
      </div>
    );
  }
);

CreativeParticles.displayName = 'CreativeParticles';

export default CreativeParticles;
