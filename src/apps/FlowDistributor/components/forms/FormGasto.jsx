// 💸 FORM GASTO
// Formulario para registrar gastos en una bóveda
import { useState } from 'react';

import { motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  DollarSign,
  FileText,
  Tag,
  TrendingDown,
  User,
} from 'lucide-react';

import { useBancos } from '../../hooks/useBancos';
import { formatCurrency } from '../../utils/formatters';
import { validateGasto } from '../../utils/validators';

export const FormGasto = ({ bovedaId, bovedaNombre, onSuccess, onCancel }) => {
  const { agregarGasto, loading } = useBancos(bovedaId);

  const [formData, setFormData] = useState({
    concepto: '',
    monto: '',
    categoria: 'OPERATIVO',
    beneficiario: '',
    referencia: '',
    fecha: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});

  const categorias = [
    'OPERATIVO',
    'ADMINISTRATIVO',
    'NOMINA',
    'SERVICIOS',
    'MANTENIMIENTO',
    'MARKETING',
    'IMPUESTOS',
    'PAGO_DISTRIBUIDOR',
    'OTRO',
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar
    const validation = validateGasto(formData);

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    // Crear gasto
    const result = await agregarGasto(bovedaId, {
      ...formData,
      monto: parseFloat(formData.monto),
    });

    if (result.success) {
      onSuccess?.(result.data);
    } else {
      setErrors({ submit: result.error });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="backdrop-blur-xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-error/20">
          <TrendingDown className="w-6 h-6 text-error" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white font-display">Nuevo Gasto</h2>
          <p className="text-white/60 text-sm">{bovedaNombre || 'Bóveda'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Fecha */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Fecha
          </label>
          <input
            type="date"
            value={formData.fecha}
            onChange={(e) => handleChange('fecha', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className={`
              w-full backdrop-blur-md bg-white/5
              border ${errors.fecha ? 'border-error/50' : 'border-white/10'}
              rounded-lg px-4 py-3 text-white
              focus:outline-none focus:border-error/50 focus:ring-2 focus:ring-error/20
              transition-all
            `}
          />
          {errors.fecha && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-error mt-1 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.fecha}
            </motion.p>
          )}
        </div>

        {/* Concepto */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            Concepto
          </label>
          <textarea
            value={formData.concepto}
            onChange={(e) => handleChange('concepto', e.target.value)}
            placeholder="Describe el gasto..."
            rows={3}
            className={`
              w-full backdrop-blur-md bg-white/5
              border ${errors.concepto ? 'border-error/50' : 'border-white/10'}
              rounded-lg px-4 py-3 text-white placeholder:text-white/40
              focus:outline-none focus:border-error/50 focus:ring-2 focus:ring-error/20
              transition-all resize-none
            `}
          />
          {errors.concepto && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-error mt-1 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.concepto}
            </motion.p>
          )}
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            <Tag className="w-4 h-4 inline mr-2" />
            Categoría
          </label>
          <select
            value={formData.categoria}
            onChange={(e) => handleChange('categoria', e.target.value)}
            className={`
              w-full backdrop-blur-md bg-white/5
              border ${errors.categoria ? 'border-error/50' : 'border-white/10'}
              rounded-lg px-4 py-3 text-white
              focus:outline-none focus:border-error/50 focus:ring-2 focus:ring-error/20
              transition-all
            `}
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat} className="bg-gray-900">
                {cat.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          {errors.categoria && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-error mt-1 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.categoria}
            </motion.p>
          )}
        </div>

        {/* Beneficiario */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Beneficiario
          </label>
          <input
            type="text"
            value={formData.beneficiario}
            onChange={(e) => handleChange('beneficiario', e.target.value)}
            placeholder="Nombre del proveedor o beneficiario"
            className="w-full backdrop-blur-md bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-error/50 focus:ring-2 focus:ring-error/20 transition-all"
          />
        </div>

        {/* Monto USD */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            <DollarSign className="w-4 h-4 inline mr-2" />
            Monto en USD
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <DollarSign className="w-5 h-5 text-error/60" />
            </div>
            <input
              type="number"
              step="0.01"
              value={formData.monto}
              onChange={(e) => handleChange('monto', e.target.value)}
              placeholder="0.00"
              className={`
                w-full backdrop-blur-md bg-white/5
                border ${errors.monto ? 'border-error/50' : 'border-white/10'}
                rounded-lg pl-10 pr-4 py-3 text-white text-xl font-bold placeholder:text-white/40
                focus:outline-none focus:border-error/50 focus:ring-2 focus:ring-error/20
                transition-all
              `}
            />
          </div>
          {errors.monto && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-error mt-1 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.monto}
            </motion.p>
          )}
          {formData.monto && parseFloat(formData.monto) > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 p-3 rounded-lg bg-error/10 border border-error/20"
            >
              <p className="text-error text-lg font-bold">
                -{formatCurrency(parseFloat(formData.monto))}
              </p>
            </motion.div>
          )}
        </div>

        {/* Referencia */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Referencia (Opcional)
          </label>
          <input
            type="text"
            value={formData.referencia}
            onChange={(e) => handleChange('referencia', e.target.value)}
            placeholder="Número de factura, folio, etc."
            className="w-full backdrop-blur-md bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-error/50 focus:ring-2 focus:ring-error/20 transition-all"
          />
        </div>

        {/* Error general */}
        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-error/10 border border-error/20"
          >
            <p className="text-error text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {errors.submit}
            </p>
          </motion.div>
        )}

        {/* Botones */}
        <div className="flex items-center gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-error/20 to-error/30 hover:from-error/30 hover:to-error/40 border border-error/30 rounded-lg text-white font-medium shadow-lg shadow-error/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Guardando...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Registrar Gasto
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default FormGasto;
