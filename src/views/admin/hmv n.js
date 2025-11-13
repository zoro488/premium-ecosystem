import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChronosTableProps {
    headers: string[];
    data: any[];
    renderRow: (item: any, index: number) => React.ReactNode;
    isLoading?: boolean;
}

export const ChronosTable = ({ headers, data, renderRow, isLoading = false }: ChronosTableProps) => {
    if (isLoading) {
        return <div className="w-full h-32 flex items-center justify-center text-neon-blue animate-pulse font-mono text-sm">>> CARGANDO FLUJOS DE DATOS...</div>;
    }

    return (
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-chronos-border scrollbar-track-transparent">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                        {headers.map((header, i) => (
                            <th key={i} className="py-4 px-6 text-[10px] font-orbitron text-zinc-500 uppercase tracking-[0.2em]">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <AnimatePresence>
                        {data.map((item, index) => (
                            <motion.tr 
                                key={item.id || index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: index * 0.03, duration: 0.3 }}
                                className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group"
                            >
                                {renderRow(item, index)}
                            </motion.tr>
                        ))}
                    </AnimatePresence>
                </tbody>
            </table>
            {data.length === 0 && (
                <div className="py-12 text-center font-mono text-xs text-zinc-600 uppercase tracking-widest">
                    >> NO SE ENCONTRARON REGISTROS
                </div>
            )}
        </div>
    );
};