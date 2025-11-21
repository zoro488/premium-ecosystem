// 📦 PANEL ALMACÉN
// Panel completo de almacén con 4 módulos: Stock, Entradas, Salidas, Cortes
import { useMemo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Box,
  Calendar,
  DollarSign,
  Package,
  Scissors,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import { useAlmacen } from '../../hooks/useAlmacen';
import { formatCurrency, formatDate, formatNumber, formatPercentage } from '../../utils/formatters';

export const PanelAlmacen = () => {
  const {
    entradas,
    salidas,
    stockActual,
    valorInventario,
    inventarioPorOC,
    estadisticas,
    obtenerHistorico,
    obtenerAlertasStock,
    reporteRotacion,
    loading,
  } = useAlmacen();

  const [moduloActivo, setModuloActivo] = useState('stock');

  const alertas = obtenerAlertasStock(30, 10);
  const rotacion = reporteRotacion();

  const modulos = [
    {
      id: 'stock',
      label: 'Stock Actual',
      icon: Package,
      color: 'primary',
      count: inventarioPorOC.length,
    },
    {
      id: 'entradas',
      label: 'Entradas',
      icon: ArrowDownToLine,
      color: 'success',
      count: entradas.length,
    },
    {
      id: 'salidas',
      label: 'Salidas',
      icon: ArrowUpFromLine,
      color: 'error',
      count: salidas.length,
    },
    {
      id: 'analisis',
      label: 'Análisis & Cortes',
      icon: Activity,
      color: 'warning',
      count: alertas.length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 border border-primary/20 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white font-display mb-2">
              📦 Almacén & Inventario
            </h1>
            <p className="text-white/60">Control completo con trazabilidad FIFO</p>
          </div>

          {/* Alertas */}
          {alertas.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 px-4 py-2 bg-warning/20 border border-warning/30 rounded-lg"
            >
              <AlertTriangle className="w-5 h-5 text-warning" />
              <div>
                <p className="text-warning font-bold">{alertas.length} Alertas</p>
                <p className="text-warning/70 text-xs">Requieren atención</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-5 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="backdrop-blur-md bg-primary/10 border border-primary/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Stock Actual</p>
                <p className="text-primary text-xl font-bold">
                  {formatNumber(stockActual)} unidades
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="backdrop-blur-md bg-success/10 border border-success/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <DollarSign className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Valor Inventario</p>
                <p className="text-success text-xl font-bold">{formatCurrency(valorInventario)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="backdrop-blur-md bg-success/10 border border-success/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Total Entradas</p>
                <p className="text-success text-xl font-bold">
                  {formatNumber(estadisticas.totalEntradas)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="backdrop-blur-md bg-error/10 border border-error/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-error/20">
                <TrendingDown className="w-5 h-5 text-error" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Total Salidas</p>
                <p className="text-error text-xl font-bold">
                  {formatNumber(estadisticas.totalSalidas)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/10">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Rotación</p>
                <p className="text-white text-xl font-bold">
                  {formatNumber(estadisticas.rotacionInventario, 2)}x
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Módulos tabs */}
      <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl rounded-xl p-1">
        {modulos.map((modulo) => {
          const Icon = modulo.icon;
          const isActive = moduloActivo === modulo.id;

          return (
            <button
              key={modulo.id}
              onClick={() => setModuloActivo(modulo.id)}
              className={`
                relative flex-1 px-6 py-3 rounded-lg font-medium transition-all
                ${
                  isActive
                    ? `bg-${modulo.color}/20 text-${modulo.color} border border-${modulo.color}/30`
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <div className="flex items-center justify-center gap-2">
                <Icon className="w-4 h-4" />
                <span>{modulo.label}</span>
                {modulo.count > 0 && (
                  <span
                    className={`
                    px-2 py-0.5 rounded-full text-xs font-bold
                    ${isActive ? `bg-${modulo.color}/30` : 'bg-white/10'}
                  `}
                  >
                    {modulo.count}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Contenido de módulos */}
      <AnimatePresence mode="wait">
        <motion.div
          key={moduloActivo}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* MÓDULO 1: STOCK ACTUAL */}
          {moduloActivo === 'stock' && (
            <div className="space-y-4">
              {/* Tabla de stock por OC */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 bg-white/5 border-b border-white/10">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Inventario por Orden de Compra
                  </h3>
                  <p className="text-white/60 text-sm mt-1">Trazabilidad completa FIFO</p>
                </div>

                {inventarioPorOC.length === 0 ? (
                  <div className="p-12 text-center">
                    <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60 text-lg">No hay stock disponible</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                          <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase">
                            OC
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase">
                            Origen
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase">
                            Stock Disponible
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase">
                            Vendido
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase">
                            Costo/Unidad
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase">
                            Valor Stock
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-white/80 uppercase">
                            Días
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventarioPorOC.map((item, idx) => (
                          <motion.tr
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="border-b border-white/5 hover:bg-white/5 transition-all"
                          >
                            <td className="px-6 py-4">
                              <span className="text-white font-medium">{item.ocCodigo}</span>
                            </td>
                            <td className="px-6 py-4 text-white/70">{item.origen}</td>
                            <td className="px-6 py-4 text-right">
                              <span className="text-primary text-lg font-bold">
                                {formatNumber(item.stockDisponible)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right text-white/60">
                              {formatNumber(item.vendido)}
                            </td>
                            <td className="px-6 py-4 text-right text-success">
                              {formatCurrency(item.costoPorUnidad)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="text-white font-bold">
                                {formatCurrency(item.valorStock)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  item.diasEnInventario > 90
                                    ? 'bg-error/20 text-error'
                                    : item.diasEnInventario > 60
                                      ? 'bg-warning/20 text-warning'
                                      : 'bg-success/20 text-success'
                                }`}
                              >
                                {item.diasEnInventario} días
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Footer */}
                <div className="px-6 py-4 bg-white/5 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">
                      {inventarioPorOC.length} OCs con stock disponible
                    </span>
                    <div className="text-right">
                      <span className="text-white/60 text-sm block">Valor Total</span>
                      <span className="text-white text-xl font-bold">
                        {formatCurrency(valorInventario)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MÓDULO 2: ENTRADAS */}
          {moduloActivo === 'entradas' && (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 bg-white/5 border-b border-white/10">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ArrowDownToLine className="w-5 h-5 text-success" />
                  Entradas al Almacén
                </h3>
                <p className="text-white/60 text-sm mt-1">Desde órdenes de compra</p>
              </div>

              {entradas.length === 0 ? (
                <div className="p-12 text-center">
                  <ArrowDownToLine className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60 text-lg">No hay entradas registradas</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase">
                          Fecha
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase">
                          OC
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase">
                          Origen
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase">
                          Cantidad
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase">
                          Costo/Unidad
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase">
                          Costo Total
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase">
                          Stock Actual
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {entradas.map((entrada, idx) => (
                        <motion.tr
                          key={entrada.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-white/5 hover:bg-white/5 transition-all"
                        >
                          <td className="px-6 py-4 text-white/70 text-sm">
                            {formatDate(entrada.fecha)}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-white font-medium">{entrada.ocCodigo}</span>
                          </td>
                          <td className="px-6 py-4 text-white/70">{entrada.origen}</td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-success text-lg font-bold">
                              +{formatNumber(entrada.cantidad)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-white">
                            {formatCurrency(entrada.costoPorUnidad)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-white font-bold">
                              {formatCurrency(entrada.costoTotal)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                entrada.stockDisponible > 0
                                  ? 'bg-primary/20 text-primary'
                                  : 'bg-white/10 text-white/40'
                              }`}
                            >
                              {formatNumber(entrada.stockDisponible)}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Footer */}
              <div className="px-6 py-4 bg-white/5 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">
                    {entradas.length} entradas registradas
                  </span>
                  <div className="text-right">
                    <span className="text-white/60 text-sm block">Total Invertido</span>
                    <span className="text-success text-xl font-bold">
                      {formatCurrency(estadisticas.valorEntradas)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MÓDULO 3: SALIDAS */}
          {moduloActivo === 'salidas' && (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 bg-white/5 border-b border-white/10">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ArrowUpFromLine className="w-5 h-5 text-error" />
                  Salidas del Almacén
                </h3>
                <p className="text-white/60 text-sm mt-1">Ventas realizadas con margen</p>
              </div>

              {salidas.length === 0 ? (
                <div className="p-12 text-center">
                  <ArrowUpFromLine className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60 text-lg">No hay salidas registradas</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase">
                          Fecha
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase">
                          Cliente
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase">
                          OC Origen
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase">
                          Cantidad
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase">
                          Costo
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase">
                          Venta
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase">
                          Utilidad
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-white/80 uppercase">
                          Margen
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {salidas.map((salida, idx) => (
                        <motion.tr
                          key={salida.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-white/5 hover:bg-white/5 transition-all"
                        >
                          <td className="px-6 py-4 text-white/70 text-sm">
                            {formatDate(salida.fecha)}
                          </td>
                          <td className="px-6 py-4 text-white">{salida.clienteNombre}</td>
                          <td className="px-6 py-4">
                            <span className="text-white/70 font-medium">{salida.ocCodigo}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-error text-lg font-bold">
                              -{formatNumber(salida.cantidad)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-error">
                            {formatCurrency(salida.costoTotal)}
                          </td>
                          <td className="px-6 py-4 text-right text-success">
                            {formatCurrency(salida.ingresoTotal)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-white font-bold">
                              {formatCurrency(salida.utilidad)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                salida.margen >= 50
                                  ? 'bg-success/20 text-success'
                                  : salida.margen >= 30
                                    ? 'bg-warning/20 text-warning'
                                    : 'bg-error/20 text-error'
                              }`}
                            >
                              {formatPercentage(salida.margen)}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Footer */}
              <div className="px-6 py-4 bg-white/5 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">
                    {salidas.length} salidas registradas
                  </span>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <span className="text-white/60 text-xs block">Total Vendido</span>
                      <span className="text-success text-lg font-bold">
                        {formatCurrency(estadisticas.valorSalidas)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-white/60 text-xs block">Utilidad Total</span>
                      <span className="text-white text-lg font-bold">
                        {formatCurrency(estadisticas.utilidadTotal)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-white/60 text-xs block">Margen Promedio</span>
                      <span className="text-primary text-lg font-bold">
                        {formatPercentage(estadisticas.margenPromedioGlobal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MÓDULO 4: ANÁLISIS & CORTES */}
          {moduloActivo === 'analisis' && (
            <div className="space-y-6">
              {/* Alertas */}
              {alertas.length > 0 && (
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    Alertas de Stock
                  </h3>
                  <div className="space-y-3">
                    {alertas.map((alerta, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`p-4 rounded-lg border ${
                          alerta.nivel === 'CRITICO'
                            ? 'bg-error/10 border-error/30'
                            : 'bg-warning/10 border-warning/30'
                        }`}
                      >
                        <p
                          className={`font-medium ${
                            alerta.nivel === 'CRITICO' ? 'text-error' : 'text-warning'
                          }`}
                        >
                          {alerta.mensaje}
                        </p>
                        {alerta.ocCodigo && (
                          <p className="text-white/60 text-sm mt-1">
                            OC: {alerta.ocCodigo} - Stock: {alerta.stockDisponible} unidades -
                            Valor: {formatCurrency(alerta.valorStock)}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Análisis de rotación */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 bg-white/5 border-b border-white/10">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Análisis de Rotación de Inventario
                  </h3>
                  <p className="text-white/60 text-sm mt-1">Velocidad de movimiento por OC</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase">
                          OC
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase">
                          Inicial
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase">
                          Vendido
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase">
                          Stock
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-white/80 uppercase">
                          % Vendido
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-white/80 uppercase">
                          Días
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-white/80 uppercase">
                          Velocidad
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-white/80 uppercase">
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rotacion.map((item, idx) => (
                        <motion.tr
                          key={item.ocId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-white/5 hover:bg-white/5 transition-all"
                        >
                          <td className="px-6 py-4">
                            <span className="text-white font-medium">{item.ocCodigo}</span>
                          </td>
                          <td className="px-6 py-4 text-right text-white/70">
                            {formatNumber(item.cantidadInicial)}
                          </td>
                          <td className="px-6 py-4 text-right text-success">
                            {formatNumber(item.vendido)}
                          </td>
                          <td className="px-6 py-4 text-right text-primary">
                            {formatNumber(item.stockDisponible)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                item.porcentajeVendido >= 80
                                  ? 'bg-success/20 text-success'
                                  : item.porcentajeVendido >= 50
                                    ? 'bg-warning/20 text-warning'
                                    : 'bg-error/20 text-error'
                              }`}
                            >
                              {formatPercentage(item.porcentajeVendido)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center text-white/70">
                            {item.diasEnInventario}
                          </td>
                          <td className="px-6 py-4 text-center text-white font-medium">
                            {formatNumber(item.velocidadRotacion, 2)} u/día
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                item.estadoRotacion === 'EXCELENTE'
                                  ? 'bg-success/20 text-success'
                                  : item.estadoRotacion === 'BUENO'
                                    ? 'bg-primary/20 text-primary'
                                    : item.estadoRotacion === 'REGULAR'
                                      ? 'bg-warning/20 text-warning'
                                      : 'bg-error/20 text-error'
                              }`}
                            >
                              {item.estadoRotacion}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PanelAlmacen;
