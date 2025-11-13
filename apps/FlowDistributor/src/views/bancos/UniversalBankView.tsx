// ============================================================================
// UNIVERSAL BANK VIEW - Vista dinámica para cualquier banco
// Componente único que se adapta a cada banco mediante parámetros de ruta
// ============================================================================

import { ChronosButton } from '@/components/chronos-ui/ChronosButton';
import { ChronosCard } from '@/components/chronos-ui/ChronosCard';
import { ChronosKPI } from '@/components/chronos-ui/ChronosKPI';
import {
    useChronosData,
    useMovimientosBanco,
} from '@/hooks/useChronosData';
import type { BancoId } from '@/types';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    DollarSign,
    TrendingUp,
} from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

// Configuración visual por banco
const bankConfig: Record<
  BancoId,
  { nombre: string; color: string; tipo: string }
> = {
  BM: { nombre: 'Bóveda Monte', color: '#6366f1', tipo: 'Bucket' },
  FL: { nombre: 'Flete', color: '#00d9ff', tipo: 'Bucket' },
  UT: { nombre: 'Utilidades', color: '#10b981', tipo: 'Bucket' },
  AZTECA: { nombre: 'Banco Azteca', color: '#00d9ff', tipo: 'Operacional' },
  LEFTIE: { nombre: 'Banco Leftie', color: '#ec4899', tipo: 'Operacional' },
  PROFIT: { nombre: 'Banco Profit', color: '#f59e0b', tipo: 'Operacional' },
  BOVEDA_USA: { nombre: 'Bóveda USA', color: '#6366f1', tipo: 'Operacional' },
};

export function UniversalBankView() {
  const { bancoId } = useParams<{ bancoId: BancoId }>();
  const navigate = useNavigate();
  const { bancos, ventas, gastos, loading, error } = useChronosData();
  const { movimientos } = useMovimientosBanco(bancoId as BancoId);

  const config = bancoId && bankConfig[bancoId as BancoId] ? bankConfig[bancoId as BancoId] : null;
  const banco = bancos.find(b => b.id === bancoId);

  // Capital histórico (últimos 12 meses)
  const chartData = useMemo(() => {
    if (!banco?.capitalHistorico) return [];

    const meses = 12;
    const data: Array<{ mes: string; capital: number }> = [];
    const hoy = new Date();

    for (let i = meses - 1; i >= 0; i--) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      const mesStr = fecha.toLocaleDateString('es-MX', {
        month: 'short',
        year: '2-digit',
      });

      // Buscar capital al final del mes
      const registros = banco.capitalHistorico.filter(ch => {
        const fch = ch.fecha instanceof Date ? ch.fecha : new Date(ch.fecha);
        return (
          fch.getMonth() === fecha.getMonth() &&
          fch.getFullYear() === fecha.getFullYear()
        );
      });

      const capital = registros.length > 0
        ? registros[registros.length - 1].capital
        : banco.capitalActual;

      data.push({ mes: mesStr, capital });
    }

    return data;
  }, [banco]);

  // Ingresos del mes
  const ingresosMes = useMemo(() => {
    const now = new Date();
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);

    return ventas
      .filter(v => {
        const fecha = v.fecha instanceof Date ? v.fecha : new Date(v.fecha);
        return (
          fecha >= inicioMes &&
          v.estatus === 'Pagado' &&
          v.banco === bancoId
        );
      })
      .reduce((sum, v) => sum + v.precioVenta, 0);
  }, [ventas, bancoId]);

  // Egresos del mes
  const egresosMes = useMemo(() => {
    const now = new Date();
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);

    return gastos
      .filter(g => {
        const fecha = g.fecha instanceof Date ? g.fecha : new Date(g.fecha);
        return (
          fecha >= inicioMes &&
          g.tipo === 'gasto' &&
          g.bancoOrigen === bancoId
        );
      })
      .reduce((sum, g) => sum + g.monto, 0);
  }, [gastos, bancoId]);

  const balanceNeto = ingresosMes - egresosMes;

  // Validar que el bancoId existe
  if (!bancoId || !config) {
    return (
      <div className="min-h-screen bg-chronos-void flex items-center justify-center">
        <ChronosCard variant="glass-dark" className="max-w-md">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-neon-red mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-chronos-white mb-2">
              Banco no encontrado
            </h3>
            <p className="text-chronos-silver mb-4">
              El banco "{bancoId}" no existe en el sistema.
            </p>
            <ChronosButton onClick={() => navigate('/bancos')}>
              Ver todos los bancos
            </ChronosButton>
          </div>
        </ChronosCard>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-chronos-void flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-chronos-silver">Cargando datos del banco...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-chronos-void flex items-center justify-center">
        <ChronosCard variant="glass-dark" className="max-w-md">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-neon-red mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-chronos-white mb-2">
              Error cargando datos
            </h3>
            <p className="text-chronos-silver">{error.message}</p>
          </div>
        </ChronosCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chronos-void p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <ChronosButton
              variant="ghost"
              icon={ArrowLeft}
              onClick={() => navigate('/bancos')}
              className="mb-4"
            >
              Volver
            </ChronosButton>
            <h1
              className="text-4xl font-bold mb-2"
              style={{ color: config?.color }}
            >
              {config?.nombre}
            </h1>
            <p className="text-chronos-silver flex items-center gap-2">
              <span className="px-3 py-1 rounded-full glass text-sm">
                {config?.tipo}
              </span>
              <span>•</span>
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
              })}
            </p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ChronosCard>
            <ChronosKPI
              label="Capital Disponible"
              value={banco?.capitalActual || 0}
              format="currency"
              color="cyan"
              icon={DollarSign}
              pulse
              size="lg"
            />
          </ChronosCard>

          <ChronosCard>
            <ChronosKPI
              label="Ingresos del Mes"
              value={ingresosMes}
              format="currency"
              color="green"
              icon={TrendingUp}
              size="lg"
            />
          </ChronosCard>

          <ChronosCard>
            <ChronosKPI
              label="Egresos del Mes"
              value={egresosMes}
              format="currency"
              color="red"
              icon={TrendingUp}
              size="lg"
            />
          </ChronosCard>

          <ChronosCard>
            <ChronosKPI
              label="Balance Neto"
              value={balanceNeto}
              format="currency"
              color={balanceNeto >= 0 ? 'green' : 'red'}
              icon={DollarSign}
              size="lg"
            />
          </ChronosCard>
        </div>

        {/* Chart */}
        <ChronosCard
          title="Evolución del Capital"
          subtitle="Últimos 12 meses"
          icon={TrendingUp}
          variant="glass-metal"
          className="mb-8"
        >
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
              <XAxis
                dataKey="mes"
                stroke="#808080"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#808080"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(20, 20, 20, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value: number) =>
                  `$${value.toLocaleString('es-MX')}`
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="capital"
                stroke={config?.color || '#00d9ff'}
                strokeWidth={3}
                dot={{ fill: config?.color || '#00d9ff', r: 5 }}
                activeDot={{ r: 7 }}
                name="Capital"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChronosCard>

        {/* Movimientos recientes */}
        <ChronosCard
          title="Movimientos Recientes"
          subtitle={`Últimos ${movimientos.slice(0, 10).length} movimientos`}
          variant="glass-dark"
        >
          <div className="space-y-2">
            {movimientos.slice(0, 10).map((mov) => (
              <motion.div
                key={mov.id}
                className="flex items-center justify-between p-4 glass rounded-xl hover:bg-chronos-graphite transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div>
                  <p className="text-chronos-white font-medium">
                    {mov.concepto}
                  </p>
                  <p className="text-chronos-silver text-sm">
                    {new Date(mov.fecha).toLocaleDateString('es-MX', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${
                      mov.tipo === 'ingreso'
                        ? 'text-neon-green'
                        : 'text-neon-red'
                    }`}
                  >
                    {mov.tipo === 'ingreso' ? '+' : '-'}$
                    {mov.monto.toLocaleString('es-MX')}
                  </p>
                  <p className="text-chronos-silver text-sm">
                    Saldo: ${mov.saldoNuevo.toLocaleString('es-MX')}
                  </p>
                </div>
              </motion.div>
            ))}

            {movimientos.length === 0 && (
              <div className="text-center py-8 text-chronos-silver">
                <p>No hay movimientos registrados</p>
              </div>
            )}
          </div>
        </ChronosCard>
      </motion.div>
    </div>
  );
}

export default UniversalBankView;
