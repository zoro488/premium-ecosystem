# GitHub Enterprise Pro - Guía Completa de Configuración

Esta guía te ayudará a aprovechar al máximo todas las características de GitHub Copilot Enterprise Pro y GitHub Advanced Security en el proyecto Premium Ecosystem.

## 📋 Tabla de Contenidos

1. [Configuración Inicial](#configuración-inicial)
2. [GitHub Copilot Enterprise](#github-copilot-enterprise)
3. [GitHub CLI](#github-cli)
4. [GitHub Actions](#github-actions)
5. [GitHub Advanced Security](#github-advanced-security)
6. [GitHub Codespaces](#github-codespaces)
7. [GitHub Packages](#github-packages)
8. [Automatización](#automatización)

---

## 🚀 Configuración Inicial

### Prerrequisitos

- **Node.js** 18+ instalado
- **Git** instalado y configurado
- **GitHub CLI** (`gh`) instalado
- Acceso a GitHub Copilot Enterprise Pro
- Permisos de administrador en el repositorio

### Instalación de GitHub CLI

#### Windows (PowerShell)
```powershell
winget install --id GitHub.cli
```

#### macOS
```bash
brew install gh
```

#### Linux
```bash
sudo apt install gh  # Debian/Ubuntu
sudo dnf install gh  # Fedora
```

### Verificar instalación
```bash
gh --version
```

---

## 🤖 GitHub Copilot Enterprise

### 1. Activar Copilot en VSCode

1. Instala la extensión [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
2. Instala [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat)
3. Autentica con tu cuenta GitHub Enterprise

### 2. Configuración Óptima

Hemos creado dos archivos de configuración:

#### Opción 1: Reemplazar settings.json actual
```bash
# Backup del archivo actual
cp .vscode/settings.json .vscode/settings.json.backup

# Usar configuración enterprise
cp .vscode/settings.enterprise.json .vscode/settings.json
```

#### Opción 2: Merge manual
Copia las configuraciones de `.vscode/settings.enterprise.json` a tu `settings.json` actual.

### 3. Instrucciones Personalizadas

El archivo `.github/copilot-instructions.md` contiene instrucciones personalizadas para Copilot. Estas se aplicarán automáticamente cuando uses Copilot en este proyecto.

### 4. Usar Copilot CLI

```bash
# Instalar extensión
gh extension install github/gh-copilot

# Pedir sugerencias
gh copilot suggest "crear un componente React con TypeScript"

# Explicar comando
gh copilot explain "git rebase -i HEAD~3"
```

---

## 🛠️ GitHub CLI

### Autenticación

```bash
# Autenticación con todos los scopes necesarios
gh auth login --web --scopes 'repo,read:org,workflow,read:packages,write:packages,read:project,write:discussion,codespace,copilot'
```

### Script de Configuración Automática

#### Windows
```powershell
.\scripts\setup-github-enterprise.ps1
```

#### Linux/macOS
```bash
chmod +x scripts/gh-cli-automation.sh
./scripts/gh-cli-automation.sh setup
```

### Comandos Útiles

```bash
# Ver PRs
gh pr list
gh pr view 123
gh pr create --fill

# Workflows
gh workflow list
gh run list
gh run watch

# Issues
gh issue list
gh issue create

# Releases
gh release list
gh release create v1.0.0

# Copilot
gh copilot suggest "comando para..."
```

---

## ⚙️ GitHub Actions

### Workflows Configurados

1. **advanced-ci.yml** - Pipeline CI/CD completo con:
   - Matrix testing (múltiples OS y versiones de Node)
   - Linting y formateo
   - Unit tests y E2E tests
   - Build optimization
   - Security scanning
   - Performance testing
   - Auto-deploy

2. **codeql-analysis.yml** - Análisis de seguridad con:
   - CodeQL scanning
   - Dependency review
   - Secret scanning
   - SBOM generation
   - Compliance checks

3. **project-automation.yml** - Automatización de proyectos:
   - Auto-labeling
   - Auto-assign reviewers
   - Stale issues/PRs
   - Size labeling
   - Conventional commits check

4. **publish-package.yml** - Publicación de paquetes:
   - GitHub Packages
   - NPM registry
   - Provenance attestation

### Ejecutar Workflows Manualmente

```bash
# Listar workflows
gh workflow list

# Ejecutar workflow
gh workflow run "Advanced CI/CD Pipeline"

# Ver ejecuciones
gh run list --workflow="Advanced CI/CD Pipeline"

# Ver logs
gh run view <run-id> --log
```

### Secrets Necesarios

Configura estos secrets en Settings > Secrets and variables > Actions:

```bash
# Firebase
FIREBASE_SERVICE_ACCOUNT

# NPM (opcional)
NPM_TOKEN

# Snyk (opcional)
SNYK_TOKEN

# Slack (opcional)
SLACK_WEBHOOK_URL

# Codecov (opcional)
CODECOV_TOKEN
```

---

## 🔒 GitHub Advanced Security

### 1. CodeQL

Configurado en `.github/codeql/codeql-config.yml`

**Características:**
- Escaneo automático de JavaScript/TypeScript
- Queries de seguridad extendidas
- Detección de vulnerabilidades
- Custom queries para React y Firebase

**Ver resultados:**
```bash
gh api repos/:owner/:repo/code-scanning/alerts
```

### 2. Dependency Review

Configurado en `.github/dependency-review-config.yml`

**Características:**
- Revisión automática en PRs
- Validación de licencias
- Detección de vulnerabilidades
- CVSS scoring

### 3. Secret Scanning

**Herramientas integradas:**
- Gitleaks
- TruffleHog
- GitHub native secret scanning

**Ver alerts:**
```bash
gh api repos/:owner/:repo/secret-scanning/alerts
```

### 4. Dependabot

El archivo `.github/dependabot.yml` ya está configurado.

**Ver alerts:**
```bash
gh api repos/:owner/:repo/dependabot/alerts
```

### 5. SBOM (Software Bill of Materials)

Se genera automáticamente en cada release:
- Formato CycloneDX
- Formato SPDX
- Attestation de provenance

---

## ☁️ GitHub Codespaces

### Configuración Enterprise

Usa el devcontainer optimizado:

```bash
cp .devcontainer/devcontainer.enterprise.json .devcontainer/devcontainer.json
```

### Características

- **Node.js 20 LTS**
- **Docker-in-Docker** para testing
- **GitHub CLI** con extensiones
- **Todas las extensiones de VSCode** necesarias
- **Firebase CLI** preinstalado
- **Copilot Enterprise** habilitado
- **Resources**: 4 CPUs, 8GB RAM, 32GB storage

### Crear Codespace

```bash
# Desde CLI
gh codespace create

# O desde web
# https://github.com/YOUR_REPO/codespaces/new
```

### Conectar a Codespace

```bash
# Listar codespaces
gh codespace list

# Conectar via SSH
gh codespace ssh

# Abrir en VSCode
gh codespace code
```

---

## 📦 GitHub Packages

### Configuración

1. **Copiar archivo de configuración:**
```bash
cp .npmrc.example .npmrc
```

2. **Editar `.npmrc`:**
Reemplaza:
- `YOUR_GITHUB_USERNAME` con tu username
- `YOUR_GITHUB_TOKEN` con un token con scope `write:packages`

### Crear Token

```bash
gh auth token | pbcopy  # macOS
gh auth token | clip    # Windows
```

O crear uno nuevo:
1. Settings > Developer settings > Personal access tokens
2. Scope: `write:packages`, `read:packages`

### Publicar Paquete

```bash
# Manual
npm publish

# Via GitHub Actions (recomendado)
gh workflow run "Publish to GitHub Packages"
```

### Instalar Paquete

```bash
npm install @YOUR_USERNAME/premium-ecosystem
```

---

## 🔄 Automatización

### Scripts Disponibles

#### Windows (PowerShell)
```powershell
# Setup completo
.\scripts\gh-cli-automation.ps1 -Action setup

# Gestionar PRs
.\scripts\gh-cli-automation.ps1 -Action pr

# Workflows
.\scripts\gh-cli-automation.ps1 -Action workflow

# Seguridad
.\scripts\gh-cli-automation.ps1 -Action security

# Copilot
.\scripts\gh-cli-automation.ps1 -Action copilot -Message "tu pregunta"
```

#### Linux/macOS (Bash)
```bash
# Setup completo
./scripts/gh-cli-automation.sh setup

# Gestionar PRs
./scripts/gh-cli-automation.sh pr

# Workflows
./scripts/gh-cli-automation.sh workflow

# Seguridad
./scripts/gh-cli-automation.sh security

# Copilot
./scripts/gh-cli-automation.sh copilot "tu pregunta"
```

### Aliases Configurados

Después del setup, tendrás estos aliases:

```bash
gh co      # gh pr checkout
gh pv      # gh pr view
gh pc      # gh pr create --fill
gh rv      # gh repo view --web
gh rl      # gh run list
gh rw      # gh run watch
gh il      # gh issue list
gh ic      # gh issue create --web
```

---

## 📊 Dashboard y Monitoreo

### Ver Métricas

```bash
# Instalar gh-dash
gh extension install dlvhdr/gh-dash

# Abrir dashboard
gh dash
```

### Insights

```bash
# Abrir insights en navegador
gh repo view --web

# Ver estadísticas
gh api repos/:owner/:repo/stats/contributors
```

---

## 🎯 Best Practices

### 1. Commits

Usa [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: añadir nueva funcionalidad
fix: corregir bug
docs: actualizar documentación
style: cambios de formato
refactor: refactorización
test: añadir tests
chore: tareas de mantenimiento
```

### 2. Pull Requests

- Usa el template automático
- Solicita reviews automáticos
- Espera que pasen todos los checks
- Usa squash merge para mantener historial limpio

### 3. Releases

```bash
# Crear release con auto-generación de notas
gh release create v1.0.0 --generate-notes

# Con título personalizado
gh release create v1.0.0 --title "Version 1.0.0 - Major Release" --generate-notes
```

### 4. Security

- Revisa alerts semanalmente
- Mantén dependencias actualizadas
- No ignores Dependabot PRs
- Activa branch protection en `main`

---

## 🆘 Troubleshooting

### Copilot no funciona

```bash
# Verificar autenticación
gh auth status

# Re-autenticar
gh auth login

# Verificar extensión
gh extension list | grep copilot
```

### Workflows fallan

```bash
# Ver logs detallados
gh run view <run-id> --log

# Re-ejecutar workflow
gh run rerun <run-id>
```

### CodeQL no encuentra código

Verifica que `.github/codeql/codeql-config.yml` tiene los paths correctos.

### Problemas con Packages

```bash
# Verificar .npmrc
cat .npmrc

# Probar autenticación
npm whoami --registry=https://npm.pkg.github.com
```

---

## 📚 Recursos Adicionales

- [GitHub Copilot Docs](https://docs.github.com/en/copilot)
- [GitHub CLI Manual](https://cli.github.com/manual/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [CodeQL Docs](https://codeql.github.com/docs/)
- [Codespaces Docs](https://docs.github.com/en/codespaces)
- [GitHub Packages Docs](https://docs.github.com/en/packages)

---

## 🎉 ¡Listo!

Ahora tienes configurado el ecosistema completo de GitHub Enterprise Pro. Disfruta de:

✅ Copilot Enterprise con configuración óptima
✅ GitHub CLI con automatización completa
✅ GitHub Actions con CI/CD avanzado
✅ Advanced Security con CodeQL y más
✅ Codespaces optimizados
✅ GitHub Packages configurado
✅ Automatización end-to-end

**¿Necesitas ayuda?** Usa los scripts de automatización o pregunta en Issues.

---

**Creado para Premium Ecosystem**
*Aprovecha al máximo GitHub Enterprise Pro* 🚀
