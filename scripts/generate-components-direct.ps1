#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Generador directo de componentes sin dependencias de LLM

.DESCRIPTION
    Genera componentes TypeScript/React basados en templates predefinidos
    Sin necesidad de API keys de OpenAI o GitHub Models
#>

param(
    [Parameter(Mandatory = $false)]
    [ValidateSet('bancos_tabs', 'dashboard_ia', 'sistema_ml', 'reportes_avanzados', 'all')]
    [string]$Gap = "bancos_tabs",

    [Parameter(Mandatory = $false)]
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$BASE_PATH = Split-Path $PSScriptRoot -Parent
$CHRONOS_PATH = Join-Path $BASE_PATH "src\apps\FlowDistributor\chronos-system"

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🚀 GENERADOR DIRECTO DE COMPONENTES - FLOWDISTRIBUTOR                  ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# TEMPLATES DE COMPONENTES
# ============================================================================

function New-BancoTabsComponent {
    $content = @'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TabIngresosBanco } from './TabIngresosBanco';
import { TabGastosBanco } from './TabGastosBanco';
import { TabTransferenciasBanco } from './TabTransferenciasBanco';
import { TabCortesBanco } from './TabCortesBanco';

/**
 * BancoTabs - Container principal con navegación de tabs
 *
 * Sistema de tabs para gestión completa de bancos:
 * - Ingresos (9 columnas + 2 charts)
 * - Gastos (11 columnas + alertas + 2 charts)
 * - Transferencias (10 columnas + Sankey + Network Graph)
 * - Cortes (10 columnas + 5 charts + análisis)
 *
 * @component
 */

interface Tab {
  id: string;
  label: string;
  icon: string;
  component: React.ComponentType<any>;
  badge?: number;
}

interface BancoTabsProps {
  bancoId: string;
  bancoNombre: string;
}

export const BancoTabs: React.FC<BancoTabsProps> = ({ bancoId, bancoNombre }) => {
  const [activeTab, setActiveTab] = useState<string>('ingresos');

  const tabs: Tab[] = [
    {
      id: 'ingresos',
      label: 'Ingresos',
      icon: '📥',
      component: TabIngresosBanco
    },
    {
      id: 'gastos',
      label: 'Gastos',
      icon: '📤',
      component: TabGastosBanco
    },
    {
      id: 'transferencias',
      label: 'Transferencias',
      icon: '🔄',
      component: TabTransferenciasBanco
    },
    {
      id: 'cortes',
      label: 'Cortes',
      icon: '📋',
      component: TabCortesBanco
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabData?.component;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header con tabs */}
      <div className="bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center space-x-1 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative px-6 py-3 rounded-lg font-medium transition-all duration-300
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/50'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <div className="flex items-center space-x-2">
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {tab.badge}
                  </span>
                )}
              </div>

              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {ActiveComponent && (
              <ActiveComponent bancoId={bancoId} bancoNombre={bancoNombre} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BancoTabs;
'@

    $path = Join-Path $CHRONOS_PATH "components\bancos\BancoTabs.tsx"
    if ($Force -or -not (Test-Path $path)) {
        $content | Out-File -FilePath $path -Encoding UTF8
        Write-Host "✅ Creado: BancoTabs.tsx" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  Ya existe: BancoTabs.tsx (usa -Force para sobrescribir)" -ForegroundColor Yellow
    }
}

function New-TabIngresosBancoComponent {
    $content = @'
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataTable } from '../../ui/DataTable';

/**
 * TabIngresosBanco - Tabla de ingresos con 9 columnas + 2 charts
 *
 * Columnas:
 * 1. Fecha
 * 2. Concepto
 * 3. Monto
 * 4. Origen
 * 5. Categoría
 * 6. Método Pago
 * 7. Banco Destino
 * 8. Usuario
 * 9. Notas
 *
 * Charts:
 * - Line Chart: Ingresos por día
 * - Bar Chart: Ingresos por categoría
 *
 * @component
 */

interface TabIngresosBancoProps {
  bancoId: string;
  bancoNombre: string;
}

interface Ingreso {
  id: string;
  fecha: Date;
  concepto: string;
  monto: number;
  origen: string;
  categoria: string;
  metodoPago: string;
  bancoDestino: string;
  usuario: string;
  notas?: string;
}

export const TabIngresosBanco: React.FC<TabIngresosBancoProps> = ({ bancoId, bancoNombre }) => {
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [fechaInicio, setFechaInicio] = useState<Date>(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [fechaFin, setFechaFin] = useState<Date>(new Date());

  // Query ingresos
  const { data: ingresos = [], isLoading } = useQuery({
    queryKey: ['ingresos-banco', bancoId, fechaInicio, fechaFin],
    queryFn: async () => {
      // TODO: Implementar llamada a Firebase
      return [] as Ingreso[];
    }
  });

  // Datos para charts
  const chartDataPorDia = useMemo(() => {
    const grouped = ingresos.reduce((acc, ingreso) => {
      const fecha = new Date(ingreso.fecha).toLocaleDateString();
      if (!acc[fecha]) {
        acc[fecha] = { fecha, total: 0 };
      }
      acc[fecha].total += ingreso.monto;
      return acc;
    }, {} as Record<string, { fecha: string; total: number }>);

    return Object.values(grouped);
  }, [ingresos]);

  const chartDataPorCategoria = useMemo(() => {
    const grouped = ingresos.reduce((acc, ingreso) => {
      if (!acc[ingreso.categoria]) {
        acc[ingreso.categoria] = { categoria: ingreso.categoria, total: 0 };
      }
      acc[ingreso.categoria].total += ingreso.monto;
      return acc;
    }, {} as Record<string, { categoria: string; total: number }>);

    return Object.values(grouped);
  }, [ingresos]);

  // Columnas de la tabla
  const columns = [
    {
      header: 'Fecha',
      accessorKey: 'fecha',
      cell: (info: any) => new Date(info.getValue()).toLocaleDateString()
    },
    {
      header: 'Concepto',
      accessorKey: 'concepto'
    },
    {
      header: 'Monto',
      accessorKey: 'monto',
      cell: (info: any) => `$${info.getValue().toLocaleString()}`
    },
    {
      header: 'Origen',
      accessorKey: 'origen'
    },
    {
      header: 'Categoría',
      accessorKey: 'categoria'
    },
    {
      header: 'Método Pago',
      accessorKey: 'metodoPago'
    },
    {
      header: 'Banco Destino',
      accessorKey: 'bancoDestino'
    },
    {
      header: 'Usuario',
      accessorKey: 'usuario'
    },
    {
      header: 'Notas',
      accessorKey: 'notas'
    }
  ];

  const totalIngresos = ingresos.reduce((sum, ing) => sum + ing.monto, 0);

  return (
    <div className="space-y-6">
      {/* Header con métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl border border-green-500/30 rounded-xl p-6"
        >
          <div className="text-green-400 text-sm font-medium mb-2">Total Ingresos</div>
          <div className="text-3xl font-bold text-white">${totalIngresos.toLocaleString()}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6"
        >
          <div className="text-blue-400 text-sm font-medium mb-2">Transacciones</div>
          <div className="text-3xl font-bold text-white">{ingresos.length}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6"
        >
          <div className="text-purple-400 text-sm font-medium mb-2">Promedio</div>
          <div className="text-3xl font-bold text-white">
            ${ingresos.length > 0 ? (totalIngresos / ingresos.length).toLocaleString() : 0}
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Ingresos por día */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📈 Ingresos por Día</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartDataPorDia}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="fecha" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Ingresos por categoría */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📊 Ingresos por Categoría</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartDataPorCategoria}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="categoria" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend />
              <Bar dataKey="total" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla de ingresos */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">💰 Detalle de Ingresos</h3>
        </div>
        <DataTable
          columns={columns}
          data={ingresos}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default TabIngresosBanco;
'@

    $path = Join-Path $CHRONOS_PATH "components\bancos\TabIngresosBanco.tsx"
    if ($Force -or -not (Test-Path $path)) {
        $content | Out-File -FilePath $path -Encoding UTF8
        Write-Host "✅ Creado: TabIngresosBanco.tsx" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  Ya existe: TabIngresosBanco.tsx" -ForegroundColor Yellow
    }
}

# Generar todos los componentes según el gap seleccionado
switch ($Gap) {
    'bancos_tabs' {
        Write-Host "🔨 Generando componentes de Bancos Tabs..." -ForegroundColor Cyan
        New-BancoTabsComponent
        New-TabIngresosBancoComponent
        Write-Host ""
        Write-Host "✅ Componentes de Bancos generados exitosamente!" -ForegroundColor Green
        Write-Host "📝 Archivos creados:" -ForegroundColor Cyan
        Write-Host "   - components/bancos/BancoTabs.tsx" -ForegroundColor White
        Write-Host "   - components/bancos/TabIngresosBanco.tsx" -ForegroundColor White
        Write-Host ""
        Write-Host "📚 Próximos pasos:" -ForegroundColor Cyan
        Write-Host "   1. Implementar TabGastosBanco.tsx" -ForegroundColor White
        Write-Host "   2. Implementar TabTransferenciasBanco.tsx" -ForegroundColor White
        Write-Host "   3. Implementar TabCortesBanco.tsx" -ForegroundColor White
        Write-Host "   4. Integrar en las páginas de bancos" -ForegroundColor White
    }

    'all' {
        Write-Host "🔨 Generando TODOS los componentes..." -ForegroundColor Cyan
        New-BancoTabsComponent
        New-TabIngresosBancoComponent
        # TODO: Agregar más componentes aquí
    }
}

Write-Host ""
Write-Host "🎉 Generación completada!" -ForegroundColor Green
Write-Host ""
