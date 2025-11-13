# 🚀 DEMO SHOWCASE ENHANCED
# Script de inicio rápido para probar todas las integraciones de IA

Write-Host "🎬 DEMO SHOWCASE ENHANCED - Sistema Completo de IA" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "📦 Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Node.js $nodeVersion instalado" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js no encontrado. Instalar desde https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Verificar dependencias
Write-Host ""
Write-Host "📦 Verificando dependencias..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "⚠️  node_modules no encontrado. Instalando..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencias ya instaladas" -ForegroundColor Green
}

# Verificar archivo .env
Write-Host ""
Write-Host "🔐 Verificando configuración..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    Write-Host "⚠️  Archivo .env no encontrado" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📝 Creando .env de ejemplo..." -ForegroundColor Yellow

    $envContent = @"
# Adobe Creative Cloud APIs
VITE_ADOBE_CLIENT_ID=your_adobe_client_id
VITE_ADOBE_CLIENT_SECRET=your_adobe_client_secret
VITE_ADOBE_API_KEY=your_adobe_api_key

# OpenAI (GPT-4 Vision)
VITE_OPENAI_API_KEY=your_openai_api_key

# Anthropic (Claude Opus)
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key

# Firebase (opcional)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
"@

    Set-Content -Path ".env" -Value $envContent
    Write-Host "✅ Archivo .env creado" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE: Edita el archivo .env con tus credenciales reales" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📚 Guía para obtener credenciales:" -ForegroundColor Cyan
    Write-Host "  • Adobe: https://developer.adobe.com/console" -ForegroundColor White
    Write-Host "  • OpenAI: https://platform.openai.com/api-keys" -ForegroundColor White
    Write-Host "  • Anthropic: https://console.anthropic.com/" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "✅ Archivo .env encontrado" -ForegroundColor Green
}

# Mostrar funcionalidades
Write-Host ""
Write-Host "🎯 FUNCIONALIDADES DISPONIBLES" -ForegroundColor Magenta
Write-Host "==============================" -ForegroundColor Magenta
Write-Host ""
Write-Host "1️⃣  Exportador de Animaciones (Lottie + After Effects)" -ForegroundColor Cyan
Write-Host "   • Convierte animaciones Framer Motion a JSON" -ForegroundColor White
Write-Host "   • Genera scripts de After Effects (.jsx)" -ForegroundColor White
Write-Host ""
Write-Host "2️⃣  Generador de Componentes con IA" -ForegroundColor Cyan
Write-Host "   • Claude Opus genera estructura" -ForegroundColor White
Write-Host "   • GPT-4 crea código React TypeScript" -ForegroundColor White
Write-Host "   • Adobe Firefly genera assets visuales" -ForegroundColor White
Write-Host ""
Write-Host "3️⃣  AI Avatar Interactive" -ForegroundColor Cyan
Write-Host "   • Reconocimiento de voz (español)" -ForegroundColor White
Write-Host "   • Síntesis de voz" -ForegroundColor White
Write-Host "   • 6 expresiones faciales dinámicas" -ForegroundColor White
Write-Host "   • Visualización de audio en tiempo real" -ForegroundColor White
Write-Host ""
Write-Host "4️⃣  Componentes AAA Premium" -ForegroundColor Cyan
Write-Host "   • ButtonAAA con efecto magnético" -ForegroundColor White
Write-Host "   • InputAAA con glassmorphism" -ForegroundColor White
Write-Host "   • CardAAA con profundidad 2.5D" -ForegroundColor White
Write-Host "   • ToggleAAA con animaciones suaves" -ForegroundColor White
Write-Host ""

# Iniciar servidor de desarrollo
Write-Host ""
Write-Host "🚀 Iniciando servidor de desarrollo..." -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs disponibles:" -ForegroundColor Yellow
Write-Host "   • Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   • Showcase: http://localhost:5173/showcase" -ForegroundColor White
Write-Host ""
Write-Host "💡 TIPS:" -ForegroundColor Yellow
Write-Host "   • Usa CTRL+C para detener el servidor" -ForegroundColor White
Write-Host "   • Abre el navegador en http://localhost:5173/showcase" -ForegroundColor White
Write-Host "   • Prueba el botón flotante 🤖 para el AI Avatar" -ForegroundColor White
Write-Host "   • Ve a la sección 'Exportar Animaciones' para descargar Lottie/AE" -ForegroundColor White
Write-Host ""
Write-Host "🎬 ¡Disfruta del Showcase Enhanced!" -ForegroundColor Magenta
Write-Host ""

# Abrir navegador después de 3 segundos
Start-Sleep -Seconds 3
Start-Process "http://localhost:5173/showcase"

# Iniciar Vite
npm run dev
