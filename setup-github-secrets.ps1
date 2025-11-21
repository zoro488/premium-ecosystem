#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Configura automáticamente los GitHub Secrets desde el archivo .env

.DESCRIPTION
    Este script lee las variables de entorno del archivo .env y las configura
    como secrets en GitHub usando GitHub CLI (gh).

.NOTES
    Requisitos:
    - GitHub CLI (gh) instalado
    - Autenticado con: gh auth login
    - Archivo .env con las variables de Firebase
    - serviceAccountKey.json (opcional)
#>

param(
    [switch]$DryRun,
    [switch]$Force
)

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   🔐 CONFIGURACIÓN AUTOMÁTICA DE GITHUB SECRETS              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Verificar que GitHub CLI está instalado
Write-Host "🔍 Verificando requisitos..." -ForegroundColor Yellow
try {
    $ghVersion = gh --version 2>&1 | Select-Object -First 1
    Write-Host "   ✅ GitHub CLI instalado: $ghVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ GitHub CLI no está instalado" -ForegroundColor Red
    Write-Host "`n💡 Instala GitHub CLI:" -ForegroundColor Yellow
    Write-Host "   winget install GitHub.cli" -ForegroundColor Cyan
    Write-Host "   O descarga desde: https://cli.github.com/`n" -ForegroundColor Cyan
    exit 1
}

# Verificar autenticación
Write-Host "🔍 Verificando autenticación..." -ForegroundColor Yellow
try {
    $authStatus = gh auth status 2>&1
    if ($authStatus -match "Logged in") {
        Write-Host "   ✅ Autenticado en GitHub" -ForegroundColor Green
    } else {
        throw "No autenticado"
    }
} catch {
    Write-Host "   ❌ No estás autenticado en GitHub" -ForegroundColor Red
    Write-Host "`n💡 Autentica con:" -ForegroundColor Yellow
    Write-Host "   gh auth login`n" -ForegroundColor Cyan
    exit 1
}

# Leer archivo .env
Write-Host "📄 Leyendo archivo .env..." -ForegroundColor Yellow
$envFile = ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "   ❌ Archivo .env no encontrado" -ForegroundColor Red
    exit 1
}

$envVars = @{}
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^VITE_FIREBASE_(.+)=(.+)$') {
        $key = "VITE_FIREBASE_$($matches[1])"
        $value = $matches[2]
        $envVars[$key] = $value
    }
}

Write-Host "   ✅ Encontradas $($envVars.Count) variables de Firebase" -ForegroundColor Green

# Verificar serviceAccountKey.json
$serviceAccountPath = "serviceAccountKey.json"
$hasServiceAccount = Test-Path $serviceAccountPath

if ($hasServiceAccount) {
    Write-Host "   ✅ serviceAccountKey.json encontrado" -ForegroundColor Green
    $serviceAccountJson = Get-Content $serviceAccountPath -Raw
} else {
    Write-Host "   ⚠️  serviceAccountKey.json NO encontrado" -ForegroundColor Yellow
    Write-Host "      Este secret deberá configurarse manualmente" -ForegroundColor Gray
}

# Obtener nombre del repositorio
$repoInfo = gh repo view --json nameWithOwner -q .nameWithOwner
Write-Host "`n📦 Repositorio: $repoInfo" -ForegroundColor Cyan

# Secrets a configurar
$secretsToSet = @(
    @{
        Name = "VITE_FIREBASE_API_KEY"
        Value = $envVars["VITE_FIREBASE_API_KEY"]
        Required = $true
    },
    @{
        Name = "VITE_FIREBASE_AUTH_DOMAIN"
        Value = $envVars["VITE_FIREBASE_AUTH_DOMAIN"]
        Required = $true
    },
    @{
        Name = "VITE_FIREBASE_PROJECT_ID"
        Value = $envVars["VITE_FIREBASE_PROJECT_ID"]
        Required = $true
    },
    @{
        Name = "VITE_FIREBASE_STORAGE_BUCKET"
        Value = $envVars["VITE_FIREBASE_STORAGE_BUCKET"]
        Required = $true
    },
    @{
        Name = "VITE_FIREBASE_MESSAGING_SENDER_ID"
        Value = $envVars["VITE_FIREBASE_MESSAGING_SENDER_ID"]
        Required = $true
    },
    @{
        Name = "VITE_FIREBASE_APP_ID"
        Value = $envVars["VITE_FIREBASE_APP_ID"]
        Required = $true
    }
)

if ($hasServiceAccount) {
    $secretsToSet += @{
        Name = "FIREBASE_SERVICE_ACCOUNT"
        Value = $serviceAccountJson
        Required = $true
    }
}

Write-Host "`n🔐 Secrets a configurar: $($secretsToSet.Count)" -ForegroundColor Yellow

if ($DryRun) {
    Write-Host "`n⚠️  MODO DRY RUN - No se configurará nada`n" -ForegroundColor Yellow
    foreach ($secret in $secretsToSet) {
        $valuePreview = if ($secret.Value.Length -gt 20) {
            $secret.Value.Substring(0, 20) + "..."
        } else {
            $secret.Value
        }
        Write-Host "   [DRY-RUN] $($secret.Name) = $valuePreview" -ForegroundColor Gray
    }
    exit 0
}

# Configurar secrets
Write-Host "`n🚀 Configurando secrets en GitHub...`n" -ForegroundColor Green

$successCount = 0
$failCount = 0

foreach ($secret in $secretsToSet) {
    try {
        Write-Host "   🔧 Configurando: $($secret.Name)..." -NoNewline

        # Usar gh secret set
        $secret.Value | gh secret set $secret.Name

        Write-Host " ✅" -ForegroundColor Green
        $successCount++
    } catch {
        Write-Host " ❌" -ForegroundColor Red
        Write-Host "      Error: $_" -ForegroundColor Red
        $failCount++
    }
}

# Resumen
Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   📊 RESUMEN DE CONFIGURACIÓN                                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "   ✅ Secrets configurados exitosamente: $successCount" -ForegroundColor Green
if ($failCount -gt 0) {
    Write-Host "   ❌ Secrets que fallaron: $failCount" -ForegroundColor Red
}

if (-not $hasServiceAccount) {
    Write-Host "`n⚠️  IMPORTANTE: FIREBASE_SERVICE_ACCOUNT no configurado" -ForegroundColor Yellow
    Write-Host "   Este secret es CRÍTICO para los workflows" -ForegroundColor Yellow
    Write-Host "`n📝 Para configurarlo manualmente:" -ForegroundColor Cyan
    Write-Host "   1. Obtén serviceAccountKey.json de Firebase Console" -ForegroundColor White
    Write-Host "   2. Ejecuta:" -ForegroundColor White
    Write-Host "      cat serviceAccountKey.json | gh secret set FIREBASE_SERVICE_ACCOUNT" -ForegroundColor Gray
}

# Verificar secrets configurados
Write-Host "`n🔍 Verificando secrets en GitHub..." -ForegroundColor Yellow
$configuredSecrets = gh secret list 2>&1

Write-Host "`n📋 Secrets configurados en el repositorio:" -ForegroundColor Cyan
$configuredSecrets | ForEach-Object {
    if ($_ -match 'VITE_FIREBASE|FIREBASE_SERVICE') {
        Write-Host "   ✅ $_" -ForegroundColor Green
    }
}

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   ✅ CONFIGURACIÓN COMPLETADA                                ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "🎯 Próximos pasos:" -ForegroundColor Yellow
Write-Host "   1. Verifica en GitHub: Settings → Secrets → Actions" -ForegroundColor White
Write-Host "   2. Ejecuta un workflow: Actions → Pre-Deployment Checklist" -ForegroundColor White
Write-Host "   3. Revisa los logs para confirmar que funciona`n" -ForegroundColor White
