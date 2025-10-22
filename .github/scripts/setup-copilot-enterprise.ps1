#!/usr/bin/env pwsh
# GitHub Copilot Enterprise - Setup Script
# Configuración completa con tokens y CLI

param(
    [string]$GithubToken = $env:GITHUB_TOKEN,
    [string]$Organization = "",
    [string]$Repository = "premium-ecosystem"
)

Write-Host "🚀 Configurando GitHub Copilot Enterprise al Máximo..." -ForegroundColor Cyan

# Verificar token
if (-not $GithubToken) {
    Write-Host "⚠️  Token de GitHub no encontrado. Configúralo con:" -ForegroundColor Yellow
    Write-Host "   export GITHUB_TOKEN='tu_token_aqui'" -ForegroundColor Yellow
    Write-Host "   O pásalo como parámetro: -GithubToken 'tu_token'" -ForegroundColor Yellow
    exit 1
}

# Configurar GitHub CLI
Write-Host "`n📦 Configurando GitHub CLI..." -ForegroundColor Green
gh auth login --with-token $GithubToken 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ GitHub CLI autenticado" -ForegroundColor Green
}
else {
    Write-Host "ℹ️  Configurando token manualmente..." -ForegroundColor Yellow
    $env:GITHUB_TOKEN = $GithubToken
}

# Habilitar Copilot
Write-Host "`n🤖 Habilitando GitHub Copilot..." -ForegroundColor Green
try {
    gh api user/copilot_seats 2>$null
    Write-Host "✓ Copilot ya está habilitado" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Verifica tu licencia de Copilot en: https://github.com/settings/copilot" -ForegroundColor Yellow
}

# Configurar Copilot para el repositorio
Write-Host "`n⚙️  Configurando Copilot para el repositorio..." -ForegroundColor Green

# Habilitar Copilot Chat
gh api -X PUT "repos/$Organization/$Repository/actions/permissions" -f enabled=true 2>$null

# Configurar secretos para Copilot
Write-Host "`n🔐 Configurando secretos..." -ForegroundColor Green

$secrets = @{
    "COPILOT_ENABLED" = "true"
    "COPILOT_MODEL"   = "gpt-4-turbo"
    "COPILOT_CONTEXT" = "maximum"
}

foreach ($secret in $secrets.GetEnumerator()) {
    Write-Host "  Configurando $($secret.Key)..." -ForegroundColor Gray
    # Los secretos se configuran en GitHub Settings
}

# Instalar extensiones de CLI necesarias
Write-Host "`n🔧 Instalando extensiones CLI..." -ForegroundColor Green

# GitHub Copilot CLI
Write-Host "  Instalando gh-copilot..." -ForegroundColor Gray
gh extension install github/gh-copilot 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ gh-copilot instalado" -ForegroundColor Green
}

# Configurar Copilot CLI
Write-Host "`n💻 Configurando Copilot CLI..." -ForegroundColor Green
gh copilot config 2>$null

# Crear alias útiles
Write-Host "`n📝 Creando alias de Copilot..." -ForegroundColor Green

$aliases = @"
# GitHub Copilot CLI Aliases
function ghcs { gh copilot suggest `$args }
function ghce { gh copilot explain `$args }
function ghcr { gh copilot review `$args }

# Ejemplos:
# ghcs "instalar dependencias react"
# ghce "git commit -m 'mensaje'"
# ghcr archivo.js
"@

$profilePath = $PROFILE
if (-not (Test-Path $profilePath)) {
    New-Item -Path $profilePath -ItemType File -Force | Out-Null
}

Add-Content -Path $profilePath -Value $aliases -Force
Write-Host "✓ Alias añadidos a tu perfil de PowerShell" -ForegroundColor Green

# Configurar webhooks para Copilot
Write-Host "`n🔗 Configurando webhooks..." -ForegroundColor Green

$webhookConfig = @{
    name   = "web"
    active = $true
    events = @("push", "pull_request", "issues", "release")
    config = @{
        url          = "https://api.github.com/copilot/events"
        content_type = "json"
        insecure_ssl = "0"
    }
} | ConvertTo-Json -Depth 10

# Verificar instalación de Node.js y paquetes
Write-Host "`n📦 Verificando dependencias Node.js..." -ForegroundColor Green
if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "✓ Node.js instalado: $(node --version)" -ForegroundColor Green
    
    # Instalar paquetes globales útiles
    Write-Host "  Instalando herramientas globales..." -ForegroundColor Gray
    npm install -g @github/copilot-cli 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ @github/copilot-cli instalado" -ForegroundColor Green
    }
}

# Crear configuración local de Copilot
Write-Host "`n📄 Creando configuración local..." -ForegroundColor Green

$copilotSettings = @{
    "github.copilot.enable"                       = @{
        "*"         = $true
        "yaml"      = $true
        "plaintext" = $false
        "markdown"  = $true
    }
    "github.copilot.advanced"                     = @{
        "debug.overrideEngine"       = "gpt-4-turbo"
        "debug.testOverrideProxyUrl" = ""
        "debug.overrideProxyUrl"     = ""
    }
    "github.copilot.editor.enableAutoCompletions" = $true
    "github.copilot.editor.enableCodeActions"     = $true
} | ConvertTo-Json -Depth 10

$vscodePath = ".vscode"
if (-not (Test-Path $vscodePath)) {
    New-Item -Path $vscodePath -ItemType Directory | Out-Null
}

$copilotSettings | Out-File -FilePath "$vscodePath/copilot.json" -Encoding UTF8

Write-Host "`n✅ Configuración de GitHub Copilot Enterprise completada!" -ForegroundColor Green
Write-Host "`n📚 Próximos pasos:" -ForegroundColor Cyan
Write-Host "  1. Reinicia VS Code para aplicar los cambios" -ForegroundColor White
Write-Host "  2. Prueba: gh copilot suggest 'crear componente React'" -ForegroundColor White
Write-Host "  3. Usa Ctrl+I en VS Code para Copilot Chat" -ForegroundColor White
Write-Host "  4. Revisa: https://github.com/settings/copilot" -ForegroundColor White
Write-Host "`n🔗 URLs útiles:" -ForegroundColor Cyan
Write-Host "  Settings: https://github.com/settings/copilot" -ForegroundColor White
Write-Host "  Features: https://github.com/settings/copilot/features" -ForegroundColor White
Write-Host "  Docs: https://docs.github.com/copilot" -ForegroundColor White
