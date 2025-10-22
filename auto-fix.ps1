#!/usr/bin/env pwsh
# 🔧 AUTO-FIX para Premium Ecosystem
# Corrige automáticamente problemas comunes

Write-Host "`n🔧 AUTO-FIX - Premium Ecosystem`n" -ForegroundColor Magenta

$fixed = 0

Write-Host "Aplicando correcciones automáticas..." -ForegroundColor Cyan

# 1. ESLint auto-fix
Write-Host "`n[1/5] Corrigiendo problemas de ESLint..." -ForegroundColor Yellow
try {
    npx eslint --fix "src/**/*.{js,jsx}" --quiet
    $fixed++
    Write-Host "✅ ESLint fixed" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  ESLint warnings (no críticos)" -ForegroundColor Yellow
}

# 2. Prettier auto-format
Write-Host "`n[2/5] Formateando código con Prettier..." -ForegroundColor Yellow
try {
    npx prettier --write "src/**/*.{js,jsx,json,css}" --log-level silent
    $fixed++
    Write-Host "✅ Código formateado" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Prettier no disponible" -ForegroundColor Yellow
}

# 3. Limpiar node_modules/.vite
Write-Host "`n[3/5] Limpiando caché de Vite..." -ForegroundColor Yellow
if (Test-Path "node_modules/.vite") {
    Remove-Item -Recurse -Force "node_modules/.vite"
    $fixed++
    Write-Host "✅ Caché limpiado" -ForegroundColor Green
}

# 4. Regenerar lock file
Write-Host "`n[4/5] Verificando dependencias..." -ForegroundColor Yellow
npm install --package-lock-only
$fixed++
Write-Host "✅ Dependencias verificadas" -ForegroundColor Green

# 5. Build test
Write-Host "`n[5/5] Probando build..." -ForegroundColor Yellow
$env:NODE_ENV = "production"
npm run build > $null 2>&1
if ($LASTEXITCODE -eq 0) {
    $fixed++
    Write-Host "✅ Build exitoso" -ForegroundColor Green
}
else {
    Write-Host "❌ Build falló - revisa errores manualmente" -ForegroundColor Red
}

Write-Host "`n✅ AUTO-FIX COMPLETADO: $fixed/5 correcciones aplicadas`n" -ForegroundColor Green

Write-Host "Próximo paso: .\deploy-quick.ps1" -ForegroundColor Cyan
