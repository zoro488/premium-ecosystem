/**
 * PROFIT - DATOS REALES DEL EXCEL
 */

export interface MovimientoProfit {
  id: string;
  fecha: Date;
  tipo: 'Ingreso' | 'Egreso';
  concepto: string;
  monto: number;
  categoria: string;
  observaciones?: string;
}

export const movimientosProfit: MovimientoProfit[] = [
  // Datos de ejemplo - completar con datos reales del Excel
];

// Balance RF Actual según Excel (ALTO)
export const balanceProfit = {
  rfActual: 12577748, // Del panel RF Actual
};

export const calcularBalanceProfit = () => {
  const ingresos = movimientosProfit
    .filter((m) => m.tipo === 'Ingreso')
    .reduce((sum, m) => sum + m.monto, 0);

  const egresos = movimientosProfit
    .filter((m) => m.tipo === 'Egreso')
    .reduce((sum, m) => sum + m.monto, 0);

  return {
    totalIngresos: ingresos,
    totalEgresos: egresos,
    balance: ingresos - egresos,
    movimientos: movimientosProfit.length,
  };
};
