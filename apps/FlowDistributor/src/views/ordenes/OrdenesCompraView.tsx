import { useMemo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Truck,
} from 'lucide-react';

import { ChronosButton } from '@/components/chronos-ui/ChronosButton';
import { ChronosCard } from '@/components/chronos-ui/ChronosCard';
import { ChronosKPI } from '@/components/chronos-ui/ChronosKPI';
import { useChronosData } from '@/hooks/useChronosData';
import type { BancoId } from '@/types';

/**
 * 📦 ÓRDENES DE COMPRA VIEW
 * Gestión completa de órdenes de compra y recepción
 */
export default function OrdenesCompraView() {
  const { ordenesCompra, distribuidores } = useChronosData();

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Pendiente' | 'Parcial' | 'Recibida'>(
    'all'
  );

  // KPIs calculados
  const kpis = useMemo(() => {
    const ordenesPendientes = ordenesCompra.filter((o) => o.estatus === 'Pendiente').length;
    const ordenesRecibidas = ordenesCompra.filter((o) => o.estatus === 'Recibida').length;
    const ordenesParciales = ordenesCompra.filter((o) => o.estatus === 'Parcial').length;

    // Calcular monto total de órdenes pendientes
    const montoPendiente = ordenesCompra
      .filter((o) => o.estatus === 'Pendiente' || o.estatus === 'Parcial')
      .reduce((sum, o) => sum + o.total, 0);

    return {
      ordenesPendientes,
      ordenesRecibidas,
      ordenesParciales,
      montoPendiente,
    };
  }, [ordenesCompra]);

  // Filtrar órdenes
  const ordenesFiltradas = useMemo(() => {
    return ordenesCompra
      .filter((orden) => {
        const distribuidor = distribuidores.find((d) => d.id === orden.distribuidorId);
        const matchesSearch =
          orden.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
          distribuidor?.nombre.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || orden.estatus === filterStatus;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const fechaA = typeof a.fecha === 'string' ? new Date(a.fecha) : a.fecha;
        const fechaB = typeof b.fecha === 'string' ? new Date(b.fecha) : b.fecha;
        return fechaB.getTime() - fechaA.getTime();
      });
  }, [ordenesCompra, distribuidores, searchTerm, filterStatus]);
  const getStatusBadge = (estatus: string) => {
    const badges = {
      Pendiente: { bg: 'bg-neon-yellow/20', text: 'text-neon-yellow', icon: Clock },
      Parcial: { bg: 'bg-neon-purple/20', text: 'text-neon-purple', icon: Package },
      Recibida: { bg: 'bg-neon-green/20', text: 'text-neon-green', icon: CheckCircle },
    };

    const config = badges[estatus as keyof typeof badges] || badges['Pendiente'];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${config.bg} ${config.text} text-sm`}
      >
        <Icon className="w-4 h-4" />
        {estatus}
      </span>
    );
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-chronos-white flex items-center gap-3">
            <ShoppingCart className="w-10 h-10 text-neon-purple" />
            Órdenes de Compra
          </h1>
          <p className="text-chronos-silver mt-2 text-lg">
            Gestión de compras y recepción de mercancía
          </p>
        </div>
        <ChronosButton variant="primary" size="lg" onClick={() => setShowForm(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Nueva Orden
        </ChronosButton>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ChronosKPI
          label="Órdenes Pendientes"
          value={kpis.ordenesPendientes}
          format="number"
          color="yellow"
          pulse
        />
        <ChronosKPI
          label="Órdenes Parciales"
          value={kpis.ordenesParciales}
          format="number"
          color="purple"
        />
        <ChronosKPI
          label="Órdenes Recibidas"
          value={kpis.ordenesRecibidas}
          format="number"
          color="green"
        />
        <ChronosKPI
          label="Monto Pendiente"
          value={kpis.montoPendiente}
          format="currency"
          color="cyan"
        />
      </div>

      {/* Filters */}
      <ChronosCard variant="glass">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-chronos-silver" />
            <input
              type="text"
              placeholder="Buscar por folio o distribuidor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white placeholder-chronos-silver focus:outline-none focus:border-neon-cyan transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'all'
                  ? 'bg-neon-cyan text-chronos-void'
                  : 'bg-chronos-graphite text-chronos-silver hover:bg-chronos-smoke'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterStatus('Pendiente')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'Pendiente'
                  ? 'bg-neon-yellow text-chronos-void'
                  : 'bg-chronos-graphite text-chronos-silver hover:bg-chronos-smoke'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFilterStatus('Parcial')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'Parcial'
                  ? 'bg-neon-purple text-chronos-void'
                  : 'bg-chronos-graphite text-chronos-silver hover:bg-chronos-smoke'
              }`}
            >
              Parciales
            </button>
            <button
              onClick={() => setFilterStatus('Recibida')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'Recibida'
                  ? 'bg-neon-green text-chronos-void'
                  : 'bg-chronos-graphite text-chronos-silver hover:bg-chronos-smoke'
              }`}
            >
              Recibidas
            </button>
          </div>
        </div>
      </ChronosCard>

      {/* Tabla de Órdenes */}
      <ChronosCard variant="glass-metal">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-chronos-smoke">
                <th className="text-left p-4 text-chronos-white font-medium">Folio</th>
                <th className="text-left p-4 text-chronos-white font-medium">Fecha</th>
                <th className="text-left p-4 text-chronos-white font-medium">Distribuidor</th>
                <th className="text-left p-4 text-chronos-white font-medium">Productos</th>
                <th className="text-right p-4 text-chronos-white font-medium">Total</th>
                <th className="text-center p-4 text-chronos-white font-medium">Estatus</th>
                <th className="text-center p-4 text-chronos-white font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <AlertTriangle className="w-12 h-12 text-chronos-silver mx-auto mb-3" />
                    <p className="text-chronos-silver">No se encontraron órdenes</p>
                  </td>
                </tr>
              ) : (
                ordenesFiltradas.map((orden) => {
                  const distribuidor = distribuidores.find((d) => d.id === orden.distribuidorId);
                  const fecha =
                    typeof orden.fecha === 'string' ? new Date(orden.fecha) : orden.fecha;

                  return (
                    <motion.tr
                      key={orden.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-chronos-smoke/30 hover:bg-chronos-graphite/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-medium text-chronos-white">{orden.folio}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-chronos-silver">
                          <Calendar className="w-4 h-4" />
                          {fecha.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-neon-cyan" />
                          <span className="text-chronos-white">
                            {distribuidor?.nombre || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-chronos-silver">{orden.productos.length} item(s)</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <DollarSign className="w-4 h-4 text-neon-green" />
                          <span className="text-chronos-white font-medium">
                            ${orden.total.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">{getStatusBadge(orden.estatus)}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 bg-chronos-graphite hover:bg-chronos-smoke rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-neon-cyan" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </ChronosCard>

      {/* Modal Nueva Orden */}
      <AnimatePresence>
        {showForm && <OrdenFormModal onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  );
}

/**
 * Modal para crear nueva orden de compra
 */
function OrdenFormModal({ onClose }: { onClose: () => void }) {
  const { distribuidores, productos, bancos } = useChronosData();
  const [formData, setFormData] = useState({
    distribuidorId: distribuidores[0]?.id || '',
    productos: [] as { productoId: string; cantidad: number; costo: number }[],
    metodoPago: 'Efectivo' as 'Efectivo' | 'Transferencia' | 'Cheque',
    bancoId: (bancos[0]?.id.toString() as BancoId) || 'BM',
    notas: '',
  });

  const [selectedProducto, setSelectedProducto] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [costo, setCosto] = useState(0);

  const agregarProducto = () => {
    if (!selectedProducto || cantidad <= 0 || costo <= 0) return;

    setFormData((prev) => ({
      ...prev,
      productos: [
        ...prev.productos,
        {
          productoId: selectedProducto,
          cantidad,
          costo,
        },
      ],
    }));

    setSelectedProducto('');
    setCantidad(0);
    setCosto(0);
  };

  const total = formData.productos.reduce((sum, p) => sum + p.cantidad * p.costo, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-chronos-void/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-chronos-charcoal border border-chronos-smoke rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-chronos-smoke">
          <h2 className="text-2xl font-bold text-chronos-white">Nueva Orden de Compra</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Distribuidor */}
          <div>
            <label className="block text-chronos-white font-medium mb-2">Distribuidor *</label>
            <select
              value={formData.distribuidorId}
              onChange={(e) => setFormData({ ...formData, distribuidorId: e.target.value })}
              className="w-full px-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white"
            >
              {distribuidores.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Agregar Productos */}
          <div className="border border-chronos-smoke rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-bold text-chronos-white">Productos</h3>

            <div className="grid grid-cols-3 gap-4">
              <select
                value={selectedProducto}
                onChange={(e) => setSelectedProducto(e.target.value)}
                className="px-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white"
              >
                <option value="">Seleccionar producto...</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Cantidad"
                value={cantidad || ''}
                onChange={(e) => setCantidad(Number(e.target.value))}
                className="px-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white"
              />

              <input
                type="number"
                placeholder="Costo unitario"
                value={costo || ''}
                onChange={(e) => setCosto(Number(e.target.value))}
                className="px-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white"
              />
            </div>

            <ChronosButton variant="secondary" onClick={agregarProducto} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Producto
            </ChronosButton>

            {/* Lista de productos agregados */}
            {formData.productos.length > 0 && (
              <div className="space-y-2">
                {formData.productos.map((p, idx) => {
                  const producto = productos.find((prod) => prod.id === p.productoId);
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-chronos-obsidian rounded-lg"
                    >
                      <span className="text-chronos-white">{producto?.nombre}</span>
                      <span className="text-chronos-silver">
                        {p.cantidad} x ${p.costo}
                      </span>
                      <span className="text-neon-green font-medium">
                        ${(p.cantidad * p.costo).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Método de Pago */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-chronos-white font-medium mb-2">Método de Pago</label>
              <select
                value={formData.metodoPago}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metodoPago: e.target.value as 'Efectivo' | 'Transferencia' | 'Cheque',
                  })
                }
                className="w-full px-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white"
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-chronos-white font-medium mb-2">Banco</label>
              <select
                value={formData.bancoId}
                onChange={(e) => setFormData({ ...formData, bancoId: e.target.value as BancoId })}
                className="w-full px-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white"
              >
                {bancos.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-chronos-white font-medium mb-2">Notas</label>
            <textarea
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white resize-none"
            />
          </div>

          {/* Total */}
          <div className="flex items-center justify-between p-4 bg-neon-purple/10 border-2 border-neon-purple/30 rounded-lg">
            <span className="text-lg text-chronos-white font-medium">Total de la Orden:</span>
            <span className="text-3xl text-neon-purple font-bold">${total.toLocaleString()}</span>
          </div>
        </div>

        <div className="p-6 border-t border-chronos-smoke flex justify-end gap-3">
          <ChronosButton variant="ghost" onClick={onClose}>
            Cancelar
          </ChronosButton>
          <ChronosButton variant="primary">
            <CheckCircle className="w-4 h-4 mr-2" />
            Crear Orden
          </ChronosButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
