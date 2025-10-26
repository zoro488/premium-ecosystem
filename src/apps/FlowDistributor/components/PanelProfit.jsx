/**
 * 📈 PANEL PROFIT PREMIUM
 * Análisis de rentabilidad y ganancias
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Target, BarChart3, PieChart } from 'lucide-react';

const PanelProfit = () => {
  const [periodo, setPeriodo] = useState('mes');
  const [datos] = useState({
    profit: 0,
    margen: 0,
    roi: 0,
    tendencia: 'up',
  });

  const estadisticas = useMemo(() => {
    return {
      profit: datos.profit || 0,
      margen: datos.margen || 0,
      roi: datos.roi || 0,
      tendencia: datos.tendencia || 'up',
    };
  }, [datos]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-green-400" />
          Análisis de Profit
        </h2>
        <select
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
        >
          <option value="dia">Hoy</option>
          <option value="semana">Esta Semana</option>
          <option value="mes">Este Mes</option>
          <option value="trimestre">Trimestre</option>
          <option value="año">Año</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">
              Profit Total
            </h3>
          </div>
          <p className="text-3xl font-bold text-white">
            ${estadisticas.profit.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">
              Margen de Ganancia
            </h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {estadisticas.margen.toFixed(1)}%
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">ROI</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {estadisticas.roi.toFixed(1)}%
          </p>
        </motion.div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
        <PieChart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">
          Análisis de Rentabilidad
        </h3>
        <p className="text-gray-500">
          Métricas de profit y retorno de inversión
        </p>
      </div>
    </div>
  );
};

export default PanelProfit;
