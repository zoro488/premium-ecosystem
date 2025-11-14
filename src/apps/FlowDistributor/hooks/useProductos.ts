/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                   HOOK: useProductos con React Query                       ║
 * ║  Hook personalizado para gestión completa de productos del almacén        ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { almacenService, type Producto } from '../services/almacen.service';

/**
 * Hook principal para productos del almacén
 * Proporciona acceso a todos los productos y operaciones CRUD
 */
export const useProductos = () => {
  const queryClient = useQueryClient();

  // Query principal para obtener todos los productos
  const {
    data: productos = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['productos'],
    queryFn: () => almacenService.getProductos(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  });

  // Mutation para crear producto
  const createMutation = useMutation({
    mutationFn: (data: Omit<Producto, 'id' | 'createdAt'>) =>
      almacenService.crearProducto(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      toast.success('Producto creado exitosamente');
    },
    onError: (error: any) => {
      console.error('Error al crear producto:', error);
      toast.error(error.message || 'Error al crear producto');
    },
  });

  // Mutation para actualizar producto
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Producto> }) =>
      almacenService.actualizarProducto(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      toast.success('Producto actualizado exitosamente');
    },
    onError: (error: any) => {
      console.error('Error al actualizar producto:', error);
      toast.error(error.message || 'Error al actualizar producto');
    },
  });

  return {
    productos,
    isLoading,
    error,
    refetch,
    createProducto: createMutation.mutate,
    updateProducto: updateMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
};

/**
 * Hook para obtener un producto específico por ID
 */
export const useProducto = (id: string | undefined) => {
  return useQuery({
    queryKey: ['productos', id],
    queryFn: () => {
      if (!id) throw new Error('ID de producto requerido');
      return almacenService.getProductoById(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para obtener productos con stock bajo
 */
export const useProductosBajoStock = (umbral: number = 10) => {
  const { productos, isLoading } = useProductos();

  const productosBajoStock = productos.filter(
    (p: Producto) => p.stockActual <= umbral && p.stockActual > 0
  );

  const productosAgotados = productos.filter((p: Producto) => p.stockActual === 0);

  return {
    productosBajoStock,
    productosAgotados,
    totalBajoStock: productosBajoStock.length,
    totalAgotados: productosAgotados.length,
    isLoading,
  };
};

export default useProductos;
