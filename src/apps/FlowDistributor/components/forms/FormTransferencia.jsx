// 🔄 FORM TRANSFERENCIA
// Formulario para crear transferencias entre bóvedas (NUEVA FUNCIONALIDAD)
import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, ArrowRightLeft, CheckCircle, DollarSign } from 'lucide-react';

import { useBancos } from '../../hooks/useBancos';
import { useExchangeRate } from '../../hooks/useExchangeRate';
import { useTransferencias } from '../../hooks/useTransferencias';
import {
  formatBovedaName,
  formatCurrency,
  formatCurrencyMXN,
  formatExchangeRate,
} from '../../utils/formatters';
import { validateTransferencia } from '../../utils/validators';

export const FormTransferencia = ({ onSuccess, onCancel }) => {
  const { exchangeRate, usdToMxn, mxnToUsd } = useExchangeRate();
  const { crearTransferencia, loading } = useTransferencias();
  const { todasBovedas, saldos } = useBancos();

  const [formData, setFormData] = useState({
    origenBoveda: '',
    destinoBoveda: '',
    montoUSD: '',
    concepto: '',
    tipoConversion: 'USD_A_MXN', // Para Profit casa de cambio
  });

  const [errors, setErrors] = useState({});
  const [saldoOrigen, setSaldoOrigen] = useState(0);

  // Actualizar saldo origen cuando cambia la bóveda
  useEffect(() => {
    if (formData.origenBoveda && saldos) {
      setSaldoOrigen(saldos[formData.origenBoveda] || 0);
    } else {
      setSaldoOrigen(0);
    }
  }, [formData.origenBoveda, saldos]);

  // Calcular equivalente en MXN
  const montoMXN = formData.montoUSD ? usdToMxn(parseFloat(formData.montoUSD)) : 0;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo cuando el usuario escribe
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
    const validation = validateTransferencia(formData, saldoOrigen);

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    // Crear transferencia
    const result = await crearTransferencia({
      ...formData,
      montoUSD: parseFloat(formData.montoUSD),
      montoMXN,
      tipoCambioAplicado: exchangeRate.rate,
      fecha: new Date().toISOString(),
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
        <div className="p-3 rounded-xl bg-primary/20">
          <ArrowRightLeft className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white font-display">Nueva Transferencia</h2>
          <p className="text-white/60 text-sm">Transferir fondos entre bóvedas en USD</p>
        </div>
      </div>

      {/* Tipo de cambio actual */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm">Tipo de Cambio Actual</p>
            <p className="text-white text-lg font-bold">{formatExchangeRate(exchangeRate.rate)}</p>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-xs">Fuente: {exchangeRate.source}</p>
            <p className="text-white/40 text-xs">
              {new Date(exchangeRate.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bóveda Origen */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Bóveda Origen</label>
          <select
            value={formData.origenBoveda}
            onChange={(e) => handleChange('origenBoveda', e.target.value)}
            className={`
              w-full
              backdrop-blur-md
              bg-white/5
              border ${errors.origenBoveda ? 'border-error/50' : 'border-white/10'}
              rounded-lg
              px-4 py-3
              text-white
              focus:outline-none
              focus:border-primary/50
              focus:ring-2
              focus:ring-primary/20
              transition-all
            `}
          >
            <option value="" className="bg-gray-900">
              Seleccionar bóveda origen...
            </option>
            {todasBovedas.map((boveda) => (
              <option key={boveda.codigo} value={boveda.codigo} className="bg-gray-900">
                {boveda.nombre} - {formatCurrency(saldos[boveda.codigo] || 0)}
              </option>
            ))}
          </select>
          {errors.origenBoveda && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-error mt-1 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.origenBoveda}
            </motion.p>
          )}
          {formData.origenBoveda && (
            <p className="text-sm text-white/60 mt-1">
              Saldo disponible: {formatCurrency(saldoOrigen)}
            </p>
          )}
        </div>

        {/* Dirección visual */}
        {formData.origenBoveda && formData.destinoBoveda && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 py-4"
          >
            <span className="px-4 py-2 rounded-lg bg-primary/20 text-primary font-medium">
              {formatBovedaName(formData.origenBoveda)}
            </span>
            <ArrowRight className="w-6 h-6 text-primary" />
            <span className="px-4 py-2 rounded-lg bg-success/20 text-success font-medium">
              {formatBovedaName(formData.destinoBoveda)}
            </span>
          </motion.div>
        )}

        {/* Bóveda Destino */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Bóveda Destino</label>
          <select
            value={formData.destinoBoveda}
            onChange={(e) => handleChange('destinoBoveda', e.target.value)}
            className={`
              w-full
              backdrop-blur-md
              bg-white/5
              border ${errors.destinoBoveda ? 'border-error/50' : 'border-white/10'}
              rounded-lg
              px-4 py-3
              text-white
              focus:outline-none
              focus:border-primary/50
              focus:ring-2
              focus:ring-primary/20
              transition-all
            `}
          >
            <option value="" className="bg-gray-900">
              Seleccionar bóveda destino...
            </option>
            {todasBovedas
              .filter((b) => b.codigo !== formData.origenBoveda)
              .map((boveda) => (
                <option key={boveda.codigo} value={boveda.codigo} className="bg-gray-900">
                  {boveda.nombre}
                </option>
              ))}
          </select>
          {errors.destinoBoveda && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-error mt-1 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.destinoBoveda}
            </motion.p>
          )}
        </div>

        {/* Monto USD */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Monto en USD</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <DollarSign className="w-5 h-5 text-white/40" />
            </div>
            <input
              type="number"
              step="0.01"
              value={formData.montoUSD}
              onChange={(e) => handleChange('montoUSD', e.target.value)}
              placeholder="0.00"
              className={`
                w-full
                backdrop-blur-md
                bg-white/5
                border ${errors.montoUSD ? 'border-error/50' : 'border-white/10'}
                rounded-lg
                pl-10 pr-4 py-3
                text-white
                placeholder:text-white/40
                focus:outline-none
                focus:border-primary/50
                focus:ring-2
                focus:ring-primary/20
                transition-all
              `}
            />
          </div>
          {errors.montoUSD && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-error mt-1 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.montoUSD}
            </motion.p>
          )}
          {formData.montoUSD && parseFloat(formData.montoUSD) > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 p-3 rounded-lg bg-primary/10 border border-primary/20"
            >
              <p className="text-white/60 text-sm">Equivalente en MXN:</p>
              <p className="text-white text-lg font-bold">{formatCurrencyMXN(montoMXN)}</p>
            </motion.div>
          )}
        </div>

        {/* Concepto */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Concepto</label>
          <textarea
            value={formData.concepto}
            onChange={(e) => handleChange('concepto', e.target.value)}
            placeholder="Describe el motivo de la transferencia..."
            rows={3}
            className={`
              w-full
              backdrop-blur-md
              bg-white/5
              border ${errors.concepto ? 'border-error/50' : 'border-white/10'}
              rounded-lg
              px-4 py-3
              text-white
              placeholder:text-white/40
              focus:outline-none
              focus:border-primary/50
              focus:ring-2
              focus:ring-primary/20
              transition-all
              resize-none
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
            className="flex-1 px-6 py-3 bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 border border-primary/30 rounded-lg text-white font-medium shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Procesando...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Crear Transferencia
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default FormTransferencia;
