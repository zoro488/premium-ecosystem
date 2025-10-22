#!/usr/bin/env pwsh
# 🛑 STOP - Premium Ecosystem
# Detiene todos los procesos relacionados

Clear-Host
Write-Host "`n🛑 Deteniendo Premium Ecosystem..." -ForegroundColor Yellow

# Detener procesos Node/Vite
$processes = Get-Process | Where-Object {
    $_.ProcessName -like "*node*" -or
    $_.ProcessName -like "*vite*" -or
    $_.ProcessName -like "*npm*"
}

if ($processes) {
    Write-Host "🔍 Encontrados $($processes.Count) procesos activos" -ForegroundColor Cyan
    $processes | ForEach-Object {
        Write-Host "  ⏹️  Deteniendo: $($_.ProcessName) (PID: $($_.Id))" -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
    Write-Host "✅ Todos los procesos detenidos" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No hay procesos activos" -ForegroundColor Cyan
}

Write-Host "`n✅ Premium Ecosystem detenido correctamente`n" -ForegroundColor Green
