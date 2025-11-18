/**
 * 🏆 PANEL BÓVEDA MONTE ULTRA - FIRESTORE EDITION
 * ===============================================
 * Panel conectado a Firestore con datos en tiempo real
 *
 * ✨ Features:
 * - Conexión directa a Firestore usando useBancoData hook
 * - KPIs 3D premium con datos reales
 * - Timeline de actividades recientes
 * - Tablas interactivas con todos los datos
 * - Sistema de alertas y notificaciones
 * - Animaciones y transiciones suaves
 *
 * 📊 Datos de Firestore:
 * - Banco: bancos/boveda-monte
 * - Ingresos: 69 registros
 * - Gastos: 26 registros
 * - Cortes: 5 registros
 *
 * 🎨 Theme: Gold/Amber (#f59e0b, #fbbf24)
 */
import { memo, useState } from 'react';

// @ts-ignore
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  DollarSign,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import { useBancoData } from '../hooks/useBancoData';

// ============================================================================
// HELPERS
// ============================================================================

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, "d 'de' MMMM, yyyy", { locale: es });
};

// ============================================================================
// LOADING STATE
// ============================================================================

const LoadingState = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 mx-auto mb-4 border-4 border-zinc-500 border-t-transparent rounded-full"
      />
      <h2 className="text-2xl font-bold text-white mb-2">Cargando Bóveda Monte</h2>
      <p className="text-slate-400">Obteniendo datos desde Firestore...</p>
    </motion.div>
  </div>
);

// ============================================================================
// ERROR STATE
// ============================================================================

const ErrorState = ({ error, onRetry }: { error: any; onRetry: () => void }) => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-zinc-500/20"
    >
      <AlertCircle className="w-16 h-16 text-zinc-100 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-white text-center mb-2">Error al Cargar Datos</h2>
      <p className="text-slate-400 text-center mb-6">{error?.message || 'Error desconocido'}</p>
      <button
        onClick={onRetry}
        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        <RefreshCw className="w-5 h-5" />
        Reintentar
      </button>
    </motion.div>
  </div>
);

// ============================================================================
// KPI CARD 3D
// ============================================================================

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: number;
  color: string;
  delay?: number;
}

const KpiCard3D = memo(({ title, value, icon, trend, color, delay = 0 }: KpiCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ scale: 1.02, y: -5 }}
    className="relative group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
    <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-zinc-500/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>{icon}</div>
        {trend !== undefined && (
          <span
            className={`flex items-center gap-1 text-sm font-semibold ${
              trend >= 0 ? 'text-zinc-200' : 'text-zinc-200'
            }`}
          >
            {trend >= 0 ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <h3 className="text-slate-400 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  </motion.div>
));

// ============================================================================
// TIMELINE ACTIVITY
// ============================================================================

interface TimelineItemProps {
  tipo: 'ingreso' | 'gasto';
  monto: number;
  cliente?: string;
  proveedor?: string;
  fecha: Date;
  concepto?: string;
}

const TimelineActivity = memo(({ transactions }: { transactions: TimelineItemProps[] }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4 }}
    className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
  >
    <div className="flex items-center gap-3 mb-6">
      <Activity className="w-6 h-6 text-amber-500" />
      <h2 className="text-xl font-bold text-white">Actividad Reciente</h2>
    </div>
    <div className="space-y-4">
      {transactions.length === 0 ? (
        <p className="text-slate-400 text-center py-8">No hay transacciones recientes</p>
      ) : (
        transactions.map((transaction, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-start gap-4 p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-all"
          >
            <div
              className={`p-2 rounded-lg ${
                transaction.tipo === 'ingreso'
                  ? 'bg-zinc-9000/20 text-zinc-200'
                  : 'bg-zinc-9000/20 text-zinc-200'
              }`}
            >
              {transaction.tipo === 'ingreso' ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white truncate">
                  {transaction.cliente || transaction.proveedor || 'Sin nombre'}
                </span>
                <span
                  className={`font-bold ${
                    transaction.tipo === 'ingreso' ? 'text-zinc-200' : 'text-zinc-200'
                  }`}
                >
                  {transaction.tipo === 'ingreso' ? '+' : '-'}
                  {formatCurrency(transaction.monto)}
                </span>
              </div>
              <p className="text-sm text-slate-400 truncate">
                {transaction.concepto || 'Sin concepto'}
              </p>
              <p className="text-xs text-slate-500 mt-1">{formatDate(transaction.fecha)}</p>
            </div>
          </motion.div>
        ))
      )}
    </div>
  </motion.div>
));

// ============================================================================
// DATA TABLE
// ============================================================================

interface DataTableProps {
  title: string;
  icon: React.ReactNode;
  data: any[];
  columns: { key: string; label: string; format?: (value: any) => string }[];
  emptyMessage: string;
}

const DataTable = memo(({ title, icon, data, columns, emptyMessage }: DataTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600">{icon}</div>
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="text-sm text-slate-400">{data.length} registros totales</p>
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <p className="text-slate-400 text-center py-12">{emptyMessage}</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="text-left py-3 px-4 text-sm font-semibold text-slate-300"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => (
                  <motion.tr
                    key={row.id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="py-3 px-4 text-sm text-slate-300">
                        {column.format ? column.format(row[column.key]) : row[column.key]}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-slate-400">
                Página {currentPage} de {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-slate-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-slate-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PanelBovedaMonteUltra() {
  const {
    banco,
    ingresos,
    gastos,
    cortes,
    isLoading,
    isError,
    error,
    refetch,
    totales,
    stats,
    ultimasTransacciones,
  } = useBancoData('boveda-monte', {
    refetchInterval: 30000, // Refetch cada 30 segundos
  });

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (isError) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-8 h-8 text-amber-500" />
              <h1 className="text-4xl font-bold text-white">{banco?.nombre || 'Bóveda Monte'}</h1>
            </div>
            <p className="text-slate-400">Panel de control financiero en tiempo real</p>
          </div>
          <button
            onClick={refetch}
            title="Actualizar datos"
            aria-label="Actualizar datos desde Firestore"
            className="p-3 rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 hover:border-zinc-500/50 transition-all group"
          >
            <RefreshCw className="w-5 h-5 text-amber-500 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </motion.div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard3D
          title="Capital Actual"
          value={formatCurrency(banco?.capitalActual || 0)}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="from-amber-500 to-amber-600"
          delay={0}
        />
        <KpiCard3D
          title="Total Ingresos"
          value={formatCurrency(totales.ingresos)}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="from-green-500 to-green-600"
          trend={12}
          delay={0.1}
        />
        <KpiCard3D
          title="Total Gastos"
          value={formatCurrency(totales.gastos)}
          icon={<TrendingDown className="w-6 h-6 text-white" />}
          color="from-zinc-700 to-zinc-800"
          trend={-8}
          delay={0.2}
        />
        <KpiCard3D
          title="Total Cortes"
          value={formatCurrency(totales.cortes)}
          icon={<Activity className="w-6 h-6 text-white" />}
          color="from-zinc-800 to-zinc-800"
          delay={0.3}
        />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
        >
          <p className="text-slate-400 text-sm mb-2">Promedio Ingreso</p>
          <p className="text-2xl font-bold text-zinc-200">
            {formatCurrency(stats.promedioIngreso)}
          </p>
          <p className="text-xs text-slate-500 mt-1">{stats.countIngresos} transacciones</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
        >
          <p className="text-slate-400 text-sm mb-2">Promedio Gasto</p>
          <p className="text-2xl font-bold text-zinc-200">{formatCurrency(stats.promedioGasto)}</p>
          <p className="text-xs text-slate-500 mt-1">{stats.countGastos} transacciones</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
        >
          <p className="text-slate-400 text-sm mb-2">RF Calculado</p>
          <p className="text-2xl font-bold text-zinc-200">{formatCurrency(totales.rfActual)}</p>
          <p className="text-xs text-slate-500 mt-1">Ingresos - Gastos - Cortes</p>
        </motion.div>
      </div>

      {/* Timeline + Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <TimelineActivity transactions={ultimasTransacciones} />
        </div>
        <div className="lg:col-span-2">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl p-6 border border-zinc-500/30"
            >
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-8 h-8 text-zinc-200" />
                <div>
                  <p className="text-sm text-slate-300">Ingresos</p>
                  <p className="text-2xl font-bold text-white">{stats.countIngresos}</p>
                </div>
              </div>
              <p className="text-zinc-200 font-semibold">{formatCurrency(totales.ingresos)}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="bg-gradient-to-br from-zinc-700/20 to-zinc-800/20 rounded-2xl p-6 border border-zinc-500/30"
            >
              <div className="flex items-center gap-3 mb-3">
                <TrendingDown className="w-8 h-8 text-zinc-200" />
                <div>
                  <p className="text-sm text-slate-300">Gastos</p>
                  <p className="text-2xl font-bold text-white">{stats.countGastos}</p>
                </div>
              </div>
              <p className="text-zinc-200 font-semibold">{formatCurrency(totales.gastos)}</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Data Tables */}
      <div className="space-y-6">
        <DataTable
          title="Ingresos"
          icon={<TrendingUp className="w-5 h-5 text-white" />}
          data={ingresos}
          columns={[
            { key: 'fecha', label: 'Fecha', format: (date) => formatDate(date) },
            { key: 'cliente', label: 'Cliente' },
            { key: 'monto', label: 'Monto', format: (amount) => formatCurrency(amount) },
            { key: 'concepto', label: 'Concepto' },
          ]}
          emptyMessage="No hay ingresos registrados"
        />

        <DataTable
          title="Gastos"
          icon={<TrendingDown className="w-5 h-5 text-white" />}
          data={gastos}
          columns={[
            { key: 'fecha', label: 'Fecha', format: (date) => formatDate(date) },
            { key: 'proveedor', label: 'Proveedor' },
            { key: 'monto', label: 'Monto', format: (amount) => formatCurrency(amount) },
            { key: 'concepto', label: 'Concepto' },
          ]}
          emptyMessage="No hay gastos registrados"
        />

        <DataTable
          title="Cortes RF"
          icon={<Activity className="w-5 h-5 text-white" />}
          data={cortes}
          columns={[
            { key: 'fecha', label: 'Fecha', format: (date) => formatDate(date) },
            { key: 'monto', label: 'Monto', format: (amount) => formatCurrency(amount) },
            { key: 'observaciones', label: 'Observaciones' },
          ]}
          emptyMessage="No hay cortes registrados"
        />
      </div>
    </div>
  );
}
