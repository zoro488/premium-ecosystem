/**
 * 🏆 PANEL BÓVEDA MONTE ULTRA - PREMIUM EDITION
 * ===============================================
 * Fusión del panel original con Design System Premium
 *
 * ✨ Design System Integration:
 * - theme.ts (Gold/Amber colors, typography, spacing)
 * - animations.ts (fadeInUp, scaleIn, slideLeft)
 * - KpiCard3D para KPIs premium con glassmorphism
 * - CreativeParticles background
 * - PremiumLoadingScreen
 *
 * 🎯 Features Preservadas:
 * - RadarChart innovador (único de este panel)
 * - 4 tablas completas: Ingresos, Gastos, Cortes, Transferencias
 * - CRUD completo funcional
 * - Datos reales del JSON
 *
 * 🎨 Theme: Gold/Amber (#f59e0b, #fbbf24)
 */
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ArrowRightLeft,
  Building2,
  DollarSign,
  Plus,
  Scissors,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';

// Recharts básicos ya no se usan - ahora usamos AdvancedRadarChart

// Data & Store
import DATOS_BOVEDAS_COMPLETOS from '../../../data/datos_bovedas_completos.json';
import { useFlowStore } from '../../../stores/flowStore';
import panelDataManual from '../data/panel-boveda-monte-manual.json';
import {
  AdvancedRadarChart,
  animations,
  CreativeParticles,
  KpiCard3D,
  PremiumLoadingScreen,
  theme,
} from '../shared';
// Existing Premium Components (mantener tablas originales)
import {
  TablaCortesPremium,
  TablaGastosPremium,
  TablaIngresosPremium,
  TablaTransferenciasPremium,
} from './TablasBancoPremium';

// ============================================
// TYPES
// ============================================
interface Ingreso {
  id: string;
  fecha: string;
  cliente: string;
  ingreso: number;
  concepto?: string;
}

interface Gasto {
  id: string;
  fecha: string;
  proveedor?: string;
  gasto: number;
  concepto?: string;
}

interface Corte {
  id: string;
  fecha: string;
  corte: number;
  concepto?: string;
}

interface Transferencia {
  id: string;
  fecha: string;
  monto: number;
  bancoOrigen: string;
  bancoDestino: string;
  concepto?: string;
}

// ============================================
// RADAR CHART - Ahora usando AdvancedRadarChart
// ============================================
// El gráfico básico RadialWaveChart ha sido reemplazado
// por AdvancedRadarChart con características premium

// ============================================
// MODAL PREMIUM
// ============================================
interface ModalProps {
  type: 'ingreso' | 'gasto' | 'corte' | 'transferencia';
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading?: boolean;
}

const PremiumModal = memo(({ type, onClose, onSubmit, loading }: ModalProps) => {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    monto: '',
    concepto: '',
    cliente: '',
    proveedor: '',
    bancoDestino: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const titles = {
    ingreso: 'Nuevo Ingreso',
    gasto: 'Nuevo Gasto',
    corte: 'Nuevo Corte RF',
    transferencia: 'Nueva Transferencia',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      onClick={onClose}
    >
      <motion.div
        variants={animations.modal}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "rgba(30, 41, 59, 0.6)",
          backdropFilter: "blur(10px)",
          border: `1px solid ${"rgba(148, 163, 184, 0.1)"}`,
          boxShadow: theme.shadows.premium,
        }}
      >
        {/* Header */}
        <div
          className="p-6 border-b"
          style={{
            background: `linear-gradient(135deg, ${"#f59e0b"}15 0%, ${"#fbbf24"}15 100%)`,
            borderColor: "rgba(148, 163, 184, 0.1)",
          }}
        >
          <div className="flex items-center justify-between">
            <h2
              className="text-2xl font-bold"
              style={{
                color: "#f8fafc",
                fontFamily: theme.typography.fontFamily.heading,
              }}
            >
              {titles[type]}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors"
              style={{
                color: "#cbd5e1",
                backgroundColor: 'transparent',
              }}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: "#cbd5e1" }}
            >
              Fecha
            </label>
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              className="w-full px-4 py-3 rounded-xl transition-all"
              style={{
                backgroundColor: `${"rgba(30, 41, 59, 0.6)"}80`,
                border: `1px solid ${"rgba(148, 163, 184, 0.1)"}`,
                color: "#f8fafc",
              }}
              required
            />
          </div>

          {type !== 'transferencia' && (
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#cbd5e1" }}
              >
                {type === 'ingreso' ? 'Cliente' : type === 'gasto' ? 'Proveedor' : 'Concepto'}
              </label>
              <input
                type="text"
                value={
                  type === 'ingreso'
                    ? formData.cliente
                    : type === 'gasto'
                      ? formData.proveedor
                      : formData.concepto
                }
                onChange={(e) => {
                  if (type === 'ingreso') setFormData({ ...formData, cliente: e.target.value });
                  else if (type === 'gasto')
                    setFormData({ ...formData, proveedor: e.target.value });
                  else setFormData({ ...formData, concepto: e.target.value });
                }}
                className="w-full px-4 py-3 rounded-xl transition-all"
                style={{
                  backgroundColor: `${"rgba(30, 41, 59, 0.6)"}80`,
                  border: `1px solid ${"rgba(148, 163, 184, 0.1)"}`,
                  color: "#f8fafc",
                }}
                required
              />
            </div>
          )}

          {type === 'transferencia' && (
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#cbd5e1" }}
              >
                Banco Destino
              </label>
              <select
                value={formData.bancoDestino}
                onChange={(e) => setFormData({ ...formData, bancoDestino: e.target.value })}
                className="w-full px-4 py-3 rounded-xl transition-all"
                style={{
                  backgroundColor: `${"rgba(30, 41, 59, 0.6)"}80`,
                  border: `1px solid ${"rgba(148, 163, 184, 0.1)"}`,
                  color: "#f8fafc",
                }}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="bovedaUsa">Bóveda USA</option>
                <option value="azteca">Azteca</option>
                <option value="utilidades">Utilidades</option>
                <option value="fleteSur">Flete Sur</option>
                <option value="leftie">Leftie</option>
                <option value="profit">Profit</option>
              </select>
            </div>
          )}

          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: "#cbd5e1" }}
            >
              Monto
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
              className="w-full px-4 py-3 rounded-xl transition-all"
              style={{
                backgroundColor: `${"rgba(30, 41, 59, 0.6)"}80`,
                border: `1px solid ${"rgba(148, 163, 184, 0.1)"}`,
                color: "#f8fafc",
              }}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: "#cbd5e1" }}
            >
              Observaciones
            </label>
            <textarea
              value={formData.concepto}
              onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl transition-all resize-none"
              style={{
                backgroundColor: `${"rgba(30, 41, 59, 0.6)"}80`,
                border: `1px solid ${"rgba(148, 163, 184, 0.1)"}`,
                color: "#f8fafc",
              }}
              placeholder="Detalles adicionales..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all"
              style={{
                background: `linear-gradient(135deg, ${"#f59e0b"} 0%, ${"#fbbf24"} 100%)`,
                color: 'white',
                boxShadow: theme.shadows.glow.gold,
              }}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </motion.button>
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-xl font-semibold transition-all"
              style={{
                backgroundColor: `${"rgba(30, 41, 59, 0.6)"}80`,
                border: `1px solid ${"rgba(148, 163, 184, 0.1)"}`,
                color: "#cbd5e1",
              }}
            >
              Cancelar
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
});

PremiumModal.displayName = 'PremiumModal';

// ============================================
// MAIN COMPONENT
// ============================================
export default function PanelBovedaMonteUltra() {
  // ============================================
  // STATE & DATA
  // ============================================
  const bancoBovedaMonte = useFlowStore((state) => state.bancos.bovedaMonte);
  const addIngreso = useFlowStore((state) => state.addIngresoBanco);
  const addGasto = useFlowStore((state) => state.addGastoBanco);
  const addCorte = useFlowStore((state) => state.addCorteBanco);
  const addTransferencia = useFlowStore((state) => state.addTransferenciaBanco);
  const setBancoData = useFlowStore((state) => state.setBancoData);

  const [loading, setLoading] = useState(true);
  const [tabActiva, setTabActiva] = useState<
    'graficos' | 'maestro' | 'ingresos' | 'gastos' | 'cortes' | 'transferencias'
  >('graficos');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    'ingreso' | 'gasto' | 'corte' | 'transferencia' | null
  >(null);

  // ============================================
  // INITIALIZE DATA
  // ============================================
  useEffect(() => {
    const initializeData = async () => {
      try {
        if (
          (!bancoBovedaMonte.ingresos || bancoBovedaMonte.ingresos.length === 0) &&
          panelDataManual.bovedaMonte.ingresosList?.length > 0
        ) {
          const ingresosConId = panelDataManual.bovedaMonte.ingresosList.map((ing, idx) => ({
            ...ing,
            id: `ing_bovmonte_${Date.now()}_${idx}`,
            ingreso: ing.ingreso || 0,
          }));

          const gastosConId = (panelDataManual.bovedaMonte.gastosList || []).map((gasto, idx) => ({
            ...gasto,
            id: `gasto_bovmonte_${Date.now()}_${idx}`,
            gasto: gasto.gasto || 0,
          }));

          const cortesConId = (panelDataManual.bovedaMonte.rfCortes || []).map((corte, idx) => ({
            ...corte,
            id: `corte_bovmonte_${Date.now()}_${idx}`,
            corte: corte.corte || 0,
          }));

          setBancoData('bovedaMonte', {
            nombre: 'Bóveda Monte',
            saldoActual:
              DATOS_BOVEDAS_COMPLETOS.controlMaestro.rfActual.paneles['Bóveda Monte'] || 0,
            ingresos: ingresosConId,
            gastos: gastosConId,
            cortes: cortesConId,
            transferencias: [],
          });
        }
      } catch (error) {
        console.error('Error inicializando datos:', error);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    initializeData();
  }, [bancoBovedaMonte.ingresos?.length, setBancoData]);

  // ============================================
  // CALCULATIONS
  // ============================================
  const ingresos = bancoBovedaMonte.ingresos || [];
  const gastos = bancoBovedaMonte.gastos || [];
  const cortes = bancoBovedaMonte.cortes || [];
  const transferencias = bancoBovedaMonte.transferencias || [];

  const totalIngresos = useMemo(
    () => ingresos.reduce((sum, ing) => sum + (Number.parseFloat(String(ing.ingreso)) || 0), 0),
    [ingresos]
  );

  const totalGastos = useMemo(
    () => gastos.reduce((sum, g) => sum + (Number.parseFloat(String(g.gasto)) || 0), 0),
    [gastos]
  );

  const balance = useMemo(() => totalIngresos - totalGastos, [totalIngresos, totalGastos]);

  const rfActual = useMemo(
    () => DATOS_BOVEDAS_COMPLETOS.controlMaestro.rfActual.paneles['Bóveda Monte'] || 0,
    []
  );

  // Radar Chart Data
  const radarData = useMemo(
    () => [
      { category: 'Ingresos', value: totalIngresos / 1000 },
      { category: 'Gastos', value: totalGastos / 1000 },
      { category: 'Balance', value: Math.abs(balance) / 1000 },
      { category: 'RF Actual', value: Math.abs(rfActual) / 1000 },
      {
        category: 'Transferencias',
        value:
          transferencias.reduce((sum, t) => sum + (Number.parseFloat(String(t.monto)) || 0), 0) /
          1000,
      },
    ],
    [totalIngresos, totalGastos, balance, rfActual, transferencias]
  );

  // ============================================
  // HANDLERS
  // ============================================
  const openModal = useCallback((type: 'ingreso' | 'gasto' | 'corte' | 'transferencia') => {
    setModalType(type);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalType(null);
  }, []);

  const handleSubmit = useCallback(
    (data: any) => {
      const nuevoRegistro = {
        id: `${modalType}_${Date.now()}`,
        fecha: data.fecha,
        [modalType === 'ingreso' ? 'ingreso' : modalType === 'gasto' ? 'gasto' : 'corte']:
          Number.parseFloat(data.monto),
        ...(modalType === 'ingreso' && { cliente: data.cliente }),
        ...(modalType === 'gasto' && { proveedor: data.proveedor }),
        ...(modalType === 'transferencia' && {
          bancoOrigen: 'bovedaMonte',
          bancoDestino: data.bancoDestino,
          monto: Number.parseFloat(data.monto),
        }),
        concepto: data.concepto,
      };

      if (modalType === 'ingreso') addIngreso('bovedaMonte', nuevoRegistro);
      else if (modalType === 'gasto') addGasto('bovedaMonte', nuevoRegistro);
      else if (modalType === 'corte') addCorte('bovedaMonte', nuevoRegistro);
      else if (modalType === 'transferencia') addTransferencia('bovedaMonte', nuevoRegistro);

      closeModal();
    },
    [modalType, addIngreso, addGasto, addCorte, addTransferencia, closeModal]
  );

  // ============================================
  // TABS CONFIG
  // ============================================
  const tabs = [
    { id: 'graficos', label: 'Gráficos', icon: Activity, count: null },
    { id: 'maestro', label: 'Análisis Maestro', icon: Activity, count: null },
    { id: 'ingresos', label: 'Ingresos', icon: TrendingUp, count: ingresos.length },
    { id: 'gastos', label: 'Gastos', icon: TrendingDown, count: gastos.length },
    { id: 'cortes', label: 'Cortes RF', icon: Scissors, count: cortes.length },
    {
      id: 'transferencias',
      label: 'Transferencias',
      icon: ArrowRightLeft,
      count: transferencias.length,
    },
  ] as const;

  // ============================================
  // RENDER
  // ============================================
  if (loading) {
    return <PremiumLoadingScreen message="Cargando Bóveda Monte..." />;
  }

  return (
    <div
      className="min-h-screen p-6 md:p-8 relative"
      style={{
        background: `linear-gradient(135deg, ${"#0a0e27"} 0%, ${"#1a1f3a"} 100%)`,
      }}
    >
      {/* Creative Particles Background */}
      <CreativeParticles
        count={30}
        colors={["#f59e0b", "#fbbf24"]}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          variants={animations.container}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <motion.div
              variants={animations.container.fadeSlideUp}
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${"#f59e0b"} 0%, ${"#fbbf24"} 100%)`,
                boxShadow: theme.shadows.glow.gold,
              }}
            >
              <Building2 className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <motion.h1
                variants={animations.container.fadeSlideUp}
                className="text-4xl font-bold"
                style={{
                  color: "#f8fafc",
                  fontFamily: theme.typography.fontFamily.heading,
                }}
              >
                Bóveda Monte
              </motion.h1>
              <motion.p
                variants={animations.container.fadeSlideUp}
                className="text-sm"
                style={{ color: "#cbd5e1" }}
              >
                Recuperación de costos de mercancía
              </motion.p>
            </div>
          </div>

          <motion.div variants={animations.container.fadeSlideUp} className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openModal('ingreso')}
              className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${"#f59e0b"} 0%, ${"#fbbf24"} 100%)`,
                color: 'white',
                boxShadow: theme.shadows.glow.gold,
              }}
            >
              <Plus className="w-5 h-5" />
              Nuevo Ingreso
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openModal('gasto')}
              className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
              style={{
                backgroundColor: `${"rgba(30, 41, 59, 0.6)"}80`,
                backdropFilter: "blur(10px)",
                border: `1px solid ${"rgba(148, 163, 184, 0.1)"}`,
                color: "#f8fafc",
              }}
            >
              <Plus className="w-5 h-5" />
              Nuevo Gasto
            </motion.button>
          </motion.div>
        </motion.div>

        {/* KPIs */}
        <motion.div
          variants={animations.container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <KpiCard3D
            title="Capital Actual"
            value={`$${rfActual.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
            icon={Building2}
            trend={balance >= 0 ? 'up' : 'down'}
            trendValue={`${((balance / totalIngresos) * 100).toFixed(1)}%`}
            gradient={[
              "#f59e0b",
              "#fbbf24",
            ]}
          />
          <KpiCard3D
            title="Total Ingresos"
            value={`$${totalIngresos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
            icon={TrendingUp}
            trend="up"
            trendValue={`${ingresos.length} registros`}
            gradient={[theme.colors.success.primary, theme.colors.success.secondary]}
          />
          <KpiCard3D
            title="Total Gastos"
            value={`$${totalGastos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
            icon={TrendingDown}
            trend="down"
            trendValue={`${gastos.length} registros`}
            gradient={[theme.colors.error.primary, theme.colors.error.secondary]}
          />
          <KpiCard3D
            title="Balance Neto"
            value={`$${balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
            icon={DollarSign}
            trend={balance >= 0 ? 'up' : 'down'}
            trendValue={balance >= 0 ? 'Positivo' : 'Negativo'}
            gradient={
              balance >= 0
                ? [theme.colors.info.primary, theme.colors.info.secondary]
                : [theme.colors.warning.primary, theme.colors.warning.secondary]
            }
          />
        </motion.div>

        {/* Tabs */}
        <motion.div
          variants={animations.container.fadeSlideUp}
          initial="hidden"
          animate="visible"
          className="flex gap-2 p-2 rounded-2xl"
          style={{
            backgroundColor: `${"rgba(30, 41, 59, 0.6)"}40`,
            backdropFilter: "blur(10px)",
            border: `1px solid ${"rgba(148, 163, 184, 0.1)"}`,
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tabActiva === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => setTabActiva(tab.id as any)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${"#f59e0b"} 0%, ${"#fbbf24"} 100%)`
                    : 'transparent',
                  color: isActive ? 'white' : "#cbd5e1",
                  boxShadow: isActive ? theme.shadows.glow.gold : 'none',
                }}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tabActiva}
            variants={animations.container.fadeSlideUp}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {tabActiva === 'graficos' && (
              <div
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: `${"rgba(30, 41, 59, 0.6)"}80`,
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${"rgba(148, 163, 184, 0.1)"}`,
                }}
              >
                <AdvancedRadarChart
                  data={radarData}
                  title="Análisis RadarChart - Vista 360°"
                  colors={[
                    "#f59e0b",
                    "#fbbf24",
                  ]}
                  height={500}
                  showControls={true}
                  exportable={true}
                  onDataPointClick={(data) => {
                    console.log('Clicked metric:', data);
                    // Aquí puedes agregar lógica para mostrar detalles del punto
                  }}
                />
              </div>
            )}

            {tabActiva === 'maestro' && (
              <div
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: `${"rgba(30, 41, 59, 0.6)"}80`,
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${"rgba(148, 163, 184, 0.1)"}`,
                }}
              >
                <GraficoMaestroInteractivo
                  ingresos={ingresos}
                  gastos={gastos}
                  cortes={cortes}
                  colorScheme={[
                    "#f59e0b",
                    "#fbbf24",
                  ]}
                  titulo="📊 Análisis Maestro Interactivo - Bóveda Monte"
                />
              </div>
            )}

            {tabActiva === 'ingresos' && (
              <TablaIngresosPremium
                ingresos={ingresos}
                color={"#f59e0b"}
              />
            )}

            {tabActiva === 'gastos' && (
              <TablaGastosPremium gastos={gastos} color={"#f59e0b"} />
            )}

            {tabActiva === 'cortes' && (
              <TablaCortesPremium cortes={cortes} color={"#f59e0b"} />
            )}

            {tabActiva === 'transferencias' && (
              <TablaTransferenciasPremium
                transferencias={transferencias}
                color={"#f59e0b"}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && modalType && (
          <PremiumModal type={modalType} onClose={closeModal} onSubmit={handleSubmit} />
        )}
      </AnimatePresence>
    </div>
  );
}
