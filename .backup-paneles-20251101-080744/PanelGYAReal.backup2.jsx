import { useMemo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Download,
  Filter,
  PieChart,
  Search,
  Tag,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';

import { calcularBalanceGYA, gyaData, totalesPorDestino } from '../data/gya';

/**
 * PANEL GYA (GASTOS Y ABONOS) - VERSIÓN REAL CON DATOS DEL EXCEL
 * Replica EXACTA de la tabla del Excel con todos los datos reales
 */

export default function PanelGYAReal() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroDestino, setFiltroDestino] = useState('Todos');
  const [sortConfig, setSortConfig] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const balance = calcularBalanceGYA();
  const destinosUnicos = ['Todos', ...Object.keys(totalesPorDestino)];

  // Filtrado y búsqueda
  const registrosFiltrados = useMemo(() => {
    let filtered = gyaData;

    // Búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.origenGastoAbono.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.destino.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (r.observaciones && r.observaciones.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtro tipo
    if (filtroTipo !== 'Todos') {
      filtered = filtered.filter((r) => r.tipo === filtroTipo);
    }

    // Filtro destino
    if (filtroDestino !== 'Todos') {
      filtered = filtered.filter((r) => r.destino === filtroDestino);
    }

    // Ordenamiento
    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [searchTerm, filtroTipo, filtroDestino, sortConfig]);

  // Cálculos de totales filtrados
  const totalesFiltrados = useMemo(() => {
    const ingresos = registrosFiltrados
      .filter((r) => r.tipo === 'Ingreso')
      .reduce((sum, r) => sum + r.pesos, 0);
    const gastos = registrosFiltrados
      .filter((r) => r.tipo === 'Gasto')
      .reduce((sum, r) => sum + r.pesos, 0);
    const abonos = registrosFiltrados
      .filter((r) => r.tipo === 'Abono')
      .reduce((sum, r) => sum + r.pesos, 0);

    return { ingresos, gastos, abonos, balance: ingresos - gastos + abonos };
  }, [registrosFiltrados]);

  const handleSort = (key) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  const exportToCSV = () => {
    const headers = [
      'Fecha',
      'Origen del Gasto o Abono',
      'Valor',
      'TC',
      'Pesos',
      'Destino',
      'Concepto',
      'Observaciones',
      'Tipo',
    ];

    const rows = registrosFiltrados.map((r) => [
      r.fecha.toLocaleDateString(),
      r.origenGastoAbono,
      r.valor,
      r.tc,
      r.pesos,
      r.destino,
      r.concepto,
      r.observaciones || '',
      r.tipo,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gya_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">💰 Panel GYA</h1>
            <p className="text-purple-300">Gastos y Abonos - Control Financiero</p>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-lg text-green-300 hover:bg-green-500/30 transition-all"
            >
              <Download className="w-5 h-5" />
              Exportar CSV
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-lg text-purple-300 hover:bg-purple-500/30 transition-all"
            >
              <Filter className="w-5 h-5" />
              Filtros{' '}
              {showFilters ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Balance General */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-xl border border-green-400/30 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-300 text-sm font-medium">Total Ingresos</span>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">
              ${balance.totalIngresos.toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-red-500/20 to-red-600/10 backdrop-blur-xl border border-red-400/30 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-300 text-sm font-medium">Total Gastos</span>
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-3xl font-bold text-white">${balance.totalGastos.toLocaleString()}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl border border-blue-400/30 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-300 text-sm font-medium">Total Abonos</span>
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">${balance.totalAbonos.toLocaleString()}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className={`bg-gradient-to-br backdrop-blur-xl border rounded-xl p-6 ${
              balance.balance >= 0
                ? 'from-emerald-500/20 to-emerald-600/10 border-emerald-400/30'
                : 'from-amber-500/20 to-amber-600/10 border-amber-400/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-sm font-medium ${
                  balance.balance >= 0 ? 'text-emerald-300' : 'text-amber-300'
                }`}
              >
                Balance Final
              </span>
              {balance.balance >= 0 ? (
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-400" />
              )}
            </div>
            <p className="text-3xl font-bold text-white">${balance.balance.toLocaleString()}</p>
          </motion.div>
        </div>

        {/* Totales por Destino */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Desglose por Destino</h3>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(totalesPorDestino).map(([destino, total]) => (
              <div
                key={destino}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4"
              >
                <p className="text-xs text-purple-300 mb-1">{destino}</p>
                <p className="text-xl font-bold text-white">${total.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Búsqueda y Filtros */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Buscar por origen, destino, concepto u observaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            />
          </div>
        </div>

        {/* Panel de Filtros */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 mb-4"
            >
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-purple-300 mb-2 block">Tipo de Registro</label>
                  <select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Ingreso">Ingresos</option>
                    <option value="Gasto">Gastos</option>
                    <option value="Abono">Abonos</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-purple-300 mb-2 block">Destino</label>
                  <select
                    value={filtroDestino}
                    onChange={(e) => setFiltroDestino(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                  >
                    {destinosUnicos.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFiltroTipo('Todos');
                      setFiltroDestino('Todos');
                      setSortConfig(null);
                    }}
                    className="w-full px-4 py-2 bg-red-500/20 border border-red-400/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Limpiar Filtros
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tarjetas de Resumen Filtradas */}
        <div className="grid grid-cols-4 gap-4">
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl border border-blue-400/30 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-300 text-sm">Registros</span>
              <Tag className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{registrosFiltrados.length}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-xl border border-green-400/30 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-300 text-sm">Ingresos (filtrados)</span>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              ${totalesFiltrados.ingresos.toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-red-500/20 to-red-600/10 backdrop-blur-xl border border-red-400/30 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-300 text-sm">Gastos (filtrados)</span>
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              ${totalesFiltrados.gastos.toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className={`bg-gradient-to-br backdrop-blur-xl border rounded-xl p-4 ${
              totalesFiltrados.balance >= 0
                ? 'from-emerald-500/20 to-emerald-600/10 border-emerald-400/30'
                : 'from-amber-500/20 to-amber-600/10 border-amber-400/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-sm ${
                  totalesFiltrados.balance >= 0 ? 'text-emerald-300' : 'text-amber-300'
                }`}
              >
                Balance (filtrado)
              </span>
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">
              ${totalesFiltrados.balance.toLocaleString()}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Tabla GYA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                {[
                  { key: 'fecha', label: 'Fecha' },
                  { key: 'origenGastoAbono', label: 'Origen' },
                  { key: 'valor', label: 'Valor' },
                  { key: 'tc', label: 'TC' },
                  { key: 'pesos', label: 'Pesos' },
                  { key: 'destino', label: 'Destino' },
                  { key: 'concepto', label: 'Concepto' },
                  { key: 'observaciones', label: 'Observaciones' },
                  { key: 'tipo', label: 'Tipo' },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-4 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      {sortConfig?.key === col.key && (
                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {registrosFiltrados.map((registro, idx) => (
                <motion.tr
                  key={registro.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.01 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-white">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      {registro.fecha.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{registro.origenGastoAbono}</td>
                  <td className="px-4 py-3 text-sm text-blue-300 font-mono">
                    ${registro.valor.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{registro.tc}</td>
                  <td className="px-4 py-3 text-sm text-emerald-400 font-semibold">
                    ${registro.pesos.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300">
                      {registro.destino}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white max-w-xs truncate">
                    {registro.concepto}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate">
                    {registro.observaciones || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-semibold ${
                        registro.tipo === 'Ingreso'
                          ? 'bg-green-500/20 text-green-300'
                          : registro.tipo === 'Gasto'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {registro.tipo}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
