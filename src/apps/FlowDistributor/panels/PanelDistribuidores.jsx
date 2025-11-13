/**
 * 🚛 PANEL DISTRIBUIDORES
 * Panel de distribuidores y órdenes de compra
 */
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { useTacticalSounds } from '../hooks/useTacticalSounds';

const PanelDistribuidores = ({ isActive = false }) => {
  const [activeView, setActiveView] = useState('distribuidores');
  const [distribuidoresData, setDistribuidoresData] = useState([]);
  const [ordenesData, setOrdenesData] = useState([]);
  const [selectedDistribuidor, setSelectedDistribuidor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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

        // Procesar distribuidores reales
        const distribuidores = excelData.distribuidores || [];

        // Enriquecer datos de distribuidores con información calculada
        const distribuidoresEnriquecidos = distribuidores.map((dist, index) => ({
          id: dist.id || index + 1,
          nombre: dist.nombre || dist.distribuidor || `Distribuidor ${index + 1}`,
          region: dist.region || dist.zona || 'NO ESPECIFICADA',
          contacto: dist.contacto || dist.responsable || 'Sin contacto',
          telefono: dist.telefono || '+52 000 000-0000',
          email: dist.email || `contacto${index + 1}@distribuidor.com`,
          direccion: dist.direccion || 'Dirección no especificada',
          estatus: dist.estatus || 'ACTIVO',
          credito: dist.credito || dist.limite_credito || 500000,
          creditoDisponible: dist.credito_disponible || (dist.credito || 500000) * 0.7,
          ventasUltimo12M: dist.ventas_anuales || 0,
          calificacion: dist.calificacion || 'B+',
          fechaRegistro: dist.fecha_registro || '2023-01-01',
          ultimaCompra: dist.ultima_compra || new Date().toISOString().split('T')[0],
        }));

        setDistribuidoresData(distribuidoresEnriquecidos);

        // Procesar órdenes de compra relacionadas
        const ordenes = excelData.ordenesCompra || excelData.ordenes || [];
        const ordenesEnriquecidas = ordenes.map((orden, index) => ({
          id: orden.id || `ORD-${index + 1}`,
          numeroOrden:
            orden.numeroOrden || orden.numero || `OC-${String(index + 1).padStart(4, '0')}`,
          distribuidorId:
            orden.distribuidorId ||
            orden.distribuidor_id ||
            (index % distribuidoresEnriquecidos.length) + 1,
          distribuidorNombre:
            orden.distribuidorNombre ||
            orden.distribuidor ||
            distribuidoresEnriquecidos[index % distribuidoresEnriquecidos.length]?.nombre,
          fecha: orden.fecha || new Date().toISOString().split('T')[0],
          productos: orden.productos || [
            {
              nombre: orden.producto || 'Producto',
              cantidad: orden.cantidad || 1,
              precio: orden.precio || 0,
            },
          ],
          total: orden.total || orden.monto || (orden.cantidad || 1) * (orden.precio || 0),
          estado: orden.estado || orden.estatus || 'PENDIENTE',
          fechaEntrega: orden.fechaEntrega || orden.fecha_entrega,
          observaciones: orden.observaciones || '',
        }));

        setOrdenesData(ordenesEnriquecidas);

        playTacticalSound('success');
      } catch (error) {
        console.error('Error cargando datos Excel:', error);
        playTacticalSound('error');

        // Fallback a datos mock si falla la carga
        setDistribuidoresData(mockDistribuidores.slice(0, 3));
        setOrdenesData(mockOrdenes.slice(0, 5));
      } finally {
        setIsLoading(false);
      }
    };

    loadExcelData();
  }, [isActive, playTacticalSound]);

  // Mock data para respaldo
  const mockDistribuidores = [
    {
      id: 1,
      nombre: 'Distribuidor Norte SA',
      region: 'NORTE',
      contacto: 'Juan García',
      telefono: '+52 81 1234-5678',
      email: 'juan.garcia@distnorte.com',
      direccion: 'Av. Industrial 123, Monterrey, NL',
      estatus: 'ACTIVO',
      credito: 500000.0,
      creditoDisponible: 350000.0,
      ventasUltimo12M: 2400000.0,
      calificacion: 'A+',
      fechaRegistro: '2023-01-15',
      ultimaCompra: '2024-01-12',
    },
    {
      id: 2,
      nombre: 'Centro Distribución Bajío',
      region: 'CENTRO',
      contacto: 'María López',
      telefono: '+52 442 987-6543',
      email: 'maria.lopez@bajio.mx',
      direccion: 'Parque Industrial 456, Querétaro, QRO',
      estatus: 'ACTIVO',
      credito: 750000.0,
      creditoDisponible: 120000.0,
      ventasUltimo12M: 3200000.0,
      calificacion: 'A',
      fechaRegistro: '2022-08-20',
      ultimaCompra: '2024-01-14',
    },
    {
      id: 3,
      nombre: 'Sureste Logistics',
      region: 'SURESTE',
      contacto: 'Carlos Méndez',
      telefono: '+52 999 555-1234',
      email: 'carlos.mendez@sureste.com',
      direccion: 'Zona Industrial 789, Mérida, YUC',
      estatus: 'SUSPENDIDO',
      credito: 300000.0,
      creditoDisponible: 0.0,
      ventasUltimo12M: 980000.0,
      calificacion: 'C',
      fechaRegistro: '2023-05-10',
      ultimaCompra: '2023-12-15',
    },
    {
      id: 4,
      nombre: 'Pacífico Distribution Hub',
      region: 'PACIFICO',
      contacto: 'Ana Rodríguez',
      telefono: '+52 33 777-8888',
      email: 'ana.rodriguez@pacifico.mx',
      direccion: 'Complejo Logístico 321, Guadalajara, JAL',
      estatus: 'ACTIVO',
      credito: 1000000.0,
      creditoDisponible: 850000.0,
      ventasUltimo12M: 4500000.0,
      calificacion: 'A+',
      fechaRegistro: '2021-11-30',
      ultimaCompra: '2024-01-15',
    },
  ];

  // Mock data para órdenes
  const mockOrdenes = [
    {
      id: 'ORD-2024-001',
      distribuidorId: 1,
      distribuidor: 'Distribuidor Norte SA',
      fecha: '2024-01-15',
      fechaEntrega: '2024-01-20',
      productos: [
        {
          codigo: 'PROD-001',
          nombre: 'Producto Elite',
          cantidad: 100,
          precio: 850.0,
          total: 85000.0,
        },
        {
          codigo: 'PROD-002',
          nombre: 'Pack Premium',
          cantidad: 50,
          precio: 1200.0,
          total: 60000.0,
        },
      ],
      subtotal: 145000.0,
      descuento: 7250.0,
      impuestos: 22040.0,
      total: 159790.0,
      estatus: 'PROCESANDO',
      prioridad: 'ALTA',
      metodoPago: 'CREDITO',
      vendedor: 'Luis Martínez',
    },
    {
      id: 'ORD-2024-002',
      distribuidorId: 2,
      distribuidor: 'Centro Distribución Bajío',
      fecha: '2024-01-14',
      fechaEntrega: '2024-01-18',
      productos: [
        {
          codigo: 'PROD-003',
          nombre: 'Solución Enterprise',
          cantidad: 25,
          precio: 2500.0,
          total: 62500.0,
        },
      ],
      subtotal: 62500.0,
      descuento: 3125.0,
      impuestos: 9500.0,
      total: 68875.0,
      estatus: 'ENVIADO',
      prioridad: 'MEDIA',
      metodoPago: 'CONTADO',
      vendedor: 'Carmen Silva',
    },
    {
      id: 'ORD-2024-003',
      distribuidorId: 4,
      distribuidor: 'Pacífico Distribution Hub',
      fecha: '2024-01-13',
      fechaEntrega: '2024-01-19',
      productos: [
        {
          codigo: 'PROD-001',
          nombre: 'Producto Elite',
          cantidad: 200,
          precio: 850.0,
          total: 170000.0,
        },
        { codigo: 'PROD-004', nombre: 'Pack Básico', cantidad: 150, precio: 450.0, total: 67500.0 },
      ],
      subtotal: 237500.0,
      descuento: 11875.0,
      impuestos: 36100.0,
      total: 261725.0,
      estatus: 'ENTREGADO',
      prioridad: 'ALTA',
      metodoPago: 'CREDITO',
      vendedor: 'Roberto Vega',
    },
  ];

  // Cargar datos
  useEffect(() => {
    if (isActive) {
      setDistribuidoresData(mockDistribuidores);
      setOrdenesData(mockOrdenes);
      playTacticalSound('dataLoad');
    }
  }, [isActive, playTacticalSound]);

  // Filtrar datos según búsqueda
  const filteredDistribuidores = distribuidoresData.filter(
    (dist) =>
      dist.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dist.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dist.contacto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrdenes = ordenesData.filter(
    (orden) =>
      orden.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.distribuidor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.estatus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  // Obtener color de estatus
  const getStatusColor = (estatus) => {
    switch (estatus?.toUpperCase()) {
      case 'ACTIVO':
      case 'ENTREGADO':
        return 'text-green-400 bg-green-400/20 border-green-400/50';
      case 'PROCESANDO':
      case 'ENVIADO':
        return 'text-blue-400 bg-blue-400/20 border-blue-400/50';
      case 'SUSPENDIDO':
        return 'text-red-400 bg-red-400/20 border-red-400/50';
      case 'PENDIENTE':
        return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/50';
      default:
        return 'text-gray-400 bg-gray-400/20 border-gray-400/50';
    }
  };

  // Obtener color de prioridad
  const getPriorityColor = (prioridad) => {
    switch (prioridad?.toUpperCase()) {
      case 'ALTA':
        return 'text-red-400 bg-red-400/20';
      case 'MEDIA':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'BAJA':
        return 'text-green-400 bg-green-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  // Obtener color de calificación
  const getRatingColor = (calificacion) => {
    switch (calificacion) {
      case 'A+':
        return 'text-green-400 bg-green-400/20';
      case 'A':
        return 'text-blue-400 bg-blue-400/20';
      case 'B':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'C':
        return 'text-orange-400 bg-orange-400/20';
      case 'D':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  if (!isActive) return null;

  return (
    <motion.div
      className="p-6 h-full bg-black/90 text-white overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-blue-400 mb-2">🚛 DISTRIBUIDORES</h1>
        <p className="text-gray-400">Red de Distribución • Órdenes de Compra • Gestión Logística</p>
      </motion.div>

      {/* Controles de Navegación */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        {/* Pestañas */}
        <div className="flex space-x-1 bg-black/50 p-1 rounded-lg">
          <button
            className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
              activeView === 'distribuidores'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            onClick={() => {
              setActiveView('distribuidores');
              playUISound('switch');
            }}
          >
            📋 DISTRIBUIDORES
          </button>
          <button
            className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
              activeView === 'ordenes'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            onClick={() => {
              setActiveView('ordenes');
              playUISound('switch');
            }}
          >
            📦 ÓRDENES
          </button>
        </div>

        {/* Búsqueda */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar distribuidores u órdenes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-black/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 w-64"
          />
          <div className="absolute right-3 top-2.5 text-gray-400">🔍</div>
        </div>
      </div>

      {/* Contenido */}
      <AnimatePresence mode="wait">
        {activeView === 'distribuidores' && (
          <motion.div
            key="distribuidores"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Grid de Distribuidores */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[calc(100vh-300px)] overflow-y-auto">
              {filteredDistribuidores.map((distribuidor) => (
                <motion.div
                  key={distribuidor.id}
                  className="bg-black/50 border border-blue-500/30 rounded-lg p-4 hover:border-blue-400/50 transition-all cursor-pointer"
                  whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}
                  onClick={() => setSelectedDistribuidor(distribuidor)}
                >
                  {/* Header del Distribuidor */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-blue-400 font-semibold text-lg">{distribuidor.nombre}</h3>
                      <p className="text-gray-400 text-sm">{distribuidor.region}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span
                        className={`text-xs px-2 py-1 rounded border ${getStatusColor(distribuidor.estatus)}`}
                      >
                        {distribuidor.estatus}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${getRatingColor(distribuidor.calificacion)}`}
                      >
                        {distribuidor.calificacion}
                      </span>
                    </div>
                  </div>

                  {/* Información de Contacto */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <p className="text-gray-400">Contacto:</p>
                      <p className="text-white">{distribuidor.contacto}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Teléfono:</p>
                      <p className="text-white">{distribuidor.telefono}</p>
                    </div>
                  </div>

                  {/* Métricas Financieras */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-green-900/20 p-2 rounded">
                      <p className="text-green-400 text-xs">Ventas 12M</p>
                      <p className="text-white font-semibold">
                        {formatCurrency(distribuidor.ventasUltimo12M)}
                      </p>
                    </div>
                    <div className="bg-blue-900/20 p-2 rounded">
                      <p className="text-blue-400 text-xs">Crédito Disp.</p>
                      <p className="text-white font-semibold">
                        {formatCurrency(distribuidor.creditoDisponible)}
                      </p>
                    </div>
                  </div>

                  {/* Barra de Crédito */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Línea de Crédito</span>
                      <span>
                        {((distribuidor.creditoDisponible / distribuidor.credito) * 100).toFixed(0)}
                        % disponible
                      </span>
                    </div>
                    <div className="bg-black/50 h-2 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(distribuidor.creditoDisponible / distribuidor.credito) * 100}%`,
                        }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeView === 'ordenes' && (
          <motion.div
            key="ordenes"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Tabla de Órdenes */}
            <div className="bg-black/50 rounded-lg border border-blue-500/30 overflow-hidden">
              <div className="bg-blue-900/30 p-4 border-b border-blue-500/30">
                <h3 className="text-blue-400 font-semibold">📦 ÓRDENES DE COMPRA</h3>
              </div>
              <div className="overflow-x-auto max-h-[calc(100vh-350px)]">
                <table className="w-full">
                  <thead className="bg-black/70 sticky top-0">
                    <tr>
                      <th className="p-3 text-left text-blue-400">Orden ID</th>
                      <th className="p-3 text-left text-blue-400">Distribuidor</th>
                      <th className="p-3 text-left text-blue-400">Fecha</th>
                      <th className="p-3 text-left text-blue-400">Entrega</th>
                      <th className="p-3 text-right text-blue-400">Total</th>
                      <th className="p-3 text-center text-blue-400">Prioridad</th>
                      <th className="p-3 text-center text-blue-400">Estado</th>
                      <th className="p-3 text-center text-blue-400">Vendedor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrdenes.map((orden) => (
                      <motion.tr
                        key={orden.id}
                        className="border-b border-white/10 hover:bg-white/5"
                        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                      >
                        <td className="p-3 text-blue-400 font-mono font-semibold">{orden.id}</td>
                        <td className="p-3 text-white">{orden.distribuidor}</td>
                        <td className="p-3 text-gray-300">{orden.fecha}</td>
                        <td className="p-3 text-gray-300">{orden.fechaEntrega}</td>
                        <td className="p-3 text-right text-green-400 font-semibold">
                          {formatCurrency(orden.total)}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`text-xs px-2 py-1 rounded ${getPriorityColor(orden.prioridad)}`}
                          >
                            {orden.prioridad}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`text-xs px-2 py-1 rounded border ${getStatusColor(orden.estatus)}`}
                          >
                            {orden.estatus}
                          </span>
                        </td>
                        <td className="p-3 text-center text-gray-300">{orden.vendedor}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Detalle de Distribuidor */}
      <AnimatePresence>
        {selectedDistribuidor && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDistribuidor(null)}
          >
            <motion.div
              className="bg-black/90 border border-blue-500/50 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-blue-400">
                    {selectedDistribuidor.nombre}
                  </h2>
                  <p className="text-gray-400">{selectedDistribuidor.region}</p>
                </div>
                <button
                  onClick={() => setSelectedDistribuidor(null)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Información Detallada */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-blue-400 font-semibold mb-2">📞 INFORMACIÓN DE CONTACTO</h4>
                    <div className="bg-blue-900/20 p-3 rounded space-y-1">
                      <p>
                        <span className="text-gray-400">Contacto:</span>{' '}
                        {selectedDistribuidor.contacto}
                      </p>
                      <p>
                        <span className="text-gray-400">Teléfono:</span>{' '}
                        {selectedDistribuidor.telefono}
                      </p>
                      <p>
                        <span className="text-gray-400">Email:</span> {selectedDistribuidor.email}
                      </p>
                      <p>
                        <span className="text-gray-400">Dirección:</span>{' '}
                        {selectedDistribuidor.direccion}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-blue-400 font-semibold mb-2">📊 MÉTRICAS COMERCIALES</h4>
                    <div className="bg-green-900/20 p-3 rounded space-y-1">
                      <p>
                        <span className="text-gray-400">Ventas 12M:</span>{' '}
                        {formatCurrency(selectedDistribuidor.ventasUltimo12M)}
                      </p>
                      <p>
                        <span className="text-gray-400">Calificación:</span>{' '}
                        <span
                          className={getRatingColor(selectedDistribuidor.calificacion).replace(
                            'bg-',
                            'text-'
                          )}
                        >
                          {selectedDistribuidor.calificacion}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-400">Última Compra:</span>{' '}
                        {selectedDistribuidor.ultimaCompra}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-blue-400 font-semibold mb-2">💳 INFORMACIÓN CREDITICIA</h4>
                    <div className="bg-purple-900/20 p-3 rounded space-y-1">
                      <p>
                        <span className="text-gray-400">Línea de Crédito:</span>{' '}
                        {formatCurrency(selectedDistribuidor.credito)}
                      </p>
                      <p>
                        <span className="text-gray-400">Crédito Disponible:</span>{' '}
                        {formatCurrency(selectedDistribuidor.creditoDisponible)}
                      </p>
                      <p>
                        <span className="text-gray-400">Utilización:</span>{' '}
                        {(
                          ((selectedDistribuidor.credito - selectedDistribuidor.creditoDisponible) /
                            selectedDistribuidor.credito) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-blue-400 font-semibold mb-2">📅 INFORMACIÓN GENERAL</h4>
                    <div className="bg-orange-900/20 p-3 rounded space-y-1">
                      <p>
                        <span className="text-gray-400">Fecha Registro:</span>{' '}
                        {selectedDistribuidor.fechaRegistro}
                      </p>
                      <p>
                        <span className="text-gray-400">Estado:</span>{' '}
                        <span
                          className={getStatusColor(selectedDistribuidor.estatus)
                            .replace('bg-', 'text-')
                            .replace('border-', 'text-')}
                        >
                          {selectedDistribuidor.estatus}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PanelDistribuidores;
