# Guía de Migración a Firebase

## Sistema Implementado ✅

Tu ecosistema premium ahora tiene **Firebase completamente integrado** con:

- ✅ Configuración de Firebase
- ✅ Servicio de Firestore (CRUD completo)
- ✅ Servicio de Autenticación (Email, Google, Facebook, GitHub)
- ✅ Hook `useAuth` para React
- ✅ Hook `useFirestore` con fallback automático a localStorage

## Cómo Funciona

El sistema es **inteligente** y **no rompe nada**:

1. **Si Firebase NO está configurado** → Usa localStorage (como ahora)
2. **Si Firebase SÍ está configurado** → Usa Firebase automáticamente

No necesitas cambiar código para alternar entre los dos modos.

---

## Configuración de Firebase (5 minutos)

### Paso 1: Crear Proyecto en Firebase

1. Ve a https://console.firebase.google.com/
2. Click en "Agregar proyecto"
3. Nombre: `premium-ecosystem` (o el que prefieras)
4. Deshabilita Google Analytics (opcional)
5. Click en "Crear proyecto"

### Paso 2: Obtener Credenciales

1. En el panel, click en el ícono de **engranaje** → "Configuración del proyecto"
2. En la pestaña "General", scroll hasta "Tus apps"
3. Click en el ícono **</>** (Web)
4. Nombre de la app: `Premium Ecosystem Web`
5. NO marques "Firebase Hosting" por ahora
6. Click en "Registrar app"
7. **Copia las credenciales** que aparecen (las necesitarás para el `.env`)

### Paso 3: Activar Servicios

#### Firestore Database
1. En el menú lateral, click en "Build" → "Firestore Database"
2. Click en "Crear base de datos"
3. Selecciona "Iniciar en modo de prueba" (lo aseguraremos después)
4. Ubicación: `us-central1` (o la más cercana)
5. Click en "Habilitar"

#### Authentication
1. En el menú lateral, click en "Build" → "Authentication"
2. Click en "Comenzar"
3. En la pestaña "Sign-in method", habilita:
   - ✅ **Email/Password** (click en "Habilitar" y guardar)
   - ✅ **Google** (click, habilitar, agregar email de soporte)
   - ⚠️ Facebook y GitHub son opcionales (requieren apps en esas plataformas)

### Paso 4: Configurar Variables de Entorno

Crea el archivo `.env` en la raíz del proyecto:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=premium-ecosystem-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=premium-ecosystem-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=premium-ecosystem-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789
```

**Importante:** Reemplaza los valores con los que copiaste en el Paso 2.

### Paso 5: Reiniciar el Servidor

```bash
# Ctrl+C para detener el servidor
npm run dev
```

**¡Listo!** Firebase está configurado. 🎉

---

## Cómo Usar en tus Apps

### Opción 1: Hook `useFirestore` (RECOMENDADO - Más Fácil)

Este hook hace **todo automáticamente**: usa Firebase si está configurado, o localStorage si no.

#### Ejemplo en FlowDistributor

```javascript
import { useFirestore } from '../../hooks/useFirestore';

function FlowDistributor() {
  // ANTES:
  // const [bancos, setBancos] = useLocalStorage('bancos', []);

  // DESPUÉS:
  const {
    data: bancos,
    loading,
    error,
    create: crearBanco,
    update: actualizarBanco,
    remove: eliminarBanco,
    isUsingFirebase
  } = useFirestore('bancos', []);

  // Crear banco
  const handleCrearBanco = async () => {
    await crearBanco({
      nombre: 'Boveda Monte',
      capital_actual: 850000,
      interes_diario: 2.5,
      tipo: 'normal'
    });
  };

  // Actualizar banco
  const handleActualizarBanco = async (id) => {
    await actualizarBanco(id, {
      capital_actual: 900000
    });
  };

  // Eliminar banco
  const handleEliminarBanco = async (id) => {
    await eliminarBanco(id);
  };

  if (loading) {
    return <div>Cargando bancos...</div>;
  }

  return (
    <div>
      {isUsingFirebase && <span>✅ Usando Firebase</span>}
      {!isUsingFirebase && <span>💾 Usando localStorage</span>}

      <button onClick={handleCrearBanco}>Crear Banco</button>

      {bancos.map(banco => (
        <div key={banco.id}>
          <h3>{banco.nombre}</h3>
          <p>Capital: ${banco.capital_actual}</p>
          <button onClick={() => handleActualizarBanco(banco.id)}>
            Actualizar
          </button>
          <button onClick={() => handleEliminarBanco(banco.id)}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Opción 2: Servicios Directos (Más Control)

Si necesitas más control, puedes usar los servicios directamente:

```javascript
import {
  obtenerBancos,
  crearBanco,
  actualizarBanco,
  eliminarBanco
} from '../../services/firebaseService';

function FlowDistributor() {
  const [bancos, setBancos] = useState([]);

  useEffect(() => {
    cargarBancos();
  }, []);

  const cargarBancos = async () => {
    try {
      const data = await obtenerBancos();
      setBancos(data);
    } catch (error) {
      console.error('Error cargando bancos:', error);
    }
  };

  const handleCrear = async () => {
    const nuevo = await crearBanco({
      nombre: 'Boveda Monte',
      capital_actual: 850000
    });
    setBancos([...bancos, nuevo]);
  };

  // ... resto del código
}
```

---

## Autenticación

### Hook `useAuth`

```javascript
import { useAuth } from '../../hooks/useAuth';
import {
  iniciarSesion,
  registrarUsuario,
  cerrarSesion,
  iniciarSesionConGoogle
} from '../../services/authService';

function App() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Verificando autenticación...</div>;
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div>
      <h1>Bienvenido {user.displayName || user.email}</h1>
      <button onClick={cerrarSesion}>Cerrar Sesión</button>
      <YourApp />
    </div>
  );
}
```

### Componente de Login

```javascript
import { useState } from 'react';
import {
  iniciarSesion,
  registrarUsuario,
  iniciarSesionConGoogle,
  obtenerMensajeError
} from '../../services/authService';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await iniciarSesion(email, password);
    } catch (err) {
      setError(obtenerMensajeError(err.code));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await iniciarSesionConGoogle();
    } catch (err) {
      setError(obtenerMensajeError(err.code));
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Iniciar Sesión</h2>

      {error && <div className="error">{error}</div>}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
      />

      <button type="submit">Iniciar Sesión</button>

      <button type="button" onClick={handleGoogleLogin}>
        Continuar con Google
      </button>
    </form>
  );
}
```

---

## Tiempo Real (Opcional)

Para actualización automática cuando cambian los datos:

```javascript
const {
  data: bancos,
  loading
} = useFirestore('bancos', [], {
  realtime: true  // ← Activar tiempo real
});

// Ahora, si otro usuario crea/modifica un banco,
// se actualiza automáticamente en tu pantalla
```

---

## Reglas de Seguridad de Firestore

Una vez que tengas autenticación funcionando, **asegura tu base de datos**:

1. Ve a Firebase Console → Firestore Database → "Reglas"
2. Reemplaza con esto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Los usuarios solo pueden leer/escribir sus propios datos
    match /{collection}/{document} {
      allow read, write: if request.auth != null &&
                          resource.data.userId == request.auth.uid;
    }

    // Permitir crear documentos si el userId coincide
    match /{collection}/{document} {
      allow create: if request.auth != null &&
                      request.resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click en "Publicar"

---

## Migración de Datos Existentes

Si ya tienes datos en localStorage y quieres pasarlos a Firebase:

```javascript
// Script de migración (ejecutar una vez)
async function migrarDatosAFirebase() {
  const bancosLocal = JSON.parse(localStorage.getItem('bancos') || '[]');

  for (const banco of bancosLocal) {
    await crearBanco(banco);
  }

  console.log('✅ Migración completada');
}
```

---

## Límites del Plan Gratuito

Firebase Spark (GRATIS) incluye:

- **Firestore:** 1 GB almacenamiento, 50k lecturas/día, 20k escrituras/día
- **Authentication:** Usuarios ilimitados
- **Storage:** 5 GB almacenamiento de archivos
- **Hosting:** 10 GB almacenamiento, 360 MB/día descarga

**Para tus 5 apps esto es MÁS QUE SUFICIENTE** en modo de desarrollo y para uso personal.

---

## Estado Actual

- ✅ Firebase instalado
- ✅ Configuración creada ([src/lib/firebase.js](src/lib/firebase.js))
- ✅ Servicio de Firestore ([src/services/firebaseService.js](src/services/firebaseService.js))
- ✅ Servicio de Auth ([src/services/authService.js](src/services/authService.js))
- ✅ Hook useAuth ([src/hooks/useAuth.js](src/hooks/useAuth.js))
- ✅ Hook useFirestore ([src/hooks/useFirestore.js](src/hooks/useFirestore.js))
- ⚠️ Necesitas configurar `.env` para activar Firebase

---

## ¿Qué Sigue?

1. **Configurar Firebase** (5 minutos) - Sigue el Paso 1-5 arriba
2. **Probar con una app** - Migra FlowDistributor usando `useFirestore`
3. **Agregar autenticación** - Usa `useAuth` para login
4. **Migrar las demás apps** - Reemplaza `useLocalStorage` por `useFirestore`

## Ventajas de Firebase vs localStorage

| Característica | localStorage | Firebase |
|---------------|--------------|----------|
| Persistencia | Solo navegador | Cloud (acceso desde cualquier dispositivo) |
| Multiusuario | ❌ No | ✅ Sí |
| Tiempo Real | ❌ No | ✅ Sí |
| Autenticación | ❌ Manual | ✅ Incluida |
| Búsquedas complejas | ❌ Limitado | ✅ Queries avanzados |
| Límite de datos | ~5-10 MB | 1 GB gratis |
| Seguridad | ⚠️ Cualquiera puede ver | ✅ Reglas por usuario |

---

**¿Necesitas ayuda?** Revisa la documentación completa en [DB_AUTH_ALTERNATIVAS.md](DB_AUTH_ALTERNATIVAS.md)
