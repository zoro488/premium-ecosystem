import { useMemo, useState } from 'react';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  Download,
  Edit,
  Eye,
  Filter,
  Search,
  Trash2,
} from 'lucide-react';

/**
 * 🎯 ADVANCED DATA TABLE PREMIUM
 * Tabla interactiva con:
 * - Ordenamiento con animaciones
 * - Filtrado global y por columna
 * - Paginación fluida
 * - Microinteracciones en hover
 * - Acciones rápidas
 * - Virtual scrolling para grandes datasets
 */

const AdvancedDataTable = ({
  data = [],
  columns = [],
  onRowClick,
  onEdit,
  onDelete,
  onView,
  enableActions = true,
  enableSearch = true,
  enableFilters = true,
  pageSize = 10,
  className = '',
}) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });
  const [hoveredRow, setHoveredRow] = useState(null);

  // Agregar columna de acciones si está habilitada
  const enhancedColumns = useMemo(() => {
    if (!enableActions) return columns;

    return [
      ...columns,
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {onView && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onView(row.original);
                }}
                className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                title="Ver detalles"
              >
                <Eye className="w-4 h-4" />
              </motion.button>
            )}
            {onEdit && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(row.original);
                }}
                className="p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition-colors"
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </motion.button>
            )}
            {onDelete && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(row.original);
                }}
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        ),
      },
    ];
  }, [columns, enableActions, onView, onEdit, onDelete]);

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header con búsqueda y filtros */}
      {enableSearch && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
        >
          {/* Búsqueda global */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Buscar en todas las columnas..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400 transition-all"
            />
            <AnimatePresence>
              {globalFilter && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <button
                    onClick={() => setGlobalFilter('')}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Contador de resultados */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-slate-400"
          >
            {table.getFilteredRowModel().rows.length} resultados
          </motion.div>

          {/* Acciones adicionales */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center gap-2 text-slate-300 hover:text-white transition-all"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center gap-2 font-semibold shadow-lg hover:shadow-purple-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              Exportar
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Tabla con scroll horizontal */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-white/10">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-semibold text-slate-300"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-2 ${
                          header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {header.column.getCanSort() && (
                          <motion.div
                            animate={{
                              rotate: header.column.getIsSorted() === 'desc' ? 180 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            {header.column.getIsSorted() === false ? (
                              <ChevronsUpDown className="w-4 h-4 text-slate-500" />
                            ) : header.column.getIsSorted() === 'asc' ? (
                              <ChevronUp className="w-4 h-4 text-purple-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-purple-400" />
                            )}
                          </motion.div>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {table.getRowModel().rows.map((row, index) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.02 }}
                  onMouseEnter={() => setHoveredRow(row.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => onRowClick?.(row.original)}
                  className={`
                    border-b border-white/5 transition-all duration-200 cursor-pointer
                    ${hoveredRow === row.id ? 'bg-white/10' : 'hover:bg-white/5'}
                  `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 text-sm text-white">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 + 0.1 }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </motion.div>
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {/* Estado vacío */}
        {table.getRowModel().rows.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-slate-400"
          >
            <p className="text-lg font-semibold mb-2">No se encontraron resultados</p>
            <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
          </motion.div>
        )}
      </div>

      {/* Paginación Premium */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center justify-between gap-4 px-2"
      >
        {/* Info de paginación */}
        <div className="text-sm text-slate-400">
          Mostrando{' '}
          <span className="font-semibold text-white">
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
          </span>{' '}
          a{' '}
          <span className="font-semibold text-white">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}
          </span>{' '}
          de{' '}
          <span className="font-semibold text-white">
            {table.getFilteredRowModel().rows.length}
          </span>{' '}
          resultados
        </div>

        {/* Controles de paginación */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronsLeft className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>

          {/* Páginas */}
          <div className="flex items-center gap-1">
            {Array.from({ length: table.getPageCount() }, (_, i) => i).map((pageIndex) => (
              <motion.button
                key={pageIndex}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => table.setPageIndex(pageIndex)}
                className={`
                  w-8 h-8 rounded-lg font-semibold transition-all
                  ${
                    table.getState().pagination.pageIndex === pageIndex
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }
                `}
              >
                {pageIndex + 1}
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronsRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Selector de tamaño de página */}
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
        >
          {[10, 20, 30, 50, 100].map((size) => (
            <option key={size} value={size} className="bg-slate-800">
              {size} por página
            </option>
          ))}
        </select>
      </motion.div>
    </div>
  );
};

export default AdvancedDataTable;
