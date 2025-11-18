/**
 * 🎬 CINEMATIC LOADING SCREEN
 * Pantalla de carga cinematográfica para transiciones de paneles
 */
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

const CinematicLoadingScreen = ({
  isVisible = false,
  loadingText = 'INITIALIZING SYSTEM',
  progress = 0,
  onComplete,
  variant = 'tactical',
}) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [scanlinePosition, setScanlinePosition] = useState(0);

  // Fases de carga con textos - CHRONOS
  const loadingPhases = {
    tactical: [
      { text: 'INITIALIZING CHRONOS SYSTEMS...', duration: 800 },
      { text: 'LOADING TACTICAL MODULES...', duration: 600 },
      { text: 'ESTABLISHING SECURE CONNECTION...', duration: 700 },
      { text: 'SYNCHRONIZING TIME MATRIX...', duration: 500 },
      { text: 'CHRONOS INTERFACE READY', duration: 400 },
    ],
    matrix: [
      { text: 'ACCESSING MAINFRAME...', duration: 700 },
      { text: 'DECRYPTING DATA STREAMS...', duration: 600 },
      { text: 'LOADING NEURAL PATHWAYS...', duration: 800 },
      { text: 'ESTABLISHING MATRIX LINK...', duration: 500 },
      { text: 'WELCOME TO THE MATRIX', duration: 400 },
    ],
    holographic: [
      { text: 'CALIBRATING HOLOGRAPHIC PROJECTORS...', duration: 900 },
      { text: 'LOADING DIMENSIONAL MATRICES...', duration: 700 },
      { text: 'SYNCHRONIZING PARTICLE FIELDS...', duration: 600 },
      { text: 'HOLOGRAPHIC INTERFACE ACTIVE', duration: 400 },
    ],
    ai: [
      { text: 'BOOTING AI CORE SYSTEMS...', duration: 800 },
      { text: 'LOADING NEURAL NETWORKS...', duration: 700 },
      { text: 'INITIALIZING DECISION MATRICES...', duration: 600 },
      { text: 'AI ASSISTANT ONLINE', duration: 400 },
    ],
  };

  const phases = loadingPhases[variant] || loadingPhases.tactical;

  // Efecto de scanline animado
  useEffect(() => {
    if (!isVisible) return;

    const scanlineTimer = setInterval(() => {
      setScanlinePosition((prev) => (prev + 2) % 100);
    }, 50);

    return () => clearInterval(scanlineTimer);
  }, [isVisible]);

  // Progresión automática de fases
  useEffect(() => {
    if (!isVisible) return;

    let phaseTimer;

    if (currentPhase < phases.length - 1) {
      phaseTimer = setTimeout(() => {
        setCurrentPhase((prev) => prev + 1);
      }, phases[currentPhase].duration);
    } else if (currentPhase === phases.length - 1) {
      // Última fase - trigger completion
      phaseTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, phases[currentPhase].duration);
    }

    return () => {
      if (phaseTimer) clearTimeout(phaseTimer);
    };
  }, [currentPhase, isVisible, phases, onComplete]);

  // Reset when becoming visible
  useEffect(() => {
    if (isVisible) {
      setCurrentPhase(0);
      setScanlinePosition(0);
    }
  }, [isVisible]);

  // Calcular progreso basado en fase actual
  const calculateProgress = () => {
    const phaseProgress = (currentPhase / (phases.length - 1)) * 100;
    return Math.min(100, phaseProgress);
  };

  // Variantes de animación según el tipo
  const getVariantStyles = () => {
    switch (variant) {
      case 'matrix':
        return {
          background: 'linear-gradient(135deg, rgba(0, 50, 0, 0.95) 0%, rgba(0, 100, 0, 0.8) 100%)',
          accentColor: 'rgb(0, 255, 0)',
          textColor: 'text-green-400',
          glowColor: 'rgba(0, 255, 0, 0.5)',
        };
      case 'holographic':
        return {
          background:
            'linear-gradient(135deg, rgba(0, 50, 100, 0.95) 0%, rgba(100, 0, 200, 0.8) 100%)',
          accentColor: 'rgb(0, 200, 255)',
          textColor: 'text-cyan-400',
          glowColor: 'rgba(0, 200, 255, 0.5)',
        };
      case 'ai':
        return {
          background:
            'linear-gradient(135deg, rgba(100, 0, 100, 0.95) 0%, rgba(200, 0, 100, 0.8) 100%)',
          accentColor: 'rgb(255, 0, 200)',
          textColor: 'text-pink-400',
          glowColor: 'rgba(255, 0, 200, 0.5)',
        };
      default: // tactical
        return {
          background:
            'linear-gradient(135deg, rgba(50, 25, 0, 0.95) 0%, rgba(100, 50, 0, 0.8) 100%)',
          accentColor: 'rgb(255, 102, 0)',
          textColor: 'text-orange-400',
          glowColor: 'rgba(255, 102, 0, 0.5)',
        };
    }
  };

  const styles = getVariantStyles();
  const currentProgress = calculateProgress();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: styles.background }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Video Background - Chronos Loading */}
          <div className="absolute inset-0 overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-40"
            >
              <source src="/videos/chronos-loading-931340535.mov" type="video/quicktime" />
              <source src="/videos/chronos-loading-931340535.mp4" type="video/mp4" />
              <source src="/videos/chronos-loading.webm" type="video/webm" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
          </div>

          {/* Background effects */}
          <div className="absolute inset-0">
            {/* Animated grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(${styles.accentColor}20 1px, transparent 1px),
                  linear-gradient(90deg, ${styles.accentColor}20 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
                animation: 'grid-move 10s linear infinite',
              }}
            />

            {/* Scanning line */}
            <motion.div
              className="absolute w-full h-1 opacity-60"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${styles.accentColor} 50%, transparent 100%)`,
                top: `${scanlinePosition}%`,
                boxShadow: `0 0 20px ${styles.glowColor}`,
              }}
              animate={{
                top: ['0%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Particle effects */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{ backgroundColor: styles.accentColor }}
                animate={{
                  x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                  y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Main loading content */}
          <div className="relative z-10 text-center max-w-2xl mx-auto px-8">
            {/* Logo/Icon */}
            <motion.div
              className="mb-8"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity },
              }}
            >
              <div
                className="w-20 h-20 mx-auto rounded-full border-4 flex items-center justify-center text-3xl font-bold"
                style={{
                  borderColor: styles.accentColor,
                  boxShadow: `0 0 30px ${styles.glowColor}`,
                  backgroundColor: `${styles.accentColor}20`,
                }}
              >
                {variant === 'matrix'
                  ? '◉'
                  : variant === 'holographic'
                    ? '◈'
                    : variant === 'ai'
                      ? '◎'
                      : '⚡'}
              </div>
            </motion.div>

            {/* Loading text */}
            <motion.h1
              className={`text-2xl font-bold mb-4 ${styles.textColor}`}
              key={currentPhase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ textShadow: `0 0 10px ${styles.glowColor}` }}
            >
              {phases[currentPhase]?.text || loadingText}
            </motion.h1>

            {/* Progress bar */}
            <div className="w-full max-w-md mx-auto mb-6">
              <div
                className="h-2 bg-black/50 rounded-full overflow-hidden border"
                style={{ borderColor: `${styles.accentColor}50` }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${styles.accentColor}, ${styles.accentColor}AA)`,
                    boxShadow: `0 0 10px ${styles.glowColor}`,
                  }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${currentProgress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>

              {/* Progress percentage */}
              <motion.p
                className={`text-sm mt-2 ${styles.textColor}`}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {Math.round(currentProgress)}% COMPLETE
              </motion.p>
            </div>

            {/* Additional info */}
            <motion.div
              className={`text-xs opacity-70 ${styles.textColor}`}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <p>
                PHASE {currentPhase + 1} OF {phases.length}
              </p>
              <p className="mt-1">PLEASE WAIT...</p>
            </motion.div>

            {/* Diagnostic lines */}
            <div className="mt-8 space-y-1 text-xs text-left max-w-md mx-auto">
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`font-mono ${styles.textColor} opacity-50`}
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  {variant === 'tactical'
                    ? '> TACTICAL_SYS_'
                    : variant === 'matrix'
                      ? '> MATRIX_NODE_'
                      : variant === 'holographic'
                        ? '> HOLO_PROJ_'
                        : '> AI_CORE_'}
                  {String(i + 1).padStart(2, '0')}: OK
                </motion.div>
              ))}
            </div>
          </div>

          {/* CSS for grid animation */}
          <style>{`
            @keyframes grid-move {
              0% {
                transform: translate(0, 0);
              }
              100% {
                transform: translate(50px, 50px);
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CinematicLoadingScreen;
