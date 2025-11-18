/**
 * 💚 PANEL UTILIDADES ULTRA - PREMIUM EDITION
 * ===========================================
 * Theme: Green/Emerald (#10b981, #059669)
 * Chart: AdvancedTreemapChart (categorías jerárquicas)
 */
import type { FC } from 'react';
import { memo, useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRightLeft,
  DollarSign,
  Layers,
  Scissors,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import DATOS_BOVEDAS_COMPLETOS from '../../../data/datos_bovedas_completos.json';
import panelDataManual from '../data/panel-utilidades-manual.json';
import { CreativeParticles, KpiCard3D, PremiumLoadingScreen, animations } from '../shared';
import { AdvancedTreemapChart } from '../shared/AdvancedTreemapChart';
import {
  TablaCortesPremium,
  TablaGastosPremium,
  TablaIngresosPremium,
  TablaTransferenciasPremium,
} from './TablasBancoPremium';

const PanelUtilidadesUltra: FC = memo(() => {
  const [loading] = useState(false);
  const [tabActiva, setTabActiva] = useState('graficos');

  const datosManual = useMemo(() => {
    const data = panelDataManual.utilidades;
    return {
      totalIngresos: data.ingresos || 0,
      ingresosList: (data.ingresosList || []).map((item: any, idx: number) => ({
        id: `ing-util-${idx}`,
        ...item,
      })),
      totalGastos: data.gastos || 0,
      gastosList: (data.gastosList || []).map((item: any, idx: number) => ({
        id: `gast-util-${idx}`,
        ...item,
      })),
      cortesList: (data.cortesList || []).map((item: any, idx: number) => ({
        id: `corte-util-${idx}`,
        ...item,
      })),
      transferenciasList: (data.transferenciasList || []).map((item: any, idx: number) => ({
        id: `trans-util-${idx}`,
        ...item,
      })),
    };
  }, []);

  const rfActual = useMemo(
    () => DATOS_BOVEDAS_COMPLETOS.controlMaestro?.rfActual?.paneles?.['Utilidades'] || 205658,
    []
  );

  const totalIngresos = datosManual.totalIngresos;
  const totalGastos = datosManual.totalGastos;
  const balance = totalIngresos - totalGastos;

  // Treemap Data - Categorías
  const treemapData = useMemo(() => {
    const categorias: Record<string, number> = {};
    datosManual.ingresosList.forEach((ing: any) => {
      const cat = ing.cliente || 'Otros';
      categorias[cat] = (categorias[cat] || 0) + (ing.ingreso || 0);
    });

    return Object.entries(categorias)
      .map(([name, size]) => ({ name, size, color: "#10b981" }))
      .sort((a, b) => b.size - a.size)
      .slice(0, 10); // Top 10
  }, [datosManual.ingresosList]);

  const tabs = [
    { id: 'graficos', label: 'Gráficos', icon: Layers, count: 1 },
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

  if (loading) return <PremiumLoadingScreen />;

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "#0a0e27" }}
    >
      <CreativeParticles
        count={30}
        colors={["#8b5cf6", "#a78bfa"]}
      />

      <div className="relative z-10 p-6 max-w-[1800px] mx-auto">
        <motion.div {...animations.container.fadeSlideUp} className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "#f8fafc" }}>
            💚 Utilidades Ultra
          </h1>
          <p style={{ color: "#cbd5e1" }}>
            Análisis de Categorías - Green/Emerald Theme
          </p>
        </motion.div>

        <motion.div
          {...animations.container}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
        >
          <KpiCard3D
            title="Total Ingresos"
            value={`$${totalIngresos.toLocaleString('es-MX')}`}
            icon={DollarSign}
            trend={15.2}
            color={"#8b5cf6"}
          />
          <KpiCard3D
            title="Total Gastos"
            value={`$${totalGastos.toLocaleString('es-MX')}`}
            icon={TrendingDown}
            trend={-6.8}
            color={"#ef4444"}
          />
          <KpiCard3D
            title="Balance Neto"
            value={`$${balance.toLocaleString('es-MX')}`}
            icon={Activity}
            trend={balance >= 0 ? 8.5 : -8.5}
            color={balance >= 0 ? "#10b981" : "#ef4444"}
          />
          <KpiCard3D
            title="RF Actual"
            value={`$${rfActual.toLocaleString('es-MX')}`}
            icon={TrendingUp}
            trend={4.2}
            color={"#a78bfa"}
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
                      ? `linear-gradient(135deg, ${"#8b5cf6"}, ${"#a78bfa"})`
                      : "rgba(30, 41, 59, 0.6)",
                  color: tabActiva === tab.id ? 'white' : "#cbd5e1",
                  border: `1px solid ${tabActiva === tab.id ? "#8b5cf6" : "rgba(148, 163, 184, 0.1)"}`,
                  boxShadow:
                    tabActiva === tab.id
                      ? `0 0 20px ${"#8b5cf6"}40`
                      : 'none',
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
                          : "#8b5cf6",
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
            <AdvancedTreemapChart
              data={treemapData}
              title="Distribución por Categorías - Top 10"
              colors={[
                "#8b5cf6",
                "#a78bfa",
                "#10b981",
                "#06b6d4",
              ]}
              height={500}
              onNodeClick={(data) => console.log('Node clicked:', data)}
            />
          </motion.div>
        )}

        {tabActiva === 'ingresos' && (
          <TablaIngresosPremium
            ingresos={datosManual.ingresosList}
            color={"#8b5cf6"}
          />
        )}

        {tabActiva === 'gastos' && (
          <TablaGastosPremium
            gastos={datosManual.gastosList}
            color={"#8b5cf6"}
          />
        )}

        {tabActiva === 'cortes' && (
          <TablaCortesPremium
            cortes={datosManual.cortesList}
            color={"#8b5cf6"}
          />
        )}

        {tabActiva === 'transferencias' && (
          <TablaTransferenciasPremium
            transferencias={datosManual.transferenciasList}
            color={"#8b5cf6"}
          />
        )}
      </div>
    </div>
  );
});

PanelUtilidadesUltra.displayName = 'PanelUtilidadesUltra';

export default PanelUtilidadesUltra;
