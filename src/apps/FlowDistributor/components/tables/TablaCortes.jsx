// 📊 TABLA CORTES (RF ACTUAL)
// Tabla para mostrar cortes con RF Anterior y RF Actual
import { motion } from 'framer-motion';
import {
  Activity,
  Calendar,
  DollarSign,
  Scissors,
  Settings,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import {
  formatCurrency,
  formatDate,
  formatFrequency,
  formatRelativeDate,
} from '../../utils/formatters';

export const TablaCortes = ({
  cortes = [],
  loading = false,
  onRowClick = null,
  configuracion = null,
  onConfigClick = null,
}) => {
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

  // Calcular RF actual (último corte)
  const ultimoCorte = cortes.length > 0 ? cortes[cortes.length - 1] : null;
  const rfActual = ultimoCorte ? ultimoCorte.rfActual : 0;

  return (
    <div className="space-y-4">
      {/* Header con RF Actual y configuración */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* RF Actual */}
        <div className="backdrop-blur-xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/20">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-white/60 text-sm">RF Actual</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(rfActual)}</p>
                {ultimoCorte && (
                  <p className="text-white/40 text-xs mt-1">
                    Último corte: {formatRelativeDate(ultimoCorte.fecha)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Configuración */}
        {configuracion && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-white/5">
                  <Settings className="w-6 h-6 text-white/60" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Frecuencia</p>
                  <p className="text-lg font-bold text-white">
                    {formatFrequency(configuracion.frecuencia)}
                  </p>
                  {configuracion.automatico && configuracion.proximoCorte && (
                    <p className="text-white/40 text-xs mt-1">
                      Próximo: {formatDate(configuracion.proximoCorte)}
                    </p>
                  )}
                </div>
              </div>
              {onConfigClick && (
                <button
                  onClick={onConfigClick}
                  className="px-3 py-1.5 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-lg text-primary text-sm font-medium transition-all"
                >
                  Configurar
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Tabla */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {cortes.length === 0 ? (
          <div className="p-12 text-center">
            <Scissors className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-lg">No hay cortes registrados</p>
            <p className="text-white/40 text-sm mt-2">Los cortes de RF Actual aparecerán aquí</p>
          </div>
        ) : (
          <>
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
                    <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase tracking-wider">
                      <div className="flex items-center justify-end gap-2">
                        <DollarSign className="w-4 h-4" />
                        RF Anterior
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase tracking-wider">
                      Ingresos
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase tracking-wider">
                      Gastos
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase tracking-wider">
                      Transferencias
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase tracking-wider">
                      RF Actual
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase tracking-wider">
                      Diferencia
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-white/80 uppercase tracking-wider">
                      Tipo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cortes.map((corte, idx) => {
                    const diferencia = corte.diferencia || corte.rfActual - corte.rfAnterior;
                    const transferenciasneto =
                      (corte.totalTransferenciasEntrada || 0) -
                      (corte.totalTransferenciasSalida || 0);

                    return (
                      <motion.tr
                        key={corte.id || idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`
                          border-b border-white/5
                          hover:bg-white/5
                          transition-all duration-200
                          ${onRowClick ? 'cursor-pointer' : ''}
                        `}
                        onClick={() => onRowClick?.(corte)}
                        whileHover={onRowClick ? { scale: 1.01, x: 4 } : {}}
                      >
                        {/* Fecha */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-white text-sm font-medium">
                              {formatDate(corte.fecha)}
                            </span>
                            <span className="text-white/40 text-xs">
                              {formatRelativeDate(corte.fecha)}
                            </span>
                          </div>
                        </td>

                        {/* RF Anterior */}
                        <td className="px-6 py-4 text-right">
                          <span className="text-white/70 text-sm font-medium">
                            {formatCurrency(corte.rfAnterior || 0)}
                          </span>
                        </td>

                        {/* Ingresos */}
                        <td className="px-6 py-4 text-right">
                          <span className="text-success text-sm font-medium">
                            +{formatCurrency(corte.totalIngresos || 0)}
                          </span>
                        </td>

                        {/* Gastos */}
                        <td className="px-6 py-4 text-right">
                          <span className="text-error text-sm font-medium">
                            -{formatCurrency(corte.totalGastos || 0)}
                          </span>
                        </td>

                        {/* Transferencias */}
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`text-sm font-medium ${
                              transferenciasneto > 0
                                ? 'text-success'
                                : transferenciasneto < 0
                                  ? 'text-error'
                                  : 'text-white/60'
                            }`}
                          >
                            {transferenciasneto > 0 ? '+' : transferenciasneto < 0 ? '' : ''}
                            {formatCurrency(Math.abs(transferenciasneto))}
                          </span>
                        </td>

                        {/* RF Actual */}
                        <td className="px-6 py-4 text-right">
                          <span className="text-primary text-lg font-bold">
                            {formatCurrency(corte.rfActual || 0)}
                          </span>
                        </td>

                        {/* Diferencia */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {diferencia > 0 ? (
                              <>
                                <TrendingUp className="w-4 h-4 text-success" />
                                <span className="text-success text-sm font-bold">
                                  +{formatCurrency(diferencia)}
                                </span>
                              </>
                            ) : diferencia < 0 ? (
                              <>
                                <TrendingDown className="w-4 h-4 text-error" />
                                <span className="text-error text-sm font-bold">
                                  {formatCurrency(diferencia)}
                                </span>
                              </>
                            ) : (
                              <span className="text-white/40 text-sm">{formatCurrency(0)}</span>
                            )}
                          </div>
                        </td>

                        {/* Tipo */}
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              corte.tipo === 'AUTOMATICO'
                                ? 'bg-primary/20 text-primary border border-primary/30'
                                : 'bg-white/10 text-white/70 border border-white/20'
                            }`}
                          >
                            {corte.tipo || 'MANUAL'}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer con información */}
            <div className="px-6 py-4 bg-white/5 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">
                  Total de {cortes.length} {cortes.length === 1 ? 'corte' : 'cortes'}
                </span>
                {ultimoCorte && (
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-white/60 text-xs block">RF Actual</span>
                      <span className="text-primary text-xl font-bold">
                        {formatCurrency(ultimoCorte.rfActual)}
                      </span>
                    </div>
                    {cortes.length > 1 && (
                      <div className="text-right">
                        <span className="text-white/60 text-xs block">Variación Total</span>
                        <span
                          className={`text-lg font-bold ${
                            ultimoCorte.rfActual > 0
                              ? 'text-success'
                              : ultimoCorte.rfActual < 0
                                ? 'text-error'
                                : 'text-white'
                          }`}
                        >
                          {formatCurrency(ultimoCorte.rfActual)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TablaCortes;
