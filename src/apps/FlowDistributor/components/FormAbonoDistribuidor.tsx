/**
 * 🎯 FORMULARIO ABONO DISTRIBUIDOR - TYPESCRIPT + REACT HOOK FORM
 *
 * Formulario para registrar pagos a distribuidores (pagar órdenes de compra) con:
 * - React Hook Form + Zod validation
 * - Selección de banco origen (desde cuál banco se paga)
 * - Registro automático de GASTO en el banco seleccionado
 * - Cálculo automático de nuevo adeudo
 * - Validación de saldo disponible en banco
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
    TrendingUp,
    Wallet,
    X,
} from 'lucide-react';
import { useMemo } from 'react';
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
interface Distribuidor {
  id: string;
  nombre: string;
  nombreComercial?: string;
  email?: string;
  telefono?: string;
  adeudo: number;
}

interface Banco {
  id: string;
  nombre: string;
  saldoDisponible: number;
  color: string;
}

interface FormAbonoDistribuidorProps {
  distribuidor: Distribuidor;
  bancosDisponibles: Banco[]; // Lista de bancos con su saldo disponible
  onClose: () => void;
  onSave: (data: AbonoDistribuidorFormData) => Promise<void> | void;
  showDebug?: boolean;
}

// Zod Schema
const abonoDistribuidorSchema = z.object({
  distribuidorId: z.string().min(1, 'Distribuidor ID es requerido'),
  montoAbono: z
    .number({ required_error: 'Monto es requerido' })
    .positive('El monto debe ser mayor a 0')
    .max(999999999, 'Monto máximo excedido'),
  bancoOrigen: z.string().min(1, 'Debe seleccionar el banco de origen'),
  fechaPago: z.date({ required_error: 'Fecha de pago es requerida' }),
  metodoPago: z.enum(['efectivo', 'transferencia', 'cheque'], {
    required_error: 'Método de pago es requerido',
  }),
  numeroReferencia: z.string().optional(),
  numeroFactura: z.string().optional(),
  notasPago: z.string().max(500, 'Máximo 500 caracteres').optional(),
});

type AbonoDistribuidorFormData = z.infer<typeof abonoDistribuidorSchema>;

const defaultValues: Partial<AbonoDistribuidorFormData> = {
  montoAbono: 0,
  bancoOrigen: '',
  fechaPago: new Date(),
  metodoPago: 'transferencia',
  numeroReferencia: '',
  numeroFactura: '',
  notasPago: '',
};

/**
 * Formulario de Abono Distribuidor con React Hook Form + Zod
 */
export default function FormAbonoDistribuidor({
  distribuidor,
  bancosDisponibles,
  onClose,
  onSave,
  showDebug = process.env.NODE_ENV === 'development',
}: FormAbonoDistribuidorProps) {
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
  } = useForm<AbonoDistribuidorFormData>({
    resolver: zodResolver(abonoDistribuidorSchema),
    defaultValues: {
      ...defaultValues,
      distribuidorId: distribuidor.id,
    },
    mode: 'onChange',
  });

  // ============================================================================
  // WATCHERS
  // ============================================================================
  const montoAbono = watch('montoAbono') || 0;
  const bancoOrigen = watch('bancoOrigen');
  const metodoPago = watch('metodoPago');

  // ============================================================================
  // CÁLCULOS AUTOMÁTICOS
  // ============================================================================

  // Obtener banco seleccionado
  const bancoSeleccionado = useMemo(() => {
    return bancosDisponibles.find(b => b.id === bancoOrigen);
  }, [bancosDisponibles, bancoOrigen]);

  // Validación: saldo insuficiente en banco origen
  const saldoInsuficiente = useMemo(() => {
    if (!bancoSeleccionado) return false;
    return montoAbono > bancoSeleccionado.saldoDisponible;
  }, [bancoSeleccionado, montoAbono]);

  // Cálculo de nuevo adeudo
  const nuevoAdeudo = useMemo(() => {
    const resultado = Math.max(0, (distribuidor.adeudo || 0) - montoAbono);
    return Number(resultado.toFixed(2));
  }, [distribuidor.adeudo, montoAbono]);

  // Cálculo de nuevo saldo del banco
  const nuevoSaldoBanco = useMemo(() => {
    if (!bancoSeleccionado) return 0;
    return Number((bancoSeleccionado.saldoDisponible - montoAbono).toFixed(2));
  }, [bancoSeleccionado, montoAbono]);

  // Validación: no puede abonar más de lo que debe
  const montoExcedido = montoAbono > (distribuidor.adeudo || 0);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  /**
   * Maneja el envío del formulario
   */
  const onSubmit = async (data: AbonoDistribuidorFormData) => {
    if (montoExcedido) {
      alert('El monto del pago no puede ser mayor al adeudo actual');
      return;
    }

    if (saldoInsuficiente) {
      alert('El banco seleccionado no tiene saldo suficiente para realizar este pago');
      return;
    }

    if (!bancoOrigen) {
      alert('Debe seleccionar el banco desde el cual se realizará el pago');
      return;
    }

    try {
      await onSave(data);

      // Si onSave es exitoso, esperar un momento y cerrar
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error al registrar pago:', error);
    }
  };

  /**
   * Resetea el formulario
   */
  const handleReset = () => {
    reset({
      ...defaultValues,
      distribuidorId: distribuidor.id,
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
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-900 to-zinc-800/20 rounded-2xl border border-white/10 shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-zinc-700 to-orange-600 p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Wallet className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Pagar a Distribuidor</h2>
                <p className="text-white/80 text-sm mt-1">
                  Registro de pago con cargo automático a banco
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

        {/* Distribuidor Info */}
        <div className="p-6 bg-slate-800/50 border-b border-white/10">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-white/60 mb-1">Distribuidor</p>
              <p className="text-white font-semibold text-lg">{distribuidor.nombre}</p>
              {distribuidor.nombreComercial && (
                <p className="text-white/60 text-sm">{distribuidor.nombreComercial}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-white/60 mb-1">Adeudo Actual</p>
              <p className="text-3xl font-bold text-zinc-200">
                ${(distribuidor.adeudo || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Información del Pago */}
          <FormSection
            title="Información del Pago"
            description="Ingrese los detalles del pago al distribuidor"
            icon={Receipt}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Monto Pago */}
              <div className="md:col-span-2">
                <Controller
                  name="montoAbono"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <FieldWrapper
                      label="Monto del Pago"
                      error={errors.montoAbono}
                      required
                      tooltip="Cantidad que se pagará al distribuidor"
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
                          max={distribuidor.adeudo}
                          value={value || ''}
                          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                          className={`w-full pl-8 pr-4 py-3 bg-slate-800/50 border ${
                            montoExcedido || saldoInsuficiente
                              ? 'border-zinc-500'
                              : 'border-white/10 focus:border-zinc-500'
                          } rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 ${
                            montoExcedido || saldoInsuficiente
                              ? 'focus:ring-red-500'
                              : 'focus:ring-red-500/50'
                          } transition-all text-lg font-semibold`}
                          placeholder="0.00"
                        />
                      </div>
                      {montoExcedido && (
                        <p className="text-zinc-200 text-sm mt-2 flex items-center gap-1">
                          <AlertTriangle size={14} />
                          El monto no puede ser mayor al adeudo actual
                        </p>
                      )}
                      {saldoInsuficiente && !montoExcedido && (
                        <p className="text-zinc-200 text-sm mt-2 flex items-center gap-1">
                          <AlertTriangle size={14} />
                          El banco seleccionado no tiene saldo suficiente
                        </p>
                      )}
                    </FieldWrapper>
                  )}
                />
              </div>

              {/* Banco Origen */}
              <div className="md:col-span-2">
                <Controller
                  name="bancoOrigen"
                  control={control}
                  render={({ field }) => (
                    <FieldWrapper
                      label="Banco de Origen"
                      error={errors.bancoOrigen}
                      required
                      tooltip="Banco desde el cual se realizará el pago (se registrará como gasto)"
                      icon={Building2}
                    >
                      <select
                        {...field}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 focus:border-zinc-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                      >
                        <option value="" className="bg-slate-900">
                          Seleccionar banco...
                        </option>
                        {bancosDisponibles.map((banco) => (
                          <option
                            key={banco.id}
                            value={banco.id}
                            className="bg-slate-900"
                          >
                            🏦 {banco.nombre} - Disponible: $
                            {banco.saldoDisponible.toLocaleString('es-MX')}
                          </option>
                        ))}
                      </select>
                      {bancoSeleccionado && (
                        <div className="mt-3 p-3 bg-slate-800/30 rounded-lg border border-white/10">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-white/60">Saldo Actual:</span>
                            <span className="text-white font-semibold">
                              ${bancoSeleccionado.saldoDisponible.toLocaleString('es-MX', {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-white/60">Después del pago:</span>
                            <span
                              className={`font-semibold ${
                                nuevoSaldoBanco < 0 ? 'text-zinc-200' : 'text-zinc-200'
                              }`}
                            >
                              ${nuevoSaldoBanco.toLocaleString('es-MX', {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        </div>
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
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 focus:border-zinc-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
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
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 focus:border-zinc-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                    >
                      <option value="transferencia" className="bg-slate-900">
                        🏦 Transferencia Bancaria
                      </option>
                      <option value="cheque" className="bg-slate-900">
                        📝 Cheque
                      </option>
                      <option value="efectivo" className="bg-slate-900">
                        💵 Efectivo
                      </option>
                    </select>
                  </FieldWrapper>
                )}
              />

              {/* Número Referencia */}
              {(metodoPago === 'transferencia' || metodoPago === 'cheque') && (
                <Controller
                  name="numeroReferencia"
                  control={control}
                  render={({ field }) => (
                    <FieldWrapper
                      label={
                        metodoPago === 'cheque'
                          ? 'Número de Cheque'
                          : 'Número de Referencia'
                      }
                      error={errors.numeroReferencia}
                      icon={FileText}
                    >
                      <input
                        {...field}
                        type="text"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 focus:border-zinc-500 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                        placeholder={
                          metodoPago === 'cheque'
                            ? 'Ej: CHQ-123456'
                            : 'Ej: TRF-789456123'
                        }
                      />
                    </FieldWrapper>
                  )}
                />
              )}

              {/* Número Factura */}
              <Controller
                name="numeroFactura"
                control={control}
                render={({ field }) => (
                  <FieldWrapper
                    label="Número de Factura (Opcional)"
                    error={errors.numeroFactura}
                    icon={Receipt}
                  >
                    <input
                      {...field}
                      type="text"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 focus:border-zinc-500 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                      placeholder="Ej: FACT-2025-001"
                    />
                  </FieldWrapper>
                )}
              />

              {/* Notas */}
              <div className="md:col-span-2">
                <Controller
                  name="notasPago"
                  control={control}
                  render={({ field }) => (
                    <FieldWrapper
                      label="Notas del Pago (Opcional)"
                      error={errors.notasPago}
                      icon={FileText}
                    >
                      <textarea
                        {...field}
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 focus:border-zinc-500 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all resize-none"
                        placeholder="Observaciones adicionales sobre el pago..."
                      />
                    </FieldWrapper>
                  )}
                />
              </div>
            </div>
          </FormSection>

          {/* Impacto del Pago */}
          <FormSection
            title="Impacto del Pago"
            description="Resumen de cómo afectará este pago a las cuentas"
            icon={TrendingUp}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Impacto en Distribuidor */}
              <div className="bg-gradient-to-br from-zinc-700/10 to-zinc-800/5 border border-zinc-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-zinc-9000/20 rounded-lg flex items-center justify-center">
                    <Receipt className="text-zinc-200" size={16} />
                  </div>
                  <span className="text-sm text-white/60 font-medium">
                    Adeudo Distribuidor
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Actual:</span>
                    <span className="text-zinc-200 font-semibold">
                      ${(distribuidor.adeudo || 0).toLocaleString('es-MX')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Después:</span>
                    <span className="text-zinc-200 font-bold text-lg">
                      ${nuevoAdeudo.toLocaleString('es-MX')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Impacto en Banco */}
              {bancoSeleccionado && (
                <div className="bg-gradient-to-br from-zinc-800/10 to-zinc-900/5 border border-zinc-700/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-zinc-800/20 rounded-lg flex items-center justify-center">
                      <Building2 className="text-zinc-300" size={16} />
                    </div>
                    <span className="text-sm text-white/60 font-medium">
                      Saldo {bancoSeleccionado.nombre}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Actual:</span>
                      <span className="text-zinc-300 font-semibold">
                        ${bancoSeleccionado.saldoDisponible.toLocaleString('es-MX')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Después:</span>
                      <span
                        className={`font-bold text-lg ${
                          nuevoSaldoBanco < 0 ? 'text-zinc-200' : 'text-zinc-200'
                        }`}
                      >
                        ${nuevoSaldoBanco.toLocaleString('es-MX')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 p-3 bg-zinc-9000/10 border border-zinc-500/20 rounded-lg">
              <p className="text-xs text-white/60 text-center">
                💡 El pago se registrará como <strong>GASTO</strong> en el banco{' '}
                {bancoSeleccionado?.nombre || 'seleccionado'}
              </p>
            </div>
          </FormSection>

          {/* Resumen Final */}
          {nuevoAdeudo === 0 && (
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-zinc-500/30 rounded-lg p-6">
              <div className="flex items-center justify-center gap-3 text-zinc-200">
                <CheckCircle size={32} />
                <div>
                  <p className="text-xl font-bold">¡Adeudo Liquidado!</p>
                  <p className="text-sm text-zinc-200/80">
                    El distribuidor quedará sin adeudos pendientes
                  </p>
                </div>
              </div>
            </div>
          )}

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
              disabled={
                montoExcedido ||
                saldoInsuficiente ||
                montoAbono <= 0 ||
                !bancoOrigen
              }
              className="flex-1"
            >
              <Wallet className="inline mr-2" size={20} />
              Registrar Pago
            </LoadingButton>
          </div>
        </form>

        {/* Debug Panel */}
        {showDebug && (
          <FormDebugger
            formState={{ errors, isDirty, isSubmitting }}
            watchedValues={{
              montoAbono,
              bancoOrigen,
              bancoSeleccionado,
              metodoPago,
              nuevoAdeudo,
              nuevoSaldoBanco,
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
