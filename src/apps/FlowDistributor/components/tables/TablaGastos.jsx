// 💸 TABLA GASTOS
// Tabla para mostrar gastos de una bóveda
import { motion } from 'framer-motion';
import { Calendar, DollarSign, FileText, Tag, TrendingDown, User } from 'lucide-react';

import { formatCurrency, formatDate, formatRelativeDate } from '../../utils/formatters';

export const TablaGastos = ({ gastos = [], loading = false, onRowClick = null }) => {
  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 flex items-center justify-center">
        <motion.div
          className="w-12 h-12 border-4 border-error/30 border-t-error rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (gastos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
      >
        <TrendingDown className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <p className="text-white/60 text-lg">No hay gastos registrados</p>
        <p className="text-white/40 text-sm mt-2">Los gastos aparecerán aquí cuando se registren</p>
      </motion.div>
    );
  }

  // Calcular total
  const totalGastos = gastos.reduce((sum, gasto) => sum + (gasto.monto || 0), 0);

  return (
    <div className="space-y-4">
      {/* Header con estadísticas */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-r from-error/20 to-error/10 border border-error/20 rounded-xl p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-error/20">
              <TrendingDown className="w-6 h-6 text-error" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Total Gastos</p>
              <p className="text-2xl font-bold text-error">{formatCurrency(totalGastos)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-sm">Registros</p>
            <p className="text-xl font-bold text-white">{gastos.length}</p>
          </div>
        </div>
      </motion.div>

      {/* Tabla */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Fecha
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Concepto
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Categoría
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Beneficiario
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase tracking-wider">
                  <div className="flex items-center justify-end gap-2">
                    <DollarSign className="w-4 h-4" />
                    Monto USD
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {gastos.map((gasto, idx) => (
                <motion.tr
                  key={gasto.id || idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`
                    border-b border-white/5
                    hover:bg-white/5
                    transition-all duration-200
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                  onClick={() => onRowClick?.(gasto)}
                  whileHover={onRowClick ? { scale: 1.01, x: 4 } : {}}
                >
                  {/* Fecha */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-medium">
                        {formatDate(gasto.fecha)}
                      </span>
                      <span className="text-white/40 text-xs">
                        {formatRelativeDate(gasto.fecha)}
                      </span>
                    </div>
                  </td>

                  {/* Concepto */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-medium">{gasto.concepto}</span>
                      {gasto.referencia && (
                        <span className="text-white/40 text-xs">Ref: {gasto.referencia}</span>
                      )}
                    </div>
                  </td>

                  {/* Categoría */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-error/20 text-error border border-error/30">
                      {gasto.categoria || 'OPERATIVO'}
                    </span>
                  </td>

                  {/* Beneficiario */}
                  <td className="px-6 py-4">
                    <span className="text-white/70 text-sm">{gasto.beneficiario || '-'}</span>
                  </td>

                  {/* Monto */}
                  <td className="px-6 py-4 text-right">
                    <span className="text-error text-lg font-bold">
                      -{formatCurrency(gasto.monto)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer con totales */}
        <div className="px-6 py-4 bg-white/5 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">
              Total de {gastos.length} {gastos.length === 1 ? 'gasto' : 'gastos'}
            </span>
            <div className="text-right">
              <span className="text-white/60 text-sm block">Total</span>
              <span className="text-error text-xl font-bold">-{formatCurrency(totalGastos)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaGastos;
