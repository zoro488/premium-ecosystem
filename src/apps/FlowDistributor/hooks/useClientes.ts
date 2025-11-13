import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { clientesService } from '../services/clientes.service';

export const useClientes = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => clientesService.getAll(),
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => clientesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => clientesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clientesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });

  const bloquearMutation = useMutation({
    mutationFn: ({ id, motivo }: { id: string; motivo: string }) =>
      clientesService.bloquearCliente(id, motivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });

  const desbloquearMutation = useMutation({
    mutationFn: (id: string) => clientesService.desbloquearCliente(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });

  return {
    clientes: data ?? [],
    isLoading,
    error,
    createCliente: createMutation.mutate,
    updateCliente: updateMutation.mutate,
    deleteCliente: deleteMutation.mutate,
    bloquearCliente: bloquearMutation.mutate,
    desbloquearCliente: desbloquearMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};


export default useClientes;
