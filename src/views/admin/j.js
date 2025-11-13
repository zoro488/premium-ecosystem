import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Wallet, ArrowRightLeft, Lock } from 'lucide-react';
import { ChronosCard } from '@/components/chronos-ui/ChronosCard';

// Datos de ejemplo para los 7 bancos (reemplazar con data real de Firestore)
const BANCOS_DATA = [
    { id: 'azteca', name: 'Banco Azteca', saldo: 245000, color: 'from-green-600 to-emerald-800' },
    { id: 'banorte', name: 'Banorte', saldo: 180500, color: 'from-red-600 to-red-900' },
    { id: 'monte', name: 'Bóveda Monte', saldo: 50000, color: 'from-blue-600 to-blue-900' },
    { id: 'usa', name: 'Bóveda USA', saldo: 12000, esDolar: true, color: 'from-slate-600 to-slate-900' },
    { id: 'profit', name: 'Profit (Utilidades)', saldo: 89000, color: 'from-amber-500 to-yellow-800' },
    { id: 'leftie', name: 'Leftie (Ahorro)', saldo: 34000, color: 'from-purple-600 to-indigo-900' },
    { id: 'fletes', name: 'Fletes & Logística', saldo: 15600, color: 'from-cyan-600 to-blue-800' },
];

const VaultCard = ({ banco, index }: any) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.03, y: -5 }}
        className="relative h-64 cursor-pointer group perspective-1000"
    >
        {/* Tarjeta Frontal */}
        <div className={`absolute inset-0 rounded-3xl p-6 flex flex-col justify-between overflow-hidden border border-white/10 bg-gradient-to-br ${banco.color} shadow-2xl`}>
             {/* Patrón de fondo */}
             <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')] mix-blend-overlay"></div>
             <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>

             {/* Header Tarjeta */}
             <div className="flex justify-between items-center relative z-10">
                 <div className="flex items-center space-x-3">
                     <div className="p-2.5 bg-black/20 rounded-xl backdrop-blur-md">
                         {banco.id === 'usa' ? <Lock className="w-5 h-5 text-white/80" /> : <Wallet className="w-5 h-5 text-white/80" />}
                     </div>
                     <h3 className="font-orbitron text-lg text-white tracking-wider">{banco.name}</h3>
                 </div>
                 <ShieldCheck className="w-6 h-6 text-white/30" />
             </div>

             {/* Saldo */}
             <div className="relative z-10">
                 <p className="text-white/60 text-xs font-mono uppercase tracking-widest mb-1">Saldo Disponible</p>
                 <h2 className="text-4xl font-orbitron font-bold text-white tracking-wide">
                     {banco.esDolar ? 'US' : ''}${banco.saldo.toLocaleString()}
                 </h2>
             </div>

             {/* Footer con Acciones Rápidas */}
             <div className="relative z-10 flex justify-between items-center pt-4 border-t border-white/10">
                 <p className="text-white/50 text-xs font-mono">**** {Math.floor(1000 + Math.random() * 9000)}</p>
                 <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-xs text-white flex items-center">
                          <ArrowRightLeft className="w-3 h-3 mr-1" /> Transferir
                      </button>
                 </div>
             </div>
        </div>
    </motion.div>
);

export const BancosView = () => {
    const totalCapital = BANCOS_DATA.reduce((acc, curr) => acc + (curr.esDolar ? curr.saldo * 20 : curr.saldo), 0);

    return (
        <div className="space-y-8">
            {/* Header Financiero */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-4xl font-orbitron font-black text-white mb-2">BÓVEDAS ACTIVAS</h1>
                    <p className="text-metal-400 font-mono flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        CONEXIÓN SEGURA ESTABLECIDA CON 7 NODOS FINANCIEROS
                    </p>
                </div>
                <ChronosCard className="px-8 py-4 flex items-center space-x-6 !bg-chronos-900/30 !border-chronos-500/30">
                    <div>
                        <p className="text-chronos-300 text-xs font-mono uppercase tracking-widest">Capital Total (MXN Aprox)</p>
                        <p className="text-3xl font-orbitron text-white">${totalCapital.toLocaleString()}</p>
                    </div>
                    <div className="h-12 w-px bg-chronos-500/30"></div>
                    <Wallet className="w-10 h-10 text-chronos-400" />
                </ChronosCard>
            </div>

            {/* Grid de Bóvedas (Diseño de Tarjetas Holográficas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {BANCOS_DATA.map((banco, index) => (
                    <VaultCard key={banco.id} banco={banco} index={index} />
                ))}
                
                {/* Tarjeta de "Añadir/Configurar" */}
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                    className="h-64 rounded-3xl border-2 border-dashed border-metal-700/50 flex flex-col items-center justify-center text-metal-500 hover:text-chronos-400 hover:border-chronos-500/30 transition-all cursor-pointer group"
                >
                    <div className="p-4 rounded-full bg-metal-900/50 group-hover:bg-chronos-500/10 transition-colors mb-4">
                        <Plus className="w-8 h-8" />
                    </div>
                    <p className="font-mono text-sm tracking-widest uppercase">Configurar Nodos</p>
                </motion.div>
            </div>
        </div>
    );
};