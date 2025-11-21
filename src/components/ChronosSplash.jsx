/**
 * 🎬 Chronos Splash Screen
 * Intro animado + Login + Loading screen con video glitch premium
 */
import { useCallback, useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';

import ChronosLogin from './ChronosLogin';

const ChronosSplash = ({ onComplete }) => {
  const [phase, setPhase] = useState('intro'); // 'intro' | 'login' | 'loading' | 'done'
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState(null);

  // Memoizar la función de completado
  const handleComplete = useCallback(() => {
    setPhase('done');
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 1000);
  }, [onComplete]);

  useEffect(() => {
    // Simular carga de recursos
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          handleComplete();
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [handleComplete]);

  const handleIntroEnd = () => {
    setPhase('login');
  };

  const handleLoginSuccess = useCallback((userData) => {
    setUser(userData);
    setPhase('loading');
  }, []);

  const handleSkipLogin = useCallback(() => {
    setUser({ email: 'demo@chronos.com', name: 'Demo User' });
    setPhase('loading');
  }, []);

  return (
    <AnimatePresence mode="wait">
      {phase !== 'done' && (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
        >
          {/* Video de Intro */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <video
                autoPlay
                muted
                playsInline
                onEnded={handleIntroEnd}
                className="w-full h-full object-cover"
              >
                <source src="/chronos-intro.mov" type="video/quicktime" />
                <source src="/chronos-intro.mp4" type="video/mp4" />
              </video>

              {/* Logo y Texto superpuesto */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
                <motion.img
                  src="/chronos-logo.png"
                  alt="Chronos"
                  className="w-32 h-32 object-contain mb-4"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
                <motion.h1
                  className="text-6xl font-black text-white tracking-wider"
                  style={{
                    textShadow:
                      '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.5)',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  CHRONOS
                </motion.h1>
                <motion.p
                  className="text-blue-400 text-sm font-light tracking-widest mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  PREMIUM ECOSYSTEM
                </motion.p>
              </div>
            </motion.div>
          )}

          {/* Login Screen */}
          {phase === 'login' && (
            <ChronosLogin onLoginSuccess={handleLoginSuccess} onSkip={handleSkipLogin} />
          )}

          {/* Loading Screen */}
          {phase === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                <source src="/chronos-loading.mp4" type="video/mp4" />
              </video>

              {/* Overlay de Loading */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-black/50 via-transparent to-black/50">
                <motion.img
                  src="/chronos-logo.png"
                  alt="Chronos"
                  className="w-24 h-24 object-contain mb-8"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                <h2 className="text-4xl font-black text-white mb-8 tracking-wider">CHRONOS</h2>

                {/* Barra de Progreso Premium */}
                <div className="w-80 h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-full"
                    style={{
                      width: `${progress}%`,
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {user && (
                  <motion.p
                    className="text-cyan-400 text-sm mt-6 font-medium"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Bienvenido, {user.name}
                  </motion.p>
                )}

                <motion.p
                  className="text-blue-300 text-sm mt-4 font-light"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Inicializando sistema... {progress}%
                </motion.p>
              </div>
            </motion.div>
          )}

          {/* Efecto de Partículas Flotantes */}
          <div className="absolute inset-0 pointer-events-none">
            {new Array(20).fill(0).map((_, index) => {
              const particleId = `particle-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`;
              return (
                <motion.div
                  key={particleId}
                  className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ChronosSplash.propTypes = {
  onComplete: PropTypes.func,
};

ChronosSplash.defaultProps = {
  onComplete: null,
};

export default ChronosSplash;
