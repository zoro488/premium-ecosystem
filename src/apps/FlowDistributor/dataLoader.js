// 🚀 FlowDistributor Data Loader
// Carga datos del Excel extraído automáticamente
import flowDistributorData from './data/BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json';

/**
 * Hook personalizado para cargar datos de FlowDistributor
 * Incluye todos los datos del Excel: bancos, ventas, almacén, clientes, etc.
 */
export const useFlowDistributorData = () => {
  return {
    data: flowDistributorData,
    loading: false,
    error: null,
  };
};

/**
 * Función para obtener datos iniciales del sistema
 * Compatible con el formato de FlowDistributor 2.0
 */
export const getInitialData = () => {
  const data = flowDistributorData;

  // Transformar estructura para compatibilidad
  const bancos = {};

  // Mapear bancos del JSON al formato esperado
  Object.entries(data.bancos).forEach(([key, banco]) => {
    bancos[key] = {
      ...banco,
      movimientos: [...banco.ingresos, ...banco.gastos].sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      ),
    };
  });

  return {
    config: data.config,
    bancos,
    almacen: data.almacen,
    distribuidores: data.distribuidores,
    clientes: data.clientes,
    ventas: data.ventas,
    ordenesCompra: data.ordenesCompra,
    metricas: data.metricas,
  };
};

/**
 * Obtener resumen de métricas
 */
export const getMetricsSummary = () => {
  const data = flowDistributorData;
  return {
    capitalTotal: data.metricas.capitalTotal,
    ventasTotales: data.metricas.ventasTotales,
    comprasTotales: data.metricas.comprasTotales,
    utilidadNeta: data.metricas.utilidadNeta,
    margenPromedio: data.metricas.margenPromedio,
    roi: data.metricas.roi,
    stockActual: data.almacen.stockActual,
    alertaStock: data.almacen.alertas.stockBajo,
    bancosActivos: data.metricas.totalBancos,
    bancosNegativos: Object.values(data.bancos).filter((b) => b.estado === 'negativo').length,
  };
};

/**
 * Obtener lista de bancos con su estado actual
 */
export const getBanksList = () => {
  const data = flowDistributorData;

  return Object.entries(data.bancos).map(([key, banco]) => ({
    id: key,
    nombre: banco.nombre,
    codigo: banco.codigo,
    capital: banco.capitalActual,
    estado: banco.estado,
    color: banco.color,
    icono: banco.icono,
    totalIngresos: banco.totalIngresos || 0,
    totalGastos: banco.totalGastos || 0,
    movimientos: banco.ingresos?.length + banco.gastos?.length || 0,
  }));
};

/**
 * Obtener transacciones recientes (últimas 20)
 */
export const getRecentTransactions = (limit = 20) => {
  const data = flowDistributorData;

  const allTransactions = [];

  // Agregar transacciones de todos los bancos
  Object.entries(data.bancos).forEach(([bankKey, banco]) => {
    banco.ingresos?.forEach((ing) => {
      allTransactions.push({
        ...ing,
        banco: banco.nombre,
        bancoKey: bankKey,
        tipo: 'ingreso',
      });
    });

    banco.gastos?.forEach((gas) => {
      allTransactions.push({
        ...gas,
        banco: banco.nombre,
        bancoKey: bankKey,
        tipo: 'gasto',
      });
    });
  });

  // Ordenar por fecha (más recientes primero)
  allTransactions.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  return allTransactions.slice(0, limit);
};

/**
 * Obtener ventas del mes actual
 */
export const getCurrentMonthSales = () => {
  const data = flowDistributorData;
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return data.ventas.filter((venta) => {
    const ventaDate = new Date(venta.fecha);
    return ventaDate.getMonth() === currentMonth && ventaDate.getFullYear() === currentYear;
  });
};

/**
 * Obtener clientes con adeudos pendientes
 */
export const getClientesConAdeudo = () => {
  const data = flowDistributorData;

  return data.clientes
    .filter((cliente) => cliente.pendiente > 0)
    .sort((a, b) => b.pendiente - a.pendiente);
};

/**
 * Obtener distribuidores con adeudos pendientes
 */
export const getDistribuidoresConAdeudo = () => {
  const data = flowDistributorData;

  return data.distribuidores.filter((dist) => dist.adeudo > 0).sort((a, b) => b.adeudo - a.adeudo);
};

/**
 * Obtener alertas del sistema
 */
export const getSystemAlerts = () => {
  const data = flowDistributorData;
  const alerts = [];

  // Alerta de stock bajo
  if (data.almacen.alertas.stockBajo) {
    alerts.push({
      id: 'stock-bajo',
      tipo: 'warning',
      titulo: 'Stock Bajo',
      mensaje: `El inventario está en ${data.almacen.stockActual} unidades (mínimo: ${data.almacen.stockMinimo})`,
      prioridad: 'alta',
      fecha: new Date().toISOString(),
    });
  }

  // Alertas de bancos negativos
  Object.values(data.bancos).forEach((banco) => {
    if (banco.estado === 'negativo') {
      alerts.push({
        id: `banco-negativo-${banco.codigo}`,
        tipo: 'danger',
        titulo: 'Banco en Negativo',
        mensaje: `${banco.nombre} tiene saldo negativo: $${banco.capitalActual.toLocaleString()}`,
        prioridad: 'critica',
        fecha: new Date().toISOString(),
      });
    }
  });

  // Alerta de adeudos altos
  const adeudosAltos = data.clientes.filter((c) => c.pendiente > 300000);
  if (adeudosAltos.length > 0) {
    alerts.push({
      id: 'adeudos-altos',
      tipo: 'warning',
      titulo: 'Adeudos Elevados',
      mensaje: `${adeudosAltos.length} clientes con adeudos superiores a $300,000`,
      prioridad: 'media',
      fecha: new Date().toISOString(),
    });
  }

  return alerts.sort((a, b) => {
    const prioridades = { critica: 3, alta: 2, media: 1, baja: 0 };
    return prioridades[b.prioridad] - prioridades[a.prioridad];
  });
};

/**
 * Exportar datos para backup
 */
export const exportDataBackup = () => {
  const dataStr = JSON.stringify(flowDistributorData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `flowdistributor-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Obtener datos para gráficos del dashboard
 */
export const getDashboardChartData = () => {
  const data = flowDistributorData;

  // Distribución de capital por banco
  const bankDistribution = Object.entries(data.bancos).map(([_key, banco]) => ({
    name: banco.nombre,
    value: banco.capitalActual,
    color: banco.color,
  }));

  // Evolución de ventas (últimos 30 días)
  const ventasPorDia = {};
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  data.ventas
    .filter((v) => new Date(v.fecha) >= thirtyDaysAgo)
    .forEach((venta) => {
      const fecha = new Date(venta.fecha).toISOString().split('T')[0];
      ventasPorDia[fecha] = (ventasPorDia[fecha] || 0) + venta.ingreso;
    });

  const salesTrend = Object.entries(ventasPorDia)
    .map(([fecha, total]) => ({
      fecha,
      ventas: total,
    }))
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  // Top 10 clientes por adeudo
  const topClientes = data.clientes
    .filter((c) => c.pendiente > 0)
    .sort((a, b) => b.pendiente - a.pendiente)
    .slice(0, 10)
    .map((c) => ({
      nombre: c.nombre,
      adeudo: c.pendiente,
    }));

  return {
    bankDistribution,
    salesTrend,
    topClientes,
  };
};

// Exportar todo
export default {
  useFlowDistributorData,
  getInitialData,
  getMetricsSummary,
  getBanksList,
  getRecentTransactions,
  getCurrentMonthSales,
  getClientesConAdeudo,
  getDistribuidoresConAdeudo,
  getSystemAlerts,
  exportDataBackup,
  getDashboardChartData,
};
