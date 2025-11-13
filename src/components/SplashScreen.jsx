/**
 * 🎬 CHRONOS Splash Screen
 * Pantalla de inicio con video glitch y logo
 */
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';

export default function SplashScreen({ onComplete, duration = 4000 }) {
  const [isVisible, setIsVisible] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
        >
          {/* Video de fondo */}
          <video
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          >
            <source src="/splash-video.mp4" type="video/mp4" />
          </video>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />

          {/* Contenido central */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-8">
            {/* Logo con animación glitch */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: videoLoaded ? 1 : 0,
                rotate: videoLoaded ? 0 : -180,
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
              className="relative"
            >
              <img
                src="/chronos-logo.png"
                alt="Chronos Logo"
                className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl"
              />

              {/* Efecto glitch en el logo */}
              <motion.div
                animate={{
                  opacity: [0, 0.3, 0, 0.5, 0],
                  x: [0, -2, 2, -1, 0],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
                className="absolute inset-0 bg-cyan-500/20 mix-blend-screen"
              />
            </motion.div>

            {/* Texto CHRONOS con efecto futurista */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: videoLoaded ? 1 : 0, y: videoLoaded ? 0 : 20 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative"
            >
              <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 tracking-wider">
                CHRONOS
              </h1>

              {/* Efecto de escaneo */}
              <motion.div
                animate={{ scaleX: [0, 1, 1, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: 'easeInOut',
                }}
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-full origin-left"
              />
            </motion.div>

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: videoLoaded ? 0.7 : 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-gray-300 text-sm md:text-base tracking-[0.3em] uppercase font-light"
            >
              Premium Ecosystem
            </motion.p>

            {/* Barra de carga */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{
                opacity: videoLoaded ? 1 : 0,
                width: videoLoaded ? '200px' : 0,
              }}
              transition={{ delay: 1, duration: duration / 1000 - 1 }}
              className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full mt-8"
            />

            {/* Indicador de carga */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mt-4 text-gray-400 text-xs tracking-widest uppercase"
            >
              {videoLoaded ? 'Inicializando...' : 'Cargando...'}
            </motion.div>
          </div>

          {/* Partículas decorativas */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
                  y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0,
                  scale: 0,
                }}
                animate={{
                  y: [null, -20, -40],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

SplashScreen.propTypes = {
  onComplete: PropTypes.func,
  duration: PropTypes.number,
};
