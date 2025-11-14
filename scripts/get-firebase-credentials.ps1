# ============================================
# SCRIPT PARA OBTENER CREDENCIALES DE FIREBASE
# ============================================

Write-Host "`n╔═══════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║                                                       ║" -ForegroundColor Magenta
Write-Host "║     🔑 OBTENER CREDENCIALES DE FIREBASE              ║" -ForegroundColor Magenta
Write-Host "║                                                       ║" -ForegroundColor Magenta
Write-Host "╚═══════════════════════════════════════════════════════╝`n" -ForegroundColor Magenta

# Obtener proyecto actual
Write-Host "📋 Obteniendo información del proyecto..." -ForegroundColor Cyan
$projectInfo = firebase use
$projectId = "premium-ecosystem-1760790572"

Write-Host "✓ Proyecto actual: $projectId" -ForegroundColor Green

# Instrucciones
Write-Host "`n🎯 PASOS PARA OBTENER EL SERVICE ACCOUNT KEY:`n" -ForegroundColor Yellow

Write-Host "Opción 1 - Firebase Console (Recomendado):" -ForegroundColor Cyan
Write-Host "  1. Ve a: https://console.firebase.google.com/u/0/project/$projectId/settings/serviceaccounts/adminsdk" -ForegroundColor White
Write-Host "  2. Click en 'Generate New Private Key'" -ForegroundColor White
Write-Host "  3. Confirma la descarga" -ForegroundColor White
Write-Host "  4. Guarda el archivo como 'serviceAccountKey.json' en la raíz del proyecto`n" -ForegroundColor White

Write-Host "Opción 2 - Google Cloud Console:" -ForegroundColor Cyan
Write-Host "  1. Ve a: https://console.cloud.google.com/iam-admin/serviceaccounts?project=$projectId" -ForegroundColor White
Write-Host "  2. Encuentra el service account de Firebase (firebase-adminsdk)" -ForegroundColor White
Write-Host "  3. Click en '⋮' → 'Manage Keys'" -ForegroundColor White
Write-Host "  4. Click 'Add Key' → 'Create New Key' → JSON" -ForegroundColor White
Write-Host "  5. Guarda como 'serviceAccountKey.json' en la raíz del proyecto`n" -ForegroundColor White

# Abrir navegador
Write-Host "🌐 ¿Abrir Firebase Console automáticamente? (s/n): " -ForegroundColor Yellow -NoNewline
$respuesta = Read-Host

if ($respuesta -eq 's' -or $respuesta -eq 'S') {
    Write-Host "`n🚀 Abriendo Firebase Console..." -ForegroundColor Green
    Start-Process "https://console.firebase.google.com/u/0/project/$projectId/settings/serviceaccounts/adminsdk"
    Start-Sleep -Seconds 2
}

Write-Host "`n📝 Una vez descargado el archivo:" -ForegroundColor Cyan
Write-Host "  1. Renómbralo a 'serviceAccountKey.json'" -ForegroundColor White
Write-Host "  2. Muévelo a: $PWD" -ForegroundColor White
Write-Host "  3. Ejecuta: npm run test:csv-setup`n" -ForegroundColor White

Write-Host "⚠️  IMPORTANTE: NO subas este archivo a GitHub" -ForegroundColor Yellow
Write-Host "   Ya está configurado en .gitignore para tu seguridad`n" -ForegroundColor Yellow
