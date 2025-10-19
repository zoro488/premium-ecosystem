import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Wallet, 
  Satellite, 
  Brain, 
  Network,
  ArrowLeft,
  Sparkles,
  Loader2
} from 'lucide-react';
import { initGA, logPageView } from './utils/analytics';

// Lazy loading de las 5 aplicaciones para mejorar rendimiento
const FlowDistributor = lazy(() => import('./apps/FlowDistributor/FlowDistributor'));
const ShadowPrime = lazy(() => import('./apps/ShadowPrime/ShadowPrime'));
const Apollo = lazy(() => import('./apps/Apollo/Apollo'));
const Synapse = lazy(() => import('./apps/Synapse/Synapse'));
const Nexus = lazy(() => import('./apps/Nexus/Nexus'));
const FirebaseSetup = lazy(() => import('./components/FirebaseSetup'));

// Componente de Loading optimizado
const LoadingScreen = ({ appName }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950/20 to-purple-950/20">
      <div className="text-center">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity }
          }}
          className="mb-6 mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
        >
          <Loader2 className="w-8 h-8 text-white" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            {appName ? `Cargando ${appName}...` : 'Cargando...'}
          </h2>
          <p className="text-slate-400 text-sm">
            Preparando la aplicación para ti
          </p>
        </motion.div>

        <motion.div
          animate={{ 
            scaleX: [0, 1, 0],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mt-6 h-1 w-48 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
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
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Configuración de las 5 aplicaciones
const apps = [
  {
    id: 'flow',
    name: 'FlowDistributor',
    description: 'Sistema de gestión empresarial y distribución',
    icon: Building2,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    path: '/flow',
    component: FlowDistributor,
  },
  {
    id: 'shadow',
    name: 'ShadowPrime',
    description: 'Gestión avanzada de wallets y criptomonedas',
    icon: Wallet,
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
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
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20',
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
      <div className={`
        absolute inset-0 bg-gradient-to-r ${app.color} 
        opacity-0 group-hover:opacity-10 transition-opacity duration-500
      `} />

      {/* Icono con gradiente */}
      <div className={`
        relative mb-6 p-4 rounded-xl ${app.bgColor}
        border ${app.borderColor}
        inline-block
      `}>
        <Icon className="w-8 h-8" />
      </div>

      {/* Título */}
      <h3 className={`
        text-2xl font-bold mb-3
        bg-gradient-to-r ${app.color}
        text-gradient
      `}>
        {app.name}
      </h3>

      {/* Descripción */}
      <p className="text-slate-400 text-sm leading-relaxed">
        {app.description}
      </p>

      {/* Indicador de "Abrir" */}
      <div className="mt-6 flex items-center gap-2 text-sm text-slate-500 group-hover:text-slate-300 transition-colors">
        <span>Abrir aplicación</span>
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
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
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/20 to-purple-950/20" />

      {/* Contenido principal */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-gradient">
            Premium Ecosystem
          </h1>
          <p className="text-xl text-slate-400">
            5 aplicaciones empresariales de nueva generación
          </p>
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
const AppWrapper = ({ children, appName, appColor }) => {
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
  useEffect(() => {
    initGA();
  }, []);

  return (
    <Router>
      <AnalyticsTracker />
      <Routes>
        {/* Página principal - Hub */}
        <Route path="/" element={<Hub />} />

        {/* Ruta de Firebase Setup */}
        <Route
          path="/firebase-setup"
          element={
            <Suspense fallback={<LoadingScreen appName="Firebase Setup" />}>
              <FirebaseSetup />
            </Suspense>
          }
        />

        {/* Rutas de las 5 aplicaciones con Suspense para lazy loading */}
        {apps.map((app) => (
          <Route
            key={app.id}
            path={app.path}
            element={
              <AppWrapper appName={app.name} appColor={app.color}>
                <Suspense fallback={<LoadingScreen appName={app.name} />}>
                  <app.component />
                </Suspense>
              </AppWrapper>
            }
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
