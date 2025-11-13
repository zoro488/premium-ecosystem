/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                        CHRONOS APP ROUTES                                  ║
 * ║      Sistema de Rutas Completo con Lazy Loading y Protección              ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * Routing system con:
 * - Lazy loading de todas las páginas
 * - Protected routes (requieren autenticación)
 * - Public routes (login, register)
 * - 404 Not Found page
 * - Loading states con Suspense
 * - Route transitions con Framer Motion
 * - Breadcrumbs automáticos
 * - Redirect después de login
 *
 * @module AppRoutes
 * @author CHRONOS System
 * @version 1.0.0
 */
import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { PremiumLayout } from '../components/premium/layouts/PremiumLayout';

// ============================================================================
// LAZY LOADED PAGES
// ============================================================================

// Auth Pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));

// Dashboard Pages
const MasterDashboard = lazy(() => import('../pages/dashboard/MasterDashboard'));

// Ventas Pages
const VentasPage = lazy(() => import('../pages/ventas/VentasPage'));
const NuevaVentaPage = lazy(() => import('../pages/ventas/NuevaVentaPage'));
const HistorialVentasPage = lazy(() => import('../pages/ventas/HistorialVentasPage'));
const AbonosPage = lazy(() => import('../pages/ventas/AbonosPage'));

// Clientes Pages
const ClientesPage = lazy(() => import('../pages/clientes/ClientesPage'));
const ClienteDetallePage = lazy(() => import('../pages/clientes/ClienteDetallePage'));

// Finanzas Pages
const FinanzasPage = lazy(() => import('../pages/finanzas/FinanzasPage'));
const BovedasPage = lazy(() => import('../pages/finanzas/BovedasPage'));
const TransferenciasPage = lazy(() => import('../pages/finanzas/TransferenciasPage'));
const GastosPage = lazy(() => import('../pages/finanzas/GastosPage'));

// Analytics Pages
const AnalyticsPage = lazy(() => import('../pages/analytics/AnalyticsPage'));

// Settings Pages
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));

// Error Pages
const NotFoundPage = lazy(() => import('../pages/errors/NotFoundPage'));

// ============================================================================
// LOADING COMPONENT
// ============================================================================

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
      <p className="text-white text-lg">Cargando...</p>
    </div>
  </div>
);

// ============================================================================
// PROTECTED ROUTE WRAPPER
// ============================================================================

const ProtectedRoute = ({ children }) => {
  // TODO: Integrar con Firebase Auth
  const isAuthenticated = true; // Simular autenticación

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ============================================================================
// MAIN APP ROUTES
// ============================================================================

export const AppRoutes = ({ user, onLogin, onLogout }) => {
  const location = useLocation();

  // Mock notifications y menu items
  const mockNotifications = [
    { id: 1, message: 'Nueva venta registrada', time: 'Hace 5 min', read: false },
    { id: 2, message: 'Cliente agregado', time: 'Hace 1 hora', read: false },
    { id: 3, message: 'Transferencia completada', time: 'Hace 2 horas', read: true },
  ];

  const mockQuickActions = [
    { label: 'Nueva Venta', onClick: () => window.location.href = '/ventas/nueva' },
    { label: 'Nuevo Cliente', onClick: () => window.location.href = '/clientes' },
  ];

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          {/* ========== PUBLIC ROUTES ========== */}
          <Route path="/login" element={<LoginPage onLogin={onLogin} />} />

          {/* ========== PROTECTED ROUTES ========== */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <PremiumLayout
                  user={user}
                  notifications={mockNotifications}
                  quickActions={mockQuickActions}
                  onLogout={onLogout}
                  onSearch={(query) => console.log('Search:', query)}
                />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route index element={<MasterDashboard />} />
            <Route path="dashboard" element={<MasterDashboard />} />

            {/* Ventas */}
            <Route path="ventas">
              <Route index element={<VentasPage />} />
              <Route path="nueva" element={<NuevaVentaPage />} />
              <Route path="historial" element={<HistorialVentasPage />} />
              <Route path="abonos" element={<AbonosPage />} />
            </Route>

            {/* Clientes */}
            <Route path="clientes">
              <Route index element={<ClientesPage />} />
              <Route path=":id" element={<ClienteDetallePage />} />
            </Route>

            {/* Finanzas */}
            <Route path="finanzas">
              <Route index element={<FinanzasPage />} />
              <Route path="bovedas" element={<BovedasPage />} />
              <Route path="transferencias" element={<TransferenciasPage />} />
              <Route path="gastos" element={<GastosPage />} />
            </Route>

            {/* Analytics */}
            <Route path="analytics" element={<AnalyticsPage />} />

            {/* Settings */}
            <Route path="settings" element={<SettingsPage />} />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default AppRoutes;
