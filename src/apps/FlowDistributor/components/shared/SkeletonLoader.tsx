/**
 * 💀 SKELETON LOADER
 *
 * Loader con efecto shimmer premium
 * - Multiple variants (text, card, circle, rectangle)
 * - Shimmer animation
 * - Pulse effect
 * - Customizable colors
 * - Responsive
 *
 * Inspirado en loading patterns modernos
 * @version 1.0.0
 */

import { motion } from 'framer-motion';
import { memo } from 'react';

type SkeletonVariant = 'text' | 'card' | 'circle' | 'rectangle' | 'avatar' | 'button';

interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
  animated?: boolean;
  theme?: 'light' | 'dark';
}

export const SkeletonLoader = memo<SkeletonLoaderProps>(({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1,
  animated = true,
  theme = 'dark',
}) => {
  // Base styles
  const baseClasses = theme === 'dark'
    ? 'bg-white/10'
    : 'bg-gray-300';

  // Variant specific dimensions
  const variantStyles: Record<SkeletonVariant, { width?: string; height?: string; borderRadius?: string }> = {
    text: {
      width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
      height: height ? (typeof height === 'number' ? `${height}px` : height) : '16px',
      borderRadius: '4px',
    },
    card: {
      width: width ? (typeof width === 'number' ? `${width}px` : width) : '300px',
      height: height ? (typeof height === 'number' ? `${height}px` : height) : '200px',
      borderRadius: '16px',
    },
    circle: {
      width: width ? (typeof width === 'number' ? `${width}px` : width) : '40px',
      height: height ? (typeof height === 'number' ? `${height}px` : height) : '40px',
      borderRadius: '50%',
    },
    rectangle: {
      width: width ? (typeof width === 'number' ? `${width}px` : width) : '200px',
      height: height ? (typeof height === 'number' ? `${height}px` : height) : '100px',
      borderRadius: '8px',
    },
    avatar: {
      width: width ? (typeof width === 'number' ? `${width}px` : width) : '48px',
      height: height ? (typeof height === 'number' ? `${height}px` : height) : '48px',
      borderRadius: '50%',
    },
    button: {
      width: width ? (typeof width === 'number' ? `${width}px` : width) : '120px',
      height: height ? (typeof height === 'number' ? `${height}px` : height) : '40px',
      borderRadius: '8px',
    },
  };

  const styles = variantStyles[variant];

  // Shimmer gradient
  const shimmerGradient = theme === 'dark'
    ? 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'
    : 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)';

  const items = Array.from({ length: count }, (_, i) => (
    <motion.div
      key={i}
      className={`${baseClasses} ${className} overflow-hidden relative`}
      style={{
        width: styles.width,
        height: styles.height,
        borderRadius: styles.borderRadius,
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: animated ? [0.4, 0.8, 0.4] : 0.6,
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: i * 0.1,
      }}
    >
      {/* Shimmer effect */}
      {animated && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: shimmerGradient,
            backgroundSize: '200% 100%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '200% 0%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </motion.div>
  ));

  return count > 1 ? (
    <div className="space-y-3">
      {items}
    </div>
  ) : (
    <>{items[0]}</>
  );
});

SkeletonLoader.displayName = 'SkeletonLoader';

/**
 * SKELETON CARD LAYOUT
 * Pre-built card skeleton with avatar, title, and lines
 */
interface SkeletonCardLayoutProps {
  theme?: 'light' | 'dark';
}

export const SkeletonCardLayout = memo<SkeletonCardLayoutProps>(({ theme = 'dark' }) => (
  <div className="p-6 space-y-4">
    {/* Header with avatar and title */}
    <div className="flex items-center gap-4">
      <SkeletonLoader variant="avatar" width={48} height={48} theme={theme} />
      <div className="flex-1 space-y-2">
        <SkeletonLoader variant="text" width="60%" height={16} theme={theme} />
        <SkeletonLoader variant="text" width="40%" height={12} theme={theme} />
      </div>
    </div>

    {/* Content lines */}
    <div className="space-y-2">
      <SkeletonLoader variant="text" width="100%" height={12} theme={theme} />
      <SkeletonLoader variant="text" width="95%" height={12} theme={theme} />
      <SkeletonLoader variant="text" width="80%" height={12} theme={theme} />
    </div>

    {/* Actions */}
    <div className="flex gap-3">
      <SkeletonLoader variant="button" width={100} height={36} theme={theme} />
      <SkeletonLoader variant="button" width={100} height={36} theme={theme} />
    </div>
  </div>
));

SkeletonCardLayout.displayName = 'SkeletonCardLayout';

/**
 * SKELETON TABLE LAYOUT
 * Pre-built table skeleton
 */
interface SkeletonTableLayoutProps {
  rows?: number;
  columns?: number;
  theme?: 'light' | 'dark';
}

export const SkeletonTableLayout = memo<SkeletonTableLayoutProps>(({
  rows = 5,
  columns = 4,
  theme = 'dark',
}) => (
  <div className="space-y-2">
    {/* Header */}
    <div className="flex gap-4 p-4 border-b border-white/10">
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonLoader
          key={i}
          variant="text"
          width={`${100 / columns}%`}
          height={12}
          theme={theme}
        />
      ))}
    </div>

    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4 p-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <SkeletonLoader
            key={colIndex}
            variant="text"
            width={`${100 / columns}%`}
            height={10}
            theme={theme}
          />
        ))}
      </div>
    ))}
  </div>
));

SkeletonTableLayout.displayName = 'SkeletonTableLayout';

export default SkeletonLoader;
