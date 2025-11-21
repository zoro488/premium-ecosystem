# 🚀 Guía de Configuración CI/CD - Premium Ecosystem

## 📋 Índice
1. [Requisitos Previos](#requisitos-previos)
2. [Configuración de GitHub Secrets](#configuración-de-github-secrets)
3. [Configuración de Firebase](#configuración-de-firebase)
4. [Workflows Disponibles](#workflows-disponibles)
5. [Proceso de Deployment](#proceso-de-deployment)
6. [Troubleshooting](#troubleshooting)

---

## 1. Requisitos Previos

### ✅ Checklist
- [ ] Cuenta de GitHub con permisos de admin en el repositorio
- [ ] Proyecto de Firebase configurado (chronos-176d8)
- [ ] Firebase CLI instalado localmente
- [ ] Node.js 20+ instalado
- [ ] Acceso a Firebase Console

---

## 2. Configuración de GitHub Secrets

### 🔐 Secrets Requeridos

Navega a: `https://github.com/[tu-usuario]/[repo]/settings/secrets/actions`

#### **A. Secrets de Firebase (CRÍTICOS)**

```bash
# 1. Obtener Firebase Token
firebase login:ci
# Copia el token generado
```

**Secrets a crear**:

| Secret Name                         | Descripción                | Cómo Obtener                                  |
| ----------------------------------- | -------------------------- | --------------------------------------------- |
| `FIREBASE_TOKEN`                    | Token de autenticación CLI | `firebase login:ci`                           |
| `FIREBASE_PROJECT_ID`               | ID del proyecto            | Firebase Console → Project Settings           |
| `VITE_FIREBASE_API_KEY`             | API Key                    | Firebase Console → Project Settings → General |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Auth Domain                | `[project-id].firebaseapp.com`                |
| `VITE_FIREBASE_PROJECT_ID`          | Project ID (duplicado)     | Mismo que FIREBASE_PROJECT_ID                 |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Storage Bucket             | `[project-id].appspot.com`                    |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging Sender ID        | Firebase Console → Cloud Messaging            |
| `VITE_FIREBASE_APP_ID`              | App ID                     | Firebase Console → Project Settings → General |

#### **B. Obtener Valores desde Firebase Console**

1. **Acceder a Firebase Console**:
   ```
   https://console.firebase.google.com/project/chronos-176d8/settings/general
   ```

2. **En "Your apps" → "Web apps" → Click en tu app**:
   ```javascript
   // Verás algo como esto:
   const firebaseConfig = {
     apiKey: "AIzaSyB9gG3ITQ6MkY-kOahzSHRqqNaJMguDi5k",
     authDomain: "chronos-176d8.firebaseapp.com",
     projectId: "chronos-176d8",
     storageBucket: "chronos-176d8.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef123456"
   };
   ```

3. **Copiar cada valor a su secret correspondiente**:
   - `apiKey` → `VITE_FIREBASE_API_KEY`
   - `authDomain` → `VITE_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `VITE_FIREBASE_PROJECT_ID` y `FIREBASE_PROJECT_ID`
   - `storageBucket` → `VITE_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` → `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `VITE_FIREBASE_APP_ID`

#### **C. Crear Secrets en GitHub (Paso a Paso)**

```bash
# Opción 1: Usando GitHub CLI (gh)
gh secret set FIREBASE_TOKEN
# Pega el token cuando se solicite

gh secret set FIREBASE_PROJECT_ID --body "chronos-176d8"
gh secret set VITE_FIREBASE_API_KEY --body "AIzaSyB9gG3ITQ6MkY-kOahzSHRqqNaJMguDi5k"
gh secret set VITE_FIREBASE_AUTH_DOMAIN --body "chronos-176d8.firebaseapp.com"
gh secret set VITE_FIREBASE_PROJECT_ID --body "chronos-176d8"
gh secret set VITE_FIREBASE_STORAGE_BUCKET --body "chronos-176d8.appspot.com"
gh secret set VITE_FIREBASE_MESSAGING_SENDER_ID --body "TU_SENDER_ID"
gh secret set VITE_FIREBASE_APP_ID --body "TU_APP_ID"
```

**Opción 2: Manualmente en GitHub UI**:
1. Ve a: `Settings → Secrets and variables → Actions`
2. Click `New repository secret`
3. Ingresa `Name` y `Secret`
4. Click `Add secret`
5. Repite para cada secret

---

## 3. Configuración de Firebase

### 🔥 Configurar Firebase Hosting

#### **A. Verificar firebase.json**

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

#### **B. Inicializar Firestore Security Rules**

**Archivo**: `firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Bancos
    match /bancos/{bancoId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                      request.auth.token.email.matches('.*@chronos\\.com$');
    }

    // Clientes
    match /clientes/{clienteId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null;
      allow delete: if request.auth != null &&
                       request.auth.token.email.matches('.*@chronos\\.com$');
    }

    // Ventas
    match /ventas/{ventaId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null;
      allow delete: if false; // No permitir eliminación
    }

    // Inventario
    match /inventario/{productoId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Reportes (solo lectura)
    match /reportes/{reporteId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

#### **C. Deploy Rules**

```bash
# Desde local (primera vez)
firebase deploy --only firestore:rules

# Verificar deployment
firebase projects:list
```

---

## 4. Workflows Disponibles

### 📦 Workflows Principales

#### **A. chronos-ci-cd.yml** (Principal)
**Trigger**: Push a `main` o `develop`, PRs, manual

**Jobs**:
1. 🔍 **Prepare**: Análisis de cambios y determinación de environment
2. 🧪 **Test**: Unit tests + E2E tests
3. 🏗️ **Build**: Compilación optimizada con Vite
4. 🚀 **Deploy**: Deployment a Firebase Hosting
5. ✅ **Verify**: Health check post-deployment

**Ejecutar manualmente**:
```bash
gh workflow run chronos-ci-cd.yml \
  -f environment=production \
  -f run_migration=false \
  -f ai_optimization=true
```

#### **B. e2e-tests.yml**
**Trigger**: Push, PRs, schedule (diario 2 AM)

**Features**:
- Tests en múltiples navegadores (Chrome, Firefox, Safari)
- Screenshots en fallos
- Video recording
- Playwright report

**Ejecutar**:
```bash
gh workflow run e2e-tests.yml
```

#### **C. auto-deploy.yml**
**Trigger**: Push a `main` únicamente

**Proceso**:
1. Build production
2. Deploy a Firebase
3. Notificación de Slack (si configurado)

---

## 5. Proceso de Deployment

### 🚀 Deployment Manual (Recomendado para producción)

#### **Opción 1: Desde GitHub Actions UI**

1. Ve a: `Actions` tab en GitHub
2. Selecciona workflow: `🚀 Chronos System - Automated CI/CD`
3. Click `Run workflow`
4. Selecciona:
   - **Branch**: `main`
   - **Environment**: `production`
   - **Run migration**: `false` (por defecto)
   - **AI optimization**: `true`
5. Click `Run workflow`

#### **Opción 2: Usando GitHub CLI**

```bash
# Deployment a desarrollo
gh workflow run chronos-ci-cd.yml \
  --ref develop \
  -f environment=development

# Deployment a staging
gh workflow run chronos-ci-cd.yml \
  --ref develop \
  -f environment=staging

# Deployment a producción
gh workflow run chronos-ci-cd.yml \
  --ref main \
  -f environment=production \
  -f run_migration=false
```

#### **Opción 3: Deployment Local**

```bash
# Build
npm run build

# Preview local
npm run preview

# Deploy a Firebase
firebase deploy --only hosting

# Deploy con token (CI/CD)
firebase deploy --only hosting --token $FIREBASE_TOKEN
```

### 🔄 Deployment Automático

**Push a main** → Deployment automático a **production**
```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
# ✅ Se desplegará automáticamente
```

**Push a develop** → Deployment automático a **staging**
```bash
git checkout develop
git add .
git commit -m "test: nueva feature"
git push origin develop
# ✅ Se desplegará a staging automáticamente
```

---

## 6. Troubleshooting

### ❌ Problemas Comunes

#### **A. Error: "FIREBASE_TOKEN not found"**

**Causa**: Secret no configurado correctamente

**Solución**:
```bash
# 1. Generar nuevo token
firebase login:ci

# 2. Actualizar secret en GitHub
gh secret set FIREBASE_TOKEN
# Pegar token cuando se solicite

# 3. Verificar
gh secret list
```

---

#### **B. Error: "Permission denied (Firestore)"**

**Causa**: Security rules demasiado restrictivas

**Solución temporal (SOLO DESARROLLO)**:
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ SOLO DESARROLLO
    }
  }
}
```

**Solución producción**:
```bash
# Deploy rules corregidas
firebase deploy --only firestore:rules
```

---

#### **C. Error: "Build failed - Module not found"**

**Causa**: Dependencias no instaladas correctamente

**Solución**:
```bash
# Limpiar cache
npm run clean:all

# Reinstalar dependencias
npm install --legacy-peer-deps

# Rebuild
npm run build
```

---

#### **D. Error: "E2E tests timeout"**

**Causa**: Tests demasiado lentos o server no arrancó

**Solución**:
```javascript
// playwright.config.js
export default defineConfig({
  timeout: 60000, // Aumentar a 60s
  use: {
    navigationTimeout: 30000,
    actionTimeout: 15000
  }
})
```

---

#### **E. Error: "Firebase hosting not found"**

**Causa**: Proyecto Firebase no inicializado

**Solución**:
```bash
# Inicializar Firebase
firebase init hosting

# Seleccionar:
# - Use existing project: chronos-176d8
# - Public directory: dist
# - Configure SPA: Yes
# - GitHub Actions: No (ya configurado)

# Deploy
firebase deploy --only hosting
```

---

### 🔍 Debugging Workflows

#### **Ver logs de workflow**

```bash
# Listar runs
gh run list --workflow=chronos-ci-cd.yml

# Ver logs de último run
gh run view --log

# Ver logs de run específico
gh run view [RUN_ID] --log

# Descargar logs
gh run download [RUN_ID]
```

#### **Verificar secrets**

```bash
# Listar secrets (sin valores)
gh secret list

# Verificar si secret existe
gh secret list | grep FIREBASE_TOKEN
```

#### **Test workflow localmente (act)**

```bash
# Instalar act
choco install act

# Ejecutar workflow localmente
act -j test

# Con secrets
act -j test --secret-file .secrets
```

---

## 7. Checklist de Configuración Completa

### ✅ Verificación Final

```bash
# 1. Verificar secrets
gh secret list
# Debe mostrar: FIREBASE_TOKEN, FIREBASE_PROJECT_ID, VITE_FIREBASE_*

# 2. Verificar Firebase config
firebase projects:list
# Debe mostrar: chronos-176d8

# 3. Verificar workflows
gh workflow list
# Debe mostrar: chronos-ci-cd.yml (activo)

# 4. Test build local
npm run build
# Debe generar dist/ sin errores

# 5. Test deployment
firebase hosting:channel:deploy preview
# Debe crear preview URL

# 6. Ejecutar workflow manualmente
gh workflow run chronos-ci-cd.yml -f environment=development

# 7. Verificar ejecución
gh run watch
```

### ✅ Checklist Visual

- [ ] Secrets de GitHub configurados (8 secrets)
- [ ] Firebase token generado y guardado
- [ ] firebase.json verificado
- [ ] firestore.rules configuradas
- [ ] Build local exitoso
- [ ] Workflow manual ejecutado exitosamente
- [ ] URL de producción accesible
- [ ] E2E tests pasando en CI/CD

---

## 8. URLs Importantes

### 📍 Recursos

| Recurso          | URL                                                                       |
| ---------------- | ------------------------------------------------------------------------- |
| GitHub Actions   | `https://github.com/[usuario]/[repo]/actions`                             |
| Firebase Console | `https://console.firebase.google.com/project/chronos-176d8`               |
| Firebase Hosting | `https://chronos-176d8.web.app`                                           |
| GitHub Secrets   | `https://github.com/[usuario]/[repo]/settings/secrets/actions`            |
| Workflow Logs    | `https://github.com/[usuario]/[repo]/actions/workflows/chronos-ci-cd.yml` |

---

## 9. Mantenimiento

### 🔄 Actualizaciones Regulares

```bash
# 1. Actualizar dependencias (mensual)
npm update
npm audit fix

# 2. Verificar workflows (mensual)
gh workflow list

# 3. Rotar Firebase token (cada 3 meses)
firebase login:ci
gh secret set FIREBASE_TOKEN

# 4. Backup de Firestore (semanal - automático vía workflow)
# Ver: .github/workflows/automated-backup.yml
```

---

## 10. Soporte

### 🆘 Recursos Adicionales

- **Firebase Docs**: https://firebase.google.com/docs
- **GitHub Actions Docs**: https://docs.github.com/actions
- **Playwright Docs**: https://playwright.dev
- **Vite Docs**: https://vitejs.dev

### 📧 Contacto

Para problemas con CI/CD:
1. Revisar logs: `gh run view --log`
2. Verificar secrets: `gh secret list`
3. Consultar esta guía
4. Crear issue en GitHub con label `ci-cd`

---

**✅ Sistema CI/CD Completamente Configurado**

Una vez completada esta guía, tu sistema estará listo para:
- ✅ Deployments automáticos
- ✅ Testing continuo
- ✅ Integración con Firebase
- ✅ Monitoreo de calidad

---

**Última actualización**: 21 de noviembre de 2025
**Versión**: 1.0.0
**Proyecto**: Premium Ecosystem - Chronos System
