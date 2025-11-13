/**
 * 📖 EJEMPLO DE USO: CHRONOS BRAND COMPONENTS
 * Cómo implementar el sistema de branding completo
 */

import { useState } from 'react';
import {
    ChronosLoginPage,
    ChronosSplashScreen,
    useChronosSplash
} from './components/brand';

// ============================================
// EJEMPLO 1: App con Splash → Login → Dashboard
// ============================================
export function ChronosApp() {
  const { showSplash, hideSplash } = useChronosSplash();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Handler de login
  const handleLogin = async (email, password) => {
    // Aquí va tu lógica de autenticación con Firebase
    // Ejemplo:
    // await signInWithEmailAndPassword(auth, email, password);
    console.log('Login con:', email, password);
    setIsAuthenticated(true);
  };

  // Handler de login social
  const handleSocialLogin = async (provider) => {
    // Aquí va tu lógica de login social
    // Ejemplo:
    // const providerObj = provider === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
    // await signInWithPopup(auth, providerObj);
    console.log('Login social con:', provider);
    setIsAuthenticated(true);
  };

  return (
    <>
      {/* SPLASH SCREEN - Se muestra al cargar */}
      {showSplash && (
        <ChronosSplashScreen onComplete={hideSplash} />
      )}

      {/* LOGIN PAGE - Se muestra si no está autenticado */}
      {!showSplash && !isAuthenticated && (
        <ChronosLoginPage
          onLogin={handleLogin}
          onSocialLogin={handleSocialLogin}
        />
      )}

      {/* DASHBOARD - Se muestra si está autenticado */}
      {!showSplash && isAuthenticated && (
        <div className="p-8">
          <h1 className="text-4xl font-bold text-white">
            🎉 ¡Bienvenido a CHRONOS!
          </h1>
          <p className="text-gray-400 mt-4">
            Dashboard Principal
          </p>
        </div>
      )}
    </>
  );
}

// ============================================
// EJEMPLO 2: Usar los logos individualmente
// ============================================
import {
    ChronosLogoCompact,
    ChronosLogoFull,
    ChronosLogoIcon,
    ChronosLogoWithText
} from './components/brand';

export function LogosExample() {
  return (
    <div className="p-8 space-y-12 bg-black min-h-screen">

      {/* Logo Full - Para Splash Screen o Hero */}
      <div className="text-center">
        <h2 className="text-white text-2xl mb-4">Logo Full</h2>
        <ChronosLogoFull size={250} animated={true} glowIntensity="high" />
      </div>

      {/* Logo Compact - Para Headers */}
      <div className="text-center">
        <h2 className="text-white text-2xl mb-4">Logo Compact</h2>
        <ChronosLogoCompact size={140} animated={true} />
      </div>

      {/* Logo Icon - Para Favicon o Sidebar */}
      <div className="text-center">
        <h2 className="text-white text-2xl mb-4">Logo Icon</h2>
        <ChronosLogoIcon size={80} animated={true} />
      </div>

      {/* Logo con Texto - Para Landing Pages */}
      <div className="text-center">
        <h2 className="text-white text-2xl mb-4">Logo With Text</h2>
        <ChronosLogoWithText size={300} logoVariant="full" />
      </div>
    </div>
  );
}

// ============================================
// EJEMPLO 3: Integración con React Router
// ============================================
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

export function ChronosAppWithRouter() {
  const { showSplash, hideSplash } = useChronosSplash();
  const [user, setUser] = useState(null);

  if (showSplash) {
    return <ChronosSplashScreen onComplete={hideSplash} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <ChronosLoginPage
                onLogin={async (email, password) => {
                  // Tu lógica de login
                  setUser({ email });
                }}
                onSocialLogin={async (provider) => {
                  // Tu lógica de login social
                  setUser({ provider });
                }}
              />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            user ? (
              <div>Dashboard</div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// ============================================
// EJEMPLO 4: Uso en App.jsx principal
// ============================================

// En tu src/App.jsx:
/*
import { ChronosSplashScreen, ChronosLoginPage, useChronosSplash } from './components/brand';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './lib/firebase';

function App() {
  const { showSplash, hideSplash } = useChronosSplash();
  const [user, loading] = useAuthState(auth);

  if (showSplash || loading) {
    return <ChronosSplashScreen onComplete={hideSplash} />;
  }

  if (!user) {
    return (
      <ChronosLoginPage
        onLogin={async (email, password) => {
          await signInWithEmailAndPassword(auth, email, password);
        }}
        onSocialLogin={async (provider) => {
          const authProvider = provider === 'google'
            ? new GoogleAuthProvider()
            : new GithubAuthProvider();
          await signInWithPopup(auth, authProvider);
        }}
      />
    );
  }

  return <YourMainApp />;
}

export default App;
*/

// ============================================
// TIPS DE PERSONALIZACIÓN
// ============================================

/*
1. LOGOS:
   - size: Tamaño del logo (default: 200/120/60)
   - animated: Activar animaciones (default: true)
   - glowIntensity: "low" | "medium" | "high"
   - className: Clases CSS adicionales

2. SPLASH SCREEN:
   - onComplete: Callback cuando termina (required)
   - Duración total: ~6 segundos
   - 6 fases de carga con textos personalizables

3. LOGIN PAGE:
   - onLogin: Handler de login email/password (required)
   - onSocialLogin: Handler de login social (required)
   - Incluye validación automática
   - Error handling integrado

4. COLORES (Paleta CHRONOS):
   - Primary: #667eea (Blue)
   - Secondary: #764ba2 (Purple)
   - Accent: #f093fb (Pink)
   - Highlight: #f5576c (Red-Pink)
*/

export default ChronosApp;
