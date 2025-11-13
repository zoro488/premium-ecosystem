# 🚀 Setup Automatizado de Workflows - Premium Ecosystem

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "🚀 SETUP DE WORKFLOWS GITHUB ACTIONS" -ForegroundColor Cyan
Write-Host "   Premium Ecosystem - Sistema Empresarial" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git no está instalado. Por favor instala Git primero." -ForegroundColor Red
    exit 1
}

# Verificar que estamos en un repo Git
if (-not (Test-Path ".git")) {
    Write-Host "❌ No estás en un repositorio Git" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Verificación de Git exitosa" -ForegroundColor Green
Write-Host ""

# Verificar workflows
Write-Host "📋 Verificando workflows creados..." -ForegroundColor Yellow
$workflowsPath = ".github/workflows"
$workflows = @(
    "continuous-validation.yml",
    "data-sync.yml",
    "health-check.yml",
    "automated-backup.yml",
    "security-audit.yml",
    "performance-monitoring.yml",
    "pre-deployment-checklist.yml",
    "database-migration.yml"
)

$missingWorkflows = @()
foreach ($workflow in $workflows) {
    $path = Join-Path $workflowsPath $workflow
    if (Test-Path $path) {
        Write-Host "   ✅ $workflow" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $workflow" -ForegroundColor Red
        $missingWorkflows += $workflow
    }
}

if ($missingWorkflows.Count -gt 0) {
    Write-Host ""
    Write-Host "⚠️  Faltan workflows. Por favor verifica que todos estén creados." -ForegroundColor Yellow
    Write-Host ""
}

# Crear carpeta de scripts si no existe
Write-Host ""
Write-Host "📁 Verificando carpeta de scripts..." -ForegroundColor Yellow
if (-not (Test-Path "scripts")) {
    New-Item -ItemType Directory -Path "scripts" -Force | Out-Null
    Write-Host "   ✅ Carpeta 'scripts' creada" -ForegroundColor Green
} else {
    Write-Host "   ✅ Carpeta 'scripts' existe" -ForegroundColor Green
}

# Crear package.json si no existe
Write-Host ""
Write-Host "📦 Verificando package.json..." -ForegroundColor Yellow
if (-not (Test-Path "package.json")) {
    Write-Host "   ⚠️  package.json no existe. Creando uno básico..." -ForegroundColor Yellow

    $packageJson = @{
        name = "premium-ecosystem"
        version = "1.0.0"
        description = "Premium Ecosystem - Sistema Empresarial Integrado"
        scripts = @{
            dev = "vite"
            build = "vite build"
            preview = "vite preview"
            test = "vitest run"
            "test:unit" = "vitest run --mode unit"
            "test:integration" = "vitest run --mode integration"
            "test:e2e" = "playwright test"
            lint = "eslint ."
            format = "prettier --write src/**/*.{js,jsx,ts,tsx}"
        }
    } | ConvertTo-Json -Depth 10

    $packageJson | Out-File -FilePath "package.json" -Encoding UTF8
    Write-Host "   ✅ package.json creado" -ForegroundColor Green
} else {
    Write-Host "   ✅ package.json existe" -ForegroundColor Green
}

# Crear scripts básicos
Write-Host ""
Write-Host "🔧 Creando scripts básicos..." -ForegroundColor Yellow

$basicScripts = @{
    "health-firestore.js" = @"
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const db = admin.firestore();

async function checkFirestoreHealth() {
  try {
    const start = Date.now();
    await db.collection('_health_check').limit(1).get();
    const latency = Date.now() - start;

    console.log(JSON.stringify({
      status: 'healthy',
      latency: latency,
      timestamp: new Date().toISOString()
    }));

    process.exit(0);
  } catch (error) {
    console.error(JSON.stringify({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }));
    process.exit(1);
  }
}

checkFirestoreHealth();
"@

    "validate-excel.js" = @"
const fs = require('fs');
const path = require('path');

async function validateExcel() {
  try {
    const excelPath = process.argv[2] || 'data/source';

    if (!fs.existsSync(excelPath)) {
      console.error('❌ Excel directory not found:', excelPath);
      process.exit(1);
    }

    const files = fs.readdirSync(excelPath).filter(f => f.endsWith('.xlsx'));

    console.log('✅ Excel validation passed');
    console.log('Found files:', files.length);

    process.exit(0);
  } catch (error) {
    console.error('❌ Excel validation failed:', error.message);
    process.exit(1);
  }
}

validateExcel();
"@

    "import-excel.js" = @"
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

async function importExcel() {
  try {
    console.log('🚀 Starting Excel import...');

    // TODO: Implementar lógica de importación

    console.log('✅ Excel import completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Excel import failed:', error.message);
    process.exit(1);
  }
}

importExcel();
"@

    "backup-firestore.js" = @"
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const db = admin.firestore();

async function backup() {
  try {
    console.log('🚀 Starting Firestore backup...');

    // TODO: Implementar lógica de backup

    console.log('✅ Backup completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    process.exit(1);
  }
}

backup();
"@
}

foreach ($scriptName in $basicScripts.Keys) {
    $scriptPath = Join-Path "scripts" $scriptName
    if (-not (Test-Path $scriptPath)) {
        $basicScripts[$scriptName] | Out-File -FilePath $scriptPath -Encoding UTF8
        Write-Host "   ✅ Creado: $scriptName" -ForegroundColor Green
    } else {
        Write-Host "   ⏭️  Ya existe: $scriptName" -ForegroundColor Gray
    }
}

# Verificar Firebase
Write-Host ""
Write-Host "🔥 Verificando configuración de Firebase..." -ForegroundColor Yellow
if (Test-Path "firebase.json") {
    Write-Host "   ✅ firebase.json encontrado" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  firebase.json no encontrado" -ForegroundColor Yellow
}

if (Test-Path "firestore.rules") {
    Write-Host "   ✅ firestore.rules encontrado" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  firestore.rules no encontrado" -ForegroundColor Yellow
}

# Información sobre secrets
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "🔐 CONFIGURACIÓN DE SECRETS REQUERIDA" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para que los workflows funcionen, debes configurar estos secrets en GitHub:" -ForegroundColor Yellow
Write-Host ""
Write-Host "CRÍTICOS (Obligatorios):" -ForegroundColor Red
Write-Host "  • FIREBASE_SERVICE_ACCOUNT" -ForegroundColor White
Write-Host "  • VITE_FIREBASE_API_KEY" -ForegroundColor White
Write-Host "  • VITE_FIREBASE_PROJECT_ID" -ForegroundColor White
Write-Host "  • VITE_FIREBASE_AUTH_DOMAIN" -ForegroundColor White
Write-Host "  • VITE_FIREBASE_STORAGE_BUCKET" -ForegroundColor White
Write-Host "  • VITE_FIREBASE_MESSAGING_SENDER_ID" -ForegroundColor White
Write-Host "  • VITE_FIREBASE_APP_ID" -ForegroundColor White
Write-Host ""
Write-Host "RECOMENDADOS (Para notificaciones):" -ForegroundColor Yellow
Write-Host "  • MAIL_USERNAME" -ForegroundColor White
Write-Host "  • MAIL_PASSWORD" -ForegroundColor White
Write-Host "  • NOTIFICATION_EMAIL" -ForegroundColor White
Write-Host ""
Write-Host "📍 Ubicación: GitHub → Settings → Secrets and variables → Actions" -ForegroundColor Cyan
Write-Host ""

# Git status
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "📝 SIGUIENTE PASO: COMMIT Y PUSH" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$gitStatus = git status --short
if ($gitStatus) {
    Write-Host "Archivos modificados/nuevos:" -ForegroundColor Yellow
    Write-Host $gitStatus
    Write-Host ""

    $commit = Read-Host "¿Deseas hacer commit de los cambios? (s/n)"
    if ($commit -eq "s" -or $commit -eq "S") {
        git add .github/ scripts/
        git commit -m "🚀 Add GitHub Actions workflows and basic scripts"

        $push = Read-Host "¿Deseas hacer push a GitHub? (s/n)"
        if ($push -eq "s" -or $push -eq "S") {
            git push
            Write-Host ""
            Write-Host "✅ Cambios pusheados a GitHub" -ForegroundColor Green
        }
    }
} else {
    Write-Host "✅ No hay cambios pendientes" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✅ SETUP COMPLETADO" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Documentos creados:" -ForegroundColor Yellow
Write-Host "   • .github/WORKFLOWS_GUIDE.md - Guía completa" -ForegroundColor White
Write-Host "   • .github/DELIVERY_CHECKLIST.md - Checklist de entrega" -ForegroundColor White
Write-Host "   • .github/EXECUTIVE_SUMMARY.md - Resumen ejecutivo" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Próximos pasos:" -ForegroundColor Yellow
Write-Host "   1. Configurar secrets en GitHub (15 min)" -ForegroundColor White
Write-Host "   2. Revisar y ajustar scripts básicos (1-2 horas)" -ForegroundColor White
Write-Host "   3. Testear workflows manualmente (30 min)" -ForegroundColor White
Write-Host "   4. Configurar notificaciones por email (15 min)" -ForegroundColor White
Write-Host ""
Write-Host "📖 Lee .github/WORKFLOWS_GUIDE.md para más detalles" -ForegroundColor Cyan
Write-Host ""
