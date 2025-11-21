import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowDownRight,
    ArrowUpRight,
    Calendar,
    DollarSign,
    Download,
    Edit3,
    Eye,
    Landmark,
    Package,
    PieChart,
    Plus,
    Search,
    Trash2,
    TrendingDown,
    TrendingUp
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import type { Cliente, Venta } from '../types';

// ═══════════════════════════════════════════════════════════════════════════════
// PANEL VENTAS ULTRA PREMIUM
// Referencias: Pinterest - Sales Dashboard, Revenue Analytics, Financial Tracking
// ═══════════════════════════════════════════════════════════════════════════════

export default function PanelVentasUltra() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [filteredVentas, setFilteredVentas] = useState<Venta[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: ventasData, loading } = useFirestore<Venta>('ventas');
  const { data: clientes } = useFirestore<Cliente>('clientes');

  useEffect(() => {
    if (ventasData) {
      setVentas(ventasData);
      applyFilters(ventasData, searchTerm, filterPeriod);
    }
  }, [ventasData, searchTerm, filterPeriod]);

  const applyFilters = (data: Venta[], search: string, period: string) => {
    let filtered = [...data];

    if (search) {
      filtered = filtered.filter(venta =>
        venta.folio?.toLowerCase().includes(search.toLowerCase()) ||
        venta.cliente?.nombre?.toLowerCase().includes(search.toLowerCase())
      );
    }

    const now = new Date();
    if (period === 'today') {
      filtered = filtered.filter(v => {
        const ventaDate = new Date(v.fecha);
        return ventaDate.toDateString() === now.toDateString();
      });
    } else if (period === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(v => new Date(v.fecha) >= weekAgo);
    } else if (period === 'month') {
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      filtered = filtered.filter(v => new Date(v.fecha) >= monthAgo);
    }

    filtered.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    setFilteredVentas(filtered);
  };

  // KPIs calculados
  const kpis = {
    totalVentas: ventas.length,
    montoTotal: ventas.reduce((sum, v) => sum + (v.montoTotal || 0), 0),
    montoPagado: ventas.reduce((sum, v) => sum + (v.montoPagado || 0), 0),
    montoPendiente: ventas.reduce((sum, v) => sum + ((v.montoTotal || 0) - (v.montoPagado || 0)), 0),
    promedioVenta: ventas.length > 0
      ? ventas.reduce((sum, v) => sum + (v.montoTotal || 0), 0) / ventas.length
      : 0,
    ventasHoy: ventas.filter(v => {
      const ventaDate = new Date(v.fecha);
      const now = new Date();
      return ventaDate.toDateString() === now.toDateString();
    }).length,
  };

  // Distribución por banco
  const distribucionBancos = ventas.reduce((acc, venta) => {
    if (!venta.distribucion) return acc;

    Object.entries(venta.distribucion).forEach(([banco, monto]) => {
      if (!acc[banco]) acc[banco] = 0;
      acc[banco] += monto;
    });

    return acc;
  }, {} as Record<string, number>);

  const bancosColores = {
    utilidades: { color: 'from-zinc-800 to-indigo-600', bg: 'purple' },
    guardadito: { color: 'from-zinc-800 to-zinc-900', bg: 'blue' },
    miel: { color: 'from-yellow-500 to-orange-600', bg: 'yellow' },
    bovedaMonte: { color: 'from-green-500 to-emerald-600', bg: 'green' },
    azteca: { color: 'from-zinc-700 to-zinc-700', bg: 'red' },
    banorte: { color: 'from-indigo-500 to-zinc-800', bg: 'indigo' },
    bovedaUSA: { color: 'from-teal-500 to-zinc-900', bg: 'teal' },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-6 space-y-6"
    >
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HEADER */}
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
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600
                       flex items-center justify-center shadow-lg shadow-green-500/30"
          >
            <DollarSign className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400
                           bg-clip-text text-transparent">
              Ventas
            </h1>
            <p className="text-white/60 mt-1">Control total de ingresos y distribución</p>
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
            Nueva Venta
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl glass-dark border border-white/10
                       text-white font-semibold flex items-center gap-2
                       hover:border-zinc-500/50 transition-all"
          >
            <Download className="w-5 h-5" />
            Exportar
          </motion.button>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* KPI CARDS */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Total Ventas',
            value: kpis.totalVentas,
            icon: Package,
            color: 'purple',
            change: '+15%',
            trend: 'up',
          },
          {
            label: 'Ingresos Totales',
            value: `$${kpis.montoTotal.toLocaleString('es-MX')}`,
            icon: DollarSign,
            color: 'green',
            change: '+22%',
            trend: 'up',
          },
          {
            label: 'Cobrado',
            value: `$${kpis.montoPagado.toLocaleString('es-MX')}`,
            icon: TrendingUp,
            color: 'blue',
            change: '+18%',
            trend: 'up',
          },
          {
            label: 'Por Cobrar',
            value: `$${kpis.montoPendiente.toLocaleString('es-MX')}`,
            icon: TrendingDown,
            color: 'orange',
            change: '-8%',
            trend: 'down',
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
                <div className="flex items-center gap-1">
                  {kpi.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 text-zinc-200" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-zinc-200" />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      kpi.trend === 'up' ? 'text-zinc-200' : 'text-zinc-200'
                    }`}
                  >
                    {kpi.change}
                  </span>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-1">{kpi.value}</h3>
              <p className="text-white/60 text-sm">{kpi.label}</p>
            </div>

            <div
              className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full
                         bg-${kpi.color}-500/20 blur-3xl group-hover:scale-150
                         transition-transform duration-700`}
            />
          </motion.div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* DISTRIBUCIÓN POR BANCO - GRÁFICO */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 rounded-2xl border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900
                           flex items-center justify-center">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Distribución por Banco</h3>
              <p className="text-white/60 text-sm">Ingresos distribuidos</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg glass-dark border border-white/10
                       text-white/80 hover:text-white transition-all"
          >
            <PieChart className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(distribucionBancos).map(([banco, monto], index) => {
            const config = bancosColores[banco as keyof typeof bancosColores] || bancosColores.utilidades;
            const porcentaje = (monto / kpis.montoTotal) * 100;

            return (
              <motion.div
                key={banco}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="glass-dark p-4 rounded-xl border border-white/10 hover:border-white/20
                           transition-all relative overflow-hidden group"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-5
                             group-hover:opacity-10 transition-opacity`}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Landmark className={`w-4 h-4 text-${config.bg}-400`} />
                    <span className="text-sm text-white/60 capitalize">
                      {banco.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>

                  <p className="text-2xl font-bold text-white mb-1">
                    ${monto.toLocaleString('es-MX')}
                  </p>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${porcentaje}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full bg-gradient-to-r ${config.color}`}
                      />
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {porcentaje.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FILTROS */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6 rounded-2xl border border-white/10"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Buscar por folio o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10
                         text-white placeholder-white/40 focus:border-zinc-500/50
                         focus:outline-none transition-all"
            />
          </div>

          <div className="flex gap-2">
            {[
              { value: 'today', label: 'Hoy' },
              { value: 'week', label: 'Semana' },
              { value: 'month', label: 'Mes' },
              { value: 'all', label: 'Todo' },
            ].map((period) => (
              <motion.button
                key={period.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterPeriod(period.value as any)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  filterPeriod === period.value
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                    : 'glass-dark border border-white/10 text-white/60 hover:text-white'
                }`}
              >
                {period.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* TABLA DE VENTAS */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-white/60 font-semibold">Folio</th>
                <th className="px-6 py-4 text-left text-white/60 font-semibold">Cliente</th>
                <th className="px-6 py-4 text-left text-white/60 font-semibold">Fecha</th>
                <th className="px-6 py-4 text-left text-white/60 font-semibold">Monto Total</th>
                <th className="px-6 py-4 text-left text-white/60 font-semibold">Pagado</th>
                <th className="px-6 py-4 text-left text-white/60 font-semibold">Pendiente</th>
                <th className="px-6 py-4 text-left text-white/60 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredVentas.map((venta, index) => (
                  <motion.tr
                    key={venta.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-white">{venta.folio}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/80">{venta.cliente?.nombre}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-white/60">
                        <Calendar className="w-4 h-4" />
                        {new Date(venta.fecha).toLocaleDateString('es-MX')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-white">
                        ${venta.montoTotal?.toLocaleString('es-MX')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-zinc-200 font-semibold">
                        ${venta.montoPagado?.toLocaleString('es-MX') || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-zinc-200 font-semibold">
                        ${((venta.montoTotal || 0) - (venta.montoPagado || 0)).toLocaleString('es-MX')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedVenta(venta)}
                          className="p-2 rounded-lg bg-zinc-800/20 text-zinc-300
                                   hover:bg-zinc-800/30 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg bg-zinc-9000/20 text-zinc-200
                                   hover:bg-zinc-9000/30 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg bg-zinc-9000/20 text-zinc-200
                                   hover:bg-zinc-9000/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredVentas.length === 0 && (
          <div className="p-12 text-center">
            <DollarSign className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-lg">No se encontraron ventas</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
