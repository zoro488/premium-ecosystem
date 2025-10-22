#!/bin/bash

# ============================================
# GitHub CLI Automation Script (Bash version)
# Automatización completa usando GitHub CLI
# ============================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Funciones de output
header() {
    echo -e "\n${CYAN}========================================${NC}"
    echo -e "${CYAN} $1${NC}"
    echo -e "${CYAN}========================================${NC}\n"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# ============================================
# SETUP - Configuración inicial
# ============================================
setup() {
    header "Configuración Inicial de GitHub CLI"

    # Verificar autenticación
    info "Verificando autenticación..."
    if ! gh auth status &>/dev/null; then
        warning "No estás autenticado. Iniciando proceso de login..."
        gh auth login --web --scopes 'repo,read:org,workflow,read:packages,write:packages,read:project,write:discussion,codespace,copilot'
    else
        success "Ya estás autenticado"
    fi

    # Instalar extensiones
    info "Instalando extensiones de GitHub CLI..."

    extensions=(
        "github/gh-copilot"
        "github/gh-actions-cache"
        "dlvhdr/gh-dash"
        "mislav/gh-branch"
    )

    for ext in "${extensions[@]}"; do
        info "Instalando $ext..."
        if gh extension install "$ext" 2>/dev/null; then
            success "Instalado: $ext"
        else
            warning "Ya instalado o error: $ext"
        fi
    done

    # Configurar aliases
    info "Configurando aliases útiles..."

    gh alias set co "pr checkout" 2>/dev/null && success "Alias: co -> pr checkout"
    gh alias set pv "pr view" 2>/dev/null && success "Alias: pv -> pr view"
    gh alias set pc "pr create --fill" 2>/dev/null && success "Alias: pc -> pr create --fill"
    gh alias set rv "repo view --web" 2>/dev/null && success "Alias: rv -> repo view --web"
    gh alias set rl "run list" 2>/dev/null && success "Alias: rl -> run list"
    gh alias set rw "run watch" 2>/dev/null && success "Alias: rw -> run watch"
    gh alias set il "issue list" 2>/dev/null && success "Alias: il -> issue list"
    gh alias set ic "issue create --web" 2>/dev/null && success "Alias: ic -> issue create --web"

    success "Configuración inicial completada"
}

# ============================================
# PR Management
# ============================================
pr_management() {
    header "Gestión de Pull Requests"

    info "Pull Requests abiertos:"
    gh pr list --limit 10

    echo -e "\n${YELLOW}Acciones disponibles:${NC}"
    echo "1. Crear nuevo PR"
    echo "2. Ver PR actual"
    echo "3. Merge PR"
    echo "4. Cerrar PR"
    echo "5. Solicitar review"

    read -p "Selecciona una opción (1-5): " choice

    case $choice in
        1)
            read -p "Título del PR: " pr_title
            read -p "Descripción (opcional): " pr_body
            if [ -z "$pr_body" ]; then
                gh pr create --title "$pr_title" --fill
            else
                gh pr create --title "$pr_title" --body "$pr_body"
            fi
            success "PR creado exitosamente"
            ;;
        2)
            gh pr view --web
            ;;
        3)
            read -p "Número del PR a mergear: " pr_number
            gh pr merge "$pr_number" --squash --delete-branch
            success "PR mergeado"
            ;;
        4)
            read -p "Número del PR a cerrar: " pr_number
            gh pr close "$pr_number"
            success "PR cerrado"
            ;;
        5)
            read -p "Número del PR: " pr_number
            read -p "Usuario reviewer: " reviewer
            gh pr review "$pr_number" --request-reviewer "$reviewer"
            success "Review solicitado"
            ;;
    esac
}

# ============================================
# Workflow Management
# ============================================
workflow_management() {
    header "Gestión de GitHub Actions"

    info "Workflows disponibles:"
    gh workflow list

    echo -e "\n${YELLOW}Acciones disponibles:${NC}"
    echo "1. Ver runs recientes"
    echo "2. Ejecutar workflow"
    echo "3. Ver logs de run"
    echo "4. Cancelar run"
    echo "5. Ver cache"

    read -p "Selecciona una opción (1-5): " choice

    case $choice in
        1)
            gh run list --limit 10
            ;;
        2)
            read -p "Nombre del workflow: " workflow
            gh workflow run "$workflow"
            success "Workflow iniciado"
            ;;
        3)
            read -p "ID del run: " run_id
            gh run view "$run_id" --log
            ;;
        4)
            read -p "ID del run: " run_id
            gh run cancel "$run_id"
            success "Run cancelado"
            ;;
        5)
            gh actions-cache list
            ;;
    esac
}

# ============================================
# Security Analysis
# ============================================
security_analysis() {
    header "Análisis de Seguridad"

    info "Verificando vulnerabilidades..."

    echo -e "\n${YELLOW}📦 Dependabot Alerts:${NC}"
    gh api repos/:owner/:repo/dependabot/alerts --jq '.[] | {severity: .security_advisory.severity, package: .security_vulnerability.package.name, summary: .security_advisory.summary}' 2>/dev/null || warning "No hay alerts o no tienes acceso"

    echo -e "\n${YELLOW}🔍 Code Scanning Alerts:${NC}"
    gh api repos/:owner/:repo/code-scanning/alerts --jq '.[] | {number: .number, state: .state, severity: .rule.severity, description: .rule.description}' 2>/dev/null || warning "No hay alerts o no tienes acceso"

    echo -e "\n${YELLOW}🔐 Secret Scanning Alerts:${NC}"
    gh api repos/:owner/:repo/secret-scanning/alerts --jq '.[] | {number: .number, state: .state, secret_type: .secret_type}' 2>/dev/null || warning "No hay alerts o no tienes acceso"

    info "\nPara más detalles, visita:"
    gh repo view --web
}

# ============================================
# Copilot CLI
# ============================================
copilot_cli() {
    header "GitHub Copilot CLI"

    info "Usando GitHub Copilot para sugerencias..."

    if [ -n "$1" ]; then
        gh copilot explain "$1"
    else
        read -p "¿Qué comando necesitas? (describe en lenguaje natural): " query
        gh copilot suggest "$query"
    fi
}

# ============================================
# MAIN
# ============================================
main() {
    cat << "EOF"
╔══════════════════════════════════════════╗
║   GitHub CLI Automation Script           ║
║   Premium Ecosystem                      ║
╚══════════════════════════════════════════╝
EOF

    case "${1:-all}" in
        setup)
            setup
            ;;
        pr)
            pr_management
            ;;
        workflow)
            workflow_management
            ;;
        security)
            security_analysis
            ;;
        copilot)
            copilot_cli "$2"
            ;;
        all)
            setup
            echo -e "\n${YELLOW}¿Qué deseas hacer?${NC}"
            echo "1. Gestionar PRs"
            echo "2. Gestionar Workflows"
            echo "3. Análisis de Seguridad"
            echo "4. Usar Copilot CLI"

            read -p "Selecciona (1-4): " choice
            case $choice in
                1) pr_management ;;
                2) workflow_management ;;
                3) security_analysis ;;
                4) copilot_cli ;;
            esac
            ;;
        *)
            error "Acción desconocida: $1"
            echo "Uso: $0 [setup|pr|workflow|security|copilot|all]"
            exit 1
            ;;
    esac

    success "Script completado"
}

# Ejecutar
main "$@"
