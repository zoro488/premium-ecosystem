/**
 * 🚚 ANÁLISIS AVANZADO - PANEL FLETES
 * Motor de IA/ML para optimización de TC, costos de transporte y rutas
 * @module analysis/analisisFletes
 */
import {
  analizarPorProveedor,
  analizarPorRuta,
  calcularCostoPorKg,
  calcularCostoPorM3,
  optimizarTC,
} from '../types/fletes.types';

/**
 * Analiza optimización de tipo de cambio histórico
 * @param {Array<object>} fletes - Array de fletes
 * @param {string} moneda - Moneda a analizar (USD/EUR)
 * @returns {object} Análisis completo de TC
 */
export const analizarOptimizacionTC = (fletes = [], moneda = 'USD') => {
  const analisisTC = optimizarTC(fletes, moneda);

  // Calcular ahorro potencial por mes
  const fletesPorMes = {};
  for (const f of fletes.filter((f) => f.gastoMoneda === moneda)) {
    const mes = new Date(f.fecha).toISOString().slice(0, 7);
    if (!fletesPorMes[mes]) {
      fletesPorMes[mes] = { fletes: [], gastoReal: 0, gastoOptimo: 0 };
    }
    fletesPorMes[mes].fletes.push(f);
    fletesPorMes[mes].gastoReal += f.totalGastoPesos;
    fletesPorMes[mes].gastoOptimo += f.gastoValor * analisisTC.tcOptimo;
  }

  const ahorroPorMes = Object.entries(fletesPorMes).map(([mes, data]) => ({
    mes,
    gastoReal: data.gastoReal,
    gastoOptimo: data.gastoOptimo,
    ahorro: data.gastoReal - data.gastoOptimo,
    porcentajeAhorro:
      data.gastoReal > 0 ? ((data.gastoReal - data.gastoOptimo) / data.gastoReal) * 100 : 0,
  }));

  return {
    ...analisisTC,
    ahorroPorMes,
    ahorroPromedioMensual: ahorroPorMes.reduce((s, a) => s + a.ahorro, 0) / ahorroPorMes.length,
    mejorMesAhorro: ahorroPorMes.sort((a, b) => b.ahorro - a.ahorro)[0],
  };
};

/**
 * Analiza eficiencia de proveedores
 * @param {Array<object>} fletes - Array de fletes
 * @returns {object} Ranking de proveedores con métricas
 */
export const analizarEficienciaProveedores = (fletes = []) => {
  const proveedores = analizarPorProveedor(fletes);

  // Calcular score de eficiencia (0-100)
  for (const p of proveedores) {
    let score = 100;

    // Penalizar si gasto promedio es alto
    const gastoPromedioGeneral =
      proveedores.reduce((s, pr) => s + pr.gastoPromedio, 0) / proveedores.length;
    if (p.gastoPromedio > gastoPromedioGeneral * 1.2) {
      score -= 20;
    }

    // Bonificar si TC promedio es bajo
    const tcPromedioGeneral =
      proveedores.reduce((s, pr) => s + pr.tcPromedio, 0) / proveedores.length;
    if (p.tcPromedio < tcPromedioGeneral * 0.95) {
      score += 10;
    }

    // Penalizar si tiene pocos fletes (poca experiencia)
    if (p.totalFletes < 5) {
      score -= 15;
    } else if (p.totalFletes > 20) {
      score += 15;
    }

    p.scoreEficiencia = Math.max(0, Math.min(100, score));
    p.categoria =
      score >= 80 ? 'excelente' : score >= 60 ? 'bueno' : score >= 40 ? 'regular' : 'deficiente';
  }

  return proveedores.sort((a, b) => b.scoreEficiencia - a.scoreEficiencia);
};

/**
 * Analiza rutas más económicas
 * @param {Array<object>} fletes - Array de fletes
 * @returns {object} Análisis de rutas con recomendaciones
 */
export const analizarRutasEconomicas = (fletes = []) => {
  const rutas = analizarPorRuta(fletes);

  // Identificar rutas más caras y más baratas
  const rutaMasCara = rutas.sort((a, b) => b.gastoPromedio - a.gastoPromedio)[0];
  const rutaMasBarata = rutas.sort((a, b) => a.gastoPromedio - b.gastoPromedio)[0];

  // Calcular potencial de optimización
  const optimizaciones = [];
  for (const r of rutas) {
    if (r.totalFletes >= 3 && r.gastoPromedio > rutaMasBarata.gastoPromedio * 1.3) {
      const ahorroEstimado = (r.gastoPromedio - rutaMasBarata.gastoPromedio) * r.totalFletes;
      optimizaciones.push({
        ruta: r.ruta,
        gastoActual: r.gastoPromedio,
        gastoObjetivo: rutaMasBarata.gastoPromedio,
        ahorroEstimado,
        prioridad: ahorroEstimado > 10000 ? 'alta' : 'media',
      });
    }
  }

  return {
    rutas,
    rutaMasCara,
    rutaMasBarata,
    optimizaciones: optimizaciones.sort((a, b) => b.ahorroEstimado - a.ahorroEstimado),
    ahorroTotalPotencial: optimizaciones.reduce((s, o) => s + o.ahorroEstimado, 0),
  };
};

/**
 * Calcula métricas de costo por peso/volumen
 * @param {Array<object>} fletes - Array de fletes
 * @returns {object} Métricas de eficiencia logística
 */
export const calcularMetricasLogisticas = (fletes = []) => {
  const fletesConPeso = fletes.filter((f) => f.peso && f.peso > 0);
  const fletesConVolumen = fletes.filter((f) => f.volumen && f.volumen > 0);

  const costoPorKgPromedio =
    fletesConPeso.length > 0
      ? fletesConPeso.reduce((s, f) => s + calcularCostoPorKg(f), 0) / fletesConPeso.length
      : 0;

  const costoPorM3Promedio =
    fletesConVolumen.length > 0
      ? fletesConVolumen.reduce((s, f) => s + calcularCostoPorM3(f), 0) / fletesConVolumen.length
      : 0;

  return {
    costoPorKgPromedio,
    costoPorM3Promedio,
    fletesConPeso: fletesConPeso.length,
    fletesConVolumen: fletesConVolumen.length,
    coberturaPeso: (fletesConPeso.length / fletes.length) * 100,
    coberturaVolumen: (fletesConVolumen.length / fletes.length) * 100,
  };
};

/**
 * Genera recomendaciones de optimización de fletes
 * @param {Array<object>} fletes - Array de fletes
 * @returns {object} Recomendaciones priorizadas
 */
export const generarRecomendacionesFletes = (fletes = []) => {
  const analisisTC = analizarOptimizacionTC(fletes);
  const proveedores = analizarEficienciaProveedores(fletes);
  const rutas = analizarRutasEconomicas(fletes);

  const recomendaciones = [];

  // Recomendación TC
  if (analisisTC.ahorroPotencial > 5000) {
    recomendaciones.push({
      categoria: 'Optimización TC',
      accion: analisisTC.recomendacion,
      impacto: analisisTC.ahorroPotencial,
      prioridad: 'alta',
    });
  }

  // Recomendación proveedores
  const proveedorDeficiente = proveedores.find((p) => p.categoria === 'deficiente');
  if (proveedorDeficiente) {
    recomendaciones.push({
      categoria: 'Cambio de Proveedor',
      accion: `Evaluar reemplazo de ${proveedorDeficiente.proveedor}`,
      impacto: proveedorDeficiente.totalGasto * 0.15,
      prioridad: 'media',
    });
  }

  // Recomendación rutas
  if (rutas.optimizaciones.length > 0) {
    recomendaciones.push({
      categoria: 'Optimización de Rutas',
      accion: `Optimizar ${rutas.optimizaciones.length} rutas identificadas`,
      impacto: rutas.ahorroTotalPotencial,
      prioridad: 'alta',
    });
  }

  return {
    recomendaciones: recomendaciones.sort((a, b) => b.impacto - a.impacto),
    impactoTotal: recomendaciones.reduce((s, r) => s + r.impacto, 0),
  };
};

export default {
  analizarOptimizacionTC,
  analizarEficienciaProveedores,
  analizarRutasEconomicas,
  calcularMetricasLogisticas,
  generarRecomendacionesFletes,
};
