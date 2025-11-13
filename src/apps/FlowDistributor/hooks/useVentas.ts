import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ventasService } from '../services/ventas.service';

export const useVentas = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['ventas'],
    queryFn: () => ventasService.getAll(),
    staleTime: 3 * 60 * 1000,
    retry: 2,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => ventasService.createWithStockUpdate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
      queryClient.invalidateQueries({ queryKey: ['ordenesCompra'] });
      toast.success('Venta registrada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al registrar venta');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => ventasService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
      toast.success('Venta actualizada');
    },
    onError: () => {
      toast.error('Error al actualizar venta');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ventasService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
      toast.success('Venta eliminada');
    },
    onError: () => {
      toast.error('Error al eliminar venta');
    },
  });

  return {
    ventas: data ?? [],
    isLoading,
    error,
    createVenta: createMutation.mutate,
    updateVenta: updateMutation.mutate,
    deleteVenta: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};


export default useVentas;
