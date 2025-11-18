import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import ChronosLogo from '../ChronosLogo';
import { Bell, RefreshCw, Search, Settings, User } from 'lucide-react';

/**
 * 🎯 CHRONOS HEADER - Header unificado para todos los paneles
 * Diseño minimalista con logo animado, search y acciones
 */
const ChronosHeader = ({
  title,
  subtitle,
  showSearch = true,
  showActions = true,
  onSearchChange,
  searchPlaceholder = "Search...",
  customActions,
  notificationCount = 0,
  onNotificationClick,
  onRefresh
}) => {
  const [searchFocused, setSearchFocused] = React.useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative backdrop-blur-xl bg-black/40 border-b border-white/10 px-8 py-6"
    >
      {/* Grid de fondo sutil */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10 flex items-center justify-between">
        {/* Left Side - Logo + Title */}
        <div className="flex items-center gap-6">
          {/* Logo pequeño animado */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="cursor-pointer"
          >
            <ChronosLogo size="sm" animated={true} />
          </motion.div>

          {/* Title con efecto */}
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-light text-white tracking-[0.15em]"
              style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.3 }}
                className="text-xs text-white/50 mt-1 tracking-wider"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        </div>

        {/* Right Side - Search + Actions */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          {showSearch && (
            <motion.div
              animate={{
                width: searchFocused ? 320 : 240,
                scale: searchFocused ? 1.02 : 1
              }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                searchFocused ? 'text-white' : 'text-white/40'
              }`} />
              <input
                type="text"
                placeholder={searchPlaceholder}
                onChange={(e) => onSearchChange?.(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-sm text-white text-sm placeholder-white/30 outline-none transition-all duration-300"
                style={{
                  borderColor: searchFocused ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'
                }}
              />

              {/* Glow effect en focus */}
              {searchFocused && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-sm pointer-events-none"
                  style={{
                    boxShadow: '0 0 20px rgba(255,255,255,0.1)'
                  }}
                />
              )}
            </motion.div>
          )}

          {/* Action Buttons */}
          {showActions && (
            <div className="flex items-center gap-2">
              {/* Custom Actions */}
              {customActions}

              {/* Refresh */}
              {onRefresh && (
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onRefresh}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-white/70" />
                </motion.button>
              )}

              {/* Notifications */}
              {onNotificationClick && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onNotificationClick}
                  className="relative p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm transition-colors"
                >
                  <Bell className="w-4 h-4 text-white/70" />
                  {notificationCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-zinc-9000 rounded-full flex items-center justify-center"
                    >
                      <span className="text-[10px] font-bold text-white">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    </motion.div>
                  )}
                </motion.button>
              )}

              {/* Settings */}
              <motion.button
                whileHover={{ scale: 1.05, rotate: 45 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm transition-colors"
              >
                <Settings className="w-4 h-4 text-white/70" />
              </motion.button>

              {/* User */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm transition-colors"
              >
                <User className="w-4 h-4 text-white/70" />
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Línea decorativa animada */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{ transformOrigin: 'left' }}
      />
    </motion.header>
  );
};

ChronosHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  showSearch: PropTypes.bool,
  showActions: PropTypes.bool,
  onSearchChange: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  customActions: PropTypes.node,
  notificationCount: PropTypes.number,
  onNotificationClick: PropTypes.func,
  onRefresh: PropTypes.func
};

export default ChronosHeader;
