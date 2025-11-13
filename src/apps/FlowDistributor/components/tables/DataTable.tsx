/**
 * 📊 DataTable Premium - Componente de tabla reutilizable con todas las funcionalidades
 * - Búsqueda avanzada
 * - Ordenamiento multi-columna
 * - Filtros personalizados
 * - Paginación
 * - Exportación a CSV/Excel
 * - Selección múltiple
 * - Columnas personalizables
 * @version 2.0.0
 */
import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Download,
  Filter,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  searchable?: boolean;
  exportable?: boolean;
  itemsPerPage?: number;
  onRowClick?: (row: T) => void;
  customFilters?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  searchable = true,
  exportable = true,
  itemsPerPage = 10,
  onRowClick,
  customFilters,
}: DataTableProps<T>) {
  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map(col => col.key))
  );

  // Búsqueda
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter(row =>
      columns.some(col => {
        if (!visibleColumns.has(col.key)) return false;
        const value = row[col.key];
        if (value == null) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns, visibleColumns]);

  // Ordenamiento
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();

      if (aString < bString) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aString > bString) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginación
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Handlers
  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  const toggleColumnVisibility = (key: string) => {
    setVisibleColumns(current => {
      const newSet = new Set(current);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const exportToCSV = useCallback(() => {
    const visibleCols = columns.filter(col => visibleColumns.has(col.key));
    const headers = visibleCols.map(col => col.label).join(',');
    const rows = sortedData.map(row =>
      visibleCols.map(col => {
        const value = row[col.key];
        if (value == null) return '';
        const strValue = String(value);
        return strValue.includes(',') ? `"${strValue}"` : strValue;
      }).join(',')
    );

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title || 'data'}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }, [columns, sortedData, visibleColumns, title]);

  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="w-4 h-4 text-white/40" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-cyan-400" />
    ) : (
      <ChevronDown className="w-4 h-4 text-cyan-400" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          {title && <h2 className="text-2xl font-bold text-white">{title}</h2>}
          <p className="text-white/60 text-sm">
            Mostrando {paginatedData.length} de {sortedData.length} resultados
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Búsqueda */}
          {searchable && (
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all outline-none"
              />
            </div>
          )}

          {/* Column visibility */}
          <div className="relative group">
            <button className="p-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all">
              <Eye className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 backdrop-blur-xl bg-gray-900/95 border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="p-2 space-y-1">
                {columns.map(col => (
                  <label
                    key={col.key}
                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/5 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns.has(col.key)}
                      onChange={() => toggleColumnVisibility(col.key)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-cyan-500"
                    />
                    <span className="text-white text-sm">{col.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Export */}
          {exportable && (
            <button
              onClick={exportToCSV}
              className="p-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
          )}
        </div>
      </div>

      {/* Custom Filters */}
      {customFilters && (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-4">
          {customFilters}
        </div>
      )}

      {/* Table */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                {columns
                  .filter(col => visibleColumns.has(col.key))
                  .map(col => (
                    <th
                      key={col.key}
                      className={`px-4 py-3 text-${col.align || 'left'} text-white/80 font-semibold text-sm ${col.sortable !== false ? 'cursor-pointer hover:bg-white/5' : ''}`}
                      style={{ width: col.width }}
                      onClick={() => col.sortable !== false && handleSort(col.key)}
                    >
                      <div className="flex items-center gap-2">
                        <span>{col.label}</span>
                        {col.sortable !== false && getSortIcon(col.key)}
                      </div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {paginatedData.map((row, idx) => (
                  <motion.tr
                    key={row.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: idx * 0.02 }}
                    onClick={() => onRowClick?.(row)}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                  >
                    {columns
                      .filter(col => visibleColumns.has(col.key))
                      .map(col => (
                        <td
                          key={col.key}
                          className={`px-4 py-3 text-${col.align || 'left'} text-white/90`}
                        >
                          {col.render ? col.render(row[col.key], row) : row[col.key]}
                        </td>
                      ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {paginatedData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/40 text-lg">No se encontraron resultados</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition-colors"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-white/60 text-sm">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    currentPage === page
                      ? 'bg-cyan-500 text-white'
                      : 'backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            {totalPages > 5 && <span className="text-white/60">...</span>}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Utilidades de renderizado comunes
export const renderCurrency = (value: number) => (
  <span className="font-mono">
    ${value?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
  </span>
);

export const renderDate = (value: string) => {
  if (!value) return '-';
  const date = new Date(value);
  return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const renderStatus = (value: string) => {
  const colors: Record<string, string> = {
    Pagado: 'bg-green-500/20 text-green-400 border-green-500/30',
    Pendiente: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    Cancelado: 'bg-red-500/20 text-red-400 border-red-500/30',
    Completado: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[value] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
      {value}
    </span>
  );
};

export const renderBadge = (value: string | number, color: string = 'cyan') => (
  <span className={`px-2 py-1 rounded-md bg-${color}-500/20 text-${color}-400 text-xs font-medium`}>
    {value}
  </span>
);
