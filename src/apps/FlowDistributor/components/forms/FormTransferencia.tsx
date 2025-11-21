/**
 * 🔄 FormTransferencia - Formulario para transferencias entre bancos
 *
 * Características:
 * - Selección de banco origen y destino
 * - Validación de saldo suficiente
 * - Prevención de transferencias al mismo banco
 * - Actualización automática de ambos bancos
 * - Registro en historial de transferencias
 */
import React, { useState } from 'react';

import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRightLeft,
  Building2,
  Calendar,
  Check,
  DollarSign,
  FileText,
  Loader2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { z } from 'zod';

import { useFlowStore } from '@/stores/flowStore';

import { formatCurrency, formatDateForInput } from '../../utils/formatters';
import { createTransferSchema, validateBankBalance } from '../../utils/validators.ts';

interface FormTransferenciaProps {
  onClose?: () => void;
  onSuccess?: (transferenciaId: string) => void;
}

export const FormTransferencia: React.FC<FormTransferenciaProps> = ({ onClose, onSuccess }) => {
  const { bancos, addTransferencia, updateBankBalance } = useFlowStore();

  // Estados
  const [fecha, setFecha] = useState(formatDateForInput());
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [monto, setMonto] = useState<number>(0);
  const [concepto, setConcepto] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Opciones de bancos
  const bancoOptions = [
    { value: 'bovedaMonte', label: 'Bóveda Monte' },
    { value: 'bovedaUsa', label: 'Bóveda USA' },
    { value: 'azteca', label: 'Banco Azteca' },
    { value: 'leftie', label: 'Leftie' },
    { value: 'fleteSur', label: 'Flete Sur' },
    { value: 'profit', label: 'Profit' },
    { value: 'utilidades', label: 'Utilidades' },
  ];

  // Saldos actuales
  const saldoOrigen = origen ? bancos[origen]?.capitalActual || 0 : 0;
  const saldoDestino = destino ? bancos[destino]?.capitalActual || 0 : 0;

  // Nuevos saldos después de la transferencia
  const nuevoSaldoOrigen = saldoOrigen - monto;
  const nuevoSaldoDestino = saldoDestino + monto;

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

    // Validar origen
    if (!origen || origen.trim() === '') {
      newErrors.origen = 'Debe seleccionar un banco origen';
    }

    // Validar destino
    if (!destino || destino.trim() === '') {
      newErrors.destino = 'Debe seleccionar un banco destino';
    } else if (origen === destino) {
      newErrors.destino = 'El origen y destino deben ser diferentes';
    }

    // Validar monto
    if (monto <= 0) {
      newErrors.monto = 'El monto debe ser mayor a 0';
    } else if (origen) {
      const validation = validateBankBalance(monto, saldoOrigen);
      if (!validation.valid) {
        newErrors.monto = validation.message || 'Saldo insuficiente';
      }
    }

    // Validar concepto
    if (!concepto || concepto.trim() === '') {
      newErrors.concepto = 'El concepto es requerido';
    } else if (concepto.trim().length < 3) {
      newErrors.concepto = 'El concepto debe tener al menos 3 caracteres';
    } else if (concepto.trim().length > 200) {
      newErrors.concepto = 'El concepto no puede exceder 200 caracteres';
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
      // Crear ID único para la transferencia
      const transferenciaId = `T-${Date.now()}-${origen.substring(0, 3).toUpperCase()}`;

      // Crear objeto de transferencia
      const nuevaTransferencia = {
        id: transferenciaId,
        fecha,
        origen,
        destino,
        monto,
        concepto: concepto.trim(),
      };

      // Validar con schema de Zod
      createTransferSchema.parse(nuevaTransferencia);

      // Actualizar banco origen (egreso)
      await updateBankBalance(origen, monto, 'egreso');

      // Actualizar banco destino (ingreso)
      await updateBankBalance(destino, monto, 'ingreso');

      // Agregar transferencia al historial
      await addTransferencia(nuevaTransferencia);

      setSubmitStatus('success');

      // Callback de éxito
      if (onSuccess) {
        onSuccess(transferenciaId);
      }

      // Reset form y cerrar después de 2 segundos
      setTimeout(() => {
        setFecha(formatDateForInput());
        setOrigen('');
        setDestino('');
        setMonto(0);
        setConcepto('');
        setErrors({});
        setSubmitStatus('idle');

        if (onClose) {
          onClose();
        }
      }, 2000);
    } catch (error) {
      console.error('Error al crear transferencia:', error);
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
              'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
          }}
        >
          <div className="flex items-center gap-3">
            <ArrowRightLeft className="w-6 h-6 text-zinc-300" />
            <div>
              <h2 className="text-2xl font-bold text-white">Nueva Transferencia</h2>
              <p className="text-sm text-slate-400">Transferir entre bancos o bóvedas</p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* FECHA */}
          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-zinc-300" />
              <span className="text-sm font-medium text-white">
                Fecha <span className="text-zinc-200">*</span>
              </span>
            </div>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white transition-all ${
                errors.fecha
                  ? 'border-zinc-500 focus:border-red-400'
                  : 'border-white/10 focus:border-zinc-700'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
            {errors.fecha && (
              <motion.p
                className="mt-2 text-sm text-zinc-200 flex items-center gap-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-4 h-4" />
                {errors.fecha}
              </motion.p>
            )}
          </label>

          {/* ORIGEN Y DESTINO */}
          <div className="grid grid-cols-2 gap-4">
            {/* ORIGEN */}
            <label className="block">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-zinc-200" />
                <span className="text-sm font-medium text-white">
                  Origen <span className="text-zinc-200">*</span>
                </span>
              </div>
              <select
                value={origen}
                onChange={(e) => setOrigen(e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white appearance-none cursor-pointer transition-all ${
                  errors.origen
                    ? 'border-zinc-500 focus:border-red-400'
                    : 'border-white/10 focus:border-zinc-700'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              >
                <option value="">Seleccionar...</option>
                {bancoOptions.map((banco) => (
                  <option key={banco.value} value={banco.value}>
                    {banco.label}
                  </option>
                ))}
              </select>
              {origen && (
                <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                  Saldo:{' '}
                  <span className="font-mono text-zinc-300">{formatCurrency(saldoOrigen)}</span>
                </p>
              )}
              {errors.origen && (
                <motion.p
                  className="mt-2 text-sm text-zinc-200 flex items-center gap-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.origen}
                </motion.p>
              )}
            </label>

            {/* DESTINO */}
            <label className="block">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-zinc-200" />
                <span className="text-sm font-medium text-white">
                  Destino <span className="text-zinc-200">*</span>
                </span>
              </div>
              <select
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white appearance-none cursor-pointer transition-all ${
                  errors.destino
                    ? 'border-zinc-500 focus:border-red-400'
                    : 'border-white/10 focus:border-zinc-700'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              >
                <option value="">Seleccionar...</option>
                {bancoOptions
                  .filter((b) => b.value !== origen)
                  .map((banco) => (
                    <option key={banco.value} value={banco.value}>
                      {banco.label}
                    </option>
                  ))}
              </select>
              {destino && (
                <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                  Saldo:{' '}
                  <span className="font-mono text-zinc-300">{formatCurrency(saldoDestino)}</span>
                </p>
              )}
              {errors.destino && (
                <motion.p
                  className="mt-2 text-sm text-zinc-200 flex items-center gap-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.destino}
                </motion.p>
              )}
            </label>
          </div>

          {/* MONTO */}
          <label className="block">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-zinc-300" />
                <span className="text-sm font-medium text-white">
                  Monto <span className="text-zinc-200">*</span>
                </span>
              </div>
              {origen && (
                <span className="text-xs text-slate-400">
                  Disponible: {formatCurrency(saldoOrigen)}
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="number"
                value={monto || ''}
                onChange={(e) => setMonto(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                min="0"
                max={saldoOrigen}
                step="0.01"
                disabled={isSubmitting || !origen}
                className={`w-full pl-8 pr-4 py-3 rounded-lg bg-white/5 border text-white placeholder-slate-400 transition-all ${
                  errors.monto
                    ? 'border-zinc-500 focus:border-red-400'
                    : 'border-white/10 focus:border-zinc-700'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
            </div>
            {errors.monto && (
              <motion.p
                className="mt-2 text-sm text-zinc-200 flex items-center gap-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-4 h-4" />
                {errors.monto}
              </motion.p>
            )}
          </label>

          {/* CONCEPTO */}
          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-zinc-300" />
              <span className="text-sm font-medium text-white">
                Concepto <span className="text-zinc-200">*</span>
              </span>
            </div>
            <textarea
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              placeholder="Motivo de la transferencia..."
              rows={2}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder-slate-400 transition-all ${
                errors.concepto
                  ? 'border-zinc-500 focus:border-red-400'
                  : 'border-white/10 focus:border-zinc-700'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
            <p className="mt-1 text-xs text-slate-400">{concepto.length}/200 caracteres</p>
            {errors.concepto && (
              <motion.p
                className="mt-2 text-sm text-zinc-200 flex items-center gap-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-4 h-4" />
                {errors.concepto}
              </motion.p>
            )}
          </label>

          {/* PREVIEW DE LA TRANSFERENCIA */}
          {monto > 0 && origen && destino && (
            <motion.div
              className="p-4 rounded-lg bg-gradient-to-r from-zinc-800/10 to-indigo-500/10 border border-zinc-700/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-xs text-slate-400 mb-3">Después de la transferencia</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white">
                    {bancoOptions.find((b) => b.value === origen)?.label}:
                  </span>
                  <span className="text-zinc-200 font-mono">{formatCurrency(nuevoSaldoOrigen)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white">
                    {bancoOptions.find((b) => b.value === destino)?.label}:
                  </span>
                  <span className="text-zinc-200 font-mono">
                    {formatCurrency(nuevoSaldoDestino)}
                  </span>
                </div>
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
              disabled={isSubmitting || !origen || !destino || monto <= 0}
              className="flex-1 px-6 py-3 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background:
                  submitStatus === 'success'
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : submitStatus === 'error'
                      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                      : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              }}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Procesando...
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <Check className="w-5 h-5" />
                    ¡Transferido!
                  </>
                ) : submitStatus === 'error' ? (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    Error
                  </>
                ) : (
                  'Realizar Transferencia'
                )}
              </div>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default FormTransferencia;
