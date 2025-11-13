/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                 CHRONOS E2E DASHBOARD TESTS                                ║
 * ║            Tests End-to-End para el Dashboard Principal                    ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */
import { expect, test } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('test@chronos.com');
    await page.getByPlaceholder(/contraseña/i).fill('password123');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();
    await page.waitForURL(/dashboard/i);
  });

  test('should display dashboard header', async ({ page }) => {
    await expect(page.getByText(/dashboard principal/i)).toBeVisible();
  });

  test('should display KPI cards', async ({ page }) => {
    // Check for metric cards
    await expect(page.getByText(/total ventas/i)).toBeVisible();
    await expect(page.getByText(/ventas hoy/i)).toBeVisible();
    await expect(page.getByText(/clientes activos/i)).toBeVisible();
  });

  test('should display date range filters', async ({ page }) => {
    await expect(page.getByText(/hoy/i)).toBeVisible();
    await expect(page.getByText(/semana/i)).toBeVisible();
    await expect(page.getByText(/mes/i)).toBeVisible();
    await expect(page.getByText(/año/i)).toBeVisible();
  });

  test('should switch date ranges', async ({ page }) => {
    const weekButton = page.getByRole('button', { name: /semana/i });
    await weekButton.click();

    // Check if button is active
    await expect(weekButton).toHaveClass(/bg-blue-500/);
  });

  test('should display recent sales table', async ({ page }) => {
    await expect(page.getByText(/ventas recientes/i)).toBeVisible();

    // Check table headers
    await expect(page.getByText(/cliente/i)).toBeVisible();
    await expect(page.getByText(/monto/i)).toBeVisible();
  });

  test('should display top products table', async ({ page }) => {
    await expect(page.getByText(/productos más vendidos/i)).toBeVisible();
  });

  test('should have search functionality in tables', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar en tabla/i).first();
    await expect(searchInput).toBeVisible();

    await searchInput.fill('test');
    await page.waitForTimeout(500); // Wait for debounce
  });

  test('should export table data', async ({ page }) => {
    const exportButton = page.getByRole('button', { name: /exportar/i }).first();

    if (await exportButton.isVisible()) {
      // Setup download listener
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();

      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('export');
    }
  });

  test('should filter tables', async ({ page }) => {
    const filterButton = page.getByRole('button', { name: /filtros/i }).first();

    if (await filterButton.isVisible()) {
      await filterButton.click();
      await expect(page.getByText(/filtros por columna/i)).toBeVisible();
    }
  });
});

test.describe('Dashboard - Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('test@chronos.com');
    await page.getByPlaceholder(/contraseña/i).fill('password123');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();
    await page.waitForURL(/dashboard/i);
  });

  test('should have functional sidebar', async ({ page }) => {
    // Check sidebar exists
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();
  });

  test('should navigate to ventas', async ({ page }) => {
    await page.getByText(/ventas/i).first().click();
    await page.waitForURL(/ventas/i);
    await expect(page.getByText(/ventas/i)).toBeVisible();
  });

  test('should navigate to clientes', async ({ page }) => {
    await page.getByText(/clientes/i).first().click();
    await page.waitForURL(/clientes/i);
    await expect(page.getByText(/clientes/i)).toBeVisible();
  });

  test('should have user menu', async ({ page }) => {
    const userMenuButton = page.locator('button').filter({ hasText: /usuario/i }).first();

    if (await userMenuButton.isVisible()) {
      await userMenuButton.click();
      await expect(page.getByText(/mi perfil/i)).toBeVisible();
      await expect(page.getByText(/configuración/i)).toBeVisible();
      await expect(page.getByText(/cerrar sesión/i)).toBeVisible();
    }
  });

  test('should have notifications', async ({ page }) => {
    // Look for notification bell icon
    const notificationButton = page.locator('button[title*="notif"]').or(page.locator('svg[class*="bell"]')).first();

    if (await notificationButton.isVisible()) {
      await notificationButton.click();
    }
  });

  test('should open search with Cmd+K', async ({ page }) => {
    // Press Cmd+K (Mac) or Ctrl+K (Windows/Linux)
    const isMac = process.platform === 'darwin';
    await page.keyboard.press(isMac ? 'Meta+KeyK' : 'Control+KeyK');

    // Check if search modal opened
    const searchInput = page.getByPlaceholder(/buscar en chronos/i);
    await expect(searchInput).toBeVisible({ timeout: 2000 });
  });
});

test.describe('Dashboard - Responsiveness', () => {
  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');

    // Dashboard should still be accessible
    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/dashboard');

    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });

  test('should be responsive on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/dashboard');

    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });
});
