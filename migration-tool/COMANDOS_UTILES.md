# 🛠️ Comandos Útiles - Migration Tool

Colección de comandos útiles para trabajar con la herramienta de migración y Firestore.

---

## 📦 Instalación y Setup

### Instalar Dependencias
```bash
npm install
```

### Verificar Node.js
```bash
node --version  # Debe ser >= 16.0.0
```

### Verificar Archivos Requeridos
```bash
# PowerShell
Test-Path .\serviceAccountKey.json
Test-Path .\BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json

# Bash/Linux
ls -la serviceAccountKey.json
ls -la BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json
```

---

## 🚀 Ejecutar Migración

### Ejecución Básica
```bash
node importar.js
```

### Ejecución con npm script
```bash
npm start
# o
npm run import
```

### Ver Output Completo
```bash
node importar.js 2>&1 | tee migracion.log
```

---

## 🔍 Validación del JSON

### Verificar Sintaxis JSON
```bash
# PowerShell
Get-Content .\BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json | ConvertFrom-Json | Out-Null

# Node.js
node -e "require('./BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json')"
```

### Ver Estructura del JSON
```bash
# PowerShell
(Get-Content .\BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json | ConvertFrom-Json).PSObject.Properties.Name

# Node.js
node -e "console.log(Object.keys(require('./BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json')))"
```

### Contar Registros por Sección
```bash
# PowerShell
$data = Get-Content .\BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json | ConvertFrom-Json
$data.ordenesCompra.distribuidores.ordenesCompra.Count
$data.ventas.ventas.Count
$data.ventas.clientes.Count
```

---

## 🔥 Comandos de Firebase

### Instalar Firebase CLI (si no está instalado)
```bash
npm install -g firebase-tools
```

### Login a Firebase
```bash
firebase login
```

### Seleccionar Proyecto
```bash
firebase use [PROJECT_ID]
```

### Ver Proyectos Disponibles
```bash
firebase projects:list
```

### Exportar Datos de Firestore
```bash
# Exportar todas las colecciones
firebase firestore:export backup-$(date +%Y%m%d)

# Exportar colección específica
firebase firestore:export backup --collection-ids ordenesCompra
```

### Importar Datos a Firestore
```bash
firebase firestore:import backup-20251113
```

### Limpiar Colección (⚠️ CUIDADO)
```bash
# NO hay comando directo, usar script personalizado o Firebase Console
```

---

## 📊 Consultas de Verificación

### Contar Documentos en Node.js
```javascript
// crear archivo: count-docs.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function countDocs(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  console.log(`${collectionName}: ${snapshot.size} documentos`);
}

// Ejecutar
(async () => {
  await countDocs('ordenesCompra');
  await countDocs('ventas');
  await countDocs('clientes');
  await countDocs('bancos');
  await countDocs('distribuidores');
  process.exit(0);
})();
```

Ejecutar:
```bash
node count-docs.js
```

### Ver Primer Documento de Cada Colección
```javascript
// crear archivo: preview-data.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function previewCollection(collectionName) {
  const snapshot = await db.collection(collectionName).limit(1).get();
  console.log(`\n=== ${collectionName} ===`);
  snapshot.forEach(doc => {
    console.log(JSON.stringify(doc.data(), null, 2));
  });
}

(async () => {
  await previewCollection('ordenesCompra');
  await previewCollection('ventas');
  await previewCollection('bancos');
  process.exit(0);
})();
```

Ejecutar:
```bash
node preview-data.js
```

---

## 🧹 Limpieza y Mantenimiento

### Limpiar node_modules
```bash
# PowerShell
Remove-Item -Recurse -Force .\node_modules

# Bash
rm -rf node_modules
```

### Reinstalar Dependencias
```bash
npm install
```

### Actualizar firebase-admin
```bash
npm update firebase-admin
```

### Verificar Versiones
```bash
npm list firebase-admin
```

---

## 🔒 Seguridad

### Verificar Permisos de serviceAccountKey.json
```bash
# PowerShell
Get-Acl .\serviceAccountKey.json | Format-List

# Linux/Mac
ls -l serviceAccountKey.json
chmod 600 serviceAccountKey.json  # Solo owner puede leer/escribir
```

### Generar Nueva Service Account Key
1. Firebase Console → Project Settings
2. Service Accounts → Generate New Private Key
3. Reemplazar `serviceAccountKey.json`
4. Revocar la anterior en Google Cloud Console

### Rotar Credenciales
```bash
# 1. Generar nueva key
# 2. Actualizar serviceAccountKey.json
# 3. Probar migración
node importar.js
# 4. Revocar key anterior en Console
```

---

## 📈 Monitoreo y Logs

### Ver Logs de Firestore en Tiempo Real
```bash
firebase functions:log --only firestore
```

### Logs de la Migración
```bash
# Guardar logs en archivo
node importar.js > migracion-$(date +%Y%m%d-%H%M%S).log 2>&1
```

### Filtrar Logs por Tipo
```bash
# Solo errores
node importar.js 2>&1 | grep "❌"

# Solo éxitos
node importar.js 2>&1 | grep "✅"

# Solo warnings
node importar.js 2>&1 | grep "⚠️"
```

---

## 🐛 Debugging

### Modo Verbose
```javascript
// Agregar al inicio de importar.js
process.env.DEBUG = '*';
```

### Test de Conexión a Firebase
```javascript
// crear archivo: test-connection.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://TU_PROYECTO_AQUI.firebaseio.com'
});

const db = admin.firestore();

db.collection('test').add({ timestamp: new Date() })
  .then(() => console.log('✅ Conexión exitosa'))
  .catch(err => console.error('❌ Error:', err))
  .finally(() => process.exit(0));
```

Ejecutar:
```bash
node test-connection.js
```

### Validar Service Account
```bash
# Extraer project_id del serviceAccountKey.json
node -e "console.log(require('./serviceAccountKey.json').project_id)"
```

---

## 🎯 Utilidades Avanzadas

### Migración Parcial (Solo Una Colección)
Modificar `importar.js` temporalmente:
```javascript
async function main(db, dataToImport) {
  console.log('--- MIGRACIÓN PARCIAL: Solo Ventas ---');

  // Comentar todo excepto:
  if (dataToImport.ventas && dataToImport.ventas.ventas) {
    await importCollection(db, 'ventas', dataToImport.ventas.ventas, 'id');
  }

  console.log('--- COMPLETADO ---');
}
```

### Dry Run (Simulación)
Agregar flag al inicio de las funciones:
```javascript
const DRY_RUN = true;  // No escribir, solo mostrar

async function importCollection(db, collectionName, dataArray, idKey) {
  console.log(`[DRY RUN] Importaría ${dataArray.length} docs a ${collectionName}`);
  if (DRY_RUN) return;
  // ... resto del código
}
```

### Backup Antes de Migrar
```bash
# Script completo
firebase firestore:export gs://[BUCKET]/backup-$(date +%Y%m%d)
node importar.js
```

---

## 📚 Referencias Rápidas

### URLs Importantes
- Firebase Console: https://console.firebase.google.com
- Firestore Rules: https://firebase.google.com/docs/firestore/security/rules-structure
- Service Accounts: https://console.cloud.google.com/iam-admin/serviceaccounts

### Límites de Firestore
- Tamaño máximo de documento: 1 MB
- Operaciones por batch: 500
- Writes por segundo (single doc): 1
- Queries simultáneas: Sin límite

### Mejores Prácticas
1. Siempre hacer backup antes de migrar
2. Probar en proyecto de desarrollo primero
3. Migrar en horarios de bajo tráfico
4. Monitorear uso de Firebase después de migrar
5. Documentar cambios en la estructura

---

**💡 Tip:** Guarda este archivo para futuras migraciones o actualizaciones de datos.
