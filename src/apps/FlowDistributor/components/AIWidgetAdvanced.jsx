/**
 * 🤖 AI WIDGET ULTRA INTERACTIVO CON VIDEO ADOBE
 * Widget IA con video animado, capacidades de voz y ultra reactivo
 * Features:
 * - Video background interactivo con efectos glitch
 * - Speech-to-text, Text-to-speech
 * - Animaciones sincronizadas con el video
 * - Efectos visuales reactivos al hablar/escuchar
 * - Partículas y distorsiones en tiempo real
 */
import { useCallback, useEffect, useRef, useState } from 'react';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import {
  Bot,
  Mic,
  MicOff,
  Minimize2,
  Send,
  Settings,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react';
import PropTypes from 'prop-types';

const AIWidgetAdvanced = ({ onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [videoIntensity, setVideoIntensity] = useState(0.3);
  const [glitchActive, setGlitchActive] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);

  // Refs
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const inputRef = useRef(null);
  const videoRef = useRef(null);

  // Motion values para animaciones reactivas
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const videoScale = useTransform(mouseX, [0, 400], [1, 1.1]);
  const videoRotate = useTransform(mouseX, [0, 400], [-2, 2]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in globalThis || 'SpeechRecognition' in globalThis) {
      const SpeechRecognition = globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');

        setInputValue(transcript);

        if (event.results[0].isFinal) {
          setIsListening(false);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize Speech Synthesis
    if ('speechSynthesis' in globalThis) {
      synthRef.current = globalThis.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Efectos reactivos del video cuando la IA habla o escucha
  useEffect(() => {
    if (isListening || isSpeaking) {
      setVideoIntensity(0.7);
      setGlitchActive(true);

      // Pulso del video
      const interval = setInterval(() => {
        if (videoRef.current) {
          videoRef.current.playbackRate = 1 + Math.random() * 0.3;
        }
      }, 200);

      return () => clearInterval(interval);
    } else {
      setVideoIntensity(0.3);
      setGlitchActive(false);
      if (videoRef.current) {
        videoRef.current.playbackRate = 1;
      }
    }
  }, [isListening, isSpeaking]);

  // Mouse tracking para video interactivo
  const handleMouseMove = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  // Voice input toggle
  const toggleVoiceInput = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  }, [isListening]);

  // Speak response
  const speakText = useCallback(
    (text) => {
      if (!voiceEnabled || !synthRef.current) return;

      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    },
    [voiceEnabled]
  );

  // AI Response generator (REAL - with Firebase analysis)
  const generateAIResponse = useCallback(async (userMessage) => {
    try {
      // Importar dinámicamente el motor de IA
      const { processAIQuery } = await import('../services/aiEngine.service');

      // Procesar consulta con análisis real de Firebase
      const result = await processAIQuery(userMessage);

      return result;
    } catch (error) {
      console.error('Error en AI Engine:', error);

      // Fallback a respuesta genérica en caso de error
      return {
        text: `⚠️ Hubo un problema al analizar tu consulta sobre "${userMessage}".\n\nPor favor intenta:\n• Reformular tu pregunta\n• Verificar conexión a Firebase\n• Contactar soporte si el problema persiste`,
        quickReplies: ['Reintentar', 'Ver ayuda', 'Verificar conexión'],
      };
    }
  }, []);

  // Send message (with REAL AI analysis)
  const handleSend = useCallback(async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Call REAL AI Engine with Firebase analysis
      const aiResponse = await generateAIResponse(userMessage.text);

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: aiResponse.text,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        quickReplies: aiResponse.quickReplies || [],
        data: aiResponse.data, // Include analysis data
        insights: aiResponse.insights, // Include AI insights
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);

      // Speak response if voice enabled
      if (voiceEnabled) {
        speakText(aiResponse.text);
      }
    } catch (error) {
      console.error('Error processing AI message:', error);

      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: '❌ Hubo un error al procesar tu mensaje. Por favor intenta nuevamente.',
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        quickReplies: ['Reintentar', 'Ver ayuda'],
      };

      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
    }
  }, [inputValue, generateAIResponse, voiceEnabled, speakText]);

  // Handle quick reply
  const handleQuickReply = useCallback(
    (reply) => {
      setInputValue(reply);
      setTimeout(() => handleSend(), 100);
    },
    [handleSend]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
        e.preventDefault();
        handleSend();
      }
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener('keypress', handleKeyPress);
      return () => inputElement.removeEventListener('keypress', handleKeyPress);
    }
  }, [inputValue, handleSend]);

  // Minimized state
  if (isMinimized) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 flex items-center justify-center shadow-2xl group"
      >
        <Bot className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {isSpeaking && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-green-400"
            animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{
        scale: 1,
        opacity: 1,
        y: 0,
        width: isExpanded ? '600px' : '400px',
        height: isExpanded ? '700px' : '550px',
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      onMouseMove={handleMouseMove}
      className="fixed bottom-6 right-6 z-50 rounded-3xl shadow-2xl flex flex-col overflow-hidden border-2 relative"
      style={{
        borderColor: isListening ? '#10b981' : isSpeaking ? '#06b6d4' : 'rgba(255,255,255,0.1)',
        boxShadow: isListening
          ? '0 0 40px rgba(16, 185, 129, 0.6), 0 0 80px rgba(16, 185, 129, 0.3)'
          : isSpeaking
            ? '0 0 40px rgba(6, 182, 212, 0.6), 0 0 80px rgba(6, 182, 212, 0.3)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* Video Ultra Interactivo de Fondo Adobe Stock */}
      <motion.div
        className="absolute inset-0 rounded-3xl overflow-hidden"
        style={{
          scale: videoScale,
          rotateY: videoRotate,
        }}
      >
        <motion.video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          animate={{
            opacity: videoIntensity,
            filter: glitchActive
              ? [
                  'hue-rotate(0deg) saturate(1.5)',
                  'hue-rotate(10deg) saturate(2)',
                  'hue-rotate(-10deg) saturate(1.8)',
                  'hue-rotate(0deg) saturate(1.5)',
                ]
              : 'hue-rotate(0deg) saturate(1)',
          }}
          transition={{
            filter: { duration: 0.3, repeat: glitchActive ? Infinity : 0 },
            opacity: { duration: 0.3 },
          }}
          style={{
            mixBlendMode: 'screen',
            transform: `scale(${1 + videoIntensity * 0.2})`,
          }}
        >
          <source src="/videos/ai-widget.mp4" type="video/mp4" />
        </motion.video>

        {/* Overlay con partículas cuando está activo */}
        {(isListening || isSpeaking) && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: isListening ? '#10b981' : '#06b6d4',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  y: [0, -50, -100],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Glitch effect overlay */}
        {glitchActive && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              opacity: [0, 0.3, 0],
              x: [-2, 2, -2],
            }}
            transition={{
              duration: 0.1,
              repeat: Infinity,
            }}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,0,255,0.1), transparent)',
              mixBlendMode: 'screen',
            }}
          />
        )}
      </motion.div>

      {/* Backdrop blur y gradiente */}
      <div
        className="absolute inset-0 backdrop-blur-sm z-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(30,20,60,0.7) 50%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Header con efectos Chronos */}
      <div
        className="relative text-white p-4 overflow-hidden z-10"
        style={{
          background: isListening
            ? 'linear-gradient(90deg, rgba(16,185,129,0.3), rgba(6,182,212,0.3))'
            : isSpeaking
              ? 'linear-gradient(90deg, rgba(6,182,212,0.3), rgba(139,92,246,0.3))'
              : 'linear-gradient(90deg, rgba(147,51,234,0.3), rgba(79,70,229,0.3))',
        }}
      >
        {/* Animated background overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        {/* Scanlines effect */}
        <div className="absolute inset-0 scanlines opacity-30" />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="relative"
              animate={{ rotate: isSpeaking ? 360 : 0 }}
              transition={{ duration: 2, repeat: isSpeaking ? Infinity : 0, ease: 'linear' }}
            >
              <Bot className="w-7 h-7" />
              {isSpeaking && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-green-400"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>

            <div>
              <h3 className="font-bold text-lg neon-glow-cyan">Flow AI Pro</h3>
              <div className="flex items-center gap-2 text-xs">
                <motion.div
                  className="w-2 h-2 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-green-200 font-medium">
                  {(() => {
                    if (isListening) return 'Escuchando...';
                    if (isSpeaking) return 'Hablando...';
                    return 'En línea';
                  })()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sound Wave Visualization cuando está hablando */}
            {isSpeaking && (
              <div className="flex items-center gap-1 mr-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-cyan-400 rounded-full"
                    animate={{
                      height: [8, 20, 8],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title={voiceEnabled ? 'Desactivar voz' : 'Activar voz'}
            >
              {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <Settings className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMinimized(true)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <Minimize2 className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gradient-to-b from-slate-900/50 to-slate-900/80">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col items-center justify-center text-center space-y-6"
          >
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotateY: [0, 180, 360],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="relative"
            >
              <Sparkles className="w-20 h-20 text-purple-400" />
              <motion.div
                className="absolute inset-0"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-20 h-20 text-blue-400" />
              </motion.div>
            </motion.div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white glitch-text">¡Hola! Soy Flow AI 👋</h3>
              <p className="text-slate-400 max-w-xs">
                Tu asistente inteligente con capacidades de voz y lenguaje natural
              </p>
            </div>

            {/* Quick Actions */}
            <div className="w-full space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="font-semibold">Acciones rápidas:</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: 'capital',
                    icon: '💰',
                    label: 'Capital',
                    query: '¿Cuál es mi capital total?',
                  },
                  {
                    id: 'ventas',
                    icon: '📊',
                    label: 'Ventas',
                    query: 'Muéstrame estadísticas de ventas',
                  },
                  {
                    id: 'inventario',
                    icon: '📦',
                    label: 'Inventario',
                    query: '¿Cómo está mi inventario?',
                  },
                  { id: 'ayuda', icon: '❓', label: 'Ayuda', query: '¿Qué puedes hacer?' },
                ].map((action, idx) => (
                  <motion.button
                    key={action.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickReply(action.query)}
                    className="p-3 glass-premium hover:bg-white/10 rounded-xl text-left transition-all group"
                  >
                    <div className="text-2xl mb-1">{action.icon}</div>
                    <div className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
                      {action.label}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Voice hint */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xs text-slate-500 flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full"
            >
              <Mic className="w-3 h-3 text-purple-400" />
              <span>Usa tu voz o escribe tu consulta</span>
            </motion.div>
          </motion.div>
        ) : (
          <>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: msg.type === 'user' ? 20 : -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${msg.type === 'ai' ? 'space-y-2' : ''}`}>
                  <div
                    className={`p-4 rounded-2xl ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-tr-sm shadow-lg'
                        : 'glass-premium text-white rounded-tl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line text-sm leading-relaxed">{msg.text}</p>
                    <p
                      className={`text-[10px] mt-2 ${msg.type === 'user' ? 'text-white/70' : 'text-slate-500'}`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>

                  {/* Quick Replies */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-wrap gap-2"
                    >
                      {msg.quickReplies.map((reply) => (
                        <motion.button
                          key={`reply-${reply.toLowerCase().replace(/\s+/g, '-')}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleQuickReply(reply)}
                          className="px-3 py-1.5 glass-premium hover:bg-purple-500/20 border border-purple-500/30 rounded-full text-xs font-medium transition-all"
                        >
                          {reply}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-start"
              >
                <div className="glass-premium px-4 py-3 rounded-2xl rounded-tl-sm">
                  <motion.div
                    className="flex gap-1"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <div className="w-2 h-2 bg-violet-400 rounded-full" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  </motion.div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 glass-premium border-t border-white/10">
        <div className="flex items-end gap-2">
          {/* Voice Input Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleVoiceInput}
            className={`p-3 rounded-xl transition-all ${
              isListening
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                : 'glass-premium text-slate-300 hover:text-white'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </motion.button>

          {/* Text Input */}
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isListening ? 'Escuchando...' : 'Escribe tu mensaje o usa tu voz...'}
            disabled={isListening}
            className="flex-1 px-4 py-3 glass-premium border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
            rows={1}
            style={{ maxHeight: '100px' }}
          />

          {/* Send Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!inputValue.trim() || isListening}
            className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Hints */}
        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Powered by AI + Voice Recognition
          </span>
          <span>Enter para enviar</span>
        </div>
      </div>
    </motion.div>
  );
};

AIWidgetAdvanced.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AIWidgetAdvanced;
