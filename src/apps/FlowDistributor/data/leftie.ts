/**
 * LEFTIE - DATOS REALES DEL EXCEL
 */

export interface MovimientoLeftie {
  id: string;
  fecha: Date;
  tipo: 'Ingreso' | 'Gasto';
  concepto: string;
  monto: number;
  observaciones?: string;
}

export const movimientosLeftie: MovimientoLeftie[] = [
  // Datos de ejemplo - completar con datos reales del Excel
];

// Balance RF Actual según Excel
export const balanceLeftie = {
  rfActual: 45844, // Del panel RF Actual
};

export const calcularBalanceLeftie = () => {
  const ingresos = movimientosLeftie
    .filter((m) => m.tipo === 'Ingreso')
    .reduce((sum, m) => sum + m.monto, 0);

  const gastos = movimientosLeftie
    .filter((m) => m.tipo === 'Gasto')
    .reduce((sum, m) => sum + m.monto, 0);

  return {
    totalIngresos: ingresos,
    totalGastos: gastos,
    balance: ingresos - gastos,
    movimientos: movimientosLeftie.length,
  };
};
