/**
 * 💰 MOTOR DE ANÁLISIS AVANZADO PARA GASTOS Y ABONOS (GYA)
 * IA financiera, detección de fraude, análisis de flujos de efectivo y optimización fiscal
 */
import { calcularEstadisticasDescriptivas, calcularRegresionLineal } from './analisisVentas.js';

// ============================================================================
// ANÁLISIS DE FLUJOS FINANCIEROS
// ============================================================================

/**
 * Analiza flujos de efectivo detallados
 * @param {Array} transacciones - Array de transacciones GYA
 * @param {number} diasPeriodo - Días del período (default 30)
 * @returns {Object} Análisis de flujos
 */
export function analizarFlujosEfectivo(transacciones, diasPeriodo = 30) {
  const fechaInicio = new Date();
  fechaInicio.setDate(fechaInicio.getDate() - diasPeriodo);

  const transaccionesPeriodo = transacciones.filter((t) => new Date(t.fecha) >= fechaInicio);

  // Separar por tipo
  const abonos = transaccionesPeriodo.filter((t) => t.tipo === 'Abono');
  const gastos = transaccionesPeriodo.filter((t) => t.tipo === 'Gasto');

  const totalAbonos = abonos.reduce((sum, t) => sum + Math.abs(t.pesos), 0);
  const totalGastos = gastos.reduce((sum, t) => sum + Math.abs(t.pesos), 0);
  const flujoNeto = totalAbonos - totalGastos;

  // Métricas de liquidez
  const ratioLiquidez = totalGastos > 0 ? totalAbonos / totalGastos : 0;
  const tasaAhorro = totalAbonos > 0 ? (flujoNeto / totalAbonos) * 100 : 0;

  // Flujo diario promedio
  const flujoDiarioAbonos = totalAbonos / diasPeriodo;
  const flujoDiarioGastos = totalGastos / diasPeriodo;

  // Proyección mensual
  const proyeccionMensualAbonos = flujoDiarioAbonos * 30;
  const proyeccionMensualGastos = flujoDiarioGastos * 30;
  const proyeccionFlujoNeto = proyeccionMensualAbonos - proyeccionMensualGastos;

  // Nivel de salud financiera
  let saludFinanciera = 'critica';
  if (flujoNeto > 0 && ratioLiquidez >= 1.5) saludFinanciera = 'excelente';
  else if (flujoNeto > 0 && ratioLiquidez >= 1.2) saludFinanciera = 'buena';
  else if (flujoNeto >= 0) saludFinanciera = 'moderada';
  else if (flujoNeto >= -50000) saludFinanciera = 'riesgo';

  return {
    totalAbonos: Number.parseFloat(totalAbonos.toFixed(2)),
    totalGastos: Number.parseFloat(totalGastos.toFixed(2)),
    flujoNeto: Number.parseFloat(flujoNeto.toFixed(2)),
    ratioLiquidez: Number.parseFloat(ratioLiquidez.toFixed(4)),
    tasaAhorro: Number.parseFloat(tasaAhorro.toFixed(2)),
    flujoDiarioAbonos: Number.parseFloat(flujoDiarioAbonos.toFixed(2)),
    flujoDiarioGastos: Number.parseFloat(flujoDiarioGastos.toFixed(2)),
    proyeccionMensualAbonos: Number.parseFloat(proyeccionMensualAbonos.toFixed(2)),
    proyeccionMensualGastos: Number.parseFloat(proyeccionMensualGastos.toFixed(2)),
    proyeccionFlujoNeto: Number.parseFloat(proyeccionFlujoNeto.toFixed(2)),
    saludFinanciera,
    transaccionesTotales: transaccionesPeriodo.length,
    cantidadAbonos: abonos.length,
    cantidadGastos: gastos.length,
  };
}

/**
 * Analiza distribución de gastos por categoría
 * @param {Array} transacciones - Array de transacciones GYA
 * @returns {Array} Distribución de gastos
 */
export function analizarDistribucionGastos(transacciones) {
  const gastos = transacciones.filter((t) => t.tipo === 'Gasto');

  // Agrupar por origen
  const porOrigen = {};
  for (const gasto of gastos) {
    if (!porOrigen[gasto.origen]) {
      porOrigen[gasto.origen] = {
        origen: gasto.origen,
        cantidad: 0,
        total: 0,
        promedio: 0,
        destinosPrincipales: {},
      };
    }
    porOrigen[gasto.origen].cantidad += 1;
    porOrigen[gasto.origen].total += Math.abs(gasto.pesos);

    // Registrar destinos
    if (!porOrigen[gasto.origen].destinosPrincipales[gasto.destino]) {
      porOrigen[gasto.origen].destinosPrincipales[gasto.destino] = 0;
    }
    porOrigen[gasto.origen].destinosPrincipales[gasto.destino] += Math.abs(gasto.pesos);
  }

  // Calcular promedios y porcentajes
  const totalGastos = gastos.reduce((sum, g) => sum + Math.abs(g.pesos), 0);

  const resultado = Object.values(porOrigen).map((categoria) => {
    const promedio = categoria.total / categoria.cantidad;
    const porcentaje = (categoria.total / totalGastos) * 100;

    // Encontrar top 3 destinos
    const destinosOrdenados = Object.entries(categoria.destinosPrincipales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([destino, monto]) => ({
        destino,
        monto: Number.parseFloat(monto.toFixed(2)),
      }));

    return {
      origen: categoria.origen,
      cantidad: categoria.cantidad,
      total: Number.parseFloat(categoria.total.toFixed(2)),
      promedio: Number.parseFloat(promedio.toFixed(2)),
      porcentaje: Number.parseFloat(porcentaje.toFixed(2)),
      destinosPrincipales: destinosOrdenados,
    };
  });

  return resultado.sort((a, b) => b.total - a.total);
}

/**
 * Analiza cuentas y balances
 * @param {Array} transacciones - Array de transacciones GYA
 * @returns {Array} Balances por cuenta
 */
export function analizarCuentasBalances(transacciones) {
  // Obtener todas las cuentas (orígenes y destinos)
  const cuentas = new Set();
  for (const t of transacciones) {
    cuentas.add(t.origen);
    cuentas.add(t.destino);
  }

  const balances = Array.from(cuentas).map((cuenta) => {
    // Calcular ingresos (cuando la cuenta es destino)
    const ingresos = transacciones
      .filter((t) => t.destino === cuenta)
      .reduce((sum, t) => sum + Math.abs(t.pesos), 0);

    // Calcular egresos (cuando la cuenta es origen)
    const egresos = transacciones
      .filter((t) => t.origen === cuenta)
      .reduce((sum, t) => sum + Math.abs(t.pesos), 0);

    const balanceNeto = ingresos - egresos;
    const movimientos = transacciones.filter(
      (t) => t.origen === cuenta || t.destino === cuenta
    ).length;

    // Última transacción
    const transaccionesCuenta = transacciones
      .filter((t) => t.origen === cuenta || t.destino === cuenta)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    const ultimaTransaccion = transaccionesCuenta[0]?.fecha || null;

    // Nivel de actividad
    let actividad = 'baja';
    if (movimientos >= 50) actividad = 'muy_alta';
    else if (movimientos >= 20) actividad = 'alta';
    else if (movimientos >= 10) actividad = 'media';

    // Estado de cuenta
    let estado = 'equilibrada';
    if (balanceNeto > 50000) estado = 'superavitaria';
    else if (balanceNeto > 0) estado = 'positiva';
    else if (balanceNeto < -50000) estado = 'deficitaria';
    else if (balanceNeto < 0) estado = 'negativa';

    return {
      cuenta,
      ingresos: Number.parseFloat(ingresos.toFixed(2)),
      egresos: Number.parseFloat(egresos.toFixed(2)),
      balanceNeto: Number.parseFloat(balanceNeto.toFixed(2)),
      movimientos,
      ultimaTransaccion,
      actividad,
      estado,
    };
  });

  return balances.sort((a, b) => Math.abs(b.balanceNeto) - Math.abs(a.balanceNeto));
}

// ============================================================================
// DETECCIÓN DE ANOMALÍAS Y FRAUDE
// ============================================================================

/**
 * Detecta anomalías y posible fraude en transacciones
 * @param {Array} transacciones - Array de transacciones GYA
 * @returns {Object} Anomalías detectadas
 */
export function detectarAnomaliasFraude(transacciones) {
  const anomalias = {
    outliersMontos: [],
    transaccionesSospechosas: [],
    patronesInusuales: [],
    recomendaciones: [],
  };

  // 1. Detectar outliers en montos
  const montos = transacciones.map((t) => Math.abs(t.pesos));
  const stats = calcularEstadisticasDescriptivas(montos);

  if (stats) {
    const umbralSuperior = stats.q3 + 3 * stats.iqr;
    const outliersDetectados = transacciones.filter((t) => Math.abs(t.pesos) > umbralSuperior);

    for (const outlier of outliersDetectados) {
      anomalias.outliersMontos.push({
        id: outlier.id,
        fecha: outlier.fecha,
        monto: outlier.pesos,
        origen: outlier.origen,
        destino: outlier.destino,
        desviosStd: ((Math.abs(outlier.pesos) - stats.mean) / stats.std).toFixed(2),
        severidad: Math.abs(outlier.pesos) > umbralSuperior * 2 ? 'alta' : 'media',
      });
    }
  }

  // 2. Transacciones sin concepto o con datos incompletos
  const sinConcepto = transacciones.filter(
    (t) => !t.concepto || t.concepto.trim() === '' || t.concepto === 'Desconocido'
  );

  for (const t of sinConcepto) {
    anomalias.transaccionesSospechosas.push({
      id: t.id,
      fecha: t.fecha,
      monto: t.pesos,
      razon: 'Sin concepto o concepto desconocido',
      severidad: Math.abs(t.pesos) > 10000 ? 'alta' : 'baja',
    });
  }

  // 3. Transacciones de fin de semana o fuera de horario (posible fraude)
  const fueraHorario = transacciones.filter((t) => {
    const fecha = new Date(t.fecha);
    const dia = fecha.getDay(); // 0 = Domingo, 6 = Sábado
    const hora = fecha.getHours();
    return dia === 0 || dia === 6 || hora < 6 || hora > 22;
  });

  for (const t of fueraHorario) {
    if (Math.abs(t.pesos) > 50000) {
      // Solo reportar transacciones grandes
      anomalias.patronesInusuales.push({
        id: t.id,
        fecha: t.fecha,
        monto: t.pesos,
        patron: 'Transacción fuera de horario laboral',
        severidad: 'media',
      });
    }
  }

  // 4. Transacciones duplicadas (mismo monto, origen, destino en <24h)
  const duplicadas = [];
  for (let i = 0; i < transacciones.length; i++) {
    for (let j = i + 1; j < transacciones.length; j++) {
      const t1 = transacciones[i];
      const t2 = transacciones[j];

      const fecha1 = new Date(t1.fecha);
      const fecha2 = new Date(t2.fecha);
      const diferenciaHoras = Math.abs(fecha2 - fecha1) / (1000 * 60 * 60);

      if (
        Math.abs(t1.pesos - t2.pesos) < 0.01 &&
        t1.origen === t2.origen &&
        t1.destino === t2.destino &&
        diferenciaHoras < 24
      ) {
        duplicadas.push({
          id1: t1.id,
          id2: t2.id,
          monto: t1.pesos,
          fecha1: t1.fecha,
          fecha2: t2.fecha,
          origen: t1.origen,
          destino: t1.destino,
          severidad: 'alta',
        });
      }
    }
  }

  if (duplicadas.length > 0) {
    anomalias.patronesInusuales.push({
      tipo: 'Transacciones duplicadas',
      cantidad: duplicadas.length,
      detalles: duplicadas.slice(0, 10), // Primeras 10
      severidad: 'alta',
    });
  }

  // 5. Generar recomendaciones
  if (anomalias.outliersMontos.length > 0) {
    anomalias.recomendaciones.push({
      tipo: 'revision',
      prioridad: 'alta',
      mensaje: `${anomalias.outliersMontos.length} transacciones con montos atípicos detectadas`,
      accion: 'Revisar y validar transacciones con montos superiores a 3σ',
    });
  }

  if (sinConcepto.length > transacciones.length * 0.1) {
    anomalias.recomendaciones.push({
      tipo: 'calidad_datos',
      prioridad: 'media',
      mensaje: `${sinConcepto.length} transacciones sin concepto (${((sinConcepto.length / transacciones.length) * 100).toFixed(1)}%)`,
      accion: 'Implementar validación obligatoria de concepto en registro de transacciones',
    });
  }

  if (duplicadas.length > 0) {
    anomalias.recomendaciones.push({
      tipo: 'fraude',
      prioridad: 'urgente',
      mensaje: `${duplicadas.length} posibles transacciones duplicadas detectadas`,
      accion: 'Investigar inmediatamente posible fraude o error de sistema',
    });
  }

  return anomalias;
}

/**
 * Calcula score de riesgo de una transacción
 * @param {Object} transaccion - Transacción a evaluar
 * @param {Array} todasTransacciones - Todas las transacciones para contexto
 * @returns {Object} Score de riesgo
 */
export function calcularScoreRiesgo(transaccion, todasTransacciones) {
  let score = 0;
  const factores = [];

  // Factor 1: Monto atípico (0-30 puntos)
  const montos = todasTransacciones.map((t) => Math.abs(t.pesos));
  const stats = calcularEstadisticasDescriptivas(montos);

  if (stats) {
    const zScore = (Math.abs(transaccion.pesos) - stats.mean) / stats.std;
    if (zScore > 3) {
      score += 30;
      factores.push({ factor: 'Monto muy atípico', puntos: 30, detalle: `${zScore.toFixed(2)}σ` });
    } else if (zScore > 2) {
      score += 20;
      factores.push({ factor: 'Monto atípico', puntos: 20, detalle: `${zScore.toFixed(2)}σ` });
    } else if (zScore > 1.5) {
      score += 10;
      factores.push({ factor: 'Monto elevado', puntos: 10, detalle: `${zScore.toFixed(2)}σ` });
    }
  }

  // Factor 2: Sin concepto (0-25 puntos)
  if (
    !transaccion.concepto ||
    transaccion.concepto.trim() === '' ||
    transaccion.concepto === 'Desconocido'
  ) {
    score += 25;
    factores.push({ factor: 'Sin concepto', puntos: 25 });
  }

  // Factor 3: Origen/Destino desconocido (0-20 puntos)
  if (transaccion.origen === 'Desconocido' || transaccion.destino === 'Desconocido') {
    score += 20;
    factores.push({ factor: 'Origen o destino desconocido', puntos: 20 });
  }

  // Factor 4: Fuera de horario (0-15 puntos)
  const fecha = new Date(transaccion.fecha);
  const dia = fecha.getDay();
  const hora = fecha.getHours();
  if (dia === 0 || dia === 6 || hora < 6 || hora > 22) {
    score += 15;
    factores.push({ factor: 'Fuera de horario laboral', puntos: 15 });
  }

  // Factor 5: Tipo de cambio inusual (0-10 puntos)
  if (transaccion.tipoCambio > 0) {
    const tcPromedio = todasTransacciones
      .filter((t) => t.tipoCambio > 0)
      .reduce((sum, t, _, arr) => sum + t.tipoCambio / arr.length, 0);

    const variacionTC = Math.abs((transaccion.tipoCambio - tcPromedio) / tcPromedio) * 100;
    if (variacionTC > 10) {
      score += 10;
      factores.push({
        factor: 'Tipo de cambio inusual',
        puntos: 10,
        detalle: `${variacionTC.toFixed(1)}% variación`,
      });
    }
  }

  // Clasificación de riesgo
  let nivel = 'bajo';
  let color = 'verde';
  if (score >= 70) {
    nivel = 'critico';
    color = 'rojo';
  } else if (score >= 50) {
    nivel = 'alto';
    color = 'naranja';
  } else if (score >= 30) {
    nivel = 'medio';
    color = 'amarillo';
  }

  return {
    score,
    nivel,
    color,
    factores,
    requiereRevision: score >= 50,
  };
}

// ============================================================================
// OPTIMIZACIÓN FISCAL Y TRIBUTARIA
// ============================================================================

/**
 * Analiza oportunidades de optimización fiscal
 * @param {Array} transacciones - Array de transacciones GYA
 * @param {number} añoFiscal - Año fiscal a analizar
 * @returns {Object} Análisis fiscal
 */
export function analizarOptimizacionFiscal(transacciones, añoFiscal = new Date().getFullYear()) {
  const transaccionesAño = transacciones.filter((t) => {
    const año = new Date(t.fecha).getFullYear();
    return año === añoFiscal;
  });

  const gastos = transaccionesAño.filter((t) => t.tipo === 'Gasto');
  const ingresos = transaccionesAño.filter((t) => t.tipo === 'Abono');

  const totalGastos = gastos.reduce((sum, t) => sum + Math.abs(t.pesos), 0);
  const totalIngresos = ingresos.reduce((sum, t) => sum + Math.abs(t.pesos), 0);

  // Gastos deducibles estimados (categorías específicas)
  const categoriasDeducibles = [
    'Gasto Bóveda Monte',
    'Gasto Bóveda Plata',
    'Gasto Fletes',
    'Gasto Operativo',
  ];

  const gastosDeducibles = gastos
    .filter((g) => categoriasDeducibles.some((cat) => g.origen.includes(cat)))
    .reduce((sum, g) => sum + Math.abs(g.pesos), 0);

  const gastosNoDeducibles = totalGastos - gastosDeducibles;

  // Proyección de impuestos
  const utilidadBruta = totalIngresos - totalGastos;
  const tasaISR = 0.3; // 30% ISR (estimado)
  const tasaIVA = 0.16; // 16% IVA

  const isrEstimado = utilidadBruta > 0 ? utilidadBruta * tasaISR : 0;
  const ivaACargo = totalIngresos * tasaIVA;
  const ivaAFavor = totalGastos * tasaIVA;
  const ivaNeto = ivaACargo - ivaAFavor;

  // Oportunidades de optimización
  const oportunidades = [];

  if (gastosNoDeducibles > gastosDeducibles * 0.3) {
    oportunidades.push({
      tipo: 'deducibilidad',
      prioridad: 'alta',
      titulo: 'Alto porcentaje de gastos no deducibles',
      descripcion: `${((gastosNoDeducibles / totalGastos) * 100).toFixed(1)}% de gastos no son deducibles`,
      ahorroPotencial: gastosNoDeducibles * tasaISR,
      accion: 'Revisar categorización de gastos y documentación soporte',
    });
  }

  if (ivaNeto > totalIngresos * 0.05) {
    oportunidades.push({
      tipo: 'iva',
      prioridad: 'media',
      titulo: 'IVA a cargo elevado',
      descripcion: `IVA neto representa ${((ivaNeto / totalIngresos) * 100).toFixed(1)}% de ingresos`,
      ahorroPotencial: ivaNeto * 0.1, // 10% optimización estimada
      accion: 'Revisar facturas y acreditamiento de IVA',
    });
  }

  // Distribución temporal de gastos deducibles
  const gastosDeduciblesPorMes = {};
  for (const gasto of gastos.filter((g) =>
    categoriasDeducibles.some((cat) => g.origen.includes(cat))
  )) {
    const mes = gasto.fecha.slice(0, 7);
    if (!gastosDeduciblesPorMes[mes]) gastosDeduciblesPorMes[mes] = 0;
    gastosDeduciblesPorMes[mes] += Math.abs(gasto.pesos);
  }

  return {
    añoFiscal,
    totalIngresos: Number.parseFloat(totalIngresos.toFixed(2)),
    totalGastos: Number.parseFloat(totalGastos.toFixed(2)),
    gastosDeducibles: Number.parseFloat(gastosDeducibles.toFixed(2)),
    gastosNoDeducibles: Number.parseFloat(gastosNoDeducibles.toFixed(2)),
    utilidadBruta: Number.parseFloat(utilidadBruta.toFixed(2)),
    isrEstimado: Number.parseFloat(isrEstimado.toFixed(2)),
    ivaACargo: Number.parseFloat(ivaACargo.toFixed(2)),
    ivaAFavor: Number.parseFloat(ivaAFavor.toFixed(2)),
    ivaNeto: Number.parseFloat(ivaNeto.toFixed(2)),
    oportunidades,
    gastosDeduciblesPorMes: Object.entries(gastosDeduciblesPorMes)
      .map(([mes, monto]) => ({ mes, monto: Number.parseFloat(monto.toFixed(2)) }))
      .sort((a, b) => (a?.mes || '').localeCompare(b?.mes || '')),
  };
}

// ============================================================================
// PREDICCIÓN Y FORECASTING FINANCIERO
// ============================================================================

/**
 * Predice flujos financieros futuros
 * @param {Array} transacciones - Array de transacciones GYA
 * @param {number} mesesAdelante - Meses a predecir (default 3)
 * @returns {Object} Predicción financiera
 */
export function predecirFlujosFinancieros(transacciones, mesesAdelante = 3) {
  // Agrupar por mes
  const transaccionesPorMes = {};
  for (const t of transacciones) {
    const mes = t.fecha.slice(0, 7);
    if (!transaccionesPorMes[mes]) {
      transaccionesPorMes[mes] = { abonos: 0, gastos: 0 };
    }
    if (t.tipo === 'Abono') {
      transaccionesPorMes[mes].abonos += Math.abs(t.pesos);
    } else {
      transaccionesPorMes[mes].gastos += Math.abs(t.pesos);
    }
  }

  const meses = Object.keys(transaccionesPorMes).sort();
  if (meses.length < 3) {
    return {
      predicciones: [],
      confianza: 0,
      mensaje: 'Datos insuficientes (mínimo 3 meses)',
    };
  }

  // Convertir a puntos para regresión
  const puntosAbonos = meses.map((mes, i) => ({
    x: i,
    y: transaccionesPorMes[mes].abonos,
  }));
  const puntosGastos = meses.map((mes, i) => ({
    x: i,
    y: transaccionesPorMes[mes].gastos,
  }));

  const regresionAbonos = calcularRegresionLineal(puntosAbonos);
  const regresionGastos = calcularRegresionLineal(puntosGastos);

  // Predecir meses futuros
  const predicciones = [];
  for (let i = 1; i <= mesesAdelante; i++) {
    const x = meses.length + i - 1;
    const abonosPredichos = Math.max(0, regresionAbonos.slope * x + regresionAbonos.intercept);
    const gastosPredichos = Math.max(0, regresionGastos.slope * x + regresionGastos.intercept);
    const flujoNeto = abonosPredichos - gastosPredichos;

    predicciones.push({
      mes: i,
      abonosPredichos: Number.parseFloat(abonosPredichos.toFixed(2)),
      gastosPredichos: Number.parseFloat(gastosPredichos.toFixed(2)),
      flujoNetoPredicho: Number.parseFloat(flujoNeto.toFixed(2)),
    });
  }

  // Determinar tendencias
  let tendenciaAbonos = 'estable';
  if (regresionAbonos.slope > 1000) tendenciaAbonos = 'creciente';
  else if (regresionAbonos.slope < -1000) tendenciaAbonos = 'decreciente';

  let tendenciaGastos = 'estable';
  if (regresionGastos.slope > 1000) tendenciaGastos = 'creciente';
  else if (regresionGastos.slope < -1000) tendenciaGastos = 'decreciente';

  return {
    predicciones,
    tendenciaAbonos,
    tendenciaGastos,
    confianzaAbonos: Number.parseFloat((regresionAbonos.r2 * 100).toFixed(2)),
    confianzaGastos: Number.parseFloat((regresionGastos.r2 * 100).toFixed(2)),
    alertas: predicciones.some((p) => p.flujoNetoPredicho < 0)
      ? ['Flujo neto negativo proyectado en períodos futuros']
      : [],
  };
}

/**
 * Prepara datos para visualizaciones avanzadas
 * @param {Array} transacciones - Array de transacciones GYA
 * @returns {Object} Datos preparados
 */
export function prepararDatosVisualizacion(transacciones) {
  // Sankey diagram data (flujos origen → destino)
  const flujos = {};
  for (const t of transacciones) {
    const clave = `${t.origen}→${t.destino}`;
    if (!flujos[clave]) {
      flujos[clave] = {
        source: t.origen,
        target: t.destino,
        value: 0,
        count: 0,
      };
    }
    flujos[clave].value += Math.abs(t.pesos);
    flujos[clave].count += 1;
  }

  const sankeyData = Object.values(flujos)
    .sort((a, b) => b.value - a.value)
    .slice(0, 20); // Top 20 flujos

  // Heatmap temporal (día de semana × hora)
  const heatmapData = Array.from({ length: 7 }, () => new Array(24).fill(0));
  for (const t of transacciones) {
    const fecha = new Date(t.fecha);
    const dia = fecha.getDay();
    const hora = fecha.getHours();
    heatmapData[dia][hora] += Math.abs(t.pesos);
  }

  // Serie temporal mensual
  const serieTemporal = {};
  for (const t of transacciones) {
    const mes = t.fecha.slice(0, 7);
    if (!serieTemporal[mes]) {
      serieTemporal[mes] = { mes, abonos: 0, gastos: 0, flujoNeto: 0 };
    }
    if (t.tipo === 'Abono') {
      serieTemporal[mes].abonos += Math.abs(t.pesos);
    } else {
      serieTemporal[mes].gastos += Math.abs(t.pesos);
    }
  }

  const serieTemporalArray = Object.values(serieTemporal)
    .map((mes) => ({
      ...mes,
      flujoNeto: mes.abonos - mes.gastos,
    }))
    .sort((a, b) => (a?.mes || '').localeCompare(b?.mes || ''));

  return {
    sankeyData,
    heatmapData,
    serieTemporal: serieTemporalArray,
  };
}
