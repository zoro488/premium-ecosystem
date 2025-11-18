/**
 * 📊 COMPONENTES DE VISUALIZACIÓN AVANZADA
 * Gráficos y analytics premium para FlowDistributor
 */
import { useMemo } from 'react';

import { motion } from 'framer-motion';
import {
  Building,
  Clock,
  DollarSign,
  Edit3,
  Package,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react';

import { animations, formatCurrency, formatNumber } from '../../../lib/utils';

// ============================================================================
// COMPONENTES DE GRÁFICOS
// ============================================================================

const BarChart = ({ data, title, xKey, yKey, color = 'cyan' }) => {
  const maxValue = Math.max(...data.map((item) => item[yKey]));

  return (
    <div className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>

      <div className="space-y-4">
        {data.map((item, index) => (
          <motion.div
            key={item[xKey]}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="w-24 text-sm text-slate-300 truncate">{item[xKey]}</div>

            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 h-8 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item[yKey] / maxValue) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full`}
                />
              </div>

              <div className="w-20 text-sm font-semibold text-white text-right">
                {typeof item[yKey] === 'number' && item[yKey] > 1000
                  ? formatCurrency(item[yKey])
                  : formatNumber(item[yKey])}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const DonutChart = ({ data, title, centerValue, centerLabel }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const radius = 80;
  const innerRadius = 50;
  const centerX = 100;
  const centerY = 100;

  const colors = [
    'from-zinc-800 to-zinc-900',
    'from-zinc-800 to-zinc-700',
    'from-green-500 to-emerald-600',
    'from-orange-500 to-zinc-800',
    'from-yellow-500 to-amber-600',
  ];

  return (
    <div className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>

      <div className="flex items-center justify-between">
        <div className="relative">
          <svg width="200" height="200" className="transform -rotate-90">
            {data.map((item, index) => {
              const angle = (item.value / total) * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;

              const startAngleRad = (startAngle * Math.PI) / 180;
              const endAngleRad = (endAngle * Math.PI) / 180;

              const x1 = centerX + radius * Math.cos(startAngleRad);
              const y1 = centerY + radius * Math.sin(startAngleRad);
              const x2 = centerX + radius * Math.cos(endAngleRad);
              const y2 = centerY + radius * Math.sin(endAngleRad);

              const x3 = centerX + innerRadius * Math.cos(endAngleRad);
              const y3 = centerY + innerRadius * Math.sin(endAngleRad);
              const x4 = centerX + innerRadius * Math.cos(startAngleRad);
              const y4 = centerY + innerRadius * Math.sin(startAngleRad);

              const largeArcFlag = angle > 180 ? 1 : 0;

              const pathData = [
                `M ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `L ${x3} ${y3}`,
                `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
                'Z',
              ].join(' ');

              currentAngle += angle;

              return (
                <motion.path
                  key={item.label}
                  d={pathData}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className={`fill-gradient-to-r ${colors[index % colors.length]} hover:opacity-80 transition-opacity cursor-pointer`}
                  style={{
                    fill: `url(#gradient-${
                      colors[index % colors.length].includes('cyan')
                        ? 'cyan'
                        : colors[index % colors.length].includes('purple')
                          ? 'purple'
                          : colors[index % colors.length].includes('green')
                            ? 'green'
                            : colors[index % colors.length].includes('orange')
                              ? 'orange'
                              : 'yellow'
                    })`,
                  }}
                />
              );
            })}

            {/* Gradientes */}
            <defs>
              {colors.map((color) => {
                const colorName = color.includes('cyan')
                  ? 'cyan'
                  : color.includes('purple')
                    ? 'purple'
                    : color.includes('green')
                      ? 'green'
                      : color.includes('orange')
                        ? 'orange'
                        : 'yellow';
                return (
                  <linearGradient
                    key={`gradient-${colorName}`}
                    id={`gradient-${colorName}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor={
                        color.includes('cyan')
                          ? '#06b6d4'
                          : color.includes('purple')
                            ? '#8b5cf6'
                            : color.includes('green')
                              ? '#10b981'
                              : color.includes('orange')
                                ? '#f97316'
                                : '#eab308'
                      }
                    />
                    <stop
                      offset="100%"
                      stopColor={
                        color.includes('cyan')
                          ? '#2563eb'
                          : color.includes('purple')
                            ? '#ec4899'
                            : color.includes('green')
                              ? '#059669'
                              : color.includes('orange')
                                ? '#dc2626'
                                : '#d97706'
                      }
                    />
                  </linearGradient>
                );
              })}
            </defs>
          </svg>

          {/* Centro del donut */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{centerValue}</div>
              <div className="text-sm text-slate-400">{centerLabel}</div>
            </div>
          </div>
        </div>

        {/* Leyenda */}
        <div className="space-y-3">
          {data.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div
                className={`w-4 h-4 rounded-full bg-gradient-to-r ${colors[index % colors.length]}`}
              />
              <div className="text-sm">
                <div className="text-white font-medium">{item.label}</div>
                <div className="text-slate-400">
                  {formatNumber(item.value)} ({((item.value / total) * 100).toFixed(1)}%)
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon: Icon, title, value, change, changeType, description }) => (
  <motion.div
    className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/10"
    whileHover={{ scale: 1.02 }}
    {...animations.fadeIn}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-xl bg-zinc-9000/10">
        <Icon className="w-6 h-6 text-zinc-300" />
      </div>

      {change !== undefined && (
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            changeType === 'positive'
              ? 'bg-zinc-9000/20 text-green-300'
              : changeType === 'negative'
                ? 'bg-zinc-9000/20 text-red-300'
                : 'bg-gray-500/20 text-gray-300'
          }`}
        >
          <TrendingUp className={`w-3 h-3 ${changeType === 'negative' ? 'rotate-180' : ''}`} />
          {Math.abs(change)}%
        </div>
      )}
    </div>

    <div className="space-y-1">
      <h3 className="text-sm font-medium text-slate-400">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
      {description && <p className="text-xs text-slate-500">{description}</p>}
    </div>
  </motion.div>
);

// ============================================================================
// VISTA DE ANALYTICS
// ============================================================================

export const AnalyticsView = ({ data }) => {
  const analyticsData = useMemo(() => {
    if (!data?.ordenesCompra) return null;

    const ordenes = data.ordenesCompra;

    // Agrupar por origen
    const porOrigen = ordenes.reduce((acc, orden) => {
      if (!acc[orden.origen]) acc[orden.origen] = 0;
      acc[orden.origen] += orden.costoTotal || 0;
      return acc;
    }, {});

    // Agrupar por mes
    const porMes = ordenes.reduce((acc, orden) => {
      const mes = new Date(orden.fecha).toLocaleString('es', { month: 'short' });
      if (!acc[mes]) acc[mes] = 0;
      acc[mes] += orden.costoTotal || 0;
      return acc;
    }, {});

    // Estados de stock
    const estadosStock = ordenes.reduce((acc, orden) => {
      const porcentaje = orden.cantidad > 0 ? (orden.stockActual / orden.cantidad) * 100 : 0;
      const estado = porcentaje > 50 ? 'Alto' : porcentaje > 20 ? 'Medio' : 'Bajo';
      if (!acc[estado]) acc[estado] = 0;
      acc[estado] += 1;
      return acc;
    }, {});

    return {
      porOrigen: Object.entries(porOrigen).map(([key, value]) => ({ origen: key, total: value })),
      porMes: Object.entries(porMes).map(([key, value]) => ({ mes: key, total: value })),
      estadosStock: Object.entries(estadosStock).map(([key, value]) => ({
        label: `Stock ${key}`,
        value,
      })),
    };
  }, [data]);

  const totalInversion = data?.statistics?.totalCosto || 0;
  const totalOrdenes = data?.statistics?.total || 0;
  const promedioOrden = totalOrdenes > 0 ? totalInversion / totalOrdenes : 0;

  if (!analyticsData) {
    return <div className="text-white">No hay datos disponibles para analytics</div>;
  }

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={DollarSign}
          title="Inversión Total"
          value={formatCurrency(totalInversion)}
          change={15.2}
          changeType="positive"
          description="vs mes anterior"
        />

        <MetricCard
          icon={Package}
          title="Total Órdenes"
          value={formatNumber(totalOrdenes)}
          change={8.7}
          changeType="positive"
          description="vs mes anterior"
        />

        <MetricCard
          icon={TrendingUp}
          title="Promedio por Orden"
          value={formatCurrency(promedioOrden)}
          change={-2.1}
          changeType="negative"
          description="vs mes anterior"
        />

        <MetricCard
          icon={Users}
          title="Distribuidores Activos"
          value={formatNumber(analyticsData.porOrigen.length)}
          change={12.5}
          changeType="positive"
          description="distribuidores únicos"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={analyticsData.porOrigen}
          title="Inversión por Distribuidor"
          xKey="origen"
          yKey="total"
          color="cyan"
        />

        <DonutChart
          data={analyticsData.estadosStock}
          title="Estados de Stock"
          centerValue={formatNumber(totalOrdenes)}
          centerLabel="Total Órdenes"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <BarChart
          data={analyticsData.porMes}
          title="Tendencia Mensual"
          xKey="mes"
          yKey="total"
          color="purple"
        />
      </div>
    </div>
  );
};

// ============================================================================
// VISTA DE TARJETAS
// ============================================================================

export const CardsView = ({ data, onEdit, onDelete, onView }) => {
  if (!data?.length) {
    return <div className="text-center text-slate-400 py-12">No hay órdenes para mostrar</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((orden, index) => {
        const stockPercentage = orden.cantidad > 0 ? (orden.stockActual / orden.cantidad) * 100 : 0;
        const estado =
          orden.stockActual > 0 ? 'En Stock' : orden.pagoDistribuidor > 0 ? 'Pagado' : 'Pendiente';

        return (
          <motion.div
            key={orden.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/10 cursor-pointer group"
            onClick={() => onView?.(orden)}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-zinc-300" />
                <span className="font-mono text-zinc-300 text-sm">{orden.id}</span>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(orden);
                  }}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-zinc-800 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Edit3 className="w-4 h-4 text-slate-300" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(orden);
                  }}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-zinc-700 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4 text-slate-300" />
                </motion.button>
              </div>
            </div>

            {/* Origen */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-1">{orden.origen}</h3>
              <p className="text-sm text-slate-400">
                {new Date(orden.fecha).toLocaleDateString('es', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Métricas */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Cantidad:</span>
                <span className="font-semibold text-white">{formatNumber(orden.cantidad)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Costo Total:</span>
                <span className="font-semibold text-zinc-200">
                  {formatCurrency(orden.costoTotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Stock Actual:</span>
                <span className="font-semibold text-white">{formatNumber(orden.stockActual)}</span>
              </div>
            </div>

            {/* Barra de progreso de stock */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Stock</span>
                <span className="text-white">{stockPercentage.toFixed(1)}%</span>
              </div>

              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(stockPercentage, 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-full transition-all duration-300 ${
                    stockPercentage > 50
                      ? 'bg-zinc-9000'
                      : stockPercentage > 20
                        ? 'bg-zinc-9000'
                        : 'bg-zinc-9000'
                  }`}
                />
              </div>
            </div>

            {/* Estado */}
            <div className="flex justify-between items-center">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  estado === 'En Stock'
                    ? 'bg-zinc-9000/20 text-green-300'
                    : estado === 'Pagado'
                      ? 'bg-zinc-800/20 text-zinc-300'
                      : 'bg-zinc-9000/20 text-yellow-300'
                }`}
              >
                {estado}
              </span>

              <Clock className="w-4 h-4 text-slate-400" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
