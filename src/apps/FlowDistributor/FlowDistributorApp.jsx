/**
 * 🚀 FLOWDISTRIBUTOR PREMIUM COMPLETO
 * Aplicación principal con todas las funcionalidades integradas
 */
import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import PropTypes from 'prop-types';

import ErrorBoundary from '../../components/ErrorBoundary';
import LayoutPrincipal from './components/LayoutPrincipal';

// ============================================================================
// PANELES ULTRA - ÚNICOS COMPONENTES PERMITIDOS
// ============================================================================

// Dashboard principal
const DashboardUltra = lazy(() => import('./components/DashboardUltra'));

// Paneles financieros Ultra
const PanelGYAUltra = lazy(() => import('./components/PanelGYAUltra'));
const PanelProfitUltra = lazy(() => import('./components/PanelProfitUltra'));
const PanelUtilidadesUltra = lazy(() => import('./components/PanelUtilidadesUltra'));

// Paneles bancarios Ultra
const PanelAztecaUltra = lazy(() => import('./components/PanelAztecaUltra'));
const PanelLeftieUltra = lazy(() => import('./components/PanelLeftieUltra'));

// Paneles de bóvedas Ultra
const PanelBovedaUSAUltra = lazy(() => import('./components/PanelBovedaUSAUltra'));
const PanelBovedaMonteUltra = lazy(() => import('./components/PanelBovedaMonteUltra'));

// Paneles de logística Ultra
const PanelFletesUltra = lazy(() => import('./components/PanelFletesUltra'));

// Paneles de gestión Ultra
const PanelDistribuidoresUltra = lazy(() => import('./components/PanelDistribuidoresUltra'));
const PanelClientesUltra = lazy(() => import('./components/PanelClientesUltra'));
const PanelVentasUltra = lazy(() => import('./components/PanelVentasUltra'));
const PanelAlmacen = lazy(() => import('./components/PanelAlmacen'));

// Panel de control Ultra
const PanelControlMaestro = lazy(() => import('./components/PanelControlMaestro'));

// ============================================================================
// CONFIGURACIÓN REACT QUERY
// ============================================================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// ============================================================================
// COMPONENTE DE CARGA
// ============================================================================

const LoadingFallback = ({ message = 'Cargando módulo...' }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="relative mb-6">
        <motion.div
          className="w-20 h-20 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full mx-auto"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Package className="w-8 h-8 text-cyan-400" />
        </motion.div>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-white mb-2"
      >
        FlowDistributor
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-slate-400"
      >
        {message}
      </motion.p>

      {/* Barra de progreso animada */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        className="mt-4 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mx-auto max-w-xs"
      />
    </motion.div>
  </div>
);

LoadingFallback.propTypes = {
  message: PropTypes.string,
};

// ============================================================================
// DASHBOARD ULTRA (Principal del sistema)
// ============================================================================

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function FlowDistributorPremium() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LayoutPrincipal>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Dashboard principal */}
              <Route path="/" element={<Navigate to="dashboard" replace />} />

              {/* PANELES ULTRA ÚNICAMENTE */}

              {/* Dashboard principal */}
              <Route
                path="dashboard"
                element={
                  <Suspense fallback={<LoadingFallback message="Cargando Dashboard Ultra..." />}>
                    <DashboardUltra />
                  </Suspense>
                }
              />

              {/* Paneles de ventas y operaciones */}
              <Route
                path="ventas"
                element={
                  <Suspense fallback={<LoadingFallback message="Cargando Ventas Ultra..." />}>
                    <PanelVentasUltra />
                  </Suspense>
                }
              />

              <Route
                path="almacen"
                element={
                  <Suspense fallback={<LoadingFallback message="Cargando Almacén Ultra..." />}>
                    <PanelAlmacen />
                  </Suspense>
                }
              />

              <Route
                path="clientes"
                element={
                  <Suspense fallback={<LoadingFallback message="Cargando Clientes Ultra..." />}>
                    <PanelClientesUltra />
                  </Suspense>
                }
              />

              <Route
                path="distribuidores"
                element={
                  <Suspense
                    fallback={<LoadingFallback message="Cargando Distribuidores Ultra..." />}
                  >
                    <PanelDistribuidoresUltra />
                  </Suspense>
                }
              />

              <Route
                path="control-maestro"
                element={
                  <Suspense
                    fallback={<LoadingFallback message="Cargando Control Maestro Ultra..." />}
                  >
                    <PanelControlMaestro />
                  </Suspense>
                }
              />

              {/* Paneles financieros */}
              <Route
                path="gastos-abonos"
                element={
                  <Suspense fallback={<LoadingFallback message="Cargando Gastos y Abonos..." />}>
                    <PanelGYAUltra />
                  </Suspense>
                }
              />

              <Route
                path="profit"
                element={
                  <Suspense fallback={<LoadingFallback message="Cargando Profit Ultra..." />}>
                    <PanelProfitUltra />
                  </Suspense>
                }
              />

              <Route
                path="utilidades"
                element={
                  <Suspense fallback={<LoadingFallback message="Cargando Utilidades Ultra..." />}>
                    <PanelUtilidadesUltra />
                  </Suspense>
                }
              />

              {/* Paneles bancarios */}
              <Route
                path="azteca"
                element={
                  <Suspense fallback={<LoadingFallback message="Cargando Banco Azteca Ultra..." />}>
                    <PanelAztecaUltra />
                  </Suspense>
                }
              />

              <Route
                path="leftie"
                element={
                  <Suspense fallback={<LoadingFallback message="Cargando Leftie Ultra..." />}>
                    <PanelLeftieUltra />
                  </Suspense>
                }
              />

              {/* Paneles de bóvedas */}
              <Route
                path="boveda-usa"
                element={
                  <Suspense fallback={<LoadingFallback message="Cargando Bóveda USA Ultra..." />}>
                    <PanelBovedaUSAUltra />
                  </Suspense>
                }
              />

              <Route
                path="boveda-monte"
                element={
                  <Suspense fallback={<LoadingFallback message="Cargando Bóveda Monte Ultra..." />}>
                    <PanelBovedaMonteUltra />
                  </Suspense>
                }
              />

              {/* Paneles de logística */}
              <Route
                path="fletes"
                element={
                  <Suspense fallback={<LoadingFallback message="Cargando Fletes Ultra..." />}>
                    <PanelFletesUltra />
                  </Suspense>
                }
              />

              {/* Ruta por defecto */}
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </Suspense>
        </LayoutPrincipal>
        {/* ReactQuery DevTools - Solo en desarrollo */}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
