/**
 * 🤖 HOLOGRAPHIC AI ASSISTANT
 * Asistente flotante premium con ojos holográficos 3D animados
 * Diseño superior y moderno con efectos de partículas
 */
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Maximize2,
  MessageCircle,
  Minimize2,
  Sparkles,
  TrendingUp,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react';

/**
 * Componente de ojos holográficos 3D
 */
const HolographicEyes = ({ mood = 'neutral', isAnimating = false }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Parpadeo aleatorio
    const blinkInterval = setInterval(
      () => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      },
      Math.random() * 5000 + 3000
    );

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(blinkInterval);
    };
  }, []);

  // Colores según el mood
  const moodColors = {
    neutral: 'from-cyan-400 via-blue-500 to-purple-600',
    happy: 'from-green-400 via-emerald-500 to-teal-600',
    thinking: 'from-amber-400 via-orange-500 to-yellow-600',
    alert: 'from-red-400 via-rose-500 to-pink-600',
    analyzing: 'from-purple-400 via-fuchsia-500 to-pink-600',
  };

  const currentGradient = moodColors[mood] || moodColors.neutral;

  return (
    <div className="relative w-32 h-16 flex items-center justify-center gap-4">
      {/* Resplandor de fondo */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${currentGradient} blur-3xl opacity-40`}
        animate={{
          scale: isAnimating ? [1, 1.2, 1] : 1,
          opacity: isAnimating ? [0.4, 0.6, 0.4] : 0.4,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Ojo Izquierdo */}
      <motion.div
        className="relative"
        animate={{
          x: mousePos.x,
          y: mousePos.y,
          scaleY: isBlinking ? 0.1 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Contenedor del ojo */}
        <div className="relative w-12 h-12">
          {/* Glow exterior */}
          <motion.div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${currentGradient} blur-xl`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Ojo exterior */}
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${currentGradient} opacity-30`}
          />

          {/* Ojo medio */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm" />

          {/* Pupila */}
          <motion.div
            className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 shadow-[0_0_20px_rgba(59,130,246,0.8)]"
            animate={{
              scale: isAnimating ? [1, 0.9, 1] : 1,
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            {/* Reflejo */}
            <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/80" />
          </motion.div>

          {/* Partículas orbitando */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${currentGradient}`}
              animate={{
                x: [0, 20, 0, -20, 0],
                y: [0, -20, 0, 20, 0],
                opacity: [0, 1, 1, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 1,
                ease: 'linear',
              }}
              style={{
                left: '50%',
                top: '50%',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Ojo Derecho */}
      <motion.div
        className="relative"
        animate={{
          x: mousePos.x,
          y: mousePos.y,
          scaleY: isBlinking ? 0.1 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Contenedor del ojo */}
        <div className="relative w-12 h-12">
          {/* Glow exterior */}
          <motion.div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${currentGradient} blur-xl`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          />

          {/* Ojo exterior */}
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${currentGradient} opacity-30`}
          />

          {/* Ojo medio */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm" />

          {/* Pupila */}
          <motion.div
            className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 shadow-[0_0_20px_rgba(59,130,246,0.8)]"
            animate={{
              scale: isAnimating ? [1, 0.9, 1] : 1,
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              repeatDelay: 3,
              delay: 0.15,
            }}
          >
            {/* Reflejo */}
            <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/80" />
          </motion.div>

          {/* Partículas orbitando */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`right-particle-${i}`}
              className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${currentGradient}`}
              animate={{
                x: [0, -20, 0, 20, 0],
                y: [0, 20, 0, -20, 0],
                opacity: [0, 1, 1, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 1,
                ease: 'linear',
              }}
              style={{
                left: '50%',
                top: '50%',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Líneas de conexión holográficas */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.line
          x1="35%"
          y1="50%"
          x2="65%"
          y2="50%"
          stroke="url(#lineGradient)"
          strokeWidth="1"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <defs>
          <linearGradient id="lineGradient">
            <stop offset="0%" stopColor="rgba(59,130,246,0)" />
            <stop offset="50%" stopColor="rgba(59,130,246,0.8)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

/**
 * Componente principal del asistente holográfico
 */
export const HolographicAIAssistant = ({
  position = 'bottom-right',
  onNavigate: _onNavigate,
  currentView: _currentView,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mood, setMood] = useState('neutral');
  const [isAnimating, setIsAnimating] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  // Sugerencias inteligentes basadas en la vista actual
  const suggestions = [
    { icon: TrendingUp, text: 'Analizar tendencias', action: 'analyze' },
    { icon: Zap, text: 'Optimizar flujo', action: 'optimize' },
    { icon: AlertCircle, text: 'Ver alertas', action: 'alerts' },
    { icon: Sparkles, text: 'Sugerencias IA', action: 'suggestions' },
  ];

  // Animación de "pensamiento"
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  // Posicionamiento
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    setMessages([...messages, { text: inputValue, sender: 'user' }]);
    setInputValue('');
    setIsAnimating(true);
    setMood('thinking');

    // Simular respuesta de IA
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: `Analizando: "${inputValue}". Procesando datos...`,
          sender: 'ai',
        },
      ]);
      setMood('neutral');
    }, 2000);
  };

  const handleSuggestion = (action) => {
    setIsAnimating(true);
    setMood('analyzing');

    setTimeout(() => {
      setMood('happy');
      setMessages((prev) => [
        ...prev,
        {
          text: `Ejecutando acción: ${action}`,
          sender: 'ai',
        },
      ]);
    }, 1500);
  };

  return (
    <>
      {/* Botón flotante del asistente */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className={`fixed ${positionClasses[position]} z-50`}
          >
            <div className="relative">
              {/* Resplandor animado */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Contenedor del asistente */}
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-white/20 flex items-center justify-center overflow-hidden">
                <HolographicEyes mood="neutral" isAnimating={false} />

                {/* Anillo de pulso */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-cyan-500/50"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              </div>

              {/* Indicador de notificaciones */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-lg"
              >
                3
              </motion.div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel del asistente */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed ${positionClasses[position]} z-50 ${isMinimized ? 'w-80' : 'w-96'} ${isMinimized ? 'h-20' : 'h-[600px]'}`}
          >
            <div className="h-full rounded-2xl backdrop-blur-2xl bg-gradient-to-br from-gray-900/95 to-black/95 border border-white/20 shadow-2xl flex flex-col overflow-hidden">
              {/* Header */}
              <div className="relative p-4 border-b border-white/10">
                {/* Fondo animado */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-600/10"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Ojos holográficos minimizados */}
                    <div className="scale-50 origin-left">
                      <HolographicEyes mood={mood} isAnimating={isAnimating} />
                    </div>

                    {!isMinimized && (
                      <div>
                        <h3 className="text-white font-bold text-lg">FlowAI Assistant</h3>
                        <p className="text-white/60 text-xs">
                          {isAnimating ? 'Pensando...' : 'Listo para ayudar'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-white/60" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-white/60" />
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {isMinimized ? (
                        <Maximize2 className="w-4 h-4 text-white/60" />
                      ) : (
                        <Minimize2 className="w-4 h-4 text-white/60" />
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-white/60" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Content */}
              {!isMinimized && (
                <>
                  {/* Sugerencias rápidas */}
                  <div className="p-4 border-b border-white/10">
                    <p className="text-white/60 text-xs mb-3">Acciones rápidas:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {suggestions.map((suggestion) => {
                        const Icon = suggestion.icon;
                        return (
                          <motion.button
                            key={suggestion.action}
                            onClick={() => handleSuggestion(suggestion.action)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                          >
                            <Icon className="w-4 h-4 text-cyan-400" />
                            <span className="text-white text-xs font-medium">
                              {suggestion.text}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.length === 0 ? (
                      <div className="text-center text-white/40 text-sm mt-8">
                        <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>¿En qué puedo ayudarte hoy?</p>
                      </div>
                    ) : (
                      messages.map((message, index) => (
                        <motion.div
                          key={`msg-${index}-${message.text.substring(0, 10)}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.sender === 'user'
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                                : 'bg-white/10 text-white'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Escribe tu pregunta..."
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                      >
                        <MessageCircle className="w-5 h-5 text-white" />
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HolographicAIAssistant;
