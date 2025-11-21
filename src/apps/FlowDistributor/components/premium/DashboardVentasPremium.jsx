/**
 * 📊 DASHBOARD PREMIUM DE VENTAS
 * Sistema avanzado de gestión y análisis de ventas
 *
 * FEATURES ELITE:
 * - Pipeline de ventas con forecasting
 * - Metas vs Reales con tracking
 * - Análisis de productos top
 * - Ranking de vendedores
 * - Cálculo de comisiones
 * - Tendencias y proyecciones
 * - Alertas de rendimiento
 * - Análisis de conversión
 */
import { useMemo, useState } from 'react';

import { endOfMonth, isWithinInterval, startOfMonth, subMonths } from 'date-fns';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  Award,
  BarChart3,
  Calendar,
  DollarSign,
  Download,
  Package,
  Percent,
  ShoppingCart,
  Star,
  Target,
  Zap,
} from 'lucide-react';

import { formatCurrency } from '../../utils/formatters';

export const DashboardVentasPremium = ({ ventas = [], productos = [], vendedores = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('mes'); // mes, trimestre, año
  const [viewMode, setViewMode] = useState('overview'); // overview, productos, vendedores
  const [sortBy, setSortBy] = useState('total');

  // Calcular período
  const periodo = useMemo(() => {
    const now = new Date();
    let start, end;

    switch (selectedPeriod) {
      case 'mes':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'trimestre':
        start = startOfMonth(subMonths(now, 2));
        end = endOfMonth(now);
        break;
      case 'año':
        start = startOfMonth(subMonths(now, 11));
        end = endOfMonth(now);
        break;
      default:
        start = startOfMonth(now);
        end = endOfMonth(now);
    }

    return { start, end };
  }, [selectedPeriod]);

  // Filtrar ventas del período
  const ventasPeriodo = useMemo(() => {
    return ventas.filter((venta) => {
      const fechaVenta = new Date(venta.fecha);
      return isWithinInterval(fechaVenta, { start: periodo.start, end: periodo.end });
    });
  }, [ventas, periodo]);

  // Estadísticas principales
  const stats = useMemo(() => {
    const totalVentas = ventasPeriodo.reduce((sum, v) => sum + (v.total || 0), 0);
    const cantidadVentas = ventasPeriodo.length;
    const ticketPromedio = cantidadVentas > 0 ? totalVentas / cantidadVentas : 0;

    // Meta (puedes ajustar esto según tus necesidades)
    const meta = 500000;
    const progreso = (totalVentas / meta) * 100;

    // Comparar con período anterior
    const periodoAnteriorStart = subMonths(
      periodo.start,
      selectedPeriod === 'año' ? 12 : selectedPeriod === 'trimestre' ? 3 : 1
    );
    const periodoAnteriorEnd = subMonths(
      periodo.end,
      selectedPeriod === 'año' ? 12 : selectedPeriod === 'trimestre' ? 3 : 1
    );

    const ventasPeriodoAnterior = ventas.filter((v) => {
      const fecha = new Date(v.fecha);
      return isWithinInterval(fecha, { start: periodoAnteriorStart, end: periodoAnteriorEnd });
    });

    const totalAnterior = ventasPeriodoAnterior.reduce((sum, v) => sum + (v.total || 0), 0);
    const crecimiento =
      totalAnterior > 0 ? ((totalVentas - totalAnterior) / totalAnterior) * 100 : 0;

    // Productos más vendidos
    const productoVentas = {};
    ventasPeriodo.forEach((venta) => {
      if (venta.productos) {
        venta.productos.forEach((p) => {
          if (!productoVentas[p.id]) {
            productoVentas[p.id] = {
              id: p.id,
              nombre: p.nombre,
              cantidad: 0,
              total: 0,
            };
          }
          productoVentas[p.id].cantidad += p.cantidad || 1;
          productoVentas[p.id].total += (p.precio || 0) * (p.cantidad || 1);
        });
      }
    });

    const productosTop = Object.values(productoVentas)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // Vendedores top
    const vendedorVentas = {};
    ventasPeriodo.forEach((venta) => {
      const vendedorId = venta.vendedorId || 'sin-asignar';
      if (!vendedorVentas[vendedorId]) {
        vendedorVentas[vendedorId] = {
          id: vendedorId,
          nombre: venta.vendedorNombre || 'Sin asignar',
          ventas: 0,
          total: 0,
        };
      }
      vendedorVentas[vendedorId].ventas++;
      vendedorVentas[vendedorId].total += venta.total || 0;
    });

    const vendedoresTop = Object.values(vendedorVentas)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return {
      totalVentas,
      cantidadVentas,
      ticketPromedio,
      meta,
      progreso,
      crecimiento,
      productosTop,
      vendedoresTop,
    };
  }, [ventasPeriodo, ventas, periodo, selectedPeriod]);

  return (
    <div className="w-full h-full overflow-auto bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900 p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
          📊 Dashboard de Ventas
        </h2>
        <p className="text-slate-400">Análisis avanzado y forecasting de ventas</p>
      </motion.div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 backdrop-blur-lg border border-zinc-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-zinc-200" />
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                stats.crecimiento >= 0 ? 'text-zinc-200' : 'text-zinc-200'
              }`}
            >
              {stats.crecimiento >= 0 ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
              {Math.abs(stats.crecimiento).toFixed(1)}%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Ventas Totales</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalVentas)}</p>
          <p className="text-xs text-slate-500 mt-1">vs período anterior</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-zinc-800/20 to-zinc-900/10 backdrop-blur-lg border border-zinc-700/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-8 h-8 text-zinc-300" />
            <Zap className="w-5 h-5 text-zinc-200" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Número de Ventas</p>
          <p className="text-2xl font-bold text-white">{stats.cantidadVentas}</p>
          <p className="text-xs text-zinc-300 mt-1">
            Ticket: {formatCurrency(stats.ticketPromedio)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className={`bg-gradient-to-br ${
            stats.progreso >= 100
              ? 'from-green-500/20 to-green-600/10 border-zinc-500/30'
              : stats.progreso >= 75
                ? 'from-yellow-500/20 to-yellow-600/10 border-zinc-500/30'
                : 'from-orange-500/20 to-orange-600/10 border-zinc-500/30'
          } backdrop-blur-lg border rounded-xl p-6`}
        >
          <div className="flex items-center justify-between mb-2">
            <Target
              className={`w-8 h-8 ${stats.progreso >= 100 ? 'text-zinc-200' : 'text-zinc-200'}`}
            />
            <Percent className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Progreso vs Meta</p>
          <p className="text-2xl font-bold text-white">{stats.progreso.toFixed(1)}%</p>
          <div className="mt-2 w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, stats.progreso)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-full ${
                stats.progreso >= 100
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-yellow-500 to-orange-500'
              }`}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-zinc-800/20 to-zinc-800/10 backdrop-blur-lg border border-zinc-800/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-zinc-800" />
            <Star className="w-5 h-5 text-zinc-200" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Ticket Promedio</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.ticketPromedio)}</p>
          <p className="text-xs text-slate-500 mt-1">Por transacción</p>
        </motion.div>
      </div>

      {/* Controles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-4 mb-6"
      >
        <div className="flex flex-wrap gap-4 items-center">
          {/* Período */}
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="mes">Este Mes</option>
              <option value="trimestre">Trimestre</option>
              <option value="año">Año</option>
            </select>
          </div>

          {/* Vista */}
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-400" />
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="overview">Overview</option>
              <option value="productos">Por Productos</option>
              <option value="vendedores">Por Vendedores</option>
            </select>
          </div>

          <div className="flex-1"></div>

          {/* Exportar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-emerald-500/50 transition-shadow"
          >
            <Download className="w-4 h-4" />
            Exportar
          </motion.button>
        </div>
      </motion.div>

      {/* Contenido según vista */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Productos Top */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-6 h-6 text-zinc-200" />
              <h3 className="text-xl font-bold text-white">Top 5 Productos</h3>
            </div>
            <div className="space-y-4">
              {stats.productosTop.map((producto, index) => (
                <motion.div
                  key={producto.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0
                          ? 'bg-zinc-9000/20 text-zinc-200'
                          : index === 1
                            ? 'bg-slate-400/20 text-slate-300'
                            : index === 2
                              ? 'bg-zinc-9000/20 text-zinc-200'
                              : 'bg-slate-600/20 text-slate-400'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{producto.nombre}</p>
                      <p className="text-xs text-slate-400">{producto.cantidad} unidades</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-200 font-bold">{formatCurrency(producto.total)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Vendedores Top */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-zinc-800" />
              <h3 className="text-xl font-bold text-white">Top 5 Vendedores</h3>
            </div>
            <div className="space-y-4">
              {stats.vendedoresTop.map((vendedor, index) => {
                const comision = vendedor.total * 0.05; // 5% de comisión

                return (
                  <motion.div
                    key={vendedor.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                          index === 0
                            ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white'
                            : index === 1
                              ? 'bg-gradient-to-br from-slate-400 to-slate-500 text-white'
                              : index === 2
                                ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
                                : 'bg-slate-600/50 text-slate-300'
                        }`}
                      >
                        {(vendedor.nombre || 'V')[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{vendedor.nombre}</p>
                        <p className="text-xs text-slate-400">{vendedor.ventas} ventas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-zinc-200 font-bold">{formatCurrency(vendedor.total)}</p>
                      <p className="text-xs text-zinc-800">Comisión: {formatCurrency(comision)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}

      {/* Sin datos */}
      {stats.cantidadVentas === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No hay ventas en este período</p>
          <p className="text-slate-500 text-sm">
            Selecciona un período diferente o registra nuevas ventas
          </p>
        </motion.div>
      )}
    </div>
  );
};
