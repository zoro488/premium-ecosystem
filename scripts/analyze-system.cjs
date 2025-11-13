#!/usr/bin/env node
/**
 * 🔍 CHRONOS SYSTEM - ANÁLISIS COMPLETO AUTOMATIZADO
 * Script de validación exhaustiva del sistema
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

// Colores para console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.cyan}${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}${colors.reset}\n`),
};

// Contadores
const stats = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
};

// ============================================
// ANÁLISIS 1: ESTRUCTURA DE ARCHIVOS
// ============================================
function analyzeFileStructure() {
  log.section('📁 ANÁLISIS 1: ESTRUCTURA DE ARCHIVOS');
  
  const requiredFiles = [
    'src/main.jsx',
    'src/apps/FlowDistributor/FlowDistributor.jsx',
    'src/apps/FlowDistributor/components/SplashScreen.jsx',
    'src/apps/FlowDistributor/components/LoginScreen.jsx',
    'src/apps/FlowDistributor/components/CinematicLoadingScreen.jsx',
    'src/apps/FlowDistributor/components/DashboardUltra.tsx',
    'src/apps/FlowDistributor/utils/authSystem.js',
    'tests/e2e/chronos-complete.spec.js',
  ];

  requiredFiles.forEach((file) => {
    stats.total++;
    const exists = fs.existsSync(file);
    if (exists) {
      log.success(`Archivo encontrado: ${file}`);
      stats.passed++;
    } else {
      log.error(`Archivo faltante: ${file}`);
      stats.failed++;
    }
  });
}

// ============================================
// ANÁLISIS 2: IMPORTS EN FLOWDISTRIBUTOR
// ============================================
function analyzeImports() {
  log.section('📦 ANÁLISIS 2: IMPORTS DE COMPONENTES');
  
  const flowDistributorPath = 'src/apps/FlowDistributor/FlowDistributor.jsx';
  
  if (!fs.existsSync(flowDistributorPath)) {
    log.error('FlowDistributor.jsx no encontrado');
    return;
  }

  const content = fs.readFileSync(flowDistributorPath, 'utf-8');
  
  const requiredImports = [
    { name: 'DashboardUltra', pattern: /import.*DashboardUltra.*from/ },
    { name: 'SplashScreen', pattern: /import.*SplashScreen.*from/ },
    { name: 'LoginScreen', pattern: /import.*LoginScreen.*from/ },
    { name: 'CinematicLoadingScreen', pattern: /import.*CinematicLoadingScreen.*from/ },
    { name: 'QueryClient', pattern: /import.*QueryClient.*from.*react-query/ },
    { name: 'useBancos', pattern: /useBancos/ },
    { name: 'useVentas', pattern: /useVentas/ },
    { name: 'useClientes', pattern: /useClientes/ },
  ];

  requiredImports.forEach(({ name, pattern }) => {
    stats.total++;
    if (pattern.test(content)) {
      log.success(`Import verificado: ${name}`);
      stats.passed++;
    } else {
      log.error(`Import faltante: ${name}`);
      stats.failed++;
    }
  });
}

// ============================================
// ANÁLISIS 3: PANELES LAZY LOADED
// ============================================
function analyzeLazyPanels() {
  log.section('🚀 ANÁLISIS 3: PANELES LAZY LOADED');
  
  const flowDistributorPath = 'src/apps/FlowDistributor/FlowDistributor.jsx';
  const content = fs.readFileSync(flowDistributorPath, 'utf-8');
  
  const lazyPanels = [
    'PanelUtilidadesUltra',
    'PanelFletesSurUltra',
    'PanelBovedaMonteUltra',
    'PanelBovedaUSAUltra',
    'PanelAztecaUltra',
    'PanelLeftieUltra',
    'PanelProfitUltra',
    'PanelGYAUltra',
    'PanelClientes',
  ];

  lazyPanels.forEach((panel) => {
    stats.total++;
    const pattern = new RegExp(`const ${panel} = lazy\\(\\(\\) => import\\('\\./components/${panel}'\\)\\)`);
    if (pattern.test(content)) {
      log.success(`Panel lazy loaded: ${panel}`);
      stats.passed++;
    } else {
      log.warning(`Panel posiblemente no lazy loaded: ${panel}`);
      stats.warnings++;
    }
  });
}

// ============================================
// ANÁLISIS 4: SWITCH CASES DE PANELES
// ============================================
function analyzeSwitchCases() {
  log.section('🔀 ANÁLISIS 4: SWITCH CASES DE PANELES');
  
  const flowDistributorPath = 'src/apps/FlowDistributor/FlowDistributor.jsx';
  const content = fs.readFileSync(flowDistributorPath, 'utf-8');
  
  const expectedCases = [
    'dashboard',
    'ordenes',
    'distribuidores',
    'almacen',
    'ventas',
    'clientes',
    'gastosAbonos',
    'reportes',
    'utilidades',
    'fletes',
    'bovedaMonte',
    'bovedaUSA',
    'azteca',
    'leftie',
    'profit',
    'clientesCartera',
  ];

  const caseCounts = {};
  expectedCases.forEach((caseName) => {
    const pattern = new RegExp(`case '${caseName}':`, 'g');
    const matches = content.match(pattern);
    caseCounts[caseName] = matches ? matches.length : 0;
  });

  expectedCases.forEach((caseName) => {
    stats.total++;
    const count = caseCounts[caseName];
    
    if (count === 1) {
      log.success(`Case único encontrado: '${caseName}'`);
      stats.passed++;
    } else if (count === 0) {
      log.error(`Case faltante: '${caseName}'`);
      stats.failed++;
    } else {
      log.warning(`Case duplicado (${count}x): '${caseName}'`);
      stats.warnings++;
    }
  });
}

// ============================================
// ANÁLISIS 5: SISTEMA DE AUTENTICACIÓN
// ============================================
function analyzeAuthSystem() {
  log.section('🔐 ANÁLISIS 5: SISTEMA DE AUTENTICACIÓN');
  
  const authPath = 'src/apps/FlowDistributor/utils/authSystem.js';
  
  if (!fs.existsSync(authPath)) {
    log.error('authSystem.js no encontrado');
    return;
  }

  const content = fs.readFileSync(authPath, 'utf-8');
  
  const authFunctions = [
    'authenticateUser',
    'saveSession',
    'getSession',
    'clearSession',
    'hasPermission',
  ];

  const authUsers = [
    'admin@chronos.com',
    'test@chronos.com',
    'demo@chronos.com',
  ];

  // Verificar funciones
  authFunctions.forEach((func) => {
    stats.total++;
    const pattern = new RegExp(`(export const|export function) ${func}`);
    if (pattern.test(content)) {
      log.success(`Función exportada: ${func}`);
      stats.passed++;
    } else {
      log.error(`Función faltante: ${func}`);
      stats.failed++;
    }
  });

  // Verificar usuarios
  authUsers.forEach((user) => {
    stats.total++;
    if (content.includes(user)) {
      log.success(`Usuario configurado: ${user}`);
      stats.passed++;
    } else {
      log.error(`Usuario faltante: ${user}`);
      stats.failed++;
    }
  });
}

// ============================================
// ANÁLISIS 6: QUERYCLIENT PROVIDER
// ============================================
function analyzeQueryClient() {
  log.section('🔄 ANÁLISIS 6: QUERYCLIENT PROVIDER');
  
  const mainPath = 'src/main.jsx';
  
  if (!fs.existsSync(mainPath)) {
    log.error('main.jsx no encontrado');
    return;
  }

  const content = fs.readFileSync(mainPath, 'utf-8');
  
  const checks = [
    { name: 'Import QueryClient', pattern: /import.*QueryClient.*from.*@tanstack\/react-query/ },
    { name: 'Import QueryClientProvider', pattern: /import.*QueryClientProvider.*from.*@tanstack\/react-query/ },
    { name: 'QueryClient instance', pattern: /const queryClient = new QueryClient/ },
    { name: 'QueryClientProvider wrapper', pattern: /<QueryClientProvider.*client={queryClient}>/},
  ];

  checks.forEach(({ name, pattern }) => {
    stats.total++;
    if (pattern.test(content)) {
      log.success(name);
      stats.passed++;
    } else {
      log.error(`Faltante: ${name}`);
      stats.failed++;
    }
  });
}

// ============================================
// ANÁLISIS 7: VIDEOS DE CHRONOS
// ============================================
function analyzeVideos() {
  log.section('🎬 ANÁLISIS 7: VIDEOS DE CHRONOS');
  
  const videoPath = 'public/videos';
  const requiredVideos = [
    'chronos-splash-1414145934.mp4',
    'chronos-loading-931340535.mov',
  ];

  if (!fs.existsSync(videoPath)) {
    log.error(`Directorio de videos no encontrado: ${videoPath}`);
    stats.failed += requiredVideos.length;
    stats.total += requiredVideos.length;
    return;
  }

  requiredVideos.forEach((video) => {
    stats.total++;
    const fullPath = path.join(videoPath, video);
    if (fs.existsSync(fullPath)) {
      const stats_file = fs.statSync(fullPath);
      const sizeMB = (stats_file.size / (1024 * 1024)).toFixed(2);
      log.success(`Video encontrado: ${video} (${sizeMB} MB)`);
      stats.passed++;
    } else {
      log.error(`Video faltante: ${video}`);
      stats.failed++;
    }
  });
}

// ============================================
// ANÁLISIS 8: TESTS E2E
// ============================================
function analyzeTests() {
  log.section('🧪 ANÁLISIS 8: TESTS E2E');
  
  const testPath = 'tests/e2e/chronos-complete.spec.js';
  
  if (!fs.existsSync(testPath)) {
    log.error('Test file no encontrado');
    return;
  }

  const content = fs.readFileSync(testPath, 'utf-8');
  
  const testSuites = [
    'Flujo de Inicio',
    'Navegación entre Paneles',
    'Visualización de Datos',
    'Formularios y Registros',
    'Operaciones de Bóvedas',
    'Animaciones y UI',
    'Sesiones y Permisos',
    'Manejo de Errores',
  ];

  testSuites.forEach((suite) => {
    stats.total++;
    if (content.includes(suite)) {
      log.success(`Test suite encontrado: ${suite}`);
      stats.passed++;
    } else {
      log.warning(`Test suite posiblemente faltante: ${suite}`);
      stats.warnings++;
    }
  });

  // Contar tests
  const testMatches = content.match(/test\(/g);
  const testCount = testMatches ? testMatches.length : 0;
  log.info(`Total de tests individuales: ${testCount}`);
}

// ============================================
// ANÁLISIS 9: HOOKS DE DATOS
// ============================================
function analyzeDataHooks() {
  log.section('🎣 ANÁLISIS 9: HOOKS DE DATOS');
  
  const hooksDir = 'src/apps/FlowDistributor/hooks';
  const requiredHooks = [
    'useBancos.js',
    'useVentas.js',
    'useClientes.js',
    'useAlmacen.js',
    'useOrdenesCompra.js',
  ];

  requiredHooks.forEach((hook) => {
    stats.total++;
    const hookPath = path.join(hooksDir, hook);
    if (fs.existsSync(hookPath)) {
      const content = fs.readFileSync(hookPath, 'utf-8');
      const hasUseQuery = content.includes('useQuery');
      const hasUseMutation = content.includes('useMutation');
      
      if (hasUseQuery || hasUseMutation) {
        log.success(`Hook con TanStack Query: ${hook}`);
        stats.passed++;
      } else {
        log.warning(`Hook sin TanStack Query: ${hook}`);
        stats.warnings++;
      }
    } else {
      log.error(`Hook faltante: ${hook}`);
      stats.failed++;
    }
  });
}

// ============================================
// ANÁLISIS 10: BUILD Y BUNDLE
// ============================================
function analyzeBuild() {
  log.section('📦 ANÁLISIS 10: BUILD Y BUNDLE');
  
  const distDir = 'dist';
  
  if (!fs.existsSync(distDir)) {
    log.error('Directorio dist/ no encontrado. Ejecutar: npm run build');
    return;
  }

  const indexHtml = path.join(distDir, 'index.html');
  stats.total++;
  if (fs.existsSync(indexHtml)) {
    log.success('index.html generado');
    stats.passed++;
  } else {
    log.error('index.html faltante');
    stats.failed++;
  }

  // Verificar JS bundles
  const assetsJs = path.join(distDir, 'assets', 'js');
  if (fs.existsSync(assetsJs)) {
    const jsFiles = fs.readdirSync(assetsJs);
    const flowDistributor = jsFiles.find(f => f.startsWith('FlowDistributor-'));
    
    stats.total++;
    if (flowDistributor) {
      const stats_file = fs.statSync(path.join(assetsJs, flowDistributor));
      const sizeKB = (stats_file.size / 1024).toFixed(2);
      log.success(`Bundle principal generado: ${flowDistributor} (${sizeKB} KB)`);
      stats.passed++;
      
      // Verificar tamaño óptimo
      stats.total++;
      if (stats_file.size < 800 * 1024) { // < 800 KB
        log.success(`Tamaño de bundle óptimo (< 800 KB)`);
        stats.passed++;
      } else {
        log.warning(`Bundle grande (> 800 KB). Considerar optimización.`);
        stats.warnings++;
      }
    } else {
      log.error('Bundle FlowDistributor no encontrado');
      stats.failed++;
    }
  }
}

// ============================================
// REPORTE FINAL
// ============================================
function generateReport() {
  log.section('📊 REPORTE FINAL DE ANÁLISIS');
  
  const totalTests = stats.total;
  const passRate = ((stats.passed / totalTests) * 100).toFixed(1);
  
  console.log(`${colors.cyan}Total de verificaciones: ${totalTests}${colors.reset}`);
  console.log(`${colors.green}✅ Pasadas: ${stats.passed}${colors.reset}`);
  console.log(`${colors.red}❌ Fallidas: ${stats.failed}${colors.reset}`);
  console.log(`${colors.yellow}⚠️  Warnings: ${stats.warnings}${colors.reset}`);
  console.log(`${colors.blue}📈 Tasa de éxito: ${passRate}%${colors.reset}\n`);
  
  if (stats.failed === 0) {
    log.success('¡SISTEMA COMPLETAMENTE VERIFICADO! 🎉');
  } else {
    log.error(`Se encontraron ${stats.failed} problemas que requieren atención.`);
  }
  
  // Generar archivo de reporte
  const report = {
    fecha: new Date().toISOString(),
    totalTests: totalTests,
    passed: stats.passed,
    failed: stats.failed,
    warnings: stats.warnings,
    passRate: passRate,
    status: stats.failed === 0 ? 'APROBADO' : 'CON ERRORES',
  };
  
  fs.writeFileSync('ANALISIS_REPORT.json', JSON.stringify(report, null, 2));
  log.info('Reporte guardado en: ANALISIS_REPORT.json');
}

// ============================================
// EJECUTAR TODOS LOS ANÁLISIS
// ============================================
function runAllAnalysis() {
  console.log(`
${colors.cyan}
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🔬 CHRONOS SYSTEM - ANÁLISIS COMPLETO AUTOMATIZADO     ║
║                                                           ║
║   Verificación exhaustiva de todos los componentes       ║
║   del sistema CHRONOS                                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}
`);

  try {
    analyzeFileStructure();
    analyzeImports();
    analyzeLazyPanels();
    analyzeSwitchCases();
    analyzeAuthSystem();
    analyzeQueryClient();
    analyzeVideos();
    analyzeTests();
    analyzeDataHooks();
    analyzeBuild();
    generateReport();
  } catch (error) {
    log.error(`Error durante el análisis: ${error.message}`);
    process.exit(1);
  }
  
  // Exit code basado en resultados
  process.exit(stats.failed > 0 ? 1 : 0);
}

// Ejecutar
runAllAnalysis();
