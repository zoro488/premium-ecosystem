/**
 * 📊 PREMIUM KPI 3D
 * Tarjetas KPI con diseño 3D, particles, counters animados y efectos premium
 */
import { useEffect, useRef, useState } from 'react';

import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';

import { formatCurrency } from '../../utils/formatters';

/**
 * Hook para animar números
 */
const useAnimatedCounter = (endValue, duration = 1000) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime = null;
    const startValue = 0;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function (easeOutCubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(startValue + (endValue - startValue) * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [endValue, duration]);

  return displayValue;
};

/**
 * Partículas flotantes alrededor del KPI
 */
const FloatingParticles = ({ color = 'primary', count = 8 }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * 360;
        const delay = i * 0.2;

        return (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full bg-${color}/40`}
            style={{
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: [0, Math.cos((angle * Math.PI) / 180) * 40, 0],
              y: [0, Math.sin((angle * Math.PI) / 180) * 40, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * Tarjeta KPI Premium 3D
 */
export const PremiumKPI3D = ({
  title,
  value,
  icon: Icon,
  color = 'primary',
  trend = null, // { value: number, isPositive: boolean }
  subtitle = null,
  format = 'currency', // 'currency' | 'number' | 'percentage'
  size = 'md', // 'sm' | 'md' | 'lg'
  showParticles = true,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef(null);
  const animatedValue = useAnimatedCounter(value, 1500);

  // Formatear valor
  const formatValue = (val) => {
    if (format === 'currency') return formatCurrency(val);
    if (format === 'percentage') return `${val.toFixed(1)}%`;
    return Math.round(val).toLocaleString();
  };

  // Canvas animation para efecto holográfico
  useEffect(() => {
    if (!canvasRef.current || !isHovered) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    let animationId;
    let time = 0;

    const animate = () => {
      time += 0.01;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar ondas holográficas
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${color === 'success' ? '16, 185, 129' : color === 'error' ? '239, 68, 68' : '59, 130, 246'}, ${0.1 - i * 0.03})`;
        ctx.lineWidth = 2;

        for (let x = 0; x < canvas.width; x += 5) {
          const y =
            canvas.height / 2 +
            Math.sin((x + time * 100 + i * 50) / 30) * 10 +
            Math.sin((x + time * 50) / 20) * 5;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isHovered, color]);

  // Clases de tamaño
  const sizeClasses = {
    sm: {
      container: 'p-4',
      icon: 'w-8 h-8 p-1.5',
      iconSize: 'w-5 h-5',
      title: 'text-xs',
      value: 'text-xl',
      subtitle: 'text-xs',
    },
    md: {
      container: 'p-6',
      icon: 'w-12 h-12 p-2.5',
      iconSize: 'w-7 h-7',
      title: 'text-sm',
      value: 'text-3xl',
      subtitle: 'text-sm',
    },
    lg: {
      container: 'p-8',
      icon: 'w-16 h-16 p-3',
      iconSize: 'w-10 h-10',
      title: 'text-base',
      value: 'text-4xl',
      subtitle: 'text-base',
    },
  };

  const sizes = sizeClasses[size];

  return (
    <motion.div
      className={`relative ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Card principal con profundidad 3D */}
      <div
        className={`
        relative backdrop-blur-xl rounded-2xl overflow-hidden
        bg-gradient-to-br from-${color}/10 via-${color}/5 to-transparent
        border border-${color}/20
        shadow-2xl shadow-${color}/10
        ${sizes.container}
      `}
      >
        {/* Canvas holográfico de fondo */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-50 pointer-events-none"
        />

        {/* Partículas flotantes */}
        {showParticles && <FloatingParticles color={color} count={6} />}

        {/* Contenido */}
        <div className="relative z-10">
          {/* Header con icono */}
          <div className="flex items-center justify-between mb-4">
            {/* Icono 3D */}
            <motion.div
              className={`
                ${sizes.icon} rounded-xl
                bg-gradient-to-br from-${color}/30 to-${color}/10
                border border-${color}/30
                shadow-lg shadow-${color}/20
                flex items-center justify-center
              `}
              animate={{
                rotate: isHovered ? [0, -5, 5, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              <Icon className={`${sizes.iconSize} text-${color}`} />
            </motion.div>

            {/* Trend indicator */}
            {trend && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`
                  flex items-center gap-1 px-2 py-1 rounded-lg
                  ${
                    trend.isPositive
                      ? 'bg-success/20 text-success border border-success/30'
                      : 'bg-error/20 text-error border border-error/30'
                  }
                `}
              >
                {trend.isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="text-xs font-bold">{Math.abs(trend.value).toFixed(1)}%</span>
              </motion.div>
            )}
          </div>

          {/* Título */}
          <h3 className={`${sizes.title} text-white/60 font-medium mb-2`}>{title}</h3>

          {/* Valor animado */}
          <motion.p
            className={`${sizes.value} font-bold text-${color} font-display mb-1`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {formatValue(animatedValue)}
          </motion.p>

          {/* Subtitle */}
          {subtitle && <p className={`${sizes.subtitle} text-white/40`}>{subtitle}</p>}
        </div>

        {/* Brillo superior */}
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent rounded-t-2xl pointer-events-none" />

        {/* Borde inferior holográfico */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${color} to-transparent`}
          animate={{
            opacity: isHovered ? [0.3, 0.8, 0.3] : 0.3,
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Sombra 3D (cara derecha) */}
      <div
        className={`
          absolute -right-2 top-2 w-2 rounded-r-xl
          bg-gradient-to-b from-${color}/20 to-${color}/5
          border-r border-${color}/20
          transform origin-top-left
        `}
        style={{
          height: 'calc(100% - 8px)',
          transform: 'skewY(-3deg)',
        }}
      />

      {/* Sombra 3D (cara inferior) */}
      <div
        className={`
          absolute -bottom-2 left-2 right-2 h-2 rounded-b-xl
          bg-gradient-to-r from-${color}/5 via-${color}/20 to-${color}/5
          border-b border-${color}/20
          transform origin-top-left
        `}
        style={{
          transform: 'skewX(-3deg)',
        }}
      />
    </motion.div>
  );
};

/**
 * Grid de KPIs
 */
export const KPIGrid = ({ kpis = [], columns = 4, gap = 4 }) => {
  return (
    <div
      className={`grid gap-${gap}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <PremiumKPI3D {...kpi} />
        </motion.div>
      ))}
    </div>
  );
};

export default PremiumKPI3D;
