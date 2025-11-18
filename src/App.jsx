import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom';



import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Brain,
  Building2,
  Loader2,
  Network,
  Satellite,
  Sparkles,
  Wallet,
} from 'lucide-react';

import { ChronosToastContainer } from './apps/FlowDistributor/chronos-system/components/chronos-ui/ChronosToast';
// 🌟 NEW PREMIUM ROUTES SYSTEM
import { SplashScreen } from './components/premium/brand/SplashScreen';
import { ToastProvider } from './components/premium/ui/UltraToastSystem';
import { AppRoutes } from './routes/AppRoutes';
import { initGA, logPageView } from './utils/analytics';

// Lazy loading de las 5 aplicaciones para mejorar rendimiento
// ✅ ACTIVADO - FlowDistributor nuevo sistema completo integrado
const FlowDistributorPage = lazy(
  () => import('./apps/FlowDistributor/chronos-system/pages/FlowDistributorPage.jsx')
);
const ShadowPrime = lazy(() => import('./apps/ShadowPrime/ShadowPrime'));
const Apollo = lazy(() => import('./apps/Apollo/Apollo'));
const Synapse = lazy(() => import('./apps/Synapse/Synapse'));
const Nexus = lazy(() => import('./apps/Nexus/Nexus'));
const FirebaseSetup = lazy(() => import('./components/FirebaseSetup'));

// 🔐 AUTH - Login Screen
const LoginScreen = lazy(() => import('./pages/auth/LoginScreen'));

// ❌ DESACTIVADO - Test viejo
// const TestBovedaMonte = lazy(() => import('./apps/FlowDistributor/TestBovedaMonte'));

// 🏦 BANCOS - Sistema Completo de Gestión Bancaria
// const BancosPageComplete = lazy(() => import('./apps/FlowDistributor/chronos-system/pages/BancosPageComplete'));
const BancosTransacciones = lazy(
  () => import('./apps/FlowDistributor/chronos-system/pages/BancosTransacciones')
);
const BancosAnalytics = lazy(
  () => import('./apps/FlowDistributor/chronos-system/pages/BancosAnalytics')
);

// 🏦 BANCOS INDIVIDUALES - Los 7 Paneles
const BovedaMontePage = lazy(
  () => import('./apps/FlowDistributor/chronos-system/pages/bancos/BovedaMontePage')
);
const BovedaUSAPage = lazy(
  () => import('./apps/FlowDistributor/chronos-system/pages/bancos/BovedaUSAPage')
);
const UtilidadesPage = lazy(
  () => import('./apps/FlowDistributor/chronos-system/pages/bancos/UtilidadesPage')
);
const FletesPage = lazy(
  () => import('./apps/FlowDistributor/chronos-system/pages/bancos/FletesPage')
);
const AztecaPage = lazy(
  () => import('./apps/FlowDistributor/chronos-system/pages/bancos/AztecaPage')
);
const LeftiePage = lazy(
  () => import('./apps/FlowDistributor/chronos-system/pages/bancos/LeftiePage')
);
const ProfitPage = lazy(
  () => import('./apps/FlowDistributor/chronos-system/pages/bancos/ProfitPage')
);
const BanorteePage = lazy(
  () => import('./apps/FlowDistributor/chronos-system/pages/bancos/BanorteePage')
);

// Componente de Loading optimizado
const LoadingScreen = ({ _appName }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-950 to-black">
      <div className="text-center">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
            scale: { duration: 1.5, repeat: Infinity },
          }}
          className="mb-6 mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-zinc-700 to-zinc-900 flex items-center justify-center border border-zinc-700"
        >
          <Loader2 className="w-8 h-8 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            {_appName ? `Cargando ${_appName}...` : 'Cargando...'}
          </h2>
          <p className="text-slate-400 text-sm">Preparando la aplicación para ti</p>
        </motion.div>

        <motion.div
          animate={{
            scaleX: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="mt-6 h-1 w-48 mx-auto bg-gradient-to-r from-zinc-700 to-zinc-900 rounded-full"
        />
      </div>
    </div>
  );
};

// Componente de fondo animado con estrellas
const StarField = () => {
  const stars = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// Configuración de las 5 aplicaciones + Chronos
const apps = [
  // ✅ CHRONOS - Sistema integral de gestión empresarial (antes FlowDistributor)
  {
    id: 'chronos',
    name: 'Chronos System',
    description: 'Sistema integral de gestión empresarial con 7 módulos',
    icon: Building2,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    path: '/chronos',
    component: FlowDistributorPage,
  },
  // {
  //   id: 'bancos',
  //   name: 'Bancos',
  //   description: 'Gestión completa de cuentas bancarias',
  //   icon: Wallet,
  //   color: 'from-emerald-500 to-teal-500',
  //   bgColor: 'bg-emerald-500/10',
  //   borderColor: 'border-emerald-500/20',
  //   path: '/bancos',
  //   component: BancosPageComplete,
  // },
  {
    id: 'shadow',
    name: 'ShadowPrime',
    description: 'Gestión avanzada de wallets y criptomonedas',
    icon: Wallet,
    color: 'from-zinc-800 to-violet-500',
    bgColor: 'bg-zinc-900/10',
    borderColor: 'border-zinc-800/20',
    path: '/shadow',
    component: ShadowPrime,
  },
  {
    id: 'apollo',
    name: 'Apollo',
    description: 'Rastreo GPS y control de drones',
    icon: Satellite,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    path: '/apollo',
    component: Apollo,
  },
  {
    id: 'synapse',
    name: 'Synapse',
    description: 'Asistente de IA y automatización',
    icon: Brain,
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    path: '/synapse',
    component: Synapse,
  },
  {
    id: 'nexus',
    name: 'Nexus',
    description: 'Centro de control y conexiones',
    icon: Network,
    color: 'from-zinc-800 via-zinc-700 to-zinc-800',
    bgColor: 'bg-zinc-900/10',
    borderColor: 'border-zinc-800/20',
    path: '/nexus',
    component: Nexus,
  },
];

// Componente de tarjeta de aplicación
const AppCard = ({ app }) => {
  const navigate = useNavigate();
  const Icon = app.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(app.path)}
      className={`
        relative overflow-hidden rounded-2xl cursor-pointer
        glass border ${app.borderColor}
        p-8 group
      `}
    >
      {/* Efecto de brillo en hover */}
      <div
        className={`
        absolute inset-0 bg-gradient-to-r ${app.color}
        opacity-0 group-hover:opacity-10 transition-opacity duration-500
      `}
      />

      {/* Icono con gradiente */}
      <div
        className={`
        relative mb-6 p-4 rounded-xl ${app.bgColor}
        border ${app.borderColor}
        inline-block
      `}
      >
        <Icon className="w-8 h-8" />
      </div>

      {/* Título */}
      <h3
        className={`
        text-2xl font-bold mb-3
        bg-gradient-to-r ${app.color}
        text-gradient
      `}
      >
        {app.name}
      </h3>

      {/* Descripción */}
      <p className="text-slate-400 text-sm leading-relaxed">{app.description}</p>

      {/* Indicador de "Abrir" */}
      <div className="mt-6 flex items-center gap-2 text-sm text-slate-500 group-hover:text-slate-300 transition-colors">
        <span>Abrir aplicación</span>
        <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          →
        </motion.div>
      </div>

      {/* Decoración con partículas */}
      <div className="absolute top-4 right-4 opacity-20">
        <Sparkles className="w-6 h-6" />
      </div>
    </motion.div>
  );
};

// Página principal - Hub de aplicaciones
const Hub = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo con estrellas */}
      <StarField />

      {/* Gradiente de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black" />

      {/* Contenido principal */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
            Premium Ecosystem
          </h1>
          <p className="text-xl text-slate-400">6 aplicaciones empresariales de nueva generación</p>
        </motion.div>

        {/* Grid de aplicaciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
        >
          {apps.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AppCard app={app} />
            </motion.div>
          ))}
        </motion.div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 text-slate-500 text-sm"
        >
          <p>Haz clic en cualquier aplicación para comenzar</p>
        </motion.div>
      </div>
    </div>
  );
};

// Componente wrapper para páginas de aplicaciones
const AppWrapper = ({ children, _appName, _appColor }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Botón de regreso */}
      <div className="fixed top-6 left-6 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-sm hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Hub</span>
        </motion.button>
      </div>

      {/* Contenido de la app */}
      {children}
    </div>
  );
};

// Analytics tracking component
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    logPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

// Componente principal con routing
function App() {
  // State para controlar splash screen
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    initGA();

    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Show splash screen
  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <ToastProvider position="top-right" maxToasts={5}>
        <AnalyticsTracker />
        <Routes>
          {/* ==========================================
              🌟 NEW PREMIUM SYSTEM ROUTES
              ========================================== */}
          <Route
            path="/premium/*"
            element={<AppRoutes user={user} onLogin={handleLogin} onLogout={handleLogout} />}
          />

          {/* ==========================================
              🏠 LEGACY ECOSYSTEM ROUTES
              ========================================== */}
          {/* Página principal - Hub */}
          <Route path="/" element={<Hub />} />

          {/* 🔐 Login Screen */}
          <Route
            path="/login"
            element={
              <Suspense fallback={<LoadingScreen _appName="Login" />}>
                <LoginScreen />
              </Suspense>
            }
          />

          {/* Ruta de Firebase Setup */}
          <Route
            path="/firebase-setup"
            element={
              <Suspense fallback={<LoadingScreen _appName="Firebase Setup" />}>
                <FirebaseSetup />
              </Suspense>
            }
          />

          {/* ❌ DESACTIVADO - Test viejo */}
          {/* <Route
          path="/test-boveda-monte"
          element={
            <Suspense fallback={<LoadingScreen _appName="Test Bóveda Monte" />}>
              <TestBovedaMonte />
            </Suspense>
          }
        /> */}

          {/* � CHRONOS - Sistema Integral de Gestión Empresarial */}
          <Route
            path="/chronos/*"
            element={
              <AppWrapper _appName="Chronos System" _appColor="blue">
                <Suspense fallback={<LoadingScreen _appName="Chronos" />}>
                  <FlowDistributorPage />
                </Suspense>
              </AppWrapper>
            }
          />

          {/* <Route
          path="/bancos"
          element={
            <AppWrapper _appName="Bancos" _appColor="blue">
              <Suspense fallback={<LoadingScreen _appName="Gestión Bancaria" />}>
                <BancosPageComplete />
              </Suspense>
            </AppWrapper>
          }
        /> */}

          {/* 📊 BANCOS - Transacciones */}
          <Route
            path="/bancos/transacciones"
            element={
              <AppWrapper _appName="Bancos - Transacciones" _appColor="blue">
                <Suspense fallback={<LoadingScreen _appName="Transacciones" />}>
                  <BancosTransacciones />
                </Suspense>
              </AppWrapper>
            }
          />

          {/* 📈 BANCOS - Analytics */}
          <Route
            path="/bancos/analytics"
            element={
              <AppWrapper _appName="Bancos - Analytics" _appColor="blue">
                <Suspense fallback={<LoadingScreen _appName="Analytics" />}>
                  <BancosAnalytics />
                </Suspense>
              </AppWrapper>
            }
          />

          {/* 🏦 BANCOS INDIVIDUALES - Los 7 Paneles de Bancos */}
          <Route
            path="/bancos/boveda-monte"
            element={
              <AppWrapper _appName="Bóveda Monte" _appColor="purple">
                <Suspense fallback={<LoadingScreen _appName="Bóveda Monte" />}>
                  <BovedaMontePage />
                </Suspense>
              </AppWrapper>
            }
          />
          <Route
            path="/bancos/boveda-usa"
            element={
              <AppWrapper _appName="Bóveda USA" _appColor="blue">
                <Suspense fallback={<LoadingScreen _appName="Bóveda USA" />}>
                  <BovedaUSAPage />
                </Suspense>
              </AppWrapper>
            }
          />
          <Route
            path="/bancos/utilidades"
            element={
              <AppWrapper _appName="Utilidades" _appColor="green">
                <Suspense fallback={<LoadingScreen _appName="Utilidades" />}>
                  <UtilidadesPage />
                </Suspense>
              </AppWrapper>
            }
          />
          <Route
            path="/bancos/fletes"
            element={
              <AppWrapper _appName="Fletes" _appColor="orange">
                <Suspense fallback={<LoadingScreen _appName="Fletes" />}>
                  <FletesPage />
                </Suspense>
              </AppWrapper>
            }
          />
          <Route
            path="/bancos/azteca"
            element={
              <AppWrapper _appName="Azteca" _appColor="red">
                <Suspense fallback={<LoadingScreen _appName="Azteca" />}>
                  <AztecaPage />
                </Suspense>
              </AppWrapper>
            }
          />
          <Route
            path="/bancos/leftie"
            element={
              <AppWrapper _appName="Leftie" _appColor="cyan">
                <Suspense fallback={<LoadingScreen _appName="Leftie" />}>
                  <LeftiePage />
                </Suspense>
              </AppWrapper>
            }
          />
          <Route
            path="/bancos/profit"
            element={
              <AppWrapper _appName="Profit" _appColor="indigo">
                <Suspense fallback={<LoadingScreen _appName="Profit" />}>
                  <ProfitPage />
                </Suspense>
              </AppWrapper>
            }
          />
          <Route
            path="/bancos/banorte"
            element={
              <AppWrapper _appName="Banorte" _appColor="red">
                <Suspense fallback={<LoadingScreen _appName="Banorte" />}>
                  <BanorteePage />
                </Suspense>
              </AppWrapper>
            }
          />

          {/* Rutas de las 5 aplicaciones con Suspense para lazy loading */}
          {apps.map((app) => (
            <Route
              key={app.id}
              path={`${app.path}/*`}
              element={
                <AppWrapper _appName={app.name} _appColor={app.color}>
                  <Suspense fallback={<LoadingScreen _appName={app.name} />}>
                    <app.component />
                  </Suspense>
                </AppWrapper>
              }
            />
          ))}
        </Routes>

        {/* Toast Container - Sistema de notificaciones premium */}
        <ChronosToastContainer />
      </ToastProvider>
    </Router>
  );
}

export default App;
