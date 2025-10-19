# 🚀 Comandos para Google Cloud Shell

## Opción 1: Script Automatizado (RECOMENDADO)

### Paso 1: Abre Google Cloud Shell
```
https://shell.cloud.google.com/
```

### Paso 2: Copia y pega este comando completo
```bash
PROJECT_ID="premium-ecosystem-1760790572" && \
gcloud config set project $PROJECT_ID && \
gcloud services enable firestore.googleapis.com firebase.googleapis.com identitytoolkit.googleapis.com && \
gcloud firestore databases create --location=us-central1 --type=firestore-native --project=$PROJECT_ID && \
echo "✅ Firestore creado exitosamente!"
```

### Paso 3: Espera ~30 segundos
Verás mensajes como:
```
Updated property [core/project].
Operation "operations/..." finished successfully.
```

### Paso 4: Verifica
```bash
gcloud firestore databases list --project=premium-ecosystem-1760790572
```

Deberías ver:
```
NAME: (default)
LOCATION_ID: us-central1
TYPE: FIRESTORE_NATIVE
```

---

## Opción 2: Comandos Paso a Paso

Si prefieres ejecutar comando por comando:

### 1. Configurar proyecto
```bash
gcloud config set project premium-ecosystem-1760790572
```

### 2. Habilitar APIs
```bash
gcloud services enable firestore.googleapis.com
```
```bash
gcloud services enable firebase.googleapis.com
```
```bash
gcloud services enable identitytoolkit.googleapis.com
```

### 3. Crear Firestore Database
```bash
gcloud firestore databases create \
  --location=us-central1 \
  --type=firestore-native \
  --project=premium-ecosystem-1760790572
```

### 4. Verificar que se creó
```bash
gcloud firestore databases list --project=premium-ecosystem-1760790572
```

---

## Opción 3: Una Línea (MÁS RÁPIDO)

Copia y pega esto en Cloud Shell:

```bash
gcloud config set project premium-ecosystem-1760790572 && gcloud services enable firestore.googleapis.com firebase.googleapis.com identitytoolkit.googleapis.com && gcloud firestore databases create --location=us-central1 --type=firestore-native && echo "✅ Listo!"
```

---

## ⚠️ Después de Ejecutar

### Habilitar Proveedores de Authentication

Los comandos arriba activan el **servicio** de Authentication, pero necesitas habilitar los **proveedores** manualmente:

**Ve a:**
```
https://console.firebase.google.com/project/premium-ecosystem-1760790572/authentication
```

**Luego:**
1. Click en "Comenzar" (si aparece)
2. Click en "Email/Password" → Habilitar → Guardar
3. Click en "Google" → Habilitar → Guardar (opcional)

---

## 🧪 Verificar que Funciona

Después de ejecutar los comandos:

### Opción A: Archivo HTML
Abre `verify-firebase.html` y click en "🚀 Probar Todo"

### Opción B: Componente React
Abre `http://localhost:3003/firebase-setup` y click en "🚀 Probar Todo"

### Opción C: Cloud Shell
```bash
# Verificar Firestore
gcloud firestore databases list --project=premium-ecosystem-1760790572

# Verificar APIs habilitadas
gcloud services list --enabled --project=premium-ecosystem-1760790572 | grep firestore
```

---

## 📊 Qué Esperar

### Firestore Database
```
Creating Cloud Firestore database...done.
NAME: (default)
LOCATION_ID: us-central1
TYPE: FIRESTORE_NATIVE
CREATE_TIME: 2025-01-18T13:00:00.000000Z
```

### APIs Habilitadas
```
firestore.googleapis.com              Cloud Firestore API
firebase.googleapis.com               Firebase Management API
identitytoolkit.googleapis.com        Identity Toolkit API
```

---

## ❌ Si Hay Errores

### Error: "PERMISSION_DENIED"
```bash
# Verifica que estés autenticado
gcloud auth list

# Si no estás autenticado
gcloud auth login
```

### Error: "Project not found"
```bash
# Lista tus proyectos
gcloud projects list

# Verifica que premium-ecosystem-1760790572 esté en la lista
```

### Error: "API not enabled"
```bash
# Habilita todas las APIs de nuevo
gcloud services enable firestore.googleapis.com firebase.googleapis.com identitytoolkit.googleapis.com --project=premium-ecosystem-1760790572
```

---

## 🎯 Resumen Rápido

**Para activar Firestore AHORA:**

1. Abre: https://shell.cloud.google.com/
2. Copia y pega:
```bash
gcloud config set project premium-ecosystem-1760790572 && gcloud services enable firestore.googleapis.com && gcloud firestore databases create --location=us-central1 --type=firestore-native
```
3. Espera 30 segundos
4. Abre `verify-firebase.html` y prueba

**Total: 2 minutos** ⏱️

---

## 💡 Tip Pro

Puedes ejecutar TODO desde Cloud Shell sin instalar nada en tu PC:

```bash
# Clonar tu repo (si está en GitHub)
git clone https://github.com/tu-usuario/premium-ecosystem.git

# O subir archivos
# Click en "Upload file" en Cloud Shell

# Ejecutar pruebas
cd premium-ecosystem
npm install
npm run build
firebase deploy
```

---

¿Listo? **Abre Cloud Shell y ejecuta el comando!** 🚀
