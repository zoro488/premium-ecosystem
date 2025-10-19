import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

export const ChartsLoading = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="glass rounded-2xl p-6 border border-white/10">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-white/10 rounded w-3/4"></div>
            <div className="h-64 bg-white/5 rounded-xl flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <BarChart3 className="w-12 h-12 text-slate-400" />
              </motion.div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChartsLoading;