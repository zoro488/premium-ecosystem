import { useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
} from 'lucide-react';

import { ChronosButton } from '@/components/chronos-ui/ChronosButton';
import { ChronosCard } from '@/components/chronos-ui/ChronosCard';
import { ChronosKPI } from '@/components/chronos-ui/ChronosKPI';
import { computeBM, computeFL, computeUT, useChronosData } from '@/hooks/useChronosData';
import type { Banco, Cliente, Producto } from '@/types';

/**
 * 💰 VENTAS VIEW
 * Gestión completa de ventas con cálculo automático FL/BM/UT
 */
export default function VentasView() {
  const { ventas, clientes, productos, bancos } = useChronosData();

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<'all' | 'Pagado' | 'Pendiente'>('all');

  // KPIs calculados
  const kpis = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);

    const ventasDelDia = ventas.filter((v) => {
      const fecha = v.fecha instanceof Date ? v.fecha.toISOString() : v.fecha;
      return fecha.toString().startsWith(today);
    });
    const ventasDelMes = ventas.filter((v) => {
      const fecha = v.fecha instanceof Date ? v.fecha.toISOString() : v.fecha;
      return fecha.toString().startsWith(thisMonth);
    });
    const ventasPendientes = ventas.filter((v) => v.estatus === 'Pendiente');

    const ingresosHoy = ventasDelDia.reduce((sum, v) => sum + v.precioVenta, 0);
    const ingresosMes = ventasDelMes.reduce((sum, v) => sum + v.precioVenta, 0);
    const pendientesPorCobrar = ventasPendientes.reduce((sum, v) => sum + v.precioVenta, 0);

    return {
      ingresosHoy,
      ingresosMes,
      pendientesPorCobrar,
      ventasHoy: ventasDelDia.length,
      ventasMes: ventasDelMes.length,
      ventasPendientes: ventasPendientes.length,
    };
  }, [ventas]);

  // Filtrar ventas
  const ventasFiltradas = useMemo(() => {
    return ventas.filter((venta) => {
      const matchesSearch =
        venta.clienteId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venta.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEstado = filterEstado === 'all' || venta.estatus === filterEstado;
      return matchesSearch && matchesEstado;
    });
  }, [ventas, searchTerm, filterEstado]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-chronos-white flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-neon-cyan" />
            Gestión de Ventas
          </h1>
          <p className="text-chronos-silver mt-1">
            Control de ventas con cálculo automático FL/BM/UT
          </p>
        </div>
        <ChronosButton variant="primary" size="lg" onClick={() => setShowForm(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Nueva Venta
        </ChronosButton>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ChronosKPI
          label="Ingresos Hoy"
          value={kpis.ingresosHoy}
          format="currency"
          color="cyan"
          pulse
        />
        <ChronosKPI
          label="Ingresos del Mes"
          value={kpis.ingresosMes}
          format="currency"
          color="green"
        />
        <ChronosKPI
          label="Por Cobrar"
          value={kpis.pendientesPorCobrar}
          format="currency"
          color="yellow"
        />
        <ChronosKPI
          label="Ventas Pendientes"
          value={kpis.ventasPendientes}
          format="number"
          color="red"
        />
      </div>

      {/* Filters */}
      <ChronosCard variant="glass">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-chronos-silver" />
            <input
              type="text"
              placeholder="Buscar por cliente o ID de venta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white placeholder-chronos-silver focus:outline-none focus:border-neon-cyan transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterEstado('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterEstado === 'all'
                  ? 'bg-neon-cyan text-chronos-void'
                  : 'bg-chronos-graphite text-chronos-silver hover:bg-chronos-smoke'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterEstado('Pagado')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterEstado === 'Pagado'
                  ? 'bg-neon-green text-chronos-void'
                  : 'bg-chronos-graphite text-chronos-silver hover:bg-chronos-smoke'
              }`}
            >
              Pagadas
            </button>
            <button
              onClick={() => setFilterEstado('Pendiente')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterEstado === 'Pendiente'
                  ? 'bg-neon-yellow text-chronos-void'
                  : 'bg-chronos-graphite text-chronos-silver hover:bg-chronos-smoke'
              }`}
            >
              Pendientes
            </button>
          </div>
        </div>
      </ChronosCard>

      {/* Lista de Ventas */}
      <ChronosCard variant="glass-metal" title="Historial de Ventas">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-chronos-smoke">
                <th className="text-left py-3 px-4 text-chronos-silver font-medium">ID</th>
                <th className="text-left py-3 px-4 text-chronos-silver font-medium">Fecha</th>
                <th className="text-left py-3 px-4 text-chronos-silver font-medium">Cliente</th>
                <th className="text-right py-3 px-4 text-chronos-silver font-medium">Flete</th>
                <th className="text-right py-3 px-4 text-chronos-silver font-medium">
                  Bóveda Monte
                </th>
                <th className="text-right py-3 px-4 text-chronos-silver font-medium">Utilidades</th>
                <th className="text-right py-3 px-4 text-chronos-silver font-medium">Total</th>
                <th className="text-center py-3 px-4 text-chronos-silver font-medium">Estado</th>
                <th className="text-center py-3 px-4 text-chronos-silver font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-chronos-silver mx-auto mb-3" />
                    <p className="text-chronos-silver">
                      {searchTerm || filterEstado !== 'all'
                        ? 'No se encontraron ventas con los filtros aplicados'
                        : 'No hay ventas registradas. Crea tu primera venta.'}
                    </p>
                  </td>
                </tr>
              ) : (
                ventasFiltradas.map((venta) => {
                  const cliente = clientes.find((c) => c.id === venta.clienteId);
                  return (
                    <motion.tr
                      key={venta.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-chronos-graphite hover:bg-chronos-obsidian transition-colors"
                    >
                      <td className="py-3 px-4 text-chronos-white font-mono text-sm">
                        #{venta.id.slice(0, 8)}
                      </td>
                      <td className="py-3 px-4 text-chronos-white">
                        {new Date(venta.fecha).toLocaleDateString('es-MX')}
                      </td>
                      <td className="py-3 px-4 text-chronos-white">
                        {cliente?.nombre || venta.clienteId}
                      </td>
                      <td className="py-3 px-4 text-right text-bucket-fl font-mono">
                        ${venta.flete.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-bucket-bm font-mono">
                        ${venta.bovedaMonte.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-bucket-ut font-mono">
                        ${venta.utilidades.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-chronos-white font-bold font-mono">
                        ${venta.precioVenta.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {venta.estatus === 'Pagado' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neon-green/20 text-neon-green text-xs font-medium">
                            <CheckCircle className="w-3 h-3" />
                            Pagado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neon-yellow/20 text-neon-yellow text-xs font-medium">
                            <Clock className="w-3 h-3" />
                            Pendiente
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 hover:bg-chronos-graphite rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-neon-cyan" />
                          </button>
                          <button className="p-2 hover:bg-chronos-graphite rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-neon-purple" />
                          </button>
                          <button className="p-2 hover:bg-chronos-graphite rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-neon-red" />
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

      {/* Modal: Nueva Venta */}
      {showForm && (
        <VentaFormModal
          onClose={() => setShowForm(false)}
          clientes={clientes}
          productos={productos}
          bancos={bancos}
        />
      )}
    </div>
  );
}

/**
 * Modal para crear nueva venta
 */
interface VentaFormModalProps {
  onClose: () => void;
  clientes: Cliente[];
  productos: Producto[];
  bancos: Banco[];
}

function VentaFormModal({ onClose, clientes, productos, bancos }: VentaFormModalProps) {
  const [formData, setFormData] = useState({
    clienteId: '',
    productos: [] as Array<{ productoId: string; cantidad: number; costoUnitario: number }>,
    precioVenta: 0,
    estatus: 'Pendiente' as 'Pagado' | 'Pendiente',
    bancoId: 'BM',
  });

  // Cálculos automáticos
  const unidadesTotales = formData.productos.reduce((sum, p) => sum + p.cantidad, 0);
  const flete = computeFL(unidadesTotales);
  const bovedaMonte = computeBM(
    formData.productos.map((p) => ({ cpUnit: p.costoUnitario, cantidad: p.cantidad }))
  );
  const utilidades = computeUT(formData.precioVenta, flete, bovedaMonte);

  const isValid = formData.clienteId && formData.productos.length > 0 && formData.precioVenta > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-chronos-void/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-chronos-charcoal border border-chronos-smoke rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-chronos-smoke">
          <h2 className="text-2xl font-bold text-chronos-white">Nueva Venta</h2>
          <p className="text-chronos-silver mt-1">Registro con cálculo automático FL/BM/UT</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Step 1: Cliente */}
          <div>
            <label className="block text-chronos-white font-medium mb-2">
              1. Seleccionar Cliente
            </label>
            <select
              value={formData.clienteId}
              onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
              className="w-full px-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white focus:outline-none focus:border-neon-cyan transition-colors"
            >
              <option value="">Selecciona un cliente...</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}{' '}
                  {cliente.adeudo > 0 ? `(Adeudo: $${cliente.adeudo.toLocaleString()})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Productos */}
          <div>
            <label className="block text-chronos-white font-medium mb-2">2. Productos</label>
            <div className="space-y-3">
              {formData.productos.map((producto, index) => {
                return (
                  <div key={index} className="flex gap-3 items-center">
                    <select
                      value={producto.productoId}
                      onChange={(e) => {
                        const newProductos = [...formData.productos];
                        const selectedProd = productos.find(
                          (p: Producto) => p.id === e.target.value
                        );
                        newProductos[index] = {
                          ...newProductos[index],
                          productoId: e.target.value,
                          costoUnitario: selectedProd?.costoPromedio || 0,
                        };
                        setFormData({ ...formData, productos: newProductos });
                      }}
                      className="flex-1 px-3 py-2 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white"
                    >
                      <option value="">Selecciona...</option>
                      {productos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre} (Stock: {p.existencia})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Cantidad"
                      min="1"
                      value={producto.cantidad || ''}
                      onChange={(e) => {
                        const newProductos = [...formData.productos];
                        newProductos[index].cantidad = parseInt(e.target.value) || 0;
                        setFormData({ ...formData, productos: newProductos });
                      }}
                      className="w-24 px-3 py-2 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white"
                    />
                    <button
                      onClick={() => {
                        const newProductos = formData.productos.filter((_, i) => i !== index);
                        setFormData({ ...formData, productos: newProductos });
                      }}
                      className="p-2 hover:bg-chronos-graphite rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-neon-red" />
                    </button>
                  </div>
                );
              })}
              <button
                onClick={() => {
                  setFormData({
                    ...formData,
                    productos: [
                      ...formData.productos,
                      { productoId: '', cantidad: 0, costoUnitario: 0 },
                    ],
                  });
                }}
                className="w-full py-2 border-2 border-dashed border-chronos-smoke rounded-lg text-chronos-silver hover:border-neon-cyan hover:text-neon-cyan transition-colors"
              >
                + Agregar Producto
              </button>
            </div>
          </div>

          {/* Step 3: Precio y Estado */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-chronos-white font-medium mb-2">
                3. Precio de Venta
              </label>
              <input
                type="number"
                placeholder="$0.00"
                value={formData.precioVenta || ''}
                onChange={(e) =>
                  setFormData({ ...formData, precioVenta: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white focus:outline-none focus:border-neon-cyan transition-colors"
              />
            </div>
            <div>
              <label className="block text-chronos-white font-medium mb-2">4. Estado</label>
              <select
                value={formData.estatus}
                onChange={(e) =>
                  setFormData({ ...formData, estatus: e.target.value as 'Pagado' | 'Pendiente' })
                }
                className="w-full px-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white focus:outline-none focus:border-neon-cyan transition-colors"
              >
                <option value="Pagado">Pagado</option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </div>
          </div>

          {/* Banco (solo si está pagado) */}
          {formData.estatus === 'Pagado' && (
            <div>
              <label className="block text-chronos-white font-medium mb-2">
                5. Banco de Depósito
              </label>
              <select
                value={formData.bancoId}
                onChange={(e) => setFormData({ ...formData, bancoId: e.target.value })}
                className="w-full px-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white focus:outline-none focus:border-neon-cyan transition-colors"
              >
                {bancos.map((banco) => (
                  <option key={banco.id} value={banco.id}>
                    {banco.nombre} (${banco.capitalActual.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Cálculos FL/BM/UT */}
          {formData.productos.length > 0 && formData.precioVenta > 0 && (
            <div className="bg-chronos-obsidian border border-chronos-smoke rounded-lg p-4 space-y-3">
              <h3 className="text-chronos-white font-bold mb-2">📊 Cálculos Automáticos</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-bucket-fl text-2xl font-bold">${flete.toLocaleString()}</div>
                  <div className="text-chronos-silver text-sm mt-1">Flete</div>
                  <div className="text-chronos-silver text-xs">
                    {unidadesTotales} unidades × $500
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-bucket-bm text-2xl font-bold">
                    ${bovedaMonte.toLocaleString()}
                  </div>
                  <div className="text-chronos-silver text-sm mt-1">Bóveda Monte</div>
                  <div className="text-chronos-silver text-xs">Σ Costos productos</div>
                </div>
                <div className="text-center">
                  <div className="text-bucket-ut text-2xl font-bold">
                    ${utilidades.toLocaleString()}
                  </div>
                  <div className="text-chronos-silver text-sm mt-1">Utilidades</div>
                  <div className="text-chronos-silver text-xs">PV - FL - BM</div>
                </div>
              </div>
              <div className="pt-3 border-t border-chronos-smoke text-center">
                <div className="text-chronos-white text-sm">Verificación: FL + BM + UT = PV</div>
                <div className="text-chronos-silver text-xs mt-1">
                  ${(flete + bovedaMonte + utilidades).toLocaleString()} = $
                  {formData.precioVenta.toLocaleString()}
                  {Math.abs(flete + bovedaMonte + utilidades - formData.precioVenta) < 0.01 ? (
                    <span className="text-neon-green ml-2">✓ Correcto</span>
                  ) : (
                    <span className="text-neon-red ml-2">⚠ Discrepancia</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-chronos-smoke flex justify-end gap-3">
          <ChronosButton variant="ghost" onClick={onClose}>
            Cancelar
          </ChronosButton>
          <ChronosButton
            variant="primary"
            disabled={!isValid}
            onClick={() => {
              // TODO: Integrar con Firestore
              console.log('Crear venta:', {
                ...formData,
                flete,
                bovedaMonte,
                utilidades,
              });
              onClose();
            }}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Crear Venta
          </ChronosButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
