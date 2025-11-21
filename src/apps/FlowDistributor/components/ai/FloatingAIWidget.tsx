/**
 * 🤖 FLOATING AI WIDGET
 *
 * Widget flotante siempre visible para acceso rápido a IA
 * - Posición fija bottom-right
 * - Expandible/colapsable
 * - Chat integrado
 * - Comandos por voz
 * - Quick actions
 */

import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    FileText,
    MessageCircle,
    Mic,
    Search,
    Send,
    Sparkles,
    TrendingUp,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import { useAIChat, useAIVoiceCommands } from '../hooks/useAI';

export function FloatingAIWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);

  const { messages, isLoading, error, sendMessage } = useAIChat();
  const { isListening, transcript, startListening, stopListening, supported: voiceSupported } = useAIVoiceCommands();

  // Quick actions
  const quickActions = [
    {
      icon: TrendingUp,
      label: 'Analizar ventas',
      command: 'Analiza las ventas del último mes',
    },
    {
      icon: FileText,
      label: 'Generar reporte',
      command: 'Genera un reporte de gastos mensuales',
    },
    {
      icon: Search,
      label: 'Buscar datos',
      command: 'Busca transacciones mayores a 10000',
    },
    {
      icon: AlertCircle,
      label: 'Detectar anomalías',
      command: 'Detecta transacciones inusuales',
    },
  ];

  // Enviar mensaje
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    await sendMessage(inputMessage);
    setInputMessage('');
  };

  // Enviar quick action
  const handleQuickAction = async (command: string) => {
    await sendMessage(command);
    setShowQuickActions(false);
  };

  // Usar transcripción de voz
  React.useEffect(() => {
    if (transcript) {
      setInputMessage(transcript);
    }
  }, [transcript]);

  return (
    <>
      {/* Widget colapsado - Botón flotante */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(true)}
            className="fixed bottom-6 right-6 z-[9999] w-16 h-16 bg-gradient-to-br from-zinc-800 to-zinc-900 text-white rounded-full shadow-2xl flex items-center justify-center group hover:shadow-zinc-800/50 transition-all duration-300"
          >
            <Sparkles className="w-7 h-7 group-hover:rotate-12 transition-transform" />

            {/* Badge de mensajes nuevos */}
            {messages.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-zinc-9000 text-white text-xs rounded-full flex items-center justify-center font-bold"
              >
                {messages.length > 9 ? '9+' : messages.length}
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Widget expandido - Chat completo */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-6 right-6 z-[9999] w-[400px] h-[600px] bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold">Asistente IA</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Acciones rápidas"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <AnimatePresence>
              {showQuickActions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-white/5 border-b border-white/10 overflow-hidden"
                >
                  <div className="p-3 grid grid-cols-2 gap-2">
                    {quickActions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => handleQuickAction(action.command)}
                        className="flex items-center space-x-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm text-white"
                      >
                        <action.icon className="w-4 h-4" />
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
              {messages.length === 0 && (
                <div className="text-center text-white/60 mt-8">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">¡Hola! Soy tu asistente de IA.</p>
                  <p className="text-xs mt-2">Pregúntame sobre ventas, reportes, análisis...</p>
                </div>
              )}

              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 text-white'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    {msg.timestamp && (
                      <p className="text-xs opacity-60 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString('es-MX', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 p-3 rounded-2xl">
                    <div className="flex space-x-2">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-zinc-9000/20 text-red-300 p-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/5 border-t border-white/10">
              <div className="flex items-center space-x-2">
                {/* Voice button */}
                {voiceSupported && (
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`p-2 rounded-lg transition-colors ${
                      isListening
                        ? 'bg-zinc-9000 text-white animate-pulse'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    title="Comando por voz"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                )}

                {/* Input field */}
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Escribe un mensaje..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-white/10 text-white placeholder-white/50 rounded-lg border border-white/20 focus:outline-none focus:border-zinc-800 transition-colors disabled:opacity-50"
                />

                {/* Send button */}
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-lg hover:shadow-lg hover:shadow-zinc-800/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom scrollbar styles */}
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `}
      </style>
    </>
  );
}
