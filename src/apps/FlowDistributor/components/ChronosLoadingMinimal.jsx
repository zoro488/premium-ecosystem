import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import ChronosLogo from './ChronosLogo';

/**
 * ⚛️ CHRONOS LOADING - Ultra Premium con Microanimaciones
 * Logo orbital + Progress + Mensajes dinámicos
 */
const ChronosLoadingMinimal = ({ progress = 0 }) => {
  const progressBarRef = useRef(null);
  const [statusMessage, setStatusMessage] = useState('Initializing');

  const messages = [
    { threshold: 0, text: 'Initializing System', icon: '◐' },
    { threshold: 20, text: 'Loading Core Modules', icon: '◓' },
    { threshold: 40, text: 'Connecting Database', icon: '◑' },
    { threshold: 60, text: 'Securing Connection', icon: '◒' },
    { threshold: 80, text: 'Preparing Interface', icon: '◐' },
    { threshold: 95, text: 'Almost Ready', icon: '◓' }
  ];

  useEffect(() => {
    // Actualizar mensaje basado en progreso
    const currentMessage = messages.reverse().find(m => progress >= m.threshold);
    if (currentMessage) {
      setStatusMessage(currentMessage.text);
    }

    // Animación de la barra de progreso con efecto wave
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        scaleX: progress / 100,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [progress]);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Grid animado de fondo */}
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Partículas flotantes mejoradas */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={`particle-${Math.random()}-${i}`}
          className="absolute bg-white rounded-full"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.4, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            delay: Math.random() * 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Contenedor principal */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        {/* Logo con efecto pulsante */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="mb-16"
        >
          <ChronosLogo size="xl" animated={true} />
        </motion.div>

        {/* Texto CHRONOS con efecto de typing */}
        <motion.div
          initial={{ opacity: 0, letterSpacing: '1em' }}
          animate={{ opacity: 1, letterSpacing: '0.3em' }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-3xl font-light text-white mb-4"
          style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
        >
          CHRONOS
        </motion.div>

        {/* Mensaje de estado con icono animado */}
        <motion.div
          key={statusMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-3 mb-12 text-white/60 text-sm"
        >
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-lg"
          >
            {messages.find(m => m.text === statusMessage)?.icon || '◐'}
          </motion.span>
          <span className="tracking-wide">{statusMessage}</span>
        </motion.div>

        {/* Barra de progreso mejorada */}
        <div className="w-80 relative">
          {/* Container de la barra */}
          <div className="h-px bg-white/10 relative overflow-hidden rounded-full">
            {/* Barra de progreso con gradiente */}
            <div
              ref={progressBarRef}
              className="absolute inset-y-0 left-0 origin-left"
              style={{
                width: '100%',
                transform: 'scaleX(0)',
                background: 'linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,1), rgba(255,255,255,0.3))',
                boxShadow: '0 0 10px rgba(255,255,255,0.5)'
              }}
            />

            {/* Efecto de brillo que se mueve */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                width: '30%'
              }}
              animate={{
                x: ['-100%', '400%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          </div>

          {/* Puntos de progreso */}
          <div className="absolute -top-1 left-0 right-0 flex justify-between">
            {[0, 25, 50, 75, 100].map((point, i) => (
              <motion.div
                key={point}
                className="w-1 h-1 rounded-full"
                style={{
                  background: progress >= point ? '#ffffff' : 'rgba(255,255,255,0.2)'
                }}
                animate={progress >= point ? {
                  scale: [1, 1.5, 1],
                  boxShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 8px rgba(255,255,255,1)', '0 0 0px rgba(255,255,255,0)']
                } : {}}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        </div>

        {/* Porcentaje con animación de conteo */}
        <motion.div
          className="mt-6 text-white/40 font-mono text-sm"
          key={Math.floor(progress)}
        >
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {Math.floor(progress)}%
          </motion.span>
        </motion.div>

        {/* Línea decorativa inferior pulsante */}
        <motion.div
          className="absolute bottom-20 left-1/2 h-px bg-white/20"
          style={{ width: 200, x: '-50%' }}
          animate={{
            scaleX: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>
    </div>
  );
};

ChronosLoadingMinimal.propTypes = {
  progress: PropTypes.number
};

export default ChronosLoadingMinimal;
