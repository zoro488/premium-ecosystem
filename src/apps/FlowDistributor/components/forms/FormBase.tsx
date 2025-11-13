/**
 * 📋 FormBase - Componente base para todos los formularios
 * Características:
 * - Validación con Zod
 * - Estados de carga, éxito, error
 * - Campos dinámicos con tipos múltiples
 * - Animaciones con Framer Motion
 * - Diseño glassmorphism premium
 */
import React, { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  Info,
  Loader2,
  X,
} from 'lucide-react';
import { z } from 'zod';

export type FieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'tel'
  | 'date'
  | 'datetime-local'
  | 'select'
  | 'textarea'
  | 'checkbox'
  | 'radio'
  | 'currency'
  | 'autocomplete';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string | number; label: string }[];
  autocompleteOptions?: string[];
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  icon?: React.ReactNode;
  helperText?: string;
  validation?: z.ZodSchema<any>;
  dependsOn?: string; // Campo que determina si este se muestra
  showWhen?: (value: any) => boolean; // Función que determina cuándo mostrar
}

export interface FormBaseProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  fields: FormField[];
  initialValues?: Record<string, any>;
  validationSchema?: z.ZodSchema<any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isWizard?: boolean;
  steps?: string[];
  className?: string;
}

export const FormBase: React.FC<FormBaseProps> = ({
  title,
  subtitle,
  icon,
  fields,
  initialValues = {},
  validationSchema,
  onSubmit,
  onCancel,
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  isWizard = false,
  steps = [],
  className = '',
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [autocompleteQuery, setAutocompleteQuery] = useState<Record<string, string>>({});

  // Calcular campos por paso si es wizard
  const fieldsPerStep =
    isWizard && steps.length > 0 ? Math.ceil(fields.length / steps.length) : fields.length;

  const currentFields = isWizard
    ? fields.slice(currentStep * fieldsPerStep, (currentStep + 1) * fieldsPerStep)
    : fields;

  // Actualizar valor de campo
  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando se edita
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validar campo individual
  const validateField = (field: FormField): string | null => {
    const value = formData[field.name];

    if (field.required && (value === undefined || value === '' || value === null)) {
      return `${field.label} es requerido`;
    }

    if (field.validation) {
      try {
        field.validation.parse(value);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return error.errors[0].message;
        }
      }
    }

    return null;
  };

  // Validar todos los campos
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const error = validateField(field);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    // Validación con schema si existe
    if (validationSchema) {
      try {
        validationSchema.parse(formData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.errors.forEach((err) => {
            if (err.path[0]) {
              newErrors[err.path[0] as string] = err.message;
            }
          });
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isWizard && currentStep < steps.length - 1) {
      // Validar solo los campos del paso actual
      const stepErrors: Record<string, string> = {};
      currentFields.forEach((field) => {
        const error = validateField(field);
        if (error) {
          stepErrors[field.name] = error;
        }
      });

      if (Object.keys(stepErrors).length === 0) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setErrors(stepErrors);
      }
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await onSubmit(formData);
      setSubmitStatus('success');

      // Reset form después de 2 segundos
      setTimeout(() => {
        setFormData(initialValues);
        setErrors({});
        setSubmitStatus('idle');
        setCurrentStep(0);
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error al enviar formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar campo según tipo
  const renderField = (field: FormField) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];

    // Verificar dependencias
    if (field.dependsOn && field.showWhen) {
      const dependentValue = formData[field.dependsOn];
      if (!field.showWhen(dependentValue)) {
        return null;
      }
    }

    const baseInputClasses = `w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder-slate-400 transition-all ${
      error ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-indigo-500'
    } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
      case 'date':
      case 'datetime-local':
        return (
          <input
            type={field.type}
            name={field.name}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={baseInputClasses}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        );

      case 'currency':
        return (
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input
              type="number"
              name={field.name}
              value={value}
              onChange={(e) => handleChange(field.name, parseFloat(e.target.value) || 0)}
              placeholder={field.placeholder}
              disabled={field.disabled}
              className={`${baseInputClasses} pl-8`}
              min={field.min || 0}
              step={field.step || 0.01}
            />
          </div>
        );

      case 'textarea':
        return (
          <textarea
            name={field.name}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            rows={field.rows || 4}
            className={baseInputClasses}
          />
        );

      case 'select':
        return (
          <div className="relative">
            <select
              name={field.name}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              disabled={field.disabled}
              className={`${baseInputClasses} appearance-none pr-10 cursor-pointer`}
            >
              <option value="">Seleccionar...</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
        );

      case 'autocomplete':
        const query = autocompleteQuery[field.name] || '';
        const filteredOptions =
          field.autocompleteOptions?.filter((option) =>
            option.toLowerCase().includes(query.toLowerCase())
          ) || [];

        return (
          <div className="relative">
            <input
              type="text"
              name={field.name}
              value={query}
              onChange={(e) => {
                setAutocompleteQuery((prev) => ({ ...prev, [field.name]: e.target.value }));
                handleChange(field.name, e.target.value);
              }}
              placeholder={field.placeholder}
              disabled={field.disabled}
              className={baseInputClasses}
            />
            {query && filteredOptions.length > 0 && (
              <motion.div
                className="absolute z-50 w-full mt-2 rounded-lg shadow-xl overflow-hidden"
                style={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {filteredOptions.slice(0, 5).map((option, index) => (
                  <motion.button
                    key={index}
                    type="button"
                    className="w-full px-4 py-2 text-left text-white hover:bg-indigo-500/20 transition-colors"
                    onClick={() => {
                      handleChange(field.name, option);
                      setAutocompleteQuery((prev) => ({ ...prev, [field.name]: option }));
                    }}
                    whileHover={{ x: 4 }}
                  >
                    {option}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name={field.name}
              checked={!!value}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              disabled={field.disabled}
              className="w-5 h-5 rounded border-white/10 bg-white/5 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            />
            <span className="text-white">{field.label}</span>
          </label>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  disabled={field.disabled}
                  className="w-5 h-5 border-white/10 bg-white/5 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                />
                <span className="text-white">{option.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`w-full max-w-2xl mx-auto ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className="rounded-2xl shadow-2xl overflow-hidden"
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
        }}
      >
        {/* HEADER */}
        <div
          className="px-6 py-5 border-b border-white/10"
          style={{
            background:
              'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
          }}
        >
          <div className="flex items-center gap-3">
            {icon && <div className="text-indigo-400">{icon}</div>}
            <div>
              <h2 className="text-2xl font-bold text-white">{title}</h2>
              {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
            </div>
          </div>

          {/* WIZARD STEPS */}
          {isWizard && steps.length > 0 && (
            <div className="mt-4 flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={index}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index < currentStep
                          ? 'bg-green-500 text-white'
                          : index === currentStep
                            ? 'bg-indigo-500 text-white'
                            : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                    </div>
                    <span
                      className={`text-sm ${
                        index <= currentStep ? 'text-white' : 'text-slate-500'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        index < currentStep ? 'bg-green-500' : 'bg-white/10'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <AnimatePresence mode="wait">
            {currentFields.map((field) => {
              // Skip checkbox fields in label rendering
              if (field.type === 'checkbox') {
                return (
                  <motion.div
                    key={field.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderField(field)}
                    {errors[field.name] && (
                      <motion.p
                        className="mt-1 text-sm text-red-400 flex items-center gap-1"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors[field.name]}
                      </motion.p>
                    )}
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block mb-2">
                    <div className="flex items-center gap-2 mb-2">
                      {field.icon && <div className="text-indigo-400">{field.icon}</div>}
                      <span className="text-sm font-medium text-white">
                        {field.label}
                        {field.required && <span className="text-red-400 ml-1">*</span>}
                      </span>
                    </div>
                    {renderField(field)}
                  </label>
                  {field.helperText && (
                    <p className="mt-1 text-xs text-slate-400 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      {field.helperText}
                    </p>
                  )}
                  {errors[field.name] && (
                    <motion.p
                      className="mt-1 text-sm text-red-400 flex items-center gap-1"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors[field.name]}
                    </motion.p>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* BOTONES */}
          <div className="flex gap-3 pt-4">
            {onCancel && (
              <motion.button
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-3 rounded-lg bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {cancelLabel}
              </motion.button>
            )}

            {isWizard && currentStep > 0 && (
              <motion.button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-6 py-3 rounded-lg bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Anterior
              </motion.button>
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background:
                  submitStatus === 'success'
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : submitStatus === 'error'
                      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                      : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              }}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Procesando...
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <Check className="w-5 h-5" />
                    ¡Éxito!
                  </>
                ) : submitStatus === 'error' ? (
                  <>
                    <X className="w-5 h-5" />
                    Error
                  </>
                ) : (
                  submitLabel
                )}
              </div>
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default FormBase;
