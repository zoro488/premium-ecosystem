/**
 * 🎨 CHRONOS PREMIUM HEADER - ENTERPRISE LEVEL
 * =========================================================
 * Header ultra-moderno inspirado en:
 * - Property Dashboard SaaS interfaces
 * - Hospital management systems
 * - AI Chat Bot modern patterns
 *
 * Características implementadas:
 * - Micro-animaciones fluidas y elegantes
 * - Glassmorphism con múltiples capas
 * - Hover effects con transformaciones 3D
 * - Parallax scrolling en elementos
 * - Search bar con animaciones AI-style
 * - Notifications con pulse effects
 * - Loading states progresivos
 * - Background particle interactions
 */
import { memo, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  Activity,
  Battery,
  Bell,
  ChevronDown,
  Clock,
  Menu,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
  User,
  Wifi,
  Zap,
} from 'lucide-react';
import PropTypes from 'prop-types';

// ============================================================================
// CHRONOS PREMIUM HEADER COMPONENT
// ============================================================================

const PremiumHeader = memo(
  ({
    onSidebarToggle,
    _isSidebarCollapsed = false,
    currentUser = { name: 'Admin', avatar: null },
    notifications = 3,
    onNavigate,
  }) => {
    // ============================================
    // STATE & REFS
    // ============================================
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [_isLoading] = useState(false);

    const headerRef = useRef(null);

    // Mouse tracking for 3D effects
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 400 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    const location = useLocation();
    const navigate = useNavigate();

    // Scroll-based animations
    const { scrollY } = useScroll();
    const headerOpacity = useTransform(scrollY, [0, 50], [1, 0.95]);
    const headerBlur = useTransform(scrollY, [0, 50], [0, 10]);

    // ============================================
    // MOUSE TRACKING EFFECTS
    // ============================================
    useEffect(() => {
      const handleMouseMove = (e) => {
        const rect = headerRef.current?.getBoundingClientRect();
        if (rect) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          mouseX.set((e.clientX - centerX) * 0.05);
          mouseY.set((e.clientY - centerY) * 0.05);
        }
      };

      globalThis.addEventListener('mousemove', handleMouseMove);
      return () => globalThis.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    // ============================================
    // ANIMATION VARIANTS
    // ============================================
    const headerVariants = {
      hidden: { opacity: 0, y: -20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: 'spring',
          damping: 20,
          stiffness: 300,
          staggerChildren: 0.1,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, scale: 0.8, y: -10 },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          type: 'spring',
          damping: 20,
          stiffness: 400,
        },
      },
      hover: {
        scale: 1.05,
        y: -2,
        transition: {
          type: 'spring',
          damping: 15,
          stiffness: 500,
        },
      },
    };

    const pulseVariants = {
      animate: {
        scale: [1, 1.1, 1],
        opacity: [0.7, 1, 0.7],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      },
    };

    const floatingVariants = {
      animate: {
        y: [-5, 5, -5],
        rotate: [-1, 1, -1],
        transition: {
          duration: 4,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        },
      },
    };

    // Paneles Ultra completos
    const ultraPanels = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: Activity,
        gradient: 'from-blue-500 via-cyan-500 to-blue-600',
        description: 'Panel principal de control',
      },
      {
        id: 'fletes',
        label: 'Fletes',
        path: '/fletes',
        icon: TrendingUp,
        gradient: 'from-orange-500 via-amber-500 to-yellow-600',
        description: 'Gestión de fletes y logística',
      },
      {
        id: 'ventas',
        label: 'Ventas',
        path: '/ventas',
        icon: Sparkles,
        gradient: 'from-emerald-500 via-green-500 to-teal-600',
        description: 'Sistema de ventas y facturación',
      },
      {
        id: 'distribuidores',
        label: 'Distribuidores',
        path: '/distribuidores',
        icon: Zap,
        gradient: 'from-blue-500 via-indigo-500 to-purple-600',
        description: 'Gestión de distribuidores',
      },
      {
        id: 'clientes',
        label: 'Clientes',
        path: '/clientes',
        icon: User,
        gradient: 'from-pink-500 via-rose-500 to-red-600',
        description: 'Administración de clientes',
      },
      {
        id: 'almacen',
        label: 'Almacén',
        path: '/almacen',
        icon: Activity,
        gradient: 'from-purple-500 via-violet-500 to-indigo-600',
        description: 'Control de inventario',
      },
      {
        id: 'gastos-abonos',
        label: 'GYA',
        path: '/gastos-abonos',
        icon: TrendingUp,
        gradient: 'from-teal-500 via-cyan-500 to-blue-600',
        description: 'Gastos y abonos',
      },
      {
        id: 'profit',
        label: 'Profit',
        path: '/profit',
        icon: Sparkles,
        gradient: 'from-green-500 via-emerald-500 to-teal-600',
        description: 'Centro de ganancias',
      },
      {
        id: 'utilidades',
        label: 'Utilidades',
        path: '/utilidades',
        icon: Zap,
        gradient: 'from-yellow-500 via-amber-500 to-orange-600',
        description: 'Gestión de utilidades',
      },
      {
        id: 'azteca',
        label: 'Azteca',
        path: '/azteca',
        icon: Activity,
        gradient: 'from-blue-500 via-sky-500 to-cyan-600',
        description: 'Banco Azteca',
      },
      {
        id: 'leftie',
        label: 'Leftie',
        path: '/leftie',
        icon: TrendingUp,
        gradient: 'from-purple-500 via-fuchsia-500 to-pink-600',
        description: 'Leftie Bank',
      },
      {
        id: 'boveda-usa',
        label: 'Bóveda USA',
        path: '/boveda-usa',
        icon: Sparkles,
        gradient: 'from-red-500 via-orange-500 to-yellow-600',
        description: 'Bóveda Estados Unidos',
      },
      {
        id: 'boveda-monte',
        label: 'Bóveda Monte',
        path: '/boveda-monte',
        icon: Zap,
        gradient: 'from-green-500 via-lime-500 to-emerald-600',
        description: 'Bóveda Monte',
      },
      {
        id: 'control-maestro',
        label: 'Control Maestro',
        path: '/control-maestro',
        icon: Settings,
        gradient: 'from-slate-500 via-gray-500 to-zinc-600',
        description: 'Panel de control maestro',
      },
    ];

    // Detectar panel actual
    const currentPanel = ultraPanels.find((panel) => panel.path === location.pathname);

    // Manejar navegación a panel
    const handlePanelNavigation = (panel) => {
      navigate(panel.path);
      if (onNavigate) {
        onNavigate(panel.id);
      }
    };

    // Obtener hora actual
    const getCurrentTime = () => {
      return new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    };

    return (
      <motion.header
        ref={headerRef}
        className="relative h-16 z-50 overflow-hidden"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        style={{
          opacity: headerOpacity,
          filter: `blur(${headerBlur}px)`,
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Advanced Glassmorphism Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/95 to-slate-950/95" />
          <div className="absolute inset-0 border-b border-white/10" />
        </div>

        {/* Enhanced Particle System */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{ x, y }}
            animate={{
              background: [
                'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 50% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Floating particles */}
          {new Array(8).fill(null).map((_, i) => (
            <motion.div
              key={`particle-x${10 + i * 10}-y${20 + (i % 3) * 20}`}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${10 + i * 10}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
              variants={floatingVariants}
              animate="animate"
              transition={{ delay: i * 0.2 }}
            />
          ))}
        </div>

        <motion.div
          className="relative z-10 h-full flex items-center justify-between px-6"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Lado izquierdo - Logo y navegación con Enhanced Animations */}
          <motion.div className="flex items-center space-x-6" variants={headerVariants}>
            {/* Botón de toggle sidebar con 3D Effect */}
            <motion.button
              onClick={onSidebarToggle}
              className="relative group p-2 rounded-xl overflow-hidden"
              variants={itemVariants}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Glassmorphism layers */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <motion.div
                className="relative z-10"
                whileHover={{ rotateY: 180 }}
                transition={{ duration: 0.6 }}
              >
                <Menu className="w-5 h-5 text-white" />
              </motion.div>
            </motion.button>

            {/* Logo y título con AI Glow Effect */}
            <motion.div className="flex items-center space-x-3" variants={itemVariants}>
              <motion.div
                className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 flex items-center justify-center overflow-hidden"
                variants={pulseVariants}
                animate="animate"
                whileHover={{
                  scale: 1.1,
                  rotateY: 15,
                  rotateX: 5,
                  transition: { duration: 0.3 },
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Animated glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 animate-pulse opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent" />

                <motion.div
                  className="relative z-10"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(59, 130, 246, 0.5)',
                      '0 0 40px rgba(139, 92, 246, 0.7)',
                      '0 0 20px rgba(59, 130, 246, 0.5)',
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants} whileHover={{ x: 5 }}>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
                  Chronos
                </h1>
                <p className="text-xs text-slate-400">Enterprise System</p>
              </motion.div>
            </motion.div>
          </motion.div>{' '}
          {/* Centro - Navegación rápida de paneles con Matrix Effect */}
          <motion.div
            className="hidden lg:flex items-center space-x-2 relative group"
            variants={itemVariants}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Enhanced Glassmorphism Container */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex items-center space-x-2 p-2">
              <AnimatePresence>
                {ultraPanels.slice(0, 6).map((panel, index) => {
                  const Icon = panel.icon;
                  const isActive = currentPanel?.id === panel.id;

                  return (
                    <motion.button
                      key={panel.id}
                      onClick={() => handlePanelNavigation(panel)}
                      className={`relative px-3 py-2 rounded-lg text-xs font-medium transition-all group/btn ${
                        isActive
                          ? 'text-white bg-white/10'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      whileTap={{ scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div className="flex items-center space-x-2 relative z-10">
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <Icon className="w-4 h-4" />
                        </motion.div>
                        <span className="group-hover/btn:text-blue-300 transition-colors duration-300">
                          {panel.label}
                        </span>
                      </div>

                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/30 to-purple-500/30"
                          style={{
                            background: `linear-gradient(135deg, ${panel.gradient.replace('from-', '').replace(' via-', ', ').replace(' to-', ', ')})`,
                          }}
                          layoutId="activePanel"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>

              {/* Indicador de más paneles con Floating Effect */}
              <motion.button
                className="px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                variants={floatingVariants}
                animate="animate"
                whileHover={{ scale: 1.05 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
          {/* Lado derecho - Herramientas y usuario con AI Enhancement */}
          <motion.div className="flex items-center space-x-4" variants={headerVariants}>
            {/* AI-Style Search Bar */}
            <motion.div className="relative hidden md:block" variants={itemVariants}>
              <motion.div
                className="relative overflow-hidden rounded-xl"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Enhanced Glassmorphism Background */}
                <div
                  className={`absolute inset-0 backdrop-blur-xl border transition-all ${
                    isSearchFocused
                      ? 'border-cyan-500/50 bg-white/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                />

                {/* AI Glow Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-purple-500/20 transition-opacity ${
                    isSearchFocused ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                <motion.div
                  className="relative z-10 flex items-center space-x-2 px-4 py-2"
                  animate={{
                    width: isSearchFocused ? 300 : 200,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    animate={isSearchFocused ? { scale: 1.1 } : { scale: 1 }}
                  >
                    <Search className="w-4 h-4 text-slate-400" />
                  </motion.div>

                  <input
                    type="text"
                    placeholder="Buscar con IA..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="flex-1 bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
                  />

                  {/* Loading spinner when searching */}
                  <AnimatePresence>
                    {_isLoading && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Estado del sistema con Matrix Indicators */}
            <motion.div
              className="hidden lg:flex items-center space-x-3 text-xs"
              variants={itemVariants}
            >
              <motion.div
                className="flex items-center space-x-1 text-green-400"
                variants={pulseVariants}
                animate="animate"
              >
                <Wifi className="w-4 h-4" />
                <span>Online</span>
              </motion.div>
              <motion.div
                className="flex items-center space-x-1 text-blue-400"
                whileHover={{ scale: 1.1 }}
              >
                <Battery className="w-4 h-4" />
                <span>98%</span>
              </motion.div>
              <motion.div
                className="flex items-center space-x-1 text-slate-400"
                variants={floatingVariants}
                animate="animate"
              >
                <Clock className="w-4 h-4" />
                <span>{getCurrentTime()}</span>
              </motion.div>
            </motion.div>

            {/* Notificaciones con AI Pulse */}
            <motion.div className="relative" variants={itemVariants}>
              <motion.button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-xl overflow-hidden group"
                variants={itemVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Glassmorphism background */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10" />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <motion.div
                  className="relative z-10"
                  whileHover={{ rotate: 15 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Bell className="w-5 h-5 text-white" />
                </motion.div>

                {notifications > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.2 }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 25,
                    }}
                  >
                    {notifications}
                  </motion.span>
                )}
              </motion.button>
            </motion.div>

            {/* Usuario con 3D Avatar */}
            <motion.div className="relative" variants={itemVariants}>
              <motion.button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="relative flex items-center space-x-3 p-2 rounded-xl overflow-hidden group"
                variants={itemVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Enhanced Glassmorphism */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10" />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 flex items-center space-x-3">
                  <motion.div
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 flex items-center justify-center overflow-hidden"
                    whileHover={{
                      scale: 1.1,
                      rotateY: 15,
                      boxShadow: '0 10px 25px rgba(59, 130, 246, 0.5)',
                    }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <User className="w-5 h-5 text-white" />
                  </motion.div>

                  <motion.div className="hidden md:block text-left" whileHover={{ x: 3 }}>
                    <p className="text-sm font-medium bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-slate-400">Administrador</p>
                  </motion.div>

                  <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </motion.div>
                </div>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Panel actual activo - indicador con Enhanced Animation */}
        <AnimatePresence>
          {currentPanel && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5"
              style={{
                background: `linear-gradient(90deg, ${currentPanel.gradient.replace('from-', '').replace(' via-', ', ').replace(' to-', ', ')})`,
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>
      </motion.header>
    );
  }
);

PremiumHeader.displayName = 'PremiumHeader';

PremiumHeader.propTypes = {
  onSidebarToggle: PropTypes.func,
  _isSidebarCollapsed: PropTypes.bool,
  currentUser: PropTypes.shape({
    name: PropTypes.string,
    avatar: PropTypes.string,
  }),
  notifications: PropTypes.number,
  onNavigate: PropTypes.func,
};

export default PremiumHeader;
