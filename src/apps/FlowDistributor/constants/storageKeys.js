/**
 * 🔑 STORAGE KEYS PARA FLOWDISTRIBUTOR
 * Constantes para localStorage y persistencia de datos
 */

export const STORAGE_KEYS = {
  // Órdenes de Compra
  FLOW_ORDENES: 'flowdistributor_ordenes_compra',

  // Distribuidores
  FLOW_DISTRIBUIDORES: 'flowdistributor_distribuidores',

  // Bancos y Cuentas
  FLOW_BANCOS: 'flowdistributor_bancos',

  // Ventas (Control Maestro de Ingresos)
  FLOW_VENTAS: 'flowdistributor_ventas',
  VENTAS_LOCAL: 'flowdistributor_ventas_local',

  // Clientes
  FLOW_CLIENTES: 'flowdistributor_clientes',

  // Almacén
  FLOW_ALMACEN: 'flowdistributor_almacen',
  ALMACEN_ORDENES: 'flowdistributor_almacen_ordenes',
  ALMACEN_SALIDAS: 'flowdistributor_almacen_salidas',
  ALMACEN_CORTES: 'flowdistributor_almacen_cortes',

  // Bóveda Monte
  FLOW_BOVEDA_MONTE: 'flowdistributor_boveda_monte',
  FLOW_MOVIMIENTOS_BOVEDA: 'flowdistributor_movimientos_boveda',
  BOVEDA_INGRESOS: 'flowdistributor_boveda_ingresos',
  BOVEDA_GASTOS: 'flowdistributor_boveda_gastos',
  BOVEDA_CORTES: 'flowdistributor_boveda_cortes',
  BOVEDA_TRANSFERENCIAS: 'flowdistributor_boveda_transferencias',

  // Bóveda USA
  BOVEDA_USA_INGRESOS: 'flowdistributor_boveda_usa_ingresos',
  BOVEDA_USA_GASTOS: 'flowdistributor_boveda_usa_gastos',
  BOVEDA_USA_CORTES: 'flowdistributor_boveda_usa_cortes',
  BOVEDA_USA_TRANSFERENCIAS: 'flowdistributor_boveda_usa_transferencias',

  // Banco Azteca
  AZTECA_INGRESOS: 'flowdistributor_azteca_ingresos',
  AZTECA_GASTOS: 'flowdistributor_azteca_gastos',
  AZTECA_CORTES: 'flowdistributor_azteca_cortes',
  AZTECA_TRANSFERENCIAS: 'flowdistributor_azteca_transferencias',

  // Banco Leftie
  LEFTIE_INGRESOS: 'flowdistributor_leftie_ingresos',
  LEFTIE_GASTOS: 'flowdistributor_leftie_gastos',
  LEFTIE_CORTES: 'flowdistributor_leftie_cortes',
  LEFTIE_TRANSFERENCIAS: 'flowdistributor_leftie_transferencias',

  // Banco Profit
  PROFIT_INGRESOS: 'flowdistributor_profit_ingresos',
  PROFIT_GASTOS: 'flowdistributor_profit_gastos',
  PROFIT_CORTES: 'flowdistributor_profit_cortes',
  PROFIT_TRANSFERENCIAS: 'flowdistributor_profit_transferencias',

  // Gastos y Abonos (GYA)
  FLOW_GYA: 'flowdistributor_gastos_abonos',
  FLOW_TRANSACCIONES_GYA: 'flowdistributor_transacciones_gya',
  MOVIMIENTOS_GYA: 'flowdistributor_gya',

  // NUEVOS PANELES PREMIUM

  // Utilidades
  FLOW_UTILIDADES: 'flowdistributor_utilidades',
  GASTOS_UTILIDADES: 'flowdistributor_gastos_utilidades',
  RF_ACTUAL_UTILIDADES: 'flowdistributor_rf_actual_utilidades',
  UTILIDADES_METRICAS: 'flowdistributor_metricas_utilidades',

  // Fletes
  FLOW_FLETES: 'flowdistributor_fletes',
  GASTOS_FLETES: 'flowdistributor_gastos_fletes',
  FLETES_INGRESOS: 'flowdistributor_fletes_ingresos',
  FLETES_GASTOS: 'flowdistributor_fletes_gastos',
  FLETES_METRICAS: 'flowdistributor_metricas_fletes',
  RF_ACTUAL_FLETES: 'flowdistributor_rf_actual',

  // Clientes - Estados y Pagos
  CLIENTES_ESTADOS: 'flowdistributor_clientes_estados',
  CLIENTES_PAGOS: 'flowdistributor_clientes_pagos',
  CLIENTES_METRICAS: 'flowdistributor_clientes_metricas',

  // Bancos adicionales
  FLOW_AZTECA: 'flowdistributor_azteca',
  FLOW_LEFTIE: 'flowdistributor_leftie',
  FLOW_PROFIT: 'flowdistributor_profit',

  // Configuración
  FLOW_CONFIG: 'flowdistributor_config',

  // UI State
  FLOW_UI_STATE: 'flowdistributor_ui_state',
};

export default STORAGE_KEYS;
