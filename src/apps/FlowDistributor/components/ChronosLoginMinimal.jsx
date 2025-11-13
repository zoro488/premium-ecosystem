import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import gsap from 'gsap';
import ChronosLogo from './ChronosLogo';

/**
 * 🔐 CHRONOS LOGIN - Ultra Premium con Microinteracciones
 * Validación en tiempo real + Efectos premium
 */
const ChronosLoginMinimal = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validation, setValidation] = useState({ email: null, password: null });

  const cardRef = useRef(null);

  // Helper para obtener el color del borde según validación
  const getBorderColor = (fieldName, validationState) => {
    if (focusedField === fieldName) {
      return 'rgba(255,255,255,0.6)';
    }
    if (validationState === false) {
      return 'rgba(255,100,100,0.3)';
    }
    return 'rgba(255,255,255,0.2)';
  };

  // Helper para obtener el gradiente de fuerza de password
  const getPasswordStrengthGradient = (passwordLength) => {
    if (passwordLength < 6) {
      return 'linear-gradient(90deg, rgba(255,100,100,0.8), rgba(255,150,100,0.6))';
    }
    if (passwordLength < 10) {
      return 'linear-gradient(90deg, rgba(255,200,100,0.8), rgba(150,255,150,0.6))';
    }
    return 'linear-gradient(90deg, rgba(150,255,150,0.8), rgba(100,255,200,0.6))';
  };
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Efecto 3D sutil basado en mouse
  const rotateX = useTransform(cursorY, [-300, 300], [2, -2]);
  const rotateY = useTransform(cursorX, [-300, 300], [-2, 2]);

  // Validación en tiempo real
  useEffect(() => {
    setValidation({
      email: email.length > 0 ? email.includes('@') && email.length > 5 : null,
      password: password.length > 0 ? password.length >= 6 : null
    });
  }, [email, password]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    cursorX.set(x);
    cursorY.set(y);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validation.email || !validation.password) {
      // Shake animation en error
      gsap.to(cardRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.4,
        ease: 'power2.inOut'
      });
      return;
    }

    setIsLoading(true);

    // Animación de éxito
    await gsap.to(cardRef.current, {
      scale: 0.98,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });

    await new Promise(resolve => setTimeout(resolve, 800));
    onLogin({ email, password });
  };

  const isFormValid = validation.email && validation.password;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Grid dinámico de fondo */}
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear'
        }}
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Partículas flotantes */}
      {Array.from({ length: 20 }, (_, i) => ({ id: `login-particle-${i}`, left: Math.random() * 100, top: Math.random() * 100 })).map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            delay: Math.random() * 3,
            repeat: Infinity,
            ease: 'easeInOut'
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
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          cursorX.set(0);
          cursorY.set(0);
        }}
        className="relative z-10 h-full flex items-center justify-center"
      >
        <div className="w-full max-w-md mx-4">
          {/* Logo con hover effect */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex justify-center mb-12 cursor-pointer"
          >
            <ChronosLogo size="lg" animated={true} />
          </motion.div>

          {/* Título con efecto de aparición */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl font-light text-center text-white mb-3 tracking-[0.2em]"
            style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
          >
            CHRONOS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center text-white text-sm mb-16 tracking-[0.3em]"
          >
            TIME CONTROL SYSTEM
          </motion.p>

          {/* Formulario con microanimaciones */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Campo Email con indicador de validación */}
            <div className="relative">
              <motion.div
                animate={{
                  scale: focusedField === 'email' ? 1.02 : 1
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative group">
                  {/* Icono con microanimación */}
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2"
                    animate={focusedField === 'email' ? {
                      x: [0, -3, 3, 0],
                      transition: { duration: 0.3 }
                    } : {}}
                  >
                    <Mail className={`w-5 h-5 transition-colors duration-300 ${
                      focusedField === 'email' ? 'text-white' : 'text-white/40'
                    }`} />
                  </motion.div>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Email Address"
                    className="w-full pl-10 pr-12 py-4 bg-transparent border-b text-white placeholder-white/30 outline-none transition-all duration-300"
                    style={{
                      borderBottomColor: getBorderColor('email', validation.email),
                      borderBottomWidth: focusedField === 'email' ? '2px' : '1px'
                    }}
                  />

                  {/* Indicador de validación animado */}
                  {validation.email !== null && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute right-0 top-1/2 -translate-y-1/2"
                    >
                      {validation.email ? (
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 0.5 }}
                          className="text-green-400"
                        >
                          ✓
                        </motion.div>
                      ) : (
                        <motion.div
                          animate={{ x: [-2, 2, -2, 2, 0] }}
                          transition={{ duration: 0.3 }}
                          className="text-red-400"
                        >
                          ✕
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Barra de progreso inferior */}
                <motion.div
                  className="h-px bg-white/10 mt-1 overflow-hidden rounded-full"
                  style={{ opacity: focusedField === 'email' ? 1 : 0 }}
                >
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: '0%' }}
                    animate={{
                      width: validation.email ? '100%' : `${Math.min((email.length / 20) * 100, 100)}%`
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* Campo Password con toggle visibility */}
            <div className="relative">
              <motion.div
                animate={{
                  scale: focusedField === 'password' ? 1.02 : 1
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative group">
                  {/* Icono Lock con animación */}
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2"
                    animate={focusedField === 'password' ? {
                      rotate: [0, -5, 5, 0],
                      transition: { duration: 0.3 }
                    } : {}}
                  >
                    <Lock className={`w-5 h-5 transition-colors duration-300 ${
                      focusedField === 'password' ? 'text-white' : 'text-white/40'
                    }`} />
                  </motion.div>

                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Password"
                    className="w-full pl-10 pr-12 py-4 bg-transparent border-b text-white placeholder-white/30 outline-none transition-all duration-300"
                    style={{
                      borderBottomColor: getBorderColor('password', validation.password),
                      borderBottomWidth: focusedField === 'password' ? '2px' : '1px'
                    }}
                  />

                  {/* Toggle password visibility */}
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>

                {/* Barra de fuerza de contraseña */}
                <motion.div
                  className="h-px bg-white/10 mt-1 overflow-hidden rounded-full"
                  style={{ opacity: focusedField === 'password' ? 1 : 0 }}
                >
                  <motion.div
                    className="h-full"
                    style={{
                      background: getPasswordStrengthGradient(password.length)
                    }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${Math.min((password.length / 12) * 100, 100)}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* Botón submit con microanimaciones */}
            <motion.button
              type="submit"
              disabled={!isFormValid || isLoading}
              whileHover={isFormValid ? { scale: 1.02, y: -2 } : {}}
              whileTap={isFormValid ? { scale: 0.98 } : {}}
              className="relative w-full py-4 mt-8 bg-white text-black font-medium rounded-sm overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 group"
              style={{
                boxShadow: isFormValid ? '0 10px 30px rgba(255,255,255,0.2)' : 'none'
              }}
            >
              {/* Efecto de brillo animado */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '200%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                  repeatDelay: 1
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
                    <span>ACCESSING...</span>
                  </>
                ) : (
                  <>
                    <span className="tracking-wider">ACCESS SYSTEM</span>
                    <motion.div
                      animate={isFormValid ? { x: [0, 5, 0] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </>
                )}
              </span>
            </motion.button>
          </form>

          {/* Hint con fade in */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-8 text-center text-white/20 text-xs tracking-wide"
          >
            Email + Password (min. 6 characters)
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

ChronosLoginMinimal.propTypes = {
  onLogin: PropTypes.func.isRequired
};

export default ChronosLoginMinimal;
