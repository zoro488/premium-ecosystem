import React, { useCallback, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Database, FileText, Loader2, Upload, Zap } from 'lucide-react';

import { ChronosButton, ChronosCard } from '@/components/chronos-ui';
import { DataRefinery, MissionType } from '@/services/migration/data-refinery.service';

interface MigrationLog {
  id: string;
  mission: MissionType;
  fileName: string;
  status: 'processing' | 'success' | 'error';
  processedRows: number;
  errors: string[];
  timestamp: Date;
}

const MISSIONS: { id: MissionType; label: string; icon: string; description: string }[] = [
  { id: 'bovedaMonte', label: 'Bóveda Monte', icon: '🏔️', description: 'Ingresos y Gastos' },
  { id: 'azteca', label: 'Banco Azteca', icon: '🏛️', description: 'Transacciones bancarias' },
  { id: 'banorte', label: 'Banorte', icon: '🏦', description: 'Operaciones financieras' },
  { id: 'santander', label: 'Santander', icon: '🔴', description: 'Movimientos bancarios' },
  { id: 'bbva', label: 'BBVA', icon: '💙', description: 'Gestión financiera' },
  { id: 'hsbc', label: 'HSBC', icon: '🔺', description: 'Operaciones bancarias' },
  { id: 'scotiabank', label: 'Scotiabank', icon: '🍁', description: 'Transacciones' },
  { id: 'ventas', label: 'Ventas', icon: '💰', description: 'Registro de ventas' },
  { id: 'clientes', label: 'Clientes', icon: '👥', description: 'Base de clientes' },
  { id: 'almacen', label: 'Almacén', icon: '📦', description: 'Inventario de productos' },
];

export default function MigrationTerminal() {
  const [selectedMission, setSelectedMission] = useState<MissionType | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [logs, setLogs] = useState<MigrationLog[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (!selectedMission) {
        alert('Selecciona una misión antes de importar');
        return;
      }

      const files = Array.from(e.dataTransfer.files);
      const csvFiles = files.filter((f) => f.name.endsWith('.csv'));

      if (csvFiles.length === 0) {
        alert('Solo se aceptan archivos .csv');
        return;
      }

      await processFiles(csvFiles);
    },
    [selectedMission]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!selectedMission) {
        alert('Selecciona una misión antes de importar');
        return;
      }

      const files = Array.from(e.target.files || []);
      await processFiles(files);
    },
    [selectedMission]
  );

  const processFiles = async (files: File[]) => {
    if (!selectedMission) return;

    setIsProcessing(true);

    for (const file of files) {
      const logId = `${Date.now()}-${file.name}`;
      const newLog: MigrationLog = {
        id: logId,
        mission: selectedMission,
        fileName: file.name,
        status: 'processing',
        processedRows: 0,
        errors: [],
        timestamp: new Date(),
      };

      setLogs((prev) => [newLog, ...prev]);

      try {
        const result = await DataRefinery.processCSV(file, selectedMission);

        setLogs((prev) =>
          prev.map((log) =>
            log.id === logId
              ? {
                  ...log,
                  status: result.success ? 'success' : 'error',
                  processedRows: result.processedRows,
                  errors: result.errors,
                }
              : log
          )
        );
      } catch (error: any) {
        setLogs((prev) =>
          prev.map((log) =>
            log.id === logId
              ? {
                  ...log,
                  status: 'error',
                  errors: [error.message],
                }
              : log
          )
        );
      }
    }

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-chronos-cyan to-chronos-purple flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Terminal de Migración</h1>
            <p className="text-gray-400">Sistema de Ingesta de Datos • Chronos OS</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de misiones */}
        <div className="lg:col-span-1">
          <ChronosCard>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-chronos-cyan" />
              <h2 className="text-xl font-bold text-white">Seleccionar Misión</h2>
            </div>
            <div className="space-y-2">
              {MISSIONS.map((mission) => (
                <button
                  key={mission.id}
                  onClick={() => setSelectedMission(mission.id)}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    selectedMission === mission.id
                      ? 'bg-gradient-to-r from-chronos-cyan to-chronos-purple shadow-lg shadow-chronos-cyan/50'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{mission.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{mission.label}</div>
                      <div className="text-xs text-gray-400">{mission.description}</div>
                    </div>
                    {selectedMission === mission.id && (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </ChronosCard>
        </div>

        {/* Zona de drop y logs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Drop Zone */}
          <ChronosCard>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-12 transition-all ${
                isDragging
                  ? 'border-chronos-cyan bg-chronos-cyan/10'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <div className="text-center">
                <motion.div
                  animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                  className="inline-block mb-4"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-chronos-cyan to-chronos-purple flex items-center justify-center mx-auto">
                    {isProcessing ? (
                      <Loader2 className="w-10 h-10 text-white animate-spin" />
                    ) : (
                      <Upload className="w-10 h-10 text-white" />
                    )}
                  </div>
                </motion.div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  {selectedMission
                    ? 'Arrastra tus archivos CSV aquí'
                    : 'Selecciona una misión primero'}
                </h3>
                <p className="text-gray-400 mb-6">
                  {selectedMission
                    ? 'o haz clic para seleccionar archivos'
                    : 'Elige una misión del panel izquierdo'}
                </p>

                {selectedMission && (
                  <label>
                    <input
                      type="file"
                      multiple
                      accept=".csv"
                      onChange={handleFileInput}
                      className="hidden"
                      disabled={isProcessing}
                    />
                    <ChronosButton variant="primary" disabled={isProcessing} as="span">
                      <FileText className="w-4 h-4" />
                      Seleccionar Archivos
                    </ChronosButton>
                  </label>
                )}
              </div>
            </div>
          </ChronosCard>

          {/* Logs de migración */}
          {logs.length > 0 && (
            <ChronosCard>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-chronos-cyan" />
                Historial de Migraciones
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                <AnimatePresence>
                  {logs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-4 rounded-lg border ${
                        log.status === 'success'
                          ? 'bg-emerald-500/10 border-emerald-500/50'
                          : log.status === 'error'
                            ? 'bg-red-500/10 border-red-500/50'
                            : 'bg-blue-500/10 border-blue-500/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {log.status === 'processing' && (
                          <Loader2 className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0 mt-0.5" />
                        )}
                        {log.status === 'success' && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        )}
                        {log.status === 'error' && (
                          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-white truncate">
                              {log.fileName}
                            </span>
                            <span className="text-xs text-gray-400">
                              {log.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400">
                            Misión: <span className="text-chronos-cyan">{log.mission}</span>
                            {log.processedRows > 0 && (
                              <> • {log.processedRows} registros procesados</>
                            )}
                          </div>
                          {log.errors.length > 0 && (
                            <div className="mt-2 text-xs text-red-400">{log.errors.join(', ')}</div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ChronosCard>
          )}
        </div>
      </div>
    </div>
  );
}
