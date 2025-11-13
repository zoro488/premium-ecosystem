/**
 * BANCO AZTECA - DATOS REALES DEL EXCEL
 */

export interface MovimientoAzteca {
  id: string;
  fecha: Date;
  tipo: 'Depósito' | 'Retiro' | 'Transferencia' | 'Cargo';
  concepto: string;
  monto: number;
  saldo: number;
  observaciones?: string;
}

export const movimientosAzteca: MovimientoAzteca[] = [
  // Datos de ejemplo - completar con datos reales del Excel
];

// Balance RF Actual según Excel (NEGATIVO)
export const balanceAzteca = {
  rfActual: -178714.88, // Del panel RF Actual
};

export const calcularBalanceAzteca = () => {
  const depositos = movimientosAzteca
    .filter((m) => m.tipo === 'Depósito')
    .reduce((sum, m) => sum + m.monto, 0);

  const retiros = movimientosAzteca
    .filter((m) => m.tipo === 'Retiro' || m.tipo === 'Cargo')
    .reduce((sum, m) => sum + m.monto, 0);

  return {
    totalDepositos: depositos,
    totalRetiros: retiros,
    balance: depositos - retiros,
    movimientos: movimientosAzteca.length,
  };
};
