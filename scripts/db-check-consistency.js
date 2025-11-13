#!/usr/bin/env node

/**
 * Database Consistency Check
 * Verifica la consistencia de los datos en Firestore
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Verificación de Consistencia de Datos\n');

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

  const issues = {
    missingFields: [],
    invalidTypes: [],
    outOfRange: [],
  };

  let totalIssues = 0;

  // Verificar clientes
  console.log('🔍 Verificando clientes...');
  const clientesSnapshot = await db.collection('clientes').limit(50).get();

  clientesSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    const required = ['nombre', 'email', 'telefono'];

    required.forEach((field) => {
      if (!data[field]) {
        issues.missingFields.push({
          collection: 'clientes',
          docId: doc.id,
          field,
        });
        totalIssues++;
      }
    });
  });

  console.log(
    `   ${issues.missingFields.length > 0 ? '⚠️' : '✅'} Clientes verificados`
  );

  // Verificar ventas
  console.log('🔍 Verificando ventas...');
  const ventasSnapshot = await db.collection('ventas').limit(50).get();

  ventasSnapshot.docs.forEach((doc) => {
    const data = doc.data();

    if (data.total && typeof data.total !== 'number') {
      issues.invalidTypes.push({
        collection: 'ventas',
        docId: doc.id,
        field: 'total',
        type: typeof data.total,
      });
      totalIssues++;
    }

    if (data.total && data.total < 0) {
      issues.outOfRange.push({
        collection: 'ventas',
        docId: doc.id,
        field: 'total',
        value: data.total,
        reason: 'Valor negativo',
      });
      totalIssues++;
    }
  });

  console.log(
    `   ${issues.invalidTypes.length > 0 ? '⚠️' : '✅'} Ventas verificadas`
  );

  // Verificar bancos
  console.log('🔍 Verificando bancos...');
  const bancosSnapshot = await db.collection('bancos').limit(50).get();

  bancosSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    const required = ['nombre', 'saldo'];

    required.forEach((field) => {
      if (data[field] === undefined) {
        issues.missingFields.push({
          collection: 'bancos',
          docId: doc.id,
          field,
        });
        totalIssues++;
      }
    });
  });

  console.log(
    `   ${issues.missingFields.length > 3 ? '⚠️' : '✅'} Bancos verificados`
  );

  console.log('\n' + '='.repeat(50));
  console.log('📊 Resumen de Inconsistencias:');
  console.log(`   • Campos faltantes: ${issues.missingFields.length}`);
  console.log(`   • Tipos inválidos: ${issues.invalidTypes.length}`);
  console.log(`   • Valores fuera de rango: ${issues.outOfRange.length}`);
  console.log(`   • Total: ${totalIssues}`);
  console.log('='.repeat(50));

  if (totalIssues > 0) {
    console.log('\n⚠️  Se encontraron inconsistencias');
    console.log('💡 Revisa los detalles en consistency-report.json');

    // Guardar reporte
    const outputPath = join(__dirname, '..', 'consistency-report.json');
    await import('fs/promises').then((fs) =>
      fs.writeFile(
        outputPath,
        JSON.stringify(
          {
            timestamp: new Date().toISOString(),
            totalIssues,
            issues,
          },
          null,
          2
        )
      )
    );
  } else {
    console.log('\n✅ No se encontraron inconsistencias');
  }

  process.exit(0);
} catch (error) {
  console.error('\n❌ Error al verificar consistencia:', error.message);
  process.exit(1);
}
