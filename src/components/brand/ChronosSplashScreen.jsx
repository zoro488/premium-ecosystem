/**
 * 🌌 CHRONOS SPLASH SCREEN - Estilo Interstellar
 * Inspirado en: https://pin.it/6Z4CmNS3P
 * Animaciones cósmicas épicas con logo CHRONOS
 */
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';

import { ChronosLogoFull } from './ChronosLogos';

export function ChronosSplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Inicializando Sistema...');
  const [phase, setPhase] = useState('loading'); // loading, ready, exit

  useEffect(() => {
    // Simular carga con pasos realistas
    const loadingSteps = [
      { progress: 15, text: 'Conectando con Firebase...', duration: 600 },
      { progress: 30, text: 'Cargando Datos Cósmicos...', duration: 700 },
      { progress: 50, text: 'Sincronizando Módulos...', duration: 650 },
      { progress: 70, text: 'Preparando Interfaz Premium...', duration: 600 },
      { progress: 90, text: 'Activando Sistema CHRONOS...', duration: 550 },
      { progress: 100, text: 'Sistema Listo!', duration: 400 },
    ];

    let currentStep = 0;

    const runStep = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        setProgress(step.progress);
        setLoadingText(step.text);
        currentStep++;

        setTimeout(runStep, step.duration);
      } else {
        // Completado
        setPhase('ready');
        setTimeout(() => {
          setPhase('exit');
          setTimeout(() => onComplete(), 800);
        }, 800);
      }
    };

    runStep();
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.2,
            filter: 'blur(10px)',
          }}
          transition={{
            exit: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] },
          }}
          className="fixed inset-0 z-[99999] bg-black overflow-hidden"
        >
          {/* ========================================
              FONDO DE ESTRELLAS ANIMADAS
          ======================================== */}
          <div className="absolute inset-0">
            {[...Array(150)].map((_, i) => {
              const uniqueId = `star-${Math.random().toString(36).substr(2, 9)}-${i}`;
              return (
                <motion.div
                  key={uniqueId}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0.1, 1, 0.1],
                    scale: [1, 1.8, 1],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 4,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                  }}
                />
              );
            })}
          </div>

          {/* ========================================
              GRADIENTE RADIAL CENTRAL CÓSMICO
          ======================================== */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at center, rgba(102,126,234,0.15) 0%, rgba(118,75,162,0.08) 30%, transparent 70%)',
            }}
          />

          {/* ========================================
              ANILLOS CÓSMICOS ROTATORIOS
          ======================================== */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          >
            <div
              className="absolute w-[1000px] h-[1000px] rounded-full border opacity-5"
              style={{ borderColor: 'rgba(102,126,234,0.3)' }}
            />
            <div
              className="absolute w-[750px] h-[750px] rounded-full border opacity-5"
              style={{ borderColor: 'rgba(118,75,162,0.3)' }}
            />
            <div
              className="absolute w-[500px] h-[500px] rounded-full border opacity-5"
              style={{ borderColor: 'rgba(240,147,251,0.3)' }}
            />
          </motion.div>

          {/* ========================================
              PARTÍCULAS ORBITALES GRANDES
          ======================================== */}
          {[0, 72, 144, 216, 288].map((angle, i) => {
            const uniqueId = `orbital-${angle}-${Math.random().toString(36).substr(2, 9)}`;
            return (
              <motion.div
                key={uniqueId}
                className="absolute w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-zinc-800"
                style={{
                  left: '50%',
                  top: '50%',
                  filter: 'blur(1px)',
                  boxShadow: '0 0 20px rgba(102,126,234,0.6)',
                }}
                animate={{
                  x: [
                    Math.cos((angle * Math.PI) / 180) * 350,
                    Math.cos(((angle + 360) * Math.PI) / 180) * 350,
                  ],
                  y: [
                    Math.sin((angle * Math.PI) / 180) * 350,
                    Math.sin(((angle + 360) * Math.PI) / 180) * 350,
                  ],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 0.5,
                }}
              />
            );
          })}

          {/* ========================================
              CONTENIDO CENTRAL
          ======================================== */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
            {/* LOGO PRINCIPAL CHRONOS */}
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{
                scale: 1,
                rotate: 0,
                opacity: 1,
              }}
              transition={{
                duration: 1.8,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
              className="relative"
            >
              <ChronosLogoFull size={280} animated={true} glowIntensity="high" />

              {/* Resplandor Pulsante Detrás del Logo */}
              <motion.div
                className="absolute inset-0 -z-10"
                style={{
                  background:
                    'radial-gradient(circle, rgba(102,126,234,0.4) 0%, rgba(118,75,162,0.2) 50%, transparent 70%)',
                  filter: 'blur(60px)',
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>

            {/* TEXTO "CHRONOS" CON EFECTO TYPEWRITER */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-8 md:mt-12 text-center"
            >
              <motion.h1
                className="text-6xl md:text-8xl lg:text-9xl font-black tracking-[0.2em]"
                style={{
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 40%, #f093fb 70%, #f5576c 100%)',
                  backgroundSize: '300% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 80px rgba(102,126,234,0.5)',
                }}
                animate={{
                  backgroundPosition: ['0% center', '300% center', '0% center'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                CHRONOS
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="text-gray-400 text-lg md:text-xl lg:text-2xl mt-4 tracking-[0.4em] font-light uppercase"
              >
                Premium Ecosystem
              </motion.p>
            </motion.div>

            {/* ========================================
                BARRA DE PROGRESO PREMIUM
            ======================================== */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="mt-12 md:mt-16 w-full max-w-md px-4"
            >
              {/* Texto de Estado de Carga */}
              <motion.div
                key={loadingText}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4 text-center"
              >
                <p className="text-blue-400 text-sm md:text-base font-mono tracking-wider">
                  {loadingText}
                </p>
              </motion.div>

              {/* Barra de Progreso */}
              <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
                {/* Progreso */}
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                    boxShadow: '0 0 30px rgba(102,126,234,0.8), 0 0 60px rgba(118,75,162,0.4)',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />

                {/* Efecto Shimmer en la barra */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{ width: '100px' }}
                  animate={{ x: ['-100px', '500px'] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </div>

              {/* Porcentaje */}
              <motion.div
                className="mt-3 flex items-center justify-between text-xs md:text-sm font-mono"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-gray-600">{progress}%</span>
                <span className="text-gray-600">Cargando...</span>
              </motion.div>
            </motion.div>
          </div>

          {/* ========================================
              PARTÍCULAS FLOTANTES DECORATIVAS
          ======================================== */}
          {[...Array(30)].map((_, i) => {
            const uniqueId = `float-${Math.random().toString(36).substr(2, 9)}-${i}`;
            const randomY = Math.random() * 100 - 50;
            return (
              <motion.div
                key={uniqueId}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: `linear-gradient(135deg, ${
                    i % 3 === 0 ? '#667eea' : i % 3 === 1 ? '#764ba2' : '#f093fb'
                  } 0%, transparent 100%)`,
                  filter: 'blur(1px)',
                  opacity: 0.3,
                }}
                animate={{
                  y: [0, -150, 0],
                  x: [0, randomY, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 6 + Math.random() * 6,
                  repeat: Infinity,
                  delay: Math.random() * 4,
                  ease: 'easeInOut',
                }}
              />
            );
          })}

          {/* ========================================
              EFECTO DE LUZ CENTRAL (GLOW GIGANTE)
          ======================================== */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(102,126,234,0.25) 0%, rgba(118,75,162,0.15) 40%, transparent 70%)',
              filter: 'blur(100px)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* ========================================
              VIGNETTE (OSCURECIMIENTO EN BORDES)
          ======================================== */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at center, transparent 0%, transparent 50%, rgba(0,0,0,0.6) 100%)',
            }}
          />

          {/* ========================================
              TEXTO INFERIOR - POWERED BY
          ======================================== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="absolute bottom-8 md:bottom-12 left-0 right-0 text-center px-4"
          >
            <p className="text-gray-700 text-xs md:text-sm font-light">
              Powered by <span className="text-blue-500/70">Firebase</span>
              {' • '}
              <span className="text-zinc-200/70">React 18</span>
              {' • '}
              <span className="text-zinc-200/70">Framer Motion</span>
            </p>
          </motion.div>

          {/* ========================================
              EFECTO READY - CUANDO LLEGA A 100%
          ======================================== */}
          {phase === 'ready' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
              className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md"
            >
              <motion.div
                className="text-center"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              >
                <motion.div
                  className="text-8xl md:text-9xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"
                  animate={{
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  ✓
                </motion.div>
                <p className="mt-6 text-2xl md:text-3xl text-white font-light tracking-wider">
                  SISTEMA LISTO
                </p>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

ChronosSplashScreen.propTypes = {
  onComplete: PropTypes.func.isRequired,
};

export default ChronosSplashScreen;
