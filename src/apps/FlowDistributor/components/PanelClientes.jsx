/**
 * 👥 PANEL CLIENTES PREMIUM
 * Gestión y análisis de clientes
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  DollarSign,
  TrendingUp,
  Clock,
  Star,
} from 'lucide-react';

const PanelClientes = () => {
  const [clientes] = useState([]);

  const estadisticas = useMemo(() => {
    const activos = clientes.filter((c) => c.activo).length;
    const totalCompras = clientes.reduce(
      (sum, c) => sum + (c.totalComprado || 0),
      0
    );
    const conAdeudo = clientes.filter((c) => (c.adeudo || 0) > 0).length;
    const totalAdeudo = clientes.reduce((sum, c) => sum + (c.adeudo || 0), 0);

    return {
      total: clientes.length,
      activos,
      totalCompras,
      conAdeudo,
      totalAdeudo,
    };
  }, [clientes]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-8 h-8 text-purple-400" />
          Clientes
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">
              Total Clientes
            </h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {estadisticas.total}
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
              <UserCheck className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">Activos</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {estadisticas.activos}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">
              Total Compras
            </h3>
          </div>
          <p className="text-3xl font-bold text-white">
            ${estadisticas.totalCompras.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">Con Adeudo</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {estadisticas.conAdeudo}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            ${estadisticas.totalAdeudo.toLocaleString()}
          </p>
        </motion.div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
        <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">
          Panel de Clientes
        </h3>
        <p className="text-gray-500">
          Gestión completa de base de clientes
        </p>
      </div>
    </div>
  );
};

export default PanelClientes;
