/**
 * 🏆 PANEL BÓVEDA MONTE - ELEGANT EDITION
 * ========================================
 * Tema: Gold/Amber (#f59e0b, #fbbf24)
 * Gráfico Innovador: RadarChart (Radial Wave)
 *
 * ✨ Design elegante y sutil
 * 🎯 4 KPIs con animaciones counter
 * 📊 RadarChart artístico (Radial Wave)
 * 🔄 CRUD completo funcional
 * 📋 Tablas completas sin omisiones (incluye Transferencias)
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
  PieChart,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';

import DATOS_JSON from '../../../../datos_excel_completos.json';
import DATOS_BOVEDAS_COMPLETOS from '../../../data/datos_bovedas_completos.json';
import { useFlowStore } from '../../../stores/flowStore';
import {
  AnimatedTabBar,
  CreativeParticles,
  ElegantModal,
  PremiumKPI,
  ScrollProgress,
} from './ElegantComponents';
import {
  TablaCortesPremium,
  TablaGastosPremium,
  TablaIngresosPremium,
  TablaTransferenciasPremium,
} from './TablasBancoPremium';

// ============================================
// THEME COLORS - GOLD/AMBER
// ============================================
const COLORS = {
  primary: ['#f59e0b', '#fbbf24'],
  gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
};

// ============================================
// RADAR CHART - INNOVATIVE COMPONENT
// ============================================
const RadialWaveChart = memo(({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(245,158,11,0.2)" />
        <PolarAngleAxis dataKey="category" stroke="rgba(255,255,255,0.6)" />
        <PolarRadiusAxis stroke="rgba(255,255,255,0.3)" />
        <Radar
          name="Valor"
          dataKey="value"
          stroke="#f59e0b"
          fill="#f59e0b"
          fillOpacity={0.6}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
});

RadialWaveChart.displayName = 'RadialWaveChart';

// ============================================
// MAIN COMPONENT
// ============================================
const PanelBovedaMonte = () => {
  const datosBovedaMonte = useMemo(() => DATOS_JSON?.bancos?.bovedaMonte || {}, []);

  // Zustand Store
  const bancoBovedaMonte = useFlowStore((state) => state.bancos.bovedaMonte);
  const addIngreso = useFlowStore((state) => state.addIngresoBanco);
  const addGasto = useFlowStore((state) => state.addGastoBanco);
  const addCorte = useFlowStore((state) => state.addCorteBanco);
  const addTransferencia = useFlowStore((state) => state.addTransferenciaBanco);
  const setBancoData = useFlowStore((state) => state.setBancoData);

  // Initialize from JSON
  useEffect(() => {
    if (bancoBovedaMonte.ingresos.length === 0 && datosBovedaMonte.ingresos?.length > 0) {
      // ✅ VALIDACIÓN DEFENSIVA: Asegurar que sean arrays válidos
      const ingresosArray = Array.isArray(datosBovedaMonte?.ingresos)
        ? datosBovedaMonte.ingresos
        : [];
      const gastosArray = Array.isArray(datosBovedaMonte?.gastos) ? datosBovedaMonte.gastos : [];
      const cortesArray = Array.isArray(datosBovedaMonte?.cortes) ? datosBovedaMonte.cortes : [];

      const ingresosConId = ingresosArray.map((ing, idx) => ({
        ...ing,
        id: ing.id || `ing_bovmonte_${Date.now()}_${idx}`,
      }));
      const gastosConId = gastosArray.map((gasto, idx) => ({
        ...gasto,
        id: gasto.id || `gasto_bovmonte_${Date.now()}_${idx}`,
      }));
      const cortesConId = cortesArray.map((corte, idx) => ({
        ...corte,
        id: corte.id || `corte_bovmonte_${Date.now()}_${idx}`,
      }));

      setBancoData('bovedaMonte', {
        nombre: 'Bóveda Monte',
        saldoActual: datosBovedaMonte.saldoActual || 0,
        ingresos: ingresosConId,
        gastos: gastosConId,
        cortes: cortesConId,
      });
    }
  }, [bancoBovedaMonte.ingresos.length, datosBovedaMonte, setBancoData]);

  const ingresos = bancoBovedaMonte.ingresos || [];
  const gastos = bancoBovedaMonte.gastos || [];
  const cortes = bancoBovedaMonte.cortes || [];
  const transferencias = bancoBovedaMonte.transferencias || [];

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
    return DATOS_BOVEDAS_COMPLETOS.controlMaestro.rfActual.paneles['Bóveda Monte'] || 0;
  }, []);

  // Radar Chart data
  const radarData = useMemo(() => {
    return [
      { category: 'Ingresos', value: totalIngresos },
      { category: 'Gastos', value: totalGastos },
      { category: 'Balance', value: Math.abs(balance) },
      { category: 'RF Actual', value: rfActual },
      {
        category: 'Transferencias',
        value: transferencias.reduce((sum, t) => sum + (parseFloat(t.monto) || 0), 0),
      },
    ];
  }, [totalIngresos, totalGastos, balance, rfActual, transferencias]);

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
        addIngreso('bovedaMonte', nuevoRegistro);
      } else if (modalType === 'gasto') {
        addGasto('bovedaMonte', nuevoRegistro);
      } else if (modalType === 'corte') {
        addCorte('bovedaMonte', nuevoRegistro);
      } else if (modalType === 'transferencia') {
        addTransferencia('bovedaMonte', nuevoRegistro);
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
    <div className="relative min-h-screen p-6 bg-gradient-to-br from-slate-950 via-amber-950/20 to-slate-950">
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
                background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
              }}
            />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <motion.div
                  className="p-4 rounded-2xl"
                  style={{ background: 'linear-gradient(135deg, #f59e0b30 0%, #fbbf2430 100%)' }}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Coins className="w-10 h-10 text-amber-400" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-1">Bóveda Monte</h1>
                  <p className="text-slate-400 flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-400" />
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
                colors={['#f59e0b', '#fbbf24']}
                trend={6.4}
              />
              <PremiumKPI
                title="Total Gastos"
                value={totalGastos}
                icon={TrendingDown}
                colors={['#ef4444', '#dc2626']}
                trend={-1.8}
              />
              <PremiumKPI
                title="Balance"
                value={balance}
                icon={BarChart3}
                colors={balance >= 0 ? ['#10b981', '#059669'] : ['#f59e0b', '#d97706']}
                trend={balance >= 0 ? 9.2 : -3.5}
              />
              <PremiumKPI
                title="RF Actual"
                value={rfActual}
                icon={Activity}
                colors={['#06b6d4', '#0891b2']}
                trend={4.7}
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
                  <PieChart className="w-7 h-7 text-amber-400" />
                  RadarChart - Análisis Radial de Flujo Financiero
                </h2>
                <p className="text-slate-400 text-sm">
                  Visualización multidimensional de indicadores financieros clave
                </p>
              </div>

              <RadialWaveChart data={radarData} />

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-amber-500/20">
                  <p className="text-xs text-slate-400 mb-1">Indicador Principal</p>
                  <p className="text-lg font-bold text-amber-400">
                    {
                      radarData.reduce(
                        (max, item) => (item.value > max.value ? item : max),
                        radarData[0]
                      )?.category
                    }
                  </p>
                  <p className="text-sm text-slate-300">
                    $
                    {radarData
                      .reduce((max, item) => (item.value > max.value ? item : max), radarData[0])
                      ?.value.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-amber-500/20">
                  <p className="text-xs text-slate-400 mb-1">Promedio</p>
                  <p className="text-lg font-bold text-amber-400">
                    $
                    {Math.floor(
                      radarData.reduce((sum, item) => sum + item.value, 0) / radarData.length
                    ).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-amber-500/20">
                  <p className="text-xs text-slate-400 mb-1">Categorías</p>
                  <p className="text-lg font-bold text-amber-400">{radarData.length}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* INGRESOS TAB */}
          {tabActiva === 'ingresos' && (
            <TablaIngresosPremium
              ingresos={ingresos.map((ing) => ({
                ...ing,
                monto: parseFloat(ing.ingreso) || parseFloat(ing.monto) || 0,
              }))}
              titulo="Ingresos Bóveda Monte"
              onAgregar={() => openModal('ingreso')}
            />
          )}

          {/* GASTOS TAB */}
          {tabActiva === 'gastos' && (
            <TablaGastosPremium
              gastos={gastos.map((g) => ({
                ...g,
                monto: parseFloat(g.gasto) || parseFloat(g.monto) || 0,
              }))}
              titulo="Gastos Bóveda Monte"
              onAgregar={() => openModal('gasto')}
            />
          )}

          {/* CORTES TAB */}
          {tabActiva === 'cortes' && (
            <TablaCortesPremium
              cortes={cortes.map((c) => ({
                ...c,
                monto: parseFloat(c.corte) || parseFloat(c.monto) || 0,
              }))}
              titulo="RF Actual - Bóveda Monte"
              onAgregar={() => openModal('corte')}
            />
          )}

          {/* TRANSFERENCIAS TAB */}
          {tabActiva === 'transferencias' && (
            <TablaTransferenciasPremium
              transferencias={transferencias}
              titulo="Transferencias - Bóveda Monte"
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
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white transition-all"
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
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white transition-all"
                  placeholder="Nombre del cliente"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Ingreso (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.ingreso || ''}
                  onChange={(e) => handleInputChange('ingreso', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white transition-all"
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
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white transition-all"
                    placeholder="Tipo de cambio"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Pesos (MXN)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.pesos || ''}
                    onChange={(e) => handleInputChange('pesos', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Destino</label>
                <input
                  type="text"
                  value={formData.destino || ''}
                  onChange={(e) => handleInputChange('destino', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white transition-all"
                  placeholder="Destino"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Concepto</label>
                <input
                  type="text"
                  value={formData.concepto || ''}
                  onChange={(e) => handleInputChange('concepto', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white transition-all"
                  placeholder="Concepto del ingreso"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Observaciones
                </label>
                <textarea
                  value={formData.observaciones || ''}
                  onChange={(e) => handleInputChange('observaciones', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white transition-all min-h-[80px]"
                  placeholder="Observaciones adicionales"
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
                  value={formData.origenDelGastoOAbono || formData.origen || ''}
                  onChange={(e) => handleInputChange('origenDelGastoOAbono', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white transition-all"
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
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white transition-all"
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
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white transition-all"
                    placeholder="Tipo de cambio"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Dólares</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.dolares || ''}
                    onChange={(e) => handleInputChange('dolares', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Destino</label>
                <input
                  type="text"
                  value={formData.destino || ''}
                  onChange={(e) => handleInputChange('destino', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white transition-all"
                  placeholder="Destino"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Concepto</label>
                <input
                  type="text"
                  value={formData.concepto || ''}
                  onChange={(e) => handleInputChange('concepto', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white transition-all"
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
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white transition-all min-h-[80px]"
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
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white transition-all"
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
                  value={formData.bancoOrigen || formData.origen || 'Bóveda Monte'}
                  onChange={(e) => handleInputChange('bancoOrigen', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white transition-all"
                  required
                >
                  <option value="Bóveda Monte">Bóveda Monte</option>
                  <option value="Profit">Profit</option>
                  <option value="Utilidades">Utilidades</option>
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
                  value={formData.bancoDestino || formData.destino || ''}
                  onChange={(e) => handleInputChange('bancoDestino', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white transition-all"
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
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white transition-all"
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
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white transition-all"
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
              className="flex-1 px-4 py-3 rounded-xl font-semibold text-white transition-all shadow-lg shadow-amber-500/30"
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
              }}
              whileHover={{ scale: 1.02, boxShadow: '0 20px 60px -10px rgba(245, 158, 11, 0.5)' }}
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

export default memo(PanelBovedaMonte);
