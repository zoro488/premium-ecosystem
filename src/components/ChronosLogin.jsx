/**
 * 🔐 Chronos Premium Login
 * Sistema de autenticación con diseño futurista integrado con intro
 */
import { useCallback, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Shield, Zap } from 'lucide-react';
import PropTypes from 'prop-types';

const ChronosLogin = ({ onLoginSuccess, onSkip }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      // Simular autenticación
      setTimeout(() => {
        if (formData.email && formData.password) {
          onLoginSuccess?.({
            email: formData.email,
            name: 'Usuario Premium',
          });
        } else {
          setError('Por favor ingresa tus credenciales');
          setIsLoading(false);
        }
      }, 1500);
    },
    [formData, onLoginSuccess]
  );

  const handleDemoAccess = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      onSkip?.();
    }, 800);
  }, [onSkip]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[9998] bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Video de fondo con efecto glitch */}
      <div className="absolute inset-0 opacity-30">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="/chronos-loading.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-black/80 to-cyan-950/90" />
      </div>

      {/* Grid animado de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Partículas flotantes */}
      <div className="absolute inset-0 pointer-events-none">
        {new Array(30).fill(0).map((_, index) => {
          const particleId = `login-particle-${Date.now()}-${index}`;
          return (
            <motion.div
              key={particleId}
              className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -150, 0],
                x: [0, Math.random() * 30 - 15, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          );
        })}
      </div>

      {/* Contenedor principal */}
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Logo y Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          <motion.img
            src="/chronos-logo.png"
            alt="Chronos"
            className="w-20 h-20 mx-auto mb-4"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <h1 className="text-5xl font-black text-white tracking-wider mb-2">
            <span
              className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent"
              style={{
                textShadow: '0 0 40px rgba(59, 130, 246, 0.5)',
              }}
            >
              CHRONOS
            </span>
          </h1>
          <p className="text-cyan-400 text-sm font-light tracking-widest">PREMIUM ECOSYSTEM</p>
          <div className="flex items-center justify-center gap-2 mt-3 text-blue-300/60 text-xs">
            <Shield className="w-3 h-3" />
            <span>Secured Connection</span>
            <Zap className="w-3 h-3 ml-2" />
            <span>Enterprise Grade</span>
          </div>
        </motion.div>

        {/* Formulario de Login */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative"
        >
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl" />

          <div className="relative bg-black/40 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email-input"
                  className="block text-blue-300 text-sm font-medium mb-2 tracking-wide"
                >
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/50 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    id="email-input"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="usuario@chronos.com"
                    className="w-full bg-blue-950/30 border border-blue-500/30 rounded-xl pl-12 pr-4 py-3.5
                             text-white placeholder-blue-400/30
                             focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none
                             transition-all duration-300"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password-input"
                  className="block text-blue-300 text-sm font-medium mb-2 tracking-wide"
                >
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/50 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-blue-950/30 border border-blue-500/30 rounded-xl pl-12 pr-12 py-3.5
                             text-white placeholder-blue-400/30
                             focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none
                             transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400/50 hover:text-cyan-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600
                         hover:from-blue-500 hover:via-cyan-400 hover:to-blue-500
                         text-white font-bold py-3.5 rounded-xl
                         shadow-lg shadow-blue-500/50
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-300
                         relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      <span>Autenticando...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Acceder al Sistema</span>
                    </>
                  )}
                </span>
                {/* Animated gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ['-200%', '200%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </motion.button>

              {/* Demo Access */}
              <motion.button
                type="button"
                onClick={handleDemoAccess}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-transparent border border-cyan-500/30 hover:border-cyan-400/50
                         text-cyan-400 font-medium py-3 rounded-xl
                         hover:bg-cyan-500/5
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-300"
              >
                Acceso Demo
              </motion.button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-blue-500/10 text-center">
              <p className="text-blue-400/60 text-xs">
                Powered by{' '}
                <span className="text-cyan-400 font-semibold">Chronos Enterprise AI</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Version Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6 text-blue-400/40 text-xs"
        >
          v2.0.0 • Enterprise Edition • © 2025
        </motion.div>
      </motion.div>

      {/* Scan Lines Effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, cyan 3px)',
        }}
      />
    </motion.div>
  );
};

ChronosLogin.propTypes = {
  onLoginSuccess: PropTypes.func,
  onSkip: PropTypes.func,
};

ChronosLogin.defaultProps = {
  onLoginSuccess: null,
  onSkip: null,
};

export default ChronosLogin;
