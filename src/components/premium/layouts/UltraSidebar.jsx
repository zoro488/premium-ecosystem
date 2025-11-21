/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                        CHRONOS ULTRA SIDEBAR                               ║
 * ║           Sidebar Premium con Glassmorphism y Animaciones                  ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * Sidebar ultra-premium con:
 * - Glassmorphism con backdrop blur
 * - Colapsable con animaciones fluidas
 * - Búsqueda integrada de menú
 * - Secciones colapsables
 * - Iconos Lucide con animaciones
 * - Tooltips en modo colapsado
 * - Active states con glow
 * - Submenu support
 *
 * @module UltraSidebar
 * @author CHRONOS System
 * @version 1.0.0
 */
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  Search,
  Settings,
  ShoppingCart,
  Users,
  Wallet,
} from 'lucide-react';

// ============================================================================
// DEFAULT MENU ITEMS
// ============================================================================

const defaultMenuItems = [
  {
    id: 'home',
    label: 'Dashboard',
    icon: Home,
    path: '/',
  },
  {
    id: 'ventas',
    label: 'Ventas',
    icon: ShoppingCart,
    path: '/ventas',
    badge: '12',
    submenu: [
      { id: 'nueva-venta', label: 'Nueva Venta', path: '/ventas/nueva' },
      { id: 'historial', label: 'Historial', path: '/ventas/historial' },
      { id: 'abonos', label: 'Abonos', path: '/ventas/abonos' },
    ],
  },
  {
    id: 'clientes',
    label: 'Clientes',
    icon: Users,
    path: '/clientes',
  },
  {
    id: 'finanzas',
    label: 'Finanzas',
    icon: Wallet,
    path: '/finanzas',
    submenu: [
      { id: 'bovedas', label: 'Bóvedas', path: '/finanzas/bovedas' },
      { id: 'transferencias', label: 'Transferencias', path: '/finanzas/transferencias' },
      { id: 'gastos', label: 'Gastos', path: '/finanzas/gastos' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    path: '/analytics',
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: Settings,
    path: '/settings',
  },
];

// ============================================================================
// ULTRA SIDEBAR COMPONENT
// ============================================================================

export const UltraSidebar = ({
  menuItems = defaultMenuItems,
  collapsed = false,
  onCollapse,
  className = '',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState([]);

  const toggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (onCollapse) onCollapse(newCollapsed);
    // Collapse all submenus when collapsing sidebar
    if (newCollapsed) setExpandedItems([]);
  };

  const toggleSubmenu = (itemId) => {
    if (isCollapsed) return; // No submenu in collapsed mode
    setExpandedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  // Filter menu items by search
  const filteredMenuItems = searchQuery
    ? menuItems.filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : menuItems;

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        width: isCollapsed ? '80px' : '280px',
      }}
      transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
      className={`
        sticky top-0 left-0 h-screen
        backdrop-blur-2xl bg-black/40
        border-r border-white/10
        flex flex-col
        overflow-hidden
        ${className}
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        {!isCollapsed && (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white font-bold text-lg"
          >
            CHRONOS
          </motion.h2>
        )}
        <motion.button
          onClick={toggleCollapse}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="
            p-2 rounded-lg
            bg-white/5 hover:bg-white/10
            border border-white/10
            transition-colors ml-auto
          "
        >
          {isCollapsed ? (
            <ChevronRight size={20} className="text-gray-400" />
          ) : (
            <ChevronLeft size={20} className="text-gray-400" />
          )}
        </motion.button>
      </div>

      {/* Search Bar */}
      {!isCollapsed && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full pl-10 pr-4 py-2
                bg-white/5 border border-white/10
                rounded-lg text-white text-sm
                placeholder-gray-500
                focus:outline-none focus:border-blue-500/50
                transition-colors
              "
            />
          </div>
        </motion.div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {filteredMenuItems.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            isCollapsed={isCollapsed}
            isExpanded={expandedItems.includes(item.id)}
            onToggle={() => toggleSubmenu(item.id)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        {!isCollapsed ? (
          <div className="text-xs text-gray-500 text-center">CHRONOS System v1.0</div>
        ) : (
          <div className="w-full h-1 bg-gradient-to-r from-blue-500 via-zinc-800 to-zinc-800 rounded-full" />
        )}
      </div>
    </motion.aside>
  );
};

// ============================================================================
// MENU ITEM COMPONENT
// ============================================================================

const MenuItem = ({ item, isCollapsed, isExpanded, onToggle }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const hasSubmenu = item.submenu && item.submenu.length > 0;

  return (
    <div className="relative">
      {/* Main Item */}
      <NavLink
        to={item.path}
        onClick={(e) => {
          if (hasSubmenu && !isCollapsed) {
            e.preventDefault();
            onToggle();
          }
        }}
        onMouseEnter={() => isCollapsed && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={({ isActive }) => `
          flex items-center gap-3 px-3 py-2.5 rounded-lg
          transition-all duration-200 group
          ${
            isActive
              ? 'bg-gradient-to-r from-blue-500/20 to-zinc-800/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }
          ${isCollapsed ? 'justify-center' : ''}
        `}
      >
        {/* Icon */}
        <motion.div whileHover={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5 }}>
          <item.icon size={20} className="flex-shrink-0" />
        </motion.div>

        {/* Label + Badge */}
        {!isCollapsed && (
          <>
            <span className="flex-1 font-medium">{item.label}</span>
            {item.badge && (
              <span
                className="
                px-2 py-0.5 text-xs font-bold
                bg-blue-500 text-white
                rounded-full
              "
              >
                {item.badge}
              </span>
            )}
            {hasSubmenu && (
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={16} />
              </motion.div>
            )}
          </>
        )}
      </NavLink>

      {/* Tooltip (collapsed mode) */}
      <AnimatePresence>
        {isCollapsed && showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="
              absolute left-full ml-2 top-0
              px-3 py-2 rounded-lg
              bg-gray-900 border border-white/20
              text-white text-sm font-medium
              whitespace-nowrap shadow-2xl
              z-50
            "
          >
            {item.label}
            {item.badge && (
              <span className="ml-2 px-1.5 py-0.5 bg-blue-500 rounded text-xs">{item.badge}</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submenu */}
      <AnimatePresence>
        {hasSubmenu && !isCollapsed && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-1 ml-9 space-y-1">
              {item.submenu.map((subitem) => (
                <NavLink
                  key={subitem.id}
                  to={subitem.path}
                  className={({ isActive }) => `
                    block px-3 py-2 rounded-lg text-sm
                    transition-colors
                    ${
                      isActive
                        ? 'text-white bg-white/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  {subitem.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UltraSidebar;
