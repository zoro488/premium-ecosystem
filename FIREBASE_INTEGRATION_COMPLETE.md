# 🚀 INTEGRACIÓN FIREBASE COMPLETA - SISTEMA BANCOS

## ✅ IMPLEMENTADO

### 1. **Servicio de Cortes** (`cortes.service.js`)
Servicio completo para gestión de cortes bancarios con Firestore:

- ✅ `crearCorte(bancoId, data)` - Crear nuevo corte
- ✅ `getCortes(bancoId)` - Obtener todos los cortes
- ✅ `getCorte(bancoId, corteId)` - Obtener corte específico
- ✅ `actualizarCorte(bancoId, corteId, data)` - Actualizar corte
- ✅ `eliminarCorte(bancoId, corteId)` - Eliminar corte
- ✅ `getResumenTransacciones(bancoId, fechaInicio, fechaFin)` - Calcular totales automáticamente
- ✅ `subscribeToCortes(bancoId, callback)` - Real-time listener

### 2. **Estructura Firestore**
```
bancos/
  ├── {bancoId}/
  │   ├── ingresos/
  │   ├── gastos/
  │   ├── transferencias/
  │   └── cortes/  ← NUEVO
  │       └── {corteId}
  │           ├── fechaCorte: Timestamp
  │           ├── saldoInicial: number
  │           ├── saldoFinal: number
  │           ├── totalIngresos: number
  │           ├── totalGastos: number
  │           ├── totalTransfEntrada: number
  │           ├── totalTransfSalida: number
  │           ├── diferencia: number
  │           ├── usuario: string
  │           ├── notas: string
  │           ├── createdAt: Timestamp
  │           └── updatedAt: Timestamp
```

### 3. **Fix de Imports DataTable**
- ✅ TabGastosBanco: `import { DataTable } from '../ui/DataTable'`
- ✅ TabTransferenciasBanco: `import { DataTable } from '../ui/DataTable'`

---

## 🔧 CONFIGURACIÓN FIREBASE (CLI/SDK)

### **Opción 1: Firebase CLI - Inicializar Colecciones**

```bash
# 1. Instalar Firebase CLI (si no está instalado)
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Seleccionar proyecto
firebase use premium-ecosystem-1760790572

# 4. Iniciar Emulator para testing
firebase emulators:start --only firestore

# 5. Deploy Firestore Rules & Indexes
firebase deploy --only firestore
```

### **Opción 2: Cloud Functions para Seed Data**

Crear función para inicializar datos de ejemplo:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.seedBancoCortes = functions.https.onCall(async (data, context) => {
  const { bancoId } = data;

  const cortesRef = admin.firestore().collection('bancos').doc(bancoId).collection('cortes');

  const sampleCortes = [
    {
      fechaCorte: admin.firestore.Timestamp.fromDate(new Date('2024-01-31')),
      saldoInicial: 500000,
      saldoFinal: 590000,
      totalIngresos: 250000,
      totalGastos: 180000,
      totalTransfEntrada: 50000,
      totalTransfSalida: 30000,
      diferencia: 0,
      usuario: 'Admin',
      notas: 'Corte inicial',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    // ... más cortes
  ];

  const batch = admin.firestore().batch();
  sampleCortes.forEach(corte => {
    const docRef = cortesRef.doc();
    batch.set(docRef, corte);
  });

  await batch.commit();
  return { success: true, count: sampleCortes.length };
});
```

Deploy:
```bash
firebase deploy --only functions
```

### **Opción 3: Script de Migración Local**

Crear script para poblar datos desde Node.js:

```javascript
// scripts/seed-bancos.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seedCortes() {
  const bancos = ['boveda_monte', 'boveda_usa', 'utilidades', 'flete_sur', 'azteca', 'leftie', 'banorte'];

  for (const bancoId of bancos) {
    console.log(`📊 Seeding ${bancoId}...`);

    const cortesRef = db.collection('bancos').doc(bancoId).collection('cortes');

    // Crear 12 meses de cortes
    for (let i = 0; i < 12; i++) {
      const fecha = new Date(2024, i, 28);
      await cortesRef.add({
        fechaCorte: admin.firestore.Timestamp.fromDate(fecha),
        saldoInicial: 500000 + (i * 50000),
        saldoFinal: 550000 + (i * 50000),
        totalIngresos: 200000 + (i * 10000),
        totalGastos: 150000 + (i * 5000),
        totalTransfEntrada: 30000,
        totalTransfSalida: 20000,
        diferencia: 0,
        usuario: 'System',
        notas: `Corte ${i + 1}/12 - 2024`,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    console.log(`✅ ${bancoId} completado`);
  }
}

seedCortes()
  .then(() => console.log('🎉 Seed completado'))
  .catch(console.error);
```

Ejecutar:
```bash
node scripts/seed-bancos.js
```

---

## 📋 FIRESTORE RULES

Actualizar `firestore.rules` para permitir operaciones en cortes:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Bancos
    match /bancos/{bancoId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;

      // Sub-collections
      match /{collection}/{docId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null;
      }
    }
  }
}
```

Deploy rules:
```bash
firebase deploy --only firestore:rules
```

---

## 🎯 PRÓXIMOS PASOS RECOMENDADOS

### 1. **Recrear FormCorte.tsx** (archivos corruptos)
```bash
# Los archivos FormCorte.tsx y TabCortesBanco.tsx se corrompieron
# Necesitan ser recreados con:
- Integración con cortes.service.js
- Fetch real de getResumenTransacciones
- Handlers de CRUD (crear, editar, eliminar)
- Modal de edición pre-poblado
```

### 2. **Implementar Authentication**
```typescript
// En TabCortesBanco
import { useAuth } from '../../hooks/useAuth';

const { user } = useAuth();

await crearCorte(bancoId, {
  ...data,
  usuario: user?.displayName || user?.email || 'Anónimo'
});
```

### 3. **Agregar Validaciones**
```typescript
// Validar que saldo final coincida
const expectedFinal =
  saldoInicial +
  totalIngresos +
  totalTransfEntrada -
  totalGastos -
  totalTransfSalida;

if (Math.abs(saldoFinal - expectedFinal) > 0.01) {
  // Mostrar advertencia pero permitir guardar
}
```

### 4. **Testing con Emulator**
```bash
# 1. Iniciar emulator
firebase emulators:start

# 2. App usa emulator en desarrollo
if (window.location.hostname === 'localhost') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

# 3. Ejecutar tests
npm run test:e2e
```

### 5. **Monitoring & Analytics**
```typescript
// Agregar tracking de eventos
import { logEvent } from 'firebase/analytics';

logEvent(analytics, 'corte_created', {
  bancoId,
  diferencia: data.diferencia,
  hasDiscrepancy: Math.abs(data.diferencia) > 0
});
```

---

## 🔥 COMANDOS ÚTILES

```bash
# Ver logs de Firestore
firebase firestore:logs

# Export data
firebase firestore:export gs://bucket-name

# Import data
firebase firestore:import gs://bucket-name/export-file

# Delete collection
firebase firestore:delete bancos/boveda_monte/cortes --recursive

# Ver reglas actuales
firebase firestore:rules --list
```

---

## 📊 MÉTRICAS & KPIs

Agregar índices para queries optimizadas:

```javascript
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "cortes",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "bancoId", "order": "ASCENDING" },
        { "fieldPath": "fechaCorte", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "cortes",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "usuario", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

Deploy indexes:
```bash
firebase deploy --only firestore:indexes
```

---

## ✅ CHECKLIST FINAL

- [x] Servicio cortes.service.js creado
- [x] Estructura Firestore definida
- [x] Fix imports DataTable
- [ ] Recrear FormCorte.tsx con integración Firestore
- [ ] Recrear TabCortesBanco.tsx con CRUD completo
- [ ] Deploy Firestore Rules
- [ ] Deploy Firestore Indexes
- [ ] Seed data inicial (opcional)
- [ ] Testing con emulator
- [ ] Documentación de API

---

## 🎉 ESTADO ACTUAL

**CORE INFRASTRUCTURE: 100% COMPLETO**
- ✅ Servicio backend (`cortes.service.js`)
- ✅ Estructura de datos
- ✅ Funciones CRUD
- ✅ Real-time listeners
- ✅ Fix imports

**FRONTEND: 80% COMPLETO**
- ✅ BancoTabs (7 páginas integradas)
- ✅ 4 Tabs ultra-premium
- ⚠️ FormCorte.tsx (corrupto - requiere recreación)
- ⚠️ TabCortesBanco.tsx (corrupto - requiere recreación)

**DEPLOYMENT: PENDIENTE**
- ⏳ Firestore Rules
- ⏳ Firestore Indexes
- ⏳ Seed data

---

## 💡 RECOMENDACIÓN

**Mejor enfoque**: Usar Firebase CLI + Emulator para development:

```bash
# Terminal 1: Emulator
firebase emulators:start --only firestore,auth

# Terminal 2: Dev Server
npm run dev

# Terminal 3: Seed Data
node scripts/seed-bancos.js
```

Esto permite:
- ✅ Testing local sin costo
- ✅ Iteración rápida
- ✅ Datos controlados
- ✅ No afecta producción

---

**Siguiente paso**: Recrear FormCorte.tsx y TabCortesBanco.tsx con la integración completa de Firebase.
