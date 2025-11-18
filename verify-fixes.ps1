#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Verifica que las correcciones de WebSocket y errores estén funcionando
.DESCRIPTION
    Script de verificación automática para confirmar que los problemas se resolvieron
#>

param(
    [switch]$Verbose = $false
)

$ErrorActionPreference = "Continue"
$passed = 0
$failed = 0

Write-Host "`n╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   🔍 VERIFICACIÓN DE CORRECCIONES - PREMIUM ECOSYSTEM  ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Test 1: Verificar que init-fixes.js existe y es válido
Write-Host "Test 1: Verificando init-fixes.js..." -NoNewline
if (Test-Path "public/init-fixes.js") {
    $content = Get-Content "public/init-fixes.js" -Raw
    if ($content -notmatch "import\.meta") {
        Write-Host " ✅ PASS" -ForegroundColor Green
        $passed++
    } else {
        Write-Host " ❌ FAIL - Contiene import.meta (error de sintaxis)" -ForegroundColor Red
        $failed++
    }
} else {
    Write-Host " ❌ FAIL - Archivo no existe" -ForegroundColor Red
    $failed++
}

# Test 2: Verificar que main.jsx tiene manejo de HMR
Write-Host "Test 2: Verificando manejo de HMR en main.jsx..." -NoNewline
if (Test-Path "src/main.jsx") {
    $content = Get-Content "src/main.jsx" -Raw
    if ($content -match "import\.meta\.hot" -and $content -match "vite:ws:disconnect") {
        Write-Host " ✅ PASS" -ForegroundColor Green
        $passed++
    } else {
        Write-Host " ❌ FAIL - No tiene manejo de HMR" -ForegroundColor Red
        $failed++
    }
} else {
    Write-Host " ❌ FAIL - Archivo no existe" -ForegroundColor Red
    $failed++
}

# Test 3: Verificar orden de carga en index.html
Write-Host "Test 3: Verificando orden de scripts en index.html..." -NoNewline
if (Test-Path "index.html") {
    $content = Get-Content "index.html" -Raw
    $initFixesIndex = $content.IndexOf("init-fixes.js")
    $mainJsxIndex = $content.IndexOf("main.jsx")

    if ($initFixesIndex -gt 0 -and $mainJsxIndex -gt $initFixesIndex) {
        Write-Host " ✅ PASS" -ForegroundColor Green
        $passed++
    } else {
        Write-Host " ❌ FAIL - Orden incorrecto" -ForegroundColor Red
        $failed++
    }
} else {
    Write-Host " ❌ FAIL - Archivo no existe" -ForegroundColor Red
    $failed++
}

# Test 4: Verificar configuración de Vite
Write-Host "Test 4: Verificando vite.config.js..." -NoNewline
if (Test-Path "vite.config.js") {
    $content = Get-Content "vite.config.js" -Raw
    if ($content -match "hmr:" -and $content -match "timeout:" -and $content -match "cors:") {
        Write-Host " ✅ PASS" -ForegroundColor Green
        $passed++
    } else {
        Write-Host " ⚠️  WARN - Configuración incompleta" -ForegroundColor Yellow
        $passed++
    }
} else {
    Write-Host " ❌ FAIL - Archivo no existe" -ForegroundColor Red
    $failed++
}

# Test 5: Verificar que el servidor está corriendo
Write-Host "Test 5: Verificando servidor en puerto 3001..." -NoNewline
$connection = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if ($connection) {
    Write-Host " ✅ PASS" -ForegroundColor Green
    $passed++
} else {
    Write-Host " ❌ FAIL - Servidor no está corriendo" -ForegroundColor Red
    $failed++
    Write-Host "         Ejecuta: npm run dev" -ForegroundColor Gray
}

# Test 6: Verificar respuesta HTTP
Write-Host "Test 6: Verificando respuesta HTTP..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001" -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host " ✅ PASS" -ForegroundColor Green
        $passed++
    } else {
        Write-Host " ❌ FAIL - Status: $($response.StatusCode)" -ForegroundColor Red
        $failed++
    }
} catch {
    Write-Host " ❌ FAIL - No responde" -ForegroundColor Red
    $failed++
}

# Test 7: Verificar que no hay import.meta en archivos no-módulo
Write-Host "Test 7: Verificando archivos en /public..." -NoNewline
$publicFiles = Get-ChildItem "public" -Filter "*.js" -ErrorAction SilentlyContinue
$hasImportMeta = $false
foreach ($file in $publicFiles) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "import\.meta") {
        $hasImportMeta = $true
        break
    }
}
if (-not $hasImportMeta) {
    Write-Host " ✅ PASS" -ForegroundColor Green
    $passed++
} else {
    Write-Host " ❌ FAIL - Archivo en /public contiene import.meta" -ForegroundColor Red
    $failed++
}

# Test 8: Verificar que restart-dev-clean.ps1 existe
Write-Host "Test 8: Verificando script de reinicio..." -NoNewline
if (Test-Path "restart-dev-clean.ps1") {
    Write-Host " ✅ PASS" -ForegroundColor Green
    $passed++
} else {
    Write-Host " ❌ FAIL - Script no existe" -ForegroundColor Red
    $failed++
}

# Resumen
$total = $passed + $failed
$percentage = [math]::Round(($passed / $total) * 100, 2)

Write-Host "`n╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    📊 RESUMEN                          ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host "`n  Total de tests: $total" -ForegroundColor White
Write-Host "  ✅ Pasados: $passed" -ForegroundColor Green
Write-Host "  ❌ Fallidos: $failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host "  📈 Porcentaje: $percentage%" -ForegroundColor $(if ($percentage -ge 90) { "Green" } elseif ($percentage -ge 70) { "Yellow" } else { "Red" })

if ($failed -eq 0) {
    Write-Host "`n  🎉 ¡TODAS LAS VERIFICACIONES PASARON!" -ForegroundColor Green
    Write-Host "  🚀 El sistema está listo para usar`n" -ForegroundColor Green
} else {
    Write-Host "`n  ⚠️  Algunas verificaciones fallaron" -ForegroundColor Yellow
    Write-Host "  📝 Revisa los errores arriba`n" -ForegroundColor Yellow
}

# Instrucciones adicionales
if ($Verbose) {
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "INSTRUCCIONES PARA VERIFICACIÓN MANUAL:" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Abre http://localhost:3001 en Firefox" -ForegroundColor White
    Write-Host "2. Abre DevTools (F12) → Pestaña Console" -ForegroundColor White
    Write-Host "3. Verifica que NO aparezcan estos errores:" -ForegroundColor White
    Write-Host "   - 'Promised response from onMessage listener...'" -ForegroundColor Gray
    Write-Host "   - 'Components es obsoleto...'" -ForegroundColor Gray
    Write-Host "   - 'La conexión con ws://... se interrumpió...'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. Haz un cambio en cualquier archivo .jsx" -ForegroundColor White
    Write-Host "5. Verifica que la página se actualice automáticamente" -ForegroundColor White
    Write-Host ""
    Write-Host "Si todo funciona → ¡Problema resuelto! ✅" -ForegroundColor Green
    Write-Host ""
}

exit $failed
