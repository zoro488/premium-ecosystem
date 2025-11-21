#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Script de automatización para implementar componentes faltantes de FlowDistributor

.DESCRIPTION
    Este script ejecuta el agent CrewAI y automatiza la creación de componentes,
    tests y documentación para completar el Plan Maestro

.PARAMETER Action
    Acción a realizar: analyze, boilerplate, implement, implement-all, report

.PARAMETER Gap
    Gap específico a implementar (para -Action implement)

.EXAMPLE
    .\crew-ai-automation.ps1 -Action analyze
    .\crew-ai-automation.ps1 -Action boilerplate
    .\crew-ai-automation.ps1 -Action implement -Gap bancos_tabs
    .\crew-ai-automation.ps1 -Action implement-all

.NOTES
    Requiere: Python 3.10+, pip, crewai, crewai-tools
#>

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('analyze', 'boilerplate', 'implement', 'implement-all', 'report', 'setup')]
    [string]$Action,

    [Parameter(Mandatory = $false)]
    [string]$Gap = "",

    [Parameter(Mandatory = $false)]
    [switch]$VerboseMode,

    [Parameter(Mandatory = $false)]
    [switch]$DryRun
)

# ============================================================================
# CONFIGURACIÓN
# ============================================================================

$ErrorActionPreference = "Stop"
$BASE_PATH = Split-Path $PSScriptRoot -Parent
$AGENT_PATH = Join-Path $BASE_PATH ".github\agents\crew-ai-implementation-agent.py"
$VENV_PATH = Join-Path $BASE_PATH ".venv"
$PYTHON_EXE = if ($IsWindows) { Join-Path $VENV_PATH "Scripts\python.exe" } else { Join-Path $VENV_PATH "bin/python" }

# Colores
$COLOR_SUCCESS = "Green"
$COLOR_ERROR = "Red"
$COLOR_WARNING = "Yellow"
$COLOR_INFO = "Cyan"

# ============================================================================
# FUNCIONES HELPER
# ============================================================================

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Write-Banner {
    param([string]$Title)

    Write-Host ""
    Write-Host "╔══════════════════════════════════════════════════════════════════════════╗" -ForegroundColor $COLOR_INFO
    Write-Host "║                                                                          ║" -ForegroundColor $COLOR_INFO
    Write-Host "║  $($Title.PadRight(70)) ║" -ForegroundColor $COLOR_INFO
    Write-Host "║                                                                          ║" -ForegroundColor $COLOR_INFO
    Write-Host "╚══════════════════════════════════════════════════════════════════════════╝" -ForegroundColor $COLOR_INFO
    Write-Host ""
}

function Test-PythonInstalled {
    try {
        $version = python --version 2>&1
        if ($version -match "Python 3\.(\d+)") {
            $minor = [int]$Matches[1]
            if ($minor -ge 10) {
                Write-ColorOutput "✅ Python encontrado: $version" $COLOR_SUCCESS
                return $true
            }
        }
        Write-ColorOutput "⚠️  Python 3.10+ requerido, encontrado: $version" $COLOR_WARNING
        return $false
    }
    catch {
        Write-ColorOutput "❌ Python no encontrado" $COLOR_ERROR
        return $false
    }
}

function Initialize-VirtualEnv {
    Write-ColorOutput "🔧 Configurando entorno virtual Python..." $COLOR_INFO

    if (Test-Path $VENV_PATH) {
        Write-ColorOutput "✅ Virtual environment ya existe" $COLOR_SUCCESS
    }
    else {
        Write-ColorOutput "📦 Creando virtual environment..." $COLOR_INFO
        python -m venv $VENV_PATH

        if (-not (Test-Path $PYTHON_EXE)) {
            Write-ColorOutput "❌ Error creando virtual environment" $COLOR_ERROR
            exit 1
        }

        Write-ColorOutput "✅ Virtual environment creado" $COLOR_SUCCESS
    }
}

function Install-Dependencies {
    Write-ColorOutput "📦 Instalando dependencias de CrewAI..." $COLOR_INFO

    $requirements = @"
crewai>=0.28.0
crewai-tools>=0.2.0
langchain-openai>=0.0.5
python-dotenv>=1.0.0
"@

    $reqFile = Join-Path $BASE_PATH "requirements-crewai.txt"
    $requirements | Out-File -FilePath $reqFile -Encoding utf8

    & $PYTHON_EXE -m pip install --upgrade pip --quiet
    & $PYTHON_EXE -m pip install -r $reqFile --quiet

    Write-ColorOutput "✅ Dependencias instaladas" $COLOR_SUCCESS
}

function Test-EnvironmentVariables {
    Write-ColorOutput "🔍 Verificando variables de entorno..." $COLOR_INFO

    $hasOpenAI = $env:OPENAI_API_KEY -ne $null -and $env:OPENAI_API_KEY -ne ""
    $hasGitHub = $env:GITHUB_TOKEN -ne $null -and $env:GITHUB_TOKEN -ne ""

    if (-not $hasOpenAI -and -not $hasGitHub) {
        Write-ColorOutput "⚠️  No se encontró OPENAI_API_KEY ni GITHUB_TOKEN" $COLOR_WARNING
        Write-ColorOutput "    El agent necesita una API key para funcionar" $COLOR_WARNING
        Write-ColorOutput "    Configura una de estas variables:" $COLOR_INFO
        Write-ColorOutput "      - OPENAI_API_KEY (para OpenAI GPT-4)" $COLOR_INFO
        Write-ColorOutput "      - GITHUB_TOKEN (para GitHub Models)" $COLOR_INFO
        return $false
    }

    if ($hasOpenAI) {
        Write-ColorOutput "✅ OPENAI_API_KEY configurada" $COLOR_SUCCESS
    }
    if ($hasGitHub) {
        Write-ColorOutput "✅ GITHUB_TOKEN configurada" $COLOR_SUCCESS
    }

    return $true
}

function Invoke-CrewAIAgent {
    param(
        [string]$Command,
        [string]$Gap = ""
    )

    if ($DryRun) {
        Write-ColorOutput "🔍 DRY RUN: Ejecutaría: $PYTHON_EXE $AGENT_PATH $Command $Gap" $COLOR_WARNING
        return
    }

    Write-ColorOutput "🚀 Ejecutando CrewAI Agent..." $COLOR_INFO
    Write-Host ""

    if ($Gap -ne "") {
        & $PYTHON_EXE $AGENT_PATH $Command $Gap
    }
    else {
        & $PYTHON_EXE $AGENT_PATH $Command
    }

    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "❌ Error ejecutando CrewAI Agent (Exit code: $LASTEXITCODE)" $COLOR_ERROR
        exit $LASTEXITCODE
    }

    Write-Host ""
    Write-ColorOutput "✅ CrewAI Agent ejecutado exitosamente" $COLOR_SUCCESS
}

function Show-Statistics {
    Write-Banner "📊 ESTADÍSTICAS DEL PROYECTO"

    # Contar archivos
    $chronosPath = Join-Path $BASE_PATH "src\apps\FlowDistributor\chronos-system"
    $tsxFiles = (Get-ChildItem -Path $chronosPath -Filter "*.tsx" -Recurse -File).Count
    $jsxFiles = (Get-ChildItem -Path $chronosPath -Filter "*.jsx" -Recurse -File).Count
    $tsFiles = (Get-ChildItem -Path $chronosPath -Filter "*.ts" -Recurse -File -Exclude "*.d.ts").Count
    $jsFiles = (Get-ChildItem -Path $chronosPath -Filter "*.js" -Recurse -File).Count

    $totalFiles = $tsxFiles + $jsxFiles + $tsFiles + $jsFiles

    Write-ColorOutput "📁 Archivos en chronos-system:" $COLOR_INFO
    Write-ColorOutput "   - TypeScript (.tsx): $tsxFiles" $COLOR_INFO
    Write-ColorOutput "   - TypeScript (.ts):  $tsFiles" $COLOR_INFO
    Write-ColorOutput "   - JavaScript (.jsx): $jsxFiles" $COLOR_INFO
    Write-ColorOutput "   - JavaScript (.js):  $jsFiles" $COLOR_INFO
    Write-ColorOutput "   - Total: $totalFiles archivos" $COLOR_SUCCESS

    # Leer gaps del agent
    Write-Host ""
    Write-ColorOutput "🎯 Gaps Críticos Identificados:" $COLOR_INFO
    Write-ColorOutput "   1. Bancos Tabs (Prioridad CRÍTICA, Impacto 35%)" $COLOR_ERROR
    Write-ColorOutput "   2. Dashboard IA (Prioridad ALTA, Impacto 20%)" $COLOR_WARNING
    Write-ColorOutput "   3. Sistema ML (Prioridad MEDIA, Impacto 15%)" $COLOR_WARNING
    Write-ColorOutput "   4. Reportes Avanzados (Prioridad MEDIA, Impacto 10%)" $COLOR_WARNING

    Write-Host ""
    Write-ColorOutput "📈 Completitud Estimada: 65%" $COLOR_INFO
    Write-ColorOutput "🎯 Meta: 100% (+ 35% por implementar)" $COLOR_INFO
}

function New-ComponentBoilerplates {
    Write-ColorOutput "🏗️  Creando boilerplates de componentes..." $COLOR_INFO

    $componentsPath = Join-Path $BASE_PATH "src\apps\FlowDistributor\chronos-system\components"

    # Crear carpetas si no existen
    $folders = @(
        "bancos",
        "dashboard",
        "ml",
        "reports"
    )

    foreach ($folder in $folders) {
        $folderPath = Join-Path $componentsPath $folder
        if (-not (Test-Path $folderPath)) {
            New-Item -ItemType Directory -Path $folderPath -Force | Out-Null
            Write-ColorOutput "  ✅ Creada carpeta: $folder" $COLOR_SUCCESS
        }
    }

    Write-Host ""
    Invoke-CrewAIAgent -Command "boilerplate"
}

function Start-Setup {
    Write-Banner "⚙️  CONFIGURACIÓN INICIAL CREWAI"

    # 1. Verificar Python
    if (-not (Test-PythonInstalled)) {
        Write-ColorOutput "❌ Instala Python 3.10+ desde: https://www.python.org/downloads/" $COLOR_ERROR
        exit 1
    }

    # 2. Crear virtual environment
    Initialize-VirtualEnv

    # 3. Instalar dependencias
    Install-Dependencies

    # 4. Verificar variables de entorno
    if (-not (Test-EnvironmentVariables)) {
        Write-ColorOutput "⚠️  Configura las variables de entorno antes de continuar" $COLOR_WARNING
        Write-ColorOutput "    Ejemplo:" $COLOR_INFO
        Write-ColorOutput '      $env:OPENAI_API_KEY = "sk-..."' $COLOR_INFO
        Write-ColorOutput "    O crea un archivo .env en la raíz del proyecto" $COLOR_INFO
    }

    Write-Host ""
    Write-ColorOutput "✅ Setup completado exitosamente!" $COLOR_SUCCESS
    Write-Host ""
    Write-ColorOutput "📚 Próximos pasos:" $COLOR_INFO
    Write-ColorOutput "   1. Configura tu API key (OPENAI_API_KEY o GITHUB_TOKEN)" $COLOR_INFO
    Write-ColorOutput "   2. Ejecuta: .\crew-ai-automation.ps1 -Action analyze" $COLOR_INFO
    Write-ColorOutput "   3. Ejecuta: .\crew-ai-automation.ps1 -Action boilerplate" $COLOR_INFO
    Write-ColorOutput "   4. Ejecuta: .\crew-ai-automation.ps1 -Action implement -Gap bancos_tabs" $COLOR_INFO
}

# ============================================================================
# MAIN
# ============================================================================

Write-Banner "🤖 CREWAI AUTOMATION - FLOWDISTRIBUTOR"

# Verificar que existe el agent
if (-not (Test-Path $AGENT_PATH)) {
    Write-ColorOutput "❌ No se encontró el agent en: $AGENT_PATH" $COLOR_ERROR
    exit 1
}

switch ($Action) {
    'setup' {
        Start-Setup
    }

    'analyze' {
        Write-ColorOutput "📊 Analizando gaps críticos..." $COLOR_INFO
        Invoke-CrewAIAgent -Command "analyze"
        Show-Statistics
    }

    'boilerplate' {
        New-ComponentBoilerplates
    }

    'implement' {
        if ($Gap -eq "") {
            Write-ColorOutput "❌ Error: Especifica -Gap <nombre_gap>" $COLOR_ERROR
            Write-ColorOutput "   Gaps disponibles: bancos_tabs, dashboard_ia, sistema_ml, reportes_avanzados" $COLOR_INFO
            exit 1
        }

        Write-ColorOutput "🚀 Implementando gap: $Gap" $COLOR_INFO
        Invoke-CrewAIAgent -Command "implement" -Gap $Gap
    }

    'implement-all' {
        Write-ColorOutput "⚠️  ADVERTENCIA: Esto implementará TODOS los gaps (tarda mucho tiempo)" $COLOR_WARNING
        $confirm = Read-Host "¿Continuar? (s/n)"

        if ($confirm -ne 's' -and $confirm -ne 'S') {
            Write-ColorOutput "❌ Cancelado por el usuario" $COLOR_WARNING
            exit 0
        }

        Invoke-CrewAIAgent -Command "implement-all"
    }

    'report' {
        Show-Statistics
        Write-Host ""
        Invoke-CrewAIAgent -Command "report"
    }
}

Write-Host ""
Write-ColorOutput "✅ Proceso completado exitosamente" $COLOR_SUCCESS
Write-Host ""
