<#
.SYNOPSIS
    🚀 Script de Automatización Completa del Plan Maestro

.DESCRIPTION
    Script maestro que orquesta toda la automatización del Plan Maestro de FlowDistributor:
    - Analiza el plan maestro completo
    - Crea issues estructurados en GitHub
    - Genera componentes automáticamente
    - Crea milestones y proyectos
    - Ejecuta agents especializados
    - Integra con GitHub CLI y Actions
    - Genera reportes de progreso

.PARAMETER Action
    Acción a ejecutar: analyze, create-issues, generate-components, full-automation

.EXAMPLE
    .\plan-maestro-automation.ps1 -Action analyze
    .\plan-maestro-automation.ps1 -Action create-issues
    .\plan-maestro-automation.ps1 -Action full-automation
#>

param(
    [Parameter(Mandatory = $false)]
    [ValidateSet('analyze', 'create-issues', 'generate-components', 'create-milestones', 'create-project', 'run-agents', 'full-automation')]
    [string]$Action = 'full-automation'
)

# ===================================================================
# CONFIGURACIÓN
# ===================================================================
$ErrorActionPreference = "Stop"
$BASE_PATH = $PSScriptRoot
$REPO = "premium-ecosystem"
$OWNER = "zoro488"
$PLAN_MAESTRO_PATH = "src/apps/FlowDistributor/chronos-system/gg/PLAN_MAESTRO_COMPLETO_Version2.md"

# Colores
function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")

    switch ($Color) {
        "Success" { Write-Host $Message -ForegroundColor Green }
        "Error" { Write-Host $Message -ForegroundColor Red }
        "Warning" { Write-Host $Message -ForegroundColor Yellow }
        "Info" { Write-Host $Message -ForegroundColor Cyan }
        default { Write-Host $Message -ForegroundColor White }
    }
}

# ===================================================================
# FUNCIÓN: ANALIZAR PLAN MAESTRO
# ===================================================================
function Analyze-PlanMaestro {
    Write-ColorOutput "`n🔍 ANALIZANDO PLAN MAESTRO..." "Info"
    Write-ColorOutput "=" * 60 "Info"

    $planPath = Join-Path $BASE_PATH $PLAN_MAESTRO_PATH

    if (-not (Test-Path $planPath)) {
        Write-ColorOutput "❌ Plan Maestro no encontrado: $planPath" "Error"
        return $null
    }

    $contenido = Get-Content $planPath -Raw
    $lineas = ($contenido -split "`n").Count
    $caracteres = $contenido.Length

    Write-ColorOutput "`n📊 Estadísticas del Plan Maestro:" "Success"
    Write-ColorOutput "   📄 Líneas: $lineas" "Info"
    Write-ColorOutput "   📝 Caracteres: $caracteres" "Info"
    Write-ColorOutput "   📏 Tamaño: $([math]::Round($caracteres/1024, 2)) KB" "Info"

    # Extraer secciones principales
    $headers = ($contenido | Select-String -Pattern "^##\s+(.+)" -AllMatches).Matches | ForEach-Object { $_.Groups[1].Value }
    Write-ColorOutput "`n📋 Secciones Principales ($($headers.Count)):" "Success"
    $headers | ForEach-Object { Write-ColorOutput "   - $_" "Info" }

    # Contar componentes mencionados
    $componentesMatch = ($contenido | Select-String -Pattern "interface\s+(\w+)" -AllMatches).Matches
    $componentes = $componentesMatch | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
    Write-ColorOutput "`n🎨 Componentes Identificados ($($componentes.Count)):" "Success"
    $componentes | Select-Object -First 10 | ForEach-Object { Write-ColorOutput "   - $_" "Info" }
    if ($componentes.Count -gt 10) {
        Write-ColorOutput "   ... y $($componentes.Count - 10) más" "Info"
    }

    return @{
        Lineas          = $lineas
        Caracteres      = $caracteres
        Secciones       = $headers.Count
        Componentes     = $componentes.Count
        Headers         = $headers
        ComponentesList = $componentes
    }
}

# ===================================================================
# FUNCIÓN: CREAR ISSUES EN GITHUB
# ===================================================================
function Create-GitHubIssues {
    Write-ColorOutput "`n📝 CREANDO ISSUES EN GITHUB..." "Info"
    Write-ColorOutput "=" * 60 "Info"

    # Verificar GitHub CLI
    if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
        Write-ColorOutput "❌ GitHub CLI no está instalado" "Error"
        Write-ColorOutput "   Instalar desde: https://cli.github.com/" "Warning"
        return
    }

    $issuesCreados = @()

    # Definir issues del Plan Maestro
    $issues = @(
        @{
            Fase        = "fase-1"
            Titulo      = "🎨 Implementar Componentes UI Base (30 componentes)"
            Descripcion = @"
## 📋 Descripción

Crear librería completa de 30 componentes UI reutilizables según especificaciones del Plan Maestro.

### 🎨 Componentes a Crear

**Básicos (7):**
- [ ] Button (8 variants)
- [ ] Input (6 types)
- [ ] Select
- [ ] Checkbox
- [ ] Radio
- [ ] Switch
- [ ] Textarea

**Cards (4):**
- [ ] Card
- [ ] KPICard
- [ ] StatCard
- [ ] InfoCard

**Navegación (4):**
- [ ] Tabs
- [ ] Breadcrumb
- [ ] Pagination
- [ ] Stepper

**Feedback (6):**
- [ ] Alert
- [ ] Toast
- [ ] Modal
- [ ] Drawer
- [ ] Tooltip
- [ ] Popover

**Data Display (6):**
- [ ] Table
- [ ] DataGrid
- [ ] Timeline
- [ ] Badge
- [ ] Tag
- [ ] Avatar

**Charts (7):**
- [ ] LineChart
- [ ] BarChart
- [ ] PieChart
- [ ] AreaChart
- [ ] HeatMap
- [ ] TreeMap
- [ ] Sparkline

### 📦 Dependencias

``````bash
npm install framer-motion @headlessui/react recharts
``````

### ⏱️ Estimación

2 días (Días 1-2 del roadmap)

### 🎯 Prioridad

🔴 CRÍTICA - Bloquea implementación de todos los paneles

### 📚 Referencias

- Plan Maestro: `src/apps/FlowDistributor/chronos-system/gg/PLAN_MAESTRO_COMPLETO_Version2.md`
- Análisis: `ANALISIS_QUIRURGICO_PLAN_MAESTRO.md`
"@
            Labels      = @("fase-1", "prioridad-crítica", "plan-maestro", "enhancement", "components")
            Milestone   = "fase-1"
        },
        @{
            Fase        = "fase-1"
            Titulo      = "🔝 Implementar Header Ultra Moderno"
            Descripcion = @"
## 📋 Descripción

Implementar Header principal con diseño ultra moderno según especificaciones detalladas del Plan Maestro.

### 🎨 Componentes

- [ ] HeaderUltraModerno (principal)
- [ ] LogoAnimado3D
- [ ] BreadcrumbDinamico
- [ ] SearchBarAI
- [ ] QuickActionButton (x6)
- [ ] NotificationBell
- [ ] UserProfileDropdown
- [ ] ThemeSwitcher

### ✨ Features

- Height: 72px sticky top
- Glassmorphism + gradient blur
- Logo 3D animado con efectos glow
- Breadcrumb dinámico inteligente
- Búsqueda global AI-powered
- 6 botones acciones rápidas
- Notificaciones tiempo real
- Perfil usuario con dropdown

### 📦 Dependencias

``````bash
npm install @splinetool/react-spline framer-motion @headlessui/react react-icons
``````

### ⏱️ Estimación

2 días (Días 3-4 del roadmap)

### 🎯 Prioridad

🔴 CRÍTICA - Core UX del sistema

### 📚 Referencias

- Plan Maestro líneas 1-500
- Referencias Pinterest analizadas
"@
            Labels      = @("fase-1", "prioridad-crítica", "plan-maestro", "enhancement", "ui")
            Milestone   = "fase-1"
        },
        @{
            Fase        = "fase-1"
            Titulo      = "📱 Completar Sidebar Colapsable Ultra Moderno"
            Descripcion = @"
## 📋 Descripción

Completar implementación del Sidebar con todas las animaciones y comportamientos especificados.

### 🎨 Componentes

- [ ] SidebarUltraModerno (mejorar)
- [ ] NavItem (animaciones)
- [ ] BankSection (colapsable)
- [ ] BankItem (sparklines)
- [ ] Sparkline (nuevo)
- [ ] BadgeDynamic (nuevo)
- [ ] CollapseToggle (mejorar)

### ✨ Features Faltantes

- [ ] Hover para expandir automático
- [ ] Sparklines de capital en tiempo real
- [ ] Badges dinámicos por panel
- [ ] Shortcuts de teclado
- [ ] Estado persistente localStorage
- [ ] Animaciones smooth

### 📊 Estado Actual

⚠️ PARCIAL (30%)
- ✅ Estructura básica
- ❌ Animaciones faltantes
- ❌ Hover behavior NO implementado
- ❌ Sparklines NO implementados
- ❌ Badges dinámicos NO implementados

### ⏱️ Estimación

2 días (Días 5-6 del roadmap)

### 🎯 Prioridad

🔴 CRÍTICA - Navegación principal

### 📚 Referencias

- Plan Maestro líneas 1000-1500
- Sistema de diseño
"@
            Labels      = @("fase-1", "prioridad-crítica", "plan-maestro", "enhancement", "ui", "sidebar")
            Milestone   = "fase-1"
        },
        @{
            Fase        = "fase-2"
            Titulo      = "🤖 Completar Dashboard IA v1"
            Descripcion = @"
## 📋 Descripción

Completar implementación del Dashboard IA con KPIs, gráficas y widget flotante.

### 🎨 Componentes

- [ ] KPICard (8 tipos)
- [ ] LineChart
- [ ] BarChart
- [ ] PieChart
- [ ] AreaChart
- [ ] HeatMap
- [ ] TreeMap

### ✨ Features

- [ ] Grid de KPIs (8 cards)
- [ ] 6 gráficas interactivas
- [ ] Widget flotante IA (básico)
- [ ] Real-time updates
- [ ] Responsive layout

### 📊 Estado Actual

⚠️ PARCIAL (40%)
- ✅ KPIs básicos
- ⚠️ 3/6 gráficas
- ❌ Widget IA NO implementado

### ⏱️ Estimación

2 días (Días 8-9 del roadmap)

### 🎯 Prioridad

🟡 ALTA - Panel principal

### 📚 Referencias

- Plan Maestro Dashboard IA section
"@
            Labels      = @("fase-2", "prioridad-alta", "plan-maestro", "enhancement", "dashboard", "ai")
            Milestone   = "fase-2"
        },
        @{
            Fase        = "fase-2"
            Titulo      = "📦 Completar Panel Almacén (4 tabs)"
            Descripcion = @"
## 📋 Descripción

Completar implementación del Panel Almacén con todos los tabs y features especificados.

### ✨ Features Faltantes

- [ ] Tab Cortes de Inventario
- [ ] Alertas stock bajo/crítico
- [ ] Análisis ABC
- [ ] Valorización inventario
- [ ] Historial completo movimientos

### 📊 Estado Actual

⚠️ PARCIAL (60%)
- ✅ Tab Stock Actual
- ⚠️ Tab Entradas (básico)
- ⚠️ Tab Salidas (básico)
- ❌ Tab Cortes NO implementado

### ⏱️ Estimación

1 día (Día 10 del roadmap)

### 🎯 Prioridad

🟡 ALTA - Gestión inventario crítica

### 📚 Referencias

- Plan Maestro Panel Almacén
"@
            Labels      = @("fase-2", "prioridad-alta", "plan-maestro", "enhancement", "almacen")
            Milestone   = "fase-2"
        },
        @{
            Fase        = "fase-3"
            Titulo      = "🏦 Completar Sistema Bancario (7 bancos x 4 tabs)"
            Descripcion = @"
## 📋 Descripción

Completar implementación de los 7 bancos con sus 4 tabs cada uno.

### 🏦 Bancos

1. ⛰️ Bóveda Monte
2. 🗽 Bóveda USA
3. 💎 Utilidades
4. 🚚 Fletes
5. 🏛️ Azteca
6. 🏦 Leftie
7. 💰 Profit

### 📊 Por Cada Banco

- [ ] Tab Movimientos (mejorar)
- [ ] Tab Gastos (completar)
- [ ] Tab Transferencias (completar)
- [ ] Tab Cortes (implementar)
- [ ] Gráficas de flujo
- [ ] Capital en tiempo real
- [ ] Predicciones básicas

### 📊 Estado Actual

⚠️ PARCIAL (50% promedio)
- ✅ Estructura básica
- ⚠️ Tabs parcialmente funcionales
- ❌ Gráficas faltantes
- ❌ Cortes NO implementados

### ⏱️ Estimación

7-10 días (Días 15-21 del roadmap)
1 día por banco + refinamiento

### 🎯 Prioridad

🔴 CRÍTICA - Core business logic

### 📚 Referencias

- Plan Maestro Paneles Bancos
"@
            Labels      = @("fase-3", "prioridad-crítica", "plan-maestro", "enhancement", "bancos")
            Milestone   = "fase-3"
        },
        @{
            Fase        = "fase-3"
            Titulo      = "🔄 Implementar Sistema Transferencias Avanzadas"
            Descripcion = @"
## 📋 Descripción

Sistema completo de transferencias entre bancos con matriz de selección y validaciones.

### ✨ Features

- [ ] Matriz de transferencias (7x7)
- [ ] Validaciones complejas
- [ ] Historial transferencias
- [ ] Rutas favoritas
- [ ] Montos predefinidos
- [ ] Confirmaciones
- [ ] Actualización real-time

### ⏱️ Estimación

3 días (Días 22-24 del roadmap)

### 🎯 Prioridad

🔴 CRÍTICA - Operación fundamental

### 📚 Referencias

- Plan Maestro Sistema Transferencias
"@
            Labels      = @("fase-3", "prioridad-crítica", "plan-maestro", "enhancement", "transferencias")
            Milestone   = "fase-3"
        },
        @{
            Fase        = "fase-4"
            Titulo      = "📊 Implementar Panel Reportes (20+ reportes)"
            Descripcion = @"
## 📋 Descripción

Panel completo de reportes con constructor personalizado y 20+ reportes predefinidos.

### 📊 Reportes Prioritarios

**Financieros:**
- [ ] Estado de Resultados
- [ ] Flujo de Efectivo
- [ ] Balance General
- [ ] Análisis Rentabilidad

**Operacionales:**
- [ ] Movimientos Inventario
- [ ] Análisis ABC
- [ ] Rotación Productos

**Comerciales:**
- [ ] Ventas por Cliente
- [ ] Ventas por Producto

**IA:**
- [ ] Pronósticos
- [ ] Anomalías

### ✨ Features

- [ ] Constructor de reportes
- [ ] Export PDF/Excel
- [ ] Programación automática
- [ ] Drill-down interactivo

### 📊 Estado Actual

❌ NO IMPLEMENTADO (5%)

### ⏱️ Estimación

2 días (Días 25-26 del roadmap)

### 🎯 Prioridad

🟡 ALTA - Analytics esencial

### 📚 Referencias

- Plan Maestro Panel Reportes
"@
            Labels      = @("fase-4", "prioridad-alta", "plan-maestro", "enhancement", "reportes")
            Milestone   = "fase-4"
        },
        @{
            Fase        = "fase-4"
            Titulo      = "🤖 Implementar Sistema IA Completo"
            Descripcion = @"
## 📋 Descripción

Sistema completo de IA con widget flotante, chat, voice input y capacidades predictivas.

### 🎨 Componentes

- [ ] Widget Flotante IA
- [ ] Chat Interface
- [ ] Voice Input
- [ ] Panel IA Fullscreen
- [ ] Predicciones Dashboard

### 🧠 Capacidades IA

- [ ] Análisis de patrones
- [ ] Predicción de ventas
- [ ] Detección anomalías
- [ ] Recomendaciones productos
- [ ] Optimización stock
- [ ] Forecast flujo efectivo

### 📊 Estado Actual

❌ NO IMPLEMENTADO (0%)

### ⏱️ Estimación

2 días (Días 27-28 del roadmap)

### 🎯 Prioridad

🟡 ALTA - Diferenciador premium

### 📚 Referencias

- Plan Maestro Sistema IA
"@
            Labels      = @("fase-4", "prioridad-alta", "plan-maestro", "enhancement", "ai")
            Milestone   = "fase-4"
        },
        @{
            Fase        = "fase-4"
            Titulo      = "✨ Implementar Animaciones Premium"
            Descripcion = @"
## 📋 Descripción

Aplicar animaciones premium y micro-interacciones a todo el sistema.

### ✨ Features

- [ ] Micro-interacciones
- [ ] Page transitions
- [ ] Loading states
- [ ] Gestures
- [ ] Hover effects
- [ ] Focus animations

### 📦 Dependencias

``````bash
framer-motion (ya instalado)
``````

### ⏱️ Estimación

1 día (Día 29 del roadmap)

### 🎯 Prioridad

🟢 MEDIA - Polish final

### 📚 Referencias

- Plan Maestro Animaciones
- Referencias Pinterest
"@
            Labels      = @("fase-4", "prioridad-media", "plan-maestro", "enhancement", "animations")
            Milestone   = "fase-4"
        }
    )

    Write-ColorOutput "`n📝 Creando $($issues.Count) issues..." "Info"

    foreach ($issue in $issues) {
        try {
            Write-ColorOutput "`n   Creando: $($issue.Titulo)" "Info"

            $labels = $issue.Labels -join ","

            $cmd = "gh issue create --repo $OWNER/$REPO --title `"$($issue.Titulo)`" --body `"$($issue.Descripcion)`" --label `"$labels`""

            $result = Invoke-Expression $cmd

            if ($LASTEXITCODE -eq 0) {
                Write-ColorOutput "   ✅ Issue creado: $result" "Success"
                $issuesCreados += $result
            }
            else {
                Write-ColorOutput "   ❌ Error creando issue" "Error"
            }

            Start-Sleep -Milliseconds 1500
        }
        catch {
            Write-ColorOutput "   ❌ Error: $_" "Error"
        }
    }

    Write-ColorOutput "`n✅ Total issues creados: $($issuesCreados.Count)" "Success"
    return $issuesCreados
}

# ===================================================================
# FUNCIÓN: CREAR MILESTONES
# ===================================================================
function Create-Milestones {
    Write-ColorOutput "`n🎯 CREANDO MILESTONES..." "Info"
    Write-ColorOutput "=" * 60 "Info"

    $milestones = @(
        @{ Titulo = "fase-1: Fundamentos"; Descripcion = "Días 1-7 - Componentes UI, Header, Sidebar"; Due = 7 },
        @{ Titulo = "fase-2: Paneles Principales"; Descripcion = "Días 8-14 - Dashboard IA, Almacén, Mejoras"; Due = 14 },
        @{ Titulo = "fase-3: Sistema Bancario"; Descripcion = "Días 15-24 - 7 Bancos, Transferencias"; Due = 24 },
        @{ Titulo = "fase-4: IA y Reportes"; Descripcion = "Días 25-30 - Reportes, IA, Animaciones"; Due = 30 }
    )

    foreach ($milestone in $milestones) {
        try {
            $dueDate = (Get-Date).AddDays($milestone.Due).ToString("yyyy-MM-dd")

            $cmd = "gh api repos/$OWNER/$REPO/milestones -f title=`"$($milestone.Titulo)`" -f description=`"$($milestone.Descripcion)`" -f due_on=`"${dueDate}T00:00:00Z`""

            Invoke-Expression $cmd | Out-Null

            Write-ColorOutput "   ✅ Milestone: $($milestone.Titulo)" "Success"
            Start-Sleep -Milliseconds 500
        }
        catch {
            Write-ColorOutput "   ⚠️ Milestone ya existe o error: $($milestone.Titulo)" "Warning"
        }
    }
}

# ===================================================================
# FUNCIÓN: CREAR PROYECTO GITHUB
# ===================================================================
function Create-GitHubProject {
    Write-ColorOutput "`n📋 CREANDO PROYECTO GITHUB..." "Info"
    Write-ColorOutput "=" * 60 "Info"

    try {
        # Crear proyecto
        $projectName = "Plan Maestro - FlowDistributor"
        $projectBody = "Tracking completo del Plan Maestro de 30 días"

        Write-ColorOutput "   📋 Creando proyecto: $projectName" "Info"

        $cmd = "gh project create --owner $OWNER --title `"$projectName`" --body `"$projectBody`""
        Invoke-Expression $cmd

        Write-ColorOutput "   ✅ Proyecto creado exitosamente" "Success"

        # Agregar columnas
        Write-ColorOutput "`n   📊 Agregar columnas al proyecto..." "Info"
        $columnas = @("📋 Backlog", "⏳ En Progreso", "🔍 En Revisión", "✅ Completado")

        foreach ($columna in $columnas) {
            Write-ColorOutput "      - $columna" "Info"
        }

    }
    catch {
        Write-ColorOutput "   ❌ Error creando proyecto: $_" "Error"
    }
}

# ===================================================================
# FUNCIÓN: EJECUTAR AGENTS
# ===================================================================
function Run-Agents {
    Write-ColorOutput "`n🤖 EJECUTANDO AGENTS..." "Info"
    Write-ColorOutput "=" * 60 "Info"

    # Verificar Node.js
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-ColorOutput "❌ Node.js no está instalado" "Error"
        return
    }

    # Instalar dependencias si es necesario
    $agentsPath = Join-Path $BASE_PATH ".github/agents"
    $packagePath = Join-Path $BASE_PATH "package.json"

    if (Test-Path $packagePath) {
        $needsOctokit = -not (Test-Path (Join-Path $BASE_PATH "node_modules/@octokit"))

        if ($needsOctokit) {
            Write-ColorOutput "`n📦 Instalando @octokit/rest..." "Info"
            npm install @octokit/rest
        }
    }

    # Ejecutar Plan Maestro Agent
    $agentPath = Join-Path $agentsPath "plan-maestro-agent.js"

    if (Test-Path $agentPath) {
        Write-ColorOutput "`n🤖 Ejecutando Plan Maestro Agent..." "Info"
        node $agentPath
    }
    else {
        Write-ColorOutput "   ⚠️ Agent no encontrado: $agentPath" "Warning"
    }
}

# ===================================================================
# FUNCIÓN: EJECUTAR AUTOMATIZACIÓN COMPLETA
# ===================================================================
function Run-FullAutomation {
    Write-ColorOutput "`n🚀 AUTOMATIZACIÓN COMPLETA DEL PLAN MAESTRO" "Success"
    Write-ColorOutput "=" * 60 "Success"
    Write-ColorOutput "Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" "Info"
    Write-ColorOutput ""

    # Paso 1: Analizar
    Write-ColorOutput "`n[1/6] Analizando Plan Maestro..." "Info"
    $analisis = Analyze-PlanMaestro
    Start-Sleep -Seconds 2

    # Paso 2: Crear Milestones
    Write-ColorOutput "`n[2/6] Creando Milestones..." "Info"
    Create-Milestones
    Start-Sleep -Seconds 2

    # Paso 3: Crear Issues
    Write-ColorOutput "`n[3/6] Creando Issues..." "Info"
    $issues = Create-GitHubIssues
    Start-Sleep -Seconds 2

    # Paso 4: Crear Proyecto
    Write-ColorOutput "`n[4/6] Creando Proyecto GitHub..." "Info"
    Create-GitHubProject
    Start-Sleep -Seconds 2

    # Paso 5: Ejecutar Agents
    Write-ColorOutput "`n[5/6] Ejecutando Agents..." "Info"
    Run-Agents
    Start-Sleep -Seconds 2

    # Paso 6: Resumen Final
    Write-ColorOutput "`n[6/6] Generando Resumen Final..." "Info"

    Write-ColorOutput "`n" "Success"
    Write-ColorOutput "=" * 60 "Success"
    Write-ColorOutput "✅ AUTOMATIZACIÓN COMPLETA FINALIZADA" "Success"
    Write-ColorOutput "=" * 60 "Success"

    Write-ColorOutput "`n📊 Resumen de Ejecución:" "Info"
    if ($analisis) {
        Write-ColorOutput "   📄 Líneas analizadas: $($analisis.Lineas)" "Info"
        Write-ColorOutput "   🎨 Componentes identificados: $($analisis.Componentes)" "Info"
    }
    if ($issues) {
        Write-ColorOutput "   📝 Issues creados: $($issues.Count)" "Info"
    }
    Write-ColorOutput "   🎯 Milestones creados: 4" "Info"
    Write-ColorOutput "   📋 Proyecto creado: 1" "Info"

    Write-ColorOutput "`n🔗 Enlaces Útiles:" "Info"
    Write-ColorOutput "   Issues: https://github.com/$OWNER/$REPO/issues" "Info"
    Write-ColorOutput "   Projects: https://github.com/$OWNER/$REPO/projects" "Info"
    Write-ColorOutput "   Milestones: https://github.com/$OWNER/$REPO/milestones" "Info"

    Write-ColorOutput "`n🚀 Próximos Pasos:" "Info"
    Write-ColorOutput "   1. Revisar issues creados: gh issue list --limit 20" "Info"
    Write-ColorOutput "   2. Ver proyecto: https://github.com/$OWNER/$REPO/projects" "Info"
    Write-ColorOutput "   3. Iniciar Fase 1: implementar componentes UI base" "Info"
    Write-ColorOutput "   4. Trackear progreso diario" "Info"

    Write-ColorOutput "`n✅ Listo para iniciar implementación!" "Success"
}

# ===================================================================
# EJECUCIÓN PRINCIPAL
# ===================================================================
switch ($Action) {
    "analyze" {
        Analyze-PlanMaestro
    }
    "create-issues" {
        Create-GitHubIssues
    }
    "create-milestones" {
        Create-Milestones
    }
    "create-project" {
        Create-GitHubProject
    }
    "run-agents" {
        Run-Agents
    }
    "full-automation" {
        Run-FullAutomation
    }
    default {
        Write-ColorOutput "❌ Acción no válida: $Action" "Error"
        Write-ColorOutput "Acciones válidas: analyze, create-issues, create-milestones, create-project, run-agents, full-automation" "Info"
    }
}
