import { Suspense, lazy } from 'react';
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';

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

// Importación de prueba
import TestApp from './TestApp';

// Lazy loading de las 5 aplicaciones
const FlowDistributor = lazy(() => import('./apps/FlowDistributor/FlowDistributor'));
const ShadowPrime = lazy(() => import('./apps/ShadowPrime/ShadowPrime'));
const Apollo = lazy(() => import('./apps/Apollo/Apollo'));
const Synapse = lazy(() => import('./apps/Synapse/Synapse'));
const Nexus = lazy(() => import('./apps/Nexus/Nexus'));

// Componente de Loading
const LoadingScreen = ({ _appName }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950/20 to-purple-950/20">
      <div className="text-center">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="mx-auto mb-6 w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
        />
        <h2 className="text-2xl font-bold text-white mb-2">Cargando {_appName}...</h2>
        <p className="text-slate-400">Inicializando aplicación empresarial</p>
      </div>
    </div>
  );
};

// Página principal simplificada
const HomePage = () => {
  const navigate = useNavigate();

  const apps = [
    {
      id: 'flowdistributor',
      name: 'FlowDistributor',
      description: 'Sistema completo de gestión bancaria y distribución',
      icon: Building2,
      path: '/flowdistributor',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-500/10 to-cyan-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      id: 'shadowprime',
      name: 'ShadowPrime',
      description: 'Plataforma de gestión empresarial avanzada',
      icon: Wallet,
      path: '/shadowprime',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-500/10 to-pink-500/10',
      borderColor: 'border-purple-500/30',
    },
    {
      id: 'apollo',
      name: 'Apollo',
      description: 'Sistema de análisis y reportes empresariales',
      icon: Satellite,
      path: '/apollo',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-500/10 to-red-500/10',
      borderColor: 'border-orange-500/30',
    },
    {
      id: 'synapse',
      name: 'Synapse',
      description: 'Red neuronal de conexiones empresariales',
      icon: Brain,
      path: '/synapse',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-500/10 to-emerald-500/10',
      borderColor: 'border-green-500/30',
    },
    {
      id: 'nexus',
      name: 'Nexus',
      description: 'Centro de control y monitoreo unificado',
      icon: Network,
      path: '/nexus',
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'from-indigo-500/10 to-blue-500/10',
      borderColor: 'border-indigo-500/30',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-purple-950/20">
      {/* Header */}
      <header className="relative overflow-hidden border-b border-white/10 bg-slate-900/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10" />
        <div className="relative container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-blue-400" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Premium Ecosystem
              </h1>
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Suite empresarial completa con 5 aplicaciones integradas para maximizar tu
              productividad
            </p>
          </motion.div>
        </div>
      </header>

      {/* Apps Grid */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {apps.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                scale: 1.02,
                y: -5,
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(app.path)}
              className="group relative cursor-pointer"
            >
              <div
                className={`glass border ${app.borderColor} rounded-2xl p-6 h-full transition-all duration-300 hover:border-opacity-60 hover:shadow-2xl hover:shadow-blue-500/10`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${app.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                />

                <div
                  className={`relative mb-6 p-4 rounded-xl ${app.bgColor} border ${app.borderColor}`}
                >
                  <app.icon className="w-12 h-12 text-white mx-auto" />
                </div>

                <div className="relative">
                  <h3
                    className={`text-2xl font-bold mb-3 bg-gradient-to-r ${app.color} bg-clip-text text-transparent`}
                  >
                    {app.name}
                  </h3>

                  <p className="text-slate-400 mb-6 leading-relaxed">{app.description}</p>

                  <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                    <span className="font-semibold">Abrir aplicación</span>
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Test Button */}
      <div className="fixed bottom-6 right-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/test')}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-semibold text-white shadow-lg hover:shadow-green-500/20 transition-all"
        >
          🧪 Test
        </motion.button>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<TestApp />} />
        <Route
          path="/flowdistributor"
          element={
            <Suspense fallback={<LoadingScreen _appName="FlowDistributor" />}>
              <FlowDistributor />
            </Suspense>
          }
        />
        <Route
          path="/shadowprime"
          element={
            <Suspense fallback={<LoadingScreen _appName="ShadowPrime" />}>
              <ShadowPrime />
            </Suspense>
          }
        />
        <Route
          path="/apollo"
          element={
            <Suspense fallback={<LoadingScreen _appName="Apollo" />}>
              <Apollo />
            </Suspense>
          }
        />
        <Route
          path="/synapse"
          element={
            <Suspense fallback={<LoadingScreen _appName="Synapse" />}>
              <Synapse />
            </Suspense>
          }
        />
        <Route
          path="/nexus"
          element={
            <Suspense fallback={<LoadingScreen _appName="Nexus" />}>
              <Nexus />
            </Suspense>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
