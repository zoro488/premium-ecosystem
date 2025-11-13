/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                    HEADER ULTRA MODERNO - FLOWDISTRIBUTOR                  ║
 * ║                  Navegación Premium con Glassmorphism                      ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { AnimatePresence, motion } from 'framer-motion';
import {
    Bell,
    ChevronDown,
    ChevronRight,
    CreditCard,
    DollarSign,
    HelpCircle,
    Keyboard,
    LogOut,
    Moon,
    PackagePlus,
    Repeat,
    Settings,
    Sparkles,
    Sun,
    User,
    Wallet
} from 'lucide-react';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface QuickActionButton {
  id: string;
  icon: React.ReactNode;
  label: string;
  color: string;
  gradient: string;
  shortcut: string;
  onClick: () => void;
  badge?: {
    show: boolean;
    text?: string;
    color?: string;
    pulse?: boolean;
  };
  dropdown?: {
    enabled: boolean;
    items: Array<{
      icon: string;
      label: string;
      banco?: string;
      color?: string;
      onClick: () => void;
    }>;
  };
}

export const HeaderUltraModerno: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showGastosDropdown, setShowGastosDropdown] = useState(false);
  const [showTransferenciaDropdown, setShowTransferenciaDropdown] = useState(false);
  const [showPagoDropdown, setShowPagoDropdown] = useState(false);

  // ═══════════════════════════════════════════════════════════════
  // BREADCRUMB DINÁMICO
  // ═══════════════════════════════════════════════════════════════
  const getBreadcrumb = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);

    const breadcrumbMap: Record<string, { icon: string; label: string }> = {
      '': { icon: '🏠', label: 'Dashboard' },
      'ventas': { icon: '💰', label: 'Ventas' },
      'ordenes-compra': { icon: '📦', label: 'Órdenes Compra' },
      'distribuidores': { icon: '🚚', label: 'Distribuidores' },
      'clientes': { icon: '👥', label: 'Clientes' },
      'almacen': { icon: '📦', label: 'Almacén' },
      'bancos': { icon: '🏦', label: 'Bancos' },
      'reportes': { icon: '📊', label: 'Reportes' },
      'configuracion': { icon: '⚙️', label: 'Configuración' },
    };

    const items = [{ icon: '🏠', label: 'Dashboard', path: '/' }];

    segments.forEach((segment, index) => {
      const config = breadcrumbMap[segment] || { icon: '📄', label: segment };
      items.push({
        icon: config.icon,
        label: config.label,
        path: '/' + segments.slice(0, index + 1).join('/'),
      });
    });

    return items;
  };

  const breadcrumb = getBreadcrumb();

  // ═══════════════════════════════════════════════════════════════
  // ACCIONES RÁPIDAS
  // ═══════════════════════════════════════════════════════════════
  const quickActions: QuickActionButton[] = [
    {
      id: 'new-sale',
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Nueva Venta',
      color: 'green',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      shortcut: 'Ctrl+N',
      onClick: () => {
        // TODO: Abrir modal de nueva venta
        console.log('Nueva Venta');
      },
      badge: {
        show: true,
        text: 'Hot',
        color: 'red',
        pulse: true,
      },
    },
    {
      id: 'new-purchase',
      icon: <PackagePlus className="w-5 h-5" />,
      label: 'Nueva OC',
      color: 'blue',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      shortcut: 'Ctrl+O',
      onClick: () => {
        // TODO: Abrir modal de orden de compra
        console.log('Nueva OC');
      },
    },
    {
      id: 'expense',
      icon: <Wallet className="w-5 h-5" />,
      label: 'Gasto',
      color: 'red',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      shortcut: 'Ctrl+G',
      onClick: () => setShowGastosDropdown(!showGastosDropdown),
      dropdown: {
        enabled: true,
        items: [
          { icon: '⛰️', label: 'Bóveda Monte', banco: 'bovedaMonte', color: 'purple', onClick: () => console.log('Gasto Monte') },
          { icon: '🗽', label: 'Bóveda USA', banco: 'bovedaUSA', color: 'blue', onClick: () => console.log('Gasto USA') },
          { icon: '💎', label: 'Utilidades', banco: 'utilidades', color: 'green', onClick: () => console.log('Gasto Utilidades') },
          { icon: '🚚', label: 'Fletes', banco: 'fletes', color: 'yellow', onClick: () => console.log('Gasto Fletes') },
          { icon: '🏛️', label: 'Azteca', banco: 'azteca', color: 'indigo', onClick: () => console.log('Gasto Azteca') },
          { icon: '🏦', label: 'Leftie', banco: 'leftie', color: 'teal', onClick: () => console.log('Gasto Leftie') },
          { icon: '💰', label: 'Profit', banco: 'profit', color: 'emerald', onClick: () => console.log('Gasto Profit') },
        ],
      },
    },
    {
      id: 'transfer',
      icon: <Repeat className="w-5 h-5" />,
      label: 'Transferencia',
      color: 'purple',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      shortcut: 'Ctrl+T',
      onClick: () => setShowTransferenciaDropdown(!showTransferenciaDropdown),
    },
    {
      id: 'payment',
      icon: <CreditCard className="w-5 h-5" />,
      label: 'Pago',
      color: 'teal',
      gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
      shortcut: 'Ctrl+P',
      onClick: () => setShowPagoDropdown(!showPagoDropdown),
      dropdown: {
        enabled: true,
        items: [
          { icon: '📦', label: 'Pagar a Distribuidor', onClick: () => console.log('Pagar Distribuidor') },
          { icon: '👤', label: 'Cobrar a Cliente', onClick: () => console.log('Cobrar Cliente') },
        ],
      },
    },
    {
      id: 'ai-assistant',
      icon: <Sparkles className="w-5 h-5" />,
      label: 'IA',
      color: 'indigo',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      shortcut: 'Ctrl+Space',
      onClick: () => {
        // TODO: Toggle AI Widget
        console.log('AI Assistant');
      },
      badge: {
        show: true,
        text: '✨',
        pulse: true,
      },
    },
  ];

  // ═══════════════════════════════════════════════════════════════
  // NOTIFICACIONES MOCK
  // ═══════════════════════════════════════════════════════════════
  const notifications = [
    { id: 1, type: 'alert', icon: '⚠️', title: 'Stock Bajo', message: 'Producto X tiene solo 5 unidades', time: '5 min' },
    { id: 2, type: 'success', icon: '✅', title: 'Venta Registrada', message: 'Venta #1234 completada', time: '10 min' },
    { id: 3, type: 'info', icon: 'ℹ️', title: 'Nuevo Reporte', message: 'Reporte mensual disponible', time: '1 hora' },
    { id: 4, type: 'ai', icon: '🤖', title: 'IA Insight', message: 'Detectado patrón en ventas', time: '2 horas' },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 h-18 z-50"
      style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        backdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(102,126,234,0.15)',
      }}
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* ═══════════════════════════════════════════════════════════════
            SECCIÓN IZQUIERDA: LOGO + BREADCRUMB
            ═══════════════════════════════════════════════════════════════ */}
        <div className="flex items-center gap-4">
          {/* Logo Animado */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
              }}
            >
              💎
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hidden md:block">
              FlowDistributor
            </span>
          </motion.div>

          {/* Breadcrumb */}
          <div className="hidden lg:flex items-center gap-2">
            {breadcrumb.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    index === breadcrumb.length - 1
                      ? 'bg-white/10 text-white font-medium'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </motion.button>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECCIÓN CENTRAL: ACCIONES RÁPIDAS
            ═══════════════════════════════════════════════════════════════ */}
        <div className="hidden xl:flex items-center gap-2">
          {quickActions.map((action) => (
            <div key={action.id} className="relative">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.onClick}
                className="relative h-10 px-4 rounded-xl text-white font-medium text-sm flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
                style={{
                  background: action.gradient,
                }}
                title={`${action.label} (${action.shortcut})`}
              >
                {action.icon}
                <span>{action.label}</span>
                {action.badge?.show && (
                  <span
                    className={`absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      action.badge.pulse ? 'animate-pulse' : ''
                    }`}
                    style={{
                      background: action.badge.color === 'red' ? '#ef4444' : '#10b981',
                    }}
                  >
                    {action.badge.text}
                  </span>
                )}
                {action.dropdown && (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </motion.button>

              {/* Dropdown de Gastos */}
              <AnimatePresence>
                {action.id === 'expense' && showGastosDropdown && action.dropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full mt-2 right-0 w-64 rounded-xl overflow-hidden shadow-2xl z-50"
                    style={{
                      background: 'rgba(17, 24, 39, 0.95)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <div className="p-2">
                      {action.dropdown.items.map((item, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ x: 4 }}
                          onClick={() => {
                            item.onClick();
                            setShowGastosDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-left"
                        >
                          <span className="text-2xl">{item.icon}</span>
                          <span className="text-sm text-white">{item.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dropdown de Pagos */}
              <AnimatePresence>
                {action.id === 'payment' && showPagoDropdown && action.dropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full mt-2 right-0 w-56 rounded-xl overflow-hidden shadow-2xl z-50"
                    style={{
                      background: 'rgba(17, 24, 39, 0.95)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <div className="p-2">
                      {action.dropdown.items.map((item, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ x: 4 }}
                          onClick={() => {
                            item.onClick();
                            setShowPagoDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-left"
                        >
                          <span className="text-xl">{item.icon}</span>
                          <span className="text-sm text-white">{item.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECCIÓN DERECHA: NOTIFICACIONES + PERFIL
            ═══════════════════════════════════════════════════════════════ */}
        <div className="flex items-center gap-3">
          {/* Notificaciones */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-10 h-10 rounded-xl bg-white/10 hover:bg-white/15 flex items-center justify-center transition-colors"
            >
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </motion.button>

            {/* Dropdown Notificaciones */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-full mt-2 right-0 w-96 max-h-[500px] overflow-y-auto rounded-xl shadow-2xl z-50"
                  style={{
                    background: 'rgba(17, 24, 39, 0.95)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notificaciones
                    </h3>
                  </div>
                  <div className="p-2">
                    {notifications.map((notif) => (
                      <motion.div
                        key={notif.id}
                        whileHover={{ x: 4 }}
                        className="p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors mb-2"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{notif.icon}</span>
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm">{notif.title}</p>
                            <p className="text-gray-400 text-xs mt-1">{notif.message}</p>
                            <p className="text-gray-500 text-xs mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Toggle Tema */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, rotate: 180 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/15 flex items-center justify-center transition-colors"
          >
            {isDarkMode ? (
              <Moon className="w-5 h-5 text-white" />
            ) : (
              <Sun className="w-5 h-5 text-white" />
            )}
          </motion.button>

          {/* Perfil Usuario */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <ChevronDown className="w-4 h-4 text-white" />
            </motion.button>

            {/* Dropdown Perfil */}
            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-full mt-2 right-0 w-64 rounded-xl shadow-2xl z-50"
                  style={{
                    background: 'rgba(17, 24, 39, 0.95)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Usuario Admin</p>
                        <p className="text-gray-400 text-sm">admin@flow.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-left">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-white">Mi Perfil</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-left">
                      <Settings className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-white">Configuración</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-left">
                      <Keyboard className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-white">Atajos</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-left">
                      <HelpCircle className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-white">Ayuda</span>
                    </button>
                    <div className="h-px bg-white/10 my-2" />
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 transition-colors text-left">
                      <LogOut className="w-5 h-5 text-red-400" />
                      <span className="text-sm text-red-400">Cerrar Sesión</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default HeaderUltraModerno;
