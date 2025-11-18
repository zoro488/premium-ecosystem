/**
 * 💱 SERVICIO DE TIPO DE CAMBIO Y ANÁLISIS DE MERCADO
 *
 * Integración con APIs reales de forex para obtener:
 * - Cotizaciones en tiempo real USD/MXN
 * - Datos históricos para análisis de tendencias
 * - Análisis técnico avanzado
 * - Señales de trading automatizadas
 */

// ============================================================================
// CONFIGURACIÓN DE APIs
// ============================================================================

const API_CONFIGS = {
  // 1. ExchangeRate-API (Gratuita, 1500 requests/mes)
  exchangeRateAPI: {
    baseUrl: 'https://api.exchangerate-api.com/v4/latest',
    free: true,
    rateLimit: 1500, // por mes
  },

  // 2. Open Exchange Rates (Gratis: 1000 req/mes, Paid: desde $12/mes)
  openExchangeRates: {
    baseUrl: 'https://openexchangerates.org/api',
    appId: 'TU_APP_ID', // Registrarse en https://openexchangerates.org
    free: true,
    rateLimit: 1000,
  },

  // 3. Fixer.io (Gratis: 100 req/mes, Paid: desde $10/mes)
  fixer: {
    baseUrl: 'https://data.fixer.io/api',
    apiKey: 'TU_API_KEY', // Registrarse en https://fixer.io
    free: true,
    rateLimit: 100,
  },

  // 4. CurrencyAPI (Gratis: 300 req/mes)
  currencyAPI: {
    baseUrl: 'https://api.currencyapi.com/v3',
    apiKey: 'TU_API_KEY', // Registrarse en https://currencyapi.com
    free: true,
    rateLimit: 300,
  },

  // 5. Banco de México API (Oficial, gratuita)
  banxico: {
    baseUrl: 'https://www.banxico.org.mx/SieAPIRest/service/v1/series',
    token: 'TU_TOKEN', // Solicitar en https://www.banxico.org.mx/SieAPIRest/service/v1/
    seriesId: 'SF43718', // Serie del tipo de cambio FIX
    free: true,
  },
};

// ============================================================================
// CLASE DE SERVICIO DE TIPO DE CAMBIO
// ============================================================================

export class ExchangeRateService {
  constructor(config = {}) {
    this.cache = new Map();
    this.cacheTimeout = config.cacheTimeout || 30000; // 30 segundos
    this.apiProvider = config.apiProvider || 'exchangeRateAPI';
    this.historicalData = [];
  }

  // Obtener tasa actual desde múltiples fuentes
  async getCurrentRate() {
    const cacheKey = 'current_rate';
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      let rateData;

      switch (this.apiProvider) {
        case 'exchangeRateAPI':
          rateData = await this.fetchFromExchangeRateAPI();
          break;
        case 'openExchangeRates':
          rateData = await this.fetchFromOpenExchangeRates();
          break;
        case 'banxico':
          rateData = await this.fetchFromBanxico();
          break;
        default:
          rateData = await this.fetchFromExchangeRateAPI();
      }

      this.cache.set(cacheKey, {
        data: rateData,
        timestamp: Date.now(),
      });

      // Guardar en historial
      this.historicalData.push({
        ...rateData,
        timestamp: Date.now(),
      });

      // Mantener solo últimos 1000 registros
      if (this.historicalData.length > 1000) {
        this.historicalData.shift();
      }

      return rateData;
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      // Fallback a simulación si falla la API
      return this.getSimulatedRate();
    }
  }

  // Fetch desde ExchangeRate-API
  async fetchFromExchangeRateAPI() {
    const response = await fetch(`${API_CONFIGS.exchangeRateAPI.baseUrl}/USD`);
    const data = await response.json();

    const mxnRate = data.rates.MXN;
    const spread = 0.3; // Spread típico de casa de cambio

    return {
      buy: mxnRate,
      sell: mxnRate + spread,
      mid: mxnRate + spread / 2,
      source: 'ExchangeRate-API',
      timestamp: new Date(data.time_last_updated * 1000).toISOString(),
    };
  }

  // Fetch desde Open Exchange Rates
  async fetchFromOpenExchangeRates() {
    const { baseUrl, appId } = API_CONFIGS.openExchangeRates;
    const response = await fetch(`${baseUrl}/latest.json?app_id=${appId}&base=USD&symbols=MXN`);
    const data = await response.json();

    const mxnRate = data.rates.MXN;
    const spread = 0.3;

    return {
      buy: mxnRate,
      sell: mxnRate + spread,
      mid: mxnRate + spread / 2,
      source: 'Open Exchange Rates',
      timestamp: new Date(data.timestamp * 1000).toISOString(),
    };
  }

  // Fetch desde Banco de México (oficial)
  async fetchFromBanxico() {
    const { baseUrl, token, seriesId } = API_CONFIGS.banxico;
    const response = await fetch(`${baseUrl}/${seriesId}/datos/oportuno`, {
      headers: {
        'Bmx-Token': token,
      },
    });
    const data = await response.json();

    const latestData = data.bmx.series[0].datos[0];
    const mxnRate = Number.parseFloat(latestData.dato);
    const spread = 0.3;

    return {
      buy: mxnRate,
      sell: mxnRate + spread,
      mid: mxnRate + spread / 2,
      source: 'Banco de México',
      timestamp: latestData.fecha,
    };
  }

  // Simulación realista (fallback)
  getSimulatedRate() {
    const baseRate = 17.25;
    const volatility = 0.15;
    const trend = Math.sin(Date.now() / 100000) * 0.5;
    const random = (Math.random() - 0.5) * volatility;
    const spread = 0.3;

    const buy = baseRate + trend + random;

    return {
      buy: Number(buy.toFixed(4)),
      sell: Number((buy + spread).toFixed(4)),
      mid: Number((buy + spread / 2).toFixed(4)),
      source: 'Simulation',
      timestamp: new Date().toISOString(),
    };
  }

  // Obtener datos históricos
  getHistoricalData(periods = 100) {
    return this.historicalData.slice(-periods);
  }

  // Calcular indicadores técnicos
  calculateTechnicalIndicators() {
    const data = this.getHistoricalData();
    if (data.length < 20) return null;

    const prices = data.map((d) => d.buy);

    return {
      sma20: this.calculateSMA(prices, 20),
      sma50: this.calculateSMA(prices, 50),
      ema12: this.calculateEMA(prices, 12),
      ema26: this.calculateEMA(prices, 26),
      rsi: this.calculateRSI(prices, 14),
      macd: this.calculateMACD(prices),
      bollingerBands: this.calculateBollingerBands(prices, 20, 2),
      volatility: this.calculateVolatility(prices),
    };
  }

  // Simple Moving Average
  calculateSMA(prices, period) {
    if (prices.length < period) return null;
    const slice = prices.slice(-period);
    const sum = slice.reduce((a, b) => a + b, 0);
    return sum / period;
  }

  // Exponential Moving Average
  calculateEMA(prices, period) {
    if (prices.length < period) return null;
    const multiplier = 2 / (period + 1);
    let ema = this.calculateSMA(prices.slice(0, period), period);

    for (let i = period; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema;
    }

    return ema;
  }

  // Relative Strength Index
  calculateRSI(prices, period = 14) {
    if (prices.length < period + 1) return null;

    const changes = [];
    for (let i = 1; i < prices.length; i++) {
      changes.push(prices[i] - prices[i - 1]);
    }

    const gains = changes.map((c) => (c > 0 ? c : 0));
    const losses = changes.map((c) => (c < 0 ? Math.abs(c) : 0));

    const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;

    const rs = avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);

    return rsi;
  }

  // MACD (Moving Average Convergence Divergence)
  calculateMACD(prices) {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);

    if (!ema12 || !ema26) return null;

    const macdLine = ema12 - ema26;
    const signalLine = this.calculateEMA([macdLine], 9);
    const histogram = macdLine - signalLine;

    return {
      macdLine,
      signalLine,
      histogram,
    };
  }

  // Bollinger Bands
  calculateBollingerBands(prices, period = 20, stdDev = 2) {
    const sma = this.calculateSMA(prices, period);
    if (!sma) return null;

    const slice = prices.slice(-period);
    const squaredDiffs = slice.map((price) => Math.pow(price - sma, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / period;
    const standardDeviation = Math.sqrt(variance);

    return {
      upper: sma + standardDeviation * stdDev,
      middle: sma,
      lower: sma - standardDeviation * stdDev,
      bandwidth: (standardDeviation * stdDev * 2) / sma,
    };
  }

  // Volatilidad (desviación estándar)
  calculateVolatility(prices, period = 20) {
    const slice = prices.slice(-period);
    const mean = slice.reduce((a, b) => a + b, 0) / period;
    const squaredDiffs = slice.map((price) => Math.pow(price - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / period;
    return Math.sqrt(variance);
  }
}

// ============================================================================
// MOTOR DE ESTRATEGIAS DE TRADING
// ============================================================================

export class TradingStrategyEngine {
  constructor(exchangeService) {
    this.exchangeService = exchangeService;
    this.strategies = {
      meanReversion: this.meanReversionStrategy.bind(this),
      trendFollowing: this.trendFollowingStrategy.bind(this),
      momentumTrading: this.momentumTradingStrategy.bind(this),
      volatilityBreakout: this.volatilityBreakoutStrategy.bind(this),
      inventoryBalance: this.inventoryBalanceStrategy.bind(this),
    };
  }

  // Analizar todas las estrategias y recomendar la mejor
  async analyzeAllStrategies(inventory) {
    const indicators = this.exchangeService.calculateTechnicalIndicators();
    if (!indicators) return null;

    const strategies = [];

    for (const [name, strategy] of Object.entries(this.strategies)) {
      const result = await strategy(indicators, inventory);
      if (result) {
        strategies.push({ name, ...result });
      }
    }

    // Ordenar por confianza
    strategies.sort((a, b) => b.confidence - a.confidence);

    return strategies[0]; // Retornar la mejor estrategia
  }

  // Estrategia 1: Reversión a la Media
  meanReversionStrategy(indicators, inventory) {
    const { sma20, bollingerBands } = indicators;
    const currentPrice = this.exchangeService.historicalData.slice(-1)[0]?.buy;

    if (!currentPrice || !sma20 || !bollingerBands) return null;

    const deviation = ((currentPrice - sma20) / sma20) * 100;
    const dollarRatio = inventory.usd / (inventory.usd + inventory.mxn / currentPrice);

    let action = 'HOLD';
    let confidence = 0;
    let reason = '';

    // Comprar si precio está por debajo de la banda inferior
    if (currentPrice < bollingerBands.lower && dollarRatio < 0.6) {
      action = 'BUY_USD';
      confidence = 75 + Math.min(Math.abs(deviation), 20);
      reason = `Precio ${Math.abs(deviation).toFixed(2)}% por debajo de la media. Oportunidad de compra.`;
    }
    // Vender si precio está por encima de la banda superior
    else if (currentPrice > bollingerBands.upper && dollarRatio > 0.4) {
      action = 'SELL_USD';
      confidence = 75 + Math.min(Math.abs(deviation), 20);
      reason = `Precio ${Math.abs(deviation).toFixed(2)}% por encima de la media. Oportunidad de venta.`;
    }

    return confidence > 0 ? { action, confidence, reason, targetSpread: 0.3 } : null;
  }

  // Estrategia 2: Seguimiento de Tendencia
  trendFollowingStrategy(indicators, inventory) {
    const { sma20, sma50, ema12, ema26 } = indicators;
    const currentPrice = this.exchangeService.historicalData.slice(-1)[0]?.buy;

    if (!currentPrice || !sma20 || !sma50 || !ema12 || !ema26) return null;

    const dollarRatio = inventory.usd / (inventory.usd + inventory.mxn / currentPrice);

    let action = 'HOLD';
    let confidence = 0;
    let reason = '';

    // Golden Cross: EMA12 cruza por encima de EMA26
    if (ema12 > ema26 && sma20 > sma50 && dollarRatio < 0.7) {
      action = 'BUY_USD';
      confidence = 80;
      reason = 'Tendencia alcista confirmada (Golden Cross). Comprar USD.';
    }
    // Death Cross: EMA12 cruza por debajo de EMA26
    else if (ema12 < ema26 && sma20 < sma50 && dollarRatio > 0.3) {
      action = 'SELL_USD';
      confidence = 80;
      reason = 'Tendencia bajista confirmada (Death Cross). Vender USD.';
    }

    return confidence > 0 ? { action, confidence, reason, targetSpread: 0.3 } : null;
  }

  // Estrategia 3: Momentum Trading
  momentumTradingStrategy(indicators, inventory) {
    const { rsi, macd } = indicators;
    const currentPrice = this.exchangeService.historicalData.slice(-1)[0]?.buy;

    if (!currentPrice || !rsi || !macd) return null;

    const dollarRatio = inventory.usd / (inventory.usd + inventory.mxn / currentPrice);

    let action = 'HOLD';
    let confidence = 0;
    let reason = '';

    // RSI sobreventa y MACD positivo
    if (rsi < 30 && macd.histogram > 0 && dollarRatio < 0.6) {
      action = 'BUY_USD';
      confidence = 85;
      reason = `RSI en sobreventa (${rsi.toFixed(1)}). Momentum alcista. Comprar USD.`;
    }
    // RSI sobrecompra y MACD negativo
    else if (rsi > 70 && macd.histogram < 0 && dollarRatio > 0.4) {
      action = 'SELL_USD';
      confidence = 85;
      reason = `RSI en sobrecompra (${rsi.toFixed(1)}). Momentum bajista. Vender USD.`;
    }

    return confidence > 0 ? { action, confidence, reason, targetSpread: 0.3 } : null;
  }

  // Estrategia 4: Volatility Breakout
  volatilityBreakoutStrategy(indicators, inventory) {
    const { volatility, bollingerBands } = indicators;
    const currentPrice = this.exchangeService.historicalData.slice(-1)[0]?.buy;

    if (!currentPrice || !volatility || !bollingerBands) return null;

    const dollarRatio = inventory.usd / (inventory.usd + inventory.mxn / currentPrice);

    let action = 'HOLD';
    let confidence = 0;
    let reason = '';
    let targetSpread = 0.3;

    // Alta volatilidad: ampliar spread
    if (volatility > 0.15) {
      action = 'HOLD_WIDE_SPREAD';
      confidence = 70;
      reason = 'Alta volatilidad detectada. Ampliar spread para proteger márgenes.';
      targetSpread = 0.45;
    }
    // Baja volatilidad: buscar breakout
    else if (volatility < 0.05) {
      if (currentPrice > bollingerBands.upper && dollarRatio < 0.6) {
        action = 'BUY_USD';
        confidence = 75;
        reason = 'Breakout alcista en baja volatilidad. Comprar USD.';
        targetSpread = 0.25;
      } else if (currentPrice < bollingerBands.lower && dollarRatio > 0.4) {
        action = 'SELL_USD';
        confidence = 75;
        reason = 'Breakout bajista en baja volatilidad. Vender USD.';
        targetSpread = 0.25;
      }
    }

    return confidence > 0 ? { action, confidence, reason, targetSpread } : null;
  }

  // Estrategia 5: Balance de Inventario
  inventoryBalanceStrategy(indicators, inventory) {
    const currentPrice = this.exchangeService.historicalData.slice(-1)[0]?.buy;
    if (!currentPrice) return null;

    const dollarRatio = inventory.usd / (inventory.usd + inventory.mxn / currentPrice);
    const balanceScore = Math.abs(0.5 - dollarRatio) * 100;

    let action = 'HOLD';
    let confidence = 0;
    let reason = '';

    // Demasiados USD
    if (dollarRatio > 0.65) {
      action = 'SELL_USD';
      confidence = 60 + balanceScore;
      reason = `Inventario desbalanceado (${(dollarRatio * 100).toFixed(1)}% USD). Vender para balancear.`;
    }
    // Pocos USD
    else if (dollarRatio < 0.35) {
      action = 'BUY_USD';
      confidence = 60 + balanceScore;
      reason = `Inventario desbalanceado (${(dollarRatio * 100).toFixed(1)}% USD). Comprar para balancear.`;
    }

    return confidence > 0 ? { action, confidence, reason, targetSpread: 0.35 } : null;
  }
}

// ============================================================================
// SISTEMA DE ALERTAS
// ============================================================================

export class AlertSystem {
  constructor(thresholds = {}) {
    this.thresholds = {
      priceChange: thresholds.priceChange || 0.5, // 0.5% cambio
      volatility: thresholds.volatility || 0.2, // Alta volatilidad
      spread: thresholds.spread || 0.5, // Spread máximo
      inventoryImbalance: thresholds.inventoryImbalance || 0.7, // 70% en una moneda
      ...thresholds,
    };
    this.alerts = [];
  }

  checkAlerts(currentRate, indicators, inventory) {
    this.alerts = [];

    // Alerta de cambio brusco de precio
    const historicalData = indicators?.historicalData || [];
    if (historicalData.length > 0) {
      const previousRate = historicalData[historicalData.length - 1]?.buy;
      const change = Math.abs((currentRate.buy - previousRate) / previousRate) * 100;

      if (change > this.thresholds.priceChange) {
        this.alerts.push({
          type: 'PRICE_ALERT',
          severity: 'HIGH',
          message: `Cambio significativo de ${change.toFixed(2)}% en el tipo de cambio`,
          timestamp: Date.now(),
        });
      }
    }

    // Alerta de alta volatilidad
    if (indicators?.volatility > this.thresholds.volatility) {
      this.alerts.push({
        type: 'VOLATILITY_ALERT',
        severity: 'MEDIUM',
        message: `Alta volatilidad detectada: ${(indicators.volatility * 100).toFixed(2)}%`,
        timestamp: Date.now(),
      });
    }

    // Alerta de spread muy amplio
    const spread = currentRate.sell - currentRate.buy;
    if (spread > this.thresholds.spread) {
      this.alerts.push({
        type: 'SPREAD_ALERT',
        severity: 'LOW',
        message: `Spread inusualmente amplio: $${spread.toFixed(4)} MXN`,
        timestamp: Date.now(),
      });
    }

    // Alerta de inventario desbalanceado
    const dollarRatio = inventory.usd / (inventory.usd + inventory.mxn / currentRate.buy);
    if (
      dollarRatio > this.thresholds.inventoryImbalance ||
      dollarRatio < 1 - this.thresholds.inventoryImbalance
    ) {
      this.alerts.push({
        type: 'INVENTORY_ALERT',
        severity: 'HIGH',
        message: `Inventario crítico: ${(dollarRatio * 100).toFixed(1)}% en USD`,
        timestamp: Date.now(),
      });
    }

    return this.alerts;
  }

  getActiveAlerts() {
    return this.alerts;
  }
}

// ============================================================================
// EXPORTAR INSTANCIAS
// ============================================================================

export const createExchangeSystem = (config = {}) => {
  const exchangeService = new ExchangeRateService(config);
  const strategyEngine = new TradingStrategyEngine(exchangeService);
  const alertSystem = new AlertSystem(config.alertThresholds);

  return {
    exchangeService,
    strategyEngine,
    alertSystem,
  };
};

export default createExchangeSystem;
