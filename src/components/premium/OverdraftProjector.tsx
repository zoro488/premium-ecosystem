import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingDown,
  AlertCircle,
  Zap,
  Calendar,
  DollarSign,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';

interface OverdraftProjectorProps {
  saldoActualMXN: number;
  gastosPromedioMensuales?: number;
  ingresosPromedioMensuales?: number;
}

export const OverdraftProjector: React.FC<OverdraftProjectorProps> = ({
  saldoActualMXN,
  gastosPromedioMensuales = 50000,
  ingresosPromedioMensuales = 35000,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<'noAction' | 'transferToday' | 'transfer3d'>('noAction');

  // Generar proyecciones para 30 días
  const proyecciones = useMemo(() => {
    const dias = 30;
    const gastosDiarios = gastosPromedioMensuales / 30;
    const ingresosDiarios = ingresosPromedioMensuales / 30;
    const flujoNetoDiario = ingresosDiarios - gastosDiarios;

    const data = [];

    for (let dia = 0; dia <= dias; dia++) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() + dia);

      // Escenario 1: No hacer nada
      const saldoNoAction = saldoActualMXN + (flujoNetoDiario * dia);

      // Escenario 2: Transferir hoy $10,000 USD (aproximadamente $180,000 MXN al TC 18.0)
      const transferenciaMXN = 180000;
      const saldoTransferToday = (saldoActualMXN + transferenciaMXN) + (flujoNetoDiario * dia);

      // Escenario 3: Transferir en 3 días
      const saldoTransfer3d = dia < 3
        ? saldoActualMXN + (flujoNetoDiario * dia)
        : (saldoActualMXN + transferenciaMXN) + (flujoNetoDiario * dia);

      data.push({
        dia,
        fecha: fecha.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }),
        fechaCompleta: fecha.toLocaleDateString('es-MX'),
        noAction: Math.round(saldoNoAction),
        transferToday: Math.round(saldoTransferToday),
        transfer3d: Math.round(saldoTransfer3d),
      });
    }

    return data;
  }, [saldoActualMXN, gastosPromedioMensuales, ingresosPromedioMensuales]);

  // Calcular urgencia (0-100)
  const urgencyScore = Math.min(100, Math.abs(saldoActualMXN) / 1000);

  // Datos para comparación de escenarios
  const scenarios = [
    {
      id: 'noAction',
      label: 'Sin Acción',
      description: 'Mantener situación actual',
      color: 'rose',
      icon: AlertCircle,
      resultado7d: proyecciones[7].noAction,
      resultado14d: proyecciones[14].noAction,
      resultado30d: proyecciones[30].noAction,
      riesgo: 'Alto',
    },
    {
      id: 'transferToday',
      label: 'Transferir Hoy',
      description: '$10,000 USD inmediatamente',
      color: 'emerald',
      icon: Zap,
      resultado7d: proyecciones[7].transferToday,
      resultado14d: proyecciones[14].transferToday,
      resultado30d: proyecciones[30].transferToday,
      riesgo: 'Bajo',
    },
    {
      id: 'transfer3d',
      label: 'Transferir en 3 Días',
      description: 'Esperar 72 horas',
      color: 'amber',
      icon: Calendar,
      resultado7d: proyecciones[7].transfer3d,
      resultado14d: proyecciones[14].transfer3d,
      resultado30d: proyecciones[30].transfer3d,
      riesgo: 'Medio',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-rose-500/10 to-red-600/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 bg-gradient-to-br from-rose-500 to-red-600 rounded-full p-2.5 flex items-center justify-center"
          >
            <TrendingDown className="text-white w-6 h-6" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Proyector de Sobregiro
            </h3>
            <p className="text-white/60 text-sm">
              Análisis de escenarios a 30 días
            </p>
          </div>
        </div>

        {/* Urgency Meter */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-white/60 text-xs mb-1">Nivel de Urgencia</p>
            <div className="flex items-center gap-2">
              <div className="w-32 h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${urgencyScore}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full ${
                    urgencyScore > 80
                      ? 'bg-gradient-to-r from-rose-500 to-red-600'
                      : urgencyScore > 50
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600'
                      : 'bg-gradient-to-r from-emerald-500 to-green-600'
                  }`}
                />
              </div>
              <span className="text-white font-bold text-lg">
                {Math.round(urgencyScore)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico principal */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={proyecciones}>
            <defs>
              <linearGradient id="noAction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#dc2626" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="transferToday" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#059669" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="transfer3d" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#d97706" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis
              dataKey="fecha"
              stroke="#ffffff60"
              tick={{ fill: '#ffffff80', fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              stroke="#ffffff60"
              tick={{ fill: '#ffffff80', fontSize: 12 }}
              tickLine={false}
              tickFormatter={value => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip
              content={({ payload, label }) => {
                if (!payload?.[0]) return null;
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-black/90 border border-white/20 rounded-xl p-4 backdrop-blur-xl"
                  >
                    <p className="text-white font-bold mb-2">{label}</p>
                    {payload.map((entry, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-4 mb-1">
                        <span className="text-white/60 text-sm">{entry.name}:</span>
                        <span
                          className={`text-sm font-bold font-mono ${
                            (entry.value as number) < 0 ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          ${(entry.value as number).toLocaleString()} MXN
                        </span>
                      </div>
                    ))}
                  </motion.div>
                );
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              content={({ payload }) => (
                <div className="flex items-center justify-center gap-6">
                  {payload?.map((entry, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedScenario(entry.dataKey as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${
                        selectedScenario === entry.dataKey
                          ? 'bg-white/20 border border-white/30'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-white text-sm font-medium">
                        {entry.value}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            />
            <ReferenceLine
              y={0}
              stroke="#ffffff40"
              strokeWidth={2}
              strokeDasharray="3 3"
              label={{
                value: 'Línea de Equilibrio',
                fill: '#ffffff60',
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="noAction"
              name="Sin Acción"
              stroke="#ef4444"
              strokeWidth={3}
              fill="url(#noAction)"
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="transferToday"
              name="Transferir Hoy"
              stroke="#10b981"
              strokeWidth={3}
              fill="url(#transferToday)"
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="transfer3d"
              name="Transferir en 3d"
              stroke="#f59e0b"
              strokeWidth={3}
              fill="url(#transfer3d)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla de comparación */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {scenarios.map((scenario, idx) => {
          const Icon = scenario.icon;
          return (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`bg-${scenario.color}-500/10 border border-${scenario.color}-500/20 rounded-xl p-4 cursor-pointer transition-all ${
                selectedScenario === scenario.id ? 'ring-2 ring-white/30' : ''
              }`}
              onClick={() => setSelectedScenario(scenario.id as any)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 bg-${scenario.color}-500/20 rounded-lg p-1.5 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${scenario.color}-400`} />
                  </div>
                  <div>
                    <h4 className={`text-${scenario.color}-400 font-bold text-sm`}>
                      {scenario.label}
                    </h4>
                    <p className="text-white/60 text-xs">{scenario.description}</p>
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded-lg text-xs font-bold ${
                    scenario.riesgo === 'Alto'
                      ? 'bg-rose-500/20 text-rose-400'
                      : scenario.riesgo === 'Medio'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {scenario.riesgo}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-xs">7 días:</span>
                  <span
                    className={`text-sm font-bold font-mono ${
                      scenario.resultado7d < 0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    ${scenario.resultado7d.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-xs">14 días:</span>
                  <span
                    className={`text-sm font-bold font-mono ${
                      scenario.resultado14d < 0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    ${scenario.resultado14d.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-white/80 text-xs font-medium">30 días:</span>
                  <span
                    className={`text-lg font-bold font-mono ${
                      scenario.resultado30d < 0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    ${scenario.resultado30d.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recomendación urgente */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-emerald-500/20 to-green-600/20 border border-emerald-500/30 rounded-xl p-6"
      >
        <div className="flex items-start gap-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full p-2.5 flex items-center justify-center"
          >
            <CheckCircle className="text-white w-6 h-6" />
          </motion.div>
          <div className="flex-1">
            <h4 className="text-emerald-400 text-xl font-bold mb-2">
              💡 Recomendación Urgente
            </h4>
            <p className="text-white/80 mb-4">
              Basado en el análisis de flujo de efectivo, se recomienda{' '}
              <span className="text-emerald-400 font-bold">
                realizar la transferencia HOY
              </span>{' '}
              para evitar que el sobregiro aumente. El escenario de transferencia inmediata
              proyecta un saldo positivo de{' '}
              <span className="text-emerald-400 font-bold font-mono">
                ${scenarios[1].resultado30d.toLocaleString()} MXN
              </span>{' '}
              en 30 días.
            </p>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
              >
                <Zap className="w-5 h-5" />
                <span>Ejecutar Transferencia</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-all flex items-center gap-2"
              >
                <DollarSign className="w-5 h-5" />
                <span>Ver Detalles</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
