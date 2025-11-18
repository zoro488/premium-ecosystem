/**
 * 🎯 SIDEBAR ULTRA PREMIUM - Chronos OS Advanced
 * Sidebar que se colapsa y expande automáticamente con el cursor
 * Animaciones fluidas y complejas con microinteracciones avanzadas
 */
import { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import {
    BarChart3,
    Building2,
    ChevronDown,
    DollarSign,
    FileText,
    LayoutDashboard,
    Package,
    ShoppingCart,
    Sparkles,
    TrendingUp,
    Users,
    Wallet,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useChronosData } from '@/hooks/useChronosData';

interface MenuItem {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  path: string;
  gradient: string;
  glow: string;
  badge?: number | string;
}

/**
 * Sidebar Premium con expansión automática por proximidad del cursor
 */
export function SidebarPremium() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bancos } = useChronosData();

  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showBancos, setShowBancos] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Animación suave del width basada en expansión
  const width = useSpring(isExpanded ? 280 : 80, {
    damping: 25,
    stiffness: 200
  });

  // Menú principal
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
      gradient: 'from-neon-cyan to-blue-500',
      glow: 'shadow-[0_0_20px_rgba(0,217,255,0.5)]'
    },
    {
      id: 'ventas',
      label: 'Ventas',
      icon: ShoppingCart,
      path: '/ventas',
      gradient: 'from-neon-green to-emerald-500',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]'
    },
    {
      id: 'clientes',
      label: 'Clientes',
      icon: Users,
      path: '/clientes',
      gradient: 'from-neon-purple to-zinc-500',
      glow: 'shadow-[0_0_20px_rgba(139,92,246,0.5)]'
    },
    {
      id: 'almacen',
      label: 'Almacén',
      icon: Package,
      path: '/almacen',
      gradient: 'from-neon-amber to-orange-500',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.5)]'
    },
    {
      id: 'ordenes',
      label: 'Órdenes',
      icon: FileText,
      path: '/ordenes',
      gradient: 'from-blue-500 to-indigo-500',
      glow: 'shadow-[0_0_20px_rgba(99,102,241,0.5)]'
    },
    {
      id: 'distribuidores',
      label: 'Distribuidores',
      icon: TrendingUp,
      path: '/distribuidores',
      gradient: 'from-zinc-500 to-rose-500',
      glow: 'shadow-[0_0_20px_rgba(236,72,153,0.5)]'
    },
    {
      id: 'gastos',
      label: 'Gastos',
      icon: DollarSign,
      path: '/gastos',
      gradient: 'from-red-500 to-zinc-500',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]'
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: BarChart3,
      path: '/reportes',
      gradient: 'from-violet-500 to-zinc-500',
      glow: 'shadow-[0_0_20px_rgba(139,92,246,0.5)]'
    }
  ];

  // Detectar proximidad del cursor al sidebar
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Expandir si el cursor está cerca del borde izquierdo
      if (e.clientX < 300) {
        setIsExpanded(true);
      } else if (e.clientX > 350 && !sidebarRef.current?.contains(e.target as Node)) {
        setIsExpanded(false);
        setShowBancos(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Sidebar Container */}
      <motion.aside
        ref={sidebarRef}
        style={{ width }}
        className="fixed left-0 top-0 h-screen bg-gradient-to-b from-chronos-charcoal/95 via-chronos-graphite/90 to-chronos-charcoal/95 backdrop-blur-2xl border-r border-white/10 z-40 overflow-hidden"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
      >
        {/* Logo Section */}
        <motion.div
          className="h-20 flex items-center px-4 border-b border-white/10 relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
        >
          {/* Background Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-neon-purple/5 to-neon-cyan/5 animate-pulse" />

          <motion.div
            className="relative flex items-center gap-3 w-full"
            animate={{
              opacity: isExpanded ? 1 : 0.8,
              scale: isExpanded ? 1 : 0.9
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Logo Icon */}
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center relative"
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.6, ease: "backInOut" }}
            >
              <Sparkles className="w-5 h-5 text-white" />
              <motion.div
                className="absolute inset-0 rounded-xl bg-white/20"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.2, 0.5]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </motion.div>

            {/* Logo Text */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col"
                >
                  <span className="text-lg font-bold bg-gradient-to-r from-neon-cyan via-white to-neon-purple bg-clip-text text-transparent">
                    FlowDistributor
                  </span>
                  <span className="text-[10px] text-chronos-silver/70">
                    Chronos OS Premium
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Menu Items */}
        <div className="flex flex-col py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent h-[calc(100vh-5rem)]">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavigate(item.path)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                  active
                    ? 'bg-gradient-to-r ' + item.gradient + ' text-white ' + item.glow
                    : 'text-chronos-silver hover:bg-white/5'
                }`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ scale: 1.03, x: 5 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Background Glow on Hover */}
                {hoveredItem === item.id && !active && (
                  <motion.div
                    layoutId="hoverBackground"
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.gradient} opacity-10`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                {/* Icon with Rotation Animation */}
                <motion.div
                  animate={{
                    rotate: active ? [0, 5, -5, 0] : 0,
                    scale: active ? 1.1 : 1
                  }}
                  transition={{
                    rotate: { repeat: active ? Infinity : 0, duration: 2 },
                    scale: { duration: 0.2 }
                  }}
                  className="relative z-10"
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                {/* Label with Slide Animation */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium relative z-10 whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Active Indicator */}
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [1, 0.7, 1]
                    }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}
              </motion.button>
            );
          })}

          {/* Bancos Section */}
          <motion.div
            className="mt-4 pt-4 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              onClick={() => setShowBancos(!showBancos)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-chronos-silver hover:bg-white/5 transition-all w-full"
              whileHover={{ scale: 1.03, x: 5 }}
              whileTap={{ scale: 0.97 }}
            >
              <Building2 className="w-5 h-5" />

              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-sm font-medium flex-1 text-left"
                  >
                    Bancos ({bancos.length})
                  </motion.span>
                )}
              </AnimatePresence>

              {isExpanded && (
                <motion.div
                  animate={{ rotate: showBancos ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              )}
            </motion.button>

            {/* Bancos Submenu */}
            <AnimatePresence>
              {showBancos && isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden pl-4 mt-1 space-y-1"
                >
                  {bancos.map((banco, idx) => (
                    <motion.button
                      key={banco.id}
                      onClick={() => handleNavigate(`/bancos/${banco.id}`)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full transition-all ${
                        location.pathname === `/bancos/${banco.id}`
                          ? 'bg-white/10 text-white'
                          : 'text-chronos-silver hover:bg-white/5'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ x: 5, scale: 1.02 }}
                    >
                      <Wallet className="w-4 h-4" style={{ color: banco.color }} />
                      <span className="truncate">{banco.nombre}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.aside>

      {/* Spacer to push content */}
      <motion.div style={{ width }} className="flex-shrink-0" />
    </>
  );
}

export default SidebarPremium;
