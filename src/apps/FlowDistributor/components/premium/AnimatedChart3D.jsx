/**
 * 📊 ANIMATED CHART 3D
 * Sistema de gráficos 3D isométricos con animaciones premium
 * - Barras 3D con sombras y reflejos
 * - Líneas 3D con profundidad
 * - Áreas con gradientes holográficos
 * - Tooltips interactivos premium
 */
import { useMemo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';

import { formatCurrency } from '../../utils/formatters';

/**
 * Gráfico de Barras 3D Isométrico
 */
export const BarChart3D = ({ data, height = 300, color = 'primary' }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Normalizar datos
  const maxValue = useMemo(() => {
    return Math.max(...data.map((d) => d.value), 1);
  }, [data]);

  const chartHeight = height - 60; // Espacio para labels

  return (
    <div className="relative" style={{ height: `${height}px` }}>
      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none">
        {[0, 25, 50, 75, 100].map((percentage) => (
          <div
            key={percentage}
            className="absolute left-0 right-0 border-t border-white/5"
            style={{ top: `${100 - percentage}%` }}
          >
            <span className="absolute -left-12 -top-2 text-xs text-white/40">
              {formatCurrency((maxValue * percentage) / 100)}
            </span>
          </div>
        ))}
      </div>

      {/* Barras 3D */}
      <div className="absolute inset-x-0 bottom-10 flex items-end justify-around gap-2 px-4">
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const isHovered = hoveredIndex === index;

          return (
            <motion.div
              key={item.label}
              className="relative flex-1 max-w-[80px] cursor-pointer group"
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              initial={{ height: 0 }}
              animate={{ height: barHeight }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
            >
              {/* Barra 3D principal */}
              <div className="relative w-full h-full">
                {/* Cara frontal */}
                <motion.div
                  className={`
                    absolute inset-0 rounded-t-lg
                    bg-gradient-to-b from-${color}/80 to-${color}/40
                    border border-${color}/30
                    shadow-lg shadow-${color}/20
                  `}
                  animate={{
                    scale: isHovered ? 1.05 : 1,
                    y: isHovered ? -5 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                />

                {/* Cara derecha (perspectiva) */}
                <div
                  className={`
                    absolute -right-2 top-2 w-2 h-full
                    bg-gradient-to-b from-${color}/60 to-${color}/20
                    transform skew-y-[-45deg] origin-top-left
                  `}
                  style={{ height: `calc(100% - 8px)` }}
                />

                {/* Cara superior */}
                <div
                  className={`
                    absolute -top-2 left-0 right-2 h-2
                    bg-gradient-to-r from-${color} to-${color}/70
                    transform skew-x-[-45deg] origin-bottom-left
                  `}
                />

                {/* Brillo superior */}
                <div className="absolute top-0 left-0 right-0 h-1/3 rounded-t-lg bg-gradient-to-b from-white/20 to-transparent" />
              </div>

              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -top-16 left-1/2 -translate-x-1/2 z-50"
                  >
                    <div className="backdrop-blur-xl bg-black/80 border border-white/20 rounded-lg px-3 py-2 shadow-2xl whitespace-nowrap">
                      <p className="text-white/60 text-xs mb-0.5">{item.label}</p>
                      <p className={`text-${color} font-bold text-sm`}>
                        {formatCurrency(item.value)}
                      </p>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-black/80 border-r border-b border-white/20" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Label */}
              <div className="absolute -bottom-8 left-0 right-0 text-center">
                <p className="text-xs text-white/60 truncate">{item.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Gráfico de Línea 3D con Profundidad
 */
export const LineChart3D = ({ data, height = 300, color = 'primary' }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const maxValue = useMemo(() => {
    return Math.max(...data.map((d) => d.value), 1);
  }, [data]);

  const chartHeight = height - 60;
  const chartWidth = 100; // porcentaje

  // Calcular puntos del path
  const points = useMemo(() => {
    return data.map((item, index) => {
      const x = (index / (data.length - 1)) * chartWidth;
      const y = 100 - (item.value / maxValue) * 100;
      return { x, y, ...item };
    });
  }, [data, maxValue, chartWidth]);

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');

  // Path del área (fill)
  const areaPathD = `${pathD} L ${chartWidth},100 L 0,100 Z`;

  return (
    <div className="relative" style={{ height: `${height}px` }}>
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none">
        {[0, 25, 50, 75, 100].map((percentage) => (
          <div
            key={percentage}
            className="absolute left-0 right-0 border-t border-white/5"
            style={{ top: `${percentage}%` }}
          />
        ))}
      </div>

      {/* SVG Chart */}
      <svg
        className="absolute inset-0 w-full h-full overflow-visible"
        viewBox={`0 0 ${chartWidth} 100`}
        preserveAspectRatio="none"
      >
        <defs>
          {/* Gradiente para el área */}
          <linearGradient id={`areaGradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" className={`stop-${color}/40`} />
            <stop offset="100%" className={`stop-${color}/0`} />
          </linearGradient>

          {/* Sombra para profundidad */}
          <filter id="shadow3d">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="2" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Área con gradiente */}
        <motion.path
          d={areaPathD}
          fill={`url(#areaGradient-${color})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Línea principal */}
        <motion.path
          d={pathD}
          fill="none"
          className={`stroke-${color}`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#shadow3d)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />

        {/* Puntos */}
        {points.map((point, index) => (
          <g key={index}>
            {/* Círculo exterior (glow) */}
            <circle cx={point.x} cy={point.y} r="6" className={`fill-${color}/20`} />
            {/* Círculo principal */}
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="4"
              className={`fill-${color} cursor-pointer`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              whileHover={{ scale: 1.5 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            />
          </g>
        ))}
      </svg>

      {/* Tooltips */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            key={hoveredIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute z-50 pointer-events-none"
            style={{
              left: `${points[hoveredIndex].x}%`,
              top: `${points[hoveredIndex].y}%`,
              transform: 'translate(-50%, -120%)',
            }}
          >
            <div className="backdrop-blur-xl bg-black/80 border border-white/20 rounded-lg px-3 py-2 shadow-2xl">
              <p className="text-white/60 text-xs mb-0.5">{points[hoveredIndex].label}</p>
              <p className={`text-${color} font-bold`}>
                {formatCurrency(points[hoveredIndex].value)}
              </p>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-black/80 border-r border-b border-white/20" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Gráfico de Tendencia Simple con Spark
 */
export const SparklineChart3D = ({ data, height = 60, showTrend = true, color = 'primary' }) => {
  const maxValue = useMemo(() => Math.max(...data, 1), [data]);
  const minValue = useMemo(() => Math.min(...data, 0), [data]);
  const range = maxValue - minValue || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = ((maxValue - value) / range) * 100;
    return { x, y, value };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  const areaPathD = `${pathD} L 100,100 L 0,100 Z`;

  // Calcular tendencia
  const trend = useMemo(() => {
    if (data.length < 2) return 0;
    const first = data[0];
    const last = data[data.length - 1];
    return ((last - first) / first) * 100;
  }, [data]);

  const isPositive = trend >= 0;

  return (
    <div className="relative flex items-center gap-3">
      {/* Gráfico */}
      <div className="flex-1" style={{ height: `${height}px` }}>
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`sparkGradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" className={`stop-${color}/30`} />
              <stop offset="100%" className={`stop-${color}/0`} />
            </linearGradient>
          </defs>

          {/* Área */}
          <motion.path
            d={areaPathD}
            fill={`url(#sparkGradient-${color})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Línea */}
          <motion.path
            d={pathD}
            fill="none"
            className={`stroke-${color}`}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />
        </svg>
      </div>

      {/* Indicador de tendencia */}
      {showTrend && (
        <div className={`flex items-center gap-1 ${isPositive ? 'text-success' : 'text-error'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="text-sm font-bold">{Math.abs(trend).toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
};

export default { BarChart3D, LineChart3D, SparklineChart3D };
