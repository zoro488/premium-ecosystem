import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import gsap from 'gsap';

/**
 * 🎬 CHRONOS LOGO - Minimalista Premium
 * Inspirado en diseños orbitales/cosmos - Simple, elegante, profesional
 */
const ChronosCinematicLogo = ({ onComplete }) => {
  const containerRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const timeline = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          // Confetti explosion al final
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#ffffff', '#000000', '#888888', '#cccccc']
          });
          setTimeout(onComplete, 1000);
        }, 500);
      }
    });

    // FASE 1: Partículas convergiendo (0-2s)
    timeline.to('.particle-initial', {
      duration: 2,
      scale: 1,
      opacity: 1,
      x: 0,
      y: 0,
      ease: 'power4.out',
      stagger: 0.05
    });

    // FASE 2: Formación del logo "C" (2-3.5s)
    timeline.to('.logo-path', {
      duration: 1.5,
      strokeDashoffset: 0,
      fill: '#ffffff',
      ease: 'power2.inOut'
    }, '-=0.5');

    // FASE 3: Explosion de energia (3.5-4.5s)
    timeline.to('.energy-ring', {
      duration: 1,
      scale: 3,
      opacity: 0,
      ease: 'power2.out',
      stagger: 0.1
    }, '-=0.5');

    // FASE 4: Texto aparece con morfing (4.5-6s)
    timeline.fromTo('.text-chronos', {
      opacity: 0,
      scale: 0.5,
      y: 50,
      filter: 'blur(20px)'
    }, {
      duration: 1.5,
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      ease: 'elastic.out(1, 0.5)',
      stagger: 0.05
    });

    // FASE 5: Pulso final infinito (6s+)
    timeline.to('.logo-container', {
      duration: 1.5,
      scale: 1.05,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: 2
    });

    // Actualizar fase visual
    timeline.call(() => setPhase(1), null, 2);
    timeline.call(() => setPhase(2), null, 3.5);
    timeline.call(() => setPhase(3), null, 4.5);
    timeline.call(() => setPhase(4), null, 6);

    return () => timeline.kill();
  }, [onComplete]);

  // Generar 100 partículas orbitales
  const particles = Array.from({ length: 100 }, (_, i) => {
    const angle = (i / 100) * Math.PI * 2;
    const radius = 200 + Math.random() * 300;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const delay = i * 0.02;

    return { x, y, delay, size: 2 + Math.random() * 4 };
  });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #1a1a1a 0%, #000000 100%)'
      }}
    >
      {/* Grid animado de fondo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }} />
      </div>

      {/* Partículas convergentes */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="particle-initial absolute rounded-full bg-white"
          initial={{
            x: p.x,
            y: p.y,
            scale: 0,
            opacity: 0
          }}
          style={{
            width: p.size,
            height: p.size,
            boxShadow: '0 0 10px rgba(255,255,255,0.8)',
            transitionDelay: `${p.delay}s`
          }}
        />
      ))}

      {/* Anillos de energía */}
      {[1, 2, 3, 4, 5].map((ring) => (
        <div
          key={ring}
          className="energy-ring absolute rounded-full border-2 border-white"
          style={{
            width: 100,
            height: 100,
            opacity: 0.3,
            boxShadow: '0 0 30px rgba(255,255,255,0.5)',
            transitionDelay: `${ring * 0.1}s`
          }}
        />
      ))}

      {/* Logo Container */}
      <div
        ref={logoRef}
        className="logo-container relative z-10"
      >
        {/* SVG Logo "C" con efecto de trazo */}
        <svg
          width="300"
          height="300"
          viewBox="0 0 300 300"
          className="relative"
        >
          {/* Definiciones de gradientes y filtros */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#cccccc', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#888888', stopOpacity: 1 }} />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="shadow">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.8"/>
            </filter>
          </defs>

          {/* Círculo de fondo con pulso */}
          <circle
            cx="150"
            cy="150"
            r="140"
            fill="none"
            stroke="url(#logoGradient)"
            strokeWidth="2"
            opacity="0.3"
            className="animate-pulse"
          />

          {/* Logo "C" principal - Path complejo */}
          <path
            className="logo-path"
            d="M 150 30 A 120 120 0 1 0 150 270"
            fill="none"
            stroke="url(#logoGradient)"
            strokeWidth="20"
            strokeLinecap="round"
            filter="url(#glow)"
            style={{
              strokeDasharray: 1000,
              strokeDashoffset: 1000
            }}
          />

          {/* Detalles internos del logo */}
          <circle
            cx="150"
            cy="150"
            r="100"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
            className="logo-path"
            style={{
              strokeDasharray: 630,
              strokeDashoffset: 630
            }}
          />

          {/* Partículas orbitales internas */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x = 150 + Math.cos(rad) * 80;
            const y = 150 + Math.sin(rad) * 80;

            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="white"
                opacity="0"
                className="logo-path"
                style={{
                  animation: `orbitPulse 2s infinite ${i * 0.2}s`
                }}
              />
            );
          })}
        </svg>

        {/* Texto CHRONOS con efecto glitch */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div className="relative">
            {/* Capa de resplandor */}
            <div
              className="absolute inset-0 text-6xl font-black tracking-widest blur-xl opacity-50"
              style={{ color: '#ffffff' }}
            >
              {'CHRONOS'.split('').map((char, i) => (
                <span
                  key={i}
                  className="text-chronos inline-block"
                  style={{
                    opacity: 0,
                    transitionDelay: `${i * 0.1}s`
                  }}
                >
                  {char}
                </span>
              ))}
            </div>

            {/* Texto principal con efecto metálico */}
            <div
              className="relative text-6xl font-black tracking-widest"
              style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #cccccc 50%, #888888 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 20px rgba(0,0,0,0.8)'
              }}
            >
              {'CHRONOS'.split('').map((char, i) => (
                <span
                  key={i}
                  className="text-chronos inline-block"
                  style={{
                    opacity: 0,
                    transitionDelay: `${i * 0.1}s`
                  }}
                >
                  {char}
                </span>
              ))}
            </div>

            {/* Subtítulo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 6.5, duration: 1 }}
              className="text-center text-sm tracking-[0.5em] mt-4 text-gray-400 font-light"
            >
              FINANCIAL SYSTEM
            </motion.div>
          </div>
        </div>

        {/* Rayos de luz radiales */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 origin-left h-1 bg-gradient-to-r from-white to-transparent"
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: phase >= 2 ? 200 : 0,
              opacity: phase >= 2 ? [0, 0.6, 0] : 0
            }}
            transition={{
              duration: 1,
              delay: 3.5 + i * 0.05,
              repeat: Infinity,
              repeatDelay: 2
            }}
            style={{
              transform: `rotate(${angle}deg)`,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      {/* Contador de progreso discreto */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-mono"
      >
        {phase === 0 && 'Initializing...'}
        {phase === 1 && 'Loading Core...'}
        {phase === 2 && 'Activating Systems...'}
        {phase === 3 && 'Synchronizing...'}
        {phase === 4 && 'Ready'}
      </motion.div>

      {/* Estilos de animación */}
      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        @keyframes orbitPulse {
          0%, 100% { opacity: 0; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        .logo-path {
          transition: all 0.3s ease;
        }

        .text-chronos {
          transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .particle-initial {
          transition: all 2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .energy-ring {
          transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
};

ChronosCinematicLogo.propTypes = {
  onComplete: PropTypes.func.isRequired
};

export default ChronosCinematicLogo;
