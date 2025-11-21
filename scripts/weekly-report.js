#!/usr/bin/env node
/**
 * Reporte semanal automático del sistema
 * Genera estadísticas y métricas de la semana
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

async function generarReporteSemanal() {
  console.log(chalk.cyan.bold('\n📊 REPORTE SEMANAL - CHRONOS SYSTEM\n'));
  
  const spinner = ora('Generando reporte...').start();

  try {
    const ahora = new Date();
    const haceUnaSemana = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Obtener datos de la semana
    const ventasSemana = await db.collection('ventas')
      .where('fecha', '>=', admin.firestore.Timestamp.fromDate(haceUnaSemana))
      .get();

    const transaccionesSemana = await db.collection('transaccionesBanco')
      .where('fecha', '>=', admin.firestore.Timestamp.fromDate(haceUnaSemana))
      .get();

    // Calcular métricas
    let totalVentas = 0;
    let montoVentas = 0;
    ventasSemana.docs.forEach(doc => {
      totalVentas++;
      const data = doc.data();
      montoVentas += data.monto || 0;
    });

    let totalTransacciones = 0;
    let montoTransacciones = 0;
    transaccionesSemana.docs.forEach(doc => {
      totalTransacciones++;
      const data = doc.data();
      montoTransacciones += Math.abs(data.monto || 0);
    });

    // Obtener estado global
    const bancosSnapshot = await db.collection('bancos').get();
    let capitalTotal = 0;
    bancosSnapshot.docs.forEach(doc => {
      const data = doc.data();
      capitalTotal += data.saldo || 0;
    });

    const clientesSnapshot = await db.collection('clientes').get();
    let adeudoTotal = 0;
    clientesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      adeudoTotal += data.adeudo || 0;
    });

    // Crear reporte
    const reporte = {
      tipo: 'semanal',
      fecha: admin.firestore.FieldValue.serverTimestamp(),
      periodo: {
        inicio: haceUnaSemana.toISOString(),
        fin: ahora.toISOString()
      },
      metricas: {
        ventas: {
          total: totalVentas,
          monto: montoVentas,
          promedioPorVenta: totalVentas > 0 ? montoVentas / totalVentas : 0
        },
        transacciones: {
          total: totalTransacciones,
          monto: montoTransacciones,
          promedioPorTransaccion: totalTransacciones > 0 ? montoTransacciones / totalTransacciones : 0
        },
        financiero: {
          capitalTotal,
          adeudoTotal,
          liquidez: capitalTotal - adeudoTotal,
          ratioLiquidez: adeudoTotal > 0 ? (capitalTotal / adeudoTotal).toFixed(2) : 'N/A'
        },
        sistema: {
          bancos: bancosSnapshot.size,
          clientes: clientesSnapshot.size
        }
      }
    };

    // Guardar reporte
    await db.collection('reportes').add(reporte);

    spinner.succeed(chalk.green('Reporte generado exitosamente'));

    console.log(chalk.cyan.bold('\n📈 MÉTRICAS DE LA SEMANA\n'));
    console.log(chalk.white('   VENTAS:'));
    console.log(chalk.white(`     • Total: ${chalk.green(totalVentas)} ventas`));
    console.log(chalk.white(`     • Monto: ${chalk.green('$' + montoVentas.toLocaleString())}`));
    console.log(chalk.white(`     • Promedio: ${chalk.green('$' + (montoVentas / totalVentas || 0).toFixed(2))}`));
    
    console.log(chalk.white('\n   TRANSACCIONES:'));
    console.log(chalk.white(`     • Total: ${chalk.green(totalTransacciones)} movimientos`));
    console.log(chalk.white(`     • Monto: ${chalk.green('$' + montoTransacciones.toLocaleString())}`));
    
    console.log(chalk.white('\n   FINANCIERO:'));
    console.log(chalk.white(`     • Capital: ${chalk.green('$' + capitalTotal.toLocaleString())}`));
    console.log(chalk.white(`     • Adeudos: ${chalk.yellow('$' + adeudoTotal.toLocaleString())}`));
    console.log(chalk.white(`     • Liquidez: ${chalk.green('$' + (capitalTotal - adeudoTotal).toLocaleString())}`));
    
    console.log(chalk.green.bold('\n✅ Reporte guardado en Firestore > reportes\n'));

  } catch (error) {
    spinner.fail(chalk.red('Error generando reporte'));
    console.error(chalk.red('Error:'), error.message);
    throw error;
  }
}

// Ejecutar
generarReporteSemanal()
  .then(() => {
    console.log(chalk.cyan('Proceso completado'));
    process.exit(0);
  })
  .catch(error => {
    console.error(chalk.red('Error fatal:'), error);
    process.exit(1);
  });
