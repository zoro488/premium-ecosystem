/**
 * Optimización de Performance - MÉTODO SEGURO
 * Agrega React.memo solo al export, no modifica el componente
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const componentsToOptimize = [
  'src/apps/FlowDistributor/components/PanelFletes.jsx',
  'src/apps/FlowDistributor/components/PanelClientes.jsx',
  'src/apps/FlowDistributor/components/PanelBovedaMonteFinanciero.jsx',
  'src/apps/FlowDistributor/components/PanelUtilidades.jsx',
];

console.log('🚀 OPTIMIZACIÓN SEGURA - REACT.MEMO\n');

componentsToOptimize.forEach((file) => {
  const filePath = path.join(ROOT, file);
  const fileName = path.basename(file, '.jsx');

  console.log(`📦 ${fileName}...`);

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Verificar si ya tiene React.memo
    if (content.includes('React.memo(')) {
      console.log(`   ✅ Ya optimizado\n`);
      return;
    }

    // 1. Asegurar import de React
    if (!content.match(/import\s+React/)) {
      // Agregar React al principio de los imports
      content = content.replace(
        /^(import\s+{)/m,
        "import React, { "
      );
    }

    // 2. Encontrar export default y wrappear con React.memo
    // Método simple: solo cambiar la línea del export
    content = content.replace(
      new RegExp(`export default function ${fileName}`),
      `function ${fileName}`
    );

    // Agregar export con memo al final
    content = content.trim() + `\n\nexport default React.memo(${fileName});\n`;

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`   ✅ Optimizado\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }
});

console.log('✅ Optimización completada');
