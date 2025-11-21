/**
 * 🏦 PANEL BANORTE ULTRA - PREMIUM EDITION
 * =========================================
 * Theme: Orange/Red (#f97316, #dc2626)
 * Chart: AdvancedLineChart (tendencias temporales)
 * Features: Análisis de flujo de efectivo, proyecciones
 */

import type { FC } from 'react';
import { memo, useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import {
    Activity,
    ArrowRightLeft,
    Building2,
    DollarSign,
    Scissors,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';

import DATOS_BOVEDAS_COMPLETOS from '../../../data/datos_bovedas_completos.json';
import {
    AdvancedLineChart,
    CreativeParticles,
    KpiCard3D,
    PremiumLoadingScreen,
    animations,
} from '../shared';
import {
    TablaCortesPremium,
    TablaGastosPremium,
    TablaIngresosPremium,
    TablaTransferenciasPremium,
} from './TablasBancoPremium';
const PanelBanorteUltra: FC = memo(() => {
  const [loading] = useState(false);
  const [tabActiva, setTabActiva] = useState('graficos');

  // Datos simulados para Banorte (ajustar según JSON real)
  const datosManual = useMemo(() => {
    return {
      totalIngresos: 450000,
      ingresosList: Array.from({ length: 15 }, (_, i) => ({
        id: `ing-banorte-${i}`,
        fecha: new Date(2025, 0, i + 1).toISOString().split('T')[0],
        cliente: `Cliente Banorte ${i + 1}`,
        ingreso: Math.floor(Math.random() * 50000) + 10000,
        concepto: 'Transferencia bancaria',
      })),
      totalGastos: 280000,
      gastosList: Array.from({ length: 12 }, (_, i) => ({
        id: `gast-banorte-${i}`,
        fecha: new Date(2025, 0, i + 2).toISOString().split('T')[0],
        proveedor: `Proveedor ${i + 1}`,
        gasto: Math.floor(Math.random() * 30000) + 5000,
        concepto: 'Pago a proveedores',
      })),
      cortesList: Array.from({ length: 5 }, (_, i) => ({
        id: `corte-banorte-${i}`,
        fecha: new Date(2025, 0, (i + 1) * 5).toISOString().split('T')[0],
        corte: Math.floor(Math.random() * 100000) + 50000,
        concepto: `Corte semanal ${i + 1}`,
      })),
      transferenciasList: Array.from({ length: 8 }, (_, i) => ({
        id: `trans-banorte-${i}`,
        fecha: new Date(2025, 0, i + 3).toISOString().split('T')[0],
        monto: Math.floor(Math.random() * 40000) + 10000,
        bancoOrigen: 'Banorte',
        bancoDestino: i % 2 === 0 ? 'Azteca' : 'Utilidades',
        concepto: 'Transferencia interbancaria',
      })),
    };
  }, []);

  const rfActual = useMemo(() => {
    const paneles = DATOS_BOVEDAS_COMPLETOS.controlMaestro?.rfActual?.paneles as Record<
      string,
      number
    >;
    return paneles?.['Banorte'] || 170000;
  }, []);

  const totalIngresos = datosManual.totalIngresos;
  const totalGastos = datosManual.totalGastos;
  const balance = totalIngresos - totalGastos;

  // Line Chart Data - Tendencias mensuales
  const lineChartData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(2025, i, 1);
      const ingresos = Math.floor(Math.random() * 60000) + 30000;
      const gastos = Math.floor(Math.random() * 40000) + 20000;
      return {
        timestamp: date.toISOString(),
        name: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][
          i
        ],
        ingresos,
        gastos,
        balance: ingresos - gastos,
      };
    });
  }, []);

  const tabs = [
    { id: 'graficos', label: 'Tendencias', icon: Activity, count: 1 },
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
      style={{ background: '#0a0e27' }}
    >
      <CreativeParticles count={30} colors={['#f97316', '#dc2626']} />

      <div className="relative z-10 p-6 max-w-[1800px] mx-auto">
        <motion.div {...animations.container.fadeSlideUp} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-10 h-10 text-orange-500" />
            <h1 className="text-4xl font-bold" style={{ color: '#f8fafc' }}>
              🏦 Banorte Ultra
            </h1>
          </div>
          <p style={{ color: '#cbd5e1' }}>Cash Flow Analysis Dashboard - Orange/Red Theme</p>
        </motion.div>

        {/* KPIs */}
        <motion.div
          {...animations.container.staggerChildren}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <KpiCard3D
            title="RF Actual"
            value={`$${rfActual.toLocaleString('es-MX')}`}
            change={balance >= 0 ? '+12.5%' : '-8.3%'}
            trend={balance >= 0 ? 'up' : 'down'}
            icon={<DollarSign className="w-6 h-6" />}
            color="#f97316"
          />

          <KpiCard3D
            title="Total Ingresos"
            value={`$${totalIngresos.toLocaleString('es-MX')}`}
            change="+15.2%"
            trend="up"
            icon={<TrendingUp className="w-6 h-6" />}
            color="#10b981"
          />

          <KpiCard3D
            title="Total Gastos"
            value={`$${totalGastos.toLocaleString('es-MX')}`}
            change="-5.8%"
            trend="down"
            icon={<TrendingDown className="w-6 h-6" />}
            color="#ef4444"
          />

          <KpiCard3D
            title="Balance"
            value={`$${balance.toLocaleString('es-MX')}`}
            change={balance >= 0 ? '+18.7%' : '-12.4%'}
            trend={balance >= 0 ? 'up' : 'down'}
            icon={<Activity className="w-6 h-6" />}
            color={balance >= 0 ? '#10b981' : '#ef4444'}
          />
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div {...animations.container.fadeSlideUp} className="mb-6">
          <div className="flex flex-wrap gap-2 bg-slate-900/50 backdrop-blur-xl p-2 rounded-2xl border border-zinc-500/20">
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
                        ? 'bg-gradient-to-r from-orange-500 to-zinc-800 text-white shadow-lg shadow-orange-500/30'
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
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-500/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-500" />
                📈 Tendencias Mensuales 2025
              </h3>
              <AdvancedLineChart
                data={lineChartData}
                lines={[
                  { key: 'ingresos', color: '#10b981', name: 'Ingresos' },
                  { key: 'gastos', color: '#ef4444', name: 'Gastos' },
                  { key: 'balance', color: '#f97316', name: 'Balance' },
                ]}
                height={400}
              />
            </div>
          )}

          {tabActiva === 'ingresos' && (
            <TablaIngresosPremium
              data={datosManual.ingresosList}
              banco="Banorte"
              accentColor="#f97316"
            />
          )}

          {tabActiva === 'gastos' && (
            <TablaGastosPremium
              data={datosManual.gastosList}
              banco="Banorte"
              accentColor="#dc2626"
            />
          )}

          {tabActiva === 'cortes' && (
            <TablaCortesPremium
              data={datosManual.cortesList}
              banco="Banorte"
              accentColor="#f97316"
            />
          )}

          {tabActiva === 'transferencias' && (
            <TablaTransferenciasPremium
              data={datosManual.transferenciasList}
              banco="Banorte"
              accentColor="#f97316"
            />
          )}
        </motion.div>
      </div>
    </div>
  );
});

PanelBanorteUltra.displayName = 'PanelBanorteUltra';

export default PanelBanorteUltra;
