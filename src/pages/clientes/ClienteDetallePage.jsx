/**
 * Cliente Detalle Page
 */
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

export const ClienteDetallePage = () => {
  const { id } = useParams();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-white">Detalle de Cliente</h1>
      <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6">
        <p className="text-gray-400">Cliente ID: {id}</p>
      </div>
    </motion.div>
  );
};

export default ClienteDetallePage;
