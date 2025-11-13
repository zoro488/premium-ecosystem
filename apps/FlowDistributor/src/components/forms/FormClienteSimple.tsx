/**
 * 🎯 FORMULARIO CLIENTE SIMPLIFICADO - SOLO NOMBRE
 *
 * Formulario rápido para crear clientes con:
 * - Solo campo de nombre (requerido)
 * - React Hook Form + Zod validation
 * - Diseño Chronos OS con glassmorphism
 * - Integración con Firestore
 * - Animaciones con Framer Motion
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, User, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ChronosButton } from '@/components/chronos-ui/ChronosButton';

// ============================================
// SCHEMA DE VALIDACIÓN
// ============================================
const clienteSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios'),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

// ============================================
// PROPS
// ============================================
interface FormClienteSimpleProps {
  onClose: () => void;
  onSave: (nombre: string) => Promise<void>;
  clienteExistente?: { id: string; nombre: string } | null;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function FormClienteSimple({
  onClose,
  onSave,
  clienteExistente = null,
}: FormClienteSimpleProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nombre: clienteExistente?.nombre || '',
    },
  });

  // Manejar submit
  const onSubmit = async (data: ClienteFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await onSave(data.nombre);
      setSubmitStatus('success');

      // Cerrar después de 1 segundo
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-chronos-void/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-chronos-charcoal border border-chronos-smoke rounded-2xl max-w-md w-full overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-chronos-smoke bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-neon-cyan/20 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-neon-cyan" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-chronos-white">
                  {clienteExistente ? 'Editar Cliente' : 'Nuevo Cliente'}
                </h2>
                <p className="text-chronos-silver text-sm mt-1">
                  Ingresa el nombre del cliente
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="w-10 h-10 rounded-lg bg-chronos-obsidian hover:bg-chronos-graphite border border-chronos-smoke transition-colors flex items-center justify-center disabled:opacity-50"
            >
              <X className="w-5 h-5 text-chronos-silver" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Campo Nombre */}
          <div>
            <label className="block text-chronos-white font-medium mb-2">
              Nombre del Cliente *
            </label>
            <input
              {...register('nombre')}
              type="text"
              placeholder="Ej: Juan Pérez"
              disabled={isSubmitting}
              className={`w-full px-4 py-3 bg-chronos-obsidian border rounded-lg text-chronos-white placeholder-chronos-silver transition-colors
                ${errors.nombre
                  ? 'border-neon-red focus:border-neon-red'
                  : 'border-chronos-smoke focus:border-neon-cyan'
                }
                focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
              `}
              autoFocus
            />
            {errors.nombre && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mt-2 text-neon-red text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.nombre.message}
              </motion.div>
            )}
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-neon-green/10 border border-neon-green/30 rounded-lg flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-neon-green" />
              <div>
                <div className="text-neon-green font-medium">
                  {clienteExistente ? '¡Cliente actualizado!' : '¡Cliente creado!'}
                </div>
                <div className="text-chronos-silver text-sm mt-1">
                  Cerrando...
                </div>
              </div>
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-neon-red/10 border border-neon-red/30 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-neon-red" />
              <div>
                <div className="text-neon-red font-medium">Error al guardar</div>
                <div className="text-chronos-silver text-sm mt-1">
                  Por favor intenta de nuevo
                </div>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <ChronosButton
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancelar
            </ChronosButton>
            <ChronosButton
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-chronos-white/30 border-t-chronos-white rounded-full animate-spin" />
                  Guardando...
                </div>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  {clienteExistente ? 'Actualizar' : 'Crear Cliente'}
                </>
              )}
            </ChronosButton>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
