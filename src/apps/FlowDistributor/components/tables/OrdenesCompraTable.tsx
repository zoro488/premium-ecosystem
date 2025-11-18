/**
 * Tabla de Órdenes de Compra con sorting, filtering y acciones
 */
import type React from 'react';
import { memo, useMemo, useState } from 'react';

import { formatCurrency, formatDate } from '../../utils/formatters';

interface OrdenCompra {
  id: string;
  fecha: string;
  origen: string;
  cantidad: number;
  costoDistribuidor: number;
  costoTransporte: number;
  costoPorUnidad: number;
  stockActual: number;
  costoTotal: number;
  estado: string;
  moneda?: string;
}

interface OrdenesCompraTableProps {
  ordenes: OrdenCompra[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const OrdenesCompraTable: React.FC<OrdenesCompraTableProps> = memo(({
  ordenes,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const [sortField, setSortField] = useState<keyof OrdenCompra>('fecha');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterEstado, setFilterEstado] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (field: keyof OrdenCompra) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedOrdenes = useMemo(() => {
    let filtered = ordenes;

    // Filtrar por estado
    if (filterEstado !== 'all') {
      filtered = filtered.filter((oc) => oc.estado === filterEstado);
    }

    // Búsqueda por texto
    if (searchTerm) {
      filtered = filtered.filter(
        (oc) =>
          oc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          oc.origen.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? (String(aVal || '')).localeCompare(String(bVal || '')) : (String(bVal || '')).localeCompare(String(aVal || ''));
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    return filtered;
  }, [ordenes, sortField, sortDirection, filterEstado, searchTerm]);

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'en_transito':
        return 'bg-blue-100 text-blue-800';
      case 'recibida':
        return 'bg-green-100 text-green-800';
      case 'pagada':
        return 'bg-purple-100 text-purple-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <input
          type="text"
          placeholder="Buscar por ID o Origen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_transito">En Tránsito</option>
          <option value="recibida">Recibida</option>
          <option value="pagada">Pagada</option>
          <option value="cancelada">Cancelada</option>
        </select>

        <p className="text-sm text-gray-600">
          Mostrando {filteredAndSortedOrdenes.length} de {ordenes.length} órdenes
        </p>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort('id')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('fecha')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Fecha {sortField === 'fecha' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Origen
              </th>
              <th
                onClick={() => handleSort('cantidad')}
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Cantidad {sortField === 'cantidad' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('costoTotal')}
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Costo Total {sortField === 'costoTotal' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('stockActual')}
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Stock {sortField === 'stockActual' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedOrdenes.map((oc) => (
              <tr key={oc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {oc.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(oc.fecha)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{oc.origen}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {oc.cantidad.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                  {formatCurrency(oc.costoTotal, oc.moneda || 'USD')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <span
                    className={`font-semibold ${
                      oc.stockActual === 0
                        ? 'text-red-600'
                        : oc.stockActual < 100
                          ? 'text-yellow-600'
                          : 'text-green-600'
                    }`}
                  >
                    {oc.stockActual}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadgeClass(
                      oc.estado
                    )}`}
                  >
                    {oc.estado.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                  <button
                    onClick={() => onEdit(oc.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`¿Eliminar orden ${oc.id}?`)) {
                        onDelete(oc.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedOrdenes.length === 0 && (
          <div className="text-center py-12 bg-white">
            <p className="text-gray-500">No se encontraron órdenes de compra</p>
          </div>
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.ordenes === nextProps.ordenes &&
         prevProps.onEdit === nextProps.onEdit &&
         prevProps.onDelete === nextProps.onDelete &&
         prevProps.isLoading === nextProps.isLoading;
});

OrdenesCompraTable.displayName = 'OrdenesCompraTable';
