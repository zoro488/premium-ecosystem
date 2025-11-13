/**
 * 👑 Buchona AI Character - Personaje Animado Estilo Buchona
 *
 * Características:
 * - Estética buchona/narco-chic mexicana
 * - Animaciones micro-interactivas
 * - Transiciones suaves con física realista
 * - Efectos de profundidad 2.5D
 * - Reacciones a cada acción del usuario
 * - Widget flotante integrado
 *
 * @version 1.0.0
 */
import React, { useEffect, useRef, useState } from 'react';

import { animated, config, useSpring } from '@react-spring/web';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import {
  Award,
  Coffee,
  Crown,
  Flame,
  Heart,
  MessageCircle,
  Rocket,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';

interface BuchonaState {
  mood: 'idle' | 'thinking' | 'excited' | 'working' | 'celebrating' | 'confident';
  action: string;
  message: string;
}

interface Position {
  x: number;
  y: number;
}

const MOODS = {
  idle: {
    color: '#C084FC',
    glow: '#A855F7',
    animation: 'float',
    expression: '😎',
    phrase: '¿Qué onda, jefe?',
  },
  thinking: {
    color: '#60A5FA',
    glow: '#3B82F6',
    animation: 'pulse',
    expression: '🤔',
    phrase: 'Déjame pensar...',
  },
  excited: {
    color: '#F472B6',
    glow: '#EC4899',
    animation: 'bounce',
    expression: '🤩',
    phrase: '¡Órale! ¡Qué chido!',
  },
  working: {
    color: '#FBBF24',
    glow: '#F59E0B',
    animation: 'spin',
    expression: '💪',
    phrase: 'Al tiro, compa',
  },
  celebrating: {
    color: '#34D399',
    glow: '#10B981',
    animation: 'celebrate',
    expression: '🎉',
    phrase: '¡Chingón! Lo logramos',
  },
  confident: {
    color: '#F59E0B',
    glow: '#D97706',
    animation: 'confident',
    expression: '😏',
    phrase: 'Ya sabes quién manda',
  },
};

export default function BuchonaAICharacter() {
  const [state, setState] = useState<BuchonaState>({
    mood: 'idle',
    action: 'waiting',
    message: MOODS.idle.phrase,
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<Position>({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [clicks, setClicks] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const particleIdRef = useRef(0);

  // Animación de respiración/flotación
  const floatAnimation = useSpring({
    from: { transform: 'translateY(0px) scale(1)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'translateY(-20px) scale(1.05)' });
        await next({ transform: 'translateY(0px) scale(1)' });
      }
    },
    config: config.slow,
  });

  // Animación de brillo (glow pulsante)
  const glowAnimation = useSpring({
    from: { opacity: 0.5, scale: 1 },
    to: async (next) => {
      while (true) {
        await next({ opacity: 1, scale: 1.2 });
        await next({ opacity: 0.5, scale: 1 });
      }
    },
    config: config.molasses,
  });

  // Posición del personaje
  const [springProps, springApi] = useSpring(() => ({
    x: dragPosition.x,
    y: dragPosition.y,
    scale: 1,
    rotate: 0,
    config: config.wobbly,
  }));

  // Cambiar mood aleatorio cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered && !isDragging && state.mood === 'idle') {
        const moods: Array<keyof typeof MOODS> = ['idle', 'confident'];
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        changeMood(randomMood);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isHovered, isDragging, state.mood]);

  // Mostrar mensaje aleatorio
  useEffect(() => {
    if (showSpeechBubble) {
      const timeout = setTimeout(() => {
        setShowSpeechBubble(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [showSpeechBubble]);

  const changeMood = (mood: keyof typeof MOODS) => {
    setState((prev) => ({
      ...prev,
      mood,
      message: MOODS[mood].phrase,
    }));
    setShowSpeechBubble(true);
    createParticleBurst();
  };

  const createParticleBurst = () => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: particleIdRef.current++,
      x: Math.cos((i * Math.PI * 2) / 8) * 60,
      y: Math.sin((i * Math.PI * 2) / 8) * 60,
    }));
    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 1000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setClicks((prev) => prev + 1);

    // Easter egg: múltiples clicks
    if (clicks >= 4) {
      changeMood('celebrating');
      setClicks(0);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - window.innerWidth + 200;
      const newY = e.clientY - window.innerHeight + 200;
      setDragPosition({ x: newX, y: newY });
      springApi.start({ x: newX, y: newY, rotate: newX * 0.05 });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      springApi.start({ rotate: 0, scale: 1 });
      changeMood('confident');
    }
  };

  const handleClick = () => {
    if (!isDragging) {
      const moods: Array<keyof typeof MOODS> = ['excited', 'confident', 'celebrating'];
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      changeMood(randomMood);

      springApi.start({
        scale: 1.2,
        config: config.wobbly,
        onRest: () => springApi.start({ scale: 1 }),
      });
    }
  };

  const currentMood = MOODS[state.mood];

  return (
    <animated.div
      ref={containerRef}
      style={{
        ...springProps,
        position: 'fixed',
        bottom: 100,
        right: 100,
        zIndex: 9999,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="select-none"
    >
      {/* Partículas */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: particle.x,
              y: particle.y,
              opacity: 0,
              scale: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{
              width: 8,
              height: 8,
              background: currentMood.glow,
              borderRadius: '50%',
              boxShadow: `0 0 20px ${currentMood.glow}`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Speech Bubble */}
      <AnimatePresence>
        {showSpeechBubble && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-20 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <div
              className="relative px-4 py-2 rounded-2xl font-bold text-sm shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${currentMood.color}, ${currentMood.glow})`,
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {state.message}
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
                style={{
                  background: currentMood.glow,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Personaje Principal */}
      <animated.div style={floatAnimation} className="relative">
        {/* Sombra */}
        <motion.div
          animate={{
            scale: isHovered ? 1.2 : 1,
            opacity: isHovered ? 0.4 : 0.2,
          }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-8 rounded-full blur-xl"
          style={{
            background: currentMood.glow,
          }}
        />

        {/* Glow Ring */}
        <animated.div
          style={glowAnimation}
          className="absolute inset-0 -m-4 rounded-full blur-2xl pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${currentMood.glow}40, transparent)`,
          }}
        />

        {/* Cuerpo del Personaje */}
        <motion.div
          animate={{
            scale: isHovered ? 1.1 : 1,
          }}
          className="relative w-32 h-32 rounded-full overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${currentMood.color}, ${currentMood.glow})`,
            boxShadow: `0 20px 60px ${currentMood.glow}60, inset 0 -5px 20px rgba(0,0,0,0.3)`,
            border: '4px solid rgba(255,255,255,0.2)',
          }}
        >
          {/* Detalles 3D - Capas de profundidad */}
          <div className="absolute inset-0">
            {/* Capa 1: Background gradient */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent)`,
              }}
            />

            {/* Capa 2: Cabello/Sombrero buchón */}
            <motion.div
              animate={{
                rotate: isHovered ? [0, -5, 5, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
              className="absolute -top-6 left-1/2 -translate-x-1/2 w-28 h-16 rounded-t-full"
              style={{
                background: 'linear-gradient(135deg, #1F2937, #374151)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                border: '2px solid #F59E0B',
              }}
            >
              {/* Corona buchona */}
              <Crown className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 text-yellow-400 drop-shadow-2xl" />
            </motion.div>

            {/* Capa 3: Cara */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-amber-200 to-amber-300">
              {/* Gafas de sol */}
              <motion.div
                animate={{
                  y: isHovered ? [0, -2, 0] : 0,
                }}
                className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-6 rounded-lg bg-gradient-to-r from-gray-900 to-black"
                style={{
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  border: '1px solid #F59E0B',
                }}
              >
                <div className="absolute inset-0 flex">
                  <div className="flex-1 bg-gradient-to-br from-purple-900/50 to-black rounded-l-lg" />
                  <div className="w-1 bg-yellow-400" />
                  <div className="flex-1 bg-gradient-to-br from-purple-900/50 to-black rounded-r-lg" />
                </div>
              </motion.div>

              {/* Aretes de diamante */}
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute -left-2 top-8"
              >
                <Sparkles className="w-4 h-4 text-pink-400 drop-shadow-lg" />
              </motion.div>
              <motion.div
                animate={{
                  rotate: -360,
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute -right-2 top-8"
              >
                <Sparkles className="w-4 h-4 text-pink-400 drop-shadow-lg" />
              </motion.div>

              {/* Boca */}
              <motion.div
                animate={{
                  scaleX: isHovered ? 1.2 : 1,
                }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full bg-gradient-to-r from-pink-500 to-red-500"
              />
            </div>

            {/* Capa 4: Outfit buchón (chaleco táctico glam) */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-16 rounded-b-3xl bg-gradient-to-br from-gray-900 to-black">
              {/* Detalles dorados */}
              <div className="absolute inset-0 border-2 border-yellow-400/30 rounded-b-3xl" />

              {/* Cadena de oro */}
              <motion.div
                animate={{
                  y: isHovered ? [0, 2, 0] : 0,
                }}
                transition={{ duration: 0.5 }}
                className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-3 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400"
                style={{
                  boxShadow: '0 2px 8px rgba(251, 191, 36, 0.6)',
                }}
              />

              {/* Bolsillos tácticos */}
              <div className="absolute bottom-2 left-2 w-4 h-4 bg-gray-700 rounded border border-yellow-400/50" />
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-gray-700 rounded border border-yellow-400/50" />
            </div>

            {/* Capa 5: Accesorios flotantes */}
            <AnimatePresence>
              {isHovered && (
                <>
                  {/* Estrella izquierda */}
                  <motion.div
                    initial={{ opacity: 0, x: 0, rotate: 0 }}
                    animate={{ opacity: 1, x: -40, rotate: 180 }}
                    exit={{ opacity: 0, x: 0, rotate: 0 }}
                    className="absolute top-1/2 left-0"
                  >
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
                  </motion.div>

                  {/* Fuego derecha */}
                  <motion.div
                    initial={{ opacity: 0, x: 0, rotate: 0 }}
                    animate={{ opacity: 1, x: 40, rotate: -180 }}
                    exit={{ opacity: 0, x: 0, rotate: 0 }}
                    className="absolute top-1/2 right-0"
                  >
                    <Flame className="w-6 h-6 text-orange-400 drop-shadow-lg" />
                  </motion.div>

                  {/* Rayo arriba */}
                  <motion.div
                    initial={{ opacity: 0, y: 0, scale: 0 }}
                    animate={{ opacity: 1, y: -40, scale: 1 }}
                    exit={{ opacity: 0, y: 0, scale: 0 }}
                    className="absolute top-0 left-1/2 -translate-x-1/2"
                  >
                    <Zap className="w-6 h-6 text-purple-400 fill-purple-400 drop-shadow-lg" />
                  </motion.div>

                  {/* Corazón abajo */}
                  <motion.div
                    initial={{ opacity: 0, y: 0, scale: 0 }}
                    animate={{ opacity: 1, y: 40, scale: 1 }}
                    exit={{ opacity: 0, y: 0, scale: 0 }}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2"
                  >
                    <Heart className="w-6 h-6 text-pink-400 fill-pink-400 drop-shadow-lg" />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Emoji de expresión superpuesto */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="absolute inset-0 flex items-center justify-center text-6xl pointer-events-none opacity-20"
          >
            {currentMood.expression}
          </motion.div>
        </motion.div>

        {/* Badge de estado */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${currentMood.color}, ${currentMood.glow})`,
            boxShadow: `0 4px 20px ${currentMood.glow}`,
            border: '3px solid rgba(255,255,255,0.3)',
          }}
        >
          {state.mood === 'working' && <Rocket className="w-5 h-5 text-white" />}
          {state.mood === 'thinking' && <MessageCircle className="w-5 h-5 text-white" />}
          {state.mood === 'celebrating' && <Award className="w-5 h-5 text-white" />}
          {state.mood === 'confident' && <Target className="w-5 h-5 text-white" />}
          {state.mood === 'excited' && <TrendingUp className="w-5 h-5 text-white" />}
          {state.mood === 'idle' && <Coffee className="w-5 h-5 text-white" />}
        </motion.div>

        {/* Indicador de interactividad */}
        {!isDragging && (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute -top-6 -right-6 w-4 h-4 rounded-full bg-green-400"
            style={{
              boxShadow: '0 0 20px #4ADE80',
            }}
          />
        )}
      </animated.div>

      {/* Tooltip de ayuda */}
      <AnimatePresence>
        {isHovered && !showSpeechBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <div className="px-3 py-1 bg-black/80 text-white text-xs rounded-lg backdrop-blur">
              Clic para interactuar • Arrastra para mover
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </animated.div>
  );
}
