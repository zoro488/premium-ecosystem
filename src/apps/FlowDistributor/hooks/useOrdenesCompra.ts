/**
 * FlowDistributor - Hook personalizado para Órdenes de Compra
 * @module FlowDistributor/hooks/useOrdenesCompra
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ordenesCompraService } from '../services/ordenesCompra.service';
import type { CreateDTO, OCEstado, OrdenCompra, UpdateDTO } from '../types';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const ORDENES_COMPRA_KEYS = {
  all: ['ordenesCompra'] as const,
  lists: () => [...ORDENES_COMPRA_KEYS.all, 'list'] as const,
  list: (filters: any) => [...ORDENES_COMPRA_KEYS.lists(), { filters }] as const,
  details: () => [...ORDENES_COMPRA_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ORDENES_COMPRA_KEYS.details(), id] as const,
  stats: () => [...ORDENES_COMPRA_KEYS.all, 'stats'] as const,
  alerts: () => [...ORDENES_COMPRA_KEYS.all, 'alerts'] as const,
};

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

interface UseOrdenesCompraOptions {
  filters?: {
    estado?: OCEstado;
    distribuidorId?: string;
    origen?: string;
    stockBajo?: boolean;
    fechaDesde?: Date;
    fechaHasta?: Date;
  };
  page?: number;
  pageSize?: number;
  enabled?: boolean;
}

/**
 * Hook principal para gestionar órdenes de compra
 */
export const useOrdenesCompra = (options: UseOrdenesCompraOptions = {}) => {
  const { filters, page = 1, pageSize = 50, enabled = true } = options;

  const queryClient = useQueryClient();

  // ============================================================================
  // QUERIES
  // ============================================================================

  /**
   * Query para obtener lista de órdenes de compra
   */
  const {
    data: paginatedData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ORDENES_COMPRA_KEYS.list({ filters, page, pageSize }),
    queryFn: () => ordenesCompraService.getAll(filters, page, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (antes era cacheTime)
    enabled,
  });

  /**
   * Query para estadísticas
   */
  const { data: estadisticas, isLoading: isLoadingEstadisticas } = useQuery({
    queryKey: ORDENES_COMPRA_KEYS.stats(),
    queryFn: ordenesCompraService.getEstadisticas,
    staleTime: 2 * 60 * 1000, // 2 minutos
    enabled,
  });

  /**
   * Query para alertas de stock bajo
   */
  const { data: alertasStockBajo, isLoading: isLoadingAlertas } = useQuery({
    queryKey: ORDENES_COMPRA_KEYS.alerts(),
    queryFn: ordenesCompraService.getAlertasStockBajo,
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled,
  });

  // ============================================================================
  // MUTATIONS
  // ============================================================================

  /**
   * Mutación para crear orden de compra
   */
  const createMutation = useMutation({
    mutationFn: (data: CreateDTO<OrdenCompra>) => ordenesCompraService.create(data),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ORDENES_COMPRA_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ORDENES_COMPRA_KEYS.stats() });

      toast.success('Orden de compra creada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al crear orden: ${error.message}`);
    },
  });

  /**
   * Mutación para actualizar orden de compra
   */
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDTO<OrdenCompra> }) =>
      ordenesCompraService.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey: ORDENES_COMPRA_KEYS.detail(id) });

      // Snapshot del valor anterior (optimistic update)
      const previousOC = queryClient.getQueryData(ORDENES_COMPRA_KEYS.detail(id));

      // Actualizar optimísticamente
      if (previousOC) {
        queryClient.setQueryData(ORDENES_COMPRA_KEYS.detail(id), {
          ...previousOC,
          ...data,
        });
      }

      return { previousOC };
    },
    onError: (error: Error, variables, context) => {
      // Revertir en caso de error
      if (context?.previousOC) {
        queryClient.setQueryData(ORDENES_COMPRA_KEYS.detail(variables.id), context.previousOC);
      }
      toast.error(`Error al actualizar orden: ${error.message}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDENES_COMPRA_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ORDENES_COMPRA_KEYS.stats() });

      toast.success('Orden de compra actualizada');
    },
  });

  /**
   * Mutación para eliminar orden de compra
   */
  const deleteMutation = useMutation({
    mutationFn: (id: string) => ordenesCompraService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDENES_COMPRA_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ORDENES_COMPRA_KEYS.stats() });

      toast.success('Orden de compra eliminada');
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar orden: ${error.message}`);
    },
  });

  /**
   * Mutación para registrar recepción
   */
  const registrarRecepcionMutation = useMutation({
    mutationFn: ({
      id,
      cantidadRecibida,
      notasRecepcion,
    }: {
      id: string;
      cantidadRecibida: number;
      notasRecepcion?: string;
    }) => ordenesCompraService.registrarRecepcion(id, cantidadRecibida, notasRecepcion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDENES_COMPRA_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ORDENES_COMPRA_KEYS.stats() });
      queryClient.invalidateQueries({ queryKey: ORDENES_COMPRA_KEYS.alerts() });

      toast.success('Recepción registrada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al registrar recepción: ${error.message}`);
    },
  });

  /**
   * Mutación para registrar pago
   */
  const registrarPagoMutation = useMutation({
    mutationFn: ({ id, montoPago }: { id: string; montoPago: number }) =>
      ordenesCompraService.registrarPago(id, montoPago),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDENES_COMPRA_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ORDENES_COMPRA_KEYS.stats() });

      toast.success('Pago registrado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al registrar pago: ${error.message}`);
    },
  });

  /**
   * Mutación para actualizar stock
   */
  const actualizarStockMutation = useMutation({
    mutationFn: ({ id, cantidadVendida }: { id: string; cantidadVendida: number }) =>
      ordenesCompraService.actualizarStock(id, cantidadVendida),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDENES_COMPRA_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ORDENES_COMPRA_KEYS.alerts() });

      toast.success('Stock actualizado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar stock: ${error.message}`);
    },
  });

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Data
    ordenes: paginatedData?.data ?? [],
    paginacion: paginatedData
      ? {
          total: paginatedData.total,
          page: paginatedData.page,
          pageSize: paginatedData.pageSize,
          totalPages: paginatedData.totalPages,
          hasNext: paginatedData.hasNext,
          hasPrev: paginatedData.hasPrev,
        }
      : null,
    estadisticas,
    alertasStockBajo: alertasStockBajo ?? [],

    // Loading states
    isLoading,
    isLoadingEstadisticas,
    isLoadingAlertas,

    // Error
    error,

    // Refetch
    refetch,

    // Mutations
    createOrden: createMutation.mutate,
    updateOrden: updateMutation.mutate,
    deleteOrden: deleteMutation.mutate,
    registrarRecepcion: registrarRecepcionMutation.mutate,
    registrarPago: registrarPagoMutation.mutate,
    actualizarStock: actualizarStockMutation.mutate,

    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isRegistrandoRecepcion: registrarRecepcionMutation.isPending,
    isRegistrandoPago: registrarPagoMutation.isPending,
    isActualizandoStock: actualizarStockMutation.isPending,

    // Mutation async
    createOrdenAsync: createMutation.mutateAsync,
    updateOrdenAsync: updateMutation.mutateAsync,
    deleteOrdenAsync: deleteMutation.mutateAsync,
    registrarRecepcionAsync: registrarRecepcionMutation.mutateAsync,
    registrarPagoAsync: registrarPagoMutation.mutateAsync,
    actualizarStockAsync: actualizarStockMutation.mutateAsync,
  };
};

// ============================================================================
// HOOK PARA UNA ORDEN ESPECÍFICA
// ============================================================================

/**
 * Hook para obtener una orden de compra específica
 */
export const useOrdenCompra = (id: string, enabled = true) => {
  const _queryClient = useQueryClient();

  const {
    data: orden,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ORDENES_COMPRA_KEYS.detail(id),
    queryFn: () => ordenesCompraService.getById(id),
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!id,
  });

  return {
    orden,
    isLoading,
    error,
    refetch,
  };
};

// ============================================================================
// HOOK PARA BUSCAR POR NÚMERO
// ============================================================================

/**
 * Hook para buscar orden de compra por número
 */
export const useOrdenCompraPorNumero = (numeroOC: string, enabled = true) => {
  const {
    data: orden,
    isLoading,
    error,
  } = useQuery({
    queryKey: [...ORDENES_COMPRA_KEYS.all, 'numero', numeroOC],
    queryFn: () => ordenesCompraService.getByNumero(numeroOC),
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!numeroOC,
  });

  return {
    orden,
    isLoading,
    error,
  };
};

export default useOrdenesCompra;
