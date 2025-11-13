/**
 * 🌌 SPLASH SCREEN - Pantalla de carga premium con efectos espaciales
 *
 * Características:
 * - ✨ Logo animado con path drawing
 * - 🌟 Efectos de partículas espaciales
 * - 💫 Progress bar con glow
 * - 🎨 Gradientes animados
 * - 🔄 Loading states
 * - 🎭 Fade out suave al completar
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { AnimatedLogo } from './AnimatedLogo';

interface SplashScreenProps {
  onComplete?: () => void;
  minDuration?: number;
}

/**
 * Pantalla de inicio con carga animada
 */
export function SplashScreen({
  onComplete,
  minDuration = 3000
}: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [loadingText, setLoadingText] = useState('Iniciando sistema...');

  useEffect(() => {
    const steps = [
      { progress: 20, text: 'Cargando módulos...', duration: 300 },
      { progress: 40, text: 'Inicializando servicios...', duration: 400 },
      { progress: 60, text: 'Conectando con base de datos...', duration: 500 },
      { progress: 80, text: 'Preparando interfaz...', duration: 400 },
      { progress: 95, text: 'Casi listo...', duration: 300 },
      { progress: 100, text: '¡Listo!', duration: 400 },
    ];

    let currentStep = 0;
    const startTime = Date.now();

    const advanceProgress = () => {
      if (currentStep >= steps.length) {
        // Asegurar duración mínima
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minDuration - elapsed);

        setTimeout(() => {
          setIsComplete(true);
          setTimeout(() => {
            onComplete?.();
          }, 800); // Tiempo para fade out
        }, remaining);
        return;
      }

      const step = steps[currentStep];
      setProgress(step.progress);
      setLoadingText(step.text);
      currentStep++;

      setTimeout(advanceProgress, step.duration);
    };

    // Iniciar secuencia
    setTimeout(advanceProgress, 500);
  }, [minDuration, onComplete]);

  return (
    <AnimatePresence mode="wait">
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-chronos-charcoal overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Animated Background */}
          <div className="absolute inset-0">
            {/* Gradient Overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-chronos-charcoal via-chronos-graphite to-chronos-charcoal"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Floating Particles */}
            {[...Array(30)].map((_, idx) => (
              <motion.div
                key={idx}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 4 + 1,
                  height: Math.random() * 4 + 1,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: idx % 3 === 0
                    ? '#00d9ff'
                    : idx % 3 === 1
                    ? '#8b5cf6'
                    : '#6366f1',
                  boxShadow: `0 0 ${Math.random() * 20 + 10}px currentColor`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'easeInOut',
                }}
              />
            ))}

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,217,255,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,217,255,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px',
                }}
              />
            </div>

            {/* Radial Glow */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle at center, rgba(0,217,255,0.15) 0%, transparent 70%)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Logo Animado */}
            <AnimatedLogo
              size={160}
              mode="splash"
            />

            {/* Brand Name */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-neon-cyan via-white to-neon-purple bg-clip-text text-transparent">
                FlowDistributor
              </h1>
              <p className="text-chronos-silver text-sm tracking-wider">
                Premium Business Ecosystem
              </p>
            </motion.div>

            {/* Loading Progress */}
            <motion.div
              className="w-80 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              {/* Progress Bar Container */}
              <div className="relative h-2 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                {/* Progress Fill */}
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-blue rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />

                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full blur-md"
                  initial={{ width: '0%', opacity: 0.6 }}
                  animate={{ width: `${progress}%`, opacity: 0.8 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />

                {/* Moving Shine */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </div>

              {/* Loading Text */}
              <motion.div
                className="flex items-center justify-between text-sm"
                key={loadingText}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-chronos-silver">{loadingText}</span>
                <span className="text-neon-cyan font-semibold">{progress}%</span>
              </motion.div>
            </motion.div>

            {/* Version Info */}
            <motion.div
              className="absolute bottom-8 text-xs text-chronos-silver/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
            >
              Version 1.0.0 - Chronos OS
            </motion.div>
          </div>

          {/* Corner Decorations */}
          <motion.div
            className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-neon-cyan/20 to-transparent blur-3xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-neon-purple/20 to-transparent blur-3xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.5,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SplashScreen;
