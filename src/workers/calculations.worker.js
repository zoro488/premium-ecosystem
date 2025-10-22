/**
 * ⚡ WEB WORKER para cálculos pesados
 * Nivel: PERFORMANCE ENTERPRISE
 * Pattern: Offload to Worker Thread
 */

// Worker para cálculos complejos sin bloquear UI
self.addEventListener('message', (e) => {
  const { type, data } = e.data;

  switch (type) {
    case 'CALCULAR_METRICAS': {
      const metricas = calcularMetricasComplejas(data);
      self.postMessage({ type: 'METRICAS_CALCULADAS', data: metricas });
      break;
    }

    case 'FILTRAR_DATOS': {
      const filtered = filtrarDatosGrandes(data.items, data.filters);
      self.postMessage({ type: 'DATOS_FILTRADOS', data: filtered });
      break;
    }

    case 'EXPORTAR_EXCEL': {
      const excelData = prepararDatosExcel(data);
      self.postMessage({ type: 'EXCEL_PREPARADO', data: excelData });
      break;
    }

    case 'ANALISIS_AVANZADO': {
      const analisis = ejecutarAnalisisEstadistico(data);
      self.postMessage({ type: 'ANALISIS_COMPLETADO', data: analisis });
      break;
    }

    default:
      // console.warn('Worker: Tipo de mensaje desconocido', type);
  }
});

// Funciones de cálculo pesado
function calcularMetricasComplejas(data) {
  const { ventas, clientes, bancos } = data;

  return {
    totalVentas: ventas.reduce((sum, v) => sum + (v.totalVenta || 0), 0),
    totalUtilidades: ventas.reduce((sum, v) => sum + (v.utilidad || 0), 0),
    promedioVenta: ventas.length
      ? ventas.reduce((sum, v) => sum + v.totalVenta, 0) / ventas.length
      : 0,
    ventasPendientes: ventas.filter((v) => v.estatus === 'Pendiente').length,
    ventasPagadas: ventas.filter((v) => v.estatus === 'Pagado').length,
    clientesActivos: new Set(ventas.map((v) => v.cliente)).size,
    adeudoTotal: clientes.reduce((sum, c) => sum + (c.adeudo || 0), 0),
    capitalTotal: Object.values(bancos).reduce((sum, b) => sum + (b.capitalActual || 0), 0),
    margenPromedio: ventas.length
      ? ventas.reduce((sum, v) => sum + ((v.utilidad || 0) / (v.totalVenta || 1)) * 100, 0) /
        ventas.length
      : 0,
  };
}

function filtrarDatosGrandes(items, filters) {
  return items.filter((item) => {
    let match = true;

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      match =
        match &&
        (item.nombre?.toLowerCase().includes(query) ||
          item.cliente?.toLowerCase().includes(query) ||
          item.concepto?.toLowerCase().includes(query));
    }

    if (filters.estatus) {
      match = match && item.estatus === filters.estatus;
    }

    if (filters.fechaInicio && filters.fechaFin) {
      const itemDate = new Date(item.fecha);
      match =
        match &&
        itemDate >= new Date(filters.fechaInicio) &&
        itemDate <= new Date(filters.fechaFin);
    }

    return match;
  });
}

function prepararDatosExcel(data) {
  // Convertir datos a formato exportable
  return data.map((item) => ({
    ...item,
    fecha: new Date(item.fecha).toLocaleDateString('es-SV'),
    // Formatear otros campos...
  }));
}

function ejecutarAnalisisEstadistico(data) {
  const { ventas } = data;

  // Análisis por período
  const ventasPorMes = {};
  ventas.forEach((v) => {
    const mes = new Date(v.fecha).toISOString().slice(0, 7);
    if (!ventasPorMes[mes]) {
      ventasPorMes[mes] = { ventas: 0, total: 0, utilidad: 0 };
    }
    ventasPorMes[mes].ventas++;
    ventasPorMes[mes].total += v.totalVenta || 0;
    ventasPorMes[mes].utilidad += v.utilidad || 0;
  });

  // Top clientes
  const ventasPorCliente = {};
  ventas.forEach((v) => {
    if (!ventasPorCliente[v.cliente]) {
      ventasPorCliente[v.cliente] = { count: 0, total: 0 };
    }
    ventasPorCliente[v.cliente].count++;
    ventasPorCliente[v.cliente].total += v.totalVenta || 0;
  });

  const topClientes = Object.entries(ventasPorCliente)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 10);

  return {
    ventasPorMes,
    topClientes,
    tendencia: calcularTendencia(Object.values(ventasPorMes).map((m) => m.total)),
  };
}

function calcularTendencia(valores) {
  if (valores.length < 2) return 'estable';

  const ultimos = valores.slice(-3);
  const promedio = ultimos.reduce((a, b) => a + b, 0) / ultimos.length;
  const anterior = valores[valores.length - 4] || promedio;

  const cambio = ((promedio - anterior) / anterior) * 100;

  if (cambio > 10) return 'creciente';
  if (cambio < -10) return 'decreciente';
  return 'estable';
}
