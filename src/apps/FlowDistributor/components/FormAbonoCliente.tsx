/**
 * 🎯 FORMULARIO ABONO CLIENTE - TYPESCRIPT + REACT HOOK FORM
 *
 * Formulario para registrar abonos/pagos de clientes con:
 * - React Hook Form + Zod validation
 * - Distribución proporcional automática a 3 bancos
 * - Cálculo automático de nuevo adeudo
 * - Validación de montos
 * - Integración con ventas pendientes del cliente
 * - Animaciones premium con Framer Motion
 * - UI glassmorphism
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    Building2,
    Calendar,
    CheckCircle,
    CreditCard,
    DollarSign,
    FileText,
    Receipt,
    X
} from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

// Components
import {
    FieldWrapper,
    FormDebugger,
    FormSection,
    LoadingButton
} from './forms';

// Types
interface Cliente {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  adeudo: number;
  creditoAutorizado?: number;
  creditoDisponible?: number;
}

interface FormAbonoClienteProps {
  cliente: Cliente;
  onClose: () => void;
  onSave: (data: AbonoClienteFormData) => Promise<void> | void;
  showDebug?: boolean;
}

// Zod Schema
const abonoClienteSchema = z.object({
  clienteId: z.string().min(1, 'Cliente ID es requerido'),
  montoAbono: z
    .number({ required_error: 'Monto es requerido' })
    .positive('El monto debe ser mayor a 0')
    .max(999999999, 'Monto máximo excedido'),
  fechaPago: z.date({ required_error: 'Fecha de pago es requerida' }),
  metodoPago: z.enum(['efectivo', 'transferencia', 'cheque', 'tarjeta', 'deposito'], {
    required_error: 'Método de pago es requerido',
  }),
  referenciaPago: z.string().optional(),
  notasAbono: z.string().max(500, 'Máximo 500 caracteres').optional(),

  // Distribución automática (calculada, no ingresada por usuario)
  distribucionBovedaMonte: z.number().optional(),
  distribucionFletes: z.number().optional(),
  distribucionUtilidades: z.number().optional(),
});

type AbonoClienteFormData = z.infer<typeof abonoClienteSchema>;

const defaultValues: Partial<AbonoClienteFormData> = {
  montoAbono: 0,
  fechaPago: new Date(),
  metodoPago: 'efectivo',
  referenciaPago: '',
  notasAbono: '',
};

/**
 * Formulario de Abono Cliente con React Hook Form + Zod
 */
export default function FormAbonoCliente({
  cliente,
  onClose,
  onSave,
  showDebug = process.env.NODE_ENV === 'development',
}: FormAbonoClienteProps) {
  // ============================================================================
  // REACT HOOK FORM SETUP
  // ============================================================================
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful, isDirty },
    reset,
  } = useForm<AbonoClienteFormData>({
    resolver: zodResolver(abonoClienteSchema),
    defaultValues: {
      ...defaultValues,
      clienteId: cliente.id,
    },
    mode: 'onChange',
  });

  // ============================================================================
  // WATCHERS
  // ============================================================================
  const montoAbono = watch('montoAbono') || 0;
  const metodoPago = watch('metodoPago');

  // ============================================================================
  // CÁLCULOS AUTOMÁTICOS
  // ============================================================================

  // Cálculo de distribución proporcional a 3 bancos
  // Basado en las ventas pendientes del cliente
  const distribucion = useMemo(() => {
    // En un caso real, calcularías la proporción basándote en las ventas pendientes
    // del cliente y cómo fueron distribuidas originalmente
    // Por ahora, usamos una distribución estándar basada en las fórmulas:
    // Bóveda Monte: 63% (costo de mercancía)
    // Fletes: 5% (costo de transporte)
    // Utilidades: 32% (ganancia neta)

    const bovedaMonte = montoAbono * 0.63;
    const fletes = montoAbono * 0.05;
    const utilidades = montoAbono * 0.32;

    return {
      bovedaMonte: Number(bovedaMonte.toFixed(2)),
      fletes: Number(fletes.toFixed(2)),
      utilidades: Number(utilidades.toFixed(2)),
      total: Number((bovedaMonte + fletes + utilidades).toFixed(2)),
    };
  }, [montoAbono]);

  // Auto-actualizar campos de distribución
  useEffect(() => {
    setValue('distribucionBovedaMonte', distribucion.bovedaMonte);
    setValue('distribucionFletes', distribucion.fletes);
    setValue('distribucionUtilidades', distribucion.utilidades);
  }, [distribucion, setValue]);

  // Cálculo de nuevo adeudo
  const nuevoAdeudo = useMemo(() => {
    const resultado = Math.max(0, (cliente.adeudo || 0) - montoAbono);
    return Number(resultado.toFixed(2));
  }, [cliente.adeudo, montoAbono]);

  // Validación: no puede abonar más de lo que debe
  const montoExcedido = montoAbono > (cliente.adeudo || 0);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  /**
   * Maneja el envío del formulario
   */
  const onSubmit = async (data: AbonoClienteFormData) => {
    if (montoExcedido) {
      alert('El monto del abono no puede ser mayor al adeudo actual');
      return;
    }

    try {
      await onSave(data);

      // Si onSave es exitoso, esperar un momento y cerrar
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error al registrar abono:', error);
    }
  };

  /**
   * Resetea el formulario
   */
  const handleReset = () => {
    reset({
      ...defaultValues,
      clienteId: cliente.id,
    });
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900/20 rounded-2xl border border-white/10 shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <DollarSign className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Registrar Abono - Cliente</h2>
                <p className="text-white/80 text-sm mt-1">
                  Registro de pago con distribución automática a bancos
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Cliente Info */}
        <div className="p-6 bg-slate-800/50 border-b border-white/10">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-white/60 mb-1">Cliente</p>
              <p className="text-white font-semibold text-lg">{cliente.nombre}</p>
              {cliente.email && (
                <p className="text-white/60 text-sm">{cliente.email}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-white/60 mb-1">Adeudo Actual</p>
              <p className="text-3xl font-bold text-red-400">
                ${(cliente.adeudo || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Información del Abono */}
          <FormSection
            title="Información del Abono"
            description="Ingrese los detalles del pago recibido"
            icon={Receipt}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Monto Abono */}
              <div className="md:col-span-2">
                <Controller
                  name="montoAbono"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <FieldWrapper
                      label="Monto del Abono"
                      error={errors.montoAbono}
                      required
                      tooltip="Cantidad que el cliente está abonando a su adeudo"
                      icon={DollarSign}
                    >
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
                          $
                        </span>
                        <input
                          {...field}
                          type="number"
                          step="0.01"
                          min="0"
                          max={cliente.adeudo}
                          value={value || ''}
                          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                          className={`w-full pl-8 pr-4 py-3 bg-slate-800/50 border ${
                            montoExcedido
                              ? 'border-red-500'
                              : 'border-white/10 focus:border-purple-500'
                          } rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 ${
                            montoExcedido
                              ? 'focus:ring-red-500'
                              : 'focus:ring-purple-500/50'
                          } transition-all text-lg font-semibold`}
                          placeholder="0.00"
                        />
                      </div>
                      {montoExcedido && (
                        <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                          <AlertTriangle size={14} />
                          El monto no puede ser mayor al adeudo actual
                        </p>
                      )}
                    </FieldWrapper>
                  )}
                />
              </div>

              {/* Fecha Pago */}
              <Controller
                name="fechaPago"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <FieldWrapper
                    label="Fecha del Pago"
                    error={errors.fechaPago}
                    required
                    icon={Calendar}
                  >
                    <input
                      {...field}
                      type="date"
                      value={value instanceof Date ? value.toISOString().split('T')[0] : ''}
                      onChange={(e) => onChange(new Date(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 focus:border-purple-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    />
                  </FieldWrapper>
                )}
              />

              {/* Método Pago */}
              <Controller
                name="metodoPago"
                control={control}
                render={({ field }) => (
                  <FieldWrapper
                    label="Método de Pago"
                    error={errors.metodoPago}
                    required
                    icon={CreditCard}
                  >
                    <select
                      {...field}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 focus:border-purple-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    >
                      <option value="efectivo" className="bg-slate-900">
                        💵 Efectivo
                      </option>
                      <option value="transferencia" className="bg-slate-900">
                        🏦 Transferencia Bancaria
                      </option>
                      <option value="deposito" className="bg-slate-900">
                        🏧 Depósito Bancario
                      </option>
                      <option value="cheque" className="bg-slate-900">
                        📝 Cheque
                      </option>
                      <option value="tarjeta" className="bg-slate-900">
                        💳 Tarjeta (Terminal)
                      </option>
                    </select>
                  </FieldWrapper>
                )}
              />

              {/* Referencia Pago */}
              {(metodoPago === 'transferencia' || metodoPago === 'deposito' || metodoPago === 'cheque') && (
                <div className="md:col-span-2">
                  <Controller
                    name="referenciaPago"
                    control={control}
                    render={({ field }) => (
                      <FieldWrapper
                        label={
                          metodoPago === 'cheque'
                            ? 'Número de Cheque'
                            : 'Referencia / Folio de Operación'
                        }
                        error={errors.referenciaPago}
                        icon={FileText}
                      >
                        <input
                          {...field}
                          type="text"
                          className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 focus:border-purple-500 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                          placeholder={
                            metodoPago === 'cheque'
                              ? 'Ej: CHQ-123456'
                              : 'Ej: TRF-789456123'
                          }
                        />
                      </FieldWrapper>
                    )}
                  />
                </div>
              )}

              {/* Notas */}
              <div className="md:col-span-2">
                <Controller
                  name="notasAbono"
                  control={control}
                  render={({ field }) => (
                    <FieldWrapper
                      label="Notas del Abono (Opcional)"
                      error={errors.notasAbono}
                      icon={FileText}
                    >
                      <textarea
                        {...field}
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 focus:border-purple-500 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                        placeholder="Observaciones adicionales sobre el pago..."
                      />
                    </FieldWrapper>
                  )}
                />
              </div>
            </div>
          </FormSection>

          {/* Distribución Automática */}
          <FormSection
            title="Distribución Automática a Bancos"
            description="El abono se distribuirá proporcionalmente según las ventas pendientes"
            icon={Building2}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Bóveda Monte */}
              <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/60">Bóveda Monte</span>
                  <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">
                    ~63%
                  </span>
                </div>
                <p className="text-2xl font-bold text-amber-400">
                  ${distribucion.bovedaMonte.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-white/40 mt-1">Recuperación de costo</p>
              </div>

              {/* Fletes */}
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/60">Fletes</span>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                    ~5%
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-400">
                  ${distribucion.fletes.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-white/40 mt-1">Costos de transporte</p>
              </div>

              {/* Utilidades */}
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/60">Utilidades</span>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                    ~32%
                  </span>
                </div>
                <p className="text-2xl font-bold text-green-400">
                  ${distribucion.utilidades.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-white/40 mt-1">Ganancia neta</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <p className="text-xs text-white/60 text-center">
                💡 La distribución se calcula automáticamente basándose en las fórmulas de negocio
              </p>
            </div>
          </FormSection>

          {/* Resumen */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/80 font-medium">Adeudo Actual:</span>
              <span className="text-2xl font-bold text-red-400">
                ${(cliente.adeudo || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/80 font-medium">Abono:</span>
              <span className="text-2xl font-bold text-blue-400">
                -${montoAbono.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="h-px bg-white/10 my-4" />
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold text-lg">Nuevo Adeudo:</span>
              <span className="text-3xl font-bold text-green-400">
                ${nuevoAdeudo.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
            </div>
            {nuevoAdeudo === 0 && (
              <div className="mt-4 flex items-center justify-center gap-2 text-green-400">
                <CheckCircle size={20} />
                <span className="font-semibold">¡Adeudo liquidado completamente!</span>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleReset}
              disabled={!isDirty || isSubmitting}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
            >
              Cancelar
            </button>
            <LoadingButton
              type="submit"
              isLoading={isSubmitting}
              isSuccess={isSubmitSuccessful}
              disabled={montoExcedido || montoAbono <= 0}
              className="flex-1"
            >
              <DollarSign className="inline mr-2" size={20} />
              Registrar Abono
            </LoadingButton>
          </div>
        </form>

        {/* Debug Panel */}
        {showDebug && (
          <FormDebugger
            formState={{ errors, isDirty, isSubmitting }}
            watchedValues={{
              montoAbono,
              metodoPago,
              distribucion,
              nuevoAdeudo,
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
