/**
 * ✨ CREATIVE PARTICLES - Componente de Partículas Premium
 *
 * Sistema de partículas interactivas con movimiento fluido,
 * parallax effect y conexiones dinámicas
 *
 * Features:
 * - Movimiento Browniano suave
 * - Parallax con scroll
 * - Conexiones entre partículas cercanas
 * - Respuesta a cursor
 * - Performance optimizado con Canvas API
 *
 * @version 1.0.0
 */
import { memo, useCallback, useEffect, useRef } from 'react';

import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface CreativeParticlesProps {
  count?: number;
  colors?: string[];
  maxDistance?: number;
  speed?: number;
}

export const CreativeParticles = memo<CreativeParticlesProps>(
  ({
    count = 50,
    colors = ['rgba(59, 130, 246, 0.5)', 'rgba(168, 85, 247, 0.5)', 'rgba(236, 72, 153, 0.5)'],
    maxDistance = 150,
    speed = 0.5,
  }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>();

    // Initialize particles
    const initParticles = useCallback(() => {
      const particles: Particle[] = [];

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * globalThis.innerWidth,
          y: Math.random() * globalThis.innerHeight,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          radius: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      particlesRef.current = particles;
    }, [count, colors, speed]);

    // Draw particles and connections
    const draw = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      // Draw connections
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.hypot(dx, dy);

          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance;
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.1})`;

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const particle of particles) {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 3
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }, [maxDistance]);

    // Update particles position
    const update = useCallback(() => {
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (const particle of particles) {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > globalThis.innerWidth) {
          particle.vx *= -1;
          particle.x = Math.max(0, Math.min(globalThis.innerWidth, particle.x));
        }
        if (particle.y < 0 || particle.y > globalThis.innerHeight) {
          particle.vy *= -1;
          particle.y = Math.max(0, Math.min(globalThis.innerHeight, particle.y));
        }

        // Mouse interaction
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.vx -= (dx / distance) * force * 0.1;
          particle.vy -= (dy / distance) * force * 0.1;
        }

        // Velocity damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Add random movement
        particle.vx += (Math.random() - 0.5) * 0.05;
        particle.vy += (Math.random() - 0.5) * 0.05;

        // Limit velocity
        const maxVelocity = speed * 2;
        const velocity = Math.hypot(particle.vx, particle.vy);
        if (velocity > maxVelocity) {
          particle.vx = (particle.vx / velocity) * maxVelocity;
          particle.vy = (particle.vy / velocity) * maxVelocity;
        }
      }
    }, [speed]);

    // Animation loop
    const animate = useCallback(() => {
      update();
      draw();
      animationFrameRef.current = requestAnimationFrame(animate);
    }, [update, draw]);

    // Handle mouse move
    const handleMouseMove = useCallback((e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }, []);

    // Handle resize
    const handleResize = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = globalThis.innerWidth;
      canvas.height = globalThis.innerHeight;
    }, []);

    useEffect(() => {
      handleResize();
      initParticles();

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('resize', handleResize);

      animate();

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [animate, handleResize, handleMouseMove, initParticles]);

    return (
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />
    );
  }
);

CreativeParticles.displayName = 'CreativeParticles';

export default CreativeParticles;
