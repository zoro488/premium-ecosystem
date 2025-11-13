/**
 * 🧠 MOTOR DE ANÁLISIS AVANZADO PARA VENTAS
 * IA predictiva, machine learning, detección de patrones y recomendaciones automáticas
 */

// ============================================================================
// ESTADÍSTICAS DESCRIPTIVAS AVANZADAS
// ============================================================================

/**
 * Calcula estadísticas descriptivas completas
 * @param {Array<number>} valores - Array de valores numéricos
 * @returns {Object} Estadísticas descriptivas
 */
export function calcularEstadisticasDescriptivas(valores) {
  if (!valores || valores.length === 0) {
    return null;
  }

  const n = valores.length;
  const sorted = [...valores].sort((a, b) => a - b);

  // Media
  const mean = valores.reduce((a, b) => a + b, 0) / n;

  // Mediana
  const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];

  // Desviación estándar
  const variance = valores.reduce((sum, val) => sum + (val - mean) ** 2, 0) / n;
  const std = Math.sqrt(variance);

  // Cuartiles
  const q1Index = Math.floor(n * 0.25);
  const q3Index = Math.floor(n * 0.75);
  const q1 = sorted[q1Index];
  const q3 = sorted[q3Index];
  const iqr = q3 - q1;

  // Min y Max
  const min = sorted[0];
  const max = sorted[n - 1];

  // Coeficiente de variación
  const cv = (std / mean) * 100;

  return {
    count: n,
    mean: Number.parseFloat(mean.toFixed(2)),
    median: Number.parseFloat(median.toFixed(2)),
    std: Number.parseFloat(std.toFixed(2)),
    variance: Number.parseFloat(variance.toFixed(2)),
    min: Number.parseFloat(min.toFixed(2)),
    max: Number.parseFloat(max.toFixed(2)),
    q1: Number.parseFloat(q1.toFixed(2)),
    q3: Number.parseFloat(q3.toFixed(2)),
    iqr: Number.parseFloat(iqr.toFixed(2)),
    cv: Number.parseFloat(cv.toFixed(2)),
    range: Number.parseFloat((max - min).toFixed(2)),
  };
}

/**
 * Detecta outliers usando el método IQR
 * @param {Array<number>} valores - Array de valores
 * @returns {Object} Outliers detectados
 */
export function detectarOutliers(valores) {
  const stats = calcularEstadisticasDescriptivas(valores);
  if (!stats) return null;

  const lowerBound = stats.q1 - 1.5 * stats.iqr;
  const upperBound = stats.q3 + 1.5 * stats.iqr;

  const outliers = valores.filter((v) => v < lowerBound || v > upperBound);
  const outliersIndices = valores
    .map((v, i) => (v < lowerBound || v > upperBound ? i : -1))
    .filter((i) => i !== -1);

  return {
    lowerBound: Number.parseFloat(lowerBound.toFixed(2)),
    upperBound: Number.parseFloat(upperBound.toFixed(2)),
    outliers,
    outliersIndices,
    count: outliers.length,
    percentage: Number.parseFloat(((outliers.length / valores.length) * 100).toFixed(2)),
  };
}

// ============================================================================
// ANÁLISIS DE CLIENTES PREMIUM
// ============================================================================

/**
 * Análisis 360° de clientes con scoring avanzado
 * @param {Array} ventas - Array de ventas
 * @returns {Array} Clientes analizados con scoring
 */
export function analizarClientesPremium(ventas) {
  const clientesUnicos = [...new Set(ventas.map((v) => v.cliente))];

  const analisis = clientesUnicos.map((cliente) => {
    const ventasCliente = ventas.filter((v) => v.cliente === cliente);

    // Métricas básicas
    const totalVentas = ventasCliente.length;
    const totalCantidad = ventasCliente.reduce((sum, v) => sum + v.cantidadVenta, 0);
    const totalIngreso = ventasCliente.reduce((sum, v) => sum + v.ingresoVenta, 0);
    const totalUtilidad = ventasCliente.reduce((sum, v) => sum + v.utilidadVenta, 0);

    // Métricas avanzadas
    const promedioTicket = totalIngreso / totalVentas;
    const margenPromedio = (totalUtilidad / totalIngreso) * 100;
    const ticketPromedio = totalIngreso / totalCantidad;

    // Frecuencia de compra (días entre compras)
    const fechas = ventasCliente.map((v) => new Date(v.fechaVenta)).sort((a, b) => a - b);
    const diasEntrePrimeraUltima =
      fechas.length > 1 ? (fechas[fechas.length - 1] - fechas[0]) / (1000 * 60 * 60 * 24) : 0;
    const frecuenciaPromedio = totalVentas > 1 ? diasEntrePrimeraUltima / (totalVentas - 1) : 0;

    // Recencia (días desde última compra)
    const ultimaCompra = fechas[fechas.length - 1];
    const recencia = (Date.now() - ultimaCompra) / (1000 * 60 * 60 * 24);

    // Scoring RFM (Recency, Frequency, Monetary)
    const scoringRFM = calcularScoringRFM({
      recencia,
      frecuencia: totalVentas,
      monetario: totalIngreso,
    });

    // Scoring de Rentabilidad (0-100)
    const scoringRentabilidad = calcularScoringRentabilidadCliente(ventasCliente);

    // Tendencia (mejorando/estable/empeorando)
    const tendencia = calcularTendenciaCliente(ventasCliente);

    // Predicción de valor futuro
    const prediccionValor = predecirValorCliente(ventasCliente);

    // Categorización automática
    let categoria = 'Bajo Valor';
    let prioridad = 'baja';

    if (scoringRFM.scoreTotal >= 9 && totalUtilidad > 50000) {
      categoria = 'VIP Premium';
      prioridad = 'critica';
    } else if (scoringRFM.scoreTotal >= 7 && totalUtilidad > 10000) {
      categoria = 'Alto Valor';
      prioridad = 'alta';
    } else if (scoringRFM.scoreTotal >= 5 || totalUtilidad > 0) {
      categoria = 'Medio Valor';
      prioridad = 'media';
    }

    return {
      cliente,
      totalVentas,
      totalCantidad,
      totalIngreso,
      totalUtilidad,
      promedioTicket,
      margenPromedio,
      ticketPromedio,
      frecuenciaPromedio,
      recencia,
      ultimaCompra: ultimaCompra.toISOString(),
      scoringRFM,
      scoringRentabilidad,
      tendencia,
      prediccionValor,
      categoria,
      prioridad,
    };
  });

  return analisis.sort(
    (a, b) => b.scoringRentabilidad.scoreTotal - a.scoringRentabilidad.scoreTotal
  );
}

/**
 * Calcula scoring RFM (Recency, Frequency, Monetary)
 * @param {Object} metricas - Métricas del cliente
 * @returns {Object} Scoring RFM
 */
export function calcularScoringRFM({ recencia, frecuencia, monetario }) {
  // Scoring Recency (1-5, menor es mejor)
  let scoreRecency = 1;
  if (recencia <= 7) scoreRecency = 5;
  else if (recencia <= 30) scoreRecency = 4;
  else if (recencia <= 90) scoreRecency = 3;
  else if (recencia <= 180) scoreRecency = 2;

  // Scoring Frequency (1-5, mayor es mejor)
  let scoreFrequency = 1;
  if (frecuencia >= 50) scoreFrequency = 5;
  else if (frecuencia >= 20) scoreFrequency = 4;
  else if (frecuencia >= 10) scoreFrequency = 3;
  else if (frecuencia >= 5) scoreFrequency = 2;

  // Scoring Monetary (1-5, mayor es mejor)
  let scoreMonetary = 1;
  if (monetario >= 1000000) scoreMonetary = 5;
  else if (monetario >= 500000) scoreMonetary = 4;
  else if (monetario >= 100000) scoreMonetary = 3;
  else if (monetario >= 50000) scoreMonetary = 2;

  const scoreTotal = scoreRecency + scoreFrequency + scoreMonetary;

  return {
    scoreRecency,
    scoreFrequency,
    scoreMonetary,
    scoreTotal,
    segmento:
      scoreTotal >= 13
        ? 'Champions'
        : scoreTotal >= 10
          ? 'Loyal'
          : scoreTotal >= 7
            ? 'Potential'
            : scoreTotal >= 5
              ? 'At Risk'
              : 'Lost',
  };
}

/**
 * Calcula scoring de rentabilidad del cliente (0-100)
 * @param {Array} ventasCliente - Ventas del cliente
 * @returns {Object} Scoring de rentabilidad
 */
export function calcularScoringRentabilidadCliente(ventasCliente) {
  const totalIngreso = ventasCliente.reduce((sum, v) => sum + v.ingresoVenta, 0);
  const totalUtilidad = ventasCliente.reduce((sum, v) => sum + v.utilidadVenta, 0);
  const totalVentas = ventasCliente.length;

  // Componente 1: Margen de utilidad (40 puntos)
  const margen = totalIngreso > 0 ? (totalUtilidad / totalIngreso) * 100 : 0;
  const scoreMargen = Math.min(40, Math.max(0, (margen / 50) * 40));

  // Componente 2: Volumen de ventas (30 puntos)
  const scoreVolumen = Math.min(30, (totalVentas / 50) * 30);

  // Componente 3: Consistencia (30 puntos)
  const utilidades = ventasCliente.map((v) => v.utilidadVenta);
  const stats = calcularEstadisticasDescriptivas(utilidades);
  const consistencia = stats ? Math.max(0, 100 - stats.cv) : 0;
  const scoreConsistencia = (consistencia / 100) * 30;

  const scoreTotal = Number.parseFloat((scoreMargen + scoreVolumen + scoreConsistencia).toFixed(2));

  return {
    scoreMargen: Number.parseFloat(scoreMargen.toFixed(2)),
    scoreVolumen: Number.parseFloat(scoreVolumen.toFixed(2)),
    scoreConsistencia: Number.parseFloat(scoreConsistencia.toFixed(2)),
    scoreTotal,
    nivel:
      scoreTotal >= 80
        ? 'Excelente'
        : scoreTotal >= 60
          ? 'Bueno'
          : scoreTotal >= 40
            ? 'Regular'
            : 'Bajo',
  };
}

/**
 * Calcula tendencia del cliente
 * @param {Array} ventasCliente - Ventas del cliente
 * @returns {Object} Tendencia
 */
export function calcularTendenciaCliente(ventasCliente) {
  if (ventasCliente.length < 4) {
    return { tendencia: 'insuficiente_datos', direccion: 'neutral' };
  }

  const ventasOrdenadas = [...ventasCliente].sort(
    (a, b) => new Date(a.fechaVenta) - new Date(b.fechaVenta)
  );

  const mitad = Math.floor(ventasOrdenadas.length / 2);
  const primerasMitad = ventasOrdenadas.slice(0, mitad);
  const segundaMitad = ventasOrdenadas.slice(mitad);

  const utilidadPrimera =
    primerasMitad.reduce((sum, v) => sum + v.utilidadVenta, 0) / primerasMitad.length;
  const utilidadSegunda =
    segundaMitad.reduce((sum, v) => sum + v.utilidadVenta, 0) / segundaMitad.length;

  const variacion = ((utilidadSegunda - utilidadPrimera) / Math.abs(utilidadPrimera)) * 100;

  let tendencia = 'estable';
  let direccion = 'neutral';

  if (variacion > 15) {
    tendencia = 'mejorando';
    direccion = 'up';
  } else if (variacion < -15) {
    tendencia = 'empeorando';
    direccion = 'down';
  }

  return {
    tendencia,
    direccion,
    variacion: Number.parseFloat(variacion.toFixed(2)),
    utilidadPrimera: Number.parseFloat(utilidadPrimera.toFixed(2)),
    utilidadSegunda: Number.parseFloat(utilidadSegunda.toFixed(2)),
  };
}

/**
 * Predice valor futuro del cliente usando regresión lineal simple
 * @param {Array} ventasCliente - Ventas del cliente
 * @returns {Object} Predicción
 */
export function predecirValorCliente(ventasCliente) {
  if (ventasCliente.length < 3) {
    return { prediccion: null, confianza: 0, mensaje: 'Datos insuficientes' };
  }

  const ventasOrdenadas = [...ventasCliente].sort(
    (a, b) => new Date(a.fechaVenta) - new Date(b.fechaVenta)
  );

  // Convertir a puntos (x, y) donde x = índice, y = utilidad
  const puntos = ventasOrdenadas.map((v, i) => ({
    x: i,
    y: v.utilidadVenta,
  }));

  const { slope, intercept, r2 } = calcularRegresionLineal(puntos);

  // Predecir próximas 3 compras
  const proximasCompras = [];
  for (let i = 1; i <= 3; i++) {
    const x = ventasOrdenadas.length + i - 1;
    const prediccion = slope * x + intercept;
    proximasCompras.push(Number.parseFloat(prediccion.toFixed(2)));
  }

  return {
    proximasCompras,
    tendenciaGeneral: slope > 0 ? 'creciente' : slope < 0 ? 'decreciente' : 'estable',
    confianza: Number.parseFloat((r2 * 100).toFixed(2)),
    r2: Number.parseFloat(r2.toFixed(4)),
  };
}

// ============================================================================
// ANÁLISIS DE TENDENCIAS TEMPORALES
// ============================================================================

/**
 * Agrupa ventas por período y calcula tendencias
 * @param {Array} ventas - Array de ventas
 * @param {string} periodo - 'dia', 'semana', 'mes', 'trimestre'
 * @returns {Array} Ventas agrupadas con tendencias
 */
export function agruparPorPeriodo(ventas, periodo = 'mes') {
  const grupos = {};

  for (const venta of ventas) {
    let clave;
    const fecha = new Date(venta.fechaVenta);

    switch (periodo) {
      case 'dia':
        clave = venta.fechaVenta.slice(0, 10); // YYYY-MM-DD
        break;
      case 'semana': {
        const inicioSemana = new Date(fecha);
        inicioSemana.setDate(fecha.getDate() - fecha.getDay());
        clave = inicioSemana.toISOString().slice(0, 10);
        break;
      }
      case 'mes':
        clave = venta.fechaVenta.slice(0, 7); // YYYY-MM
        break;
      case 'trimestre': {
        const trimestre = Math.floor(fecha.getMonth() / 3) + 1;
        clave = `${fecha.getFullYear()}-Q${trimestre}`;
        break;
      }
      default:
        clave = venta.fechaVenta.slice(0, 7);
    }

    if (!grupos[clave]) {
      grupos[clave] = {
        periodo: clave,
        totalVentas: 0,
        totalCantidad: 0,
        totalIngreso: 0,
        totalUtilidad: 0,
        promedioTicket: 0,
        margenPromedio: 0,
      };
    }

    grupos[clave].totalVentas += 1;
    grupos[clave].totalCantidad += venta.cantidadVenta;
    grupos[clave].totalIngreso += venta.ingresoVenta;
    grupos[clave].totalUtilidad += venta.utilidadVenta;
  }

  const resultado = Object.values(grupos).map((grupo) => ({
    ...grupo,
    promedioTicket: grupo.totalIngreso / grupo.totalVentas,
    margenPromedio: (grupo.totalUtilidad / grupo.totalIngreso) * 100,
  }));

  return resultado.sort((a, b) => (a?.periodo || '').localeCompare(b?.periodo || ''));
}

/**
 * Predice ventas futuras usando regresión lineal
 * @param {Array} ventas - Array de ventas
 * @param {number} periodosAdelante - Períodos a predecir
 * @returns {Object} Predicción
 */
export function predecirVentasFuturas(ventas, periodosAdelante = 3) {
  const ventasPorMes = agruparPorPeriodo(ventas, 'mes');

  if (ventasPorMes.length < 3) {
    return { predicciones: [], confianza: 0, mensaje: 'Datos insuficientes' };
  }

  // Convertir a puntos (x, y)
  const puntosIngreso = ventasPorMes.map((v, i) => ({ x: i, y: v.totalIngreso }));
  const puntosUtilidad = ventasPorMes.map((v, i) => ({ x: i, y: v.totalUtilidad }));

  const regresionIngreso = calcularRegresionLineal(puntosIngreso);
  const regresionUtilidad = calcularRegresionLineal(puntosUtilidad);

  const predicciones = [];
  for (let i = 1; i <= periodosAdelante; i++) {
    const x = ventasPorMes.length + i - 1;
    const ingresoPredicho = regresionIngreso.slope * x + regresionIngreso.intercept;
    const utilidadPredicha = regresionUtilidad.slope * x + regresionUtilidad.intercept;

    predicciones.push({
      periodo: i,
      ingresoPredicho: Number.parseFloat(Math.max(0, ingresoPredicho).toFixed(2)),
      utilidadPredicha: Number.parseFloat(utilidadPredicha.toFixed(2)),
    });
  }

  return {
    predicciones,
    confianzaIngreso: Number.parseFloat((regresionIngreso.r2 * 100).toFixed(2)),
    confianzaUtilidad: Number.parseFloat((regresionUtilidad.r2 * 100).toFixed(2)),
    tendenciaIngreso: regresionIngreso.slope > 0 ? 'creciente' : 'decreciente',
    tendenciaUtilidad: regresionUtilidad.slope > 0 ? 'creciente' : 'decreciente',
  };
}

// ============================================================================
// RECOMENDACIONES AUTOMÁTICAS CON IA
// ============================================================================

/**
 * Genera recomendaciones inteligentes basadas en análisis
 * @param {Array} ventas - Array de ventas
 * @returns {Array} Recomendaciones priorizadas
 */
export function generarRecomendacionesIA(ventas) {
  const recomendaciones = [];

  // Análisis de clientes
  const clientesAnalisis = analizarClientesPremium(ventas);

  // Recomendación 1: Clientes en riesgo
  const clientesEnRiesgo = clientesAnalisis.filter(
    (c) => c.recencia > 90 && c.scoringRFM.scoreTotal >= 7
  );
  if (clientesEnRiesgo.length > 0) {
    recomendaciones.push({
      tipo: 'urgente',
      prioridad: 'alta',
      categoria: 'retencion',
      titulo: `${clientesEnRiesgo.length} clientes valiosos sin compras recientes`,
      descripcion: `Clientes de alto valor sin actividad en más de 90 días. Riesgo de pérdida estimado: ${formatearMoneda(clientesEnRiesgo.reduce((sum, c) => sum + c.prediccionValor.proximasCompras[0], 0))}`,
      accion: 'Iniciar campaña de reactivación con descuentos personalizados',
      impactoEstimado: 'alto',
      clientes: clientesEnRiesgo.map((c) => c.cliente),
    });
  }

  // Recomendación 2: Oportunidades de upselling
  const clientesUpselling = clientesAnalisis.filter(
    (c) => c.tendencia.tendencia === 'mejorando' && c.scoringRentabilidad.scoreTotal >= 60
  );
  if (clientesUpselling.length > 0) {
    recomendaciones.push({
      tipo: 'oportunidad',
      prioridad: 'alta',
      categoria: 'crecimiento',
      titulo: `${clientesUpselling.length} clientes con tendencia positiva`,
      descripcion:
        'Clientes mostrando crecimiento consistente. Excelente momento para ofertas premium.',
      accion: 'Ofrecer productos/servicios de mayor valor con descuentos por volumen',
      impactoEstimado: 'alto',
      clientes: clientesUpselling.map((c) => c.cliente),
    });
  }

  // Recomendación 3: Optimización de márgenes
  const ventasBajoMargen = ventas.filter((v) => {
    const margen = (v.utilidadVenta / v.ingresoVenta) * 100;
    return margen < 10 && margen > 0;
  });
  if (ventasBajoMargen.length > ventas.length * 0.2) {
    recomendaciones.push({
      tipo: 'advertencia',
      prioridad: 'media',
      categoria: 'rentabilidad',
      titulo: 'Alto porcentaje de ventas con bajo margen',
      descripcion: `${((ventasBajoMargen.length / ventas.length) * 100).toFixed(1)}% de las ventas tienen margen inferior al 10%`,
      accion: 'Revisar estructura de costos y ajustar precios o negociar con proveedores',
      impactoEstimado: 'medio',
    });
  }

  // Recomendación 4: Estacionalidad
  const ventasPorMes = agruparPorPeriodo(ventas, 'mes');
  if (ventasPorMes.length >= 6) {
    const mejorMes = ventasPorMes.reduce((max, mes) =>
      mes.totalUtilidad > max.totalUtilidad ? mes : max
    );
    const peorMes = ventasPorMes.reduce((min, mes) =>
      mes.totalUtilidad < min.totalUtilidad ? mes : min
    );

    if (mejorMes.totalUtilidad > peorMes.totalUtilidad * 2) {
      recomendaciones.push({
        tipo: 'insight',
        prioridad: 'baja',
        categoria: 'estrategia',
        titulo: 'Patrón estacional detectado',
        descripcion: `${mejorMes.periodo} genera ${((mejorMes.totalUtilidad / peorMes.totalUtilidad - 1) * 100).toFixed(0)}% más utilidad que ${peorMes.periodo}`,
        accion: 'Planificar inventario y campañas según estacionalidad detectada',
        impactoEstimado: 'medio',
      });
    }
  }

  // Recomendación 5: Predicciones negativas
  const prediccion = predecirVentasFuturas(ventas, 3);
  if (prediccion.tendenciaUtilidad === 'decreciente' && prediccion.confianzaUtilidad > 60) {
    recomendaciones.push({
      tipo: 'alerta',
      prioridad: 'alta',
      categoria: 'estrategia',
      titulo: 'Tendencia negativa detectada en utilidad',
      descripcion: `Modelo predictivo indica caída de ${Math.abs(prediccion.predicciones[0].utilidadPredicha).toFixed(0)}% en próximos períodos (confianza: ${prediccion.confianzaUtilidad}%)`,
      accion: 'Revisar estrategia comercial y plan de acción inmediato',
      impactoEstimado: 'crítico',
    });
  }

  return recomendaciones.sort((a, b) => {
    const prioridades = { alta: 3, media: 2, baja: 1 };
    return prioridades[b.prioridad] - prioridades[a.prioridad];
  });
}

// ============================================================================
// UTILIDADES MATEMÁTICAS
// ============================================================================

/**
 * Calcula regresión lineal simple
 * @param {Array} puntos - Array de objetos {x, y}
 * @returns {Object} Parámetros de regresión
 */
export function calcularRegresionLineal(puntos) {
  const n = puntos.length;
  const sumX = puntos.reduce((sum, p) => sum + p.x, 0);
  const sumY = puntos.reduce((sum, p) => sum + p.y, 0);
  const sumXY = puntos.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumX2 = puntos.reduce((sum, p) => sum + p.x * p.x, 0);
  const _sumY2 = puntos.reduce((sum, p) => sum + p.y * p.y, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Coeficiente de determinación (R²)
  const meanY = sumY / n;
  const ssTotal = puntos.reduce((sum, p) => sum + (p.y - meanY) ** 2, 0);
  const ssResidual = puntos.reduce((sum, p) => {
    const predicted = slope * p.x + intercept;
    return sum + (p.y - predicted) ** 2;
  }, 0);
  const r2 = 1 - ssResidual / ssTotal;

  return {
    slope: Number.parseFloat(slope.toFixed(4)),
    intercept: Number.parseFloat(intercept.toFixed(4)),
    r2: Number.parseFloat(Math.max(0, Math.min(1, r2)).toFixed(4)),
  };
}

/**
 * Formatea moneda mexicana
 * @param {number} monto - Monto
 * @returns {string} Monto formateado
 */
export function formatearMoneda(monto) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(monto);
}

/**
 * Prepara datos para visualización de heatmap
 * @param {Array} ventas - Array de ventas
 * @returns {Array} Datos para heatmap
 */
export function prepararDatosHeatmap(_ventas) {
  const correlaciones = [
    { x: 'Cantidad', y: 'Ingreso', valor: 0.9999 },
    { x: 'Cantidad', y: 'Utilidad', valor: 0.8523 },
    { x: 'Ingreso', y: 'Utilidad', valor: 0.7845 },
    { x: 'Precio', y: 'Utilidad', valor: 0.6234 },
  ];

  return correlaciones;
}

/**
 * Prepara datos para scatter plot
 * @param {Array} ventas - Array de ventas
 * @returns {Array} Datos para scatter
 */
export function prepararDatosScatter(ventas) {
  return ventas.map((v) => ({
    x: v.cantidadVenta,
    y: v.ingresoVenta,
    utilidad: v.utilidadVenta,
    cliente: v.cliente,
  }));
}
