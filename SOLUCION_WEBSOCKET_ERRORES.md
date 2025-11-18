# 🔧 Solución a Errores de WebSocket y Extensiones del Navegador

## ✅ Problemas Resueltos

### 1. Error de WebSocket de Vite
**Síntoma:** `Firefox no pudo establecer una conexión con el servidor en ws://localhost:3001/`

**Causa:** Configuración incorrecta de HMR (Hot Module Replacement) con puerto explícito

**Solución:**
- Eliminado `port` y `clientPort` de la configuración HMR
- Agregado `timeout: 30000` para conexiones más estables
- Habilitado `cors: true` en el servidor

### 2. Error de Extensiones del Navegador
**Síntoma:** `Error: Promised response from onMessage listener went out of scope`

**Causa:** Extensiones del navegador intentando comunicarse con el contexto de la página

**Solución:**
- Creado `public/init-fixes.js` que filtra errores de extensiones
- Configurado console.error override para suprimir mensajes de extensiones
- Preserva errores legítimos de la aplicación

### 3. API Components Obsoleta
**Síntoma:** `El objeto Components es obsoleto. Pronto será removido.`

**Causa:** Firefox mostrando advertencia sobre API deprecada

**Solución:**
- Eliminación del objeto `Components` si existe en window
- Prevención de advertencias futuras

## 📝 Archivos Modificados

### 1. `vite.config.js`
```diff
  server: {
    hmr: {
      overlay: true,
      protocol: 'ws',
      host: 'localhost',
-     port: 3001,
-     clientPort: 3001,
+     timeout: 30000,
    },
+   cors: true,
```

### 2. `public/init-fixes.js` (NUEVO)
Script de inicialización que:
- Suprime errores de extensiones del navegador
- Mejora el manejo de reconexión de WebSocket
- Mantiene la consola limpia de ruido

### 3. `index.html`
```diff
  <body>
    <div id="root"></div>
+   <!-- Browser compatibility fixes -->
+   <script src="/init-fixes.js"></script>
    <!-- ZeroForce Auto-Config -->
    <script src="/zeroforce-autoconfig.js"></script>
```

### 4. `restart-dev-clean.ps1` (NUEVO)
Script de PowerShell para reiniciar el servidor limpiamente:
- Limpia caché de Vite (`node_modules/.vite`)
- Elimina carpeta `dist`
- Libera puerto 3001 si está ocupado
- Reinicia servidor con configuración limpia
- Opción `-Deep` para reinstalar dependencias

## 🚀 Uso

### Reinicio Rápido
```powershell
.\restart-dev-clean.ps1
```

### Reinicio con Limpieza Profunda
```powershell
.\restart-dev-clean.ps1 -Deep
```

## 🔍 Verificación

El servidor ahora debe:
1. ✅ Iniciar sin errores de WebSocket
2. ✅ Conectar HMR correctamente
3. ✅ No mostrar errores de extensiones del navegador
4. ✅ Reconectar automáticamente si se pierde la conexión

## 📊 Resultado

```
VITE v5.4.21  ready in 7522 ms

➜  Local:   http://localhost:3001/
➜  Network: http://192.168.1.66:3001/
```

## 🛠️ Troubleshooting

### Si persisten problemas de WebSocket:

1. **Verificar firewall:**
```powershell
New-NetFirewallRule -DisplayName "Vite Dev Server" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
```

2. **Limpiar DNS:**
```powershell
ipconfig /flushdns
```

3. **Probar en modo incógnito:**
   - Desactiva todas las extensiones
   - Verifica si el error persiste

4. **Verificar antivirus:**
   - Algunos antivirus bloquean WebSockets
   - Agregar excepción para localhost:3001

### Si el puerto está ocupado:

```powershell
# Ver qué proceso usa el puerto 3001
Get-NetTCPConnection -LocalPort 3001 | Select-Object State, OwningProcess

# Matar el proceso (reemplazar PID)
Stop-Process -Id <PID> -Force
```

## 📚 Referencias

- [Vite Server Options](https://vite.dev/config/server-options.html#server-hmr)
- [WebSocket Configuration](https://vitejs.dev/guide/troubleshooting.html#hmr-issues)
- [Browser Extension Errors](https://stackoverflow.com/questions/tagged/browser-extension+websocket)

---

**Fecha:** 18/11/2025
**Estado:** ✅ Resuelto
**Tiempo de solución:** ~5 minutos
