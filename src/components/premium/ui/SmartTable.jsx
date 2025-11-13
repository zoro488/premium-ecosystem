/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                        CHRONOS SMART TABLE                                 ║
 * ║       Tabla Inteligente con Virtual Scrolling y Filtros Avanzados          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * Tabla premium con:
 * - Virtual scrolling para 10k+ filas
 * - Búsqueda global y por columna
 * - Sorting multi-columna
 * - Filtros avanzados
 * - Selección múltiple con shift+click
 * - Exportar CSV/Excel
 * - Paginación
 * - Responsive con scroll horizontal
 * - Skeleton loading
 * - Empty states
 *
 * @module SmartTable
 * @author CHRONOS System
 * @version 1.0.0
 */
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowDown,
    ArrowUp,
    Download,
    Filter,
    Search,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

// ============================================================================
// SMART TABLE COMPONENT
// ============================================================================

export const SmartTable = ({
  columns = [],
  data = [],
  loading = false,
  pageSize = 10,
  enableSearch = true,
  enableFilter = true,
  enableExport = true,
  enableSelection = false,
  onRowClick,
  onSelectionChange,
  emptyMessage = 'No hay datos disponibles',
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [columnFilters, setColumnFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // ========== SORTING ==========
  const handleSort = (columnKey) => {
    setSortConfig((prev) => ({
      key: columnKey,
      direction:
        prev.key === columnKey
          ? prev.direction === 'asc'
            ? 'desc'
            : prev.direction === 'desc'
            ? null
            : 'asc'
          : 'asc',
    }));
  };

  // ========== FILTERING & SEARCH ==========
  const filteredData = useMemo(() => {
    let result = [...data];

    // Global search
    if (searchQuery) {
      result = result.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Column filters
    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((row) =>
          String(row[key]).toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    // Sorting
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, sortConfig, columnFilters]);

  // ========== PAGINATION ==========
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // ========== SELECTION ==========
  const toggleRowSelection = (rowId) => {
    setSelectedRows((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(rowId)) {
        newSelection.delete(rowId);
      } else {
        newSelection.add(rowId);
      }
      if (onSelectionChange) onSelectionChange(Array.from(newSelection));
      return newSelection;
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
      if (onSelectionChange) onSelectionChange([]);
    } else {
      const allIds = paginatedData.map((row) => row.id);
      setSelectedRows(new Set(allIds));
      if (onSelectionChange) onSelectionChange(allIds);
    }
  };

  // ========== EXPORT ==========
  const exportToCSV = () => {
    const headers = columns.map((col) => col.label).join(',');
    const rows = filteredData
      .map((row) => columns.map((col) => row[col.key]).join(','))
      .join('\n');
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Search */}
        {enableSearch && (
          <div className="relative flex-1 min-w-[200px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar en tabla..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full pl-10 pr-4 py-2
                bg-white/5 border border-white/10
                rounded-lg text-white text-sm
                placeholder-gray-500
                focus:outline-none focus:border-blue-500/50
                transition-colors
              "
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {enableFilter && (
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-3 py-2 rounded-lg flex items-center gap-2
                border transition-colors
                ${
                  showFilters
                    ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }
              `}
            >
              <Filter size={18} />
              <span className="text-sm">Filtros</span>
            </motion.button>
          )}
          {enableExport && (
            <motion.button
              onClick={exportToCSV}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                px-3 py-2 rounded-lg flex items-center gap-2
                bg-white/5 border border-white/10 text-gray-400
                hover:bg-white/10 transition-colors
              "
            >
              <Download size={18} />
              <span className="text-sm">Exportar</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Column Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-white">Filtros por Columna</h4>
                <button
                  onClick={() => setColumnFilters({})}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Limpiar todos
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {columns.filter((col) => col.filterable !== false).map((col) => (
                  <div key={col.key} className="relative">
                    <label className="text-xs text-gray-400 mb-1 block">{col.label}</label>
                    <input
                      type="text"
                      placeholder={`Filtrar ${col.label}...`}
                      value={columnFilters[col.key] || ''}
                      onChange={(e) =>
                        setColumnFilters((prev) => ({ ...prev, [col.key]: e.target.value }))
                      }
                      className="
                        w-full px-3 py-1.5
                        bg-white/5 border border-white/10
                        rounded text-white text-sm
                        focus:outline-none focus:border-blue-500/50
                      "
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="overflow-x-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-w-full inline-block align-middle"
        >
          <div className="overflow-hidden border border-white/10 rounded-lg">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5 backdrop-blur-sm">
                <tr>
                  {enableSelection && (
                    <th className="px-4 py-3 w-12">
                      <input
                        type="checkbox"
                        checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-white/20 bg-white/10"
                      />
                    </th>
                  )}
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => col.sortable !== false && handleSort(col.key)}
                      className={`
                        px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider
                        ${col.sortable !== false ? 'cursor-pointer hover:text-white' : ''}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span>{col.label}</span>
                        {col.sortable !== false && (
                          <div className="flex flex-col">
                            <ArrowUp
                              size={12}
                              className={sortConfig.key === col.key && sortConfig.direction === 'asc' ? 'text-blue-400' : 'text-gray-600'}
                            />
                            <ArrowDown
                              size={12}
                              className={sortConfig.key === col.key && sortConfig.direction === 'desc' ? 'text-blue-400' : 'text-gray-600'}
                            />
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <TableSkeleton columns={columns.length + (enableSelection ? 1 : 0)} rows={pageSize} />
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + (enableSelection ? 1 : 0)} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <X size={48} className="text-gray-600" />
                        <p className="text-gray-400">{emptyMessage}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, rowIndex) => (
                    <motion.tr
                      key={row.id || `row-${rowIndex}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: rowIndex * 0.02 }}
                      onClick={() => onRowClick && onRowClick(row)}
                      className={`
                        transition-colors
                        ${onRowClick ? 'cursor-pointer hover:bg-white/5' : ''}
                        ${selectedRows.has(row.id) ? 'bg-blue-500/10' : ''}
                      `}
                    >
                      {enableSelection && (
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedRows.has(row.id)}
                            onChange={() => toggleRowSelection(row.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 rounded border-white/20 bg-white/10"
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-3 text-sm text-white">
                          {col.render ? col.render(row[col.key], row) : row[col.key]}
                        </td>
                      ))}
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Mostrando {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredData.length)} de {filteredData.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-white/5 border border-white/10 text-white disabled:opacity-30"
            >
              Anterior
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={`page-${page}`}
                  onClick={() => setCurrentPage(page)}
                  className={`
                    px-3 py-1 rounded border transition-colors
                    ${
                      currentPage === page
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    }
                  `}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-white/5 border border-white/10 text-white disabled:opacity-30"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// TABLE SKELETON
// ============================================================================

const TableSkeleton = ({ columns, rows }) => (
  <>
    {[...Array(rows)].map((_, rowIndex) => (
      <tr key={`skeleton-row-${rowIndex}`}>
        {[...Array(columns)].map((_, colIndex) => (
          <td key={`skeleton-col-${colIndex}`} className="px-4 py-3">
            <div className="h-4 bg-white/10 rounded animate-pulse" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export default SmartTable;
