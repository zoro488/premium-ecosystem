/**
 * 🚀 CHRONOS DASHBOARD ULTRA - ENTERPRISE LEVEL
 *
 * Inspirado en las mejores prácticas de SaaS modernos:
 * - Micro-animaciones fluidas y elegantes
 * - Transiciones suaves con spring physics
 * - Efectos glassmorphism y neumorphism
 * - Hover states con transformaciones 3D
 * - Loading states progresivos
 * - Parallax scrolling dinámico
 * - Partículas interactivas de fondo
 * - AI-powered insights visuales
 *
 * Referencias de diseño aplicadas:
 * - Property Dashboard SaaS animations
 * - Hospital management interfaces
 * - AI Chat Bot modern UI patterns
 *
 * @version 6.0.0 - CHRONOS ENTERPRISE
 */
import { memo, useEffect, useMemo, useRef, useState } from 'react';

import {
  AnimatePresence,
  motion,
  useAnimation,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Activity, BarChart3, DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import PropTypes from 'prop-types';

// Data - Dashboard Real
import dashboardData from '../data/panel-dashboard-manual.json';
// Design System
import { theme } from '../design-system/theme';
// Hooks
import { useProductos } from '../hooks/useAlmacen';
import { useBancos } from '../hooks/useBancos';
import useClientes from '../hooks/useClientes';
import useOrdenesCompra from '../hooks/useOrdenesCompra';
import useVentas from '../hooks/useVentas';
// Utils
import { formatCurrency } from '../utils/formatters';
// Components (a crear)
import { PremiumLoadingScreen } from './PremiumLoadingScreen';
import { AlertsPanel } from './shared/AlertsPanel';
import { CreativeParticles } from './shared/CreativeParticles';
import { HeatmapOperations } from './shared/HeatmapOperations';
import { KpiCard3D } from './shared/KpiCard3D';
import { PremiumChart } from './shared/PremiumChart';
import { QuickActions } from './shared/QuickActions';
import { TimelineActivity } from './shared/TimelineActivity';

/**
 * 🎨 Componente Principal - Dashboard Ultra
 */
export const DashboardUltra = memo(({ _vistaEspecifica }) => {
  // ============================================
  // HOOKS DE DATOS
  // ============================================
  const { cargando: _bancosLoading } = useBancos();
  const { ventas: ventasData = [], isLoading: _ventasLoading } = useVentas();
  const { clientes: clientesData = [], isLoading: _clientesLoading } = useClientes();
  const { data: productosData = [], isLoading: _almacenLoading } = useProductos(true);
  const { ordenes: ordenesCompraData = [], isLoading: _ordenesLoading } = useOrdenesCompra();

  // Loading state consolidado
  const isLoading =
    _bancosLoading || _ventasLoading || _clientesLoading || _almacenLoading || _ordenesLoading;

  // ============================================
  // ANIMATION HOOKS & REFS - NUEVA IMPLEMENTACIÓN
  // ============================================
  const containerRef = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  // Valores de movimiento para parallax avanzado
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics para suavidad
  const springConfig = { damping: 25, stiffness: 400 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Estado local
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [chartType, setChartType] = useState('area');
  const [_hoveredCard, setHoveredCard] = useState(null);

  // Scroll parallax mejorado
  const { scrollYProgress } = useScroll({ target: containerRef });
  const headerY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const particlesOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [1, 0.8, 0.4]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // ============================================
  // MOUSE TRACKING PARA EFECTOS 3D
  // ============================================
  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        mouseX.set((e.clientX - centerX) * 0.1);
        mouseY.set((e.clientY - centerY) * 0.1);
      }
    };

    globalThis.addEventListener('mousemove', handleMouseMove);
    return () => globalThis.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Trigger animations when in view
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  // ============================================
  // EXTRACCIÓN SEGURA DE DATOS CON USEMEMO
  // ============================================
  const ventas = useMemo(() => (Array.isArray(ventasData) ? ventasData : []), [ventasData]);
  const clientes = useMemo(() => (Array.isArray(clientesData) ? clientesData : []), [clientesData]);
  const productos = useMemo(
    () => (Array.isArray(productosData) ? productosData : []),
    [productosData]
  );
  const ordenesCompra = useMemo(
    () => (Array.isArray(ordenesCompraData) ? ordenesCompraData : []),
    [ordenesCompraData]
  );

  // ============================================
  // ENHANCED ANIMATIONS VARIANTS
  // ============================================
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.8,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300,
        duration: 0.8,
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      rotateX: 5,
      rotateY: 2,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 400,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-1, 1, -1],
      transition: {
        duration: 6,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // ============================================
  // CÁLCULOS DE MÉTRICAS
  // ============================================

  /**
   * 💰 Capital Total - FUENTE REAL: panel-dashboard-manual.json
   * Incluye efectivo en bóvedas + inventario valorado al costo
   */
  const totalCapital = useMemo(() => {
    return dashboardData.dashboard.totalRfActual || 0;
  }, []);

  /**
   * 📊 Métricas de Ventas - Optimizadas con useMemo
   */
  const ventasMetrics = useMemo(() => {
    const total = ventas.reduce((acc, v) => acc + (v?.total || v?.monto || 0), 0);
    const pagadas = ventas.filter((v) => v?.estatus === 'Pagado' || v?.status === 'pagado');
    const pendientes = ventas.filter(
      (v) => v?.estatus === 'Pendiente' || v?.status === 'pendiente'
    );

    const totalPagadas = pagadas.reduce((acc, v) => acc + (v?.total || v?.monto || 0), 0);
    const totalPendientes = pendientes.reduce((acc, v) => acc + (v?.total || v?.monto || 0), 0);

    // Tendencia (comparar última semana vs anterior)
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const prevWeek = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const ventasLastWeek = ventas.filter(
      (v) => new Date(v.fecha) >= lastWeek && new Date(v.fecha) < now
    );
    const ventasPrevWeek = ventas.filter(
      (v) => new Date(v.fecha) >= prevWeek && new Date(v.fecha) < lastWeek
    );

    const totalLastWeek = ventasLastWeek.reduce((acc, v) => acc + (v?.total || v?.monto || 0), 0);
    const totalPrevWeek = ventasPrevWeek.reduce((acc, v) => acc + (v?.total || v?.monto || 0), 0);

    const trend = totalPrevWeek > 0 ? ((totalLastWeek - totalPrevWeek) / totalPrevWeek) * 100 : 0;

    return {
      total,
      count: ventas.length,
      pagadas: pagadas.length,
      pendientes: pendientes.length,
      totalPagadas,
      totalPendientes,
      promedio: ventas.length > 0 ? total / ventas.length : 0,
      trend,
    };
  }, [ventas]);

  /**
   * 👥 Métricas de Clientes - Optimizadas con useMemo
   */
  const clientesMetrics = useMemo(() => {
    try {
      if (!Array.isArray(clientes) || clientes.length === 0) {
        return {
          total: 0,
          activos: 0,
          conDeuda: 0,
          totalDeuda: 0,
          topClientes: [],
        };
      }

      const activos = clientes.filter((c) => c?.estado === 'activo' || c?.status === 'activo');
      const conDeuda = clientes.filter((c) => (c?.adeudo || c?.deuda || 0) > 0);
      const totalDeuda = conDeuda.reduce((acc, c) => acc + (c?.adeudo || c?.deuda || 0), 0);

      // Top clientes por volumen - con validación extra
      const topClientes = clientes
        .filter((c) => c && typeof c === 'object' && c?.nombre) // Validación más estricta
        .map((c) => ({
          nombre: String(c.nombre || 'Sin nombre'),
          total: Number(c.totalCompras || c.totalVentas || c.total || 0),
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

      return {
        total: clientes.length,
        activos: activos.length,
        conDeuda: conDeuda.length,
        totalDeuda,
        topClientes,
      };
    } catch (error) {
      console.error('Error en clientesMetrics:', error);
      return {
        total: 0,
        activos: 0,
        conDeuda: 0,
        totalDeuda: 0,
        topClientes: [],
      };
    }
  }, [clientes]);

  /**
   * 📦 Métricas de Almacén - Optimizadas con useMemo
   */
  const almacenMetrics = useMemo(() => {
    const stockActual = productos.reduce((acc, p) => {
      const cantidad = p?.stock || p?.cantidad || p.stock || p.cantidad || 0;
      return acc + cantidad;
    }, 0);

    const valorInventario = productos.reduce((acc, p) => {
      const cantidad = p?.stock || p?.cantidad || p.stock || p.cantidad || 0;
      const precio = p?.precio || p?.precioUnitario || p.precio || p.precioUnitario || 0;
      return acc + cantidad * precio;
    }, 0);

    const productosStockBajo = productos.filter((p) => {
      const cantidad = p?.stock || p?.cantidad || p.stock || p.cantidad || 0;
      return cantidad < 10;
    });

    return {
      stockActual,
      totalProductos: productos.length,
      valorInventario,
      productosStockBajo: productosStockBajo.length,
      alertaStock: productosStockBajo.length > 0,
    };
  }, [productos]);

  /**
   * 🚨 Alertas Inteligentes - Optimizadas con useMemo
   */
  const alertas = useMemo(() => {
    const alerts = [];

    // Alerta: Stock bajo
    if (almacenMetrics.productosStockBajo > 0) {
      alerts.push({
        id: 'stock-bajo',
        tipo: 'warning',
        titulo: 'Stock bajo detectado',
        mensaje: `${almacenMetrics.productosStockBajo} productos con stock menor a 10 unidades`,
        prioridad: 'alta',
      });
    }

    // Alerta: Ventas pendientes
    if (ventasMetrics.pendientes > 0) {
      alerts.push({
        id: 'ventas-pendientes',
        tipo: 'info',
        titulo: 'Ventas pendientes de cobro',
        mensaje: `${ventasMetrics.pendientes} ventas por ${formatCurrency(ventasMetrics.totalPendientes, 'MXN')}`,
        prioridad: 'media',
      });
    }

    // Alerta: Clientes con deuda
    if (clientesMetrics.conDeuda > 0) {
      alerts.push({
        id: 'clientes-deuda',
        tipo: 'warning',
        titulo: 'Clientes con adeudo',
        mensaje: `${clientesMetrics.conDeuda} clientes deben ${formatCurrency(clientesMetrics.totalDeuda, 'MXN')}`,
        prioridad: 'alta',
      });
    }

    // Alerta: Tendencia de ventas
    if (ventasMetrics.trend < -10) {
      alerts.push({
        id: 'ventas-baja',
        tipo: 'error',
        titulo: 'Ventas a la baja',
        mensaje: `Las ventas cayeron ${Math.abs(ventasMetrics.trend).toFixed(1)}% esta semana`,
        prioridad: 'crítica',
      });
    } else if (ventasMetrics.trend > 20) {
      alerts.push({
        id: 'ventas-alta',
        tipo: 'success',
        titulo: '¡Ventas en crecimiento!',
        mensaje: `Las ventas subieron ${ventasMetrics.trend.toFixed(1)}% esta semana`,
        prioridad: 'info',
      });
    }

    // Alerta: Capital bajo
    const capital = Number(totalCapital);
    if (capital < 50000) {
      alerts.push({
        id: 'capital-bajo',
        tipo: 'error',
        titulo: 'Capital bajo',
        mensaje: `El capital total es de solo ${formatCurrency(capital, 'MXN')}`,
        prioridad: 'crítica',
      });
    }

    return alerts;
  }, [
    almacenMetrics.productosStockBajo,
    ventasMetrics.trend,
    ventasMetrics.pendientes,
    ventasMetrics.totalPendientes,
    clientesMetrics,
    totalCapital,
  ]);

  // ============================================
  // KPI CARDS DATA
  // ============================================
  const kpiCards = [
    {
      id: 'capital',
      title: 'Capital Total',
      value: formatCurrency(Number(totalCapital), 'MXN'),
      icon: DollarSign,
      color: theme.colors.panels.dashboard.primary,
      gradient: theme.colors.panels.dashboard.gradient,
      glow: theme.colors.panels.dashboard.glow,
      trend: ventasMetrics.trend,
      trendLabel: `${Math.abs(ventasMetrics.trend).toFixed(1)}% vs sem. anterior`,
      sparklineData: [],
    },
    {
      id: 'ventas',
      title: 'Ventas Totales',
      value: formatCurrency(ventasMetrics.total, 'MXN'),
      subtitle: `${ventasMetrics.count} ventas`,
      icon: ShoppingCart,
      color: theme.colors.panels.ventas.primary,
      gradient: theme.colors.panels.ventas.gradient,
      glow: theme.colors.panels.ventas.glow,
      trend: ventasMetrics.trend,
      trendLabel: `${ventasMetrics.pagadas} pagadas, ${ventasMetrics.pendientes} pendientes`,
      sparklineData: [],
    },
    {
      id: 'almacen',
      title: 'Stock Almacén',
      value: almacenMetrics.stockActual.toLocaleString(),
      subtitle: formatCurrency(almacenMetrics.valorInventario, 'MXN'),
      icon: Package,
      color: theme.colors.panels.almacen.primary,
      gradient: theme.colors.panels.almacen.gradient,
      glow: theme.colors.panels.almacen.glow,
      trend: almacenMetrics.alertaStock ? -15 : 5,
      trendLabel: almacenMetrics.alertaStock
        ? `${almacenMetrics.productosStockBajo} productos bajo stock`
        : 'Stock saludable',
      sparklineData: [],
    },
    {
      id: 'clientes',
      title: 'Clientes Activos',
      value: clientesMetrics.activos,
      subtitle: `${clientesMetrics.total} total`,
      icon: Users,
      color: theme.colors.panels.clientes.primary,
      gradient: theme.colors.panels.clientes.gradient,
      glow: theme.colors.panels.clientes.glow,
      trend: clientesMetrics.conDeuda > 0 ? -5 : 10,
      trendLabel:
        clientesMetrics.conDeuda > 0
          ? `${clientesMetrics.conDeuda} con adeudo`
          : 'Todos al corriente',
      sparklineData: [],
    },
  ];

  // ============================================
  // RENDER
  // ============================================

  if (isLoading) {
    return <PremiumLoadingScreen />;
  }

  return (
    <motion.div
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Enhanced Particles Background with Parallax */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{
          opacity: particlesOpacity,
          scale: backgroundScale,
          x: x,
          y: y,
        }}
        variants={floatingVariants}
        animate="animate"
      >
        <CreativeParticles
          count={80}
          colors={[
            theme.colors.primary[400],
            theme.colors.secondary[400],
            theme.colors.tertiary[400],
            '#ffffff20',
            '#3b82f650',
          ]}
        />
      </motion.div>

      {/* Glassmorphism Overlay with Pulse Effect */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        variants={pulseVariants}
        animate="animate"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.1),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.1),transparent_40%)]" />
      </motion.div>

      {/* Content with Enhanced Animations */}
      <motion.div
        className="relative z-10 px-6 py-8 max-w-[1800px] mx-auto"
        style={{
          perspective: '1500px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Header with Enhanced Animations */}
        <motion.div
          style={{ y: headerY }}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <motion.div variants={cardVariants} whileHover={{ x: 10 }}>
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Dashboard Chronos
              </h1>
              <p className="text-white/60">Vista ejecutiva del sistema en tiempo real</p>
            </motion.div>

            {/* Quick Actions with Floating Effect */}
            <motion.div variants={floatingVariants} animate="animate">
              <QuickActions />
            </motion.div>
          </div>
        </motion.div>

        {/* KPI Cards Grid with Stagger and 3D Effects */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
          style={{ perspective: '1000px' }}
        >
          <AnimatePresence>
            {kpiCards.map((kpi, index) => (
              <motion.div
                key={kpi.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                onHoverStart={() => setHoveredCard(kpi.id)}
                onHoverEnd={() => setHoveredCard(null)}
                style={{
                  transformOrigin: 'center center',
                  transformStyle: 'preserve-3d',
                }}
                custom={index}
              >
                <KpiCard3D {...kpi} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Main Content Grid with Enhanced Glassmorphism */}
        <motion.div
          className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Charts Section with 3D Transform */}
          <motion.div className="xl:col-span-2 space-y-6" style={{ perspective: '1200px' }}>
            {/* Ventas Chart with Enhanced Glassmorphism */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="relative group"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center',
              }}
            >
              {/* Glassmorphism backdrop */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <PremiumChart
                  title="Tendencia de Ventas"
                  type={chartType}
                  data={ventas}
                  onTypeChange={setChartType}
                  timeRange={selectedTimeRange}
                  onTimeRangeChange={setSelectedTimeRange}
                />
              </div>
            </motion.div>

            {/* Heatmap Operations with Floating Effect */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="relative group"
            >
              <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-orange-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <HeatmapOperations data={{ ventas, ordenesCompra }} />
              </div>
            </motion.div>
          </motion.div>

          {/* Right Sidebar with Enhanced Animations */}
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Alertas Panel with Pulse Effect */}
            <motion.div variants={cardVariants} whileHover="hover" className="relative group">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-orange-500/10 to-yellow-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <AlertsPanel alertas={alertas} />
              </div>
            </motion.div>

            {/* Timeline Activity with Floating Animation */}
            <motion.div variants={floatingVariants} animate="animate" className="relative group">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-blue-500/10 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <TimelineActivity
                  ventas={ventas.slice(0, 10)}
                  ordenes={ordenesCompra.slice(0, 10)}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom Section: Top Clients + Quick Stats with Matrix Animation */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Top Clientes with Enhanced Glassmorphism */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="relative group p-6 rounded-2xl"
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'center center',
            }}
          >
            {/* Advanced Glassmorphism layers */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="absolute inset-0 border border-transparent bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <motion.h3
                className="text-xl font-bold text-white mb-4 flex items-center gap-2"
                variants={floatingVariants}
                animate="animate"
              >
                <Users className="w-5 h-5 text-blue-400" />
                Top 5 Clientes
              </motion.h3>
              <div className="space-y-3">
                <AnimatePresence>
                  {clientesMetrics.topClientes.map((cliente, index) => (
                    <motion.div
                      key={cliente.nombre}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{
                        x: 10,
                        scale: 1.02,
                        transition: { type: 'spring', stiffness: 400, damping: 25 },
                      }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-blue-500 to-purple-500"
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          #{index + 1}
                        </motion.div>
                        <span className="text-white font-medium group-hover:text-blue-300 transition-colors duration-300">
                          {cliente.nombre}
                        </span>
                      </div>
                      <motion.span className="text-green-400 font-bold" whileHover={{ scale: 1.1 }}>
                        {formatCurrency(cliente.total, 'MXN')}
                      </motion.span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats with Matrix-style Animation */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="relative group p-6 rounded-2xl"
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'center center',
            }}
          >
            {/* Multi-layer Glassmorphism */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-orange-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="absolute inset-0 border border-transparent bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <motion.h3
                className="text-xl font-bold text-white mb-4 flex items-center gap-2"
                variants={pulseVariants}
                animate="animate"
              >
                <Activity className="w-5 h-5 text-purple-400" />
                Estadísticas Rápidas
              </motion.h3>
              <motion.div
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={cardVariants}>
                  <StatItem
                    label="Órdenes Activas"
                    value={ordenesCompra.filter((o) => o.estatus !== 'completada').length}
                    icon={ShoppingCart}
                    color="text-orange-400"
                  />
                </motion.div>
                <motion.div variants={cardVariants}>
                  <StatItem
                    label="Ventas Promedio"
                    value={formatCurrency(ventasMetrics.promedio, 'MXN')}
                    icon={BarChart3}
                    color="text-blue-400"
                  />
                </motion.div>
                <motion.div variants={cardVariants}>
                  <StatItem
                    label="Productos en Almacén"
                    value={almacenMetrics.totalProductos}
                    icon={Package}
                    color="text-purple-400"
                  />
                </motion.div>
                <motion.div variants={cardVariants}>
                  <StatItem
                    label="Valor Inventario"
                    value={formatCurrency(almacenMetrics.valorInventario, 'MXN')}
                    icon={DollarSign}
                    color="text-green-400"
                  />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
});

DashboardUltra.displayName = 'DashboardUltra';

/**
 * 📊 Componente Helper: Stat Item
 */
const StatItem = memo(({ label, value, icon: Icon, color }) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-white/10 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-white/70 text-sm">{label}</span>
    </div>
    <span className="text-white font-bold">{value}</span>
  </div>
));

StatItem.displayName = 'StatItem';

// PropTypes para el componente principal
DashboardUltra.propTypes = {
  vistaEspecifica: PropTypes.string,
};

// PropTypes para StatItem
StatItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
};

DashboardUltra.propTypes = {
  _vistaEspecifica: PropTypes.string,
};

export default DashboardUltra;
