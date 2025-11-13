import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Command, Mic, Send, X, Zap, Layers, Terminal } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// CONFIG: Pon tu API Key aquí o usa variables de entorno
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export const ChronosCore = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 'init', type: 'ai', content: 'Chronos en línea. Esperando instrucciones.', timestamp: new Date() }
  ]);
  const location = useLocation();
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Conciencia situacional
  useEffect(() => {
    if (!isOpen) return;
    const path = location.pathname;
    let msg = '';
    if (path.includes('ventas')) msg = 'Módulo Ventas. Puedo analizar tendencias o registrar operaciones.';
    else if (path.includes('bancos')) msg = 'Supervisando 7 nodos bancarios. ¿Revisamos liquidez?';
    else if (path === '/') msg = 'Dashboard Principal. Resumen ejecutivo listo.';
    
    if (msg) setMessages(prev => [...prev, { id: Date.now().toString(), type: 'system', content: msg, timestamp: new Date() }]);
  }, [location.pathname, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      const userMsg = input;
      setInput('');
      setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', content: userMsg, timestamp: new Date() }]);
      setIsThinking(true);

      // Comandos Locales Rápidos
      const lowerCmd = userMsg.toLowerCase();
      if (lowerCmd.includes('ir a') || lowerCmd.includes('abrir')) {
          setIsThinking(false);
          if (lowerCmd.includes('ventas')) { navigate('/ventas'); return; }
          if (lowerCmd.includes('bancos')) { navigate('/bancos'); return; }
          if (lowerCmd.includes('dashboard')) { navigate('/'); return; }
      }

      // Consulta a Gemini
      try {
          if (!GEMINI_API_KEY) throw new Error("API Key no configurada");
          const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
          const model = genAI.getGenerativeModel({ model: "gemini-pro" });
          const context = `Eres Chronos, una IA operativa de un sistema financiero avanzado. Usuario está en: ${location.pathname}. Responde breve, profesional y "cyberpunk".`;
          const result = await model.generateContent(`${context}\nUsuario: ${userMsg}`);
          const response = await result.response.text();
          setMessages(prev => [...prev, { id: Date.now().toString(), type: 'ai', content: response, timestamp: new Date() }]);
      } catch (error) {
          setMessages(prev => [...prev, { id: Date.now().toString(), type: 'system', content: 'Error de enlace con núcleo IA. Verifica credenciales.', timestamp: new Date() }]);
      } finally {
          setIsThinking(false);
      }
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${isThinking ? 'bg-neon-cyan/20 shadow-[0_0_30px_rgba(6,182,212,0.5)] animate-pulse' : 'bg-chronos-metal border border-chronos-border hover:border-neon-blue/50'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isThinking ? <Layers className="w-6 h-6 text-neon-cyan animate-spin-slow" /> : <Sparkles className="w-6 h-6 text-white/80" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
            className="fixed bottom-24 right-6 z-50 w-[400px] h-[550px] flex flex-col bg-chronos-metal/90 backdrop-blur-2xl border border-chronos-border rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="h-14 px-6 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center space-x-3">
                    <Zap className="w-4 h-4 text-neon-blue" />
                    <span className="font-orbitron text-xs tracking-[0.2em] text-white/90">CHRONOS CORE</span>
                </div>
                <button onClick={() => setIsOpen(false)}><X className="w-5 h-5 text-zinc-500 hover:text-white" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.type === 'user' ? 'bg-neon-blue/20 text-white border border-neon-blue/30' : msg.type === 'system' ? 'bg-transparent text-neon-cyan/70 font-mono text-xs text-center w-full border border-neon-cyan/10 py-1' : 'bg-white/5 text-zinc-300 border border-white/10'}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-4 bg-black/40 border-t border-white/5">
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-neon-blue/50 transition-all">
                    <Terminal className="w-4 h-4 text-zinc-500 mr-3" />
                    <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ingresar comando..." className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder-zinc-600 font-mono text-sm" disabled={isThinking} />
                    <button type="submit" disabled={!input.trim() || isThinking}><Send className={`w-4 h-4 ${input.trim() ? 'text-neon-blue' : 'text-zinc-600'}`} /></button>
                </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};