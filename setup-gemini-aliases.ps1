# ====================================
# GEMINI - CONFIGURACIÓN DE ALIASES
# ====================================
# Script para configurar aliases globales de Gemini CLI

Write-Host "🔧 Configurando aliases de Gemini CLI..." -ForegroundColor Cyan

# Ruta del perfil de PowerShell
$profilePath = $PROFILE.CurrentUserAllHosts

# Crear el archivo de perfil si no existe
if (-not (Test-Path $profilePath)) {
  New-Item -Path $profilePath -ItemType File -Force | Out-Null
  Write-Host "✅ Perfil de PowerShell creado" -ForegroundColor Green
}

# Ruta absoluta al proyecto
$projectPath = $PSScriptRoot

# Aliases a agregar
$aliases = @"

# ====================================
# GEMINI AI - ALIASES
# ====================================
function gemini { node "$projectPath\gemini-cli.js" `$args }
function gask { node "$projectPath\gemini-cli.js" ask `$args }
function gcode { node "$projectPath\gemini-cli.js" code `$args }
function gchat { node "$projectPath\gemini-cli.js" chat }
function ganalyze { node "$projectPath\gemini-cli.js" analyze `$args }
function gexplain { node "$projectPath\gemini-cli.js" explain `$args }
function gfix { node "$projectPath\gemini-cli.js" fix `$args }

Write-Host "🧠 Gemini CLI cargado - Usa 'gemini help' para ver comandos" -ForegroundColor Magenta
"@

# Verificar si ya está configurado
$currentProfile = Get-Content $profilePath -Raw -ErrorAction SilentlyContinue

if ($currentProfile -and $currentProfile.Contains("GEMINI AI - ALIASES")) {
  Write-Host "⚠️  Los aliases ya están configurados" -ForegroundColor Yellow
}
else {
  # Agregar aliases
  Add-Content -Path $profilePath -Value $aliases
  Write-Host "✅ Aliases agregados al perfil de PowerShell" -ForegroundColor Green
}

Write-Host ""
Write-Host "📝 ALIASES DISPONIBLES:" -ForegroundColor Cyan
Write-Host "  gemini      - CLI principal" -ForegroundColor White
Write-Host "  gask        - Hacer preguntas rápidas" -ForegroundColor White
Write-Host "  gcode       - Generar código" -ForegroundColor White
Write-Host "  gchat       - Modo chat interactivo" -ForegroundColor White
Write-Host "  ganalyze    - Analizar archivos" -ForegroundColor White
Write-Host "  gexplain    - Explicar código" -ForegroundColor White
Write-Host "  gfix        - Sugerir mejoras" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANTE: Reinicia la terminal o ejecuta:" -ForegroundColor Yellow
Write-Host "   . `$PROFILE" -ForegroundColor White
Write-Host ""
