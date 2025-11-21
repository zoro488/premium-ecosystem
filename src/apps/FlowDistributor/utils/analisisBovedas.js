/**
 * 🏛️ MOTOR DE ANÁLISIS AVANZADO PARA BÓVEDA MONTE
 * IA predictiva, optimización de inventario, análisis de rotación y alertas inteligentes
 */
import { calcularEstadisticasDescriptivas, calcularRegresionLineal } from './analisisVentas.js';

// ============================================================================
// ANÁLISIS DE INVENTARIO Y ROTACIÓN
// ============================================================================

/**
 * Calcula métricas de rotación de inventario
 * @param {Object} boveda - Bóveda a analizar
 * @param {Array} movimientos - Movimientos de la bóveda
 * @param {number} diasPeriodo - Días del período (default 30)
 * @returns {Object} Métricas de rotación
 */
export function calcularRotacionInventario(boveda, movimientos, diasPeriodo = 30) {
  const fechaInicio = new Date();
  fechaInicio.setDate(fechaInicio.getDate() - diasPeriodo);

  const movimientosPeriodo = movimientos.filter(
    (m) => m.bovedaId === boveda.id && new Date(m.fechaMovimiento) >= fechaInicio
  );

  // Calcular ventas/salidas del período
  const egresos = movimientosPeriodo.filter((m) => m.tipo === 'Egreso');
  const totalEgresos = egresos.reduce((sum, m) => sum + m.valorTotal, 0);
  const cantidadEgresos = egresos.reduce((sum, m) => sum + m.cantidad, 0);

  // Inventario promedio
  const inventarioPromedio = boveda.valorActual;

  // Índice de rotación = Ventas / Inventario Promedio
  const indiceRotacion = inventarioPromedio > 0 ? totalEgresos / inventarioPromedio : 0;

  // Días de inventario = 365 / Índice de Rotación
  const diasInventario = indiceRotacion > 0 ? 365 / indiceRotacion : 999;

  // Velocidad de rotación
  let velocidad = 'muy_lenta';
  if (indiceRotacion >= 12) velocidad = 'muy_rapida';
  else if (indiceRotacion >= 6) velocidad = 'rapida';
  else if (indiceRotacion >= 4) velocidad = 'media';
  else if (indiceRotacion >= 2) velocidad = 'lenta';

  // Tasa de salida diaria
  const tasaSalidaDiaria = cantidadEgresos / diasPeriodo;

  // Días hasta agotamiento (al ritmo actual)
  const diasHastaAgotamiento =
    tasaSalidaDiaria > 0 ? boveda.unidadesActuales / tasaSalidaDiaria : 999;

  return {
    indiceRotacion: Number.parseFloat(indiceRotacion.toFixed(4)),
    diasInventario: Number.parseFloat(diasInventario.toFixed(2)),
    velocidad,
    tasaSalidaDiaria: Number.parseFloat(tasaSalidaDiaria.toFixed(2)),
    diasHastaAgotamiento: Number.parseFloat(Math.min(999, diasHastaAgotamiento).toFixed(2)),
    totalEgresos: Number.parseFloat(totalEgresos.toFixed(2)),
    cantidadEgresos,
    movimientosPeriodo: movimientosPeriodo.length,
  };
}

/**
 * Analiza eficiencia operativa de la bóveda
 * @param {Object} boveda - Bóveda a analizar
 * @param {Array} movimientos - Movimientos de la bóveda
 * @returns {Object} Métricas de eficiencia
 */
export function analizarEficienciaOperativa(boveda, movimientos) {
  const movimientosBoveda = movimientos.filter((m) => m.bovedaId === boveda.id);

  if (movimientosBoveda.length === 0) {
    return {
      eficienciaAlmacenamiento: 0,
      costoAlmacenamiento: 0,
      valorPorUnidad: 0,
      nivel: 'sin_datos',
    };
  }

  // Eficiencia de almacenamiento = Valor Actual / Capacidad Máxima
  const eficienciaAlmacenamiento = (boveda.valorActual / boveda.capacidadMaxima) * 100;

  // Costo de almacenamiento estimado (por unidad)
  const costoAlmacenamientoPorUnidad = 10; // $10 MXN por unidad/mes (estimado)
  const costoAlmacenamiento = boveda.unidadesActuales * costoAlmacenamientoPorUnidad;

  // Valor promedio por unidad
  const valorPorUnidad =
    boveda.unidadesActuales > 0 ? boveda.valorActual / boveda.unidadesActuales : 0;

  // Frecuencia de movimientos (movimientos por día)
  const fechas = movimientosBoveda.map((m) => new Date(m.fechaMovimiento));
  const diasActiva =
    fechas.length > 0 ? (Math.max(...fechas) - Math.min(...fechas)) / (1000 * 60 * 60 * 24) : 0;
  const frecuenciaMovimientos = diasActiva > 0 ? movimientosBoveda.length / diasActiva : 0;

  // Nivel de eficiencia
  let nivel = 'baja';
  if (eficienciaAlmacenamiento >= 70 && frecuenciaMovimientos >= 1) nivel = 'excelente';
  else if (eficienciaAlmacenamiento >= 50 && frecuenciaMovimientos >= 0.5) nivel = 'buena';
  else if (eficienciaAlmacenamiento >= 30) nivel = 'media';

  return {
    eficienciaAlmacenamiento: Number.parseFloat(eficienciaAlmacenamiento.toFixed(2)),
    costoAlmacenamiento: Number.parseFloat(costoAlmacenamiento.toFixed(2)),
    valorPorUnidad: Number.parseFloat(valorPorUnidad.toFixed(2)),
    frecuenciaMovimientos: Number.parseFloat(frecuenciaMovimientos.toFixed(4)),
    diasActiva: Number.parseFloat(diasActiva.toFixed(2)),
    nivel,
  };
}

// ============================================================================
// PREDICCIÓN Y FORECASTING
// ============================================================================

/**
 * Predice demanda futura y punto de reorden
 * @param {Object} boveda - Bóveda a analizar
 * @param {Array} movimientos - Movimientos de la bóveda
 * @param {number} diasAdelante - Días a predecir (default 30)
 * @returns {Object} Predicción y punto de reorden
 */
export function predecirDemandaYReorden(boveda, movimientos, diasAdelante = 30) {
  const movimientosBoveda = movimientos
    .filter((m) => m.bovedaId === boveda.id && m.tipo === 'Egreso')
    .sort((a, b) => new Date(a.fechaMovimiento) - new Date(b.fechaMovimiento));

  if (movimientosBoveda.length < 5) {
    return {
      prediccion: null,
      puntoReorden: null,
      confianza: 0,
      mensaje: 'Datos insuficientes para predicción (mínimo 5 movimientos)',
    };
  }

  // Agrupar por día
  const egresosPorDia = {};
  for (const mov of movimientosBoveda) {
    const fecha = mov.fechaMovimiento.slice(0, 10);
    if (!egresosPorDia[fecha]) {
      egresosPorDia[fecha] = 0;
    }
    egresosPorDia[fecha] += mov.cantidad;
  }

  // Convertir a puntos para regresión
  const puntos = Object.entries(egresosPorDia).map(([_fecha, cantidad], i) => ({
    x: i,
    y: cantidad,
  }));

  const regresion = calcularRegresionLineal(puntos);

  // Predecir demanda futura
  const demandaPredicha = [];
  let acumulado = boveda.unidadesActuales;

  for (let i = 1; i <= diasAdelante; i++) {
    const x = puntos.length + i - 1;
    const demandaDia = Math.max(0, regresion.slope * x + regresion.intercept);
    acumulado -= demandaDia;

    demandaPredicha.push({
      dia: i,
      demanda: Number.parseFloat(demandaDia.toFixed(2)),
      inventarioRestante: Number.parseFloat(Math.max(0, acumulado).toFixed(2)),
    });

    if (acumulado <= 0) break;
  }

  // Calcular demanda promedio diaria
  const demandaPromedioDiaria = puntos.reduce((sum, p) => sum + p.y, 0) / puntos.length;
  const stats = calcularEstadisticasDescriptivas(puntos.map((p) => p.y));

  // Lead time estimado (días de reabastecimiento)
  const leadTime = 7; // 7 días estimado

  // Stock de seguridad = desviación estándar × factor de servicio (1.65 para 95% servicio)
  const stockSeguridad = stats.std * 1.65;

  // Punto de reorden = Demanda durante lead time + Stock de seguridad
  const puntoReorden = demandaPromedioDiaria * leadTime + stockSeguridad;

  // Cantidad óptima de pedido (EOQ simplificado)
  const demandaAnual = demandaPromedioDiaria * 365;
  const costoOrden = 500; // $500 MXN por orden (estimado)
  const costoMantenimiento =
    boveda.valorActual > 0
      ? (10 / boveda.valorActual) * boveda.unidadesActuales // 10% del valor
      : 0.1;

  const eoq = Math.sqrt((2 * demandaAnual * costoOrden) / Math.max(0.01, costoMantenimiento));

  // Determinar si necesita reorden
  const necesitaReorden = boveda.unidadesActuales <= puntoReorden;
  const diasHastaReorden =
    demandaPromedioDiaria > 0
      ? (boveda.unidadesActuales - puntoReorden) / demandaPromedioDiaria
      : 999;

  // Determinar tendencia de demanda
  let tendenciaDemanda = 'estable';
  if (regresion.slope > 0) tendenciaDemanda = 'creciente';
  else if (regresion.slope < 0) tendenciaDemanda = 'decreciente';

  return {
    demandaPredicha: demandaPredicha.slice(0, 10), // Primeros 10 días
    demandaPromedioDiaria: Number.parseFloat(demandaPromedioDiaria.toFixed(2)),
    puntoReorden: Number.parseFloat(puntoReorden.toFixed(2)),
    stockSeguridad: Number.parseFloat(stockSeguridad.toFixed(2)),
    cantidadOptimaPedido: Number.parseFloat(eoq.toFixed(2)),
    necesitaReorden,
    diasHastaReorden: Number.parseFloat(diasHastaReorden.toFixed(2)),
    confianza: Number.parseFloat((regresion.r2 * 100).toFixed(2)),
    tendenciaDemanda,
  };
}

/**
 * Simula escenarios de inventario
 * @param {Object} boveda - Bóveda a analizar
 * @param {Object} prediccion - Predicción de demanda
 * @param {Array} escenarios - Array de escenarios a simular
 * @returns {Array} Resultados de simulación
 */
export function simularEscenarios(
  boveda,
  prediccion,
  escenarios = ['optimista', 'base', 'pesimista']
) {
  if (!prediccion || !prediccion.demandaPredicha) {
    return [];
  }

  const resultados = [];

  const factores = {
    optimista: 0.8, // 20% menos demanda
    base: 1, // Demanda predicha
    pesimista: 1.3, // 30% más demanda
  };

  for (const escenario of escenarios) {
    const factor = factores[escenario] || 1;
    let inventario = boveda.unidadesActuales;
    const diasHastaAgotamiento = [];

    for (const pred of prediccion.demandaPredicha) {
      const demandaAjustada = pred.demanda * factor;
      inventario -= demandaAjustada;

      if (inventario <= 0 && diasHastaAgotamiento.length === 0) {
        diasHastaAgotamiento.push(pred.dia);
      }
    }

    // Determinar probabilidad de agotamiento
    let probabilidadAgotamiento = 'baja';
    if (inventario <= 0) probabilidadAgotamiento = 'alta';
    else if (inventario <= prediccion.puntoReorden) probabilidadAgotamiento = 'media';

    resultados.push({
      escenario,
      factor,
      inventarioFinal: Number.parseFloat(Math.max(0, inventario).toFixed(2)),
      diasHastaAgotamiento: diasHastaAgotamiento.length > 0 ? diasHastaAgotamiento[0] : null,
      probabilidadAgotamiento,
    });
  }

  return resultados;
}

// ============================================================================
// ANÁLISIS DE RENTABILIDAD AVANZADO
// ============================================================================

/**
 * Calcula ROI detallado y métricas financieras
 * @param {Object} boveda - Bóveda a analizar
 * @param {Array} movimientos - Movimientos de la bóveda
 * @param {Array} ventas - Ventas relacionadas
 * @param {number} diasPeriodo - Días del período
 * @returns {Object} Métricas de rentabilidad
 */
export function calcularROIDetallado(boveda, movimientos, ventas = [], diasPeriodo = 90) {
  const fechaInicio = new Date();
  fechaInicio.setDate(fechaInicio.getDate() - diasPeriodo);

  // Movimientos del período
  const movimientosPeriodo = movimientos.filter(
    (m) => m.bovedaId === boveda.id && new Date(m.fechaMovimiento) >= fechaInicio
  );

  const ingresos = movimientosPeriodo.filter((m) => m.tipo === 'Ingreso');
  const egresos = movimientosPeriodo.filter((m) => m.tipo === 'Egreso');

  const totalIngresos = ingresos.reduce((sum, m) => sum + m.valorTotal, 0);
  const totalEgresos = egresos.reduce((sum, m) => sum + m.valorTotal, 0);
  const flujoNeto = totalIngresos - totalEgresos;

  // Ventas relacionadas con esta bóveda (si están disponibles)
  const ventasRelacionadas = ventas.filter(
    (v) => v.almacen === boveda.nombre || v.bodega === boveda.ubicacion
  );

  const totalIngresoVentas = ventasRelacionadas.reduce((sum, v) => sum + v.ingresoVenta, 0);
  const totalUtilidadVentas = ventasRelacionadas.reduce((sum, v) => sum + v.utilidadVenta, 0);

  // ROI = (Ganancia Neta / Inversión) × 100
  const roi = boveda.valorActual > 0 ? (totalUtilidadVentas / boveda.valorActual) * 100 : 0;

  // ROI anualizado
  const roiAnualizado = (roi / diasPeriodo) * 365;

  // Margen de ventas
  const margenVentas =
    totalIngresoVentas > 0 ? (totalUtilidadVentas / totalIngresoVentas) * 100 : 0;

  // Tasa de retorno mensual
  const tasaRetornoMensual = (roi / diasPeriodo) * 30;

  // Payback period (meses para recuperar inversión)
  const paybackPeriod = tasaRetornoMensual > 0 ? 100 / tasaRetornoMensual : 999;

  // EVA (Economic Value Added) simplificado
  const costoCapital = 0.12; // 12% anual (estimado)
  const costoCapitalPeriodo = (costoCapital / 365) * diasPeriodo;
  const eva = totalUtilidadVentas - boveda.valorActual * costoCapitalPeriodo;

  // Clasificación de rentabilidad
  let clasificacion = 'no_rentable';
  if (roi >= 50) clasificacion = 'muy_rentable';
  else if (roi >= 25) clasificacion = 'rentable';
  else if (roi >= 10) clasificacion = 'moderado';
  else if (roi >= 0) clasificacion = 'bajo';

  return {
    roi: Number.parseFloat(roi.toFixed(2)),
    roiAnualizado: Number.parseFloat(roiAnualizado.toFixed(2)),
    margenVentas: Number.parseFloat(margenVentas.toFixed(2)),
    tasaRetornoMensual: Number.parseFloat(tasaRetornoMensual.toFixed(2)),
    paybackPeriod: Number.parseFloat(Math.min(999, paybackPeriod).toFixed(2)),
    eva: Number.parseFloat(eva.toFixed(2)),
    totalIngresoVentas: Number.parseFloat(totalIngresoVentas.toFixed(2)),
    totalUtilidadVentas: Number.parseFloat(totalUtilidadVentas.toFixed(2)),
    flujoNeto: Number.parseFloat(flujoNeto.toFixed(2)),
    clasificacion,
    diasAnalisis: diasPeriodo,
  };
}

// ============================================================================
// SISTEMA DE ALERTAS INTELIGENTES
// ============================================================================

/**
 * Genera alertas inteligentes basadas en múltiples factores
 * @param {Object} boveda - Bóveda a analizar
 * @param {Object} stats - Estadísticas de la bóveda
 * @param {Object} rotacion - Métricas de rotación
 * @param {Object} prediccion - Predicción de demanda
 * @returns {Array} Alertas priorizadas
 */
export function generarAlertasInteligentes(boveda, stats, rotacion, prediccion) {
  const alertas = [];

  // Alerta 1: Capacidad crítica
  if (stats.porcentajeOcupacion > 95) {
    alertas.push({
      tipo: 'CRITICO',
      prioridad: 'urgente',
      categoria: 'capacidad',
      titulo: 'Capacidad al límite',
      mensaje: `Bóveda ${boveda.nombre} al ${stats.porcentajeOcupacion.toFixed(1)}% de capacidad`,
      impacto: 'alto',
      accion: 'Liberar espacio o redistribuir inventario urgentemente',
      valor: stats.porcentajeOcupacion,
      umbral: 95,
    });
  } else if (stats.porcentajeOcupacion > 85) {
    alertas.push({
      tipo: 'ADVERTENCIA',
      prioridad: 'alta',
      categoria: 'capacidad',
      titulo: 'Capacidad alta',
      mensaje: `Bóveda ${boveda.nombre} al ${stats.porcentajeOcupacion.toFixed(1)}% de capacidad`,
      impacto: 'medio',
      accion: 'Planificar redistribución de inventario',
      valor: stats.porcentajeOcupacion,
      umbral: 85,
    });
  }

  // Alerta 2: Inventario bajo
  if (prediccion?.necesitaReorden) {
    alertas.push({
      tipo: 'ADVERTENCIA',
      prioridad: 'alta',
      categoria: 'reorden',
      titulo: 'Punto de reorden alcanzado',
      mensaje: `${boveda.nombre}: ${boveda.unidadesActuales} unidades. Punto de reorden: ${prediccion.puntoReorden.toFixed(0)}`,
      impacto: 'alto',
      accion: `Ordenar ${prediccion.cantidadOptimaPedido.toFixed(0)} unidades`,
      valor: boveda.unidadesActuales,
      umbral: prediccion.puntoReorden,
    });
  }

  // Alerta 3: Agotamiento inminente
  if (rotacion && rotacion.diasHastaAgotamiento < 7) {
    alertas.push({
      tipo: 'CRITICO',
      prioridad: 'urgente',
      categoria: 'stock',
      titulo: 'Agotamiento inminente',
      mensaje: `${boveda.nombre} se agotará en ${rotacion.diasHastaAgotamiento.toFixed(1)} días`,
      impacto: 'crítico',
      accion: 'Reabastecer inmediatamente',
      valor: rotacion.diasHastaAgotamiento,
      umbral: 7,
    });
  } else if (rotacion && rotacion.diasHastaAgotamiento < 15) {
    alertas.push({
      tipo: 'ADVERTENCIA',
      prioridad: 'media',
      categoria: 'stock',
      titulo: 'Stock bajo',
      mensaje: `${boveda.nombre} se agotará en ${rotacion.diasHastaAgotamiento.toFixed(1)} días`,
      impacto: 'medio',
      accion: 'Programar reabastecimiento',
      valor: rotacion.diasHastaAgotamiento,
      umbral: 15,
    });
  }

  // Alerta 4: Rotación lenta
  if (rotacion && rotacion.velocidad === 'muy_lenta') {
    alertas.push({
      tipo: 'INFO',
      prioridad: 'baja',
      categoria: 'eficiencia',
      titulo: 'Rotación muy lenta',
      mensaje: `${boveda.nombre} tiene rotación muy lenta (${rotacion.indiceRotacion.toFixed(2)}x/año)`,
      impacto: 'bajo',
      accion: 'Revisar estrategia de inventario y considerar liquidación',
      valor: rotacion.indiceRotacion,
      umbral: 2,
    });
  }

  // Alerta 5: Flujo negativo
  if (stats.flujoNeto < 0) {
    alertas.push({
      tipo: 'ADVERTENCIA',
      prioridad: 'media',
      categoria: 'flujo',
      titulo: 'Flujo negativo',
      mensaje: `${boveda.nombre} con flujo neto negativo: ${stats.flujoNeto.toFixed(2)}`,
      impacto: 'medio',
      accion: 'Incrementar ingresos o reducir egresos',
      valor: stats.flujoNeto,
      umbral: 0,
    });
  }

  // Alerta 6: Estatus inactivo
  if (boveda.estatus === 'Inactiva' && boveda.valorActual > 10000) {
    alertas.push({
      tipo: 'ADVERTENCIA',
      prioridad: 'media',
      categoria: 'estatus',
      titulo: 'Bóveda inactiva con inventario',
      mensaje: `${boveda.nombre} inactiva con ${boveda.valorActual.toFixed(2)} en inventario`,
      impacto: 'medio',
      accion: 'Activar bóveda o redistribuir inventario',
      valor: boveda.valorActual,
      umbral: 10000,
    });
  }

  return alertas.sort((a, b) => {
    const prioridades = { urgente: 4, alta: 3, media: 2, baja: 1 };
    return prioridades[b.prioridad] - prioridades[a.prioridad];
  });
}

// ============================================================================
// RECOMENDACIONES ESTRATÉGICAS
// ============================================================================

/**
 * Genera recomendaciones estratégicas para optimización
 * @param {Array} bovedas - Array de bóvedas
 * @param {Array} movimientos - Todos los movimientos
 * @param {Array} ventas - Todas las ventas
 * @returns {Array} Recomendaciones priorizadas
 */
export function generarRecomendacionesEstrategicas(bovedas, movimientos, ventas = []) {
  const recomendaciones = [];

  // Analizar cada bóveda
  const analisis = bovedas.map((boveda) => {
    const rotacion = calcularRotacionInventario(boveda, movimientos);
    const eficiencia = analizarEficienciaOperativa(boveda, movimientos);
    const prediccion = predecirDemandaYReorden(boveda, movimientos);
    const roi = calcularROIDetallado(boveda, movimientos, ventas);

    return { boveda, rotacion, eficiencia, prediccion, roi };
  });

  // Recomendación 1: Redistribución de inventario
  const bovedasSobreinventariadas = analisis.filter(
    (a) => a.eficiencia.eficienciaAlmacenamiento > 90 && a.rotacion.velocidad === 'muy_lenta'
  );
  const bovedasSubinventariadas = analisis.filter(
    (a) => a.eficiencia.eficienciaAlmacenamiento < 30 && a.rotacion.velocidad === 'rapida'
  );

  if (bovedasSobreinventariadas.length > 0 && bovedasSubinventariadas.length > 0) {
    recomendaciones.push({
      tipo: 'optimizacion',
      prioridad: 'alta',
      categoria: 'redistribucion',
      titulo: 'Oportunidad de redistribución detectada',
      descripcion: `${bovedasSobreinventariadas.length} bóvedas con exceso, ${bovedasSubinventariadas.length} con faltante`,
      accion: 'Redistribuir inventario para optimizar espacio y rotación',
      impactoEstimado: 'alto',
      bovedas: {
        exceso: bovedasSobreinventariadas.map((a) => a.boveda.nombre),
        faltante: bovedasSubinventariadas.map((a) => a.boveda.nombre),
      },
    });
  }

  // Recomendación 2: Mejora de rentabilidad
  const bovedasBajaRentabilidad = analisis.filter(
    (a) => a.roi.clasificacion === 'bajo' || a.roi.clasificacion === 'no_rentable'
  );
  if (bovedasBajaRentabilidad.length > 0) {
    const valorInmovilizado = bovedasBajaRentabilidad.reduce(
      (sum, a) => sum + a.boveda.valorActual,
      0
    );

    recomendaciones.push({
      tipo: 'alerta',
      prioridad: 'alta',
      categoria: 'rentabilidad',
      titulo: 'Bóvedas con baja rentabilidad',
      descripcion: `${bovedasBajaRentabilidad.length} bóvedas con ROI < 10%. Valor inmovilizado: ${valorInmovilizado.toFixed(2)}`,
      accion: 'Revisar estrategia comercial o considerar liquidación',
      impactoEstimado: 'alto',
      bovedas: bovedasBajaRentabilidad.map((a) => ({
        nombre: a.boveda.nombre,
        roi: a.roi.roi,
      })),
    });
  }

  // Recomendación 3: Consolidación de bóvedas
  const bovedasInactivas = analisis.filter(
    (a) => a.boveda.estatus === 'Inactiva' && a.eficiencia.eficienciaAlmacenamiento < 20
  );
  if (bovedasInactivas.length >= 2) {
    recomendaciones.push({
      tipo: 'optimizacion',
      prioridad: 'media',
      categoria: 'consolidacion',
      titulo: 'Oportunidad de consolidación',
      descripcion: `${bovedasInactivas.length} bóvedas inactivas con baja ocupación`,
      accion: 'Consolidar inventario y reducir costos operativos',
      impactoEstimado: 'medio',
      ahorroEstimado: bovedasInactivas.reduce(
        (sum, a) => sum + a.eficiencia.costoAlmacenamiento,
        0
      ),
      bovedas: bovedasInactivas.map((a) => a.boveda.nombre),
    });
  }

  // Recomendación 4: Automatización de reabastecimiento
  const bovedasParaAutomatizar = analisis.filter(
    (a) => a.prediccion && a.prediccion.confianza > 70 && a.rotacion.velocidad !== 'muy_lenta'
  );
  if (bovedasParaAutomatizar.length > 0) {
    recomendaciones.push({
      tipo: 'innovacion',
      prioridad: 'media',
      categoria: 'automatizacion',
      titulo: 'Candidatas para reabastecimiento automático',
      descripcion: `${bovedasParaAutomatizar.length} bóvedas con demanda predecible (confianza >70%)`,
      accion: 'Implementar sistema de reorden automático',
      impactoEstimado: 'medio',
      bovedas: bovedasParaAutomatizar.map((a) => ({
        nombre: a.boveda.nombre,
        confianza: a.prediccion.confianza,
      })),
    });
  }

  return recomendaciones.sort((a, b) => {
    const prioridades = { alta: 3, media: 2, baja: 1 };
    return prioridades[b.prioridad] - prioridades[a.prioridad];
  });
}

/**
 * Prepara datos para visualización de dashboard
 * @param {Array} bovedas - Array de bóvedas
 * @param {Array} movimientos - Todos los movimientos
 * @returns {Object} Datos para visualización
 */
export function prepararDatosVisualizacion(bovedas, movimientos) {
  // Comparación de bóvedas
  const comparacion = bovedas.map((boveda) => {
    const movimientosBoveda = movimientos.filter((m) => m.bovedaId === boveda.id);
    const rotacion = calcularRotacionInventario(boveda, movimientos);

    return {
      nombre: boveda.nombre,
      valorActual: boveda.valorActual,
      porcentajeOcupacion: (boveda.valorActual / boveda.capacidadMaxima) * 100,
      indiceRotacion: rotacion.indiceRotacion,
      movimientos: movimientosBoveda.length,
    };
  });

  // Serie temporal de movimientos
  const movimientosPorMes = {};
  for (const mov of movimientos) {
    const mes = mov.fechaMovimiento.slice(0, 7);
    if (!movimientosPorMes[mes]) {
      movimientosPorMes[mes] = { ingresos: 0, egresos: 0 };
    }
    if (mov.tipo === 'Ingreso') {
      movimientosPorMes[mes].ingresos += mov.valorTotal;
    } else if (mov.tipo === 'Egreso') {
      movimientosPorMes[mes].egresos += mov.valorTotal;
    }
  }

  const serieTemporal = Object.entries(movimientosPorMes)
    .map(([mes, datos]) => ({
      mes,
      ingresos: datos.ingresos,
      egresos: datos.egresos,
      neto: datos.ingresos - datos.egresos,
    }))
    .sort((a, b) => (a?.mes || '').localeCompare(b?.mes || ''));

  return {
    comparacion,
    serieTemporal,
  };
}
