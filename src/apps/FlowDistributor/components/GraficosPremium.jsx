/**
 * 📊 GRÁFICOS PREMIUM ENTERPRISE - NIVEL SUPREMO
 * ===============================================
 * ✅ Dark-mode perfect
 * ✅ Animaciones suaves con Framer Motion
 * ✅ Hover effects premium
 * ✅ Tooltips informativos
 * ✅ Donut charts modernos
 * ✅ Micro-interacciones
 */
import { useState } from 'react';

import { motion } from 'framer-motion';
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
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// ============================================================================
// 🎨 COLORES PREMIUM - DARK MODE OPTIMIZED
// ============================================================================
export const COLORES_PREMIUM = {
  primario: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
  secundario: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'],
  acento: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'],
  peligro: ['#ef4444', '#f87171', '#fca5a5', '#fecaca'],
  info: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
  exito: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
  advertencia: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'],
  neutral: ['#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb'],

  // Gradientes vibrantes para gráficos
  multiSeries: [
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#f59e0b', // amber
    '#10b981', // emerald
    '#3b82f6', // blue
    '#6366f1', // indigo
    '#14b8a6', // teal
    '#f43f5e', // rose
    '#84cc16', // lime
    '#06b6d4', // cyan
  ],
};

// ============================================================================
// 🔧 TOOLTIP PREMIUM CON GLASSMORPHISM
// ============================================================================
const TooltipPremium = ({ active, payload, label, formatValue }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="backdrop-blur-xl bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95
                 rounded-2xl p-4 border-2 border-white/20 shadow-2xl shadow-purple-500/20"
    >
      <p className="font-bold text-white mb-3 text-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        {label}
      </p>
      <div className="space-y-2">
        {payload.map((entry, index) => (
          <motion.div
            key={`item-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-3 h-3 rounded-full shadow-lg"
                style={{ backgroundColor: entry.color }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-slate-300 text-xs font-medium">{entry.name}:</span>
            </div>
            <span className="text-white font-bold text-sm">
              {formatValue ? formatValue(entry.value) : `$${entry.value.toLocaleString()}`}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ============================================================================
// 📈 GRÁFICO DE LÍNEA - OPTIMIZED
// ============================================================================
export const GraficoLinea = ({
  datos,
  dataKey,
  xAxisKey = 'nombre',
  titulo,
  color = COLORES_PREMIUM.primario[0],
  altura = 300,
  mostrarGrid = true,
  mostrarLeyenda = false,
  formatValue,
  animacion = true,
}) => {
  const [_hoveredIndex, _setHoveredIndex] = useState(null);

  // ✅ VALIDACIÓN DEFENSIVA: Asegurar que datos sea un array válido
  const safeDatos = Array.isArray(datos) ? datos : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="w-full backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 shadow-2xl"
    >
      {titulo && (
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          📈 {titulo}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={altura}>
        <LineChart data={safeDatos} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          {mostrarGrid && <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />}
          <XAxis
            dataKey={xAxisKey}
            stroke="#94a3b8"
            style={{ fontSize: '12px', fontWeight: 600 }}
          />
          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: '12px', fontWeight: 600 }}
            tickFormatter={(value) =>
              formatValue ? formatValue(value) : `$${value.toLocaleString()}`
            }
          />
          <Tooltip content={<TooltipPremium formatValue={formatValue} />} />
          {mostrarLeyenda && <Legend wrapperStyle={{ color: '#fff' }} />}
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={3}
            dot={{ fill: color, r: 6, strokeWidth: 2, stroke: '#1e293b' }}
            activeDot={{ r: 10, stroke: color, strokeWidth: 3 }}
            animationDuration={animacion ? 1500 : 0}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// ============================================================================
// 📊 GRÁFICO DE BARRAS - OPTIMIZED
// ============================================================================
export const GraficoBarras = ({
  datos,
  dataKeys = [],
  xAxisKey = 'nombre',
  titulo,
  altura = 300,
  mostrarGrid = true,
  mostrarLeyenda = true,
  formatValue,
  animacion = true,
  horizontal = false,
}) => {
  const [_hoveredBar, setHoveredBar] = useState(null);

  // ✅ VALIDACIÓN DEFENSIVA: Asegurar que sean arrays válidos
  const safeDatos = Array.isArray(datos) ? datos : [];
  const safeDataKeys = Array.isArray(dataKeys) ? dataKeys : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="w-full backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 shadow-2xl"
    >
      {titulo && (
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          📊 {titulo}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={altura}>
        <BarChart
          data={safeDatos}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          layout={horizontal ? 'horizontal' : 'vertical'}
          onMouseMove={(state) => {
            if (state.isTooltipActive) {
              setHoveredBar(state.activeTooltipIndex);
            } else {
              setHoveredBar(null);
            }
          }}
          onMouseLeave={() => setHoveredBar(null)}
        >
          {mostrarGrid && <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />}
          {!horizontal ? (
            <>
              <XAxis
                dataKey={xAxisKey}
                stroke="#94a3b8"
                style={{ fontSize: '12px', fontWeight: 600 }}
              />
              <YAxis
                stroke="#94a3b8"
                style={{ fontSize: '12px', fontWeight: 600 }}
                tickFormatter={(value) =>
                  formatValue ? formatValue(value) : `$${value.toLocaleString()}`
                }
              />
            </>
          ) : (
            <>
              <XAxis
                type="number"
                stroke="#94a3b8"
                style={{ fontSize: '12px', fontWeight: 600 }}
                tickFormatter={(value) =>
                  formatValue ? formatValue(value) : `$${value.toLocaleString()}`
                }
              />
              <YAxis
                dataKey={xAxisKey}
                type="category"
                stroke="#94a3b8"
                style={{ fontSize: '12px', fontWeight: 600 }}
              />
            </>
          )}
          <Tooltip content={<TooltipPremium formatValue={formatValue} />} />
          {mostrarLeyenda && <Legend wrapperStyle={{ color: '#fff' }} />}
          {safeDataKeys.map((item, idx) => (
            <Bar
              key={item.key}
              dataKey={item.key}
              fill={
                item.color || COLORES_PREMIUM.multiSeries[idx % COLORES_PREMIUM.multiSeries.length]
              }
              name={item.nombre || item.key}
              radius={[8, 8, 0, 0]}
              animationDuration={animacion ? 1200 : 0}
              animationEasing="ease-out"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// ============================================================================
// 🍩 GRÁFICO DONUT MODERNO - REEMPLAZO DE PIE CHART
// ============================================================================
export const GraficoDonut = ({
  datos,
  dataKey = 'valor',
  nameKey = 'nombre',
  titulo,
  altura = 350,
  mostrarLeyenda = true,
  formatValue,
  animacion = true,
  colores = COLORES_PREMIUM.multiSeries,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // ✅ VALIDACIÓN DEFENSIVA: Asegurar que datos sea un array válido
  const safeDatos = Array.isArray(datos) ? datos : [];

  const total = safeDatos.reduce((sum, entry) => sum + entry[dataKey], 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="w-full backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 shadow-2xl"
    >
      {titulo && (
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          🍩 {titulo}
        </h3>
      )}
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={altura}>
          <PieChart>
            <Pie
              data={safeDatos}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={2}
              animationDuration={animacion ? 1500 : 0}
              animationEasing="ease-out"
              onMouseEnter={(_, index) => setActiveIndex(index)}
            >
              {safeDatos.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colores[index % colores.length]}
                  stroke={index === activeIndex ? '#fff' : 'transparent'}
                  strokeWidth={index === activeIndex ? 3 : 0}
                  style={{
                    filter:
                      index === activeIndex
                        ? 'brightness(1.2) drop-shadow(0 0 10px currentColor)'
                        : 'none',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<TooltipPremium formatValue={formatValue} />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Centro del donut con información */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-4">
          <motion.p
            key={activeIndex}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-bold text-white"
          >
            {formatValue
              ? formatValue(safeDatos[activeIndex]?.[dataKey] || 0)
              : `$${(safeDatos[activeIndex]?.[dataKey] || 0).toLocaleString()}`}
          </motion.p>
          <p className="text-sm text-slate-400 mt-1">
            {safeDatos[activeIndex]?.[nameKey] || 'Total'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {((safeDatos[activeIndex]?.[dataKey] / total) * 100).toFixed(1)}%
          </p>
        </div>

        {/* Leyenda personalizada con porcentajes */}
        {mostrarLeyenda && (
          <div className="grid grid-cols-2 gap-3 mt-6 w-full">
            {safeDatos.map((entry, index) => (
              <motion.div
                key={`legend-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-2 p-2 rounded-lg transition-all cursor-pointer ${
                  index === activeIndex ? 'bg-white/10 scale-105' : 'hover:bg-white/5'
                }`}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div
                  className="w-4 h-4 rounded-full shadow-lg"
                  style={{ backgroundColor: colores[index % colores.length] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-300 truncate">{entry[nameKey]}</p>
                  <p className="text-sm font-bold text-white">
                    {formatValue
                      ? formatValue(entry[dataKey])
                      : `$${entry[dataKey].toLocaleString()}`}
                    <span className="text-xs text-slate-400 ml-1">
                      ({((entry[dataKey] / total) * 100).toFixed(1)}%)
                    </span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Alias para compatibilidad
export const GraficoPastel = GraficoDonut;

// ============================================================================
// 📈 GRÁFICO DE ÁREA - OPTIMIZED
// ============================================================================
export const GraficoArea = ({
  datos,
  dataKeys = [],
  xAxisKey = 'nombre',
  titulo,
  altura = 300,
  mostrarGrid = true,
  mostrarLeyenda = true,
  formatValue,
  animacion = true,
  apilado = false,
}) => {
  // ✅ VALIDACIÓN DEFENSIVA: Asegurar que sean arrays válidos
  const safeDatos = Array.isArray(datos) ? datos : [];
  const safeDataKeys = Array.isArray(dataKeys) ? dataKeys : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="w-full backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 shadow-2xl"
    >
      {titulo && (
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          📈 {titulo}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={altura}>
        <AreaChart data={safeDatos} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            {safeDataKeys.map((item, idx) => (
              <linearGradient
                key={`gradient-${idx}`}
                id={`gradient-${item.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={
                    item.color ||
                    COLORES_PREMIUM.multiSeries[idx % COLORES_PREMIUM.multiSeries.length]
                  }
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={
                    item.color ||
                    COLORES_PREMIUM.multiSeries[idx % COLORES_PREMIUM.multiSeries.length]
                  }
                  stopOpacity={0.1}
                />
              </linearGradient>
            ))}
          </defs>
          {mostrarGrid && <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />}
          <XAxis
            dataKey={xAxisKey}
            stroke="#94a3b8"
            style={{ fontSize: '12px', fontWeight: 600 }}
          />
          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: '12px', fontWeight: 600 }}
            tickFormatter={(value) =>
              formatValue ? formatValue(value) : `$${value.toLocaleString()}`
            }
          />
          <Tooltip content={<TooltipPremium formatValue={formatValue} />} />
          {mostrarLeyenda && <Legend wrapperStyle={{ color: '#fff' }} />}
          {safeDataKeys.map((item, idx) => (
            <Area
              key={item.key}
              type="monotone"
              dataKey={item.key}
              stroke={
                item.color || COLORES_PREMIUM.multiSeries[idx % COLORES_PREMIUM.multiSeries.length]
              }
              fill={`url(#gradient-${item.key})`}
              strokeWidth={2}
              name={item.nombre || item.key}
              stackId={apilado ? '1' : undefined}
              animationDuration={animacion ? 1200 : 0}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// ============================================================================
// 📊 GRÁFICO COMBINADO - OPTIMIZED
// ============================================================================
export const GraficoCombinado = ({
  datos,
  barras = [],
  lineas = [],
  xAxisKey = 'nombre',
  titulo,
  altura = 300,
  mostrarGrid = true,
  mostrarLeyenda = true,
  formatValue,
  animacion = true,
}) => {
  // ✅ VALIDACIÓN DEFENSIVA: Asegurar que sean arrays válidos
  const safeDatos = Array.isArray(datos) ? datos : [];
  const safeBarras = Array.isArray(barras) ? barras : [];
  const safeLineas = Array.isArray(lineas) ? lineas : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="w-full backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 shadow-2xl"
    >
      {titulo && (
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
          📊 {titulo}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={altura}>
        <BarChart data={safeDatos} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          {mostrarGrid && <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />}
          <XAxis
            dataKey={xAxisKey}
            stroke="#94a3b8"
            style={{ fontSize: '12px', fontWeight: 600 }}
          />
          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: '12px', fontWeight: 600 }}
            tickFormatter={(value) =>
              formatValue ? formatValue(value) : `$${value.toLocaleString()}`
            }
          />
          <Tooltip content={<TooltipPremium formatValue={formatValue} />} />
          {mostrarLeyenda && <Legend wrapperStyle={{ color: '#fff' }} />}

          {safeBarras.map((item, idx) => (
            <Bar
              key={item.key}
              dataKey={item.key}
              fill={
                item.color || COLORES_PREMIUM.multiSeries[idx % COLORES_PREMIUM.multiSeries.length]
              }
              name={item.nombre || item.key}
              radius={[8, 8, 0, 0]}
              animationDuration={animacion ? 1200 : 0}
            />
          ))}

          {safeLineas.map((item, idx) => (
            <Line
              key={item.key}
              type="monotone"
              dataKey={item.key}
              stroke={
                item.color ||
                COLORES_PREMIUM.multiSeries[
                  (safeBarras.length + idx) % COLORES_PREMIUM.multiSeries.length
                ]
              }
              strokeWidth={3}
              dot={{ fill: item.color, r: 6 }}
              name={item.nombre || item.key}
              animationDuration={animacion ? 1200 : 0}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// ============================================================================
// 📊 KPI CARD PREMIUM CON MINI GRÁFICO
// ============================================================================
export const KPIConGrafico = ({
  titulo,
  valor,
  cambio,
  datos,
  dataKey,
  formatValue,
  icono: Icono,
  color = 'green',
}) => {
  const colores = {
    green: { from: 'from-green-500', to: 'to-emerald-500', text: 'text-green-400' },
    blue: { from: 'from-blue-500', to: 'to-cyan-500', text: 'text-blue-400' },
    purple: { from: 'from-purple-500', to: 'to-pink-500', text: 'text-purple-400' },
    orange: { from: 'from-orange-500', to: 'to-amber-500', text: 'text-orange-400' },
    red: { from: 'from-red-500', to: 'to-rose-500', text: 'text-red-400' },
  };

  const colorConfig = colores[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="backdrop-blur-xl bg-white/5 rounded-2xl p-6
                 border border-white/10 shadow-2xl hover:shadow-purple-500/20 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-slate-400 mb-1">{titulo}</p>
          <motion.p
            className={`text-3xl font-black ${colorConfig.text}`}
            key={valor}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
          >
            {formatValue ? formatValue(valor) : `$${valor.toLocaleString()}`}
          </motion.p>
          {cambio !== undefined && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-1 mt-2 ${cambio >= 0 ? 'text-green-400' : 'text-red-400'}`}
            >
              <span className="text-sm font-bold">
                {cambio >= 0 ? '↑' : '↓'} {Math.abs(cambio)}%
              </span>
              <span className="text-xs text-slate-500">vs anterior</span>
            </motion.div>
          )}
        </div>
        {Icono && (
          <motion.div
            className={`p-3 bg-gradient-to-br ${colorConfig.from} ${colorConfig.to} rounded-xl shadow-lg`}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icono className="w-6 h-6 text-white" />
          </motion.div>
        )}
      </div>

      {datos && datos.length > 0 && (
        <div className="h-16 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={datos}>
              <defs>
                <linearGradient id={`kpi-gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={
                      COLORES_PREMIUM[
                        color === 'green'
                          ? 'exito'
                          : color === 'blue'
                            ? 'info'
                            : color === 'red'
                              ? 'peligro'
                              : 'primario'
                      ][0]
                    }
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={
                      COLORES_PREMIUM[
                        color === 'green'
                          ? 'exito'
                          : color === 'blue'
                            ? 'info'
                            : color === 'red'
                              ? 'peligro'
                              : 'primario'
                      ][0]
                    }
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={
                  COLORES_PREMIUM[
                    color === 'green'
                      ? 'exito'
                      : color === 'blue'
                        ? 'info'
                        : color === 'red'
                          ? 'peligro'
                          : 'primario'
                  ][0]
                }
                fill={`url(#kpi-gradient-${color})`}
                strokeWidth={2}
                dot={false}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default {
  GraficoLinea,
  GraficoBarras,
  GraficoDonut,
  GraficoPastel,
  GraficoArea,
  GraficoCombinado,
  KPIConGrafico,
  COLORES_PREMIUM,
};
