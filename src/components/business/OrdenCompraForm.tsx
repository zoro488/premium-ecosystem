/**
 * 📦 ORDEN DE COMPRA FORM
 *
 * Componente premium para crear órdenes de compra con:
 * - Validación Zod
 * - Auto-cálculo de total
 * - Preview de cambios en STK
 * - Integración con businessLogic.ts
 * - Animaciones Framer Motion
 *
 * @author Premium Ecosystem
 * @version 2.0.0
 */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  User,
} from 'lucide-react';
import { z } from 'zod';

import {
  type OrdenCompra,
  getCurrentSTK,
  processOrdenCompra,
  updateDistributorDebt,
} from '@/services/businessLogic';

// ==================== ZOD SCHEMA ====================

const ordenCompraSchema = z.object({
  OC: z
    .string()
    .min(1, 'Número de OC requerido')
    .regex(/^OC\d+$/, 'Formato debe ser OC#### (ej: OC0001)'),
  Fecha: z
    .string()
    .min(1, 'Fecha requerida')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato debe ser YYYY-MM-DD'),
  Distribuidor: z.string().min(2, 'Distribuidor requerido').max(50, 'Máximo 50 caracteres'),
  Cantidad: z
    .number()
    .positive('Cantidad debe ser mayor a 0')
    .int('Cantidad debe ser un número entero'),
  Precio_Compra: z
    .number()
    .positive('Precio debe ser mayor a 0')
    .multipleOf(0.01, 'Máximo 2 decimales'),
  Concepto: z.string().optional(),
});

type OrdenCompraFormData = z.infer<typeof ordenCompraSchema>;

// ==================== PROPS ====================

interface OrdenCompraFormProps {
  onSuccess: (oc: OrdenCompra) => void;
  onCancel: () => void;
}

// ==================== COMPONENT ====================

export const OrdenCompraForm: React.FC<OrdenCompraFormProps> = ({ onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentSTK, setCurrentSTK] = useState<number>(0);
  const [previewSTK, setPreviewSTK] = useState<number>(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<OrdenCompraFormData>({
    resolver: zodResolver(ordenCompraSchema),
    defaultValues: {
      OC: '',
      Fecha: new Date().toISOString().split('T')[0],
      Distribuidor: '',
      Cantidad: 0,
      Precio_Compra: 0,
      Concepto: '',
    },
  });

  // Watch para auto-calcular
  const cantidad = watch('Cantidad');
  const precioCompra = watch('Precio_Compra');

  // Calcular total y preview STK
  const total = cantidad && precioCompra ? cantidad * precioCompra : 0;

  useEffect(() => {
    try {
      const stk = getCurrentSTK();
      setCurrentSTK(stk);
      setPreviewSTK(stk + (cantidad || 0));
    } catch (error) {
      console.error('Error obteniendo STK:', error);
    }
  }, [cantidad]);

  // ==================== SUBMIT HANDLER ====================

  const onSubmit = async (data: OrdenCompraFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Construir OC completa
      const oc: OrdenCompra = {
        ...data,
        Total: total,
      };

      // Procesar OC
      const asientos = processOrdenCompra(oc);

      // Actualizar deuda distribuidor
      updateDistributorDebt(oc.Distribuidor, oc.Total, oc.OC);

      // Success
      setSubmitStatus('success');

      setTimeout(() => {
        onSuccess(oc);
        reset();
      }, 1500);

      console.log('✅ OC creada:', oc);
      console.log('📝 Asientos generados:', asientos);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
      console.error('❌ Error procesando OC:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================== RENDER ====================

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-3xl mx-auto"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Nueva Orden de Compra
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ingresa los datos de la orden de compra al distribuidor
            </p>
          </div>
        </div>

        {/* STK Preview Card */}
        <motion.div
          layout
          className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">STK Actual:</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{currentSTK}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">Nuevo STK:</span>
              <span className="text-xl font-bold text-green-600">{previewSTK}</span>
            </div>
          </div>
        </motion.div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Número OC */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <ShoppingCart className="w-4 h-4" />
              Número de OC *
            </label>
            <input
              {...register('OC')}
              type="text"
              placeholder="OC0001"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.OC
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              } dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:outline-none transition-all`}
            />
            {errors.OC && (
              <p className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.OC.message}
              </p>
            )}
          </div>

          {/* Fecha */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Calendar className="w-4 h-4" />
              Fecha *
            </label>
            <input
              {...register('Fecha')}
              type="date"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.Fecha
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              } dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:outline-none transition-all`}
            />
            {errors.Fecha && (
              <p className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.Fecha.message}
              </p>
            )}
          </div>

          {/* Distribuidor */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <User className="w-4 h-4" />
              Distribuidor *
            </label>
            <input
              {...register('Distribuidor')}
              type="text"
              placeholder="PACMAN, Q-MAYA, etc."
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.Distribuidor
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              } dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:outline-none transition-all`}
            />
            {errors.Distribuidor && (
              <p className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.Distribuidor.message}
              </p>
            )}
          </div>

          {/* Cantidad */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Package className="w-4 h-4" />
              Cantidad *
            </label>
            <input
              {...register('Cantidad', { valueAsNumber: true })}
              type="number"
              min="1"
              step="1"
              placeholder="100"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.Cantidad
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              } dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:outline-none transition-all`}
            />
            {errors.Cantidad && (
              <p className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.Cantidad.message}
              </p>
            )}
          </div>

          {/* Precio Compra */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4" />
              Precio Compra (por unidad) *
            </label>
            <input
              {...register('Precio_Compra', { valueAsNumber: true })}
              type="number"
              min="0.01"
              step="0.01"
              placeholder="150.50"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.Precio_Compra
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              } dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:outline-none transition-all`}
            />
            {errors.Precio_Compra && (
              <p className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.Precio_Compra.message}
              </p>
            )}
          </div>

          {/* Total (Read-only) */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4" />
              Total (automático)
            </label>
            <div className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-bold text-xl">
              ${total.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Concepto */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Concepto (opcional)
          </label>
          <textarea
            {...register('Concepto')}
            rows={3}
            placeholder="Notas adicionales sobre la orden..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"
          />
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900 dark:text-red-300">
                    Error al procesar orden
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-400">{errorMessage}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || submitStatus === 'success'}
            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Procesando...
              </>
            ) : submitStatus === 'success' ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                ¡Orden Creada!
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                Crear Orden
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default OrdenCompraForm;
