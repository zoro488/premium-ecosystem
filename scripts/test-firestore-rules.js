#!/usr/bin/env node
/**
 * Test Firestore Security Rules
 * Valida que las reglas de Firestore funcionen correctamente
 */
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';





const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔒 Test de Reglas de Firestore\n');

try {
  // Leer archivo de reglas
  const rulesPath = join(__dirname, '..', 'firestore.rules');
  const rules = readFileSync(rulesPath, 'utf8');

  console.log('✅ Archivo de reglas encontrado');
  console.log(`📄 Tamaño: ${rules.length} caracteres\n`);

  // Validaciones básicas
  const checks = [
    {
      name: 'Contiene service cloud.firestore',
      test: rules.includes('service cloud.firestore'),
    },
    {
      name: 'Tiene reglas para match /databases',
      test: rules.includes('match /databases/{database}/documents'),
    },
    {
      name: 'Tiene validación de auth',
      test: rules.includes('request.auth'),
    },
    {
      name: 'Tiene reglas de lectura',
      test: rules.includes('allow read'),
    },
    {
      name: 'Tiene reglas de escritura',
      test: rules.includes('allow write') || rules.includes('allow create'),
    },
  ];

  let passed = 0;
  let failed = 0;

  console.log('🧪 Validaciones:\n');
  checks.forEach((check) => {
    if (check.test) {
      console.log(`✅ ${check.name}`);
      passed++;
    } else {
      console.log(`❌ ${check.name}`);
      failed++;
    }
  });

  console.log(`\n📊 Resultado: ${passed}/${checks.length} checks pasados\n`);

  if (failed > 0) {
    console.log('⚠️  Algunas validaciones fallaron');
    process.exit(1);
  }

  console.log('✅ Todas las validaciones pasaron');
  console.log('\n💡 Para desplegar las reglas:');
  console.log('   firebase deploy --only firestore:rules');

  process.exit(0);
} catch (error) {
  console.error('❌ Error al validar reglas:', error.message);
  process.exit(1);
}
