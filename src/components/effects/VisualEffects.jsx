/**
 * ✨ EFECTOS VISUALES AVANZADOS
 * Particles, gradientes animados, aurora y más (sin 3D)
 */
import { useEffect, useRef, useState } from 'react';

import { motion } from 'framer-motion';

/**
 * 🌌 GRADIENT MESH - Fondo con malla de gradientes animados
 */
export const GradientMesh = ({ className = '', colors = ['#3b82f6', '#8b5cf6', '#ec4899'] }) => {
  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(circle at 0% 0%, ${colors[0]}15 0%, transparent 50%),
             radial-gradient(circle at 100% 100%, ${colors[1]}10 0%, transparent 50%)`,
            `radial-gradient(circle at 100% 0%, ${colors[1]}15 0%, transparent 50%),
             radial-gradient(circle at 0% 100%, ${colors[2]}10 0%, transparent 50%)`,
            `radial-gradient(circle at 50% 50%, ${colors[2]}15 0%, transparent 50%),
             radial-gradient(circle at 50% 0%, ${colors[0]}10 0%, transparent 50%)`,
            `radial-gradient(circle at 0% 0%, ${colors[0]}15 0%, transparent 50%),
             radial-gradient(circle at 100% 100%, ${colors[1]}10 0%, transparent 50%)`,
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

/**
 * 🎆 AURORA BACKGROUND - Efecto aurora boreal animado
 */
export const AuroraBackground = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute inset-0 opacity-40">
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)
            `,
            backgroundSize: '400% 400%',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)
            `,
          }}
          animate={{
            x: ['0%', '50%', '0%'],
            y: ['0%', '30%', '0%'],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  );
};

/**
 * 🎨 BLOB ANIMATIONS - Blobs animados flotantes
 */
export const BlobAnimations = ({ count = 3, colors = ['#3b82f6', '#8b5cf6', '#ec4899'] }) => {
  const blobs = Array.from({ length: count }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    size: Math.random() * 400 + 200,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 15,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {blobs.map((blob) => (
        <motion.div
          key={blob.id}
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            width: blob.size,
            height: blob.size,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            left: `${blob.x}%`,
            top: `${blob.y}%`,
          }}
          animate={{
            x: [0, 100, -100, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

/**
 * ⭐ FLOATING PARTICLES - Partículas flotantes optimizadas
 */
export const FloatingParticles = ({ count = 50, color = '#3b82f6', maxSize = 4, speed = 1 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * maxSize + 1;
        this.speedX = (Math.random() - 0.5) * speed;
        this.speedY = (Math.random() - 0.5) * speed;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = `${color}${Math.floor(this.opacity * 255)
          .toString(16)
          .padStart(2, '0')}`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles = Array.from({ length: count }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Connect nearby particles
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.strokeStyle = `${color}${Math.floor(0.2 * (1 - distance / 120) * 255)
              .toString(16)
              .padStart(2, '0')}`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    window.addEventListener('resize', updateCanvasSize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [count, color, maxSize, speed]);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />
  );
};

/**
 * 🌊 LIQUID CURSOR - Cursor con efecto líquido
 */
export const LiquidCursor = ({ size = 300, color = '#3b82f6' }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed rounded-full pointer-events-none mix-blend-screen"
      style={{
        width: size,
        height: size,
        left: position.x - size / 2,
        top: position.y - size / 2,
        background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
        zIndex: 9999,
      }}
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

/**
 * 🎭 PARALLAX LAYER - Capa con efecto parallax
 */
export const ParallaxLayer = ({ children, speed = 0.5, className = '' }) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className={className}
      style={{
        transform: `translateY(${offset * speed}px)`,
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * ✨ SHIMMER WAVE - Onda brillante animada
 */
export const ShimmerWave = ({ className = '', color = '#ffffff' }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${color}40 50%, transparent 100%)`,
        }}
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};

/**
 * 🌟 GLOW EFFECT - Efecto de brillo pulsante
 */
export const GlowEffect = ({ children, color = '#3b82f6', intensity = 0.5, className = '' }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        boxShadow: [
          `0 0 20px ${color}${Math.floor(intensity * 0.3 * 255).toString(16)}`,
          `0 0 40px ${color}${Math.floor(intensity * 0.6 * 255).toString(16)}`,
          `0 0 20px ${color}${Math.floor(intensity * 0.3 * 255).toString(16)}`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * 🎨 GRADIENT BORDER - Borde con gradiente animado
 */
export const GradientBorder = ({
  children,
  colors = ['#3b82f6', '#8b5cf6', '#ec4899'],
  borderWidth = 2,
  className = '',
}) => {
  return (
    <div className={`relative ${className}`} style={{ padding: borderWidth }}>
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          background: `linear-gradient(90deg, ${colors.join(', ')})`,
          backgroundSize: '200% 100%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '200% 0%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <div className="relative bg-gray-900 rounded-xl h-full">{children}</div>
    </div>
  );
};

/**
 * 💫 STAR FIELD - Campo de estrellas animado
 */
export const StarField = ({ count = 100, className = '' }) => {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

/**
 * 🌈 RAINBOW GRADIENT - Gradiente arcoíris animado
 */
export const RainbowGradient = ({ className = '', children }) => {
  return (
    <motion.div
      className={className}
      style={{
        background:
          'linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
        backgroundSize: '200% 100%',
      }}
      animate={{
        backgroundPosition: ['0% 0%', '200% 0%', '0% 0%'],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {children}
    </motion.div>
  );
};

export default {
  GradientMesh,
  AuroraBackground,
  BlobAnimations,
  FloatingParticles,
  LiquidCursor,
  ParallaxLayer,
  ShimmerWave,
  GlowEffect,
  GradientBorder,
  StarField,
  RainbowGradient,
};
