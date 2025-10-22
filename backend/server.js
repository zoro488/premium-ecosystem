/**
 * 🔴 SOCKET.IO SERVER - FLOWDISTRIBUTOR SUPREME 2025
 * Servidor WebSocket para notificaciones en tiempo real
 */

const { Server } = require('socket.io');

// Configuración del servidor
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Crear servidor Socket.io
const io = new Server(PORT, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Almacenar usuarios conectados
const connectedUsers = new Map();

// Middleware de autenticación (opcional)
io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    socket.data.username = `Usuario_${socket.id.substring(0, 5)}`;
  } else {
    socket.data.username = username;
  }
  next();
});

// Evento de conexión
io.on('connection', (socket) => {
  const username = socket.data.username;

  console.log(`✅ Cliente conectado: ${username} [${socket.id}]`);

  // Agregar a lista de usuarios
  connectedUsers.set(socket.id, {
    id: socket.id,
    username,
    connectedAt: new Date(),
  });

  // Notificar a todos sobre el nuevo usuario
  io.emit('user-connected', {
    userId: socket.id,
    username,
    totalUsers: connectedUsers.size,
  });

  // Enviar lista de usuarios al cliente recién conectado
  socket.emit('users-list', Array.from(connectedUsers.values()));

  // ==================== NOTIFICACIONES ====================
  socket.on('notification', (data) => {
    console.log(`📨 Notificación de ${username}:`, data);

    // Broadcast a todos los clientes
    io.emit('notification', {
      ...data,
      from: username,
      timestamp: new Date().toISOString(),
    });
  });

  // ==================== EVENTOS DE BANCOS ====================
  socket.on('bank-updated', (bank) => {
    console.log(`🏦 Banco actualizado por ${username}:`, bank.nombre);

    socket.broadcast.emit('bank-updated', {
      bank,
      updatedBy: username,
      timestamp: new Date().toISOString(),
    });

    // Enviar notificación
    io.emit('notification', {
      type: 'info',
      title: 'Banco Actualizado',
      message: `${username} actualizó el banco ${bank.nombre}`,
      timestamp: new Date().toISOString(),
    });
  });

  // ==================== EVENTOS DE TRANSACCIONES ====================
  socket.on('transaction-created', (transaction) => {
    console.log(`💰 Nueva transacción de ${username}:`, transaction);

    socket.broadcast.emit('transaction-created', {
      transaction,
      createdBy: username,
      timestamp: new Date().toISOString(),
    });

    // Notificación según tipo
    const notifType = transaction.tipo === 'ingreso' ? 'success' : 'warning';
    io.emit('notification', {
      type: notifType,
      title: transaction.tipo === 'ingreso' ? 'Ingreso Registrado' : 'Egreso Registrado',
      message: `${username} registró ${transaction.tipo} de $${transaction.monto.toLocaleString()}`,
      timestamp: new Date().toISOString(),
    });
  });

  // ==================== EVENTOS DE INVENTARIO ====================
  socket.on('inventory-updated', (product) => {
    console.log(`📦 Inventario actualizado por ${username}:`, product.nombre);

    socket.broadcast.emit('inventory-updated', {
      product,
      updatedBy: username,
      timestamp: new Date().toISOString(),
    });

    // Alerta de stock bajo
    if (product.cantidad < 20) {
      io.emit('notification', {
        type: 'warning',
        title: 'Stock Bajo',
        message: `⚠️ ${product.nombre} tiene solo ${product.cantidad} unidades`,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // ==================== EVENTOS DE VENTAS ====================
  socket.on('sale-created', (sale) => {
    console.log(`💵 Nueva venta de ${username}:`, sale);

    socket.broadcast.emit('sale-created', {
      sale,
      createdBy: username,
      timestamp: new Date().toISOString(),
    });

    io.emit('notification', {
      type: 'success',
      title: 'Venta Completada',
      message: `${username} realizó una venta de $${sale.total.toLocaleString()}`,
      timestamp: new Date().toISOString(),
    });
  });

  // ==================== CHAT EN TIEMPO REAL ====================
  socket.on('chat-message', (message) => {
    console.log(`💬 Mensaje de ${username}: ${message}`);

    io.emit('chat-message', {
      id: `msg_${Date.now()}`,
      username,
      message,
      timestamp: new Date().toISOString(),
    });
  });

  // ==================== TYPING INDICATOR ====================
  socket.on('typing', (isTyping) => {
    socket.broadcast.emit('user-typing', {
      username,
      isTyping,
    });
  });

  // ==================== COLABORACIÓN YEJS ====================
  socket.on('yjs-sync', (update) => {
    // Broadcast Yjs updates para edición colaborativa
    socket.broadcast.emit('yjs-sync', update);
  });

  // ==================== DESCONEXIÓN ====================
  socket.on('disconnect', () => {
    console.log(`❌ Cliente desconectado: ${username} [${socket.id}]`);

    // Remover de lista
    connectedUsers.delete(socket.id);

    // Notificar a todos
    io.emit('user-disconnected', {
      userId: socket.id,
      username,
      totalUsers: connectedUsers.size,
    });
  });

  // ==================== ERRORES ====================
  socket.on('error', (error) => {
    console.error(`❗ Error en socket ${socket.id}:`, error);
  });
});

// Estadísticas cada 30 segundos
setInterval(() => {
  console.log(`📊 Estadísticas del servidor:`);
  console.log(`   - Usuarios conectados: ${connectedUsers.size}`);
  console.log(`   - Tiempo activo: ${process.uptime().toFixed(0)}s`);
}, 30000);

// Manejo de errores del servidor
io.engine.on('connection_error', (err) => {
  console.error('❗ Error de conexión:', err);
});

// Inicialización
console.log('\n🚀 ===================================');
console.log('🔴 Socket.io Server - FlowDistributor');
console.log('🚀 ===================================\n');
console.log(`📡 Puerto: ${PORT}`);
console.log(`🌐 CORS: ${CORS_ORIGIN}`);
console.log(`✅ Servidor iniciado correctamente\n`);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⚠️  SIGTERM recibido, cerrando servidor...');
  io.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT recibido, cerrando servidor...');
  io.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});
