import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  Package,
  Activity,
  Target,
  Zap,
  Plus,
  Download,
  FileText,
} from 'lucide-react';

// Importar componentes premium
import {
  PremiumHeader,
  PremiumBackground,
  MetricCardPremium,
  GlassCard3D,
  StatWidget,
  MiniChartWidget,
  QuickActionButton,
  TabNavigation,
  FloatingActionButton,
  ScrollToTopButton,
  ProgressRing,
  NotificationBadge,
} from '@/components/premium';

// Importar estilos
import '@/styles/premium-animations.css';

/**
 * 🎨 DASHBOARD PREMIUM DEMO
 * Ejemplo completo de uso de componentes premium
 */

const PremiumDashboardDemo = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(true);

  // Datos de ejemplo
  const metrics = [
    {
      title: 'Ingresos Totales',
      value: '$125,430',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'primary',
    },
    {
      title: 'Clientes Activos',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'success',
    },
    {
      title: 'Ventas del Mes',
      value: '856',
      change: '+15.3%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'purple',
    },
    {
      title: 'Tasa de Conversión',
      value: '3.2%',
      change: '+0.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'warning',
    },
  ];

  const stats = [
    { icon: Package, label: 'Productos', value: 245, color: 'blue' },
    { icon: Activity, label: 'Transacciones', value: 1523, color: 'green' },
    { icon: Target, label: 'Objetivos', value: 87, suffix: '%', color: 'purple' },
    { icon: Zap, label: 'Velocidad', value: 98, suffix: '%', color: 'orange' },
  ];

  const miniCharts = [
    {
      title: 'Ventas Diarias',
      value: '$12,456',
      data: [20, 35, 28, 42, 38, 50, 45, 52, 48, 55],
      color: 'green',
    },
    {
      title: 'Nuevos Clientes',
      value: '234',
      data: [10, 15, 12, 18, 22, 19, 25, 28, 24, 30],
      color: 'blue',
    },
    {
      title: 'Productos Vendidos',
      value: '1,234',
      data: [100, 120, 110, 150, 140, 160, 155, 170, 165, 180],
      color: 'purple',
    },
  ];

  const quickActions = [
    { icon: Plus, label: 'Nueva Venta', color: 'primary' },
    { icon: Users, label: 'Nuevo Cliente', color: 'success' },
    { icon: Package, label: 'Nuevo Producto', color: 'purple' },
  ];

  const tabs = [
    { id: 'overview', label: 'Resumen General', icon: Activity },
    { id: 'analytics', label: 'Analítica', icon: TrendingUp, badge: 3 },
    { id: 'reports', label: 'Reportes', icon: FileText },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Background Effects */}
      <PremiumBackground theme="aurora" interactive={true} />

      {/* Header */}
      <PremiumHeader
        title="FlowDistributor"
        subtitle="Sistema de Gestión Premium 2025"
        notifications={5}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onMenuClick={() => console.log('Menu clicked')}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 pt-24 pb-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 text-gradient">
            ¡Bienvenido de nuevo! 👋
          </h1>
          <p className="text-gray-400 text-lg">
            Aquí está un resumen de tu negocio hoy
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-fade-in">
          {metrics.map((metric, index) => (
            <MetricCardPremium
              key={index}
              {...metric}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* Stats Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatWidget {...stat} animated={true} />
            </motion.div>
          ))}
        </div>

        {/* Mini Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {miniCharts.map((chart, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <MiniChartWidget {...chart} />
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Wide Card */}
          <div className="lg:col-span-2">
            <GlassCard3D className="h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    Actividad Reciente
                  </h3>
                  <p className="text-gray-400">Últimas transacciones y eventos</p>
                </div>
                <div className="flex gap-2">
                  <QuickActionButton
                    icon={Download}
                    label="Exportar"
                    onClick={() => console.log('Export')}
                    color="primary"
                  />
                </div>
              </div>

              {/* Activity List */}
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <motion.div
                    key={item}
                    whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    className="flex items-center justify-between p-4 rounded-xl border border-white/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-800 flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Venta #{1000 + item}</p>
                        <p className="text-sm text-gray-400">Cliente Premium - Hace 2 horas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-zinc-200 font-bold">+$234.50</p>
                      <p className="text-xs text-gray-400">Completado</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard3D>
          </div>

          {/* Right Column - Progress & Quick Actions */}
          <div className="space-y-6">
            {/* Progress Card */}
            <GlassCard3D>
              <h3 className="text-xl font-bold text-white mb-6">
                Objetivos del Mes
              </h3>
              <div className="flex flex-col items-center justify-center py-6">
                <ProgressRing
                  percentage={75}
                  size={160}
                  strokeWidth={10}
                  color="purple"
                  label="Completado"
                />
                <div className="mt-6 text-center">
                  <p className="text-2xl font-bold text-white">$93,750</p>
                  <p className="text-sm text-gray-400">de $125,000 objetivo</p>
                </div>
              </div>
            </GlassCard3D>

            {/* Quick Actions Card */}
            <GlassCard3D>
              <h3 className="text-xl font-bold text-white mb-4">
                Acciones Rápidas
              </h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <QuickActionButton
                    key={index}
                    {...action}
                    onClick={() => console.log(`Action: ${action.label}`)}
                  />
                ))}
              </div>
            </GlassCard3D>
          </div>
        </div>

        {/* Bottom Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Uptime', value: 99.9, color: 'green' },
            { label: 'Satisfacción', value: 95, color: 'blue' },
            { label: 'Retención', value: 87, color: 'purple' },
            { label: 'NPS Score', value: 72, color: 'orange' },
          ].map((item, index) => (
            <GlassCard3D key={index} hover3D={false}>
              <div className="flex flex-col items-center justify-center py-4">
                <ProgressRing
                  percentage={item.value}
                  size={100}
                  strokeWidth={6}
                  color={item.color}
                />
                <p className="mt-3 text-white font-semibold">{item.label}</p>
              </div>
            </GlassCard3D>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        icon={Plus}
        label="Nueva Transacción"
        onClick={() => console.log('Nueva transacción')}
        position="bottom-right"
      />

      {/* Scroll to Top */}
      <ScrollToTopButton />
    </div>
  );
};

export default PremiumDashboardDemo;
