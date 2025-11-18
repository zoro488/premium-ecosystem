import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/* eslint-disable react/prop-types */

/**
 * 🌟 SISTEMA DE PARTÍCULAS Y EFECTOS VISUALES
 * Efectos de partículas, gradientes animados y backgrounds dinámicos
 */

// ============================================
// ANIMATED PARTICLES BACKGROUND
// ============================================
export const ParticlesBackground = ({
  particleCount = 50,
  color = 'rgba(99, 102, 241, 0.5)',
  speed = 'normal'
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    let speedMultiplier = 1;
    if (speed === 'fast') speedMultiplier = 2;
    else if (speed === 'slow') speedMultiplier = 0.5;

    /* eslint-disable */
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * speedMultiplier;
        this.vy = (Math.random() - 0.5) * speedMultiplier;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }
    /* eslint-enable */

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        // Draw connections
        for (let j = index + 1; j < particles.length; j++) {
          const dx = particles[j].x - particle.x;
          const dy = particles[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = color.replace('0.5', `${0.2 * (1 - distance / 100)}`);
            ctx.lineWidth = 1;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [particleCount, color, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};

// ============================================
// GRADIENT ORBS
// ============================================
export const GradientOrbs = ({ count = 3 }) => {
  const orbs = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 300 + 200,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 2,
  }));

  const colors = [
    'from-zinc-800/30 to-zinc-800/30',
    'from-zinc-800/30 to-zinc-700/30',
    'from-zinc-700/30 to-orange-500/30',
    'from-green-500/30 to-zinc-800/30',
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {orbs.map((orb, index) => (
        <motion.div
          key={orb.id}
          className={`absolute rounded-full bg-gradient-to-br ${colors[index % colors.length]} blur-3xl`}
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// FLOATING SHAPES
// ============================================
export const FloatingShapes = ({ shapeCount = 10 }) => {
  const shapes = Array.from({ length: shapeCount }, (_, i) => ({
    id: i,
    size: Math.random() * 50 + 30,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
    shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)],
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute ${
            shape.shape === 'circle'
              ? 'rounded-full'
              : shape.shape === 'square'
              ? 'rounded-lg'
              : ''
          } bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm`}
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.left,
            top: '-10%',
          }}
          animate={{
            y: ['0vh', '110vh'],
            rotate: [0, 360],
            x: [0, Math.random() * 100 - 50],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// GRID PATTERN BACKGROUND
// ============================================
export const GridPattern = ({
  gridSize = 50,
  lineColor = 'rgba(99, 102, 241, 0.1)',
  glowColor = 'rgba(99, 102, 241, 0.3)'
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="grid"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke={lineColor}
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="gridGlow">
            <stop offset="0%" stopColor={glowColor} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <ellipse
          cx="50%"
          cy="50%"
          rx="40%"
          ry="40%"
          fill="url(#gridGlow)"
          className="animate-pulse-glow"
        />
      </svg>
    </div>
  );
};

// ============================================
// WAVE ANIMATION BACKGROUND
// ============================================
export const WaveBackground = ({ waveCount = 3 }) => {
  const waves = Array.from({ length: waveCount }, (_, i) => ({
    id: i,
    delay: i * 0.5,
    opacity: 0.1 - i * 0.02,
    speed: 3 + i,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {waves.map((wave) => (
        <motion.div
          key={wave.id}
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, transparent 0%, rgba(99, 102, 241, ${wave.opacity}) 50%, transparent 100%)`,
          }}
          animate={{
            y: ['0%', '100%'],
          }}
          transition={{
            duration: wave.speed,
            delay: wave.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// SPOTLIGHT EFFECT
// ============================================
export const SpotlightEffect = () => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
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
    </div>
  );
};

// ============================================
// AURORA BACKGROUND
// ============================================
export const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 opacity-50">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-zinc-800/20 via-zinc-700/20 to-zinc-800/20"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundSize: '200% 200%',
            filter: 'blur(60px)',
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-l from-zinc-800/20 via-green-500/20 to-zinc-800/20"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundSize: '200% 200%',
            filter: 'blur(80px)',
          }}
        />
      </div>
    </div>
  );
};

// ============================================
// STARS FIELD
// ============================================
export const StarsField = ({ starCount = 100 }) => {
  const stars = Array.from({ length: starCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            width: star.size,
            height: star.size,
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// MESH GRADIENT ANIMATED
// ============================================
export const MeshGradient = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.2) 0, transparent 50%),
            radial-gradient(at 100% 0%, rgba(168, 85, 247, 0.2) 0, transparent 50%),
            radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.2) 0, transparent 50%),
            radial-gradient(at 0% 100%, rgba(16, 185, 129, 0.2) 0, transparent 50%)
          `,
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

// ============================================
// CURSOR GLOW TRAIL
// ============================================
export const CursorGlowTrail = ({ color = 'rgba(99, 102, 241, 0.5)' }) => {
  const [trail, setTrail] = React.useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newPoint = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now(),
      };

      setTrail((prev) => [...prev, newPoint].slice(-20));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrail((prev) => prev.slice(1));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          className="absolute w-4 h-4 rounded-full"
          style={{
            left: point.x - 8,
            top: point.y - 8,
            background: color,
            filter: 'blur(4px)',
          }}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
        />
      ))}
    </div>
  );
};

// ============================================
// COMPOSITE BACKGROUND (All effects combined)
// ============================================
export const PremiumBackground = ({
  theme = 'aurora', // aurora, particles, mesh, stars, grid
  interactive = false
}) => {
  const renderBackground = () => {
    switch (theme) {
      case 'aurora':
        return <AuroraBackground />;
      case 'particles':
        return <ParticlesBackground />;
      case 'mesh':
        return <MeshGradient />;
      case 'stars':
        return <StarsField />;
      case 'grid':
        return <GridPattern />;
      case 'orbs':
        return <GradientOrbs />;
      case 'waves':
        return <WaveBackground />;
      default:
        return <AuroraBackground />;
    }
  };

  return (
    <>
      {renderBackground()}
      {interactive && <SpotlightEffect />}
    </>
  );
};

export default {
  ParticlesBackground,
  GradientOrbs,
  FloatingShapes,
  GridPattern,
  WaveBackground,
  SpotlightEffect,
  AuroraBackground,
  StarsField,
  MeshGradient,
  CursorGlowTrail,
  PremiumBackground,
};
