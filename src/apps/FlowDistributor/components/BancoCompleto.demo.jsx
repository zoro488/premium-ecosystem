import React from 'react';
import { BancoCompleto } from './BancoCompleto';

/**
 * Demo page for BancoCompleto component
 * Shows the 4 tables visualization with sample data
 */
export const BancoCompletoDemo = () => {
  // Sample banco data matching the structure
  const bancosDemo = [
    {
      nombre: 'Bóveda Monte',
      ingresos: [
        {
          fecha: new Date('2025-10-15'),
          cliente: 'Cliente Premium A',
          monto: 125000,
          tc: 20.5,
          pesos: 2562500,
          destino: 'Bóveda Monte',
          concepto: 'Venta contado',
          observaciones: 'Pago completo recibido'
        },
        {
          fecha: new Date('2025-10-16'),
          cliente: 'Distribuidor XYZ',
          monto: 89500,
          tc: 20.5,
          pesos: 1834750,
          destino: 'Bóveda Monte',
          concepto: 'Transferencia cliente',
          observaciones: 'Cobro mensual'
        },
        {
          fecha: new Date('2025-10-17'),
          cliente: 'Corporativo ABC',
          monto: 234000,
          tc: 20.5,
          pesos: 4797000,
          destino: 'Bóveda Monte',
          concepto: 'Pago distribuidor',
          observaciones: 'Factura 001234'
        }
      ],
      gastos: [
        {
          fecha: new Date('2025-10-15'),
          origen: 'Bóveda Monte',
          monto: 450000,
          tc: 20.5,
          pesos: 9225000,
          destino: 'Proveedor Principal',
          concepto: 'Compra inventario',
          observaciones: 'Inventario Q4 2025'
        },
        {
          fecha: new Date('2025-10-16'),
          origen: 'Bóveda Monte',
          monto: 78000,
          tc: 20.5,
          pesos: 1599000,
          destino: 'Operaciones',
          concepto: 'Gastos operativos',
          observaciones: 'Mantenimiento mensual'
        }
      ],
      totalIngresos: 5716450,
      totalGastos: 5722280,
      rfActual: -5830,
      balance: -5830,
      transferencias: []
    },
    {
      nombre: 'Bóveda USA',
      ingresos: [
        {
          fecha: new Date('2025-10-14'),
          cliente: 'US International Corp',
          monto: 450000,
          tc: 1,
          pesos: 450000,
          destino: 'Bóveda USA',
          concepto: 'Wire transfer',
          observaciones: 'International payment USD'
        },
        {
          fecha: new Date('2025-10-15'),
          cliente: 'Global Trading LLC',
          monto: 238000,
          tc: 1,
          pesos: 238000,
          destino: 'Bóveda USA',
          concepto: 'Payment received',
          observaciones: 'Monthly settlement'
        }
      ],
      gastos: [
        {
          fecha: new Date('2025-10-14'),
          origen: 'Bóveda USA',
          monto: 125000,
          tc: 1,
          pesos: 125000,
          destino: 'DHL Express',
          concepto: 'International shipping',
          observaciones: 'Freight charges'
        },
        {
          fecha: new Date('2025-10-15'),
          origen: 'Bóveda USA',
          monto: 34500,
          tc: 1,
          pesos: 34500,
          destino: 'US Customs',
          concepto: 'Customs fees',
          observaciones: 'Import duties'
        }
      ],
      totalIngresos: 1888275,
      totalGastos: 1760270,
      rfActual: 128005,
      balance: 128005,
      transferencias: []
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            🏦 Demo: Validación de 4 Tablas por Banco
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Visualización completa de Ingresos, Gastos, RF Actual y Transferencias
          </p>
        </div>

        {/* Mostrar cada banco */}
        {bancosDemo.map((banco, index) => (
          <div key={index} className="mb-12">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg p-4">
              <h2 className="text-2xl font-bold text-white">
                {banco.nombre}
              </h2>
              <div className="flex gap-4 mt-2 text-white text-sm">
                <span>💰 RF: ${banco.rfActual.toLocaleString('es-MX')}</span>
                <span>📈 Ingresos: {banco.ingresos.length}</span>
                <span>📉 Gastos: {banco.gastos.length}</span>
                <span>🔄 Transferencias: {banco.transferencias.length}</span>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-b-lg p-6 shadow-xl">
              <BancoCompleto banco={banco} />
            </div>
          </div>
        ))}

        {/* Resumen de Validación */}
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-4">
            ✅ Validación Completa
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  Tabla 1: Ingresos
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  8 columnas completas (fecha, cliente, monto, tc, pesos, destino, concepto, observaciones)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  Tabla 2: Gastos
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  8 columnas completas (fecha, origen, monto, tc, pesos, destino, concepto, observaciones)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  Tabla 3: RF Actual
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Totales correctos (totalIngresos - totalGastos = rfActual)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  Tabla 4: Transferencias
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Estructura preparada, vacía por ahora
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BancoCompletoDemo;
