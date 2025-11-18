/**
 * 🌌 HOLOGRAPHIC HEADER
 * Header holográfico con estado del sistema CHRONOS
 */
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { useTacticalSounds } from '../hooks/useTacticalSounds';

const HolographicHeader = ({
  currentPanel = 'dashboard',
  systemStatus = 'ONLINE',
  onSystemAlert,
  className = '',
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState('SECURE');
  const [aiStatus, setAiStatus] = useState('READY');
  const [notifications, setNotifications] = useState([]);
  const { playSystemSound, playTacticalSound } = useTacticalSounds();

  // Panel titles according to Excel structure
  const panelTitles = {
    dashboard: 'CONTROL MAESTRO • UNIFIED DASHBOARD',
    distribuidores: 'DISTRIBUIDORES • SUPPLY CHAIN',
    clientes: 'CLIENTES • CLIENT MANAGEMENT',
    analytics: 'ANÁLISIS Y REPORTES • INTELLIGENCE',
    sicar: 'SICAR IA 1500 • AI ASSISTANT',
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate system notifications
  useEffect(() => {
    const notificationTimer = setInterval(() => {
      const randomNotifications = [
        { id: 1, type: 'info', message: 'Data sync completed', priority: 'LOW' },
        { id: 2, type: 'warning', message: 'High CPU usage detected', priority: 'MEDIUM' },
        { id: 3, type: 'success', message: 'AI model updated', priority: 'HIGH' },
        { id: 4, type: 'tactical', message: 'Tactical scan initiated', priority: 'CRITICAL' },
      ];

      if (Math.random() > 0.7) {
        // 30% chance
        const notification =
          randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        setNotifications((prev) => [
          { ...notification, timestamp: Date.now() },
          ...prev.slice(0, 2), // Keep only 3 notifications
        ]);

        if (notification.priority === 'CRITICAL') {
          playTacticalSound('alert');
        } else {
          playSystemSound('scan');
        }
      }
    }, 8000);

    return () => clearInterval(notificationTimer);
  }, [playSystemSound, playTacticalSound]);

  // Remove old notifications
  useEffect(() => {
    const cleanup = setInterval(() => {
      setNotifications(
        (prev) => prev.filter((n) => Date.now() - n.timestamp < 10000) // Remove after 10 seconds
      );
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  // Format time for display
  const formatTime = (date) => {
    return {
      time: date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      }),
    };
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'ONLINE':
        return 'text-green-400';
      case 'SCANNING':
        return 'text-yellow-400';
      case 'ALERT':
        return 'text-red-400';
      case 'SECURE':
        return 'text-cyan-400';
      case 'READY':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  // Get notification color
  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-green-400 bg-green-400/10 text-green-400';
      case 'warning':
        return 'border-yellow-400 bg-yellow-400/10 text-yellow-400';
      case 'error':
        return 'border-red-400 bg-red-400/10 text-red-400';
      case 'tactical':
        return 'border-orange-400 bg-orange-400/10 text-orange-400';
      default:
        return 'border-blue-400 bg-blue-400/10 text-blue-400';
    }
  };

  const timeData = formatTime(currentTime);

  return (
    <motion.header
      className={`relative bg-black/90 backdrop-blur-lg border-b border-orange-500/30 ${className}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{
        background:
          'linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(10,5,0,0.9) 50%, rgba(0,0,0,0.95) 100%)',
        boxShadow: '0 4px 20px rgba(255, 102, 0, 0.1)',
      }}
    >
      {/* Holographic glow effect */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,102,0,0.1) 20%, rgba(0,255,255,0.05) 40%, rgba(255,0,255,0.05) 60%, rgba(255,102,0,0.1) 80%, transparent 100%)',
          animation: 'holographic-sweep 4s linear infinite',
        }}
      />

      <div className="relative z-10 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section: Panel Title & System Status */}
          <div className="flex items-center space-x-6">
            {/* CHRONOS Logo */}
            <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
              <motion.div
                className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center"
                animate={{
                  boxShadow: [
                    '0 0 10px rgba(255, 102, 0, 0.5)',
                    '0 0 20px rgba(255, 102, 0, 0.8)',
                    '0 0 10px rgba(255, 102, 0, 0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-white font-bold text-sm">C</span>
              </motion.div>
              <div>
                <h1 className="text-orange-400 font-bold text-lg tracking-wider">CHRONOS</h1>
                <p className="text-xs text-gray-400 -mt-1">Enterprise Command</p>
              </div>
            </motion.div>

            {/* Current Panel */}
            <div className="hidden md:block border-l border-orange-500/30 pl-6">
              <motion.h2
                className="text-white font-semibold text-sm"
                key={currentPanel}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {panelTitles[currentPanel] || 'UNKNOWN PANEL'}
              </motion.h2>
              <p className="text-orange-300 text-xs mt-1">Active Command Interface</p>
            </div>
          </div>

          {/* Center Section: Notifications */}
          <div className="flex-1 max-w-md mx-6">
            <AnimatePresence mode="popLayout">
              {notifications.slice(0, 1).map((notification) => (
                <motion.div
                  key={notification.id}
                  className={`p-2 rounded border text-xs ${getNotificationColor(notification.type)}`}
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.8 }}
                  layout
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{notification.type.toUpperCase()}</span>
                    <span className="text-xs opacity-70">{notification.priority}</span>
                  </div>
                  <p className="mt-1">{notification.message}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Right Section: System Status & Time */}
          <div className="flex items-center space-x-6">
            {/* System Status */}
            <div className="hidden lg:grid grid-cols-3 gap-4 text-xs">
              <div className="text-center">
                <p className="text-gray-400">SYSTEM</p>
                <p className={`font-semibold ${getStatusColor(systemStatus)}`}>{systemStatus}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400">CONNECTION</p>
                <p className={`font-semibold ${getStatusColor(connectionStatus)}`}>
                  {connectionStatus}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-400">AI STATUS</p>
                <p className={`font-semibold ${getStatusColor(aiStatus)}`}>{aiStatus}</p>
              </div>
            </div>

            {/* Time Display */}
            <div className="text-right border-l border-orange-500/30 pl-6">
              <motion.div
                className="text-orange-400 font-mono text-lg font-bold"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {timeData.time}
              </motion.div>
              <p className="text-gray-400 text-xs">{timeData.date}</p>
            </div>

            {/* Alert Indicator */}
            <motion.div
              className="w-3 h-3 rounded-full bg-green-400"
              animate={{
                backgroundColor:
                  systemStatus === 'ALERT'
                    ? '#ef4444'
                    : systemStatus === 'SCANNING'
                      ? '#f59e0b'
                      : '#10b981',
                boxShadow: [
                  '0 0 5px rgba(16, 185, 129, 0.5)',
                  '0 0 15px rgba(16, 185, 129, 0.8)',
                  '0 0 5px rgba(16, 185, 129, 0.5)',
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </div>
      </div>

      {/* Scanlines Effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 1px,
            rgba(255, 102, 0, 0.3) 1px,
            rgba(255, 102, 0, 0.3) 2px
          )`,
        }}
      />

      {/* Bottom Border Glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent"
        animate={{
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* CSS for holographic animation */}
      <style>{`
        @keyframes holographic-sweep {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </motion.header>
  );
};

export default HolographicHeader;
