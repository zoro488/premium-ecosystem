/**
 * 🍯 PANEL MIEL ULTRA - PREMIUM EDITION
 * ======================================
 * Theme: Yellow/Amber (#fbbf24, #f59e0b)
 * Chart: AdvancedPieChart (distribución de recursos)
 * Features: Resource distribution, ROI analysis, sweet spot tracking
 */

import type { FC } from 'react';
import { memo, useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import {
    Activity,
    ArrowRightLeft,
    DollarSign,
    Percent,
    Scissors,
    Sparkles,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';

import DATOS_BOVEDAS_COMPLETOS from '../../../data/datos_bovedas_completos.json';
import { animations, CreativeParticles, KpiCard3D, PremiumLoadingScreen } from '../shared';
import { AdvancedPieChart } from '../shared/AdvancedPieChart';
import {
    TablaCortesPremium,
    TablaGastosPremium,
    TablaIngresosPremium,
    TablaTransferenciasPremium,
} from './TablasBancoPremium';

const PanelMielUltra: FC = memo(() => {
  const [loading] = useState(false);
  const [tabActiva, setTabActiva] = useState('graficos');

  // Datos simulados para Miel (fondo especial/utilidades)
  const datosManual = useMemo(() => {
    return {
      totalIngresos: 580000,
      ingresosList: Array.from({ length: 20 }, (_, i) => ({
        id: `ing-miel-${i}`,
        fecha: new Date(2025, 0, i + 1).toISOString().split('T')[0],
        cliente: `Ingreso Especial ${i + 1}`,
        ingreso: Math.floor(Math.random() * 40000) + 15000,
        concepto: 'Utilidades/Bonos',
      })),
      totalGastos: 195000,
      gastosList: Array.from({ length: 14 }, (_, i) => ({
        id: `gast-miel-${i}`,
        fecha: new Date(2025, 0, i + 2).toISOString().split('T')[0],
        proveedor: `Inversión ${i + 1}`,
        gasto: Math.floor(Math.random() * 18000) + 8000,
        concepto: 'Inversiones estratégicas',
      })),
      cortesList: Array.from({ length: 6 }, (_, i) => ({
        id: `corte-miel-${i}`,
        fecha: new Date(2025, 0, (i + 1) * 5).toISOString().split('T')[0],
        corte: Math.floor(Math.random() * 120000) + 60000,
        concepto: `Corte quincenal ${i + 1}`,
      })),
      transferenciasList: Array.from({ length: 12 }, (_, i) => ({
        id: `trans-miel-${i}`,
        fecha: new Date(2025, 0, i + 1).toISOString().split('T')[0],
        monto: Math.floor(Math.random() * 35000) + 15000,
        bancoOrigen: i % 3 === 0 ? 'Miel' : 'Utilidades',
        bancoDestino: i % 3 === 0 ? 'Guardadito' : 'Miel',
        concepto: 'Redistribución de utilidades',
      })),
    };
  }, []);

  const rfActual = useMemo(
    () => DATOS_BOVEDAS_COMPLETOS.controlMaestro?.rfActual?.paneles?.['Miel'] || 385000,
    []
  );

  const totalIngresos = datosManual.totalIngresos;
  const totalGastos = datosManual.totalGastos;
  const balance = totalIngresos - totalGastos;
  const roiPercentage = ((balance / totalGastos) * 100).toFixed(1);

  // Pie Chart Data - Distribución de recursos
  const pieChartData = useMemo(() => {
    return [
      { name: 'Operaciones', value: 35, fill: '#f59e0b' },
      { name: 'Inversiones', value: 28, fill: '#fbbf24' },
      { name: 'Reservas', value: 20, fill: '#10b981' },
      { name: 'Bonos', value: 12, fill: '#3b82f6' },
      { name: 'Otros', value: 5, fill: '#8b5cf6' },
    ];
  }, []);

  const tabs = [
    { id: 'graficos', label: 'Distribución', icon: Activity, count: 1 },
    { id: 'ingresos', label: 'Utilidades', icon: TrendingUp, count: datosManual.ingresosList.length },
    { id: 'gastos', label: 'Inversiones', icon: TrendingDown, count: datosManual.gastosList.length },
    { id: 'cortes', label: 'Cortes RF', icon: Scissors, count: datosManual.cortesList.length },
    {
      id: 'transferencias',
      label: 'Redistribuciones',
      icon: ArrowRightLeft,
      count: datosManual.transferenciasList.length,
    },
  ];

  if (loading) return <PremiumLoadingScreen />;

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: '#0a0e27' }}
    >
      <CreativeParticles count={40} colors={['#fbbf24', '#f59e0b']} />

      <div className="relative z-10 p-6 max-w-[1800px] mx-auto">
        <motion.div {...animations.container.fadeSlideUp} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-10 h-10 text-amber-500" />
            <h1 className="text-4xl font-bold" style={{ color: '#f8fafc' }}>
              🍯 Miel Ultra
            </h1>
          </div>
          <p style={{ color: '#cbd5e1' }}>
            Resource Distribution Dashboard - Yellow/Amber Theme
          </p>
        </motion.div>

        {/* KPIs */}
        <motion.div
          {...animations.container.staggerChildren}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <KpiCard3D
            title="RF Actual"
            value={`$${rfActual.toLocaleString('es-MX')}`}
            change="+18.7%"
            trend="up"
            icon={<DollarSign className="w-6 h-6" />}
            color="#fbbf24"
          />

          <KpiCard3D
            title="Total Utilidades"
            value={`$${totalIngresos.toLocaleString('es-MX')}`}
            change="+24.3%"
            trend="up"
            icon={<TrendingUp className="w-6 h-6" />}
            color="#10b981"
          />

          <KpiCard3D
            title="Total Inversiones"
            value={`$${totalGastos.toLocaleString('es-MX')}`}
            change="+16.8%"
            trend="up"
            icon={<TrendingDown className="w-6 h-6" />}
            color="#3b82f6"
          />

          <KpiCard3D
            title="ROI"
            value={`${roiPercentage}%`}
            change={`+$${balance.toLocaleString('es-MX')}`}
            trend="up"
            icon={<Percent className="w-6 h-6" />}
            color="#f59e0b"
          />
        </motion.div>

        {/* High ROI Banner */}
        {parseFloat(roiPercentage) > 150 && (
          <motion.div
            {...animations.container.fadeSlideUp}
            className="mb-6 bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-emerald-300 mb-1">
                  🎯 ¡Excelente ROI Detectado!
                </h4>
                <p className="text-emerald-200/80 text-sm">
                  Tu retorno de inversión es de <strong>{roiPercentage}%</strong>, superando el
                  objetivo del 100%. ¡Felicidades! 🎉
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabs Navigation */}
        <motion.div {...animations.container.fadeSlideUp} className="mb-6">
          <div className="flex flex-wrap gap-2 bg-slate-900/50 backdrop-blur-xl p-2 rounded-2xl border border-amber-500/20">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTabActiva(tab.id)}
                  className={`
                    flex-1 min-w-[140px] px-4 py-3 rounded-xl font-semibold transition-all duration-300
                    flex items-center justify-center gap-2
                    ${
                      tabActiva === tab.id
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div {...animations.container.fadeSlideUp}>
          {tabActiva === 'graficos' && (
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-amber-500/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-500" />
                🥧 Distribución de Recursos 2025
              </h3>
              <AdvancedPieChart
                data={pieChartData}
                height={400}
                innerRadius={80}
                outerRadius={160}
                showPercentage
              />
            </div>
          )}

          {tabActiva === 'ingresos' && (
            <TablaIngresosPremium
              data={datosManual.ingresosList}
              banco="Miel"
              accentColor="#fbbf24"
            />
          )}

          {tabActiva === 'gastos' && (
            <TablaGastosPremium
              data={datosManual.gastosList}
              banco="Miel"
              accentColor="#f59e0b"
            />
          )}

          {tabActiva === 'cortes' && (
            <TablaCortesPremium
              data={datosManual.cortesList}
              banco="Miel"
              accentColor="#fbbf24"
            />
          )}

          {tabActiva === 'transferencias' && (
            <TablaTransferenciasPremium
              data={datosManual.transferenciasList}
              banco="Miel"
              accentColor="#fbbf24"
            />
          )}
        </motion.div>
      </div>
    </div>
  );
});

PanelMielUltra.displayName = 'PanelMielUltra';

export default PanelMielUltra;
