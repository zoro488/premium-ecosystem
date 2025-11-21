/**
 * VentasTable - Tabla de Ventas con filtrado, ordenamiento y paginación
 * @module FlowDistributor/components/tables
 */
import type React from 'react';
import { memo, useMemo, useState } from 'react';

import { DollarSign, Download, Edit, Eye, Filter, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { useVentas } from '../../hooks/useVentas';
import type { EstadoVenta, Venta } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface VentasTableProps {
  clienteId?: string;
  onEdit?: (venta: Venta) => void;
  onView?: (venta: Venta) => void;
}

export const VentasTable: React.FC<VentasTableProps> = memo(
  ({ clienteId, onEdit, onView }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [estadoFilter, setEstadoFilter] = useState<EstadoVenta | 'TODOS'>('TODOS');
    const [sortField, setSortField] = useState<keyof Venta>('date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const { ventas, isLoading, deleteVenta } = useVentas();

    // Filtrado y ordenamiento
    const ventasFiltradas = useMemo(() => {
      let filtered = [...ventas];

      // Búsqueda
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (v) =>
            v.numeroVenta.toLowerCase().includes(search) ||
            v.cliente.nombre.toLowerCase().includes(search) ||
            v.producto.toLowerCase().includes(search)
        );
      }

      // Filtro por estado
      if (estadoFilter !== 'TODOS') {
        filtered = filtered.filter((v) => v.estado === estadoFilter);
      }

      // Ordenamiento
      filtered.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });

      return filtered;
    }, [ventas, searchTerm, estadoFilter, sortField, sortDirection]);

    // Paginación
    const totalPages = Math.ceil(ventasFiltradas.length / itemsPerPage);
    const ventasPaginadas = ventasFiltradas.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    // Estadísticas
    const stats = useMemo(() => {
      const total = ventasFiltradas.reduce((sum, v) => sum + v.montoTotal, 0);
      const costo = ventasFiltradas.reduce((sum, v) => sum + v.costoTotal, 0);
      const utilidad = total - costo;
      const margen = total > 0 ? (utilidad / total) * 100 : 0;

      return { total, costo, utilidad, margen };
    }, [ventasFiltradas]);

    const handleSort = (field: keyof Venta) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    };

    const handleDelete = async (id: string) => {
      if (!confirm('¿Estás seguro de eliminar esta venta?')) return;

      try {
        await eliminarVenta.mutateAsync(id);
        toast.success('Venta eliminada correctamente');
      } catch (_error) {
        toast.error('Error al eliminar venta');
      }
    };

    const exportToCSV = () => {
      const headers = [
        'Fecha',
        'Número',
        'Cliente',
        'Producto',
        'Cantidad',
        'Precio Unit.',
        'Total',
        'Estado',
      ];
      const rows = ventasFiltradas.map((v) => [
        formatDate(v.fecha),
        v.numeroVenta,
        v.cliente.nombre,
        v.producto,
        v.cantidad,
        v.precioUnitario,
        v.montoTotal,
        v.estado,
      ]);

      const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ventas_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Exportación completada');
    };

    const getEstadoColor = (estado: EstadoVenta) => {
      switch (estado) {
        case 'PAGADA':
          return 'bg-zinc-800 text-green-800';
        case 'PENDIENTE':
          return 'bg-yellow-100 text-yellow-800';
        case 'CREDITO':
          return 'bg-zinc-800 text-white';
        case 'CANCELADA':
          return 'bg-zinc-800 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-600"></div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ventas Totales</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(stats.total, 'USD')}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilidad</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(stats.utilidad, 'USD')}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Margen</p>
                <p className="text-2xl font-bold text-zinc-800">{stats.margen.toFixed(1)}%</p>
              </div>
              <DollarSign className="h-8 w-8 text-zinc-800" />
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cantidad</p>
                <p className="text-2xl font-bold text-orange-600">{ventasFiltradas.length}</p>
              </div>
              <Filter className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar ventas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value as EstadoVenta | 'TODOS')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="TODOS">Todos los estados</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="PAGADA">Pagada</option>
              <option value="CREDITO">Crédito</option>
              <option value="CANCELADA">Cancelada</option>
            </select>

            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    onClick={() => handleSort('fecha')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Fecha {sortField === 'fecha' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio Unit.
                  </th>
                  <th
                    onClick={() => handleSort('montoTotal')}
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Total {sortField === 'montoTotal' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ventasPaginadas.map((venta) => (
                  <tr key={venta.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(venta.fecha)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {venta.numeroVenta}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {venta.cliente.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {venta.producto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {venta.cantidad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(venta.precioUnitario, 'USD')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                      {formatCurrency(venta.montoTotal, 'USD')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(venta.estado)}`}
                      >
                        {venta.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {onView && (
                          <button
                            onClick={() => onView(venta)}
                            className="text-white hover:text-zinc-100"
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        {onEdit && venta.estado !== 'CANCELADA' && (
                          <button
                            onClick={() => onEdit(venta)}
                            className="text-white hover:text-green-900"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(venta.id!)}
                          className="text-white hover:text-red-900"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
                {Math.min(currentPage * itemsPerPage, ventasFiltradas.length)} de{' '}
                {ventasFiltradas.length} resultados
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Anterior
                </button>
                <span className="px-3 py-1 text-sm">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>

        {ventasPaginadas.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No se encontraron ventas con los criterios seleccionados
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.clienteId === nextProps.clienteId &&
      prevProps.onEdit === nextProps.onEdit &&
      prevProps.onView === nextProps.onView
    );
  }
);

VentasTable.displayName = 'VentasTable';
