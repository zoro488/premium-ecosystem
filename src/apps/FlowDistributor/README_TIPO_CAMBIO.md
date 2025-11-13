# 💱 Sistema de Tipo de Cambio USD/MXN - FlowDistributor

## 🚀 Sistema Inteligente para Casa de Cambio

Un widget avanzado con IA integrada para gestionar operaciones de tipo de cambio, análisis de mercado en tiempo real, y estrategias automatizadas de trading para maximizar la rentabilidad.

---

## ✨ Características Principales

### 📊 Cotización en Tiempo Real
- ✅ Integración con múltiples APIs de tipo de cambio
- ✅ Actualización automática cada 30 segundos
- ✅ Visualización de compra, venta y spread
- ✅ Indicador de tendencia alcista/bajista
- ✅ Cache inteligente para optimizar requests

### 🤖 Análisis con IA
- ✅ 5 estrategias de trading automatizadas
- ✅ Análisis técnico avanzado (RSI, MACD, Bollinger Bands)
- ✅ Recomendaciones con nivel de confianza
- ✅ Predicción de movimientos del mercado
- ✅ Alertas inteligentes de oportunidades

### 📈 Indicadores Técnicos
- ✅ Media Móvil Simple (SMA 20, 50, 200)
- ✅ Media Móvil Exponencial (EMA 12, 26)
- ✅ RSI (Relative Strength Index)
- ✅ MACD (Moving Average Convergence Divergence)
- ✅ Bandas de Bollinger
- ✅ Cálculo de volatilidad

### 💼 Gestión de Inventario
- ✅ Visualización de inventario USD/MXN
- ✅ Balance óptimo 40-60%
- ✅ Alertas de desbalance crítico
- ✅ Recomendaciones de rebalanceo
- ✅ Proyección de rentabilidad

### 💰 Proyecciones de Ganancia
- ✅ Cálculo de ganancia diaria/mensual/anual
- ✅ Basado en spread actual y volumen
- ✅ Múltiples escenarios (conservador, moderado, agresivo)
- ✅ ROI proyectado

### ⚠️ Sistema de Alertas
- ✅ Cambios bruscos de precio (>0.5%)
- ✅ Alta volatilidad (>20%)
- ✅ Spread inusual (>$0.50)
- ✅ Inventario desbalanceado (>70% en una moneda)

---

## 📦 Instalación

### 1. Copiar Archivos

```bash
# Copiar componente principal
components/widgets/CurrencyExchangeWidget.jsx

# Copiar servicio de tipo de cambio
services/exchangeRateService.js

# Copiar ejemplo de integración
components/ExchangeDashboard.jsx
```

### 2. Instalar Dependencias

```bash
npm install framer-motion lucide-react
```

### 3. Configurar API

Elige una de las siguientes opciones:

#### Opción A: ExchangeRate-API (Recomendado para empezar)
```javascript
// No requiere configuración
// Gratis: 1,500 requests/mes
const system = createExchangeSystem({
  apiProvider: 'exchangeRateAPI',
});
```

#### Opción B: Banco de México (Recomendado para producción en México)
```javascript
// 1. Solicita token en: https://www.banxico.org.mx/SieAPIRest/service/v1/
// 2. Configura en services/exchangeRateService.js:
API_CONFIGS.banxico.token = 'TU_TOKEN_AQUI';

const system = createExchangeSystem({
  apiProvider: 'banxico',
});
```

#### Opción C: Open Exchange Rates (Para datos en tiempo real)
```javascript
// 1. Registrate en: https://openexchangerates.org/signup
// 2. Obtén tu App ID
// 3. Configura en services/exchangeRateService.js:
API_CONFIGS.openExchangeRates.appId = 'TU_APP_ID';

const system = createExchangeSystem({
  apiProvider: 'openExchangeRates',
});
```

---

## 🎯 Uso Rápido

### Ejemplo Básico

```jsx
import { CurrencyExchangeWidget } from '@/components/widgets/CurrencyExchangeWidget';

function MiComponente() {
  const inventory = {
    usd: 50000,  // $50,000 USD
    mxn: 800000, // $800,000 MXN
  };

  return (
    <CurrencyExchangeWidget
      inventory={inventory}
      autoRefresh={true}
      refreshInterval={30000} // 30 segundos
      onRateUpdate={(rate) => {
        console.log('Nueva tasa:', rate);
      }}
    />
  );
}
```

### Ejemplo Avanzado con Dashboard Completo

```jsx
import { ExchangeDashboard } from '@/components/ExchangeDashboard';

function FlowDistributor() {
  return (
    <div className="dashboard">
      <ExchangeDashboard />
    </div>
  );
}
```

### Uso de Hooks Personalizados

```jsx
import { useExchangeRate, useStrategy } from '@/components/ExchangeDashboard';

function MiComponente() {
  // Obtener tasa en tiempo real
  const { rate, loading, error } = useExchangeRate({
    apiProvider: 'exchangeRateAPI',
    refreshInterval: 30000,
  });

  // Analizar estrategia
  const inventory = { usd: 50000, mxn: 800000 };
  const strategy = useStrategy(rate, inventory);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <p>Compra: ${rate.buy}</p>
      <p>Venta: ${rate.sell}</p>
      {strategy && (
        <div>
          <p>Acción: {strategy.action}</p>
          <p>Confianza: {strategy.confidence}%</p>
        </div>
      )}
    </div>
  );
}
```

---

## 🧠 Estrategias de Trading Incluidas

### 1. Reversión a la Media
- **Cuándo:** Precio se desvía significativamente de la media
- **Estrategia:** Comprar cuando está bajo, vender cuando está alto
- **Confianza:** 75-95% según desviación

### 2. Seguimiento de Tendencia
- **Cuándo:** Golden Cross o Death Cross detectado
- **Estrategia:** Seguir la tendencia dominante
- **Confianza:** 80%

### 3. Momentum Trading
- **Cuándo:** RSI en sobreventa/sobrecompra + MACD confirmatorio
- **Estrategia:** Aprovechar momentum del mercado
- **Confianza:** 85%

### 4. Volatility Breakout
- **Cuándo:** Volatilidad alta o breakout de Bollinger Bands
- **Estrategia:** Ajustar spread, aprovechar movimientos fuertes
- **Confianza:** 70-75%

### 5. Balance de Inventario
- **Cuándo:** Inventario desbalanceado (>65% o <35%)
- **Estrategia:** Rebalancear para mantener 40-60%
- **Confianza:** 60-90% según desbalance

---

## 📊 APIs de Tipo de Cambio Soportadas

| API | Gratis | Límite | Tiempo Real | Recomendado Para |
|-----|--------|--------|-------------|------------------|
| **ExchangeRate-API** | ✅ | 1,500/mes | ❌ | Desarrollo y pruebas |
| **Banco de México** | ✅ | Ilimitado | ❌ | Producción en México |
| **Open Exchange Rates** | ✅/💰 | 1,000/mes | ✅ (pagado) | Producción internacional |
| **Fixer.io** | ✅/💰 | 100/mes | ✅ (pagado) | Alternativa |
| **CurrencyAPI** | ✅ | 300/mes | ❌ | Alternativa |

### Configuración de APIs

```javascript
// En services/exchangeRateService.js

const API_CONFIGS = {
  exchangeRateAPI: {
    baseUrl: 'https://api.exchangerate-api.com/v4/latest',
    free: true,
    rateLimit: 1500,
  },

  banxico: {
    baseUrl: 'https://www.banxico.org.mx/SieAPIRest/service/v1/series',
    token: 'TU_TOKEN', // Solicitar en Banxico
    seriesId: 'SF43718',
    free: true,
  },

  openExchangeRates: {
    baseUrl: 'https://openexchangerates.org/api',
    appId: 'TU_APP_ID', // Registrarse
    free: true,
    rateLimit: 1000,
  },
};
```

---

## 💡 Ejemplos de Uso

### Calcular Ganancia de una Operación

```javascript
import { calculateProfit } from '@/components/ExchangeDashboard';

const ganancia = calculateProfit(
  1000,  // $1,000 USD
  17.25, // Tasa de compra
  17.55  // Tasa de venta
);

console.log(`Ganancia: $${ganancia} MXN`); // $300 MXN
```

### Calcular Spread Óptimo

```javascript
import { calculateOptimalSpread } from '@/components/ExchangeDashboard';

const spread = calculateOptimalSpread(
  0.12,              // 12% volatilidad
  0.55,              // 55% inventario en USD
  new Date()         // Hora actual
);

console.log(`Spread óptimo: $${spread} MXN`);
```

### Verificar si es Buen Momento para Operar

```javascript
import { shouldOperateNow } from '@/components/ExchangeDashboard';

const indicators = {
  volatility: 0.15,
  rsi: 65,
  macd: { histogram: 0.05 }
};

const { should, reason } = shouldOperateNow(indicators);
console.log(should ? '✅' : '❌', reason);
```

---

## 🎨 Personalización

### Cambiar Colores

```jsx
// Editar en CurrencyExchangeWidget.jsx
<div className="bg-gradient-to-br from-blue-500/20 to-green-500/20">
  {/* Cambia blue-500 y green-500 por tus colores */}
</div>
```

### Ajustar Intervalos de Actualización

```jsx
<CurrencyExchangeWidget
  refreshInterval={60000} // 1 minuto en lugar de 30 segundos
/>
```

### Personalizar Umbrales de Alertas

```javascript
const system = createExchangeSystem({
  alertThresholds: {
    priceChange: 0.3,        // 0.3% en lugar de 0.5%
    volatility: 0.25,         // 25% en lugar de 20%
    spread: 0.60,             // $0.60 en lugar de $0.50
    inventoryImbalance: 0.75, // 75% en lugar de 70%
  }
});
```

---

## 📈 Proyecciones de Rentabilidad

### Escenario Conservador
```
Volumen diario: $10,000 USD
Spread promedio: $0.30 MXN
Días operativos: 22/mes

Ganancia mensual: $66,000 MXN
Ganancia anual: $792,000 MXN
ROI: 40-60%
```

### Escenario Moderado
```
Volumen diario: $20,000 USD
Spread promedio: $0.35 MXN
Trading estratégico: +$1,500/día

Ganancia mensual: $187,000 MXN
Ganancia anual: $2,244,000 MXN
ROI: 80-120%
```

### Escenario Agresivo
```
Volumen diario: $50,000 USD
Spread dinámico: $0.38 promedio
Trading + Arbitraje: +$4,000/día

Ganancia mensual: $506,000 MXN
Ganancia anual: $6,072,000 MXN
ROI: 150-200%
```

---

## 🛡️ Mejores Prácticas

### Seguridad
- ✅ Usar variables de entorno para API keys
- ✅ No exponer tokens en el frontend
- ✅ Implementar autenticación para operaciones
- ✅ Logs de todas las transacciones
- ✅ Backups automáticos

### Performance
- ✅ Cache de 30-60 segundos
- ✅ No hacer requests excesivos
- ✅ Lazy loading de componentes pesados
- ✅ Optimizar re-renders con React.memo

### Legal y Compliance
- ✅ Registro ante autoridades financieras
- ✅ Cumplir con ley anti-lavado de dinero
- ✅ KYC (Know Your Customer)
- ✅ Reportar operaciones >$500 USD
- ✅ Documentar origen de fondos

---

## 🐛 Troubleshooting

### Problema: "Error fetching rates"
**Solución:**
1. Verifica tu conexión a internet
2. Confirma que la API key es correcta
3. Revisa límites de requests de tu plan
4. Usa modo simulación como fallback

### Problema: Widget no se actualiza
**Solución:**
1. Verifica que `autoRefresh={true}`
2. Revisa que `refreshInterval` esté configurado
3. Checa la consola por errores
4. Limpia cache del navegador

### Problema: Estrategias no se muestran
**Solución:**
1. Espera al menos 10 actualizaciones (historial mínimo)
2. Verifica que `inventory` esté configurado
3. Revisa que los indicadores técnicos se calculen correctamente

---

## 📚 Recursos Adicionales

### Documentación
- 📄 [ESTRATEGIA_RENTABILIDAD_CASA_CAMBIO.md](./ESTRATEGIA_RENTABILIDAD_CASA_CAMBIO.md) - Guía completa de estrategias
- 🔧 [exchangeRateService.js](./services/exchangeRateService.js) - Documentación del servicio
- 💡 [ExchangeDashboard.jsx](./components/ExchangeDashboard.jsx) - Ejemplos de integración

### APIs Oficiales
- 🏦 [Banco de México](https://www.banxico.org.mx/SieAPIRest/service/v1/)
- 💱 [ExchangeRate-API](https://www.exchangerate-api.com/)
- 📊 [Open Exchange Rates](https://openexchangerates.org/)
- 🌍 [Fixer.io](https://fixer.io/)

### Aprendizaje
- 📚 [BabyPips - Educación Forex](https://www.babypips.com/)
- 📈 [Investing.com - Análisis Técnico](https://www.investing.com/)
- 🎓 [TradingView - Comunidad](https://www.tradingview.com/)

---

## 🤝 Contribuir

¿Tienes ideas para mejorar el sistema? ¡Contribuye!

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agrega nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la licencia MIT.

---

## 💬 Soporte

¿Necesitas ayuda? Contacta al equipo de desarrollo de FlowDistributor.

---

## 🎯 Roadmap

### Versión Actual (1.0)
- ✅ Widget de tipo de cambio en tiempo real
- ✅ 5 estrategias de trading
- ✅ Análisis técnico avanzado
- ✅ Sistema de alertas
- ✅ Proyecciones de rentabilidad

### Próximas Versiones
- 🔄 v1.1: Integración con más APIs (Bloomberg, Refinitiv)
- 🔄 v1.2: Machine Learning para predicciones
- 🔄 v1.3: Multi-moneda (EUR, CAD, GBP)
- 🔄 v1.4: Modo automático de trading
- 🔄 v1.5: Dashboard móvil nativo

---

**¡Gracias por usar el Sistema de Tipo de Cambio de FlowDistributor! 💱🚀**

*Desarrollado con ❤️ para maximizar tu rentabilidad en operaciones de cambio de divisas.*
