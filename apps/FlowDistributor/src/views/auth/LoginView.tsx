/**
 * 🔐 LOGIN VIEW - Pantalla de login premium con glassmorphism
 *
 * Características:
 * - 🎨 Diseño espacial moderno y elegante
 * - 💎 Glassmorphism forms
 * - ✨ Animaciones fluidas en inputs
 * - 🌟 Background con efectos de partículas
 * - 🔒 Validación en tiempo real
 * - 👁️ Toggle password visibility
 * - 🚀 Loading states premium
 * - 📱 Responsive design
 */

import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react';
import { useState } from 'react';

import { AnimatedLogo } from '@/components/auth/AnimatedLogo';

interface LoginViewProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
}

/**
 * Vista de Login Premium
 */
export function LoginView({ onLogin, onForgotPassword, onSignUp }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Validación
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Validación
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Login
    setIsLoading(true);
    try {
      await onLogin(email, password);
    } catch (error) {
      setErrors({
        password: 'Credenciales inválidas'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-chronos-charcoal overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Base */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-chronos-charcoal via-chronos-graphite to-chronos-charcoal"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />

        {/* Particles */}
        {[...Array(20)].map((_, idx) => (
          <motion.div
            key={idx}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        </div>
      </div>

      {/* Login Card */}
      <motion.div
        className="relative z-10 w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        {/* Glassmorphism Container */}
        <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Card Glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-transparent to-neon-purple/10"
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Content */}
          <div className="relative p-8 space-y-6">
            {/* Logo & Title */}
            <div className="flex flex-col items-center space-y-4">
              <AnimatedLogo size={80} mode="login" />

              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-neon-cyan via-white to-neon-purple bg-clip-text text-transparent">
                  Bienvenido
                </h1>
                <p className="text-chronos-silver text-sm">
                  Inicia sesión en FlowDistributor
                </p>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm text-chronos-silver">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 rounded-xl blur-xl"
                    animate={{
                      opacity: email ? [0.5, 0.8, 0.5] : 0,
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 w-5 h-5 text-chronos-silver" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      placeholder="tu@email.com"
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-chronos-pearl placeholder-chronos-silver/50 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan/50 transition-all"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                {errors.email && (
                  <motion.p
                    className="text-xs text-red-400"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm text-chronos-silver">
                  Contraseña
                </label>
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 rounded-xl blur-xl"
                    animate={{
                      opacity: password ? [0.5, 0.8, 0.5] : 0,
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0.5,
                    }}
                  />
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 w-5 h-5 text-chronos-silver" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: undefined });
                      }}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-chronos-pearl placeholder-chronos-silver/50 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan/50 transition-all"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-chronos-silver hover:text-white transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <motion.p
                    className="text-xs text-red-400"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.password}
                  </motion.p>
                )}
              </div>

              {/* Forgot Password */}
              {onForgotPassword && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-sm text-neon-cyan hover:text-neon-blue transition-colors"
                    disabled={isLoading}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="relative w-full py-3 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-blue text-white font-semibold rounded-xl shadow-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {/* Button Glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />

                {/* Button Content */}
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Iniciar Sesión
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            {/* Sign Up Link */}
            {onSignUp && (
              <div className="text-center text-sm">
                <span className="text-chronos-silver">
                  ¿No tienes cuenta?{' '}
                </span>
                <button
                  onClick={onSignUp}
                  className="text-neon-cyan hover:text-neon-blue font-semibold transition-colors"
                  disabled={isLoading}
                >
                  Regístrate
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Decoration */}
        <motion.div
          className="mt-8 text-center text-xs text-chronos-silver/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          © 2024 FlowDistributor - Chronos OS
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LoginView;
