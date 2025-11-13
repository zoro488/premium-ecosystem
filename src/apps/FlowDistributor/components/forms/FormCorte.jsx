// 📊 FORM CORTE
// Formulario para ejecutar un corte manual y configurar cortes automáticos
import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Scissors,
  Settings,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

import { useBancos } from '../../hooks/useBancos';
import { useCortes } from '../../hooks/useCortes';
import { formatCurrency, formatFrequency } from '../../utils/formatters';
import { validateConfigCortes } from '../../utils/validators';

export const FormCorte = ({ bovedaId, bovedaNombre, onSuccess, onCancel }) => {
  const { boveda, obtenerEstadisticas } = useBancos(bovedaId);
  const { ejecutarCorte, configuracion, actualizarConfiguracion, loading } = useCortes(
    'boveda',
    bovedaId
  );

  const [modo, setModo] = useState('MANUAL'); // 'MANUAL' o 'CONFIG'
  const [formData, setFormData] = useState({
    observaciones: '',
    tipo: 'MANUAL',
  });

  const [configData, setConfigData] = useState({
    frecuencia: configuracion?.frecuencia || 'MENSUAL',
    diaEjecucion: configuracion?.diaEjecucion || 1,
    horaEjecucion: configuracion?.horaEjecucion || '23:59',
    automatico: configuracion?.automatico || false,
    notificarAntes: configuracion?.notificarAntes || 24,
    activo: configuracion?.activo !== false,
  });

  const [errors, setErrors] = useState({});

  const frecuencias = [
    { value: 'DIARIO', label: 'Diario' },
    { value: 'SEMANAL', label: 'Semanal' },
    { value: 'QUINCENAL', label: 'Quincenal' },
    { value: 'MENSUAL', label: 'Mensual' },
    { value: 'TRIMESTRAL', label: 'Trimestral' },
    { value: 'ANUAL', label: 'Anual' },
    { value: 'MANUAL', label: 'Solo Manual' },
  ];

  const stats = obtenerEstadisticas(bovedaId);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConfigChange = (field, value) => {
    setConfigData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleEjecutarCorte = async (e) => {
    e.preventDefault();

    const result = await ejecutarCorte({
      ...formData,
      bovedaId,
    });

    if (result.success) {
      onSuccess?.(result.data);
    } else {
      setErrors({ submit: result.error });
    }
  };

  const handleGuardarConfiguracion = async (e) => {
    e.preventDefault();

    // Validar
    const validation = validateConfigCortes(configData);

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const result = await actualizarConfiguracion(configData);

    if (result.success) {
      onSuccess?.({ tipo: 'configuracion', data: result.data });
    } else {
      setErrors({ submit: result.error });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="backdrop-blur-xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-white/10 rounded-2xl p-6 max-w-3xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/20">
            <Scissors className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white font-display">Corte de Bóveda</h2>
            <p className="text-white/60 text-sm">{bovedaNombre || 'Bóveda'}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setModo('MANUAL')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              modo === 'MANUAL' ? 'bg-primary/20 text-primary' : 'text-white/60 hover:text-white'
            }`}
          >
            <Scissors className="w-4 h-4 inline mr-2" />
            Corte Manual
          </button>
          <button
            onClick={() => setModo('CONFIG')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              modo === 'CONFIG' ? 'bg-primary/20 text-primary' : 'text-white/60 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Configuración
          </button>
        </div>
      </div>

      {/* Estadísticas actuales */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 gap-3 mb-6"
        >
          <div className="backdrop-blur-md bg-success/10 border border-success/20 rounded-lg p-3">
            <p className="text-white/60 text-xs">Ingresos</p>
            <p className="text-success text-lg font-bold">+{formatCurrency(stats.totalIngresos)}</p>
          </div>
          <div className="backdrop-blur-md bg-error/10 border border-error/20 rounded-lg p-3">
            <p className="text-white/60 text-xs">Gastos</p>
            <p className="text-error text-lg font-bold">-{formatCurrency(stats.totalGastos)}</p>
          </div>
          <div className="backdrop-blur-md bg-primary/10 border border-primary/20 rounded-lg p-3">
            <p className="text-white/60 text-xs">Transferencias</p>
            <p className="text-primary text-lg font-bold">
              {formatCurrency(stats.totalTransferenciasEntrada - stats.totalTransferenciasSalida)}
            </p>
          </div>
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-3">
            <p className="text-white/60 text-xs">Saldo Actual</p>
            <p className="text-white text-lg font-bold">{formatCurrency(stats.saldo)}</p>
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {modo === 'MANUAL' ? (
          <motion.form
            key="manual"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleEjecutarCorte}
            className="space-y-6"
          >
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-white text-sm mb-2">
                Se ejecutará un corte manual con los movimientos actuales.
              </p>
              <p className="text-white/60 text-xs">
                El RF Actual se calculará automáticamente basado en ingresos, gastos y
                transferencias.
              </p>
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Observaciones (Opcional)
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => handleChange('observaciones', e.target.value)}
                placeholder="Notas sobre este corte..."
                rows={3}
                className="w-full backdrop-blur-md bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>

            {/* Error */}
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-error/10 border border-error/20"
              >
                <p className="text-error text-sm flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {errors.submit}
                </p>
              </motion.div>
            )}

            {/* Botones */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 border border-primary/30 rounded-lg text-white font-medium shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Ejecutando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Ejecutar Corte
                  </>
                )}
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.form
            key="config"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleGuardarConfiguracion}
            className="space-y-6"
          >
            {/* Activar/Desactivar cortes automáticos */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Cortes Automáticos</p>
                  <p className="text-white/60 text-sm">
                    Ejecutar cortes de forma automática según frecuencia
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleConfigChange('automatico', !configData.automatico)}
                  className="relative"
                >
                  {configData.automatico ? (
                    <ToggleRight className="w-12 h-12 text-success" />
                  ) : (
                    <ToggleLeft className="w-12 h-12 text-white/40" />
                  )}
                </button>
              </div>
            </div>

            {/* Frecuencia */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Frecuencia
              </label>
              <select
                value={configData.frecuencia}
                onChange={(e) => handleConfigChange('frecuencia', e.target.value)}
                className={`
                  w-full backdrop-blur-md bg-white/5
                  border ${errors.frecuencia ? 'border-error/50' : 'border-white/10'}
                  rounded-lg px-4 py-3 text-white
                  focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                  transition-all
                `}
              >
                {frecuencias.map((freq) => (
                  <option key={freq.value} value={freq.value} className="bg-gray-900">
                    {freq.label}
                  </option>
                ))}
              </select>
              {errors.frecuencia && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-error mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.frecuencia}
                </motion.p>
              )}
            </div>

            {/* Día de ejecución (si no es diario) */}
            {configData.frecuencia !== 'DIARIO' && configData.frecuencia !== 'MANUAL' && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Día de Ejecución
                </label>
                <input
                  type="number"
                  min="1"
                  max={
                    configData.frecuencia === 'MENSUAL'
                      ? 28
                      : configData.frecuencia === 'SEMANAL'
                        ? 7
                        : 365
                  }
                  value={configData.diaEjecucion}
                  onChange={(e) => handleConfigChange('diaEjecucion', parseInt(e.target.value))}
                  className={`
                    w-full backdrop-blur-md bg-white/5
                    border ${errors.diaEjecucion ? 'border-error/50' : 'border-white/10'}
                    rounded-lg px-4 py-3 text-white
                    focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                    transition-all
                  `}
                />
                {errors.diaEjecucion && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-error mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.diaEjecucion}
                  </motion.p>
                )}
              </div>
            )}

            {/* Hora de ejecución */}
            {configData.automatico && configData.frecuencia !== 'MANUAL' && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Hora de Ejecución
                </label>
                <input
                  type="time"
                  value={configData.horaEjecucion}
                  onChange={(e) => handleConfigChange('horaEjecucion', e.target.value)}
                  className={`
                    w-full backdrop-blur-md bg-white/5
                    border ${errors.horaEjecucion ? 'border-error/50' : 'border-white/10'}
                    rounded-lg px-4 py-3 text-white
                    focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                    transition-all
                  `}
                />
                {errors.horaEjecucion && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-error mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.horaEjecucion}
                  </motion.p>
                )}
              </div>
            )}

            {/* Notificación */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Notificar Antes (horas)
              </label>
              <input
                type="number"
                min="0"
                max="168"
                value={configData.notificarAntes}
                onChange={(e) => handleConfigChange('notificarAntes', parseInt(e.target.value))}
                className="w-full backdrop-blur-md bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <p className="text-white/40 text-xs mt-1">
                Recibirás una notificación antes de que se ejecute el corte automático
              </p>
            </div>

            {/* Error */}
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-error/10 border border-error/20"
              >
                <p className="text-error text-sm flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {errors.submit}
                </p>
              </motion.div>
            )}

            {/* Botones */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 border border-primary/30 rounded-lg text-white font-medium shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Guardar Configuración
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FormCorte;
