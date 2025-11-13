/**
 * 🏦 PANEL BANCO PREMIUM 3D
 * Panel universal premium con diseño 3D superior para todas las bóvedas/bancos
 * - KPIs 3D animados con particles
 * - Gráficos isométricos 3D
 * - Timeline 3D de movimientos
 * - Tabs con glassmorphism
 * - Sistema de temas personalizable
 */
import { useMemo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ArrowRightLeft,
  BarChart3,
  Clock,
  Eye,
  EyeOff,
  Plus,
  Scissors,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import { useBancos } from '../../hooks/useBancos';
import { useCortes } from '../../hooks/useCortes';
import { useTransferencias } from '../../hooks/useTransferencias';
import { formatBovedaName, formatCurrency } from '../../utils/formatters';
import { PremiumModal } from '../PremiumModal';
import { FormCorte, FormGasto, FormIngreso, FormTransferencia } from '../forms';
import { TablaCortes, TablaGastos, TablaIngresos, TablaTransferencias } from '../tables';
import { BarChart3D } from './AnimatedChart3D';
import { MovimientosTimeline3D } from './MovimientosTimeline3D';
import { KPIGrid } from './PremiumKPI3D';

/**
 * Temas de color por banco
 */
const BANK_THEMES = {
  bovedaMonte: {
    primary: 'emerald-500',
    secondary: 'green-600',
    gradient: 'from-emerald-500 to-green-600',
    tailwindColor: 'success',
  },
  bovedaUsa: {
    primary: 'blue-500',
    secondary: 'indigo-600',
    gradient: 'from-blue-500 to-indigo-600',
    tailwindColor: 'info',
  },
  azteca: {
    primary: 'amber-500',
    secondary: 'yellow-600',
    gradient: 'from-amber-500 to-yellow-600',
    tailwindColor: 'warning',
  },
  utilidades: {
    primary: 'purple-500',
    secondary: 'violet-600',
    gradient: 'from-purple-500 to-violet-600',
    tailwindColor: 'secondary',
  },
  fleteSur: {
    primary: 'red-500',
    secondary: 'rose-600',
    gradient: 'from-red-500 to-rose-600',
    tailwindColor: 'error',
  },
  leftie: {
    primary: 'cyan-500',
    secondary: 'teal-600',
    gradient: 'from-cyan-500 to-teal-600',
    tailwindColor: 'info',
  },
  profit: {
    primary: 'lime-500',
    secondary: 'green-600',
    gradient: 'from-lime-500 to-green-600',
    tailwindColor: 'success',
  },
  clientes: {
    primary: 'pink-500',
    secondary: 'rose-600',
    gradient: 'from-pink-500 to-rose-600',
    tailwindColor: 'error',
  },
};

/**
 * Panel Banco Premium 3D
 */
export const PanelBancoPremium3D = ({ bovedaId, bovedaNombre, customTheme }) => {
  const { boveda, obtenerEstadisticas, obtenerHistorico, loading } = useBancos(bovedaId);
  const { transferencias: todasTransferencias } = useTransferencias();
  const { cortes } = useCortes('boveda', bovedaId);

  const [tabActiva, setTabActiva] = useState('dashboard');
  const [modalAbierto, setModalAbierto] = useState(null);
  const [mostrarSaldo, setMostrarSaldo] = useState(true);

  // Tema
  const theme = customTheme || BANK_THEMES[bovedaId] || BANK_THEMES.bovedaMonte;
  const stats = obtenerEstadisticas(bovedaId);
  const historico = obtenerHistorico(bovedaId);

  // Filtrar transferencias
  const transferenciasBovedas =
    todasTransferencias?.filter(
      (t) => t.origenBoveda === bovedaId || t.destinoBoveda === bovedaId
    ) || [];

  // Preparar datos para gráficos
  const datosGraficoIngresos = useMemo(() => {
    // Agrupar últimos 7 días
    const hoy = new Date();
    const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() - (6 - i));
      return {
        fecha: fecha.toISOString().split('T')[0],
        label: fecha.toLocaleDateString('es-MX', { weekday: 'short' }),
        value: 0,
      };
    });

    historico
      .filter((m) => m.tipo === 'INGRESO')
      .forEach((ingreso) => {
        const fecha = new Date(ingreso.fecha).toISOString().split('T')[0];
        const dia = ultimos7Dias.find((d) => d.fecha === fecha);
        if (dia) {
          dia.value += ingreso.impacto;
        }
      });

    return ultimos7Dias;
  }, [historico]);

  const datosGraficoGastos = useMemo(() => {
    const hoy = new Date();
    const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() - (6 - i));
      return {
        fecha: fecha.toISOString().split('T')[0],
        label: fecha.toLocaleDateString('es-MX', { weekday: 'short' }),
        value: 0,
      };
    });

    historico
      .filter((m) => m.tipo === 'GASTO')
      .forEach((gasto) => {
        const fecha = new Date(gasto.fecha).toISOString().split('T')[0];
        const dia = ultimos7Dias.find((d) => d.fecha === fecha);
        if (dia) {
          dia.value += Math.abs(gasto.impacto);
        }
      });

    return ultimos7Dias;
  }, [historico]);

  // KPIs para el dashboard
  const kpis = [
    {
      title: 'Saldo Actual',
      value: stats?.saldo || 0,
      icon: Activity,
      color: theme.tailwindColor,
      format: 'currency',
      subtitle: mostrarSaldo ? '' : '••••••',
    },
    {
      title: 'Total Ingresos',
      value: stats?.totalIngresos || 0,
      icon: TrendingUp,
      color: 'success',
      format: 'currency',
      trend: {
        value: 12.5,
        isPositive: true,
      },
    },
    {
      title: 'Total Gastos',
      value: stats?.totalGastos || 0,
      icon: TrendingDown,
      color: 'error',
      format: 'currency',
      trend: {
        value: -8.3,
        isPositive: false,
      },
    },
    {
      title: 'Movimientos',
      value:
        (stats?.cantidadIngresos || 0) +
        (stats?.cantidadGastos || 0) +
        (stats?.cantidadTransferencias || 0),
      icon: ArrowRightLeft,
      color: 'primary',
      format: 'number',
    },
  ];

  // Tabs
  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      color: theme.tailwindColor,
    },
    {
      id: 'movimientos',
      label: 'Movimientos',
      icon: Clock,
      color: 'primary',
      count: historico.length,
    },
    {
      id: 'ingresos',
      label: 'Ingresos',
      icon: TrendingUp,
      color: 'success',
      count: (boveda?.listaIngresos || boveda?.ingresosList || boveda?.ingresos || []).length,
    },
    {
      id: 'gastos',
      label: 'Gastos',
      icon: TrendingDown,
      color: 'error',
      count: (boveda?.listaGastos || boveda?.gastosList || boveda?.gastos || []).length,
    },
    {
      id: 'transferencias',
      label: 'Transferencias',
      icon: ArrowRightLeft,
      color: 'info',
      count: transferenciasBovedas.length,
    },
    {
      id: 'cortes',
      label: 'Cortes',
      icon: Scissors,
      color: 'warning',
      count: cortes?.length || 0,
    },
  ];

  const handleSuccess = () => {
    setModalAbierto(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Premium */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          relative backdrop-blur-xl rounded-3xl overflow-hidden
          bg-gradient-to-br from-${theme.primary}/20 via-${theme.secondary}/10 to-transparent
          border border-${theme.primary}/30
          shadow-2xl shadow-${theme.primary}/20
          p-8
        `}
      >
        {/* Fondo animado */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold text-white font-display mb-2 flex items-center gap-3"
            >
              {bovedaNombre || formatBovedaName(bovedaId)}
            </motion.h1>
            <p className="text-white/60">Panel de gestión completo con visualización 3D</p>
          </div>

          {/* Saldo destacado */}
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2 justify-end">
              <p className="text-white/60 text-sm">Saldo Actual</p>
              <button
                onClick={() => setMostrarSaldo(!mostrarSaldo)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
              >
                {mostrarSaldo ? (
                  <Eye className="w-4 h-4 text-white/60" />
                ) : (
                  <EyeOff className="w-4 h-4 text-white/60" />
                )}
              </button>
            </div>
            {mostrarSaldo ? (
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`text-5xl font-bold text-${theme.primary} font-display`}
              >
                {formatCurrency(stats?.saldo || 0)}
              </motion.p>
            ) : (
              <p className="text-5xl font-bold text-white/20">••••••</p>
            )}
          </div>
        </div>

        {/* Brillo superior */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      </motion.div>

      {/* Tabs Premium */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tabActiva === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap
                backdrop-blur-xl flex items-center gap-2
                ${
                  isActive
                    ? `bg-${tab.color}/20 text-${tab.color} border-2 border-${tab.color}/40 shadow-lg shadow-${tab.color}/20`
                    : 'bg-white/5 text-white/60 border border-white/10 hover:text-white hover:bg-white/10 hover:border-white/20'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`
                  ml-1 px-2 py-0.5 rounded-full text-xs font-bold
                  ${isActive ? `bg-${tab.color}/30` : 'bg-white/10'}
                `}
                >
                  {tab.count}
                </span>
              )}

              {/* Indicador activo inferior */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradient}`}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Contenido de tabs */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tabActiva}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* DASHBOARD */}
          {tabActiva === 'dashboard' && (
            <div className="space-y-6">
              {/* KPIs Grid */}
              <KPIGrid kpis={kpis} columns={4} gap={4} />

              {/* Gráficos */}
              <div className="grid grid-cols-2 gap-6">
                {/* Ingresos */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6"
                >
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-success" />
                    Ingresos últimos 7 días
                  </h3>
                  <BarChart3D data={datosGraficoIngresos} height={300} color="success" />
                </motion.div>

                {/* Gastos */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6"
                >
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-error" />
                    Gastos últimos 7 días
                  </h3>
                  <BarChart3D data={datosGraficoGastos} height={300} color="error" />
                </motion.div>
              </div>

              {/* Timeline de movimientos recientes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6"
              >
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Movimientos Recientes
                </h3>
                <MovimientosTimeline3D movimientos={historico} maxItems={5} showFilters={false} />
              </motion.div>
            </div>
          )}

          {/* MOVIMIENTOS TIMELINE */}
          {tabActiva === 'movimientos' && (
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
              <MovimientosTimeline3D movimientos={historico} maxItems={20} />
            </div>
          )}

          {/* INGRESOS */}
          {tabActiva === 'ingresos' && (
            <>
              <div className="flex justify-end mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setModalAbierto('ingreso')}
                  className="px-4 py-2 bg-gradient-to-r from-success/20 to-success/30 hover:from-success/30 hover:to-success/40 border border-success/30 rounded-xl text-success font-medium shadow-lg shadow-success/20 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nuevo Ingreso
                </motion.button>
              </div>
              <TablaIngresos
                ingresos={boveda?.listaIngresos || boveda?.ingresosList || boveda?.ingresos || []}
                loading={loading}
              />
            </>
          )}

          {/* GASTOS */}
          {tabActiva === 'gastos' && (
            <>
              <div className="flex justify-end mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setModalAbierto('gasto')}
                  className="px-4 py-2 bg-gradient-to-r from-error/20 to-error/30 hover:from-error/30 hover:to-error/40 border border-error/30 rounded-xl text-error font-medium shadow-lg shadow-error/20 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nuevo Gasto
                </motion.button>
              </div>
              <TablaGastos
                gastos={boveda?.listaGastos || boveda?.gastosList || boveda?.gastos || []}
                loading={loading}
              />
            </>
          )}

          {/* TRANSFERENCIAS */}
          {tabActiva === 'transferencias' && (
            <>
              <div className="flex justify-end mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setModalAbierto('transferencia')}
                  className="px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 border border-primary/30 rounded-xl text-primary font-medium shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nueva Transferencia
                </motion.button>
              </div>
              <TablaTransferencias
                transferencias={transferenciasBovedas}
                bovedaId={bovedaId}
                loading={loading}
              />
            </>
          )}

          {/* CORTES */}
          {tabActiva === 'cortes' && (
            <>
              <div className="flex justify-end mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setModalAbierto('corte')}
                  className="px-4 py-2 bg-gradient-to-r from-warning/20 to-warning/30 hover:from-warning/30 hover:to-warning/40 border border-warning/30 rounded-xl text-warning font-medium shadow-lg shadow-warning/20 transition-all flex items-center gap-2"
                >
                  <Scissors className="w-4 h-4" />
                  Ejecutar Corte
                </motion.button>
              </div>
              <TablaCortes cortes={cortes || []} loading={loading} />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Modales */}
      <PremiumModal
        isOpen={modalAbierto === 'ingreso'}
        onClose={() => setModalAbierto(null)}
        title="Nuevo Ingreso"
      >
        <FormIngreso
          bovedaId={bovedaId}
          bovedaNombre={bovedaNombre}
          onSuccess={handleSuccess}
          onCancel={() => setModalAbierto(null)}
        />
      </PremiumModal>

      <PremiumModal
        isOpen={modalAbierto === 'gasto'}
        onClose={() => setModalAbierto(null)}
        title="Nuevo Gasto"
      >
        <FormGasto
          bovedaId={bovedaId}
          bovedaNombre={bovedaNombre}
          onSuccess={handleSuccess}
          onCancel={() => setModalAbierto(null)}
        />
      </PremiumModal>

      <PremiumModal
        isOpen={modalAbierto === 'transferencia'}
        onClose={() => setModalAbierto(null)}
        title="Nueva Transferencia"
      >
        <FormTransferencia onSuccess={handleSuccess} onCancel={() => setModalAbierto(null)} />
      </PremiumModal>

      <PremiumModal
        isOpen={modalAbierto === 'corte'}
        onClose={() => setModalAbierto(null)}
        title="Corte de Bóveda"
      >
        <FormCorte
          bovedaId={bovedaId}
          bovedaNombre={bovedaNombre}
          onSuccess={handleSuccess}
          onCancel={() => setModalAbierto(null)}
        />
      </PremiumModal>
    </div>
  );
};

export default PanelBancoPremium3D;
