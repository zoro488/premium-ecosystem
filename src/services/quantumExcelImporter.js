/**
 * ============================================
 * FLOWDISTRIBUTOR QUANTUM - IMPORTADOR QUIRÚRGICO
 * Sistema Ultra-Avanzado de Importación con Trazabilidad Total
 * ============================================
 */
import { Timestamp, doc, setDoc, writeBatch } from 'firebase/firestore';
import * as XLSX from 'xlsx';

import { db } from '../lib/firebase';

/**
 * Clase principal para importación quirúrgica del Excel
 */
export class QuantumExcelImporter {
  // Inicialización de propiedades
  workbook = null;
  sheets = {};
  relations = new Map();
  trazabilidad = new Map();
  warnings = [];
  errores = [];
  stats = {};
  metricas = {};

  constructor(db) {
    this.db = db;
  }

  /**
   * Importar archivo Excel completo
   */
  async importarExcel(file) {
    // console.log('🚀 Iniciando importación quirúrgica del Excel...');
    try {
      // Leer archivo Excel
      const data = await file.arrayBuffer();
      this.workbook = XLSX.read(data, { type: 'array', cellDates: true });

      console.log(`📊 Hojas detectadas: ${this.workbook.SheetNames.join(', ')}`);

      // Procesar cada hoja en orden específico para mantener relaciones
      await this.procesarDistribuidores();
      await this.procesarControlMaestro();
      await this.procesarAlmacenMonte();
      await this.procesarBancos();
      await this.procesarClientes();
      await this.procesarDataSheet();

      // Validar y crear relaciones
      await this.validarRelaciones();

      // Guardar en Firestore con transacciones
      await this.guardarEnFirestore();

      // Generar reporte
      return this.generarReporte();
    } catch (error) {
      // console.error('❌ Error en importación:', error);
      this.errores.push({
        tipo: 'CRITICAL',
        mensaje: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Procesar hoja de Distribuidores (OC + Proveedores)
   */
  async procesarDistribuidores() {
    // console.log('📦 Procesando Distribuidores...');
    const sheet = this.workbook.Sheets['Distribuidores'];
    if (!sheet) {
      this.warnings.push('Hoja Distribuidores no encontrada');
      return;
    }

    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Encontrar fila de headers (segunda fila generalmente)
    const headerRow = 1;

    // Mapeo de columnas
    const colMap = {
      oc: 0, // OC
      fecha: 1, // Fecha
      origen: 2, // Origen (Distribuidor)
      cantidad: 3, // Cantidad
      costoDistribuidor: 4, // Costo Distribuidor
      costoTransporte: 5, // Costo Transporte
      costoPorUnidad: 6, // Costo Por Unidad
      stockActual: 7, // Stock Actual
      costoTotal: 8, // Costo Total
      pagoDistribuidor: 9, // Pago a Distribuidor
      deuda: 10, // Deuda
      // Columna distribuidores
      nombreDistribuidor: 12, // Distribuidores
      costoTotalDist: 13, // Costo total
      abonosDist: 14, // Abonos
      pendienteDist: 15, // Pendiente
    };

    const ordenesCompra = [];
    const distribuidores = new Map();

    // Procesar órdenes de compra (desde fila 2)
    for (let i = headerRow + 1; i < data.length; i++) {
      const row = data[i];

      if (!row || !row[colMap.oc] || !String(row[colMap.oc]).startsWith('OC')) {
        continue;
      }

      const ocId = String(row[colMap.oc]);

      const ordenCompra = {
        id: ocId,
        numero: ocId,
        fecha: this.parseExcelDate(row[colMap.fecha]),
        distribuidor: String(row[colMap.origen] || '').trim(),
        cantidad: Number(row[colMap.cantidad]) || 0,
        costoDistribuidor: Number(row[colMap.costoDistribuidor]) || 0,
        costoTransporte: Number(row[colMap.costoTransporte]) || 0,
        costoPorUnidad: Number(row[colMap.costoPorUnidad]) || 0,
        stockActual: Number(row[colMap.stockActual]) || 0,
        costoTotal: Number(row[colMap.costoTotal]) || 0,
        pagoDistribuidor: Number(row[colMap.pagoDistribuidor]) || 0,
        deuda: Number(row[colMap.deuda]) || 0,
        estado: this.determinarEstadoOC(row),
        tipo: 'orden_compra',
        origen: 'distribuidores_sheet',
        fechaCreacion: Timestamp.now(),
        metadata: {
          fila: i + 1,
          hoja: 'Distribuidores',
        },
      };

      ordenesCompra.push(ordenCompra);

      // Registrar relación OC -> Distribuidor
      this.registrarRelacion(ocId, 'orden_compra', ordenCompra.distribuidor, 'distribuidor');

      // Procesar información de distribuidor si existe en la misma fila
      if (row[colMap.nombreDistribuidor]) {
        const distNombre = String(row[colMap.nombreDistribuidor]).trim();

        if (!distribuidores.has(distNombre)) {
          distribuidores.set(distNombre, {
            id: this.generarId(distNombre),
            nombre: distNombre,
            costoTotal: Number(row[colMap.costoTotalDist]) || 0,
            abonos: Number(row[colMap.abonosDist]) || 0,
            pendiente: Number(row[colMap.pendienteDist]) || 0,
            ordenesCompra: [],
            tipo: 'distribuidor',
            origen: 'distribuidores_sheet',
            fechaCreacion: Timestamp.now(),
            metadata: {
              fila: i + 1,
              hoja: 'Distribuidores',
            },
          });
        }

        // Agregar OC al distribuidor
        const dist = distribuidores.get(distNombre);
        dist.ordenesCompra.push(ocId);

        // Actualizar totales
        dist.costoTotal += ordenCompra.costoTotal;
        dist.pendiente = dist.costoTotal - dist.abonos;
      }

      this.stats.procesados++;
    }

    // Guardar en estructura de datos
    this.sheets.ordenesCompra = ordenesCompra;
    this.sheets.distribuidores = Array.from(distribuidores.values());
     // console.log(`✅ Procesadas ${ordenesCompra.length} órdenes de compra`);
    // console.log(`✅ Procesados ${distribuidores.size} distribuidores`);
  }

  /**
   * Procesar Control Maestro (Ventas + GYA)
   */
  async procesarControlMaestro() {
    // console.log('💰 Procesando Control Maestro...');
    const sheet = this.workbook.Sheets['Control_Maestro'];
    if (!sheet) {
      this.warnings.push('Hoja Control_Maestro no encontrada');
      return;
    }

    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // RF Actual está en la primera fila, columna 12
    const rfActual = Number(data[0]?.[12]) || 0;
    const almacenVilla = Number(data[2]?.[13]) || 0;

    // Headers en fila 1
    const headerRow = 1;

    // Mapeo de columnas para Ventas Locales
    const ventasColMap = {
      fecha: 0,
      ocRelacionada: 1,
      cantidad: 2,
      cliente: 3,
      bovedaMonte: 4,
      precioVenta: 5,
      ingreso: 6,
      flete: 7,
      fleteUtilidad: 8,
      utilidad: 9,
      estatus: 10,
      concepto: 11,
    };

    // Mapeo de columnas para GYA (Gastos y Abonos)
    const gyaColMap = {
      fecha: 14,
      origen: 15,
      valor: 16,
      tc: 17,
      pesos: 18,
      destino: 19,
      concepto: 20,
      observaciones: 21,
    };

    const ventasLocales = [];
    const gastosAbonos = [];

    // Procesar ventas locales
    for (let i = headerRow + 1; i < data.length; i++) {
      const row = data[i];

      if (!row) continue;

      // Procesar venta si tiene fecha válida
      if (row[ventasColMap.fecha]) {
        const ventaId = this.generarId(`venta-${i}`);

        const venta = {
          id: ventaId,
          fecha: this.parseExcelDate(row[ventasColMap.fecha]),
          ocRelacionada: String(row[ventasColMap.ocRelacionada] || '').trim(),
          cantidad: Number(row[ventasColMap.cantidad]) || 0,
          cliente: String(row[ventasColMap.cliente] || '').trim(),
          bovedaMonte: Number(row[ventasColMap.bovedaMonte]) || 0,
          precioVenta: Number(row[ventasColMap.precioVenta]) || 0,
          ingreso: Number(row[ventasColMap.ingreso]) || 0,
          flete: String(row[ventasColMap.flete] || '').trim(),
          fleteUtilidad: Number(row[ventasColMap.fleteUtilidad]) || 0,
          utilidad: Number(row[ventasColMap.utilidad]) || 0,
          estatus: String(row[ventasColMap.estatus] || '').trim(),
          concepto: String(row[ventasColMap.concepto] || '').trim(),
          tipo: 'venta_local',
          origen: 'control_maestro_sheet',
          fechaCreacion: Timestamp.now(),
          metadata: {
            fila: i + 1,
            hoja: 'Control_Maestro',
          },
        };

        ventasLocales.push(venta);

        // Registrar relaciones
        if (venta.ocRelacionada) {
          this.registrarRelacion(ventaId, 'venta', venta.ocRelacionada, 'orden_compra');
        }
        if (venta.cliente) {
          this.registrarRelacion(ventaId, 'venta', venta.cliente, 'cliente');
        }

        this.stats.procesados++;
      }

      // Procesar gasto/abono si tiene fecha válida
      if (row[gyaColMap.fecha]) {
        const gyaId = this.generarId(`gya-${i}`);

        const gya = {
          id: gyaId,
          fecha: this.parseExcelDate(row[gyaColMap.fecha]),
          origen: String(row[gyaColMap.origen] || '').trim(),
          valor: Number(row[gyaColMap.valor]) || 0,
          tc: Number(row[gyaColMap.tc]) || 0,
          pesos: Number(row[gyaColMap.pesos]) || 0,
          destino: String(row[gyaColMap.destino] || '').trim(),
          concepto: String(row[gyaColMap.concepto] || '').trim(),
          observaciones: String(row[gyaColMap.observaciones] || '').trim(),
          tipo: this.determinarTipoGYA(row[gyaColMap.origen]),
          origen_sheet: 'control_maestro_sheet',
          fechaCreacion: Timestamp.now(),
          metadata: {
            fila: i + 1,
            hoja: 'Control_Maestro',
          },
        };

        gastosAbonos.push(gya);

        // Registrar relaciones con bancos
        if (gya.destino) {
          this.registrarRelacion(gyaId, 'gasto_abono', gya.destino, 'banco');
        }

        this.stats.procesados++;
      }
    }

    // Guardar en estructura
    this.sheets.controlMaestro = {
      rfActual,
      almacenVilla,
      ventasLocales,
      gastosAbonos,
      metricas: this.calcularMetricasControl(ventasLocales, gastosAbonos),
    };
     // console.log(`✅ Procesadas ${ventasLocales.length} ventas locales`);
    // console.log(`✅ Procesados ${gastosAbonos.length} gastos/abonos`);
    console.log(`💰 RF Actual: $${rfActual.toLocaleString()}`);
  }

  /**
   * Procesar Almacén Monte
   */
  async procesarAlmacenMonte() {
    // console.log('📦 Procesando Almacén Monte...');
    const sheet = this.workbook.Sheets['Almacen_Monte'];
    if (!sheet) {
      this.warnings.push('Hoja Almacen_Monte no encontrada');
      return;
    }

    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Primera fila tiene totales
    const totalIngresos = Number(data[0]?.[0]) || 0;
    const stockActual = Number(data[0]?.[4]) || 0;
    const totalSalidas = Number(data[0]?.[6]) || 0;

    // Headers en fila 1
    const headerRow = 1;

    // Mapeo de columnas para ingresos
    const ingresosColMap = {
      oc: 0,
      cliente: 1,
      distribuidor: 2,
      cantidad: 3,
      fecha: 4,
      corte: 5,
    };

    // Mapeo de columnas para salidas
    const salidasColMap = {
      fecha: 6,
      cliente: 7,
      cantidad: 8,
      concepto: 9,
      observaciones: 10,
    };

    const ingresos = [];
    const salidas = [];

    // Procesar movimientos
    for (let i = headerRow + 1; i < data.length; i++) {
      const row = data[i];

      if (!row) continue;

      // Procesar ingreso
      if (row[ingresosColMap.oc]) {
        const ingresoId = this.generarId(`ingreso-${i}`);

        const ingreso = {
          id: ingresoId,
          oc: String(row[ingresosColMap.oc]).trim(),
          cliente: String(row[ingresosColMap.cliente] || '').trim(),
          distribuidor: String(row[ingresosColMap.distribuidor] || '').trim(),
          cantidad: Number(row[ingresosColMap.cantidad]) || 0,
          fecha: this.parseExcelDate(row[ingresosColMap.fecha]),
          corte: Number(row[ingresosColMap.corte]) || 0,
          tipo: 'ingreso_almacen',
          origen: 'almacen_monte_sheet',
          fechaCreacion: Timestamp.now(),
          metadata: {
            fila: i + 1,
            hoja: 'Almacen_Monte',
          },
        };

        ingresos.push(ingreso);

        // Registrar relaciones
        this.registrarRelacion(ingresoId, 'ingreso', ingreso.oc, 'orden_compra');
        if (ingreso.distribuidor) {
          this.registrarRelacion(ingresoId, 'ingreso', ingreso.distribuidor, 'distribuidor');
        }

        this.stats.procesados++;
      }

      // Procesar salida
      if (row[salidasColMap.fecha] && row[salidasColMap.cliente]) {
        const salidaId = this.generarId(`salida-${i}`);

        const salida = {
          id: salidaId,
          fecha: this.parseExcelDate(row[salidasColMap.fecha]),
          cliente: String(row[salidasColMap.cliente]).trim(),
          cantidad: Number(row[salidasColMap.cantidad]) || 0,
          concepto: String(row[salidasColMap.concepto] || '').trim(),
          observaciones: String(row[salidasColMap.observaciones] || '').trim(),
          tipo: 'salida_almacen',
          origen: 'almacen_monte_sheet',
          fechaCreacion: Timestamp.now(),
          metadata: {
            fila: i + 1,
            hoja: 'Almacen_Monte',
          },
        };

        salidas.push(salida);

        // Registrar relación con cliente
        this.registrarRelacion(salidaId, 'salida', salida.cliente, 'cliente');

        this.stats.procesados++;
      }
    }

    // Guardar en estructura
    this.sheets.almacenMonte = {
      totalIngresos,
      totalSalidas,
      stockActual,
      ingresos,
      salidas,
      metricas: this.calcularMetricasAlmacen(totalIngresos, totalSalidas, stockActual),
    };
     // console.log(`✅ Procesados ${ingresos.length} ingresos`);
    // console.log(`✅ Procesadas ${salidas.length} salidas`);
    // console.log(`📊 Stock Actual: ${stockActual} unidades`);
  }

  /**
   * Procesar hojas de Bancos (6 bancos)
   */
  async procesarBancos() {
    // console.log('🏦 Procesando Bancos...');
    const bancos = [
      'Bóveda_Monte',
      'Bóveda_USA',
      'Utilidades',
      'Flete_Sur',
      'Azteca',
      'Leftie',
      'Profit',
    ];

    this.sheets.bancos = {};

    for (const nombreBanco of bancos) {
      const sheet = this.workbook.Sheets[nombreBanco];

      if (!sheet) {
        this.warnings.push(`Hoja ${nombreBanco} no encontrada`);
        continue;
      }

      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Primera fila tiene totales
      const totalIngresos = Number(data[0]?.[0]) || 0;
      const rfActual = Number(data[0]?.[4] || data[0]?.[7] || data[0]?.[8]) || 0;
      const totalGastos = Number(data[0]?.[6] || data[0]?.[10]) || 0;

      const headerRow = 1;

      // Detectar estructura de columnas (varía por banco)
      const estructura = this.detectarEstructuraBanco(data[headerRow]);

      const ingresos = [];
      const gastos = [];

      // Procesar movimientos
      for (let i = headerRow + 1; i < data.length; i++) {
        const row = data[i];

        if (!row) continue;

        // Procesar ingreso
        if (row[estructura.ingresos.fecha]) {
          const ingresoId = this.generarId(`banco-ingreso-${nombreBanco}-${i}`);

          const ingreso = {
            id: ingresoId,
            banco: nombreBanco,
            fecha: this.parseExcelDate(row[estructura.ingresos.fecha]),
            cliente: String(row[estructura.ingresos.cliente] || '').trim(),
            monto: Number(row[estructura.ingresos.monto]) || 0,
            tc: Number(row[estructura.ingresos.tc]) || 0,
            moneda: estructura.ingresos.tc ? 'USD' : 'MXN',
            concepto: String(row[estructura.ingresos.concepto] || '').trim(),
            observaciones: String(row[estructura.ingresos.observaciones] || '').trim(),
            tipo: 'ingreso_banco',
            origen: `${nombreBanco.toLowerCase()}_sheet`,
            fechaCreacion: Timestamp.now(),
            metadata: {
              fila: i + 1,
              hoja: nombreBanco,
            },
          };

          ingresos.push(ingreso);

          // Registrar relación con cliente si existe
          if (ingreso.cliente && ingreso.cliente !== 'Corte') {
            this.registrarRelacion(ingresoId, 'ingreso_banco', ingreso.cliente, 'cliente');
          }

          this.stats.procesados++;
        }

        // Procesar gasto
        if (row[estructura.gastos.fecha]) {
          const gastoId = this.generarId(`banco-gasto-${nombreBanco}-${i}`);

          const gasto = {
            id: gastoId,
            banco: nombreBanco,
            fecha: this.parseExcelDate(row[estructura.gastos.fecha]),
            origen: String(row[estructura.gastos.origen] || '').trim(),
            monto: Number(row[estructura.gastos.monto]) || 0,
            tc: Number(row[estructura.gastos.tc]) || 0,
            pesos: Number(row[estructura.gastos.pesos]) || 0,
            moneda: estructura.gastos.tc ? 'USD' : 'MXN',
            destino: String(row[estructura.gastos.destino] || '').trim(),
            concepto: String(row[estructura.gastos.concepto] || '').trim(),
            observaciones: String(row[estructura.gastos.observaciones] || '').trim(),
            tipo: 'gasto_banco',
            origen_sheet: `${nombreBanco.toLowerCase()}_sheet`,
            fechaCreacion: Timestamp.now(),
            metadata: {
              fila: i + 1,
              hoja: nombreBanco,
            },
          };

          gastos.push(gasto);

          // Registrar relación con destino si es otro banco
          if (gasto.destino) {
            this.registrarRelacion(gastoId, 'gasto_banco', gasto.destino, 'banco');
          }

          this.stats.procesados++;
        }
      }

      // Guardar datos del banco
      this.sheets.bancos[nombreBanco] = {
        nombre: nombreBanco,
        totalIngresos,
        totalGastos,
        rfActual,
        balance: rfActual,
        ingresos,
        gastos,
        metricas: this.calcularMetricasBanco(totalIngresos, totalGastos, rfActual),
      };
       // console.log(`✅ ${nombreBanco}: ${ingresos.length} ingresos, ${gastos.length} gastos`);
    }
  }

  /**
   * Procesar hoja de Clientes
   */
  async procesarClientes() {
    // console.log('👥 Procesando Clientes...');
    const sheet = this.workbook.Sheets['Clientes'];
    if (!sheet) {
      this.warnings.push('Hoja Clientes no encontrada');
      return;
    }

    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Headers en fila 1
    const headerRow = 1;

    const colMap = {
      cliente: 4,
      actual: 5,
      deuda: 6,
      abonos: 7,
      pendiente: 8,
      observaciones: 9,
    };

    const clientes = [];

    for (let i = headerRow + 1; i < data.length; i++) {
      const row = data[i];

      if (!row || !row[colMap.cliente]) continue;

      const nombreCliente = String(row[colMap.cliente]).trim();

      if (nombreCliente === 'Cliente' || !nombreCliente) continue;

      const clienteId = this.generarId(nombreCliente);

      const cliente = {
        id: clienteId,
        nombre: nombreCliente,
        actual: Number(row[colMap.actual]) || 0,
        deuda: Number(row[colMap.deuda]) || 0,
        abonos: Number(row[colMap.abonos]) || 0,
        pendiente: Number(row[colMap.pendiente]) || 0,
        observaciones: String(row[colMap.observaciones] || '').trim(),
        estado: this.determinarEstadoCliente(Number(row[colMap.pendiente])),
        tipo: 'cliente',
        origen: 'clientes_sheet',
        fechaCreacion: Timestamp.now(),
        metadata: {
          fila: i + 1,
          hoja: 'Clientes',
        },
      };

      clientes.push(cliente);
      this.stats.procesados++;
    }

    this.sheets.clientes = clientes;
     // console.log(`✅ Procesados ${clientes.length} clientes`);
  }

  /**
   * Procesar hoja DATA (listas de validación)
   */
  async procesarDataSheet() {
    // console.log('📋 Procesando DATA Sheet...');
    const sheet = this.workbook.Sheets['DATA'];
    if (!sheet) {
      this.warnings.push('Hoja DATA no encontrada');
      return;
    }

    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const dataLists = {
      origenes: [],
      destinos: [],
      clientesValidacion: [],
    };

    // Procesar columnas
    for (let i = 1; i < data.length; i++) {
      const row = data[i];

      if (!row) continue;

      // Columna 0: ODGYA (orígenes)
      if (row[0]) {
        const origen = String(row[0]).trim();
        if (origen && !dataLists.origenes.includes(origen)) {
          dataLists.origenes.push(origen);
        }
      }

      // Columna 2: Destino
      if (row[2]) {
        const destino = String(row[2]).trim();
        if (destino && !dataLists.destinos.includes(destino)) {
          dataLists.destinos.push(destino);
        }
      }

      // Columna 4: Clientes
      if (row[4]) {
        const cliente = String(row[4]).trim();
        if (cliente && !dataLists.clientesValidacion.includes(cliente)) {
          dataLists.clientesValidacion.push(cliente);
        }
      }
    }

    this.sheets.dataValidacion = dataLists;
     // console.log(`✅ Procesadas listas de validación`);
    // console.log(`   - ${dataLists.origenes.length} orígenes`);
    // console.log(`   - ${dataLists.destinos.length} destinos`);
    // console.log(`   - ${dataLists.clientesValidacion.length} clientes`);
  }

  /**
   * Validar todas las relaciones entre entidades
   */
  async validarRelaciones() {
    // console.log('🔗 Validando relaciones...');
    const relacionesValidas = [];
    const relacionesInvalidas = [];

    for (const [sourceId, relations] of this.relations.entries()) {
      for (const rel of relations) {
        const validacion = await this.validarRelacion(rel);

        if (validacion.valida) {
          relacionesValidas.push(rel);
          this.stats.relacionesCreadas++;
        } else {
          relacionesInvalidas.push({
            relacion: rel,
            error: validacion.error,
          });
          this.errores.push({
            tipo: 'RELACION_INVALIDA',
            mensaje: `Relación inválida: ${rel.sourceType} -> ${rel.targetType}`,
            detalle: validacion.error,
          });
        }
      }
    }
     // console.log(`✅ Relaciones válidas: ${relacionesValidas.length}`);
    if (relacionesInvalidas.length > 0) {
      // console.warn(`⚠️  Relaciones inválidas: ${relacionesInvalidas.length}`);
    }
  }

  /**
   * Guardar todos los datos en Firestore
   */
  async guardarEnFirestore() {
    // console.log('💾 Guardando en Firestore...');
    try {
      // Usar batches para transacciones atómicas
      const batches = [];
      let currentBatch = writeBatch(db);
      let operationCount = 0;
      const BATCH_SIZE = 500;

      // Guardar órdenes de compra
      for (const oc of this.sheets.ordenesCompra || []) {
        const docRef = doc(db, 'ordenesCompra', oc.id);
        currentBatch.set(docRef, oc);
        operationCount++;

        if (operationCount >= BATCH_SIZE) {
          batches.push(currentBatch);
          currentBatch = writeBatch(db);
          operationCount = 0;
        }
      }

      // Guardar distribuidores
      for (const dist of this.sheets.distribuidores || []) {
        const docRef = doc(db, 'distribuidores', dist.id);
        currentBatch.set(docRef, dist);
        operationCount++;

        if (operationCount >= BATCH_SIZE) {
          batches.push(currentBatch);
          currentBatch = writeBatch(db);
          operationCount = 0;
        }
      }

      // Guardar ventas locales
      for (const venta of this.sheets.controlMaestro?.ventasLocales || []) {
        const docRef = doc(db, 'ventasLocales', venta.id);
        currentBatch.set(docRef, venta);
        operationCount++;

        if (operationCount >= BATCH_SIZE) {
          batches.push(currentBatch);
          currentBatch = writeBatch(db);
          operationCount = 0;
        }
      }

      // Guardar gastos y abonos
      for (const gya of this.sheets.controlMaestro?.gastosAbonos || []) {
        const docRef = doc(db, 'gastosAbonos', gya.id);
        currentBatch.set(docRef, gya);
        operationCount++;

        if (operationCount >= BATCH_SIZE) {
          batches.push(currentBatch);
          currentBatch = writeBatch(db);
          operationCount = 0;
        }
      }

      // Guardar movimientos de almacén
      for (const ingreso of this.sheets.almacenMonte?.ingresos || []) {
        const docRef = doc(db, 'almacenMovimientos', ingreso.id);
        currentBatch.set(docRef, ingreso);
        operationCount++;

        if (operationCount >= BATCH_SIZE) {
          batches.push(currentBatch);
          currentBatch = writeBatch(db);
          operationCount = 0;
        }
      }

      for (const salida of this.sheets.almacenMonte?.salidas || []) {
        const docRef = doc(db, 'almacenMovimientos', salida.id);
        currentBatch.set(docRef, salida);
        operationCount++;

        if (operationCount >= BATCH_SIZE) {
          batches.push(currentBatch);
          currentBatch = writeBatch(db);
          operationCount = 0;
        }
      }

      // Guardar movimientos bancarios
      for (const [nombreBanco, banco] of Object.entries(this.sheets.bancos || {})) {
        // Guardar configuración del banco
        const bancoDocRef = doc(db, 'bancos', this.generarId(nombreBanco));
        currentBatch.set(bancoDocRef, {
          nombre: nombreBanco,
          rfActual: banco.rfActual,
          totalIngresos: banco.totalIngresos,
          totalGastos: banco.totalGastos,
          metricas: banco.metricas,
          fechaActualizacion: Timestamp.now(),
        });
        operationCount++;

        // Guardar ingresos
        for (const ingreso of banco.ingresos) {
          const docRef = doc(db, 'movimientosBancarios', ingreso.id);
          currentBatch.set(docRef, ingreso);
          operationCount++;

          if (operationCount >= BATCH_SIZE) {
            batches.push(currentBatch);
            currentBatch = writeBatch(db);
            operationCount = 0;
          }
        }

        // Guardar gastos
        for (const gasto of banco.gastos) {
          const docRef = doc(db, 'movimientosBancarios', gasto.id);
          currentBatch.set(docRef, gasto);
          operationCount++;

          if (operationCount >= BATCH_SIZE) {
            batches.push(currentBatch);
            currentBatch = writeBatch(db);
            operationCount = 0;
          }
        }
      }

      // Guardar clientes
      for (const cliente of this.sheets.clientes || []) {
        const docRef = doc(db, 'clientes', cliente.id);
        currentBatch.set(docRef, cliente);
        operationCount++;

        if (operationCount >= BATCH_SIZE) {
          batches.push(currentBatch);
          currentBatch = writeBatch(db);
          operationCount = 0;
        }
      }

      // Guardar última batch
      if (operationCount > 0) {
        batches.push(currentBatch);
      }

      // Ejecutar todas las batches
      // console.log(`📦 Ejecutando ${batches.length} batches...`);
      for (let i = 0; i < batches.length; i++) {
        await batches[i].commit();
        // console.log(`  ✅ Batch ${i + 1}/${batches.length} completado`);
      }

      // Guardar metadata de importación
      const metadataRef = doc(db, 'importaciones', `import-${Date.now()}`);
      await setDoc(metadataRef, {
        fecha: Timestamp.now(),
        stats: this.stats,
        errores: this.errores,
        warnings: this.warnings,
        relacionesCreadas: this.stats.relacionesCreadas,
      });
       // console.log('✅ Datos guardados exitosamente en Firestore');
      this.stats.exitosos = this.stats.procesados;
    } catch (error) {
      // console.error('❌ Error guardando en Firestore:', error);
      this.errores.push({
        tipo: 'FIRESTORE_ERROR',
        mensaje: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Generar reporte final de importación
   */
  generarReporte() {
    const reporte = {
      exito: this.errores.filter((e) => e.tipo === 'CRITICAL').length === 0,
      stats: this.stats,
      resumen: {
        ordenesCompra: this.sheets.ordenesCompra?.length || 0,
        distribuidores: this.sheets.distribuidores?.length || 0,
        ventasLocales: this.sheets.controlMaestro?.ventasLocales?.length || 0,
        gastosAbonos: this.sheets.controlMaestro?.gastosAbonos?.length || 0,
        ingresosAlmacen: this.sheets.almacenMonte?.ingresos?.length || 0,
        salidasAlmacen: this.sheets.almacenMonte?.salidas?.length || 0,
        clientes: this.sheets.clientes?.length || 0,
        bancos: Object.keys(this.sheets.bancos || {}).length,
        movimientosBancarios: Object.values(this.sheets.bancos || {}).reduce(
          (sum, banco) => sum + banco.ingresos.length + banco.gastos.length,
          0
        ),
      },
      metricas: {
        capitalTotal: this.calcularCapitalTotal(),
        inventarioActual: this.sheets.almacenMonte?.stockActual || 0,
        carteraPorCobrar: this.calcularCarteraPorCobrar(),
        cuentasPorPagar: this.calcularCuentasPorPagar(),
      },
      errores: this.errores,
      warnings: this.warnings,
      fecha: new Date().toISOString(),
    };

    console.log('\n' + '='.repeat(80));
    // console.log('📊 REPORTE DE IMPORTACIÓN');
    console.log('='.repeat(80));
    // console.log(`✅ Estado: ${reporte.exito ? 'EXITOSO' : 'CON ERRORES'}`);
    // console.log(`📦 Registros procesados: ${this.stats.procesados}`);
    // console.log(`✅ Registros exitosos: ${this.stats.exitosos}`);
    // console.log(`❌ Registros fallidos: ${this.stats.fallidos}`);
    // console.log(`🔗 Relaciones creadas: ${this.stats.relacionesCreadas}`);
    // console.log('\n📋 RESUMEN:');
    // console.log(`   - Órdenes de Compra: ${reporte.resumen.ordenesCompra}`);
    // console.log(`   - Distribuidores: ${reporte.resumen.distribuidores}`);
    // console.log(`   - Ventas Locales: ${reporte.resumen.ventasLocales}`);
    // console.log(`   - Gastos/Abonos: ${reporte.resumen.gastosAbonos}`);
    // console.log(
      `   - Movimientos Almacén: ${reporte.resumen.ingresosAlmacen + reporte.resumen.salidasAlmacen}`
    );
    // console.log(`   - Clientes: ${reporte.resumen.clientes}`);
    // console.log(`   - Bancos: ${reporte.resumen.bancos}`);
    // console.log(`   - Movimientos Bancarios: ${reporte.resumen.movimientosBancarios}`);
    // console.log('\n💰 MÉTRICAS:');
    console.log(`   - Capital Total: $${reporte.metricas.capitalTotal.toLocaleString()}`);
    // console.log(`   - Inventario Actual: ${reporte.metricas.inventarioActual} unidades`);
    console.log(`   - Cartera por Cobrar: $${reporte.metricas.carteraPorCobrar.toLocaleString()}`);
    console.log(`   - Cuentas por Pagar: $${reporte.metricas.cuentasPorPagar.toLocaleString()}`);

    if (this.warnings.length > 0) {
      // console.log(`\n⚠️  ADVERTENCIAS: ${this.warnings.length}`);
      this.warnings.forEach((w) => console.log(`   - ${w}`));
    }

    if (this.errores.length > 0) {
      // console.log(`\n❌ ERRORES: ${this.errores.length}`);
      this.errores.forEach((e) => console.log(`   - ${e.tipo}: ${e.mensaje}`));
    }

    console.log('='.repeat(80));

    return reporte;
  }

  // ========================================
  // MÉTODOS AUXILIARES
  // ========================================

  parseExcelDate(value) {
    if (!value) return null;

    if (value instanceof Date) {
      return Timestamp.fromDate(value);
    }

    if (typeof value === 'string') {
      const date = new Date(value);
      return Timestamp.fromDate(date);
    }

    // Excel serial date
    if (typeof value === 'number') {
      const date = new Date((value - 25569) * 86400 * 1000);
      return Timestamp.fromDate(date);
    }

    return null;
  }

  generarId(nombre) {
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replaceAll(/[\u0300-\u036f]/g, '')
      .replaceAll(/[^a-z0-9]/g, '-')
      .replaceAll(/-+/g, '-')
      .replaceAll(/(?:^-|-$)/g, '');
  }

  registrarRelacion(sourceId, sourceType, targetId, targetType) {
    if (!this.relations.has(sourceId)) {
      this.relations.set(sourceId, []);
    }

    this.relations.get(sourceId).push({
      sourceId,
      sourceType,
      targetId,
      targetType,
      fechaCreacion: new Date(),
    });

    // También registrar trazabilidad inversa
    const traceKey = `${targetType}:${targetId}`;
    if (!this.trazabilidad.has(traceKey)) {
      this.trazabilidad.set(traceKey, []);
    }
    this.trazabilidad.get(traceKey).push({
      sourceId,
      sourceType,
    });
  }

  async validarRelacion(rel) {
    // Validar que ambos extremos existan
    const sourceExists = await this.existeEntidad(rel.sourceId, rel.sourceType);
    const targetExists = await this.existeEntidad(rel.targetId, rel.targetType);

    if (!sourceExists) {
      return {
        valida: false,
        error: `Entidad origen no existe: ${rel.sourceType} - ${rel.sourceId}`,
      };
    }

    if (!targetExists) {
      return {
        valida: false,
        error: `Entidad destino no existe: ${rel.targetType} - ${rel.targetId}`,
      };
    }

    return { valida: true };
  }

  async existeEntidad(id, tipo) {
    // Verificar en estructuras cargadas
    switch (tipo) {
      case 'orden_compra':
        return this.sheets.ordenesCompra?.some((oc) => oc.id === id || oc.numero === id);
      case 'distribuidor':
        return this.sheets.distribuidores?.some((d) => d.id === id || d.nombre === id);
      case 'cliente':
        return this.sheets.clientes?.some((c) => c.id === id || c.nombre === id);
      case 'banco':
        return (
          Object.keys(this.sheets.bancos || {}).includes(id) ||
          Object.keys(this.sheets.bancos || {}).some((b) => this.generarId(b) === id || b === id)
        );
      default:
        return true; // Asumir que existe si no podemos verificar
    }
  }

  determinarEstadoOC(row) {
    const deuda = Number(row[10]) || 0;
    const pago = Number(row[9]) || 0;

    if (deuda === 0 && pago > 0) return 'Completado';
    if (deuda > 0) return 'Pendiente';
    return 'Activo';
  }

  determinarTipoGYA(origen) {
    const origenLower = String(origen).toLowerCase();

    if (origenLower.includes('gasto')) return 'gasto';
    if (origenLower.includes('abono')) return 'abono';
    if (origenLower.includes('valle') || origenLower.includes('monte')) return 'transferencia';

    return 'movimiento';
  }

  determinarEstadoCliente(pendiente) {
    if (pendiente === 0) return 'Al día';
    if (pendiente < 0) return 'A favor';
    if (pendiente > 500000) return 'Moroso';
    if (pendiente > 100000) return 'Atención';
    return 'Pendiente';
  }

  detectarEstructuraBanco(headerRow) {
    // Estructura base
    const estructura = {
      ingresos: {
        fecha: 0,
        cliente: 1,
        monto: 2,
        tc: 3,
        pesos: 4,
        destino: 5,
        concepto: 6,
        observaciones: 7,
      },
      gastos: {
        fecha: 10,
        origen: 11,
        monto: 12,
        tc: 13,
        pesos: 14,
        destino: 15,
        concepto: 16,
        observaciones: 17,
      },
    };

    // Ajustar basándose en headers reales
    if (headerRow) {
      // Buscar columnas específicas
      headerRow.forEach((header, _idx) => {
        const headerStr = String(header || '').toLowerCase();

        if (headerStr.includes('ingreso')) estructura.ingresos.monto = _idx;
        if (headerStr.includes('gasto') && _idx > 5) estructura.gastos.monto = _idx;
      });
    }

    return estructura;
  }

  calcularMetricasControl(ventas, gastos) {
    const totalVentas = ventas.reduce((sum, v) => sum + v.ingreso, 0);
    const totalGastos = gastos.reduce((sum, g) => sum + g.valor, 0);

    return {
      totalVentas,
      totalGastos,
      utilidadNeta: totalVentas - totalGastos,
      margenUtilidad: totalVentas > 0 ? ((totalVentas - totalGastos) / totalVentas) * 100 : 0,
      ticketPromedio: ventas.length > 0 ? totalVentas / ventas.length : 0,
    };
  }

  calcularMetricasAlmacen(ingresos, salidas, stock) {
    const rotacion = ingresos > 0 ? salidas / ingresos : 0;
    const diasInventario = rotacion > 0 ? 365 / rotacion : 0;

    return {
      rotacion,
      diasInventario,
      nivelStock: stock < 50 ? 'Crítico' : stock < 100 ? 'Bajo' : 'Normal',
      eficiencia: rotacion > 0.9 ? 'Alta' : rotacion > 0.7 ? 'Media' : 'Baja',
    };
  }

  calcularMetricasBanco(ingresos, gastos, rfActual) {
    return {
      balance: rfActual,
      flujoNeto: ingresos - gastos,
      liquidez: rfActual > 0 ? 'Positiva' : 'Negativa',
      saludFinanciera:
        rfActual > 100000
          ? 'Excelente'
          : rfActual > 0
            ? 'Buena'
            : rfActual > -100000
              ? 'Atención'
              : 'Crítica',
    };
  }

  calcularCapitalTotal() {
    let total = 0;

    // Sumar RF de control maestro
    total += this.sheets.controlMaestro?.rfActual || 0;

    // Sumar RF de todos los bancos
    for (const banco of Object.values(this.sheets.bancos || {})) {
      total += banco.rfActual || 0;
    }

    return total;
  }

  calcularCarteraPorCobrar() {
    return (
      this.sheets.clientes?.reduce((sum, c) => sum + (c.pendiente > 0 ? c.pendiente : 0), 0) || 0
    );
  }

  calcularCuentasPorPagar() {
    return this.sheets.distribuidores?.reduce((sum, d) => sum + d.pendiente, 0) || 0;
  }
}

// Exportar para uso en el sistema
export default QuantumExcelImporter;
