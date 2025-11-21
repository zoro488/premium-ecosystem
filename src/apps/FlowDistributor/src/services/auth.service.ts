/**
 * 🔐 AUTHENTICATION SERVICE - CHRONOS FLOW DISTRIBUTOR
 *
 * Servicio de autenticación optimizado con:
 * ✅ Login/Logout con Firebase Auth
 * ✅ Gestión de estado de usuario
 * ✅ Roles y permisos
 * ✅ Persistencia de sesión
 * ✅ Error handling robusto
 */

import {
    AuthError,
    createUserWithEmailAndPassword,
    User as FirebaseUser,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase.config';

// Tipos para el usuario autenticado
export interface ChronosUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'distribuidor' | 'empleado';
  permissions: string[];
  lastLogin: Date;
}

export interface LoginCredentials {
  username: string; // Puede ser email o username
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  role: 'admin' | 'distribuidor' | 'empleado';
}

/**
 * 🔐 SERVICIO DE AUTENTICACIÓN
 */
export class AuthService {
  private currentUser: ChronosUser | null = null;
  private authStateListeners: Array<(user: ChronosUser | null) => void> = [];

  constructor() {
    // Escuchar cambios en el estado de autenticación
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        this.handleUserLogin(firebaseUser);
      } else {
        this.handleUserLogout();
      }
    });
  }

  /**
   * 🔑 LOGIN CON CREDENCIALES
   */
  async login(credentials: LoginCredentials): Promise<ChronosUser> {
    try {
      console.log('🔐 Iniciando login para:', credentials.username);

      // Por ahora usamos email/password básico
      // Más tarde puedes expandir para usernames personalizados
      const email = credentials.username.includes('@')
        ? credentials.username
        : `${credentials.username}@chronosflow.com`; // Dominio por defecto

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        credentials.password
      );

      const user = await this.createChronosUser(userCredential.user);
      console.log('✅ Login exitoso:', user.displayName);

      return user;
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * 📝 REGISTRO DE NUEVO USUARIO
   */
  async register(data: RegisterData): Promise<ChronosUser> {
    try {
      console.log('📝 Creando nuevo usuario:', data.email);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Actualizar perfil con nombre
      await updateProfile(userCredential.user, {
        displayName: data.displayName
      });

      const user = await this.createChronosUser(userCredential.user, data.role);
      console.log('✅ Usuario creado exitosamente:', user.displayName);

      return user;
    } catch (error) {
      console.error('❌ Error en registro:', error);
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * 🚪 LOGOUT
   */
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      console.log('✅ Logout exitoso');
    } catch (error) {
      console.error('❌ Error en logout:', error);
      throw error;
    }
  }

  /**
   * 👤 OBTENER USUARIO ACTUAL
   */
  getCurrentUser(): ChronosUser | null {
    return this.currentUser;
  }

  /**
   * 🔔 SUSCRIBIRSE A CAMBIOS DE ESTADO
   */
  onAuthStateChange(callback: (user: ChronosUser | null) => void): () => void {
    this.authStateListeners.push(callback);

    // Llamar inmediatamente con el estado actual
    callback(this.currentUser);

    // Devolver función para desuscribirse
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  /**
   * 🛡️ VERIFICAR PERMISOS
   */
  hasPermission(permission: string): boolean {
    return this.currentUser?.permissions.includes(permission) ?? false;
  }

  /**
   * 👑 VERIFICAR ROL
   */
  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  /**
   * 🔄 MÉTODOS PRIVADOS
   */
  private async createChronosUser(
    firebaseUser: FirebaseUser,
    role: 'admin' | 'distribuidor' | 'empleado' = 'empleado'
  ): Promise<ChronosUser> {
    // Determinar permisos basados en el rol
    const permissions = this.getPermissionsByRole(role);

    const chronosUser: ChronosUser = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || 'Usuario',
      role,
      permissions,
      lastLogin: new Date()
    };

    return chronosUser;
  }

  private getPermissionsByRole(role: string): string[] {
    const rolePermissions = {
      admin: [
        'clientes.crear',
        'clientes.editar',
        'clientes.eliminar',
        'clientes.ver',
        'distribuidores.crear',
        'distribuidores.editar',
        'distribuidores.eliminar',
        'distribuidores.ver',
        'transacciones.crear',
        'transacciones.ver',
        'transacciones.editar',
        'reportes.ver',
        'configuracion.editar'
      ],
      distribuidor: [
        'clientes.crear',
        'clientes.editar',
        'clientes.ver',
        'transacciones.crear',
        'transacciones.ver',
        'ventas.crear',
        'ventas.ver',
        'reportes.ver.propios'
      ],
      empleado: [
        'clientes.ver',
        'transacciones.crear',
        'transacciones.ver',
        'ventas.crear',
        'ventas.ver'
      ]
    };

    return rolePermissions[role as keyof typeof rolePermissions] || [];
  }

  private handleUserLogin(firebaseUser: FirebaseUser): void {
    // Aquí puedes obtener información adicional del usuario desde Firestore
    this.createChronosUser(firebaseUser).then(user => {
      this.currentUser = user;
      this.notifyAuthStateListeners(user);
    });
  }

  private handleUserLogout(): void {
    this.currentUser = null;
    this.notifyAuthStateListeners(null);
  }

  private notifyAuthStateListeners(user: ChronosUser | null): void {
    this.authStateListeners.forEach(callback => callback(user));
  }

  private handleAuthError(error: AuthError): Error {
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/email-already-in-use': 'El email ya está en uso',
      'auth/weak-password': 'La contraseña es muy débil',
      'auth/invalid-email': 'Email inválido',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
      'auth/network-request-failed': 'Error de conexión'
    };

    const message = errorMessages[error.code] || 'Error de autenticación desconocido';
    return new Error(message);
  }
}

// Singleton instance
export const authService = new AuthService();

/**
 * 🎯 HOOK PERSONALIZADO PARA REACT
 */
export const useAuth = () => {
  const [user, setUser] = useState<ChronosUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    user,
    loading,
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    register: authService.register.bind(authService),
    hasPermission: authService.hasPermission.bind(authService),
    hasRole: authService.hasRole.bind(authService)
  };
};

// Necesitamos importar React hooks
import { useEffect, useState } from 'react';

export default authService;
