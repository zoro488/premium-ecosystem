/**
 * 🚀 VIRTUALIZED TABLE PREMIUM
 * ==============================
 * Tabla optimizada para manejar miles de registros con 60fps
 * Usa react-window para virtual scrolling
 *
 * Features:
 * - Virtual scrolling (solo renderiza elementos visibles)
 * - Sorting dinámico
 * - Filtering
 * - Selección múltiple
 * - Animaciones suaves
 * - Responsive design
 */
import { memo, useCallback, useMemo, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';

import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Download, Filter, Search } from 'lucide-react';
import PropTypes from 'prop-types';

// ============================================
// COMPONENTE: HEADER DE TABLA
// ============================================

const TableHeader = memo(({ columns, sortConfig, onSort, selectedCount, totalCount }) => {
  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-white/5 border-b border-white/10">
      {columns.map((column) => (
        <div
          key={column.key}
          className="flex items-center gap-2 cursor-pointer hover:text-cyan-400 transition-colors"
          style={{ width: column.width || 'auto', flex: column.flex || 'none' }}
          onClick={() => onSort(column.key)}
        >
          <span className="font-semibold text-sm">{column.label}</span>
          {sortConfig.key === column.key && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {sortConfig.direction === 'asc' ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </motion.div>
          )}
        </div>
      ))}

      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="ml-auto text-sm text-cyan-400"
        >
          {selectedCount} de {totalCount} seleccionados
        </motion.div>
      )}
    </div>
  );
});

TableHeader.displayName = 'TableHeader';
TableHeader.propTypes = {
  columns: PropTypes.array.isRequired,
  sortConfig: PropTypes.object.isRequired,
  onSort: PropTypes.func.isRequired,
  selectedCount: PropTypes.number,
  totalCount: PropTypes.number,
};

// ============================================
// COMPONENTE: FILA DE TABLA
// ============================================

const TableRow = memo(({ index, style, data, columns, isSelected, onSelect, onRowClick }) => {
  const { items } = data;
  const item = items[index];

  return (
    <motion.div
      style={style}
      className={`flex items-center gap-4 px-4 border-b border-white/5 cursor-pointer transition-colors ${
        isSelected ? 'bg-cyan-500/10' : 'hover:bg-white/5'
      }`}
      onClick={() => onRowClick?.(item)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.01 }}
    >
      {/* Checkbox de selección */}
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(item.id);
          }}
          className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500"
        />
      </div>

      {/* Columnas de datos */}
      {columns.map((column) => (
        <div
          key={column.key}
          style={{ width: column.width || 'auto', flex: column.flex || 'none' }}
          className="text-sm"
        >
          {column.render ? column.render(item[column.key], item) : item[column.key]}
        </div>
      ))}
    </motion.div>
  );
});

TableRow.displayName = 'TableRow';
TableRow.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  onRowClick: PropTypes.func,
};

// ============================================
// COMPONENTE PRINCIPAL: VIRTUALIZED TABLE
// ============================================

/**
 * Tabla virtualizada premium
 *
 * @param {Array} data - Array de datos a mostrar
 * @param {Array} columns - Configuración de columnas
 * @param {number} rowHeight - Altura de cada fila (px)
 * @param {Function} onRowClick - Callback al hacer click en una fila
 * @param {Function} onSelectionChange - Callback cuando cambia la selección
 * @param {boolean} enableSelection - Habilitar selección múltiple
 * @param {string} emptyMessage - Mensaje cuando no hay datos
 */
export const VirtualizedTablePremium = ({
  data = [],
  columns = [],
  rowHeight = 60,
  onRowClick,
  onSelectionChange,
  enableSelection = true,
  emptyMessage = 'No hay datos disponibles',
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Filtrar datos según búsqueda
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((item) => {
      return columns.some((column) => {
        const value = item[column.key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, columns]);

  // Ordenar datos
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;

      const comparison = aValue > bValue ? 1 : -1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortConfig]);

  // Handle sorting
  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  // Handle selection
  const handleSelect = useCallback(
    (id) => {
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        onSelectionChange?.(Array.from(newSet));
        return newSet;
      });
    },
    [onSelectionChange]
  );

  // Select all
  const handleSelectAll = useCallback(() => {
    if (selectedItems.size === sortedData.length) {
      setSelectedItems(new Set());
      onSelectionChange?.([]);
    } else {
      const allIds = new Set(sortedData.map((item) => item.id));
      setSelectedItems(allIds);
      onSelectionChange?.(Array.from(allIds));
    }
  }, [sortedData, selectedItems, onSelectionChange]);

  // Export data
  const handleExport = useCallback(() => {
    const selectedData = sortedData.filter((item) => selectedItems.has(item.id));
    const dataToExport = selectedData.length > 0 ? selectedData : sortedData;

    // Convert to CSV
    const headers = columns.map((col) => col.label).join(',');
    const rows = dataToExport.map((item) => columns.map((col) => item[col.key]).join(','));
    const csv = [headers, ...rows].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `export_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [sortedData, selectedItems, columns]);

  return (
    <div className={`flex flex-col h-full bg-slate-900/50 rounded-xl overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-4 p-4 bg-white/5 border-b border-white/10">
        {/* Búsqueda */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar en tabla..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Botones de acción */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Filtros"
        >
          <Filter className="w-5 h-5" />
        </button>

        {enableSelection && (
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
          >
            {selectedItems.size === sortedData.length ? 'Deseleccionar' : 'Seleccionar'} todo
          </button>
        )}

        <button
          onClick={handleExport}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm flex items-center gap-2 transition-colors"
          disabled={sortedData.length === 0}
        >
          <Download className="w-4 h-4" />
          Exportar
        </button>
      </div>

      {/* Header de tabla */}
      <TableHeader
        columns={columns}
        sortConfig={sortConfig}
        onSort={handleSort}
        selectedCount={selectedItems.size}
        totalCount={sortedData.length}
      />

      {/* Tabla virtualizada */}
      <div className="flex-1">
        {sortedData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-400">{emptyMessage}</p>
          </div>
        ) : (
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                itemCount={sortedData.length}
                itemSize={rowHeight}
                width={width}
                itemData={{ items: sortedData }}
                overscanCount={5}
              >
                {({ index, style, data: listData }) => (
                  <TableRow
                    index={index}
                    style={style}
                    data={listData}
                    columns={columns}
                    isSelected={selectedItems.has(listData.items[index].id)}
                    onSelect={handleSelect}
                    onRowClick={onRowClick}
                  />
                )}
              </List>
            )}
          </AutoSizer>
        )}
      </div>

      {/* Footer con estadísticas */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-t border-white/10 text-sm text-slate-400">
        <div>
          Mostrando {sortedData.length} de {data.length} registros
        </div>
        {selectedItems.size > 0 && (
          <div className="text-cyan-400">{selectedItems.size} seleccionados</div>
        )}
      </div>
    </div>
  );
};

VirtualizedTablePremium.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  rowHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  onSelectionChange: PropTypes.func,
  enableSelection: PropTypes.bool,
  emptyMessage: PropTypes.string,
  className: PropTypes.string,
};

export default VirtualizedTablePremium;
