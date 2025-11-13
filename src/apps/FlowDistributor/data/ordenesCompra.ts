/**
 * ÓRDENES DE COMPRA
 * Datos reales del Excel - Tabla Distribuidores
 */

export interface OrdenCompra {
  oc: string;
  fecha: Date;
  origen: string;
  cantidad: number;
  costoDistribuidor: number;
  costoTransporte: number;
  costoPorUnidad: number;
  stockActual: number;
  costoTotal: number;
  pagoDistribuidor: number;
  deuda: number;
}

export const ordenesCompraData: OrdenCompra[] = [
  {
    oc: 'OC0001',
    fecha: new Date('2025-08-25'),
    origen: 'Q-MAYA',
    cantidad: 423,
    costoDistribuidor: 6100,
    costoTransporte: 200,
    costoPorUnidad: 6300,
    stockActual: 0,
    costoTotal: 2664900,
    pagoDistribuidor: 0,
    deuda: 0,
  },
  {
    oc: 'OC0002',
    fecha: new Date('2025-08-25'),
    origen: 'Q-MAYA',
    cantidad: 32,
    costoDistribuidor: 6100,
    costoTransporte: 200,
    costoPorUnidad: 6300,
    stockActual: 0,
    costoTotal: 201600,
    pagoDistribuidor: 0,
    deuda: 0,
  },
  {
    oc: 'OC0003',
    fecha: new Date('2025-08-25'),
    origen: 'A/X🌶️🦀',
    cantidad: 33,
    costoDistribuidor: 6100,
    costoTransporte: 200,
    costoPorUnidad: 6300,
    stockActual: 0,
    costoTotal: 207900,
    pagoDistribuidor: 0,
    deuda: 0,
  },
  {
    oc: 'OC0004',
    fecha: new Date('2025-08-30'),
    origen: 'PACMAN',
    cantidad: 487,
    costoDistribuidor: 6100,
    costoTransporte: 200,
    costoPorUnidad: 6300,
    stockActual: 0,
    costoTotal: 3068100,
    pagoDistribuidor: 0,
    deuda: 0,
  },
  {
    oc: 'OC0005',
    fecha: new Date('2025-09-06'),
    origen: 'Q-MAYA',
    cantidad: 513,
    costoDistribuidor: 6100,
    costoTransporte: 200,
    costoPorUnidad: 6300,
    stockActual: 0,
    costoTotal: 3231900,
    pagoDistribuidor: 0,
    deuda: 0,
  },
  {
    oc: 'OC0006',
    fecha: new Date('2025-09-09'),
    origen: 'CH-MONTE',
    cantidad: 100,
    costoDistribuidor: 6300,
    costoTransporte: 0,
    costoPorUnidad: 6300,
    stockActual: 0,
    costoTotal: 630000,
    pagoDistribuidor: 953100,
    deuda: 0,
  },
  {
    oc: 'OC0007',
    fecha: new Date('2025-09-29'),
    origen: 'VALLE-MONTE',
    cantidad: 20,
    costoDistribuidor: 7000,
    costoTransporte: 0,
    costoPorUnidad: 7000,
    stockActual: 0,
    costoTotal: 140000,
    pagoDistribuidor: 0,
    deuda: 0,
  },
  {
    oc: 'OC0008',
    fecha: new Date('2025-10-05'),
    origen: 'PACMAN',
    cantidad: 488,
    costoDistribuidor: 6100,
    costoTransporte: 200,
    costoPorUnidad: 6300,
    stockActual: 0,
    costoTotal: 3074400,
    pagoDistribuidor: 0,
    deuda: 0,
  },
  {
    oc: 'OC0009',
    fecha: new Date('2025-10-05'),
    origen: 'Q-MAYA-MP',
    cantidad: 200,
    costoDistribuidor: 6100,
    costoTransporte: 200,
    costoPorUnidad: 6300,
    stockActual: 0,
    costoTotal: 1260000,
    pagoDistribuidor: 0,
    deuda: 0,
  },
];

// Totales por distribuidor
export const totalesDistribuidores = {
  PACMAN: {
    costoTotal: 6142500,
    abonos: 0,
    pendiente: 6142500,
  },
  'Q-MAYA': {
    costoTotal: 6098400,
    abonos: 0,
    pendiente: 6098400,
  },
};
