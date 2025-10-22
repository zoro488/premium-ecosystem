#!/usr/bin/env pwsh
# 🐳 Script de gestión de Docker para Premium Ecosystem
# Facilita operaciones comunes con Docker y WSL2

param(
    [Parameter(Position = 0)]
    [ValidateSet('setup', 'start', 'stop', 'restart', 'build', 'clean', 'logs', 'test', 'prod', 'status', 'shell')]
    [string]$Action = 'start',

    [switch]$Production,
    [switch]$Monitoring,
    [switch]$Clean
)

$ErrorActionPreference = 'Stop'

# Colores para output
function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Info { param($msg) Write-Host "ℹ️  $msg" -ForegroundColor Cyan }
function Write-Warning { param($msg) Write-Host "⚠️  $msg" -ForegroundColor Yellow }
function Write-Error { param($msg) Write-Host "❌ $msg" -ForegroundColor Red }

Write-Host "`n🐳 Premium Ecosystem - Docker Manager`n" -ForegroundColor Magenta

# Verificar que Docker esté instalado
function Test-DockerInstalled {
    try {
        docker --version | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Verificar que Docker esté corriendo
function Test-DockerRunning {
    try {
        docker ps | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Verificar instalación de Docker
if (-not (Test-DockerInstalled)) {
    Write-Error "Docker no está instalado"
    Write-Info "Instala Docker Desktop desde: https://www.docker.com/products/docker-desktop"
    exit 1
}

# Verificar que Docker esté corriendo
if (-not (Test-DockerRunning)) {
    Write-Error "Docker no está corriendo"
    Write-Info "Inicia Docker Desktop y ejecuta este script nuevamente"
    exit 1
}

switch ($Action) {
    'setup' {
        Write-Info "Configurando Docker para Premium Ecosystem..."

        # Verificar WSL2
        Write-Info "Verificando WSL2..."
        $wslVersion = wsl --status 2>&1
        if ($wslVersion -match "WSL 2") {
            Write-Success "WSL2 está configurado correctamente"
        }
        else {
            Write-Warning "WSL2 no detectado. Docker Desktop puede funcionar más lento"
        }

        # Crear archivo .env si no existe
        if (-not (Test-Path ".env")) {
            Write-Info "Creando archivo .env..."
            Copy-Item ".env.example" ".env" -ErrorAction SilentlyContinue
            Write-Success "Archivo .env creado. Configura tus variables de Firebase"
        }

        # Build de imágenes
        Write-Info "Construyendo imágenes Docker..."
        docker-compose build --parallel
        Write-Success "Imágenes construidas exitosamente"

        Write-Success "Setup completado!"
        Write-Info "Ejecuta: .\docker\manage.ps1 start"
    }

    'start' {
        Write-Info "Iniciando servicios..."

        $composeArgs = @('up', '-d')

        if ($Production) {
            $composeArgs += @('-f', 'docker-compose.yml', '-f', 'docker-compose.prod.yml')
            Write-Info "Modo: Producción"
        }
        else {
            Write-Info "Modo: Desarrollo"
        }

        if ($Monitoring) {
            $composeArgs += @('--profile', 'monitoring')
            Write-Info "Habilitando monitoreo (Prometheus + Grafana)"
        }

        & docker-compose $composeArgs

        Start-Sleep -Seconds 2

        Write-Success "Servicios iniciados!"
        Write-Host "`n📋 URLs disponibles:" -ForegroundColor Cyan
        Write-Host "  🌐 Aplicación:        http://localhost:3001" -ForegroundColor White
        Write-Host "  🔥 Firebase UI:       http://localhost:4000" -ForegroundColor White
        if ($Monitoring) {
            Write-Host "  📊 Prometheus:        http://localhost:9090" -ForegroundColor White
            Write-Host "  📈 Grafana:           http://localhost:3000" -ForegroundColor White
        }
        Write-Host ""
    }

    'stop' {
        Write-Info "Deteniendo servicios..."
        docker-compose down
        Write-Success "Servicios detenidos"
    }

    'restart' {
        Write-Info "Reiniciando servicios..."
        docker-compose restart
        Write-Success "Servicios reiniciados"
    }

    'build' {
        Write-Info "Construyendo imágenes..."

        if ($Clean) {
            Write-Warning "Build desde cero (sin caché)..."
            docker-compose build --no-cache --parallel
        }
        else {
            docker-compose build --parallel
        }

        Write-Success "Build completado"
    }

    'clean' {
        Write-Warning "Limpiando recursos de Docker..."

        # Detener contenedores
        docker-compose down -v

        # Limpiar imágenes dangling
        Write-Info "Limpiando imágenes no utilizadas..."
        docker image prune -f

        # Limpiar volúmenes no utilizados
        Write-Info "Limpiando volúmenes no utilizados..."
        docker volume prune -f

        Write-Success "Limpieza completada"
    }

    'logs' {
        Write-Info "Mostrando logs (Ctrl+C para salir)..."
        docker-compose logs -f --tail=100
    }

    'test' {
        Write-Info "Ejecutando tests en contenedor..."
        docker-compose --profile test run --rm test
        Write-Success "Tests completados"
    }

    'prod' {
        Write-Info "Construyendo para producción..."
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

        Write-Info "Iniciando en modo producción..."
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d nginx

        Write-Success "Aplicación en producción disponible en http://localhost"
    }

    'status' {
        Write-Info "Estado de los contenedores:"
        docker-compose ps

        Write-Host "`n💾 Uso de recursos:" -ForegroundColor Cyan
        docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
    }

    'shell' {
        Write-Info "Abriendo shell en el contenedor de la app..."
        docker-compose exec app sh
    }
}

Write-Host ""
