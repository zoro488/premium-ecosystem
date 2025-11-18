import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { motion } from 'framer-motion';
import {
  Calendar,
  DollarSign,
  Download,
  Filter,
  Plus,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import { ChronosButton, ChronosCard, ChronosKPI, ChronosTable } from '@/components/chronos-ui';
import { useBancoData } from '@/hooks/useChronosData';

// Configuración de cada banco (colores, nombres, íconos)
const BANCO_CONFIG = {
  monte: {
    nombre: 'Bóveda Monte',
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    icon: '🏔️',
  },
  azteca: {
    nombre: 'Banco Azteca Ultra',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-600',
    icon: '🏛️',
  },
  banorte: {
    nombre: 'Banorte Premium',
    color: 'red',
    gradient: 'from-red-500 to-rose-600',
    icon: '🏦',
  },
  santander: {
    nombre: 'Santander Elite',
    color: 'red',
    gradient: 'from-red-600 to-pink-600',
    icon: '🔴',
  },
  bbva: {
    nombre: 'BBVA Platinum',
    color: 'blue',
    gradient: 'from-blue-600 to-indigo-600',
    icon: '💙',
  },
  hsbc: {
    nombre: 'HSBC Premier',
    color: 'red',
    gradient: 'from-red-700 to-rose-700',
    icon: '🔺',
  },
  scotiabank: {
    nombre: 'Scotiabank Select',
    color: 'red',
    gradient: 'from-red-500 to-orange-600',
    icon: '🍁',
  },
};

type TablaType = 'ingresos' | 'gastos' | 'cortes' | 'transferencias';

export default function UniversalBankView() {
  const { bancoId } = useParams<{ bancoId: string }>();
  const [tablaActiva, setTablaActiva] = useState<TablaType>('ingresos');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const config = BANCO_CONFIG[bancoId as keyof typeof BANCO_CONFIG] || BANCO_CONFIG.monte;
  const { data, loading, error, totales } = useBancoData(bancoId || 'monte');

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-16 h-16 border-4 border-chronos-cyan border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <ChronosCard className="max-w-md">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Error de Conexión</h2>
            <p className="text-gray-400">{error}</p>
          </div>
        </ChronosCard>
      </div>
    );
  }

  const tablaData = data[tablaActiva] || [];

  const columnasIngresos = [
    { key: 'fecha', label: 'Fecha' },
    { key: 'concepto', label: 'Concepto' },
    { key: 'monto', label: 'Monto', format: (v: number) => `$${v.toLocaleString()}` },
    { key: 'metodoPago', label: 'Método' },
    { key: 'responsable', label: 'Responsable' },
  ];

  const columnasGastos = [
    { key: 'fecha', label: 'Fecha' },
    { key: 'concepto', label: 'Concepto' },
    { key: 'monto', label: 'Monto', format: (v: number) => `$${v.toLocaleString()}` },
    { key: 'categoria', label: 'Categoría' },
    { key: 'proveedor', label: 'Proveedor' },
  ];

  const columnasCortes = [
    { key: 'fecha', label: 'Fecha' },
    { key: 'turno', label: 'Turno' },
    { key: 'ventasEfectivo', label: 'Efectivo', format: (v: number) => `$${v.toLocaleString()}` },
    { key: 'ventasTarjeta', label: 'Tarjeta', format: (v: number) => `$${v.toLocaleString()}` },
    { key: 'total', label: 'Total', format: (v: number) => `$${v.toLocaleString()}` },
  ];

  const columnasTransferencias = [
    { key: 'fecha', label: 'Fecha' },
    { key: 'origen', label: 'Origen' },
    { key: 'destino', label: 'Destino' },
    { key: 'monto', label: 'Monto', format: (v: number) => `$${v.toLocaleString()}` },
    { key: 'concepto', label: 'Concepto' },
  ];

  const columnasPorTabla = {
    ingresos: columnasIngresos,
    gastos: columnasGastos,
    cortes: columnasCortes,
    transferencias: columnasTransferencias,
  };

  return (
    <div className="min-h-screen bg-black p-6 space-y-6">
      {/* Header con gradiente del banco */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl"
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-20`} />
        <div className="relative p-8 backdrop-blur-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-6xl">{config.icon}</span>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{config.nombre}</h1>
                <p className="text-gray-400">Sistema de Gestión Financiera</p>
              </div>
            </div>
            <div className="flex gap-3">
              <ChronosButton variant="outline" size="sm">
                <Download className="w-4 h-4" />
                Exportar
              </ChronosButton>
              <ChronosButton variant="outline" size="sm">
                <Filter className="w-4 h-4" />
                Filtrar
              </ChronosButton>
              <ChronosButton variant="primary" size="sm" onClick={() => setMostrarFormulario(true)}>
                <Plus className="w-4 h-4" />
                Nuevo Registro
              </ChronosButton>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ChronosKPI
          label="Total Ingresos"
          value={totales.ingresos}
          format="currency"
          trend="up"
          trendValue={12.5}
          icon={<TrendingUp className="w-6 h-6" />}
          color={config.color}
        />
        <ChronosKPI
          label="Total Gastos"
          value={totales.gastos}
          format="currency"
          trend="down"
          trendValue={8.3}
          icon={<TrendingDown className="w-6 h-6" />}
          color="red"
        />
        <ChronosKPI
          label="Balance Actual"
          value={totales.balance}
          format="currency"
          trend={totales.balance > 0 ? 'up' : 'down'}
          trendValue={15.2}
          icon={<DollarSign className="w-6 h-6" />}
          color={totales.balance > 0 ? 'emerald' : 'red'}
        />
        <ChronosKPI
          label="Último Corte"
          value={totales.ultimoCorte || 0}
          format="currency"
          icon={<Calendar className="w-6 h-6" />}
          color="purple"
        />
      </div>

      {/* Pestañas de tablas */}
      <ChronosCard>
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
          {(['ingresos', 'gastos', 'cortes', 'transferencias'] as TablaType[]).map((tabla) => (
            <button
              key={tabla}
              onClick={() => setTablaActiva(tabla)}
              className={`px-6 py-3 rounded-lg font-semibold capitalize transition-all ${
                tablaActiva === tabla
                  ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg shadow-${config.color}-500/50`
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tabla}
              <span className="ml-2 text-xs opacity-75">({tablaData.length})</span>
            </button>
          ))}
        </div>

        <ChronosTable
          data={tablaData}
          columns={columnasPorTabla[tablaActiva]}
          emptyMessage={`No hay registros de ${tablaActiva} aún`}
        />
      </ChronosCard>

      {/* Modal de formulario (placeholder) */}
      {mostrarFormulario && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setMostrarFormulario(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl"
          >
            <ChronosCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Nuevo Registro - {tablaActiva}</h2>
                <button
                  onClick={() => setMostrarFormulario(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="text-center py-12">
                <p className="text-gray-400">Formulario en desarrollo...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Este modal contendrá el formulario específico para {tablaActiva}
                </p>
              </div>
            </ChronosCard>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
