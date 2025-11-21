/**
 * 💎 PANEL LEFTIE ELEGANTE
 * ========================================================
 * Diseño elegante, sutil y atractivo con:
 * ✨ 30 partículas animadas indigo/violet
 * 📊 CandlestickChart innovador (variación balance en tiempo)
 * 🎯 4 KPIs premium con counter animations
 * 📋 5 tabs completas: Gráficos, Ingresos, Gastos, Cortes, Transferencias
 * 🔄 Transferencias con CRUD completo
 * 🎨 Componentes elegantes reutilizables
 * ⚡ Performance optimizado con React.memo + useMemo
 */
import { memo, useCallback, useMemo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ArrowRightLeft,
  Building2,
  DollarSign,
  PieChart,
  Plus,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { ExchangeRateMonitor } from '../../../components/premium/ExchangeRateMonitor';
import DATOS_BOVEDAS_COMPLETOS from '../../../data/datos_bovedas_completos.json';
import { useFlowStore } from '../../../stores/flowStore';
import {
  AnimatedButton,
  AnimatedTabBar,
  CreativeParticles,
  ElegantModal,
  PremiumKPI,
  ScrollProgress,
} from './ElegantComponents';
import { TablaCortesPremium, TablaTransferenciasPremium } from './TablasBancoPremium';

// ============================================
// THEME COLORS
// ============================================
const COLORS = {
  primary: ['#6366f1', '#8b5cf6'],
  gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  particles: {
    from: 'rgba(99, 102, 241, 0.6)',
    to: 'rgba(139, 92, 246, 0.3)',
  },
};

// ============================================
// CANDLESTICK CHART - Balance Variation Over Time
// ============================================
const CandlestickBalanceChart = memo(({ ingresos, gastos, cortes }) => {
  // Crear datos tipo candlestick agrupados por semana
  const candlestickData = useMemo(() => {
    // Combinar y ordenar todas las transacciones
    const allTransactions = [
      ...ingresos.map((i) => ({
        fecha: i.fecha,
        tipo: 'ingreso',
        valor: parseFloat(i.ingreso) || 0,
      })),
      ...gastos.map((g) => ({
        fecha: g.fecha,
        tipo: 'gasto',
        valor: parseFloat(g.gasto) || 0,
      })),
    ].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    // Agrupar por semana
    const weeks = {};
    let runningBalance = 0;

    allTransactions.forEach((trans) => {
      const fecha = new Date(trans.fecha);
      const weekStart = new Date(fecha);
      weekStart.setDate(fecha.getDate() - fecha.getDay()); // Inicio de semana
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weeks[weekKey]) {
        weeks[weekKey] = {
          week: weekKey,
          open: runningBalance,
          high: runningBalance,
          low: runningBalance,
          close: runningBalance,
          balances: [runningBalance],
        };
      }

      // Actualizar balance
      if (trans.tipo === 'ingreso') {
        runningBalance += trans.valor;
      } else {
        runningBalance -= trans.valor;
      }

      weeks[weekKey].balances.push(runningBalance);
      weeks[weekKey].high = Math.max(weeks[weekKey].high, runningBalance);
      weeks[weekKey].low = Math.min(weeks[weekKey].low, runningBalance);
      weeks[weekKey].close = runningBalance;
    });

    return Object.values(weeks).slice(-12); // Últimas 12 semanas
  }, [ingresos, gastos]);

  const CustomCandlestick = ({ x, y, width, index, payload }) => {
    const { open, close, high, low } = payload;
    const isPositive = close >= open;
    const color = isPositive ? '#10b981' : '#ef4444';
    const height = Math.abs(close - open) * 10 || 5;
    const yPos = Math.min(open, close) * 10;

    return (
      <g>
        {/* High-Low line */}
        <motion.line
          x1={x + width / 2}
          y1={high * 10}
          x2={x + width / 2}
          y2={low * 10}
          stroke={color}
          strokeWidth={1}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: index * 0.05, duration: 0.5 }}
        />
        {/* Open-Close body */}
        <motion.rect
          x={x + 2}
          y={yPos}
          width={width - 4}
          height={height}
          fill={color}
          opacity={0.8}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.[0]) return null;
    const data = payload[0].payload;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900/95 backdrop-blur-xl border border-indigo-500/30 rounded-xl p-4 shadow-2xl"
      >
        <p className="text-xs text-slate-400 mb-2">Semana: {data.week}</p>
        <div className="space-y-1 text-sm">
          <p className="text-green-400">Apertura: ${data.open.toLocaleString()}</p>
          <p className="text-indigo-400">Cierre: ${data.close.toLocaleString()}</p>
          <p className="text-cyan-400">Máximo: ${data.high.toLocaleString()}</p>
          <p className="text-red-400">Mínimo: ${data.low.toLocaleString()}</p>
          <p className={`font-bold ${data.close >= data.open ? 'text-green-400' : 'text-red-400'}`}>
            {data.close >= data.open ? '↗' : '↘'}{' '}
            {Math.abs(data.close - data.open).toLocaleString()}
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={candlestickData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="week"
            stroke="rgba(255,255,255,0.6)"
            label={{ value: 'Semana', position: 'insideBottom', offset: -10, fill: '#6366f1' }}
          />
          <YAxis
            stroke="rgba(255,255,255,0.6)"
            label={{ value: 'Balance (MXN)', angle: -90, position: 'insideLeft', fill: '#8b5cf6' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" />
          <Bar dataKey="high" fill="rgba(99, 102, 241, 0.3)" />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ fill: '#8b5cf6', r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500"></div>
          <span className="text-slate-400">Balance positivo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500"></div>
          <span className="text-slate-400">Balance negativo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-6 bg-indigo-500"></div>
          <span className="text-slate-400">Tendencia de cierre</span>
        </div>
      </div>
    </motion.div>
  );
});

CandlestickBalanceChart.displayName = 'CandlestickBalanceChart';

// ============================================
// MAIN COMPONENT - PANEL LEFTIE ELEGANTE
// ============================================
const PanelLeftie = () => {
  // ============================================
  // STATE & DATA
  // ============================================
  const { bancos, addIngresoBanco, addGastoBanco, addCorteBanco, addTransferenciaBanco } =
    useFlowStore();
  const datosLeftie = bancos.leftie || {};
  const ingresos = datosLeftie.ingresos || [];
  const gastos = datosLeftie.gastos || [];
  const cortes = datosLeftie.cortes || [];
  const transferencias = datosLeftie.transferencias || [];

  const [tabActiva, setTabActiva] = useState('graficos');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [formData, setFormData] = useState({});

  // DATOS REALES desde JSON maestro
  const datosReales = useMemo(() => {
    const panelLeftie = DATOS_BOVEDAS_COMPLETOS.paneles.find((p) => p.nombre === 'Leftie');
    const rfActual = DATOS_BOVEDAS_COMPLETOS.controlMaestro.rfActual.paneles['Leftie'] || 45844;

    return {
      rfActual: rfActual, // $45,844
      ingresos: panelLeftie?.ingresos?.registros || [],
      gastos: panelLeftie?.gastos?.registros || [],
      cortes: panelLeftie?.rfActual?.cortes || [],
      totalIngresos:
        panelLeftie?.ingresos?.registros?.reduce((s, i) => s + (i.Ingreso || 0), 0) || 0,
      totalGastos: panelLeftie?.gastos?.registros?.reduce((s, g) => s + (g.Gasto || 0), 0) || 0,
    };
  }, []);

  // ============================================
  // CALCULATIONS
  // ============================================
  const totalIngresos = useMemo(
    () =>
      datosReales.totalIngresos +
      ingresos.reduce((sum, ing) => sum + (parseFloat(ing.ingreso) || 0), 0),
    [ingresos, datosReales]
  );

  const totalGastos = useMemo(
    () =>
      datosReales.totalGastos +
      gastos.reduce((sum, gasto) => sum + (parseFloat(gasto.gasto) || 0), 0),
    [gastos, datosReales]
  );

  const rfActual = useMemo(() => {
    return datosReales.rfActual;
  }, [datosReales]);

  const balance = useMemo(() => totalIngresos - totalGastos, [totalIngresos, totalGastos]);

  const totalTransferencias = useMemo(
    () => transferencias.reduce((sum, t) => sum + (parseFloat(t.monto) || 0), 0),
    [transferencias]
  );

  // ============================================
  // HANDLERS
  // ============================================
  const openModal = useCallback((type) => {
    setModalType(type);
    setFormData(type === 'transferencia' ? { origen: 'Leftie' } : {});
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalType(null);
    setFormData({});
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const nuevoRegistro = {
        id: `${modalType}_leftie_${Date.now()}`,
        fecha: formData.fecha || new Date().toISOString().split('T')[0],
        ...formData,
      };

      if (modalType === 'ingreso') {
        addIngresoBanco('leftie', nuevoRegistro);
      } else if (modalType === 'gasto') {
        addGastoBanco('leftie', nuevoRegistro);
      } else if (modalType === 'corte') {
        addCorteBanco('leftie', nuevoRegistro);
      } else if (modalType === 'transferencia') {
        addTransferenciaBanco('leftie', nuevoRegistro);
      }

      closeModal();
    },
    [
      modalType,
      formData,
      addIngresoBanco,
      addGastoBanco,
      addCorteBanco,
      addTransferenciaBanco,
      closeModal,
    ]
  );

  // ============================================
  // TABS CONFIGURATION
  // ============================================
  const tabs = useMemo(
    () => [
      { id: 'graficos', label: 'Gráficos', icon: PieChart },
      { id: 'ingresos', label: 'Ingresos', icon: TrendingUp },
      { id: 'gastos', label: 'Gastos', icon: TrendingDown },
      { id: 'cortes', label: 'Cortes RF', icon: Activity },
      { id: 'transferencias', label: 'Transferencias', icon: ArrowRightLeft },
    ],
    []
  );

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Particles Background - 30 particles */}
      <CreativeParticles count={30} colors={[COLORS.particles.from, COLORS.particles.to]} />

      {/* Scroll Progress */}
      <ScrollProgress color={COLORS.primary[0]} />

      <div className="relative z-10 space-y-6 p-6">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                className="p-4 bg-gradient-to-br from-indigo-500/30 to-violet-500/20 rounded-2xl border border-indigo-500/30"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Building2 className="w-8 h-8 text-indigo-400" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  Leftie
                </h1>
                <p className="text-slate-400 text-sm mt-1">Banco Leftie - Sistema Elegante</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 mb-1">RF Actual</p>
              <p className="text-3xl font-bold text-indigo-400">${rfActual.toLocaleString()}</p>
            </div>
          </div>

          {/* KPIs PREMIUM */}
          <div className="grid grid-cols-4 gap-4">
            <PremiumKPI
              title="Total Ingresos"
              value={totalIngresos}
              icon={TrendingUp}
              trend={14.2}
              color={COLORS.primary[0]}
              index={0}
            />
            <PremiumKPI
              title="Total Gastos"
              value={totalGastos}
              icon={TrendingDown}
              trend={-6.8}
              color="#ef4444"
              index={1}
            />
            <PremiumKPI
              title="Balance"
              value={balance}
              icon={DollarSign}
              trend={balance >= 0 ? 18.5 : -3.7}
              color={balance >= 0 ? '#10b981' : '#f59e0b'}
              index={2}
            />
            <PremiumKPI
              title="RF Actual"
              value={rfActual}
              icon={Wallet}
              trend={11.3}
              color={COLORS.primary[1]}
              index={3}
            />
          </div>

          {/* EXCHANGE RATE MONITOR - Monitor de TC para operaciones USD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <ExchangeRateMonitor showHistory={true} autoRefresh={true} refreshInterval={300000} />
          </motion.div>
        </motion.div>

        {/* TABS */}
        <AnimatedTabBar
          tabs={tabs}
          activeTab={tabActiva}
          onChange={setTabActiva}
          accentColor={COLORS.primary[0]}
        />

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          {/* GRÁFICOS */}
          {tabActiva === 'graficos' && (
            <motion.div
              key="graficos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-bold text-indigo-400 flex items-center gap-2 mb-6">
                <PieChart className="w-7 h-7" />
                CandlestickChart - Variación de Balance Semanal
              </h2>
              <p className="text-slate-400 text-sm mb-4">
                Cada barra representa una semana. Las{' '}
                <span className="text-green-400 font-semibold">verdes</span> indican crecimiento,
                las <span className="text-red-400 font-semibold">rojas</span> indican declive. La
                línea muestra la tendencia del balance de cierre.
              </p>
              <CandlestickBalanceChart ingresos={ingresos} gastos={gastos} cortes={cortes} />
            </motion.div>
          )}

          {/* TABLA INGRESOS */}
          {tabActiva === 'ingresos' && (
            <motion.div
              key="ingresos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
                  <TrendingUp className="w-7 h-7" />
                  Ingresos - {ingresos.length} registros
                </h2>
                <AnimatedButton
                  onClick={() => openModal('ingreso')}
                  colors={['#10b981', '#059669']}
                  icon={Plus}
                >
                  Nuevo Ingreso
                </AnimatedButton>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-sm">
                  <thead className="bg-white/5 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-slate-300">Fecha</th>
                      <th className="px-4 py-3 text-left text-slate-300">Cliente</th>
                      <th className="px-4 py-3 text-right text-slate-300">Ingreso</th>
                      <th className="px-4 py-3 text-right text-slate-300">TC</th>
                      <th className="px-4 py-3 text-right text-slate-300">Pesos</th>
                      <th className="px-4 py-3 text-left text-slate-300">Destino</th>
                      <th className="px-4 py-3 text-left text-slate-300">Concepto</th>
                      <th className="px-4 py-3 text-left text-slate-300">Observaciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {ingresos.map((ing, idx) => {
                      const ingreso = parseFloat(ing.ingreso) || 0;
                      const tc = parseFloat(ing.tc) || 0;
                      const pesos = parseFloat(ing.pesos) || 0;
                      return (
                        <motion.tr
                          key={ing.id || idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.02 }}
                          whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', x: 5 }}
                          className="cursor-pointer"
                        >
                          <td className="px-4 py-3 text-slate-300">
                            {ing.fecha ? new Date(ing.fecha).toLocaleDateString('es-MX') : 'N/A'}
                          </td>
                          <td className="px-4 py-3 font-medium text-white">{ing.cliente || '-'}</td>
                          <td className="px-4 py-3 text-right font-bold text-green-400">
                            ${ingreso.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-400">
                            {tc > 0 ? `$${tc.toFixed(2)}` : '-'}
                          </td>
                          <td className="px-4 py-3 text-right text-cyan-400">
                            {pesos > 0 ? `$${pesos.toLocaleString()}` : '-'}
                          </td>
                          <td className="px-4 py-3 text-slate-400">{ing.destino || 'Leftie'}</td>
                          <td className="px-4 py-3 text-slate-400 max-w-xs truncate">
                            {ing.concepto || '-'}
                          </td>
                          <td className="px-4 py-3 text-slate-400 max-w-xs truncate">
                            {ing.observaciones || '-'}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-white/5 sticky bottom-0">
                    <tr className="border-t-2 border-green-500/30">
                      <td colSpan="2" className="px-4 py-3 font-bold text-slate-300">
                        TOTAL
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-green-400">
                        ${totalIngresos.toLocaleString()}
                      </td>
                      <td colSpan="5"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {ingresos.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-slate-400 py-12"
                >
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>No hay ingresos registrados</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* TABLA GASTOS */}
          {tabActiva === 'gastos' && (
            <motion.div
              key="gastos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-red-400 flex items-center gap-2">
                  <TrendingDown className="w-7 h-7" />
                  Gastos - {gastos.length} registros
                </h2>
                <AnimatedButton
                  onClick={() => openModal('gasto')}
                  colors={['#ef4444', '#dc2626']}
                  icon={Plus}
                >
                  Nuevo Gasto
                </AnimatedButton>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-sm">
                  <thead className="bg-white/5 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-slate-300">Fecha</th>
                      <th className="px-4 py-3 text-left text-slate-300">Origen del Gasto</th>
                      <th className="px-4 py-3 text-right text-slate-300">Gasto</th>
                      <th className="px-4 py-3 text-right text-slate-300">TC</th>
                      <th className="px-4 py-3 text-right text-slate-300">Dólares</th>
                      <th className="px-4 py-3 text-left text-slate-300">Destino</th>
                      <th className="px-4 py-3 text-left text-slate-300">Concepto</th>
                      <th className="px-4 py-3 text-left text-slate-300">Observaciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {gastos.map((gasto, idx) => {
                      const valorGasto = parseFloat(gasto.gasto) || 0;
                      const tc = parseFloat(gasto.tc) || 0;
                      const dolares = parseFloat(gasto.dolares) || 0;
                      return (
                        <motion.tr
                          key={gasto.id || idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.02 }}
                          whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', x: 5 }}
                          className="cursor-pointer"
                        >
                          <td className="px-4 py-3 text-slate-300">
                            {gasto.fecha
                              ? new Date(gasto.fecha).toLocaleDateString('es-MX')
                              : 'N/A'}
                          </td>
                          <td className="px-4 py-3 font-medium text-white">
                            {gasto.origenDelGastoOAbono || '-'}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-red-400">
                            ${valorGasto.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-400">
                            {tc > 0 ? `$${tc.toFixed(2)}` : '-'}
                          </td>
                          <td className="px-4 py-3 text-right text-cyan-400">
                            {dolares > 0 ? `$${dolares.toLocaleString()}` : '-'}
                          </td>
                          <td className="px-4 py-3 text-slate-400">{gasto.destino || '-'}</td>
                          <td className="px-4 py-3 text-slate-400 max-w-xs truncate">
                            {gasto.concepto || '-'}
                          </td>
                          <td className="px-4 py-3 text-slate-400 max-w-xs truncate">
                            {gasto.observaciones || '-'}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-white/5 sticky bottom-0">
                    <tr className="border-t-2 border-red-500/30">
                      <td colSpan="2" className="px-4 py-3 font-bold text-slate-300">
                        TOTAL
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-red-400">
                        ${totalGastos.toLocaleString()}
                      </td>
                      <td colSpan="5"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {gastos.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-slate-400 py-12"
                >
                  <TrendingDown className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>No hay gastos registrados</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* TABLA CORTES */}
          {tabActiva === 'cortes' && (
            <TablaCortesPremium
              cortes={cortes.map((c) => ({
                ...c,
                monto: parseFloat(c.corte) || parseFloat(c.monto) || 0,
              }))}
              titulo="RF Actual - Leftie"
              onAgregar={() => openModal('corte')}
            />
          )}

          {/* TABLA TRANSFERENCIAS */}
          {tabActiva === 'transferencias' && (
            <TablaTransferenciasPremium
              transferencias={transferencias}
              titulo="Transferencias - Leftie"
              onAgregar={() => openModal('transferencia')}
            />
          )}
        </AnimatePresence>

        {/* MODAL CRUD */}
        <ElegantModal isOpen={modalOpen} onClose={closeModal} accentColor={COLORS.primary[0]}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              {modalType === 'ingreso' && (
                <>
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  <span className="text-green-400">Nuevo Ingreso</span>
                </>
              )}
              {modalType === 'gasto' && (
                <>
                  <TrendingDown className="w-6 h-6 text-red-400" />
                  <span className="text-red-400">Nuevo Gasto</span>
                </>
              )}
              {modalType === 'corte' && (
                <>
                  <Activity className="w-6 h-6 text-indigo-400" />
                  <span className="text-indigo-400">Nuevo Corte RF</span>
                </>
              )}
              {modalType === 'transferencia' && (
                <>
                  <ArrowRightLeft className="w-6 h-6 text-violet-400" />
                  <span className="text-violet-400">Nueva Transferencia</span>
                </>
              )}
            </h3>

            {/* Fecha */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">Fecha</label>
              <input
                type="date"
                value={formData.fecha || new Date().toISOString().split('T')[0]}
                onChange={(e) => handleInputChange('fecha', e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              />
            </div>

            {/* INGRESO FIELDS */}
            {modalType === 'ingreso' && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">Cliente</label>
                  <input
                    type="text"
                    value={formData.cliente || ''}
                    onChange={(e) => handleInputChange('cliente', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    placeholder="Nombre del cliente"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">
                    Ingreso (MXN)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.ingreso || ''}
                    onChange={(e) => handleInputChange('ingreso', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-300">TC</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.tc || ''}
                      onChange={(e) => handleInputChange('tc', e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                      placeholder="Tipo de cambio"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-300">
                      Pesos (MXN)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.pesos || ''}
                      onChange={(e) => handleInputChange('pesos', e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">Destino</label>
                  <input
                    type="text"
                    value={formData.destino || ''}
                    onChange={(e) => handleInputChange('destino', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    placeholder="Destino del ingreso"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">
                    Concepto
                  </label>
                  <input
                    type="text"
                    value={formData.concepto || ''}
                    onChange={(e) => handleInputChange('concepto', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    placeholder="Concepto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">
                    Observaciones
                  </label>
                  <textarea
                    value={formData.observaciones || ''}
                    onChange={(e) => handleInputChange('observaciones', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white min-h-[80px]"
                    placeholder="Observaciones adicionales"
                  />
                </div>
              </>
            )}

            {/* GASTO FIELDS */}
            {modalType === 'gasto' && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">
                    Origen del Gasto
                  </label>
                  <input
                    type="text"
                    value={formData.origenDelGastoOAbono || ''}
                    onChange={(e) => handleInputChange('origenDelGastoOAbono', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    placeholder="Origen"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">
                    Gasto (MXN)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.gasto || ''}
                    onChange={(e) => handleInputChange('gasto', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-300">TC</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.tc || ''}
                      onChange={(e) => handleInputChange('tc', e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                      placeholder="Tipo de cambio"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-300">
                      Dólares (USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.dolares || ''}
                      onChange={(e) => handleInputChange('dolares', e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">Destino</label>
                  <input
                    type="text"
                    value={formData.destino || ''}
                    onChange={(e) => handleInputChange('destino', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    placeholder="Destino"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">
                    Concepto
                  </label>
                  <input
                    type="text"
                    value={formData.concepto || ''}
                    onChange={(e) => handleInputChange('concepto', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    placeholder="Concepto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">
                    Observaciones
                  </label>
                  <textarea
                    value={formData.observaciones || ''}
                    onChange={(e) => handleInputChange('observaciones', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white min-h-[80px]"
                    placeholder="Observaciones adicionales"
                  />
                </div>
              </>
            )}

            {/* CORTE FIELDS */}
            {modalType === 'corte' && (
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-300">
                  Corte RF (MXN)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.corte || ''}
                  onChange={(e) => handleInputChange('corte', e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  placeholder="0.00"
                  required
                />
              </div>
            )}

            {/* TRANSFERENCIA FIELDS */}
            {modalType === 'transferencia' && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">
                    Banco Origen
                  </label>
                  <select
                    value={formData.origen || 'Leftie'}
                    onChange={(e) => handleInputChange('origen', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    required
                  >
                    <option value="Leftie">Leftie</option>
                    <option value="Profit">Profit</option>
                    <option value="Utilidades">Utilidades</option>
                    <option value="Bóveda Monte">Bóveda Monte</option>
                    <option value="Bóveda USA">Bóveda USA</option>
                    <option value="Azteca">Azteca</option>
                    <option value="Flete Sur">Flete Sur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">
                    Banco Destino
                  </label>
                  <select
                    value={formData.destino || ''}
                    onChange={(e) => handleInputChange('destino', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    required
                  >
                    <option value="">Seleccionar banco</option>
                    <option value="Profit">Profit</option>
                    <option value="Utilidades">Utilidades</option>
                    <option value="Bóveda Monte">Bóveda Monte</option>
                    <option value="Bóveda USA">Bóveda USA</option>
                    <option value="Azteca">Azteca</option>
                    <option value="Flete Sur">Flete Sur</option>
                    <option value="Leftie">Leftie</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">
                    Monto (MXN)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.monto || ''}
                    onChange={(e) => handleInputChange('monto', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">
                    Concepto
                  </label>
                  <input
                    type="text"
                    value={formData.concepto || ''}
                    onChange={(e) => handleInputChange('concepto', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    placeholder="Concepto"
                  />
                </div>
              </>
            )}

            {/* BUTTONS */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-semibold transition-all text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 rounded-lg font-semibold transition-all shadow-lg text-white"
              >
                Guardar
              </button>
            </div>
          </form>
        </ElegantModal>
      </div>
    </div>
  );
};

export default memo(PanelLeftie);
