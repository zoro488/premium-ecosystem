/**
 * 🎬 CHRONOS SYSTEM - OPTIMIZACIÓN FINAL
 * Configuración de performance y integración completa del sistema
 */
import React, { Suspense, lazy, memo } from 'react';
import PropTypes from 'prop-types';
import { ErrorBoundary } from 'react-error-boundary';

import CinematicLoadingScreen from './CinematicLoadingScreen';
import { TacticalSoundProvider } from './TacticalUIComponents';

// Lazy loading optimizado para todos los paneles
const DashboardControlMaestro = lazy(() =>
  import('../panels/DashboardControlMaestro').then((module) => ({
    default: memo(module.default),
  }))
);

const PanelDistribuidores = lazy(() =>
  import('./PanelDistribuidoresUltra').then((module) => ({
    default: memo(module.default),
  }))
);

const PanelClientes = lazy(() =>
  import('./PanelClientesUltra').then((module) => ({
    default: memo(module.default),
  }))
);

const PanelAnalisisReportes = lazy(() =>
  import('../panels/PanelAnalisisReportes').then((module) => ({
    default: memo(module.default),
  }))
);

const PanelSicarIA = lazy(() =>
  import('../panels/PanelSicarIA').then((module) => ({
    default: memo(module.default),
  }))
);

// ErrorFallback component - moved out of parent
const ErrorFallback = ({ error, resetErrorBoundary, panelName }) => (
  <div className="flex flex-col items-center justify-center h-full p-8 bg-red-900/20 border border-zinc-500/30 rounded-lg">
    <div className="text-6xl mb-4">⚠️</div>
    <h2 className="text-xl font-bold text-zinc-200 mb-2">Error en {panelName}</h2>
    <p className="text-gray-400 mb-4 text-center max-w-md">
      {error.message || 'Ha ocurrido un error inesperado en este panel.'}
    </p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-zinc-9000/20 border border-zinc-500/50 text-zinc-200 rounded-lg hover:bg-zinc-9000/30 transition-all"
    >
      🔄 Reintentar
    </button>
  </div>
);

ErrorFallback.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }).isRequired,
  resetErrorBoundary: PropTypes.func.isRequired,
  panelName: PropTypes.string.isRequired,
};

/**
 * Error Boundary optimizado para paneles
 */
const PanelErrorBoundary = ({ children, panelName }) => {
  return (
    <ErrorBoundary
      FallbackComponent={(props) => <ErrorFallback {...props} panelName={panelName} />}
      onError={(error, errorInfo) => {
        console.error(`Error en ${panelName}:`, error, errorInfo);
        // Aquí se podría integrar con Sentry o similar
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

PanelErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  panelName: PropTypes.string.isRequired,
};

/**
 * Loading optimizado para paneles específicos
 */
const PanelSuspense = ({ children, panelName }) => (
  <Suspense
    fallback={
      <CinematicLoadingScreen
        message={`Cargando ${panelName}...`}
        variant="tactical"
        showProgress={true}
      />
    }
  >
    {children}
  </Suspense>
);

PanelSuspense.propTypes = {
  children: PropTypes.node.isRequired,
  panelName: PropTypes.string.isRequired,
};

/**
 * Wrapper optimizado para cada panel
 */
export const OptimizedPanel = ({ panelType, isActive, ...props }) => {
  // Renderizar solo si el panel está activo para optimizar memoria
  if (!isActive) return null;

  const renderPanel = () => {
    switch (panelType) {
      case 'dashboard':
        return <DashboardControlMaestro isActive={isActive} {...props} />;
      case 'distribuidores':
        return <PanelDistribuidores isActive={isActive} {...props} />;
      case 'clientes':
        return <PanelClientes isActive={isActive} {...props} />;
      case 'analisis':
        return <PanelAnalisisReportes isActive={isActive} {...props} />;
      case 'sicar':
        return <PanelSicarIA isActive={isActive} {...props} />;
      default:
        return <div className="p-8 text-center text-gray-400">Panel no encontrado</div>;
    }
  };

  const panelNames = {
    dashboard: 'Dashboard Control Maestro',
    distribuidores: 'Panel Distribuidores',
    clientes: 'Panel Clientes',
    analisis: 'Panel Análisis y Reportes',
    sicar: 'SICAR IA Assistant',
  };

  return (
    <PanelErrorBoundary panelName={panelNames[panelType]}>
      <PanelSuspense panelName={panelNames[panelType]}>{renderPanel()}</PanelSuspense>
    </PanelErrorBoundary>
  );
};

OptimizedPanel.propTypes = {
  panelType: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
};

/**
 * Sistema de precarga inteligente
 */
export const PreloadManager = () => {
  React.useEffect(() => {
    // Precargar componentes críticos en segundo plano
    const preloadComponents = async () => {
      try {
        // Precargar el dashboard primero (más probable de ser usado)
        await import('../panels/DashboardControlMaestro');

        // Luego precargar otros paneles con delay
        setTimeout(() => import('./PanelDistribuidoresUltra'), 1000);
        setTimeout(() => import('./PanelClientesUltra'), 2000);
        setTimeout(() => import('../panels/PanelAnalisisReportes'), 3000);
        setTimeout(() => import('../panels/PanelSicarIA'), 4000);
      } catch (error) {
        console.warn('Error precargando componentes:', error);
      }
    };

    // Iniciar precarga solo si el usuario no está en una conexión lenta
    if ('connection' in navigator) {
      const connection = navigator.connection;
      if (connection.effectiveType !== 'slow-2g' && connection.effectiveType !== '2g') {
        preloadComponents();
      }
    } else {
      // Fallback para navegadores sin Network Information API
      preloadComponents();
    }
  }, []);

  return null;
};

/**
 * Hook de optimización de performance
 */
export const usePerformanceOptimization = () => {
  React.useEffect(() => {
    // Configurar Web Vitals y métricas de performance
    const setupPerformanceMonitoring = () => {
      // Monitoreo de FCP (First Contentful Paint)
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            console.log('FCP:', entry.startTime);
          }
        }
      }).observe({ entryTypes: ['paint'] });

      // Monitoreo de LCP (Largest Contentful Paint)
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          console.log('LCP:', entry.startTime);
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitoreo de CLS (Cumulative Layout Shift)
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            console.log('CLS:', entry.value);
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });
    };

    if ('PerformanceObserver' in globalThis) {
      setupPerformanceMonitoring();
    }

    // Optimización de memoria - limpiar listeners y timeouts
    return () => {
      // Cleanup automático implementado en cada hook individual
    };
  }, []);
};

/**
 * Provider principal del sistema CHRONOS
 */
export const ChronosSystemProvider = ({ children }) => {
  usePerformanceOptimization();

  return (
    <TacticalSoundProvider>
      <PreloadManager />
      {children}
    </TacticalSoundProvider>
  );
};

ChronosSystemProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Configuración de build optimization
 */
export const buildOptimization = {
  // Configuración para Vite
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Separar vendors
            vendor: ['react', 'react-dom'],
            'framer-motion': ['framer-motion'],
            three: ['three'],
            // Paneles por separado
            'dashboard-chunk': ['./src/apps/FlowDistributor/panels/DashboardControlMaestro'],
            'panels-chunk': [
              './src/apps/FlowDistributor/panels/PanelDistribuidores',
              './src/apps/FlowDistributor/panels/PanelClientes',
            ],
            'analytics-chunk': ['./src/apps/FlowDistributor/panels/PanelAnalisisReportes'],
            'ai-chunk': ['./src/apps/FlowDistributor/panels/PanelSicarIA'],
          },
        },
      },
      // Optimizaciones adicionales
      minify: 'terser',
      sourcemap: false,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,
    },
  },

  // Service Worker para PWA
  serviceWorker: {
    // Cachear assets críticos
    precache: ['/fonts/tactical-font.woff2', '/sounds/ui-sounds.mp3', '/images/tactical-bg.webp'],
    // Estrategias de cache
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/firestore\.googleapis\.com/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'firestore-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24, // 24 horas
          },
        },
      },
    ],
  },
};

export default {
  OptimizedPanel,
  PreloadManager,
  ChronosSystemProvider,
  usePerformanceOptimization,
  buildOptimization,
};
