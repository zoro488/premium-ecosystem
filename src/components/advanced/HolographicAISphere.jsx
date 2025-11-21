/**
 * 🌐 HOLOGRAPHIC AI SPHERE - Ultra Premium 3D Interactive Widget
 * Widget de IA con efectos holográficos, partículas 3D y animaciones complejas
 *
 * OPTIMIZADO con React.memo para prevenir re-renders innecesarios
 */
import { memo, useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { AlertCircle, Brain, MessageCircle, TrendingUp, X, Zap } from 'lucide-react';

const HolographicAISphere = memo(({ position = 'bottom-right', onMessage, insights = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState([]);
  const [activeTab, setActiveTab] = useState('chat');
  const [pulseIntensity, setPulseIntensity] = useState(0);

  const sphereRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15 };
  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-15, 15]), springConfig);

  // Generar partículas flotantes - MAXIMIZADO A 60 partículas con variación extrema
  useEffect(() => {
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 300 - 150,
      y: Math.random() * 300 - 150,
      z: Math.random() * 200 - 100,
      size: Math.random() * 6 + 1,
      duration: Math.random() * 5 + 2,
      delay: Math.random() * 3,
      opacity: Math.random() * 0.8 + 0.2,
      blur: Math.random() * 3,
    }));
    setParticles(newParticles);
  }, []);

  // Efecto de pulso basado en actividad
  useEffect(() => {
    if (insights.length > 0) {
      setPulseIntensity(1);
      const timer = setTimeout(() => setPulseIntensity(0), 2000);
      return () => clearTimeout(timer);
    }
  }, [insights]);

  const handleMouseMove = (e) => {
    if (!sphereRef.current) return;
    const rect = sphereRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  return (
    <>
      {/* Floating Sphere Button */}
      <motion.div
        ref={sphereRef}
        className={`fixed ${positionClasses[position]} z-50`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-20 h-20 rounded-full overflow-hidden cursor-pointer group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        >
          {/* Base gradient sphere */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black border-2 border-zinc-700 rounded-full" />

          {/* Holographic overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-zinc-600/30 via-zinc-400/20 to-transparent rounded-full"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />

          {/* Pulse effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-zinc-500/30"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Particles layer */}
          {particles.slice(0, 8).map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-zinc-400"
              style={{
                width: particle.size,
                height: particle.size,
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [0, particle.x, 0],
                y: [0, particle.y, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
              }}
            />
          ))}

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div animate={{ rotate: isHovered ? 360 : 0 }} transition={{ duration: 0.6 }}>
              <Brain className="w-8 h-8 text-white drop-shadow-lg" />
            </motion.div>
          </div>

          {/* Notification badge */}
          <AnimatePresence>
            {insights.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-zinc-600 to-zinc-800 rounded-full border-2 border-black flex items-center justify-center text-xs font-bold text-white"
              >
                {insights.length}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Hover glow effect - MEJORADO con múltiples capas */}
        <AnimatePresence>
          {isHovered && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 rounded-full blur-xl bg-zinc-500/30 -z-10"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 0.6, scale: 1.3 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 rounded-full blur-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 -z-20"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full blur-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 -z-30"
              />
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Expanded Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed ${position.includes('right') ? 'right-6' : 'left-6'} ${
              position.includes('bottom') ? 'bottom-32' : 'top-32'
            } w-96 z-50`}
          >
            <div className="bg-black/95 backdrop-blur-2xl border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative p-4 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center"
                      >
                        <Brain className="w-5 h-5 text-white" />
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-zinc-500/20 blur-sm"
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">Chronos AI</h3>
                      <p className="text-xs text-zinc-400">Asistente Inteligente</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-zinc-400" />
                  </button>
                </div>

                {/* Tab navigation */}
                <div className="flex gap-2 mt-4">
                  {[
                    { id: 'chat', icon: MessageCircle, label: 'Chat' },
                    { id: 'insights', icon: TrendingUp, label: 'Insights' },
                    { id: 'alerts', icon: AlertCircle, label: 'Alertas' },
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                        activeTab === tab.id
                          ? 'bg-zinc-800 text-white'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 h-96 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {activeTab === 'chat' && (
                    <motion.div
                      key="chat"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <div className="space-y-3">
                        <div className="text-zinc-300 text-sm">
                          <p className="mb-2">¿En qué puedo ayudarte?</p>
                          <div className="flex flex-wrap gap-2">
                            {['Análisis de ventas', 'Reportes', 'Predicciones'].map(
                              (suggestion) => (
                                <button
                                  key={suggestion}
                                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs transition-colors"
                                >
                                  {suggestion}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'insights' && (
                    <motion.div
                      key="insights"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-3"
                    >
                      {insights.length > 0 ? (
                        insights.map((insight, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg"
                          >
                            <div className="flex items-start gap-2">
                              <TrendingUp className="w-4 h-4 text-zinc-400 mt-0.5" />
                              <div>
                                <p className="text-sm text-white">{insight.title}</p>
                                <p className="text-xs text-zinc-400 mt-1">{insight.description}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-zinc-400 text-sm text-center py-8">
                          No hay insights disponibles
                        </p>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'alerts' && (
                    <motion.div
                      key="alerts"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <p className="text-zinc-400 text-sm text-center py-8">Sin alertas críticas</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer input */}
              {activeTab === 'chat' && (
                <div className="p-4 bg-zinc-900/50 border-t border-zinc-800">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Escribe tu mensaje..."
                      className="flex-1 px-4 py-2 bg-black/50 border border-zinc-800 rounded-lg text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
                    />
                    <button className="p-2 bg-gradient-to-br from-zinc-700 to-zinc-900 hover:from-zinc-600 hover:to-zinc-800 rounded-lg transition-all">
                      <Zap className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

HolographicAISphere.displayName = 'HolographicAISphere';

export { HolographicAISphere };
export default HolographicAISphere;
