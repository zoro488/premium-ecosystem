# 🔥 FIREBASE SETUP - GUÍA COMPLETA

## ✅ CONFIGURACIÓN COMPLETADA

### Servicios Firebase Integrados
- ✅ **Firestore Database** - Base de datos en tiempo real
- ✅ **Authentication** - Sistema de autenticación completo
- ✅ **Cloud Storage** - Almacenamiento de archivos
- ✅ **Cloud Functions** - Funciones serverless (preparado)
- ✅ **Analytics** - Analíticas de uso
- ✅ **Performance Monitoring** - Monitoreo de rendimiento
- ✅ **Remote Config** - Configuración remota
- ✅ **Hosting** - Hosting web optimizado

---

## 📁 ARCHIVOS CREADOS

### Configuración Principal
```
src/config/firebase.js           - Configuración completa de Firebase
src/hooks/useFirebase.js         - Hooks de React para Firebase
src/services/firebaseSync.js     - Servicio de sincronización
```

### Reglas de Seguridad
```
firestore.rules                  - Reglas de seguridad Firestore
storage.rules                    - Reglas de seguridad Storage
firestore.indexes.json           - Índices optimizados
```

### Configuración Firebase
```
firebase.json                    - Configuración principal
.env.example                     - Template de variables de entorno
```

---

## 🚀 PASO 1: CONFIGURAR VARIABLES DE ENTORNO

### 1. Crear archivo .env.local
```bash
cp .env.example .env.local
```

### 2. Obtener credenciales de Firebase Console

**Ve a:** https://console.firebase.google.com

1. Selecciona tu proyecto o crea uno nuevo
2. Ve a **Project Settings** (⚙️ icono de configuración)
3. Scroll down hasta **Your apps**
4. Click en **Web app** (</> icono)
5. Si no tienes app, click **Add app**
6. Copia las credenciales del `firebaseConfig`

### 3. Rellenar .env.local

```env
VITE_FIREBASE_API_KEY=TU_API_KEY_AQUI
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 🔧 PASO 2: INICIALIZAR FIREBASE CLI

### 1. Login en Firebase
```bash
firebase login
```

### 2. Inicializar proyecto (OPCIONAL - ya está configurado)
Si necesitas reinicializar:
```bash
firebase init
```

Selecciona:
- [x] Firestore
- [x] Hosting
- [x] Storage
- [x] Emulators

### 3. Seleccionar tu proyecto
```bash
firebase use --add
```

---

## 📤 PASO 3: DESPLEGAR CONFIGURACIÓN

### 1. Desplegar reglas de Firestore
```bash
firebase deploy --only firestore:rules
```

### 2. Desplegar índices de Firestore
```bash
firebase deploy --only firestore:indexes
```

### 3. Desplegar reglas de Storage
```bash
firebase deploy --only storage
```

### 4. Desplegar todo junto
```bash
firebase deploy
```

---

## 🧪 PASO 4: PROBAR CON EMULATORS (RECOMENDADO)

### 1. Iniciar emuladores
```bash
firebase emulators:start
```

Esto iniciará:
- ✅ Firestore: http://localhost:8080
- ✅ Auth: http://localhost:9099
- ✅ Storage: http://localhost:9199
- ✅ Functions: http://localhost:5001
- ✅ Hosting: http://localhost:5000
- ✅ Emulator UI: http://localhost:4000

### 2. Probar en tu app
Tu app automáticamente detectará los emulators si están corriendo.

---

## 💻 USO EN TU APLICACIÓN

### Importar y usar Firebase

```jsx
import { useFlowDistributor, useAuth } from './hooks/useFirebase';

function MyComponent() {
  const { user, signIn, signOut } = useAuth();
  const { ventas, compras, loading } = useFlowDistributor();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Ventas: {ventas.data.length}</h1>
      <h1>Compras: {compras.data.length}</h1>
    </div>
  );
}
```

### Hooks Disponibles

```javascript
// Autenticación
const { user, signIn, signOut, signUp } = useAuth();

// Colección completa con realtime updates
const { data, loading, create, update, remove } = useFirestoreCollection('ventas');

// Documento específico
const { data, loading, update } = useFirestoreDocument('ventas', 'venta-id');

// Storage (subir archivos)
const { upload, uploading, uploadProgress } = useStorage('uploads');

// Analytics
const { logEvent, logPageView } = useAnalytics();

// Performance
const { measurePerformance } = usePerformance();

// Paginación
const { data, loadMore, hasMore } = usePagination('ventas', 20);

// Todo FlowDistributor
const { ventas, compras, clientes, bancos } = useFlowDistributor();
```

---

## 🔄 SINCRONIZACIÓN JSON ↔ FIREBASE

### Importar datos del JSON local a Firebase

```javascript
import { firebaseSyncService } from './services/firebaseSync';
import excelData from '../public/excel_data.json';

// Importar todos los datos
const stats = await firebaseSyncService.importFromJSON(excelData);
console.log('Importados:', stats);
```

### Exportar datos de Firebase al JSON

```javascript
const jsonData = await firebaseSyncService.exportToJSON();
console.log('Exportado:', jsonData);

// Guardar en archivo (solo en Node.js)
fs.writeFileSync('backup.json', JSON.stringify(jsonData, null, 2));
```

### Sincronización bidireccional

```javascript
const updatedData = await firebaseSyncService.syncBidirectional(excelData);
console.log('Sincronizado:', updatedData);
```

---

## 📊 ESTRUCTURA DE DATOS EN FIRESTORE

### Colecciones Creadas

```
/ventas
  - id: string
  - tipo: 'venta'
  - fecha: timestamp
  - cliente: string
  - totalVenta: number
  - adeudo: number
  - ...

/compras
  - id: string
  - tipo: 'compra'
  - fecha: timestamp
  - distribuidor: string
  - costoTotal: number
  - deuda: number
  - ...

/distribuidores
  - id: string
  - nombre: string
  - adeudo: number
  - estado: 'activo' | 'inactivo'
  - ...

/clientes
  - id: string
  - nombre: string
  - adeudo: number
  - estado: 'activo' | 'inactivo'
  - ...

/bancos
  - id: string
  - nombre: string
  - saldoActual: number
  - ...

/almacen
  - id: string
  - nombre: string
  - stockActual: number
  - ...

/movimientos
  - id: string
  - tipo: 'ingreso' | 'gasto' | 'transferencia'
  - monto: number
  - fecha: timestamp
  - ...
```

---

## 🔒 SEGURIDAD

### Reglas de Firestore
- ✅ Autenticación requerida para todas las operaciones
- ✅ Validación de tipos de datos
- ✅ Validación de campos requeridos
- ✅ Protección contra modificación de campos sensibles
- ✅ Roles de usuario (admin, user, viewer)

### Reglas de Storage
- ✅ Tamaño máximo de archivos: 10MB
- ✅ Solo imágenes y documentos permitidos
- ✅ Solo el propietario puede modificar sus archivos
- ✅ Excel hasta 20MB para importaciones

---

## 📈 ANALYTICS Y PERFORMANCE

### Eventos automáticos registrados
- `sign_up` - Registro de usuario
- `login` - Login de usuario
- `logout` - Logout de usuario
- `create_*` - Creación de documentos
- `update_*` - Actualización de documentos
- `delete_*` - Eliminación de documentos
- `file_upload` - Subida de archivos
- `firebase_import` - Importación masiva

### Performance tracking
Todas las operaciones críticas son monitoreadas automáticamente.

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Missing or insufficient permissions"
**Solución:** Despliega las reglas de Firestore
```bash
firebase deploy --only firestore:rules
```

### Error: "The query requires an index"
**Solución:** Despliega los índices
```bash
firebase deploy --only firestore:indexes
```

### No se conecta a Firebase
**Verificar:**
1. ✅ Variables de entorno en .env.local
2. ✅ Proyecto seleccionado: `firebase use`
3. ✅ Credenciales correctas
4. ✅ Reglas desplegadas

### Emulators no inician
```bash
# Limpiar y reiniciar
firebase emulators:start --clean
```

---

## 📦 DESPLIEGUE A PRODUCCIÓN

### 1. Build del proyecto
```bash
npm run build
```

### 2. Desplegar todo
```bash
npm run deploy
```

o manual:
```bash
firebase deploy --only hosting
firebase deploy --only firestore
firebase deploy --only storage
```

### 3. Verificar deploy
```bash
firebase hosting:channel:deploy preview
```

---

## 🎯 PRÓXIMOS PASOS

1. ✅ Configurar variables de entorno (.env.local)
2. ✅ Hacer login: `firebase login`
3. ✅ Seleccionar proyecto: `firebase use --add`
4. ✅ Desplegar reglas: `firebase deploy --only firestore:rules,firestore:indexes,storage`
5. ✅ Probar con emulators: `firebase emulators:start`
6. ✅ Importar datos: usar `firebaseSyncService.importFromJSON()`
7. ✅ Integrar hooks en componentes de React
8. ✅ Desplegar a producción: `npm run deploy`

---

## 📚 RECURSOS

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)

---

## 🆘 COMANDOS RÁPIDOS

```bash
# Login
firebase login

# Ver proyectos
firebase projects:list

# Seleccionar proyecto
firebase use nombre-proyecto

# Desplegar reglas
firebase deploy --only firestore:rules,firestore:indexes,storage

# Desplegar hosting
firebase deploy --only hosting

# Iniciar emulators
firebase emulators:start

# Ver logs
firebase functions:log

# Abrir console
firebase open

# Ver uso
firebase projects:list
```

---

**Versión:** 2.0.0
**Última actualización:** 2025-10-21
**Estado:** ✅ Completamente configurado y listo para usar
