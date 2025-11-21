import { useMemo, useState } from 'react';

import { collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  DollarSign,
  Edit,
  Eye,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash2,
  Truck,
} from 'lucide-react';

import { ChronosButton } from '@/components/chronos-ui/ChronosButton';
import { ChronosCard } from '@/components/chronos-ui/ChronosCard';
import { ChronosKPI } from '@/components/chronos-ui/ChronosKPI';
import FormDistribuidorSimple from '@/components/forms/FormDistribuidorSimple';
import { useChronosData } from '@/hooks/useChronosData';
import { db } from '@/lib/firebase';
import type { Banco, BancoId, Distribuidor } from '@/types';

/**
 * 🚚 DISTRIBUIDORES VIEW
 * Gestión completa de proveedores y control de adeudos
 */
export default function DistribuidoresView() {
  const { distribuidores, ordenesCompra, bancos } = useChronosData();

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'conAdeudo' | 'alDia'>('all');
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [selectedDistribuidor, setSelectedDistribuidor] = useState<Distribuidor | null>(null);

  /**
   * Handler: Crear nuevo distribuidor
   */
  const handleCrearDistribuidor = async (nombre: string) => {
    try {
      const nuevoDistribuidor = {
        nombre,
        razonSocial: '',
        rfc: '',
        telefono: '',
        email: '',
        direccion: '',
        ciudad: '',
        estado: '',
        codigoPostal: '',
        adeudo: 0,
        activo: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const distribuidorRef = doc(collection(db, 'distribuidores'));
      await setDoc(distribuidorRef, nuevoDistribuidor);

      console.log('✅ Distribuidor creado:', nombre);
      setShowForm(false);
    } catch (error) {
      console.error('❌ Error al crear distribuidor:', error);
      throw error;
    }
  };

  /**
   * Handler: Pagar adeudo a distribuidor
   * Flujo: Actualiza distribuidor → Decrementa banco → Registra pago en movimientos
   */
  const handlePagarDistribuidor = async (
    distribuidor: Distribuidor,
    monto: number,
    bancoId: string,
    notas: string
  ) => {
    try {
      // 1. Validar fondos suficientes
      const banco = bancos.find((b) => b.id === bancoId);
      if (!banco) {
        throw new Error('Banco no encontrado');
      }
      if (banco.capitalActual < monto) {
        throw new Error('Fondos insuficientes en el banco seleccionado');
      }

      // 2. Actualizar adeudo del distribuidor
      const distribuidorRef = doc(db, 'distribuidores', distribuidor.id);
      const nuevoAdeudo = Math.max(0, (distribuidor.adeudo || 0) - monto);
      await updateDoc(distribuidorRef, {
        adeudo: nuevoAdeudo,
        updatedAt: serverTimestamp(),
      });

      // 3. Decrementar capital del banco origen
      const bancoRef = doc(db, 'bancos', bancoId);
      await updateDoc(bancoRef, {
        capitalActual: banco.capitalActual - monto,
        updatedAt: serverTimestamp(),
      });

      // 4. Registrar pago en histórico de movimientos
      const movimientoRef = doc(collection(db, 'movimientos'));
      await setDoc(movimientoRef, {
        tipo: 'egreso',
        concepto: `Pago a ${distribuidor.nombre}`,
        monto,
        bancoId,
        distribuidorId: distribuidor.id,
        fecha: serverTimestamp(),
        notas,
        createdAt: serverTimestamp(),
      });

      console.log('✅ Pago registrado');
      setShowPagoModal(false);
      setSelectedDistribuidor(null);
    } catch (error) {
      console.error('❌ Error al registrar pago:', error);
      throw error;
    }
  };

  /**
   * Handler: Click en "Pagar Deuda"
   */
  const handlePagoClick = (distribuidor: Distribuidor) => {
    setSelectedDistribuidor(distribuidor);
    setShowPagoModal(true);
  };

  // KPIs calculados
  const kpis = useMemo(() => {
    const distribuidoresActivos = distribuidores.filter((d) => d.activo).length;
    const totalAdeudos = distribuidores.reduce((sum, d) => sum + (d.adeudo || 0), 0);
    const conAdeudo = distribuidores.filter((d) => (d.adeudo || 0) > 0).length;

    // Calcular órdenes pendientes
    const ordenesPendientes = ordenesCompra.filter(
      (o) => o.estatus === 'Pendiente' || o.estatus === 'Parcial'
    ).length;

    return {
      distribuidoresActivos,
      totalAdeudos,
      conAdeudo,
      ordenesPendientes,
    };
  }, [distribuidores, ordenesCompra]);

  // Filtrar distribuidores
  const distribuidoresFiltrados = useMemo(() => {
    return distribuidores.filter((dist) => {
      const matchesSearch =
        dist.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dist.razonSocial?.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesStatus = true;
      if (filterStatus === 'conAdeudo') matchesStatus = (dist.adeudo || 0) > 0;
      if (filterStatus === 'alDia') matchesStatus = (dist.adeudo || 0) === 0;

      return matchesSearch && matchesStatus;
    });
  }, [distribuidores, searchTerm, filterStatus]);

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
            <Truck className="w-10 h-10 text-neon-cyan" />
            Gestión de Distribuidores
          </h1>
          <p className="text-chronos-silver mt-2 text-lg">Control de proveedores y adeudos</p>
        </div>
        <ChronosButton variant="primary" size="lg" onClick={() => setShowForm(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Distribuidor
        </ChronosButton>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ChronosKPI
          label="Distribuidores Activos"
          value={kpis.distribuidoresActivos}
          format="number"
          color="cyan"
          pulse
        />
        <ChronosKPI label="Total Adeudos" value={kpis.totalAdeudos} format="currency" color="red" />
        <ChronosKPI label="Con Adeudo" value={kpis.conAdeudo} format="number" color="yellow" />
        <ChronosKPI
          label="Órdenes Pendientes"
          value={kpis.ordenesPendientes}
          format="number"
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
              placeholder="Buscar por nombre o razón social..."
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

      {/* Grid de Distribuidores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {distribuidoresFiltrados.length === 0 ? (
          <div className="col-span-full">
            <ChronosCard variant="glass-metal">
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-chronos-silver mx-auto mb-4" />
                <p className="text-chronos-silver text-lg">No se encontraron distribuidores</p>
              </div>
            </ChronosCard>
          </div>
        ) : (
          distribuidoresFiltrados.map((dist) => (
            <motion.div
              key={dist.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
            >
              <ChronosCard variant="glass-metal" className="h-full">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-chronos-white mb-1">{dist.nombre}</h3>
                      {dist.razonSocial && (
                        <p className="text-sm text-chronos-silver">{dist.razonSocial}</p>
                      )}
                    </div>
                    <div>
                      {dist.activo ? (
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

                  {/* Contacto */}
                  <div className="space-y-2">
                    {dist.telefono && (
                      <div className="flex items-center gap-2 text-sm text-chronos-silver">
                        <Phone className="w-4 h-4 text-neon-cyan" />
                        {dist.telefono}
                      </div>
                    )}
                    {dist.email && (
                      <div className="flex items-center gap-2 text-sm text-chronos-silver">
                        <Mail className="w-4 h-4 text-neon-purple" />
                        {dist.email}
                      </div>
                    )}
                    {dist.direccion && (
                      <div className="flex items-center gap-2 text-sm text-chronos-silver">
                        <MapPin className="w-4 h-4 text-neon-pink" />
                        {dist.direccion}
                      </div>
                    )}
                  </div>

                  {/* Adeudo */}
                  <div
                    className={`p-4 rounded-lg border-2 ${
                      (dist.adeudo || 0) > 0
                        ? 'bg-neon-red/10 border-neon-red/30'
                        : 'bg-neon-green/10 border-neon-green/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-chronos-silver">Adeudo</span>
                      <span
                        className={`text-2xl font-bold ${
                          (dist.adeudo || 0) > 0 ? 'text-neon-red' : 'text-neon-green'
                        }`}
                      >
                        ${(dist.adeudo || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2">
                    {(dist.adeudo || 0) > 0 && (
                      <button
                        onClick={() => handlePagoClick(dist)}
                        className="flex-1 px-4 py-2 bg-neon-yellow hover:bg-neon-yellow/80 text-chronos-void rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <DollarSign className="w-4 h-4" />
                        Pagar Deuda
                      </button>
                    )}
                    <button className="flex-1 px-4 py-2 bg-chronos-graphite hover:bg-chronos-smoke rounded-lg transition-colors flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4 text-neon-cyan" />
                      Ver
                    </button>
                    <button className="px-4 py-2 bg-chronos-graphite hover:bg-chronos-smoke rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-neon-purple" />
                    </button>
                    <button className="px-4 py-2 bg-chronos-graphite hover:bg-chronos-smoke rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-neon-red" />
                    </button>
                  </div>
                </div>
              </ChronosCard>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal Nuevo Distribuidor */}
      <AnimatePresence>
        {showForm && (
          <FormDistribuidorSimple
            onClose={() => setShowForm(false)}
            onSave={handleCrearDistribuidor}
          />
        )}
      </AnimatePresence>

      {/* Modal Pagar Distribuidor */}
      <AnimatePresence>
        {showPagoModal && selectedDistribuidor && (
          <PagoDistribuidorModal
            distribuidor={selectedDistribuidor}
            bancos={bancos}
            onClose={() => {
              setShowPagoModal(false);
              setSelectedDistribuidor(null);
            }}
            onSave={handlePagarDistribuidor}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Modal para pagar adeudo a distribuidor
 */
interface PagoDistribuidorModalProps {
  distribuidor: Distribuidor;
  bancos: Banco[];
  onClose: () => void;
  onSave: (
    distribuidor: Distribuidor,
    monto: number,
    bancoId: string,
    notas: string
  ) => Promise<void>;
}

function PagoDistribuidorModal({
  distribuidor,
  bancos,
  onClose,
  onSave,
}: PagoDistribuidorModalProps) {
  const [monto, setMonto] = useState(0);
  const [bancoId, setBancoId] = useState<BancoId>(bancos[0]?.id || 'BM');
  const [notas, setNotas] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nuevoAdeudo = Math.max(0, (distribuidor.adeudo || 0) - monto);
  const bancoSeleccionado = bancos.find((b) => b.id === bancoId);
  const fondosSuficientes = bancoSeleccionado && bancoSeleccionado.capitalActual >= monto;

  const handleSubmit = async () => {
    // Validaciones
    if (monto <= 0 || monto > (distribuidor.adeudo || 0)) {
      alert('Monto inválido. Debe ser mayor a 0 y no exceder el adeudo.');
      return;
    }

    if (!fondosSuficientes) {
      alert('Fondos insuficientes en el banco seleccionado.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(distribuidor, monto, bancoId, notas);
      onClose();
    } catch (error) {
      console.error('Error al registrar pago:', error);
      alert('Error al registrar pago. Intenta nuevamente.');
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
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-chronos-charcoal border border-chronos-smoke rounded-2xl max-w-lg w-full"
      >
        {/* Header */}
        <div className="p-6 border-b border-chronos-smoke bg-gradient-to-r from-neon-yellow/10 to-neon-red/10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-neon-yellow/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-neon-yellow" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-chronos-white">Pagar a Distribuidor</h2>
              <p className="text-chronos-silver">{distribuidor.nombre}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Adeudo Actual */}
          <div className="p-4 rounded-lg bg-neon-red/10 border-2 border-neon-red/30">
            <div className="flex items-center justify-between">
              <span className="text-chronos-silver">Adeudo Actual</span>
              <span className="text-3xl font-bold text-neon-red">
                ${(distribuidor.adeudo || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Monto a Pagar */}
          <div>
            <label className="block text-chronos-white font-medium mb-2">Monto a Pagar</label>
            <input
              type="number"
              value={monto || ''}
              onChange={(e) => setMonto(Number(e.target.value))}
              placeholder="0.00"
              className="w-full px-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white text-2xl font-bold focus:outline-none focus:border-neon-yellow transition-colors"
              disabled={isSubmitting}
            />
          </div>

          {/* Nuevo Adeudo */}
          {monto > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border-2 ${
                nuevoAdeudo === 0
                  ? 'bg-neon-green/10 border-neon-green/30'
                  : 'bg-neon-yellow/10 border-neon-yellow/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-chronos-silver">Nuevo Adeudo</span>
                <span
                  className={`text-2xl font-bold ${
                    nuevoAdeudo === 0 ? 'text-neon-green' : 'text-neon-yellow'
                  }`}
                >
                  ${nuevoAdeudo.toLocaleString()}
                </span>
              </div>
              {nuevoAdeudo === 0 && (
                <div className="mt-2 flex items-center gap-2 text-neon-green">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Distribuidor queda al corriente</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Banco Origen */}
          <div>
            <label className="block text-chronos-white font-medium mb-2">
              Banco Origen (Pagar desde)
            </label>
            <select
              value={bancoId}
              onChange={(e) => setBancoId(e.target.value as BancoId)}
              className="w-full px-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white focus:outline-none focus:border-neon-cyan transition-colors"
              disabled={isSubmitting}
            >
              {bancos
                .filter((b) => b.activo)
                .map((banco) => (
                  <option key={banco.id} value={banco.id}>
                    {banco.nombre} - ${banco.capitalActual.toLocaleString()}
                  </option>
                ))}
            </select>
            {monto > 0 && !fondosSuficientes && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 flex items-center gap-2 text-neon-red text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Fondos insuficientes en este banco</span>
              </motion.div>
            )}
          </div>

          {/* Notas */}
          <div>
            <label className="block text-chronos-white font-medium mb-2">Notas (Opcional)</label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Agregar observaciones..."
              rows={3}
              className="w-full px-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white placeholder-chronos-silver focus:outline-none focus:border-neon-cyan transition-colors resize-none"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-chronos-smoke flex justify-end gap-3">
          <ChronosButton variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </ChronosButton>
          <ChronosButton
            variant="primary"
            onClick={handleSubmit}
            disabled={
              isSubmitting || monto <= 0 || monto > (distribuidor.adeudo || 0) || !fondosSuficientes
            }
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-chronos-white/30 border-t-chronos-white rounded-full animate-spin" />
                Procesando...
              </div>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Registrar Pago
              </>
            )}
          </ChronosButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
