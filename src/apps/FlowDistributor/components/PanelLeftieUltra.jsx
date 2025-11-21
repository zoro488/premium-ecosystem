/**
 * 🏛️ PANEL LEFTIE ULTRA - BANKING DIGITAL (RECREADO)
 * ====================================================
 * Panel bancario moderno optimizado
 */
import { memo } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, TrendingUp } from 'lucide-react';

const PanelLeftieUltra = memo(() => {
  return (
    <div className="relative min-h-screen p-6" style={{ background: '#1a0b2e' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Smartphone className="w-10 h-10 text-zinc-800" />
            Leftie Digital Banking
          </h1>
          <p className="text-gray-400">
            Panel en mantenimiento - Optimizando para mejor rendimiento
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl"
            style={{
              background: 'rgba(139, 92, 246, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
            }}
          >
            <CreditCard className="w-8 h-8 text-zinc-800 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Saldo Total</h3>
            <p className="text-3xl font-bold text-zinc-800">$0.00</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl"
            style={{
              background: 'rgba(236, 72, 153, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(236, 72, 153, 0.2)',
            }}
          >
            <TrendingUp className="w-8 h-8 text-zinc-700 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Ingresos</h3>
            <p className="text-3xl font-bold text-zinc-700">$0.00</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl"
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}
          >
            <Smartphone className="w-8 h-8 text-zinc-300 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Transacciones</h3>
            <p className="text-3xl font-bold text-zinc-300">0</p>
          </motion.div>
        </div>

        <div
          className="mt-8 p-8 rounded-2xl text-center"
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
          }}
        >
          <p className="text-gray-400 text-lg">
            🚀 Panel siendo optimizado con las últimas tecnologías
          </p>
          <p className="text-gray-500 mt-2">
            Próximamente: UI Fintech moderna, Real-time updates, Analytics avanzados
          </p>
        </div>
      </motion.div>
    </div>
  );
});

PanelLeftieUltra.displayName = 'PanelLeftieUltra';

export default PanelLeftieUltra;
