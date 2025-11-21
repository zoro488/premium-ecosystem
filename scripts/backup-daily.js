#!/usr/bin/env node
/**
 * Backup diario automático del sistema
 * Crea respaldos de todas las colecciones críticas
 */

import admin from 'firebase-admin';
import chalk from 'chalk';
import ora from 'ora';

// Inicializar Firebase Admin
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  admin.initializeApp({
    projectId: 'premium-ecosystem-1760790572'
  });
}

const db = admin.firestore();

async function realizarBackup() {
  console.log(chalk.cyan.bold('\n💾 BACKUP DIARIO - CHRONOS SYSTEM\n'));
  
  const timestamp = new Date().toISOString();
  const backupId = `backup_${Date.now()}`;
  
  const spinner = ora('Iniciando backup...').start();

  try {
    const coleccionesCriticas = [
      'bancos',
      'bancosRfActual',
      'clientes',
      'ventas',
      'almacen',
      'transaccionesBanco',
      'transaccionesBoveda',
      'transferencias',
      'gya',
      'configuracion',
      'estadoGlobal'
    ];

    const backupData = {
      id: backupId,
      fecha: admin.firestore.FieldValue.serverTimestamp(),
      timestamp,
      colecciones: {},
      stats: {
        totalColecciones: 0,
        totalDocumentos: 0
      }
    };

    for (const coleccion of coleccionesCriticas) {
      spinner.text = `Respaldando ${coleccion}...`;
      
      const snapshot = await db.collection(coleccion).get();
      const docs = [];
      
      snapshot.docs.forEach(doc => {
        docs.push({
          id: doc.id,
          data: doc.data()
        });
      });

      backupData.colecciones[coleccion] = {
        documentos: docs.length,
        ultimaActualizacion: timestamp
      };
      
      backupData.stats.totalColecciones++;
      backupData.stats.totalDocumentos += docs.length;

      // Guardar backup de esta colección
      await db.collection('backups')
        .doc(backupId)
        .collection(coleccion)
        .doc('data')
        .set({ documentos: docs });
    }

    // Guardar metadata del backup
    await db.collection('backups').doc(backupId).set(backupData);

    // Limpiar backups antiguos (mantener solo los últimos 7 días)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);
    
    const oldBackups = await db.collection('backups')
      .where('fecha', '<', admin.firestore.Timestamp.fromDate(cutoffDate))
      .get();

    const batch = db.batch();
    oldBackups.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    spinner.succeed(chalk.green('Backup completado exitosamente'));

    console.log(chalk.cyan.bold('\n📊 RESUMEN DEL BACKUP\n'));
    console.log(chalk.white(`   ID: ${chalk.yellow(backupId)}`));
    console.log(chalk.white(`   Fecha: ${chalk.yellow(timestamp)}`));
    console.log(chalk.white(`   Colecciones: ${chalk.green(backupData.stats.totalColecciones)}`));
    console.log(chalk.white(`   Documentos: ${chalk.green(backupData.stats.totalDocumentos)}`));
    console.log(chalk.white(`   Backups antiguos eliminados: ${chalk.yellow(oldBackups.size)}`));
    console.log(chalk.green.bold('\n✅ Backup almacenado en Firestore > backups\n'));

  } catch (error) {
    spinner.fail(chalk.red('Error en el backup'));
    console.error(chalk.red('Error:'), error.message);
    throw error;
  }
}

// Ejecutar
realizarBackup()
  .then(() => {
    console.log(chalk.cyan('Proceso completado'));
    process.exit(0);
  })
  .catch(error => {
    console.error(chalk.red('Error fatal:'), error);
    process.exit(1);
  });
