import { useMemo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRightLeft,
  Calendar,
  CheckCircle,
  DollarSign,
  Plus,
  Search,
  Tag,
  TrendingDown,
  Wallet,
} from 'lucide-react';

import { ChronosButton } from '@/components/chronos-ui/ChronosButton';
import { ChronosCard } from '@/components/chronos-ui/ChronosCard';
import { ChronosKPI } from '@/components/chronos-ui/ChronosKPI';
import { useChronosData } from '@/hooks/useChronosData';
import type { BancoId } from '@/types';

/**
 * 💰 GASTOS VIEW
 * Gestión de gastos, abonos y transferencias bancarias
 */
export default function GastosView() {
  const { gastos, bancos } = useChronosData();

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<'all' | 'gasto' | 'abono' | 'transferencia'>('all');
  const [dateRange, setDateRange] = useState<'hoy' | 'semana' | 'mes' | 'todo'>('mes');

  // Calcular fecha de inicio según rango
  const getFechaInicio = () => {
    const now = new Date();
    switch (dateRange) {
      case 'hoy':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      case 'semana':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'mes':
        return new Date(now.getFullYear(), now.getMonth(), 1);
      default:
        return new Date(0);
    }
  };

  // KPIs calculados
  const kpis = useMemo(() => {
    const fechaInicio = getFechaInicio();
    const gastosFiltrados = gastos.filter((g) => {
      const fecha = typeof g.fecha === 'string' ? new Date(g.fecha) : g.fecha;
      return fecha >= fechaInicio;
    });

    const totalGastos = gastosFiltrados
      .filter((g) => g.tipo === 'gasto')
      .reduce((sum, g) => sum + g.monto, 0);

    const totalAbonos = gastosFiltrados
      .filter((g) => g.tipo === 'abono')
      .reduce((sum, g) => sum + g.monto, 0);

    const totalTransferencias = gastosFiltrados
      .filter((g) => g.tipo === 'transferencia')
      .reduce((sum, g) => sum + g.monto, 0);

    const numeroOperaciones = gastosFiltrados.length;

    return {
      totalGastos,
      totalAbonos,
      totalTransferencias,
      numeroOperaciones,
    };
  }, [gastos, dateRange]);

  // Filtrar gastos
  const gastosFiltrados = useMemo(() => {
    const fechaInicio = getFechaInicio();

    return gastos
      .filter((gasto) => {
        const fecha = typeof gasto.fecha === 'string' ? new Date(gasto.fecha) : gasto.fecha;
        const dentroRango = fecha >= fechaInicio;

        const matchesSearch =
          gasto.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
          gasto.categoria?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTipo = filterTipo === 'all' || gasto.tipo === filterTipo;

        return dentroRango && matchesSearch && matchesTipo;
      })
      .sort((a, b) => {
        const fechaA = typeof a.fecha === 'string' ? new Date(a.fecha) : a.fecha;
        const fechaB = typeof b.fecha === 'string' ? new Date(b.fecha) : b.fecha;
        return fechaB.getTime() - fechaA.getTime();
      });
  }, [gastos, searchTerm, filterTipo, dateRange]);

  const getTipoBadge = (tipo: string) => {
    const badges = {
      Gasto: { bg: 'bg-neon-red/20', text: 'text-neon-red', icon: TrendingDown },
      Abono: { bg: 'bg-neon-green/20', text: 'text-neon-green', icon: DollarSign },
      Transferencia: { bg: 'bg-neon-cyan/20', text: 'text-neon-cyan', icon: ArrowRightLeft },
    };

    const config = badges[tipo as keyof typeof badges] || badges['Gasto'];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${config.bg} ${config.text} text-sm font-medium`}
      >
        <Icon className="w-4 h-4" />
        {tipo}
      </span>
    );
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
            <Wallet className="w-10 h-10 text-neon-pink" />
            Gestión de Gastos
          </h1>
          <p className="text-chronos-silver mt-2 text-lg">
            Control de gastos, abonos y transferencias
          </p>
        </div>
        <ChronosButton variant="primary" size="lg" onClick={() => setShowForm(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Nueva Operación
        </ChronosButton>
      </motion.div>

      {/* Date Range Selector */}
      <div className="flex justify-end gap-2">
        {(['hoy', 'semana', 'mes', 'todo'] as const).map((rango) => (
          <button
            key={rango}
            onClick={() => setDateRange(rango)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              dateRange === rango
                ? 'bg-neon-purple text-chronos-void'
                : 'bg-chronos-graphite text-chronos-silver hover:bg-chronos-smoke'
            }`}
          >
            {rango.charAt(0).toUpperCase() + rango.slice(1)}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ChronosKPI label="Total Gastos" value={kpis.totalGastos} format="currency" color="red" />
        <ChronosKPI label="Total Abonos" value={kpis.totalAbonos} format="currency" color="green" />
        <ChronosKPI
          label="Transferencias"
          value={kpis.totalTransferencias}
          format="currency"
          color="cyan"
        />
        <ChronosKPI
          label="N° Operaciones"
          value={kpis.numeroOperaciones}
          format="number"
          color="purple"
          pulse
        />
      </div>

      {/* Filters */}
      <ChronosCard variant="glass">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-chronos-silver" />
            <input
              type="text"
              placeholder="Buscar por concepto o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white placeholder-chronos-silver focus:outline-none focus:border-neon-cyan transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterTipo('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterTipo === 'all'
                  ? 'bg-neon-purple text-chronos-void'
                  : 'bg-chronos-graphite text-chronos-silver hover:bg-chronos-smoke'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterTipo('gasto')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterTipo === 'gasto'
                  ? 'bg-neon-red text-chronos-void'
                  : 'bg-chronos-graphite text-chronos-silver hover:bg-chronos-smoke'
              }`}
            >
              Gastos
            </button>
            <button
              onClick={() => setFilterTipo('abono')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterTipo === 'abono'
                  ? 'bg-neon-green text-chronos-void'
                  : 'bg-chronos-graphite text-chronos-silver hover:bg-chronos-smoke'
              }`}
            >
              Abonos
            </button>
            <button
              onClick={() => setFilterTipo('transferencia')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterTipo === 'transferencia'
                  ? 'bg-neon-cyan text-chronos-void'
                  : 'bg-chronos-graphite text-chronos-silver hover:bg-chronos-smoke'
              }`}
            >
              Transferencias
            </button>
          </div>
        </div>
      </ChronosCard>

      {/* Tabla de Gastos */}
      <ChronosCard variant="glass-metal">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-chronos-smoke">
                <th className="text-left p-4 text-chronos-white font-medium">Fecha</th>
                <th className="text-left p-4 text-chronos-white font-medium">Concepto</th>
                <th className="text-left p-4 text-chronos-white font-medium">Categoría</th>
                <th className="text-left p-4 text-chronos-white font-medium">Tipo</th>
                <th className="text-left p-4 text-chronos-white font-medium">Banco</th>
                <th className="text-right p-4 text-chronos-white font-medium">Monto</th>
              </tr>
            </thead>
            <tbody>
              {gastosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <Wallet className="w-12 h-12 text-chronos-silver mx-auto mb-3" />
                    <p className="text-chronos-silver">No se encontraron operaciones</p>
                  </td>
                </tr>
              ) : (
                gastosFiltrados.map((gasto) => {
                  const banco = bancos.find((b) => b.id === gasto.bancoOrigen);
                  const fecha =
                    typeof gasto.fecha === 'string' ? new Date(gasto.fecha) : gasto.fecha;

                  return (
                    <motion.tr
                      key={gasto.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-chronos-smoke/30 hover:bg-chronos-graphite/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-chronos-silver">
                          <Calendar className="w-4 h-4" />
                          {fecha.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-chronos-white font-medium">{gasto.concepto}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-neon-purple" />
                          <span className="text-chronos-silver">
                            {gasto.categoria || 'Sin categoría'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">{getTipoBadge(gasto.tipo)}</td>
                      <td className="p-4">
                        <span className="text-chronos-white">{banco?.nombre || 'N/A'}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span
                          className={`text-lg font-bold ${
                            gasto.tipo === 'gasto' ? 'text-neon-red' : 'text-neon-green'
                          }`}
                        >
                          {gasto.tipo === 'gasto' ? '-' : '+'}${gasto.monto.toLocaleString()}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </ChronosCard>

      {/* Modal Nueva Operación */}
      <AnimatePresence>
        {showForm && <GastoFormModal onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  );
}

/**
 * Modal para crear nueva operación
 */
function GastoFormModal({ onClose }: { onClose: () => void }) {
  const { bancos } = useChronosData();
  const [formData, setFormData] = useState({
    tipo: 'Gasto' as 'Gasto' | 'Abono' | 'Transferencia',
    concepto: '',
    categoria: '',
    monto: 0,
    bancoId: (bancos[0]?.id.toString() as BancoId) || 'BM',
    bancoDestinoId: (bancos[0]?.id.toString() as BancoId) || 'BM',
  });

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
        className="bg-chronos-charcoal border border-chronos-smoke rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-chronos-smoke">
          <h2 className="text-2xl font-bold text-chronos-white">Nueva Operación</h2>
        </div>

        <div className="p-6 space-y-4">
          {/* Tipo de Operación */}
          <div>
            <label className="block text-chronos-white font-medium mb-2">Tipo de Operación *</label>
            <div className="grid grid-cols-3 gap-3">
              {(['Gasto', 'Abono', 'Transferencia'] as const).map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setFormData({ ...formData, tipo })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.tipo === tipo
                      ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                      : 'border-chronos-smoke bg-chronos-obsidian text-chronos-silver hover:border-chronos-silver'
                  }`}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>

          {/* Concepto */}
          <div>
            <label className="block text-chronos-white font-medium mb-2">Concepto *</label>
            <input
              type="text"
              value={formData.concepto}
              onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
              className="w-full px-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white"
              placeholder="Descripción de la operación"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-chronos-white font-medium mb-2">Categoría</label>
            <input
              type="text"
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              className="w-full px-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white"
              placeholder="Ej: Servicios, Nómina, Renta..."
            />
          </div>

          {/* Monto */}
          <div>
            <label className="block text-chronos-white font-medium mb-2">Monto *</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-chronos-silver" />
              <input
                type="number"
                value={formData.monto || ''}
                onChange={(e) => setFormData({ ...formData, monto: Number(e.target.value) })}
                className="w-full pl-10 pr-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Banco Origen */}
          <div>
            <label className="block text-chronos-white font-medium mb-2">
              {formData.tipo === 'Transferencia' ? 'Banco Origen *' : 'Banco *'}
            </label>
            <select
              value={formData.bancoId}
              onChange={(e) => setFormData({ ...formData, bancoId: e.target.value as BancoId })}
              className="w-full px-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white"
            >
              {bancos.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Banco Destino (solo para Transferencia) */}
          {formData.tipo === 'Transferencia' && (
            <div>
              <label className="block text-chronos-white font-medium mb-2">Banco Destino *</label>
              <select
                value={formData.bancoDestinoId}
                onChange={(e) =>
                  setFormData({ ...formData, bancoDestinoId: e.target.value as BancoId })
                }
                className="w-full px-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white"
              >
                {bancos.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-chronos-smoke flex justify-end gap-3">
          <ChronosButton variant="ghost" onClick={onClose}>
            Cancelar
          </ChronosButton>
          <ChronosButton variant="primary">
            <CheckCircle className="w-4 h-4 mr-2" />
            Registrar Operación
          </ChronosButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
