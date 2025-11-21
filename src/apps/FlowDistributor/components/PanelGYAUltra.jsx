import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { memo } from 'react';

const PanelGYAUltra = memo(() => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-zinc-700 mb-4">
          💰 Gastos y Abonos
        </h1>
        <p className="text-slate-400 mb-8">Panel en construcción - Conectar con Firebase</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
            <DollarSign className="text-zinc-200 mb-4" size={32} />
            <div className="text-2xl font-bold text-white"></div>
            <div className="text-sm text-slate-400">Total Ingresos</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
            <DollarSign className="text-zinc-200 mb-4" size={32} />
            <div className="text-2xl font-bold text-white"></div>
            <div className="text-sm text-slate-400">Total Gastos</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
            <DollarSign className="text-zinc-200 mb-4" size={32} />
            <div className="text-2xl font-bold text-white"></div>
            <div className="text-sm text-slate-400">Balance</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

PanelGYAUltra.displayName = 'PanelGYAUltra';
export default PanelGYAUltra;
