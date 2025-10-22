# 🚀 Script de Instalación y Configuración de Ollama para ZeroForce
# Autor: Sistema Premium Ecosystem
# Fecha: 2025-10-20

Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🧠 OLLAMA + ZEROFORCE AI - CONFIGURACIÓN AUTOMÁTICA  ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Función para verificar si Ollama está instalado
function Test-OllamaInstalled {
    try {
        $null = ollama --version
        return $true
    } catch {
        return $false
    }
}

# Función para descargar e instalar Ollama
function Install-Ollama {
    Write-Host "📥 Descargando Ollama..." -ForegroundColor Yellow

    $ollamaUrl = "https://ollama.com/download/OllamaSetup.exe"
    $installerPath = "$env:TEMP\OllamaSetup.exe"

    try {
        # Descargar el instalador
        Write-Host "⬇️  Descargando desde $ollamaUrl..." -ForegroundColor Cyan
        Invoke-WebRequest -Uri $ollamaUrl -OutFile $installerPath -UseBasicParsing

        Write-Host "✅ Descarga completada!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔧 Instalando Ollama..." -ForegroundColor Yellow
        Write-Host "   (Se abrirá el instalador. Por favor, sigue las instrucciones)" -ForegroundColor Gray

        # Ejecutar el instalador
        Start-Process -FilePath $installerPath -Wait

        Write-Host "✅ Instalación completada!" -ForegroundColor Green
        Write-Host ""

        # Esperar un momento para que el servicio se inicie
        Start-Sleep -Seconds 3

        return $true
    } catch {
        Write-Host "❌ Error al instalar Ollama: $_" -ForegroundColor Red
        return $false
    }
}

# Función para verificar si Ollama está corriendo
function Test-OllamaRunning {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:11434" -UseBasicParsing -TimeoutSec 2
        return $true
    } catch {
        return $false
    }
}

# Función para iniciar Ollama
function Start-OllamaServer {
    Write-Host "🚀 Iniciando servidor Ollama..." -ForegroundColor Yellow

    # Iniciar Ollama en segundo plano
    Start-Process -FilePath "ollama" -ArgumentList "serve" -WindowStyle Minimized

    # Esperar a que el servidor esté listo
    $maxAttempts = 10
    $attempt = 0

    while ($attempt -lt $maxAttempts) {
        Start-Sleep -Seconds 2
        if (Test-OllamaRunning) {
            Write-Host "✅ Servidor Ollama iniciado correctamente en http://localhost:11434" -ForegroundColor Green
            return $true
        }
        $attempt++
        Write-Host "   Esperando servidor... ($attempt/$maxAttempts)" -ForegroundColor Gray
    }

    Write-Host "⚠️  El servidor tardó en iniciar. Verifica manualmente." -ForegroundColor Yellow
    return $false
}

# Función para listar modelos disponibles
function Get-OllamaModels {
    try {
        $output = ollama list 2>&1
        return $output
    } catch {
        return $null
    }
}

# Función para descargar un modelo
function Install-OllamaModel {
    param(
        [string]$ModelName
    )

    Write-Host ""
    Write-Host "📦 Descargando modelo: $ModelName" -ForegroundColor Yellow
    Write-Host "   (Esto puede tardar varios minutos dependiendo de tu conexión)" -ForegroundColor Gray
    Write-Host ""

    try {
        $process = Start-Process -FilePath "ollama" -ArgumentList "pull $ModelName" -NoNewWindow -Wait -PassThru

        if ($process.ExitCode -eq 0) {
            Write-Host "✅ Modelo $ModelName descargado correctamente!" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Error al descargar el modelo" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Error: $_" -ForegroundColor Red
        return $false
    }
}

# PASO 1: Verificar/Instalar Ollama
Write-Host "🔍 PASO 1: Verificando instalación de Ollama..." -ForegroundColor Magenta
Write-Host ""

if (-not (Test-OllamaInstalled)) {
    Write-Host "⚠️  Ollama no está instalado" -ForegroundColor Yellow
    Write-Host ""

    $install = Read-Host "¿Deseas instalar Ollama ahora? (S/N)"

    if ($install -eq "S" -or $install -eq "s") {
        if (Install-Ollama) {
            Write-Host "✅ Ollama instalado correctamente!" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "❌ No se pudo instalar Ollama automáticamente." -ForegroundColor Red
            Write-Host "   Por favor, descarga e instala manualmente desde: https://ollama.com/download" -ForegroundColor Yellow
            exit 1
        }
    } else {
        Write-Host ""
        Write-Host "❌ Ollama es necesario para continuar." -ForegroundColor Red
        Write-Host "   Descárgalo desde: https://ollama.com/download" -ForegroundColor Yellow
        exit 1
    }
} else {
    $version = ollama --version
    Write-Host "✅ Ollama ya está instalado: $version" -ForegroundColor Green
}

Write-Host ""

# PASO 2: Iniciar servidor Ollama
Write-Host "🔍 PASO 2: Verificando servidor Ollama..." -ForegroundColor Magenta
Write-Host ""

if (-not (Test-OllamaRunning)) {
    Write-Host "⚠️  Servidor Ollama no está corriendo" -ForegroundColor Yellow
    Start-OllamaServer
} else {
    Write-Host "✅ Servidor Ollama ya está corriendo en http://localhost:11434" -ForegroundColor Green
}

Write-Host ""

# PASO 3: Verificar modelos instalados
Write-Host "🔍 PASO 3: Verificando modelos instalados..." -ForegroundColor Magenta
Write-Host ""

$models = Get-OllamaModels

if ($models) {
    Write-Host "📋 Modelos instalados:" -ForegroundColor Cyan
    Write-Host $models
    Write-Host ""
}

# Preguntar si desea descargar un modelo
Write-Host "📦 Modelos recomendados para ZeroForce:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   1️⃣  qwen2.5:7b    - Mejor para español (Recomendado) - ~4.7 GB" -ForegroundColor White
Write-Host "   2️⃣  llama3.2      - Rápido y ligero - ~2 GB" -ForegroundColor White
Write-Host "   3️⃣  mistral       - Equilibrado - ~4.1 GB" -ForegroundColor White
Write-Host "   4️⃣  codellama     - Especializado en código - ~3.8 GB" -ForegroundColor White
Write-Host "   0️⃣  Ninguno       - Ya tengo un modelo" -ForegroundColor Gray
Write-Host ""

$choice = Read-Host "Selecciona una opción (1-4, 0 para saltar)"

switch ($choice) {
    "1" {
        Install-OllamaModel -ModelName "qwen2.5:7b"
        $selectedModel = "qwen2.5:7b"
    }
    "2" {
        Install-OllamaModel -ModelName "llama3.2"
        $selectedModel = "llama3.2"
    }
    "3" {
        Install-OllamaModel -ModelName "mistral"
        $selectedModel = "mistral"
    }
    "4" {
        Install-OllamaModel -ModelName "codellama"
        $selectedModel = "codellama"
    }
    "0" {
        Write-Host "⏭️  Saltando descarga de modelo" -ForegroundColor Gray
        $selectedModel = $null
    }
    default {
        Write-Host "⚠️  Opción no válida. Saltando descarga." -ForegroundColor Yellow
        $selectedModel = $null
    }
}

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║           ✅ CONFIGURACIÓN COMPLETADA                  ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   1️⃣  Inicia tu aplicación:" -ForegroundColor White
Write-Host "      npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "   2️⃣  Abre en el navegador:" -ForegroundColor White
Write-Host "      http://localhost:3001" -ForegroundColor Gray
Write-Host ""
Write-Host "   3️⃣  Busca el botón flotante 🧠 en la esquina inferior derecha" -ForegroundColor White
Write-Host ""
Write-Host "   4️⃣  Configura ZeroForce:" -ForegroundColor White
Write-Host "      - Clic en ⚙️ Settings" -ForegroundColor Gray
Write-Host "      - Host: http://localhost:11434" -ForegroundColor Gray
if ($selectedModel) {
    Write-Host "      - Modelo: $selectedModel" -ForegroundColor Gray
}
Write-Host "      - Activa las opciones que desees" -ForegroundColor Gray
Write-Host "      - Clic en 💾 Guardar" -ForegroundColor Gray
Write-Host ""
Write-Host "   5️⃣  ¡Empieza a chatear con ZeroForce AI! 🚀" -ForegroundColor White
Write-Host ""
Write-Host "📚 Información adicional:" -ForegroundColor Cyan
Write-Host "   - Servidor Ollama: http://localhost:11434" -ForegroundColor Gray
Write-Host "   - Lista de modelos: ollama list" -ForegroundColor Gray
Write-Host "   - Descargar más modelos: ollama pull <nombre-modelo>" -ForegroundColor Gray
Write-Host ""

# Preguntar si desea abrir la documentación
$openDocs = Read-Host "¿Deseas abrir la documentación de Ollama en el navegador? (S/N)"
if ($openDocs -eq "S" -or $openDocs -eq "s") {
    Start-Process "https://github.com/ollama/ollama/blob/main/README.md"
}

Write-Host ""
Write-Host "¡Gracias por usar Premium Ecosystem! 🎉" -ForegroundColor Magenta
