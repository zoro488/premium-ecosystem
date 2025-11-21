/**
 * 🔍 ULTRA PREMIUM SEARCH - SearchBar con efectos holográficos y autocomplete
 * Features: Magnetic hover, typing particles, holographic suggestions
 */
import { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { Clock, Search, Star, TrendingUp, X, Zap } from 'lucide-react';

/**
 * Ultra Premium SearchBar
 */
export const UltraPremiumSearch = ({
  placeholder = 'Buscar...',
  onSearch,
  suggestions = [],
  recentSearches = [],
  trendingSearches = [],
  autoFocus = false,
}) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [particles, setParticles] = useState([]);
  const inputRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  // Generar partículas al escribir
  useEffect(() => {
    if (value.length > 0) {
      const newParticle = {
        id: Date.now(),
        x: Math.random() * 100,
        y: 50,
      };
      setParticles((prev) => [...prev, newParticle]);

      // Remover partícula después de la animación
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 2000);
    }
  }, [value]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x * 0.1);
    mouseY.set(y * 0.1);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSearch = (searchValue) => {
    onSearch?.(searchValue || value);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setValue('');
    inputRef.current?.focus();
  };

  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x: springX, y: springY }}
        className="relative"
      >
        <motion.div
          animate={{
            boxShadow: isFocused
              ? [
                  '0 0 20px rgba(6,182,212,0.3)',
                  '0 0 40px rgba(168,85,247,0.3)',
                  '0 0 20px rgba(6,182,212,0.3)',
                ]
              : '0 0 0 rgba(0,0,0,0)',
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative bg-gradient-to-r from-zinc-900 to-black border-2 border-zinc-700/50 rounded-2xl overflow-hidden group"
        >
          {/* Holographic border animation */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
            animate={{
              background: [
                'linear-gradient(0deg, rgba(6,182,212,0.5), transparent)',
                'linear-gradient(90deg, rgba(168,85,247,0.5), transparent)',
                'linear-gradient(180deg, rgba(236,72,153,0.5), transparent)',
                'linear-gradient(270deg, rgba(6,182,212,0.5), transparent)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <AnimatePresence>
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  initial={{ x: `${particle.x}%`, y: `${particle.y}%`, opacity: 0, scale: 0 }}
                  animate={{
                    y: '-100%',
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                  className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Input Container */}
          <div className="relative z-10 flex items-center gap-4 px-6 py-4">
            {/* Search Icon */}
            <motion.div
              animate={{
                rotate: isFocused ? 360 : 0,
                scale: isFocused ? 1.1 : 1,
              }}
              transition={{ duration: 0.5 }}
            >
              <Search className="w-6 h-6 text-cyan-400" />
            </motion.div>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => {
                setIsFocused(true);
                setShowSuggestions(true);
              }}
              onBlur={() => {
                setIsFocused(false);
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              placeholder={placeholder}
              autoFocus={autoFocus}
              className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none text-lg font-medium"
            />

            {/* Clear Button */}
            <AnimatePresence>
              {value && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  onClick={handleClear}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Search Button */}
            <motion.button
              onClick={() => handleSearch()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-xl text-white font-semibold flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Buscar
            </motion.button>
          </div>

          {/* Bottom glow */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-focus-within:opacity-100"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (value || recentSearches.length > 0 || trendingSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute top-full mt-4 left-0 right-0 bg-gradient-to-br from-zinc-900 to-black border border-zinc-700/50 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* Suggestions matching search */}
            {filteredSuggestions.length > 0 && (
              <div className="p-4 border-b border-zinc-800/50">
                <h3 className="text-xs uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
                  <Search className="w-3 h-3" />
                  Sugerencias
                </h3>
                <div className="space-y-1">
                  {filteredSuggestions.slice(0, 5).map((suggestion, idx) => (
                    <motion.button
                      key={`sug-${idx}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => {
                        setValue(suggestion);
                        handleSearch(suggestion);
                      }}
                      whileHover={{ x: 4, backgroundColor: 'rgba(39, 39, 42, 0.5)' }}
                      className="w-full text-left px-4 py-3 rounded-xl text-white hover:text-cyan-400 transition-colors"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {!value && recentSearches.length > 0 && (
              <div className="p-4 border-b border-zinc-800/50">
                <h3 className="text-xs uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  Búsquedas Recientes
                </h3>
                <div className="space-y-1">
                  {recentSearches.slice(0, 3).map((search, idx) => (
                    <motion.button
                      key={`recent-${idx}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => {
                        setValue(search);
                        handleSearch(search);
                      }}
                      whileHover={{ x: 4, backgroundColor: 'rgba(39, 39, 42, 0.5)' }}
                      className="w-full text-left px-4 py-3 rounded-xl text-zinc-400 hover:text-white transition-colors"
                    >
                      {search}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            {!value && trendingSearches.length > 0 && (
              <div className="p-4">
                <h3 className="text-xs uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" />
                  Tendencias
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.slice(0, 6).map((trend, idx) => (
                    <motion.button
                      key={`trend-${idx}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => {
                        setValue(trend);
                        handleSearch(trend);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 border border-cyan-500/30 rounded-xl text-sm text-cyan-400 font-medium transition-all flex items-center gap-2"
                    >
                      <Star className="w-3 h-3" />
                      {trend}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={`dropdown-particle-${i}`}
                  className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UltraPremiumSearch;
