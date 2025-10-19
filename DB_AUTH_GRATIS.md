# 🎉 Base de Datos + Autenticación 100% GRATIS

## ✅ SÍ, es posible tener DB real + Auth completamente GRATIS

Hay varias opciones excelentes que ofrecen planes gratuitos generosos.

---

## 🏆 OPCIÓN RECOMENDADA: Supabase (GRATIS para siempre)

### ✅ Plan Gratis Incluye:

- ✅ **500 MB de PostgreSQL** (base de datos)
- ✅ **1 GB de archivos** (storage)
- ✅ **2 GB de ancho de banda** por mes
- ✅ **50,000 usuarios activos** mensuales
- ✅ **Autenticación completa** (email, Google, GitHub, etc.)
- ✅ **Realtime subscriptions** (actualizaciones en tiempo real)
- ✅ **Row Level Security** (seguridad avanzada)
- ✅ **API REST automática**
- ✅ **Sin tarjeta de crédito requerida**

### 🚀 Configuración en 5 Minutos:

#### Paso 1: Crear Cuenta
```
1. Ve a: https://supabase.com
2. Click en "Start your project"
3. Sign up con GitHub (gratis)
4. Create new project
```

#### Paso 2: Obtener Credenciales
```
1. Ve a Project Settings > API
2. Copia:
   - Project URL
   - anon/public key
```

#### Paso 3: Agregar al .env
```env
VITE_SUPABASE_URL=https://tuproyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Paso 4: Instalar Cliente
```bash
npm install @supabase/supabase-js
```

#### Paso 5: Crear Cliente en tu App
```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 📊 Crear Tablas (Super Fácil)

### Opción 1: UI Visual
```
1. Ve a Table Editor en Supabase Dashboard
2. Click "New table"
3. Agrega columnas con clicks
4. Click "Save"
```

### Opción 2: SQL Editor
```sql
-- Ejemplo: Tabla de bancos para FlowDistributor
CREATE TABLE bancos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  nombre TEXT NOT NULL,
  capital_actual DECIMAL(10,2),
  historico DECIMAL(10,2),
  registros JSONB,
  gastos JSONB,
  transferencias JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabla de wallets para ShadowPrime
CREATE TABLE wallets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  type TEXT,
  address TEXT UNIQUE,
  balance DECIMAL(20,8),
  balance_usd DECIMAL(10,2),
  assets JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabla de vehículos para Apollo
CREATE TABLE vehicles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  plate TEXT,
  driver TEXT,
  status TEXT,
  location JSONB,
  battery INTEGER,
  fuel INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabla de conversaciones para Synapse
CREATE TABLE conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  model TEXT,
  messages JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

### Opción 3: Desde tu App (Automático)
Supabase crea las tablas automáticamente cuando insertas datos.

---

## 🔐 Autenticación GRATIS

### Email + Password
```javascript
// Registro
const { data, error } = await supabase.auth.signUp({
  email: 'usuario@email.com',
  password: 'contraseña123',
})

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'usuario@email.com',
  password: 'contraseña123',
})

// Logout
await supabase.auth.signOut()

// Usuario actual
const { data: { user } } = await supabase.auth.getUser()
```

### OAuth (Google, GitHub, etc.) - GRATIS
```javascript
// Login con Google
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
})

// Login con GitHub
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
})
```

### Configurar OAuth:
```
1. Authentication > Providers en Dashboard
2. Enable Google o GitHub
3. Agrega Client ID y Secret
4. ¡Listo!
```

---

## 💾 CRUD Operations (Crear, Leer, Actualizar, Eliminar)

### Crear (INSERT)
```javascript
const { data, error } = await supabase
  .from('bancos')
  .insert({
    nombre: 'Boveda Monte',
    capital_actual: 850000,
    historico: 1200000,
    registros: [],
    gastos: [],
    transferencias: []
  })
```

### Leer (SELECT)
```javascript
// Todos los registros
const { data, error } = await supabase
  .from('bancos')
  .select('*')

// Con filtros
const { data, error } = await supabase
  .from('bancos')
  .select('*')
  .eq('nombre', 'Boveda Monte')

// Paginación
const { data, error } = await supabase
  .from('bancos')
  .select('*')
  .range(0, 9) // Primeros 10
```

### Actualizar (UPDATE)
```javascript
const { data, error } = await supabase
  .from('bancos')
  .update({ capital_actual: 900000 })
  .eq('id', 'banco-id')
```

### Eliminar (DELETE)
```javascript
const { data, error } = await supabase
  .from('bancos')
  .delete()
  .eq('id', 'banco-id')
```

---

## 🔥 Realtime (Actualizaciones en Tiempo Real) - GRATIS

```javascript
// Escuchar cambios en tiempo real
const channel = supabase
  .channel('bancos-changes')
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT, UPDATE, DELETE
      schema: 'public',
      table: 'bancos'
    },
    (payload) => {
      console.log('Cambio detectado:', payload)
      // Actualiza tu UI automáticamente
    }
  )
  .subscribe()
```

---

## 🔒 Row Level Security (Seguridad) - GRATIS

```sql
-- Los usuarios solo ven sus propios datos
ALTER TABLE bancos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bancos"
  ON bancos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bancos"
  ON bancos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bancos"
  ON bancos FOR UPDATE
  USING (auth.uid() = user_id);
```

---

## 📁 Storage (Archivos/Imágenes) - GRATIS

```javascript
// Upload archivo
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('user1.png', file)

// Download archivo
const { data } = await supabase.storage
  .from('avatars')
  .download('user1.png')

// Get URL pública
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('user1.png')
```

---

## 🎯 ALTERNATIVAS GRATIS

### Opción 2: Firebase (Google) - GRATIS

**Plan Spark (Free):**
- ✅ 1 GB de Firestore (NoSQL)
- ✅ 10 GB de Storage
- ✅ 50k lecturas/día
- ✅ Auth ilimitada (50,000 usuarios)
- ✅ OAuth gratis (Google, Facebook, etc.)

**Setup:**
```bash
npm install firebase
```

```javascript
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "tu-app.firebaseapp.com",
  projectId: "tu-proyecto-id",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
```

---

### Opción 3: PocketBase (100% GRATIS, Self-hosted)

**Ventajas:**
- ✅ Completamente gratis
- ✅ Un solo archivo ejecutable
- ✅ DB + Auth + Files + Realtime
- ✅ Admin UI incluida
- ✅ Sin límites

**Setup:**
```bash
# Descargar PocketBase
# Ejecutar localmente o en servidor gratis (Fly.io, Railway)
./pocketbase serve
```

**API:**
```javascript
import PocketBase from 'pocketbase'

const pb = new PocketBase('http://127.0.0.1:8090')

// Crear
await pb.collection('bancos').create(data)

// Leer
const records = await pb.collection('bancos').getFullList()

// Auth
await pb.collection('users').authWithPassword(email, password)
```

---

### Opción 4: Appwrite (GRATIS Cloud)

**Plan Cloud Gratis:**
- ✅ 75k requests/mes
- ✅ 2 GB bandwidth
- ✅ 1 GB storage
- ✅ Auth completa
- ✅ Realtime
- ✅ Functions

---

## 📊 COMPARACIÓN GRATIS

| Característica | Supabase | Firebase | PocketBase | Appwrite |
|----------------|----------|----------|------------|----------|
| **DB SQL** | ✅ Postgres | ❌ NoSQL | ✅ SQLite | ❌ NoSQL |
| **Storage** | 1 GB | 10 GB | ∞ (local) | 1 GB |
| **Auth** | ✅ | ✅ | ✅ | ✅ |
| **Realtime** | ✅ | ✅ | ✅ | ✅ |
| **Admin UI** | ✅ Excelente | ⚠️ Básica | ✅ Excelente | ✅ Buena |
| **OAuth** | ✅ | ✅ | ✅ | ✅ |
| **Setup** | 5 min | 10 min | 2 min | 15 min |
| **Self-host** | ❌ | ❌ | ✅ | ✅ |

---

## 🚀 IMPLEMENTACIÓN EN TU APP

### Ejemplo Completo: FlowDistributor con Supabase

```javascript
// src/services/bancos.js
import { supabase } from '../lib/supabase'

export const bancosService = {
  // Obtener todos los bancos del usuario
  async getAll() {
    const { data, error } = await supabase
      .from('bancos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Crear banco
  async create(banco) {
    const { data, error } = await supabase
      .from('bancos')
      .insert(banco)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Actualizar banco
  async update(id, updates) {
    const { data, error } = await supabase
      .from('bancos')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Eliminar banco
  async delete(id) {
    const { error } = await supabase
      .from('bancos')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
```

### Usar en Componente

```javascript
import { useState, useEffect } from 'react'
import { bancosService } from '../services/bancos'

function FlowDistributor() {
  const [bancos, setBancos] = useState([])
  const [loading, setLoading] = useState(true)

  // Cargar datos al iniciar
  useEffect(() => {
    loadBancos()
  }, [])

  async function loadBancos() {
    try {
      const data = await bancosService.getAll()
      setBancos(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function agregarBanco(nuevoBanco) {
    try {
      const banco = await bancosService.create(nuevoBanco)
      setBancos([...bancos, banco])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // ... resto del componente
}
```

---

## 🔐 Componente de Auth

```javascript
// src/components/Auth.jsx
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) alert(error.message)
  }

  async function handleSignUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) alert(error.message)
    else alert('Check your email!')
  }

  return (
    <div className="glass p-8 rounded-xl max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 rounded-lg mb-4 bg-white/10"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 rounded-lg mb-4 bg-white/10"
      />

      <button onClick={handleLogin} className="btn-premium w-full mb-2">
        Login
      </button>

      <button onClick={handleSignUp} className="btn-premium w-full">
        Sign Up
      </button>
    </div>
  )
}
```

---

## 🎯 MIGRAR DE localStorage A Supabase

### Paso 1: Exportar datos actuales
```javascript
// Ejecuta esto en la consola del navegador
const data = {
  bancos: localStorage.getItem('flow_bancos'),
  wallets: localStorage.getItem('shadow_wallets'),
  vehicles: localStorage.getItem('apollo_vehicles'),
  // ... etc
}
console.log(JSON.stringify(data))
// Copia el output
```

### Paso 2: Importar a Supabase
```javascript
// Script de migración
import { supabase } from './lib/supabase'

async function migrate() {
  const oldData = JSON.parse(localStorage.getItem('flow_bancos'))

  for (const banco of Object.values(oldData)) {
    await supabase.from('bancos').insert({
      nombre: banco.nombre,
      capital_actual: banco.capitalActual,
      // ... mapear campos
    })
  }
}
```

---

## 💰 COSTO FINAL

### Supabase Free Tier:
- ✅ DB + Auth + Storage + Realtime
- ✅ **$0/mes para siempre**
- ✅ 500 MB DB (suficiente para >50,000 registros)
- ✅ 50,000 usuarios
- ✅ Sin tarjeta de crédito

### Si creces mucho (opcional):
- **Pro**: $25/mes (8 GB DB, 100 GB storage, 50 GB bandwidth)
- Pero el free tier es suficiente para empezar

---

## ✅ RESUMEN

**SÍ, puedes tener DB real + Auth completamente GRATIS con:**

1. **Supabase** (Recomendado)
   - Setup: 5 minutos
   - Costo: $0
   - Límites: Muy generosos

2. **Firebase** (Alternativa)
   - Setup: 10 minutos
   - Costo: $0
   - Límites: Excelentes

3. **PocketBase** (Self-hosted)
   - Setup: 2 minutos
   - Costo: $0
   - Límites: Ninguno

---

## 🚀 PRÓXIMOS PASOS

1. Crea cuenta en Supabase (sin tarjeta)
2. Copia las credenciales al .env
3. Instala el cliente: `npm install @supabase/supabase-js`
4. Crea las tablas en el dashboard
5. ¡Empieza a usar DB real!

**Todo GRATIS para siempre** 🎉
