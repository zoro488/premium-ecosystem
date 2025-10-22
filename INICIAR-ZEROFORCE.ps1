# ⚡ SCRIPT DE INICIO AUTOMÁTICO DE ZEROFORCE
# Ejecuta este script en PowerShell para iniciar todo

Write-Host "⚡ ZEROFORCE - Iniciando Sistema Completo..." -ForegroundColor Cyan
Write-Host ""

# 1. Verificar Ollama
Write-Host "📦 Paso 1: Verificando Ollama..." -ForegroundColor Yellow
$ollamaInstalled = Get-Command ollama -ErrorAction SilentlyContinue

if (-not $ollamaInstalled) {
    Write-Host "❌ ERROR: Ollama no está instalado" -ForegroundColor Red
    Write-Host "📥 Descarga Ollama desde: https://ollama.com/download" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit
}

Write-Host "✅ Ollama instalado correctamente" -ForegroundColor Green
$ollamaVersion = ollama --version
Write-Host "   Versión: $ollamaVersion" -ForegroundColor Gray
Write-Host ""

# 2. Verificar si Ollama está corriendo
Write-Host "🔍 Paso 2: Verificando servidor Ollama..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:11434" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "✅ Servidor Ollama ya está corriendo" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Servidor Ollama no está corriendo" -ForegroundColor Yellow
    Write-Host "🚀 Iniciando servidor Ollama..." -ForegroundColor Cyan

    # Iniciar Ollama en una nueva ventana
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'OLLAMA SERVIDOR - NO CIERRES ESTA VENTANA' -ForegroundColor Green; ollama serve"

    Write-Host "⏳ Esperando 5 segundos a que el servidor inicie..." -ForegroundColor Gray
    Start-Sleep -Seconds 5
}
Write-Host ""

# 3. Verificar modelos instalados
Write-Host "🧠 Paso 3: Verificando modelos de IA..." -ForegroundColor Yellow
$models = ollama list

if ($models -match "qwen2.5") {
    Write-Host "✅ Modelo qwen2.5 encontrado" -ForegroundColor Green
} elseif ($models -match "llama3.2") {
    Write-Host "✅ Modelo llama3.2 encontrado" -ForegroundColor Green
} else {
    Write-Host "⚠️  No se encontraron modelos instalados" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📥 Selecciona un modelo para descargar:" -ForegroundColor Cyan
    Write-Host "   1. qwen2.5:7b (RECOMENDADO - 4.7GB - Mejor para español)" -ForegroundColor White
    Write-Host "   2. llama3.2 (RÁPIDO - 2GB - Para hardware limitado)" -ForegroundColor White
    Write-Host "   3. Salir (descargar después manualmente)" -ForegroundColor Gray
    Write-Host ""

    $choice = Read-Host "Elige una opción (1, 2 o 3)"

    switch ($choice) {
        "1" {
            Write-Host "📥 Descargando qwen2.5:7b (esto puede tardar 5-10 minutos)..." -ForegroundColor Cyan
            ollama pull qwen2.5:7b
            Write-Host "✅ Modelo descargado correctamente" -ForegroundColor Green
        }
        "2" {
            Write-Host "📥 Descargando llama3.2 (esto puede tardar 3-5 minutos)..." -ForegroundColor Cyan
            ollama pull llama3.2
            Write-Host "✅ Modelo descargado correctamente" -ForegroundColor Green
        }
        "3" {
            Write-Host "⚠️  Para descargar modelos después, ejecuta:" -ForegroundColor Yellow
            Write-Host "   ollama pull qwen2.5:7b" -ForegroundColor Gray
        }
        default {
            Write-Host "❌ Opción inválida" -ForegroundColor Red
        }
    }
}
Write-Host ""

# 4. Mostrar modelos instalados
Write-Host "📋 Modelos instalados:" -ForegroundColor Yellow
ollama list
Write-Host ""

# 5. Verificar Node.js
Write-Host "📦 Paso 4: Verificando Node.js..." -ForegroundColor Yellow
$nodeInstalled = Get-Command node -ErrorAction SilentlyContinue

if (-not $nodeInstalled) {
    Write-Host "❌ ERROR: Node.js no está instalado" -ForegroundColor Red
    Write-Host "📥 Descarga Node.js desde: https://nodejs.org" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit
}

$nodeVersion = node --version
Write-Host "✅ Node.js instalado: $nodeVersion" -ForegroundColor Green
Write-Host ""

# 6. Verificar dependencias npm
Write-Host "📦 Paso 5: Verificando dependencias del proyecto..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  Dependencias no instaladas. Instalando..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "✅ Dependencias ya instaladas" -ForegroundColor Green
}
Write-Host ""

# 7. Iniciar servidor de desarrollo
Write-Host "🚀 Paso 6: Iniciando aplicación..." -ForegroundColor Yellow
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "⚡ ZEROFORCE LISTO" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Pasos siguientes:" -ForegroundColor Yellow
Write-Host "   1. La aplicación se abrirá en tu navegador" -ForegroundColor White
Write-Host "   2. Busca el botón flotante 🧠 (esquina inferior derecha)" -ForegroundColor White
Write-Host "   3. Haz clic para abrir ZeroForce" -ForegroundColor White
Write-Host "   4. Clic en ⚙️ Settings" -ForegroundColor White
Write-Host "   5. Selecciona tu modelo y guarda" -ForegroundColor White
Write-Host "   6. ¡Empieza a chatear con la IA!" -ForegroundColor White
Write-Host ""
Write-Host "💡 Comandos de ejemplo:" -ForegroundColor Cyan
Write-Host "   'Hola ZeroForce, preséntate'" -ForegroundColor Gray
Write-Host "   'Analiza el estado del sistema'" -ForegroundColor Gray
Write-Host "   'Dame insights sobre el rendimiento'" -ForegroundColor Gray
Write-Host ""
Write-Host "🔴 IMPORTANTE: NO CIERRES ESTA VENTANA" -ForegroundColor Red
Write-Host "    El servidor se ejecutará aquí" -ForegroundColor Gray
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Iniciando en 3 segundos..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Iniciar servidor y abrir navegador
npm run dev
