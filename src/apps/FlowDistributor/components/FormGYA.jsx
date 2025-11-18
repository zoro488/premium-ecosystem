import { useState } from 'react';

import { motion } from 'framer-motion';
import {
  AlertCircle,
  Building2,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Save,
  Tag,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';

/**
 * FORMULARIO GYA - Gastos y Abonos
 * Registro de ingresos, gastos y abonos con validación completa
 */

export default function FormGYA({ onClose, onSave, registroExistente = null }) {
  const tiposOperacion = ['Ingreso', 'Gasto', 'Abono'];
  const destinosDisponibles = [
    'Bóveda USA',
    'Bóveda Monte',
    'Profit',
    'Lefti',
    'Flete Sur',
    'Azteca',
    'Utilidades',
  ];

  const [formData, setFormData] = useState(
    registroExistente || {
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'Gasto',
      destino: 'Bóveda USA',
      monto: '',
      origen: '',
      cuenta: '',
      concepto: '',
      referencia: '',
      categoria: 'Operativo',
    }
  );

  const [errors, setErrors] = useState({});

  // Iconos por tipo
  const getIconByTipo = (tipo) => {
    switch (tipo) {
      case 'Ingreso':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'Gasto':
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      case 'Abono':
        return <CreditCard className="w-5 h-5 text-blue-400" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  // Color por tipo
  const getColorByTipo = (tipo) => {
    switch (tipo) {
      case 'Ingreso':
        return 'green';
      case 'Gasto':
        return 'red';
      case 'Abono':
        return 'blue';
      default:
        return 'gray';
    }
  };

  // Validación
  const validate = () => {
    const newErrors = {};

    if (!formData.fecha) newErrors.fecha = 'Fecha requerida';
    if (!formData.tipo) newErrors.tipo = 'Tipo requerido';
    if (!formData.destino) newErrors.destino = 'Destino requerido';
    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      newErrors.monto = 'Monto debe ser mayor a 0';
    }
    if (!formData.concepto) newErrors.concepto = 'Concepto requerido';

    // Validaciones específicas por tipo
    if (formData.tipo === 'Ingreso' && !formData.origen) {
      newErrors.origen = 'Origen requerido para ingresos';
    }
    if (formData.tipo === 'Gasto' && !formData.categoria) {
      newErrors.categoria = 'Categoría requerida para gastos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      onSave({
        ...formData,
        monto: parseFloat(formData.monto),
        fecha: new Date(formData.fecha),
        id: registroExistente?.id || Date.now(),
      });
    }
  };

  const color = getColorByTipo(formData.tipo);

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
        className={`bg-gradient-to-br from-slate-900 to-${color}-900 border border-${color}-400/30 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <motion.h2
            className="text-2xl font-bold text-white flex items-center gap-3"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
          >
            {getIconByTipo(formData.tipo)}
            {registroExistente ? 'Editar Registro GYA' : 'Nuevo Registro GYA'}
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
          {/* Selector de Tipo - Destacado */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <label className="text-sm text-blue-300 mb-3 block font-semibold">
              Tipo de Operación
            </label>
            <div className="grid grid-cols-3 gap-3">
              {tiposOperacion.map((tipo) => {
                const isSelected = formData.tipo === tipo;
                const btnColor = getColorByTipo(tipo);

                return (
                  <motion.button
                    key={tipo}
                    type="button"
                    onClick={() => setFormData({ ...formData, tipo })}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? `bg-${btnColor}-500/30 border-${btnColor}-400 shadow-lg shadow-${btnColor}-500/30`
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {getIconByTipo(tipo)}
                      <span className="text-white font-semibold">{tipo}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

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
                } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-${color}-400/50`}
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

            {/* Monto */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label className="flex items-center gap-2 text-sm text-blue-300 mb-2">
                <DollarSign className="w-4 h-4" />
                Monto
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                placeholder="0.00"
                className={`w-full px-4 py-3 bg-white/10 border ${
                  errors.monto ? 'border-red-400' : 'border-white/20'
                } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-${color}-400/50`}
              />
              {errors.monto && <p className="text-red-400 text-xs mt-1">{errors.monto}</p>}
            </motion.div>

            {/* Destino */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="flex items-center gap-2 text-sm text-blue-300 mb-2">
                <Building2 className="w-4 h-4" />
                Destino
              </label>
              <select
                value={formData.destino}
                onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                className={`w-full px-4 py-3 bg-white/10 border ${
                  errors.destino ? 'border-red-400' : 'border-white/20'
                } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-${color}-400/50`}
              >
                {destinosDisponibles.map((dest) => (
                  <option key={dest} value={dest}>
                    {dest}
                  </option>
                ))}
              </select>
              {errors.destino && <p className="text-red-400 text-xs mt-1">{errors.destino}</p>}
            </motion.div>

            {/* Origen (solo para Ingresos) */}
            {formData.tipo === 'Ingreso' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <label className="flex items-center gap-2 text-sm text-blue-300 mb-2">
                  <Building2 className="w-4 h-4" />
                  Origen
                </label>
                <input
                  type="text"
                  value={formData.origen}
                  onChange={(e) => setFormData({ ...formData, origen: e.target.value })}
                  placeholder="De dónde proviene el ingreso"
                  className={`w-full px-4 py-3 bg-white/10 border ${
                    errors.origen ? 'border-red-400' : 'border-white/20'
                  } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-green-400/50`}
                />
                {errors.origen && <p className="text-red-400 text-xs mt-1">{errors.origen}</p>}
              </motion.div>
            )}

            {/* Cuenta */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="flex items-center gap-2 text-sm text-blue-300 mb-2">
                <CreditCard className="w-4 h-4" />
                Cuenta
              </label>
              <input
                type="text"
                value={formData.cuenta}
                onChange={(e) => setFormData({ ...formData, cuenta: e.target.value })}
                placeholder="Número de cuenta (opcional)"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              />
            </motion.div>

            {/* Referencia */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <label className="flex items-center gap-2 text-sm text-blue-300 mb-2">
                <FileText className="w-4 h-4" />
                Referencia
              </label>
              <input
                type="text"
                value={formData.referencia}
                onChange={(e) => setFormData({ ...formData, referencia: e.target.value })}
                placeholder="Número de referencia (opcional)"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              />
            </motion.div>

            {/* Categoría (solo para Gastos) */}
            {formData.tipo === 'Gasto' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="flex items-center gap-2 text-sm text-blue-300 mb-2">
                  <Tag className="w-4 h-4" />
                  Categoría
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className={`w-full px-4 py-3 bg-white/10 border ${
                    errors.categoria ? 'border-red-400' : 'border-white/20'
                  } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-400/50`}
                >
                  <option value="Operativo">Operativo</option>
                  <option value="Administrativo">Administrativo</option>
                  <option value="Financiero">Financiero</option>
                  <option value="Comercial">Comercial</option>
                </select>
                {errors.categoria && (
                  <p className="text-red-400 text-xs mt-1">{errors.categoria}</p>
                )}
              </motion.div>
            )}

            {/* Concepto */}
            <motion.div
              className="col-span-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <label className="flex items-center gap-2 text-sm text-blue-300 mb-2">
                <FileText className="w-4 h-4" />
                Concepto
              </label>
              <textarea
                value={formData.concepto}
                onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                placeholder="Descripción del movimiento..."
                rows="4"
                className={`w-full px-4 py-3 bg-white/10 border ${
                  errors.concepto ? 'border-red-400' : 'border-white/20'
                } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 resize-none`}
              />
              {errors.concepto && <p className="text-red-400 text-xs mt-1">{errors.concepto}</p>}
            </motion.div>
          </div>

          {/* Resumen Visual */}
          <motion.div
            className={`bg-${color}-500/10 border border-${color}-400/30 rounded-xl p-6 mb-6`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className={`text-lg font-semibold text-${color}-300 mb-3`}>Resumen del Registro</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Operación</p>
                <p className="text-xl font-bold text-white flex items-center gap-2">
                  {getIconByTipo(formData.tipo)}
                  {formData.tipo}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Monto Total</p>
                <p className={`text-3xl font-bold text-${color}-400`}>
                  ${parseFloat(formData.monto || 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-sm text-gray-400">Destino</p>
              <p className="text-lg text-white font-semibold">{formData.destino}</p>
            </div>
          </motion.div>

          {/* Botones de Acción */}
          <div className="flex gap-4">
            <motion.button
              type="submit"
              whileHover={{
                scale: 1.02,
                boxShadow: `0 10px 30px rgba(${color === 'green' ? '34, 197, 94' : color === 'red' ? '239, 68, 68' : '59, 130, 246'}, 0.3)`,
              }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 px-6 py-4 bg-${color}-500/20 border border-${color}-400/30 rounded-xl text-white font-semibold hover:bg-${color}-500/30 transition-all flex items-center justify-center gap-2`}
            >
              <Save className="w-5 h-5" />
              {registroExistente ? 'Actualizar Registro' : 'Guardar Registro'}
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
