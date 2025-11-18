/**
 * 🎭 ANIMATED DATA TABLE
 *
 * Tabla de datos con animaciones premium
 * - Entrada staggered de filas
 * - Hover effects sofisticados
 * - Sorting animado
 * - Skeleton loading
 * - Responsive
 *
 * Inspirado en dashboards financieros modernos
 * @version 1.0.0
 */

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import { memo, useMemo, useState } from 'react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface AnimatedDataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  searchable?: boolean;
  theme?: 'purple' | 'blue' | 'green' | 'orange';
}

const THEME_COLORS = {
  purple: { primary: '#a855f7', secondary: '#ec4899' },
  blue: { primary: '#3b82f6', secondary: '#06b6d4' },
  green: { primary: '#10b981', secondary: '#34d399' },
  orange: { primary: '#f97316', secondary: '#fb923c' },
};

const SkeletonRow = memo(() => (
  <motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="border-b border-white/10"
  >
    {[1, 2, 3, 4, 5].map((i) => (
      <td key={i} className="px-6 py-4">
        <motion.div
          className="h-4 bg-white/10 rounded"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      </td>
    ))}
  </motion.tr>
));

SkeletonRow.displayName = 'SkeletonRow';

export const AnimatedDataTable = memo<AnimatedDataTableProps>(({
  columns,
  data,
  loading = false,
  searchable = true,
  theme = 'purple',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const colors = THEME_COLORS[theme];

  // Filtrar datos
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
    if (!sortConfig) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      {searchable && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-zinc-800/50 transition-colors"
          />
        </motion.div>
      )}

      {/* Table */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`
                      px-6 py-4 text-sm font-semibold text-gray-300
                      ${column.sortable ? 'cursor-pointer select-none hover:bg-white/5' : ''}
                      ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}
                    `}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2 justify-start">
                      {column.label}
                      {column.sortable && sortConfig?.key === column.key && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        >
                          {sortConfig.direction === 'asc' ? (
                            <ArrowUp className="w-4 h-4" style={{ color: colors.primary }} />
                          ) : (
                            <ArrowDown className="w-4 h-4" style={{ color: colors.primary }} />
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
              {loading ? (
                // Skeleton loading
                Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              ) : (
                // Animated rows
                <AnimatePresence mode="popLayout">
                  {sortedData.map((row, rowIndex) => (
                    <motion.tr
                      key={row.id || rowIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{
                        duration: 0.3,
                        delay: rowIndex * 0.05,
                      }}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer group"
                      whileHover={{ scale: 1.01 }}
                    >
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={`
                            px-6 py-4 text-sm text-gray-300
                            ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}
                          `}
                        >
                          {column.render
                            ? column.render(row[column.key], row)
                            : row[column.key]
                          }
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {!loading && sortedData.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-400"
          >
            No se encontraron resultados
          </motion.div>
        )}
      </div>

      {/* Footer info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-gray-400 text-center"
      >
        Mostrando {sortedData.length} de {data.length} registros
      </motion.div>
    </div>
  );
});

AnimatedDataTable.displayName = 'AnimatedDataTable';

export default AnimatedDataTable;
