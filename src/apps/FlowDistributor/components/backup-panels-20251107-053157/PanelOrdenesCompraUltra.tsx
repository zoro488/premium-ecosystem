import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar, CheckCircle2, Clock,
  DollarSign,
  Download,
  Edit3,
  Eye,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Trash2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import type { OrdenCompra } from '../types';

// ═══════════════════════════════════════════════════════════════════════════════
// PANEL ÓRDENES DE COMPRA ULTRA PREMIUM
// Referencias: Pinterest - Glassmorphism Tables, SaaS Data Tables, Modern ERP
// ═══════════════════════════════════════════════════════════════════════════════

export default function PanelOrdenesCompraUltra() {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [filteredOrdenes, setFilteredOrdenes] = useState<OrdenCompra[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrden, setSelectedOrden] = useState<OrdenCompra | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const { data: ordenesData, loading } = useFirestore<OrdenCompra>('ordenesCompra');

  useEffect(() => {
    if (ordenesData) {
      setOrdenes(ordenesData);
      applyFilters(ordenesData, searchTerm, filterStatus);
    }
  }, [ordenesData, searchTerm, filterStatus]);

  const applyFilters = (data: OrdenCompra[], search: string, status: string) => {
    let filtered = [...data];

    if (search) {
      filtered = filtered.filter(orden =>
        orden.folio?.toLowerCase().includes(search.toLowerCase()) ||
        orden.distribuidor?.nombre?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter(orden => orden.estado === status);
    }

    filtered.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    setFilteredOrdenes(filtered);
  };

  // KPIs calculados
  const kpis = {
    total: ordenes.length,
    pendientes: ordenes.filter(o => o.estado === 'pendiente').length,
    parciales: ordenes.filter(o => o.estado === 'parcial').length,
    completas: ordenes.filter(o => o.estado === 'completo').length,
    montoTotal: ordenes.reduce((sum, o) => sum + (o.monto || 0), 0),
    montoPendiente: ordenes
      .filter(o => o.estado !== 'completo')
      .reduce((sum, o) => sum + (o.montoPendiente || 0), 0),
  };

  const statusConfig = {
    pendiente: { color: 'yellow', icon: Clock, text: 'Pendiente' },
    parcial: { color: 'blue', icon: AlertCircle, text: 'Parcial' },
    completo: { color: 'green', icon: CheckCircle2, text: 'Completo' },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-6 space-y-6"
    >
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HEADER CON TÍTULO Y ACCIONES RÁPIDAS */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600
                       flex items-center justify-center shadow-lg shadow-purple-500/30"
          >
            <ShoppingCart className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400
                           bg-clip-text text-transparent">
              Órdenes de Compra
            </h1>
            <p className="text-white/60 mt-1">Gestión completa de OCs y pagos</p>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600
                       text-white font-semibold shadow-lg shadow-green-500/30
                       flex items-center gap-2 hover:shadow-green-500/50 transition-all"
          >
            <Plus className="w-5 h-5" />
            Nueva OC
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl glass-dark border border-white/10
                       text-white font-semibold flex items-center gap-2
                       hover:border-purple-500/50 transition-all"
          >
            <Download className="w-5 h-5" />
            Exportar
          </motion.button>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* KPI CARDS - GLASSMORPHISM 3D */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Total OCs',
            value: kpis.total,
            icon: ShoppingCart,
            color: 'purple',
            change: '+12%',
          },
          {
            label: 'Pendientes',
            value: kpis.pendientes,
            icon: Clock,
            color: 'yellow',
            change: '-5%',
          },
          {
            label: 'Monto Total',
            value: `$${kpis.montoTotal.toLocaleString('es-MX')}`,
            icon: DollarSign,
            color: 'green',
            change: '+8%',
          },
          {
            label: 'Pendiente Pago',
            value: `$${kpis.montoPendiente.toLocaleString('es-MX')}`,
            icon: AlertCircle,
            color: 'red',
            change: '-3%',
          },
        ].map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass-card p-6 rounded-2xl border border-white/10
                       hover:border-white/20 transition-all relative overflow-hidden group"
          >
            {/* Background gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br from-${kpi.color}-500/10 to-transparent
                         opacity-0 group-hover:opacity-100 transition-opacity`}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${kpi.color}-500 to-${kpi.color}-600
                             flex items-center justify-center shadow-lg shadow-${kpi.color}-500/30`}
                >
                  <kpi.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-400">{kpi.change}</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-1">{kpi.value}</h3>
              <p className="text-white/60 text-sm">{kpi.label}</p>
            </div>

            {/* Glow effect */}
            <div
              className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full
                         bg-${kpi.color}-500/20 blur-3xl group-hover:scale-150
                         transition-transform duration-700`}
            />
          </motion.div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FILTROS Y BÚSQUEDA */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 rounded-2xl border border-white/10"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Buscar por folio o distribuidor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10
                         text-white placeholder-white/40 focus:border-purple-500/50
                         focus:outline-none transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {['all', 'pendiente', 'parcial', 'completo'].map((status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterStatus(status)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  filterStatus === status
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                    : 'glass-dark border border-white/10 text-white/60 hover:text-white'
                }`}
              >
                {status === 'all' ? 'Todas' : statusConfig[status as keyof typeof statusConfig].text}
              </motion.button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2 glass-dark p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-purple-500 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Tabla
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'cards'
                  ? 'bg-purple-500 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Tarjetas
            </button>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* TABLA DE ÓRDENES - ULTRA PREMIUM */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {viewMode === 'table' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl border border-white/10 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-white/60 font-semibold">Folio</th>
                  <th className="px-6 py-4 text-left text-white/60 font-semibold">Distribuidor</th>
                  <th className="px-6 py-4 text-left text-white/60 font-semibold">Fecha</th>
                  <th className="px-6 py-4 text-left text-white/60 font-semibold">Monto</th>
                  <th className="px-6 py-4 text-left text-white/60 font-semibold">Pagado</th>
                  <th className="px-6 py-4 text-left text-white/60 font-semibold">Estado</th>
                  <th className="px-6 py-4 text-left text-white/60 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredOrdenes.map((orden, index) => {
                    const StatusIcon = statusConfig[orden.estado as keyof typeof statusConfig].icon;
                    const statusColor = statusConfig[orden.estado as keyof typeof statusConfig].color;

                    return (
                      <motion.tr
                        key={orden.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="font-semibold text-white">{orden.folio}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white/80">{orden.distribuidor?.nombre}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-white/60">
                            <Calendar className="w-4 h-4" />
                            {new Date(orden.fecha).toLocaleDateString('es-MX')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-white">
                            ${orden.monto.toLocaleString('es-MX')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-green-400 font-semibold">
                            ${orden.montoPagado?.toLocaleString('es-MX') || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg
                                       bg-${statusColor}-500/20 text-${statusColor}-400
                                       border border-${statusColor}-500/30 font-semibold`}
                          >
                            <StatusIcon className="w-4 h-4" />
                            {statusConfig[orden.estado as keyof typeof statusConfig].text}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setSelectedOrden(orden)}
                              className="p-2 rounded-lg bg-blue-500/20 text-blue-400
                                       hover:bg-blue-500/30 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg bg-purple-500/20 text-purple-400
                                       hover:bg-purple-500/30 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg bg-red-500/20 text-red-400
                                       hover:bg-red-500/30 transition-colors"
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
            </table>
          </div>

          {filteredOrdenes.length === 0 && (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 text-lg">No se encontraron órdenes</p>
            </div>
          )}
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* VISTA DE TARJETAS */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrdenes.map((orden, index) => {
            const StatusIcon = statusConfig[orden.estado as keyof typeof statusConfig].icon;
            const statusColor = statusConfig[orden.estado as keyof typeof statusConfig].color;

            return (
              <motion.div
                key={orden.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="glass-card p-6 rounded-2xl border border-white/10
                           hover:border-white/20 transition-all relative overflow-hidden group"
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent
                               opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-sm text-white/60">Folio</span>
                      <p className="text-xl font-bold text-white">{orden.folio}</p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg
                                 bg-${statusColor}-500/20 text-${statusColor}-400
                                 border border-${statusColor}-500/30`}
                    >
                      <StatusIcon className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <span className="text-sm text-white/60">Distribuidor</span>
                      <p className="text-white font-semibold">{orden.distribuidor?.nombre}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-sm text-white/60">Monto</span>
                        <p className="text-white font-semibold">
                          ${orden.monto.toLocaleString('es-MX')}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-white/60">Pagado</span>
                        <p className="text-green-400 font-semibold">
                          ${orden.montoPagado?.toLocaleString('es-MX') || 0}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-white/60">Fecha</span>
                      <p className="text-white font-semibold">
                        {new Date(orden.fecha).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-white/10">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedOrden(orden)}
                      className="flex-1 py-2 rounded-lg bg-blue-500/20 text-blue-400
                               hover:bg-blue-500/30 transition-colors flex items-center
                               justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 py-2 rounded-lg bg-purple-500/20 text-purple-400
                               hover:bg-purple-500/30 transition-colors flex items-center
                               justify-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Editar
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
