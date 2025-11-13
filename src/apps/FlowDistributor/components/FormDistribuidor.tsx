/**
 * 🎯 FORMULARIO DISTRIBUIDOR - TYPESCRIPT + REACT HOOK FORM (COMPLETO)
 *
 * Formulario completo de gestión de distribuidores con:
 * - React Hook Form + Zod validation completa
 * - 5 tipos de distribuidor (nacional, internacional, fabricante, mayorista, minorista)
 * - 5 categorías por confiabilidad
 * - 16 países internacionales
 * - Validación CLABE 18 dígitos
 * - Sistema de evaluación (5 métricas)
 * - Gestión de crédito y deuda
 * - Bloqueo con motivo requerido
 * - Componentes premium reutilizables
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    Briefcase,
    Building2,
    CheckCircle2,
    CreditCard,
    DollarSign,
    FileText,
    Globe,
    Hash,
    Lock,
    Mail,
    MapPin,
    Phone,
    Star,
    Tag,
    TrendingUp,
    Truck,
    Unlock,
    X,
    XCircle,
} from 'lucide-react';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

// Schemas
import {
    distribuidorDefaultValues,
    distribuidorSchema,
    type DistribuidorFormData,
} from '../schemas/distribuidor.schema';

// Components
import {
    FieldWrapper,
    FormDebugger,
    FormSection,
    LoadingButton
} from './forms';

// Types
interface FormDistribuidorProps {
  onClose: () => void;
  onSave: (data: DistribuidorFormData) => Promise<void> | void;
  distribuidorExistente?: Partial<DistribuidorFormData> | null;
  showDebug?: boolean;
}

// Países disponibles
const PAISES = [
  'México',
  'Estados Unidos',
  'Canadá',
  'China',
  'Alemania',
  'Japón',
  'Reino Unido',
  'Francia',
  'Italia',
  'España',
  'Brasil',
  'Argentina',
  'Colombia',
  'Chile',
  'Perú',
  'Otro',
] as const;

/**
 * Formulario de Distribuidor Premium con React Hook Form + Zod
 */
export default function FormDistribuidor({
  onClose,
  onSave,
  distribuidorExistente = null,
  showDebug = process.env.NODE_ENV === 'development',
}: FormDistribuidorProps) {
  // ============================================================================
  // REACT HOOK FORM SETUP
  // ============================================================================

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful, isDirty },
    reset,
  } = useForm<DistribuidorFormData>({
    resolver: zodResolver(distribuidorSchema),
    defaultValues: distribuidorExistente || distribuidorDefaultValues,
    mode: 'onChange',
  });

  // ============================================================================
  // WATCHERS
  // ============================================================================

  const limiteCredito = watch('limiteCredito');
  const deudaActual = watch('deudaActual');
  const bloqueado = watch('bloqueado');
  const tipoDistribuidor = watch('tipoDistribuidor');
  const categoria = watch('categoria');
  const activo = watch('activo');

  // ============================================================================
  // CÁLCULOS
  // ============================================================================

  const saldoDisponible = useMemo(() => {
    return (limiteCredito || 0) - (deudaActual || 0);
  }, [limiteCredito, deudaActual]);

  const porcentajeDeuda = useMemo(() => {
    if (!limiteCredito || limiteCredito === 0) return 0;
    return ((deudaActual || 0) / limiteCredito) * 100;
  }, [limiteCredito, deudaActual]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const onSubmit = async (data: DistribuidorFormData) => {
    try {
      await onSave(data);
      setTimeout(() => {
        if (!isSubmitSuccessful) {
          onClose();
        }
      }, 1500);
    } catch (error) {
      console.error('Error al guardar distribuidor:', error);
    }
  };

  const handleReset = () => {
    reset(distribuidorExistente || distribuidorDefaultValues);
  };

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
        className="bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-xl border border-blue-400/30 rounded-2xl shadow-2xl max-w-7xl w-full my-8"
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
            <Truck className="w-7 h-7 text-blue-400" />
            {distribuidorExistente ? 'Editar Distribuidor' : 'Nuevo Distribuidor'}
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
          {/* PANEL DE ESTADO */}
          {/* ========================================================== */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Estado Activo/Inactivo */}
            <div className={`p-4 rounded-xl border ${activo ? 'bg-green-500/10 border-green-400/30' : 'bg-gray-500/10 border-gray-400/30'}`}>
              <div className="flex items-center gap-2 mb-1">
                {activo ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-gray-400" />}
                <span className="text-sm text-white/70">Estado</span>
              </div>
              <p className={`text-lg font-bold ${activo ? 'text-green-300' : 'text-gray-300'}`}>
                {activo ? 'Activo' : 'Inactivo'}
              </p>
            </div>

            {/* Categoría */}
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-400/30">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-white/70">Categoría</span>
              </div>
              <p className="text-lg font-bold text-blue-300 capitalize">
                {categoria || 'Nuevo'}
              </p>
            </div>

            {/* Bloqueado */}
            <div className={`p-4 rounded-xl border ${bloqueado ? 'bg-red-500/10 border-red-400/30' : 'bg-gray-500/10 border-gray-400/30'}`}>
              <div className="flex items-center gap-2 mb-1">
                {bloqueado ? <Lock className="w-5 h-5 text-red-400" /> : <Unlock className="w-5 h-5 text-gray-400" />}
                <span className="text-sm text-white/70">Bloqueo</span>
              </div>
              <p className={`text-lg font-bold ${bloqueado ? 'text-red-300' : 'text-gray-300'}`}>
                {bloqueado ? 'Bloqueado' : 'Desbloqueado'}
              </p>
            </div>
          </div>

          {/* ========================================================== */}
          {/* SECCIÓN 1: INFORMACIÓN BÁSICA */}
          {/* ========================================================== */}
          <FormSection
            title="Información Básica"
            description="Datos generales del distribuidor"
            icon={<Building2 className="w-5 h-5" />}
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
                  label="Nombre del Distribuidor"
                  icon={<Building2 className="w-4 h-4" />}
                  error={errors.nombre}
                  required
                  tooltip="Nombre legal del distribuidor"
                >
                  <input
                    type="text"
                    {...field}
                    placeholder="Distribuidora ABC S.A. de C.V."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* Nombre Comercial */}
            <Controller
              name="nombreComercial"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Nombre Comercial"
                  icon={<Tag className="w-4 h-4" />}
                  error={errors.nombreComercial}
                  tooltip="Nombre comercial o marca"
                >
                  <input
                    type="text"
                    {...field}
                    placeholder="ABC Distribuidora"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* Tipo Distribuidor */}
            <Controller
              name="tipoDistribuidor"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Tipo de Distribuidor"
                  icon={<Briefcase className="w-4 h-4" />}
                  error={errors.tipoDistribuidor}
                  required
                >
                  <select
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  >
                    <option value="nacional" className="bg-slate-900">Nacional</option>
                    <option value="internacional" className="bg-slate-900">Internacional</option>
                    <option value="fabricante" className="bg-slate-900">Fabricante</option>
                    <option value="mayorista" className="bg-slate-900">Mayorista</option>
                    <option value="minorista" className="bg-slate-900">Minorista</option>
                  </select>
                </FieldWrapper>
              )}
            />

            {/* Categoría */}
            <Controller
              name="categoria"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Categoría (Confiabilidad)"
                  icon={<Star className="w-4 h-4" />}
                  error={errors.categoria}
                >
                  <select
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  >
                    <option value="nuevo" className="bg-slate-900">Nuevo</option>
                    <option value="en_evaluacion" className="bg-slate-900">En Evaluación</option>
                    <option value="regular" className="bg-slate-900">Regular</option>
                    <option value="confiable" className="bg-slate-900">Confiable</option>
                    <option value="preferente" className="bg-slate-900">Preferente</option>
                  </select>
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
                    placeholder="contacto@distribuidor.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
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
                  label="Teléfono Principal"
                  icon={<Phone className="w-4 h-4" />}
                  error={errors.telefono}
                >
                  <input
                    type="tel"
                    {...field}
                    placeholder="5512345678"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* Teléfono Adicional */}
            <Controller
              name="telefonoAdicional"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Teléfono Secundario"
                  icon={<Phone className="w-4 h-4" />}
                  error={errors.telefonoAdicional}
                >
                  <input
                    type="tel"
                    {...field}
                    placeholder="5587654321"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* Sitio Web */}
            <Controller
              name="sitioWeb"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="Sitio Web"
                  icon={<Globe className="w-4 h-4" />}
                  error={errors.sitioWeb}
                >
                  <input
                    type="url"
                    {...field}
                    placeholder="https://www.distribuidor.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
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
            description="Ubicación del distribuidor"
            icon={<MapPin className="w-5 h-5" />}
            variant="default"
            columns={2}
          >
            {/* Dirección */}
            <div className="col-span-2">
              <Controller
                name="direccion"
                control={control}
                render={({ field }) => (
                  <FieldWrapper
                    label="Dirección Completa"
                    error={errors.direccion}
                  >
                    <textarea
                      {...field}
                      placeholder="Calle, número, colonia..."
                      rows={2}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all resize-none"
                    />
                  </FieldWrapper>
                )}
              />
            </div>

            {/* Ciudad */}
            <Controller
              name="ciudad"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Ciudad" error={errors.ciudad}>
                  <input
                    type="text"
                    {...field}
                    placeholder="Monterrey"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* Estado */}
            <Controller
              name="estado"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Estado/Provincia" error={errors.estado}>
                  <input
                    type="text"
                    {...field}
                    placeholder="Nuevo León"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* País */}
            <Controller
              name="pais"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="País" error={errors.pais}>
                  <select
                    {...field}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  >
                    {PAISES.map((pais) => (
                      <option key={pais} value={pais} className="bg-slate-900">
                        {pais}
                      </option>
                    ))}
                  </select>
                </FieldWrapper>
              )}
            />

            {/* Código Postal */}
            <Controller
              name="codigoPostal"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Código Postal" error={errors.codigoPostal}>
                  <input
                    type="text"
                    {...field}
                    placeholder="64000"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />
          </FormSection>

          {/* ========================================================== */}
          {/* SECCIÓN 3: INFORMACIÓN FISCAL */}
          {/* ========================================================== */}
          <FormSection
            title="Información Fiscal"
            description="Datos fiscales y tributarios"
            icon={<FileText className="w-5 h-5" />}
            variant="default"
            columns={2}
          >
            {/* RFC / Tax ID */}
            <Controller
              name="rfc"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="RFC / Tax ID"
                  icon={<Hash className="w-4 h-4" />}
                  error={errors.rfc}
                >
                  <input
                    type="text"
                    {...field}
                    placeholder="ABC123456XYZ"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 uppercase focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* Régimen Fiscal */}
            <Controller
              name="regimenFiscal"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Régimen Fiscal" error={errors.regimenFiscal}>
                  <input
                    type="text"
                    {...field}
                    placeholder="Régimen General"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />
          </FormSection>

          {/* ========================================================== */}
          {/* SECCIÓN 4: INFORMACIÓN BANCARIA */}
          {/* ========================================================== */}
          <FormSection
            title="Información Bancaria"
            description="Datos para pagos y transferencias"
            icon={<CreditCard className="w-5 h-5" />}
            variant="default"
            columns={2}
          >
            {/* Nombre Banco */}
            <Controller
              name="nombreBanco"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Nombre del Banco" error={errors.nombreBanco}>
                  <input
                    type="text"
                    {...field}
                    placeholder="BBVA Bancomer"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* Número de Cuenta */}
            <Controller
              name="numeroCuenta"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Número de Cuenta" error={errors.numeroCuenta}>
                  <input
                    type="text"
                    {...field}
                    placeholder="0123456789"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* CLABE */}
            <Controller
              name="clabe"
              control={control}
              render={({ field }) => (
                <FieldWrapper
                  label="CLABE Interbancaria"
                  error={errors.clabe}
                  tooltip="18 dígitos"
                >
                  <input
                    type="text"
                    {...field}
                    placeholder="012345678901234567"
                    maxLength={18}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

            {/* SWIFT */}
            <Controller
              name="swift"
              control={control}
              render={({ field }) => (
                <FieldWrapper label="Código SWIFT/BIC" error={errors.swift}>
                  <input
                    type="text"
                    {...field}
                    placeholder="ABCDMXMM"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 uppercase focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />
          </FormSection>

          {/* ========================================================== */}
          {/* SECCIÓN 5: CRÉDITO Y CONDICIONES DE PAGO */}
          {/* ========================================================== */}
          <FormSection
            title="Crédito y Condiciones de Pago"
            description="Gestión financiera"
            icon={<DollarSign className="w-5 h-5" />}
            variant="default"
            columns={3}
          >
            {/* Días de Crédito */}
            <Controller
              name="diasCredito"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper label="Días de Crédito" error={errors.diasCredito}>
                  <input
                    type="number"
                    {...field}
                    value={value || ''}
                    onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                    placeholder="30"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />

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
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/70">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      value={value || ''}
                      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
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
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/70">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      value={value || ''}
                      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                    />
                  </div>
                </FieldWrapper>
              )}
            />

            {/* Panel de Crédito Disponible */}
            <div className="col-span-3 grid grid-cols-2 gap-4">
              {/* Saldo Disponible */}
              <div className={`p-4 rounded-xl border ${saldoDisponible >= 0 ? 'bg-green-500/10 border-green-400/30' : 'bg-red-500/10 border-red-400/30'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className={`w-5 h-5 ${saldoDisponible >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                  <span className="text-sm text-white/70">Saldo Disponible</span>
                </div>
                <p className={`text-2xl font-bold ${saldoDisponible >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  ${saldoDisponible.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* Porcentaje de Deuda */}
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-400/30">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-white/70">Uso de Crédito</span>
                </div>
                <p className="text-2xl font-bold text-blue-300">
                  {porcentajeDeuda.toFixed(1)}%
                </p>
                <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      porcentajeDeuda > 90
                        ? 'bg-red-500'
                        : porcentajeDeuda > 70
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(porcentajeDeuda, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Condiciones de Pago */}
            <div className="col-span-3">
              <Controller
                name="condicionesPago"
                control={control}
                render={({ field }) => (
                  <FieldWrapper label="Condiciones de Pago" error={errors.condicionesPago}>
                    <textarea
                      {...field}
                      placeholder="50% anticipo, 50% contra entrega..."
                      rows={2}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all resize-none"
                    />
                  </FieldWrapper>
                )}
              />
            </div>
          </FormSection>

          {/* ========================================================== */}
          {/* SECCIÓN 6: EVALUACIÓN */}
          {/* ========================================================== */}
          <FormSection
            title="Evaluación del Distribuidor"
            description="Métricas de desempeño"
            icon={<Star className="w-5 h-5" />}
            variant="default"
            columns={2}
          >
            {/* Calificación */}
            <Controller
              name="calificacion"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper
                  label="Calificación General"
                  icon={<Star className="w-4 h-4" />}
                  error={errors.calificacion}
                  tooltip="Escala 1-5"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      {...field}
                      value={value || ''}
                      onChange={(e) => onChange(parseFloat(e.target.value) || undefined)}
                      placeholder="1-5"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                    />
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            (value || 0) >= star
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </FieldWrapper>
              )}
            />

            {/* Tiempo Entrega Promedio */}
            <Controller
              name="tiempoEntregaPromedio"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FieldWrapper
                  label="Tiempo de Entrega Promedio (días)"
                  icon={<Truck className="w-4 h-4" />}
                  error={errors.tiempoEntregaPromedio}
                >
                  <input
                    type="number"
                    min="0"
                    {...field}
                    value={value || ''}
                    onChange={(e) => onChange(parseInt(e.target.value) || undefined)}
                    placeholder="7"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  />
                </FieldWrapper>
              )}
            />
          </FormSection>

          {/* ========================================================== */}
          {/* SECCIÓN 7: ESTADO Y CONTROL */}
          {/* ========================================================== */}
          <FormSection
            title="Estado y Control"
            description="Gestión del distribuidor"
            icon={<Lock className="w-5 h-5" />}
            variant="default"
            columns={1}
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Activo */}
              <Controller
                name="activo"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                    <input
                      type="checkbox"
                      checked={value || false}
                      onChange={(e) => onChange(e.target.checked)}
                      {...field}
                      className="w-5 h-5 rounded border-white/20 text-green-500 focus:ring-2 focus:ring-green-400/50"
                    />
                    <div>
                      <p className="text-white font-medium">Distribuidor Activo</p>
                      <p className="text-sm text-white/60">Permitir operaciones con este distribuidor</p>
                    </div>
                  </label>
                )}
              />

              {/* Bloqueado */}
              <Controller
                name="bloqueado"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                    <input
                      type="checkbox"
                      checked={value || false}
                      onChange={(e) => onChange(e.target.checked)}
                      {...field}
                      className="w-5 h-5 rounded border-white/20 text-red-500 focus:ring-2 focus:ring-red-400/50"
                    />
                    <div>
                      <p className="text-white font-medium">Bloqueado</p>
                      <p className="text-sm text-white/60">Bloquear todas las operaciones</p>
                    </div>
                  </label>
                )}
              />
            </div>

            {/* Motivo Bloqueo (solo si está bloqueado) */}
            {bloqueado && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Controller
                  name="motivoBloqueo"
                  control={control}
                  render={({ field }) => (
                    <FieldWrapper
                      label="Motivo del Bloqueo"
                      icon={<AlertTriangle className="w-4 h-4" />}
                      error={errors.motivoBloqueo}
                      required
                    >
                      <textarea
                        {...field}
                        placeholder="Explique el motivo del bloqueo..."
                        rows={3}
                        className="w-full px-4 py-3 bg-red-500/10 border border-red-400/30 rounded-xl text-white placeholder-red-300/50 focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400/50 transition-all resize-none"
                      />
                    </FieldWrapper>
                  )}
                />
              </motion.div>
            )}
          </FormSection>

          {/* ========================================================== */}
          {/* SECCIÓN 8: NOTAS */}
          {/* ========================================================== */}
          <FormSection
            title="Notas Adicionales"
            description="Información complementaria"
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
                  maxLength={2000}
                  showCounter
                >
                  <textarea
                    {...field}
                    placeholder="Notas, observaciones, historial..."
                    rows={4}
                    maxLength={2000}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all resize-none"
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
              {distribuidorExistente ? 'Actualizar Distribuidor' : 'Guardar Distribuidor'}
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
