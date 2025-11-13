/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                      CHRONOS PREMIUM LAYOUT                                ║
 * ║            Layout Wrapper con Header + Sidebar + Content                   ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * Layout principal que integra:
 * - UltraHeader con búsqueda y notificaciones
 * - UltraSidebar colapsable
 * - Content area con scroll y padding
 * - Toast notifications
 * - Cosmic background
 * - Loading states
 *
 * @module PremiumLayout
 * @author CHRONOS System
 * @version 1.0.0
 */
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';

import { UltraHeader } from './UltraHeader';
import { UltraSidebar } from './UltraSidebar';

// ============================================================================
// PREMIUM LAYOUT COMPONENT
// ============================================================================

export const PremiumLayout = ({
  user,
  notifications = [],
  menuItems,
  quickActions = [],
  onSearch,
  onLogout,
  showSidebar = true,
  sidebarCollapsed = false,
  onSidebarCollapse,
  children,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Cosmic Background Effect */}
      <CosmicBackground />

      {/* Header */}
      <UltraHeader
        user={user}
        notifications={notifications}
        quickActions={quickActions}
        onSearch={onSearch}
        onLogout={onLogout}
      />

      {/* Layout Container */}
      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <UltraSidebar
            menuItems={menuItems}
            collapsed={sidebarCollapsed}
            onCollapse={onSidebarCollapse}
          />
        )}

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 overflow-auto"
        >
          <div className="container mx-auto p-6 lg:p-8">
            {children || <Outlet />}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

// ============================================================================
// COSMIC BACKGROUND
// ============================================================================

const CosmicBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
    {/* Animated Stars */}
    <div className="absolute inset-0">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          className="absolute w-1 h-1 bg-white rounded-full"
        />
      ))}
    </div>

    {/* Gradient Orbs */}
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{ duration: 8, repeat: Infinity }}
      className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
    />
    <motion.div
      animate={{
        scale: [1.2, 1, 1.2],
        opacity: [0.5, 0.3, 0.5],
      }}
      transition={{ duration: 10, repeat: Infinity }}
      className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
    />
  </div>
);

export default PremiumLayout;
