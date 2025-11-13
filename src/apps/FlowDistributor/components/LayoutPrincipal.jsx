/**
 * 🏗️ LAYOUT PRINCIPAL FLOWDISTRIBUTOR PREMIUM
 * Layout enterprise con navegación PREMIUM y header moderno
 */
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import CollapsedSidebarPremium from './CollapsedSidebarPremium';
import PremiumHeader from './PremiumHeader';

// ============================================================================
// LAYOUT PRINCIPAL CON COMPONENTES PREMIUM
// ============================================================================

export default function LayoutPrincipal({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [activePanel, setActivePanel] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(true); // Colapsado por defecto
  const [systemStatus, setSystemStatus] = useState('ONLINE');
  const [notifications, setNotifications] = useState(3);
  const [totalCapital, setTotalCapital] = useState(450000);

  // Mapeo de rutas a paneles (Actualizado con todas las rutas Ultra)
  const routeToPanel = {
    '/dashboard': 'dashboard',
    '/ventas': 'ventas',
    '/ventas-ultra': 'ventas',
    '/almacen': 'almacen',
    '/almacen-ultra': 'almacen',
    '/boveda-monte': 'boveda-monte',
    '/boveda-monte-ultra': 'boveda-monte',
    '/boveda-usa': 'boveda-usa',
    '/boveda-usa-ultra': 'boveda-usa',
    '/azteca': 'azteca',
    '/azteca-ultra': 'azteca',
    '/utilidades': 'utilidades',
    '/utilidades-ultra': 'utilidades',
    '/gastos-abonos': 'gya',
    '/gya-ultra': 'gya',
    '/leftie': 'leftie',
    '/leftie-ultra': 'leftie',
    '/profit': 'profit',
    '/profit-ultra': 'profit',
    '/fletes': 'fletes',
    '/fletes-ultra': 'fletes',
    '/distribuidores': 'distribuidores',
    '/distribuidores-ultra': 'distribuidores',
    '/clientes': 'clientes',
    '/clientes-ultra': 'clientes',
    '/control-maestro': 'control-maestro',
    '/settings': 'settings',
  };

  // Actualizar panel activo basado en ruta
  const currentPanel = routeToPanel[location.pathname] || 'dashboard';

  // Manejar navegación desde Sidebar Premium
  const handlePanelChange = (panelId) => {
    const routeMap = {
      dashboard: '/dashboard',
      ventas: '/ventas',
      almacen: '/almacen',
      'boveda-monte': '/boveda-monte',
      'boveda-usa': '/boveda-usa',
      azteca: '/azteca',
      utilidades: '/utilidades',
      gya: '/gastos-abonos',
      leftie: '/leftie',
      profit: '/profit',
      fletes: '/fletes',
      distribuidores: '/distribuidores',
      clientes: '/clientes',
      'control-maestro': '/control-maestro',
      settings: '/settings',
    };

    if (routeMap[panelId]) {
      navigate(routeMap[panelId]);
      setActivePanel(panelId);
    }
  };

  // Manejar navegación desde Header Premium
  const handleHeaderNavigation = (panelId) => {
    handlePanelChange(panelId);
  };

  // Manejar toggle del sidebar
  const handleSidebarToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Configurar items del menú premium con todos los Ultra panels
  const premiumMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      gradient: 'from-blue-500 via-cyan-500 to-blue-600',
      glow: 'shadow-[0_0_30px_rgba(59,130,246,0.5)]',
    },
    {
      id: 'ventas',
      label: 'Ventas Ultra',
      icon: 'ShoppingCart',
      gradient: 'from-emerald-500 via-green-500 to-teal-600',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.5)]',
    },
    {
      id: 'almacen',
      label: 'Almacén Ultra',
      icon: 'Package',
      gradient: 'from-purple-500 via-fuchsia-500 to-pink-600',
      glow: 'shadow-[0_0_30px_rgba(168,85,247,0.5)]',
    },
    {
      id: 'distribuidores',
      label: 'Distribuidores',
      icon: 'Users',
      gradient: 'from-blue-500 via-indigo-500 to-purple-600',
      glow: 'shadow-[0_0_30px_rgba(99,102,241,0.5)]',
    },
    {
      id: 'clientes',
      label: 'Clientes Ultra',
      icon: 'Users',
      gradient: 'from-pink-500 via-rose-500 to-red-600',
      glow: 'shadow-[0_0_30px_rgba(236,72,153,0.5)]',
    },
    {
      id: 'fletes',
      label: 'Fletes Ultra',
      icon: 'TrendingUp',
      gradient: 'from-orange-500 via-amber-500 to-yellow-600',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.5)]',
    },
    {
      id: 'bovedas',
      label: 'Bóvedas Ultra',
      icon: 'Building2',
      gradient: 'from-amber-500 via-orange-500 to-red-600',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.5)]',
      submenu: [
        { id: 'boveda-monte', label: 'Bóveda Monte', icon: 'Sparkles' },
        { id: 'boveda-usa', label: 'Bóveda USA', icon: 'Sparkles' },
        { id: 'azteca', label: 'Banco Azteca', icon: 'Sparkles' },
        { id: 'utilidades', label: 'Utilidades', icon: 'TrendingUp' },
        { id: 'leftie', label: 'Leftie Bank', icon: 'Zap' },
        { id: 'profit', label: 'Profit Center', icon: 'TrendingUp' },
        { id: 'gya', label: 'Gastos y Abonos', icon: 'Activity' },
      ],
    },
    {
      id: 'control-maestro',
      label: 'Control Maestro',
      icon: 'Settings',
      gradient: 'from-slate-500 via-gray-500 to-zinc-600',
      glow: 'shadow-[0_0_30px_rgba(148,163,184,0.5)]',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="flex h-screen overflow-hidden">
        {/* CollapsedSidebar Premium - Nuevo componente superior */}
        <CollapsedSidebarPremium
          activeView={currentPanel}
          onNavigate={handlePanelChange}
          menuItems={premiumMenuItems}
          totalCapital={totalCapital}
          notifications={notifications}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Premium Header - Nuevo header moderno */}
          <PremiumHeader
            onSidebarToggle={handleSidebarToggle}
            isSidebarCollapsed={isCollapsed}
            currentUser={{ name: 'Admin', avatar: null }}
            notifications={notifications}
            onNavigate={handleHeaderNavigation}
          />

          {/* Content Area */}
          <main className="flex-1 overflow-auto bg-transparent">
            <div className="h-full">{children || <Outlet />}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
