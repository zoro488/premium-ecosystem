// 💰 TABLA VENTAS
// Tabla de ventas con opción de marcar como pagadas
import { memo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  Package,
  TrendingUp,
  Truck,
  User,
} from 'lucide-react';

import { useVentas } from '../../hooks/useVentas';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { PremiumModal } from '../PremiumModal';

export const TablaVentas = memo(
  ({ ventas, loading, onMarcarPagada }) => {
    const { marcarComoPagada, loading: loadingPago } = useVentas();
    const [ventaExpandida, setVentaExpandida] = useState(null);
    const [modalPago, setModalPago] = useState(null);
    const [montoPago, setMontoPago] = useState('');

    const handleMarcarPagada = async () => {
      if (!modalPago) return;

      const monto = parseFloat(montoPago) || modalPago.totalCliente;

      const result = await marcarComoPagada(modalPago.id, modalPago.clienteId, monto);

      if (result.success) {
        setModalPago(null);
        setMontoPago('');
        onMarcarPagada?.();
      }
    };

    if (loading) {
      return (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <motion.div
              className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-white/60">Cargando ventas...</p>
          </div>
        </div>
      );
    }

    if (!ventas || ventas.length === 0) {
      return (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <Package className="w-16 h-16 text-white/20" />
            <div className="text-center">
              <p className="text-white/80 font-medium mb-1">No hay ventas registradas</p>
              <p className="text-white/40 text-sm">Las ventas aparecerán aquí</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-white/60 font-medium text-sm"></th>
                  <th className="text-left p-4 text-white/60 font-medium text-sm">Fecha</th>
                  <th className="text-left p-4 text-white/60 font-medium text-sm">Cliente</th>
                  <th className="text-left p-4 text-white/60 font-medium text-sm">OC</th>
                  <th className="text-center p-4 text-white/60 font-medium text-sm">Cantidad</th>
                  <th className="text-right p-4 text-white/60 font-medium text-sm">Precio/u</th>
                  <th className="text-right p-4 text-white/60 font-medium text-sm">
                    Total Cliente
                  </th>
                  <th className="text-right p-4 text-white/60 font-medium text-sm">Utilidad</th>
                  <th className="text-center p-4 text-white/60 font-medium text-sm">Estatus</th>
                  <th className="text-center p-4 text-white/60 font-medium text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((venta, index) => (
                  <motion.tr
                    key={venta.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-all"
                  >
                    {/* Expandir */}
                    <td className="p-4">
                      <button
                        onClick={() =>
                          setVentaExpandida(ventaExpandida === venta.id ? null : venta.id)
                        }
                        className="p-1 hover:bg-white/10 rounded transition-all"
                      >
                        {ventaExpandida === venta.id ? (
                          <ChevronDown className="w-4 h-4 text-white/60" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-white/60" />
                        )}
                      </button>
                    </td>

                    {/* Fecha */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-white/40" />
                        <span className="text-white/80 text-sm">{formatDate(venta.fecha)}</span>
                      </div>
                    </td>

                    {/* Cliente */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-white/40" />
                        <span className="text-white font-medium">{venta.clienteNombre}</span>
                      </div>
                    </td>

                    {/* OC */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-primary/60" />
                        <span className="text-primary text-sm font-mono">{venta.ocCodigo}</span>
                      </div>
                    </td>

                    {/* Cantidad */}
                    <td className="p-4 text-center">
                      <span className="text-white font-bold">{venta.cantidad}</span>
                      <span className="text-white/40 text-xs ml-1">u</span>
                    </td>

                    {/* Precio/u */}
                    <td className="p-4 text-right">
                      <span className="text-white/80 font-mono text-sm">
                        {formatCurrency(venta.precioVenta)}
                      </span>
                    </td>

                    {/* Total Cliente */}
                    <td className="p-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-white font-bold">
                          {formatCurrency(venta.totalCliente)}
                        </span>
                        {venta.aplicaFlete && (
                          <div className="flex items-center gap-1 text-xs text-primary">
                            <Truck className="w-3 h-3" />
                            <span>+Flete</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Utilidad */}
                    <td className="p-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-success font-bold">
                          {formatCurrency(venta.utilidadNeta)}
                        </span>
                        <span className="text-success/60 text-xs">{venta.margen?.toFixed(1)}%</span>
                      </div>
                    </td>

                    {/* Estatus */}
                    <td className="p-4">
                      <div className="flex justify-center">
                        {venta.estatus === 'PAGADA' ? (
                          <div className="px-3 py-1 rounded-full bg-success/20 border border-success/30 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-success" />
                            <span className="text-success text-xs font-medium">PAGADO</span>
                          </div>
                        ) : (
                          <div className="px-3 py-1 rounded-full bg-warning/20 border border-warning/30 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-warning" />
                            <span className="text-warning text-xs font-medium">PENDIENTE</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="p-4">
                      <div className="flex justify-center">
                        {venta.estatus === 'PENDIENTE' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setModalPago(venta);
                              setMontoPago(venta.totalCliente.toString());
                            }}
                            className="px-3 py-1 bg-gradient-to-r from-success/20 to-success/30 hover:from-success/30 hover:to-success/40 border border-success/30 rounded-lg text-success text-sm font-medium shadow-lg shadow-success/10 transition-all flex items-center gap-1"
                          >
                            <CreditCard className="w-3 h-3" />
                            Marcar Pagado
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detalles expandidos */}
          <AnimatePresence>
            {ventas.map(
              (venta) =>
                ventaExpandida === venta.id && (
                  <motion.div
                    key={`expand-${venta.id}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-white/10 bg-white/5 p-6"
                  >
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Distribución Calculada
                    </h4>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="backdrop-blur-md bg-white/5 rounded-lg p-4 border border-white/10">
                        <p className="text-white/60 text-xs mb-2">Bóveda Monte</p>
                        <p className="text-white text-lg font-bold">
                          {formatCurrency(
                            venta.distribucionCalculada?.bovedaMonte || venta.costoBovedaMonte
                          )}
                        </p>
                        <p className="text-white/40 text-xs mt-1">Recuperar costo</p>
                      </div>

                      <div className="backdrop-blur-md bg-white/5 rounded-lg p-4 border border-white/10">
                        <p className="text-white/60 text-xs mb-2">Utilidades</p>
                        <p className="text-success text-lg font-bold">
                          {formatCurrency(
                            venta.distribucionCalculada?.utilidades || venta.utilidadNeta
                          )}
                        </p>
                        <p className="text-white/40 text-xs mt-1">Ganancia neta</p>
                      </div>

                      <div className="backdrop-blur-md bg-white/5 rounded-lg p-4 border border-white/10">
                        <p className="text-white/60 text-xs mb-2">Flete Sur</p>
                        <p className="text-primary text-lg font-bold">
                          {formatCurrency(
                            venta.distribucionCalculada?.fleteSur || venta.costoFlete || 0
                          )}
                        </p>
                        <p className="text-white/40 text-xs mt-1">
                          {venta.aplicaFlete ? 'Aplicado' : 'No aplica'}
                        </p>
                      </div>
                    </div>

                    {venta.concepto && (
                      <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-white/60 text-xs mb-1">Concepto:</p>
                        <p className="text-white/80 text-sm">{venta.concepto}</p>
                      </div>
                    )}

                    {venta.estatus === 'PAGADA' && venta.fechaPago && (
                      <div className="mt-4 p-3 rounded-lg bg-success/10 border border-success/20">
                        <p className="text-success text-sm flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Pagado el {formatDate(venta.fechaPago)}
                          {venta.montoPagado && ` - ${formatCurrency(venta.montoPagado)}`}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </div>

        {/* Modal de confirmación de pago */}
        <PremiumModal
          isOpen={!!modalPago}
          onClose={() => setModalPago(null)}
          title="Marcar Venta como Pagada"
        >
          {modalPago && (
            <div className="space-y-6">
              <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/60 mb-1">Cliente</p>
                    <p className="text-white font-medium">{modalPago.clienteNombre}</p>
                  </div>
                  <div>
                    <p className="text-white/60 mb-1">OC</p>
                    <p className="text-primary font-mono">{modalPago.ocCodigo}</p>
                  </div>
                  <div>
                    <p className="text-white/60 mb-1">Cantidad</p>
                    <p className="text-white">{modalPago.cantidad} unidades</p>
                  </div>
                  <div>
                    <p className="text-white/60 mb-1">Total a Pagar</p>
                    <p className="text-white font-bold">{formatCurrency(modalPago.totalCliente)}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Monto Pagado (USD)
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <DollarSign className="w-5 h-5 text-success/60" />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    value={montoPago}
                    onChange={(e) => setMontoPago(e.target.value)}
                    className="w-full backdrop-blur-md bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-xl font-bold focus:outline-none focus:border-success/50 focus:ring-2 focus:ring-success/20 transition-all"
                  />
                </div>
                <p className="text-white/40 text-xs mt-1">
                  Monto esperado: {formatCurrency(modalPago.totalCliente)}
                </p>
              </div>

              <div className="backdrop-blur-md bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-4">
                <p className="text-white font-medium mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-primary" />
                  Al confirmar el pago se distribuirá:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Bóveda Monte (costo):</span>
                    <span className="text-white font-mono">
                      {formatCurrency(
                        modalPago.distribucionCalculada?.bovedaMonte || modalPago.costoBovedaMonte
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Utilidades (ganancia):</span>
                    <span className="text-success font-mono">
                      {formatCurrency(
                        modalPago.distribucionCalculada?.utilidades || modalPago.utilidadNeta
                      )}
                    </span>
                  </div>
                  {modalPago.aplicaFlete && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Flete Sur:</span>
                      <span className="text-primary font-mono">
                        {formatCurrency(
                          modalPago.distribucionCalculada?.fleteSur || modalPago.costoFlete
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setModalPago(null)}
                  disabled={loadingPago}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleMarcarPagada}
                  disabled={loadingPago || !montoPago || parseFloat(montoPago) <= 0}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-success/20 to-success/30 hover:from-success/30 hover:to-success/40 border border-success/30 rounded-lg text-white font-medium shadow-lg shadow-success/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loadingPago ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Confirmar Pago
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </PremiumModal>
      </>
    );
  },
  (prevProps, nextProps) => {
    // Solo re-render si ventas, loading o onMarcarPagada cambian
    return (
      prevProps.ventas === nextProps.ventas &&
      prevProps.loading === nextProps.loading &&
      prevProps.onMarcarPagada === nextProps.onMarcarPagada
    );
  }
);

TablaVentas.displayName = 'TablaVentas';

export default TablaVentas;
