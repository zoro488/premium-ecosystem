/**
 * 🏦 PANEL BÓVEDA MONTE PREMIUM
 * Gestión de cuenta Bóveda Monte
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Vault, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const PanelBovedaMonte = () => {
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
          <Vault className="w-8 h-8 text-purple-400" />
          Bóveda Monte
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-purple-400" />
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
        <Vault className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">
          Bóveda Monte
        </h3>
        <p className="text-gray-500">Gestión de cuenta Bóveda Monte</p>
      </div>
    </div>
  );
};

export default PanelBovedaMonte;
