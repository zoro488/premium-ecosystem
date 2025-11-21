/**
 * 🔬 VALIDADOR ENTERPRISE DE IMPORTACIÓN EXCEL
 *
 * Este módulo implementa validación en 3 capas:
 * 1. Validación de tipos (Zod schemas)
 * 2. Validación de lógica de negocio
 * 3. Validación de consistencia cruzada
 *
 * Detecta y reporta:
 * - Errores críticos que impiden importación
 * - Advertencias de inconsistencias menores
 * - Métricas de calidad de datos
 *
 * @module excel-import-validator
 * @author FlowDistributor Enterprise Team
 * @version 2.0.0
 */
import {
  almacenExcelSchema,
  bancoExcelSchema,
  clienteExcelSchema,
  ordenCompraExcelSchema,
  ventaExcelSchema,
} from '../validation/excel-schemas.js';

/**
 * Clase principal de validación de importación Excel
 */
export class ExcelImportValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.transformedData = null;
    this.stats = {
      ventasProcesadas: 0,
      ventasValidadas: 0,
      clientesProcesados: 0,
      clientesValidados: 0,
      ordenesProcesadas: 0,
      ordenesValidadas: 0,
      bancosProcesados: 0,
      bancosValidados: 0,
    };
  }

  /**
   * Valida y transforma datos completos del Excel
   * @param {object} excelData - Datos desde excel_data.json
   * @returns {Promise<object>} - Resultado de validación
   */
  async validateAll(excelData) {
    // console.log('🔍 Iniciando validación enterprise de datos Excel...');
    this.errors = [];
    this.warnings = [];

    // CAPA 1: Validación de tipos con Zod
    const ventasResult = await this.validateVentas(excelData.ventas || []);
    const clientesResult = await this.validateClientes(excelData.clientes || []);
    const ordenesResult = await this.validateOrdenes(excelData.ordenesCompra || []);
    const bancosResult = await this.validateBancos(excelData.bancos || {});
    const almacenResult = await this.validateAlmacen(
      excelData.almacen || { ingresos: [], salidas: [] }
    );

    // Copiar distribuidores sin validación adicional
    const distribuidoresResult = excelData.distribuidores || [];

    // CAPA 2 y 3: Validación de lógica de negocio y consistencia cruzada
    await this.crossValidation({
      ventas: ventasResult,
      clientes: clientesResult,
      ordenes: ordenesResult,
      bancos: bancosResult,
      almacen: almacenResult,
      distribuidores: distribuidoresResult,
    });

    this.transformedData = {
      ventas: ventasResult,
      clientes: clientesResult,
      ordenesCompra: ordenesResult,
      bancos: bancosResult,
      almacen: almacenResult,
      distribuidores: distribuidoresResult,
    };
    // console.log('✅ Validación completada:', {
    //   errores: this.errors.length,
    //   advertencias: this.warnings.length,
    //   stats: this.stats,
    // });
    return {
      success: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      data: this.transformedData,
      stats: this.stats,
    };
  }

  /**
   * Valida lista de ventas con schema Zod
   * @param {Array} ventas - Array de ventas desde Excel
   * @returns {Array} - Ventas validadas y transformadas
   */
  async validateVentas(ventas) {
    const validated = [];
    this.stats.ventasProcesadas = ventas.length;

    for (let i = 0; i < ventas.length; i++) {
      try {
        const result = ventaExcelSchema.parse(ventas[i]);
        validated.push(result);
        this.stats.ventasValidadas++;
      } catch (error) {
        this.errors.push({
          type: 'VENTA_VALIDATION',
          severity: 'ERROR',
          index: i,
          id: ventas[i]?.id || `venta-${i}`,
          message: `Error validando venta: ${error.message}`,
          details: error.errors || [error.message],
        });
      }
    }
    // console.log(`✓ Ventas: ${validated.length}/${ventas.length} validadas`);
    return validated;
  }

  /**
   * Valida lista de clientes con schema Zod
   * @param {Array} clientes - Array de clientes desde Excel
   * @returns {Array} - Clientes validados y transformados
   */
  async validateClientes(clientes) {
    const validated = [];
    this.stats.clientesProcesados = clientes.length;

    for (let i = 0; i < clientes.length; i++) {
      try {
        const result = clienteExcelSchema.parse(clientes[i]);
        validated.push(result);
        this.stats.clientesValidados++;

        // Advertencia si tiene saldo a favor
        if (result.saldoFavor && result.saldoFavor > 0) {
          this.warnings.push({
            type: 'SALDO_FAVOR_DETECTADO',
            severity: 'WARNING',
            entity: 'cliente',
            id: result.id,
            nombre: result.nombre,
            message: `Cliente tiene saldo a favor de $${result.saldoFavor.toFixed(2)}`,
            recommendation: 'Verificar si el cliente pagó de más o si hay un error en los abonos',
          });
        }
      } catch (error) {
        this.errors.push({
          type: 'CLIENTE_VALIDATION',
          severity: 'ERROR',
          index: i,
          id: clientes[i]?.id || `cliente-${i}`,
          message: `Error validando cliente: ${error.message}`,
          details: error.errors || [error.message],
        });
      }
    }
    // console.log(`✓ Clientes: ${validated.length}/${clientes.length} validados`);
    return validated;
  }

  /**
   * Valida lista de órdenes de compra con schema Zod
   * @param {Array} ordenes - Array de órdenes desde Excel
   * @returns {Array} - Órdenes validadas y transformadas
   */
  async validateOrdenes(ordenes) {
    const validated = [];
    this.stats.ordenesProcesadas = ordenes.length;

    for (let i = 0; i < ordenes.length; i++) {
      try {
        const result = ordenCompraExcelSchema.parse(ordenes[i]);
        validated.push(result);
        this.stats.ordenesValidadas++;
      } catch (error) {
        this.errors.push({
          type: 'ORDEN_VALIDATION',
          severity: 'ERROR',
          index: i,
          id: ordenes[i]?.id || `orden-${i}`,
          message: `Error validando orden de compra: ${error.message}`,
          details: error.errors || [error.message],
        });
      }
    }
    // console.log(`✓ Órdenes: ${validated.length}/${ordenes.length} validadas`);
    return validated;
  }

  /**
   * Valida objeto de bancos con schema Zod
   * @param {object} bancos - Objeto con datos de bancos
   * @returns {object} - Bancos validados y transformados
   */
  async validateBancos(bancos) {
    const validated = {};
    const bancoKeys = Object.keys(bancos);
    this.stats.bancosProcesados = bancoKeys.length;

    for (const bancoNombre of bancoKeys) {
      try {
        const result = bancoExcelSchema.parse(bancos[bancoNombre]);
        validated[bancoNombre] = result;
        this.stats.bancosValidados++;
      } catch (error) {
        this.errors.push({
          type: 'BANCO_VALIDATION',
          severity: 'ERROR',
          banco: bancoNombre,
          message: `Error validando banco ${bancoNombre}: ${error.message}`,
          details: error.errors || [error.message],
        });
      }
    }

    console.log(`✓ Bancos: ${Object.keys(validated).length}/${bancoKeys.length} validados`);
    return validated;
  }

  /**
   * Valida datos de almacén con schema Zod
   * @param {object} almacen - Datos de almacén
   * @returns {object} - Almacén validado
   */
  async validateAlmacen(almacen) {
    try {
      const result = almacenExcelSchema.parse(almacen);
      console.log(
        `✓ Almacén: validado (${result.ingresos.length} ingresos, ${result.salidas.length} salidas)`
      );
      return result;
    } catch (error) {
      this.errors.push({
        type: 'ALMACEN_VALIDATION',
        severity: 'ERROR',
        message: `Error validando almacén: ${error.message}`,
        details: error.errors || [error.message],
      });
      return { ingresos: [], salidas: [], stockActual: 0 };
    }
  }

  /**
   * Validación cruzada entre entidades (integridad referencial)
   * @param {object} data - Datos validados de todas las entidades
   */
  async crossValidation(data) {
    // console.log('🔍 Ejecutando validación cruzada...');
    // 1. Validar que todas las OC en ventas existan en órdenes de compra
    const ocIds = new Set(data.ordenes.map((o) => o.id));
    data.ventas.forEach((venta, _idx) => {
      if (venta.ocRelacionada && !ocIds.has(venta.ocRelacionada)) {
        this.warnings.push({
          type: 'MISSING_OC_REFERENCE',
          severity: 'WARNING',
          entity: 'venta',
          id: venta.id,
          cliente: venta.cliente,
          ocRelacionada: venta.ocRelacionada,
          message: `Venta referencia OC "${venta.ocRelacionada}" que no existe en órdenes de compra`,
          recommendation: 'Verificar si la OC fue eliminada o si hay un error en el ID',
        });
      }
    });

    // 2. Validar que todos los clientes en ventas existan en lista de clientes
    const clienteNames = new Set(data.clientes.map((c) => c.nombre));
    const ventasPorCliente = {};

    data.ventas.forEach((venta) => {
      if (!clienteNames.has(venta.cliente)) {
        this.warnings.push({
          type: 'MISSING_CLIENTE_REFERENCE',
          severity: 'WARNING',
          entity: 'venta',
          id: venta.id,
          cliente: venta.cliente,
          message: `Venta referencia cliente "${venta.cliente}" que no existe en lista de clientes`,
          recommendation: 'Se creará automáticamente al importar, pero verificar datos',
        });
      }

      // Acumular ventas por cliente para validación de adeudos
      if (!ventasPorCliente[venta.cliente]) {
        ventasPorCliente[venta.cliente] = {
          totalVentas: 0,
          totalAdeudos: 0,
          ventasPendientes: 0,
        };
      }
      ventasPorCliente[venta.cliente].totalVentas += venta.totalVenta;
      if (venta.estadoPago === 'pendiente') {
        ventasPorCliente[venta.cliente].totalAdeudos += venta.adeudo;
        ventasPorCliente[venta.cliente].ventasPendientes++;
      }
    });

    // 3. Validar balance de adeudos cliente vs ventas
    data.clientes.forEach((cliente) => {
      const ventasData = ventasPorCliente[cliente.nombre];
      if (!ventasData) {
        // Cliente sin ventas
        if (cliente.adeudo > 0) {
          this.warnings.push({
            type: 'CLIENTE_SIN_VENTAS_CON_ADEUDO',
            severity: 'WARNING',
            entity: 'cliente',
            id: cliente.id,
            nombre: cliente.nombre,
            adeudo: cliente.adeudo,
            message: `Cliente tiene adeudo de $${cliente.adeudo.toFixed(2)} pero no tiene ventas registradas`,
            recommendation: 'Verificar si el adeudo proviene de ventas antiguas no importadas',
          });
        }
        return;
      }

      const adeudoCalculado = ventasData.totalAdeudos;
      const adeudoDeclarado = cliente.adeudo > 0 ? cliente.adeudo : 0;
      const diferencia = Math.abs(adeudoCalculado - adeudoDeclarado);

      // Tolerancia de $1 para errores de redondeo
      if (diferencia > 1) {
        this.warnings.push({
          type: 'ADEUDO_MISMATCH',
          severity: 'WARNING',
          entity: 'cliente',
          id: cliente.id,
          nombre: cliente.nombre,
          adeudoCalculado: adeudoCalculado.toFixed(2),
          adeudoDeclarado: adeudoDeclarado.toFixed(2),
          diferencia: diferencia.toFixed(2),
          message: `Adeudo calculado ($${adeudoCalculado.toFixed(2)}) difiere del declarado ($${adeudoDeclarado.toFixed(2)})`,
          recommendation: 'Verificar cálculos de adeudos en Excel o si hay abonos no registrados',
        });
      }
    });

    // 4. Validar que distribuidores en órdenes existan
    const distribuidorNames = new Set(data.distribuidores.map((d) => d.nombre));
    data.ordenes.forEach((orden) => {
      if (!distribuidorNames.has(orden.distribuidor)) {
        this.warnings.push({
          type: 'MISSING_DISTRIBUIDOR_REFERENCE',
          severity: 'WARNING',
          entity: 'orden',
          id: orden.id,
          distribuidor: orden.distribuidor,
          message: `Orden referencia distribuidor "${orden.distribuidor}" que no existe en lista`,
          recommendation: 'Se creará automáticamente al importar',
        });
      }
    });

    // 5. Validar balance de ingresos/egresos bancarios vs capital actual
    for (const [bancoNombre, bancoData] of Object.entries(data.bancos)) {
      let totalIngresos = 0;
      let totalEgresos = 0;

      bancoData.registros.forEach((reg) => {
        if (reg.tipo === 'Ingreso') {
          totalIngresos += reg.monto;
        } else if (reg.tipo === 'Egreso') {
          totalEgresos += reg.monto;
        }
      });

      const balanceCalculado = totalIngresos - totalEgresos;
      const diferencia = Math.abs(balanceCalculado - bancoData.capitalActual);

      // Tolerancia mayor para bancos (pueden tener capital inicial)
      if (diferencia > 100) {
        this.warnings.push({
          type: 'BALANCE_BANCARIO_INCONSISTENTE',
          severity: 'WARNING',
          entity: 'banco',
          nombre: bancoNombre,
          capitalActual: bancoData.capitalActual.toFixed(2),
          balanceCalculado: balanceCalculado.toFixed(2),
          diferencia: diferencia.toFixed(2),
          message: `Balance calculado ($${balanceCalculado.toFixed(2)}) difiere del capital actual ($${bancoData.capitalActual.toFixed(2)})`,
          recommendation: 'Puede deberse a capital inicial o transferencias no registradas',
        });
      }
    }
    // console.log(`✓ Validación cruzada completada: ${this.warnings.length} advertencias`);
  }

  /**
   * Genera reporte detallado de validación
   * @returns {object} - Reporte completo
   */
  generateReport() {
    return {
      summary: {
        totalErrors: this.errors.length,
        totalWarnings: this.warnings.length,
        isValid: this.errors.length === 0,
        timestamp: new Date().toISOString(),
      },
      stats: this.stats,
      errors: this.errors,
      warnings: this.warnings,
      recommendations: this.generateRecommendations(),
    };
  }

  /**
   * Genera recomendaciones basadas en errores y advertencias
   * @returns {Array} - Lista de recomendaciones
   */
  generateRecommendations() {
    const recommendations = [];

    // Recomendaciones basadas en errores
    const errorTypes = {};
    this.errors.forEach((error) => {
      errorTypes[error.type] = (errorTypes[error.type] || 0) + 1;
    });

    for (const [type, count] of Object.entries(errorTypes)) {
      if (type === 'VENTA_VALIDATION' && count > 5) {
        recommendations.push({
          priority: 'HIGH',
          message: `${count} ventas tienen errores de validación. Revisar el Excel y corregir los datos antes de importar.`,
        });
      }
      if (type === 'CLIENTE_VALIDATION' && count > 0) {
        recommendations.push({
          priority: 'HIGH',
          message: `${count} clientes tienen errores de validación. Verificar campos de adeudo y cálculos.`,
        });
      }
    }

    // Recomendaciones basadas en advertencias
    const warningTypes = {};
    this.warnings.forEach((warning) => {
      warningTypes[warning.type] = (warningTypes[warning.type] || 0) + 1;
    });

    for (const [type, count] of Object.entries(warningTypes)) {
      if (type === 'ADEUDO_MISMATCH' && count > 3) {
        recommendations.push({
          priority: 'MEDIUM',
          message: `${count} clientes tienen diferencias entre adeudo calculado y declarado. Revisar abonos y cálculos en Excel.`,
        });
      }
      if (type === 'MISSING_OC_REFERENCE' && count > 0) {
        recommendations.push({
          priority: 'LOW',
          message: `${count} ventas referencian OCs inexistentes. Verificar si las OCs fueron eliminadas o hay errores en IDs.`,
        });
      }
    }

    if (recommendations.length === 0) {
      recommendations.push({
        priority: 'INFO',
        message: '¡Excelente! Todos los datos están correctos y listos para importar.',
      });
    }

    return recommendations;
  }
}

export default ExcelImportValidator;
