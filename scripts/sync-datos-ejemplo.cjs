/**
 * Script para sincronizar archivos datosEjemplo* con excel_data.json
 */

const fs = require('fs');
const path = require('path');

// Ruta base
const base = path.join(__dirname, '..');
const excelDataPath = path.join(base, 'public', 'excel_data.json');
const datosDir = path.join(base, 'src', 'apps', 'FlowDistributor', 'data');

// Cargar Excel data
const excelData = JSON.parse(fs.readFileSync(excelDataPath, 'utf-8'));

console.log('🔄 Sincronizando archivos datosEjemplo* con excel_data.json\n');

// ============================================================================
// LEFTIE
// ============================================================================
console.log('📝 Actualizando datosEjemploLeftie.js...');
const leftieData = excelData.bancos?.leftie || {};
const leftieContent = `/**
 * 🏪 DATOS BANCO LEFTIE
 *
 * Banco enfocado en operaciones con Lamas
 * - Ingresos por ventas playa azul y monte
 * - Gastos principalmente transferencias
 * - Seguimiento de operaciones con clientes específicos
 *
 * SINCRONIZADO CON excel_data.json
 */
import excelData from '../../../../public/excel_data.json';
import { STORAGE_KEYS } from '../constants/storageKeys';

// Obtener datos directamente del Excel JSON
const leftieData = excelData.bancos?.leftie || {};

// ============================================================================
// 💰 INGRESOS BANCO LEFTIE (sincronizado con Excel)
// ============================================================================
export const INGRESOS_LEFTIE = (leftieData.ingresos || []).map((ing, index) => ({
  id: \`ING-LFT-\${String(index + 1).padStart(3, '0')}\`,
  fecha: ing.fecha,
  monto: ing.monto,
  concepto: ing.concepto || '',
  cliente: ing.origen || 'Sin clasificar',
  categoria: ing.origen === 'Lamas' ? 'Venta' : 'Abono',
  observaciones: '',
}));

// ============================================================================
// 💸 GASTOS BANCO LEFTIE (sincronizado con Excel)
// ============================================================================
export const GASTOS_LEFTIE = (leftieData.gastos || []).map((gasto, index) => ({
  id: \`GAS-LFT-\${String(index + 1).padStart(3, '0')}\`,
  fecha: gasto.fecha,
  monto: gasto.monto,
  descripcion: gasto.concepto || '',
  categoria: 'Transferencia',
  destino: gasto.destino || 'N/A',
  observaciones: gasto.observaciones || '',
}));

// ============================================================================
// 📈 RF ACTUAL CORTES
// ============================================================================
export const RF_ACTUAL_CORTES_LEFTIE = [];

// ============================================================================
// 💱 TRANSFERENCIAS
// ============================================================================
export const TRANSFERENCIAS_LEFTIE = [];

// ============================================================================
// 📊 FUNCIONES DE ANÁLISIS
// ============================================================================

export function calcularEstadisticasLeftie() {
  const totalIngresos = INGRESOS_LEFTIE.reduce((sum, ing) => sum + ing.monto, 0);
  const totalGastos = GASTOS_LEFTIE.reduce((sum, gas) => sum + gas.monto, 0);
  const saldoActual = totalIngresos - totalGastos;

  return {
    saldoActual,
    totalIngresos,
    totalGastos,
    ingresoPromedio: INGRESOS_LEFTIE.length > 0 ? totalIngresos / INGRESOS_LEFTIE.length : 0,
    gastoPromedio: GASTOS_LEFTIE.length > 0 ? totalGastos / GASTOS_LEFTIE.length : 0,
    transaccionesTotales: INGRESOS_LEFTIE.length + GASTOS_LEFTIE.length,
  };
}

export function obtenerUltimasTransaccionesLeftie(cantidad = 10) {
  const transacciones = [
    ...INGRESOS_LEFTIE.map((ing) => ({ ...ing, tipo: 'ingreso' })),
    ...GASTOS_LEFTIE.map((gas) => ({ ...gas, tipo: 'gasto' })),
  ];
  return transacciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, cantidad);
}

export function proyeccionFlujoLeftie(dias = 30) {
  const stats = calcularEstadisticasLeftie();
  const proyeccionDiaria = (stats.totalIngresos - stats.totalGastos) / 30;
  return Array.from({ length: dias }, (_, i) => ({
    dia: i + 1,
    proyectado: stats.saldoActual + proyeccionDiaria * i,
  }));
}

export function detectarAlertasLeftie() {
  const stats = calcularEstadisticasLeftie();
  const alertas = [];

  if (stats.saldoActual < 50000) {
    alertas.push({ tipo: 'warning', mensaje: 'Saldo bajo (< $50,000)' });
  }

  if (stats.gastoPromedio > stats.ingresoPromedio) {
    alertas.push({ tipo: 'danger', mensaje: 'Gastos promedio > Ingresos promedio' });
  }

  return alertas;
}

export default {
  INGRESOS: INGRESOS_LEFTIE,
  GASTOS: GASTOS_LEFTIE,
  RF_ACTUAL_CORTES: RF_ACTUAL_CORTES_LEFTIE,
  TRANSFERENCIAS: TRANSFERENCIAS_LEFTIE,
  calcularEstadisticas: calcularEstadisticasLeftie,
  obtenerUltimasTransacciones: obtenerUltimasTransaccionesLeftie,
  proyeccionFlujo: proyeccionFlujoLeftie,
  detectarAlertas: detectarAlertasLeftie,
};
`;

fs.writeFileSync(path.join(datosDir, 'datosEjemploLeftie.js'), leftieContent);
console.log('✓ datosEjemploLeftie.js actualizado');

// ============================================================================
// PROFIT
// ============================================================================
console.log('\n📝 Actualizando datosEjemploProfit.js...');
const profitData = excelData.bancos?.profit || {};
const profitContent = `/**
 * 💰 DATOS BANCO PROFIT
 *
 * Centro de utilidades del sistema
 * - Ingresos por utilidades de ventas
 * - Gastos operativos
 *
 * SINCRONIZADO CON excel_data.json
 */
import excelData from '../../../../public/excel_data.json';
import { STORAGE_KEYS } from '../constants/storageKeys';

// Obtener datos directamente del Excel JSON
const profitData = excelData.bancos?.profit || {};

// ============================================================================
// 💰 INGRESOS BANCO PROFIT (sincronizado con Excel)
// ============================================================================
export const INGRESOS_PROFIT = (profitData.ingresos || []).map((ing, index) => ({
  id: \`ING-PRF-\${String(index + 1).padStart(3, '0')}\`,
  fecha: ing.fecha,
  monto: ing.monto,
  concepto: ing.concepto || '',
  origen: ing.origen || 'Utilidad',
  categoria: 'Utilidad',
  observaciones: '',
}));

// ============================================================================
// 💸 GASTOS BANCO PROFIT (sincronizado con Excel)
// ============================================================================
export const GASTOS_PROFIT = (profitData.gastos || []).map((gasto, index) => ({
  id: \`GAS-PRF-\${String(index + 1).padStart(3, '0')}\`,
  fecha: gasto.fecha,
  monto: gasto.monto,
  descripcion: gasto.concepto || '',
  categoria: 'Gasto',
  destino: gasto.destino || 'N/A',
  observaciones: gasto.observaciones || '',
}));

// ============================================================================
// 📈 RF ACTUAL CORTES
// ============================================================================
export const RF_ACTUAL_CORTES_PROFIT = [];

// ============================================================================
// 💱 TRANSFERENCIAS
// ============================================================================
export const TRANSFERENCIAS_PROFIT = [];

// ============================================================================
// 📊 FUNCIONES DE ANÁLISIS
// ============================================================================

export function calcularEstadisticasProfit() {
  const totalIngresos = INGRESOS_PROFIT.reduce((sum, ing) => sum + ing.monto, 0);
  const totalGastos = GASTOS_PROFIT.reduce((sum, gas) => sum + gas.monto, 0);
  const saldoActual = totalIngresos - totalGastos;

  return {
    saldoActual,
    totalIngresos,
    totalGastos,
    utilidadNeta: saldoActual,
    margenUtilidad: totalIngresos > 0 ? (saldoActual / totalIngresos) * 100 : 0,
  };
}

export function obtenerUltimasTransaccionesProfit(cantidad = 10) {
  const transacciones = [
    ...INGRESOS_PROFIT.map((ing) => ({ ...ing, tipo: 'ingreso' })),
    ...GASTOS_PROFIT.map((gas) => ({ ...gas, tipo: 'gasto' })),
  ];
  return transacciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, cantidad);
}

export function proyeccionFlujoProfit(dias = 30) {
  const stats = calcularEstadisticasProfit();
  const proyeccionDiaria = stats.totalIngresos / 30;
  return Array.from({ length: dias }, (_, i) => ({
    dia: i + 1,
    proyectado: stats.saldoActual + proyeccionDiaria * i,
  }));
}

export function detectarAlertasProfit() {
  const stats = calcularEstadisticasProfit();
  const alertas = [];

  if (stats.margenUtilidad < 10) {
    alertas.push({ tipo: 'warning', mensaje: 'Margen de utilidad bajo (< 10%)' });
  }

  return alertas;
}

export default {
  INGRESOS: INGRESOS_PROFIT,
  GASTOS: GASTOS_PROFIT,
  RF_ACTUAL_CORTES: RF_ACTUAL_CORTES_PROFIT,
  TRANSFERENCIAS: TRANSFERENCIAS_PROFIT,
  calcularEstadisticas: calcularEstadisticasProfit,
  obtenerUltimasTransacciones: obtenerUltimasTransaccionesProfit,
  proyeccionFlujo: proyeccionFlujoProfit,
  detectarAlertas: detectarAlertasProfit,
};
`;

fs.writeFileSync(path.join(datosDir, 'datosEjemploProfit.js'), profitContent);
console.log('✓ datosEjemploProfit.js actualizado');

// ============================================================================
// BÓVEDA MONTE
// ============================================================================
console.log('\n📝 Actualizando datosEjemploBoveda.js...');
const bovedaMonteData = excelData.bancos?.bovedaMonte || {};
const bovedaContent = `/**
 * 🏦 DATOS EJEMPLO - BÓVEDA MONTE
 *
 * Sistema completo de gestión de capital para Bóveda Monte
 * Incluye: Ingresos automáticos de ventas, Gastos, RF Actual, Transferencias
 *
 * SINCRONIZADO CON excel_data.json
 */
import excelData from '../../../../public/excel_data.json';
import { STORAGE_KEYS } from '../constants/storageKeys';

// Obtener datos directamente del Excel JSON
const bovedaMonteData = excelData.bancos?.bovedaMonte || {};

// ============================================================================
// 💰 INGRESOS BÓVEDA MONTE (sincronizado con Excel)
// ============================================================================
export const INGRESOS_BOVEDA = (bovedaMonteData.ingresos || []).map((ing, index) => ({
  id: \`ING-\${String(index + 1).padStart(3, '0')}\`,
  fecha: ing.fecha,
  cliente: ing.origen || 'Sin clasificar',
  monto: ing.monto,
  concepto: ing.concepto || '',
  estadoVenta: 'Pagado Completo',
  montoAbonado: null,
  montoRestante: null,
  categoria: 'Venta Directa',
  metodoPago: 'Efectivo',
}));

// ============================================================================
// 💸 GASTOS BÓVEDA MONTE (sincronizado con Excel)
// ============================================================================
export const GASTOS_BOVEDA = (bovedaMonteData.gastos || []).map((gasto, index) => ({
  id: \`GAS-\${String(index + 1).padStart(3, '0')}\`,
  fecha: gasto.fecha,
  monto: gasto.monto,
  descripcion: gasto.concepto || '',
  categoria: 'Gasto Operativo',
  destino: gasto.destino || 'N/A',
  observaciones: gasto.observaciones || '',
}));

// ============================================================================
// 📈 RF ACTUAL CORTES
// ============================================================================
export const RF_ACTUAL_CORTES_BOVEDA = [];

// ============================================================================
// 💱 TRANSFERENCIAS
// ============================================================================
export const TRANSFERENCIAS_BOVEDA = [];

// ============================================================================
// 📊 FUNCIONES DE ANÁLISIS
// ============================================================================

export function calcularEstadisticasBoveda() {
  const totalIngresos = INGRESOS_BOVEDA.reduce((sum, ing) => sum + ing.monto, 0);
  const totalGastos = GASTOS_BOVEDA.reduce((sum, gas) => sum + gas.monto, 0);
  const capitalActual = totalIngresos - totalGastos;

  return {
    capitalActual,
    totalIngresos,
    totalGastos,
    ingresoPromedio: INGRESOS_BOVEDA.length > 0 ? totalIngresos / INGRESOS_BOVEDA.length : 0,
    gastoPromedio: GASTOS_BOVEDA.length > 0 ? totalGastos / GASTOS_BOVEDA.length : 0,
  };
}

export function obtenerUltimasTransacciones(cantidad = 10) {
  const transacciones = [
    ...INGRESOS_BOVEDA.map((ing) => ({ ...ing, tipo: 'ingreso' })),
    ...GASTOS_BOVEDA.map((gas) => ({ ...gas, tipo: 'gasto' })),
  ];
  return transacciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, cantidad);
}

export function proyeccionFlujo(dias = 30) {
  const stats = calcularEstadisticasBoveda();
  const proyeccionDiaria = stats.totalIngresos / 30;
  return Array.from({ length: dias }, (_, i) => ({
    dia: i + 1,
    proyectado: stats.capitalActual + proyeccionDiaria * i,
    optimista: stats.capitalActual + proyeccionDiaria * 1.2 * i,
    pesimista: stats.capitalActual + proyeccionDiaria * 0.8 * i,
  }));
}

export function detectarAlertas() {
  const stats = calcularEstadisticasBoveda();
  const alertas = [];

  if (stats.capitalActual < 100000) {
    alertas.push({ tipo: 'warning', mensaje: 'Capital bajo (< $100,000)' });
  }

  if (stats.gastoPromedio > stats.ingresoPromedio * 0.8) {
    alertas.push({ tipo: 'danger', mensaje: 'Gastos altos (> 80% de ingresos)' });
  }

  return alertas;
}

export default {
  INGRESOS: INGRESOS_BOVEDA,
  GASTOS: GASTOS_BOVEDA,
  RF_ACTUAL_CORTES: RF_ACTUAL_CORTES_BOVEDA,
  TRANSFERENCIAS: TRANSFERENCIAS_BOVEDA,
  calcularEstadisticas: calcularEstadisticasBoveda,
  obtenerUltimasTransacciones,
  proyeccionFlujo,
  detectarAlertas,
};
`;

fs.writeFileSync(path.join(datosDir, 'datosEjemploBoveda.js'), bovedaContent);
console.log('✓ datosEjemploBoveda.js actualizado');

// ============================================================================
// BÓVEDA USA
// ============================================================================
console.log('\n📝 Actualizando datosEjemploBovedaUSA.js...');
const bovedaUsaData = excelData.bancos?.bovedaUsa || {};  // Nota: es bovedaUsa, no bovedaUSA
const bovedaUsaContent = `/**
 * 🏦 DATOS EJEMPLO - BÓVEDA USA
 *
 * Sistema de gestión de capital en dólares (Bóveda USA)
 * Incluye: Ingresos, Gastos, Tipo de cambio
 *
 * SINCRONIZADO CON excel_data.json
 */
import excelData from '../../../../public/excel_data.json';
import { STORAGE_KEYS } from '../constants/storageKeys';

// Obtener datos directamente del Excel JSON (nota: es bovedaUsa, no bovedaUSA)
const bovedaUsaData = excelData.bancos?.bovedaUsa || {};

// ============================================================================
// 💰 INGRESOS BÓVEDA USA (sincronizado con Excel)
// ============================================================================
export const INGRESOS_BOVEDA_USA = (bovedaUsaData.ingresos || []).map((ing, index) => ({
  id: \`ING-USA-\${String(index + 1).padStart(3, '0')}\`,
  fecha: ing.fecha,
  monto: ing.monto,
  concepto: ing.concepto || '',
  origen: ing.origen || 'Sin clasificar',
  categoria: 'Ingreso',
  observaciones: '',
}));

// ============================================================================
// 💸 GASTOS BÓVEDA USA (sincronizado con Excel)
// ============================================================================
export const GASTOS_BOVEDA_USA = (bovedaUsaData.gastos || []).map((gasto, index) => ({
  id: \`GAS-USA-\${String(index + 1).padStart(3, '0')}\`,
  fecha: gasto.fecha,
  monto: gasto.monto,
  descripcion: gasto.concepto || '',
  categoria: 'Gasto',
  destino: gasto.destino || 'N/A',
  observaciones: gasto.observaciones || '',
}));

// ============================================================================
// 📈 RF ACTUAL CORTES
// ============================================================================
export const RF_ACTUAL_CORTES_BOVEDA_USA = [];

// ============================================================================
// 💱 TRANSFERENCIAS
// ============================================================================
export const TRANSFERENCIAS_BOVEDA_USA = [];

// ============================================================================
// 📊 FUNCIONES DE ANÁLISIS
// ============================================================================

export function calcularEstadisticasBovedaUSA() {
  const totalIngresos = INGRESOS_BOVEDA_USA.reduce((sum, ing) => sum + ing.monto, 0);
  const totalGastos = GASTOS_BOVEDA_USA.reduce((sum, gas) => sum + gas.monto, 0);
  const capitalActual = totalIngresos - totalGastos;

  return {
    capitalActual,
    totalIngresos,
    totalGastos,
    ingresoPromedio: INGRESOS_BOVEDA_USA.length > 0 ? totalIngresos / INGRESOS_BOVEDA_USA.length : 0,
    gastoPromedio: GASTOS_BOVEDA_USA.length > 0 ? totalGastos / GASTOS_BOVEDA_USA.length : 0,
  };
}

export function obtenerUltimasTransaccionesBovedaUSA(cantidad = 10) {
  const transacciones = [
    ...INGRESOS_BOVEDA_USA.map((ing) => ({ ...ing, tipo: 'ingreso' })),
    ...GASTOS_BOVEDA_USA.map((gas) => ({ ...gas, tipo: 'gasto' })),
  ];
  return transacciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, cantidad);
}

export function proyeccionFlujoBovedaUSA(dias = 30) {
  const stats = calcularEstadisticasBovedaUSA();
  const proyeccionDiaria = stats.totalIngresos / 30;
  return Array.from({ length: dias }, (_, i) => ({
    dia: i + 1,
    proyectado: stats.capitalActual + proyeccionDiaria * i,
  }));
}

export function detectarAlertasBovedaUSA() {
  const stats = calcularEstadisticasBovedaUSA();
  const alertas = [];

  if (stats.capitalActual < 50000) {
    alertas.push({ tipo: 'warning', mensaje: 'Capital bajo (< $50,000)' });
  }

  return alertas;
}

export default {
  INGRESOS: INGRESOS_BOVEDA_USA,
  GASTOS: GASTOS_BOVEDA_USA,
  RF_ACTUAL_CORTES: RF_ACTUAL_CORTES_BOVEDA_USA,
  TRANSFERENCIAS: TRANSFERENCIAS_BOVEDA_USA,
  calcularEstadisticas: calcularEstadisticasBovedaUSA,
  obtenerUltimasTransacciones: obtenerUltimasTransaccionesBovedaUSA,
  proyeccionFlujo: proyeccionFlujoBovedaUSA,
  detectarAlertas: detectarAlertasBovedaUSA,
};
`;

fs.writeFileSync(path.join(datosDir, 'datosEjemploBovedaUSA.js'), bovedaUsaContent);
console.log('✓ datosEjemploBovedaUSA.js actualizado');

console.log('\n✅ TODOS LOS ARCHIVOS SINCRONIZADOS CON EXCEL_DATA.JSON\n');
console.log('🎉 Sincronización completada exitosamente!');
