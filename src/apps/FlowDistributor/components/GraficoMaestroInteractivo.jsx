/**
 * 📊 GRÁFICO MAESTRO INTERACTIVO - INNOVACIÓN SUPREMA
 * ====================================================
 * Gráfico principal que muestra TODO en una visualización:
 * - Total Ingresos (evolución temporal)
 * - Total Gastos (evolución temporal)
 * - RF Actual / Capital Disponible (línea de balance)
 * - Análisis de coincidencia entre ingresos/gastos/capital
 *
 * CARACTERÍSTICAS INNOVADORAS:
 * ✨ Visualización 2D-3D tipo Spline de máxima calidad
 * 🎯 Filtros interactivos por rango de fechas
 * 📈 Zoom y pan para explorar datos
 * 🌈 Gradientes animados premium
 * 💫 Tooltips ultra-informativos
 * 🔄 Transiciones suaves entre estados
 * 🎨 Efectos glow y sombras 3D
 */
import { memo, useCallback, useMemo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Filter,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  Area,
  Bar,
  Brush,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// ============================================
// TOOLTIP SUPREMO CON ANÁLISIS INTELIGENTE
// ============================================
const TooltipSupremo = memo(({ active, payload, label, colorScheme }) => {
  if (!active || !payload || !payload.length) return null;

  const ingresos = payload.find((p) => p.dataKey === 'ingresos')?.value || 0;
  const gastos = payload.find((p) => p.dataKey === 'gastos')?.value || 0;
  const balance = payload.find((p) => p.dataKey === 'balance')?.value || 0;
  const diferencia = ingresos - gastos;
  const tendencia = diferencia > 0 ? 'positiva' : diferencia < 0 ? 'negativa' : 'neutral';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: -15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="backdrop-blur-2xl bg-gradient-to-br from-slate-900/98 via-slate-800/95 to-slate-900/98
                 border-2 rounded-2xl p-5 shadow-2xl min-w-[280px]"
      style={{
        borderColor: `${colorScheme[0]}40`,
        boxShadow: `0 25px 50px -12px ${colorScheme[0]}30, 0 0 0 1px ${colorScheme[0]}20`,
      }}
    >
      {/* Fecha */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
        <Calendar className="w-4 h-4" style={{ color: colorScheme[0] }} />
        <p className="font-bold text-white text-sm">{label}</p>
      </div>

      {/* Métricas principales */}
      <div className="space-y-3">
        {/* Ingresos */}
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: colorScheme[0],
                boxShadow: `0 0 10px ${colorScheme[0]}80`,
              }}
            />
            <span className="text-slate-300 text-xs font-semibold">Ingresos</span>
          </div>
          <span className="text-white font-mono font-bold text-sm">
            ${ingresos.toLocaleString('es-MX')}
          </span>
        </motion.div>

        {/* Gastos */}
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: colorScheme[1],
                boxShadow: `0 0 10px ${colorScheme[1]}80`,
              }}
            />
            <span className="text-slate-300 text-xs font-semibold">Gastos</span>
          </div>
          <span className="text-white font-mono font-bold text-sm">
            ${gastos.toLocaleString('es-MX')}
          </span>
        </motion.div>

        {/* Balance */}
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: colorScheme[2],
                boxShadow: `0 0 10px ${colorScheme[2]}80`,
              }}
            />
            <span className="text-slate-300 text-xs font-semibold">RF Actual</span>
          </div>
          <span className="text-white font-mono font-bold text-sm">
            ${balance.toLocaleString('es-MX')}
          </span>
        </motion.div>
      </div>

      {/* Análisis inteligente */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 pt-3 border-t border-white/10"
      >
        <div className="flex items-center gap-2 mb-2">
          {tendencia === 'positiva' ? (
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          ) : tendencia === 'negativa' ? (
            <TrendingDown className="w-4 h-4 text-red-400" />
          ) : (
            <DollarSign className="w-4 h-4 text-amber-400" />
          )}
          <span className="text-xs font-semibold text-slate-400">Análisis</span>
        </div>
        <p
          className={`text-xs font-medium ${
            tendencia === 'positiva'
              ? 'text-emerald-400'
              : tendencia === 'negativa'
                ? 'text-red-400'
                : 'text-amber-400'
          }`}
        >
          {tendencia === 'positiva'
            ? `Superávit de $${Math.abs(diferencia).toLocaleString('es-MX')}`
            : tendencia === 'negativa'
              ? `Déficit de $${Math.abs(diferencia).toLocaleString('es-MX')}`
              : 'Balance equilibrado'}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {tendencia === 'positiva'
            ? 'El capital está creciendo'
            : tendencia === 'negativa'
              ? 'El capital está disminuyendo'
              : 'Estabilidad financiera'}
        </p>
      </motion.div>
    </motion.div>
  );
});

TooltipSupremo.displayName = 'TooltipSupremo';

// ============================================
// GRÁFICO MAESTRO INTERACTIVO
// ============================================
export const GraficoMaestroInteractivo = memo(
  ({ ingresos = [], gastos = [], cortes = [], colorScheme, titulo = 'Análisis Financiero' }) => {
    const [rangoFechas, setRangoFechas] = useState('todo'); // todo, mes, trimestre, semestre, año
    const [zoomLevel, setZoomLevel] = useState(1);

    // Procesar datos para el gráfico
    const datosGrafico = useMemo(() => {
      // Combinar todos los datos por fecha
      const datosPorFecha = {};

      // Procesar ingresos
      ingresos.forEach((ing) => {
        const fecha = ing.fecha;
        if (!datosPorFecha[fecha]) {
          datosPorFecha[fecha] = { fecha, ingresos: 0, gastos: 0 };
        }
        datosPorFecha[fecha].ingresos += parseFloat(ing.ingreso) || 0;
      });

      // Procesar gastos
      gastos.forEach((gasto) => {
        const fecha = gasto.fecha;
        if (!datosPorFecha[fecha]) {
          datosPorFecha[fecha] = { fecha, ingresos: 0, gastos: 0 };
        }
        datosPorFecha[fecha].gastos += parseFloat(gasto.gasto) || 0;
      });

      // Convertir a array y ordenar por fecha
      let datos = Object.values(datosPorFecha).sort(
        (a, b) => new Date(a.fecha) - new Date(b.fecha)
      );

      // Calcular balance acumulado (RF Actual)
      let balanceAcumulado = 0;
      datos = datos.map((d) => {
        balanceAcumulado += d.ingresos - d.gastos;
        return {
          ...d,
          balance: balanceAcumulado,
          diferencia: d.ingresos - d.gastos,
        };
      });

      // Aplicar filtro de rango
      const hoy = new Date();
      const filtrarPorRango = (dato) => {
        const fecha = new Date(dato.fecha);
        switch (rangoFechas) {
          case 'mes':
            return (hoy - fecha) / (1000 * 60 * 60 * 24) <= 30;
          case 'trimestre':
            return (hoy - fecha) / (1000 * 60 * 60 * 24) <= 90;
          case 'semestre':
            return (hoy - fecha) / (1000 * 60 * 60 * 24) <= 180;
          case 'año':
            return (hoy - fecha) / (1000 * 60 * 60 * 24) <= 365;
          default:
            return true;
        }
      };

      return datos.filter(filtrarPorRango);
    }, [ingresos, gastos, rangoFechas]);

    // Estadísticas para mostrar
    const estadisticas = useMemo(() => {
      const totalIngresos = datosGrafico.reduce((sum, d) => sum + d.ingresos, 0);
      const totalGastos = datosGrafico.reduce((sum, d) => sum + d.gastos, 0);
      const balanceFinal =
        datosGrafico.length > 0 ? datosGrafico[datosGrafico.length - 1].balance : 0;
      const tendencia = totalIngresos > totalGastos ? 'crecimiento' : 'decrecimiento';

      return { totalIngresos, totalGastos, balanceFinal, tendencia };
    }, [datosGrafico]);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full backdrop-blur-xl bg-gradient-to-br from-white/5 via-white/3 to-white/5
                   border border-white/10 rounded-3xl p-6 shadow-2xl"
        style={{
          boxShadow: `0 25px 50px -12px ${colorScheme[0]}15, 0 0 0 1px ${colorScheme[0]}10`,
        }}
      >
        {/* Header con controles */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h3
              className="text-2xl font-bold mb-2"
              style={{
                background: `linear-gradient(135deg, ${colorScheme[0]}, ${colorScheme[1]})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {titulo}
            </h3>
            <p className="text-sm text-slate-400">
              {datosGrafico.length} registros • Tendencia: {estadisticas.tendencia}
            </p>
          </div>

          {/* Controles de filtro */}
          <div className="flex flex-wrap items-center gap-2">
            {['todo', 'mes', 'trimestre', 'semestre', 'año'].map((rango) => (
              <motion.button
                key={rango}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRangoFechas(rango)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  rangoFechas === rango
                    ? 'text-white shadow-lg'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
                style={
                  rangoFechas === rango
                    ? {
                        background: `linear-gradient(135deg, ${colorScheme[0]}, ${colorScheme[1]})`,
                        boxShadow: `0 10px 25px -5px ${colorScheme[0]}40`,
                      }
                    : {}
                }
              >
                {rango === 'todo' ? 'Todo' : rango.charAt(0).toUpperCase() + rango.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/5"
          >
            <p className="text-xs text-slate-400 mb-1">Total Ingresos</p>
            <p className="text-xl font-bold" style={{ color: colorScheme[0] }}>
              ${estadisticas.totalIngresos.toLocaleString('es-MX')}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/5"
          >
            <p className="text-xs text-slate-400 mb-1">Total Gastos</p>
            <p className="text-xl font-bold" style={{ color: colorScheme[1] }}>
              ${estadisticas.totalGastos.toLocaleString('es-MX')}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/5"
          >
            <p className="text-xs text-slate-400 mb-1">RF Actual</p>
            <p className="text-xl font-bold" style={{ color: colorScheme[2] }}>
              ${estadisticas.balanceFinal.toLocaleString('es-MX')}
            </p>
          </motion.div>
        </div>

        {/* Gráfico principal */}
        <div className="relative">
          <ResponsiveContainer width="100%" height={450}>
            <ComposedChart
              data={datosGrafico}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                {/* Gradientes para las áreas */}
                <linearGradient id="gradientIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colorScheme[0]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={colorScheme[0]} stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="gradientGastos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colorScheme[1]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={colorScheme[1]} stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />

              <XAxis
                dataKey="fecha"
                stroke="rgba(255,255,255,0.3)"
                style={{ fontSize: '12px', fontWeight: 600 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />

              <YAxis
                stroke="rgba(255,255,255,0.3)"
                style={{ fontSize: '12px', fontWeight: 600 }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
                  return `$${value}`;
                }}
              />

              <Tooltip content={<TooltipSupremo colorScheme={colorScheme} />} />

              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-slate-300 text-sm font-semibold">{value}</span>
                )}
              />

              {/* Áreas de ingresos y gastos */}
              <Area
                type="monotone"
                dataKey="ingresos"
                stroke={colorScheme[0]}
                strokeWidth={3}
                fill="url(#gradientIngresos)"
                name="Ingresos"
                animationDuration={1500}
                animationEasing="ease-out"
              />

              <Area
                type="monotone"
                dataKey="gastos"
                stroke={colorScheme[1]}
                strokeWidth={3}
                fill="url(#gradientGastos)"
                name="Gastos"
                animationDuration={1500}
                animationEasing="ease-out"
              />

              {/* Línea de balance (RF Actual) */}
              <Line
                type="monotone"
                dataKey="balance"
                stroke={colorScheme[2]}
                strokeWidth={4}
                dot={{
                  fill: colorScheme[2],
                  strokeWidth: 2,
                  r: 5,
                  stroke: '#1e293b',
                }}
                activeDot={{
                  r: 8,
                  stroke: colorScheme[2],
                  strokeWidth: 3,
                  fill: '#1e293b',
                }}
                name="RF Actual (Balance)"
                animationDuration={2000}
                animationEasing="ease-in-out"
              />

              {/* Línea de referencia en 0 */}
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />

              {/* Brush para zoom/pan */}
              <Brush
                dataKey="fecha"
                height={30}
                stroke={colorScheme[0]}
                fill="rgba(255,255,255,0.05)"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Leyenda adicional con insights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/5"
        >
          <p className="text-xs text-slate-400 mb-2">💡 Insights del gráfico:</p>
          <ul className="text-xs text-slate-300 space-y-1">
            <li>
              • La línea <strong style={{ color: colorScheme[2] }}>RF Actual</strong> muestra tu
              capital disponible en el tiempo
            </li>
            <li>• Las áreas muestran la relación entre ingresos y gastos</li>
            <li>• Usa el brush inferior para hacer zoom en periodos específicos</li>
            <li>• Pasa el mouse sobre los puntos para ver análisis detallado</li>
          </ul>
        </motion.div>
      </motion.div>
    );
  }
);

GraficoMaestroInteractivo.displayName = 'GraficoMaestroInteractivo';

export default GraficoMaestroInteractivo;
