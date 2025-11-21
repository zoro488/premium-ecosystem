/**
 * ClientesTable - Tabla de Clientes con gestión de crédito
 * @module FlowDistributor/components/tables
 */
import type React from 'react';
import { memo, useMemo, useState } from 'react';

import { AlertCircle, Edit, Eye, Search, UserCheck, UserX } from 'lucide-react';
import { toast } from 'sonner';

import { useClientes } from '../../hooks/useClientes';
import type { Cliente } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ClientesTableProps {
  onEdit?: (cliente: Cliente) => void;
  onView?: (cliente: Cliente) => void;
}

export const ClientesTable: React.FC<ClientesTableProps> = memo(
  ({ onEdit, onView }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'TODOS' | 'ACTIVOS' | 'BLOQUEADOS'>('TODOS');

    const { clientes, isLoading, bloquearCliente, desbloquearCliente } = useClientes();

    const clientesFiltrados = useMemo(() => {
      let filtered = [...clientes];

      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.nombre.toLowerCase().includes(search) ||
            c.rfc?.toLowerCase().includes(search) ||
            c.email?.toLowerCase().includes(search)
        );
      }

      if (statusFilter === 'ACTIVOS') {
        filtered = filtered.filter((c) => !c.bloqueado);
      } else if (statusFilter === 'BLOQUEADOS') {
        filtered = filtered.filter((c) => c.bloqueado);
      }

      return filtered;
    }, [searchTerm, statusFilter]);

    const stats = useMemo(() => {
      const total = clientes.length;
      const activos = clientes.filter((c) => !c.bloqueado).length;
      const bloqueados = clientes.filter((c) => c.bloqueado).length;
      const creditoTotal = clientes.reduce((sum, c) => sum + (c.creditoAutorizado || 0), 0);
      const deudaTotal = clientes.reduce(
        (sum, c) => sum + (c.creditoAutorizado || 0) - (c.creditoDisponible || 0),
        0
      );

      return { total, activos, bloqueados, creditoTotal, deudaTotal };
    }, []);

    const handleToggleBloqueo = async (cliente: Cliente) => {
      try {
        if (cliente.bloqueado) {
          await desbloquearCliente.mutateAsync(cliente.id!);
          toast.success(`Cliente ${cliente.nombre} desbloqueado`);
        } else {
          const motivo = prompt('Motivo del bloqueo:');
          if (!motivo) return;
          await bloquearCliente.mutateAsync({ id: cliente.id!, motivo });
          toast.success(`Cliente ${cliente.nombre} bloqueado`);
        }
      } catch (_error) {
        toast.error('Error al cambiar estado del cliente');
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-zinc-900 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Clientes</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4">
            <p className="text-sm text-gray-600">Activos</p>
            <p className="text-2xl font-bold text-white">{stats.activos}</p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4">
            <p className="text-sm text-gray-600">Bloqueados</p>
            <p className="text-2xl font-bold text-white">{stats.bloqueados}</p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4">
            <p className="text-sm text-gray-600">Crédito Total</p>
            <p className="text-2xl font-bold text-zinc-800">
              {formatCurrency(stats.creditoTotal, 'USD')}
            </p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4">
            <p className="text-sm text-gray-600">Deuda Total</p>
            <p className="text-2xl font-bold text-orange-600">
              {formatCurrency(stats.deudaTotal, 'USD')}
            </p>
          </div>
        </div>

        {/* Controles */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            title="Filtrar por estado"
          >
            <option value="TODOS">Todos</option>
            <option value="ACTIVOS">Activos</option>
            <option value="BLOQUEADOS">Bloqueados</option>
          </select>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    RFC
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Crédito Autorizado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Crédito Disponible
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientesFiltrados.map((cliente) => {
                  const deuda = (cliente.creditoAutorizado || 0) - (cliente.creditoDisponible || 0);
                  const porcentajeUso =
                    cliente.creditoAutorizado > 0 ? (deuda / cliente.creditoAutorizado) * 100 : 0;

                  return (
                    <tr key={cliente.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {cliente.nombre}
                            </div>
                            {cliente.empresa && (
                              <div className="text-xs text-gray-500">{cliente.empresa}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cliente.rfc || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{cliente.telefono || '-'}</div>
                        <div className="text-xs text-gray-500">{cliente.email || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatCurrency(cliente.creditoAutorizado || 0, 'USD')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(cliente.creditoDisponible || 0, 'USD')}
                        </div>
                        {cliente.creditoAutorizado > 0 && (
                          <div className="text-xs text-gray-500">
                            Deuda: {formatCurrency(deuda, 'USD')} ({porcentajeUso.toFixed(0)}%)
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {cliente.bloqueado ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-800 text-red-800">
                            <UserX className="h-3 w-3 mr-1" />
                            Bloqueado
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-800 text-green-800">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Activo
                          </span>
                        )}
                        {porcentajeUso > 90 && !cliente.bloqueado && (
                          <AlertCircle
                            className="h-4 w-4 text-orange-500 mx-auto mt-1"
                            title="Crédito casi agotado"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {onView && (
                            <button
                              onClick={() => onView(cliente)}
                              className="text-white hover:text-zinc-100"
                              title="Ver detalles"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(cliente)}
                              className="text-white hover:text-green-900"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleToggleBloqueo(cliente)}
                            className={
                              cliente.bloqueado
                                ? 'text-white hover:text-green-900'
                                : 'text-white hover:text-red-900'
                            }
                            title={cliente.bloqueado ? 'Desbloquear' : 'Bloquear'}
                          >
                            {cliente.bloqueado ? (
                              <UserCheck className="h-4 w-4" />
                            ) : (
                              <UserX className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {clientesFiltrados.length === 0 && (
          <div className="text-center py-12 text-gray-500">No se encontraron clientes</div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.onEdit === nextProps.onEdit && prevProps.onView === nextProps.onView;
  }
);

ClientesTable.displayName = 'ClientesTable';
