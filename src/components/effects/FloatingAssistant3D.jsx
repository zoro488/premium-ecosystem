/**
 * > FLOATING ASSISTANT 3D - Personaje Animado Flotante
 * Bolita 3D con ojos que flota, se mueve, reacciona e interact�a
 */
import { useEffect, useRef, useState } from 'react';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const FloatingAssistant3D = ({
  position = 'bottom-right',
  size = 80,
  color = 'cyan',
  mood = 'happy', // happy, excited, thinking, winking
}) => {
  const [currentMood, setCurrentMood] = useState(mood);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Valores de movimiento suaves
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics para movimiento fluido
  const springConfig = { damping: 20, stiffness: 200 };
  const eyeX = useSpring(mouseX, springConfig);
  const eyeY = useSpring(mouseY, springConfig);

  // Transformaciones para movimiento 3D
  const rotateX = useTransform(eyeY, [-100, 100], [10, -10]);
  const rotateY = useTransform(eyeX, [-100, 100], [-10, 10]);

  // Seguimiento del mouse
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Limitar el rango de movimiento de los ojos
      const maxDistance = 15;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const angle = Math.atan2(deltaY, deltaX);

      if (distance < 200) {
        // Solo reaccionar cuando el mouse est� cerca
        const limitedDistance = Math.min(distance / 10, maxDistance);
        mouseX.set(Math.cos(angle) * limitedDistance);
        mouseY.set(Math.sin(angle) * limitedDistance);
      } else {
        mouseX.set(0);
        mouseY.set(0);
      }

      setMousePos({ x: deltaX, y: deltaY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Cambiar de humor aleatoriamente
  useEffect(() => {
    const moods = ['happy', 'excited', 'thinking', 'winking'];
    const interval = setInterval(() => {
      if (!isHovered && Math.random() > 0.7) {
        setCurrentMood(moods[Math.floor(Math.random() * moods.length)]);
        setTimeout(() => setCurrentMood('happy'), 2000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered]);

  // Posicionamiento
  const positions = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  // Colores
  const colors = {
    cyan: {
      body: 'from-cyan-400 via-cyan-500 to-blue-500',
      shine: 'bg-gradient-to-br from-white/40 to-transparent',
      shadow: 'rgba(6, 182, 212, 0.5)',
    },
    purple: {
      body: 'from-zinc-800 via-zinc-800 to-zinc-800',
      shine: 'bg-gradient-to-br from-white/40 to-transparent',
      shadow: 'rgba(139, 92, 246, 0.5)',
    },
    green: {
      body: 'from-green-400 via-emerald-500 to-teal-500',
      shine: 'bg-gradient-to-br from-white/40 to-transparent',
      shadow: 'rgba(16, 185, 129, 0.5)',
    },
  };

  const currentColor = colors[color] || colors.cyan;

  // Expresiones de ojos seg�n el humor
  const eyeExpressions = {
    happy: { leftEye: '50%', rightEye: '50%', size: '30%', shape: 'rounded-full' },
    excited: { leftEye: '50%', rightEye: '50%', size: '40%', shape: 'rounded-full' },
    thinking: { leftEye: '45%', rightEye: '55%', size: '25%', shape: 'rounded-full' },
    winking: { leftEye: '50%', rightEye: '0%', size: '30%', shape: 'rounded-full' },
  };

  const currentExpression = eyeExpressions[currentMood] || eyeExpressions.happy;

  return (
    <motion.div
      ref={containerRef}
      className={`fixed ${positions[position]} z-50 pointer-events-none`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* Contenedor 3D con perspectiva */}
      <motion.div
        className="relative pointer-events-auto cursor-pointer"
        style={{
          width: size,
          height: size,
          perspective: '1000px',
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setCurrentMood('excited');
          setTimeout(() => setCurrentMood('happy'), 1000);
        }}
      >
        {/* Flotaci�n continua */}
        <motion.div
          animate={{
            y: [-8, 8, -8],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Cuerpo 3D con rotaci�n seg�n mouse */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
            className="relative w-full h-full"
          >
            {/* Sombra proyectada */}
            <motion.div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full opacity-30 blur-md"
              style={{
                background: currentColor.shadow,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Cuerpo principal - esfera 3D */}
            <div
              className={`w-full h-full rounded-full bg-gradient-to-br ${currentColor.body} relative shadow-2xl`}
              style={{
                boxShadow: `0 20px 60px ${currentColor.shadow}, inset 0 -20px 40px rgba(0,0,0,0.2)`,
              }}
            >
              {/* Brillo superior */}
              <div
                className={`absolute top-2 left-4 w-8 h-8 ${currentColor.shine} rounded-full blur-sm`}
              />

              {/* Ojos contenedor */}
              <div className="absolute inset-0 flex items-center justify-center gap-3">
                {/* Ojo izquierdo */}
                <motion.div
                  className="relative"
                  animate={{
                    scaleY: currentMood === 'winking' ? [1, 0.1, 1] : 1,
                  }}
                  transition={{
                    duration: 0.3,
                    repeat: currentMood === 'winking' ? Infinity : 0,
                    repeatDelay: 2,
                  }}
                >
                  {/* Blanco del ojo */}
                  <div
                    className="bg-white rounded-full shadow-inner"
                    style={{
                      width: size * 0.25,
                      height: size * 0.25,
                    }}
                  >
                    {/* Pupila que sigue el mouse */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 bg-gray-900 rounded-full"
                      style={{
                        width: currentExpression.size,
                        height: currentExpression.size,
                        x: eyeX,
                        y: eyeY,
                        marginLeft: '-15%',
                        marginTop: '-15%',
                      }}
                    >
                      {/* Brillo en la pupila */}
                      <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-80" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Ojo derecho */}
                <motion.div
                  className="relative"
                  animate={{
                    scaleY: currentMood === 'winking' ? 1 : 1,
                  }}
                >
                  {/* Blanco del ojo */}
                  <div
                    className="bg-white rounded-full shadow-inner"
                    style={{
                      width: size * 0.25,
                      height: currentMood === 'winking' ? size * 0.03 : size * 0.25,
                      transition: 'height 0.3s ease',
                    }}
                  >
                    {currentMood !== 'winking' && (
                      <motion.div
                        className="absolute top-1/2 left-1/2 bg-gray-900 rounded-full"
                        style={{
                          width: currentExpression.size,
                          height: currentExpression.size,
                          x: eyeX,
                          y: eyeY,
                          marginLeft: '-15%',
                          marginTop: '-15%',
                        }}
                      >
                        <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-80" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Boca */}
              <motion.div
                className="absolute bottom-6 left-1/2 -translate-x-1/2"
                animate={{
                  scale: isHovered ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 0.5,
                  repeat: isHovered ? Infinity : 0,
                }}
              >
                {currentMood === 'happy' && (
                  <div className="w-8 h-4 border-2 border-white/80 rounded-b-full" />
                )}
                {currentMood === 'excited' && (
                  <div className="w-10 h-5 border-3 border-white/80 rounded-b-full" />
                )}
                {currentMood === 'thinking' && <div className="w-6 h-1 bg-white/80 rounded-full" />}
                {currentMood === 'winking' && (
                  <div className="w-6 h-3 border-2 border-white/80 rounded-full" />
                )}
              </motion.div>

              {/* Part�culas flotantes alrededor */}
              {isHovered && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-2 h-2 rounded-full bg-gradient-to-br ${currentColor.body}`}
                      style={{
                        top: '50%',
                        left: '50%',
                      }}
                      animate={{
                        x: [0, Math.cos((i * Math.PI * 2) / 6) * 50],
                        y: [0, Math.sin((i * Math.PI * 2) / 6) * 50],
                        opacity: [1, 0],
                        scale: [1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </>
              )}
            </div>

            {/* Anillo orbital */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/20"
              style={{
                transform: 'translateZ(20px)',
              }}
              animate={{
                rotate: 360,
                scale: [1, 1.05, 1],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Tooltip cuando hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/90 backdrop-blur-sm rounded-lg text-white text-xs whitespace-nowrap"
        >
          �Hola! Soy tu asistente =
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default FloatingAssistant3D;
