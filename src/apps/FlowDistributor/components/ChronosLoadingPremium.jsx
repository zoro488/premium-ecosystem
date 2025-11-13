/**
 * ⚡ CHRONOS LOADING SCREEN - PREMIUM BLACK & WHITE
 *
 * Pantalla de carga minimalista para transiciones:
 * - Diseño monocromático elegante
 * - Animaciones fluidas y profesionales
 * - GIFs técnicos integrados
 * - Efectos de escaneo y procesamiento
 *
 * @version 2.0.0 - PREMIUM EDITION
 */

import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { Activity, Cpu, Database, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

const ChronosLoadingPremium = ({ isVisible = true, loadingText = 'LOADING SYSTEM', onComplete }) => {
  const [dots, setDots] = useState('');
  const [currentPhase, setCurrentPhase] = useState(0);

  const phases = [
    { icon: Database, text: 'Loading Data Structures', color: 'white' },
    { icon: Cpu, text: 'Processing Neural Network', color: 'white' },
    { icon: Activity, text: 'Synchronizing Components', color: 'white' },
    { icon: Zap, text: 'Initializing Interface', color: 'white' },
  ];

  useEffect(() => {
    if (!isVisible) return;

    // Animación de puntos
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    // Cambio de fase
    const phaseInterval = setInterval(() => {
      setCurrentPhase((prev) => {
        const next = prev + 1;
        if (next >= phases.length) {
          clearInterval(phaseInterval);
          if (onComplete) {
            setTimeout(onComplete, 800);
          }
          return prev;
        }
        return next;
      });
    }, 1500);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(phaseInterval);
    };
  }, [isVisible, onComplete, phases.length]);

  if (!isVisible) return null;

  const CurrentIcon = phases[currentPhase]?.icon || Zap;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9998] bg-black flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Grid de fondo */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="h-full w-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          {/* GIF de fondo - gif(1) */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.08, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <img
              src="/gif(1)"
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: 'grayscale(100%) contrast(1.3)' }}
            />
          </motion.div>

          {/* Contenedor central */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Icono animado */}
            <motion.div
              className="mb-8 relative"
              key={currentPhase}
              initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
            >
              {/* Círculo exterior giratorio */}
              <motion.div
                className="absolute -inset-8 border border-white/20 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />

              {/* Círculo interior */}
              <motion.div
                className="w-24 h-24 rounded-full border-2 border-white/30 bg-black flex items-center justify-center"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(255, 255, 255, 0.1)',
                    '0 0 40px rgba(255, 255, 255, 0.3)',
                    '0 0 20px rgba(255, 255, 255, 0.1)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CurrentIcon className="w-10 h-10 text-white" strokeWidth={1.5} />
              </motion.div>

              {/* Anillo de escaneo */}
              <motion.div
                className="absolute inset-0 border-t-2 border-white/50 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>

            {/* Texto de fase actual */}
            <motion.div
              className="text-center mb-6"
              key={`text-${currentPhase}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-white text-xl tracking-widest font-light mb-2">
                {phases[currentPhase]?.text || loadingText}
              </h2>
              <p className="text-white/40 text-sm tracking-wider font-light">
                {loadingText}
                <span className="inline-block w-8 text-left">{dots}</span>
              </p>
            </motion.div>

            {/* Indicadores de progreso */}
            <div className="flex gap-2 mb-8">
              {phases.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-1 rounded-full ${
                    index <= currentPhase ? 'bg-white' : 'bg-white/20'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: index <= currentPhase ? 40 : 20 }}
                  transition={{ duration: 0.5 }}
                />
              ))}
            </div>

            {/* Scanner line */}
            <motion.div
              className="w-64 h-px bg-gradient-to-r from-transparent via-white to-transparent"
              animate={{
                x: [-100, 100, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>

          {/* Corner decorations */}
          {[
            'top-4 left-4',
            'top-4 right-4',
            'bottom-4 left-4',
            'bottom-4 right-4',
          ].map((position, i) => (
            <motion.div
              key={i}
              className={`absolute ${position} w-8 h-8 border-l-2 border-t-2 border-white/20`}
              style={{
                transform: `rotate(${i * 90}deg)`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            />
          ))}

          {/* Status text bottom */}
          <motion.div
            className="absolute bottom-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-white/30 text-xs tracking-wider uppercase font-light">
              Chronos Engine v2.0
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ChronosLoadingPremium.propTypes = {
  isVisible: PropTypes.bool,
  loadingText: PropTypes.string,
  onComplete: PropTypes.func
};

export default ChronosLoadingPremium;
