#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Reinicia el servidor de desarrollo con limpieza completa
.DESCRIPTION
    Limpia cachés de Vite, node_modules/.vite y reinicia el servidor
#>

param(
    [switch]$Deep = $false
)

$ErrorActionPreference = "Stop"

Write-Host "`n🔄 Reiniciando servidor de desarrollo..." -ForegroundColor Cyan

# 1. Limpiar caché de Vite
Write-Host "`n🧹 Limpiando caché de Vite..." -ForegroundColor Yellow
if (Test-Path "node_modules/.vite") {
    Remove-Item -Recurse -Force "node_modules/.vite"
    Write-Host "✅ Caché de Vite eliminado" -ForegroundColor Green
}

# 2. Limpiar dist
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "✅ Directorio dist eliminado" -ForegroundColor Green
}

# 3. Limpieza profunda (opcional)
if ($Deep) {
    Write-Host "`n🧹 Limpieza profunda activada..." -ForegroundColor Yellow

    if (Test-Path "node_modules") {
        Write-Host "  Eliminando node_modules..." -ForegroundColor Gray
        Remove-Item -Recurse -Force "node_modules"
    }

    if (Test-Path "package-lock.json") {
        Remove-Item -Force "package-lock.json"
    }

    Write-Host "  Reinstalando dependencias..." -ForegroundColor Gray
    npm install
    Write-Host "✅ Dependencias reinstaladas" -ForegroundColor Green
}

# 4. Matar procesos de Node en puerto 3001
Write-Host "`n🔍 Verificando puerto 3001..." -ForegroundColor Yellow
$processes = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if ($processes) {
    Write-Host "  Matando procesos en puerto 3001..." -ForegroundColor Gray
    $processes | ForEach-Object {
        Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
    Write-Host "✅ Puerto liberado" -ForegroundColor Green
} else {
    Write-Host "✅ Puerto 3001 está libre" -ForegroundColor Green
}

# 5. Iniciar servidor
Write-Host "`n🚀 Iniciando servidor de desarrollo..." -ForegroundColor Cyan
Write-Host "  URL: http://localhost:3001" -ForegroundColor Blue
Write-Host "  Presiona Ctrl+C para detener`n" -ForegroundColor Gray

npm run dev
