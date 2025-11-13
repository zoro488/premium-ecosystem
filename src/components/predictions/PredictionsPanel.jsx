/**
 * 📊 PREDICTIONS PANEL
 * Panel de predicciones con ML real
 */
import { useEffect, useState } from 'react';

import { AlertCircle, TrendingDown, TrendingUp } from 'lucide-react';

import hybridAI from '../../services/ai/HybridAIService';

export default function PredictionsPanel({ productId }) {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPredictions();
  }, [productId]);

  const loadPredictions = async () => {
    setLoading(true);

    try {
      // Obtener datos históricos (mock por ahora)
      const historicalSales = [
        { week: 1, sales: 450 },
        { week: 2, sales: 520 },
        { week: 3, sales: 480 },
        { week: 4, sales: 590 },
      ];

      // Predecir próximas 4 semanas
      const forecast = await hybridAI.predict('sales', {
        historicalSales,
        productId,
        weeks: 4,
      });

      setPredictions(forecast);
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass p-6 rounded-xl">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-white/5 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!predictions) return null;

  return (
    <div className="glass p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Predicción de Ventas</h3>
        <div className="flex items-center gap-2 text-sm text-emerald-400">
          <TrendingUp className="w-4 h-4" />
          <span>Confianza: {(predictions.confidence * 100).toFixed(0)}%</span>
        </div>
      </div>

      <div className="space-y-3">
        {predictions.predictions?.map((pred, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <p className="font-medium">Semana {pred.week}</p>
              <p className="text-sm text-slate-400">
                {pred.confidence > 0.8 ? 'Alta confianza' : 'Confianza media'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-400">{pred.predicted_sales}</p>
              <p className="text-sm text-slate-400">unidades</p>
            </div>
          </div>
        ))}
      </div>

      {predictions.recommendations && (
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <p className="font-medium text-blue-400 mb-2">Recomendaciones</p>
              <ul className="space-y-1 text-sm text-slate-300">
                {predictions.recommendations.map((rec, idx) => (
                  <li key={idx}>• {rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
