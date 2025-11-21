/**
 * Analytics Page
 */
import { motion } from 'framer-motion';

export const AnalyticsPage = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <h1 className="text-3xl font-bold text-white">Analytics</h1>
    <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6">
      <p className="text-gray-400">Análisis y reportes avanzados</p>
    </div>
  </motion.div>
);

export default AnalyticsPage;
