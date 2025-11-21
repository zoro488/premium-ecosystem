/**
 * 🏦 useBancos Hook - TanStack Query para los 7 Bancos
 * Hook reutilizable para todos los paneles de bancos con real-time y optimistic updates
 * Integrado con bancos.service.ts
 */
import { useCallback } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import bancosService, {
  type BancoId,
  type Corte,
  type Gasto,
  type Ingreso,
  type Transferencia,
} from '../services/bancos.service';

/**
 * Hook principal para un banco específico
 * @param bancoId - ID del banco ('boveda-monte', 'boveda-usa', 'azteca', etc.)
 */
export function useBanco(bancoId: BancoId) {
  const queryClient = useQueryClient();

  // ========================================================================
  // QUERIES - Obtener datos
  // ========================================================================

  // Obtener datos del banco (capital actual)
  const {
    data: banco,
    isLoading: cargandoBanco,
    error: errorBanco,
  } = useQuery({
    queryKey: ['banco', bancoId],
    queryFn: () => bancosService.obtenerBanco(bancoId),
    staleTime: 30 * 1000, // 30 segundos
    refetchInterval: 60 * 1000, // Refetch cada 60 segundos
    refetchOnWindowFocus: true,
  });

  // Obtener ingresos
  const {
    data: ingresos = [],
    isLoading: cargandoIngresos,
    error: errorIngresos,
  } = useQuery({
    queryKey: ['ingresos', bancoId],
    queryFn: () => bancosService.obtenerIngresos(bancoId),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });

  // Obtener gastos
  const {
    data: gastos = [],
    isLoading: cargandoGastos,
    error: errorGastos,
  } = useQuery({
    queryKey: ['gastos', bancoId],
    queryFn: () => bancosService.obtenerGastos(bancoId),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });

  // Obtener cortes
  const {
    data: cortes = [],
    isLoading: cargandoCortes,
    error: errorCortes,
  } = useQuery({
    queryKey: ['cortes', bancoId],
    queryFn: () => bancosService.obtenerCortes(bancoId),
    staleTime: 60 * 1000,
  });

  // Obtener transferencias
  const {
    data: transferencias = [],
    isLoading: cargandoTransferencias,
    error: errorTransferencias,
  } = useQuery({
    queryKey: ['transferencias', bancoId],
    queryFn: () => bancosService.obtenerTransferencias(bancoId),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });

  // ========================================================================
  // MUTATIONS - Modificar datos
  // ========================================================================

  // Crear ingreso
  const crearIngresoMutation = useMutation({
    mutationFn: (data: Omit<Ingreso, 'id' | 'createdAt' | 'updatedAt'>) =>
      bancosService.crearIngreso(data),
    onMutate: async (newIngreso) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['ingresos', bancoId] });
      await queryClient.cancelQueries({ queryKey: ['banco', bancoId] });

      // Snapshot previous values
      const previousIngresos = queryClient.getQueryData(['ingresos', bancoId]);
      const previousBanco = queryClient.getQueryData(['banco', bancoId]);

      // Optimistically update
      queryClient.setQueryData(['ingresos', bancoId], (old: Ingreso[] = []) => [
        {
          ...newIngreso,
          id: `temp-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ...old,
      ]);

      return { previousIngresos, previousBanco };
    },
    onError: (_err, _newIngreso, context) => {
      // Rollback on error
      if (context?.previousIngresos) {
        queryClient.setQueryData(['ingresos', bancoId], context.previousIngresos);
      }
      if (context?.previousBanco) {
        queryClient.setQueryData(['banco', bancoId], context.previousBanco);
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['ingresos', bancoId] });
      queryClient.invalidateQueries({ queryKey: ['banco', bancoId] });
    },
  });

  // Crear gasto
  const crearGastoMutation = useMutation({
    mutationFn: (data: Omit<Gasto, 'id' | 'createdAt' | 'updatedAt'>) =>
      bancosService.crearGasto(data),
    onMutate: async (newGasto) => {
      await queryClient.cancelQueries({ queryKey: ['gastos', bancoId] });
      await queryClient.cancelQueries({ queryKey: ['banco', bancoId] });

      const previousGastos = queryClient.getQueryData(['gastos', bancoId]);
      const previousBanco = queryClient.getQueryData(['banco', bancoId]);

      queryClient.setQueryData(['gastos', bancoId], (old: Gasto[] = []) => [
        {
          ...newGasto,
          id: `temp-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ...old,
      ]);

      return { previousGastos, previousBanco };
    },
    onError: (_err, _newGasto, context) => {
      if (context?.previousGastos) {
        queryClient.setQueryData(['gastos', bancoId], context.previousGastos);
      }
      if (context?.previousBanco) {
        queryClient.setQueryData(['banco', bancoId], context.previousBanco);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['gastos', bancoId] });
      queryClient.invalidateQueries({ queryKey: ['banco', bancoId] });
    },
  });

  // Crear corte
  const crearCorteMutation = useMutation({
    mutationFn: (data: Omit<Corte, 'id' | 'createdAt' | 'updatedAt'>) =>
      bancosService.crearCorte(data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cortes', bancoId] });
      queryClient.invalidateQueries({ queryKey: ['banco', bancoId] });
    },
  });

  // Crear transferencia
  const crearTransferenciaMutation = useMutation({
    mutationFn: (data: Omit<Transferencia, 'id' | 'createdAt' | 'updatedAt'>) =>
      bancosService.crearTransferencia(data),
    onMutate: async (newTransferencia) => {
      await queryClient.cancelQueries({ queryKey: ['transferencias'] });

      const previousTransferencias = queryClient.getQueryData(['transferencias', bancoId]);

      queryClient.setQueryData(['transferencias', bancoId], (old: Transferencia[] = []) => [
        {
          ...newTransferencia,
          id: `temp-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ...old,
      ]);

      return { previousTransferencias };
    },
    onError: (_err, _newTransferencia, context) => {
      if (context?.previousTransferencias) {
        queryClient.setQueryData(['transferencias', bancoId], context.previousTransferencias);
      }
    },
    onSettled: () => {
      // Invalidar ambos bancos (origen y destino)
      queryClient.invalidateQueries({ queryKey: ['transferencias'] });
      queryClient.invalidateQueries({ queryKey: ['banco'] });
    },
  });

  // Eliminar ingreso
  const eliminarIngresoMutation = useMutation({
    mutationFn: ({ ingresoId, monto }: { ingresoId: string; monto: number }) =>
      bancosService.eliminarIngreso(ingresoId, bancoId, monto),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['ingresos', bancoId] });
      queryClient.invalidateQueries({ queryKey: ['banco', bancoId] });
    },
  });

  // Eliminar gasto
  const eliminarGastoMutation = useMutation({
    mutationFn: ({ gastoId, monto }: { gastoId: string; monto: number }) =>
      bancosService.eliminarGasto(gastoId, bancoId, monto),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['gastos', bancoId] });
      queryClient.invalidateQueries({ queryKey: ['banco', bancoId] });
    },
  });

  // ========================================================================
  // HELPER FUNCTIONS
  // ========================================================================

  const crearIngreso = useCallback(
    (data: Omit<Ingreso, 'id' | 'createdAt' | 'updatedAt'>) => {
      return crearIngresoMutation.mutateAsync(data);
    },
    [crearIngresoMutation]
  );

  const crearGasto = useCallback(
    (data: Omit<Gasto, 'id' | 'createdAt' | 'updatedAt'>) => {
      return crearGastoMutation.mutateAsync(data);
    },
    [crearGastoMutation]
  );

  const crearCorte = useCallback(
    (data: Omit<Corte, 'id' | 'createdAt' | 'updatedAt'>) => {
      return crearCorteMutation.mutateAsync(data);
    },
    [crearCorteMutation]
  );

  const crearTransferencia = useCallback(
    (data: Omit<Transferencia, 'id' | 'createdAt' | 'updatedAt'>) => {
      return crearTransferenciaMutation.mutateAsync(data);
    },
    [crearTransferenciaMutation]
  );

  const eliminarIngreso = useCallback(
    (ingresoId: string, monto: number) => {
      return eliminarIngresoMutation.mutateAsync({ ingresoId, monto });
    },
    [eliminarIngresoMutation]
  );

  const eliminarGasto = useCallback(
    (gastoId: string, monto: number) => {
      return eliminarGastoMutation.mutateAsync({ gastoId, monto });
    },
    [eliminarGastoMutation]
  );

  // ========================================================================
  // COMPUTED VALUES
  // ========================================================================

  const totalIngresos = ingresos.reduce((sum, ing) => sum + ing.monto, 0);
  const totalGastos = gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
  const balance = totalIngresos - totalGastos;

  const cargando =
    cargandoBanco || cargandoIngresos || cargandoGastos || cargandoCortes || cargandoTransferencias;
  const error = errorBanco || errorIngresos || errorGastos || errorCortes || errorTransferencias;

  return {
    // Data
    banco,
    ingresos,
    gastos,
    cortes,
    transferencias,

    // Computed
    capitalActual: banco?.capital || 0,
    totalIngresos,
    totalGastos,
    balance,

    // Loading states
    cargando,
    cargandoBanco,
    cargandoIngresos,
    cargandoGastos,
    cargandoCortes,
    cargandoTransferencias,

    // Errors
    error,
    errorBanco,
    errorIngresos,
    errorGastos,
    errorCortes,
    errorTransferencias,

    // Mutations
    crearIngreso,
    crearGasto,
    crearCorte,
    crearTransferencia,
    eliminarIngreso,
    eliminarGasto,

    // Mutation states
    creandoIngreso: crearIngresoMutation.isPending,
    creandoGasto: crearGastoMutation.isPending,
    creandoCorte: crearCorteMutation.isPending,
    creandoTransferencia: crearTransferenciaMutation.isPending,
  };
}

/**
 * Hook para obtener todos los bancos (útil para dashboard)
 */
export function useTodosBancos() {
  const bancosIds: BancoId[] = [
    'boveda-monte',
    'boveda-usa',
    'azteca',
    'utilidades',
    'fletes',
    'leftie',
    'profit',
  ];

  const results = useQuery({
    queryKey: ['todos-bancos'],
    queryFn: async () => {
      const bancos = await Promise.all(bancosIds.map((id) => bancosService.obtenerBanco(id)));
      return bancosIds.map((id, index) => ({
        id,
        ...bancos[index],
      }));
    },
    staleTime: 60 * 1000,
    refetchInterval: 120 * 1000,
  });

  const capitalTotal = results.data?.reduce((sum, banco) => sum + (banco.capital || 0), 0) || 0;

  return {
    bancos: results.data || [],
    capitalTotal,
    cargando: results.isLoading,
    error: results.error,
  };
}

/**
 * Hook combinado para un banco (todo en uno)
 */
export function useBancoCompleto(bancoId: BancoId) {
  const banco = useBanco(bancoId);

  return {
    ...banco,
    datosCompletos: {
      banco: banco.banco,
      ingresos: banco.ingresos,
      gastos: banco.gastos,
      cortes: banco.cortes,
      transferencias: banco.transferencias,
    },
    resumen: {
      capital: banco.capitalActual,
      ingresos: banco.totalIngresos,
      gastos: banco.totalGastos,
      balance: banco.balance,
    },
  };
}

// Alias para compatibilidad con imports antiguos
export const useBancos = useTodosBancos;
