// 💰 FORM VENTA
// Formulario para registrar ventas con distribución basada en estatus de pago
import { useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  CreditCard,
  DollarSign,
  FileText,
  Package,
  ShoppingCart,
  TrendingUp,
  Truck,
  User,
} from 'lucide-react';

import { useFlowStore } from '../../../../stores/flowStore';
import { useExchangeRate } from '../../hooks/useExchangeRate';
import { useVentas } from '../../hooks/useVentas';
import { distribuirUtilidad } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';

export const FormVenta = ({ onSuccess, onCancel }) => {
  const { clientes, ordenesCompra } = useFlowStore();
  const { crearVenta, marcarComoPagada, loading } = useVentas();
  const { exchangeRate } = useExchangeRate();

  const [formData, setFormData] = useState({
    clienteId: '',
    ocRelacionadaId: '',
    cantidad: '',
    precioVenta: '',
    aplicaFlete: false,
    estatus: 'PENDIENTE', // CRÍTICO: Selector de estatus
    concepto: '',
    fecha: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});

  // OCs con stock disponible
  const ocsDisponibles = useMemo(() => {
    return (ordenesCompra || [])
      .filter((oc) => (oc.stockActual || 0) > 0)
      .sort((a, b) => b.stockActual - a.stockActual);
  }, [ordenesCompra]);

  // OC seleccionada
  const ocSeleccionada = useMemo(() => {
    return ordenesCompra?.find((oc) => oc.id === formData.ocRelacionadaId);
  }, [formData.ocRelacionadaId, ordenesCompra]);

  // Preview de distribución
  const previewDistribucion = useMemo(() => {
    if (!formData.cantidad || !formData.precioVenta || !ocSeleccionada) {
      return null;
    }

    const ventaData = {
      cantidad: parseFloat(formData.cantidad),
      precioVenta: parseFloat(formData.precioVenta),
      costoUnidad: ocSeleccionada.costoPorUnidad,
      aplicaFlete: formData.aplicaFlete,
      montoFlete: null, // Calculado automáticamente
    };

    return distribuirUtilidad(ventaData, exchangeRate.rate);
  }, [
    formData.cantidad,
    formData.precioVenta,
    formData.aplicaFlete,
    ocSeleccionada,
    exchangeRate.rate,
  ]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    const newErrors = {};

    if (!formData.clienteId) {
      newErrors.clienteId = 'Selecciona un cliente';
    }

    if (!formData.ocRelacionadaId) {
      newErrors.ocRelacionadaId = 'Selecciona una orden de compra';
    }

    if (!formData.cantidad || parseFloat(formData.cantidad) <= 0) {
      newErrors.cantidad = 'Ingresa una cantidad válida';
    }

    if (!formData.precioVenta || parseFloat(formData.precioVenta) <= 0) {
      newErrors.precioVenta = 'Ingresa un precio válido';
    }

    if (ocSeleccionada && parseFloat(formData.cantidad) > ocSeleccionada.stockActual) {
      newErrors.cantidad = `Stock insuficiente. Disponible: ${ocSeleccionada.stockActual} unidades`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Crear venta
    const result = await crearVenta({
      clienteId: formData.clienteId,
      ocRelacionadaId: formData.ocRelacionadaId,
      cantidad: parseFloat(formData.cantidad),
      precioVenta: parseFloat(formData.precioVenta),
      aplicaFlete: formData.aplicaFlete,
      concepto: formData.concepto,
      fecha: formData.fecha,
    });

    if (result.success) {
      // Si el estatus es PAGADO, marcar como pagado inmediatamente
      if (formData.estatus === 'PAGADO') {
        const resultPago = await marcarComoPagada(
          result.data.id,
          formData.clienteId,
          previewDistribucion.totalCliente
        );

        if (resultPago.success) {
          onSuccess?.({
            venta: result.data,
            distribucion: resultPago.distribucion,
          });
        } else {
          setErrors({ submit: resultPago.error });
        }
      } else {
        // Venta creada como PENDIENTE
        onSuccess?.(result.data);
      }
    } else {
      setErrors({ submit: result.error });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="backdrop-blur-xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-white/10 rounded-2xl p-6 max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-success/20">
          <ShoppingCart className="w-6 h-6 text-success" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white font-display">Nueva Venta</h2>
          <p className="text-white/60 text-sm">
            Registra una venta y distribuye automáticamente según el pago
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Cliente */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-white/80 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Cliente
            </label>
            <select
              value={formData.clienteId}
              onChange={(e) => handleChange('clienteId', e.target.value)}
              className={`
                w-full backdrop-blur-md bg-white/5
                border ${errors.clienteId ? 'border-error/50' : 'border-white/10'}
                rounded-lg px-4 py-3 text-white
                focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                transition-all
              `}
            >
              <option value="" className="bg-gray-900">
                Selecciona un cliente...
              </option>
              {(clientes || []).map((cliente) => (
                <option key={cliente.id} value={cliente.id} className="bg-gray-900">
                  {cliente.nombre}
                  {(cliente.adeudo || 0) > 0 && ` (Adeudo: ${formatCurrency(cliente.adeudo)})`}
                </option>
              ))}
            </select>
            {errors.clienteId && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-error mt-1 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.clienteId}
              </motion.p>
            )}
          </div>

          {/* Orden de Compra */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-white/80 mb-2">
              <Package className="w-4 h-4 inline mr-2" />
              Orden de Compra (OC)
            </label>
            <select
              value={formData.ocRelacionadaId}
              onChange={(e) => handleChange('ocRelacionadaId', e.target.value)}
              className={`
                w-full backdrop-blur-md bg-white/5
                border ${errors.ocRelacionadaId ? 'border-error/50' : 'border-white/10'}
                rounded-lg px-4 py-3 text-white
                focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                transition-all
              `}
            >
              <option value="" className="bg-gray-900">
                Selecciona una OC...
              </option>
              {ocsDisponibles.map((oc) => (
                <option key={oc.id} value={oc.id} className="bg-gray-900">
                  {oc.codigo} - {oc.origen} (Stock: {oc.stockActual || 0} unidades - Costo:{' '}
                  {formatCurrency(oc.costoPorUnidad)}/u)
                </option>
              ))}
            </select>
            {errors.ocRelacionadaId && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-error mt-1 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.ocRelacionadaId}
              </motion.p>
            )}
          </div>

          {/* Fecha */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-white/80 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Fecha
            </label>
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) => handleChange('fecha', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full backdrop-blur-md bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Estatus de Pago */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-white/80 mb-2">
              <CreditCard className="w-4 h-4 inline mr-2" />
              Estatus de Pago
            </label>
            <select
              value={formData.estatus}
              onChange={(e) => handleChange('estatus', e.target.value)}
              className="w-full backdrop-blur-md bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="PENDIENTE" className="bg-gray-900">
                PENDIENTE (A crédito)
              </option>
              <option value="PAGADO" className="bg-gray-900">
                PAGADO (De contado)
              </option>
            </select>
            <p className="text-xs text-white/40 mt-1">
              {formData.estatus === 'PENDIENTE'
                ? 'La distribución se aplicará cuando el cliente pague'
                : 'La distribución se aplicará inmediatamente'}
            </p>
          </div>

          {/* Cantidad */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-white/80 mb-2">
              Cantidad de Unidades
            </label>
            <input
              type="number"
              step="1"
              value={formData.cantidad}
              onChange={(e) => handleChange('cantidad', e.target.value)}
              placeholder="0"
              className={`
                w-full backdrop-blur-md bg-white/5
                border ${errors.cantidad ? 'border-error/50' : 'border-white/10'}
                rounded-lg px-4 py-3 text-white text-xl font-bold placeholder:text-white/40
                focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                transition-all
              `}
            />
            {ocSeleccionada && (
              <p className="text-xs text-white/60 mt-1">
                Stock disponible: {ocSeleccionada.stockActual || 0} unidades
              </p>
            )}
            {errors.cantidad && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-error mt-1 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.cantidad}
              </motion.p>
            )}
          </div>

          {/* Precio de Venta */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-white/80 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Precio de Venta (USD/unidad)
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <DollarSign className="w-5 h-5 text-success/60" />
              </div>
              <input
                type="number"
                step="0.01"
                value={formData.precioVenta}
                onChange={(e) => handleChange('precioVenta', e.target.value)}
                placeholder="0.00"
                className={`
                  w-full backdrop-blur-md bg-white/5
                  border ${errors.precioVenta ? 'border-error/50' : 'border-white/10'}
                  rounded-lg pl-10 pr-4 py-3 text-white text-xl font-bold placeholder:text-white/40
                  focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                  transition-all
                `}
              />
            </div>
            {ocSeleccionada && (
              <p className="text-xs text-white/60 mt-1">
                Costo: {formatCurrency(ocSeleccionada.costoPorUnidad)}/u
              </p>
            )}
            {errors.precioVenta && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-error mt-1 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.precioVenta}
              </motion.p>
            )}
          </div>

          {/* Aplica Flete */}
          <div className="col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.aplicaFlete}
                onChange={(e) => handleChange('aplicaFlete', e.target.checked)}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/20"
              />
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                <span className="text-white font-medium">Aplica Flete</span>
                <span className="text-white/60 text-sm">
                  (Se calculará automáticamente según tipo de cambio)
                </span>
              </div>
            </label>
          </div>

          {/* Concepto */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-white/80 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Concepto (Opcional)
            </label>
            <textarea
              value={formData.concepto}
              onChange={(e) => handleChange('concepto', e.target.value)}
              placeholder="Detalles adicionales de la venta..."
              rows={2}
              className="w-full backdrop-blur-md bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>
        </div>

        {/* Preview de Distribución */}
        {previewDistribucion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-md bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-white">Preview de Distribución</h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="backdrop-blur-md bg-white/5 rounded-lg p-4">
                <p className="text-white/60 text-xs mb-1">Bóveda Monte</p>
                <p className="text-white text-lg font-bold">
                  {formatCurrency(previewDistribucion.distribucion.bovedaMonte)}
                </p>
                <p className="text-white/40 text-xs">Recuperar costo</p>
              </div>

              <div className="backdrop-blur-md bg-white/5 rounded-lg p-4">
                <p className="text-white/60 text-xs mb-1">Utilidades</p>
                <p className="text-success text-lg font-bold">
                  {formatCurrency(previewDistribucion.distribucion.utilidades)}
                </p>
                <p className="text-white/40 text-xs">Ganancia neta</p>
              </div>

              <div className="backdrop-blur-md bg-white/5 rounded-lg p-4">
                <p className="text-white/60 text-xs mb-1">
                  {formData.aplicaFlete ? 'Flete Sur' : 'Flete'}
                </p>
                <p className="text-primary text-lg font-bold">
                  {formatCurrency(previewDistribucion.distribucion.fleteSur)}
                </p>
                <p className="text-white/40 text-xs">
                  {formData.aplicaFlete ? 'Aplicado' : 'No aplica'}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/60 text-xs mb-1">Total Cliente</p>
                <p className="text-white text-2xl font-bold">
                  {formatCurrency(previewDistribucion.totalCliente)}
                </p>
              </div>
              <div>
                <p className="text-white/60 text-xs mb-1">Margen</p>
                <p className="text-success text-2xl font-bold">
                  {previewDistribucion.margen.toFixed(1)}%
                </p>
              </div>
            </div>

            {formData.estatus === 'PENDIENTE' && (
              <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-warning text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Esta distribución se aplicará cuando el cliente pague
                </p>
              </div>
            )}

            {formData.estatus === 'PAGADO' && (
              <div className="mt-4 p-3 rounded-lg bg-success/10 border border-success/20">
                <p className="text-success text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Esta distribución se aplicará inmediatamente
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Error general */}
        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-error/10 border border-error/20"
          >
            <p className="text-error text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {errors.submit}
            </p>
          </motion.div>
        )}

        {/* Botones */}
        <div className="flex items-center gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !previewDistribucion}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-success/20 to-success/30 hover:from-success/30 hover:to-success/40 border border-success/30 rounded-lg text-white font-medium shadow-lg shadow-success/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                {formData.estatus === 'PAGADO'
                  ? 'Registrando y Distribuyendo...'
                  : 'Registrando...'}
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                {formData.estatus === 'PAGADO' ? 'Registrar Venta y Distribuir' : 'Registrar Venta'}
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default FormVenta;
