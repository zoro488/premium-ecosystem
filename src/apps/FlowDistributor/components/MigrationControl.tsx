/**
 * 🔄 CONTROL DE MIGRACIÓN - Visible en todos los componentes
 * Permite cargar datos iniciales desde JSON a Firestore
 */

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Database,
  Eye,
  Loader2,
  Trash2,
  Upload,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  checkMigrationStatus,
  clearAllData,
  migrateAllData,
  type MigrationProgress,
  type MigrationResult
} from '../services/migration-complete.service';

interface MigrationControlProps {
  className?: string;
  compact?: boolean; // Versión compacta para mostrar en paneles
}

export default function MigrationControl({ className = '', compact = false }: MigrationControlProps) {
  const [migrationStatus, setMigrationStatus] = useState<MigrationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<MigrationProgress | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [hasMigrated, setHasMigrated] = useState(false);
  const [collections, setCollections] = useState<Record<string, number>>({});

  // Verificar estado al cargar
  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const status = await checkMigrationStatus();
    setHasMigrated(status.total > 0);
    setCollections(status.collections);
  };

  const handleMigrate = async () => {
    setIsLoading(true);
    setMigrationStatus(null);

    const result = await migrateAllData((prog) => {
      setProgress(prog);
    });

    setMigrationStatus(result);
    setIsLoading(false);

    // Actualizar estado
    await checkStatus();

    // Auto-cerrar después de 5 segundos si fue exitoso
    if (result.success) {
      setTimeout(() => {
        setMigrationStatus(null);
      }, 5000);
    }
  };

  const handleClear = async () => {
    if (!confirm('⚠️ ¿Estás seguro? Esto eliminará TODOS los datos de Firestore.')) {
      return;
    }

    setIsLoading(true);
    await clearAllData();
    setIsLoading(false);

    alert('✅ Todos los datos han sido eliminados');
    await checkStatus();
  };

  // Versión compacta (para mostrar en paneles)
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-2 ${className}`}
      >
        {/* Indicador de estado */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
          <Database className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-medium text-white/70">
            {hasMigrated ? (
              <span className="text-green-400">Datos cargados</span>
            ) : (
              <span className="text-amber-400">Sin datos</span>
            )}
          </span>
        </div>

        {/* Botón de migración */}
        {!hasMigrated && (
          <button
            onClick={handleMigrate}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-medium hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Cargando...
              </>
            ) : (
              <>
                <Upload className="w-3 h-3" />
                Cargar datos
              </>
            )}
          </button>
        )}
      </motion.div>
    );
  }

  // Versión completa (para Dashboard)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Control de Datos</h3>
            <p className="text-sm text-white/60">Migración JSON → Firestore</p>
          </div>
        </div>

        {/* Estado actual */}
        <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 ${
          hasMigrated
            ? 'bg-green-500/10 border border-green-500/20'
            : 'bg-amber-500/10 border border-amber-500/20'
        }`}>
          {hasMigrated ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">Datos Cargados</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-400">Sin Datos</span>
            </>
          )}
        </div>
      </div>

      {/* Resumen de colecciones */}
      {hasMigrated && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-cyan-400">{collections.ordenesCompra || 0}</div>
            <div className="text-xs text-white/60 mt-1">Órdenes</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-blue-400">{collections.ventas || 0}</div>
            <div className="text-xs text-white/60 mt-1">Ventas</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-purple-400">{collections.clientes || 0}</div>
            <div className="text-xs text-white/60 mt-1">Clientes</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-pink-400">{collections.distribuidores || 0}</div>
            <div className="text-xs text-white/60 mt-1">Distribuidores</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-green-400">{collections.bancos || 0}</div>
            <div className="text-xs text-white/60 mt-1">Bancos</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-orange-400">{collections.almacen || 0}</div>
            <div className="text-xs text-white/60 mt-1">Almacén</div>
          </div>
        </div>
      )}

      {/* Progreso de migración */}
      <AnimatePresence>
        {isLoading && progress && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{progress.stage}</span>
                <span className="text-sm text-white/60">
                  {progress.progress}/{progress.total}
                </span>
              </div>

              {/* Barra de progreso */}
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(progress.progress / progress.total) * 100}%` }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                />
              </div>

              <p className="text-xs text-white/50 mt-2">{progress.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resultado */}
      <AnimatePresence>
        {migrationStatus && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className={`rounded-lg p-4 border ${
              migrationStatus.success
                ? 'bg-green-500/10 border-green-500/20'
                : 'bg-red-500/10 border-red-500/20'
            }`}>
              <div className="flex items-start gap-3">
                {migrationStatus.success ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                )}

                <div className="flex-1">
                  <p className={`font-medium mb-1 ${
                    migrationStatus.success ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {migrationStatus.message}
                  </p>

                  {/* Detalles de colecciones */}
                  <div className="text-xs text-white/70 space-y-1 mt-2">
                    <div className="grid grid-cols-2 gap-2">
                      {/* Dashboard */}
                      <div className="col-span-2 text-cyan-400 font-medium">Dashboard:</div>
                      <div>✓ Saldos Actuales: {migrationStatus.collections.dashboard_saldos || 0}</div>
                      <div>✓ Totales: {migrationStatus.collections.dashboard_totales || 0}</div>

                      {/* Generales */}
                      <div className="col-span-2 mt-2 text-cyan-400 font-medium">Generales:</div>
                      <div>✓ Órdenes: {migrationStatus.collections.ordenesCompra || 0}</div>
                      <div>✓ Ventas: {migrationStatus.collections.ventas || 0}</div>
                      <div>✓ Distribuidores: {migrationStatus.collections.distribuidores || 0}</div>
                      <div>✓ Clientes: {migrationStatus.collections.clientes || 0}</div>

                      {/* Bancos */}
                      <div className="col-span-2 mt-2 text-cyan-400 font-medium">Bancos:</div>
                      <div>• Azteca: {(migrationStatus.collections.azteca_gastos || 0) + (migrationStatus.collections.azteca_ingresos || 0)}</div>
                      <div>• Bóveda Monte: {(migrationStatus.collections.bovedaMonte_gastos || 0) + (migrationStatus.collections.bovedaMonte_ingresos || 0)}</div>
                      <div>• Bóveda USA: {(migrationStatus.collections.bovedaUSA_gastos || 0) + (migrationStatus.collections.bovedaUSA_ingresos || 0)}</div>
                      <div>• Fletes: {(migrationStatus.collections.fletes_gastos || 0) + (migrationStatus.collections.fletes_ingresos || 0)}</div>
                      <div>• Leftie: {(migrationStatus.collections.leftie_gastos || 0) + (migrationStatus.collections.leftie_ingresos || 0)}</div>
                      <div>• Profit: {(migrationStatus.collections.profit_gastos || 0) + (migrationStatus.collections.profit_ingresos || 0)}</div>
                      <div>• Utilidades: {(migrationStatus.collections.utilidades_gastos || 0) + (migrationStatus.collections.utilidades_ingresos || 0)}</div>

                      {/* Almacén */}
                      <div className="col-span-2 mt-2 text-cyan-400 font-medium">Almacén:</div>
                      <div>• Ingresos: {migrationStatus.collections.almacen_ingresos || 0}</div>
                      <div>• Salidas: {migrationStatus.collections.almacen_salidas || 0}</div>
                      <div>• Órdenes: {migrationStatus.collections.almacen_ordenes || 0}</div>
                      <div>• Stock: {migrationStatus.collections.almacen_stock || 0}</div>
                    </div>
                  </div>

                  {/* Errores */}
                  {migrationStatus.errors.length > 0 && (
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="text-xs text-white/50 hover:text-white/70 mt-2 flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      Ver {migrationStatus.errors.length} errores
                    </button>
                  )}

                  {showDetails && migrationStatus.errors.length > 0 && (
                    <div className="mt-2 text-xs text-white/60 space-y-1 max-h-32 overflow-y-auto">
                      {migrationStatus.errors.map((error, idx) => (
                        <div key={idx} className="text-red-400/70">• {error}</div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setMigrationStatus(null)}
                  className="text-white/40 hover:text-white/70 transition-colors"
                  title="Cerrar mensaje"
                  aria-label="Cerrar mensaje de migración"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Acciones */}
      <div className="flex gap-3">
        <button
          onClick={handleMigrate}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Migrando...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              {hasMigrated ? 'Re-migrar Datos' : 'Cargar Datos Iniciales'}
            </>
          )}
        </button>

        {hasMigrated && (
          <button
            onClick={handleClear}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-medium hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Limpiar
          </button>
        )}
      </div>

      {/* Nota informativa */}
      <div className="mt-4 px-3 py-2 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
        <p className="text-xs text-cyan-400/70">
          💡 Datos cargados desde <span className="font-mono text-cyan-400">BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json</span> con fallback a archivos manuales
        </p>
      </div>
    </motion.div>
  );
}
