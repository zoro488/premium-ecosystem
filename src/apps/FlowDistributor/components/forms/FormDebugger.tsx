/**
 * 🐛 FORM DEBUGGER COMPONENT
 *
 * Herramienta de desarrollo para debugging de formularios React Hook Form.
 * Muestra valores actuales, errores, estado del formulario y más.
 * Solo visible en modo desarrollo.
 *
 * @module FlowDistributor/components/forms
 */

import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    Bug,
    Check,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Clock,
    Copy,
    X,
    XCircle
} from 'lucide-react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

// ============================================================================
// INTERFACES
// ============================================================================

interface FormDebuggerProps {
  /** Posición del panel */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

  /** Inicialmente minimizado */
  defaultMinimized?: boolean;

  /** Mostrar botón de cierre */
  closeable?: boolean;
}

// ============================================================================
// UTILS
// ============================================================================

/**
 * Copia texto al clipboard
 */
const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Error copiando al clipboard:', error);
    return false;
  }
};

/**
 * Formatea JSON con colores
 */
const formatJSON = (obj: any): string => {
  return JSON.stringify(obj, null, 2);
};

// ============================================================================
// COMPONENTE
// ============================================================================

/**
 * FormDebugger - Panel de debugging para formularios
 *
 * @example
 * ```tsx
 * <FormProvider {...methods}>
 *   <form>
 *     {/* campos del formulario *\/}
 *   </form>
 *   <FormDebugger />
 * </FormProvider>
 * ```
 */
export function FormDebugger({
  position = 'bottom-right',
  defaultMinimized = false,
  closeable = true
}: FormDebuggerProps) {
  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const formContext = useFormContext();

  // Si no hay contexto, no mostrar
  if (!formContext) {
    return null;
  }

  const { watch, formState } = formContext;
  const values = watch();

  // Estados locales
  const [isMinimized, setIsMinimized] = React.useState(defaultMinimized);
  const [isClosed, setIsClosed] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'values' | 'errors' | 'state'>('values');
  const [copied, setCopied] = React.useState(false);

  // Posicionamiento
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  // Handler para copiar
  const handleCopy = async () => {
    const dataToCopy = {
      values,
      errors: formState.errors,
      state: {
        isDirty: formState.isDirty,
        isValid: formState.isValid,
        isSubmitting: formState.isSubmitting,
        isSubmitted: formState.isSubmitted,
        isSubmitSuccessful: formState.isSubmitSuccessful,
        submitCount: formState.submitCount
      }
    };

    const success = await copyToClipboard(formatJSON(dataToCopy));
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // No mostrar si está cerrado
  if (isClosed) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`
        fixed ${positionClasses[position]} z-[9999]
        ${isMinimized ? 'w-auto' : 'w-96 max-w-[calc(100vw-2rem)]'}
        max-h-[calc(100vh-2rem)]
        bg-gray-900/95 backdrop-blur-xl
        border border-zinc-800/30
        rounded-xl shadow-2xl shadow-zinc-800/10
        overflow-hidden
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-zinc-800/10">
        <div className="flex items-center gap-2">
          <Bug className="w-5 h-5 text-zinc-800" />
          <span className="text-sm font-semibold text-white">
            Form Debugger
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Copy Button */}
          {!isMinimized && (
            <motion.button
              type="button"
              onClick={handleCopy}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="Copiar datos"
            >
              {copied ? (
                <Check className="w-4 h-4 text-zinc-200" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </motion.button>
          )}

          {/* Minimize Button */}
          <motion.button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title={isMinimized ? 'Expandir' : 'Minimizar'}
          >
            {isMinimized ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </motion.button>

          {/* Close Button */}
          {closeable && (
            <motion.button
              type="button"
              onClick={() => setIsClosed(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="Cerrar"
            >
              <X className="w-4 h-4 text-gray-400" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2 p-4 bg-white/5">
              <StatBadge
                icon={formState.isDirty ? AlertCircle : CheckCircle}
                label="Dirty"
                value={String(formState.isDirty)}
                color={formState.isDirty ? 'yellow' : 'gray'}
              />
              <StatBadge
                icon={formState.isValid ? CheckCircle : XCircle}
                label="Valid"
                value={String(formState.isValid)}
                color={formState.isValid ? 'green' : 'red'}
              />
              <StatBadge
                icon={Clock}
                label="Submitting"
                value={String(formState.isSubmitting)}
                color={formState.isSubmitting ? 'blue' : 'gray'}
              />
              <StatBadge
                icon={CheckCircle}
                label="Submitted"
                value={String(formState.isSubmitted)}
                color={formState.isSubmitted ? 'green' : 'gray'}
              />
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
              {(['values', 'errors', 'state'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`
                    flex-1 px-4 py-2.5 text-sm font-medium transition-colors
                    ${activeTab === tab
                      ? 'text-zinc-800 border-b-2 border-zinc-800 bg-zinc-800/10'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
                    }
                  `}
                >
                  {tab === 'values' && 'Values'}
                  {tab === 'errors' && `Errors (${Object.keys(formState.errors).length})`}
                  {tab === 'state' && 'State'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar">
              {activeTab === 'values' && (
                <JSONViewer data={values} />
              )}

              {activeTab === 'errors' && (
                Object.keys(formState.errors).length === 0 ? (
                  <EmptyState message="No hay errores" icon={CheckCircle} />
                ) : (
                  <JSONViewer data={formState.errors} />
                )
              )}

              {activeTab === 'state' && (
                <div className="space-y-2">
                  <StateItem label="isDirty" value={formState.isDirty} />
                  <StateItem label="isValid" value={formState.isValid} />
                  <StateItem label="isSubmitting" value={formState.isSubmitting} />
                  <StateItem label="isSubmitted" value={formState.isSubmitted} />
                  <StateItem label="isSubmitSuccessful" value={formState.isSubmitSuccessful} />
                  <StateItem label="submitCount" value={formState.submitCount} />
                  <StateItem label="touchedFields" value={Object.keys(formState.touchedFields).length} />
                  <StateItem label="dirtyFields" value={Object.keys(formState.dirtyFields).length} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================================
// COMPONENTES AUXILIARES
// ============================================================================

/**
 * Badge de estadística
 */
function StatBadge({
  icon: Icon,
  label,
  value,
  color
}: {
  icon: any;
  label: string;
  value: string;
  color: 'green' | 'red' | 'yellow' | 'blue' | 'gray';
}) {
  const colors = {
    green: 'text-zinc-200 bg-zinc-9000/10',
    red: 'text-zinc-200 bg-zinc-9000/10',
    yellow: 'text-zinc-200 bg-zinc-9000/10',
    blue: 'text-zinc-300 bg-zinc-800/10',
    gray: 'text-gray-400 bg-gray-500/10'
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${colors[color]}`}>
      <Icon className="w-4 h-4" />
      <div className="flex-1 min-w-0">
        <div className="text-xs opacity-75">{label}</div>
        <div className="text-sm font-semibold truncate">{value}</div>
      </div>
    </div>
  );
}

/**
 * Visor de JSON
 */
function JSONViewer({ data }: { data: any }) {
  return (
    <pre className="text-xs text-gray-300 bg-black/30 rounded-lg p-3 overflow-x-auto custom-scrollbar">
      <code>{formatJSON(data)}</code>
    </pre>
  );
}

/**
 * Item de estado
 */
function StateItem({ label, value }: { label: string; value: any }) {
  const displayValue = typeof value === 'boolean'
    ? String(value)
    : typeof value === 'number'
    ? value
    : JSON.stringify(value);

  const valueColor = typeof value === 'boolean'
    ? value ? 'text-zinc-200' : 'text-gray-500'
    : 'text-zinc-300';

  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-white/5 transition-colors">
      <span className="text-sm text-gray-400">{label}:</span>
      <span className={`text-sm font-mono ${valueColor}`}>
        {displayValue}
      </span>
    </div>
  );
}

/**
 * Estado vacío
 */
function EmptyState({ message, icon: Icon }: { message: string; icon: any }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
      <Icon className="w-12 h-12 mb-2" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default FormDebugger;
