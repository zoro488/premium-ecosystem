/**
 * 🐝 PANEL GUARDADITO ULTRA - PREMIUM EDITION
 * ============================================
 * Theme: Green/Emerald (#10b981, #059669)
 * Chart: AdvancedAreaChart (acumulación de ahorros)
 * Features: Savings tracker, growth projections, goal tracking
 */

import type { FC } from 'react';
import { memo, useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import {
    Activity,
    ArrowRightLeft,
    DollarSign,
    PiggyBank,
    Scissors,
    Target,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';

import DATOS_BOVEDAS_COMPLETOS from '../../../data/datos_bovedas_completos.json';
import { animations, CreativeParticles, KpiCard3D, PremiumLoadingScreen } from '../shared';
import { AdvancedAreaChart } from '../shared/AdvancedAreaChart';
import {
    TablaCortesPremium,
    TablaGastosPremium,
    TablaIngresosPremium,
    TablaTransferenciasPremium,
} from './TablasBancoPremium';

const PanelGuardaditoUltra: FC = memo(() => {
  const [loading] = useState(false);
  const [tabActiva, setTabActiva] = useState('graficos');

  // Datos simulados para Guardadito (fondo de ahorro)
  const datosManual = useMemo(() => {
    return {
      totalIngresos: 320000,
      ingresosList: Array.from({ length: 18 }, (_, i) => ({
        id: `ing-guardadito-${i}`,
        fecha: new Date(2025, 0, i + 1).toISOString().split('T')[0],
        cliente: `Ahorro ${i + 1}`,
        ingreso: Math.floor(Math.random() * 25000) + 5000,
        concepto: 'Depósito de ahorro',
      })),
      totalGastos: 85000,
      gastosList: Array.from({ length: 6 }, (_, i) => ({
        id: `gast-guardadito-${i}`,
        fecha: new Date(2025, 0, (i + 1) * 4).toISOString().split('T')[0],
        proveedor: `Retiro ${i + 1}`,
        gasto: Math.floor(Math.random() * 15000) + 5000,
        concepto: 'Retiro de emergencia',
      })),
      cortesList: Array.from({ length: 4 }, (_, i) => ({
        id: `corte-guardadito-${i}`,
        fecha: new Date(2025, 0, (i + 1) * 7).toISOString().split('T')[0],
        corte: Math.floor(Math.random() * 80000) + 50000,
        concepto: `Corte mensual ${i + 1}`,
      })),
      transferenciasList: Array.from({ length: 10 }, (_, i) => ({
        id: `trans-guardadito-${i}`,
        fecha: new Date(2025, 0, i + 2).toISOString().split('T')[0],
        monto: Math.floor(Math.random() * 30000) + 10000,
        bancoOrigen: i % 2 === 0 ? 'Guardadito' : 'Azteca',
        bancoDestino: i % 2 === 0 ? 'Utilidades' : 'Guardadito',
        concepto: 'Transferencia de ahorro',
      })),
    };
  }, []);

  const rfActual = useMemo(
    () => DATOS_BOVEDAS_COMPLETOS.controlMaestro?.rfActual?.paneles?.['Guardadito'] || 235000,
    []
  );

  const totalIngresos = datosManual.totalIngresos;
  const totalGastos = datosManual.totalGastos;
  const balance = totalIngresos - totalGastos;
  const metaAhorro = 500000;
  const progresoMeta = ((rfActual / metaAhorro) * 100).toFixed(1);

  // Area Chart Data - Crecimiento acumulado de ahorros
  const areaChartData = useMemo(() => {
    let acumulado = 100000;
    return Array.from({ length: 12 }, (_, i) => {
      const incremento = Math.floor(Math.random() * 25000) + 15000;
      acumulado += incremento;
      return {
        name: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][i],
        ahorro: acumulado,
        meta: metaAhorro,
      };
    });
  }, [metaAhorro]);

  const tabs = [
    { id: 'graficos', label: 'Crecimiento', icon: Activity, count: 1 },
    { id: 'ingresos', label: 'Ahorros', icon: TrendingUp, count: datosManual.ingresosList.length },
    { id: 'gastos', label: 'Retiros', icon: TrendingDown, count: datosManual.gastosList.length },
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
      style={{ background: '#0a0e27' }}
    >
      <CreativeParticles count={35} colors={['#10b981', '#059669']} />

      <div className="relative z-10 p-6 max-w-[1800px] mx-auto">
        <motion.div {...animations.container.fadeSlideUp} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <PiggyBank className="w-10 h-10 text-emerald-500" />
            <h1 className="text-4xl font-bold" style={{ color: '#f8fafc' }}>
              🐝 Guardadito Ultra
            </h1>
          </div>
          <p style={{ color: '#cbd5e1' }}>
            Savings Tracker Dashboard - Green/Emerald Theme
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
            change="+22.3%"
            trend="up"
            icon={<DollarSign className="w-6 h-6" />}
            color="#10b981"
          />

          <KpiCard3D
            title="Total Ahorrado"
            value={`$${totalIngresos.toLocaleString('es-MX')}`}
            change="+28.5%"
            trend="up"
            icon={<TrendingUp className="w-6 h-6" />}
            color="#059669"
          />

          <KpiCard3D
            title="Total Retiros"
            value={`$${totalGastos.toLocaleString('es-MX')}`}
            change="-12.1%"
            trend="down"
            icon={<TrendingDown className="w-6 h-6" />}
            color="#ef4444"
          />

          <KpiCard3D
            title="Meta Progreso"
            value={`${progresoMeta}%`}
            change={`${balance >= 0 ? '+' : ''}${balance.toLocaleString('es-MX')}`}
            trend={balance >= 0 ? 'up' : 'down'}
            icon={<Target className="w-6 h-6" />}
            color="#10b981"
          />
        </motion.div>

        {/* Goal Progress Banner */}
        {parseFloat(progresoMeta) < 50 && (
          <motion.div
            {...animations.container.fadeSlideUp}
            className="mb-6 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <Target className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-amber-300 mb-1">
                  🎯 Meta de Ahorro en Progreso
                </h4>
                <p className="text-amber-200/80 text-sm">
                  Has alcanzado el <strong>{progresoMeta}%</strong> de tu meta de{' '}
                  <strong>${metaAhorro.toLocaleString('es-MX')}</strong>. ¡Sigue así!
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabs Navigation */}
        <motion.div {...animations.container.fadeSlideUp} className="mb-6">
          <div className="flex flex-wrap gap-2 bg-slate-900/50 backdrop-blur-xl p-2 rounded-2xl border border-emerald-500/20">
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
                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30'
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
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" />
                📊 Crecimiento Acumulado 2025
              </h3>
              <AdvancedAreaChart
                data={areaChartData}
                areas={[
                  { key: 'ahorro', color: '#10b981', name: 'Ahorro Acumulado' },
                  { key: 'meta', color: '#fbbf24', name: 'Meta', strokeDasharray: '5 5' },
                ]}
                height={400}
              />
            </div>
          )}

          {tabActiva === 'ingresos' && (
            <TablaIngresosPremium
              data={datosManual.ingresosList}
              banco="Guardadito"
              accentColor="#10b981"
            />
          )}

          {tabActiva === 'gastos' && (
            <TablaGastosPremium
              data={datosManual.gastosList}
              banco="Guardadito"
              accentColor="#ef4444"
            />
          )}

          {tabActiva === 'cortes' && (
            <TablaCortesPremium
              data={datosManual.cortesList}
              banco="Guardadito"
              accentColor="#10b981"
            />
          )}

          {tabActiva === 'transferencias' && (
            <TablaTransferenciasPremium
              data={datosManual.transferenciasList}
              banco="Guardadito"
              accentColor="#10b981"
            />
          )}
        </motion.div>
      </div>
    </div>
  );
});

PanelGuardaditoUltra.displayName = 'PanelGuardaditoUltra';

export default PanelGuardaditoUltra;
