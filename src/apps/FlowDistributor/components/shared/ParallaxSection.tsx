/**
 * ✨ PARALLAX SECTION
 *
 * Sección con efecto parallax premium
 * - Movimiento basado en scroll
 * - Múltiples capas a diferentes velocidades
 * - Smooth animations
 * - 3D depth effect
 * - Performance optimizado
 *
 * Inspirado en sitios web modernos y Pinterest
 * @version 1.0.0
 */

import { motion, useScroll, useTransform } from 'framer-motion';
import { memo, useRef, useState } from 'react';

interface ParallaxLayer {
  speed: number; // 0.1 (slow) to 2.0 (fast)
  children: React.ReactNode;
  className?: string;
  zIndex?: number;
}

interface ParallaxSectionProps {
  children?: React.ReactNode;
  layers?: ParallaxLayer[];
  height?: string;
  className?: string;
  perspective?: boolean;
}

export const ParallaxSection = memo<ParallaxSectionProps>(({
  children,
  layers = [],
  height = '600px',
  className = '',
  perspective = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        height,
        perspective: perspective ? '1000px' : undefined,
      }}
    >
      {/* Parallax layers */}
      {layers.map((layer, index) => {
        // Transform scroll progress to movement
        // Negative values move up, positive values move down
        const range = 100 * layer.speed;
        const y = useTransform(scrollYProgress, [0, 1], [-range, range]);

        return (
          <motion.div
            key={index}
            style={{
              y,
              zIndex: layer.zIndex ?? index,
            }}
            className={`absolute inset-0 ${layer.className || ''}`}
          >
            {layer.children}
          </motion.div>
        );
      })}

      {/* Main content (no parallax) */}
      {children && (
        <div className="relative z-10 h-full">
          {children}
        </div>
      )}
    </div>
  );
});

ParallaxSection.displayName = 'ParallaxSection';

/**
 * PARALLAX IMAGE
 * Imagen con efecto parallax individual
 */
interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
  scale?: boolean;
}

export const ParallaxImage = memo<ParallaxImageProps>(({
  src,
  alt,
  speed = 0.5,
  className = '',
  scale = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const range = 100 * speed;
  const y = useTransform(scrollYProgress, [0, 1], [-range, range]);
  const scaleValue = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.2]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{
          y,
          scale: scale ? scaleValue : 1,
        }}
        className="w-full h-full object-cover"
      />
    </div>
  );
});

ParallaxImage.displayName = 'ParallaxImage';

/**
 * PARALLAX TEXT
 * Texto con efecto parallax y fade
 */
interface ParallaxTextProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  fade?: boolean;
}

export const ParallaxText = memo<ParallaxTextProps>(({
  children,
  speed = 0.3,
  className = '',
  fade = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const range = 100 * speed;
  const y = useTransform(scrollYProgress, [0, 1], [-range, range]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      ref={ref}
      style={{
        y,
        opacity: fade ? opacity : 1,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

ParallaxText.displayName = 'ParallaxText';

/**
 * PARALLAX CARD
 * Card con efecto 3D parallax al hover
 */
interface ParallaxCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export const ParallaxCard = memo<ParallaxCardProps>(({
  children,
  className = '',
  intensity = 1,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -10 * intensity;
    const rotateYValue = ((x - centerX) / centerX) * 10 * intensity;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

ParallaxCard.displayName = 'ParallaxCard';

export default ParallaxSection;
