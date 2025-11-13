/**
 * 🚨 ANOMALIES ALERT - Sistema de Alertas de Anomalías
 *
 * Detecta y muestra anomalías en transacciones en tiempo real
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnomalyDetection } from '../../services/ai/useAI';
import type { AnomalyDetection } from '../../services/ai/aiService';

interface AnomaliesAlertProps {
  transacciones: Array<{
    id: string;
    tipo: string;
    monto: number;
    fecha: string;
    banco: string;
    categoria?: string;
  }>;
  autoDetect?: boolean;
  threshold?: number;
  onAnomalyClick?: (anomaly: AnomalyDetection) => void;
}

export function AnomaliesAlert({
  transacciones,
  autoDetect = true,
  threshold = 0.6,
  onAnomalyClick,
}: AnomaliesAlertProps) {
  const { anomalies, isDetecting, error, criticalCount, highCount, detect, clearAnomalies } =
    useAnomalyDetection({ threshold });

  // Auto-detectar al cambiar transacciones
  useEffect(() => {
    if (autoDetect && transacciones.length > 0) {
      detect(transacciones);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transacciones.length, autoDetect]);

  if (isDetecting) {
    return (
      <motion.div
        className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Analizando {transacciones.length} transacciones...
          </p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">❌</span>
          <div className="flex-1">
            <p className="font-medium text-red-600 dark:text-red-400">Error en detección</p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
            <button
              onClick={() => detect(transacciones)}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (anomalies.length === 0) {
    return (
      <motion.div
        className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div className="flex-1">
            <p className="font-medium text-green-600 dark:text-green-400">
              Sin anomalías detectadas
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              Todas las transacciones parecen normales
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* HEADER CON STATS */}
      <motion.div
        className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-4 text-white shadow-lg"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚨</span>
            <div>
              <h3 className="font-bold text-lg">Anomalías Detectadas</h3>
              <p className="text-sm opacity-90">
                {anomalies.length} transacción{anomalies.length !== 1 ? 'es' : ''} sospechosa
                {anomalies.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {criticalCount > 0 && (
              <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
                <p className="text-2xl font-bold">{criticalCount}</p>
                <p className="text-xs">Críticas</p>
              </div>
            )}
            {highCount > 0 && (
              <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
                <p className="text-2xl font-bold">{highCount}</p>
                <p className="text-xs">Altas</p>
              </div>
            )}
            <button
              onClick={clearAnomalies}
              className="bg-white/20 hover:bg-white/30 rounded-lg px-3 py-2 text-sm transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>
      </motion.div>

      {/* LISTA DE ANOMALÍAS */}
      <div className="space-y-3">
        <AnimatePresence>
          {anomalies.map((anomaly, index) => (
            <AnomalyCard
              key={anomaly.transaccionId}
              anomaly={anomaly}
              index={index}
              onClick={onAnomalyClick}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================================================
// ANOMALY CARD
// ============================================================================

interface AnomalyCardProps {
  anomaly: AnomalyDetection;
  index: number;
  onClick?: (anomaly: AnomalyDetection) => void;
}

function AnomalyCard({ anomaly, index, onClick }: AnomalyCardProps) {
  const getSeverityStyles = (severidad: string) => {
    switch (severidad) {
      case 'critica':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-600 dark:text-red-400',
          badge: 'bg-red-500 text-white',
          icon: '🔴',
        };
      case 'alta':
        return {
          bg: 'bg-orange-50 dark:bg-orange-900/20',
          border: 'border-orange-200 dark:border-orange-800',
          text: 'text-orange-600 dark:text-orange-400',
          badge: 'bg-orange-500 text-white',
          icon: '🟠',
        };
      case 'media':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          text: 'text-yellow-600 dark:text-yellow-400',
          badge: 'bg-yellow-500 text-white',
          icon: '🟡',
        };
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-600 dark:text-blue-400',
          badge: 'bg-blue-500 text-white',
          icon: '🔵',
        };
    }
  };

  const styles = getSeverityStyles(anomaly.severidad);

  return (
    <motion.div
      className={`${styles.bg} rounded-lg p-4 border ${styles.border} cursor-pointer hover:shadow-md transition-shadow`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => onClick?.(anomaly)}
    >
      <div className="flex items-start justify-between gap-3">
        {/* ICONO Y CONTENIDO */}
        <div className="flex items-start gap-3 flex-1">
          <span className="text-2xl">{styles.icon}</span>

          <div className="flex-1">
            {/* TIPO Y SEVERIDAD */}
            <div className="flex items-center gap-2 mb-2">
              <h4 className={`font-bold ${styles.text}`}>{anomaly.tipo}</h4>
              <span className={`px-2 py-1 ${styles.badge} rounded text-xs font-medium`}>
                {anomaly.severidad.toUpperCase()}
              </span>
              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                Score: {Math.round(anomaly.puntuacionAnomalia * 100)}%
              </span>
            </div>

            {/* DETALLES */}
            <div className="grid grid-cols-2 gap-3 mb-2 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Monto:</span>
                <span className={`font-bold ml-2 ${styles.text}`}>
                  ${anomaly.monto.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Fecha:</span>
                <span className="font-medium ml-2 text-gray-700 dark:text-gray-300">
                  {new Date(anomaly.fecha).toLocaleDateString('es-MX')}
                </span>
              </div>
            </div>

            {/* RAZÓN */}
            <p className={`text-sm ${styles.text} mb-2`}>
              <strong>Razón:</strong> {anomaly.razon}
            </p>

            {/* ACCIÓN RECOMENDADA */}
            {anomaly.accionRecomendada && (
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 mt-2">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>✅ Acción recomendada:</strong> {anomaly.accionRecomendada}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* BOTÓN VER MÁS */}
        <button
          className={`${styles.bg} border ${styles.border} rounded-lg p-2 hover:bg-opacity-50 transition-colors`}
        >
          <svg
            className={`w-5 h-5 ${styles.text}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

// ============================================================================
// FLOATING ANOMALY COUNTER
// ============================================================================

interface FloatingAnomalyCounterProps {
  count: number;
  criticalCount: number;
  onClick?: () => void;
}

export function FloatingAnomalyCounter({
  count,
  criticalCount,
  onClick,
}: FloatingAnomalyCounterProps) {
  if (count === 0) return null;

  return (
    <motion.button
      className="fixed bottom-24 right-6 z-40 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full shadow-2xl p-4 hover:scale-110 transition-transform"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">🚨</span>
        <div className="text-left">
          <p className="text-xs font-medium">Anomalías</p>
          <p className="text-xl font-bold">{count}</p>
        </div>
      </div>

      {criticalCount > 0 && (
        <motion.div
          className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        >
          {criticalCount}
        </motion.div>
      )}
    </motion.button>
  );
}

export default AnomaliesAlert;
