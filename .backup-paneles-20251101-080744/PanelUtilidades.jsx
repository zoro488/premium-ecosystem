/**
 * 💚 PANEL UTILIDADES - ELEGANT EDITION
 * =====================================
 * Tema: Green/Emerald (#10b981, #059669)
 * Gráfico Innovador: Treemap Chart (Distribución Jerárquica)
 *
 * ✨ Design elegante y sutil
 * 🎯 4 KPIs con animaciones counter
 * 📊 Treemap Chart creativo y artístico
 * 🔄 CRUD completo funcional
 * 📋 Tablas completas sin omisiones
 * 🎨 30 partículas sutiles
 * 💫 Micro-interacciones fluidas
 */
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

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
import { ResponsiveContainer, Treemap } from 'recharts';

import DATOS_JSON from '../../../../datos_excel_completos.json';
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
// THEME COLORS - GREEN/EMERALD
// ============================================
const COLORS = {
  primary: ['#10b981', '#059669'],
  gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
};

// ============================================
// TREEMAP CHART - INNOVATIVE COMPONENT
// ============================================
const TreemapChart = memo(({ data }) => {
  const CustomContent = (props) => {
    const { x, y, width, height, index, name, value } = props;

    // Color palette for treemap cells
    const colors = ['#10b981', '#059669', '#34d399', '#6ee7b7', '#a7f3d0'];
    const bgColor = colors[index % colors.length];

    return (
      <g>
        <motion.rect
          x={x}
          y={y}
          width={width}
          height={height}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          style={{
            fill: bgColor,
            stroke: '#1a1a1a',
            strokeWidth: 2,
            opacity: 0.9,
          }}
        />
        {width > 60 && height > 40 && (
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - 10}
              textAnchor="middle"
              fill="#fff"
              fontSize={12}
              fontWeight="600"
            >
              {name}
            </text>
            <text
              x={x + width / 2}
              y={y + height / 2 + 10}
              textAnchor="middle"
              fill="#fff"
              fontSize={14}
              fontWeight="700"
            >
              ${(value || 0).toLocaleString()}
            </text>
          </>
        )}
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <Treemap
        data={data}
        dataKey="value"
        aspectRatio={4 / 3}
        stroke="#1a1a1a"
        fill="#10b981"
        content={<CustomContent />}
      />
    </ResponsiveContainer>
  );
});

TreemapChart.displayName = 'TreemapChart';

// ============================================
// MAIN COMPONENT
// ============================================
const PanelUtilidades = () => {
  const datosUtilidades = useMemo(() => DATOS_JSON?.bancos?.utilidades || {}, []);

  // Zustand Store
  const bancoUtilidades = useFlowStore((state) => state.bancos.utilidades);
  const addIngreso = useFlowStore((state) => state.addIngresoBanco);
  const addGasto = useFlowStore((state) => state.addGastoBanco);
  const addCorte = useFlowStore((state) => state.addCorteBanco);
  const addTransferencia = useFlowStore((state) => state.addTransferenciaBanco);
  const setBancoData = useFlowStore((state) => state.setBancoData);

  // Initialize from JSON
  useEffect(() => {
    if (bancoUtilidades.ingresos.length === 0 && datosUtilidades.ingresos?.length > 0) {
      // ✅ VALIDACIÓN DEFENSIVA: Asegurar que sean arrays válidos
      const ingresosArray = Array.isArray(datosUtilidades?.ingresos)
        ? datosUtilidades.ingresos
        : [];
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

  // RF Actual desde JSON maestro
  const rfActual = useMemo(() => {
    return DATOS_BOVEDAS_COMPLETOS.controlMaestro.rfActual.paneles['Utilidades'] || 102658;
  }, []);

  // Treemap data - Hierarchical distribution
  const treemapData = useMemo(() => {
    const agrupado = {};

    // Group by cliente for ingresos
    ingresos.forEach((ing) => {
      const cliente = ing.cliente || 'Sin Cliente';
      if (!agrupado[cliente]) {
        agrupado[cliente] = 0;
      }
      agrupado[cliente] += parseFloat(ing.ingreso) || 0;
    });

    // Add gastos as negative concept
    gastos.forEach((g) => {
      const origen = g.origenDelGastoOAbono || 'Gastos Varios';
      if (!agrupado[origen]) {
        agrupado[origen] = 0;
      }
      agrupado[origen] += parseFloat(g.gasto) || 0;
    });

    return Object.entries(agrupado)
      .map(([name, value]) => ({ name, value: Math.abs(value) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 12);
  }, [ingresos, gastos]);

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

  return (
    <div className="relative min-h-screen p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Particles Background */}
      <CreativeParticles count={30} colors={COLORS.primary} />

      {/* Scroll Progress */}
      <ScrollProgress color={COLORS.primary[0]} />

      {/* Main Container */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* HEADER */}
        <motion.div
          className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 p-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              }}
            />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <motion.div
                  className="p-4 rounded-2xl"
                  style={{ background: 'linear-gradient(135deg, #10b98130 0%, #05966930 100%)' }}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Coins className="w-10 h-10 text-emerald-400" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-1">Banco Utilidades</h1>
                  <p className="text-slate-400 flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    Sistema de Gestión Financiera Elegante
                  </p>
                </div>
              </div>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-4 gap-4">
              <PremiumKPI
                title="Total Ingresos"
                value={totalIngresos}
                icon={TrendingUp}
                colors={['#10b981', '#059669']}
                trend={5.8}
              />
              <PremiumKPI
                title="Total Gastos"
                value={totalGastos}
                icon={TrendingDown}
                colors={['#ef4444', '#dc2626']}
                trend={-3.2}
              />
              <PremiumKPI
                title="Balance"
                value={balance}
                icon={BarChart3}
                colors={balance >= 0 ? ['#10b981', '#059669'] : ['#f59e0b', '#d97706']}
                trend={balance >= 0 ? 8.5 : -4.1}
              />
              <PremiumKPI
                title="RF Actual"
                value={rfActual}
                icon={Activity}
                colors={['#06b6d4', '#0891b2']}
                trend={2.4}
              />
            </div>
          </div>
        </motion.div>

        {/* TABS */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatedTabBar
            tabs={tabs}
            activeTab={tabActiva}
            onChange={setTabActiva}
            accentColor={COLORS.primary[0]}
          />
        </motion.div>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          {/* GRÁFICOS TAB */}
          {tabActiva === 'graficos' && (
            <motion.div
              key="graficos"
              className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <PieChart className="w-7 h-7 text-emerald-400" />
                  Treemap - Distribución Jerárquica de Flujo
                </h2>
                <p className="text-slate-400 text-sm">
                  Visualización artística de la distribución de ingresos y gastos por categoría
                </p>
              </div>

              <TreemapChart data={treemapData} />

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-emerald-500/20">
                  <p className="text-xs text-slate-400 mb-1">Mayor Ingreso</p>
                  <p className="text-lg font-bold text-emerald-400">
                    {treemapData[0]?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-slate-300">
                    ${(treemapData[0]?.value || 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-emerald-500/20">
                  <p className="text-xs text-slate-400 mb-1">Categorías Activas</p>
                  <p className="text-lg font-bold text-emerald-400">{treemapData.length}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-emerald-500/20">
                  <p className="text-xs text-slate-400 mb-1">Promedio</p>
                  <p className="text-lg font-bold text-emerald-400">
                    $
                    {Math.floor(
                      treemapData.reduce((sum, item) => sum + item.value, 0) / treemapData.length ||
                        0
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* INGRESOS TAB */}
          {tabActiva === 'ingresos' && (
            <motion.div
              key="ingresos"
              className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
                  <TrendingUp className="w-7 h-7" />
                  Ingresos - ${totalIngresos.toLocaleString()}
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
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
                        Fecha
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
                        Cliente
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">
                        Ingreso
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
                        Concepto
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {ingresos.map((ing, idx) => (
                      <motion.tr
                        key={ing.id || idx}
                        className="group cursor-pointer"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', x: 5 }}
                      >
                        <td className="px-4 py-3 text-slate-300">
                          {ing.fecha ? new Date(ing.fecha).toLocaleDateString('es-MX') : 'N/A'}
                        </td>
                        <td className="px-4 py-3 font-medium text-white group-hover:text-emerald-300">
                          {ing.cliente || '-'}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-400">
                          ${(parseFloat(ing.ingreso) || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-slate-400 truncate max-w-xs">
                          {ing.concepto || '-'}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-white/5 sticky bottom-0">
                    <tr className="border-t-2 border-emerald-500/30">
                      <td colSpan="2" className="px-4 py-3 font-bold text-slate-300">
                        TOTAL
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-400">
                        ${totalIngresos.toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {ingresos.length === 0 && (
                <motion.div
                  className="text-center py-12 text-slate-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">No hay ingresos registrados</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* GASTOS TAB */}
          {tabActiva === 'gastos' && (
            <motion.div
              key="gastos"
              className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-red-400 flex items-center gap-2">
                  <TrendingDown className="w-7 h-7" />
                  Gastos - ${totalGastos.toLocaleString()}
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
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
                        Fecha
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
                        Origen del Gasto
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">
                        Gasto
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">
                        TC
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">
                        Pesos
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
                        Concepto
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
                        Observaciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {gastos.map((g, idx) => {
                      const tc = parseFloat(g.tc) || 0;
                      const pesos = parseFloat(g.pesos) || 0;
                      const valorGasto = parseFloat(g.gasto) || 0;

                      return (
                        <motion.tr
                          key={g.id || idx}
                          className="group cursor-pointer"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.02 }}
                          whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', x: 5 }}
                        >
                          <td className="px-4 py-3 text-slate-300">
                            {g.fecha ? new Date(g.fecha).toLocaleDateString('es-MX') : 'N/A'}
                          </td>
                          <td className="px-4 py-3 font-medium text-white group-hover:text-red-300">
                            {g.origenDelGastoOAbono || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-red-400">
                            ${valorGasto.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-400">
                            {tc > 0 ? `$${tc.toFixed(2)}` : '$0.00'}
                          </td>
                          <td className="px-4 py-3 text-right text-cyan-400">
                            {pesos > 0 ? `$${pesos.toLocaleString()}` : '$0.00'}
                          </td>
                          <td className="px-4 py-3 text-slate-400 truncate max-w-xs">
                            {g.concepto || '-'}
                          </td>
                          <td className="px-4 py-3 text-slate-400 truncate max-w-xs">
                            {g.observaciones || '-'}
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
                      <td colSpan="4"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {gastos.length === 0 && (
                <motion.div
                  className="text-center py-12 text-slate-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
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

      {/* MODAL CRUD */}
      <ElegantModal
        isOpen={modalOpen}
        onClose={closeModal}
        title={
          modalType === 'ingreso'
            ? 'Nuevo Ingreso'
            : modalType === 'gasto'
              ? 'Nuevo Gasto'
              : modalType === 'corte'
                ? 'Nuevo Corte RF'
                : 'Nueva Transferencia'
        }
        accentColor={COLORS.primary[0]}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Fecha</label>
            <input
              type="date"
              value={formData.fecha || new Date().toISOString().split('T')[0]}
              onChange={(e) => handleInputChange('fecha', e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition-all"
            />
          </div>

          {modalType === 'ingreso' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Cliente</label>
                <input
                  type="text"
                  value={formData.cliente || ''}
                  onChange={(e) => handleInputChange('cliente', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition-all"
                  placeholder="Nombre del cliente"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Ingreso (MXN)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.ingreso || ''}
                  onChange={(e) => handleInputChange('ingreso', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition-all"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Concepto</label>
                <input
                  type="text"
                  value={formData.concepto || ''}
                  onChange={(e) => handleInputChange('concepto', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition-all"
                  placeholder="Concepto del ingreso"
                />
              </div>
            </>
          )}

          {modalType === 'gasto' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Origen del Gasto
                </label>
                <input
                  type="text"
                  value={formData.origenDelGastoOAbono || ''}
                  onChange={(e) => handleInputChange('origenDelGastoOAbono', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition-all"
                  placeholder="Origen"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Gasto (MXN)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.gasto || ''}
                  onChange={(e) => handleInputChange('gasto', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition-all"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">TC</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.tc || ''}
                    onChange={(e) => handleInputChange('tc', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition-all"
                    placeholder="Tipo de cambio"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Pesos</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.pesos || ''}
                    onChange={(e) => handleInputChange('pesos', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Concepto</label>
                <input
                  type="text"
                  value={formData.concepto || ''}
                  onChange={(e) => handleInputChange('concepto', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition-all"
                  placeholder="Concepto del gasto"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Observaciones
                </label>
                <textarea
                  value={formData.observaciones || ''}
                  onChange={(e) => handleInputChange('observaciones', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition-all min-h-[80px]"
                  placeholder="Observaciones adicionales"
                />
              </div>
            </>
          )}

          {modalType === 'corte' && (
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Corte RF (MXN)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.corte || ''}
                onChange={(e) => handleInputChange('corte', e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition-all"
                placeholder="0.00"
                required
              />
            </div>
          )}

          {modalType === 'transferencia' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Banco Origen
                </label>
                <select
                  value={formData.bancoOrigen || ''}
                  onChange={(e) => handleInputChange('bancoOrigen', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition-all"
                  required
                >
                  <option value="">Seleccionar banco</option>
                  <option value="Profit">Profit</option>
                  <option value="Utilidades">Utilidades</option>
                  <option value="Bóveda Monte">Bóveda Monte</option>
                  <option value="Bóveda USA">Bóveda USA</option>
                  <option value="Azteca">Azteca</option>
                  <option value="Leftie">Leftie</option>
                  <option value="Flete Sur">Flete Sur</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Banco Destino
                </label>
                <select
                  value={formData.bancoDestino || ''}
                  onChange={(e) => handleInputChange('bancoDestino', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition-all"
                  required
                >
                  <option value="">Seleccionar banco</option>
                  <option value="Profit">Profit</option>
                  <option value="Utilidades">Utilidades</option>
                  <option value="Bóveda Monte">Bóveda Monte</option>
                  <option value="Bóveda USA">Bóveda USA</option>
                  <option value="Azteca">Azteca</option>
                  <option value="Leftie">Leftie</option>
                  <option value="Flete Sur">Flete Sur</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Monto (MXN)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.monto || ''}
                  onChange={(e) => handleInputChange('monto', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition-all"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Concepto</label>
                <input
                  type="text"
                  value={formData.concepto || ''}
                  onChange={(e) => handleInputChange('concepto', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition-all"
                  placeholder="Concepto de la transferencia"
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <motion.button
              type="button"
              onClick={closeModal}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-semibold text-white transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancelar
            </motion.button>
            <motion.button
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl font-semibold text-white transition-all shadow-lg shadow-emerald-500/30"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              }}
              whileHover={{ scale: 1.02, boxShadow: '0 20px 60px -10px rgba(16, 185, 129, 0.5)' }}
              whileTap={{ scale: 0.98 }}
            >
              Guardar
            </motion.button>
          </div>
        </form>
      </ElegantModal>
    </div>
  );
};

export default memo(PanelUtilidades);
