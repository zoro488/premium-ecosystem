import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import ChronosCinematicLogo from './ChronosCinematicLogo';
import ChronosLoadingCinematic from './ChronosLoadingCinematic';
import ChronosLoginCinematic from './ChronosLoginCinematic';

const ChronosCinematicOrchestrator = ({ onAuthComplete, children }) => {
  const [currentStage, setCurrentStage] = useState('logo'); // logo -> loading -> login -> app
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('Initializing');

  // Progreso automático del loading
  useEffect(() => {
    if (currentStage === 'loading') {
      const phases = [
        { progress: 20, status: 'Loading Core Systems', duration: 800 },
        { progress: 40, status: 'Connecting Database', duration: 600 },
        { progress: 60, status: 'Initializing Network', duration: 700 },
        { progress: 80, status: 'Securing Connections', duration: 500 },
        { progress: 95, status: 'Starting Analytics', duration: 400 },
        { progress: 100, status: 'System Ready', duration: 500 }
      ];

      let currentPhaseIndex = 0;

      const runPhases = () => {
        if (currentPhaseIndex < phases.length) {
          const phase = phases[currentPhaseIndex];

          setTimeout(() => {
            setLoadingProgress(phase.progress);
            setLoadingStatus(phase.status);
            currentPhaseIndex++;
            runPhases();
          }, phase.duration);
        } else {
          // Transición a login
          setTimeout(() => {
            setCurrentStage('login');
          }, 800);
        }
      };

      runPhases();
    }
  }, [currentStage]);

  const handleLogoComplete = () => {
    setCurrentStage('loading');
  };

  const handleLoginComplete = (credentials) => {
    setCurrentStage('app');
    onAuthComplete?.(credentials);
  };

  // Variantes de transición para AnimatePresence
  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.95,
      filter: 'blur(10px)'
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    },
    exit: {
      opacity: 0,
      scale: 1.05,
      filter: 'blur(10px)',
      transition: {
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black">
      <AnimatePresence mode="wait">
        {currentStage === 'logo' && (
          <motion.div
            key="logo"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0"
          >
            <ChronosCinematicLogo onComplete={handleLogoComplete} />
          </motion.div>
        )}

        {currentStage === 'loading' && (
          <motion.div
            key="loading"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0"
          >
            <ChronosLoadingCinematic
              progress={loadingProgress}
              status={loadingStatus}
            />
          </motion.div>
        )}

        {currentStage === 'login' && (
          <motion.div
            key="login"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0"
          >
            <ChronosLoginCinematic onLogin={handleLoginComplete} />
          </motion.div>
        )}

        {currentStage === 'app' && (
          <motion.div
            key="app"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            className="absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

ChronosCinematicOrchestrator.propTypes = {
  onAuthComplete: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};

export default ChronosCinematicOrchestrator;
