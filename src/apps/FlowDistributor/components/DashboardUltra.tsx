/**
 * 🚀 DASHBOARD ULTRA PREMIUM - VERSIÓN DEFINITIVA
 *
 * Fusión de lo mejor de:
 * - DashboardSimple: TanStack Query, performance, datos reales
 * - DashboardInteligenteAAA: KPI Cards 3D, particles, parallax
 * - DashboardPremium3DUltra: Visualizaciones 3D premium
 *
 * Nuevas características:
 * - Gráficos interactivos con drill-down
 * - Timeline de actividad reciente
 * - Mapa de calor de operaciones
 * - Alertas inteligentes
 * - Animaciones fluidas premium
 * - Microinteracciones en cada elemento
 * - Design system unificado
 *
 * @version 5.0.0 - ULTRA PREMIUM
 */
import { memo, useMemo, useState } from 'react';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Activity, BarChart3, DollarSign, Package, ShoppingCart, Users } from 'lucide-react';

// Data - Dashboard Real
import dashboardData from '../data/panel-dashboard-manual.json';
// Design System
import animations from '../design-system/animations';
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
export const DashboardUltra = memo(({ vistaEspecifica }) => {
  // ============================================
  // HOOKS DE DATOS
  // ============================================
  const { bancos: bancosData = [], capitalTotal, cargando: bancosLoading } = useBancos();
  const { ventas: ventasData = [], isLoading: ventasLoading } = useVentas();
  const { clientes: clientesData = [], isLoading: clientesLoading } = useClientes();
  const { data: productosData = [], isLoading: almacenLoading } = useProductos(true);
  const { ordenes: ordenesCompraData = [], isLoading: ordenesLoading } = useOrdenesCompra();

  // Estado local
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('area');

  // Scroll parallax
  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const particlesOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  // ============================================
  // EXTRACCIÓN SEGURA DE DATOS
  // ============================================
  const bancos = Array.isArray(bancosData) ? bancosData : [];
  const ventas = Array.isArray(ventasData) ? ventasData : [];
  const clientes = Array.isArray(clientesData) ? clientesData : [];
  const productos = Array.isArray(productosData) ? productosData : [];
  const ordenesCompra = Array.isArray(ordenesCompraData) ? ordenesCompraData : [];

  // Loading state
  const isLoading =
    bancosLoading || ventasLoading || clientesLoading || almacenLoading || ordenesLoading;

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
   * 📊 Métricas de Ventas
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
   * 👥 Métricas de Clientes
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
   * 📦 Métricas de Almacén
   */
  const almacenMetrics = useMemo(() => {
    const stockActual = productos.reduce((acc, p) => {
      const cantidad = p?.stock || p?.cantidad || (p as any)?.stock || (p as any)?.cantidad || 0;
      return acc + cantidad;
    }, 0);

    const valorInventario = productos.reduce((acc, p) => {
      const cantidad = p?.stock || p?.cantidad || (p as any)?.stock || (p as any)?.cantidad || 0;
      const precio =
        p?.precio || p?.precioUnitario || (p as any)?.precio || (p as any)?.precioUnitario || 0;
      return acc + cantidad * precio;
    }, 0);

    const productosStockBajo = productos.filter((p) => {
      const cantidad = p?.stock || p?.cantidad || (p as any)?.stock || (p as any)?.cantidad || 0;
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
   * 🚨 Alertas Inteligentes
   */
  const alertas = useMemo(() => {
    const alerts: any[] = [];

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
  }, [almacenMetrics, ventasMetrics, clientesMetrics, totalCapital]);

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
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Particles Background */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{ opacity: particlesOpacity }}
      >
        <CreativeParticles
          count={60}
          colors={[
            theme.colors.primary[400],
            theme.colors.secondary[400],
            theme.colors.tertiary[400],
          ]}
        />
      </motion.div>

      {/* Radial Gradient Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

      {/* Content */}
      <div className="relative z-10 px-6 py-8 max-w-[1800px] mx-auto">
        {/* Header */}
        <motion.div
          style={{ y: headerY }}
          initial="initial"
          animate="animate"
          variants={animations.container.fadeSlideUp}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Dashboard Chronos</h1>
              <p className="text-white/60">Vista ejecutiva del sistema en tiempo real</p>
            </div>

            {/* Quick Actions */}
            <QuickActions />
          </div>
        </motion.div>

        {/* KPI Cards Grid */}
        <motion.div
          variants={animations.container.staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
        >
          {kpiCards.map((kpi, index) => (
            <KpiCard3D key={kpi.id} {...kpi} index={index} />
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Charts Section */}
          <div className="xl:col-span-2 space-y-6">
            {/* Ventas Chart */}
            <motion.div
              variants={animations.card.glassCard}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <PremiumChart
                title="Tendencia de Ventas"
                type={chartType}
                data={ventas}
                onTypeChange={setChartType}
                timeRange={selectedTimeRange}
                onTimeRangeChange={setSelectedTimeRange}
              />
            </motion.div>

            {/* Heatmap Operations */}
            <HeatmapOperations data={{ ventas, ordenesCompra }} />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Alertas Panel */}
            <AlertsPanel alertas={alertas} />

            {/* Timeline Activity */}
            <TimelineActivity ventas={ventas.slice(0, 10)} ordenes={ordenesCompra.slice(0, 10)} />
          </div>
        </div>

        {/* Bottom Section: Top Clients + Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Clientes */}
          <motion.div
            variants={animations.card.glassCard}
            initial="initial"
            animate="animate"
            className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-zinc-300" />
              Top 5 Clientes
            </h3>
            <div className="space-y-3">
              {clientesMetrics.topClientes.map((cliente, index) => (
                <motion.div
                  key={cliente.nombre}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.secondary[500]})`,
                      }}
                    >
                      #{index + 1}
                    </div>
                    <span className="text-white font-medium">{cliente.nombre}</span>
                  </div>
                  <span className="text-zinc-200 font-bold">
                    {formatCurrency(cliente.total, 'MXN')}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={animations.card.glassCard}
            initial="initial"
            animate="animate"
            className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-zinc-800" />
              Estadísticas Rápidas
            </h3>
            <div className="space-y-4">
              <StatItem
                label="Órdenes Activas"
                value={ordenesCompra.filter((o) => o.estatus !== 'completada').length}
                icon={ShoppingCart}
                color="text-zinc-200"
              />
              <StatItem
                label="Ventas Promedio"
                value={formatCurrency(ventasMetrics.promedio, 'MXN')}
                icon={BarChart3}
                color="text-zinc-300"
              />
              <StatItem
                label="Productos en Almacén"
                value={almacenMetrics.totalProductos}
                icon={Package}
                color="text-zinc-800"
              />
              <StatItem
                label="Valor Inventario"
                value={formatCurrency(almacenMetrics.valorInventario, 'MXN')}
                icon={DollarSign}
                color="text-zinc-200"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
});

DashboardUltra.displayName = 'DashboardUltra';

/**
 * 📊 Componente Helper: Stat Item
 */
const StatItem = memo<{
  label: string;
  value: string | number;
  icon: any;
  color: string;
}>(({ label, value, icon: Icon, color }) => (
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

export default DashboardUltra;
