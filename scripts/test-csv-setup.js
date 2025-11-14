#!/usr/bin/env node
/**
 * Test rápido para verificar que el sistema de importación CSV está listo
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

console.log(`
${colors.cyan}╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║    🔍 TEST DE PREPARACIÓN - IMPORTACIÓN CSV              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝${colors.reset}
`);

let allReady = true;

// 1. Verificar dependencias
console.log(`${colors.cyan}1. Verificando dependencias...${colors.reset}`);
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const requiredDeps = ['firebase-admin', 'csv-parser', 'dotenv'];

for (const dep of requiredDeps) {
  if (packageJson.dependencies[dep]) {
    console.log(`${colors.green}✓${colors.reset} ${dep}`);
  } else {
    console.log(`${colors.red}✗${colors.reset} ${dep} - NO INSTALADO`);
    allReady = false;
  }
}

// 2. Verificar scripts
console.log(`\n${colors.cyan}2. Verificando scripts...${colors.reset}`);
const requiredScripts = [
  'importar-csv-firestore.js',
  'validar-csv.js',
  'README-IMPORTACION-CSV.md',
  'QUICKSTART-CSV.md',
  'RESUMEN-IMPORTACION-CSV.md',
];

for (const script of requiredScripts) {
  const scriptPath = path.join(__dirname, script);
  if (fs.existsSync(scriptPath)) {
    console.log(`${colors.green}✓${colors.reset} ${script}`);
  } else {
    console.log(`${colors.red}✗${colors.reset} ${script} - NO ENCONTRADO`);
    allReady = false;
  }
}

// 3. Verificar carpeta CSV
console.log(`\n${colors.cyan}3. Verificando carpeta de datos...${colors.reset}`);
const csvDir = path.join(__dirname, '..', 'data', 'csv');
if (fs.existsSync(csvDir)) {
  console.log(`${colors.green}✓${colors.reset} Carpeta data/csv existe`);

  const csvFiles = fs.readdirSync(csvDir).filter((f) => f.endsWith('.csv'));
  if (csvFiles.length > 0) {
    console.log(`${colors.green}✓${colors.reset} ${csvFiles.length} archivos CSV encontrados`);
  } else {
    console.log(
      `${colors.yellow}⚠${colors.reset} No hay archivos CSV (coloca los 12 archivos aquí)`
    );
  }
} else {
  console.log(
    `${colors.yellow}⚠${colors.reset} Carpeta data/csv no existe (se creará automáticamente)`
  );
}

// 4. Verificar Service Account Key
console.log(`\n${colors.cyan}4. Verificando Service Account Key...${colors.reset}`);
const keyPaths = [
  path.join(__dirname, '..', 'serviceAccountKey.json'),
  path.join(__dirname, '..', 'config', 'serviceAccountKey.json'),
];

let keyFound = false;
for (const keyPath of keyPaths) {
  if (fs.existsSync(keyPath)) {
    console.log(`${colors.green}✓${colors.reset} serviceAccountKey.json encontrado`);
    keyFound = true;
    break;
  }
}

if (!keyFound) {
  console.log(`${colors.yellow}⚠${colors.reset} serviceAccountKey.json no encontrado`);
  console.log(`  ${colors.cyan}→${colors.reset} Descárgalo desde Firebase Console`);
}

// 5. Verificar comandos NPM
console.log(`\n${colors.cyan}5. Verificando comandos NPM...${colors.reset}`);
const requiredCommands = ['import:csv', 'validate:csv', 'import:csv:dry-run'];

for (const cmd of requiredCommands) {
  if (packageJson.scripts[cmd]) {
    console.log(`${colors.green}✓${colors.reset} npm run ${cmd}`);
  } else {
    console.log(`${colors.red}✗${colors.reset} npm run ${cmd} - NO CONFIGURADO`);
    allReady = false;
  }
}

// Resumen final
console.log(
  `\n${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}`
);

if (allReady && keyFound) {
  console.log(`${colors.green}✅ TODO LISTO PARA IMPORTAR${colors.reset}`);
  console.log(`\n${colors.cyan}Próximos pasos:${colors.reset}`);
  console.log(`1. Coloca los 12 archivos CSV en: data/csv/`);
  console.log(`2. Ejecuta: ${colors.cyan}npm run validate:csv${colors.reset}`);
  console.log(`3. Ejecuta: ${colors.cyan}npm run import:csv:dry-run${colors.reset}`);
  console.log(`4. Ejecuta: ${colors.cyan}npm run import:csv${colors.reset}`);
} else if (!keyFound) {
  console.log(`${colors.yellow}⚠️  ACCIÓN REQUERIDA${colors.reset}`);
  console.log(`\n${colors.cyan}Necesitas:${colors.reset}`);
  console.log(`1. Descargar serviceAccountKey.json desde Firebase Console`);
  console.log(`2. Guardarlo en la raíz del proyecto`);
  console.log(`3. Colocar los 12 archivos CSV en: data/csv/`);
} else {
  console.log(`${colors.red}❌ ALGUNOS COMPONENTES FALTAN${colors.reset}`);
  console.log(`\nRevisa los errores marcados con ${colors.red}✗${colors.reset} arriba`);
}

console.log(`\n${colors.cyan}📚 Documentación:${colors.reset}`);
console.log(`• Guía completa: scripts/README-IMPORTACION-CSV.md`);
console.log(`• Inicio rápido: scripts/QUICKSTART-CSV.md`);
console.log(`• Resumen: scripts/RESUMEN-IMPORTACION-CSV.md`);
console.log('');
