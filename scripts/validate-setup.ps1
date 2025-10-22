# ============================================
# VALIDATE SETUP - Verificación Ultra Completa
# Verifica que TODA la configuración esté correcta
# ============================================

param(
    [switch]$Fix,
    [switch]$Detailed
)

$ErrorActionPreference = "Continue"

# Colores
function Write-Header {
    param([string]$Text)
    Write-Host "`n" -NoNewline
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host " $Text" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
}

function Write-Check {
    param([string]$Text, [bool]$Status, [string]$Details = "")
    if ($Status) {
        Write-Host "  ✅ $Text" -ForegroundColor Green
        if ($Detailed -and $Details) {
            Write-Host "     $Details" -ForegroundColor Gray
        }
    } else {
        Write-Host "  ❌ $Text" -ForegroundColor Red
        if ($Details) {
            Write-Host "     $Details" -ForegroundColor Yellow
        }
    }
}

function Write-Section {
    param([string]$Text)
    Write-Host "`n▶ $Text" -ForegroundColor Yellow
}

# Banner
Clear-Host
Write-Host @"

╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🔍 VALIDACIÓN DE CONFIGURACIÓN ULTRA                   ║
║                                                           ║
║   Verificando GitHub Enterprise Pro Setup               ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

$totalChecks = 0
$passedChecks = 0

# ============================================
# 1. PREREQUISITOS
# ============================================
Write-Header "1. PREREQUISITOS"

Write-Section "Verificando herramientas esenciales"

# Git
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
$gitVersion = if ($gitInstalled) { git --version } else { "No instalado" }
Write-Check "Git instalado" ($null -ne $gitInstalled) $gitVersion
$totalChecks++
if ($gitInstalled) { $passedChecks++ }

# Node.js
$nodeInstalled = Get-Command node -ErrorAction SilentlyContinue
$nodeVersion = if ($nodeInstalled) { node --version } else { "No instalado" }
Write-Check "Node.js instalado" ($null -ne $nodeInstalled) $nodeVersion
$totalChecks++
if ($nodeInstalled) { $passedChecks++ }

# NPM
$npmInstalled = Get-Command npm -ErrorAction SilentlyContinue
$npmVersion = if ($npmInstalled) { npm --version } else { "No instalado" }
Write-Check "NPM instalado" ($null -ne $npmInstalled) "v$npmVersion"
$totalChecks++
if ($npmInstalled) { $passedChecks++ }

# GitHub CLI
$ghInstalled = Get-Command gh -ErrorAction SilentlyContinue
$ghVersion = if ($ghInstalled) { (gh --version | Select-Object -First 1) } else { "No instalado" }
Write-Check "GitHub CLI instalado" ($null -ne $ghInstalled) $ghVersion
$totalChecks++
if ($ghInstalled) { $passedChecks++ }

# ============================================
# 2. GITHUB CLI & AUTENTICACIÓN
# ============================================
Write-Header "2. GITHUB CLI & AUTENTICACIÓN"

if ($ghInstalled) {
    Write-Section "Verificando autenticación GitHub"

    $authStatus = gh auth status 2>&1
    $isAuthenticated = $LASTEXITCODE -eq 0
    Write-Check "GitHub CLI autenticado" $isAuthenticated
    $totalChecks++
    if ($isAuthenticated) { $passedChecks++ }

    if ($isAuthenticated) {
        # Verificar scopes
        $hasScopes = $authStatus -match "repo.*workflow.*packages"
        Write-Check "Scopes necesarios configurados" $hasScopes "repo, workflow, packages, etc."
        $totalChecks++
        if ($hasScopes) { $passedChecks++ }
    }

    Write-Section "Verificando extensiones GitHub CLI"

    $extensions = gh extension list 2>&1

    $copilotExt = $extensions -match "github/gh-copilot"
    Write-Check "gh-copilot extension" $copilotExt
    $totalChecks++
    if ($copilotExt) { $passedChecks++ }

    $dashExt = $extensions -match "dlvhdr/gh-dash"
    Write-Check "gh-dash extension" $dashExt
    $totalChecks++
    if ($dashExt) { $passedChecks++ }
}

# ============================================
# 3. ARCHIVOS DE CONFIGURACIÓN
# ============================================
Write-Header "3. ARCHIVOS DE CONFIGURACIÓN"

Write-Section "Verificando archivos VSCode"

$vscodeFiles = @(
    @{Path=".vscode/settings.json"; Name="Settings básico"},
    @{Path=".vscode/settings.enterprise.json"; Name="Settings Enterprise"},
    @{Path=".vscode/settings.copilot.json"; Name="Settings Copilot"},
    @{Path=".vscode/extensions.json"; Name="Extensions"},
    @{Path=".vscode/extensions.recommended.json"; Name="Extensions Recommended"},
    @{Path=".vscode/launch.json"; Name="Launch configs"},
    @{Path=".vscode/tasks.json"; Name="Tasks"},
    @{Path=".vscode/keybindings.json"; Name="Keybindings"},
    @{Path=".vscode/snippets.code-snippets"; Name="Snippets"}
)

foreach ($file in $vscodeFiles) {
    $exists = Test-Path $file.Path
    Write-Check $file.Name $exists $file.Path
    $totalChecks++
    if ($exists) { $passedChecks++ }
}

Write-Section "Verificando archivos de herramientas"

$toolFiles = @(
    @{Path=".prettierrc.json"; Name="Prettier config"},
    @{Path=".editorconfig"; Name="EditorConfig"},
    @{Path=".eslintrc.ultra.json"; Name="ESLint Ultra"},
    @{Path=".commitlintrc.json"; Name="CommitLint"},
    @{Path=".npmrc.example"; Name="NPM config example"}
)

foreach ($file in $toolFiles) {
    $exists = Test-Path $file.Path
    Write-Check $file.Name $exists $file.Path
    $totalChecks++
    if ($exists) { $passedChecks++ }
}

Write-Section "Verificando archivos GitHub"

$githubFiles = @(
    @{Path=".github/workflows/advanced-ci.yml"; Name="Advanced CI"},
    @{Path=".github/workflows/codeql-analysis.yml"; Name="CodeQL Analysis"},
    @{Path=".github/workflows/project-automation.yml"; Name="Project Automation"},
    @{Path=".github/workflows/publish-package.yml"; Name="Publish Package"},
    @{Path=".github/codeql/codeql-config.yml"; Name="CodeQL Config"},
    @{Path=".github/dependency-review-config.yml"; Name="Dependency Review"},
    @{Path=".github/copilot-instructions.md"; Name="Copilot Instructions"}
)

foreach ($file in $githubFiles) {
    $exists = Test-Path $file.Path
    Write-Check $file.Name $exists $file.Path
    $totalChecks++
    if ($exists) { $passedChecks++ }
}

Write-Section "Verificando DevContainer"

$devcontainerFiles = @(
    @{Path=".devcontainer/devcontainer.json"; Name="DevContainer básico"},
    @{Path=".devcontainer/devcontainer.enterprise.json"; Name="DevContainer Enterprise"}
)

foreach ($file in $devcontainerFiles) {
    $exists = Test-Path $file.Path
    Write-Check $file.Name $exists $file.Path
    $totalChecks++
    if ($exists) { $passedChecks++ }
}

Write-Section "Verificando scripts"

$scriptFiles = @(
    @{Path="scripts/setup-github-enterprise.ps1"; Name="Setup GitHub Enterprise"},
    @{Path="scripts/gh-cli-automation.ps1"; Name="CLI Automation (Windows)"},
    @{Path="scripts/gh-cli-automation.sh"; Name="CLI Automation (Linux/Mac)"},
    @{Path="scripts/quick-start.ps1"; Name="Quick Start"}
)

foreach ($file in $scriptFiles) {
    $exists = Test-Path $file.Path
    Write-Check $file.Name $exists $file.Path
    $totalChecks++
    if ($exists) { $passedChecks++ }
}

Write-Section "Verificando documentación"

$docFiles = @(
    @{Path="GITHUB_ENTERPRISE_SETUP.md"; Name="Setup Guide"},
    @{Path="CONFIGURACION_COMPLETA.md"; Name="Config Summary"},
    @{Path="ULTRA_CONFIGURATION_GUIDE.md"; Name="Ultra Guide"}
)

foreach ($file in $docFiles) {
    $exists = Test-Path $file.Path
    Write-Check $file.Name $exists $file.Path
    $totalChecks++
    if ($exists) { $passedChecks++ }
}

# ============================================
# 4. NPM & DEPENDENCIAS
# ============================================
Write-Header "4. NPM & DEPENDENCIAS"

if ($npmInstalled) {
    Write-Section "Verificando package.json"

    $packageExists = Test-Path "package.json"
    Write-Check "package.json existe" $packageExists
    $totalChecks++
    if ($packageExists) { $passedChecks++ }

    if ($packageExists) {
        $package = Get-Content "package.json" -Raw | ConvertFrom-Json

        $hasScripts = $null -ne $package.scripts
        Write-Check "Scripts configurados" $hasScripts
        $totalChecks++
        if ($hasScripts) { $passedChecks++ }

        $hasDevDeps = $null -ne $package.devDependencies
        Write-Check "DevDependencies configuradas" $hasDevDeps
        $totalChecks++
        if ($hasDevDeps) { $passedChecks++ }
    }

    Write-Section "Verificando node_modules"

    $nodeModulesExists = Test-Path "node_modules"
    Write-Check "node_modules existe" $nodeModulesExists "Ejecuta: npm install"
    $totalChecks++
    if ($nodeModulesExists) { $passedChecks++ }
}

# ============================================
# 5. GIT CONFIGURATION
# ============================================
Write-Header "5. GIT CONFIGURATION"

if ($gitInstalled) {
    Write-Section "Verificando configuración Git"

    $gitUser = git config user.name
    Write-Check "Git user.name configurado" ($null -ne $gitUser) $gitUser
    $totalChecks++
    if ($null -ne $gitUser) { $passedChecks++ }

    $gitEmail = git config user.email
    Write-Check "Git user.email configurado" ($null -ne $gitEmail) $gitEmail
    $totalChecks++
    if ($null -ne $gitEmail) { $passedChecks++ }

    Write-Section "Verificando repositorio Git"

    $isGitRepo = Test-Path ".git"
    Write-Check "Es un repositorio Git" $isGitRepo
    $totalChecks++
    if ($isGitRepo) { $passedChecks++ }

    if ($isGitRepo) {
        $hasRemote = (git remote) -ne $null
        Write-Check "Tiene remote configurado" $hasRemote
        $totalChecks++
        if ($hasRemote) { $passedChecks++ }
    }
}

# ============================================
# 6. VALIDACIÓN DE JSON
# ============================================
Write-Header "6. VALIDACIÓN DE SINTAXIS JSON"

Write-Section "Verificando sintaxis de archivos JSON"

$jsonFiles = @(
    ".vscode/settings.json",
    ".vscode/settings.enterprise.json",
    ".vscode/settings.copilot.json",
    ".vscode/extensions.json",
    ".vscode/extensions.recommended.json",
    ".vscode/launch.json",
    ".vscode/tasks.json",
    ".prettierrc.json",
    ".eslintrc.ultra.json",
    ".commitlintrc.json",
    "package.json"
)

foreach ($jsonFile in $jsonFiles) {
    if (Test-Path $jsonFile) {
        try {
            $null = Get-Content $jsonFile -Raw | ConvertFrom-Json
            Write-Check "Sintaxis correcta: $jsonFile" $true
            $totalChecks++
            $passedChecks++
        } catch {
            Write-Check "Sintaxis correcta: $jsonFile" $false "Error: $($_.Exception.Message)"
            $totalChecks++
        }
    }
}

# ============================================
# RESUMEN FINAL
# ============================================
Write-Header "RESUMEN FINAL"

$percentage = [math]::Round(($passedChecks / $totalChecks) * 100, 2)

Write-Host ""
Write-Host "  Total de checks: $totalChecks" -ForegroundColor White
Write-Host "  Checks pasados: $passedChecks" -ForegroundColor Green
Write-Host "  Checks fallidos: $($totalChecks - $passedChecks)" -ForegroundColor Red
Write-Host "  Porcentaje: $percentage%" -ForegroundColor $(if ($percentage -ge 90) { "Green" } elseif ($percentage -ge 70) { "Yellow" } else { "Red" })
Write-Host ""

if ($percentage -ge 90) {
    Write-Host @"

╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ✅ CONFIGURACIÓN EXCELENTE                             ║
║                                                           ║
║   Tu setup está al $percentage% - Listo para usar!          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

"@ -ForegroundColor Green
} elseif ($percentage -ge 70) {
    Write-Host @"

╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ⚠️  CONFIGURACIÓN PARCIAL                              ║
║                                                           ║
║   Tu setup está al $percentage% - Revisa los items ❌       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

"@ -ForegroundColor Yellow
} else {
    Write-Host @"

╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ❌ CONFIGURACIÓN INCOMPLETA                            ║
║                                                           ║
║   Tu setup está al $percentage% - Ejecuta quick-start.ps1   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

"@ -ForegroundColor Red
}

# Recomendaciones
if ($percentage -lt 100) {
    Write-Host "`nRECOMENDACIONES:" -ForegroundColor Yellow
    Write-Host ""

    if (-not $ghInstalled) {
        Write-Host "  • Instala GitHub CLI: winget install --id GitHub.cli" -ForegroundColor White
    }

    if ($ghInstalled -and -not $isAuthenticated) {
        Write-Host "  • Autentica GitHub CLI: gh auth login" -ForegroundColor White
    }

    if (-not $nodeModulesExists) {
        Write-Host "  • Instala dependencias: npm install" -ForegroundColor White
    }

    Write-Host "  • Ejecuta setup completo: .\scripts\quick-start.ps1" -ForegroundColor White
    Write-Host "  • Lee la guía: ULTRA_CONFIGURATION_GUIDE.md" -ForegroundColor White
}

Write-Host ""
Write-Host "Para más ayuda, revisa:" -ForegroundColor Cyan
Write-Host "  • ULTRA_CONFIGURATION_GUIDE.md" -ForegroundColor Gray
Write-Host "  • GITHUB_ENTERPRISE_SETUP.md" -ForegroundColor Gray
Write-Host "  • CONFIGURACION_COMPLETA.md" -ForegroundColor Gray
Write-Host ""
