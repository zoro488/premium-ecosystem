/**
 * 🚀 CHRONOS LAUNCH SCREEN - ULTRA PREMIUM
 *
 * Pantalla de inicio inspirada en las mejores referencias:
 * - Orbes holográficos animados (AI Buddy style)
 * - Transiciones suaves con spring physics
 * - Logo minimalista elegante
 * - Efectos de partículas y glassmorphism
 * - Animaciones de aparición y salida fluidas
 * - Fondo negro elegante con gradientes sutiles
 * - Responsive design para mobile iOS/Android
 *
 * Referencias aplicadas:
 * - Glowing orb animations
 * - Holographic effects
 * - Space-age UI patterns
 * - Minimalist branding
 *
 * @version 1.0.0 - LAUNCH SCREEN
 */
import { memo, useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import PropTypes from 'prop-types';

const ChronosLaunchScreen = memo(({ onComplete }) => {
  const [stage, setStage] = useState('appearing'); // appearing -> displaying -> exiting
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage('displaying'), 1000);
    const timer2 = setTimeout(() => setStage('exiting'), 3500);
    const timer3 = setTimeout(() => onComplete?.(), 4500);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  // Animation variants
  const containerVariants = {
    appearing: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
    displaying: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
    exiting: {
      opacity: 0,
      scale: 1.2,
      transition: { duration: 1, ease: 'easeIn' },
    },
  };

  const orbVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const particleVariants = {
    animate: {
      y: [-20, 20, -20],
      x: [-10, 10, -10],
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const textVariants = {
    appearing: {
      opacity: 0,
      y: 30,
      scale: 0.8,
    },
    displaying: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: 0.5,
        duration: 0.8,
        ease: 'easeOut',
      },
    },
    exiting: {
      opacity: 0,
      y: -30,
      scale: 1.1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
        variants={containerVariants}
        initial="appearing"
        animate={stage}
        exit="exiting"
      >
        {/* Background Effects */}
        <div className="absolute inset-0">
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-black to-slate-900/50" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-950/20 to-transparent" />

          {/* Animated particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`launch-particle-${i + 1}`}
              className="absolute w-2 h-2 bg-zinc-700/30 rounded-full blur-sm"
              style={{
                left: `${10 + i * 7}%`,
                top: `${15 + (i % 4) * 20}%`,
              }}
              variants={particleVariants}
              animate="animate"
              transition={{ delay: i * 0.2 }}
            />
          ))}

          {/* Floating geometric shapes */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-32 h-32 border border-zinc-700/20 rounded-full"
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
              scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            }}
          />

          <motion.div
            className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-zinc-800/20 rounded-lg"
            animate={{
              rotate: -360,
              scale: [1, 0.8, 1],
            }}
            transition={{
              rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
              scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center space-y-8 p-8">
          {/* Holographic Orb */}
          <motion.div
            className="relative w-32 h-32 md:w-40 md:h-40"
            variants={orbVariants}
            animate="animate"
          >
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-zinc-800/30 via-zinc-800/30 to-zinc-700/30 blur-xl" />

            {/* Main orb */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-700 opacity-80">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 via-transparent to-transparent" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-bl from-transparent via-transparent to-black/30" />
            </div>

            {/* Inner core */}
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-white/40 via-blue-300/40 to-zinc-800/40 backdrop-blur-sm">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/60 to-transparent" />
            </div>

            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 6, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                }}
              >
                <Zap className="w-8 h-8 text-white drop-shadow-2xl" />
              </motion.div>
            </div>
          </motion.div>

          {/* Brand Text */}
          <motion.div
            className="text-center space-y-4"
            variants={textVariants}
            initial="appearing"
            animate={stage}
          >
            <h1 className="text-4xl md:text-6xl font-thin tracking-wider text-white">
              <span className="bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-700 bg-clip-text text-transparent">
                CHRONOS
              </span>
            </h1>

            <p className="text-sm md:text-base text-slate-400 font-light tracking-wide">
              Enterprise System
            </p>

            <div className="flex items-center justify-center space-x-2 text-slate-500">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest">Initializing</span>
              <Sparkles className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            className="w-64 md:w-80 h-1 bg-slate-800 rounded-full overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-zinc-800 via-zinc-800 to-zinc-700 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </motion.div>

          {/* Loading indicator */}
          <motion.div
            className="flex items-center space-x-3 text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={`loading-dot-${i}`}
                  className="w-2 h-2 bg-zinc-700 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
            <span className="text-sm font-light">Loading components...</span>
          </motion.div>

          {/* Skip button */}
          <motion.button
            className="absolute bottom-8 right-8 flex items-center space-x-2 px-4 py-2 text-slate-500 hover:text-white transition-colors group"
            onClick={() => onComplete?.()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm font-light">Skip</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Ambient light effect */}
        <div className="absolute inset-0 bg-radial-gradient from-zinc-800/5 via-transparent to-transparent pointer-events-none" />
      </motion.div>
    </AnimatePresence>
  );
});

ChronosLaunchScreen.displayName = 'ChronosLaunchScreen';

ChronosLaunchScreen.propTypes = {
  onComplete: PropTypes.func,
};

export default ChronosLaunchScreen;
