/**
 * BÓVEDA USA - DATOS REALES DEL EXCEL
 * Sistema de control financiero Bóveda USA
 */

export interface MovimientoBovedaUSA {
  id: string;
  fecha: Date;
  tipo: 'Ingreso' | 'Gasto';
  concepto: string;
  monto: number;
  origen?: string;
  destino?: string;
  observaciones?: string;
}

// Datos de ejemplo - se completarán con datos reales del Excel
export const movimientosBovedaUSA: MovimientoBovedaUSA[] = [
  {
    id: 'BUSA001',
    fecha: new Date('2025-08-01'),
    tipo: 'Ingreso',
    concepto: 'Transferencia inicial',
    monto: 50000,
    origen: 'Capital inicial',
    observaciones: 'Apertura cuenta',
  },
  {
    id: 'BUSA002',
    fecha: new Date('2025-08-15'),
    tipo: 'Gasto',
    concepto: 'Pago distribuidor USA',
    monto: 15000,
    destino: 'Proveedor USA',
    observaciones: '',
  },
  {
    id: 'BUSA003',
    fecha: new Date('2025-08-20'),
    tipo: 'Ingreso',
    concepto: 'Venta exportación',
    monto: 85000,
    origen: 'Cliente USA',
    observaciones: '',
  },
  {
    id: 'BUSA004',
    fecha: new Date('2025-08-25'),
    tipo: 'Gasto',
    concepto: 'Gastos operativos',
    monto: 8000,
    destino: 'Operación',
    observaciones: '',
  },
  {
    id: 'BUSA005',
    fecha: new Date('2025-09-01'),
    tipo: 'Ingreso',
    concepto: 'Transferencia',
    monto: 25000,
    origen: 'Bóveda Monte',
    observaciones: '',
  },
];

// Balance RF Actual según Excel
export const balanceBovedaUSA = {
  rfActual: 128005, // Del panel RF Actual
  totalIngresos: 0,
  totalGastos: 0,
  movimientos: 0,
};

// Calcular totales
export const calcularBalanceBovedaUSA = () => {
  const ingresos = movimientosBovedaUSA
    .filter((m) => m.tipo === 'Ingreso')
    .reduce((sum, m) => sum + m.monto, 0);

  const gastos = movimientosBovedaUSA
    .filter((m) => m.tipo === 'Gasto')
    .reduce((sum, m) => sum + m.monto, 0);

  return {
    totalIngresos: ingresos,
    totalGastos: gastos,
    balance: ingresos - gastos,
    movimientos: movimientosBovedaUSA.length,
  };
};
