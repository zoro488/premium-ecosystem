import React from 'react';
import { motion } from 'framer-motion';

/**
 * 🎯 CHRONOS TABLE - Tabla premium con animaciones y efectos
 */
const ChronosTable = ({
  headers,
  data,
  onRowClick,
  renderCell,
  emptyMessage = 'No data available',
  hoverable = true,
  striped = false,
}) => {
  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 text-white/40"
      >
        {emptyMessage}
      </motion.div>
    );
  }

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full">
        {/* Header */}
        <thead>
          <tr className="border-b border-white/10">
            {headers.map((header, index) => (
              <motion.th
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="px-6 py-4 text-left text-xs font-light text-white/60 uppercase tracking-wider"
              >
                {header}
              </motion.th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {data.map((row, rowIndex) => (
            <motion.tr
              key={rowIndex}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: rowIndex * 0.03 }}
              whileHover={
                hoverable
                  ? {
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      scale: 1.01,
                    }
                  : {}
              }
              onClick={() => onRowClick?.(row)}
              className={`
                border-b border-white/5 transition-all cursor-pointer
                ${striped && rowIndex % 2 === 1 ? 'bg-white/[0.02]' : ''}
              `}
            >
              {headers.map((header, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 text-sm text-white/80">
                  {renderCell ? renderCell(row, header, cellIndex) : row[header]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * 🎯 CHRONOS TABLE CARD - Tabla envuelta en card con título
 */
export const ChronosTableCard = ({
  title,
  subtitle,
  icon: Icon,
  actions,
  children,
  ...tableProps
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {Icon && (
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="p-2 bg-white/5 rounded-sm"
            >
              <Icon className="w-5 h-5 text-white/70" />
            </motion.div>
          )}
          <div>
            <h3 className="text-lg font-light text-white tracking-wider">{title}</h3>
            {subtitle && <p className="text-xs text-white/40 mt-1">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">{children || <ChronosTable {...tableProps} />}</div>
    </motion.div>
  );
};

export default ChronosTable;
