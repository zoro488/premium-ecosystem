# 🚀 CÓMO ACCEDER A FLOWDISTRIBUTOR

## 📡 SERVIDOR YA ESTÁ CORRIENDO

El servidor de FlowDistributor está activo y listo para usar.

---

## 🌐 URLS DE ACCESO

### Desde Este Equipo:
```
http://localhost:3002
```

### Desde Otros Dispositivos en la Misma Red:
```
http://192.168.1.66:3002
http://172.26.192.1:3002
```

---

## ⚡ ACCESO RÁPIDO

### Opción 1: Doble Click
Ejecuta cualquiera de estos archivos:

📄 **ABRIR-FLOWDISTRIBUTOR.bat**
- Abre directamente en el navegador
- Más rápido

📄 **INICIAR-FLOWDISTRIBUTOR.bat** (si necesitas reiniciar)
- Inicia el servidor
- Mantén la ventana abierta

### Opción 2: Navegador
1. Abre tu navegador favorito
2. Escribe: `localhost:3002`
3. Enter

---

## 📱 ACCEDER DESDE CELULAR/TABLET

Si estás en la misma red WiFi:

1. Abre el navegador en tu celular/tablet
2. Escribe una de estas URLs:
   - `192.168.1.66:3002`
   - `172.26.192.1:3002`
3. Enter

**¡FlowDistributor funciona perfectamente en móviles!**

---

## 🔄 REINICIAR EL SERVIDOR

Si necesitas reiniciar:

### Opción 1: Reinicio Rápido
```bash
# Presiona Ctrl+C en la ventana del servidor
# Luego ejecuta:
INICIAR-FLOWDISTRIBUTOR.bat
```

### Opción 2: Desde Consola
```bash
cd c:\Users\xpovo\Documents\premium-ecosystem
npm run dev
```

---

## ⚠️ SI EL SERVIDOR NO RESPONDE

### Verificar si está corriendo:
```bash
# Abre CMD y ejecuta:
netstat -ano | findstr :3002
```

Si NO aparece nada, ejecuta:
```bash
INICIAR-FLOWDISTRIBUTOR.bat
```

### Verificar procesos Node:
```bash
tasklist | findstr node
```

Si hay procesos antiguos, elimínalos:
```bash
taskkill /F /IM node.exe
```

Luego reinicia:
```bash
INICIAR-FLOWDISTRIBUTOR.bat
```

---

## 🛠️ HERRAMIENTAS ÚTILES

### Limpiar Datos de Prueba:
```
http://localhost:3002/limpiar-datos.html
```

### Página Principal:
```
http://localhost:3002
```

---

## 💡 TIPS

### Mantener el Servidor Corriendo
- **NO cierres** la ventana donde está corriendo el servidor
- Si minimizas la ventana, el servidor sigue activo
- Para cerrar: `Ctrl+C` en la ventana del servidor

### Acceso Permanente
El servidor quedará corriendo mientras:
- La ventana CMD/PowerShell esté abierta
- No presiones Ctrl+C
- El equipo esté encendido

### Iniciar Automáticamente con Windows
Puedes agregar `INICIAR-FLOWDISTRIBUTOR.bat` a la carpeta de inicio de Windows:

1. Presiona `Win+R`
2. Escribe: `shell:startup`
3. Enter
4. Copia el acceso directo de `INICIAR-FLOWDISTRIBUTOR.bat` ahí

**Nota:** El servidor se iniciará cada vez que enciendas el PC.

---

## 🎯 VERIFICACIÓN RÁPIDA

Para verificar que todo funciona:

1. ✅ Abre: `http://localhost:3002`
2. ✅ Deberías ver el dashboard de FlowDistributor
3. ✅ Click en "Dashboard" (sidebar izquierdo)
4. ✅ Si ves los KPIs y el sistema, ¡todo está bien!

---

## 📊 ESTADO DEL SERVIDOR

**Puerto:** 3002 (si 3001 está ocupado, usa 3002 automáticamente)
**Estado:** ✅ ACTIVO
**Hot Module Replacement:** ✅ Activado
**Optimización:** ✅ Configurada

---

## 🚨 PROBLEMAS COMUNES

### "No se puede conectar"
- Verifica que el servidor esté corriendo
- Ejecuta: `INICIAR-FLOWDISTRIBUTOR.bat`

### "Puerto en uso"
- El servidor automáticamente usa otro puerto
- Verifica la URL que muestra en la consola

### "Página en blanco"
- Presiona `Ctrl+Shift+R` (recarga dura)
- Abre consola del navegador (F12) y verifica errores

### "No guarda los datos"
- Verifica que localStorage esté habilitado
- No uses modo incógnito
- Revisa: http://localhost:3002/limpiar-datos.html

---

## 📞 ACCESOS DIRECTOS DE WINDOWS

### Crear Icono en el Escritorio:

1. Click derecho en `ABRIR-FLOWDISTRIBUTOR.bat`
2. "Crear acceso directo"
3. Arrastra el acceso directo al escritorio
4. Renombra a: "FlowDistributor"

**¡Ahora solo doble click y listo!**

---

## 🎨 PERSONALIZACIÓN

Si quieres cambiar el puerto (ejemplo a 5000):

1. Abre: `vite.config.js`
2. Cambia línea 25: `port: 5000`
3. Reinicia el servidor

---

## ✅ CHECKLIST DE ACCESO

- [ ] Servidor corriendo (ventana CMD abierta)
- [ ] Navegador abierto
- [ ] URL: `localhost:3002`
- [ ] Dashboard visible
- [ ] Sidebar funcionando
- [ ] Datos persistentes

**¡Si todo está ✅, estás listo para trabajar!**

---

**Servidor activo en:** http://localhost:3002
**Última actualización:** 2025-10-20

🚀 **¡FlowDistributor listo para usar!**
