import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Mic, Send, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

export default function FloatingAIWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([]);

  const quickActions = [
    { label: 'Ventas de hoy', action: () => handleQuickAction('¿Cuánto vendimos hoy?') },
    { label: 'Stock bajo', action: () => handleQuickAction('¿Qué productos tienen stock bajo?') },
    { label: 'Clientes deudores', action: () => handleQuickAction('¿Qué clientes deben más?') },
    { label: 'Capital total', action: () => handleQuickAction('¿Cuál es el capital total?') }
  ];

  const handleQuickAction = (text: string) => {
    setMessages([...messages, { role: 'user', content: text }]);
    // Aquí iría la lógica de IA
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'Procesando tu consulta...'
      }]);
    }, 500);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    handleQuickAction(message);
    setMessage('');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] glass-dark rounded-2xl shadow-2xl border border-zinc-500/30 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Asistente IA</h3>
                  <p className="text-xs text-white/60">Siempre disponible</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-b border-white/10">
              <p className="text-sm text-white/60 mb-2">Acciones rápidas:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.action}
                    className="px-3 py-2 rounded-lg glass text-sm text-white hover:bg-white/10 transition-colors"
                  >
                    {action.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-white/40 mt-20">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-40" />
                  <p>Pregúntame cualquier cosa</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-zinc-800 to-zinc-900 text-white'
                          : 'glass text-white/90'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <button className="p-3 glass rounded-lg hover:bg-white/10 transition-colors">
                  <Mic className="w-5 h-5 text-zinc-300" />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Escribe tu pregunta..."
                  className="flex-1 px-4 py-3 glass rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                <button
                  onClick={handleSend}
                  className="p-3 bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-full shadow-2xl shadow-cyan-500/50 flex items-center justify-center z-50 hover:shadow-cyan-500/70 transition-shadow"
      >
        <Bot className="w-6 h-6 text-white" />
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-zinc-9000 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </motion.button>
    </>
  );
}
