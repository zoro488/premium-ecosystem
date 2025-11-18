/**
 * 💱 EJEMPLO DE INTEGRACIÓN - WIDGET DE TIPO DE CAMBIO
 *
 * Este archivo muestra cómo integrar el sistema completo de tipo de cambio
 * en FlowDistributor con todas las funcionalidades avanzadas.
 */

import React, { useState, useEffect } from 'react';
import { CurrencyExchangeWidget } from '@/components/widgets/CurrencyExchangeWidget';
import { createExchangeSystem } from '@/services/exchangeRateService';

/**
 * PASO 1: Configurar el Sistema de Tipo de Cambio
 */
const exchangeSystem = createExchangeSystem({
  // Proveedor de API (opciones: 'exchangeRateAPI', 'openExchangeRates', 'banxico')
  apiProvider: 'exchangeRateAPI', // Cambiar a 'banxico' para usar API oficial de México

  // Tiempo de cache (ms)
  cacheTimeout: 30000, // 30 segundos

  // Umbrales de alertas
  alertThresholds: {
    priceChange: 0.5,        // 0.5% cambio → alerta
    volatility: 0.20,         // 20% volatilidad → alerta
    spread: 0.50,             // $0.50 MXN spread → alerta
    inventoryImbalance: 0.70, // 70% en una moneda → alerta
  }
});

/**
 * PASO 2: Componente de Integración
 */
export const ExchangeDashboard = () => {
  // Estado del inventario (conectar con tu base de datos)
  const [inventory, setInventory] = useState({
    usd: 50000,  // $50,000 USD
    mxn: 800000, // $800,000 MXN
  });

  // Estado de tasas y estrategia
  const [currentRate, setCurrentRate] = useState(null);
  const [strategy, setStrategy] = useState(null);
  const [alerts, setAlerts] = useState([]);

  // Actualizar análisis cada vez que cambien las tasas
  useEffect(() => {
    if (currentRate) {
      analyzeMarket();
    }
  }, [currentRate]);

  // Analizar mercado y generar estrategia
  const analyzeMarket = async () => {
    try {
      // Obtener indicadores técnicos
      const indicators = exchangeSystem.exchangeService.calculateTechnicalIndicators();

      // Analizar mejor estrategia
      const bestStrategy = await exchangeSystem.strategyEngine.analyzeAllStrategies(inventory);
      setStrategy(bestStrategy);

      // Verificar alertas
      const activeAlerts = exchangeSystem.alertSystem.checkAlerts(
        currentRate,
        indicators,
        inventory
      );
      setAlerts(activeAlerts);

      // Log para debugging
      console.log('📊 Análisis de Mercado:', {
        rate: currentRate,
        strategy: bestStrategy,
        alerts: activeAlerts,
        indicators,
      });
    } catch (error) {
      console.error('Error al analizar mercado:', error);
    }
  };

  // Callback cuando se actualiza la tasa
  const handleRateUpdate = (newRate) => {
    console.log('💱 Nueva tasa recibida:', newRate);
    setCurrentRate(newRate);

    // Aquí puedes:
    // 1. Guardar en base de datos
    // 2. Enviar notificaciones
    // 3. Actualizar UI en tiempo real
    // 4. Trigger automático de órdenes
  };

  // Simular transacción (conectar con tu lógica de negocio)
  const handleTransaction = (type, amount) => {
    console.log(`🔄 Transacción ${type}:`, amount);

    // Actualizar inventario
    if (type === 'BUY_USD') {
      setInventory(prev => ({
        usd: prev.usd + amount,
        mxn: prev.mxn - (amount * currentRate.buy),
      }));
    } else if (type === 'SELL_USD') {
      setInventory(prev => ({
        usd: prev.usd - amount,
        mxn: prev.mxn + (amount * currentRate.sell),
      }));
    }

    // Guardar en base de datos
    // saveTransaction({ type, amount, rate: currentRate, timestamp: new Date() });
  };

  return (
    <div className="exchange-dashboard p-6 space-y-6">
      {/* Widget Principal */}
      <CurrencyExchangeWidget
        inventory={inventory}
        autoRefresh={true}
        refreshInterval={30000} // 30 segundos
        onRateUpdate={handleRateUpdate}
      />

      {/* Panel de Alertas (si hay) */}
      {alerts.length > 0 && (
        <div className="alerts-panel bg-zinc-9000/10 border border-zinc-500/30 rounded-xl p-4">
          <h3 className="text-lg font-bold text-white mb-3">⚠️ Alertas Activas</h3>
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`
                  p-3 rounded-lg
                  ${alert.severity === 'HIGH' ? 'bg-zinc-9000/20' :
                    alert.severity === 'MEDIUM' ? 'bg-zinc-9000/20' :
                    'bg-zinc-800/20'}
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{alert.message}</span>
                  <span className="text-xs text-gray-400">{alert.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Panel de Acciones Rápidas */}
      {strategy && (
        <div className="quick-actions bg-white/5 rounded-xl p-4">
          <h3 className="text-lg font-bold text-white mb-3">⚡ Acciones Recomendadas</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleTransaction('BUY_USD', 1000)}
              className="p-4 rounded-lg bg-zinc-9000/20 hover:bg-zinc-9000/30 border border-zinc-500/30 transition-all"
            >
              <div className="text-sm text-gray-300">Comprar USD</div>
              <div className="text-2xl font-bold text-zinc-200">+$1,000</div>
            </button>
            <button
              onClick={() => handleTransaction('SELL_USD', 1000)}
              className="p-4 rounded-lg bg-zinc-9000/20 hover:bg-zinc-9000/30 border border-zinc-500/30 transition-all"
            >
              <div className="text-sm text-gray-300">Vender USD</div>
              <div className="text-2xl font-bold text-zinc-200">-$1,000</div>
            </button>
          </div>
        </div>
      )}

      {/* Panel de Estadísticas */}
      <div className="stats-panel bg-white/5 rounded-xl p-4">
        <h3 className="text-lg font-bold text-white mb-3">📊 Estadísticas del Día</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-zinc-800/10">
            <div className="text-xs text-gray-400">Operaciones</div>
            <div className="text-2xl font-bold text-white">24</div>
          </div>
          <div className="p-3 rounded-lg bg-zinc-9000/10">
            <div className="text-xs text-gray-400">Ganancia</div>
            <div className="text-2xl font-bold text-zinc-200">$8,450</div>
          </div>
          <div className="p-3 rounded-lg bg-zinc-800/10">
            <div className="text-xs text-gray-400">Spread Prom.</div>
            <div className="text-2xl font-bold text-zinc-800">$0.35</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * PASO 3: Integración con FlowDistributor Principal
 */
export const IntegrateIntoFlowDistributor = () => {
  return `
  // En tu FlowDistributor.jsx principal:

  import { ExchangeDashboard } from '@/components/ExchangeDashboard';

  function FlowDistributor() {
    return (
      <div className="flow-distributor">
        {/* Tus paneles existentes */}
        <Panel name="ventas">...</Panel>
        <Panel name="compras">...</Panel>

        {/* NUEVO: Panel de Casa de Cambio */}
        <Panel name="tipo-cambio">
          <ExchangeDashboard />
        </Panel>
      </div>
    );
  }
  `;
};

/**
 * PASO 4: Configuración de APIs Reales
 */
export const setupRealAPIs = () => {
  return {
    // 1. Para usar Banco de México (RECOMENDADO para México)
    banxico: {
      steps: [
        '1. Visita: https://www.banxico.org.mx/SieAPIRest/service/v1/',
        '2. Solicita un token gratuito',
        '3. En exchangeRateService.js, configura:',
        "   API_CONFIGS.banxico.token = 'TU_TOKEN_AQUI'",
        '4. Al crear el sistema, usa: apiProvider: "banxico"',
      ],
      code: `
const system = createExchangeSystem({
  apiProvider: 'banxico',
  cacheTimeout: 60000, // 1 minuto (no necesita ser tan frecuente)
});
      `,
    },

    // 2. Para usar ExchangeRate-API (Más simple, internacional)
    exchangeRateAPI: {
      steps: [
        '1. No requiere registro para uso básico',
        '2. Límite: 1,500 requests/mes gratis',
        '3. Ya configurado por defecto',
        '4. Para más requests: https://www.exchangerate-api.com/pricing',
      ],
      code: `
const system = createExchangeSystem({
  apiProvider: 'exchangeRateAPI',
  cacheTimeout: 30000, // 30 segundos
});
      `,
    },

    // 3. Para usar Open Exchange Rates (Profesional)
    openExchangeRates: {
      steps: [
        '1. Registrate en: https://openexchangerates.org/signup',
        '2. Obtén tu App ID',
        '3. En exchangeRateService.js:',
        "   API_CONFIGS.openExchangeRates.appId = 'TU_APP_ID'",
        '4. Plan gratis: 1,000 requests/mes',
        '5. Plan pagado desde $12/mes: datos en tiempo real',
      ],
      code: `
const system = createExchangeSystem({
  apiProvider: 'openExchangeRates',
  cacheTimeout: 10000, // 10 segundos (si tienes plan pagado)
});
      `,
    },
  };
};

/**
 * PASO 5: Funciones de Utilidad
 */

// Calcular ganancia de una operación
export const calculateProfit = (amount, buyRate, sellRate) => {
  const spread = sellRate - buyRate;
  return amount * spread;
};

// Calcular spread óptimo según condiciones
export const calculateOptimalSpread = (volatility, inventoryBalance, timeOfDay) => {
  let baseSpread = 0.30;

  // Ajuste por volatilidad
  if (volatility > 0.15) {
    baseSpread += 0.15; // Más spread en alta volatilidad
  } else if (volatility < 0.05) {
    baseSpread -= 0.05; // Menos spread en baja volatilidad
  }

  // Ajuste por inventario
  if (inventoryBalance > 0.65) {
    baseSpread -= 0.05; // Incentivar ventas de USD
  } else if (inventoryBalance < 0.35) {
    baseSpread += 0.05; // Desincentivar ventas de USD
  }

  // Ajuste por hora del día (9am-2pm es hora pico)
  const hour = timeOfDay.getHours();
  if (hour >= 9 && hour <= 14) {
    baseSpread += 0.05; // Mayor spread en hora pico
  }

  return Math.max(0.20, Math.min(0.50, baseSpread)); // Entre 0.20 y 0.50
};

// Determinar si es buen momento para operar
export const shouldOperateNow = (indicators) => {
  const { volatility, rsi, macd } = indicators;

  // No operar en extrema volatilidad
  if (volatility > 0.25) {
    return {
      should: false,
      reason: 'Volatilidad extrema. Esperar estabilidad.',
    };
  }

  // Buen momento si hay señales claras
  if ((rsi < 30 && macd.histogram > 0) || (rsi > 70 && macd.histogram < 0)) {
    return {
      should: true,
      reason: 'Señales técnicas claras. Buen momento para operar.',
    };
  }

  return {
    should: true,
    reason: 'Condiciones normales de mercado.',
  };
};

/**
 * PASO 6: Hooks Personalizados
 */

// Hook para usar el sistema de tipo de cambio
export const useExchangeRate = (config = {}) => {
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const system = createExchangeSystem(config);

    const fetchRate = async () => {
      try {
        setLoading(true);
        const newRate = await system.exchangeService.getCurrentRate();
        setRate(newRate);
        setError(null);
      } catch (err) {
        setError(err);
        console.error('Error fetching rate:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRate();

    // Auto refresh
    const interval = setInterval(fetchRate, config.refreshInterval || 30000);

    return () => clearInterval(interval);
  }, []);

  return { rate, loading, error };
};

// Hook para análisis de estrategia
export const useStrategy = (rate, inventory) => {
  const [strategy, setStrategy] = useState(null);

  useEffect(() => {
    if (rate && inventory) {
      const system = createExchangeSystem();
      system.exchangeService.historicalData.push(rate);

      const analyze = async () => {
        const result = await system.strategyEngine.analyzeAllStrategies(inventory);
        setStrategy(result);
      };

      analyze();
    }
  }, [rate, inventory]);

  return strategy;
};

/**
 * PASO 7: Ejemplo de Uso Completo
 */
export default function CompleteExample() {
  // Usar hooks personalizados
  const { rate, loading, error } = useExchangeRate({
    apiProvider: 'exchangeRateAPI',
    refreshInterval: 30000,
  });

  const inventory = {
    usd: 50000,
    mxn: 800000,
  };

  const strategy = useStrategy(rate, inventory);

  if (loading) return <div>Cargando tipo de cambio...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Casa de Cambio - FlowDistributor</h1>

      {/* Widget principal */}
      <ExchangeDashboard />

      {/* Información adicional */}
      {rate && (
        <div className="mt-4 p-4 bg-white/5 rounded-lg">
          <h2 className="font-bold mb-2">Información de API</h2>
          <p>Fuente: {rate.source}</p>
          <p>Última actualización: {new Date(rate.timestamp).toLocaleString()}</p>
        </div>
      )}

      {/* Estrategia recomendada */}
      {strategy && (
        <div className="mt-4 p-4 bg-zinc-800/10 rounded-lg">
          <h2 className="font-bold mb-2">Estrategia Actual</h2>
          <p>Acción: {strategy.action}</p>
          <p>Confianza: {strategy.confidence}%</p>
          <p>Razón: {strategy.reason}</p>
        </div>
      )}
    </div>
  );
}

/**
 * 🎓 NOTAS IMPORTANTES
 *
 * 1. SEGURIDAD:
 *    - Nunca expongas tus API keys en el frontend
 *    - Usa variables de entorno: process.env.NEXT_PUBLIC_API_KEY
 *    - Considera usar un backend para manejar APIs
 *
 * 2. PERFORMANCE:
 *    - Cache apropiado (30-60 segundos)
 *    - No hacer requests excesivos
 *    - Usar websockets para datos en tiempo real si es necesario
 *
 * 3. BASE DE DATOS:
 *    - Guarda cada transacción con timestamp
 *    - Mantén historial para análisis
 *    - Backups automáticos diarios
 *
 * 4. TESTING:
 *    - Comienza con modo simulación
 *    - Prueba con pequeñas cantidades
 *    - Valida todos los cálculos
 *
 * 5. LEGAL:
 *    - Cumple con regulaciones locales
 *    - Registro ante autoridades financieras
 *    - Implementa KYC (Know Your Customer)
 *    - Reporta operaciones sospechosas
 */
