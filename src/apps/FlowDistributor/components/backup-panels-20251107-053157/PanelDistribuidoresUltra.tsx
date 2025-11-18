import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    Building2,
    DollarSign,
    Download,
    Edit3,
    Eye,
    Mail, MapPin,
    Package,
    Phone,
    Plus,
    Search,
    Trash2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import type { Distribuidor, OrdenCompra } from '../types';

// ═══════════════════════════════════════════════════════════════════════════════
// PANEL DISTRIBUIDORES ULTRA PREMIUM
// Referencias: Pinterest - CRM Dashboard, Supplier Management, Business Partners
// ═══════════════════════════════════════════════════════════════════════════════

export default function PanelDistribuidoresUltra() {
  const [distribuidores, setDistribuidores] = useState<Distribuidor[]>([]);
  const [filteredDistribuidores, setFilteredDistribuidores] = useState<Distribuidor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistribuidor, setSelectedDistribuidor] = useState<Distribuidor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  const { data: distribuidoresData, loading } = useFirestore<Distribuidor>('distribuidores');
  const { data: ordenesCompra } = useFirestore<OrdenCompra>('ordenesCompra');

  useEffect(() => {
    if (distribuidoresData) {
      const distribuidoresConStats = distribuidoresData.map(dist => {
        const ocDistribuidor = ordenesCompra?.filter(oc => oc.distribuidorId === dist.id) || [];

        return {
          ...dist,
          totalOrdenes: ocDistribuidor.length,
          totalCompras: ocDistribuidor.reduce((sum, oc) => sum + (oc.monto || 0), 0),
          totalPagado: ocDistribuidor.reduce((sum, oc) => sum + (oc.montoPagado || 0), 0),
          deudaActual: ocDistribuidor.reduce((sum, oc) =>
            sum + ((oc.monto || 0) - (oc.montoPagado || 0)), 0
          ),
          ordenesPendientes: ocDistribuidor.filter(oc => oc.estado !== 'completo').length,
        };
      });

      setDistribuidores(distribuidoresConStats);
      applyFilters(distribuidoresConStats, searchTerm);
    }
  }, [distribuidoresData, ordenesCompra, searchTerm]);

  const applyFilters = (data: Distribuidor[], search: string) => {
    let filtered = [...data];

    if (search) {
      filtered = filtered.filter(dist =>
        dist.nombre?.toLowerCase().includes(search.toLowerCase()) ||
        dist.contacto?.toLowerCase().includes(search.toLowerCase()) ||
        dist.telefono?.includes(search)
      );
    }

    filtered.sort((a, b) => (b.deudaActual || 0) - (a.deudaActual || 0));
    setFilteredDistribuidores(filtered);
  };

  // KPIs calculados
  const kpis = {
    totalDistribuidores: distribuidores.length,
    distribuidoresActivos: distribuidores.filter(d => (d.totalOrdenes || 0) > 0).length,
    totalCompras: distribuidores.reduce((sum, d) => sum + (d.totalCompras || 0), 0),
    totalDeuda: distribuidores.reduce((sum, d) => sum + (d.deudaActual || 0), 0),
    totalPagado: distribuidores.reduce((sum, d) => sum + (d.totalPagado || 0), 0),
    ordenesTotales: distribuidores.reduce((sum, d) => sum + (d.totalOrdenes || 0), 0),
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
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900
                       flex items-center justify-center shadow-lg shadow-blue-500/30"
          >
            <Building2 className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-zinc-700 to-zinc-700
                           bg-clip-text text-transparent">
              Distribuidores
            </h1>
            <p className="text-white/60 mt-1">Gestión de proveedores y órdenes</p>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-900
                       text-white font-semibold shadow-lg shadow-blue-500/30
                       flex items-center gap-2 hover:shadow-blue-500/50 transition-all"
          >
            <Plus className="w-5 h-5" />
            Nuevo Distribuidor
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl glass-dark border border-white/10
                       text-white font-semibold flex items-center gap-2
                       hover:border-zinc-700/50 transition-all"
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
            label: 'Total Distribuidores',
            value: kpis.totalDistribuidores,
            icon: Building2,
            color: 'blue',
            subtitle: `${kpis.distribuidoresActivos} activos`,
          },
          {
            label: 'Compras Totales',
            value: `$${kpis.totalCompras.toLocaleString('es-MX')}`,
            icon: Package,
            color: 'purple',
            subtitle: `${kpis.ordenesTotales} órdenes`,
          },
          {
            label: 'Total Pagado',
            value: `$${kpis.totalPagado.toLocaleString('es-MX')}`,
            icon: DollarSign,
            color: 'green',
            subtitle: 'Pagos realizados',
          },
          {
            label: 'Deuda Total',
            value: `$${kpis.totalDeuda.toLocaleString('es-MX')}`,
            icon: AlertCircle,
            color: 'red',
            subtitle: 'Por pagar',
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
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${kpi.color}-500 to-${kpi.color}-600
                           flex items-center justify-center shadow-lg shadow-${kpi.color}-500/30 mb-4`}
              >
                <kpi.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-1">{kpi.value}</h3>
              <p className="text-white/60 text-sm mb-1">{kpi.label}</p>
              <p className="text-white/40 text-xs">{kpi.subtitle}</p>
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
      {/* BÚSQUEDA Y VISTA */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 rounded-2xl border border-white/10"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Buscar distribuidor por nombre, contacto o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10
                         text-white placeholder-white/40 focus:border-zinc-700/50
                         focus:outline-none transition-all"
            />
          </div>

          <div className="flex gap-2 glass-dark p-1 rounded-xl">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'cards'
                  ? 'bg-zinc-800 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Tarjetas
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-zinc-800 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Tabla
            </button>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* VISTA DE TARJETAS */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDistribuidores.map((distribuidor, index) => (
            <motion.div
              key={distribuidor.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-card p-6 rounded-2xl border border-white/10
                         hover:border-white/20 transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 to-transparent
                             opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                {/* Header de tarjeta */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900
                                   flex items-center justify-center text-white font-bold text-lg">
                      {distribuidor.nombre?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{distribuidor.nombre}</h3>
                      <p className="text-sm text-white/60">{distribuidor.contacto}</p>
                    </div>
                  </div>

                  {(distribuidor.deudaActual || 0) > 0 && (
                    <span className="px-2 py-1 rounded-lg bg-zinc-9000/20 text-zinc-200
                                   border border-zinc-500/30 text-xs font-semibold">
                      Deuda
                    </span>
                  )}
                </div>

                {/* Info de contacto */}
                <div className="space-y-2 mb-4 pb-4 border-b border-white/10">
                  {distribuidor.telefono && (
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <Phone className="w-4 h-4" />
                      {distribuidor.telefono}
                    </div>
                  )}
                  {distribuidor.email && (
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <Mail className="w-4 h-4" />
                      {distribuidor.email}
                    </div>
                  )}
                  {distribuidor.direccion && (
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <MapPin className="w-4 h-4" />
                      {distribuidor.direccion}
                    </div>
                  )}
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="glass-dark p-3 rounded-lg">
                    <p className="text-xs text-white/60 mb-1">Total Compras</p>
                    <p className="text-lg font-bold text-white">
                      ${(distribuidor.totalCompras || 0).toLocaleString('es-MX')}
                    </p>
                  </div>
                  <div className="glass-dark p-3 rounded-lg">
                    <p className="text-xs text-white/60 mb-1">Total Pagado</p>
                    <p className="text-lg font-bold text-zinc-200">
                      ${(distribuidor.totalPagado || 0).toLocaleString('es-MX')}
                    </p>
                  </div>
                  <div className="glass-dark p-3 rounded-lg">
                    <p className="text-xs text-white/60 mb-1">Deuda Actual</p>
                    <p className="text-lg font-bold text-zinc-200">
                      ${(distribuidor.deudaActual || 0).toLocaleString('es-MX')}
                    </p>
                  </div>
                  <div className="glass-dark p-3 rounded-lg">
                    <p className="text-xs text-white/60 mb-1">Órdenes</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-white">{distribuidor.totalOrdenes || 0}</p>
                      {(distribuidor.ordenesPendientes || 0) > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded bg-zinc-9000/20 text-zinc-200">
                          {distribuidor.ordenesPendientes} pend.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDistribuidor(distribuidor)}
                    className="flex-1 py-2 rounded-lg bg-zinc-800/20 text-zinc-300
                             hover:bg-zinc-800/30 transition-colors flex items-center
                             justify-center gap-2 font-semibold"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalles
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-2 rounded-lg bg-zinc-9000/20 text-zinc-200
                             hover:bg-zinc-9000/30 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full
                             bg-zinc-800/20 blur-3xl group-hover:scale-150
                             transition-transform duration-700" />
            </motion.div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* VISTA DE TABLA */}
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
                  <th className="px-6 py-4 text-left text-white/60 font-semibold">Distribuidor</th>
                  <th className="px-6 py-4 text-left text-white/60 font-semibold">Contacto</th>
                  <th className="px-6 py-4 text-left text-white/60 font-semibold">Teléfono</th>
                  <th className="px-6 py-4 text-left text-white/60 font-semibold">Total Compras</th>
                  <th className="px-6 py-4 text-left text-white/60 font-semibold">Pagado</th>
                  <th className="px-6 py-4 text-left text-white/60 font-semibold">Deuda</th>
                  <th className="px-6 py-4 text-left text-white/60 font-semibold">Órdenes</th>
                  <th className="px-6 py-4 text-left text-white/60 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredDistribuidores.map((distribuidor, index) => (
                    <motion.tr
                      key={distribuidor.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900
                                         flex items-center justify-center text-white font-bold">
                            {distribuidor.nombre?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-white">{distribuidor.nombre}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white/80">{distribuidor.contacto}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white/60">{distribuidor.telefono}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-white">
                          ${(distribuidor.totalCompras || 0).toLocaleString('es-MX')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-zinc-200">
                          ${(distribuidor.totalPagado || 0).toLocaleString('es-MX')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-zinc-200">
                          ${(distribuidor.deudaActual || 0).toLocaleString('es-MX')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{distribuidor.totalOrdenes || 0}</span>
                          {(distribuidor.ordenesPendientes || 0) > 0 && (
                            <span className="px-2 py-0.5 rounded bg-zinc-9000/20 text-zinc-200 text-xs">
                              {distribuidor.ordenesPendientes}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedDistribuidor(distribuidor)}
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

          {filteredDistribuidores.length === 0 && (
            <div className="p-12 text-center">
              <Building2 className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 text-lg">No se encontraron distribuidores</p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
