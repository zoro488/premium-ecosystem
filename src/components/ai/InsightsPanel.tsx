/**
 * 💡 INSIGHTS PANEL - Panel de Análisis Financiero AI
 *
 * Muestra predicciones, insights y recomendaciones generadas por AI
 */

import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import type { FinancialAnalysis } from '../../services/ai/aiService';
import { useFinancialAnalysis } from '../../services/ai/useAI';

interface InsightsPanelProps {
  data: {
    ingresos: Array<{ monto: number; fecha: string; categoria: string }>;
    gastos: Array<{ monto: number; fecha: string; categoria: string }>;
    periodo: string;
  };
  autoAnalyze?: boolean;
}

export function InsightsPanel({ data, autoAnalyze = true }: InsightsPanelProps) {
  const { analysis, isAnalyzing, error, analyze, refresh } = useFinancialAnalysis();

  // Auto-analizar al montar si está habilitado
  React.useEffect(() => {
    if (autoAnalyze && data.ingresos.length > 0 && data.gastos.length > 0) {
      analyze(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoAnalyze]);

  if (!analysis && !isAnalyzing && !error) {
    return (
      <motion.div
        className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Análisis AI Disponible
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Obtén predicciones y recomendaciones inteligentes sobre tus finanzas
          </p>
          <button
            onClick={() => analyze(data)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            🚀 Analizar con AI
          </button>
        </div>
      </motion.div>
    );
  }

  if (isAnalyzing) {
    return (
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <motion.div
            className="inline-block w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
            Analizando datos financieros...
          </p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-start gap-3">
          <span className="text-3xl">❌</span>
          <div className="flex-1">
            <h3 className="font-bold text-red-600 dark:text-red-400 mb-1">Error en Análisis</h3>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => analyze(data)}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          Análisis AI - {analysis?.periodo}
        </h3>
        <button
          onClick={refresh}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="Actualizar análisis"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* PREDICCIÓN */}
      {analysis && (
        <PredictionCard
          prediccion={analysis.prediccion}
          tendencia={analysis.tendencia}
        />
      )}

      {/* INSIGHTS */}
      {analysis && analysis.insights.length > 0 && (
        <InsightsGrid insights={analysis.insights} />
      )}

      {/* RECOMENDACIONES */}
      {analysis && analysis.recomendaciones.length > 0 && (
        <RecommendationsCard recomendaciones={analysis.recomendaciones} />
      )}

      {/* ALERTAS */}
      {analysis && analysis.alertas.length > 0 && (
        <AlertsCard alertas={analysis.alertas} />
      )}
    </motion.div>
  );
}

// ============================================================================
// PREDICTION CARD
// ============================================================================

interface PredictionCardProps {
  prediccion: FinancialAnalysis['prediccion'];
  tendencia: string;
}

function PredictionCard({ prediccion, tendencia }: PredictionCardProps) {
  const confidenceColor =
    prediccion.confianza >= 0.8
      ? 'text-green-600 dark:text-green-400'
      : prediccion.confianza >= 0.6
        ? 'text-yellow-600 dark:text-yellow-400'
        : 'text-red-600 dark:text-red-400';

  return (
    <motion.div
      className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white shadow-xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium opacity-90">Predicción Próximo Periodo</p>
          <p className="text-3xl font-bold mt-1">{prediccion.periodo}</p>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-90">Confianza</p>
          <p className={`text-2xl font-bold ${confidenceColor}`}>
            {Math.round(prediccion.confianza * 100)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white/10 rounded-lg p-3">
          <p className="text-xs opacity-75">Ingresos</p>
          <p className="text-lg font-bold">${prediccion.ingresosEstimados.toLocaleString()}</p>
        </div>
        <div className="bg-white/10 rounded-lg p-3">
          <p className="text-xs opacity-75">Gastos</p>
          <p className="text-lg font-bold">${prediccion.gastosEstimados.toLocaleString()}</p>
        </div>
        <div className="bg-white/10 rounded-lg p-3">
          <p className="text-xs opacity-75">Utilidad</p>
          <p className="text-lg font-bold">${prediccion.utilidadEstimada.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white/10 rounded-lg p-3">
        <p className="text-sm font-medium mb-1">📈 Tendencia</p>
        <p className="text-sm opacity-90">{tendencia}</p>
      </div>
    </motion.div>
  );
}

// ============================================================================
// INSIGHTS GRID
// ============================================================================

function InsightsGrid({ insights }: { insights: string[] }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="text-xl">💡</span>
        Insights Clave
      </h4>
      <div className="grid gap-3">
        <AnimatePresence>
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================================================
// RECOMMENDATIONS CARD
// ============================================================================

function RecommendationsCard({ recomendaciones }: { recomendaciones: string[] }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="text-xl">🎯</span>
        Recomendaciones
      </h4>
      <div className="space-y-3">
        <AnimatePresence>
          {recomendaciones.map((rec, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="text-xl">✅</span>
              <p className="flex-1 text-sm text-gray-700 dark:text-gray-300">{rec}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================================================
// ALERTS CARD
// ============================================================================

function AlertsCard({ alertas }: { alertas: FinancialAnalysis['alertas'] }) {
  const getSeverityStyles = (tipo: string) => {
    switch (tipo) {
      case 'critica':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400';
      case 'advertencia':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="text-xl">⚠️</span>
        Alertas
      </h4>
      <div className="space-y-3">
        <AnimatePresence>
          {alertas.map((alerta, index) => (
            <motion.div
              key={index}
              className={`rounded-lg p-4 border ${getSeverityStyles(alerta.tipo)}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium mb-1">{alerta.mensaje}</p>
                  {alerta.accion && (
                    <p className="text-sm opacity-75">
                      <strong>Acción:</strong> {alerta.accion}
                    </p>
                  )}
                </div>
                <span className="text-2xl">
                  {alerta.tipo === 'critica' ? '🚨' : alerta.tipo === 'advertencia' ? '⚠️' : 'ℹ️'}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default InsightsPanel;
