import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import gsap from 'gsap';
import { Lock, Mail, Eye, EyeOff, Sparkles, Shield, Zap, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const ChronosLoginCinematic = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [validationState, setValidationState] = useState({ email: null, password: null });
  const [particleEffect, setParticleEffect] = useState(false);

  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Transformaciones 3D basadas en mouse
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  // Animación de spring para el logo
  const logoSpring = useSpring({
    from: { scale: 0, rotate: -180 },
    to: { scale: 1, rotate: 0 },
    config: { tension: 200, friction: 20 }
  });

  // Partículas flotantes de fondo
  const [particles] = useState(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }))
  );

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    globalThis.addEventListener('mousemove', handleMouseMove);
    return () => globalThis.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Validación en tiempo real con animación
  useEffect(() => {
    const emailValid = email.includes('@') && email.length > 3;
    const passwordValid = password.length >= 6;

    setValidationState({
      email: email.length > 0 ? emailValid : null,
      password: password.length > 0 ? passwordValid : null
    });

    if (emailValid && passwordValid) {
      setParticleEffect(true);
    } else {
      setParticleEffect(false);
    }
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validationState.email || !validationState.password) {
      // Shake animation para error
      gsap.to(cardRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.4,
        ease: 'power2.inOut'
      });
      return;
    }

    setIsLoading(true);

    // Animación de éxito con confetti
    await new Promise(resolve => setTimeout(resolve, 1500));

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffffff', '#cccccc', '#888888']
    });

    setTimeout(() => {
      onLogin({ email, password });
    }, 500);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at top, #1a1a1a 0%, #000000 100%)'
      }}
    >
      {/* Partículas de fondo flotantes */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white"
          initial={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            opacity: 0.1
          }}
          animate={{
            y: [`${particle.y}%`, `${particle.y - 20}%`, `${particle.y}%`],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            width: particle.size,
            height: particle.size,
            filter: 'blur(1px)'
          }}
        />
      ))}

      {/* Grid animado */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '60px 60px']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>

      {/* Anillos orbitales */}
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          className="absolute rounded-full border border-white/10"
          style={{
            width: 400 + ring * 150,
            height: 400 + ring * 150,
            left: '50%',
            top: '50%',
            marginLeft: -(200 + ring * 75),
            marginTop: -(200 + ring * 75)
          }}
          animate={{
            rotate: 360 * (ring % 2 === 0 ? 1 : -1)
          }}
          transition={{
            duration: 30 + ring * 10,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      ))}

      {/* Card principal con efecto 3D */}
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        className="relative z-10"
      >
        {/* Glassmorphism card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative w-[480px] rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.8),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.1)
            `
          }}
        >
          {/* Efecto de brillo superior */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
            }}
          />

          {/* Efecto de partículas de éxito */}
          <AnimatePresence>
            {particleEffect && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    initial={{
                      x: '50%',
                      y: '50%',
                      scale: 0
                    }}
                    animate={{
                      x: `${50 + (Math.random() - 0.5) * 100}%`,
                      y: `${50 + (Math.random() - 0.5) * 100}%`,
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      repeat: Infinity
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-12">
            {/* Logo animado */}
            <animated.div
              style={logoSpring}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                {/* Resplandor del logo */}
                <motion.div
                  className="absolute inset-0 blur-2xl opacity-50"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  <div className="w-20 h-20 rounded-full bg-white" />
                </motion.div>

                {/* Logo SVG */}
                <svg width="80" height="80" viewBox="0 0 80 80" className="relative">
                  <defs>
                    <linearGradient id="loginLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="#888888" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M 40 10 A 30 30 0 1 0 40 70"
                    fill="none"
                    stroke="url(#loginLogoGradient)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                  />
                </svg>
              </div>
            </animated.div>

            {/* Título con efecto de typing */}
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-black text-center mb-2 tracking-tight"
              style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #cccccc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              CHRONOS
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-gray-400 text-sm mb-8 tracking-wide"
            >
              Financial Control System
            </motion.p>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Email */}
              <div className="relative">
                <motion.div
                  animate={{
                    scale: focusedField === 'email' ? 1.02 : 1
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative">
                    {/* Icono */}
                    <motion.div
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                      animate={{
                        scale: focusedField === 'email' ? 1.1 : 1,
                        rotate: focusedField === 'email' ? [0, -10, 10, 0] : 0
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Mail className="w-5 h-5 text-gray-400" />
                    </motion.div>

                    {/* Input */}
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Email address"
                      className="w-full pl-12 pr-12 py-4 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-300"
                      style={{
                        background: focusedField === 'email'
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: focusedField === 'email'
                          ? '1px solid rgba(255, 255, 255, 0.2)'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: focusedField === 'email'
                          ? '0 0 20px rgba(255, 255, 255, 0.1)'
                          : 'none'
                      }}
                    />

                    {/* Indicador de validación */}
                    <AnimatePresence>
                      {validationState.email !== null && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          {validationState.email ? (
                            <Check className="w-5 h-5 text-zinc-200" />
                          ) : (
                            <span className="text-zinc-200 text-xs">✕</span>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Barra de progreso inferior */}
                  <motion.div
                    className="h-0.5 bg-white/20 rounded-full mt-2 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: focusedField === 'email' ? 1 : 0 }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-white to-gray-400"
                      initial={{ width: '0%' }}
                      animate={{
                        width: validationState.email ? '100%' : `${(email.length / 15) * 100}%`
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </motion.div>
              </div>

              {/* Campo Password */}
              <div className="relative">
                <motion.div
                  animate={{
                    scale: focusedField === 'password' ? 1.02 : 1
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative">
                    {/* Icono Lock */}
                    <motion.div
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                      animate={{
                        scale: focusedField === 'password' ? 1.1 : 1,
                        rotate: focusedField === 'password' ? [0, -5, 5, 0] : 0
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Lock className="w-5 h-5 text-gray-400" />
                    </motion.div>

                    {/* Input */}
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Password"
                      className="w-full pl-12 pr-12 py-4 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-300"
                      style={{
                        background: focusedField === 'password'
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: focusedField === 'password'
                          ? '1px solid rgba(255, 255, 255, 0.2)'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: focusedField === 'password'
                          ? '0 0 20px rgba(255, 255, 255, 0.1)'
                          : 'none'
                      }}
                    />

                    {/* Toggle visibilidad */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </motion.div>
                    </button>
                  </div>

                  {/* Barra de fuerza de contraseña */}
                  <motion.div
                    className="h-0.5 bg-white/20 rounded-full mt-2 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: focusedField === 'password' ? 1 : 0 }}
                  >
                    <motion.div
                      className="h-full"
                      style={{
                        background: password.length < 6
                          ? 'linear-gradient(to right, #ef4444, #f59e0b)'
                          : password.length < 10
                          ? 'linear-gradient(to right, #f59e0b, #10b981)'
                          : 'linear-gradient(to right, #10b981, #06b6d4)'
                      }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${(password.length / 12) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </motion.div>
              </div>

              {/* Botón de login */}
              <motion.button
                type="submit"
                disabled={isLoading || !validationState.email || !validationState.password}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl font-bold text-black relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #cccccc 100%)',
                  boxShadow: '0 10px 30px rgba(255, 255, 255, 0.2)'
                }}
              >
                {/* Efecto de brillo animado */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
                  }}
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />

                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Access System</span>
                      <Zap className="w-5 h-5" />
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            {/* Footer con iconos animados */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 flex items-center justify-center gap-6 text-gray-500 text-xs"
            >
              {[Shield, Sparkles, Zap].map((Icon, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.2, color: '#ffffff' }}
                  animate={{
                    y: [0, -5, 0]
                  }}
                  transition={{
                    y: {
                      duration: 2,
                      delay: i * 0.3,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }
                  }}
                >
                  <Icon className="w-4 h-4" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

ChronosLoginCinematic.propTypes = {
  onLogin: PropTypes.func.isRequired
};

export default ChronosLoginCinematic;
