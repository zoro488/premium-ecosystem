import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * 🎯 CHRONOS PANEL CONTAINER - Contenedor unificado para todos los paneles
 * Con animaciones de entrada/salida y efectos premium
 */
const ChronosPanelContainer = ({
  children,
  className = '',
  showParticles = true,
  animationDelay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay: animationDelay }}
      className={`relative min-h-screen bg-black ${className}`}
    >
      {/* Grid de fondo animado */}
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Partículas flotantes opcionales */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 0.5, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                delay: Math.random() * 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Contenido */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

ChronosPanelContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  showParticles: PropTypes.bool,
  animationDelay: PropTypes.number,
};

export default ChronosPanelContainer;
