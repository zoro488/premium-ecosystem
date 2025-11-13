import { test } from '@playwright/test';

test('Debug sidebar buttons', async ({ page }) => {
  await page.goto('http://localhost:3001');
  await page.evaluate(() => {
    const demoUser = {
      email: 'demo@flowdistributor.com',
      role: 'admin',
      name: 'Usuario Demo',
      uid: 'demo-test-uid',
    };
    localStorage.setItem('flow_current_user', JSON.stringify(demoUser));
  });
  await page.goto('http://localhost:3001/flow');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // Buscar todos los botones del sidebar
  const sidebarButtons = await page.locator('nav button, aside button').evaluateAll((buttons) => {
    return buttons.map((btn) => ({
      text: btn.textContent?.trim(),
      title: btn.getAttribute('title'),
      ariaLabel: btn.getAttribute('aria-label'),
      className: btn.className,
      id: btn.id,
    }));
  });

  console.log('BOTONES SIDEBAR:', JSON.stringify(sidebarButtons, null, 2));

  // Buscar botones por iconos o SVG
  const buttonsWithSVG = await page.locator('button:has(svg)').evaluateAll((buttons) => {
    return buttons.map((btn) => ({
      text: btn.textContent?.trim(),
      title: btn.getAttribute('title'),
      svg: btn.querySelector('svg')?.getAttribute('class'),
    }));
  });

  console.log('\nBOTONES CON SVG:', JSON.stringify(buttonsWithSVG, null, 2));
});
