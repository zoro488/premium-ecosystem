/**
 * ⚡ CHRONOS SPLASH SCREEN - ULTRA PREMIUM BLACK & WHITE
 *
 * Pantalla de inicio minimalista y elegante con:
 * - Diseño monocromático sofisticado (blanco y negro)
 * - Animaciones de partículas técnicas
 * - GIFs de carga integrados
 * - Efectos de glitch sutil
 * - Tipografía moderna y minimalista
 * - Transiciones suaves y profesionales
 *
 * @version 2.0.0 - PREMIUM EDITION
 */

import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { Clock, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

const ChronosSplashPremium = ({ onComplete, duration = 5000 }) => {
  const [progress, setProgress] = useState(0);
  const [showGlitch, setShowGlitch] = useState(false);

  // Fases de texto
  const loadingTexts = [
    'INITIALIZING CHRONOS CORE',
    'LOADING QUANTUM PROCESSORS',
    'SYNCHRONIZING TIME MATRIX',
    'ESTABLISHING NEURAL LINKS',
    'CHRONOS SYSTEM READY',
  ];

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    // Progreso
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return prev + (100 / (duration / 50));
      });
    }, 50);

    // Cambiar textos
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 1000);

    // Efecto glitch aleatorio
    const glitchInterval = setInterval(() => {
      setShowGlitch(true);
      setTimeout(() => setShowGlitch(false), 100);
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
      clearInterval(glitchInterval);
    };
  }, [duration, onComplete, loadingTexts.length]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 bg-black z-[9999] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{
          opacity: 0,
          scale: 1.5,
          filter: 'blur(20px)',
        }}
        transition={{
          exit: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] },
        }}
      >
        {/* Grid técnico de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Líneas diagonales decorativas */}
        <motion.div
          className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: 'easeInOut' }}
        />

        {/* Partículas técnicas flotantes */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`particle-splash-${i}-${Math.random()}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 1.5, 1],
              y: [-20, 20, -20],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Contenedor central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          {/* Logo y marca central */}
          <motion.div
            className="relative mb-16"
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            {/* GIF Background - Hauptbahnhof (el más técnico) */}
            <motion.div
              className="absolute inset-0 -z-10 flex items-center justify-center"
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              <img
                src="/hauptbahnhof.gif"
                alt=""
                className="w-96 h-96 object-contain mix-blend-screen opacity-50"
                style={{ filter: 'grayscale(100%) contrast(1.2)' }}
              />
            </motion.div>

            {/* Círculo decorativo exterior */}
            <motion.div
              className="w-64 h-64 rounded-full border-2 border-white/20"
              animate={{
                rotate: 360,
                scale: [1, 1.05, 1],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              }}
            />

            {/* Círculo interior con logo */}
            <div className="absolute inset-8 rounded-full bg-black border border-white/30 flex items-center justify-center backdrop-blur-sm">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Clock className="w-20 h-20 text-white" strokeWidth={1.5} />
              </motion.div>
            </div>

            {/* Anillos orbitales */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`ring-${i}`}
                className="absolute inset-0 border border-white/10 rounded-full"
                style={{
                  scale: 1 + i * 0.15,
                }}
                animate={{
                  rotate: i % 2 === 0 ? 360 : -360,
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  rotate: {
                    duration: 10 + i * 5,
                    repeat: Infinity,
                    ease: 'linear',
                  },
                  opacity: {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
              />
            ))}
          </motion.div>

          {/* Nombre de la marca */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.h1
              className={`text-7xl font-thin tracking-[0.3em] text-white mb-4 ${
                showGlitch ? 'glitch-effect' : ''
              }`}
              style={{
                fontFamily: '"Inter", "Helvetica Neue", sans-serif',
                fontWeight: 100,
                letterSpacing: '0.3em',
              }}
            >
              CHRONOS
            </motion.h1>

            <motion.div
              className="flex items-center justify-center gap-3 text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.div
                className="h-px w-12 bg-white/30"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              />
              <span className="text-sm tracking-widest font-light uppercase">
                Enterprise System
              </span>
              <motion.div
                className="h-px w-12 bg-white/30"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              />
            </motion.div>
          </motion.div>

          {/* Texto de carga dinámico */}
          <motion.div
            className="mb-8 h-6 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTextIndex}
                className="text-white/40 text-sm tracking-wider uppercase font-light"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {loadingTexts[currentTextIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Barra de progreso premium */}
          <motion.div
            className="w-96 max-w-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8 }}
          >
            {/* Container */}
            <div className="relative h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
              {/* Progreso */}
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-white via-white/80 to-white rounded-full"
                style={{
                  width: `${progress}%`,
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {/* Brillo animado */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </motion.div>
            </div>

            {/* Porcentaje */}
            <div className="flex items-center justify-between mt-3">
              <span className="text-white/40 text-xs tracking-wider font-light">
                LOADING
              </span>
              <motion.span
                className="text-white/60 text-xs font-mono"
                key={Math.floor(progress)}
              >
                {Math.floor(progress)}%
              </motion.span>
            </div>
          </motion.div>

          {/* Indicador de actividad */}
          <motion.div
            className="flex items-center gap-2 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={`dot-${i}`}
                className="w-1.5 h-1.5 bg-white/40 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>

          {/* Version y copyright */}
          <motion.div
            className="absolute bottom-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            <p className="text-white/30 text-xs tracking-wider font-light mb-1">
              CHRONOS v2.0.0
            </p>
            <p className="text-white/20 text-xs font-light">
              © 2025 Enterprise Solutions
            </p>
          </motion.div>

          {/* Botón Skip (opcional) */}
          {progress > 20 && (
            <motion.button
              className="absolute top-8 right-8 text-white/40 hover:text-white/80 text-sm tracking-wider uppercase transition-colors flex items-center gap-2 group"
              onClick={onComplete}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-light">Skip</span>
              <Zap className="w-3 h-3 group-hover:rotate-12 transition-transform" />
            </motion.button>
          )}
        </div>

        {/* Estilo para el efecto glitch */}
        <style jsx>{`
          .glitch-effect {
            animation: glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
          }

          @keyframes glitch {
            0% {
              transform: translate(0);
            }
            20% {
              transform: translate(-2px, 2px);
            }
            40% {
              transform: translate(-2px, -2px);
            }
            60% {
              transform: translate(2px, 2px);
            }
            80% {
              transform: translate(2px, -2px);
            }
            100% {
              transform: translate(0);
            }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
};

ChronosSplashPremium.propTypes = {
  onComplete: PropTypes.func.isRequired,
  duration: PropTypes.number
};

export default ChronosSplashPremium;
