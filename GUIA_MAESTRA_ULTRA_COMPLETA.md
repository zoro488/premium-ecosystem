# 🚀 GUÍA MAESTRA ULTRA COMPLETA - PREMIUM ECOSYSTEM

## 📋 Índice de Contenido

1. [Configuración Inicial Rápida](#configuración-inicial-rápida)
2. [GitHub Copilot Enterprise - Uso Avanzado](#github-copilot-enterprise)
3. [VSCode - Shortcuts y Configuración](#vscode-shortcuts)
4. [GitHub CLI - Comandos Poderosos](#github-cli)
5. [Desarrollo Diario - Workflow Optimizado](#desarrollo-diario)
6. [Testing Avanzado](#testing-avanzado)
7. [Deployment & CI/CD](#deployment-cicd)
8. [Troubleshooting & Tips](#troubleshooting)

---

## 🎯 Configuración Inicial Rápida

### 1. Ejecutar Setup Automático

```powershell
# Ejecutar configuración completa
.\.github\scripts\setup-complete.ps1

# Con opciones específicas
.\.github\scripts\setup-complete.ps1 -Verbose

# Saltar ciertos pasos
.\.github\scripts\setup-complete.ps1 -SkipExtensions -SkipAliases
```

### 2. Verificar Instalación

```powershell
# Verificar todas las herramientas
node --version        # Node.js
npm --version         # npm
git --version         # Git
gh --version          # GitHub CLI
code --version        # VSCode
firebase --version    # Firebase CLI
docker --version      # Docker (opcional)

# Verificar GitHub Copilot
gh extension list     # Debe mostrar gh-copilot
gh copilot --version  # Versión de Copilot
```

### 3. Autenticación

```powershell
# GitHub CLI
gh auth login

# Firebase
firebase login

# Verificar autenticación
gh auth status
firebase projects:list
```

---

## 🤖 GitHub Copilot Enterprise

### Copilot Chat (Ctrl + I)

#### Comandos Básicos

```
# Explicar código seleccionado
Explica este código

# Generar código
Crea un componente React llamado UserProfile con props: name, email, avatar

# Refactorizar
Refactoriza este componente usando hooks modernos

# Optimizar
Optimiza este código para mejor rendimiento

# Encontrar bugs
¿Hay algún bug o problema en este código?

# Documentar
Genera documentación JSDoc para estas funciones

# Tests
Genera tests unitarios para este componente usando Vitest
```

#### Comandos Avanzados

```
# Análisis de arquitectura
Analiza la arquitectura de esta aplicación y sugiere mejoras

# Patrones de diseño
Implementa el patrón Repository para este servicio

# Accesibilidad
Revisa este componente y mejora la accesibilidad WCAG AA

# Performance
Analiza el rendimiento y sugiere optimizaciones específicas

# Seguridad
Revisa este código y detecta vulnerabilidades de seguridad

# TypeScript
Convierte este JavaScript a TypeScript con tipos estrictos

# Estado global
Migra este useState a Zustand store

# React Query
Implementa cache con TanStack Query para estas llamadas API
```

#### Usar con Contexto de Archivos

```
# Referencia archivos
@archivo.js Explica cómo interactúa este archivo con el sistema

# Múltiples archivos
@App.jsx @useAuth.js ¿Cómo puedo mejorar la integración entre estos?

# Workspace entero
@workspace Genera un diagrama de la arquitectura completa
```

### Copilot Inline (Tab)

#### Trucos para Mejores Sugerencias

```javascript
// 1. Comentarios descriptivos
// Función que valida email usando regex y retorna boolean
const validateEmail = // Tab aquí

// 2. Nombres descriptivos
function fetchUserDataWithCachingAndErrorHandling // Tab aquí

// 3. Tipos TypeScript
const processPayment: (amount: number, currency: string) => Promise<PaymentResult> = // Tab

// 4. Ejemplos en comentarios
// Ejemplo: formatDate(new Date(), 'dd/MM/yyyy') => '22/10/2025'
function formatDate // Tab
```

### GitHub Copilot CLI

#### Suggest (ghcs)

```powershell
# Sugerencias de comandos
ghcs "instalar React con TypeScript"
ghcs "crear componente funcional con hooks"
ghcs "configurar ESLint para React"
ghcs "hacer commit de cambios"
ghcs "desplegar a Firebase"
ghcs "ejecutar tests con coverage"
ghcs "optimizar bundle size"
```

#### Explain (ghce)

```powershell
# Explicar comandos
ghce "git rebase -i HEAD~5"
ghce "npm run build -- --mode production"
ghce "docker-compose up -d"
ghce "npx playwright test --headed"
ghce "firebase deploy --only hosting"
```

#### Alias Personalizados (después de setup)

```powershell
# Copilot shortcuts
ghcs "comando que necesitas"
ghce "comando a explicar"

# Review código
copilot-review "src/App.jsx"

# Generar tests
copilot-test "src/utils/helpers.js"

# Optimizar código
copilot-optimize "src/components/Chart.jsx"

# Documentar
copilot-docs "src/services/authService.js"

# Análisis de seguridad
copilot-security "src/config/firebase.js"
```

---

## 💻 VSCode - Shortcuts y Configuración

### Shortcuts Esenciales

#### Copilot

| Shortcut | Acción |
|----------|--------|
| `Ctrl + I` | Abrir Copilot Chat |
| `Tab` | Aceptar sugerencia |
| `Alt + ]` | Siguiente sugerencia |
| `Alt + [` | Sugerencia anterior |
| `Ctrl + Enter` | Ver todas las sugerencias |
| `Esc` | Cerrar sugerencias |

#### Editor

| Shortcut | Acción |
|----------|--------|
| `Ctrl + P` | Quick Open (abrir archivo) |
| `Ctrl + Shift + P` | Command Palette |
| `Ctrl + ,` | Settings |
| `Ctrl + B` | Toggle Sidebar |
| `Ctrl + J` | Toggle Terminal |
| `Ctrl + \`` | Toggle Terminal |
| `Alt + Z` | Toggle Word Wrap |

#### Código

| Shortcut | Acción |
|----------|--------|
| `Ctrl + Space` | Trigger Intellisense |
| `Ctrl + .` | Quick Fix |
| `F12` | Go to Definition |
| `Alt + F12` | Peek Definition |
| `Shift + F12` | Find All References |
| `F2` | Rename Symbol |
| `Ctrl + Shift + O` | Go to Symbol |
| `Ctrl + Shift + F` | Search in Files |

#### Multi-cursor

| Shortcut | Acción |
|----------|--------|
| `Alt + Click` | Agregar cursor |
| `Ctrl + Alt + ↑/↓` | Agregar cursor arriba/abajo |
| `Ctrl + D` | Seleccionar siguiente ocurrencia |
| `Ctrl + Shift + L` | Seleccionar todas las ocurrencias |

#### Navegación

| Shortcut | Acción |
|----------|--------|
| `Ctrl + Tab` | Cambiar entre archivos abiertos |
| `Ctrl + 1/2/3` | Focus en grupo de editor |
| `Ctrl + PageUp/PageDown` | Navegar tabs |
| `Alt + ←/→` | Ir atrás/adelante |

#### Git

| Shortcut | Acción |
|----------|--------|
| `Ctrl + Shift + G` | Abrir Source Control |
| `Ctrl + Enter` | Commit |

### Comandos Útiles (Ctrl + Shift + P)

```
# Copilot
> GitHub Copilot: Enable
> GitHub Copilot: Disable
> GitHub Copilot: Open Chat
> GitHub Copilot: Reset

# Formateo
> Format Document
> Format Selection
> Organize Imports

# Testing
> Vitest: Run All Tests
> Playwright: Record Test
> Test: Run Current File

# Git
> Git: Commit
> Git: Push
> Git: Pull
> Git: Create Branch

# Tareas
> Tasks: Run Task
> Tasks: Run Build Task
> Tasks: Run Test Task
```

### Configuraciones Avanzadas Aplicadas

✅ **GitHub Copilot configurado con:**
- GPT-4 Turbo engine
- 5 sugerencias inline simultáneas
- 10 sugerencias en lista
- Chat en español
- Semantic search activado
- Features experimentales habilitadas

✅ **Editor optimizado con:**
- Inlay hints completos (parámetros, tipos, returns)
- Sticky scroll
- Semantic highlighting
- Auto-save cada 1 segundo
- Format on save
- Organize imports on save

✅ **JavaScript/TypeScript con:**
- Auto imports
- JSDoc completion
- Inlay hints para todo
- 8GB memoria para TS Server
- Quote style: single

✅ **ESLint configurado con:**
- Run on type
- Fix all on save
- Format enable
- Working directories auto

✅ **Git mejorado con:**
- Smart commit
- Auto fetch cada 3 minutos
- Branch protection (main, master, develop)
- Decorations enabled
- Always open in parent folders

---

## 🔧 GitHub CLI

### Básicos

```powershell
# Autenticación
gh auth login
gh auth status
gh auth refresh

# Repos
gh repo view
gh repo clone OWNER/REPO
gh repo create

# PRs
gh pr list
gh pr create
gh pr checkout NUMBER
gh pr merge NUMBER
gh pr review

# Issues
gh issue list
gh issue create
gh issue close NUMBER

# Workflows
gh workflow list
gh workflow run WORKFLOW
gh workflow view WORKFLOW

# Releases
gh release list
gh release create TAG
```

### Avanzados

```powershell
# Ver PR en navegador
gh pr view --web

# Crear PR desde CLI
gh pr create --title "Feature" --body "Description" --base main

# Ver status de checks
gh pr checks

# Aprobar PR
gh pr review --approve

# Ver logs de workflow
gh run list
gh run view RUN_ID --log

# Secrets
gh secret set SECRET_NAME

# API directa
gh api repos/OWNER/REPO/issues
gh api user

# Extensions
gh extension list
gh extension install OWNER/REPO
gh extension upgrade --all
```

---

## 🔄 Desarrollo Diario - Workflow Optimizado

### Morning Routine

```powershell
# 1. Pull últimos cambios
git pull origin main

# 2. Verificar actualizaciones
npm outdated

# 3. Verificar issues y PRs
gh pr list
gh issue list --assignee @me

# 4. Iniciar dev server
npm run dev
```

### Crear Nueva Feature

```powershell
# 1. Crear branch
git checkout -b feature/nueva-funcionalidad

# 2. Desarrollar con Copilot
# Usa Ctrl + I para planificar
# Usa Tab para completar código
# Usa copilot-review para revisar

# 3. Ejecutar tests
npm run test

# 4. Lint y format
npm run lint:fix
npm run format

# 5. Commit con mensaje de Copilot
git add .
ghcs "generar mensaje de commit para estos cambios"
# O usa el alias:
# gc "feat: descripción de la feature"

# 6. Push
git push -u origin feature/nueva-funcionalidad

# 7. Crear PR
gh pr create --title "Nueva funcionalidad" --body "Descripción detallada"
```

### Fix de Bugs

```powershell
# 1. Crear branch
git checkout -b fix/bug-description

# 2. Usar Copilot para analizar
# Selecciona código problemático
# Ctrl + I: "¿Cuál es el bug aquí y cómo solucionarlo?"

# 3. Aplicar fix

# 4. Tests para el bug
copilot-test "src/component-con-bug.jsx"

# 5. Commit y PR
git add .
gc "fix: descripción del bug solucionado"
git push -u origin fix/bug-description
gh pr create
```

### Refactoring

```powershell
# 1. Branch para refactor
git checkout -b refactor/mejora-codigo

# 2. Usar Copilot
# Ctrl + I: "Refactoriza este código usando [patrón/approach]"

# 3. Asegurar que tests pasen
npm run test
npm run test:e2e

# 4. Verificar performance
npm run build
# Analizar bundle size

# 5. Commit y PR
git add .
gc "refactor: descripción de mejoras"
git push -u origin refactor/mejora-codigo
gh pr create
```

---

## 🧪 Testing Avanzado

### Vitest (Unit Tests)

```powershell
# Ejecutar todos los tests
npm run test

# Watch mode
npm run test:watch

# UI mode
npm run test:ui

# Coverage
npm run test:coverage

# Test específico
npm run test -- nombre-archivo.test.js

# Debug test (F5 en VSCode)
# Usar configuración "🧪 Vitest: Debug Current File"
```

### Playwright (E2E Tests)

```powershell
# Ejecutar todos los E2E
npm run test:e2e

# UI Mode (recomendado)
npm run test:e2e:ui

# Headed mode (ver navegador)
npx playwright test --headed

# Debug mode
npx playwright test --debug

# Test específico
npx playwright test tests/login.spec.js

# Generar tests grabando
npx playwright codegen http://localhost:5173

# Ver reporte
npm run test:e2e:report
```

### Generar Tests con Copilot

```powershell
# Método 1: CLI
copilot-test "src/utils/helpers.js"

# Método 2: VSCode
# 1. Abre el archivo
# 2. Ctrl + I
# 3. "Genera tests unitarios completos para este archivo usando Vitest"

# Método 3: Task de VSCode
# Ctrl + Shift + P > Tasks: Run Task > 🧪 Copilot: Generate Test for Current File
```

---

## 🚀 Deployment & CI/CD

### Deploy Manual

```powershell
# Build
npm run build

# Preview local
npm run preview

# Deploy a Firebase
npm run deploy

# Deploy preview channel
npm run deploy:preview

# Quick deploy (lint + build + deploy)
npm run quick-deploy
```

### Firebase Hosting

```powershell
# Login
firebase login

# Ver proyectos
firebase projects:list

# Usar proyecto específico
firebase use premium-ecosystem

# Deploy solo hosting
firebase deploy --only hosting

# Preview channel (temporal)
firebase hosting:channel:deploy preview-branch-name

# Ver URLs
firebase hosting:channel:list

# Borrar preview channel
firebase hosting:channel:delete preview-branch-name
```

### GitHub Actions (Automático)

Los workflows se ejecutan automáticamente en:

#### Pull Requests
- ✅ Lint check
- ✅ Tests unitarios
- ✅ Tests E2E
- ✅ Build
- ✅ Copilot review automático
- ✅ Security scan
- ✅ Preview deployment

#### Push a `main`
- ✅ Todos los checks de PR
- ✅ Deploy a producción
- ✅ Generate docs
- ✅ Update changelog

#### Ejecutar Workflow Manualmente

```powershell
# Listar workflows
gh workflow list

# Ejecutar workflow
gh workflow run "CI/CD Pipeline"

# Ver runs
gh run list

# Ver logs de run específico
gh run view RUN_ID --log

# Re-ejecutar failed run
gh run rerun RUN_ID
```

---

## 🛠️ Troubleshooting & Tips

### Copilot no funciona

```powershell
# 1. Verificar autenticación
gh auth status

# 2. Re-autenticar
gh auth logout
gh auth login

# 3. Verificar licencia
# Ir a: https://github.com/settings/copilot

# 4. Reinstalar extensión CLI
gh extension remove gh-copilot
gh extension install github/gh-copilot

# 5. Verificar en VSCode
# Ctrl + Shift + P > GitHub Copilot: Reset
# Reiniciar VSCode
```

### Build Errors

```powershell
# Limpiar cache y reinstalar
npm run clean:all
npm install

# Verificar Node version
node --version  # Debe ser >= 18

# Reinstalar una dependencia
npm uninstall PACKAGE
npm install PACKAGE

# Verificar package.json
npm audit
npm audit fix
```

### Git Issues

```powershell
# Descartar cambios locales
git checkout -- .

# Limpiar archivos no trackeados
git clean -fd

# Reset a commit anterior
git reset --hard HEAD~1

# Ver diferencias
git diff
git diff --staged

# Stash cambios temporales
git stash
git stash pop
```

### Performance Issues

```powershell
# Analizar bundle size
npm run build -- --analyze

# Lighthouse audit
npx lighthouse http://localhost:5173 --view

# Check dependencias pesadas
npx cost-of-modules

# Verificar memoria de VSCode
# Ctrl + Shift + P > Developer: Show Running Extensions
```

---

## 💡 Tips Pro

### 1. Copilot Context

```
# Siempre da contexto
Malo: "Crea un componente"
Bueno: "Crea un componente React de tabla de usuarios con paginación, filtros y ordenamiento usando TanStack Table"

# Usa ejemplos
"Crea una función similar a fetchUsers pero para productos, con los mismos parámetros de paginación"

# Especifica el stack
"Implementa autenticación usando Firebase Auth v12 API modular, React 18 hooks y Zustand para el estado"
```

### 2. Multi-archivo Editing

```powershell
# Buscar y reemplazar en múltiples archivos
# Ctrl + Shift + H

# Copilot para cambios masivos
# Ctrl + I: "Renombra todas las referencias de 'oldName' a 'newName' en estos archivos: @file1 @file2 @file3"
```

### 3. Snippets Personalizados

Crea snippets en VSCode (File > Preferences > User Snippets):

```json
{
  "React Functional Component": {
    "prefix": "rfc",
    "body": [
      "export default function ${1:ComponentName}() {",
      "  return (",
      "    <div className=\"${2:container}\">",
      "      ${3}",
      "    </div>",
      "  )",
      "}"
    ]
  }
}
```

### 4. Tasks Personalizadas

Añade a `.vscode/tasks.json`:

```json
{
  "label": "🚀 Full Deploy",
  "dependsOn": ["lint", "test", "build", "deploy"],
  "dependsOrder": "sequence"
}
```

### 5. Debugging Avanzado

```powershell
# Chrome DevTools en VSCode
# F5 > Configuración "🌐 Chrome: Launch & Debug"

# Node Inspector
# F5 > Configuración "🚀 Vite: Start Dev Server"

# Tests con Debugger
# F5 > Configuración "🧪 Vitest: Debug Current File"
```

---

## 📚 Recursos Adicionales

### Documentación Oficial

- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Firebase Docs](https://firebase.google.com/docs)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Vitest](https://vitest.dev)
- [Playwright](https://playwright.dev)
- [GitHub Copilot](https://docs.github.com/copilot)

### Archivos del Proyecto

- `README.md` - Información general del proyecto
- `COPILOT_ENTERPRISE_GUIDE.md` - Guía detallada de Copilot
- `DEPLOYMENT_GUIDE.md` - Guía de deployment
- `CONTRIBUTING.md` - Guía para contribuir
- `.github/copilot-instructions.md` - Instrucciones personalizadas de Copilot

### Scripts Útiles

```powershell
# Análisis de código
.\.github\scripts\copilot-automation.ps1 -Action analyze

# Optimización automática
.\.github\scripts\copilot-automation.ps1 -Action optimize

# Generación de tests
.\.github\scripts\copilot-automation.ps1 -Action test

# Security scan
.\.github\scripts\copilot-automation.ps1 -Action security

# Generar docs
.\.github\scripts\copilot-automation.ps1 -Action docs

# Ejecutar todo
.\.github\scripts\copilot-automation.ps1 -Action all
```

---

## ⚡ Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│ COPILOT SHORTCUTS                                          │
├─────────────────────────────────────────────────────────────┤
│ Ctrl + I      │ Copilot Chat                               │
│ Tab           │ Aceptar sugerencia                         │
│ Alt + ]       │ Siguiente sugerencia                       │
│ Ctrl + Enter  │ Ver todas las sugerencias                  │
├─────────────────────────────────────────────────────────────┤
│ CLI ALIASES                                                │
├─────────────────────────────────────────────────────────────┤
│ ghcs          │ Copilot suggest                            │
│ ghce          │ Copilot explain                            │
│ dev           │ npm run dev                                │
│ build         │ npm run build                              │
│ test          │ npm run test                               │
│ gs            │ git status                                 │
│ ga            │ git add .                                  │
│ gc "msg"      │ git commit -m "msg"                        │
├─────────────────────────────────────────────────────────────┤
│ VSCODE TASKS (Ctrl + Shift + P > Tasks: Run Task)         │
├─────────────────────────────────────────────────────────────┤
│ 🚀 Start Dev Server                                        │
│ 🏗️ Build Production                                        │
│ 🧪 Run Unit Tests                                          │
│ 🎭 Run E2E Tests                                           │
│ 🤖 Copilot: Analyze Code                                   │
│ 🤖 Copilot: Optimize Code                                  │
│ 🤖 Copilot: Generate Tests                                 │
└─────────────────────────────────────────────────────────────┘
```

---

**🎉 ¡Estás listo para desarrollar con máxima productividad!**

Para más ayuda, usa Copilot Chat: `Ctrl + I` y pregunta lo que necesites.
