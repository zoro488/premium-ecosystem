// 🏦 PANEL BANCO (TEMPLATE)
// Template universal para todas las bóvedas/bancos con 4 tablas integradas
import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ArrowRightLeft,
  DollarSign,
  Eye,
  EyeOff,
  Plus,
  Scissors,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import { useBancos } from '../../hooks/useBancos';
import { useCortes } from '../../hooks/useCortes';
import { useTransferencias } from '../../hooks/useTransferencias';
import { formatBovedaName, formatCurrency } from '../../utils/formatters';
import { PremiumModal } from '../PremiumModal';
import { FormCorte, FormGasto, FormIngreso, FormTransferencia } from '../forms';
import { TablaCortes, TablaGastos, TablaIngresos, TablaTransferencias } from '../tables';

/**
 * Panel universal para gestionar una bóveda/banco
 * @param {Object} props
 * @param {string} props.bovedaId - Código de la bóveda
 * @param {string} props.bovedaNombre - Nombre display de la bóveda
 */
export const PanelBanco = ({ bovedaId, bovedaNombre }) => {
  const { boveda, obtenerEstadisticas, obtenerHistorico, loading } = useBancos(bovedaId);
  const { transferencias: todasTransferencias } = useTransferencias();
  const { cortes, configuracion } = useCortes('boveda', bovedaId);

  const [tabActiva, setTabActiva] = useState('ingresos');
  const [modalAbierto, setModalAbierto] = useState(null); // 'ingreso', 'gasto', 'transferencia', 'corte'
  const [mostrarSaldo, setMostrarSaldo] = useState(true);

  const stats = obtenerEstadisticas(bovedaId);

  // Filtrar transferencias de esta bóveda
  const transferenciasBovedas =
    todasTransferencias?.filter(
      (t) => t.origenBoveda === bovedaId || t.destinoBoveda === bovedaId
    ) || [];

  const tabs = [
    {
      id: 'ingresos',
      label: 'Ingresos',
      icon: TrendingUp,
      color: 'success',
      count: boveda?.ingresos?.length || 0,
    },
    {
      id: 'gastos',
      label: 'Gastos',
      icon: TrendingDown,
      color: 'error',
      count: boveda?.gastos?.length || 0,
    },
    {
      id: 'transferencias',
      label: 'Transferencias',
      icon: ArrowRightLeft,
      color: 'primary',
      count: transferenciasBovedas.length,
    },
    {
      id: 'cortes',
      label: 'Cortes / RF Actual',
      icon: Scissors,
      color: 'warning',
      count: cortes?.length || 0,
    },
  ];

  const handleSuccess = () => {
    setModalAbierto(null);
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 border border-primary/20 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white font-display mb-2">
              {bovedaNombre || formatBovedaName(bovedaId)}
            </h1>
            <p className="text-white/60">Gestión completa de bóveda</p>
          </div>

          {/* Saldo Actual */}
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-white/60 text-sm">Saldo Actual</p>
              <button
                onClick={() => setMostrarSaldo(!mostrarSaldo)}
                className="p-1 hover:bg-white/10 rounded transition-all"
              >
                {mostrarSaldo ? (
                  <Eye className="w-4 h-4 text-white/60" />
                ) : (
                  <EyeOff className="w-4 h-4 text-white/60" />
                )}
              </button>
            </div>
            {mostrarSaldo ? (
              <p className="text-4xl font-bold text-white">{formatCurrency(stats?.saldo || 0)}</p>
            ) : (
              <p className="text-4xl font-bold text-white/20">••••••</p>
            )}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="backdrop-blur-md bg-success/10 border border-success/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Total Ingresos</p>
                <p className="text-success text-xl font-bold">
                  {formatCurrency(stats?.totalIngresos || 0)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="backdrop-blur-md bg-error/10 border border-error/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-error/20">
                <TrendingDown className="w-5 h-5 text-error" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Total Gastos</p>
                <p className="text-error text-xl font-bold">
                  {formatCurrency(stats?.totalGastos || 0)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="backdrop-blur-md bg-primary/10 border border-primary/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <ArrowRightLeft className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Transferencias</p>
                <p className="text-primary text-xl font-bold">
                  {formatCurrency(
                    (stats?.totalTransferenciasEntrada || 0) -
                      (stats?.totalTransferenciasSalida || 0)
                  )}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/10">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Movimientos</p>
                <p className="text-white text-xl font-bold">
                  {(stats?.cantidadIngresos || 0) +
                    (stats?.cantidadGastos || 0) +
                    (stats?.cantidadTransferencias || 0)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Tabs y acciones */}
      <div className="flex items-center justify-between">
        {/* Tabs */}
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl rounded-xl p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tabActiva === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setTabActiva(tab.id)}
                className={`
                  relative px-6 py-3 rounded-lg font-medium transition-all
                  ${
                    isActive
                      ? `bg-${tab.color}/20 text-${tab.color} border border-${tab.color}/30`
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span
                      className={`
                      ml-2 px-2 py-0.5 rounded-full text-xs font-bold
                      ${isActive ? `bg-${tab.color}/30` : 'bg-white/10'}
                    `}
                    >
                      {tab.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-2">
          {tabActiva === 'ingresos' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setModalAbierto('ingreso')}
              className="px-4 py-2 bg-gradient-to-r from-success/20 to-success/30 hover:from-success/30 hover:to-success/40 border border-success/30 rounded-lg text-success font-medium shadow-lg shadow-success/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo Ingreso
            </motion.button>
          )}

          {tabActiva === 'gastos' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setModalAbierto('gasto')}
              className="px-4 py-2 bg-gradient-to-r from-error/20 to-error/30 hover:from-error/30 hover:to-error/40 border border-error/30 rounded-lg text-error font-medium shadow-lg shadow-error/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo Gasto
            </motion.button>
          )}

          {tabActiva === 'transferencias' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setModalAbierto('transferencia')}
              className="px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 border border-primary/30 rounded-lg text-primary font-medium shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva Transferencia
            </motion.button>
          )}

          {tabActiva === 'cortes' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setModalAbierto('corte')}
              className="px-4 py-2 bg-gradient-to-r from-warning/20 to-warning/30 hover:from-warning/30 hover:to-warning/40 border border-warning/30 rounded-lg text-warning font-medium shadow-lg shadow-warning/20 transition-all flex items-center gap-2"
            >
              <Scissors className="w-4 h-4" />
              Ejecutar Corte
            </motion.button>
          )}
        </div>
      </div>

      {/* Contenido de tabs */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tabActiva}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {tabActiva === 'ingresos' && (
            <TablaIngresos ingresos={boveda?.ingresos || []} loading={loading} />
          )}

          {tabActiva === 'gastos' && (
            <TablaGastos gastos={boveda?.gastos || []} loading={loading} />
          )}

          {tabActiva === 'transferencias' && (
            <TablaTransferencias
              transferencias={transferenciasBovedas}
              bovedaId={bovedaId}
              loading={loading}
            />
          )}

          {tabActiva === 'cortes' && (
            <TablaCortes
              cortes={cortes || []}
              loading={loading}
              configuracion={configuracion}
              onConfigClick={() => setModalAbierto('corte')}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Modales */}
      <PremiumModal
        isOpen={modalAbierto === 'ingreso'}
        onClose={() => setModalAbierto(null)}
        title="Nuevo Ingreso"
      >
        <FormIngreso
          bovedaId={bovedaId}
          bovedaNombre={bovedaNombre}
          onSuccess={handleSuccess}
          onCancel={() => setModalAbierto(null)}
        />
      </PremiumModal>

      <PremiumModal
        isOpen={modalAbierto === 'gasto'}
        onClose={() => setModalAbierto(null)}
        title="Nuevo Gasto"
      >
        <FormGasto
          bovedaId={bovedaId}
          bovedaNombre={bovedaNombre}
          onSuccess={handleSuccess}
          onCancel={() => setModalAbierto(null)}
        />
      </PremiumModal>

      <PremiumModal
        isOpen={modalAbierto === 'transferencia'}
        onClose={() => setModalAbierto(null)}
        title="Nueva Transferencia"
      >
        <FormTransferencia onSuccess={handleSuccess} onCancel={() => setModalAbierto(null)} />
      </PremiumModal>

      <PremiumModal
        isOpen={modalAbierto === 'corte'}
        onClose={() => setModalAbierto(null)}
        title="Corte de Bóveda"
      >
        <FormCorte
          bovedaId={bovedaId}
          bovedaNombre={bovedaNombre}
          onSuccess={handleSuccess}
          onCancel={() => setModalAbierto(null)}
        />
      </PremiumModal>
    </div>
  );
};

export default PanelBanco;
