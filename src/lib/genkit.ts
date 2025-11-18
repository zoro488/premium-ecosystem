/**
 * Genkit AI Configuration - Gemini Integration
 * @module lib/genkit
 */

import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

/**
 * Configure Genkit instance with Google AI
 */
export const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash, // Default model
});

/**
 * Análisis de ventas con IA
 */
export const analyzeSalesFlow = ai.defineFlow(
  'analyzeSales',
  async (data: {
    ventas: any[];
    periodo: string;
  }) => {
    const prompt = `
Analiza las siguientes ventas del periodo ${data.periodo}:

${JSON.stringify(data.ventas, null, 2)}

Proporciona:
1. Tendencias principales
2. Productos más vendidos
3. Análisis de rentabilidad
4. Recomendaciones estratégicas
5. Predicciones para el próximo periodo

Responde en formato JSON estructurado.
    `;

    const { text } = await ai.generate(prompt);
    return JSON.parse(text);
  }
);

/**
 * Optimización de inventario con IA
 */
export const optimizeInventoryFlow = ai.defineFlow(
  'optimizeInventory',
  async (data: {
    stock: any[];
    ventas: any[];
    ordenes: any[];
  }) => {
    const prompt = `
Analiza el inventario y proporciona recomendaciones:

Stock actual: ${JSON.stringify(data.stock)}
Ventas recientes: ${JSON.stringify(data.ventas)}
Órdenes de compra: ${JSON.stringify(data.ordenes)}

Proporciona:
1. Productos con stock crítico
2. Sugerencias de reorden
3. Productos de baja rotación
4. Optimización de capital invertido

Responde en formato JSON.
    `;

    const { text } = await ai.generate(prompt);
    return JSON.parse(text);
  }
);

/**
 * Análisis de distribuidores con IA
 */
export const analyzeDistributorsFlow = ai.defineFlow(
  'analyzeDistributors',
  async (data: {
    distribuidores: any[];
    ordenes: any[];
  }) => {
    const prompt = `
Analiza el desempeño de distribuidores:

Distribuidores: ${JSON.stringify(data.distribuidores)}
Órdenes de compra: ${JSON.stringify(data.ordenes)}

Proporciona:
1. Mejores distribuidores por confiabilidad
2. Análisis de adeudos pendientes
3. Recomendaciones de pago
4. Alertas de riesgo

Responde en formato JSON.
    `;

    const { text } = await ai.generate(prompt);
    return JSON.parse(text);
  }
);

/**
 * Predicción de flujo de caja
 */
export const predictCashFlowFlow = ai.defineFlow(
  'predictCashFlow',
  async (data: {
    bancos: any[];
    ventas: any[];
    gastos: any[];
    periodo: string;
  }) => {
    const prompt = `
Predice el flujo de caja para el periodo ${data.periodo}:

Bancos actuales: ${JSON.stringify(data.bancos)}
Ventas: ${JSON.stringify(data.ventas)}
Gastos: ${JSON.stringify(data.gastos)}

Proporciona:
1. Proyección de ingresos
2. Proyección de gastos
3. Balance esperado por banco
4. Recomendaciones de optimización
5. Alertas de liquidez

Responde en formato JSON.
    `;

    const { text } = await ai.generate(prompt);
    return JSON.parse(text);
  }
);

/**
 * Análisis de clientes y deudas
 */
export const analyzeClientsFlow = ai.defineFlow(
  'analyzeClients',
  async (data: {
    clientes: any[];
    ventas: any[];
  }) => {
    const prompt = `
Analiza el comportamiento de clientes:

Clientes: ${JSON.stringify(data.clientes)}
Ventas: ${JSON.stringify(data.ventas)}

Proporciona:
1. Clientes más rentables
2. Análisis de adeudos
3. Comportamiento de pago
4. Estrategias de cobranza
5. Recomendaciones de crédito

Responde en formato JSON.
    `;

    const { text } = await ai.generate(prompt);
    return JSON.parse(text);
  }
);

/**
 * Generar recomendaciones estratégicas
 */
export const generateStrategicRecommendationsFlow = ai.defineFlow(
  'strategicRecommendations',
  async (data: {
    dashboard: any;
  }) => {
    const prompt = `
Basado en los siguientes datos del sistema FlowDistributor:

${JSON.stringify(data.dashboard, null, 2)}

Genera recomendaciones estratégicas para:
1. Optimización de capital
2. Gestión de inventario
3. Estrategia de ventas
4. Control de gastos
5. Gestión de crédito y cobranza

Prioriza las recomendaciones por impacto potencial.
Responde en formato JSON.
    `;

    const { text } = await ai.generate(prompt);
    return JSON.parse(text);
  }
);

// Export all flows
export const genkitFlows = {
  analyzeSales: analyzeSalesFlow,
  optimizeInventory: optimizeInventoryFlow,
  analyzeDistributors: analyzeDistributorsFlow,
  predictCashFlow: predictCashFlowFlow,
  analyzeClients: analyzeClientsFlow,
  generateStrategicRecommendations: generateStrategicRecommendationsFlow,
};
