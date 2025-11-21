import fs from 'fs';

// Este script usa las credenciales web para crear un archivo de configuración alternativo
// que puede usarse para algunas operaciones básicas

const firebaseConfig = {
  projectId: 'premium-ecosystem-1760790572',
  appId: '1:100411784487:web:ac2713291717869bc83d02',
  storageBucket: 'premium-ecosystem-1760790572.firebasestorage.app',
  apiKey: 'AIzaSyCR7zKZJAzCEq-jBbfkLJxWaz98zuRCkX4',
  authDomain: 'premium-ecosystem-1760790572.firebaseapp.com',
  messagingSenderId: '100411784487',
  measurementId: 'G-W9MGNWKX4E',
};

console.log('\n╔═══════════════════════════════════════════════════════╗');
console.log('║                                                       ║');
console.log('║     🔧 ALTERNATIVA: Usando Firebase Web SDK         ║');
console.log('║                                                       ║');
console.log('╚═══════════════════════════════════════════════════════╝\n');

console.log('⚠️  NOTA: El Admin SDK requiere Service Account Key');
console.log('   Para importación masiva, DEBES descargar el archivo.\n');

console.log('📋 OPCIONES DISPONIBLES:\n');

console.log('Opción 1 - Usar archivo existente de otro proyecto:');
console.log('  • Tienes: chronos-176d8-firebase-adminsdk-fbsvc-44c3e9f82c.json');
console.log('  • Si ambos proyectos están en la misma cuenta Google');
console.log('  • Puedes intentar usar ese archivo temporalmente\n');

console.log('Opción 2 - Descargar con gcloud CLI:');
console.log('  1. Instala: https://cloud.google.com/sdk/docs/install');
console.log('  2. Ejecuta: gcloud auth login');
console.log('  3. Ejecuta: gcloud iam service-accounts keys create serviceAccountKey.json \\');
console.log(
  '              --iam-account=firebase-adminsdk@premium-ecosystem-1760790572.iam.gserviceaccount.com\n'
);

console.log('Opción 3 - REST API (más complejo):');
console.log('  Requiere OAuth token y varios pasos\n');

console.log('Opción 4 - Manual (MÁS RÁPIDO):');
console.log(
  '  1. https://console.firebase.google.com/u/0/project/premium-ecosystem-1760790572/settings/serviceaccounts/adminsdk'
);
console.log('  2. Click "Generate new private key"');
console.log('  3. Descarga y ejecuta: npm run credentials:move\n');

// Intentar con archivo existente
console.log('🔍 Buscando archivos de credenciales existentes...\n');

const possibleFiles = [
  '../chronos-176d8-firebase-adminsdk-fbsvc-44c3e9f82c.json',
  process.env.USERPROFILE + '/Downloads/chronos-176d8-firebase-adminsdk-fbsvc-44c3e9f82c.json',
  process.env.USERPROFILE + '/Downloads/premium-ecosystem-*.json',
];

for (const file of possibleFiles) {
  if (fs.existsSync(file)) {
    console.log(`✓ Encontrado: ${file}`);
  }
}

console.log('\n💡 RECOMENDACIÓN:');
console.log('   La forma más rápida es la descarga manual (Opción 4)');
console.log('   Toma solo 30 segundos.\n');

process.exit(0);
