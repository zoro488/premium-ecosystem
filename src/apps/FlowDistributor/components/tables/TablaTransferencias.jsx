// 🔄 TABLA TRANSFERENCIAS
// Tabla para mostrar transferencias entre bóvedas (NUEVA FUNCIONALIDAD)
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowRightLeft,
  Calendar,
  CheckCircle,
  DollarSign,
  XCircle,
} from 'lucide-react';

import {
  formatBovedaName,
  formatCurrency,
  formatCurrencyMXN,
  formatDate,
  formatRelativeDate,
} from '../../utils/formatters';

export const TablaTransferencias = ({
  transferencias = [],
  bovedaId = null,
  loading = false,
  onRowClick = null,
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

  if (transferencias.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
      >
        <ArrowRightLeft className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <p className="text-white/60 text-lg">No hay transferencias registradas</p>
        <p className="text-white/40 text-sm mt-2">
          Las transferencias entre bóvedas aparecerán aquí
        </p>
      </motion.div>
    );
  }

  // Calcular totales
  const transferenciasEntrada = transferencias.filter((t) =>
    bovedaId ? t.destinoBoveda === bovedaId : false
  );
  const transferenciasSalida = transferencias.filter((t) =>
    bovedaId ? t.origenBoveda === bovedaId : false
  );

  const totalEntrada = transferenciasEntrada.reduce((sum, t) => sum + (t.montoUSD || 0), 0);
  const totalSalida = transferenciasSalida.reduce((sum, t) => sum + (t.montoUSD || 0), 0);

  return (
    <div className="space-y-4">
      {/* Header con estadísticas */}
      {bovedaId && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          {/* Entradas */}
          <div className="backdrop-blur-xl bg-gradient-to-r from-success/20 to-success/10 border border-success/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-success/20">
                <ArrowRight className="w-6 h-6 text-success rotate-180" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Transferencias Entrada</p>
                <p className="text-xl font-bold text-success">+{formatCurrency(totalEntrada)}</p>
                <p className="text-white/40 text-xs">{transferenciasEntrada.length} registros</p>
              </div>
            </div>
          </div>

          {/* Salidas */}
          <div className="backdrop-blur-xl bg-gradient-to-r from-error/20 to-error/10 border border-error/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-error/20">
                <ArrowRight className="w-6 h-6 text-error" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Transferencias Salida</p>
                <p className="text-xl font-bold text-error">-{formatCurrency(totalSalida)}</p>
                <p className="text-white/40 text-xs">{transferenciasSalida.length} registros</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

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
                    <ArrowRightLeft className="w-4 h-4" />
                    Dirección
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">
                  Concepto
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase tracking-wider">
                  <div className="flex items-center justify-end gap-2">
                    <DollarSign className="w-4 h-4" />
                    Monto USD
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase tracking-wider">
                  Monto MXN
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-white/80 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {transferencias.map((transferencia, idx) => {
                const esEntrada = bovedaId ? transferencia.destinoBoveda === bovedaId : false;
                const esSalida = bovedaId ? transferencia.origenBoveda === bovedaId : false;

                return (
                  <motion.tr
                    key={transferencia.id || idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`
                      border-b border-white/5
                      hover:bg-white/5
                      transition-all duration-200
                      ${onRowClick ? 'cursor-pointer' : ''}
                    `}
                    onClick={() => onRowClick?.(transferencia)}
                    whileHover={onRowClick ? { scale: 1.01, x: 4 } : {}}
                  >
                    {/* Fecha */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-medium">
                          {formatDate(transferencia.fecha)}
                        </span>
                        <span className="text-white/40 text-xs">
                          {formatRelativeDate(transferencia.fecha)}
                        </span>
                      </div>
                    </td>

                    {/* Dirección */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${
                            esEntrada ? 'text-success' : esSalida ? 'text-error' : 'text-white/70'
                          }`}
                        >
                          {formatBovedaName(transferencia.origenBoveda)}
                        </span>
                        <ArrowRight className="w-4 h-4 text-primary" />
                        <span
                          className={`text-sm font-medium ${
                            esEntrada ? 'text-success' : esSalida ? 'text-error' : 'text-white/70'
                          }`}
                        >
                          {formatBovedaName(transferencia.destinoBoveda)}
                        </span>
                      </div>
                      {transferencia.tipoConversion && (
                        <span className="text-white/40 text-xs block mt-1">
                          Tipo: {transferencia.tipoConversion}
                        </span>
                      )}
                    </td>

                    {/* Concepto */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white text-sm">{transferencia.concepto}</span>
                        {transferencia.tipoCambioAplicado && (
                          <span className="text-white/40 text-xs">
                            TC: {transferencia.tipoCambioAplicado.toFixed(4)} MXN/USD
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Monto USD */}
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`text-lg font-bold ${
                          esEntrada ? 'text-success' : esSalida ? 'text-error' : 'text-white'
                        }`}
                      >
                        {esEntrada ? '+' : esSalida ? '-' : ''}
                        {formatCurrency(transferencia.montoUSD)}
                      </span>
                    </td>

                    {/* Monto MXN */}
                    <td className="px-6 py-4 text-right">
                      <span className="text-white/60 text-sm">
                        {formatCurrencyMXN(transferencia.montoMXN || 0)}
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4 text-center">
                      {transferencia.estatus === 'COMPLETADA' ? (
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success/20 text-success text-xs font-medium border border-success/30">
                          <CheckCircle className="w-3 h-3" />
                          Completada
                        </div>
                      ) : transferencia.estatus === 'CANCELADA' ? (
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-error/20 text-error text-xs font-medium border border-error/30">
                          <XCircle className="w-3 h-3" />
                          Cancelada
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-warning/20 text-warning text-xs font-medium border border-warning/30">
                          Pendiente
                        </div>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer con totales */}
        <div className="px-6 py-4 bg-white/5 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">
              Total de {transferencias.length}{' '}
              {transferencias.length === 1 ? 'transferencia' : 'transferencias'}
            </span>
            {bovedaId && (
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-white/60 text-xs block">Entrada</span>
                  <span className="text-success text-lg font-bold">
                    +{formatCurrency(totalEntrada)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-white/60 text-xs block">Salida</span>
                  <span className="text-error text-lg font-bold">
                    -{formatCurrency(totalSalida)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-white/60 text-xs block">Neto</span>
                  <span
                    className={`text-lg font-bold ${
                      totalEntrada - totalSalida > 0
                        ? 'text-success'
                        : totalEntrada - totalSalida < 0
                          ? 'text-error'
                          : 'text-white'
                    }`}
                  >
                    {formatCurrency(totalEntrada - totalSalida)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaTransferencias;
