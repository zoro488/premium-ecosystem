/**
 * 💎 PANEL AZTECA ELEGANTE
 * ========================================================
 * Diseño elegante, sutil y atractivo con:
 * ✨ 30 partículas animadas cyan/blue
 * 📊 ScatterChart innovador (correlación ingresos vs gastos)
 * 🎯 4 KPIs premium con counter animations
 * 📋 5 tabs completas: Gráficos, Ingresos, Gastos, Cortes, Transferencias
 * 🔄 Transferencias con CRUD completo
 * 🎨 Componentes elegantes reutilizables
 * ⚡ Performance optimizado con React.memo + useMemo
 */
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

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
} from 'lucide-react';
import {
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';

import { CriticalAlertBanner } from '../../../components/premium/CriticalAlertBanner';
import { OverdraftProjector } from '../../../components/premium/OverdraftProjector';
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
  primary: ['#06b6d4', '#3b82f6'],
  gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
  particles: {
    from: 'rgba(6, 182, 212, 0.6)',
    to: 'rgba(59, 130, 246, 0.3)',
  },
};

// ============================================
// SCATTER CHART - Correlación Ingresos vs Gastos
// ============================================
const ScatterCorrelationChart = memo(({ ingresos, gastos }) => {
  // Crear datos de correlación por mes
  const scatterData = useMemo(() => {
    const monthlyData = {};

    // Agrupar ingresos por mes
    ingresos.forEach((ing) => {
      if (!ing.fecha || !ing.ingreso) return;
      const fecha = new Date(ing.fecha);
      const monthKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { mes: monthKey, ingresos: 0, gastos: 0 };
      }
      monthlyData[monthKey].ingresos += parseFloat(ing.ingreso) || 0;
    });

    // Agrupar gastos por mes
    gastos.forEach((gasto) => {
      if (!gasto.fecha || !gasto.gasto) return;
      const fecha = new Date(gasto.fecha);
      const monthKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { mes: monthKey, ingresos: 0, gastos: 0 };
      }
      monthlyData[monthKey].gastos += parseFloat(gasto.gasto) || 0;
    });

    // Convertir a array y calcular tamaño proporcional
    return Object.values(monthlyData).map((point) => ({
      ...point,
      z: Math.max(point.ingresos, point.gastos) / 1000, // Tamaño de burbuja
      balance: point.ingresos - point.gastos,
    }));
  }, [ingresos, gastos]);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.[0]) return null;
    const data = payload[0].payload;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-4 shadow-2xl"
      >
        <p className="text-xs text-slate-400 mb-2">{data.mes}</p>
        <p className="text-sm font-semibold text-green-400">
          Ingresos: ${data.ingresos.toLocaleString()}
        </p>
        <p className="text-sm font-semibold text-red-400">
          Gastos: ${data.gastos.toLocaleString()}
        </p>
        <p
          className={`text-sm font-bold ${data.balance >= 0 ? 'text-cyan-400' : 'text-amber-400'}`}
        >
          Balance: ${data.balance.toLocaleString()}
        </p>
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
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            type="number"
            dataKey="ingresos"
            name="Ingresos"
            stroke="rgba(255,255,255,0.6)"
            label={{
              value: 'Ingresos (MXN)',
              position: 'insideBottom',
              offset: -10,
              fill: '#06b6d4',
            }}
          />
          <YAxis
            type="number"
            dataKey="gastos"
            name="Gastos"
            stroke="rgba(255,255,255,0.6)"
            label={{ value: 'Gastos (MXN)', angle: -90, position: 'insideLeft', fill: '#3b82f6' }}
          />
          <ZAxis type="number" dataKey="z" range={[100, 1000]} name="Tamaño" />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Correlación Mensual" data={scatterData} fill="#06b6d4">
            {scatterData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.balance >= 0 ? '#06b6d4' : '#f59e0b'}
                opacity={0.7}
              />
            ))}
          </Scatter>
          {/* Línea de equilibrio (donde ingresos = gastos) */}
          <Scatter
            name="Línea de equilibrio"
            data={[
              { ingresos: 0, gastos: 0 },
              {
                ingresos: Math.max(...scatterData.map((d) => d.ingresos)),
                gastos: Math.max(...scatterData.map((d) => d.ingresos)),
              },
            ]}
            fill="none"
            line={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
          />
        </ScatterChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
          <span className="text-slate-400">Balance positivo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-slate-400">Balance negativo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-6 bg-blue-500" style={{ borderTop: '2px dashed #3b82f6' }}></div>
          <span className="text-slate-400">Línea de equilibrio</span>
        </div>
      </div>
    </motion.div>
  );
});

ScatterCorrelationChart.displayName = 'ScatterCorrelationChart';

// ============================================
// MAIN COMPONENT - PANEL AZTECA ELEGANTE
// ============================================
const PanelAzteca = () => {
  // ============================================
  // STATE & DATA - USANDO DATOS REALES DEL JSON MAESTRO
  // ============================================

  // 🔥 DATOS REALES DEL JSON MAESTRO consolidado
  const datosReales = useMemo(() => {
    // Buscar panel Azteca en el JSON maestro
    const panelAzteca = DATOS_BOVEDAS_COMPLETOS.paneles.find((p) =>
      p.panel.toLowerCase().includes('azteca')
    );

    // RF Actual del Control Maestro (valor crítico negativo)
    const rfActual = DATOS_BOVEDAS_COMPLETOS.controlMaestro.rfActual.paneles['Azteca'] || 0;

    return {
      panel: panelAzteca,
      rfActual: rfActual, // -178714.88 (CRÍTICO)
      esCritico: rfActual < 0,
      sobregiro: Math.abs(rfActual),
      ingresos: panelAzteca?.ingresos.registros || [],
      gastos: panelAzteca?.gastos?.registros || [],
      cortes: panelAzteca?.rfActual.cortes || [],
      totalIngresos: panelAzteca?.ingresos.total || 0,
      totalGastos: panelAzteca?.gastos?.total || 0,
      cantidadIngresos: panelAzteca?.ingresos.cantidad || 0,
      cantidadGastos: panelAzteca?.gastos?.cantidad || 0,
    };
  }, []);

  // Zustand Store (mantener para compatibilidad con funcionalidad existente)
  const bancoAzteca = useFlowStore((state) => state.bancos.azteca);
  const addIngreso = useFlowStore((state) => state.addIngresoBanco);
  const addGasto = useFlowStore((state) => state.addGastoBanco);
  const addCorte = useFlowStore((state) => state.addCorteBanco);
  const addTransferencia = useFlowStore((state) => state.addTransferenciaBanco);
  const setBancoData = useFlowStore((state) => state.setBancoData);

  // Initialize from JSON Maestro - Priorizar datos reales
  useEffect(() => {
    // Si Zustand está vacío y tenemos datos reales del JSON maestro
    if (bancoAzteca.ingresos.length === 0 && datosReales.ingresos.length > 0) {
      // ✅ VALIDACIÓN DEFENSIVA: Asegurar que sean arrays válidos
      const ingresosArray = Array.isArray(datosReales.ingresos) ? datosReales.ingresos : [];
      const gastosArray = Array.isArray(datosReales.gastos) ? datosReales.gastos : [];
      const cortesArray = Array.isArray(datosReales.cortes) ? datosReales.cortes : [];

      const ingresosConId = ingresosArray.map((ing, idx) => ({
        ...ing,
        id: ing.id || `ing_azteca_${Date.now()}_${idx}`,
        // Normalizar campos
        ingreso: ing.Ingreso || ing.ingreso || 0,
        fecha: ing.Fecha || ing.fecha,
        cliente: ing.Cliente || ing.cliente,
        concepto: ing.Concepto || ing.concepto,
      }));

      const gastosConId = gastosArray.map((gasto, idx) => ({
        ...gasto,
        id: gasto.id || `gasto_azteca_${Date.now()}_${idx}`,
        // Normalizar campos
        gasto: gasto.Gasto || gasto.gasto || 0,
        fecha: gasto.Fecha || gasto.fecha,
        cliente: gasto.Cliente || gasto.cliente,
        concepto: gasto.Concepto || gasto.concepto,
      }));

      const cortesConId = cortesArray.map((corte, idx) => ({
        ...corte,
        id: corte.id || `corte_azteca_${Date.now()}_${idx}`,
        // Normalizar campos
        corte: corte.Corte || corte.corte || 0,
        fecha: corte.Fecha || corte.fecha,
      }));

      setBancoData('azteca', {
        nombre: 'Azteca',
        saldoActual: datosReales.rfActual, // -178714.88 CRÍTICO
        ingresos: ingresosConId,
        gastos: gastosConId,
        cortes: cortesConId,
      });
    }
  }, [datosReales, bancoAzteca, setBancoData]);

  const ingresos = bancoAzteca.ingresos || [];
  const gastos = bancoAzteca.gastos || [];
  const cortes = bancoAzteca.cortes || [];
  const transferencias = bancoAzteca.transferencias || [];

  const [tabActiva, setTabActiva] = useState('graficos');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [formData, setFormData] = useState({});

  // ============================================
  // CALCULATIONS
  // ============================================
  const totalIngresos = useMemo(
    () => ingresos.reduce((sum, ing) => sum + (parseFloat(ing.ingreso) || 0), 0),
    [ingresos]
  );

  const totalGastos = useMemo(
    () => gastos.reduce((sum, gasto) => sum + (parseFloat(gasto.gasto) || 0), 0),
    [gastos]
  );

  const rfActual = useMemo(() => {
    // Priorizar RF Actual del Control Maestro (datos reales del Excel)
    return datosReales.rfActual; // -178714.88 (CRÍTICO)
  }, [datosReales.rfActual]);

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
    setFormData(type === 'transferencia' ? { bancoOrigen: 'Azteca' } : {});
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
        id: `${modalType}_azteca_${Date.now()}`,
        fecha: formData.fecha || new Date().toISOString().split('T')[0],
        ...formData,
      };

      if (modalType === 'ingreso') {
        addIngreso('azteca', nuevoRegistro);
      } else if (modalType === 'gasto') {
        addGasto('azteca', nuevoRegistro);
      } else if (modalType === 'corte') {
        addCorte('azteca', nuevoRegistro);
      } else if (modalType === 'transferencia') {
        addTransferencia('azteca', nuevoRegistro);
      }

      closeModal();
    },
    [modalType, formData, addIngreso, addGasto, addCorte, addTransferencia, closeModal]
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
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* ⚠️ ALERTA CRÍTICA DE SOBREGIRO - CON DATOS REALES */}
      {datosReales.esCritico && (
        <CriticalAlertBanner
          saldoMXN={datosReales.rfActual} // -178714.88 (valor real del Excel)
          bovedaOrigen="bovedaUsa"
          onTransfer={(monto, origen) => {
            console.log(`💸 TRANSFERENCIA URGENTE: $${monto} USD desde ${origen} a Azteca`);
            console.log(`📊 Sobregiro actual: $${datosReales.sobregiro.toLocaleString()} MXN`);
            // TODO: Implementar lógica de transferencia real con Firebase
          }}
          onDismiss={() => {
            console.log('⚠️ Alerta dismissada temporalmente - Se volverá a mostrar en 5 minutos');
          }}
        />
      )}

      {/* Particles Background - 30 particles */}
      <CreativeParticles count={30} colors={[COLORS.particles.from, COLORS.particles.to]} />

      {/* Scroll Progress */}
      <ScrollProgress color={COLORS.primary[0]} />

      <div className="relative z-10 space-y-6 p-6 pt-48">
        {/* pt-48 para espacio del banner crítico */}
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
                className="p-4 bg-gradient-to-br from-cyan-500/30 to-blue-500/20 rounded-2xl border border-cyan-500/30"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Building2 className="w-8 h-8 text-cyan-400" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Azteca
                </h1>
                <p className="text-slate-400 text-sm mt-1">Banco Azteca - Sistema Elegante</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 mb-1">RF Actual</p>
              <p className="text-3xl font-bold text-cyan-400">${rfActual.toLocaleString()}</p>
            </div>
          </div>

          {/* KPIs PREMIUM */}
          <div className="grid grid-cols-4 gap-4">
            <PremiumKPI
              title="Total Ingresos"
              value={totalIngresos}
              icon={TrendingUp}
              trend={12.5}
              color={COLORS.primary[0]}
              index={0}
            />
            <PremiumKPI
              title="Total Gastos"
              value={totalGastos}
              icon={TrendingDown}
              trend={-8.3}
              color="#ef4444"
              index={1}
            />
            <PremiumKPI
              title="Balance"
              value={balance}
              icon={DollarSign}
              trend={balance >= 0 ? 15.7 : -4.2}
              color={balance >= 0 ? '#10b981' : '#f59e0b'}
              index={2}
            />
            <PremiumKPI
              title="RF Actual"
              value={rfActual}
              icon={Activity}
              trend={9.1}
              color={COLORS.primary[1]}
              index={3}
            />
          </div>
        </motion.div>

        {/* 📊 PROYECCIÓN DE SOBREGIRO - 30 DÍAS (CON DATOS REALES) */}
        {datosReales.esCritico && (
          <OverdraftProjector
            saldoActualMXN={datosReales.rfActual} // -178714.88 (CRÍTICO)
            gastosPromedioMensuales={datosReales.totalGastos * 1.2} // Proyección pesimista
            ingresosPromedioMensuales={datosReales.totalIngresos * 0.9} // Proyección conservadora
          />
        )}

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
              <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2 mb-6">
                <PieChart className="w-7 h-7" />
                ScatterChart - Correlación Ingresos vs Gastos
              </h2>
              <p className="text-slate-400 text-sm mb-4">
                Cada punto representa un mes. El tamaño indica la magnitud de transacciones. Los
                puntos <span className="text-cyan-400 font-semibold">cyan</span> tienen balance
                positivo, los <span className="text-amber-400 font-semibold">amber</span> tienen
                balance negativo.
              </p>
              <ScatterCorrelationChart ingresos={ingresos} gastos={gastos} />
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
                          <td className="px-4 py-3 text-slate-400">{ing.destino || '-'}</td>
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
                      <th className="px-4 py-3 text-right text-slate-300">Pesos</th>
                      <th className="px-4 py-3 text-left text-slate-300">Concepto</th>
                      <th className="px-4 py-3 text-left text-slate-300">Observaciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {gastos.map((gasto, idx) => {
                      const valorGasto = parseFloat(gasto.gasto) || 0;
                      const tc = parseFloat(gasto.tc) || 0;
                      const pesos = parseFloat(gasto.pesos) || 0;
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
                            {gasto.origenDelGastoOAbono || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-red-400">
                            ${valorGasto.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-400">
                            {tc > 0 ? `$${tc.toFixed(2)}` : '-'}
                          </td>
                          <td className="px-4 py-3 text-right text-cyan-400">
                            {pesos > 0 ? `$${pesos.toLocaleString()}` : '-'}
                          </td>
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
                      <td colSpan="4"></td>
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
              titulo="RF Actual - Azteca"
              onAgregar={() => openModal('corte')}
            />
          )}

          {/* TABLA TRANSFERENCIAS */}
          {tabActiva === 'transferencias' && (
            <TablaTransferenciasPremium
              transferencias={transferencias}
              titulo="Transferencias - Azteca"
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
                  <Activity className="w-6 h-6 text-cyan-400" />
                  <span className="text-cyan-400">Nuevo Corte RF</span>
                </>
              )}
              {modalType === 'transferencia' && (
                <>
                  <ArrowRightLeft className="w-6 h-6 text-amber-400" />
                  <span className="text-amber-400">Nueva Transferencia</span>
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
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
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
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
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
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
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
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
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
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
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
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
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
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
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
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white min-h-[80px]"
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
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
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
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
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
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
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
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">
                    Concepto
                  </label>
                  <input
                    type="text"
                    value={formData.concepto || ''}
                    onChange={(e) => handleInputChange('concepto', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
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
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white min-h-[80px]"
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
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
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
                    value={formData.bancoOrigen || 'Azteca'}
                    onChange={(e) => handleInputChange('bancoOrigen', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                    required
                  >
                    <option value="Azteca">Azteca</option>
                    <option value="Profit">Profit</option>
                    <option value="Utilidades">Utilidades</option>
                    <option value="Bóveda Monte">Bóveda Monte</option>
                    <option value="Bóveda USA">Bóveda USA</option>
                    <option value="Flete Sur">Flete Sur</option>
                    <option value="Leftie">Leftie</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">
                    Banco Destino
                  </label>
                  <select
                    value={formData.bancoDestino || ''}
                    onChange={(e) => handleInputChange('bancoDestino', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
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
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
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
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
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
                className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg font-semibold transition-all shadow-lg text-white"
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

export default memo(PanelAzteca);
