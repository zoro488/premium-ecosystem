#!/usr/bin/env node
/**
 * 🔐 CARGA DEFINITIVA SEGURO (Firebase Admin SDK)
 * - Usa la Admin SDK para escribir directamente en Firestore (no requiere cambiar reglas)
 * - Requiere: exportar la variable de entorno GOOGLE_APPLICATION_CREDENTIALS
 *   que apunte al JSON de la cuenta de servicio con permisos Firestore (or provide path via SERVICE_ACCOUNT_PATH)
 * - Opciones:
 *   - FORCE=1  -> limpiará/elimnará docs existentes en las colecciones antes de subir (imitando el script anterior)
 *   - DRY_RUN=1 -> no escribirá nada; mostrará conteos y acciones previstas
 *
 * Uso (ejemplo):
 *   $ env:GOOGLE_APPLICATION_CREDENTIALS='C:\path\sa.json'; $env:FORCE='1'; node scripts/cargar-datos-definitivo-admin.js
 */
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SERVICE_ACCOUNT_PATH =
  process.env.SERVICE_ACCOUNT_PATH ||
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  join(__dirname, '..', 'serviceAccountKey.json');
const FORCE = process.env.FORCE === '1';
const DRY_RUN = process.env.DRY_RUN === '1';

if (!SERVICE_ACCOUNT_PATH) {
  console.error(
    '❌ No se encontró SERVICE_ACCOUNT_PATH ni GOOGLE_APPLICATION_CREDENTIALS. Debes proveer la ruta al JSON de la cuenta de servicio.'
  );
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));
} catch (err) {
  console.error('❌ Error leyendo la cuenta de servicio desde:', SERVICE_ACCOUNT_PATH);
  console.error(err.message);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const dataPath = join(__dirname, '../datos_excel_completos.json');
let excelData;
try {
  excelData = JSON.parse(readFileSync(dataPath, 'utf8'));
} catch (err) {
  console.error('❌ No se pudo leer datos_excel_completos.json en la raíz del proyecto');
  console.error(err.message);
  process.exit(1);
}

console.log('\n🔐 CARGA DEFINITIVA (Admin SDK)');
console.log('Archivo:', dataPath);
console.log(`DRY_RUN=${DRY_RUN}  FORCE=${FORCE}`);
console.log('='.repeat(60));

async function limpiarColeccion(nombre) {
  console.log(`🧹 Limpiando colección ${nombre}...`);
  const snapshot = await db.collection(nombre).get();
  if (snapshot.empty) {
    console.log('   (vacía)');
    return 0;
  }
  let deleted = 0;
  while (!snapshot.empty) {
    const batch = db.batch();
    snapshot.docs.slice(0, 500).forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    deleted += snapshot.size;
    // intentar leer de nuevo
    const next = await db.collection(nombre).get();
    if (next.empty) break;
  }
  return deleted;
}

async function subirBatch(coleccion, docs, transform = null) {
  if (!docs || docs.length === 0) return 0;
  console.log(`📤 Preparando ${docs.length} docs -> ${coleccion}`);
  if (DRY_RUN) return docs.length;

  const BATCH_SIZE = 500;
  let count = 0;
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const chunk = docs.slice(i, i + BATCH_SIZE);
    chunk.forEach((item) => {
      const data = transform ? transform(item) : item;
      const id = data.id || `${coleccion}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const { id: _, ...dataWithoutId } = data;
      const docRef = db.collection(coleccion).doc(id);
      batch.set(docRef, dataWithoutId);
      count++;
    });
    await batch.commit();
    console.log(`   ⏳ ${count}/${docs.length}`);
  }
  return count;
}

async function main() {
  try {
    // resumen
    console.log(`Ventas: ${excelData.ventas?.length || 0}`);
    console.log(`Clientes: ${excelData.clientes?.length || 0}`);
    console.log(`Distribuidores: ${excelData.distribuidores?.length || 0}`);
    console.log(`Ordenes: ${excelData.ordenesCompra?.length || 0}`);
    console.log('='.repeat(60));

    if (FORCE && !DRY_RUN) {
      const colsToClear = [
        'ventas',
        'clientes',
        'distribuidores',
        'ordenesCompra',
        'bancos',
        'almacen',
      ];
      for (const c of colsToClear) {
        const deleted = await limpiarColeccion(c);
        console.log(`   ✅ ${c}: ${deleted} eliminados (FORCE)`);
      }
    } else if (FORCE && DRY_RUN) {
      console.log('DRY_RUN: se habría limpiado las colecciones si FORCE=1 y no DRY_RUN');
    }

    // subir colecciones principales (transformaciones similares al script ESM)
    await subirBatch('ventas', excelData.ventas || [], (venta) => ({
      id: venta.id,
      fecha: venta.fecha,
      cliente: venta.cliente,
      cantidad: venta.cantidad || 0,
      costoUnidad: venta.costoUnidad || venta.costoBovedaMonte || 0,
      precioVenta: venta.precioVenta || 0,
      totalVenta: venta.ingreso || venta.totalVenta || 0,
      totalFletes: venta.totalFletes || 0,
      aplicaFlete: venta.fleteAplica === 'Aplica' || !!venta.aplicaFlete,
      utilidadNeta: venta.utilidad || venta.utilidadNeta || 0,
      estatus: venta.estatus || 'Pendiente',
      ocRelacionada: venta.oc || venta.ocRelacionada || '',
      distribucionBancos: venta.distribucionBancos || {},
      metadata: { origen: 'excel', cargadoEn: new Date().toISOString() },
    }));

    await subirBatch('clientes', excelData.clientes || [], (cliente) => ({
      id: cliente.id || `cliente_${cliente.nombre}`,
      nombre: cliente.nombre,
      adeudo: cliente.adeudo || 0,
      totalCompras: cliente.totalCompras || 0,
      metadata: { origen: 'excel', cargadoEn: new Date().toISOString() },
    }));

    await subirBatch('distribuidores', excelData.distribuidores || [], (dist) => ({
      id: dist.id || `dist_${dist.nombre}`,
      nombre: dist.nombre,
      adeudo: dist.adeudo || 0,
      metadata: { origen: 'excel', cargadoEn: new Date().toISOString() },
    }));

    if (excelData.ordenesCompra && excelData.ordenesCompra.length > 0) {
      await subirBatch('ordenesCompra', excelData.ordenesCompra, (oc) => ({
        id: oc.id,
        fecha: oc.fecha,
        distribuidor: oc.distribuidor,
        cantidad: oc.cantidad || 0,
        costoUnitario: oc.costoUnitario || oc.costoBovedaMonte || 0,
        costoTotal: oc.costoTotal || 0,
        estatus: oc.estatus || 'Pendiente',
        metadata: { origen: 'excel', cargadoEn: new Date().toISOString() },
      }));
    }

    // bancos
    const bancos = Object.entries(excelData.bancos || {});
    for (const [id, banco] of bancos) {
      if (DRY_RUN) {
        console.log(
          `DRY_RUN: banco ${id} -> saldo ${banco.saldoActual || banco.capitalActual || 0}`
        );
        continue;
      }
      await db
        .collection('bancos')
        .doc(id)
        .set({
          nombre: banco.nombre || id,
          capitalActual: banco.saldoActual || banco.capitalActual || 0,
          tipo: 'banco',
          ingresos: (banco.ingresos || []).map((ing) => ({
            fecha: ing.fecha,
            cliente: ing.cliente || '',
            concepto: ing.concepto || '',
            monto: ing.ingreso || 0,
          })),
          gastos: (banco.gastos || []).map((g) => ({
            fecha: g.fecha,
            concepto: g.concepto || '',
            monto: g.gasto || 0,
          })),
          metadata: { origen: 'excel', actualizadoEn: new Date().toISOString() },
        });
      console.log(`   ✅ banco ${id} escrito`);
    }

    // almacen
    if (!DRY_RUN) {
      const almacen = excelData.almacen || {};
      await db
        .collection('almacen')
        .doc('almacen-monte')
        .set({
          nombre: 'Almacén Monte',
          stockActual: almacen.stockActual || 0,
          entradas: (almacen.entradas || []).map((e) => ({
            fecha: e.fecha,
            cantidad: e.cantidad || 0,
            origen: e.origen || '',
            concepto: e.concepto || '',
          })),
          salidas: (almacen.salidas || []).map((s) => ({
            fecha: s.fecha,
            cantidad: s.cantidad || 0,
            destino: s.destino || '',
            concepto: s.concepto || '',
          })),
          metadata: { origen: 'excel', actualizadoEn: new Date().toISOString() },
        });
      console.log('   ✅ almacen escrito');
    } else {
      console.log('DRY_RUN: no se escribió almacen');
    }

    console.log('\n🎉 Operación finalizada');
    if (DRY_RUN)
      console.log(
        'DRY_RUN=1 -> no se escribieron datos; revisa el reporte anterior para validar acciones esperadas'
      );
    process.exit(0);
  } catch (err) {
    console.error('❌ ERROR en carga admin:', err);
    process.exit(1);
  }
}

main();
