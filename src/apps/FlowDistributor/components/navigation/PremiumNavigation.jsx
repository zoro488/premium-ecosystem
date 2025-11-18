import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */

import {
  Bell,
  Search,
  User,
  Settings,
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Zap,
  TrendingUp,
  Activity,
} from 'lucide-react';

/**
 * 🎨 COMPONENTES DE NAVEGACIÓN PREMIUM
 * Header, Sidebar y elementos de navegación con efectos modernos
 */

// ============================================
// PREMIUM HEADER con glassmorphism
// ============================================
export const PremiumHeader = ({
  title = 'FlowDistributor',
  subtitle = 'Sistema de Gestión Premium',
  onMenuClick,
  notifications = 0,
  darkMode = false,
  onToggleDarkMode
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${scrolled
          ? 'bg-white/10 backdrop-blur-2xl shadow-glass-lg border-b border-white/10'
          : 'bg-transparent'
        }
      `}
    >
      <div className="max-w-screen-2xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Left Section - Logo & Title */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={onMenuClick}
              className="
                p-2 rounded-xl bg-white/5 backdrop-blur-sm
                hover:bg-white/10 transition-all
                lg:hidden
              "
            >
              <Menu className="w-6 h-6 text-white" />
            </motion.button>

            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="
                  w-12 h-12 rounded-xl
                  bg-gradient-to-br from-blue-500 to-purple-500
                  flex items-center justify-center
                  shadow-glow-lg animate-glow-pulse
                ">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                </div>
              </div>

              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-white text-gradient">
                  {title}
                </h1>
                <p className="text-xs text-gray-400">{subtitle}</p>
              </div>
            </motion.div>
          </div>

          {/* Center Section - Search */}
          <motion.div
            className="hidden lg:block flex-1 max-w-md"
            animate={{ width: searchFocused ? '100%' : 'auto' }}
          >
            <div className={`
              relative group
              ${searchFocused ? 'ring-2 ring-blue-500/50' : ''}
              rounded-xl transition-all
            `}>
              <Search className="
                absolute left-3 top-1/2 -translate-y-1/2
                w-5 h-5 text-gray-400
                group-hover:text-blue-400 transition-colors
              " />
              <input
                type="text"
                placeholder="Buscar transacciones, clientes..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="
                  w-full pl-11 pr-4 py-2.5 rounded-xl
                  bg-white/5 backdrop-blur-sm
                  border border-white/10
                  text-white placeholder-gray-400
                  hover:bg-white/10 focus:bg-white/10
                  focus:border-blue-500/50
                  transition-all outline-none
                "
              />
              <kbd className="
                absolute right-3 top-1/2 -translate-y-1/2
                px-2 py-1 rounded bg-white/5 border border-white/10
                text-xs text-gray-400
                hidden group-hover:block
              ">
                Ctrl K
              </kbd>
            </div>
          </motion.div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden xl:flex items-center gap-4 mr-4 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-white">+12.5%</span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-white">98.2%</span>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="
                relative p-2 rounded-xl
                bg-white/5 backdrop-blur-sm
                hover:bg-white/10 transition-all
                group
              "
            >
              <Bell className="w-5 h-5 text-white group-hover:animate-wiggle" />
              {notifications > 0 && (
                <span className="
                  absolute -top-1 -right-1
                  w-5 h-5 rounded-full
                  bg-red-500 text-white text-xs font-bold
                  flex items-center justify-center
                  animate-pulse
                ">
                  {notifications}
                </span>
              )}
            </motion.button>

            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleDarkMode}
              className="
                p-2 rounded-xl
                bg-white/5 backdrop-blur-sm
                hover:bg-white/10 transition-all
              "
            >
              <AnimatePresence mode="wait">
                {darkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                  >
                    <Sun className="w-5 h-5 text-yellow-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -180, opacity: 0 }}
                  >
                    <Moon className="w-5 h-5 text-blue-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* User Menu */}
            <UserDropdown />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        initial={{ width: 0 }}
        animate={{ width: scrolled ? '100%' : '0%' }}
        transition={{ duration: 0.3 }}
      />
    </motion.header>
  );
};

// ============================================
// USER DROPDOWN
// ============================================
const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: User, label: 'Mi Perfil', action: () => {} },
    { icon: Settings, label: 'Configuración', action: () => {} },
    { icon: Zap, label: 'Atajos de Teclado', action: () => {} },
    { divider: true },
    { icon: X, label: 'Cerrar Sesión', action: () => {}, danger: true },
  ];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2 px-3 py-2 rounded-xl
          bg-white/5 backdrop-blur-sm
          hover:bg-white/10 transition-all
          border border-white/10
        "
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <ChevronDown className={`
          w-4 h-4 text-white transition-transform
          ${isOpen ? 'rotate-180' : ''}
        `} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="
              absolute right-0 top-full mt-2 w-56
              rounded-xl p-2
              bg-white/10 backdrop-blur-2xl
              border border-white/10
              shadow-premium
            "
          >
            {menuItems.map((item, index) => (
              item.divider ? (
                <div key={index} className="h-px bg-white/10 my-2" />
              ) : (
                <motion.button
                  key={index}
                  whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  onClick={() => {
                    item.action();
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg
                    text-sm transition-all
                    ${item.danger ? 'text-red-400 hover:bg-red-500/10' : 'text-white'}
                  `}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </motion.button>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// PREMIUM BREADCRUMB
// ============================================
export const PremiumBreadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center gap-2 px-6 py-3">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={item.onClick}
            className={`
              text-sm font-medium transition-all
              ${index === items.length - 1
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
              }
            `}
          >
            {item.label}
          </motion.button>
          {index < items.length - 1 && (
            <ChevronDown className="w-4 h-4 text-gray-500 -rotate-90" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// ============================================
// FLOATING ACTION BUTTON
// ============================================
export const FloatingActionButton = ({
  icon: Icon,
  onClick,
  label,
  position = 'bottom-right'
}) => {
  const [showLabel, setShowLabel] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-20 right-6',
    'top-left': 'top-20 left-6',
  };

  return (
    <motion.div
      className={`fixed ${positionClasses[position]} z-40`}
      onMouseEnter={() => setShowLabel(true)}
      onMouseLeave={() => setShowLabel(false)}
    >
      <div className="flex items-center gap-3">
        <AnimatePresence>
          {showLabel && label && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="
                px-4 py-2 rounded-lg
                bg-white/10 backdrop-blur-xl
                border border-white/10
                text-white text-sm font-medium
                whitespace-nowrap
              "
            >
              {label}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClick}
          className="
            w-14 h-14 rounded-full
            bg-gradient-to-br from-blue-500 to-purple-500
            flex items-center justify-center
            shadow-glow-lg hover:shadow-premium
            transition-all
          "
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.button>
      </div>
    </motion.div>
  );
};

// ============================================
// TAB NAVIGATION PREMIUM
// ============================================
export const TabNavigation = ({ tabs = [], activeTab, onChange }) => {
  return (
    <div className="flex gap-2 p-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
      {tabs.map((tab, index) => (
        <motion.button
          key={tab.id || index}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(tab.id || index)}
          className={`
            relative px-6 py-2.5 rounded-lg
            text-sm font-medium transition-all
            ${activeTab === (tab.id || index)
              ? 'text-white'
              : 'text-gray-400 hover:text-white'
            }
          `}
        >
          {/* Active Background */}
          {activeTab === (tab.id || index) && (
            <motion.div
              layoutId="activeTab"
              className="
                absolute inset-0 rounded-lg
                bg-gradient-to-br from-blue-500/20 to-purple-500/20
                border border-white/10
              "
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}

          {/* Tab Content */}
          <span className="relative z-10 flex items-center gap-2">
            {tab.icon && <tab.icon className="w-4 h-4" />}
            {tab.label}
            {tab.badge && (
              <span className="
                px-1.5 py-0.5 rounded-full
                bg-red-500 text-white text-xs font-bold
              ">
                {tab.badge}
              </span>
            )}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
export const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="
            fixed bottom-6 right-6 z-40
            w-12 h-12 rounded-full
            bg-white/10 backdrop-blur-xl
            border border-white/10
            flex items-center justify-center
            hover:bg-white/20 transition-all
            shadow-glass
          "
        >
          <ChevronDown className="w-5 h-5 text-white rotate-180" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default {
  PremiumHeader,
  PremiumBreadcrumb,
  FloatingActionButton,
  TabNavigation,
  ScrollToTopButton,
};
