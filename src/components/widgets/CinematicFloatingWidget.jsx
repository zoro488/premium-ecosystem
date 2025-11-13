/**
 * 🎯 CINEMATIC FLOATING WIDGET
 * Widget flotante avanzado con animaciones cinematográficas
 * Inspirado en interfaces sci-fi y gaming
 */
import { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import {
  Activity,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Minimize2,
  Settings,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

import TacticalAIAgent from '../ai/TacticalAIAgent';

const widgetModes = {
  chat: {
    title: 'AI ASSISTANT',
    icon: MessageSquare,
    color: '#06b6d4',
    gradient: 'from-cyan-500 to-blue-600',
  },
  analytics: {
    title: 'ANALYTICS',
    icon: TrendingUp,
    color: '#10b981',
    gradient: 'from-emerald-500 to-green-600',
  },
  status: {
    title: 'SYSTEM STATUS',
    icon: Activity,
    color: '#f59e0b',
    gradient: 'from-yellow-500 to-orange-600',
  },
  team: {
    title: 'TEAM SYNC',
    icon: Users,
    color: '#8b5cf6',
    gradient: 'from-violet-500 to-purple-600',
  },
};

export default function CinematicFloatingWidget({
  initialMode = 'chat',
  initialPosition = { x: window.innerWidth - 400, y: 100 },
  onModeChange,
  onCommand,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentMode, setCurrentMode] = useState(initialMode);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [aiState, setAiState] = useState('idle');

  // Position management
  const x = useMotionValue(initialPosition.x);
  const y = useMotionValue(initialPosition.y);
  const springX = useSpring(x, { damping: 30, stiffness: 300 });
  const springY = useSpring(y, { damping: 30, stiffness: 300 });

  const constraintsRef = useRef();
  const dragRef = useRef();

  useEffect(() => {
    onModeChange?.(currentMode);
  }, [currentMode, onModeChange]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setAiState('thinking');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: `Procesando: "${inputValue}". Analizando datos del sistema CHRONOS...`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setAiState('speaking');

      setTimeout(() => setAiState('idle'), 2000);
    }, 1500);

    onCommand?.(inputValue);
  };

  const currentConfig = widgetModes[currentMode];

  return (
    <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-50">
      <motion.div
        ref={dragRef}
        className="absolute pointer-events-auto"
        style={{ x: springX, y: springY }}
        drag
        dragMomentum={false}
        dragElastic={0.1}
        dragConstraints={constraintsRef}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        whileDrag={{ scale: 1.02, rotate: 2 }}
      >
        {/* Widget Container */}
        <motion.div
          className="relative"
          animate={{
            scale: isDragging ? 1.05 : 1,
            rotate: isDragging ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          {/* Outer Glow */}
          <motion.div
            className="absolute -inset-4 rounded-3xl opacity-30"
            style={{
              background: `radial-gradient(circle, ${currentConfig.color}40 0%, transparent 70%)`,
              filter: 'blur(15px)',
            }}
            animate={{
              scale: isExpanded ? 1.2 : 1,
              opacity: isExpanded ? 0.6 : 0.3,
            }}
          />

          {/* Main Widget */}
          <motion.div
            className={`relative backdrop-blur-xl bg-black/80 border border-white/20 rounded-2xl overflow-hidden`}
            style={{
              background: `linear-gradient(135deg, black, rgba(0,0,0,0.8))`,
              borderColor: currentConfig.color + '40',
            }}
            layout
            animate={{
              width: isMinimized ? 60 : isExpanded ? 380 : 280,
              height: isMinimized ? 60 : isExpanded ? 500 : 200,
              borderColor: isExpanded ? currentConfig.color + '60' : currentConfig.color + '30',
            }}
            transition={{ duration: 0.5, type: 'spring', damping: 25 }}
          >
            {/* Header */}
            <motion.div
              className="flex items-center justify-between p-4 cursor-move"
              style={{
                background: `linear-gradient(90deg, ${currentConfig.color}20, transparent)`,
              }}
              layout
            >
              {!isMinimized && (
                <>
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <currentConfig.icon
                        className="w-5 h-5"
                        style={{ color: currentConfig.color }}
                      />
                    </motion.div>
                    <div>
                      <h3 className="text-white font-medium text-sm">{currentConfig.title}</h3>
                      <p className="text-white/50 text-xs">TACTICAL MODE</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Mode Selector */}
                    <motion.button
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        const modes = Object.keys(widgetModes);
                        const currentIndex = modes.indexOf(currentMode);
                        const nextMode = modes[(currentIndex + 1) % modes.length];
                        setCurrentMode(nextMode);
                      }}
                    >
                      <Settings className="w-3 h-3 text-white/70" />
                    </motion.button>

                    {/* Expand/Collapse */}
                    <motion.button
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-3 h-3 text-white/70" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-white/70" />
                      )}
                    </motion.button>

                    {/* Minimize */}
                    <motion.button
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsMinimized(!isMinimized)}
                    >
                      <Minimize2 className="w-3 h-3 text-white/70" />
                    </motion.button>
                  </div>
                </>
              )}

              {isMinimized && (
                <motion.button
                  className="w-full h-full flex items-center justify-center"
                  onClick={() => setIsMinimized(false)}
                  whileHover={{ scale: 1.1 }}
                >
                  <currentConfig.icon className="w-6 h-6" style={{ color: currentConfig.color }} />
                </motion.button>
              )}
            </motion.div>

            {/* Content Area */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  className="p-4 h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                >
                  {currentMode === 'chat' && (
                    <div className="flex flex-col h-full">
                      {/* AI Agent */}
                      <div className="flex justify-center mb-4">
                        <TacticalAIAgent
                          state={aiState}
                          isVisible={true}
                          onInteract={() => setAiState(aiState === 'idle' ? 'listening' : 'idle')}
                        />
                      </div>

                      {/* Messages */}
                      {isExpanded && (
                        <div className="flex-1 space-y-2 overflow-y-auto mb-4 max-h-60">
                          {messages.map((message) => (
                            <motion.div
                              key={message.id}
                              className={`p-2 rounded-lg text-xs ${
                                message.type === 'user'
                                  ? 'bg-blue-500/20 text-blue-300 ml-4'
                                  : 'bg-emerald-500/20 text-emerald-300 mr-4'
                              }`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <p>{message.content}</p>
                              <span className="text-white/40 text-xs">{message.timestamp}</span>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Input */}
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Comando táctico..."
                          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-xs placeholder-white/50 focus:outline-none focus:border-cyan-400"
                        />
                        <motion.button
                          onClick={handleSendMessage}
                          className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Zap className="w-3 h-3 text-white" />
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {currentMode === 'analytics' && (
                    <div className="text-center text-white/70 text-sm">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                      <p>Analytics en tiempo real</p>
                      {isExpanded && (
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between">
                            <span>CPU</span>
                            <span className="text-emerald-400">85%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Memoria</span>
                            <span className="text-yellow-400">62%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Red</span>
                            <span className="text-blue-400">34%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {currentMode === 'status' && (
                    <div className="text-center text-white/70 text-sm">
                      <Activity className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                      <p>Todos los sistemas operativos</p>
                      {isExpanded && (
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span>CHRONOS</span>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>AI CORE</span>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>SECURITY</span>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {currentMode === 'team' && (
                    <div className="text-center text-white/70 text-sm">
                      <Users className="w-8 h-8 mx-auto mb-2 text-violet-400" />
                      <p>Team collaboration</p>
                      {isExpanded && (
                        <div className="mt-4 text-xs space-y-1">
                          <p>👤 Admin: Online</p>
                          <p>👤 Analyst: Active</p>
                          <p>👤 Support: Away</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Holographic Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              {/* Corner Brackets */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400/50" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400/50" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400/50" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400/50" />

              {/* Scanning Lines */}
              <motion.div
                className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
                animate={{ x: [-100, 300] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
