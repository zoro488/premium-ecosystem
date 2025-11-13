/**
 * 🏦 PANEL BÓVEDA USA ULTRA - PREMIUM EDITION
 * ============================================
 * Theme: Blue/Indigo (#3b82f6, #6366f1)
 * Chart: AdvancedFunnelChart (conversion flow)
 * Special: ExchangeRateMonitor integration
 */
import type { FC } from 'react';
import { memo, useMemo, useState } from 'react';

import { PremiumLoadingScreen } from '@flowdistributor-components/PremiumLoadingScreen';
import { CreativeParticles } from '@flowdistributor-components/shared/CreativeParticles';
import { KpiCard3D } from '@flowdistributor-components/shared/KpiCard3D';
import { AdvancedBarChart } from '@flowdistributor-shared/AdvancedBarChart';
import animations from '@flowdistributor/design-system/animations';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ArrowRightLeft,
  BarChart3,
  DollarSign,
  Scissors,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import DATOS_BOVEDAS_COMPLETOS from '../../../data/datos_bovedas_completos.json';
import panelDataManual from '../data/panel-boveda-usa-manual.json';
import {
  TablaCortesPremium,
  TablaGastosPremium,
  TablaIngresosPremium,
  TablaTransferenciasPremium,
} from './TablasBancoPremium';

// Types
interface Ingreso {
  id: string;
  fecha: string;
  cliente: string;
  ingreso: number;
  destino: string;
  observaciones?: string;
}

interface Gasto {
  id: string;
  fecha: string;
  descripcion: string;
  gasto: number;
  origen: string;
  observaciones?: string;
}

interface Corte {
  id: string;
  fecha: string;
  monto: number;
  tipo: string;
}

interface Transferencia {
  id: string;
  fecha: string;
  origen: string;
  destino: string;
  monto: number;
  observaciones?: string;
}

// Main Component
const PanelBovedaUSAUltra: FC = memo(() => {
  const [loading, setLoading] = useState(false);
  const [tabActiva, setTabActiva] = useState<string>('graficos');

  // Get data from manual JSON
  const datosManual = useMemo(() => {
    const data = panelDataManual.bovedaUsa;
    return {
      totalIngresos: data.ingresos || 0,
      ingresosList: (data.ingresosList || []).map((item: Record<string, unknown>, idx: number) => ({
        id: `ing-usa-${idx}`,
        fecha: item.fecha as string,
        cliente: item.cliente as string,
        ingreso: item.ingreso as number,
        destino: item.destino as string,
        observaciones: item.observaciones as string,
      })),
      totalGastos: data.gastos || 0,
      gastosList: (data.gastosList || []).map((item: Record<string, unknown>, idx: number) => ({
        id: `gast-usa-${idx}`,
        fecha: item.fecha as string,
        descripcion: item.descripcion as string,
        gasto: item.gasto as number,
        origen: item.origen as string,
        observaciones: item.observaciones as string,
      })),
      cortesList: (data.cortesList || []).map((item: Record<string, unknown>, idx: number) => ({
        id: `corte-usa-${idx}`,
        fecha: item.fecha as string,
        monto: item.monto as number,
        tipo: (item.tipo as string) || 'Corte RF',
      })),
      transferenciasList: (data.transferenciasList || []).map(
        (item: Record<string, unknown>, idx: number) => ({
          id: `trans-usa-${idx}`,
          fecha: item.fecha as string,
          origen: item.origen as string,
          destino: item.destino as string,
          monto: item.monto as number,
          observaciones: item.observaciones as string,
        })
      ),
    };
  }, []);

  // Get RF Actual from master data
  const rfActual = useMemo(() => {
    return DATOS_BOVEDAS_COMPLETOS.controlMaestro?.rfActual?.paneles?.['Bóveda USA'] || 128005;
  }, []);

  // KPIs
  const totalIngresos = datosManual.totalIngresos;
  const totalGastos = datosManual.totalGastos;
  const balance = totalIngresos - totalGastos;

  // Chart Data - Funnel Flow
  const funnelData = useMemo(
    () => [
      {
        category: 'Ingresos Totales',
        value: totalIngresos / 1000,
        color: "#8b5cf6",
      },
      {
        category: 'Después Gastos',
        value: balance / 1000,
        color: "#a78bfa",
      },
      { category: 'RF Actual', value: rfActual / 1000, color: "#06b6d4" },
    ],
    [totalIngresos, balance, rfActual]
  );

  // Tabs config
  const tabs = [
    { id: 'graficos', label: 'Gráficos', icon: BarChart3, count: 1 },
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
      {/* Particles Background */}
      <CreativeParticles
        count={30}
        colors={["#8b5cf6", "#a78bfa"]}
      />

      {/* Main Content */}
      <div className="relative z-10 p-6 max-w-[1800px] mx-auto">
        {/* Header */}
        <motion.div {...animations.container.fadeSlideUp} className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "#f8fafc" }}>
            💎 Bóveda USA Ultra
          </h1>
          <p style={{ color: "#cbd5e1" }}>
            International Operations - Blue/Indigo Theme
          </p>
        </motion.div>

        {/* KPIs Grid */}
        <motion.div
          {...animations.container}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
        >
          <KpiCard3D
            title="Total Ingresos"
            value={`$${totalIngresos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
            icon={DollarSign}
            trend={+12.5}
            color={"#8b5cf6"}
          />
          <KpiCard3D
            title="Total Gastos"
            value={`$${totalGastos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
            icon={TrendingDown}
            trend={-8.3}
            color={"#ef4444"}
          />
          <KpiCard3D
            title="Balance Neto"
            value={`$${balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
            icon={Activity}
            trend={balance >= 0 ? +5.2 : -5.2}
            color={balance >= 0 ? "#10b981" : "#ef4444"}
          />
          <KpiCard3D
            title="RF Actual"
            value={`$${rfActual.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
            icon={TrendingUp}
            trend={+3.8}
            color={"#a78bfa"}
          />
        </motion.div>

        {/* Tabs */}
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
                      ? `linear-gradient(135deg, ${"#8b5cf6"} 0%, ${"#a78bfa"} 100%)`
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

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {tabActiva === 'graficos' && (
            <motion.div
              key="graficos"
              {...animations.container.fadeSlideUp}
              exit={animations.container.fadeSlideUp.initial}
              className="rounded-2xl p-6"
              style={{
                background: "rgba(30, 41, 59, 0.6)",
                backdropFilter: "blur(10px)",
                border: `1px solid ${"rgba(148, 163, 184, 0.1)"}`,
              }}
            >
              <AdvancedBarChart
                data={funnelData}
                title="Funnel Analysis - Conversion Flow"
                colors={[
                  "#8b5cf6",
                  "#a78bfa",
                  "#06b6d4",
                ]}
                height={500}
                horizontal={false}
                showComparison={false}
                onBarClick={(data) => console.log('Bar clicked:', data)}
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
        </AnimatePresence>
      </div>
    </div>
  );
});

PanelBovedaUSAUltra.displayName = 'PanelBovedaUSAUltra';

export default PanelBovedaUSAUltra;
