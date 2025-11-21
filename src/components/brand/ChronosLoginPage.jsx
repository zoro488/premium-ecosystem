/**
 * 🔐 CHRONOS LOGIN PAGE - Ultra Premium
 * Login page con glassmorphism y animaciones épicas
 */
import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Chrome, Eye, EyeOff, Github, Lock, Mail, Sparkles } from 'lucide-react';
import PropTypes from 'prop-types';

import { ChronosLogoWithText } from './ChronosLogos';

export function ChronosLoginPage({ onLogin, onSocialLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError('');
    setIsLoading(true);

    try {
      await onSocialLogin(provider);
    } catch (err) {
      setError(err.message || `Error al iniciar sesión con ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative bg-black flex items-center justify-center">
      {/* ========================================
          FONDO CÓSMICO ANIMADO
      ======================================== */}
      <div className="absolute inset-0">
        {/* Estrellas */}
        {[...Array(100)].map(() => {
          const uniqueId = `login-star-${Math.random().toString(36).substr(2, 9)}`;
          return (
            <motion.div
              key={uniqueId}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          );
        })}

        {/* Anillos cósmicos de fondo */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute w-[800px] h-[800px] rounded-full border border-blue-500/10" />
          <div className="absolute w-[600px] h-[600px] rounded-full border border-zinc-700/10" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-pink-500/10" />
        </motion.div>

        {/* Gradiente radial */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 40%, rgba(102,126,234,0.15) 0%, rgba(118,75,162,0.08) 30%, transparent 70%)',
          }}
        />
      </div>

      {/* ========================================
          CONTENEDOR PRINCIPAL CON GLASSMORPHISM
      ======================================== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.43, 0.13, 0.23, 0.96],
        }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* CARD PRINCIPAL CON GLASSMORPHISM */}
        <div
          className="relative overflow-hidden rounded-3xl p-8 md:p-10"
          style={{
            background: 'rgba(15, 15, 25, 0.75)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* Efecto de luz superior */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(102,126,234,0.8) 50%, transparent 100%)',
            }}
          />

          {/* Logo CHRONOS */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-8"
          >
            <ChronosLogoWithText size={240} logoVariant="compact" />
          </motion.div>

          {/* Título */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              Bienvenido
            </h2>
            <p className="text-gray-400">Ingresa a tu cuenta CHRONOS</p>
          </motion.div>

          {/* Mensaje de Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 backdrop-blur-sm"
              >
                <p className="text-red-400 text-sm text-center">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* FORMULARIO DE LOGIN */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500
                           focus:bg-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                           transition-all duration-300 outline-none"
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500
                           focus:bg-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                           transition-all duration-300 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            {/* Recordar sesión / Olvidé contraseña */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-between text-sm"
            >
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                Recordarme
              </label>
              <button type="button" className="text-blue-400 hover:text-blue-300 transition-colors">
                ¿Olvidaste tu contraseña?
              </button>
            </motion.div>

            {/* Botón de Login */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              type="submit"
              disabled={isLoading}
              className="relative w-full py-4 rounded-xl font-semibold text-white overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                boxShadow: '0 0 30px rgba(102,126,234,0.4)',
              }}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                style={{ width: '100px' }}
                animate={{ x: ['-100px', '500px'] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Iniciando...
                  </>
                ) : (
                  <>
                    Iniciar Sesión
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </span>
            </motion.button>
          </form>

          {/* Separador */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="relative my-8"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[rgba(15,15,25,0.75)] text-gray-500">O continúa con</span>
            </div>
          </motion.div>

          {/* LOGIN SOCIAL */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {/* Google */}
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10
                       text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Chrome className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
              Google
            </button>

            {/* GitHub */}
            <button
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10
                       text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Github className="w-5 h-5 text-zinc-200 group-hover:scale-110 transition-transform" />
              GitHub
            </button>
          </motion.div>

          {/* Registro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-center text-sm text-gray-400"
          >
            ¿No tienes una cuenta?{' '}
            <button className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
              Regístrate aquí
            </button>
          </motion.div>
        </div>

        {/* Resplandor debajo del card */}
        <div
          className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none -z-10"
          style={{
            background:
              'radial-gradient(circle, rgba(102,126,234,0.3) 0%, rgba(118,75,162,0.2) 40%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </motion.div>

      {/* ========================================
          PARTÍCULAS FLOTANTES
      ======================================== */}
      {[...Array(20)].map((_, i) => {
        const uniqueId = `particle-${Math.random().toString(36).substr(2, 9)}`;
        return (
          <motion.div
            key={uniqueId}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(135deg, ${
                i % 3 === 0 ? '#667eea' : i % 3 === 1 ? '#764ba2' : '#f093fb'
              } 0%, transparent 100%)`,
              filter: 'blur(1px)',
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: 'easeInOut',
            }}
          />
        );
      })}

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, transparent 0%, transparent 60%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </div>
  );
}

ChronosLoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onSocialLogin: PropTypes.func.isRequired,
};

export default ChronosLoginPage;
