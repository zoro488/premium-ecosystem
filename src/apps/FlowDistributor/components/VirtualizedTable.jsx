import React, { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ChevronsUpDown, Search } from 'lucide-react';

/**
 * 📊 VIRTUALIZED TABLE - Tabla virtualizada con animaciones premium
 * Optimizada para manejar grandes cantidades de datos
 */
export const VirtualizedTable = ({
  data = [],
  columns = [],
  pageSize = 50,
  onRowClick,
  sortable = true,
  searchable = true,
  loading = false,
}) => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = React.useState('');
  const [hoveredRow, setHoveredRow] = React.useState(null);

  // Filtrar datos por búsqueda
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Ordenar datos
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginar datos
  const paginatedData = useMemo(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Manejar ordenamiento
  const handleSort = useCallback((key) => {
    if (!sortable) return;

    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, [sortable]);

  // Renderizar icono de ordenamiento
  const renderSortIcon = (columnKey) => {
    if (!sortable) return null;

    if (sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-500" />;
    }

    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-blue-400" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-400" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Búsqueda */}
      {searchable && (
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      )}

      {/* Tabla */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead className="bg-gray-900/50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-4 text-left text-sm font-semibold text-gray-400 ${
                      sortable ? 'cursor-pointer hover:text-white transition-colors' : ''
                    }`}
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {renderSortIcon(column.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              <AnimatePresence mode="popLayout">
                {loading ? (
                  // Loading state
                  Array.from({ length: 5 }).map((_, i) => (
                    <motion.tr
                      key={`loading-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-gray-700/30"
                    >
                      {columns.map((column) => (
                        <td key={column.key} className="px-6 py-4">
                          <div className="h-6 bg-gray-700/50 rounded animate-pulse" />
                        </td>
                      ))}
                    </motion.tr>
                  ))
                ) : paginatedData.length === 0 ? (
                  // Empty state
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={columns.length} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-700/30 rounded-full flex items-center justify-center">
                          <Search className="w-8 h-8 text-gray-500" />
                        </div>
                        <p className="text-gray-400">No se encontraron resultados</p>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  // Data rows
                  paginatedData.map((row, index) => (
                    <motion.tr
                      key={row.id || index}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{
                        duration: 0.2,
                        delay: index * 0.02,
                      }}
                      className={`
                        border-b border-gray-700/30
                        transition-colors
                        ${onRowClick ? 'cursor-pointer' : ''}
                        ${hoveredRow === index ? 'bg-gray-700/30' : ''}
                      `}
                      onMouseEnter={() => setHoveredRow(index)}
                      onMouseLeave={() => setHoveredRow(null)}
                      onClick={() => onRowClick?.(row)}
                      whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.3)' }}
                    >
                      {columns.map((column) => (
                        <td key={column.key} className="px-6 py-4">
                          {column.render ? (
                            column.render(row[column.key], row)
                          ) : (
                            <span className="text-sm text-gray-300">
                              {row[column.key]}
                            </span>
                          )}
                        </td>
                      ))}
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-900/30 border-t border-gray-700/30 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Mostrando {currentPage * pageSize + 1} -{' '}
              {Math.min((currentPage + 1) * pageSize, sortedData.length)} de{' '}
              {sortedData.length} resultados
            </div>

            <div className="flex gap-2">
              <motion.button
                onClick={() => setCurrentPage(0)}
                disabled={currentPage === 0}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === 0
                    ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
                whileHover={currentPage !== 0 ? { scale: 1.05 } : {}}
                whileTap={currentPage !== 0 ? { scale: 0.95 } : {}}
              >
                Primera
              </motion.button>

              <motion.button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === 0
                    ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
                whileHover={currentPage !== 0 ? { scale: 1.05 } : {}}
                whileTap={currentPage !== 0 ? { scale: 0.95 } : {}}
              >
                Anterior
              </motion.button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i;
                  } else if (currentPage < 3) {
                    pageNumber = i;
                  } else if (currentPage > totalPages - 4) {
                    pageNumber = totalPages - 5 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <motion.button
                      key={`item-${i}`}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === pageNumber
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {pageNumber + 1}
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === totalPages - 1
                    ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
                whileHover={currentPage !== totalPages - 1 ? { scale: 1.05 } : {}}
                whileTap={currentPage !== totalPages - 1 ? { scale: 0.95 } : {}}
              >
                Siguiente
              </motion.button>

              <motion.button
                onClick={() => setCurrentPage(totalPages - 1)}
                disabled={currentPage === totalPages - 1}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === totalPages - 1
                    ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
                whileHover={currentPage !== totalPages - 1 ? { scale: 1.05 } : {}}
                whileTap={currentPage !== totalPages - 1 ? { scale: 0.95 } : {}}
              >
                Última
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualizedTable;
