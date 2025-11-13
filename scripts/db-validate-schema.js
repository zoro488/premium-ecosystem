#!/usr/bin/env node
/**
 * Database Schema Validation
 * Valida el esquema y estructura de Firestore
 */
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const SCHEMA_DEFINITIONS = {
  users: {
    required: ['email', 'role', 'createdAt'],
    optional: ['displayName', 'photoURL', 'lastLogin'],
  },
  clientes: {
    required: ['nombre', 'tipo'],
    optional: ['email', 'telefono', 'direccion', 'rfc'],
  },
  proveedores: {
    required: ['nombre', 'categoria'],
    optional: ['contacto', 'email', 'telefono'],
  },
  bancos: {
    required: ['nombre', 'tipo', 'saldo'],
    optional: ['numeroCuenta', 'banco'],
  },
};

async function validateCollectionSchema(collectionName, schema) {
  const results = {
    collection: collectionName,
    valid: true,
    totalDocs: 0,
    violations: [],
    fieldStats: {},
  };

  try {
    const snapshot = await db.collection(collectionName).limit(100).get();
    results.totalDocs = snapshot.size;

    if (snapshot.empty) {
      results.violations.push({ type: 'empty_collection' });
      return results;
    }

    // Analizar documentos
    snapshot.forEach((doc) => {
      const data = doc.data();

      // Verificar campos requeridos
      for (const field of schema.required) {
        if (!(field in data)) {
          results.valid = false;
          results.violations.push({
            docId: doc.id,
            type: 'missing_required',
            field,
          });
        }
      }

      // Estadísticas de campos
      for (const field of Object.keys(data)) {
        if (!results.fieldStats[field]) {
          results.fieldStats[field] = { count: 0, types: new Set() };
        }
        results.fieldStats[field].count++;
        results.fieldStats[field].types.add(typeof data[field]);
      }
    });

    // Convertir Sets a Arrays
    for (const field in results.fieldStats) {
      results.fieldStats[field].types = Array.from(results.fieldStats[field].types);
    }
  } catch (error) {
    results.valid = false;
    results.error = error.message;
  }

  return results;
}

async function validateDatabaseSchema() {
  console.log('🔍 Iniciando validación de esquema de base de datos...\n');

  const results = {
    timestamp: new Date().toISOString(),
    collections: {},
    summary: {
      total: 0,
      valid: 0,
      invalid: 0,
    },
  };

  for (const [collectionName, schema] of Object.entries(SCHEMA_DEFINITIONS)) {
    console.log(`📋 Validando colección: ${collectionName}`);

    const result = await validateCollectionSchema(collectionName, schema);
    results.collections[collectionName] = result;
    results.summary.total++;

    if (result.valid) {
      results.summary.valid++;
      console.log(`  ✅ Válida (${result.totalDocs} docs)`);
    } else {
      results.summary.invalid++;
      console.log(`  ❌ Inválida (${result.violations.length} violaciones)`);
      result.violations.slice(0, 3).forEach((v) => {
        console.log(`    - ${v.type}: ${v.field || v.docId}`);
      });
    }
  }

  console.log('\n═══════════════════════════════════════');
  console.log('📊 RESUMEN DE VALIDACIÓN');
  console.log('═══════════════════════════════════════');
  console.log(`Total: ${results.summary.total}`);
  console.log(`✅ Válidas: ${results.summary.valid}`);
  console.log(`❌ Inválidas: ${results.summary.invalid}`);

  console.log('\n--- SCHEMA VALIDATION RESULTS ---');
  console.log(JSON.stringify(results, null, 2));

  process.exit(results.summary.invalid > 0 ? 1 : 0);
}

validateDatabaseSchema();
