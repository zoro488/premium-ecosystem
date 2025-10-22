#!/usr/bin/env node
/**
 * 🚀 IMPORTADOR AUTOMÁTICO DE EXCEL
 * Ejecuta la importación quirúrgica directamente desde terminal
 */
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colores para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.cyan}▸${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.magenta}${msg}${colors.reset}\n`),
};

// Configuración de Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDXhash_IUzFJrPR6n2BaSxQSK6Q1L0A0U',
  authDomain: 'premium-ecosystem-2025.firebaseapp.com',
  projectId: 'premium-ecosystem-2025',
  storageBucket: 'premium-ecosystem-2025.firebasestorage.app',
  messagingSenderId: '1029840619477',
  appId: '1:1029840619477:web:a7e5ad6f3536e0c3b516f8',
  measurementId: 'G-LB3D4R1QJT',
};

// Inicializar Firebase
log.title('🔥 QUANTUM EXCEL IMPORTER - IMPORTACIÓN AUTOMÁTICA');
log.step('Inicializando Firebase...');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
log.success('Firebase conectado correctamente');

// Importar el servicio de importación
log.step('Cargando motor de importación...');
const { QuantumExcelImporter } = await import('./src/services/quantumExcelImporter.js');
log.success('Motor cargado correctamente');

// Ruta del archivo Excel
const excelPath = join(__dirname, 'Copia de Administación_General.xlsx');
log.info(`Archivo Excel: ${excelPath}`);

// Verificar que existe el archivo
try {
  const fileBuffer = readFileSync(excelPath);
  log.success(`Archivo encontrado (${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB)`);

  // Crear un objeto File simulado para el importador
  const file = {
    name: 'Administación_General.xlsx',
    size: fileBuffer.length,
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    arrayBuffer: async () =>
      fileBuffer.buffer.slice(fileBuffer.byteOffset, fileBuffer.byteOffset + fileBuffer.byteLength),
  };

  // Crear instancia del importador
  log.step('Creando instancia del importador...');
  const importer = new QuantumExcelImporter(db);
  log.success('Importador inicializado');

  // Hook para logs en tiempo real
  const logs = [];
  importer.log = (mensaje, tipo = 'info') => {
    const timestamp = new Date().toLocaleTimeString('es-MX');
    logs.push({ timestamp, mensaje, tipo });

    switch (tipo) {
      case 'success':
        log.success(`[${timestamp}] ${mensaje}`);
        break;
      case 'warning':
        log.warning(`[${timestamp}] ${mensaje}`);
        break;
      case 'error':
        log.error(`[${timestamp}] ${mensaje}`);
        break;
      default:
        log.info(`[${timestamp}] ${mensaje}`);
    }
  };

  // Iniciar importación
  log.title('📊 INICIANDO IMPORTACIÓN QUIRÚRGICA');
  console.log('━'.repeat(80));

  const startTime = Date.now();

  try {
    const resultado = await importer.importarExcel(file);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n' + '━'.repeat(80));
    log.title('📈 REPORTE DE IMPORTACIÓN COMPLETO');

    // Estadísticas
    console.log(`${colors.bright}ESTADÍSTICAS:${colors.reset}`);
    console.log(
      `  ${colors.cyan}●${colors.reset} Órdenes de Compra: ${colors.green}${resultado.stats.ordenesCompra}${colors.reset}`
    );
    console.log(
      `  ${colors.cyan}●${colors.reset} Distribuidores: ${colors.green}${resultado.stats.distribuidores}${colors.reset}`
    );
    console.log(
      `  ${colors.cyan}●${colors.reset} Ventas Locales: ${colors.green}${resultado.stats.ventasLocales}${colors.reset}`
    );
    console.log(
      `  ${colors.cyan}●${colors.reset} Gastos y Abonos: ${colors.green}${resultado.stats.gastosAbonos}${colors.reset}`
    );
    console.log(
      `  ${colors.cyan}●${colors.reset} Movimientos Almacén: ${colors.green}${resultado.stats.almacenMovimientos}${colors.reset}`
    );
    console.log(
      `  ${colors.cyan}●${colors.reset} Movimientos Bancarios: ${colors.green}${resultado.stats.movimientosBancarios}${colors.reset}`
    );
    console.log(
      `  ${colors.cyan}●${colors.reset} Bancos: ${colors.green}${resultado.stats.bancos}${colors.reset}`
    );
    console.log(
      `  ${colors.cyan}●${colors.reset} Clientes: ${colors.green}${resultado.stats.clientes}${colors.reset}`
    );
    console.log(
      `  ${colors.cyan}●${colors.reset} Relaciones Creadas: ${colors.green}${resultado.stats.relaciones}${colors.reset}`
    );

    const totalDocs = Object.values(resultado.stats).reduce(
      (a, b) => (typeof b === 'number' ? a + b : a),
      0
    );
    console.log(
      `\n  ${colors.bright}${colors.green}TOTAL: ${totalDocs} documentos importados${colors.reset}`
    );

    // Métricas
    console.log(`\n${colors.bright}MÉTRICAS DE NEGOCIO:${colors.reset}`);
    if (resultado.metricas) {
      console.log(
        `  ${colors.cyan}●${colors.reset} Capital Total: ${colors.yellow}$${resultado.metricas.capitalTotal?.toLocaleString('es-MX') || 0}${colors.reset}`
      );
      console.log(
        `  ${colors.cyan}●${colors.reset} Total Ventas: ${colors.yellow}$${resultado.metricas.totalVentas?.toLocaleString('es-MX') || 0}${colors.reset}`
      );
      console.log(
        `  ${colors.cyan}●${colors.reset} Total Gastos: ${colors.yellow}$${resultado.metricas.totalGastos?.toLocaleString('es-MX') || 0}${colors.reset}`
      );
      console.log(
        `  ${colors.cyan}●${colors.reset} Inventario: ${colors.yellow}$${resultado.metricas.inventarioTotal?.toLocaleString('es-MX') || 0}${colors.reset}`
      );
      console.log(
        `  ${colors.cyan}●${colors.reset} Flujo de Efectivo: ${colors.yellow}$${resultado.metricas.flujoEfectivo?.toLocaleString('es-MX') || 0}${colors.reset}`
      );
    }

    // Warnings
    if (resultado.warnings?.length > 0) {
      console.log(
        `\n${colors.bright}${colors.yellow}ADVERTENCIAS (${resultado.warnings.length}):${colors.reset}`
      );
      resultado.warnings.slice(0, 10).forEach((w, i) => {
        console.log(`  ${i + 1}. ${w}`);
      });
      if (resultado.warnings.length > 10) {
        console.log(`  ... y ${resultado.warnings.length - 10} más`);
      }
    }

    // Errores
    if (resultado.errores?.length > 0) {
      console.log(
        `\n${colors.bright}${colors.red}ERRORES (${resultado.errores.length}):${colors.reset}`
      );
      resultado.errores.forEach((e, i) => {
        console.log(`  ${i + 1}. ${e}`);
      });
    }

    // Resumen
    console.log('\n' + '━'.repeat(80));
    log.title('✅ IMPORTACIÓN COMPLETADA EXITOSAMENTE');
    console.log(`${colors.bright}Tiempo total: ${colors.cyan}${duration}s${colors.reset}`);
    console.log(
      `${colors.bright}Promedio: ${colors.cyan}${(totalDocs / parseFloat(duration)).toFixed(0)} docs/s${colors.reset}`
    );
    console.log(`${colors.bright}Estado: ${colors.green}100% Completado${colors.reset}\n`);

    // Guardar reporte
    const reportPath = join(__dirname, 'import-report.json');
    const reportData = {
      timestamp: new Date().toISOString(),
      duration: `${duration}s`,
      resultado,
      logs: logs.slice(-100), // Últimos 100 logs
    };

    const { writeFileSync } = await import('fs');
    writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    log.success(`Reporte guardado en: ${reportPath}`);

    process.exit(0);
  } catch (error) {
    console.log('\n' + '━'.repeat(80));
    log.title('❌ ERROR EN LA IMPORTACIÓN');
    log.error(error.message);
    console.error(error);
    process.exit(1);
  }
} catch (error) {
  log.error('No se pudo leer el archivo Excel');
  log.error(error.message);
  process.exit(1);
}
