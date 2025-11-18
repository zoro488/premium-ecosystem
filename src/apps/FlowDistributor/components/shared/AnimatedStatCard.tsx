/**
 * 📊 ANIMATED STAT CARD
 *
 * Tarjeta de estadística con animaciones premium
 * Números animados con counting effect
 * Inspirado en dashboards financieros modernos
 *
 * @version 1.0.0
 */

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import { memo, useEffect, useRef } from 'react';

interface AnimatedStatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  color?: string;
  delay?: number;
}

export const AnimatedStatCard = memo<AnimatedStatCardProps>(({
  title,
  value,
  prefix = '',
  suffix = '',
  icon: Icon,
  trend = 'neutral',
  trendValue,
  color = '#a855f7',
  delay = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 50,
    damping: 30,
  });

  const displayValue = useMotionValue('0');

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        motionValue.set(value);
      }, delay * 1000);
    }
  }, [isInView, value, motionValue, delay]);

  useEffect(() => {
    return springValue.on('change', (latest) => {
      displayValue.set(latest.toFixed(0));
    });
  }, [springValue, displayValue]);

  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-gray-400',
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      className="group relative"
    >
      {/* Glassmorphism background */}
      <div className="relative rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 overflow-hidden">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${color}20, transparent 70%)`,
          }}
        />

        {/* Icon with glow */}
        <motion.div
          className="mb-4 inline-flex p-3 rounded-xl"
          style={{ backgroundColor: `${color}20` }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </motion.div>

        {/* Title */}
        <div className="text-sm text-gray-400 font-medium mb-2">
          {title}
        </div>

        {/* Animated value */}
        <div className="flex items-baseline gap-2 mb-2">
          <motion.div
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          >
            {prefix}
            <motion.span>
              {displayValue}
            </motion.span>
            {suffix}
          </motion.div>

          {/* Trend indicator */}
          {trend !== 'neutral' && trendValue !== undefined && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: delay + 0.4 }}
              className={`text-sm font-semibold ${trendColors[trend]}`}
            >
              {trend === 'up' ? '↑' : '↓'} {Math.abs(trendValue)}%
            </motion.div>
          )}
        </div>

        {/* Progress bar */}
        <motion.div
          className="h-1 bg-white/10 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.3 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: '0%' }}
            animate={isInView ? { width: `${Math.min((value / 1000000) * 100, 100)}%` } : {}}
            transition={{ duration: 1, delay: delay + 0.5, ease: 'easeOut' }}
          />
        </motion.div>

        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
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
          }}
        />
      </div>
    </motion.div>
  );
});

AnimatedStatCard.displayName = 'AnimatedStatCard';

export default AnimatedStatCard;
