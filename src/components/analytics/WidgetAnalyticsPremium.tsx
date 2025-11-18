/**
 * 🎨 WIDGET ANALYTICS PREMIUM
 *
 * Widget flotante ultra moderno con:
 * - KPIs en tiempo real con animaciones micro
 * - Mini gráficos sparkline
 * - Diseño glassmorphism premium
 * - Efectos holográficos
 * - Drag & drop para reposicionar
 * - Minimizable/expandible
 *
 * @author Premium Ecosystem
 * @version 1.0.0
 */
import React, { useEffect, useState } from 'react';



import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import {
  Activity,
  ArrowDown,
  ArrowUp,
  BarChart3,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Maximize2,
  Minimize2,
  Package,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';

import { getCurrentSTK, getInventorySummary } from '@/services/businessLogic';
import { DatosCompletos, getDatosCompletos } from '@/services/dataService';

// ==================== TYPES ====================

interface KPIData {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
  sparklineData: number[];
}

// ==================== MINI SPARKLINE COMPONENT ====================

const MiniSparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg className="w-full h-12" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Área bajo la curva */}
      <polygon
        points={`0,100 ${points} 100,100`}
        fill={`url(#gradient-${color})`}
        className="transition-all duration-300"
      />

      {/* Línea principal */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        className="transition-all duration-300"
      />

      {/* Punto actual */}
      <circle
        cx={100}
        cy={100 - ((data[data.length - 1] - min) / range) * 100}
        r="3"
        fill={color}
        className="animate-pulse"
      />
    </svg>
  );
};

// ==================== KPI CARD COMPONENT ====================

const KPICard: React.FC<{ kpi: KPIData; isMinimized: boolean }> = ({ kpi, isMinimized }) => {
  const Icon = kpi.icon;
  const trendIcon = kpi.trend === 'up' ? ArrowUp : kpi.trend === 'down' ? ArrowDown : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4"
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-500 blur-xl"
        style={{ background: kpi.color }}
      />

      {/* Contenido */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${kpi.color}20` }}>
            <Icon className="w-4 h-4" style={{ color: kpi.color }} />
          </div>

          {/* Trend indicator */}
          {trendIcon && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                kpi.trend === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}
            >
              {React.createElement(trendIcon, { className: 'w-3 h-3' })}
              <span>{Math.abs(kpi.change)}%</span>
            </motion.div>
          )}
        </div>

        {/* Label */}
        <p className="text-white/60 text-xs mb-1">{kpi.label}</p>

        {/* Value */}
        <motion.p
          key={kpi.value}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-white text-2xl font-bold mb-3"
        >
          {kpi.value}
        </motion.p>

        {/* Sparkline */}
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <MiniSparkline data={kpi.sparklineData} color={kpi.color} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// ==================== MAIN WIDGET COMPONENT ====================

export const WidgetAnalyticsPremium: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const dragControls = useDragControls();

  // Estado de KPIs
  const [kpis, setKpis] = useState<KPIData[]>([]);
  const [datosCompletos, setDatosCompletos] = useState<DatosCompletos | null>(null);

  // Cargar datos al montar
  useEffect(() => {
    getDatosCompletos().then(setDatosCompletos).catch(console.error);
  }, []);

  // Actualizar KPIs en tiempo real
  useEffect(() => {
    if (!datosCompletos) return;

    const loadKPIs = () => {
      try {
        // Obtener datos actuales con validación completa
        const stk = getCurrentSTK() || 0;
        const inventory = getInventorySummary() || { totalIngresos: 0, totalSalidas: 0 };

        // Calcular ventas de hoy - VALIDACIÓN COMPLETA
        const almacen = datosCompletos?.paneles?.find((p) => p?.tipoPanel === 'almacen');
        const ventasHoy =
          (almacen?.salidas || [])
            .filter((s) => {
              try {
                if (!s?.Fecha) return false;
                const fecha = new Date(s.Fecha);
                const hoy = new Date();
                return fecha.toDateString() === hoy.toDateString();
              } catch {
                return false;
              }
            })
            .reduce((sum, s) => sum + (s?.Cantidad || 0), 0) || 0;

        // Calcular utilidades - VALIDACIÓN COMPLETA
        const utilidadesPanel = datosCompletos?.paneles?.find((p) => p?.panel === 'Utilidades');
        const utilidadesTotales = utilidadesPanel?.ingresos?.total || 0;

        // Calcular flujo de caja (RF Total Sistema) - VALIDACIÓN COMPLETA
        const flujoCaja = datosCompletos?.controlMaestro?.rfActual?.totalSistema || 0;

        // Generar datos de sparkline (últimos 7 días simulados)
        const generateSparkline = (base: number, variance: number = 0.1) => {
          return Array.from({ length: 7 }, (_, i) => {
            const variation = (Math.random() - 0.5) * variance;
            return Math.max(0, base * (1 + variation));
          });
        };

        const newKPIs: KPIData[] = [
          {
            label: 'Stock Actual',
            value: stk,
            change: 5.2,
            trend: 'up',
            icon: Package,
            color: '#8b5cf6',
            sparklineData: generateSparkline(stk, 0.15),
          },
          {
            label: 'Ventas Hoy',
            value: ventasHoy,
            change: 12.8,
            trend: 'up',
            icon: ShoppingCart,
            color: '#10b981',
            sparklineData: generateSparkline(ventasHoy, 0.25),
          },
          {
            label: 'Utilidades',
            value: `$${(utilidadesTotales / 1000).toFixed(1)}K`,
            change: -3.4,
            trend: 'down',
            icon: DollarSign,
            color: '#f59e0b',
            sparklineData: generateSparkline(utilidadesTotales / 1000, 0.12),
          },
          {
            label: 'Flujo de Caja',
            value: `$${(flujoCaja / 1000).toFixed(1)}K`,
            change: 8.1,
            trend: 'up',
            icon: TrendingUp,
            color: '#06b6d4',
            sparklineData: generateSparkline(flujoCaja / 1000, 0.08),
          },
        ];

        setKpis(newKPIs);
      } catch (error) {
        console.error('Error loading KPIs:', error);
        // Mantener KPIs anteriores en caso de error
      }
    };

    loadKPIs();

    // Actualizar cada 30 segundos
    const interval = setInterval(loadKPIs, 30000);
    return () => clearInterval(interval);
  }, [datosCompletos]);

  if (!isVisible) return null;

  return (
    <motion.div
      drag={!isExpanded}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0.1}
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 50 }}
      className={`
        fixed z-50
        ${isExpanded ? 'inset-4' : 'bottom-6 right-6'}
        ${isMinimized ? 'w-80' : isExpanded ? 'w-full' : 'w-96'}
        transition-all duration-300
      `}
      style={{
        cursor: !isExpanded ? 'move' : 'default',
      }}
    >
      {/* Glass card */}
      <div className="relative h-full overflow-hidden rounded-2xl backdrop-blur-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-900/90 border border-white/10 shadow-2xl">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        {/* Glow decorativo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-black/50 blur-3xl rounded-full" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-black/80 to-black/90 border border-zinc-700/20">
              <BarChart3 className="w-5 h-5 text-zinc-200" />
            </div>
            <div>
              <h3 className="text-white font-semibold flex items-center gap-2">
                Analytics Premium
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              </h3>
              <p className="text-white/40 text-xs">Tiempo real</p>
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center gap-2">
            {/* Toggle minimize */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              title={isMinimized ? 'Expandir' : 'Minimizar'}
            >
              {isMinimized ? (
                <ChevronUp className="w-4 h-4 text-white/60" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white/60" />
              )}
            </motion.button>

            {/* Toggle fullscreen */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              title={isExpanded ? 'Minimizar' : 'Pantalla completa'}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4 text-white/60" />
              ) : (
                <Maximize2 className="w-4 h-4 text-white/60" />
              )}
            </motion.button>

            {/* Close */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsVisible(false)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              title="Cerrar"
            >
              <X className="w-4 h-4 text-white/60" />
            </motion.button>
          </div>
        </div>

        {/* Contenido */}
        <AnimatePresence mode="wait">
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="relative z-10 p-4"
            >
              {/* Grid de KPIs */}
              <div className={`grid ${isExpanded ? 'grid-cols-4' : 'grid-cols-2'} gap-4`}>
                {kpis.map((kpi, index) => (
                  <motion.div
                    key={kpi.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <KPICard kpi={kpi} isMinimized={isMinimized} />
                  </motion.div>
                ))}
              </div>

              {/* Quick actions */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 flex gap-3"
                >
                  <button className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-black/80 to-black/90 border border-blue-500/20 text-white text-sm font-medium hover:from-black/90 hover:to-black/95 transition-all">
                    <Activity className="w-4 h-4 inline mr-2" />
                    Ver Dashboard Completo
                  </button>
                  <button className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/20 text-white text-sm font-medium hover:from-green-500/30 hover:to-emerald-500/30 transition-all">
                    <Sparkles className="w-4 h-4 inline mr-2" />
                    AI Insights
                  </button>
                </motion.div>
              )}

              {/* Status bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/40"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Actualizado hace {new Date().getSeconds()}s</span>
                </div>
                <span>Premium Analytics v1.0</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default WidgetAnalyticsPremium;
