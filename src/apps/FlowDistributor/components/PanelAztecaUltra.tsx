/**
 * 🔷 PANEL AZTECA ULTRA - PREMIUM EDITION
 * ========================================
 * Theme: Cyan/Blue (#06b6d4, #3b82f6)
 * Chart: AdvancedScatterChart (análisis de riesgo)
 * Features: CriticalAlertBanner, negative RF warning
 * 🔥 FIRESTORE REAL-TIME CONNECTION
 */

import type { FC } from 'react';
import { memo, useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import {
    Activity,
    AlertTriangle,
    ArrowRightLeft,
    DollarSign,
    Scissors,
    Target,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';

// 🔥 FIRESTORE IMPORTS
import { useBancoData } from '../services/firestore-hooks.service';
import { PremiumLoadingScreen } from './shared/PremiumLoadingScreen';

import DATOS_BOVEDAS_COMPLETOS from '../../../data/datos_bovedas_completos.json';
import { animations, CreativeParticles, KpiCard3D } from '../shared';
import { AdvancedScatterChart } from '../shared/AdvancedScatterChart';
import {
    TablaCortesPremium,
    TablaGastosPremium,
    TablaIngresosPremium,
    TablaTransferenciasPremium,
} from './TablasBancoPremium';

const PanelAztecaUltra: FC = memo(() => {
  const [tabActiva, setTabActiva] = useState('graficos');

  // 🔥 FIRESTORE REAL-TIME CONNECTION
  const { gastos, ingresos, loading, stats, error } = useBancoData('azteca');

  const datosManual = useMemo(() => ({
    totalIngresos: stats.totalIngresos,
    totalGastos: stats.totalGastos,
    ingresosList: ingresos.map((item, idx) => ({
      id: `ing-azt-${idx}`,
      ...item,
    })),
    gastosList: gastos.map((item, idx) => ({
      id: `gast-azt-${idx}`,
      ...item,
    })),
    cortesList: [], // TODO: Agregar cuando esté disponible
    transferenciasList: [], // TODO: Agregar cuando esté disponible
  }), [gastos, ingresos, stats]);  const rfActual = useMemo(
    () => DATOS_BOVEDAS_COMPLETOS.controlMaestro?.rfActual?.paneles?.['Azteca'] || -178714.88,
    []
  );

  const totalIngresos = datosManual.totalIngresos;
  const totalGastos = datosManual.totalGastos;
  const balance = totalIngresos - totalGastos;
  const isNegativeBalance = rfActual < 0;

  // Scatter Data - Análisis de Riesgo (Ingreso vs Gasto por transacción)
  const scatterData = useMemo(() => {
    return datosManual.ingresosList.slice(0, 20).map((ing: any, idx: number) => {
      const gasto = datosManual.gastosList[idx];
      return {
        x: ing.ingreso || 0,
        y: gasto?.gasto || 0,
        z: Math.abs((ing.ingreso || 0) - (gasto?.gasto || 0)),
        name: ing.cliente || `Trans ${idx + 1}`,
        category: ing.observaciones || 'Sin categoría',
      };
    });
  }, [datosManual]);

  const tabs = [
    { id: 'graficos', label: 'Análisis Riesgo', icon: Target, count: 1 },
    { id: 'ingresos', label: 'Ingresos', icon: TrendingUp, count: datosManual.ingresosList.length },
    { id: 'gastos', label: 'Gastos', icon: TrendingDown, count: datosManual.gastosList.length },
    { id: 'cortes', label: 'Cortes RF', icon: Scissors, count: datosManual.cortesList.length },
    {
      id: 'transferencias',
      label: 'Transferencias',
      icon: ArrowRightLeft,
      count: datosManual.transferenciasList.length,
    },
  ];

  // 🔄 Loading Screen
  if (loading) {
    return <PremiumLoadingScreen message="Cargando Banco Azteca..." theme="blue" />;
  }

  // ⚠️ Error handling
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error al cargar datos</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "#0a0e27" }}
    >
      <CreativeParticles
        count={30}
        colors={["#10b981", "#34d399"]}
      />

      <div className="relative z-10 p-6 max-w-[1800px] mx-auto">
        <motion.div {...animations.container.fadeSlideUp} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold" style={{ color: "#f8fafc" }}>
              🔷 Azteca Ultra
            </h1>
            {isNegativeBalance && (
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="px-3 py-1 rounded-lg bg-red-500/20 border border-red-500 flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-bold text-red-400">RF NEGATIVO</span>
              </motion.div>
            )}
          </div>
          <p style={{ color: "#cbd5e1" }}>
            Risk Analysis Dashboard - Cyan/Blue Theme
          </p>
        </motion.div>

        {/* Critical Alert Banner */}
        {isNegativeBalance && (
          <motion.div
            {...animations.container.fadeSlideUp}
            className="mb-6 p-4 rounded-xl border-2 border-red-500 bg-red-500/10 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-red-400 mb-1">⚠️ Alerta Crítica</h3>
                <p className="text-sm text-red-300">
                  RF Actual negativo: ${Math.abs(rfActual).toLocaleString('es-MX')} - Requiere
                  acción inmediata
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          {...animations.container}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
        >
          <KpiCard3D
            title="Total Ingresos"
            value={`$${totalIngresos.toLocaleString('es-MX')}`}
            icon={DollarSign}
            trend={8.2}
            color={"#10b981"}
          />
          <KpiCard3D
            title="Total Gastos"
            value={`$${totalGastos.toLocaleString('es-MX')}`}
            icon={TrendingDown}
            trend={-15.8}
            color={"#ef4444"}
          />
          <KpiCard3D
            title="Balance Neto"
            value={`$${balance.toLocaleString('es-MX')}`}
            icon={Activity}
            trend={balance >= 0 ? 2.1 : -12.5}
            color={balance >= 0 ? "#10b981" : "#ef4444"}
          />
          <KpiCard3D
            title="RF Actual"
            value={`$${rfActual.toLocaleString('es-MX')}`}
            icon={rfActual >= 0 ? TrendingUp : TrendingDown}
            trend={rfActual >= 0 ? 1.5 : -18.2}
            color={rfActual >= 0 ? "#34d399" : "#ef4444"}
          />
        </motion.div>

        <motion.div {...animations.container.fadeSlideUp} className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab, idx) => (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTabActiva(tab.id)}
                className="px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all whitespace-nowrap"
                style={{
                  background:
                    tabActiva === tab.id
                      ? `linear-gradient(135deg, ${"#10b981"}, ${"#34d399"})`
                      : "rgba(30, 41, 59, 0.6)",
                  color: tabActiva === tab.id ? 'white' : "#cbd5e1",
                  border: `1px solid ${tabActiva === tab.id ? "#10b981" : "rgba(148, 163, 184, 0.1)"}`,
                  boxShadow:
                    tabActiva === tab.id ? `0 0 20px ${"#10b981"}40` : 'none',
                }}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{
                      background:
                        tabActiva === tab.id
                          ? 'rgba(255,255,255,0.2)'
                          : "#10b981",
                      color: 'white',
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {tabActiva === 'graficos' && (
          <motion.div
            {...animations.container.fadeSlideUp}
            className="rounded-2xl p-6"
            style={{
              background: "rgba(30, 41, 59, 0.6)",
              backdropFilter: "blur(10px)",
              border: `1px solid ${"rgba(148, 163, 184, 0.1)"}`,
            }}
          >
            <AdvancedScatterChart
              data={scatterData}
              title="Análisis de Riesgo - Ingresos vs Gastos"
              colors={["#10b981", "#34d399"]}
              height={500}
              showQuadrants={true}
              showCorrelation={true}
              onPointClick={(data) => console.log('Point clicked:', data)}
            />
          </motion.div>
        )}

        {tabActiva === 'ingresos' && (
          <TablaIngresosPremium
            ingresos={datosManual.ingresosList}
            color={"#10b981"}
          />
        )}

        {tabActiva === 'gastos' && (
          <TablaGastosPremium
            gastos={datosManual.gastosList}
            color={"#10b981"}
          />
        )}

        {tabActiva === 'cortes' && (
          <TablaCortesPremium
            cortes={datosManual.cortesList}
            color={"#10b981"}
          />
        )}

        {tabActiva === 'transferencias' && (
          <TablaTransferenciasPremium
            transferencias={datosManual.transferenciasList}
            color={"#10b981"}
          />
        )}
      </div>
    </div>
  );
});

PanelAztecaUltra.displayName = 'PanelAztecaUltra';

export default PanelAztecaUltra;
