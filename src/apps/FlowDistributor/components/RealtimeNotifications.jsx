/**
 * 🔴 REAL-TIME NOTIFICATIONS - FLOWDISTRIBUTOR SUPREME 2025
 * Sistema de notificaciones en tiempo real con Socket.io y Yjs
 */
import { useCallback, useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Bell, CheckCircle, Info, Wifi, WifiOff, X } from 'lucide-react';
import { io } from 'socket.io-client';

/**
 * Hook para gestionar WebSocket
 */
export function useWebSocket(url = 'ws://localhost:3001') {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Conectar a Socket.io
    socketRef.current = io(url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current.on('connect', () => {
      // console.log('✅ WebSocket conectado');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      // console.log('❌ WebSocket desconectado');
      setIsConnected(false);
    });

    socketRef.current.on('notification', (data) => {
      setLastMessage(data);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [url]);

  const emit = useCallback((event, data) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { isConnected, lastMessage, emit, socket: socketRef.current };
}

/**
 * Componente de notificación individual
 */
function NotificationCard({ notification, onClose }) {
  const icons = {
    info: <Info className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
  };

  const colors = {
    info: 'from-zinc-800/20 to-zinc-900/10 border-zinc-700/30',
    success: 'from-green-500/20 to-green-600/10 border-zinc-500/30',
    warning: 'from-yellow-500/20 to-yellow-600/10 border-zinc-500/30',
    error: 'from-zinc-700/20 to-zinc-800/10 border-zinc-500/30',
  };

  const iconColors = {
    info: 'text-zinc-300',
    success: 'text-zinc-200',
    warning: 'text-zinc-200',
    error: 'text-zinc-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      className={`relative backdrop-blur-xl bg-gradient-to-br ${colors[notification.type]} border rounded-2xl p-4 shadow-2xl overflow-hidden`}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent shimmer" />

      <div className="relative flex items-start gap-3">
        <div className={`${iconColors[notification.type]} mt-0.5`}>{icons[notification.type]}</div>

        <div className="flex-1">
          <h4 className="text-white font-semibold mb-1">{notification.title}</h4>
          <p className="text-white/70 text-sm">{notification.message}</p>
          {notification.timestamp && (
            <p className="text-white/40 text-xs mt-1">
              {new Date(notification.timestamp).toLocaleTimeString()}
            </p>
          )}
        </div>

        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Componente principal de notificaciones
 */
export default function RealtimeNotifications({
  serverUrl = 'ws://localhost:3001',
  position = 'top-right',
}) {
  const { isConnected, lastMessage } = useWebSocket(serverUrl);
  const [notifications, setNotifications] = useState([]);
  const [showAll, setShowAll] = useState(false);

  // Agregar nueva notificación cuando llega mensaje
  useEffect(() => {
    if (lastMessage) {
      const newNotification = {
        id: Date.now(),
        ...lastMessage,
      };

      setNotifications((prev) => [newNotification, ...prev].slice(0, 50));

      // Auto-remove después de 5 segundos
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
      }, 5000);
    }
  }, [lastMessage]);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <>
      {/* Indicador de conexión */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-4 left-4 z-50"
      >
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2">
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4 text-zinc-200" />
              <span className="text-zinc-200 text-sm font-medium">Conectado</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-zinc-200" />
              <span className="text-zinc-200 text-sm font-medium">Desconectado</span>
              <div className="w-2 h-2 bg-red-400 rounded-full" />
            </>
          )}
        </div>
      </motion.div>

      {/* Botón de notificaciones */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setShowAll(!showAll)}
        className="fixed top-4 right-20 z-50 relative"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-3 hover:bg-white/10 transition-all">
          <Bell className="w-5 h-5 text-white" />
          {notifications.length > 0 && (
            <div className="absolute -top-1 -right-1 bg-zinc-9000 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {notifications.length}
            </div>
          )}
        </div>
      </motion.button>

      {/* Lista de notificaciones */}
      <div className={`fixed ${positionClasses[position]} z-40 space-y-3 max-w-md w-full`}>
        <AnimatePresence mode="popLayout">
          {(showAll ? notifications : notifications.slice(0, 3)).map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onClose={() =>
                setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
              }
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Panel completo de notificaciones */}
      <AnimatePresence>
        {showAll && notifications.length > 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
            onClick={() => setShowAll(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Hook para enviar notificaciones
 */
export function useNotification() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = io('ws://localhost:3001');
    setSocket(ws);
    return () => ws.disconnect();
  }, []);

  const notify = useCallback(
    (type, title, message) => {
      socket?.emit('notification', {
        type, // 'info' | 'success' | 'warning' | 'error'
        title,
        message,
        timestamp: new Date().toISOString(),
      });
    },
    [socket]
  );

  return { notify };
}

/**
 * EJEMPLO DE USO:
 *
 * // En tu componente principal
 * import RealtimeNotifications, { useNotification } from './RealtimeNotifications';
 *
 * function App() {
 *   const { notify } = useNotification();
 *
 *   return (
 *     <>
 *       <RealtimeNotifications serverUrl="ws://localhost:3001" position="top-right" />
 *
 *       <button onClick={() => notify('success', 'Venta Completada', 'Nueva venta de $1,500')}>
 *         Test Notification
 *       </button>
 *     </>
 *   );
 * }
 *
 * SERVIDOR SOCKET.IO REQUERIDO:
 *
 * // server.js
 * const io = require('socket.io')(3001, {
 *   cors: { origin: '*' }
 * });
 *
 * io.on('connection', (socket) => {
 *   console.log('Cliente conectado');
 *
 *   socket.on('notification', (data) => {
 *     io.emit('notification', data); // Broadcast a todos
 *   });
 * });
 */
