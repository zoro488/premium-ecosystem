# 🔥 Guía de Importación CSV → Firestore

## 📋 Tabla de Contenidos
1. [Requisitos](#requisitos)
2. [Instalación](#instalación)
3. [Estructura de Archivos](#estructura-de-archivos)
4. [Configuración](#configuración)
5. [Ejecución](#ejecución)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Requisitos

### Software Necesario
- ✅ Node.js 18+
- ✅ npm/yarn/pnpm
- ✅ Cuenta de Firebase con Firestore habilitado
- ✅ Service Account Key de Firebase

### Archivos CSV Requeridos (12 archivos)
1. `Copia de Administación_General - Clientes.csv`
2. `Copia de Administación_General - Distribuidores.csv`
3. `Copia de Administación_General - Control_Maestro.csv`
4. `Copia de Administación_General - Almacen_Monte.csv`
5. `Copia de Administación_General - Bóveda_Monte.csv`
6. `Copia de Administación_General - Bóveda_USA.csv`
7. `Copia de Administación_General - Profit.csv`
8. `Copia de Administación_General - Leftie.csv`
9. `Copia de Administación_General - Flete_Sur.csv`
10. `Copia de Administación_General - Utilidades.csv`
11. `Copia de Administación_General - Azteca.csv`

---

## 📦 Instalación

### 1. Instalar Dependencias

```bash
# Navega a la carpeta del proyecto
cd premium-ecosystem

# Instala las dependencias
npm install

# Instala las dependencias específicas del script
npm install firebase-admin csv-parser chalk ora cli-progress
npm install --save-dev @types/node ts-node typescript
```

### 2. Estructura de Carpetas

Crea la siguiente estructura:

```
premium-ecosystem/
├── scripts/
│   └── importar-csv-firestore.ts    # ✅ Script principal
├── data/
│   └── csv/                          # 📁 Coloca aquí los 12 CSVs
│       ├── Copia de Administación_General - Clientes.csv
│       ├── Copia de Administación_General - Distribuidores.csv
│       └── ... (los otros 10 archivos)
├── firebase/
│   └── serviceAccountKey.json        # 🔐 Tu service account
├── logs/                              # 📝 Se crea automáticamente
└── package.json
```

---

## 🔧 Configuración

### 1. Obtener Service Account Key

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Configuración del proyecto** (⚙️ > Project Settings)
4. Ve a la pestaña **Cuentas de servicio**
5. Haz clic en **Generar nueva clave privada**
6. Guarda el archivo como `serviceAccountKey.json` en `/firebase/`

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz:

```env
FIREBASE_DATABASE_URL=https://TU_PROYECTO_AQUI.firebaseio.com
```

**O** edita directamente el script en línea 154:

```typescript
const FIREBASE_DATABASE_URL = "https://tu-proyecto.firebaseio.com";
```

### 3. Colocar Archivos CSV

Mueve los 12 archivos CSV a la carpeta `data/csv/`:

```bash
# En Windows PowerShell
Move-Item "C:\Downloads\*.csv" ".\data\csv\"

# En Mac/Linux
mv ~/Downloads/*.csv ./data/csv/
```

---

## 🚀 Ejecución

### Método 1: NPM Script (Recomendado)

Agrega esto a tu `package.json`:

```json
{
  "scripts": {
    "import:csv": "ts-node scripts/importar-csv-firestore.ts"
  }
}
```

Ejecuta:

```bash
npm run import:csv
```

### Método 2: Directamente con ts-node

```bash
npx ts-node scripts/importar-csv-firestore.ts
```

### Método 3: Compilar y Ejecutar

```bash
# Compilar TypeScript a JavaScript
npx tsc scripts/importar-csv-firestore.ts --outDir dist

# Ejecutar el JavaScript compilado
node dist/importar-csv-firestore.js
```

---

## 📊 Output Esperado

Durante la ejecución verás:

```
════════════════════════════════════════════════════════════════════
     🔥 IMPORTACIÓN AVANZADA CSV → FIRESTORE 🔥
════════════════════════════════════════════════════════════════════

[2025-01-14T10:30:00.000Z] 🔌 Inicializando conexión a Firebase...
[2025-01-14T10:30:01.234Z] ✅ Conexión a Firebase establecida correctamente

🏦 PASO 1: Procesando Bancos, Gastos y Transferencias...
✔ Importando 7 documentos a 'bancos'...
✔ Importando 245 documentos a 'gastos'...
✔ Importando 89 documentos a 'transferencias'...

👥 PASO 2: Procesando Clientes...
✔ Importando 32 documentos a 'clientes'...

🚚 PASO 3: Procesando Distribuidores y Órdenes de Compra...
✔ Importando 15 documentos a 'ordenesCompra'...
✔ Importando 8 documentos a 'distribuidores'...

💰 PASO 4: Procesando Ventas...
✔ Importando 156 documentos a 'ventas'...

📦 PASO 5: Procesando Almacén...
✅ Documento 'estadoGlobal/almacen' importado

📦 PASO 6: Procesando Producto...
✅ Documento 'productos/PROD-001' importado

════════════════════════════════════════════════════════════════════
               📊 RESUMEN DE IMPORTACIÓN
════════════════════════════════════════════════════════════════════

  Colección               │ Documentos Importados
  ─────────────────────────┼─────────────────────
  Bancos                  │ 7
  Gastos                  │ 245
  Transferencias          │ 89
  Clientes                │ 32
  Distribuidores          │ 8
  Órdenes de Compra       │ 15
  Ventas                  │ 156
  Productos               │ 1

  ─────────────────────────┼─────────────────────
  TOTAL                   │ 553 documentos

  ⏱️  Tiempo total:          12.45s
  ❌ Errores:                0
  📝 Log guardado en:        ./logs/import-2025-01-14T10-30-00.log

════════════════════════════════════════════════════════════════════

✅ IMPORTACIÓN COMPLETADA EXITOSAMENTE
```

---

## 🔍 Troubleshooting

### Error: "Archivo no encontrado"

**Problema:** No encuentra un CSV.

**Solución:**
```bash
# Verifica que los archivos existan
ls data/csv/

# Verifica los nombres exactos
# Asegúrate de que coincidan con CONFIG.csvFiles
```

### Error: "serviceAccountKey.json no encontrado"

**Problema:** Falta el service account.

**Solución:**
1. Descarga el service account de Firebase Console
2. Renómbralo a `serviceAccountKey.json`
3. Colócalo en `/firebase/serviceAccountKey.json`

### Error: "Permission denied" en Firestore

**Problema:** El service account no tiene permisos.

**Solución:**
1. Ve a Firebase Console → Firestore → Rules
2. Cambia temporalmente las reglas (solo para importación):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ Solo temporal para importación
    }
  }
}
```

3. **IMPORTANTE:** Restaura las reglas de seguridad después de importar.

### Error: "ECONNREFUSED" o "Network Error"

**Problema:** No puede conectar a Firebase.

**Solución:**
1. Verifica tu conexión a internet
2. Verifica que la URL de Firebase sea correcta
3. Prueba con:

```bash
# Verifica conectividad
ping firestore.googleapis.com
```

### Error: "Cannot find module 'csv-parser'"

**Problema:** Dependencias no instaladas.

**Solución:**
```bash
npm install
```

### Los datos no aparecen en Chronos-System

**Problema:** Estructura de datos incorrecta.

**Solución:**
1. Verifica en Firebase Console que las colecciones se crearon
2. Verifica que los nombres de colecciones coincidan con tu frontend:
   - `bancos` ✅
   - `gastos` ✅
   - `transferencias` ✅
   - `clientes` ✅
   - `distribuidores` ✅
   - `ordenesCompra` ✅
   - `ventas` ✅
   - `productos` ✅
   - `estadoGlobal/almacen` ✅

---

## 📝 Logs

Los logs se guardan automáticamente en `/logs/` con timestamp:

```
logs/
├── import-2025-01-14T10-30-00.log
├── import-2025-01-14T11-45-23.log
└── import-2025-01-14T14-20-15.log
```

Puedes revisar logs anteriores para debugging.

---

## 🔄 Re-importar Datos

Si necesitas volver a importar:

### Opción 1: Limpiar Firestore (Recomendado)

```bash
# Instala firebase-tools si no lo tienes
npm install -g firebase-tools

# Login a Firebase
firebase login

# Elimina todas las colecciones
firebase firestore:delete --all-collections
```

### Opción 2: Desde Firebase Console

1. Ve a Firestore
2. Elimina manualmente cada colección
3. Vuelve a ejecutar el script

---

## 🎯 Próximos Pasos

Después de importar exitosamente:

1. ✅ Verifica los datos en Firebase Console
2. ✅ Abre Chronos-System en el navegador
3. ✅ Ve a cada vista y verifica que los datos se muestran correctamente
4. ✅ Restaura las reglas de seguridad de Firestore
5. ✅ Celebra 🎉

---

## 🆘 Soporte

Si encuentras problemas:

1. **Revisa los logs** en `/logs/`
2. **Verifica la configuración** de Firebase
3. **Asegúrate** de tener los 12 CSVs correctos
4. **Contacta** al equipo de desarrollo

---

## 📚 Referencias

- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firestore Batch Operations](https://firebase.google.com/docs/firestore/manage-data/transactions)
- [CSV Parser npm](https://www.npmjs.com/package/csv-parser)

---

**Creado con ❤️ por el equipo de Premium Ecosystem**
