/**
 * 🎨 PREMIUM LOADING SCREEN
 *
 * Pantalla de carga elegante y animada para todos los paneles
 * @version 1.0.0
 */

import { motion } from 'framer-motion';
import { Database, Loader2 } from 'lucide-react';
import { memo } from 'react';

interface PremiumLoadingScreenProps {
  message?: string;
  theme?: 'purple' | 'blue' | 'green' | 'orange' | 'teal';
}

const THEME_COLORS = {
  purple: { primary: '#a855f7', secondary: '#ec4899' },
  blue: { primary: '#3b82f6', secondary: '#06b6d4' },
  green: { primary: '#10b981', secondary: '#34d399' },
  orange: { primary: '#f97316', secondary: '#fb923c' },
  teal: { primary: '#14b8a6', secondary: '#2dd4bf' },
};

export const PremiumLoadingScreen = memo<PremiumLoadingScreenProps>(({
  message = 'Cargando datos...',
  theme = 'purple',
}) => {
  const colors = THEME_COLORS[theme];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6 p-8"
      >
        {/* Spinning loader */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="relative"
        >
          <Loader2
            className="w-16 h-16"
            style={{ color: colors.primary }}
          />

          {/* Pulsing circle */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 opacity-30"
            style={{ borderColor: colors.primary }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Database icon */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2"
        >
          <Database className="w-6 h-6" style={{ color: colors.secondary }} />
          <span className="text-white text-xl font-semibold">{message}</span>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 text-sm"
        >
          Conectando con Firestore...
        </motion.p>

        {/* Progress dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.primary }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
});

PremiumLoadingScreen.displayName = 'PremiumLoadingScreen';

export default PremiumLoadingScreen;
