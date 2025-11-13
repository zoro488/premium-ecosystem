/**
 * 💰 ANÁLISIS AVANZADO - PROFIT
 * Motor de IA/ML para ingresos puros (SIN gastos)
 * ⚠️ ÚNICO: Solo Ingresos y Corte RF, no tracking de gastos
 * @module analysis/analisisProfit
 */
import {
  agruparPorCategoria,
  agruparPorPeriodo,
  analizarPurezaIngresos,
  calcularBalanceDetallado,
  calcularTendenciaCrecimiento,
  proyectarIngresosPuros,
} from '../types/profit.types';

/**
 * Analiza pureza y eficiencia de ingresos
 * @param {Array<object>} transacciones - Array de transacciones
 * @returns {object} Análisis de pureza
 */
export const analizarEficienciaPura = (transacciones = []) => {
  const balance = calcularBalanceDetallado(transacciones);
  const pureza = analizarPurezaIngresos(transacciones);
  const porCategoria = agruparPorCategoria(transacciones);
  const porMes = agruparPorPeriodo(transacciones, 'mes');

  return {
    balance,
    pureza,
    porCategoria,
    porMes,
    eficiencia: pureza.margenPuro,
    calidad: pureza.calificacion,
  };
};

/**
 * Analiza tendencias de crecimiento puro
 * @param {Array<object>} transacciones - Array de transacciones
 * @returns {object} Tendencias de crecimiento
 */
export const analizarTendenciasCrecimientoPuro = (transacciones = []) => {
  const tendencia = calcularTendenciaCrecimiento(transacciones);
  const porMes = agruparPorPeriodo(transacciones, 'mes');

  if (porMes.length < 3) {
    return {
      tendencia: 'insuficiente_data',
      velocidad: 0,
      confianza: 0,
    };
  }

  const balances = porMes.map((m) => m.balance);
  const velocidades = balances.slice(1).map((b, i) => ((b - balances[i]) / balances[i]) * 100);
  const velocidadPromedio = velocidades.reduce((s, v) => s + v, 0) / velocidades.length;

  let nivel = 'moderado';
  if (velocidadPromedio > 10) {
    nivel = 'acelerado';
  } else if (velocidadPromedio < 0) {
    nivel = 'decreciente';
  }

  return {
    tendencia: tendencia.tendencia,
    velocidad: velocidadPromedio,
    nivel,
    confianza: Math.min(porMes.length / 12, 1),
  };
};

/**
 * Optimiza Cortes RF para máxima pureza
 * @param {Array<object>} transacciones - Array de transacciones
 * @returns {object} Análisis de optimización
 */
export const optimizarCortesRF = (transacciones = []) => {
  const pureza = analizarPurezaIngresos(transacciones);
  const balance = calcularBalanceDetallado(transacciones);

  const totalIngresos = balance.totalIngresos;
  const totalCortesRF = balance.totalCortesRF;
  const ratioActual = totalIngresos > 0 ? (totalCortesRF / totalIngresos) * 100 : 0;

  // Rangos óptimos de Corte RF
  const rangos = [
    { min: 0, max: 10, calificacion: 'Excelente', accion: 'mantener' },
    { min: 10, max: 20, calificacion: 'Bueno', accion: 'monitorear' },
    { min: 20, max: 30, calificacion: 'Regular', accion: 'optimizar' },
    { min: 30, max: 100, calificacion: 'Bajo', accion: 'revisar_urgente' },
  ];

  const rangoActual =
    rangos.find((r) => ratioActual >= r.min && ratioActual < r.max) || rangos[rangos.length - 1];

  return {
    ratioActual,
    pureza: pureza.margenPuro,
    calificacion: rangoActual.calificacion,
    accionRecomendada: rangoActual.accion,
    oportunidadMejora: Math.max(0, ratioActual - 10),
  };
};

/**
 * Genera recomendaciones para maximizar pureza
 * @param {Array<object>} transacciones - Array de transacciones
 * @returns {object} Recomendaciones
 */
export const generarRecomendacionesProfit = (transacciones = []) => {
  const pureza = analizarPurezaIngresos(transacciones);
  const optimizacion = optimizarCortesRF(transacciones);
  const recomendaciones = [];

  if (pureza.margenPuro < 70) {
    recomendaciones.push({
      tipo: 'Pureza Baja',
      mensaje: `Pureza actual: ${pureza.margenPuro.toFixed(1)}%`,
      prioridad: 'alta',
      impacto: `Reducir Cortes RF en ${optimizacion.oportunidadMejora.toFixed(1)}%`,
    });
  }

  if (optimizacion.accionRecomendada === 'revisar_urgente') {
    recomendaciones.push({
      tipo: 'Cortes RF Excesivos',
      mensaje: `Cortes RF representan ${optimizacion.ratioActual.toFixed(1)}% de ingresos`,
      prioridad: 'critica',
      impacto: 'Revisar estructura de Cortes RF inmediatamente',
    });
  }

  if (pureza.calificacion === 'Excelente') {
    recomendaciones.push({
      tipo: 'Mantener Eficiencia',
      mensaje: 'Pureza de ingresos óptima',
      prioridad: 'baja',
      impacto: 'Continuar con estrategia actual',
    });
  }

  return {
    recomendaciones,
    pureza,
    optimizacion,
    prioridad: recomendaciones.length > 0 ? recomendaciones[0].prioridad : 'baja',
  };
};

/**
 * Proyecta ingresos puros futuros
 * @param {Array<object>} transacciones - Array de transacciones
 * @param {number} meses - Meses a proyectar
 * @returns {object} Proyección
 */
export const proyectarIngresosFuturos = (transacciones = [], meses = 3) => {
  const porMes = agruparPorPeriodo(transacciones, 'mes');
  return proyectarIngresosPuros(porMes, meses);
};

export default {
  analizarEficienciaPura,
  analizarTendenciasCrecimientoPuro,
  optimizarCortesRF,
  generarRecomendacionesProfit,
  proyectarIngresosFuturos,
};
