/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                        CHRONOS LOGIN PAGE                                  ║
 * ║         Página de Login Épica con Fondo Cósmico y Animaciones             ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * Login page ultra-premium con:
 * - Fondo cósmico animado (estrellas, nebulosas)
 * - ChronosLogoFull con animación de entrada
 * - Formulario glassmorphism con validación
 * - Animaciones Framer Motion épicas
 * - Password strength indicator
 * - Remember me + Forgot password
 * - Social login buttons (Google, Microsoft)
 * - Partículas flotantes
 *
 * @module LoginPage
 * @author CHRONOS System
 * @version 1.0.0
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

import { ChronosLogoFull } from '../../components/brand/ChronosLogos';

// ============================================================================
// LOGIN PAGE COMPONENT
// ============================================================================

export const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // true = Login, false = Register
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulación de autenticación
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (onLogin) {
        onLogin({
          email: formData.email,
          name: formData.name || formData.email.split('@')[0],
        });
      }

      navigate('/dashboard');
    } catch (err) {
      setError('Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Implementar OAuth aquí
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Cosmic Background */}
      <CosmicBackground />

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Login Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <ChronosLogoFull size={150} animated={true} glowIntensity="high" />
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="
            backdrop-blur-2xl bg-black/40
            border border-white/10
            rounded-2xl shadow-2xl
            p-8
            relative overflow-hidden
          "
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold text-white mb-2">
                {isLogin ? 'Bienvenido de vuelta' : 'Crear cuenta'}
              </h1>
              <p className="text-gray-400">
                {isLogin ? 'Ingresa tus credenciales para continuar' : 'Únete al sistema CHRONOS'}
              </p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name (Register only) */}
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <User
                      size={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      required={!isLogin}
                      className="
                        w-full pl-11 pr-4 py-3
                        bg-white/5 border border-white/10
                        rounded-lg text-white
                        placeholder-gray-500
                        focus:outline-none focus:border-blue-500/50 focus:bg-white/10
                        transition-all
                      "
                    />
                  </div>
                </motion.div>
              )}

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@email.com"
                    required
                    className="
                      w-full pl-11 pr-4 py-3
                      bg-white/5 border border-white/10
                      rounded-lg text-white
                      placeholder-gray-500
                      focus:outline-none focus:border-blue-500/50 focus:bg-white/10
                      transition-all
                    "
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
                <div className="relative">
                  <Lock
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="
                      w-full pl-11 pr-12 py-3
                      bg-white/5 border border-white/10
                      rounded-lg text-white
                      placeholder-gray-500
                      focus:outline-none focus:border-blue-500/50 focus:bg-white/10
                      transition-all
                    "
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </motion.div>

              {/* Remember Me & Forgot Password */}
              {isLogin && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="flex items-center justify-between"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                      className="w-4 h-4 rounded border-white/20 bg-white/10"
                    />
                    <span className="text-sm text-gray-400">Recordarme</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="
                  w-full py-3 rounded-lg font-medium
                  bg-gradient-to-r from-blue-500 to-purple-600
                  text-white
                  hover:from-blue-600 hover:to-purple-700
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all
                  shadow-lg shadow-blue-500/30
                "
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Cargando...
                  </span>
                ) : isLogin ? (
                  'Iniciar Sesión'
                ) : (
                  'Crear Cuenta'
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="my-6 flex items-center gap-4"
            >
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-sm text-gray-500">O continúa con</span>
              <div className="flex-1 h-px bg-white/10" />
            </motion.div>

            {/* Social Login */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="grid grid-cols-2 gap-3"
            >
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="
                  py-2 px-4 rounded-lg
                  bg-white/5 border border-white/10
                  text-white text-sm font-medium
                  hover:bg-white/10
                  transition-colors
                  flex items-center justify-center gap-2
                "
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('microsoft')}
                className="
                  py-2 px-4 rounded-lg
                  bg-white/5 border border-white/10
                  text-white text-sm font-medium
                  hover:bg-white/10
                  transition-colors
                  flex items-center justify-center gap-2
                "
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#f25022" d="M1 1h10v10H1z" />
                  <path fill="#00a4ef" d="M13 1h10v10H13z" />
                  <path fill="#7fba00" d="M1 13h10v10H1z" />
                  <path fill="#ffb900" d="M13 13h10v10H13z" />
                </svg>
                Microsoft
              </button>
            </motion.div>

            {/* Toggle Login/Register */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-gray-400">
                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  {isLogin ? 'Regístrate' : 'Inicia sesión'}
                </button>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          CHRONOS System © 2024 | Todos los derechos reservados
        </motion.div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// COSMIC BACKGROUND
// ============================================================================

const CosmicBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Animated Stars */}
    {[...Array(100)].map((_, i) => (
      <motion.div
        key={`cosmic-star-${i}`}
        initial={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          scale: 0,
        }}
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 5,
        }}
        className="absolute w-1 h-1 bg-white rounded-full"
      />
    ))}

    {/* Nebula Effects */}
    <motion.div
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.2, 0.4, 0.2],
        rotate: [0, 360],
      }}
      transition={{ duration: 20, repeat: Infinity }}
      className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
    />
    <motion.div
      animate={{
        scale: [1.3, 1, 1.3],
        opacity: [0.4, 0.2, 0.4],
        rotate: [360, 0],
      }}
      transition={{ duration: 25, repeat: Infinity }}
      className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
    />
  </div>
);

// ============================================================================
// FLOATING PARTICLES
// ============================================================================

const FloatingParticles = () => (
  <div className="absolute inset-0 pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={`particle-${i}`}
        initial={{
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 50,
        }}
        animate={{
          y: -50,
          x: Math.random() * window.innerWidth,
        }}
        transition={{
          duration: 10 + Math.random() * 10,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute w-2 h-2 bg-white/20 rounded-full"
      />
    ))}
  </div>
);

export default LoginPage;
