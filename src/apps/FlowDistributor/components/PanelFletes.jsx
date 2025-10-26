/**
 * 🚚 PANEL FLETES PREMIUM
 * Gestión y seguimiento de fletes y transporte
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, MapPin, DollarSign, Clock, Package } from 'lucide-react';

const PanelFletes = () => {
  const [fletes] = useState([]);

  const estadisticas = useMemo(() => {
    return {
      total: fletes.length,
      enTransito: fletes.filter((f) => f.estado === 'transito').length,
      completados: fletes.filter((f) => f.estado === 'completado').length,
      costoTotal: fletes.reduce((sum, f) => sum + (f.costo || 0), 0),
    };
  }, [fletes]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Truck className="w-8 h-8 text-blue-400" />
          Fletes y Transporte
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">Total Fletes</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {estadisticas.total}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">En Tránsito</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {estadisticas.enTransito}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <MapPin className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">Completados</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {estadisticas.completados}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">Costo Total</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            ${estadisticas.costoTotal.toLocaleString()}
          </p>
        </motion.div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
        <Truck className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">
          Panel de Fletes
        </h3>
        <p className="text-gray-500">
          Gestión de transportes y seguimiento de envíos
        </p>
      </div>
    </div>
  );
};

export default PanelFletes;
