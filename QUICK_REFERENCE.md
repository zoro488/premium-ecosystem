# 🚀 Quick Reference - Premium Ecosystem

Comandos y guías rápidas para el día a día.

---

## 📦 NPM Scripts

```bash
# Desarrollo
npm run dev              # Iniciar servidor dev (puerto 5173)
npm run build            # Build de producción
npm run preview          # Preview del build

# Testing
npm run test             # Tests en modo watch
npm run test:run         # Ejecutar tests una vez
npm run test:coverage    # Generar coverage report
npm run test:e2e         # E2E tests con Playwright
npm run test:e2e:ui      # E2E en modo UI
npm run test:e2e:report  # Ver reporte de E2E

# Code Quality
npm run lint             # Ejecutar ESLint
npm run lint -- --fix    # Fix automático de errores
```

---

## 🔀 Git Workflow

### Setup Inicial
```bash
# Clonar repositorio
git clone https://github.com/TU-USUARIO/premium-ecosystem.git
cd premium-ecosystem
npm install

# Configurar identity (primera vez)
git config user.name "Tu Nombre"
git config user.email "tu@email.com"
```

### Desarrollo Diario
```bash
# Actualizar desde main
git checkout main
git pull origin main

# Crear nueva branch
git checkout -b feature/mi-funcionalidad

# Hacer cambios...
git add .
git commit -m "feat: descripción del cambio"

# Pushear branch
git push -u origin feature/mi-funcionalidad

# Crear PR en GitHub
```

### Conventional Commits
```bash
feat(scope):     # Nueva funcionalidad
fix(scope):      # Arreglo de bug
docs:            # Cambios en documentación
style:           # Formateo, punto y coma, etc.
refactor:        # Refactorización
test:            # Agregar tests
chore:           # Mantenimiento
perf:            # Mejora de performance
ci:              # Cambios en CI/CD

# Ejemplos:
git commit -m "feat(apollo): add object detection"
git commit -m "fix(flow): correct inventory bug"
git commit -m "docs(readme): update setup instructions"
```

---

## 🔧 GitHub Actions

### Ver Status de Workflows
```bash
# En GitHub.com:
Actions tab → Select workflow → View runs

# O desde CLI con gh:
gh workflow list
gh run list
gh run view [run-id]
```

### Re-ejecutar Workflow Fallido
```bash
# Desde GitHub.com:
Actions → Failed run → Re-run jobs

# Desde CLI:
gh run rerun [run-id]
```

### Ver Logs
```bash
gh run view [run-id] --log
```

---

## 🔐 GitHub Secrets

### Listar Secrets (nombres solamente)
```bash
gh secret list
```

### Agregar Secret
```bash
# Desde GitHub.com:
Settings → Secrets → New repository secret

# Desde CLI:
gh secret set SECRET_NAME
# Luego pega el valor y presiona Ctrl+D
```

### Actualizar Secret
```bash
gh secret set SECRET_NAME --body "nuevo-valor"
```

---

## 🐛 Issue Management

### Crear Issue
```bash
# Desde GitHub.com:
Issues → New issue → Select template

# Desde CLI:
gh issue create --title "Bug en Apollo" --body "Descripción..."
```

### Ver Issues
```bash
gh issue list
gh issue list --label bug
gh issue list --assignee @me
```

### Cerrar Issue
```bash
gh issue close [issue-number]
```

---

## 🔀 Pull Request Workflow

### Crear PR
```bash
# Después de pushear tu branch:
gh pr create --title "feat: nueva funcionalidad" --body "Descripción..."

# O crear desde template:
gh pr create --web
```

### Ver PRs
```bash
gh pr list
gh pr view [pr-number]
gh pr diff [pr-number]
```

### Merge PR
```bash
# Squash merge (recomendado):
gh pr merge [pr-number] --squash

# Regular merge:
gh pr merge [pr-number] --merge

# Rebase:
gh pr merge [pr-number] --rebase
```

### Checkout PR Localmente
```bash
gh pr checkout [pr-number]
```

---

## ☁️ GitHub Codespaces

### Crear Codespace
```bash
# Desde GitHub.com:
Code → Codespaces → Create codespace on main

# Desde CLI:
gh codespace create

# Con configuración específica:
gh codespace create --repo OWNER/REPO --branch BRANCH
```

### Listar Codespaces
```bash
gh codespace list
```

### Conectar a Codespace
```bash
# SSH:
gh codespace ssh

# VS Code:
gh codespace code
```

### Eliminar Codespace
```bash
gh codespace delete --codespace NAME
```

---

## 🚀 Deployment

### Vercel

```bash
# Instalar CLI:
npm i -g vercel

# Login:
vercel login

# Deploy preview:
vercel

# Deploy a producción:
vercel --prod

# Ver deployments:
vercel ls

# Ver logs:
vercel logs [deployment-url]
```

### Firebase

```bash
# Instalar CLI:
npm i -g firebase-tools

# Login:
firebase login

# Deploy:
firebase deploy --only hosting

# Ver proyectos:
firebase projects:list

# Ver URL:
firebase hosting:channel:list
```

---

## 🔍 Troubleshooting Common Issues

### "node_modules missing"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Port 5173 already in use"
```bash
# Matar proceso en el puerto:
# Windows:
netstat -ano | findstr :5173
taskkill /PID [PID] /F

# Linux/Mac:
lsof -ti:5173 | xargs kill -9
```

### "Git conflicts"
```bash
# Ver archivos en conflicto:
git status

# Resolver manualmente, luego:
git add .
git commit -m "resolve merge conflicts"
```

### "Workflow failing on CI"
```bash
# 1. Ejecuta localmente primero:
npm run lint
npm run test:run
npm run build

# 2. Si pasa local pero falla en CI:
# - Revisa node version (debe ser 18)
# - Revisa secrets configurados
# - Ver logs detallados en Actions tab
```

---

## 📊 Monitoring & Analytics

### Sentry
```javascript
// Ver errores en:
https://sentry.io/organizations/YOUR-ORG/issues/

// Filtrar por release:
release:"premium-ecosystem@3.0.0"

// Buscar errores de usuario específico:
user.email:"user@example.com"
```

### Vercel Analytics
```bash
# Ver en dashboard:
https://vercel.com/YOUR-USERNAME/premium-ecosystem/analytics
```

### Firebase
```bash
# Hosting traffic:
firebase hosting:channel:list

# Ver métricas:
# Firebase Console → Hosting → Usage
```

---

## 🔒 Security Commands

### NPM Audit
```bash
# Ver vulnerabilidades:
npm audit

# Fix automático:
npm audit fix

# Force fix:
npm audit fix --force

# Solo vulnerabilidades de producción:
npm audit --production
```

### Dependabot
```bash
# Ver dependency graph:
# GitHub → Insights → Dependency graph

# Security advisories:
# GitHub → Security → Dependabot alerts
```

---

## 📱 Aplicaciones del Ecosistema

### URLs Locales
```bash
http://localhost:5173/          # Hub Principal
http://localhost:5173/flow      # FlowDistributor
http://localhost:5173/shadow    # ShadowPrime
http://localhost:5173/apollo    # Apollo
http://localhost:5173/synapse   # Synapse
http://localhost:5173/nexus     # Nexus
```

### Estructura
```bash
src/apps/
├── FlowDistributor/    # 💼 Gestión empresarial
├── ShadowPrime/        # 💰 Crypto wallets
├── Apollo/             # 🛰️ GPS & Drones
├── Synapse/            # 🧠 AI Chat
└── Nexus/              # 🔗 Control Center
```

---

## 🎨 Code Snippets

### Crear Nuevo Componente
```bash
# Ubicación:
src/apps/[AppName]/components/MyComponent.jsx

# Template:
import { motion } from 'framer-motion';

const MyComponent = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass p-6 rounded-lg"
    >
      {/* Contenido */}
    </motion.div>
  );
};

export default MyComponent;
```

### Agregar Test
```javascript
// src/test/myFeature.test.js
import { describe, it, expect } from 'vitest';
import { myFunction } from '../utils/myFeature';

describe('myFunction', () => {
  it('should do something', () => {
    expect(myFunction(input)).toBe(expectedOutput);
  });
});
```

---

## 📚 Documentos Importantes

| Documento | Descripción |
|-----------|-------------|
| [README.md](README.md) | Documentación principal |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Guía de contribución |
| [SECURITY.md](SECURITY.md) | Política de seguridad |
| [GITHUB_SETUP_GUIDE.md](GITHUB_SETUP_GUIDE.md) | Setup de GitHub |
| [API_SETUP_GUIDE.md](API_SETUP_GUIDE.md) | Configurar APIs |
| [GITHUB_INTEGRATION_COMPLETE.md](GITHUB_INTEGRATION_COMPLETE.md) | Resumen de integración |

---

## 🆘 Enlaces Útiles

### GitHub
- [Repositorio](https://github.com/TU-USUARIO/premium-ecosystem)
- [Actions](https://github.com/TU-USUARIO/premium-ecosystem/actions)
- [Issues](https://github.com/TU-USUARIO/premium-ecosystem/issues)
- [Pull Requests](https://github.com/TU-USUARIO/premium-ecosystem/pulls)
- [Security](https://github.com/TU-USUARIO/premium-ecosystem/security)

### Servicios
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Firebase Console](https://console.firebase.google.com/)
- [Sentry Dashboard](https://sentry.io/)
- [Codecov Dashboard](https://codecov.io/)

### Docs
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)

---

**Bookmark esta página para acceso rápido** ⭐
