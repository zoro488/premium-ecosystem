/**
 * 💰 useVentasService Hook - TanStack Query para Ventas
 * Distribución automática a bancos cuando estatus = PAGADO
 * Integración con almacén (salida de stock)
 */
import { useCallback } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import ventasService, { type Venta } from '../services/ventas.service';

/**
 * Hook principal para ventas
 */
export function useVentas() {
  const queryClient = useQueryClient();

  // ========================================================================
  // QUERIES
  // ========================================================================

  const {
    data: ventas = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['ventas'],
    queryFn: () => ventasService.getAll(),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });

  // ========================================================================
  // MUTATIONS
  // ========================================================================

  /**
   * Crear venta
   * - Si estatus = PAGADO, distribuye automáticamente a bancos
   * - Registra salida en almacén
   */
  const crearVentaMutation = useMutation({
    mutationFn: async (data: Omit<Venta, 'id' | 'createdAt' | 'updatedAt'>) => {
      const venta = await ventasService.create(data);
      return venta;
    },
    onMutate: async (newVenta) => {
      await queryClient.cancelQueries({ queryKey: ['ventas'] });

      const previous = queryClient.getQueryData(['ventas']);

      queryClient.setQueryData(['ventas'], (old: Venta[] = []) => [
        {
          ...newVenta,
          id: `temp-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Venta,
        ...old,
      ]);

      return { previous };
    },
    onError: (_err, _newVenta, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['ventas'], context.previous);
      }
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
      queryClient.invalidateQueries({ queryKey: ['almacen'] });
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      queryClient.invalidateQueries({ queryKey: ['banco'] }); // Todos los bancos
      queryClient.invalidateQueries({ queryKey: ['ingresos'] }); // Ingresos de bancos
    },
  });

  /**
   * Actualizar venta
   */
  const actualizarVentaMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Venta> }) =>
      ventasService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
      queryClient.invalidateQueries({ queryKey: ['banco'] });
    },
  });

  /**
   * Eliminar venta
   */
  const eliminarVentaMutation = useMutation({
    mutationFn: (id: string) => ventasService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
    },
  });

  /**
   * Marcar como pagada
   * Ejecuta distribución a bancos automáticamente
   */
  const marcarPagadaMutation = useMutation({
    mutationFn: async ({
      id,
      cantidad,
      precioVenta,
      costoUnidad,
      aplicaFlete,
      montoFlete,
      cliente,
    }: {
      id: string;
      cantidad: number;
      precioVenta: number;
      costoUnidad: number;
      aplicaFlete: boolean;
      montoFlete?: number;
      cliente: string;
    }) => {
      // Actualizar estatus
      await ventasService.update(id, { estatus: 'PAGADO' });

      // Distribuir a bancos
      await ventasService.distribuirABancos({
        ventaId: id,
        cantidad,
        precioVenta,
        costoUnidad,
        aplicaFlete,
        montoFlete,
        cliente,
      });

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
      queryClient.invalidateQueries({ queryKey: ['banco'] });
      queryClient.invalidateQueries({ queryKey: ['ingresos'] });
    },
  });

  // ========================================================================
  // HELPER FUNCTIONS
  // ========================================================================

  const crearVenta = useCallback(
    (data: Omit<Venta, 'id' | 'createdAt' | 'updatedAt'>) => {
      return crearVentaMutation.mutateAsync(data);
    },
    [crearVentaMutation]
  );

  const actualizarVenta = useCallback(
    (id: string, data: Partial<Venta>) => {
      return actualizarVentaMutation.mutateAsync({ id, data });
    },
    [actualizarVentaMutation]
  );

  const eliminarVenta = useCallback(
    (id: string) => {
      return eliminarVentaMutation.mutateAsync(id);
    },
    [eliminarVentaMutation]
  );

  const marcarComoPagada = useCallback(
    (
      id: string,
      params: {
        cantidad: number;
        precioVenta: number;
        costoUnidad: number;
        aplicaFlete: boolean;
        montoFlete?: number;
        cliente: string;
      }
    ) => {
      return marcarPagadaMutation.mutateAsync({ id, ...params });
    },
    [marcarPagadaMutation]
  );

  // ========================================================================
  // COMPUTED VALUES
  // ========================================================================

  const ventasPagadas = ventas.filter((v) => v.estatus === 'PAGADO');
  const ventasPendientes = ventas.filter((v) => v.estatus === 'PENDIENTE');
  const ventasCanceladas = ventas.filter((v) => v.estatus === 'CANCELADO');

  const totalVentas = ventas.reduce((sum, v) => {
    const total = v.cantidad * v.precioVenta;
    return sum + total;
  }, 0);

  const totalPagadas = ventasPagadas.reduce((sum, v) => {
    const total = v.cantidad * v.precioVenta;
    return sum + total;
  }, 0);

  const totalPendientes = ventasPendientes.reduce((sum, v) => {
    const total = v.cantidad * v.precioVenta;
    return sum + total;
  }, 0);

  return {
    // Data
    ventas,
    ventasPagadas,
    ventasPendientes,
    ventasCanceladas,

    // Computed
    totalVentas,
    totalPagadas,
    totalPendientes,
    totalRegistros: ventas.length,
    pagadasCount: ventasPagadas.length,
    pendientesCount: ventasPendientes.length,

    // Loading states
    cargando: isLoading,
    creando: crearVentaMutation.isPending,
    actualizando: actualizarVentaMutation.isPending,
    eliminando: eliminarVentaMutation.isPending,
    marcandoPagada: marcarPagadaMutation.isPending,

    // Errors
    error,
    errorCrear: crearVentaMutation.error,
    errorActualizar: actualizarVentaMutation.error,

    // Actions
    crearVenta,
    actualizarVenta,
    eliminarVenta,
    marcarComoPagada,
  };
}

/**
 * Hook para una venta específica
 */
export function useVenta(id: string) {
  return useQuery({
    queryKey: ['venta', id],
    queryFn: () => ventasService.getById(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook para ventas por cliente
 */
export function useVentasPorCliente(clienteId: string) {
  const { ventas, cargando } = useVentas();

  const ventasFiltradas = ventas.filter((v) => v.cliente === clienteId);

  const totalComprado = ventasFiltradas.reduce((sum, v) => {
    return sum + v.cantidad * v.precioVenta;
  }, 0);

  return {
    ventas: ventasFiltradas,
    totalComprado,
    totalVentas: ventasFiltradas.length,
    cargando,
  };
}

/**
 * Hook para ventas por producto
 */
export function useVentasPorProducto(productoId: string) {
  const { ventas, cargando } = useVentas();

  const ventasFiltradas = ventas.filter((v) => v.productoId === productoId);

  const cantidadVendida = ventasFiltradas.reduce((sum, v) => sum + v.cantidad, 0);
  const ingresoTotal = ventasFiltradas.reduce((sum, v) => sum + v.cantidad * v.precioVenta, 0);

  return {
    ventas: ventasFiltradas,
    cantidadVendida,
    ingresoTotal,
    totalVentas: ventasFiltradas.length,
    cargando,
  };
}
