import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import gsap from 'gsap';

/**
 * 🌌 CHRONOS ANIMATED LOGO
 * Logo orbital premium con animación continua
 * Identidad: Dios del tiempo / Cosmos / Órbitas
 */
const ChronosLogo = ({ size = 'md', animated = true, className = '' }) => {
  const orbitRefs = useRef([]);
  const glowRef = useRef(null);

  const sizes = {
    sm: { container: 40, center: 3, orbits: [16, 28, 36] },
    md: { container: 60, center: 4, orbits: [24, 42, 54] },
    lg: { container: 80, center: 5, orbits: [32, 56, 72] },
    xl: { container: 120, center: 6, orbits: [48, 84, 108] }
  };

  const config = sizes[size] || sizes.md;

  useEffect(() => {
    if (!animated) return;

    // Animación de órbitas - rotación continua
    const animations = orbitRefs.current.map((orbit, index) => {
      if (!orbit) return null;

      return gsap.to(orbit, {
        rotation: 360,
        duration: 12 + index * 6, // Cada órbita más lenta
        repeat: -1,
        ease: 'none'
      });
    });

    // Animación del glow central
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        scale: [1, 1.3, 1],
        opacity: [0.4, 0.7, 0.4],
        duration: 3,
        repeat: -1,
        ease: 'sine.inOut'
      });
    }

    return () => {
      for (const anim of animations) {
        anim?.kill();
      }
    };
  }, [animated]);

  return (
    <div
      className={`relative ${className}`}
      style={{ width: config.container, height: config.container }}
    >
      {/* Glow de fondo */}
      <div
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
        style={{
          width: config.container * 0.6,
          height: config.container * 0.6,
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)'
        }}
      />

      {/* Centro - Núcleo del tiempo */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full"
        style={{
          width: config.center,
          height: config.center,
          boxShadow: '0 0 10px rgba(255,255,255,0.8)'
        }}
        animate={animated ? {
          scale: [1, 1.2, 1],
          opacity: [0.9, 1, 0.9]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Órbitas temporales */}
      {config.orbits.map((orbitSize, index) => (
        <div
          key={`orbit-${index}-${orbitSize}`}
          ref={el => orbitRefs.current[index] = el}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: orbitSize,
            height: orbitSize,
            transform: `translate(-50%, -50%) rotate(${index * 30}deg)`
          }}
        >
          {/* Línea orbital */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: '1px dotted rgba(255,255,255,0.15)',
              borderStyle: index === 1 ? 'solid' : 'dotted'
            }}
          />

          {/* Puntos temporales (planetas) */}
          {Array.from({ length: index + 1 }).map((_, i) => {
            const angle = (360 / (index + 1)) * i;
            return (
              <motion.div
                key={`planet-orbit${index}-point${i}-${angle}`}
                className="absolute top-0 left-1/2 -translate-x-1/2 bg-white rounded-full"
                style={{
                  width: config.center * 0.6,
                  height: config.center * 0.6,
                  transform: `translateX(-50%) rotate(${angle}deg) translateY(${orbitSize / 2}px)`,
                  transformOrigin: 'center',
                  boxShadow: '0 0 6px rgba(255,255,255,0.6)'
                }}
                animate={animated ? {
                  opacity: [0.4, 1, 0.4],
                  scale: [0.8, 1.2, 0.8]
                } : {}}
                transition={{
                  duration: 2 + i * 0.3,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

ChronosLogo.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  animated: PropTypes.bool,
  className: PropTypes.string
};

export default ChronosLogo;
