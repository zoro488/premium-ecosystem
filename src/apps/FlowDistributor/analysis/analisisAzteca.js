/**
 * 🏦 ANÁLISIS AVANZADO - BANCO AZTECA
 * Motor de IA/ML para análisis de flujos bancarios y balance
 * @module analysis/analisisAzteca
 */
import {
  agruparPorCategoria,
  agruparPorPeriodo,
  calcularBalanceDetallado,
  proyectarFlujoEfectivo,
} from '../types/azteca.types';

/**
 * Analiza flujo de efectivo completo
 * @param {Array<object>} transacciones - Array de transacciones
 * @returns {object} Análisis de flujo de efectivo
 */
export const analizarFlujoCaja = (transacciones = []) => {
  const balance = calcularBalanceDetallado(transacciones);
  const porCategoria = agruparPorCategoria(transacciones);
  const porMes = agruparPorPeriodo(transacciones, 'mes');

  return {
    balance,
    porCategoria,
    porMes,
    salud: balance.balance > 0 ? 'positiva' : 'negativa',
    liquidez: balance.eficiencia,
  };
};

/**
 * Detecta anomalías en transacciones bancarias
 * @param {Array<object>} transacciones - Array de transacciones
 * @returns {object} Anomalías detectadas
 */
export const detectarAnomaliasBancarias = (transacciones = []) => {
  if (transacciones.length < 10) {
    return { anomalias: [], nivel: 'insuficiente_data' };
  }

  const valores = transacciones.map((t) => Math.abs(t.valor));
  const media = valores.reduce((s, v) => s + v, 0) / valores.length;
  const varianza = valores.reduce((s, v) => s + (v - media) ** 2, 0) / valores.length;
  const desviacion = Math.sqrt(varianza);

  const anomalias = transacciones
    .map((t) => {
      const valor = Math.abs(t.valor);
      const zScore = desviacion > 0 ? Math.abs((valor - media) / desviacion) : 0;
      return { ...t, zScore, esAnomala: zScore > 3 };
    })
    .filter((t) => t.esAnomala)
    .sort((a, b) => b.zScore - a.zScore);

  let nivel = 'bajo';
  if (anomalias.length > 5) {
    nivel = 'alto';
  } else if (anomalias.length > 0) {
    nivel = 'medio';
  }

  return {
    anomalias,
    nivel,
    totalAnomalias: anomalias.length,
  };
};

/**
 * Proyecta balance futuro
 * @param {Array<object>} transacciones - Array de transacciones
 * @param {number} meses - Meses a proyectar
 * @returns {object} Proyección de balance
 */
export const proyectarBalanceFuturo = (transacciones = [], meses = 3) => {
  const porMes = agruparPorPeriodo(transacciones, 'mes');
  return proyectarFlujoEfectivo(porMes, meses);
};

/**
 * Genera recomendaciones financieras
 * @param {Array<object>} transacciones - Array de transacciones
 * @returns {object} Recomendaciones
 */
export const generarRecomendacionesAzteca = (transacciones = []) => {
  const balance = calcularBalanceDetallado(transacciones);
  const recomendaciones = [];

  if (balance.ratioGastos > 70) {
    recomendaciones.push({
      tipo: 'Reducción de Gastos',
      mensaje: `Gastos representan ${balance.ratioGastos.toFixed(1)}% de ingresos`,
      prioridad: 'alta',
    });
  }

  if (balance.balance < 0) {
    recomendaciones.push({
      tipo: 'Balance Negativo',
      mensaje: 'Implementar plan de recuperación urgente',
      prioridad: 'critica',
    });
  }

  return { recomendaciones, balance };
};

export default {
  analizarFlujoCaja,
  detectarAnomaliasBancarias,
  proyectarBalanceFuturo,
  generarRecomendacionesAzteca,
};
