import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Download, TrendingUp, DollarSign, Calendar, Search } from 'lucide-react';
import { ChronosCard } from '@/components/chronos-ui/ChronosCard';
import { ChronosButton } from '@/components/chronos-ui/ChronosButton';
import { ChronosTable } from '@/components/chronos-ui/ChronosTable';

// --- DATOS DUMMY PARA VISUALIZACIÓN (Reemplazar con tus hooks reales) ---
const MOCK_KPI = {
    totalMes: 1250400,
    ventasHoy: 45300,
    promedioVenta: 8500,
    crecimiento: 12.5
};

const MOCK_VENTAS = Array(10).fill(0).map((_, i) => ({
    id: `VN-${1000 + i}`,
    cliente: `Cliente Empresa ${i + 1}`,
    fecha: '10/11/2025',
    total: 15000 + Math.random() * 50000,
    estado: Math.random() > 0.2 ? 'completado' : 'pendiente',
    items: 12 + i
}));

export const VentasView = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Aquí usarías tu hook real: const { ventas, loading, error } = useVentasData();

    return (
        <div className="space-y-6">
            {/* --- HEADER DE LA TERMINAL --- */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-chronos-400"
                    >
                        TERMINAL DE VENTAS
                    </motion.h1>
                    <p className="text-metal-400 font-mono text-sm mt-1">
                        >> ESTADO DEL SISTEMA: REGISTRO ACTIVO
                    </p>
                </div>
                <div className="flex gap-3">
                    <ChronosButton variant="secondary" icon={Download}>Exportar</ChronosButton>
                    <ChronosButton icon={Plus}>NUEVA VENTA</ChronosButton>
                </div>
            </header>

            {/* --- KPIS EN TIEMPO REAL --- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <ChronosCard className="p-6" delay={0.1} hoverEffect>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-metal-400 text-xs font-mono uppercase mb-2">Ventas Totales (Nov)</p>
                            <h3 className="text-2xl font-orbitron text-white">${MOCK_KPI.totalMes.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 rounded-xl bg-chronos-500/20 text-chronos-400">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs font-mono text-green-400">
                        <Plus className="w-3 h-3 mr-1" />
                        {MOCK_KPI.crecimiento}% vs mes anterior
                    </div>
                </ChronosCard>

                 <ChronosCard className="p-6" delay={0.2} hoverEffect>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-metal-400 text-xs font-mono uppercase mb-2">Ingresos Hoy</p>
                            <h3 className="text-2xl font-orbitron text-white">${MOCK_KPI.ventasHoy.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                     {/* Pequeño sparkline simulado */}
                    <div className="mt-4 h-1 w-full bg-metal-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[65%] animate-pulse-slow"></div>
                    </div>
                </ChronosCard>

                {/* ... Más KPIs aquí ... */}
            </div>

            {/* --- ÁREA DE OPERACIONES (Tabla + Filtros) --- */}
            <ChronosCard className="min-h-[500px] flex flex-col" delay={0.4}>
                {/* Toolbar de Tabla */}
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-metal-500" />
                        <input 
                            type="text" 
                            placeholder="Buscar por ID, cliente o monto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-metal-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-metal-500 focus:outline-none focus:border-chronos-500/50 transition-all"
                        />
                    </div>
                    <div className="flex gap-3">
                         <ChronosButton variant="secondary" icon={Filter} className="!px-4">Filtros Avanzados</ChronosButton>
                         <ChronosButton variant="secondary" icon={Calendar} className="!px-4">Fecha</ChronosButton>
                    </div>
                </div>

                {/* Tabla de Datos */}
                <div className="flex-1 p-6">
                    <ChronosTable 
                        headers={['ID Transacción', 'Cliente / Empresa', 'Fecha Registro', 'Items', 'Total MXN', 'Estado', 'Acciones']}
                        data={MOCK_VENTAS}
                        renderRow={(venta: any) => (
                            <>
                                <td className="py-4 px-6 font-mono text-chronos-400">{venta.id}</td>
                                <td className="py-4 px-6 text-white font-medium">{venta.cliente}</td>
                                <td className="py-4 px-6 text-metal-300">{venta.fecha}</td>
                                <td className="py-4 px-6 text-metal-300">{venta.items} u.</td>
                                <td className="py-4 px-6 font-orbitron text-white">${venta.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                                <td className="py-4 px-6">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                        ${venta.estado === 'completado' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                        {venta.estado}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <button className="text-metal-400 hover:text-white transition-colors">Ver Detalles</button>
                                </td>
                            </>
                        )}
                    />
                </div>
            </ChronosCard>
        </div>
    );
};