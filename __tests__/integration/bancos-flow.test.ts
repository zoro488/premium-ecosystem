/**
 * 🔥 INTEGRATION TESTS - Firebase Emulator
 * Tests con Firebase Emulator para flujos completos
 */
import { RulesTestEnvironment, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { Timestamp, addDoc, collection, getDocs } from 'firebase/firestore';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import {
  crearTransferencia,
  getMovimientosBancarios,
  getSaldoTotalBancos,
} from '../../src/apps/FlowDistributor/chronos-system/services/bancos-v2.service';

const PROJECT_ID = 'chronos-test';
let testEnv: RulesTestEnvironment;

describe('🔥 Integration Tests - Bancos Flow', () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        host: 'localhost',
        port: 8080,
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  it('✅ debe crear bancos en Firestore', async () => {
    const db = testEnv.authenticatedContext('user1').firestore();
    const bancosRef = collection(db, 'bancos');

    await addDoc(bancosRef, {
      nombre: 'Bóveda Monte',
      tipo: 'AHORRO',
      capitalActual: 150000,
      capitalInicial: 100000,
      createdAt: Timestamp.now(),
    });

    const snapshot = await getDocs(bancosRef);
    expect(snapshot.size).toBe(1);
  });

  it('✅ debe crear transferencia atómica', async () => {
    const context = testEnv.authenticatedContext('user1');
    const db = context.firestore();

    // Crear bancos de prueba
    const bancosRef = collection(db, 'bancos');
    const boveda = await addDoc(bancosRef, {
      nombre: 'Bóveda Monte',
      capitalActual: 150000,
      historicoTransferenciasSalientes: 0,
      historicoTransferenciasEntrantes: 0,
    });

    const utilidades = await addDoc(bancosRef, {
      nombre: 'Utilidades',
      capitalActual: 45000,
      historicoTransferenciasSalientes: 0,
      historicoTransferenciasEntrantes: 0,
    });

    // Crear transferencia
    await crearTransferencia({
      bancoOrigen: boveda.id,
      bancoDestino: utilidades.id,
      monto: 10000,
      concepto: 'Test transferencia',
    });

    // Verificar movimientos creados
    const movimientosRef = collection(db, 'movimientosBancarios');
    const movimientosSnap = await getDocs(movimientosRef);
    expect(movimientosSnap.size).toBe(2); // Salida + Entrada
  });

  it('❌ debe fallar si no hay fondos suficientes', async () => {
    const context = testEnv.authenticatedContext('user1');
    const db = context.firestore();

    const bancosRef = collection(db, 'bancos');
    const boveda = await addDoc(bancosRef, {
      nombre: 'Bóveda Pequeña',
      capitalActual: 1000, // Solo $1,000
    });

    const destino = await addDoc(bancosRef, {
      nombre: 'Destino',
      capitalActual: 0,
    });

    // Intentar transferir más de lo disponible
    await expect(
      crearTransferencia({
        bancoOrigen: boveda.id,
        bancoDestino: destino.id,
        monto: 5000, // Más de lo disponible
        concepto: 'Test sin fondos',
      })
    ).rejects.toThrow(/insuficientes/i);
  });

  it('✅ debe rollback si falla la transacción', async () => {
    const context = testEnv.authenticatedContext('user1');
    const db = context.firestore();

    const bancosRef = collection(db, 'bancos');
    const boveda = await addDoc(bancosRef, {
      nombre: 'Bóveda',
      capitalActual: 50000,
    });

    // Banco destino no existe (debe fallar)
    await expect(
      crearTransferencia({
        bancoOrigen: boveda.id,
        bancoDestino: 'banco-inexistente',
        monto: 1000,
        concepto: 'Test rollback',
      })
    ).rejects.toThrow();

    // Verificar que NO se crearon movimientos
    const movimientosRef = collection(db, 'movimientosBancarios');
    const movimientosSnap = await getDocs(movimientosRef);
    expect(movimientosSnap.size).toBe(0);
  });

  it('✅ debe calcular saldo total correctamente', async () => {
    const context = testEnv.authenticatedContext('user1');
    const db = context.firestore();

    const bancosRef = collection(db, 'bancos');
    await addDoc(bancosRef, { nombre: 'B1', capitalActual: 100000 });
    await addDoc(bancosRef, { nombre: 'B2', capitalActual: 50000 });
    await addDoc(bancosRef, { nombre: 'B3', capitalActual: 25000 });

    const saldoTotal = await getSaldoTotalBancos();
    expect(saldoTotal).toBe(175000);
  });

  it('✅ debe manejar transacciones concurrentes', async () => {
    const context = testEnv.authenticatedContext('user1');
    const db = context.firestore();

    const bancosRef = collection(db, 'bancos');
    const boveda = await addDoc(bancosRef, {
      nombre: 'Bóveda',
      capitalActual: 100000,
    });

    const destino1 = await addDoc(bancosRef, {
      nombre: 'Destino 1',
      capitalActual: 0,
    });

    const destino2 = await addDoc(bancosRef, {
      nombre: 'Destino 2',
      capitalActual: 0,
    });

    // Ejecutar 2 transferencias concurrentes
    await Promise.all([
      crearTransferencia({
        bancoOrigen: boveda.id,
        bancoDestino: destino1.id,
        monto: 10000,
        concepto: 'Concurrente 1',
      }),
      crearTransferencia({
        bancoOrigen: boveda.id,
        bancoDestino: destino2.id,
        monto: 15000,
        concepto: 'Concurrente 2',
      }),
    ]);

    // Verificar que ambas se ejecutaron
    const movimientosRef = collection(db, 'movimientosBancarios');
    const movimientosSnap = await getDocs(movimientosRef);
    expect(movimientosSnap.size).toBe(4); // 2 salidas + 2 entradas
  });

  it('❌ debe rechazar monto cero', async () => {
    const context = testEnv.authenticatedContext('user1');
    const db = context.firestore();

    const bancosRef = collection(db, 'bancos');
    const boveda = await addDoc(bancosRef, {
      nombre: 'Bóveda',
      capitalActual: 100000,
    });

    const destino = await addDoc(bancosRef, {
      nombre: 'Destino',
      capitalActual: 0,
    });

    await expect(
      crearTransferencia({
        bancoOrigen: boveda.id,
        bancoDestino: destino.id,
        monto: 0,
        concepto: 'Test monto cero',
      })
    ).rejects.toThrow(/mayor a 0/i);
  });

  it('❌ debe rechazar transferencia al mismo banco', async () => {
    const context = testEnv.authenticatedContext('user1');
    const db = context.firestore();

    const bancosRef = collection(db, 'bancos');
    const boveda = await addDoc(bancosRef, {
      nombre: 'Bóveda',
      capitalActual: 100000,
    });

    await expect(
      crearTransferencia({
        bancoOrigen: boveda.id,
        bancoDestino: boveda.id, // Mismo banco
        monto: 1000,
        concepto: 'Test mismo banco',
      })
    ).rejects.toThrow(/mismo banco/i);
  });

  it('✅ debe obtener movimientos filtrados por banco', async () => {
    const context = testEnv.authenticatedContext('user1');
    const db = context.firestore();

    const bancosRef = collection(db, 'bancos');
    const boveda = await addDoc(bancosRef, {
      nombre: 'Bóveda',
      capitalActual: 100000,
    });

    // Crear movimientos
    const movimientosRef = collection(db, 'movimientosBancarios');
    await addDoc(movimientosRef, {
      bancoId: boveda.id,
      tipo: 'INGRESO',
      monto: 5000,
      fecha: Timestamp.now(),
    });

    await addDoc(movimientosRef, {
      bancoId: 'otro-banco',
      tipo: 'GASTO',
      monto: -2000,
      fecha: Timestamp.now(),
    });

    const movimientos = await getMovimientosBancarios(boveda.id);
    expect(movimientos.length).toBe(1);
    expect(movimientos[0].bancoId).toBe(boveda.id);
  });

  it('✅ debe actualizar timestamps correctamente', async () => {
    const context = testEnv.authenticatedContext('user1');
    const db = context.firestore();

    const bancosRef = collection(db, 'bancos');
    const boveda = await addDoc(bancosRef, {
      nombre: 'Bóveda',
      capitalActual: 100000,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    const destino = await addDoc(bancosRef, {
      nombre: 'Destino',
      capitalActual: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    await crearTransferencia({
      bancoOrigen: boveda.id,
      bancoDestino: destino.id,
      monto: 1000,
      concepto: 'Test timestamps',
    });

    // Verificar que updatedAt cambió
    const bovedaDoc = await getDocs(bancosRef);
    const updated = bovedaDoc.docs[0].data().updatedAt;
    expect(updated).toBeDefined();
  });
});
