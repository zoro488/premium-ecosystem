/**
 * 🤖 Animated AI Assistant - Personaje Interactivo 2D/3D
 *
 * Características:
 * - Animaciones Lottie fluidas
 * - Micro-interacciones reactivas
 * - Profundidad 2.5D con CSS transforms
 * - Física realista con React Spring
 * - Estados emocionales expresivos
 * - Integración perfecta con UI
 *
 * @version 3.0.0
 */
import { useCallback, useEffect, useRef, useState } from 'react';

import { animated, config, useSpring as useReactSpring } from '@react-spring/web';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import {
  AlertCircle,
  Brain,
  CheckCircle,
  Frown,
  Heart,
  Meh,
  MessageCircle,
  Smile,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';

type EmotionState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'happy'
  | 'excited'
  | 'confused'
  | 'success'
  | 'error'
  | 'processing';

interface AnimatedAssistantProps {
  emotion?: EmotionState;
  message?: string;
  isActive?: boolean;
  onInteract?: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export default function AnimatedAssistant({
  emotion = 'idle',
  message,
  isActive = false,
  onInteract,
  position = 'bottom-right',
}: AnimatedAssistantProps) {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionState>(emotion);
  const [isHovered, setIsHovered] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const eyeX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const eyeY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  const containerRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(0);

  // Actualizar emoción cuando cambia el prop
  useEffect(() => {
    setCurrentEmotion(emotion);
  }, [emotion]);

  // Mostrar mensaje cuando llega
  useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Animación del cuerpo con React Spring
  const bodyAnimation = useReactSpring({
    transform: isActive
      ? 'scale(1.1) translateY(-10px)'
      : isHovered
        ? 'scale(1.05) translateY(-5px)'
        : 'scale(1) translateY(0px)',
    config: config.wobbly,
  });

  // Seguimiento de mouse para los ojos
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const angleX = (e.clientX - centerX) / 100;
      const angleY = (e.clientY - centerY) / 100;

      mouseX.set(Math.max(-10, Math.min(10, angleX)));
      mouseY.set(Math.max(-10, Math.min(10, angleY)));
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Generar partículas
  const createParticles = useCallback(() => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: particleIdRef.current++,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1000);
  }, []);

  // Efectos según emoción
  useEffect(() => {
    if (currentEmotion === 'excited' || currentEmotion === 'success') {
      createParticles();
    }
  }, [currentEmotion, createParticles]);

  // Determinar color según emoción
  const getEmotionColor = () => {
    switch (currentEmotion) {
      case 'happy':
      case 'success':
        return 'from-green-400 to-emerald-600';
      case 'excited':
        return 'from-yellow-400 to-orange-600';
      case 'thinking':
      case 'processing':
        return 'from-blue-400 to-purple-600';
      case 'listening':
        return 'from-cyan-400 to-blue-600';
      case 'confused':
        return 'from-amber-400 to-yellow-600';
      case 'error':
        return 'from-red-400 to-pink-600';
      default:
        return 'from-indigo-400 to-purple-600';
    }
  };

  // Animaciones de respiración
  const breatheAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  // Animaciones de latido (activo)
  const pulseAnimation = {
    scale: [1, 1.15, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  // Posicionamiento
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  // Determinar icono de emoción
  const getEmotionIcon = () => {
    switch (currentEmotion) {
      case 'happy':
      case 'success':
        return <Smile className="w-6 h-6" />;
      case 'excited':
        return <Star className="w-6 h-6" />;
      case 'confused':
        return <Meh className="w-6 h-6" />;
      case 'error':
        return <Frown className="w-6 h-6" />;
      case 'listening':
        return <MessageCircle className="w-6 h-6" />;
      case 'thinking':
      case 'processing':
        return <Brain className="w-6 h-6" />;
      default:
        return <Brain className="w-6 h-6" />;
    }
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* Mensaje flotante */}
      <AnimatePresence>
        {showMessage && message && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="absolute bottom-full mb-4 right-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 max-w-xs"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full bg-gradient-to-br ${getEmotionColor()}`}>
                {getEmotionIcon()}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800 dark:text-gray-200">{message}</p>
              </div>
            </div>
            {/* Flecha */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenedor principal del personaje */}
      <animated.div
        ref={containerRef}
        style={bodyAnimation}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          createParticles();
          onInteract?.();
        }}
        className="relative cursor-pointer"
      >
        {/* Partículas */}
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: 0,
                scale: 1.5,
                x: particle.x,
                y: particle.y,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500"
            />
          ))}
        </AnimatePresence>

        {/* Sombra */}
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-black/20 rounded-full blur-xl"
          animate={{
            scale: isActive ? 1.2 : isHovered ? 1.1 : 1,
            opacity: isActive ? 0.3 : isHovered ? 0.25 : 0.2,
          }}
        />

        {/* Cuerpo del personaje */}
        <div className="relative w-28 h-28" style={{ perspective: '1000px' }}>
          {/* Aura animada */}
          <motion.div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${getEmotionColor()} blur-2xl opacity-50`}
            animate={isActive ? pulseAnimation : breatheAnimation}
          />

          {/* Círculo principal (cabeza) */}
          <motion.div
            className={`relative w-full h-full rounded-full bg-gradient-to-br ${getEmotionColor()} shadow-2xl overflow-hidden`}
            animate={{
              rotateY: isHovered ? 10 : 0,
              rotateX: isHovered ? -5 : 0,
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Brillo superior */}
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/40 to-transparent rounded-t-full" />

            {/* Ojos */}
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 flex gap-4">
              {/* Ojo izquierdo */}
              <motion.div
                className="relative w-6 h-8 bg-white rounded-full shadow-inner"
                animate={{
                  scaleY: currentEmotion === 'thinking' ? [1, 0.3, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: currentEmotion === 'thinking' ? Infinity : 0,
                  repeatDelay: 0.5,
                }}
              >
                <motion.div
                  className="absolute top-1/2 left-1/2 w-3 h-3 bg-gray-900 rounded-full"
                  style={{
                    x: eyeX,
                    y: eyeY,
                    translateX: '-50%',
                    translateY: '-50%',
                  }}
                >
                  <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full" />
                </motion.div>
              </motion.div>

              {/* Ojo derecho */}
              <motion.div
                className="relative w-6 h-8 bg-white rounded-full shadow-inner"
                animate={{
                  scaleY: currentEmotion === 'thinking' ? [1, 0.3, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: currentEmotion === 'thinking' ? Infinity : 0,
                  repeatDelay: 0.5,
                }}
              >
                <motion.div
                  className="absolute top-1/2 left-1/2 w-3 h-3 bg-gray-900 rounded-full"
                  style={{
                    x: eyeX,
                    y: eyeY,
                    translateX: '-50%',
                    translateY: '-50%',
                  }}
                >
                  <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full" />
                </motion.div>
              </motion.div>
            </div>

            {/* Boca */}
            <motion.div
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
              animate={{
                scale: currentEmotion === 'speaking' ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 0.3,
                repeat: currentEmotion === 'speaking' ? Infinity : 0,
              }}
            >
              {/* Boca según emoción */}
              {(currentEmotion === 'happy' ||
                currentEmotion === 'success' ||
                currentEmotion === 'excited') && (
                <div className="w-8 h-4 border-b-4 border-gray-800 rounded-b-full" />
              )}
              {currentEmotion === 'confused' && (
                <div className="w-8 h-1 bg-gray-800 rounded-full" />
              )}
              {currentEmotion === 'error' && (
                <div className="w-8 h-4 border-t-4 border-gray-800 rounded-t-full" />
              )}
              {(currentEmotion === 'idle' ||
                currentEmotion === 'listening' ||
                currentEmotion === 'thinking' ||
                currentEmotion === 'processing') && (
                <div className="w-6 h-2 bg-gray-800 rounded-full" />
              )}
              {currentEmotion === 'speaking' && (
                <div className="w-4 h-4 bg-gray-800 rounded-full" />
              )}
            </motion.div>

            {/* Onda de sonido (cuando habla o escucha) */}
            <AnimatePresence>
              {(currentEmotion === 'speaking' || currentEmotion === 'listening') && (
                <>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border-2 border-white"
                      initial={{ scale: 0.9, opacity: 0.8 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: 'easeOut',
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Spinner de pensamiento */}
            {(currentEmotion === 'thinking' || currentEmotion === 'processing') && (
              <motion.div
                className="absolute top-2 right-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Brain className="w-5 h-5 text-white" />
              </motion.div>
            )}

            {/* Sparkles cuando está feliz/éxito */}
            {(currentEmotion === 'success' || currentEmotion === 'excited') && (
              <>
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      top: `${20 + Math.random() * 60}%`,
                      left: `${20 + Math.random() * 60}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: 'easeInOut',
                    }}
                  >
                    <Sparkles className="w-3 h-3 text-yellow-300" />
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>

          {/* Icono de estado en la parte inferior */}
          <motion.div
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <div
              className={`w-6 h-6 rounded-full bg-gradient-to-br ${getEmotionColor()} flex items-center justify-center text-white`}
            >
              {currentEmotion === 'listening' && <MessageCircle className="w-3 h-3" />}
              {(currentEmotion === 'thinking' || currentEmotion === 'processing') && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Brain className="w-3 h-3" />
                </motion.div>
              )}
              {currentEmotion === 'success' && <CheckCircle className="w-3 h-3" />}
              {currentEmotion === 'error' && <AlertCircle className="w-3 h-3" />}
              {currentEmotion === 'excited' && <Zap className="w-3 h-3" />}
              {currentEmotion === 'happy' && <Heart className="w-3 h-3" />}
            </div>
          </motion.div>
        </div>

        {/* Tooltip hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: -20 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap"
            >
              ¡Haz clic para interactuar! ✨
            </motion.div>
          )}
        </AnimatePresence>

        {/* Indicador de actividad */}
        {isActive && (
          <motion.div
            className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </animated.div>
    </div>
  );
}
