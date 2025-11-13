import { collection, doc, writeBatch } from 'firebase/firestore';
import Papa from 'papaparse';

import { db } from '@/lib/firebase';

export type MissionType =
  | 'bovedaMonte'
  | 'azteca'
  | 'banorte'
  | 'santander'
  | 'bbva'
  | 'hsbc'
  | 'scotiabank'
  | 'ventas'
  | 'clientes'
  | 'almacen';

interface ParsedRow {
  [key: string]: string | number;
}

interface RefineryResult {
  success: boolean;
  processedRows: number;
  errors: string[];
  data: any[];
}

/**
 * Refina datos de CSV complejos (con estructura de reporte visual)
 * y los transforma en documentos Firestore limpios
 */
export class DataRefinery {
  /**
   * Procesa un archivo CSV según la misión especificada
   */
  static async processCSV(file: File, mission: MissionType): Promise<RefineryResult> {
    return new Promise((resolve) => {
      Papa.parse(file, {
        complete: async (results) => {
          try {
            const refined = this.refineByMission(results.data as string[][], mission);
            const uploaded = await this.uploadToFirestore(refined, mission);
            resolve({
              success: true,
              processedRows: refined.length,
              errors: [],
              data: refined,
            });
          } catch (error: any) {
            resolve({
              success: false,
              processedRows: 0,
              errors: [error.message],
              data: [],
            });
          }
        },
        error: (error) => {
          resolve({
            success: false,
            processedRows: 0,
            errors: [error.message],
            data: [],
          });
        },
      });
    });
  }

  /**
   * Refina los datos según la estructura específica de cada banco/módulo
   */
  private static refineByMission(rawData: string[][], mission: MissionType): any[] {
    switch (mission) {
      case 'bovedaMonte':
        return this.refineBovedaMonte(rawData);
      case 'azteca':
      case 'banorte':
      case 'santander':
      case 'bbva':
      case 'hsbc':
      case 'scotiabank':
        return this.refineBancoGenerico(rawData, mission);
      case 'ventas':
        return this.refineVentas(rawData);
      case 'clientes':
        return this.refineClientes(rawData);
      case 'almacen':
        return this.refineAlmacen(rawData);
      default:
        return [];
    }
  }

  /**
   * Refina datos de Bóveda Monte (Ingresos a la izquierda, Gastos a la derecha)
   */
  private static refineBovedaMonte(rawData: string[][]): any[] {
    const result: any[] = [];
    let inIngresosSection = false;
    let inGastosSection = false;

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];

      // Detectar secciones
      if (row[0]?.includes('INGRESOS')) {
        inIngresosSection = true;
        inGastosSection = false;
        continue;
      }
      if (row[7]?.includes('GASTOS')) {
        inGastosSection = true;
        inIngresosSection = false;
        continue;
      }

      // Saltar filas vacías
      if (!row[0] && !row[7]) continue;

      // Procesar INGRESOS (columnas 0-6)
      if (inIngresosSection && row[0] && row[0] !== 'Fecha') {
        const monto = parseFloat(row[2]?.replace(/[$,]/g, '') || '0');
        if (monto > 0) {
          result.push({
            tipo: 'ingreso',
            banco: 'monte',
            fecha: this.parseDate(row[0]),
            concepto: row[1] || 'Sin concepto',
            monto,
            metodoPago: row[3] || 'Efectivo',
            responsable: row[4] || 'Sin asignar',
            notas: row[5] || '',
            timestamp: new Date().toISOString(),
          });
        }
      }

      // Procesar GASTOS (columnas 7-13)
      if (inGastosSection && row[7] && row[7] !== 'Fecha') {
        const monto = parseFloat(row[9]?.replace(/[$,]/g, '') || '0');
        if (monto > 0) {
          result.push({
            tipo: 'gasto',
            banco: 'monte',
            fecha: this.parseDate(row[7]),
            concepto: row[8] || 'Sin concepto',
            monto,
            categoria: row[10] || 'General',
            proveedor: row[11] || 'Sin proveedor',
            notas: row[12] || '',
            timestamp: new Date().toISOString(),
          });
        }
      }
    }

    return result;
  }

  /**
   * Refina datos de bancos genéricos (estructura similar a Bóveda Monte)
   */
  private static refineBancoGenerico(rawData: string[][], bancoId: string): any[] {
    // Similar a refineBovedaMonte pero con el ID del banco correspondiente
    return this.refineBovedaMonte(rawData).map((item) => ({
      ...item,
      banco: bancoId,
    }));
  }

  /**
   * Refina datos de ventas
   */
  private static refineVentas(rawData: string[][]): any[] {
    const result: any[] = [];
    let headerFound = false;

    for (const row of rawData) {
      if (!headerFound) {
        if (row[0]?.toLowerCase().includes('fecha') || row[0]?.toLowerCase().includes('folio')) {
          headerFound = true;
        }
        continue;
      }

      if (!row[0]) continue;

      const total = parseFloat(row[4]?.replace(/[$,]/g, '') || '0');
      if (total > 0) {
        result.push({
          fecha: this.parseDate(row[0]),
          folio: row[1] || `V-${Date.now()}`,
          cliente: row[2] || 'Público General',
          productos: row[3] || '',
          total,
          metodoPago: row[5] || 'Efectivo',
          vendedor: row[6] || 'Sistema',
          status: 'completada',
          timestamp: new Date().toISOString(),
        });
      }
    }

    return result;
  }

  /**
   * Refina datos de clientes
   */
  private static refineClientes(rawData: string[][]): any[] {
    const result: any[] = [];
    let headerFound = false;

    for (const row of rawData) {
      if (!headerFound) {
        if (row[0]?.toLowerCase().includes('nombre') || row[0]?.toLowerCase().includes('cliente')) {
          headerFound = true;
        }
        continue;
      }

      if (!row[0]) continue;

      result.push({
        nombre: row[0],
        telefono: row[1] || '',
        email: row[2] || '',
        direccion: row[3] || '',
        rfc: row[4] || '',
        tipo: row[5] || 'Regular',
        creditoLimite: parseFloat(row[6]?.replace(/[$,]/g, '') || '0'),
        creditoDisponible: parseFloat(row[6]?.replace(/[$,]/g, '') || '0'),
        status: 'activo',
        fechaRegistro: this.parseDate(row[7]) || new Date().toISOString(),
        timestamp: new Date().toISOString(),
      });
    }

    return result;
  }

  /**
   * Refina datos de almacén
   */
  private static refineAlmacen(rawData: string[][]): any[] {
    const result: any[] = [];
    let headerFound = false;

    for (const row of rawData) {
      if (!headerFound) {
        if (
          row[0]?.toLowerCase().includes('producto') ||
          row[0]?.toLowerCase().includes('código')
        ) {
          headerFound = true;
        }
        continue;
      }

      if (!row[0]) continue;

      const cantidad = parseInt(row[2] || '0');
      const precioCompra = parseFloat(row[3]?.replace(/[$,]/g, '') || '0');
      const precioVenta = parseFloat(row[4]?.replace(/[$,]/g, '') || '0');

      result.push({
        codigo: row[0],
        nombre: row[1] || 'Sin nombre',
        cantidad,
        precioCompra,
        precioVenta,
        categoria: row[5] || 'General',
        proveedor: row[6] || 'Sin proveedor',
        ubicacion: row[7] || 'A1',
        stockMinimo: parseInt(row[8] || '5'),
        status: cantidad > 0 ? 'disponible' : 'agotado',
        ultimaActualizacion: new Date().toISOString(),
        timestamp: new Date().toISOString(),
      });
    }

    return result;
  }

  /**
   * Sube los datos refinados a Firestore
   */
  private static async uploadToFirestore(data: any[], mission: MissionType): Promise<void> {
    const batch = writeBatch(db);
    const collectionMap: Record<MissionType, string> = {
      bovedaMonte: 'bancos/monte/transacciones',
      azteca: 'bancos/azteca/transacciones',
      banorte: 'bancos/banorte/transacciones',
      santander: 'bancos/santander/transacciones',
      bbva: 'bancos/bbva/transacciones',
      hsbc: 'bancos/hsbc/transacciones',
      scotiabank: 'bancos/scotiabank/transacciones',
      ventas: 'ventas',
      clientes: 'clientes',
      almacen: 'almacen',
    };

    const collectionPath = collectionMap[mission];
    const collectionRef = collection(db, collectionPath);

    let batchCount = 0;
    for (const item of data) {
      const docRef = doc(collectionRef);
      batch.set(docRef, item);
      batchCount++;

      // Firestore limita batches a 500 operaciones
      if (batchCount >= 450) {
        await batch.commit();
        batchCount = 0;
      }
    }

    if (batchCount > 0) {
      await batch.commit();
    }
  }

  /**
   * Parsea fechas en diversos formatos
   */
  private static parseDate(dateStr: string): string {
    if (!dateStr) return new Date().toISOString();

    // Intentar varios formatos comunes
    const formats = [
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // DD/MM/YYYY
      /(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
      /(\d{1,2})-(\d{1,2})-(\d{4})/, // DD-MM-YYYY
    ];

    for (const format of formats) {
      const match = dateStr.match(format);
      if (match) {
        const [, p1, p2, p3] = match;
        // Intentar crear fecha (ajustar según formato)
        const date = new Date(`${p3}-${p2}-${p1}`);
        if (!isNaN(date.getTime())) {
          return date.toISOString();
        }
      }
    }

    return new Date().toISOString();
  }
}
