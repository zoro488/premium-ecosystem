/**
 * 🎯 FORMULARIO VENTA LOCAL - VERSION TYPESCRIPT + REACT HOOK FORM
 *
 * Formulario premium de registro de ventas con:
 * - React Hook Form para manejo de estado
 * - Zod validation schema integrado
 * - Componentes reutilizables (FieldWrapper, ErrorMessage, LoadingButton, FormSection)
 * - Validación en tiempo real
 * - Cálculos automáticos
 * - Estados de carga y éxito
 * - Animaciones premium con Framer Motion
 * - UI glassmorphism
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Building2,
    Calculator,
    Calendar,
    CreditCard,
    DollarSign,
    FileText,
    Info,
    Package,
    TrendingUp,
    User,
    X,
} from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

// Schemas
import type { VentaFormData } from '../schemas/venta.schema';
import { ventaDefaultValues, ventaSchema } from '../schemas/venta.schema';

// Components
import {
    ErrorMessage,
    FieldWrapper,
    FormDebugger,
    FormSection,
    LoadingButton,
} from './forms';

// Types
interface FormVentaLocalProps {
  /** Función para cerrar el formulario */
  onClose: () => void;
  /** Función callback al guardar (recibe datos validados) */
  onSave: (data: VentaFormData) => Promise<void> | void;
  /** Venta existente para editar (opcional) */
  ventaExistente?: Partial<VentaFormData> | null;
  /** Mostrar panel de debug (solo desarrollo) */
  showDebug?: boolean;
}

/**
 * Formulario de Venta Local con React Hook Form + Zod
 */
export default function FormVentaLocal({
  onClose,
  onSave,
  ventaExistente = null,
  showDebug = process.env.NODE_ENV === 'development',
}: FormVentaLocalProps) {
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
  } = useForm<VentaFormData>({
    resolver: zodResolver(ventaSchema),
    defaultValues: ventaExistente || ventaDefaultValues,
    mode: 'onChange', // Validación en tiempo real
  });

  // ============================================================================
  // WATCHERS - Observar cambios en campos clave
  // ============================================================================

  const cantidad = watch('cantidad');
  const precioVentaUnidad = watch('precioVentaUnidad');
  const precioCompraUnidad = watch('precioCompraUnidad');
  const precioFlete = watch('precioFlete');
  const estadoPago = watch('estadoPago');

  // ============================================================================
  // CÁLCULOS AUTOMÁTICOS
  // ============================================================================

  // Calcular totales
  const totales = useMemo(() => {
    const cant = cantidad || 0;
    const pVenta = precioVentaUnidad || 0;
    const pCompra = precioCompraUnidad || 0;
    const flete = precioFlete || 0;

    const precioTotalVenta = cant * pVenta;
    const precioTotalCompra = cant * pCompra;
    const costoFlete = flete;
    const costoTotal = precioTotalCompra + costoFlete;
    const utilidadBruta = precioTotalVenta - costoTotal;
    const margenPorcentaje =
      precioTotalVenta > 0 ? ((utilidadBruta / precioTotalVenta) * 100).toFixed(2) : '0.00';

    return {
      precioTotalVenta,
      precioTotalCompra,
      costoFlete,
      costoTotal,
      utilidadBruta,
      margenPorcentaje,
    };
  }, [cantidad, precioVentaUnidad, precioCompraUnidad, precioFlete]);

  // Auto-ajustar monto pagado según estado
  useEffect(() => {
    if (estadoPago === 'completo') {
      setValue('montoPagado', totales.precioTotalVenta);
    } else if (estadoPago === 'pendiente') {
      setValue('montoPagado', 0);
    }
    // Para 'parcial' el usuario ingresa manualmente
  }, [estadoPago, totales.precioTotalVenta, setValue]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  /**
   * Maneja el envío del formulario
   */
  const onSubmit = async (data: VentaFormData) => {
    try {
      await onSave(data);
      // Si onSave es exitoso y no cierra el form automáticamente,
      // podrías mostrar un mensaje de éxito o resetear el form
      setTimeout(() => {
        if (!isSubmitSuccessful) {
          onClose();
        }
      }, 1500);
    } catch (error) {
      console.error('Error al guardar venta:', error);
      // Aquí podrías mostrar un toast de error
    }
  };

  /**
   * Resetear formulario a valores iniciales
   */
  const handleReset = () => {
    reset(ventaExistente || ventaDefaultValues);
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
        className="bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-xl border border-blue-400/30 rounded-2xl shadow-2xl max-w-6xl w-full my-8"
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
            <FileText className="w-7 h-7 text-blue-400" />
            {ventaExistente ? 'Editar Venta Local' : 'Nueva Venta Local'}
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
          {/* SECCIÓN 1: INFORMACIÓN BÁSICA */}
          {/* ========================================================== */}
          <FormSection
            title="Información Básica"
            description="Datos principales de la venta"
            icon={<FileText className="w-5 h-5" />}
            variant="default"
            columns={2}
            isRequired
          >
            {/* Fecha */}
            <Controller
              name="fecha"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Fecha de Venta"
                  icon={<Calendar className="w-4 h-4" />}
                  error={errors.fecha}
                  required
                  tooltip="Fecha en la que se realizó la venta"
                >
                  <input
                    type="date"
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* Cliente */}
            <Controller
              name="clienteId"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Cliente"
                  icon={<User className="w-4 h-4" />}
                  error={errors.clienteId}
                  required
                  tooltip="Seleccione el cliente de la venta"
                >
                  <input
                    type="text"
                    {...field}
                    placeholder="ID o nombre del cliente"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* Producto */}
            <Controller
              name="productoId"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Producto"
                  icon={<Package className="w-4 h-4" />}
                  error={errors.productoId}
                  required
                  tooltip="Seleccione el producto vendido"
                >
                  <input
                    type="text"
                    {...field}
                    placeholder="ID o nombre del producto"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* Cantidad */}
            <Controller
              name="cantidad"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper
                  label="Cantidad"
                  icon={<Package className="w-4 h-4" />}
                  error={errors.cantidad}
                  required
                  tooltip="Cantidad de unidades vendidas"
                >
                  <input
                    type="number"
                    step="1"
                    min="1"
                    {...field}
                    value={value || ''}
                    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* Concepto (span 2 columns) */}
            <div className="col-span-2">
              <Controller
                name="concepto"
                control={control}
                render={({ field }) => (
                  <FieldWrapper
                    label="Concepto / Detalles"
                    icon={<Info className="w-4 h-4" />}
                    error={errors.concepto}
                    tooltip="Descripción adicional de la venta"
                    maxLength={500}
                    showCounter
                  >
                    <textarea
                      {...field}
                      placeholder="Detalles adicionales de la venta..."
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
          {/* SECCIÓN 2: PRECIOS Y COSTOS */}
          {/* ========================================================== */}
          <FormSection
            title="Precios y Costos"
            description="Información financiera de la venta"
            icon={<DollarSign className="w-5 h-5" />}
            variant="accent"
            columns={3}
            isRequired
          >
            {/* Precio Venta Unidad */}
            <Controller
              name="precioVentaUnidad"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper
                  label="Precio Venta (Unidad)"
                  icon={<DollarSign className="w-4 h-4" />}
                  error={errors.precioVentaUnidad}
                  required
                  tooltip="Precio de venta por unidad"
                >
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/70">
                      $
                    </span>
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

            {/* Precio Compra Unidad */}
            <Controller
              name="precioCompraUnidad"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper
                  label="Precio Compra (Unidad)"
                  icon={<DollarSign className="w-4 h-4" />}
                  error={errors.precioCompraUnidad}
                  required
                  tooltip="Precio de compra por unidad"
                >
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/70">
                      $
                    </span>
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

            {/* Precio Flete */}
            <Controller
              name="precioFlete"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper
                  label="Costo Flete"
                  icon={<DollarSign className="w-4 h-4" />}
                  error={errors.precioFlete}
                  tooltip="Costo del flete (opcional, default: $0)"
                >
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/70">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
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
          </FormSection>

          {/* ========================================================== */}
          {/* SECCIÓN 3: PANEL DE CÁLCULOS AUTOMÁTICOS */}
          {/* ========================================================== */}
          <motion.div
            className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-400/30 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-bold text-emerald-300">Cálculos Automáticos</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Total Venta */}
              <motion.div
                className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
                whileHover={{ scale: 1.02, borderColor: 'rgba(59, 130, 246, 0.5)' }}
              >
                <p className="text-xs text-blue-300/70 mb-1">Total Venta</p>
                <p className="text-2xl font-bold text-white">
                  ${totales.precioTotalVenta.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </motion.div>

              {/* Total Compra */}
              <motion.div
                className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
                whileHover={{ scale: 1.02, borderColor: 'rgba(239, 68, 68, 0.5)' }}
              >
                <p className="text-xs text-red-300/70 mb-1">Total Compra</p>
                <p className="text-2xl font-bold text-white">
                  ${totales.precioTotalCompra.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </motion.div>

              {/* Utilidad */}
              <motion.div
                className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
                whileHover={{ scale: 1.02, borderColor: 'rgba(16, 185, 129, 0.5)' }}
              >
                <p className="text-xs text-emerald-300/70 mb-1">Utilidad Bruta</p>
                <p
                  className={`text-2xl font-bold ${
                    totales.utilidadBruta >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  ${totales.utilidadBruta.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </motion.div>

              {/* Margen */}
              <motion.div
                className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
                whileHover={{ scale: 1.02, borderColor: 'rgba(168, 85, 247, 0.5)' }}
              >
                <p className="text-xs text-purple-300/70 mb-1">Margen %</p>
                <p className="text-2xl font-bold text-white flex items-center gap-1">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  {totales.margenPorcentaje}%
                </p>
              </motion.div>
            </div>

            {/* Advertencia si margen es negativo */}
            <AnimatePresence>
              {totales.utilidadBruta < 0 && (
                <ErrorMessage
                  message="⚠️ Atención: Esta venta genera pérdida. El precio de venta debe ser mayor que la suma de compra + flete."
                  variant="warning"
                  animation="slide"
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* ========================================================== */}
          {/* SECCIÓN 4: PAGO Y DISTRIBUCIÓN BANCARIA */}
          {/* ========================================================== */}
          <FormSection
            title="Información de Pago"
            description="Estado y distribución bancaria"
            icon={<CreditCard className="w-5 h-5" />}
            variant="default"
            columns={2}
            isRequired
          >
            {/* Estado Pago */}
            <Controller
              name="estadoPago"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Estado de Pago"
                  icon={<CreditCard className="w-4 h-4" />}
                  error={errors.estadoPago}
                  required
                  tooltip="Estado actual del pago"
                >
                  <select
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  >
                    <option value="pendiente" className="bg-slate-900">
                      Pendiente
                    </option>
                    <option value="parcial" className="bg-slate-900">
                      Parcial
                    </option>
                    <option value="completo" className="bg-slate-900">
                      Completo
                    </option>
                  </select>
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
                  icon={<CreditCard className="w-4 h-4" />}
                  error={errors.metodoPago}
                  tooltip="Método utilizado para el pago"
                >
                  <select
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  >
                    <option value="efectivo" className="bg-slate-900">
                      Efectivo
                    </option>
                    <option value="transferencia" className="bg-slate-900">
                      Transferencia
                    </option>
                    <option value="tarjeta" className="bg-slate-900">
                      Tarjeta
                    </option>
                    <option value="cheque" className="bg-slate-900">
                      Cheque
                    </option>
                    <option value="deposito" className="bg-slate-900">
                      Depósito
                    </option>
                    <option value="otro" className="bg-slate-900">
                      Otro
                    </option>
                  </select>
                </FieldWrapper>
              )}
            />

            {/* Monto Pagado */}
            <Controller
              name="montoPagado"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper
                  label="Monto Pagado"
                  icon={<DollarSign className="w-4 h-4" />}
                  error={errors.montoPagado}
                  tooltip={
                    estadoPago === 'completo'
                      ? 'Auto-calculado (igual al total)'
                      : estadoPago === 'pendiente'
                        ? 'Auto-establecido en $0'
                        : 'Ingrese el monto pagado'
                  }
                >
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/70">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      value={value || ''}
                      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      disabled={estadoPago === 'completo' || estadoPago === 'pendiente'}
                      className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </FieldWrapper>
              )}
            />

            {/* Banco Bóveda Monte */}
            <Controller
              name="bancoBovedaMonte"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Banco Bóveda Monte"
                  icon={<Building2 className="w-4 h-4" />}
                  error={errors.bancoBovedaMonte}
                  tooltip="Banco destino para Bóveda Monte"
                >
                  <select
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  >
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

            {/* Banco Fletes */}
            <Controller
              name="bancoFletes"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Banco Fletes"
                  icon={<Building2 className="w-4 h-4" />}
                  error={errors.bancoFletes}
                  tooltip="Banco destino para pago de fletes"
                >
                  <select
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  >
                    <option value="Bóveda USA" className="bg-slate-900">
                      Bóveda USA
                    </option>
                    <option value="Bóveda Monte" className="bg-slate-900">
                      Bóveda Monte
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

            {/* Banco Utilidades */}
            <Controller
              name="bancoUtilidades"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Banco Utilidades"
                  icon={<Building2 className="w-4 h-4" />}
                  error={errors.bancoUtilidades}
                  tooltip="Banco destino para utilidades"
                >
                  <select
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  >
                    <option value="Utilidades" className="bg-slate-900">
                      Utilidades
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

            {/* Notas (span 2 columns) */}
            <div className="col-span-2">
              <Controller
                name="notas"
                control={control}
                render={({ field }) => (
                  <FieldWrapper
                    label="Notas de Pago"
                    icon={<FileText className="w-4 h-4" />}
                    error={errors.notas}
                    tooltip="Información adicional sobre el pago"
                    maxLength={1000}
                    showCounter
                  >
                    <textarea
                      {...field}
                      placeholder="Notas adicionales sobre el pago..."
                      rows={3}
                      maxLength={1000}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all resize-none"
                    />
                  </FieldWrapper>
                )}
              />
            </div>
          </FormSection>

          {/* ========================================================== */}
          {/* BOTONES DE ACCIÓN */}
          {/* ========================================================== */}
          <motion.div
            className="flex gap-4 pt-4 border-t border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Botón Guardar */}
            <LoadingButton
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              isSuccess={isSubmitSuccessful}
              loadingText="Guardando..."
              successText="¡Guardado!"
              className="flex-1"
            >
              {ventaExistente ? 'Actualizar Venta' : 'Guardar Venta'}
            </LoadingButton>

            {/* Botón Reset */}
            {isDirty && (
              <LoadingButton
                type="button"
                variant="secondary"
                size="lg"
                onClick={handleReset}
              >
                Resetear
              </LoadingButton>
            )}

            {/* Botón Cancelar */}
            <LoadingButton
              type="button"
              variant="ghost"
              size="lg"
              onClick={onClose}
            >
              Cancelar
            </LoadingButton>
          </motion.div>

          {/* ========================================================== */}
          {/* FORM DEBUGGER (Solo en desarrollo) */}
          {/* ========================================================== */}
          {showDebug && <FormDebugger />}
        </form>
      </motion.div>
    </motion.div>
  );
}
