/**
 * 🏦 ANÁLISIS AVANZADO - BANCO LEFTIE
 * Motor de IA/ML con lógica INVERTIDA de Corte RF
 * ⚠️ CRÍTICO: Corte RF SUMA al balance en lugar de restar
 * @module analysis/analisisLeftie
 */
import {
  agruparPorCategoria,
  agruparPorPeriodo,
  analizarImpactoCorteRF,
  calcularBalanceDetallado,
  proyectarFlujoEfectivo,
} from '../types/leftie.types';

/**
 * Analiza flujo de efectivo con lógica INVERTIDA
 * @param {Array<object>} transacciones - Array de transacciones
 * @returns {object} Análisis de flujo de efectivo
 */
export const analizarFlujoEfectivoLeftie = (transacciones = []) => {
  const balance = calcularBalanceDetallado(transacciones);
  const impactoRF = analizarImpactoCorteRF(transacciones);
  const porCategoria = agruparPorCategoria(transacciones);
  const porMes = agruparPorPeriodo(transacciones, 'mes');

  return {
    balance,
    impactoRF,
    porCategoria,
    porMes,
    salud: balance.balance > 0 ? 'positiva' : 'negativa',
    contribucionRF: impactoRF.impactoRelativo,
  };
};

/**
 * Analiza tendencias de balance INVERTIDO
 * @param {Array<object>} transacciones - Array de transacciones
 * @returns {object} Tendencias detectadas
 */
export const analizarTendenciasInvertidas = (transacciones = []) => {
  const porMes = agruparPorPeriodo(transacciones, 'mes');

  if (porMes.length < 3) {
    return {
      tendencia: 'insuficiente_data',
      variacion: 0,
      confianza: 0,
    };
  }

  const balances = porMes.map((m) => m.balance);
  const variaciones = balances.slice(1).map((b, i) => b - balances[i]);
  const promedioVariacion = variaciones.reduce((s, v) => s + v, 0) / variaciones.length;

  let tendencia = 'estable';
  if (Math.abs(promedioVariacion) > 1000) {
    tendencia = promedioVariacion > 0 ? 'creciente' : 'decreciente';
  }

  return {
    tendencia,
    variacion: promedioVariacion,
    confianza: Math.min(porMes.length / 12, 1),
    balances,
  };
};

/**
 * Compara con otros bancos (detección de INVERSIÓN)
 * @param {Array<object>} transaccionesLeftie - Transacciones Leftie
 * @param {Array<object>} transaccionesOtroBanco - Transacciones otro banco
 * @returns {object} Comparación
 */
export const compararConOtrosBancos = (transaccionesLeftie = [], transaccionesOtroBanco = []) => {
  const balanceLeftie = calcularBalanceDetallado(transaccionesLeftie);
  const impactoRF = analizarImpactoCorteRF(transaccionesLeftie);

  // Para banco normal: Balance = Ingresos - Gastos - Corte_RF
  const ingresosOtro = transaccionesOtroBanco
    .filter((t) => t.tipo === 'Ingreso')
    .reduce((s, t) => s + t.valor, 0);
  const gastosOtro = transaccionesOtroBanco
    .filter((t) => t.tipo === 'Gasto')
    .reduce((s, t) => s + Math.abs(t.valor), 0);
  const corteRFOtro = transaccionesOtroBanco
    .filter((t) => t.tipo === 'Corte_RF')
    .reduce((s, t) => s + Math.abs(t.valor), 0);

  const balanceOtro = ingresosOtro - gastosOtro - corteRFOtro;

  return {
    leftie: {
      balance: balanceLeftie.balance,
      formula: 'Ingresos - Gastos + Corte_RF',
      contribucionRF: impactoRF.impactoAbsoluto,
    },
    otroBanco: {
      balance: balanceOtro,
      formula: 'Ingresos - Gastos - Corte_RF',
      contribucionRF: -corteRFOtro,
    },
    diferencia: balanceLeftie.balance - balanceOtro,
    ventajaLeftie: impactoRF.mejoraPorcentual,
  };
};

/**
 * Genera recomendaciones específicas para lógica INVERTIDA
 * @param {Array<object>} transacciones - Array de transacciones
 * @returns {object} Recomendaciones
 */
export const generarRecomendacionesLeftie = (transacciones = []) => {
  const balance = calcularBalanceDetallado(transacciones);
  const impactoRF = analizarImpactoCorteRF(transacciones);
  const recomendaciones = [];

  if (impactoRF.impactoRelativo < 10) {
    recomendaciones.push({
      tipo: 'Optimizar Corte RF',
      mensaje: `Corte RF solo representa ${impactoRF.impactoRelativo.toFixed(1)}% del balance`,
      prioridad: 'media',
      impacto: 'Incrementar Cortes RF para mejorar balance',
    });
  }

  if (balance.balance < 0) {
    recomendaciones.push({
      tipo: 'Balance Negativo',
      mensaje: 'A pesar de la ventaja de RF, el balance es negativo',
      prioridad: 'critica',
      impacto: 'Revisar estructura de gastos urgentemente',
    });
  }

  if (balance.ratioGastos > 80) {
    recomendaciones.push({
      tipo: 'Gastos Elevados',
      mensaje: `Gastos representan ${balance.ratioGastos.toFixed(1)}% de ingresos`,
      prioridad: 'alta',
      impacto: 'Reducir gastos para aprovechar ventaja de RF',
    });
  }

  return {
    recomendaciones,
    balance,
    impactoRF,
    prioridad: recomendaciones.length > 0 ? recomendaciones[0].prioridad : 'baja',
  };
};

/**
 * Proyecta flujo futuro con ventaja INVERTIDA
 * @param {Array<object>} transacciones - Array de transacciones
 * @param {number} meses - Meses a proyectar
 * @returns {object} Proyección
 */
export const proyectarVentajaInvertida = (transacciones = [], meses = 3) => {
  const porMes = agruparPorPeriodo(transacciones, 'mes');
  return proyectarFlujoEfectivo(porMes, meses);
};

export default {
  analizarFlujoEfectivoLeftie,
  analizarTendenciasInvertidas,
  compararConOtrosBancos,
  generarRecomendacionesLeftie,
  proyectarVentajaInvertida,
};
