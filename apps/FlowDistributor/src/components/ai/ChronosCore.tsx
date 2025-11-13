// ============================================================================
// CHRONOS CORE - AI Assistant Component
// Orbe flotante con IA omnipresente
// ============================================================================

import { calcularCapitalTotal, useChronosData } from '@/hooks/useChronosData';
import { chronosAI } from '@/services/google-ai.service';
import { AnimatePresence, motion } from 'framer-motion';
import { Minimize2, Send, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function ChronosCore() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { bancos, ventas, loading: dataLoading } = useChronosData();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus en input cuando se abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Construir contexto del sistema
  const buildContext = () => {
    if (dataLoading) return 'Sistema cargando datos...';

    const capitalTotal = calcularCapitalTotal(bancos);
    const ventasHoy = ventas.filter(v => {
      const fecha = v.fecha instanceof Date ? v.fecha : new Date(v.fecha);
      return fecha.toDateString() === new Date().toDateString();
    });
    const totalVentasHoy = ventasHoy.reduce((sum, v) => sum + v.precioVenta, 0);

    return `
Ruta actual: ${location.pathname}
Capital total: $${capitalTotal.toLocaleString('es-MX')}
Ventas hoy: ${ventasHoy.length} (Total: $${totalVentasHoy.toLocaleString('es-MX')})
Bancos activos: ${bancos.length}
    `.trim();
  };

  // Procesar comando
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Detectar intención simple primero
      const intent = chronosAI.detectCommandIntent(userMessage);

      if (intent.comando === 'navigate' && intent.parametros?.ruta) {
        navigate(intent.parametros.ruta as string);
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: `Navegando a ${intent.parametros?.ruta}...` },
        ]);
        setLoading(false);
        return;
      }

      if (intent.comando === 'show-capital-total') {
        const capital = calcularCapitalTotal(bancos);
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: `Capital total disponible: $${capital.toLocaleString('es-MX')} MXN` },
        ]);
        setLoading(false);
        return;
      }

      if (intent.comando === 'show-ventas-hoy') {
        const ventasHoy = ventas.filter(v => {
          const fecha = v.fecha instanceof Date ? v.fecha : new Date(v.fecha);
          return fecha.toDateString() === new Date().toDateString();
        });
        const total = ventasHoy.reduce((sum, v) => sum + v.precioVenta, 0);
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `Hoy se han registrado ${ventasHoy.length} ventas por un total de $${total.toLocaleString('es-MX')} MXN.`
          },
        ]);
        setLoading(false);
        return;
      }

      // Procesar con AI si no es comando simple
      const context = buildContext();
      const response = await chronosAI.processCommand(userMessage, context);

      // Ejecutar acción si es necesario
      if (response.accion === 'navigate' && response.data) {
        const data = response.data as { ruta?: string };
        if (data.ruta) {
          navigate(data.ruta);
        }
      }

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response.mensaje },
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Error procesando comando. Intenta nuevamente.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Orbe flotante */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <motion.button
          className="w-16 h-16 rounded-full glass-metal shadow-neon-cyan flex items-center justify-center group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          animate={{
            boxShadow: [
              '0 0 20px rgba(0, 217, 255, 0.5)',
              '0 0 40px rgba(0, 217, 255, 0.8)',
              '0 0 20px rgba(0, 217, 255, 0.5)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles className="w-7 h-7 text-neon-cyan group-hover:rotate-180 transition-transform duration-500" />
        </motion.button>
      </motion.div>

      {/* Panel de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-28 right-8 w-96 max-h-[600px] glass-dark rounded-2xl shadow-deep z-40 flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-chronos-smoke flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-neon-cyan animate-glow-pulse" />
                <h3 className="text-lg font-semibold text-chronos-white">ChronosCore</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setMessages([])}
                  className="p-1 hover:bg-chronos-graphite rounded-lg transition-colors"
                >
                  <Minimize2 className="w-4 h-4 text-chronos-silver" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-chronos-graphite rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-chronos-silver" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-chronos-smoke scrollbar-track-transparent">
              {messages.length === 0 && (
                <div className="text-center text-chronos-silver text-sm py-8">
                  <p className="mb-2">¡Hola! Soy ChronosCore 🌟</p>
                  <p className="text-xs">Pregúntame sobre ventas, bancos, o dime a dónde ir.</p>
                  <div className="mt-4 space-y-1 text-xs text-left">
                    <p className="text-chronos-fog">Ejemplos:</p>
                    <p className="text-neon-cyan">• "ir a ventas"</p>
                    <p className="text-neon-cyan">• "cuánto capital total hay"</p>
                    <p className="text-neon-cyan">• "ventas de hoy"</p>
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-xl ${
                      msg.role === 'user'
                        ? 'glass-metal text-chronos-white'
                        : 'glass text-chronos-pearl'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="glass px-4 py-2 rounded-xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-chronos-smoke">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe un comando..."
                  className="input-glass flex-1 text-sm"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-3 glass-metal rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5 text-neon-cyan" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ChronosCore;
