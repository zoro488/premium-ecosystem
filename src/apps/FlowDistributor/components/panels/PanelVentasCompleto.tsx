/**
 * 💰 PANEL VENTAS COMPLETO - Basado en datos del Excel
 * Sistema de gestión de ventas con tablas completas y forms intuitivos
 * @version 2.0.0 - Sin 3D, Solo Tablas y Forms
 */
import { useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Filter,
  Package,
  Plus,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';

import { useFlowStore } from '@/stores/flowStore';

import { Column, DataTable, renderCurrency, renderDate, renderStatus } from '../tables/DataTable';
import { FormVenta } from '../forms/FormVenta';
import { FormAbono } from '../forms/FormAbono';

export const PanelVentasCompleto = () => {
  const { ventas } = useFlowStore();
  const [filtroEstatus, setFiltroEstatus] = useState<'todos' | 'Pagado' | 'Pendiente'>('todos');
  const [showFormVenta, setShowFormVenta] = useState(false);
  const [showFormAbono, setShowFormAbono] = useState(false);

  // 📊 Cálculo de estadísticas
  const stats = useMemo(() => {
    const total = ventas.length;
    const pagadas = ventas.filter((v) => v.estatus === 'Pagado').length;
    const pendientes = ventas.filter((v) => v.estatus === 'Pendiente').length;

    const totalVentas = ventas.reduce((acc, v) => acc + (v.totalVenta || 0), 0);
    const totalFletes = ventas.reduce((acc, v) => acc + (v.totalFletes || 0), 0);
    const totalUtilidades = ventas.reduce((acc, v) => acc + (v.totalUtilidades || 0), 0);
    const totalPendiente = ventas
      .filter((v) => v.estatus === 'Pendiente')
      .reduce((acc, v) => acc + (v.totalVenta || 0), 0);

    return {
      total,
      pagadas,
      pendientes,
      totalVentas,
      totalFletes,
      totalUtilidades,
      totalPendiente,
    };
  }, [ventas]);

  // 🔍 Filtrar ventas
  const ventasFiltradas = useMemo(() => {
    if (filtroEstatus === 'todos') return ventas;
    return ventas.filter((v) => v.estatus === filtroEstatus);
  }, [ventas, filtroEstatus]);

  // 📋 Definición de columnas de la tabla
  const columns: Column<any>[] = [
    {
      key: 'id',
      label: 'ID',
      width: '180px',
      render: (value) => <span className="font-mono text-xs text-zinc-300">{value}</span>,
    },
    {
      key: 'fecha',
      label: 'Fecha',
      width: '120px',
      render: renderDate,
    },
    {
      key: 'cliente',
      label: 'Cliente',
      width: '150px',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-zinc-300" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'cantidad',
      label: 'Cantidad',
      width: '100px',
      align: 'center',
      render: (value) => (
        <div className="flex items-center gap-2 justify-center">
          <Package className="w-4 h-4 text-zinc-800" />
          <span className="font-bold">{value}</span>
        </div>
      ),
    },
    {
      key: 'totalVenta',
      label: 'Total Venta',
      width: '120px',
      align: 'right',
      render: (value) => <span className="font-bold text-zinc-200">{renderCurrency(value)}</span>,
    },
    {
      key: 'totalFletes',
      label: 'Fletes',
      width: '100px',
      align: 'right',
      render: renderCurrency,
    },
    {
      key: 'totalUtilidades',
      label: 'Utilidades',
      width: '110px',
      align: 'right',
      render: (value) => <span className="font-bold text-zinc-300">{renderCurrency(value)}</span>,
    },
    {
      key: 'estatus',
      label: 'Estatus',
      width: '110px',
      align: 'center',
      render: renderStatus,
    },
    {
      key: 'destino',
      label: 'Destino',
      width: '140px',
      render: (value) => {
        const nombres: Record<string, string> = {
          bovedaMonte: 'Bóveda Monte',
          bovedaUsa: 'Bóveda USA',
          azteca: 'Banco Azteca',
          utilidades: 'Utilidades',
          fleteSur: 'Flete Sur',
          leftie: 'Leftie',
          profit: 'Profit',
        };
        return (
          <span className="text-xs px-2 py-1 rounded-md bg-zinc-800/20 text-zinc-300">
            {nombres[value] || value}
          </span>
        );
      },
    },
    {
      key: 'aplicaFlete',
      label: 'Flete',
      width: '80px',
      align: 'center',
      render: (value) =>
        value ? (
          <CheckCircle className="w-5 h-5 text-zinc-200 mx-auto" />
        ) : (
          <span className="text-white/40">-</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header con KPIs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-br from-zinc-800/10 via-zinc-700/5 to-zinc-800/10 border border-zinc-800/20 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-zinc-800" />
              Gestión de Ventas
            </h1>
            <p className="text-white/60">Sistema completo de ventas con datos del Excel</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFormAbono(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg shadow-green-500/50 transition-all flex items-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              Registrar Abono
            </button>
            <button
              onClick={() => setShowFormVenta(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-800 hover:to-zinc-700 text-white font-semibold shadow-lg shadow-zinc-800/50 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nueva Venta
            </button>
          </div>
        </div>

        {/* Grid de métricas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="w-4 h-4 text-white/60" />
              <p className="text-white/60 text-xs">Total Ventas</p>
            </div>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>

          <div className="backdrop-blur-md bg-zinc-9000/10 border border-zinc-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-zinc-200" />
              <p className="text-zinc-200/80 text-xs">Pagadas</p>
            </div>
            <p className="text-2xl font-bold text-zinc-200">{stats.pagadas}</p>
          </div>

          <div className="backdrop-blur-md bg-zinc-9000/10 border border-zinc-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-zinc-200" />
              <p className="text-zinc-200/80 text-xs">Pendientes</p>
            </div>
            <p className="text-2xl font-bold text-zinc-200">{stats.pendientes}</p>
          </div>

          <div className="backdrop-blur-md bg-zinc-9000/10 border border-zinc-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-zinc-300" />
              <p className="text-zinc-300/80 text-xs">Total Ventas</p>
            </div>
            <p className="text-lg font-bold text-zinc-300">{renderCurrency(stats.totalVentas)}</p>
          </div>

          <div className="backdrop-blur-md bg-zinc-800/10 border border-zinc-800/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-zinc-800" />
              <p className="text-zinc-800/80 text-xs">Utilidades</p>
            </div>
            <p className="text-lg font-bold text-zinc-800">
              {renderCurrency(stats.totalUtilidades)}
            </p>
          </div>

          <div className="backdrop-blur-md bg-zinc-9000/10 border border-zinc-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-zinc-200" />
              <p className="text-zinc-200/80 text-xs">Pendiente</p>
            </div>
            <p className="text-lg font-bold text-zinc-200">
              {renderCurrency(stats.totalPendiente)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4"
      >
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-white/60" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFiltroEstatus('todos')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filtroEstatus === 'todos'
                  ? 'bg-zinc-9000 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Todas ({stats.total})
            </button>
            <button
              onClick={() => setFiltroEstatus('Pagado')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filtroEstatus === 'Pagado'
                  ? 'bg-zinc-9000 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Pagadas ({stats.pagadas})
            </button>
            <button
              onClick={() => setFiltroEstatus('Pendiente')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filtroEstatus === 'Pendiente'
                  ? 'bg-zinc-9000 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Pendientes ({stats.pendientes})
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tabla de ventas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DataTable
          data={ventasFiltradas}
          columns={columns}
          title="Listado de Ventas"
          searchable
          exportable
          itemsPerPage={15}
          onRowClick={(venta) => {
            console.log('Venta seleccionada:', venta);
            // Aquí puedes abrir un modal con detalles
          }}
        />
      </motion.div>

      {/* Formularios */}
      {showFormVenta && (
        <FormVenta
          onClose={() => setShowFormVenta(false)}
          onSuccess={(id) => {
            console.log('Venta creada:', id);
            setShowFormVenta(false);
            // Datos se actualizan automáticamente vía Zustand
          }}
        />
      )}

      {showFormAbono && (
        <FormAbono
          onClose={() => setShowFormAbono(false)}
          onSuccess={(id) => {
            console.log('Abono registrado:', id);
            setShowFormAbono(false);
            // Datos se actualizan automáticamente vía Zustand
          }}
        />
      )}
    </div>
  );
};
