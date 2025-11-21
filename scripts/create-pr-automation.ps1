#!/usr/bin/env pwsh
<#
.SYNOPSIS
    🚀 Script para crear Pull Request automáticamente

.DESCRIPTION
    Crea un branch, commit los cambios y abre un PR en GitHub
    con toda la documentación necesaria.

.EXAMPLE
    .\create-pr-automation.ps1
#>

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

Write-Host "`n🚀 CREATING PULL REQUEST - JSON AUTOMATION`n" -ForegroundColor Cyan

# Variables
$branchName = "feature/json-automation-$(Get-Date -Format 'yyyyMMdd-HHmm')"
$prTitle = "🔄 Migración a JSON Local + GitHub Actions Automation"
$prBody = Get-Content "PR_README_JSON_AUTOMATION.md" -Raw

# Step 1: Verificar que gh CLI está instalado
Write-Host "📦 Verificando GitHub CLI..." -ForegroundColor Yellow
try {
    $ghVersion = gh --version
    Write-Host "✅ GitHub CLI instalado: $($ghVersion[0])" -ForegroundColor Green
}
catch {
    Write-Host "❌ GitHub CLI no está instalado" -ForegroundColor Red
    Write-Host "   Instalar desde: https://cli.github.com/" -ForegroundColor Yellow
    exit 1
}

# Step 2: Verificar estado de Git
Write-Host "`n📂 Verificando estado de Git..." -ForegroundColor Yellow
$gitStatus = git status --short
if (-not $gitStatus) {
    Write-Host "⚠️  No hay cambios para commitear" -ForegroundColor Yellow
    exit 0
}

Write-Host "📝 Cambios detectados:" -ForegroundColor Green
git status --short

# Step 3: Crear branch
Write-Host "`n🌿 Creando branch: $branchName" -ForegroundColor Yellow
try {
    git checkout -b $branchName
    Write-Host "✅ Branch creado" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error al crear branch: $_" -ForegroundColor Red
    exit 1
}

# Step 4: Add y commit
Write-Host "`n📝 Commiteando cambios..." -ForegroundColor Yellow
try {
    git add .
    git commit -m "feat: migración a JSON local + GitHub Actions automation

- Crea data/bancos.json como fuente de verdad
- Implementa servicio JSON local (bancos-json.service.js)
- Agrega PanelAlmacenMonte (panel faltante 8/8)
- Agrega workflows de GitHub Actions:
  - auto-deploy.yml (deploy automático)
  - auto-testing.yml (testing con matrix Node 18/20)
  - sync-json-firestore.yml (sincronización automática)
- Agrega script sync-json-to-firestore.js
- Documentación completa en PR_README_JSON_AUTOMATION.md

BREAKING CHANGE: Los paneles ahora pueden usar JSON local en lugar de Firestore.

Closes #3
Fixes #5
Related to #4"

    Write-Host "✅ Cambios commiteados" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error al commitear: $_" -ForegroundColor Red
    exit 1
}

# Step 5: Push branch
Write-Host "`n⬆️  Pusheando a origin..." -ForegroundColor Yellow
try {
    git push -u origin $branchName
    Write-Host "✅ Branch pusheado" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error al pushear: $_" -ForegroundColor Red
    exit 1
}

# Step 6: Crear PR
Write-Host "`n🎯 Creando Pull Request..." -ForegroundColor Yellow
try {
    $prUrl = gh pr create `
        --title $prTitle `
        --body $prBody `
        --base main `
        --head $branchName `
        --label "enhancement" `
        --label "automation" `
        --label "firebase" `
        --assignee "@me"

    Write-Host "✅ Pull Request creado!" -ForegroundColor Green
    Write-Host "`n🔗 URL: $prUrl`n" -ForegroundColor Cyan
}
catch {
    Write-Host "❌ Error al crear PR: $_" -ForegroundColor Red
    Write-Host "`nPuedes crear el PR manualmente con:" -ForegroundColor Yellow
    Write-Host "gh pr create --title `"$prTitle`" --body-file PR_README_JSON_AUTOMATION.md" -ForegroundColor White
    exit 1
}

# Step 7: Abrir PR en navegador
Write-Host "🌐 Abriendo PR en navegador..." -ForegroundColor Yellow
try {
    gh pr view --web
}
catch {
    Write-Host "⚠️  No se pudo abrir navegador automáticamente" -ForegroundColor Yellow
}

# Resumen final
Write-Host "`n✨ PULL REQUEST CREADO EXITOSAMENTE ✨`n" -ForegroundColor Green
Write-Host "📋 Branch: $branchName" -ForegroundColor White
Write-Host "🔗 PR URL: $prUrl" -ForegroundColor White
Write-Host "`n📝 Próximos pasos:" -ForegroundColor Cyan
Write-Host "  1. Revisar PR en GitHub" -ForegroundColor White
Write-Host "  2. Esperar checks de CI/CD" -ForegroundColor White
Write-Host "  3. Solicitar review" -ForegroundColor White
Write-Host "  4. Merge cuando esté aprobado`n" -ForegroundColor White
