/**
 * 📊 ULTRA PREMIUM TABLE COMPONENT
 * Tabla con datos de Firestore, animaciones y microinteracciones
 */
import { useMemo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Filter, Search } from 'lucide-react';

export const UltraPremiumTable = ({
  data = [],
  columns = [],
  loading = false,
  onRowClick,
  sortable = true,
  searchable = true,
  className = '',
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredRow, setHoveredRow] = useState(null);

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  // Search logic
  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedData;

    return sortedData.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedData, searchTerm]);

  const handleSort = (key) => {
    if (!sortable) return;

    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="h-16 bg-gradient-to-r from-black-carbon/50 to-black-obsidian/50 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search bar */}
      {searchable && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-chrome/50" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-black-carbon/50 border border-white/[0.05] rounded-xl text-white-pearl placeholder-gray-chrome/50 focus:border-white/[0.15] focus:ring-2 focus:ring-white/[0.05] transition-all duration-300"
          />
        </motion.div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.05] bg-black-deep/80 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="bg-gradient-to-r from-black-carbon/80 to-black-obsidian/80 border-b border-white/[0.05]">
                {columns.map((column, idx) => (
                  <motion.th
                    key={column.key}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleSort(column.key)}
                    className={`
                      px-6 py-4 text-left text-xs font-semibold text-gray-chrome uppercase tracking-wider
                      ${sortable && column.sortable !== false ? 'cursor-pointer hover:text-white-pearl transition-colors' : ''}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {sortable && column.sortable !== false && sortConfig.key === column.key && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          {sortConfig.direction === 'asc' ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </motion.div>
                      )}
                    </div>
                  </motion.th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              <AnimatePresence mode="wait">
                {filteredData.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={columns.length} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Filter className="w-8 h-8 text-gray-chrome/30" />
                        <p className="text-gray-chrome/70">No se encontraron datos</p>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  filteredData.map((row, rowIdx) => (
                    <motion.tr
                      key={row.id || rowIdx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: rowIdx * 0.03 }}
                      onMouseEnter={() => setHoveredRow(rowIdx)}
                      onMouseLeave={() => setHoveredRow(null)}
                      onClick={() => onRowClick?.(row)}
                      className={`
                        border-b border-white/[0.03] transition-all duration-300
                        ${onRowClick ? 'cursor-pointer' : ''}
                        ${hoveredRow === rowIdx ? 'bg-white/[0.02]' : ''}
                      `}
                    >
                      {columns.map((column, colIdx) => (
                        <motion.td
                          key={column.key}
                          className="px-6 py-4 text-sm text-white-silk"
                          animate={hoveredRow === rowIdx ? { x: 4 } : { x: 0 }}
                          transition={{ delay: colIdx * 0.02 }}
                        >
                          {column.render
                            ? column.render(row[column.key], row)
                            : row[column.key] || '-'}
                        </motion.td>
                      ))}
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer info */}
      {filteredData.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-between items-center text-sm text-gray-chrome/70 px-2"
        >
          <span>
            Mostrando {filteredData.length} de {data.length} registros
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default UltraPremiumTable;
