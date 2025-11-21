/**
 * 🎨 ANIMATED BACKGROUND PARTICLES
 * Background dinámico con partículas 3D y efectos holográficos
 */
import { useEffect, useRef } from 'react';

import { motion } from 'framer-motion';

/**
 * Partículas flotantes animadas
 */
export const AnimatedParticles = ({ count = 50, colors = ['cyan', 'blue', 'purple'] }) => {
  const particles = [...new Array(count)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={`animated-particle-${particle.id}`}
          className={`absolute rounded-full bg-${particle.color}-400/30 blur-sm`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

/**
 * Grid holográfico animado
 */
export const HolographicGrid = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Grid vertical */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
        animate={{
          x: [0, 50],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Grid horizontal */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(0deg, rgba(59,130,246,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
        animate={{
          y: [0, 50],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Punto de fuga central */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-2 h-2 bg-zinc-700 rounded-full"
        style={{ transform: 'translate(-50%, -50%)' }}
        animate={{
          scale: [1, 2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

/**
 * Olas de energía animadas
 */
export const EnergyWaves = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...new Array(3)].map((_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute inset-0 border-2 border-cyan-400/20 rounded-full"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            width: ['0%', '200%'],
            height: ['0%', '200%'],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 4,
            delay: i * 1.5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

/**
 * Luces de neón animadas
 */
export const NeonLights = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Luz superior */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-zinc-800/10 via-zinc-700/5 to-transparent blur-3xl"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Luz izquierda */}
      <motion.div
        className="absolute top-0 bottom-0 left-0 w-64 bg-gradient-to-r from-zinc-800/10 via-zinc-700/5 to-transparent blur-3xl"
        animate={{
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Luz derecha */}
      <motion.div
        className="absolute top-0 bottom-0 right-0 w-64 bg-gradient-to-l from-zinc-700/10 via-zinc-700/5 to-transparent blur-3xl"
        animate={{
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
    </div>
  );
};

/**
 * Canvas animado con efectos 3D
 */
export const AnimatedCanvas3D = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;

    class Particle3D {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 1000;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.vz = -1;
        this.color = `hsl(${180 + Math.random() * 60}, 70%, 50%)`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;

        if (this.z <= 0) {
          this.z = 1000;
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
        }

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        const scale = 1000 / this.z;
        const x2d = (this.x - canvas.width / 2) * scale + canvas.width / 2;
        const y2d = (this.y - canvas.height / 2) * scale + canvas.height / 2;
        const size = scale * 2;
        const opacity = 1 - this.z / 1000;

        ctx.fillStyle = this.color;
        ctx.globalAlpha = opacity * 0.5;
        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fill();

        // Líneas de conexión
        particles.forEach((other) => {
          if (other === this) return;
          const otherScale = 1000 / other.z;
          const ox2d = (other.x - canvas.width / 2) * otherScale + canvas.width / 2;
          const oy2d = (other.y - canvas.height / 2) * otherScale + canvas.height / 2;
          const dist = Math.hypot(x2d - ox2d, y2d - oy2d);

          if (dist < 100) {
            ctx.strokeStyle = this.color;
            ctx.globalAlpha = (1 - dist / 100) * opacity * 0.2;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(x2d, y2d);
            ctx.lineTo(ox2d, oy2d);
            ctx.stroke();
          }
        });

        ctx.globalAlpha = 1;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle3D());
    }

    let animationId;
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.3 }}
    />
  );
};

/**
 * Componente combinado de backgrounds animados
 */
export const PremiumAnimatedBackground = ({ variant = 'particles' }) => {
  const backgrounds = {
    particles: <AnimatedParticles />,
    grid: <HolographicGrid />,
    waves: <EnergyWaves />,
    neon: <NeonLights />,
    canvas3d: <AnimatedCanvas3D />,
    full: (
      <>
        <NeonLights />
        <HolographicGrid />
        <AnimatedParticles count={30} />
      </>
    ),
  };

  return backgrounds[variant] || backgrounds.particles;
};

export default PremiumAnimatedBackground;
