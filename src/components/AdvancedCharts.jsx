
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Funnel,
  FunnelChart,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';

// 🎨 Color Palettes
const COLORS = {
  primary: ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'],
  gradient: ['#6366F1', '#8B5CF6', '#D946EF', '#EC4899', '#F43F5E'],
  heatmap: [
    '#1E3A8A',
    '#3B82F6',
    '#60A5FA',
    '#93C5FD',
    '#DBEAFE',
    '#FEF3C7',
    '#FDE047',
    '#FACC15',
    '#F59E0B',
    '#DC2626',
  ],
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
};

// 📊 Heatmap Component for Sales Patterns
export const SalesHeatmap = ({ data, width = '100%', height = 400 }) => {
  // Transform data for heatmap (day of week vs hour)
  const processHeatmapData = (salesData) => {
    const matrix = Array(7)
      .fill(0)
      .map(() => Array(24).fill(0));
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    salesData.forEach((sale) => {
      if (!sale.fecha) return;
      const date = new Date(sale.fecha);
      const day = date.getDay();
      const hour = date.getHours();
      matrix[day][hour] += sale.totalVenta || 0;
    });

    // Convert to format for chart
    const heatmapData = [];
    for (let hour = 0; hour < 24; hour++) {
      const row = { hour: `${hour}:00` };
      days.forEach((day, _idx) => {
        row[day] = matrix[_idx][hour];
      });
      heatmapData.push(row);
    }
    return { heatmapData, days };
  };

  const { heatmapData, days } = processHeatmapData(data);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 border border-white/10"
    >
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="text-2xl">📈</span>
        Mapa de Calor de Ventas
        <span className="text-sm text-slate-400 font-normal ml-2">(por día y hora)</span>
      </h3>

      <div className="overflow-x-auto">
        <ResponsiveContainer width={width} height={height}>
          <AreaChart data={heatmapData}>
            <defs>
              {days.map((day, _idx) => (
                <linearGradient key={day} id={`color${day}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary[_idx]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS.primary[_idx]} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="hour" stroke="#9CA3AF" tick={{ fontSize: 11 }} interval={3} />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
              }}
              formatter={(value) => `$${value.toLocaleString()}`}
            />
            <Legend />
            {days.map((day, _idx) => (
              <Area
                key={day}
                type="monotone"
                dataKey={day}
                stackId="1"
                stroke={COLORS.primary[_idx]}
                fill={`url(#color${day})`}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-sm text-slate-400">
        <p className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-purple-500"></span>
          Colores más intensos = Mayor volumen de ventas
        </p>
      </div>
    </motion.div>
  );
};

// 🎯 Gauge Chart for KPIs
export const GaugeChart = ({ value, max, title, subtitle, color = COLORS.info }) => {
  const percentage = (value / max) * 100;
  const radius = 120;
  const strokeWidth = 15;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color based on percentage
  const getColor = () => {
    if (percentage >= 80) return COLORS.success;
    if (percentage >= 50) return COLORS.warning;
    return COLORS.danger;
  };

  const gaugeColor = getColor();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="glass rounded-2xl p-6 border border-white/10 text-center"
    >
      <h3 className="text-lg font-bold mb-4">{title}</h3>

      <div className="relative inline-flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            stroke="#1F2937"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <motion.circle
            stroke={gaugeColor}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="text-4xl font-bold"
            style={{ color: gaugeColor }}
          >
            {percentage.toFixed(0)}%
          </motion.p>
          <p className="text-sm text-slate-400 mt-1">
            {value.toLocaleString()} / {max.toLocaleString()}
          </p>
        </div>
      </div>

      {subtitle && <p className="text-sm text-slate-400 mt-4">{subtitle}</p>}
    </motion.div>
  );
};

// 🔻 Funnel Chart for Conversion
export const ConversionFunnel = ({ data, width = '100%', height = 400 }) => {
  const funnelData = data.map((item, _idx) => ({
    ...item,
    fill: COLORS.gradient[_idx % COLORS.gradient.length],
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 border border-white/10"
    >
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="text-2xl">🔻</span>
        Embudo de Conversión
      </h3>

      <ResponsiveContainer width={width} height={height}>
        <FunnelChart>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
            }}
          />
          <Funnel dataKey="value" data={funnelData} isAnimationActive>
            <LabelList position="right" fill="#fff" stroke="none" dataKey="name" />
            <LabelList position="center" fill="#000" stroke="none" dataKey="value" />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-green-500/10 rounded-xl border border-green-500/20">
          <p className="text-sm text-slate-400">Tasa de Conversión</p>
          <p className="text-2xl font-bold text-green-400">
            {data.length > 0 ? ((data[data.length - 1].value / data[0].value) * 100).toFixed(1) : 0}
            %
          </p>
        </div>
        <div className="text-center p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <p className="text-sm text-slate-400">Pérdida Total</p>
          <p className="text-2xl font-bold text-blue-400">
            {data.length > 0 ? (data[0].value - data[data.length - 1].value).toLocaleString() : 0}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// 📊 Comparison Chart (This Period vs Last Period)
export const PeriodComparison = ({
  currentData,
  previousData,
  metricName,
  width = '100%',
  height = 350,
}) => {
  const comparisonData = currentData.map((item, _idx) => ({
    name: item.name || item.mes || item.fecha,
    actual: item.value || item.total || 0,
    anterior: previousData[_idx]?.value || previousData[_idx]?.total || 0,
  }));

  const totalActual = comparisonData.reduce((sum, item) => sum + item.actual, 0);
  const totalAnterior = comparisonData.reduce((sum, item) => sum + item.anterior, 0);
  const difference = totalActual - totalAnterior;
  const percentageChange = totalAnterior > 0 ? (difference / totalAnterior) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 border border-white/10"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Comparativa de Períodos
          </h3>
          <p className="text-sm text-slate-400 mt-1">{metricName}</p>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className={`px-4 py-2 rounded-xl font-bold ${
            percentageChange >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}
        >
          {percentageChange >= 0 ? '↑' : '↓'} {Math.abs(percentageChange).toFixed(1)}%
        </motion.div>
      </div>

      <ResponsiveContainer width={width} height={height}>
        <ComposedChart data={comparisonData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
            }}
            formatter={(value) => `$${value.toLocaleString()}`}
          />
          <Legend />
          <Bar dataKey="anterior" fill="#6B7280" name="Período Anterior" radius={[8, 8, 0, 0]} />
          <Bar dataKey="actual" fill="#8B5CF6" name="Período Actual" radius={[8, 8, 0, 0]} />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#EC4899"
            strokeWidth={3}
            dot={{ fill: '#EC4899', r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
          <p className="text-sm text-slate-400">Actual</p>
          <p className="text-xl font-bold text-purple-400">${totalActual.toLocaleString()}</p>
        </div>
        <div className="text-center p-3 bg-slate-500/10 rounded-xl border border-slate-500/20">
          <p className="text-sm text-slate-400">Anterior</p>
          <p className="text-xl font-bold text-slate-400">${totalAnterior.toLocaleString()}</p>
        </div>
        <div
          className={`text-center p-3 rounded-xl border ${
            difference >= 0
              ? 'bg-green-500/10 border-green-500/20'
              : 'bg-red-500/10 border-red-500/20'
          }`}
        >
          <p className="text-sm text-slate-400">Diferencia</p>
          <p className={`text-xl font-bold ${difference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${Math.abs(difference).toLocaleString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// 🎯 Radar Chart for Multi-Dimensional Analysis
export const RadarAnalysis = ({ data, categories, width = '100%', height = 400 }) => {
  const radarData = categories.map((category) => ({
    category,
    actual: data.actual[category] || 0,
    objetivo: data.objetivo[category] || 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 border border-white/10"
    >
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="text-2xl">🎯</span>
        Análisis Multi-Dimensional
      </h3>

      <ResponsiveContainer width={width} height={height}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="category" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis stroke="#9CA3AF" />
          <Radar name="Actual" dataKey="actual" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
          <Radar
            name="Objetivo"
            dataKey="objetivo"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.3}
          />
          <Legend />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// 📈 Trend Prediction Chart
export const TrendPrediction = ({ historicalData, predictions, width = '100%', height = 350 }) => {
  const combinedData = [
    ...historicalData.map((item) => ({ ...item, type: 'historical' })),
    ...predictions.map((item) => ({ ...item, type: 'prediction' })),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 border border-white/10"
    >
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="text-2xl">🔮</span>
        Tendencia y Proyección
      </h3>

      <ResponsiveContainer width={width} height={height}>
        <AreaChart data={combinedData}>
          <defs>
            <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
            }}
            formatter={(value) => `$${value.toLocaleString()}`}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8B5CF6"
            fillOpacity={1}
            fill="url(#colorHistorical)"
            name="Histórico"
          />
          <Area
            type="monotone"
            dataKey="predicted"
            stroke="#F59E0B"
            strokeDasharray="5 5"
            fillOpacity={1}
            fill="url(#colorPrediction)"
            name="Proyección"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
        <p className="text-sm text-yellow-400 flex items-center gap-2">
          <span className="text-lg">⚠️</span>
          Las proyecciones están basadas en tendencias históricas y pueden variar según condiciones
          del mercado.
        </p>
      </div>
    </motion.div>
  );
};

export default {
  SalesHeatmap,
  GaugeChart,
  ConversionFunnel,
  PeriodComparison,
  RadarAnalysis,
  TrendPrediction,
};
