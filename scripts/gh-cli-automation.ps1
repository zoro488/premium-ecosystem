# ============================================
# GitHub CLI Automation Script
# Automatización completa usando GitHub CLI
# ============================================

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('setup', 'pr', 'issue', 'release', 'workflow', 'copilot', 'security', 'all')]
    [string]$Action = 'all',

    [Parameter(Mandatory=$false)]
    [string]$Message,

    [Parameter(Mandatory=$false)]
    [string]$Title
)

# Colores para output
function Write-Header {
    param([string]$Text)
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host " $Text" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Text)
    Write-Host "✅ $Text" -ForegroundColor Green
}

function Write-Info {
    param([string]$Text)
    Write-Host "ℹ️  $Text" -ForegroundColor Blue
}

function Write-Warning {
    param([string]$Text)
    Write-Host "⚠️  $Text" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Text)
    Write-Host "❌ $Text" -ForegroundColor Red
}

# ============================================
# SETUP - Configuración inicial
# ============================================
function Invoke-Setup {
    Write-Header "Configuración Inicial de GitHub CLI"

    # Verificar autenticación
    Write-Info "Verificando autenticación..."
    $authStatus = gh auth status 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "No estás autenticado. Iniciando proceso de login..."
        gh auth login --web --scopes 'repo,read:org,workflow,read:packages,write:packages,read:project,write:discussion,codespace,copilot'
    } else {
        Write-Success "Ya estás autenticado"
    }

    # Instalar extensiones útiles
    Write-Info "Instalando extensiones de GitHub CLI..."

    $extensions = @(
        "github/gh-copilot",
        "github/gh-actions-cache",
        "dlvhdr/gh-dash",
        "mislav/gh-branch"
    )

    foreach ($ext in $extensions) {
        Write-Info "Instalando $ext..."
        gh extension install $ext 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Instalado: $ext"
        } else {
            Write-Warning "Ya instalado o error: $ext"
        }
    }

    # Configurar aliases
    Write-Info "Configurando aliases útiles..."

    $aliases = @{
        "co" = "pr checkout"
        "pv" = "pr view"
        "pc" = "pr create --fill"
        "rv" = "repo view --web"
        "rl" = "run list"
        "rw" = "run watch"
        "il" = "issue list"
        "ic" = "issue create --web"
    }

    foreach ($alias in $aliases.GetEnumerator()) {
        gh alias set $alias.Key $alias.Value 2>$null
        Write-Success "Alias configurado: $($alias.Key) -> $($alias.Value)"
    }

    Write-Success "Configuración inicial completada"
}

# ============================================
# PR - Gestión de Pull Requests
# ============================================
function Invoke-PRManagement {
    Write-Header "Gestión de Pull Requests"

    # Listar PRs abiertos
    Write-Info "Pull Requests abiertos:"
    gh pr list --limit 10

    Write-Host "`nAcciones disponibles:" -ForegroundColor Yellow
    Write-Host "1. Crear nuevo PR"
    Write-Host "2. Ver PR actual"
    Write-Host "3. Merge PR"
    Write-Host "4. Cerrar PR"
    Write-Host "5. Solicitar review"

    $choice = Read-Host "`nSelecciona una opción (1-5)"

    switch ($choice) {
        "1" {
            Write-Info "Creando nuevo PR..."
            $prTitle = Read-Host "Título del PR"
            $prBody = Read-Host "Descripción (opcional)"

            if ([string]::IsNullOrEmpty($prBody)) {
                gh pr create --title "$prTitle" --fill
            } else {
                gh pr create --title "$prTitle" --body "$prBody"
            }
            Write-Success "PR creado exitosamente"
        }
        "2" {
            gh pr view --web
        }
        "3" {
            $prNumber = Read-Host "Número del PR a mergear"
            gh pr merge $prNumber --squash --delete-branch
            Write-Success "PR mergeado"
        }
        "4" {
            $prNumber = Read-Host "Número del PR a cerrar"
            gh pr close $prNumber
            Write-Success "PR cerrado"
        }
        "5" {
            $prNumber = Read-Host "Número del PR"
            $reviewer = Read-Host "Usuario reviewer"
            gh pr review $prNumber --request-reviewer $reviewer
            Write-Success "Review solicitado"
        }
    }
}

# ============================================
# ISSUE - Gestión de Issues
# ============================================
function Invoke-IssueManagement {
    Write-Header "Gestión de Issues"

    # Listar issues abiertos
    Write-Info "Issues abiertos:"
    gh issue list --limit 10

    Write-Host "`nAcciones disponibles:" -ForegroundColor Yellow
    Write-Host "1. Crear nuevo issue"
    Write-Host "2. Ver issue"
    Write-Host "3. Cerrar issue"
    Write-Host "4. Asignar issue"
    Write-Host "5. Añadir labels"

    $choice = Read-Host "`nSelecciona una opción (1-5)"

    switch ($choice) {
        "1" {
            gh issue create --web
        }
        "2" {
            $issueNumber = Read-Host "Número del issue"
            gh issue view $issueNumber --web
        }
        "3" {
            $issueNumber = Read-Host "Número del issue"
            gh issue close $issueNumber
            Write-Success "Issue cerrado"
        }
        "4" {
            $issueNumber = Read-Host "Número del issue"
            $assignee = Read-Host "Usuario a asignar"
            gh issue edit $issueNumber --add-assignee $assignee
            Write-Success "Issue asignado"
        }
        "5" {
            $issueNumber = Read-Host "Número del issue"
            $labels = Read-Host "Labels (separados por coma)"
            gh issue edit $issueNumber --add-label $labels
            Write-Success "Labels añadidos"
        }
    }
}

# ============================================
# RELEASE - Gestión de Releases
# ============================================
function Invoke-ReleaseManagement {
    Write-Header "Gestión de Releases"

    # Listar releases
    Write-Info "Últimos releases:"
    gh release list --limit 5

    Write-Host "`nAcciones disponibles:" -ForegroundColor Yellow
    Write-Host "1. Crear nuevo release"
    Write-Host "2. Ver último release"
    Write-Host "3. Descargar assets"

    $choice = Read-Host "`nSelecciona una opción (1-3)"

    switch ($choice) {
        "1" {
            $tag = Read-Host "Tag de versión (ej: v1.0.0)"
            $title = Read-Host "Título del release"
            $notes = Read-Host "Notas del release (opcional)"

            if ([string]::IsNullOrEmpty($notes)) {
                gh release create $tag --title "$title" --generate-notes
            } else {
                gh release create $tag --title "$title" --notes "$notes"
            }
            Write-Success "Release creado"
        }
        "2" {
            gh release view --web
        }
        "3" {
            $tag = Read-Host "Tag del release"
            gh release download $tag
            Write-Success "Assets descargados"
        }
    }
}

# ============================================
# WORKFLOW - Gestión de Workflows
# ============================================
function Invoke-WorkflowManagement {
    Write-Header "Gestión de GitHub Actions"

    # Listar workflows
    Write-Info "Workflows disponibles:"
    gh workflow list

    Write-Host "`nAcciones disponibles:" -ForegroundColor Yellow
    Write-Host "1. Ver runs recientes"
    Write-Host "2. Ejecutar workflow"
    Write-Host "3. Ver logs de run"
    Write-Host "4. Cancelar run"
    Write-Host "5. Ver cache"

    $choice = Read-Host "`nSelecciona una opción (1-5)"

    switch ($choice) {
        "1" {
            gh run list --limit 10
        }
        "2" {
            $workflow = Read-Host "Nombre del workflow"
            gh workflow run $workflow
            Write-Success "Workflow iniciado"
        }
        "3" {
            $runId = Read-Host "ID del run"
            gh run view $runId --log
        }
        "4" {
            $runId = Read-Host "ID del run"
            gh run cancel $runId
            Write-Success "Run cancelado"
        }
        "5" {
            gh actions-cache list
        }
    }
}

# ============================================
# COPILOT - GitHub Copilot CLI
# ============================================
function Invoke-CopilotCLI {
    Write-Header "GitHub Copilot CLI"

    Write-Info "Usando GitHub Copilot para sugerencias..."

    if ($Message) {
        gh copilot explain $Message
    } else {
        $query = Read-Host "¿Qué comando necesitas? (describe en lenguaje natural)"
        gh copilot suggest $query
    }
}

# ============================================
# SECURITY - Análisis de Seguridad
# ============================================
function Invoke-SecurityAnalysis {
    Write-Header "Análisis de Seguridad"

    Write-Info "Verificando vulnerabilidades..."

    # Dependabot alerts
    Write-Host "`n📦 Dependabot Alerts:" -ForegroundColor Yellow
    gh api repos/:owner/:repo/dependabot/alerts --jq '.[] | {severity: .security_advisory.severity, package: .security_vulnerability.package.name, summary: .security_advisory.summary}'

    # Code scanning alerts
    Write-Host "`n🔍 Code Scanning Alerts:" -ForegroundColor Yellow
    gh api repos/:owner/:repo/code-scanning/alerts --jq '.[] | {number: .number, state: .state, severity: .rule.severity, description: .rule.description}'

    # Secret scanning alerts
    Write-Host "`n🔐 Secret Scanning Alerts:" -ForegroundColor Yellow
    gh api repos/:owner/:repo/secret-scanning/alerts --jq '.[] | {number: .number, state: .state, secret_type: .secret_type}'

    Write-Info "`nPara más detalles, visita:"
    gh repo view --web
}

# ============================================
# MAIN - Ejecutar acciones
# ============================================
function Main {
    Write-Host @"
╔══════════════════════════════════════════╗
║   GitHub CLI Automation Script           ║
║   Premium Ecosystem                      ║
╚══════════════════════════════════════════╝
"@ -ForegroundColor Cyan

    switch ($Action) {
        'setup' { Invoke-Setup }
        'pr' { Invoke-PRManagement }
        'issue' { Invoke-IssueManagement }
        'release' { Invoke-ReleaseManagement }
        'workflow' { Invoke-WorkflowManagement }
        'copilot' { Invoke-CopilotCLI }
        'security' { Invoke-SecurityAnalysis }
        'all' {
            Invoke-Setup
            Write-Host "`n¿Qué deseas hacer?" -ForegroundColor Yellow
            Write-Host "1. Gestionar PRs"
            Write-Host "2. Gestionar Issues"
            Write-Host "3. Gestionar Releases"
            Write-Host "4. Gestionar Workflows"
            Write-Host "5. Usar Copilot CLI"
            Write-Host "6. Análisis de Seguridad"

            $choice = Read-Host "`nSelecciona (1-6)"
            switch ($choice) {
                "1" { Invoke-PRManagement }
                "2" { Invoke-IssueManagement }
                "3" { Invoke-ReleaseManagement }
                "4" { Invoke-WorkflowManagement }
                "5" { Invoke-CopilotCLI }
                "6" { Invoke-SecurityAnalysis }
            }
        }
    }

    Write-Host "`n" -NoNewline
    Write-Success "Script completado"
}

# Ejecutar
Main
