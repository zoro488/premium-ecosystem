import React, { useEffect, useState } from 'react';



import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  Clock,
  DollarSign,
  Minus,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { useExchangeRate } from '@/hooks/useExchangeRate';

interface ExchangeRateMonitorProps {
  className?: string;
  showHistory?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const ExchangeRateMonitor: React.FC<ExchangeRateMonitorProps> = ({
  className = '',
  showHistory = true,
  autoRefresh = true,
  refreshInterval = 300000, // 5 minutos
}) => {
  const { tc, historicalRates, opportunity, loading, refreshRate } = useExchangeRate();

  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        handleRefresh();
      }, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshRate();
    setLastUpdate(new Date());
    setTimeout(() => setRefreshing(false), 500);
  };

  // Preparar datos para gráfico 24h
  const last24Hours = historicalRates
    .slice(-24)
    .map((rate, idx) => ({
      time: `${23 - idx}h`,
      rate: rate.rate,
      timestamp: rate.timestamp,
    }))
    .reverse();

  // Calcular stats 7 días
  const last7Days = historicalRates.slice(-7).map((rate, idx) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - idx));
    return {
      dayName: date.toLocaleDateString('es-MX', { weekday: 'short' }),
      date: date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }),
      rate: rate.rate,
      change:
        idx > 0
          ? ((rate.rate - historicalRates[historicalRates.length - 7 + idx - 1].rate) /
              historicalRates[historicalRates.length - 7 + idx - 1].rate) *
            100
          : 0,
    };
  });

  const rates7d = last7Days.map((d) => d.rate);
  const maxTC7d = Math.max(...rates7d);
  const minTC7d = Math.min(...rates7d);
  const avgTC7d = rates7d.reduce((a, b) => a + b, 0) / rates7d.length;

  const maxTC7dDate = last7Days.find((d) => d.rate === maxTC7d)?.date || '';
  const minTC7dDate = last7Days.find((d) => d.rate === minTC7d)?.date || '';

  // Calcular cambio 24h
  const change24h =
    last24Hours.length >= 2 ? last24Hours[last24Hours.length - 1].rate - last24Hours[0].rate : 0;
  const changePercent24h = last24Hours.length >= 2 ? (change24h / last24Hours[0].rate) * 100 : 0;

  const getTrendIcon = () => {
    if (changePercent24h > 0.5) return TrendingUp;
    if (changePercent24h < -0.5) return TrendingDown;
    return Minus;
  };

  const TrendIcon = getTrendIcon();

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-br from-black/80 to-black/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 ${className}`}
    >
      {/* Header con TC actual */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 bg-gradient-to-br from-black/80 to-black/90 border border-zinc-700/30 rounded-full p-2.5 flex items-center justify-center"
          >
            <Activity className="text-white w-6 h-6" />
          </motion.div>
          <div>
            <p className="text-white/60 text-sm font-medium">Tipo de Cambio USD → MXN</p>
            <div className="flex items-baseline gap-2">
              <motion.span
                key={tc.rate}
                initial={{ scale: 1.2, color: '#a855f7' }}
                animate={{ scale: 1, color: '#ffffff' }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold font-mono text-white"
              >
                ${tc.rate.toFixed(4)}
              </motion.span>
              <span className="text-white/60 text-sm">MXN</span>
            </div>
          </div>
        </div>

        {/* Indicador de tendencia */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
            changePercent24h > 0.5
              ? 'bg-emerald-500/20 border border-emerald-500/30'
              : changePercent24h < -0.5
                ? 'bg-rose-500/20 border border-rose-500/30'
                : 'bg-amber-500/20 border border-amber-500/30'
          }`}
        >
          <TrendIcon
            className={`w-6 h-6 ${
              changePercent24h > 0.5
                ? 'text-emerald-400'
                : changePercent24h < -0.5
                  ? 'text-rose-400'
                  : 'text-amber-400'
            }`}
          />
          <div className="text-right">
            <div
              className={`text-lg font-bold font-mono ${
                changePercent24h > 0.5
                  ? 'text-emerald-400'
                  : changePercent24h < -0.5
                    ? 'text-rose-400'
                    : 'text-amber-400'
              }`}
            >
              {change24h > 0 ? '+' : ''}${change24h.toFixed(4)}
            </div>
            <div className="text-xs text-white/60">
              {changePercent24h > 0 ? '+' : ''}
              {changePercent24h.toFixed(2)}% (24h)
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mini sparkline 24 horas */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-white/60 text-sm font-medium">Últimas 24 horas</p>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-white/60 ${refreshing ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart data={last24Hours}>
            <defs>
              <linearGradient id="tcGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#ec4899" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="#ffffff40"
              tick={{ fill: '#ffffff60', fontSize: 10 }}
              tickLine={false}
            />
            <YAxis
              domain={['dataMin - 0.1', 'dataMax + 0.1']}
              stroke="#ffffff40"
              tick={{ fill: '#ffffff60', fontSize: 10 }}
              tickLine={false}
              width={50}
            />
            <Tooltip
              content={({ payload }) => {
                if (!payload?.[0]) return null;
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-black/90 border border-zinc-700/30 rounded-lg p-3 backdrop-blur-xl"
                  >
                    <p className="text-white text-sm font-mono font-bold">
                      TC: ${payload[0].value?.toFixed(4)}
                    </p>
                    <p className="text-white/60 text-xs">{payload[0].payload.time}</p>
                  </motion.div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#a855f7"
              strokeWidth={3}
              fill="url(#tcGradient)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Análisis de oportunidad desde useExchangeRate hook */}
      <AnimatePresence mode="wait">
        <motion.div
          key={opportunity.action}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={`rounded-xl p-4 border ${
            opportunity.action === 'VENDER_USD'
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : opportunity.action === 'COMPRAR_USD'
                ? 'bg-blue-500/10 border-blue-500/30'
                : 'bg-amber-500/10 border-amber-500/30'
          }`}
        >
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-10 h-10 rounded-lg p-2 flex items-center justify-center ${
                opportunity.action === 'VENDER_USD'
                  ? 'bg-emerald-500/20'
                  : opportunity.action === 'COMPRAR_USD'
                    ? 'bg-blue-500/20'
                    : 'bg-amber-500/20'
              }`}
            >
              {opportunity.action === 'VENDER_USD' && (
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              )}
              {opportunity.action === 'COMPRAR_USD' && (
                <TrendingDown className="w-6 h-6 text-blue-400" />
              )}
              {opportunity.action === 'MANTENER' && <Minus className="w-6 h-6 text-amber-400" />}
            </motion.div>
            <div className="flex-1">
              <h4
                className={`font-bold text-lg mb-1 ${
                  opportunity.action === 'VENDER_USD'
                    ? 'text-emerald-400'
                    : opportunity.action === 'COMPRAR_USD'
                      ? 'text-blue-400'
                      : 'text-amber-400'
                }`}
              >
                {opportunity.action === 'VENDER_USD' && '🔥 ¡Oportunidad de Venta!'}
                {opportunity.action === 'COMPRAR_USD' && '💰 Momento de Compra'}
                {opportunity.action === 'MANTENER' && '⏸️ Mantener Posición'}
              </h4>
              <p className="text-white/80 text-sm mb-3">{opportunity.recommendation}</p>
              {opportunity.action === 'VENDER_USD' && opportunity.potentialProfit && (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-3 py-2 inline-flex items-center gap-2"
                >
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold text-sm">
                    Potencial: +${opportunity.potentialProfit.toLocaleString()} MXN
                  </span>
                </motion.div>
              )}
              {opportunity.action === 'COMPRAR_USD' && opportunity.savingsEstimate && (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-3 py-2 inline-flex items-center gap-2"
                >
                  <DollarSign className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 font-bold text-sm">
                    Ahorro estimado: ${opportunity.savingsEstimate.toLocaleString()} MXN
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Histórico 7 días */}
      {showHistory && (
        <div className="mt-6">
          <p className="text-white/60 text-sm font-medium mb-3">Histórico 7 días</p>
          <div className="grid grid-cols-7 gap-2">
            {last7Days.map((day, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/5 hover:bg-white/10 rounded-xl p-3 text-center transition-all border border-white/10"
              >
                <p className="text-white/40 text-xs mb-1">{day.dayName}</p>
                <p className="text-white text-sm font-mono font-bold mb-1">{day.rate.toFixed(2)}</p>
                <div
                  className={`text-xs font-medium ${
                    day.change > 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {day.change > 0 ? '↗' : '↘'} {Math.abs(day.change).toFixed(2)}%
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Stats rápidos */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <p className="text-emerald-400/80 text-xs font-medium">Máximo 7d</p>
          </div>
          <p className="text-emerald-400 text-xl font-bold font-mono">{maxTC7d.toFixed(4)}</p>
          <p className="text-emerald-400/60 text-xs mt-1">{maxTC7dDate}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-rose-400" />
            <p className="text-rose-400/80 text-xs font-medium">Mínimo 7d</p>
          </div>
          <p className="text-rose-400 text-xl font-bold font-mono">{minTC7d.toFixed(4)}</p>
          <p className="text-rose-400/60 text-xs mt-1">{minTC7dDate}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-zinc-900/10 border border-zinc-800/20 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-zinc-200" />
            <p className="text-zinc-200/80 text-xs font-medium">Promedio 7d</p>
          </div>
          <p className="text-zinc-200 text-xl font-bold font-mono">{avgTC7d.toFixed(4)}</p>
          <p className="text-zinc-200/60 text-xs mt-1">Referencia</p>
        </motion.div>
      </div>

      {/* Última actualización */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-white/40" />
          <span className="text-white/40 text-xs">
            Última actualización: {formatTime(lastUpdate)}
          </span>
        </div>
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-1.5"
        >
          <div className="w-2 h-2 bg-emerald-400 rounded-full" />
          <span className="text-emerald-400 text-xs font-medium">En vivo</span>
        </motion.div>
      </div>
    </motion.div>
  );
};
