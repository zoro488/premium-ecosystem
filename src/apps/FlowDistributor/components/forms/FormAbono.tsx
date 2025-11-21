/**
 * 💳 FormAbono - Formulario para registrar abonos a ventas
 *
 * Características:
 * - Selección de venta pendiente con filtro
 * - Validación de monto <= adeudo
 * - Actualización automática de estadoPago
 * - Cálculo de nuevo adeudo
 * - Integración con store
 */
import React, { useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  Check,
  CreditCard,
  DollarSign,
  FileText,
  Loader2,
  TrendingDown,
} from 'lucide-react';
import { z } from 'zod';

import { useFlowStore } from '@/stores/flowStore';

import { calculateDebt, calculatePaymentStatus } from '../../utils/calculations.ts';
import { formatCurrency, formatDate, formatDateForInput } from '../../utils/formatters';
import { createPaymentSchema, validatePaymentAmount } from '../../utils/validators.ts';

interface FormAbonoProps {
  ventaIdPreseleccionada?: string;
  onClose?: () => void;
  onSuccess?: (abonoId: string) => void;
}

export const FormAbono: React.FC<FormAbonoProps> = ({
  ventaIdPreseleccionada,
  onClose,
  onSuccess,
}) => {
  const { ventas, updateVenta, addAbono } = useFlowStore();

  // Filtrar solo ventas pendientes o con adeudo
  const ventasPendientes = useMemo(() => {
    return ventas.filter(
      (v) =>
        v.estadoPago === 'Pendiente' || v.estadoPago === 'Parcial' || (v.adeudo && v.adeudo > 0)
    );
  }, [ventas]);

  // Estados
  const [ventaId, setVentaId] = useState(ventaIdPreseleccionada || '');
  const [fecha, setFecha] = useState(formatDateForInput());
  const [monto, setMonto] = useState<number>(0);
  const [concepto, setConcepto] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Venta seleccionada
  const ventaSeleccionada = useMemo(() => {
    return ventas.find((v) => v.id === ventaId);
  }, [ventas, ventaId]);

  // Datos de la venta
  const adeudoActual = ventaSeleccionada?.adeudo || 0;
  const montoPagadoActual = ventaSeleccionada?.montoPagado || 0;
  const totalVenta = ventaSeleccionada?.totalVenta || 0;

  // Cálculos después del abono
  const nuevoAdeudo = Math.max(0, adeudoActual - monto);
  const nuevoMontoPagado = montoPagadoActual + monto;
  const nuevoEstadoPago = calculatePaymentStatus(totalVenta, nuevoMontoPagado);

  // Validar formulario
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar venta seleccionada
    if (!ventaId || ventaId.trim() === '') {
      newErrors.ventaId = 'Debe seleccionar una venta';
    } else if (!ventaSeleccionada) {
      newErrors.ventaId = 'La venta seleccionada no existe';
    }

    // Validar fecha
    if (!fecha || fecha.trim() === '') {
      newErrors.fecha = 'La fecha es requerida';
    } else {
      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) {
        newErrors.fecha = 'Fecha inválida';
      }
    }

    // Validar monto
    if (monto <= 0) {
      newErrors.monto = 'El monto debe ser mayor a 0';
    } else if (!validatePaymentAmount(monto, adeudoActual)) {
      newErrors.monto = `El monto no puede exceder el adeudo actual: ${formatCurrency(
        adeudoActual
      )}`;
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
      // Crear ID único para el abono
      const abonoId = `A-${Date.now()}-${ventaId}`;

      // Crear objeto de abono
      const nuevoAbono = {
        id: abonoId,
        ventaId,
        fecha,
        monto,
        concepto: concepto.trim() || `Abono a venta ${ventaId}`,
      };

      // Validar con schema de Zod
      createPaymentSchema.parse(nuevoAbono);

      // Actualizar venta
      await updateVenta(ventaId, {
        montoPagado: nuevoMontoPagado,
        adeudo: nuevoAdeudo,
        estadoPago: nuevoEstadoPago,
      });

      // Agregar abono al historial
      await addAbono(nuevoAbono);

      setSubmitStatus('success');

      // Callback de éxito
      if (onSuccess) {
        onSuccess(abonoId);
      }

      // Reset form y cerrar después de 2 segundos
      setTimeout(() => {
        setVentaId(ventaIdPreseleccionada || '');
        setFecha(formatDateForInput());
        setMonto(0);
        setConcepto('');
        setErrors({});
        setSubmitStatus('idle');

        if (onClose) {
          onClose();
        }
      }, 2000);
    } catch (error) {
      console.error('Error al crear abono:', error);
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

  // Botón rápido para pagar monto completo
  const handlePayFull = () => {
    setMonto(adeudoActual);
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
              'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%)',
          }}
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-zinc-200" />
            <div>
              <h2 className="text-2xl font-bold text-white">Registrar Abono</h2>
              <p className="text-sm text-slate-400">Pago a venta pendiente</p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* SELECTOR DE VENTA */}
          <label className="block">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-200" />
                <span className="text-sm font-medium text-white">
                  Venta <span className="text-zinc-200">*</span>
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {ventasPendientes.length} ventas pendientes
              </span>
            </div>
            <select
              value={ventaId}
              onChange={(e) => setVentaId(e.target.value)}
              disabled={isSubmitting || !!ventaIdPreseleccionada}
              className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white appearance-none cursor-pointer transition-all ${
                errors.ventaId
                  ? 'border-zinc-500 focus:border-red-400'
                  : 'border-white/10 focus:border-zinc-500'
              } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
            >
              <option value="">Seleccionar venta...</option>
              {ventasPendientes.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.id} - {v.cliente} - Adeudo: {formatCurrency(v.adeudo || 0)}
                </option>
              ))}
            </select>
            {errors.ventaId && (
              <motion.p
                className="mt-2 text-sm text-zinc-200 flex items-center gap-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-4 h-4" />
                {errors.ventaId}
              </motion.p>
            )}
          </label>

          {/* INFO DE LA VENTA SELECCIONADA */}
          {ventaSeleccionada && (
            <motion.div
              className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Cliente</p>
                  <p className="text-white font-medium">{ventaSeleccionada.cliente}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Fecha</p>
                  <p className="text-white font-medium">{formatDate(ventaSeleccionada.fecha)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Total Venta</p>
                  <p className="text-white font-mono">{formatCurrency(totalVenta)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Pagado</p>
                  <p className="text-zinc-200 font-mono">{formatCurrency(montoPagadoActual)}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-white/10">
                <p className="text-xs text-slate-400 mb-1">Adeudo Actual</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-zinc-200">
                    {formatCurrency(adeudoActual)}
                  </p>
                  <button
                    type="button"
                    onClick={handlePayFull}
                    disabled={isSubmitting}
                    className="px-3 py-1.5 rounded-lg bg-zinc-9000/20 text-green-300 text-sm hover:bg-zinc-9000/30 transition-colors"
                  >
                    Pagar completo
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* FECHA */}
          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-zinc-200" />
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
                  : 'border-white/10 focus:border-zinc-500'
              } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
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

          {/* MONTO */}
          <label className="block">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-zinc-200" />
                <span className="text-sm font-medium text-white">
                  Monto <span className="text-zinc-200">*</span>
                </span>
              </div>
              {ventaSeleccionada && (
                <span className="text-xs text-slate-400">
                  Máximo: {formatCurrency(adeudoActual)}
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
                max={adeudoActual}
                step="0.01"
                disabled={isSubmitting || !ventaId}
                className={`w-full pl-8 pr-4 py-3 rounded-lg bg-white/5 border text-white placeholder-slate-400 transition-all ${
                  errors.monto
                    ? 'border-zinc-500 focus:border-red-400'
                    : 'border-white/10 focus:border-zinc-500'
                } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
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

          {/* CONCEPTO OPCIONAL */}
          <label className="block">
            <span className="text-sm font-medium text-white mb-2 block">Concepto (opcional)</span>
            <input
              type="text"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              placeholder="Notas adicionales..."
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
          </label>

          {/* PREVIEW DESPUÉS DEL ABONO */}
          {monto > 0 && ventaSeleccionada && (
            <motion.div
              className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-zinc-500/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                Después del abono
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white">Monto Pagado:</span>
                  <span className="text-zinc-200 font-mono">
                    {formatCurrency(nuevoMontoPagado)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white">Nuevo Adeudo:</span>
                  <span className="text-zinc-200 font-mono font-bold">
                    {formatCurrency(nuevoAdeudo)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-white/10">
                  <span className="text-white">Nuevo Estado:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      nuevoEstadoPago === 'Pagado'
                        ? 'bg-zinc-9000/20 text-green-300'
                        : nuevoEstadoPago === 'Parcial'
                          ? 'bg-zinc-9000/20 text-yellow-300'
                          : 'bg-zinc-9000/20 text-red-300'
                    }`}
                  >
                    {nuevoEstadoPago}
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
              disabled={isSubmitting || !ventaId || monto <= 0}
              className="flex-1 px-6 py-3 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background:
                  submitStatus === 'success'
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : submitStatus === 'error'
                      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                      : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
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
                  'Registrar Abono'
                )}
              </div>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default FormAbono;
