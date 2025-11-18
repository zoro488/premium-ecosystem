/**
 * 🎯 SISTEMA INTEGRADO DE GESTIÓN FINANCIERA
 * ==========================================
 *
 * Componente maestro que integra:
 * - Dashboard RF Actual (vista ejecutiva)
 * - Panel de Ventas Locales
 * - Panel de Gastos y Abonos (GYA)
 * - Panel de Órdenes de Compra
 * - Panel de Distribuidores
 *
 * @version 1.0.0
 * @author FlowDistributor Team
 */
import { useState } from 'react';
import PropTypes from 'prop-types';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  Building2,
  DollarSign,
  LayoutDashboard,
  Menu,
  Package,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Users,
  X,
  Zap,
} from 'lucide-react';

// Importar todos los paneles
import DashboardRFActual from './DashboardRFActual';
import PanelAlmacenUltra from './PanelAlmacenUltra';
// Paneles multi-banco - versiones ULTRA cuando están disponibles
import PanelAztecaUltra from './PanelAztecaUltra';
import PanelBovedaMonteFinanciero from './PanelBovedaMonteFinanciero';
import PanelBovedaUSAUltra from './PanelBovedaUSAUltra';
import PanelDistribuidoresUltra from './PanelDistribuidoresUltra';
import PanelGYAUltra from './PanelGYAUltra';
import PanelLeftieUltra from './PanelLeftieUltra';
import PanelOrdenesCompraUltra from './PanelOrdenesCompraUltra';
import PanelProfitUltra from './PanelProfitUltra';
import PanelVentaLocal from './PanelVentaLocal';

/**
 * 🧭 Configuración de navegación
 */
const SECCIONES = [
  {
    id: 'dashboard',
    nombre: 'Dashboard RF',
    descripcion: 'Vista ejecutiva consolidada',
    icon: LayoutDashboard,
    color: 'from-zinc-800 to-zinc-700',
    bg: 'from-zinc-800/20 to-zinc-700/10',
    componente: DashboardRFActual,
  },
  {
    id: 'boveda-monte',
    nombre: 'Bóveda Monte',
    descripcion: 'Centro de control de capital',
    icon: Building2,
    color: 'from-amber-500 to-orange-400',
    bg: 'from-amber-500/20 to-orange-500/10',
  componente: PanelBovedaMonteFinanciero,
  },
  {
    id: 'boveda-usa',
    nombre: 'Bóveda USA',
    descripcion: 'RF: $128,005',
    icon: DollarSign,
    color: 'from-zinc-800 to-zinc-800',
    bg: 'from-zinc-800/20 to-zinc-800/10',
  componente: PanelBovedaUSAUltra,
  },
  {
    id: 'azteca',
    nombre: 'Banco Azteca',
    descripcion: 'RF: -$178,714 ⚠️',
    icon: Building2,
    color: 'from-indigo-500 to-zinc-800',
    bg: 'from-indigo-500/20 to-zinc-800/10',
  componente: PanelAztecaUltra,
  },
  {
    id: 'leftie',
    nombre: 'Banco Leftie',
    descripcion: 'RF: $45,844 ↗️',
    icon: Activity,
    color: 'from-teal-500 to-green-500',
    bg: 'from-teal-500/20 to-green-500/10',
  componente: PanelLeftieUltra,
  },
  {
    id: 'profit',
    nombre: 'Banco Profit',
    descripcion: 'RF: $12.5M+ 📈',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
    bg: 'from-green-500/20 to-emerald-500/10',
  componente: PanelProfitUltra,
  },
  {
    id: 'ventas',
    nombre: 'Ventas Locales',
    descripcion: '89 transacciones registradas',
    icon: ShoppingCart,
    color: 'from-green-500 to-emerald-400',
    bg: 'from-green-500/20 to-emerald-500/10',
  componente: PanelVentaLocal,
  },
  {
    id: 'gya',
    nombre: 'Gastos y Abonos',
    descripcion: 'Control de flujo de caja',
    icon: DollarSign,
    color: 'from-zinc-800 to-zinc-700',
    bg: 'from-zinc-800/20 to-zinc-800/10',
  componente: PanelGYAUltra,
  },
  {
    id: 'almacen',
    nombre: 'Almacén Monte',
    descripcion: 'Gestión de inventario',
    icon: Package,
    color: 'from-zinc-800 to-zinc-800',
    bg: 'from-zinc-800/20 to-zinc-800/10',
  componente: PanelAlmacenUltra,
  },
  {
    id: 'ordenes',
    nombre: 'Órdenes de Compra',
    descripcion: 'Gestión de compras',
    icon: TrendingUp,
    color: 'from-amber-500 to-orange-400',
    bg: 'from-amber-500/20 to-orange-500/10',
  componente: PanelOrdenesCompraUltra,
  },
  {
    id: 'distribuidores',
    nombre: 'Distribuidores',
    descripcion: 'Relación con proveedores',
    icon: Users,
    color: 'from-indigo-500 to-zinc-800',
    bg: 'from-indigo-500/20 to-zinc-800/10',
  componente: PanelDistribuidoresUltra,
  },
];

/**
 * 🎨 Sidebar de Navegación
 */
const Sidebar = ({ seccionActiva, onCambiarSeccion, sidebarAbierto, onToggleSidebar }) => {
  return (
    <AnimatePresence>
      {sidebarAbierto && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed left-0 top-0 h-screen w-80 bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900 border-r border-white/10 p-6 z-50 overflow-y-auto"
        >
          {/* Header Sidebar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-8 h-8 text-zinc-200" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-white">FlowDistributor</h2>
                <p className="text-xs text-gray-400">Sistema Premium</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleSidebar}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
            >
              <X className="w-5 h-5 text-gray-400" />
            </motion.button>
          </div>

          {/* Navegación */}
          <nav className="space-y-2">
            {SECCIONES.map((seccion, index) => {
              const IconoSeccion = seccion.icon;
              const esActiva = seccionActiva === seccion.id;

              return (
                <motion.button
                  key={seccion.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onCambiarSeccion(seccion.id);
                    onToggleSidebar();
                  }}
                  className={`
                    w-full flex items-center gap-4 p-4 rounded-xl transition-all
                    ${
                      esActiva
                        ? `bg-gradient-to-r ${seccion.bg} border border-white/20`
                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                    }
                  `}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${seccion.bg}`}>
                    <IconoSeccion
                      className={`w-5 h-5 bg-gradient-to-r ${seccion.color} bg-clip-text text-transparent`}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className={`font-bold ${esActiva ? 'text-white' : 'text-gray-300'}`}>
                      {seccion.nombre}
                    </div>
                    <div className="text-xs text-gray-400">{seccion.descripcion}</div>
                  </div>
                  {esActiva && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={`w-1 h-8 rounded-full bg-gradient-to-b ${seccion.color}`}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Footer Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-4 rounded-xl bg-gradient-to-r from-zinc-800/10 to-zinc-800/10 border border-zinc-700/20"
          >
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-zinc-300 mt-1" />
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Sistema Activo</h3>
                <p className="text-xs text-gray-400">Todos los módulos funcionando correctamente</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

Sidebar.propTypes = {
  seccionActiva: PropTypes.string.isRequired,
  onCambiarSeccion: PropTypes.func.isRequired,
  sidebarAbierto: PropTypes.bool.isRequired,
  onToggleSidebar: PropTypes.func.isRequired
};

/**
 * 🎯 Componente Principal
 */
const SistemaGestionFinanciera = () => {
  const [seccionActiva, setSeccionActiva] = useState('dashboard');
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  const seccionActual = SECCIONES.find((s) => s.id === seccionActiva);
  const ComponenteActivo = seccionActual?.componente;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      {/* Sidebar */}
      <Sidebar
        seccionActiva={seccionActiva}
        onCambiarSeccion={setSeccionActiva}
        sidebarAbierto={sidebarAbierto}
        onToggleSidebar={() => setSidebarAbierto(!sidebarAbierto)}
      />

      {/* Overlay cuando sidebar está abierto */}
      <AnimatePresence>
        {sidebarAbierto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarAbierto(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Header Superior */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 h-16 bg-gray-900/80 backdrop-blur-xl border-b border-white/10 z-30 px-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarAbierto(!sidebarAbierto)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
          >
            <Menu className="w-5 h-5 text-gray-400" />
          </motion.button>

          {seccionActual && (
            <motion.div
              key={seccionActiva}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className={`p-2 rounded-lg bg-gradient-to-br ${seccionActual.bg}`}>
                <seccionActual.icon
                  className={`w-5 h-5 bg-gradient-to-r ${seccionActual.color} bg-clip-text text-transparent`}
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">{seccionActual.nombre}</h1>
                <p className="text-xs text-gray-400">{seccionActual.descripcion}</p>
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-9000/20 border border-zinc-500/30"
          >
            <Activity className="w-4 h-4 text-zinc-200" />
            <span className="text-xs text-zinc-200 font-medium">Sistema Activo</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Contenido Principal */}
      <div className="pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={seccionActiva}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {ComponenteActivo && <ComponenteActivo />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SistemaGestionFinanciera;
