/**
 * 🧭 NAVEGACIÓN PREMIUM
 * Componentes de navegación con efectos líquidos y animaciones
 */
import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';

/**
 * 🌊 LIQUID TAB BAR - Barra de tabs con indicador líquido
 */
export const LiquidTabBar = ({ tabs = [], activeTab, onChange, className = '' }) => {
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  return (
    <div
      className={`relative flex gap-2 p-2 bg-gray-800/40 backdrop-blur-xl rounded-2xl ${className}`}
    >
      {/* Liquid Indicator */}
      <motion.div
        className="absolute h-[calc(100%-16px)] top-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg"
        animate={{
          x: `${activeIndex * (100 / tabs.length)}%`,
          width: `calc(${100 / tabs.length}% - 8px)`,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />

      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            relative z-10 flex-1 px-6 py-3 rounded-xl font-medium
            transition-colors duration-200
            ${activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-gray-200'}
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center justify-center gap-2">
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && (
              <motion.span
                className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                {tab.badge}
              </motion.span>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
};

/**
 * 🍞 BREADCRUMBS - Navegación de migas con efectos hover
 */
export const PremiumBreadcrumbs = ({ items = [] }) => {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <motion.button
            onClick={item.onClick}
            className={`
              px-3 py-1.5 rounded-lg transition-all
              ${
                index === items.length - 1
                  ? 'bg-blue-500/20 text-blue-400 font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }
            `}
            whileHover={{ scale: 1.05, x: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            {item.icon && <span className="mr-1">{item.icon}</span>}
            {item.label}
          </motion.button>

          {index < items.length - 1 && (
            <motion.span
              className="text-gray-600"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              /
            </motion.span>
          )}
        </div>
      ))}
    </nav>
  );
};

/**
 * 🎯 FLOATING ACTION BUTTON - FAB con menú radial
 */
export const FloatingActionButton = ({ actions = [], icon: Icon = Menu }) => {
  const [isOpen, setIsOpen] = useState(false);

  const calculatePosition = (index, total) => {
    const angle = (180 / (total - 1)) * index - 90;
    const radius = 80;
    return {
      x: Math.cos((angle * Math.PI) / 180) * radius,
      y: Math.sin((angle * Math.PI) / 180) * radius,
    };
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Action Buttons */}
      <AnimatePresence>
        {isOpen &&
          actions.map((action, index) => {
            const pos = calculatePosition(index, actions.length);
            return (
              <motion.button
                key={index}
                onClick={() => {
                  action.onClick?.();
                  setIsOpen(false);
                }}
                className="absolute bottom-0 right-0 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg flex items-center justify-center"
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{ scale: 1, x: pos.x, y: pos.y }}
                exit={{ scale: 0, x: 0, y: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                  delay: index * 0.05,
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                title={action.label}
              >
                {action.icon}
              </motion.button>
            );
          })}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-2xl flex items-center justify-center"
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
      >
        <Icon size={24} />
      </motion.button>
    </div>
  );
};

/**
 * 📱 MOBILE MENU - Menú móvil con hamburguesa animada
 */
export const MobileMenu = ({ items = [], isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            className="fixed top-0 right-0 h-full w-80 bg-gray-900/95 backdrop-blur-xl border-l border-gray-700/50 shadow-2xl z-50"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <h2 className="text-xl font-bold text-white">Menú</h2>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2">
              {items.map((item, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    item.onClick?.();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 5 }}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/**
 * 🎨 SIDEBAR - Sidebar con modo mini animado
 */
export const AnimatedSidebar = ({ items = [], isCollapsed, onToggle }) => {
  return (
    <motion.aside
      className="relative h-full bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/50"
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Toggle Button */}
      <motion.button
        onClick={onToggle}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isCollapsed ? 180 : 0 }}
      >
        <ChevronDown size={16} className="rotate-90" />
      </motion.button>

      {/* Logo */}
      <div className="p-6 border-b border-gray-700/50">
        <motion.div
          className="flex items-center gap-3"
          animate={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
            P
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                className="text-xl font-bold text-white"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
              >
                Premium
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation Items */}
      <nav className="p-4 space-y-2">
        {items.map((item, index) => (
          <motion.button
            key={index}
            onClick={item.onClick}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl
              transition-all
              ${
                item.active
                  ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }
            `}
            whileHover={{ x: 5 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  className="flex-1 text-left"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {!isCollapsed && item.badge && (
              <motion.span
                className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {item.badge}
              </motion.span>
            )}
          </motion.button>
        ))}
      </nav>
    </motion.aside>
  );
};

/**
 * 🎯 ANIMATED DROPDOWN - Dropdown con animaciones suaves
 */
export const AnimatedDropdown = ({ trigger, items = [], align = 'left' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.div
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {trigger}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              className={`
                absolute top-full mt-2 min-w-[200px] z-50
                bg-gray-900/95 backdrop-blur-xl rounded-xl
                border border-gray-700/50 shadow-2xl overflow-hidden
                ${align === 'right' ? 'right-0' : 'left-0'}
              `}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="p-2">
                {items.map((item, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      item.onClick?.();
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                      text-left transition-all
                      ${
                        item.danger
                          ? 'text-red-400 hover:bg-red-500/10'
                          : 'text-gray-300 hover:bg-gray-800/50'
                      }
                    `}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ x: 5 }}
                  >
                    {item.icon}
                    <span className="flex-1">{item.label}</span>
                    {item.shortcut && (
                      <kbd className="px-2 py-0.5 text-xs bg-gray-800/50 rounded border border-gray-700">
                        {item.shortcut}
                      </kbd>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default {
  LiquidTabBar,
  PremiumBreadcrumbs,
  FloatingActionButton,
  MobileMenu,
  AnimatedSidebar,
  AnimatedDropdown,
};
