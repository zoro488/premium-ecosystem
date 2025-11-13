# 🚀 Guía de Configuración para Vercel

## Variables de Entorno Requeridas

Para que la aplicación funcione correctamente en Vercel, debes configurar las siguientes variables de entorno en:

**Vercel Dashboard → Tu Proyecto → Settings → Environment Variables**

### 🔥 Firebase (OBLIGATORIAS)

```env
VITE_FIREBASE_API_KEY=tu-api-key-aqui
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### 📊 Firebase Analytics (OPCIONAL pero recomendado)

```env
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 🐛 Sentry (OPCIONAL - Para monitoreo de errores)

```env
VITE_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

## 📝 Cómo Obtener las Credenciales de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Project Settings** (⚙️ en la barra lateral)
4. Desplázate hasta "Your apps" / "Tus aplicaciones"
5. Selecciona tu app web o crea una nueva
6. Copia las credenciales del objeto `firebaseConfig`

## ⚙️ Configuración en Vercel

### Método 1: Desde el Dashboard

1. Accede a tu proyecto en Vercel
2. Ve a **Settings** → **Environment Variables**
3. Añade cada variable con su valor
4. Selecciona los entornos donde aplicará:
   - ✅ **Production** (obligatorio)
   - ✅ **Preview** (recomendado)
   - ⬜ **Development** (opcional)
5. Haz clic en **Save**
6. **Redeploy** tu aplicación para aplicar los cambios

### Método 2: Desde Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Configurar variables (ejecutar por cada variable)
vercel env add VITE_FIREBASE_API_KEY production
vercel env add VITE_FIREBASE_AUTH_DOMAIN production
vercel env add VITE_FIREBASE_PROJECT_ID production
vercel env add VITE_FIREBASE_STORAGE_BUCKET production
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID production
vercel env add VITE_FIREBASE_APP_ID production
vercel env add VITE_FIREBASE_MEASUREMENT_ID production

# Redeploy
vercel --prod
```

## 🔍 Verificar Configuración

Después de configurar las variables y hacer redeploy:

1. Abre la consola del navegador en tu sitio de producción
2. Busca mensajes de Firebase:
   - ✅ `✅ Firebase Analytics inicializado` - Todo OK
   - ⚠️ `⚠️ Firebase configurado en modo dummy` - Variables faltantes
   - ❌ `❌ Firebase no inicializado` - Error de configuración

## ⚡ Solución de Problemas

### Error: "Firebase Installations: INVALID_ARGUMENT"

**Causa**: Variables de entorno no configuradas o incorrectas

**Solución**:
1. Verifica que TODAS las variables obligatorias estén configuradas
2. Verifica que los valores no tengan espacios al inicio/final
3. Verifica que `VITE_FIREBASE_API_KEY` sea la correcta de Firebase
4. Redeploy después de cambiar variables

### Error: "Cookie _ga rejected by invalid domain"

**Causa**: Google Analytics no reconoce el dominio de Vercel

**Solución**:
1. En Firebase Console → Analytics → Data Streams
2. Selecciona tu web stream
3. Ve a "Configure tag settings"
4. Añade el dominio de Vercel a "Domains"
5. Formato: `tu-app.vercel.app` (sin https://)

### Error: "Cyclic object value" o "too much recursion"

**Causa**: React DevTools causando errores de serialización

**Solución**: Ya está resuelto en el código. Asegúrate de:
1. Hacer `npm run build` para regenerar el build
2. Vercel debería usar el build de producción automáticamente

## 📦 Comandos Útiles

```bash
# Build local (para probar antes de deploy)
npm run build

# Preview del build localmente
npm run preview

# Deploy a preview
vercel

# Deploy a production
vercel --prod

# Ver logs de producción
vercel logs tu-proyecto --prod

# Listar variables de entorno
vercel env ls
```

## 🔒 Seguridad

⚠️ **IMPORTANTE**:

- Las variables `VITE_*` son públicas y se incluyen en el bundle del cliente
- NO pongas secrets sensibles (API keys de servidor, passwords, etc.)
- Firebase API Key es segura porque está protegida por Security Rules
- Para secrets del servidor, usa variables sin el prefijo `VITE_`

## ✅ Checklist de Deployment

Antes de hacer deploy a producción:

- [ ] Todas las variables VITE_FIREBASE_* configuradas en Vercel
- [ ] Firebase Security Rules configuradas
- [ ] Firebase Analytics (opcional) configurado
- [ ] Dominio verificado en Firebase Console
- [ ] Build local exitoso (`npm run build`)
- [ ] Tests pasando (`npm test`)
- [ ] Linter sin errores (`npm run lint`)
- [ ] Variables de entorno verificadas en Vercel Dashboard

## 📚 Recursos

- [Documentación de Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**¿Problemas?** Revisa los logs de Vercel:
```bash
vercel logs --follow
```
