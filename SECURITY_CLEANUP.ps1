#!/usr/bin/env pwsh
# ============================================
# SCRIPT DE LIMPIEZA DE SEGURIDAD
# Premium Ecosystem - Security Cleanup
# ============================================

Write-Host "`n🔒 INICIANDO LIMPIEZA DE SEGURIDAD`n" -ForegroundColor Red
Write-Host "=" -NoNewline; 1..80 | ForEach-Object { Write-Host "=" -NoNewline }
Write-Host "`n"

# ============================================
# 1. AGREGAR ARCHIVOS AL .GITIGNORE
# ============================================

Write-Host "`n📝 Paso 1: Actualizando .gitignore..." -ForegroundColor Yellow

$gitignoreContent = @"

# ============================================
# ARCHIVOS DE DOCUMENTACIÓN CON TOKENS
# ¡NUNCA SUBIR ESTOS ARCHIVOS!
# ============================================
OAUTH_TOKEN_SUCCESS.md
OAUTH_TOKEN_GUIDE.md
COPILOT_TOKEN_SETUP.md
*_TOKEN_*.md
*_SECRET_*.md
SECURITY_AUDIT_REPORT.md
SECURITY_CLEANUP.ps1

# Archivos de historial de comandos
.bash_history
.powershell_history
.zsh_history

# Scripts con credenciales
*-credentials.ps1
*-secrets.sh
"@

Add-Content -Path .gitignore -Value $gitignoreContent
Write-Host "   ✅ .gitignore actualizado" -ForegroundColor Green

# ============================================
# 2. VERIFICAR SI ARCHIVOS ESTÁN EN GIT
# ============================================

Write-Host "`n🔍 Paso 2: Verificando archivos en Git..." -ForegroundColor Yellow

$sensitiveFiles = @(
    "OAUTH_TOKEN_SUCCESS.md",
    ".env",
    "OAUTH_TOKEN_GUIDE.md"
)

$filesInGit = @()
foreach ($file in $sensitiveFiles) {
    $inGit = git ls-files $file 2>$null
    if ($inGit) {
        Write-Host "   ⚠️  $file está en Git" -ForegroundColor Red
        $filesInGit += $file
    }
    else {
        Write-Host "   ✅ $file NO está en Git" -ForegroundColor Green
    }
}

# ============================================
# 3. REMOVER ARCHIVOS DEL STAGING
# ============================================

if ($filesInGit.Count -gt 0) {
    Write-Host "`n🗑️  Paso 3: Removiendo archivos del staging..." -ForegroundColor Yellow

    foreach ($file in $filesInGit) {
        try {
            git rm --cached $file -f 2>$null
            Write-Host "   ✅ $file removido del staging" -ForegroundColor Green
        }
        catch {
            Write-Host "   ℹ️  $file no está en staging" -ForegroundColor Gray
        }
    }
}
else {
    Write-Host "`n✅ Paso 3: No hay archivos sensibles en staging" -ForegroundColor Green
}

# ============================================
# 4. VERIFICAR HISTORIAL DE GIT
# ============================================

Write-Host "`n🔍 Paso 4: Verificando historial de Git..." -ForegroundColor Yellow

$historyCheck = git log --all --full-history -- .env 2>$null
if ($historyCheck) {
    Write-Host "   ⚠️  .env encontrado en historial de Git" -ForegroundColor Red
    Write-Host "   ℹ️  Necesitas limpiar el historial (git filter-branch)" -ForegroundColor Yellow
}
else {
    Write-Host "   ✅ .env NO está en historial de Git" -ForegroundColor Green
}

# ============================================
# 5. BUSCAR TOKENS EN HISTORIAL
# ============================================

Write-Host "`n🔍 Paso 5: Buscando tokens en historial..." -ForegroundColor Yellow

$tokenPatterns = @("gho_", "github_pat_", "AIzaSy")
$tokensFound = $false

foreach ($pattern in $tokenPatterns) {
    $found = git log -p --all 2>$null | Select-String -Pattern $pattern -Quiet
    if ($found) {
        Write-Host "   ⚠️  Patrón '$pattern' encontrado en historial" -ForegroundColor Red
        $tokensFound = $true
    }
}

if (-not $tokensFound) {
    Write-Host "   ✅ No se encontraron tokens en historial" -ForegroundColor Green
}

# ============================================
# 6. CREAR BACKUP DE ARCHIVOS SENSIBLES
# ============================================

Write-Host "`n💾 Paso 6: Creando backup de archivos sensibles..." -ForegroundColor Yellow

$backupDir = ".security_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

foreach ($file in $sensitiveFiles) {
    if (Test-Path $file) {
        Copy-Item $file -Destination "$backupDir\" -Force
        Write-Host "   ✅ Backup de $file creado" -ForegroundColor Green
    }
}

Write-Host "   📁 Backup guardado en: $backupDir" -ForegroundColor Cyan

# ============================================
# 7. GENERAR PLANTILLAS SEGURAS
# ============================================

Write-Host "`n📄 Paso 7: Generando plantillas seguras..." -ForegroundColor Yellow

# Plantilla .env.example
$envExample = @"
# ============================================
# FIREBASE CONFIGURATION
# ============================================
# Copia este archivo a .env y rellena con tus credenciales

VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# ============================================
# OTRAS CONFIGURACIONES
# ============================================

VITE_APP_ENV=development
VITE_APP_DEBUG=true
VITE_APP_URL=http://localhost:3005
"@

Set-Content -Path ".env.example" -Value $envExample
Write-Host "   ✅ .env.example creado" -ForegroundColor Green

# ============================================
# 8. CREAR ARCHIVO DE CONFIGURACIÓN DE TOKENS
# ============================================

$tokenSetup = @"
# 🔐 CONFIGURACIÓN DE TOKENS - INSTRUCCIONES

## ⚠️ IMPORTANTE: NUNCA COMMITEAR ESTE ARCHIVO CON TOKENS REALES

### Paso 1: Generar nuevos tokens

1. **OAuth Token** (para Copilot CLI):
   - Ir a: https://github.com/settings/tokens
   - Click en "Generate new token (classic)"
   - Scopes necesarios: repo, read:org, copilot
   - Copiar el token generado

2. **Personal Access Token** (para API/Workflows):
   - Ir a: https://github.com/settings/tokens
   - Click en "Generate new token (classic)"
   - Scopes necesarios: repo, workflow, write:packages
   - Copiar el token generado

### Paso 2: Configurar variables de entorno

#### PowerShell (Windows)
\`\`\`powershell
# Agregar a tu perfil de PowerShell: `$PROFILE
\$env:GITHUB_TOKEN = "tu_nuevo_token_aqui"
\$env:GITHUB_OAUTH_TOKEN = "tu_oauth_token_aqui"
\`\`\`

#### Bash/Zsh (macOS/Linux)
\`\`\`bash
# Agregar a ~/.bashrc o ~/.zshrc
export GITHUB_TOKEN="tu_nuevo_token_aqui"
export GITHUB_OAUTH_TOKEN="tu_oauth_token_aqui"
\`\`\`

### Paso 3: Verificar configuración

\`\`\`powershell
# PowerShell
echo \$env:GITHUB_TOKEN
gh auth token

# Bash/Zsh
echo \$GITHUB_TOKEN
gh auth token
\`\`\`

### Paso 4: Configurar en GitHub Actions

1. Ir a: https://github.com/[tu-usuario]/[tu-repo]/settings/secrets/actions
2. Agregar los siguientes secrets:
   - GITHUB_TOKEN (automático, ya existe)
   - FIREBASE_TOKEN (si usas Firebase)
   - CODECOV_TOKEN (si usas Codecov)

## 🛡️ Mejores Prácticas

1. ✅ Nunca commitear tokens en archivos
2. ✅ Usar variables de entorno
3. ✅ Rotar tokens cada 90 días
4. ✅ Revocar tokens inmediatamente si se exponen
5. ✅ Usar tokens con permisos mínimos necesarios
6. ✅ Habilitar GitHub Secret Scanning

## 🔗 Enlaces Útiles

- Tokens de GitHub: https://github.com/settings/tokens
- GitHub Actions Secrets: https://github.com/settings/secrets
- Firebase Console: https://console.firebase.google.com
- Documentación de seguridad: https://docs.github.com/en/authentication

---

**RECUERDA**: Este archivo es solo una plantilla.
Los tokens reales deben estar SOLO en variables de entorno.
"@

Set-Content -Path "TOKEN_SETUP_TEMPLATE.md" -Value $tokenSetup
Write-Host "   ✅ TOKEN_SETUP_TEMPLATE.md creado" -ForegroundColor Green

# ============================================
# 9. RESUMEN Y PRÓXIMOS PASOS
# ============================================

Write-Host "`n📊 RESUMEN DE LIMPIEZA`n" -ForegroundColor Cyan
Write-Host "=" -NoNewline; 1..80 | ForEach-Object { Write-Host "=" -NoNewline }
Write-Host "`n"

Write-Host "✅ Completado:" -ForegroundColor Green
Write-Host "   1. .gitignore actualizado con patrones de seguridad" -ForegroundColor White
Write-Host "   2. Archivos verificados en Git" -ForegroundColor White
Write-Host "   3. Archivos removidos del staging (si aplicable)" -ForegroundColor White
Write-Host "   4. Historial de Git verificado" -ForegroundColor White
Write-Host "   5. Backup de archivos sensibles creado" -ForegroundColor White
Write-Host "   6. Plantillas seguras generadas" -ForegroundColor White

Write-Host "`n⚠️  ACCIONES PENDIENTES (CRÍTICO):`n" -ForegroundColor Red
Write-Host "1. REVOCAR TOKENS INMEDIATAMENTE:" -ForegroundColor Yellow
Write-Host "   - Ir a: https://github.com/settings/tokens" -ForegroundColor Cyan
Write-Host "   - Revocar: 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" -ForegroundColor Red
Write-Host "   - Revocar: github_pat_11BXRBLFQ05... (PAT)" -ForegroundColor Red

Write-Host "`n2. GENERAR NUEVOS TOKENS:" -ForegroundColor Yellow
Write-Host "   - Seguir instrucciones en TOKEN_SETUP_TEMPLATE.md" -ForegroundColor Cyan

Write-Host "`n3. CONFIGURAR VARIABLES DE ENTORNO:" -ForegroundColor Yellow
Write-Host "   - PowerShell: Editar `$PROFILE" -ForegroundColor Cyan
Write-Host "   - Agregar: `$env:GITHUB_TOKEN = 'nuevo_token'" -ForegroundColor Cyan

Write-Host "`n4. VERIFICAR REPOSITORIO EN GITHUB:" -ForegroundColor Yellow
Write-Host "   - Revisar si OAUTH_TOKEN_SUCCESS.md está en GitHub" -ForegroundColor Cyan
Write-Host "   - Si está, ejecutar: git push --force origin main" -ForegroundColor Cyan

if ($tokensFound) {
    Write-Host "`n5. LIMPIAR HISTORIAL DE GIT (TOKENS ENCONTRADOS):" -ForegroundColor Yellow
    Write-Host "   ⚠️  Se encontraron tokens en el historial de Git" -ForegroundColor Red
    Write-Host "   Ejecutar:" -ForegroundColor Cyan
    Write-Host @"
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch OAUTH_TOKEN_SUCCESS.md .env" \
     --prune-empty --tag-name-filter cat -- --all

   git push origin --force --all
"@ -ForegroundColor Gray
}

Write-Host "`n📁 ARCHIVOS GENERADOS:`n" -ForegroundColor Cyan
Write-Host "   - .env.example (plantilla segura)" -ForegroundColor White
Write-Host "   - TOKEN_SETUP_TEMPLATE.md (instrucciones)" -ForegroundColor White
Write-Host "   - $backupDir (backup de archivos)" -ForegroundColor White
Write-Host "   - SECURITY_AUDIT_REPORT.md (reporte completo)" -ForegroundColor White

Write-Host "`n🔗 ENLACES ÚTILES:`n" -ForegroundColor Cyan
Write-Host "   - Revocar tokens: https://github.com/settings/tokens" -ForegroundColor White
Write-Host "   - Firebase Console: https://console.firebase.google.com" -ForegroundColor White
Write-Host "   - GitHub Security: https://github.com/settings/security_analysis" -ForegroundColor White

Write-Host "`n=" -NoNewline; 1..80 | ForEach-Object { Write-Host "=" -NoNewline }
Write-Host "`n"

Write-Host "🔴 ESTADO: ACCIÓN INMEDIATA REQUERIDA" -ForegroundColor Red
Write-Host "🔒 Revoca los tokens AHORA antes de continuar" -ForegroundColor Yellow
Write-Host "`n"

# ============================================
# 10. ABRIR PÁGINAS DE CONFIGURACIÓN
# ============================================

Write-Host "¿Quieres abrir las páginas de GitHub para revocar tokens? (S/N): " -ForegroundColor Yellow -NoNewline
$response = Read-Host

if ($response -eq "S" -or $response -eq "s") {
    Write-Host "`n🌐 Abriendo GitHub Settings..." -ForegroundColor Green
    Start-Process "https://github.com/settings/tokens"
    Start-Sleep -Seconds 2
    Start-Process "https://github.com/settings/security_analysis"
}

Write-Host "`n✅ Script de limpieza completado" -ForegroundColor Green
Write-Host "📖 Lee SECURITY_AUDIT_REPORT.md para más detalles`n" -ForegroundColor Cyan
