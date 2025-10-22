# 🚀 INICIO RÁPIDO FLOWDISTRIBUTOR SUPREME 2025
# Script para iniciar frontend + backend en paralelo

Write-Host ""
Write-Host "🚀 =======================================" -ForegroundColor Cyan
Write-Host "🔥 FLOWDISTRIBUTOR SUPREME 2025" -ForegroundColor Magenta
Write-Host "🚀 =======================================" -ForegroundColor Cyan
Write-Host ""

# Función para verificar si Node.js está instalado
function Test-NodeInstalled {
    try {
        $null = Get-Command node -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

# Verificar Node.js
if (-not (Test-NodeInstalled)) {
    Write-Host "❌ Error: Node.js no está instalado" -ForegroundColor Red
    Write-Host "📥 Descarga Node.js desde: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Mostrar versión de Node
$nodeVersion = node --version
Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Verificar si las dependencias están instaladas
Write-Host "🔍 Verificando dependencias..." -ForegroundColor Yellow

if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias del frontend..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al instalar dependencias del frontend" -ForegroundColor Red
        exit 1
    }
}

if (-not (Test-Path "backend\node_modules")) {
    Write-Host "📦 Instalando dependencias del backend..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al instalar dependencias del backend" -ForegroundColor Red
        exit 1
    }
    Set-Location ..
}

Write-Host "✅ Dependencias verificadas" -ForegroundColor Green
Write-Host ""

# Función para iniciar el backend
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD\backend
    node server.js
}

Write-Host "🔴 Backend Socket.io iniciando..." -ForegroundColor Cyan
Start-Sleep -Seconds 2

# Función para iniciar el frontend
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm run dev
}

Write-Host "⚛️  Frontend React + Vite iniciando..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "✅ ¡Sistema iniciado correctamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:  ws://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "⌨️  Presiona Ctrl+C para detener los servidores" -ForegroundColor Yellow
Write-Host ""

# Mantener el script ejecutándose y mostrar logs
try {
    while ($true) {
        # Verificar si los jobs siguen activos
        $backendState = Get-Job -Id $backendJob.Id | Select-Object -ExpandProperty State
        $frontendState = Get-Job -Id $frontendJob.Id | Select-Object -ExpandProperty State

        if ($backendState -eq "Failed" -or $frontendState -eq "Failed") {
            Write-Host "❌ Error: Uno de los servidores falló" -ForegroundColor Red
            break
        }

        # Recibir y mostrar output de backend
        Receive-Job -Id $backendJob.Id -ErrorAction SilentlyContinue | ForEach-Object {
            Write-Host "[BACKEND] $_" -ForegroundColor Cyan
        }

        # Recibir y mostrar output de frontend
        Receive-Job -Id $frontendJob.Id -ErrorAction SilentlyContinue | ForEach-Object {
            Write-Host "[FRONTEND] $_" -ForegroundColor Magenta
        }

        Start-Sleep -Milliseconds 500
    }
}
catch {
    Write-Host ""
    Write-Host "🛑 Deteniendo servidores..." -ForegroundColor Yellow
}
finally {
    # Cleanup: detener jobs
    Stop-Job -Id $backendJob.Id -ErrorAction SilentlyContinue
    Stop-Job -Id $frontendJob.Id -ErrorAction SilentlyContinue
    Remove-Job -Id $backendJob.Id -ErrorAction SilentlyContinue
    Remove-Job -Id $frontendJob.Id -ErrorAction SilentlyContinue

    Write-Host "✅ Servidores detenidos" -ForegroundColor Green
    Write-Host ""
}
