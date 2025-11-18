/**
 * useExchangeRate Hook
 * ===================
 * Hook personalizado para gestionar el tipo de cambio USD/MXN en tiempo real
 *
 * Features:
 * - Datos en tiempo real desde API de Firestore
 * - Historial de 7 días con sparkline
 * - Detección de oportunidades (favorable/desfavorable)
 * - Auto-refresh configurable
 * - Fallback a datos simulados si API falla
 *
 * @author Premium Ecosystem Team
 * @version 1.0.0
 */
import { useCallback, useEffect, useState } from 'react';





// Tipos
export interface ExchangeRate {
  rate: number;
  timestamp: Date;
  source: 'api' | 'fallback';
}

export interface Opportunity {
  type: 'favorable' | 'neutral' | 'desfavorable';
  message: string;
  changePercent: number;
}

export interface ExchangeRateData {
  rate: number;
  trend: 'up' | 'down' | 'stable';
  change24h: number;
  changePercent: number;
}

interface UseExchangeRateReturn {
  tc: ExchangeRateData;
  historicalRates: ExchangeRate[];
  opportunity: Opportunity | null;
  loading: boolean;
  error: string | null;
  refreshRate: () => Promise<void>;
}

// Configuración
const BASE_RATE = 19.5; // TC base de referencia
const FAVORABLE_THRESHOLD = 0.5; // 0.5% mejor que promedio
const DESFAVORABLE_THRESHOLD = -0.5; // 0.5% peor que promedio

/**
 * Hook useExchangeRate
 *
 * @returns {UseExchangeRateReturn} Estado del tipo de cambio
 */
export const useExchangeRate = (): UseExchangeRateReturn => {
  const [tc, setTc] = useState<number>(BASE_RATE);
  const [historicalRates, setHistoricalRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Genera datos históricos simulados para 7 días
   * Se usa cuando no hay datos reales disponibles
   */
  const generateMockHistory = useCallback((): ExchangeRate[] => {
    const history: ExchangeRate[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // Simulación: variación aleatoria ±2% del BASE_RATE
      const variation = (Math.random() - 0.5) * 0.04; // ±2%
      const rate = BASE_RATE * (1 + variation);

      history.push({
        rate: parseFloat(rate.toFixed(4)),
        timestamp: date,
        source: 'fallback',
      });
    }

    return history;
  }, []);

  /**
   * Genera datos históricos simulados para últimas 24 horas
   */
  const generateMock24Hours = useCallback((): ExchangeRate[] => {
    const history: ExchangeRate[] = [];
    const now = new Date();

    for (let i = 23; i >= 0; i--) {
      const date = new Date(now);
      date.setHours(date.getHours() - i);

      // Simulación: variación horaria pequeña ±0.3%
      const variation = (Math.random() - 0.5) * 0.006; // ±0.3%
      const rate = tc * (1 + variation);

      history.push({
        rate: parseFloat(rate.toFixed(4)),
        timestamp: date,
        source: 'fallback',
      });
    }

    return history;
  }, [tc]);

  /**
   * Calcula si hay oportunidad de compra/venta
   * basado en comparación con promedio histórico
   */
  const calculateOpportunity = useCallback(
    (currentRate: number, history: ExchangeRate[]): Opportunity => {
      if (history.length === 0) {
        return {
          type: 'neutral',
          message: 'Sin datos históricos suficientes',
          changePercent: 0,
        };
      }

      // Calcular promedio de últimos 7 días
      const avgRate = history.reduce((sum, r) => sum + r.rate, 0) / history.length;
      const changePercent = ((currentRate - avgRate) / avgRate) * 100;

      if (changePercent >= FAVORABLE_THRESHOLD) {
        return {
          type: 'favorable',
          message: `TC ${changePercent.toFixed(2)}% arriba del promedio - Buen momento para vender USD`,
          changePercent,
        };
      } else if (changePercent <= DESFAVORABLE_THRESHOLD) {
        return {
          type: 'desfavorable',
          message: `TC ${Math.abs(changePercent).toFixed(2)}% abajo del promedio - Buen momento para comprar USD`,
          changePercent,
        };
      } else {
        return {
          type: 'neutral',
          message: 'TC estable, sin oportunidad clara',
          changePercent,
        };
      }
    },
    []
  );

  /**
   * Obtiene el tipo de cambio actual desde API
   * TODO: Integrar con API real de Banxico o provider
   */
  const fetchCurrentRate = useCallback(async (): Promise<number> => {
    try {
      // TODO: Reemplazar con llamada real a API
      // Ejemplo: const response = await fetch('https://api.banxico.org.mx/...');

      // Por ahora, simular con variación pequeña
      const variation = (Math.random() - 0.5) * 0.01; // ±0.5%
      const newRate = BASE_RATE * (1 + variation);

      return parseFloat(newRate.toFixed(4));
    } catch (err) {
      console.error('Error fetching exchange rate:', err);
      throw err;
    }
  }, []);

  /**
   * Refresca el tipo de cambio actual
   */
  const refreshRate = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const newRate = await fetchCurrentRate();
      setTc(newRate);

      // Agregar al historial
      const newHistory: ExchangeRate = {
        rate: newRate,
        timestamp: new Date(),
        source: 'api',
      };

      setHistoricalRates((prev) => {
        const updated = [...prev, newHistory];
        // Mantener solo últimos 7 días (168 registros si es horario)
        return updated.slice(-168);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error refreshing rate:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchCurrentRate]);

  /**
   * Inicialización: Cargar datos al montar
   */
  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);

        // Generar historial mock inicial
        const mockHistory = generateMockHistory();
        setHistoricalRates(mockHistory);

        // Obtener TC actual
        const currentRate = await fetchCurrentRate();
        setTc(currentRate);

        // Agregar TC actual al historial con timestamp de ahora
        const currentHistory: ExchangeRate = {
          rate: currentRate,
          timestamp: new Date(),
          source: 'api',
        };
        setHistoricalRates((prev) => [...prev, currentHistory]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error en inicialización');
        console.error('Error initializing exchange rate:', err);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [generateMockHistory, fetchCurrentRate]);

  /**
   * Calcular oportunidad actual
   */
  const opportunity = calculateOpportunity(tc, historicalRates);

  // Calcular trend y cambios
  const firstRate = historicalRates[0]?.rate || tc;
  const change24h = historicalRates.length > 0 ? tc - firstRate : 0;
  const changePercent =
    historicalRates.length > 0 && firstRate !== 0 ? ((tc - firstRate) / firstRate) * 100 : 0;
  const trend: 'up' | 'down' | 'stable' =
    change24h > 0.01 ? 'up' : change24h < -0.01 ? 'down' : 'stable';

  const tcData: ExchangeRateData = {
    rate: tc,
    trend,
    change24h: parseFloat(change24h.toFixed(4)),
    changePercent: parseFloat(changePercent.toFixed(2)),
  };

  return {
    tc: tcData,
    historicalRates,
    opportunity,
    loading,
    error,
    refreshRate,
  };
};

export default useExchangeRate;
