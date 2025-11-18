/**
 * 🎯 FORMULARIO CLIENTE - TYPESCRIPT + REACT HOOK FORM
 *
 * Formulario completo de gestión de clientes con:
 * - React Hook Form + Zod validation
 * - 4 tipos de cliente (menudeo, mayoreo, distribuidor, corporativo)
 * - Validación RFC mexicano
 * - Gestión de crédito (límite, deuda actual, saldo disponible)
 * - Dirección completa (32 estados mexicanos)
 * - Array de contactos
 * - Componentes premium reutilizables
 */

import { useMemo } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Building2,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  FileText,
  X,
  Plus,
  Trash2,
  DollarSign,
  AlertCircle,
  Tag,
  Users,
} from 'lucide-react';

// Schemas
import {
  clienteSchema,
  clienteDefaultValues,
  type ClienteFormData,
} from '../schemas/cliente.schema';

// Components
import {
  FieldWrapper,
  ErrorMessage,
  LoadingButton,
  FormSection,
  FormDebugger,
} from './forms';

// Types
interface FormClienteProps {
  onClose: () => void;
  onSave: (data: ClienteFormData) => Promise<void> | void;
  clienteExistente?: Partial<ClienteFormData> | null;
  showDebug?: boolean;
}

/**
 * Formulario de Cliente con React Hook Form + Zod
 */
export default function FormCliente({
  onClose,
  onSave,
  clienteExistente = null,
  showDebug = process.env.NODE_ENV === 'development',
}: FormClienteProps) {
  // ============================================================================
  // REACT HOOK FORM SETUP
  // ============================================================================

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful, isDirty },
    reset,
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: clienteExistente || clienteDefaultValues,
    mode: 'onChange',
  });

  // ============================================================================
  // FIELD ARRAY - Contactos dinámicos
  // ============================================================================

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contactos',
  });

  // ============================================================================
  // WATCHERS
  // ============================================================================

  const limiteCredito = watch('limiteCredito');
  const deudaActual = watch('deudaActual');
    if (limiteCredito < 0) {
      newErrors.limiteCredito = 'El límite de crédito no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Crear/actualizar objeto de cliente
      const clienteData = {
        id: isEditMode ? clienteId! : `CLI-${Date.now()}`,
        nombre: nombre.trim(),
        rfc: rfc.trim().toUpperCase() || undefined,
        direccion: direccion.trim() || undefined,
        telefono: telefono.trim() || undefined,
        email: email.trim().toLowerCase() || undefined,
        contacto: contacto.trim() || undefined,
        limiteCredito: limiteCredito || undefined,
        notas: notas.trim() || undefined,
      };

      // Validar con schema de Zod
      clientSchema.parse(clienteData);

      if (isEditMode) {
        await updateCliente(clienteId!, clienteData);
      } else {
        await addCliente(clienteData);
      }

      setSubmitStatus('success');

      // Callback de éxito
      if (onSuccess) {
        onSuccess(clienteData.id);
      }

      // Reset form y cerrar después de 2 segundos
      setTimeout(() => {
        if (!isEditMode) {
          setNombre('');
          setRfc('');
          setDireccion('');
          setTelefono('');
          setEmail('');
          setContacto('');
          setLimiteCredito(0);
          setNotas('');
        }
        setErrors({});
        setSubmitStatus('idle');

        if (onClose) {
          onClose();
        }
      }, 2000);
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      setSubmitStatus('error');

      if (error instanceof z.ZodError) {
        const zodErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            zodErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(zodErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        className="w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {/* HEADER */}
        <div
          className="px-6 py-5 border-b border-white/10 sticky top-0 z-10"
          style={{
            background:
              'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-purple-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">
                {isEditMode ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h2>
              <p className="text-sm text-slate-400">
                {isEditMode
                  ? 'Actualiza la información del cliente'
                  : 'Completa los datos del nuevo cliente'}
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* NOMBRE */}
          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-white">
                Nombre Completo <span className="text-red-400">*</span>
              </span>
            </div>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del cliente"
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder-slate-400 transition-all ${
                errors.nombre
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-white/10 focus:border-purple-500'
              } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
            />
            {errors.nombre && (
              <motion.p
                className="mt-2 text-sm text-red-400 flex items-center gap-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-4 h-4" />
                {errors.nombre}
              </motion.p>
            )}
          </label>

          {/* RFC */}
          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-white">RFC</span>
            </div>
            <input
              type="text"
              value={rfc}
              onChange={(e) => setRfc(e.target.value.toUpperCase())}
              placeholder="ABC123456XYZ (opcional)"
              maxLength={13}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder-slate-400 transition-all uppercase ${
                errors.rfc
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-white/10 focus:border-purple-500'
              } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
            />
            {errors.rfc && (
              <motion.p
                className="mt-2 text-sm text-red-400 flex items-center gap-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-4 h-4" />
                {errors.rfc}
              </motion.p>
            )}
          </label>

          {/* TELÉFONO Y EMAIL */}
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-white">Teléfono</span>
              </div>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="1234567890"
                disabled={isSubmitting}
                className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder-slate-400 transition-all ${
                  errors.telefono
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-white/10 focus:border-purple-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              />
              {errors.telefono && (
                <motion.p
                  className="mt-2 text-sm text-red-400 flex items-center gap-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.telefono}
                </motion.p>
              )}
            </label>

            <label className="block">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-white">Email</span>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cliente@ejemplo.com"
                disabled={isSubmitting}
                className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder-slate-400 transition-all ${
                  errors.email
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-white/10 focus:border-purple-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              />
              {errors.email && (
                <motion.p
                  className="mt-2 text-sm text-red-400 flex items-center gap-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </motion.p>
              )}
            </label>
          </div>

          {/* DIRECCIÓN */}
          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-white">Dirección</span>
            </div>
            <textarea
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Calle, número, colonia, ciudad..."
              rows={2}
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </label>

          {/* CONTACTO Y LÍMITE DE CRÉDITO */}
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-white">Contacto</span>
              </div>
              <input
                type="text"
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
                placeholder="Nombre del contacto"
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </label>

            <label className="block">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-white">Límite de Crédito</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="number"
                  value={limiteCredito || ''}
                  onChange={(e) => setLimiteCredito(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  min="0"
                  step="1000"
                  disabled={isSubmitting}
                  className={`w-full pl-8 pr-4 py-3 rounded-lg bg-white/5 border text-white placeholder-slate-400 transition-all ${
                    errors.limiteCredito
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-white/10 focus:border-purple-500'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                />
              </div>
              {errors.limiteCredito && (
                <motion.p
                  className="mt-2 text-sm text-red-400 flex items-center gap-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.limiteCredito}
                </motion.p>
              )}
            </label>
          </div>

          {/* NOTAS */}
          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-white">Notas</span>
            </div>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Notas adicionales sobre el cliente..."
              rows={3}
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </label>

          {/* BOTONES */}
          <div className="flex gap-3 pt-4 sticky bottom-0 bg-slate-900/95 backdrop-blur-sm -mx-6 -mb-6 px-6 py-4 border-t border-white/10">
            {onClose && (
              <motion.button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 rounded-lg bg-white/5 text-white font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                Cancelar
              </motion.button>
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting || !nombre}
              className="flex-1 px-6 py-3 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background:
                  submitStatus === 'success'
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : submitStatus === 'error'
                      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                      : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              }}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isEditMode ? 'Actualizando...' : 'Guardando...'}
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <Check className="w-5 h-5" />
                    {isEditMode ? '¡Actualizado!' : '¡Creado!'}
                  </>
                ) : submitStatus === 'error' ? (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    Error
                  </>
                ) : (
                  <>{isEditMode ? 'Actualizar Cliente' : 'Crear Cliente'}</>
                )}
              </div>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default FormCliente;
