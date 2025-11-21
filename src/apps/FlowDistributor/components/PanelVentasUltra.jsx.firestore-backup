/**
 * 💰 CHRONOS - PANEL VENTAS ULTRA PREMIUM
 *
 * Panel de ventas con 4 tablas principales:
 * 1. Ventas Activas - Pipeline de oportunidades y deals
 * 2. Performance Vendedores - Análisis individual y team performance
 * 3. Forecasting AI - Predicciones inteligentes y machine learning
 * 4. Análisis de Mercado - Segmentación y competitive intelligence
 *
 * Características Ultra Premium:
 * - Glassmorphism con efectos dorado/oro para ventas
 * - Animaciones 3D con partículas de monedas flotantes
 * - Sistema de CRM integrado con lead scoring
 * - Forecasting con IA y predictive analytics
 * - Dashboard en tiempo real con notificaciones push
 * - Gamificación para equipos de ventas
 * - Responsive design optimizado para tablets de campo
 * - Integration con WhatsApp Business y social selling
 * - Advanced pipeline management con drag & drop
 * - Real-time sales coaching y performance insights
 *
 * @version 1.1.0 - SALES MANAGEMENT SYSTEM - Data-driven
 */
import { memo, useCallback, useMemo, useRef, useState } from 'react';

import { motion } from 'framer-motion';
import 'jspdf-autotable';
import {
  DollarSign,
  Eye,
  TrendingUp
} from 'lucide-react';

import ventasData from '../data/panel-ventas-local-manual.json';
import VentasActivasTable from './VentasActivasTable';

const PanelVentasUltra = memo(() => {
  const [ventas] = useState(ventasData.ventasLocal);
  const [searchTerm, setSearchTerm] = useState('');
  const [showValues, setShowValues] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVentas, setSelectedVentas] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'fecha', direction: 'desc' });

  // Filtros avanzados
  const [filters, setFilters] = useState({
    fechaInicio: '',
    fechaFin: '',
    clienteId: '',
    productoId: '',
    bancoDestino: '',
    montoMin: '',
    montoMax: '',
    estado: 'all'
  });

  const itemsPerPage = 10;

  const summary = useMemo(() => {
    const ventasDelMes = ventas.reduce((acc, venta) => acc + venta.ingreso, 0);
    const dealsActivos = ventas.length;
    const pagados = ventas.filter((v) => v.estatus.toLowerCase() === 'pagado').length;
    const conversionRate = dealsActivos > 0 ? (pagados / dealsActivos) * 100 : 0;

    return {
      ventasDelMes,
      ventasAnterior: ventasDelMes * 0.8, // Placeholder
      metaMensual: 5000000, // Placeholder
      progresoMeta: (ventasDelMes / 5000000) * 100,
      ventasHoy: ventas
        .filter((v) => new Date(v.fecha).toDateString() === new Date().toDateString())
        .reduce((acc, v) => acc + v.ingreso, 0),
      dealsActivos,
      conversionRate,
    };
  }, [ventas]);

  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animations
  const springConfig = { damping: 25, stiffness: 300 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // 3D transform calculations
  const rotateX = useTransform(smoothMouseY, [0, 400], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [0, 400], [-8, 8]);
  const scale = useTransform(smoothMouseX, [0, 400], [0.98, 1.02]);

  // Mouse tracking
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

  // Format currency
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  // Función de ordenamiento
  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Función de exportación a Excel
  const exportToExcel = useCallback(() => {
    const dataToExport = filteredAndSortedVentas.map(venta => ({
      'Fecha': venta.fecha,
      'Cliente': venta.cliente,
      'Concepto': venta.concepto || 'N/A',
      'Cantidad': venta.cantidad || 0,
      'Precio Unitario': venta.precioUnitario || 0,
      'Ingreso Total': venta.ingreso,
      'Banco Destino': venta.bancoDestino || 'N/A',
      'Estado': venta.estatus,
      'Método de Pago': venta.metodoPago || 'N/A'
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataToExport);

    // Estilos de columna
    ws['!cols'] = [
      { wch: 12 }, // Fecha
      { wch: 25 }, // Cliente
      { wch: 30 }, // Concepto
      { wch: 10 }, // Cantidad
      { wch: 15 }, // Precio
      { wch: 15 }, // Ingreso
      { wch: 20 }, // Banco
      { wch: 12 }, // Estado
      { wch: 15 }  // Método
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
    XLSX.writeFile(wb, `ventas_${new Date().toISOString().split('T')[0]}.xlsx`);
    setShowExportMenu(false);
  }, [filteredAndSortedVentas]);

  // Función de exportación a PDF
  const exportToPDF = useCallback(() => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text('Reporte de Ventas', 14, 20);

    // Fecha
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleString('es-MX')}`, 14, 28);

    // Tabla
    const tableData = filteredAndSortedVentas.map(venta => [
      venta.fecha,
      venta.cliente,
      venta.concepto || 'N/A',
      formatCurrency(venta.ingreso),
      venta.estatus
    ]);

    doc.autoTable({
      startY: 35,
      head: [['Fecha', 'Cliente', 'Concepto', 'Monto', 'Estado']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [99, 102, 241], textColor: 255 }
    });

    // Totales
    const totalVentas = filteredAndSortedVentas.reduce((sum, v) => sum + v.ingreso, 0);
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Total: ${formatCurrency(totalVentas)}`, 14, finalY);

    doc.save(`ventas_${new Date().toISOString().split('T')[0]}.pdf`);
    setShowExportMenu(false);
  }, [filteredAndSortedVentas, formatCurrency]);

  // Selección múltiple
  const toggleSelectVenta = useCallback((id) => {
    setSelectedVentas(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  const selectAllVentas = useCallback(() => {
    if (selectedVentas.length === filteredAndSortedVentas.length) {
      setSelectedVentas([]);
    } else {
      setSelectedVentas(filteredAndSortedVentas.map(v => v.id));
    }
  }, [selectedVentas, filteredAndSortedVentas]);

  // Filtered and sorted data
  const filteredAndSortedVentas = useMemo(() => {
    let filtered = ventas.filter((venta) => {
      // Búsqueda general
      const matchesSearch =
        venta.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (venta.concepto && venta.concepto.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filtro de estado
      const matchesStatus = filters.estado === 'all' || venta.estatus.toLowerCase() === filters.estado;

      // Filtros avanzados
      const matchesFechaInicio = !filters.fechaInicio || venta.fecha >= filters.fechaInicio;
      const matchesFechaFin = !filters.fechaFin || venta.fecha <= filters.fechaFin;
      const matchesCliente = !filters.clienteId || venta.cliente.includes(filters.clienteId);
      const matchesProducto = !filters.productoId || (venta.concepto && venta.concepto.includes(filters.productoId));
      const matchesBanco = !filters.bancoDestino || venta.bancoDestino === filters.bancoDestino;
      const matchesMontoMin = !filters.montoMin || venta.ingreso >= Number.parseFloat(filters.montoMin);
      const matchesMontoMax = !filters.montoMax || venta.ingreso <= Number.parseFloat(filters.montoMax);

      return matchesSearch && matchesStatus && matchesFechaInicio && matchesFechaFin &&
             matchesCliente && matchesProducto && matchesBanco && matchesMontoMin && matchesMontoMax;
    });

    // Ordenamiento
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Manejo especial para diferentes tipos de datos
        if (sortConfig.key === 'ingreso' || sortConfig.key === 'cantidad') {
          aValue = Number.parseFloat(aValue) || 0;
          bValue = Number.parseFloat(bValue) || 0;
        } else if (sortConfig.key === 'fecha') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else {
          aValue = String(aValue).toLowerCase();
          bValue = String(bValue).toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [ventas, searchTerm, filters, sortConfig]);

  // Paginación
  const paginatedVentas = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedVentas.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedVentas, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedVentas.length / itemsPerPage);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      className="h-full bg-black/95 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden flex flex-col"
      style={{
        perspective: 1000,
        rotateX,
        rotateY,
        scale,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div
        className="relative p-6 bg-gradient-to-r from-yellow-900/20 via-amber-900/20 to-orange-900/20 border-b border-white/10"
        variants={itemVariants}
      >
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-amber-500/5 to-orange-500/5" />
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl" />

          {/* Floating money particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`money-particle-${i + 1}`}
              className="absolute w-2 h-2 bg-yellow-400/40 rounded-full"
              style={{
                left: `${5 + i * 8}%`,
                top: `${15 + (i % 4) * 20}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.4, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3 + i * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          {/* Title and Summary */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <motion.div
                className="p-3 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-xl backdrop-blur-sm border border-white/10"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <DollarSign className="w-8 h-8 text-yellow-400" />
              </motion.div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Ventas Ultra</h2>
                <p className="text-slate-400 text-sm">
                  Sales Management System con IA predictiva y CRM avanzado
                </p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-slate-400 text-sm mb-1">Ingresos del Mes</div>
                <div className="text-2xl font-bold text-white">
                  {showValues ? formatCurrency(summary.ventasDelMes) : '••••••••'}
                </div>
                <div className="flex items-center text-green-400 text-sm mt-1 justify-end">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {summary.progresoMeta.toFixed(1)}% de la meta
                </div>
              </motion.div>

              <motion.div
                className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-slate-400 text-sm mb-1">Progreso Meta</div>
                <div className="text-2xl font-bold text-white">
                  {summary.progresoMeta.toFixed(1)}%
                </div>
                <div className="flex items-center text-amber-400 text-sm mt-1 justify-end">
                  <Target className="w-3 h-3 mr-1" />
                  Meta: {showValues ? formatCurrency(summary.metaMensual) : '••••••••'}
                </div>
              </motion.div>

              <motion.div
                className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-sm">Operaciones</span>
                  <motion.button
                    onClick={() => setShowValues(!showValues)}
                    className="text-slate-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showValues ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </motion.button>
                </div>
                <div className="text-2xl font-bold text-white">{summary.dealsActivos}</div>
                <div className="flex items-center text-yellow-400 text-sm mt-1 justify-end">
                  <Percent className="w-3 h-3 mr-1" />
                  Pagados: {summary.conversionRate.toFixed(1)}%
                </div>
              </motion.div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por cliente o concepto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-8 bg-white/5 border border-white/10 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Toolbar - Filtros y Acciones */}
      <motion.div
        className="px-6 py-4 bg-black/40 border-b border-white/10 flex flex-wrap gap-3 items-center justify-between"
        variants={itemVariants}
      >
        <div className="flex gap-2 flex-wrap">
          {/* Botón Filtros Avanzados */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              showFilters
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros {showFilters && `(${Object.values(filters).filter(v => v && v !== 'all').length})`}
          </button>

          {/* Botón Exportar */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-2 bg-white/5 text-slate-300 border border-white/10 rounded-lg flex items-center gap-2 hover:bg-white/10 transition-all"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>

            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 left-0 bg-slate-900 border border-white/10 rounded-lg overflow-hidden z-50 min-w-[150px]"
                >
                  <button
                    onClick={exportToExcel}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Excel
                  </button>
                  <button
                    onClick={exportToPDF}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    PDF
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Botón Gráficas */}
          <button
            onClick={() => setShowCharts(!showCharts)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              showCharts
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Gráficas
          </button>

          {/* Botón Refrescar */}
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white/5 text-slate-300 border border-white/10 rounded-lg flex items-center gap-2 hover:bg-white/10 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Info de resultados */}
        <div className="text-slate-400 text-sm">
          Mostrando {paginatedVentas.length} de {filteredAndSortedVentas.length} ventas
          {selectedVentas.length > 0 && ` (${selectedVentas.length} seleccionadas)`}
        </div>
      </motion.div>

      {/* Panel de Filtros Avanzados */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-black/60 border-b border-white/10 overflow-hidden"
          >
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Fecha Inicio */}
              <div>
                <label className="text-slate-300 text-sm mb-2 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={filters.fechaInicio}
                  onChange={(e) => setFilters(prev => ({ ...prev, fechaInicio: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {/* Fecha Fin */}
              <div>
                <label className="text-slate-300 text-sm mb-2 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={filters.fechaFin}
                  onChange={(e) => setFilters(prev => ({ ...prev, fechaFin: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {/* Estado */}
              <div>
                <label className="text-slate-300 text-sm mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Estado
                </label>
                <select
                  value={filters.estado}
                  onChange={(e) => setFilters(prev => ({ ...prev, estado: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="all">Todos</option>
                  <option value="pagado">Pagado</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="parcial">Parcial</option>
                </select>
              </div>

              {/* Banco Destino */}
              <div>
                <label className="text-slate-300 text-sm mb-2 flex items-center gap-2">
                  <Landmark className="w-4 h-4" />
                  Banco Destino
                </label>
                <select
                  value={filters.bancoDestino}
                  onChange={(e) => setFilters(prev => ({ ...prev, bancoDestino: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Todos</option>
                  <option value="Bóveda Monte">Bóveda Monte</option>
                  <option value="Bóveda USA">Bóveda USA</option>
                  <option value="Azteca">Azteca</option>
                  <option value="Banorte">Banorte</option>
                  <option value="Utilidades">Utilidades</option>
                  <option value="Guardadito">Guardadito</option>
                  <option value="Miel">Miel</option>
                </select>
              </div>

              {/* Monto Mínimo */}
              <div>
                <label className="text-slate-300 text-sm mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Monto Mínimo
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.montoMin}
                  onChange={(e) => setFilters(prev => ({ ...prev, montoMin: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {/* Monto Máximo */}
              <div>
                <label className="text-slate-300 text-sm mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Monto Máximo
                </label>
                <input
                  type="number"
                  placeholder="∞"
                  value={filters.montoMax}
                  onChange={(e) => setFilters(prev => ({ ...prev, montoMax: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {/* Botones de acción */}
              <div className="col-span-full flex gap-3 justify-end mt-2">
                <button
                  onClick={() => setFilters({
                    fechaInicio: '',
                    fechaFin: '',
                    clienteId: '',
                    productoId: '',
                    bancoDestino: '',
                    montoMin: '',
                    montoMax: '',
                    estado: 'all'
                  })}
                  className="px-4 py-2 bg-white/5 text-slate-300 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                >
                  Limpiar Filtros
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Body */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <VentasActivasTable
          data={paginatedVentas}
          selectedVentas={selectedVentas}
          onToggleSelect={toggleSelectVenta}
          onSelectAll={selectAllVentas}
          sortConfig={sortConfig}
          onSort={handleSort}
        />

        {/* Paginación */}
        {totalPages > 1 && (
          <motion.div
            className="mt-4 flex items-center justify-between"
            variants={itemVariants}
          >
            <div className="text-slate-400 text-sm">
              Página {currentPage} de {totalPages}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all ${
                  currentPage === 1
                    ? 'bg-white/5 text-slate-600 cursor-not-allowed'
                    : 'bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {[...Array(totalPages)].map((_, idx) => {
                const page = idx + 1;
                // Mostrar solo páginas cercanas
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg transition-all ${
                        currentPage === page
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className="px-2 text-slate-600">...</span>;
                }
                return null;
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all ${
                  currentPage === totalPages
                    ? 'bg-white/5 text-slate-600 cursor-not-allowed'
                    : 'bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

PanelVentasUltra.displayName = 'PanelVentasUltra';

export default PanelVentasUltra;
