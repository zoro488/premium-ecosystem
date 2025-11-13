import XLSX from 'xlsx';

const EXCEL_PATH = 'C:\\Users\\xpovo\\Downloads\\Copia de Administación_General.xlsx';
const wb = XLSX.readFile(EXCEL_PATH);

console.log('\n🔍 CONTANDO FILAS CON DATOS REALES\n');

// Control_Maestro - Ventas
const cm = wb.Sheets['Control_Maestro'];
let ventasReales = 0;
let gastosReales = 0;

for (let row = 3; row <= 1000; row++) {
  const fechaVenta = cm[XLSX.utils.encode_cell({ r: row, c: 0 })];
  const ocRel = cm[XLSX.utils.encode_cell({ r: row, c: 1 })];

  if (fechaVenta?.v && ocRel?.v) {
    ventasReales++;
  }

  const fechaGasto = cm[XLSX.utils.encode_cell({ r: row, c: 14 })];
  const origen = cm[XLSX.utils.encode_cell({ r: row, c: 15 })];

  if (fechaGasto?.v && origen?.v) {
    gastosReales++;
  }
}

console.log(`Control_Maestro:`);
console.log(`  Ventas (con Fecha + OC): ${ventasReales}`);
console.log(`  Gastos (con Fecha + Origen): ${gastosReales}\n`);

// Clientes
const clientes = wb.Sheets['Clientes'];
let clientesReales = 0;

for (let row = 3; row <= 200; row++) {
  const nombreCliente = clientes[XLSX.utils.encode_cell({ r: row, c: 0 })];
  if (nombreCliente?.v && typeof nombreCliente.v === 'string' && nombreCliente.v.trim()) {
    clientesReales++;
  }
}

console.log(`Clientes:`);
console.log(`  Clientes con nombre: ${clientesReales}\n`);

// Distribuidores únicos de Distribuidores hoja
const dist = wb.Sheets['Distribuidores'];
const distribuidoresSet = new Set();

for (let row = 3; row <= 11; row++) {
  const origen = dist[XLSX.utils.encode_cell({ r: row, c: 2 })];
  if (origen?.v) {
    distribuidoresSet.add(origen.v);
  }
}

console.log(`Distribuidores:`);
console.log(`  Distribuidores únicos: ${distribuidoresSet.size}`);
console.log(`  Lista: ${Array.from(distribuidoresSet).join(', ')}\n`);
