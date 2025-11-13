/**
 * 🎯 FORMULARIO GYA - GASTOS Y ADICIONALES (INGRESOS) - TYPESCRIPT + RHF
 *
 * Formulario dual para registro de Gastos e Ingresos con:
 * - Tabs para alternar entre Gastos e Ingresos
 * - React Hook Form + Zod validation
 * - Schemas específicos (gastoSchema, ingresoSchema)
 * - Campos condicionales según tipo
 * - Validación fiscal (deducible, gravable, factura)
 * - Recurrencia configurableComponentes premium reutilizables
 * - Animaciones por tipo de operación
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Building2,
    Calendar,
    Clock,
    CreditCard,
    DollarSign,
    FileText,
    Receipt,
    Tag,
    TrendingDown,
    TrendingUp,
    User,
    X
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

// Schemas
import {
    gastoDefaultValues,
    gastoSchema,
    type GastoFormData,
} from '../schemas/gasto.schema';
import {
    ingresoDefaultValues,
    ingresoSchema,
    type IngresoFormData,
} from '../schemas/ingreso.schema';

// Components
import {
    FieldWrapper,
    FormDebugger,
    FormSection,
    LoadingButton
} from './forms';

// Types
type OperationType = 'gasto' | 'ingreso';

interface FormGYAProps {
  onClose: () => void;
  onSave: (data: GastoFormData | IngresoFormData, tipo: OperationType) => Promise<void> | void;
  registroExistente?: { tipo: OperationType; data: Partial<GastoFormData | IngresoFormData> } | null;
  tipoInicial?: OperationType;
  showDebug?: boolean;
}

/**
 * Formulario GYA con tabs para Gastos e Ingresos
 */
export default function FormGYA({
  onClose,
  onSave,
  registroExistente = null,
  tipoInicial = 'gasto',
  showDebug = process.env.NODE_ENV === 'development',
}: FormGYAProps) {
  // ============================================================================
  // STATE
  // ============================================================================

  const [tipoOperacion, setTipoOperacion] = useState<OperationType>(
    registroExistente?.tipo || tipoInicial
  );

  // ============================================================================
  // REACT HOOK FORM SETUP - Gastos
  // ============================================================================

  const gastoForm = useForm<GastoFormData>({
    resolver: zodResolver(gastoSchema),
    defaultValues:
      registroExistente?.tipo === 'gasto'
        ? (registroExistente.data as Partial<GastoFormData>)
        : gastoDefaultValues,
    mode: 'onChange',
  });

  // ============================================================================
  // REACT HOOK FORM SETUP - Ingresos
  // ============================================================================

  const ingresoForm = useForm<IngresoFormData>({
    resolver: zodResolver(ingresoSchema),
    defaultValues:
      registroExistente?.tipo === 'ingreso'
        ? (registroExistente.data as Partial<IngresoFormData>)
        : ingresoDefaultValues,
    mode: 'onChange',
  });

  // Formulario activo según tab
  const activeForm = tipoOperacion === 'gasto' ? gastoForm : ingresoForm;

  // ============================================================================
  // WATCHERS
  // ============================================================================

  const esRecurrente = activeForm.watch('esRecurrente' as any);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const onSubmit = async (data: GastoFormData | IngresoFormData) => {
    try {
      await onSave(data, tipoOperacion);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleReset = () => {
    if (tipoOperacion === 'gasto') {
      gastoForm.reset(gastoDefaultValues);
    } else {
      ingresoForm.reset(ingresoDefaultValues);
    }
  };

  const handleTabChange = (tipo: OperationType) => {
    setTipoOperacion(tipo);
  };

  // ============================================================================
  // ESTILOS DINÁMICOS
  // ============================================================================

  const colorScheme = useMemo(() => {
    return tipoOperacion === 'gasto'
      ? {
          gradient: 'from-slate-900/95 to-red-900/95',
          border: 'border-red-400/30',
          icon: 'text-red-400',
          accent: 'red',
        }
      : {
          gradient: 'from-slate-900/95 to-green-900/95',
          border: 'border-green-400/30',
          icon: 'text-green-400',
          accent: 'green',
        };
  }, [tipoOperacion]);

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
        className={`bg-gradient-to-br ${colorScheme.gradient} backdrop-blur-xl border ${colorScheme.border} rounded-2xl shadow-2xl max-w-5xl w-full my-8`}
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
            {tipoOperacion === 'gasto' ? (
              <TrendingDown className={`w-7 h-7 ${colorScheme.icon}`} />
            ) : (
              <TrendingUp className={`w-7 h-7 ${colorScheme.icon}`} />
            )}
            {registroExistente ? 'Editar Registro' : 'Nuevo Registro'} - GYA
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
        {/* TABS - Selector de Tipo */}
        {/* ============================================================ */}
        {!registroExistente && (
          <div className="flex gap-2 p-6 pb-0">
            <motion.button
              type="button"
              onClick={() => handleTabChange('gasto')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
                tipoOperacion === 'gasto'
                  ? 'bg-red-500/30 border-2 border-red-400 text-white shadow-lg shadow-red-500/30'
                  : 'bg-white/5 border-2 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
              }`}
            >
              <TrendingDown className="w-5 h-5" />
              Gastos
            </motion.button>

            <motion.button
              type="button"
              onClick={() => handleTabChange('ingreso')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
                tipoOperacion === 'ingreso'
                  ? 'bg-green-500/30 border-2 border-green-400 text-white shadow-lg shadow-green-500/30'
                  : 'bg-white/5 border-2 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Ingresos
            </motion.button>
          </div>
        )}

        {/* ============================================================ */}
        {/* FORMS */}
        {/* ============================================================ */}
        <AnimatePresence mode="wait">
          {tipoOperacion === 'gasto' ? (
            <motion.form
              key="gasto-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={gastoForm.handleSubmit(onSubmit)}
              className="p-6 space-y-6"
            >
              {/* FORM GASTO */}
              <FormSection
                title="Información del Gasto"
                description="Registre los detalles del gasto"
                icon={<TrendingDown className="w-5 h-5" />}
                variant="warning"
                columns={2}
                isRequired
              >
                {/* Fecha */}
                <Controller
                  name="fecha"
                  control={gastoForm.control}
                  render={({ field }) => (
                    <FieldWrapper
                      label="Fecha del Gasto"
                      icon={<Calendar className="w-4 h-4" />}
                      error={gastoForm.formState.errors.fecha}
                      required
                    >
                      <input
                        type="date"
                        {...field}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400/50 transition-all"
                      />
                    </FieldWrapper>
                  )}
                />

                {/* Categoría */}
                <Controller
                  name="categoria"
                  control={gastoForm.control}
                  render={({ field }) => (
                    <FieldWrapper
                      label="Categoría"
                      icon={<Tag className="w-4 h-4" />}
                      error={gastoForm.formState.errors.categoria}
                      required
                    >
                      <select
                        {...field}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400/50 transition-all"
                      >
                        <option value="operativo" className="bg-slate-900">Operativo</option>
                        <option value="nomina" className="bg-slate-900">Nómina</option>
                        <option value="marketing" className="bg-slate-900">Marketing</option>
                        <option value="transporte" className="bg-slate-900">Transporte</option>
                        <option value="servicios" className="bg-slate-900">Servicios</option>
                        <option value="impuestos" className="bg-slate-900">Impuestos</option>
                        <option value="compras" className="bg-slate-900">Compras</option>
                        <option value="mantenimiento" className="bg-slate-900">Mantenimiento</option>
                        <option value="otro" className="bg-slate-900">Otro</option>
                      </select>
                    </FieldWrapper>
                  )}
                />

                {/* Monto */}
                <Controller
                  name="monto"
                  control={gastoForm.control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <FieldWrapper
                      label="Monto"
                      icon={<DollarSign className="w-4 h-4" />}
                      error={gastoForm.formState.errors.monto}
                      required
                    >
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-300/70">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          {...field}
                          value={value || ''}
                          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-red-300/50 focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400/50 transition-all"
                        />
                      </div>
                    </FieldWrapper>
                  )}
                />

                {/* Banco/Cuenta */}
                <Controller
                  name="banco"
                  control={gastoForm.control}
                  render={({ field }) => (
                    <FieldWrapper
                      label="Banco/Cuenta"
                      icon={<Building2 className="w-4 h-4" />}
                      error={gastoForm.formState.errors.banco}
                      required
                    >
                      <select
                        {...field}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400/50 transition-all"
                      >
                        <option value="Bóveda Monte" className="bg-slate-900">Bóveda Monte</option>
                        <option value="Bóveda USA" className="bg-slate-900">Bóveda USA</option>
                        <option value="Azteca" className="bg-slate-900">Azteca</option>
                        <option value="Banorte" className="bg-slate-900">Banorte</option>
                        <option value="Utilidades" className="bg-slate-900">Utilidades</option>
                        <option value="Guardadito" className="bg-slate-900">Guardadito</option>
                        <option value="Miel" className="bg-slate-900">Miel</option>
                      </select>
                    </FieldWrapper>
                  )}
                />

                {/* Concepto */}
                <div className="col-span-2">
                  <Controller
                    name="concepto"
                    control={gastoForm.control}
                    render={({ field }) => (
                      <FieldWrapper
                        label="Concepto"
                        icon={<FileText className="w-4 h-4" />}
                        error={gastoForm.formState.errors.concepto}
                        required
                        maxLength={500}
                        showCounter
                      >
                        <textarea
                          {...field}
                          placeholder="Descripción del gasto..."
                          rows={3}
                          maxLength={500}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-red-300/50 focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400/50 transition-all resize-none"
                        />
                      </FieldWrapper>
                    )}
                  />
                </div>

                {/* Proveedor/Beneficiario */}
                <Controller
                  name="proveedor"
                  control={gastoForm.control}
                  render={({ field }) => (
                    <FieldWrapper
                      label="Proveedor/Beneficiario"
                      icon={<User className="w-4 h-4" />}
                      error={gastoForm.formState.errors.proveedor}
                    >
                      <input
                        type="text"
                        {...field}
                        placeholder="Nombre del proveedor"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-red-300/50 focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400/50 transition-all"
                      />
                    </FieldWrapper>
                  )}
                />

                {/* Método de Pago */}
                <Controller
                  name="metodoPago"
                  control={gastoForm.control}
                  render={({ field }) => (
                    <FieldWrapper
                      label="Método de Pago"
                      icon={<CreditCard className="w-4 h-4" />}
                      error={gastoForm.formState.errors.metodoPago}
                    >
                      <select
                        {...field}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400/50 transition-all"
                      >
                        <option value="efectivo" className="bg-slate-900">Efectivo</option>
                        <option value="transferencia" className="bg-slate-900">Transferencia</option>
                        <option value="tarjeta" className="bg-slate-900">Tarjeta</option>
                        <option value="cheque" className="bg-slate-900">Cheque</option>
                        <option value="otro" className="bg-slate-900">Otro</option>
                      </select>
                    </FieldWrapper>
                  )}
                />
              </FormSection>

              {/* INFORMACIÓN FISCAL */}
              <FormSection
                title="Información Fiscal"
                description="Detalles para efectos fiscales"
                icon={<Receipt className="w-5 h-5" />}
                variant="default"
                columns={3}
              >
                {/* Es Deducible */}
                <Controller
                  name="esDeducible"
                  control={gastoForm.control}
                  render={({ field: { value, onChange, ...field } }) => (
                    <FieldWrapper label="¿Es Deducible?" tooltip="Gasto deducible de impuestos">
                      <label className="flex items-center gap-3 px-4 py-3 bg-white/10 border border-white/20 rounded-xl cursor-pointer hover:bg-white/20 transition-all">
                        <input
                          type="checkbox"
                          checked={value || false}
                          onChange={(e) => onChange(e.target.checked)}
                          {...field}
                          className="w-5 h-5 rounded border-white/20 text-red-500 focus:ring-2 focus:ring-red-400/50"
                        />
                        <span className="text-white">Deducible</span>
                      </label>
                    </FieldWrapper>
                  )}
                />

                {/* Tiene Factura */}
                <Controller
                  name="tieneFactura"
                  control={gastoForm.control}
                  render={({ field: { value, onChange, ...field } }) => (
                    <FieldWrapper label="¿Tiene Factura?" tooltip="Cuenta con comprobante fiscal">
                      <label className="flex items-center gap-3 px-4 py-3 bg-white/10 border border-white/20 rounded-xl cursor-pointer hover:bg-white/20 transition-all">
                        <input
                          type="checkbox"
                          checked={value || false}
                          onChange={(e) => onChange(e.target.checked)}
                          {...field}
                          className="w-5 h-5 rounded border-white/20 text-red-500 focus:ring-2 focus:ring-red-400/50"
                        />
                        <span className="text-white">Con Factura</span>
                      </label>
                    </FieldWrapper>
                  )}
                />

                {/* Número de Factura */}
                <Controller
                  name="numeroFactura"
                  control={gastoForm.control}
                  render={({ field }) => (
                    <FieldWrapper
                      label="Número de Factura"
                      icon={<FileText className="w-4 h-4" />}
                      error={gastoForm.formState.errors.numeroFactura}
                    >
                      <input
                        type="text"
                        {...field}
                        placeholder="FAC-00001"
                        disabled={!gastoForm.watch('tieneFactura')}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-red-300/50 focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </FieldWrapper>
                  )}
                />
              </FormSection>

              {/* RECURRENCIA */}
              <FormSection
                title="Recurrencia"
                description="Configurar si es un gasto recurrente"
                icon={<Clock className="w-5 h-5" />}
                variant="default"
                columns={2}
              >
                {/* Es Recurrente */}
                <Controller
                  name="esRecurrente"
                  control={gastoForm.control}
                  render={({ field: { value, onChange, ...field } }) => (
                    <FieldWrapper label="¿Es Recurrente?" tooltip="Se repite periódicamente">
                      <label className="flex items-center gap-3 px-4 py-3 bg-white/10 border border-white/20 rounded-xl cursor-pointer hover:bg-white/20 transition-all">
                        <input
                          type="checkbox"
                          checked={value || false}
                          onChange={(e) => onChange(e.target.checked)}
                          {...field}
                          className="w-5 h-5 rounded border-white/20 text-red-500 focus:ring-2 focus:ring-red-400/50"
                        />
                        <span className="text-white">Recurrente</span>
                      </label>
                    </FieldWrapper>
                  )}
                />

                {/* Frecuencia */}
                {esRecurrente && (
                  <Controller
                    name="frecuenciaRecurrencia"
                    control={gastoForm.control}
                    render={({ field }) => (
                      <FieldWrapper
                        label="Frecuencia"
                        icon={<Clock className="w-4 h-4" />}
                        error={gastoForm.formState.errors.frecuenciaRecurrencia}
                      >
                        <select
                          {...field}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400/50 transition-all"
                        >
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
                )}
              </FormSection>

              {/* BOTONES DE ACCIÓN */}
              <motion.div
                className="flex gap-4 pt-4 border-t border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <LoadingButton
                  type="submit"
                  variant="danger"
                  size="lg"
                  isLoading={gastoForm.formState.isSubmitting}
                  isSuccess={gastoForm.formState.isSubmitSuccessful}
                  loadingText="Guardando..."
                  successText="¡Guardado!"
                  className="flex-1"
                >
                  {registroExistente ? 'Actualizar Gasto' : 'Guardar Gasto'}
                </LoadingButton>

                {gastoForm.formState.isDirty && (
                  <LoadingButton type="button" variant="secondary" size="lg" onClick={handleReset}>
                    Resetear
                  </LoadingButton>
                )}

                <LoadingButton type="button" variant="ghost" size="lg" onClick={onClose}>
                  Cancelar
                </LoadingButton>
              </motion.div>

              {showDebug && <FormDebugger />}
            </motion.form>
          ) : (
            <motion.form
              key="ingreso-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={ingresoForm.handleSubmit(onSubmit)}
              className="p-6 space-y-6"
            >
              {/* FORM INGRESO */}
              <FormSection
                title="Información del Ingreso"
                description="Registre los detalles del ingreso"
                icon={<TrendingUp className="w-5 h-5" />}
                variant="success"
                columns={2}
                isRequired
              >
                {/* Fecha */}
                <Controller
                  name="fecha"
                  control={ingresoForm.control}
                  render={({ field }) => (
                    <FieldWrapper
                      label="Fecha del Ingreso"
                      icon={<Calendar className="w-4 h-4" />}
                      error={ingresoForm.formState.errors.fecha}
                      required
                    >
                      <input
                        type="date"
                        {...field}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all"
                      />
                    </FieldWrapper>
                  )}
                />

                {/* Tipo de Ingreso */}
                <Controller
                  name="tipoIngreso"
                  control={ingresoForm.control}
                  render={({ field }) => (
                    <FieldWrapper
                      label="Tipo de Ingreso"
                      icon={<Tag className="w-4 h-4" />}
                      error={ingresoForm.formState.errors.tipoIngreso}
                      required
                    >
                      <select
                        {...field}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all"
                      >
                        <option value="venta" className="bg-slate-900">Venta</option>
                        <option value="servicio" className="bg-slate-900">Servicio</option>
                        <option value="inversion" className="bg-slate-900">Inversión</option>
                        <option value="prestamo" className="bg-slate-900">Préstamo</option>
                        <option value="devolucion" className="bg-slate-900">Devolución</option>
                        <option value="comision" className="bg-slate-900">Comisión</option>
                        <option value="otro" className="bg-slate-900">Otro</option>
                      </select>
                    </FieldWrapper>
                  )}
                />

                {/* Monto */}
                <Controller
                  name="monto"
                  control={ingresoForm.control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <FieldWrapper
                      label="Monto"
                      icon={<DollarSign className="w-4 h-4" />}
                      error={ingresoForm.formState.errors.monto}
                      required
                    >
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-300/70">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          {...field}
                          value={value || ''}
                          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-green-300/50 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all"
                        />
                      </div>
                    </FieldWrapper>
                  )}
                />

                {/* Banco */}
                <Controller
                  name="banco"
                  control={ingresoForm.control}
                  render={({ field }) => (
                    <FieldWrapper
                      label="Banco/Cuenta"
                      icon={<Building2 className="w-4 h-4" />}
                      error={ingresoForm.formState.errors.banco}
                      required
                    >
                      <select
                        {...field}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all"
                      >
                        <option value="Bóveda Monte" className="bg-slate-900">Bóveda Monte</option>
                        <option value="Bóveda USA" className="bg-slate-900">Bóveda USA</option>
                        <option value="Azteca" className="bg-slate-900">Azteca</option>
                        <option value="Banorte" className="bg-slate-900">Banorte</option>
                        <option value="Utilidades" className="bg-slate-900">Utilidades</option>
                        <option value="Guardadito" className="bg-slate-900">Guardadito</option>
                        <option value="Miel" className="bg-slate-900">Miel</option>
                      </select>
                    </FieldWrapper>
                  )}
                />

                {/* Concepto */}
                <div className="col-span-2">
                  <Controller
                    name="concepto"
                    control={ingresoForm.control}
                    render={({ field }) => (
                      <FieldWrapper
                        label="Concepto"
                        icon={<FileText className="w-4 h-4" />}
                        error={ingresoForm.formState.errors.concepto}
                        required
                        maxLength={500}
                        showCounter
                      >
                        <textarea
                          {...field}
                          placeholder="Descripción del ingreso..."
                          rows={3}
                          maxLength={500}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-green-300/50 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all resize-none"
                        />
                      </FieldWrapper>
                    )}
                  />
                </div>

                {/* Cliente */}
                <Controller
                  name="clienteId"
                  control={ingresoForm.control}
                  render={({ field }) => (
                    <FieldWrapper
                      label="Cliente (opcional)"
                      icon={<User className="w-4 h-4" />}
                      error={ingresoForm.formState.errors.clienteId}
                      tooltip="Asociar con un cliente"
                    >
                      <input
                        type="text"
                        {...field}
                        placeholder="ID del cliente"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-green-300/50 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all"
                      />
                    </FieldWrapper>
                  )}
                />

                {/* Método de Pago */}
                <Controller
                  name="metodoPago"
                  control={ingresoForm.control}
                  render={({ field }) => (
                    <FieldWrapper
                      label="Método de Pago"
                      icon={<CreditCard className="w-4 h-4" />}
                      error={ingresoForm.formState.errors.metodoPago}
                    >
                      <select
                        {...field}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all"
                      >
                        <option value="efectivo" className="bg-slate-900">Efectivo</option>
                        <option value="transferencia" className="bg-slate-900">Transferencia</option>
                        <option value="tarjeta" className="bg-slate-900">Tarjeta</option>
                        <option value="cheque" className="bg-slate-900">Cheque</option>
                        <option value="otro" className="bg-slate-900">Otro</option>
                      </select>
                    </FieldWrapper>
                  )}
                />
              </FormSection>

              {/* INFORMACIÓN FISCAL - INGRESO */}
              <FormSection
                title="Información Fiscal"
                description="Detalles para efectos fiscales"
                icon={<Receipt className="w-5 h-5" />}
                variant="default"
                columns={2}
              >
                {/* Es Gravable */}
                <Controller
                  name="esGravable"
                  control={ingresoForm.control}
                  render={({ field: { value, onChange, ...field } }) => (
                    <FieldWrapper label="¿Es Gravable?" tooltip="Ingreso sujeto a impuestos">
                      <label className="flex items-center gap-3 px-4 py-3 bg-white/10 border border-white/20 rounded-xl cursor-pointer hover:bg-white/20 transition-all">
                        <input
                          type="checkbox"
                          checked={value || false}
                          onChange={(e) => onChange(e.target.checked)}
                          {...field}
                          className="w-5 h-5 rounded border-white/20 text-green-500 focus:ring-2 focus:ring-green-400/50"
                        />
                        <span className="text-white">Gravable</span>
                      </label>
                    </FieldWrapper>
                  )}
                />

                {/* Número de Factura */}
                <Controller
                  name="numeroFactura"
                  control={ingresoForm.control}
                  render={({ field }) => (
                    <FieldWrapper
                      label="Número de Factura"
                      icon={<FileText className="w-4 h-4" />}
                      error={ingresoForm.formState.errors.numeroFactura}
                    >
                      <input
                        type="text"
                        {...field}
                        placeholder="FAC-00001"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-green-300/50 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all"
                      />
                    </FieldWrapper>
                  )}
                />
              </FormSection>

              {/* BOTONES DE ACCIÓN */}
              <motion.div
                className="flex gap-4 pt-4 border-t border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <LoadingButton
                  type="submit"
                  variant="success"
                  size="lg"
                  isLoading={ingresoForm.formState.isSubmitting}
                  isSuccess={ingresoForm.formState.isSubmitSuccessful}
                  loadingText="Guardando..."
                  successText="¡Guardado!"
                  className="flex-1"
                >
                  {registroExistente ? 'Actualizar Ingreso' : 'Guardar Ingreso'}
                </LoadingButton>

                {ingresoForm.formState.isDirty && (
                  <LoadingButton type="button" variant="secondary" size="lg" onClick={handleReset}>
                    Resetear
                  </LoadingButton>
                )}

                <LoadingButton type="button" variant="ghost" size="lg" onClick={onClose}>
                  Cancelar
                </LoadingButton>
              </motion.div>

              {showDebug && <FormDebugger />}
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
