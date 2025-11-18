/**
 * 🎨 GUÍA DE INTEGRACIÓN PREMIUM
 * Cómo integrar los componentes premium en FlowDistributor.jsx
 */

// ============================================
// PASO 1: IMPORTACIONES NECESARIAS
// ============================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Importar componentes premium
import {
  // Navegación
  PremiumHeader,
  FloatingActionButton,
  ScrollToTopButton,
  TabNavigation,

  // Widgets
  MetricCardPremium,
  GlassCard3D,
  StatWidget,
  MiniChartWidget,
  QuickActionButton,
  ProgressRing,

  // Efectos visuales
  PremiumBackground,
  AuroraBackground,
  SpotlightEffect,
} from './components/premium';

// Importar estilos de animaciones
import './styles/premium-animations.css';

// ============================================
// PASO 2: AGREGAR BACKGROUND AL LAYOUT
// ============================================

function FlowDistributor() {
  const [activePanel, setActivePanel] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Background premium - Agregar al inicio */}
      <PremiumBackground theme="aurora" interactive={true} />

      {/* O usar efectos individuales */}
      {/* <AuroraBackground /> */}
      {/* <SpotlightEffect /> */}

      {/* Header premium - Reemplazar header existente */}
      <PremiumHeader
        title="FlowDistributor"
        subtitle="Sistema de Gestión Financiera"
        notifications={notifications.length}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Contenido principal con z-index relativo */}
      <div className="relative z-10 pt-20">{/* Tu contenido existente */}</div>

      {/* Floating Action Button */}
      <FloatingActionButton
        icon={Plus}
        label="Nueva Transacción"
        onClick={() => setShowFormulario(true)}
        position="bottom-right"
      />

      {/* Scroll to Top */}
      <ScrollToTopButton />
    </div>
  );
}

// ============================================
// PASO 3: REEMPLAZAR METRIC CARDS
// ============================================

// ANTES (código antiguo):
// <div className="bg-white rounded-lg shadow p-6">
//   <h3>Ingresos</h3>
//   <p className="text-2xl">${ingresos}</p>
// </div>

// DESPUÉS (nuevo código):
const MetricasSection = ({ metricas }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <MetricCardPremium
      title="Ingresos Totales"
      value={formatCurrency(metricas.ingresosTotales)}
      change="+12.5%"
      trend="up"
      icon={DollarSign}
      color="primary"
      delay={0}
    />

    <MetricCardPremium
      title="Clientes Activos"
      value={metricas.clientesActivos}
      change="+8.2%"
      trend="up"
      icon={Users}
      color="success"
      delay={0.1}
    />

    <MetricCardPremium
      title="Ventas del Mes"
      value={metricas.ventasMes}
      change="+15.3%"
      trend="up"
      icon={ShoppingCart}
      color="purple"
      delay={0.2}
    />

    <MetricCardPremium
      title="Profit Margin"
      value={`${metricas.profitMargin}%`}
      change="+2.1%"
      trend="up"
      icon={TrendingUp}
      color="warning"
      delay={0.3}
    />
  </div>
);

// ============================================
// PASO 4: MEJORAR PANELES CON GLASS CARDS
// ============================================

// ANTES:
// <div className="bg-white rounded-lg shadow p-6">
//   <h2>Panel de Control</h2>
//   {/* contenido */}
// </div>

// DESPUÉS:
const PanelControl = () => (
  <GlassCard3D className="p-6" hover3D={true}>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-white">Panel de Control</h2>
      <QuickActionButton
        icon={RefreshCw}
        label="Actualizar"
        onClick={handleRefresh}
        color="primary"
      />
    </div>

    {/* Tu contenido existente aquí */}
    <div className="space-y-4">{/* ... */}</div>
  </GlassCard3D>
);

// ============================================
// PASO 5: AGREGAR STATS WIDGETS
// ============================================

const StatsGrid = ({ stats }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <StatWidget
      icon={Package}
      label="Productos"
      value={stats.productos}
      color="blue"
      animated={true}
    />

    <StatWidget
      icon={Activity}
      label="Transacciones"
      value={stats.transacciones}
      color="green"
      animated={true}
    />

    <StatWidget
      icon={Target}
      label="Objetivo"
      value={stats.objetivo}
      suffix="%"
      color="purple"
      animated={true}
    />

    <StatWidget
      icon={Zap}
      label="Velocidad"
      value={stats.velocidad}
      suffix="%"
      color="orange"
      animated={true}
    />
  </div>
);

// ============================================
// PASO 6: MINI CHARTS PARA TENDENCIAS
// ============================================

const TendenciasSection = ({ ventas, clientes, productos }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <MiniChartWidget
      title="Ventas Diarias"
      value={formatCurrency(ventas.hoy)}
      data={ventas.ultimos10Dias}
      color="green"
      sparkline={true}
    />

    <MiniChartWidget
      title="Nuevos Clientes"
      value={clientes.nuevos}
      data={clientes.ultimos10Dias}
      color="blue"
      sparkline={true}
    />

    <MiniChartWidget
      title="Productos Vendidos"
      value={productos.vendidos}
      data={productos.ultimos10Dias}
      color="purple"
      sparkline={true}
    />
  </div>
);

// ============================================
// PASO 7: PROGRESS RINGS PARA OBJETIVOS
// ============================================

const ObjetivosCard = ({ objetivos }) => (
  <GlassCard3D className="p-6">
    <h3 className="text-xl font-bold text-white mb-6">Objetivos del Mes</h3>

    <div className="grid grid-cols-2 gap-6">
      <div className="flex flex-col items-center">
        <ProgressRing
          percentage={objetivos.ventas.porcentaje}
          size={120}
          strokeWidth={8}
          color="green"
          label="Ventas"
        />
        <p className="mt-3 text-sm text-gray-400">
          {formatCurrency(objetivos.ventas.actual)} de {formatCurrency(objetivos.ventas.meta)}
        </p>
      </div>

      <div className="flex flex-col items-center">
        <ProgressRing
          percentage={objetivos.clientes.porcentaje}
          size={120}
          strokeWidth={8}
          color="blue"
          label="Clientes"
        />
        <p className="mt-3 text-sm text-gray-400">
          {objetivos.clientes.actual} de {objetivos.clientes.meta}
        </p>
      </div>
    </div>
  </GlassCard3D>
);

// ============================================
// PASO 8: TAB NAVIGATION PARA PANELES
// ============================================

const PanelsNavigation = ({ activePanel, setActivePanel }) => (
  <div className="mb-8">
    <TabNavigation
      tabs={[
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'ventas', label: 'Ventas', icon: ShoppingCart, badge: ventasPendientes },
        { id: 'clientes', label: 'Clientes', icon: Users },
        { id: 'almacen', label: 'Almacén', icon: Package },
        { id: 'reportes', label: 'Reportes', icon: FileText },
      ]}
      activeTab={activePanel}
      onChange={setActivePanel}
    />
  </div>
);

// ============================================
// PASO 9: QUICK ACTIONS SIDEBAR
// ============================================

const QuickActionsPanel = () => (
  <GlassCard3D className="p-6">
    <h3 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h3>

    <div className="space-y-3">
      <QuickActionButton
        icon={Plus}
        label="Nueva Venta"
        onClick={() => openModal('venta')}
        color="primary"
      />

      <QuickActionButton
        icon={UserPlus}
        label="Nuevo Cliente"
        onClick={() => openModal('cliente')}
        color="success"
      />

      <QuickActionButton
        icon={Package}
        label="Registrar Producto"
        onClick={() => openModal('producto')}
        color="purple"
      />

      <QuickActionButton
        icon={Download}
        label="Exportar Datos"
        onClick={handleExport}
        color="warning"
      />
    </div>
  </GlassCard3D>
);

// ============================================
// PASO 10: ANIMACIONES EN LISTAS
// ============================================

// Agregar clase stagger-fade-in al contenedor
const TransaccionesList = ({ transacciones }) => (
  <GlassCard3D className="p-6">
    <h3 className="text-xl font-bold text-white mb-4">Transacciones Recientes</h3>

    {/* Agregar clase para animaciones escalonadas */}
    <div className="space-y-3 stagger-fade-in">
      {transacciones.map((tx, index) => (
        <motion.div
          key={tx.id}
          whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          className="p-4 rounded-lg border border-white/10 transition-all"
        >
          {/* Contenido de la transacción */}
        </motion.div>
      ))}
    </div>
  </GlassCard3D>
);

// ============================================
// PASO 11: LAYOUT COMPLETO INTEGRADO
// ============================================

function FlowDistributorPremium() {
  const [activePanel, setActivePanel] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Background Effects */}
      <PremiumBackground theme="aurora" interactive={true} />

      {/* Header */}
      <PremiumHeader
        title="FlowDistributor"
        subtitle="Sistema Premium 2025"
        notifications={5}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 pt-24 pb-12">
        {/* Métricas Principales */}
        <MetricasSection metricas={metricas} />

        {/* Navegación de Paneles */}
        <PanelsNavigation activePanel={activePanel} setActivePanel={setActivePanel} />

        {/* Stats Grid */}
        <StatsGrid stats={stats} />

        {/* Tendencias */}
        <TendenciasSection ventas={ventasData} clientes={clientesData} productos={productosData} />

        {/* Layout Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            <PanelControl />
            <TransaccionesList transacciones={transacciones} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ObjetivosCard objetivos={objetivos} />
            <QuickActionsPanel />
          </div>
        </div>
      </div>

      {/* Floating Actions */}
      <FloatingActionButton
        icon={Plus}
        label="Nueva Transacción"
        onClick={() => setShowModal(true)}
        position="bottom-right"
      />

      <ScrollToTopButton />
    </div>
  );
}

export default FlowDistributorPremium;

// ============================================
// NOTAS IMPORTANTES
// ============================================

/*
1. IMPORTACIONES:
   - Asegúrate de que las rutas de importación sean correctas
   - Importar './styles/premium-animations.css' en el archivo principal

2. Z-INDEX:
   - Background: z-0
   - Contenido: z-10
   - Header: z-50
   - Modals: z-50+

3. PERFORMANCE:
   - Usa PremiumBackground solo en la página principal
   - Los efectos como SpotlightEffect son opcionales
   - Considera lazy loading para paneles pesados

4. RESPONSIVE:
   - Todos los componentes son responsive por defecto
   - Usa grid con breakpoints: sm, md, lg, xl, 2xl
   - Prueba en mobile antes de deployment

5. PERSONALIZACIÓN:
   - Colores en tailwind.config.js
   - Animaciones en premium-animations.css
   - Props de componentes para ajustes rápidos

6. ACCESIBILIDAD:
   - Mantén labels descriptivos
   - Usa iconos con texto
   - Testea navegación por teclado

7. DARK MODE:
   - Estado global recomendado (Context o Zustand)
   - Aplicar clases condicionales donde sea necesario
   - Los componentes premium soportan dark mode por defecto
*/
