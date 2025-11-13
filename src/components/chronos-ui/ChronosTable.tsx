import React from 'react';
import { motion } from 'framer-motion';

interface Column {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

interface ChronosTableProps {
  columns: Column[];
  data: any[];
  maxHeight?: string;
  striped?: boolean;
  hoverable?: boolean;
  emptyMessage?: string;
}

const ChronosTable: React.FC<ChronosTableProps> = ({
  columns,
  data,
  maxHeight = '500px',
  striped = true,
  hoverable = true,
  emptyMessage = 'No hay datos disponibles',
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <p className="text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-chronos-border">
      <div
        className="overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
        style={{ maxHeight }}
      >
        <table className="w-full">
          {/* Header */}
          <thead className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key}
                  className={`
                    px-6 py-4 text-xs font-semibold tracking-wider uppercase
                    border-b border-chronos-border text-gray-300
                    text-${col.align || 'left'}
                  `}
                  style={{ width: col.width }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    {col.label}
                  </motion.div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {data.map((row, rowIdx) => (
              <motion.tr
                key={rowIdx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: rowIdx * 0.02 }}
                className={`
                  border-b border-chronos-border/30
                  ${striped && rowIdx % 2 === 0 ? 'bg-white/[0.02]' : ''}
                  ${hoverable ? 'hover:bg-white/[0.05] transition-colors duration-200' : ''}
                `}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`
                      px-6 py-4 text-sm text-gray-300
                      text-${col.align || 'left'}
                    `}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChronosTable;
