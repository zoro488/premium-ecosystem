/**
 * 💸 FormGasto - Formulario para registrar gastos
 *
 * Características:
 * - Formulario simple de 4 campos (fecha, concepto, monto, destino)
 * - Validación con Zod
 * - Selección de banco destino
 * - Actualización automática del balance bancario
 * - Integración con store
 */
import React, { useState } from 'react';

import { motion } from 'framer-motion';
import {
  AlertCircle,
  Building2,
  Calendar,
  Check,
  DollarSign,
  FileText,
  Loader2,
  Receipt,
} from 'lucide-react';
import { z } from 'zod';

import { useFlowStore } from '@/stores/flowStore';

import { formatCurrency, formatDateForInput } from '../../utils/formatters';
import { createExpenseSchema } from '../../utils/validators.ts';

interface FormGastoProps {
  onClose?: () => void;
  onSuccess?: (gastoId: string) => void;
}

export const FormGasto: React.FC<FormGastoProps> = ({ onClose, onSuccess }) => {
  const { addGasto, updateBankBalance, bancos } = useFlowStore();

  // Estados
  const [fecha, setFecha] = useState(formatDateForInput());
  const [concepto, setConcepto] = useState('');
  const [monto, setMonto] = useState<number>(0);
  const [destino, setDestino] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Opciones de bancos destino
  const bancoOptions = [
    { value: 'bovedaMonte', label: 'Gasto Bóveda Monte' },
    { value: 'bovedaUsa', label: 'Gasto Bóveda USA' },
    { value: 'azteca', label: 'Gasto Banco Azteca' },
    { value: 'leftie', label: 'Gasto Leftie' },
    { value: 'fleteSur', label: 'Gasto Flete Sur' },
    { value: 'profit', label: 'Gasto Profit' },
    { value: 'utilidades', label: 'Gasto Utilidades' },
  ];

  // Validar formulario
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar fecha
    if (!fecha || fecha.trim() === '') {
      newErrors.fecha = 'La fecha es requerida';
    } else {
      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) {
        newErrors.fecha = 'Fecha inválida';
      }
    }

    // Validar concepto
    if (!concepto || concepto.trim() === '') {
      newErrors.concepto = 'El concepto es requerido';
    } else if (concepto.trim().length < 3) {
      newErrors.concepto = 'El concepto debe tener al menos 3 caracteres';
    } else if (concepto.trim().length > 500) {
      newErrors.concepto = 'El concepto no puede exceder 500 caracteres';
    }

    // Validar monto
    if (monto <= 0) {
      newErrors.monto = 'El monto debe ser mayor a 0';
    } else if (monto > 100_000_000) {
      newErrors.monto = 'El monto máximo es $100,000,000';
    }

    // Validar destino
    if (!destino || destino.trim() === '') {
      newErrors.destino = 'Debe seleccionar un banco destino';
    }

    // Validar saldo suficiente
    if (destino && bancos[destino]) {
      const saldoActual = bancos[destino].capitalActual || 0;
      if (monto > saldoActual) {
        newErrors.monto = `Saldo insuficiente en ${
          bancoOptions.find((b) => b.value === destino)?.label
        }. Disponible: ${formatCurrency(saldoActual)}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Crear ID único para el gasto
      const gastoId = `G-${Date.now()}-${destino.substring(0, 3).toUpperCase()}`;

      // Crear objeto de gasto
      const nuevoGasto = {
        id: gastoId,
        fecha,
        concepto: concepto.trim(),
        monto,
        destino,
      };

      // Validar con schema de Zod
      createExpenseSchema.parse(nuevoGasto);

      // Agregar gasto al store
      await addGasto(nuevoGasto);

      // Actualizar balance del banco (egreso)
      await updateBankBalance(destino, monto, 'egreso');

      setSubmitStatus('success');

      // Callback de éxito
      if (onSuccess) {
        onSuccess(gastoId);
      }

      // Reset form y cerrar después de 2 segundos
      setTimeout(() => {
        setFecha(formatDateForInput());
        setConcepto('');
        setMonto(0);
        setDestino('');
        setErrors({});
        setSubmitStatus('idle');

        if (onClose) {
          onClose();
        }
      }, 2000);
    } catch (error) {
      console.error('Error al crear gasto:', error);
      setSubmitStatus('error');

      if (error instanceof z.ZodError) {
        const zodErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            zodErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(zodErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {/* HEADER */}
        <div
          className="px-6 py-5 border-b border-white/10"
          style={{
            background:
              'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
          }}
        >
          <div className="flex items-center gap-3">
            <Receipt className="w-6 h-6 text-red-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Registrar Gasto</h2>
              <p className="text-sm text-slate-400">Ingresa los detalles del gasto</p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* FECHA */}
          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-white">
                Fecha <span className="text-red-400">*</span>
              </span>
            </div>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white transition-all ${
                errors.fecha
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-white/10 focus:border-red-500'
              } focus:outline-none focus:ring-2 focus:ring-red-500/20`}
            />
            {errors.fecha && (
              <motion.p
                className="mt-2 text-sm text-red-400 flex items-center gap-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-4 h-4" />
                {errors.fecha}
              </motion.p>
            )}
          </label>

          {/* CONCEPTO */}
          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-white">
                Concepto <span className="text-red-400">*</span>
              </span>
            </div>
            <textarea
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              placeholder="Describe el gasto..."
              rows={3}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder-slate-400 transition-all ${
                errors.concepto
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-white/10 focus:border-red-500'
              } focus:outline-none focus:ring-2 focus:ring-red-500/20`}
            />
            <p className="mt-1 text-xs text-slate-400">{concepto.length}/500 caracteres</p>
            {errors.concepto && (
              <motion.p
                className="mt-2 text-sm text-red-400 flex items-center gap-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-4 h-4" />
                {errors.concepto}
              </motion.p>
            )}
          </label>

          {/* MONTO */}
          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-white">
                Monto <span className="text-red-400">*</span>
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="number"
                value={monto || ''}
                onChange={(e) => setMonto(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                min="0"
                step="0.01"
                disabled={isSubmitting}
                className={`w-full pl-8 pr-4 py-3 rounded-lg bg-white/5 border text-white placeholder-slate-400 transition-all ${
                  errors.monto
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-white/10 focus:border-red-500'
                } focus:outline-none focus:ring-2 focus:ring-red-500/20`}
              />
            </div>
            {errors.monto && (
              <motion.p
                className="mt-2 text-sm text-red-400 flex items-center gap-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-4 h-4" />
                {errors.monto}
              </motion.p>
            )}
          </label>

          {/* DESTINO (BANCO) */}
          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-white">
                Banco Destino <span className="text-red-400">*</span>
              </span>
            </div>
            <select
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white appearance-none cursor-pointer transition-all ${
                errors.destino
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-white/10 focus:border-red-500'
              } focus:outline-none focus:ring-2 focus:ring-red-500/20`}
            >
              <option value="">Seleccionar banco...</option>
              {bancoOptions.map((banco) => (
                <option key={banco.value} value={banco.value}>
                  {banco.label}
                </option>
              ))}
            </select>
            {destino && bancos[destino] && (
              <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                Saldo disponible:{' '}
                <span className="font-mono text-green-400">
                  {formatCurrency(bancos[destino].capitalActual || 0)}
                </span>
              </p>
            )}
            {errors.destino && (
              <motion.p
                className="mt-2 text-sm text-red-400 flex items-center gap-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-4 h-4" />
                {errors.destino}
              </motion.p>
            )}
          </label>

          {/* INFO BOX */}
          {monto > 0 && destino && (
            <motion.div
              className="p-4 rounded-lg bg-red-500/10 border border-red-500/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-white">Se deducirá del banco:</span>
                <span className="text-xl font-bold text-red-300">-{formatCurrency(monto)}</span>
              </div>
            </motion.div>
          )}

          {/* BOTONES */}
          <div className="flex gap-3 pt-4">
            {onClose && (
              <motion.button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 rounded-lg bg-white/5 text-white font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                Cancelar
              </motion.button>
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background:
                  submitStatus === 'success'
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : submitStatus === 'error'
                      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                      : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              }}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Registrando...
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <Check className="w-5 h-5" />
                    ¡Registrado!
                  </>
                ) : submitStatus === 'error' ? (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    Error
                  </>
                ) : (
                  'Registrar Gasto'
                )}
              </div>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default FormGasto;
