/**
 * 📊 GraficosFleteSur.jsx
 * Visualizaciones específicas para el panel de Flete Sur
 *
 * Features:
 * - Gráfico de evolución de ingresos vs gastos
 * - Gráfico de tendencia de RF históricos
 * - Gráfico de distribución de gastos por origen
 * - Animaciones suaves con Framer Motion
 */
import { useMemo } from 'react';

import { motion } from 'framer-motion';
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon } from 'lucide-react';
import PropTypes from 'prop-types';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Colores premium
const COLORES = {
  ingreso: '#10b981',
  gasto: '#ef4444',
  rf: '#3b82f6',
  gradient: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#14b8a6'],
};

// Tooltip personalizado
const TooltipPremium = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="backdrop-blur-xl bg-slate-900/90 border border-slate-700/50 rounded-xl p-4 shadow-2xl">
      <p className="text-sm font-semibold text-slate-300 mb-2">{label}</p>
      {payload.map((entry) => (
        <div
          key={`${entry.dataKey}-${entry.name}`}
          className="flex items-center justify-between gap-4 mb-1"
        >
          <span className="text-xs text-slate-400">{entry.name}:</span>
          <span className="text-sm font-bold" style={{ color: entry.color }}>
            $
            {Number.parseFloat(entry.value).toLocaleString('es-MX', {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
      ))}
    </div>
  );
};

// ✅ PropTypes para TooltipPremium
TooltipPremium.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string,
      name: PropTypes.string,
      value: PropTypes.number,
      color: PropTypes.string,
    })
  ),
  label: PropTypes.string,
};

/**
 * Gráfico de Ingresos vs Gastos por mes
 */
export const GraficoIngresosVsGastos = ({ ingresos, gastos }) => {
  const datosGrafico = useMemo(() => {
    // Agrupar por mes
    const agrupadoPorMes = {};

    // ✅ Cambiado forEach por for...of
    for (const item of ingresos) {
      const fecha = new Date(item.fecha);
      const mes = fecha.toLocaleDateString('es-MX', { year: 'numeric', month: 'short' });
      if (!agrupadoPorMes[mes]) {
        agrupadoPorMes[mes] = { mes, ingresos: 0, gastos: 0 };
      }
      agrupadoPorMes[mes].ingresos += item.ingreso || 0;
    }

    for (const item of gastos) {
      const fecha = new Date(item.fecha);
      const mes = fecha.toLocaleDateString('es-MX', { year: 'numeric', month: 'short' });
      if (!agrupadoPorMes[mes]) {
        agrupadoPorMes[mes] = { mes, ingresos: 0, gastos: 0 };
      }
      agrupadoPorMes[mes].gastos += item.gasto || 0;
    }

    return Object.values(agrupadoPorMes).sort(
      (a, b) => new Date(a.mes).getTime() - new Date(b.mes).getTime()
    );
  }, [ingresos, gastos]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-zinc-300" />
        <h3 className="text-xl font-bold text-white">Ingresos vs Gastos Mensuales</h3>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={datosGrafico}>
          <defs>
            <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORES.ingreso} stopOpacity={0.8} />
              <stop offset="95%" stopColor={COLORES.ingreso} stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORES.gasto} stopOpacity={0.8} />
              <stop offset="95%" stopColor={COLORES.gasto} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="mes" stroke="#9ca3af" fontSize={12} />
          <YAxis
            stroke="#9ca3af"
            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<TooltipPremium />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
            formatter={(value) => <span className="text-slate-300">{value}</span>}
          />
          <Area
            type="monotone"
            dataKey="ingresos"
            name="Ingresos"
            stroke={COLORES.ingreso}
            fillOpacity={1}
            fill="url(#colorIngresos)"
            strokeWidth={3}
          />
          <Area
            type="monotone"
            dataKey="gastos"
            name="Gastos"
            stroke={COLORES.gasto}
            fillOpacity={1}
            fill="url(#colorGastos)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

/**
 * Gráfico de tendencia de RF Históricos
 */
export const GraficoRFHistorico = ({ rfActual }) => {
  const datosGrafico = useMemo(() => {
    return rfActual
      .map((item) => ({
        fecha: new Date(item.fecha).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }),
        monto: item.corte,
      }))
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }, [rfActual]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="backdrop-blur-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <LineChartIcon className="w-6 h-6 text-zinc-200" />
        <h3 className="text-xl font-bold text-white">Evolución de RF (5 Cortes)</h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={datosGrafico}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="fecha" stroke="#9ca3af" fontSize={12} />
          <YAxis
            stroke="#9ca3af"
            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<TooltipPremium />} />
          <Line
            type="monotone"
            dataKey="monto"
            name="RF"
            stroke={COLORES.rf}
            strokeWidth={3}
            dot={{ fill: COLORES.rf, r: 6 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

/**
 * Gráfico de distribución de gastos por origen
 */
export const GraficoDistribucionGastos = ({ gastos }) => {
  const datosGrafico = useMemo(() => {
    const agrupadoPorOrigen = {};

    // ✅ Cambiado forEach por for...of
    for (const item of gastos) {
      const origen = item.origen || 'Sin origen';
      if (!agrupadoPorOrigen[origen]) {
        agrupadoPorOrigen[origen] = 0;
      }
      agrupadoPorOrigen[origen] += item.gasto || 0;
    }

    return Object.entries(agrupadoPorOrigen)
      .map(([nombre, valor]) => ({ nombre, valor }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 10); // Top 10 orígenes
  }, [gastos]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="backdrop-blur-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <PieChartIcon className="w-6 h-6 text-zinc-200" />
        <h3 className="text-xl font-bold text-white">Top 10 Gastos por Origen</h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datosGrafico} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis
            type="number"
            stroke="#9ca3af"
            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <YAxis dataKey="nombre" type="category" stroke="#9ca3af" fontSize={11} width={150} />
          <Tooltip content={<TooltipPremium />} />
          <Bar dataKey="valor" name="Monto" radius={[0, 8, 8, 0]}>
            {datosGrafico.map((entry, index) => (
              <Cell
                key={`cell-${entry.nombre}-${entry.valor}`}
                fill={COLORES.gradient[index % COLORES.gradient.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

/**
 * Panel completo de gráficos para Flete Sur
 */
export const PanelGraficosFleteSur = ({ datosFleteSur }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 mb-8"
    >
      <h2 className="text-2xl font-bold text-white mb-4">📊 Análisis Visual</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GraficoIngresosVsGastos ingresos={datosFleteSur.ingresos} gastos={datosFleteSur.gastos} />
        <GraficoRFHistorico rfActual={datosFleteSur.rfActual} />
      </div>

      <GraficoDistribucionGastos gastos={datosFleteSur.gastos} />
    </motion.div>
  );
};

// ✅ PropTypes para GraficoIngresosVsGastos
GraficoIngresosVsGastos.propTypes = {
  ingresos: PropTypes.arrayOf(
    PropTypes.shape({
      fecha: PropTypes.string.isRequired,
      ingreso: PropTypes.number,
    })
  ).isRequired,
  gastos: PropTypes.arrayOf(
    PropTypes.shape({
      fecha: PropTypes.string.isRequired,
      gasto: PropTypes.number,
    })
  ).isRequired,
};

// ✅ PropTypes para GraficoRFHistorico
GraficoRFHistorico.propTypes = {
  rfActual: PropTypes.arrayOf(
    PropTypes.shape({
      fecha: PropTypes.string.isRequired,
      corte: PropTypes.number.isRequired,
    })
  ).isRequired,
};

// ✅ PropTypes para GraficoDistribucionGastos
GraficoDistribucionGastos.propTypes = {
  gastos: PropTypes.arrayOf(
    PropTypes.shape({
      origen: PropTypes.string,
      gasto: PropTypes.number,
    })
  ).isRequired,
};

// ✅ PropTypes para PanelGraficosFleteSur
PanelGraficosFleteSur.propTypes = {
  datosFleteSur: PropTypes.shape({
    ingresos: PropTypes.array.isRequired,
    gastos: PropTypes.array.isRequired,
    rfActual: PropTypes.array.isRequired,
  }).isRequired,
};
