# 🚀 Guía Completa de Configuración de GitHub

Esta guía te llevará paso a paso para configurar tu proyecto en GitHub y aprovechar todo su potencial.

## 📋 Índice

1. [Crear Repositorio](#1-crear-repositorio-en-github)
2. [Configurar Secrets](#2-configurar-github-secrets)
3. [Branch Protection](#3-configurar-branch-protection)
4. [Habilitar Features](#4-habilitar-features-de-github)
5. [Integrar Vercel](#5-integrar-con-vercel)
6. [Integrar Firebase](#6-integrar-con-firebase)
7. [Configurar Sentry](#7-configurar-sentry)
8. [GitHub Apps](#8-instalar-github-apps)

---

## 1. Crear Repositorio en GitHub

### Paso 1.1: Crear Repo en GitHub.com

1. Ve a https://github.com/new
2. Configura:
   - **Repository name**: `premium-ecosystem`
   - **Description**: "Ecosistema Premium con 5 aplicaciones empresariales"
   - **Visibility**: `Private` (recomendado) o `Public`
   - **NO inicialices** con README, .gitignore, o licencia (ya los tienes)

3. Clic en "Create repository"

### Paso 1.2: Conectar Local con GitHub

```bash
# En tu directorio del proyecto
cd c:\Users\xpovo\Documents\premium-ecosystem

# Ya deberías tener git init hecho, si no:
git init

# Agregar remote
git remote add origin https://github.com/TU-USUARIO/premium-ecosystem.git

# Verificar
git remote -v

# Stage todos los archivos
git add .

# Primer commit
git commit -m "feat: initial commit - Premium Ecosystem v3.0 with 5 apps"

# Push
git branch -M main
git push -u origin main
```

---

## 2. Configurar GitHub Secrets

Los secrets son variables de entorno encriptadas que se usan en GitHub Actions.

### Paso 2.1: Ir a Settings > Secrets

1. En tu repo, ve a **Settings** → **Secrets and variables** → **Actions**
2. Clic en **New repository secret**

### Paso 2.2: Agregar Secrets Necesarios

Agrega los siguientes secrets uno por uno:

#### Para Vercel

```
VERCEL_TOKEN
Valor: (obtén desde https://vercel.com/account/tokens)

VERCEL_ORG_ID
Valor: (en Vercel Settings → General → Organization ID)

VERCEL_PROJECT_ID
Valor: (en tu proyecto Vercel → Settings → General → Project ID)
```

#### Para Firebase

```
FIREBASE_SERVICE_ACCOUNT
Valor: {
  "type": "service_account",
  "project_id": "tu-project-id",
  "private_key_id": "...",
  "private_key": "...",
  ... resto del JSON
}
(Obtén desde Firebase Console → Project Settings → Service Accounts → Generate new private key)

FIREBASE_PROJECT_ID
Valor: premium-ecosystem-1760790572
```

#### Para Sentry

```
SENTRY_AUTH_TOKEN
Valor: (obtén desde Sentry.io → Settings → Auth Tokens)

SENTRY_ORG
Valor: tu-organizacion

SENTRY_PROJECT
Valor: premium-ecosystem
```

#### Para Codecov (opcional)

```
CODECOV_TOKEN
Valor: (obtén desde Codecov.io después de agregar el repo)
```

### Paso 2.3: Variables de Entorno (Environment Variables)

Para variables no sensibles:

1. **Settings** → **Secrets and variables** → **Actions** → tab **Variables**
2. Agregar variables como:

```
NODE_VERSION=18
```

---

## 3. Configurar Branch Protection

Protege la rama `main` de pushes directos.

### Paso 3.1: Ir a Branch Protection Rules

1. **Settings** → **Branches**
2. Clic en **Add branch protection rule**

### Paso 3.2: Configurar Reglas

```
Branch name pattern: main

✅ Require a pull request before merging
   ✅ Require approvals: 1
   ✅ Dismiss stale pull request approvals when new commits are pushed

✅ Require status checks to pass before merging
   ✅ Require branches to be up to date before merging
   Status checks que deben pasar:
   - test (del workflow ci.yml)
   - lint (del workflow ci.yml)
   - build (del workflow ci.yml)

✅ Require conversation resolution before merging

✅ Require signed commits (opcional pero recomendado)

✅ Require linear history

✅ Include administrators (para que las reglas te apliquen a ti también)

❌ Allow force pushes (NUNCA)

❌ Allow deletions
```

3. Clic en **Create**

---

## 4. Habilitar Features de GitHub

### Paso 4.1: Discussions

1. **Settings** → **Features**
2. ✅ **Discussions** → Actívalo
3. Crea categorías:
   - 💡 Ideas
   - 🙏 Q&A
   - 📣 Announcements
   - 💬 General

### Paso 4.2: Projects

1. Ve a la tab **Projects**
2. **New project** → **Board**
3. Nombra: "Premium Ecosystem Roadmap"
4. Agrega columnas:
   - 📋 Backlog
   - 🎯 To Do
   - 🏗️ In Progress
   - 👀 In Review
   - ✅ Done

### Paso 4.3: GitHub Pages (para docs)

1. **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / `/docs` o `/`
4. Save

Opcional: Puedes usar esto para:
- Documentación con Docusaurus
- Storybook de componentes
- Landing page

### Paso 4.4: Security Features

1. **Settings** → **Code security and analysis**
2. Habilitar:
   - ✅ **Dependency graph**
   - ✅ **Dependabot alerts**
   - ✅ **Dependabot security updates**
   - ✅ **Grouped security updates**
   - ✅ **Secret scanning** (si tienes GitHub Advanced Security)
   - ✅ **Push protection** (si tienes GitHub Advanced Security)
   - ✅ **Code scanning** → Set up → CodeQL Analysis

---

## 5. Integrar con Vercel

### Opción A: Desde Vercel Dashboard

1. Ve a https://vercel.com/new
2. **Import Git Repository**
3. Conecta con GitHub y selecciona tu repo
4. Configuración:
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
5. **Environment Variables**:
   - Agrega las que necesites (Firebase config, etc.)
6. **Deploy**

### Opción B: Desde GitHub Marketplace

1. Ve a https://github.com/marketplace/vercel
2. **Set up a plan** (free)
3. Conecta con Vercel
4. Selecciona tu repositorio

### Verificar Integración

- Cada push a `main` → Deploy a producción
- Cada PR → Deploy preview automático
- URL en comentarios del PR

---

## 6. Integrar con Firebase

### Paso 6.1: Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### Paso 6.2: Login y Setup

```bash
# Login
firebase login

# Inicializar (si no lo has hecho)
firebase init hosting

# Seleccionar proyecto existente
# Public directory: dist
# Single-page app: Yes
# GitHub integration: Yes
```

### Paso 6.3: Conectar con GitHub Actions

Firebase CLI te preguntará:
- ✅ Set up automatic builds and deploys with GitHub?
- ✅ Set up workflow to run on every PR?

Esto creará workflows automáticamente.

### Paso 6.4: Service Account para GitHub Actions

1. Firebase Console → Project Settings → Service Accounts
2. **Generate new private key**
3. Copia el contenido del JSON
4. GitHub → Settings → Secrets → New secret
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: pega el JSON completo

---

## 7. Configurar Sentry

### Paso 7.1: Crear Proyecto en Sentry

1. Ve a https://sentry.io
2. **Create Project**
3. Platform: **React**
4. Nombre: `premium-ecosystem`

### Paso 7.2: Obtener DSN

```javascript
// Ya está en src/main.jsx
Sentry.init({
  dsn: "https://...@sentry.io/...",
  // ...
});
```

### Paso 7.3: Source Maps

1. Sentry → Settings → Auth Tokens → Create New Token
2. Scopes: `project:read`, `project:releases`, `org:read`
3. Copia el token
4. GitHub Secrets → `SENTRY_AUTH_TOKEN`

El workflow `deploy.yml` ya está configurado para crear releases en Sentry.

---

## 8. Instalar GitHub Apps

### Apps Recomendadas

#### 8.1. Codecov

1. https://github.com/marketplace/codecov
2. **Set up a plan** → Free for open source
3. Install & Authorize
4. Selecciona tu repo
5. Obtén el token: Codecov.io → Settings → Copy token
6. GitHub Secrets → `CODECOV_TOKEN`

#### 8.2. Snyk

1. https://github.com/marketplace/snyk
2. Install & Authorize
3. Snyk escaneará vulnerabilidades automáticamente

#### 8.3. Renovate Bot (alternativa a Dependabot)

1. https://github.com/marketplace/renovate
2. Install
3. Auto-actualiza dependencias con PRs inteligentes

#### 8.4. Imgbot

1. https://github.com/marketplace/imgbot
2. Optimiza imágenes automáticamente

#### 8.5. GitGuardian

1. https://github.com/marketplace/gitguardian
2. Detecta secrets en el código

---

## 9. Habilitar GitHub Copilot (Opcional)

### Para Individuos

1. https://github.com/settings/copilot
2. Enable GitHub Copilot
3. $10/mes (o gratis para estudiantes/OSS maintainers)

### Para Organizaciones

1. Organization Settings → Copilot
2. Enable for organization
3. Asignar seats

---

## 10. Configurar Notificaciones

### Slack/Discord Integration

#### Slack

1. https://github.com/integrations/slack
2. Install en tu workspace
3. `/github subscribe owner/repo`
4. Configura eventos:
   ```
   /github subscribe owner/repo issues pulls commits releases deployments
   ```

#### Discord

1. Server Settings → Integrations → Webhooks
2. New Webhook → Copy URL
3. GitHub repo → Settings → Webhooks → Add webhook
4. Payload URL: `https://discord.com/api/webhooks/...`
5. Content type: `application/json`
6. Events: selecciona los que quieras

---

## 11. Labels y Milestones

### Crear Labels

```
Type Labels:
🐛 bug (red)
✨ enhancement (blue)
📝 documentation (green)
🎨 ui/ux (purple)
⚡ performance (yellow)

Priority Labels:
🔴 priority: critical
🟠 priority: high
🟡 priority: medium
🟢 priority: low

Status Labels:
🚧 in-progress
👀 needs-review
🔄 needs-changes
✅ ready-to-merge

App Labels:
💼 app: flow
💰 app: shadow
🛰️ app: apollo
🧠 app: synapse
🔗 app: nexus
```

### Crear Milestones

```
v3.1.0 - Q1 2025
v3.2.0 - Q2 2025
v4.0.0 - Q3 2025
```

---

## 12. README Badges

Ya están en el README actualizado, pero puedes agregar más:

```markdown
![Build](https://github.com/USER/premium-ecosystem/workflows/CI/badge.svg)
![Deploy](https://github.com/USER/premium-ecosystem/workflows/Deploy/badge.svg)
![Coverage](https://codecov.io/gh/USER/premium-ecosystem/branch/main/graph/badge.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
```

---

## ✅ Checklist Final

- [ ] Repositorio creado en GitHub
- [ ] Código pusheado a `main`
- [ ] Secrets configurados
- [ ] Branch protection activado
- [ ] Discussions habilitado
- [ ] GitHub Projects creado
- [ ] Vercel integrado
- [ ] Firebase integrado
- [ ] Sentry configurado
- [ ] Codecov instalado
- [ ] CodeQL activado
- [ ] Dependabot configurado
- [ ] Labels creados
- [ ] README actualizado con badges
- [ ] CODEOWNERS configurado
- [ ] Primer deploy exitoso 🎉

---

## 🆘 Troubleshooting

### Workflow fails con "secrets not found"

→ Verifica que los secrets estén configurados correctamente (nombres exactos)

### Branch protection impide merge

→ Asegúrate de que los checks pasen o temporalmente desactiva la regla

### Vercel deploy falla

→ Verifica las environment variables en Vercel dashboard

### Firebase deploy falla

→ Verifica el service account y permisos en Firebase Console

---

## 📚 Recursos

- [GitHub Docs](https://docs.github.com)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel Docs](https://vercel.com/docs)
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Sentry Docs](https://docs.sentry.io)

---

**¡Listo! Tu repositorio está configurado profesionalmente** 🚀
