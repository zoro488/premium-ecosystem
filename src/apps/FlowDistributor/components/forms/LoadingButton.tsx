/**
 * 🎨 LOADING BUTTON COMPONENT
 *
 * Botón premium con estados de carga, éxito y error.
 * Incluye animaciones suaves y feedback visual avanzado.
 *
 * @module FlowDistributor/components/forms
 */

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import React from 'react';

// ============================================================================
// INTERFACES
// ============================================================================

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Texto del botón */
  children: React.ReactNode;

  /** Estado de carga */
  isLoading?: boolean;

  /** Estado de éxito */
  isSuccess?: boolean;

  /** Estado de error */
  isError?: boolean;

  /** Texto durante carga */
  loadingText?: string;

  /** Texto de éxito */
  successText?: string;

  /** Texto de error */
  errorText?: string;

  /** Variante visual */
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline';

  /** Tamaño */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /** Ancho completo */
  fullWidth?: boolean;

  /** Icono (lado izquierdo) */
  icon?: React.ReactNode;

  /** Icono (lado derecho) */
  iconRight?: React.ReactNode;

  /** Pulso en hover */
  pulse?: boolean;

  /** Efecto de resplandor */
  glow?: boolean;
}

// ============================================================================
// VARIANTES DE ESTILO
// ============================================================================

const variantStyles = {
  primary: {
    base: 'bg-gradient-to-r from-zinc-900 to-zinc-800 text-white',
    hover: 'hover:from-zinc-700 hover:to-zinc-800',
    active: 'active:from-zinc-800 active:to-zinc-900',
    disabled: 'disabled:from-gray-600 disabled:to-gray-700',
    glow: 'shadow-lg shadow-blue-500/25'
  },
  secondary: {
    base: 'bg-gray-700 text-white',
    hover: 'hover:bg-gray-600',
    active: 'active:bg-gray-800',
    disabled: 'disabled:bg-gray-800',
    glow: 'shadow-lg shadow-gray-500/25'
  },
  success: {
    base: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white',
    hover: 'hover:from-green-700 hover:to-emerald-700',
    active: 'active:from-green-800 active:to-emerald-800',
    disabled: 'disabled:from-gray-600 disabled:to-gray-700',
    glow: 'shadow-lg shadow-green-500/25'
  },
  danger: {
    base: 'bg-gradient-to-r from-zinc-700 to-zinc-700 text-white',
    hover: 'hover:from-zinc-700 hover:to-zinc-700',
    active: 'active:from-zinc-700 active:to-zinc-700',
    disabled: 'disabled:from-gray-600 disabled:to-gray-700',
    glow: 'shadow-lg shadow-red-500/25'
  },
  ghost: {
    base: 'bg-transparent text-gray-300 border border-white/10',
    hover: 'hover:bg-white/5 hover:border-white/20',
    active: 'active:bg-white/10',
    disabled: 'disabled:bg-transparent disabled:text-gray-600',
    glow: ''
  },
  outline: {
    base: 'bg-transparent text-zinc-300 border-2 border-zinc-700/50',
    hover: 'hover:bg-zinc-800/10 hover:border-zinc-700',
    active: 'active:bg-zinc-800/20',
    disabled: 'disabled:border-gray-600 disabled:text-gray-600',
    glow: 'shadow-lg shadow-blue-500/25'
  }
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl'
};

const iconSizes = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6'
};

// ============================================================================
// COMPONENTE
// ============================================================================

/**
 * LoadingButton - Botón con estados de carga y feedback
 *
 * @example
 * ```tsx
 * <LoadingButton
 *   isLoading={isSubmitting}
 *   loadingText="Guardando..."
 *   variant="primary"
 *   size="lg"
 * >
 *   Guardar
 * </LoadingButton>
 * ```
 */
export function LoadingButton({
  children,
  isLoading = false,
  isSuccess = false,
  isError = false,
  loadingText = 'Cargando...',
  successText = '¡Éxito!',
  errorText = 'Error',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconRight,
  pulse = false,
  glow = true,
  disabled,
  className = '',
  type = 'button',
  ...props
}: LoadingButtonProps) {
  const styles = variantStyles[variant];
  const isDisabled = disabled || isLoading || isSuccess;

  // Determinar contenido a mostrar
  let content = children;
  let currentIcon = icon;

  if (isLoading) {
    content = loadingText;
    currentIcon = <Loader2 className={`${iconSizes[size]} animate-spin`} />;
  } else if (isSuccess) {
    content = successText;
    currentIcon = <Check className={iconSizes[size]} />;
  } else if (isError) {
    content = errorText;
    currentIcon = <AlertCircle className={iconSizes[size]} />;
  }

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      className={`
        relative inline-flex items-center justify-center gap-2
        font-medium rounded-xl
        ${styles.base}
        ${!isDisabled ? styles.hover : ''}
        ${!isDisabled ? styles.active : ''}
        ${styles.disabled}
        ${glow ? styles.glow : ''}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
        overflow-hidden
        ${className}
      `}
      {...props}
    >
      {/* Efecto de pulso en hover */}
      {pulse && !isDisabled && (
        <motion.span
          className="absolute inset-0 bg-white/10 rounded-xl"
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{
            scale: 2,
            opacity: [0, 0.3, 0],
            transition: { duration: 0.6, repeat: Infinity }
          }}
        />
      )}

      {/* Loading overlay */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.span
            key="loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white"
          />
        )}
      </AnimatePresence>

      {/* Contenido */}
      <AnimatePresence mode="wait">
        <motion.span
          key={isLoading ? 'loading' : isSuccess ? 'success' : isError ? 'error' : 'default'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="flex items-center justify-center gap-2"
        >
          {/* Icono izquierdo */}
          {currentIcon && (
            <span className="flex-shrink-0">
              {currentIcon}
            </span>
          )}

          {/* Texto */}
          <span>{content}</span>

          {/* Icono derecho */}
          {!isLoading && !isSuccess && !isError && iconRight && (
            <span className="flex-shrink-0">
              {iconRight}
            </span>
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

// ============================================================================
// VARIANTES DEL COMPONENTE
// ============================================================================

/**
 * PrimaryButton - Botón primario con loading
 */
export function PrimaryButton(props: Omit<LoadingButtonProps, 'variant'>) {
  return <LoadingButton {...props} variant="primary" />;
}

/**
 * SecondaryButton - Botón secundario con loading
 */
export function SecondaryButton(props: Omit<LoadingButtonProps, 'variant'>) {
  return <LoadingButton {...props} variant="secondary" />;
}

/**
 * SuccessButton - Botón de éxito con loading
 */
export function SuccessButton(props: Omit<LoadingButtonProps, 'variant'>) {
  return <LoadingButton {...props} variant="success" />;
}

/**
 * DangerButton - Botón de peligro con loading
 */
export function DangerButton(props: Omit<LoadingButtonProps, 'variant'>) {
  return <LoadingButton {...props} variant="danger" />;
}

/**
 * GhostButton - Botón ghost con loading
 */
export function GhostButton(props: Omit<LoadingButtonProps, 'variant'>) {
  return <LoadingButton {...props} variant="ghost" />;
}

/**
 * OutlineButton - Botón outline con loading
 */
export function OutlineButton(props: Omit<LoadingButtonProps, 'variant'>) {
  return <LoadingButton {...props} variant="outline" />;
}

// ============================================================================
// GRUPO DE BOTONES
// ============================================================================

interface ButtonGroupProps {
  /** Children (LoadingButtons) */
  children: React.ReactNode;

  /** Orientación */
  orientation?: 'horizontal' | 'vertical';

  /** Alineación */
  align?: 'start' | 'center' | 'end' | 'stretch';

  /** Espaciado */
  spacing?: 'sm' | 'md' | 'lg';

  /** ClassName personalizado */
  className?: string;
}

/**
 * ButtonGroup - Agrupa múltiples botones
 *
 * @example
 * ```tsx
 * <ButtonGroup align="end" spacing="md">
 *   <GhostButton>Cancelar</GhostButton>
 *   <PrimaryButton isLoading={isSubmitting}>Guardar</PrimaryButton>
 * </ButtonGroup>
 * ```
 */
export function ButtonGroup({
  children,
  orientation = 'horizontal',
  align = 'start',
  spacing = 'md',
  className = ''
}: ButtonGroupProps) {
  const orientationClasses = orientation === 'horizontal'
    ? 'flex-row'
    : 'flex-col';

  const alignClasses = {
    start: orientation === 'horizontal' ? 'justify-start' : 'items-start',
    center: orientation === 'horizontal' ? 'justify-center' : 'items-center',
    end: orientation === 'horizontal' ? 'justify-end' : 'items-end',
    stretch: orientation === 'horizontal' ? 'justify-stretch' : 'items-stretch'
  };

  const spacingClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4'
  };

  return (
    <div
      className={`
        flex ${orientationClasses} ${alignClasses[align]} ${spacingClasses[spacing]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default LoadingButton;
