/**
 * 🔐 CHRONOS LOGIN PANEL - ULTRA PREMIUM
 *
 * Panel de login inspirado en las mejores referencias:
 * - Glassmorphism extremo con múltiples capas
 * - Animaciones 3D con mouse tracking
 * - Efectos holográficos y de profundidad
 * - Validación en tiempo real con microanimaciones
 * - Responsive design iOS/Android optimizado
 * - Transiciones fluidas entre estados
 *
 * Referencias aplicadas:
 * - AI Buddy login interfaces
 * - Modern glassmorphism patterns
 * - Interactive form animations
 * - Space-age UI elements
 *
 * @version 1.0.0 - LOGIN PANEL
 */
import { memo, useCallback, useMemo, useRef, useState } from 'react';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Fingerprint,
  Lock,
  Mail,
  Shield,
} from 'lucide-react';
import PropTypes from 'prop-types';

const ChronosLoginPanel = memo(({ onLogin, isLoading = false }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animations
  const springConfig = { damping: 25, stiffness: 300 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // 3D transform calculations
  const rotateX = useTransform(smoothMouseY, [0, 400], [15, -15]);
  const rotateY = useTransform(smoothMouseX, [0, 400], [-15, 15]);
  const scale = useTransform(smoothMouseX, [0, 400], [0.98, 1.02]);

  // Mouse tracking
  const handleMouseMove = useCallback(
    (e) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Form validation
  const validateField = useCallback(
    (name, value) => {
      const newErrors = { ...errors };

      switch (name) {
        case 'email':
          if (!value) {
            newErrors.email = 'Email requerido';
          } else if (!/\S+@\S+\.\S+/.test(value)) {
            newErrors.email = 'Email inválido';
          } else {
            delete newErrors.email;
          }
          break;
        case 'password':
          if (!value) {
            newErrors.password = 'Contraseña requerida';
          } else if (value.length < 6) {
            newErrors.password = 'Mínimo 6 caracteres';
          } else {
            delete newErrors.password;
          }
          break;
        default:
          break;
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [errors]
  );

  // Handle input changes
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (errors[name]) {
        validateField(name, value);
      }
    },
    [errors, validateField]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setIsValidating(true);
      const isEmailValid = validateField('email', formData.email);
      const isPasswordValid = validateField('password', formData.password);

      if (isEmailValid && isPasswordValid) {
        await onLogin?.(formData);
      }

      setIsValidating(false);
    },
    [formData, onLogin, validateField]
  );

  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotateX: -20,
      z: -100,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      z: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const fieldVariants = {
    focused: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    unfocused: {
      scale: 1,
      transition: { duration: 0.2 },
    },
  };

  // Memoized field validation status
  const getFieldStatus = useMemo(
    () => (fieldName) => {
      if (!formData[fieldName]) return 'empty';
      if (errors[fieldName]) return 'error';
      return 'valid';
    },
    [formData, errors]
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900"
          animate={{
            background: [
              'linear-gradient(to bottom right, rgb(15 23 42), rgb(0 0 0), rgb(15 23 42))',
              'linear-gradient(to bottom right, rgb(30 41 59), rgb(0 0 0), rgb(30 41 59))',
              'linear-gradient(to bottom right, rgb(15 23 42), rgb(0 0 0), rgb(15 23 42))',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`login-particle-${i + 1}`}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Ambient light effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main Login Container */}
      <motion.div
        ref={containerRef}
        className="relative z-10 w-full max-w-md"
        style={{
          perspective: 1000,
          rotateX,
          rotateY,
          scale,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Glassmorphism Panel */}
        <motion.div
          className="relative p-8 rounded-2xl backdrop-blur-3xl border border-white/10 shadow-2xl"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            boxShadow:
              '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
          whileHover={{
            boxShadow:
              '0 32px 64px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            {/* Logo */}
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10"
              whileHover={{
                scale: 1.1,
                rotate: 5,
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
              }}
              transition={{ duration: 0.3 }}
            >
              <Shield className="w-8 h-8 text-blue-400" />
            </motion.div>

            <h2 className="text-2xl font-thin text-white mb-2">
              Bienvenido a{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-normal">
                CHRONOS
              </span>
            </h2>

            <p className="text-slate-400 text-sm font-light">Ingresa a tu cuenta para continuar</p>
          </motion.div>

          {/* Login Form */}
          <motion.form onSubmit={handleSubmit} className="space-y-6" variants={itemVariants}>
            {/* Email Field */}
            <motion.div
              className="relative"
              variants={fieldVariants}
              animate={focusedField === 'email' ? 'focused' : 'unfocused'}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail
                    className={`w-5 h-5 transition-colors ${
                      focusedField === 'email'
                        ? 'text-blue-400'
                        : getFieldStatus('email') === 'valid'
                          ? 'text-green-400'
                          : getFieldStatus('email') === 'error'
                            ? 'text-red-400'
                            : 'text-slate-500'
                    }`}
                  />
                </div>

                <motion.input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Correo electrónico"
                  className={`w-full pl-12 pr-12 py-4 bg-white/5 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    getFieldStatus('email') === 'error'
                      ? 'border-red-400/50 focus:ring-red-400/20'
                      : getFieldStatus('email') === 'valid'
                        ? 'border-green-400/50 focus:ring-green-400/20'
                        : 'border-white/10 focus:border-blue-400/50 focus:ring-blue-400/20'
                  }`}
                  whileFocus={{ scale: 1.01 }}
                />

                {/* Status indicator */}
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  {getFieldStatus('email') === 'valid' && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </motion.div>
                  )}
                  {getFieldStatus('email') === 'error' && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Error message */}
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-400 flex items-center space-x-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </motion.p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div
              className="relative"
              variants={fieldVariants}
              animate={focusedField === 'password' ? 'focused' : 'unfocused'}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock
                    className={`w-5 h-5 transition-colors ${
                      focusedField === 'password'
                        ? 'text-blue-400'
                        : getFieldStatus('password') === 'valid'
                          ? 'text-green-400'
                          : getFieldStatus('password') === 'error'
                            ? 'text-red-400'
                            : 'text-slate-500'
                    }`}
                  />
                </div>

                <motion.input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Contraseña"
                  className={`w-full pl-12 pr-12 py-4 bg-white/5 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    getFieldStatus('password') === 'error'
                      ? 'border-red-400/50 focus:ring-red-400/20'
                      : getFieldStatus('password') === 'valid'
                        ? 'border-green-400/50 focus:ring-green-400/20'
                        : 'border-white/10 focus:border-blue-400/50 focus:ring-blue-400/20'
                  }`}
                  whileFocus={{ scale: 1.01 }}
                />

                {/* Show/Hide password button */}
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>

              {/* Error message */}
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-400 flex items-center space-x-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </motion.p>
              )}
            </motion.div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={isLoading || isValidating}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl overflow-hidden transition-all hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{
                scale: 1.02,
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)',
              }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
            >
              {/* Button background animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
                animate={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />

              {/* Button content */}
              <div className="relative flex items-center justify-center space-x-2">
                {isLoading || isValidating ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <span>Validando...</span>
                  </>
                ) : (
                  <>
                    <span>Iniciar Sesión</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </motion.button>

            {/* Biometric Login Option */}
            <motion.div className="text-center" variants={itemVariants}>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-black text-slate-400">o</span>
                </div>
              </div>

              <motion.button
                type="button"
                className="mt-4 inline-flex items-center space-x-2 px-6 py-3 bg-white/5 text-slate-300 rounded-xl border border-white/10 hover:bg-white/10 hover:text-white transition-all group"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Fingerprint className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                <span className="text-sm font-light">Usar biometría</span>
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Footer */}
          <motion.div className="mt-8 text-center" variants={itemVariants}>
            <p className="text-slate-500 text-sm">
              ¿Olvidaste tu contraseña?{' '}
              <motion.button
                className="text-blue-400 hover:text-blue-300 transition-colors underline"
                whileHover={{ scale: 1.05 }}
              >
                Recuperar acceso
              </motion.button>
            </p>
          </motion.div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </motion.div>
    </div>
  );
});

ChronosLoginPanel.displayName = 'ChronosLoginPanel';

ChronosLoginPanel.propTypes = {
  onLogin: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default ChronosLoginPanel;
