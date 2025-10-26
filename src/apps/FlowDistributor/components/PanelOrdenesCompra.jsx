/**
 * 🛒 PANEL ÓRDENES DE COMPRA PREMIUM
 * Gestión avanzada de órdenes de compra con visualizaciones en tiempo real
 */

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  TrendingUp,
  DollarSign,
  Calendar,
  Check,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Download,
} from 'lucide-react';

const PanelOrdenesCompra = () => {
  const [ordenesCompra, setOrdenesCompra] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [busqueda, setBusqueda] = useState('');

  // Estadísticas de órdenes
  const estadisticas = useMemo(() => {
    return {
      total: ordenesCompra.length,
      pendientes: ordenesCompra.filter((o) => o.estado === 'pendiente').length,
      completadas: ordenesCompra.filter((o) => o.estado === 'completada')
        .length,
      montoTotal: ordenesCompra.reduce((sum, o) => sum + (o.total || 0), 0),
    };
  }, [ordenesCompra]);

  // Filtrar órdenes
  const ordenesFiltradas = useMemo(() => {
    return ordenesCompra.filter((orden) => {
      const cumpleFiltro =
        filtroEstado === 'todas' || orden.estado === filtroEstado;
      const cumpleBusqueda =
        !busqueda ||
        orden.codigo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        orden.proveedor?.toLowerCase().includes(busqueda.toLowerCase());
      return cumpleFiltro && cumpleBusqueda;
    });
  }, [ordenesCompra, filtroEstado, busqueda]);

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      proceso: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      completada: 'bg-green-500/20 text-green-400 border-green-500/30',
      cancelada: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colores[estado] || colores.pendiente;
  };

  const getEstadoIcono = (estado) => {
    const iconos = {
      pendiente: Clock,
      proceso: TrendingUp,
      completada: Check,
      cancelada: AlertCircle,
    };
    const Icono = iconos[estado] || Clock;
    return <Icono className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Encabezado y Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Package className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">
              Total Órdenes
            </h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {estadisticas.total}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">Pendientes</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {estadisticas.pendientes}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Check className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">Completadas</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {estadisticas.completadas}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">Monto Total</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            ${estadisticas.montoTotal.toLocaleString()}
          </p>
        </motion.div>
      </div>

      {/* Controles */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar por código o proveedor..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="todas">Todas</option>
              <option value="pendiente">Pendientes</option>
              <option value="proceso">En Proceso</option>
              <option value="completada">Completadas</option>
              <option value="cancelada">Canceladas</option>
            </select>

            <button className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Nueva Orden</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Órdenes */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {ordenesFiltradas.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center"
            >
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No hay órdenes de compra
              </h3>
              <p className="text-gray-500">
                Comienza creando tu primera orden de compra
              </p>
            </motion.div>
          ) : (
            ordenesFiltradas.map((orden, index) => (
              <motion.div
                key={orden.id || index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all"
              >
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-white">
                        {orden.codigo}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getEstadoColor(orden.estado)}`}
                      >
                        {getEstadoIcono(orden.estado)}
                        {orden.estado}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {orden.fecha}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {orden.proveedor}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${orden.total?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PanelOrdenesCompra;
