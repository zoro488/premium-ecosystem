/**
 * 💰 FORMULARIO DE ABONOS/PAGOS ULTRA-OPTIMIZADO
 * ✅ Selección inteligente de ventas pendientes
 * ✅ Cálculo automático de saldos y distribución
 * ✅ Actualización proporcional de paneles
 * ✅ Validaciones en tiempo real
 * ✅ UX ultra-intuitivo
 */
import { useEffect, useMemo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Calculator,
  CheckCircle,
  CreditCard,
  DollarSign,
  Search,
  Zap,
} from 'lucide-react';

// 🎨 Design System
const ds = {
  glass: 'backdrop-blur-xl bg-white/[0.03] border border-white/10',
  input:
    'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition-all',
  button:
    'px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-started',
  gradient: 'bg-gradient-to-r from-emerald-500 to-teal-500',
};

/**
 * 🎯 Hook para cálculos automáticos
 */
const useCalculosAbono = (ventaSeleccionada, montoAbono) => {
  return useMemo(() => {
    if (!ventaSeleccionada || !montoAbono) {
      return null;
    }

    const saldoPendiente = ventaSeleccionada.adeudo || 0;
    const porcentajePago = Math.min((montoAbono / saldoPendiente) * 100, 100);
    const nuevoSaldo = Math.max(saldoPendiente - montoAbono, 0);

    // Distribución proporcional
    const totalVenta = ventaSeleccionada.totalVenta || 0;
    const proporcion = montoAbono / totalVenta;

    const distribucion = {
      bovedaMonte:
        (ventaSeleccionada.totalVenta -
          ventaSeleccionada.totalFletes -
          ventaSeleccionada.totalUtilidades) *
        proporcion,
      fleteSur: (ventaSeleccionada.totalFletes || 0) * proporcion,
      utilidades: (ventaSeleccionada.totalUtilidades || 0) * proporcion,
    };

    // Determinar nuevo estado
    let nuevoEstado = 'Pendiente';
    if (porcentajePago >= 100) {
      nuevoEstado = 'Pagado';
    } else if (porcentajePago > 0) {
      nuevoEstado = 'Parcial';
    }

    return {
      saldoPendiente,
      porcentajePago,
      nuevoSaldo,
      nuevoEstado,
      distribucion,
      valido: montoAbono > 0 && montoAbono <= saldoPendiente,
    };
  }, [ventaSeleccionada, montoAbono]);
};

/**
 * 📋 Tarjeta de Venta Pendiente
 */
const VentaPendienteCard = ({ venta, selected, onClick }) => {
  const saldo = venta.adeudo || 0;
  const total = venta.totalVenta || 0;
  const pagado = total - saldo;
  const porcentaje = total > 0 ? (pagado / total) * 100 : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${ds.glass} rounded-xl p-4 cursor-pointer transition-all ${
        selected ? 'ring-2 ring-emerald-500 bg-emerald-500/10' : 'hover:bg-white/5'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-white flex items-center gap-2">
            {venta.cliente}
            {selected && <CheckCircle className="w-4 h-4 text-emerald-400" />}
          </h4>
          <p className="text-sm text-slate-400">{new Date(venta.fecha).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Adeudo</p>
          <p className="text-lg font-bold text-red-400">${saldo.toLocaleString()}</p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Pagado: ${pagado.toLocaleString()}</span>
          <span>{porcentaje.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${porcentaje}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
          />
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Total: ${total.toLocaleString()}</span>
          <span
            className={`font-semibold ${
              venta.estatus === 'Pendiente'
                ? 'text-red-400'
                : venta.estatus === 'Parcial'
                  ? 'text-yellow-400'
                  : 'text-emerald-400'
            }`}
          >
            {venta.estatus}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * 📊 Panel de Distribución
 */
const PanelDistribucion = ({ distribucion }) => {
  if (!distribucion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${ds.glass} rounded-xl p-6`}
    >
      <h3 className="font-bold mb-4 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-emerald-400" />
        Distribución del Abono
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <span className="text-lg">🏦</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Bóveda Monte</p>
              <p className="text-xs text-slate-400">Capital recuperado</p>
            </div>
          </div>
          <span className="text-lg font-bold text-purple-400">
            ${distribucion.bovedaMonte.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-lg">🚚</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Flete Sur</p>
              <p className="text-xs text-slate-400">Costos de envío</p>
            </div>
          </div>
          <span className="text-lg font-bold text-blue-400">
            ${distribucion.fleteSur.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <span className="text-lg">💎</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Utilidades</p>
              <p className="text-xs text-slate-400">Ganancia neta</p>
            </div>
          </div>
          <span className="text-lg font-bold text-emerald-400">
            ${distribucion.utilidades.toLocaleString()}
          </span>
        </div>

        <div className="pt-3 mt-3 border-t border-white/10">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-300">Total Distribuido:</span>
            <span className="text-xl font-bold text-white">
              $
              {(
                distribucion.bovedaMonte +
                distribucion.fleteSur +
                distribucion.utilidades
              ).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * 🎯 COMPONENTE PRINCIPAL
 */
export default function AbonoFormOptimizado({ ventas, clientes, onSubmit, onCancel }) {
  const [busqueda, setBusqueda] = useState('');
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [montoAbono, setMontoAbono] = useState('');
  const [bancoDestino, setBancoDestino] = useState('bovedaMonte');
  const [procesando, setProcesando] = useState(false);

  // Filtrar solo ventas pendientes o parciales
  const ventasPendientes = useMemo(() => {
    return ventas
      .filter((v) => v.estatus === 'Pendiente' || v.estatus === 'Parcial')
      .filter((v) => {
        if (!busqueda) return true;
        return (
          v.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
          v.id.toString().includes(busqueda)
        );
      })
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [ventas, busqueda]);

  // Calcular distribución
  const calculos = useCalculosAbono(ventaSeleccionada, parseFloat(montoAbono) || 0);

  // Validar formulario
  const formularioValido = ventaSeleccionada && calculos?.valido;

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formularioValido) return;

    setProcesando(true);

    try {
      await onSubmit({
        ventaId: ventaSeleccionada.id,
        cliente: ventaSeleccionada.cliente,
        monto: parseFloat(montoAbono),
        bancoDestino,
        distribucion: calculos.distribucion,
        nuevoEstado: calculos.nuevoEstado,
        porcentajePago: calculos.porcentajePago,
      });

      // Reset form
      setVentaSeleccionada(null);
      setMontoAbono('');
      setBusqueda('');
    } catch (_error) {
      // Error ya manejado por handleSubmit
      console.error('Error al procesar abono:', _error);
    } finally {
      setProcesando(false);
    }
  };

  // Atajos de teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (formularioValido) {
          handleSubmit(e);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [formularioValido, handleSubmit]);

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 rounded-xl">
            <CreditCard className="w-6 h-6 text-emerald-400" />
          </div>
          Registrar Abono/Pago
        </h2>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Shortcut:</span>
          <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs">
            Ctrl + S
          </kbd>
        </div>
      </div>

      {/* Búsqueda */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Buscar Venta Pendiente
        </label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por cliente o ID..."
            className={`${ds.input} pl-12`}
          />
        </div>
      </div>

      {/* Lista de ventas pendientes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-300">
            Ventas Pendientes ({ventasPendientes.length})
          </label>
          <span className="text-xs text-slate-400">
            Total adeudo: $
            {ventasPendientes.reduce((sum, v) => sum + (v.adeudo || 0), 0).toLocaleString()}
          </span>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
          {ventasPendientes.length > 0 ? (
            ventasPendientes.map((venta) => (
              <VentaPendienteCard
                key={venta.id}
                venta={venta}
                selected={ventaSeleccionada?.id === venta.id}
                onClick={() => setVentaSeleccionada(venta)}
              />
            ))
          ) : (
            <div className={`${ds.glass} rounded-xl p-8 text-center`}>
              <p className="text-slate-400">
                {busqueda
                  ? 'No se encontraron ventas pendientes'
                  : '✅ ¡Excelente! No hay ventas pendientes'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detalles del abono */}
      <AnimatePresence>
        {ventaSeleccionada && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Información de la venta */}
            <div className={`${ds.glass} rounded-xl p-4`}>
              <h3 className="font-semibold mb-3 text-emerald-400">Venta Seleccionada</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Cliente:</span>
                  <p className="font-semibold text-white">{ventaSeleccionada.cliente}</p>
                </div>
                <div>
                  <span className="text-slate-400">Fecha:</span>
                  <p className="font-semibold text-white">
                    {new Date(ventaSeleccionada.fecha).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Total:</span>
                  <p className="font-semibold text-white">
                    ${(ventaSeleccionada.totalVenta || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Saldo Pendiente:</span>
                  <p className="font-semibold text-red-400">
                    ${(ventaSeleccionada.adeudo || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Monto del abono */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Monto del Abono
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  max={ventaSeleccionada.adeudo}
                  step="0.01"
                  value={montoAbono}
                  onChange={(e) => setMontoAbono(e.target.value)}
                  placeholder="0.00"
                  className={`${ds.input} pl-12 text-2xl font-bold`}
                />
              </div>

              {/* Botones rápidos */}
              <div className="flex gap-2 mt-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMontoAbono((ventaSeleccionada.adeudo / 2).toFixed(2))}
                  className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
                >
                  50%
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMontoAbono(ventaSeleccionada.adeudo.toFixed(2))}
                  className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
                >
                  100% (Pagar Todo)
                </motion.button>
              </div>

              {calculos && (
                <div className="mt-3 space-y-2">
                  {calculos.porcentajePago >= 100 ? (
                    <p className="text-sm text-emerald-400 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />✅ Esta venta quedará como PAGADA
                    </p>
                  ) : calculos.porcentajePago > 0 ? (
                    <p className="text-sm text-yellow-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      💰 Se pagará el {calculos.porcentajePago.toFixed(1)}% (Quedará saldo: $
                      {calculos.nuevoSaldo.toLocaleString()})
                    </p>
                  ) : null}
                </div>
              )}
            </div>

            {/* Banco destino */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Banco Destino
              </label>
              <select
                value={bancoDestino}
                onChange={(e) => setBancoDestino(e.target.value)}
                className={ds.input}
              >
                <option value="bovedaMonte">🏦 Bóveda Monte</option>
                <option value="bancoAzteca">🏦 Banco Azteca</option>
                <option value="bancoLeftie">🏦 Banco Leftie</option>
                <option value="bancoProfit">🏦 Banco Profit</option>
                <option value="bovedaUSA">🇺🇸 Bóveda USA</option>
              </select>
            </div>

            {/* Distribución */}
            {calculos && <PanelDistribucion distribucion={calculos.distribucion} />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Acciones */}
      <div className="flex items-center gap-4 pt-6 border-t border-white/10">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCancel}
          className={`${ds.button} bg-white/5 hover:bg-white/10`}
        >
          Cancelar
        </motion.button>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!formularioValido || procesando}
          className={`${ds.button} ${ds.gradient} flex-1`}
        >
          {procesando ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              >
                <Zap className="w-5 h-5" />
              </motion.div>
              Procesando...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Registrar Abono ${montoAbono ? parseFloat(montoAbono).toLocaleString() : '0'}
            </>
          )}
        </motion.button>
      </div>

      {/* Estado validación */}
      {!formularioValido && ventaSeleccionada && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl"
        >
          <p className="text-sm text-yellow-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {!montoAbono || parseFloat(montoAbono) <= 0
              ? 'Ingresa el monto del abono'
              : 'El monto no puede ser mayor al saldo pendiente'}
          </p>
        </motion.div>
      )}
    </motion.form>
  );
}
