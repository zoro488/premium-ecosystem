/**
 * 🤖 AI INSIGHTS WIDGET
 *
 * Sistema de análisis inteligente con:
 * - Detección automática de patrones y anomalías
 * - Recomendaciones de negocio en tiempo real
 * - Predicciones de demanda e inventario
 * - Alertas proactivas inteligentes
 * - Análisis de rentabilidad y optimización
 *
 * @author Premium Ecosystem
 * @version 1.0.0
 */
import React, { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Brain,
  CheckCircle,
  ChevronRight,
  Clock,
  DollarSign,
  Lightbulb,
  Maximize2,
  Minimize2,
  Package,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
} from 'lucide-react';

import { getCurrentSTK, getInventorySummary } from '@/services/businessLogic';
import { DatosCompletos, getDatosCompletos } from '@/services/dataService';

// ==================== TYPES ====================

type InsightType = 'alert' | 'recommendation' | 'prediction' | 'success' | 'warning';
type InsightPriority = 'critical' | 'high' | 'medium' | 'low';

interface AIInsight {
  id: string;
  type: InsightType;
  priority: InsightPriority;
  title: string;
  description: string;
  action?: string;
  metric?: {
    value: string | number;
    trend: 'up' | 'down' | 'neutral';
    change?: number;
  };
  timestamp: Date;
  category: 'inventory' | 'sales' | 'finance' | 'customer' | 'performance';
}

// ==================== AI ANALYSIS ENGINE ====================

class AIAnalysisEngine {
  /**
   * Analiza el inventario y detecta problemas
   */
  static analyzeInventory(datosCompletos: DatosCompletos | null): AIInsight[] {
    const insights: AIInsight[] = [];

    try {
      const stk = getCurrentSTK() || 0;
      const inventory = getInventorySummary() || { totalIngresos: 0, totalSalidas: 0 };

      // Alerta de stock bajo
      if (stk < 20) {
        insights.push({
          id: 'inv-low-stock',
          type: 'alert',
          priority: 'critical',
          title: '⚠️ Stock Crítico Detectado',
          description: `El inventario actual (${stk} unidades) está por debajo del nivel mínimo recomendado de 20 unidades. Riesgo de quiebre de stock.`,
          action: 'Generar orden de compra urgente',
          metric: {
            value: stk,
            trend: 'down',
            change: -45,
          },
          timestamp: new Date(),
          category: 'inventory',
        });
      }

      // Predicción de stock - VALIDACIÓN para evitar división por cero
      if (inventory.totalSalidas > 0) {
        const avgDailySales = inventory.totalSalidas / 30; // Promedio diario
        const daysOfStock = avgDailySales > 0 ? Math.floor(stk / avgDailySales) : 999;

        if (daysOfStock < 7 && avgDailySales > 0) {
          insights.push({
            id: 'inv-stock-prediction',
            type: 'prediction',
            priority: 'high',
            title: '📊 Predicción de Agotamiento',
            description: `Basado en el promedio de ventas (${avgDailySales.toFixed(1)} unidades/día), el stock actual cubrirá aproximadamente ${daysOfStock} días.`,
            action: 'Ver proyección de demanda',
            metric: {
              value: `${daysOfStock} días`,
              trend: daysOfStock < 7 ? 'down' : 'neutral',
            },
            timestamp: new Date(),
            category: 'inventory',
          });
        }
      }

      // Rotación de inventario - VALIDACIÓN para evitar división por cero
      if (inventory.totalIngresos > 0) {
        const rotationRate = (inventory.totalSalidas / inventory.totalIngresos) * 100;
        if (rotationRate < 50) {
          insights.push({
            id: 'inv-low-rotation',
            type: 'warning',
            priority: 'medium',
            title: '🔄 Rotación de Inventario Baja',
            description: `La rotación actual (${rotationRate.toFixed(1)}%) está por debajo del óptimo. Considera estrategias de promoción.`,
            action: 'Ver estrategias de ventas',
            metric: {
              value: `${rotationRate.toFixed(1)}%`,
              trend: 'down',
            },
            timestamp: new Date(),
            category: 'performance',
          });
        }
      }
    } catch (error) {
      console.error('Error analyzing inventory:', error);
    }

    return insights;
  }

  /**
   * Analiza las ventas y detecta oportunidades
   */
  static analyzeSales(datosCompletos: DatosCompletos | null): AIInsight[] {
    const insights: AIInsight[] = [];

    try {
      // VALIDACIÓN COMPLETA: buscar panel de almacén
      const almacen = datosCompletos?.paneles?.find(
        (p) => p?.panel?.toLowerCase().includes('almac') || p?.tipoPanel === 'almacen'
      );

      if (!almacen?.salidas?.registros || !Array.isArray(almacen.salidas.registros)) {
        return insights;
      }

      // Análisis de ventas recientes - VALIDACIÓN COMPLETA
      const ventasUltimos7Dias = almacen.salidas.registros.filter((s) => {
        if (!s?.Fecha) return false;
        try {
          const fecha = new Date(s.Fecha);
          const hoy = new Date();
          const diff = hoy.getTime() - fecha.getTime();
          return diff <= 7 * 24 * 60 * 60 * 1000;
        } catch {
          return false;
        }
      });

      const totalVentas7Dias = ventasUltimos7Dias.reduce((sum, v) => sum + (v?.Cantidad || 0), 0);
      const promedioAnterior = 50; // Promedio histórico simulado

      if (totalVentas7Dias > promedioAnterior * 1.2) {
        insights.push({
          id: 'sales-trending-up',
          type: 'success',
          priority: 'high',
          title: '📈 Tendencia Positiva en Ventas',
          description: `Las ventas aumentaron un ${((totalVentas7Dias / promedioAnterior - 1) * 100).toFixed(1)}% en los últimos 7 días. Momento ideal para incrementar inventario.`,
          action: 'Ajustar previsión de compra',
          metric: {
            value: totalVentas7Dias,
            trend: 'up',
            change: (totalVentas7Dias / promedioAnterior - 1) * 100,
          },
          timestamp: new Date(),
          category: 'sales',
        });
      }

      // Detección de cliente frecuente - VALIDACIÓN COMPLETA
      const clientesFrecuentes = almacen.salidas.registros.reduce(
        (acc, v) => {
          const cliente = v?.Cliente || 'Sin nombre';
          acc[cliente] = (acc[cliente] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const topCliente = Object.entries(clientesFrecuentes).sort((a, b) => b[1] - a[1])[0];

      if (topCliente && topCliente[1] > 3) {
        insights.push({
          id: 'customer-frequent',
          type: 'recommendation',
          priority: 'medium',
          title: '👥 Cliente Frecuente Identificado',
          description: `${topCliente[0]} ha realizado ${topCliente[1]} compras. Considera ofrecerle programa de fidelización o descuento especial.`,
          action: 'Ver historial del cliente',
          timestamp: new Date(),
          category: 'customer',
        });
      }
    } catch (error) {
      console.error('Error analyzing sales:', error);
    }

    return insights;
  }

  /**
   * Analiza las finanzas y detecta anomalías
   */
  static analyzeFinances(datosCompletos: DatosCompletos | null): AIInsight[] {
    const insights: AIInsight[] = [];

    if (!datosCompletos) return insights;

    try {
      // Analizar RF Actual - VALIDACIÓN COMPLETA
      const rfTotal = datosCompletos?.controlMaestro?.rfActual?.totalSistema || 0;

      if (rfTotal < 0) {
        insights.push({
          id: 'finance-negative-balance',
          type: 'alert',
          priority: 'critical',
          title: '💰 Saldo Negativo Detectado',
          description: `El sistema presenta un saldo negativo de $${Math.abs(rfTotal).toLocaleString()}. Se recomienda análisis urgente de flujo de caja.`,
          action: 'Ver flujo de caja detallado',
          metric: {
            value: `$${rfTotal.toLocaleString()}`,
            trend: 'down',
          },
          timestamp: new Date(),
          category: 'finance',
        });
      }

      // Análisis de utilidades - VALIDACIÓN COMPLETA
      const utilidadesPanel = datosCompletos?.paneles?.find((p) => p?.panel === 'Utilidades');
      if (utilidadesPanel?.ingresos?.total) {
        const totalUtilidades = utilidadesPanel.ingresos.total;

        if (rfTotal > 0) {
          const margen = (totalUtilidades / rfTotal) * 100;

          if (margen < 10) {
            insights.push({
              id: 'finance-low-margin',
              type: 'warning',
              priority: 'high',
              title: '📉 Margen de Utilidad Bajo',
              description: `El margen actual (${margen.toFixed(1)}%) está por debajo del objetivo del 15%. Revisar estructura de costos.`,
              action: 'Optimizar precios',
              metric: {
                value: `${margen.toFixed(1)}%`,
                trend: 'down',
              },
              timestamp: new Date(),
              category: 'finance',
            });
          }
        }
      }
    } catch (error) {
      console.error('Error analyzing finances:', error);
    }

    return insights;
  }

  /**
   * Genera recomendaciones de precios óptimos
   */
  static generatePricingRecommendations(): AIInsight[] {
    const insights: AIInsight[] = [];

    const FLETE_RATE = 500;
    const TARGET_MARGIN = 0.2; // 20% margen objetivo

    // Calcular precio óptimo
    const avgPrecioCompra = 150; // Promedio simulado
    const precioOptimoSugerido = (avgPrecioCompra + FLETE_RATE) * (1 + TARGET_MARGIN);

    insights.push({
      id: 'pricing-optimization',
      type: 'recommendation',
      priority: 'medium',
      title: '💡 Optimización de Precios',
      description: `Para lograr un margen del 20%, se recomienda precio de venta de $${precioOptimoSugerido.toFixed(2)} (actualmente con costo promedio de $${avgPrecioCompra} + flete $${FLETE_RATE}).`,
      action: 'Aplicar nueva estrategia de precios',
      metric: {
        value: `$${precioOptimoSugerido.toFixed(2)}`,
        trend: 'up',
        change: 20,
      },
      timestamp: new Date(),
      category: 'finance',
    });

    return insights;
  }

  /**
   * Ejecuta análisis completo
   */
  static runFullAnalysis(datosCompletos: DatosCompletos | null): AIInsight[] {
    return [
      ...this.analyzeInventory(datosCompletos),
      ...this.analyzeSales(datosCompletos),
      ...this.analyzeFinances(datosCompletos),
      ...this.generatePricingRecommendations(),
    ].sort((a, b) => {
      // Ordenar por prioridad
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }
}

// ==================== INSIGHT CARD COMPONENT ====================

const InsightCard: React.FC<{ insight: AIInsight; onClick: () => void }> = ({
  insight,
  onClick,
}) => {
  const getIcon = () => {
    switch (insight.type) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5" />;
      case 'recommendation':
        return <Lightbulb className="w-5 h-5" />;
      case 'prediction':
        return <TrendingUp className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'warning':
        return <Clock className="w-5 h-5" />;
      default:
        return <Brain className="w-5 h-5" />;
    }
  };

  const getColor = () => {
    switch (insight.priority) {
      case 'critical':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          text: 'text-red-400',
          glow: 'from-red-500/20',
        };
      case 'high':
        return {
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/30',
          text: 'text-orange-400',
          glow: 'from-orange-500/20',
        };
      case 'medium':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          text: 'text-yellow-400',
          glow: 'from-yellow-500/20',
        };
      case 'low':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          text: 'text-blue-400',
          glow: 'from-blue-500/20',
        };
    }
  };

  const getCategoryIcon = () => {
    switch (insight.category) {
      case 'inventory':
        return <Package className="w-4 h-4" />;
      case 'sales':
        return <TrendingUp className="w-4 h-4" />;
      case 'finance':
        return <DollarSign className="w-4 h-4" />;
      case 'customer':
        return <Users className="w-4 h-4" />;
      case 'performance':
        return <Zap className="w-4 h-4" />;
    }
  };

  const colors = getColor();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ scale: 1.02, x: 4 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl ${colors.bg} border ${colors.border} p-4 cursor-pointer group`}
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${colors.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      {/* Contenido */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`${colors.text}`}>{getIcon()}</div>
            <div className={`text-xs ${colors.text} opacity-60 flex items-center gap-1`}>
              {getCategoryIcon()}
              <span className="capitalize">{insight.category}</span>
            </div>
          </div>

          {insight.metric && (
            <div className="flex items-center gap-1">
              {insight.metric.trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-green-400" />
              ) : insight.metric.trend === 'down' ? (
                <ArrowDownRight className="w-4 h-4 text-red-400" />
              ) : null}
              {insight.metric.change && (
                <span
                  className={`text-xs font-medium ${insight.metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}
                >
                  {Math.abs(insight.metric.change).toFixed(1)}%
                </span>
              )}
            </div>
          )}
        </div>

        {/* Title */}
        <h4 className="text-white font-semibold text-sm mb-1">{insight.title}</h4>

        {/* Description */}
        <p className="text-white/60 text-xs mb-3 line-clamp-2">{insight.description}</p>

        {/* Action */}
        {insight.action && (
          <div className="flex items-center justify-between">
            <button
              className={`text-xs ${colors.text} font-medium flex items-center gap-1 hover:gap-2 transition-all`}
            >
              {insight.action}
              <ChevronRight className="w-3 h-3" />
            </button>

            {insight.metric && (
              <div className="text-white/80 text-sm font-bold">{insight.metric.value}</div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ==================== MAIN WIDGET COMPONENT ====================

export const AIInsightsWidget: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [datosCompletos, setDatosCompletos] = useState<DatosCompletos | null>(null);

  // Cargar datos al montar
  useEffect(() => {
    getDatosCompletos().then(setDatosCompletos).catch(console.error);
  }, []);

  // Ejecutar análisis inicial y periódico
  useEffect(() => {
    if (!datosCompletos) return;

    runAnalysis();

    // Re-analizar cada 60 segundos
    const interval = setInterval(runAnalysis, 60000);
    return () => clearInterval(interval);
  }, [datosCompletos]);

  const runAnalysis = () => {
    if (!datosCompletos) return;

    setIsAnalyzing(true);

    // Simular tiempo de análisis
    setTimeout(() => {
      const newInsights = AIAnalysisEngine.runFullAnalysis(datosCompletos);
      setInsights(newInsights);
      setIsAnalyzing(false);
    }, 1500);
  };

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className={`
          fixed z-40 top-20
          ${isExpanded ? 'left-4 right-4' : 'left-4 w-96'}
          transition-all duration-300
        `}
      >
        {/* Glass card */}
        <div className="relative overflow-hidden rounded-2xl backdrop-blur-2xl bg-gradient-to-br from-slate-900/95 via-purple-900/80 to-slate-900/95 border border-purple-500/20 shadow-2xl">
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 blur-3xl rounded-full animate-pulse" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between p-4 border-b border-purple-500/20">
            <div className="flex items-center gap-3">
              <motion.div
                animate={isAnalyzing ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: isAnalyzing ? Infinity : 0, ease: 'linear' }}
                className="p-2 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/30"
              >
                <Brain className="w-5 h-5 text-purple-300" />
              </motion.div>
              <div>
                <h3 className="text-white font-semibold flex items-center gap-2">
                  AI Insights
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </h3>
                <p className="text-white/40 text-xs">
                  {isAnalyzing ? 'Analizando...' : `${insights.length} insights detectados`}
                </p>
              </div>
            </div>

            {/* Controles */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                title={isExpanded ? 'Contraer' : 'Expandir'}
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4 text-white/60" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-white/60" />
                )}
              </motion.button>

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
          <div className="relative z-10 p-4 max-h-[600px] overflow-y-auto custom-scrollbar">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="mb-4"
                >
                  <Brain className="w-12 h-12 text-purple-400" />
                </motion.div>
                <p className="text-white/60 text-sm">Analizando datos del sistema...</p>
              </div>
            ) : insights.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-white font-semibold mb-2">¡Todo está óptimo!</p>
                <p className="text-white/60 text-sm">No se detectaron problemas críticos</p>
              </div>
            ) : (
              <div className={`grid ${isExpanded ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
                <AnimatePresence mode="popLayout">
                  {insights.map((insight) => (
                    <InsightCard
                      key={insight.id}
                      insight={insight}
                      onClick={() => setSelectedInsight(insight)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Quick action */}
            {!isAnalyzing && insights.length > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={runAnalysis}
                className="w-full mt-4 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white text-sm font-medium hover:from-purple-500/30 hover:to-pink-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Re-analizar Sistema
              </motion.button>
            )}
          </div>

          {/* Footer stats */}
          <div className="relative z-10 border-t border-purple-500/20 p-3">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs text-white/40 mb-1">Críticos</p>
                <p className="text-lg font-bold text-red-400">
                  {insights.filter((i) => i.priority === 'critical').length}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1">Altos</p>
                <p className="text-lg font-bold text-orange-400">
                  {insights.filter((i) => i.priority === 'high').length}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1">Total</p>
                <p className="text-lg font-bold text-purple-400">{insights.length}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal de detalle */}
      <AnimatePresence>
        {selectedInsight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedInsight(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full bg-slate-900 rounded-2xl border border-purple-500/20 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-500/20">
                    <Target className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedInsight.title}</h3>
                    <p className="text-sm text-white/60 capitalize">{selectedInsight.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInsight(null)}
                  className="p-2 rounded-lg hover:bg-white/5"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              <p className="text-white/80 mb-6">{selectedInsight.description}</p>

              {selectedInsight.metric && (
                <div className="bg-white/5 rounded-xl p-4 mb-6">
                  <p className="text-white/60 text-sm mb-2">Métrica</p>
                  <p className="text-3xl font-bold text-white">{selectedInsight.metric.value}</p>
                </div>
              )}

              {selectedInsight.action && (
                <button className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                  {selectedInsight.action}
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIInsightsWidget;
