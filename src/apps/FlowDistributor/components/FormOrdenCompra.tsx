/**
 * 🎯 FORMULARIO ORDEN DE COMPRA - VERSION TYPESCRIPT + REACT HOOK FORM
 *
 * Formulario completo de órdenes de compra con:
 * - React Hook Form + Zod validation
 * - useFieldArray para productos dinámicos
 * - Cálculos automáticos multi-moneda
 * - Estados de workflow (9 estados OC, 5 estados pago)
 * - Multi-distribuidor
 * - Shipping tracking
 * - Quality inspection
 * - Componentes reutilizables premium
 * - Animaciones avanzadas
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    Calculator,
    Calendar,
    ClipboardCheck,
    DollarSign,
    FileText,
    Hash,
    Package,
    Plus,
    ShoppingCart,
    Trash2,
    TrendingUp,
    Truck,
    User,
    X
} from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

// Schemas
import type { OrdenCompraFormData } from '../schemas/ordenCompra.schema';
import { ordenCompraDefaultValues, ordenCompraSchema } from '../schemas/ordenCompra.schema';

// Components
import {
    FieldWrapper,
    FormDebugger,
    FormSection,
    LoadingButton
} from './forms';

// Types
interface FormOrdenCompraProps {
  onClose: () => void;
  onSave: (data: OrdenCompraFormData) => Promise<void> | void;
  ordenExistente?: Partial<OrdenCompraFormData> | null;
  showDebug?: boolean;
}

/**
 * Formulario de Orden de Compra con React Hook Form + Zod
 */
export default function FormOrdenCompra({
  onClose,
  onSave,
  ordenExistente = null,
  showDebug = process.env.NODE_ENV === 'development',
}: FormOrdenCompraProps) {
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
  } = useForm<OrdenCompraFormData>({
    resolver: zodResolver(ordenCompraSchema),
    defaultValues: ordenExistente || ordenCompraDefaultValues,
    mode: 'onChange',
  });

  // ============================================================================
  // FIELD ARRAY - Productos dinámicos
  // ============================================================================

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'productos',
  });

  // ============================================================================
  // WATCHERS
  // ============================================================================

  const productos = watch('productos');
  const moneda = watch('moneda');
  const tasaCambio = watch('tasaCambio');
  const costoEnvio = watch('costoEnvio');
  const impuestos = watch('impuestos');
  const descuento = watch('descuento');
  const estadoPago = watch('estadoPago');

  // ============================================================================
  // CÁLCULOS AUTOMÁTICOS
  // ============================================================================

  const totales = useMemo(() => {
    // Subtotal de productos
    const subtotal = productos?.reduce((acc, producto) => {
      const cant = producto.cantidad || 0;
      const precio = producto.precioUnitario || 0;
      return acc + cant * precio;
    }, 0) || 0;

    // Aplicar descuento
    const descuentoMonto = descuento || 0;
    const subtotalConDescuento = subtotal - descuentoMonto;

    // Aplicar impuestos
    const impuestosMonto = impuestos || 0;
    const subtotalConImpuestos = subtotalConDescuento + impuestosMonto;

    // Agregar costos de envío
    const envio = costoEnvio || 0;
    const totalFinal = subtotalConImpuestos + envio;

    // Conversión de moneda si aplica
    const tasa = tasaCambio || 1;
    const totalEnMonedaBase = moneda === 'MXN' ? totalFinal : totalFinal * tasa;

    return {
      subtotal,
      descuentoMonto,
      subtotalConDescuento,
      impuestosMonto,
      subtotalConImpuestos,
      envio,
      totalFinal,
      totalEnMonedaBase,
    };
  }, [productos, descuento, impuestos, costoEnvio, tasaCambio, moneda]);

  // Auto-actualizar montoTotal
  useEffect(() => {
    setValue('montoTotal', totales.totalFinal);
  }, [totales.totalFinal, setValue]);

  // Auto-calcular saldoPendiente
  useEffect(() => {
    const montoPagado = watch('montoPagado') || 0;
    const saldo = totales.totalFinal - montoPagado;
    setValue('saldoPendiente', Math.max(0, saldo));
  }, [totales.totalFinal, watch('montoPagado'), setValue]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const onSubmit = async (data: OrdenCompraFormData) => {
    try {
      await onSave(data);
      setTimeout(() => {
        if (!isSubmitSuccessful) {
          onClose();
        }
      }, 1500);
    } catch (error) {
      console.error('Error al guardar orden de compra:', error);
    }
  };

  const handleReset = () => {
    reset(ordenExistente || ordenCompraDefaultValues);
  };

  /**
   * Agregar nuevo producto
   */
  const handleAddProducto = useCallback(() => {
    append({
      productoId: '',
      nombre: '',
      descripcion: '',
      cantidad: 1,
      unidadMedida: 'pza',
      precioUnitario: 0,
      descuento: 0,
      impuesto: 0,
      subtotal: 0,
    });
  }, [append]);

  /**
   * Eliminar producto
   */
  const handleRemoveProducto = useCallback(
    (index: number) => {
      if (fields.length > 1) {
        remove(index);
      }
    },
    [remove, fields.length]
  );

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
        className="bg-gradient-to-br from-slate-900/95 to-zinc-800/95 backdrop-blur-xl border border-zinc-800/30 rounded-2xl shadow-2xl max-w-7xl w-full my-8"
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
            <ShoppingCart className="w-7 h-7 text-zinc-800" />
            {ordenExistente ? 'Editar Orden de Compra' : 'Nueva Orden de Compra'}
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* ========================================================== */}
          {/* SECCIÓN 1: INFORMACIÓN GENERAL */}
          {/* ========================================================== */}
          <FormSection
            title="Información General"
            description="Datos básicos de la orden de compra"
            icon={<FileText className="w-5 h-5" />}
            variant="default"
            columns={3}
            isRequired
          >
            {/* Número OC */}
            <Controller
              name="numeroOC"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Número de OC"
                  icon={<Hash className="w-4 h-4" />}
                  error={errors.numeroOC}
                  required
                  tooltip="Número único de la orden de compra"
                >
                  <input
                    type="text"
                    {...field}
                    placeholder="OC-00001"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* Fecha OC */}
            <Controller
              name="fechaOC"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Fecha de Orden"
                  icon={<Calendar className="w-4 h-4" />}
                  error={errors.fechaOC}
                  required
                >
                  <input
                    type="date"
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* Distribuidor ID */}
            <Controller
              name="distribuidorId"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Distribuidor"
                  icon={<User className="w-4 h-4" />}
                  error={errors.distribuidorId}
                  required
                  tooltip="Seleccione el distribuidor"
                >
                  <input
                    type="text"
                    {...field}
                    placeholder="ID del distribuidor"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* Estado OC */}
            <Controller
              name="estadoOC"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Estado de OC"
                  icon={<ClipboardCheck className="w-4 h-4" />}
                  error={errors.estadoOC}
                  required
                >
                  <select
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                  >
                    <option value="borrador" className="bg-slate-900">Borrador</option>
                    <option value="pendiente_aprobacion" className="bg-slate-900">Pendiente Aprobación</option>
                    <option value="aprobada" className="bg-slate-900">Aprobada</option>
                    <option value="enviada" className="bg-slate-900">Enviada</option>
                    <option value="en_transito" className="bg-slate-900">En Tránsito</option>
                    <option value="recibida_parcial" className="bg-slate-900">Recibida Parcial</option>
                    <option value="recibida_completa" className="bg-slate-900">Recibida Completa</option>
                    <option value="cancelada" className="bg-slate-900">Cancelada</option>
                    <option value="rechazada" className="bg-slate-900">Rechazada</option>
                  </select>
                </FieldWrapper>
              )}
            />

            {/* Prioridad */}
            <Controller
              name="prioridad"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Prioridad"
                  icon={<AlertTriangle className="w-4 h-4" />}
                  error={errors.prioridad}
                  required
                >
                  <select
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                  >
                    <option value="baja" className="bg-slate-900">Baja</option>
                    <option value="normal" className="bg-slate-900">Normal</option>
                    <option value="alta" className="bg-slate-900">Alta</option>
                    <option value="urgente" className="bg-slate-900">Urgente</option>
                  </select>
                </FieldWrapper>
              )}
            />

            {/* Fecha Entrega Esperada */}
            <Controller
              name="fechaEntregaEsperada"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Fecha Entrega Esperada"
                  icon={<Calendar className="w-4 h-4" />}
                  error={errors.fechaEntregaEsperada}
                  required
                >
                  <input
                    type="date"
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />
          </FormSection>

          {/* ========================================================== */}
          {/* SECCIÓN 2: PRODUCTOS (Dynamic Field Array) */}
          {/* ========================================================== */}
          <FormSection
            title="Productos"
            description={`${fields.length} producto(s) en esta orden`}
            icon={<Package className="w-5 h-5" />}
            variant="accent"
            columns={1}
            isRequired
          >
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Producto #{index + 1}
                      </h4>

                      {fields.length > 1 && (
                        <motion.button
                          type="button"
                          onClick={() => handleRemoveProducto(index)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-zinc-200 hover:text-red-300 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      {/* Nombre Producto */}
                      <div className="col-span-2">
                        <Controller
                          name={`productos.${index}.nombre`}
                          control={control}
                          render={({ field }) => (
                            <FieldWrapper
                              label="Nombre"
                              error={errors.productos?.[index]?.nombre}
                              required
                            >
                              <input
                                type="text"
                                {...field}
                                placeholder="Nombre del producto"
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 transition-all text-sm"
                              />
                            </FieldWrapper>
                          )}
                        />
                      </div>

                      {/* Cantidad */}
                      <Controller
                        name={`productos.${index}.cantidad`}
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <FieldWrapper
                            label="Cantidad"
                            error={errors.productos?.[index]?.cantidad}
                            required
                          >
                            <input
                              type="number"
                              step="1"
                              min="1"
                              {...field}
                              value={value || ''}
                              onChange={(e) => {
                                const newValue = parseFloat(e.target.value) || 0;
                                onChange(newValue);
                                // Auto-calcular subtotal
                                const precio = watch(`productos.${index}.precioUnitario`) || 0;
                                setValue(`productos.${index}.subtotal`, newValue * precio);
                              }}
                              placeholder="0"
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 transition-all text-sm"
                            />
                          </FieldWrapper>
                        )}
                      />

                      {/* Precio Unitario */}
                      <Controller
                        name={`productos.${index}.precioUnitario`}
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <FieldWrapper
                            label="Precio Unit."
                            error={errors.productos?.[index]?.precioUnitario}
                            required
                          >
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-800/70 text-xs">
                                $
                              </span>
                              <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                {...field}
                                value={value || ''}
                                onChange={(e) => {
                                  const newValue = parseFloat(e.target.value) || 0;
                                  onChange(newValue);
                                  // Auto-calcular subtotal
                                  const cant = watch(`productos.${index}.cantidad`) || 0;
                                  setValue(`productos.${index}.subtotal`, cant * newValue);
                                }}
                                placeholder="0.00"
                                className="w-full pl-6 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 transition-all text-sm"
                              />
                            </div>
                          </FieldWrapper>
                        )}
                      />

                      {/* Unidad de Medida */}
                      <Controller
                        name={`productos.${index}.unidadMedida`}
                        control={control}
                        render={({ field }) => (
                          <FieldWrapper label="Unidad" error={errors.productos?.[index]?.unidadMedida}>
                            <select
                              {...field}
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-800/50 transition-all text-sm"
                            >
                              <option value="pza" className="bg-slate-900">Pieza</option>
                              <option value="kg" className="bg-slate-900">Kilogramo</option>
                              <option value="lt" className="bg-slate-900">Litro</option>
                              <option value="m" className="bg-slate-900">Metro</option>
                              <option value="caja" className="bg-slate-900">Caja</option>
                              <option value="paquete" className="bg-slate-900">Paquete</option>
                            </select>
                          </FieldWrapper>
                        )}
                      />

                      {/* Subtotal (readonly) */}
                      <div className="col-span-3">
                        <Controller
                          name={`productos.${index}.subtotal`}
                          control={control}
                          render={({ field }) => (
                            <FieldWrapper label="Subtotal">
                              <div className="px-3 py-2 bg-zinc-9000/10 border border-emerald-400/30 rounded-lg">
                                <p className="text-emerald-300 font-bold text-sm">
                                  ${(field.value || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </p>
                              </div>
                            </FieldWrapper>
                          )}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Botón Agregar Producto */}
              <motion.button
                type="button"
                onClick={handleAddProducto}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 bg-zinc-800/20 border border-zinc-800/30 rounded-xl text-zinc-800 hover:bg-zinc-800/30 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                Agregar Producto
              </motion.button>
            </div>
          </FormSection>

          {/* ========================================================== */}
          {/* SECCIÓN 3: MONTOS Y MONEDA */}
          {/* ========================================================== */}
          <FormSection
            title="Información Financiera"
            description="Moneda, costos adicionales y totales"
            icon={<DollarSign className="w-5 h-5" />}
            variant="default"
            columns={3}
          >
            {/* Moneda */}
            <Controller
              name="moneda"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Moneda" icon={<DollarSign className="w-4 h-4" />} error={errors.moneda}>
                  <select
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                  >
                    <option value="MXN" className="bg-slate-900">MXN (Peso Mexicano)</option>
                    <option value="USD" className="bg-slate-900">USD (Dólar Americano)</option>
                    <option value="EUR" className="bg-slate-900">EUR (Euro)</option>
                  </select>
                </FieldWrapper>
              )}
            />

            {/* Tasa de Cambio */}
            {moneda !== 'MXN' && (
              <Controller
                name="tasaCambio"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <FieldWrapper
                    label="Tasa de Cambio a MXN"
                    icon={<TrendingUp className="w-4 h-4" />}
                    error={errors.tasaCambio}
                    tooltip={`1 ${moneda} = X MXN`}
                  >
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      {...field}
                      value={value || ''}
                      onChange={(e) => onChange(parseFloat(e.target.value) || 1)}
                      placeholder="1.00"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                    />
                  </FieldWrapper>
                )}
              />
            )}

            {/* Costo Envío */}
            <Controller
              name="costoEnvio"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper
                  label="Costo de Envío"
                  icon={<Truck className="w-4 h-4" />}
                  error={errors.costoEnvio}
                >
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-800/70">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      value={value || ''}
                      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                    />
                  </div>
                </FieldWrapper>
              )}
            />

            {/* Impuestos */}
            <Controller
              name="impuestos"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper
                  label="Impuestos (IVA)"
                  icon={<FileText className="w-4 h-4" />}
                  error={errors.impuestos}
                >
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-800/70">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      value={value || ''}
                      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                    />
                  </div>
                </FieldWrapper>
              )}
            />

            {/* Descuento */}
            <Controller
              name="descuento"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper
                  label="Descuento"
                  icon={<DollarSign className="w-4 h-4" />}
                  error={errors.descuento}
                >
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-800/70">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      value={value || ''}
                      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                    />
                  </div>
                </FieldWrapper>
              )}
            />

            {/* Método de Envío */}
            <Controller
              name="metodoEnvio"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Método de Envío" icon={<Truck className="w-4 h-4" />} error={errors.metodoEnvio}>
                  <select
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                  >
                    <option value="terrestre" className="bg-slate-900">Terrestre</option>
                    <option value="aereo" className="bg-slate-900">Aéreo</option>
                    <option value="maritimo" className="bg-slate-900">Marítimo</option>
                    <option value="mensajeria" className="bg-slate-900">Mensajería</option>
                    <option value="retiro_local" className="bg-slate-900">Retiro Local</option>
                    <option value="otro" className="bg-slate-900">Otro</option>
                  </select>
                </FieldWrapper>
              )}
            />
          </FormSection>

          {/* ========================================================== */}
          {/* PANEL DE TOTALES */}
          {/* ========================================================== */}
          <motion.div
            className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-400/30 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-zinc-200" />
              <h3 className="text-lg font-bold text-emerald-300">Resumen Financiero</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <p className="text-xs text-zinc-300/70 mb-1">Subtotal</p>
                <p className="text-xl font-bold text-white">
                  ${totales.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <p className="text-xs text-zinc-800/70 mb-1">Impuestos</p>
                <p className="text-xl font-bold text-white">
                  ${totales.impuestosMonto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <p className="text-xs text-yellow-300/70 mb-1">Descuento</p>
                <p className="text-xl font-bold text-zinc-200">
                  -${totales.descuentoMonto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-emerald-400/30">
                <p className="text-xs text-emerald-300/70 mb-1">TOTAL</p>
                <p className="text-2xl font-bold text-emerald-300">
                  ${totales.totalFinal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} {moneda}
                </p>
              </div>
            </div>

            {moneda !== 'MXN' && (
              <div className="mt-4 p-3 bg-zinc-800/10 border border-zinc-600/30 rounded-lg">
                <p className="text-sm text-zinc-300">
                  Equivalente en MXN:{' '}
                  <span className="font-bold">
                    ${totales.totalEnMonedaBase.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                </p>
              </div>
            )}
          </motion.div>

          {/* ========================================================== */}
          {/* SECCIÓN 4: ESTADO DE PAGO */}
          {/* ========================================================== */}
          <FormSection
            title="Estado de Pago"
            description="Información del pago de la orden"
            icon={<DollarSign className="w-5 h-5" />}
            variant="default"
            columns={3}
          >
            {/* Estado Pago */}
            <Controller
              name="estadoPago"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Estado de Pago" error={errors.estadoPago} required>
                  <select
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                  >
                    <option value="pendiente" className="bg-slate-900">Pendiente</option>
                    <option value="pago_parcial" className="bg-slate-900">Pago Parcial</option>
                    <option value="pagado" className="bg-slate-900">Pagado</option>
                    <option value="credito" className="bg-slate-900">Crédito</option>
                    <option value="vencido" className="bg-slate-900">Vencido</option>
                  </select>
                </FieldWrapper>
              )}
            />

            {/* Monto Pagado */}
            <Controller
              name="montoPagado"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper label="Monto Pagado" error={errors.montoPagado}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-800/70">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      value={value || ''}
                      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                    />
                  </div>
                </FieldWrapper>
              )}
            />

            {/* Saldo Pendiente (readonly) */}
            <Controller
              name="saldoPendiente"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Saldo Pendiente">
                  <div className="px-4 py-3 bg-zinc-9000/10 border border-yellow-400/30 rounded-xl">
                    <p className="text-xl font-bold text-yellow-300">
                      ${(field.value || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </FieldWrapper>
              )}
            />

            {/* Notas (span 3 columns) */}
            <div className="col-span-3">
              <Controller
                name="notas"
                control={control}
                render={({ field }) => (
                  <FieldWrapper
                    label="Notas / Observaciones"
                    icon={<FileText className="w-4 h-4" />}
                    error={errors.notas}
                    maxLength={1000}
                    showCounter
                  >
                    <textarea
                      {...field}
                      placeholder="Observaciones o notas adicionales..."
                      rows={3}
                      maxLength={1000}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all resize-none"
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
              {ordenExistente ? 'Actualizar Orden' : 'Guardar Orden'}
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
