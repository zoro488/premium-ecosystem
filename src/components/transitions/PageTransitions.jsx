/**
 * 🎬 SISTEMA DE TRANSICIONES DE PÁGINA PREMIUM
 * Transiciones suaves y elegantes entre vistas
 */
import { AnimatePresence, motion } from 'framer-motion';

/**
 * 🎭 FADE SCALE - Transición con fade y escala
 */
export const FadeScale = ({ children, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * 🌊 SLIDE - Transición deslizante
 */
export const Slide = ({ children, direction = 'right', ...props }) => {
  const variants = {
    left: {
      initial: { x: -50, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -50, opacity: 0 },
    },
    right: {
      initial: { x: 50, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 50, opacity: 0 },
    },
    up: {
      initial: { y: 50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 50, opacity: 0 },
    },
    down: {
      initial: { y: -50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -50, opacity: 0 },
    },
  };

  return (
    <motion.div {...variants[direction]} transition={{ duration: 0.3, ease: 'easeOut' }} {...props}>
      {children}
    </motion.div>
  );
};

/**
 * 🎪 CURTAIN - Transición tipo cortina
 */
export const Curtain = ({ children, color = '#0f172a', ...props }) => {
  return (
    <motion.div className="relative" {...props}>
      <motion.div
        className="absolute inset-0 z-50 origin-top"
        style={{ backgroundColor: color }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

/**
 * 🌀 ROTATION FADE - Transición con rotación
 */
export const RotationFade = ({ children, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      exit={{ opacity: 0, rotateY: 90 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * 📜 STAGGER LIST - Animación escalonada para listas
 */
export const StaggerList = ({ children, staggerDelay = 0.1 }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, ...props }) => {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={item} {...props}>
      {children}
    </motion.div>
  );
};

/**
 * 🎯 MORPH CARD - Transición morphing para cards
 */
export const MorphCard = ({ children, layoutId, ...props }) => {
  return (
    <motion.div
      layoutId={layoutId}
      transition={{
        layout: { duration: 0.4, ease: 'easeInOut' },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * 🌌 ZOOM - Transición con zoom
 */
export const Zoom = ({ children, direction = 'in', ...props }) => {
  const variants = {
    in: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 },
    },
    out: {
      initial: { scale: 1.2, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 1.2, opacity: 0 },
    },
  };

  return (
    <motion.div {...variants[direction]} transition={{ duration: 0.3, ease: 'easeOut' }} {...props}>
      {children}
    </motion.div>
  );
};

/**
 * 🎨 BLUR SLIDE - Transición con blur y slide
 */
export const BlurSlide = ({ children, direction = 'right', ...props }) => {
  const variants = {
    left: {
      initial: { x: -100, opacity: 0, filter: 'blur(10px)' },
      animate: { x: 0, opacity: 1, filter: 'blur(0px)' },
      exit: { x: -100, opacity: 0, filter: 'blur(10px)' },
    },
    right: {
      initial: { x: 100, opacity: 0, filter: 'blur(10px)' },
      animate: { x: 0, opacity: 1, filter: 'blur(0px)' },
      exit: { x: 100, opacity: 0, filter: 'blur(10px)' },
    },
  };

  return (
    <motion.div {...variants[direction]} transition={{ duration: 0.4, ease: 'easeOut' }} {...props}>
      {children}
    </motion.div>
  );
};

/**
 * 🎪 PAGE WRAPPER - Wrapper para transiciones automáticas
 */
export const PageTransition = ({ children, variant = 'fade', ...props }) => {
  const variants = {
    fade: FadeScale,
    slide: Slide,
    curtain: Curtain,
    rotation: RotationFade,
    zoom: Zoom,
    blur: BlurSlide,
  };

  const Component = variants[variant] || FadeScale;

  return (
    <AnimatePresence mode="wait">
      <Component {...props}>{children}</Component>
    </AnimatePresence>
  );
};

/**
 * 🎯 TAB TRANSITION - Transición para tabs
 */
export const TabTransition = ({ children, activeTab, ...props }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * 📱 MODAL TRANSITION - Transición para modales
 */
export const ModalTransition = ({ children, isOpen, onClose, ...props }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            {...props}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default {
  FadeScale,
  Slide,
  Curtain,
  RotationFade,
  StaggerList,
  StaggerItem,
  MorphCard,
  Zoom,
  BlurSlide,
  PageTransition,
  TabTransition,
  ModalTransition,
};
