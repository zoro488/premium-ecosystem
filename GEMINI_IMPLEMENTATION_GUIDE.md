# 🧠 Gemini AI - Guía de Implementación

## 📋 Configuración Completada

Tu ecosistema premium ahora tiene **Google Gemini AI** totalmente integrado y listo para usar.

### ✅ Archivos Creados

```
src/
├── lib/
│   └── gemini/
│       └── config.js          # Configuración central de Gemini
├── hooks/
│   └── useGemini.js           # Hook React para usar Gemini
├── services/
│   ├── geminiAI.js            # Servicio con métodos de alto nivel
│   └── analytics.js           # Tracking de uso de IA
└── components/
    └── ai/
        └── GeminiAssistant.jsx # Componentes UI para IA
```

### 🔑 API Key Configurada

```env
VITE_GEMINI_API_KEY=AIzaSyAh-W4sEjQaIsz52xQfy4ypi4gZ8S4S1xA
```

---

## 🚀 Cómo Usar Gemini en tu Aplicación

### 1️⃣ Uso Básico con Hook

```jsx
import { useGemini } from '@/hooks/useGemini';

function MyComponent() {
  const { generateContent, loading, response } = useGemini();

  const handleGenerate = async () => {
    const result = await generateContent('Explica qué es React');
    console.log(result);
  };

  return (
    <button onClick={handleGenerate} disabled={loading}>
      {loading ? 'Generando...' : 'Generar con IA'}
    </button>
  );
}
```

### 2️⃣ Uso con Componente UI Pre-construido

```jsx
import { GeminiAssistant } from '@/components/ai/GeminiAssistant';

function MyApp() {
  return (
    <div>
      <h1>Asistente IA</h1>
      <GeminiAssistant
        modelType="balanced"
        onResponse={(response) => console.log(response)}
      />
    </div>
  );
}
```

### 3️⃣ Chat Conversacional

```jsx
import { GeminiChat } from '@/components/ai/GeminiAssistant';

function ChatPage() {
  return (
    <div className="h-screen">
      <GeminiChat />
    </div>
  );
}
```

### 4️⃣ Uso Directo del Servicio

```jsx
import GeminiAIService from '@/services/geminiAI';

// Analizar texto
const analysis = await GeminiAIService.analyzeText('Este es un texto...');

// Generar descripción de producto
const description = await GeminiAIService.generateProductDescription({
  name: 'iPhone 15 Pro',
  features: ['A17 Pro', 'Titanio', '48MP'],
});

// Resumir conversación
const summary = await GeminiAIService.summarizeConversation(messages);

// Predecir tendencias
const prediction = await GeminiAIService.predictTrends(salesData);
```

---

## 🎯 Casos de Uso por Aplicación

### 📊 **SmartSales** - Ventas Inteligentes

```jsx
import GeminiAIService from '@/services/geminiAI';

// Generar descripciones de productos
const generateDescription = async (product) => {
  const result = await GeminiAIService.generateProductDescription(
    `${product.name} - ${product.features.join(', ')}`
  );
  return result.description;
};

// Análisis de feedback de clientes
const analyzeFeedback = async (reviews) => {
  const result = await GeminiAIService.analyzeSentiment(reviews.join('\n'));
  return result.sentiment;
};
```

### 👥 **ClientHub** - CRM

```jsx
// Resumen automático de conversaciones
const summarizeChat = async (messages) => {
  const result = await GeminiAIService.summarizeConversation(messages);
  return result.summary;
};

// Sugerencias de respuesta
const getResponseSuggestions = async (customerMessage) => {
  const result = await GeminiAIService.suggestResponses(
    customerMessage,
    'Cliente VIP interesado en producto X'
  );
  return result.suggestions;
};
```

### 📈 **AnalyticsPro** - Dashboard

```jsx
// Generar insights de datos
const getInsights = async (analyticsData) => {
  const result = await GeminiAIService.generateInsights(analyticsData);
  return result.insights;
};

// Predicciones de tendencias
const predictTrends = async (historicalData) => {
  const result = await GeminiAIService.predictTrends(historicalData, 'ventas');
  return result.prediction;
};
```

### 🔄 **FlowDistributor** - Workflows

```jsx
// Sugerir optimizaciones de workflow
const optimizeWorkflow = async (workflowData) => {
  const prompt = `Analiza este workflow y sugiere optimizaciones: ${JSON.stringify(workflowData)}`;
  const result = await gemini.generateContent(prompt);
  return result;
};
```

### 👥 **TeamSync** - Colaboración

```jsx
// Resumir reuniones
const summarizeMeeting = async (transcript) => {
  const result = await GeminiAIService.summarize(transcript, 200);
  return result.summary;
};

// Generar notas
const generateNotes = async (discussion) => {
  const prompt = `Genera notas estructuradas de esta discusión: ${discussion}`;
  const result = await gemini.generateContent(prompt);
  return result;
};
```

---

## 🎨 Modelos Disponibles

```javascript
import { useGemini } from '@/hooks/useGemini';

// Modelo creativo (marketing, ventas)
const { generateContent } = useGemini({ modelType: 'creative' });

// Modelo preciso (análisis, datos)
const { generateContent } = useGemini({ modelType: 'precise' });

// Modelo balanceado (uso general)
const { generateContent } = useGemini({ modelType: 'balanced' });

// Modelo para código
const { generateContent } = useGemini({ modelType: 'code' });

// Modelo para resúmenes
const { generateContent } = useGemini({ modelType: 'summary' });
```

---

## 📊 Analytics y Tracking

Todo el uso de Gemini se trackea automáticamente:

```javascript
// Automático en cada request
trackAIRequest('gemini', 'balanced', 1250, true);

// Trackear features específicas
trackAIFeature('SmartSales', 'product-description');

// Trackear costos
trackAICost('gemini', 8000, 0.0024);
```

---

## 🔥 Streaming de Respuestas

```jsx
import { useGemini } from '@/hooks/useGemini';

function StreamingComponent() {
  const { generateContent, streamingText, loading } = useGemini({
    stream: true
  });

  return (
    <div>
      {loading && <p>{streamingText}</p>}
    </div>
  );
}
```

---

## 🛡️ Manejo de Errores

```jsx
const { generateContent, error } = useGemini();

try {
  const result = await generateContent('prompt');
} catch (err) {
  // err contiene:
  // - success: false
  // - error: 'mensaje de error'
  // - code: 'ERROR_CODE'
  console.error(err.code, err.error);
}
```

---

## 🚦 Rate Limiting

El sistema tiene auto-retry integrado:

```javascript
// Configurado en src/lib/gemini/config.js
export const retryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  backoffMultiplier: 2,
};
```

---

## 📝 Ejemplos Completos

### Ejemplo 1: Análisis de Producto

```jsx
import { useState } from 'react';
import GeminiAIService from '@/services/geminiAI';

function ProductAnalyzer() {
  const [product, setProduct] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const analyze = async () => {
    const result = await GeminiAIService.analyzeText(
      product,
      'Análisis de producto para estrategia de ventas'
    );
    setAnalysis(result.analysis);
  };

  return (
    <div>
      <textarea
        value={product}
        onChange={(e) => setProduct(e.target.value)}
      />
      <button onClick={analyze}>Analizar</button>
      {analysis && <div>{analysis}</div>}
    </div>
  );
}
```

### Ejemplo 2: Asistente de Email

```jsx
import GeminiAIService from '@/services/geminiAI';

async function generateFollowUpEmail(clientName, lastInteraction) {
  const result = await GeminiAIService.generateEmail(
    'seguimiento',
    `Cliente: ${clientName}`,
    `Última interacción: ${lastInteraction}`
  );

  return result.email;
}
```

---

## 🔧 Configuración Avanzada

### Personalizar Modelo

```javascript
import { getGeminiModel } from '@/lib/gemini/config';

const customModel = getGeminiModel('gemini-pro', 'creative');
const result = await customModel.generateContent('prompt');
```

### Configuración de Seguridad

```javascript
// Ya configurado en src/lib/gemini/config.js
export const safetySettings = [
  {
    category: 'HARM_CATEGORY_HARASSMENT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  // ... más settings
];
```

---

## 🎯 Próximos Pasos

1. **Prueba el asistente**: Abre cualquier aplicación e importa `GeminiAssistant`
2. **Integra en SmartSales**: Agrega generación de descripciones
3. **Mejora ClientHub**: Implementa resúmenes automáticos
4. **Analytics**: Usa insights de IA en AnalyticsPro
5. **Experimenta**: Prueba diferentes modelos y prompts

---

## 📚 Recursos

- [Documentación oficial de Gemini](https://ai.google.dev/docs)
- [Mejores prácticas de prompts](https://ai.google.dev/docs/prompting_intro)
- [Límites y quotas](https://ai.google.dev/docs/rate_limits)

---

## 🆘 Soporte

Si tienes problemas:

1. Verifica que la API key esté en `.env`
2. Revisa la consola del navegador
3. Chequea Firebase Analytics para ver requests
4. Los errores se loggean automáticamente

---

**¡Gemini AI está listo para usar en todo tu ecosistema premium! 🚀**
