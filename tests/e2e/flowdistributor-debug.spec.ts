/**
 * 🔍 TEST DE DEBUGGING - FlowDistributor
 * Captura información detallada del estado de la aplicación
 */

import { test, expect } from '@playwright/test';

test.describe('🔍 FlowDistributor - Debug Deep Dive', () => {
  test('DEBUG: Capturar estado completo de la aplicación', async ({ page }) => {
    console.log('🚀 Iniciando debug profundo...\n');

    // Paso 1: Navegar sin autenticación
    console.log('📍 PASO 1: Navegando sin autenticación...');
    await page.goto('http://localhost:3001/flow');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const isLoginScreen1 = await page.evaluate(() => {
      return document.body.textContent?.includes('Iniciar Sesión') ||
             document.body.textContent?.includes('Login') ||
             document.querySelector('input[type="email"]') !== null;
    });

    console.log(`  - Pantalla de login: ${isLoginScreen1 ? '⚠️ SÍ' : '✅ NO'}`);
    await page.screenshot({ path: 'test-results/debug-01-sin-auth.png', fullPage: true });

    // Paso 2: Inyectar autenticación
    console.log('\n📍 PASO 2: Inyectando autenticación...');
    await page.evaluate(() => {
      const demoUser = {
        email: 'demo@flowdistributor.com',
        role: 'admin',
        name: 'Usuario Demo',
        uid: 'demo-test-uid'
      };
      localStorage.setItem('flow_current_user', JSON.stringify(demoUser));
      localStorage.setItem('flow_active_panel', 'dashboard');
    });

    // Paso 3: Recargar con autenticación
    console.log('\n📍 PASO 3: Recargando con autenticación...');
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const isLoginScreen2 = await page.evaluate(() => {
      return document.body.textContent?.includes('Iniciar Sesión') ||
             document.body.textContent?.includes('Login') ||
             document.querySelector('input[type="email"]') !== null;
    });

    console.log(`  - Pantalla de login: ${isLoginScreen2 ? '⚠️ AÚN PRESENTE' : '✅ DESBLOQUEADO'}`);
    await page.screenshot({ path: 'test-results/debug-02-con-auth.png', fullPage: true });

    // Paso 4: Análisis profundo del DOM
    console.log('\n📍 PASO 4: Analizando DOM...');

    const domAnalysis = await page.evaluate(() => {
      const results: any = {
        localStorage: {
          currentUser: localStorage.getItem('flow_current_user'),
          activePanel: localStorage.getItem('flow_active_panel'),
        },
        elements: {
          sidebar: !!document.querySelector('aside'),
          sidebarClasses: document.querySelector('aside')?.className || 'N/A',
          mainContent: !!document.querySelector('main'),
          mainClasses: document.querySelector('main')?.className || 'N/A',
        },
        counts: {
          allButtons: document.querySelectorAll('button').length,
          visibleButtons: Array.from(document.querySelectorAll('button')).filter(
            (btn) => (btn as HTMLElement).offsetParent !== null
          ).length,
          navButtons: document.querySelectorAll('nav button, aside button, [role="navigation"] button').length,
          kpiCards: document.querySelectorAll('[class*="kpi"], [class*="card"], [class*="Card"]').length,
          dashboardElements: document.querySelectorAll('[class*="dashboard"], [class*="Dashboard"]').length,
          canvases: document.querySelectorAll('canvas').length,
          svgs: document.querySelectorAll('svg').length,
          motionDivs: document.querySelectorAll('div[style*="transform"]').length,
          errorMessages: document.querySelectorAll('[class*="error"], [class*="Error"]').length,
        },
        buttons: Array.from(document.querySelectorAll('button'))
          .filter((btn) => (btn as HTMLElement).offsetParent !== null)
          .slice(0, 20)
          .map((btn) => ({
            text: (btn as HTMLElement).textContent?.trim().substring(0, 50) || '',
            classes: btn.className.substring(0, 80),
            visible: (btn as HTMLElement).offsetParent !== null,
          })),
        bodyText: document.body.textContent?.substring(0, 500) || '',
        url: window.location.href,
        title: document.title,
      };

      return results;
    });

    console.log('\n📊 ANÁLISIS DEL DOM:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    console.log('\n📦 LOCALSTORAGE:');
    console.log('  - Usuario:', domAnalysis.localStorage.currentUser ? '✅' : '❌');
    console.log('  - Panel activo:', domAnalysis.localStorage.activePanel || '❌');

    console.log('\n🏗️ ELEMENTOS PRINCIPALES:');
    console.log(`  - Sidebar: ${domAnalysis.elements.sidebar ? '✅' : '❌'}`);
    console.log(`  - Main Content: ${domAnalysis.elements.mainContent ? '✅' : '❌'}`);
    if (domAnalysis.elements.sidebar) {
      console.log(`    Classes: ${domAnalysis.elements.sidebarClasses}`);
    }

    console.log('\n🔢 CONTADORES:');
    console.log(`  - Total botones: ${domAnalysis.counts.allButtons}`);
    console.log(`  - Botones visibles: ${domAnalysis.counts.visibleButtons}`);
    console.log(`  - Botones navegación: ${domAnalysis.counts.navButtons}`);
    console.log(`  - KPI Cards: ${domAnalysis.counts.kpiCards}`);
    console.log(`  - Dashboard elements: ${domAnalysis.counts.dashboardElements}`);
    console.log(`  - Canvas (charts): ${domAnalysis.counts.canvases}`);
    console.log(`  - SVGs: ${domAnalysis.counts.svgs}`);
    console.log(`  - Motion divs: ${domAnalysis.counts.motionDivs}`);
    console.log(`  - Mensajes error: ${domAnalysis.counts.errorMessages}`);

    console.log('\n🔘 PRIMEROS 10 BOTONES VISIBLES:');
    domAnalysis.buttons.slice(0, 10).forEach((btn: any, i: number) => {
      console.log(`  ${i + 1}. "${btn.text}"`);
    });

    console.log('\n📄 INFO DE LA PÁGINA:');
    console.log(`  - URL: ${domAnalysis.url}`);
    console.log(`  - Title: ${domAnalysis.title}`);
    console.log(`  - Body preview: ${domAnalysis.bodyText.substring(0, 200)}...`);

    // Paso 5: Capturar errores de consola
    console.log('\n📍 PASO 5: Verificando errores de consola...');

    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
      }
    });

    // Forzar algunos eventos
    await page.evaluate(() => {
      console.error('TEST: Error simulado');
      console.warn('TEST: Warning simulado');
    });

    await page.waitForTimeout(1000);

    if (consoleMessages.length > 0) {
      console.log('\n⚠️ ERRORES/WARNINGS EN CONSOLA:');
      consoleMessages.forEach((msg, i) => {
        console.log(`  ${i + 1}. ${msg}`);
      });
    } else {
      console.log('\n✅ NO HAY ERRORES EN CONSOLA');
    }

    // Paso 6: Intentar navegar programáticamente
    console.log('\n📍 PASO 6: Intentando navegación programática...');

    const navigationTest = await page.evaluate(() => {
      // Buscar cualquier botón que tenga texto relacionado con Dashboard
      const dashboardBtn = Array.from(document.querySelectorAll('button')).find(
        (btn) => btn.textContent?.toLowerCase().includes('dashboard')
      );

      if (dashboardBtn) {
        return {
          found: true,
          text: dashboardBtn.textContent?.trim(),
          classes: dashboardBtn.className,
        };
      }

      // Buscar en el sidebar
      const sidebarButtons = document.querySelectorAll('aside button');
      return {
        found: false,
        sidebarButtonCount: sidebarButtons.length,
        sidebarButtons: Array.from(sidebarButtons)
          .slice(0, 5)
          .map((btn) => (btn as HTMLElement).textContent?.trim()),
      };
    });

    console.log('  - Resultado:', JSON.stringify(navigationTest, null, 2));

    // Paso 7: Screenshot final
    await page.screenshot({ path: 'test-results/debug-03-final.png', fullPage: true });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ DEBUG COMPLETO - Ver screenshots en test-results/');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Assertions básicas
    expect(domAnalysis.elements.sidebar).toBeTruthy();
    expect(domAnalysis.elements.mainContent).toBeTruthy();
    expect(domAnalysis.counts.visibleButtons).toBeGreaterThan(0);
  });
});
