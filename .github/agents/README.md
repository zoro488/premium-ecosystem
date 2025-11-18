# 🤖 Automation Agents Documentation

## Overview

Los **Automation Agents** son scripts inteligentes de Node.js que automatizan tareas críticas del proyecto Premium Ecosystem. Utilizan la API de GitHub (Octokit) para interactuar con el repositorio y generar código, tests, reportes y más.

---

## 🚀 Agents Disponibles

### 1. **Auto-Complete Agent** (`auto-complete-agent.js`)
Analiza el repositorio, identifica gaps y tareas pendientes, y automatiza su completación.

### 2. **Test Generator Agent** (`test-generator-agent.js`)
Genera automáticamente tests unitarios y E2E para componentes sin cobertura.

### 3. **Monitoring Dashboard Agent** (`monitoring-dashboard-agent.js`)
Monitorea el estado del sistema en tiempo real y genera dashboards con alertas.

---

## 📋 Pre-requisitos

### 1. Node.js
```bash
node --version  # Requiere v18.0.0 o superior
```

### 2. GitHub Token
Necesitas un Personal Access Token con permisos:
- `repo` (full access)
- `workflow` (run workflows)

### 3. Dependencias
```bash
# Instalar Octokit
npm install @octokit/rest
# o
npm install  # Si ya está en package.json
```

### 4. Variables de Entorno
```bash
# Windows (PowerShell)
$env:GITHUB_TOKEN = "ghp_your_token_here"

# Linux/Mac
export GITHUB_TOKEN="ghp_your_token_here"

# O crear archivo .env
echo "GITHUB_TOKEN=ghp_your_token_here" > .env
```

---

## 🎯 1. Auto-Complete Agent

### Descripción
Analiza el repositorio completo, identifica componentes faltantes, detecta gaps y crea issues automáticamente. También puede implementar código para items críticos.

### Uso
```bash
# Desde raíz del proyecto
node .github/agents/auto-complete-agent.js
```

### Funcionalidades
1. **Analizar Repositorio**: Escanea `src/`, `apps/`, `.github/`
2. **Identificar Gaps**: Detecta componentes sin tests, archivos vacíos, TODOs
3. **Crear Issues**: Genera issues automáticamente en GitHub
4. **Auto-Implementar**: Genera código para items críticos
5. **Monitorear Progreso**: Rastrea estado de issues creados

### Output
```bash
automation-reports/
├── progress-report.json      # Reporte de progreso
└── auto-complete-log.txt     # Logs de ejecución
```

### Ejemplo de Output
```json
{
  "timestamp": "2025-11-18T12:00:00Z",
  "gaps_identified": 12,
  "issues_created": 8,
  "code_generated": 3,
  "components_analyzed": 69,
  "gaps": [
    {
      "type": "missing_component",
      "name": "SplineScene3D",
      "priority": "critical",
      "status": "issue_created",
      "issue_number": 77
    }
  ]
}
```

### Configuración
Edita las constantes al inicio del archivo:
```javascript
const OWNER = 'zoro488'
const REPO = 'premium-ecosystem'
const BASE_PATH = 'c:/Users/xpovo/Documents/premium-ecosystem'
```

---

## 🧪 2. Test Generator Agent

### Descripción
Analiza componentes sin tests y genera automáticamente tests unitarios (Vitest + React Testing Library) y E2E (Playwright).

### Uso
```bash
# Desde raíz del proyecto
node .github/agents/test-generator-agent.js
```

### Funcionalidades
1. **Analizar Cobertura**: Identifica componentes sin tests
2. **Generar Unit Tests**: Crea tests para hooks, components, services
3. **Generar E2E Tests**: Crea tests Playwright para páginas
4. **Crear PRs**: Sube tests generados automáticamente
5. **Reportar Mejoras**: Calcula incremento de cobertura

### Output
```bash
src/
├── components/
│   └── SplineScene3D/
│       └── __tests__/
│           └── SplineScene3D.test.jsx  # Generated
└── apps/
    └── FlowDistributor/
        └── __tests__/
            └── FlowDistributor.e2e.test.js  # Generated

automation-reports/
└── test-coverage-report.json
```

### Ejemplo de Test Generado
```javascript
// src/components/SplineScene3D/__tests__/SplineScene3D.test.jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SplineScene3D from '../SplineScene3D'

describe('SplineScene3D', () => {
  it('renders without crashing', () => {
    render(<SplineScene3D />)
    expect(screen.getByTestId('spline-scene')).toBeInTheDocument()
  })

  it('loads 3D scene correctly', async () => {
    const { container } = render(<SplineScene3D />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })
})
```

### Ejemplo de Output
```json
{
  "timestamp": "2025-11-18T12:30:00Z",
  "components_analyzed": 69,
  "components_without_tests": 41,
  "tests_generated": {
    "unit": 28,
    "e2e": 13
  },
  "coverage_improvement": {
    "before": "40%",
    "after": "65%",
    "increase": "+25%"
  },
  "pr_created": {
    "number": 87,
    "title": "test: Add auto-generated tests for 41 components",
    "url": "https://github.com/zoro488/premium-ecosystem/pull/87"
  }
}
```

---

## 📊 3. Monitoring Dashboard Agent

### Descripción
Monitorea el estado completo del sistema, calcula health score, genera alertas y crea dashboards visuales en Markdown.

### Uso
```bash
# Desde raíz del proyecto
node .github/agents/monitoring-dashboard-agent.js
```

### Funcionalidades
1. **Monitorear PRs**: Estado, stale, draft, ready to merge
2. **Monitorear Issues**: Críticos, security, stale
3. **Monitorear Workflows**: Success rate, failures
4. **Calcular Health Score**: Score 0-100 del sistema
5. **Generar Alertas**: Críticas, warning, info
6. **Crear Dashboard**: Reporte visual en Markdown

### Output
```bash
automation-reports/
├── dashboard.md              # Dashboard visual
└── monitoring-report.json    # Datos raw
```

### Ejemplo de Dashboard
```markdown
# 📊 Premium Ecosystem - System Dashboard

**Generated:** 2025-11-18 12:45:00
**Health Score:** 78/100 🟡

## 🚦 System Status

### Pull Requests
- **Total Open:** 33
- **Stale (>30 days):** 12 ⚠️
- **Draft:** 5
- **Ready to Merge:** 16

### Issues
- **Total Open:** 58
- **Critical:** 3 🔴
- **Security:** 41 🔴
- **Stale (>60 days):** 8 ⚠️

### Workflows
- **Success Rate:** 78%
- **Recent Failures:** 5

## 🔔 Alerts

### 🔴 CRITICAL
- 41 security issues need immediate attention
- 3 critical bugs blocking deployment

### ⚠️ WARNING
- 12 PRs stale for more than 30 days
- Test coverage below 80% (currently 40%)

### ℹ️ INFO
- 16 PRs ready to merge
- 5 draft PRs in progress
```

### Ejemplo de Output JSON
```json
{
  "timestamp": "2025-11-18T12:45:00Z",
  "health_score": 78,
  "metrics": {
    "prs": {
      "total": 33,
      "stale": 12,
      "draft": 5,
      "ready": 16
    },
    "issues": {
      "total": 58,
      "critical": 3,
      "security": 41,
      "stale": 8
    },
    "workflows": {
      "success_rate": 78,
      "failures": 5
    }
  },
  "alerts": {
    "critical": [
      "41 security issues need immediate attention",
      "3 critical bugs blocking deployment"
    ],
    "warning": [
      "12 PRs stale for more than 30 days",
      "Test coverage below 80%"
    ],
    "info": [
      "16 PRs ready to merge",
      "5 draft PRs in progress"
    ]
  }
}
```

---

## ⚙️ Configuración Avanzada

### Rate Limiting
Los agents implementan retry logic para evitar rate limits de GitHub:
```javascript
// Ya implementado en los agents
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await delay(1000 * Math.pow(2, i))
    }
  }
}
```

### Custom Labels
Puedes personalizar labels en los agents:
```javascript
// En auto-complete-agent.js
const labels = [
  'enhancement',
  'automation',
  'critical',      // Para gaps críticos
  'high-priority', // Para gaps high
  'good-first-issue' // Para gaps low
]
```

### Directorios Personalizados
```javascript
// Cambiar rutas de análisis
const DIRECTORIES = [
  'src/components',
  'src/apps',
  'src/hooks',
  'src/services',
  'src/lib'
]
```

---

## 🔄 Automatización con GitHub Actions

### Workflow para Ejecutar Agents

Crea `.github/workflows/run-agents.yml`:
```yaml
name: Run Automation Agents

on:
  schedule:
    - cron: '0 2 * * *'  # Diario a las 2 AM UTC
  workflow_dispatch:
    inputs:
      agent:
        description: 'Agent to run'
        required: true
        type: choice
        options:
          - all
          - auto-complete
          - test-generator
          - monitoring

jobs:
  run-agents:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Dependencies
        run: npm install @octokit/rest

      - name: Run Auto-Complete Agent
        if: ${{ github.event.inputs.agent == 'all' || github.event.inputs.agent == 'auto-complete' }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: node .github/agents/auto-complete-agent.js

      - name: Run Test Generator Agent
        if: ${{ github.event.inputs.agent == 'all' || github.event.inputs.agent == 'test-generator' }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: node .github/agents/test-generator-agent.js

      - name: Run Monitoring Dashboard Agent
        if: ${{ github.event.inputs.agent == 'all' || github.event.inputs.agent == 'monitoring' }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: node .github/agents/monitoring-dashboard-agent.js

      - name: Upload Reports
        uses: actions/upload-artifact@v4
        with:
          name: automation-reports
          path: automation-reports/
```

### Ejecutar Manualmente
```bash
# Ejecutar workflow desde GitHub CLI
gh workflow run run-agents.yml --field agent=all

# Ver estado
gh run list --workflow=run-agents.yml --limit 1

# Ver logs
gh run view --log
```

---

## 🐛 Troubleshooting

### Error: "GITHUB_TOKEN not found"
```bash
# Verificar que token esté configurado
echo $env:GITHUB_TOKEN  # Windows
echo $GITHUB_TOKEN      # Linux/Mac

# Configurarlo si falta
$env:GITHUB_TOKEN = "ghp_your_token_here"
```

### Error: "Rate limit exceeded"
```javascript
// Los agents ya tienen retry logic
// Espera unos minutos y reintenta
// O aumenta delay en retryWithBackoff()
```

### Error: "Cannot find module '@octokit/rest'"
```bash
# Instalar Octokit
npm install @octokit/rest

# Verificar instalación
npm list @octokit/rest
```

### Error: "Permission denied creating issues"
```bash
# Verifica permisos del token:
# - repo (full access)
# - workflow (run workflows)

# Genera nuevo token:
# https://github.com/settings/tokens/new
```

---

## 📈 Mejores Prácticas

### 1. Ejecutar Agents en Orden
```bash
# 1. Primero Monitoring (evaluar estado)
node .github/agents/monitoring-dashboard-agent.js
cat automation-reports/dashboard.md

# 2. Luego Auto-Complete (identificar gaps)
node .github/agents/auto-complete-agent.js
cat automation-reports/progress-report.json

# 3. Finalmente Test Generator (mejorar cobertura)
node .github/agents/test-generator-agent.js
cat automation-reports/test-coverage-report.json
```

### 2. Revisar Output Antes de Crear PRs
```bash
# Los agents generan reportes primero
# Revisar reportes antes de auto-crear PRs
cat automation-reports/*.json

# Si todo está bien, ejecutar con flag --create-pr
node .github/agents/test-generator-agent.js --create-pr
```

### 3. Monitoreo Continuo
```bash
# Ejecutar Monitoring Agent diariamente
# Configurar cron job o GitHub Action
gh workflow run run-agents.yml --field agent=monitoring
```

---

## 🔗 Referencias

- [Octokit Documentation](https://octokit.github.io/rest.js)
- [GitHub API Reference](https://docs.github.com/en/rest)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)

---

## 📞 Soporte

### Issues
Si encuentras problemas con los agents:
```bash
# Crear issue
gh issue create --title "🤖 Agent Issue: [descripción]" --body "..." --label bug,automation
```

### Logs
Los agents guardan logs en:
- `automation-reports/auto-complete-log.txt`
- `automation-reports/test-generator-log.txt`
- `automation-reports/monitoring-log.txt`

### Debug Mode
Activa debug mode editando el agent:
```javascript
const DEBUG = true  // Cambiar a true al inicio del archivo
```

---

**🎉 Happy Automating!**

Los agents están diseñados para ser autónomos y robustos. Ejecuta, revisa reportes, y deja que hagan el trabajo pesado por ti.

**Recomendado:** Ejecutar Monitoring Agent diariamente para mantener visibilidad del sistema.
