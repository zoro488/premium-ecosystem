/**
 * 📊 PremiumTable - Advanced Animated Table Component
 *
 * Tabla premium con:
 * - Animaciones de entrada staggered
 * - Hover effects suaves
 * - Sorting y filtering con transiciones
 * - Row highlights
 * - Scroll animations
 * - Responsive design
 */
import React, { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import {
  tableContainerVariants,
  tableRowHover,
  tableRowVariants,
} from '../animations/premiumAnimations';

/**
 * PremiumTable Component
 *
 * @param {Array} data - Array de datos a mostrar
 * @param {Array} columns - Configuración de columnas
 * @param {string} gradient - Gradiente del header
 * @param {boolean} animated - Habilitar animaciones
 * @param {Function} onRowClick - Handler al hacer click en fila
 * @param {boolean} sortable - Habilitar sorting
 * @param {boolean} hoverable - Habilitar hover effects
 * @param {number} maxHeight - Altura máxima (scroll)
 */
export const PremiumTable = ({
  data = [],
  columns = [],
  gradient = 'from-zinc-800/20 to-indigo-500/20',
  animated = true,
  onRowClick,
  sortable = true,
  hoverable = true,
  maxHeight,
  emptyMessage = 'No hay datos disponibles',
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Función de sorting
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (key) => {
    if (!sortable) return;

    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return (
        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }

    return (
      <motion.svg
        className="w-4 h-4 text-white"
        fill="none"
        viewBox="0 0 24 24"
        initial={{ rotate: 0 }}
        animate={{ rotate: sortConfig.direction === 'desc' ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </motion.svg>
    );
  };

  if (data.length === 0) {
    return (
      <motion.div
        className="flex items-center justify-center p-12 rounded-xl bg-gray-800/30 border border-gray-700/50"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring' }}
      >
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-gray-400 text-lg">{emptyMessage}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      <div
        className="overflow-x-auto overflow-y-auto rounded-xl border border-white/10 backdrop-blur-sm"
        style={{ maxHeight }}
      >
        <motion.table
          className="w-full"
          variants={animated ? tableContainerVariants : {}}
          initial="hidden"
          animate="show"
        >
          {/* Header */}
          <thead>
            <motion.tr
              className={`bg-gradient-to-r ${gradient} border-b border-white/10`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {columns.map((column, index) => (
                <motion.th
                  key={column.key}
                  className={`
                    px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider
                    ${sortable && column.sortable !== false ? 'cursor-pointer select-none' : ''}
                  `}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                  whileHover={
                    sortable && column.sortable !== false
                      ? { backgroundColor: 'rgba(255,255,255,0.1)' }
                      : {}
                  }
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {sortable && column.sortable !== false && <SortIcon columnKey={column.key} />}
                  </div>
                </motion.th>
              ))}
            </motion.tr>
          </thead>

          {/* Body */}
          <tbody>
            <AnimatePresence mode="popLayout">
              {sortedData.map((row, rowIndex) => (
                <motion.tr
                  key={row.id || rowIndex}
                  className={`
                    border-b border-white/5 backdrop-blur-sm
                    ${onRowClick ? 'cursor-pointer' : ''}
                    ${rowIndex % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-900/10'}
                  `}
                  variants={animated ? tableRowVariants : {}}
                  {...(hoverable && tableRowHover)}
                  onClick={() => onRowClick?.(row)}
                  layout
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, x: -20 }}
                  custom={rowIndex}
                >
                  {columns.map((column) => (
                    <motion.td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: rowIndex * 0.02 + 0.1 }}
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </motion.td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </motion.table>
      </div>

      {/* Footer con stats */}
      {sortedData.length > 0 && (
        <motion.div
          className="mt-4 flex items-center justify-between px-4 py-3 rounded-lg bg-gray-900/30 border border-white/5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-sm text-gray-400">
            Mostrando <span className="font-semibold text-white">{sortedData.length}</span>{' '}
            {sortedData.length === 1 ? 'registro' : 'registros'}
          </span>
          {sortConfig.key && (
            <span className="text-xs text-gray-500">
              Ordenado por: {columns.find((c) => c.key === sortConfig.key)?.label} (
              {sortConfig.direction === 'asc' ? 'Ascendente' : 'Descendente'})
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
};

/**
 * Badge Component para usar en tablas
 */
export const TableBadge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-700/50 text-gray-300',
    success: 'bg-zinc-9000/20 text-zinc-200',
    warning: 'bg-zinc-9000/20 text-zinc-200',
    danger: 'bg-zinc-9000/20 text-zinc-200',
    info: 'bg-zinc-800/20 text-zinc-300',
  };

  return (
    <motion.span
      className={`px-3 py-1 rounded-full text-xs font-medium ${variants[variant]}`}
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {children}
    </motion.span>
  );
};

export default PremiumTable;
