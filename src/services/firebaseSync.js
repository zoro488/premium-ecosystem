/**
 * ============================================
 * FIREBASE SYNC SERVICE
 * Servicio de sincronización entre JSON local y Firebase
 * ============================================
 */
import { analyticsManager, firestoreManager } from '../config/firebase';

/**
 * Clase para sincronizar datos entre JSON local y Firebase
 */
export class FirebaseSyncService {
  constructor() {
    this.syncing = false;
    this.lastSync = null;
    this.syncCallbacks = [];
  }

  /**
   * Registrar callback para eventos de sincronización
   */
  onSync(callback) {
    this.syncCallbacks.push(callback);
    return () => {
      this.syncCallbacks = this.syncCallbacks.filter((cb) => cb !== callback);
    };
  }

  /**
   * Notificar a los callbacks
   */
  notifyCallbacks(event, data) {
    this.syncCallbacks.forEach((cb) => cb({ event, data, timestamp: new Date() }));
  }

  /**
   * Importar datos del JSON local a Firebase
   */
  async importFromJSON(jsonData) {
    if (this.syncing) {
      throw new Error('Sync already in progress');
    }

    try {
      this.syncing = true;
      this.notifyCallbacks('sync_start', { direction: 'json_to_firebase' });
       // console.log('🚀 Iniciando importación a Firebase...');
      // Estadísticas
      const stats = {
        ventas: 0,
        compras: 0,
        distribuidores: 0,
        clientes: 0,
        bancos: 0,
        almacen: 0,
        movimientos: 0,
        errores: [],
      };

      // Importar Ventas
      if (jsonData.ventas && Array.isArray(jsonData.ventas)) {
        for (const venta of jsonData.ventas) {
          try {
            await firestoreManager.ventas.set(venta.id, venta);
            stats.ventas++;
          } catch (error) {
            stats.errores.push({ tipo: 'venta', id: venta.id, error: error.message });
          }
        }
      }

      // Importar Compras
      if (jsonData.compras && Array.isArray(jsonData.compras)) {
        for (const compra of jsonData.compras) {
          try {
            await firestoreManager.compras.set(compra.id, compra);
            stats.compras++;
          } catch (error) {
            stats.errores.push({ tipo: 'compra', id: compra.id, error: error.message });
          }
        }
      }

      // Importar Distribuidores
      if (jsonData.distribuidores && Array.isArray(jsonData.distribuidores)) {
        for (const distribuidor of jsonData.distribuidores) {
          try {
            await firestoreManager.distribuidores.set(distribuidor.id, distribuidor);
            stats.distribuidores++;
          } catch (error) {
            stats.errores.push({
              tipo: 'distribuidor',
              id: distribuidor.id,
              error: error.message,
            });
          }
        }
      }

      // Importar Clientes
      if (jsonData.clientes && Array.isArray(jsonData.clientes)) {
        for (const cliente of jsonData.clientes) {
          try {
            await firestoreManager.clientes.set(cliente.id, cliente);
            stats.clientes++;
          } catch (error) {
            stats.errores.push({ tipo: 'cliente', id: cliente.id, error: error.message });
          }
        }
      }

      // Importar Bancos
      if (jsonData.bancos && Array.isArray(jsonData.bancos)) {
        for (const banco of jsonData.bancos) {
          try {
            await firestoreManager.bancos.set(banco.id, banco);
            stats.bancos++;
          } catch (error) {
            stats.errores.push({ tipo: 'banco', id: banco.id, error: error.message });
          }
        }
      }

      // Importar Almacén
      if (jsonData.almacen && Array.isArray(jsonData.almacen)) {
        for (const almacen of jsonData.almacen) {
          try {
            await firestoreManager.almacen.set(almacen.id, almacen);
            stats.almacen++;
          } catch (error) {
            stats.errores.push({ tipo: 'almacen', id: almacen.id, error: error.message });
          }
        }
      }

      // Importar Movimientos
      if (jsonData.movimientos && Array.isArray(jsonData.movimientos)) {
        for (const movimiento of jsonData.movimientos) {
          try {
            await firestoreManager.movimientos.set(movimiento.id, movimiento);
            stats.movimientos++;
          } catch (error) {
            stats.errores.push({ tipo: 'movimiento', id: movimiento.id, error: error.message });
          }
        }
      }

      this.lastSync = new Date();
      this.notifyCallbacks('sync_complete', { stats, direction: 'json_to_firebase' });

      // Log analytics
      analyticsManager.logEvent('firebase_import', {
        total_records: Object.values(stats).reduce(
          (a, b) => (typeof b === 'number' ? a + b : a),
          0
        ),
        errors: stats.errores.length,
      });
       // console.log('✅ Importación completada:', stats);
      return stats;
    } catch (error) {
      this.notifyCallbacks('sync_error', { error: error.message });
      // console.error('❌ Error en importación:', error);
      throw error;
    } finally {
      this.syncing = false;
    }
  }

  /**
   * Exportar datos de Firebase al JSON local
   */
  async exportToJSON() {
    if (this.syncing) {
      throw new Error('Sync already in progress');
    }

    try {
      this.syncing = true;
      this.notifyCallbacks('sync_start', { direction: 'firebase_to_json' });
       // console.log('📥 Iniciando exportación desde Firebase...');
      const data = {
        ventas: await firestoreManager.ventas.getAll(),
        compras: await firestoreManager.compras.getAll(),
        distribuidores: await firestoreManager.distribuidores.getAll(),
        clientes: await firestoreManager.clientes.getAll(),
        bancos: await firestoreManager.bancos.getAll(),
        almacen: await firestoreManager.almacen.getAll(),
        movimientos: await firestoreManager.movimientos.getAll(),
        ultimaActualizacion: new Date().toISOString(),
        version: '2.0.0',
        estado: 'sincronizado',
      };

      // Calcular métricas
      data.metricasFinancieras = this.calculateMetrics(data);
      data.resumen = this.calculateResumen(data);

      this.lastSync = new Date();
      this.notifyCallbacks('sync_complete', { direction: 'firebase_to_json' });
       // console.log('✅ Exportación completada');
      return data;
    } catch (error) {
      this.notifyCallbacks('sync_error', { error: error.message });
      // console.error('❌ Error en exportación:', error);
      throw error;
    } finally {
      this.syncing = false;
    }
  }

  /**
   * Sincronización bidireccional
   */
  async syncBidirectional(localData) {
    try {
      this.notifyCallbacks('sync_start', { direction: 'bidirectional' });

      // Primero importar datos locales a Firebase
      await this.importFromJSON(localData);

      // Luego obtener datos actualizados de Firebase
      const firebaseData = await this.exportToJSON();

      this.notifyCallbacks('sync_complete', { direction: 'bidirectional' });

      return firebaseData;
    } catch (error) {
      this.notifyCallbacks('sync_error', { error: error.message });
      throw error;
    }
  }

  /**
   * Calcular métricas financieras
   */
  calculateMetrics(data) {
    const capitalTotal = data.bancos.reduce((sum, b) => sum + (b.saldoActual || 0), 0);
    const inventarioActual = data.almacen.reduce((sum, a) => sum + (a.stockActual || 0), 0);
    const carteraPorCobrar = data.ventas.reduce((sum, v) => sum + (v.adeudo || 0), 0);
    const cuentasPorPagar = data.compras.reduce((sum, c) => sum + (c.deuda || 0), 0);
    const utilidadTotal = data.ventas.reduce((sum, v) => sum + (v.totalUtilidades || 0), 0);
    const costoTotalInventario = data.compras.reduce((sum, c) => sum + (c.costoTotal || 0), 0);
    const ventasTotales = data.ventas.reduce((sum, v) => sum + (v.totalVenta || 0), 0);
    const comprasTotales = data.compras.reduce((sum, c) => sum + (c.costoTotal || 0), 0);

    return {
      capitalTotal,
      inventarioActual,
      carteraPorCobrar,
      cuentasPorPagar,
      utilidadTotal,
      costoTotalInventario,
      ventasTotales,
      comprasTotales,
    };
  }

  /**
   * Calcular resumen
   */
  calculateResumen(data) {
    return {
      ordenesCompra: data.compras.length,
      distribuidores: data.distribuidores.length,
      ventasLocales: data.ventas.length,
      gastosAbonos: 0, // Implementar según necesidad
      clientes: data.clientes.length,
      bancos: data.bancos.length,
      ingresosAlmacen: data.almacen.reduce((sum, a) => sum + (a.totalIngresos || 0), 0),
      salidasAlmacen: data.almacen.reduce((sum, a) => sum + (a.totalSalidas || 0), 0),
      movimientosBancarios: data.movimientos.length,
    };
  }

  /**
   * Obtener estado de sincronización
   */
  getSyncStatus() {
    return {
      syncing: this.syncing,
      lastSync: this.lastSync,
    };
  }
}

// Instancia global
export const firebaseSyncService = new FirebaseSyncService();

export default firebaseSyncService;
