/**
 * 💰 PANEL UTILIDADES PREMIUM
 * Análisis y seguimiento de utilidades del negocio
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Activity,
} from 'lucide-react';

const PanelUtilidades = () => {
  const [periodo, setPeriodo] = useState('mes');
  const [utilidades] = useState({
    total: 0,
    brutas: 0,
    netas: 0,
    margen: 0,
    historico: [],
  });

  const estadisticas = useMemo(() => {
    return {
      utilidadTotal: utilidades.total || 0,
      utilidadBruta: utilidades.brutas || 0,
      utilidadNeta: utilidades.netas || 0,
      margenUtilidad: utilidades.margen || 0,
    };
  }, [utilidades]);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <DollarSign className="w-8 h-8 text-green-400" />
          Utilidades
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

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">
              Utilidad Total
            </h3>
          </div>
          <p className="text-3xl font-bold text-white">
            ${estadisticas.utilidadTotal.toLocaleString()}
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
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">
              Utilidad Bruta
            </h3>
          </div>
          <p className="text-3xl font-bold text-white">
            ${estadisticas.utilidadBruta.toLocaleString()}
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
              <DollarSign className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">
              Utilidad Neta
            </h3>
          </div>
          <p className="text-3xl font-bold text-white">
            ${estadisticas.utilidadNeta.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Target className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">
              Margen de Utilidad
            </h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {estadisticas.margenUtilidad.toFixed(1)}%
          </p>
        </motion.div>
      </div>

      {/* Contenido principal */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
        <PieChart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">
          Panel de Utilidades
        </h3>
        <p className="text-gray-500">
          Visualización y análisis de utilidades del negocio
        </p>
      </div>
    </div>
  );
};

export default PanelUtilidades;
