/**
 * Formulario para Crear/Editar Órdenes de Compra
 * Usa React Hook Form + Zod para validación
 */

import { zodResolver } from '@hookform/resolvers/zod';
import type React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const ordenCompraFormSchema = z.object({
  id: z.string().min(1, 'ID es requerido'),
  fecha: z.string().min(1, 'Fecha es requerida'),
  origen: z.string().min(1, 'Origen es requerido'),
  cantidad: z.number().int().positive('Cantidad debe ser mayor a 0'),
  costoDistribuidor: z.number().nonnegative('Costo no puede ser negativo'),
  costoTransporte: z.number().nonnegative('Costo no puede ser negativo'),
  stockMinimo: z.number().int().nonnegative('Stock mínimo no puede ser negativo').optional(),
  estado: z.enum(['pendiente', 'en_transito', 'recibida', 'pagada', 'cancelada']),
  moneda: z.enum(['USD', 'MXN']).default('USD'),
});

type OrdenCompraFormData = z.infer<typeof ordenCompraFormSchema>;

interface OrdenCompraFormProps {
  initialData?: Partial<OrdenCompraFormData>;
  onSubmit: (data: OrdenCompraFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const OrdenCompraForm: React.FC<OrdenCompraFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<OrdenCompraFormData>({
    resolver: zodResolver(ordenCompraFormSchema),
    defaultValues: {
      moneda: 'USD',
      estado: 'pendiente',
      ...initialData,
    },
  });

  const cantidad = watch('cantidad', 0);
  const costoDistribuidor = watch('costoDistribuidor', 0);
  const costoTransporte = watch('costoTransporte', 0);
  const moneda = watch('moneda', 'USD');

  const costoTotal = costoDistribuidor + costoTransporte;
  const costoPorUnidad = cantidad > 0 ? costoTotal / cantidad : 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900">
        {initialData ? 'Editar Orden de Compra' : 'Nueva Orden de Compra'}
      </h2>

      {/* ID y Fecha */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="id" className="block text-sm font-medium text-gray-700">
            ID de Orden *
          </label>
          <input
            {...register('id')}
            type="text"
            id="id"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-zinc-700 focus:ring-blue-500"
            placeholder="OC-001"
          />
          {errors.id && <p className="mt-1 text-sm text-white">{errors.id.message}</p>}
        </div>

        <div>
          <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
            Fecha *
          </label>
          <input
            {...register('fecha')}
            type="date"
            id="fecha"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-zinc-700 focus:ring-blue-500"
          />
          {errors.fecha && <p className="mt-1 text-sm text-white">{errors.fecha.message}</p>}
        </div>
      </div>

      {/* Origen y Cantidad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="origen" className="block text-sm font-medium text-gray-700">
            Origen/Distribuidor *
          </label>
          <input
            {...register('origen')}
            type="text"
            id="origen"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-zinc-700 focus:ring-blue-500"
            placeholder="Distribuidor ABC"
          />
          {errors.origen && <p className="mt-1 text-sm text-white">{errors.origen.message}</p>}
        </div>

        <div>
          <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700">
            Cantidad *
          </label>
          <input
            {...register('cantidad', { valueAsNumber: true })}
            type="number"
            id="cantidad"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-zinc-700 focus:ring-blue-500"
            placeholder="1000"
          />
          {errors.cantidad && (
            <p className="mt-1 text-sm text-white">{errors.cantidad.message}</p>
          )}
        </div>
      </div>

      {/* Moneda */}
      <div>
        <label htmlFor="moneda" className="block text-sm font-medium text-gray-700">
          Moneda *
        </label>
        <select
          {...register('moneda')}
          id="moneda"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-zinc-700 focus:ring-blue-500"
        >
          <option value="USD">USD (Dólares)</option>
          <option value="MXN">MXN (Pesos)</option>
        </select>
      </div>

      {/* Costos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="costoDistribuidor" className="block text-sm font-medium text-gray-700">
            Costo Distribuidor ({moneda}) *
          </label>
          <input
            {...register('costoDistribuidor', { valueAsNumber: true })}
            type="number"
            step="0.01"
            id="costoDistribuidor"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-zinc-700 focus:ring-blue-500"
            placeholder="50000.00"
          />
          {errors.costoDistribuidor && (
            <p className="mt-1 text-sm text-white">{errors.costoDistribuidor.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="costoTransporte" className="block text-sm font-medium text-gray-700">
            Costo Transporte ({moneda}) *
          </label>
          <input
            {...register('costoTransporte', { valueAsNumber: true })}
            type="number"
            step="0.01"
            id="costoTransporte"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-zinc-700 focus:ring-blue-500"
            placeholder="5000.00"
          />
          {errors.costoTransporte && (
            <p className="mt-1 text-sm text-white">{errors.costoTransporte.message}</p>
          )}
        </div>
      </div>

      {/* Cálculos Automáticos */}
      <div className="bg-zinc-900 p-4 rounded-md space-y-2">
        <p className="text-sm font-medium text-gray-700">Cálculos Automáticos:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <p>
            <span className="font-semibold">Costo Total:</span>{' '}
            <span className="text-white">
              ${costoTotal.toFixed(2)} {moneda}
            </span>
          </p>
          <p>
            <span className="font-semibold">Costo por Unidad:</span>{' '}
            <span className="text-white">
              ${costoPorUnidad.toFixed(2)} {moneda}
            </span>
          </p>
        </div>
      </div>

      {/* Stock Mínimo y Estado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="stockMinimo" className="block text-sm font-medium text-gray-700">
            Stock Mínimo (Alerta)
          </label>
          <input
            {...register('stockMinimo', { valueAsNumber: true })}
            type="number"
            id="stockMinimo"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-zinc-700 focus:ring-blue-500"
            placeholder="100"
          />
          {errors.stockMinimo && (
            <p className="mt-1 text-sm text-white">{errors.stockMinimo.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
            Estado *
          </label>
          <select
            {...register('estado')}
            id="estado"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-zinc-700 focus:ring-blue-500"
          >
            <option value="pendiente">Pendiente</option>
            <option value="en_transito">En Tránsito</option>
            <option value="recibida">Recibida</option>
            <option value="pagada">Pagada</option>
            <option value="cancelada">Cancelada</option>
          </select>
          {errors.estado && <p className="mt-1 text-sm text-white">{errors.estado.message}</p>}
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-4 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear Orden'}
        </button>
      </div>
    </form>
  );
};
