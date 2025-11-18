#!/usr/bin/env node

/**
 * 🔍 ANÁLISIS DE EXCEL - Sistema Premium Ecosystem
 *
 * Analiza el archivo Excel y muestra su estructura para mapear correctamente
 */

import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCEL_PATH = path.join(__dirname, '..', 'Administación_General.xlsx');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

console.log(`\n${colors.magenta}╔═══════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.magenta}║        📊 ANÁLISIS DE EXCEL                          ║${colors.reset}`);
console.log(`${colors.magenta}╚═══════════════════════════════════════════════════════╝${colors.reset}\n`);

const workbook = XLSX.readFile(EXCEL_PATH);

console.log(`${colors.cyan}📋 ESTRUCTURA DEL EXCEL:${colors.reset}\n`);

workbook.SheetNames.forEach((nombreHoja, index) => {
  const sheet = workbook.Sheets[nombreHoja];
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
  const filas = range.e.r - range.s.r;
  const columnas = range.e.c - range.s.c + 1;

  console.log(`${colors.green}${(index + 1).toString().padStart(2)}. ${nombreHoja}${colors.reset}`);
  console.log(`   • Filas: ${filas}`);
  console.log(`   • Columnas: ${columnas}`);

  // Mostrar las primeras columnas (headers)
  const primeraFila = [];
  for (let col = 0; col <= Math.min(5, range.e.c); col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: col });
    const cell = sheet[cellAddress];
    if (cell && cell.v) {
      primeraFila.push(cell.v);
    }
  }

  if (primeraFila.length > 0) {
    console.log(`   • Columnas: ${primeraFila.slice(0, 5).join(', ')}${primeraFila.length > 5 ? '...' : ''}`);
  }
  console.log('');
});

console.log(`${colors.yellow}💡 Hojas disponibles para mapeo:${colors.reset}`);
console.log(`   • Distribuidores (998 registros) → distribuidores.csv ✅`);
console.log(`   • Clientes (198 registros) → clientes.csv ✅`);
console.log(`   • Azteca (19 registros) → bancos_azteca.csv ✅`);
console.log(`   • Control_Maestro → ?`);
console.log(`   • Almacen_Monte → almacen.csv ?`);
console.log(`   • Bóveda_Monte → ?`);
console.log(`   • Bóveda_USA → ?`);
console.log(`   • Flete_Sur → ?`);
console.log(`   • Utilidades → ?`);
console.log(`   • Leftie → ?`);
console.log(`   • Profit → ?`);
console.log(`   • DATA → ?`);

console.log(`\n${colors.cyan}🎯 Siguiente paso:${colors.reset}`);
console.log(`   Dime qué hojas corresponden a:${colors.reset}`);
console.log(`   • Órdenes de Compra`);
console.log(`   • Ventas`);
console.log(`   • Bancos (Banamex, Bancomer, Banorte, Santander, Scotiabank, HSBC)`);
console.log(`   • O si tienen nombres diferentes\n`);
