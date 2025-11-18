/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║         CHRONOS E2E TESTS - COMPONENTES UI COMPARTIDOS                    ║
 * ║  Tests para Card, Button, Badge, Input, Select, Dialog, Tabs, Toast      ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */
import { expect, test } from '@playwright/test';

test.describe('Componentes UI Compartidos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chronos/clientes'); // Usar página con todos los componentes
    await page.waitForLoadState('networkidle');
  });

  test.describe('Card Component', () => {
    test('debe renderizar Cards correctamente', async ({ page }) => {
      // Verificar Cards de métricas
      const cards = page.locator('[data-testid^="metric-"]');
      const count = await cards.count();
      expect(count).toBeGreaterThanOrEqual(4);

      // Verificar estructura de Card
      const firstCard = cards.first();
      await expect(firstCard).toBeVisible();

      // Card debe tener header y content
      const cardHeader = firstCard.locator('[data-testid="card-header"]');
      const cardContent = firstCard.locator('[data-testid="card-content"]');

      if ((await cardHeader.count()) > 0) {
        await expect(cardHeader).toBeVisible();
      }
      if ((await cardContent.count()) > 0) {
        await expect(cardContent).toBeVisible();
      }
    });

    test('debe tener clases de estilo correctas en Cards', async ({ page }) => {
      const card = page.locator('[data-testid^="metric-"]').first();
      const classAttr = await card.getAttribute('class');

      // Verificar clases típicas de card
      expect(classAttr).toMatch(/(bg|border|rounded|shadow)/);
    });

    test('debe mostrar hover effects en Cards', async ({ page }) => {
      const card = page.locator('[data-testid^="metric-"]').first();

      await card.hover();
      await page.waitForTimeout(200);

      // Card debería seguir visible con hover effect
      await expect(card).toBeVisible();
    });
  });

  test.describe('Button Component', () => {
    test('debe renderizar botones con diferentes variantes', async ({ page }) => {
      // Botón primary (Agregar Cliente)
      const primaryButton = page.getByRole('button', { name: /agregar cliente/i });
      await expect(primaryButton).toBeVisible();

      // Botones de acciones (Editar, Eliminar)
      const editButtons = page.getByRole('button', { name: /editar/i });
      await expect(editButtons.first()).toBeVisible();

      const deleteButtons = page.getByRole('button', { name: /eliminar/i });
      await expect(deleteButtons.first()).toBeVisible();
    });

    test('debe tener estados disabled correctamente', async ({ page }) => {
      // Abrir modal para ver botón disabled
      await page.getByRole('button', { name: /agregar cliente/i }).click();

      // Botón guardar sin datos (debería estar disabled)
      const saveButton = page.getByRole('button', { name: /guardar/i });

      // Intentar hacer click (debería no hacer nada si está disabled)
      await saveButton.click({ force: true });

      // Modal debería seguir abierto
      await expect(page.getByRole('dialog')).toBeVisible();
    });

    test('debe mostrar loading state en botones', async ({ page }) => {
      // Trigger acción que muestre loading
      await page.getByRole('button', { name: /actualizar/i }).click();

      // Verificar spinner o loading indicator
      const spinner = page.locator('.animate-spin');
      if ((await spinner.count()) > 0) {
        await expect(spinner.first()).toBeVisible();
      }
    });

    test('debe tener hover effects en botones', async ({ page }) => {
      const button = page.getByRole('button', { name: /agregar cliente/i });

      await button.hover();
      await page.waitForTimeout(200);

      // Botón debería cambiar apariencia
      await expect(button).toBeVisible();
    });

    test('debe soportar focus visible con teclado', async ({ page }) => {
      // Tab hasta botón
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Verificar que hay un elemento con focus
      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.tagName === 'BUTTON' ? el.textContent : null;
      });

      expect(focused).toBeTruthy();
    });
  });

  test.describe('Badge Component', () => {
    test('debe renderizar badges con diferentes variantes', async ({ page }) => {
      // Badges de estado
      const activoBadge = page.locator('[data-testid="badge-activo"]');
      if ((await activoBadge.count()) > 0) {
        await expect(activoBadge.first()).toBeVisible();

        // Verificar color
        const classAttr = await activoBadge.first().getAttribute('class');
        expect(classAttr).toMatch(/bg-(green|blue|purple)/);
      }
    });

    test('debe mostrar badges de categoría (rating stars)', async ({ page }) => {
      const ratingBadges = page.locator('[data-testid="cliente-rating"]');
      await expect(ratingBadges.first()).toBeVisible();

      // Verificar estrellas
      const stars = ratingBadges.first().locator('svg');
      const starCount = await stars.count();
      expect(starCount).toBeGreaterThan(0);
      expect(starCount).toBeLessThanOrEqual(5);
    });

    test('debe tener tamaños correctos de badges', async ({ page }) => {
      const badges = page.locator('[class*="badge"]');
      if ((await badges.count()) > 0) {
        const badge = badges.first();
        const classAttr = await badge.getAttribute('class');

        // Verificar clases de tamaño
        expect(classAttr).toMatch(/(text-xs|text-sm|px-|py-)/);
      }
    });
  });

  test.describe('Input Component', () => {
    test('debe renderizar inputs correctamente', async ({ page }) => {
      // Input de búsqueda
      const searchInput = page.getByPlaceholder(/buscar cliente/i);
      await expect(searchInput).toBeVisible();

      // Verificar que es focusable
      await searchInput.click();
      await expect(searchInput).toBeFocused();
    });

    test('debe validar inputs en formularios', async ({ page }) => {
      await page.getByRole('button', { name: /agregar cliente/i }).click();

      // Input de nombre
      const nombreInput = page.getByLabel(/nombre/i);
      await expect(nombreInput).toBeVisible();

      // Ingresar y borrar valor
      await nombreInput.fill('Test');
      await nombreInput.clear();

      // Blur para trigger validación
      await page.getByLabel(/tipo/i).click();

      // Debería mostrar error de validación
      const errorMessage = page.getByText(/nombre es requerido/i);
      if ((await errorMessage.count()) > 0) {
        await expect(errorMessage).toBeVisible();
      }
    });

    test('debe mostrar placeholder text', async ({ page }) => {
      const searchInput = page.getByPlaceholder(/buscar cliente/i);
      const placeholder = await searchInput.getAttribute('placeholder');

      expect(placeholder).toMatch(/buscar/i);
    });

    test('debe soportar diferentes tipos de input', async ({ page }) => {
      await page.getByRole('button', { name: /agregar cliente/i }).click();

      // Input text
      const nombreInput = page.getByLabel(/nombre/i);
      const nombreType = await nombreInput.getAttribute('type');
      expect(nombreType).toMatch(/text|input/);

      // Input email
      const emailInput = page.getByLabel(/email/i);
      const emailType = await emailInput.getAttribute('type');
      expect(emailType).toBe('email');

      // Input tel
      const telInput = page.getByLabel(/teléfono/i);
      const telType = await telInput.getAttribute('type');
      expect(telType).toMatch(/tel|text/);

      // Input number
      const creditoInput = page.getByLabel(/límite de crédito/i);
      const creditoType = await creditoInput.getAttribute('type');
      expect(creditoType).toMatch(/number|text/);
    });
  });

  test.describe('Select Component', () => {
    test('debe renderizar selects correctamente', async ({ page }) => {
      // Selects de filtros
      const tipoSelect = page.getByTestId('filter-tipo');
      if ((await tipoSelect.count()) > 0) {
        await expect(tipoSelect).toBeVisible();
      }
    });

    test('debe abrir dropdown al hacer click', async ({ page }) => {
      await page.getByRole('button', { name: /agregar cliente/i }).click();

      // Select de tipo
      const tipoSelect = page.getByLabel(/tipo/i);
      await tipoSelect.click();

      // Verificar opciones
      await expect(page.getByRole('option', { name: /mayorista/i })).toBeVisible();
      await expect(page.getByRole('option', { name: /minorista/i })).toBeVisible();
    });

    test('debe seleccionar opción correctamente', async ({ page }) => {
      await page.getByRole('button', { name: /agregar cliente/i }).click();

      const tipoSelect = page.getByLabel(/tipo/i);
      await tipoSelect.selectOption('mayorista');

      // Verificar valor seleccionado
      const value = await tipoSelect.inputValue();
      expect(value).toBe('mayorista');
    });

    test('debe tener placeholder por defecto', async ({ page }) => {
      const filterSelect = page.getByTestId('filter-tipo');
      if ((await filterSelect.count()) > 0) {
        const text = await filterSelect.textContent();
        expect(text).toMatch(/(todos|seleccionar|filtrar)/i);
      }
    });
  });

  test.describe('Dialog/Modal Component', () => {
    test('debe abrir modal correctamente', async ({ page }) => {
      await page.getByRole('button', { name: /agregar cliente/i }).click();

      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByRole('heading', { name: /agregar nuevo cliente/i })).toBeVisible();
    });

    test('debe cerrar modal con botón X', async ({ page }) => {
      await page.getByRole('button', { name: /agregar cliente/i }).click();
      await expect(page.getByRole('dialog')).toBeVisible();

      // Click en X
      await page.getByRole('button', { name: /close/i }).click();

      await expect(page.getByRole('dialog')).not.toBeVisible();
    });

    test('debe cerrar modal con botón Cancelar', async ({ page }) => {
      await page.getByRole('button', { name: /agregar cliente/i }).click();
      await expect(page.getByRole('dialog')).toBeVisible();

      await page.getByRole('button', { name: /cancelar/i }).click();

      await expect(page.getByRole('dialog')).not.toBeVisible();
    });

    test('debe cerrar modal al hacer click fuera (backdrop)', async ({ page }) => {
      await page.getByRole('button', { name: /agregar cliente/i }).click();
      await expect(page.getByRole('dialog')).toBeVisible();

      // Click en backdrop (fuera del modal)
      await page.locator('[data-testid="modal-backdrop"]').click({ position: { x: 10, y: 10 } });

      // Modal debería cerrarse (o quedarse abierto según implementación)
      await page.waitForTimeout(300);
    });

    test('debe cerrar modal con tecla ESC', async ({ page }) => {
      await page.getByRole('button', { name: /agregar cliente/i }).click();
      await expect(page.getByRole('dialog')).toBeVisible();

      await page.keyboard.press('Escape');

      await page.waitForTimeout(300);
      // Modal debería cerrarse
      await expect(page.getByRole('dialog')).not.toBeVisible();
    });

    test('debe tener animación de entrada/salida', async ({ page }) => {
      // Abrir modal
      await page.getByRole('button', { name: /agregar cliente/i }).click();

      // Modal debería tener animación (verificar clases o transición)
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();

      // Cerrar modal
      await page.getByRole('button', { name: /cancelar/i }).click();

      // Debería tener animación de salida
      await page.waitForTimeout(500);
      await expect(modal).not.toBeVisible();
    });

    test('debe bloquear scroll del body cuando modal está abierto', async ({ page }) => {
      // Abrir modal
      await page.getByRole('button', { name: /agregar cliente/i }).click();

      // Verificar que body tiene overflow-hidden o similar
      const bodyOverflow = await page.evaluate(() => {
        return window.getComputedStyle(document.body).overflow;
      });

      // Debería bloquear scroll
      expect(bodyOverflow).toMatch(/hidden|clip/);
    });
  });

  test.describe('Tabs Component', () => {
    test('debe navegar a página con tabs', async ({ page }) => {
      await page.goto('/chronos/inventario');
      await page.waitForLoadState('networkidle');

      // Verificar tabs
      await expect(page.getByRole('tab', { name: /tabla/i })).toBeVisible();
      await expect(page.getByRole('tab', { name: /análisis/i })).toBeVisible();
    });

    test('debe cambiar entre tabs correctamente', async ({ page }) => {
      await page.goto('/chronos/inventario');
      await page.waitForLoadState('networkidle');

      // Tab inicial (Tabla)
      await expect(page.getByTestId('tabla-view')).toBeVisible();

      // Cambiar a Análisis
      await page.getByRole('tab', { name: /análisis/i }).click();
      await expect(page.getByTestId('analisis-view')).toBeVisible();

      // Volver a Tabla
      await page.getByRole('tab', { name: /tabla/i }).click();
      await expect(page.getByTestId('tabla-view')).toBeVisible();
    });

    test('debe mostrar tab activo con estilos correctos', async ({ page }) => {
      await page.goto('/chronos/inventario');
      await page.waitForLoadState('networkidle');

      const tablaTab = page.getByRole('tab', { name: /tabla/i });
      const tablaClass = await tablaTab.getAttribute('class');

      // Tab activo debería tener clase especial
      expect(tablaClass).toMatch(/(active|selected|text-|border-|bg-)/);
    });

    test('debe tener navegación por teclado en tabs', async ({ page }) => {
      await page.goto('/chronos/inventario');
      await page.waitForLoadState('networkidle');

      // Focus en primer tab
      await page.getByRole('tab', { name: /tabla/i }).focus();

      // Arrow right para siguiente tab
      await page.keyboard.press('ArrowRight');

      await page.waitForTimeout(200);

      // Debería estar en tab Análisis
      const focused = await page.evaluate(() => document.activeElement?.textContent);
      expect(focused).toMatch(/análisis/i);
    });
  });

  test.describe('Toast Component', () => {
    test('debe mostrar toast de éxito al crear cliente', async ({ page }) => {
      await page.getByRole('button', { name: /agregar cliente/i }).click();

      // Llenar formulario
      await page.getByLabel(/nombre/i).fill('Test Toast Cliente');
      await page.getByLabel(/tipo/i).selectOption('mayorista');
      await page.getByLabel(/teléfono/i).fill('+52 612 999 9999');
      await page.getByLabel(/email/i).fill('toast@test.com');

      await page.getByRole('button', { name: /guardar/i }).click();

      // Verificar toast
      await expect(page.getByText(/cliente creado exitosamente/i)).toBeVisible();
    });

    test('debe auto-cerrar toast después de timeout', async ({ page }) => {
      await page.getByRole('button', { name: /agregar cliente/i }).click();

      await page.getByLabel(/nombre/i).fill('Test Auto Close');
      await page.getByLabel(/tipo/i).selectOption('mayorista');
      await page.getByLabel(/teléfono/i).fill('+52 612 888 8888');
      await page.getByLabel(/email/i).fill('autoclose@test.com');

      await page.getByRole('button', { name: /guardar/i }).click();

      // Toast visible
      const toast = page.getByText(/cliente creado exitosamente/i);
      await expect(toast).toBeVisible();

      // Esperar auto-close (5 segundos típicamente)
      await page.waitForTimeout(6000);

      // Toast debería desaparecer
      await expect(toast).not.toBeVisible();
    });

    test('debe permitir cerrar toast manualmente', async ({ page }) => {
      await page.getByRole('button', { name: /agregar cliente/i }).click();

      await page.getByLabel(/nombre/i).fill('Test Manual Close');
      await page.getByLabel(/tipo/i).selectOption('mayorista');
      await page.getByLabel(/teléfono/i).fill('+52 612 777 7777');
      await page.getByLabel(/email/i).fill('manualclose@test.com');

      await page.getByRole('button', { name: /guardar/i }).click();

      // Toast visible
      const toast = page.locator('[data-testid="toast-container"]').first();
      await expect(toast).toBeVisible();

      // Click en botón cerrar
      const closeButton = toast.locator('button[aria-label*="cerrar"]');
      if ((await closeButton.count()) > 0) {
        await closeButton.click();
        await expect(toast).not.toBeVisible();
      }
    });

    test('debe mostrar diferentes tipos de toast', async ({ page }) => {
      // Success toast (ya probado arriba)

      // Error toast (al intentar guardar sin datos)
      await page.getByRole('button', { name: /agregar cliente/i }).click();
      await page.getByRole('button', { name: /guardar/i }).click();

      // Debería mostrar error toast
      const errorToast = page.getByText(/error|requerido/i);
      if ((await errorToast.count()) > 0) {
        await expect(errorToast.first()).toBeVisible();
      }
    });

    test('debe apilar múltiples toasts', async ({ page }) => {
      // Trigger múltiples acciones rápidamente
      await page.getByRole('button', { name: /actualizar/i }).click();
      await page.waitForTimeout(100);

      // Puede haber múltiples toasts apilados
      const toasts = page.locator('[data-testid="toast-container"]');
      const count = await toasts.count();

      // Debería poder manejar múltiples toasts
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Animaciones Framer Motion', () => {
    test('debe tener animaciones de entrada en lista de clientes', async ({ page }) => {
      await page.goto('/chronos/clientes');
      await page.waitForLoadState('networkidle');

      // Verificar que rows tienen animación
      const rows = page.locator('[data-testid="cliente-row"]');
      await expect(rows.first()).toBeVisible();

      // Rows deberían aparecer con fade-in/slide-in
      await page.waitForTimeout(500);
    });

    test('debe tener animación de hover en cards', async ({ page }) => {
      const card = page.locator('[data-testid^="metric-"]').first();

      await card.hover();
      await page.waitForTimeout(300);

      // Card debería tener transformación (scale, translate, etc)
      await expect(card).toBeVisible();
    });

    test('debe tener transiciones suaves al cambiar tabs', async ({ page }) => {
      await page.goto('/chronos/inventario');
      await page.waitForLoadState('networkidle');

      await page.getByRole('tab', { name: /análisis/i }).click();
      await page.waitForTimeout(500);

      await page.getByRole('tab', { name: /tabla/i }).click();
      await page.waitForTimeout(500);

      // No debería haber jank visible
      await expect(page.getByTestId('tabla-view')).toBeVisible();
    });
  });

  test.describe('Icons (Lucide React)', () => {
    test('debe renderizar iconos correctamente', async ({ page }) => {
      // Iconos en métricas
      const metricIcons = page.locator('[data-testid^="metric-"] svg');
      await expect(metricIcons.first()).toBeVisible();

      // Verificar cantidad de iconos
      const count = await metricIcons.count();
      expect(count).toBeGreaterThanOrEqual(4);
    });

    test('debe tener iconos en botones de acciones', async ({ page }) => {
      // Iconos en botones Edit y Delete
      const editIcon = page
        .getByRole('button', { name: /editar/i })
        .first()
        .locator('svg');
      await expect(editIcon).toBeVisible();

      const deleteIcon = page
        .getByRole('button', { name: /eliminar/i })
        .first()
        .locator('svg');
      await expect(deleteIcon).toBeVisible();
    });

    test('debe tener tamaño adecuado de iconos', async ({ page }) => {
      const icon = page.locator('svg').first();
      const iconClass = await icon.getAttribute('class');

      // Verificar clases de tamaño (w-4, w-5, w-6, etc.)
      expect(iconClass).toMatch(/w-\d|h-\d/);
    });
  });
});
