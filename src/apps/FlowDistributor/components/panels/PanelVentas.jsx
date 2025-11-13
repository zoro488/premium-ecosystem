// 💰 PANEL VENTAS
// Panel para gestionar todas las ventas del sistema
import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  EyeOff,
  Percent,
  Plus,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';

import { useVentas } from '../../hooks/useVentas';
import { formatCurrency } from '../../utils/formatters';
import { PremiumModal } from '../PremiumModal';
import { FormVenta } from '../forms';
import { TablaVentas } from '../tables';

export const PanelVentas = () => {
  const [filtroEstatus, setFiltroEstatus] = useState('TODAS'); // TODAS, PENDIENTE, PAGADA
  const [modalVenta, setModalVenta] = useState(false);
  const [mostrarMontos, setMostrarMontos] = useState(true);

  const { ventas, estadisticas, loading } = useVentas({
    estatus: filtroEstatus === 'TODAS' ? null : filtroEstatus,
  });

  const stats = estadisticas;

  const filtros = [
    { id: 'TODAS', label: 'Todas', icon: Activity, count: stats.totalVentas },
    { id: 'PENDIENTE', label: 'Pendientes', icon: Clock, count: stats.ventasPendientes },
    { id: 'PAGADA', label: 'Pagadas', icon: CheckCircle, count: stats.ventasPagadas },
  ];

  const handleSuccess = () => {
    setModalVenta(false);
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-br from-success/10 via-primary/5 to-success/10 border border-success/20 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white font-display mb-2">Ventas</h1>
            <p className="text-white/60">Gestión completa de ventas y distribución</p>
          </div>

          {/* Botón Nueva Venta */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setModalVenta(true)}
            className="px-6 py-3 bg-gradient-to-r from-success/20 to-success/30 hover:from-success/30 hover:to-success/40 border border-success/30 rounded-xl text-success font-medium shadow-lg shadow-success/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nueva Venta
          </motion.button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-5 gap-4">
          {/* Total Ventas */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/10">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Total Ventas</p>
                <p className="text-white text-xl font-bold">{stats.totalVentas}</p>
              </div>
            </div>
          </motion.div>

          {/* Ingresos Totales */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="backdrop-blur-md bg-success/10 border border-success/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-white/60 text-xs">Ingresos</p>
                  <button
                    onClick={() => setMostrarMontos(!mostrarMontos)}
                    className="p-0.5 hover:bg-white/10 rounded transition-all"
                  >
                    {mostrarMontos ? (
                      <Eye className="w-3 h-3 text-white/40" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-white/40" />
                    )}
                  </button>
                </div>
                {mostrarMontos ? (
                  <p className="text-success text-xl font-bold">
                    {formatCurrency(stats.totalIngresos)}
                  </p>
                ) : (
                  <p className="text-success/20 text-xl font-bold">••••••</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Costos */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="backdrop-blur-md bg-error/10 border border-error/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-error/20">
                <DollarSign className="w-5 h-5 text-error" />
              </div>
              <div className="flex-1">
                <p className="text-white/60 text-xs">Costos</p>
                {mostrarMontos ? (
                  <p className="text-error text-xl font-bold">
                    {formatCurrency(stats.totalCostos)}
                  </p>
                ) : (
                  <p className="text-error/20 text-xl font-bold">••••••</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Utilidad */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="backdrop-blur-md bg-primary/10 border border-primary/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-white/60 text-xs">Utilidad</p>
                {mostrarMontos ? (
                  <p className="text-primary text-xl font-bold">
                    {formatCurrency(stats.totalUtilidad)}
                  </p>
                ) : (
                  <p className="text-primary/20 text-xl font-bold">••••••</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Margen */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/10">
                <Percent className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Margen Prom.</p>
                <p className="text-white text-xl font-bold">{stats.margenPromedio.toFixed(1)}%</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Filtros */}
      <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl rounded-xl p-1">
        {filtros.map((filtro) => {
          const Icon = filtro.icon;
          const isActive = filtroEstatus === filtro.id;

          return (
            <button
              key={filtro.id}
              onClick={() => setFiltroEstatus(filtro.id)}
              className={`
                relative px-6 py-3 rounded-lg font-medium transition-all flex-1
                ${
                  isActive
                    ? 'bg-success/20 text-success border border-success/30'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <div className="flex items-center justify-center gap-2">
                <Icon className="w-4 h-4" />
                <span>{filtro.label}</span>
                {filtro.count > 0 && (
                  <span
                    className={`
                    ml-2 px-2 py-0.5 rounded-full text-xs font-bold
                    ${isActive ? 'bg-success/30' : 'bg-white/10'}
                  `}
                  >
                    {filtro.count}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Tabla de ventas */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filtroEstatus}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <TablaVentas
            ventas={ventas}
            loading={loading}
            onMarcarPagada={() => {
              // Refrescar datos - el hook ya se actualiza solo con Zustand
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Modal Nueva Venta */}
      <PremiumModal isOpen={modalVenta} onClose={() => setModalVenta(false)} title="Nueva Venta">
        <FormVenta onSuccess={handleSuccess} onCancel={() => setModalVenta(false)} />
      </PremiumModal>
    </div>
  );
};

export default PanelVentas;
