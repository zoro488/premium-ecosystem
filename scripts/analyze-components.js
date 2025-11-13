#!/usr/bin/env node
/**
 * 🔍 ANALIZADOR AUTOMÁTICO DE COMPONENTES FLOWDISTRIBUTOR
 * =======================================================
 * Analiza TODOS los componentes, detecta problemas y genera reporte
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const BASE_PATH = path.join(__dirname, '../src/apps/FlowDistributor');
const COMPONENTS_PATH = path.join(BASE_PATH, 'components');
const SHARED_PATH = path.join(COMPONENTS_PATH, 'shared');

const ISSUES = {
  hardcodedData: [],
  missingProps: [],
  wrongAnimations: [],
  dateRendering: [],
  missingFirebase: [],
  cssInline: [],
  typeErrors: [],
};

// ============================================================================
// PATRONES A DETECTAR
// ============================================================================

const PATTERNS = {
  // Datos hardcodeados
  hardcodedData: [
    /const\s+\w+\s*=\s*\{[\s\S]*?totalIngresos:\s*\d+/,
    /import\s+.*from\s+['"].*\.json['"]/,
    /panelDataManual/,
    /DATOS_BOVEDAS_COMPLETOS/,
  ],

  // Firebase missing
  needsFirebase: [/useQuery|useMutation/, /collection\(db,/, /getDocs|getDoc|addDoc/],

  // Animaciones incorrectas
  wrongAnimations: [/animations\.fadeInUp/, /theme\.colors/, /theme\.effects/],

  // Renderizado de fechas
  dateIssues: [/\{.*\.fecha\}/, /\{registro\.fecha\}/, /\{item\.fecha\}/],

  // Props de KpiCard3D
  kpiCard3D: [/<KpiCard3D[\s\S]*?\/>/],
};

// ============================================================================
// FUNCIONES DE ANÁLISIS
// ============================================================================

/** Lee un archivo y retorna su contenido */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    return null;
  }
}

/** Analiza un archivo en busca de problemas */
function analyzeFile(filePath, content) {
  const fileName = path.basename(filePath);
  const issues = [];

  // 1. Detectar datos hardcodeados
  PATTERNS.hardcodedData.forEach((pattern) => {
    if (pattern.test(content)) {
      issues.push({
        type: 'hardcodedData',
        file: fileName,
        message: 'Contiene datos hardcodeados (JSON imports o valores fijos)',
        severity: 'high',
      });
    }
  });

  // 2. Verificar si necesita Firebase
  const hasFirebaseImport = /from ['"]firebase/.test(content);
  const hasFirebaseUsage = PATTERNS.needsFirebase.some((p) => p.test(content));

  if (!hasFirebaseImport && content.includes('collection') && content.includes('datos')) {
    issues.push({
      type: 'missingFirebase',
      file: fileName,
      message: 'Posiblemente necesita integración con Firebase',
      severity: 'medium',
    });
  }

  // 3. Detectar animaciones incorrectas
  PATTERNS.wrongAnimations.forEach((pattern) => {
    if (pattern.test(content)) {
      issues.push({
        type: 'wrongAnimations',
        file: fileName,
        message: 'Usa animaciones o theme deprecated (fadeInUp, theme.colors)',
        severity: 'medium',
      });
    }
  });

  // 4. Detectar problemas con fechas
  if (PATTERNS.dateIssues.some((p) => p.test(content))) {
    const hasDateFormatting = /toLocaleDateString|format.*fecha|toISOString/.test(content);
    if (!hasDateFormatting) {
      issues.push({
        type: 'dateRendering',
        file: fileName,
        message: 'Renderiza fechas sin formatear (posible error "Objects are not valid")',
        severity: 'high',
      });
    }
  }

  // 5. Verificar KpiCard3D props
  const kpiMatches = content.match(/<KpiCard3D[\s\S]*?\/>/g) || [];
  kpiMatches.forEach((match) => {
    const hasId = /id=/.test(match);
    const hasGradient = /gradient=/.test(match);
    const hasGlow = /glow=/.test(match);

    if (!hasId || !hasGradient || !hasGlow) {
      issues.push({
        type: 'missingProps',
        file: fileName,
        message: `KpiCard3D sin props requeridas (id: ${hasId}, gradient: ${hasGradient}, glow: ${hasGlow})`,
        severity: 'high',
      });
    }
  });

  // 6. CSS inline excesivo
  const inlineStyleMatches = content.match(/style=\{\{/g) || [];
  if (inlineStyleMatches.length > 20) {
    issues.push({
      type: 'cssInline',
      file: fileName,
      message: `CSS inline excesivo (${inlineStyleMatches.length} ocurrencias)`,
      severity: 'low',
    });
  }

  return issues;
}

/** Escanea un directorio recursivamente */
function scanDirectory(dirPath, results = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursivo en subdirectorios
      scanDirectory(filePath, results);
    } else if (file.match(/\.(tsx?|jsx?)$/)) {
      // Analizar archivos TS/JS
      const content = readFile(filePath);
      if (content) {
        const issues = analyzeFile(filePath, content);
        if (issues.length > 0) {
          results.push({ file: filePath, issues });
        }
      }
    }
  });

  return results;
}

// ============================================================================
// GENERACIÓN DE REPORTE
// ============================================================================

function generateReport(results) {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 REPORTE DE ANÁLISIS - FLOWDISTRIBUTOR');
  console.log('='.repeat(80) + '\n');

  // Agrupar por tipo de issue
  const byType = {
    hardcodedData: [],
    missingFirebase: [],
    wrongAnimations: [],
    dateRendering: [],
    missingProps: [],
    cssInline: [],
  };

  let totalIssues = 0;
  let highSeverity = 0;

  results.forEach(({ file, issues }) => {
    issues.forEach((issue) => {
      byType[issue.type].push({ ...issue, fullPath: file });
      totalIssues++;
      if (issue.severity === 'high') highSeverity++;
    });
  });

  // Resumen
  console.log('📊 RESUMEN:\n');
  console.log(`  Total de archivos analizados: ${results.length}`);
  console.log(`  Total de issues encontrados: ${totalIssues}`);
  console.log(`  Issues de alta severidad: ${highSeverity}\n`);

  // Detalle por tipo
  Object.entries(byType).forEach(([type, issues]) => {
    if (issues.length > 0) {
      console.log(`\n${'─'.repeat(80)}`);
      console.log(`📋 ${type.toUpperCase()} (${issues.length} archivos afectados):`);
      console.log('─'.repeat(80));

      issues.forEach(({ file, message, severity, fullPath }) => {
        const icon = severity === 'high' ? '🔴' : severity === 'medium' ? '🟡' : '🟢';
        console.log(`\n  ${icon} ${file}`);
        console.log(`     ${message}`);
        console.log(`     📁 ${fullPath}`);
      });
    }
  });

  // Recomendaciones
  console.log('\n' + '='.repeat(80));
  console.log('💡 RECOMENDACIONES:');
  console.log('='.repeat(80) + '\n');

  if (byType.hardcodedData.length > 0) {
    console.log('🔴 ALTA PRIORIDAD - Datos Hardcodeados:');
    console.log('   → Reemplazar imports de JSON con llamadas a Firebase');
    console.log('   → Usar hooks personalizados (useBancos, useVentas, etc.)\n');
  }

  if (byType.missingProps.length > 0) {
    console.log('🔴 ALTA PRIORIDAD - Props Faltantes:');
    console.log('   → Agregar props requeridas a KpiCard3D: id, gradient, glow');
    console.log('   → Verificar interfaces TypeScript\n');
  }

  if (byType.dateRendering.length > 0) {
    console.log('🔴 ALTA PRIORIDAD - Renderizado de Fechas:');
    console.log('   → Formatear fechas con toLocaleDateString() antes de renderizar');
    console.log('   → Manejar Timestamps de Firebase correctamente\n');
  }

  if (byType.wrongAnimations.length > 0) {
    console.log('🟡 MEDIA PRIORIDAD - Animaciones:');
    console.log('   → Reemplazar animations.fadeInUp con animations.container.fadeSlideUp');
    console.log('   → Remover referencias a theme.colors y theme.effects\n');
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ Análisis completado');
  console.log('='.repeat(80) + '\n');

  // Guardar reporte JSON
  const reportPath = path.join(__dirname, '../test-results/analysis-report.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(
    reportPath,
    JSON.stringify({ results, byType, summary: { totalIssues, highSeverity } }, null, 2)
  );
  console.log(`📄 Reporte JSON guardado en: ${reportPath}\n`);
}

// ============================================================================
// EJECUCIÓN
// ============================================================================

console.log('🚀 Iniciando análisis automático...\n');

const results = scanDirectory(COMPONENTS_PATH);
generateReport(results);
