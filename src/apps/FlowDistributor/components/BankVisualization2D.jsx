/**
 * 🏦 BANK VISUALIZATION 2D - DASHBOARD ANIMADO PREMIUM
 * Visualización avanzada de bancos con gráficos interactivos y animaciones
 * @version 2.0.0 - Sin dependencias 3D
 */
import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  Building2,
  CheckCircle,
  Clock,
  DollarSign,
  PieChart,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

/**
 * Card individual de banco con animaciones
 */
const BankCard = ({ bank, index, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (capital) => {
    if (capital > 5000000) return 'from-emerald-600 to-teal-600';
    if (capital > 2000000) return 'from-zinc-900 to-zinc-900';
    if (capital > 1000000) return 'from-zinc-800 to-zinc-700';
    return 'from-zinc-700 to-orange-600';
  };

  const getStatusIcon = (capital) => {
    if (capital > 5000000) return <CheckCircle className="w-5 h-5 text-zinc-200" />;
    if (capital > 2000000) return <TrendingUp className="w-5 h-5 text-zinc-300" />;
    if (capital > 1000000) return <Clock className="w-5 h-5 text-zinc-800" />;
    return <AlertCircle className="w-5 h-5 text-zinc-200" />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: 'spring' }}
      whileHover={{ scale: 1.03, y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick(bank)}
      className="group relative cursor-pointer"
    >
      {/* Card principal */}
      <div
        className={`relative p-6 rounded-2xl bg-gradient-to-br ${getStatusColor(bank.capital)} bg-opacity-10 backdrop-blur-xl border border-white/10 overflow-hidden shadow-xl`}
      >
        {/* Efecto de brillo animado */}
        <motion.div
          animate={{
            x: isHovered ? ['-100%', '200%'] : '-100%',
          }}
          transition={{
            duration: 1.5,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
        />

        {/* Header del card */}
        <div className="relative flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.6 }}
              className={`p-3 rounded-xl bg-gradient-to-br ${getStatusColor(bank.capital)} shadow-lg`}
            >
              <Building2 className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-white">{bank.name}</h3>
              <p className="text-xs text-slate-400">{bank.location || 'Nacional'}</p>
            </div>
          </div>
          {getStatusIcon(bank.capital)}
        </div>

        {/* Capital principal */}
        <div className="relative mb-4">
          <div className="text-sm text-slate-400 mb-1">Capital Total</div>
          <div className="text-3xl font-bold text-white flex items-baseline gap-2">
            {formatCurrency(bank.capital)}
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-sm text-zinc-200"
            >
              <ArrowUpRight className="w-4 h-4" />
            </motion.span>
          </div>
        </div>

        {/* Métricas adicionales */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-slate-900/40 backdrop-blur-sm border border-white/5">
            <div className="text-xs text-slate-400 mb-1">Transacciones</div>
            <div className="text-lg font-bold text-white">
              {bank.transactions?.toLocaleString() || '0'}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/40 backdrop-blur-sm border border-white/5">
            <div className="text-xs text-slate-400 mb-1">Crecimiento</div>
            <div className="text-lg font-bold text-zinc-200">+{bank.growth || '12'}%</div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="relative h-2 bg-slate-800/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((bank.capital / 10000000) * 100, 100)}%` }}
            transition={{ delay: index * 0.1 + 0.3, duration: 1, ease: 'easeOut' }}
            className={`h-full bg-gradient-to-r ${getStatusColor(bank.capital)}`}
          >
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            />
          </motion.div>
        </div>

        {/* Badge de estado */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white"
        >
          Ver detalles
        </motion.div>
      </div>

      {/* Sombra animada */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.6 : 0.3,
          scale: isHovered ? 1.05 : 1,
        }}
        className={`absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br ${getStatusColor(bank.capital)} blur-xl`}
      />
    </motion.div>
  );
};

/**
 * Componente principal de visualización
 */
export const BankVisualization2D = ({ banks = [], title = 'Análisis Bancario' }) => {
  const [selectedBank, setSelectedBank] = useState(null);
  const [filter, setFilter] = useState('all');

  // Datos demo si no hay bancos
  const defaultBanks = [
    {
      name: 'Banco Nacional',
      capital: 8500000,
      location: 'Central',
      transactions: 15420,
      growth: 18,
    },
    { name: 'Banco Regional', capital: 4200000, location: 'Norte', transactions: 8730, growth: 12 },
    { name: 'Banco Popular', capital: 2800000, location: 'Sur', transactions: 6890, growth: 9 },
    { name: 'Banco Industrial', capital: 1500000, location: 'Este', transactions: 4250, growth: 7 },
    { name: 'Banco Comercial', capital: 950000, location: 'Oeste', transactions: 2180, growth: 5 },
    {
      name: 'Banco del Pueblo',
      capital: 650000,
      location: 'Centro',
      transactions: 1450,
      growth: 4,
    },
  ];

  const bankData = banks.length > 0 ? banks : defaultBanks;
  const totalCapital = bankData.reduce((sum, bank) => sum + bank.capital, 0);
  const avgGrowth = (
    bankData.reduce((sum, bank) => sum + (bank.growth || 0), 0) / bankData.length
  ).toFixed(1);

  return (
    <div className="relative h-full flex flex-col bg-gradient-to-br from-slate-900/95 via-blue-900/30 to-slate-900/95 backdrop-blur-xl rounded-2xl border border-zinc-700/20 overflow-hidden shadow-2xl">
      {/* Header con estadísticas globales */}
      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-zinc-900/30 via-transparent to-zinc-800/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="p-3 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-lg"
            >
              <PieChart className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {title}
                <Sparkles className="w-5 h-5 text-zinc-200 animate-pulse" />
              </h2>
              <p className="text-sm text-slate-400">Dashboard interactivo de métricas bancarias</p>
            </div>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-4 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 rounded-xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-zinc-500/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-zinc-200" />
              <div className="text-xs text-slate-400">Capital Total</div>
            </div>
            <div className="text-2xl font-bold text-white">
              {new Intl.NumberFormat('es-US', {
                style: 'currency',
                currency: 'USD',
                notation: 'compact',
                maximumFractionDigits: 1,
              }).format(totalCapital)}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 rounded-xl bg-gradient-to-br from-zinc-900/20 to-zinc-900/20 border border-zinc-700/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-zinc-300" />
              <div className="text-xs text-slate-400">Bancos Activos</div>
            </div>
            <div className="text-2xl font-bold text-white">{bankData.length}</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 rounded-xl bg-gradient-to-br from-zinc-800/20 to-zinc-700/20 border border-zinc-800/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-zinc-800" />
              <div className="text-xs text-slate-400">Crecimiento Promedio</div>
            </div>
            <div className="text-2xl font-bold text-white">+{avgGrowth}%</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 rounded-xl bg-gradient-to-br from-orange-600/20 to-zinc-800/20 border border-zinc-500/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-zinc-200" />
              <div className="text-xs text-slate-400">Estado</div>
            </div>
            <div className="text-lg font-bold text-zinc-200">Activo</div>
          </motion.div>
        </div>
      </div>

      {/* Grid de bancos */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bankData.map((bank, index) => (
            <BankCard key={bank.name} bank={bank} index={index} onClick={setSelectedBank} />
          ))}
        </div>

        {bankData.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-slate-400">
              <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No hay datos bancarios disponibles</p>
              <p className="text-sm">Conecta tu sistema para visualizar información</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      <AnimatePresence>
        {selectedBank && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBank(null)}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-white/20 shadow-2xl max-w-2xl w-full mx-4"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-900">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedBank.name}</h3>
                    <p className="text-slate-400">{selectedBank.location}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBank(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <span className="text-2xl text-slate-400">×</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10">
                  <div className="text-sm text-slate-400 mb-2">Capital</div>
                  <div className="text-2xl font-bold text-white">
                    {new Intl.NumberFormat('es-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(selectedBank.capital)}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10">
                  <div className="text-sm text-slate-400 mb-2">Transacciones</div>
                  <div className="text-2xl font-bold text-white">
                    {selectedBank.transactions?.toLocaleString() || '0'}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10">
                  <div className="text-sm text-slate-400 mb-2">Crecimiento</div>
                  <div className="text-2xl font-bold text-zinc-200">
                    +{selectedBank.growth || '0'}%
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10">
                  <div className="text-sm text-slate-400 mb-2">Ubicación</div>
                  <div className="text-xl font-bold text-white">
                    {selectedBank.location || 'N/A'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedBank(null)}
                className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800 text-white font-semibold transition-all"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BankVisualization2D;
