import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const placeholders = ['LOGO 1', 'LOGO 2', 'LOGO 3', 'CHRONOS'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.8,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.5 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.5, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 100,
    },
  },
};

const glowVariants = {
  initial: {
    textShadow: '0 0 5px #0ff, 0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff',
    opacity: 0.8,
  },
  animate: {
    textShadow: [
      '0 0 5px #0ff, 0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff',
      '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #0ff',
      '0 0 5px #0ff, 0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff',
    ],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      repeatType: 'mirror',
    },
  },
};

function PremiumSplashScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 5000); // Total duration of the splash screen

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 w-full h-full flex items-center justify-center bg-black overflow-hidden"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        <div className="absolute inset-0 bg-grid-cyan-500/10"></div>
        <motion.div
          variants={containerVariants}
          className="flex flex-col items-center justify-center space-y-8"
        >
          {placeholders.map((text, index) => (
            <motion.div key={index} variants={itemVariants}>
              <motion.h1
                className="text-4xl md:text-6xl font-black text-white tracking-widest"
                variants={glowVariants}
                initial="initial"
                animate="animate"
              >
                {text}
              </motion.h1>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default PremiumSplashScreen;
