/**
 * 🏦 PANEL AZTECA PREMIUM
 * Gestión de cuenta Banco Azteca
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';

const PanelAzteca = () => {
  const [transacciones] = useState([]);

  const estadisticas = useMemo(() => {
    const ingresos = transacciones
      .filter((t) => t.tipo === 'ingreso')
      .reduce((sum, t) => sum + (t.monto || 0), 0);
    const egresos = transacciones
      .filter((t) => t.tipo === 'egreso')
      .reduce((sum, t) => sum + (t.monto || 0), 0);

    return {
      saldo: ingresos - egresos,
      ingresos,
      egresos,
      total: transacciones.length,
    };
  }, [transacciones]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Building2 className="w-8 h-8 text-blue-400" />
          Banco Azteca
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <CreditCard className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">Saldo Actual</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            ${estadisticas.saldo.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <ArrowUpRight className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">Ingresos</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            ${estadisticas.ingresos.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <ArrowDownRight className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">Egresos</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            ${estadisticas.egresos.toLocaleString()}
          </p>
        </motion.div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
        <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">
          Banco Azteca
        </h3>
        <p className="text-gray-500">Gestión de cuenta Banco Azteca</p>
      </div>
    </div>
  );
};

export default PanelAzteca;
