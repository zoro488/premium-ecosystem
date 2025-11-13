import { useState } from 'react';

import { motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  DollarSign,
  FileText,
  Hash,
  Package,
  Save,
  Truck,
  User,
  X,
} from 'lucide-react';

/**
 * FORMULARIO ORDEN DE COMPRA
 * Crear/Editar órdenes de compra con validación completa
 */

export default function FormOrdenCompra({ onClose, onSave, ordenExistente = null }) {
  const distribuidoresDisponibles = [
    'Ceres Distribuidora',
    'Aceros del Norte',
    'Comercializadora Global',
    'Distribuidora Monterrey',
    'Grupo Industrial Alfa',
  ];

  const [formData, setFormData] = useState(
    ordenExistente || {
      fechaOrden: new Date().toISOString().split('T')[0],
      numeroOC: '',
      distribuidor: 'Ceres Distribuidora',
      cantidad: '',
      precioCompra: '',
      totalOrden: '',
      fechaEntregaEsperada: '',
      fechaEntregaReal: '',
      estatusEntrega: 'Pendiente',
      estatusPago: 'Pendiente',
      montoPagado: '',
      saldoPendiente: '',
      proveedor: '',
      numeroFactura: '',
      observaciones: '',
    }
  );

  const [errors, setErrors] = useState({});

  // Auto-calcular campos
  const handleCalculate = () => {
    const cantidad = parseFloat(formData.cantidad) || 0;
    const precioCompra = parseFloat(formData.precioCompra) || 0;
    const montoPagado = parseFloat(formData.montoPagado) || 0;

    const totalOrden = cantidad * precioCompra;
    const saldoPendiente = totalOrden - montoPagado;

    setFormData({
      ...formData,
      totalOrden: totalOrden.toFixed(2),
      saldoPendiente: saldoPendiente.toFixed(2),
    });
  };

  // Validación
  const validate = () => {
    const newErrors = {};

    if (!formData.fechaOrden) newErrors.fechaOrden = 'Fecha requerida';
    if (!formData.numeroOC) newErrors.numeroOC = 'Número de OC requerido';
    if (!formData.distribuidor) newErrors.distribuidor = 'Distribuidor requerido';
    if (!formData.cantidad || formData.cantidad <= 0) {
      newErrors.cantidad = 'Cantidad debe ser mayor a 0';
    }
    if (!formData.precioCompra || formData.precioCompra <= 0) {
      newErrors.precioCompra = 'Precio debe ser mayor a 0';
    }
    if (!formData.fechaEntregaEsperada) {
      newErrors.fechaEntregaEsperada = 'Fecha de entrega esperada requerida';
    }
    if (!formData.totalOrden) {
      newErrors.totalOrden = 'Calcule los totales primero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      onSave({
        ...formData,
        cantidad: parseFloat(formData.cantidad),
        precioCompra: parseFloat(formData.precioCompra),
        totalOrden: parseFloat(formData.totalOrden),
        montoPagado: parseFloat(formData.montoPagado) || 0,
        saldoPendiente: parseFloat(formData.saldoPendiente),
        fechaOrden: new Date(formData.fechaOrden),
        fechaEntregaEsperada: new Date(formData.fechaEntregaEsperada),
        fechaEntregaReal: formData.fechaEntregaReal ? new Date(formData.fechaEntregaReal) : null,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-gradient-to-br from-slate-900 to-purple-900 border border-purple-400/30 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <motion.h2
            className="text-2xl font-bold text-white flex items-center gap-3"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
          >
            <Package className="w-7 h-7 text-purple-400" />
            {ordenExistente ? 'Editar Orden de Compra' : 'Nueva Orden de Compra'}
          </motion.h2>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Sección: Información General */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Información General
            </h3>

            <div className="grid grid-cols-3 gap-6">
              {/* Fecha Orden */}
              <div>
                <label className="flex items-center gap-2 text-sm text-purple-300 mb-2">
                  <Calendar className="w-4 h-4" />
                  Fecha de Orden
                </label>
                <input
                  type="date"
                  value={formData.fechaOrden}
                  onChange={(e) => setFormData({ ...formData, fechaOrden: e.target.value })}
                  className={`w-full px-4 py-3 bg-white/10 border ${
                    errors.fechaOrden ? 'border-red-400' : 'border-white/20'
                  } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50`}
                />
                {errors.fechaOrden && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.fechaOrden}
                  </p>
                )}
              </div>

              {/* Número OC */}
              <div>
                <label className="flex items-center gap-2 text-sm text-purple-300 mb-2">
                  <Hash className="w-4 h-4" />
                  Número de OC
                </label>
                <input
                  type="text"
                  value={formData.numeroOC}
                  onChange={(e) => setFormData({ ...formData, numeroOC: e.target.value })}
                  placeholder="OC0001"
                  className={`w-full px-4 py-3 bg-white/10 border ${
                    errors.numeroOC ? 'border-red-400' : 'border-white/20'
                  } rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50`}
                />
                {errors.numeroOC && <p className="text-red-400 text-xs mt-1">{errors.numeroOC}</p>}
              </div>

              {/* Distribuidor */}
              <div>
                <label className="flex items-center gap-2 text-sm text-purple-300 mb-2">
                  <User className="w-4 h-4" />
                  Distribuidor
                </label>
                <select
                  value={formData.distribuidor}
                  onChange={(e) => setFormData({ ...formData, distribuidor: e.target.value })}
                  className={`w-full px-4 py-3 bg-white/10 border ${
                    errors.distribuidor ? 'border-red-400' : 'border-white/20'
                  } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50`}
                >
                  {distribuidoresDisponibles.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
                {errors.distribuidor && (
                  <p className="text-red-400 text-xs mt-1">{errors.distribuidor}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Sección: Detalles del Pedido */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Detalles del Pedido
            </h3>

            <div className="grid grid-cols-2 gap-6">
              {/* Cantidad */}
              <div>
                <label className="flex items-center gap-2 text-sm text-purple-300 mb-2">
                  <Package className="w-4 h-4" />
                  Cantidad
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                  placeholder="0"
                  onBlur={handleCalculate}
                  className={`w-full px-4 py-3 bg-white/10 border ${
                    errors.cantidad ? 'border-red-400' : 'border-white/20'
                  } rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50`}
                />
                {errors.cantidad && <p className="text-red-400 text-xs mt-1">{errors.cantidad}</p>}
              </div>

              {/* Precio Compra */}
              <div>
                <label className="flex items-center gap-2 text-sm text-purple-300 mb-2">
                  <DollarSign className="w-4 h-4" />
                  Precio de Compra (Unitario)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precioCompra}
                  onChange={(e) => setFormData({ ...formData, precioCompra: e.target.value })}
                  placeholder="0.00"
                  onBlur={handleCalculate}
                  className={`w-full px-4 py-3 bg-white/10 border ${
                    errors.precioCompra ? 'border-red-400' : 'border-white/20'
                  } rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50`}
                />
                {errors.precioCompra && (
                  <p className="text-red-400 text-xs mt-1">{errors.precioCompra}</p>
                )}
              </div>

              {/* Proveedor */}
              <div>
                <label className="flex items-center gap-2 text-sm text-purple-300 mb-2">
                  <Truck className="w-4 h-4" />
                  Proveedor
                </label>
                <input
                  type="text"
                  value={formData.proveedor}
                  onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                  placeholder="Nombre del proveedor"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                />
              </div>

              {/* Número Factura */}
              <div>
                <label className="flex items-center gap-2 text-sm text-purple-300 mb-2">
                  <FileText className="w-4 h-4" />
                  Número de Factura
                </label>
                <input
                  type="text"
                  value={formData.numeroFactura}
                  onChange={(e) => setFormData({ ...formData, numeroFactura: e.target.value })}
                  placeholder="FAC-00001"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                />
              </div>
            </div>
          </motion.div>

          {/* Sección: Fechas de Entrega */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Entrega
            </h3>

            <div className="grid grid-cols-3 gap-6">
              {/* Fecha Entrega Esperada */}
              <div>
                <label className="flex items-center gap-2 text-sm text-purple-300 mb-2">
                  <Calendar className="w-4 h-4" />
                  Fecha Esperada
                </label>
                <input
                  type="date"
                  value={formData.fechaEntregaEsperada}
                  onChange={(e) =>
                    setFormData({ ...formData, fechaEntregaEsperada: e.target.value })
                  }
                  className={`w-full px-4 py-3 bg-white/10 border ${
                    errors.fechaEntregaEsperada ? 'border-red-400' : 'border-white/20'
                  } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50`}
                />
                {errors.fechaEntregaEsperada && (
                  <p className="text-red-400 text-xs mt-1">{errors.fechaEntregaEsperada}</p>
                )}
              </div>

              {/* Fecha Entrega Real */}
              <div>
                <label className="flex items-center gap-2 text-sm text-purple-300 mb-2">
                  <Calendar className="w-4 h-4" />
                  Fecha Real
                </label>
                <input
                  type="date"
                  value={formData.fechaEntregaReal}
                  onChange={(e) => setFormData({ ...formData, fechaEntregaReal: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                />
              </div>

              {/* Estatus Entrega */}
              <div>
                <label className="text-sm text-purple-300 mb-2 block">Estatus Entrega</label>
                <select
                  value={formData.estatusEntrega}
                  onChange={(e) => setFormData({ ...formData, estatusEntrega: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Tránsito">En Tránsito</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Sección: Información de Pago */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Información de Pago
            </h3>

            <div className="grid grid-cols-2 gap-6">
              {/* Monto Pagado */}
              <div>
                <label className="flex items-center gap-2 text-sm text-purple-300 mb-2">
                  <DollarSign className="w-4 h-4" />
                  Monto Pagado
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.montoPagado}
                  onChange={(e) => setFormData({ ...formData, montoPagado: e.target.value })}
                  placeholder="0.00"
                  onBlur={handleCalculate}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                />
              </div>

              {/* Estatus Pago */}
              <div>
                <label className="text-sm text-purple-300 mb-2 block">Estatus de Pago</label>
                <select
                  value={formData.estatusPago}
                  onChange={(e) => setFormData({ ...formData, estatusPago: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Parcial">Parcial</option>
                  <option value="Pagado">Pagado</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Observaciones */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="text-sm text-purple-300 mb-2 block">Observaciones</label>
            <textarea
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              placeholder="Notas adicionales sobre la orden..."
              rows="3"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 resize-none"
            />
          </motion.div>

          {/* Resumen Financiero */}
          <motion.div
            className="bg-purple-500/10 border border-purple-400/30 rounded-xl p-6 mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Resumen Financiero
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-purple-300/70 mb-1 block">Total de Orden</label>
                <p className="text-2xl font-bold text-white">
                  ${parseFloat(formData.totalOrden || 0).toLocaleString()}
                </p>
              </div>

              <div>
                <label className="text-sm text-purple-300/70 mb-1 block">Monto Pagado</label>
                <p className="text-2xl font-bold text-green-400">
                  ${parseFloat(formData.montoPagado || 0).toLocaleString()}
                </p>
              </div>

              <div>
                <label className="text-sm text-purple-300/70 mb-1 block">Saldo Pendiente</label>
                <p className="text-2xl font-bold text-amber-400">
                  ${parseFloat(formData.saldoPendiente || 0).toLocaleString()}
                </p>
              </div>
            </div>

            {errors.totalOrden && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm mt-4 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.totalOrden}
              </motion.p>
            )}
          </motion.div>

          {/* Botones de Acción */}
          <div className="flex gap-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(168, 85, 247, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-4 bg-purple-500/20 border border-purple-400/30 rounded-xl text-white font-semibold hover:bg-purple-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {ordenExistente ? 'Actualizar Orden' : 'Crear Orden'}
            </motion.button>

            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-4 bg-gray-500/20 border border-gray-400/30 rounded-xl text-gray-300 hover:bg-gray-500/30 transition-all"
            >
              Cancelar
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
