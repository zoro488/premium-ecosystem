#!/usr/bin/env pwsh
# 🚀 SCRIPT DE DEPLOY URGENTE - 2 HORAS
# Automatiza todo para deploy inmediato

$ErrorActionPreference = 'Stop'

Write-Host "`n🚀 PREMIUM ECOSYSTEM - DEPLOY URGENTE`n" -ForegroundColor Magenta

# 1. Limpiar caché y node_modules problematic
Write-Host "1️⃣  Limpiando caché..." -ForegroundColor Cyan
Remove-Item -Path "node_modules/.vite" -Recurse -ErrorAction SilentlyContinue
Remove-Item -Path "dist" -Recurse -ErrorAction SilentlyContinue

# 2. Reinstalar dependencias
Write-Host "2️⃣  Instalando dependencias..." -ForegroundColor Cyan
npm ci --prefer-offline

# 3. Build optimizado
Write-Host "3️⃣  Generando build de producción..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build falló" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build exitoso" -ForegroundColor Green

# 4. Verificar archivos generados
Write-Host "4️⃣  Verificando archivos..." -ForegroundColor Cyan
$distFiles = Get-ChildItem -Path "dist" -Recurse | Measure-Object
Write-Host "   📦 $($distFiles.Count) archivos generados" -ForegroundColor White

# 5. Iniciar preview
Write-Host "5️⃣  Iniciando servidor de preview..." -ForegroundColor Cyan
Write-Host "`n✅ TODO LISTO PARA ENTREGA`n" -ForegroundColor Green
Write-Host "📋 INSTRUCCIONES:" -ForegroundColor Cyan
Write-Host "   1. Servidor corriendo en: http://localhost:4173" -ForegroundColor White
Write-Host "   2. Carpeta dist/ lista para deploy" -ForegroundColor White
Write-Host "   3. Firebase deploy: firebase deploy --only hosting" -ForegroundColor White
Write-Host ""

npm run preview
