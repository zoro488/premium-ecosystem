/**
 * 🔍 SCRIPT DE DEBUGGING PARA FLOWDISTRIBUTOR
 * Ejecutar en la consola del navegador cuando FlowDistributor esté abierto
 */

console.log('🔍 INICIANDO DEBUG DE FLOWDISTRIBUTOR...\n');

// 1. Verificar localStorage
console.log('📦 LOCALSTORAGE:');
const user = localStorage.getItem('flow_current_user');
const activePanel = localStorage.getItem('flow_active_panel');
console.log('  - Usuario:', user ? JSON.parse(user) : '❌ NO ENCONTRADO');
console.log('  - Panel activo:', activePanel || '❌ NO ENCONTRADO');

// 2. Verificar elementos DOM
console.log('\n📊 ELEMENTOS DOM:');
const sidebar = document.querySelector('aside');
const mainContent = document.querySelector('main');
const dashboardElements = document.querySelectorAll('[class*="dashboard"]');
const kpiCards = document.querySelectorAll('[class*="kpi"], [class*="card"]');
const buttons = document.querySelectorAll('button');
const navButtons = document.querySelectorAll('button[class*="nav"], a[role="button"]');

console.log('  - Sidebar:', sidebar ? '✅ ENCONTRADO' : '❌ NO ENCONTRADO');
console.log('  - Main content:', mainContent ? '✅ ENCONTRADO' : '❌ NO ENCONTRADO');
console.log('  - Dashboard elements:', dashboardElements.length);
console.log('  - KPI Cards:', kpiCards.length);
console.log('  - Total botones:', buttons.length);
console.log('  - Botones navegación:', navButtons.length);

// 3. Listar todos los botones visibles
console.log('\n🔘 BOTONES VISIBLES:');
buttons.forEach((btn, i) => {
  if (btn.offsetParent !== null) {
    // visible
    console.log(
      `  ${i + 1}. "${btn.textContent.trim().substring(0, 30)}" - ${btn.className.substring(0, 50)}`
    );
  }
});

// 4. Verificar errores en React
console.log('\n⚛️ REACT ERROR BOUNDARIES:');
const errorMessages = document.querySelectorAll('[class*="error"]');
console.log('  - Mensajes de error:', errorMessages.length);
errorMessages.forEach((err, i) => {
  console.log(`  ${i + 1}. ${err.textContent.substring(0, 100)}`);
});

// 5. Verificar componentes montados
console.log('\n🎨 COMPONENTES MONTADOS:');
const dashboardUltra = document.querySelector('[class*="DashboardUltra"]');
const panelGYA = document.querySelector('[class*="PanelGYA"]');
const kpiCard3D = document.querySelector('[class*="KpiCard3D"]');

console.log('  - DashboardUltra:', dashboardUltra ? '✅' : '❌');
console.log('  - PanelGYA:', panelGYA ? '✅' : '❌');
console.log('  - KpiCard3D:', kpiCard3D ? '✅' : '❌');

// 6. Verificar animaciones
console.log('\n🎬 ANIMACIONES (Framer Motion):');
const motionDivs = document.querySelectorAll('div[style*="transform"]');
console.log('  - Divs con transform:', motionDivs.length);

// 7. Verificar canvas/charts
console.log('\n📈 CHARTS (Canvas/SVG):');
const canvases = document.querySelectorAll('canvas');
const svgs = document.querySelectorAll('svg');
console.log('  - Canvas elements:', canvases.length);
console.log('  - SVG elements:', svgs.length);

// 8. Verificar login/auth
console.log('\n🔐 AUTENTICACIÓN:');
const loginForm = document.querySelector('form');
const loginButton = document.querySelector('button:has-text("Login"), button:has-text("Iniciar")');
const isLoginScreen =
  document.body.textContent.includes('Iniciar Sesión') ||
  document.body.textContent.includes('Login');

console.log('  - Pantalla de login:', isLoginScreen ? '⚠️ SÍ (BLOQUEADO)' : '✅ NO');
console.log('  - Formulario login:', loginForm ? '⚠️ PRESENTE' : '✅ NO PRESENTE');

// 9. Estado de la aplicación
console.log('\n🌐 ESTADO DE LA APP:');
console.log('  - URL actual:', window.location.href);
console.log('  - Body classes:', document.body.className);
console.log('  - HTML lang:', document.documentElement.lang);

// 10. React DevTools hook
console.log('\n⚛️ REACT DEVTOOLS:');
if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  console.log('  - React DevTools:', '✅ DISPONIBLE');
  const renderers = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers;
  console.log('  - Renderers activos:', renderers ? renderers.size : 0);
} else {
  console.log('  - React DevTools:', '❌ NO DISPONIBLE');
}

console.log('\n✅ DEBUG COMPLETO\n');
console.log('💡 RECOMENDACIONES:');
console.log('  1. Si hay pantalla de login, ejecutar:');
console.log(
  '     localStorage.setItem("flow_current_user", JSON.stringify({email:"demo@flow.com",role:"admin",name:"Demo",uid:"demo"}))'
);
console.log('     location.reload();');
console.log('  2. Si no hay sidebar, revisar FlowDistributor.jsx línea 3728+');
console.log('  3. Si no hay KPIs, revisar DashboardUltra.tsx import y render');
