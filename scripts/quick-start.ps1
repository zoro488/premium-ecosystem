# ============================================
# Quick Start Script - GitHub Enterprise Pro
# Ejecuta este script para configurar todo automáticamente
# ============================================

param(
    [switch]$SkipAuth,
    [switch]$SkipExtensions,
    [switch]$SkipConfig
)

$ErrorActionPreference = "Continue"

# Colores
function Write-Title {
    param([string]$Text)
    Write-Host "`n" -NoNewline
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host " $Text" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Step {
    param([string]$Text)
    Write-Host "▶ $Text" -ForegroundColor Yellow
}

function Write-Success {
    param([string]$Text)
    Write-Host "  ✅ $Text" -ForegroundColor Green
}

function Write-Info {
    param([string]$Text)
    Write-Host "  ℹ️  $Text" -ForegroundColor Blue
}

function Write-Warning {
    param([string]$Text)
    Write-Host "  ⚠️  $Text" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Text)
    Write-Host "  ❌ $Text" -ForegroundColor Red
}

# Banner
Clear-Host
Write-Host @"

╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 GITHUB ENTERPRISE PRO - QUICK START                 ║
║                                                           ║
║   Premium Ecosystem Setup                                ║
║   Configuración completa en minutos                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

Write-Host "Este script configurará:" -ForegroundColor White
Write-Host "  ✓ GitHub CLI con autenticación" -ForegroundColor Gray
Write-Host "  ✓ Extensiones de GitHub CLI" -ForegroundColor Gray
Write-Host "  ✓ Copilot Enterprise" -ForegroundColor Gray
Write-Host "  ✓ VSCode Settings optimizados" -ForegroundColor Gray
Write-Host "  ✓ Aliases útiles" -ForegroundColor Gray
Write-Host "  ✓ Configuración de packages" -ForegroundColor Gray
Write-Host ""

$continue = Read-Host "¿Continuar? (S/N)"
if ($continue -ne "S" -and $continue -ne "s") {
    Write-Warning "Setup cancelado"
    exit
}

# ============================================
# PASO 1: Verificar prerrequisitos
# ============================================
Write-Title "PASO 1: Verificando Prerrequisitos"

Write-Step "Verificando Git..."
if (Get-Command git -ErrorAction SilentlyContinue) {
    $gitVersion = git --version
    Write-Success "Git instalado: $gitVersion"
} else {
    Write-Error "Git no está instalado. Instálalo desde: https://git-scm.com/"
    exit 1
}

Write-Step "Verificando Node.js..."
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Success "Node.js instalado: $nodeVersion"
} else {
    Write-Error "Node.js no está instalado. Instálalo desde: https://nodejs.org/"
    exit 1
}

Write-Step "Verificando GitHub CLI..."
if (Get-Command gh -ErrorAction SilentlyContinue) {
    $ghVersion = gh --version | Select-Object -First 1
    Write-Success "GitHub CLI instalado: $ghVersion"
} else {
    Write-Error "GitHub CLI no está instalado."
    Write-Info "Instalando GitHub CLI..."
    try {
        winget install --id GitHub.cli --silent
        Write-Success "GitHub CLI instalado correctamente"
    } catch {
        Write-Error "Error al instalar GitHub CLI. Instálalo manualmente desde: https://cli.github.com/"
        exit 1
    }
}

# ============================================
# PASO 2: Autenticación GitHub
# ============================================
if (-not $SkipAuth) {
    Write-Title "PASO 2: Autenticación GitHub"

    Write-Step "Verificando autenticación..."
    $authStatus = gh auth status 2>&1

    if ($LASTEXITCODE -ne 0) {
        Write-Warning "No estás autenticado en GitHub"
        Write-Info "Abriendo navegador para autenticación..."

        gh auth login --web --scopes 'repo,read:org,workflow,read:packages,write:packages,read:project,write:discussion,codespace,copilot'

        if ($LASTEXITCODE -eq 0) {
            Write-Success "Autenticación exitosa"
        } else {
            Write-Error "Error en la autenticación"
            exit 1
        }
    } else {
        Write-Success "Ya estás autenticado en GitHub"
    }
}

# ============================================
# PASO 3: Instalar Extensiones
# ============================================
if (-not $SkipExtensions) {
    Write-Title "PASO 3: Instalando Extensiones GitHub CLI"

    $extensions = @(
        @{Name="github/gh-copilot"; Desc="GitHub Copilot CLI"},
        @{Name="github/gh-actions-cache"; Desc="Actions Cache Manager"},
        @{Name="dlvhdr/gh-dash"; Desc="Dashboard Interactivo"},
        @{Name="mislav/gh-branch"; Desc="Branch Management"}
    )

    foreach ($ext in $extensions) {
        Write-Step "Instalando $($ext.Desc)..."
        gh extension install $ext.Name 2>$null

        if ($LASTEXITCODE -eq 0) {
            Write-Success "Instalado: $($ext.Name)"
        } else {
            Write-Warning "Ya instalado o error: $($ext.Name)"
        }
    }
}

# ============================================
# PASO 4: Configurar Aliases
# ============================================
if (-not $SkipConfig) {
    Write-Title "PASO 4: Configurando Aliases"

    $aliases = @(
        @{Name="co"; Command="pr checkout"; Desc="Checkout PR"},
        @{Name="pv"; Command="pr view"; Desc="Ver PR"},
        @{Name="pc"; Command="pr create --fill"; Desc="Crear PR"},
        @{Name="rv"; Command="repo view --web"; Desc="Ver repo"},
        @{Name="rl"; Command="run list"; Desc="Listar runs"},
        @{Name="rw"; Command="run watch"; Desc="Watch run"},
        @{Name="il"; Command="issue list"; Desc="Listar issues"},
        @{Name="ic"; Command="issue create --web"; Desc="Crear issue"}
    )

    foreach ($alias in $aliases) {
        gh alias set $alias.Name $alias.Command 2>$null
        Write-Success "$($alias.Name) -> $($alias.Desc)"
    }
}

# ============================================
# PASO 5: Configurar NPM para GitHub Packages
# ============================================
if (-not $SkipConfig) {
    Write-Title "PASO 5: Configurando GitHub Packages"

    if (Test-Path ".npmrc") {
        Write-Warning ".npmrc ya existe"
        $overwrite = Read-Host "¿Sobrescribir? (S/N)"
        if ($overwrite -ne "S" -and $overwrite -ne "s") {
            Write-Info "Manteniendo .npmrc actual"
        } else {
            Copy-Item ".npmrc.example" ".npmrc" -Force
            Write-Success ".npmrc creado desde ejemplo"
            Write-Warning "IMPORTANTE: Edita .npmrc y añade tu GitHub token"
        }
    } else {
        Copy-Item ".npmrc.example" ".npmrc"
        Write-Success ".npmrc creado desde ejemplo"
        Write-Warning "IMPORTANTE: Edita .npmrc y añade tu GitHub token"
    }
}

# ============================================
# PASO 6: Instalar dependencias del proyecto
# ============================================
Write-Title "PASO 6: Instalando Dependencias del Proyecto"

Write-Step "Ejecutando npm install..."
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Success "Dependencias instaladas correctamente"
} else {
    Write-Warning "Error al instalar dependencias (no crítico)"
}

# ============================================
# PASO 7: Verificar configuración de VSCode
# ============================================
Write-Title "PASO 7: Configuración de VSCode"

if (Test-Path ".vscode\settings.enterprise.json") {
    Write-Info "Configuración enterprise disponible en: .vscode\settings.enterprise.json"

    $useEnterprise = Read-Host "¿Usar configuración enterprise? (S/N)"
    if ($useEnterprise -eq "S" -or $useEnterprise -eq "s") {
        if (Test-Path ".vscode\settings.json") {
            Copy-Item ".vscode\settings.json" ".vscode\settings.json.backup"
            Write-Success "Backup creado: .vscode\settings.json.backup"
        }

        Copy-Item ".vscode\settings.enterprise.json" ".vscode\settings.json" -Force
        Write-Success "Configuración enterprise aplicada"
    }
} else {
    Write-Warning "Archivo enterprise no encontrado"
}

# ============================================
# RESUMEN FINAL
# ============================================
Write-Title "✅ SETUP COMPLETADO"

Write-Host @"

Tu entorno GitHub Enterprise Pro está listo! 🎉

📚 Próximos pasos:

1. Edita .npmrc con tu GitHub token:
   ${PWD}\.npmrc

2. Lee la guía completa:
   ${PWD}\GITHUB_ENTERPRISE_SETUP.md

3. Prueba los aliases:
   gh co, gh pv, gh pc, gh rv, etc.

4. Usa el script de automatización:
   .\scripts\gh-cli-automation.ps1 -Action all

5. Abre VSCode y verifica que Copilot funcione

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 Comandos rápidos:

  gh copilot suggest "tu pregunta"     # Copilot CLI
  gh dash                               # Dashboard
  .\scripts\gh-cli-automation.ps1      # Automatización
  npm run dev                           # Iniciar desarrollo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Problemas? Revisa GITHUB_ENTERPRISE_SETUP.md

"@ -ForegroundColor White

Write-Host "¡Feliz desarrollo! 💻" -ForegroundColor Cyan
Write-Host ""
