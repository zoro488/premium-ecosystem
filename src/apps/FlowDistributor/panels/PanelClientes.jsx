/**
 * 👥 PANEL CLIENTES
 * Panel de gestión de clientes y interacciones
 */
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { useTacticalSounds } from '../hooks/useTacticalSounds';

const PanelClientes = ({ isActive = false }) => {
  const [activeView, setActiveView] = useState('clientes');
  const [clientesData, setClientesData] = useState([]);
  const [interaccionesData, setInteraccionesData] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSegmento, setFilterSegmento] = useState('TODOS');
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

        // Procesar clientes reales desde ventas
        const ventas = excelData.ventas || [];
        const clientesMap = new Map();

        // Extraer clientes únicos de ventas reales
        ventas.forEach((venta, index) => {
          const clienteNombre = venta.cliente || venta.customer || `Cliente ${index + 1}`;

          if (!clientesMap.has(clienteNombre)) {
            clientesMap.set(clienteNombre, {
              id: clientesMap.size + 1,
              nombre: clienteNombre,
              empresa: venta.empresa || venta.company || `${clienteNombre} Corp`,
              rfc: venta.rfc || `RFC${String(clientesMap.size + 1).padStart(8, '0')}`,
              email:
                venta.email || `${clienteNombre.toLowerCase().replace(/\s+/g, '.')}@cliente.com`,
              telefono: venta.telefono || '+52 55 1234-5678',
              direccion: venta.direccion || 'Dirección no especificada',
              ciudad: venta.ciudad || 'Ciudad de México',
              estado: venta.estado || 'CDMX',
              codigoPostal: venta.cp || '01000',
              segmento: 'INDIVIDUAL',
              fechaRegistro: venta.fecha || new Date().toISOString().split('T')[0],
              estatus: venta.estatus === 'CANCELADO' ? 'INACTIVO' : 'ACTIVO',
              ventasTotales: 0,
              numeroVentas: 0,
              ultimaInteraccion: venta.fecha || new Date().toISOString().split('T')[0],
              calificacion: 'B',
              ventasHistoricas: [],
            });
          }

          // Actualizar métricas del cliente
          const cliente = clientesMap.get(clienteNombre);
          cliente.ventasTotales += venta.totalVenta || 0;
          cliente.numeroVentas += 1;
          cliente.ventasHistoricas.push({
            id: venta.id,
            fecha: venta.fecha,
            total: venta.totalVenta,
            productos: venta.productos,
            estatus: venta.estatus,
          });

          // Actualizar última interacción si es más reciente
          if (venta.fecha && venta.fecha > cliente.ultimaInteraccion) {
            cliente.ultimaInteraccion = venta.fecha;
          }
        });

        // Calcular segmentos y calificaciones basados en datos reales
        const clientesReales = Array.from(clientesMap.values()).map((cliente) => ({
          ...cliente,
          segmento: determinarSegmento(cliente.ventasTotales),
          valorPromedio: cliente.ventasTotales / (cliente.numeroVentas || 1),
          calificacion: calcularCalificacionCliente(cliente),
        }));

        setClientesData(clientesReales);

        // Generar interacciones desde las ventas
        const interacciones = ventas.map((venta, index) => ({
          id: index + 1,
          clienteId: clientesReales.find((c) => c.nombre === venta.cliente)?.id || 1,
          tipo: 'VENTA',
          fecha: venta.fecha,
          descripcion: `Venta realizada - ${venta.productos?.[0]?.nombre || 'Producto'} - ${formatCurrency(venta.totalVenta)}`,
          resultado: venta.estatus === 'CANCELADO' ? 'CANCELADO' : 'EXITOSO',
          responsable: 'Sistema',
          proximoSeguimiento: null,
        }));

        setInteraccionesData(interacciones);

        playTacticalSound('success');
      } catch (error) {
        console.error('Error cargando datos Excel:', error);
        playTacticalSound('error');

        // Fallback a datos mock si falla la carga
        setClientesData(mockClientes.slice(0, 5));
        setInteraccionesData(mockInteracciones.slice(0, 10));
      } finally {
        setIsLoading(false);
      }
    };

    loadExcelData();
  }, [isActive, playTacticalSound]);

  // Funciones de cálculo para clientes
  const determinarSegmento = (ventasTotales) => {
    if (ventasTotales >= 1000000) return 'ENTERPRISE';
    if (ventasTotales >= 500000) return 'CORPORATIVO';
    if (ventasTotales >= 100000) return 'PYME';
    return 'INDIVIDUAL';
  };

  const calcularCalificacionCliente = (cliente) => {
    const ventasTotales = cliente.ventasTotales || 0;
    const numeroVentas = cliente.numeroVentas || 0;

    if (ventasTotales >= 1000000 && numeroVentas >= 10) return 'A+';
    if (ventasTotales >= 500000 && numeroVentas >= 5) return 'A';
    if (ventasTotales >= 100000 && numeroVentas >= 3) return 'B+';
    if (ventasTotales >= 50000 && numeroVentas >= 2) return 'B';
    return 'C';
  };

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  // Mock data para respaldo
  const mockClientes = [
    {
      id: 1,
      nombre: 'TechCorp Solutions',
      contactoPrincipal: 'Roberto Salinas',
      email: 'roberto.salinas@techcorp.com',
      telefono: '+52 55 1234-5678',
      direccion: 'Av. Reforma 456, CDMX',
      segmento: 'ENTERPRISE',
      sector: 'TECNOLOGÍA',
      empleados: 500,
      estatus: 'ACTIVO',
      fechaRegistro: '2022-03-15',
      ultimaInteraccion: '2024-01-15',
      ventasTotales: 3500000.0,
      ventasAnuales: 1200000.0,
      margenPromedio: 25.5,
      potencialCrecimiento: 'ALTO',
      calificacion: 'A+',
      metodoPagoPreferido: 'TRANSFERENCIA',
      diasCredito: 30,
      descuentoAutorizado: 15.0,
    },
    {
      id: 2,
      nombre: 'Manufacturas del Norte SA',
      contactoPrincipal: 'María González',
      email: 'maria.gonzalez@manunorte.mx',
      telefono: '+52 81 987-6543',
      direccion: 'Parque Industrial 123, Monterrey, NL',
      segmento: 'CORPORATIVO',
      sector: 'MANUFACTURA',
      empleados: 250,
      estatus: 'ACTIVO',
      fechaRegistro: '2021-08-20',
      ultimaInteraccion: '2024-01-12',
      ventasTotales: 2800000.0,
      ventasAnuales: 950000.0,
      margenPromedio: 22.0,
      potencialCrecimiento: 'MEDIO',
      calificacion: 'A',
      metodoPagoPreferido: 'CREDITO',
      diasCredito: 45,
      descuentoAutorizado: 12.0,
    },
    {
      id: 3,
      nombre: 'StartUp Innovación',
      contactoPrincipal: 'Carlos Méndez',
      email: 'carlos@startup-inn.com',
      telefono: '+52 33 555-1234',
      direccion: 'Centro de Innovación 789, Guadalajara, JAL',
      segmento: 'PYME',
      sector: 'STARTUPS',
      empleados: 25,
      estatus: 'PROSPECTO',
      fechaRegistro: '2024-01-10',
      ultimaInteraccion: '2024-01-14',
      ventasTotales: 150000.0,
      ventasAnuales: 150000.0,
      margenPromedio: 18.5,
      potencialCrecimiento: 'ALTO',
      calificacion: 'B+',
      metodoPagoPreferido: 'CONTADO',
      diasCredito: 0,
      descuentoAutorizado: 8.0,
    },
    {
      id: 4,
      nombre: 'Retail Excellence Chain',
      contactoPrincipal: 'Ana Rodríguez',
      email: 'ana.rodriguez@retailex.mx',
      telefono: '+52 999 777-8888',
      direccion: 'Plaza Comercial 321, Mérida, YUC',
      segmento: 'RETAIL',
      sector: 'COMERCIO',
      empleados: 150,
      estatus: 'ACTIVO',
      fechaRegistro: '2023-02-28',
      ultimaInteraccion: '2024-01-13',
      ventasTotales: 1900000.0,
      ventasAnuales: 780000.0,
      margenPromedio: 20.0,
      potencialCrecimiento: 'MEDIO',
      calificacion: 'A-',
      metodoPagoPreferido: 'MIXTO',
      diasCredito: 15,
      descuentoAutorizado: 10.0,
    },
    {
      id: 5,
      nombre: 'Servicios Profesionales Elite',
      contactoPrincipal: 'Luis Vega',
      email: 'luis.vega@elite-services.com',
      telefono: '+52 442 333-9999',
      direccion: 'Torre Corporativa 987, Querétaro, QRO',
      segmento: 'CORPORATIVO',
      sector: 'SERVICIOS',
      empleados: 75,
      estatus: 'INACTIVO',
      fechaRegistro: '2023-09-15',
      ultimaInteraccion: '2023-12-20',
      ventasTotales: 850000.0,
      ventasAnuales: 0.0,
      margenPromedio: 28.0,
      potencialCrecimiento: 'BAJO',
      calificacion: 'C',
      metodoPagoPreferido: 'CREDITO',
      diasCredito: 60,
      descuentoAutorizado: 5.0,
    },
  ];

  // Mock data para interacciones
  const mockInteracciones = [
    {
      id: 1,
      clienteId: 1,
      cliente: 'TechCorp Solutions',
      fecha: '2024-01-15',
      tipo: 'VENTA',
      descripcion: 'Cierre de contrato anual por $450,000 MXN',
      responsable: 'Luis Martínez',
      estado: 'COMPLETADA',
      prioridad: 'ALTA',
      seguimiento: '2024-02-15',
    },
    {
      id: 2,
      clienteId: 2,
      cliente: 'Manufacturas del Norte SA',
      fecha: '2024-01-12',
      tipo: 'SOPORTE',
      descripcion: 'Resolución de incidencia técnica en implementación',
      responsable: 'Carmen Silva',
      estado: 'COMPLETADA',
      prioridad: 'MEDIA',
      seguimiento: null,
    },
    {
      id: 3,
      clienteId: 3,
      cliente: 'StartUp Innovación',
      fecha: '2024-01-14',
      tipo: 'PROSPECCIÓN',
      descripcion: 'Primera reunión comercial - Presentación de soluciones',
      responsable: 'Roberto Vega',
      estado: 'PENDIENTE',
      prioridad: 'ALTA',
      seguimiento: '2024-01-20',
    },
    {
      id: 4,
      clienteId: 4,
      cliente: 'Retail Excellence Chain',
      fecha: '2024-01-13',
      tipo: 'MARKETING',
      descripcion: 'Envío de propuesta para nueva campaña Q1 2024',
      responsable: 'Patricia Morales',
      estado: 'EN_PROGRESO',
      prioridad: 'MEDIA',
      seguimiento: '2024-01-18',
    },
    {
      id: 5,
      clienteId: 1,
      cliente: 'TechCorp Solutions',
      fecha: '2024-01-10',
      tipo: 'REUNIÓN',
      descripcion: 'Kick-off meeting para nuevo proyecto de modernización',
      responsable: 'Luis Martínez',
      estado: 'COMPLETADA',
      prioridad: 'ALTA',
      seguimiento: '2024-01-25',
    },
  ];

  // Cargar datos
  // Inicializar datos mock como respaldo (removido - datos reales se cargan arriba)
  const initializeMockData = () => {
    if (clientesData.length === 0) {
      setClientesData(mockClientes);
      setInteraccionesData(mockInteracciones);
    }
  };

  // Filtrar datos
  const filteredClientes = clientesData.filter((cliente) => {
    const matchesSearch =
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.contactoPrincipal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegmento = filterSegmento === 'TODOS' || cliente.segmento === filterSegmento;
    return matchesSearch && matchesSegmento;
  });

  const filteredInteracciones = interaccionesData.filter(
    (interaccion) =>
      interaccion.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interaccion.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interaccion.responsable.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // formatCurrency ya definido arriba

  // Obtener color de estatus
  const getStatusColor = (estatus) => {
    switch (estatus?.toUpperCase()) {
      case 'ACTIVO':
      case 'COMPLETADA':
        return 'text-green-400 bg-green-400/20 border-green-400/50';
      case 'PROSPECTO':
      case 'EN_PROGRESO':
        return 'text-zinc-300 bg-zinc-700/20 border-zinc-600/50';
      case 'INACTIVO':
        return 'text-red-400 bg-red-400/20 border-red-400/50';
      case 'PENDIENTE':
        return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/50';
      default:
        return 'text-gray-400 bg-gray-400/20 border-gray-400/50';
    }
  };

  // Obtener color de segmento
  const getSegmentColor = (segmento) => {
    switch (segmento?.toUpperCase()) {
      case 'ENTERPRISE':
        return 'text-zinc-200 bg-zinc-800/20';
      case 'CORPORATIVO':
        return 'text-zinc-300 bg-zinc-700/20';
      case 'PYME':
        return 'text-green-400 bg-green-400/20';
      case 'RETAIL':
        return 'text-orange-400 bg-orange-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  // Obtener color de potencial
  const getPotentialColor = (potencial) => {
    switch (potencial?.toUpperCase()) {
      case 'ALTO':
        return 'text-green-400 bg-green-400/20';
      case 'MEDIO':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'BAJO':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  // Obtener color de calificación
  const getRatingColor = (calificacion) => {
    if (calificacion?.includes('A')) return 'text-green-400 bg-green-400/20';
    if (calificacion?.includes('B')) return 'text-zinc-300 bg-zinc-700/20';
    if (calificacion?.includes('C')) return 'text-yellow-400 bg-yellow-400/20';
    if (calificacion?.includes('D')) return 'text-red-400 bg-red-400/20';
    return 'text-gray-400 bg-gray-400/20';
  };

  // Obtener color de tipo de interacción
  const getInteractionTypeColor = (tipo) => {
    switch (tipo?.toUpperCase()) {
      case 'VENTA':
        return 'text-green-400 bg-green-400/20';
      case 'SOPORTE':
        return 'text-zinc-300 bg-zinc-700/20';
      case 'PROSPECCIÓN':
        return 'text-zinc-200 bg-zinc-800/20';
      case 'MARKETING':
        return 'text-orange-400 bg-orange-400/20';
      case 'REUNIÓN':
        return 'text-zinc-300 bg-zinc-700/20';
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
        <h1 className="text-3xl font-bold text-zinc-300 mb-2">👥 CLIENTES</h1>
        <p className="text-gray-400">
          Gestión de Clientes • CRM • Interacciones • Seguimiento Comercial
        </p>
      </motion.div>

      {/* Controles */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
        {/* Pestañas */}
        <div className="flex space-x-1 bg-black/50 p-1 rounded-lg">
          <button
            className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
              activeView === 'clientes'
                ? 'bg-zinc-800/20 text-zinc-300 border border-zinc-700/50'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            onClick={() => {
              setActiveView('clientes');
              playUISound('switch');
            }}
          >
            👥 CLIENTES
          </button>
          <button
            className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
              activeView === 'interacciones'
                ? 'bg-zinc-800/20 text-zinc-300 border border-zinc-700/50'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            onClick={() => {
              setActiveView('interacciones');
              playUISound('switch');
            }}
          >
            💬 INTERACCIONES
          </button>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {activeView === 'clientes' && (
            <select
              value={filterSegmento}
              onChange={(e) => setFilterSegmento(e.target.value)}
              className="bg-black/50 border border-zinc-700/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-zinc-600"
            >
              <option value="TODOS">Todos los Segmentos</option>
              <option value="ENTERPRISE">Enterprise</option>
              <option value="CORPORATIVO">Corporativo</option>
              <option value="PYME">PYME</option>
              <option value="RETAIL">Retail</option>
            </select>
          )}

          <div className="relative">
            <input
              type="text"
              placeholder="Buscar clientes o interacciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/50 border border-zinc-700/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-zinc-600 w-64"
            />
            <div className="absolute right-3 top-2.5 text-gray-400">🔍</div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <AnimatePresence mode="wait">
        {activeView === 'clientes' && (
          <motion.div
            key="clientes"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Grid de Clientes */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 max-h-[calc(100vh-300px)] overflow-y-auto">
              {filteredClientes.map((cliente) => (
                <motion.div
                  key={cliente.id}
                  className="bg-black/50 border border-zinc-700/30 rounded-lg p-4 hover:border-zinc-600/50 transition-all cursor-pointer"
                  whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}
                  onClick={() => setSelectedCliente(cliente)}
                >
                  {/* Header del Cliente */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-zinc-300 font-semibold text-lg">{cliente.nombre}</h3>
                      <p className="text-gray-400 text-sm">
                        {cliente.sector} • {cliente.empleados} empleados
                      </p>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span
                        className={`text-xs px-2 py-1 rounded border ${getStatusColor(cliente.estatus)}`}
                      >
                        {cliente.estatus}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${getSegmentColor(cliente.segmento)}`}
                      >
                        {cliente.segmento}
                      </span>
                    </div>
                  </div>

                  {/* Información de Contacto */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <p className="text-gray-400">Contacto:</p>
                      <p className="text-white">{cliente.contactoPrincipal}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Email:</p>
                      <p className="text-white truncate">{cliente.email}</p>
                    </div>
                  </div>

                  {/* Métricas Comerciales */}
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div className="bg-green-900/20 p-2 rounded">
                      <p className="text-green-400 text-xs">Ventas Anuales</p>
                      <p className="text-white font-semibold">
                        {formatCurrency(cliente.ventasAnuales)}
                      </p>
                    </div>
                    <div className="bg-zinc-950/20 p-2 rounded">
                      <p className="text-zinc-300 text-xs">Margen Prom.</p>
                      <p className="text-white font-semibold">{cliente.margenPromedio}%</p>
                    </div>
                  </div>

                  {/* Rating y Potencial */}
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${getRatingColor(cliente.calificacion)}`}
                      >
                        {cliente.calificacion}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${getPotentialColor(cliente.potencialCrecimiento)}`}
                      >
                        {cliente.potencialCrecimiento}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">Última: {cliente.ultimaInteraccion}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeView === 'interacciones' && (
          <motion.div
            key="interacciones"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Tabla de Interacciones */}
            <div className="bg-black/50 rounded-lg border border-zinc-700/30 overflow-hidden">
              <div className="bg-zinc-950/30 p-4 border-b border-zinc-700/30">
                <h3 className="text-zinc-300 font-semibold">💬 HISTORIAL DE INTERACCIONES</h3>
              </div>
              <div className="overflow-x-auto max-h-[calc(100vh-350px)]">
                <table className="w-full">
                  <thead className="bg-black/70 sticky top-0">
                    <tr>
                      <th className="p-3 text-left text-zinc-300">Fecha</th>
                      <th className="p-3 text-left text-zinc-300">Cliente</th>
                      <th className="p-3 text-left text-zinc-300">Tipo</th>
                      <th className="p-3 text-left text-zinc-300">Descripción</th>
                      <th className="p-3 text-left text-zinc-300">Responsable</th>
                      <th className="p-3 text-center text-zinc-300">Estado</th>
                      <th className="p-3 text-center text-zinc-300">Seguimiento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInteracciones.map((interaccion) => (
                      <motion.tr
                        key={interaccion.id}
                        className="border-b border-white/10 hover:bg-white/5"
                        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                      >
                        <td className="p-3 text-gray-300">{interaccion.fecha}</td>
                        <td className="p-3 text-white font-semibold">{interaccion.cliente}</td>
                        <td className="p-3">
                          <span
                            className={`text-xs px-2 py-1 rounded ${getInteractionTypeColor(interaccion.tipo)}`}
                          >
                            {interaccion.tipo}
                          </span>
                        </td>
                        <td className="p-3 text-gray-300 max-w-xs truncate">
                          {interaccion.descripcion}
                        </td>
                        <td className="p-3 text-gray-300">{interaccion.responsable}</td>
                        <td className="p-3 text-center">
                          <span
                            className={`text-xs px-2 py-1 rounded border ${getStatusColor(interaccion.estado)}`}
                          >
                            {interaccion.estado.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3 text-center text-gray-300 text-sm">
                          {interaccion.seguimiento || '-'}
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

      {/* Modal de Detalle de Cliente */}
      <AnimatePresence>
        {selectedCliente && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCliente(null)}
          >
            <motion.div
              className="bg-black/90 border border-zinc-700/50 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[85vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-300">{selectedCliente.nombre}</h2>
                  <p className="text-gray-400">
                    {selectedCliente.sector} • {selectedCliente.segmento}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCliente(null)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Información Detallada */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Columna Izquierda */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-zinc-300 font-semibold mb-3">📞 INFORMACIÓN DE CONTACTO</h4>
                    <div className="bg-zinc-950/20 p-4 rounded space-y-2">
                      <p>
                        <span className="text-gray-400">Contacto Principal:</span>{' '}
                        {selectedCliente.contactoPrincipal}
                      </p>
                      <p>
                        <span className="text-gray-400">Teléfono:</span> {selectedCliente.telefono}
                      </p>
                      <p>
                        <span className="text-gray-400">Email:</span> {selectedCliente.email}
                      </p>
                      <p>
                        <span className="text-gray-400">Dirección:</span>{' '}
                        {selectedCliente.direccion}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-zinc-300 font-semibold mb-3">🏢 INFORMACIÓN EMPRESARIAL</h4>
                    <div className="bg-green-900/20 p-4 rounded space-y-2">
                      <p>
                        <span className="text-gray-400">Empleados:</span>{' '}
                        {selectedCliente.empleados}
                      </p>
                      <p>
                        <span className="text-gray-400">Sector:</span> {selectedCliente.sector}
                      </p>
                      <p>
                        <span className="text-gray-400">Segmento:</span>{' '}
                        <span
                          className={getSegmentColor(selectedCliente.segmento).replace(
                            'bg-',
                            'text-'
                          )}
                        >
                          {selectedCliente.segmento}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-400">Calificación:</span>{' '}
                        <span
                          className={getRatingColor(selectedCliente.calificacion).replace(
                            'bg-',
                            'text-'
                          )}
                        >
                          {selectedCliente.calificacion}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Columna Derecha */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-zinc-300 font-semibold mb-3">💰 INFORMACIÓN COMERCIAL</h4>
                    <div className="bg-zinc-800/20 p-4 rounded space-y-2">
                      <p>
                        <span className="text-gray-400">Ventas Totales:</span>{' '}
                        {formatCurrency(selectedCliente.ventasTotales)}
                      </p>
                      <p>
                        <span className="text-gray-400">Ventas Anuales:</span>{' '}
                        {formatCurrency(selectedCliente.ventasAnuales)}
                      </p>
                      <p>
                        <span className="text-gray-400">Margen Promedio:</span>{' '}
                        {selectedCliente.margenPromedio}%
                      </p>
                      <p>
                        <span className="text-gray-400">Potencial:</span>{' '}
                        <span
                          className={getPotentialColor(
                            selectedCliente.potencialCrecimiento
                          ).replace('bg-', 'text-')}
                        >
                          {selectedCliente.potencialCrecimiento}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-zinc-300 font-semibold mb-3">💳 CONDICIONES COMERCIALES</h4>
                    <div className="bg-orange-900/20 p-4 rounded space-y-2">
                      <p>
                        <span className="text-gray-400">Método de Pago:</span>{' '}
                        {selectedCliente.metodoPagoPreferido}
                      </p>
                      <p>
                        <span className="text-gray-400">Días de Crédito:</span>{' '}
                        {selectedCliente.diasCredito} días
                      </p>
                      <p>
                        <span className="text-gray-400">Descuento Autorizado:</span>{' '}
                        {selectedCliente.descuentoAutorizado}%
                      </p>
                      <p>
                        <span className="text-gray-400">Estado:</span>{' '}
                        <span
                          className={getStatusColor(selectedCliente.estatus)
                            .replace('bg-', 'text-')
                            .replace('border-', 'text-')}
                        >
                          {selectedCliente.estatus}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fechas Importantes */}
              <div className="mt-6">
                <h4 className="text-zinc-300 font-semibold mb-3">📅 FECHAS IMPORTANTES</h4>
                <div className="bg-gray-900/20 p-4 rounded grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p>
                    <span className="text-gray-400">Fecha de Registro:</span>{' '}
                    {selectedCliente.fechaRegistro}
                  </p>
                  <p>
                    <span className="text-gray-400">Última Interacción:</span>{' '}
                    {selectedCliente.ultimaInteraccion}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PanelClientes;
