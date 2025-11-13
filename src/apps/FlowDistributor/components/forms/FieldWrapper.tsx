/**
 * 🎨 FIELD WRAPPER COMPONENT
 *
 * Componente wrapper para campos de formulario con validación visual,
 * labels, iconos de estado y mensajes de ayuda.
 *
 * @module FlowDistributor/components/forms
 */

import { motion } from 'framer-motion';
import { AlertCircle, Check, HelpCircle, Info } from 'lucide-react';
import React from 'react';
import type { FieldError } from 'react-hook-form';
import { ErrorMessage } from './ErrorMessage';

// ============================================================================
// INTERFACES
// ============================================================================

interface FieldWrapperProps {
  /** Label del campo */
  label: string;

  /** Nombre del campo (para htmlFor) */
  name: string;

  /** Error de validación */
  error?: FieldError;

  /** Indica si el campo es válido */
  isValid?: boolean;

  /** Campo requerido */
  required?: boolean;

  /** Campo deshabilitado */
  disabled?: boolean;

  /** Children (input, select, etc) */
  children: React.ReactNode;

  /** Texto de ayuda */
  helperText?: string;

  /** Descripción adicional */
  description?: string;

  /** Tooltip informativo */
  tooltip?: string;

  /** Mostrar contador de caracteres */
  showCharCount?: boolean;

  /** Valor actual (para contador) */
  currentLength?: number;

  /** Máximo de caracteres */
  maxLength?: number;

  /** Orientación del label */
  labelPosition?: 'top' | 'left';

  /** ClassName personalizado */
  className?: string;

  /** ClassName para el label */
  labelClassName?: string;

  /** ClassName para el wrapper del input */
  inputWrapperClassName?: string;
}

// ============================================================================
// COMPONENTE
// ============================================================================

/**
 * FieldWrapper - Wrapper premium para campos de formulario
 *
 * @example
 * ```tsx
 * <FieldWrapper
 *   label="Email"
 *   name="email"
 *   error={errors.email}
 *   isValid={!errors.email && touchedFields.email}
 *   required
 *   helperText="Ingresa tu correo electrónico"
 * >
 *   <input {...register('email')} />
 * </FieldWrapper>
 * ```
 */
export function FieldWrapper({
  label,
  name,
  error,
  isValid,
  required,
  disabled,
  children,
  helperText,
  description,
  tooltip,
  showCharCount,
  currentLength,
  maxLength,
  labelPosition = 'top',
  className = '',
  labelClassName = '',
  inputWrapperClassName = ''
}: FieldWrapperProps) {
  const [showTooltip, setShowTooltip] = React.useState(false);

  // Clases base
  const wrapperClasses = labelPosition === 'left'
    ? 'grid grid-cols-12 gap-4 items-start'
    : 'space-y-2';

  const labelWrapperClasses = labelPosition === 'left'
    ? 'col-span-3'
    : '';

  const inputContainerClasses = labelPosition === 'left'
    ? 'col-span-9'
    : '';

  return (
    <div className={`${wrapperClasses} ${className}`}>
      {/* Label Section */}
      <div className={labelWrapperClasses}>
        <div className="flex items-center gap-2">
          <label
            htmlFor={name}
            className={`
              block text-sm font-medium
              ${disabled ? 'text-gray-500' : 'text-gray-200'}
              ${labelClassName}
            `}
          >
            {label}
            {required && (
              <span className="text-red-400 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>

          {/* Validation Status Icon */}
          {isValid && !error && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30
              }}
            >
              <Check
                className="w-4 h-4 text-green-500"
                aria-label="valid"
              />
            </motion.div>
          )}

          {/* Tooltip Icon */}
          {tooltip && (
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                className="text-gray-400 hover:text-gray-300 transition-colors"
                aria-label="help"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="
                    absolute left-0 top-full mt-2 z-10
                    bg-gray-900 border border-white/10
                    rounded-lg px-3 py-2 shadow-xl
                    text-xs text-gray-200
                    whitespace-nowrap max-w-xs
                  "
                >
                  {tooltip}
                  <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 border-l border-t border-white/10 transform rotate-45" />
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Description (for left-aligned labels) */}
        {description && labelPosition === 'left' && (
          <p className="text-xs text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>

      {/* Input Section */}
      <div className={inputContainerClasses}>
        {/* Description (for top-aligned labels) */}
        {description && labelPosition === 'top' && (
          <p className="text-xs text-gray-400 mb-2 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            {description}
          </p>
        )}

        {/* Input Wrapper */}
        <div className={`relative ${inputWrapperClassName}`}>
          {children}

          {/* Error Icon Overlay */}
          {error && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            >
              <AlertCircle className="w-5 h-5 text-red-400" />
            </motion.div>
          )}
        </div>

        {/* Character Counter */}
        {showCharCount && maxLength && (
          <div className="flex justify-end mt-1">
            <span
              className={`
                text-xs
                ${currentLength && currentLength > maxLength * 0.9
                  ? currentLength >= maxLength
                    ? 'text-red-400'
                    : 'text-yellow-400'
                  : 'text-gray-500'
                }
              `}
            >
              {currentLength || 0} / {maxLength}
            </span>
          </div>
        )}

        {/* Error Message */}
        {error && <ErrorMessage error={error} />}

        {/* Helper Text */}
        {!error && helperText && (
          <p className="text-xs text-gray-400 mt-1.5 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// VARIANTES DEL COMPONENTE
// ============================================================================

/**
 * FieldWrapperInline - Versión con label a la izquierda
 */
export function FieldWrapperInline(props: Omit<FieldWrapperProps, 'labelPosition'>) {
  return <FieldWrapper {...props} labelPosition="left" />;
}

/**
 * FieldWrapperCompact - Versión compacta sin descripción ni helper
 */
export function FieldWrapperCompact(props: Omit<FieldWrapperProps, 'description' | 'helperText'>) {
  return <FieldWrapper {...props} />;
}

// ============================================================================
// COMPONENTE DE GRUPO DE CAMPOS
// ============================================================================

interface FieldGroupProps {
  /** Título del grupo */
  title: string;

  /** Descripción del grupo */
  description?: string;

  /** Children (FieldWrappers) */
  children: React.ReactNode;

  /** Columnas en el grid */
  columns?: 1 | 2 | 3 | 4;

  /** Collapsible */
  collapsible?: boolean;

  /** Inicialmente colapsado */
  defaultCollapsed?: boolean;

  /** ClassName personalizado */
  className?: string;
}

/**
 * FieldGroup - Agrupa campos relacionados visualmente
 *
 * @example
 * ```tsx
 * <FieldGroup title="Información Personal" columns={2}>
 *   <FieldWrapper label="Nombre" name="nombre">...</FieldWrapper>
 *   <FieldWrapper label="Email" name="email">...</FieldWrapper>
 * </FieldGroup>
 * ```
 */
export function FieldGroup({
  title,
  description,
  children,
  columns = 1,
  collapsible = false,
  defaultCollapsed = false,
  className = ''
}: FieldGroupProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div
      className={`
        rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm
        p-6 space-y-4
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-400">
              {description}
            </p>
          )}
        </div>

        {collapsible && (
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-gray-300 transition-colors p-1"
            aria-label={isCollapsed ? 'expand' : 'collapse'}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.2 }}
            >
              <AlertCircle className="w-5 h-5" />
            </motion.div>
          </button>
        )}
      </div>

      {/* Content */}
      {(!collapsible || !isCollapsed) && (
        <motion.div
          initial={collapsible ? { opacity: 0, height: 0 } : undefined}
          animate={collapsible ? { opacity: 1, height: 'auto' } : undefined}
          exit={collapsible ? { opacity: 0, height: 0 } : undefined}
          transition={{ duration: 0.2 }}
          className={`grid ${gridClasses[columns]} gap-6`}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default FieldWrapper;
