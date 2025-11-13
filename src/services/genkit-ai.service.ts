/**
 * 🤖 GENKIT AI SERVICE - Análisis Avanzados con Gemini
 * =====================================================
 * Servicio para integrar Gemini AI en análisis de negocio,
 * predicciones, sugerencias y dashboards inteligentes
 */
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

// Configurar Genkit con Google AI
const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash,
});

// ============================================================================
// TIPOS
// ============================================================================

interface AnalysisRequest {
  type: 'ventas' | 'bancos' | 'distribuidores' | 'clientes' | 'stock' | 'financiero';
  data: any;
  period?: 'dia' | 'semana' | 'mes' | 'trimestre' | 'año';
}

interface PredictionRequest {
  historicalData: any[];
  metric: string;
  horizon: number; // días hacia adelante
}

interface RecommendationRequest {
  context: 'compras' | 'ventas' | 'finanzas' | 'inventario';
  currentState: any;
}

// ============================================================================
// FLOWS DE ANÁLISIS
// ============================================================================

/**
 * Análisis de ventas con Gemini AI
 */
export const analyzeVentas = ai.defineFlow('analyzeVentas', async (request: AnalysisRequest) => {
  const prompt = `
Analiza los siguientes datos de ventas de FlowDistributor:

Datos: ${JSON.stringify(request.data, null, 2)}
Período: ${request.period || 'mes'}

Proporciona un análisis detallado incluyendo:
1. Tendencias principales
2. Productos más vendidos
3. Clientes frecuentes
4. Patrones de pago (completo/parcial/pendiente)
5. Recomendaciones para aumentar ventas
6. Alertas o áreas de atención

Responde en formato JSON con esta estructura:
{
  "resumen": "...",
  "tendencias": [...],
  "topProductos": [...],
  "topClientes": [...],
  "patronesPago": {...},
  "recomendaciones": [...],
  "alertas": [...]
}
`;

  const { text } = await ai.generate(prompt);
  return JSON.parse(text);
});

/**
 * Análisis de salud financiera de bancos
 */
export const analyzeBancos = ai.defineFlow('analyzeBancos', async (request: AnalysisRequest) => {
  const prompt = `
Analiza la salud financiera de los 7 bancos de FlowDistributor:

Datos: ${JSON.stringify(request.data, null, 2)}

Bancos:
- Bóveda Monte (ventas, capital principal)
- Utilidades (ganancias)
- Fletes (ingresos por envío)
- Azteca, Leftie, Profit (bancos operativos)
- Bóveda USA (operaciones USD)

Proporciona:
1. Estado de liquidez de cada banco
2. Bancos con más capital disponible
3. Bancos con mayor rotación
4. Recomendaciones de transferencias óptimas
5. Alertas de bajo capital
6. Proyección de flujo de caja

JSON:
{
  "estadoGeneral": "...",
  "bancosLiquidez": [...],
  "recomendacionesTransferencias": [...],
  "alertas": [...],
  "proyeccion": {...}
}
`;

  const { text } = await ai.generate(prompt);
  return JSON.parse(text);
});

/**
 * Predicción de ventas futuras
 */
export const predictVentas = ai.defineFlow('predictVentas', async (request: PredictionRequest) => {
  const prompt = `
Con base en estos datos históricos de ventas:

${JSON.stringify(request.historicalData, null, 2)}

Predice el comportamiento de "${request.metric}" para los próximos ${request.horizon} días.

Considera:
1. Tendencias estacionales
2. Patrones de demanda
3. Comportamiento histórico
4. Factores externos (fin de mes, quincena, etc.)

Responde en JSON:
{
  "prediccion": {
    "valores": [dia1, dia2, ..., diaN],
    "confianza": "alta|media|baja",
    "tendencia": "alcista|bajista|estable"
  },
  "factores": [...],
  "recomendaciones": [...]
}
`;

  const { text } = await ai.generate(prompt);
  return JSON.parse(text);
});

/**
 * Recomendaciones inteligentes
 */
export const getRecommendations = ai.defineFlow(
  'getRecommendations',
  async (request: RecommendationRequest) => {
    const prompt = `
Contexto: ${request.context}
Estado actual: ${JSON.stringify(request.currentState, null, 2)}

Proporciona recomendaciones inteligentes para optimizar las operaciones:

1. Acciones inmediatas
2. Oportunidades detectadas
3. Riesgos a mitigar
4. Optimizaciones sugeridas
5. Próximos pasos recomendados

JSON:
{
  "accionesInmediatas": [...],
  "oportunidades": [...],
  "riesgos": [...],
  "optimizaciones": [...],
  "proximosPasos": [...]
}
`;

    const { text } = await ai.generate(prompt);
    return JSON.parse(text);
  }
);

/**
 * Análisis de inventario y stock
 */
export const analyzeInventario = ai.defineFlow('analyzeInventario', async (data: any) => {
  const prompt = `
Analiza el inventario actual de FlowDistributor:

${JSON.stringify(data, null, 2)}

Proporciona:
1. Productos con bajo stock (< 10 unidades)
2. Productos de alta rotación
3. Productos de baja rotación
4. Recomendaciones de reorden
5. Predicción de necesidades de compra
6. Optimización de espacio

JSON:
{
  "bajoStock": [...],
  "altaRotacion": [...],
  "bajaRotacion": [...],
  "recomendacionesReorden": [...],
  "prediccionCompras": {...},
  "optimizacionEspacio": [...]
}
`;

  const { text } = await ai.generate(prompt);
  return JSON.parse(text);
});

/**
 * Análisis de clientes y adeudos
 */
export const analyzeClientes = ai.defineFlow('analyzeClientes', async (data: any) => {
  const prompt = `
Analiza los clientes y sus patrones de pago:

${JSON.stringify(data, null, 2)}

Proporciona:
1. Clientes con mayor adeudo
2. Clientes más frecuentes
3. Patrones de pago (buenos/regulares/morosos)
4. Riesgo crediticio
5. Recomendaciones de cobranza
6. Clientes VIP potenciales

JSON:
{
  "mayorAdeudo": [...],
  "masFrecuentes": [...],
  "patronesPago": {...},
  "riesgoCrediticio": [...],
  "recomendacionesCobranza": [...],
  "clientesVIP": [...]
}
`;

  const { text } = await ai.generate(prompt);
  return JSON.parse(text);
});

/**
 * Análisis de distribuidores
 */
export const analyzeDistribuidores = ai.defineFlow('analyzeDistribuidores', async (data: any) => {
  const prompt = `
Analiza los distribuidores y órdenes de compra:

${JSON.stringify(data, null, 2)}

Proporciona:
1. Distribuidores con mayor volumen
2. Distribuidores con mejor precio
3. Adeudos pendientes prioritarios
4. Recomendaciones de pago
5. Oportunidades de negociación
6. Evaluación de relaciones comerciales

JSON:
{
  "mayorVolumen": [...],
  "mejorPrecio": [...],
  "adeudosPrioritarios": [...],
  "recomendacionesPago": [...],
  "oportunidadesNegociacion": [...],
  "evaluacionRelaciones": [...]
}
`;

  const { text } = await ai.generate(prompt);
  return JSON.parse(text);
});

/**
 * Dashboard ejecutivo - Resumen inteligente
 */
export const getDashboardExecutivo = ai.defineFlow('getDashboardExecutivo', async (data: any) => {
  const prompt = `
Genera un resumen ejecutivo del estado de FlowDistributor:

${JSON.stringify(data, null, 2)}

Incluye:
1. Estado general del negocio (salud: 0-100)
2. Métricas clave (ventas, utilidad, stock, flujo caja)
3. Top 3 logros recientes
4. Top 3 áreas de atención
5. Proyección próximos 30 días
6. Recomendación ejecutiva principal

JSON:
{
  "saludNegocio": 0-100,
  "estado": "excelente|bueno|regular|crítico",
  "metricas": {...},
  "logros": [...],
  "areasAtencion": [...],
  "proyeccion30dias": {...},
  "recomendacionPrincipal": "..."
}
`;

  const { text } = await ai.generate(prompt);
  return JSON.parse(text);
});

// ============================================================================
// EXPORTAR SERVICIO
// ============================================================================

export const GenkitAIService = {
  analyzeVentas,
  analyzeBancos,
  predictVentas,
  getRecommendations,
  analyzeInventario,
  analyzeClientes,
  analyzeDistribuidores,
  getDashboardExecutivo,
};

export default GenkitAIService;
