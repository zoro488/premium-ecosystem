/**
 * 🚀 AI FLOATING BUTTON - Botón flotante para invocar al asistente
 *
 * Características:
 * - 🎨 Animación de glow pulsante
 * - ✨ Microinteracciones avanzadas
 * - 🌊 Efectos de ondas al hacer click
 * - 📍 Posicionamiento inteligente
 */
import { useState } from 'react';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AIFloatingButtonProps {
  onClick: () => void;
  isActive?: boolean;
}

export function AIFloatingButton({ onClick, isActive = false }: AIFloatingButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-blue shadow-2xl flex items-center justify-center overflow-hidden"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, rotate: -180 }}
      animate={{
        scale: 1,
        rotate: 0,
        transition: {
          type: 'spring',
          stiffness: 260,
          damping: 20,
        },
      }}
      style={{
        boxShadow: isActive
          ? '0 0 60px rgba(0, 217, 255, 0.8), 0 0 100px rgba(139, 92, 246, 0.6)'
          : '0 10px 40px rgba(0, 217, 255, 0.4)',
      }}
    >
      {/* Glow Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Ripple Effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 border-4 border-white/30 rounded-full"
          initial={{ scale: 1, opacity: 1 }}
          animate={{
            scale: 2,
            opacity: 0,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      )}

      {/* Icon */}
      <motion.div
        animate={{
          rotate: isActive ? 180 : 0,
          scale: isActive ? 1.2 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <Sparkles className="w-7 h-7 text-white" />
      </motion.div>

      {/* Pulsing Ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-white/20"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Active Indicator */}
      {isActive && (
        <motion.div
          className="absolute top-1 right-1 w-3 h-3 bg-neon-green rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        />
      )}

      {/* Notification Badge (ejemplo) */}
      {!isActive && (
        <motion.div
          className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: 'spring', stiffness: 500, damping: 15 }}
        >
          <motion.span
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            AI
          </motion.span>
        </motion.div>
      )}
    </motion.button>
  );
}

export default AIFloatingButton;
