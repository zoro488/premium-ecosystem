import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Maximize2, Minimize2, Send, Sparkles, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChronosCoreProps {
  context?: string; // Contexto actual (ej: "Dashboard", "Panel Bóveda Monte")
  apiKey?: string; // Google Gemini API Key (opcional, usa variable de entorno)
}

const ChronosCore: React.FC<ChronosCoreProps> = ({ context = 'FlowDistributor', apiKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Inicializar Gemini AI
  const [genAI, setGenAI] = useState<GoogleGenerativeAI | null>(null);

  useEffect(() => {
    const key = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
    if (key) {
      setGenAI(new GoogleGenerativeAI(key));
    }
  }, [apiKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      if (!genAI) {
        throw new Error('API de IA no configurada. Agrega VITE_GEMINI_API_KEY a .env');
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `
Eres Chronos, un asistente de IA integrado en FlowDistributor.
Contexto actual: ${context}
Historial de conversación: ${messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n')}

Usuario pregunta: ${input}

Responde de forma concisa, profesional y útil. Si la pregunta es sobre datos financieros,
sugiere dónde encontrar esa información en el sistema.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const assistantMessage: Message = {
        role: 'assistant',
        content: text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error al consultar IA:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `❌ Error: ${error.message || 'No se pudo conectar con la IA'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Botón flotante para abrir */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="
            fixed bottom-6 right-6 z-50
            w-16 h-16 rounded-full
            bg-gradient-to-r from-neon-purple to-neon-pink
            shadow-[0_0_40px_rgba(168,85,247,0.6)]
            flex items-center justify-center
            cursor-pointer
            animate-glow-pulse-purple
          "
        >
          <Sparkles className="text-white" size={28} />
        </motion.button>
      )}

      {/* Panel de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? '60px' : '600px',
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="
              fixed bottom-6 right-6 z-50
              w-96 bg-chronos-glass backdrop-blur-2xl
              border border-chronos-border rounded-3xl
              shadow-[0_0_60px_rgba(168,85,247,0.4)]
              overflow-hidden
            "
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-neon-purple to-neon-pink p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bot className="text-white" size={24} />
                <div>
                  <div className="text-white font-bold">Chronos AI</div>
                  <div className="text-xs text-white/70">{context}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="h-[440px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {messages.length === 0 && (
                    <div className="text-center text-gray-400 py-12">
                      <Bot size={48} className="mx-auto mb-4 opacity-30" />
                      <p>Hola, soy Chronos 🤖</p>
                      <p className="text-sm mt-2">¿En qué puedo ayudarte?</p>
                    </div>
                  )}

                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`
                        flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}
                      `}
                    >
                      <div
                        className={`
                          max-w-[80%] px-4 py-2 rounded-2xl
                          ${msg.role === 'user'
                            ? 'bg-neon-purple text-white'
                            : 'bg-white/10 text-gray-200'
                          }
                        `}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p className="text-xs opacity-50 mt-1">
                          {msg.timestamp.toLocaleTimeString('es-MX', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white/10 px-4 py-2 rounded-2xl">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-chronos-border">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Escribe tu mensaje..."
                      className="
                        flex-1 px-4 py-2 rounded-xl
                        bg-white/5 border border-chronos-border
                        text-white placeholder-gray-500
                        focus:outline-none focus:border-neon-purple
                        transition-colors
                      "
                      disabled={loading}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={loading || !input.trim()}
                      className="
                        px-4 py-2 rounded-xl
                        bg-gradient-to-r from-neon-purple to-neon-pink
                        text-white font-semibold
                        disabled:opacity-50 disabled:cursor-not-allowed
                        hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]
                        transition-all
                      "
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChronosCore;
