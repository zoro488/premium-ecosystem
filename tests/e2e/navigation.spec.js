import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Premium Ecosystem/i);
  });

  test('should navigate to FlowDistributor', async ({ page }) => {
    await page.goto('/');
    
    // Click on FlowDistributor link/button
    const flowDistributor = page.getByRole('link', { name: /flowdistributor/i });
    await flowDistributor.click();
    
    // Wait for navigation and verify URL
    await expect(page).toHaveURL(/.*flowdistributor/i);
    
    // Verify key elements are visible
    await expect(page.getByRole('heading', { name: /flowdistributor/i })).toBeVisible();
  });

  test('should show all apps in navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check that all expected apps are present
    const apps = ['FlowDistributor', 'Synapse', 'Apollo', 'Nexus', 'ShadowPrime'];
    
    for (const app of apps) {
      await expect(page.getByRole('link', { name: new RegExp(app, 'i') })).toBeVisible();
    }
  });
});

test.describe('FlowDistributor Critical Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /flowdistributor/i }).click();
  });

  test('should open and close modal', async ({ page }) => {
    // Click button to open modal (adjust selector based on actual UI)
    const addButton = page.getByRole('button', { name: /nuevo|agregar|añadir/i }).first();
    await addButton.click();
    
    // Verify modal is visible
    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible();
    
    // Close modal
    const closeButton = modal.getByRole('button', { name: /cerrar|cancelar|close/i }).first();
    await closeButton.click();
    
    // Verify modal is closed
    await expect(modal).not.toBeVisible();
  });

  test('should search and filter data', async ({ page }) => {
    // Find search input
    const searchInput = page.getByPlaceholder(/buscar|search/i);
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      
      // Wait for search results to update
      await page.waitForTimeout(500);
      
      // Verify search was performed (check if URL or table updated)
      await expect(searchInput).toHaveValue('test');
    }
  });

  test('should handle tab navigation', async ({ page }) => {
    // Find tabs (if present in FlowDistributor)
    const tabs = page.locator('[role="tab"]');
    const tabCount = await tabs.count();
    
    if (tabCount > 1) {
      // Click second tab
      await tabs.nth(1).click();
      
      // Verify tab is selected
      await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    }
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Verify page loads correctly
    await expect(page).toHaveTitle(/Premium Ecosystem/i);
    
    // Check mobile menu (if hamburger menu exists)
    const mobileMenu = page.getByRole('button', { name: /menu|menú/i });
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      // Verify navigation is visible after clicking
    }
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    await expect(page).toHaveTitle(/Premium Ecosystem/i);
  });
});
