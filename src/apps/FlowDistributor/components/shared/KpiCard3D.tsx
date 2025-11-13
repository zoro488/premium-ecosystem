/**
 * 💎 KPI CARD 3D - Componente Premium
 *
 * Tarjeta KPI con efectos 3D, tilt interactivo, glow pulse,
 * contador animado y sparkline opcional
 *
 * Features:
 * - Efecto 3D tilt on hover
 * - Glow pulse animado
 * - Contador numérico animado
 * - Sparkline chart opcional
 * - Gradient backgrounds
 * - Glassmorphism effect
 *
 * @version 1.0.0
 */
import { memo, useEffect, useRef, useState } from 'react';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { TrendingDown, TrendingUp } from 'lucide-react';

// Design System
import animations from '../../design-system/animations';
import { theme } from '../../design-system/theme';

interface KpiCard3DProps {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  glow: string;
  trend?: number;
  trendLabel?: string;
  sparklineData?: number[];
  index?: number;
}

export const KpiCard3D = memo<KpiCard3DProps>(
  ({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    gradient,
    glow,
    trend = 0,
    trendLabel,
    sparklineData = [],
    index = 0,
  }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    // Motion values para tilt 3D
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7.5, -7.5]), {
      stiffness: 300,
      damping: 30,
    });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7.5, 7.5]), {
      stiffness: 300,
      damping: 30,
    });

    // Handle mouse move para tilt effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseXPos = e.clientX - rect.left;
      const mouseYPos = e.clientY - rect.top;
      const xPct = mouseXPos / width - 0.5;
      const yPct = mouseYPos / height - 0.5;

      mouseX.set(xPct);
      mouseY.set(yPct);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    // Animated counter
    const [displayValue, setDisplayValue] = useState<string>('0');

    useEffect(() => {
      // Si el valor es un string con formato (ej: "$1,234.56"), extraer número
      const numericValue =
        typeof value === 'number'
          ? value
          : Number.parseFloat(value.toString().replaceAll(/[^0-9.-]/g, ''));

      if (Number.isFinite(numericValue)) {
        let start = 0;
        const end = numericValue;
        const duration = 1500; // 1.5s
        const startTime = Date.now();

        const animate = () => {
          const now = Date.now();
          const progress = Math.min((now - startTime) / duration, 1);

          // Easing function (easeOutCubic)
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = start + (end - start) * eased;

          // Formatear según el tipo de valor original
          if (typeof value === 'string' && value.includes('$')) {
            setDisplayValue(
              `$${current.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            );
          } else {
            setDisplayValue(Math.round(current).toLocaleString('es-MX'));
          }

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setDisplayValue(value.toString());
          }
        };

        animate();
      } else {
        setDisplayValue(value.toString());
      }
    }, [value]);

    return (
      <motion.div
        ref={cardRef}
        custom={index}
        variants={animations.card.tilt3D}
        initial="initial"
        animate="animate"
        whileHover="hover"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative group"
      >
        {/* Glow Effect */}
        <motion.div
          variants={animations.card.glowPulse}
          className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
          style={{
            background: glow,
          }}
        />

        {/* Card */}
        <div
          className="relative h-full rounded-2xl backdrop-blur-xl border overflow-hidden"
          style={{
            background: `${theme.glassmorphism.medium.background}`,
            borderColor: `${theme.glassmorphism.medium.border}`,
          }}
        >
          {/* Gradient Background */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: gradient,
            }}
          />

          {/* Moving Gradient Animation */}
          <motion.div
            variants={animations.gradient.movingGradient}
            animate="animate"
            className="absolute inset-0 opacity-0 group-hover:opacity-20"
            style={{
              background: `linear-gradient(135deg, ${color}33, transparent, ${color}33)`,
            }}
          />

          {/* Content */}
          <div className="relative p-6 h-full flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-white/60 mb-1">{title}</p>
                <motion.h3
                  className="text-3xl font-bold text-white"
                  variants={animations.chart.counter}
                >
                  {displayValue}
                </motion.h3>
                {subtitle && <p className="text-xs text-white/50 mt-1">{subtitle}</p>}
              </div>

              {/* Icon */}
              <motion.div
                className="p-3 rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${color}33, ${color}66)`,
                }}
                variants={animations.micro.iconPulse}
                animate="animate"
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </motion.div>
            </div>

            {/* Sparkline (opcional) */}
            {sparklineData.length > 0 && (
              <div className="mb-3 h-12">
                <MiniSparkline data={sparklineData} color={color} />
              </div>
            )}

            {/* Trend */}
            {trend !== 0 && (
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {trend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span
                  className={`text-sm font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}
                >
                  {Math.abs(trend).toFixed(1)}%
                </span>
                {trendLabel && <span className="text-xs text-white/50">{trendLabel}</span>}
              </motion.div>
            )}
          </div>

          {/* Shimmer Effect */}
          <motion.div
            variants={animations.card.shimmer}
            animate="animate"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}22, transparent)`,
            }}
          />
        </div>
      </motion.div>
    );
  }
);

KpiCard3D.displayName = 'KpiCard3D';

/**
 * 📈 Mini Sparkline Component
 */
const MiniSparkline = memo<{ data: number[]; color: string }>(({ data, color }) => {
  if (data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg className="w-full h-full" preserveAspectRatio="none">
      <motion.polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      />
      <motion.polyline
        fill={`url(#gradient-${color})`}
        stroke="none"
        points={`0,100 ${points} 100,100`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
});

MiniSparkline.displayName = 'MiniSparkline';

export default KpiCard3D;
