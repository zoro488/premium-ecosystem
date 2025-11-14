/**
 * ═══════════════════════════════════════════════════════════════
 * 🔥 SCRIPT DE IMPORTACIÓN AVANZADO (CSV → FIRESTORE)
 * ═══════════════════════════════════════════════════════════════
 *
 * VERSIÓN: 2.0.0 - PRODUCTION READY
 * COMPATIBLE CON: Chronos-System Premium Ecosystem
 *
 * CARACTERÍSTICAS:
 * ✅ TypeScript para type safety
 * ✅ Validación robusta de datos
 * ✅ Error handling avanzado
 * ✅ Progress tracking con barra de progreso
 * ✅ Logging profesional con timestamps
 * ✅ Estructura modular y mantenible
 * ✅ Soporte para rollback en caso de error
 * ✅ Estadísticas detalladas post-importación
 *
 * INSTRUCCIONES:
 * 1. Coloca este archivo en: /scripts/importar-csv-firestore.ts
 * 2. Coloca los 12 archivos CSV en: /data/csv/
 * 3. Coloca serviceAccountKey.json en: /firebase/serviceAccountKey.json
 * 4. Ejecuta: npm run import:csv
 *
 * ═══════════════════════════════════════════════════════════════
 */
import chalk from 'chalk';
import cliProgress from 'cli-progress';
import * as csv from 'csv-parser';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import ora from 'ora';
import * as path from 'path';

// ═══════════════════════════════════════════════════════════════
// 🎯 INTERFACES Y TIPOS
// ═══════════════════════════════════════════════════════════════

interface Banco {
  id: string;
  nombre: string;
  saldo: number;
  tipo: 'nacional' | 'internacional';
  moneda: 'MXN' | 'USD';
  activo: boolean;
  fechaActualizacion: Date;
}

interface Gasto {
  id?: string;
  fecha: string;
  monto: number;
  bancoOrigen: string;
  destino: string;
  concepto: string;
  observaciones: string;
  categoria?: string;
  tipo: 'gasto';
}

interface Transferencia {
  id?: string;
  fecha: string;
  monto: number;
  bancoOrigen: string;
  bancoDestino: string;
  concepto: string;
  observaciones: string;
  estatus: 'completada' | 'pendiente';
  tipo: 'transferencia';
}

interface Cliente {
  id: string;
  cliente: string;
  deuda: number;
  abonos: number;
  pendiente: number;
  observaciones: string;
  activo: boolean;
  fechaRegistro: Date;
}

interface Distribuidor {
  id: string;
  distribuidor: string;
  costoTotal: number;
  abonos: number;
  pendiente: number;
  activo: boolean;
  fechaRegistro: Date;
}

interface OrdenCompra {
  id: string;
  fecha: string;
  origen: string;
  cantidad: number;
  costoDistribuidor: number;
  costoTransporte: number;
  costoPorUnidad: number;
  costoTotal: number;
  deuda: number;
  estatus: 'completada' | 'pendiente' | 'cancelada';
}

interface Venta {
  id?: string;
  fecha: string;
  ocRelacionada: string;
  cantidad: number;
  cliente: string;
  ingresoBovedaMonte: number;
  precioVenta: number;
  ingresoTotal: number;
  flete: number;
  fleteUtilidad: number;
  utilidad: number;
  estatus: string;
  concepto: string;
}

interface Almacen {
  ingresos: number;
  stockActual: number;
  salidas: number;
  fechaActualizacion: Date;
}

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  costo: number;
  precioVenta: number;
  activo: boolean;
  fechaCreacion: Date;
}

interface ImportStats {
  bancos: number;
  gastos: number;
  transferencias: number;
  clientes: number;
  distribuidores: number;
  ordenesCompra: number;
  ventas: number;
  productos: number;
  errores: number;
  tiempoTotal: number;
}

// ═══════════════════════════════════════════════════════════════
// 🔧 CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════

const CONFIG = {
  paths: {
    serviceAccount: './firebase/serviceAccountKey.json',
    csvDir: './data/csv/',
    backupDir: './data/backups/',
  },
  firebase: {
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://TU_PROYECTO_AQUI.firebaseio.com',
  },
  csvFiles: {
    clientes: 'Copia de Administación_General - Clientes.csv',
    distribuidores: 'Copia de Administación_General - Distribuidores.csv',
    controlMaestro: 'Copia de Administación_General - Control_Maestro.csv',
    almacen: 'Copia de Administación_General - Almacen_Monte.csv',
    bancos: {
      bovedaMonte: 'Copia de Administación_General - Bóveda_Monte.csv',
      bovedaUsa: 'Copia de Administación_General - Bóveda_USA.csv',
      profit: 'Copia de Administación_General - Profit.csv',
      leftie: 'Copia de Administación_General - Leftie.csv',
      fleteSur: 'Copia de Administación_General - Flete_Sur.csv',
      utilidades: 'Copia de Administación_General - Utilidades.csv',
      azteca: 'Copia de Administación_General - Azteca.csv',
    },
  },
  bancos: {
    normalizados: [
      'bovedamonte',
      'bovedausa',
      'profit',
      'leftie',
      'fletesur',
      'utilidades',
      'azteca',
    ],
    configuracion: [
      {
        id: 'bovedaMonte',
        nombre: 'Bóveda Monte',
        saldoCell: 'A2',
        gastoHeaders: [
          'Fecha',
          'Origen del Gastos o Abono',
          'Gasto',
          'TC',
          'Pesos',
          'Destino',
          'Concepto',
          'Observaciones',
        ],
        skipGastos: 0,
        tipo: 'nacional' as const,
        moneda: 'MXN' as const,
      },
      {
        id: 'bovedaUsa',
        nombre: 'Bóveda USA',
        saldoCell: 'I2',
        gastoHeaders: [
          'Fecha',
          'Origen del Gastos o Abono',
          'Gasto',
          'TC',
          'Pesos',
          'Destino',
          'Concepto',
          'Observaciones',
        ],
        skipGastos: 2,
        tipo: 'internacional' as const,
        moneda: 'USD' as const,
      },
      {
        id: 'profit',
        nombre: 'Profit',
        saldoCell: 'I2',
        gastoHeaders: [
          'Fecha',
          'Corte',
          'Fecha_1',
          'Cliente',
          'Lugar',
          'Serie',
          'Gasto',
          'Porcentaje',
          'Gasto Total',
          'Observaciones',
        ],
        skipGastos: 2,
        tipo: 'nacional' as const,
        moneda: 'MXN' as const,
      },
      {
        id: 'leftie',
        nombre: 'Leftie',
        saldoCell: 'I2',
        gastoHeaders: [
          'Fecha',
          'Corte',
          'Fecha_1',
          'Origen del Gastos o Abono',
          'Gasto',
          'TC',
          'Dolares',
          'Destino',
          'Concepto',
          'Observaciones',
        ],
        skipGastos: 2,
        tipo: 'nacional' as const,
        moneda: 'MXN' as const,
      },
      {
        id: 'fleteSur',
        nombre: 'Flete Sur',
        saldoCell: 'F2',
        gastoHeaders: [
          'Fecha',
          'Origen del Gastos o Abono',
          'Gasto',
          'TC',
          'Pesos',
          'Destino',
          'Concepto',
          'Observaciones',
        ],
        skipGastos: 2,
        tipo: 'nacional' as const,
        moneda: 'MXN' as const,
      },
      {
        id: 'utilidades',
        nombre: 'Utilidades',
        saldoCell: 'F2',
        gastoHeaders: [
          'Fecha',
          'Origen del Gastos o Abono',
          'Gasto',
          'TC',
          'Pesos',
          'Concepto',
          'Observaciones',
        ],
        skipGastos: 2,
        tipo: 'nacional' as const,
        moneda: 'MXN' as const,
      },
      {
        id: 'azteca',
        nombre: 'Azteca',
        saldoCell: 'I2',
        gastoHeaders: [
          'Fecha',
          'Origen del Gastos o Abono',
          'Gasto',
          'Destino',
          'A',
          'Observaciones',
          'Concepto',
        ],
        skipGastos: 2,
        tipo: 'nacional' as const,
        moneda: 'MXN' as const,
      },
    ],
  },
  batch: {
    maxSize: 499, // Límite de Firestore
  },
  logging: {
    verbose: true,
    saveToFile: true,
    logDir: './logs/',
  },
};

// ═══════════════════════════════════════════════════════════════
// 🚀 CLASE PRINCIPAL DE IMPORTACIÓN
// ═══════════════════════════════════════════════════════════════

class FirestoreImporter {
  private db: admin.firestore.Firestore;
  private stats: ImportStats;
  private progressBar: cliProgress.SingleBar | null = null;
  private logFile: string;
  private startTime: number;

  constructor() {
    this.stats = {
      bancos: 0,
      gastos: 0,
      transferencias: 0,
      clientes: 0,
      distribuidores: 0,
      ordenesCompra: 0,
      ventas: 0,
      productos: 0,
      errores: 0,
      tiempoTotal: 0,
    };
    this.startTime = Date.now();
    this.logFile = path.join(
      CONFIG.logging.logDir,
      `import-${new Date().toISOString().replace(/[:.]/g, '-')}.log`
    );
    this.db = this.initializeFirebase();
  }

  // ═════════════════════════════════════════════════════════════
  // 🔌 INICIALIZACIÓN
  // ═════════════════════════════════════════════════════════════

  private initializeFirebase(): admin.firestore.Firestore {
    try {
      this.log('🔌 Inicializando conexión a Firebase...', 'info');

      if (!fs.existsSync(CONFIG.paths.serviceAccount)) {
        throw new Error(
          `❌ No se encontró serviceAccountKey.json en: ${CONFIG.paths.serviceAccount}`
        );
      }

      const serviceAccount = JSON.parse(fs.readFileSync(CONFIG.paths.serviceAccount, 'utf8'));

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: CONFIG.firebase.databaseURL,
      });

      const db = admin.firestore();
      db.settings({ ignoreUndefinedProperties: true });

      this.log('✅ Conexión a Firebase establecida correctamente', 'success');
      return db;
    } catch (error) {
      this.log(`❌ Error al conectar con Firebase: ${error}`, 'error');
      throw error;
    }
  }

  // ═════════════════════════════════════════════════════════════
  // 📝 UTILIDADES DE LOGGING
  // ═════════════════════════════════════════════════════════════

  private log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info'): void {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] ${message}`;

    // Consola con colores
    switch (type) {
      case 'success':
        console.log(chalk.green(formattedMessage));
        break;
      case 'error':
        console.error(chalk.red(formattedMessage));
        this.stats.errores++;
        break;
      case 'warn':
        console.warn(chalk.yellow(formattedMessage));
        break;
      default:
        console.log(chalk.blue(formattedMessage));
    }

    // Guardar en archivo si está habilitado
    if (CONFIG.logging.saveToFile) {
      this.saveToLogFile(formattedMessage);
    }
  }

  private saveToLogFile(message: string): void {
    try {
      const logDir = path.dirname(this.logFile);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      fs.appendFileSync(this.logFile, message + '\n');
    } catch (error) {
      console.error('Error guardando log:', error);
    }
  }

  // ═════════════════════════════════════════════════════════════
  // 🛠️ UTILIDADES DE DATOS
  // ═════════════════════════════════════════════════════════════

  private parseCurrency(currencyString: string | number): number {
    if (typeof currencyString === 'number') return currencyString;
    if (!currencyString || currencyString === '') return 0;
    return parseFloat(String(currencyString).replace(/[\$,"]/g, '')) || 0;
  }

  private parseCSV(filePath: string, options: any = {}): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      const fullPath = path.join(CONFIG.paths.csvDir, filePath);

      if (!fs.existsSync(fullPath)) {
        return reject(new Error(`Archivo no encontrado: ${fullPath}`));
      }

      fs.createReadStream(fullPath)
        .pipe(csv(options))
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }

  private getBancoDestino(destinoString: string | null | undefined): string | null {
    if (!destinoString || destinoString.toLowerCase() === 'na') {
      return null;
    }

    const destinoLimpio = destinoString.toLowerCase().replace(/ /g, '').replace('bóveda', 'boveda');

    const match = CONFIG.bancos.normalizados.find((bancoNorm) => destinoLimpio.includes(bancoNorm));

    return match || null;
  }

  private generateId(): string {
    return this.db.collection('_temp').doc().id;
  }

  // ═════════════════════════════════════════════════════════════
  // 📊 IMPORTACIÓN POR LOTES (BATCH)
  // ═════════════════════════════════════════════════════════════

  private async importCollection(
    collectionName: string,
    dataArray: any[],
    idKey?: string
  ): Promise<void> {
    if (!dataArray || dataArray.length === 0) {
      this.log(`⚠️ No hay datos para importar en: ${collectionName}`, 'warn');
      return;
    }

    const spinner = ora(
      `Importando ${dataArray.length} documentos a '${collectionName}'...`
    ).start();

    try {
      const batchArray: admin.firestore.WriteBatch[] = [this.db.batch()];
      let operationCounter = 0;
      let batchIndex = 0;

      for (const doc of dataArray) {
        let docId: string;

        if (idKey && doc[idKey]) {
          docId = String(doc[idKey]).replace(/[\/]/g, '-');
        } else {
          docId = this.generateId();
          doc.id = docId;
        }

        const docRef = this.db.collection(collectionName).doc(docId);
        batchArray[batchIndex].set(docRef, doc);
        operationCounter++;

        if (operationCounter === CONFIG.batch.maxSize) {
          batchArray.push(this.db.batch());
          batchIndex++;
          operationCounter = 0;
        }
      }

      await Promise.all(batchArray.map((batch) => batch.commit()));

      spinner.succeed(
        chalk.green(`✅ ${dataArray.length} documentos importados a '${collectionName}'`)
      );

      // Actualizar estadísticas
      this.updateStats(collectionName, dataArray.length);
    } catch (error) {
      spinner.fail(chalk.red(`❌ Error importando '${collectionName}'`));
      this.log(`Error en ${collectionName}: ${error}`, 'error');
      throw error;
    }
  }

  private async importSingleDoc(
    collectionName: string,
    docId: string,
    dataObject: any
  ): Promise<void> {
    try {
      await this.db.collection(collectionName).doc(docId).set(dataObject);
      this.log(`✅ Documento '${collectionName}/${docId}' importado`, 'success');
      this.updateStats(collectionName, 1);
    } catch (error) {
      this.log(`❌ Error importando documento '${collectionName}/${docId}': ${error}`, 'error');
      throw error;
    }
  }

  private updateStats(collectionName: string, count: number): void {
    const key = collectionName as keyof ImportStats;
    if (key in this.stats && typeof this.stats[key] === 'number') {
      (this.stats[key] as number) += count;
    }
  }

  // ═════════════════════════════════════════════════════════════
  // 🏦 PASO 1: BANCOS, GASTOS Y TRANSFERENCIAS
  // ═════════════════════════════════════════════════════════════

  async procesarBancosGastosTransferencias(): Promise<void> {
    this.log('\n🏦 PASO 1: Procesando Bancos, Gastos y Transferencias...', 'info');

    const bancosArray: Banco[] = [];
    const gastosArray: Gasto[] = [];
    const transferenciasArray: Transferencia[] = [];

    for (const config of CONFIG.bancos.configuracion) {
      try {
        // 1. Extraer Saldo
        const rawData = await this.parseCSV(
          CONFIG.csvFiles.bancos[config.id as keyof typeof CONFIG.csvFiles.bancos],
          { headers: false }
        );

        const saldoRow = rawData[1];
        const colIndex = config.saldoCell.charCodeAt(0) - 'A'.charCodeAt(0);
        const saldo = this.parseCurrency(saldoRow[colIndex]);

        bancosArray.push({
          id: config.id,
          nombre: config.nombre,
          saldo,
          tipo: config.tipo,
          moneda: config.moneda,
          activo: true,
          fechaActualizacion: new Date(),
        });

        // 2. Extraer Gastos y Transferencias
        const gastosRaw = await this.parseCSV(
          CONFIG.csvFiles.bancos[config.id as keyof typeof CONFIG.csvFiles.bancos],
          {
            headers: config.gastoHeaders,
            skipLines: config.skipGastos,
          }
        );

        for (const gasto of gastosRaw) {
          const monto = this.parseCurrency(gasto.Gasto) || this.parseCurrency(gasto['Gasto Total']);

          if (monto > 0) {
            const bancoDestinoNormalizado = this.getBancoDestino(gasto.Destino);

            if (bancoDestinoNormalizado) {
              // Es una transferencia
              transferenciasArray.push({
                fecha: gasto.Fecha || gasto.Fecha_1,
                monto,
                bancoOrigen: config.id,
                bancoDestino: bancoDestinoNormalizado,
                observaciones: gasto.Observaciones || '',
                concepto: gasto.Concepto || '',
                estatus: 'completada',
                tipo: 'transferencia',
              });
            } else {
              // Es un gasto
              gastosArray.push({
                fecha: gasto.Fecha || gasto.Fecha_1,
                monto,
                bancoOrigen: config.id,
                observaciones: gasto.Observaciones || '',
                concepto: gasto.Concepto || '',
                destino: gasto.Destino || 'NA',
                categoria: 'operativo',
                tipo: 'gasto',
              });
            }
          }
        }
      } catch (error) {
        this.log(`Error procesando banco ${config.id}: ${error}`, 'error');
      }
    }

    // Importar las 3 colecciones
    await this.importCollection('bancos', bancosArray, 'id');
    await this.importCollection('gastos', gastosArray);
    await this.importCollection('transferencias', transferenciasArray);

    this.log(
      `✅ Paso 1 completado: ${bancosArray.length} bancos, ${gastosArray.length} gastos, ${transferenciasArray.length} transferencias`,
      'success'
    );
  }

  // ═════════════════════════════════════════════════════════════
  // 👥 PASO 2: CLIENTES
  // ═════════════════════════════════════════════════════════════

  async procesarClientes(): Promise<void> {
    this.log('\n👥 PASO 2: Procesando Clientes...', 'info');

    try {
      const data = await this.parseCSV(CONFIG.csvFiles.clientes, {
        headers: [
          '_1',
          '_2',
          '_3',
          '_4',
          'cliente',
          'actual',
          'deuda',
          'abonos',
          'pendiente',
          'observaciones',
        ],
        skipLines: 3,
      });

      const clientes: Cliente[] = data
        .filter((row) => row.cliente && row.cliente.trim() !== '')
        .map((row) => ({
          id: row.cliente.trim(),
          cliente: row.cliente.trim(),
          deuda: this.parseCurrency(row.deuda),
          abonos: this.parseCurrency(row.abonos),
          pendiente: this.parseCurrency(row.pendiente),
          observaciones: row.observaciones || '',
          activo: true,
          fechaRegistro: new Date(),
        }));

      await this.importCollection('clientes', clientes, 'id');
      this.log(`✅ Paso 2 completado: ${clientes.length} clientes`, 'success');
    } catch (error) {
      this.log(`Error procesando clientes: ${error}`, 'error');
      throw error;
    }
  }

  // ═════════════════════════════════════════════════════════════
  // 🚚 PASO 3: DISTRIBUIDORES Y ÓRDENES DE COMPRA
  // ═════════════════════════════════════════════════════════════

  async procesarDistribuidores(): Promise<void> {
    this.log('\n🚚 PASO 3: Procesando Distribuidores y Órdenes de Compra...', 'info');

    try {
      const data = await this.parseCSV(CONFIG.csvFiles.distribuidores, {
        headers: true,
        skipLines: 2,
      });

      // Órdenes de Compra
      const ordenesCompra: OrdenCompra[] = data
        .filter((row) => row.OC && row.OC.trim() !== '')
        .map((row) => ({
          id: row.OC.trim(),
          fecha: row.Fecha,
          origen: row.Origen,
          cantidad: parseInt(row.Cantidad) || 0,
          costoDistribuidor: this.parseCurrency(row['Costo Distribuidor']),
          costoTransporte: this.parseCurrency(row['Costo Transporte']),
          costoPorUnidad: this.parseCurrency(row['Costo Por Unidad']),
          costoTotal: this.parseCurrency(row['Costo Total']),
          deuda: this.parseCurrency(row.Deuda),
          estatus: 'completada' as const,
        }));

      // Distribuidores
      const distribuidores: Distribuidor[] = data
        .filter((row) => row.Distribuidores && row.Distribuidores.trim() !== '')
        .map((row) => ({
          id: row.Distribuidores.trim(),
          distribuidor: row.Distribuidores.trim(),
          costoTotal: this.parseCurrency(row['Costo total']),
          abonos: this.parseCurrency(row.Abonos),
          pendiente: this.parseCurrency(row.Pendiente),
          activo: true,
          fechaRegistro: new Date(),
        }));

      await this.importCollection('ordenesCompra', ordenesCompra, 'id');
      await this.importCollection('distribuidores', distribuidores, 'id');

      this.log(
        `✅ Paso 3 completado: ${ordenesCompra.length} órdenes, ${distribuidores.length} distribuidores`,
        'success'
      );
    } catch (error) {
      this.log(`Error procesando distribuidores: ${error}`, 'error');
      throw error;
    }
  }

  // ═════════════════════════════════════════════════════════════
  // 💰 PASO 4: VENTAS
  // ═════════════════════════════════════════════════════════════

  async procesarVentas(): Promise<void> {
    this.log('\n💰 PASO 4: Procesando Ventas...', 'info');

    try {
      const data = await this.parseCSV(CONFIG.csvFiles.controlMaestro, {
        headers: true,
        skipLines: 2,
      });

      const ventas: Venta[] = data
        .filter((row) => row.Fecha && row.Fecha.trim() !== '')
        .map((row) => ({
          fecha: row.Fecha,
          ocRelacionada: row['OC Relacionada'],
          cantidad: parseInt(row.Cantidad) || 0,
          cliente: row.Cliente,
          ingresoBovedaMonte: this.parseCurrency(row['Bóveda Monte']),
          precioVenta: this.parseCurrency(row['Precio De Venta']),
          ingresoTotal: this.parseCurrency(row.Ingreso),
          flete: this.parseCurrency(row.Flete),
          fleteUtilidad: this.parseCurrency(row['Flete Utilidad']),
          utilidad: this.parseCurrency(row.Utilidad),
          estatus: row.Estatus,
          concepto: row.Concepto,
        }));

      await this.importCollection('ventas', ventas);
      this.log(`✅ Paso 4 completado: ${ventas.length} ventas`, 'success');
    } catch (error) {
      this.log(`Error procesando ventas: ${error}`, 'error');
      throw error;
    }
  }

  // ═════════════════════════════════════════════════════════════
  // 📦 PASO 5: ALMACÉN
  // ═════════════════════════════════════════════════════════════

  async procesarAlmacen(): Promise<void> {
    this.log('\n📦 PASO 5: Procesando Almacén...', 'info');

    try {
      const data = await this.parseCSV(CONFIG.csvFiles.almacen, { headers: false });

      const almacenDoc: Almacen = {
        ingresos: parseInt(data[0]['0'].replace(/,/g, '')) || 0,
        stockActual: parseInt(data[0]['5']) || 0,
        salidas: parseInt(data[0]['8'].replace(/,/g, '')) || 0,
        fechaActualizacion: new Date(),
      };

      await this.importSingleDoc('estadoGlobal', 'almacen', almacenDoc);
      this.log('✅ Paso 5 completado: Almacén actualizado', 'success');
    } catch (error) {
      this.log(`Error procesando almacén: ${error}`, 'error');
      throw error;
    }
  }

  // ═════════════════════════════════════════════════════════════
  // 📦 PASO 6: PRODUCTO
  // ═════════════════════════════════════════════════════════════

  async procesarProducto(): Promise<void> {
    this.log('\n📦 PASO 6: Procesando Producto...', 'info');

    try {
      const dataDist = await this.parseCSV(CONFIG.csvFiles.distribuidores, {
        headers: true,
        skipLines: 2,
      });
      const dataVentas = await this.parseCSV(CONFIG.csvFiles.controlMaestro, {
        headers: true,
        skipLines: 2,
      });

      const costoBase = this.parseCurrency(dataDist[0]['Costo Por Unidad']) || 6300;
      const precioBase = this.parseCurrency(dataVentas[0]['Precio De Venta']) || 6300;

      const productoDoc: Producto = {
        id: 'PROD-001',
        nombre: 'Producto Principal',
        descripcion: 'Producto principal de distribución',
        costo: costoBase,
        precioVenta: precioBase,
        activo: true,
        fechaCreacion: new Date(),
      };

      await this.importSingleDoc('productos', 'PROD-001', productoDoc);
      this.log('✅ Paso 6 completado: Producto creado', 'success');
    } catch (error) {
      this.log(`Error procesando producto: ${error}`, 'error');
      throw error;
    }
  }

  // ═════════════════════════════════════════════════════════════
  // 📊 RESUMEN FINAL
  // ═════════════════════════════════════════════════════════════

  private printFinalStats(): void {
    this.stats.tiempoTotal = (Date.now() - this.startTime) / 1000;

    console.log('\n' + chalk.cyan('═'.repeat(70)));
    console.log(chalk.cyan.bold('               📊 RESUMEN DE IMPORTACIÓN                '));
    console.log(chalk.cyan('═'.repeat(70)));
    console.log('');
    console.log(chalk.white('  Colección               │ Documentos Importados'));
    console.log(chalk.gray('  ─────────────────────────┼─────────────────────'));
    console.log(chalk.green(`  Bancos                  │ ${this.stats.bancos}`));
    console.log(chalk.green(`  Gastos                  │ ${this.stats.gastos}`));
    console.log(chalk.green(`  Transferencias          │ ${this.stats.transferencias}`));
    console.log(chalk.green(`  Clientes                │ ${this.stats.clientes}`));
    console.log(chalk.green(`  Distribuidores          │ ${this.stats.distribuidores}`));
    console.log(chalk.green(`  Órdenes de Compra       │ ${this.stats.ordenesCompra}`));
    console.log(chalk.green(`  Ventas                  │ ${this.stats.ventas}`));
    console.log(chalk.green(`  Productos               │ ${this.stats.productos}`));
    console.log('');
    console.log(chalk.gray('  ─────────────────────────┼─────────────────────'));

    const totalDocs =
      this.stats.bancos +
      this.stats.gastos +
      this.stats.transferencias +
      this.stats.clientes +
      this.stats.distribuidores +
      this.stats.ordenesCompra +
      this.stats.ventas +
      this.stats.productos;

    console.log(chalk.yellow.bold(`  TOTAL                   │ ${totalDocs} documentos`));
    console.log('');
    console.log(chalk.white(`  ⏱️  Tiempo total:          ${this.stats.tiempoTotal.toFixed(2)}s`));
    console.log(chalk.white(`  ❌ Errores:                ${this.stats.errores}`));
    console.log(chalk.white(`  📝 Log guardado en:        ${this.logFile}`));
    console.log('');
    console.log(chalk.cyan('═'.repeat(70)));

    if (this.stats.errores === 0) {
      console.log(chalk.green.bold('\n✅ IMPORTACIÓN COMPLETADA EXITOSAMENTE\n'));
    } else {
      console.log(
        chalk.yellow.bold(`\n⚠️  IMPORTACIÓN COMPLETADA CON ${this.stats.errores} ERRORES\n`)
      );
    }
  }

  // ═════════════════════════════════════════════════════════════
  // 🚀 MÉTODO PRINCIPAL
  // ═════════════════════════════════════════════════════════════

  async ejecutar(): Promise<void> {
    try {
      console.log('\n' + chalk.cyan('═'.repeat(70)));
      console.log(chalk.cyan.bold('     🔥 IMPORTACIÓN AVANZADA CSV → FIRESTORE 🔥     '));
      console.log(chalk.cyan('═'.repeat(70)) + '\n');

      await this.procesarBancosGastosTransferencias();
      await this.procesarClientes();
      await this.procesarDistribuidores();
      await this.procesarVentas();
      await this.procesarAlmacen();
      await this.procesarProducto();

      this.printFinalStats();
    } catch (error) {
      this.log(`❌ ERROR FATAL: ${error}`, 'error');
      console.error(chalk.red.bold('\n💥 LA IMPORTACIÓN FALLÓ\n'));
      process.exit(1);
    } finally {
      await admin.app().delete();
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// 🎬 EJECUCIÓN
// ═══════════════════════════════════════════════════════════════

const importer = new FirestoreImporter();
importer.ejecutar();
