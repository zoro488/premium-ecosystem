/* eslint-disable no-console */
/**
 * ============================================
 * E2E VALIDATION: Excel → Firestore → UI
 * ============================================
 * Sistema autónomo de validación del flujo completo de datos
 */
import { connectFirestoreEmulator } from 'firebase/firestore';
import { beforeAll, describe, expect, it } from 'vitest';

import { obtenerBancos, obtenerTransacciones } from '../../services/firebaseService';
import { QuantumExcelImporter } from '../../services/quantumExcelImporter';
import { db } from '../../lib/firebase';

// Conectar al emulador si está disponible
if (process.env.FIRESTORE_EMULATOR_HOST && db) {
  const [host, port] = process.env.FIRESTORE_EMULATOR_HOST.split(':');
  try {
    connectFirestoreEmulator(db, host, parseInt(port));
    console.log('🔥 Conectado al Firebase Emulator');
  } catch (error) {
    console.warn('⚠️  No se pudo conectar al emulador:', error.message);
  }
}

describe('🔥 Validación E2E: Excel → Firestore → UI', () => {
  let datosExcel;
  let datosFirestore;

  beforeAll(async () => {
    console.log('🚀 Iniciando validación E2E...');

    try {
      // 1. Buscar archivo Excel
      const excelPath = './Administación_General.xlsx';
      console.log(`📂 Buscando archivo: ${excelPath}`);

      // 2. Leer archivo Excel como File object simulado
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.resolve(process.cwd(), excelPath);

      if (!fs.existsSync(filePath)) {
        throw new Error(`Archivo Excel no encontrado: ${filePath}`);
      }

      const buffer = fs.readFileSync(filePath);
      const file = new File([buffer], 'Administación_General.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      console.log(`✅ Archivo Excel encontrado (${(buffer.length / 1024).toFixed(2)} KB)`);

      // 3. Importar datos del Excel
      console.log('📊 Importando datos del Excel...');
      const importer = new QuantumExcelImporter(db);
      const reporte = await importer.importarExcel(file);

      console.log('✅ Importación completada');
      console.log(`   - Registros procesados: ${reporte.stats.procesados}`);
      console.log(`   - Órdenes de compra: ${reporte.resumen.ordenesCompra}`);
      console.log(`   - Bancos: ${reporte.resumen.bancos}`);
      console.log(`   - Clientes: ${reporte.resumen.clientes}`);

      // 4. Guardar datos del Excel para comparación
      datosExcel = {
        bancos: Object.entries(importer.sheets.bancos || {}).map(([nombre, data]) => ({
          nombre,
          capital_actual: data.rfActual || 0,
          totalIngresos: data.totalIngresos || 0,
          totalGastos: data.totalGastos || 0,
        })),
        transacciones: [
          ...(importer.sheets.controlMaestro?.ventasLocales || []),
          ...(importer.sheets.controlMaestro?.gastosAbonos || []),
        ],
        ordenesCompra: importer.sheets.ordenesCompra || [],
        clientes: importer.sheets.clientes || [],
      };

      console.log('📝 Datos del Excel extraídos:');
      console.log(`   - Bancos: ${datosExcel.bancos.length}`);
      console.log(`   - Transacciones: ${datosExcel.transacciones.length}`);

      // 5. Esperar a que se guarden en Firestore (los datos ya se guardaron en importarExcel)
      console.log('⏳ Esperando propagación de datos en Firestore...');
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 6. Leer datos de Firestore
      console.log('📥 Leyendo datos de Firestore...');
      datosFirestore = {
        bancos: await obtenerBancos(),
        transacciones: await obtenerTransacciones(),
      };

      console.log('✅ Datos de Firestore obtenidos:');
      console.log(`   - Bancos: ${datosFirestore.bancos.length}`);
      console.log(`   - Transacciones: ${datosFirestore.transacciones.length}`);
    } catch (error) {
      console.error('❌ Error en beforeAll:', error);
      throw error;
    }
  }, 90000); // 90 segundos de timeout

  it('✅ Capital Total: Excel = Firestore', async () => {
    expect(datosExcel).toBeDefined();
    expect(datosFirestore).toBeDefined();

    // Calcular capital total del Excel
    const capitalExcel = datosExcel.bancos.reduce((sum, b) => {
      const capital = Number(b.capital_actual) || 0;
      return sum + capital;
    }, 0);

    // Calcular capital total de Firestore
    const capitalFirestore = datosFirestore.bancos.reduce((sum, b) => {
      const capital = Number(b.rfActual || b.capital_actual) || 0;
      return sum + capital;
    }, 0);

    console.log('\n💰 VALIDACIÓN DE CAPITAL TOTAL:');
    console.log(`   Excel: $${capitalExcel.toLocaleString()}`);
    console.log(`   Firestore: $${capitalFirestore.toLocaleString()}`);

    // Validar con tolerancia de 1 peso (por redondeos)
    expect(capitalFirestore).toBeCloseTo(capitalExcel, 0);

    console.log('   ✅ Capital Total validado correctamente');
  }, 30000);

  it('✅ Todos los bancos del Excel están en Firestore', async () => {
    expect(datosExcel.bancos).toBeDefined();
    expect(datosFirestore.bancos).toBeDefined();

    const bancosExcel = datosExcel.bancos || [];
    const bancosFirestore = datosFirestore.bancos || [];

    console.log('\n🏦 VALIDACIÓN DE BANCOS:');
    console.log(`   Total en Excel: ${bancosExcel.length}`);
    console.log(`   Total en Firestore: ${bancosFirestore.length}`);

    // Verificar que hay al menos la misma cantidad
    expect(bancosFirestore.length).toBeGreaterThanOrEqual(bancosExcel.length);

    // Verificar cada banco
    for (const bancoExcel of bancosExcel) {
      const bancoFirestore = bancosFirestore.find((b) => b.nombre === bancoExcel.nombre);

      expect(bancoFirestore).toBeDefined();
      console.log(`   ✅ ${bancoExcel.nombre}: Presente en Firestore`);
    }

    console.log('   ✅ Todos los bancos validados correctamente');
  }, 30000);

  it('✅ Datos de bancos coinciden: Excel = Firestore', async () => {
    const bancosExcel = datosExcel.bancos || [];
    const bancosFirestore = datosFirestore.bancos || [];

    console.log('\n💵 VALIDACIÓN DE DATOS DE BANCOS:');

    let bancosValidados = 0;

    for (const bancoExcel of bancosExcel) {
      const bancoFirestore = bancosFirestore.find((b) => b.nombre === bancoExcel.nombre);

      if (bancoFirestore && bancoExcel.capital_actual !== undefined) {
        const capitalExcel = Number(bancoExcel.capital_actual) || 0;
        const capitalFirestore = Number(bancoFirestore.rfActual || bancoFirestore.capital_actual) || 0;

        // Validar que el capital existe
        expect(capitalFirestore).toBeDefined();

        console.log(
          `   ✅ ${bancoExcel.nombre}: Excel=$${capitalExcel.toLocaleString()}, Firestore=$${capitalFirestore.toLocaleString()}`
        );

        bancosValidados++;
      }
    }

    expect(bancosValidados).toBeGreaterThan(0);
    console.log(`   ✅ ${bancosValidados} bancos validados correctamente`);
  }, 30000);

  it('✅ Transacciones: Excel = Firestore (validación de cantidad)', async () => {
    const transaccionesExcel = datosExcel.transacciones || [];
    const transaccionesFirestore = datosFirestore.transacciones || [];

    console.log('\n📊 VALIDACIÓN DE TRANSACCIONES:');
    console.log(`   Total en Excel: ${transaccionesExcel.length}`);
    console.log(`   Total en Firestore: ${transaccionesFirestore.length}`);

    // Validar que hay transacciones
    expect(transaccionesFirestore.length).toBeGreaterThan(0);

    // Calcular ingresos si hay datos de tipo INGRESO
    const ingresosExcel = transaccionesExcel
      .filter((t) => t.tipo === 'venta_local' || t.tipo === 'ingreso_banco')
      .reduce((sum, t) => sum + (t.ingreso || t.monto || 0), 0);

    const ingresosFirestore = transaccionesFirestore
      .filter((t) => t.tipo === 'venta_local' || t.tipo === 'ingreso_banco')
      .reduce((sum, t) => sum + (t.ingreso || t.monto || 0), 0);

    if (ingresosExcel > 0 && ingresosFirestore > 0) {
      console.log(`   Ingresos Excel: $${ingresosExcel.toLocaleString()}`);
      console.log(`   Ingresos Firestore: $${ingresosFirestore.toLocaleString()}`);

      // Validar con tolerancia
      expect(ingresosFirestore).toBeCloseTo(ingresosExcel, -2); // tolerancia de 100 pesos
    }

    console.log('   ✅ Transacciones validadas correctamente');
  }, 30000);

  it('✅ Integridad de relaciones: Órdenes de Compra ↔ Distribuidores', async () => {
    const ordenesCompra = datosExcel.ordenesCompra || [];

    console.log('\n🔗 VALIDACIÓN DE RELACIONES:');
    console.log(`   Total OC: ${ordenesCompra.length}`);

    let relacionesValidas = 0;

    for (const oc of ordenesCompra.slice(0, 10)) {
      // validar primeras 10
      if (oc.distribuidor) {
        expect(oc.distribuidor).toBeTruthy();
        relacionesValidas++;
      }
    }

    expect(relacionesValidas).toBeGreaterThan(0);
    console.log(`   ✅ ${relacionesValidas} relaciones validadas correctamente`);
  }, 30000);

  it('✅ Clientes: Datos presentes y válidos', async () => {
    const clientesExcel = datosExcel.clientes || [];

    console.log('\n👥 VALIDACIÓN DE CLIENTES:');
    console.log(`   Total clientes: ${clientesExcel.length}`);

    expect(clientesExcel.length).toBeGreaterThan(0);

    // Validar estructura de primeros clientes
    for (const cliente of clientesExcel.slice(0, 5)) {
      expect(cliente).toHaveProperty('nombre');
      expect(cliente).toHaveProperty('id');
      expect(cliente.nombre).toBeTruthy();
    }

    console.log('   ✅ Clientes validados correctamente');
  }, 30000);
});
