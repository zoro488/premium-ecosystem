/**
 * 📦 PANEL DE ALMACÉN MONTE - SISTEMA ELEGANTE
 * ===============================================
 *
 * Panel unificado que consolida:
 * - Resumen ejecutivo (Ingresos, Salidas, RF Actual)
 * - Registro de Órdenes de Compra (Ingresos)
 * - Registro de Salidas
 * - Cortes de RF Actual
 *
 * Características:
 * - Vista consolidada con KPIs principales
 * - Filtrado cruzado entre secciones
 * - Búsqueda unificada
 * - Gráficos interactivos con drill-down
 * - Timeline de movimientos
 * - Alertas de inventario bajo
 * ✨ Diseño elegante con partículas y scroll progress para consistencia
 *
 * @version 2.0.0
 * @author FlowDistributor Team
 */
import { memo, useMemo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
    Activity,
    BarChart3,
    Calendar,
    CheckCircle,
    Filter,
    Grid,
    List,
    Package,
    Search,
    ShoppingCart,
    TrendingDown,
    TrendingUp,
    Truck,
    User
} from 'lucide-react';

// Importar Firestore

// Importar ElegantComponents para consistencia
import { CreativeParticles, ScrollProgress } from './ElegantComponents';
// Importar gráficos premium
import { GraficoArea, GraficoBarras, GraficoLinea } from './GraficosPremium';

const calcularEstadisticasAlmacen = () => ({
  totalIngresos: 0,
  cantidadOrdenes: 0,
  totalSalidas: 0,
  cantidadSalidas: 0,
  balanceNeto: 0,
  porcentajeRotacion: 0,
  rfActual: 0,
});

// Theme Colors
const COLORS = {
  primary: ['#a855f7', '#ec4899'],
  particles: {
    from: 'rgba(168, 85, 247, 0.6)',
    to: 'rgba(236, 72, 153, 0.3)',
  },
};

/**
 * 🪝 Hook para cargar datos desde Firestore en tiempo real
 */
const useFirestoreCollection = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error(`Error loading ${collectionName}:`, err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading, error };
};

/**
 * 📊 Widget de Orden de Compra
 */
const OrdenWidget = ({ orden }) => {
  const [expandido, setExpandido] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={() => setExpandido(!expandido)}
      className="relative p-5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-zinc-500/50 cursor-pointer transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-zinc-9000/20">
            <ShoppingCart className="w-5 h-5 text-zinc-200" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{orden.id}</h3>
            <p className="text-gray-400 text-sm">{orden.distribuidor}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-zinc-200">{orden.cantidad}</div>
          <div className="text-xs text-gray-400">unidades</div>
        </div>
      </div>

      {/* Fecha */}
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Calendar className="w-4 h-4" />
        <span>
          {new Date(orden.fecha).toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </span>
      </div>

      {/* Badge de estatus */}
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3">
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-9000/20 text-zinc-200 text-xs font-medium">
          <CheckCircle className="w-3 h-3" />
          <span>Completado</span>
        </div>
      </motion.div>

      {/* Efecto shimmer */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{ x: [-200, 400] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  );
};

/**
 * 📤 Widget de Salida
 */
const SalidaWidget = ({ salida }) => {
  const [expandido, setExpandido] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={() => setExpandido(!expandido)}
      className="relative p-5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-zinc-500/50 cursor-pointer transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-zinc-9000/20">
            <Truck className="w-5 h-5 text-zinc-200" />
          </div>
          <div>
            <h3 className="text-white font-bold">{salida.cliente}</h3>
            <p className="text-gray-400 text-xs">{salida.concepto || 'Sin concepto'}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-zinc-200">{salida.cantidad}</div>
          <div className="text-xs text-gray-400">unidades</div>
        </div>
      </div>

      {/* Fecha */}
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Calendar className="w-4 h-4" />
        <span>
          {new Date(salida.fecha).toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'short',
          })}
        </span>
      </div>

      {/* Efecto shimmer */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{ x: [-200, 400] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  );
};

/**
 * 🎯 Componente Principal - Panel de Almacén
 */
const PanelAlmacen = () => {
  const [vistaActual, setVistaActual] = useState('resumen'); // 'resumen', 'ingresos', 'salidas', 'cortes'
  const [busqueda, setBusqueda] = useState('');
  const [filtroDistribuidor, setFiltroDistribuidor] = useState('todos');
  const [filtroCliente, setFiltroCliente] = useState('todos');
  const [fechaInicio, _setFechaInicio] = useState('');
  const [fechaFin, _setFechaFin] = useState('');
  const [modoVista, setModoVista] = useState('grid'); // 'grid', 'list'

  // 🔥 Cargar datos desde Firestore en tiempo real
  const { data: ordenesCompra, loading: loadingOrdenes } = useFirestoreCollection('almacen_ordenes_compra');
  const { data: ingresosAlmacen, loading: loadingIngresos } = useFirestoreCollection('almacen_ingresos');
  const { data: salidasAlmacen, loading: loadingSalidas } = useFirestoreCollection('almacen_salidas');

  // Mapear órdenes de compra al formato esperado
  const ORDENES_COMPRA_ALMACEN = useMemo(() => {
    return ordenesCompra.map((item) => ({
      id: item.OC || item.id,
      distribuidor: item.Origen || item.distribuidor,
      cantidad: item.Cantidad || item.cantidad,
      fecha: item.Fecha || item.fecha,
    }));
  }, [ordenesCompra]);

  const SALIDAS_ALMACEN = salidasAlmacen;
  const RF_ACTUAL_CORTES = ingresosAlmacen; // Los ingresos se usan para rfActual

  // Loading state
  const isLoading = loadingOrdenes || loadingIngresos || loadingSalidas;

  // Calcular estadísticas
  const estadisticas = useMemo(() => calcularEstadisticasAlmacen(), []);

  // Obtener distribuidores únicos
  const distribuidores = useMemo(() => {
    const unicos = [...new Set(ORDENES_COMPRA_ALMACEN.map((o) => o.distribuidor))];
    return unicos.sort();
  }, [ORDENES_COMPRA_ALMACEN]);

  // Obtener clientes únicos
  const clientes = useMemo(() => {
    const unicos = [...new Set(SALIDAS_ALMACEN.map((s) => s.cliente))];
    return unicos.sort();
  }, [SALIDAS_ALMACEN]);

  // Filtrar órdenes
  const ordenesFiltradas = useMemo(() => {
    return ORDENES_COMPRA_ALMACEN.filter((orden) => {
      const matchBusqueda =
        busqueda === '' ||
        orden.id.toLowerCase().includes(busqueda.toLowerCase()) ||
        orden.distribuidor.toLowerCase().includes(busqueda.toLowerCase());

      const matchDistribuidor =
        filtroDistribuidor === 'todos' || orden.distribuidor === filtroDistribuidor;

      const matchFecha =
        (!fechaInicio || orden.fecha >= fechaInicio) && (!fechaFin || orden.fecha <= fechaFin);

      return matchBusqueda && matchDistribuidor && matchFecha;
    });
  }, [busqueda, filtroDistribuidor, fechaInicio, fechaFin]);

  // Filtrar salidas
  const salidasFiltradas = useMemo(() => {
    return SALIDAS_ALMACEN.filter((salida) => {
      const matchBusqueda =
        busqueda === '' ||
        salida.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
        salida.concepto.toLowerCase().includes(busqueda.toLowerCase());

      const matchCliente = filtroCliente === 'todos' || salida.cliente === filtroCliente;

      const matchFecha =
        (!fechaInicio || salida.fecha >= fechaInicio) && (!fechaFin || salida.fecha <= fechaFin);

      return matchBusqueda && matchCliente && matchFecha;
    });
  }, [busqueda, filtroCliente, fechaInicio, fechaFin]);

  // 🔄 Mostrar loading mientras carga datos
  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-16 h-16 text-zinc-800 animate-spin" />
          <div className="text-white text-xl font-semibold">Cargando datos del almacén...</div>
          <div className="text-gray-400 text-sm">Conectando con Firestore</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      {/* Particles Background - 30 particles */}
      <CreativeParticles count={30} colors={[COLORS.particles.from, COLORS.particles.to]} />

      {/* Scroll Progress */}
      <ScrollProgress color={COLORS.primary[0]} />

      <div className="relative z-10 p-6">
        {/* Header Principal */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="mb-8"
        >
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
            className="flex items-center gap-4 mb-2"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className="p-3 rounded-xl bg-gradient-to-br from-zinc-800/20 to-zinc-700/10 border border-zinc-800/30"
            >
              <Package className="w-8 h-8 text-zinc-800" />
            </motion.div>
            <div>
              <motion.h1
                whileHover={{ scale: 1.02, textShadow: '0 0 20px rgba(168, 85, 247, 0.6)' }}
                className="text-4xl font-bold text-white"
              >
                Panel de Almacén
              </motion.h1>
              <p className="text-gray-400">Gestión integral de inventario Monte</p>
            </div>
          </motion.div>
        </motion.div>

        {/* KPIs Principales - Resumen Ejecutivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              titulo: 'Total Ingresos',
              valor: estadisticas.totalIngresos,
              subtexto: `${estadisticas.cantidadOrdenes} órdenes`,
              icon: TrendingUp,
              color: 'from-green-500 to-emerald-500',
              bg: 'from-green-500/20 to-emerald-500/10',
            },
            {
              titulo: 'Total Salidas',
              valor: estadisticas.totalSalidas,
              subtexto: `${estadisticas.cantidadSalidas} movimientos`,
              icon: TrendingDown,
              color: 'from-orange-500 to-zinc-800',
              bg: 'from-orange-500/20 to-zinc-800/10',
            },
            {
              titulo: 'Balance Neto',
              valor: estadisticas.balanceNeto,
              subtexto: `${estadisticas.porcentajeRotacion.toFixed(1)}% rotación`,
              icon: Activity,
              color:
                estadisticas.balanceNeto >= 0
                  ? 'from-zinc-800 to-zinc-800'
                  : 'from-zinc-700 to-zinc-700',
              bg:
                estadisticas.balanceNeto >= 0
                  ? 'from-zinc-800/20 to-zinc-800/10'
                  : 'from-zinc-700/20 to-zinc-700/10',
            },
            {
              titulo: 'RF Actual',
              valor: estadisticas.rfActual,
              subtexto: 'Corte actual',
              icon: Package,
              color: 'from-zinc-800 to-zinc-700',
              bg: 'from-zinc-800/20 to-zinc-700/10',
            },
          ].map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  delay: 0.2 + index * 0.05,
                }}
                whileHover={{
                  y: -4,
                  scale: 1.05,
                  boxShadow:
                    estadisticas.balanceNeto >= 0 && index === 2
                      ? '0 0 30px rgba(59, 130, 246, 0.5)'
                      : index === 0
                        ? '0 0 30px rgba(34, 197, 94, 0.5)'
                        : index === 1
                          ? '0 0 30px rgba(249, 115, 22, 0.5)'
                          : '0 0 30px rgba(168, 85, 247, 0.5)',
                }}
                className={`relative p-6 rounded-2xl bg-gradient-to-br ${kpi.bg} border border-white/10 hover:border-white/20 transition-all cursor-pointer overflow-hidden`}
              >
                {/* Ripple overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                />

                <div className="relative z-10 flex items-start justify-between mb-4">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    className={`p-3 rounded-xl bg-gradient-to-br ${kpi.bg}`}
                  >
                    <Icon
                      className={`w-6 h-6 bg-gradient-to-r ${kpi.color} bg-clip-text text-transparent`}
                      style={{ WebkitTextFillColor: 'transparent' }}
                    />
                  </motion.div>
                  <div className="text-xs text-gray-400">{kpi.subtexto}</div>
                </div>

                <motion.div
                  whileHover={{
                    scale: 1.05,
                    textShadow:
                      index === 0
                        ? '0 0 15px rgba(34, 197, 94, 0.8)'
                        : index === 1
                          ? '0 0 15px rgba(249, 115, 22, 0.8)'
                          : index === 2
                            ? '0 0 15px rgba(59, 130, 246, 0.8)'
                            : '0 0 15px rgba(168, 85, 247, 0.8)',
                  }}
                  className="relative z-10 text-4xl font-bold text-white mb-2"
                >
                  {kpi.valor.toLocaleString()}
                </motion.div>

                <div className="relative z-10 text-sm text-gray-400">{kpi.titulo}</div>
              </motion.div>
            );
          })}
        </div>

        {/* GRÁFICOS PREMIUM - ANÁLISIS DE ALMACÉN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico 1: Tendencia de Ingresos vs Salidas (últimos 10) */}
          <GraficoArea
            datos={(() => {
              const ingresos = ORDENES_COMPRA_ALMACEN.slice(-10).map((o) => ({
                fecha: new Date(o.fecha).toLocaleDateString('es-MX', {
                  day: '2-digit',
                  month: 'short',
                }),
                ingresos: o.cantidad,
              }));
              const salidas = SALIDAS_ALMACEN.slice(-10).map((s) => ({
                fecha: new Date(s.fecha).toLocaleDateString('es-MX', {
                  day: '2-digit',
                  month: 'short',
                }),
                salidas: s.cantidad,
              }));
              // Combinar por fecha
              const combined = {};
              ingresos.forEach((i) => {
                combined[i.fecha] = { fecha: i.fecha, ingresos: i.ingresos, salidas: 0 };
              });
              salidas.forEach((s) => {
                if (combined[s.fecha]) {
                  combined[s.fecha].salidas = s.salidas;
                } else {
                  combined[s.fecha] = { fecha: s.fecha, ingresos: 0, salidas: s.salidas };
                }
              });
              return Object.values(combined);
            })()}
            dataKeys={[
              { key: 'ingresos', nombre: 'Ingresos', color: '#10b981' },
              { key: 'salidas', nombre: 'Salidas', color: '#f59e0b' },
            ]}
            xAxisKey="fecha"
            titulo="Tendencia Ingresos vs Salidas"
            altura={300}
            formatValue={(val) => `${val} unidades`}
          />

          {/* Gráfico 2: Distribución por Distribuidor (Top 5) */}
          <GraficoBarras
            datos={(() => {
              const porDistribuidor = ORDENES_COMPRA_ALMACEN.reduce((acc, o) => {
                acc[o.distribuidor] = (acc[o.distribuidor] || 0) + o.cantidad;
                return acc;
              }, {});
              return Object.entries(porDistribuidor)
                .map(([nombre, valor]) => ({ nombre, valor }))
                .sort((a, b) => b.valor - a.valor)
                .slice(0, 5);
            })()}
            dataKeys={[{ key: 'valor', nombre: 'Cantidad', color: '#8b5cf6' }]}
            xAxisKey="nombre"
            titulo="Top 5 Distribuidores por Volumen"
            altura={300}
            formatValue={(val) => `${val} unidades`}
          />

          {/* Gráfico 3: Salidas por Cliente (Top 5) */}
          <GraficoBarras
            datos={(() => {
              const porCliente = SALIDAS_ALMACEN.reduce((acc, s) => {
                acc[s.cliente] = (acc[s.cliente] || 0) + s.cantidad;
                return acc;
              }, {});
              return Object.entries(porCliente)
                .map(([nombre, valor]) => ({ nombre, valor }))
                .sort((a, b) => b.valor - a.valor)
                .slice(0, 5);
            })()}
            dataKeys={[{ key: 'valor', nombre: 'Cantidad', color: '#ef4444' }]}
            xAxisKey="nombre"
            titulo="Top 5 Clientes por Volumen de Salidas"
            altura={300}
            formatValue={(val) => `${val} unidades`}
          />

          {/* Gráfico 4: Balance Acumulado */}
          <GraficoLinea
            datos={(() => {
              let acumulado = 0;
              const fechas = [
                ...new Set([
                  ...ORDENES_COMPRA_ALMACEN.map((o) => o.fecha),
                  ...SALIDAS_ALMACEN.map((s) => s.fecha),
                ]),
              ].sort();

              return fechas.slice(-15).map((fecha) => {
                const ingresosDia = ORDENES_COMPRA_ALMACEN.filter((o) => o.fecha === fecha).reduce(
                  (sum, o) => sum + o.cantidad,
                  0
                );
                const salidasDia = SALIDAS_ALMACEN.filter((s) => s.fecha === fecha).reduce(
                  (sum, s) => sum + s.cantidad,
                  0
                );
                acumulado += ingresosDia - salidasDia;
                return {
                  fecha: new Date(fecha).toLocaleDateString('es-MX', {
                    day: '2-digit',
                    month: 'short',
                  }),
                  balance: acumulado,
                };
              });
            })()}
            dataKey="balance"
            xAxisKey="fecha"
            titulo="Balance Acumulado (Últimos 15 días)"
            color="#3b82f6"
            altura={300}
            formatValue={(val) => `${val} unidades`}
          />
        </div>

        {/* Alertas de Inventario */}
        {estadisticas.balanceNeto < 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-zinc-700/20 to-orange-500/10 border border-zinc-500/30"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-zinc-9000/20">
                <Package className="w-6 h-6 text-zinc-200" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">⚠️ Alerta de Inventario Bajo</h3>
                <p className="text-gray-300">
                  Balance neto:{' '}
                  <span className="font-bold text-zinc-200">{estadisticas.balanceNeto}</span>{' '}
                  unidades
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Se recomienda realizar una orden de compra para mantener niveles óptimos de
                  inventario
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Barra de Herramientas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25, delay: 0.5 }}
          className="mb-6 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <motion.div
                animate={
                  busqueda === ''
                    ? {
                        rotate: [0, -10, 10, -10, 10, 0],
                        scale: [1, 1.1, 1.1, 1.1, 1.1, 1],
                      }
                    : {}
                }
                transition={{
                  duration: 0.5,
                  repeat: busqueda === '' ? Infinity : 0,
                  repeatDelay: 3,
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2"
              >
                <Search className="w-5 h-5 text-gray-400" />
              </motion.div>
              <input
                type="text"
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-zinc-800/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Filtro de Distribuidor */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative"
            >
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <motion.select
                whileHover={{ scale: 1.02, y: -2 }}
                value={filtroDistribuidor}
                onChange={(e) => setFiltroDistribuidor(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-zinc-800/50 focus:outline-none appearance-none cursor-pointer transition-colors"
              >
                <option value="todos">Todos los distribuidores</option>
                {distribuidores.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </motion.select>
            </motion.div>

            {/* Filtro de Cliente */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="relative"
            >
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <motion.select
                whileHover={{ scale: 1.02, y: -2 }}
                value={filtroCliente}
                onChange={(e) => setFiltroCliente(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-zinc-800/50 focus:outline-none appearance-none cursor-pointer transition-colors"
              >
                <option value="todos">Todos los clientes</option>
                {clientes.map((cliente) => (
                  <option key={cliente} value={cliente}>
                    {cliente}
                  </option>
                ))}
              </motion.select>
            </motion.div>

            {/* Toggle Vista */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setModoVista('grid')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                  modoVista === 'grid'
                    ? 'bg-zinc-800/20 border-zinc-800/50 text-zinc-800'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                <Grid className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setModoVista('list')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                  modoVista === 'list'
                    ? 'bg-zinc-800/20 border-zinc-800/50 text-zinc-800'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                <List className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Tabs de Navegación */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'resumen', label: 'Resumen', icon: BarChart3 },
            { id: 'ingresos', label: 'Ingresos', icon: TrendingUp, count: ordenesFiltradas.length },
            { id: 'salidas', label: 'Salidas', icon: TrendingDown, count: salidasFiltradas.length },
            { id: 'cortes', label: 'Cortes RF', icon: Activity, count: RF_ACTUAL_CORTES.length },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setVistaActual(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  vistaActual === tab.id
                    ? 'bg-gradient-to-r from-zinc-800/20 to-zinc-700/10 border border-zinc-800/50 text-white'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs">{tab.count}</span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Contenido según vista */}
        <AnimatePresence mode="wait">
          {vistaActual === 'ingresos' && (
            <motion.div
              key="ingresos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={
                modoVista === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {ordenesFiltradas.map((orden, index) => (
                <motion.div
                  key={orden.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <OrdenWidget orden={orden} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {vistaActual === 'salidas' && (
            <motion.div
              key="salidas"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={
                modoVista === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {salidasFiltradas.map((salida, index) => (
                <motion.div
                  key={salida.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <SalidaWidget salida={salida} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default memo(PanelAlmacen);
