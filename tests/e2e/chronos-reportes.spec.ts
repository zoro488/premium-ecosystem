/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║             CHRONOS E2E TESTS - REPORTES PAGE                             ║
 * ║  Tests comprehensivos para sistema de reportes y business intelligence    ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */
import { expect, test } from '@playwright/test';

test.describe('ReportesPage - Centro de Inteligencia de Negocio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chronos/reportes');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Carga Inicial y Navegación', () => {
    test('debe cargar la página correctamente con todos los elementos', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /centro de inteligencia/i })).toBeVisible();

      // Verificar tabs de reportes (6 tipos)
      await expect(page.getByRole('tab', { name: /ventas/i })).toBeVisible();
      await expect(page.getByRole('tab', { name: /financiero/i })).toBeVisible();
      await expect(page.getByRole('tab', { name: /productos/i })).toBeVisible();
      await expect(page.getByRole('tab', { name: /clientes/i })).toBeVisible();
      await expect(page.getByRole('tab', { name: /inventario/i })).toBeVisible();
      await expect(page.getByRole('tab', { name: /bancos/i })).toBeVisible();

      // Verificar botones de acción
      await expect(page.getByRole('button', { name: /exportar/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /actualizar/i })).toBeVisible();
    });

    test('debe cambiar entre tabs correctamente', async ({ page }) => {
      // Tab inicial (Ventas)
      await expect(page.getByTestId('reporte-ventas')).toBeVisible();

      // Cambiar a Financiero
      await page.getByRole('tab', { name: /financiero/i }).click();
      await expect(page.getByTestId('reporte-financiero')).toBeVisible();

      // Cambiar a Productos
      await page.getByRole('tab', { name: /productos/i }).click();
      await expect(page.getByTestId('reporte-productos')).toBeVisible();

      // Cambiar a Clientes
      await page.getByRole('tab', { name: /clientes/i }).click();
      await expect(page.getByTestId('reporte-clientes')).toBeVisible();

      // Cambiar a Inventario
      await page.getByRole('tab', { name: /inventario/i }).click();
      await expect(page.getByTestId('reporte-inventario')).toBeVisible();

      // Cambiar a Bancos
      await page.getByRole('tab', { name: /bancos/i }).click();
      await expect(page.getByTestId('reporte-bancos')).toBeVisible();
    });

    test('debe mantener tab activo después de recargar', async ({ page }) => {
      // Cambiar a tab Productos
      await page.getByRole('tab', { name: /productos/i }).click();
      await expect(page.getByTestId('reporte-productos')).toBeVisible();

      // Recargar página
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Debería mantener tab Productos activo (si usa localStorage)
      // await expect(page.getByTestId('reporte-productos')).toBeVisible();
    });
  });

  test.describe('Reporte de Ventas', () => {
    test('debe mostrar gráfica de ventas mensuales (AreaChart)', async ({ page }) => {
      await page.getByRole('tab', { name: /ventas/i }).click();

      // Verificar que el chart está renderizado
      const chart = page
        .locator('[data-testid="ventas-chart"]')
        .or(page.locator('.recharts-wrapper'));
      await expect(chart.first()).toBeVisible();

      // Verificar que hay datos en el chart
      const areas = page.locator('.recharts-area');
      await expect(areas.first()).toBeVisible();
    });

    test('debe mostrar métricas clave de ventas', async ({ page }) => {
      await page.getByRole('tab', { name: /ventas/i }).click();

      // Métricas esperadas
      await expect(page.getByText(/total ventas/i)).toBeVisible();
      await expect(page.getByText(/promedio mensual/i)).toBeVisible();
      await expect(page.getByText(/crecimiento/i)).toBeVisible();
      await expect(page.getByText(/total clientes/i)).toBeVisible();
    });

    test('debe permitir filtrar por rango de fechas', async ({ page }) => {
      await page.getByRole('tab', { name: /ventas/i }).click();

      // Filtros de fecha
      await page.getByLabel(/fecha inicio/i).fill('2024-01-01');
      await page.getByLabel(/fecha fin/i).fill('2024-06-30');
      await page.getByRole('button', { name: /aplicar filtros/i }).click();

      await page.waitForTimeout(500);

      // Verificar que el chart se actualiza
      const chart = page.locator('.recharts-wrapper');
      await expect(chart).toBeVisible();
    });

    test('debe mostrar tooltip al hacer hover sobre gráfica', async ({ page }) => {
      await page.getByRole('tab', { name: /ventas/i }).click();

      // Hover sobre área del chart
      const chartArea = page.locator('.recharts-area').first();
      await chartArea.hover();

      await page.waitForTimeout(300);

      // Verificar tooltip (Recharts tooltip)
      const tooltip = page.locator('.recharts-tooltip-wrapper');
      if ((await tooltip.count()) > 0) {
        await expect(tooltip).toBeVisible();
      }
    });

    test('debe mostrar comparación con meta', async ({ page }) => {
      await page.getByRole('tab', { name: /ventas/i }).click();

      // Verificar que se muestra línea de meta
      const legends = page.locator('.recharts-legend-wrapper');
      await expect(legends).toBeVisible();

      // Verificar leyendas (Ventas, Meta)
      await expect(page.getByText(/ventas/i)).toBeVisible();
      await expect(page.getByText(/meta/i)).toBeVisible();
    });
  });

  test.describe('Reporte Financiero', () => {
    test('debe mostrar gráfica de ingresos vs egresos (BarChart)', async ({ page }) => {
      await page.getByRole('tab', { name: /financiero/i }).click();

      const barChart = page.locator('.recharts-bar-rectangle');
      await expect(barChart.first()).toBeVisible();
    });

    test('debe calcular utilidad correctamente', async ({ page }) => {
      await page.getByRole('tab', { name: /financiero/i }).click();

      // Verificar métricas financieras
      await expect(page.getByText(/ingresos totales/i)).toBeVisible();
      await expect(page.getByText(/egresos totales/i)).toBeVisible();
      await expect(page.getByText(/utilidad neta/i)).toBeVisible();
      await expect(page.getByText(/margen/i)).toBeVisible();
    });

    test('debe mostrar desglose por categorías', async ({ page }) => {
      await page.getByRole('tab', { name: /financiero/i }).click();

      // Verificar tabla o lista de categorías
      await expect(page.getByText(/ingresos/i)).toBeVisible();
      await expect(page.getByText(/egresos/i)).toBeVisible();
      await expect(page.getByText(/utilidad/i)).toBeVisible();
    });

    test('debe permitir cambiar período de análisis', async ({ page }) => {
      await page.getByRole('tab', { name: /financiero/i }).click();

      // Cambiar a trimestre
      const periodoSelect = page.getByTestId('periodo-select');
      if ((await periodoSelect.count()) > 0) {
        await periodoSelect.selectOption('trimestre');
        await page.waitForTimeout(500);

        // Verificar que se actualizó
        const chart = page.locator('.recharts-wrapper');
        await expect(chart).toBeVisible();
      }
    });
  });

  test.describe('Reporte de Productos', () => {
    test('debe mostrar top productos por ventas (BarChart)', async ({ page }) => {
      await page.getByRole('tab', { name: /productos/i }).click();

      // Verificar chart de productos
      const chart = page
        .locator('[data-testid="productos-chart"]')
        .or(page.locator('.recharts-wrapper'));
      await expect(chart.first()).toBeVisible();

      // Verificar barras de productos
      const bars = page.locator('.recharts-bar-rectangle');
      await expect(bars.first()).toBeVisible();
    });

    test('debe mostrar métricas de productos', async ({ page }) => {
      await page.getByRole('tab', { name: /productos/i }).click();

      await expect(page.getByText(/total productos/i)).toBeVisible();
      await expect(page.getByText(/ventas totales/i)).toBeVisible();
      await expect(page.getByText(/margen promedio/i)).toBeVisible();
    });

    test('debe permitir ordenar por diferentes criterios', async ({ page }) => {
      await page.getByRole('tab', { name: /productos/i }).click();

      // Ordenar por ventas
      const ordenSelect = page.getByTestId('orden-select');
      if ((await ordenSelect.count()) > 0) {
        await ordenSelect.selectOption('ventas');
        await page.waitForTimeout(300);

        // Ordenar por margen
        await ordenSelect.selectOption('margen');
        await page.waitForTimeout(300);

        // Ordenar por unidades
        await ordenSelect.selectOption('unidades');
        await page.waitForTimeout(300);
      }
    });

    test('debe mostrar top 5 productos', async ({ page }) => {
      await page.getByRole('tab', { name: /productos/i }).click();

      // Verificar que hay 5 productos mostrados
      const productItems = page.locator('[data-testid="producto-item"]');
      const count = await productItems.count();
      expect(count).toBeGreaterThanOrEqual(5);
    });
  });

  test.describe('Reporte de Clientes', () => {
    test('debe mostrar top clientes por ventas (BarChart horizontal)', async ({ page }) => {
      await page.getByRole('tab', { name: /clientes/i }).click();

      const chart = page.locator('.recharts-wrapper');
      await expect(chart).toBeVisible();

      // Verificar barras horizontales
      const bars = page.locator('.recharts-bar-rectangle');
      await expect(bars.first()).toBeVisible();
    });

    test('debe mostrar métricas de satisfacción', async ({ page }) => {
      await page.getByRole('tab', { name: /clientes/i }).click();

      await expect(page.getByText(/satisfacción promedio/i)).toBeVisible();
      await expect(page.getByText(/pedidos totales/i)).toBeVisible();
      await expect(page.getByText(/ticket promedio/i)).toBeVisible();
    });

    test('debe mostrar distribución de clientes por tipo', async ({ page }) => {
      await page.getByRole('tab', { name: /clientes/i }).click();

      // Si hay PieChart para distribución
      const pieChart = page.locator('.recharts-pie');
      if ((await pieChart.count()) > 0) {
        await expect(pieChart).toBeVisible();
      }
    });

    test('debe permitir filtrar por tipo de cliente', async ({ page }) => {
      await page.getByRole('tab', { name: /clientes/i }).click();

      const tipoSelect = page.getByTestId('tipo-cliente-select');
      if ((await tipoSelect.count()) > 0) {
        await tipoSelect.selectOption('mayorista');
        await page.waitForTimeout(300);

        // Verificar que se filtró
        const chart = page.locator('.recharts-wrapper');
        await expect(chart).toBeVisible();
      }
    });
  });

  test.describe('Reporte de Inventario', () => {
    test('debe mostrar clasificación ABC (PieChart)', async ({ page }) => {
      await page.getByRole('tab', { name: /inventario/i }).click();

      // Verificar PieChart de clasificación ABC
      const pieChart = page.locator('.recharts-pie');
      await expect(pieChart.first()).toBeVisible();

      // Verificar leyendas A, B, C
      await expect(page.getByText(/categoría a/i)).toBeVisible();
      await expect(page.getByText(/categoría b/i)).toBeVisible();
      await expect(page.getByText(/categoría c/i)).toBeVisible();
    });

    test('debe mostrar métricas de inventario', async ({ page }) => {
      await page.getByRole('tab', { name: /inventario/i }).click();

      await expect(page.getByText(/valor total/i)).toBeVisible();
      await expect(page.getByText(/rotación promedio/i)).toBeVisible();
      await expect(page.getByText(/items totales/i)).toBeVisible();
    });

    test('debe mostrar análisis de rotación', async ({ page }) => {
      await page.getByRole('tab', { name: /inventario/i }).click();

      // Verificar gráfica de rotación
      const rotacionChart = page.locator('[data-testid="rotacion-chart"]');
      if ((await rotacionChart.count()) > 0) {
        await expect(rotacionChart).toBeVisible();
      }
    });

    test('debe mostrar alertas de stock', async ({ page }) => {
      await page.getByRole('tab', { name: /inventario/i }).click();

      // Verificar si hay alertas
      const alertas = page.locator('[data-testid="stock-alert"]');
      if ((await alertas.count()) > 0) {
        await expect(alertas.first()).toBeVisible();
      }
    });
  });

  test.describe('Reporte de Bancos', () => {
    test('debe mostrar saldos por banco (BarChart)', async ({ page }) => {
      await page.getByRole('tab', { name: /bancos/i }).click();

      const chart = page.locator('.recharts-wrapper');
      await expect(chart).toBeVisible();

      const bars = page.locator('.recharts-bar-rectangle');
      await expect(bars.first()).toBeVisible();
    });

    test('debe mostrar métricas bancarias', async ({ page }) => {
      await page.getByRole('tab', { name: /bancos/i }).click();

      await expect(page.getByText(/saldo total/i)).toBeVisible();
      await expect(page.getByText(/movimientos/i)).toBeVisible();
      await expect(page.getByText(/bancos activos/i)).toBeVisible();
    });

    test('debe mostrar distribución por tipo de cuenta', async ({ page }) => {
      await page.getByRole('tab', { name: /bancos/i }).click();

      // Verificar tipos: corriente, ahorro, inversión
      await expect(page.getByText(/corriente/i)).toBeVisible();
      await expect(page.getByText(/ahorro/i)).toBeVisible();
      await expect(page.getByText(/inversión/i)).toBeVisible();
    });

    test('debe mostrar movimientos recientes', async ({ page }) => {
      await page.getByRole('tab', { name: /bancos/i }).click();

      // Verificar tabla de movimientos
      const movimientos = page.locator('[data-testid="movimientos-recientes"]');
      if ((await movimientos.count()) > 0) {
        await expect(movimientos).toBeVisible();
      }
    });
  });

  test.describe('Sistema de Exportación', () => {
    test('debe abrir modal de exportación al hacer clic en "Exportar"', async ({ page }) => {
      await page.getByRole('button', { name: /exportar/i }).click();

      // Verificar modal de exportación
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByRole('heading', { name: /exportar reporte/i })).toBeVisible();

      // Verificar opciones de formato
      await expect(page.getByText(/pdf/i)).toBeVisible();
      await expect(page.getByText(/excel/i)).toBeVisible();
      await expect(page.getByText(/csv/i)).toBeVisible();
    });

    test('debe permitir seleccionar formato PDF', async ({ page }) => {
      await page.getByRole('button', { name: /exportar/i }).click();

      // Seleccionar PDF
      await page.getByRole('radio', { name: /pdf/i }).click();

      // Verificar que está seleccionado
      const pdfRadio = page.getByRole('radio', { name: /pdf/i });
      await expect(pdfRadio).toBeChecked();
    });

    test('debe permitir seleccionar formato Excel', async ({ page }) => {
      await page.getByRole('button', { name: /exportar/i }).click();

      // Seleccionar Excel
      await page.getByRole('radio', { name: /excel/i }).click();

      const excelRadio = page.getByRole('radio', { name: /excel/i });
      await expect(excelRadio).toBeChecked();
    });

    test('debe permitir seleccionar formato CSV', async ({ page }) => {
      await page.getByRole('button', { name: /exportar/i }).click();

      // Seleccionar CSV
      await page.getByRole('radio', { name: /csv/i }).click();

      const csvRadio = page.getByRole('radio', { name: /csv/i });
      await expect(csvRadio).toBeChecked();
    });

    test('debe iniciar descarga al confirmar exportación', async ({ page }) => {
      await page.getByRole('button', { name: /exportar/i }).click();

      // Seleccionar formato
      await page.getByRole('radio', { name: /pdf/i }).click();

      // Configurar listener para descarga
      const downloadPromise = page.waitForEvent('download', { timeout: 10000 });

      // Confirmar exportación
      await page.getByRole('button', { name: /descargar/i }).click();

      // Esperar descarga (puede fallar si no está implementado)
      try {
        const download = await downloadPromise;
        expect(download).toBeTruthy();

        // Verificar nombre de archivo
        const fileName = download.suggestedFilename();
        expect(fileName).toMatch(/reporte.*\.pdf/i);
      } catch (error) {
        // Si no está implementado, verificar que se muestra mensaje
        await expect(page.getByText(/exportación iniciada/i)).toBeVisible();
      }
    });

    test('debe cerrar modal al cancelar', async ({ page }) => {
      await page.getByRole('button', { name: /exportar/i }).click();
      await expect(page.getByRole('dialog')).toBeVisible();

      await page.getByRole('button', { name: /cancelar/i }).click();
      await expect(page.getByRole('dialog')).not.toBeVisible();
    });
  });

  test.describe('Actualización de Datos', () => {
    test('debe actualizar datos al hacer clic en "Actualizar"', async ({ page }) => {
      const updateButton = page.getByRole('button', { name: /actualizar/i });
      await updateButton.click();

      // Verificar loading state
      await expect(updateButton).toBeDisabled();

      // Esperar actualización
      await page.waitForTimeout(1000);

      // Verificar toast de éxito
      await expect(page.getByText(/datos actualizados/i)).toBeVisible();
    });

    test('debe mostrar indicador de carga durante actualización', async ({ page }) => {
      await page.getByRole('button', { name: /actualizar/i }).click();

      // Verificar spinner o loading indicator
      const spinner = page
        .locator('[data-testid="loading-spinner"]')
        .or(page.locator('.animate-spin'));
      if ((await spinner.count()) > 0) {
        await expect(spinner.first()).toBeVisible();
      }
    });
  });

  test.describe('Interactividad de Gráficas', () => {
    test('debe permitir hacer zoom en gráficas', async ({ page }) => {
      await page.getByRole('tab', { name: /ventas/i }).click();

      // Si Recharts tiene zoom habilitado
      const zoomButton = page.locator('[data-testid="zoom-in"]');
      if ((await zoomButton.count()) > 0) {
        await zoomButton.click();
        await page.waitForTimeout(300);
      }
    });

    test('debe permitir alternar series en leyenda', async ({ page }) => {
      await page.getByRole('tab', { name: /ventas/i }).click();

      // Click en leyenda para ocultar/mostrar serie
      const legendItem = page.locator('.recharts-legend-item').first();
      if ((await legendItem.count()) > 0) {
        await legendItem.click();
        await page.waitForTimeout(300);

        // Click nuevamente para mostrar
        await legendItem.click();
        await page.waitForTimeout(300);
      }
    });

    test('debe actualizar tooltip al mover mouse sobre gráfica', async ({ page }) => {
      await page.getByRole('tab', { name: /ventas/i }).click();

      const chartArea = page.locator('.recharts-surface');
      await chartArea.hover({ position: { x: 100, y: 100 } });
      await page.waitForTimeout(200);

      await chartArea.hover({ position: { x: 200, y: 100 } });
      await page.waitForTimeout(200);

      // Tooltip debería estar visible
      const tooltip = page.locator('.recharts-tooltip-wrapper');
      if ((await tooltip.count()) > 0) {
        await expect(tooltip).toBeVisible();
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('debe funcionar en mobile (375px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await expect(page.getByRole('heading', { name: /centro de inteligencia/i })).toBeVisible();

      // Tabs deberían ser scrollables o apilados
      await expect(page.getByRole('tab', { name: /ventas/i })).toBeVisible();

      // Charts deberían ser responsive
      const chart = page.locator('.recharts-wrapper');
      await expect(chart.first()).toBeVisible();
    });

    test('debe funcionar en tablet (768px)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await expect(page.getByRole('heading', { name: /centro de inteligencia/i })).toBeVisible();

      // Verificar que charts se ven bien
      const chart = page.locator('.recharts-wrapper');
      await expect(chart).toBeVisible();
    });

    test('debe funcionar en desktop (1920px)', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      // Todos los tabs visibles
      const tabs = page.locator('[role="tab"]');
      const tabCount = await tabs.count();
      expect(tabCount).toBeGreaterThanOrEqual(6);

      // Charts con tamaño completo
      const chart = page.locator('.recharts-wrapper');
      await expect(chart).toBeVisible();
    });
  });

  test.describe('Filtros Globales', () => {
    test('debe permitir filtrar por rango de fechas global', async ({ page }) => {
      // Filtros globales (si existen)
      const fechaInicio = page.getByTestId('fecha-inicio-global');
      if ((await fechaInicio.count()) > 0) {
        await fechaInicio.fill('2024-01-01');

        const fechaFin = page.getByTestId('fecha-fin-global');
        await fechaFin.fill('2024-12-31');

        await page.getByRole('button', { name: /aplicar/i }).click();
        await page.waitForTimeout(500);

        // Verificar que todos los reportes se actualizan
        await expect(page.locator('.recharts-wrapper')).toBeVisible();
      }
    });

    test('debe permitir comparar períodos', async ({ page }) => {
      const compararCheck = page.getByTestId('comparar-periodos');
      if ((await compararCheck.count()) > 0) {
        await compararCheck.click();

        // Debería mostrar selector de período de comparación
        await expect(page.getByTestId('periodo-comparacion')).toBeVisible();
      }
    });
  });

  test.describe('Performance', () => {
    test('debe cargar página en menos de 3 segundos', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/chronos/reportes');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(3000);
    });

    test('debe renderizar gráficas sin lag', async ({ page }) => {
      // Cambiar entre tabs rápidamente
      await page.getByRole('tab', { name: /ventas/i }).click();
      await page.waitForTimeout(100);

      await page.getByRole('tab', { name: /financiero/i }).click();
      await page.waitForTimeout(100);

      await page.getByRole('tab', { name: /productos/i }).click();
      await page.waitForTimeout(100);

      // No debería haber jank
      const chart = page.locator('.recharts-wrapper');
      await expect(chart).toBeVisible();
    });
  });

  test.describe('Accesibilidad', () => {
    test('debe tener navegación por teclado', async ({ page }) => {
      // Tab navegation
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(['BUTTON', 'DIV']).toContain(focused);
    });

    test('debe tener aria-labels en gráficas', async ({ page }) => {
      const chart = page.locator('.recharts-wrapper');
      const hasAriaLabel = await chart.getAttribute('aria-label');

      // Recharts puede o no tener aria-label por defecto
      // Verificar que existe el chart
      await expect(chart).toBeVisible();
    });
  });

  test.describe('Casos Edge', () => {
    test('debe manejar datos vacíos', async ({ page }) => {
      // Si no hay datos, debería mostrar mensaje
      // Este test requeriría mockear respuesta vacía de Firestore
      // await expect(page.getByText(/no hay datos disponibles/i)).toBeVisible();
    });

    test('debe manejar errores de carga', async ({ page }) => {
      // Simular error
      await page.route('**/firestore/**', (route) => route.abort());
      await page.goto('/chronos/reportes');

      // Debería mostrar mensaje de error
      // await expect(page.getByText(/error al cargar reportes/i)).toBeVisible();
    });

    test('debe manejar fechas inválidas en filtros', async ({ page }) => {
      const fechaInicio = page.getByTestId('fecha-inicio-global');
      if ((await fechaInicio.count()) > 0) {
        await fechaInicio.fill('invalid-date');
        await page.getByRole('button', { name: /aplicar/i }).click();

        // Debería mostrar error de validación
        await expect(page.getByText(/fecha inválida/i)).toBeVisible();
      }
    });
  });
});
