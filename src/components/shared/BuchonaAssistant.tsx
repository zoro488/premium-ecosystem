/**
 * 💎 Buchona Assistant - Personaje Animado Interactivo
 *
 * Características:
 * - Estética buchona/narco-chic mexicana
 * - Animaciones fluidas y micro-interacciones
 * - Movimiento libre por toda la interfaz
 * - Se integra con componentes
 * - Efectos de partículas y bling
 * - Estados emocionales (idle, thinking, celebrating, etc)
 * - Pathfinding inteligente
 * - Física realista
 *
 * @version 1.0.0
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { animated, config, useSpring } from '@react-spring/web';
import { AnimatePresence, motion, useAnimation, useMotionValue } from 'framer-motion';
import { Crown, Heart, MessageCircle, Sparkles, Star, TrendingUp, Zap } from 'lucide-react';

interface BuchonaAssistantProps {
  onInteract?: (action: string) => void;
  initialPosition?: { x: number; y: number };
}

type EmotionalState =
  | 'idle'
  | 'thinking'
  | 'celebrating'
  | 'working'
  | 'surprised'
  | 'confident'
  | 'dancing';

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

const BuchonaAssistant: React.FC<BuchonaAssistantProps> = ({
  onInteract,
  initialPosition = { x: 100, y: 100 },
}) => {
  const [state, setState] = useState<EmotionalState>('idle');
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('¡Qué onda! 💎');

  const controls = useAnimation();
  const x = useMotionValue(initialPosition.x);
  const y = useMotionValue(initialPosition.y);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const lastInteractionRef = useRef<number>(Date.now());

  // Colores buchona
  const colors = {
    primary: '#FF1493', // Rosa fucsia
    secondary: '#FFD700', // Dorado
    accent: '#9D00FF', // Morado
    black: '#1a1a1a',
    white: '#FFFFFF',
  };

  // Spring animations para suavidad
  const [springProps, setSpringProps] = useSpring(() => ({
    scale: 1,
    rotate: 0,
    config: config.wobbly,
  }));

  // Animación de respiración (idle)
  useEffect(() => {
    if (state === 'idle') {
      const breathe = async () => {
        while (state === 'idle') {
          await controls.start({
            scale: [1, 1.05, 1],
            transition: { duration: 2, repeat: Infinity },
          });
        }
      };
      breathe();
    }
  }, [state, controls]);

  // Sistema de partículas
  const createParticles = useCallback((centerX: number, centerY: number, count: number = 10) => {
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: `${Date.now()}_${i}`,
      x: centerX,
      y: centerY,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5,
      life: 1,
      color: [colors.primary, colors.secondary, colors.accent][Math.floor(Math.random() * 3)],
      size: Math.random() * 8 + 4,
    }));

    setParticles((prev) => [...prev, ...newParticles]);
  }, []);

  // Actualizar partículas
  useEffect(() => {
    const updateParticles = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.2, // Gravedad
            life: p.life - 0.02,
          }))
          .filter((p) => p.life > 0)
      );

      animationFrameRef.current = requestAnimationFrame(updateParticles);
    };

    updateParticles();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Auto-movimiento aleatorio
  useEffect(() => {
    const autoMove = setInterval(() => {
      if (!isDragging && !isHovered && Date.now() - lastInteractionRef.current > 10000) {
        const windowWidth = window.innerWidth - 200;
        const windowHeight = window.innerHeight - 200;

        const targetX = Math.random() * windowWidth;
        const targetY = Math.random() * windowHeight;

        moveTo(targetX, targetY);
      }
    }, 15000);

    return () => clearInterval(autoMove);
  }, [isDragging, isHovered]);

  // Movimiento suave a posición
  const moveTo = useCallback(
    (targetX: number, targetY: number) => {
      const currentX = x.get();
      const currentY = y.get();

      controls.start({
        x: targetX,
        y: targetY,
        transition: {
          type: 'spring',
          damping: 20,
          stiffness: 100,
          duration: 2,
        },
      });

      x.set(targetX);
      y.set(targetY);

      setState('working');
      setTimeout(() => setState('idle'), 2000);
    },
    [controls, x, y]
  );

  // Cambiar estado con efectos
  const changeState = useCallback(
    (newState: EmotionalState) => {
      setState(newState);

      const currentX = x.get();
      const currentY = y.get();

      switch (newState) {
        case 'celebrating':
          setSpringProps({ scale: 1.2, rotate: 360 });
          createParticles(currentX + 50, currentY + 50, 20);
          setMessage('¡A huevo! 💎✨');
          break;
        case 'thinking':
          setSpringProps({ scale: 1, rotate: -10 });
          setMessage('Déjame pensar... 🤔');
          break;
        case 'confident':
          setSpringProps({ scale: 1.1, rotate: 5 });
          createParticles(currentX + 50, currentY + 50, 15);
          setMessage('¡Eso! 👑');
          break;
        case 'dancing':
          setSpringProps({ scale: 1, rotate: 0 });
          setMessage('¡Dale! 💃🔥');
          break;
        default:
          setSpringProps({ scale: 1, rotate: 0 });
      }

      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);

      // Auto-volver a idle
      setTimeout(() => {
        if (newState !== 'idle') setState('idle');
      }, 5000);
    },
    [createParticles, setSpringProps, x, y]
  );

  // Interacciones
  const handleClick = useCallback(() => {
    lastInteractionRef.current = Date.now();

    const states: EmotionalState[] = ['celebrating', 'confident', 'dancing'];
    const randomState = states[Math.floor(Math.random() * states.length)];

    changeState(randomState);

    if (onInteract) {
      onInteract('click');
    }
  }, [changeState, onInteract]);

  const handleDoubleClick = useCallback(() => {
    changeState('celebrating');

    const currentX = x.get();
    const currentY = y.get();
    createParticles(currentX + 50, currentY + 50, 30);

    if (onInteract) {
      onInteract('celebrate');
    }
  }, [changeState, createParticles, x, y, onInteract]);

  return (
    <>
      {/* Personaje principal */}
      <motion.div
        ref={containerRef}
        drag
        dragMomentum={false}
        dragElastic={0.1}
        onDragStart={() => {
          setIsDragging(true);
          lastInteractionRef.current = Date.now();
        }}
        onDragEnd={() => setIsDragging(false)}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        animate={controls}
        style={{
          x,
          y,
          position: 'fixed',
          zIndex: 9999,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        className="buchona-character"
      >
        <animated.div
          style={{
            ...springProps,
            width: 120,
            height: 120,
            position: 'relative',
          }}
        >
          {/* Sombra */}
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black/20 rounded-full blur-xl"
            style={{
              transform: isDragging ? 'scale(1.2)' : 'scale(1)',
              transition: 'transform 0.3s',
            }}
          />

          {/* Cuerpo principal */}
          <svg width="120" height="120" viewBox="0 0 120 120" className="relative z-10">
            {/* Aura de bling */}
            <motion.circle
              cx="60"
              cy="60"
              r="55"
              fill="url(#aura-gradient)"
              opacity={isHovered ? 0.6 : 0.3}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Gradientes */}
            <defs>
              <linearGradient id="aura-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.primary} stopOpacity="0.4" />
                <stop offset="50%" stopColor={colors.secondary} stopOpacity="0.6" />
                <stop offset="100%" stopColor={colors.accent} stopOpacity="0.4" />
              </linearGradient>

              <linearGradient id="body-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.black} />
                <stop offset="100%" stopColor="#2a2a2a" />
              </linearGradient>

              <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#FFA500" />
                <stop offset="100%" stopColor="#FFD700" />
              </linearGradient>
            </defs>

            {/* Cuerpo - Outfit táctico buchón */}
            <ellipse cx="60" cy="75" rx="25" ry="30" fill="url(#body-gradient)" />

            {/* Chaleco táctico */}
            <motion.path
              d="M 40 65 L 40 85 L 50 85 L 50 65 Z M 70 65 L 70 85 L 80 85 L 80 65 Z"
              fill={colors.black}
              stroke={colors.secondary}
              strokeWidth="1"
              animate={{
                strokeOpacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />

            {/* Cadenas doradas */}
            <motion.circle
              cx="60"
              cy="68"
              r="4"
              fill="url(#gold-gradient)"
              animate={{
                scale: state === 'celebrating' ? [1, 1.3, 1] : 1,
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: state === 'celebrating' ? Infinity : 0,
              }}
            />
            <motion.path
              d="M 50 68 Q 55 75 60 68 Q 65 75 70 68"
              stroke="url(#gold-gradient)"
              strokeWidth="2"
              fill="none"
              animate={{
                pathLength: [0, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />

            {/* Cabeza */}
            <circle
              cx="60"
              cy="50"
              r="20"
              fill="#FFD4A3"
              stroke={colors.secondary}
              strokeWidth="2"
            />

            {/* Cabello largo (buchona style) */}
            <motion.path
              d="M 40 45 Q 35 50 38 60 L 42 58 Q 40 50 42 45 Z"
              fill={colors.black}
              animate={{
                d:
                  state === 'dancing'
                    ? [
                        'M 40 45 Q 35 50 38 60 L 42 58 Q 40 50 42 45 Z',
                        'M 40 45 Q 33 52 36 62 L 42 58 Q 38 52 42 45 Z',
                        'M 40 45 Q 35 50 38 60 L 42 58 Q 40 50 42 45 Z',
                      ]
                    : 'M 40 45 Q 35 50 38 60 L 42 58 Q 40 50 42 45 Z',
              }}
              transition={{ duration: 0.5, repeat: state === 'dancing' ? Infinity : 0 }}
            />
            <motion.path
              d="M 80 45 Q 85 50 82 60 L 78 58 Q 80 50 78 45 Z"
              fill={colors.black}
              animate={{
                d:
                  state === 'dancing'
                    ? [
                        'M 80 45 Q 85 50 82 60 L 78 58 Q 80 50 78 45 Z',
                        'M 80 45 Q 87 52 84 62 L 78 58 Q 82 52 78 45 Z',
                        'M 80 45 Q 85 50 82 60 L 78 58 Q 80 50 78 45 Z',
                      ]
                    : 'M 80 45 Q 85 50 82 60 L 78 58 Q 80 50 78 45 Z',
              }}
              transition={{ duration: 0.5, repeat: state === 'dancing' ? Infinity : 0 }}
            />

            {/* Corona (buchona queen) */}
            <motion.path
              d="M 50 35 L 52 38 L 54 35 L 56 38 L 58 35 L 60 32 L 62 35 L 64 38 L 66 35 L 68 38 L 70 35"
              stroke={colors.secondary}
              strokeWidth="2"
              fill="none"
              animate={{
                y: state === 'celebrating' ? [-2, 0, -2] : 0,
                rotate: state === 'celebrating' ? [0, 5, -5, 0] : 0,
              }}
              transition={{
                duration: 0.3,
                repeat: state === 'celebrating' ? Infinity : 0,
              }}
            />

            {/* Gafas de sol (buchona style) */}
            <motion.g
              animate={{
                opacity: state === 'confident' ? 1 : 0.8,
              }}
            >
              <ellipse cx="52" cy="48" rx="6" ry="5" fill={colors.black} opacity="0.9" />
              <ellipse cx="68" cy="48" rx="6" ry="5" fill={colors.black} opacity="0.9" />
              <line x1="58" y1="48" x2="62" y2="48" stroke={colors.secondary} strokeWidth="2" />
              <motion.rect
                x="46"
                y="46"
                width="12"
                height="4"
                fill={colors.accent}
                opacity="0.3"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              />
              <motion.rect
                x="62"
                y="46"
                width="12"
                height="4"
                fill={colors.accent}
                opacity="0.3"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              />
            </motion.g>

            {/* Aretes grandes (buchona signature) */}
            <motion.circle
              cx="38"
              cy="52"
              r="4"
              fill="url(#gold-gradient)"
              animate={{
                y: state === 'dancing' ? [0, 2, 0] : 0,
              }}
              transition={{
                duration: 0.3,
                repeat: state === 'dancing' ? Infinity : 0,
              }}
            />
            <motion.circle
              cx="82"
              cy="52"
              r="4"
              fill="url(#gold-gradient)"
              animate={{
                y: state === 'dancing' ? [0, 2, 0] : 0,
              }}
              transition={{
                duration: 0.3,
                repeat: state === 'dancing' ? Infinity : 0,
              }}
            />

            {/* Boca */}
            <motion.path
              d={
                isSpeaking
                  ? 'M 52 58 Q 60 62 68 58'
                  : state === 'confident'
                    ? 'M 52 56 Q 60 60 68 56'
                    : 'M 54 57 Q 60 59 66 57'
              }
              stroke={colors.primary}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              animate={{
                d: isSpeaking
                  ? ['M 52 58 Q 60 62 68 58', 'M 52 58 Q 60 60 68 58', 'M 52 58 Q 60 62 68 58']
                  : undefined,
              }}
              transition={{
                duration: 0.3,
                repeat: isSpeaking ? Infinity : 0,
              }}
            />

            {/* Brillo en mejillas */}
            <motion.circle
              cx="48"
              cy="54"
              r="3"
              fill={colors.primary}
              opacity="0.3"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
            <motion.circle
              cx="72"
              cy="54"
              r="3"
              fill={colors.primary}
              opacity="0.3"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />

            {/* Holster (detalle táctico) */}
            <rect
              x="75"
              y="75"
              width="6"
              height="12"
              fill={colors.black}
              stroke={colors.secondary}
              strokeWidth="0.5"
            />
          </svg>

          {/* Iconos flotantes según estado */}
          <AnimatePresence>
            {state === 'celebrating' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: -20 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 1 }}
                className="absolute top-0 left-1/2 transform -translate-x-1/2"
              >
                <Crown className="w-6 h-6" style={{ color: colors.secondary }} />
              </motion.div>
            )}

            {state === 'thinking' && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1, 1, 0],
                  y: [-20, -30, -40, -50],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-0 right-0"
              >
                <Sparkles className="w-4 h-4" style={{ color: colors.accent }} />
              </motion.div>
            )}

            {state === 'working' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  rotate: 360,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  rotate: { duration: 1, repeat: Infinity, ease: 'linear' },
                }}
                className="absolute top-0 left-0"
              >
                <Zap className="w-5 h-5" style={{ color: colors.primary }} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Badge de estado */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-2 -right-2 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-full p-2 shadow-lg"
          >
            {state === 'idle' && <Heart className="w-4 h-4 text-white" />}
            {state === 'thinking' && <Sparkles className="w-4 h-4 text-white" />}
            {state === 'celebrating' && <Star className="w-4 h-4 text-white animate-spin" />}
            {state === 'working' && <Zap className="w-4 h-4 text-white" />}
            {state === 'confident' && <Crown className="w-4 h-4 text-white" />}
            {state === 'dancing' && <TrendingUp className="w-4 h-4 text-white" />}
          </motion.div>
        </animated.div>

        {/* Globo de diálogo */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 20 }}
              transition={{ type: 'spring', damping: 15 }}
              className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-800 text-white px-4 py-2 rounded-2xl shadow-2xl whitespace-nowrap"
              style={{
                border: `2px solid ${colors.secondary}`,
                boxShadow: `0 0 20px ${colors.accent}50`,
              }}
            >
              <div className="text-sm font-bold">{message}</div>

              {/* Punta del globo */}
              <div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: `8px solid ${colors.primary}`,
                }}
              />

              {/* Brillo del globo */}
              <motion.div
                className="absolute inset-0 bg-white rounded-2xl"
                initial={{ opacity: 0.3, x: '-100%' }}
                animate={{ opacity: [0.3, 0.6, 0.3], x: ['100%', '100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  mixBlendMode: 'overlay',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botones de acción rápida (hover) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute -right-12 top-1/2 transform -translate-y-1/2 flex flex-col gap-2"
            >
              <motion.button
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  changeState('celebrating');
                }}
                className="p-2 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-full shadow-lg"
                title="Celebrar"
              >
                <Crown className="w-4 h-4 text-white" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.2, rotate: -10 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  changeState('thinking');
                }}
                className="p-2 bg-gradient-to-r from-zinc-800 to-blue-600 rounded-full shadow-lg"
                title="Pensar"
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSpeaking(!isSpeaking);
                }}
                className="p-2 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-full shadow-lg"
                title="Hablar"
              >
                <MessageCircle className="w-4 h-4 text-white" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Sistema de partículas */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 1 }}
            animate={{
              opacity: particle.life,
              x: particle.x,
              y: particle.y,
            }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              backgroundColor: particle.color,
              boxShadow: `0 0 10px ${particle.color}`,
              pointerEvents: 'none',
              zIndex: 9998,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Estilos globales */}
      <style jsx>{`
        .buchona-character {
          filter: drop-shadow(0 10px 30px rgba(255, 20, 147, 0.3));
          transition: filter 0.3s ease;
        }

        .buchona-character:hover {
          filter: drop-shadow(0 15px 40px rgba(255, 20, 147, 0.5));
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </>
  );
};

export default BuchonaAssistant;
