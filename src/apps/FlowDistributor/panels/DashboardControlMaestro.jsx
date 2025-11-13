/**
 * 🎯 DASHBOARD CONTROL MAESTRO
 * Panel unificado que combina venta_local + gya (gastos y abonos)
 */
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { MetricCard } from '../components/CountingAnimations';
import { useTacticalSounds } from '../hooks/useTacticalSounds';

const DashboardControlMaestro = ({ isActive = false }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [ventasData, setVentasData] = useState([]);
  const [gastosData, setGastosData] = useState([]);
  const [abonosData, setAbonosData] = useState([]);
  const [metricsData, setMetricsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { playUISound, playTacticalSound } = useTacticalSounds();

  // Cargar datos reales del Excel
  useEffect(() => {
    const loadExcelData = async () => {
      if (!isActive) return;

      setIsLoading(true);
      playTacticalSound('dataLoad');

      try {
        const response = await fetch('/excel_data.json');
        if (!response.ok) throw new Error('No se pudo cargar excel_data.json');

        const excelData = await response.json();

        // Procesar datos de ventas locales
        const ventasLocales =
          excelData.ventas?.filter((v) => v.tipo === 'venta' || v.tipo === 'venta_local') || [];
        setVentasData(ventasLocales);

        // Procesar gastos y abonos del sistema bancario
        const todosGastos = [];
        const todosAbonos = [];

        if (excelData.bancos) {
          Object.values(excelData.bancos).forEach((banco) => {
            if (banco.gastos) todosGastos.push(...banco.gastos);
            if (banco.abonos) todosAbonos.push(...banco.abonos);
            if (banco.ingresos) todosAbonos.push(...banco.ingresos);
          });
        }

        setGastosData(todosGastos);
        setAbonosData(todosAbonos);

        // Calcular métricas reales
        const totalVentas = ventasLocales.reduce(
          (sum, venta) => sum + (venta.totalVenta || venta.total || 0),
          0
        );
        const totalGastos = todosGastos.reduce((sum, gasto) => sum + Math.abs(gasto.monto || 0), 0);
        const totalAbonos = todosAbonos.reduce((sum, abono) => sum + (abono.monto || 0), 0);

        setMetricsData({
          totalVentas,
          totalGastos,
          totalAbonos,
          utilidadNeta: totalVentas - totalGastos,
          margenPorcentaje: totalVentas > 0 ? ((totalVentas - totalGastos) / totalVentas) * 100 : 0,
        });

        playTacticalSound('success');
      } catch (error) {
        console.error('Error cargando datos Excel:', error);
        playTacticalSound('error');
      } finally {
        setIsLoading(false);
      }
    };

    loadExcelData();
  }, [isActive, playTacticalSound]);

  // Mock data reducido para respaldo
  const mockVentasData = [
    {
      id: 1,
      fecha: '2024-01-15',
      cliente: 'Cliente Premium A',
      producto: 'Producto Elite',
      cantidad: 150,
      precio: 850.0,
      total: 127500.0,
      estado: 'COMPLETADO',
    },
    {
      id: 2,
      fecha: '2024-01-14',
      cliente: 'Distribuidor Norte',
      producto: 'Pack Premium',
      cantidad: 75,
      precio: 1200.0,
      total: 90000.0,
      estado: 'PENDIENTE',
    },
    {
      id: 3,
      fecha: '2024-01-13',
      cliente: 'Cliente Corporativo B',
      producto: 'Solución Enterprise',
      cantidad: 200,
      precio: 2500.0,
      total: 500000.0,
      estado: 'COMPLETADO',
    },
    {
      id: 4,
      fecha: '2024-01-12',
      cliente: 'Retail Chain C',
      producto: 'Pack Básico',
      cantidad: 300,
      precio: 450.0,
      total: 135000.0,
      estado: 'EN_PROCESO',
    },
  ];

  // Simular datos de Excel gya (gastos y abonos)
  const mockGastosData = [
    {
      id: 1,
      fecha: '2024-01-15',
      concepto: 'Logística y Transporte',
      categoria: 'OPERATIVO',
      monto: -15000.0,
      proveedor: 'LogiTrans SA',
      estado: 'PAGADO',
    },
    {
      id: 2,
      fecha: '2024-01-14',
      concepto: 'Marketing Digital',
      categoria: 'COMERCIAL',
      monto: -8500.0,
      proveedor: 'DigitalPro',
      estado: 'PENDIENTE',
    },
    {
      id: 3,
      fecha: '2024-01-13',
      concepto: 'Mantenimiento Sistemas',
      categoria: 'TECNOLOGÍA',
      monto: -12000.0,
      proveedor: 'TechSupport',
      estado: 'PAGADO',
    },
  ];

  const mockAbonosData = [
    {
      id: 1,
      fecha: '2024-01-15',
      concepto: 'Pago Cliente Premium A',
      monto: 127500.0,
      metodo: 'TRANSFERENCIA',
      referencia: 'TRF-2024-0115',
      estado: 'CONFIRMADO',
    },
    {
      id: 2,
      fecha: '2024-01-14',
      concepto: 'Abono Distribuidor Norte',
      monto: 45000.0,
      metodo: 'CHEQUE',
      referencia: 'CHQ-789456',
      estado: 'PENDIENTE',
    },
    {
      id: 3,
      fecha: '2024-01-13',
      concepto: 'Pago Corporativo B',
      monto: 500000.0,
      metodo: 'WIRE',
      referencia: 'WIRE-2024-001',
      estado: 'CONFIRMADO',
    },
  ];

  // Cargar datos al activar
  useEffect(() => {
    if (isActive) {
      setVentasData(mockVentasData);
      setGastosData(mockGastosData);
      setAbonosData(mockAbonosData);

      // Calcular métricas
      const totalVentas = mockVentasData.reduce((sum, venta) => sum + venta.total, 0);
      const totalGastos = mockGastosData.reduce((sum, gasto) => sum + Math.abs(gasto.monto), 0);
      const totalAbonos = mockAbonosData.reduce((sum, abono) => sum + abono.monto, 0);
      const ganaciaEsperada = totalVentas - totalGastos;
      const flujoEfectivo = totalAbonos - totalGastos;

      setMetricsData({
        totalVentas,
        totalGastos,
        totalAbonos,
        ganaciaEsperada,
        flujoEfectivo,
        ventasPendientes: mockVentasData.filter((v) => v.estado === 'PENDIENTE').length,
        pagosPendientes: mockAbonosData.filter((a) => a.estado === 'PENDIENTE').length,
      });

      playTacticalSound('dataLoad');
    }
  }, [isActive, playTacticalSound]);

  // Cambiar pestaña
  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      playUISound('switch');
    }
  };

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  // Obtener color de estado
  const getStatusColor = (estado) => {
    switch (estado?.toUpperCase()) {
      case 'COMPLETADO':
      case 'CONFIRMADO':
      case 'PAGADO':
        return 'text-green-400 bg-green-400/20';
      case 'PENDIENTE':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'EN_PROCESO':
        return 'text-blue-400 bg-blue-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  // Pestañas disponibles
  const tabs = [
    { id: 'overview', name: 'RESUMEN GENERAL', icon: '📊' },
    { id: 'ventas', name: 'VENTAS LOCALES', icon: '💰' },
    { id: 'gastos', name: 'GASTOS', icon: '📉' },
    { id: 'abonos', name: 'ABONOS', icon: '💳' },
  ];

  if (!isActive) return null;

  return (
    <motion.div
      className="p-6 h-full bg-black/90 text-white overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header del Panel */}
      <motion.div
        className="mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-orange-400 mb-2">⚡ CONTROL MAESTRO</h1>
        <p className="text-gray-400">Dashboard Unificado • Ventas Locales + Gastos y Abonos</p>
      </motion.div>

      {/* Pestañas de Navegación */}
      <div className="flex space-x-1 mb-6 bg-black/50 p-1 rounded-lg">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`flex-1 p-3 rounded text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            onClick={() => handleTabChange(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.name}
          </motion.button>
        ))}
      </div>

      {/* Contenido de Pestañas */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Métricas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCard
                title="VENTAS TOTALES"
                value={metricsData.totalVentas}
                previousValue={metricsData.totalVentas * 0.88}
                prefix="$"
                decimals={2}
                icon="💰"
                color="green"
                showGrowth={true}
              />

              <MetricCard
                title="GASTOS TOTALES"
                value={metricsData.totalGastos}
                previousValue={metricsData.totalGastos * 1.05}
                prefix="$"
                decimals={2}
                icon="💸"
                color="red"
                showGrowth={true}
              />

              <MetricCard
                title="ABONOS RECIBIDOS"
                value={metricsData.totalAbonos}
                previousValue={metricsData.totalAbonos * 0.92}
                prefix="$"
                decimals={2}
                icon="💳"
                color="blue"
                showGrowth={true}
              />

              <motion.div
                className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 p-4 rounded-lg border border-orange-500/30"
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(251, 146, 60, 0.3)' }}
              >
                <h3 className="text-orange-400 font-semibold mb-2">🎯 GANANCIA ESPERADA</h3>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(metricsData.ganaciaEsperada)}
                </p>
                <p className="text-sm text-orange-300 mt-1">
                  Margen:{' '}
                  {((metricsData.ganaciaEsperada / metricsData.totalVentas) * 100).toFixed(1)}%
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 p-4 rounded-lg border border-purple-500/30"
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(147, 51, 234, 0.3)' }}
              >
                <h3 className="text-purple-400 font-semibold mb-2">💧 FLUJO DE EFECTIVO</h3>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(metricsData.flujoEfectivo)}
                </p>
                <p className="text-sm text-purple-300 mt-1">Liquidez actual</p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 p-4 rounded-lg border border-yellow-500/30"
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)' }}
              >
                <h3 className="text-yellow-400 font-semibold mb-2">⚠️ PENDIENTES</h3>
                <p className="text-2xl font-bold text-white">
                  {metricsData.ventasPendientes + metricsData.pagosPendientes}
                </p>
                <p className="text-sm text-yellow-300 mt-1">
                  {metricsData.ventasPendientes} ventas, {metricsData.pagosPendientes} pagos
                </p>
              </motion.div>
            </div>

            {/* Resumen de Actividad Reciente */}
            <motion.div
              className="bg-black/50 p-4 rounded-lg border border-orange-500/30"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-orange-400 font-semibold mb-4">🔄 ACTIVIDAD RECIENTE</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {[...ventasData.slice(0, 2), ...abonosData.slice(0, 2)].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-white/5 rounded"
                  >
                    <div>
                      <p className="text-white font-medium">
                        {'cliente' in item ? `Venta: ${item.cliente}` : `Abono: ${item.concepto}`}
                      </p>
                      <p className="text-gray-400 text-sm">{item.fecha}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">
                        {formatCurrency('total' in item ? item.total : item.monto)}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(item.estado)}`}>
                        {item.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'ventas' && (
          <motion.div
            key="ventas"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="bg-black/50 rounded-lg border border-green-500/30 overflow-hidden">
              <div className="bg-green-900/30 p-4 border-b border-green-500/30">
                <h3 className="text-green-400 font-semibold">💰 REGISTRO DE VENTAS LOCALES</h3>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full">
                  <thead className="bg-black/70">
                    <tr>
                      <th className="p-3 text-left text-green-400">Fecha</th>
                      <th className="p-3 text-left text-green-400">Cliente</th>
                      <th className="p-3 text-left text-green-400">Producto</th>
                      <th className="p-3 text-right text-green-400">Cantidad</th>
                      <th className="p-3 text-right text-green-400">Precio</th>
                      <th className="p-3 text-right text-green-400">Total</th>
                      <th className="p-3 text-center text-green-400">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventasData.map((venta) => (
                      <motion.tr
                        key={venta.id}
                        className="border-b border-white/10 hover:bg-white/5"
                        whileHover={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
                      >
                        <td className="p-3 text-gray-300">{venta.fecha}</td>
                        <td className="p-3 text-white font-medium">{venta.cliente}</td>
                        <td className="p-3 text-gray-300">{venta.producto}</td>
                        <td className="p-3 text-right text-white">{venta.cantidad}</td>
                        <td className="p-3 text-right text-white">
                          {formatCurrency(venta.precio)}
                        </td>
                        <td className="p-3 text-right text-green-400 font-semibold">
                          {formatCurrency(venta.total)}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`text-xs px-2 py-1 rounded ${getStatusColor(venta.estado)}`}
                          >
                            {venta.estado}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'gastos' && (
          <motion.div
            key="gastos"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="bg-black/50 rounded-lg border border-red-500/30 overflow-hidden">
              <div className="bg-red-900/30 p-4 border-b border-red-500/30">
                <h3 className="text-red-400 font-semibold">📉 REGISTRO DE GASTOS</h3>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full">
                  <thead className="bg-black/70">
                    <tr>
                      <th className="p-3 text-left text-red-400">Fecha</th>
                      <th className="p-3 text-left text-red-400">Concepto</th>
                      <th className="p-3 text-left text-red-400">Categoría</th>
                      <th className="p-3 text-left text-red-400">Proveedor</th>
                      <th className="p-3 text-right text-red-400">Monto</th>
                      <th className="p-3 text-center text-red-400">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gastosData.map((gasto) => (
                      <motion.tr
                        key={gasto.id}
                        className="border-b border-white/10 hover:bg-white/5"
                        whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                      >
                        <td className="p-3 text-gray-300">{gasto.fecha}</td>
                        <td className="p-3 text-white font-medium">{gasto.concepto}</td>
                        <td className="p-3 text-gray-300">{gasto.categoria}</td>
                        <td className="p-3 text-gray-300">{gasto.proveedor}</td>
                        <td className="p-3 text-right text-red-400 font-semibold">
                          {formatCurrency(Math.abs(gasto.monto))}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`text-xs px-2 py-1 rounded ${getStatusColor(gasto.estado)}`}
                          >
                            {gasto.estado}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'abonos' && (
          <motion.div
            key="abonos"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="bg-black/50 rounded-lg border border-blue-500/30 overflow-hidden">
              <div className="bg-blue-900/30 p-4 border-b border-blue-500/30">
                <h3 className="text-blue-400 font-semibold">💳 REGISTRO DE ABONOS</h3>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full">
                  <thead className="bg-black/70">
                    <tr>
                      <th className="p-3 text-left text-blue-400">Fecha</th>
                      <th className="p-3 text-left text-blue-400">Concepto</th>
                      <th className="p-3 text-left text-blue-400">Método</th>
                      <th className="p-3 text-left text-blue-400">Referencia</th>
                      <th className="p-3 text-right text-blue-400">Monto</th>
                      <th className="p-3 text-center text-blue-400">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {abonosData.map((abono) => (
                      <motion.tr
                        key={abono.id}
                        className="border-b border-white/10 hover:bg-white/5"
                        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                      >
                        <td className="p-3 text-gray-300">{abono.fecha}</td>
                        <td className="p-3 text-white font-medium">{abono.concepto}</td>
                        <td className="p-3 text-gray-300">{abono.metodo}</td>
                        <td className="p-3 text-gray-300 font-mono text-sm">{abono.referencia}</td>
                        <td className="p-3 text-right text-blue-400 font-semibold">
                          {formatCurrency(abono.monto)}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`text-xs px-2 py-1 rounded ${getStatusColor(abono.estado)}`}
                          >
                            {abono.estado}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DashboardControlMaestro;
