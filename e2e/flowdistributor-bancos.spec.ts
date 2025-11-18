import { expect, test } from '@playwright/test';

test.describe('🎭 E2E - FlowDistributor - Bancos System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    // Esperar a que cargue la aplicación
    await page.waitForLoadState('networkidle');
  });

  test('✅ debe cargar la página principal', async ({ page }) => {
    await expect(page).toHaveTitle(/Premium Ecosystem|CHRONOS/i);
  });

  test('✅ debe navegar a FlowDistributor', async ({ page }) => {
    await page.click('text=FlowDistributor');
    await expect(page).toHaveURL(/.*flowdistributor/i);
  });

  test('✅ debe mostrar lista de bancos', async ({ page }) => {
    await page.goto('http://localhost:3000/flowdistributor/bancos');

    // Esperar a que carguen los bancos
    await page.waitForSelector('[data-testid="banco-card"]', { timeout: 10000 });

    const bancos = await page.$$('[data-testid="banco-card"]');
    expect(bancos.length).toBeGreaterThan(0);
  });

  test('✅ debe abrir modal de transferencia', async ({ page }) => {
    await page.goto('http://localhost:3000/flowdistributor/bancos');

    await page.click('text=Nueva Transferencia');
    await expect(page.locator('text=Crear Transferencia')).toBeVisible();
  });

  test('✅ debe validar formulario de transferencia', async ({ page }) => {
    await page.goto('http://localhost:3000/flowdistributor/bancos');

    await page.click('text=Nueva Transferencia');

    // Intentar enviar sin datos
    await page.click('button:has-text("Crear")');

    // Debe mostrar errores de validación
    await expect(page.locator('text=Campo requerido')).toBeVisible();
  });

  test('✅ debe crear transferencia exitosa', async ({ page }) => {
    await page.goto('http://localhost:3000/flowdistributor/bancos');

    await page.click('text=Nueva Transferencia');

    // Llenar formulario
    await page.selectOption('[name="bancoOrigen"]', 'boveda-monte');
    await page.selectOption('[name="bancoDestino"]', 'utilidades');
    await page.fill('[name="monto"]', '5000');
    await page.fill('[name="concepto"]', 'Transferencia de prueba E2E');

    // Enviar
    await page.click('button:has-text("Crear")');

    // Esperar confirmación
    await expect(page.locator('text=Transferencia exitosa')).toBeVisible({ timeout: 5000 });
  });

  test('❌ debe rechazar transferencia sin fondos', async ({ page }) => {
    await page.goto('http://localhost:3000/flowdistributor/bancos');

    await page.click('text=Nueva Transferencia');

    // Llenar con monto muy alto
    await page.selectOption('[name="bancoOrigen"]', 'fletes');
    await page.selectOption('[name="bancoDestino"]', 'utilidades');
    await page.fill('[name="monto"]', '999999');
    await page.fill('[name="concepto"]', 'Transferencia sin fondos');

    // Enviar
    await page.click('button:has-text("Crear")');

    // Debe mostrar error
    await expect(page.locator('text=insuficientes')).toBeVisible({ timeout: 5000 });
  });

  test('✅ debe mostrar movimientos de un banco', async ({ page }) => {
    await page.goto('http://localhost:3000/flowdistributor/bancos/boveda-monte');

    // Esperar a que carguen movimientos
    await page.waitForSelector('[data-testid="movimiento-row"]', { timeout: 10000 });

    const movimientos = await page.$$('[data-testid="movimiento-row"]');
    expect(movimientos.length).toBeGreaterThan(0);
  });

  test('✅ debe filtrar movimientos por tipo', async ({ page }) => {
    await page.goto('http://localhost:3000/flowdistributor/bancos/boveda-monte');

    // Filtrar por INGRESO
    await page.selectOption('[name="tipoFiltro"]', 'INGRESO');

    // Esperar a que se actualice
    await page.waitForTimeout(1000);

    const movimientos = await page.$$('[data-testid="movimiento-row"]');
    expect(movimientos.length).toBeGreaterThan(0);
  });

  test('✅ debe calcular saldo total correctamente', async ({ page }) => {
    await page.goto('http://localhost:3000/flowdistributor/bancos');

    const saldoTotal = await page.locator('[data-testid="saldo-total"]').textContent();
    expect(saldoTotal).toMatch(/\$[\d,]+/);
  });

  test('✅ debe actualizar saldo después de transferencia', async ({ page }) => {
    await page.goto('http://localhost:3000/flowdistributor/bancos');

    // Obtener saldo inicial
    const saldoInicial = await page.locator('[data-testid="saldo-boveda-monte"]').textContent();

    // Crear transferencia
    await page.click('text=Nueva Transferencia');
    await page.selectOption('[name="bancoOrigen"]', 'boveda-monte');
    await page.selectOption('[name="bancoDestino"]', 'utilidades');
    await page.fill('[name="monto"]', '1000');
    await page.fill('[name="concepto"]', 'Test actualización saldo');
    await page.click('button:has-text("Crear")');

    // Esperar actualización
    await page.waitForTimeout(2000);

    // Verificar que el saldo cambió
    const saldoFinal = await page.locator('[data-testid="saldo-boveda-monte"]').textContent();
    expect(saldoFinal).not.toBe(saldoInicial);
  });

  test('✅ debe mostrar gráficas de analíticas', async ({ page }) => {
    await page.goto('http://localhost:3000/flowdistributor/analytics');

    // Esperar a que cargue ECharts
    await page.waitForSelector('canvas', { timeout: 10000 });

    const canvas = await page.$$('canvas');
    expect(canvas.length).toBeGreaterThan(0);
  });

  test('✅ debe exportar reporte PDF', async ({ page }) => {
    await page.goto('http://localhost:3000/flowdistributor/bancos');

    // Configurar listener para descarga
    const downloadPromise = page.waitForEvent('download');

    await page.click('text=Exportar PDF');

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  });

  test('✅ debe buscar bancos', async ({ page }) => {
    await page.goto('http://localhost:3000/flowdistributor/bancos');

    await page.fill('[placeholder="Buscar banco..."]', 'Bóveda');
    await page.waitForTimeout(500);

    const resultados = await page.$$('[data-testid="banco-card"]');
    expect(resultados.length).toBeGreaterThan(0);
  });

  test('✅ debe mantener sesión después de reload', async ({ page }) => {
    await page.goto('http://localhost:3000/flowdistributor/bancos');

    // Reload
    await page.reload();

    // Verificar que sigue autenticado
    await expect(page).toHaveURL(/.*flowdistributor/i);
  });
});
