/**
 * 🎨 COLLAPSED SIDEBAR PREMIUM
 * Sidebar colapsado por defecto con expansión inteligente al hover
 * Animaciones fluidas, diseño moderno superior a Spline
 */
import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  Building2,
  ChevronRight,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

import { formatCurrency } from '../utils/formatters';

/**
 * Collapsed Sidebar Premium Component
 */
export const CollapsedSidebarPremium = ({
  activeView,
  onNavigate,
  menuItems = [],
  totalCapital = 0,
  notifications = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);

  // 🎨 Iconos principales por defecto
  const defaultMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      gradient: 'from-blue-500 via-cyan-500 to-blue-600',
      glow: 'shadow-[0_0_30px_rgba(59,130,246,0.5)]',
    },
    {
      id: 'almacen',
      label: 'Almacén',
      icon: Package,
      gradient: 'from-emerald-500 via-green-500 to-teal-600',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.5)]',
    },
    {
      id: 'ventas',
      label: 'Ventas',
      icon: ShoppingCart,
      gradient: 'from-purple-500 via-fuchsia-500 to-pink-600',
      glow: 'shadow-[0_0_30px_rgba(168,85,247,0.5)]',
    },
    {
      id: 'bovedas',
      label: 'Bóvedas',
      icon: Building2,
      gradient: 'from-amber-500 via-orange-500 to-red-600',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.5)]',
      submenu: [
        { id: 'bovedaMonte', label: 'Bóveda Monte', icon: Sparkles },
        { id: 'bovedaUsa', label: 'Bóveda USA', icon: Sparkles },
        { id: 'azteca', label: 'Banco Azteca', icon: Sparkles },
        { id: 'utilidades', label: 'Utilidades', icon: TrendingUp },
        { id: 'fleteSur', label: 'Flete Sur', icon: Activity },
        { id: 'leftie', label: 'Leftie', icon: Zap },
        { id: 'profit', label: 'Profit', icon: TrendingUp },
        { id: 'clientes', label: 'Clientes', icon: Users },
      ],
    },
  ];

  const items = menuItems.length > 0 ? menuItems : defaultMenuItems;

  // 🎭 Variantes de animación
  const sidebarVariants = {
    collapsed: {
      width: 80,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
    expanded: {
      width: 280,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const itemVariants = {
    collapsed: {
      justifyContent: 'center',
      padding: '12px',
    },
    expanded: {
      justifyContent: 'flex-start',
      padding: '12px 16px',
    },
  };

  // 🎨 Renderizar item del menú
  const renderMenuItem = (item, index) => {
    const Icon = item.icon;
    const isActive = activeView === item.id;
    const isHovered = hoveredItem === item.id;
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isSubmenuExpanded = expandedSection === item.id;

    return (
      <div key={item.id}>
        {/* Item principal */}
        <motion.button
          variants={itemVariants}
          onClick={() => {
            if (hasSubmenu) {
              setExpandedSection(isSubmenuExpanded ? null : item.id);
            } else {
              onNavigate(item.id);
            }
          }}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          className={`
            w-full flex items-center gap-4 rounded-xl
            transition-all duration-300 relative overflow-hidden
            ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Glow effect cuando está activo */}
          {isActive && (
            <motion.div
              layoutId="activeGlow"
              className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-20 blur-xl`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Icono con efecto holográfico */}
          <motion.div
            className={`
              relative z-10 p-2 rounded-lg
              bg-gradient-to-br ${item.gradient}
              ${isActive || isHovered ? item.glow : ''}
              transition-all duration-300
            `}
            animate={{
              scale: isActive ? 1.1 : 1,
              rotate: isHovered ? [0, -5, 5, 0] : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-5 h-5 text-white" />
          </motion.div>

          {/* Label (solo visible cuando está expandido) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex items-center justify-between"
              >
                <span className="text-white font-medium text-sm">{item.label}</span>

                {hasSubmenu && (
                  <motion.div
                    animate={{ rotate: isSubmenuExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-4 h-4 text-white/60" />
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tooltip cuando está colapsado */}
          {!isExpanded && (
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: -10, scale: 0.9 }}
                  animate={{ opacity: 1, x: 10, scale: 1 }}
                  exit={{ opacity: 0, x: -10, scale: 0.9 }}
                  className={`
                    absolute left-full ml-2 px-3 py-2 rounded-lg
                    bg-gradient-to-r ${item.gradient}
                    ${item.glow}
                    whitespace-nowrap z-50 pointer-events-none
                  `}
                >
                  <span className="text-white font-medium text-sm">{item.label}</span>
                  {/* Flecha del tooltip */}
                  <div
                    className={`
                    absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2
                    w-2 h-2 rotate-45 bg-gradient-to-r ${item.gradient}
                  `}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.button>

        {/* Submenu */}
        <AnimatePresence>
          {hasSubmenu && isExpanded && isSubmenuExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="ml-4 mt-2 space-y-1 overflow-hidden"
            >
              {item.submenu.map((subitem) => {
                const SubIcon = subitem.icon;
                const isSubActive = activeView === subitem.id;

                return (
                  <motion.button
                    key={subitem.id}
                    onClick={() => onNavigate(subitem.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg
                      transition-all duration-200
                      ${isSubActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}
                    `}
                    whileHover={{ x: 4 }}
                  >
                    <SubIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{subitem.label}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="collapsed"
      animate={isExpanded ? 'expanded' : 'collapsed'}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        setIsExpanded(false);
        setExpandedSection(null);
      }}
      className="h-screen relative z-30 flex flex-col"
    >
      {/* Fondo con efecto glassmorphism */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-gradient-to-b from-gray-900/95 via-gray-900/90 to-black/95 border-r border-white/10" />

      {/* Efectos de luz animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 via-transparent to-transparent blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/10 via-transparent to-transparent blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Contenido del Sidebar */}
      <div className="relative z-10 flex flex-col h-full p-4">
        {/* Logo / Brand */}
        <motion.div
          className="mb-8 flex items-center justify-center"
          animate={{ scale: isExpanded ? 1 : 0.9 }}
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            {notifications > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-lg"
              >
                {notifications}
              </motion.div>
            )}
          </motion.div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-4"
              >
                <h1 className="text-white font-bold text-lg">Chronos</h1>
                <p className="text-white/60 text-xs">Enterprise System</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Capital Total */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20"
            >
              <p className="text-white/60 text-xs mb-1">Capital Total</p>
              <p className="text-white font-bold text-xl">{formatCurrency(totalCapital)}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu Items */}
        <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
          {items.map((item, index) => renderMenuItem(item, index))}
        </nav>

        {/* Footer Settings */}
        <motion.div className="mt-auto pt-4 border-t border-white/10 space-y-2">
          <motion.button
            variants={itemVariants}
            onClick={() => onNavigate('settings')}
            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-white font-medium text-sm"
                >
                  Configuración
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>
    </motion.aside>
  );
};

export default CollapsedSidebarPremium;
