/**
 * 💎 PANEL BOVEDA USA SUPREMO - ULTRA PREMIUM ENTERPRISE AAA+
 * =============================================================
 * ✨ 80 partículas animadas azul/cyan
 * 🎯 3 KPIs 2.5D + Currency Widget
 * 📊 4 Gráficos avanzados interactivos
 * 💱 Widget conversor de divisas MXN ↔ USD
 * 🌈 Gradientes animados blue → cyan → sky
 *
 * COLUMNAS COMPLETAS (SIN OMITIR NADA):
 * Ingresos: fecha, cliente, concepto, ingreso
 * Gastos: fecha, concepto, gasto, origenDelGastoOAbono
 * Cortes: fecha, corte
 */

import { AnimatePresence, motion, useScroll } from 'framer-motion';
import {
  Activity,
  ArrowDownLeft,
  ArrowRightLeft,
  ArrowUpRight,
  BarChart3,
  DollarSign,
  Globe,
  LineChart,
  PieChart,
  Plus,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import DATOS_JSON from '../../../../datos_excel_completos.json';
import { RippleButton } from '../../../components/ui/MicroInteractions';
import {
  use3DTilt,
  useFloating,
  useMagneticCursor,
  useParticles,
} from '../../../hooks/useAnimations';
import { useFlowStore } from '../../../stores/flowStore';
import { GraficoArea, GraficoBarras, GraficoLinea, GraficoPastel } from './GraficosPremium';
import { TablaTransferenciasPremium } from './TablasBancoPremium';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 28 },
  },
};

const kpiVariants = {
  hidden: { opacity: 0, scale: 0.8, rotateY: -90 },
  visible: (index) => ({
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: { delay: index * 0.15, type: 'spring', stiffness: 300, damping: 20 },
  }),
  hover: {
    scale: 1.05,
    y: -8,
    rotateX: 5,
    transition: { type: 'spring', stiffness: 400, damping: 15 },
  },
  tap: { scale: 0.98 },
};

// Particles Background
const ParticlesBackground = () => {
  const { particles } = useParticles(80);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ x: `${particle.x}vw`, y: `${particle.y}vh`, scale: 0, opacity: 0 }}
          animate={{
            y: [`${particle.y}vh`, `${particle.y - 20}vh`, `${particle.y}vh`],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(14,165,233,0.8) 0%, rgba(6,182,212,0.4) 100%)',
            boxShadow: '0 0 20px rgba(14,165,233,0.5)',
          }}
        />
      ))}
    </div>
  );
};

// Counter Animation
const CounterAnimation = ({ value, className }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const target =
      typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ''));
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span className={className}>${Math.floor(count).toLocaleString()}</span>;
};

// Sparkline
const Sparkline = React.memo(({ data, color }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * 60;
      const y = 20 - ((value - min) / range) * 20;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width="60" height="20" className="opacity-70">
      <motion.polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </svg>
  );
});
Sparkline.displayName = 'Sparkline';

// KPI Card 2.5D
const KPICard2D5 = React.memo(
  ({ title, value, trend, icon: Icon, color, index, sparklineData }) => {
    const _tilt = use3DTilt(12);
    const magnetic = useMagneticCursor(0.3);
    const floating = useFloating(3 + index * 0.5);
    return (
      <motion.div
        ref={magnetic.ref}
        style={{ ...magnetic.style, y: floating.y }}
        custom={index}
        variants={kpiVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        className="relative group cursor-pointer"
      >
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${color}/20 rounded-2xl blur-xl`}
          animate={{ scale: magnetic.isHovered ? 1.1 : 1, opacity: magnetic.isHovered ? 1 : 0.5 }}
        />
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={magnetic.isHovered ? { x: ['-100%', '200%'], opacity: [0, 0.5, 0] } : {}}
            transition={{ duration: 1, repeat: magnetic.isHovered ? Infinity : 0 }}
            style={{ transform: 'skewX(-20deg)', pointerEvents: 'none' }}
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <motion.div
                className={`p-3 rounded-xl bg-gradient-to-br ${color}/30 shadow-lg`}
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Icon className={`w-6 h-6 text-${color.split('/')[0]}-400`} />
              </motion.div>
              <motion.div
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                  trend >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
              >
                {trend >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {Math.abs(trend)}%
              </motion.div>
            </div>
            <p className="text-sm text-slate-400 mb-2">{title}</p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <CounterAnimation
                value={value}
                className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent"
              />
            </motion.div>
            {sparklineData && (
              <div className="mt-3">
                <Sparkline data={sparklineData} color="#06b6d4" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
);
KPICard2D5.displayName = 'KPICard2D5';

// Currency Widget
const CurrencyWidget = React.memo(() => {
  const [exchangeRate] = useState(17.35);
  const [amount, setAmount] = useState(1000);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card-ultra p-6 border border-cyan-500/30"
    >
      <div className="flex items-center gap-2 mb-4">
        <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-bold text-white">MXN ↔ USD</h3>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Monto MXN</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div className="flex items-center justify-center">
          <motion.div
            animate={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="text-cyan-400"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </motion.div>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-400">Equivale a</p>
          <p className="text-2xl font-bold text-cyan-400">
            ${(amount / exchangeRate).toFixed(2)} USD
          </p>
        </div>
        <div className="text-center pt-2 border-t border-white/10">
          <p className="text-xs text-slate-400">TC</p>
          <p className="text-sm font-semibold text-white">${exchangeRate.toFixed(2)}</p>
        </div>
      </div>
    </motion.div>
  );
});
CurrencyWidget.displayName = 'CurrencyWidget';

// Table Row - TODAS LAS COLUMNAS
const TableRow = React.memo(({ item, index, type }) => {
  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { delay: index * 0.015, type: 'spring', stiffness: 350, damping: 25 },
    },
  };

  if (type === 'ingreso') {
    return (
      <motion.tr
        variants={rowVariants}
        initial="hidden"
        animate="visible"
        className="border-t border-white/5 hover:bg-cyan-500/10 group"
        whileHover={{ scale: 1.01, x: 5 }}
      >
        <td className="px-4 py-3 text-sm text-slate-300">
          {item.fecha ? new Date(item.fecha).toLocaleDateString('es-MX') : 'N/A'}
        </td>
        <td className="px-4 py-3 text-sm font-medium text-white group-hover:text-cyan-300">
          {item.cliente || '-'}
        </td>
        <td className="px-4 py-3 text-sm text-slate-400 max-w-xs truncate">
          {item.concepto || '-'}
        </td>
        <td className="px-4 py-3 text-sm text-right font-bold text-cyan-400">
          ${(parseFloat(item.ingreso) || 0).toLocaleString()}
        </td>
      </motion.tr>
    );
  }
  if (type === 'corte') {
    return (
      <motion.tr
        variants={rowVariants}
        initial="hidden"
        animate="visible"
        className="border-t border-white/5 hover:bg-cyan-500/10 group"
        whileHover={{ scale: 1.01, x: 5 }}
      >
        <td className="px-4 py-3 text-sm text-slate-300">
          {item.fecha ? new Date(item.fecha).toLocaleDateString('es-MX') : 'N/A'}
        </td>
        <td className="px-4 py-3 text-sm text-right font-bold text-cyan-400">
          ${(parseFloat(item.corte) || 0).toLocaleString()}
        </td>
      </motion.tr>
    );
  }
  if (type === 'gasto') {
    return (
      <motion.tr
        variants={rowVariants}
        initial="hidden"
        animate="visible"
        className="border-t border-white/5 hover:bg-red-500/10 group"
        whileHover={{ scale: 1.01, x: 5 }}
      >
        <td className="px-4 py-3 text-sm text-slate-300">
          {item.fecha ? new Date(item.fecha).toLocaleDateString('es-MX') : 'N/A'}
        </td>
        <td className="px-4 py-3 text-sm text-slate-400 max-w-xs truncate">
          {item.concepto || '-'}
        </td>
        <td className="px-4 py-3 text-sm text-right font-bold text-red-400">
          ${(parseFloat(item.gasto) || 0).toLocaleString()}
        </td>
        <td className="px-4 py-3 text-sm font-medium text-white group-hover:text-red-300">
          {item.origenDelGastoOAbono || '-'}
        </td>
      </motion.tr>
    );
  }
  return null;
});
TableRow.displayName = 'TableRow';

// Main Component
const PanelBovedaUSASupremo = () => {
  const datosBovedaUSA = useMemo(() => DATOS_JSON?.bancos?.bovedaUsa || {}, []);
  const { scrollYProgress } = useScroll();

  const bancoBovedaUSA = useFlowStore((state) => state.bancos.bovedaUsa);
  const addIngreso = useFlowStore((state) => state.addIngresoBanco);
  const addGasto = useFlowStore((state) => state.addGastoBanco);
  const addCorte = useFlowStore((state) => state.addCorteBanco);
  const addTransferencia = useFlowStore((state) => state.addTransferenciaBanco);
  const setBancoData = useFlowStore((state) => state.setBancoData);

  useEffect(() => {
    if (bancoBovedaUSA.ingresos.length === 0 && datosBovedaUSA.ingresos?.length > 0) {
      setBancoData('bovedaUsa', {
        nombre: 'Boveda USA',
        saldoActual: datosBovedaUSA.saldoActual || 0,
        ingresos: (datosBovedaUSA.ingresos || []).map((ing, idx) => ({
          ...ing,
          id: ing.id || `ing_usa_${Date.now()}_${idx}`,
        })),
        gastos: (datosBovedaUSA.gastos || []).map((g, idx) => ({
          ...g,
          id: g.id || `gasto_usa_${Date.now()}_${idx}`,
        })),
        cortes: (datosBovedaUSA.cortes || []).map((c, idx) => ({
          ...c,
          id: c.id || `corte_usa_${Date.now()}_${idx}`,
        })),
      });
    }
  }, [
    bancoBovedaUSA.ingresos.length,
    datosBovedaUSA.cortes,
    datosBovedaUSA.gastos,
    datosBovedaUSA.ingresos,
    datosBovedaUSA.saldoActual,
    setBancoData,
  ]);

  const ingresos = bancoBovedaUSA.ingresos || [];
  const gastos = bancoBovedaUSA.gastos || [];
  const cortes = bancoBovedaUSA.cortes || [];

  const [tabActiva, setTabActiva] = useState('graficos');
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [formData, setFormData] = useState({});

  const totalIngresos = useMemo(
    () => ingresos.reduce((sum, ing) => sum + (parseFloat(ing.ingreso) || 0), 0),
    [ingresos]
  );
  const totalGastos = useMemo(
    () => gastos.reduce((sum, g) => sum + (parseFloat(g.gasto) || 0), 0),
    [gastos]
  );
  const rfActual = useMemo(
    () =>
      cortes.length > 0
        ? parseFloat(cortes[cortes.length - 1]?.corte || 0)
        : datosBovedaUSA.saldoActual || 0,
    [cortes, datosBovedaUSA.saldoActual]
  );
  const balance = useMemo(() => totalIngresos - totalGastos, [totalIngresos, totalGastos]);

  const sparklineIngresos = useMemo(
    () => ingresos.slice(-10).map((ing) => parseFloat(ing.ingreso) || 0),
    [ingresos]
  );
  const sparklineGastos = useMemo(
    () => gastos.slice(-10).map((g) => parseFloat(g.gasto) || 0),
    [gastos]
  );

  const graficoTendencia = useMemo(() => {
    const últimos6Meses = {};
    [...ingresos, ...gastos].forEach((item) => {
      if (!item.fecha) return;
      const mes = new Date(item.fecha).toLocaleString('es-MX', { month: 'short', year: '2-digit' });
      if (!últimos6Meses[mes]) últimos6Meses[mes] = { mes, ingresos: 0, gastos: 0 };
      if (item.ingreso) últimos6Meses[mes].ingresos += parseFloat(item.ingreso) || 0;
      if (item.gasto) últimos6Meses[mes].gastos += parseFloat(item.gasto) || 0;
    });
    return Object.values(últimos6Meses).slice(-6);
  }, [ingresos, gastos]);

  const graficoDistribucion = useMemo(
    () => [
      { nombre: 'Ingresos', valor: totalIngresos, color: '#06b6d4' },
      { nombre: 'Gastos', valor: totalGastos, color: '#ef4444' },
      { nombre: 'Balance', valor: Math.abs(balance), color: balance >= 0 ? '#06b6d4' : '#f59e0b' },
    ],
    [totalIngresos, totalGastos, balance]
  );

  const graficoTopIngresos = useMemo(() => {
    const agrupado = {};
    ingresos.forEach((ing) => {
      const cliente = ing.cliente || 'Sin cliente';
      if (!agrupado[cliente]) agrupado[cliente] = 0;
      agrupado[cliente] += parseFloat(ing.ingreso) || 0;
    });
    return Object.entries(agrupado)
      .map(([nombre, valor]) => ({ nombre, valor }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 10);
  }, [ingresos]);

  const graficoCortes = useMemo(
    () =>
      cortes
        .slice(-10)
        .map((c, idx) => ({ periodo: `Corte ${idx + 1}`, valor: parseFloat(c.corte) || 0 })),
    [cortes]
  );

  const openModal = useCallback((type) => {
    setModalType(type);
    setFormData({});
    setModalOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalType(null);
    setFormData({});
  }, []);
  const handleInputChange = useCallback(
    (field, value) => setFormData((prev) => ({ ...prev, [field]: value })),
    []
  );
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const nuevoRegistro = {
        id: `${modalType}_${Date.now()}`,
        fecha: formData.fecha || new Date().toISOString().split('T')[0],
        ...formData,
      };
      if (modalType === 'ingreso') addIngreso('bovedaUsa', nuevoRegistro);
      else if (modalType === 'gasto') addGasto('bovedaUsa', nuevoRegistro);
      else if (modalType === 'corte') addCorte('bovedaUsa', nuevoRegistro);
      else if (modalType === 'transferencia') addTransferencia('bovedaUsa', nuevoRegistro);
      closeModal();
    },
    [modalType, formData, addIngreso, addGasto, addCorte, addTransferencia, closeModal]
  );

  const handleTabChange = useCallback((tabId) => startTransition(() => setTabActiva(tabId)), []);

  const tabs = useMemo(
    () => [
      { id: 'graficos', label: 'Gráficos', icon: BarChart3, color: 'cyan' },
      { id: 'ingresos', label: 'Ingresos', icon: TrendingUp, color: 'blue' },
      { id: 'cortes', label: 'Cortes RF', icon: Activity, color: 'sky' },
      { id: 'gastos', label: 'Gastos', icon: TrendingDown, color: 'red' },
      { id: 'transferencias', label: 'Transferencias', icon: ArrowRightLeft, color: 'purple' },
    ],
    []
  );

  return (
    <div className="relative min-h-screen">
      <ParticlesBackground />
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-500 origin-left z-50 shadow-lg"
      />

      <motion.div
        className="relative z-10 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* HEADER */}
        <motion.div
          variants={itemVariants}
          className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-sky-500/10 rounded-2xl p-8 border border-white/10 shadow-2xl shadow-cyan-500/20"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                className="p-4 bg-cyan-500/20 rounded-2xl border border-cyan-500/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Globe className="w-8 h-8 text-cyan-400" />
              </motion.div>
              <div>
                <motion.h1
                  className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent"
                  animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{ backgroundSize: '200% auto' }}
                >
                  Boveda USA Supremo
                </motion.h1>
                <p className="text-slate-400 flex items-center gap-2 mt-1">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Sistema Internacional Ultra-Premium AAA+
                </p>
              </div>
            </div>
            <motion.div
              className="text-right"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-sm text-slate-400 flex items-center gap-2 justify-end">
                <Zap className="w-4 h-4 text-amber-400" />
                RF Actual
              </p>
              <motion.div
                key={rfActual}
                initial={{ scale: 1.2, color: '#fbbf24' }}
                animate={{ scale: 1, color: '#06b6d4' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <CounterAnimation value={rfActual} className="text-4xl font-bold text-cyan-400" />
              </motion.div>
            </motion.div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <KPICard2D5
              title="Total Ingresos"
              value={totalIngresos}
              trend={24.8}
              icon={ArrowUpRight}
              color="from-cyan-500/30 to-blue-500/10"
              index={0}
              sparklineData={sparklineIngresos}
            />
            <KPICard2D5
              title="Total Gastos"
              value={totalGastos}
              trend={-11.2}
              icon={ArrowDownLeft}
              color="from-red-500/30 to-rose-500/10"
              index={1}
              sparklineData={sparklineGastos}
            />
            <KPICard2D5
              title="Balance"
              value={balance}
              trend={balance >= 0 ? 19.5 : -8.3}
              icon={BarChart3}
              color={
                balance >= 0
                  ? 'from-cyan-500/30 to-sky-500/10'
                  : 'from-amber-500/30 to-orange-500/10'
              }
              index={2}
              sparklineData={sparklineIngresos.map((v, i) => v - (sparklineGastos[i] || 0))}
            />
            <CurrencyWidget />
          </div>
        </motion.div>

        {/* TABS */}
        <motion.div
          variants={itemVariants}
          className="flex gap-2 backdrop-blur-xl bg-white/5 p-2 rounded-xl border border-white/10"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tabActiva === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                disabled={isPending}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all relative overflow-hidden ${
                  isActive
                    ? `bg-${tab.color}-500/20 text-${tab.color}-400 border border-${tab.color}-500/30`
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                } ${isPending ? 'opacity-50 cursor-wait' : ''}`}
                whileHover={{ scale: isPending ? 1 : 1.02, y: isPending ? 0 : -2 }}
                whileTap={{ scale: isPending ? 1 : 0.98 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBovedaUSA"
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          {/* GRÁFICOS */}
          {tabActiva === 'graficos' && (
            <motion.div
              key="graficos"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-2 gap-6"
            >
              <motion.div
                className="card-ultra p-6 border border-white/10"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                  <LineChart className="w-5 h-5 text-cyan-400" />
                  Tendencia (6 meses)
                </h3>
                <GraficoArea
                  data={graficoTendencia}
                  dataKeys={[
                    { key: 'ingresos', nombre: 'Ingresos', color: '#06b6d4' },
                    { key: 'gastos', nombre: 'Gastos', color: '#ef4444' },
                  ]}
                  xAxisKey="mes"
                  height={250}
                />
              </motion.div>
              <motion.div
                className="card-ultra p-6 border border-white/10"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                  <PieChart className="w-5 h-5 text-sky-400" />
                  Distribución
                </h3>
                <GraficoPastel
                  data={graficoDistribucion}
                  dataKey="valor"
                  nameKey="nombre"
                  height={250}
                />
              </motion.div>
              <motion.div
                className="card-ultra p-6 border border-white/10"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Top 10 Clientes
                </h3>
                <GraficoBarras
                  data={graficoTopIngresos}
                  dataKeys={[{ key: 'valor', nombre: 'Ingreso', color: '#06b6d4' }]}
                  xAxisKey="nombre"
                  height={250}
                />
              </motion.div>
              <motion.div
                className="card-ultra p-6 border border-white/10"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Historial Cortes
                </h3>
                <GraficoLinea
                  data={graficoCortes}
                  dataKeys={[{ key: 'valor', nombre: 'RF', color: '#06b6d4' }]}
                  xAxisKey="periodo"
                  height={250}
                />
              </motion.div>
            </motion.div>
          )}

          {/* TABLA INGRESOS - 4 COLUMNAS COMPLETAS */}
          {tabActiva === 'ingresos' && (
            <motion.div
              key="ingresos"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="card-ultra p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  Ingresos - ${totalIngresos.toLocaleString()}
                </h2>
                <RippleButton onClick={() => openModal('ingreso')} variant="primary" size="md">
                  <Plus className="w-5 h-5" />
                  Nuevo Ingreso
                </RippleButton>
              </div>
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto rounded-lg border border-white/10">
                <table className="w-full">
                  <thead className="bg-white/5 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold bg-slate-800/90">
                        Fecha
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold bg-slate-800/90">
                        Cliente
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold bg-slate-800/90">
                        Concepto
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold bg-slate-800/90">
                        Ingreso
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingresos.map((ing, idx) => (
                      <TableRow key={ing.id || idx} item={ing} index={idx} type="ingreso" />
                    ))}
                  </tbody>
                  <tfoot className="bg-white/5 sticky bottom-0">
                    <tr className="border-t-2 border-cyan-500/30">
                      <td
                        colSpan="3"
                        className="px-4 py-3 text-sm font-bold text-slate-300 bg-slate-800/90"
                      >
                        TOTAL
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-cyan-400 bg-slate-800/90">
                        ${totalIngresos.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              {ingresos.length === 0 && (
                <motion.div
                  className="text-center text-slate-400 py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">No hay ingresos registrados</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* TABLA CORTES - 2 COLUMNAS */}
          {tabActiva === 'cortes' && (
            <motion.div
              key="cortes"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="card-ultra p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  RF Actual - ${rfActual.toLocaleString()}
                </h2>
                <RippleButton onClick={() => openModal('corte')} variant="primary" size="md">
                  <Plus className="w-5 h-5" />
                  Nuevo Corte
                </RippleButton>
              </div>
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto rounded-lg border border-white/10">
                <table className="w-full">
                  <thead className="bg-white/5 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold bg-slate-800/90">
                        Fecha
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold bg-slate-800/90">
                        Corte
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cortes.map((corte, idx) => (
                      <TableRow key={corte.id || idx} item={corte} index={idx} type="corte" />
                    ))}
                  </tbody>
                </table>
              </div>
              {cortes.length === 0 && (
                <motion.div
                  className="text-center text-slate-400 py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">No hay cortes registrados</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* TABLA GASTOS - 4 COLUMNAS COMPLETAS */}
          {tabActiva === 'gastos' && (
            <motion.div
              key="gastos"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="card-ultra p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-red-400 flex items-center gap-2">
                  <TrendingDown className="w-6 h-6" />
                  Gastos - ${totalGastos.toLocaleString()}
                </h2>
                <RippleButton onClick={() => openModal('gasto')} variant="danger" size="md">
                  <Plus className="w-5 h-5" />
                  Nuevo Gasto
                </RippleButton>
              </div>
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto rounded-lg border border-white/10">
                <table className="w-full">
                  <thead className="bg-white/5 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold bg-slate-800/90">
                        Fecha
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold bg-slate-800/90">
                        Concepto
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold bg-slate-800/90">
                        Gasto
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold bg-slate-800/90">
                        Origen del Gasto
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {gastos.map((gasto, idx) => (
                      <TableRow key={gasto.id || idx} item={gasto} index={idx} type="gasto" />
                    ))}
                  </tbody>
                  <tfoot className="bg-white/5 sticky bottom-0">
                    <tr className="border-t-2 border-red-500/30">
                      <td
                        colSpan="2"
                        className="px-4 py-3 text-sm font-bold text-slate-300 bg-slate-800/90"
                      >
                        TOTAL
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-red-400 bg-slate-800/90">
                        ${totalGastos.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 bg-slate-800/90"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              {gastos.length === 0 && (
                <motion.div
                  className="text-center text-slate-400 py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">No hay gastos registrados</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* TRANSFERENCIAS TAB */}
          {tabActiva === 'transferencias' && (
            <motion.div
              key="transferencias"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="card-ultra p-8"
            >
              <TablaTransferenciasPremium
                transferencias={bancoBovedaUSA.transferencias || []}
                titulo="Transferencias - Bóveda USA Supremo"
                onAgregar={() => openModal('transferencia')}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL CRUD */}
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 50, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="card-ultra p-8 max-w-2xl w-full border border-white/20 shadow-2xl shadow-cyan-500/20"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    {modalType === 'ingreso' && (
                      <>
                        <TrendingUp className="w-6 h-6 text-cyan-400" />
                        <span className="text-cyan-400">Nuevo Ingreso</span>
                      </>
                    )}
                    {modalType === 'gasto' && (
                      <>
                        <TrendingDown className="w-6 h-6 text-red-400" />
                        <span className="text-red-400">Nuevo Gasto</span>
                      </>
                    )}
                    {modalType === 'corte' && (
                      <>
                        <BarChart3 className="w-6 h-6 text-cyan-400" />
                        <span className="text-cyan-400">Nuevo Corte RF</span>
                      </>
                    )}
                    {modalType === 'transferencia' && (
                      <>
                        <ArrowRightLeft className="w-6 h-6 text-purple-400" />
                        <span className="text-purple-400">Nueva Transferencia</span>
                      </>
                    )}
                  </h3>
                  <motion.button
                    onClick={closeModal}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Fecha</label>
                    <input
                      type="date"
                      value={formData.fecha || new Date().toISOString().split('T')[0]}
                      onChange={(e) => handleInputChange('fecha', e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  {modalType === 'ingreso' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Cliente</label>
                        <input
                          type="text"
                          value={formData.cliente || ''}
                          onChange={(e) => handleInputChange('cliente', e.target.value)}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="Nombre del cliente"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Concepto</label>
                        <input
                          type="text"
                          value={formData.concepto || ''}
                          onChange={(e) => handleInputChange('concepto', e.target.value)}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="Concepto"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Ingreso (MXN)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.ingreso || ''}
                          onChange={(e) => handleInputChange('ingreso', e.target.value)}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </>
                  )}

                  {modalType === 'gasto' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Concepto</label>
                        <input
                          type="text"
                          value={formData.concepto || ''}
                          onChange={(e) => handleInputChange('concepto', e.target.value)}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="Concepto"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Gasto (MXN)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.gasto || ''}
                          onChange={(e) => handleInputChange('gasto', e.target.value)}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Origen del Gasto</label>
                        <input
                          type="text"
                          value={formData.origenDelGastoOAbono || ''}
                          onChange={(e) =>
                            handleInputChange('origenDelGastoOAbono', e.target.value)
                          }
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="Origen"
                        />
                      </div>
                    </>
                  )}

                  {modalType === 'corte' && (
                    <div>
                      <label className="block text-sm font-semibold mb-2">Corte RF (MXN)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.corte || ''}
                        onChange={(e) => handleInputChange('corte', e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  )}

                  {modalType === 'transferencia' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Banco Origen</label>
                        <select
                          value={formData.bancoOrigen || 'Bóveda USA'}
                          onChange={(e) => handleInputChange('bancoOrigen', e.target.value)}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        >
                          <option value="Bóveda USA">Bóveda USA</option>
                          <option value="Bóveda Monte">Bóveda Monte</option>
                          <option value="Profit">Profit</option>
                          <option value="Utilidades">Utilidades</option>
                          <option value="Azteca">Azteca</option>
                          <option value="Leftie">Leftie</option>
                          <option value="Flete Sur">Flete Sur</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Banco Destino</label>
                        <select
                          value={formData.bancoDestino || ''}
                          onChange={(e) => handleInputChange('bancoDestino', e.target.value)}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        >
                          <option value="">Seleccionar banco</option>
                          <option value="Bóveda USA">Bóveda USA</option>
                          <option value="Bóveda Monte">Bóveda Monte</option>
                          <option value="Profit">Profit</option>
                          <option value="Utilidades">Utilidades</option>
                          <option value="Azteca">Azteca</option>
                          <option value="Leftie">Leftie</option>
                          <option value="Flete Sur">Flete Sur</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Monto (MXN)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.monto || ''}
                          onChange={(e) => handleInputChange('monto', e.target.value)}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Concepto</label>
                        <input
                          type="text"
                          value={formData.concepto || ''}
                          onChange={(e) => handleInputChange('concepto', e.target.value)}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Concepto de la transferencia"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex gap-3 pt-4">
                    <motion.button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-semibold"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold shadow-lg shadow-cyan-500/30"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="flex items-center gap-2 justify-center">
                        <Sparkles className="w-4 h-4" />
                        Guardar
                      </span>
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default React.memo(PanelBovedaUSASupremo);
