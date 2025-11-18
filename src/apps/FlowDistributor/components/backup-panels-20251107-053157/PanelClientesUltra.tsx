/**
 * 🎯 PANEL CLIENTES ULTRA - VERSIÓN PREMIUM
 *
 * Características:
 * - Tabla completa de clientes con datos reales
 * - Formulario de nuevo cliente
 * - Botón ABONAR para registrar pagos
 * - Botón SALDAR ADEUDO para liquidar deuda completa
 * - KPIs: Total clientes, Adeudo total, Clientes activos
 * - Filtros y búsqueda
 * - Animaciones premium
 * - Gráficos de análisis
 *
 * @version 1.0.0 - ULTRA PREMIUM
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Download,
  Filter,
  Search,
  TrendingUp,
  UserPlus,
  Users,
  X,
} from 'lucide-react';

// Design System
import animations from '../design-system/animations';
// Hooks
import { useClientes } from '../hooks/useClientes';
// Utils
import { formatCurrency } from '../utils/formatters';
// Components
import { PremiumLoadingScreen } from './PremiumLoadingScreen';
import { CreativeParticles } from './shared/CreativeParticles';
import { KpiCard3D } from './shared/KpiCard3D';

interface Cliente {
  id: string;
  nombre: string;
  totalComprado: number;
  totalAbonado: number;
  adeudo: number;
  estado: 'activo' | 'saldado';
  observaciones?: string;
  ventas?: any[];
  ultimaCompra?: string;
}

interface FormData {
  nombre: string;
  totalComprado: number;
  totalAbonado: number;
  observaciones: string;
}

interface AbonoFormData {
  monto: number;
  fecha: string;
  concepto: string;
}

/**
 * 🎨 Componente Principal - Panel Clientes Ultra
 */
export default function PanelClientesUltra() {
  // ============================================
  // STATE
  // ============================================
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activo' | 'saldado'>('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'nuevo' | 'abono' | 'saldar' | null>(null);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

  // ============================================
  // HOOKS DE DATOS
  // ============================================
  const {
    clientes: clientesData = [],
    isLoading: clientesLoading,
    addCliente,
    abonarCliente,
    saldarCliente,
  } = useClientes();

  // ============================================
  // EFFECTS
  // ============================================
  useEffect(() => {
    if (!clientesLoading) {
      setTimeout(() => setLoading(false), 800);
    }
  }, [clientesLoading]);

  // ============================================
  // CÁLCULOS Y FILTROS
  // ============================================
  const clientesFiltrados = useMemo(() => {
    let resultado = [...clientesData];

    // Filtro por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      resultado = resultado.filter(
        (c) =>
          c.nombre.toLowerCase().includes(term) ||
          c.id.toLowerCase().includes(term) ||
          c.observaciones?.toLowerCase().includes(term)
      );
    }

    // Filtro por estado
    if (filtroEstado !== 'todos') {
      resultado = resultado.filter((c) => c.estado === filtroEstado);
    }

    // Ordenar por adeudo (mayor primero)
    resultado.sort((a, b) => b.adeudo - a.adeudo);

    return resultado;
  }, [clientesData, searchTerm, filtroEstado]);

  // KPIs
  const totalClientes = clientesData.length;
  const clientesActivos = clientesData.filter((c) => c.estado === 'activo').length;
  const adeudoTotal = clientesData.reduce((sum, c) => sum + c.adeudo, 0);
  const totalComprado = clientesData.reduce((sum, c) => sum + c.totalComprado, 0);
  const totalAbonado = clientesData.reduce((sum, c) => sum + c.totalAbonado, 0);
  const tasaRecuperacion = totalComprado > 0 ? (totalAbonado / totalComprado) * 100 : 0;

  // ============================================
  // HANDLERS
  // ============================================
  const openModal = useCallback((type: 'nuevo' | 'abono' | 'saldar', cliente?: Cliente) => {
    setModalType(type);
    setSelectedCliente(cliente || null);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalType(null);
    setSelectedCliente(null);
  }, []);

  const handleSubmitNuevoCliente = useCallback(
    (data: FormData) => {
      const nuevoCliente = {
        id: `CLI-${Date.now()}`,
        nombre: data.nombre,
        totalComprado: data.totalComprado || 0,
        totalAbonado: data.totalAbonado || 0,
        adeudo: (data.totalComprado || 0) - (data.totalAbonado || 0),
        estado: (data.totalComprado || 0) - (data.totalAbonado || 0) > 0 ? 'activo' : 'saldado',
        observaciones: data.observaciones,
        ventas: [],
      } as Cliente;

      addCliente(nuevoCliente);
      closeModal();
    },
    [addCliente, closeModal]
  );

  const handleSubmitAbono = useCallback(
    (data: AbonoFormData) => {
      if (!selectedCliente) return;

      abonarCliente(selectedCliente.id, {
        monto: data.monto,
        fecha: data.fecha,
        concepto: data.concepto,
      });

      closeModal();
    },
    [selectedCliente, abonarCliente, closeModal]
  );

  const handleSaldarCliente = useCallback(() => {
    if (!selectedCliente) return;

    saldarCliente(selectedCliente.id);
    closeModal();
  }, [selectedCliente, saldarCliente, closeModal]);

  const exportToCSV = useCallback(() => {
    const headers = [
      'ID',
      'Cliente',
      'Total Comprado',
      'Total Abonado',
      'Adeudo',
      'Estado',
      'Observaciones',
    ];
    const rows = clientesFiltrados.map((c) => [
      c.id,
      c.nombre,
      c.totalComprado,
      c.totalAbonado,
      c.adeudo,
      c.estado,
      c.observaciones || '',
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clientes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [clientesFiltrados]);

  // ============================================
  // RENDER
  // ============================================
  if (loading) {
    return <PremiumLoadingScreen message="Cargando Clientes..." />;
  }

  return (
    <div
      className="min-h-screen p-6 md:p-8 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${'#0a0e27'} 0%, ${'#1a1f3a'} 100%)`,
      }}
    >
      {/* Creative Particles Background */}
      <CreativeParticles count={30} colors={['#3b82f6', '#a855f7']} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          variants={animations.container}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <motion.div
              variants={animations.container.fadeSlideUp}
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${'#3b82f6'} 0%, ${'#a855f7'} 100%)`,
                boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
              }}
            >
              <Users className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <motion.h1
                variants={animations.container.fadeSlideUp}
                className="text-4xl font-bold"
                style={{
                  color: '#f8fafc',
                  fontFamily: '"Inter", system-ui, sans-serif',
                }}
              >
                Clientes
              </motion.h1>
              <motion.p
                variants={animations.container.fadeSlideUp}
                className="text-sm"
                style={{ color: '#cbd5e1' }}
              >
                Gestión integral de cartera de clientes
              </motion.p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <motion.button
              variants={animations.container.fadeSlideUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openModal('nuevo')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-white transition-all"
              style={{
                background: `linear-gradient(135deg, ${'#06b6d4'} 0%, ${'#3b82f6'} 100%)`,
                boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)',
              }}
            >
              <UserPlus className="w-5 h-5" />
              <span>Nuevo Cliente</span>
            </motion.button>

            <motion.button
              variants={animations.container.fadeSlideUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all"
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: `1px solid ${'rgba(148, 163, 184, 0.1)'}`,
                color: '#f8fafc',
              }}
            >
              <Download className="w-5 h-5" />
              <span className="hidden md:inline">Exportar</span>
            </motion.button>
          </div>
        </motion.div>

        {/* KPIs */}
        <motion.div
          variants={animations.container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <KpiCard3D
            icon={Users}
            label="Total Clientes"
            value={totalClientes}
            subtitle={`${clientesActivos} activos`}
            trend={clientesActivos > 0 ? 'up' : 'neutral'}
            color="blue"
          />
          <KpiCard3D
            icon={AlertTriangle}
            label="Adeudo Total"
            value={formatCurrency(adeudoTotal)}
            subtitle={`${clientesActivos} con adeudo`}
            trend={adeudoTotal > 0 ? 'down' : 'neutral'}
            color="orange"
          />
          <KpiCard3D
            icon={DollarSign}
            label="Total Comprado"
            value={formatCurrency(totalComprado)}
            subtitle={`${formatCurrency(totalAbonado)} abonado`}
            trend="up"
            color="green"
          />
          <KpiCard3D
            icon={TrendingUp}
            label="Recuperación"
            value={`${tasaRecuperacion.toFixed(1)}%`}
            subtitle="Tasa de cobranza"
            trend={tasaRecuperacion > 75 ? 'up' : tasaRecuperacion > 50 ? 'neutral' : 'down'}
            color="purple"
          />
        </motion.div>

        {/* Filters & Search */}
        <motion.div
          variants={animations.container.fadeSlideUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row items-stretch md:items-center gap-4 p-4 rounded-2xl"
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: `1px solid ${'rgba(148, 163, 184, 0.1)'}`,
          }}
        >
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: '#94a3b8' }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar cliente..."
              className="w-full pl-11 pr-4 py-3 rounded-xl outline-none transition-all"
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: `1px solid ${'rgba(148, 163, 184, 0.1)'}`,
                color: '#f8fafc',
              }}
            />
          </div>

          {/* Estado Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" style={{ color: '#94a3b8' }} />
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as any)}
              className="px-4 py-3 rounded-xl outline-none cursor-pointer transition-all"
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: `1px solid ${'rgba(148, 163, 184, 0.1)'}`,
                color: '#f8fafc',
              }}
            >
              <option value="todos">Todos</option>
              <option value="activo">Activos</option>
              <option value="saldado">Saldados</option>
            </select>
          </div>

          {/* Results Count */}
          <div
            className="px-4 py-3 rounded-xl font-semibold whitespace-nowrap"
            style={{
              background: 'rgba(30, 41, 59, 0.5)',
              border: `1px solid ${'rgba(148, 163, 184, 0.1)'}`,
              color: '#f8fafc',
            }}
          >
            {clientesFiltrados.length} clientes
          </div>
        </motion.div>

        {/* Tabla de Clientes */}
        <motion.div
          variants={animations.container.fadeSlideUp}
          initial="hidden"
          animate="visible"
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: `1px solid ${'rgba(148, 163, 184, 0.1)'}`,
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    borderBottom: `1px solid ${'rgba(148, 163, 184, 0.1)'}`,
                  }}
                >
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold"
                    style={{ color: '#cbd5e1' }}
                  >
                    Cliente
                  </th>
                  <th
                    className="px-6 py-4 text-right text-sm font-semibold"
                    style={{ color: '#cbd5e1' }}
                  >
                    Total Comprado
                  </th>
                  <th
                    className="px-6 py-4 text-right text-sm font-semibold"
                    style={{ color: '#cbd5e1' }}
                  >
                    Total Abonado
                  </th>
                  <th
                    className="px-6 py-4 text-right text-sm font-semibold"
                    style={{ color: '#cbd5e1' }}
                  >
                    Adeudo
                  </th>
                  <th
                    className="px-6 py-4 text-center text-sm font-semibold"
                    style={{ color: '#cbd5e1' }}
                  >
                    Estado
                  </th>
                  <th
                    className="px-6 py-4 text-right text-sm font-semibold"
                    style={{ color: '#cbd5e1' }}
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center" style={{ color: '#94a3b8' }}>
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No se encontraron clientes</p>
                    </td>
                  </tr>
                ) : (
                  clientesFiltrados.map((cliente, index) => (
                    <motion.tr
                      key={cliente.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="transition-colors hover:bg-white/5"
                      style={{ borderBottom: `1px solid ${'rgba(148, 163, 184, 0.1)'}` }}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold" style={{ color: '#f8fafc' }}>
                            {cliente.nombre}
                          </p>
                          <p className="text-sm" style={{ color: '#94a3b8' }}>
                            {cliente.id}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono" style={{ color: '#f8fafc' }}>
                        {formatCurrency(cliente.totalComprado)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono" style={{ color: '#06b6d4' }}>
                        {formatCurrency(cliente.totalAbonado)}
                      </td>
                      <td
                        className="px-6 py-4 text-right font-mono font-bold"
                        style={{ color: cliente.adeudo > 0 ? '#f59e0b' : '#10b981' }}
                      >
                        {formatCurrency(cliente.adeudo)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            background:
                              cliente.estado === 'activo' ? '#f59e0b' + '20' : '#10b981' + '20',
                            color: cliente.estado === 'activo' ? '#f59e0b' : '#10b981',
                            border: `1px solid ${cliente.estado === 'activo' ? '#f59e0b' : '#10b981'}30`,
                          }}
                        >
                          {cliente.estado === 'activo' ? (
                            <Activity className="w-3 h-3" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                          {cliente.estado === 'activo' ? 'Activo' : 'Saldado'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {cliente.adeudo > 0 && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openModal('abono', cliente)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                                style={{
                                  background: '#06b6d4' + '20',
                                  border: `1px solid ${'#06b6d4'}30`,
                                  color: '#06b6d4',
                                }}
                              >
                                Abonar
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openModal('saldar', cliente)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                                style={{
                                  background: '#10b981' + '20',
                                  border: `1px solid ${'#10b981'}30`,
                                  color: '#10b981',
                                }}
                              >
                                Saldar
                              </motion.button>
                            </>
                          )}
                          {cliente.adeudo === 0 && (
                            <span className="text-xs" style={{ color: '#94a3b8' }}>
                              Sin adeudo
                            </span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <ModalClientes
          type={modalType!}
          cliente={selectedCliente}
          onClose={closeModal}
          onSubmitNuevo={handleSubmitNuevoCliente}
          onSubmitAbono={handleSubmitAbono}
          onSubmitSaldar={handleSaldarCliente}
        />
      )}
    </div>
  );
}

// ============================================
// MODAL COMPONENT
// ============================================
interface ModalProps {
  type: 'nuevo' | 'abono' | 'saldar';
  cliente: Cliente | null;
  onClose: () => void;
  onSubmitNuevo: (data: FormData) => void;
  onSubmitAbono: (data: AbonoFormData) => void;
  onSubmitSaldar: () => void;
}

function ModalClientes({
  type,
  cliente,
  onClose,
  onSubmitNuevo,
  onSubmitAbono,
  onSubmitSaldar,
}: ModalProps) {
  const [formData, setFormData] = useState<any>({
    nombre: '',
    totalComprado: 0,
    totalAbonado: 0,
    observaciones: '',
    monto: 0,
    fecha: new Date().toISOString().split('T')[0],
    concepto: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === 'nuevo') {
      onSubmitNuevo(formData);
    } else if (type === 'abono') {
      onSubmitAbono(formData);
    } else if (type === 'saldar') {
      onSubmitSaldar();
    }
  };

  const modalTitles = {
    nuevo: 'Nuevo Cliente',
    abono: `Abonar a ${cliente?.nombre}`,
    saldar: `Saldar Adeudo de ${cliente?.nombre}`,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: `1px solid ${'rgba(148, 163, 184, 0.1)'}`,
          boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{
            background: 'rgba(30, 41, 59, 0.5)',
            borderBottom: `1px solid ${'rgba(148, 163, 184, 0.1)'}`,
          }}
        >
          <h2 className="text-xl font-bold" style={{ color: '#f8fafc' }}>
            {modalTitles[type]}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" style={{ color: '#94a3b8' }} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {type === 'nuevo' && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#cbd5e1' }}>
                  Nombre del Cliente *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                  style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: `1px solid ${'rgba(148, 163, 184, 0.1)'}`,
                    color: '#f8fafc',
                  }}
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#cbd5e1' }}>
                  Total Comprado
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.totalComprado}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalComprado: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                  style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: `1px solid ${'rgba(148, 163, 184, 0.1)'}`,
                    color: '#f8fafc',
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#cbd5e1' }}>
                  Total Abonado
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.totalAbonado}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalAbonado: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                  style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: `1px solid ${'rgba(148, 163, 184, 0.1)'}`,
                    color: '#f8fafc',
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#cbd5e1' }}>
                  Observaciones
                </label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all resize-none"
                  style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: `1px solid ${'rgba(148, 163, 184, 0.1)'}`,
                    color: '#f8fafc',
                  }}
                  rows={3}
                  placeholder="Notas adicionales..."
                />
              </div>
            </>
          )}

          {type === 'abono' && (
            <>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(30, 41, 59, 0.5)' }}>
                <p className="text-sm mb-1" style={{ color: '#94a3b8' }}>
                  Adeudo actual
                </p>
                <p className="text-2xl font-bold" style={{ color: '#f59e0b' }}>
                  {formatCurrency(cliente?.adeudo || 0)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#cbd5e1' }}>
                  Monto a Abonar *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.monto}
                  onChange={(e) =>
                    setFormData({ ...formData, monto: Number.parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                  style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: `1px solid ${'rgba(148, 163, 184, 0.1)'}`,
                    color: '#f8fafc',
                  }}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#cbd5e1' }}>
                  Fecha
                </label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                  style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: `1px solid ${'rgba(148, 163, 184, 0.1)'}`,
                    color: '#f8fafc',
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#cbd5e1' }}>
                  Concepto
                </label>
                <input
                  type="text"
                  value={formData.concepto}
                  onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                  style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: `1px solid ${'rgba(148, 163, 184, 0.1)'}`,
                    color: '#f8fafc',
                  }}
                  placeholder="Pago parcial, abono..."
                />
              </div>
            </>
          )}

          {type === 'saldar' && (
            <div className="space-y-4">
              <div
                className="p-6 rounded-xl text-center"
                style={{ background: 'rgba(30, 41, 59, 0.5)' }}
              >
                <AlertTriangle className="w-12 h-12 mx-auto mb-3" style={{ color: '#f59e0b' }} />
                <p className="text-lg font-semibold mb-2" style={{ color: '#f8fafc' }}>
                  ¿Saldar adeudo completo?
                </p>
                <p className="text-sm mb-4" style={{ color: '#94a3b8' }}>
                  Se registrará el pago total del adeudo:
                </p>
                <p className="text-3xl font-bold" style={{ color: '#f59e0b' }}>
                  {formatCurrency(cliente?.adeudo || 0)}
                </p>
              </div>
              <p className="text-sm text-center" style={{ color: '#94a3b8' }}>
                Esta acción marcará al cliente como "Saldado"
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl font-semibold transition-all"
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: `1px solid ${'rgba(148, 163, 184, 0.1)'}`,
                color: '#f8fafc',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl font-semibold text-white transition-all"
              style={{
                background:
                  type === 'saldar'
                    ? `linear-gradient(135deg, ${'#10b981'} 0%, ${'#06b6d4'} 100%)`
                    : `linear-gradient(135deg, ${'#3b82f6'} 0%, ${'#a855f7'} 100%)`,
                boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
              }}
            >
              {type === 'nuevo'
                ? 'Crear Cliente'
                : type === 'abono'
                  ? 'Registrar Abono'
                  : 'Saldar Adeudo'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
