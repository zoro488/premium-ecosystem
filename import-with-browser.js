/**
 * 🚀 SCRIPT DE IMPORTACIÓN DIRECTA
 * Importa el Excel usando el navegador headless
 */
import { dirname, join } from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const excelPath = join(__dirname, 'Copia de Administación_General.xlsx');

console.log('\n🚀 INICIANDO IMPORTACIÓN AUTOMÁTICA CON PUPPETEER\n');
console.log('═'.repeat(80));

const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: { width: 1920, height: 1080 },
});

const page = await browser.newPage();

// Navegar a la aplicación
console.log('📡 Conectando a http://localhost:3001...');
await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });

console.log('✅ Aplicación cargada');

// Esperar a que cargue FlowDistributor
console.log('⏳ Esperando interfaz...');
await page.waitForTimeout(3000);

// Click en el botón de Importar Excel
console.log('🎯 Buscando botón "Importar Excel"...');
await page.click('button[data-panel="importar"]');

console.log('✅ Panel de importación abierto');
await page.waitForTimeout(1000);

// Subir archivo
console.log('📤 Subiendo archivo Excel...');
const fileInput = await page.$('input[type="file"]');
await fileInput.uploadFile(excelPath);

console.log('✅ Archivo cargado');
await page.waitForTimeout(1000);

// Click en importar
console.log('🚀 Iniciando importación...');
await page.click('button:has-text("Importar Datos")');

// Monitorear progreso
console.log('📊 Monitoreando progreso...\n');

let lastProgress = 0;
const checkProgress = async () => {
  try {
    const progress = await page.$eval('.progress-bar', (el) => el.textContent);
    const progressNum = parseInt(progress);

    if (progressNum > lastProgress) {
      console.log(`   ${progressNum}% completado...`);
      lastProgress = progressNum;
    }

    if (progressNum < 100) {
      setTimeout(checkProgress, 500);
    } else {
      console.log('\n✅ Importación completada al 100%\n');
      await page.waitForTimeout(2000);

      // Capturar reporte
      console.log('📈 Capturando reporte...');
      await page.screenshot({ path: 'import-report-screenshot.png', fullPage: true });
      console.log('✅ Screenshot guardado: import-report-screenshot.png');

      await browser.close();
      process.exit(0);
    }
  } catch (e) {
    setTimeout(checkProgress, 500);
  }
};

setTimeout(checkProgress, 2000);
