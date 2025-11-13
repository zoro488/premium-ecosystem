# 🚀 Script de Refactorización FlowDistributor
# Divide el archivo monolítico en módulos manejables

param(
    [switch]$DryRun = $false,
    [switch]$CreateBackup = $true
)

$ErrorActionPreference = "Stop"

Write-Host @"
╔════════════════════════════════════════════════╗
║  🔧 REFACTORIZACIÓN FLOWDISTRIBUTOR           ║
║  Dividir 9,878 líneas en módulos             ║
╚════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# Rutas
$sourceFile = "src\apps\FlowDistributor\FlowDistributor.jsx"
$backupDir = "backups\flowdistributor_refactor_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
$newStructure = @{
    "pages" = @(
        "DashboardPage.jsx",
        "AccountsPage.jsx",
        "TransactionsPage.jsx",
        "ReportsPage.jsx",
        "SettingsPage.jsx"
    )
    "features/accounts" = @(
        "AccountList.jsx",
        "AccountForm.jsx",
        "AccountDetails.jsx",
        "useAccounts.js",
        "accountsSlice.js"
    )
    "features/transactions" = @(
        "TransactionList.jsx",
        "TransactionForm.jsx",
        "TransactionDetails.jsx",
        "useTransactions.js",
        "transactionsSlice.js"
    )
    "features/analytics" = @(
        "AnalyticsDashboard.jsx",
        "ChartsSection.jsx",
        "MetricsCards.jsx",
        "useAnalytics.js"
    )
    "layouts" = @(
        "MainLayout.jsx",
        "Sidebar.jsx",
        "Header.jsx",
        "Footer.jsx"
    )
    "services" = @(
        "accountService.js",
        "transactionService.js",
        "reportService.js",
        "validationService.js",
        "calculationService.js"
    )
}

function Write-Step {
    param($Message, $Color = "Yellow")
    Write-Host "`n→ $Message" -ForegroundColor $Color
}

# 1. Crear backup
if ($CreateBackup) {
    Write-Step "Creando backup..."
    New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
    Copy-Item $sourceFile "$backupDir\FlowDistributor_original.jsx"
    Write-Host "  ✅ Backup creado en: $backupDir" -ForegroundColor Green
}

# 2. Analizar archivo actual
Write-Step "Analizando archivo actual..."
$content = Get-Content $sourceFile -Raw
$lines = (Get-Content $sourceFile).Length
Write-Host "  📊 Total líneas: $lines" -ForegroundColor Cyan

# 3. Crear nueva estructura
Write-Step "Creando estructura de directorios..."
foreach ($dir in $newStructure.Keys) {
    $path = "src\apps\FlowDistributor\$dir"
    if ($DryRun) {
        Write-Host "  [DRY RUN] Crearía: $path" -ForegroundColor Gray
    } else {
        New-Item -ItemType Directory -Force -Path $path | Out-Null
        Write-Host "  ✅ Creado: $path" -ForegroundColor Green
    }
}

# 4. Crear archivos base
Write-Step "Creando archivos base..."
$templatesCreated = 0

foreach ($dir in $newStructure.Keys) {
    foreach ($file in $newStructure[$dir]) {
        $filePath = "src\apps\FlowDistributor\$dir\$file"

        if ($DryRun) {
            Write-Host "  [DRY RUN] Crearía: $filePath" -ForegroundColor Gray
            $templatesCreated++
        } else {
            # Determinar tipo de archivo
            $isTypeScript = $file -match "\.tsx?$"
            $isComponent = $file -match "\.jsx$"
            $isHook = $file -match "^use.*\.js$"
            $isService = $file -match "Service\.js$"

            # Crear template apropiado
            $template = ""

            if ($isComponent) {
                $componentName = [System.IO.Path]::GetFileNameWithoutExtension($file)
                $template = @"
import React from 'react';
import { motion } from 'framer-motion';

/**
 * $componentName
 * TODO: Extraer lógica de FlowDistributor.jsx
 */
export const $componentName = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <h2 className="text-2xl font-bold mb-4">$componentName</h2>
      {/* TODO: Implementar componente */}
    </motion.div>
  );
};

export default $componentName;
"@
            } elseif ($isHook) {
                $hookName = [System.IO.Path]::GetFileNameWithoutExtension($file)
                $template = @"
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

/**
 * $hookName
 * TODO: Extraer lógica de FlowDistributor.jsx
 */
export const $hookName = () => {
  // TODO: Implementar hook

  return {
    // data
    // loading
    // error
    // methods
  };
};
"@
            } elseif ($isService) {
                $serviceName = [System.IO.Path]::GetFileNameWithoutExtension($file)
                $template = @"
/**
 * $serviceName
 * Servicio para manejar operaciones de negocio
 * TODO: Extraer lógica de FlowDistributor.jsx
 */

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export const $serviceName = {
  // TODO: Implementar métodos del servicio

  /**
   * Obtener todos los registros
   */
  getAll: async () => {
    try {
      // TODO: Implementar
      throw new Error('Not implemented');
    } catch (error) {
      console.error('Error in getAll:', error);
      throw error;
    }
  },

  /**
   * Crear nuevo registro
   */
  create: async (data) => {
    try {
      // TODO: Implementar
      throw new Error('Not implemented');
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  },
};
"@
            } else {
                $template = @"
/**
 * $file
 * TODO: Extraer lógica de FlowDistributor.jsx
 */

export default {};
"@
            }

            Set-Content -Path $filePath -Value $template -Encoding UTF8
            Write-Host "  ✅ Creado: $file" -ForegroundColor Green
            $templatesCreated++
        }
    }
}

# 5. Crear archivo de rutas
Write-Step "Creando sistema de rutas..."
$routesFile = "src\apps\FlowDistributor\routes\FlowDistributorRoutes.jsx"
$routesTemplate = @"
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';

// Lazy load pages
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const AccountsPage = lazy(() => import('../pages/AccountsPage'));
const TransactionsPage = lazy(() => import('../pages/TransactionsPage'));
const ReportsPage = lazy(() => import('../pages/ReportsPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
  </div>
);

/**
 * FlowDistributor Routes
 * Sistema de rutas optimizado con lazy loading
 */
export const FlowDistributorRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route
          path="dashboard"
          element={
            <Suspense fallback={<PageLoader />}>
              <DashboardPage />
            </Suspense>
          }
        />

        <Route
          path="accounts"
          element={
            <Suspense fallback={<PageLoader />}>
              <AccountsPage />
            </Suspense>
          }
        />

        <Route
          path="transactions"
          element={
            <Suspense fallback={<PageLoader />}>
              <TransactionsPage />
            </Suspense>
          }
        />

        <Route
          path="reports"
          element={
            <Suspense fallback={<PageLoader />}>
              <ReportsPage />
            </Suspense>
          }
        />

        <Route
          path="settings"
          element={
            <Suspense fallback={<PageLoader />}>
              <SettingsPage />
            </Suspense>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default FlowDistributorRoutes;
"@

if ($DryRun) {
    Write-Host "  [DRY RUN] Crearía archivo de rutas" -ForegroundColor Gray
} else {
    New-Item -ItemType Directory -Force -Path "src\apps\FlowDistributor\routes" | Out-Null
    Set-Content -Path $routesFile -Value $routesTemplate -Encoding UTF8
    Write-Host "  ✅ Sistema de rutas creado" -ForegroundColor Green
}

# 6. Crear nuevo FlowDistributor.jsx (entry point)
Write-Step "Creando nuevo punto de entrada..."
$newEntryPoint = @"
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';
import { FlowDistributorRoutes } from './routes/FlowDistributorRoutes';
import { ToastProvider } from '@/components/ui/Toast';
import { AuthProvider } from '@/contexts/AuthContext';

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * FlowDistributor 3.0 - Refactorizado
 * Sistema modular de gestión empresarial
 *
 * @version 3.0.0
 * @date 2025-10-22
 */
export const FlowDistributor = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <FlowDistributorRoutes />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>

      {/* DevTools en desarrollo */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default FlowDistributor;
"@

if ($DryRun) {
    Write-Host "  [DRY RUN] Crearía nuevo punto de entrada" -ForegroundColor Gray
} else {
    Set-Content -Path "src\apps\FlowDistributor\FlowDistributor_v3.jsx" -Value $newEntryPoint -Encoding UTF8
    Write-Host "  ✅ Nuevo punto de entrada creado: FlowDistributor_v3.jsx" -ForegroundColor Green
}

# 7. Generar reporte
Write-Step "Generando reporte de refactorización..."

$report = @"
# 📊 Reporte de Refactorización FlowDistributor

**Fecha**: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
**Archivo Original**: $sourceFile ($lines líneas)
**Backup**: $backupDir

## ✅ Estructura Creada

### Directorios
"@

foreach ($dir in $newStructure.Keys) {
    $report += "`n- ``src/apps/FlowDistributor/$dir``"
}

$report += @"

### Archivos Creados
Total: $templatesCreated archivos

"@

foreach ($dir in $newStructure.Keys) {
    $report += "`n#### $dir`n"
    foreach ($file in $newStructure[$dir]) {
        $report += "- [x] $file`n"
    }
}

$report += @"

## 🎯 Próximos Pasos

### 1. Análisis del Código Original
``````bash
# Ver estructura de componentes
npm run analyze:components

# Detectar dependencies
npm run analyze:deps
``````

### 2. Extracción de Componentes
- [ ] Identificar componentes principales
- [ ] Extraer a archivos individuales
- [ ] Agregar tests unitarios

### 3. Migración de Estado
- [ ] Implementar Zustand stores
- [ ] Migrar a React Query
- [ ] Agregar optimistic updates

### 4. Testing
- [ ] Unit tests para servicios
- [ ] Component tests para UI
- [ ] E2E tests para flujos

### 5. Optimización
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Bundle analysis

## 📝 Notas

- Archivo original preservado en backup
- Todos los templates tienen TODOs
- Estructura lista para implementación
- Sistema de rutas configurado

## 🔗 Referencias

- Plan maestro: ``FLOWDISTRIBUTOR_OPTIMIZATION_MASTER_PLAN.md``
- Documentación: ``README_FLOWDISTRIBUTOR.md``
"@

$reportFile = "FLOWDISTRIBUTOR_REFACTOR_REPORT_$(Get-Date -Format 'yyyyMMdd_HHmmss').md"
Set-Content -Path $reportFile -Value $report -Encoding UTF8

# Resumen final
Write-Host @"

╔════════════════════════════════════════════════╗
║  ✅ REFACTORIZACIÓN COMPLETADA                ║
╚════════════════════════════════════════════════╝

📊 Estadísticas:
   • Directorios creados: $($newStructure.Keys.Count)
   • Archivos creados: $templatesCreated
   • Líneas originales: $lines

📁 Backup: $backupDir
📄 Reporte: $reportFile

🎯 Siguiente paso:
   npm run dev

"@ -ForegroundColor Green

if ($DryRun) {
    Write-Host "⚠️  DRY RUN - No se realizaron cambios reales" -ForegroundColor Yellow
}
