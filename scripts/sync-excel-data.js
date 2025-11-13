/**
 * 🔄 SINCRONIZADOR DE DATOS EXCEL → TypeScript
 * Convierte BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json a archivos .ts
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = join(__dirname, '..');
const dataDir = join(rootDir, 'src', 'apps', 'FlowDistributor', 'data');

console.log('🔄 Iniciando sincronización de datos Excel...\n');

// ============================================================================
// CARGAR JSON DEL EXCEL
// ============================================================================
const jsonPath = join(dataDir, 'BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json');
const excelData = JSON.parse(readFileSync(jsonPath, 'utf-8'));

console.log('📊 Datos cargados del Excel:');
console.log(`   - Ventas: ${excelData.ventasLocales?.ventasLocal?.length || 0}`);
console.log(`   - GYA: ${excelData.gastosAbonos?.gastosAbonos?.length || 0}`);
console.log(
  `   - Órdenes de Compra: ${excelData.ordenesCompra?.distribuidores?.ordenesCompra?.length || 0}\n`
);

// ============================================================================
// SINCRONIZAR GYA
// ============================================================================
function syncGYA() {
  console.log('💰 Sincronizando GYA...');

  const gyaRecords = excelData.gastosAbonos?.gastosAbonos || [];

  let tsContent = `/**
 * GYA - GASTOS Y ABONOS
 * Datos reales del Excel - Tabla completa (${gyaRecords.length} registros)
 * Sincronizado automáticamente desde BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json
 */

export interface GYARegistro {
  id: string;
  fecha: Date;
  origenGastoAbono: string;
  valor: number;
  tc: number;
  pesos: number;
  destino: string;
  concepto: string;
  observaciones: string;
  tipo: 'Gasto' | 'Abono' | 'Ingreso';
}

export const gyaData: GYARegistro[] = [\n`;

  gyaRecords.forEach((record, index) => {
    const tipo =
      record.tipo ||
      (record.origenGastoAbono?.toLowerCase().includes('gasto') ? 'Gasto' : 'Ingreso');

    tsContent += `  {
    id: 'GYA${String(index + 1).padStart(3, '0')}',
    fecha: new Date('${record.fecha}'),
    origenGastoAbono: '${(record.origen || record.origenGastoAbono || '').replace(/'/g, "\\'")}',
    valor: ${record.valor || 0},
    tc: ${record.tc || 0},
    pesos: ${record.pesos || 0},
    destino: '${(record.destino || '').replace(/'/g, "\\'")}',
    concepto: '${(record.concepto || '').replace(/'/g, "\\'")}',
    observaciones: '${(record.observaciones || '').replace(/'/g, "\\'")}',
    tipo: '${tipo}',
  },\n`;
  });

  tsContent += `];

// ============================================================================
// CÁLCULOS Y ESTADÍSTICAS
// ============================================================================

export const calcularBalanceGYA = () => {
  const ingresos = gyaData.filter(r => r.tipo === 'Ingreso').reduce((sum, r) => sum + r.valor, 0);
  const gastos = gyaData.filter(r => r.tipo === 'Gasto').reduce((sum, r) => sum + r.valor, 0);
  const abonos = gyaData.filter(r => r.tipo === 'Abono').reduce((sum, r) => sum + r.valor, 0);

  return {
    totalIngresos: ingresos,
    totalGastos: gastos,
    totalAbonos: abonos,
    balance: ingresos - gastos - abonos,
  };
};

export const totalesPorDestino = () => {
  const destinos: Record<string, number> = {};

  gyaData.forEach(registro => {
    if (!destinos[registro.destino]) {
      destinos[registro.destino] = 0;
    }
    destinos[registro.destino] += registro.valor;
  });

  return destinos;
};

export const totalesPorOrigen = () => {
  const origenes: Record<string, number> = {};

  gyaData.forEach(registro => {
    if (!origenes[registro.origenGastoAbono]) {
      origenes[registro.origenGastoAbono] = 0;
    }
    origenes[registro.origenGastoAbono] += registro.valor;
  });

  return origenes;
};

export default gyaData;
`;

  const outputPath = join(dataDir, 'gya.ts');
  writeFileSync(outputPath, tsContent, 'utf-8');
  console.log(`   ✅ Archivo actualizado: gya.ts (${gyaRecords.length} registros)`);
}

// ============================================================================
// SINCRONIZAR VENTAS
// ============================================================================
function syncVentas() {
  console.log('🚚 Sincronizando Ventas Locales...');

  const ventas = excelData.ventasLocales?.ventasLocal || [];

  let tsContent = `/**
 * VENTA LOCAL - PANEL CONTROL MAESTRO
 * Datos reales del Excel (${ventas.length} registros)
 * Sincronizado automáticamente desde BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json
 */

export interface VentaLocal {
  id: string;
  fecha: Date;
  ocRelacionada: string;
  cantidad: number;
  cliente: string;
  bovedaMonte: number;
  precioVenta: number;
  ingreso: number;
  flete: 'Aplica' | 'No Aplica';
  fleteUtilidad: number;
  utilidad: number;
  estatus: 'Pendiente' | 'Pagado';
  concepto: string;
}

export const ventasLocalesData: VentaLocal[] = [\n`;

  ventas.forEach((venta, index) => {
    tsContent += `  {
    id: 'VL${String(index + 1).padStart(3, '0')}',
    fecha: new Date('${venta.fecha}'),
    ocRelacionada: '${venta.ocRelacionada || ''}',
    cantidad: ${venta.cantidad || 0},
    cliente: '${(venta.cliente || '').replace(/'/g, "\\'")}',
    bovedaMonte: ${venta.bovedaMonte || 0},
    precioVenta: ${venta.precioVenta || 0},
    ingreso: ${venta.ingreso || 0},
    flete: '${venta.flete === 'Aplica' ? 'Aplica' : 'No Aplica'}',
    fleteUtilidad: ${venta.fleteUtilidad || 0},
    utilidad: ${venta.utilidad || 0},
    estatus: '${venta.estatus === 'Pagado' ? 'Pagado' : 'Pendiente'}',
    concepto: '${(venta.concepto || '').replace(/'/g, "\\'")}',
  },\n`;
  });

  tsContent += `];

// ============================================================================
// CÁLCULOS Y ESTADÍSTICAS
// ============================================================================

export const calcularTotalesVentas = () => {
  const totalIngreso = ventasLocalesData.reduce((sum, v) => sum + v.ingreso, 0);
  const totalFletes = ventasLocalesData.reduce((sum, v) => sum + v.fleteUtilidad, 0);
  const totalUtilidades = ventasLocalesData.reduce((sum, v) => sum + v.utilidad, 0);
  const totalBovedaMonte = ventasLocalesData.reduce((sum, v) => sum + v.bovedaMonte, 0);

  return {
    totalIngreso,
    totalFletes,
    totalUtilidades,
    totalBovedaMonte,
    cantidadVentas: ventasLocalesData.length,
  };
};

export default ventasLocalesData;
`;

  const outputPath = join(dataDir, 'ventasLocales.ts');
  writeFileSync(outputPath, tsContent, 'utf-8');
  console.log(`   ✅ Archivo actualizado: ventasLocales.ts (${ventas.length} registros)`);
}

// ============================================================================
// EJECUTAR SINCRONIZACIÓN
// ============================================================================
try {
  syncGYA();
  syncVentas();

  console.log('\n✅ Sincronización completada exitosamente!');
  console.log('🔄 Los componentes ahora mostrarán los datos completos del Excel.\n');
} catch (error) {
  console.error('❌ Error durante la sincronización:', error);
  process.exit(1);
}
