/**
 * 📝 ULTRA PREMIUM FORM INPUTS - Inputs con animaciones avanzadas
 * Input, Select, Textarea, Checkbox con validation states, focus effects premium
 */
import { forwardRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check, Eye, EyeOff } from 'lucide-react';

/**
 * Ultra Premium Text Input
 */
export const UltraPremiumInput = forwardRef(
  (
    {
      label,
      error,
      success,
      hint,
      icon: Icon,
      type = 'text',
      className = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className={`space-y-2 ${containerClassName}`}>
        {label && (
          <motion.label
            className="block text-sm font-semibold text-white"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {label}
          </motion.label>
        )}

        <div className="relative">
          {/* Holographic border animation */}
          <motion.div
            className="absolute inset-0 rounded-xl overflow-hidden"
            animate={{
              opacity: isFocused ? 1 : 0,
            }}
          >
            <motion.div
              className="absolute inset-0 border-2 border-transparent"
              animate={{
                borderImage: [
                  'linear-gradient(0deg, rgba(6,182,212,0.8), rgba(168,85,247,0.8)) 1',
                  'linear-gradient(90deg, rgba(168,85,247,0.8), rgba(236,72,153,0.8)) 1',
                  'linear-gradient(180deg, rgba(236,72,153,0.8), rgba(6,182,212,0.8)) 1',
                  'linear-gradient(270deg, rgba(6,182,212,0.8), rgba(168,85,247,0.8)) 1',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>

          {/* Input container */}
          <div
            className={`relative flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-zinc-900 to-black border-2 rounded-xl transition-all ${
              error
                ? 'border-red-500/50'
                : success
                  ? 'border-emerald-500/50'
                  : isFocused
                    ? 'border-cyan-500/30'
                    : 'border-zinc-700/50'
            }`}
          >
            {/* Icon */}
            {Icon && (
              <motion.div
                animate={{
                  scale: isFocused ? 1.1 : 1,
                  rotate: isFocused ? 360 : 0,
                }}
                transition={{ duration: 0.5 }}
                className={`${error ? 'text-red-400' : success ? 'text-emerald-400' : 'text-cyan-400'}`}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
            )}

            {/* Input */}
            <input
              ref={ref}
              type={inputType}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`flex-1 bg-transparent text-white placeholder-zinc-500 outline-none ${className}`}
              {...props}
            />

            {/* Password toggle */}
            {isPassword && (
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </motion.button>
            )}

            {/* Success/Error indicator */}
            <AnimatePresence>
              {(error || success) && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  className={error ? 'text-red-400' : 'text-emerald-400'}
                >
                  {error ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Focus glow */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl -z-10"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Hint or Error message */}
        <AnimatePresence mode="wait">
          {(hint || error) && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`text-sm ${error ? 'text-red-400' : 'text-zinc-500'}`}
            >
              {error || hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

UltraPremiumInput.displayName = 'UltraPremiumInput';

/**
 * Ultra Premium Select
 */
export const UltraPremiumSelect = forwardRef(
  ({ label, error, hint, icon: Icon, options = [], className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="space-y-2">
        {label && (
          <motion.label
            className="block text-sm font-semibold text-white"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {label}
          </motion.label>
        )}

        <div className="relative">
          <div
            className={`relative flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-zinc-900 to-black border-2 rounded-xl transition-all ${
              error ? 'border-red-500/50' : isFocused ? 'border-cyan-500/30' : 'border-zinc-700/50'
            }`}
          >
            {Icon && (
              <motion.div
                animate={{ scale: isFocused ? 1.1 : 1 }}
                className={error ? 'text-red-400' : 'text-cyan-400'}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
            )}

            <select
              ref={ref}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`flex-1 bg-transparent text-white outline-none cursor-pointer ${className}`}
              {...props}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value} className="bg-zinc-900 text-white">
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {isFocused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl -z-10"
            />
          )}
        </div>

        {(hint || error) && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm ${error ? 'text-red-400' : 'text-zinc-500'}`}
          >
            {error || hint}
          </motion.p>
        )}
      </div>
    );
  }
);

UltraPremiumSelect.displayName = 'UltraPremiumSelect';

/**
 * Ultra Premium Textarea
 */
export const UltraPremiumTextarea = forwardRef(
  ({ label, error, hint, icon: Icon, rows = 4, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="space-y-2">
        {label && (
          <motion.label
            className="block text-sm font-semibold text-white"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {label}
          </motion.label>
        )}

        <div className="relative">
          <div
            className={`relative flex gap-3 px-4 py-3 bg-gradient-to-r from-zinc-900 to-black border-2 rounded-xl transition-all ${
              error ? 'border-red-500/50' : isFocused ? 'border-cyan-500/30' : 'border-zinc-700/50'
            }`}
          >
            {Icon && (
              <motion.div
                animate={{ scale: isFocused ? 1.1 : 1 }}
                className={`${error ? 'text-red-400' : 'text-cyan-400'} mt-1`}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
            )}

            <textarea
              ref={ref}
              rows={rows}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`flex-1 bg-transparent text-white placeholder-zinc-500 outline-none resize-none ${className}`}
              {...props}
            />
          </div>

          {isFocused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl -z-10"
            />
          )}
        </div>

        {(hint || error) && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm ${error ? 'text-red-400' : 'text-zinc-500'}`}
          >
            {error || hint}
          </motion.p>
        )}
      </div>
    );
  }
);

UltraPremiumTextarea.displayName = 'UltraPremiumTextarea';

/**
 * Ultra Premium Checkbox
 */
export const UltraPremiumCheckbox = forwardRef(
  ({ label, description, error, className = '', ...props }, ref) => {
    const [isChecked, setIsChecked] = useState(false);

    return (
      <div className="space-y-2">
        <label className="flex items-start gap-4 cursor-pointer group">
          <div className="relative mt-1">
            <input
              ref={ref}
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="sr-only"
              {...props}
            />

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                isChecked
                  ? 'bg-gradient-to-br from-cyan-500 to-purple-500 border-transparent'
                  : 'bg-zinc-900 border-zinc-700'
              }`}
            >
              <AnimatePresence>
                {isChecked && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Ripple effect */}
            <motion.div
              initial={{ scale: 1, opacity: 0 }}
              animate={isChecked ? { scale: 1.8, opacity: [0, 0.5, 0] } : {}}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 rounded-lg bg-cyan-500"
            />
          </div>

          <div className="flex-1">
            <span className="text-white font-medium group-hover:text-cyan-400 transition-colors">
              {label}
            </span>
            {description && <p className="text-sm text-zinc-500 mt-1">{description}</p>}
          </div>
        </label>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-400 ml-10"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

UltraPremiumCheckbox.displayName = 'UltraPremiumCheckbox';

export default {
  UltraPremiumInput,
  UltraPremiumSelect,
  UltraPremiumTextarea,
  UltraPremiumCheckbox,
};
