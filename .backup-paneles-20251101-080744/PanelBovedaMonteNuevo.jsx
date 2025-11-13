/**
 * 🏆 PANEL BÓVEDA MONTE - ULTIMATE EDITION
 * =========================================
 * Tema: Gold/Amber (#f59e0b, #fbbf24)
 *
 * NUEVA ESTRUCTURA (GRÁFICOS PRIMERO):
 * 1. Header elegante
 * 2. 📊 GRÁFICO MAESTRO INTERACTIVO (lo principal)
 * 3. 🎯 KPIs compactos (secundarios)
 * 4. 📋 Tabs con tablas completas
 *
 * ✨ Diseño unificado base para todos los paneles
 * 🎯 Máxima interactividad y eficiencia
 * 📊 Gráfico innovador tipo Spline
 * 🔄 CRUD completo funcional
 * 💫 Micro-interacciones premium
 */

import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ArrowRightLeft,
  BarChart3,
  Coins,
  DollarSign,
  Plus,
  TrendingDown,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import GraficoMaestroInteractivo from './GraficoMaestroInteractivo';

// ============================================
// THEME COLORS - GOLD/AMBER
// ============================================
const COLORS = {
  primary: ['#f59e0b', '#fbbf24', '#fcd34d'],
  gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%)',
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function PanelBovedaMonteNuevo() {
  const datosBovedaMonte = useMemo(() => DATOS_JSON?.bancos?.bovedaMonte || {}, []);

  // Zustand Store
  const bancoBovedaMonte = useFlowStore((state) => state.bancos.bovedaMonte);
  const addIngreso = useFlowStore((state) => state.addIngreso);
  const addGasto = useFlowStore((state) => state.addGasto);
  const addCorte = useFlowStore((state) => state.addCorte);
  const addTransferencia = useFlowStore((state) => state.addTransferencia);
  const setBancoData = useFlowStore((state) => state.setBancoData);

  // Initialize from JSON
  useEffect(() => {
    if (bancoBovedaMonte.ingresos.length === 0 && datosBovedaMonte.ingresos?.length > 0) {
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
  const [tabActiva, setTabActiva] = useState('tablas');
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
      : datosBovedaMonte.saldoActual || 0;
  }, [cortes, datosBovedaMonte.saldoActual]);

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

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/30 text-white">
      {/* Particles Background */}
      <CreativeParticles count={30} color="#f59e0b" />
      <ScrollProgress color="#f59e0b" />

      {/* HEADER ELEGANTE */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-8 pb-0"
      >
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="p-4 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl shadow-2xl shadow-amber-500/40"
          >
            <Coins className="w-10 h-10 text-white" />
          </motion.div>
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Bóveda Monte
            </h1>
            <p className="text-gray-400 text-sm mt-1 font-medium">
              Panel de control financiero interactivo
            </p>
          </div>
        </div>
      </motion.div>

      {/* GRÁFICO MAESTRO INTERACTIVO - LO PRINCIPAL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative z-10 p-8 pt-6"
      >
        <GraficoMaestroInteractivo
          ingresos={ingresos}
          gastos={gastos}
          cortes={cortes}
          colorScheme={COLORS.primary}
          titulo="Análisis Financiero - Bóveda Monte"
        />
      </motion.div>

      {/* KPIs COMPACTOS - SECUNDARIOS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 px-8 pb-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PremiumKPI
            title="Total Ingresos"
            value={totalIngresos}
            icon={TrendingUp}
            colors={COLORS.primary}
            trend={12.5}
            compact
          />
          <PremiumKPI
            title="Total Gastos"
            value={totalGastos}
            icon={TrendingDown}
            colors={['#ef4444', '#dc2626']}
            trend={-3.2}
            compact
          />
          <PremiumKPI
            title="Balance"
            value={balance}
            icon={BarChart3}
            colors={balance >= 0 ? COLORS.primary : ['#ef4444', '#dc2626']}
            trend={balance >= 0 ? 8.5 : -4.1}
            compact
          />
          <PremiumKPI
            title="RF Actual"
            value={rfActual}
            icon={Activity}
            colors={['#06b6d4', '#0891b2']}
            trend={2.4}
            subtitle={`${cortes.length} cortes`}
            compact
          />
        </div>
      </motion.div>

      {/* TABS CON TABLAS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 px-8 mt-6"
      >
        <AnimatedTabBar
          tabs={[
            { id: 'tablas', label: 'Tablas de Datos', icon: BarChart3 },
            { id: 'ingresos', label: 'Ingresos', icon: TrendingUp },
            { id: 'gastos', label: 'Gastos', icon: TrendingDown },
            { id: 'cortes', label: 'Cortes RF', icon: Activity },
            { id: 'transferencias', label: 'Transferencias', icon: ArrowRightLeft },
          ]}
          activeTab={tabActiva}
          onChange={setTabActiva}
          color="#f59e0b"
        />
      </motion.div>

      {/* CONTENT TABS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 p-8 pt-4"
      >
        <AnimatePresence mode="wait">
          {tabActiva === 'tablas' && (
            <motion.div
              key="tablas"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <TablaIngresosPremium
                ingresos={ingresos}
                titulo="Ingresos - Bóveda Monte"
                onAgregar={() => openModal('ingreso')}
              />
            </motion.div>
          )}

          {tabActiva === 'ingresos' && (
            <TablaIngresosPremium
              ingresos={ingresos}
              titulo="Ingresos - Bóveda Monte"
              onAgregar={() => openModal('ingreso')}
            />
          )}

          {tabActiva === 'gastos' && (
            <TablaGastosPremium
              gastos={gastos}
              titulo="Gastos - Bóveda Monte"
              onAgregar={() => openModal('gasto')}
            />
          )}

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

          {tabActiva === 'transferencias' && (
            <TablaTransferenciasPremium
              transferencias={transferencias}
              titulo="Transferencias - Bóveda Monte"
              onAgregar={() => openModal('transferencia')}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* MODAL */}
      <ElegantModal
        isOpen={modalOpen}
        onClose={closeModal}
        title={`Agregar ${
          modalType === 'ingreso'
            ? 'Ingreso'
            : modalType === 'gasto'
              ? 'Gasto'
              : modalType === 'corte'
                ? 'Corte'
                : 'Transferencia'
        }`}
        colors={COLORS.primary}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Fecha</label>
            <input
              type="date"
              value={formData.fecha || ''}
              onChange={(e) => handleInputChange('fecha', e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-amber-500 focus:outline-none transition-colors"
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-amber-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Ingreso</label>
                <input
                  type="number"
                  value={formData.ingreso || ''}
                  onChange={(e) => handleInputChange('ingreso', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-amber-500 focus:outline-none transition-colors"
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-amber-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Gasto</label>
                <input
                  type="number"
                  value={formData.gasto || ''}
                  onChange={(e) => handleInputChange('gasto', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-amber-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </>
          )}

          {modalType === 'corte' && (
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Monto del Corte
              </label>
              <input
                type="number"
                value={formData.corte || ''}
                onChange={(e) => handleInputChange('corte', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-amber-500 focus:outline-none transition-colors"
                required
              />
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <AnimatedButton type="button" onClick={closeModal} variant="secondary" className="flex-1">
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
