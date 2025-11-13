/**
 * 🎯 PERFIL CLIENTE - PANEL COMPLETO
 *
 * Panel premium con historial de ventas, gestión de adeudos y estadísticas
 * - Historial de ventas del cliente
 * - Gestión de adeudos con FormAbonoCliente integrado
 * - Historial de pagos/abonos
 * - Estadísticas y gráficas
 * - UI glassmorphism premium
 */

import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    BarChart3,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    DollarSign,
    Mail,
    MapPin,
    Phone,
    Receipt,
    ShoppingCart,
    TrendingUp,
    User,
    Wallet,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { AbonoCliente, Cliente, Venta } from '../types';
import FormAbonoCliente from './FormAbonoCliente';

interface PerfilClienteProps {
  cliente: Cliente;
  ventas: Venta[];
  abonos: AbonoCliente[];
  bancosDisponibles: any[];
  onClose: () => void;
  onAbonoRegistrado: (abono: any) => Promise<void>;
  onClienteActualizado?: (cliente: Cliente) => void;
}

type Tab = 'ventas' | 'abonos' | 'estadisticas';

export default function PerfilCliente({
  cliente,
  ventas,
  abonos,
  bancosDisponibles,
  onClose,
  onAbonoRegistrado,
}: PerfilClienteProps) {
  const [tabActual, setTabActual] = useState<Tab>('ventas');
  const [mostrarFormAbono, setMostrarFormAbono] = useState(false);

  // ============================================================================
  // CÁLCULOS Y ESTADÍSTICAS
  // ============================================================================

  const stats = useMemo(() => {
    const totalVentas = ventas.length;
    const montoTotalVendido = ventas.reduce((sum, v) => sum + (v.montoTotal || 0), 0);
    const totalAbonos = abonos.reduce((sum, a) => sum + (a.montoAbono || 0), 0);
    const adeudoActual = cliente.adeudo || 0;
    const ventasCredito = ventas.filter(v => v.tipoPago === 'credito').length;
    const ultimaCompra = ventas.length > 0 ? ventas[0].fechaVenta : null;

    return {
      totalVentas,
      montoTotalVendido,
      totalAbonos,
      adeudoActual,
      ventasCredito,
      promedioCompra: totalVentas > 0 ? montoTotalVendido / totalVentas : 0,
      ultimaCompra,
    };
  }, [ventas, abonos, cliente.adeudo]);

  const tieneAdeudo = stats.adeudoActual > 0;

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleAbonoGuardado = async (data: any) => {
    await onAbonoRegistrado(data);
    setMostrarFormAbono(false);
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-7xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900/20 rounded-2xl border border-white/10 shadow-2xl"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <User className="text-white" size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{cliente.nombre}</h2>
                  <div className="flex items-center gap-4 mt-2 text-white/80 text-sm">
                    {cliente.email && (
                      <span className="flex items-center gap-1">
                        <Mail size={14} />
                        {cliente.email}
                      </span>
                    )}
                    {cliente.telefono && (
                      <span className="flex items-center gap-1">
                        <Phone size={14} />
                        {cliente.telefono}
                      </span>
                    )}
                  </div>
                  {cliente.direccion && (
                    <div className="flex items-center gap-1 mt-1 text-white/60 text-xs">
                      <MapPin size={12} />
                      {cliente.direccion}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="text-white/60" size={16} />
                  <span className="text-white/60 text-xs">Total Ventas</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.totalVentas}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-white/60" size={16} />
                  <span className="text-white/60 text-xs">Monto Total</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  ${stats.montoTotalVendido.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-white/60" size={16} />
                  <span className="text-white/60 text-xs">Promedio Compra</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  ${stats.promedioCompra.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                </p>
              </div>

              <div className={`backdrop-blur-sm rounded-lg p-4 border ${
                tieneAdeudo
                  ? 'bg-red-500/20 border-red-500/30'
                  : 'bg-green-500/20 border-green-500/30'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className={tieneAdeudo ? 'text-red-400' : 'text-green-400'} size={16} />
                  <span className="text-white/60 text-xs">Adeudo Actual</span>
                </div>
                <p className={`text-2xl font-bold ${tieneAdeudo ? 'text-red-400' : 'text-green-400'}`}>
                  ${stats.adeudoActual.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-slate-800/50 border-b border-white/10 px-6">
            <div className="flex gap-2">
              <button
                onClick={() => setTabActual('ventas')}
                className={`px-6 py-3 font-medium transition-all relative ${
                  tabActual === 'ventas'
                    ? 'text-purple-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <ShoppingCart size={16} className="inline mr-2" />
                Ventas ({stats.totalVentas})
                {tabActual === 'ventas' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                  />
                )}
              </button>

              <button
                onClick={() => setTabActual('abonos')}
                className={`px-6 py-3 font-medium transition-all relative ${
                  tabActual === 'abonos'
                    ? 'text-purple-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Receipt size={16} className="inline mr-2" />
                Abonos ({abonos.length})
                {tabActual === 'abonos' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                  />
                )}
              </button>

              <button
                onClick={() => setTabActual('estadisticas')}
                className={`px-6 py-3 font-medium transition-all relative ${
                  tabActual === 'estadisticas'
                    ? 'text-purple-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <BarChart3 size={16} className="inline mr-2" />
                Estadísticas
                {tabActual === 'estadisticas' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                  />
                )}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 overflow-y-auto max-h-[calc(95vh-280px)]">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {/* Tab: Ventas */}
                {tabActual === 'ventas' && (
                  <motion.div
                    key="ventas"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    {ventas.length === 0 ? (
                      <div className="text-center py-12 text-white/40">
                        <ShoppingCart size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No hay ventas registradas</p>
                      </div>
                    ) : (
                      ventas.map((venta, idx) => (
                        <motion.div
                          key={venta.id || idx}
                          className="bg-slate-800/50 border border-white/10 rounded-lg p-4 hover:border-purple-500/30 transition-all"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-white font-semibold">
                                  Venta #{venta.numeroVenta || venta.id}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  venta.tipoPago === 'credito'
                                    ? 'bg-orange-500/20 text-orange-400'
                                    : 'bg-green-500/20 text-green-400'
                                }`}>
                                  {venta.tipoPago === 'credito' ? 'Crédito' : 'Contado'}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  venta.estadoPago === 'pagado'
                                    ? 'bg-green-500/20 text-green-400'
                                    : venta.estadoPago === 'parcial'
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {venta.estadoPago}
                                </span>
                              </div>
                              <div className="text-sm text-white/60 space-y-1">
                                <div className="flex items-center gap-2">
                                  <Calendar size={14} />
                                  {venta.fechaVenta instanceof Date
                                    ? venta.fechaVenta.toLocaleDateString('es-MX')
                                    : new Date(venta.fechaVenta).toLocaleDateString('es-MX')}
                                </div>
                                {venta.productos && (
                                  <div>
                                    {venta.productos.length} producto(s)
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-white">
                                ${venta.montoTotal?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                              </p>
                              {venta.montoPendiente > 0 && (
                                <p className="text-sm text-red-400 mt-1">
                                  Pendiente: ${venta.montoPendiente.toLocaleString('es-MX')}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}

                {/* Tab: Abonos */}
                {tabActual === 'abonos' && (
                  <motion.div
                    key="abonos"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    {abonos.length === 0 ? (
                      <div className="text-center py-12 text-white/40">
                        <Receipt size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No hay abonos registrados</p>
                      </div>
                    ) : (
                      abonos.map((abono, idx) => (
                        <motion.div
                          key={abono.id || idx}
                          className="bg-slate-800/50 border border-white/10 rounded-lg p-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <CheckCircle className="text-green-400" size={20} />
                                <span className="text-white font-semibold">
                                  Abono #{abono.id || idx + 1}
                                </span>
                                <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">
                                  {abono.metodoPago}
                                </span>
                              </div>
                              <div className="text-sm text-white/60 space-y-1">
                                <div className="flex items-center gap-2">
                                  <Calendar size={14} />
                                  {abono.fechaPago instanceof Date
                                    ? abono.fechaPago.toLocaleDateString('es-MX')
                                    : new Date(abono.fechaPago).toLocaleDateString('es-MX')}
                                </div>
                                {abono.referenciaPago && (
                                  <div className="text-xs">
                                    Ref: {abono.referenciaPago}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-400">
                                +${abono.montoAbono.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}

                {/* Tab: Estadísticas */}
                {tabActual === 'estadisticas' && (
                  <motion.div
                    key="estadisticas"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <CreditCard className="text-purple-400" size={20} />
                          <span className="text-white/60">Ventas a Crédito</span>
                        </div>
                        <p className="text-4xl font-bold text-white mb-2">{stats.ventasCredito}</p>
                        <p className="text-sm text-white/40">
                          {stats.totalVentas > 0
                            ? `${((stats.ventasCredito / stats.totalVentas) * 100).toFixed(1)}% del total`
                            : 'Sin datos'}
                        </p>
                      </div>

                      <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Clock className="text-blue-400" size={20} />
                          <span className="text-white/60">Última Compra</span>
                        </div>
                        <p className="text-lg font-bold text-white mb-2">
                          {stats.ultimaCompra
                            ? new Date(stats.ultimaCompra).toLocaleDateString('es-MX')
                            : 'N/A'}
                        </p>
                        <p className="text-sm text-white/40">
                          {stats.ultimaCompra
                            ? `Hace ${Math.floor((Date.now() - new Date(stats.ultimaCompra).getTime()) / (1000 * 60 * 60 * 24))} días`
                            : 'Sin compras'}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6">
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <BarChart3 size={20} />
                        Resumen General
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                          <span className="text-white/60">Total Vendido:</span>
                          <span className="text-white font-semibold">
                            ${stats.montoTotalVendido.toLocaleString('es-MX')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                          <span className="text-white/60">Total Abonado:</span>
                          <span className="text-green-400 font-semibold">
                            ${stats.totalAbonos.toLocaleString('es-MX')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                          <span className="text-white/60">Adeudo Actual:</span>
                          <span className="text-red-400 font-semibold">
                            ${stats.adeudoActual.toLocaleString('es-MX')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-white/60">Promedio por Compra:</span>
                          <span className="text-white font-semibold">
                            ${stats.promedioCompra.toLocaleString('es-MX')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar: Gestión de Adeudos */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 rounded-lg p-6 sticky top-0">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Wallet size={20} />
                  Gestión de Adeudo
                </h3>

                <div className={`p-4 rounded-lg mb-6 ${
                  tieneAdeudo
                    ? 'bg-red-500/10 border border-red-500/20'
                    : 'bg-green-500/10 border border-green-500/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {tieneAdeudo ? (
                      <AlertCircle className="text-red-400" size={20} />
                    ) : (
                      <CheckCircle className="text-green-400" size={20} />
                    )}
                    <span className="text-white/60 text-sm">Adeudo Actual</span>
                  </div>
                  <p className={`text-3xl font-bold ${
                    tieneAdeudo ? 'text-red-400' : 'text-green-400'
                  }`}>
                    ${stats.adeudoActual.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                {tieneAdeudo && (
                  <button
                    onClick={() => setMostrarFormAbono(true)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <DollarSign size={20} />
                    Registrar Abono
                  </button>
                )}

                {!tieneAdeudo && (
                  <div className="text-center py-4">
                    <CheckCircle className="text-green-400 mx-auto mb-2" size={32} />
                    <p className="text-green-400 font-semibold">¡Sin Adeudos!</p>
                    <p className="text-white/60 text-xs mt-1">
                      El cliente está al corriente
                    </p>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-white/40 text-xs">
                    Total abonado: ${stats.totalAbonos.toLocaleString('es-MX')}
                  </p>
                  <p className="text-white/40 text-xs mt-1">
                    {abonos.length} pago(s) registrado(s)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Form Abono Modal */}
      <AnimatePresence>
        {mostrarFormAbono && (
          <FormAbonoCliente
            cliente={cliente}
            bancosDisponibles={bancosDisponibles}
            onClose={() => setMostrarFormAbono(false)}
            onSave={handleAbonoGuardado}
          />
        )}
      </AnimatePresence>
    </>
  );
}
