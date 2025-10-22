# 🚀 Script de Inicio Rápido - Ollama + ZeroForce
# Ejecuta este script para iniciar todo automáticamente

param(
    [switch]$InstallModel,
    [string]$ModelName = "qwen2.5:7b"
)

$ErrorActionPreference = "SilentlyContinue"

Write-Host ""
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🚀 INICIO RÁPIDO: Ollama + ZeroForce  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Función para verificar si Ollama está corriendo
function Test-OllamaRunning {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:11434" -UseBasicParsing -TimeoutSec 2 2>$null
        return $true
    } catch {
        return $false
    }
}

# 1. Verificar Ollama
Write-Host "🔍 Verificando Ollama..." -ForegroundColor Yellow

try {
    $version = ollama --version 2>$null
    if ($version) {
        Write-Host "   ✅ Ollama instalado: $version" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Ollama NO está instalado" -ForegroundColor Red
        Write-Host ""
        Write-Host "   📥 Para instalar, ejecuta:" -ForegroundColor Yellow
        Write-Host "      .\SETUP_OLLAMA.ps1" -ForegroundColor White
        Write-Host ""
        exit 1
    }
} catch {
    Write-Host "   ❌ Ollama NO está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "   📥 Para instalar, ejecuta:" -ForegroundColor Yellow
    Write-Host "      .\SETUP_OLLAMA.ps1" -ForegroundColor White
    Write-Host ""
    exit 1
}

# 2. Iniciar servidor Ollama si no está corriendo
Write-Host "🚀 Verificando servidor Ollama..." -ForegroundColor Yellow

if (Test-OllamaRunning) {
    Write-Host "   ✅ Servidor ya está corriendo en http://localhost:11434" -ForegroundColor Green
} else {
    Write-Host "   🔄 Iniciando servidor Ollama..." -ForegroundColor Cyan

    Start-Process -FilePath "ollama" -ArgumentList "serve" -WindowStyle Minimized

    # Esperar a que el servidor esté listo
    $maxAttempts = 15
    $attempt = 0
    $started = $false

    while ($attempt -lt $maxAttempts) {
        Start-Sleep -Seconds 1
        if (Test-OllamaRunning) {
            Write-Host "   ✅ Servidor iniciado correctamente" -ForegroundColor Green
            $started = $true
            break
        }
        $attempt++
        Write-Host "   ⏳ Esperando servidor... ($attempt/$maxAttempts)" -ForegroundColor Gray
    }

    if (-not $started) {
        Write-Host "   ⚠️  El servidor tardó mucho en iniciar" -ForegroundColor Yellow
        Write-Host "   Por favor, verifica manualmente: http://localhost:11434" -ForegroundColor Gray
    }
}

# 3. Verificar modelos
Write-Host "📦 Verificando modelos..." -ForegroundColor Yellow

$modelsList = ollama list 2>$null
if ($modelsList) {
    Write-Host "   ✅ Modelos instalados:" -ForegroundColor Green
    Write-Host "   $modelsList" -ForegroundColor Gray
} else {
    Write-Host "   ⚠️  No hay modelos instalados" -ForegroundColor Yellow

    if ($InstallModel) {
        Write-Host "   📥 Descargando modelo: $ModelName..." -ForegroundColor Cyan
        ollama pull $ModelName
        Write-Host "   ✅ Modelo descargado" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "   💡 Para descargar un modelo, ejecuta:" -ForegroundColor Yellow
        Write-Host "      .\QUICK_START_OLLAMA.ps1 -InstallModel -ModelName 'qwen2.5:7b'" -ForegroundColor White
        Write-Host ""
        Write-Host "   O manualmente:" -ForegroundColor Yellow
        Write-Host "      ollama pull qwen2.5:7b    # Recomendado para español" -ForegroundColor White
        Write-Host "      ollama pull llama3.2       # Rápido y ligero" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║        ✅ OLLAMA ESTÁ LISTO               ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# 4. Instrucciones para ZeroForce
Write-Host "🎯 CONFIGURACIÓN EN ZEROFORCE:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   1️⃣  Inicia tu aplicación:" -ForegroundColor White
Write-Host "      npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "   2️⃣  Abre en el navegador:" -ForegroundColor White
Write-Host "      http://localhost:3001" -ForegroundColor Gray
Write-Host ""
Write-Host "   3️⃣  Busca el botón 🧠 (esquina inferior derecha)" -ForegroundColor White
Write-Host ""
Write-Host "   4️⃣  Clic en ⚙️ Settings y configura:" -ForegroundColor White
Write-Host "      • Host: http://localhost:11434" -ForegroundColor Gray
Write-Host "      • Modelo: Selecciona uno de la lista" -ForegroundColor Gray
Write-Host "      • Activa Streaming (recomendado)" -ForegroundColor Gray
Write-Host "      • Clic en 💾 Guardar" -ForegroundColor Gray
Write-Host ""
Write-Host "   5️⃣  ¡Empieza a chatear! 🎉" -ForegroundColor White
Write-Host ""

# Preguntar si desea iniciar la app
Write-Host "❓ ¿Deseas iniciar la aplicación ahora? (S/N): " -ForegroundColor Yellow -NoNewline
$startApp = Read-Host

if ($startApp -eq "S" -or $startApp -eq "s") {
    Write-Host ""
    Write-Host "🚀 Iniciando aplicación..." -ForegroundColor Cyan
    Write-Host ""

    # Verificar si package.json existe
    if (Test-Path "package.json") {
        npm run dev
    } else {
        Write-Host "❌ No se encontró package.json" -ForegroundColor Red
        Write-Host "   Asegúrate de estar en el directorio correcto" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "👍 Cuando estés listo, ejecuta: npm run dev" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "📚 Documentación completa: .\OLLAMA_SETUP_GUIDE.md" -ForegroundColor Gray
Write-Host ""
