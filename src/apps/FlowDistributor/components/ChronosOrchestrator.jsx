import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import ChronosSplashMinimal from './ChronosSplashMinimal';
import ChronosLoadingMinimal from './ChronosLoadingMinimal';
import ChronosLoginMinimal from './ChronosLoginMinimal';

/**
 * 🎬 CHRONOS ORCHESTRATOR - Minimalista
 * Flujo: Splash (3s) → Loading (auto) → Login → App
 * Transiciones suaves y limpias
 */
const ChronosOrchestrator = ({ onAuthComplete, children }) => {
  const [currentStage, setCurrentStage] = useState('splash'); // splash -> loading -> login -> app
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Progreso automático del loading
  useEffect(() => {
    if (currentStage === 'loading') {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTimeout(() => setCurrentStage('login'), 500);
        }
        setLoadingProgress(progress);
      }, 200);

      return () => clearInterval(interval);
    }
  }, [currentStage]);

  const handleSplashComplete = () => {
    setCurrentStage('loading');
  };

  const handleLoginComplete = (credentials) => {
    setCurrentStage('app');
    onAuthComplete?.(credentials);
  };

  // Variantes de transición
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
    exit: { opacity: 0, transition: { duration: 0.4, ease: 'easeIn' } },
  };

  return (
    <div className="fixed inset-0 bg-black">
      <AnimatePresence mode="wait">
        {currentStage === 'splash' && (
          <motion.div
            key="splash"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <ChronosSplashMinimal onComplete={handleSplashComplete} />
          </motion.div>
        )}

        {currentStage === 'loading' && (
          <motion.div
            key="loading"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <ChronosLoadingMinimal progress={loadingProgress} />
          </motion.div>
        )}

        {currentStage === 'login' && (
          <motion.div
            key="login"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <ChronosLoginMinimal onLogin={handleLoginComplete} />
          </motion.div>
        )}

        {currentStage === 'app' && (
          <motion.div key="app" variants={pageVariants} initial="initial" animate="animate">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

ChronosOrchestrator.propTypes = {
  onAuthComplete: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default ChronosOrchestrator;
