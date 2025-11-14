# 🔍 Pasos de Diagnóstico - Chronos System

## Problema Actual

La aplicación no se carga en el navegador después de:

- ✅ Servidor dev corriendo en localhost:3001
- ✅ Firebase Remote Config hecho opcional
- ✅ Hot reload funcionando
- ✅ Sin errores de compilación

## Pasos para Diagnosticar

### 1. Abrir DevTools del Navegador

**Opción A - En el Simple Browser de VS Code:**

1. Con el Simple Browser abierto, presiona `F12` o `Ctrl+Shift+I`
2. Ve a la pestaña "Console"

**Opción B - En Chrome/Edge normal:**

1. Abre <http://localhost:3001/> en Chrome o Edge
2. Presiona `F12` o click derecho → "Inspeccionar"
3. Ve a la pestaña "Console"

### 2. Buscar Errores en la Consola

Busca mensajes en **rojo** que indiquen:

- ❌ **Module errors** (errores de importación)
- ❌ **Firebase errors** (servicios no inicializados)
- ❌ **Network errors** (failed to fetch)
- ❌ **Component errors** (cannot read property of undefined)

### 3. Revisar la Pestaña "Network"

1. Ve a DevTools → Network
2. Recarga la página (`Ctrl+R`)
3. Busca archivos que fallen (en rojo) con código `404` o `500`
4. Especialmente revisa:
   - `main.jsx` (debe cargar exitosamente)
   - `App.jsx` (debe cargar exitosamente)
   - `firebase.js` (debe cargar exitosamente)

### 4. Revisar la Pestaña "Elements"

1. Ve a DevTools → Elements
2. Busca el `<div id="root"></div>`
3. Verifica si tiene contenido dentro o está vacío

---

## Errores Comunes y Soluciones

### Error: "Cannot find module '@opentelemetry/...'"

**Solución:**

```powershell
npm install @opentelemetry/api @opentelemetry/sdk-trace-web @opentelemetry/exporter-trace-otlp-http @opentelemetry/instrumentation-fetch @opentelemetry/instrumentation-xml-http-request @opentelemetry/resources @opentelemetry/semantic-conventions
```

### Error: "Firebase: xxxxxx not initialized"

**Solución:** Ya aplicado - Firebase Remote Config es opcional

### Error: "Failed to fetch dynamically imported module"

**Solución:** Limpiar caché y rebuild

```powershell
npm run clean
npm install
npm run dev
```

### Error: "Uncaught SyntaxError: Cannot use import statement outside a module"

**Solución:** Verificar que `<script type="module">` esté en index.html

---

## Próximos Pasos Según el Error

### Si ves error de módulos OpenTelemetry

```powershell
# Instalar dependencias faltantes
npm install @opentelemetry/api @opentelemetry/sdk-trace-web @opentelemetry/exporter-trace-otlp-http @opentelemetry/instrumentation-fetch @opentelemetry/instrumentation-xml-http-request @opentelemetry/resources @opentelemetry/semantic-conventions
```

### Si ves error de Firebase

```powershell
# Verificar instalación de Firebase
npm install firebase
```

### Si ves error de React Query

```powershell
# Verificar instalación de TanStack Query
npm install @tanstack/react-query
```

### Si ves error de Sentry

```powershell
# Verificar instalación de Sentry
npm install @sentry/react
```

### Si NO ves ningún error pero la página está en blanco

1. Revisa DevTools → Elements → `<div id="root">`
2. Si está vacío, hay un problema de renderizado silencioso
3. Revisa DevTools → Console → busca warnings (amarillo)

---

## Qué Información Necesito

Por favor, copia y pega:

1. **Cualquier error rojo** de la consola
2. **El contenido del `<div id="root">`** (click derecho → Copy outerHTML)
3. **Archivos que fallen** en la pestaña Network (nombre y código de error)

---

## Solución Rápida - Si nada funciona

```powershell
# 1. Detener el servidor (Ctrl+C en la terminal)
# 2. Limpiar todo
npm run clean:all
# 3. Reinstalar dependencias
npm install
# 4. Iniciar de nuevo
npm run dev
```

---

## Checklist de Verificación

- [ ] Servidor Vite corriendo en puerto 3001
- [ ] DevTools abierto (F12)
- [ ] Consola revisada (errores rojos)
- [ ] Network revisado (archivos fallando)
- [ ] Elements revisado (div#root tiene contenido)
- [ ] Información copiada para diagnóstico

---

**Nota:** Una vez tengas esta información, podré identificar exactamente qué está bloqueando la aplicación.
