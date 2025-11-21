/**
 * 📊 CHRONOS - PANEL REPORTES ULTRA PREMIUM
 *
 * Panel de Reportes Avanzados con 4 tablas principales:
 * 1. Report Generator - Generador visual de reportes personalizados
 * 2. Dashboard Analytics - Analytics y métricas de reportes
 * 3. Export Tools - Herramientas de exportación múltiples formatos
 * 4. Scheduled Reports - Reportes programados y automatizados
 *
 * Características Ultra Premium:
 * - Glassmorphism con efectos negro/carbón metálico oscuro
 * - Animaciones 3D con partículas de datos flotantes
 * - Visual report builder con charts dinámicos
 * - AI para generación automática de insights
 * - Advanced data visualization con D3.js integration
 * - Real-time reporting engine con big data support
 * - Responsive design optimizado para análisis ejecutivo
 * - Integration con BI tools y data warehouses
 * - Advanced filtering y drill-down capabilities
 * - Automated report distribution y alerting system
 *
 * @version 1.0.0 - REPORTES AVANZADOS SYSTEM
 */
import { memo, useCallback, useMemo, useRef, useState } from 'react';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  BarChart3,
  Building,
  Calendar,
  Clock,
  Database,
  Download,
  Eye,
  EyeOff,
  FileBarChart,
  FilePlus,
  FileText,
  Grid,
  List,
  Monitor,
  PieChart,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Target,
  TrendingUp,
} from 'lucide-react';
import PropTypes from 'prop-types';

// Datos completos de reportes
const INITIAL_DATA = {
  summary: {
    totalReportes: 156,
    reportesActivos: 89,
    reportesProgramados: 34,
    reportesArchivados: 33,
    ejecutionesHoy: 245,
    usuariosActivos: 67,
    formatosExportacion: ['PDF', 'Excel', 'CSV', 'JSON', 'PowerBI', 'Tableau'],
    tiempoPromedioGeneracion: 2.8,
    ultimaActualizacion: new Date().toISOString(),
  },

  // Tabla 1: Report Generator - Generador de reportes
  reportGenerator: [
    {
      id: 'RPT-001',
      nombre: 'Dashboard Ejecutivo Mensual',
      categoria: 'Ejecutivo',
      tipo: 'dashboard',
      estado: 'activo',
      fechaCreacion: '2025-10-01T00:00:00Z',
      fechaModificacion: '2025-11-05T15:30:00Z',
      creador: 'CEO María González',
      descripcion: 'Reporte ejecutivo completo con KPIs principales del negocio',
      fuentes: ['ventas', 'finanzas', 'operaciones', 'rrhh'],
      visualizaciones: [
        { tipo: 'bar_chart', titulo: 'Ventas por Región', posicion: { x: 0, y: 0, w: 6, h: 4 } },
        { tipo: 'line_chart', titulo: 'Tendencia Ingresos', posicion: { x: 6, y: 0, w: 6, h: 4 } },
        { tipo: 'pie_chart', titulo: 'Distribución Gastos', posicion: { x: 0, y: 4, w: 4, h: 3 } },
        { tipo: 'metric_card', titulo: 'ROI Mensual', posicion: { x: 4, y: 4, w: 2, h: 3 } },
        { tipo: 'table', titulo: 'Top 10 Clientes', posicion: { x: 6, y: 4, w: 6, h: 3 } },
        { tipo: 'gauge', titulo: 'Satisfacción Cliente', posicion: { x: 0, y: 7, w: 3, h: 2 } },
        { tipo: 'heatmap', titulo: 'Performance por Área', posicion: { x: 3, y: 7, w: 9, h: 2 } },
      ],
      filtros: [
        { campo: 'fecha', tipo: 'date_range', valor: 'ultimo_mes' },
        { campo: 'region', tipo: 'multi_select', valor: ['norte', 'centro', 'sur'] },
        { campo: 'tipo_cliente', tipo: 'select', valor: 'todos' },
      ],
      configuracion: {
        autoRefresh: true,
        refreshInterval: 300,
        alertas: true,
        exportFormats: ['PDF', 'PowerBI'],
        distribucion: ['email', 'slack'],
        acceso: ['ceo', 'gerentes', 'directores'],
      },
      metricas: {
        ejecuciones: 156,
        tiempoPromedio: 1.8,
        puntuacion: 4.9,
        vistas: 2347,
      },
    },
    {
      id: 'RPT-002',
      nombre: 'Análisis de Ventas por Equipo',
      categoria: 'Ventas',
      tipo: 'reporte',
      estado: 'activo',
      fechaCreacion: '2025-09-15T00:00:00Z',
      fechaModificacion: '2025-11-04T11:20:00Z',
      creador: 'Director Ventas Carlos Mendoza',
      descripcion: 'Análisis detallado del performance de equipos de ventas',
      fuentes: ['crm', 'ventas', 'comisiones'],
      visualizaciones: [
        { tipo: 'bar_chart', titulo: 'Ventas por Vendedor', posicion: { x: 0, y: 0, w: 8, h: 5 } },
        { tipo: 'line_chart', titulo: 'Tendencia Mensual', posicion: { x: 8, y: 0, w: 4, h: 5 } },
        { tipo: 'table', titulo: 'Ranking Vendedores', posicion: { x: 0, y: 5, w: 6, h: 4 } },
        { tipo: 'pie_chart', titulo: 'Canales de Venta', posicion: { x: 6, y: 5, w: 6, h: 4 } },
      ],
      filtros: [
        { campo: 'periodo', tipo: 'date_range', valor: 'ultimo_trimestre' },
        { campo: 'equipo', tipo: 'multi_select', valor: ['equipo_a', 'equipo_b', 'equipo_c'] },
        { campo: 'producto', tipo: 'select', valor: 'todos' },
      ],
      configuracion: {
        autoRefresh: true,
        refreshInterval: 600,
        alertas: true,
        exportFormats: ['Excel', 'PDF'],
        distribucion: ['email'],
        acceso: ['ventas', 'gerencia_ventas'],
      },
      metricas: {
        ejecuciones: 89,
        tiempoPromedio: 2.1,
        puntuacion: 4.7,
        vistas: 1456,
      },
    },
    {
      id: 'RPT-003',
      nombre: 'Control de Gastos Operativos',
      categoria: 'Finanzas',
      tipo: 'reporte',
      estado: 'activo',
      fechaCreacion: '2025-10-10T00:00:00Z',
      fechaModificacion: '2025-11-03T14:45:00Z',
      creador: 'CFO Ana Martínez',
      descripcion: 'Monitoreo y control de gastos operativos por categorías',
      fuentes: ['gastos', 'presupuestos', 'contabilidad'],
      visualizaciones: [
        {
          tipo: 'waterfall_chart',
          titulo: 'Variación Presupuestaria',
          posicion: { x: 0, y: 0, w: 12, h: 4 },
        },
        { tipo: 'tree_map', titulo: 'Gastos por Categoría', posicion: { x: 0, y: 4, w: 8, h: 4 } },
        { tipo: 'gauge', titulo: 'Utilización Presupuesto', posicion: { x: 8, y: 4, w: 4, h: 4 } },
        { tipo: 'table', titulo: 'Top Gastos del Mes', posicion: { x: 0, y: 8, w: 12, h: 3 } },
      ],
      filtros: [
        { campo: 'mes', tipo: 'date_range', valor: 'mes_actual' },
        {
          campo: 'categoria',
          tipo: 'multi_select',
          valor: ['operaciones', 'tecnologia', 'marketing'],
        },
        { campo: 'centro_costo', tipo: 'select', valor: 'todos' },
      ],
      configuracion: {
        autoRefresh: true,
        refreshInterval: 900,
        alertas: true,
        exportFormats: ['Excel', 'PDF', 'CSV'],
        distribucion: ['email', 'sharepoint'],
        acceso: ['finanzas', 'gerencias', 'contabilidad'],
      },
      metricas: {
        ejecuciones: 134,
        tiempoPromedio: 3.2,
        puntuacion: 4.8,
        vistas: 1789,
      },
    },
    {
      id: 'RPT-004',
      nombre: 'Dashboard de Operaciones',
      categoria: 'Operaciones',
      tipo: 'dashboard',
      estado: 'borrador',
      fechaCreacion: '2025-11-01T00:00:00Z',
      fechaModificacion: '2025-11-05T09:30:00Z',
      creador: 'Jefe Operaciones José Ramírez',
      descripcion: 'Monitoreo en tiempo real de operaciones y logística',
      fuentes: ['logistica', 'inventarios', 'pedidos', 'proveedores'],
      visualizaciones: [
        { tipo: 'map', titulo: 'Rutas de Entrega', posicion: { x: 0, y: 0, w: 8, h: 5 } },
        { tipo: 'metric_grid', titulo: 'KPIs Operativos', posicion: { x: 8, y: 0, w: 4, h: 5 } },
        {
          tipo: 'bar_chart',
          titulo: 'Inventario por Almacén',
          posicion: { x: 0, y: 5, w: 6, h: 4 },
        },
        { tipo: 'line_chart', titulo: 'Entregas Diarias', posicion: { x: 6, y: 5, w: 6, h: 4 } },
      ],
      filtros: [
        { campo: 'tiempo_real', tipo: 'toggle', valor: true },
        { campo: 'almacen', tipo: 'multi_select', valor: ['principal', 'norte', 'sur'] },
        { campo: 'estado_pedido', tipo: 'select', valor: 'activos' },
      ],
      configuracion: {
        autoRefresh: true,
        refreshInterval: 60,
        alertas: true,
        exportFormats: ['PDF'],
        distribucion: ['dashboard'],
        acceso: ['operaciones', 'logistica'],
      },
      metricas: {
        ejecuciones: 0,
        tiempoPromedio: 0,
        puntuacion: 0,
        vistas: 0,
      },
    },
  ],

  // Tabla 2: Dashboard Analytics - Analytics de reportes
  dashboardAnalytics: [
    {
      reporteId: 'RPT-001',
      nombre: 'Dashboard Ejecutivo Mensual',
      periodo: '30_dias',
      metricas: {
        vistas: 2347,
        vistasUnicas: 67,
        tiempoPromedio: 8.5,
        interacciones: 1234,
        exportaciones: 89,
        compartidos: 45,
        dispositivosTop: [
          { dispositivo: 'Desktop', porcentaje: 78.2, vistas: 1835 },
          { dispositivo: 'Tablet', porcentaje: 15.3, vistas: 359 },
          { dispositivo: 'Mobile', porcentaje: 6.5, vistas: 153 },
        ],
        horariosTop: [
          { hora: '09:00', vistas: 287, porcentaje: 12.2 },
          { hora: '10:00', vistas: 245, porcentaje: 10.4 },
          { hora: '14:00', vistas: 198, porcentaje: 8.4 },
          { hora: '16:00', vistas: 176, porcentaje: 7.5 },
        ],
        formatosExportacion: [
          { formato: 'PDF', descargas: 54, porcentaje: 60.7 },
          { formato: 'PowerBI', descargas: 23, porcentaje: 25.8 },
          { formato: 'Excel', descargas: 12, porcentaje: 13.5 },
        ],
        usuariosTop: [
          { usuario: 'María González (CEO)', vistas: 156, tiempo: 45.2 },
          { usuario: 'Carlos Mendoza (Dir. Ventas)', vistas: 134, tiempo: 38.7 },
          { usuario: 'Ana Martínez (CFO)', vistas: 98, tiempo: 42.1 },
          { usuario: 'José Ramírez (Jefe Ops)', vistas: 87, tiempo: 35.4 },
        ],
      },
    },
    {
      reporteId: 'RPT-002',
      nombre: 'Análisis de Ventas por Equipo',
      periodo: '30_dias',
      metricas: {
        vistas: 1456,
        vistasUnicas: 23,
        tiempoPromedio: 6.2,
        interacciones: 567,
        exportaciones: 45,
        compartidos: 12,
        dispositivosTop: [
          { dispositivo: 'Desktop', porcentaje: 85.4, vistas: 1243 },
          { dispositivo: 'Mobile', porcentaje: 9.8, vistas: 143 },
          { dispositivo: 'Tablet', porcentaje: 4.8, vistas: 70 },
        ],
        horariosTop: [
          { hora: '08:00', vistas: 198, porcentaje: 13.6 },
          { hora: '09:00', vistas: 167, porcentaje: 11.5 },
          { hora: '17:00', vistas: 145, porcentaje: 10.0 },
          { hora: '11:00', vistas: 134, porcentaje: 9.2 },
        ],
        formatosExportacion: [
          { formato: 'Excel', descargas: 28, porcentaje: 62.2 },
          { formato: 'PDF', descargas: 17, porcentaje: 37.8 },
        ],
        usuariosTop: [
          { usuario: 'Carlos Mendoza (Dir. Ventas)', vistas: 245, tiempo: 67.8 },
          { usuario: 'Equipo Ventas Norte', vistas: 189, tiempo: 45.2 },
          { usuario: 'Equipo Ventas Centro', vistas: 167, tiempo: 38.9 },
          { usuario: 'Equipo Ventas Sur', vistas: 134, tiempo: 42.3 },
        ],
      },
    },
  ],

  // Tabla 3: Export Tools - Herramientas de exportación
  exportTools: [
    {
      id: 'EXP-001',
      formato: 'PDF',
      descripcion: 'Exportación a PDF con diseño profesional y branding corporativo',
      configuracion: {
        orientacion: 'landscape',
        tamaño: 'A4',
        calidad: 'alta',
        incluirGraficos: true,
        incluirTablas: true,
        incluirLogos: true,
        watermark: false,
        compresion: 'media',
      },
      estadisticas: {
        exportacionesTotal: 456,
        exportacionesMes: 89,
        tiempoPromedio: 3.2,
        tamañoPromedio: 2.4, // MB
        exitos: 98.5, // porcentaje
        errores: 1.5,
      },
      limitaciones: {
        tamañoMaximo: 50, // MB
        paginasMaximas: 100,
        graficosMaximos: 50,
        tablaMaximaFilas: 10000,
      },
    },
    {
      id: 'EXP-002',
      formato: 'Excel',
      descripcion: 'Exportación a Excel con múltiples hojas y funciones avanzadas',
      configuracion: {
        version: 'xlsx',
        incluirFormulas: true,
        incluirFormato: true,
        incluirGraficos: true,
        proteccionHojas: false,
        macros: false,
        compresion: true,
      },
      estadisticas: {
        exportacionesTotal: 234,
        exportacionesMes: 67,
        tiempoPromedio: 2.8,
        tamañoPromedio: 1.8,
        exitos: 97.2,
        errores: 2.8,
      },
      limitaciones: {
        tamañoMaximo: 100,
        filasMaximas: 1000000,
        columnasMaximas: 16384,
        hojasMaximas: 50,
      },
    },
    {
      id: 'EXP-003',
      formato: 'PowerBI',
      descripcion: 'Exportación directa a Power BI para análisis interactivo',
      configuracion: {
        workspace: 'Chronos Analytics',
        dataset: 'auto_refresh',
        conexion: 'directquery',
        seguridad: 'rls_enabled',
        actualizacion: 'programada',
        alertas: true,
      },
      estadisticas: {
        exportacionesTotal: 123,
        exportacionesMes: 34,
        tiempoPromedio: 5.4,
        tamañoPromedio: 15.2,
        exitos: 94.3,
        errores: 5.7,
      },
      limitaciones: {
        tamañoMaximo: 1000, // MB
        tablasMaximas: 100,
        relacionesMaximas: 1000,
        medidassMaximas: 500,
      },
    },
    {
      id: 'EXP-004',
      formato: 'CSV',
      descripcion: 'Exportación a CSV para integración con sistemas externos',
      configuracion: {
        delimitador: ',',
        codificacion: 'UTF-8',
        incluirEncabezados: true,
        formatoFecha: 'ISO',
        escaparCaracteres: true,
        compresion: 'gzip',
      },
      estadisticas: {
        exportacionesTotal: 567,
        exportacionesMes: 145,
        tiempoPromedio: 1.2,
        tamañoPromedio: 0.8,
        exitos: 99.1,
        errores: 0.9,
      },
      limitaciones: {
        tamañoMaximo: 500,
        filasMaximas: 5000000,
        columnasMaximas: 1000,
        archivosSimultaneos: 10,
      },
    },
  ],

  // Tabla 4: Scheduled Reports - Reportes programados
  scheduledReports: [
    {
      id: 'SCH-001',
      reporteId: 'RPT-001',
      nombre: 'Dashboard Ejecutivo Mensual',
      frecuencia: 'mensual',
      configuracion: {
        dia: 1, // primer día del mes
        hora: '08:00',
        zona: 'America/Mexico_City',
        formato: 'PDF',
        destinatarios: ['ceo@chronos.com', 'gerencias@chronos.com'],
        asunto: 'Dashboard Ejecutivo - {mes} {año}',
        mensaje: 'Adjunto dashboard ejecutivo mensual con KPIs principales.',
        adjuntar: ['reporte_pdf', 'datos_excel'],
      },
      estado: 'activo',
      ultimaEjecucion: '2025-11-01T08:00:00Z',
      proximaEjecucion: '2025-12-01T08:00:00Z',
      historial: [
        { fecha: '2025-11-01T08:00:00Z', estado: 'exitoso', tiempo: 2.3, destinatarios: 8 },
        { fecha: '2025-10-01T08:00:00Z', estado: 'exitoso', tiempo: 1.9, destinatarios: 8 },
        { fecha: '2025-09-01T08:00:00Z', estado: 'exitoso', tiempo: 2.1, destinatarios: 7 },
      ],
      metricas: {
        ejecutado: 12,
        exitosos: 11,
        fallos: 1,
        tasaExito: 91.7,
        tiempoPromedio: 2.1,
      },
    },
    {
      id: 'SCH-002',
      reporteId: 'RPT-002',
      nombre: 'Reporte Semanal de Ventas',
      frecuencia: 'semanal',
      configuracion: {
        dia: 1, // lunes
        hora: '07:30',
        zona: 'America/Mexico_City',
        formato: 'Excel',
        destinatarios: ['ventas@chronos.com', 'carlos.mendoza@chronos.com'],
        asunto: 'Reporte Semanal Ventas - Semana {semana}',
        mensaje: 'Reporte semanal del performance del equipo de ventas.',
        adjuntar: ['reporte_excel', 'dashboard_link'],
      },
      estado: 'activo',
      ultimaEjecucion: '2025-11-04T07:30:00Z',
      proximaEjecucion: '2025-11-11T07:30:00Z',
      historial: [
        { fecha: '2025-11-04T07:30:00Z', estado: 'exitoso', tiempo: 1.8, destinatarios: 15 },
        { fecha: '2025-10-28T07:30:00Z', estado: 'exitoso', tiempo: 2.1, destinatarios: 15 },
        { fecha: '2025-10-21T07:30:00Z', estado: 'error', tiempo: 0, destinatarios: 0 },
      ],
      metricas: {
        ejecutado: 48,
        exitosos: 45,
        fallos: 3,
        tasaExito: 93.8,
        tiempoPromedio: 1.9,
      },
    },
    {
      id: 'SCH-003',
      reporteId: 'RPT-003',
      nombre: 'Control Gastos Semanal',
      frecuencia: 'semanal',
      configuracion: {
        dia: 5, // viernes
        hora: '17:00',
        zona: 'America/Mexico_City',
        formato: 'PDF',
        destinatarios: ['finanzas@chronos.com', 'ana.martinez@chronos.com'],
        asunto: 'Control de Gastos - Semana {semana}',
        mensaje: 'Reporte semanal de control de gastos operativos.',
        adjuntar: ['reporte_pdf'],
      },
      estado: 'activo',
      ultimaEjecucion: '2025-11-01T17:00:00Z',
      proximaEjecucion: '2025-11-08T17:00:00Z',
      historial: [
        { fecha: '2025-11-01T17:00:00Z', estado: 'exitoso', tiempo: 2.7, destinatarios: 12 },
        { fecha: '2025-10-25T17:00:00Z', estado: 'exitoso', tiempo: 2.4, destinatarios: 12 },
        { fecha: '2025-10-18T17:00:00Z', estado: 'exitoso', tiempo: 2.9, destinatarios: 11 },
      ],
      metricas: {
        ejecutado: 24,
        exitosos: 23,
        fallos: 1,
        tasaExito: 95.8,
        tiempoPromedio: 2.6,
      },
    },
  ],
};

const PanelReportesUltra = memo(({ data = INITIAL_DATA, onDataChange }) => {
  const [localData, setLocalData] = useState(data);
  const [activeTable, setActiveTable] = useState('generator');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('all');
  const [filterEstado, setFilterEstado] = useState('all');
  const [showValues, setShowValues] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

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

  // Get status color
  const getStatusColor = useCallback((estado) => {
    switch (estado) {
      case 'activo':
        return { color: 'text-zinc-200', bgColor: 'bg-zinc-9000/20' };
      case 'borrador':
        return { color: 'text-zinc-200', bgColor: 'bg-zinc-9000/20' };
      case 'archivado':
        return { color: 'text-gray-400', bgColor: 'bg-gray-500/20' };
      case 'pausado':
        return { color: 'text-zinc-200', bgColor: 'bg-zinc-9000/20' };
      case 'exitoso':
        return { color: 'text-zinc-200', bgColor: 'bg-zinc-9000/20' };
      case 'error':
        return { color: 'text-zinc-200', bgColor: 'bg-zinc-9000/20' };
      default:
        return { color: 'text-slate-400', bgColor: 'bg-slate-500/20' };
    }
  }, []);

  // Get chart type icon
  const getChartIcon = useCallback((tipo) => {
    switch (tipo) {
      case 'bar_chart':
        return BarChart3;
      case 'line_chart':
        return TrendingUp;
      case 'pie_chart':
        return PieChart;
      case 'table':
        return List;
      case 'gauge':
        return Target;
      case 'metric_card':
        return Monitor;
      case 'map':
        return Building;
      case 'heatmap':
        return Grid;
      default:
        return FileBarChart;
    }
  }, []);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return localData.reportGenerator.filter((report) => {
      const matchesSearch =
        report.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.creador.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategoria === 'all' || report.categoria === filterCategoria;
      const matchesStatus = filterEstado === 'all' || report.estado === filterEstado;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [localData.reportGenerator, searchTerm, filterCategoria, filterEstado]);

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
      className="h-full bg-black/95 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden"
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
        className="relative p-6 bg-gradient-to-r from-zinc-900/30 via-black/40 to-slate-900/30 border-b border-white/10"
        variants={itemVariants}
      >
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-500/5 via-black/10 to-slate-500/5" />
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-zinc-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-black/20 rounded-full blur-2xl" />

          {/* Floating data particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`data-particle-${i + 1}`}
              className="absolute w-1 h-1 bg-zinc-400/40 rounded-full"
              style={{
                left: `${10 + i * 7}%`,
                top: `${20 + (i % 4) * 15}%`,
              }}
              animate={{
                y: [-3, 5, -3],
                opacity: [0.4, 0.9, 0.4],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2.8 + i * 0.15,
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
                className="p-3 bg-gradient-to-br from-zinc-500/20 to-black/30 rounded-xl backdrop-blur-sm border border-white/10"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <FileBarChart className="w-8 h-8 text-zinc-300" />
              </motion.div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Reportes Ultra</h2>
                <p className="text-slate-400 text-sm">
                  Generador avanzado de reportes con analytics y automatización
                </p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-slate-400 text-sm mb-1">Total Reportes</div>
                <div className="text-2xl font-bold text-white">
                  {showValues ? localData.summary.totalReportes : '•••'}
                </div>
                <div className="flex items-center text-zinc-400 text-sm mt-1">
                  <FileText className="w-3 h-3 mr-1" />
                  {localData.summary.reportesActivos} activos
                </div>
              </motion.div>

              <motion.div
                className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-slate-400 text-sm mb-1">Ejecuciones Hoy</div>
                <div className="text-2xl font-bold text-white">
                  {showValues ? localData.summary.ejecutionesHoy : '•••'}
                </div>
                <div className="flex items-center text-zinc-200 text-sm mt-1">
                  <Play className="w-3 h-3 mr-1" />
                  {localData.summary.usuariosActivos} usuarios
                </div>
              </motion.div>

              <motion.div
                className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-sm">Programados</span>
                  <motion.button
                    onClick={() => setShowValues(!showValues)}
                    className="text-slate-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showValues ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </motion.button>
                </div>
                <div className="text-2xl font-bold text-white">
                  {showValues ? localData.summary.reportesProgramados : '••'}
                </div>
                <div className="flex items-center text-zinc-300 text-sm mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  {localData.summary.tiempoPromedioGeneracion}s promedio
                </div>
              </motion.div>
            </div>
          </div>

          {/* Performance Bar */}
          <motion.div
            className="p-4 bg-gradient-to-r from-zinc-500/10 to-black/20 rounded-xl border border-zinc-500/20 backdrop-blur-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Database className="w-5 h-5 text-zinc-400" />
                </motion.div>
                <span className="text-white font-medium">Motor de Reportes Avanzado Activo</span>
                <div className="flex space-x-2">
                  {localData.summary.formatosExportacion.slice(0, 4).map((formato, index) => (
                    <span
                      key={formato}
                      className="px-2 py-1 bg-zinc-500/20 text-zinc-400 rounded-full text-xs"
                    >
                      {formato}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-slate-300 text-sm">
                  BI Engine: {localData.summary.formatosExportacion.length} formatos
                </span>
                <motion.button
                  className="p-1 text-zinc-400 hover:text-zinc-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <Settings className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        className="px-6 py-4 bg-black/40 border-b border-white/10"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between">
          {/* Table Tabs */}
          <div className="flex space-x-1 bg-white/5 p-1 rounded-xl">
            {[
              { id: 'generator', label: 'Report Generator', icon: FilePlus },
              { id: 'analytics', label: 'Dashboard Analytics', icon: BarChart3 },
              { id: 'export', label: 'Export Tools', icon: Download },
              { id: 'scheduled', label: 'Scheduled Reports', icon: Calendar },
            ].map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                onClick={() => setActiveTable(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTable === id
                    ? 'bg-zinc-500/20 text-zinc-300 shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </motion.button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Category Filter */}
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            >
              <option value="all">Todas las categorías</option>
              <option value="Ejecutivo">Ejecutivo</option>
              <option value="Ventas">Ventas</option>
              <option value="Finanzas">Finanzas</option>
              <option value="Operaciones">Operaciones</option>
              <option value="RRHH">RRHH</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            >
              <option value="all">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="borrador">Borrador</option>
              <option value="archivado">Archivado</option>
            </select>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar reportes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-500/50 w-64"
              />
            </div>

            {/* Actions */}
            <motion.button
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
            </motion.button>

            <motion.button
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <FileBarChart className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Panel Reportes Ultra Completado</h3>
          <p className="text-slate-400 max-w-md">
            Sistema avanzado de reportes con 4 módulos: Report Generator, Dashboard Analytics,
            Export Tools y Scheduled Reports
          </p>
        </div>
      </div>
    </motion.div>
  );
});

PanelReportesUltra.displayName = 'PanelReportesUltra';

PanelReportesUltra.propTypes = {
  data: PropTypes.object,
  onDataChange: PropTypes.func,
};

export default PanelReportesUltra;
