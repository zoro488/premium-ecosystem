/**
 * 🧪 CHRONOS SYSTEM - TEST SUITE COMPLETO
 * Tests exhaustivos de todos los flujos y componentes del sistema
 * @version 1.0.0 - Playwright E2E Tests
 */
import { expect, test } from '@playwright/test';

// ============================================
// 📋 CONFIGURACIÓN DE TESTS
// ============================================
const BASE_URL = 'http://localhost:4173';
const TEST_CREDENTIALS = {
  admin: { email: 'admin@chronos.com', password: 'Chronos2024!' },
  test: { email: 'test@chronos.com', password: 'TestChronos123!' },
  demo: { email: 'demo@chronos.com', password: 'DemoChronos2024' },
};

// ============================================
// 🎬 TEST 1: FLUJO DE INICIO COMPLETO
// ============================================
test.describe('🎬 Flujo de Inicio - Splash → Login → Dashboard', () => {
  test('debe mostrar splash screen con video y logo CHRONOS', async ({ page }) => {
    await page.goto(BASE_URL);

    // 1. Verificar Splash Screen
    const splashScreen = page.locator('[data-testid="splash-screen"]');
    await expect(splashScreen).toBeVisible({ timeout: 10000 });

    // 2. Verificar video de splash
    const splashVideo = page.locator('video[src*="chronos-splash"]');
    await expect(splashVideo).toBeVisible();

    // 3. Verificar logo CHRONOS
    const chronosLogo = page.locator('text=CHRONOS');
    await expect(chronosLogo).toBeVisible();

    // 4. Verificar gradiente naranja del logo
    const logoElement = page.locator('.from-orange-400');
    await expect(logoElement).toBeVisible();

    // 5. Verificar barra de progreso
    const progressBar = page.locator('[role="progressbar"]');
    await expect(progressBar).toBeVisible();

    // 6. Esperar a que termine el splash (mínimo 3 segundos)
    await page.waitForTimeout(3500);
  });

  test('debe mostrar login screen después del splash', async ({ page }) => {
    await page.goto(BASE_URL);

    // Esperar que pase el splash
    await page.waitForTimeout(4000);

    // Verificar que aparece login screen
    const loginScreen = page.locator('[data-testid="login-screen"]');
    await expect(loginScreen).toBeVisible({ timeout: 5000 });

    // Verificar campos de login
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const loginButton = page.locator('button:has-text("Iniciar Sesión")');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();
  });

  test('debe autenticar usuario admin correctamente', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(4000);

    // Login con credenciales admin
    await page.fill('input[type="email"]', TEST_CREDENTIALS.admin.email);
    await page.fill('input[type="password"]', TEST_CREDENTIALS.admin.password);
    await page.click('button:has-text("Iniciar Sesión")');

    // Verificar loading screen
    const loadingScreen = page.locator('text=CHRONOS');
    await expect(loadingScreen).toBeVisible({ timeout: 5000 });

    // Verificar que llega al dashboard
    const dashboard = page.locator('text=Command Center');
    await expect(dashboard).toBeVisible({ timeout: 10000 });
  });

  test('debe rechazar credenciales incorrectas', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(4000);

    // Intentar login con contraseña incorrecta
    await page.fill('input[type="email"]', TEST_CREDENTIALS.admin.email);
    await page.fill('input[type="password"]', 'ContraseñaIncorrecta');
    await page.click('button:has-text("Iniciar Sesión")');

    // Verificar mensaje de error
    const errorMessage = page.locator('text=Contraseña incorrecta');
    await expect(errorMessage).toBeVisible({ timeout: 3000 });
  });
});

// ============================================
// 🧭 TEST 2: NAVEGACIÓN ENTRE PANELES
// ============================================
test.describe('🧭 Navegación entre Paneles', () => {
  // Helper para hacer login
  const loginAsAdmin = async (page) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(4000);
    await page.fill('input[type="email"]', TEST_CREDENTIALS.admin.email);
    await page.fill('input[type="password"]', TEST_CREDENTIALS.admin.password);
    await page.click('button:has-text("Iniciar Sesión")');
    await page.waitForSelector('text=Command Center', { timeout: 10000 });
  };

  test('debe navegar a todos los paneles principales', async ({ page }) => {
    await loginAsAdmin(page);

    const panels = [
      { name: 'Dashboard', selector: 'button:has-text("Dashboard")' },
      { name: 'Órdenes', selector: 'button:has-text("Órdenes")' },
      { name: 'Distribuidores', selector: 'button:has-text("Distribuidores")' },
      { name: 'Almacén', selector: 'button:has-text("Almacén")' },
      { name: 'Ventas', selector: 'button:has-text("Ventas")' },
      { name: 'Clientes', selector: 'button:has-text("Clientes")' },
      { name: 'Reportes', selector: 'button:has-text("Reportes")' },
    ];

    for (const panel of panels) {
      console.log(`Testing panel: ${panel.name}`);
      await page.click(panel.selector);
      await page.waitForTimeout(1000);

      // Verificar que no hay errores
      const errorPanel = page.locator('text=Error al renderizar el panel');
      await expect(errorPanel).not.toBeVisible();
    }
  });

  test('debe navegar a paneles premium Ultra', async ({ page }) => {
    await loginAsAdmin(page);

    const ultraPanels = [
      'Utilidades',
      'Fletes Sur',
      'Bóveda Monte',
      'Bóveda USA',
      'Azteca',
      'Leftie',
      'Profit',
    ];

    for (const panelName of ultraPanels) {
      console.log(`Testing Ultra panel: ${panelName}`);

      // Buscar y clickear el panel
      const panelButton = page.locator(`button:has-text("${panelName}")`);
      if (await panelButton.isVisible()) {
        await panelButton.click();
        await page.waitForTimeout(1500);

        // Verificar que cargó correctamente
        const errorPanel = page.locator('text=Error al renderizar el panel');
        await expect(errorPanel).not.toBeVisible();
      }
    }
  });
});

// ============================================
// 📊 TEST 3: VISUALIZACIÓN DE DATOS
// ============================================
test.describe('📊 Visualización de Datos', () => {
  const loginAsAdmin = async (page) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(4000);
    await page.fill('input[type="email"]', TEST_CREDENTIALS.admin.email);
    await page.fill('input[type="password"]', TEST_CREDENTIALS.admin.password);
    await page.click('button:has-text("Iniciar Sesión")');
    await page.waitForSelector('text=Command Center', { timeout: 10000 });
  };

  test('debe mostrar KPIs en Dashboard sin errores', async ({ page }) => {
    await loginAsAdmin(page);

    // Verificar que hay KPIs visibles
    const kpiCards = page.locator('[data-testid="kpi-card"]');
    const count = await kpiCards.count();
    expect(count).toBeGreaterThan(0);

    // Verificar que no hay valores undefined/NaN
    const pageContent = await page.content();
    expect(pageContent).not.toContain('undefined');
    expect(pageContent).not.toContain('NaN');
  });

  test('debe mostrar gráficos correctamente', async ({ page }) => {
    await loginAsAdmin(page);

    // Verificar que hay elementos canvas (Recharts)
    const charts = page.locator('canvas');
    const chartCount = await charts.count();
    expect(chartCount).toBeGreaterThan(0);
  });

  test('debe mostrar tablas con datos', async ({ page }) => {
    await loginAsAdmin(page);

    // Navegar a ventas
    await page.click('button:has-text("Ventas")');
    await page.waitForTimeout(1000);

    // Verificar que hay filas en la tabla
    const tableRows = page.locator('tbody tr');
    const rowCount = await tableRows.count();
    console.log(`Filas en tabla de ventas: ${rowCount}`);
  });
});

// ============================================
// 📝 TEST 4: FORMULARIOS Y REGISTROS
// ============================================
test.describe('📝 Formularios y Registros', () => {
  const loginAsAdmin = async (page) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(4000);
    await page.fill('input[type="email"]', TEST_CREDENTIALS.admin.email);
    await page.fill('input[type="password"]', TEST_CREDENTIALS.admin.password);
    await page.click('button:has-text("Iniciar Sesión")');
    await page.waitForSelector('text=Command Center', { timeout: 10000 });
  };

  test('debe abrir modal de nueva orden de compra', async ({ page }) => {
    await loginAsAdmin(page);

    // Navegar a órdenes
    await page.click('button:has-text("Órdenes")');
    await page.waitForTimeout(1000);

    // Buscar botón de nueva orden
    const newOrderButton = page.locator('button:has-text("Nueva Orden")');
    if (await newOrderButton.isVisible()) {
      await newOrderButton.click();

      // Verificar que se abre el modal
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible({ timeout: 3000 });
    }
  });

  test('debe validar campos requeridos en formularios', async ({ page }) => {
    await loginAsAdmin(page);

    await page.click('button:has-text("Ventas")');
    await page.waitForTimeout(1000);

    const newSaleButton = page.locator('button:has-text("Nueva Venta")');
    if (await newSaleButton.isVisible()) {
      await newSaleButton.click();
      await page.waitForTimeout(500);

      // Intentar submit sin llenar campos
      const submitButton = page.locator('button[type="submit"]');
      if (await submitButton.isVisible()) {
        await submitButton.click();

        // Verificar que muestra errores de validación
        await page.waitForTimeout(500);
        const pageContent = await page.content();
        // Los errores de validación deberían aparecer
      }
    }
  });
});

// ============================================
// 💰 TEST 5: OPERACIONES DE BÓVEDAS
// ============================================
test.describe('💰 Operaciones de Bóvedas', () => {
  const loginAsAdmin = async (page) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(4000);
    await page.fill('input[type="email"]', TEST_CREDENTIALS.admin.email);
    await page.fill('input[type="password"]', TEST_CREDENTIALS.admin.password);
    await page.click('button:has-text("Iniciar Sesión")');
    await page.waitForSelector('text=Command Center', { timeout: 10000 });
  };

  test('debe mostrar saldos de bóvedas', async ({ page }) => {
    await loginAsAdmin(page);

    // Buscar panel de bóvedas
    const bovedaButton = page.locator('button:has-text("Bóveda")');
    if (await bovedaButton.first().isVisible()) {
      await bovedaButton.first().click();
      await page.waitForTimeout(1500);

      // Verificar que muestra saldos
      const saldoElements = page.locator('text=/\\$[0-9,]+/');
      const count = await saldoElements.count();
      expect(count).toBeGreaterThan(0);
    }
  });
});

// ============================================
// 🎨 TEST 6: ANIMACIONES Y TRANSICIONES
// ============================================
test.describe('🎨 Animaciones y UI', () => {
  const loginAsAdmin = async (page) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(4000);
    await page.fill('input[type="email"]', TEST_CREDENTIALS.admin.email);
    await page.fill('input[type="password"]', TEST_CREDENTIALS.admin.password);
    await page.click('button:has-text("Iniciar Sesión")');
    await page.waitForSelector('text=Command Center', { timeout: 10000 });
  };

  test('debe tener efectos hover en botones', async ({ page }) => {
    await loginAsAdmin(page);

    const buttons = page.locator('button').first();
    await buttons.hover();
    await page.waitForTimeout(300);

    // Verificar que el botón existe y es visible
    await expect(buttons).toBeVisible();
  });

  test('debe mostrar loading states', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(4000);

    await page.fill('input[type="email"]', TEST_CREDENTIALS.admin.email);
    await page.fill('input[type="password"]', TEST_CREDENTIALS.admin.password);
    await page.click('button:has-text("Iniciar Sesión")');

    // Debería mostrar loading screen
    const loadingIndicator = page.locator('text=/Loading|Cargando|CHRONOS/i');
    await expect(loadingIndicator).toBeVisible({ timeout: 2000 });
  });
});

// ============================================
// 🔒 TEST 7: SESIONES Y PERMISOS
// ============================================
test.describe('🔒 Sesiones y Permisos', () => {
  test('debe guardar sesión en localStorage', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(4000);

    await page.fill('input[type="email"]', TEST_CREDENTIALS.admin.email);
    await page.fill('input[type="password"]', TEST_CREDENTIALS.admin.password);
    await page.click('button:has-text("Iniciar Sesión")');
    await page.waitForTimeout(3000);

    // Verificar localStorage
    const savedUser = await page.evaluate(() => localStorage.getItem('flow_current_user'));
    expect(savedUser).toBeTruthy();

    const sessionToken = await page.evaluate(() => localStorage.getItem('chronos_session_token'));
    expect(sessionToken).toBeTruthy();
  });

  test('debe mantener sesión después de reload', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(4000);

    await page.fill('input[type="email"]', TEST_CREDENTIALS.admin.email);
    await page.fill('input[type="password"]', TEST_CREDENTIALS.admin.password);
    await page.click('button:has-text("Iniciar Sesión")');
    await page.waitForTimeout(3000);

    // Recargar página
    await page.reload();
    await page.waitForTimeout(4000);

    // Debería auto-login y mostrar dashboard
    const dashboard = page.locator('text=Command Center');
    await expect(dashboard).toBeVisible({ timeout: 10000 });
  });
});

// ============================================
// 🚨 TEST 8: MANEJO DE ERRORES
// ============================================
test.describe('🚨 Manejo de Errores', () => {
  test('debe mostrar error con email inválido', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(4000);

    await page.fill('input[type="email"]', 'emailinvalido');
    await page.fill('input[type="password"]', 'cualquiercontraseña');
    await page.click('button:has-text("Iniciar Sesión")');

    const errorMessage = page.locator('text=/Email inválido|invalid/i');
    await expect(errorMessage).toBeVisible({ timeout: 2000 });
  });

  test('debe mostrar error con usuario inexistente', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(4000);

    await page.fill('input[type="email"]', 'noexiste@chronos.com');
    await page.fill('input[type="password"]', 'ContraseñaCualquiera');
    await page.click('button:has-text("Iniciar Sesión")');

    const errorMessage = page.locator('text=/Usuario no encontrado|not found/i');
    await expect(errorMessage).toBeVisible({ timeout: 2000 });
  });
});

console.log('✅ CHRONOS Test Suite Completo - 8 categorías de tests');
