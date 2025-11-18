import { dirname, join } from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

const PROJECT_ID = 'premium-ecosystem-1760790572';
const FIREBASE_CONSOLE_URL = `https://console.firebase.google.com/u/0/project/${PROJECT_ID}/settings/serviceaccounts/adminsdk`;

console.log('\n╔═══════════════════════════════════════════════════════╗');
console.log('║                                                       ║');
console.log('║     🤖 DESCARGA AUTOMÁTICA DE CREDENCIALES          ║');
console.log('║                                                       ║');
console.log('╚═══════════════════════════════════════════════════════╝\n');

async function downloadCredentials() {
  let browser;

  try {
    console.log('🚀 Iniciando navegador automatizado...');

    browser = await puppeteer.launch({
      headless: false, // Visible para que veas el proceso
      defaultViewport: null,
      args: ['--start-maximized'],
    });

    const page = await browser.newPage();

    console.log('🌐 Navegando a Firebase Console...');
    await page.goto(FIREBASE_CONSOLE_URL, { waitUntil: 'networkidle2', timeout: 60000 });

    console.log('\n⏳ ESPERANDO TU AUTENTICACIÓN...');
    console.log('Por favor:');
    console.log('  1. Inicia sesión con tu cuenta de Google');
    console.log('  2. Selecciona el proyecto si es necesario');
    console.log('  3. Espera a que cargue la página de Service Accounts\n');

    // Esperar a que aparezca el botón de generar key (máximo 5 minutos)
    await page.waitForSelector('button', { timeout: 300000 });

    console.log('✓ Página cargada');
    console.log('🔍 Buscando botón "Generate new private key"...');

    // Buscar y hacer clic en el botón
    const buttonClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const generateButton = buttons.find(
        (btn) =>
          btn.textContent.toLowerCase().includes('generate') &&
          btn.textContent.toLowerCase().includes('key')
      );

      if (generateButton) {
        generateButton.click();
        return true;
      }
      return false;
    });

    if (!buttonClicked) {
      console.log('⚠️  No se encontró el botón automáticamente');
      console.log('Por favor, haz clic MANUALMENTE en "Generate new private key"');
      console.log('Esperando 30 segundos...');
      await page.waitForTimeout(30000);
    } else {
      console.log('✓ Botón clickeado, esperando confirmación...');
      await page.waitForTimeout(2000);
    }

    // Buscar el botón de confirmación
    console.log('🔍 Buscando botón de confirmación...');
    const confirmed = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const confirmButton = buttons.find(
        (btn) =>
          btn.textContent.toLowerCase().includes('generate') ||
          btn.textContent.toLowerCase().includes('confirm')
      );

      if (confirmButton) {
        confirmButton.click();
        return true;
      }
      return false;
    });

    if (confirmed) {
      console.log('✓ Confirmación enviada');
    } else {
      console.log('⚠️  Haz clic MANUALMENTE en el botón de confirmación');
    }

    console.log('\n⏳ Esperando descarga del archivo (60 segundos)...');
    await page.waitForTimeout(60000);

    console.log('\n✅ Proceso completado');
    console.log('📥 Revisa tu carpeta de Descargas');
    console.log('\nAhora ejecuta:');
    console.log('  npm run move-credentials');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 SOLUCIÓN MANUAL:');
    console.log('  1. Ve a:', FIREBASE_CONSOLE_URL);
    console.log('  2. Haz clic en "Generate new private key"');
    console.log('  3. Descarga el archivo');
    console.log('  4. Ejecuta: npm run move-credentials');
  } finally {
    if (browser) {
      console.log('\n⏸️  Presiona Enter para cerrar el navegador...');
      await new Promise((resolve) => {
        process.stdin.once('data', resolve);
      });
      await browser.close();
    }
  }
}

downloadCredentials();
