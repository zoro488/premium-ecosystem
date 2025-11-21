#!/usr/bin/env node
/**
 * Check for Orphaned Documents
 * Detecta documentos huérfanos (sin referencias válidas)
 */
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';





const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Verificación de Documentos Huérfanos\n');

try {
  // Inicializar Firebase Admin
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(
      readFileSync(
        join(__dirname, '..', 'serviceAccountKey.json'),
        'utf8'
      )
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  const db = admin.firestore();

  console.log('📊 Analizando relaciones...\n');

  const orphans = {
    ventas: [],
    compras: [],
    transferencias: [],
  };

  let totalOrphans = 0;

  // Verificar ventas sin cliente
  console.log('🔍 Verificando ventas...');
  const ventasSnapshot = await db.collection('ventas').limit(100).get();
  const clientesSnapshot = await db.collection('clientes').get();
  const clienteIds = new Set(clientesSnapshot.docs.map((doc) => doc.id));

  ventasSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    if (data.clienteId && !clienteIds.has(data.clienteId)) {
      orphans.ventas.push({
        id: doc.id,
        clienteId: data.clienteId,
        reason: 'Cliente no existe',
      });
      totalOrphans++;
    }
  });

  console.log(
    `   ${orphans.ventas.length > 0 ? '⚠️' : '✅'} Ventas: ${orphans.ventas.length} huérfanas`
  );

  // Verificar compras sin proveedor
  console.log('🔍 Verificando compras...');
  const comprasSnapshot = await db.collection('compras').limit(100).get();
  const proveedoresSnapshot = await db.collection('proveedores').get();
  const proveedorIds = new Set(proveedoresSnapshot.docs.map((doc) => doc.id));

  comprasSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    if (data.proveedorId && !proveedorIds.has(data.proveedorId)) {
      orphans.compras.push({
        id: doc.id,
        proveedorId: data.proveedorId,
        reason: 'Proveedor no existe',
      });
      totalOrphans++;
    }
  });

  console.log(
    `   ${orphans.compras.length > 0 ? '⚠️' : '✅'} Compras: ${orphans.compras.length} huérfanas`
  );

  // Verificar transferencias sin banco
  console.log('🔍 Verificando transferencias...');
  const transferenciasSnapshot = await db
    .collection('transferencias')
    .limit(100)
    .get();
  const bancosSnapshot = await db.collection('bancos').get();
  const bancoIds = new Set(bancosSnapshot.docs.map((doc) => doc.id));

  transferenciasSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    if (
      (data.bancoOrigenId && !bancoIds.has(data.bancoOrigenId)) ||
      (data.bancoDestinoId && !bancoIds.has(data.bancoDestinoId))
    ) {
      orphans.transferencias.push({
        id: doc.id,
        bancoOrigenId: data.bancoOrigenId,
        bancoDestinoId: data.bancoDestinoId,
        reason: 'Banco no existe',
      });
      totalOrphans++;
    }
  });

  console.log(
    `   ${orphans.transferencias.length > 0 ? '⚠️' : '✅'} Transferencias: ${orphans.transferencias.length} huérfanas`
  );

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Total documentos huérfanos: ${totalOrphans}`);
  console.log('='.repeat(50));

  if (totalOrphans > 0) {
    console.log('\n⚠️  Se encontraron documentos huérfanos');
    console.log('💡 Revisa los detalles en orphans-report.json');

    // Guardar reporte
    const outputPath = join(__dirname, '..', 'orphans-report.json');
    await import('fs/promises').then((fs) =>
      fs.writeFile(
        outputPath,
        JSON.stringify(
          {
            timestamp: new Date().toISOString(),
            totalOrphans,
            orphans,
          },
          null,
          2
        )
      )
    );

    process.exit(1);
  }

  console.log('\n✅ No se encontraron documentos huérfanos');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Error al verificar huérfanos:', error.message);
  process.exit(1);
}
