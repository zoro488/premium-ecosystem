/**
 * 💾 DATA MANAGEMENT UTILITIES
 * Backup, restore, import, and export operations for FlowDistributor
 * Extracted from FlowDistributor.jsx (lines 1609-1900+)
 */

/**
 * Creates a full data backup and downloads it as JSON
 * @param {Object} data - All application data to backup
 * @param {Function} notificationCallback - Callback to show notifications
 */
export function createBackup(data, notificationCallback) {
  const backupData = {
    version: '3.0.0',
    fecha: new Date().toISOString(),
    datos: {
      bancos: data.bancos,
      ordenesCompra: data.ordenesCompra,
      distribuidores: data.distribuidores,
      ventas: data.ventas,
      clientes: data.clientes,
      almacen: data.almacen,
    },
  };

  const dataStr = JSON.stringify(backupData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `flowdistributor-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  if (notificationCallback) {
    notificationCallback('Respaldo creado exitosamente', 'success');
  }
}

/**
 * Restores data from a backup file
 * @param {Event} event - File input change event
 * @param {Object} setters - Object containing all state setter functions
 * @param {Function} notificationCallback - Callback to show notifications
 * @param {Function} onClose - Callback to close modal after successful restore
 */
export async function restoreBackup(event, setters, notificationCallback, onClose) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const backupData = JSON.parse(text);

    if (!backupData.datos) {
      if (notificationCallback) {
        notificationCallback('Archivo de respaldo inválido', 'error');
      }
      return;
    }

    // Restaurar todos los datos
    if (backupData.datos.bancos && setters.setBancos) {
      setters.setBancos(backupData.datos.bancos);
    }
    if (backupData.datos.ordenesCompra && setters.setOrdenesCompra) {
      setters.setOrdenesCompra(backupData.datos.ordenesCompra);
    }
    if (backupData.datos.distribuidores && setters.setDistribuidores) {
      setters.setDistribuidores(backupData.datos.distribuidores);
    }
    if (backupData.datos.ventas && setters.setVentas) {
      setters.setVentas(backupData.datos.ventas);
    }
    if (backupData.datos.clientes && setters.setClientes) {
      setters.setClientes(backupData.datos.clientes);
    }
    if (backupData.datos.almacen && setters.setAlmacen) {
      setters.setAlmacen(backupData.datos.almacen);
    }

    if (notificationCallback) {
      notificationCallback('Datos restaurados exitosamente', 'success');
    }
    if (onClose) {
      onClose();
    }
  } catch (error) {
    // console.error('Error al restaurar respaldo:', error);
    if (notificationCallback) {
      notificationCallback('Error al restaurar el respaldo', 'error');
    }
  }
}

/**
 * Imports data from Excel with enterprise-grade validation
 * @param {Object} setters - Object containing all state setter functions
 * @param {Function} notificationCallback - Callback to show notifications
 * @param {Object} actionHistory - Action history manager
 * @param {Function} onClose - Callback to close modal after successful import
 */
export async function importFromExcel(setters, notificationCallback, actionHistory, onClose) {
  // 1. Confirmación inicial
  const confirmImport = confirm(
    '📊 IMPORTAR DATOS DESDE EXCEL (ENTERPRISE MODE)\n\n' +
      'Se realizará una validación profunda en 3 capas:\n' +
      '✓ Validación de tipos de datos (Zod)\n' +
      '✓ Validación de lógica de negocio\n' +
      '✓ Validación de consistencia cruzada\n\n' +
      'Datos esperados:\n' +
      '• ~83 Ventas\n' +
      '• ~29 Clientes\n' +
      '• ~9 Órdenes de Compra\n' +
      '• ~6 Distribuidores\n' +
      '• ~9 Entradas + ~80 Salidas de Almacén\n' +
      '• ~6 Bancos con transacciones\n\n' +
      '¿Continuar con validación y importación?'
  );

  if (!confirmImport) return;

  try {
    if (notificationCallback) {
      notificationCallback('🔍 Cargando y validando datos del Excel...', 'info');
    }

    // 2. Cargar el JSON generado desde el Excel
    const response = await fetch('/excel_data.json');
    if (!response.ok) {
      throw new Error('No se pudo cargar el archivo de datos del Excel');
    }
    const excelData = await response.json();

    // Validación básica de estructura
    if (!excelData.ventas || !excelData.clientes || !excelData.bancos) {
      throw new Error('El archivo de datos del Excel tiene una estructura inválida');
    }

    // 3. Importar validador dinámicamente
    const { ExcelImportValidator } = await import('../../../utils/excel-import-validator.js');
    const validator = new ExcelImportValidator();

    // 4. Ejecutar validación enterprise
    const validationResult = await validator.validateAll(excelData);

    // 5. Mostrar advertencias si existen
    if (validationResult.warnings.length > 0) {
      const warningMsg =
        `⚠️ SE ENCONTRARON ${validationResult.warnings.length} ADVERTENCIAS:\n\n` +
        validationResult.warnings
          .slice(0, 5)
          .map((w, i) => `${i + 1}. [${w.type}] ${w.message}`)
          .join('\n') +
        (validationResult.warnings.length > 5
          ? `\n\n... y ${validationResult.warnings.length - 5} más`
          : '') +
        '\n\nEstas advertencias NO impiden la importación, pero deberías revisarlas.\n\n¿Continuar con la importación?';

      const continueWithWarnings = confirm(warningMsg);
      if (!continueWithWarnings) return;
    }

    // 6. Verificar errores críticos
    if (!validationResult.success) {
      const errorMsg =
        `❌ SE ENCONTRARON ${validationResult.errors.length} ERRORES CRÍTICOS:\n\n` +
        validationResult.errors
          .slice(0, 3)
          .map((e, i) => `${i + 1}. [${e.type}] ${e.message}`)
          .join('\n') +
        (validationResult.errors.length > 3
          ? `\n\n... y ${validationResult.errors.length - 3} más`
          : '') +
        '\n\n❌ NO SE PUEDE IMPORTAR con errores críticos.\n\nSe generará un reporte detallado para corrección.';

      alert(errorMsg);
      if (notificationCallback) {
        notificationCallback('❌ Importación cancelada por errores críticos', 'error');
      }

      // Descargar reporte de validación
      const report = validator.generateReport();
      downloadJSON(report, `validation-report-${Date.now()}.json`);

      return;
    }

    // 7. Usar datos VALIDADOS y TRANSFORMADOS
    const { data: transformedData, stats } = validationResult;

    // 8. Importar datos validados
    if (transformedData.bancos && setters.setBancos) {
      // Asegurar estructura completa de bancos
      const bancosImportados = {};
      Object.keys(transformedData.bancos).forEach((key) => {
        if (transformedData.bancos[key]) {
          bancosImportados[key] = {
            capitalActual: transformedData.bancos[key].capitalActual || 0,
            historico:
              transformedData.bancos[key].historico ||
              transformedData.bancos[key].capitalActual ||
              0,
            registros: transformedData.bancos[key].registros || [],
            ingresos: transformedData.bancos[key].ingresos || [],
            gastos: transformedData.bancos[key].gastos || [],
            transferencias: transformedData.bancos[key].transferencias || [],
          };
        }
      });
      setters.setBancos(bancosImportados);
    }

    if (transformedData.ordenesCompra && setters.setOrdenesCompra) {
      setters.setOrdenesCompra(transformedData.ordenesCompra);
    }
    if (transformedData.distribuidores && setters.setDistribuidores) {
      setters.setDistribuidores(transformedData.distribuidores);
    }
    if (transformedData.ventas && setters.setVentas) {
      setters.setVentas(transformedData.ventas);
    }
    if (transformedData.clientes && setters.setClientes) {
      setters.setClientes(transformedData.clientes);
    }
    if (transformedData.almacen && setters.setAlmacen) {
      setters.setAlmacen(transformedData.almacen);
    }

    // 9. Registrar acción con métricas enterprise
    if (actionHistory) {
      actionHistory.addAction('Importación Enterprise desde Excel', {
        ventas: stats.ventasValidadas,
        clientes: stats.clientesValidados,
        ordenes: stats.ordenesValidadas,
        distribuidores: transformedData.distribuidores?.length || 0,
        bancos: stats.bancosValidados,
        warnings: validationResult.warnings.length,
        timestamp: new Date().toISOString(),
        validationPassed: true,
      });
    }

    // 10. Guardar reporte de importación
    localStorage.setItem('lastImportReport', JSON.stringify(validator.generateReport()));

    if (notificationCallback) {
      notificationCallback(
        `✅ IMPORTACIÓN ENTERPRISE COMPLETADA\n` +
          `📊 ${stats.ventasValidadas} ventas | ` +
          `👥 ${stats.clientesValidados} clientes | ` +
          `📦 ${stats.ordenesValidadas} OC | ` +
          `🏦 ${stats.bancosValidados} bancos\n` +
          `⚠️ ${validationResult.warnings.length} advertencias (ver consola)`,
        'success'
      );
    }

    // Mostrar resumen en consola
    if (validationResult.warnings.length > 0) {
      console.group('📊 REPORTE DE IMPORTACIÓN EXCEL');
      // console.log('Estadísticas:', stats);
      // console.log('Advertencias:', validationResult.warnings);
      console.groupEnd();
    }

    if (onClose) {
      onClose();
    }
  } catch (error) {
    // console.error('Error al importar desde Excel:', error);
    if (notificationCallback) {
      notificationCallback(`❌ Error crítico al importar: ${error.message}`, 'error');
    }
  }
}

/**
 * Clears all application data after confirmation
 * @param {Object} setters - Object containing all state setter functions
 * @param {Function} notificationCallback - Callback to show notifications
 */
export function clearAllData(setters, notificationCallback) {
  if (
    confirm(
      '⚠️ ¿Estás seguro de que quieres borrar todos los datos?\n\n' +
        'Esto eliminará:\n' +
        '- Todos los bancos y sus transacciones\n' +
        '- Todas las ventas\n' +
        '- Todas las órdenes de compra\n' +
        '- Todos los clientes y distribuidores\n' +
        '- Todo el inventario\n\n' +
        'Esta acción NO se puede deshacer.'
    )
  ) {
    // Resetear todos los bancos a 0 con estructura completa
    const emptyBankStructure = {
      capitalActual: 0,
      historico: 0,
      registros: [],
      gastos: [],
      transferencias: [],
      ingresos: [],
    };

    if (setters.setBancos) {
      setters.setBancos({
        bovedaMonte: { ...emptyBankStructure },
        utilidades: { ...emptyBankStructure },
        fletes: { ...emptyBankStructure },
        bancoCuscatlan: { ...emptyBankStructure },
        bancoAgricola: { ...emptyBankStructure },
        bancoAmerica: { ...emptyBankStructure },
      });
    }

    // Resetear otros datos
    if (setters.setOrdenesCompra) setters.setOrdenesCompra([]);
    if (setters.setDistribuidores) setters.setDistribuidores([]);
    if (setters.setVentas) setters.setVentas([]);
    if (setters.setClientes) setters.setClientes([]);
    if (setters.setAlmacen) setters.setAlmacen([]);

    if (notificationCallback) {
      notificationCallback('Todos los datos han sido eliminados', 'success');
    }
  }
}

/**
 * Helper function to download JSON data as a file
 * @param {Object} data - Data to download
 * @param {string} filename - Name of the file
 */
function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Example usage in FlowDistributor.jsx:
 *
 * import { createBackup, restoreBackup, importFromExcel, clearAllData } from './utils/dataManagement';
 *
 * // In component:
 * const handleBackup = () => {
 *   createBackup({
 *     bancos,
 *     ordenesCompra,
 *     distribuidores,
 *     ventas,
 *     clientes,
 *     almacen
 *   }, showNotification);
 * };
 *
 * const handleRestore = (event) => {
 *   restoreBackup(
 *     event,
 *     { setBancos, setOrdenesCompra, setDistribuidores, setVentas, setClientes, setAlmacen },
 *     showNotification,
 *     () => setShowSettingsModal(false)
 *   );
 * };
 *
 * const handleImport = () => {
 *   importFromExcel(
 *     { setBancos, setOrdenesCompra, setDistribuidores, setVentas, setClientes, setAlmacen },
 *     showNotification,
 *     actionHistory,
 *     () => setShowSettingsModal(false)
 *   );
 * };
 */
