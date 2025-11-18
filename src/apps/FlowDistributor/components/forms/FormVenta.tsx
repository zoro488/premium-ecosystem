/**
 * 💰 FormVenta - Formulario completo para crear ventas
 *
 * Características:
 * - Wizard multi-paso (4 pasos)
 * - Selección de cliente con autocomplete
 * - Array dinámico de productos con cálculos automáticos
 * - Validación en tiempo real
 * - Cálculo automático de totales
 * - Selección de banco destino
 * - Integración con Zustand store
 */
import React, { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Building2,
  Check,
  DollarSign,
  Package,
  Plus,
  ShoppingCart,
  Trash2,
  TrendingUp,
  User,
} from 'lucide-react';
import { z } from 'zod';

import { useFlowStore } from '@/stores/flowStore';

import {
  calculateProductSubtotal,
  calculateSaleTotal,
  calculateSaleUtilities,
} from '../../utils/calculations.ts';
import { formatCurrency } from '../../utils/formatters';
import {
  createSaleSchema,
  productsArraySchema,
  validateProductTotals,
  validateSaleTotal,
} from '../../utils/validators.ts';
import { FormBase, FormField } from './FormBase';

interface ProductItem {
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
}

interface FormVentaProps {
  onClose?: () => void;
  onSuccess?: (ventaId: string) => void;
}

export const FormVenta: React.FC<FormVentaProps> = ({ onClose, onSuccess }) => {
  const { clientes, addVenta, updateBankBalance, addAlmacenMovement } = useFlowStore();

  // Estados del formulario
  const [currentStep, setCurrentStep] = useState(0);
  const [cliente, setCliente] = useState('');
  const [productos, setProductos] = useState<ProductItem[]>([
    { nombre: '', cantidad: 1, precio: 0, subtotal: 0 },
  ]);
  const [aplicaFlete, setAplicaFlete] = useState(false);
  const [totalFletes, setTotalFletes] = useState(0);
  const [destino, setDestino] = useState<string>('');
  const [concepto, setConcepto] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calcular totales automáticamente
  const totalVenta = calculateSaleTotal(productos);
  const totalUtilidades = calculateSaleUtilities(totalVenta, totalFletes);

  // Opciones de clientes para autocomplete
  const clienteOptions = clientes.map((c) => c.nombre);

  // Opciones de bancos destino
  const bancoOptions = [
    { value: 'bovedaMonte', label: 'Bóveda Monte' },
    { value: 'bovedaUsa', label: 'Bóveda USA' },
    { value: 'azteca', label: 'Banco Azteca' },
    { value: 'leftie', label: 'Leftie' },
    { value: 'fleteSur', label: 'Flete Sur' },
    { value: 'profit', label: 'Profit' },
    { value: 'utilidades', label: 'Utilidades' },
  ];

  // Actualizar subtotal cuando cambian cantidad o precio
  useEffect(() => {
    setProductos((prev) =>
      prev.map((p) => ({
        ...p,
        subtotal: calculateProductSubtotal(p.cantidad, p.precio),
      }))
    );
  }, [productos.length]); // Solo reaccionar a cambios en longitud

  // Agregar producto vacío
  const handleAddProduct = () => {
    if (productos.length >= 50) {
      alert('Máximo 50 productos por venta');
      return;
    }
    setProductos((prev) => [...prev, { nombre: '', cantidad: 1, precio: 0, subtotal: 0 }]);
  };

  // Eliminar producto
  const handleRemoveProduct = (index: number) => {
    if (productos.length === 1) {
      alert('Debe haber al menos un producto');
      return;
    }
    setProductos((prev) => prev.filter((_, i) => i !== index));
  };

  // Actualizar producto
  const handleProductChange = (index: number, field: keyof ProductItem, value: string | number) => {
    setProductos((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      // Recalcular subtotal
      if (field === 'cantidad' || field === 'precio') {
        updated[index].subtotal = calculateProductSubtotal(
          updated[index].cantidad,
          updated[index].precio
        );
      }

      return updated;
    });
  };

  // Validar paso actual
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Cliente
        if (!cliente || cliente.trim() === '') {
          newErrors.cliente = 'Debe seleccionar o ingresar un cliente';
        }
        break;

      case 1: // Productos
        if (productos.length === 0) {
          newErrors.productos = 'Debe agregar al menos un producto';
        }

        productos.forEach((p, index) => {
          if (!p.nombre || p.nombre.trim() === '') {
            newErrors[`producto_${index}_nombre`] = 'El nombre es requerido';
          }
          if (p.cantidad <= 0) {
            newErrors[`producto_${index}_cantidad`] = 'La cantidad debe ser mayor a 0';
          }
          if (p.precio <= 0) {
            newErrors[`producto_${index}_precio`] = 'El precio debe ser mayor a 0';
          }
        });

        if (!validateProductTotals(productos)) {
          newErrors.productos = 'Los subtotales no coinciden con las cantidades y precios';
        }
        break;

      case 2: // Fletes y destino
        if (aplicaFlete && totalFletes < 0) {
          newErrors.totalFletes = 'Los fletes no pueden ser negativos';
        }
        if (!destino) {
          newErrors.destino = 'Debe seleccionar un banco destino';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navegar al siguiente paso
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  // Navegar al paso anterior
  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Enviar formulario
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    try {
      // Crear ID único para la venta
      const ventaId = `V-${Date.now()}-${cliente.substring(0, 3).toUpperCase()}`;
      const fecha = new Date().toISOString().split('T')[0];

      // Crear objeto de venta
      const nuevaVenta = {
        id: ventaId,
        tipo: 'Venta',
        fecha,
        cliente,
        productos,
        totalVenta,
        totalFletes: aplicaFlete ? totalFletes : 0,
        totalUtilidades,
        aplicaFlete,
        destino,
        concepto: concepto || `Venta a ${cliente}`,
        estatus: 'Activo',
        estadoPago: 'Pendiente',
        adeudo: totalVenta,
        montoPagado: 0,
      };

      // Validar con schema de Zod
      createSaleSchema.parse(nuevaVenta);

      // Agregar venta al store
      await addVenta(nuevaVenta);

      // Actualizar balance del banco destino (ingreso)
      await updateBankBalance(destino, totalVenta, 'ingreso');

      // Registrar movimiento de almacén (salida)
      await addAlmacenMovement({
        tipo: 'salida',
        fecha,
        cantidad: productos.reduce((sum, p) => sum + p.cantidad, 0),
        destino: cliente,
        concepto: `Venta ${ventaId}`,
      });

      // Callback de éxito
      if (onSuccess) {
        onSuccess(ventaId);
      }

      // Cerrar formulario
      if (onClose) {
        setTimeout(onClose, 2000);
      }
    } catch (error) {
      console.error('Error al crear venta:', error);
      if (error instanceof z.ZodError) {
        const zodErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            zodErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(zodErrors);
      }
      throw error;
    }
  };

  // Renderizar paso actual
  const renderStep = () => {
    switch (currentStep) {
      case 0: // PASO 1: Cliente
        return (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-indigo-400" />
              <h3 className="text-xl font-bold text-white">Seleccionar Cliente</h3>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-white mb-2 block">
                Cliente <span className="text-red-400">*</span>
              </span>
              <input
                type="text"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Buscar o ingresar cliente..."
                list="clientes-datalist"
                className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder-slate-400 transition-all ${
                  errors.cliente
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-white/10 focus:border-indigo-500'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
              />
              <datalist id="clientes-datalist">
                {clienteOptions.map((c, i) => (
                  <option key={i} value={c} />
                ))}
              </datalist>
              {errors.cliente && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.cliente}
                </p>
              )}
            </label>

            <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-blue-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Si el cliente no existe, escribe el nombre y se creará automáticamente
              </p>
            </div>
          </motion.div>
        );

      case 1: // PASO 2: Productos
        return (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-indigo-400" />
                <h3 className="text-xl font-bold text-white">Productos</h3>
              </div>
              <button
                type="button"
                onClick={handleAddProduct}
                className="px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Agregar
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {productos.map((producto, index) => (
                <motion.div
                  key={index}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-400">
                      Producto #{index + 1}
                    </span>
                    {productos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-6">
                      <input
                        type="text"
                        value={producto.nombre}
                        onChange={(e) => handleProductChange(index, 'nombre', e.target.value)}
                        placeholder="Nombre del producto"
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 text-sm focus:border-indigo-500 focus:outline-none"
                      />
                      {errors[`producto_${index}_nombre`] && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors[`producto_${index}_nombre`]}
                        </p>
                      )}
                    </div>

                    <div className="col-span-2">
                      <input
                        type="number"
                        value={producto.cantidad}
                        onChange={(e) =>
                          handleProductChange(index, 'cantidad', parseInt(e.target.value) || 0)
                        }
                        placeholder="Cant."
                        min="1"
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 text-sm focus:border-indigo-500 focus:outline-none"
                      />
                      {errors[`producto_${index}_cantidad`] && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors[`producto_${index}_cantidad`]}
                        </p>
                      )}
                    </div>

                    <div className="col-span-2">
                      <input
                        type="number"
                        value={producto.precio}
                        onChange={(e) =>
                          handleProductChange(index, 'precio', parseFloat(e.target.value) || 0)
                        }
                        placeholder="Precio"
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 text-sm focus:border-indigo-500 focus:outline-none"
                      />
                      {errors[`producto_${index}_precio`] && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors[`producto_${index}_precio`]}
                        </p>
                      )}
                    </div>

                    <div className="col-span-2">
                      <div className="px-3 py-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-mono text-right">
                        ${producto.subtotal.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {errors.productos && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.productos}
              </p>
            )}

            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">Total Venta:</span>
                <span className="text-2xl font-bold text-indigo-300">
                  {formatCurrency(totalVenta)}
                </span>
              </div>
            </div>
          </motion.div>
        );

      case 2: // PASO 3: Fletes y Destino
        return (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-6 h-6 text-indigo-400" />
              <h3 className="text-xl font-bold text-white">Fletes y Destino</h3>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={aplicaFlete}
                onChange={(e) => {
                  setAplicaFlete(e.target.checked);
                  if (!e.target.checked) setTotalFletes(0);
                }}
                className="w-5 h-5 rounded border-white/10 bg-white/5 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
              />
              <span className="text-white font-medium">¿Aplica flete?</span>
            </label>

            {aplicaFlete && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block">
                  <span className="text-sm font-medium text-white mb-2 block">Total Fletes</span>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      $
                    </span>
                    <input
                      type="number"
                      value={totalFletes}
                      onChange={(e) => setTotalFletes(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  {errors.totalFletes && (
                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.totalFletes}
                    </p>
                  )}
                </label>
              </motion.div>
            )}

            <label className="block">
              <span className="text-sm font-medium text-white mb-2 block flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" />
                Banco Destino <span className="text-red-400">*</span>
              </span>
              <select
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white appearance-none cursor-pointer transition-all ${
                  errors.destino
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-white/10 focus:border-indigo-500'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
              >
                <option value="">Seleccionar banco...</option>
                {bancoOptions.map((banco) => (
                  <option key={banco.value} value={banco.value}>
                    {banco.label}
                  </option>
                ))}
              </select>
              {errors.destino && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.destino}
                </p>
              )}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-white mb-2 block">Concepto (opcional)</span>
              <textarea
                value={concepto}
                onChange={(e) => setConcepto(e.target.value)}
                placeholder="Agrega notas o detalles adicionales..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </label>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <p className="text-sm text-slate-400 mb-1">Total Utilidades</p>
                <p className="text-2xl font-bold text-purple-300 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {formatCurrency(totalUtilidades)}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <p className="text-sm text-slate-400 mb-1">Total Venta</p>
                <p className="text-2xl font-bold text-indigo-300 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  {formatCurrency(totalVenta)}
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 3: // PASO 4: Resumen
        return (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Check className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">Confirmar Venta</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-sm text-slate-400 mb-2">Cliente</p>
                <p className="text-lg font-bold text-white">{cliente}</p>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-sm text-slate-400 mb-3">Productos ({productos.length})</p>
                <div className="space-y-2">
                  {productos.map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-white">
                        {p.nombre} x{p.cantidad}
                      </span>
                      <span className="text-slate-300 font-mono">${p.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-sm text-slate-400 mb-1">Banco Destino</p>
                  <p className="text-white font-medium">
                    {bancoOptions.find((b) => b.value === destino)?.label}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-sm text-slate-400 mb-1">Aplica Flete</p>
                  <p className="text-white font-medium">
                    {aplicaFlete ? `Sí - ${formatCurrency(totalFletes)}` : 'No'}
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-white">
                    <span>Total Venta:</span>
                    <span className="text-2xl font-bold">{formatCurrency(totalVenta)}</span>
                  </div>
                  <div className="flex items-center justify-between text-purple-300">
                    <span>Total Utilidades:</span>
                    <span className="text-xl font-bold">{formatCurrency(totalUtilidades)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        className="w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden"
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {/* HEADER */}
        <div
          className="px-6 py-5 border-b border-white/10"
          style={{
            background:
              'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-indigo-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">Nueva Venta</h2>
                <p className="text-sm text-slate-400">Paso {currentStep + 1} de 4</p>
              </div>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="mt-4">
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex-1 h-1.5 rounded-full transition-all ${
                    step <= currentStep ? 'bg-indigo-500' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
          >
            Cancelar
          </button>

          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-6 py-2.5 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
              >
                Anterior
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-lg font-medium text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                }}
              >
                Siguiente
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-lg font-medium text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                }}
              >
                Confirmar Venta
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FormVenta;
