// <� MICROINTERACCIONES AAA - NIVEL AWWWARDS 2025
// Sistema ultra-premium de interacciones: magnetic hover, parallax, particles, ripples
import { useEffect, useRef, useState } from 'react';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// ( Magnetic Hover Effect - Los elementos siguen sutilmente el cursor
export const MagneticElement = ({ children, strength = 0.3, className = '' }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  useEffect(() => {
    if (!ref.current) return;

    const handleMouseMove = (e) => {
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );

      if (distance < 200) {
        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;
        x.set(deltaX);
        y.set(deltaY);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    ref.current.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ref.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [x, y, strength]);

  return (
    <motion.div ref={ref} style={{ x: xSpring, y: ySpring }} className={className}>
      {children}
    </motion.div>
  );
};

// � Particle Cursor Trail - Estela de part�culas siguiendo el cursor
export const ParticleCursor = () => {
  const [particles, setParticles] = useState([]);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let particleId = 0;

    const handleMouseMove = (e) => {
      if (!isActive) return;

      const newParticle = {
        id: particleId++,
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 8 + 4,
        color: ['#06b6d4', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 3)],
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        },
      };

      setParticles((prev) => [...prev.slice(-15), newParticle]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isActive]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9998]">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            opacity: 0,
            scale: 0,
            x: particle.velocity.x * 20,
            y: particle.velocity.y * 20,
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
};

// 🌊 Advanced Ripple Effect - Efecto ripple mejorado
export const AdvancedRipple = ({ children, className = '' }) => {
  const [ripples, setRipples] = useState([]);

  const createRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size,
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 800);
  };

  return (
    <div className={`relative overflow-hidden ${className}`} onClick={createRipple}>
      {children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
};

// 🎭 Parallax Container - Efecto parallax con múltiples capas
export const ParallaxContainer = ({ children, layers = [] }) => {
  const containerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setScrollY(rect.top);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {layers.map((layer, idx) => (
        <motion.div
          key={idx}
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * layer.speed}px)`,
            zIndex: layer.zIndex || idx,
          }}
        >
          {layer.content}
        </motion.div>
      ))}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// ✨ Holographic Card - Efecto holográfico en hover
export const HolographicCard = ({ children, className = '' }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;

    setRotation({ x: y, y: x });
    setGlowPosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setGlowPosition({ x: 50, y: 50 });
  };

  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      animate={{
        rotateX: rotation.x,
        rotateY: rotation.y,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Holographic glow */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(6, 182, 212, 0.3), transparent 50%)`,
          filter: 'blur(20px)',
        }}
      />

      {/* Shine effect */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden"
        style={{
          background: `linear-gradient(135deg, transparent 40%, rgba(255, 255, 255, 0.1) ${glowPosition.x}%, transparent 60%)`,
        }}
      />

      {children}
    </motion.div>
  );
};

// <� Glassmorphism Premium - Glassmorphism con noise texture
export const GlassmorphismCard = ({ children, className = '', blur = 'xl', tint = 'white' }) => {
  const blurLevels = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
    '2xl': 'backdrop-blur-2xl',
  };

  const tintColors = {
    white: 'bg-white/5',
    black: 'bg-black/20',
    cyan: 'bg-zinc-9000/10',
    purple: 'bg-zinc-800/10',
    blue: 'bg-zinc-800/10',
  };

  return (
    <div className={`relative ${className}`}>
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 rounded-xl opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Glass layer */}
      <div
        className={`${blurLevels[blur]} ${tintColors[tint]} rounded-xl border border-white/10 shadow-2xl`}
      >
        {children}
      </div>
    </div>
  );
};

// < Smooth Scroll - Scroll suave con momentum
export const useSmoothScroll = () => {
  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target.closest('[data-scroll-to]');
      if (target) {
        e.preventDefault();
        const targetId = target.getAttribute('data-scroll-to');
        const element = document.getElementById(targetId);

        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
};

// <� Magnetic Button - Bot�n con efecto magn�tico ultra premium
export const MagneticButton = ({ children, onClick, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-zinc-800 to-zinc-800',
    secondary: 'bg-gradient-to-r from-zinc-800 to-zinc-700',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500',
    warning: 'bg-gradient-to-r from-orange-500 to-zinc-800',
  };

  return (
    <MagneticElement strength={0.4}>
      <AdvancedRipple>
        <motion.button
          className={`px-6 py-3 rounded-xl text-white font-semibold shadow-lg ${variants[variant]} ${className}`}
          whileHover={{
            scale: 1.05,
            boxShadow: '0 20px 40px rgba(6, 182, 212, 0.3)',
          }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
        >
          {children}
        </motion.button>
      </AdvancedRipple>
    </MagneticElement>
  );
};

export default {
  MagneticElement,
  ParticleCursor,
  AdvancedRipple,
  ParallaxContainer,
  HolographicCard,
  GlassmorphismCard,
  useSmoothScroll,
  MagneticButton,
};
