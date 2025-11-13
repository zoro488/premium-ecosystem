/**
 * 💳 FORMULARIO TRANSACCIÓN BANCARIA - TYPESCRIPT + REACT HOOK FORM
 *
 * Registro de transacciones bancarias con:
 * - 11 tipos de transacción
 * - 6 estados (pendiente → completada)
 * - Multi-moneda (MXN, USD, EUR)
 * - Cálculo automático de saldos
 * - Categorización y subcategorías
 * - Transacciones recurrentes
 * - Validaciones de negocio
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowDownCircle,
    ArrowUpCircle,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    DollarSign,
    FileText,
    RefreshCw,
    Tag,
    TrendingUp,
    X
} from 'lucide-react';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
    BANCOS_SISTEMA,
    transaccionDefaultValues,
    transaccionSchema,
    type TransaccionFormData
} from '../schemas/banco.schema';

import {
    FieldWrapper,
    FormDebugger,
    FormSection,
    LoadingButton
} from './forms';

interface FormTransaccionProps {
  onClose: () => void;
  onSave: (data: TransaccionFormData) => Promise<void> | void;
  transaccionExistente?: Partial<TransaccionFormData> | null;
  saldoBancoActual?: number;
  showDebug?: boolean;
}

export default function FormTransaccion({
  onClose,
  onSave,
  transaccionExistente = null,
  saldoBancoActual = 0,
  showDebug = process.env.NODE_ENV === 'development',
}: FormTransaccionProps) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful, isDirty },
    reset,
  } = useForm<TransaccionFormData>({
    resolver: zodResolver(transaccionSchema),
    defaultValues: transaccionExistente || {
      ...transaccionDefaultValues,
      saldoAnterior: saldoBancoActual,
      saldoNuevo: saldoBancoActual,
    },
    mode: 'onChange',
  });

  const tipo = watch('tipo');
  const monto = watch('monto');
  const comision = watch('comision');
  const iva = watch('iva');
  const moneda = watch('moneda');
  const tipoCambio = watch('tipoCambio');
  const esRecurrente = watch('esRecurrente');
  const saldoAnterior = watch('saldoAnterior');

  // Cálculo automático de saldos
  useMemo(() => {
    const totalCargos = (comision || 0) + (iva || 0);
    setValue('totalCargos', totalCargos);

    let nuevoSaldo = saldoAnterior || 0;
    if (['ingreso', 'transferencia_entrada', 'deposito', 'devolucion', 'interes'].includes(tipo)) {
      nuevoSaldo += monto || 0;
    } else if (['gasto', 'transferencia_salida', 'retiro', 'comision', 'cargo_bancario'].includes(tipo)) {
      nuevoSaldo -= (monto || 0) + totalCargos;
    }

    setValue('saldoNuevo', nuevoSaldo);

    if (moneda !== 'MXN' && tipoCambio) {
      setValue('montoMXN', (monto || 0) * (tipoCambio || 1));
    } else {
      setValue('montoMXN', monto);
    }
  }, [tipo, monto, comision, iva, moneda, tipoCambio, saldoAnterior, setValue]);

  const saldoNuevo = watch('saldoNuevo');

  const onSubmit = async (data: TransaccionFormData) => {
    try {
      await onSave(data);
      setTimeout(() => {
        if (!isSubmitSuccessful) onClose();
      }, 1500);
    } catch (error) {
      console.error('Error al guardar transacción:', error);
    }
  };

  const tipoIcon = useMemo(() => {
    if (['ingreso', 'transferencia_entrada', 'deposito', 'devolucion', 'interes'].includes(tipo)) {
      return <ArrowUpCircle className="w-5 h-5 text-green-400" />;
    }
    if (['gasto', 'transferencia_salida', 'retiro', 'comision', 'cargo_bancario'].includes(tipo)) {
      return <ArrowDownCircle className="w-5 h-5 text-red-400" />;
    }
    return <RefreshCw className="w-5 h-5 text-blue-400" />;
  }, [tipo]);

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
        className="bg-gradient-to-br from-slate-900/95 to-emerald-900/95 backdrop-blur-xl border border-emerald-400/30 rounded-2xl shadow-2xl max-w-5xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <motion.h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <CreditCard className="w-7 h-7 text-emerald-400" />
            {transaccionExistente ? 'Editar Transacción' : 'Nueva Transacción'}
          </motion.h2>
          <motion.button type="button" whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2">
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* INFORMACIÓN BÁSICA */}
          <FormSection title="Información Básica" icon={tipoIcon} columns={2} isRequired>
            <Controller
              name="banco"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Banco" error={errors.banco} required>
                  <select {...field} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all">
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
              name="tipo"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Tipo de Transacción" icon={<Tag className="w-4 h-4" />} error={errors.tipo} required>
                  <select {...field} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all">
                    <option value="ingreso" className="bg-slate-900">💰 Ingreso</option>
                    <option value="gasto" className="bg-slate-900">💸 Gasto</option>
                    <option value="transferencia_entrada" className="bg-slate-900">⬇️ Transferencia Entrada</option>
                    <option value="transferencia_salida" className="bg-slate-900">⬆️ Transferencia Salida</option>
                    <option value="deposito" className="bg-slate-900">🏦 Depósito</option>
                    <option value="retiro" className="bg-slate-900">💵 Retiro</option>
                    <option value="ajuste" className="bg-slate-900">⚙️ Ajuste</option>
                    <option value="interes" className="bg-slate-900">📈 Interés</option>
                    <option value="comision" className="bg-slate-900">💳 Comisión</option>
                    <option value="cargo_bancario" className="bg-slate-900">🏛️ Cargo Bancario</option>
                    <option value="devolucion" className="bg-slate-900">↩️ Devolución</option>
                  </select>
                </FieldWrapper>
              )}
            />

            <Controller
              name="numeroTransaccion"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Número de Transacción" error={errors.numeroTransaccion} required>
                  <input
                    type="text"
                    {...field}
                    placeholder="TXN-20250106-001"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            <Controller
              name="estado"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Estado" icon={<CheckCircle className="w-4 h-4" />} error={errors.estado}>
                  <select {...field} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all">
                    <option value="pendiente" className="bg-slate-900">⏳ Pendiente</option>
                    <option value="procesando" className="bg-slate-900">🔄 Procesando</option>
                    <option value="completada" className="bg-slate-900">✅ Completada</option>
                    <option value="fallida" className="bg-slate-900">❌ Fallida</option>
                    <option value="cancelada" className="bg-slate-900">🚫 Cancelada</option>
                    <option value="revertida" className="bg-slate-900">↩️ Revertida</option>
                  </select>
                </FieldWrapper>
              )}
            />

            <Controller
              name="fecha"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Fecha" icon={<Calendar className="w-4 h-4" />} error={errors.fecha} required>
                  <input
                    type="date"
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            <Controller
              name="hora"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Hora" icon={<Clock className="w-4 h-4" />} error={errors.hora}>
                  <input
                    type="time"
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />
          </FormSection>

          {/* MONTOS Y CARGOS */}
          <FormSection title="Montos y Cargos" icon={<DollarSign className="w-5 h-5" />} columns={3} isRequired>
            <Controller
              name="monto"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper label="Monto" error={errors.monto} required>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300/70">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      value={value || ''}
                      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
                    />
                  </div>
                </FieldWrapper>
              )}
            />

            <Controller
              name="moneda"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Moneda" error={errors.moneda}>
                  <select {...field} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all">
                    <option value="MXN" className="bg-slate-900">MXN</option>
                    <option value="USD" className="bg-slate-900">USD</option>
                    <option value="EUR" className="bg-slate-900">EUR</option>
                  </select>
                </FieldWrapper>
              )}
            />

            {moneda !== 'MXN' && (
              <Controller
                name="tipoCambio"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <FieldWrapper label="Tipo de Cambio" error={errors.tipoCambio}>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      value={value || ''}
                      onChange={(e) => onChange(parseFloat(e.target.value) || 1)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
                    />
                  </FieldWrapper>
                )}
              />
            )}

            <Controller
              name="comision"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper label="Comisión" error={errors.comision}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300/70">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      value={value || ''}
                      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
                    />
                  </div>
                </FieldWrapper>
              )}
            />

            <Controller
              name="iva"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper label="IVA" error={errors.iva}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300/70">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      value={value || ''}
                      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
                    />
                  </div>
                </FieldWrapper>
              )}
            />
          </FormSection>

          {/* PANEL DE SALDOS */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-400/30 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-emerald-300 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Actualización de Saldos
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Saldo Anterior</p>
                <p className="text-lg font-bold text-white">${saldoAnterior?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Movimiento</p>
                <p className={`text-lg font-bold ${['ingreso', 'transferencia_entrada', 'deposito'].includes(tipo) ? 'text-green-400' : 'text-red-400'}`}>
                  {['ingreso', 'transferencia_entrada', 'deposito'].includes(tipo) ? '+' : '-'}${((monto || 0) + (comision || 0) + (iva || 0)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Saldo Nuevo</p>
                <p className={`text-lg font-bold ${saldoNuevo >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  ${saldoNuevo?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* DETALLES */}
          <FormSection title="Detalles" icon={<FileText className="w-5 h-5" />} columns={1} isRequired>
            <Controller
              name="concepto"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Concepto" error={errors.concepto} required maxLength={500} showCounter>
                  <input
                    type="text"
                    {...field}
                    placeholder="Descripción breve de la transacción"
                    maxLength={500}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            <Controller
              name="descripcion"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Descripción Detallada" error={errors.descripcion} maxLength={1000} showCounter>
                  <textarea
                    {...field}
                    placeholder="Detalles adicionales..."
                    rows={3}
                    maxLength={1000}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all resize-none"
                  />
                </FieldWrapper>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="categoria"
                control={control}
                render={({ field }) => (
                  <FieldWrapper label="Categoría" error={errors.categoria}>
                    <input type="text" {...field} placeholder="Ej: Ventas, Compras" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all" />
                  </FieldWrapper>
                )}
              />

              <Controller
                name="subcategoria"
                control={control}
                render={({ field }) => (
                  <FieldWrapper label="Subcategoría" error={errors.subcategoria}>
                    <input type="text" {...field} placeholder="Ej: Productos, Servicios" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all" />
                  </FieldWrapper>
                )}
              />
            </div>
          </FormSection>

          {/* RECURRENCIA */}
          <FormSection title="Recurrencia" icon={<RefreshCw className="w-5 h-5" />} columns={1}>
            <Controller
              name="esRecurrente"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                  <input type="checkbox" checked={value || false} onChange={(e) => onChange(e.target.checked)} {...field} className="w-5 h-5 rounded border-white/20 text-emerald-500 focus:ring-2 focus:ring-emerald-400/50" />
                  <span className="text-white font-medium">Transacción Recurrente</span>
                </label>
              )}
            />

            <AnimatePresence>
              {esRecurrente && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-2 gap-4">
                  <Controller
                    name="frecuencia"
                    control={control}
                    render={({ field }) => (
                      <FieldWrapper label="Frecuencia" error={errors.frecuencia}>
                        <select {...field} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all">
                          <option value="diario" className="bg-slate-900">Diario</option>
                          <option value="semanal" className="bg-slate-900">Semanal</option>
                          <option value="quincenal" className="bg-slate-900">Quincenal</option>
                          <option value="mensual" className="bg-slate-900">Mensual</option>
                          <option value="bimestral" className="bg-slate-900">Bimestral</option>
                          <option value="trimestral" className="bg-slate-900">Trimestral</option>
                          <option value="semestral" className="bg-slate-900">Semestral</option>
                          <option value="anual" className="bg-slate-900">Anual</option>
                        </select>
                      </FieldWrapper>
                    )}
                  />

                  <Controller
                    name="proximaEjecucion"
                    control={control}
                    render={({ field }) => (
                      <FieldWrapper label="Próxima Ejecución" error={errors.proximaEjecucion}>
                        <input type="date" {...field} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all" />
                      </FieldWrapper>
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </FormSection>

          {/* BOTONES */}
          <motion.div className="flex gap-4 pt-4 border-t border-white/10">
            <LoadingButton type="submit" variant="primary" size="lg" isLoading={isSubmitting} isSuccess={isSubmitSuccessful} loadingText="Guardando..." successText="¡Guardado!" className="flex-1">
              {transaccionExistente ? 'Actualizar Transacción' : 'Guardar Transacción'}
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
