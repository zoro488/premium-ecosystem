/**
 * 🔄 BUSINESS WORKFLOWS PANEL
 *
 * Panel integrador que añade funcionalidad de OC y Venta al PanelAlmacen
 * Incluye modales para OrdenCompraForm y VentaForm
 *
 * @author Premium Ecosystem
 * @version 2.0.0
 */
import React, { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  Package,
  Plus,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  X,
} from 'lucide-react';

import type { OrdenCompra, Venta } from '@/services/businessLogic';
import { getCurrentSTK, getInventorySummary } from '@/services/businessLogic';

import { OrdenCompraForm } from './OrdenCompraForm';
import { VentaForm } from './VentaForm';

// ==================== PROPS ====================

interface BusinessWorkflowsPanelProps {
  onOrdenCompraCreated?: (oc: OrdenCompra) => void;
  onVentaCreated?: (venta: Venta) => void;
}

// ==================== COMPONENT ====================

export const BusinessWorkflowsPanel: React.FC<BusinessWorkflowsPanelProps> = ({
  onOrdenCompraCreated,
  onVentaCreated,
}) => {
  const [showOCModal, setShowOCModal] = useState(false);
  const [showVentaModal, setShowVentaModal] = useState(false);
  const [inventorySummary, setInventorySummary] = useState(getInventorySummary());
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  // ==================== HANDLERS ====================

  const handleOCSuccess = (oc: OrdenCompra) => {
    setShowOCModal(false);
    setInventorySummary(getInventorySummary());

    setNotification({
      show: true,
      type: 'success',
      message: `✅ Orden de Compra ${oc.OC} creada exitosamente. STK: ${getCurrentSTK()} unidades`,
    });

    setTimeout(() => {
      setNotification({ show: false, type: 'success', message: '' });
    }, 5000);

    if (onOrdenCompraCreated) {
      onOrdenCompraCreated(oc);
    }
  };

  const handleVentaSuccess = (venta: Venta) => {
    setShowVentaModal(false);
    setInventorySummary(getInventorySummary());

    setNotification({
      show: true,
      type: 'success',
      message: `✅ Venta a ${venta.Cliente} registrada exitosamente. STK: ${getCurrentSTK()} unidades`,
    });

    setTimeout(() => {
      setNotification({ show: false, type: 'success', message: '' });
    }, 5000);

    if (onVentaCreated) {
      onVentaCreated(venta);
    }
  };

  // ==================== RENDER ====================

  return (
    <>
      {/* Quick Actions Bar */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-green-500/10 border border-blue-500/20 rounded-2xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">🔄 Operaciones de Negocio</h2>
              <p className="text-white/60 text-sm">
                Gestiona Órdenes de Compra y Ventas con automatización completa
              </p>
            </div>
          </div>

          {/* Inventory Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* STK Actual */}
            <div className="p-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/30 rounded-lg">
                  <Package className="w-6 h-6 text-purple-200" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">STK Actual</p>
                  <p className="text-2xl font-bold text-white">{inventorySummary.stkActual}</p>
                </div>
              </div>
            </div>

            {/* Total Ingresos */}
            <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/30 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-200" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Total Ingresos</p>
                  <p className="text-2xl font-bold text-white">{inventorySummary.totalIngresos}</p>
                  <p className="text-xs text-white/50">
                    {inventorySummary.cantidadOrdenes} órdenes
                  </p>
                </div>
              </div>
            </div>

            {/* Total Salidas */}
            <div className="p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/30 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-orange-200" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Total Salidas</p>
                  <p className="text-2xl font-bold text-white">{inventorySummary.totalSalidas}</p>
                  <p className="text-xs text-white/50">{inventorySummary.cantidadVentas} ventas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nueva Orden de Compra */}
            <button
              onClick={() => setShowOCModal(true)}
              className="group relative overflow-hidden p-6 rounded-xl border-2 border-blue-500/30 hover:border-blue-500/60 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 hover:from-blue-600/20 hover:to-cyan-600/20 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg group-hover:scale-110 transition-transform">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Nueva Orden de Compra
                  </h3>
                  <p className="text-white/60 text-sm">
                    Registra compra a distribuidor → Incrementa STK
                  </p>
                </div>
              </div>

              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 group-hover:translate-x-full transition-transform duration-1000" />
            </button>

            {/* Nueva Venta */}
            <button
              onClick={() => setShowVentaModal(true)}
              className="group relative overflow-hidden p-6 rounded-xl border-2 border-green-500/30 hover:border-green-500/60 bg-gradient-to-br from-green-600/10 to-emerald-600/10 hover:from-green-600/20 hover:to-emerald-600/20 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Nueva Venta
                  </h3>
                  <p className="text-white/60 text-sm">
                    Registra venta → Auto asientos (Bóveda, Flete, Utilidad)
                  </p>
                </div>
              </div>

              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] max-w-md"
          >
            <div
              className={`p-4 rounded-lg border shadow-2xl ${
                notification.type === 'success'
                  ? 'bg-green-500/90 border-green-400 backdrop-blur-xl'
                  : 'bg-red-500/90 border-red-400 backdrop-blur-xl'
              }`}
            >
              <div className="flex items-center gap-3">
                {notification.type === 'success' ? (
                  <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-white flex-shrink-0" />
                )}
                <p className="text-white font-semibold">{notification.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Orden de Compra */}
      <AnimatePresence>
        {showOCModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowOCModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowOCModal(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>

              <div className="p-8">
                <OrdenCompraForm
                  onSuccess={handleOCSuccess}
                  onCancel={() => setShowOCModal(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Venta */}
      <AnimatePresence>
        {showVentaModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowVentaModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto m-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowVentaModal(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>

              <div className="p-8">
                <VentaForm
                  onSuccess={handleVentaSuccess}
                  onCancel={() => setShowVentaModal(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BusinessWorkflowsPanel;
