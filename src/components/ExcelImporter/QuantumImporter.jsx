/**
 * ============================================
 * QUANTUM EXCEL IMPORTER - COMPONENTE UI
 * Interfaz avanzada para importación quirúrgica
 * ============================================
 */
import { useCallback, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  FileSpreadsheet,
  TrendingUp,
  Upload,
  XCircle,
} from 'lucide-react';

import QuantumExcelImporter from '../../services/quantumExcelImporter';

const QuantumImporter = () => {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, importing, success, error
  const [reporte, setReporte] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = useCallback((message, type = 'info') => {
    setLogs((prev) => [...prev, { message, type, timestamp: new Date() }]);
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
        addLog('❌ Por favor selecciona un archivo Excel válido (.xlsx o .xls)', 'error');
        return;
      }

      setFile(selectedFile);
      addLog(`📁 Archivo seleccionado: ${selectedFile.name}`, 'success');
      setStatus('ready');
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setStatus('importing');
    setProgress(0);
    setLogs([]);

    addLog('🚀 Iniciando importación quirúrgica...', 'info');

    try {
      // Crear instancia del importador
      const importer = new QuantumExcelImporter();

      // Simular progreso
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      // Ejecutar importación
      addLog('📊 Analizando estructura del Excel...', 'info');
      const resultado = await importer.importarExcel(file);

      clearInterval(progressInterval);
      setProgress(100);

      // Mostrar logs del proceso
      addLog(`✅ Procesados ${resultado.stats.procesados} registros`, 'success');
      addLog(`🔗 Creadas ${resultado.stats.relacionesCreadas} relaciones`, 'success');

      if (resultado.warnings.length > 0) {
        resultado.warnings.forEach((warning) => {
          addLog(`⚠️  ${warning}`, 'warning');
        });
      }

      if (resultado.errores.length > 0) {
        resultado.errores.forEach((error) => {
          addLog(`❌ ${error.tipo}: ${error.mensaje}`, 'error');
        });
      }

      setReporte(resultado);
      setStatus(resultado.exito ? 'success' : 'error');

      if (resultado.exito) {
        addLog('🎉 Importación completada exitosamente!', 'success');
      } else {
        addLog('⚠️  Importación completada con errores', 'warning');
      }
    } catch (error) {
      // console.error('Error en importación:', error);
      addLog(`❌ Error crítico: ${error.message}`, 'error');
      setStatus('error');
      setProgress(0);
    } finally {
      setImporting(false);
    }
  };

  const resetImport = () => {
    setFile(null);
    setImporting(false);
    setProgress(0);
    setStatus('idle');
    setReporte(null);
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <FileSpreadsheet className="w-12 h-12 text-blue-400" />
            Quantum Excel Importer
          </h1>
          <p className="text-gray-300 text-lg">
            Importación quirúrgica con trazabilidad total y relaciones automáticas
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Upload className="w-6 h-6" />
              Cargar Archivo
            </h2>

            {/* File Input */}
            <div
              className={`
                relative border-2 border-dashed rounded-xl p-12 text-center
                transition-all duration-300
                ${file ? 'border-green-400 bg-green-400/10' : 'border-gray-400 hover:border-blue-400 hover:bg-white/5'}
                ${importing ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              `}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const droppedFile = e.dataTransfer.files[0];
                handleFileChange({ target: { files: [droppedFile] } });
              }}
            >
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={importing}
              />

              {file ? (
                <div className="text-green-400">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-xl font-semibold">{file.name}</p>
                  <p className="text-sm text-gray-400 mt-2">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              ) : (
                <div className="text-gray-400">
                  <Upload className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-xl font-semibold">Arrastra tu archivo Excel aquí</p>
                  <p className="text-sm mt-2">o haz clic para seleccionar</p>
                  <p className="text-xs mt-4 text-gray-500">Formatos soportados: .xlsx, .xls</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleImport}
                disabled={!file || importing}
                className={`
                  flex-1 py-4 px-6 rounded-xl font-semibold text-lg
                  transition-all duration-300 transform
                  ${
                    !file || importing
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
                  }
                  text-white
                `}
              >
                {importing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Activity className="w-5 h-5 animate-spin" />
                    Importando... {progress.toFixed(0)}%
                  </span>
                ) : (
                  'Importar Datos'
                )}
              </button>

              {(status === 'success' || status === 'error') && (
                <button
                  onClick={resetImport}
                  className="px-6 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-all"
                >
                  Nuevo
                </button>
              )}
            </div>

            {/* Progress Bar */}
            {importing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Logs Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6" />
              Registro de Actividad
            </h2>

            <div className="bg-black/30 rounded-xl p-4 h-96 overflow-y-auto font-mono text-sm">
              <AnimatePresence>
                {logs.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Esperando inicio de importación...
                  </p>
                ) : (
                  logs.map((log, index) => (
                    <motion.div
                      key={`item-${index}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`
                        py-2 px-3 mb-2 rounded
                        ${log.type === 'error' ? 'bg-red-500/20 text-red-300' : ''}
                        ${log.type === 'warning' ? 'bg-yellow-500/20 text-yellow-300' : ''}
                        ${log.type === 'success' ? 'bg-green-500/20 text-green-300' : ''}
                        ${log.type === 'info' ? 'text-gray-300' : ''}
                      `}
                    >
                      <span className="text-gray-500 mr-2">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                      {log.message}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Reporte Section */}
        <AnimatePresence>
          {reporte && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.3 }}
              className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Reporte de Importación
              </h2>

              {/* Status */}
              <div
                className={`
                p-6 rounded-xl mb-6 flex items-center gap-4
                ${reporte.exito ? 'bg-green-500/20 border border-green-500/50' : 'bg-yellow-500/20 border border-yellow-500/50'}
              `}
              >
                {reporte.exito ? (
                  <>
                    <CheckCircle className="w-12 h-12 text-green-400" />
                    <div>
                      <h3 className="text-2xl font-bold text-green-400">Importación Exitosa</h3>
                      <p className="text-gray-300">
                        Todos los datos fueron importados correctamente
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-12 h-12 text-yellow-400" />
                    <div>
                      <h3 className="text-2xl font-bold text-yellow-400">
                        Importación con Advertencias
                      </h3>
                      <p className="text-gray-300">Algunos datos requieren atención</p>
                    </div>
                  </>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard label="Registros Procesados" value={reporte.stats.procesados} icon="📊" />
                <StatCard label="Exitosos" value={reporte.stats.exitosos} icon="✅" color="green" />
                <StatCard
                  label="Relaciones"
                  value={reporte.stats.relacionesCreadas}
                  icon="🔗"
                  color="blue"
                />
                <StatCard
                  label="Advertencias"
                  value={reporte.warnings.length}
                  icon="⚠️"
                  color="yellow"
                />
              </div>

              {/* Resumen */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-black/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Entidades Importadas</h4>
                  <div className="space-y-2 text-sm">
                    <ResumenItem label="Órdenes de Compra" value={reporte.resumen.ordenesCompra} />
                    <ResumenItem label="Distribuidores" value={reporte.resumen.distribuidores} />
                    <ResumenItem label="Ventas Locales" value={reporte.resumen.ventasLocales} />
                    <ResumenItem label="Gastos/Abonos" value={reporte.resumen.gastosAbonos} />
                    <ResumenItem label="Clientes" value={reporte.resumen.clientes} />
                    <ResumenItem label="Bancos" value={reporte.resumen.bancos} />
                  </div>
                </div>

                <div className="bg-black/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Movimientos</h4>
                  <div className="space-y-2 text-sm">
                    <ResumenItem label="Ingresos Almacén" value={reporte.resumen.ingresosAlmacen} />
                    <ResumenItem label="Salidas Almacén" value={reporte.resumen.salidasAlmacen} />
                    <ResumenItem
                      label="Movimientos Bancarios"
                      value={reporte.resumen.movimientosBancarios}
                    />
                  </div>
                </div>

                <div className="bg-black/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Métricas Financieras</h4>
                  <div className="space-y-2 text-sm">
                    <ResumenItem
                      label="Capital Total"
                      value={`$${reporte.metricas.capitalTotal.toLocaleString()}`}
                    />
                    <ResumenItem
                      label="Inventario Actual"
                      value={`${reporte.metricas.inventarioActual} unidades`}
                    />
                    <ResumenItem
                      label="Cartera por Cobrar"
                      value={`$${reporte.metricas.carteraPorCobrar.toLocaleString()}`}
                    />
                    <ResumenItem
                      label="Cuentas por Pagar"
                      value={`$${reporte.metricas.cuentasPorPagar.toLocaleString()}`}
                    />
                  </div>
                </div>
              </div>

              {/* Errores y Warnings */}
              {(reporte.errores.length > 0 || reporte.warnings.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reporte.errores.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                        <XCircle className="w-5 h-5" />
                        Errores ({reporte.errores.length})
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {reporte.errores.map((error, _idx) => (
                          <div key={_idx} className="text-sm text-red-300 bg-black/20 p-3 rounded">
                            <span className="font-semibold">{error.tipo}:</span> {error.mensaje}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {reporte.warnings.length > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Advertencias ({reporte.warnings.length})
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {reporte.warnings.map((warning, _idx) => (
                          <div
                            key={_idx}
                            className="text-sm text-yellow-300 bg-black/20 p-3 rounded"
                          >
                            {warning}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Componentes auxiliares
const StatCard = ({ label, value, icon, color = 'gray' }) => {
  const colorClasses = {
    green: 'from-green-500/20 to-green-600/20 border-green-500/50',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/50',
    yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/50',
    gray: 'from-gray-500/20 to-gray-600/20 border-gray-500/50',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">{value.toLocaleString()}</div>
      <div className="text-sm text-gray-300">{label}</div>
    </div>
  );
};

const ResumenItem = ({ label, value }) => (
  <div className="flex justify-between items-center text-gray-300">
    <span>{label}:</span>
    <span className="font-semibold text-white">{value}</span>
  </div>
);

export default QuantumImporter;
