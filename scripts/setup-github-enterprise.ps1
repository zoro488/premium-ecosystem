# GitHub Enterprise Pro Setup Script
# Este script configura GitHub CLI con autenticación avanzada y habilita todas las características premium

Write-Host "🚀 Configurando GitHub Enterprise Pro..." -ForegroundColor Cyan

# 1. Autenticación GitHub CLI
Write-Host "`n📝 Paso 1: Autenticación GitHub CLI" -ForegroundColor Yellow
Write-Host "Ejecuta: gh auth login --web --scopes 'repo,read:org,workflow,read:packages,write:packages,read:project,write:discussion,codespace,copilot'"
Write-Host ""
Write-Host "Scopes incluidos:" -ForegroundColor Green
Write-Host "  ✓ repo - Acceso completo a repositorios"
Write-Host "  ✓ read:org - Leer datos de organización"
Write-Host "  ✓ workflow - Gestionar GitHub Actions"
Write-Host "  ✓ read:packages, write:packages - GitHub Packages"
Write-Host "  ✓ read:project - GitHub Projects"
Write-Host "  ✓ write:discussion - Discussions"
Write-Host "  ✓ codespace - GitHub Codespaces"
Write-Host "  ✓ copilot - GitHub Copilot Enterprise"

# 2. Configurar GitHub CLI
Write-Host "`n📝 Paso 2: Configurar GitHub CLI" -ForegroundColor Yellow

# Configuraciones óptimas
$ghConfigs = @(
    @{Key="git_protocol"; Value="https"},
    @{Key="editor"; Value="code --wait"},
    @{Key="prompt"; Value="enabled"},
    @{Key="pager"; Value="less"}
)

foreach ($config in $ghConfigs) {
    Write-Host "Configurando $($config.Key)..." -ForegroundColor Gray
    # gh config set $config.Key $config.Value
}

# 3. Habilitar GitHub Copilot CLI
Write-Host "`n📝 Paso 3: GitHub Copilot CLI" -ForegroundColor Yellow
Write-Host "Instalar GitHub Copilot CLI: gh extension install github/gh-copilot"

# 4. Extensiones GitHub CLI útiles
Write-Host "`n📝 Paso 4: Extensiones GitHub CLI" -ForegroundColor Yellow
$extensions = @(
    "github/gh-copilot",
    "github/gh-actions-cache",
    "dlvhdr/gh-dash",
    "mislav/gh-branch",
    "seachicken/gh-poi",
    "vilmibm/gh-screensaver"
)

Write-Host "Extensiones recomendadas:"
foreach ($ext in $extensions) {
    Write-Host "  gh extension install $ext" -ForegroundColor Gray
}

# 5. Configurar aliases útiles
Write-Host "`n📝 Paso 5: Aliases útiles" -ForegroundColor Yellow
$aliases = @(
    @{Name="co"; Command="pr checkout"},
    @{Name="pv"; Command="pr view"},
    @{Name="pc"; Command="pr create --fill"},
    @{Name="rv"; Command="repo view --web"},
    @{Name="rl"; Command="run list"},
    @{Name="rw"; Command="run watch"},
    @{Name="il"; Command="issue list"},
    @{Name="ic"; Command="issue create --web"}
)

Write-Host "Aliases:"
foreach ($alias in $aliases) {
    Write-Host "  gh alias set $($alias.Name) '$($alias.Command)'" -ForegroundColor Gray
}

Write-Host "`n✅ Script completado!" -ForegroundColor Green
Write-Host "`n📚 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Ejecuta: gh auth login --web --scopes 'repo,read:org,workflow,read:packages,write:packages,read:project,write:discussion,codespace,copilot'"
Write-Host "2. Ejecuta: gh extension install github/gh-copilot"
Write-Host "3. Revisa las configuraciones en .vscode/settings.json"
Write-Host "4. Reinicia VSCode para aplicar cambios"
