/**
 * 🔐 SISTEMA DE AUTENTICACIÓN CHRONOS
 * Sistema de autenticación seguro con validación y gestión de sesiones
 * @version 1.0.0
 */

// 👤 BASE DE DATOS DE USUARIOS (en producción usar Firebase Auth)
const CHRONOS_USERS = {
  'admin@chronos.com': {
    id: 'usr_chronos_001',
    email: 'admin@chronos.com',
    password: 'Chronos2024!', // En producción: hash con bcrypt
    name: 'Administrator CHRONOS',
    role: 'admin',
    permissions: ['all'],
    avatar: 'https://ui-avatars.com/api/?name=Admin+Chronos&background=f97316&color=fff',
    createdAt: '2024-11-01T00:00:00Z',
    lastLogin: null,
  },
  'test@chronos.com': {
    id: 'usr_chronos_test',
    email: 'test@chronos.com',
    password: 'TestChronos123!', // Usuario de pruebas
    name: 'Usuario Pruebas',
    role: 'user',
    permissions: ['dashboard', 'ventas', 'clientes', 'reportes'],
    avatar: 'https://ui-avatars.com/api/?name=Test+User&background=3b82f6&color=fff',
    createdAt: '2024-11-01T00:00:00Z',
    lastLogin: null,
  },
  'demo@chronos.com': {
    id: 'usr_chronos_demo',
    email: 'demo@chronos.com',
    password: 'DemoChronos2024', // Usuario demo
    name: 'Usuario Demo',
    role: 'demo',
    permissions: ['dashboard', 'reportes'],
    avatar: 'https://ui-avatars.com/api/?name=Demo&background=10b981&color=fff',
    createdAt: '2024-11-01T00:00:00Z',
    lastLogin: null,
  },
};

/**
 * 🔑 Validar credenciales de usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object>} Usuario autenticado o error
 */
export const authenticateUser = async (email, password) => {
  // Simular latencia de red
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Validar email
  if (!email || !email.includes('@')) {
    throw new Error('Email inválido');
  }

  // Validar contraseña
  if (!password || password.length < 6) {
    throw new Error('Contraseña debe tener al menos 6 caracteres');
  }

  // Buscar usuario
  const user = CHRONOS_USERS[email.toLowerCase()];

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Verificar contraseña
  if (user.password !== password) {
    throw new Error('Contraseña incorrecta');
  }

  // Usuario autenticado exitosamente
  const authenticatedUser = {
    ...user,
    password: undefined, // No exponer contraseña
    lastLogin: new Date().toISOString(),
    sessionToken: generateSessionToken(),
  };

  return authenticatedUser;
};

/**
 * 🎫 Generar token de sesión
 * @returns {string} Token único de sesión
 */
const generateSessionToken = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return `chronos_session_${timestamp}_${random}`;
};

/**
 * 💾 Guardar sesión en localStorage
 * @param {Object} user - Usuario autenticado
 */
export const saveSession = (user) => {
  try {
    localStorage.setItem('flow_current_user', JSON.stringify(user));
    localStorage.setItem('chronos_session_token', user.sessionToken);
    localStorage.setItem('chronos_session_start', new Date().toISOString());
  } catch (error) {
    console.error('Error saving session:', error);
  }
};

/**
 * 🔓 Recuperar sesión guardada
 * @returns {Object|null} Usuario de sesión o null
 */
export const getSession = () => {
  try {
    const userStr = localStorage.getItem('flow_current_user');
    const token = localStorage.getItem('chronos_session_token');

    if (!userStr || !token) {
      return null;
    }

    const user = JSON.parse(userStr);

    // Validar expiración de sesión (24 horas)
    const sessionStart = localStorage.getItem('chronos_session_start');
    if (sessionStart) {
      const startTime = new Date(sessionStart).getTime();
      const now = Date.now();
      const hoursPassed = (now - startTime) / (1000 * 60 * 60);

      if (hoursPassed > 24) {
        clearSession();
        return null;
      }
    }

    return user;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

/**
 * 🗑️ Limpiar sesión (logout)
 */
export const clearSession = () => {
  try {
    localStorage.removeItem('flow_current_user');
    localStorage.removeItem('chronos_session_token');
    localStorage.removeItem('chronos_session_start');
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};

/**
 * 🔐 Verificar permisos de usuario
 * @param {Object} user - Usuario a verificar
 * @param {string} permission - Permiso requerido
 * @returns {boolean} True si tiene permiso
 */
export const hasPermission = (user, permission) => {
  if (!user || !user.permissions) {
    return false;
  }

  if (user.permissions.includes('all')) {
    return true;
  }

  return user.permissions.includes(permission);
};

/**
 * 📋 Lista de usuarios disponibles (solo para desarrollo)
 * @returns {Array} Lista de credenciales de prueba
 */
export const getTestCredentials = () => {
  return [
    {
      email: 'admin@chronos.com',
      password: 'Chronos2024!',
      description: '🔥 Administrador - Acceso completo',
    },
    {
      email: 'test@chronos.com',
      password: 'TestChronos123!',
      description: '🧪 Usuario Pruebas - Acceso limitado',
    },
    {
      email: 'demo@chronos.com',
      password: 'DemoChronos2024',
      description: '👀 Demo - Solo lectura',
    },
  ];
};

/**
 * 🔄 Validar token de sesión
 * @param {string} token - Token a validar
 * @returns {boolean} True si es válido
 */
export const validateSessionToken = (token) => {
  if (!token || !token.startsWith('chronos_session_')) {
    return false;
  }

  const storedToken = localStorage.getItem('chronos_session_token');
  return token === storedToken;
};

export default {
  authenticateUser,
  saveSession,
  getSession,
  clearSession,
  hasPermission,
  getTestCredentials,
  validateSessionToken,
};
