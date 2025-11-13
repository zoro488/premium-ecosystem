// ============================================================================
// CHRONOS CARD - Base Container Component
// Contenedor glassmorphism con header opcional
// ============================================================================

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface ChronosCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
  variant?: 'glass' | 'glass-metal' | 'glass-dark';
  hover?: boolean;
  onClick?: () => void;
}

export function ChronosCard({
  children,
  title,
  subtitle,
  icon: Icon,
  className = '',
  variant = 'glass',
  hover = true,
  onClick,
}: ChronosCardProps) {
  const baseClass = variant === 'glass-metal' ? 'card-metal' : 'card-glass';

  return (
    <motion.div
      className={`${baseClass} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={hover ? { scale: 1.02, transition: { duration: 0.2 } } : undefined}
      onClick={onClick}
    >
      {(title || subtitle || Icon) && (
        <div className="flex items-start justify-between mb-4 pb-4 border-b border-chronos-smoke">
          <div className="flex-1">
            {title && (
              <h3 className="text-lg font-semibold text-chronos-white flex items-center gap-2">
                {Icon && <Icon className="w-5 h-5 text-neon-cyan" />}
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-chronos-silver mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      )}

      <div>{children}</div>
    </motion.div>
  );
}

export default ChronosCard;
