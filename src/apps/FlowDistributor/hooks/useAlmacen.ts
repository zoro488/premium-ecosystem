/**
 * FlowDistributor - Custom Hooks para Almacén/Inventario
 * TanStack Query v5 + Real-time sync + Optimistic updates
 * @module FlowDistributor/hooks/useAlmacen
 */
import { useEffect } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Producto } from '../services/almacen.service';
import almacenService from '../services/almacen.service';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const almacenKeys = {
  all: ['almacen'] as const,
  productos: () => [...almacenKeys.all, 'productos'] as const,
  producto: (id: string) => [...almacenKeys.productos(), id] as const,
  movimientos: (productoId?: string) => [...almacenKeys.all, 'movimientos', productoId] as const,
  alertas: () => [...almacenKeys.all, 'alertas'] as const,
  stockBajo: () => [...almacenKeys.productos(), 'stock-bajo'] as const,
  agotados: () => [...almacenKeys.productos(), 'agotados'] as const,
};

// ============================================================================
// PRODUCTOS - QUERIES
// ============================================================================

/**
 * Hook para obtener todos los productos
 */
export function useProductos(soloActivos = false) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...almacenKeys.productos(), soloActivos],
    queryFn: () => almacenService.getProductos(soloActivos),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Real-time sync
  useEffect(() => {
    const unsubscribe = almacenService.onProductosChange((productos) => {
      queryClient.setQueryData([...almacenKeys.productos(), soloActivos], productos);
    });

    return () => unsubscribe();
  }, [queryClient, soloActivos]);

  return query;
}

/**
 * Hook para obtener un producto específico
 */
export function useProducto(productoId: string) {
  return useQuery({
    queryKey: almacenKeys.producto(productoId),
    queryFn: () => almacenService.getProductoById(productoId),
    enabled: !!productoId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para obtener productos con stock bajo
 */
export function useProductosStockBajo() {
  return useQuery({
    queryKey: almacenKeys.stockBajo(),
    queryFn: () => almacenService.getProductosStockBajo(),
    refetchInterval: 60 * 1000, // Actualizar cada minuto
    staleTime: 30 * 1000,
  });
}

/**
 * Hook para obtener productos agotados
 */
export function useProductosAgotados() {
  return useQuery({
    queryKey: almacenKeys.agotados(),
    queryFn: () => almacenService.getProductosAgotados(),
    refetchInterval: 60 * 1000,
    staleTime: 30 * 1000,
  });
}

// ============================================================================
// PRODUCTOS - MUTATIONS
// ============================================================================

/**
 * Hook para crear un producto
 */
export function useCrearProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (producto: Omit<Producto, 'id' | 'createdAt' | 'updatedAt'>) =>
      almacenService.crearProducto(producto),
    onMutate: async (nuevoProducto) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: almacenKeys.productos() });
      const previousData = queryClient.getQueryData(almacenKeys.productos());

      queryClient.setQueryData(almacenKeys.productos(), (old: Producto[] = []) => [
        ...old,
        { ...nuevoProducto, id: 'temp-' + Date.now() } as Producto,
      ]);

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(almacenKeys.productos(), context.previousData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: almacenKeys.productos() });
    },
  });
}

/**
 * Hook para actualizar un producto
 */
export function useActualizarProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Producto> }) =>
      almacenService.actualizarProducto(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: almacenKeys.producto(id) });
      const previousData = queryClient.getQueryData(almacenKeys.producto(id));

      queryClient.setQueryData(almacenKeys.producto(id), (old: Producto | null) =>
        old ? { ...old, ...data } : null
      );

      return { previousData };
    },
    onError: (_error, { id }, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(almacenKeys.producto(id), context.previousData);
      }
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: almacenKeys.producto(id) });
      queryClient.invalidateQueries({ queryKey: almacenKeys.productos() });
    },
  });
}

/**
 * Hook para eliminar un producto
 */
export function useEliminarProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productoId: string) => almacenService.eliminarProducto(productoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: almacenKeys.productos() });
    },
  });
}

// ============================================================================
// MOVIMIENTOS - QUERIES
// ============================================================================

/**
 * Hook para obtener movimientos de inventario
 */
export function useMovimientos(productoId?: string, limite = 100) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: almacenKeys.movimientos(productoId),
    queryFn: () => almacenService.getMovimientos(productoId, limite),
    staleTime: 2 * 60 * 1000,
  });

  // Real-time sync si hay productoId
  useEffect(() => {
    if (!productoId) return;

    const unsubscribe = almacenService.onMovimientosChange(productoId, (movimientos) => {
      queryClient.setQueryData(almacenKeys.movimientos(productoId), movimientos);
    });

    return () => unsubscribe();
  }, [queryClient, productoId]);

  return query;
}

// ============================================================================
// MOVIMIENTOS - MUTATIONS
// ============================================================================

/**
 * Hook para registrar entrada de inventario
 */
export function useRegistrarEntrada() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productoId,
      cantidad,
      costoUnitario,
      ordenCompraId,
      concepto,
    }: {
      productoId: string;
      cantidad: number;
      costoUnitario: number;
      ordenCompraId?: string;
      concepto?: string;
    }) =>
      almacenService.registrarEntrada(productoId, cantidad, costoUnitario, ordenCompraId, concepto),
    onSuccess: (_data, { productoId }) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: almacenKeys.producto(productoId) });
      queryClient.invalidateQueries({ queryKey: almacenKeys.productos() });
      queryClient.invalidateQueries({ queryKey: almacenKeys.movimientos(productoId) });
      queryClient.invalidateQueries({ queryKey: almacenKeys.stockBajo() });
      queryClient.invalidateQueries({ queryKey: almacenKeys.agotados() });
    },
  });
}

/**
 * Hook para registrar salida de inventario
 */
export function useRegistrarSalida() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productoId,
      cantidad,
      ventaId,
      concepto,
    }: {
      productoId: string;
      cantidad: number;
      ventaId?: string;
      concepto?: string;
    }) => almacenService.registrarSalida(productoId, cantidad, ventaId, concepto),
    onSuccess: (_data, { productoId }) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: almacenKeys.producto(productoId) });
      queryClient.invalidateQueries({ queryKey: almacenKeys.productos() });
      queryClient.invalidateQueries({ queryKey: almacenKeys.movimientos(productoId) });
      queryClient.invalidateQueries({ queryKey: almacenKeys.alertas() });
      queryClient.invalidateQueries({ queryKey: almacenKeys.stockBajo() });
      queryClient.invalidateQueries({ queryKey: almacenKeys.agotados() });
    },
  });
}

/**
 * Hook para registrar ajuste de inventario
 */
export function useRegistrarAjuste() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productoId,
      nuevoStock,
      concepto,
      responsable,
    }: {
      productoId: string;
      nuevoStock: number;
      concepto: string;
      responsable?: string;
    }) => almacenService.registrarAjuste(productoId, nuevoStock, concepto, responsable),
    onSuccess: (_data, { productoId }) => {
      queryClient.invalidateQueries({ queryKey: almacenKeys.producto(productoId) });
      queryClient.invalidateQueries({ queryKey: almacenKeys.productos() });
      queryClient.invalidateQueries({ queryKey: almacenKeys.movimientos(productoId) });
      queryClient.invalidateQueries({ queryKey: almacenKeys.stockBajo() });
      queryClient.invalidateQueries({ queryKey: almacenKeys.agotados() });
    },
  });
}

// ============================================================================
// ALERTAS
// ============================================================================

/**
 * Hook para obtener alertas de inventario
 */
export function useAlertas(soloNoLeidas = true) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...almacenKeys.alertas(), soloNoLeidas],
    queryFn: () => almacenService.getAlertas(soloNoLeidas),
    refetchInterval: 30 * 1000, // Actualizar cada 30 segundos
    staleTime: 15 * 1000,
  });

  // Real-time sync
  useEffect(() => {
    const unsubscribe = almacenService.onAlertasChange((alertas) => {
      queryClient.setQueryData([...almacenKeys.alertas(), soloNoLeidas], alertas);
    });

    return () => unsubscribe();
  }, [queryClient, soloNoLeidas]);

  return query;
}

/**
 * Hook para marcar alerta como leída
 */
export function useMarcarAlertaLeida() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alertaId: string) => almacenService.marcarAlertaLeida(alertaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: almacenKeys.alertas() });
    },
  });
}

// ============================================================================
// HOOK COMBINADO (ALL-IN-ONE)
// ============================================================================

/**
 * Hook combinado que proporciona todo lo necesario para gestionar un producto
 */
export function useProductoCompleto(productoId: string) {
  const producto = useProducto(productoId);
  const movimientos = useMovimientos(productoId);
  const registrarEntrada = useRegistrarEntrada();
  const registrarSalida = useRegistrarSalida();
  const registrarAjuste = useRegistrarAjuste();

  return {
    // Queries
    producto: producto.data,
    movimientos: movimientos.data ?? [],
    isLoading: producto.isLoading || movimientos.isLoading,
    error: producto.error || movimientos.error,

    // Mutations
    registrarEntrada,
    registrarSalida,
    registrarAjuste,

    // Utility
    refetch: () => {
      producto.refetch();
      movimientos.refetch();
    },
  };
}

/**
 * Hook combinado para panel de almacén general
 */
export function useAlmacenCompleto() {
  const productos = useProductos(true);
  const stockBajo = useProductosStockBajo();
  const agotados = useProductosAgotados();
  const alertas = useAlertas(true);

  return {
    // Queries
    productos: productos.data ?? [],
    stockBajo: stockBajo.data ?? [],
    agotados: agotados.data ?? [],
    alertas: alertas.data ?? [],
    isLoading:
      productos.isLoading || stockBajo.isLoading || agotados.isLoading || alertas.isLoading,

    // Mutations
    crearProducto: useCrearProducto(),
    actualizarProducto: useActualizarProducto(),
    eliminarProducto: useEliminarProducto(),
    marcarAlertaLeida: useMarcarAlertaLeida(),

    // Utility
    refetch: () => {
      productos.refetch();
      stockBajo.refetch();
      agotados.refetch();
      alertas.refetch();
    },
  };
}

export default {
  useProductos,
  useProducto,
  useProductosStockBajo,
  useProductosAgotados,
  useCrearProducto,
  useActualizarProducto,
  useEliminarProducto,
  useMovimientos,
  useRegistrarEntrada,
  useRegistrarSalida,
  useRegistrarAjuste,
  useAlertas,
  useMarcarAlertaLeida,
  useProductoCompleto,
  useAlmacenCompleto,
};
