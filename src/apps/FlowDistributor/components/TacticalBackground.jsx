/**
 * 🌌 TACTICAL BACKGROUND
 * Fondo animado con efectos tácticos para CHRONOS
 */
import { useEffect, useRef } from 'react';

import { motion } from 'framer-motion';

const TacticalBackground = ({ intensity = 'medium', className = '', children }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  // Configuración según intensidad
  const intensityConfig = {
    low: {
      particleCount: 50,
      connectionDistance: 100,
      speed: 0.3,
      opacity: 0.3,
    },
    medium: {
      particleCount: 100,
      connectionDistance: 120,
      speed: 0.5,
      opacity: 0.4,
    },
    high: {
      particleCount: 200,
      connectionDistance: 150,
      speed: 0.8,
      opacity: 0.6,
    },
  };

  const config = intensityConfig[intensity] || intensityConfig.medium;

  // Clase de partícula
  class TacticalParticle {
    constructor(canvas) {
      this.canvas = canvas;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * config.speed;
      this.vy = (Math.random() - 0.5) * config.speed;
      this.size = Math.random() * 2 + 1;
      this.opacity = Math.random() * config.opacity + 0.1;
      this.color = this.getRandomColor();
      this.pulsePhase = Math.random() * Math.PI * 2;
    }

    getRandomColor() {
      const colors = [
        'rgba(255, 102, 0', // Orange
        'rgba(255, 0, 0', // Red
        'rgba(0, 255, 100', // Green
        'rgba(0, 150, 255', // Blue
        'rgba(255, 215, 0', // Gold
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;

      // Keep within bounds
      this.x = Math.max(0, Math.min(this.canvas.width, this.x));
      this.y = Math.max(0, Math.min(this.canvas.height, this.y));

      // Update pulse
      this.pulsePhase += 0.02;
    }

    draw(ctx) {
      const pulse = (Math.sin(this.pulsePhase) + 1) * 0.5;
      const currentOpacity = this.opacity * (0.5 + pulse * 0.5);

      ctx.fillStyle = `${this.color}, ${currentOpacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * (0.8 + pulse * 0.4), 0, Math.PI * 2);
      ctx.fill();

      // Add glow effect
      ctx.shadowColor = `${this.color}, ${currentOpacity * 2})`;
      ctx.shadowBlur = this.size * 2;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    distanceTo(other) {
      const dx = this.x - other.x;
      const dy = this.y - other.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  }

  // Inicializar canvas y partículas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Configurar canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Crear partículas
    particlesRef.current = Array.from(
      { length: config.particleCount },
      () => new TacticalParticle(canvas)
    );

    // Función de animación
    const animate = () => {
      // Limpiar canvas con efecto de trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar grid táctico sutil
      drawTacticalGrid(ctx, canvas);

      // Actualizar y dibujar partículas
      particlesRef.current.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });

      // Dibujar conexiones entre partículas cercanas
      drawConnections(ctx);

      // Dibujar efectos de scanlines
      drawScanlines(ctx, canvas);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config]);

  // Dibujar grid táctico
  const drawTacticalGrid = (ctx, canvas) => {
    const gridSize = 50;
    ctx.strokeStyle = 'rgba(255, 102, 0, 0.05)';
    ctx.lineWidth = 0.5;

    // Líneas verticales
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Líneas horizontales
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  // Dibujar conexiones entre partículas
  const drawConnections = (ctx) => {
    const particles = particlesRef.current;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const distance = particles[i].distanceTo(particles[j]);

        if (distance < config.connectionDistance) {
          const opacity = (1 - distance / config.connectionDistance) * 0.3;

          ctx.strokeStyle = `rgba(255, 102, 0, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  };

  // Dibujar efecto de scanlines
  const drawScanlines = (ctx, canvas) => {
    const time = Date.now() * 0.001;
    const scanlineY = (Math.sin(time * 0.5) + 1) * 0.5 * canvas.height;

    // Scanline principal
    const gradient = ctx.createLinearGradient(0, scanlineY - 20, 0, scanlineY + 20);
    gradient.addColorStop(0, 'rgba(255, 102, 0, 0)');
    gradient.addColorStop(0.5, 'rgba(255, 102, 0, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 102, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, scanlineY - 20, canvas.width, 40);

    // Scanlines horizontales sutiles
    for (let y = 0; y < canvas.height; y += 4) {
      ctx.fillStyle = 'rgba(255, 102, 0, 0.01)';
      ctx.fillRect(0, y, canvas.width, 1);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Canvas de fondo */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'transparent' }}
      />

      {/* Efectos de overlay adicionales */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(255, 102, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(255, 0, 0, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 50% 20%, rgba(0, 255, 100, 0.03) 0%, transparent 50%)
          `,
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Efecto de holographic sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)',
          width: '200%',
        }}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Contenido */}
      <div className="relative z-10">{children}</div>

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 60%, rgba(0, 0, 0, 0.3) 100%)',
        }}
      />
    </div>
  );
};

export default TacticalBackground;
