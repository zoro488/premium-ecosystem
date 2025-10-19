# Guía de Deploy a Firebase

## ✅ Archivos de Configuración Creados

He creado todos los archivos necesarios para Firebase:

- ✅ `.firebaserc` - Proyecto Firebase configurado
- ✅ `firebase.json` - Configuración de Firestore y Hosting
- ✅ `firestore.rules` - Reglas de seguridad de Firestore
- ✅ `firestore.indexes.json` - Índices de Firestore
- ✅ `.env` - Credenciales de Firebase

---

## 🔐 Paso 1: Autenticar Firebase CLI

**Necesitas ejecutar esto TÚ en tu terminal** (abrirá el navegador):

```bash
cd "c:\Users\xpovo\Documents\premium-ecosystem"
firebase login
```

Esto abrirá tu navegador para que inicies sesión con tu cuenta de Google.

**Alternativa si no funciona:**

Si el comando anterior falla, puedes usar:

```bash
firebase login --no-localhost
```

Esto te dará una URL que debes abrir en el navegador manualmente.

---

## 📦 Paso 2: Activar Servicios en Firebase Console

Antes de poder hacer deploy, necesitas activar estos servicios:

### A. Activar Firestore Database

1. Ve a: https://console.firebase.google.com/project/premium-ecosystem-1760790572/firestore
2. Click **"Crear base de datos"**
3. Selecciona **"Iniciar en modo de prueba"**
4. Ubicación: **`us-central1`**
5. Click **"Habilitar"**

⏱️ ~30 segundos

### B. Activar Authentication

1. Ve a: https://console.firebase.google.com/project/premium-ecosystem-1760790572/authentication
2. Click **"Comenzar"**
3. Habilita **"Email/Password"**
4. Habilita **"Google"** (agrega tu email como soporte)

⏱️ ~1 minuto

### C. Activar Firebase Hosting

1. Ve a: https://console.firebase.google.com/project/premium-ecosystem-1760790572/hosting
2. Click **"Comenzar"**
3. Sigue los pasos del wizard (solo aceptar)

⏱️ ~30 segundos

---

## 🏗️ Paso 3: Build de Producción

Construye la versión optimizada de tu app:

```bash
npm run build
```

Esto creará la carpeta `dist/` con todos los archivos optimizados.

---

## 🚀 Paso 4: Deploy a Firebase

### Opción A: Deploy Completo (Hosting + Firestore Rules)

```bash
firebase deploy
```

Esto desplegará:
- ✅ Tu app web a Firebase Hosting
- ✅ Las reglas de seguridad de Firestore
- ✅ Los índices de Firestore

### Opción B: Deploy Solo Hosting

```bash
firebase deploy --only hosting
```

### Opción C: Deploy Solo Firestore Rules

```bash
firebase deploy --only firestore:rules
```

---

## 🌐 Ver tu App en Vivo

Después del deploy, Firebase te dará una URL como:

```
https://premium-ecosystem-1760790572.web.app
```

o

```
https://premium-ecosystem-1760790572.firebaseapp.com
```

---

## 📝 Comandos Útiles de Firebase

### Ver proyectos disponibles
```bash
firebase projects:list
```

### Ver el proyecto actual
```bash
firebase use
```

### Cambiar de proyecto
```bash
firebase use premium-ecosystem-1760790572
```

### Ver información del hosting
```bash
firebase hosting:channel:list
```

### Hacer deploy a un canal de preview
```bash
firebase hosting:channel:deploy preview
```

### Ver logs en tiempo real
```bash
firebase functions:log
```

---

## 🔧 Solución de Problemas

### Error: "Not logged in"

Ejecuta:
```bash
firebase login --reauth
```

### Error: "Permission denied"

Verifica que hayas activado Firestore y Authentication en la consola.

### Error: "Build failed"

Verifica que no haya errores en tu código:
```bash
npm run build
```

### Error: "firestore.rules not found"

Los archivos ya están creados. Verifica que estás en el directorio correcto:
```bash
cd "c:\Users\xpovo\Documents\premium-ecosystem"
```

---

## 📊 Configuración Actual

### Firestore Rules (firestore.rules)

Actualmente en **modo de prueba** (cualquiera puede leer/escribir hasta Feb 18, 2025).

Para cambiar a modo seguro (solo usuarios autenticados):
1. Edita `firestore.rules`
2. Descomenta las reglas seguras
3. Ejecuta: `firebase deploy --only firestore:rules`

### Hosting Config (firebase.json)

- **Carpeta pública:** `dist/` (salida de `npm run build`)
- **SPA Rewrite:** Todas las rutas redirigen a `/index.html`
- **Archivos ignorados:** node_modules, archivos ocultos

---

## 🎯 Flujo de Trabajo Recomendado

### Para Desarrollo Local:
```bash
npm run dev
# App en http://localhost:3003
```

### Para Deploy a Producción:
```bash
# 1. Build
npm run build

# 2. Preview local del build
npx vite preview

# 3. Deploy a Firebase
firebase deploy

# 4. Ver en:
# https://premium-ecosystem-1760790572.web.app
```

### Para Deploy Rápido (Preview):
```bash
npm run build
firebase hosting:channel:deploy preview
```

---

## 📈 Próximos Pasos

Una vez que hagas `firebase deploy`:

1. ✅ Tu app estará en la nube (accesible desde cualquier lugar)
2. ✅ Firestore funcionará automáticamente
3. ✅ Authentication estará activa
4. ✅ SSL/HTTPS incluido (gratis)
5. ✅ CDN global de Google
6. ✅ Dominio personalizado disponible (opcional)

---

## 🔑 Resumen de Comandos Esenciales

```bash
# Autenticar (solo una vez)
firebase login

# Build de producción
npm run build

# Deploy completo
firebase deploy

# Ver tu app
# https://premium-ecosystem-1760790572.web.app
```

⏱️ **Total: ~5 minutos**

---

## ⚠️ Importante

**NO puedo ejecutar `firebase login` por ti** porque requiere autenticación interactiva con tu navegador.

**LO QUE SÍ hice:**
- ✅ Creé todos los archivos de configuración
- ✅ Configuré Firestore rules
- ✅ Configuré Hosting
- ✅ Configuré el proyecto

**LO QUE TÚ necesitas hacer:**
1. `firebase login` (abre el navegador)
2. Activar Firestore y Auth en la consola web
3. `npm run build`
4. `firebase deploy`

🚀 **¡Listo para producción!**
