/**
 * 404 Not Found Page
 */
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6 max-w-md mx-4"
    >
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-zinc-800"
      >
        404
      </motion.div>
      <h1 className="text-3xl font-bold text-white">Página no encontrada</h1>
      <p className="text-gray-400">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <div className="flex items-center justify-center gap-4 pt-4">
        <Link
          to="/"
          className="
            px-6 py-3 rounded-lg
            bg-gradient-to-r from-blue-500 to-zinc-800
            text-white font-medium
            hover:from-blue-600 hover:to-zinc-800
            transition-all
            flex items-center gap-2
          "
        >
          <Home size={20} />
          Ir al inicio
        </Link>
        <button
          onClick={() => window.history.back()}
          className="
            px-6 py-3 rounded-lg
            bg-white/5 border border-white/10
            text-white font-medium
            hover:bg-white/10
            transition-all
            flex items-center gap-2
          "
        >
          <Search size={20} />
          Volver
        </button>
      </div>
    </motion.div>
  </div>
);

export default NotFoundPage;
