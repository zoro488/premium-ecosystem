/**
 * 🤖 TACTICAL AI AGENT - PERSONAJE IA ANIMADO
 * Asistente virtual táctico con animaciones reactivas
 * Diseño military/cyberpunk con chaleco antibalas
 */
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Cpu, MessageSquare, Radar, Shield } from 'lucide-react';

const agentStates = {
  idle: {
    animation: 'breathing',
    eyes: 'scanning',
    color: '#10b981',
  },
  listening: {
    animation: 'focused',
    eyes: 'active',
    color: '#3b82f6',
  },
  thinking: {
    animation: 'processing',
    eyes: 'analyzing',
    color: '#f59e0b',
  },
  speaking: {
    animation: 'talking',
    eyes: 'engaged',
    color: '#06b6d4',
  },
  alert: {
    animation: 'alert',
    eyes: 'warning',
    color: '#ef4444',
  },
};

export default function TacticalAIAgent({
  state = 'idle',
  message = '',
  isVisible = true,
  onInteract,
}) {
  const [currentState, setCurrentState] = useState(state);
  const [isHovered, setIsHovered] = useState(false);
  const [eyeGlow, setEyeGlow] = useState(false);
  const [scanLines, setScanLines] = useState(false);

  useEffect(() => {
    setCurrentState(state);

    // Trigger special effects based on state
    if (state === 'thinking' || state === 'alert') {
      setScanLines(true);
      setTimeout(() => setScanLines(false), 2000);
    }
  }, [state]);

  useEffect(() => {
    // Eye glow effect
    const interval = setInterval(
      () => {
        setEyeGlow((prev) => !prev);
      },
      2000 + Math.random() * 1000
    );

    return () => clearInterval(interval);
  }, []);

  const currentConfig = agentStates[currentState];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="relative select-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          onClick={onInteract}
        >
          {/* Outer Glow Ring */}
          <motion.div
            className="absolute -inset-4 rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle, ${currentConfig.color}40 0%, transparent 70%)`,
            }}
            animate={{
              scale: isHovered ? 1.2 : 1,
              opacity: isHovered ? 0.4 : 0.2,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Main Agent Container */}
          <div className="relative w-24 h-32 cursor-pointer">
            {/* Body/Vest */}
            <motion.div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-20 rounded-t-lg"
              style={{
                background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
                border: '1px solid #333',
              }}
              animate={{
                scaleY: currentState === 'alert' ? 1.05 : 1,
                scaleX: currentState === 'thinking' ? 1.02 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Tactical Vest Details */}
              <div className="absolute inset-2 rounded border border-gray-600/50">
                {/* Vest Pockets */}
                <div className="absolute top-2 left-1 w-3 h-2 bg-gray-700 rounded-sm" />
                <div className="absolute top-2 right-1 w-3 h-2 bg-gray-700 rounded-sm" />
                <div className="absolute top-5 left-1 w-3 h-2 bg-gray-700 rounded-sm" />
                <div className="absolute top-5 right-1 w-3 h-2 bg-gray-700 rounded-sm" />

                {/* Center Panel */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-8 bg-gray-800 rounded border border-gray-600">
                  {/* Status LED */}
                  <motion.div
                    className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ backgroundColor: currentConfig.color }}
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  {/* Small Display Lines */}
                  <div className="absolute top-3 left-1 right-1 space-y-0.5">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-0.5 bg-emerald-400/30 rounded"
                        style={{ width: `${60 + i * 10}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Head */}
            <motion.div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-14 rounded-t-lg"
              style={{
                background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
                border: '1px solid #444',
              }}
              animate={{
                rotateY: isHovered ? 10 : 0,
                scale: currentState === 'alert' ? 1.1 : 1,
              }}
              transition={{ duration: 0.5 }}
            >
              {/* Helmet/Head Details */}
              <div className="absolute inset-1 rounded-t-lg border border-gray-600/30">
                {/* Tactical Lines */}
                <div className="absolute top-2 left-1 right-1 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
                <div className="absolute bottom-4 left-1 right-1 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
              </div>

              {/* Eyes */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {[0, 1].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full relative overflow-hidden"
                    style={{ backgroundColor: currentConfig.color }}
                    animate={{
                      opacity: eyeGlow ? 1 : 0.7,
                      scale: eyeGlow ? 1.2 : 1,
                      boxShadow: `0 0 ${eyeGlow ? '10px' : '5px'} ${currentConfig.color}`,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Eye Scanning Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      animate={{
                        x: [-10, 10, -10],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Antenna/Sensor */}
              <motion.div
                className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-orange-400 rounded-full"
                animate={{
                  height: currentState === 'listening' ? 8 : 2,
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>

            {/* Scan Lines Effect */}
            <AnimatePresence>
              {scanLines && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
                      style={{ top: `${i * 12.5}%` }}
                      animate={{
                        opacity: [0, 1, 0],
                        scaleX: [0, 1, 0],
                      }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.1,
                        repeat: 3,
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Status Icons */}
            <motion.div
              className="absolute -right-6 top-1/2 transform -translate-y-1/2 space-y-1"
              animate={{
                x: isHovered ? 0 : 10,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              {currentState === 'listening' && <Radar className="w-3 h-3 text-blue-400" />}
              {currentState === 'thinking' && (
                <Cpu className="w-3 h-3 text-yellow-400 animate-spin" />
              )}
              {currentState === 'speaking' && <MessageSquare className="w-3 h-3 text-cyan-400" />}
              {currentState === 'alert' && (
                <Shield className="w-3 h-3 text-red-400 animate-pulse" />
              )}
            </motion.div>

            {/* Floating Particles */}
            {isHovered && (
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-0.5 h-0.5 rounded-full"
                    style={{
                      backgroundColor: currentConfig.color,
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                    }}
                    animate={{
                      y: [-10, -30, -10],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.3,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Name/Status Display */}
          <motion.div
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center"
            animate={{
              opacity: isHovered ? 1 : 0.7,
              y: isHovered ? 0 : 5,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-xs font-mono text-white/80 mb-1">TACTICAL-AI</div>
            <div
              className="text-xs font-mono px-2 py-0.5 rounded border"
              style={{
                color: currentConfig.color,
                borderColor: currentConfig.color + '40',
                backgroundColor: currentConfig.color + '10',
              }}
            >
              {currentState.toUpperCase()}
            </div>
          </motion.div>

          {/* Speech Bubble */}
          <AnimatePresence>
            {message && (
              <motion.div
                className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-48"
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 relative">
                  <p className="text-white text-xs leading-relaxed">{message}</p>

                  {/* Arrow */}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 border-b border-r border-white/20 rotate-45" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interaction Hint */}
          {isHovered && (
            <motion.div
              className="absolute -top-6 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-xs text-white/60 whitespace-nowrap">Click para interactuar</div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
