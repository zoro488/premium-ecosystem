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
  Plus,
  Search,
  Tag,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';

import { calcularBalanceGYA, gyaData, totalesPorDestino } from '../data/gya';
import FormGYA from './FormGYA';

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
  const [showFormGYA, setShowFormGYA] = useState(false);
  const [registroEditando, setRegistroEditando] = useState(null);
  const [registros, setRegistros] = useState(gyaData);

  const balance = calcularBalanceGYA();
  const destinosUnicos = ['Todos', ...Object.keys(totalesPorDestino)];

  // Handler para guardar registro
  const handleSaveRegistro = (registroData) => {
    if (registroEditando) {
      setRegistros(
        registros.map((r) => (r.id === registroEditando.id ? { ...registroData, id: r.id } : r))
      );
    } else {
      setRegistros([...registros, { ...registroData, id: Date.now() }]);
    }
    setShowFormGYA(false);
    setRegistroEditando(null);
  };

  // Filtrado y búsqueda
  const registrosFiltrados = useMemo(() => {
    let filtered = registros;

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
              onClick={() => setShowFormGYA(true)}
              whileHover={{
                scale: 1.08,
                boxShadow: '0 10px 30px rgba(147, 51, 234, 0.3)',
                y: -2,
              }}
              whileTap={{ scale: 0.92 }}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-500/20 border border-purple-400/30 rounded-xl text-purple-300 hover:bg-purple-500/30 transition-all backdrop-blur-sm font-semibold"
            >
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Plus className="w-5 h-5" />
              </motion.div>
              Nuevo Registro
            </motion.button>

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
          {[
            {
              label: 'Total Ingresos',
              value: balance.totalIngresos,
              icon: TrendingUp,
              color: 'green',
              idx: 0,
            },
            {
              label: 'Total Gastos',
              value: balance.totalGastos,
              icon: TrendingDown,
              color: 'red',
              idx: 1,
            },
            {
              label: 'Total Abonos',
              value: balance.totalAbonos,
              icon: DollarSign,
              color: 'blue',
              idx: 2,
            },
            {
              label: 'Balance Final',
              value: balance.balance,
              icon: balance.balance >= 0 ? TrendingUp : AlertCircle,
              color: balance.balance >= 0 ? 'emerald' : 'amber',
              idx: 3,
            },
          ].map(({ label, value, icon: Icon, color, idx }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3 + idx * 0.1,
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }}
              whileHover={{
                scale: 1.05,
                y: -5,
                boxShadow: `0 20px 40px rgba(${
                  color === 'green'
                    ? '34, 197, 94'
                    : color === 'red'
                      ? '239, 68, 68'
                      : color === 'blue'
                        ? '59, 130, 246'
                        : color === 'emerald'
                          ? '16, 185, 129'
                          : '251, 191, 36'
                }, 0.3)`,
              }}
              whileTap={{ scale: 0.95 }}
              className={`bg-gradient-to-br from-${color}-500/20 to-${color}-600/10 backdrop-blur-xl border border-${color}-400/30 rounded-xl p-6 cursor-pointer overflow-hidden relative group`}
            >
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r from-${color}-500/0 via-${color}-500/10 to-${color}-500/0`}
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
              <div className="flex items-center justify-between mb-2 relative z-10">
                <span className={`text-${color}-300 text-sm font-medium`}>{label}</span>
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Icon className={`w-5 h-5 text-${color}-400`} />
                </motion.div>
              </div>
              <motion.p
                className="text-3xl font-bold text-white relative z-10"
                whileHover={{
                  scale: 1.05,
                  textShadow: `0 0 20px rgba(${
                    color === 'green'
                      ? '34, 197, 94'
                      : color === 'red'
                        ? '239, 68, 68'
                        : color === 'blue'
                          ? '59, 130, 246'
                          : color === 'emerald'
                            ? '16, 185, 129'
                            : '251, 191, 36'
                  }, 0.5)`,
                }}
              >
                ${value.toLocaleString()}
              </motion.p>
            </motion.div>
          ))}
        </div>

        {/* Totales por Destino */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <PieChart className="w-5 h-5 text-purple-400" />
            </motion.div>
            <h3 className="text-lg font-semibold text-white">Desglose por Destino</h3>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(totalesPorDestino).map(([destino, total], idx) => (
              <motion.div
                key={destino}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.8 + idx * 0.05,
                  type: 'spring',
                  stiffness: 350,
                  damping: 15,
                }}
                whileHover={{
                  scale: 1.05,
                  y: -3,
                  boxShadow: '0 15px 30px rgba(147, 51, 234, 0.2)',
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4 cursor-pointer group"
              >
                <motion.p
                  className="text-xs text-purple-300 mb-1"
                  whileHover={{ scale: 1.05, x: 2 }}
                >
                  {destino}
                </motion.p>
                <motion.p
                  className="text-xl font-bold text-white"
                  whileHover={{
                    scale: 1.08,
                    textShadow: '0 0 15px rgba(147, 51, 234, 0.5)',
                  }}
                >
                  ${total.toLocaleString()}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Búsqueda y Filtros */}
        <div className="flex gap-4 mb-4">
          <motion.div
            className="flex-1 relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 }}
          >
            <motion.div
              className="absolute left-3 top-1/2 -translate-y-1/2"
              animate={
                searchTerm
                  ? {}
                  : {
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }
              }
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Search className="w-5 h-5 text-purple-400" />
            </motion.div>
            <input
              type="text"
              placeholder="Buscar por origen, destino, concepto u observaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all"
            />
            <AnimatePresence>
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Panel de Filtros */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              style={{ transformOrigin: 'top' }}
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
              <AnimatePresence mode="popLayout">
                {registrosFiltrados.map((registro, idx) => (
                  <motion.tr
                    key={registro.id}
                    layout
                    layoutId={registro.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{
                      layout: { type: 'spring', stiffness: 350, damping: 25 },
                      delay: idx * 0.01,
                    }}
                    className="hover:bg-white/10 transition-colors group"
                  >
                    <motion.td
                      whileHover={{ scale: 1.05, x: 2 }}
                      className="px-4 py-3 text-sm text-white"
                    >
                      <div className="flex items-center gap-2">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.2 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <Calendar className="w-4 h-4 text-purple-400" />
                        </motion.div>
                        {registro.fecha.toLocaleDateString()}
                      </div>
                    </motion.td>
                    <motion.td
                      whileHover={{ scale: 1.05, x: 2 }}
                      className="px-4 py-3 text-sm text-white"
                    >
                      {registro.origenGastoAbono}
                    </motion.td>
                    <motion.td
                      whileHover={{
                        scale: 1.08,
                        textShadow: '0 0 8px rgba(59, 130, 246, 0.8)',
                      }}
                      className="px-4 py-3 text-sm text-blue-300 font-mono"
                    >
                      ${registro.valor.toLocaleString()}
                    </motion.td>
                    <motion.td
                      whileHover={{ scale: 1.05, x: 2 }}
                      className="px-4 py-3 text-sm text-gray-400"
                    >
                      {registro.tc}
                    </motion.td>
                    <motion.td
                      whileHover={{
                        scale: 1.08,
                        textShadow: '0 0 8px rgba(16, 185, 129, 0.8)',
                      }}
                      className="px-4 py-3 text-sm text-emerald-400 font-semibold"
                    >
                      ${registro.pesos.toLocaleString()}
                    </motion.td>
                    <motion.td whileHover={{ scale: 1.05 }} className="px-4 py-3">
                      <motion.span
                        whileHover={{
                          scale: 1.1,
                          boxShadow: '0 0 15px rgba(168, 85, 247, 0.6)',
                        }}
                        className="inline-block px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300"
                      >
                        {registro.destino}
                      </motion.span>
                    </motion.td>
                    <motion.td
                      whileHover={{ scale: 1.02, x: 2 }}
                      className="px-4 py-3 text-sm text-white max-w-xs truncate"
                    >
                      {registro.concepto}
                    </motion.td>
                    <motion.td
                      whileHover={{ scale: 1.02, x: 2 }}
                      className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate"
                    >
                      {registro.observaciones || '-'}
                    </motion.td>
                    <motion.td whileHover={{ scale: 1.05 }} className="px-4 py-3">
                      <motion.span
                        whileHover={{
                          scale: 1.15,
                          rotate: [0, -5, 5, 0],
                          boxShadow: [
                            '0 0 0px transparent',
                            `0 0 15px ${
                              registro.tipo === 'Ingreso'
                                ? 'rgba(34, 197, 94, 0.6)'
                                : registro.tipo === 'Gasto'
                                  ? 'rgba(239, 68, 68, 0.6)'
                                  : 'rgba(59, 130, 246, 0.6)'
                            }`,
                          ],
                        }}
                        transition={{ duration: 0.3 }}
                        className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${
                          registro.tipo === 'Ingreso'
                            ? 'bg-green-500/20 text-green-300'
                            : registro.tipo === 'Gasto'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {registro.tipo}
                      </motion.span>
                    </motion.td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal Formulario */}
      <AnimatePresence>
        {showFormGYA && (
          <FormGYA
            onClose={() => {
              setShowFormGYA(false);
              setRegistroEditando(null);
            }}
            onSave={handleSaveRegistro}
            registroExistente={registroEditando}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
