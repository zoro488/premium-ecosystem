/**
 * ⚡ CHRONOS SPLASH ULTRA PREMIUM - MEJOR QUE LOS PANELES
 *
 * Diseño de entrada épico con:
 * - Animaciones 3D de partículas inteligentes
 * - Efect glass

morphism avanzado
 * - Logo holográfico con rayos de energía
 * - Transiciones cinematográficas suaves
 * - Tipografía ultra premium
 * - Paleta blanco/negro con acentos brillantes
 *
 * @version 3.0.0 - ULTRA PREMIUM EDITION
 */

import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import PropTypes from 'prop-types';
import { Zap, ChevronRight, Sparkles } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';

const ChronosSplashUltraPremium = ({ onComplete, duration = 6000 }) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  // Textos de carga épicos
  const loadingTexts = useMemo(
    () => [
      'QUANTUM PROCESSORS ONLINE',
      'NEURAL NETWORKS SYNCHRONIZED',
      'TIME MATRIX CALIBRATED',
      'HOLOGRAPHIC INTERFACE ACTIVE',
      'CHRONOS SYSTEM INITIALIZED',
    ],
    []
  );

  // Partículas orbitales inteligentes
  const particles = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        angle: (360 / 80) * i,
        radius: 180 + (i % 4) * 40,
        speed: 3 + (i % 5),
        size: 1 + (i % 3) * 0.5,
        delay: i * 0.015,
        opacity: 0.3 + (i % 3) * 0.2,
      })),
    []
  );

  useEffect(() => {
    // Tracking del mouse
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - globalThis.innerWidth / 2);
      mouseY.set(e.clientY - globalThis.innerHeight / 2);
    };
    globalThis.addEventListener('mousemove', handleMouseMove);

    // Progreso continuo
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 100 / (duration / 60);
      });
    }, 60);

    // Cambio de textos
    const textInterval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % loadingTexts.length);
    }, 1200);

    return () => {
      globalThis.removeEventListener('mousemove', handleMouseMove);
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [duration, onComplete, loadingTexts.length, mouseX, mouseY]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black z-[10000] overflow-hidden flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{
          opacity: 0,
          scale: 2,
          filter: 'blur(30px)',
        }}
        transition={{
          exit: { duration: 1, ease: [0.76, 0, 0.24, 1] },
        }}
        style={{ perspective: 2000 }}
      >
        {/* Grid técnico ultra avanzado */}
        <div className="absolute inset-0 opacity-[0.07]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
                linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
            }}
          />
        </div>

        {/* Partículas orbitales inteligentes */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              opacity: particle.opacity,
            }}
            animate={{
              x: [
                Math.cos((particle.angle * Math.PI) / 180) * particle.radius,
                Math.cos(((particle.angle + 180) * Math.PI) / 180) * particle.radius,
                Math.cos((particle.angle * Math.PI) / 180) * particle.radius,
              ],
              y: [
                Math.sin((particle.angle * Math.PI) / 180) * particle.radius,
                Math.sin(((particle.angle + 180) * Math.PI) / 180) * particle.radius,
                Math.sin((particle.angle * Math.PI) / 180) * particle.radius,
              ],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.speed,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'linear',
            }}
          />
        ))}

        {/* Rayos de energía */}
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <motion.div
            key={`ray-${angle}`}
            className="absolute w-px bg-gradient-to-t from-transparent via-white to-transparent"
            style={{
              height: '60%',
              left: '50%',
              top: '50%',
              transformOrigin: 'bottom center',
              transform: `rotate(${angle}deg)`,
            }}
            animate={{
              opacity: [0.1, 0.4, 0.1],
              scaleY: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: angle / 100,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Contenedor central con efecto 3D */}
        <motion.div
          className="relative z-10"
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Logo holográfico central */}
          <motion.div
            className="relative mb-16"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 1.5,
              type: 'spring',
              stiffness: 80,
              damping: 20,
            }}
          >
            {/* Anillo exterior brillante */}
            <motion.div
              className="absolute -inset-20 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Círculo principal con glassmorphism */}
            <motion.div
              className="relative w-80 h-80 rounded-full flex items-center justify-center"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: `
                  0 25px 50px -12px rgba(255, 255, 255, 0.2),
                  inset 0 2px 4px rgba(255, 255, 255, 0.1)
                `,
              }}
              animate={{
                boxShadow: [
                  '0 25px 50px -12px rgba(255, 255, 255, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.1)',
                  '0 35px 70px -12px rgba(255, 255, 255, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
                  '0 25px 50px -12px rgba(255, 255, 255, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.1)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Icono central animado */}
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                }}
              >
                <Zap className="w-32 h-32 text-white drop-shadow-2xl" strokeWidth={1.5} />
              </motion.div>

              {/* Anillos orbitales */}
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={`orbit-${i}`}
                  className="absolute inset-0 border border-white/20 rounded-full"
                  style={{
                    scale: 1 + i * 0.15,
                  }}
                  animate={{
                    rotate: i % 2 === 0 ? 360 : -360,
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    rotate: {
                      duration: 15 + i * 5,
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
          </motion.div>

          {/* Marca CHRONOS con tipografía épica */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <motion.h1
              className="text-8xl font-thin tracking-[0.4em] mb-6"
              style={{
                fontFamily: '"Inter", "Helvetica Neue", sans-serif',
                fontWeight: 100,
                background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #ffffff 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 40px rgba(255, 255, 255, 0.3)',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              CHRONOS
            </motion.h1>

            <motion.div
              className="flex items-center justify-center gap-4 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <motion.div
                className="h-px w-20 bg-gradient-to-r from-transparent via-white to-transparent"
                animate={{ scaleX: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Sparkles className="w-5 h-5 text-white/60" />
              <span className="text-sm tracking-[0.3em] text-white/60 font-light uppercase">
                Enterprise System
              </span>
              <Sparkles className="w-5 h-5 text-white/60" />
              <motion.div
                className="h-px w-20 bg-gradient-to-r from-transparent via-white to-transparent"
                animate={{ scaleX: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
            </motion.div>
          </motion.div>

          {/* Texto de carga con animación de tipo escritura */}
          <motion.div
            className="text-center mb-10 h-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={currentText}
                className="text-white/50 text-sm tracking-[0.2em] font-light uppercase"
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.5 }}
              >
                {loadingTexts[currentText]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Barra de progreso ultra premium */}
          <motion.div
            className="w-[500px] mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2 }}
          >
            {/* Container con glassmorphism */}
            <div
              className="relative h-2 rounded-full overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Progreso con gradiente animado */}
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${progress}%`,
                  background:
                    'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.3) 100%)',
                  backgroundSize: '200% 100%',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '200% 50%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                {/* Brillo superior */}
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 50%)',
                  }}
                />
              </motion.div>
            </div>

            {/* Estadísticas de progreso */}
            <div className="flex items-center justify-between mt-4 px-1">
              <span className="text-white/40 text-xs tracking-wider font-light">INITIALIZING</span>
              <motion.span
                className="text-white/70 text-sm font-mono tabular-nums"
                key={Math.floor(progress / 10)}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {Math.floor(progress)}%
              </motion.span>
            </div>
          </motion.div>

          {/* Indicador de fase */}
          <motion.div
            className="flex items-center justify-center gap-2 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={`phase-${i}`}
                className="w-2 h-2 rounded-full bg-white/20"
                animate={{
                  scale: i === Math.floor((progress / 100) * 5) ? [1, 1.5, 1] : 1,
                  opacity: i <= Math.floor((progress / 100) * 5) ? 0.8 : 0.2,
                  backgroundColor:
                    i <= Math.floor((progress / 100) * 5)
                      ? 'rgba(255, 255, 255, 0.8)'
                      : 'rgba(255, 255, 255, 0.2)',
                }}
                transition={{
                  duration: 0.5,
                  scale: { duration: 1, repeat: Infinity },
                }}
              />
            ))}
          </motion.div>

          {/* Botón Skip premium (aparece después del 25%) */}
          {progress > 25 && (
            <motion.button
              className="absolute bottom-12 right-12 group"
              onClick={onComplete}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className="flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <span className="text-white/50 text-sm tracking-wider uppercase font-light group-hover:text-white/80 transition-colors">
                  Skip
                </span>
                <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.button>
          )}

          {/* Version info */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
          >
            <p className="text-white/20 text-xs tracking-wider font-light">
              CHRONOS v3.0.0 ULTRA PREMIUM
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

ChronosSplashUltraPremium.propTypes = {
  onComplete: PropTypes.func.isRequired,
  duration: PropTypes.number,
};

export default ChronosSplashUltraPremium;
