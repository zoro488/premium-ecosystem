/**
 * 📊 TABLA DE VENTAS ACTIVAS - ULTRA PREMIUM
 * Tabla completa con TanStack Table para ventas reales
 */
import { useMemo } from 'react';

import { motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  TrendingUp,
  Truck,
  User,
} from 'lucide-react';
import PropTypes from 'prop-types';

const VentasActivasTable = ({ data, formatCurrency, showValues }) => {
  // Get status color and icon
  const getStatusDisplay = (estatus) => {
    const status = estatus.toLowerCase();
    switch (status) {
      case 'pagado':
        return {
          color: 'text-zinc-200',
          bgColor: 'bg-zinc-9000/10',
          borderColor: 'border-zinc-500/20',
          icon: CheckCircle,
        };
      case 'pendiente':
        return {
          color: 'text-zinc-200',
          bgColor: 'bg-zinc-9000/10',
          borderColor: 'border-zinc-500/20',
          icon: Clock,
        };
      case 'parcial':
        return {
          color: 'text-zinc-200',
          bgColor: 'bg-zinc-9000/10',
          borderColor: 'border-zinc-500/20',
          icon: AlertCircle,
        };
      default:
        return {
          color: 'text-slate-400',
          bgColor: 'bg-slate-500/10',
          borderColor: 'border-slate-500/20',
          icon: AlertCircle,
        };
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="overflow-x-auto">
      <motion.table
        className="w-full"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: 0.05 },
          },
        }}
      >
        {/* HEADER */}
        <thead className="border-b border-white/10">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Fecha
              </div>
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Cliente
              </div>
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                OC / Cantidad
              </div>
            </th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">
              <div className="flex items-center justify-end gap-2">
                <DollarSign className="w-4 h-4" />
                Ingreso
              </div>
            </th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">
              <div className="flex items-center justify-end gap-2">
                <Truck className="w-4 h-4" />
                Flete
              </div>
            </th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">
              <div className="flex items-center justify-end gap-2">
                <TrendingUp className="w-4 h-4" />
                Utilidad
              </div>
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Estado</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                No se encontraron ventas con los filtros aplicados
              </td>
            </tr>
          ) : (
            data.map((venta, index) => {
              const statusDisplay = getStatusDisplay(venta.estatus);
              const StatusIcon = statusDisplay.icon;

              return (
                <motion.tr
                  key={`venta-${index}`}
                  variants={itemVariants}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                  whileHover={{ scale: 1.01 }}
                >
                  {/* Fecha */}
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {new Date(venta.fecha).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>

                  {/* Cliente */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-white group-hover:text-zinc-200 transition-colors">
                      {venta.cliente}
                    </div>
                    {venta.concepto && (
                      <div className="text-xs text-slate-400 mt-1">{venta.concepto}</div>
                    )}
                  </td>

                  {/* OC / Cantidad */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-300">{venta.ocRelacionada || 'N/A'}</div>
                    <div className="text-xs text-slate-400">{venta.cantidad} unidades</div>
                  </td>

                  {/* Ingreso */}
                  <td className="px-6 py-4 text-right">
                    <div className="font-bold text-white">
                      {showValues ? formatCurrency(venta.ingreso) : '••••••'}
                    </div>
                    {venta.precioVenta && (
                      <div className="text-xs text-slate-400">${venta.precioVenta}/u</div>
                    )}
                  </td>

                  {/* Flete */}
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm text-slate-300">
                      {showValues ? formatCurrency(venta.fleteUtilidad || 0) : '••••'}
                    </div>
                    {venta.flete && <div className="text-xs text-slate-400">{venta.flete}</div>}
                  </td>

                  {/* Utilidad */}
                  <td className="px-6 py-4 text-right">
                    <div
                      className={`font-semibold ${venta.utilidad > 0 ? 'text-zinc-200' : 'text-slate-400'}`}
                    >
                      {showValues ? formatCurrency(venta.utilidad || 0) : '••••'}
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      <div
                        className={`
                        px-3 py-1.5 rounded-full
                        ${statusDisplay.bgColor}
                        ${statusDisplay.borderColor}
                        border
                        flex items-center gap-2
                      `}
                      >
                        <StatusIcon className={`w-3 h-3 ${statusDisplay.color}`} />
                        <span className={`text-xs font-medium ${statusDisplay.color}`}>
                          {venta.estatus}
                        </span>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              );
            })
          )}
        </tbody>
      </motion.table>

      {/* FOOTER con totales */}
      {data.length > 0 && (
        <motion.div
          className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl"
          variants={itemVariants}
        >
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-sm text-slate-400 mb-1">Total Ventas</div>
              <div className="text-xl font-bold text-white">{data.length}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">Ingresos Totales</div>
              <div className="text-xl font-bold text-zinc-200">
                {showValues
                  ? formatCurrency(data.reduce((sum, v) => sum + v.ingreso, 0))
                  : '••••••••'}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">Flete Total</div>
              <div className="text-xl font-bold text-zinc-200">
                {showValues
                  ? formatCurrency(data.reduce((sum, v) => sum + (v.fleteUtilidad || 0), 0))
                  : '••••••••'}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">Utilidad Total</div>
              <div className="text-xl font-bold text-zinc-200">
                {showValues
                  ? formatCurrency(data.reduce((sum, v) => sum + (v.utilidad || 0), 0))
                  : '••••••••'}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

VentasActivasTable.propTypes = {
  data: PropTypes.array.isRequired,
  formatCurrency: PropTypes.func.isRequired,
  showValues: PropTypes.bool,
};

VentasActivasTable.defaultProps = {
  showValues: true,
};

export default VentasActivasTable;
