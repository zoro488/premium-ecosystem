import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  TrendingDown,
  ArrowRight,
  DollarSign,
  Clock,
  Zap,
  X,
} from 'lucide-react';
import { useExchangeRate } from '@/hooks/useExchangeRate';

interface CriticalAlertBannerProps {
  saldoMXN: number; // Saldo negativo en MXN
  bovedaOrigen?: 'bovedaUsa' | 'profit';
  onTransfer?: (monto: number, origen: string) => void;
  onDismiss?: () => void;
}

export const CriticalAlertBanner: React.FC<CriticalAlertBannerProps> = ({
  saldoMXN,
  bovedaOrigen = 'bovedaUsa',
  onTransfer,
  onDismiss,
}) => {
  const { tc, usdToMxn, mxnToUsd } = useExchangeRate();
  const [countdown, setCountdown] = useState(30);
  const [dismissed, setDismissed] = useState(false);

  // Calcular monto necesario en USD para cubrir overdraft
  const montoNecearioUSD = Math.abs(saldoMXN) / tc.rate;
  const montoNecearioUSDRedondeado = Math.ceil(montoNecearioUSD / 100) * 100; // Redondear a siguiente 100

  // Calcular interés potencial por día (ejemplo 2% diario sobre overdraft)
  const interesDiario = Math.abs(saldoMXN) * 0.02;

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleTransfer = (origen: string) => {
    onTransfer?.(montoNecearioUSDRedondeado, origen);
  };

  const handleDismissTemporary = () => {
    setDismissed(true);
    // Re-mostrar después de 5 minutos
    setTimeout(() => setDismissed(false), 300000);
  };

  if (dismissed || saldoMXN >= 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl"
      >
        <motion.div
          animate={{
            boxShadow: [
              '0 0 30px rgba(239, 68, 68, 0.3)',
              '0 0 50px rgba(239, 68, 68, 0.5)',
              '0 0 30px rgba(239, 68, 68, 0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-gradient-to-br from-rose-500/20 via-red-600/20 to-rose-500/20 backdrop-blur-2xl rounded-2xl border-2 border-rose-500/50 overflow-hidden"
        >
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-500/20 to-transparent"
            />
          </div>

          <div className="relative p-6">
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDismissTemporary}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>

            <div className="flex items-start gap-6">
              {/* Icon animado */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl p-4 flex items-center justify-center shadow-lg shadow-rose-500/50"
              >
                <AlertTriangle className="w-12 h-12 text-white" />
              </motion.div>

              {/* Contenido principal */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-3xl font-black text-white">
                    ⚠️ ALERTA CRÍTICA: SOBREGIRO ACTIVO
                  </h2>
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="px-3 py-1 bg-rose-500 rounded-full"
                  >
                    <span className="text-white text-sm font-bold uppercase">
                      URGENTE
                    </span>
                  </motion.div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  {/* Sobregiro MXN */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-rose-600/30 backdrop-blur-xl rounded-xl p-4 border border-rose-500/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-5 h-5 text-rose-400" />
                      <p className="text-rose-400/80 text-sm font-medium">
                        Sobregiro MXN
                      </p>
                    </div>
                    <p className="text-rose-400 text-3xl font-black font-mono">
                      -${Math.abs(saldoMXN).toLocaleString()}
                    </p>
                    <p className="text-rose-400/60 text-xs mt-1">
                      Pesos Mexicanos
                    </p>
                  </motion.div>

                  {/* Equivalente USD */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-blue-600/30 backdrop-blur-xl rounded-xl p-4 border border-blue-500/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-blue-400" />
                      <p className="text-blue-400/80 text-sm font-medium">
                        Equivalente USD
                      </p>
                    </div>
                    <p className="text-blue-400 text-3xl font-black font-mono">
                      ${montoNecearioUSD.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-blue-400/60 text-xs mt-1">
                      TC: {tc.rate.toFixed(4)}
                    </p>
                  </motion.div>

                  {/* Monto a transferir */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-purple-600/30 backdrop-blur-xl rounded-xl p-4 border border-purple-500/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowRight className="w-5 h-5 text-purple-400" />
                      <p className="text-purple-400/80 text-sm font-medium">
                        Transferir
                      </p>
                    </div>
                    <p className="text-purple-400 text-3xl font-black font-mono">
                      ${montoNecearioUSDRedondeado.toLocaleString()}
                    </p>
                    <p className="text-purple-400/60 text-xs mt-1">
                      USD (redondeado)
                    </p>
                  </motion.div>

                  {/* Interés diario */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-amber-600/30 backdrop-blur-xl rounded-xl p-4 border border-amber-500/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-amber-400" />
                      <p className="text-amber-400/80 text-sm font-medium">
                        Interés Diario
                      </p>
                    </div>
                    <p className="text-amber-400 text-3xl font-black font-mono">
                      ${interesDiario.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-amber-400/60 text-xs mt-1">
                      MXN (aprox 2%)
                    </p>
                  </motion.div>
                </div>

                {/* Warning message */}
                <motion.div
                  animate={{ opacity: [1, 0.8, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="bg-rose-500/20 border border-rose-500/30 rounded-xl p-4 mb-4"
                >
                  <p className="text-white font-bold text-lg mb-2">
                    ⏰ Acción requerida inmediatamente
                  </p>
                  <p className="text-white/80 text-sm">
                    El sobregiro está generando intereses diarios de aproximadamente{' '}
                    <span className="font-bold text-amber-400">
                      ${interesDiario.toLocaleString()} MXN
                    </span>
                    . Se recomienda realizar una transferencia inmediata para evitar cargos
                    adicionales.
                  </p>
                </motion.div>

                {/* Botones de acción rápida */}
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTransfer('bovedaUsa')}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl text-white font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/30"
                  >
                    <Zap className="w-6 h-6" />
                    <span>Transferir desde Bóveda USA</span>
                    <ArrowRight className="w-6 h-6" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTransfer('profit')}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-purple-500/30"
                  >
                    <Zap className="w-6 h-6" />
                    <span>Transferir desde Profit</span>
                    <ArrowRight className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* Countdown timer */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-3 h-3 bg-rose-400 rounded-full"
                  />
                  <p className="text-white/60 text-sm">
                    Este mensaje se actualizará automáticamente en{' '}
                    <span className="text-white font-bold font-mono">
                      {countdown}s
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar animado */}
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 30, ease: 'linear' }}
            className="h-2 bg-gradient-to-r from-rose-500 via-red-500 to-rose-500"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
