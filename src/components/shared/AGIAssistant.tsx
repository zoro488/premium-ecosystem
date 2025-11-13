/**
 * 🧠 AGI Assistant - Asistente de IA Avanzado con Aprendizaje
 *
 * Características:
 * - Memoria de usuario y aprendizaje continuo
 * - Function calling para automatización
 * - Predicción de acciones
 * - Conversación natural con voz
 * - Navegación autónoma del sistema
 * - Generación de reportes y visualizaciones
 *
 * @version 2.0.0
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Brain,
  FileText,
  Lightbulb,
  Mic,
  Navigation,
  Send,
  Sparkles,
  X,
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  functionCalls?: FunctionCall[];
  suggestions?: string[];
}

interface FunctionCall {
  name: string;
  arguments: Record<string, any>;
  result?: any;
}

interface UserPattern {
  type: string;
  data: any;
  frequency: number;
  last_seen: string;
}

const AGI_HOST = import.meta.env.VITE_AGI_HOST || 'http://localhost:8000';

export default function AGIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userPatterns, setUserPatterns] = useState<UserPattern[]>([]);
  const [predictions, setPredictions] = useState<string[]>([]);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Usuario ID (en producción vendría de auth)
  const userId = localStorage.getItem('user_id') || `user_${Date.now()}`;

  useEffect(() => {
    if (!localStorage.getItem('user_id')) {
      localStorage.setItem('user_id', userId);
    }
  }, [userId]);

  // Panel actual
  const currentPanel = location.pathname.split('/')[1] || 'home';

  // Conectar WebSocket
  useEffect(() => {
    if (!isOpen) return;

    const ws = new WebSocket(`${AGI_HOST.replace('http', 'ws')}/ws/chat`);

    ws.onopen = () => {
      console.log('🔌 WebSocket conectado');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          functionCalls: data.function_calls,
          suggestions: data.suggestions,
        },
      ]);

      if (data.learned_patterns) {
        setUserPatterns(data.learned_patterns);
      }

      if (data.suggestions) {
        setPredictions(data.suggestions);
      }

      setIsLoading(false);

      // Ejecutar function calls automáticamente
      if (data.function_calls) {
        handleFunctionCalls(data.function_calls);
      }
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      setIsLoading(false);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [isOpen]);

  // Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'es-ES';
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cargar patrones del usuario
  useEffect(() => {
    if (isOpen && userId) {
      fetch(`${AGI_HOST}/api/user/${userId}/patterns`)
        .then((res) => res.json())
        .then((patterns) => setUserPatterns(patterns))
        .catch(console.error);
    }
  }, [isOpen, userId]);

  // Cargar predicciones
  useEffect(() => {
    if (isOpen && userId && currentPanel) {
      fetch(`${AGI_HOST}/api/user/${userId}/predictions?panel=${currentPanel}`)
        .then((res) => res.json())
        .then((preds) => setPredictions(preds.map((p: any) => p.data?.action || '')))
        .catch(console.error);
    }
  }, [isOpen, userId, currentPanel]);

  const handleFunctionCalls = useCallback(
    async (calls: FunctionCall[]) => {
      for (const call of calls) {
        try {
          if (call.name === 'navigate_to_panel') {
            const panelRoute = `/${call.arguments.panel_name.toLowerCase()}`;
            navigate(panelRoute);

            // Notificar éxito
            setMessages((prev) => [
              ...prev,
              {
                role: 'system',
                content: `✅ Navegado a ${call.arguments.panel_name}`,
                timestamp: new Date(),
              },
            ]);
          } else {
            // Ejecutar otras funciones vía API
            const response = await fetch(`${AGI_HOST}/api/function/execute`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                function_name: call.name,
                arguments: call.arguments,
              }),
            });

            const result = await response.json();

            if (result.success) {
              setMessages((prev) => [
                ...prev,
                {
                  role: 'system',
                  content: `✅ ${call.name} ejecutado: ${JSON.stringify(result.result)}`,
                  timestamp: new Date(),
                },
              ]);
            }
          }
        } catch (error) {
          console.error(`Error ejecutando ${call.name}:`, error);
        }
      }
    },
    [navigate]
  );

  const sendMessage = useCallback(
    async (text: string = input) => {
      if (!text.trim() || isLoading) return;

      const userMessage: Message = {
        role: 'user',
        content: text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      // Enviar vía WebSocket
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            message: text,
            user_id: userId,
            session_id: sessionId,
            panel: currentPanel,
            context: {
              url: location.pathname,
              timestamp: new Date().toISOString(),
            },
          })
        );
      } else {
        // Fallback a HTTP
        try {
          const response = await fetch(`${AGI_HOST}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: text,
              user_id: userId,
              session_id: sessionId,
              panel: currentPanel,
              context: {
                url: location.pathname,
                timestamp: new Date().toISOString(),
              },
            }),
          });

          const data = await response.json();

          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: data.response,
              timestamp: new Date(),
              functionCalls: data.function_calls,
              suggestions: data.suggestions,
            },
          ]);

          if (data.learned_patterns) {
            setUserPatterns(data.learned_patterns);
          }

          if (data.suggestions) {
            setPredictions(data.suggestions);
          }

          if (data.function_calls) {
            handleFunctionCalls(data.function_calls);
          }
        } catch (error) {
          console.error('Error:', error);
          setMessages((prev) => [
            ...prev,
            {
              role: 'system',
              content: '❌ Error conectando con AGI. Verifica que el servidor esté activo.',
              timestamp: new Date(),
            },
          ]);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [input, isLoading, userId, sessionId, currentPanel, location.pathname, handleFunctionCalls]
  );

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <>
      {/* Botón flotante */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all"
      >
        <Brain className="w-6 h-6" />

        {/* Badge de patrones aprendidos */}
        {userPatterns.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
          >
            {userPatterns.length}
          </motion.div>
        )}
      </motion.button>

      {/* Panel de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                <div>
                  <h3 className="font-bold">AGI Assistant</h3>
                  <p className="text-xs opacity-90">Aprendizaje continuo activado</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Patrones aprendidos */}
            {userPatterns.length > 0 && (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 border-b border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 text-sm text-purple-800 dark:text-purple-200">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium">{userPatterns.length} patrones aprendidos</span>
                </div>
              </div>
            )}

            {/* Predicciones */}
            {predictions.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 border-b border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 text-xs text-blue-800 dark:text-blue-200 mb-2">
                  <Lightbulb className="w-3 h-3" />
                  <span className="font-medium">Sugerencias predictivas</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {predictions.slice(0, 3).map((pred, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(pred)}
                      className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700 transition"
                    >
                      {pred}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium mb-2">¡Hola! Soy tu AGI Assistant</p>
                  <p className="text-sm">Puedo:</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>🧠 Aprender de tus acciones</li>
                    <li>🚀 Navegar el sistema por ti</li>
                    <li>📊 Generar reportes y análisis</li>
                    <li>🎯 Predecir lo que necesitas</li>
                    <li>🗣️ Entender voz y texto</li>
                  </ul>
                </div>
              )}

              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : msg.role === 'system'
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>

                    {/* Sugerencias */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {msg.suggestions.map((sug, i) => (
                          <button
                            key={i}
                            onClick={() => handleSuggestionClick(sug)}
                            className="block w-full text-left text-xs bg-white/20 hover:bg-white/30 rounded-lg px-2 py-1 transition"
                          >
                            💡 {sug}
                          </button>
                        ))}
                      </div>
                    )}

                    <p className="text-xs opacity-70 mt-1">{msg.timestamp.toLocaleTimeString()}</p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Escribe o habla..."
                  className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />

                <button
                  onClick={startListening}
                  disabled={isListening}
                  className={`p-2 rounded-xl transition ${
                    isListening
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                </button>

                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              <div className="flex justify-center gap-4 mt-2">
                <button
                  onClick={() => sendMessage('Analiza mis datos')}
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1"
                >
                  <BarChart3 className="w-3 h-3" />
                  Analizar
                </button>
                <button
                  onClick={() => sendMessage('Genera un reporte')}
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  Reporte
                </button>
                <button
                  onClick={() => sendMessage('Navega a ventas')}
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1"
                >
                  <Navigation className="w-3 h-3" />
                  Navegar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
