# 🚀 GUÍA COMPLETA DE IMPLEMENTACIÓN - FLOWDISTRIBUTOR CHRONOS

**Fecha**: 13 de Noviembre, 2025
**Versión**: 1.0
**Autor**: GitHub Copilot AI
**Objetivo**: Completar FlowDistributor CHRONOS al 100%

---

## 📑 TABLA DE CONTENIDOS

1. [Configuración Inicial](#1-configuración-inicial)
2. [Sistema de Autenticación](#2-sistema-de-autenticación)
3. [Componentes UI Base Faltantes](#3-componentes-ui-base-faltantes)
4. [PanelProfit - Banco Faltante](#4-panelprofit---banco-faltante)
5. [Migración de Bancos a Firestore](#5-migración-de-bancos-a-firestore)
6. [Sistema IA Completo](#6-sistema-ia-completo)
7. [Validación Zod en Formularios](#7-validación-zod-en-formularios)
8. [Testing Completo](#8-testing-completo)
9. [Optimización de Performance](#9-optimización-de-performance)
10. [Deployment](#10-deployment)

---

## 1. CONFIGURACIÓN INICIAL

### 1.1 Dependencias Necesarias

```bash
# Dependencias principales (ya instaladas, verificar versiones)
npm install firebase@^10.7.1
npm install framer-motion@^10.16.16
npm install lucide-react@^0.292.0
npm install react-hook-form@^7.49.2
npm install zod@^3.22.4
npm install @hookform/resolvers@^3.3.3
npm install recharts@^2.10.3
npm install date-fns@^3.0.6
npm install zustand@^4.4.7
npm install react-router-dom@^6.21.0
npm install @tanstack/react-query@^5.14.2

# Dependencias adicionales necesarias
npm install react-hot-toast@^2.4.1        # Toast notifications
npm install clsx@^2.0.0                   # Class utilities
npm install tailwind-merge@^2.2.0         # Merge tailwind classes
npm install @radix-ui/react-dialog@^1.0.5 # Modal primitives
npm install @radix-ui/react-dropdown-menu@^2.0.6
npm install @radix-ui/react-select@^2.0.0
npm install @radix-ui/react-tabs@^1.0.4
npm install @radix-ui/react-tooltip@^1.0.7
npm install react-dropzone@^14.2.3        # File upload
npm install react-day-picker@^8.10.0      # Date picker
npm install @hello-pangea/dnd@^16.5.0     # Drag and drop

# Testing
npm install -D vitest@^1.0.4
npm install -D @testing-library/react@^14.1.2
npm install -D @testing-library/jest-dom@^6.1.5
npm install -D @vitest/ui@^1.0.4
npm install -D @playwright/test@^1.40.1

# Dev tools
npm install -D @types/node@^20.10.6
npm install -D eslint@^8.56.0
npm install -D prettier@^3.1.1
```

### 1.2 Estructura de Carpetas Consolidada

**DECISIÓN ARQUITECTÓNICA**: Consolidar en `src/apps/FlowDistributor/chronos-system/`

```
src/apps/FlowDistributor/chronos-system/
├── components/
│   ├── auth/                    # ⚠️ CREAR
│   │   ├── AuthProvider.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── LoginScreen.tsx
│   │   └── SplashScreen.tsx
│   ├── layout/                  # ✅ EXISTE
│   │   ├── MainLayout.tsx
│   │   ├── UltraHeaderComplete.tsx
│   │   └── UltraSidebarComplete.tsx
│   ├── panels/                  # ⚠️ CREAR carpeta
│   │   ├── DashboardIA.tsx
│   │   ├── PanelVentas.tsx
│   │   ├── PanelAlmacen.tsx
│   │   ├── PanelClientes.tsx
│   │   ├── PanelDistribuidores.tsx
│   │   ├── PanelOrdenesCompra.tsx
│   │   ├── PanelGYA.tsx
│   │   ├── PanelReportes.tsx
│   │   └── bancos/
│   │       ├── PanelBancoGenerico.tsx
│   │       ├── PanelBovedaMonte.tsx
│   │       ├── PanelBovedaUSA.tsx
│   │       ├── PanelUtilidades.tsx
│   │       ├── PanelFletes.tsx
│   │       ├── PanelAzteca.tsx
│   │       ├── PanelLeftie.tsx
│   │       └── PanelProfit.tsx         # ⚠️ CREAR
│   ├── forms/                   # ✅ EXISTE (consolidar)
│   │   ├── FormVenta.tsx
│   │   ├── FormOrdenCompra.tsx
│   │   ├── FormGasto.tsx
│   │   ├── FormTransferencia.tsx
│   │   ├── FormAbono.tsx
│   │   ├── FormCliente.tsx
│   │   ├── FormDistribuidor.tsx
│   │   ├── FormIngreso.tsx
│   │   ├── FormPagoDistribuidor.tsx
│   │   ├── FormPagoCliente.tsx
│   │   ├── FormAjusteInventario.tsx
│   │   └── FormCorte.tsx
│   ├── ui/                      # ✅ EXISTE (completar)
│   │   ├── BaseComponents.jsx   # ✅ Completo
│   │   ├── DataTable.jsx        # ✅ Completo
│   │   ├── FormComponents.jsx   # ✅ Completo
│   │   ├── DataVisualization.jsx
│   │   ├── LayoutComponents.jsx
│   │   ├── FeedbackComponents.jsx
│   │   ├── NavigationComponents.jsx
│   │   ├── SearchComponents.jsx
│   │   └── SpecialComponents.jsx
│   ├── ai/                      # ⚠️ MEJORAR
│   │   ├── AIFloatingWidget.tsx
│   │   ├── AIFullscreenPanel.tsx
│   │   ├── AIPredictions.tsx
│   │   ├── AIInsights.tsx
│   │   └── AIRecommendations.tsx
│   ├── animations/              # ✅ EXISTE
│   │   └── AnimationSystem.jsx
│   ├── charts/                  # ⚠️ CREAR
│   │   ├── LineChart.tsx
│   │   ├── BarChart.tsx
│   │   ├── PieChart.tsx
│   │   ├── AreaChart.tsx
│   │   └── SankeyDiagram.tsx
│   └── shared/                  # ✅ EXISTE
│       └── ErrorBoundary.jsx
├── services/                    # ✅ EXISTE (completar)
│   ├── firebase.js              # ✅ Config
│   ├── ventas.service.js        # ✅ Completo
│   ├── compras.service.js       # ✅ Completo
│   ├── clientes.service.js      # ✅ Completo
│   ├── distribuidores.service.js # ✅ Completo
│   ├── bancos.service.js        # ✅ Completo
│   ├── almacen.service.js       # ✅ Completo
│   ├── productos.service.js     # ✅ Completo
│   ├── gastos.service.js        # ✅ Completo
│   ├── ordenes-compra.service.js # ✅ Completo
│   ├── auth.service.js          # ⚠️ CREAR
│   ├── sync.service.js          # ⚠️ CREAR
│   ├── ai.service.js            # ⚠️ COMPLETAR
│   ├── export.service.js        # ⚠️ CREAR
│   ├── notifications.service.js # ⚠️ CREAR
│   └── migration/
│       ├── migrate-all.js       # ⚠️ MEJORAR
│       └── migrate-bancos.js    # ⚠️ CREAR
├── hooks/                       # ✅ EXISTE (completar)
│   ├── useFirestore.js          # ✅ Completo
│   ├── useAuth.js               # ⚠️ COMPLETAR
│   ├── useVentas.js             # ✅ Completo
│   ├── useCompras.js            # ✅ Completo
│   ├── useClientes.js           # ✅ Completo
│   ├── useBancos.js             # ✅ Completo
│   ├── useAlmacen.js            # ⚠️ CREAR
│   ├── useDistribuidores.js     # ⚠️ CREAR
│   └── useAI.js                 # ⚠️ CREAR
├── utils/                       # ✅ EXISTE
│   ├── formulas.ts              # ⚠️ CREAR
│   ├── formatters.ts            # ⚠️ CREAR
│   ├── validators.ts            # ⚠️ CREAR
│   ├── constants.ts             # ⚠️ CREAR
│   ├── design-tokens.js         # ✅ Completo
│   └── helpers.ts               # ⚠️ CREAR
├── types/                       # ✅ EXISTE
│   ├── firestore-schema.ts      # ✅ Completo
│   ├── forms.types.ts           # ⚠️ CREAR
│   └── ai.types.ts              # ⚠️ CREAR
├── stores/                      # ✅ EXISTE
│   ├── useChronosStore.js       # ✅ Completo
│   ├── useAuthStore.js          # ⚠️ CREAR
│   └── useUIStore.js            # ⚠️ CREAR
├── pages/                       # ✅ EXISTE
│   ├── AppRoutes.jsx            # ✅ Completo
│   ├── MasterDashboard.jsx      # ✅ Completo
│   ├── VentasPage.jsx           # ✅ Completo
│   ├── ClientesPage.jsx         # ✅ Completo
│   ├── ComprasPage.jsx          # ✅ Completo
│   ├── InventarioPage.jsx       # ✅ Completo
│   ├── ReportesPage.jsx         # ⚠️ COMPLETAR
│   ├── ConfiguracionPage.jsx    # ⚠️ COMPLETAR
│   └── bancos/
│       ├── BovedaMontePage.jsx  # ⚠️ MIGRAR A FIRESTORE
│       ├── BovedaUSAPage.jsx    # ⚠️ MIGRAR A FIRESTORE
│       ├── UtilidadesPage.jsx   # ⚠️ MIGRAR A FIRESTORE
│       ├── FletesPage.jsx       # ⚠️ MIGRAR A FIRESTORE
│       ├── AztecaPage.jsx       # ⚠️ MIGRAR A FIRESTORE
│       ├── LeftiePage.jsx       # ⚠️ MIGRAR A FIRESTORE
│       └── ProfitPage.jsx       # ⚠️ CREAR
└── __tests__/                   # ⚠️ CREAR
    ├── services/
    ├── components/
    └── e2e/
```

### 1.3 Configuración Firebase

**Archivo**: `chronos-system/config/firebase.js`

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Configuración de Firebase (usar variables de entorno)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Habilitar persistencia offline
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Persistencia no habilitada: múltiples tabs abiertas');
    } else if (err.code === 'unimplemented') {
      console.warn('Persistencia no soportada en este navegador');
    }
  });
}

export default app;
```

**Archivo**: `.env.example`

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# OpenAI (para sistema IA)
VITE_OPENAI_API_KEY=your_openai_key

# Gemini (alternativa IA)
VITE_GEMINI_API_KEY=your_gemini_key
```

---

## 2. SISTEMA DE AUTENTICACIÓN

### 2.1 AuthProvider Context

**Archivo**: `chronos-system/components/auth/AuthProvider.tsx`

```typescript
/**
 * AuthProvider - Context de autenticación con Firebase Auth
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

// ============================================================================
// TYPES
// ============================================================================

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'admin' | 'manager' | 'user';
  permissions: string[];
  createdAt: any;
  lastLogin: any;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserData>) => Promise<void>;
}

// ============================================================================
// CONTEXT
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}

// ============================================================================
// PROVIDER
// ============================================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // ============================================================================
  // CARGAR DATOS DE USUARIO DESDE FIRESTORE
  // ============================================================================
  const loadUserData = async (user: User) => {
    try {
      const userDocRef = doc(db, 'usuarios', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData);
      } else {
        // Crear usuario en Firestore si no existe
        const newUserData: UserData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: 'user', // Por defecto
          permissions: ['read'],
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        };

        await setDoc(userDocRef, newUserData);
        setUserData(newUserData);
      }
    } catch (err) {
      console.error('Error cargando datos de usuario:', err);
      setError('Error al cargar datos del usuario');
    }
  };

  // ============================================================================
  // AUTH STATE LISTENER
  // ============================================================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        await loadUserData(user);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // ============================================================================
  // SIGN IN
  // ============================================================================
  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      const result = await signInWithEmailAndPassword(auth, email, password);

      // Actualizar último login
      const userDocRef = doc(db, 'usuarios', result.user.uid);
      await setDoc(
        userDocRef,
        {
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      );

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Error en signIn:', err);

      // Mensajes de error personalizados
      if (err.code === 'auth/user-not-found') {
        setError('Usuario no encontrado');
      } else if (err.code === 'auth/wrong-password') {
        setError('Contraseña incorrecta');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email inválido');
      } else {
        setError('Error al iniciar sesión');
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // SIGN UP
  // ============================================================================
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      setLoading(true);

      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Actualizar perfil
      await updateProfile(result.user, { displayName });

      // Crear documento en Firestore
      const newUserData: UserData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName,
        photoURL: null,
        role: 'user',
        permissions: ['read'],
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      };

      await setDoc(doc(db, 'usuarios', result.user.uid), newUserData);

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Error en signUp:', err);

      if (err.code === 'auth/email-already-in-use') {
        setError('El email ya está registrado');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña es muy débil');
      } else {
        setError('Error al crear cuenta');
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // SIGN OUT
  // ============================================================================
  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      setUserData(null);
      navigate('/login');
    } catch (err) {
      console.error('Error en signOut:', err);
      setError('Error al cerrar sesión');
      throw err;
    }
  };

  // ============================================================================
  // RESET PASSWORD
  // ============================================================================
  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      console.error('Error en resetPassword:', err);

      if (err.code === 'auth/user-not-found') {
        setError('Usuario no encontrado');
      } else {
        setError('Error al enviar email de recuperación');
      }

      throw err;
    }
  };

  // ============================================================================
  // UPDATE USER PROFILE
  // ============================================================================
  const updateUserProfile = async (data: Partial<UserData>) => {
    if (!user) return;

    try {
      setError(null);

      const userDocRef = doc(db, 'usuarios', user.uid);
      await setDoc(userDocRef, data, { merge: true });

      // Recargar datos
      await loadUserData(user);
    } catch (err) {
      console.error('Error actualizando perfil:', err);
      setError('Error al actualizar perfil');
      throw err;
    }
  };

  // ============================================================================
  // VALUE
  // ============================================================================
  const value: AuthContextType = {
    user,
    userData,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

### 2.2 ProtectedRoute Component

**Archivo**: `chronos-system/components/auth/ProtectedRoute.tsx`

```typescript
/**
 * ProtectedRoute - HOC para proteger rutas que requieren autenticación
 */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Spinner } from '../ui/BaseComponents';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'manager' | 'user';
  requiredPermissions?: string[];
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requiredPermissions = [],
}: ProtectedRouteProps) {
  const { user, userData, loading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica autenticación
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-purple-900/20 via-slate-900 to-slate-950">
        <Spinner size="large" color="purple" />
      </div>
    );
  }

  // Redirect a login si no está autenticado
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar rol requerido
  if (requiredRole && userData?.role !== requiredRole) {
    // Si no es admin, verificar si es manager y el rol requerido es user
    if (!(userData?.role === 'manager' && requiredRole === 'user')) {
      return (
        <Navigate
          to="/unauthorized"
          state={{ from: location, requiredRole }}
          replace
        />
      );
    }
  }

  // Verificar permisos requeridos
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userData?.permissions.includes(permission)
    );

    if (!hasAllPermissions) {
      return (
        <Navigate
          to="/unauthorized"
          state={{ from: location, requiredPermissions }}
          replace
        />
      );
    }
  }

  // Usuario autenticado y autorizado
  return <>{children}</>;
}

// ============================================================================
// HELPER: useRequireAuth Hook
// ============================================================================

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [user, loading, navigate, location]);

  return { user, loading };
}
```

### 2.3 LoginScreen Component

**Archivo**: `chronos-system/components/auth/LoginScreen.tsx`

```typescript
/**
 * LoginScreen - Pantalla de login premium con animaciones
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { Button, Input } from '../ui/BaseComponents';
import ChronosLogo from '../brand/ChronosLogo';

export default function LoginScreen() {
  const { signIn, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    // Validaciones
    if (!email || !password) {
      setLocalError('Por favor completa todos los campos');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setLocalError('Email inválido');
      return;
    }

    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
    } catch (err) {
      console.error('Error en login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900/20 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl" />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="relative overflow-hidden rounded-3xl bg-white/5 p-8 shadow-2xl backdrop-blur-xl border border-white/10">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <ChronosLogo size="large" animated />
          </div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Bienvenido a CHRONOS
            </h1>
            <p className="text-gray-400">
              Sistema de gestión empresarial
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="pl-10"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {(localError || error) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400"
              >
                {localError || error}
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>

            {/* Forgot Password */}
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                onClick={() => {
                  // TODO: Implement forgot password modal
                  alert('Funcionalidad próximamente');
                }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          CHRONOS System © 2025. Todos los derechos reservados.
        </motion.div>
      </motion.div>
    </div>
  );
}
```

### 2.4 SplashScreen Component

**Archivo**: `chronos-system/components/auth/SplashScreen.tsx`

```typescript
/**
 * SplashScreen - Pantalla de carga inicial con animaciones premium
 */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChronosLogo from '../brand/ChronosLogo';

interface SplashScreenProps {
  onComplete: () => void;
  minDuration?: number; // mínimo tiempo visible (ms)
}

export default function SplashScreen({
  onComplete,
  minDuration = 2000
}: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simular carga progresiva
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 50);

    // Completar después del tiempo mínimo
    const timeout = setTimeout(() => {
      onComplete();
    }, minDuration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete, minDuration]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/20 via-slate-900 to-slate-950"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl"
          />
        </div>

        {/* Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <ChronosLogo size="xlarge" animated />
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            CHRONOS System
          </h2>
          <p className="text-gray-400">
            Iniciando sistema empresarial...
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '256px' }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8 h-1 rounded-full bg-white/10 overflow-hidden"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
            style={{ width: `${progress}%` }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>

        {/* Progress Percentage */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4 text-sm font-medium text-gray-500"
        >
          {progress}%
        </motion.div>

        {/* Particles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-purple-500/30"
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 10,
              }}
              animate={{
                y: -10,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
```

### 2.5 Integración en App.tsx

**Archivo**: `chronos-system/App.tsx`

```typescript
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginScreen from './components/auth/LoginScreen';
import SplashScreen from './components/auth/SplashScreen';
import MainLayout from './components/layout/MainLayout';
import AppRoutes from './pages/AppRoutes';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <BrowserRouter>
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <AuthProvider>
          <Routes>
            {/* Ruta pública: Login */}
            <Route path="/login" element={<LoginScreen />} />

            {/* Rutas protegidas */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <AppRoutes />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Redirect raíz a dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      )}
    </BrowserRouter>
  );
}

export default App;
```

---

*Continúa en la siguiente parte debido al límite de caracteres...*

**NOTA**: Esta guía contiene las secciones más críticas. Las secciones 3-10 incluyen:

- Componentes UI faltantes con código completo
- PanelProfit implementación
- Migración bancos a Firestore
- Sistema IA funcional
- Validación Zod completa
- Testing setup
- Optimización performance
- Scripts de deployment

¿Deseas que continúe con alguna sección específica en detalle?
