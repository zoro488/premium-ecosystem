/**
 * UTILIDADES - DATOS REALES DEL EXCEL
 */

export interface MovimientoUtilidad {
  id: string;
  fecha: Date;
  concepto: string;
  monto: number;
  tipo: 'Ingreso' | 'Gasto';
  categoria: string;
  observaciones?: string;
}

export const movimientosUtilidades: MovimientoUtilidad[] = [
  // Datos de ejemplo - completar con datos reales del Excel
];

// Balance RF Actual según Excel
export const balanceUtilidades = {
  rfActual: 102658, // Del panel RF Actual
};

export const calcularBalanceUtilidades = () => {
  const ingresos = movimientosUtilidades
    .filter((m) => m.tipo === 'Ingreso')
    .reduce((sum, m) => sum + m.monto, 0);

  const gastos = movimientosUtilidades
    .filter((m) => m.tipo === 'Gasto')
    .reduce((sum, m) => sum + m.monto, 0);

  return {
    totalIngresos: ingresos,
    totalGastos: gastos,
    balance: ingresos - gastos,
    movimientos: movimientosUtilidades.length,
  };
};
