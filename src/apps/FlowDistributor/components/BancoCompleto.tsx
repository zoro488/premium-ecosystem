import React from 'react';

interface Ingreso {
  fecha: Date | string;
  cliente: string;
  monto: number;
  tc?: number;
  pesos?: number;
  destino: string;
  concepto: string;
  observaciones: string;
}

interface Gasto {
  fecha: Date | string;
  origen: string;
  monto: number;
  tc?: number;
  pesos?: number;
  destino: string;
  concepto: string;
  observaciones: string;
}

interface Transferencia {
  fecha?: Date | string;
  bancoOrigen?: string;
  bancoDestino?: string;
  monto?: number;
  concepto?: string;
}

interface BancoCompletoProps {
  banco: {
    nombre: string;
    ingresos: Ingreso[];
    gastos: Gasto[];
    rfActual?: number;
    balance?: number;
    totalIngresos: number;
    totalGastos: number;
    transferencias: Transferencia[];
  };
}

export const BancoCompleto: React.FC<BancoCompletoProps> = ({ banco }) => {
  const formatFecha = (fecha: Date | string) => {
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return date.toLocaleDateString('es-MX');
  };

  const formatMonto = (monto: number) => {
    return `$${monto.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const rfActualValue = banco.rfActual !== undefined ? banco.rfActual : banco.balance || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* TABLA 1: INGRESOS */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4 text-green-600">
          📈 Ingresos ({banco.ingresos.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Fecha</th>
                <th className="text-left p-2">Cliente</th>
                <th className="text-right p-2">Monto</th>
                <th className="text-right p-2">TC</th>
                <th className="text-right p-2">Pesos</th>
                <th className="text-left p-2">Destino</th>
                <th className="text-left p-2">Concepto</th>
                <th className="text-left p-2">Obs.</th>
              </tr>
            </thead>
            <tbody>
              {banco.ingresos.map((ingreso, idx) => (
                <tr key={idx} className="border-b hover:bg-slate-50 dark:hover:bg-slate-700">
                  <td className="p-2">{formatFecha(ingreso.fecha)}</td>
                  <td className="p-2">{ingreso.cliente}</td>
                  <td className="text-right p-2 text-green-600 font-medium">
                    {formatMonto(ingreso.monto)}
                  </td>
                  <td className="text-right p-2">{ingreso.tc || '-'}</td>
                  <td className="text-right p-2">
                    {ingreso.pesos ? formatMonto(ingreso.pesos) : '-'}
                  </td>
                  <td className="p-2">{ingreso.destino}</td>
                  <td className="p-2">{ingreso.concepto}</td>
                  <td className="p-2">{ingreso.observaciones}</td>
                </tr>
              ))}
              {banco.ingresos.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center p-4 text-slate-400">
                    Sin ingresos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-lg font-bold text-green-600 border-t pt-3">
          Total: {formatMonto(banco.totalIngresos)}
        </div>
      </div>
      
      {/* TABLA 2: GASTOS */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4 text-red-600">
          📉 Gastos ({banco.gastos.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Fecha</th>
                <th className="text-left p-2">Origen</th>
                <th className="text-right p-2">Monto</th>
                <th className="text-right p-2">TC</th>
                <th className="text-right p-2">Pesos</th>
                <th className="text-left p-2">Destino</th>
                <th className="text-left p-2">Concepto</th>
                <th className="text-left p-2">Obs.</th>
              </tr>
            </thead>
            <tbody>
              {banco.gastos.map((gasto, idx) => (
                <tr key={idx} className="border-b hover:bg-slate-50 dark:hover:bg-slate-700">
                  <td className="p-2">{formatFecha(gasto.fecha)}</td>
                  <td className="p-2">{gasto.origen}</td>
                  <td className="text-right p-2 text-red-600 font-medium">
                    {formatMonto(gasto.monto)}
                  </td>
                  <td className="text-right p-2">{gasto.tc || '-'}</td>
                  <td className="text-right p-2">
                    {gasto.pesos ? formatMonto(gasto.pesos) : '-'}
                  </td>
                  <td className="p-2">{gasto.destino}</td>
                  <td className="p-2">{gasto.concepto}</td>
                  <td className="p-2">{gasto.observaciones}</td>
                </tr>
              ))}
              {banco.gastos.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center p-4 text-slate-400">
                    Sin gastos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-lg font-bold text-red-600 border-t pt-3">
          Total: {formatMonto(banco.totalGastos)}
        </div>
      </div>
      
      {/* TABLA 3: RF ACTUAL */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4 text-blue-600">
          💰 RF Actual (Balance)
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-300">Total Ingresos:</span>
            <span className="font-bold text-green-600 text-lg">
              {formatMonto(banco.totalIngresos)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-300">Total Gastos:</span>
            <span className="font-bold text-red-600 text-lg">
              {formatMonto(banco.totalGastos)}
            </span>
          </div>
          <hr className="border-slate-300 dark:border-slate-600" />
          <div className="flex justify-between items-center text-xl">
            <span className="font-semibold text-slate-700 dark:text-slate-200">RF Actual:</span>
            <span 
              className={`font-bold ${
                rfActualValue >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatMonto(rfActualValue)}
            </span>
          </div>
          <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-700 rounded">
            <div className="text-sm text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Fórmula:</span>
                <span className="font-mono">Ingresos - Gastos</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Cálculo:</span>
                <span className="font-mono">
                  {formatMonto(banco.totalIngresos)} - {formatMonto(banco.totalGastos)} = {formatMonto(rfActualValue)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* TABLA 4: TRANSFERENCIAS (Vacía) */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4 text-purple-600">
          🔄 Transferencias ({banco.transferencias.length})
        </h3>
        <div className="text-center text-slate-400 py-8">
          {banco.transferencias.length === 0 ? (
            <>
              <div className="text-4xl mb-3">📋</div>
              <p className="text-lg">Tabla preparada - Sin transferencias registradas</p>
              <p className="text-sm mt-2">Estructura lista para datos futuros</p>
            </>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Fecha</th>
                    <th className="text-left p-2">Banco Origen</th>
                    <th className="text-left p-2">Banco Destino</th>
                    <th className="text-right p-2">Monto</th>
                    <th className="text-left p-2">Concepto</th>
                  </tr>
                </thead>
                <tbody>
                  {banco.transferencias.map((transferencia, idx) => (
                    <tr key={idx} className="border-b hover:bg-slate-50 dark:hover:bg-slate-700">
                      <td className="p-2">
                        {transferencia.fecha ? formatFecha(transferencia.fecha) : '-'}
                      </td>
                      <td className="p-2">{transferencia.bancoOrigen || '-'}</td>
                      <td className="p-2">{transferencia.bancoDestino || '-'}</td>
                      <td className="text-right p-2">
                        {transferencia.monto ? formatMonto(transferencia.monto) : '-'}
                      </td>
                      <td className="p-2">{transferencia.concepto || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BancoCompleto;
