/**
 * ⚡ CHRONOS LOGIN ULTRA PREMIUM - MEJOR QUE LOS PANELES
 *
 * Pantalla de autenticación épica con:
 * - Glassmorphism avanzado
 * - Animaciones 3D en tiempo real
 * - Efectos de partículas inteligentes
 * - Validación premium con micro-interacciones
 * - Diseño blanco/negro ultra moderno
 *
 * @version 3.0.0 - ULTRA PREMIUM EDITION
 */

import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import PropTypes from 'prop-types';
import { Eye, EyeOff, Lock, Mail, Sparkles, Zap, ArrowRight, Shield } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

const ChronosLoginUltraPremium = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState('');

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  // Partículas flotantes
  const particles = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 1 + Math.random() * 2,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 5,
    }))
  , []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - globalThis.innerWidth / 2);
      mouseY.set(e.clientY - globalThis.innerHeight / 2);
    };
    globalThis.addEventListener('mousemove', handleMouseMove);
    return () => globalThis.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);

    // Simulación de autenticación (reemplazar con lógica real)
    setTimeout(() => {
      if (email && password.length >= 6) {
        onLogin();
      } else {
        setError('Credenciales inválidas');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Grid técnico de fondo */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
          }}
        />
      </div>

      {/* Partículas flotantes */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.x,
            top: particle.y,
          }}
          animate={{
            y: [particle.y, particle.y - 100, particle.y],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Rayos de luz diagonal */}
      {[20, 50, 80].map((left) => (
        <motion.div
          key={`light-${left}`}
          className="absolute w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"
          style={{ left: `${left}%` }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: left / 50,
          }}
        />
      ))}

      {/* Contenedor principal con efecto 3D */}
      <motion.div
        className="relative z-10 w-full max-w-md px-6"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          perspective: 2000,
        }}
      >
        {/* Card de login con glassmorphism ultra */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 1,
            type: 'spring',
            stiffness: 100,
            damping: 20,
          }}
        >
          {/* Glow effect exterior */}
          <motion.div
            className="absolute -inset-8 rounded-3xl blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Card principal */}
          <div
            className="relative rounded-3xl p-10 backdrop-blur-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: `
                0 30px 60px -20px rgba(0, 0, 0, 0.8),
                inset 0 2px 4px rgba(255, 255, 255, 0.1),
                0 0 80px -20px rgba(255, 255, 255, 0.05)
              `,
            }}
          >
            {/* Header con logo */}
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Logo icon */}
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 10px 30px -10px rgba(255, 255, 255, 0.2)',
                }}
                animate={{
                  boxShadow: [
                    '0 10px 30px -10px rgba(255, 255, 255, 0.2)',
                    '0 15px 40px -10px rgba(255, 255, 255, 0.4)',
                    '0 10px 30px -10px rgba(255, 255, 255, 0.2)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Zap className="w-10 h-10 text-white" strokeWidth={1.5} />
              </motion.div>

              {/* Título CHRONOS */}
              <motion.h1
                className="text-5xl font-thin tracking-[0.3em] mb-3"
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 100,
                  background: 'linear-gradient(135deg, #ffffff 0%, #d0d0d0 50%, #ffffff 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 30px rgba(255, 255, 255, 0.2)',
                }}
              >
                CHRONOS
              </motion.h1>

              {/* Subtítulo con iconos */}
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="w-4 h-4 text-white/40" />
                <p className="text-white/50 text-xs tracking-[0.25em] uppercase font-light">
                  Enterprise System
                </p>
                <Sparkles className="w-4 h-4 text-white/40" />
              </div>

              {/* Línea decorativa */}
              <motion.div
                className="h-px w-32 mx-auto mt-6 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  scaleX: [0.7, 1, 0.7],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>

            {/* Formulario */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {/* Campo Email */}
              <div className="relative">
                <motion.label
                  className="block text-white/60 text-xs tracking-wider uppercase mb-3 font-light"
                  animate={{
                    color: focusedField === 'email' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)',
                  }}
                >
                  Correo Electrónico
                </motion.label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <Mail className="w-5 h-5 text-white/40" strokeWidth={1.5} />
                  </div>
                  <motion.input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl text-white bg-transparent outline-none transition-all duration-300"
                    style={{
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                    }}
                    placeholder="usuario@chronos.com"
                    animate={{
                      borderColor: focusedField === 'email' ?
                        'rgba(255, 255, 255, 0.3)' :
                        'rgba(255, 255, 255, 0.1)',
                      boxShadow: focusedField === 'email' ?
                        '0 0 20px rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.05)' :
                        'none',
                    }}
                    whileFocus={{ scale: 1.01 }}
                  />
                  {/* Línea de glow inferior */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={{
                      scaleX: focusedField === 'email' ? 1 : 0,
                      opacity: focusedField === 'email' ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Campo Password */}
              <div className="relative">
                <motion.label
                  className="block text-white/60 text-xs tracking-wider uppercase mb-3 font-light"
                  animate={{
                    color: focusedField === 'password' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)',
                  }}
                >
                  Contraseña
                </motion.label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <Lock className="w-5 h-5 text-white/40" strokeWidth={1.5} />
                  </div>
                  <motion.input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-14 py-4 rounded-xl text-white bg-transparent outline-none transition-all duration-300"
                    style={{
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                    }}
                    placeholder="••••••••••"
                    animate={{
                      borderColor: focusedField === 'password' ?
                        'rgba(255, 255, 255, 0.3)' :
                        'rgba(255, 255, 255, 0.1)',
                      boxShadow: focusedField === 'password' ?
                        '0 0 20px rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.05)' :
                        'none',
                    }}
                    whileFocus={{ scale: 1.01 }}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-white/40 hover:text-white/70 transition-colors" strokeWidth={1.5} />
                    ) : (
                      <Eye className="w-5 h-5 text-white/40 hover:text-white/70 transition-colors" strokeWidth={1.5} />
                    )}
                  </motion.button>
                  <motion.div
                    className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={{
                      scaleX: focusedField === 'password' ? 1 : 0,
                      opacity: focusedField === 'password' ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="p-4 rounded-xl text-sm text-red-300"
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                    }}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botón de login */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full group relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="relative py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 10px 30px -10px rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: 'easeInOut',
                    }}
                  />

                  {isLoading ? (
                    <motion.div
                      className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  ) : (
                    <>
                      <Shield className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" strokeWidth={1.5} />
                      <span className="text-white/90 font-light tracking-wider uppercase text-sm group-hover:text-white transition-colors">
                        Acceder al Sistema
                      </span>
                      <ArrowRight className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" strokeWidth={1.5} />
                    </>
                  )}
                </div>
              </motion.button>

              {/* Links adicionales */}
              <div className="flex items-center justify-between pt-4">
                <motion.button
                  type="button"
                  className="text-white/40 text-xs tracking-wider hover:text-white/70 transition-colors uppercase font-light"
                  whileHover={{ scale: 1.05 }}
                >
                  ¿Olvidaste tu contraseña?
                </motion.button>
                <motion.button
                  type="button"
                  className="text-white/40 text-xs tracking-wider hover:text-white/70 transition-colors uppercase font-light"
                  whileHover={{ scale: 1.05 }}
                >
                  Ayuda
                </motion.button>
              </div>
            </motion.form>

            {/* Footer con info de seguridad */}
            <motion.div
              className="mt-8 pt-6 border-t border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center justify-center gap-2 text-white/30 text-xs">
                <Shield className="w-3 h-3" strokeWidth={1.5} />
                <span className="tracking-wider font-light uppercase">
                  Conexión Segura SSL/TLS
                </span>
              </div>
            </motion.div>
          </div>

          {/* Corners decorativos */}
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
            <motion.div
              key={corner}
              className={`absolute w-12 h-12 ${
                corner.includes('top') ? 'top-0' : 'bottom-0'
              } ${
                corner.includes('left') ? 'left-0' : 'right-0'
              }`}
              style={{
                borderTop: corner.includes('top') ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                borderBottom: corner.includes('bottom') ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                borderLeft: corner.includes('left') ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                borderRight: corner.includes('right') ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
              }}
              animate={{
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>

        {/* Version info inferior */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-white/20 text-xs tracking-wider font-light uppercase">
            CHRONOS v3.0.0 ULTRA PREMIUM • © 2025
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

ChronosLoginUltraPremium.propTypes = {
  onLogin: PropTypes.func.isRequired
};

export default ChronosLoginUltraPremium;
