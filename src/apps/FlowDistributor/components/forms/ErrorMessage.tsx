/**
 * 🎨 ERROR MESSAGE COMPONENT
 *
 * Componente premium para mostrar mensajes de error de validación
 * con animaciones suaves y diseño glassmorphism.
 *
 * @module FlowDistributor/components/forms
 */

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, XCircle } from 'lucide-react';
import type { FieldError } from 'react-hook-form';

// ============================================================================
// INTERFACES
// ============================================================================

interface ErrorMessageProps {
  /** Error object from React Hook Form */
  error?: FieldError;

  /** Custom className for styling */
  className?: string;

  /** Tipo de error visual */
  variant?: 'error' | 'warning' | 'critical';

  /** Mostrar icono */
  showIcon?: boolean;

  /** Animación de entrada */
  animation?: 'slide' | 'fade' | 'scale';
}

// ============================================================================
// VARIANTES DE ESTILO
// ============================================================================

const variantStyles = {
  error: {
    bg: 'bg-zinc-9000/10',
    border: 'border-zinc-500/20',
    text: 'text-zinc-200',
    icon: 'text-zinc-200'
  },
  warning: {
    bg: 'bg-zinc-9000/10',
    border: 'border-zinc-500/20',
    text: 'text-zinc-200',
    icon: 'text-zinc-200'
  },
  critical: {
    bg: 'bg-zinc-700/20',
    border: 'border-red-600/30',
    text: 'text-red-300',
    icon: 'text-red-300'
  }
};

const icons = {
  error: AlertCircle,
  warning: AlertTriangle,
  critical: XCircle
};

// ============================================================================
// ANIMACIONES
// ============================================================================

const animations = {
  slide: {
    initial: { opacity: 0, y: -10, height: 0 },
    animate: { opacity: 1, y: 0, height: 'auto' },
    exit: { opacity: 0, y: -10, height: 0 }
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  }
};

// ============================================================================
// COMPONENTE
// ============================================================================

/**
 * ErrorMessage - Muestra mensajes de error de validación
 *
 * @example
 * ```tsx
 * <ErrorMessage error={errors.email} />
 * <ErrorMessage error={errors.password} variant="critical" />
 * <ErrorMessage error={errors.name} animation="scale" />
 * ```
 */
export function ErrorMessage({
  error,
  className = '',
  variant = 'error',
  showIcon = true,
  animation = 'slide'
}: ErrorMessageProps) {
  // No mostrar si no hay error
  if (!error) return null;

  const styles = variantStyles[variant];
  const Icon = icons[variant];
  const motionVariants = animations[animation];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={error.message}
        initial={motionVariants.initial}
        animate={motionVariants.animate}
        exit={motionVariants.exit}
        transition={{
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1]
        }}
        className={`
          flex items-start gap-2.5 text-sm mt-1.5 rounded-lg px-3.5 py-2.5
          backdrop-blur-sm
          ${styles.bg} ${styles.border} ${styles.text}
          border
          ${className}
        `}
        role="alert"
        aria-live="polite"
      >
        {showIcon && (
          <Icon
            className={`w-4 h-4 mt-0.5 flex-shrink-0 ${styles.icon}`}
            aria-hidden="true"
          />
        )}

        <span className="flex-1 leading-relaxed">
          {error.message}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================================================
// VARIANTES DEL COMPONENTE
// ============================================================================

/**
 * ErrorMessageCritical - Versión para errores críticos
 */
export function ErrorMessageCritical({ error, className }: Omit<ErrorMessageProps, 'variant'>) {
  return (
    <ErrorMessage
      error={error}
      variant="critical"
      className={className}
    />
  );
}

/**
 * ErrorMessageWarning - Versión para advertencias
 */
export function ErrorMessageWarning({ error, className }: Omit<ErrorMessageProps, 'variant'>) {
  return (
    <ErrorMessage
      error={error}
      variant="warning"
      className={className}
    />
  );
}

/**
 * ErrorMessageSimple - Versión sin icono
 */
export function ErrorMessageSimple({ error, className }: Omit<ErrorMessageProps, 'showIcon'>) {
  return (
    <ErrorMessage
      error={error}
      showIcon={false}
      className={className}
    />
  );
}

// ============================================================================
// COMPONENTE DE LISTA DE ERRORES
// ============================================================================

interface ErrorListProps {
  /** Array de errores */
  errors: Array<{ field: string; message: string }>;

  /** Título de la lista */
  title?: string;

  /** Variante visual */
  variant?: 'error' | 'warning' | 'critical';

  /** ClassName personalizado */
  className?: string;
}

/**
 * ErrorList - Lista de múltiples errores
 *
 * @example
 * ```tsx
 * <ErrorList
 *   errors={[
 *     { field: 'email', message: 'Email inválido' },
 *     { field: 'password', message: 'Contraseña muy corta' }
 *   ]}
 *   title="Errores de validación"
 * />
 * ```
 */
export function ErrorList({
  errors,
  title = 'Errores de validación',
  variant = 'error',
  className = ''
}: ErrorListProps) {
  if (!errors || errors.length === 0) return null;

  const styles = variantStyles[variant];
  const Icon = icons[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`
        rounded-xl p-4 space-y-3
        backdrop-blur-sm
        ${styles.bg} ${styles.border}
        border
        ${className}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        <Icon className={`w-5 h-5 ${styles.icon}`} />
        <h3 className={`font-semibold ${styles.text}`}>
          {title} ({errors.length})
        </h3>
      </div>

      <ul className="space-y-2 ml-7">
        {errors.map((error, index) => (
          <motion.li
            key={`${error.field}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`text-sm ${styles.text}`}
          >
            <span className="font-medium">{error.field}:</span>{' '}
            {error.message}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default ErrorMessage;
