/**
 * FlowDistributor - Custom Hook para Distribuidores
 * @module FlowDistributor/hooks/useDistribuidores
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import distribuidoresService, {
  type Distribuidor,
  type DistribuidorEstado,
  type PagoDistribuidor,
} from '../services/distribuidores.service';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const DISTRIBUIDORES_KEYS = {
  all: ['distribuidores'] as const,
  byEstado: (estado: DistribuidorEstado) => ['distribuidores', 'estado', estado] as const,
  detail: (id: string) => ['distribuidores', id] as const,
  pagos: (id: string) => ['distribuidores', id, 'pagos'] as const,
  conDeuda: ['distribuidores', 'con-deuda'] as const,
  excedidos: ['distribuidores', 'excedidos'] as const,
};

// ============================================================================
// HOOKS DE CONSULTA
// ============================================================================

export function useDistribuidores(estado?: DistribuidorEstado) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: estado ? DISTRIBUIDORES_KEYS.byEstado(estado) : DISTRIBUIDORES_KEYS.all,
    queryFn: () => distribuidoresService.getAll(estado),
    staleTime: 30 * 1000,
  });

  // Real-time subscription
  useEffect(() => {
    const unsubscribe = distribuidoresService.onDistribuidoresChange((distribuidores) => {
      queryClient.setQueryData(DISTRIBUIDORES_KEYS.all, distribuidores);
      if (estado) {
        const filtrados = distribuidores.filter((d) => d.estadoDistribuidor === estado);
        queryClient.setQueryData(DISTRIBUIDORES_KEYS.byEstado(estado), filtrados);
      }
    });

    return () => unsubscribe();
  }, [queryClient, estado]);

  return query;
}

export function useDistribuidor(distribuidorId: string) {
  return useQuery({
    queryKey: DISTRIBUIDORES_KEYS.detail(distribuidorId),
    queryFn: () => distribuidoresService.getById(distribuidorId),
    staleTime: 30 * 1000,
    enabled: !!distribuidorId,
  });
}

export function usePagosDistribuidor(distribuidorId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: DISTRIBUIDORES_KEYS.pagos(distribuidorId),
    queryFn: () => distribuidoresService.getPagos(distribuidorId),
    staleTime: 10 * 1000,
    enabled: !!distribuidorId,
  });

  // Real-time subscription
  useEffect(() => {
    if (!distribuidorId) return;

    const unsubscribe = distribuidoresService.onPagosChange(distribuidorId, (pagos) => {
      queryClient.setQueryData(DISTRIBUIDORES_KEYS.pagos(distribuidorId), pagos);
    });

    return () => unsubscribe();
  }, [distribuidorId, queryClient]);

  return query;
}

export function useDistribuidoresConDeuda() {
  return useQuery({
    queryKey: DISTRIBUIDORES_KEYS.conDeuda,
    queryFn: () => distribuidoresService.getConDeuda(),
    staleTime: 60 * 1000,
  });
}

export function useDistribuidoresExcedidos() {
  return useQuery({
    queryKey: DISTRIBUIDORES_KEYS.excedidos,
    queryFn: () => distribuidoresService.getExcedidosCredito(),
    staleTime: 60 * 1000,
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

export function useCrearDistribuidor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (distribuidor: Omit<Distribuidor, 'id' | 'createdAt' | 'updatedAt'>) =>
      distribuidoresService.crear(distribuidor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISTRIBUIDORES_KEYS.all });
    },
  });
}

export function useActualizarDistribuidor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Distribuidor, 'id' | 'createdAt' | 'updatedAt'>>;
    }) => distribuidoresService.actualizar(id, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: DISTRIBUIDORES_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: DISTRIBUIDORES_KEYS.all });
    },
  });
}

export function useEliminarDistribuidor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => distribuidoresService.eliminar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISTRIBUIDORES_KEYS.all });
    },
  });
}

export function useCrearDistribuidorDesdeOC() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ordenCompraId,
      datosDistribuidor,
      montoOrden,
    }: {
      ordenCompraId: string;
      datosDistribuidor: {
        nombre: string;
        empresa?: string;
        email?: string;
        telefono?: string;
        rfc?: string;
        direccion?: string;
        limiteCredito?: number;
        diasCredito?: number;
      };
      montoOrden: number;
    }) => distribuidoresService.crearDesdeOrdenCompra(ordenCompraId, datosDistribuidor, montoOrden),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISTRIBUIDORES_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['ordenesCompra'] });
    },
  });
}

export function useRegistrarPago() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pago: Omit<PagoDistribuidor, 'id' | 'createdAt' | 'updatedAt'>) =>
      distribuidoresService.registrarPago(pago),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: DISTRIBUIDORES_KEYS.detail(variables.distribuidorId),
      });
      queryClient.invalidateQueries({
        queryKey: DISTRIBUIDORES_KEYS.pagos(variables.distribuidorId),
      });
      queryClient.invalidateQueries({ queryKey: DISTRIBUIDORES_KEYS.all });
      queryClient.invalidateQueries({ queryKey: DISTRIBUIDORES_KEYS.conDeuda });
      queryClient.invalidateQueries({ queryKey: DISTRIBUIDORES_KEYS.excedidos });

      // Si tiene bancoId, invalidar también el banco
      if (variables.bancoId) {
        queryClient.invalidateQueries({ queryKey: ['bancos', variables.bancoId] });
        queryClient.invalidateQueries({ queryKey: ['bancos', variables.bancoId, 'ingresos'] });
      }
    },
  });
}

// ============================================================================
// HOOK COMBINADO
// ============================================================================

export function useDistribuidorCompleto(distribuidorId: string) {
  const distribuidor = useDistribuidor(distribuidorId);
  const pagos = usePagosDistribuidor(distribuidorId);

  return {
    distribuidor: distribuidor.data,
    pagos: pagos.data || [],
    isLoading: distribuidor.isLoading || pagos.isLoading,
    isError: distribuidor.isError || pagos.isError,
    refetch: () => {
      distribuidor.refetch();
      pagos.refetch();
    },
  };
}
