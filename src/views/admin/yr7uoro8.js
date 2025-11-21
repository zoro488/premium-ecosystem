import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, DollarSign, Activity, Package } from 'lucide-react';

// Componente de Tarjeta KPI Ultra Premium
const KpiUltraCard = ({ title, value, trend, icon: Icon, delay = 0 }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="relative group"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-chronos-500/20 to-purple-600/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative bg-metal-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl overflow-hidden hover:border-chronos-400/30 transition-colors duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-2xl">
                    <Icon className="w-6 h-6 text-chronos-400" />
                </div>
                {trend && (
                    <div className={`flex items-center space-x-1 text-sm font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>
            <h3 className="text-metal-400 text-sm font-medium tracking-wider uppercase mb-1">{title}</h3>
            <p className="text-3xl font-bold text-white font-orbitron tracking-wide">{value}</p>
            
            {/* Efecto de brillo en hover */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
        </div>
    </motion.div>
);

export const DashboardView = () => {
    // Aquí usarías tus hooks reales: const { data } = useDashboardData();
    
    return (
        <div className="space-y-8">
            {/* Sección de Bienvenida */}
            <div className="mb-12">
                <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-white via-chronos-200 to-chronos-400"
                >
                    PANEL DE CONTROL
                </motion.h1>
                <motion.p 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: 0.2 }}
                    className="text-metal-400 mt-2 font-mono"
                >
                    Resumen de operaciones en tiempo real.
                </motion.p>
            </div>

            {/* Grid de KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiUltraCard title="Ventas Totales (Mes)" value="$1,250,430" trend={12.5} icon={DollarSign} delay={0.1} />
                <KpiUltraCard title="Utilidad Neta" value="$345,890" trend={8.2} icon={Activity} delay={0.2} />
                <KpiUltraCard title="Órdenes Activas" value="24" trend={-2.5} icon={ShoppingCart} delay={0.3} />
                <KpiUltraCard title="Stock Almacén" value="1,890 Unidades" icon={Package} delay={0.4} />
            </div>

            {/* Aquí irían tus Gráficos Avanzados y Tablas Recientes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-96">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-2 bg-metal-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
                >
                    <h3 className="text-lg font-medium font-orbitron mb-6">Flujo de Capital (Tiempo Real)</h3>
                    {/* Placeholder para Recharts */}
                    <div className="h-full w-full flex items-center justify-center text-metal-500 font-mono border-2 border-dashed border-white/10 rounded-2xl">
                        [GRÁFICO DE LÍNEAS AVANZADO AQUÍ]
                    </div>
                </motion.div>
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-metal-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
                >
                    <h3 className="text-lg font-medium font-orbitron mb-6">Distribución Bancaria</h3>
                     {/* Placeholder para Pie Chart */}
                     <div className="h-full w-full flex items-center justify-center text-metal-500 font-mono border-2 border-dashed border-white/10 rounded-2xl">
                        [GRÁFICO CIRCULAR 3D AQUÍ]
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// Icono temporal si falta lucide
const ShoppingCart = (props: any) => <Activity {...props} />;