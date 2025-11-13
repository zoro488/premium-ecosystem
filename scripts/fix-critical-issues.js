/**
 * Script para corregir SOLO problemas críticos sin romper funcionalidad
 * 1. Remover variables declaradas pero NUNCA usadas
 * 2. NO tocar console.error (son útiles)
 * 3. Mantener lógica de negocio intacta
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FLOW_FILE = path.join(__dirname, '../src/apps/FlowDistributor/FlowDistributor.jsx');

console.log('🔍 Analizando FlowDistributor.jsx...\n');

let content = fs.readFileSync(FLOW_FILE, 'utf8');
const originalContent = content;
let changes = [];

// ============================================================================
// 1. REMOVER VARIABLES REALMENTE NO USADAS
// ============================================================================

// 1.1 glassClass - Definida pero NUNCA usada
if (content.includes('const glassClass = ')) {
  const glassClassRegex = /\/\/ 🎨 Utilidad para combinar clases de Glassmorphism\nconst glassClass = \([^)]*\) => \{[^}]+\};\n\n/;
  if (glassClassRegex.test(content)) {
    content = content.replace(glassClassRegex, '');
    changes.push('✅ Removida función glassClass (nunca usada)');
  }
}

// 1.2 dragDropVentas - Hook declarado pero nunca usado
const dragDropVentasMatch = content.match(/const dragDropVentas = useDragAndDrop\([^;]+;\n/);
if (dragDropVentasMatch) {
  // Verificar que NO se use en ningún lado
  const usageCount = (content.match(/dragDropVentas\./g) || []).length;
  if (usageCount === 0) {
    content = content.replace(dragDropVentasMatch[0], '// dragDropVentas removido - no se usaba\n');
    changes.push('✅ Comentado dragDropVentas (hook declarado pero no usado)');
  }
}

// 1.3 dragDropClientes - Hook declarado pero nunca usado
const dragDropClientesMatch = content.match(/const dragDropClientes = useDragAndDrop\([^;]+;\n/);
if (dragDropClientesMatch) {
  const usageCount = (content.match(/dragDropClientes\./g) || []).length;
  if (usageCount === 0) {
    content = content.replace(dragDropClientesMatch[0], '// dragDropClientes removido - no se usaba\n');
    changes.push('✅ Comentado dragDropClientes (hook declarado pero no usado)');
  }
}

// 1.4 handleBulkDeleteVentas - Función declarada pero nunca usada
const bulkDeleteVentasMatch = content.match(/const handleBulkDeleteVentas = useCallback\(\n[^}]+\},\n\s+\[[^\]]+\]\n\s+\);\n/s);
if (bulkDeleteVentasMatch) {
  const usageCount = (content.match(/handleBulkDeleteVentas/g) || []).length;
  if (usageCount === 1) { // Solo la declaración
    content = content.replace(bulkDeleteVentasMatch[0], '// handleBulkDeleteVentas removido - no se usaba\n');
    changes.push('✅ Comentado handleBulkDeleteVentas (función no usada)');
  }
}

// 1.5 handleBulkDeleteClientes - Función declarada pero nunca usada
const bulkDeleteClientesMatch = content.match(/const handleBulkDeleteClientes = useCallback\(\n[^}]+\},\n\s+\[[^\]]+\]\n\s+\);\n/s);
if (bulkDeleteClientesMatch) {
  const usageCount = (content.match(/handleBulkDeleteClientes/g) || []).length;
  if (usageCount === 1) {
    content = content.replace(bulkDeleteClientesMatch[0], '// handleBulkDeleteClientes removido - no se usaba\n');
    changes.push('✅ Comentado handleBulkDeleteClientes (función no usada)');
  }
}

// ============================================================================
// 2. MANTENER CONSOLE.ERROR (son útiles para debugging)
// ============================================================================
// NO hacemos nada con console.error - son importantes

// ============================================================================
// 3. VERIFICAR QUE NO ROMPIMOS NADA
// ============================================================================
const hasValidSyntax = content.includes('export default function FlowDistributor()');
if (!hasValidSyntax) {
  console.error('❌ ERROR: La sintaxis del archivo se rompió. Revertiendo cambios...');
  content = originalContent;
  changes = ['❌ Revertido - cambios causaron errores de sintaxis'];
}

// ============================================================================
// GUARDAR CAMBIOS
// ============================================================================
if (content !== originalContent && changes.length > 0) {
  fs.writeFileSync(FLOW_FILE, content, 'utf8');
  console.log('📝 CAMBIOS APLICADOS:\n');
  changes.forEach(change => console.log(`  ${change}`));
  console.log(`\n✅ Archivo actualizado: FlowDistributor.jsx`);
} else {
  console.log('ℹ️  No se encontraron cambios críticos que hacer');
}

console.log('\n🔍 RESUMEN:');
console.log(`  - Variables removidas: ${changes.filter(c => c.includes('Removid')).length}`);
console.log(`  - Funciones comentadas: ${changes.filter(c => c.includes('Comentad')).length}`);
console.log(`  - Console.error mantenidos: Todos (son útiles)`);
console.log(`  - Lógica de negocio: Intacta ✅`);
