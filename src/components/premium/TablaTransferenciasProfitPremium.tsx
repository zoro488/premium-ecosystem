import React, { useMemo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpDown,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Edit,
  Eye,
  RefreshCw,
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
  XCircle,
} from 'lucide-react';

import { useExchangeRate } from '@/hooks/useExchangeRate';

interface Transferencia {
  id: string;
  fecha: Date | string;
  origenBoveda: string;
  destinoBoveda: string;
  concepto: string;
  referencia?: string;
  montoUSD: number;
  tc?: number;
  estado: 'completada' | 'pendiente' | 'cancelada';
  usuario?: string;
}

interface TablaTransferenciasProfitPremiumProps {
  transferencias: Transferencia[];
  bovedaId: string;
  loading?: boolean;
  onEdit?: (trans: Transferencia) => void;
  onDelete?: (trans: Transferencia) => void;
  onView?: (trans: Transferencia) => void;
}

export const TablaTransferenciasProfitPremium: React.FC<TablaTransferenciasProfitPremiumProps> = ({
  transferencias,
  bovedaId,
  loading = false,
  onEdit,
  onDelete,
  onView,
}) => {
  const { tc: tcActual } = useExchangeRate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'entrada' | 'salida'>('all');
  const [sortBy, setSortBy] = useState<'fecha' | 'monto'>('fecha');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrado y búsqueda
  const filteredTransferencias = useMemo(() => {
    let result = [...transferencias];

    // Filtro por dirección
    if (filter === 'entrada') {
      result = result.filter((t) => t.destinoBoveda === bovedaId);
    } else if (filter === 'salida') {
      result = result.filter((t) => t.origenBoveda === bovedaId);
    }

    // Búsqueda
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.concepto?.toLowerCase().includes(searchLower) ||
          t.origenBoveda?.toLowerCase().includes(searchLower) ||
          t.destinoBoveda?.toLowerCase().includes(searchLower) ||
          t.referencia?.toLowerCase().includes(searchLower)
      );
    }

    // Ordenamiento
    result.sort((a, b) => {
      if (sortBy === 'fecha') {
        const dateA = new Date(a.fecha).getTime();
        const dateB = new Date(b.fecha).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === 'asc' ? a.montoUSD - b.montoUSD : b.montoUSD - a.montoUSD;
      }
    });

    return result;
  }, [transferencias, filter, search, sortBy, sortOrder, bovedaId]);

  // Paginación
  const totalPages = Math.ceil(filteredTransferencias.length / itemsPerPage);
  const paginatedTransferencias = filteredTransferencias.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Estadísticas
  const stats = useMemo(() => {
    const entradas = transferencias.filter((t) => t.destinoBoveda === bovedaId);
    const salidas = transferencias.filter((t) => t.origenBoveda === bovedaId);

    const totalEntradas = entradas.reduce((sum, t) => sum + t.montoUSD, 0);
    const totalSalidas = salidas.reduce((sum, t) => sum + t.montoUSD, 0);
    const balance = totalEntradas - totalSalidas;

    const tcPromedio =
      transferencias.filter((t) => t.tc).reduce((sum, t) => sum + (t.tc || 0), 0) /
        transferencias.filter((t) => t.tc).length || tcActual.rate;

    const conversionTotal = (totalEntradas + totalSalidas) * tcPromedio;

    return {
      totalEntradas,
      totalSalidas,
      balance,
      tcPromedio,
      conversionTotal,
      numEntradas: entradas.length,
      numSalidas: salidas.length,
    };
  }, [transferencias, bovedaId, tcActual.rate]);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const exportToCSV = () => {
    const headers = [
      'Fecha',
      'Dirección',
      'Concepto',
      'Monto USD',
      'TC',
      'Equivalente MXN',
      'Estado',
    ];
    const rows = filteredTransferencias.map((t) => {
      const esEntrada = t.destinoBoveda === bovedaId;
      const tc = t.tc || stats.tcPromedio;
      const montoMXN = t.montoUSD * tc;
      const direccion = esEntrada
        ? `${t.origenBoveda} → ${bovedaId}`
        : `${bovedaId} → ${t.destinoBoveda}`;

      return [
        formatDate(t.fecha),
        direccion,
        t.concepto || 'Sin concepto',
        t.montoUSD.toFixed(2),
        tc.toFixed(4),
        montoMXN.toFixed(2),
        t.estado || 'completada',
      ];
    });

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transferencias_profit_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <RefreshCw className="w-12 h-12 text-purple-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* KPIs Header */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-emerald-400" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-emerald-400 rounded-full"
            />
          </div>
          <div className="space-y-1">
            <p className="text-emerald-400/80 text-sm font-medium">Entradas</p>
            <p className="text-3xl font-bold text-white font-mono">
              +${stats.totalEntradas.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-emerald-400/60 text-xs">{stats.numEntradas} transferencias</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-rose-500/10 to-rose-600/5 backdrop-blur-xl rounded-2xl p-6 border border-rose-500/20"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-8 h-8 text-rose-400" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="w-3 h-3 bg-rose-400 rounded-full"
            />
          </div>
          <div className="space-y-1">
            <p className="text-rose-400/80 text-sm font-medium">Salidas</p>
            <p className="text-3xl font-bold text-white font-mono">
              -${stats.totalSalidas.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-rose-400/60 text-xs">{stats.numSalidas} transferencias</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-purple-400" />
            <div className="text-xs text-purple-400/60">Balance Neto</div>
          </div>
          <div className="space-y-1">
            <p className="text-purple-400/80 text-sm font-medium">Balance</p>
            <p
              className={`text-3xl font-bold font-mono ${stats.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}
            >
              {stats.balance >= 0 ? '+' : ''}$
              {stats.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-purple-400/60 text-xs">USD</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 backdrop-blur-xl rounded-2xl p-6 border border-pink-500/20"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl">🇲🇽</div>
            <div className="text-xs text-pink-400/60">TC: {stats.tcPromedio.toFixed(4)}</div>
          </div>
          <div className="space-y-1">
            <p className="text-pink-400/80 text-sm font-medium">Conversión MXN</p>
            <p className="text-3xl font-bold text-white font-mono">
              ${stats.conversionTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-pink-400/60 text-xs">Total convertido</p>
          </div>
        </motion.div>
      </div>

      {/* Controles */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Búsqueda */}
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Buscar por concepto, origen, destino, referencia..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Todas ({transferencias.length})
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter('entrada')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'entrada'
                ? 'bg-emerald-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Entradas ({stats.numEntradas})
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter('salida')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'salida'
                ? 'bg-rose-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Salidas ({stats.numSalidas})
          </motion.button>
        </div>

        {/* Ordenamiento */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (sortBy === 'fecha') {
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            } else {
              setSortBy('fecha');
              setSortOrder('desc');
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 transition-all"
        >
          <ArrowUpDown className="w-4 h-4" />
          <span className="text-sm font-medium">
            {sortBy === 'fecha' ? 'Fecha' : 'Monto'} {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        </motion.button>

        {/* Export */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-white font-medium transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Exportar CSV</span>
        </motion.button>
      </div>

      {/* Tabla */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left">
                  <div className="flex items-center gap-2 text-white/80 font-semibold">
                    <Calendar className="w-4 h-4" />
                    Fecha
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-white/80 font-semibold">Dirección</th>
                <th className="px-6 py-4 text-left text-white/80 font-semibold">Concepto</th>
                <th className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 text-white/80 font-semibold">
                    <DollarSign className="w-4 h-4" />
                    Monto USD
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-white/80 font-semibold">TC</th>
                <th className="px-6 py-4 text-right text-white/80 font-semibold">
                  Equivalente MXN
                </th>
                <th className="px-6 py-4 text-center text-white/80 font-semibold">Estado</th>
                <th className="px-6 py-4 text-center text-white/80 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {paginatedTransferencias.map((trans, idx) => {
                  const esEntrada = trans.destinoBoveda === bovedaId;
                  const tc = trans.tc || stats.tcPromedio;
                  const montoMXN = trans.montoUSD * tc;
                  const tcDiff = ((tc - stats.tcPromedio) / stats.tcPromedio) * 100;

                  return (
                    <motion.tr
                      key={trans.id || idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className={`border-b border-white/5 hover:bg-white/5 transition-all ${
                        esEntrada ? 'bg-emerald-500/5' : 'bg-rose-500/5'
                      }`}
                    >
                      {/* Fecha */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{formatDate(trans.fecha)}</span>
                          <span className="text-white/40 text-xs">{formatTime(trans.fecha)}</span>
                        </div>
                      </td>

                      {/* Dirección */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                              esEntrada
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {esEntrada ? trans.origenBoveda : trans.destinoBoveda}
                          </span>
                          <ArrowRight
                            className={`w-4 h-4 ${
                              esEntrada ? 'rotate-180 text-emerald-400' : 'text-rose-400'
                            }`}
                          />
                          <span className="text-white/60 text-sm">Profit</span>
                        </div>
                      </td>

                      {/* Concepto */}
                      <td className="px-6 py-4">
                        <p className="text-white text-sm">{trans.concepto || 'Sin concepto'}</p>
                        {trans.referencia && (
                          <p className="text-white/40 text-xs">Ref: {trans.referencia}</p>
                        )}
                      </td>

                      {/* Monto USD */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end">
                          <span
                            className={`text-xl font-bold font-mono ${
                              esEntrada ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {esEntrada ? '+' : '-'}$
                            {trans.montoUSD.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                          <span className="text-white/40 text-xs">USD</span>
                        </div>
                      </td>

                      {/* TC */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span
                            className={`px-3 py-1 rounded-lg font-mono font-bold ${
                              Math.abs(tcDiff) < 0.5
                                ? 'bg-white/10 text-white'
                                : tc > stats.tcPromedio
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {tc.toFixed(4)}
                          </span>
                          {Math.abs(tcDiff) >= 0.5 && (
                            <span
                              className={`text-xs mt-1 ${
                                tc > stats.tcPromedio ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {tc > stats.tcPromedio ? '↗' : '↘'} {tcDiff > 0 ? '+' : ''}
                              {tcDiff.toFixed(2)}%
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Equivalente MXN */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-lg font-bold text-white/80 font-mono">
                            $
                            {montoMXN.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                          <span className="text-white/40 text-xs">MXN</span>
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            trans.estado === 'completada'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : trans.estado === 'pendiente'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {trans.estado === 'completada' && <CheckCircle className="w-3 h-3" />}
                          {trans.estado === 'pendiente' && <Clock className="w-3 h-3" />}
                          {trans.estado === 'cancelada' && <XCircle className="w-3 h-3" />}
                          {trans.estado || 'Completada'}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onView?.(trans)}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onEdit?.(trans)}
                            className="p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-all"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onDelete?.(trans)}
                            className="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-lg transition-all"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>

            {/* Footer con totales */}
            <tfoot className="bg-white/10 border-t-2 border-white/20">
              <tr>
                <td colSpan={3} className="px-6 py-4 text-right font-bold text-white">
                  TOTALES:
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-emerald-400 text-lg font-bold font-mono">
                      +$
                      {stats.totalEntradas.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                    <div className="text-rose-400 text-lg font-bold font-mono">
                      -$
                      {stats.totalSalidas.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                    <div className="text-white text-xl font-bold font-mono border-t border-white/20 pt-2 mt-2">
                      $
                      {stats.balance.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-white font-bold">
                    <div className="text-sm text-white/60">Promedio</div>
                    <div className="text-lg font-mono">{stats.tcPromedio.toFixed(4)}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col items-end">
                    <div className="text-white text-xl font-bold font-mono">
                      $
                      {stats.conversionTotal.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                    <div className="text-white/60 text-sm">Conversión total</div>
                  </div>
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-t border-white/10">
            <p className="text-white/60 text-sm">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} -{' '}
              {Math.min(currentPage * itemsPerPage, filteredTransferencias.length)} de{' '}
              {filteredTransferencias.length} transferencias
            </p>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-all"
              >
                Anterior
              </motion.button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
                  )
                  .map((page, idx, arr) => (
                    <React.Fragment key={page}>
                      {idx > 0 && arr[idx - 1] !== page - 1 && (
                        <span className="text-white/40 px-2">...</span>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          currentPage === page
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {page}
                      </motion.button>
                    </React.Fragment>
                  ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-all"
              >
                Siguiente
              </motion.button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredTransferencias.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 px-6"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowRight className="w-24 h-24 text-white/20 mb-6" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">No hay transferencias</h3>
            <p className="text-white/60 text-center max-w-md">
              {search || filter !== 'all'
                ? 'No se encontraron transferencias con los filtros aplicados'
                : 'Las transferencias de/hacia Profit aparecerán aquí'}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
