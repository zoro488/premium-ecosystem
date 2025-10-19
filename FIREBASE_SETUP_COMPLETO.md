# Firebase - Setup Completo ✅

## Estado Actual

**Firebase está 100% instalado y configurado en tu proyecto.**

### Archivos Creados

- ✅ [src/lib/firebase.js](src/lib/firebase.js) - Configuración de Firebase
- ✅ [src/services/firebaseService.js](src/services/firebaseService.js) - CRUD completo para Firestore
- ✅ [src/services/authService.js](src/services/authService.js) - Autenticación completa
- ✅ [src/hooks/useAuth.js](src/hooks/useAuth.js) - Hook de React para autenticación
- ✅ [src/hooks/useFirestore.js](src/hooks/useFirestore.js) - Hook con fallback automático a localStorage

### Documentación Creada

- 📄 [GUIA_MIGRACION_FIREBASE.md](GUIA_MIGRACION_FIREBASE.md) - Guía completa de migración
- 📄 [DB_AUTH_ALTERNATIVAS.md](DB_AUTH_ALTERNATIVAS.md) - Comparación Firebase vs otras opciones

---

## Cómo Activar Firebase (5 minutos)

### 1. Crear Proyecto Firebase

1. Ir a: https://console.firebase.google.com/
2. Click **"Agregar proyecto"**
3. Nombre: `premium-ecosystem`
4. Click **"Continuar"**
5. Deshabilitar Google Analytics (opcional)
6. Click **"Crear proyecto"**

### 2. Obtener Credenciales

1. En el proyecto, click en **⚙️ (engranaje)** → **"Configuración del proyecto"**
2. En **"Tus apps"**, click en **`</>`** (ícono Web)
3. Nombre: `Premium Ecosystem`
4. NO marcar "Firebase Hosting"
5. Click **"Registrar app"**
6. **Copiar** el objeto `firebaseConfig` que aparece:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "premium-ecosystem-xxxxx.firebaseapp.com",
  projectId: "premium-ecosystem-xxxxx",
  storageBucket: "premium-ecosystem-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789"
};
```

### 3. Activar Firestore Database

1. En el menú lateral: **"Build"** → **"Firestore Database"**
2. Click **"Crear base de datos"**
3. Seleccionar **"Iniciar en modo de prueba"**
4. Ubicación: **`us-central1`** (o la más cercana)
5. Click **"Habilitar"**

⚠️ **Importante:** Las reglas en "modo de prueba" permiten acceso por 30 días. Después deberás asegurarlas.

### 4. Activar Authentication

1. En el menú lateral: **"Build"** → **"Authentication"**
2. Click **"Comenzar"**
3. Pestaña **"Sign-in method"**:
   - ✅ **Email/Password:** Click → Habilitar → Guardar
   - ✅ **Google:** Click → Habilitar → Agregar email de soporte → Guardar
   - ⚠️ Facebook y GitHub son opcionales (requieren configuración externa)

### 5. Crear archivo `.env`

En la raíz del proyecto, crea el archivo `.env` con tus credenciales:

```env
# Firebase Configuration (REEMPLAZA CON TUS VALORES REALES)
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=premium-ecosystem-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=premium-ecosystem-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=premium-ecosystem-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789
```

### 6. Reiniciar el Servidor

```bash
# Presiona Ctrl+C para detener el servidor actual
npm run dev
```

**🎉 ¡Listo! Firebase está activo.**

---

## Cómo Verificar que Funciona

### Opción 1: Consola del Navegador

1. Abre tu app en el navegador
2. Abre DevTools (F12)
3. En la consola, ejecuta:

```javascript
// Verificar si Firebase está configurado
import { isFirebaseConfigured } from './src/lib/firebase.js';
console.log('Firebase configurado:', isFirebaseConfigured());
```

Si ves `true`, ¡funciona!

### Opción 2: Probar Creación de Dato

En cualquier app (ej: FlowDistributor):

```javascript
import { crearBanco } from '../../services/firebaseService';

const probarFirebase = async () => {
  try {
    const resultado = await crearBanco({
      nombre: 'Banco de Prueba',
      capital_actual: 100000
    });
    console.log('✅ Firebase funcionando:', resultado);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

probarFirebase();
```

### Opción 3: Ver en Firebase Console

1. Ve a Firebase Console → Firestore Database
2. Deberías ver una colección `bancos` con el documento creado

---

## Uso en Tus Apps

### Forma Fácil: Hook `useFirestore`

**Automáticamente usa Firebase o localStorage según disponibilidad.**

```javascript
import { useFirestore } from '../../hooks/useFirestore';

function FlowDistributor() {
  const {
    data: bancos,
    loading,
    create: crearBanco,
    update: actualizarBanco,
    remove: eliminarBanco,
    isUsingFirebase
  } = useFirestore('bancos', []);

  const handleCrear = async () => {
    await crearBanco({
      nombre: 'Boveda Monte',
      capital_actual: 850000,
      interes_diario: 2.5
    });
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      {isUsingFirebase ? '✅ Firebase' : '💾 localStorage'}

      <button onClick={handleCrear}>Crear Banco</button>

      {bancos.map(banco => (
        <div key={banco.id}>
          <h3>{banco.nombre}</h3>
          <p>${banco.capital_actual}</p>
          <button onClick={() => actualizarBanco(banco.id, { capital_actual: 900000 })}>
            Actualizar
          </button>
          <button onClick={() => eliminarBanco(banco.id)}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Autenticación Completa

```javascript
import { useAuth } from '../../hooks/useAuth';
import { iniciarSesion, cerrarSesion, iniciarSesionConGoogle } from '../../services/authService';

function App() {
  const { user, loading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (loading) return <div>Cargando...</div>;

  if (!isAuthenticated) {
    return (
      <div>
        <h2>Login</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />
        <button onClick={() => iniciarSesion(email, password)}>
          Iniciar Sesión
        </button>
        <button onClick={iniciarSesionConGoogle}>
          Continuar con Google
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Bienvenido {user.displayName}</h1>
      <button onClick={cerrarSesion}>Cerrar Sesión</button>
      <YourApp />
    </div>
  );
}
```

---

## Funciones Disponibles

### CRUD Genérico (firebaseService.js)

```javascript
import {
  createDocument,   // Crear documento en cualquier colección
  getDocuments,     // Obtener todos los documentos
  getDocument,      // Obtener un documento específico
  updateDocument,   // Actualizar documento
  deleteDocument,   // Eliminar documento
  subscribeToCollection  // Tiempo real
} from '../services/firebaseService';
```

### Funciones Específicas por App

#### FlowDistributor
```javascript
crearBanco(data)
obtenerBancos()
actualizarBanco(id, data)
eliminarBanco(id)
escucharBancos(callback)  // Tiempo real

crearTransaccion(data)
obtenerTransacciones()
eliminarTransaccion(id)

crearAlerta(data)
obtenerAlertas()
actualizarAlerta(id, data)
eliminarAlerta(id)
```

#### ShadowPrime
```javascript
crearCuentaBancaria(data)
obtenerCuentasBancarias()
actualizarCuentaBancaria(id, data)
eliminarCuentaBancaria(id)

crearInversion(data)
obtenerInversiones()
actualizarInversion(id, data)
eliminarInversion(id)

crearPropiedad(data)
obtenerPropiedades()
actualizarPropiedad(id, data)
eliminarPropiedad(id)
```

#### Apollo
```javascript
crearGasto(data)
obtenerGastos()
eliminarGasto(id)

crearPresupuesto(data)
obtenerPresupuestos()
actualizarPresupuesto(id, data)
eliminarPresupuesto(id)
```

#### Synapse
```javascript
crearConversacion(data)
obtenerConversaciones()
actualizarConversacion(id, data)
eliminarConversacion(id)

crearMensaje(data)
obtenerMensajes(conversacionId)
```

#### Nexus
```javascript
crearTarea(data)
obtenerTareas()
actualizarTarea(id, data)
eliminarTarea(id)

crearProyecto(data)
obtenerProyectos()
actualizarProyecto(id, data)
eliminarProyecto(id)
```

### Autenticación (authService.js)

```javascript
// Registro y Login
registrarUsuario(email, password, nombre)
iniciarSesion(email, password)
cerrarSesion()

// Redes Sociales
iniciarSesionConGoogle()
iniciarSesionConFacebook()
iniciarSesionConGithub()

// Recuperación
recuperarContrasena(email)

// Perfil
actualizarNombre(nuevoNombre)
actualizarFotoPerfil(photoURL)
actualizarEmailUsuario(nuevoEmail)
actualizarContrasena(nuevaContrasena)
reautenticarUsuario(password)
eliminarCuenta()

// Estado
escucharAuthState(callback)
obtenerUsuarioActual()
estaAutenticado()
obtenerToken()

// Utilidades
obtenerMensajeError(errorCode)  // Mensajes en español
```

---

## Reglas de Seguridad (IMPORTANTE)

Después de activar autenticación, **asegura tu base de datos**:

1. Firebase Console → **Firestore Database** → **"Reglas"**
2. Reemplaza con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir solo si está autenticado y es dueño del dato
    match /{collection}/{document} {
      allow read, write: if request.auth != null &&
                          resource.data.userId == request.auth.uid;
    }

    // Permitir crear si el userId coincide
    match /{collection}/{document} {
      allow create: if request.auth != null &&
                      request.resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click **"Publicar"**

---

## Límites Gratuitos

Firebase **Spark Plan** (GRATIS para siempre):

| Servicio | Límite Gratuito |
|----------|----------------|
| **Firestore Database** | 1 GB almacenamiento |
| | 50,000 lecturas/día |
| | 20,000 escrituras/día |
| | 20,000 eliminaciones/día |
| **Authentication** | Usuarios ilimitados |
| **Storage** | 5 GB almacenamiento |
| | 1 GB descarga/día |
| **Hosting** | 10 GB almacenamiento |
| | 360 MB/día descarga |

**Para tus 5 apps en desarrollo y uso personal, esto es MÁS QUE SUFICIENTE.**

---

## Migrar Datos de localStorage

Si ya tienes datos en localStorage:

```javascript
import { crearBanco } from '../services/firebaseService';

async function migrarDatos() {
  // Obtener datos de localStorage
  const bancosLocal = JSON.parse(localStorage.getItem('bancos') || '[]');

  // Migrar a Firebase
  for (const banco of bancosLocal) {
    try {
      await crearBanco(banco);
      console.log(`✅ Migrado: ${banco.nombre}`);
    } catch (error) {
      console.error(`❌ Error migrando ${banco.nombre}:`, error);
    }
  }

  console.log('🎉 Migración completada');
}

// Ejecutar una sola vez
migrarDatos();
```

---

## Modo Offline (Opcional)

Firebase tiene **persistencia offline automática**. Los datos se sincronizan cuando vuelve la conexión.

Para activarlo:

```javascript
// En src/lib/firebase.js
import { enableIndexedDbPersistence } from 'firebase/firestore';

enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      console.warn('Persistencia: múltiples pestañas abiertas');
    } else if (err.code == 'unimplemented') {
      console.warn('Persistencia: navegador no soportado');
    }
  });
```

---

## Solución de Problemas

### Error: "Firebase not configured"

- Verifica que el archivo `.env` existe
- Verifica que todas las variables empiezan con `VITE_`
- Reinicia el servidor: `Ctrl+C` y `npm run dev`

### Error: "Permission denied"

- Configura las reglas de seguridad en Firestore
- Asegúrate de estar autenticado antes de hacer operaciones

### Error: "Quota exceeded"

- Revisa el uso en Firebase Console
- Considera actualizar al plan Blaze (pay-as-you-go) si necesitas más

### Los datos no se actualizan en tiempo real

- Activa `realtime: true` en `useFirestore`:
  ```javascript
  useFirestore('bancos', [], { realtime: true })
  ```

---

## Próximos Pasos

1. ✅ Crear proyecto en Firebase
2. ✅ Configurar `.env`
3. ✅ Reiniciar servidor
4. ⬜ Probar CRUD en FlowDistributor
5. ⬜ Implementar login/registro
6. ⬜ Migrar las demás apps
7. ⬜ Asegurar con reglas de Firestore

---

## Recursos

- 📚 [Documentación oficial de Firebase](https://firebase.google.com/docs)
- 📚 [Guía de Firestore](https://firebase.google.com/docs/firestore)
- 📚 [Guía de Authentication](https://firebase.google.com/docs/auth)
- 📄 [GUIA_MIGRACION_FIREBASE.md](GUIA_MIGRACION_FIREBASE.md) - Guía completa de migración
- 📄 [DB_AUTH_ALTERNATIVAS.md](DB_AUTH_ALTERNATIVAS.md) - Comparación con otras opciones

---

**¿Todo listo?** Firebase está instalado y configurado. Solo necesitas activarlo con tus credenciales en `.env` 🚀
