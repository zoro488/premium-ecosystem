// 🎨 PREMIUM LOADING SCREEN
// Pantalla de carga ultra-premium con animaciones inmersivas
import { motion } from 'framer-motion';
import { Loader2, Sparkles, TrendingUp, Zap } from 'lucide-react';

export const PremiumLoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden relative">
      {/* Fondo animado con partículas */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(${59 + Math.random() * 100}, ${130 + Math.random() * 100}, 246, ${0.2 + Math.random() * 0.5})`,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
              y: [0, -30, -60],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Ondas de fondo */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Contenido central */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center z-10 relative"
      >
        {/* Logo animado con múltiples capas */}
        <div className="relative mb-12">
          {/* Anillo exterior 1 */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 w-32 h-32 mx-auto"
          >
            <div className="w-full h-full border-2 border-primary/30 rounded-full" />
          </motion.div>

          {/* Anillo exterior 2 */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 w-32 h-32 mx-auto"
          >
            <div className="w-full h-full border-2 border-secondary/30 rounded-full border-dashed" />
          </motion.div>

          {/* Logo central con pulso */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 20px rgba(59, 130, 246, 0.3)',
                '0 0 40px rgba(59, 130, 246, 0.6)',
                '0 0 20px rgba(59, 130, 246, 0.3)',
              ],
            }}
            transition={{
              scale: { duration: 2, repeat: Infinity },
              boxShadow: { duration: 2, repeat: Infinity },
            }}
            className="relative z-10 w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary p-6 shadow-2xl"
          >
            <TrendingUp className="w-full h-full text-white" />

            {/* Sparkles alrededor */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  top: '50%',
                  left: '50%',
                  marginTop: -6,
                  marginLeft: -6,
                }}
                animate={{
                  x: [0, Math.cos((i * Math.PI) / 2) * 50],
                  y: [0, Math.sin((i * Math.PI) / 2) * 50],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                <Sparkles className="w-3 h-3 text-primary" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Título con efecto de brillo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative mb-4"
        >
          <h2 className="text-4xl font-bold font-display relative inline-block">
            <span className="bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent">
              Chronos
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                maskImage: 'linear-gradient(to right, transparent, white, transparent)',
              }}
            />
          </h2>

          {/* Badge Premium */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 ml-3"
          >
            <Zap className="w-3 h-3 text-primary" />
            <span className="text-xs text-primary font-medium">PREMIUM</span>
          </motion.div>
        </motion.div>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/60 mb-8 text-lg"
        >
          Sistema Empresarial Avanzado
        </motion.p>

        {/* Barra de progreso premium */}
        <div className="w-80 mx-auto mb-8">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="h-full bg-gradient-to-r from-primary via-secondary to-primary relative"
              style={{
                backgroundSize: '200% 100%',
              }}
            >
              <motion.div
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                style={{
                  backgroundSize: '200% 100%',
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Estados de carga animados */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-3 text-sm"
        >
          {[
            { text: 'Inicializando bóvedas...', delay: 0 },
            { text: 'Cargando datos del Excel...', delay: 0.3 },
            { text: 'Preparando análisis avanzado...', delay: 0.6 },
            { text: 'Configurando dashboards...', delay: 0.9 },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: item.delay }}
              className="flex items-center justify-center gap-3"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="w-4 h-4 text-primary" />
              </motion.div>
              <span className="text-white/60">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Indicador de versión */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-xs text-white/30"
        >
          v3.0 Premium Enterprise Edition
        </motion.div>
      </motion.div>

      {/* Efecto de vignette */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/50" />
      </div>
    </div>
  );
};

export default PremiumLoadingScreen;
