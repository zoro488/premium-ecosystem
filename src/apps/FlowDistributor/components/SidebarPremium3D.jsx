// 🎨 SIDEBAR PREMIUM 3D
// Sidebar desplegable con iconos 3D tipo Spline, animaciones reactivas y diseño superior
import { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  Bell,
  Building2,
  ChevronRight,
  DollarSign,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Trash2,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';

import { useFlowStore } from '../../../stores/flowStore';
import { formatCurrency } from '../utils/formatters';
import Icon3D from './Icon3D';
import Logo3D from './Logo3D';
import SyncIndicator from './SyncIndicator';

/**
 * Sidebar Premium 3D con modo colapsado/expandido
 *
 * @param {boolean} isOpen - Si el sidebar está abierto
 * @param {Function} onToggle - Función para toggle del sidebar
 * @param {string} activeView - Vista activa actual
 * @param {Function} onNavigate - Función de navegación
 * @param {Array} menuItems - Items del menú
 * @param {number} totalCapital - Capital total del sistema
 */
export const SidebarPremium3D = ({
  isOpen = true,
  onToggle,
  activeView = 'dashboard',
  onNavigate,
  menuItems = [],
  totalCapital = 0,
  notifications = 0,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sidebarRef = useRef(null);

  // Obtener función para limpiar localStorage
  const clearLocalStorage = useFlowStore((state) => state.clearLocalStorage);

  // Rastrear posición del mouse para efectos 3D
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!sidebarRef.current) return;

      const rect = sidebarRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleToggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleNavigateItem = (itemId) => {
    onNavigate?.(itemId);
  };

  const handleToggleSubmenu = (itemId) => {
    setExpandedSubmenu(expandedSubmenu === itemId ? null : itemId);
  };

  const handleClearLocalStorage = () => {
    if (
      confirm(
        '⚠️ ¿Estás seguro de limpiar todos los datos del localStorage?\n\nEsto eliminará TODOS los datos guardados y aplicará la nueva estructura.\n\nLa aplicación se recargará después.'
      )
    ) {
      clearLocalStorage();
      window.location.reload();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.aside
          ref={sidebarRef}
          initial={{ x: -300, opacity: 0 }}
          animate={{
            x: 0,
            opacity: 1,
            width: collapsed ? 88 : 280,
          }}
          exit={{ x: -300, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
          className="relative flex flex-col h-screen overflow-hidden"
          style={{
            perspective: '2000px',
          }}
        >
          {/* Fondo con gradiente dinámico */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)`,
            }}
          />

          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 backdrop-blur-2xl bg-gradient-to-b from-gray-900/95 to-gray-800/95 border-r border-white/10" />

          {/* Efecto de brillo en borde */}
          <motion.div
            className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-primary/50 to-transparent"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Contenido del sidebar */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Header */}
            <div
              className={`p-4 border-b border-white/10 ${collapsed ? 'flex justify-center' : ''}`}
            >
              <Logo3D collapsed={collapsed} onClick={handleToggleCollapsed} />
            </div>

            {/* Search Bar (solo expandido) */}
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 border-b border-white/10"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all backdrop-blur-xl"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                </div>
              </motion.div>
            )}

            {/* Capital Total Card */}
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4"
                >
                  <motion.div
                    className="relative p-4 rounded-xl overflow-hidden cursor-pointer group"
                    whileHover={{ scale: 1.02, y: -2 }}
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.1))',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    {/* Glow animado */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      style={{
                        background:
                          'radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <motion.div
                          animate={{
                            rotate: [0, 360],
                          }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        >
                          <DollarSign className="w-4 h-4 text-primary" />
                        </motion.div>
                        <p className="text-white/60 text-xs font-medium">Capital Total Sistema</p>
                      </div>
                      <motion.p
                        className="text-2xl font-bold text-white"
                        key={totalCapital}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        {formatCurrency(totalCapital)}
                      </motion.p>

                      {/* Indicador de tendencia */}
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="w-3 h-3 text-success" />
                        <span className="text-xs text-success">+12.5%</span>
                        <span className="text-xs text-white/40">este mes</span>
                      </div>
                    </div>

                    {/* Brillo que cruza */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                      }}
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Menú de Navegación */}
            <nav
              className={`flex-1 overflow-y-auto overflow-x-hidden ${collapsed ? 'px-2' : 'px-4'} py-4 space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent`}
            >
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive =
                  activeView === item.id ||
                  (item.submenu && item.submenu.some((sub) => sub.id === activeView));
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                const isSubmenuExpanded = expandedSubmenu === item.id;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {/* Item principal */}
                    <motion.div
                      className={`relative cursor-pointer ${collapsed ? 'flex justify-center p-2' : 'px-3 py-2'}`}
                      onClick={() => {
                        if (hasSubmenu) {
                          handleToggleSubmenu(item.id);
                        } else {
                          handleNavigateItem(item.id);
                        }
                      }}
                      whileHover={{ scale: 1.02, x: collapsed ? 0 : 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''} ${isActive ? 'text-primary' : 'text-white/60'} transition-colors`}
                      >
                        {/* Icono 3D */}
                        <div className="relative">
                          <Icon3D
                            icon={Icon}
                            variant="glass"
                            theme={item.color || 'blue'}
                            size="sm"
                            animate={isActive}
                          />

                          {/* Badge de notificaciones */}
                          {item.notifications > 0 && (
                            <motion.span
                              className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full flex items-center justify-center text-xs font-bold text-white border border-gray-900"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              whileHover={{ scale: 1.2 }}
                            >
                              {item.notifications}
                            </motion.span>
                          )}
                        </div>

                        {/* Label (solo en modo expandido) */}
                        {!collapsed && (
                          <motion.span
                            className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-white/70'}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </div>

                      {/* Icono de expansión para submenu */}
                      {!collapsed && hasSubmenu && (
                        <motion.div
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                          animate={{
                            rotate: isSubmenuExpanded ? 90 : 0,
                          }}
                        >
                          <ChevronRight className="w-4 h-4 text-white/40" />
                        </motion.div>
                      )}

                      {/* Indicador de activo */}
                      {isActive && (
                        <motion.div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                          layoutId="activeIndicator"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.div>

                    {/* Submenu */}
                    <AnimatePresence>
                      {!collapsed && hasSubmenu && isSubmenuExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-6 mt-2 space-y-1 border-l border-white/10 pl-4"
                        >
                          {item.submenu.map((subitem) => (
                            <motion.button
                              key={subitem.id}
                              onClick={() => handleNavigateItem(subitem.id)}
                              className={`
                                w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium
                                transition-all
                                ${
                                  activeView === subitem.id
                                    ? 'bg-primary/10 text-primary border border-primary/30'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                }
                              `}
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span>{subitem.label}</span>
                              {subitem.saldo !== undefined && (
                                <span className="text-xs font-mono">
                                  {formatCurrency(subitem.saldo)}
                                </span>
                              )}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer */}
            <div className={`border-t border-white/10 ${collapsed ? 'p-2' : 'p-4'}`}>
              {/* Notificaciones */}
              <div className={`mb-3 ${collapsed ? 'flex justify-center' : ''}`}>
                <motion.button
                  className={`relative ${collapsed ? 'w-12 h-12' : 'w-full p-3'} flex items-center gap-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative">
                    <Bell className="w-5 h-5 text-white/60" />
                    {notifications > 0 && (
                      <motion.span
                        className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full flex items-center justify-center text-xs font-bold text-white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.2 }}
                      >
                        {notifications}
                      </motion.span>
                    )}
                  </div>
                  {!collapsed && <span className="text-white/60 text-sm">Notificaciones</span>}
                </motion.button>
              </div>

              {/* Settings */}
              <motion.button
                className={`${collapsed ? 'w-12 h-12 flex items-center justify-center' : 'w-full flex items-center gap-3 px-3 py-2'} rounded-lg bg-white/5 hover:bg-white/10 transition-all mb-3`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon3D icon={Settings} variant="outline" theme="slate" size="sm" />
                {!collapsed && <span className="text-white/60 text-sm">Configuración</span>}
              </motion.button>

              {/* Firestore Sync Indicator */}
              <div className="mb-3">
                <SyncIndicator collapsed={collapsed} />
              </div>

              {/* Clear LocalStorage Button */}
              <motion.button
                onClick={handleClearLocalStorage}
                className={`${collapsed ? 'w-12 h-12 flex items-center justify-center' : 'w-full flex items-center gap-3 px-3 py-2'} rounded-lg bg-zinc-9000/10 hover:bg-zinc-9000/20 border border-zinc-500/30 transition-all mb-3`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title="Limpiar datos del navegador"
              >
                <Icon3D icon={Trash2} variant="outline" theme="danger" size="sm" />
                {!collapsed && (
                  <span className="text-zinc-200 text-sm font-medium">Limpiar Datos</span>
                )}
              </motion.button>

              {/* Collapse Toggle */}
              <motion.button
                onClick={handleToggleCollapsed}
                className={`w-full p-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 transition-all flex items-center justify-center ${!collapsed && 'gap-2'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={{
                    rotate: collapsed ? 0 : 180,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Menu className="w-4 h-4 text-primary" />
                </motion.div>
                {!collapsed && <span className="text-sm text-primary font-medium">Colapsar</span>}
              </motion.button>
            </div>
          </div>

          {/* Efectos visuales decorativos */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Partículas flotantes */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/30 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + i * 20}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default SidebarPremium3D;
