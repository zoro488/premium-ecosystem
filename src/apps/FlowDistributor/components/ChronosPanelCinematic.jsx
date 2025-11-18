/**
 * 🎬 CHRONOS PANEL CINEMATIC - ULTRA PREMIUM EDITION
 * ================================================
 * Panel de control financiero con efectos cinematográficos avanzados
 *
 * 🌟 Features Cinemáticas:
 * - GSAP Timeline orchestration
 * - Partículas interactivas 3D
 * - Microanimaciones en todos los elementos
 * - Transiciones fluidas entre estados
 * - Efectos de glassmorphism avanzados
 * - Hover effects complejos
 * - Loading states cinematográficos
 *
 * 🎨 Visual Excellence:
 * - Gradientes animados
 * - Sombras dinámicas
 * - Blur effects contextuales
 * - Resplandores y brillos
 * - Animaciones de números
 * - Morphing transitions
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Plus,
  RefreshCw,
  Download,
  Search
} from 'lucide-react';

// Hook para animación de números
const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
};

// Componente KPI Card Cinematográfico
const CinematicKpiCard = ({ icon: Icon, label, value, trend, trendValue, color, delay = 0 }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const animatedValue = useCountUp(value, 1500);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-100, 100], [5, -5]);
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Animación de entrada con GSAP
    gsap.fromTo(card,
      {
        opacity: 0,
        y: 50,
        scale: 0.9,
        rotateX: -15
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        duration: 0.8,
        delay: delay,
        ease: 'power3.out'
      }
    );
  }, [delay]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
      whileHover={{ scale: 1.02 }}
      className="relative group"
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-0.5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at center, ${color}40, transparent)` }}
        animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Card principal */}
      <div
        className="relative rounded-2xl p-6 overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.1)
          `
        }}
      >
        {/* Partículas de fondo */}
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity
              }}
            />
          ))}
        </div>

        {/* Header con icono */}
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div>
            <motion.p
              className="text-sm text-gray-400 mb-1"
              animate={isHovered ? { x: [0, 5, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {label}
            </motion.p>

            <motion.div
              className="text-3xl font-black"
              style={{ color }}
            >
              ${animatedValue.toLocaleString()}
            </motion.div>
          </div>

          {/* Icono con animación orbital */}
          <motion.div
            className="relative"
            animate={isHovered ? { rotate: 360 } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <motion.div
              className="absolute inset-0 rounded-full blur-md"
              style={{ background: color, opacity: 0.3 }}
              animate={isHovered ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <div
              className="relative p-3 rounded-xl"
              style={{
                background: `${color}20`,
                border: `1px solid ${color}40`
              }}
            >
              <Icon className="w-6 h-6" style={{ color }} />
            </div>
          </motion.div>
        </div>

        {/* Trend indicator */}
        {trend && (
          <motion.div
            className="flex items-center gap-2 relative z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.3 }}
          >
            <motion.div
              animate={trend === 'up' ? { y: [-2, 2, -2] } : { y: [2, -2, 2] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-zinc-200" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-zinc-200" />
              )}
            </motion.div>
            <span className={`text-sm font-semibold ${trend === 'up' ? 'text-zinc-200' : 'text-zinc-200'}`}>
              {trendValue}%
            </span>
            <span className="text-xs text-gray-500">vs last month</span>
          </motion.div>
        )}

        {/* Línea de acento inferior */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            opacity: 0
          }}
          animate={isHovered ? { opacity: [0, 1, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
};

CinematicKpiCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  trend: PropTypes.oneOf(['up', 'down']),
  trendValue: PropTypes.string,
  color: PropTypes.string,
  delay: PropTypes.number
};

// Componente de Tabla Cinematográfica
const CinematicTable = ({ title, icon: Icon, data = [], columns = [], onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const tableRef = useRef(null);

  useEffect(() => {
    if (!tableRef.current) return;

    // Animación de entrada staggered
    const rows = tableRef.current.querySelectorAll('.table-row');
    gsap.fromTo(rows,
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out'
      }
    );
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  return (
    <div className="relative">
      {/* Header con efectos */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-2 rounded-lg bg-white/5"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Icon className="w-5 h-5 text-zinc-300" />
            </motion.div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAdd}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-zinc-800 to-zinc-800 text-white font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/50"
            >
              <Plus className="w-4 h-4" />
              Add New
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95, rotate: 180 }}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white"
            >
              <RefreshCw className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white"
            >
              <Download className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Search bar con animación */}
        <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-lg blur-lg opacity-0"
            style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}
            whileFocus={{ opacity: 0.2 }}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-zinc-700/50 transition-all duration-300"
          />
        </div>
      </motion.div>

      {/* Tabla con glassmorphism */}
      <div
        ref={tableRef}
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Table header */}
        <div className="grid grid-cols-6 gap-4 p-4 border-b border-white/10 bg-white/5">
          {columns.map((col, i) => (
            <motion.div
              key={i}
              className="text-sm font-semibold text-gray-400 uppercase tracking-wide cursor-pointer"
              whileHover={{ color: '#ffffff' }}
            >
              {col}
            </motion.div>
          ))}
        </div>

        {/* Table body */}
        <div className="divide-y divide-white/5">
          <AnimatePresence>
            {filteredData.slice(0, 10).map((row, i) => (
              <motion.div
                key={row.id || i}
                className="table-row grid grid-cols-6 gap-4 p-4 hover:bg-white/5 cursor-pointer transition-colors duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                whileHover={{ x: 5 }}
                onClick={() => setSelectedRow(row)}
              >
                {Object.values(row).slice(0, 6).map((value, j) => (
                  <div key={j} className="text-sm text-gray-300">
                    {typeof value === 'number' ? `$${value.toLocaleString()}` : value}
                  </div>
                ))}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filteredData.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-12 text-center text-gray-500"
          >
            No transactions found
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Panel Principal Cinematográfico
    </div>
  );
};

CinematicTable.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  data: PropTypes.array,
  columns: PropTypes.array,
  onAdd: PropTypes.func
};

const ChronosPanelCinematic = ({ title = "Financial Dashboard", bankId = "boveda-monte" }) => {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Datos de ejemplo
  const kpiData = [
    {
      icon: DollarSign,
      label: 'Total Balance',
      value: 245680,
      trend: 'up',
      trendValue: 12.5,
      color: '#3b82f6'
    },
    {
      icon: TrendingUp,
      label: 'Income',
      value: 89420,
      trend: 'up',
      trendValue: 8.3,
      color: '#10b981'
    },
    {
      icon: TrendingDown,
      label: 'Expenses',
      value: 34850,
      trend: 'down',
      trendValue: 5.2,
      color: '#ef4444'
    },
    {
      icon: Activity,
      label: 'Transactions',
      value: 1248,
      trend: 'up',
      trendValue: 15.8,
      color: '#8b5cf6'
    }
  ];

  const transactions = [
    { id: 1, date: '2025-11-07', client: 'Azteca Corp', amount: 15000, status: 'Completed', type: 'Income' },
    { id: 2, date: '2025-11-06', client: 'GYA Partners', amount: 8500, status: 'Pending', type: 'Income' },
    { id: 3, date: '2025-11-05', client: 'Leftie LLC', amount: 12300, status: 'Completed', type: 'Income' },
  ];

  useEffect(() => {
    // Simular carga
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!containerRef.current || isLoading) return;

    // Animación de entrada del contenedor principal
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      }
    );
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xl">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <Sparkles className="w-12 h-12 text-zinc-300" />
        </motion.div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen p-8"
      style={{
        background: 'radial-gradient(ellipse at top, #0f172a 0%, #000000 100%)'
      }}
    >
      {/* Partículas de fondo */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 5,
              repeat: Infinity
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-white via-blue-200 to-zinc-800 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-gray-400">Real-time financial control system</p>
      </motion.div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {kpiData.map((kpi, index) => (
          <CinematicKpiCard key={index} {...kpi} delay={index * 0.1} />
        ))}
      </div>

      {/* Main Content */}
      <CinematicTable
        title="Recent Transactions"
        icon={Activity}
        data={transactions}
        columns={['Date', 'Client', 'Amount', 'Status', 'Type', 'Actions']}
        onAdd={() => console.log('Add new transaction')}
      />
    </div>
  );
};

ChronosPanelCinematic.propTypes = {
  title: PropTypes.string,
  bankId: PropTypes.string
};

export default ChronosPanelCinematic;
