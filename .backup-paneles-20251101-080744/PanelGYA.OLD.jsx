/**
 * 🏦 PANEL GYA ELEGANT - DISEÑO REFINADO Y SOFISTICADO
 * ====================================================
 * Panel centralizado de Gastos y Abonos de TODOS los bancos
 *
 * ✨ DISEÑO ELEGANTE:
 * - 30 partículas sutiles (no exagerado)
 * - Colores apagados y refinados
 * - Animaciones suaves y lentas
 * - Sin efectos 3D exagerados
 * - Espacios en blanco generosos
 * - Tipografía limpia y clara
 */
import { memo, useMemo, useState } from 'react';

import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Download,
  RefreshCw,
  Search,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import { LiquidCard } from '../../../components/premium/AdvancedAnimationSystem';
import { useFlowStore } from '../../../stores/flowStore';

// ============================================
// COMPONENTE: PARTÍCULAS SUTILES (solo 30)
// ============================================
const SubtleParticles = memo(() => {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1, // Más pequeñas
        duration: Math.random() * 30 + 20, // Más lentas
        delay: Math.random() * 8,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background:
              'radial-gradient(circle, rgba(16,185,129,0.4) 0%, rgba(20,184,166,0.2) 100%)',
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
});

SubtleParticles.displayName = 'SubtleParticles';

// ============================================
// COMPONENTE: KPI ELEGANTE CON LIQUID EFFECT
// ============================================
const ElegantKPI = memo(({ title, value, icon: Icon, gradient }) => {
  return (
    <LiquidCard className="p-6 backdrop-blur-sm bg-white/5 border border-white/5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{title}</p>
        <Icon className="w-5 h-5 text-emerald-400 opacity-60" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-semibold text-white"
      >
        ${typeof value === 'number' ? value.toLocaleString() : value}
      </motion.div>

      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 opacity-50"
        style={{ background: gradient }}
      />
    </LiquidCard>
  );
});

ElegantKPI.displayName = 'ElegantKPI';

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function PanelGYA() {
  const { bancos } = useFlowStore();
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [tabActiva, setTabActiva] = useState('graficos');

  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Consolidar datos de todos los bancos
  const movimientos = useMemo(() => {
    const allMovimientos = [];

    Object.entries(bancos).forEach(([bancoKey, banco]) => {
      const bancoNombre = bancoKey.charAt(0).toUpperCase() + bancoKey.slice(1);

      if (banco.ingresos) {
        banco.ingresos.forEach((ing) => {
          allMovimientos.push({
            fecha: ing.fecha,
            tipo: `Ingreso ${bancoNombre}`,
            origen: ing.cliente || ing.origen || bancoNombre,
            destino: ing.destino || bancoNombre,
            valor: parseFloat(ing.ingreso) || 0,
            concepto: ing.concepto || 'Ingreso',
            // ✅ CAMPOS AGREGADOS del Excel
            pesos: parseFloat(ing.pesos) || 0,
            observaciones: ing.observaciones || '',
            panel: bancoNombre, // Panel de origen
          });
        });
      }

      if (banco.gastos) {
        banco.gastos.forEach((gasto) => {
          allMovimientos.push({
            fecha: gasto.fecha,
            tipo: `Gasto ${bancoNombre}`,
            origen: gasto.origenDelGastoOAbono || gasto.origen || bancoNombre,
            destino: gasto.destino || bancoNombre,
            valor: parseFloat(gasto.gasto) || 0,
            concepto: gasto.concepto || 'Gasto',
            // ✅ CAMPOS AGREGADOS del Excel (Control_Maestro cols M-V)
            pesos: parseFloat(gasto.pesos) || 0,
            observaciones: gasto.observaciones || '',
            panel: bancoNombre, // Panel de origen
          });
        });
      }
    });

    return allMovimientos.filter((m) => m.fecha && m.valor > 0);
  }, [bancos]);

  const totalIngresos = useMemo(() => {
    return movimientos
      .filter((m) => m.tipo?.includes('Ingreso'))
      .reduce((sum, m) => sum + m.valor, 0);
  }, [movimientos]);

  const totalGastos = useMemo(() => {
    return movimientos
      .filter((m) => m.tipo?.includes('Gasto'))
      .reduce((sum, m) => sum + m.valor, 0);
  }, [movimientos]);

  const balance = useMemo(() => totalIngresos - totalGastos, [totalIngresos, totalGastos]);

  // Datos para gráficos
  const chartDataTendencia = useMemo(() => {
    const grouped = {};
    movimientos.forEach((m) => {
      if (!grouped[m.fecha]) {
        grouped[m.fecha] = { fecha: m.fecha, ingresos: 0, gastos: 0 };
      }
      if (m.tipo?.includes('Ingreso')) {
        grouped[m.fecha].ingresos += m.valor;
      } else if (m.tipo?.includes('Gasto')) {
        grouped[m.fecha].gastos += m.valor;
      }
    });
    return Object.values(grouped)
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
      .slice(-30);
  }, [movimientos]);

  const chartDataDistribucion = useMemo(() => {
    return [
      { name: 'Ingresos', value: totalIngresos, color: '#10b981' },
      { name: 'Gastos', value: totalGastos, color: '#ef4444' },
    ];
  }, [totalIngresos, totalGastos]);

  const chartDataPorTipo = useMemo(() => {
    const tipos = {};
    movimientos.forEach((m) => {
      const tipo = m.tipo || 'Sin tipo';
      if (!tipos[tipo]) tipos[tipo] = 0;
      tipos[tipo] += m.valor;
    });
    return Object.entries(tipos)
      .map(([tipo, total]) => ({ tipo, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [movimientos]);

  const chartDataPorMes = useMemo(() => {
    const meses = {};
    movimientos.forEach((m) => {
      const mes = new Date(m.fecha).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
      });
      if (!meses[mes]) meses[mes] = { mes, ingresos: 0, gastos: 0 };
      if (m.tipo?.includes('Ingreso')) {
        meses[mes].ingresos += m.valor;
      } else if (m.tipo?.includes('Gasto')) {
        meses[mes].gastos += m.valor;
      }
    });
    return Object.values(meses).slice(-12);
  }, [movimientos]);

  const movimientosFiltrados = useMemo(() => {
    return movimientos.filter((m) => {
      const matchBusqueda =
        m.origen?.toLowerCase().includes(busqueda.toLowerCase()) ||
        m.destino?.toLowerCase().includes(busqueda.toLowerCase()) ||
        m.concepto?.toLowerCase().includes(busqueda.toLowerCase());
      const matchTipo = filtroTipo === 'Todos' || m.tipo === filtroTipo;
      return matchBusqueda && matchTipo;
    });
  }, [movimientos, busqueda, filtroTipo]);

  const tiposUnicos = useMemo(() => {
    const tipos = new Set();
    movimientos.forEach((m) => {
      if (m.tipo) tipos.add(m.tipo);
    });
    return Array.from(tipos);
  }, [movimientos]);

  const tabs = useMemo(
    () => [
      { id: 'graficos', label: 'Gráficos', icon: BarChart3 },
      { id: 'movimientos', label: 'Movimientos', icon: Activity },
      { id: 'timeline', label: 'Timeline', icon: Calendar },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative">
      <SubtleParticles />

      {/* Scroll Progress - más delgado */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-emerald-500/50 via-teal-500/50 to-emerald-500/50 origin-left z-50"
        style={{ scaleX }}
      />

      <div className="relative z-10 p-8 max-w-7xl mx-auto space-y-6">
        {/* HEADER MINIMALISTA */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-white mb-1">Gastos y Abonos</h1>
              <p className="text-sm text-slate-400">Control financiero consolidado</p>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 flex items-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                Exportar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="px-3 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 flex items-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* KPIs ELEGANTES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ElegantKPI
              title="Total Ingresos"
              value={totalIngresos}
              icon={TrendingUp}
              gradient="linear-gradient(90deg, rgba(16,185,129,0.5) 0%, rgba(5,150,105,0.5) 100%)"
            />
            <ElegantKPI
              title="Total Gastos"
              value={totalGastos}
              icon={TrendingDown}
              gradient="linear-gradient(90deg, rgba(239,68,68,0.5) 0%, rgba(220,38,38,0.5) 100%)"
            />
            <ElegantKPI
              title="Balance Neto"
              value={balance}
              icon={Wallet}
              gradient="linear-gradient(90deg, rgba(20,184,166,0.5) 0%, rgba(13,148,136,0.5) 100%)"
            />
          </div>
        </motion.div>

        {/* FILTROS LIMPIOS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-3"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar movimientos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/30 transition-all"
            />
          </div>

          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-white text-sm focus:outline-none focus:border-emerald-500/30 transition-all"
          >
            <option value="Todos" className="bg-slate-900">
              Todos los tipos
            </option>
            {tiposUnicos.map((tipo) => (
              <option key={tipo} value={tipo} className="bg-slate-900">
                {tipo}
              </option>
            ))}
          </select>
        </motion.div>

        {/* TABS MINIMALISTAS */}
        <div className="flex gap-2 border-b border-white/5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tabActiva === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setTabActiva(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'text-emerald-400 border-b-2 border-emerald-400'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* CONTENIDO */}
        <AnimatePresence mode="wait">
          {/* TAB: GRÁFICOS */}
          {tabActiva === 'graficos' && (
            <motion.div
              key="graficos"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/5">
                <h3 className="text-sm font-medium text-slate-300 mb-4">Tendencia Financiera</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={chartDataTendencia}>
                    <defs>
                      <linearGradient id="ingresosGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gastosGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="fecha" stroke="#64748b" style={{ fontSize: '11px' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '11px' }} />
                    <RechartsTooltip
                      contentStyle={{
                        background: 'rgba(15,23,42,0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="ingresos"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#ingresosGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="gastos"
                      stroke="#ef4444"
                      strokeWidth={2}
                      fill="url(#gastosGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/5">
                <h3 className="text-sm font-medium text-slate-300 mb-4">Distribución</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={chartDataDistribucion}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                      style={{ fontSize: '12px' }}
                    >
                      {chartDataDistribucion.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        background: 'rgba(15,23,42,0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/5">
                <h3 className="text-sm font-medium text-slate-300 mb-4">Por Tipo</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartDataPorTipo} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis type="number" stroke="#64748b" style={{ fontSize: '11px' }} />
                    <YAxis
                      dataKey="tipo"
                      type="category"
                      stroke="#64748b"
                      width={120}
                      style={{ fontSize: '10px' }}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        background: 'rgba(15,23,42,0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="total" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/5">
                <h3 className="text-sm font-medium text-slate-300 mb-4">Comparación Mensual</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartDataPorMes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis
                      dataKey="mes"
                      stroke="#64748b"
                      style={{ fontSize: '10px' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="#64748b" style={{ fontSize: '11px' }} />
                    <RechartsTooltip
                      contentStyle={{
                        background: 'rgba(15,23,42,0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* TAB: MOVIMIENTOS */}
          {tabActiva === 'movimientos' && (
            <motion.div
              key="movimientos"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/5"
            >
              <h2 className="text-sm font-medium text-slate-300 mb-4">
                {movimientosFiltrados.length} movimientos
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-white/5">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-slate-400">Fecha</th>
                      <th className="px-3 py-2 text-left font-medium text-slate-400">Panel</th>
                      <th className="px-3 py-2 text-left font-medium text-slate-400">Tipo</th>
                      <th className="px-3 py-2 text-left font-medium text-slate-400">Origen</th>
                      <th className="px-3 py-2 text-left font-medium text-slate-400">Destino</th>
                      <th className="px-3 py-2 text-right font-medium text-slate-400">Valor</th>
                      <th className="px-3 py-2 text-right font-medium text-slate-400">Pesos</th>
                      <th className="px-3 py-2 text-left font-medium text-slate-400">Concepto</th>
                      <th className="px-3 py-2 text-left font-medium text-slate-400">
                        Observaciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {movimientosFiltrados.slice(0, 50).map((mov, index) => {
                      const esGasto = mov.tipo?.includes('Gasto');
                      return (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.01 }}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="px-3 py-2 text-slate-400">
                            {new Date(mov.fecha).toLocaleDateString('es-MX')}
                          </td>
                          <td className="px-3 py-2 text-slate-300 text-xs">{mov.panel || '-'}</td>
                          <td className="px-3 py-2">
                            <span
                              className={`px-2 py-0.5 rounded text-xs ${
                                esGasto
                                  ? 'bg-red-500/10 text-red-400'
                                  : 'bg-green-500/10 text-green-400'
                              }`}
                            >
                              {mov.tipo}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-slate-300">{mov.origen}</td>
                          <td className="px-3 py-2 text-slate-300">{mov.destino}</td>
                          <td
                            className={`px-3 py-2 text-right font-medium ${esGasto ? 'text-red-400' : 'text-green-400'}`}
                          >
                            {esGasto ? '-' : '+'}${mov.valor.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-right text-slate-400">
                            {mov.pesos > 0 ? `$${mov.pesos.toLocaleString()}` : '-'}
                          </td>
                          <td className="px-3 py-2 text-slate-400 max-w-xs truncate">
                            {mov.concepto || '-'}
                          </td>
                          <td className="px-3 py-2 text-slate-400 max-w-xs truncate text-xs">
                            {mov.observaciones || '-'}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {movimientosFiltrados.length === 0 && (
                <div className="text-center text-slate-400 py-12">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No se encontraron movimientos</p>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB: TIMELINE */}
          {tabActiva === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {Object.entries(
                movimientosFiltrados.reduce((acc, mov) => {
                  const mes = new Date(mov.fecha).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                  });
                  if (!acc[mes]) acc[mes] = [];
                  acc[mes].push(mov);
                  return acc;
                }, {})
              )
                .slice(0, 6)
                .map(([mes, movs]) => (
                  <div
                    key={mes}
                    className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/5"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-medium text-white capitalize">{mes}</h3>
                      <span className="text-xs text-slate-400">({movs.length})</span>
                    </div>

                    <div className="space-y-2">
                      {movs.slice(0, 5).map((mov, i) => {
                        const esGasto = mov.tipo?.includes('Gasto');
                        return (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              {esGasto ? (
                                <ArrowDownLeft className="w-3 h-3 text-red-400" />
                              ) : (
                                <ArrowUpRight className="w-3 h-3 text-green-400" />
                              )}
                              <div>
                                <p className="text-xs font-medium text-white">{mov.tipo}</p>
                                <p className="text-xs text-slate-400">
                                  {mov.origen} → {mov.destino}
                                </p>
                                {mov.observaciones && (
                                  <p className="text-xs text-slate-500 truncate max-w-xs mt-0.5">
                                    {mov.observaciones}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div
                                className={`text-sm font-medium ${esGasto ? 'text-red-400' : 'text-green-400'}`}
                              >
                                {esGasto ? '-' : '+'}${mov.valor.toLocaleString()}
                              </div>
                              <p className="text-xs text-slate-500">
                                {new Date(mov.fecha).toLocaleDateString('es-MX')}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
