/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHRONOS E2E LOGIN TESTS                                 ║
 * ║              Tests End-to-End para el flujo de autenticación               ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */
import { expect, test } from '@playwright/test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/CHRONOS/i);

    // Check form elements
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/contraseña/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /iniciar sesión/i })).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Click submit without filling
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Check for required validation
    const emailInput = page.getByPlaceholder(/email/i);
    const isInvalid = await emailInput.evaluate((el) => {
      return !el.validity.valid;
    });

    expect(isInvalid).toBeTruthy();
  });

  test('should validate email format', async ({ page }) => {
    // Enter invalid email
    await page.getByPlaceholder(/email/i).fill('invalid-email');
    await page.getByPlaceholder(/contraseña/i).fill('password123');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Check for validation
    const emailInput = page.getByPlaceholder(/email/i);
    const isInvalid = await emailInput.evaluate((el) => {
      return !el.validity.valid;
    });

    expect(isInvalid).toBeTruthy();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByPlaceholder(/contraseña/i);
    const toggleButton = page.locator('button').filter({ hasText: /👁/ });

    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'text');
    }
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Fill form
    await page.getByPlaceholder(/email/i).fill('test@chronos.com');
    await page.getByPlaceholder(/contraseña/i).fill('password123');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Wait for redirect to dashboard
    await page.waitForURL(/dashboard/i, { timeout: 10000 });

    // Check dashboard loaded
    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });

  test('should toggle between login and register', async ({ page }) => {
    // Click register link
    await page.getByText(/regístrate/i).click();

    // Check register form
    await expect(page.getByText(/crear cuenta/i)).toBeVisible();
    await expect(page.getByPlaceholder(/nombre completo/i)).toBeVisible();

    // Toggle back to login
    await page.getByText(/inicia sesión/i).click();
    await expect(page.getByText(/bienvenido de vuelta/i)).toBeVisible();
  });

  test('should show remember me checkbox', async ({ page }) => {
    const rememberCheckbox = page.getByText(/recordarme/i);
    await expect(rememberCheckbox).toBeVisible();
  });

  test('should have social login buttons', async ({ page }) => {
    await expect(page.getByText(/google/i)).toBeVisible();
    await expect(page.getByText(/microsoft/i)).toBeVisible();
  });

  test('should display CHRONOS logo', async ({ page }) => {
    // Check for logo SVG
    const logo = page.locator('svg').first();
    await expect(logo).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
  });
});

test.describe('Login Flow - Error Handling', () => {
  test('should show loading state', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder(/email/i).fill('test@chronos.com');
    await page.getByPlaceholder(/contraseña/i).fill('password123');

    const submitButton = page.getByRole('button', { name: /iniciar sesión/i });
    await submitButton.click();

    // Check for loading state
    await expect(page.getByText(/cargando/i)).toBeVisible({ timeout: 2000 });
  });
});
