/**
 * 📊 FORMULARIO CORTE DE CAJA - TYPESCRIPT + REACT HOOK FORM
 *
 * Registro de cortes de caja con:
 * - 4 estados (abierto → conciliado)
 * - Cálculo automático de diferencias
 * - Desglose de movimientos por tipo
 * - Validación de transacciones incluidas
 * - Cierre y aprobación con auditoría
 * - Conciliación bancaria
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    Calculator,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    FileText,
    Hash,
    Lock,
    Shield,
    TrendingUp,
    Unlock,
    X
} from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
    BANCOS_SISTEMA,
    corteCajaDefaultValues,
    type CorteCajaFormData,
    corteCajaSchema
} from '../schemas/banco.schema';

import {
    FieldWrapper,
    FormDebugger,
    FormSection,
    LoadingButton
} from './forms';

interface FormCorteCajaProps {
  onClose: () => void;
  onSave: (data: CorteCajaFormData) => Promise<void> | void;
  corteExistente?: Partial<CorteCajaFormData> | null;
  showDebug?: boolean;
}

export default function FormCorteCaja({
  onClose,
  onSave,
  corteExistente = null,
  showDebug = process.env.NODE_ENV === 'development',
}: FormCorteCajaProps) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful, isDirty },
    reset,
  } = useForm<CorteCajaFormData>({
    resolver: zodResolver(corteCajaSchema),
    defaultValues: corteExistente || corteCajaDefaultValues,
    mode: 'onChange',
  });

  const saldoInicial = watch('saldoInicial');
  const saldoFinal = watch('saldoFinal');
  const totalIngresos = watch('totalIngresos');
  const totalGastos = watch('totalGastos');
  const totalTransferenciasEntrada = watch('totalTransferenciasEntrada');
  const totalTransferenciasSalida = watch('totalTransferenciasSalida');
  const estado = watch('estado');

  // Cálculos automáticos
  useEffect(() => {
    const esperado =
      (saldoInicial || 0) +
      (totalIngresos || 0) +
      (totalTransferenciasEntrada || 0) -
      (totalGastos || 0) -
      (totalTransferenciasSalida || 0);

    setValue('saldoEsperado', esperado);

    const diferencia = (saldoFinal || 0) - esperado;
    setValue('diferencia', diferencia);
  }, [saldoInicial, saldoFinal, totalIngresos, totalGastos, totalTransferenciasEntrada, totalTransferenciasSalida, setValue]);

  const saldoEsperado = watch('saldoEsperado');
  const diferencia = watch('diferencia');

  const tieneDiferencia = Math.abs(diferencia || 0) > 0.01;

  const onSubmit = async (data: CorteCajaFormData) => {
    try {
      await onSave(data);
      setTimeout(() => {
        if (!isSubmitSuccessful) onClose();
      }, 1500);
    } catch (error) {
      console.error('Error al guardar corte de caja:', error);
    }
  };

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
        className="bg-gradient-to-br from-slate-900/95 to-indigo-900/95 backdrop-blur-xl border border-indigo-400/30 rounded-2xl shadow-2xl max-w-5xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <motion.h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Calculator className="w-7 h-7 text-zinc-200" />
            {corteExistente ? 'Editar Corte de Caja' : 'Nuevo Corte de Caja'}
          </motion.h2>
          <motion.button type="button" whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2">
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* INFORMACIÓN BÁSICA */}
          <FormSection title="Información Básica" icon={<FileText className="w-5 h-5" />} columns={2} isRequired>
            <Controller
              name="numeroCorte"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Número de Corte" icon={<Hash className="w-4 h-4" />} error={errors.numeroCorte} required>
                  <input
                    type="text"
                    {...field}
                    placeholder="CTE-20250106-001"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            <Controller
              name="banco"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Banco" error={errors.banco} required>
                  <select {...field} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all">
                    {BANCOS_SISTEMA.map((banco) => (
                      <option key={banco} value={banco} className="bg-slate-900">
                        {banco}
                      </option>
                    ))}
                  </select>
                </FieldWrapper>
              )}
            />

            <Controller
              name="fechaInicio"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Fecha Inicio" icon={<Calendar className="w-4 h-4" />} error={errors.fechaInicio} required>
                  <input
                    type="date"
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            <Controller
              name="fechaFin"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Fecha Fin" icon={<Calendar className="w-4 h-4" />} error={errors.fechaFin} required>
                  <input
                    type="date"
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            <Controller
              name="horaCorte"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Hora del Corte" icon={<Clock className="w-4 h-4" />} error={errors.horaCorte}>
                  <input
                    type="time"
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            <Controller
              name="estado"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Estado del Corte" icon={estado === 'cerrado' || estado === 'auditado' || estado === 'conciliado' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />} error={errors.estado}>
                  <select {...field} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all">
                    <option value="abierto" className="bg-slate-900">🔓 Abierto</option>
                    <option value="cerrado" className="bg-slate-900">🔒 Cerrado</option>
                    <option value="auditado" className="bg-slate-900">✅ Auditado</option>
                    <option value="conciliado" className="bg-slate-900">💯 Conciliado</option>
                  </select>
                </FieldWrapper>
              )}
            />
          </FormSection>

          {/* SALDOS */}
          <FormSection title="Saldos" icon={<DollarSign className="w-5 h-5" />} columns={2} isRequired>
            <Controller
              name="saldoInicial"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper label="Saldo Inicial" error={errors.saldoInicial} required>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300/70">$</span>
                    <input
                      type="number"
                      step="0.01"
                      {...field}
                      value={value || ''}
                      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all"
                    />
                  </div>
                </FieldWrapper>
              )}
            />

            <Controller
              name="saldoFinal"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper label="Saldo Final (Real)" error={errors.saldoFinal} required>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300/70">$</span>
                    <input
                      type="number"
                      step="0.01"
                      {...field}
                      value={value || ''}
                      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all"
                    />
                  </div>
                </FieldWrapper>
              )}
            />
          </FormSection>

          {/* TOTALES */}
          <FormSection title="Totales por Tipo" icon={<TrendingUp className="w-5 h-5" />} columns={4}>
            <Controller
              name="totalIngresos"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper label="Total Ingresos" error={errors.totalIngresos}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-200">+$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      value={value || ''}
                      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-3 bg-zinc-9000/10 border border-green-400/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                    />
                  </div>
                </FieldWrapper>
              )}
            />

            <Controller
              name="totalGastos"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper label="Total Gastos" error={errors.totalGastos}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-200">-$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      value={value || ''}
                      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-3 bg-zinc-9000/10 border border-red-400/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-400/50 transition-all"
                    />
                  </div>
                </FieldWrapper>
              )}
            />

            <Controller
              name="totalTransferenciasEntrada"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper label="Transferencias Entrada" error={errors.totalTransferenciasEntrada}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300">+$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      value={value || ''}
                      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-3 bg-zinc-800/10 border border-zinc-600/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                    />
                  </div>
                </FieldWrapper>
              )}
            />

            <Controller
              name="totalTransferenciasSalida"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper label="Transferencias Salida" error={errors.totalTransferenciasSalida}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-200">-$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      value={value || ''}
                      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-3 bg-zinc-9000/10 border border-orange-400/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-all"
                    />
                  </div>
                </FieldWrapper>
              )}
            />
          </FormSection>

          {/* PANEL DE DIFERENCIAS */}
          <div className={`bg-gradient-to-r ${tieneDiferencia ? 'from-zinc-700/10 to-orange-500/10 border-red-400/30' : 'from-green-500/10 to-emerald-500/10 border-green-400/30'} border rounded-xl p-6`}>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              {tieneDiferencia ? <AlertCircle className="w-5 h-5 text-zinc-200" /> : <CheckCircle className="w-5 h-5 text-zinc-200" />}
              Resultado del Corte
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-2">Saldo Esperado</p>
                <p className="text-2xl font-bold text-white">${saldoEsperado?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Inicial + Ingresos + Transf. Entrada - Gastos - Transf. Salida
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Saldo Final Real</p>
                <p className="text-2xl font-bold text-white">${saldoFinal?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Diferencia</p>
                <p className={`text-3xl font-bold ${tieneDiferencia ? (diferencia! > 0 ? 'text-zinc-200' : 'text-zinc-200') : 'text-zinc-200'}`}>
                  {diferencia! > 0 && '+'}${diferencia?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
                {tieneDiferencia && (
                  <p className={`text-xs mt-1 ${diferencia! > 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {diferencia! > 0 ? '📈 Sobrante' : '📉 Faltante'}
                  </p>
                )}
              </div>
            </div>

            <AnimatePresence>
              {tieneDiferencia && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4">
                  <Controller
                    name="notasDiferencia"
                    control={control}
                    render={({ field }) => (
                      <FieldWrapper label="Notas sobre la Diferencia" error={errors.notasDiferencia}>
                        <textarea
                          {...field}
                          placeholder="Explique el motivo de la diferencia..."
                          rows={2}
                          maxLength={500}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all resize-none"
                        />
                      </FieldWrapper>
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AUDITORÍA */}
          <FormSection title="Auditoría" icon={<Shield className="w-5 h-5" />} columns={2} isRequired>
            <Controller
              name="realizadoPor"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Realizado Por" error={errors.realizadoPor} required>
                  <input
                    type="text"
                    {...field}
                    placeholder="Nombre del usuario"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {(estado === 'cerrado' || estado === 'auditado' || estado === 'conciliado') && (
              <>
                <Controller
                  name="cerradoPor"
                  control={control}
                  render={({ field }) => (
                    <FieldWrapper label="Cerrado Por" error={errors.cerradoPor}>
                      <input
                        type="text"
                        {...field}
                        placeholder="Usuario que cerró"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all"
                      />
                    </FieldWrapper>
                  )}
                />

                <Controller
                  name="fechaCierre"
                  control={control}
                  render={({ field }) => (
                    <FieldWrapper label="Fecha de Cierre" error={errors.fechaCierre}>
                      <input
                        type="date"
                        {...field}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all"
                      />
                    </FieldWrapper>
                  )}
                />
              </>
            )}
          </FormSection>

          {/* OBSERVACIONES */}
          <FormSection title="Observaciones" icon={<FileText className="w-5 h-5" />} columns={1}>
            <Controller
              name="observaciones"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Observaciones Generales" error={errors.observaciones} maxLength={1000} showCounter>
                  <textarea
                    {...field}
                    placeholder="Información adicional sobre el corte de caja..."
                    rows={4}
                    maxLength={1000}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all resize-none"
                  />
                </FieldWrapper>
              )}
            />
          </FormSection>

          {/* BOTONES */}
          <motion.div className="flex gap-4 pt-4 border-t border-white/10">
            <LoadingButton type="submit" variant="primary" size="lg" isLoading={isSubmitting} isSuccess={isSubmitSuccessful} loadingText="Guardando..." successText="¡Guardado!" className="flex-1">
              {corteExistente ? 'Actualizar Corte' : 'Guardar Corte'}
            </LoadingButton>

            {isDirty && (
              <LoadingButton type="button" variant="secondary" size="lg" onClick={() => reset()}>
                Resetear
              </LoadingButton>
            )}

            <LoadingButton type="button" variant="ghost" size="lg" onClick={onClose}>
              Cancelar
            </LoadingButton>
          </motion.div>

          {showDebug && <FormDebugger />}
        </form>
      </motion.div>
    </motion.div>
  );
}
