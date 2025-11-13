/**
 * 🏦 CHRONOS - PANEL AZTECA ULTRA PREMIUM
 *
 * @version 1.1.0 - AZTECA ULTRA - Data-driven
 */
import { memo, useCallback, useMemo, useRef, useState } from 'react';

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  BarChart3,
  Building,
  DollarSign,
  Download,
  Eye,
  EyeOff,
  Search,
  Settings,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import aztecaData from '../data/panel-azteca-manual.json';
import GastosAztecaTable from './GastosAztecaTable';
import IngresosAztecaTable from './IngresosAztecaTable';

const PanelAztecaUltra = memo(() => {
  const [activeTable, setActiveTable] = useState('ingresos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showValues, setShowValues] = useState(true);

  const data = aztecaData.azteca;

  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [0, 400], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [0, 400], [-8, 8]);
  const scale = useTransform(smoothMouseX, [0, 400], [0.98, 1.02]);

  const handleMouseMove = useCallback(
    (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  const filteredIngresos = useMemo(() => {
    return data.ingresosList.filter(
      (i) =>
        i.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.concepto.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data.ingresosList, searchTerm]);

  const filteredGastos = useMemo(() => {
    return data.gastosList.filter(
      (g) =>
        (g.origen && g.origen.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (g.concepto && g.concepto.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [data.gastosList, searchTerm]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const tableVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      ref={containerRef}
      className="h-full bg-black/95 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden flex flex-col"
      style={{ perspective: 1000, rotateX, rotateY, scale }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div
        className="relative p-6 bg-gradient-to-r from-red-900/20 via-orange-900/20 to-yellow-900/20 border-b border-white/10"
        variants={itemVariants}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <motion.div
                className="p-3 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl backdrop-blur-sm border border-white/10"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Building className="w-8 h-8 text-orange-400" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Banco Azteca Ultra</h2>
                <p className="text-slate-400 text-sm">Análisis de Ingresos y Gastos</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <motion.div className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="text-slate-400 text-sm mb-1">Ingresos Totales</div>
                <div className="text-2xl font-bold text-green-400">
                  {showValues ? formatCurrency(data.ingresos) : '••••••'}
                </div>
              </motion.div>
              <motion.div className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="text-slate-400 text-sm mb-1">Gastos Totales</div>
                <div className="text-2xl font-bold text-red-400">
                  {showValues ? formatCurrency(data.gastos) : '••••••'}
                </div>
              </motion.div>
              <motion.div className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-sm">Balance Actual</span>
                  <motion.button
                    onClick={() => setShowValues(!showValues)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {showValues ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </motion.button>
                </div>
                <div
                  className={`text-2xl font-bold ${data.rfActual >= 0 ? 'text-green-400' : 'text-red-400'}`}
                >
                  {showValues ? formatCurrency(data.rfActual) : '••••••'}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        className="px-6 py-4 bg-black/40 border-b border-white/10"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between">
          <div className="flex space-x-1 bg-white/5 p-1 rounded-xl">
            {[
              { id: 'ingresos', label: 'Ingresos', icon: TrendingUp },
              { id: 'gastos', label: 'Gastos', icon: TrendingDown },
            ].map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                onClick={() => setActiveTable(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTable === id
                    ? 'bg-orange-500/20 text-orange-400 shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </motion.button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar transacciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 w-64"
              />
            </div>
            <motion.button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
              <Download className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTable === 'ingresos' && (
            <motion.div
              key="ingresos"
              variants={tableVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="h-full"
            >
              <IngresosAztecaTable data={filteredIngresos} />
            </motion.div>
          )}
          {activeTable === 'gastos' && (
            <motion.div
              key="gastos"
              variants={tableVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="h-full"
            >
              <GastosAztecaTable data={filteredGastos} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

PanelAztecaUltra.displayName = 'PanelAztecaUltra';

export default PanelAztecaUltra;
