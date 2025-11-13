import { motion } from 'framer-motion';
import {
  Building2,
  DollarSign,
  Package,
  PiggyBank,
  TrendingUp,
  Truck,
  Wallet
} from 'lucide-react';
import React from 'react';
import { ChronosCard, ChronosKPI, ChronosTable } from '../../components/chronos-ui';
import ChronosCore from '../../components/chronos-ui/ChronosCore';
import { useAlmacenData, useBancoData, useDashboardData } from '../../hooks/useChronosData';

const DashboardMaster: React.FC = () => {
  const { totales, loading: loadingDashboard } = useDashboardData();
  const { stats: statsMonte } = useBancoData('boveda_monte');
  const { stats: statsUSA } = useBancoData('boveda_usa');
  const { stats: statsFletes } = useBancoData('fletes');
  const { stats: statsUtilidades } = useBancoData('utilidades');
  const { stats: statsAzteca } = useBancoData('azteca');
  const { stats: statsLeftie } = useBancoData('leftie');
  const { stats: statsProfit } = useBancoData('profit');
  const { stockActual, loading: loadingAlmacen } = useAlmacenData();

  if (loadingDashboard || loadingAlmacen) {
    return (
      <div className="min-h-screen bg-chronos-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-xl font-semibold">Cargando Dashboard...</p>
        </motion.div>
      </div>
    );
  }

  const capitalTotal =
    statsMonte.capitalActual +
    statsUSA.capitalActual +
    statsFletes.capitalActual +
    statsUtilidades.capitalActual +
    statsAzteca.capitalActual +
    statsLeftie.capitalActual +
    statsProfit.capitalActual;

  const bancosData = [
    { nombre: 'Bóveda Monte', capital: statsMonte.capitalActual, icon: Building2, color: 'blue' },
    { nombre: 'Bóveda USA', capital: statsUSA.capitalActual, icon: DollarSign, color: 'cyan' },
    { nombre: 'Fletes', capital: statsFletes.capitalActual, icon: Truck, color: 'purple' },
    { nombre: 'Utilidades', capital: statsUtilidades.capitalActual, icon: TrendingUp, color: 'green' },
    { nombre: 'Azteca', capital: statsAzteca.capitalActual, icon: Wallet, color: 'pink' },
    { nombre: 'Leftie', capital: statsLeftie.capitalActual, icon: PiggyBank, color: 'cyan' },
    { nombre: 'Profit', capital: statsProfit.capitalActual, icon: TrendingUp, color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-chronos-black p-8">
      {/* IA Asistente */}
      <ChronosCore context="Dashboard Principal" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-5xl font-bold text-white mb-2">
          <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            Chronos OS
          </span>
        </h1>
        <p className="text-gray-400 text-lg">Centro de Comando Financiero</p>
      </motion.div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <ChronosKPI
          title="Capital Total"
          value={capitalTotal}
          Icon={DollarSign}
          glowColor="cyan"
          delay={0}
        />
        <ChronosKPI
          title="Inventario Físico"
          value={stockActual}
          Icon={Package}
          glowColor="purple"
          format="number"
          delay={0.1}
        />
        <ChronosKPI
          title="Bancos Activos"
          value={7}
          Icon={Building2}
          glowColor="blue"
          format="number"
          delay={0.2}
        />
        <ChronosKPI
          title="Total Activos"
          value={capitalTotal + stockActual * 10000}
          Icon={TrendingUp}
          glowColor="green"
          delay={0.3}
        />
      </div>

      {/* Bancos Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Estado de Bancos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bancosData.map((banco, idx) => {
            const IconComponent = banco.icon;
            return (
              <ChronosCard
                key={banco.nombre}
                title={banco.nombre}
                Icon={IconComponent}
                glowColor={banco.color as any}
                delay={idx * 0.05}
              >
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-white font-mono">
                    {new Intl.NumberFormat('es-MX', {
                      style: 'currency',
                      currency: 'MXN',
                    }).format(banco.capital)}
                  </div>
                  <div className="text-xs text-gray-400">Capital Actual</div>
                </div>
              </ChronosCard>
            );
          })}
        </div>
      </motion.div>

      {/* Tabla de Movimientos Recientes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <ChronosCard title="Movimientos Recientes" glowColor="cyan">
          <ChronosTable
            columns={[
              { key: 'fecha', label: 'Fecha', width: '20%' },
              { key: 'tipo', label: 'Tipo', width: '15%' },
              { key: 'banco', label: 'Banco', width: '25%' },
              { key: 'concepto', label: 'Concepto', width: '25%' },
              {
                key: 'monto',
                label: 'Monto',
                width: '15%',
                align: 'right',
                render: (val: number) =>
                  new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                  }).format(val),
              },
            ]}
            data={[
              {
                fecha: '2025-11-10',
                tipo: 'Ingreso',
                banco: 'Bóveda Monte',
                concepto: 'Venta #12345',
                monto: 150000,
              },
              {
                fecha: '2025-11-10',
                tipo: 'Gasto',
                banco: 'Fletes',
                concepto: 'Transporte OCT',
                monto: -5000,
              },
              {
                fecha: '2025-11-09',
                tipo: 'Transferencia',
                banco: 'Utilidades → Azteca',
                concepto: 'Inversión',
                monto: 50000,
              },
            ]}
            maxHeight="300px"
          />
        </ChronosCard>
      </motion.div>
    </div>
  );
};

export default DashboardMaster;
