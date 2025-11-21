/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                  FLOWDISTRIBUTOR ROUTER - ROUTING COMPLETO                 ║
 * ║              Lazy Loading + Suspense + 14 Paneles Integrados              ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PremiumLoadingScreen from './components/PremiumLoadingScreen';
import MainLayout from './layouts/MainLayout';

// ═══════════════════════════════════════════════════════════════
// LAZY LOADING DE PANELES
// ═══════════════════════════════════════════════════════════════

// Dashboard Principal
const DashboardMaestroUltra = lazy(() => import('./components/DashboardMaestroUltra'));

// Paneles Core
const PanelVentasUltra = lazy(() => import('./components/PanelVentasUltra'));
const PanelOrdenesCompraUltra = lazy(() => import('./components/PanelOrdenesCompraUltra'));
const PanelDistribuidoresUltra = lazy(() => import('./components/PanelDistribuidoresUltra'));
const PanelClientesUltra = lazy(() => import('./components/PanelClientesUltra'));
const PanelAlmacenUltra = lazy(() => import('./components/PanelAlmacenUltra'));

// Paneles de Bancos (7 bancos)
const PanelBovedaMonteUltra = lazy(() => import('./components/PanelBovedaMonteUltra'));
const PanelBovedaUSAUltra = lazy(() => import('./components/PanelBovedaUSAUltra'));
const PanelUtilidadesUltra = lazy(() => import('./components/PanelUtilidadesUltra'));
const PanelFletesUltra = lazy(() => import('./components/PanelFletesUltra'));
const PanelAztecaUltra = lazy(() => import('./components/PanelAztecaUltra'));
const PanelLeftieUltra = lazy(() => import('./components/PanelLeftieUltra'));
const PanelProfitUltra = lazy(() => import('./components/PanelProfitUltra'));

// Panel IA y Reportes
const PanelIA = lazy(() => import('./components/PanelIA'));
const PanelReportesUltra = lazy(() => import('./components/PanelReportesUltra'));

// ═══════════════════════════════════════════════════════════════
// LOADING FALLBACK
// ═══════════════════════════════════════════════════════════════
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <PremiumLoadingScreen appName="FlowDistributor" />
  </div>
);

// ═══════════════════════════════════════════════════════════════
// ROUTER PRINCIPAL
// ═══════════════════════════════════════════════════════════════
export const FlowDistributorRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Dashboard Principal */}
        <Route
          index
          element={
            <Suspense fallback={<LoadingFallback />}>
              <DashboardMaestroUltra />
            </Suspense>
          }
        />

        {/* ═══════════════════════════════════════════════════════════════
            PANELES CORE
            ═══════════════════════════════════════════════════════════════ */}
        <Route
          path="ventas"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PanelVentasUltra />
            </Suspense>
          }
        />

        <Route
          path="ordenes-compra"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PanelOrdenesCompraUltra />
            </Suspense>
          }
        />

        <Route
          path="distribuidores"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PanelDistribuidoresUltra />
            </Suspense>
          }
        />

        <Route
          path="clientes"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PanelClientesUltra />
            </Suspense>
          }
        />

        <Route
          path="almacen"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PanelAlmacenUltra />
            </Suspense>
          }
        />

        {/* ═══════════════════════════════════════════════════════════════
            PANELES DE BANCOS (7 BANCOS)
            ═══════════════════════════════════════════════════════════════ */}
        <Route path="bancos">
          <Route
            path="boveda-monte"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <PanelBovedaMonteUltra />
              </Suspense>
            }
          />
          <Route
            path="boveda-usa"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <PanelBovedaUSAUltra />
              </Suspense>
            }
          />
          <Route
            path="utilidades"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <PanelUtilidadesUltra />
              </Suspense>
            }
          />
          <Route
            path="fletes"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <PanelFletesUltra />
              </Suspense>
            }
          />
          <Route
            path="azteca"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <PanelAztecaUltra />
              </Suspense>
            }
          />
          <Route
            path="leftie"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <PanelLeftieUltra />
              </Suspense>
            }
          />
          <Route
            path="profit"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <PanelProfitUltra />
              </Suspense>
            }
          />
          {/* Redirect /bancos a primer banco */}
          <Route index element={<Navigate to="boveda-monte" replace />} />
        </Route>

        {/* ═══════════════════════════════════════════════════════════════
            PANEL IA Y REPORTES
            ═══════════════════════════════════════════════════════════════ */}
        <Route
          path="ia"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PanelIA />
            </Suspense>
          }
        />

        <Route
          path="reportes"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PanelReportesUltra />
            </Suspense>
          }
        />

        {/* ═══════════════════════════════════════════════════════════════
            404 - NOT FOUND
            ═══════════════════════════════════════════════════════════════ */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen">
              <h1 className="text-6xl font-bold text-white mb-4">404</h1>
              <p className="text-xl text-gray-400 mb-8">Página no encontrada</p>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-gradient-to-r from-zinc-800 to-zinc-800 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
              >
                Volver al Dashboard
              </button>
            </div>
          }
        />
      </Route>
    </Routes>
  );
};

export default FlowDistributorRouter;
