/**
 * Script para crear un archivo Excel de prueba
 * Estructura simplificada para tests E2E
 */
const XLSX = require('xlsx');
const path = require('path');

// Crear workbook
const wb = XLSX.utils.book_new();

// ========================================
// SHEET 1: Bancos (Azteca)
// ========================================
const aztecaData = [
  ['Ingresos', null, null, null, null, null, null, 'RF Actual', null, 'Gastos'],
  [150000, null, null, null, null, null, null, 100000, null, 50000],
  ['Fecha', 'Cliente', 'Ingreso', 'TC', 'Dolares', 'Observaciones', 'Concepto', 'Fecha', 'Corte', 'Fecha', 'Origen del Gastos o Abono', 'Gasto', 'Destino', 'A', 'Observaciones', 'Concepto'],
  ['2025-01-01', 'Cliente A', 50000, 1, 50000, 'Test', 'Venta', '2025-01-02', 'Corte 1', '2025-01-03', 'Proveedor X', 20000, 'Destino A', 'A', 'Test gasto', 'Compra'],
  ['2025-01-05', 'Cliente B', 100000, 1, 100000, 'Test 2', 'Venta', '2025-01-06', 'Corte 2', '2025-01-07', 'Proveedor Y', 30000, 'Destino B', 'B', 'Test gasto 2', 'Compra'],
];

const wsAzteca = XLSX.utils.aoa_to_sheet(aztecaData);
XLSX.utils.book_append_sheet(wb, wsAzteca, 'Azteca');

// ========================================
// SHEET 2: Bancos (Leftie)
// ========================================
const leftieData = [
  ['Ingresos', null, null, null, null, null, null, null, 'RF Actual', null, 'Gastos'],
  [200000, null, null, null, null, null, null, null, 150000, null, 50000],
  ['Fecha', 'Cliente', 'Ingreso', 'TC', 'Pesos', 'Destino', 'Concepto', 'Observaciones', 'Fecha', 'Corte', 'Fecha', 'Origen del Gastos o Abono', 'Gasto', 'TC', 'Dolares', 'Destino', 'Concepto', 'Observaciones'],
  ['2025-01-01', 'Cliente C', 80000, 1, 80000, 'Destino C', 'Venta', 'Test', '2025-01-02', 'Corte 1', '2025-01-03', 'Proveedor Z', 25000, 1, 25000, 'Destino D', 'Compra', 'Test gasto'],
  ['2025-01-05', 'Cliente D', 120000, 1, 120000, 'Destino E', 'Venta', 'Test 2', '2025-01-06', 'Corte 2', '2025-01-07', 'Proveedor W', 25000, 1, 25000, 'Destino F', 'Compra', 'Test gasto 2'],
];

const wsLeftie = XLSX.utils.aoa_to_sheet(leftieData);
XLSX.utils.book_append_sheet(wb, wsLeftie, 'Leftie');

// ========================================
// SHEET 3: Bancos (Profit)
// ========================================
const profitData = [
  ['Ingresos', null, null, null, null, null, null, null, 'RF Actual', null, 'Gastos'],
  [300000, null, null, null, null, null, null, null, 280000, null, 20000],
  ['Fecha', 'Cliente', 'Ingreso', 'TC', 'Dolares', 'Destino', 'Concepto', 'Observaciones', 'Fecha', 'Corte', 'Fecha', 'Cliente', 'Lugar', 'Serie', 'Gasto', 'Porcentaje', 'Gasto Total', 'Observaciones'],
  ['2025-01-01', 'Cliente E', 150000, 1, 150000, 'Destino G', 'Venta', 'Test', '2025-01-02', 'Corte 1', '2025-01-03', 'Cliente F', 'Lugar A', 'S1', 10000, 5, 10500, 'Test gasto'],
  ['2025-01-05', 'Cliente G', 150000, 1, 150000, 'Destino H', 'Venta', 'Test 2', '2025-01-06', 'Corte 2', '2025-01-07', 'Cliente H', 'Lugar B', 'S2', 10000, 5, 10500, 'Test gasto 2'],
];

const wsProfit = XLSX.utils.aoa_to_sheet(profitData);
XLSX.utils.book_append_sheet(wb, wsProfit, 'Profit');

// ========================================
// SHEET 4: Distribuidores (simplified)
// ========================================
const distribuidoresData = [
  ['OC', 'Fecha', 'Origen', 'Cantidad', 'Costo Distribuidor', 'Costo Transporte', 'Costo Por Unidad', 'Stock Actual', 'Costo Total', 'Pago a Distribuidor', 'Deuda', null, 'Distribuidores', 'Costo total'],
  ['OC001', '2025-01-01', 'Proveedor A', 100, 5000, 500, 55, 80, 5500, 4000, 1500, null, 'Proveedor A', 5500],
  ['OC002', '2025-01-05', 'Proveedor B', 200, 10000, 1000, 55, 150, 11000, 8000, 3000, null, 'Proveedor B', 11000],
];

const wsDistribuidores = XLSX.utils.aoa_to_sheet(distribuidoresData);
XLSX.utils.book_append_sheet(wb, wsDistribuidores, 'Distribuidores');

// ========================================
// SHEET 5: Control_Maestro (simplified)
// ========================================
const controlMaestroData = [
  ['Fecha', 'Concepto', 'Entrada', 'Salida', 'Saldo'],
  ['2025-01-01', 'Ingreso inicial', 100000, 0, 100000],
  ['2025-01-05', 'Compra', 0, 30000, 70000],
];

const wsControlMaestro = XLSX.utils.aoa_to_sheet(controlMaestroData);
XLSX.utils.book_append_sheet(wb, wsControlMaestro, 'Control_Maestro');

// ========================================
// SHEET 6: Almacen_Monte (simplified)
// ========================================
const almacenMonteData = [
  ['Ingresos', null, null, null, null, 'RF Actual', null, 'Salidas'],
  [100, null, null, null, null, 80, null, 20],
  ['Fecha', 'OC', 'Entrada', 'Precio', 'Costo', 'Fecha', 'Cliente', 'Salida', 'Precio', 'Venta'],
  ['2025-01-01', 'OC001', 50, 55, 2750, '2025-01-02', 'Cliente A', 10, 60, 600],
  ['2025-01-05', 'OC002', 50, 55, 2750, '2025-01-06', 'Cliente B', 10, 60, 600],
];

const wsAlmacenMonte = XLSX.utils.aoa_to_sheet(almacenMonteData);
XLSX.utils.book_append_sheet(wb, wsAlmacenMonte, 'Almacen_Monte');

// ========================================
// SHEET 7: Clientes (simplified)
// ========================================
const clientesData = [
  ['Cliente', 'Deuda', 'Debe', 'Pagos', 'Balance'],
  ['Cliente A', 50000, 10000, 40000, 0],
  ['Cliente B', 100000, 20000, 80000, 0],
];

const wsClientes = XLSX.utils.aoa_to_sheet(clientesData);
XLSX.utils.book_append_sheet(wb, wsClientes, 'Clientes');

// ========================================
// SHEET 8: DATA (simplified)
// ========================================
const dataData = [
  ['Concepto', 'Valor'],
  ['Total Ingresos', 650000],
  ['Total Gastos', 120000],
  ['Capital Total', 530000],
];

const wsData = XLSX.utils.aoa_to_sheet(dataData);
XLSX.utils.book_append_sheet(wb, wsData, 'DATA');

// Guardar archivo
const outputPath = path.join(__dirname, 'sample.xlsx');
XLSX.writeFile(wb, outputPath);

console.log(`✅ Archivo Excel de prueba creado: ${outputPath}`);
console.log(`📊 Hojas: ${wb.SheetNames.join(', ')}`);
console.log(`💰 Total Capital Esperado: 530,000 (Azteca: 100,000 + Leftie: 150,000 + Profit: 280,000)`);
