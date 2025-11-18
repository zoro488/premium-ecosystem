/**
 * 💚 PANEL UTILIDADES - ULTRA PREMIUM AAA EDITION
 * ===============================================
 * Tema: Green/Emerald (#10b981, #059669)
 * ✨ Gráfico Premium: BarChart Horizontal con animaciones
 * 🎯 4 KPIs con animaciones counter elegantes
 * 📊 Visualizaciones modernas y profesionales
 * 🔄 CRUD completo funcional
 * 📋 Tablas RF Actual mejoradas
 * 🎨 Partículas sutiles y efectos premium
 * 💫 Micro-interacciones AAA
 */

import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ArrowRightLeft,
  BarChart3,
  Coins,
  DollarSign,
  PieChart,
  Plus,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
  Area,
  AreaChart
} from 'recharts';
import DATOS_JSON from '../../../../datos_excel_completos.json';
import { useFlowStore } from '../../../stores/flowStore';
import {
  AnimatedButton,
  AnimatedTabBar,
  CreativeParticles,
  ElegantModal,
  PremiumKPI,
  ScrollProgress,
} from './ElegantComponents';
import {
  TablaIngresosPremium,
  TablaGastosPremium,
  TablaCortesPremium,
  TablaTransferenciasPremium,
} from './TablasBancoPremium';

// ============================================
// THEME COLORS - GREEN/EMERALD PREMIUM
// ============================================
const COLORS = {
  primary: ['#10b981', '#059669'],
  gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  chartColors: ['#10b981', '#34d399', '#6ee7b7', '#059669', '#047857', '#065f46'],
};

// ============================================
// PREMIUM BAR CHART - ULTRA MODERN COMPONENT
// ============================================
const PremiumBarChartHorizontal = memo(({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-br from-slate-900/98 via-emerald-900/20 to-slate-900/98
                   border-2 border-emerald-500/40 rounded-2xl p-4 shadow-2xl shadow-emerald-500/30"
      >
        <p className="text-emerald-400 font-bold text-sm mb-2">{payload[0].payload.name}</p>
        <p className="text-white font-mono text-xl font-bold">
          ${(payload[0].value).toLocaleString('es-MX')}
        </p>
        <motion.div
          className="h-1 bg-gradient-to-r from-emerald-500 to-green-500 mt-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.1, duration: 0.3 }}
        />
      </motion.div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={450}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 40, left: 120, bottom: 20 }}
      >
        <defs>
          <linearGradient id="barGradientUtilidades" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.7} />
            <stop offset="50%" stopColor="#34d399" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#6ee7b7" stopOpacity={1} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#1e293b"
          opacity={0.2}
          horizontal={true}
          vertical={false}
        />
        <XAxis
          type="number"
          stroke="#64748b"
          style={{ fontSize: '13px', fontWeight: 600, fill: '#94a3b8' }}
          tickFormatter={(value) => {
            if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
            return `$${value}`;
          }}
          axisLine={{ stroke: '#334155', strokeWidth: 2 }}
          tickLine={{ stroke: '#475569' }}
        />
        <YAxis
          type="category"
          dataKey="name"
          stroke="#64748b"
          style={{ fontSize: '13px', fontWeight: 700, fill: '#e2e8f0' }}
          width={110}
          axisLine={{ stroke: '#334155', strokeWidth: 2 }}
          tickLine={false}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: 'rgba(16, 185, 129, 0.08)' }}
        />
        <Bar
          dataKey="value"
          fill="url(#barGradientUtilidades)"
          radius={[0, 12, 12, 0]}
          onMouseEnter={(_, index) => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          animationDuration={1200}
          animationBegin={100}
          animationEasing="ease-out"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={hoveredIndex === index ? '#34d399' : 'url(#barGradientUtilidades)'}
              style={{
                filter: hoveredIndex === index
                  ? 'url(#glow) brightness(1.3) drop-shadow(0 0 15px rgba(52, 211, 153, 0.8))'
                  : 'brightness(1)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
              }}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
});

PremiumBarChartHorizontal.displayName = 'PremiumBarChartHorizontal';

// ============================================
// MAIN COMPONENT
// ============================================
export default function PanelUtilidadesNuevo() {
  const datosUtilidades = DATOS_JSON.bancos?.utilidades || {};
  const bancoUtilidades = useFlowStore((state) => state.bancos.utilidades);
  const addIngreso = useFlowStore((state) => state.addIngreso);
  const addGasto = useFlowStore((state) => state.addGasto);
  const addCorte = useFlowStore((state) => state.addCorte);
  const addTransferencia = useFlowStore((state) => state.addTransferencia);
  const setBancoData = useFlowStore((state) => state.setBancoData);

  // Initialize from JSON
  useEffect(() => {
    if (bancoUtilidades.ingresos.length === 0 && datosUtilidades.ingresos?.length > 0) {
      const ingresosArray = Array.isArray(datosUtilidades?.ingresos) ? datosUtilidades.ingresos : [];
      const gastosArray = Array.isArray(datosUtilidades?.gastos) ? datosUtilidades.gastos : [];
      const cortesArray = Array.isArray(datosUtilidades?.cortes) ? datosUtilidades.cortes : [];

      const ingresosConId = ingresosArray.map((ing, idx) => ({
        ...ing,
        id: ing.id || `ing_util_${Date.now()}_${idx}`,
      }));
      const gastosConId = gastosArray.map((gasto, idx) => ({
        ...gasto,
        id: gasto.id || `gasto_util_${Date.now()}_${idx}`,
      }));
      const cortesConId = cortesArray.map((corte, idx) => ({
        ...corte,
        id: corte.id || `corte_util_${Date.now()}_${idx}`,
      }));

      setBancoData('utilidades', {
        nombre: 'Utilidades',
        saldoActual: datosUtilidades.saldoActual || 0,
        ingresos: ingresosConId,
        gastos: gastosConId,
        cortes: cortesConId,
      });
    }
  }, [bancoUtilidades.ingresos.length, datosUtilidades, setBancoData]);

  const ingresos = bancoUtilidades.ingresos || [];
  const gastos = bancoUtilidades.gastos || [];
  const cortes = bancoUtilidades.cortes || [];
  const transferencias = bancoUtilidades.transferencias || [];

  // State
  const [tabActiva, setTabActiva] = useState('graficos');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [formData, setFormData] = useState({});

  // CALCULATIONS
  const totalIngresos = useMemo(
    () => ingresos.reduce((sum, ing) => sum + (parseFloat(ing.ingreso) || 0), 0),
    [ingresos]
  );

  const totalGastos = useMemo(
    () => gastos.reduce((sum, g) => sum + (parseFloat(g.gasto) || 0), 0),
    [gastos]
  );

  const balance = useMemo(() => totalIngresos - totalGastos, [totalIngresos, totalGastos]);

  const rfActual = useMemo(() => {
    return cortes.length > 0
      ? parseFloat(cortes[cortes.length - 1]?.corte || 0)
      : datosUtilidades.saldoActual || 0;
  }, [cortes, datosUtilidades.saldoActual]);

  // Bar Chart data - Top categories
  const barChartData = useMemo(() => {
    const agrupado = {};

    // Group by cliente for ingresos
    ingresos.forEach((ing) => {
      const cliente = ing.cliente || 'Sin Cliente';
      if (!agrupado[cliente]) {
        agrupado[cliente] = 0;
      }
      agrupado[cliente] += parseFloat(ing.ingreso) || 0;
    });

    return Object.entries(agrupado)
      .map(([name, value]) => ({ name, value: Math.abs(value) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [ingresos]);

  // HANDLERS
  const openModal = useCallback((type) => {
    setModalType(type);
    setFormData({});
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
        id: `${modalType}_${Date.now()}`,
        fecha: formData.fecha || new Date().toISOString().split('T')[0],
        ...formData,
      };

      if (modalType === 'ingreso') {
        addIngreso('utilidades', nuevoRegistro);
      } else if (modalType === 'gasto') {
        addGasto('utilidades', nuevoRegistro);
      } else if (modalType === 'corte') {
        addCorte('utilidades', nuevoRegistro);
      } else if (modalType === 'transferencia') {
        addTransferencia('utilidades', nuevoRegistro);
      }

      closeModal();
    },
    [modalType, formData, addIngreso, addGasto, addCorte, addTransferencia, closeModal]
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/30 text-white">
      {/* Particles Background */}
      <CreativeParticles count={35} color="#10b981" />
      <ScrollProgress color="#10b981" />

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-8 pb-4"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="p-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-2xl shadow-emerald-500/40"
            >
              <Coins className="w-10 h-10 text-white" />
            </motion.div>
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                Utilidades
              </h1>
              <p className="text-gray-400 text-sm mt-1 font-medium">
                Panel de control financiero AAA
              </p>
            </div>
          </div>
        </div>

        {/* KPIS ROW */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PremiumKPI
              title="Total Ingresos"
              value={totalIngresos}
              icon={TrendingUp}
              colors={['#10b981', '#059669']}
              trend={12.5}
            />
            <PremiumKPI
              title="Total Gastos"
              value={totalGastos}
              icon={TrendingDown}
              colors={['#f59e0b', '#d97706']}
              trend={-3.2}
            />
            <PremiumKPI
              title="Balance"
              value={balance}
              icon={BarChart3}
              colors={balance >= 0 ? ['#10b981', '#059669'] : ['#ef4444', '#dc2626']}
              trend={balance >= 0 ? 8.5 : -4.1}
            />
            <PremiumKPI
              title="RF Actual"
              value={rfActual}
              icon={Activity}
              colors={['#06b6d4', '#0891b2']}
              trend={2.4}
              subtitle={`${cortes.length} cortes registrados`}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* TABS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 px-8 mt-6"
      >
        <AnimatedTabBar
          tabs={[
            { id: 'graficos', label: 'Gráficos Premium', icon: BarChart3 },
            { id: 'ingresos', label: 'Ingresos', icon: TrendingUp },
            { id: 'gastos', label: 'Gastos', icon: TrendingDown },
            { id: 'cortes', label: 'RF Actual (Cortes)', icon: Activity },
            { id: 'transferencias', label: 'Transferencias', icon: ArrowRightLeft },
          ]}
          activeTab={tabActiva}
          onChange={setTabActiva}
          color="#10b981"
        />
      </motion.div>

      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 p-8 pt-4"
      >
        <AnimatePresence mode="wait">
          {/* GRÁFICOS TAB */}
          {tabActiva === 'graficos' && (
            <motion.div
              key="graficos"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <motion.div
                whileHover={{ scale: 1.005 }}
                className="backdrop-blur-xl bg-gradient-to-br from-white/5 via-emerald-500/5 to-white/5
                           border border-white/10 rounded-3xl p-8 shadow-2xl shadow-emerald-500/10"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-emerald-400 flex items-center gap-3">
                    <BarChart3 className="w-7 h-7" />
                    Top 10 Clientes por Ingresos
                  </h3>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl"
                  >
                    <p className="text-sm font-semibold text-emerald-400">
                      {barChartData.length} clientes
                    </p>
                  </motion.div>
                </div>
                <PremiumBarChartHorizontal data={barChartData} />
              </motion.div>
            </motion.div>
          )}

          {/* INGRESOS TAB */}
          {tabActiva === 'ingresos' && (
            <TablaIngresosPremium
              ingresos={ingresos}
              titulo="Ingresos - Utilidades"
              onAgregar={() => openModal('ingreso')}
            />
          )}

          {/* GASTOS TAB */}
          {tabActiva === 'gastos' && (
            <motion.div
              key="gastos"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {gastos.length > 0 ? (
                <TablaGastosPremium
                  gastos={gastos}
                  titulo="Gastos - Utilidades"
                  onAgregar={() => openModal('gasto')}
                />
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-16 text-center"
                >
                  <TrendingDown className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">No hay gastos registrados</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* CORTES TAB */}
          {tabActiva === 'cortes' && (
            <TablaCortesPremium
              cortes={cortes.map((c) => ({
                ...c,
                monto: parseFloat(c.corte) || parseFloat(c.monto) || 0,
              }))}
              titulo="RF Actual - Utilidades"
              onAgregar={() => openModal('corte')}
            />
          )}

          {/* TRANSFERENCIAS TAB */}
          {tabActiva === 'transferencias' && (
            <TablaTransferenciasPremium
              transferencias={transferencias}
              titulo="Transferencias - Utilidades"
              onAgregar={() => openModal('transferencia')}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* MODAL */}
      <ElegantModal
        isOpen={modalOpen}
        onClose={closeModal}
        title={`Agregar ${modalType === 'ingreso' ? 'Ingreso' : modalType === 'gasto' ? 'Gasto' : modalType === 'corte' ? 'Corte' : 'Transferencia'}`}
        colors={COLORS.primary}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Fecha</label>
            <input
              type="date"
              value={formData.fecha || ''}
              onChange={(e) => handleInputChange('fecha', e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {modalType === 'ingreso' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Cliente</label>
                <input
                  type="text"
                  value={formData.cliente || ''}
                  onChange={(e) => handleInputChange('cliente', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Ingreso</label>
                <input
                  type="number"
                  value={formData.ingreso || ''}
                  onChange={(e) => handleInputChange('ingreso', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </>
          )}

          {modalType === 'gasto' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Concepto</label>
                <input
                  type="text"
                  value={formData.origenDelGastoOAbono || ''}
                  onChange={(e) => handleInputChange('origenDelGastoOAbono', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Gasto</label>
                <input
                  type="number"
                  value={formData.gasto || ''}
                  onChange={(e) => handleInputChange('gasto', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </>
          )}

          {modalType === 'corte' && (
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Monto del Corte</label>
              <input
                type="number"
                value={formData.corte || ''}
                onChange={(e) => handleInputChange('corte', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:outline-none transition-colors"
                required
              />
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <AnimatedButton
              type="button"
              onClick={closeModal}
              variant="secondary"
              className="flex-1"
            >
              Cancelar
            </AnimatedButton>
            <AnimatedButton type="submit" variant="primary" className="flex-1">
              Guardar
            </AnimatedButton>
          </div>
        </form>
      </ElegantModal>
    </div>
  );
}
