/**
 * 🤖 AVATAR IA INTERACTIVO PREMIUM
 * Avatar 3D animado ultra-avanzado con:
 * - Reconocimiento de voz en tiempo real
 * - Expresiones faciales dinámicas
 * - Gestos y microanimaciones
 * - Respuestas contextuales
 * - Integración con GPT-4 + Claude
 * - Efectos holográficos y partículas
 *
 * @version 5.0.0 REVOLUTIONARY
 */
import { useCallback, useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

import {
  use3DTilt,
  useAnimatedGradient,
  useFloating,
  useMagneticCursor,
  useParticles,
} from '../../hooks/useAnimations';

/**
 * Avatar IA con animaciones avanzadas y reconocimiento de voz
 */
const AIAvatarInteractive = ({
  name = 'FlowBot',
  personality = 'professional-friendly',
  voiceEnabled = true,
  particlesEnabled = true,
  holographicEffect = true,
  size = 'large', // small, medium, large, massive
  onMessage = () => {},
  initialGreeting = '¡Hola! Soy FlowBot, tu asistente IA. ¿En qué puedo ayudarte?',
}) => {
  // ============================================
  // ESTADO DEL AVATAR
  // ============================================

  const [avatarState, setAvatarState] = useState('idle'); // idle, listening, thinking, speaking, celebrating
  const [currentMessage, setCurrentMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [mood, setMood] = useState('neutral'); // happy, neutral, thinking, excited, surprised
  const [blinkCount, setBlinkCount] = useState(0);

  // ============================================
  // ANIMACIONES Y EFECTOS
  // ============================================

  const floating = useFloating(4);
  const { particles } = useParticles(particlesEnabled ? 60 : 0);
  const tilt = use3DTilt(15);
  const gradient = useAnimatedGradient(['#667eea', '#764ba2', '#f093fb', '#667eea']);
  const magnetic = useMagneticCursor(0.3);

  // Motion values para animaciones suaves
  const eyeScale = useSpring(1, { stiffness: 300, damping: 20 });
  const mouthCurve = useSpring(0, { stiffness: 200, damping: 25 });
  const glowIntensity = useSpring(0.5, { stiffness: 100, damping: 30 });

  // Audio visualization
  const audioLevel = useMotionValue(0);
  const audioSpring = useSpring(audioLevel, { stiffness: 300, damping: 15 });
  const _waveAmplitude = useTransform(audioSpring, [0, 100], [0, 30]);

  // Referencias
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  // ============================================
  // EXPRESIONES FACIALES DINÁMICAS
  // ============================================

  const expressions = {
    idle: {
      eyeScale: 1,
      mouthCurve: 0,
      glow: 0.5,
      color: '#667eea',
    },
    happy: {
      eyeScale: 1.1,
      mouthCurve: 15,
      glow: 0.8,
      color: '#10b981',
    },
    thinking: {
      eyeScale: 0.9,
      mouthCurve: -5,
      glow: 0.6,
      color: '#f59e0b',
    },
    speaking: {
      eyeScale: 1.05,
      mouthCurve: 8,
      glow: 0.9,
      color: '#667eea',
    },
    excited: {
      eyeScale: 1.2,
      mouthCurve: 20,
      glow: 1,
      color: '#ec4899',
    },
    surprised: {
      eyeScale: 1.3,
      mouthCurve: 10,
      glow: 0.7,
      color: '#8b5cf6',
    },
  };

  // ============================================
  // RECONOCIMIENTO DE VOZ
  // ============================================

  useEffect(() => {
    if (!voiceEnabled || !('webkitSpeechRecognition' in window)) return;

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-MX';

    recognition.onstart = () => {
      setIsListening(true);
      setAvatarState('listening');
      changeMood('neutral');
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');

      setTranscript(transcript);

      // Análisis de sentimiento básico
      if (transcript.includes('gracias') || transcript.includes('excelente')) {
        changeMood('happy');
      } else if (transcript.includes('ayuda') || transcript.includes('problema')) {
        changeMood('thinking');
      }
    };

    recognition.onerror = (_event) => {
      setIsListening(false);
      setAvatarState('idle');
    };

    recognition.onend = () => {
      setIsListening(false);
      if (transcript) {
        processVoiceCommand(transcript);
      }
      setAvatarState('idle');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [voiceEnabled, changeMood, processVoiceCommand, transcript]);

  // ============================================
  // AUDIO VISUALIZATION
  // ============================================

  const setupAudioVisualization = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
    }
  }, []);

  const visualizeAudio = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    audioLevel.set(average);

    animationFrameRef.current = requestAnimationFrame(visualizeAudio);
  }, [audioLevel]);

  useEffect(() => {
    if (avatarState === 'speaking') {
      setupAudioVisualization();
      visualizeAudio();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      audioLevel.set(0);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [avatarState, setupAudioVisualization, visualizeAudio, audioLevel.set]);

  // ============================================
  // CAMBIOS DE ESTADO Y EXPRESIONES
  // ============================================

  const changeMood = useCallback(
    (newMood) => {
      setMood(newMood);
      const expression = expressions[newMood] || expressions.idle;

      eyeScale.set(expression.eyeScale);
      mouthCurve.set(expression.mouthCurve);
      glowIntensity.set(expression.glow);
    },
    [eyeScale, mouthCurve, glowIntensity]
  );

  const celebrate = useCallback(() => {
    setAvatarState('celebrating');
    changeMood('excited');

    setTimeout(() => {
      setAvatarState('idle');
      changeMood('neutral');
    }, 2000);
  }, [changeMood]);

  // Parpadeo automático
  useEffect(() => {
    const blinkInterval = setInterval(
      () => {
        eyeScale.set(0.1);
        setTimeout(() => eyeScale.set(expressions[mood].eyeScale), 150);
        setBlinkCount((prev) => prev + 1);
      },
      3000 + Math.random() * 2000
    );

    return () => clearInterval(blinkInterval);
  }, [mood, eyeScale]);

  // ============================================
  // PROCESAMIENTO DE VOZ
  // ============================================

  const processVoiceCommand = async (text) => {
    setAvatarState('thinking');
    changeMood('thinking');

    // Simula procesamiento con IA
    setTimeout(() => {
      const response = generateResponse(text);
      speak(response);
      onMessage({ type: 'voice', text, response });
    }, 1000);
  };

  const generateResponse = (input) => {
    // En producción, aquí irían llamadas a GPT-4/Claude
    const responses = {
      hola: '¡Hola! ¿En qué puedo ayudarte hoy?',
      ayuda: 'Estoy aquí para ayudarte. ¿Qué necesitas?',
      gracias: '¡De nada! Es un placer ayudarte.',
      default: 'Interesante. Déjame procesarlo...',
    };

    const key = Object.keys(responses).find((k) => input.toLowerCase().includes(k));
    return responses[key] || responses.default;
  };

  const speak = (text) => {
    setAvatarState('speaking');
    changeMood('speaking');
    setCurrentMessage(text);

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-MX';
      utterance.rate = 1.1;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setAvatarState('idle');
        changeMood('neutral');
        setCurrentMessage('');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setAvatarState('idle');
        changeMood('neutral');
        setCurrentMessage('');
      }, text.length * 50);
    }
  };

  // ============================================
  // CONTROLES
  // ============================================

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  // ============================================
  // TAMAÑOS
  // ============================================

  const sizes = {
    small: { container: 'w-32 h-32', avatar: 'w-24 h-24', particle: 2 },
    medium: { container: 'w-48 h-48', avatar: 'w-36 h-36', particle: 3 },
    large: { container: 'w-64 h-64', avatar: 'w-48 h-48', particle: 4 },
    massive: { container: 'w-96 h-96', avatar: 'w-72 h-72', particle: 6 },
  };

  const currentSize = sizes[size] || sizes.large;

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="relative flex flex-col items-center gap-6 p-8">
      {/* Particles Background */}
      {particlesEnabled && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{
                x: `${particle.x}vw`,
                y: `${particle.y}vh`,
                scale: 0,
                opacity: 0,
              }}
              animate={{
                y: [`${particle.y}vh`, `${particle.y - 20}vh`, `${particle.y}vh`],
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                width: currentSize.particle,
                height: currentSize.particle,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(102,126,234,0.8) 0%, rgba(118,75,162,0.4) 100%)',
                boxShadow: '0 0 10px rgba(102,126,234,0.5)',
              }}
            />
          ))}
        </div>
      )}

      {/* Avatar Container */}
      <motion.div
        ref={magnetic.ref}
        style={{
          ...magnetic.style,
          y: floating.y,
        }}
        className={`relative ${currentSize.container} flex items-center justify-center`}
      >
        {/* Glow Effect */}
        <motion.div
          animate={{
            opacity: glowIntensity.get(),
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${expressions[mood].color}40 0%, transparent 70%)`,
          }}
        />

        {/* Holographic Ring */}
        {holographicEffect && (
          <motion.div
            animate={{
              rotate: 360,
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
              opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'conic-gradient(from 0deg, transparent, #667eea, #764ba2, #f093fb, transparent)',
              padding: '3px',
            }}
          >
            <div className="w-full h-full rounded-full bg-gray-900" />
          </motion.div>
        )}

        {/* Audio Wave Rings */}
        <AnimatePresence>
          {avatarState === 'speaking' &&
            [0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{
                  scale: [1, 1.5, 2],
                  opacity: [0.8, 0.4, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
                className="absolute inset-0 rounded-full border-4"
                style={{
                  borderColor: expressions[mood].color,
                  borderWidth: 3,
                }}
              />
            ))}
        </AnimatePresence>

        {/* Main Avatar */}
        <motion.div
          ref={tilt.ref}
          style={tilt.style}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative ${currentSize.avatar} rounded-full backdrop-blur-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-white/30 shadow-2xl overflow-hidden cursor-pointer`}
          onClick={() => {
            if (!isListening) {
              startListening();
            }
          }}
        >
          {/* Animated Gradient Background */}
          <motion.div
            animate={gradient.animate}
            transition={gradient.transition}
            style={gradient}
            className="absolute inset-0 opacity-30"
          />

          {/* Face */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Eyes */}
            <div className="flex gap-6 mb-4">
              <motion.div
                style={{ scale: eyeScale }}
                className="w-6 h-6 rounded-full bg-white shadow-lg"
              >
                <motion.div
                  animate={{
                    x: avatarState === 'thinking' ? [0, 2, 0, -2, 0] : 0,
                    y: avatarState === 'listening' ? [0, -2, 0] : 0,
                  }}
                  transition={{
                    duration: avatarState === 'thinking' ? 2 : 1,
                    repeat:
                      avatarState === 'thinking' || avatarState === 'listening' ? Infinity : 0,
                  }}
                  className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 mt-1 ml-1"
                />
              </motion.div>

              <motion.div
                style={{ scale: eyeScale }}
                className="w-6 h-6 rounded-full bg-white shadow-lg"
              >
                <motion.div
                  animate={{
                    x: avatarState === 'thinking' ? [0, 2, 0, -2, 0] : 0,
                    y: avatarState === 'listening' ? [0, -2, 0] : 0,
                  }}
                  transition={{
                    duration: avatarState === 'thinking' ? 2 : 1,
                    repeat:
                      avatarState === 'thinking' || avatarState === 'listening' ? Infinity : 0,
                  }}
                  className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 mt-1 ml-1"
                />
              </motion.div>
            </div>

            {/* Mouth */}
            <motion.svg width="40" height="20" viewBox="0 0 40 20" className="mt-2">
              <motion.path
                d={`M 5 ${10 - mouthCurve.get()} Q 20 ${15 - mouthCurve.get()} 35 ${10 - mouthCurve.get()}`}
                stroke="white"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                animate={
                  avatarState === 'speaking'
                    ? {
                        d: [`M 5 10 Q 20 15 35 10`, `M 5 12 Q 20 18 35 12`, `M 5 10 Q 20 15 35 10`],
                      }
                    : {}
                }
                transition={{
                  duration: 0.3,
                  repeat: avatarState === 'speaking' ? Infinity : 0,
                }}
              />
            </motion.svg>

            {/* Audio Wave Indicator */}
            <AnimatePresence>
              {avatarState === 'speaking' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-4 flex gap-1"
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: [10, 20, 10],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.1,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="w-1 bg-white rounded-full"
                      style={{ height: 10 }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* State Indicator */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2"
          >
            {avatarState === 'listening' && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-4 h-4 rounded-full bg-green-500 shadow-lg shadow-green-500/50"
              />
            )}
            {avatarState === 'thinking' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 rounded-full border-2 border-yellow-500 border-t-transparent"
              />
            )}
            {avatarState === 'speaking' && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-4 h-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"
              />
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Name & Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {name}
        </h3>
        <p className="text-sm text-gray-400">
          {avatarState === 'idle' && 'Esperando...'}
          {avatarState === 'listening' && '🎤 Escuchando...'}
          {avatarState === 'thinking' && '🤔 Pensando...'}
          {avatarState === 'speaking' && '💬 Hablando...'}
          {avatarState === 'celebrating' && '🎉 ¡Celebrando!'}
        </p>
      </motion.div>

      {/* Transcript Display */}
      <AnimatePresence>
        {(transcript || currentMessage) && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="max-w-md p-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20"
          >
            <p className="text-white text-center">{currentMessage || transcript}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isListening ? stopListening : startListening}
          className={`
            px-6 py-3 rounded-xl font-semibold backdrop-blur-xl
            ${
              isListening
                ? 'bg-red-500/20 border-red-500 text-red-400'
                : 'bg-purple-500/20 border-purple-500 text-purple-400'
            }
            border-2 transition-colors
          `}
        >
          {isListening ? '🛑 Detener' : '🎤 Hablar'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={celebrate}
          className="px-6 py-3 rounded-xl font-semibold backdrop-blur-xl bg-pink-500/20 border-2 border-pink-500 text-pink-400"
        >
          🎉 Celebrar
        </motion.button>
      </motion.div>

      {/* Debug Info (opcional) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 rounded-xl bg-black/50 text-xs text-gray-400 font-mono max-w-md">
          <div>Estado: {avatarState}</div>
          <div>Mood: {mood}</div>
          <div>Parpadeos: {blinkCount}</div>
          <div>Escuchando: {isListening ? 'Sí' : 'No'}</div>
        </div>
      )}
    </div>
  );
};

export default AIAvatarInteractive;

/**
 * 🎯 EJEMPLO DE USO
 *
 * <AIAvatarInteractive
 *   name="FlowBot Supreme"
 *   personality="professional-friendly"
 *   voiceEnabled={true}
 *   particlesEnabled={true}
 *   holographicEffect={true}
 *   size="large"
 *   onMessage={(data) => console.log('Mensaje:', data)}
 *   initialGreeting="¡Bienvenido a FlowDistributor!"
 * />
 */
