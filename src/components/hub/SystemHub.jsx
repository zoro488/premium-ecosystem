/**
 * 🎮 SYSTEM HUB - MENÚ DE SELECCIÓN INTERACTIVO
 * Selector cinematográfico de sistemas con animaciones avanzadas
 * Inspirado en interfaces futuristas gaming/enterprise
 */
import { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, Brain, Cpu, MessageSquare, Target, TrendingUp, Users } from 'lucide-react';

const systemCards = [
  {
    id: 'chronos',
    title: 'CHRONOS',
    subtitle: 'Financial Command',
    description: 'Sistema de gestión financiera enterprise con 8 bóvedas y control maestro',
    icon: BarChart3,
    color: 'from-orange-500 to-red-600',
    glowColor: '#f97316',
    features: ['8 Bóvedas Bancarias', 'Control Maestro', 'Analytics IA', 'Tiempo Real'],
    status: 'ONLINE',
    usage: 98,
    route: '/chronos',
  },
  {
    id: 'smartsales',
    title: 'SMART SALES',
    subtitle: 'Sales Intelligence',
    description: 'Sistema de ventas inteligente con IA predictiva y automatización',
    icon: TrendingUp,
    color: 'from-emerald-500 to-green-600',
    glowColor: '#10b981',
    features: ['IA Predictiva', 'CRM Avanzado', 'Auto-Follow', 'Métricas'],
    status: 'ONLINE',
    usage: 87,
    route: '/smartsales',
  },
  {
    id: 'clienthub',
    title: 'CLIENT HUB',
    subtitle: 'Customer Command',
    description: 'CRM empresarial con gestión 360° de clientes y automatización',
    icon: Users,
    color: 'from-blue-500 to-cyan-600',
    glowColor: '#3b82f6',
    features: ['CRM 360°', 'Segmentación', 'Journey Map', 'Automation'],
    status: 'ONLINE',
    usage: 92,
    route: '/clienthub',
  },
  {
    id: 'analyticspro',
    title: 'ANALYTICS PRO',
    subtitle: 'Data Intelligence',
    description: 'Dashboard de analytics avanzado con visualizaciones interactivas',
    icon: Target,
    color: 'from-purple-500 to-pink-600',
    glowColor: '#a855f7',
    features: ['Big Data', 'ML Insights', 'Predictive', 'Real-time'],
    status: 'ONLINE',
    usage: 95,
    route: '/analytics',
  },
  {
    id: 'teamsync',
    title: 'TEAM SYNC',
    subtitle: 'Collaboration Hub',
    description: 'Plataforma de colaboración en equipo con IA asistente',
    icon: MessageSquare,
    color: 'from-indigo-500 to-violet-600',
    glowColor: '#6366f1',
    features: ['Chat IA', 'Colaboración', 'Proyectos', 'Workflows'],
    status: 'ONLINE',
    usage: 89,
    route: '/teamsync',
  },
  {
    id: 'synapse',
    title: 'SYNAPSE',
    subtitle: 'AI Assistant',
    description: 'Asistente de IA avanzado con múltiples modelos y capacidades',
    icon: Brain,
    color: 'from-cyan-500 to-blue-600',
    glowColor: '#06b6d4',
    features: ['Multi-Model', 'Claude 3.5', 'Vision AI', 'Streaming'],
    status: 'ONLINE',
    usage: 94,
    route: '/synapse',
  },
];

export default function SystemHub({ onSystemSelect }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const audioRef = useRef();

  // Sound effects
  useEffect(() => {
    if (typeof Audio !== 'undefined') {
      audioRef.current = new Audio('/sounds/ui-hover.mp3');
      audioRef.current.volume = 0.2;
    }
  }, []);

  const playHoverSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const handleCardSelect = (system) => {
    setSelectedCard(system.id);
    setTimeout(() => {
      onSystemSelect?.(system);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Animated Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-orange-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-16 pb-8">
        <motion.div
          className="text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-thin tracking-wider text-white mb-4">
            PREMIUM ECOSYSTEM
          </h1>
          <p className="text-white/60 text-lg tracking-wide">SELECCIONE SISTEMA DE COMANDO</p>

          {/* Status Bar */}
          <div className="mt-8 flex justify-center items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400">TODOS LOS SISTEMAS ACTIVOS</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400">AI CORE ONLINE</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* System Cards Grid */}
      <div className="relative z-10 px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {systemCards.map((system, index) => (
              <motion.div
                key={system.id}
                className="relative group cursor-pointer"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onHoverStart={() => {
                  setHoveredCard(system.id);
                  playHoverSound();
                }}
                onHoverEnd={() => setHoveredCard(null)}
                onClick={() => handleCardSelect(system)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Card Container */}
                <div className="relative">
                  {/* Glow Effect */}
                  <motion.div
                    className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(45deg, ${system.glowColor}40, ${system.glowColor}20, ${system.glowColor}40)`,
                      filter: 'blur(10px)',
                    }}
                    animate={{
                      opacity: hoveredCard === system.id ? 0.8 : 0,
                    }}
                  />

                  {/* Main Card */}
                  <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 h-80 overflow-hidden">
                    {/* Background Gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${system.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />

                    {/* Status Indicator */}
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-green-400 text-xs">{system.status}</span>
                      </div>
                    </div>

                    {/* Icon */}
                    <motion.div
                      className="mb-6"
                      animate={{
                        rotate: hoveredCard === system.id ? 360 : 0,
                        scale: hoveredCard === system.id ? 1.2 : 1,
                      }}
                      transition={{ duration: 0.8 }}
                    >
                      <system.icon
                        className="w-12 h-12 text-white/80 group-hover:text-white transition-colors duration-300"
                        style={{
                          filter:
                            hoveredCard === system.id
                              ? `drop-shadow(0 0 20px ${system.glowColor})`
                              : 'none',
                        }}
                      />
                    </motion.div>

                    {/* Title */}
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-white mb-1">{system.title}</h3>
                      <p className="text-orange-400 text-sm tracking-wide">{system.subtitle}</p>
                    </div>

                    {/* Description */}
                    <p className="text-white/60 text-sm mb-6 leading-relaxed">
                      {system.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {system.features.map((feature, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center gap-2 text-xs text-white/50"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{
                            x: hoveredCard === system.id ? 0 : -20,
                            opacity: hoveredCard === system.id ? 1 : 0,
                          }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <div className="w-1 h-1 bg-orange-400 rounded-full" />
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Usage Bar */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex justify-between text-xs text-white/50 mb-2">
                        <span>UTILIZACIÓN</span>
                        <span>{system.usage}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${system.glowColor}, ${system.glowColor}80)`,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${system.usage}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <motion.div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Selection Effect */}
                    <AnimatePresence>
                      {selectedCard === system.id && (
                        <motion.div
                          className="absolute inset-0 bg-white/10 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <motion.div
                            className="text-white text-2xl font-bold"
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ duration: 0.5 }}
                          >
                            INICIANDO...
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Holographic Lines */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{
                    opacity: hoveredCard === system.id ? 1 : 0,
                  }}
                >
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-full h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent"
                      style={{ top: `${30 + i * 20}%` }}
                      animate={{
                        x: [-300, 300],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.3,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-8">
        <div className="text-center text-white/40 text-sm">
          <p>PREMIUM ECOSYSTEM v3.0.0 | SECURE QUANTUM PROTOCOL</p>
        </div>
      </div>
    </div>
  );
}
