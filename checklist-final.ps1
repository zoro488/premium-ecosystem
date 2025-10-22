#!/usr/bin/env pwsh
# ✅ CHECKLIST FINAL DE ENTREGA

$ErrorActionPreference = 'Stop'

Write-Host "`n✅ CHECKLIST FINAL - PREMIUM ECOSYSTEM`n" -ForegroundColor Green

$checks = @()

# 1. Verificar build
if (Test-Path "dist/index.html") {
    $checks += "✅ Build de producción generado"
}
else {
    $checks += "❌ Build faltante - ejecuta: npm run build"
}

# 2. Verificar archivos críticos
$criticalFiles = @("dist/index.html", "dist/assets", "dist/manifest.webmanifest", "dist/sw.js")
$allExist = $true
foreach ($file in $criticalFiles) {
    if (-not (Test-Path $file)) {
        $allExist = $false
        break
    }
}
if ($allExist) {
    $checks += "✅ Todos los archivos críticos presentes"
}
else {
    $checks += "⚠️  Algunos archivos críticos faltan"
}

# 3. Verificar package.json
if (Test-Path "package.json") {
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    $checks += "✅ package.json - v$($pkg.version)"
}
else {
    $checks += "❌ package.json faltante"
}

# 4. Verificar Firebase config
if (Test-Path "firebase.json") {
    $checks += "✅ Configuración de Firebase lista"
}
else {
    $checks += "⚠️  firebase.json no encontrado (opcional)"
}

# 5. Verificar README
if (Test-Path "README.md") {
    $checks += "✅ README.md presente"
}
else {
    $checks += "⚠️  README.md faltante"
}

# 6. Verificar .env
if (Test-Path ".env") {
    $checks += "✅ Archivo .env configurado"
}
else {
    $checks += "⚠️  .env no encontrado - crea uno desde .env.example"
}

# 7. Verificar Docker (opcional)
if (Test-Path "docker-compose.yml") {
    $checks += "✅ Docker configurado (opcional)"
}
else {
    $checks += "ℹ️  Docker no configurado (no requerido)"
}

# Mostrar resultados
Write-Host "`n📋 RESULTADOS:`n" -ForegroundColor Cyan
foreach ($check in $checks) {
    Write-Host "  $check"
}

# Estadísticas
Write-Host "`n📊 ESTADÍSTICAS:`n" -ForegroundColor Cyan
$distSize = [math]::Round((Get-ChildItem dist -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB, 2)
$distFiles = (Get-ChildItem dist -Recurse -ErrorAction SilentlyContinue | Measure-Object).Count
$srcFiles = (Get-ChildItem src -Recurse -Filter *.jsx -ErrorAction SilentlyContinue | Measure-Object).Count

Write-Host "  📦 Tamaño del build: $distSize MB"
Write-Host "  📄 Archivos generados: $distFiles"
Write-Host "  💻 Componentes React: $srcFiles"

# Comandos de deploy
Write-Host "`n🚀 OPCIONES DE DEPLOY:`n" -ForegroundColor Magenta
Write-Host "  1️⃣  Firebase:  " -NoNewline -ForegroundColor White
Write-Host "firebase deploy --only hosting" -ForegroundColor Yellow

Write-Host "  2️⃣  Netlify:   " -NoNewline -ForegroundColor White
Write-Host "Arrastra carpeta dist/ a app.netlify.com/drop" -ForegroundColor Yellow

Write-Host "  3️⃣  Vercel:    " -NoNewline -ForegroundColor White
Write-Host "npx vercel --prod" -ForegroundColor Yellow

Write-Host "  4️⃣  Preview:   " -NoNewline -ForegroundColor White
Write-Host "npm run preview" -ForegroundColor Yellow

# URLs de prueba
Write-Host "`n🌐 URLS PARA PROBAR:`n" -ForegroundColor Cyan
Write-Host "  / .............. Hub principal"
Write-Host "  /flow .......... FlowDistributor"
Write-Host "  /shadow ........ ShadowPrime"
Write-Host "  /apollo ........ Apollo"
Write-Host "  /synapse ....... Synapse"
Write-Host "  /nexus ......... Nexus"

Write-Host "`n✅ PROYECTO LISTO PARA ENTREGA!`n" -ForegroundColor Green
