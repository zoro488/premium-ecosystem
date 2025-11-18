import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Loader, Lock, Mail } from 'lucide-react';

import { ChronosLogoFull } from '../../components/brand/ChronosLogoAnimated';
import { auth } from '../../lib/firebase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect manejado por AuthProvider
      navigate('/');
    } catch (err) {
      setError(
        err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found'
          ? 'Email o contraseña incorrectos'
          : 'Error al iniciar sesión. Intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* ============================================
          FONDO ANIMADO CON ESTRELLAS
      ============================================ */}
      <div className="absolute inset-0">
        {/* Estrellas estáticas */}
        {[...Array(150)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
            animate={{
              opacity: [
                Math.random() * 0.5 + 0.3,
                Math.random() * 0.8 + 0.2,
                Math.random() * 0.5 + 0.3,
              ],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Estrellas fugaces */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`shooting-star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              boxShadow: '0 0 10px 2px rgba(255,255,255,0.5)',
            }}
            animate={{
              x: [0, 300],
              y: [0, 150],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 4 + Math.random() * 3,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Gradiente radial central */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-purple-900/10 to-transparent" />

      {/* Anillos cósmicos giratorios de fondo */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-[1000px] h-[1000px] rounded-full border border-blue-500/5" />
        <div className="absolute w-[800px] h-[800px] rounded-full border border-purple-500/5" />
        <div className="absolute w-[600px] h-[600px] rounded-full border border-pink-500/5" />
      </motion.div>

      {/* ============================================
          CONTENEDOR PRINCIPAL
      ============================================ */}
      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.43, 0.13, 0.23, 0.96],
          }}
        >
          {/* ============================================
              LOGO CHRONOS
          ============================================ */}
          <div className="flex justify-center mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <ChronosLogoFull size={180} animated={true} />
            </motion.div>
          </div>

          {/* ============================================
              TÍTULO
          ============================================ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1
              className="text-5xl font-black mb-2 tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              CHRONOS
            </h1>
            <p className="text-gray-400 text-sm tracking-widest">PREMIUM ECOSYSTEM</p>
          </motion.div>

          {/* ============================================
              CARD DE LOGIN CON GLASSMORPHISM
          ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="relative"
          >
            {/* Glow effect detrás de la card */}
            <div
              className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl"
              style={{
                animation: 'pulse 4s ease-in-out infinite',
              }}
            />

            {/* Card principal */}
            <div
              className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
              style={{
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              }}
            >
              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Formulario */}
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <motion.input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      whileFocus={{ scale: 1.01 }}
                      className="
                        w-full pl-12 pr-4 py-3.5
                        bg-white/5 border border-white/10 rounded-xl
                        text-white placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
                        transition-all duration-300
                      "
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Contraseña</label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <motion.input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      whileFocus={{ scale: 1.01 }}
                      className="
                        w-full pl-12 pr-12 py-3.5
                        bg-white/5 border border-white/10 rounded-xl
                        text-white placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
                        transition-all duration-300
                      "
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Recordar / Olvidé contraseña */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-600 bg-white/5 text-blue-500 focus:ring-blue-500/50"
                    />
                    Recordarme
                  </label>
                  <button
                    type="button"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {/* Botón de Login */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="
                    w-full py-4 rounded-xl font-semibold
                    bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
                    text-white
                    flex items-center justify-center gap-2
                    hover:shadow-lg hover:shadow-blue-500/50
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-300
                    relative overflow-hidden
                  "
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />

                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        Iniciar Sesión
                        <ArrowRight size={20} />
                      </>
                    )}
                  </span>
                </motion.button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-transparent text-gray-500">o continúa con</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="
                    py-3 px-4 rounded-xl
                    bg-white/5 border border-white/10
                    text-white text-sm font-medium
                    hover:bg-white/10
                    transition-all duration-300
                  "
                >
                  Google
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="
                    py-3 px-4 rounded-xl
                    bg-white/5 border border-white/10
                    text-white text-sm font-medium
                    hover:bg-white/10
                    transition-all duration-300
                  "
                >
                  Microsoft
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* ============================================
              REGISTRO
          ============================================ */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-6 text-gray-400 text-sm"
          >
            ¿No tienes cuenta?{' '}
            <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Regístrate aquí
            </button>
          </motion.p>
        </motion.div>
      </div>

      {/* ============================================
          FOOTER
      ============================================ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-0 right-0 text-center text-gray-600 text-xs"
      >
        <p>© 2025 Chronos Premium Ecosystem</p>
        <p className="mt-1">
          Powered by <span className="text-blue-400">Firebase</span> •{' '}
          <span className="text-purple-400">React 18</span>
        </p>
      </motion.div>

      {/* CSS personalizado para gradiente radial */}
      <style>{`
        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
