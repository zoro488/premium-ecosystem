import React, { useMemo, useState } from 'react';

import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Filter, Search } from 'lucide-react';

import Badge from './Badge';
import Input from './Input';

const Table = ({
  data = [],
  columns = [],
  searchable = true,
  sortable = true,
  paginated = true,
  pageSize = 10,
  className,
  onRowClick,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  ...props
}) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filtrado por búsqueda
  const filteredData = useMemo(() => {
    if (!search) return data;

    return data.filter((item) =>
      columns.some((column) => {
        const value = item[column.key];
        return value && value.toString().toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [data, search, columns]);

  // Ordenamiento
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

  // Paginación
  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize, paginated]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Manejar ordenamiento
  const handleSort = (key) => {
    if (!sortable) return;

    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Renderizar celda
  const renderCell = (item, column) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }

    const value = item[column.key];

    // Manejar diferentes tipos de datos
    if (column.type === 'badge') {
      return <Badge variant={column.variant || 'default'}>{value}</Badge>;
    }

    if (column.type === 'currency') {
      return <span className="font-mono">${value?.toLocaleString('es-MX') || '0'}</span>;
    }

    if (column.type === 'date') {
      return new Date(value).toLocaleDateString('es-MX');
    }

    return value;
  };

  return (
    <div className="space-y-4">
      {/* Header con búsqueda */}
      {searchable && (
        <div className="flex items-center gap-4">
          <Input
            icon={Search}
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-md"
          />
          <div className="text-sm text-slate-400">
            {sortedData.length} resultado{sortedData.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="glass-strong rounded-2xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className={clsx('w-full', className)} {...props}>
            {/* Header */}
            <thead>
              <tr className="border-b border-white/10">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={clsx(
                      'px-6 py-4 text-left text-sm font-semibold text-slate-200',
                      column.width && `w-${column.width}`,
                      sortable && 'cursor-pointer hover:bg-white/5 transition-colors'
                    )}
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.label}</span>
                      {sortable && sortConfig.key === column.key && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-blue-400"
                        >
                          {sortConfig.direction === 'asc' ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </motion.div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"
                        />
                        <span className="text-slate-400">Cargando...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => (
                    <motion.tr
                      key={item.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => onRowClick && onRowClick(item)}
                      className={clsx(
                        'border-b border-white/5 last:border-b-0',
                        'hover:bg-white/5 transition-colors',
                        onRowClick && 'cursor-pointer'
                      )}
                    >
                      {columns.map((column) => (
                        <td key={column.key} className="px-6 py-4 text-sm text-slate-300">
                          {renderCell(item, column)}
                        </td>
                      ))}
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {paginated && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-400">
            Mostrando {(currentPage - 1) * pageSize + 1} a{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} de {sortedData.length} resultados
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 rounded-lg glass hover:glass-strong disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                )
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="text-slate-400 px-2">...</span>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(page)}
                      className={clsx(
                        'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                        page === currentPage
                          ? 'bg-blue-500 text-white'
                          : 'glass hover:glass-strong text-slate-300'
                      )}
                    >
                      {page}
                    </motion.button>
                  </React.Fragment>
                ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 rounded-lg glass hover:glass-strong disabled:opacity-50 disabled:cursor-not-called transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
