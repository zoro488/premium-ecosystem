/**
 * 🎴 ULTRA PREMIUM CARD COMPONENT
 * Card component con glassmorphism y microinteracciones avanzadas
 */
import { motion } from 'framer-motion';

import { useHover } from '@/hooks/useHover';

export const UltraPremiumCard = ({
  children,
  className = '',
  hoverable = true,
  glowEffect = false,
  onClick,
  ...props
}) => {
  const [hoverRef, isHovered] = useHover();

  return (
    <motion.div
      ref={hoverRef}
      onClick={onClick}
      className={`
        premium-card
        relative overflow-hidden
        bg-gradient-to-br from-black-deep/95 via-black-carbon/90 to-black-obsidian/85
        backdrop-blur-2xl
        border border-white/[0.05]
        rounded-2xl
        shadow-2xl shadow-black/50
        transition-all duration-500 ease-out
        ${hoverable ? 'hover:border-white/[0.12] hover:shadow-3xl hover:shadow-black/70' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hoverable ? { y: -4, scale: 1.01 } : {}}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      {...props}
    >
      {/* Glow effect on hover */}
      {glowEffect && isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/[0.03] via-white/[0.05] to-white/[0.03] blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Shine effect on hover */}
      {hoverable && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent"
          style={{ transform: 'translateX(-100%)' }}
          animate={isHovered ? { transform: 'translateX(100%)' } : {}}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      )}

      {/* Border glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.04] opacity-0 hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export const UltraPremiumCardHeader = ({ children, className = '' }) => (
  <div className={`p-6 border-b border-white/[0.05] ${className}`}>{children}</div>
);

export const UltraPremiumCardBody = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export const UltraPremiumCardFooter = ({ children, className = '' }) => (
  <div className={`p-6 border-t border-white/[0.05] ${className}`}>{children}</div>
);

export default UltraPremiumCard;
