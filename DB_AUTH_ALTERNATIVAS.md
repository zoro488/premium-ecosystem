# Alternativas GRATIS para Base de Datos + Autenticación
## (Sin usar Supabase)

## 1. Firebase (Google) - RECOMENDADO

### Por qué Firebase?
- 100% GRATIS hasta límites muy generosos
- Configuración en 5 minutos
- Base de datos en tiempo real
- Autenticación completa (email, Google, Facebook, etc.)
- Hosting gratis incluido
- Sin tarjeta de crédito requerida

### Límites del Plan Gratuito (Spark Plan)
- **Firestore Database**: 1 GB almacenamiento, 50k lecturas/día, 20k escrituras/día
- **Realtime Database**: 1 GB almacenamiento, 10 GB descarga/mes
- **Authentication**: Usuarios ilimitados
- **Storage**: 5 GB almacenamiento de archivos
- **Hosting**: 10 GB almacenamiento, 360 MB/día descarga

### Instalación

```bash
npm install firebase
```

### Configuración (5 minutos)

1. Ve a https://console.firebase.google.com/
2. Crea un nuevo proyecto (gratis, sin tarjeta)
3. En "Project Settings" > "General" copia tu configuración
4. Activa Firestore Database en "Build" > "Firestore Database"
5. Activa Authentication en "Build" > "Authentication"

### Código de Configuración

#### src/lib/firebase.js
```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
```

#### .env
```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### Operaciones CRUD con Firestore

#### src/services/firebaseService.js
```javascript
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// CREATE - Crear documento
export const crearBanco = async (bancoData) => {
  try {
    const docRef = await addDoc(collection(db, 'bancos'), {
      ...bancoData,
      createdAt: new Date(),
      userId: auth.currentUser?.uid // Para filtrar por usuario
    });
    return { id: docRef.id, ...bancoData };
  } catch (error) {
    console.error('Error creando banco:', error);
    throw error;
  }
};

// READ - Leer todos los documentos
export const obtenerBancos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'bancos'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error obteniendo bancos:', error);
    throw error;
  }
};

// READ - Leer un documento específico
export const obtenerBanco = async (id) => {
  try {
    const docRef = doc(db, 'bancos', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Banco no encontrado');
    }
  } catch (error) {
    console.error('Error obteniendo banco:', error);
    throw error;
  }
};

// UPDATE - Actualizar documento
export const actualizarBanco = async (id, updates) => {
  try {
    const docRef = doc(db, 'bancos', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date()
    });
    return { id, ...updates };
  } catch (error) {
    console.error('Error actualizando banco:', error);
    throw error;
  }
};

// DELETE - Eliminar documento
export const eliminarBanco = async (id) => {
  try {
    await deleteDoc(doc(db, 'bancos', id));
    return id;
  } catch (error) {
    console.error('Error eliminando banco:', error);
    throw error;
  }
};

// QUERY - Consultas avanzadas
export const obtenerBancosPorUsuario = async (userId) => {
  try {
    const q = query(
      collection(db, 'bancos'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error consultando bancos:', error);
    throw error;
  }
};

// REALTIME - Escuchar cambios en tiempo real
export const escucharBancos = (callback) => {
  const q = query(collection(db, 'bancos'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const bancos = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(bancos);
  });

  return unsubscribe; // Llamar esto para dejar de escuchar
};
```

### Autenticación Completa

#### src/services/authService.js
```javascript
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '../lib/firebase';

// Registrar nuevo usuario
export const registrarUsuario = async (email, password, nombre) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Actualizar perfil con nombre
    await updateProfile(userCredential.user, {
      displayName: nombre
    });

    return userCredential.user;
  } catch (error) {
    console.error('Error registrando usuario:', error);
    throw error;
  }
};

// Iniciar sesión
export const iniciarSesion = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error iniciando sesión:', error);
    throw error;
  }
};

// Iniciar sesión con Google
export const iniciarSesionConGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Error con Google Sign-In:', error);
    throw error;
  }
};

// Cerrar sesión
export const cerrarSesion = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error cerrando sesión:', error);
    throw error;
  }
};

// Recuperar contraseña
export const recuperarContrasena = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error recuperando contraseña:', error);
    throw error;
  }
};

// Escuchar cambios de autenticación
export const escucharAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Obtener usuario actual
export const obtenerUsuarioActual = () => {
  return auth.currentUser;
};
```

### Hook de React para Auth

#### src/hooks/useAuth.js
```javascript
import { useState, useEffect } from 'react';
import { escucharAuthState } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = escucharAuthState((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
};
```

### Ejemplo de Uso en Componente

```javascript
import { useAuth } from '../hooks/useAuth';
import { crearBanco, obtenerBancos, actualizarBanco, eliminarBanco } from '../services/firebaseService';
import { iniciarSesion, registrarUsuario, cerrarSesion } from '../services/authService';

function FlowDistributor() {
  const { user, loading } = useAuth();
  const [bancos, setBancos] = useState([]);

  useEffect(() => {
    if (user) {
      cargarBancos();
    }
  }, [user]);

  const cargarBancos = async () => {
    const data = await obtenerBancos();
    setBancos(data);
  };

  const agregarBanco = async () => {
    const nuevoBanco = await crearBanco({
      nombre: 'Boveda Monte',
      capital_actual: 850000,
      interes_diario: 2.5
    });
    setBancos([...bancos, nuevoBanco]);
  };

  if (loading) return <div>Cargando...</div>;

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div>
      <h1>Bienvenido {user.displayName}</h1>
      <button onClick={cerrarSesion}>Cerrar Sesión</button>
      {/* Tu app aquí */}
    </div>
  );
}
```

---

## 2. PocketBase - Auto-Hospedado GRATIS

### Por qué PocketBase?
- 100% GRATIS (lo instalas en tu servidor)
- Un solo archivo ejecutable
- SQLite incluido (no necesitas PostgreSQL)
- Admin UI automático
- Autenticación incorporada
- Tiempo real incluido
- APIs REST automáticas

### Instalación

```bash
# Descargar PocketBase
# Windows: https://github.com/pocketbase/pocketbase/releases
# Descomprime el .zip y ejecuta pocketbase.exe

# En tu proyecto React
npm install pocketbase
```

### Configuración

#### src/lib/pocketbase.js
```javascript
import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090');

// Auto-guardar auth en localStorage
pb.autoCancellation(false);
```

### Operaciones CRUD

```javascript
import { pb } from '../lib/pocketbase';

// CREATE
const record = await pb.collection('bancos').create({
  nombre: 'Boveda Monte',
  capital_actual: 850000
});

// READ
const records = await pb.collection('bancos').getFullList();
const record = await pb.collection('bancos').getOne('RECORD_ID');

// UPDATE
const updated = await pb.collection('bancos').update('RECORD_ID', {
  capital_actual: 900000
});

// DELETE
await pb.collection('bancos').delete('RECORD_ID');

// REALTIME
pb.collection('bancos').subscribe('*', (e) => {
  console.log(e.action); // create, update, delete
  console.log(e.record);
});
```

### Autenticación

```javascript
// Registrar
const user = await pb.collection('users').create({
  email: 'test@example.com',
  password: 'password123',
  passwordConfirm: 'password123',
  name: 'Test User'
});

// Login
const authData = await pb.collection('users').authWithPassword(
  'test@example.com',
  'password123'
);

// Usuario actual
console.log(pb.authStore.model); // Usuario logueado
console.log(pb.authStore.token); // JWT token

// Logout
pb.authStore.clear();
```

---

## 3. Appwrite - Self-Hosted o Cloud GRATIS

### Por qué Appwrite?
- Cloud GRATIS hasta 75k usuarios/mes
- O auto-hospedado 100% gratis
- Base de datos, autenticación, storage, funciones
- APIs REST y SDKs oficiales
- Dashboard completo

### Instalación

```bash
npm install appwrite
```

### Configuración

```javascript
import { Client, Databases, Account } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('YOUR_PROJECT_ID');

export const databases = new Databases(client);
export const account = new Account(client);
```

### CRUD

```javascript
// CREATE
const doc = await databases.createDocument(
  'DATABASE_ID',
  'COLLECTION_ID',
  'unique()',
  { nombre: 'Boveda Monte', capital_actual: 850000 }
);

// READ
const docs = await databases.listDocuments('DATABASE_ID', 'COLLECTION_ID');

// UPDATE
await databases.updateDocument('DATABASE_ID', 'COLLECTION_ID', 'DOC_ID', {
  capital_actual: 900000
});

// DELETE
await databases.deleteDocument('DATABASE_ID', 'COLLECTION_ID', 'DOC_ID');
```

---

## Comparación de Alternativas

| Característica | Firebase | PocketBase | Appwrite |
|---------------|----------|------------|----------|
| **Precio** | Gratis hasta límites | 100% Gratis | Gratis hasta 75k usuarios |
| **Hosting** | Incluido | Auto-hospedado | Cloud o auto-hospedado |
| **Base de Datos** | Firestore (NoSQL) | SQLite | MariaDB |
| **Tiempo Real** | ✅ Sí | ✅ Sí | ✅ Sí |
| **Autenticación** | ✅ Completa | ✅ Completa | ✅ Completa |
| **OAuth Social** | ✅ Google, Facebook, etc. | ⚠️ Limitado | ✅ Múltiples |
| **Storage** | ✅ 5GB gratis | ✅ Ilimitado | ✅ Incluido |
| **Admin UI** | ✅ Console web | ✅ UI automático | ✅ Dashboard |
| **Facilidad** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Documentación** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Escalabilidad** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## RECOMENDACIÓN FINAL

### Para este proyecto: **FIREBASE** 🔥

**Razones:**
1. ✅ Configuración en 5 minutos
2. ✅ No necesitas servidor propio
3. ✅ Límites generosos (50k lecturas/día)
4. ✅ Hosting gratis incluido
5. ✅ Autenticación con Google/Facebook lista
6. ✅ Documentación excelente en español
7. ✅ Tiempo real perfecto para tus apps
8. ✅ No necesitas tarjeta de crédito

### Migración desde localStorage

```javascript
// ANTES (localStorage)
const [bancos, setBancos] = useLocalStorage('bancos', []);

// DESPUÉS (Firebase)
const [bancos, setBancos] = useState([]);

useEffect(() => {
  const cargarBancos = async () => {
    const data = await obtenerBancos();
    setBancos(data);
  };
  cargarBancos();
}, []);
```

---

## Próximos Pasos

1. **Elegir Firebase** (recomendado)
2. Crear proyecto en https://console.firebase.google.com/
3. Instalar: `npm install firebase`
4. Copiar configuración a `.env`
5. Crear `src/lib/firebase.js`
6. Crear `src/services/firebaseService.js`
7. Reemplazar `useLocalStorage` por Firebase
8. Agregar autenticación

¿Quieres que implemente Firebase en tus apps ahora?
