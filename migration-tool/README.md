# 🚀 Herramienta de Migración de Datos a Firestore

Este paquete contiene todo lo necesario para migrar tus datos de `BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json` a tu base de datos de Firestore, con la estructura exacta que tu aplicación **chronos-system** espera.

> 📚 **[Ver Índice de Documentación →](./INDICE.md)** | **[Resumen Ejecutivo →](./RESUMEN_EJECUTIVO.md)**

---

## 📁 Archivos en esta Carpeta

Para que esto funcione, tu carpeta debe tener **5 archivos**:

1. ✅ `importar.js` (Ya incluido en este paquete)
2. ✅ `package.json` (Ya incluido en este paquete)
3. ✅ `.gitignore` (Ya incluido en este paquete)
4. ❗ `BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json` (Debes agregarlo tú)
5. ❗ `serviceAccountKey.json` (Debes agregarlo tú)

---

## ⚙️ Pasos para la Migración Perfecta

### PASO 1: Obtén tu Clave de Servicio (`serviceAccountKey.json`)

1. Ve a tu proyecto de Firebase: [https://console.firebase.google.com](https://console.firebase.google.com)
2. Haz clic en el engrane de **"Configuración del proyecto"** (Project Settings)
3. Ve a la pestaña **"Cuentas de servicio"** (Service Accounts)
4. Haz clic en el botón **"Generar nueva clave privada"** (Generate new private key)
5. Se descargará un archivo JSON
6. **Renómbralo** a `serviceAccountKey.json` y colócalo en esta misma carpeta

⚠️ **IMPORTANTE**: Este archivo contiene credenciales sensibles. Nunca lo compartas ni lo subas a Git (ya está protegido en `.gitignore`)

---

### PASO 2: Copia tu Archivo de Datos

1. Busca tu archivo `BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json` en la raíz del proyecto
2. Cópialo a esta carpeta `migration-tool`
3. Asegúrate de que el nombre sea exactamente: `BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json`

---

### PASO 3: Actualiza la URL de tu Base de Datos

1. Abre el archivo `importar.js` en un editor de código
2. Busca la línea que dice `TU_PROYECTO_AQUI`
3. Reemplázala con la URL de tu base de datos

**Ejemplo:**
```javascript
// ❌ ANTES:
const FIREBASE_DATABASE_URL = "https://TU_PROYECTO_AQUI.firebaseio.com";

// ✅ DESPUÉS:
const FIREBASE_DATABASE_URL = "https://chronos-system-abc123.firebaseio.com";
```

💡 **¿Dónde encuentro la URL?**
- Firebase Console → Tu Proyecto → Configuración del proyecto → General
- Busca "Realtime Database URL" o usa tu Project ID

---

### PASO 4: Ejecuta la Migración

Abre tu terminal en esta carpeta `migration-tool` y ejecuta:

#### 1️⃣ Instalar dependencias (solo se hace una vez):
```bash
npm install
```

#### 2️⃣ Ejecutar el script de importación:
```bash
node importar.js
```

---

## 📊 ¿Qué se Importará?

El script creará y poblará las siguientes colecciones en Firestore:

| Colección | Descripción | Origen en JSON |
|-----------|-------------|----------------|
| `ordenesCompra` | Órdenes de compra a distribuidores | `ordenesCompra.distribuidores.ordenesCompra` |
| `distribuidores` | Resumen de deudas por distribuidor | `ordenesCompra.distribuidores.resumen` |
| `ventas` | Registro de ventas | `ventas.ventas` |
| `clientes` | Resumen de deudas por cliente | `ventas.clientes` |
| `bancos` | Saldos de cuentas bancarias | `bancos` |
| `gastosAbonos` | Gastos y abonos generales | `gastosAbonos.gastosAbonos` |
| `movimientosBancarios_*` | Movimientos por cada cuenta bancaria | `[banco].ingresos` |
| `gastos_*` | Gastos detallados por cuenta | `[banco].gastos` o `.gastosList` |
| `estadoGlobal/almacen` | Inventario de productos | `almacen` |
| `estadoGlobal/cortes*` | Cortes de caja históricos | `[banco].rfCortes` o `.cortesRF` |
| `estadoGlobal/metadata` | Metadata del sistema | `metadata` |

**💡 Para ver la estructura completa y el mapeo con los servicios, consulta: [`ARQUITECTURA_DATOS.md`](./ARQUITECTURA_DATOS.md)**

---

## ✅ Verificación Post-Migración

Después de ejecutar el script, verifica en Firebase Console:

1. Ve a **Firestore Database** en tu proyecto
2. Deberías ver todas las colecciones listadas arriba
3. Haz clic en cada una para verificar que los documentos se cargaron correctamente

---

## ⚠️ Solución de Problemas

### Error: "Cannot find module './serviceAccountKey.json'"
- **Solución**: Asegúrate de que el archivo `serviceAccountKey.json` esté en la carpeta `migration-tool`

### Error: "Cannot find module './BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json'"
- **Solución**: Copia el archivo JSON de datos a la carpeta `migration-tool`

### Error: "FIREBASE_DATABASE_URL is not defined"
- **Solución**: Reemplaza `TU_PROYECTO_AQUI` en `importar.js` con tu URL real de Firebase

### Error: "Permission denied"
- **Solución**: Verifica que la cuenta de servicio tenga permisos de "Editor" o "Propietario" en Firebase

---

## 🔒 Seguridad

- ✅ El archivo `.gitignore` protege automáticamente tus credenciales
- ❌ **NUNCA** compartas `serviceAccountKey.json`
- ❌ **NUNCA** subas este archivo a repositorios públicos

---

## 📝 Notas Adicionales

### Re-importar Datos
Si necesitas volver a importar los datos:
- El script **sobrescribirá** los documentos existentes con el mismo ID
- Los documentos sin ID específico se agregarán como nuevos

### Limpieza
Para limpiar las dependencias de Node.js:
```bash
# Eliminar node_modules
rm -rf node_modules

# Reinstalar
npm install
```

---

## 🎉 ¡Listo!

Una vez completada la migración, tu aplicación **chronos-system** debería funcionar perfectamente con los datos en Firestore.

Si encuentras algún problema, revisa los logs de la consola durante la importación para identificar el error específico.

---

**Desarrollado para Chronos System Premium Ecosystem** 🚀

---

## 📚 Recursos Adicionales

- **[ARQUITECTURA_DATOS.md](./ARQUITECTURA_DATOS.md)** - Estructura completa de datos y mapeo con servicios
- **[CHECKLIST_VERIFICACION.md](./CHECKLIST_VERIFICACION.md)** - Checklist paso a paso para validar la migración
- **[COMANDOS_UTILES.md](./COMANDOS_UTILES.md)** - Comandos útiles para trabajar con la migración

---

**🎊 ¡Gracias por usar la Herramienta de Migración de Chronos System!**
