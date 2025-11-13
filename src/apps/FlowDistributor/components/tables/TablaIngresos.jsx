// 💰 TABLA INGRESOS
// Tabla para mostrar ingresos de una bóveda
import { motion } from 'framer-motion';
import { Calendar, DollarSign, FileText, Tag, TrendingUp } from 'lucide-react';

import { formatCurrency, formatDate, formatRelativeDate } from '../../utils/formatters';

export const TablaIngresos = ({ ingresos = [], loading = false, onRowClick = null }) => {
  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 flex items-center justify-center">
        <motion.div
          className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (ingresos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
      >
        <TrendingUp className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <p className="text-white/60 text-lg">No hay ingresos registrados</p>
        <p className="text-white/40 text-sm mt-2">
          Los ingresos aparecerán aquí cuando se registren
        </p>
      </motion.div>
    );
  }

  // Calcular total
  const totalIngresos = ingresos.reduce((sum, ing) => sum + (ing.monto || 0), 0);

  return (
    <div className="space-y-4">
      {/* Header con estadísticas */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-r from-success/20 to-success/10 border border-success/20 rounded-xl p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-success/20">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Total Ingresos</p>
              <p className="text-2xl font-bold text-success">{formatCurrency(totalIngresos)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-sm">Registros</p>
            <p className="text-xl font-bold text-white">{ingresos.length}</p>
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
                <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase tracking-wider">
                  <div className="flex items-center justify-end gap-2">
                    <DollarSign className="w-4 h-4" />
                    Monto USD
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {ingresos.map((ingreso, idx) => (
                <motion.tr
                  key={ingreso.id || idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`
                    border-b border-white/5
                    hover:bg-white/5
                    transition-all duration-200
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                  onClick={() => onRowClick?.(ingreso)}
                  whileHover={onRowClick ? { scale: 1.01, x: 4 } : {}}
                >
                  {/* Fecha */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-medium">
                        {formatDate(ingreso.fecha)}
                      </span>
                      <span className="text-white/40 text-xs">
                        {formatRelativeDate(ingreso.fecha)}
                      </span>
                    </div>
                  </td>

                  {/* Concepto */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-medium">{ingreso.concepto}</span>
                      {ingreso.referencia && (
                        <span className="text-white/40 text-xs">Ref: {ingreso.referencia}</span>
                      )}
                    </div>
                  </td>

                  {/* Categoría */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success/20 text-success border border-success/30">
                      {ingreso.categoria || 'GENERAL'}
                    </span>
                  </td>

                  {/* Monto */}
                  <td className="px-6 py-4 text-right">
                    <span className="text-success text-lg font-bold">
                      +{formatCurrency(ingreso.monto)}
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
              Total de {ingresos.length} {ingresos.length === 1 ? 'ingreso' : 'ingresos'}
            </span>
            <div className="text-right">
              <span className="text-white/60 text-sm block">Total</span>
              <span className="text-success text-xl font-bold">
                {formatCurrency(totalIngresos)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaIngresos;
