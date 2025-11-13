<#
.SYNOPSIS
    Helper Script - Verificación y Setup del Sistema CI/CD

.DESCRIPTION
    Este script verifica que todo esté configurado correctamente y ayuda con el setup

.EXAMPLE
    .\setup-helper.ps1
#>

Write-Host "
╔══════════════════════════════════════════════════════════════╗
║  🚀 PREMIUM ECOSYSTEM - CI/CD SETUP HELPER                  ║
╚══════════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

Write-Host "`n📋 Verificando estado del sistema...`n" -ForegroundColor Yellow

# Variables de estado
$allGood = $true
$warnings = @()
$errors = @()

# 1. Verificar workflows
Write-Host "1️⃣  Verificando workflows..." -ForegroundColor Cyan
$workflowsPath = ".\.github\workflows"
if (Test-Path $workflowsPath) {
    $workflows = Get-ChildItem -Path $workflowsPath -Filter "*.yml"
    Write-Host "   ✅ Encontrados $($workflows.Count) workflows" -ForegroundColor Green

    $expectedWorkflows = @(
        "continuous-validation.yml",
        "data-sync.yml",
        "health-check.yml",
        "automated-backup.yml",
        "security-audit.yml",
        "performance-monitoring.yml",
        "pre-deployment-checklist.yml",
        "database-migration.yml"
    )

    foreach ($expected in $expectedWorkflows) {
        if ($workflows.Name -contains $expected) {
            Write-Host "      ✓ $expected" -ForegroundColor DarkGreen
        } else {
            Write-Host "      ✗ $expected (FALTANTE)" -ForegroundColor Red
            $errors += "Workflow faltante: $expected"
            $allGood = $false
        }
    }
} else {
    Write-Host "   ❌ Directorio de workflows no encontrado" -ForegroundColor Red
    $errors += "Directorio .github/workflows no existe"
    $allGood = $false
}

# 2. Verificar scripts
Write-Host "`n2️⃣  Verificando scripts..." -ForegroundColor Cyan
$scriptsPath = ".\scripts"
if (Test-Path $scriptsPath) {
    $scripts = Get-ChildItem -Path $scriptsPath -Filter "*.js" | Where-Object {
        $_.Name -match '^(health|validate|import|export|backup|db-|metrics)'
    }
    Write-Host "   ✅ Encontrados $($scripts.Count) scripts principales" -ForegroundColor Green

    $expectedScripts = @(
        "health-firestore.js",
        "health-auth.js",
        "health-storage.js",
        "health-api.js",
        "validate-excel.js",
        "validate-sync.js",
        "import-excel.js",
        "export-excel.js",
        "backup-firestore.js",
        "backup-auth.js",
        "backup-storage.js",
        "backup-config.js",
        "db-validate-schema.js",
        "db-analyze-performance.js",
        "metrics-bundle.js",
        "metrics-api.js"
    )

    $foundCount = 0
    foreach ($expected in $expectedScripts) {
        if (Test-Path (Join-Path $scriptsPath $expected)) {
            $foundCount++
        }
    }

    Write-Host "      ✓ $foundCount/$($expectedScripts.Count) scripts encontrados" -ForegroundColor DarkGreen

    if ($foundCount -lt $expectedScripts.Count) {
        $warnings += "Faltan $($expectedScripts.Count - $foundCount) scripts"
    }
} else {
    Write-Host "   ⚠️  Directorio de scripts no encontrado" -ForegroundColor Yellow
    $warnings += "Directorio scripts no existe"
}

# 3. Verificar package.json
Write-Host "`n3️⃣  Verificando package.json..." -ForegroundColor Cyan
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json

    $npmScripts = @(
        "health:firestore",
        "health:auth",
        "validate:excel",
        "backup:firestore",
        "db:validate-schema",
        "metrics:bundle"
    )

    $foundScripts = 0
    foreach ($script in $npmScripts) {
        if ($packageJson.scripts.PSObject.Properties.Name -contains $script) {
            $foundScripts++
        }
    }

    Write-Host "   ✅ $foundScripts/$($npmScripts.Count) npm scripts críticos configurados" -ForegroundColor Green

    if ($foundScripts -lt $npmScripts.Count) {
        $warnings += "Faltan algunos npm scripts"
    }
} else {
    Write-Host "   ❌ package.json no encontrado" -ForegroundColor Red
    $errors += "package.json no existe"
    $allGood = $false
}

# 4. Verificar documentación
Write-Host "`n4️⃣  Verificando documentación..." -ForegroundColor Cyan
$docsPath = ".\.github"
$docs = @(
    "README.md",
    "EXECUTIVE_SUMMARY.md",
    "DELIVERY_CHECKLIST.md",
    "WORKFLOWS_GUIDE.md",
    "SECRETS_SETUP_GUIDE.md"
)

$foundDocs = 0
foreach ($doc in $docs) {
    $docPath = Join-Path $docsPath $doc
    if (Test-Path $docPath) {
        $foundDocs++
        Write-Host "      ✓ $doc" -ForegroundColor DarkGreen
    } else {
        Write-Host "      ✗ $doc" -ForegroundColor Yellow
    }
}

Write-Host "   ✅ $foundDocs/$($docs.Count) documentos encontrados" -ForegroundColor Green

# 5. Verificar dependencias
Write-Host "`n5️⃣  Verificando dependencias..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
    Write-Host "   ✅ node_modules existe" -ForegroundColor Green

    # Verificar firebase-admin
    if (Test-Path "node_modules\firebase-admin") {
        Write-Host "      ✓ firebase-admin instalado" -ForegroundColor DarkGreen
    } else {
        Write-Host "      ⚠️  firebase-admin no encontrado" -ForegroundColor Yellow
        $warnings += "firebase-admin no está instalado"
    }

    # Verificar xlsx
    if (Test-Path "node_modules\xlsx") {
        Write-Host "      ✓ xlsx instalado" -ForegroundColor DarkGreen
    } else {
        Write-Host "      ⚠️  xlsx no encontrado" -ForegroundColor Yellow
        $warnings += "xlsx no está instalado"
    }
} else {
    Write-Host "   ⚠️  node_modules no existe - ejecuta 'npm install'" -ForegroundColor Yellow
    $warnings += "Necesitas ejecutar: npm install"
}

# 6. Verificar Git
Write-Host "`n6️⃣  Verificando Git..." -ForegroundColor Cyan
try {
    $gitStatus = git status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Repositorio Git configurado" -ForegroundColor Green

        # Ver si hay cambios sin commit
        $changes = git status --porcelain
        if ($changes) {
            $changedFiles = ($changes | Measure-Object).Count
            Write-Host "      ⚠️  $changedFiles archivos con cambios sin commit" -ForegroundColor Yellow
            $warnings += "Hay cambios sin commit"
        } else {
            Write-Host "      ✓ Sin cambios pendientes" -ForegroundColor DarkGreen
        }
    }
} catch {
    Write-Host "   ⚠️  Git no configurado o no instalado" -ForegroundColor Yellow
    $warnings += "Git no está disponible"
}

# Resumen final
Write-Host "`n
╔══════════════════════════════════════════════════════════════╗
║  📊 RESUMEN DE VERIFICACIÓN                                  ║
╚══════════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

if ($allGood -and $warnings.Count -eq 0) {
    Write-Host "✅ TODO PERFECTO - Sistema 100% configurado`n" -ForegroundColor Green
} elseif ($errors.Count -eq 0) {
    Write-Host "⚠️  Sistema funcional con algunas advertencias`n" -ForegroundColor Yellow
} else {
    Write-Host "❌ Se encontraron errores críticos`n" -ForegroundColor Red
}

if ($errors.Count -gt 0) {
    Write-Host "🔴 ERRORES CRÍTICOS:" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "   - $error" -ForegroundColor Red
    }
    Write-Host ""
}

if ($warnings.Count -gt 0) {
    Write-Host "⚠️  ADVERTENCIAS:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "   - $warning" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Próximos pasos
Write-Host "
╔══════════════════════════════════════════════════════════════╗
║  🎯 PRÓXIMOS PASOS                                           ║
╚══════════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

if ($warnings -contains "Necesitas ejecutar: npm install") {
    Write-Host "1️⃣  Instalar dependencias:" -ForegroundColor Yellow
    Write-Host "   npm install`n" -ForegroundColor White
}

if ($warnings -contains "Hay cambios sin commit") {
    Write-Host "2️⃣  Commit y push de cambios:" -ForegroundColor Yellow
    Write-Host "   git add ." -ForegroundColor White
    Write-Host '   git commit -m "feat: Implementar CI/CD completo"' -ForegroundColor White
    Write-Host "   git push origin main`n" -ForegroundColor White
}

Write-Host "3️⃣  Configurar secrets en GitHub:" -ForegroundColor Yellow
Write-Host "   - Ve a: Settings → Secrets and variables → Actions" -ForegroundColor White
Write-Host "   - Lee: .github\SECRETS_SETUP_GUIDE.md`n" -ForegroundColor White

Write-Host "4️⃣  Probar scripts localmente:" -ForegroundColor Yellow
Write-Host "   npm run health:firestore" -ForegroundColor White
Write-Host "   npm run health:auth`n" -ForegroundColor White

Write-Host "5️⃣  Verificar workflows en GitHub:" -ForegroundColor Yellow
Write-Host "   - Ve a: Actions tab" -ForegroundColor White
Write-Host "   - Ejecuta: Pre-Deployment Checklist`n" -ForegroundColor White

Write-Host "
╔══════════════════════════════════════════════════════════════╗
║  📚 DOCUMENTACIÓN                                            ║
╚══════════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

Write-Host "Índice general:       .github\README.md" -ForegroundColor White
Write-Host "Setup de secrets:     .github\SECRETS_SETUP_GUIDE.md" -ForegroundColor White
Write-Host "Guía técnica:         .github\WORKFLOWS_GUIDE.md" -ForegroundColor White
Write-Host "Checklist entrega:    .github\DELIVERY_CHECKLIST.md" -ForegroundColor White
Write-Host "Resumen ejecutivo:    .github\EXECUTIVE_SUMMARY.md" -ForegroundColor White

Write-Host "`n✨ Sistema listo para producción!`n" -ForegroundColor Green
