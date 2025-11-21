/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║            CHRONOS E2E TESTS - INVENTARIO PAGE                             ║
 * ║ Tests comprehensivos para gestión de inventario con clasificación ABC     ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */
import { expect, test } from '@playwright/test';

test.describe('InventarioPage - Sistema Completo de Inventario', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chronos/inventario');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Carga Inicial y Visualización', () => {
    test('debe cargar la página correctamente con todos los elementos', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /inventario/i })).toBeVisible();

      // Verificar métricas dashboard (4 cards)
      await expect(page.locator('[data-testid="metric-total-productos"]')).toBeVisible();
      await expect(page.locator('[data-testid="metric-valor-total"]')).toBeVisible();
      await expect(page.locator('[data-testid="metric-productos-criticos"]')).toBeVisible();
      await expect(page.locator('[data-testid="metric-rotacion-promedio"]')).toBeVisible();

      // Verificar tabs (Tabla y Análisis)
      await expect(page.getByRole('tab', { name: /tabla/i })).toBeVisible();
      await expect(page.getByRole('tab', { name: /análisis/i })).toBeVisible();

      // Verificar botón agregar producto
      await expect(page.getByRole('button', { name: /agregar producto/i })).toBeVisible();
    });

    test('debe mostrar 7 productos demo iniciales', async ({ page }) => {
      const rows = page.locator('[data-testid="producto-row"]');
      await expect(rows).toHaveCount(7);

      // Verificar primer producto (Whisky Black Label)
      const firstRow = rows.first();
      await expect(firstRow).toContainText('Whisky Black Label');
      await expect(firstRow).toContainText('SKU-2024-001');
      await expect(firstRow).toContainText('245'); // Stock
    });

    test('debe mostrar columnas correctas en la tabla', async ({ page }) => {
      const headers = [
        'Código',
        'Producto',
        'Categoría',
        'Almacén',
        'Stock',
        'Precio',
        'Clasificación',
        'Rotación',
        'Estado',
        'Acciones',
      ];

      for (const header of headers) {
        await expect(
          page.getByRole('columnheader', { name: new RegExp(header, 'i') })
        ).toBeVisible();
      }
    });

    test('debe renderizar badges de clasificación ABC', async ({ page }) => {
      // Verificar badges A, B, C
      await expect(page.locator('[data-testid="badge-abc-a"]').first()).toBeVisible();

      // Verificar colores diferentes para cada clasificación
      const badgeA = page.locator('[data-testid="badge-abc-a"]').first();
      const classA = await badgeA.getAttribute('class');
      expect(classA).toMatch(/bg-(blue|purple|indigo)/);
    });

    test('debe renderizar badges de estado de stock', async ({ page }) => {
      // Estados: disponible, stock-bajo, crítico, agotado
      const estados = ['badge-disponible', 'badge-stock-bajo', 'badge-critico', 'badge-agotado'];

      for (const estado of estados) {
        const badge = page.locator(`[data-testid="${estado}"]`);
        if ((await badge.count()) > 0) {
          await expect(badge.first()).toBeVisible();
        }
      }
    });

    test('debe calcular métricas correctamente', async ({ page }) => {
      // Total Productos
      const totalText = await page
        .locator('[data-testid="metric-total-productos"] .text-3xl')
        .textContent();
      expect(parseInt(totalText || '0')).toBe(7);

      // Valor Total ($272K basado en PRODUCTOS_INVENTARIO)
      const valorText = await page
        .locator('[data-testid="metric-valor-total"] .text-3xl')
        .textContent();
      expect(valorText).toContain('$');
      expect(valorText).toContain('272');

      // Productos Críticos
      const criticosText = await page
        .locator('[data-testid="metric-productos-criticos"] .text-3xl')
        .textContent();
      expect(parseInt(criticosText || '0')).toBeGreaterThanOrEqual(0);

      // Rotación Promedio (8.75 según datos)
      const rotacionText = await page
        .locator('[data-testid="metric-rotacion-promedio"] .text-3xl')
        .textContent();
      expect(rotacionText).toContain('8.75');
    });
  });

  test.describe('Sistema de Filtros', () => {
    test('debe filtrar productos por búsqueda de nombre', async ({ page }) => {
      const searchInput = page.getByPlaceholder(/buscar producto/i);
      await searchInput.fill('Whisky');

      await page.waitForTimeout(300);

      // Verificar que solo aparecen productos con "Whisky"
      const rows = page.locator('[data-testid="producto-row"]');
      const count = await rows.count();

      for (let i = 0; i < count; i++) {
        const row = rows.nth(i);
        await expect(row).toContainText(/whisky/i);
      }
    });

    test('debe filtrar productos por almacén', async ({ page }) => {
      await page.getByTestId('filter-almacen').click();
      await page.getByRole('option', { name: /almacén principal/i }).click();

      await page.waitForTimeout(300);

      // Verificar que solo aparecen productos del almacén seleccionado
      const rows = page.locator('[data-testid="producto-row"]');
      const count = await rows.count();

      for (let i = 0; i < count; i++) {
        const row = rows.nth(i);
        await expect(row).toContainText(/almacén principal/i);
      }
    });

    test('debe filtrar productos por categoría', async ({ page }) => {
      await page.getByTestId('filter-categoria').click();
      await page.getByRole('option', { name: /licores premium/i }).click();

      await page.waitForTimeout(300);

      const rows = page.locator('[data-testid="producto-row"]');
      const count = await rows.count();

      for (let i = 0; i < count; i++) {
        const row = rows.nth(i);
        await expect(row).toContainText(/licores premium/i);
      }
    });

    test('debe filtrar productos por estado de stock', async ({ page }) => {
      await page.getByTestId('filter-estado').click();
      await page.getByRole('option', { name: /disponible/i }).click();

      await page.waitForTimeout(300);

      // Verificar que solo aparecen productos disponibles
      const badges = page.locator('[data-testid="badge-disponible"]');
      const count = await badges.count();
      expect(count).toBeGreaterThan(0);
    });

    test('debe filtrar productos por clasificación ABC', async ({ page }) => {
      await page.getByTestId('filter-clasificacion').click();
      await page.getByRole('option', { name: /categoría a/i }).click();

      await page.waitForTimeout(300);

      // Verificar que solo aparecen productos categoría A
      const badgesA = page.locator('[data-testid="badge-abc-a"]');
      const rows = page.locator('[data-testid="producto-row"]');
      const rowCount = await rows.count();
      const badgeCount = await badgesA.count();

      expect(badgeCount).toBe(rowCount);
    });

    test('debe permitir múltiples filtros simultáneos', async ({ page }) => {
      // Aplicar búsqueda + categoría + clasificación
      await page.getByPlaceholder(/buscar producto/i).fill('Corona');

      await page.getByTestId('filter-categoria').click();
      await page.getByRole('option', { name: /cervezas/i }).click();

      await page.getByTestId('filter-clasificacion').click();
      await page.getByRole('option', { name: /categoría a/i }).click();

      await page.waitForTimeout(500);

      // Verificar resultados filtrados
      const rows = page.locator('[data-testid="producto-row"]');
      await expect(rows).toHaveCount(1);
      await expect(rows.first()).toContainText('Corona');
    });

    test('debe limpiar filtros correctamente', async ({ page }) => {
      // Aplicar filtros
      await page.getByPlaceholder(/buscar producto/i).fill('Test');
      await page.getByTestId('filter-categoria').click();
      await page.getByRole('option', { name: /licores premium/i }).click();

      // Resetear
      await page.getByRole('button', { name: /limpiar filtros/i }).click();

      await page.waitForTimeout(300);

      // Verificar que vuelven todos los productos
      const rows = page.locator('[data-testid="producto-row"]');
      await expect(rows).toHaveCount(7);
    });
  });

  test.describe('CRUD - Crear Producto', () => {
    test('debe abrir modal de crear producto', async ({ page }) => {
      await page.getByRole('button', { name: /agregar producto/i }).click();

      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByRole('heading', { name: /agregar nuevo producto/i })).toBeVisible();

      // Verificar campos del formulario (10 campos)
      await expect(page.getByLabel(/código/i)).toBeVisible();
      await expect(page.getByLabel(/nombre/i)).toBeVisible();
      await expect(page.getByLabel(/categoría/i)).toBeVisible();
      await expect(page.getByLabel(/almacén/i)).toBeVisible();
      await expect(page.getByLabel(/stock/i)).toBeVisible();
      await expect(page.getByLabel(/stock mínimo/i)).toBeVisible();
      await expect(page.getByLabel(/precio compra/i)).toBeVisible();
      await expect(page.getByLabel(/precio venta/i)).toBeVisible();
      await expect(page.getByLabel(/unidad de medida/i)).toBeVisible();
      await expect(page.getByLabel(/proveedor/i)).toBeVisible();
    });

    test('debe validar campos requeridos', async ({ page }) => {
      await page.getByRole('button', { name: /agregar producto/i }).click();

      // Intentar guardar sin llenar
      await page.getByRole('button', { name: /guardar/i }).click();

      // Verificar validaciones
      await expect(page.getByText(/código es requerido/i)).toBeVisible();
      await expect(page.getByText(/nombre es requerido/i)).toBeVisible();
      await expect(page.getByText(/stock es requerido/i)).toBeVisible();
    });

    test('debe validar que stock sea numérico positivo', async ({ page }) => {
      await page.getByRole('button', { name: /agregar producto/i }).click();

      // Ingresar valor negativo
      await page.getByLabel(/stock/i).fill('-10');
      await page.getByLabel(/nombre/i).click(); // Blur

      await expect(page.getByText(/stock debe ser positivo/i)).toBeVisible();
    });

    test('debe validar que precio venta > precio compra', async ({ page }) => {
      await page.getByRole('button', { name: /agregar producto/i }).click();

      await page.getByLabel(/precio compra/i).fill('500');
      await page.getByLabel(/precio venta/i).fill('400');
      await page.getByRole('button', { name: /guardar/i }).click();

      await expect(page.getByText(/precio de venta debe ser mayor/i)).toBeVisible();
    });

    test('debe crear producto correctamente', async ({ page }) => {
      await page.getByRole('button', { name: /agregar producto/i }).click();

      // Llenar formulario completo
      await page.getByLabel(/código/i).fill('SKU-TEST-001');
      await page.getByLabel(/nombre/i).fill('Producto Test');
      await page.getByLabel(/categoría/i).selectOption('Categoría Test');
      await page.getByLabel(/almacén/i).selectOption('Almacén Principal');
      await page.getByLabel(/stock/i).fill('100');
      await page.getByLabel(/stock mínimo/i).fill('20');
      await page.getByLabel(/precio compra/i).fill('100');
      await page.getByLabel(/precio venta/i).fill('150');
      await page.getByLabel(/unidad de medida/i).selectOption('unidad');
      await page.getByLabel(/proveedor/i).fill('Proveedor Test');

      // Guardar
      await page.getByRole('button', { name: /guardar/i }).click();

      // Verificar toast de éxito
      await expect(page.getByText(/producto creado exitosamente/i)).toBeVisible();

      // Verificar que aparece en la tabla
      await expect(page.getByText('Producto Test')).toBeVisible();
    });

    test('debe calcular clasificación ABC automáticamente', async ({ page }) => {
      // Al crear producto, el sistema debería asignar clasificación ABC basado en valor/rotación
      await page.getByRole('button', { name: /agregar producto/i }).click();

      await page.getByLabel(/código/i).fill('SKU-ABC-TEST');
      await page.getByLabel(/nombre/i).fill('Producto ABC Test');
      await page.getByLabel(/stock/i).fill('500');
      await page.getByLabel(/precio compra/i).fill('1000');
      await page.getByLabel(/precio venta/i).fill('1500');

      await page.getByRole('button', { name: /guardar/i }).click();

      await page.waitForTimeout(500);

      // Buscar el nuevo producto
      await page.getByPlaceholder(/buscar producto/i).fill('ABC Test');
      await page.waitForTimeout(300);

      // Verificar que tiene badge ABC (A, B o C)
      const row = page.locator('[data-testid="producto-row"]').first();
      const hasABC = await row.locator('[data-testid^="badge-abc-"]').count();
      expect(hasABC).toBeGreaterThan(0);
    });
  });

  test.describe('CRUD - Editar Producto', () => {
    test('debe abrir modal de editar con datos pre-cargados', async ({ page }) => {
      await page
        .locator('[data-testid="producto-row"]')
        .first()
        .getByRole('button', { name: /editar/i })
        .click();

      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByRole('heading', { name: /editar producto/i })).toBeVisible();

      // Verificar datos pre-cargados
      const codigoInput = page.getByLabel(/código/i);
      const codigo = await codigoInput.inputValue();
      expect(codigo).toBe('SKU-2024-001');

      const nombreInput = page.getByLabel(/nombre/i);
      const nombre = await nombreInput.inputValue();
      expect(nombre).toContain('Whisky');
    });

    test('debe actualizar producto correctamente', async ({ page }) => {
      await page
        .locator('[data-testid="producto-row"]')
        .first()
        .getByRole('button', { name: /editar/i })
        .click();

      // Cambiar stock
      await page.getByLabel(/stock/i).clear();
      await page.getByLabel(/stock/i).fill('300');

      // Cambiar precio venta
      await page.getByLabel(/precio venta/i).clear();
      await page.getByLabel(/precio venta/i).fill('750');

      await page.getByRole('button', { name: /actualizar/i }).click();

      await expect(page.getByText(/producto actualizado/i)).toBeVisible();

      // Verificar cambios en la tabla
      const row = page.locator('[data-testid="producto-row"]').first();
      await expect(row).toContainText('300');
      await expect(row).toContainText('750');
    });

    test('debe recalcular clasificación ABC al editar', async ({ page }) => {
      await page
        .locator('[data-testid="producto-row"]')
        .first()
        .getByRole('button', { name: /editar/i })
        .click();

      // Cambiar significativamente el stock (afecta clasificación)
      await page.getByLabel(/stock/i).clear();
      await page.getByLabel(/stock/i).fill('10');

      await page.getByRole('button', { name: /actualizar/i }).click();

      await page.waitForTimeout(500);

      // La clasificación ABC podría cambiar
      const row = page.locator('[data-testid="producto-row"]').first();
      const badge = row.locator('[data-testid^="badge-abc-"]');
      await expect(badge).toBeVisible();
    });
  });

  test.describe('CRUD - Eliminar Producto', () => {
    test('debe mostrar confirmación antes de eliminar', async ({ page }) => {
      await page
        .locator('[data-testid="producto-row"]')
        .last()
        .getByRole('button', { name: /eliminar/i })
        .click();

      await expect(page.getByText(/¿estás seguro.*eliminar.*producto/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /confirmar/i })).toBeVisible();
    });

    test('debe eliminar producto correctamente', async ({ page }) => {
      const initialCount = await page.locator('[data-testid="producto-row"]').count();

      await page
        .locator('[data-testid="producto-row"]')
        .last()
        .getByRole('button', { name: /eliminar/i })
        .click();

      await page.getByRole('button', { name: /confirmar/i }).click();

      await expect(page.getByText(/producto eliminado/i)).toBeVisible();

      await expect(page.locator('[data-testid="producto-row"]')).toHaveCount(initialCount - 1);
    });

    test('debe cancelar eliminación correctamente', async ({ page }) => {
      const initialCount = await page.locator('[data-testid="producto-row"]').count();

      await page
        .locator('[data-testid="producto-row"]')
        .last()
        .getByRole('button', { name: /eliminar/i })
        .click();

      await page.getByRole('button', { name: /cancelar/i }).click();

      await expect(page.locator('[data-testid="producto-row"]')).toHaveCount(initialCount);
    });
  });

  test.describe('Tab de Análisis', () => {
    test('debe cambiar a tab de análisis correctamente', async ({ page }) => {
      await page.getByRole('tab', { name: /análisis/i }).click();

      await expect(page.getByTestId('analisis-view')).toBeVisible();

      // Verificar gráficas de análisis
      await expect(page.locator('.recharts-wrapper')).toBeVisible();
    });

    test('debe mostrar PieChart de clasificación ABC', async ({ page }) => {
      await page.getByRole('tab', { name: /análisis/i }).click();

      // Verificar PieChart
      const pieChart = page.locator('.recharts-pie');
      await expect(pieChart.first()).toBeVisible();

      // Verificar leyendas A, B, C
      await expect(page.getByText(/categoría a/i)).toBeVisible();
      await expect(page.getByText(/categoría b/i)).toBeVisible();
      await expect(page.getByText(/categoría c/i)).toBeVisible();
    });

    test('debe mostrar BarChart de top 10 rotación', async ({ page }) => {
      await page.getByRole('tab', { name: /análisis/i }).click();

      // Verificar BarChart de rotación
      const barChart = page.locator('.recharts-bar-rectangle');
      await expect(barChart.first()).toBeVisible();

      // Debe mostrar máximo 10 productos
      const bars = page.locator('.recharts-bar-rectangle');
      const count = await bars.count();
      expect(count).toBeLessThanOrEqual(10);
    });

    test('debe mostrar tooltip al hover sobre gráficas', async ({ page }) => {
      await page.getByRole('tab', { name: /análisis/i }).click();

      const pieChart = page.locator('.recharts-pie').first();
      await pieChart.hover();

      await page.waitForTimeout(300);

      const tooltip = page.locator('.recharts-tooltip-wrapper');
      if ((await tooltip.count()) > 0) {
        await expect(tooltip).toBeVisible();
      }
    });

    test('debe mostrar métricas de análisis', async ({ page }) => {
      await page.getByRole('tab', { name: /análisis/i }).click();

      // Métricas de análisis
      await expect(page.getByText(/distribución abc/i)).toBeVisible();
      await expect(page.getByText(/top productos/i)).toBeVisible();
      await expect(page.getByText(/rotación/i)).toBeVisible();
    });

    test('debe permitir exportar análisis', async ({ page }) => {
      await page.getByRole('tab', { name: /análisis/i }).click();

      const exportButton = page.getByRole('button', { name: /exportar análisis/i });
      if ((await exportButton.count()) > 0) {
        await exportButton.click();

        // Verificar modal o inicio de descarga
        const modal = page.getByRole('dialog');
        if ((await modal.count()) > 0) {
          await expect(modal).toBeVisible();
        }
      }
    });
  });

  test.describe('Alertas de Stock', () => {
    test('debe mostrar badge de alerta en productos con stock bajo', async ({ page }) => {
      // Productos con stock < stockMinimo deberían tener badge de alerta
      const alertBadges = page.locator('[data-testid="badge-stock-bajo"]');
      if ((await alertBadges.count()) > 0) {
        await expect(alertBadges.first()).toBeVisible();

        // Verificar color de alerta (amarillo/naranja)
        const badge = alertBadges.first();
        const classAttr = await badge.getAttribute('class');
        expect(classAttr).toMatch(/bg-(yellow|orange)/);
      }
    });

    test('debe mostrar badge crítico en productos con stock crítico', async ({ page }) => {
      const criticoBadges = page.locator('[data-testid="badge-critico"]');
      if ((await criticoBadges.count()) > 0) {
        await expect(criticoBadges.first()).toBeVisible();

        // Verificar color rojo
        const badge = criticoBadges.first();
        const classAttr = await badge.getAttribute('class');
        expect(classAttr).toMatch(/bg-red/);
      }
    });

    test('debe mostrar badge agotado en productos sin stock', async ({ page }) => {
      const agotadoBadges = page.locator('[data-testid="badge-agotado"]');
      if ((await agotadoBadges.count()) > 0) {
        await expect(agotadoBadges.first()).toBeVisible();

        // Verificar que stock es 0
        const row = agotadoBadges.first().locator('xpath=ancestor::tr');
        await expect(row).toContainText('0');
      }
    });

    test('debe actualizar contador de productos críticos en métricas', async ({ page }) => {
      const criticosCount = await page
        .locator('[data-testid="metric-productos-criticos"] .text-3xl')
        .textContent();
      const count = parseInt(criticosCount || '0');

      // Crear producto con stock crítico
      await page.getByRole('button', { name: /agregar producto/i }).click();
      await page.getByLabel(/código/i).fill('SKU-CRITICO-001');
      await page.getByLabel(/nombre/i).fill('Producto Crítico Test');
      await page.getByLabel(/stock/i).fill('5');
      await page.getByLabel(/stock mínimo/i).fill('50');
      await page.getByLabel(/precio compra/i).fill('100');
      await page.getByLabel(/precio venta/i).fill('150');
      await page.getByRole('button', { name: /guardar/i }).click();

      await page.waitForTimeout(500);

      // Verificar que se incrementó el contador
      const newCriticosCount = await page
        .locator('[data-testid="metric-productos-criticos"] .text-3xl')
        .textContent();
      const newCount = parseInt(newCriticosCount || '0');
      expect(newCount).toBe(count + 1);
    });
  });

  test.describe('Cálculo de Rotación', () => {
    test('debe mostrar índice de rotación en cada producto', async ({ page }) => {
      const rows = page.locator('[data-testid="producto-row"]');
      const firstRow = rows.first();

      // Verificar que tiene columna de rotación
      const rotacionCell = firstRow.locator('[data-testid="rotacion-cell"]');
      if ((await rotacionCell.count()) > 0) {
        await expect(rotacionCell).toBeVisible();

        const rotacionText = await rotacionCell.textContent();
        expect(parseFloat(rotacionText || '0')).toBeGreaterThan(0);
      }
    });

    test('debe calcular rotación promedio correctamente en métricas', async ({ page }) => {
      const rotacionPromedio = await page
        .locator('[data-testid="metric-rotacion-promedio"] .text-3xl')
        .textContent();
      expect(parseFloat(rotacionPromedio || '0')).toBe(8.75); // Basado en PRODUCTOS_INVENTARIO
    });

    test('debe ordenar por rotación', async ({ page }) => {
      // Ordenar tabla por rotación descendente
      await page.getByRole('columnheader', { name: /rotación/i }).click();

      await page.waitForTimeout(300);

      // Verificar que primer producto tiene la rotación más alta
      const firstRotacion = await page
        .locator('[data-testid="producto-row"]')
        .first()
        .locator('[data-testid="rotacion-cell"]')
        .textContent();

      expect(parseFloat(firstRotacion || '0')).toBeGreaterThan(8);
    });
  });

  test.describe('Responsive Design', () => {
    test('debe funcionar en mobile (375px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await expect(page.getByRole('heading', { name: /inventario/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /agregar producto/i })).toBeVisible();

      // En mobile puede cambiar a vista de cards
      const isMobile = (await page.locator('[data-testid="mobile-card-view"]').count()) > 0;
      if (isMobile) {
        await expect(page.locator('[data-testid="mobile-card-view"]')).toBeVisible();
      }
    });

    test('debe funcionar en tablet (768px)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await expect(page.locator('[data-testid="inventario-table"]')).toBeVisible();
      await expect(page.getByRole('tab', { name: /análisis/i })).toBeVisible();
    });

    test('debe funcionar en desktop (1920px)', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      // Todas las columnas visibles
      const headers = page.locator('th');
      const count = await headers.count();
      expect(count).toBeGreaterThanOrEqual(10);
    });
  });

  test.describe('Performance', () => {
    test('debe cargar en menos de 3 segundos', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/chronos/inventario');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(3000);
    });

    test('debe renderizar gráficas de análisis sin lag', async ({ page }) => {
      await page.getByRole('tab', { name: /análisis/i }).click();

      // Cambiar entre tabs rápidamente
      await page.getByRole('tab', { name: /tabla/i }).click();
      await page.waitForTimeout(100);

      await page.getByRole('tab', { name: /análisis/i }).click();
      await page.waitForTimeout(100);

      const chart = page.locator('.recharts-wrapper');
      await expect(chart).toBeVisible();
    });
  });

  test.describe('Integración con Firestore', () => {
    test('debe actualizar métricas en tiempo real', async ({ page }) => {
      // Capturar valor inicial
      const initialTotal = await page
        .locator('[data-testid="metric-total-productos"] .text-3xl')
        .textContent();
      const initialCount = parseInt(initialTotal || '0');

      // Agregar producto
      await page.getByRole('button', { name: /agregar producto/i }).click();
      await page.getByLabel(/código/i).fill('SKU-REALTIME-001');
      await page.getByLabel(/nombre/i).fill('Producto Realtime');
      await page.getByLabel(/stock/i).fill('100');
      await page.getByLabel(/precio compra/i).fill('100');
      await page.getByLabel(/precio venta/i).fill('150');
      await page.getByRole('button', { name: /guardar/i }).click();

      await page.waitForTimeout(1000);

      // Verificar actualización
      const newTotal = await page
        .locator('[data-testid="metric-total-productos"] .text-3xl')
        .textContent();
      const newCount = parseInt(newTotal || '0');
      expect(newCount).toBe(initialCount + 1);
    });
  });

  test.describe('Accesibilidad', () => {
    test('debe tener navegación por teclado', async ({ page }) => {
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(['BUTTON', 'INPUT']).toContain(focused);
    });

    test('debe tener labels en formulario', async ({ page }) => {
      await page.getByRole('button', { name: /agregar producto/i }).click();

      await expect(page.getByLabel(/código/i)).toBeVisible();
      await expect(page.getByLabel(/nombre/i)).toBeVisible();
      await expect(page.getByLabel(/stock/i)).toBeVisible();
    });
  });

  test.describe('Casos Edge', () => {
    test('debe manejar búsqueda sin resultados', async ({ page }) => {
      await page.getByPlaceholder(/buscar producto/i).fill('PRODUCTO INEXISTENTE XYZ999');
      await page.waitForTimeout(300);

      await expect(page.getByText(/no se encontraron productos/i)).toBeVisible();
    });

    test('debe manejar caracteres especiales en búsqueda', async ({ page }) => {
      await page.getByPlaceholder(/buscar producto/i).fill('@#$%^&*()');
      await page.waitForTimeout(300);

      // No debería crashear
      await expect(page.locator('[data-testid="inventario-table"]')).toBeVisible();
    });

    test('debe validar código SKU duplicado', async ({ page }) => {
      await page.getByRole('button', { name: /agregar producto/i }).click();

      // Intentar usar código existente
      await page.getByLabel(/código/i).fill('SKU-2024-001');
      await page.getByLabel(/nombre/i).fill('Producto Duplicado');
      await page.getByLabel(/stock/i).fill('100');
      await page.getByLabel(/precio compra/i).fill('100');
      await page.getByLabel(/precio venta/i).fill('150');
      await page.getByRole('button', { name: /guardar/i }).click();

      // Debería mostrar error de duplicado
      await expect(page.getByText(/código ya existe/i)).toBeVisible();
    });
  });
});
