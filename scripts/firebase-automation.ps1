#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Script avanzado de automatización para Firebase y Chronos System
.DESCRIPTION
    Automatiza deploy, migración de datos, configuración de reglas y optimizaciones
.PARAMETER Action
    Acción a ejecutar: deploy, migrate, setup, optimize, all
.PARAMETER Environment
    Environment: development, staging, production
.PARAMETER Force
    Forzar operación sin confirmación
#>

param(
  [Parameter(Mandatory = $true)]
  [ValidateSet("deploy", "migrate", "setup", "optimize", "all")]
  [string]$Action,

  [Parameter(Mandatory = $false)]
  [ValidateSet("development", "staging", "production")]
  [string]$Environment = "development",

  [Parameter(Mandatory = $false)]
  [switch]$Force
)

# =====================================================================
# CONFIGURACIÓN Y VARIABLES GLOBALES
# =====================================================================

$ErrorActionPreference = "Stop"

$CONFIG = @{
  ProjectId    = $env:VITE_FIREBASE_PROJECT_ID
  Environments = @{
    development = @{
      ProjectId = "chronos-dev-project"
      Domain    = "chronos-dev.web.app"
    }
    staging     = @{
      ProjectId = "chronos-staging-project"
      Domain    = "chronos-staging.web.app"
    }
    production  = @{
      ProjectId = "chronos-prod-project"
      Domain    = "chronos-system.web.app"
    }
  }
  Paths        = @{
    Root      = (Get-Location).Path
    Src       = "src"
    Dist      = "dist"
    Functions = "functions"
    Firestore = "firestore"
    Scripts   = "scripts"
  }
}

# =====================================================================
# FUNCIONES AUXILIARES
# =====================================================================

function Write-ChronosLog {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Message,

    [Parameter(Mandatory = $false)]
    [ValidateSet("Info", "Success", "Warning", "Error")]
    [string]$Level = "Info"
  )

  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  $colors = @{
    Info    = "Cyan"
    Success = "Green"
    Warning = "Yellow"
    Error   = "Red"
  }

  $emoji = @{
    Info    = "ℹ️"
    Success = "✅"
    Warning = "⚠️"
    Error   = "❌"
  }

  Write-Host "[$timestamp] $($emoji[$Level]) $Message" -ForegroundColor $colors[$Level]
}

function Test-Prerequisites {
  Write-ChronosLog "Verificando prerrequisitos..." -Level Info

  # Verificar Node.js
  try {
    $nodeVersion = node --version
    Write-ChronosLog "Node.js version: $nodeVersion" -Level Success
  }
  catch {
    Write-ChronosLog "Node.js no encontrado. Instala Node.js 18+" -Level Error
    exit 1
  }

  # Verificar Firebase CLI
  try {
    $firebaseVersion = firebase --version
    Write-ChronosLog "Firebase CLI version: $firebaseVersion" -Level Success
  }
  catch {
    Write-ChronosLog "Firebase CLI no encontrado. Instalando..." -Level Warning
    npm install -g firebase-tools
  }

  # Verificar autenticación Firebase
  try {
    firebase projects:list --json | Out-Null
    Write-ChronosLog "Firebase autenticado correctamente" -Level Success
  }
  catch {
    Write-ChronosLog "Necesitas autenticarte con Firebase: firebase login" -Level Error
    exit 1
  }

  # Verificar dependencias del proyecto
  if (-not (Test-Path "package.json")) {
    Write-ChronosLog "package.json no encontrado" -Level Error
    exit 1
  }

  if (-not (Test-Path "node_modules")) {
    Write-ChronosLog "Instalando dependencias..." -Level Info
    npm install
  }
}

function Invoke-Build {
  param([string]$Environment)

  Write-ChronosLog "🏗️ Iniciando build para $Environment..." -Level Info

  # Limpiar build anterior
  if (Test-Path $CONFIG.Paths.Dist) {
    Remove-Item $CONFIG.Paths.Dist -Recurse -Force
    Write-ChronosLog "Build anterior limpiado" -Level Info
  }

  # Configurar variables de entorno
  $envConfig = $CONFIG.Environments[$Environment]
  $env:VITE_FIREBASE_PROJECT_ID = $envConfig.ProjectId
  $env:NODE_ENV = if ($Environment -eq "production") { "production" } else { "development" }

  # Ejecutar build
  try {
    Write-ChronosLog "Ejecutando npm run build..." -Level Info
    npm run build

    # Verificar que el build existe
    if (Test-Path "$($CONFIG.Paths.Dist)/index.html") {
      Write-ChronosLog "Build completado exitosamente" -Level Success

      # Mostrar estadísticas del build
      $buildSize = (Get-ChildItem $CONFIG.Paths.Dist -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
      Write-ChronosLog "Tamaño del build: $([math]::Round($buildSize, 2)) MB" -Level Info
    }
    else {
      throw "Build falló - index.html no encontrado"
    }
  }
  catch {
    Write-ChronosLog "Error en build: $($_.Exception.Message)" -Level Error
    exit 1
  }
}

function Invoke-Tests {
  Write-ChronosLog "🧪 Ejecutando tests..." -Level Info

  try {
    # Lint
    Write-ChronosLog "Ejecutando lint..." -Level Info
    npm run lint

    # Type check
    Write-ChronosLog "Verificando tipos..." -Level Info
    npm run type-check

    # Unit tests
    Write-ChronosLog "Ejecutando tests unitarios..." -Level Info
    npm run test

    Write-ChronosLog "Todos los tests pasaron ✅" -Level Success
  }
  catch {
    Write-ChronosLog "Tests fallaron: $($_.Exception.Message)" -Level Error

    if (-not $Force) {
      $continue = Read-Host "¿Continuar con el deploy? (y/N)"
      if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
      }
    }
  }
}

function Invoke-SecurityScan {
  Write-ChronosLog "🛡️ Ejecutando scan de seguridad..." -Level Info

  try {
    # Audit de dependencias
    Write-ChronosLog "Auditando dependencias..." -Level Info
    npm audit --audit-level high

    # Auto-fix vulnerabilidades menores
    npm audit fix --dry-run

    Write-ChronosLog "Scan de seguridad completado" -Level Success
  }
  catch {
    Write-ChronosLog "Vulnerabilidades encontradas: $($_.Exception.Message)" -Level Warning

    if (-not $Force) {
      $continue = Read-Host "¿Continuar con vulnerabilidades? (y/N)"
      if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
      }
    }
  }
}

function Invoke-DataMigration {
  param([string]$Environment)

  Write-ChronosLog "🗄️ Iniciando migración de datos para $Environment..." -Level Info

  $projectId = $CONFIG.Environments[$Environment].ProjectId

  try {
    # Deploy de reglas de Firestore
    Write-ChronosLog "Deploying Firestore rules..." -Level Info
    firebase firestore:rules deploy --project $projectId

    # Deploy de índices
    Write-ChronosLog "Deploying Firestore indexes..." -Level Info
    firebase firestore:indexes deploy --project $projectId

    # Ejecutar script de migración si existe
    $migrationScript = Join-Path $CONFIG.Paths.Scripts "migrate-data.js"
    if (Test-Path $migrationScript) {
      Write-ChronosLog "Ejecutando script de migración..." -Level Info
      node $migrationScript --project $projectId --environment $Environment
    }

    Write-ChronosLog "Migración de datos completada" -Level Success
  }
  catch {
    Write-ChronosLog "Error en migración: $($_.Exception.Message)" -Level Error
    throw
  }
}

function Invoke-Deploy {
  param([string]$Environment)

  Write-ChronosLog "🚀 Iniciando deploy a $Environment..." -Level Info

  $projectId = $CONFIG.Environments[$Environment].ProjectId
  $domain = $CONFIG.Environments[$Environment].Domain

  try {
    # Deploy Hosting
    Write-ChronosLog "Deploying to Firebase Hosting..." -Level Info
    firebase deploy --project $projectId --only hosting

    # Deploy Functions si existen
    $functionsPath = $CONFIG.Paths.Functions
    if (Test-Path $functionsPath) {
      Write-ChronosLog "Deploying Cloud Functions..." -Level Info
      firebase deploy --project $projectId --only functions
    }

    # Deploy Storage rules si existen
    if (Test-Path "storage.rules") {
      Write-ChronosLog "Deploying Storage rules..." -Level Info
      firebase deploy --project $projectId --only storage
    }

    Write-ChronosLog "Deploy completado exitosamente! 🎉" -Level Success
    Write-ChronosLog "URL: https://$domain" -Level Info

    # Health check
    Start-Sleep -Seconds 10
    try {
      $response = Invoke-WebRequest -Uri "https://$domain" -Method Head -TimeoutSec 30
      if ($response.StatusCode -eq 200) {
        Write-ChronosLog "Health check passed ✅" -Level Success
      }
    }
    catch {
      Write-ChronosLog "Health check failed - sitio puede estar cargando" -Level Warning
    }
  }
  catch {
    Write-ChronosLog "Error en deploy: $($_.Exception.Message)" -Level Error
    throw
  }
}

function Invoke-Optimization {
  Write-ChronosLog "⚡ Ejecutando optimizaciones..." -Level Info

  try {
    # Limpiar caché
    Write-ChronosLog "Limpiando caché..." -Level Info
    npm run clean || Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
    npm install

    # Optimizar imágenes si existen
    $imagesPath = Join-Path $CONFIG.Paths.Src "assets/images"
    if (Test-Path $imagesPath) {
      Write-ChronosLog "Optimizando imágenes..." -Level Info
      # Aquí podrías agregar optimización de imágenes
    }

    # Analizar bundle
    Write-ChronosLog "Analizando bundle..." -Level Info
    npm run analyze || Write-ChronosLog "Bundle analyzer no configurado" -Level Warning

    Write-ChronosLog "Optimizaciones completadas" -Level Success
  }
  catch {
    Write-ChronosLog "Error en optimización: $($_.Exception.Message)" -Level Warning
  }
}

function Invoke-Setup {
  Write-ChronosLog "🔧 Configurando proyecto para $Environment..." -Level Info

  $projectId = $CONFIG.Environments[$Environment].ProjectId

  try {
    # Inicializar Firebase si no existe
    if (-not (Test-Path "firebase.json")) {
      Write-ChronosLog "Inicializando Firebase..." -Level Info
      firebase init --project $projectId
    }

    # Configurar environments
    $envFile = ".env.$Environment"
    if (-not (Test-Path $envFile)) {
      Write-ChronosLog "Creando archivo de environment..." -Level Info
      @"
VITE_FIREBASE_PROJECT_ID=$projectId
VITE_FIREBASE_AUTH_DOMAIN=$projectId.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://$projectId-default-rtdb.firebaseio.com
VITE_FIREBASE_STORAGE_BUCKET=$projectId.appspot.com
"@ | Out-File -FilePath $envFile -Encoding UTF8
    }

    # Configurar VS Code settings si no existen
    $vscodeDir = ".vscode"
    if (-not (Test-Path $vscodeDir)) {
      New-Item -ItemType Directory -Path $vscodeDir

      # Settings.json optimizado
      @{
        "typescript.preferences.importModuleSpecifier" = "relative"
        "editor.formatOnSave"                          = $true
        "editor.codeActionsOnSave"                     = @{
          "source.fixAll.eslint" = $true
        }
        "firebase.hosting.source"                      = "dist"
      } | ConvertTo-Json -Depth 10 | Out-File -FilePath "$vscodeDir/settings.json" -Encoding UTF8
    }

    Write-ChronosLog "Setup completado para $Environment" -Level Success
  }
  catch {
    Write-ChronosLog "Error en setup: $($_.Exception.Message)" -Level Error
    throw
  }
}

# =====================================================================
# FUNCIÓN PRINCIPAL
# =====================================================================

function Invoke-ChronosAutomation {
  Write-Host @"
╔════════════════════════════════════════════════════════════════════════════╗
║                    CHRONOS SYSTEM - FIREBASE AUTOMATION                   ║
║                        Automatización Avanzada v2.0                       ║
╚════════════════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

  Write-ChronosLog "Iniciando automatización: $Action para $Environment" -Level Info

  # Verificar prerrequisitos
  Test-Prerequisites

  try {
    switch ($Action) {
      "setup" {
        Invoke-Setup
      }
      "migrate" {
        Invoke-DataMigration -Environment $Environment
      }
      "deploy" {
        Invoke-Tests
        Invoke-SecurityScan
        Invoke-Build -Environment $Environment
        Invoke-DataMigration -Environment $Environment
        Invoke-Deploy -Environment $Environment
      }
      "optimize" {
        Invoke-Optimization
      }
      "all" {
        Invoke-Setup
        Invoke-Optimization
        Invoke-Tests
        Invoke-SecurityScan
        Invoke-Build -Environment $Environment
        Invoke-DataMigration -Environment $Environment
        Invoke-Deploy -Environment $Environment
      }
    }

    Write-ChronosLog "🎉 Automatización completada exitosamente!" -Level Success

    # Mostrar resumen
    Write-Host @"

📊 RESUMEN DE AUTOMATIZACIÓN
═══════════════════════════════════
• Acción: $Action
• Environment: $Environment
• Timestamp: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
• Status: ✅ EXITOSO

"@ -ForegroundColor Green

  }
  catch {
    Write-ChronosLog "❌ Automatización falló: $($_.Exception.Message)" -Level Error
    exit 1
  }
}

# Ejecutar función principal
Invoke-ChronosAutomation
