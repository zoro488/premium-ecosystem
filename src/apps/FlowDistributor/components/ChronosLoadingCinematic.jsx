import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { Cpu, Database, Shield, Zap, Activity, Network } from 'lucide-react';

const ChronosLoadingCinematic = ({ progress = 0, status = 'Initializing' }) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [systemLogs, setSystemLogs] = useState([]);

  const phases = [
    { icon: Cpu, label: 'Core Systems', color: '#ffffff' },
    { icon: Database, label: 'Database', color: '#cccccc' },
    { icon: Network, label: 'Network', color: '#aaaaaa' },
    { icon: Shield, label: 'Security', color: '#888888' },
    { icon: Activity, label: 'Analytics', color: '#666666' },
    { icon: Zap, label: 'Ready', color: '#ffffff' }
  ];

  // Animación del número de progreso
  const springProgress = useSpring({
    number: progress,
    config: { tension: 100, friction: 20 }
  });

  useEffect(() => {
    const newPhase = Math.floor((progress / 100) * phases.length);
    if (newPhase !== currentPhase && newPhase < phases.length) {
      setCurrentPhase(newPhase);

      // Agregar log del sistema
      const timestamp = new Date().toLocaleTimeString();
      setSystemLogs(prev => [
        ...prev.slice(-4), // Solo mantener últimos 5 logs
        {
          id: Date.now(),
          message: `[${timestamp}] ${phases[newPhase].label} initialized successfully`,
          color: phases[newPhase].color
        }
      ]);
    }
  }, [progress, currentPhase, phases]);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black">
      {/* Fondo con grid animado */}
      <div className="absolute inset-0">
        <motion.div
          className="w-full h-full opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 2px, transparent 2px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 2px, transparent 2px)
            `,
            backgroundSize: '100px 100px'
          }}
          animate={{
            backgroundPosition: ['0 0', '100px 100px']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>

      {/* Círculos concéntricos pulsantes */}
      {[0, 1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          className="absolute rounded-full border border-white/10"
          style={{
            width: 200 + ring * 120,
            height: 200 + ring * 120
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 3 + ring * 0.5,
            repeat: Infinity,
            delay: ring * 0.2,
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Contenedor principal */}
      <div className="relative z-10 w-full max-w-2xl px-8">
        {/* Logo y título */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="text-7xl font-black mb-4 tracking-tight"
            style={{
              background: 'linear-gradient(180deg, #ffffff 0%, #888888 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(255,255,255,0.3)'
            }}
          >
            CHRONOS
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-gray-400 tracking-[0.3em]"
          >
            FINANCIAL CONTROL SYSTEM
          </motion.div>
        </motion.div>

        {/* Fases del sistema */}
        <div className="mb-12 flex justify-between items-center px-4">
          {phases.map((phase, index) => {
            const Icon = phase.icon;
            const isActive = index <= currentPhase;
            const isCurrent = index === currentPhase;

            return (
              <motion.div
                key={index}
                className="relative flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Línea conectora */}
                {index < phases.length - 1 && (
                  <div className="absolute left-full top-5 w-16 h-0.5 bg-white/10">
                    <motion.div
                      className="h-full bg-white"
                      initial={{ width: '0%' }}
                      animate={{ width: isActive ? '100%' : '0%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}

                {/* Icono */}
                <motion.div
                  className="relative"
                  animate={{
                    scale: isCurrent ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 1,
                    repeat: isCurrent ? Infinity : 0
                  }}
                >
                  {/* Glow effect */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full blur-lg"
                      style={{ background: phase.color }}
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.3, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    />
                  )}

                  <div
                    className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500"
                    style={{
                      background: isActive
                        ? `radial-gradient(circle, ${phase.color} 0%, rgba(255,255,255,0.1) 100%)`
                        : 'rgba(255,255,255,0.05)',
                      border: isActive ? `2px solid ${phase.color}` : '2px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    <Icon
                      className="w-5 h-5 transition-colors duration-500"
                      style={{ color: isActive ? phase.color : '#666666' }}
                    />
                  </div>
                </motion.div>

                {/* Label */}
                <motion.div
                  className="text-xs mt-2 text-center whitespace-nowrap"
                  animate={{
                    color: isActive ? '#ffffff' : '#666666'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {phase.label}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Barra de progreso principal */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <motion.span
              className="text-sm text-gray-400"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {status}
            </motion.span>

            <animated.span className="text-xl font-mono font-bold text-white">
              {springProgress.number.to(n => `${Math.floor(n)}%`)}
            </animated.span>
          </div>

          {/* Barra con múltiples capas */}
          <div className="relative h-3 rounded-full overflow-hidden bg-white/5 backdrop-blur-sm">
            {/* Capa de fondo con patrón */}
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 40px)'
              }}
              animate={{
                backgroundPosition: ['0 0', '40px 0']
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear'
              }}
            />

            {/* Barra de progreso principal */}
            <motion.div
              className="relative h-full"
              style={{
                background: 'linear-gradient(90deg, #ffffff 0%, #cccccc 50%, #888888 100%)',
                boxShadow: '0 0 20px rgba(255,255,255,0.5)'
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {/* Efecto de brillo que se mueve */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)'
                }}
                animate={{
                  x: ['-100%', '200%']
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            </motion.div>

            {/* Borde brillante superior */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)'
              }}
            />
          </div>
        </div>

        {/* Logs del sistema */}
        <motion.div
          className="space-y-2 h-28 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <AnimatePresence mode="popLayout">
            {systemLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="text-xs font-mono flex items-center gap-2"
                style={{ color: log.color }}
              >
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: log.color }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity
                  }}
                />
                <span className="opacity-80">{log.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Indicador de actividad */}
        <div className="mt-8 flex justify-center items-center gap-2">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className="w-2 h-2 rounded-full bg-white"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                delay: dot * 0.2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      </div>

      {/* Partículas flotantes */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
};

ChronosLoadingCinematic.propTypes = {
  progress: PropTypes.number,
  status: PropTypes.string
};

export default ChronosLoadingCinematic;
