/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                      MAIN LAYOUT - FLOWDISTRIBUTOR                         ║
 * ║          Layout Principal con Header + Sidebar + Content                   ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FloatingAIWidget } from '../components/FloatingAIWidget';
import HeaderUltraModerno from '../components/HeaderUltraModerno';
import SidebarPremium3D from '../components/SidebarPremium3D';

export const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-purple-950/20">
      {/* Header Fixed Top */}
      <HeaderUltraModerno />

      {/* Layout Container */}
      <div className="flex pt-18">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-18 h-[calc(100vh-4.5rem)] transition-all duration-300 z-40 ${
            sidebarCollapsed ? 'w-20' : 'w-72'
          }`}
        >
          <SidebarPremium3D
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 min-h-[calc(100vh-4.5rem)] transition-all duration-300 ${
            sidebarCollapsed ? 'ml-20' : 'ml-72'
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <AnimatePresence mode="wait">
              <Outlet />
            </AnimatePresence>
          </motion.div>
        </main>
      </div>

      {/* Floating AI Widget */}
      <FloatingAIWidget />
    </div>
  );
};

export default MainLayout;
