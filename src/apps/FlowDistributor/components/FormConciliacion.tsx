/**
 * 🔄 FORMULARIO CONCILIACIÓN BANCARIA - TYPESCRIPT + REACT HOOK FORM
 *
 * Conciliación bancaria mensual con:
 * - Comparación sistema vs banco
 * - Detección automática de diferencias
 * - Resolución y ajustes
 * - Workflow de aprobación
 * - Porcentaje de conciliación
 * - Auditoría completa
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    BarChart3,
    Calendar,
    CheckCircle,
    Download,
    FileText,
    GitCompare,
    Hash,
    Shield,
    Upload,
    X
} from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import {
    BANCOS_SISTEMA,
    conciliacionSchema,
    type ConciliacionFormData,
} from '../schemas/banco.schema';

import {
    FieldWrapper,
    FormDebugger,
    FormSection,
    LoadingButton
} from './forms';

interface FormConciliacionProps {
  onClose: () => void;
  onSave: (data: ConciliacionFormData) => Promise<void> | void;
  conciliacionExistente?: Partial<ConciliacionFormData> | null;
  showDebug?: boolean;
}

const MESES = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
];

export default function FormConciliacion({
  onClose,
  onSave,
  conciliacionExistente = null,
  showDebug = process.env.NODE_ENV === 'development',
}: FormConciliacionProps) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful, isDirty },
    reset,
  } = useForm<ConciliacionFormData>({
    resolver: zodResolver(conciliacionSchema),
    defaultValues: conciliacionExistente || {
      banco: 'Bóveda Monte',
      mes: new Date().getMonth() + 1,
      año: new Date().getFullYear(),
      fechaInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      fechaFin: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
      saldoInicialSistema: 0,
      saldoFinalSistema: 0,
      saldoInicialBanco: 0,
      saldoFinalBanco: 0,
      totalMovimientosSistema: 0,
      totalMovimientosBanco: 0,
      movimientosConciliados: 0,
      diferencias: [],
      totalDiferencias: 0,
      diferenciasResueltas: 0,
      diferenciasPendientes: 0,
      conciliado: false,
      porcentajeConciliacion: 0,
      realizadoPor: '',
      fechaConciliacion: new Date().toISOString().split('T')[0],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'diferencias',
  });

  const totalMovimientosSistema = watch('totalMovimientosSistema');
  const movimientosConciliados = watch('movimientosConciliados');
  const saldoInicialSistema = watch('saldoInicialSistema');
  const saldoFinalSistema = watch('saldoFinalSistema');
  const saldoInicialBanco = watch('saldoInicialBanco');
  const saldoFinalBanco = watch('saldoFinalBanco');
  const diferencias = watch('diferencias');

  // Cálculo automático del porcentaje de conciliación
  useEffect(() => {
    if (totalMovimientosSistema > 0) {
      const porcentaje = (movimientosConciliados / totalMovimientosSistema) * 100;
      setValue('porcentajeConciliacion', Math.round(porcentaje * 100) / 100);
    } else {
      setValue('porcentajeConciliacion', 0);
    }

    const resueltas = diferencias?.filter((d) => d.resuelta).length || 0;
    const pendientes = (diferencias?.length || 0) - resueltas;
    setValue('diferenciasResueltas', resueltas);
    setValue('diferenciasPendientes', pendientes);

    const conciliadoStatus = porcentaje >= 95 && pendientes === 0;
    setValue('conciliado', conciliadoStatus);
  }, [totalMovimientosSistema, movimientosConciliados, diferencias, setValue]);

  const porcentajeConciliacion = watch('porcentajeConciliacion');
  const conciliado = watch('conciliado');

  const diferenciasSaldoInicial = Math.abs((saldoInicialSistema || 0) - (saldoInicialBanco || 0));
  const diferenciasSaldoFinal = Math.abs((saldoFinalSistema || 0) - (saldoFinalBanco || 0));

  const onSubmit = async (data: ConciliacionFormData) => {
    try {
      await onSave(data);
      setTimeout(() => {
        if (!isSubmitSuccessful) onClose();
      }, 1500);
    } catch (error) {
      console.error('Error al guardar conciliación:', error);
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
        className="bg-gradient-to-br from-slate-900/95 to-violet-900/95 backdrop-blur-xl border border-violet-400/30 rounded-2xl shadow-2xl max-w-6xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <motion.h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <GitCompare className="w-7 h-7 text-violet-400" />
            {conciliacionExistente ? 'Editar Conciliación' : 'Nueva Conciliación Bancaria'}
          </motion.h2>
          <motion.button type="button" whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2">
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* INFORMACIÓN BÁSICA */}
          <FormSection title="Período de Conciliación" icon={<Calendar className="w-5 h-5" />} columns={2} isRequired>
            <Controller
              name="numeroConciliacion"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Número de Conciliación" icon={<Hash className="w-4 h-4" />} error={errors.numeroConciliacion} required>
                  <input
                    type="text"
                    {...field}
                    placeholder="CONC-202501-001"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-violet-300/50 focus:outline-none focus:ring-2 focus:ring-violet-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            <Controller
              name="banco"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Banco" error={errors.banco} required>
                  <select {...field} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-400/50 transition-all">
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
              name="mes"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper label="Mes" error={errors.mes} required>
                  <select
                    {...field}
                    value={value || ''}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-400/50 transition-all"
                  >
                    {MESES.map((mes) => (
                      <option key={mes.value} value={mes.value} className="bg-slate-900">
                        {mes.label}
                      </option>
                    ))}
                  </select>
                </FieldWrapper>
              )}
            />

            <Controller
              name="año"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper label="Año" error={errors.año} required>
                  <input
                    type="number"
                    min="2020"
                    max="2100"
                    {...field}
                    value={value || ''}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            <Controller
              name="fechaInicio"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Fecha Inicio" error={errors.fechaInicio} required>
                  <input
                    type="date"
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            <Controller
              name="fechaFin"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Fecha Fin" error={errors.fechaFin} required>
                  <input
                    type="date"
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />
          </FormSection>

          {/* COMPARACIÓN DE SALDOS */}
          <div className="grid grid-cols-2 gap-4">
            {/* SISTEMA */}
            <FormSection title="Saldos del Sistema" icon={<Upload className="w-5 h-5 text-blue-400" />} variant="default" columns={1}>
              <Controller
                name="saldoInicialSistema"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <FieldWrapper label="Saldo Inicial" error={errors.saldoInicialSistema} required>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/70">$</span>
                      <input
                        type="number"
                        step="0.01"
                        {...field}
                        value={value || ''}
                        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-4 py-3 bg-blue-500/10 border border-blue-400/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                      />
                    </div>
                  </FieldWrapper>
                )}
              />

              <Controller
                name="saldoFinalSistema"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <FieldWrapper label="Saldo Final" error={errors.saldoFinalSistema} required>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/70">$</span>
                      <input
                        type="number"
                        step="0.01"
                        {...field}
                        value={value || ''}
                        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-4 py-3 bg-blue-500/10 border border-blue-400/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                      />
                    </div>
                  </FieldWrapper>
                )}
              />

              <Controller
                name="totalMovimientosSistema"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <FieldWrapper label="Total Movimientos" error={errors.totalMovimientosSistema} required>
                    <input
                      type="number"
                      min="0"
                      {...field}
                      value={value || ''}
                      onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-blue-500/10 border border-blue-400/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                    />
                  </FieldWrapper>
                )}
              />
            </FormSection>

            {/* BANCO */}
            <FormSection title="Saldos del Banco" icon={<Download className="w-5 h-5 text-green-400" />} variant="default" columns={1}>
              <Controller
                name="saldoInicialBanco"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <FieldWrapper label="Saldo Inicial" error={errors.saldoInicialBanco} required>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-300/70">$</span>
                      <input
                        type="number"
                        step="0.01"
                        {...field}
                        value={value || ''}
                        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-4 py-3 bg-green-500/10 border border-green-400/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                      />
                    </div>
                  </FieldWrapper>
                )}
              />

              <Controller
                name="saldoFinalBanco"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <FieldWrapper label="Saldo Final" error={errors.saldoFinalBanco} required>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-300/70">$</span>
                      <input
                        type="number"
                        step="0.01"
                        {...field}
                        value={value || ''}
                        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-4 py-3 bg-green-500/10 border border-green-400/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                      />
                    </div>
                  </FieldWrapper>
                )}
              />

              <Controller
                name="totalMovimientosBanco"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <FieldWrapper label="Total Movimientos" error={errors.totalMovimientosBanco} required>
                    <input
                      type="number"
                      min="0"
                      {...field}
                      value={value || ''}
                      onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-green-500/10 border border-green-400/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                    />
                  </FieldWrapper>
                )}
              />
            </FormSection>
          </div>

          {/* PANEL DE DIFERENCIAS EN SALDOS */}
          {(diferenciasSaldoInicial > 0.01 || diferenciasSaldoFinal > 0.01) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h4 className="text-sm font-semibold text-yellow-300">⚠️ Se detectaron diferencias en los saldos</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {diferenciasSaldoInicial > 0.01 && (
                  <div>
                    <p className="text-gray-400">Diferencia Saldo Inicial:</p>
                    <p className="text-lg font-bold text-yellow-400">${diferenciasSaldoInicial.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                  </div>
                )}
                {diferenciasSaldoFinal > 0.01 && (
                  <div>
                    <p className="text-gray-400">Diferencia Saldo Final:</p>
                    <p className="text-lg font-bold text-yellow-400">${diferenciasSaldoFinal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* MOVIMIENTOS CONCILIADOS */}
          <FormSection title="Estado de Conciliación" icon={<BarChart3 className="w-5 h-5" />} columns={1}>
            <Controller
              name="movimientosConciliados"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper label="Movimientos Conciliados" error={errors.movimientosConciliados} required>
                  <input
                    type="number"
                    min="0"
                    max={totalMovimientosSistema}
                    {...field}
                    value={value || ''}
                    onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* BARRA DE PROGRESO */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Progreso de Conciliación</span>
                <span className={`text-lg font-bold ${conciliado ? 'text-green-400' : porcentajeConciliacion >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {porcentajeConciliacion.toFixed(1)}%
                </span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${porcentajeConciliacion}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`h-full ${conciliado ? 'bg-green-500' : porcentajeConciliacion >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                />
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                {conciliado ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-300">Conciliación completa ✅</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-300">Conciliación en proceso</span>
                  </>
                )}
              </div>
            </div>
          </FormSection>

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
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-violet-300/50 focus:outline-none focus:ring-2 focus:ring-violet-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            <Controller
              name="fechaConciliacion"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Fecha de Conciliación" error={errors.fechaConciliacion} required>
                  <input
                    type="date"
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            <Controller
              name="revisadoPor"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Revisado Por" error={errors.revisadoPor}>
                  <input
                    type="text"
                    {...field}
                    placeholder="Usuario revisor"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-violet-300/50 focus:outline-none focus:ring-2 focus:ring-violet-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            <Controller
              name="fechaRevision"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Fecha de Revisión" error={errors.fechaRevision}>
                  <input
                    type="date"
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />
          </FormSection>

          {/* OBSERVACIONES */}
          <FormSection title="Observaciones" icon={<FileText className="w-5 h-5" />} columns={1}>
            <Controller
              name="observaciones"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Observaciones" error={errors.observaciones} maxLength={1000} showCounter>
                  <textarea
                    {...field}
                    placeholder="Notas sobre la conciliación..."
                    rows={4}
                    maxLength={1000}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-violet-300/50 focus:outline-none focus:ring-2 focus:ring-violet-400/50 transition-all resize-none"
                  />
                </FieldWrapper>
              )}
            />
          </FormSection>

          {/* BOTONES */}
          <motion.div className="flex gap-4 pt-4 border-t border-white/10">
            <LoadingButton type="submit" variant="primary" size="lg" isLoading={isSubmitting} isSuccess={isSubmitSuccessful} loadingText="Guardando..." successText="¡Guardado!" className="flex-1">
              {conciliacionExistente ? 'Actualizar Conciliación' : 'Guardar Conciliación'}
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
