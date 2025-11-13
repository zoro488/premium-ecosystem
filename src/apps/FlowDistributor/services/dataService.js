/**
 * 🗄️ SERVICIO DE DATOS UNIFICADOS PREMIUM
 * Carga y gestiona todos los datos reales del Excel unificado
 */
import { useCallback, useEffect, useState } from 'react';

import baseDatosUnificada from '../data/BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json';
import panelAlmacenMonteData from '../data/panel-almacen-monte-manual.json';
import panelAztecaData from '../data/panel-azteca-manual.json';
import panelBovedaMonteData from '../data/panel-boveda-monte-manual.json';
import panelBovedaUSAData from '../data/panel-boveda-usa-manual.json';
import panelClientesData from '../data/panel-clientes-manual.json';
import panelDashboardData from '../data/panel-dashboard-manual.json';
import panelFletesData from '../data/panel-fletes-manual.json';
import panelGastosAbonosData from '../data/panel-gastos-abonos-manual.json';
import panelLeftieData from '../data/panel-leftie-manual.json';
import panelOrdenesCompraData from '../data/panel-ordenes-compra-manual.json';
import panelProfitData from '../data/panel-profit-manual.json';
import panelUtilidadesData from '../data/panel-utilidades-manual.json';
import panelVentasLocalData from '../data/panel-ventas-local-manual.json';

// ============================================================================
// TIPOS DE DATOS
// ============================================================================

export const DataTypes = {
  ORDENES_COMPRA: 'ordenesCompra',
  PROFIT: 'profit',
  UTILIDADES: 'utilidades',
  VENTAS_LOCALES: 'ventasLocales',
  ALMACEN_MONTE: 'almacenMonte',
  AZTECA: 'azteca',
  BOVEDA_MONTE: 'bovedaMonte',
  BOVEDA_USA: 'bovedaUSA',
  CLIENTES: 'clientes',
  DASHBOARD: 'dashboard',
  FLETES: 'fleteSur',
  GASTOS_ABONOS: 'gastosAbonos',
  LEFTIE: 'leftie',
};

// ============================================================================
// SERVICIO PRINCIPAL
// ============================================================================

class FlowDistributorDataService {
  constructor() {
    this.data = {
      [DataTypes.ORDENES_COMPRA]: panelOrdenesCompraData,
      [DataTypes.PROFIT]: panelProfitData,
      [DataTypes.UTILIDADES]: panelUtilidadesData,
      [DataTypes.VENTAS_LOCALES]: panelVentasLocalData,
      [DataTypes.ALMACEN_MONTE]: panelAlmacenMonteData,
      [DataTypes.AZTECA]: panelAztecaData,
      [DataTypes.BOVEDA_MONTE]: panelBovedaMonteData,
      [DataTypes.BOVEDA_USA]: panelBovedaUSAData,
      [DataTypes.CLIENTES]: panelClientesData,
      [DataTypes.DASHBOARD]: panelDashboardData,
      [DataTypes.FLETES]: panelFletesData,
      [DataTypes.GASTOS_ABONOS]: panelGastosAbonosData,
      [DataTypes.LEFTIE]: panelLeftieData,
      unified: baseDatosUnificada,
    };

    this.cache = new Map();
    this.subscribers = new Map();
  }

  // ============================================================================
  // MÉTODOS DE OBTENCIÓN DE DATOS
  // ============================================================================

  /**
   * Obtiene datos de un panel específico
   */
  getData(type) {
    if (this.cache.has(type)) {
      return this.cache.get(type);
    }

    const data = this.processData(type);
    this.cache.set(type, data);
    return data;
  }

  /**
   * Obtiene todos los datos unificados
   */
  getAllData() {
    return this.data.unified;
  }

  /**
   * Procesa y normaliza los datos según el tipo
   */
  processData(type) {
    const rawData = this.data[type];
    if (!rawData) return null;

    switch (type) {
      case DataTypes.ORDENES_COMPRA:
        return this.processOrdenesCompra(rawData);
      case DataTypes.PROFIT:
        return this.processProfit(rawData);
      case DataTypes.UTILIDADES:
        return this.processUtilidades(rawData);
      case DataTypes.VENTAS_LOCALES:
        return this.processVentasLocales(rawData);
      case DataTypes.ALMACEN_MONTE:
        return this.processAlmacenMonte(rawData);
      case DataTypes.AZTECA:
        return this.processAzteca(rawData);
      case DataTypes.BOVEDA_MONTE:
        return this.processBovedaMonte(rawData);
      case DataTypes.BOVEDA_USA:
        return this.processBovedaUSA(rawData);
      case DataTypes.CLIENTES:
        return this.processClientes(rawData);
      case DataTypes.DASHBOARD:
        return this.processDashboard(rawData);
      case DataTypes.FLETES:
        return this.processFletes(rawData);
      case DataTypes.GASTOS_ABONOS:
        return this.processGastosAbonos(rawData);
      case DataTypes.LEFTIE:
        return this.processLeftie(rawData);
      default:
        return rawData;
    }
  }

  // ============================================================================
  // PROCESADORES ESPECÍFICOS
  // ============================================================================

  processOrdenesCompra(data) {
    return {
      ...data.distribuidores,
      statistics: this.calculateOrdenesCompraStats(data.distribuidores.ordenesCompra || []),
      processed: true,
      lastUpdate: new Date().toISOString(),
    };
  }

  processProfit(data) {
    const profit = data.profit || {};
    return {
      ...profit,
      statistics: this.calculateFinancialStats(profit.ingresosList || [], profit.gastosList || []),
      balance: (profit.ingresos || 0) - (profit.gastos || 0),
      processed: true,
      lastUpdate: new Date().toISOString(),
    };
  }

  processUtilidades(data) {
    const utilidades = data.utilidades || {};
    return {
      ...utilidades,
      statistics: this.calculateFinancialStats(
        utilidades.ingresosList || [],
        utilidades.gastosList || []
      ),
      balance: (utilidades.ingresos || 0) - (utilidades.gastos || 0),
      processed: true,
      lastUpdate: new Date().toISOString(),
    };
  }

  processVentasLocales(data) {
    return {
      ventas: data.ventasLocal || [],
      statistics: this.calculateVentasStats(data.ventasLocal || []),
      processed: true,
      lastUpdate: new Date().toISOString(),
    };
  }

  processAlmacenMonte(data) {
    const almacen = data.almacenMonte || {};
    return {
      ...almacen,
      statistics: this.calculateAlmacenStats(almacen),
      inventario: almacen.rfActual || 0,
      processed: true,
      lastUpdate: new Date().toISOString(),
    };
  }

  processAzteca(data) {
    const azteca = data.azteca || {};
    return {
      ...azteca,
      statistics: this.calculateFinancialStats(azteca.ingresosList || [], azteca.gastosList || []),
      balance: azteca.rfActual || 0,
      processed: true,
      lastUpdate: new Date().toISOString(),
    };
  }

  processBovedaMonte(data) {
    const boveda = data.bovedaMonte || {};
    return {
      ...boveda,
      statistics: this.calculateFinancialStats(boveda.ingresosList || [], boveda.gastosList || []),
      balance: boveda.rfActual || 0,
      processed: true,
      lastUpdate: new Date().toISOString(),
    };
  }

  processBovedaUSA(data) {
    const boveda = data.bovedaUsa || {};
    return {
      ...boveda,
      statistics: this.calculateFinancialStats(boveda.ingresosList || [], boveda.gastosList || []),
      balance: boveda.rfActual || 0,
      processed: true,
      lastUpdate: new Date().toISOString(),
    };
  }

  processClientes(data) {
    return {
      clientes: data.clientes || [],
      statistics: this.calculateClientesStats(data.clientes || []),
      processed: true,
      lastUpdate: new Date().toISOString(),
    };
  }

  processDashboard(data) {
    const dashboard = data.dashboard || {};
    return {
      ...dashboard,
      kpis: this.calculateDashboardKPIs(dashboard),
      processed: true,
      lastUpdate: new Date().toISOString(),
    };
  }

  processFletes(data) {
    const fletes = data.fleteSur || {};
    return {
      ...fletes,
      statistics: this.calculateFletesStats(fletes),
      balance: fletes.rfActual || 0,
      processed: true,
      lastUpdate: new Date().toISOString(),
    };
  }

  processGastosAbonos(data) {
    return {
      registros: data.gastosAbonos || [],
      statistics: this.calculateGastosAbonosStats(data.gastosAbonos || []),
      processed: true,
      lastUpdate: new Date().toISOString(),
    };
  }

  processLeftie(data) {
    const leftie = data.leftie || {};
    return {
      ...leftie,
      statistics: this.calculateFinancialStats(leftie.ingresosList || [], leftie.gastosList || []),
      balance: leftie.rfActual || 0,
      processed: true,
      lastUpdate: new Date().toISOString(),
    };
  }

  // ============================================================================
  // CALCULADORES DE ESTADÍSTICAS
  // ============================================================================

  calculateOrdenesCompraStats(ordenes) {
    const total = ordenes.length;
    const totalCosto = ordenes.reduce((sum, orden) => sum + (orden.costoTotal || 0), 0);
    const totalCantidad = ordenes.reduce((sum, orden) => sum + (orden.cantidad || 0), 0);
    const pendientes = ordenes.filter((orden) => (orden.stockActual || 0) > 0).length;

    return {
      total,
      totalCosto,
      totalCantidad,
      pendientes,
      promedioCosto: total > 0 ? totalCosto / total : 0,
      promedioUnidades: total > 0 ? totalCantidad / total : 0,
    };
  }

  calculateFinancialStats(ingresos, gastos) {
    const totalIngresos = ingresos.reduce(
      (sum, item) => sum + (item.ingreso || item.monto || 0),
      0
    );
    const totalGastos = gastos.reduce((sum, item) => sum + (item.gasto || item.monto || 0), 0);
    const balance = totalIngresos - totalGastos;

    return {
      totalIngresos,
      totalGastos,
      balance,
      transacciones: ingresos.length + gastos.length,
      promedioIngreso: ingresos.length > 0 ? totalIngresos / ingresos.length : 0,
      promedioGasto: gastos.length > 0 ? totalGastos / gastos.length : 0,
    };
  }

  calculateVentasStats(ventas) {
    const total = ventas.length;
    const totalIngresos = ventas.reduce((sum, venta) => sum + (venta.ingreso || 0), 0);
    const totalCantidad = ventas.reduce((sum, venta) => sum + (venta.cantidad || 0), 0);

    return {
      total,
      totalIngresos,
      totalCantidad,
      promedioVenta: total > 0 ? totalIngresos / total : 0,
      promedioUnidades: total > 0 ? totalCantidad / total : 0,
    };
  }

  calculateAlmacenStats(almacen) {
    const ingresos = almacen.ingresos || 0;
    const salidas = almacen.salida || 0;
    const stock = almacen.rfActual || 0;

    return {
      totalIngresos: ingresos,
      totalSalidas: salidas,
      stockActual: stock,
      rotacion: ingresos > 0 ? salidas / ingresos : 0,
      movimientos: (almacen.ordenesCompra?.length || 0) + (almacen.salidas?.length || 0),
    };
  }

  calculateClientesStats(clientes) {
    const total = clientes.length;
    const totalDeuda = clientes.reduce((sum, cliente) => sum + (cliente.deuda || 0), 0);
    const totalAbonos = clientes.reduce((sum, cliente) => sum + (cliente.abonos || 0), 0);
    const activos = clientes.filter((cliente) => (cliente.actual || 0) > 0).length;

    return {
      total,
      activos,
      totalDeuda,
      totalAbonos,
      promedioDeuda: total > 0 ? totalDeuda / total : 0,
      promedioAbonos: total > 0 ? totalAbonos / total : 0,
    };
  }

  calculateDashboardKPIs(dashboard) {
    const paneles = dashboard.paneles || [];
    const efectivo = paneles.filter((p) => p.tipo === 'efectivo');
    const inventario = paneles.filter((p) => p.tipo === 'inventario');

    return {
      totalEfectivo: efectivo.reduce((sum, p) => sum + (p.rfActual || 0), 0),
      totalInventario: inventario.reduce((sum, p) => sum + (p.rfActual || 0), 0),
      totalPaneles: paneles.length,
      panelesPositivos: paneles.filter((p) => (p.rfActual || 0) > 0).length,
      panelesNegativos: paneles.filter((p) => (p.rfActual || 0) < 0).length,
    };
  }

  calculateFletesStats(fletes) {
    const gastos = fletes.gastos || [];
    const ingresos = fletes.ingresosList || [];

    return {
      totalGastos: gastos.reduce((sum, g) => sum + (g.pesos || 0), 0),
      totalIngresos: ingresos.reduce((sum, i) => sum + (i.ingreso || 0), 0),
      totalFletes: gastos.length,
      balance: fletes.rfActual || 0,
    };
  }

  calculateGastosAbonosStats(registros) {
    const gastos = registros.filter((r) => r.tipo === 'Gasto');
    const abonos = registros.filter((r) => r.tipo === 'Abono');

    return {
      totalGastos: gastos.reduce((sum, g) => sum + (g.pesos || 0), 0),
      totalAbonos: abonos.reduce((sum, a) => sum + (a.pesos || 0), 0),
      totalRegistros: registros.length,
      balance:
        abonos.reduce((sum, a) => sum + (a.pesos || 0), 0) -
        gastos.reduce((sum, g) => sum + (g.pesos || 0), 0),
    };
  }

  // ============================================================================
  // MÉTODOS DE SUSCRIPCIÓN (PARA REACTIVIDAD)
  // ============================================================================

  subscribe(type, callback) {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, new Set());
    }
    this.subscribers.get(type).add(callback);

    // Retorna función para cancelar suscripción
    return () => {
      this.subscribers.get(type)?.delete(callback);
    };
  }

  notify(type, data) {
    this.subscribers.get(type)?.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in subscriber callback:', error);
      }
    });
  }

  // ============================================================================
  // MÉTODOS DE UTILIDAD
  // ============================================================================

  invalidateCache(type = null) {
    if (type) {
      this.cache.delete(type);
    } else {
      this.cache.clear();
    }
  }

  getMetadata() {
    return {
      availableTypes: Object.values(DataTypes),
      cacheSize: this.cache.size,
      subscribersCount: Array.from(this.subscribers.values()).reduce(
        (total, set) => total + set.size,
        0
      ),
      lastUpdate: new Date().toISOString(),
    };
  }
}

// ============================================================================
// INSTANCIA SINGLETON
// ============================================================================

export const dataService = new FlowDistributorDataService();

// ============================================================================
// HOOKS PARA REACT
// ============================================================================

export function useFlowDistributorData(type) {
  const [data, setData] = useState(() => dataService.getData(type));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = dataService.subscribe(type, (newData) => {
      setData(newData);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, [type]);

  const refetch = useCallback(() => {
    setLoading(true);
    try {
      dataService.invalidateCache(type);
      const newData = dataService.getData(type);
      setData(newData);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  return { data, loading, error, refetch };
}

export default dataService;
