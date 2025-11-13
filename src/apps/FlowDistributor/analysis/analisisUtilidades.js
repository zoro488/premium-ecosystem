/**
 * 💰 ANÁLISIS AVANZADO - PANEL UTILIDADES
 * Motor de IA/ML para análisis de ingresos, gastos y balances
 * @module analysis/analisisUtilidades
 */
import {
  agruparPorPeriodo,
  calcularBalanceDetallado,
  calcularTendenciaCrecimiento,
  detectarTransaccionesAnomala,
} from '../types/utilidades.types';

// ============================================================================
// ANÁLISIS DE BALANCE Y TENDENCIAS
// ============================================================================

/**
 * Calcula estadísticas generales de utilidades
 * @param {Array<object>} transacciones - Array de transacciones
 * @returns {object} Estadísticas generales
 */
export const calcularEstadisticasGenerales = (transacciones = []) => {
  if (transacciones.length === 0) {
    return {
      total: 0,
      balance: null,
      tendencia: null,
      estado: 'sin_datos',
    };
  }

  const balance = calcularBalanceDetallado(transacciones);
  const porMes = agruparPorPeriodo(transacciones, 'mes');
  const tendencia = calcularTendenciaCrecimiento(porMes);

  return {
    total: transacciones.length,
    balance,
    tendencia,
    porMes,
    transaccionPromedio: {
      ingreso: balance.totalIngresos / transacciones.filter((t) => t.valor > 0).length || 0,
      gasto: Math.abs(balance.totalGastos) / transacciones.filter((t) => t.valor < 0).length || 0,
    },
    estado: balance.balanceNeto > 0 ? 'positivo' : 'negativo',
  };
};

/**
 * Analiza evolución de balance mes a mes
 * @param {Array<object>} transacciones - Array de transacciones
 * @returns {object} Evolución del balance con predicciones
 */
export const analizarEvolucionBalance = (transacciones = []) => {
  const porMes = agruparPorPeriodo(transacciones, 'mes');

  if (porMes.length < 2) {
    return {
      evolucion: porMes,
      tasaCrecimiento: 0,
      mesMejor: null,
      mesPeor: null,
      promedio: 0,
    };
  }

  // Calcular tasa de crecimiento promedio
  const tasas = [];
  for (let i = 1; i < porMes.length; i++) {
    const anterior = porMes[i - 1].balance.balanceNeto;
    const actual = porMes[i].balance.balanceNeto;
    if (anterior !== 0) {
      tasas.push(((actual - anterior) / Math.abs(anterior)) * 100);
    }
  }

  const tasaCrecimiento = tasas.length > 0 ? tasas.reduce((s, t) => s + t, 0) / tasas.length : 0;

  // Identificar mejor y peor mes
  const mesMejor = [...porMes].sort((a, b) => b.balance.balanceNeto - a.balance.balanceNeto)[0];
  const mesPeor = [...porMes].sort((a, b) => a.balance.balanceNeto - b.balance.balanceNeto)[0];

  // Promedio mensual
  const promedio = porMes.reduce((s, m) => s + m.balance.balanceNeto, 0) / porMes.length;

  return {
    evolucion: porMes,
    tasaCrecimiento,
    mesMejor,
    mesPeor,
    promedio,
    volatilidad: calcularVolatilidad(porMes.map((m) => m.balance.balanceNeto)),
  };
};

/**
 * Calcula volatilidad de una serie temporal
 * @param {Array<number>} valores - Array de valores numéricos
 * @returns {number} Desviación estándar (volatilidad)
 */
const calcularVolatilidad = (valores) => {
  if (valores.length < 2) return 0;
  const media = valores.reduce((s, v) => s + v, 0) / valores.length;
  const varianza = valores.reduce((s, v) => s + (v - media) ** 2, 0) / valores.length;
  return Math.sqrt(varianza);
};

// ============================================================================
// ANÁLISIS DE INGRESOS Y GASTOS
// ============================================================================

/**
 * Analiza estructura de ingresos
 * @param {Array<object>} transacciones - Array de transacciones
 * @returns {object} Análisis de ingresos por categoría
 */
export const analizarEstructuraIngresos = (transacciones = []) => {
  const ingresos = transacciones.filter((t) => t.tipo === 'Ingreso');

  if (ingresos.length === 0) {
    return {
      total: 0,
      porCategoria: [],
      concentracion: 0,
      diversificacion: 0,
    };
  }

  // Agrupar por categoría
  const porCategoria = {};
  for (const i of ingresos) {
    const cat = i.categoria || 'Sin Categoría';
    if (!porCategoria[cat]) {
      porCategoria[cat] = { categoria: cat, monto: 0, cantidad: 0 };
    }
    porCategoria[cat].monto += Math.abs(i.valor);
    porCategoria[cat].cantidad += 1;
  }

  const categorias = Object.values(porCategoria)
    .map((c) => ({
      ...c,
      promedio: c.monto / c.cantidad,
      participacion: 0,
    }))
    .sort((a, b) => b.monto - a.monto);

  // Calcular participación
  const totalMonto = categorias.reduce((s, c) => s + c.monto, 0);
  for (const cat of categorias) {
    cat.participacion = totalMonto > 0 ? (cat.monto / totalMonto) * 100 : 0;
  }

  // Índice de concentración (HHI - Herfindahl-Hirschman Index)
  const hhi = categorias.reduce((s, c) => s + (c.participacion / 100) ** 2, 0);

  return {
    total: totalMonto,
    porCategoria: categorias,
    concentracion: hhi * 100, // 0-100, mayor = más concentrado
    diversificacion: (1 - hhi) * 100, // 0-100, mayor = más diversificado
    categoriaTop: categorias[0],
  };
};

/**
 * Analiza estructura de gastos
 * @param {Array<object>} transacciones - Array de transacciones
 * @returns {object} Análisis de gastos por categoría
 */
export const analizarEstructuraGastos = (transacciones = []) => {
  const gastos = transacciones.filter((t) => t.tipo === 'Gasto');

  if (gastos.length === 0) {
    return {
      total: 0,
      porCategoria: [],
      concentracion: 0,
      gastoMasAlto: null,
    };
  }

  // Agrupar por categoría
  const porCategoria = {};
  for (const g of gastos) {
    const cat = g.categoria || 'Sin Categoría';
    if (!porCategoria[cat]) {
      porCategoria[cat] = { categoria: cat, monto: 0, cantidad: 0 };
    }
    porCategoria[cat].monto += Math.abs(g.valor);
    porCategoria[cat].cantidad += 1;
  }

  const categorias = Object.values(porCategoria)
    .map((c) => ({
      ...c,
      promedio: c.monto / c.cantidad,
      participacion: 0,
    }))
    .sort((a, b) => b.monto - a.monto);

  // Calcular participación
  const totalMonto = categorias.reduce((s, c) => s + c.monto, 0);
  for (const cat of categorias) {
    cat.participacion = totalMonto > 0 ? (cat.monto / totalMonto) * 100 : 0;
  }

  // Gasto más alto individual
  const gastoMasAlto = [...gastos].sort((a, b) => Math.abs(b.valor) - Math.abs(a.valor))[0];

  return {
    total: totalMonto,
    porCategoria: categorias,
    concentracion: categorias[0]?.participacion || 0,
    gastoMasAlto,
  };
};

// ============================================================================
// ANÁLISIS DE ANOMALÍAS Y RIESGOS
// ============================================================================

/**
 * Detecta y analiza anomalías en transacciones
 * @param {Array<object>} transacciones - Array de transacciones
 * @returns {object} Análisis de anomalías
 */
export const detectarAnomalias = (transacciones = []) => {
  const anomalasIngresos = detectarTransaccionesAnomala(
    transacciones.filter((t) => t.tipo === 'Ingreso')
  );
  const anomalasGastos = detectarTransaccionesAnomala(
    transacciones.filter((t) => t.tipo === 'Gasto')
  );

  return {
    totalAnomalias: anomalasIngresos.length + anomalasGastos.length,
    anomalasIngresos,
    anomalasGastos,
    nivelRiesgo: (() => {
      const total = anomalasIngresos.length + anomalasGastos.length;
      if (total === 0) return 'bajo';
      if (total <= 2) return 'medio';
      return 'alto';
    })(),
  };
};

/**
 * Analiza riesgo financiero basado en múltiples factores
 * @param {Array<object>} transacciones - Array de transacciones
 * @returns {object} Análisis de riesgo con score 0-100
 */
export const analizarRiesgoFinanciero = (transacciones = []) => {
  if (transacciones.length === 0) {
    return { score: 0, nivel: 'sin_datos', factores: [] };
  }

  const balance = calcularBalanceDetallado(transacciones);
  const porMes = agruparPorPeriodo(transacciones, 'mes');
  const factores = [];
  let scoreRiesgo = 0;

  // Factor 1: Balance negativo (30 puntos)
  if (balance.balanceNeto < 0) {
    scoreRiesgo += 30;
    factores.push({
      factor: 'Balance Negativo',
      impacto: 30,
      descripcion: `Balance: ${balance.balanceNeto.toFixed(2)}`,
    });
  }

  // Factor 2: Ratio de gastos alto (25 puntos)
  if (balance.ratioGastos > 80) {
    scoreRiesgo += 25;
    factores.push({
      factor: 'Gastos Altos',
      impacto: 25,
      descripcion: `Gastos representan ${balance.ratioGastos.toFixed(1)}% de ingresos`,
    });
  } else if (balance.ratioGastos > 60) {
    scoreRiesgo += 15;
    factores.push({
      factor: 'Gastos Elevados',
      impacto: 15,
      descripcion: `Gastos representan ${balance.ratioGastos.toFixed(1)}% de ingresos`,
    });
  }

  // Factor 3: Tendencia negativa (25 puntos)
  const tendencia = calcularTendenciaCrecimiento(porMes);
  if (tendencia.estado === 'decreciente' && tendencia.tendencia < -5) {
    scoreRiesgo += 25;
    factores.push({
      factor: 'Tendencia Negativa',
      impacto: 25,
      descripcion: `Decrecimiento de ${tendencia.tendencia.toFixed(1)}% mensual`,
    });
  } else if (tendencia.estado === 'decreciente') {
    scoreRiesgo += 10;
    factores.push({
      factor: 'Tendencia Estable-Negativa',
      impacto: 10,
      descripcion: `Decrecimiento leve de ${tendencia.tendencia.toFixed(1)}%`,
    });
  }

  // Factor 4: Alta volatilidad (20 puntos)
  const balancesPorMes = porMes.map((m) => m.balance.balanceNeto);
  const volatilidad = calcularVolatilidad(balancesPorMes);
  const media = balancesPorMes.reduce((s, b) => s + b, 0) / balancesPorMes.length;
  const cv = media === 0 ? 0 : (volatilidad / Math.abs(media)) * 100; // Coeficiente de variación

  if (cv > 50) {
    scoreRiesgo += 20;
    factores.push({
      factor: 'Alta Volatilidad',
      impacto: 20,
      descripcion: `Coeficiente de variación: ${cv.toFixed(1)}%`,
    });
  } else if (cv > 30) {
    scoreRiesgo += 10;
    factores.push({
      factor: 'Volatilidad Moderada',
      impacto: 10,
      descripcion: `Coeficiente de variación: ${cv.toFixed(1)}%`,
    });
  }

  // Nivel de riesgo
  let nivel = 'bajo';
  if (scoreRiesgo >= 70) {
    nivel = 'critico';
  } else if (scoreRiesgo >= 50) {
    nivel = 'alto';
  } else if (scoreRiesgo >= 30) {
    nivel = 'medio';
  }

  return {
    score: Math.min(scoreRiesgo, 100),
    nivel,
    factores,
    recomendaciones: generarRecomendacionesRiesgo(factores),
  };
};

/**
 * Genera recomendaciones basadas en factores de riesgo
 * @param {Array<object>} factores - Factores de riesgo detectados
 * @returns {Array<string>} Recomendaciones
 */
const generarRecomendacionesRiesgo = (factores) => {
  const recomendaciones = [];

  for (const f of factores) {
    switch (f.factor) {
      case 'Balance Negativo':
        recomendaciones.push(
          '🚨 Reducir gastos inmediatamente',
          '💰 Buscar nuevas fuentes de ingreso'
        );
        break;
      case 'Gastos Altos':
      case 'Gastos Elevados':
        recomendaciones.push('📊 Auditar gastos por categoría', '✂️ Eliminar gastos no esenciales');
        break;
      case 'Tendencia Negativa':
      case 'Tendencia Estable-Negativa':
        recomendaciones.push(
          '📈 Revisar estrategia de ingresos',
          '🔄 Implementar plan de crecimiento'
        );
        break;
      case 'Alta Volatilidad':
      case 'Volatilidad Moderada':
        recomendaciones.push('💼 Diversificar fuentes de ingreso', '🛡️ Crear fondo de emergencia');
        break;
    }
  }

  if (recomendaciones.length === 0) {
    recomendaciones.push(
      '✅ Continuar con la estrategia actual',
      '📊 Monitorear métricas mensualmente'
    );
  }

  return [...new Set(recomendaciones)]; // Eliminar duplicados
};

// ============================================================================
// PREDICCIONES Y OPTIMIZACIÓN
// ============================================================================

/**
 * Proyecta balance para próximos meses
 * @param {Array<object>} transacciones - Array de transacciones
 * @param {number} mesesProyectar - Meses a proyectar (default: 6)
 * @returns {object} Proyección de balance
 */
export const proyectarBalance = (transacciones = [], mesesProyectar = 6) => {
  const porMes = agruparPorPeriodo(transacciones, 'mes');

  if (porMes.length < 3) {
    return {
      proyecciones: [],
      confianza: 0,
      tendencia: 'insuficiente_data',
    };
  }

  const ultimosTres = porMes.slice(-3);
  const ingresoPromedio = ultimosTres.reduce((s, m) => s + m.balance.totalIngresos, 0) / 3;
  const gastoPromedio = ultimosTres.reduce((s, m) => s + Math.abs(m.balance.totalGastos), 0) / 3;
  const corteRFPromedio =
    ultimosTres.reduce((s, m) => s + Math.abs(m.balance.totalCortesRF), 0) / 3;

  const proyecciones = [];
  for (let i = 1; i <= mesesProyectar; i++) {
    const ingresos = ingresoPromedio * (1 + 0.02 * i); // Crecimiento 2%
    const gastos = gastoPromedio * (1 + 0.015 * i); // Crecimiento 1.5%
    const cortesRF = corteRFPromedio;

    proyecciones.push({
      mes: i,
      ingresos,
      gastos: -gastos,
      cortesRF: -cortesRF,
      balance: ingresos - gastos - cortesRF,
      margenNeto: ingresos > 0 ? ((ingresos - gastos - cortesRF) / ingresos) * 100 : 0,
    });
  }

  return {
    proyecciones,
    confianza: Math.min(porMes.length / 12, 1),
    tendencia: proyecciones.at(-1).balance > 0 ? 'positiva' : 'negativa',
    balanceProyectado: proyecciones.at(-1).balance,
  };
};

/**
 * Genera recomendaciones de optimización
 * @param {Array<object>} transacciones - Array de transacciones
 * @returns {object} Recomendaciones con impacto estimado
 */
export const generarRecomendacionesOptimizacion = (transacciones = []) => {
  const balance = calcularBalanceDetallado(transacciones);
  const estructuraGastos = analizarEstructuraGastos(transacciones);
  const riesgo = analizarRiesgoFinanciero(transacciones);

  const recomendaciones = [];

  // Optimización de gastos
  if (balance.ratioGastos > 60) {
    const ahorroPotencial = balance.totalIngresos * 0.1; // 10% de ingresos
    recomendaciones.push({
      categoria: 'Reducción de Gastos',
      accion: `Reducir gastos en ${estructuraGastos.categoriaTop?.categoria || 'categoría principal'}`,
      impactoEstimado: ahorroPotencial,
      prioridad: 'alta',
    });
  }

  // Incremento de ingresos
  if (balance.margenNeto < 20) {
    recomendaciones.push({
      categoria: 'Incremento de Ingresos',
      accion: 'Diversificar fuentes de ingreso',
      impactoEstimado: balance.totalIngresos * 0.15,
      prioridad: 'alta',
    });
  }

  // Optimización de Cortes RF
  if (Math.abs(balance.totalCortesRF) > balance.totalIngresos * 0.1) {
    recomendaciones.push({
      categoria: 'Optimización Cortes RF',
      accion: 'Negociar mejores términos en Cortes RF',
      impactoEstimado: Math.abs(balance.totalCortesRF) * 0.2,
      prioridad: 'media',
    });
  }

  return {
    recomendaciones,
    impactoTotal: recomendaciones.reduce((s, r) => s + r.impactoEstimado, 0),
    riesgoActual: riesgo.nivel,
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  calcularEstadisticasGenerales,
  analizarEvolucionBalance,
  analizarEstructuraIngresos,
  analizarEstructuraGastos,
  detectarAnomalias,
  analizarRiesgoFinanciero,
  proyectarBalance,
  generarRecomendacionesOptimizacion,
};
