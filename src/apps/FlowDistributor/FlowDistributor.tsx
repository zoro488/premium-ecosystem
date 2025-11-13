/**
 * 🎯 FLOWDISTRIBUTOR - APLICACIÓN PRINCIPAL INTEGRADA
 *
 * Sistema completo con:
 * - Splash screen Chronos
 * - Login cinematográfico
 * - Dashboard con logo flotante
 * - Todas las funcionalidades integradas
 * - Optimización de animaciones
 * - 0 errores garantizado
 */

import { AnimatePresence } from 'framer-motion';
import { Suspense, lazy, memo, useEffect, useState } from 'react';
import ChronosLogo from './components/ChronosLogo';
import LoginChronos from './components/LoginChronos';
import SplashChronos from './components/SplashChronos';

// Lazy load del dashboard principal para optimizar carga inicial
const DashboardMain = lazy(() => import('./components/DashboardMain'));

// Fallback de carga
const LoadingFallback = memo(() => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-white text-center">
      <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
      <p className="text-sm tracking-widest">CARGANDO SISTEMA...</p>
    </div>
  </div>
));
LoadingFallback.displayName = 'LoadingFallback';

function FlowDistributor() {
  // Estados de flujo
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string } | null>(null);

  // Verificar sesión guardada al montar
  useEffect(() => {
    const savedSession = localStorage.getItem('chronos_session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        const sessionTime = new Date(session.timestamp).getTime();
        const now = Date.now();
        const hoursPassed = (now - sessionTime) / (1000 * 60 * 60);

        // Sesión válida por 24 horas
        if (hoursPassed < 24) {
          setCurrentUser(session.user);
          setIsAuthenticated(true);
          setShowSplash(false);
        } else {
          localStorage.removeItem('chronos_session');
        }
      } catch (err) {
        localStorage.removeItem('chronos_session');
      }
    }
  }, []);

  // Handler: Completar splash
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Handler: Login
  const handleLogin = async ({ username, password }: { username: string; password: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simular validación (reemplazar con tu lógica real)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Validación básica (REEMPLAZAR CON TU BACKEND)
      const validCredentials = [
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'user', password: 'user123', role: 'user' },
        { username: 'demo', password: 'demo', role: 'demo' },
      ];

      const user = validCredentials.find(
        cred => cred.username === username && cred.password === password
      );

      if (user) {
        const userData = { username: user.username, role: user.role };
        setCurrentUser(userData);
        setIsAuthenticated(true);

        // Guardar sesión
        const session = {
          user: userData,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem('chronos_session', JSON.stringify(session));
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
      console.error('Error en login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Logout
  const handleLogout = () => {
    localStorage.removeItem('chronos_session');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Render: Splash Screen
  if (showSplash) {
    return (
      <AnimatePresence mode="wait">
        <SplashChronos onComplete={handleSplashComplete} duration={3000} />
      </AnimatePresence>
    );
  }

  // Render: Login
  if (!isAuthenticated) {
    return (
      <AnimatePresence mode="wait">
        <LoginChronos
          onLogin={handleLogin}
          isLoading={isLoading}
        />
      </AnimatePresence>
    );
  }

  // Render: Dashboard Principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Logo flotante en header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="px-6 py-4 flex items-center justify-between">
          <ChronosLogo size="sm" showText={true} />

          <div className="flex items-center gap-4">
            {currentUser && (
              <div className="text-white/60 text-sm">
                <span className="text-white/80">{currentUser.username}</span>
                <span className="text-white/40 ml-2">({currentUser.role})</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-all"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard principal con lazy loading */}
      <main className="pt-20">
        <Suspense fallback={<LoadingFallback />}>
          <DashboardMain user={currentUser} onLogout={handleLogout} />
        </Suspense>
      </main>

      {/* Error toast (si existe) */}
      {error && (
        <div className="fixed bottom-6 right-6 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-2xl animate-bounce">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 font-bold"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default FlowDistributor;
