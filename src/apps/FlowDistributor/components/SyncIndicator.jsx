/**
 * = SYNC INDICATOR - Indicador de Estado de Sincronizaci�n con Firestore
 * Muestra estado online/offline, sincronizando, �ltima sync, y controles
 */
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Clock, Cloud, CloudOff, RefreshCw, X, Zap, ZapOff } from 'lucide-react';

import { useFlowStore } from '../../../stores/flowStore';

export const SyncIndicator = ({ collapsed = false }) => {
  const [showDetails, setShowDetails] = useState(false);
  const syncState = useFlowStore((state) => state.syncState);
  const syncToFirestore = useFlowStore((state) => state.syncToFirestore);
  const startRealtimeSync = useFlowStore((state) => state.startRealtimeSync);
  const stopRealtimeSync = useFlowStore((state) => state.stopRealtimeSync);

  const handleManualSync = async () => {
    await syncToFirestore();
  };

  const handleToggleRealtime = () => {
    if (syncState.isRealtimeActive) {
      stopRealtimeSync();
    } else {
      startRealtimeSync();
    }
  };

  const formatLastSync = () => {
    if (!syncState.lastSyncTime) return 'Nunca';

    const now = Date.now();
    const diff = now - syncState.lastSyncTime;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return 'Ahora mismo';
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    return 'Hace m�s de 1 d�a';
  };

  const getStatusColor = () => {
    if (!syncState.isOnline) return 'text-gray-400';
    if (syncState.error) return 'text-red-400';
    if (syncState.isSyncing) return 'text-blue-400';
    return 'text-green-400';
  };

  const getStatusIcon = () => {
    if (!syncState.isOnline) return CloudOff;
    if (syncState.isSyncing) return RefreshCw;
    if (syncState.error) return X;
    return Cloud;
  };

  const StatusIcon = getStatusIcon();

  return (
    <div className={`relative ${collapsed ? 'flex justify-center' : ''}`}>
      {/* Main Status Button */}
      <motion.button
        onClick={() => setShowDetails(!showDetails)}
        className={`${
          collapsed ? 'w-12 h-12' : 'w-full px-3 py-2'
        } flex items-center gap-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/10`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        title={collapsed ? `Estado: ${syncState.isOnline ? 'Online' : 'Offline'}` : ''}
      >
        <div className="relative">
          <StatusIcon
            className={`w-4 h-4 ${getStatusColor()} ${syncState.isSyncing ? 'animate-spin' : ''}`}
          />
          {/* Indicador de realtime activo */}
          {syncState.isRealtimeActive && (
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>

        {!collapsed && (
          <>
            <div className="flex-1 text-left">
              <p className="text-xs text-white/80 font-medium">
                {syncState.isOnline ? 'En l�nea' : 'Sin conexi�n'}
              </p>
              <p className="text-[10px] text-white/50">{formatLastSync()}</p>
            </div>

            {syncState.isSyncing && (
              <motion.div
                className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </>
        )}
      </motion.button>

      {/* Details Panel */}
      <AnimatePresence>
        {showDetails && !collapsed && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute bottom-full left-0 right-0 mb-2 p-3 rounded-lg bg-black/90 backdrop-blur-xl border border-white/20 shadow-2xl"
            style={{ zIndex: 9999 }}
          >
            {/* Estado */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/60">Estado</span>
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      syncState.isOnline ? 'bg-green-400' : 'bg-red-400'
                    }`}
                  />
                  <span className="text-xs text-white">
                    {syncState.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">�ltima sync</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-white/40" />
                  <span className="text-xs text-white">{formatLastSync()}</span>
                </div>
              </div>
            </div>

            {/* Error */}
            {syncState.error && (
              <div className="mb-3 p-2 rounded bg-red-500/20 border border-red-500/40">
                <p className="text-xs text-red-400">{syncState.error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              {/* Manual Sync Button */}
              <motion.button
                onClick={handleManualSync}
                disabled={syncState.isSyncing || !syncState.isOnline}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  syncState.isSyncing || !syncState.isOnline
                    ? 'bg-white/5 text-white/30 cursor-not-allowed'
                    : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                }`}
                whileHover={!syncState.isSyncing && syncState.isOnline ? { scale: 1.02 } : {}}
                whileTap={!syncState.isSyncing && syncState.isOnline ? { scale: 0.98 } : {}}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncState.isSyncing ? 'animate-spin' : ''}`} />
                {syncState.isSyncing ? 'Sincronizando...' : 'Sincronizar Ahora'}
              </motion.button>

              {/* Realtime Sync Toggle */}
              <motion.button
                onClick={handleToggleRealtime}
                disabled={!syncState.isOnline}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  !syncState.isOnline
                    ? 'bg-white/5 text-white/30 cursor-not-allowed'
                    : syncState.isRealtimeActive
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                }`}
                whileHover={syncState.isOnline ? { scale: 1.02 } : {}}
                whileTap={syncState.isOnline ? { scale: 0.98 } : {}}
              >
                {syncState.isRealtimeActive ? (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    Tiempo Real: ON
                  </>
                ) : (
                  <>
                    <ZapOff className="w-3.5 h-3.5" />
                    Tiempo Real: OFF
                  </>
                )}
              </motion.button>
            </div>

            {/* Info */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-[10px] text-white/40 text-center">
                {syncState.isRealtimeActive
                  ? ' Los datos se sincronizan autom�ticamente'
                  : 'Activa tiempo real para sync autom�tica'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SyncIndicator;
