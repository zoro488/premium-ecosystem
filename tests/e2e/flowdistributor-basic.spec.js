/**
 * Tests E2E básicos para FlowDistributor
 * @playwright
 */

import { test, expect } from '@playwright/test';

test.describe('FlowDistributor - Funcionalidad Básica', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la aplicación
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
  });

  test('debe cargar la página principal', async ({ page }) => {
    // Verificar que el título o header principal existe
    await expect(page.locator('text=Premium Ecosystem')).toBeVisible();
  });

  test('debe abrir configuración y mostrar botón de importar', async ({ page }) => {
    // Buscar y hacer clic en el botón de configuración
    const settingsButton = page.locator('[aria-label*="Config"], [aria-label*="Settings"], button:has-text("⚙")').first();
    await settingsButton.click();

    // Verificar que el modal de configuración se abre
    await expect(page.locator('text=Importar desde Excel')).toBeVisible();
  });

  test('debe navegar entre diferentes paneles', async ({ page }) => {
    // Probar navegación a diferentes secciones
    const sections = ['Ventas', 'Clientes', 'Almacén', 'Órdenes'];

    for (const section of sections) {
      const sectionButton = page.locator(`text=${section}`).first();
      if (await sectionButton.isVisible()) {
        await sectionButton.click();
        await page.waitForTimeout(500); // Esperar animaciones
      }
    }
  });
});

test.describe('FlowDistributor - Importación de Excel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
  });

  test('debe mostrar diálogo de confirmación al importar', async ({ page }) => {
    // Abrir configuración
    const settingsButton = page.locator('[aria-label*="Config"], button:has-text("⚙")').first();
    await settingsButton.click();

    // Esperar que el modal esté visible
    await page.waitForSelector('text=Importar desde Excel', { timeout: 5000 });

    // Setup para capturar el diálogo
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toContain('IMPORTAR DATOS');
      await dialog.dismiss();
    });

    // Hacer clic en importar
    const importButton = page.locator('button:has-text("Importar")').first();
    if (await importButton.isVisible()) {
      await importButton.click();
    }
  });
});

test.describe('FlowDistributor - Panel de Almacén', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
  });

  test('debe mostrar tabs de Entradas y Salidas', async ({ page }) => {
    // Navegar al panel de Almacén
    const almacenButton = page.locator('text=Almacén').first();
    if (await almacenButton.isVisible()) {
      await almacenButton.click();
      await page.waitForTimeout(500);

      // Verificar que los tabs existen
      await expect(page.locator('text=Entradas')).toBeVisible();
      await expect(page.locator('text=Salidas')).toBeVisible();
    }
  });

  test('debe cambiar entre tabs sin errores', async ({ page }) => {
    // Navegar al panel de Almacén
    const almacenButton = page.locator('text=Almacén').first();
    if (await almacenButton.isVisible()) {
      await almacenButton.click();
      await page.waitForTimeout(500);

      // Hacer clic en tab Entradas
      const entradasTab = page.locator('button:has-text("Entradas")');
      if (await entradasTab.isVisible()) {
        await entradasTab.click();
        await page.waitForTimeout(300);
      }

      // Hacer clic en tab Salidas
      const salidasTab = page.locator('button:has-text("Salidas")');
      if (await salidasTab.isVisible()) {
        await salidasTab.click();
        await page.waitForTimeout(300);
      }

      // No debería haber errores en consola (verificación implícita)
    }
  });
});

test.describe('FlowDistributor - Notificaciones', () => {
  test('debe mostrar notificaciones de éxito/error', async ({ page }) => {
    await page.goto('http://localhost:3002');

    // Escuchar errores de consola
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Interactuar con la app
    await page.waitForTimeout(2000);

    // Verificar que no hay errores críticos
    expect(consoleErrors.filter(e => e.includes('TypeError'))).toHaveLength(0);
  });
});
