import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightLeft,
  DollarSign,
  TrendingUp,
  Calculator,
  Zap,
  Info,
  Copy,
  Check,
} from 'lucide-react';
import { useExchangeRate } from '@/hooks/useExchangeRate';

interface ConversionScenario {
  label: string;
  tc: number;
  description: string;
  color: string;
}

export const ConversionCalculator: React.FC = () => {
  const { tc, usdToMxn, mxnToUsd, opportunity } = useExchangeRate();

  const [amount, setAmount] = useState<string>('1000');
  const [fromCurrency, setFromCurrency] = useState<'USD' | 'MXN'>('USD');
  const [copied, setCopied] = useState(false);

  // Escenarios de conversión
  const scenarios: ConversionScenario[] = useMemo(() => {
    const tcCurrent = tc.rate;
    const tcPredicted3d = tcCurrent * (1 + (tc.trend === 'up' ? 0.015 : -0.015));
    const tcPredicted7d = tcCurrent * (1 + (tc.trend === 'up' ? 0.03 : -0.03));

    return [
      {
        label: 'TC Actual',
        tc: tcCurrent,
        description: 'Tipo de cambio en tiempo real',
        color: 'purple',
      },
      {
        label: 'Predicción 3 días',
        tc: tcPredicted3d,
        description: `Proyección basada en tendencia ${tc.trend === 'up' ? 'alcista' : 'bajista'}`,
        color: tc.trend === 'up' ? 'emerald' : 'rose',
      },
      {
        label: 'Predicción 7 días',
        tc: tcPredicted7d,
        description: `Escenario ${tc.trend === 'up' ? 'optimista' : 'conservador'}`,
        color: tc.trend === 'up' ? 'blue' : 'amber',
      },
    ];
  }, [tc]);

  const amountNum = parseFloat(amount) || 0;

  const conversions = scenarios.map(scenario => {
    const result = fromCurrency === 'USD'
      ? amountNum * scenario.tc
      : amountNum / scenario.tc;

    const difference = result - (fromCurrency === 'USD'
      ? amountNum * scenarios[0].tc
      : amountNum / scenarios[0].tc);

    const percentDiff = ((difference / (fromCurrency === 'USD'
      ? amountNum * scenarios[0].tc
      : amountNum / scenarios[0].tc)) * 100);

    return {
      ...scenario,
      result,
      difference,
      percentDiff,
    };
  });

  const handleSwapCurrency = () => {
    setFromCurrency(prev => prev === 'USD' ? 'MXN' : 'USD');
  };

  const handleCopy = (value: number) => {
    navigator.clipboard.writeText(value.toFixed(2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-2.5 flex items-center justify-center"
          >
            <Calculator className="text-white w-6 h-6" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-white">Calculadora de Conversión</h3>
            <p className="text-white/60 text-sm">Multi-escenario USD ↔ MXN</p>
          </div>
        </div>
      </div>

      {/* Input de conversión */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          {/* Monto */}
          <div className="flex-1">
            <label className="text-white/60 text-sm font-medium mb-2 block">
              Monto a convertir
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white text-2xl font-bold font-mono placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="0.00"
              />
            </div>
            {/* Botones rápidos */}
            <div className="flex items-center gap-2 mt-3">
              {[100, 500, 1000, 5000, 10000].map(value => (
                <motion.button
                  key={value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickAmount(value)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white text-xs font-medium transition-all"
                >
                  ${value.toLocaleString()}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Selector de moneda */}
          <div className="flex flex-col items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSwapCurrency}
              className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              <ArrowRightLeft className="w-6 h-6 text-white" />
            </motion.button>
            <div className="flex flex-col items-center gap-2">
              <motion.div
                animate={{ scale: fromCurrency === 'USD' ? 1.2 : 0.9 }}
                className={`px-3 py-1.5 rounded-lg font-bold ${
                  fromCurrency === 'USD'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-white/5 text-white/40'
                }`}
              >
                USD
              </motion.div>
              <div className="text-white/40 text-xs">→</div>
              <motion.div
                animate={{ scale: fromCurrency === 'MXN' ? 1.2 : 0.9 }}
                className={`px-3 py-1.5 rounded-lg font-bold ${
                  fromCurrency === 'MXN'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/5 text-white/40'
                }`}
              >
                MXN
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Escenarios de conversión */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-white/60 text-sm font-medium mb-3">
          <Info className="w-4 h-4" />
          <span>Comparación de escenarios</span>
        </div>

        <AnimatePresence mode="popLayout">
          {conversions.map((conversion, idx) => (
            <motion.div
              key={conversion.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className={`bg-${conversion.color}-500/10 border border-${conversion.color}-500/20 rounded-xl p-4 cursor-pointer transition-all`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`text-${conversion.color}-400 font-bold`}>
                      {conversion.label}
                    </h4>
                    {idx === 0 && (
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full font-bold"
                      >
                        EN VIVO
                      </motion.span>
                    )}
                  </div>
                  <p className="text-white/60 text-xs">{conversion.description}</p>
                </div>
                <div className={`text-${conversion.color}-400 text-sm font-mono font-bold`}>
                  TC: {conversion.tc.toFixed(4)}
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/60 text-xs mb-1">
                    {fromCurrency === 'USD' ? 'Recibes' : 'Pagas'}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-white text-3xl font-bold font-mono">
                      {conversion.result.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span className="text-white/60 text-sm">
                      {fromCurrency === 'USD' ? 'MXN' : 'USD'}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleCopy(conversion.result)}
                      className="ml-2 p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-white/60" />
                      )}
                    </motion.button>
                  </div>
                </div>

                {idx > 0 && (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className={`px-3 py-2 rounded-lg ${
                      conversion.difference > 0
                        ? 'bg-emerald-500/20 border border-emerald-500/30'
                        : 'bg-rose-500/20 border border-rose-500/30'
                    }`}
                  >
                    <p className="text-xs text-white/60 mb-0.5">vs Actual</p>
                    <p
                      className={`text-sm font-bold font-mono ${
                        conversion.difference > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {conversion.difference > 0 ? '+' : ''}
                      {conversion.difference.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p
                      className={`text-xs ${
                        conversion.difference > 0 ? 'text-emerald-400/60' : 'text-rose-400/60'
                      }`}
                    >
                      ({conversion.percentDiff > 0 ? '+' : ''}
                      {conversion.percentDiff.toFixed(2)}%)
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Recomendación AI */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`rounded-xl p-4 border ${
          opportunity.action === 'VENDER_USD'
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : opportunity.action === 'COMPRAR_USD'
            ? 'bg-blue-500/10 border-blue-500/30'
            : 'bg-amber-500/10 border-amber-500/30'
        }`}
      >
        <div className="flex items-start gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-2 flex items-center justify-center"
          >
            <Zap className="text-white w-6 h-6" />
          </motion.div>
          <div className="flex-1">
            <h4 className="text-white font-bold mb-1 flex items-center gap-2">
              💡 Recomendación Inteligente
            </h4>
            <p className="text-white/80 text-sm mb-2">
              {opportunity.recommendation}
            </p>
            {opportunity.action === 'VENDER_USD' && (
              <div className="flex items-center gap-2 text-xs">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-medium">
                  TC está {tc.change > 0 ? '+' : ''}{tc.change.toFixed(4)} arriba del promedio
                </span>
              </div>
            )}
            {opportunity.action === 'COMPRAR_USD' && (
              <div className="flex items-center gap-2 text-xs">
                <TrendingUp className="w-4 h-4 text-blue-400 rotate-180" />
                <span className="text-blue-400 font-medium">
                  TC está {Math.abs(tc.change).toFixed(4)} abajo del promedio
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Botones de acción rápida */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5" />
          <span>Convertir Ahora</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2"
        >
          <Calculator className="w-5 h-5" />
          <span>Ver Historial</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
