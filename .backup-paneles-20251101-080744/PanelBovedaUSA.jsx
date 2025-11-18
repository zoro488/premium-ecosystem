/**
 * 🏦 PANEL BÓVEDA USA SUPER PREMIUM - ELEGANTE E INTERACTIVO
 * ==========================================================
 * ✨ Diseño elegante con tema Blue/Indigo
 * 💎 3 Tablas completas + Transferencias con TODAS las columnas
 * 🎨 Funnel Chart innovador único
 * 🚀 Micro-interacciones y animaciones fluidas
 * ⚡ Totalmente reactivo e interactivo
 */
import { useMemo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ArrowRightLeft,
  BarChart3,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Funnel,
  FunnelChart,
  LabelList,
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
import {
  TablaCortesPremium,
  TablaGastosPremium,
  TablaIngresosPremium,
  TablaTransferenciasPremium,
} from './TablasBancoPremium';

const COLORS = {
  primary: ['#3b82f6', '#6366f1'],
  gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
};

export default function PanelBovedaUSA() {
  const { bancos, addIngresoBanco, addGastoBanco, addCorteBanco, addTransferenciaBanco } =
    useFlowStore();
  const datosBovedaUSA = bancos.bovedaUsa || {};
  const ingresos = datosBovedaUSA.ingresos || [];
  const gastos = datosBovedaUSA.gastos || [];
  const cortes = datosBovedaUSA.cortes || [];
  const transferencias = datosBovedaUSA.transferencias || [];

  const [tabActiva, setTabActiva] = useState('ingresos');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [formData, setFormData] = useState({});

  // DATOS REALES desde JSON maestro
  const datosReales = useMemo(() => {
    const panelBovedaUSA = DATOS_BOVEDAS_COMPLETOS.paneles.find((p) => p.nombre === 'Bóveda USA');
    const rfActual =
      DATOS_BOVEDAS_COMPLETOS.controlMaestro.rfActual.paneles['Bóveda USA'] || 128005;

    return {
      rfActual: rfActual, // $128,005 USD
      ingresos: panelBovedaUSA?.ingresos?.registros || [],
      gastos: panelBovedaUSA?.gastos?.registros || [],
      cortes: panelBovedaUSA?.rfActual?.cortes || [],
      totalIngresos:
        panelBovedaUSA?.ingresos?.registros?.reduce((s, i) => s + (i.Ingreso || 0), 0) || 0,
      totalGastos: panelBovedaUSA?.gastos?.registros?.reduce((s, g) => s + (g.Gasto || 0), 0) || 0,
    };
  }, []);

  // KPIs
  const totalIngresos = useMemo(
    () =>
      datosReales.totalIngresos + ingresos.reduce((s, i) => s + (parseFloat(i.ingreso) || 0), 0),
    [ingresos, datosReales]
  );
  const totalGastos = useMemo(
    () => datosReales.totalGastos + gastos.reduce((s, g) => s + (parseFloat(g.gasto) || 0), 0),
    [gastos, datosReales]
  );
  const balance = useMemo(() => totalIngresos - totalGastos, [totalIngresos, totalGastos]);
  const rfActual = useMemo(() => datosReales.rfActual, [datosReales]);

  // Funnel Chart Data
  const chartDataFunnel = useMemo(
    () => [
      { name: 'Ingresos Totales', value: totalIngresos, fill: '#3b82f6' },
      { name: 'Menos Gastos', value: totalIngresos - totalGastos * 0.3, fill: '#6366f1' },
      { name: 'Balance Neto', value: balance > 0 ? balance : 0, fill: '#8b5cf6' },
      { name: 'RF Actual', value: rfActual, fill: '#a855f7' },
    ],
    [totalIngresos, totalGastos, balance, rfActual]
  );

  const chartDataTendencia = useMemo(() => {
    const grouped = {};
    [...ingresos, ...gastos].forEach((item) => {
      const fecha = item.fecha;
      if (!grouped[fecha]) grouped[fecha] = { fecha, ingresos: 0, gastos: 0 };
      if (item.ingreso) grouped[fecha].ingresos += parseFloat(item.ingreso) || 0;
      if (item.gasto) grouped[fecha].gastos += parseFloat(item.gasto) || 0;
    });
    return Object.values(grouped)
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
      .slice(-30);
  }, [ingresos, gastos]);

  const chartDataPie = useMemo(
    () => [
      { name: 'Ingresos', value: totalIngresos, color: '#10b981' },
      { name: 'Gastos', value: totalGastos, color: '#ef4444' },
    ],
    [totalIngresos, totalGastos]
  );

  const tabs = useMemo(
    () => [
      { id: 'ingresos', label: 'Ingresos', icon: TrendingUp },
      { id: 'gastos', label: 'Gastos', icon: TrendingDown },
      { id: 'cortes', label: 'Cortes RF', icon: Activity },
      { id: 'transferencias', label: 'Transferencias', icon: ArrowRightLeft },
      { id: 'graficos', label: 'Gráficos', icon: BarChart3 },
    ],
    []
  );

  const openModal = (type) => {
    setModalType(type);
    setFormData({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setFormData({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevoRegistro = {
      id: `${modalType}_${Date.now()}`,
      fecha: formData.fecha || new Date().toISOString().split('T')[0],
      ...formData,
    };

    if (modalType === 'ingreso') addIngresoBanco('bovedaUsa', nuevoRegistro);
    else if (modalType === 'gasto') addGastoBanco('bovedaUsa', nuevoRegistro);
    else if (modalType === 'corte') addCorteBanco('bovedaUsa', nuevoRegistro);
    else if (modalType === 'transferencia') addTransferenciaBanco('bovedaUsa', nuevoRegistro);

    closeModal();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white relative">
      <CreativeParticles count={30} colors={COLORS.primary} />
      <ScrollProgress color={COLORS.primary[0]} />

      <div className="relative z-10 p-8 max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-light text-white mb-1">Bóveda USA</h1>
          <p className="text-sm text-blue-300">Gestión financiera internacional</p>
        </motion.div>

        {/* KPIs */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PremiumKPI
            title="Total Ingresos"
            value={totalIngresos}
            icon={TrendingUp}
            colors={['#10b981', '#059669']}
            trend={5.2}
          />
          <PremiumKPI
            title="Total Gastos"
            value={totalGastos}
            icon={TrendingDown}
            colors={['#ef4444', '#dc2626']}
            trend={-2.1}
          />
          <PremiumKPI
            title="Balance"
            value={balance}
            icon={Wallet}
            colors={['#3b82f6', '#2563eb']}
            trend={8.3}
          />
          <PremiumKPI
            title="RF Actual"
            value={rfActual}
            icon={Activity}
            colors={['#8b5cf6', '#7c3aed']}
            trend={3.7}
          />
        </motion.div>

        {/* EXCHANGE RATE MONITOR - Monitor en tiempo real del TC USD/MXN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ExchangeRateMonitor
            showHistory={true}
            autoRefresh={true}
            refreshInterval={300000}
            className="mb-4"
          />
        </motion.div>

        {/* TABS */}
        <AnimatedTabBar
          tabs={tabs}
          activeTab={tabActiva}
          onChange={setTabActiva}
          accentColor={COLORS.primary[0]}
        />

        {/* CONTENIDO */}
        <AnimatePresence mode="wait">
          {/* TABLA INGRESOS */}
          {tabActiva === 'ingresos' && (
            <TablaIngresosPremium
              ingresos={ingresos.map((ing) => ({
                ...ing,
                monto: parseFloat(ing.ingreso) || parseFloat(ing.monto) || 0,
              }))}
              titulo="Ingresos Bóveda USA"
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
              titulo="Gastos Bóveda USA"
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
              titulo="RF Actual - Bóveda USA"
              onAgregar={() => openModal('corte')}
            />
          )}

          {/* TRANSFERENCIAS TAB */}
          {tabActiva === 'transferencias' && (
            <TablaTransferenciasPremium
              transferencias={transferencias}
              titulo="Transferencias - Bóveda USA"
              onAgregar={() => openModal('transferencia')}
            />
          )}

          {/* GRÁFICOS TAB */}
          {tabActiva === 'graficos' && (
            <motion.div
              key="graficos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-7 h-7 text-blue-400" />
                Análisis Visual - Bóveda USA
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Funnel Chart */}
                <div className="bg-slate-900/50 rounded-xl p-6 border border-blue-500/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Flujo de Fondos</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <FunnelChart>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '12px',
                          color: '#fff',
                        }}
                        formatter={(value) => `$${value.toLocaleString()}`}
                      />
                      <Funnel dataKey="value" data={chartDataFunnel} isAnimationActive>
                        <LabelList position="right" fill="#fff" stroke="none" dataKey="name" />
                      </Funnel>
                    </FunnelChart>
                  </ResponsiveContainer>
                </div>

                {/* Area Chart */}
                <div className="bg-slate-900/50 rounded-xl p-6 border border-blue-500/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Tendencia Mensual</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartDataTendencia}>
                      <defs>
                        <linearGradient id="colorIngresosUSA" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorGastosUSA" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="mes" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '12px',
                        }}
                        formatter={(value) => `$${value.toLocaleString()}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="ingresos"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorIngresosUSA)"
                      />
                      <Area
                        type="monotone"
                        dataKey="gastos"
                        stroke="#ef4444"
                        fillOpacity={1}
                        fill="url(#colorGastosUSA)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MODAL */}
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
            <label className="block text-sm font-medium mb-2 text-slate-300">Fecha</label>
            <input
              type="date"
              value={formData.fecha || new Date().toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {modalType === 'ingreso' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Cliente</label>
                <input
                  type="text"
                  value={formData.cliente || ''}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Nombre del cliente"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Ingreso (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.ingreso || ''}
                  onChange={(e) => setFormData({ ...formData, ingreso: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">TC</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.tc || ''}
                    onChange={(e) => setFormData({ ...formData, tc: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">
                    Pesos (MXN)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.pesos || ''}
                    onChange={(e) => setFormData({ ...formData, pesos: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Destino</label>
                <input
                  type="text"
                  value={formData.destino || ''}
                  onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Concepto</label>
                <input
                  type="text"
                  value={formData.concepto || ''}
                  onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Observaciones
                </label>
                <textarea
                  value={formData.observaciones || ''}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 min-h-[80px] transition-all"
                />
              </div>
            </>
          )}

          {modalType === 'gasto' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Origen del Gasto
                </label>
                <input
                  type="text"
                  value={formData.origenDelGastoOAbono || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, origenDelGastoOAbono: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Gasto (MXN)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.gasto || ''}
                  onChange={(e) => setFormData({ ...formData, gasto: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">TC</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.tc || ''}
                    onChange={(e) => setFormData({ ...formData, tc: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">
                    Dólares (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.dolares || ''}
                    onChange={(e) => setFormData({ ...formData, dolares: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Destino</label>
                <input
                  type="text"
                  value={formData.destino || ''}
                  onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Concepto</label>
                <input
                  type="text"
                  value={formData.concepto || ''}
                  onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Observaciones
                </label>
                <textarea
                  value={formData.observaciones || ''}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 min-h-[80px] transition-all"
                />
              </div>
            </>
          )}

          {modalType === 'corte' && (
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Corte RF (MXN)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.corte || ''}
                onChange={(e) => setFormData({ ...formData, corte: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                required
              />
            </div>
          )}

          {modalType === 'transferencia' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Origen</label>
                  <input
                    type="text"
                    value={formData.origen || 'Bóveda USA'}
                    onChange={(e) => setFormData({ ...formData, origen: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Destino</label>
                  <input
                    type="text"
                    value={formData.destino || ''}
                    onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Monto</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.monto || ''}
                  onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Concepto</label>
                <input
                  type="text"
                  value={formData.concepto || ''}
                  onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl font-semibold text-sm transition-all"
            >
              Cancelar
            </button>
            <AnimatedButton colors={COLORS.primary}>Guardar</AnimatedButton>
          </div>
        </form>
      </ElegantModal>
    </div>
  );
}
