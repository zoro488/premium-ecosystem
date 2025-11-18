/**
 * 🎯 FORMULARIO CLIENTE - TYPESCRIPT + REACT HOOK FORM (COMPLETO)
 *
 * Formulario completo de gestión de clientes con:
 * - React Hook Form + Zod validation completa
 * - 4 tipos de cliente (menudeo, mayoreo, distribuidor, corporativo)
 * - Validación RFC mexicano regex
 * - Gestión de crédito con validaciones
 * - Dirección completa con 32 estados
 * - Array dinámico de contactos
 * - Componentes premium reutilizables
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Building2,
    CreditCard,
    DollarSign,
    FileText,
    Home,
    IdCard,
    Mail,
    MapPin,
    Phone,
    Plus,
    Tag,
    Trash2,
    User,
    Users,
    X,
} from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

// Schemas
import {
    clienteDefaultValues,
    clienteSchema,
    type ClienteFormData,
} from '../schemas/cliente.schema';

// Components
import {
    FieldWrapper,
    FormDebugger,
    FormSection,
    LoadingButton
} from './forms';

// Types
interface FormClienteProps {
  onClose: () => void;
  onSave: (data: ClienteFormData) => Promise<void> | void;
  clienteExistente?: Partial<ClienteFormData> | null;
  showDebug?: boolean;
}

/**
 * Formulario de Cliente Premium con React Hook Form + Zod
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
  const tipoCliente = watch('tipoCliente');

  // ============================================================================
  // CÁLCULOS
  // ============================================================================

  const saldoDisponible = useMemo(() => {
    return (limiteCredito || 0) - (deudaActual || 0);
  }, [limiteCredito, deudaActual]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const onSubmit = async (data: ClienteFormData) => {
    try {
      await onSave(data);
      setTimeout(() => {
        if (!isSubmitSuccessful) {
          onClose();
        }
      }, 1500);
    } catch (error) {
      console.error('Error al guardar cliente:', error);
    }
  };

  const handleReset = () => {
    reset(clienteExistente || clienteDefaultValues);
  };

  const handleAddContacto = useCallback(() => {
    append({
      nombre: '',
      cargo: '',
      telefono: '',
      email: '',
      esPrincipal: false,
    });
  }, [append]);

  const handleRemoveContacto = useCallback(
    (index: number) => {
      if (fields.length > 1) {
        remove(index);
      }
    },
    [remove, fields.length]
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-gradient-to-br from-slate-900/95 to-zinc-800/95 backdrop-blur-xl border border-zinc-800/30 rounded-2xl shadow-2xl max-w-6xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ============================================================ */}
        {/* HEADER */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <motion.h2
            className="text-2xl font-bold text-white flex items-center gap-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Users className="w-7 h-7 text-zinc-800" />
            {clienteExistente ? 'Editar Cliente' : 'Nuevo Cliente'}
          </motion.h2>

          <motion.button
            type="button"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
            aria-label="Cerrar formulario"
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        {/* ============================================================ */}
        {/* FORM */}
        {/* ============================================================ */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* ========================================================== */}
          {/* SECCIÓN 1: INFORMACIÓN BÁSICA */}
          {/* ========================================================== */}
          <FormSection
            title="Información Básica"
            description="Datos generales del cliente"
            icon={<User className="w-5 h-5" />}
            variant="default"
            columns={2}
            isRequired
          >
            {/* Nombre */}
            <Controller
              name="nombre"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Nombre Completo"
                  icon={<User className="w-4 h-4" />}
                  error={errors.nombre}
                  required
                  tooltip="Nombre completo del cliente"
                >
                  <input
                    type="text"
                    {...field}
                    placeholder="Juan Pérez García"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* Tipo Cliente */}
            <Controller
              name="tipoCliente"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Tipo de Cliente"
                  icon={<Tag className="w-4 h-4" />}
                  error={errors.tipoCliente}
                  required
                >
                  <select
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                  >
                    <option value="menudeo" className="bg-slate-900">
                      Menudeo
                    </option>
                    <option value="mayoreo" className="bg-slate-900">
                      Mayoreo
                    </option>
                    <option value="distribuidor" className="bg-slate-900">
                      Distribuidor
                    </option>
                    <option value="corporativo" className="bg-slate-900">
                      Corporativo
                    </option>
                  </select>
                </FieldWrapper>
              )}
            />

            {/* RFC */}
            <Controller
              name="rfc"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="RFC"
                  icon={<IdCard className="w-4 h-4" />}
                  error={errors.rfc}
                  tooltip="RFC mexicano (12-13 caracteres)"
                >
                  <input
                    type="text"
                    {...field}
                    placeholder="ABC123456XYZ"
                    maxLength={13}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-zinc-800/50 uppercase focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* Razón Social */}
            <Controller
              name="razonSocial"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Razón Social"
                  icon={<Building2 className="w-4 h-4" />}
                  error={errors.razonSocial}
                  tooltip="Razón social de la empresa (opcional)"
                >
                  <input
                    type="text"
                    {...field}
                    placeholder="Empresa S.A. de C.V."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* Teléfono */}
            <Controller
              name="telefono"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Teléfono"
                  icon={<Phone className="w-4 h-4" />}
                  error={errors.telefono}
                  required
                >
                  <input
                    type="tel"
                    {...field}
                    placeholder="5512345678"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* Email */}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Email"
                  icon={<Mail className="w-4 h-4" />}
                  error={errors.email}
                >
                  <input
                    type="email"
                    {...field}
                    placeholder="cliente@example.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />
          </FormSection>

          {/* ========================================================== */}
          {/* SECCIÓN 2: DIRECCIÓN */}
          {/* ========================================================== */}
          <FormSection
            title="Dirección"
            description="Ubicación del cliente"
            icon={<MapPin className="w-5 h-5" />}
            variant="default"
            columns={2}
          >
            {/* Calle */}
            <Controller
              name="direccion.calle"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Calle y Número"
                  icon={<Home className="w-4 h-4" />}
                  error={errors.direccion?.calle}
                  required
                >
                  <input
                    type="text"
                    {...field}
                    placeholder="Av. Reforma 123"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* Colonia */}
            <Controller
              name="direccion.colonia"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Colonia" error={errors.direccion?.colonia} required>
                  <input
                    type="text"
                    {...field}
                    placeholder="Centro"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* Ciudad */}
            <Controller
              name="direccion.ciudad"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Ciudad" error={errors.direccion?.ciudad} required>
                  <input
                    type="text"
                    {...field}
                    placeholder="Monterrey"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* Estado */}
            <Controller
              name="direccion.estado"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Estado" error={errors.direccion?.estado} required>
                  <select
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                  >
                    <option value="" className="bg-slate-900">
                      Seleccionar estado...
                    </option>
                    <option value="Aguascalientes" className="bg-slate-900">Aguascalientes</option>
                    <option value="Baja California" className="bg-slate-900">Baja California</option>
                    <option value="Baja California Sur" className="bg-slate-900">Baja California Sur</option>
                    <option value="Campeche" className="bg-slate-900">Campeche</option>
                    <option value="Chiapas" className="bg-slate-900">Chiapas</option>
                    <option value="Chihuahua" className="bg-slate-900">Chihuahua</option>
                    <option value="Ciudad de México" className="bg-slate-900">Ciudad de México</option>
                    <option value="Coahuila" className="bg-slate-900">Coahuila</option>
                    <option value="Colima" className="bg-slate-900">Colima</option>
                    <option value="Durango" className="bg-slate-900">Durango</option>
                    <option value="Guanajuato" className="bg-slate-900">Guanajuato</option>
                    <option value="Guerrero" className="bg-slate-900">Guerrero</option>
                    <option value="Hidalgo" className="bg-slate-900">Hidalgo</option>
                    <option value="Jalisco" className="bg-slate-900">Jalisco</option>
                    <option value="México" className="bg-slate-900">México</option>
                    <option value="Michoacán" className="bg-slate-900">Michoacán</option>
                    <option value="Morelos" className="bg-slate-900">Morelos</option>
                    <option value="Nayarit" className="bg-slate-900">Nayarit</option>
                    <option value="Nuevo León" className="bg-slate-900">Nuevo León</option>
                    <option value="Oaxaca" className="bg-slate-900">Oaxaca</option>
                    <option value="Puebla" className="bg-slate-900">Puebla</option>
                    <option value="Querétaro" className="bg-slate-900">Querétaro</option>
                    <option value="Quintana Roo" className="bg-slate-900">Quintana Roo</option>
                    <option value="San Luis Potosí" className="bg-slate-900">San Luis Potosí</option>
                    <option value="Sinaloa" className="bg-slate-900">Sinaloa</option>
                    <option value="Sonora" className="bg-slate-900">Sonora</option>
                    <option value="Tabasco" className="bg-slate-900">Tabasco</option>
                    <option value="Tamaulipas" className="bg-slate-900">Tamaulipas</option>
                    <option value="Tlaxcala" className="bg-slate-900">Tlaxcala</option>
                    <option value="Veracruz" className="bg-slate-900">Veracruz</option>
                    <option value="Yucatán" className="bg-slate-900">Yucatán</option>
                    <option value="Zacatecas" className="bg-slate-900">Zacatecas</option>
                  </select>
                </FieldWrapper>
              )}
            />

            {/* Código Postal */}
            <Controller
              name="direccion.codigoPostal"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Código Postal" error={errors.direccion?.codigoPostal} required>
                  <input
                    type="text"
                    {...field}
                    placeholder="64000"
                    maxLength={5}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* País */}
            <Controller
              name="direccion.pais"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="País" error={errors.direccion?.pais}>
                  <input
                    type="text"
                    {...field}
                    placeholder="México"
                    readOnly
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/70 cursor-not-allowed"
                  />
                </FieldWrapper>
              )}
            />
          </FormSection>

          {/* ========================================================== */}
          {/* SECCIÓN 3: CRÉDITO */}
          {/* ========================================================== */}
          <FormSection
            title="Gestión de Crédito"
            description="Límites y deudas"
            icon={<CreditCard className="w-5 h-5" />}
            variant="default"
            columns={3}
          >
            {/* Límite de Crédito */}
            <Controller
              name="limiteCredito"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper
                  label="Límite de Crédito"
                  icon={<DollarSign className="w-4 h-4" />}
                  error={errors.limiteCredito}
                >
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-800/70">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      value={value || ''}
                      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                    />
                  </div>
                </FieldWrapper>
              )}
            />

            {/* Deuda Actual */}
            <Controller
              name="deudaActual"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper
                  label="Deuda Actual"
                  icon={<DollarSign className="w-4 h-4" />}
                  error={errors.deudaActual}
                >
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-800/70">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      value={value || ''}
                      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all"
                    />
                  </div>
                </FieldWrapper>
              )}
            />

            {/* Saldo Disponible (readonly) */}
            <FieldWrapper label="Saldo Disponible" tooltip="Límite - Deuda Actual">
              <div className={`px-4 py-3 rounded-xl border ${saldoDisponible >= 0 ? 'bg-zinc-9000/10 border-green-400/30' : 'bg-zinc-9000/10 border-red-400/30'}`}>
                <p className={`text-xl font-bold ${saldoDisponible >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  ${saldoDisponible.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </FieldWrapper>
          </FormSection>

          {/* ========================================================== */}
          {/* SECCIÓN 4: CONTACTOS (Dynamic Field Array) */}
          {/* ========================================================== */}
          <FormSection
            title="Contactos"
            description={`${fields.length} contacto(s) registrado(s)`}
            icon={<Users className="w-5 h-5" />}
            variant="default"
            columns={1}
          >
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Contacto #{index + 1}
                      </h4>

                      {fields.length > 1 && (
                        <motion.button
                          type="button"
                          onClick={() => handleRemoveContacto(index)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-zinc-200 hover:text-red-300 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Nombre Contacto */}
                      <Controller
                        name={`contactos.${index}.nombre`}
                        control={control}
                        render={({ field }) => (
                          <FieldWrapper label="Nombre" error={errors.contactos?.[index]?.nombre} required>
                            <input
                              type="text"
                              {...field}
                              placeholder="Nombre del contacto"
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 transition-all text-sm"
                            />
                          </FieldWrapper>
                        )}
                      />

                      {/* Cargo */}
                      <Controller
                        name={`contactos.${index}.cargo`}
                        control={control}
                        render={({ field }) => (
                          <FieldWrapper label="Cargo" error={errors.contactos?.[index]?.cargo}>
                            <input
                              type="text"
                              {...field}
                              placeholder="Gerente de Compras"
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 transition-all text-sm"
                            />
                          </FieldWrapper>
                        )}
                      />

                      {/* Teléfono Contacto */}
                      <Controller
                        name={`contactos.${index}.telefono`}
                        control={control}
                        render={({ field }) => (
                          <FieldWrapper label="Teléfono" error={errors.contactos?.[index]?.telefono}>
                            <input
                              type="tel"
                              {...field}
                              placeholder="5512345678"
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 transition-all text-sm"
                            />
                          </FieldWrapper>
                        )}
                      />

                      {/* Email Contacto */}
                      <Controller
                        name={`contactos.${index}.email`}
                        control={control}
                        render={({ field }) => (
                          <FieldWrapper label="Email" error={errors.contactos?.[index]?.email}>
                            <input
                              type="email"
                              {...field}
                              placeholder="contacto@example.com"
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 transition-all text-sm"
                            />
                          </FieldWrapper>
                        )}
                      />
                    </div>

                    {/* Es Principal */}
                    <div className="mt-3">
                      <Controller
                        name={`contactos.${index}.esPrincipal`}
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value || false}
                              onChange={(e) => onChange(e.target.checked)}
                              {...field}
                              className="w-4 h-4 rounded border-white/20 text-zinc-800 focus:ring-2 focus:ring-zinc-800/50"
                            />
                            <span className="text-sm text-white">Contacto Principal</span>
                          </label>
                        )}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Botón Agregar Contacto */}
              <motion.button
                type="button"
                onClick={handleAddContacto}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 bg-zinc-800/20 border border-zinc-800/30 rounded-xl text-zinc-800 hover:bg-zinc-800/30 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                Agregar Contacto
              </motion.button>
            </div>
          </FormSection>

          {/* ========================================================== */}
          {/* SECCIÓN 5: NOTAS */}
          {/* ========================================================== */}
          <FormSection
            title="Notas Adicionales"
            description="Información adicional del cliente"
            icon={<FileText className="w-5 h-5" />}
            variant="default"
            columns={1}
          >
            <Controller
              name="notas"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Notas"
                  error={errors.notas}
                  maxLength={1000}
                  showCounter
                >
                  <textarea
                    {...field}
                    placeholder="Notas u observaciones sobre el cliente..."
                    rows={4}
                    maxLength={1000}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-zinc-800/50 focus:border-zinc-800/50 transition-all resize-none"
                  />
                </FieldWrapper>
              )}
            />
          </FormSection>

          {/* ========================================================== */}
          {/* BOTONES DE ACCIÓN */}
          {/* ========================================================== */}
          <motion.div
            className="flex gap-4 pt-4 border-t border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <LoadingButton
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              isSuccess={isSubmitSuccessful}
              loadingText="Guardando..."
              successText="¡Guardado!"
              className="flex-1"
            >
              {clienteExistente ? 'Actualizar Cliente' : 'Guardar Cliente'}
            </LoadingButton>

            {isDirty && (
              <LoadingButton type="button" variant="secondary" size="lg" onClick={handleReset}>
                Resetear
              </LoadingButton>
            )}

            <LoadingButton type="button" variant="ghost" size="lg" onClick={onClose}>
              Cancelar
            </LoadingButton>
          </motion.div>

          {/* FORM DEBUGGER */}
          {showDebug && <FormDebugger />}
        </form>
      </motion.div>
    </motion.div>
  );
}
