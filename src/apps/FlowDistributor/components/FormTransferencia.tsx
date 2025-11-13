/**
 * 🎯 FORMULARIO TRANSFERENCIA - TYPESCRIPT + REACT HOOK FORM
 *
 * Formulario para transferencias interbancarias con:
 * - React Hook Form + Zod validation
 * - Workflow de aprobación (5 estados)
 * - Validación banco origen ≠ destino
 * - Programación de transferencias
 * - Recurrencia configurable
 * - Confirmación de saldos
 * - Componentes premium reutilizables
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    ArrowRightLeft,
    Building2,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    FileText,
    Info,
    Shield,
    X,
} from 'lucide-react';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

// Schemas
import {
    transferenciaDefaultValues,
    transferenciaSchema,
    type TransferenciaFormData,
} from '../schemas/transferencia.schema';

// Components
import {
    ErrorMessage,
    FieldWrapper,
    FormDebugger,
    FormSection,
    LoadingButton,
} from './forms';

// Types
interface FormTransferenciaProps {
  onClose: () => void;
  onSave: (data: TransferenciaFormData) => Promise<void> | void;
  transferenciaExistente?: Partial<TransferenciaFormData> | null;
  /** Saldos disponibles por banco (para validación) */
  saldosBancos?: Record<string, number>;
  showDebug?: boolean;
}

/**
 * Formulario de Transferencia Bancaria con React Hook Form + Zod
 */
export default function FormTransferencia({
  onClose,
  onSave,
  transferenciaExistente = null,
  saldosBancos = {},
  showDebug = process.env.NODE_ENV === 'development',
}: FormTransferenciaProps) {
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
  } = useForm<TransferenciaFormData>({
    resolver: zodResolver(transferenciaSchema),
    defaultValues: transferenciaExistente || transferenciaDefaultValues,
    mode: 'onChange',
  });

  // ============================================================================
  // WATCHERS
  // ============================================================================

  const bancoOrigen = watch('bancoOrigen');
  const bancoDestino = watch('bancoDestino');
  const monto = watch('monto');
  const esProgramada = watch('esProgramada');
  const esRecurrente = watch('esRecurrente');
  const estadoTransferencia = watch('estadoTransferencia');

  // ============================================================================
  // CÁLCULOS Y VALIDACIONES
  // ============================================================================

  const saldoOrigenDisponible = useMemo(() => {
    return saldosBancos[bancoOrigen] || 0;
  }, [bancoOrigen, saldosBancos]);

  const saldoDestinoActual = useMemo(() => {
    return saldosBancos[bancoDestino] || 0;
  }, [bancoDestino, saldosBancos]);

  const saldoSuficiente = useMemo(() => {
    return monto > 0 ? saldoOrigenDisponible >= monto : true;
  }, [monto, saldoOrigenDisponible]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const onSubmit = async (data: TransferenciaFormData) => {
    try {
      // Validación adicional de saldo
      if (!saldoSuficiente) {
        alert('Saldo insuficiente en el banco origen');
        return;
      }

      await onSave(data);
      setTimeout(() => {
        if (!isSubmitSuccessful) {
          onClose();
        }
      }, 1500);
    } catch (error) {
      console.error('Error al guardar transferencia:', error);
    }
  };

  const handleReset = () => {
    reset(transferenciaExistente || transferenciaDefaultValues);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-xl border border-blue-400/30 rounded-2xl shadow-2xl max-w-5xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ============================================================ */}
        {/* HEADER */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <motion.h2
            className="text-2xl font-bold text-white flex items-center gap-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <ArrowRightLeft className="w-7 h-7 text-blue-400" />
            {transferenciaExistente ? 'Editar Transferencia' : 'Nueva Transferencia'}
          </motion.h2>

          <motion.button
            type="button"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
            aria-label="Cerrar formulario"
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        {/* ============================================================ */}
        {/* FORM */}
        {/* ============================================================ */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* ========================================================== */}
          {/* SECCIÓN 1: BANCOS Y MONTO */}
          {/* ========================================================== */}
          <FormSection
            title="Información de Transferencia"
            description="Origen, destino y monto"
            icon={<ArrowRightLeft className="w-5 h-5" />}
            variant="accent"
            columns={2}
            isRequired
          >
            {/* Banco Origen */}
            <Controller
              name="bancoOrigen"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Banco Origen"
                  icon={<Building2 className="w-4 h-4" />}
                  error={errors.bancoOrigen}
                  required
                  tooltip="Banco desde donde se origina la transferencia"
                >
                  <select
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  >
                    <option value="" className="bg-slate-900">
                      Seleccionar banco...
                    </option>
                    <option value="Bóveda Monte" className="bg-slate-900">
                      Bóveda Monte
                    </option>
                    <option value="Bóveda USA" className="bg-slate-900">
                      Bóveda USA
                    </option>
                    <option value="Azteca" className="bg-slate-900">
                      Azteca
                    </option>
                    <option value="Banorte" className="bg-slate-900">
                      Banorte
                    </option>
                    <option value="Utilidades" className="bg-slate-900">
                      Utilidades
                    </option>
                    <option value="Guardadito" className="bg-slate-900">
                      Guardadito
                    </option>
                    <option value="Miel" className="bg-slate-900">
                      Miel
                    </option>
                  </select>
                </FieldWrapper>
              )}
            />

            {/* Banco Destino */}
            <Controller
              name="bancoDestino"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Banco Destino"
                  icon={<Building2 className="w-4 h-4" />}
                  error={errors.bancoDestino}
                  required
                  tooltip="Banco destino de la transferencia"
                >
                  <select
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  >
                    <option value="" className="bg-slate-900">
                      Seleccionar banco...
                    </option>
                    <option value="Bóveda Monte" className="bg-slate-900" disabled={bancoOrigen === 'Bóveda Monte'}>
                      Bóveda Monte
                    </option>
                    <option value="Bóveda USA" className="bg-slate-900" disabled={bancoOrigen === 'Bóveda USA'}>
                      Bóveda USA
                    </option>
                    <option value="Azteca" className="bg-slate-900" disabled={bancoOrigen === 'Azteca'}>
                      Azteca
                    </option>
                    <option value="Banorte" className="bg-slate-900" disabled={bancoOrigen === 'Banorte'}>
                      Banorte
                    </option>
                    <option value="Utilidades" className="bg-slate-900" disabled={bancoOrigen === 'Utilidades'}>
                      Utilidades
                    </option>
                    <option value="Guardadito" className="bg-slate-900" disabled={bancoOrigen === 'Guardadito'}>
                      Guardadito
                    </option>
                    <option value="Miel" className="bg-slate-900" disabled={bancoOrigen === 'Miel'}>
                      Miel
                    </option>
                  </select>
                </FieldWrapper>
              )}
            />

            {/* Monto */}
            <Controller
              name="monto"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper
                  label="Monto a Transferir"
                  icon={<DollarSign className="w-4 h-4" />}
                  error={errors.monto}
                  required
                  tooltip="Monto en MXN"
                >
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/70">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      {...field}
                      value={value || ''}
                      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                    />
                  </div>
                </FieldWrapper>
              )}
            />

            {/* Fecha de Transferencia */}
            <Controller
              name="fechaTransferencia"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Fecha de Transferencia"
                  icon={<Calendar className="w-4 h-4" />}
                  error={errors.fechaTransferencia}
                  required
                >
                  <input
                    type="date"
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* Concepto */}
            <div className="col-span-2">
              <Controller
                name="concepto"
                control={control}
                render={({ field }) => (
                  <FieldWrapper
                    label="Concepto"
                    icon={<FileText className="w-4 h-4" />}
                    error={errors.concepto}
                    required
                    maxLength={500}
                    showCounter
                  >
                    <textarea
                      {...field}
                      placeholder="Motivo de la transferencia..."
                      rows={3}
                      maxLength={500}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all resize-none"
                    />
                  </FieldWrapper>
                )}
              />
            </div>
          </FormSection>

          {/* ========================================================== */}
          {/* PANEL DE SALDOS */}
          {/* ========================================================== */}
          <motion.div
            className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-blue-300">Información de Saldos</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Saldo Origen */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <p className="text-xs text-blue-300/70 mb-1">Saldo Disponible (Origen)</p>
                <p className="text-xl font-bold text-white">
                  ${saldoOrigenDisponible.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-blue-300/50 mt-1">{bancoOrigen || 'Sin seleccionar'}</p>
              </div>

              {/* Saldo Destino */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <p className="text-xs text-cyan-300/70 mb-1">Saldo Actual (Destino)</p>
                <p className="text-xl font-bold text-white">
                  ${saldoDestinoActual.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-cyan-300/50 mt-1">{bancoDestino || 'Sin seleccionar'}</p>
              </div>
            </div>

            {/* Advertencia si saldo insuficiente */}
            <AnimatePresence>
              {monto > 0 && !saldoSuficiente && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <ErrorMessage
                    message="⚠️ Saldo insuficiente en el banco origen para realizar esta transferencia"
                    variant="warning"
                    animation="slide"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ========================================================== */}
          {/* SECCIÓN 2: ESTADO Y APROBACIÓN */}
          {/* ========================================================== */}
          <FormSection
            title="Estado y Aprobación"
            description="Workflow de aprobación"
            icon={<Shield className="w-5 h-5" />}
            variant="default"
            columns={2}
          >
            {/* Estado Transferencia */}
            <Controller
              name="estadoTransferencia"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Estado de Transferencia"
                  icon={<CheckCircle className="w-4 h-4" />}
                  error={errors.estadoTransferencia}
                  required
                >
                  <select
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  >
                    <option value="pendiente" className="bg-slate-900">
                      Pendiente
                    </option>
                    <option value="aprobada" className="bg-slate-900">
                      Aprobada
                    </option>
                    <option value="ejecutada" className="bg-slate-900">
                      Ejecutada
                    </option>
                    <option value="rechazada" className="bg-slate-900">
                      Rechazada
                    </option>
                    <option value="cancelada" className="bg-slate-900">
                      Cancelada
                    </option>
                  </select>
                </FieldWrapper>
              )}
            />

            {/* Referencia/Tracking */}
            <Controller
              name="referencia"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Referencia/Tracking"
                  icon={<FileText className="w-4 h-4" />}
                  error={errors.referencia}
                  tooltip="Número de referencia o tracking"
                >
                  <input
                    type="text"
                    {...field}
                    placeholder="REF-00001"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* Motivo Rechazo (solo si rechazada) */}
            {estadoTransferencia === 'rechazada' && (
              <div className="col-span-2">
                <Controller
                  name="motivoRechazo"
                  control={control}
                  render={({ field }) => (
                    <FieldWrapper
                      label="Motivo de Rechazo"
                      icon={<AlertTriangle className="w-4 h-4" />}
                      error={errors.motivoRechazo}
                      required
                      maxLength={500}
                      showCounter
                    >
                      <textarea
                        {...field}
                        placeholder="Explique el motivo del rechazo..."
                        rows={3}
                        maxLength={500}
                        className="w-full px-4 py-3 bg-white/10 border border-red-400/30 rounded-xl text-white placeholder-red-300/50 focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400/50 transition-all resize-none"
                      />
                    </FieldWrapper>
                  )}
                />
              </div>
            )}
          </FormSection>

          {/* ========================================================== */}
          {/* SECCIÓN 3: PROGRAMACIÓN */}
          {/* ========================================================== */}
          <FormSection
            title="Programación"
            description="Configurar transferencia programada o recurrente"
            icon={<Clock className="w-5 h-5" />}
            variant="default"
            columns={2}
          >
            {/* Es Programada */}
            <Controller
              name="esProgramada"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <FieldWrapper label="¿Es Programada?" tooltip="Ejecutar en fecha futura">
                  <label className="flex items-center gap-3 px-4 py-3 bg-white/10 border border-white/20 rounded-xl cursor-pointer hover:bg-white/20 transition-all">
                    <input
                      type="checkbox"
                      checked={value || false}
                      onChange={(e) => onChange(e.target.checked)}
                      {...field}
                      className="w-5 h-5 rounded border-white/20 text-blue-500 focus:ring-2 focus:ring-blue-400/50"
                    />
                    <span className="text-white">Programar para fecha futura</span>
                  </label>
                </FieldWrapper>
              )}
            />

            {/* Fecha Programada */}
            {esProgramada && (
              <Controller
                name="fechaProgramada"
                control={control}
                render={({ field }) => (
                  <FieldWrapper
                    label="Fecha Programada"
                    icon={<Calendar className="w-4 h-4" />}
                    error={errors.fechaProgramada}
                    required
                  >
                    <input
                      type="date"
                      {...field}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                    />
                  </FieldWrapper>
                )}
              />
            )}

            {/* Es Recurrente */}
            <Controller
              name="esRecurrente"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <FieldWrapper label="¿Es Recurrente?" tooltip="Se repite periódicamente">
                  <label className="flex items-center gap-3 px-4 py-3 bg-white/10 border border-white/20 rounded-xl cursor-pointer hover:bg-white/20 transition-all">
                    <input
                      type="checkbox"
                      checked={value || false}
                      onChange={(e) => onChange(e.target.checked)}
                      {...field}
                      className="w-5 h-5 rounded border-white/20 text-blue-500 focus:ring-2 focus:ring-blue-400/50"
                    />
                    <span className="text-white">Transferencia recurrente</span>
                  </label>
                </FieldWrapper>
              )}
            />

            {/* Frecuencia Recurrencia */}
            {esRecurrente && (
              <Controller
                name="frecuenciaRecurrencia"
                control={control}
                render={({ field }) => (
                  <FieldWrapper
                    label="Frecuencia"
                    icon={<Clock className="w-4 h-4" />}
                    error={errors.frecuenciaRecurrencia}
                    required
                  >
                    <select
                      {...field}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                    >
                      <option value="diario" className="bg-slate-900">
                        Diario
                      </option>
                      <option value="semanal" className="bg-slate-900">
                        Semanal
                      </option>
                      <option value="quincenal" className="bg-slate-900">
                        Quincenal
                      </option>
                      <option value="mensual" className="bg-slate-900">
                        Mensual
                      </option>
                      <option value="trimestral" className="bg-slate-900">
                        Trimestral
                      </option>
                      <option value="semestral" className="bg-slate-900">
                        Semestral
                      </option>
                      <option value="anual" className="bg-slate-900">
                        Anual
                      </option>
                    </select>
                  </FieldWrapper>
                )}
              />
            )}
          </FormSection>

          {/* ========================================================== */}
          {/* BOTONES DE ACCIÓN */}
          {/* ========================================================== */}
          <motion.div
            className="flex gap-4 pt-4 border-t border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <LoadingButton
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              isSuccess={isSubmitSuccessful}
              loadingText="Guardando..."
              successText="¡Guardado!"
              className="flex-1"
              disabled={!saldoSuficiente && monto > 0}
            >
              {transferenciaExistente ? 'Actualizar Transferencia' : 'Guardar Transferencia'}
            </LoadingButton>

            {isDirty && (
              <LoadingButton type="button" variant="secondary" size="lg" onClick={handleReset}>
                Resetear
              </LoadingButton>
            )}

            <LoadingButton type="button" variant="ghost" size="lg" onClick={onClose}>
              Cancelar
            </LoadingButton>
          </motion.div>

          {/* FORM DEBUGGER */}
          {showDebug && <FormDebugger />}
        </form>
      </motion.div>
    </motion.div>
  );
}
