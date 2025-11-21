import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import React from 'react';

interface ChronosCardProps {
  children: React.ReactNode;
  title?: string;
  Icon?: LucideIcon;
  className?: string;
  glowColor?: 'blue' | 'cyan' | 'purple' | 'green' | 'pink';
  hoverEffect?: boolean;
  delay?: number;
}

const glowColors = {
  blue: 'hover:shadow-[0_0_40px_rgba(14,165,233,0.3)]',
  cyan: 'hover:shadow-[0_0_40px_rgba(34,211,238,0.3)]',
  purple: 'hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]',
  green: 'hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]',
  pink: 'hover:shadow-[0_0_40px_rgba(236,72,153,0.3)]',
};

const ChronosCard: React.FC<ChronosCardProps> = ({
  children,
  title,
  Icon,
  className = '',
  glowColor = 'blue',
  hoverEffect = true,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`
        relative group overflow-hidden rounded-3xl
        bg-chronos-glass backdrop-blur-xl
        border border-chronos-border
        shadow-glass
        transition-all duration-500
        ${hoverEffect ? glowColors[glowColor] : ''}
        ${className}
      `}
    >
      {/* Efecto de resplandor hover */}
      {hoverEffect && (
        <div
          className={`
            absolute inset-0 opacity-0 group-hover:opacity-20
            transition-opacity duration-700
            bg-[radial-gradient(circle_at_50%_0%,_${
              glowColor === 'blue' ? '#0ea5e9' :
              glowColor === 'cyan' ? '#22d3ee' :
              glowColor === 'purple' ? '#a855f7' :
              glowColor === 'green' ? '#10b981' : '#ec4899'
            }_0%,_transparent_70%)]
          `}
        />
      )}

      {/* Contenido */}
      <div className="relative z-10 p-6 h-full flex flex-col">
        {title && (
          <div className="flex items-center space-x-3 mb-6 opacity-70 group-hover:opacity-100 transition-opacity">
            {Icon && (
              <div className={`p-2 rounded-lg bg-white/5 text-neon-${glowColor}`}>
                <Icon size={18} />
              </div>
            )}
            <h3 className="font-orbitron text-xs tracking-[0.2em] text-white uppercase">
              {title}
            </h3>
          </div>
        )}

        <div className="flex-1">{children}</div>
      </div>
    </motion.div>
  );
};

export default ChronosCard;
