import { useState } from 'react';

import { motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  DollarSign,
  FileText,
  Package,
  Save,
  User,
  X,
} from 'lucide-react';

/**
 * FORMULARIO VENTA LOCAL - Crear/Editar Ventas
 * Formulario completo y funcional con validación
 */

export default function FormVentaLocal({ onClose, onSave, ventaExistente = null }) {
  const [formData, setFormData] = useState(
    ventaExistente || {
      fecha: new Date().toISOString().split('T')[0],
      ocRelacionada: '',
      cantidad: '',
      cliente: '',
      bovedaMonte: '',
      precioVenta: '',
      ingreso: '',
      flete: 'No Aplica',
      fleteUtilidad: '',
      utilidad: '',
      estatus: 'Pendiente',
      concepto: '',
    }
  );

  const [errors, setErrors] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);

  // Auto-calcular campos derivados
  const handleCalculate = () => {
    setIsCalculating(true);

    const cantidad = parseFloat(formData.cantidad) || 0;
    const precioVenta = parseFloat(formData.precioVenta) || 0;
    const bovedaMonte = parseFloat(formData.bovedaMonte) || 0;
    const fleteUtilidad = parseFloat(formData.fleteUtilidad) || 0;

    const ingreso = cantidad * precioVenta;
    const utilidad = ingreso - bovedaMonte - fleteUtilidad;

    setFormData({
      ...formData,
      ingreso: ingreso.toFixed(2),
      utilidad: utilidad.toFixed(2),
    });

    setTimeout(() => setIsCalculating(false), 300);
  };

  // Validación
  const validate = () => {
    const newErrors = {};

    if (!formData.fecha) newErrors.fecha = 'Fecha requerida';
    if (!formData.ocRelacionada) newErrors.ocRelacionada = 'OC requerida';
    if (!formData.cantidad || formData.cantidad <= 0)
      newErrors.cantidad = 'Cantidad debe ser mayor a 0';
    if (!formData.cliente) newErrors.cliente = 'Cliente requerido';
    if (!formData.precioVenta || formData.precioVenta <= 0)
      newErrors.precioVenta = 'Precio debe ser mayor a 0';
    if (!formData.ingreso) newErrors.ingreso = 'Calcule los valores primero';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      onSave({
        ...formData,
        cantidad: parseFloat(formData.cantidad),
        bovedaMonte: parseFloat(formData.bovedaMonte) || 0,
        precioVenta: parseFloat(formData.precioVenta),
        ingreso: parseFloat(formData.ingreso),
        fleteUtilidad: parseFloat(formData.fleteUtilidad) || 0,
        utilidad: parseFloat(formData.utilidad),
        fecha: new Date(formData.fecha),
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
        className="bg-gradient-to-br from-slate-900 to-blue-900 border border-blue-400/30 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <motion.h2
            className="text-2xl font-bold text-white flex items-center gap-3"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
          >
            <FileText className="w-7 h-7 text-blue-400" />
            {ventaExistente ? 'Editar Venta Local' : 'Nueva Venta Local'}
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
          {/* Grid de Campos */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Fecha */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="flex items-center gap-2 text-sm text-blue-300 mb-2">
                <Calendar className="w-4 h-4" />
                Fecha
              </label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className={`w-full px-4 py-3 bg-white/10 border ${
                  errors.fecha ? 'border-red-400' : 'border-white/20'
                } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all`}
              />
              {errors.fecha && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.fecha}
                </motion.p>
              )}
            </motion.div>

            {/* OC Relacionada */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label className="flex items-center gap-2 text-sm text-blue-300 mb-2">
                <FileText className="w-4 h-4" />
                OC Relacionada
              </label>
              <input
                type="text"
                value={formData.ocRelacionada}
                onChange={(e) => setFormData({ ...formData, ocRelacionada: e.target.value })}
                placeholder="OC0001"
                className={`w-full px-4 py-3 bg-white/10 border ${
                  errors.ocRelacionada ? 'border-red-400' : 'border-white/20'
                } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50`}
              />
              {errors.ocRelacionada && (
                <p className="text-red-400 text-xs mt-1">{errors.ocRelacionada}</p>
              )}
            </motion.div>

            {/* Cantidad */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="flex items-center gap-2 text-sm text-blue-300 mb-2">
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
                className={`w-full px-4 py-3 bg-white/10 border ${
                  errors.cantidad ? 'border-red-400' : 'border-white/20'
                } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50`}
              />
              {errors.cantidad && <p className="text-red-400 text-xs mt-1">{errors.cantidad}</p>}
            </motion.div>

            {/* Cliente */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label className="flex items-center gap-2 text-sm text-blue-300 mb-2">
                <User className="w-4 h-4" />
                Cliente
              </label>
              <input
                type="text"
                value={formData.cliente}
                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                placeholder="Nombre del cliente"
                className={`w-full px-4 py-3 bg-white/10 border ${
                  errors.cliente ? 'border-red-400' : 'border-white/20'
                } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50`}
              />
              {errors.cliente && <p className="text-red-400 text-xs mt-1">{errors.cliente}</p>}
            </motion.div>

            {/* Precio de Venta */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="flex items-center gap-2 text-sm text-blue-300 mb-2">
                <DollarSign className="w-4 h-4" />
                Precio de Venta
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.precioVenta}
                onChange={(e) => setFormData({ ...formData, precioVenta: e.target.value })}
                placeholder="0.00"
                className={`w-full px-4 py-3 bg-white/10 border ${
                  errors.precioVenta ? 'border-red-400' : 'border-white/20'
                } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50`}
              />
              {errors.precioVenta && (
                <p className="text-red-400 text-xs mt-1">{errors.precioVenta}</p>
              )}
            </motion.div>

            {/* Bóveda Monte */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <label className="flex items-center gap-2 text-sm text-blue-300 mb-2">
                <DollarSign className="w-4 h-4" />
                Bóveda Monte
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.bovedaMonte}
                onChange={(e) => setFormData({ ...formData, bovedaMonte: e.target.value })}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              />
            </motion.div>

            {/* Flete */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="text-sm text-blue-300 mb-2 block">Flete</label>
              <select
                value={formData.flete}
                onChange={(e) => setFormData({ ...formData, flete: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              >
                <option value="Aplica">Aplica</option>
                <option value="No Aplica">No Aplica</option>
              </select>
            </motion.div>

            {/* Flete Utilidad */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <label className="flex items-center gap-2 text-sm text-blue-300 mb-2">
                <DollarSign className="w-4 h-4" />
                Flete Utilidad
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.fleteUtilidad}
                onChange={(e) => setFormData({ ...formData, fleteUtilidad: e.target.value })}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              />
            </motion.div>

            {/* Estatus */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="text-sm text-blue-300 mb-2 block">Estatus</label>
              <select
                value={formData.estatus}
                onChange={(e) => setFormData({ ...formData, estatus: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Pagado">Pagado</option>
              </select>
            </motion.div>

            {/* Concepto */}
            <motion.div
              className="col-span-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <label className="text-sm text-blue-300 mb-2 block">Concepto / Observaciones</label>
              <textarea
                value={formData.concepto}
                onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                placeholder="Detalles adicionales..."
                rows="3"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 resize-none"
              />
            </motion.div>
          </div>

          {/* Campos Calculados */}
          <motion.div
            className="bg-emerald-500/10 border border-emerald-400/30 rounded-xl p-6 mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-emerald-300 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Valores Calculados
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-emerald-300/70 mb-1 block">Ingreso Total</label>
                <p className="text-2xl font-bold text-white">
                  ${parseFloat(formData.ingreso || 0).toLocaleString()}
                </p>
              </div>

              <div>
                <label className="text-sm text-emerald-300/70 mb-1 block">Utilidad</label>
                <p
                  className={`text-2xl font-bold ${parseFloat(formData.utilidad || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}
                >
                  ${parseFloat(formData.utilidad || 0).toLocaleString()}
                </p>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={handleCalculate}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              disabled={isCalculating}
              className="w-full mt-4 px-4 py-3 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-emerald-300 hover:bg-emerald-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isCalculating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full"
                  />
                  Calculando...
                </>
              ) : (
                <>
                  <DollarSign className="w-5 h-5" />
                  Calcular Valores
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Botones de Acción */}
          <div className="flex gap-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-4 bg-blue-500/20 border border-blue-400/30 rounded-xl text-white font-semibold hover:bg-blue-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {ventaExistente ? 'Actualizar Venta' : 'Guardar Venta'}
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
