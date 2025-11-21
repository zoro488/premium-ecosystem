/**
 * 🎯 LAYOUT WRAPPER - Chronos OS
 * App shell con Sidebar + Header + Content
 */
import { ReactNode, useState } from 'react';

import { motion } from 'framer-motion';

import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout Component - App Shell
 */
export function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const handleToggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
  };

  return (
    <div className="min-h-screen bg-chronos-void">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <motion.div
        animate={{
          marginLeft: sidebarCollapsed ? 80 : 280,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-col min-h-screen"
      >
        {/* Header */}
        <Header onToggleSidebar={handleToggleSidebar} />

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Animated Background Effects */}
          <div className="fixed inset-0 pointer-events-none opacity-20 -z-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(0, 217, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 217, 255, 0.05) 1px, transparent 1px)',
                backgroundSize: '50px 50px',
              }}
            />
          </div>

          {/* Content Wrapper */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10"
          >
            {children}
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
}
