/**
 * Setup para tests de integración con Firebase Emulator
 */
import { afterAll, beforeAll } from 'vitest';

beforeAll(() => {
  // Configurar Firebase Emulator
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
  console.log('✅ Firebase Emulator configurado en localhost:8080');
});

afterAll(() => {
  console.log('🛑 Limpieza de tests de integración completada');
});
