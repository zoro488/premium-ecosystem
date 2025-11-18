/**
 * 💰 VENTA FORM
 *
 * Componente premium para registrar ventas con:
 * - Validación Zod
 * - Auto-cálculo Flete ($500/unidad)
 * - Auto-cálculo Utilidades
 * - Preview de asientos contables
 * - Estados de pago (pagado/abonado/pendiente)
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
  AlertTriangle,
  Calendar,
  CheckCircle2,
  DollarSign,
  Package,
  PiggyBank,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Truck,
  User,
} from 'lucide-react';
import { z } from 'zod';

import {
  type Venta,
  getCurrentSTK,
  previewVentaEntries,
  processVenta,
  updateClientDebt,
} from '@/services/businessLogic';

// ==================== ZOD SCHEMA ====================

const ventaSchema = z
  .object({
    Fecha: z
      .string()
      .min(1, 'Fecha requerida')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato debe ser YYYY-MM-DD'),
    Cliente: z.string().min(2, 'Cliente requerido').max(100, 'Máximo 100 caracteres'),
    Cantidad: z
      .number()
      .positive('Cantidad debe ser mayor a 0')
      .int('Cantidad debe ser un número entero'),
    Precio_Venta: z
      .number()
      .positive('Precio de venta debe ser mayor a 0')
      .multipleOf(0.01, 'Máximo 2 decimales'),
    Precio_Compra: z
      .number()
      .positive('Precio de compra debe ser mayor a 0')
      .multipleOf(0.01, 'Máximo 2 decimales'),
    Estado_Pago: z.enum(['pagado', 'abonado', 'pendiente'], {
      required_error: 'Estado de pago es obligatorio',
    }),
    Monto_Abonado: z
      .number()
      .min(0, 'Monto abonado no puede ser negativo')
      .multipleOf(0.01, 'Máximo 2 decimales')
      .optional()
      .default(0),
    Concepto: z.string().optional(),
    Observaciones: z.string().optional(),
  })
  .refine((data) => data.Precio_Venta >= data.Precio_Compra + 500, {
    message: 'Precio venta debe cubrir costo + flete ($500)',
    path: ['Precio_Venta'],
  });

type VentaFormData = z.infer<typeof ventaSchema>;

// ==================== PROPS ====================

interface VentaFormProps {
  onSuccess: (venta: Venta) => void;
  onCancel: () => void;
}

// ==================== COMPONENT ====================

export const VentaForm: React.FC<VentaFormProps> = ({ onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentSTK, setCurrentSTK] = useState<number>(0);
  const [previewData, setPreviewData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<VentaFormData>({
    resolver: zodResolver(ventaSchema),
    defaultValues: {
      Fecha: new Date().toISOString().split('T')[0],
      Cliente: '',
      Cantidad: 0,
      Precio_Venta: 0,
      Precio_Compra: 0,
      Estado_Pago: 'pagado',
      Monto_Abonado: 0,
      Concepto: '',
      Observaciones: '',
    },
  });

  // Watch para auto-calcular
  const cantidad = watch('Cantidad');
  const precioVenta = watch('Precio_Venta');
  const precioCompra = watch('Precio_Compra');
  const estadoPago = watch('Estado_Pago');

  // Calcular montos
  const montoTotal = cantidad && precioVenta ? cantidad * precioVenta : 0;

  // Update STK y preview
  useEffect(() => {
    try {
      const stk = getCurrentSTK();
      setCurrentSTK(stk);

      if (cantidad > 0 && precioVenta > 0 && precioCompra > 0) {
        const preview = previewVentaEntries({
          Cantidad: cantidad,
          Precio_Venta: precioVenta,
          Precio_Compra: precioCompra,
        });
        setPreviewData(preview);
        setShowPreview(true);
      } else {
        setShowPreview(false);
      }
    } catch (error) {
      console.error('Error obteniendo STK:', error);
    }
  }, [cantidad, precioVenta, precioCompra]);

  // ==================== SUBMIT HANDLER ====================

  const onSubmit = async (data: VentaFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Construir Venta completa
      const venta: Venta = {
        id: `V-${Date.now()}`,
        ...data,
        Monto_Total: montoTotal,
        Monto_Abonado: data.Estado_Pago === 'abonado' ? data.Monto_Abonado : 0,
        Deuda_Pendiente:
          data.Estado_Pago === 'abonado'
            ? montoTotal - data.Monto_Abonado
            : data.Estado_Pago === 'pendiente'
              ? montoTotal
              : 0,
      };

      // Procesar Venta
      const asientos = processVenta(venta);

      // Actualizar deuda cliente si aplica
      if (venta.Estado_Pago !== 'pagado') {
        updateClientDebt(venta.Cliente, venta.Monto_Total, venta.Monto_Abonado, venta.id);
      }

      // Success
      setSubmitStatus('success');

      setTimeout(() => {
        onSuccess(venta);
        reset();
      }, 1500);

      console.log('✅ Venta creada:', venta);
      console.log('📝 Asientos generados:', asientos);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
      console.error('❌ Error procesando venta:', error);
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
      className="w-full max-w-4xl mx-auto"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Nueva Venta</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Registra una venta y automáticamente se crearán los asientos contables
            </p>
          </div>
        </div>

        {/* STK Preview Card */}
        <motion.div
          layout
          className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-700"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">STK Actual:</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{currentSTK}</span>
            </div>
            {previewData && (
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">Nuevo STK:</span>
                <span className="text-xl font-bold text-red-600">{previewData.newSTK}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Cliente */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <User className="w-4 h-4" />
              Cliente *
            </label>
            <input
              {...register('Cliente')}
              type="text"
              placeholder="Bódega M-P, Valle, etc."
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.Cliente
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              } dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:outline-none transition-all`}
            />
            {errors.Cliente && (
              <p className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.Cliente.message}
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
              placeholder="50"
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

          {/* Precio Venta */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4" />
              Precio Venta (por unidad) *
            </label>
            <input
              {...register('Precio_Venta', { valueAsNumber: true })}
              type="number"
              min="0.01"
              step="0.01"
              placeholder="200.00"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.Precio_Venta
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              } dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:outline-none transition-all`}
            />
            {errors.Precio_Venta && (
              <p className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.Precio_Venta.message}
              </p>
            )}
          </div>

          {/* Precio Compra */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4" />
              Precio Compra (referencia) *
            </label>
            <input
              {...register('Precio_Compra', { valueAsNumber: true })}
              type="number"
              min="0.01"
              step="0.01"
              placeholder="150.00"
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

          {/* Estado Pago */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <PiggyBank className="w-4 h-4" />
              Estado de Pago *
            </label>
            <select
              {...register('Estado_Pago')}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.Estado_Pago
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              } dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:outline-none transition-all`}
            >
              <option value="pagado">✅ Pagado</option>
              <option value="abonado">💰 Abonado</option>
              <option value="pendiente">⏳ Pendiente</option>
            </select>
            {errors.Estado_Pago && (
              <p className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.Estado_Pago.message}
              </p>
            )}
          </div>
        </div>

        {/* Monto Abonado (si estado = abonado) */}
        <AnimatePresence>
          {estadoPago === 'abonado' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <DollarSign className="w-4 h-4" />
                Monto Abonado
              </label>
              <input
                {...register('Monto_Abonado', { valueAsNumber: true })}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Monto Total */}
        <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-300 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Monto Total:
            </span>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              ${montoTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Preview Asientos Contables */}
        <AnimatePresence>
          {showPreview && previewData && estadoPago === 'pagado' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700 space-y-4"
            >
              <div className="flex items-center gap-2 pb-3 border-b border-blue-300 dark:border-blue-600">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  Preview Asientos Contables
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Bóveda Monte */}
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Bóveda Monte
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ingreso</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${previewData.bovedaMonte.toFixed(2)}
                  </p>
                </div>

                {/* Flete Sur */}
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-orange-200 dark:border-orange-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Flete Sur
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Gasto</p>
                  <p className="text-2xl font-bold text-orange-600">
                    ${previewData.fleteSur.toFixed(2)}
                  </p>
                </div>

                {/* Utilidades */}
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700">
                  <div className="flex items-center gap-2 mb-2">
                    <PiggyBank className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Utilidades
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Ingreso (Margen: {previewData.margenPorcentaje.toFixed(2)}%)
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    ${previewData.utilidades.toFixed(2)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Concepto y Observaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Concepto (opcional)
            </label>
            <textarea
              {...register('Concepto')}
              rows={3}
              placeholder="Descripción de la venta..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Observaciones (opcional)
            </label>
            <textarea
              {...register('Observaciones')}
              rows={3}
              placeholder="Notas adicionales..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"
            />
          </div>
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
                    Error al procesar venta
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
            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Procesando...
              </>
            ) : submitStatus === 'success' ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                ¡Venta Registrada!
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                Registrar Venta
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default VentaForm;
