/**
 * 📋 FORM SECTION COMPONENT
 *
 * Componente para agrupar secciones de formularios con estilo premium,
 * colapsables, con animaciones y glassmorphism.
 *
 * @module FlowDistributor/components/forms
 */

import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    CheckCircle2,
    ChevronDown,
    Info,
    Lock
} from 'lucide-react';
import React from 'react';

// ============================================================================
// INTERFACES
// ============================================================================

interface FormSectionProps {
  /** Título de la sección */
  title: string;

  /** Descripción de la sección */
  description?: string;

  /** Icono de la sección */
  icon?: React.ReactNode;

  /** Children (campos del formulario) */
  children: React.ReactNode;

  /** Colapsable */
  collapsible?: boolean;

  /** Inicialmente colapsado */
  defaultCollapsed?: boolean;

  /** Requerido (muestra indicador) */
  required?: boolean;

  /** Completado (muestra check) */
  completed?: boolean;

  /** Tiene errores */
  hasErrors?: boolean;

  /** Bloqueada/Deshabilitada */
  disabled?: boolean;

  /** Columnas en el grid */
  columns?: 1 | 2 | 3 | 4;

  /** Variante visual */
  variant?: 'default' | 'accent' | 'warning' | 'success' | 'error';

  /** ClassName personalizado */
  className?: string;

  /** Callback al expandir/colapsar */
  onToggle?: (isCollapsed: boolean) => void;
}

// ============================================================================
// VARIANTES DE ESTILO
// ============================================================================

const variantStyles = {
  default: {
    bg: 'bg-white/5',
    border: 'border-white/10',
    headerBg: 'bg-white/5',
    titleColor: 'text-white'
  },
  accent: {
    bg: 'bg-blue-500/5',
    border: 'border-blue-500/20',
    headerBg: 'bg-blue-500/10',
    titleColor: 'text-blue-300'
  },
  warning: {
    bg: 'bg-yellow-500/5',
    border: 'border-yellow-500/20',
    headerBg: 'bg-yellow-500/10',
    titleColor: 'text-yellow-300'
  },
  success: {
    bg: 'bg-green-500/5',
    border: 'border-green-500/20',
    headerBg: 'bg-green-500/10',
    titleColor: 'text-green-300'
  },
  error: {
    bg: 'bg-red-500/5',
    border: 'border-red-500/20',
    headerBg: 'bg-red-500/10',
    titleColor: 'text-red-300'
  }
};

const gridColumns = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
};

// ============================================================================
// COMPONENTE
// ============================================================================

/**
 * FormSection - Sección de formulario con estilo premium
 *
 * @example
 * ```tsx
 * <FormSection
 *   title="Información Personal"
 *   description="Datos básicos del usuario"
 *   collapsible
 *   columns={2}
 *   required
 * >
 *   <FieldWrapper label="Nombre" name="nombre">...</FieldWrapper>
 *   <FieldWrapper label="Email" name="email">...</FieldWrapper>
 * </FormSection>
 * ```
 */
export function FormSection({
  title,
  description,
  icon,
  children,
  collapsible = false,
  defaultCollapsed = false,
  required = false,
  completed = false,
  hasErrors = false,
  disabled = false,
  columns = 1,
  variant = 'default',
  className = '',
  onToggle
}: FormSectionProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const styles = variantStyles[variant];

  // Auto variant basado en estado
  const effectiveVariant = hasErrors ? 'error'
    : completed ? 'success'
    : variant;

  const effectiveStyles = variantStyles[effectiveVariant];

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onToggle?.(newState);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        rounded-xl border backdrop-blur-sm overflow-hidden
        ${effectiveStyles.bg} ${effectiveStyles.border}
        ${disabled ? 'opacity-60 pointer-events-none' : ''}
        ${className}
      `}
    >
      {/* Header */}
      <div
        className={`
          px-6 py-4 ${effectiveStyles.headerBg}
          ${collapsible ? 'cursor-pointer hover:bg-white/10 transition-colors' : ''}
        `}
        onClick={collapsible ? handleToggle : undefined}
        role={collapsible ? 'button' : undefined}
        tabIndex={collapsible ? 0 : undefined}
        onKeyDown={(e) => {
          if (collapsible && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {/* Icono */}
            {icon && (
              <div className="flex-shrink-0 mt-0.5">
                {icon}
              </div>
            )}

            <div className="flex-1 min-w-0">
              {/* Título */}
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`text-lg font-semibold ${effectiveStyles.titleColor}`}>
                  {title}
                </h3>

                {/* Badges */}
                <div className="flex items-center gap-1.5">
                  {required && (
                    <span className="text-xs text-red-400 font-medium">
                      *
                    </span>
                  )}

                  {completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </motion.div>
                  )}

                  {hasErrors && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    </motion.div>
                  )}

                  {disabled && (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Descripción */}
              {description && (
                <p className="text-sm text-gray-400 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Toggle Button */}
          {collapsible && (
            <motion.button
              type="button"
              className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors ml-2"
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.2 }}
              aria-label={isCollapsed ? 'Expandir sección' : 'Colapsar sección'}
            >
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence initial={false}>
        {(!collapsible || !isCollapsed) && (
          <motion.div
            key="content"
            initial={collapsible ? { height: 0, opacity: 0 } : undefined}
            animate={collapsible ? { height: 'auto', opacity: 1 } : undefined}
            exit={collapsible ? { height: 0, opacity: 0 } : undefined}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className={`px-6 py-5 grid ${gridColumns[columns]} gap-6`}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================================
// VARIANTES DEL COMPONENTE
// ============================================================================

/**
 * FormSectionAccent - Sección con variante accent
 */
export function FormSectionAccent(props: Omit<FormSectionProps, 'variant'>) {
  return <FormSection {...props} variant="accent" />;
}

/**
 * FormSectionWarning - Sección con variante warning
 */
export function FormSectionWarning(props: Omit<FormSectionProps, 'variant'>) {
  return <FormSection {...props} variant="warning" />;
}

/**
 * FormSectionSuccess - Sección con variante success
 */
export function FormSectionSuccess(props: Omit<FormSectionProps, 'variant'>) {
  return <FormSection {...props} variant="success" />;
}

/**
 * FormSectionError - Sección con variante error
 */
export function FormSectionError(props: Omit<FormSectionProps, 'variant'>) {
  return <FormSection {...props} variant="error" />;
}

// ============================================================================
// COMPONENTE DE STEPPER
// ============================================================================

interface FormStepperProps {
  /** Secciones */
  sections: Array<{
    id: string;
    title: string;
    description?: string;
    icon?: React.ReactNode;
    completed?: boolean;
    hasErrors?: boolean;
  }>;

  /** Sección activa actual */
  currentSection: string;

  /** Callback al cambiar de sección */
  onSectionChange: (sectionId: string) => void;

  /** Orientación */
  orientation?: 'horizontal' | 'vertical';

  /** ClassName personalizado */
  className?: string;
}

/**
 * FormStepper - Navegación por secciones de formulario
 *
 * @example
 * ```tsx
 * <FormStepper
 *   sections={[
 *     { id: 'personal', title: 'Información Personal', completed: true },
 *     { id: 'contact', title: 'Contacto', completed: false }
 *   ]}
 *   currentSection="contact"
 *   onSectionChange={setCurrentSection}
 * />
 * ```
 */
export function FormStepper({
  sections,
  currentSection,
  onSectionChange,
  orientation = 'horizontal',
  className = ''
}: FormStepperProps) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      className={`
        flex ${isHorizontal ? 'flex-row' : 'flex-col'}
        ${isHorizontal ? 'items-center' : 'items-start'}
        gap-2
        ${className}
      `}
    >
      {sections.map((section, index) => {
        const isActive = section.id === currentSection;
        const isPast = sections.findIndex(s => s.id === currentSection) > index;

        return (
          <React.Fragment key={section.id}>
            {/* Step */}
            <motion.button
              type="button"
              onClick={() => onSectionChange(section.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl
                border backdrop-blur-sm transition-all
                ${isActive
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                  : section.completed
                  ? 'bg-green-500/10 border-green-500/30 text-green-300 hover:bg-green-500/20'
                  : section.hasErrors
                  ? 'bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }
              `}
            >
              {/* Number/Icon */}
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full
                  text-sm font-semibold
                  ${isActive
                    ? 'bg-blue-500 text-white'
                    : section.completed
                    ? 'bg-green-500 text-white'
                    : section.hasErrors
                    ? 'bg-red-500 text-white'
                    : 'bg-white/10 text-gray-400'
                  }
                `}
              >
                {section.icon || (index + 1)}
              </div>

              {/* Title */}
              <div className={isHorizontal ? 'hidden lg:block' : ''}>
                <div className="text-sm font-medium text-left">
                  {section.title}
                </div>
                {section.description && (
                  <div className="text-xs opacity-75">
                    {section.description}
                  </div>
                )}
              </div>

              {/* Status Icon */}
              {section.completed && (
                <CheckCircle2 className="w-4 h-4" />
              )}
              {section.hasErrors && (
                <AlertCircle className="w-4 h-4" />
              )}
            </motion.button>

            {/* Connector */}
            {index < sections.length - 1 && (
              <div
                className={`
                  ${isHorizontal ? 'flex-1 h-0.5' : 'w-0.5 h-8 ml-8'}
                  ${isPast || section.completed
                    ? 'bg-gradient-to-r from-green-500 to-blue-500'
                    : 'bg-white/10'
                  }
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default FormSection;
