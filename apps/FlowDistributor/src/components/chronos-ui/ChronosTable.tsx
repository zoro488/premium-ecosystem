// ============================================================================
// 📊 CHRONOS TABLE - Premium Data Table Component
// Tabla con animaciones, filtros, paginación y microinteracciones avanzadas
// ============================================================================

import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Filter,
    Search,
} from 'lucide-react';
import { ReactNode, useMemo, useState } from 'react';

export interface ChronosTableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, row: T) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface ChronosTableProps<T = Record<string, unknown>> {
  data: T[];
  columns: ChronosTableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  pageSize?: number;
  className?: string;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;
  striped?: boolean;
  hoverable?: boolean;
}

export function ChronosTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  pageSize = 10,
  className = '',
  onRowClick,
  rowClassName,
  striped = true,
  hoverable = true,
}: ChronosTableProps<T>) {
  // Estados
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  // const [filters, setFilters] = useState<Record<string, string>>({});
  const [globalSearch, setGlobalSearch] = useState('');

  // Datos procesados (filtrados, buscados, ordenados)
  const processedData = useMemo(() => {
    let result = [...data];

    // 1. Filtro global de búsqueda
    if (globalSearch) {
      result = result.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(globalSearch.toLowerCase())
        )
      );
    }

    // 2. Filtros por columna (deshabilitado temporalmente)
    // Object.entries(filters).forEach(([key, value]) => {
    //   if (value) {
    //     result = result.filter((row) =>
    //       String(row[key]).toLowerCase().includes(value.toLowerCase())
    //     );
    //   }
    // });

    // 3. Ordenamiento
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue === bValue) return 0;

        // Handle comparison with unknown types
        const aStr = String(aValue);
        const bStr = String(bValue);
        const comparison = aStr < bStr ? -1 : 1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, globalSearch, sortColumn, sortDirection]);

  // Paginación
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handlers
  const handleSort = (column: ChronosTableColumn<T>) => {
    if (!column.sortable) return;

    if (sortColumn === column.key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column.key);
      setSortDirection('asc');
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barra de búsqueda global */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-chronos-silver group-focus-within:text-neon-cyan transition-colors" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Buscar en toda la tabla..."
            className="w-full bg-chronos-graphite border border-chronos-smoke rounded-xl py-3 pl-12 pr-4 text-chronos-white placeholder-chronos-silver focus:outline-none focus:border-neon-cyan/50 focus:bg-chronos-charcoal transition-all duration-300"
          />
        </div>

        {/* Indicadores */}
        <div className="text-sm text-chronos-silver font-mono">
          {processedData.length === data.length ? (
            <span>{data.length} registros</span>
          ) : (
            <span>
              {processedData.length} de {data.length} registros
            </span>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="card-glass overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="border-b border-chronos-smoke">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    style={{ width: column.width }}
                    className={`
                      px-6 py-4 text-${column.align || 'left'}
                      ${column.sortable ? 'cursor-pointer select-none group' : ''}
                    `}
                    onClick={() => column.sortable && handleSort(column)}
                  >
                    <div className="flex items-center gap-2 justify-${column.align || 'start'}">
                      <span className="text-sm font-semibold text-chronos-pearl uppercase tracking-wider">
                        {column.label}
                      </span>

                      {/* Sort Icon */}
                      {column.sortable && (
                        <motion.div
                          className="text-chronos-silver group-hover:text-neon-cyan transition-colors"
                          whileHover={{ scale: 1.1 }}
                        >
                          {sortColumn === column.key ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="w-4 h-4 text-neon-cyan" />
                            ) : (
                              <ArrowDown className="w-4 h-4 text-neon-cyan" />
                            )
                          ) : (
                            <ArrowUpDown className="w-4 h-4" />
                          )}
                        </motion.div>
                      )}

                      {/* Filter Icon */}
                      {column.filterable && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-chronos-silver hover:text-neon-purple transition-colors"
                        >
                          <Filter className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
                        <span className="text-chronos-silver font-mono">Cargando datos...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full bg-chronos-graphite flex items-center justify-center">
                          <Search className="w-8 h-8 text-chronos-silver" />
                        </div>
                        <span className="text-chronos-silver">{emptyMessage}</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className={`
                        border-b border-chronos-smoke/30
                        ${striped && index % 2 === 1 ? 'bg-chronos-graphite/20' : ''}
                        ${hoverable ? 'hover:bg-chronos-graphite/40 transition-colors duration-150' : ''}
                        ${onRowClick ? 'cursor-pointer' : ''}
                        ${rowClassName ? rowClassName(row) : ''}
                      `}
                      onClick={() => onRowClick?.(row)}
                      whileHover={hoverable ? { scale: 1.005 } : undefined}
                    >
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={`px-6 py-4 text-${column.align || 'left'}`}
                        >
                          <div className="text-chronos-white">
                            {column.render
                              ? column.render(row[column.key], row)
                              : String(row[column.key])}
                          </div>
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
          <div className="flex items-center justify-between px-6 py-4 border-t border-chronos-smoke">
            {/* Info */}
            <div className="text-sm text-chronos-silver font-mono">
              Página {currentPage} de {totalPages}
            </div>

            {/* Controles */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg glass text-chronos-silver hover:text-chronos-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronsLeft className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg glass text-chronos-silver hover:text-chronos-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              {/* Números de página */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <motion.button
                    key={pageNum}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => goToPage(pageNum)}
                    className={`
                      min-w-[40px] px-3 py-2 rounded-lg font-mono text-sm transition-all
                      ${
                        currentPage === pageNum
                          ? 'bg-neon-cyan text-chronos-void font-bold shadow-neon-cyan/50'
                          : 'glass text-chronos-silver hover:text-chronos-white'
                      }
                    `}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg glass text-chronos-silver hover:text-chronos-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg glass text-chronos-silver hover:text-chronos-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronsRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChronosTable;
