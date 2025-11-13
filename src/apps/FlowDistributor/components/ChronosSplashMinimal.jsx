import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import ChronosLogo from './ChronosLogo';

/**
 * 🌑 CHRONOS SPLASH - Ultra Premium con Microanimaciones
 * Logo animado + Texto con efectos avanzados
 * Duración: 4 segundos
 */
const ChronosSplashMinimal = ({ onComplete }) => {
  const textRef = useRef(null);
  const containerRef = useRef(null);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timeline = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 300);
      }
    });

    // Fase 1: Logo aparece y se expande (0-1.5s)
    timeline.to(containerRef.current, {
      duration: 0.8,
      opacity: 1,
      ease: 'power2.out',
      onComplete: () => setShowText(true)
    });

    // Fase 2: Texto aparece letra por letra (1.5-3s)
    timeline.add(() => {
      const letters = textRef.current?.querySelectorAll('.letter');
      if (!letters) return;

      gsap.from(letters, {
        opacity: 0,
        y: 30,
        scale: 0.7,
        rotationX: -90,
        duration: 0.5,
        stagger: {
          each: 0.08,
          ease: 'power2.out'
        }
      });
    }, '+=0.5');

    // Fase 3: Efecto de brillo que recorre el texto (2.5s)
    const updateGlowEffect = (tl) => {
      const progress = tl.progress();
      const letters = textRef.current?.querySelectorAll('.letter');
      if (!letters) return;

      for (const [i, letter] of Array.from(letters).entries()) {
        const letterProgress = (progress - i / letters.length) * letters.length;
        if (letterProgress > 0 && letterProgress < 1) {
          letter.style.textShadow = `0 0 20px rgba(255,255,255,${letterProgress}), 0 0 40px rgba(255,255,255,${letterProgress * 0.5})`;
        } else {
          letter.style.textShadow = 'none';
        }
      }
    };

    timeline.to({}, {
      duration: 1,
      onUpdate: function() {
        updateGlowEffect(this);
      }
    }, '-=0.5');

    // Fase 4: Fade out elegante (3.5-4s)
    timeline.to(containerRef.current, {
      opacity: 0,
      scale: 1.1,
      duration: 0.6,
      ease: 'power2.in'
    }, '+=0.8');

    return () => timeline.kill();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Partículas sutiles de fondo */}
      {Array.from({ length: 30 }, (_, i) => ({ id: `particle-${i}`, left: Math.random() * 100, top: Math.random() * 100 })).map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-px h-px bg-white rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`
          }}
          animate={{
            opacity: [0, 0.3, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Container principal */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ opacity: 0 }}
      >
        {/* Logo animado */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          className="mb-12"
        >
          <ChronosLogo size="xl" animated={true} />
        </motion.div>

        {/* Texto CHRONOS con microanimaciones */}
        {showText && (
          <div
            ref={textRef}
            className="relative"
          >
            <div className="text-8xl font-light tracking-[0.3em] text-white select-none relative"
              style={{
                fontFamily: '"Helvetica Neue", Arial, sans-serif',
                fontWeight: 200,
                perspective: '1000px'
              }}
            >
              {'CHRONOS'.split('').map((letter, i) => (
                <span
                  key={`chronos-letter-${i}-${letter}`}
                  className="letter inline-block relative"
                  style={{
                    opacity: 0,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {letter}
                  {/* Reflejo sutil */}
                  <span
                    className="absolute top-full left-0 opacity-20"
                    style={{
                      transform: 'scaleY(-1)',
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {letter}
                  </span>
                </span>
              ))}
            </div>

            {/* Línea decorativa inferior */}
            <motion.div
              className="absolute -bottom-6 left-1/2 h-px bg-white"
              style={{ transformOrigin: 'center' }}
              initial={{ width: 0, x: '-50%' }}
              animate={{ width: '80%' }}
              transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
            />
          </div>
        )}

        {/* Subtítulo con fade in retardado */}
        {showText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.5, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="absolute bottom-20 text-sm text-white tracking-[0.5em] font-light"
          >
            TIME CONTROL SYSTEM
          </motion.div>
        )}
      </div>
    </div>
  );
};

ChronosSplashMinimal.propTypes = {
  onComplete: PropTypes.func.isRequired
};

export default ChronosSplashMinimal;
