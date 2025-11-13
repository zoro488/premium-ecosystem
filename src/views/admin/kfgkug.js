import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
// Asumimos que tienes un servicio de IA real aquí
import { generateAIResponse } from '@/services/google-ai.service'; 
import { Mic, Send, Sparkles, X, Zap } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  action?: () => void; // La IA puede sugerir acciones ejecutables
  actionLabel?: string;
}

export const ChronosAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', type: 'ai', content: 'Sistemas en línea. ¿Cuál es nuestra prioridad hoy, Operador?' }
  ]);
  
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Efecto: La IA reacciona al cambio de ruta
  useEffect(() => {
    const path = location.pathname.replace('/', '');
    if (path && isOpen) {
        addSystemMessage(`Navegando al módulo: ${path.toUpperCase()}`);
        // Aquí podrías llamar a Gemini para que dé un resumen contextual de la vista actual
    }
  }, [location.pathname]);

  const addSystemMessage = (text: string) => {
      setMessages(prev => [...prev, { id: Date.now().toString(), type: 'system', content: text }]);
  };

  const handleCommand = async (text: string) => {
    setIsProcessing(true);
    // 1. Análisis de Intención Básico (Simulado, aquí iría Gemini real)
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('ir a') || lowerText.includes('navegar')) {
        if (lowerText.includes('ventas')) { navigate('/ventas'); return finalizeCommand('Iniciando módulo de Ventas.'); }
        if (lowerText.includes('bancos')) { navigate('/bancos'); return finalizeCommand('Accediendo a Bóvedas Bancarias.'); }
        if (lowerText.includes('dashboard')) { navigate('/'); return finalizeCommand('Regresando al Puente de Mando.'); }
    }

    if (lowerText.includes('nueva venta')) {
        navigate('/ventas/nueva');
        return finalizeCommand('Preparando formulario de venta. ¿Qué monto registramos?');
    }

    // 2. Si no es comando directo, usar Gemini para respuesta general
    try {
       const response = await generateAIResponse(text, location.pathname); // Pasamos contexto actual
       setMessages(prev => [...prev, { id: Date.now().toString(), type: 'ai', content: response }]);
    } catch (error) {
       setMessages(prev => [...prev, { id: Date.now().toString(), type: 'ai', content: 'Error de enlace con el núcleo IA.' }]);
    } finally {
        setIsProcessing(false);
    }
  };

  const finalizeCommand = (response: string) => {
      setMessages(prev => [...prev, { id: Date.now().toString(), type: 'ai', content: response }]);
      setIsProcessing(false);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', content: query }]);
    handleCommand(query);
    setQuery('');
  };

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {/* Orbe Flotante (Avatar de Chronos) */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 cursor-pointer group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      >
        <div className="relative w-16 h-16">
            {/* Núcleo de Energía */}
            <div className={`absolute inset-0 rounded-full bg-chronos-950 border-2 border-chronos-400/50 backdrop-blur-xl overflow-hidden flex items-center justify-center transition-all duration-500 ${isProcessing ? 'animate-pulse-fast shadow-neon' : 'animate-float shadow-glass'}`}>
                 <Sparkles className={`w-8 h-8 text-chronos-400 ${isProcessing ? 'animate-spin' : 'animate-pulse-slow'}`} />
            </div>
            {/* Anillos Giratorios */}
            <div className="absolute inset-[-4px] rounded-full border border-chronos-500/30 border-t-transparent animate-spin-slow" />
            <div className="absolute inset-[-8px] rounded-full border border-chronos-300/10 border-b-transparent animate-reverse-spin" />
        </div>
      </motion.div>

      {/* Interfaz de Chat Holográfica */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-6 w-96 max-h-[600px] flex flex-col rounded-2xl overflow-hidden z-50 border border-chronos-400/30 shadow-2xl backdrop-blur-xl bg-chronos-950/80"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-chronos-900/40 border-b border-chronos-400/20 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-chronos-400" />
                    <h3 className="font-orbitron text-white tracking-wider">CHRONOS AI v4.0</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-chronos-300 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Área de Mensajes */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 h-[400px] scrollbar-thin scrollbar-thumb-chronos-500/50 scrollbar-track-transparent">
                {messages.map(msg => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: msg.type === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] p-4 rounded-2xl ${
                            msg.type === 'user' 
                                ? 'bg-chronos-600 text-white rounded-br-none' 
                                : msg.type === 'system'
                                ? 'bg-transparent text-chronos-300 text-xs font-mono border border-chronos-500/20 text-center w-full'
                                : 'bg-metal-900/50 border border-chronos-400/20 text-chronos-100 rounded-bl-none'
                        }`}>
                            {msg.type === 'ai' && <Sparkles className="w-4 h-4 text-chronos-400 mb-2 inline-block mr-2" />}
                            {msg.content}
                            {msg.action && (
                                <button 
                                    onClick={msg.action}
                                    className="mt-3 w-full py-2 bg-chronos-500/20 hover:bg-chronos-500/40 border border-chronos-400/50 rounded-lg text-sm text-chronos-300 transition-all flex items-center justify-center space-x-2"
                                >
                                    <span>Ejecutar: {msg.actionLabel}</span>
                                    <Zap className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
                {isProcessing && (
                    <div className="flex justify-start">
                        <div className="bg-metal-900/50 border border-chronos-400/20 p-4 rounded-2xl rounded-bl-none flex space-x-2">
                            <div className="w-2 h-2 bg-chronos-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-chronos-400 rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-chronos-400 rounded-full animate-bounce delay-200" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 bg-black/40 border-t border-chronos-400/20 flex items-center space-x-3">
                <button 
                    type="button"
                    onClick={() => setIsListening(!isListening)}
                    className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-chronos-500/10 text-chronos-400 hover:bg-chronos-500/20'}`}
                >
                    <Mic className="w-5 h-5" />
                </button>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Comando o consulta..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder-chronos-500/50 font-mono text-sm"
                />
                <button 
                    type="submit" 
                    disabled={!query.trim() || isProcessing}
                    className="p-3 bg-chronos-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-chronos-400 transition-colors"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};