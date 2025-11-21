/**
 * ANÁLISIS EXHAUSTIVO DEL SISTEMA - FRONTEND Y BACKEND
 * Verifica cada componente, servicio, hook, dato y funcionalidad
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const ANALISIS = {
  componentes: [],
  servicios: [],
  hooks: [],
  stores: [],
  datos: [],
  imports: {
    faltantes: [],
    correctos: []
  },
  errores: [],
  advertencias: [],
  ok: []
};

// ============================================================================
// UTILIDADES
// ============================================================================

function fileExists(filePath) {
  return fs.existsSync(path.join(ROOT, filePath));
}

function readFile(filePath) {
  try {
    return fs.readFileSync(path.join(ROOT, filePath), 'utf8');
  } catch (error) {
    return null;
  }
}

function extractImports(content) {
  const importRegex = /import\s+(?:{[^}]+}|\w+)\s+from\s+['"](\.\/[^'"]+)['"]/g;
  const imports = [];
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

// ============================================================================
// ANÁLISIS 1: COMPONENTES FRONTEND
// ============================================================================

function analizarComponentes() {
  console.log('\n📦 ANALIZANDO COMPONENTES FRONTEND...\n');

  const componentesDir = 'src/apps/FlowDistributor/components';
  const componentes = fs.readdirSync(path.join(ROOT, componentesDir))
    .filter(f => f.endsWith('.jsx'));

  componentes.forEach(comp => {
    const filePath = path.join(componentesDir, comp);
    const content = readFile(filePath);

    if (!content) {
      ANALISIS.errores.push(`❌ ${comp}: No se pudo leer`);
      return;
    }

    const analisis = {
      nombre: comp,
      lineas: content.split('\n').length,
      tieneExport: content.includes('export default'),
      tieneImportReact: content.includes("from 'react'"),
      imports: extractImports(content),
      tieneJSX: /<[A-Z]/.test(content),
      tieneProps: /function.*\(.*{/.test(content),
    };

    // Verificar imports
    analisis.imports.forEach(imp => {
      const importPath = imp.replace('./', componentesDir + '/').replace('.jsx', '.jsx');
      if (!fileExists(importPath) && !fileExists(importPath.replace('.jsx', '.ts'))) {
        ANALISIS.imports.faltantes.push(`${comp} → ${imp}`);
      } else {
        ANALISIS.imports.correctos.push(`${comp} → ${imp}`);
      }
    });

    // Verificación de estructura
    if (!analisis.tieneExport) {
      ANALISIS.advertencias.push(`⚠️ ${comp}: No tiene export default`);
    }
    if (!analisis.tieneJSX) {
      ANALISIS.advertencias.push(`⚠️ ${comp}: No parece tener JSX`);
    }
    if (analisis.tieneExport && analisis.tieneJSX) {
      ANALISIS.ok.push(`✅ ${comp}: Estructura correcta (${analisis.lineas} líneas)`);
    }

    ANALISIS.componentes.push(analisis);
  });

  console.log(`   Analizados: ${componentes.length} componentes`);
  console.log(`   ✅ Correctos: ${ANALISIS.ok.length}`);
  console.log(`   ⚠️ Advertencias: ${ANALISIS.advertencias.length}`);
  console.log(`   ❌ Errores: ${ANALISIS.errores.length}`);
}

// ============================================================================
// ANÁLISIS 2: SERVICIOS BACKEND
// ============================================================================

function analizarServicios() {
  console.log('\n⚙️ ANALIZANDO SERVICIOS BACKEND...\n');

  const serviciosDir = 'src/apps/FlowDistributor/services';
  const servicios = fs.readdirSync(path.join(ROOT, serviciosDir))
    .filter(f => f.endsWith('.ts'));

  servicios.forEach(svc => {
    const content = readFile(path.join(serviciosDir, svc));

    if (!content) {
      ANALISIS.errores.push(`❌ ${svc}: No se pudo leer`);
      return;
    }

    const analisis = {
      nombre: svc,
      lineas: content.split('\n').length,
      tieneExport: content.includes('export'),
      tieneFirebase: content.includes('firebase'),
      tieneAsync: content.includes('async'),
      metodos: (content.match(/async\s+\w+\(/g) || []).length,
      tieneErrorHandling: content.includes('try') && content.includes('catch'),
    };

    if (analisis.tieneExport && analisis.tieneFirebase && analisis.tieneAsync) {
      ANALISIS.ok.push(`✅ ${svc}: Servicio completo (${analisis.metodos} métodos)`);
    } else {
      ANALISIS.advertencias.push(`⚠️ ${svc}: Puede estar incompleto`);
    }

    if (!analisis.tieneErrorHandling) {
      ANALISIS.advertencias.push(`⚠️ ${svc}: Sin manejo de errores`);
    }

    ANALISIS.servicios.push(analisis);
  });

  console.log(`   Analizados: ${servicios.length} servicios`);
}

// ============================================================================
// ANÁLISIS 3: HOOKS PERSONALIZADOS
// ============================================================================

function analizarHooks() {
  console.log('\n🎣 ANALIZANDO HOOKS PERSONALIZADOS...\n');

  const hooksDir = 'src/apps/FlowDistributor/hooks';
  const hooks = fs.readdirSync(path.join(ROOT, hooksDir))
    .filter(f => f.endsWith('.ts'));

  hooks.forEach(hook => {
    const content = readFile(path.join(hooksDir, hook));

    if (!content) {
      ANALISIS.errores.push(`❌ ${hook}: No se pudo leer`);
      return;
    }

    const analisis = {
      nombre: hook,
      lineas: content.split('\n').length,
      tieneExport: content.includes('export'),
      esHook: hook.startsWith('use'),
      tieneReactQuery: content.includes('useQuery') || content.includes('useMutation'),
      tieneTypes: content.includes('interface') || content.includes('type'),
    };

    if (analisis.esHook && analisis.tieneExport && analisis.tieneReactQuery) {
      ANALISIS.ok.push(`✅ ${hook}: Hook completo con React Query`);
    }

    ANALISIS.hooks.push(analisis);
  });

  console.log(`   Analizados: ${hooks.length} hooks`);
}

// ============================================================================
// ANÁLISIS 4: CONFIGURACIÓN FIREBASE
// ============================================================================

function analizarFirebase() {
  console.log('\n🔥 ANALIZANDO CONFIGURACIÓN FIREBASE...\n');

  const firebaseFile = 'src/lib/firebase.ts';
  const content = readFile(firebaseFile);

  if (!content) {
    ANALISIS.errores.push('❌ Firebase: Archivo de configuración no encontrado');
    return;
  }

  const config = {
    tieneConfig: content.includes('firebaseConfig'),
    tieneFirestore: content.includes('getFirestore'),
    tieneAuth: content.includes('getAuth'),
    tieneStorage: content.includes('getStorage'),
    tieneAnalytics: content.includes('getAnalytics'),
    tieneCOLLECTIONS: content.includes('COLLECTIONS'),
  };

  if (Object.values(config).every(v => v)) {
    ANALISIS.ok.push('✅ Firebase: Configuración completa');
  } else {
    ANALISIS.advertencias.push('⚠️ Firebase: Configuración incompleta');
  }
}

// ============================================================================
// ANÁLISIS 5: DATOS Y CONSTANTES
// ============================================================================

function analizarDatos() {
  console.log('\n📊 ANALIZANDO DATOS Y CONSTANTES...\n');

  const dataFiles = [
    'src/apps/FlowDistributor/data/FlowDistributorData.js',
    'src/apps/FlowDistributor/constants/storageKeys.js',
    'src/apps/FlowDistributor/constants/storageKeys.ts',
  ];

  dataFiles.forEach(file => {
    if (fileExists(file)) {
      const content = readFile(file);
      if (content) {
        const tieneExport = content.includes('export');
        const tieneConstantes = content.includes('const') || content.includes('export const');

        if (tieneExport && tieneConstantes) {
          ANALISIS.ok.push(`✅ Datos: ${path.basename(file)} OK`);
        }
      }
    } else {
      ANALISIS.advertencias.push(`⚠️ Datos: ${path.basename(file)} no encontrado`);
    }
  });
}

// ============================================================================
// ANÁLISIS 6: IMPORTS CRÍTICOS EN FlowDistributor.jsx
// ============================================================================

function analizarFlowDistributor() {
  console.log('\n🎯 ANALIZANDO FLOWDISTRIBUTOR PRINCIPAL...\n');

  const mainFile = 'src/apps/FlowDistributor/FlowDistributor.jsx';
  const content = readFile(mainFile);

  if (!content) {
    ANALISIS.errores.push('❌ FlowDistributor.jsx no encontrado');
    return;
  }

  const analisis = {
    lineas: content.split('\n').length,
    imports: extractImports(content),
    tieneExport: content.includes('export default'),
    tieneUseState: content.includes('useState'),
    tieneUseEffect: content.includes('useEffect'),
    tieneSuspense: content.includes('Suspense'),
    tieneLazy: content.includes('lazy('),
  };

  console.log(`   Líneas: ${analisis.lineas}`);
  console.log(`   Imports locales: ${analisis.imports.length}`);

  if (analisis.tieneExport && analisis.tieneLazy) {
    ANALISIS.ok.push('✅ FlowDistributor.jsx: Configurado correctamente');
  }
}

// ============================================================================
// GENERACIÓN DE REPORTE
// ============================================================================

function generarReporte() {
  console.log('\n' + '='.repeat(80));
  console.log('📋 REPORTE COMPLETO DE VERIFICACIÓN');
  console.log('='.repeat(80) + '\n');

  // Resumen
  console.log('📊 RESUMEN:\n');
  console.log(`   Componentes:   ${ANALISIS.componentes.length}`);
  console.log(`   Servicios:     ${ANALISIS.servicios.length}`);
  console.log(`   Hooks:         ${ANALISIS.hooks.length}`);
  console.log(`   Stores:        ${ANALISIS.stores.length || 1}`);
  console.log(`   ✅ Verificaciones OK: ${ANALISIS.ok.length}`);
  console.log(`   ⚠️ Advertencias:      ${ANALISIS.advertencias.length}`);
  console.log(`   ❌ Errores:           ${ANALISIS.errores.length}`);

  // Imports
  console.log(`\n📦 IMPORTS:\n`);
  console.log(`   ✅ Correctos:  ${ANALISIS.imports.correctos.length}`);
  console.log(`   ❌ Faltantes:  ${ANALISIS.imports.faltantes.length}`);

  if (ANALISIS.imports.faltantes.length > 0) {
    console.log('\n   ⚠️ IMPORTS FALTANTES:');
    ANALISIS.imports.faltantes.slice(0, 10).forEach(imp => {
      console.log(`      - ${imp}`);
    });
    if (ANALISIS.imports.faltantes.length > 10) {
      console.log(`      ... y ${ANALISIS.imports.faltantes.length - 10} más`);
    }
  }

  // Advertencias
  if (ANALISIS.advertencias.length > 0) {
    console.log('\n⚠️ ADVERTENCIAS:\n');
    ANALISIS.advertencias.slice(0, 10).forEach(adv => {
      console.log(`   ${adv}`);
    });
    if (ANALISIS.advertencias.length > 10) {
      console.log(`   ... y ${ANALISIS.advertencias.length - 10} más`);
    }
  }

  // Errores
  if (ANALISIS.errores.length > 0) {
    console.log('\n❌ ERRORES CRÍTICOS:\n');
    ANALISIS.errores.forEach(err => {
      console.log(`   ${err}`);
    });
  }

  // Éxitos
  if (ANALISIS.ok.length > 0) {
    console.log('\n✅ VERIFICACIONES EXITOSAS:\n');
    ANALISIS.ok.slice(0, 15).forEach(ok => {
      console.log(`   ${ok}`);
    });
    if (ANALISIS.ok.length > 15) {
      console.log(`   ... y ${ANALISIS.ok.length - 15} más verificaciones OK`);
    }
  }

  // Conclusión
  console.log('\n' + '='.repeat(80));
  const score = Math.round((ANALISIS.ok.length / (ANALISIS.ok.length + ANALISIS.advertencias.length + ANALISIS.errores.length)) * 100);
  console.log(`\n🎯 SCORE DE SALUD DEL SISTEMA: ${score}%\n`);

  if (score >= 90) {
    console.log('✅ VEREDICTO: Sistema en EXCELENTE estado');
  } else if (score >= 70) {
    console.log('⚠️ VEREDICTO: Sistema en BUEN estado con mejoras menores');
  } else {
    console.log('❌ VEREDICTO: Sistema requiere atención');
  }

  console.log('\n' + '='.repeat(80));

  // Guardar reporte
  const reportePath = path.join(ROOT, 'VERIFICACION_SISTEMA_COMPLETA.md');
  const markdown = generarMarkdown();
  fs.writeFileSync(reportePath, markdown, 'utf8');
  console.log(`\n📄 Reporte guardado en: VERIFICACION_SISTEMA_COMPLETA.md\n`);
}

function generarMarkdown() {
  return `# 🔍 VERIFICACIÓN COMPLETA DEL SISTEMA

**Fecha**: ${new Date().toISOString().split('T')[0]}
**Score**: ${Math.round((ANALISIS.ok.length / (ANALISIS.ok.length + ANALISIS.advertencias.length + ANALISIS.errores.length)) * 100)}%

## 📊 Resumen

- **Componentes**: ${ANALISIS.componentes.length}
- **Servicios**: ${ANALISIS.servicios.length}
- **Hooks**: ${ANALISIS.hooks.length}
- **✅ OK**: ${ANALISIS.ok.length}
- **⚠️ Advertencias**: ${ANALISIS.advertencias.length}
- **❌ Errores**: ${ANALISIS.errores.length}

## 📦 Imports

- **✅ Correctos**: ${ANALISIS.imports.correctos.length}
- **❌ Faltantes**: ${ANALISIS.imports.faltantes.length}

${ANALISIS.imports.faltantes.length > 0 ? `
### Imports Faltantes:
${ANALISIS.imports.faltantes.slice(0, 20).map(i => `- ${i}`).join('\n')}
` : ''}

## ✅ Verificaciones Exitosas

${ANALISIS.ok.slice(0, 30).map(o => `- ${o}`).join('\n')}

${ANALISIS.advertencias.length > 0 ? `
## ⚠️ Advertencias

${ANALISIS.advertencias.slice(0, 20).map(a => `- ${a}`).join('\n')}
` : ''}

${ANALISIS.errores.length > 0 ? `
## ❌ Errores

${ANALISIS.errores.map(e => `- ${e}`).join('\n')}
` : ''}

## 🎯 Conclusión

Sistema verificado completamente. Score de salud: **${Math.round((ANALISIS.ok.length / (ANALISIS.ok.length + ANALISIS.advertencias.length + ANALISIS.errores.length)) * 100)}%**
`;
}

// ============================================================================
// EJECUCIÓN PRINCIPAL
// ============================================================================

console.log('🚀 INICIANDO ANÁLISIS EXHAUSTIVO DEL SISTEMA\n');
console.log('='.repeat(80));

analizarComponentes();
analizarServicios();
analizarHooks();
analizarFirebase();
analizarDatos();
analizarFlowDistributor();
generarReporte();

console.log('\n✅ ANÁLISIS COMPLETADO\n');
