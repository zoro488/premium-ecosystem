#!/usr/bin/env node
/**
 * 🔄 CONVERSOR EXCEL A CSV - Sistema Premium Ecosystem
 *
 * Convierte el archivo Administación_General.xlsx a 12 archivos CSV
 * necesarios para la importación a Firestore
 *
 * @requires xlsx - npm install xlsx
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

// Configuración de rutas
const EXCEL_PATH = path.join(__dirname, '..', 'Administación_General.xlsx');
const CSV_OUTPUT_DIR = path.join(__dirname, '..', 'data', 'csv');

// Mapeo REAL basado en tu archivo Excel
const SHEET_MAPPING = {
  // Clientes y Distribuidores
  Clientes: 'clientes.csv',
  Distribuidores: 'distribuidores.csv',

  // Bancos y Registros Financieros
  Azteca: 'bancos_azteca.csv',
  Leftie: 'bancos_leftie.csv',
  Profit: 'bancos_profit.csv',

  // Bóvedas
  Bóveda_Monte: 'boveda_monte.csv',
  Bóveda_USA: 'boveda_usa.csv',

  // Operaciones
  Control_Maestro: 'ventas.csv', // Contiene "Venta Local"
  Almacen_Monte: 'almacen.csv', // Almacén principal
  Flete_Sur: 'flete_sur.csv', // Operaciones de flete
  Utilidades: 'utilidades.csv', // Registro de utilidades
  DATA: 'ordenes_compra.csv', // Contiene "ODGYA, Destino, Clientes"
}; /**
 * Verifica que el archivo Excel exista
 */
function verificarArchivoExcel() {
  console.log(`\n${colors.cyan}📂 Verificando archivo Excel...${colors.reset}`);

  if (!fs.existsSync(EXCEL_PATH)) {
    console.error(`${colors.red}❌ Error: No se encontró el archivo Excel${colors.reset}`);
    console.error(`   Ruta esperada: ${EXCEL_PATH}`);
    console.error(
      `\n${colors.yellow}💡 Asegúrate de que el archivo "Administación_General.xlsx" esté en la raíz del proyecto${colors.reset}`
    );
    process.exit(1);
  }

  console.log(`${colors.green}✓${colors.reset} Archivo encontrado: ${path.basename(EXCEL_PATH)}`);
}

/**
 * Crea el directorio de salida si no existe
 */
function crearDirectorioSalida() {
  if (!fs.existsSync(CSV_OUTPUT_DIR)) {
    fs.mkdirSync(CSV_OUTPUT_DIR, { recursive: true });
    console.log(`${colors.green}✓${colors.reset} Directorio creado: data/csv/`);
  } else {
    console.log(`${colors.green}✓${colors.reset} Directorio existe: data/csv/`);
  }
}

/**
 * Lee el archivo Excel y retorna el workbook
 */
function leerExcel() {
  console.log(`\n${colors.cyan}📖 Leyendo archivo Excel...${colors.reset}`);

  try {
    const workbook = XLSX.readFile(EXCEL_PATH);
    console.log(`${colors.green}✓${colors.reset} Excel cargado correctamente`);
    console.log(`   Hojas disponibles: ${workbook.SheetNames.length}`);
    return workbook;
  } catch (error) {
    console.error(`${colors.red}❌ Error al leer Excel:${colors.reset}`, error.message);
    process.exit(1);
  }
}

/**
 * Normaliza el nombre de la hoja (maneja variaciones)
 */
function normalizarNombreHoja(nombreHoja) {
  const normalized = nombreHoja.trim().toLowerCase();

  // Mapeo de variaciones comunes
  const variaciones = {
    azteca: 'Azteca',
    banamex: 'Banamex',
    bancomer: 'Bancomer',
    banorte: 'Banorte',
    santander: 'Santander',
    scotiabank: 'Scotiabank',
    hsbc: 'HSBC',
    clientes: 'Clientes',
    distribuidores: 'Distribuidores',
    'ordenes de compra': 'Ordenes de Compra',
    ordenes_de_compra: 'Ordenes de Compra',
    ventas: 'Ventas',
    almacen: 'Almacen',
    almacén: 'Almacen',
  };

  return variaciones[normalized] || nombreHoja;
}

/**
 * Convierte una hoja a CSV
 */
function convertirHojaACSV(workbook, nombreHoja, archivoSalida) {
  const sheet = workbook.Sheets[nombreHoja];

  if (!sheet) {
    console.log(
      `${colors.yellow}⚠${colors.reset} Hoja "${nombreHoja}" no encontrada, saltando...`
    );
    return false;
  }

  // Convertir a CSV
  const csv = XLSX.utils.sheet_to_csv(sheet, {
    FS: ',',
    RS: '\n',
    blankrows: false,
  });

  // Guardar archivo
  const rutaCompleta = path.join(CSV_OUTPUT_DIR, archivoSalida);
  fs.writeFileSync(rutaCompleta, csv, 'utf8');

  // Contar filas (sin incluir header)
  const filas = csv.split('\n').filter((line) => line.trim()).length - 1;

  console.log(`${colors.green}✓${colors.reset} ${archivoSalida.padEnd(25)} → ${filas} registros`);

  return true;
}

/**
 * Muestra las hojas disponibles en el Excel
 */
function mostrarHojasDisponibles(workbook) {
  console.log(`\n${colors.cyan}📋 Hojas disponibles en el Excel:${colors.reset}`);
  workbook.SheetNames.forEach((nombre, index) => {
    const sheet = workbook.Sheets[nombre];
    const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
    const filas = range.e.r - range.s.r;
    console.log(`   ${(index + 1).toString().padStart(2)}. ${nombre.padEnd(30)} (${filas} filas)`);
  });
}

/**
 * Proceso principal de conversión
 */
function convertirExcelACSV() {
  console.log(
    `\n${colors.magenta}╔═══════════════════════════════════════════════════════╗${colors.reset}`
  );
  console.log(
    `${colors.magenta}║                                                       ║${colors.reset}`
  );
  console.log(
    `${colors.magenta}║        🔄 CONVERSOR EXCEL → CSV                       ║${colors.reset}`
  );
  console.log(
    `${colors.magenta}║           Premium Ecosystem                           ║${colors.reset}`
  );
  console.log(
    `${colors.magenta}║                                                       ║${colors.reset}`
  );
  console.log(
    `${colors.magenta}╚═══════════════════════════════════════════════════════╝${colors.reset}`
  );

  // 1. Verificar archivo Excel
  verificarArchivoExcel();

  // 2. Crear directorio de salida
  crearDirectorioSalida();

  // 3. Leer Excel
  const workbook = leerExcel();

  // 4. Mostrar hojas disponibles
  mostrarHojasDisponibles(workbook);

  // 5. Convertir hojas a CSV
  console.log(`\n${colors.cyan}🔄 Convirtiendo hojas a CSV...${colors.reset}\n`);

  let exitosos = 0;
  let fallidos = 0;
  const archivosCreados = [];

  for (const [nombreHoja, archivoCSV] of Object.entries(SHEET_MAPPING)) {
    // Intentar con el nombre exacto
    let convertido = convertirHojaACSV(workbook, nombreHoja, archivoCSV);

    // Si falla, intentar con variaciones
    if (!convertido) {
      const hojaEncontrada = workbook.SheetNames.find(
        (hoja) => normalizarNombreHoja(hoja) === nombreHoja
      );

      if (hojaEncontrada) {
        convertido = convertirHojaACSV(workbook, hojaEncontrada, archivoCSV);
      }
    }

    if (convertido) {
      exitosos++;
      archivosCreados.push(archivoCSV);
    } else {
      fallidos++;
    }
  }

  // 6. Resumen final
  console.log(
    `\n${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`
  );
  console.log(`\n${colors.green}✅ Conversión completada${colors.reset}`);
  console.log(`   • Archivos creados: ${exitosos}/12`);

  if (fallidos > 0) {
    console.log(`   ${colors.yellow}• Archivos no creados: ${fallidos}${colors.reset}`);
    console.log(
      `\n${colors.yellow}💡 Tip: Verifica los nombres de las hojas en el Excel${colors.reset}`
    );
  }

  console.log(`\n${colors.blue}📁 Ubicación: ${CSV_OUTPUT_DIR}${colors.reset}`);
  console.log(`\n${colors.cyan}📋 Archivos CSV generados:${colors.reset}`);
  archivosCreados.forEach((archivo) => {
    console.log(`   ✓ ${archivo}`);
  });

  console.log(`\n${colors.magenta}🚀 Próximos pasos:${colors.reset}`);
  console.log(`   1. Verifica los archivos CSV en: data/csv/`);
  console.log(`   2. Obtén el serviceAccountKey.json de Firebase Console`);
  console.log(`   3. Ejecuta: ${colors.cyan}npm run validate:csv${colors.reset}`);
  console.log(`   4. Ejecuta: ${colors.cyan}npm run import:csv:dry-run${colors.reset}`);
  console.log(`   5. Ejecuta: ${colors.cyan}npm run import:csv${colors.reset}\n`);
}

// Ejecutar conversión
try {
  convertirExcelACSV();
} catch (error) {
  console.error(`\n${colors.red}❌ Error fatal:${colors.reset}`, error);
  console.error(error.stack);
  process.exit(1);
}
