/**
 * Reparar componentes rotos por optimización
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const brokenFiles = [
  'src/apps/FlowDistributor/components/PanelFletes.jsx',
  'src/apps/FlowDistributor/components/PanelClientes.jsx',
  'src/apps/FlowDistributor/components/PanelBovedaMonteFinanciero.jsx',
  'src/apps/FlowDistributor/components/PanelUtilidades.jsx',
];

console.log('🔧 REPARANDO COMPONENTES ROTOS\n');

brokenFiles.forEach((file) => {
  const filePath = path.join(ROOT, file);
  const componentName = path.basename(file, '.jsx');

  console.log(`📦 ${componentName}...`);

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Detectar patrón roto: const { something });
    //                      export default ComponentMemo; = something();
    const brokenPattern = /const\s*{\s*([^}]+)\s*}\s*\);\s*export\s+default\s+\w+Memo;\s*=\s*([^;]+);/g;

    if (brokenPattern.test(content)) {
      console.log(`   🔍 Detectado patrón roto, reparando...`);

      // Reparar el patrón
      content = content.replace(brokenPattern, 'const { $1 } = $2;');

      // Remover export default ComponentMemo; duplicados en medio del código
      content = content.replace(/\nexport default \w+Memo;\s*\n/g, '\n');

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`   ✅ Reparado\n`);
    } else {
      console.log(`   ℹ️  No se detectó patrón roto\n`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }
});

console.log('✅ Reparación completada');
console.log('\n🧪 Ejecutar: npm run build');
