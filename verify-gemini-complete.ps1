# ====================================
# VERIFICACIÓN RÁPIDA - GEMINI SETUP
# ====================================
# Script para verificar que todo está configurado correctamente

Write-Host "`n🔍 VERIFICANDO CONFIGURACIÓN DE GEMINI..." -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor DarkGray

$errors = @()
$warnings = @()
$success = @()

# ====================================
# 1. VERIFICAR ARCHIVOS CORE
# ====================================
Write-Host "`n📁 Verificando archivos core..." -ForegroundColor Yellow

$coreFiles = @(
  "src/lib/gemini/config.js",
  "src/hooks/useGemini.js",
  "src/services/geminiAI.js",
  "src/services/analytics.js",
  "src/components/ai/GeminiAssistant.jsx",
  "gemini-cli.js",
  ".env"
)

foreach ($file in $coreFiles) {
  if (Test-Path $file) {
    Write-Host "  ✅ $file" -ForegroundColor Green
    $success += "Archivo $file existe"
  }
  else {
    Write-Host "  ❌ $file" -ForegroundColor Red
    $errors += "Falta archivo: $file"
  }
}

# ====================================
# 2. VERIFICAR DEPENDENCIAS
# ====================================
Write-Host "`n📦 Verificando dependencias..." -ForegroundColor Yellow

try {
  $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json

  if ($packageJson.dependencies.'@google/generative-ai') {
    $version = $packageJson.dependencies.'@google/generative-ai'
    Write-Host "  ✅ @google/generative-ai ($version)" -ForegroundColor Green
    $success += "@google/generative-ai instalado"
  }
  else {
    Write-Host "  ❌ @google/generative-ai NO instalado" -ForegroundColor Red
    $errors += "Falta @google/generative-ai en package.json"
  }

  # Verificar node_modules
  if (Test-Path "node_modules/@google/generative-ai") {
    Write-Host "  ✅ node_modules/@google/generative-ai" -ForegroundColor Green
  }
  else {
    Write-Host "  ⚠️  node_modules/@google/generative-ai NO encontrado" -ForegroundColor Yellow
    $warnings += "Ejecuta: npm install"
  }
}
catch {
  Write-Host "  ❌ Error leyendo package.json" -ForegroundColor Red
  $errors += "Error al verificar package.json"
}

# ====================================
# 3. VERIFICAR API KEY
# ====================================
Write-Host "`n🔑 Verificando API Key..." -ForegroundColor Yellow

if (Test-Path ".env") {
  $envContent = Get-Content ".env" -Raw

  if ($envContent -match 'VITE_GEMINI_API_KEY=(\S+)') {
    $apiKey = $matches[1]
    $keyLength = $apiKey.Length
    $keyPreview = $apiKey.Substring(0, [Math]::Min(10, $keyLength)) + "..."

    Write-Host "  ✅ VITE_GEMINI_API_KEY encontrada" -ForegroundColor Green
    Write-Host "     Preview: $keyPreview" -ForegroundColor DarkGray
    Write-Host "     Longitud: $keyLength caracteres" -ForegroundColor DarkGray

    if ($keyLength -eq 39) {
      Write-Host "     ✅ Longitud correcta (39 chars)" -ForegroundColor Green
      $success += "API Key configurada correctamente"
    }
    else {
      Write-Host "     ⚠️  Longitud inusual (esperado: 39)" -ForegroundColor Yellow
      $warnings += "API Key tiene longitud inusual"
    }
  }
  else {
    Write-Host "  ❌ VITE_GEMINI_API_KEY NO encontrada en .env" -ForegroundColor Red
    $errors += "Falta VITE_GEMINI_API_KEY en .env"
  }
}
else {
  Write-Host "  ❌ Archivo .env NO encontrado" -ForegroundColor Red
  $errors += "Falta archivo .env"
}

# ====================================
# 4. VERIFICAR CLI
# ====================================
Write-Host "`n⚡ Verificando CLI..." -ForegroundColor Yellow

if (Test-Path "gemini-cli.js") {
  Write-Host "  ✅ gemini-cli.js existe" -ForegroundColor Green

  # Verificar permisos de ejecución
  try {
    $cliContent = Get-Content "gemini-cli.js" -Raw

    if ($cliContent -match '#!/usr/bin/env node') {
      Write-Host "  ✅ Shebang presente" -ForegroundColor Green
    }

    if ($cliContent -match 'GoogleGenerativeAI') {
      Write-Host "  ✅ Import de SDK correcto" -ForegroundColor Green
    }

    $success += "CLI configurado correctamente"
  }
  catch {
    $warnings += "No se pudo leer gemini-cli.js"
  }
}
else {
  Write-Host "  ❌ gemini-cli.js NO encontrado" -ForegroundColor Red
  $errors += "Falta gemini-cli.js"
}

# ====================================
# 5. VERIFICAR ALIASES (POWERSHELL)
# ====================================
Write-Host "`n🔧 Verificando aliases de PowerShell..." -ForegroundColor Yellow

if (Test-Path $PROFILE) {
  $profileContent = Get-Content $PROFILE -Raw

  if ($profileContent -match 'GEMINI AI - ALIASES') {
    Write-Host "  ✅ Aliases configurados en perfil" -ForegroundColor Green

    # Verificar funciones específicas
    $aliases = @('gemini', 'gask', 'gcode', 'gchat')
    foreach ($alias in $aliases) {
      if ($profileContent -match "function $alias") {
        Write-Host "     ✅ $alias" -ForegroundColor Green
      }
      else {
        Write-Host "     ⚠️  $alias no encontrado" -ForegroundColor Yellow
      }
    }

    $success += "Aliases de PowerShell configurados"
  }
  else {
    Write-Host "  ⚠️  Aliases NO encontrados en perfil" -ForegroundColor Yellow
    Write-Host "     Ejecuta: .\setup-gemini-aliases.ps1" -ForegroundColor Cyan
    $warnings += "Ejecuta setup-gemini-aliases.ps1"
  }
}
else {
  Write-Host "  ⚠️  Perfil de PowerShell no existe" -ForegroundColor Yellow
  $warnings += "Perfil de PowerShell no configurado"
}

# ====================================
# 6. VERIFICAR VS CODE SETTINGS
# ====================================
Write-Host "`n⚙️  Verificando VS Code settings..." -ForegroundColor Yellow

if (Test-Path ".vscode/settings.json") {
  Write-Host "  ✅ .vscode/settings.json existe" -ForegroundColor Green

  try {
    $settings = Get-Content ".vscode/settings.json" -Raw | ConvertFrom-Json

    if ($settings.'github.copilot.enable') {
      Write-Host "  ✅ Copilot habilitado" -ForegroundColor Green
    }

    $success += "VS Code configurado"
  }
  catch {
    Write-Host "  ⚠️  Error parseando settings.json" -ForegroundColor Yellow
    $warnings += "Revisa sintaxis de settings.json"
  }
}
else {
  Write-Host "  ⚠️  .vscode/settings.json no encontrado" -ForegroundColor Yellow
  $warnings += "Configuración de VS Code no encontrada"
}

# ====================================
# 7. VERIFICAR DOCUMENTACIÓN
# ====================================
Write-Host "`n📚 Verificando documentación..." -ForegroundColor Yellow

$docs = @(
  "GEMINI_IMPLEMENTATION_GUIDE.md",
  "GEMINI_CLI_GUIDE.md",
  "GEMINI_API_SETUP.md",
  "GEMINI_FINAL_SUMMARY.md"
)

$docCount = 0
foreach ($doc in $docs) {
  if (Test-Path $doc) {
    $docCount++
  }
}

Write-Host "  ✅ $docCount/$($docs.Count) documentos disponibles" -ForegroundColor Green

# ====================================
# 8. TEST DE CONECTIVIDAD
# ====================================
Write-Host "`n🌐 Verificando conectividad..." -ForegroundColor Yellow

try {
  $ping = Test-Connection -ComputerName "google.com" -Count 1 -Quiet
  if ($ping) {
    Write-Host "  ✅ Conexión a internet OK" -ForegroundColor Green
    $success += "Conectividad verificada"
  }
  else {
    Write-Host "  ❌ Sin conexión a internet" -ForegroundColor Red
    $errors += "No hay conexión a internet"
  }
}
catch {
  Write-Host "  ⚠️  No se pudo verificar conectividad" -ForegroundColor Yellow
}

# ====================================
# 9. VERIFICAR NODE.JS
# ====================================
Write-Host "`n📦 Verificando Node.js..." -ForegroundColor Yellow

try {
  $nodeVersion = node --version
  Write-Host "  ✅ Node.js $nodeVersion" -ForegroundColor Green

  $npmVersion = npm --version
  Write-Host "  ✅ npm $npmVersion" -ForegroundColor Green

  $success += "Node.js configurado"
}
catch {
  Write-Host "  ❌ Node.js no encontrado" -ForegroundColor Red
  $errors += "Node.js no está instalado"
}

# ====================================
# RESUMEN FINAL
# ====================================
Write-Host "`n" + ("=" * 60) -ForegroundColor DarkGray
Write-Host "📊 RESUMEN DE VERIFICACIÓN" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor DarkGray

Write-Host "`n✅ EXITOSOS: $($success.Count)" -ForegroundColor Green
if ($success.Count -gt 0) {
  foreach ($s in $success) {
    Write-Host "   • $s" -ForegroundColor Green
  }
}

if ($warnings.Count -gt 0) {
  Write-Host "`n⚠️  ADVERTENCIAS: $($warnings.Count)" -ForegroundColor Yellow
  foreach ($w in $warnings) {
    Write-Host "   • $w" -ForegroundColor Yellow
  }
}

if ($errors.Count -gt 0) {
  Write-Host "`n❌ ERRORES: $($errors.Count)" -ForegroundColor Red
  foreach ($e in $errors) {
    Write-Host "   • $e" -ForegroundColor Red
  }
}

# ====================================
# ESTADO GENERAL
# ====================================
Write-Host "`n" + ("=" * 60) -ForegroundColor DarkGray

if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
  Write-Host "🎉 ¡TODO PERFECTO! Sistema completamente configurado" -ForegroundColor Green
  Write-Host "`n📝 PRÓXIMOS PASOS:" -ForegroundColor Cyan
  Write-Host "   1. Ejecuta: node gemini-cli.js help" -ForegroundColor White
  Write-Host "   2. Prueba: node gemini-cli.js ask `"test`"" -ForegroundColor White
  Write-Host "   3. O inicia chat: node gemini-cli.js chat" -ForegroundColor White
}
elseif ($errors.Count -eq 0) {
  Write-Host "✅ CONFIGURACIÓN BÁSICA OK (con advertencias)" -ForegroundColor Yellow
  Write-Host "`n📝 RECOMENDACIONES:" -ForegroundColor Cyan
  Write-Host "   1. Revisa las advertencias arriba" -ForegroundColor White
  Write-Host "   2. Ejecuta: .\setup-gemini-aliases.ps1" -ForegroundColor White
  Write-Host "   3. Prueba: node gemini-cli.js help" -ForegroundColor White
}
else {
  Write-Host "❌ HAY ERRORES QUE CORREGIR" -ForegroundColor Red
  Write-Host "`n📝 ACCIONES REQUERIDAS:" -ForegroundColor Cyan
  Write-Host "   1. Revisa los errores listados arriba" -ForegroundColor White
  Write-Host "   2. Consulta: GEMINI_API_SETUP.md" -ForegroundColor White
  Write-Host "   3. Ejecuta: npm install (si falta SDK)" -ForegroundColor White
}

Write-Host "`n" + ("=" * 60) -ForegroundColor DarkGray
Write-Host ""

# ====================================
# TEST RÁPIDO OPCIONAL
# ====================================
if ($errors.Count -eq 0) {
  Write-Host "¿Quieres hacer un test rápido del CLI? (S/N): " -ForegroundColor Cyan -NoNewline
  $response = Read-Host

  if ($response -eq 'S' -or $response -eq 's' -or $response -eq 'Y' -or $response -eq 'y') {
    Write-Host "`n🧪 Ejecutando test..." -ForegroundColor Cyan
    node gemini-cli.js help
  }
}
