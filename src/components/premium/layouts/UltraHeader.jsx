/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                        CHRONOS ULTRA HEADER                                ║
 * ║              Header Premium con Búsqueda Global y Notificaciones           ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * Header ultra-premium con:
 * - Glassmorphism con blur dinámico al scroll
 * - Búsqueda global con shortcuts (Cmd+K / Ctrl+K)
 * - Notificaciones en tiempo real
 * - User menu con avatar
 * - Dark mode toggle
 * - Breadcrumbs animados
 * - Actions bar contextual
 *
 * @module UltraHeader
 * @author CHRONOS System
 * @version 1.0.0
 */
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { AnimatePresence, motion } from 'framer-motion';
import { Bell, ChevronRight, LogOut, Moon, Search, Settings, Sun, User } from 'lucide-react';

import { ChronosLogoIcon } from '../../brand/ChronosLogos';
import { CountBadge } from '../ui/StatusBadge';

// ============================================================================
// ULTRA HEADER COMPONENT
// ============================================================================

export const UltraHeader = ({
  user = { name: 'Usuario', email: 'user@chronos.com', avatar: null },
  notifications = [],
  onSearch,
  onLogout,
  quickActions = [],
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut para búsqueda (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Breadcrumbs desde la ruta actual
  const breadcrumbs = location.pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, array) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      path: '/' + array.slice(0, index + 1).join('/'),
    }));

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
        className={`
          sticky top-0 left-0 right-0 z-50
          border-b transition-all duration-300
          ${
            scrolled
              ? 'backdrop-blur-2xl bg-black/50 border-white/10 shadow-2xl'
              : 'backdrop-blur-xl bg-black/30 border-white/5'
          }
        `}
      >
        <div className="max-w-full mx-auto px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left Section: Logo + Breadcrumbs */}
            <div className="flex items-center gap-4">
              {/* Logo */}
              <Link to="/" className="flex-shrink-0">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <ChronosLogoIcon size={40} animated={true} />
                </motion.div>
              </Link>

              {/* Breadcrumbs */}
              {breadcrumbs.length > 0 && (
                <nav className="hidden md:flex items-center gap-2 text-sm">
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                    Inicio
                  </Link>
                  {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.path} className="flex items-center gap-2">
                      <ChevronRight size={14} className="text-gray-600" />
                      <Link
                        to={crumb.path}
                        className={`
                          transition-colors
                          ${
                            index === breadcrumbs.length - 1
                              ? 'text-white font-medium'
                              : 'text-gray-400 hover:text-white'
                          }
                        `}
                      >
                        {crumb.label}
                      </Link>
                    </div>
                  ))}
                </nav>
              )}
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center gap-3">
              {/* Quick Actions */}
              {quickActions.length > 0 && (
                <div className="hidden lg:flex items-center gap-2">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={`action-${index}`}
                      onClick={action.onClick}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="
                        px-3 py-1.5 text-sm font-medium
                        bg-blue-500/20 text-blue-400 border border-blue-500/30
                        rounded-lg backdrop-blur-sm
                        hover:bg-blue-500/30 transition-colors
                      "
                    >
                      {action.label}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Search Button */}
              <motion.button
                onClick={() => setShowSearch(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  p-2 rounded-lg
                  bg-white/5 hover:bg-white/10
                  border border-white/10
                  transition-colors
                "
                title="Buscar (Cmd+K)"
              >
                <Search size={20} className="text-gray-400" />
              </motion.button>

              {/* Notifications */}
              <div className="relative">
                <motion.button
                  onClick={() => setShowNotifications(!showNotifications)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="
                    p-2 rounded-lg relative
                    bg-white/5 hover:bg-white/10
                    border border-white/10
                    transition-colors
                  "
                >
                  <Bell size={20} className="text-gray-400" />
                  {unreadNotifications > 0 && (
                    <div className="absolute -top-1 -right-1">
                      <CountBadge count={unreadNotifications} pulse={true} size="sm" />
                    </div>
                  )}
                </motion.button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <NotificationsPanel
                      notifications={notifications}
                      onClose={() => setShowNotifications(false)}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Dark Mode Toggle */}
              <motion.button
                onClick={() => setDarkMode(!darkMode)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  p-2 rounded-lg
                  bg-white/5 hover:bg-white/10
                  border border-white/10
                  transition-colors
                "
              >
                {darkMode ? (
                  <Sun size={20} className="text-yellow-400" />
                ) : (
                  <Moon size={20} className="text-gray-400" />
                )}
              </motion.button>

              {/* User Menu */}
              <div className="relative">
                <motion.button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="
                    flex items-center gap-2 p-1.5 rounded-lg
                    bg-white/5 hover:bg-white/10
                    border border-white/10
                    transition-colors
                  "
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="hidden md:block text-sm text-white font-medium">
                    {user.name}
                  </span>
                </motion.button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {showUserMenu && (
                    <UserMenu
                      user={user}
                      onClose={() => setShowUserMenu(false)}
                      onLogout={onLogout}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Global Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <SearchModal
            query={searchQuery}
            onChange={setSearchQuery}
            onClose={() => setShowSearch(false)}
            onSearch={onSearch}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// ============================================================================
// SEARCH MODAL
// ============================================================================

const SearchModal = ({ query, onChange, onClose, onSearch }) => {
  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-start justify-center pt-32"
    >
      <motion.div
        initial={{ scale: 0.9, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: -20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl mx-4"
      >
        <form onSubmit={handleSearch} className="relative">
          <div
            className="
            flex items-center gap-3 p-4
            bg-gray-900/90 backdrop-blur-xl
            border border-white/10 rounded-2xl
            shadow-2xl
          "
          >
            <Search size={24} className="text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en CHRONOS..."
              value={query}
              onChange={(e) => onChange(e.target.value)}
              autoFocus
              className="
                flex-1 bg-transparent text-white text-lg
                placeholder-gray-500
                focus:outline-none
              "
            />
            <kbd className="px-2 py-1 text-xs bg-white/10 rounded border border-white/20">ESC</kbd>
          </div>

          {/* Search Results (placeholder) */}
          {query && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                mt-2 p-4 space-y-2
                bg-gray-900/90 backdrop-blur-xl
                border border-white/10 rounded-2xl
                shadow-2xl
              "
            >
              <p className="text-sm text-gray-400">
                Buscar resultados para: <span className="text-white font-medium">{query}</span>
              </p>
            </motion.div>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// NOTIFICATIONS PANEL
// ============================================================================

const NotificationsPanel = ({ notifications, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -10, scale: 0.95 }}
    className="
      absolute right-0 mt-2 w-80
      bg-gray-900/95 backdrop-blur-xl
      border border-white/10 rounded-xl
      shadow-2xl overflow-hidden
      z-50
    "
  >
    <div className="p-4 border-b border-white/10">
      <h3 className="text-white font-semibold">Notificaciones</h3>
    </div>
    <div className="max-h-96 overflow-y-auto">
      {notifications.length === 0 ? (
        <div className="p-8 text-center text-gray-400">No hay notificaciones</div>
      ) : (
        notifications.map((notif) => (
          <motion.div
            key={notif.id}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            className="p-4 border-b border-white/5 cursor-pointer"
          >
            <p className="text-sm text-white">{notif.message}</p>
            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
          </motion.div>
        ))
      )}
    </div>
  </motion.div>
);

// ============================================================================
// USER MENU
// ============================================================================

const UserMenu = ({ user, onClose, onLogout }) => (
  <motion.div
    initial={{ opacity: 0, y: -10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -10, scale: 0.95 }}
    className="
      absolute right-0 mt-2 w-64
      bg-gray-900/95 backdrop-blur-xl
      border border-white/10 rounded-xl
      shadow-2xl overflow-hidden
      z-50
    "
  >
    <div className="p-4 border-b border-white/10">
      <p className="text-white font-semibold">{user.name}</p>
      <p className="text-sm text-gray-400">{user.email}</p>
    </div>
    <div className="p-2">
      <MenuItem icon={User} label="Mi Perfil" onClick={onClose} />
      <MenuItem icon={Settings} label="Configuración" onClick={onClose} />
      <div className="my-2 border-t border-white/10" />
      <MenuItem
        icon={LogOut}
        label="Cerrar Sesión"
        onClick={onLogout}
        className="text-red-400 hover:bg-red-500/10"
      />
    </div>
  </motion.div>
);

const MenuItem = ({ icon: Icon, label, onClick, className = '' }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ x: 4 }}
    className={`
      w-full flex items-center gap-3 px-3 py-2 rounded-lg
      text-sm text-gray-300 hover:text-white
      hover:bg-white/5 transition-colors
      ${className}
    `}
  >
    <Icon size={18} />
    <span>{label}</span>
  </motion.button>
);

export default UltraHeader;
