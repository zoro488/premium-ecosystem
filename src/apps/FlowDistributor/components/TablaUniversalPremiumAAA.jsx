/**
 * 📊 TABLA UNIVERSAL PREMIUM AAA
 * ================================
 * Tabla de alta calidad para TODOS los paneles
 * Con virtualización, animaciones fluidas y UX premium
 */
import { memo, useCallback, useMemo, useState } from 'react';

import { useVirtualizer } from '@tanstack/react-virtual';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Search,
  X,
} from 'lucide-react';

/**
 * Hook para gestión de tabla
 */
function useTableState(data, columns) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({});

  // Filtrado
  const filteredData = useMemo(() => {
    let result = [...data];

    // Búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const value = row[col.key];
          return value?.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Filtros específicos
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((row) => row[key] === value);
      }
    });

    return result;
  }, [data, searchTerm, filters, columns]);

  // Ordenamiento
  const sortedData = useMemo(() => {
    if (!sortBy) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal || '');
      const bStr = String(bVal || '');
      const comparison = aStr.localeCompare(bStr);
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortBy, sortOrder]);

  // Paginación
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  return {
    searchTerm,
    setSearchTerm,
    sortBy,
    sortOrder,
    setSortBy: (key) => {
      if (sortBy === key) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(key);
        setSortOrder('asc');
      }
    },
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    filters,
    setFilters,
    filteredData: paginatedData,
    totalItems: sortedData.length,
    totalPages,
  };
}

/**
 * Componente principal de tabla
 */
export const TablaUniversalPremiumAAA = memo(
  ({
    data = [],
    columns = [],
    title = '',
    onRowClick = null,
    onAdd = null,
    virtualized = false,
    exportable = true,
    className = '',
  }) => {
    const tableState = useTableState(data, columns);
    const {
      searchTerm,
      setSearchTerm,
      sortBy,
      sortOrder,
      setSortBy,
      currentPage,
      setCurrentPage,
      pageSize,
      setPageSize,
      filteredData,
      totalItems,
      totalPages,
    } = tableState;

    // Exportar a CSV
    const handleExport = useCallback(() => {
      const headers = columns.map((col) => col.label).join(',');
      const rows = filteredData
        .map((row) => columns.map((col) => row[col.key] || '').join(','))
        .join('\n');
      const csv = `${headers}\n${rows}`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'tabla'}_${new Date().toISOString()}.csv`;
      a.click();
    }, [columns, filteredData, title]);

    return (
      <div className={`space-y-4 ${className}`}>
        {/* Header con título y acciones */}
        <div className="flex items-center justify-between">
          <motion.h2
            className="text-2xl font-bold bg-gradient-to-r from-zinc-700 to-zinc-900 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {title}
          </motion.h2>

          <div className="flex gap-2">
            {onAdd && (
              <motion.button
                onClick={onAdd}
                className="px-4 py-2 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                + Agregar
              </motion.button>
            )}

            {exportable && (
              <motion.button
                onClick={handleExport}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={18} />
                Exportar
              </motion.button>
            )}
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 backdrop-blur-sm transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 backdrop-blur-sm"
          >
            <option value={10}>10 por página</option>
            <option value={25}>25 por página</option>
            <option value={50}>50 por página</option>
            <option value={100}>100 por página</option>
          </select>
        </div>

        {/* Estadísticas */}
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>
            Mostrando {filteredData.length} de {totalItems} registros
          </span>
        </div>

        {/* Tabla */}
        <div className="bg-gray-900/30 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/50">
                  {columns.map((column, idx) => (
                    <th
                      key={column.key}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:text-zinc-300 transition-colors"
                      onClick={() => column.sortable && setSortBy(column.key)}
                    >
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        {column.label}
                        {column.sortable && sortBy === column.key && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500 }}
                          >
                            {sortOrder === 'asc' ? (
                              <ArrowUp size={14} className="text-zinc-300" />
                            ) : (
                              <ArrowDown size={14} className="text-zinc-300" />
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredData.map((row, rowIdx) => (
                    <motion.tr
                      key={row.id || rowIdx}
                      className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors cursor-pointer"
                      onClick={() => onRowClick?.(row)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: rowIdx * 0.02 }}
                      layout
                    >
                      {columns.map((column) => (
                        <td key={column.key} className="px-6 py-4 text-sm text-gray-300">
                          {column.render ? column.render(row[column.key], row) : row[column.key]}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Sin datos */}
          {filteredData.length === 0 && (
            <motion.div
              className="py-12 text-center text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-lg">No se encontraron registros</p>
              {searchTerm && (
                <p className="text-sm mt-2">
                  Intenta buscar con otros términos o{' '}
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-zinc-300 hover:underline"
                  >
                    limpiar búsqueda
                  </button>
                </p>
              )}
            </motion.div>
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Página {currentPage} de {totalPages}
            </div>

            <div className="flex gap-2">
              <motion.button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                whileHover={currentPage > 1 ? { scale: 1.05 } : {}}
                whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
              >
                <ChevronLeft size={18} />
                Anterior
              </motion.button>

              <motion.button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                whileHover={currentPage < totalPages ? { scale: 1.05 } : {}}
                whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}
              >
                Siguiente
                <ChevronRight size={18} />
              </motion.button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

TablaUniversalPremiumAAA.displayName = 'TablaUniversalPremiumAAA';

// Eliminado export default para evitar problemas de inicialización durante minificación
// Usar solo named exports
