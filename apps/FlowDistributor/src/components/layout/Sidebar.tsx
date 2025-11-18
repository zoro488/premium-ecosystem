/**
 * 🎯 SIDEBAR PREMIUM - Chronos OS
 * Sidebar interactivo colapsable con animaciones avanzadas
 * Diseño premium moderno con glassmorphism
 */
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
    BarChart3,
    Building2,
    ChevronDown,
    DollarSign,
    FileText,
    LayoutDashboard,
    Menu,
    Package,
    ShoppingCart,
    TrendingUp,
    Users,
    Wallet,
    X,
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

interface BankMenuItem {
  id: string;
  label: string;
  path: string;
  color: string;
}

/**
 * Sidebar Component - Navigation principal
 */
export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bancos, loading } = useChronosData();

  // Estados
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [banksExpanded, setBanksExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Persistir estado collapsed
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  // Menu items principales
  const mainMenuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
      gradient: 'from-blue-500 via-cyan-500 to-blue-600',
      glow: 'shadow-[0_0_30px_rgba(59,130,246,0.5)]',
    },
    {
      id: 'ventas',
      label: 'Ventas',
      icon: ShoppingCart,
      path: '/ventas',
      gradient: 'from-zinc-500 via-fuchsia-500 to-zinc-600',
      glow: 'shadow-[0_0_30px_rgba(168,85,247,0.5)]',
    },
    {
      id: 'clientes',
      label: 'Clientes',
      icon: Users,
      path: '/clientes',
      gradient: 'from-green-500 via-emerald-500 to-teal-600',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.5)]',
    },
    {
      id: 'almacen',
      label: 'Almacén',
      icon: Package,
      path: '/almacen',
      gradient: 'from-orange-500 via-amber-500 to-yellow-600',
      glow: 'shadow-[0_0_30px_rgba(249,115,22,0.5)]',
    },
    {
      id: 'distribuidores',
      label: 'Distribuidores',
      icon: Building2,
      path: '/distribuidores',
      gradient: 'from-indigo-500 via-zinc-500 to-violet-600',
      glow: 'shadow-[0_0_30px_rgba(99,102,241,0.5)]',
    },
    {
      id: 'ordenes',
      label: 'Órdenes',
      icon: FileText,
      path: '/ordenes',
      gradient: 'from-zinc-500 via-rose-500 to-red-600',
      glow: 'shadow-[0_0_30px_rgba(236,72,153,0.5)]',
    },
    {
      id: 'gastos',
      label: 'Gastos',
      icon: DollarSign,
      path: '/gastos',
      gradient: 'from-red-500 via-orange-500 to-amber-600',
      glow: 'shadow-[0_0_30px_rgba(239,68,68,0.5)]',
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: BarChart3,
      path: '/reportes',
      gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
      glow: 'shadow-[0_0_30px_rgba(6,182,212,0.5)]',
    },
  ];

  // Banco items
  const bankMenuItems: BankMenuItem[] = [
    { id: 'BM', label: 'Bóveda Monte', path: '/bancos/BM', color: '#6366f1' },
    { id: 'FL', label: 'Flete', path: '/bancos/FL', color: '#00d9ff' },
    { id: 'UT', label: 'Utilidades', path: '/bancos/UT', color: '#10b981' },
    { id: 'AZTECA', label: 'Banco Azteca', path: '/bancos/AZTECA', color: '#00d9ff' },
    { id: 'LEFTIE', label: 'Banco Leftie', path: '/bancos/LEFTIE', color: '#ec4899' },
    { id: 'PROFIT', label: 'Banco Profit', path: '/bancos/PROFIT', color: '#f59e0b' },
    { id: 'BOVEDA_USA', label: 'Bóveda USA', path: '/bancos/BOVEDA_USA', color: '#6366f1' },
  ];

  // Calcular capital total
  const capitalTotal = bancos.reduce((sum, banco) => sum + (banco.capitalActual || 0), 0);

  // Verificar si ruta está activa
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Handler de navegación
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // Toggle collapsed
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    if (collapsed) {
      setBanksExpanded(false); // Reset banks cuando se expande
    }
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen z-50 flex flex-col overflow-hidden backdrop-blur-2xl bg-gradient-to-br from-chronos-charcoal/95 via-chronos-obsidian/90 to-chronos-void/95 border-r border-white/10"
    >
      {/* Header */}
      <div className="relative p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3"
            >
              {/* Logo 3D */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="relative"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-zinc-500 to-zinc-500 p-[2px]">
                  <div className="w-full h-full rounded-xl bg-chronos-void flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/30 to-zinc-500/30 blur-md -z-10"
                />
              </motion.div>

              {/* Title */}
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-zinc-400 to-zinc-400 bg-clip-text text-transparent">
                  FlowDistributor
                </h1>
                <p className="text-xs text-chronos-silver flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  v5.0 Chronos
                </p>
              </div>
            </motion.div>
          )}

          {/* Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleCollapsed}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors relative group"
          >
            {collapsed ? <Menu className="w-5 h-5 text-cyan-400" /> : <X className="w-5 h-5 text-cyan-400" />}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-zinc-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity" />
          </motion.button>
        </div>
      </div>

      {/* Menu Principal */}
      <nav className="relative flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
        {mainMenuItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const hovered = hoveredItem === item.id;

          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNavigate(item.path)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`
                w-full relative group flex items-center gap-3 p-3 rounded-xl
                transition-all duration-200
                ${active ? 'bg-gradient-to-r ' + item.gradient : 'hover:bg-white/5'}
              `}
            >
              {/* Glow effect cuando active */}
              {active && <div className={`absolute inset-0 rounded-xl blur-xl -z-10 ${item.glow}`} />}

              {/* Border gradient cuando active */}
              {active && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 via-white/10 to-transparent"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Icon */}
              <div
                className={`
                relative flex items-center justify-center w-10 h-10 rounded-lg
                transition-all duration-200
                ${active ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'}
              `}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-chronos-silver group-hover:text-white'}`} />
                {hovered && !collapsed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 to-zinc-500/20"
                  />
                )}
              </div>

              {/* Label */}
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`
                    flex-1 text-left font-medium transition-colors
                    ${active ? 'text-white' : 'text-chronos-silver group-hover:text-white'}
                  `}
                >
                  {item.label}
                </motion.span>
              )}

              {/* Badge (opcional) */}
              {item.badge && !collapsed && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`
                    px-2 py-0.5 rounded-full text-xs font-bold
                    ${typeof item.badge === 'number' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}
                  `}
                >
                  {item.badge}
                </motion.span>
              )}

              {/* Tooltip cuando collapsed */}
              {collapsed && (
                <AnimatePresence>
                  {hovered && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="absolute left-full ml-2 px-3 py-2 bg-chronos-charcoal/95 backdrop-blur-xl border border-white/10 rounded-lg whitespace-nowrap z-50 shadow-xl"
                    >
                      <span className="text-sm font-medium text-white">{item.label}</span>
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-chronos-charcoal/95 border-l border-t border-white/10 rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.button>
          );
        })}

        {/* Separator */}
        <div className="relative py-3">
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Bancos Section */}
        <div>
          {/* Bancos Header */}
          <motion.button
            whileHover={{ x: 4 }}
            onClick={() => setBanksExpanded(!banksExpanded)}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-zinc-500/20 group-hover:from-cyan-500/30 group-hover:to-zinc-500/30 transition-all">
              <Wallet className="w-5 h-5 text-cyan-400" />
            </div>
            {!collapsed && (
              <>
                <span className="flex-1 text-left text-sm font-bold text-chronos-silver group-hover:text-white transition-colors">
                  BANCOS
                </span>
                <motion.div animate={{ rotate: banksExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-4 h-4 text-chronos-silver group-hover:text-white" />
                </motion.div>
              </>
            )}
          </motion.button>

          {/* Bancos List */}
          <AnimatePresence>
            {(banksExpanded || collapsed) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 space-y-1 overflow-hidden"
              >
                {bankMenuItems.map((bank, index) => {
                  const active = isActive(bank.path);
                  const hovered = hoveredItem === bank.id;

                  return (
                    <motion.button
                      key={bank.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ x: 12, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigate(bank.path)}
                      onMouseEnter={() => setHoveredItem(bank.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`
                        w-full flex items-center gap-3 p-2 pl-6 rounded-lg
                        transition-all duration-200
                        ${active ? 'bg-white/10' : 'hover:bg-white/5'}
                      `}
                    >
                      {/* Color indicator */}
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: bank.color,
                          boxShadow: active ? `0 0 10px ${bank.color}` : 'none',
                        }}
                      />

                      {/* Label */}
                      {!collapsed && (
                        <span className={`text-sm ${active ? 'text-white font-medium' : 'text-chronos-silver'}`}>
                          {bank.label}
                        </span>
                      )}

                      {/* Tooltip cuando collapsed */}
                      {collapsed && (
                        <AnimatePresence>
                          {hovered && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="absolute left-full ml-2 px-3 py-2 bg-chronos-charcoal/95 backdrop-blur-xl border border-white/10 rounded-lg whitespace-nowrap z-50 shadow-xl"
                            >
                              <span className="text-sm font-medium text-white">{bank.label}</span>
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-chronos-charcoal/95 border-l border-t border-white/10 rotate-45" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Footer Stats */}
      <div className="relative p-4 border-t border-white/10">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-xl p-4 backdrop-blur-xl"
          >
            {/* Background gradient animado */}
            <motion.div
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'linear-gradient(135deg, #00d9ff 0%, #6366f1 50%, #10b981 100%)',
                backgroundSize: '200% 200%',
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-chronos-silver font-medium">Capital Total</span>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-zinc-400 to-green-400 bg-clip-text text-transparent">
                {loading ? '...' : `$${capitalTotal.toLocaleString('es-MX')}`}
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-green-400">
                <TrendingUp className="w-3 h-3" />
                <span>+12.5% este mes</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Collapsed state - Just icon */}
        {collapsed && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-zinc-500/20 mx-auto"
          >
            <Wallet className="w-6 h-6 text-cyan-400" />
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
}
