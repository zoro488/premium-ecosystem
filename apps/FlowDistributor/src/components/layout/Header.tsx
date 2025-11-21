/**
 * 🎯 HEADER PREMIUM - Chronos OS
 * Header con breadcrumbs, user menu, notifications
 */
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
    Bell,
    ChevronRight,
    LogOut,
    Menu,
    Search,
    Settings,
    User,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface Breadcrumb {
  label: string;
  path: string;
}

interface HeaderProps {
  onToggleSidebar?: () => void;
}

/**
 * Header Component
 */
export function Header({ onToggleSidebar }: HeaderProps) {
  const location = useLocation();

  // Estados
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock notifications
  const notifications = [
    { id: 1, title: 'Nueva venta registrada', time: 'Hace 5 min', type: 'success', read: false },
    { id: 2, title: 'Stock bajo: Producto XYZ', time: 'Hace 1 hora', type: 'warning', read: false },
    { id: 3, title: 'Pago recibido de Cliente ABC', time: 'Hace 2 horas', type: 'info', read: true },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Cerrar menus al hacer click afuera
  useEffect(() => {
    const handleClickOutside = () => {
      setUserMenuOpen(false);
      setNotificationsOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Generar breadcrumbs dinámicos
  const getBreadcrumbs = (): Breadcrumb[] => {
    const path = location.pathname;
    const breadcrumbs: Breadcrumb[] = [{ label: 'Dashboard', path: '/' }];

    if (path === '/' || path === '/dashboard') {
      return breadcrumbs;
    }

    if (path.startsWith('/bancos/')) {
      const bancoId = path.split('/').pop() || '';
      const bancoNames: Record<string, string> = {
        BM: 'Bóveda Monte',
        FL: 'Flete',
        UT: 'Utilidades',
        AZTECA: 'Banco Azteca',
        LEFTIE: 'Banco Leftie',
        PROFIT: 'Banco Profit',
        BOVEDA_USA: 'Bóveda USA',
      };
      breadcrumbs.push({ label: 'Bancos', path: '/bancos' });
      breadcrumbs.push({ label: bancoNames[bancoId] || bancoId, path });
      return breadcrumbs;
    }

    // Otras rutas
    const routeNames: Record<string, string> = {
      '/ventas': 'Ventas',
      '/clientes': 'Clientes',
      '/almacen': 'Almacén',
      '/inventario': 'Almacén',
      '/distribuidores': 'Distribuidores',
      '/ordenes': 'Órdenes de Compra',
      '/gastos': 'Gastos y Movimientos',
      '/reportes': 'Reportes y Analíticas',
    };

    const label = routeNames[path] || path.replace('/', '');
    breadcrumbs.push({ label, path });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const currentPage = breadcrumbs[breadcrumbs.length - 1];

  // Page descriptions
  const getPageDescription = (): string => {
    const path = location.pathname;
    const descriptions: Record<string, string> = {
      '/': 'Centro de comando del sistema Chronos',
      '/dashboard': 'Centro de comando del sistema Chronos',
      '/ventas': 'Gestión de ventas y facturación',
      '/clientes': 'CRM y gestión de clientes',
      '/almacen': 'Control de inventario y productos',
      '/inventario': 'Control de inventario y productos',
      '/distribuidores': 'Gestión de proveedores y distribuidores',
      '/ordenes': 'Órdenes de compra y tracking',
      '/gastos': 'Control de gastos y movimientos financieros',
      '/reportes': 'Dashboard ejecutivo y analíticas',
    };

    if (path.startsWith('/bancos/')) {
      return 'Vista detallada de movimientos bancarios';
    }

    return descriptions[path] || 'Sistema de gestión empresarial';
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 backdrop-blur-xl bg-chronos-charcoal/80 border-b border-white/10"
    >
      <div className="px-6 py-4">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-3">
          {/* Left: Mobile toggle + Title */}
          <div className="flex items-center gap-4">
            {/* Mobile toggle */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-chronos-silver" />
            </button>

            {/* Page Title */}
            <div>
              <motion.h1
                key={currentPage.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-zinc-400 to-zinc-400 bg-clip-text text-transparent"
              >
                {currentPage.label}
              </motion.h1>
              <motion.p
                key={getPageDescription()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-chronos-silver mt-0.5"
              >
                {getPageDescription()}
              </motion.p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-chronos-silver" />
              </div>
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-chronos-silver focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setNotificationsOpen(!notificationsOpen);
                  setUserMenuOpen(false);
                }}
                className="relative p-2 hover:bg-white/5 rounded-lg transition-colors group"
              >
                <Bell className="w-5 h-5 text-chronos-silver group-hover:text-white transition-colors" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-zinc-500 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-red-500/50"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 mt-2 w-80 backdrop-blur-xl bg-chronos-charcoal/95 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                  >
                    {/* Header */}
                    <div className="p-4 border-b border-white/10">
                      <h3 className="text-sm font-bold text-white">Notificaciones</h3>
                    </div>

                    {/* List */}
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notif, index) => (
                        <motion.div
                          key={notif.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!notif.read ? 'bg-white/5' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-1.5 ${
                                notif.type === 'success'
                                  ? 'bg-green-400'
                                  : notif.type === 'warning'
                                    ? 'bg-yellow-400'
                                    : 'bg-blue-400'
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white font-medium">{notif.title}</p>
                              <p className="text-xs text-chronos-silver mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-white/10">
                      <button className="w-full text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                        Ver todas las notificaciones
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setUserMenuOpen(!userMenuOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 p-2 pr-3 hover:bg-white/5 rounded-lg transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-zinc-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">Admin</p>
                  <p className="text-xs text-chronos-silver">Administrador</p>
                </div>
              </motion.button>

              {/* User Dropdown */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 mt-2 w-56 backdrop-blur-xl bg-chronos-charcoal/95 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                  >
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-left group">
                        <User className="w-4 h-4 text-chronos-silver group-hover:text-white transition-colors" />
                        <span className="text-sm text-chronos-silver group-hover:text-white transition-colors">
                          Mi Perfil
                        </span>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-left group">
                        <Settings className="w-4 h-4 text-chronos-silver group-hover:text-white transition-colors" />
                        <span className="text-sm text-chronos-silver group-hover:text-white transition-colors">
                          Configuración
                        </span>
                      </button>
                    </div>
                    <div className="border-t border-white/10 p-2">
                      <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 transition-colors text-left group">
                        <LogOut className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-red-400">Cerrar Sesión</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.path} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="w-4 h-4 text-chronos-silver" />}
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  ${index === breadcrumbs.length - 1 ? 'text-cyan-400 font-medium' : 'text-chronos-silver hover:text-white cursor-pointer'}
                  transition-colors
                `}
              >
                {crumb.label}
              </motion.span>
            </div>
          ))}
        </div>
      </div>
    </motion.header>
  );
}
