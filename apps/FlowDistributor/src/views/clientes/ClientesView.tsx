import { useMemo, useState } from 'react';

import { collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Edit,
  Eye,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Users,
} from 'lucide-react';

import { AdvancedChart } from '@/components/charts/AdvancedChart';
import { ChronosButton } from '@/components/chronos-ui/ChronosButton';
import { ChronosCard } from '@/components/chronos-ui/ChronosCard';
import { ChronosKPI } from '@/components/chronos-ui/ChronosKPI';
import { ExportButton } from '@/components/export';
import FormClienteSimple from '@/components/forms/FormClienteSimple';
import { useChronosData } from '@/hooks/useChronosData';
import { db } from '@/lib/firebase';
import type { Banco, BancoId, Cliente } from '@/types';

/**
 * 👥 CLIENTES VIEW
 * CRM completo con sistema de abonos y gestión de adeudos
 */
export default function ClientesView() {
  const { clientes, bancos } = useChronosData();

  const [showForm, setShowForm] = useState(false);
  const [showAbonoModal, setShowAbonoModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'conAdeudo' | 'alDia'>('all');

  // KPIs calculados
  const kpis = useMemo(() => {
    const clientesActivos = clientes.filter((c) => c.activo).length;
    const totalAdeudos = clientes.reduce((sum, c) => sum + (c.adeudo || 0), 0);
    const clientesConAdeudo = clientes.filter((c) => c.adeudo > 0).length;
    const promedioAdeudo = clientesConAdeudo > 0 ? totalAdeudos / clientesConAdeudo : 0;

    return {
      clientesActivos,
      totalAdeudos,
      clientesConAdeudo,
      promedioAdeudo,
      totalClientes: clientes.length,
    };
  }, [clientes]);

  // Chart Data: Scatter Plot (Adeudo vs Actividad)
  const scatterData = useMemo(() => {
    return clientes
      .filter((c) => c.activo)
      .map((cliente) => ({
        name: cliente.nombre,
        value: [
          cliente.adeudo || 0, // x-axis: adeudo
          Math.random() * 100, // y-axis: score de actividad (simulado)
          cliente.limiteCredito || 50000, // size: límite de crédito
        ],
      }));
  }, [clientes]);

  // Chart Data: Heatmap (Clientes por Día/Hora) - simulado
  const heatmapData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    return {
      xAxis: hours.map((h) => `${h}:00`),
      yAxis: days,
      data: days.flatMap((_day, dayIndex) =>
        hours.map((hour) => [hour, dayIndex, Math.floor(Math.random() * 50)])
      ),
    };
  }, []);

  // Chart Data: Treemap (Segmentación de Clientes)
  const treemapData = useMemo(() => {
    const vip = clientes.filter((c) => (c.limiteCredito || 0) > 100000);
    const premium = clientes.filter(
      (c) => (c.limiteCredito || 0) > 50000 && (c.limiteCredito || 0) <= 100000
    );
    const regular = clientes.filter(
      (c) => (c.limiteCredito || 0) > 20000 && (c.limiteCredito || 0) <= 50000
    );
    const basico = clientes.filter((c) => (c.limiteCredito || 0) <= 20000);

    return [
      {
        name: 'VIP',
        value: vip.length * 100000,
        children: vip.map((c) => ({ name: c.nombre, value: c.limiteCredito || 50000 })),
      },
      {
        name: 'Premium',
        value: premium.length * 75000,
        children: premium.map((c) => ({ name: c.nombre, value: c.limiteCredito || 30000 })),
      },
      {
        name: 'Regular',
        value: regular.length * 35000,
        children: regular.map((c) => ({ name: c.nombre, value: c.limiteCredito || 20000 })),
      },
      {
        name: 'Básico',
        value: basico.length * 10000,
        children: basico.map((c) => ({ name: c.nombre, value: c.limiteCredito || 5000 })),
      },
    ];
  }, [clientes]);

  // Filtrar clientes
  const clientesFiltrados = useMemo(() => {
    return clientes.filter((cliente) => {
      const matchesSearch =
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.telefono?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email?.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesStatus = true;
      if (filterStatus === 'conAdeudo') matchesStatus = (cliente.adeudo || 0) > 0;
      if (filterStatus === 'alDia') matchesStatus = (cliente.adeudo || 0) === 0;

      return matchesSearch && matchesStatus;
    });
  }, [clientes, searchTerm, filterStatus]);

  // Handler: Crear nuevo cliente
  const handleCrearCliente = async (nombre: string) => {
    try {
      const nuevoCliente = {
        nombre,
        razonSocial: '',
        rfc: '',
        telefono: '',
        email: '',
        direccion: '',
        ciudad: '',
        estado: '',
        codigoPostal: '',
        limiteCredito: 0,
        diasCredito: 30,
        adeudo: 0,
        activo: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const clienteRef = doc(collection(db, 'clientes'));
      await setDoc(clienteRef, nuevoCliente);

      console.log('✅ Cliente creado:', nombre);
      // Recargar automáticamente desde el hook useChronosData
    } catch (error) {
      console.error('❌ Error al crear cliente:', error);
      throw error;
    }
  };

  // Handler: Registrar abono
  const handleRegistrarAbono = async (
    cliente: Cliente,
    monto: number,
    bancoId: string,
    notas: string
  ) => {
    try {
      // 1. Actualizar adeudo del cliente
      const clienteRef = doc(db, 'clientes', cliente.id);
      const nuevoAdeudo = Math.max(0, (cliente.adeudo || 0) - monto);
      await updateDoc(clienteRef, {
        adeudo: nuevoAdeudo,
        updatedAt: serverTimestamp(),
      });

      // 2. Actualizar capital del banco
      const bancoRef = doc(db, 'bancos', bancoId);
      const banco = bancos.find((b) => b.id === bancoId);
      if (banco) {
        await updateDoc(bancoRef, {
          capitalActual: banco.capitalActual + monto,
          updatedAt: serverTimestamp(),
        });
      }

      // 3. Registrar en histórico de movimientos
      const movimientoRef = doc(collection(db, 'movimientos'));
      await setDoc(movimientoRef, {
        tipo: 'ingreso',
        concepto: `Abono de ${cliente.nombre}`,
        monto,
        bancoId,
        clienteId: cliente.id,
        fecha: serverTimestamp(),
        notas,
        createdAt: serverTimestamp(),
      });

      console.log('✅ Abono registrado:', {
        cliente: cliente.nombre,
        monto,
        banco: bancoId,
        nuevoAdeudo,
      });

      setShowAbonoModal(false);
      setSelectedCliente(null);
    } catch (error) {
      console.error('❌ Error al registrar abono:', error);
      throw error;
    }
  };

  const handleAbonoClick = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setShowAbonoModal(true);
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-chronos-white flex items-center gap-3">
            <Users className="w-10 h-10 text-neon-cyan" />
            Gestión de Clientes
          </h1>
          <p className="text-chronos-silver mt-2 text-lg">
            CRM completo con control de adeudos y pagos
          </p>
        </div>
        <ChronosButton variant="primary" size="lg" onClick={() => setShowForm(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Cliente
        </ChronosButton>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ChronosKPI
          label="Clientes Activos"
          value={kpis.clientesActivos}
          format="number"
          color="cyan"
          pulse
        />
        <ChronosKPI label="Total Adeudos" value={kpis.totalAdeudos} format="currency" color="red" />
        <ChronosKPI
          label="Clientes con Adeudo"
          value={kpis.clientesConAdeudo}
          format="number"
          color="yellow"
        />
        <ChronosKPI
          label="Promedio Adeudo"
          value={kpis.promedioAdeudo}
          format="currency"
          color="purple"
        />
      </div>

      {/* Filters */}
      <ChronosCard variant="glass">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-chronos-silver" />
            <input
              type="text"
              placeholder="Buscar por nombre, teléfono o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white placeholder-chronos-silver focus:outline-none focus:border-neon-cyan transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'all'
                  ? 'bg-neon-cyan text-chronos-void'
                  : 'bg-chronos-graphite text-chronos-silver hover:bg-chronos-smoke'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterStatus('conAdeudo')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'conAdeudo'
                  ? 'bg-neon-red text-chronos-void'
                  : 'bg-chronos-graphite text-chronos-silver hover:bg-chronos-smoke'
              }`}
            >
              Con Adeudo
            </button>
            <button
              onClick={() => setFilterStatus('alDia')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'alDia'
                  ? 'bg-neon-green text-chronos-void'
                  : 'bg-chronos-graphite text-chronos-silver hover:bg-chronos-smoke'
              }`}
            >
              Al Día
            </button>
          </div>
        </div>
      </ChronosCard>

      {/* 📊 ADVANCED CHARTS SECTION - Phase 6 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        {/* Charts Header with Export */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-chronos-white">Análisis de Clientes</h2>
            <p className="text-chronos-silver mt-1">Segmentación, actividad y comportamiento</p>
          </div>
          <ExportButton
            title="Análisis de Clientes"
            subtitle={`Total: ${clientesFiltrados.length} clientes | Adeudos: $${kpis.totalAdeudos.toLocaleString()}`}
            fileName={`clientes_analisis_${Date.now()}`}
            formats={['pdf', 'excel', 'png']}
            tables={[
              {
                title: 'Lista de Clientes',
                headers: ['Nombre', 'Teléfono', 'Email', 'Adeudo', 'Límite Crédito', 'Estado'],
                rows: clientesFiltrados.map((c) => [
                  c.nombre,
                  c.telefono || 'N/A',
                  c.email || 'N/A',
                  `$${(c.adeudo || 0).toLocaleString()}`,
                  `$${(c.limiteCredito || 0).toLocaleString()}`,
                  c.activo ? 'Activo' : 'Inactivo',
                ]),
              },
            ]}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scatter Plot: Adeudo vs Actividad */}
          <AdvancedChart
            type="scatter"
            data={scatterData}
            title="🎯 Adeudo vs Score de Actividad"
            height={400}
            animationDelay={0}
          />

          {/* Heatmap: Actividad por Día/Hora */}
          <AdvancedChart
            type="heatmap"
            data={heatmapData}
            title="🔥 Heatmap de Actividad (Día/Hora)"
            height={400}
            animationDelay={200}
          />
        </div>

        {/* Treemap: Segmentación Full-Width */}
        <AdvancedChart
          type="treemap"
          data={treemapData}
          title="🏢 Segmentación de Clientes por Límite de Crédito"
          height={450}
          animationDelay={400}
          className="col-span-full"
        />
      </motion.div>

      {/* Grid de Clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {clientesFiltrados.length === 0 ? (
          <div className="col-span-full">
            <ChronosCard variant="glass-metal">
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-chronos-silver mx-auto mb-4" />
                <p className="text-chronos-silver text-lg">
                  {searchTerm || filterStatus !== 'all'
                    ? 'No se encontraron clientes con los filtros aplicados'
                    : 'No hay clientes registrados. Crea tu primer cliente.'}
                </p>
              </div>
            </ChronosCard>
          </div>
        ) : (
          clientesFiltrados.map((cliente) => (
            <motion.div
              key={cliente.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <ChronosCard variant="glass-metal" className="h-full">
                <div className="space-y-4">
                  {/* Header con nombre y status */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-chronos-white mb-1">
                        {cliente.nombre}
                      </h3>
                      {cliente.razonSocial && (
                        <p className="text-sm text-chronos-silver">{cliente.razonSocial}</p>
                      )}
                    </div>
                    <div>
                      {cliente.activo ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-neon-green/20 text-neon-green text-xs">
                          <CheckCircle className="w-3 h-3" />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-chronos-smoke/20 text-chronos-silver text-xs">
                          Inactivo
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Información de contacto */}
                  <div className="space-y-2">
                    {cliente.telefono && (
                      <div className="flex items-center gap-2 text-sm text-chronos-silver">
                        <Phone className="w-4 h-4 text-neon-cyan" />
                        {cliente.telefono}
                      </div>
                    )}
                    {cliente.email && (
                      <div className="flex items-center gap-2 text-sm text-chronos-silver">
                        <Mail className="w-4 h-4 text-neon-purple" />
                        {cliente.email}
                      </div>
                    )}
                    {cliente.direccion && (
                      <div className="flex items-center gap-2 text-sm text-chronos-silver">
                        <MapPin className="w-4 h-4 text-neon-pink" />
                        {cliente.direccion}
                      </div>
                    )}
                  </div>

                  {/* Adeudo */}
                  <div
                    className={`p-4 rounded-lg border-2 ${
                      (cliente.adeudo || 0) > 0
                        ? 'bg-neon-red/10 border-neon-red/30'
                        : 'bg-neon-green/10 border-neon-green/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-chronos-silver">Adeudo Total</span>
                      <span
                        className={`text-2xl font-bold ${
                          (cliente.adeudo || 0) > 0 ? 'text-neon-red' : 'text-neon-green'
                        }`}
                      >
                        ${(cliente.adeudo || 0).toLocaleString()}
                      </span>
                    </div>
                    {cliente.limiteCredito && (
                      <div className="mt-2 pt-2 border-t border-chronos-smoke/20">
                        <div className="flex justify-between text-xs text-chronos-silver">
                          <span>Límite de Crédito</span>
                          <span>${cliente.limiteCredito.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2">
                    {(cliente.adeudo || 0) > 0 && (
                      <button
                        onClick={() => handleAbonoClick(cliente)}
                        className="flex-1 px-4 py-2 bg-neon-green hover:bg-neon-green/80 text-chronos-void rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        Registrar Abono
                      </button>
                    )}
                    <button className="px-4 py-2 bg-chronos-graphite hover:bg-chronos-smoke rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-neon-cyan" />
                    </button>
                    <button className="px-4 py-2 bg-chronos-graphite hover:bg-chronos-smoke rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-neon-purple" />
                    </button>
                  </div>
                </div>
              </ChronosCard>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal: Nuevo Cliente */}
      <AnimatePresence>
        {showForm && (
          <FormClienteSimple onClose={() => setShowForm(false)} onSave={handleCrearCliente} />
        )}
      </AnimatePresence>

      {/* Modal: Registrar Abono */}
      <AnimatePresence>
        {showAbonoModal && selectedCliente && (
          <AbonoModal
            cliente={selectedCliente}
            bancos={bancos}
            onClose={() => {
              setShowAbonoModal(false);
              setSelectedCliente(null);
            }}
            onSave={handleRegistrarAbono}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Modal para registrar abono
 */
interface AbonoModalProps {
  cliente: Cliente;
  bancos: Banco[];
  onClose: () => void;
  onSave: (cliente: Cliente, monto: number, bancoId: string, notas: string) => Promise<void>;
}

function AbonoModal({ cliente, bancos, onClose, onSave }: AbonoModalProps) {
  const [monto, setMonto] = useState(0);
  const [bancoId, setBancoId] = useState<BancoId>(bancos[0]?.id || 'BM');
  const [notas, setNotas] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nuevoAdeudo = Math.max(0, (cliente.adeudo || 0) - monto);

  const handleSubmit = async () => {
    if (monto <= 0 || monto > (cliente.adeudo || 0)) {
      alert('Monto inválido');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(cliente, monto, bancoId, notas);
      onClose();
    } catch (error) {
      console.error('Error al registrar abono:', error);
      alert('Error al registrar abono. Intenta nuevamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-chronos-void/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-chronos-charcoal border border-chronos-smoke rounded-2xl max-w-lg w-full"
      >
        <div className="p-6 border-b border-chronos-smoke">
          <h2 className="text-2xl font-bold text-chronos-white">Registrar Abono</h2>
          <p className="text-chronos-silver mt-1">{cliente.nombre}</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Adeudo actual */}
          <div className="p-4 bg-neon-red/10 border border-neon-red/30 rounded-lg">
            <div className="text-sm text-chronos-silver mb-1">Adeudo Actual</div>
            <div className="text-3xl font-bold text-neon-red">
              ${(cliente.adeudo || 0).toLocaleString()}
            </div>
          </div>

          {/* Monto del abono */}
          <div>
            <label className="block text-chronos-white font-medium mb-2">Monto del Abono *</label>
            <input
              type="number"
              value={monto || ''}
              onChange={(e) => setMonto(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white text-xl"
              placeholder="$0.00"
              autoFocus
            />
          </div>

          {/* Banco */}
          <div>
            <label className="block text-chronos-white font-medium mb-2">Banco de Ingreso</label>
            <select
              value={bancoId}
              onChange={(e) => setBancoId(e.target.value as BancoId)}
              className="w-full px-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white"
            >
              {bancos.map((banco) => (
                <option key={banco.id} value={banco.id}>
                  {banco.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-chronos-white font-medium mb-2">Notas</label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="w-full px-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white resize-none"
              rows={3}
              placeholder="Observaciones opcionales..."
            />
          </div>

          {/* Nuevo adeudo */}
          {monto > 0 && (
            <div
              className={`p-4 rounded-lg border-2 ${
                nuevoAdeudo <= 0
                  ? 'bg-neon-green/10 border-neon-green/30'
                  : 'bg-neon-yellow/10 border-neon-yellow/30'
              }`}
            >
              <div className="text-sm text-chronos-silver mb-1">Nuevo Adeudo</div>
              <div
                className={`text-3xl font-bold ${
                  nuevoAdeudo <= 0 ? 'text-neon-green' : 'text-neon-yellow'
                }`}
              >
                ${Math.max(0, nuevoAdeudo).toLocaleString()}
              </div>
              {nuevoAdeudo <= 0 && (
                <div className="mt-2 text-sm text-neon-green flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Cliente queda al corriente
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-chronos-smoke flex justify-end gap-3">
          <ChronosButton variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </ChronosButton>
          <ChronosButton
            variant="primary"
            disabled={monto <= 0 || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-chronos-white/30 border-t-chronos-white rounded-full animate-spin" />
                Procesando...
              </div>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Registrar Abono
              </>
            )}
          </ChronosButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
