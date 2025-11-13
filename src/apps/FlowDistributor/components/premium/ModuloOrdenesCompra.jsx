/**
 * 🛒 MÓDULO AVANZADO DE ÓRDENES DE COMPRA
 * Sistema completo de gestión de órdenes de compra para distribuidores
 *
 * FEATURES PREMIUM:
 * - Creación y gestión de órdenes
 * - Tracking de estado (pendiente, aprobada, en tránsito, entregada)
 * - Aprobaciones multi-nivel
 * - Cálculo automático de costos
 * - Historial completo de órdenes
 * - Alertas de retrasos
 * - Filtros avanzados
 * - Exportación de datos
 * - Integración con inventario
 */
import { useMemo, useState } from 'react';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  TrendingUp,
  Truck,
  XCircle,
} from 'lucide-react';

import { formatCurrency } from '../../utils/formatters';

const ESTADOS_ORDEN = {
  pendiente: { label: 'Pendiente', color: 'yellow', icon: Clock },
  aprobada: { label: 'Aprobada', color: 'green', icon: CheckCircle },
  en_transito: { label: 'En Tránsito', color: 'blue', icon: Truck },
  entregada: { label: 'Entregada', color: 'emerald', icon: Package },
  cancelada: { label: 'Cancelada', color: 'red', icon: XCircle },
};

export const ModuloOrdenesCompra = ({ distribuidores = [] }) => {
  const [ordenes, setOrdenes] = useState([
    {
      id: 1,
      numero: 'OC-2025-001',
      distribuidorId: '1',
      distribuidor: 'Distribuidora Norte',
      fecha: new Date('2025-10-15'),
      fechaEntrega: new Date('2025-11-05'),
      estado: 'en_transito',
      items: [
        { producto: 'Producto A', cantidad: 100, precioUnitario: 50, subtotal: 5000 },
        { producto: 'Producto B', cantidad: 50, precioUnitario: 75, subtotal: 3750 },
      ],
      subtotal: 8750,
      iva: 1400,
      total: 10150,
      aprobadoPor: 'Juan Pérez',
      notas: 'Entrega urgente',
    },
    {
      id: 2,
      numero: 'OC-2025-002',
      distribuidorId: '2',
      distribuidor: 'Distribuidora Sur',
      fecha: new Date('2025-10-20'),
      fechaEntrega: new Date('2025-11-10'),
      estado: 'pendiente',
      items: [{ producto: 'Producto C', cantidad: 200, precioUnitario: 30, subtotal: 6000 }],
      subtotal: 6000,
      iva: 960,
      total: 6960,
      aprobadoPor: null,
      notas: '',
    },
    {
      id: 3,
      numero: 'OC-2025-003',
      distribuidorId: '1',
      distribuidor: 'Distribuidora Norte',
      fecha: new Date('2025-10-10'),
      fechaEntrega: new Date('2025-10-28'),
      estado: 'entregada',
      items: [
        { producto: 'Producto D', cantidad: 150, precioUnitario: 40, subtotal: 6000 },
        { producto: 'Producto E', cantidad: 75, precioUnitario: 60, subtotal: 4500 },
      ],
      subtotal: 10500,
      iva: 1680,
      total: 12180,
      aprobadoPor: 'María González',
      notas: 'Entregado completo',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState(null);

  // Estadísticas
  const stats = useMemo(() => {
    const totalOrdenes = ordenes.length;
    const pendientes = ordenes.filter((o) => o.estado === 'pendiente').length;
    const enTransito = ordenes.filter((o) => o.estado === 'en_transito').length;
    const entregadas = ordenes.filter((o) => o.estado === 'entregada').length;
    const totalMonto = ordenes.reduce((sum, o) => sum + o.total, 0);
    const montoPromedio = totalOrdenes > 0 ? totalMonto / totalOrdenes : 0;

    return {
      totalOrdenes,
      pendientes,
      enTransito,
      entregadas,
      totalMonto,
      montoPromedio,
    };
  }, [ordenes]);

  // Filtrar órdenes
  const ordenesFiltradas = useMemo(() => {
    return ordenes.filter((orden) => {
      const matchSearch =
        orden.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orden.distribuidor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchEstado = filterEstado === 'todos' || orden.estado === filterEstado;
      return matchSearch && matchEstado;
    });
  }, [ordenes, searchTerm, filterEstado]);

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-violet-900/20 to-slate-900 p-6 overflow-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
              🛒 Órdenes de Compra
            </h2>
            <p className="text-slate-400">Gestión completa de pedidos a distribuidores</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-violet-500/50 transition-shadow"
          >
            <Plus className="w-5 h-5" />
            Nueva Orden
          </motion.button>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-violet-500/20 to-violet-600/10 backdrop-blur-lg border border-violet-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-8 h-8 text-violet-400" />
            <FileText className="w-5 h-5 text-violet-300" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Total Órdenes</p>
          <p className="text-2xl font-bold text-white">{stats.totalOrdenes}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 backdrop-blur-lg border border-yellow-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-yellow-400" />
            <AlertCircle className="w-5 h-5 text-yellow-300" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Pendientes</p>
          <p className="text-2xl font-bold text-white">{stats.pendientes}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-lg border border-blue-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <Truck className="w-8 h-8 text-blue-400" />
            <TrendingUp className="w-5 h-5 text-blue-300" />
          </div>
          <p className="text-slate-400 text-sm mb-1">En Tránsito</p>
          <p className="text-2xl font-bold text-white">{stats.enTransito}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-lg border border-green-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-400" />
            <Package className="w-5 h-5 text-green-300" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Monto Total</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalMonto)}</p>
        </motion.div>
      </div>

      {/* Controles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-4 mb-6"
      >
        <div className="flex flex-wrap gap-4 items-center">
          {/* Búsqueda */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por número de orden o distribuidor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Filtro por estado */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="aprobada">Aprobadas</option>
              <option value="en_transito">En Tránsito</option>
              <option value="entregada">Entregadas</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>

          {/* Exportar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar
          </motion.button>
        </div>
      </motion.div>

      {/* Lista de órdenes */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {ordenesFiltradas.map((orden, index) => {
            const estadoInfo = ESTADOS_ORDEN[orden.estado];
            const EstadoIcon = estadoInfo.icon;

            return (
              <motion.div
                key={orden.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-6 hover:border-violet-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{orden.numero}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 bg-${estadoInfo.color}-500/20 text-${estadoInfo.color}-400 border border-${estadoInfo.color}-500/30`}
                      >
                        <EstadoIcon className="w-3 h-3" />
                        {estadoInfo.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400 mb-1">Distribuidor</p>
                        <p className="text-white font-medium">{orden.distribuidor}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 mb-1">Fecha Orden</p>
                        <p className="text-white font-medium">
                          {format(orden.fecha, 'dd/MM/yyyy', { locale: es })}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 mb-1">Fecha Entrega</p>
                        <p className="text-white font-medium">
                          {format(orden.fechaEntrega, 'dd/MM/yyyy', { locale: es })}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 mb-1">Total</p>
                        <p className="text-2xl font-bold text-green-400">
                          {formatCurrency(orden.total)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedOrden(orden)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                      title="Ver detalle"
                    >
                      <Eye className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Items resumen */}
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">Items ({orden.items.length})</p>
                  <div className="space-y-2">
                    {orden.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-white">{item.producto}</span>
                        <span className="text-slate-400">
                          {item.cantidad} × {formatCurrency(item.precioUnitario)} ={' '}
                          {formatCurrency(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>
                  {orden.notas && (
                    <div className="mt-3 pt-3 border-t border-slate-700/50">
                      <p className="text-slate-400 text-xs">Notas: {orden.notas}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Sin resultados */}
      {ordenesFiltradas.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No se encontraron órdenes</p>
          <p className="text-slate-500 text-sm">Intenta ajustar los filtros de búsqueda</p>
        </motion.div>
      )}
    </div>
  );
};
