/**
 * 💎 GLASSMORPHISM CARD COMPONENT
 *
 * Tarjeta premium con efecto de cristal esmerilado
 * Inspirado en diseños modernos de Pinterest/Dribbble
 *
 * Features:
 * - Backdrop blur con transparencia
 * - Bordes con gradientes
 * - Hover effects 3D
 * - Animaciones suaves
 * - Responsive
 *
 * @version 1.0.0
 */

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { type ReactNode, memo, useRef } from 'react';

interface GlassmorphismCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'elevated' | 'flat';
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  hover3d?: boolean;
  glowColor?: string;
  onClick?: () => void;
}

const BLUR_VALUES = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
};

const VARIANTS = {
  default: 'bg-white/10 border border-white/20',
  bordered: 'bg-white/5 border-2 border-white/30',
  elevated: 'bg-white/15 border border-white/25 shadow-2xl',
  flat: 'bg-white/8 border-0',
};

export const GlassmorphismCard = memo<GlassmorphismCardProps>(({
  children,
  className = '',
  variant = 'default',
  blur = 'md',
  hover3d = true,
  glowColor = 'rgba(168, 85, 247, 0.5)',
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hover3d || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`
        relative rounded-2xl overflow-hidden
        ${BLUR_VALUES[blur]}
        ${VARIANTS[variant]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={hover3d ? {
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      } : {}}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={hover3d ? {
        scale: 1.02,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '200% 200%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>

      {/* Border gradient */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />
    </motion.div>
  );
});

GlassmorphismCard.displayName = 'GlassmorphismCard';

export default GlassmorphismCard;
