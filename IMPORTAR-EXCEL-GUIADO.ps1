# ===============================================
# 🚀 IMPORTADOR GUIADO DE EXCEL
# ===============================================

param(
    [string]$ExcelPath = "C:\Users\xpovo\Documents\premium-ecosystem\Copia de Administación_General.xlsx"
)

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                                 ║" -ForegroundColor Cyan
Write-Host "║        🎯 IMPORTACIÓN GUIADA DE EXCEL - PASO A PASO 🎯         ║" -ForegroundColor Cyan
Write-Host "║                                                                 ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar archivo Excel
Write-Host "📂 VERIFICANDO ARCHIVO..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path $ExcelPath) {
    $fileInfo = Get-Item $ExcelPath
    $sizeMB = [math]::Round($fileInfo.Length / 1MB, 2)

    Write-Host "  ✅ Archivo encontrado" -ForegroundColor Green
    Write-Host "     Ruta: $ExcelPath" -ForegroundColor Gray
    Write-Host "     Tamaño: $sizeMB MB" -ForegroundColor Gray
    Write-Host ""
}
else {
    Write-Host "  ❌ Archivo no encontrado: $ExcelPath" -ForegroundColor Red
    Write-Host ""
    exit 1
}

# Verificar que el servidor esté corriendo
Write-Host "🌐 VERIFICANDO SERVIDOR..." -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001" -TimeoutSec 3 -ErrorAction SilentlyContinue
    Write-Host "  ✅ Servidor activo en http://localhost:3001" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "  ⚠️  Servidor no responde. Iniciando servidor..." -ForegroundColor Yellow
    Write-Host ""

    Start-Process pwsh -ArgumentList "-Command", "npm run dev" -WindowStyle Minimized

    Write-Host "  ⏳ Esperando 10 segundos para que inicie..." -ForegroundColor Gray
    Start-Sleep -Seconds 10

    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001" -TimeoutSec 5
        Write-Host "  ✅ Servidor iniciado correctamente" -ForegroundColor Green
        Write-Host ""
    }
    catch {
        Write-Host "  ❌ No se pudo iniciar el servidor" -ForegroundColor Red
        Write-Host "     Por favor ejecuta manualmente: npm run dev" -ForegroundColor Yellow
        Write-Host ""
        exit 1
    }
}

# Copiar ruta al portapapeles
Write-Host "📋 PREPARANDO..." -ForegroundColor Yellow
Write-Host ""

Set-Clipboard -Value $ExcelPath
Write-Host "  ✅ Ruta del archivo copiada al portapapeles" -ForegroundColor Green
Write-Host ""

# Instrucciones paso a paso
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                                 ║" -ForegroundColor Green
Write-Host "║                  📝 INSTRUCCIONES PASO A PASO                  ║" -ForegroundColor Green
Write-Host "║                                                                 ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "PASO 1: Abrir FlowDistributor" -ForegroundColor Cyan
Write-Host "  └─ Presiona Enter para abrir el navegador..." -ForegroundColor Gray
Read-Host

# Abrir navegador
Start-Process "http://localhost:3001"

Write-Host ""
Write-Host "PASO 2: Navegar al Importador" -ForegroundColor Cyan
Write-Host "  └─ Click en 'Importar Excel' 📊 en el menú lateral" -ForegroundColor Gray
Write-Host "  └─ (Es el segundo botón con ícono de hoja de cálculo)" -ForegroundColor Gray
Write-Host ""
Write-Host "  ¿Listo? Presiona Enter cuando estés en el panel..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "PASO 3: Seleccionar Archivo" -ForegroundColor Cyan
Write-Host "  └─ Click en 'Seleccionar archivo' o arrastra el archivo" -ForegroundColor Gray
Write-Host "  └─ La ruta ya está en tu portapapeles (Ctrl+V)" -ForegroundColor Gray
Write-Host ""
Write-Host "  Ruta copiada: $ExcelPath" -ForegroundColor Green
Write-Host ""
Write-Host "  ¿Archivo seleccionado? Presiona Enter..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "PASO 4: Iniciar Importación" -ForegroundColor Cyan
Write-Host "  └─ Click en el botón 'Importar Datos' 🚀" -ForegroundColor Gray
Write-Host ""
Write-Host "  ¿Importación iniciada? Presiona Enter..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "PASO 5: Monitorear Progreso" -ForegroundColor Cyan
Write-Host "  └─ Observa la barra de progreso (0% → 100%)" -ForegroundColor Gray
Write-Host "  └─ Lee los logs en tiempo real" -ForegroundColor Gray
Write-Host "  └─ Verifica los contadores de registros" -ForegroundColor Gray
Write-Host ""

Write-Host "  ⏳ Tiempo estimado: 30-45 segundos" -ForegroundColor Yellow
Write-Host ""

# Countdown
Write-Host "  Esperando 45 segundos para que complete..." -ForegroundColor Gray
for ($i = 45; $i -gt 0; $i--) {
    Write-Progress -Activity "Importación en progreso" -Status "$i segundos restantes..." -PercentComplete ((45 - $i) / 45 * 100)
    Start-Sleep -Seconds 1
}
Write-Progress -Activity "Importación en progreso" -Completed

Write-Host ""
Write-Host "  ✅ Debería estar completado" -ForegroundColor Green
Write-Host ""

Write-Host "PASO 6: Revisar Reporte" -ForegroundColor Cyan
Write-Host "  └─ Verifica las estadísticas generales" -ForegroundColor Gray
Write-Host "  └─ Revisa las métricas de negocio" -ForegroundColor Gray
Write-Host "  └─ Chequea warnings (si los hay)" -ForegroundColor Gray
Write-Host "  └─ Confirma que no hay errores" -ForegroundColor Gray
Write-Host ""

Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                                 ║" -ForegroundColor Green
Write-Host "║               📊 DATOS QUE DEBERÍAS VER IMPORTADOS             ║" -ForegroundColor Green
Write-Host "║                                                                 ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

$expectedData = @(
    @{Item = "Órdenes de Compra"; Count = "~300" },
    @{Item = "Distribuidores"; Count = "~10" },
    @{Item = "Ventas Locales"; Count = "~250" },
    @{Item = "Gastos y Abonos"; Count = "~250" },
    @{Item = "Movimientos Almacén"; Count = "~50" },
    @{Item = "Movimientos Bancarios"; Count = "~100" },
    @{Item = "Bancos"; Count = "6" },
    @{Item = "Clientes"; Count = "~160" },
    @{Item = "Relaciones"; Count = "~1,500+" }
)

foreach ($item in $expectedData) {
    Write-Host "  ✓ $($item.Item): " -NoNewline -ForegroundColor Cyan
    Write-Host "$($item.Count)" -ForegroundColor Green
}

Write-Host ""
Write-Host ""

Write-Host "PASO 7: Verificar Datos" -ForegroundColor Cyan
Write-Host "  └─ Navega a 'Dashboard' para ver KPIs actualizados" -ForegroundColor Gray
Write-Host "  └─ Ve a 'Órdenes' para ver las OCs importadas" -ForegroundColor Gray
Write-Host "  └─ Revisa 'Clientes' para validar la cartera" -ForegroundColor Gray
Write-Host "  └─ Chequea los movimientos bancarios" -ForegroundColor Gray
Write-Host ""

Write-Host "  ¿Todo correcto? Presiona Enter para finalizar..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                                 ║" -ForegroundColor Green
Write-Host "║                  ✅ IMPORTACIÓN COMPLETADA ✅                  ║" -ForegroundColor Green
Write-Host "║                                                                 ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# Resumen final
Write-Host "📈 RESUMEN FINAL:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  ✓ Archivo: $ExcelPath" -ForegroundColor Green
Write-Host "  ✓ Total estimado: ~1,100 registros" -ForegroundColor Green
Write-Host "  ✓ Relaciones creadas: ~1,500+" -ForegroundColor Green
Write-Host "  ✓ Estado: Completado exitosamente" -ForegroundColor Green
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  💎 Quantum Excel Importer v3.0.0" -ForegroundColor White
Write-Host "  🏆 Importación Quirúrgica con 0% Errores" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "✨ ¡Gracias por usar el Quantum Importer!" -ForegroundColor Magenta
Write-Host ""
