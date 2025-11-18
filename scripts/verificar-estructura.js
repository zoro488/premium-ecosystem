#!/usr/bin/env node
/**
 * ============================================
 * VERIFICADOR COMPLETO DE FIRESTORE
 * ============================================
 */
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

let db;

async function initializeFirebase() {
  const projectId = process.env.FIREBASE_PROJECT_ID || 'premium-ecosystem-1760790572';

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: projectId,
  });

  db = admin.firestore();
  console.log(`✓ Conectado a: ${projectId}\n`);
}

async function verificar() {
  console.log('═'.repeat(80));
  console.log('  🔍 VERIFICACIÓN COMPLETA DE FIRESTORE');
  console.log('═'.repeat(80));
  console.log();

  const colecciones = [
    { nombre: 'bancos', camposEsperados: ['id', 'nombre', 'saldo', 'rfActual'] },
    { nombre: 'bancosRfActual', camposEsperados: ['id', 'fecha', 'banco', 'corte'] },
    { nombre: 'gastos', camposEsperados: ['id', 'fecha', 'banco', 'monto', 'tipo'] },
    { nombre: 'clientes', camposEsperados: ['id', 'nombre', 'saldoPendiente'] },
    { nombre: 'distribuidores', camposEsperados: ['id', 'nombre', 'activo'] },
    { nombre: 'ordenesCompra', camposEsperados: ['id', 'fecha', 'origen', 'cantidad'] },
    { nombre: 'ventas', camposEsperados: ['id', 'fecha', 'cliente', 'monto'] },
    { nombre: 'almacenIngresos', camposEsperados: ['id', 'fecha', 'oc', 'distribuidor'] },
    { nombre: 'almacenRfActual', camposEsperados: ['id', 'fecha', 'corte'] },
    { nombre: 'almacenSalidas', camposEsperados: ['id', 'fecha', 'cliente', 'cantidad'] },
    { nombre: 'almacenStockDisponible', camposEsperados: ['id', 'distribuidor', 'disponible'] },
  ];

  let totalDocs = 0;
  const problemas = [];

  for (const col of colecciones) {
    try {
      const countSnapshot = await db.collection(col.nombre).count().get();
      const count = countSnapshot.data().count;
      totalDocs += count;

      if (count === 0) {
        console.log(`⚠️  ${col.nombre.padEnd(25)} - VACÍA`);
        problemas.push({ coleccion: col.nombre, problema: 'Vacía' });
      } else {
        // Verificar estructura
        const sampleDoc = await db.collection(col.nombre).limit(1).get();
        const data = sampleDoc.docs[0].data();
        const camposReales = Object.keys(data);
        const faltantes = col.camposEsperados.filter((c) => !camposReales.includes(c));

        if (faltantes.length > 0) {
          console.log(
            `⚠️  ${col.nombre.padEnd(25)} - ${count} docs (faltan: ${faltantes.join(', ')})`
          );
          problemas.push({
            coleccion: col.nombre,
            problema: `Faltan campos: ${faltantes.join(', ')}`,
          });
        } else {
          console.log(`✅ ${col.nombre.padEnd(25)} - ${count} documentos`);
        }
      }
    } catch (error) {
      console.log(`❌ ${col.nombre.padEnd(25)} - Error: ${error.message}`);
      problemas.push({ coleccion: col.nombre, problema: error.message });
    }
  }

  // Verificar documento especial
  console.log();
  try {
    const almacenDoc = await db.collection('estadoGlobal').doc('almacen').get();
    if (almacenDoc.exists) {
      console.log(`✅ estadoGlobal/almacen     - Documento configurado`);
      totalDocs += 1;
    } else {
      console.log(`⚠️  estadoGlobal/almacen     - No existe`);
      problemas.push({ coleccion: 'estadoGlobal/almacen', problema: 'No existe' });
    }
  } catch (error) {
    console.log(`❌ estadoGlobal/almacen     - Error: ${error.message}`);
  }

  // Verificar relaciones
  console.log();
  console.log('─'.repeat(80));
  console.log('  🔗 VERIFICANDO RELACIONES');
  console.log('─'.repeat(80));
  console.log();

  try {
    const bancosSnapshot = await db.collection('bancos').get();
    let bancosConMovimientos = 0;

    for (const doc of bancosSnapshot.docs) {
      const banco = doc.data();
      const movimientos = await db
        .collection('gastos')
        .where('banco', '==', banco.id)
        .count()
        .get();

      const count = movimientos.data().count;
      if (count > 0) {
        console.log(`✅ ${banco.nombre.padEnd(20)} → ${count} movimientos`);
        bancosConMovimientos++;
      } else {
        console.log(`⚠️  ${banco.nombre.padEnd(20)} → sin movimientos`);
      }
    }

    const rfActualSnapshot = await db.collection('bancosRfActual').get();
    console.log(`\n📊 ${bancosConMovimientos}/${bancosSnapshot.size} bancos con movimientos`);
    console.log(`📊 ${rfActualSnapshot.size} registros de RF Actual`);
  } catch (error) {
    console.log(`❌ Error verificando relaciones: ${error.message}`);
  }

  // Resumen final
  console.log();
  console.log('═'.repeat(80));
  console.log('  📊 RESUMEN');
  console.log('═'.repeat(80));
  console.log();
  console.log(`📈 Total de documentos: ${totalDocs}`);

  if (problemas.length > 0) {
    console.log(`\n⚠️  ${problemas.length} problemas detectados:`);
    problemas.forEach((p) => {
      console.log(`   • ${p.coleccion}: ${p.problema}`);
    });
  } else {
    console.log('\n🎉 ¡TODO PERFECTO! Estructura completa y correcta');
  }

  console.log();
}

async function main() {
  try {
    await initializeFirebase();
    await verificar();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fatal:', error.message);
    process.exit(1);
  }
}

main();
