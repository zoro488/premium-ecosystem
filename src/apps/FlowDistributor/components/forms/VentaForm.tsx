/**
 * Formulario para Registrar Ventas
 * Validación de stock automática
 */

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useOrdenesCompra } from '../../hooks/useOrdenesCompra';

const ventaFormSchema = z.object({
  fecha: z.string().min(1, 'Fecha es requerida'),
  ocRelacionada: z.string().optional(),
  cantidad: z.number().int().positive('Cantidad debe ser mayor a 0'),
  cliente: z.string().min(1, 'Cliente es requerido'),
  precioVenta: z.number().positive('Precio debe ser mayor a 0'),
  flete: z.number().nonnegative('Flete no puede ser negativo').optional(),
  estatus: z.string().optional(),
  concepto: z.string().optional(),
  moneda: z.enum(['USD', 'MXN']).default('USD'),
});

type VentaFormData = z.infer<typeof ventaFormSchema>;

interface VentaFormProps {
  onSubmit: (data: VentaFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const VentaForm: React.FC<VentaFormProps> = ({ onSubmit, onCancel, isLoading = false }) => {
  const { ordenes } = useOrdenesCompra();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm<VentaFormData>({
    resolver: zodResolver(ventaFormSchema),
    defaultValues: {
      fecha: new Date().toISOString().split('T')[0],
      moneda: 'USD',
      estatus: 'Completada',
      flete: 0,
    },
  });

  const cantidad = watch('cantidad', 0);
  const precioVenta = watch('precioVenta', 0);
  const flete = watch('flete', 0);
  const ocRelacionada = watch('ocRelacionada');
  const moneda = watch('moneda', 'USD');

  const ordenSeleccionada = ordenes.find((oc) => oc.id === ocRelacionada);
  const stockDisponible = ordenSeleccionada?.stockActual || 0;
  const costoPorUnidad = ordenSeleccionada?.costoPorUnidad || 0;

  const ingreso = cantidad * precioVenta;
  const costoTotal = cantidad * costoPorUnidad;
  const utilidad = ingreso - costoTotal - flete;
  const margenPorcentaje = ingreso > 0 ? ((utilidad / ingreso) * 100).toFixed(2) : '0.00';

  // ✅ Validación mejorada de stock
  const stockSuficiente = React.useMemo(() => {
    // Si no hay cantidad, consideramos que no hay problema de stock
    if (!cantidad || cantidad <= 0) return true;

    // Si hay OC relacionada, verificar stock disponible
    if (ocRelacionada && ordenSeleccionada) {
      return cantidad <= stockDisponible;
    }

    // Si no hay OC relacionada, permitir la venta (stock manual)
    return true;
  }, [cantidad, ocRelacionada, ordenSeleccionada, stockDisponible]);

  // ✅ Validación en tiempo real de stock
  useEffect(() => {
    if (ocRelacionada && ordenSeleccionada && cantidad > 0) {
      if (cantidad > stockDisponible) {
        setError('cantidad', {
          type: 'manual',
          message: `Stock insuficiente. Disponible: ${stockDisponible} unidades`,
        });
      } else {
        clearErrors('cantidad');
      }
    }
  }, [cantidad, stockDisponible, ocRelacionada, ordenSeleccionada, setError, clearErrors]);

  // ✅ Wrapper para onSubmit con validación adicional
  const handleFormSubmit = (data: VentaFormData) => {
    // Validación final antes de enviar
    if (data.ocRelacionada && ordenSeleccionada) {
      if (data.cantidad > stockDisponible) {
        setError('cantidad', {
          type: 'manual',
          message: `Stock insuficiente. Disponible: ${stockDisponible} unidades`,
        });
        return;
      }
    }

    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold text-gray-900">Registrar Venta</h2>

      {/* Fecha y Cliente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
            Fecha *
          </label>
          <input
            {...register('fecha')}
            type="date"
            id="fecha"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-zinc-500 focus:ring-green-500"
          />
          {errors.fecha && <p className="mt-1 text-sm text-white">{errors.fecha.message}</p>}
        </div>

        <div>
          <label htmlFor="cliente" className="block text-sm font-medium text-gray-700">
            Cliente *
          </label>
          <input
            {...register('cliente')}
            type="text"
            id="cliente"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-zinc-500 focus:ring-green-500"
            placeholder="Nombre del cliente"
          />
          {errors.cliente && <p className="mt-1 text-sm text-white">{errors.cliente.message}</p>}
        </div>
      </div>

      {/* OC Relacionada */}
      <div>
        <label htmlFor="ocRelacionada" className="block text-sm font-medium text-gray-700">
          Orden de Compra Relacionada (Opcional)
        </label>
        <select
          {...register('ocRelacionada')}
          id="ocRelacionada"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-zinc-500 focus:ring-green-500"
        >
          <option value="">-- Sin OC (Stock Manual) --</option>
          {ordenes
            .filter((oc) => oc.stockActual > 0)
            .map((oc) => (
              <option key={oc.id} value={oc.id}>
                {oc.id} - Stock: {oc.stockActual} - Costo: ${oc.costoPorUnidad?.toFixed(2)}
              </option>
            ))}
        </select>
        {ordenSeleccionada && (
          <p className="mt-1 text-sm text-white">
            📦 Stock disponible: {stockDisponible} unidades | Costo: ${costoPorUnidad.toFixed(2)}{' '}
            USD
          </p>
        )}
        {!ocRelacionada && cantidad > 0 && (
          <p className="mt-1 text-sm text-amber-600">
            ⚠️ Venta sin OC relacionada. Asegúrate de tener stock disponible.
          </p>
        )}
      </div>

      {/* Moneda */}
      <div>
        <label htmlFor="moneda" className="block text-sm font-medium text-gray-700">
          Moneda *
        </label>
        <select
          {...register('moneda')}
          id="moneda"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-zinc-500 focus:ring-green-500"
        >
          <option value="USD">USD (Dólares)</option>
          <option value="MXN">MXN (Pesos)</option>
        </select>
      </div>

      {/* Cantidad y Precio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700">
            Cantidad *
          </label>
          <input
            {...register('cantidad', { valueAsNumber: true })}
            type="number"
            id="cantidad"
            min="1"
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-zinc-500 focus:ring-green-500 ${
              errors.cantidad || !stockSuficiente ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="100"
          />
          {errors.cantidad && (
            <p className="mt-1 text-sm text-white font-semibold">❌ {errors.cantidad.message}</p>
          )}
          {!stockSuficiente && !errors.cantidad && (
            <p className="mt-1 text-sm text-white font-semibold">
              ⚠️ Stock insuficiente. Disponible: {stockDisponible} unidades
            </p>
          )}
        </div>

        <div>
          <label htmlFor="precioVenta" className="block text-sm font-medium text-gray-700">
            Precio de Venta ({moneda}) *
          </label>
          <input
            {...register('precioVenta', { valueAsNumber: true })}
            type="number"
            step="0.01"
            id="precioVenta"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-zinc-500 focus:ring-green-500"
            placeholder="550.00"
          />
          {errors.precioVenta && (
            <p className="mt-1 text-sm text-white">{errors.precioVenta.message}</p>
          )}
        </div>
      </div>

      {/* Flete */}
      <div>
        <label htmlFor="flete" className="block text-sm font-medium text-gray-700">
          Costo de Flete ({moneda})
        </label>
        <input
          {...register('flete', { valueAsNumber: true })}
          type="number"
          step="0.01"
          id="flete"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-zinc-500 focus:ring-green-500"
          placeholder="0.00"
        />
        {errors.flete && <p className="mt-1 text-sm text-white">{errors.flete.message}</p>}
      </div>

      {/* Cálculos Automáticos */}
      <div className="bg-zinc-900 p-4 rounded-md space-y-2">
        <p className="text-sm font-medium text-gray-700">Cálculos Automáticos:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
          <p>
            <span className="font-semibold">Ingreso:</span>{' '}
            <span className="text-white">
              ${ingreso.toFixed(2)} {moneda}
            </span>
          </p>
          <p>
            <span className="font-semibold">Costo:</span>{' '}
            <span className="text-white">
              ${costoTotal.toFixed(2)} {moneda}
            </span>
          </p>
          <p>
            <span className="font-semibold">Utilidad:</span>{' '}
            <span className={utilidad >= 0 ? 'text-white' : 'text-white'}>
              ${utilidad.toFixed(2)} {moneda}
            </span>
          </p>
          <p>
            <span className="font-semibold">Margen:</span>{' '}
            <span className={parseFloat(margenPorcentaje) >= 0 ? 'text-white' : 'text-white'}>
              {margenPorcentaje}%
            </span>
          </p>
        </div>
        {!ocRelacionada && costoTotal === 0 && cantidad > 0 && (
          <p className="text-xs text-amber-600 mt-2">
            💡 Sin OC relacionada, los costos no se calculan automáticamente
          </p>
        )}
      </div>

      {/* Estatus y Concepto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="estatus" className="block text-sm font-medium text-gray-700">
            Estatus
          </label>
          <select
            {...register('estatus')}
            id="estatus"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-zinc-500 focus:ring-green-500"
          >
            <option value="Completada">Completada</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        <div>
          <label htmlFor="concepto" className="block text-sm font-medium text-gray-700">
            Concepto/Notas
          </label>
          <input
            {...register('concepto')}
            type="text"
            id="concepto"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-zinc-500 focus:ring-green-500"
            placeholder="Notas adicionales"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-4 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading || !stockSuficiente}
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zinc-700 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title={!stockSuficiente ? 'Stock insuficiente para realizar la venta' : 'Registrar venta'}
        >
          {isLoading ? 'Guardando...' : 'Registrar Venta'}
        </button>
      </div>
    </form>
  );
};
