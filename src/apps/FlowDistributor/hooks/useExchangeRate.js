// Hook para tipo de cambio USD/MXN en tiempo real
import { useEffect, useState } from 'react';

/**
 * Hook para obtener tipo de cambio USD/MXN en tiempo real
 * Identifica mejores oportunidades para Profit (casa de cambio)
 */
export const useExchangeRate = () => {
  const [exchangeRate, setExchangeRate] = useState({
    rate: 18.5, // Default fallback
    timestamp: new Date().toISOString(),
    source: 'fallback',
    loading: true,
    error: null,
  });

  const [historicalRates, setHistoricalRates] = useState([]);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        // Intentar múltiples fuentes de APIs gratuitas
        const sources = [
          // API 1: ExchangeRate-API (gratuita, 1500 req/mes)
          {
            url: 'https://api.exchangerate-api.com/v4/latest/USD',
            parser: (data) => data.rates.MXN,
          },
          // API 2: Fixer (backup)
          {
            url: 'https://api.fixer.io/latest?base=USD&symbols=MXN',
            parser: (data) => data.rates.MXN,
          },
        ];

        let rateFound = false;

        for (const source of sources) {
          try {
            const response = await fetch(source.url);
            if (response.ok) {
              const data = await response.json();
              const rate = source.parser(data);

              setExchangeRate({
                rate: parseFloat(rate.toFixed(4)),
                timestamp: new Date().toISOString(),
                source: 'api',
                loading: false,
                error: null,
              });

              // Agregar a histórico
              setHistoricalRates((prev) => [
                ...prev.slice(-99), // Mantener últimos 100
                {
                  rate: parseFloat(rate.toFixed(4)),
                  timestamp: new Date().toISOString(),
                },
              ]);

              rateFound = true;
              break;
            }
          } catch (err) {
            console.warn(`Source ${source.url} failed:`, err);
            continue;
          }
        }

        if (!rateFound) {
          throw new Error('All sources failed');
        }
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
        setExchangeRate((prev) => ({
          ...prev,
          loading: false,
          error: 'No se pudo obtener tipo de cambio actual. Usando valor por defecto.',
        }));
      }
    };

    // Fetch inicial
    fetchExchangeRate();

    // Actualizar cada 5 minutos
    const interval = setInterval(fetchExchangeRate, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Analiza si es buen momento para enviar a Profit
   * Basado en tendencia y volatilidad
   */
  const analyzeOpportunity = () => {
    if (historicalRates.length < 10) {
      return {
        recommendation: 'ESPERAR',
        reason: 'Insuficientes datos históricos',
        confidence: 0,
      };
    }

    const recent = historicalRates.slice(-10);
    const avg = recent.reduce((sum, r) => sum + r.rate, 0) / recent.length;
    const current = exchangeRate.rate;
    const diff = ((current - avg) / avg) * 100;

    // Si está 0.5% o más arriba del promedio = VENDER USD (enviar a Profit)
    if (diff >= 0.5) {
      return {
        recommendation: 'VENDER_USD',
        reason: `Tipo de cambio ${diff.toFixed(2)}% arriba del promedio. Buen momento para convertir USD → MXN`,
        confidence: Math.min(diff * 20, 100),
        action: 'Transferir USD a Profit para conversión',
      };
    }

    // Si está 0.5% o más abajo del promedio = COMPRAR USD
    if (diff <= -0.5) {
      return {
        recommendation: 'COMPRAR_USD',
        reason: `Tipo de cambio ${Math.abs(diff).toFixed(2)}% abajo del promedio. Buen momento para convertir MXN → USD`,
        confidence: Math.min(Math.abs(diff) * 20, 100),
        action: 'Transferir MXN a Profit para conversión',
      };
    }

    return {
      recommendation: 'MANTENER',
      reason: 'Tipo de cambio estable. No hay oportunidad clara.',
      confidence: 50,
      action: 'Esperar mejor momento',
    };
  };

  /**
   * Convierte USD a MXN
   */
  const usdToMxn = (usd) => {
    return usd * exchangeRate.rate;
  };

  /**
   * Convierte MXN a USD
   */
  const mxnToUsd = (mxn) => {
    return mxn / exchangeRate.rate;
  };

  /**
   * Calcula ganancia potencial de una conversión
   */
  const calculatePotentialProfit = (amount, fromCurrency, targetRate) => {
    const current = fromCurrency === 'USD' ? usdToMxn(amount) : amount;
    const target = fromCurrency === 'USD' ? amount * targetRate : amount / targetRate;
    const diff = target - current;
    const percentage = ((target - current) / current) * 100;

    return {
      current,
      target,
      difference: diff,
      percentage,
      profitable: diff > 0,
    };
  };

  return {
    exchangeRate,
    historicalRates,
    opportunity: analyzeOpportunity(),
    usdToMxn,
    mxnToUsd,
    calculatePotentialProfit,
    loading: exchangeRate.loading,
    error: exchangeRate.error,
  };
};
