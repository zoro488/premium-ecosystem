/**
 * 🎯 GESTIÓN DE COMPRAS - Panel Integrado
 * Sistema completo de órdenes de compra y distribuidores
 */
import { useState } from 'react';
import PropTypes from 'prop-types';

import { AnimatePresence, motion } from 'framer-motion';
import { Building2, ShoppingCart } from 'lucide-react';

import PanelDistribuidores from './PanelDistribuidoresUltra';
import './PanelDistribuidores.css';
import PanelOrdenesCompra from './PanelOrdenesCompraUltra';

/**
 * 🎨 COMPONENTE PRINCIPAL
 */
export default function GestionCompras() {
  const [vistaActiva, setVistaActiva] = useState('ordenes'); // ordenes | distribuidores

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navegación Superior */}
      <NavegacionPrincipal vistaActiva={vistaActiva} setVistaActiva={setVistaActiva} />

      {/* Contenido Principal */}
      <AnimatePresence mode="wait">
        {vistaActiva === 'ordenes' && (
          <motion.div
            key="ordenes"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <PanelOrdenesCompra />
          </motion.div>
        )}

        {vistaActiva === 'distribuidores' && (
          <motion.div
            key="distribuidores"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PanelDistribuidores />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * 🧭 NAVEGACIÓN PRINCIPAL
 */
function NavegacionPrincipal({ vistaActiva, setVistaActiva }) {
  const vistas = [
    {
      id: 'ordenes',
      label: 'Órdenes de Compra',
      icon: ShoppingCart,
      color: 'from-zinc-800 to-zinc-900',
      description: 'Gestión completa de órdenes',
    },
    {
      id: 'distribuidores',
      label: 'Distribuidores',
      icon: Building2,
      color: 'from-zinc-800 to-zinc-700',
      description: 'Perfiles y pagos',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-white/10 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          {/* Logo/Título */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 via-zinc-800 to-zinc-700 flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Gestión de Compras</h1>
              <p className="text-xs text-slate-400">Sistema Premium FlowDistributor</p>
            </div>
          </div>

          {/* Indicador de vista activa */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-slate-300">Sistema Activo</span>
          </div>
        </div>

        {/* Tabs de Navegación */}
        <div className="flex gap-3">
          {vistas.map((vista) => {
            const Icon = vista.icon;
            const isActive = vistaActiva === vista.id;

            return (
              <motion.button
                key={vista.id}
                onClick={() => setVistaActiva(vista.id)}
                className={`
                  relative flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl
                  transition-all overflow-hidden group
                  ${
                    isActive
                      ? 'bg-white/10 border border-white/20 shadow-lg'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }
                `}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Fondo gradiente animado */}
                {isActive && (
                  <motion.div
                    layoutId="activeView"
                    className={`absolute inset-0 bg-gradient-to-r ${vista.color} opacity-10`}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {/* Contenido */}
                <div className="relative z-10 flex items-center gap-3">
                  <div
                    className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    transition-all
                    ${
                      isActive
                        ? `bg-gradient-to-br ${vista.color} shadow-lg`
                        : 'bg-white/10 group-hover:bg-white/20'
                    }
                  `}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <div className="text-left">
                    <p
                      className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors`}
                    >
                      {vista.label}
                    </p>
                    <p
                      className={`text-xs ${isActive ? 'text-slate-300' : 'text-slate-500'} transition-colors`}
                    >
                      {vista.description}
                    </p>
                  </div>
                </div>

                {/* Indicador activo */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${vista.color}`}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

NavegacionPrincipal.propTypes = {
  vistaActiva: PropTypes.string.isRequired,
  setVistaActiva: PropTypes.func.isRequired,
};
