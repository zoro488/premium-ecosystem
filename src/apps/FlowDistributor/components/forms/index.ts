/**
 * 📦 FORM COMPONENTS - INDEX
 *
 * Exportación centralizada de todos los componentes de formulario.
 * Facilita las importaciones en otros archivos del proyecto.
 *
 * @module FlowDistributor/components/forms
 */

// Error Message
export {
    ErrorList, ErrorMessage,
    ErrorMessageCritical, ErrorMessageSimple, ErrorMessageWarning
} from './ErrorMessage';
export type { default as ErrorMessageType } from './ErrorMessage';

// Field Wrapper
export {
    FieldGroup, FieldWrapper, FieldWrapperCompact, FieldWrapperInline
} from './FieldWrapper';
export type { default as FieldWrapperType } from './FieldWrapper';

// Loading Button
export {
    ButtonGroup, DangerButton,
    GhostButton, LoadingButton, OutlineButton, PrimaryButton,
    SecondaryButton,
    SuccessButton
} from './LoadingButton';
export type { default as LoadingButtonType } from './LoadingButton';

// Form Section
export {
    FormSection,
    FormSectionAccent, FormSectionError, FormSectionSuccess, FormSectionWarning, FormStepper
} from './FormSection';
export type { default as FormSectionType } from './FormSection';

// Form Debugger
export { FormDebugger } from './FormDebugger';
export type { default as FormDebuggerType } from './FormDebugger';

/**
 * Re-export común para uso rápido
 */
// Re-export form components
export { ButtonGroup } from './ButtonGroup';
export { ErrorMessage } from './ErrorMessage';
export { FieldGroup } from './FieldGroup';
export { FieldWrapper } from './FieldWrapper';
export { FormDebugger } from './FormDebugger';
export { FormSection } from './FormSection';
export { FormStepper } from './FormStepper';
export { LoadingButton } from './LoadingButton';

/**
 * Utilerías de formulario
 */
export const FormUtils = {
  /**
   * Obtiene todos los errores de un objeto de errores de RHF
   */
  getAllErrors: (errors: any): Array<{ field: string; message: string }> => {
    const errorList: Array<{ field: string; message: string }> = [];

    const extractErrors = (obj: any, prefix = '') => {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const fieldName = prefix ? `${prefix}.${key}` : key;

        if (value.message) {
          errorList.push({
            field: fieldName,
            message: value.message
          });
        } else if (typeof value === 'object' && value !== null) {
          extractErrors(value, fieldName);
        }
      });
    };

    extractErrors(errors);
    return errorList;
  },

  /**
   * Verifica si hay errores en un objeto de errores
   */
  hasErrors: (errors: any): boolean => {
    return Object.keys(errors).length > 0;
  },

  /**
   * Cuenta el número total de errores
   */
  countErrors: (errors: any): number => {
    let count = 0;

    const countDeep = (obj: any) => {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (value.message) {
          count++;
        } else if (typeof value === 'object' && value !== null) {
          countDeep(value);
        }
      });
    };

    countDeep(errors);
    return count;
  },

  /**
   * Obtiene el primer error encontrado
   */
  getFirstError: (errors: any): { field: string; message: string } | null => {
    const allErrors = FormUtils.getAllErrors(errors);
    return allErrors.length > 0 ? allErrors[0] : null;
  }
};

/**
 * Hooks personalizados para formularios
 */
export const useFormScroll = () => {
  /**
   * Scroll al primer campo con error
   */
  const scrollToError = (errors: any) => {
    const firstError = FormUtils.getFirstError(errors);
    if (firstError) {
      const element = document.querySelector(`[name="${firstError.field}"]`);
      element?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  return { scrollToError };
};

/**
 * Tipos comunes de formularios
 */
export type FormMode = 'create' | 'edit' | 'view';

export interface BaseFormProps<T = any> {
  mode?: FormMode;
  initialData?: T;
  onSubmit: (data: T) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

/**
 * Estilos comunes para inputs
 */
export const commonInputStyles = {
  base: `
    w-full px-4 py-3 rounded-xl
    bg-white/5 backdrop-blur-sm
    border border-white/10
    text-white placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-blue-500/50
    focus:border-zinc-8000/50
    hover:bg-white/10 hover:border-white/20
    transition-all duration-200
  `,
  error: `
    border-zinc-500/50 focus:ring-red-500/50
  `,
  success: `
    border-zinc-500/50 focus:ring-green-500/50
  `,
  disabled: `
    opacity-50 cursor-not-allowed
  `
};

/**
 * Estilos comunes para labels
 */
export const commonLabelStyles = {
  base: 'block text-sm font-medium text-gray-200 mb-2',
  required: 'after:content-["*"] after:ml-1 after:text-zinc-200',
  disabled: 'text-gray-500'
};

/**
 * Constantes de validación
 */
export const ValidationConstants = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_TEXT_LENGTH: 500,
  MAX_LONG_TEXT_LENGTH: 1000,
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 100,
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 1000000,
  PHONE_REGEX: /^[0-9]{10}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  RFC_REGEX: /^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/,
  DATE_REGEX: /^\d{4}-\d{2}-\d{2}$/
};
