// ============================================================================
// 🎯 DASHBOARD MASTER - Vista Principal Ultra Premium
// Dashboard ejecutivo con animaciones avanzadas, gráficos interactivos,
// microinteracciones y diseño Chronos OS de última generación
// ============================================================================
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Clock,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';

import { AdvancedChart } from '@/components/charts/AdvancedChart';
import { ChronosButton } from '@/components/chronos-ui/ChronosButton';
import { ChronosCard } from '@/components/chronos-ui/ChronosCard';
import { ChronosChart } from '@/components/chronos-ui/ChronosChart';
import { ChronosKPI } from '@/components/chronos-ui/ChronosKPI';
import type { ChronosTableColumn } from '@/components/chronos-ui/ChronosTable';
import { ChronosTable } from '@/components/chronos-ui/ChronosTable';
import { ExportButton } from '@/components/export';
import { useChronosData } from '@/hooks/useChronosData';

interface QuickAction {
  id: string;
  label: string;
  icon: typeof ShoppingCart;
  path: string;
  color: string;
  gradient: string;
}

/**
 * 🌟 DASHBOARD MASTER VIEW
 * Panel de control ejecutivo con métricas en tiempo real
 */
export default function DashboardMasterView() {
  const navigate = useNavigate();
  const { bancos, ventas, productos, loading } = useChronosData();
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('month');

  // ============================================
  // 📊 CÁLCULOS DE MÉTRICAS
  // ============================================

  const metrics = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

    const filterDate = {
      today,
      week: weekAgo,
      month: monthAgo,
      year: yearAgo,
    }[timeRange];

    // Capital total en bancos
    const capitalTotal = bancos.reduce((sum, b) => sum + b.capitalActual, 0);

    // Ventas del período
    const ventasPeriodo = ventas.filter((v) => {
      const fecha = v.fecha instanceof Date ? v.fecha : new Date(v.fecha);
      return fecha >= filterDate;
    });

    const ventasPagadas = ventasPeriodo.filter((v) => v.estatus === 'Pagado');
    const ventasPendientes = ventasPeriodo.filter((v) => v.estatus === 'Pendiente');

    const ingresosReales = ventasPagadas.reduce((sum, v) => sum + v.precioVenta, 0);
    const ingresosPotenciales = ventasPendientes.reduce((sum, v) => sum + v.precioVenta, 0);

    // Tendencias (comparar con período anterior)
    const prevPeriod = new Date(filterDate.getTime() - (now.getTime() - filterDate.getTime()));
    const ventasPrevPeriod = ventas.filter((v) => {
      const fecha = v.fecha instanceof Date ? v.fecha : new Date(v.fecha);
      return fecha >= prevPeriod && fecha < filterDate;
    });
    const ingresosPrevPeriod = ventasPrevPeriod
      .filter((v) => v.estatus === 'Pagado')
      .reduce((sum, v) => sum + v.precioVenta, 0);

    const trendIngresos =
      ingresosPrevPeriod > 0
        ? ((ingresosReales - ingresosPrevPeriod) / ingresosPrevPeriod) * 100
        : 0;

    // Clientes activos (con ventas en el período)
    const clientesActivos = new Set(ventasPeriodo.map((v) => v.clienteId)).size;

    // Stock bajo - deshabilitado temporalmente
    const stockBajo = 0; // productos.filter((p) => ((p as unknown as Record<string, number>).stock || 0) < 50).length;

    return {
      capitalTotal,
      ingresosReales,
      ingresosPotenciales,
      trendIngresos,
      ventasTotal: ventasPeriodo.length,
      ventasPagadas: ventasPagadas.length,
      ventasPendientes: ventasPendientes.length,
      clientesActivos,
      stockBajo,
    };
  }, [bancos, ventas, timeRange]);

  // ============================================
  // 📈 DATOS PARA GRÁFICOS
  // ============================================

  // Gráfico de ingresos por mes (últimos 6 meses)
  const ingresosChart = useMemo(() => {
    const meses = 6;
    const data: Array<{ mes: string; ingresos: number; gastos: number }> = [];
    const now = new Date();

    for (let i = meses - 1; i >= 0; i--) {
      const fecha = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mesStr = fecha.toLocaleDateString('es-MX', { month: 'short', year: '2-digit' });

      const ventasMes = ventas.filter((v) => {
        const vFecha = v.fecha instanceof Date ? v.fecha : new Date(v.fecha);
        return (
          vFecha.getMonth() === fecha.getMonth() &&
          vFecha.getFullYear() === fecha.getFullYear() &&
          v.estatus === 'Pagado'
        );
      });

      const ingresos = ventasMes.reduce((sum, v) => sum + v.precioVenta, 0);
      const gastos = ingresos * 0.6; // Simulado (60% de ingresos)

      data.push({ mes: mesStr, ingresos, gastos });
    }

    return data;
  }, [ventas]);

  // Distribución de capital por banco
  const capitalPorBanco = useMemo(() => {
    return bancos
      .map((b) => ({
        banco: b.nombre,
        capital: b.capitalActual,
      }))
      .sort((a, b) => b.capital - a.capital);
  }, [bancos]);

  // Últimas ventas
  const ultimasVentas = useMemo(() => {
    return ventas
      .sort((a, b) => {
        const aDate = a.fecha instanceof Date ? a.fecha : new Date(a.fecha);
        const bDate = b.fecha instanceof Date ? b.fecha : new Date(b.fecha);
        return bDate.getTime() - aDate.getTime();
      })
      .slice(0, 10);
  }, [ventas]);

  // ============================================
  // 📊 DATOS PARA ADVANCEDCHARTS (PHASE 6)
  // ============================================

  // 1. GAUGE: % Cumplimiento de Objetivos de Ventas
  const objetivoGaugeData = useMemo(() => {
    const metaMensual = 500000; // Meta: $500k/mes
    const porcentaje = (metrics.ingresosReales / metaMensual) * 100;

    return [
      {
        value: Math.min(porcentaje, 100),
        name: 'Cumplimiento',
        title: { text: `${porcentaje.toFixed(1)}%` },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
        },
      },
    ];
  }, [metrics.ingresosReales]);

  // 2. SANKEY: Flujo Completo (Órdenes → Entradas → Ventas → Salidas)
  const flujoSankeyData = useMemo(() => {
    const totalVentas = metrics.ingresosReales;
    const totalIngresos = metrics.capitalTotal;
    const totalGastos = totalVentas * 0.6; // 60% de ventas son costos
    const utilidadNeta = totalVentas - totalGastos;

    return {
      nodes: [
        { name: 'Capital Inicial' },
        { name: 'Órdenes Compra' },
        { name: 'Entradas Inventario' },
        { name: 'Ventas' },
        { name: 'Costos' },
        { name: 'Utilidad Neta' },
      ],
      links: [
        { source: 0, target: 1, value: totalIngresos * 0.3 }, // 30% capital → órdenes
        { source: 1, target: 2, value: totalIngresos * 0.3 }, // órdenes → entradas
        { source: 2, target: 3, value: totalVentas }, // entradas → ventas
        { source: 3, target: 4, value: totalGastos }, // ventas → costos
        { source: 3, target: 5, value: utilidadNeta }, // ventas → utilidad
      ],
    };
  }, [metrics.capitalTotal, metrics.ingresosReales]);

  // 3. RADAR: Comparativa de 5 Áreas del Negocio
  const areasRadarData = useMemo(() => {
    const maxValue = 100;
    const ventasScore = Math.min((metrics.ventasTotal / 50) * 100, maxValue);
    const clientesScore = Math.min((metrics.clientesActivos / 20) * 100, maxValue);
    const capitalScore = Math.min((metrics.capitalTotal / 1000000) * 100, maxValue);
    const conversionScore = Math.min(
      (metrics.ventasPagadas / (metrics.ventasTotal || 1)) * 100,
      maxValue
    );
    const inventarioScore = Math.min((productos.length / 50) * 100, maxValue);

    return {
      indicator: [
        { name: 'Ventas', max: maxValue },
        { name: 'Clientes', max: maxValue },
        { name: 'Capital', max: maxValue },
        { name: 'Conversión', max: maxValue },
        { name: 'Inventario', max: maxValue },
      ],
      series: [
        {
          name: 'Rendimiento',
          data: [ventasScore, clientesScore, capitalScore, conversionScore, inventarioScore],
        },
      ],
    };
  }, [
    metrics.ventasTotal,
    metrics.clientesActivos,
    metrics.capitalTotal,
    metrics.ventasPagadas,
    productos.length,
  ]);

  // 4. HEATMAP: Actividad Global por Día/Hora (simulado)
  const actividadHeatmapData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    return {
      xAxis: hours.map((h) => `${h}:00`),
      yAxis: days,
      data: days.flatMap((_day, dayIndex) =>
        hours.map((hour) => {
          // Simular actividad: más alta entre 9-18h en días laborales
          const isWorkday = dayIndex < 5; // Lun-Vie
          const isWorkHours = hour >= 9 && hour <= 18;
          const baseActivity = isWorkday && isWorkHours ? 60 : 20;
          const randomVariation = Math.random() * 40;
          return [hour, dayIndex, Math.floor(baseActivity + randomVariation)];
        })
      ),
    };
  }, []);

  // ============================================
  // 🎨 ACCIONES RÁPIDAS
  // ============================================

  const quickActions: QuickAction[] = [
    {
      id: 'nueva-venta',
      label: 'Nueva Venta',
      icon: ShoppingCart,
      path: '/ventas?action=new',
      color: 'text-neon-cyan',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      id: 'ver-clientes',
      label: 'Clientes',
      icon: Users,
      path: '/clientes',
      color: 'text-neon-green',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      id: 'inventario',
      label: 'Inventario',
      icon: Package,
      path: '/almacen',
      color: 'text-neon-amber',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: BarChart3,
      path: '/reportes',
      color: 'text-neon-purple',
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  // ============================================
  // 📋 CONFIGURACIÓN DE TABLA
  // ============================================

  const ventasTableColumns: ChronosTableColumn[] = [
    {
      key: 'fecha',
      label: 'Fecha',
      sortable: true,
      width: '120px',
      render: (value) => {
        const fecha = value instanceof Date ? value : new Date(value as string);
        return (
          <span className="font-mono text-xs text-chronos-silver">
            {fecha.toLocaleDateString('es-MX')}
          </span>
        );
      },
    },
    {
      key: 'clienteId',
      label: 'Cliente',
      sortable: true,
      render: (value) => <span className="font-medium text-chronos-white">{String(value)}</span>,
    },
    {
      key: 'precioVenta',
      label: 'Monto',
      sortable: true,
      align: 'right',
      width: '140px',
      render: (value) => (
        <span className="font-mono font-bold text-neon-cyan">
          {new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            maximumFractionDigits: 0,
          }).format(value as number)}
        </span>
      ),
    },
    {
      key: 'estatus',
      label: 'Estado',
      sortable: true,
      align: 'center',
      width: '120px',
      render: (value) => {
        const isPagado = value === 'Pagado';
        return (
          <span
            className={`
            inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase
            ${
              isPagado
                ? 'bg-status-success/10 text-status-success'
                : 'bg-status-warning/10 text-status-warning'
            }
          `}
          >
            {isPagado ? <TrendingUp className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            {String(value)}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple">
            DASHBOARD EJECUTIVO
          </h1>
          <p className="text-chronos-silver mt-2 font-mono text-sm">
            &gt;&gt; SISTEMA CHRONOS OS / CONTROL TOTAL EN TIEMPO REAL
          </p>
        </div>

        {/* Selector de rango de tiempo */}
        <div className="flex items-center gap-2 card-glass px-4 py-2 rounded-xl">
          {(['today', 'week', 'month', 'year'] as const).map((range) => (
            <motion.button
              key={range}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTimeRange(range)}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                ${
                  timeRange === range
                    ? 'bg-neon-cyan text-chronos-void shadow-neon-cyan/50'
                    : 'text-chronos-silver hover:text-chronos-white'
                }
              `}
            >
              {range === 'today' && 'Hoy'}
              {range === 'week' && 'Semana'}
              {range === 'month' && 'Mes'}
              {range === 'year' && 'Año'}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* KPIs PRINCIPALES */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card-glass p-6 rounded-2xl relative overflow-hidden group cursor-pointer"
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,217,255,0.3)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-neon-cyan" />
              </div>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="w-2 h-2 rounded-full bg-neon-cyan shadow-neon-cyan/50"
              />
            </div>
            <ChronosKPI
              label="Capital Total"
              value={metrics.capitalTotal}
              format="currency"
              trend={5.2}
              color="cyan"
              size="lg"
              pulse
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card-glass p-6 rounded-2xl relative overflow-hidden group cursor-pointer"
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-neon-green/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-neon-green" />
              </div>
              <span className="text-xs text-chronos-silver font-mono uppercase">{timeRange}</span>
            </div>
            <ChronosKPI
              label="Ingresos Reales"
              value={metrics.ingresosReales}
              format="currency"
              trend={metrics.trendIngresos}
              color="green"
              size="lg"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="card-glass p-6 rounded-2xl relative overflow-hidden group cursor-pointer"
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(245,158,11,0.3)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neon-amber/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-neon-amber/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-neon-amber" />
              </div>
              <span className="text-sm font-mono text-neon-amber font-bold">
                {metrics.ventasPendientes}
              </span>
            </div>
            <ChronosKPI
              label="Por Cobrar"
              value={metrics.ingresosPotenciales}
              format="currency"
              color="yellow"
              size="lg"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="card-glass p-6 rounded-2xl relative overflow-hidden group cursor-pointer"
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(139,92,246,0.3)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-neon-purple" />
              </div>
              <Activity className="w-5 h-5 text-neon-purple animate-pulse" />
            </div>
            <ChronosKPI
              label="Clientes Activos"
              value={metrics.clientesActivos}
              format="number"
              color="purple"
              size="lg"
            />
          </div>
        </motion.div>
      </div>

      {/* ============================================ */}
      {/* ACCIONES RÁPIDAS */}
      {/* ============================================ */}
      <ChronosCard title="⚡ Acciones Rápidas" className="overflow-visible">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(action.path)}
              className="group relative p-6 rounded-2xl bg-gradient-to-br from-chronos-graphite/50 to-chronos-charcoal/50 border border-chronos-smoke hover:border-white/20 transition-all duration-300 overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
              />
              <div className="relative flex flex-col items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
                >
                  <action.icon className="w-7 h-7 text-white" />
                </div>
                <span className="font-medium text-chronos-white group-hover:text-white transition-colors">
                  {action.label}
                </span>
                <ArrowRight
                  className={`w-4 h-4 ${action.color} opacity-0 group-hover:opacity-100 transition-opacity`}
                />
              </div>
            </motion.button>
          ))}
        </div>
      </ChronosCard>

      {/* ============================================ */}
      {/* GRÁFICOS */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingresos vs Gastos */}
        <ChronosChart
          data={ingresosChart}
          type="area"
          xKey="mes"
          yKeys={['ingresos', 'gastos']}
          title="📈 Ingresos vs Gastos"
          subtitle="Últimos 6 meses"
          height={350}
          colors={['#00d9ff', '#ef4444']}
          loading={loading}
          animated
        />

        {/* Capital por Banco */}
        <ChronosChart
          data={capitalPorBanco}
          type="bar"
          xKey="banco"
          yKeys={['capital']}
          title="🏦 Capital por Banco"
          subtitle="Distribución actual"
          height={350}
          colors={['#8b5cf6', '#00d9ff', '#10b981', '#f59e0b']}
          loading={loading}
          animated
        />
      </div>

      {/* ============================================ */}
      {/* ADVANCED CHARTS - PHASE 6 */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        {/* Section Header with Export */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-chronos-white">📊 Analíticas Avanzadas</h2>
            <p className="text-chronos-silver mt-1">Visualizaciones interactivas del negocio</p>
          </div>
          <ExportButton
            title="Dashboard Ejecutivo"
            subtitle={`Período: ${timeRange.toUpperCase()} | Capital: $${metrics.capitalTotal.toLocaleString()}`}
            fileName={`dashboard_ejecutivo_${Date.now()}`}
            formats={['pdf', 'excel', 'png']}
            tables={[
              {
                title: 'Métricas Principales',
                headers: ['Métrica', 'Valor'],
                rows: [
                  ['Capital Total', `$${metrics.capitalTotal.toLocaleString()}`],
                  ['Ingresos Reales', `$${metrics.ingresosReales.toLocaleString()}`],
                  ['Por Cobrar', `$${metrics.ingresosPotenciales.toLocaleString()}`],
                  ['Clientes Activos', metrics.clientesActivos.toString()],
                  ['Total Ventas', metrics.ventasTotal.toString()],
                  ['Ventas Pagadas', metrics.ventasPagadas.toString()],
                  ['Ventas Pendientes', metrics.ventasPendientes.toString()],
                ],
              },
            ]}
          />
        </div>

        {/* Charts Grid - Row 1: Gauge + Sankey */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gauge: % Cumplimiento Objetivos */}
          <ChronosCard variant="glass-metal">
            <div className="p-6">
              <h3 className="text-xl font-bold text-chronos-white mb-4 flex items-center gap-2">
                🎯 Cumplimiento de Objetivos
              </h3>
              <AdvancedChart
                type="gauge"
                data={objetivoGaugeData}
                title=""
                height={300}
                animationDelay={0}
              />
              <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-chronos-silver text-sm">Actual</p>
                  <p className="text-neon-cyan text-xl font-bold">
                    ${metrics.ingresosReales.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-chronos-silver text-sm">Meta Mensual</p>
                  <p className="text-chronos-white text-xl font-bold">$500,000</p>
                </div>
              </div>
            </div>
          </ChronosCard>

          {/* Sankey: Flujo Completo */}
          <ChronosCard variant="glass-metal">
            <div className="p-6">
              <h3 className="text-xl font-bold text-chronos-white mb-4 flex items-center gap-2">
                🌊 Flujo de Capital
              </h3>
              <AdvancedChart
                type="sankey"
                data={flujoSankeyData}
                title=""
                height={300}
                animationDelay={200}
              />
            </div>
          </ChronosCard>
        </div>

        {/* Charts Grid - Row 2: Radar + Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar: Comparativa de Áreas */}
          <ChronosCard variant="glass-metal">
            <div className="p-6">
              <h3 className="text-xl font-bold text-chronos-white mb-4 flex items-center gap-2">
                ⚡ Rendimiento por Área
              </h3>
              <AdvancedChart
                type="radar"
                data={areasRadarData}
                title=""
                height={300}
                animationDelay={400}
              />
            </div>
          </ChronosCard>

          {/* Heatmap: Actividad Global */}
          <ChronosCard variant="glass-metal">
            <div className="p-6">
              <h3 className="text-xl font-bold text-chronos-white mb-4 flex items-center gap-2">
                🔥 Actividad por Día/Hora
              </h3>
              <AdvancedChart
                type="heatmap"
                data={actividadHeatmapData}
                title=""
                height={300}
                animationDelay={600}
              />
            </div>
          </ChronosCard>
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* ALERTAS Y NOTIFICACIONES */}
      {/* ============================================ */}
      {metrics.stockBajo > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-glass p-4 rounded-xl border-l-4 border-neon-amber"
        >
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-6 h-6 text-neon-amber flex-shrink-0" />
            <div>
              <p className="font-semibold text-chronos-white">⚠️ Alerta de Stock Bajo</p>
              <p className="text-sm text-chronos-silver">
                {metrics.stockBajo} productos necesitan reabastecimiento
              </p>
            </div>
            <ChronosButton variant="secondary" size="sm" onClick={() => navigate('/almacen')}>
              Ver Detalles
            </ChronosButton>
          </div>
        </motion.div>
      )}

      {/* ============================================ */}
      {/* ÚLTIMAS VENTAS */}
      {/* ============================================ */}
      <ChronosCard
        title="💰 Últimas Ventas"
        subtitle="Registro de transacciones recientes"
        icon={ShoppingCart}
      >
        <ChronosTable
          data={ultimasVentas as unknown as Record<string, unknown>[]}
          columns={ventasTableColumns}
          loading={loading}
          pageSize={5}
          onRowClick={(row) => navigate(`/ventas/${row.id}`)}
          striped
          hoverable
        />
      </ChronosCard>
    </div>
  );
}
