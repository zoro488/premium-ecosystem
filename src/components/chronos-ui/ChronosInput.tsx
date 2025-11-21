import type React from 'react';
import { forwardRef, useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface ChronosInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  success?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outline' | 'ghost';
  inputSize?: 'sm' | 'md' | 'lg';
  showPasswordToggle?: boolean;
  characterCount?: boolean;
  maxLength?: number;
  onValueChange?: (value: string) => void;
}

const ChronosInput = forwardRef<HTMLInputElement, ChronosInputProps>(
  (
    {
      label,
      error,
      helperText,
      success,
      loading,
      leftIcon,
      rightIcon,
      variant = 'default',
      inputSize = 'md',
      showPasswordToggle = false,
      characterCount = false,
      maxLength,
      className,
      type = 'text',
      disabled,
      value,
      onChange,
      onValueChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [charCount, setCharCount] = useState(0);

    const isPassword = type === 'password';
    const actualType = isPassword && showPassword ? 'text' : type;

    useEffect(() => {
      if (value !== undefined) {
        setCharCount(String(value).length);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setCharCount(newValue.length);
      onChange?.(e);
      onValueChange?.(newValue);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const sizeClasses = {
      sm: 'h-8 text-xs px-2',
      md: 'h-10 text-sm px-3',
      lg: 'h-12 text-base px-4',
    };

    const variantClasses = {
      default: 'bg-black/40 border-white/10 focus:border-chronos-cyan/50 hover:border-white/20',
      filled:
        'bg-gradient-to-br from-chronos-cyan/5 to-chronos-purple/5 border-transparent focus:border-chronos-cyan/30',
      outline: 'bg-transparent border-chronos-cyan/30 focus:border-chronos-cyan',
      ghost: 'bg-transparent border-transparent focus:bg-black/20 hover:bg-black/10',
    };

    const iconSize = {
      sm: 14,
      md: 16,
      lg: 18,
    };

    const hasError = Boolean(error);
    const hasSuccess = success && !hasError;

    return (
      <div className="w-full space-y-1.5">
        {/* Label */}
        <AnimatePresence mode="wait">
          {label && (
            <motion.label
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={cn(
                'block text-sm font-medium transition-colors',
                isFocused ? 'text-chronos-cyan' : hasError ? 'text-red-400' : 'text-white/70'
              )}
            >
              {label}
              {props.required && <span className="ml-1 text-red-400">*</span>}
            </motion.label>
          )}
        </AnimatePresence>

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors',
                isFocused ? 'text-chronos-cyan' : hasError ? 'text-red-400' : 'text-white/40'
              )}
            >
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <motion.input
            ref={ref}
            type={actualType}
            disabled={disabled || loading}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            maxLength={maxLength}
            whileFocus={{ scale: 1.005 }}
            className={cn(
              'w-full rounded-lg border backdrop-blur-xl transition-all duration-300',
              'text-white placeholder:text-white/30',
              'focus:outline-none focus:ring-2 focus:ring-chronos-cyan/20',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              sizeClasses[inputSize],
              variantClasses[variant],
              leftIcon && 'pl-10',
              (rightIcon ||
                hasError ||
                hasSuccess ||
                loading ||
                (isPassword && showPasswordToggle)) &&
                'pr-10',
              hasError && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20',
              hasSuccess && 'border-green-500/50 focus:border-green-500 focus:ring-green-500/20',
              className
            )}
            {...props}
          />

          {/* Right Icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Loader2 className="animate-spin text-chronos-cyan" size={iconSize[inputSize]} />
                </motion.div>
              )}

              {!loading && hasError && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <AlertCircle className="text-red-400" size={iconSize[inputSize]} />
                </motion.div>
              )}

              {!loading && !hasError && hasSuccess && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <CheckCircle className="text-green-400" size={iconSize[inputSize]} />
                </motion.div>
              )}

              {!loading && !hasError && !hasSuccess && rightIcon && (
                <motion.div
                  key="rightIcon"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={cn(
                    'transition-colors',
                    isFocused ? 'text-chronos-cyan' : 'text-white/40'
                  )}
                >
                  {rightIcon}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password Toggle */}
            {isPassword && showPasswordToggle && !loading && (
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'transition-colors focus:outline-none',
                  isFocused ? 'text-chronos-cyan' : 'text-white/40 hover:text-white/60'
                )}
              >
                {showPassword ? (
                  <EyeOff size={iconSize[inputSize]} />
                ) : (
                  <Eye size={iconSize[inputSize]} />
                )}
              </motion.button>
            )}
          </div>

          {/* Focus Glow Effect */}
          <AnimatePresence>
            {isFocused && !hasError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-chronos-cyan/10 to-chronos-purple/10 blur-xl -z-10"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Helper Text / Error / Character Count */}
        <div className="flex items-center justify-between gap-2 min-h-[20px]">
          <AnimatePresence mode="wait">
            {hasError ? (
              <motion.p
                key="error"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-xs text-red-400 flex items-center gap-1"
              >
                <AlertCircle size={12} />
                {error}
              </motion.p>
            ) : helperText ? (
              <motion.p
                key="helper"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-xs text-white/50"
              >
                {helperText}
              </motion.p>
            ) : (
              <div />
            )}
          </AnimatePresence>

          {characterCount && maxLength && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                'text-xs transition-colors',
                charCount > maxLength
                  ? 'text-red-400'
                  : charCount > maxLength * 0.9
                    ? 'text-yellow-400'
                    : 'text-white/40'
              )}
            >
              {charCount}/{maxLength}
            </motion.span>
          )}
        </div>
      </div>
    );
  }
);

ChronosInput.displayName = 'ChronosInput';

export default ChronosInput;
