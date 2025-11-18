/**
 * 🎨 ULTRA PREMIUM LOADERS - Sistema de loading con efectos 3D y holográficos
 * Includes: Spinner, SkeletonLoader, PageLoader, ProgressBar
 */
import { motion } from 'framer-motion';
import { Loader2, Zap } from 'lucide-react';

/**
 * Holographic Spinner con partículas orbitales
 */
export const HolographicSpinner = ({ size = 'md', label }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i * 360) / 12,
  }));

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Core spinner */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 border-r-purple-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />

        {/* Inner ring */}
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-transparent border-t-pink-500 border-r-blue-500"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />

        {/* Orbital particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
              delay: particle.id * 0.1,
            }}
          >
            <motion.div
              className="absolute top-0 left-1/2 w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        ))}

        {/* Center glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-xl opacity-30"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Zap className="w-6 h-6 text-white" />
          </motion.div>
        </div>
      </div>

      {label && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-zinc-400 text-sm font-medium"
        >
          {label}
        </motion.p>
      )}
    </div>
  );
};

/**
 * Ultra Premium Skeleton Loader con shimmer effect avanzado
 */
export const SkeletonLoader = ({ variant = 'card', count = 1 }) => {
  const variants = {
    text: 'h-4 w-full',
    title: 'h-8 w-3/4',
    card: 'h-48 w-full',
    avatar: 'h-16 w-16 rounded-full',
    button: 'h-12 w-32',
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`relative overflow-hidden bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 rounded-xl ${variants[variant]}`}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ['0%', '200%'] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.2,
            }}
          />

          {/* Pulse glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-purple-500/5 to-pink-500/0"
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 5 }).map((_, pi) => (
              <motion.div
                key={pi}
                className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, 0, -20],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

/**
 * Full Page Loader con efectos dramáticos
 */
export const PageLoader = ({ message = 'Cargando...' }) => {
  const rings = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    delay: i * 0.2,
    size: 100 + i * 50,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-2xl"
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [1, 2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Grid background */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
        animate={{
          backgroundPosition: ['0 0', '50px 50px'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Main loader */}
      <div className="relative z-10 flex flex-col items-center gap-12">
        {/* Expanding rings */}
        <div className="relative w-48 h-48">
          {rings.map((ring) => (
            <motion.div
              key={ring.id}
              className="absolute inset-0"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.5],
                opacity: [0.8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: ring.delay,
                ease: 'easeOut',
              }}
            >
              <div
                className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
                style={{
                  borderColor: `rgba(6, 182, 212, ${0.8 - ring.id * 0.2})`,
                }}
              />
            </motion.div>
          ))}

          {/* Center spinner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <HolographicSpinner size="lg" />
          </div>
        </div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center space-y-2"
        >
          <h2 className="text-2xl font-bold text-white">{message}</h2>
          <motion.div
            className="flex items-center justify-center gap-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-zinc-400">Por favor espera</span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            >
              .
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            >
              .
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
            >
              .
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

/**
 * Animated Progress Bar
 */
export const AnimatedProgressBar = ({ progress = 0, label, showPercentage = true }) => {
  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-300">{label}</span>
          {showPercentage && (
            <motion.span
              key={progress}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-sm font-bold text-cyan-400"
            >
              {Math.round(progress)}%
            </motion.span>
          )}
        </div>
      )}

      <div className="relative h-3 bg-zinc-800 rounded-full overflow-hidden">
        {/* Background glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Progress fill */}
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Glow */}
          <motion.div
            className="absolute inset-0 blur-md"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        </motion.div>

        {/* Leading edge pulse */}
        <motion.div
          className="absolute right-0 inset-y-0 w-8 bg-gradient-to-r from-transparent to-white/50"
          style={{ left: `${progress}%` }}
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        />
      </div>
    </div>
  );
};

/**
 * Inline Spinner pequeño para botones
 */
export const InlineSpinner = ({ className = 'w-5 h-5' }) => {
  return (
    <motion.div
      className={className}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <Loader2 className="w-full h-full text-current" />
    </motion.div>
  );
};

export default {
  HolographicSpinner,
  SkeletonLoader,
  PageLoader,
  AnimatedProgressBar,
  InlineSpinner,
};
