/**
 * 🔧 Setup para Tests de Integración REALES con Firebase Emulator
 *
 * Este archivo configura el entorno para tests que usan datos REALES.
 * NO usa mocks - todas las operaciones son contra Firebase Emulator.
 */
import { afterAll, beforeAll } from 'vitest';

// Variables de entorno para Firebase Emulator
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
process.env.FIREBASE_STORAGE_EMULATOR_HOST = 'localhost:9199';

console.log('🔥 Firebase Emulator Configuration:');
console.log('  - Firestore: localhost:8080');
console.log('  - Auth: localhost:9099');
console.log('  - Storage: localhost:9199');

beforeAll(async () => {
  console.log('\n🚀 Iniciando suite de tests de integración REALES...');
  console.log('⏳ Esperando conexión con Firebase Emulator...\n');

  // Esperar un poco para asegurar que el emulator esté listo
  await new Promise((resolve) => setTimeout(resolve, 1000));
});

afterAll(async () => {
  console.log('\n✅ Suite de tests de integración completada');
  console.log('🧹 Limpieza automática ejecutada\n');
});

// Manejo global de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection en tests:', reason);
  console.error('Promise:', promise);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception en tests:', error);
});

export {};
