# 🔥 Sistema de Importación CSV → Firestore

## 📚 Documentación Completa

Sistema profesional de importación de datos empresariales desde archivos CSV a Firebase Firestore, optimizado para el ecosistema **Chronos-System Premium**.

---

## ⚡ Quick Start (3 Pasos)

```bash
# 1. Instalar dependencias
npm install

# 2. Validar archivos CSV
npm run validate:csv

# 3. Importar a Firestore
npm run import:csv
```

---

## 📋 Tabla de Contenidos

1. [Características](#-características)
2. [Requisitos](#-requisitos)
3. [Instalación](#-instalación)
4. [Estructura de Archivos](#-estructura-de-archivos)
5. [Configuración](#-configuración)
6. [Uso](#-uso)
7. [Scripts Disponibles](#-scripts-disponibles)
8. [Troubleshooting](#-troubleshooting)
9. [FAQ](#-faq)

---

## 🚀 Características

### ✅ Funcionalidades Core
- ✨ **TypeScript**: Type safety completo
- 🔥 **Firebase Admin SDK**: Conexión nativa a Firestore
- 📊 **Progress Tracking**: Barra de progreso en tiempo real
- 🎨 **Logging Colorido**: Output visual con chalk
- 📝 **Logs Persistentes**: Guardado automático en `/logs/`
- 🛡️ **Error Handling**: Manejo robusto de errores
- 🔄 **Batch Operations**: Importación masiva optimizada (500 docs/batch)

### 📦 Colecciones Generadas
1. **bancos** (7 documentos) - Cuentas bancarias con saldos
2. **gastos** (N documentos) - Gastos operativos reales
3. **transferencias** (N documentos) - Movimientos entre bancos
4. **clientes** (N documentos) - Clientes con deudas/abonos
5. **distribuidores** (N documentos) - Proveedores con pagos
6. **ordenesCompra** (N documentos) - Órdenes de compra históricas
7. **ventas** (N documentos) - Registro de ventas
8. **productos** (1 documento) - Producto principal
9. **estadoGlobal/almacen** (1 documento) - Estado del almacén

### 🔍 Validaciones Automáticas
- Conversión de moneda: `"$1,500.00"` → `1500`
- Normalización de bancos: `"Bóveda Monte"` → `"bovedamonte"`
- Detección inteligente: Gasto vs Transferencia
- Generación de IDs únicos
- Manejo de campos vacíos/undefined
- Timestamps automáticos

---

## 🎯 Requisitos

### Software
- ✅ Node.js **18+**
- ✅ npm/yarn/pnpm
- ✅ Cuenta Firebase con Firestore habilitado
- ✅ Service Account Key de Firebase

### Archivos CSV (12 archivos)
```
data/csv/
├── Copia de Administación_General - Clientes.csv
├── Copia de Administación_General - Distribuidores.csv
├── Copia de Administación_General - Control_Maestro.csv
├── Copia de Administación_General - Almacen_Monte.csv
├── Copia de Administación_General - Bóveda_Monte.csv
├── Copia de Administación_General - Bóveda_USA.csv
├── Copia de Administación_General - Profit.csv
├── Copia de Administación_General - Leftie.csv
├── Copia de Administación_General - Flete_Sur.csv
├── Copia de Administación_General - Utilidades.csv
└── Copia de Administación_General - Azteca.csv
```

---

## 📦 Instalación

### 1. Clonar/Descargar Proyecto
```bash
git clone https://github.com/tu-repo/premium-ecosystem.git
cd premium-ecosystem
```

### 2. Instalar Dependencias
```bash
npm install

# O con yarn
yarn install

# O con pnpm
pnpm install
```

### 3. Dependencias Adicionales (si no se instalaron)
```bash
npm install firebase-admin csv-parser chalk ora cli-progress
npm install --save-dev @types/node ts-node typescript
```

---

## 📁 Estructura de Archivos

```
premium-ecosystem/
│
├── scripts/
│   ├── importar-csv-firestore.ts       # 🔥 Script principal
│   ├── validar-csv.ts                  # ✅ Validador de CSVs
│   ├── test-connection.ts              # 🧪 Test de conexión
│   ├── ESTRUCTURA_CSV_ESPERADA.ts      # 📋 Documentación de estructura
│   └── README_IMPORTACION.md           # 📚 Guía detallada
│
├── data/
│   ├── csv/                            # 📁 Coloca aquí los 12 CSVs
│   │   ├── .gitkeep
│   │   └── (archivos CSV aquí)
│   ├── backups/                        # 💾 Backups automáticos
│   └── .gitignore                      # 🔒 Ignora datos sensibles
│
├── firebase/
│   ├── serviceAccountKey.json          # 🔐 Credenciales (NO subir a git)
│   ├── firestore.rules                 # 🛡️ Reglas de seguridad
│   └── .gitkeep
│
├── logs/
│   ├── .gitkeep
│   └── import-2025-*.log               # 📝 Logs de importación
│
└── package.json                        # 📦 Scripts npm
```

---

## 🔧 Configuración

### 1. Obtener Service Account Key

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. **⚙️ Configuración del proyecto** > **Cuentas de servicio**
4. Click en **Generar nueva clave privada**
5. Descarga el archivo JSON
6. Renómbralo a: `serviceAccountKey.json`
7. Colócalo en: `firebase/serviceAccountKey.json`

### 2. Configurar URL de Firebase

**Opción A: Variable de entorno** (Recomendado)

Crea `.env` en la raíz:
```env
FIREBASE_DATABASE_URL=https://tu-proyecto.firebaseio.com
```

**Opción B: Editar script directamente**

En `scripts/importar-csv-firestore.ts` línea 154:
```typescript
databaseURL: "https://tu-proyecto.firebaseio.com"
```

### 3. Colocar Archivos CSV

```bash
# Windows PowerShell
Move-Item "C:\Downloads\*.csv" ".\data\csv\"

# Mac/Linux
mv ~/Downloads/*.csv ./data/csv/
```

---

## 🚀 Uso

### Flujo Completo (4 Pasos)

#### 1️⃣ Test de Conexión
```bash
npm run test:connection
```
Verifica que Firebase esté configurado correctamente.

#### 2️⃣ Validar CSVs
```bash
npm run validate:csv
```
Verifica que todos los archivos existan y tengan la estructura correcta.

#### 3️⃣ Importar Datos
```bash
npm run import:csv
```
Ejecuta la importación completa a Firestore.

#### 4️⃣ Verificar en Firebase Console
1. Abre [Firebase Console](https://console.firebase.google.com/)
2. Ve a **Firestore Database**
3. Verifica que las 9 colecciones se crearon correctamente

---

## 📜 Scripts Disponibles

### Importación
```bash
# Importar datos CSV a Firestore
npm run import:csv

# Validar archivos CSV antes de importar
npm run validate:csv

# Test de conexión a Firebase
npm run test:connection
```

### Otros Scripts Útiles
```bash
# Desarrollo
npm run dev                    # Iniciar servidor dev

# Testing
npm run test                   # Tests unitarios
npm run test:e2e               # Tests E2E

# Linting
npm run lint                   # ESLint
npm run lint:fix               # Fix automático

# Firebase
npm run emulator:start         # Iniciar emulador local
```

---

## 🎯 Output Esperado

Durante la importación verás algo como:

```
════════════════════════════════════════════════════════════════════
     🔥 IMPORTACIÓN AVANZADA CSV → FIRESTORE 🔥
════════════════════════════════════════════════════════════════════

[2025-11-14T10:30:00.000Z] 🔌 Inicializando conexión a Firebase...
[2025-11-14T10:30:01.234Z] ✅ Conexión a Firebase establecida correctamente

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
  📝 Log guardado en:        ./logs/import-2025-11-14T10-30-00.log

════════════════════════════════════════════════════════════════════

✅ IMPORTACIÓN COMPLETADA EXITOSAMENTE
```

---

## 🔧 Troubleshooting

### ❌ Error: "Archivo no encontrado"

**Problema:** No encuentra un CSV.

**Solución:**
```bash
# Verifica que los archivos existan
ls data/csv/

# Verifica nombres exactos (incluyendo espacios y tildes)
```

### ❌ Error: "Cannot find module 'csv-parser'"

**Problema:** Dependencias no instaladas.

**Solución:**
```bash
npm install
```

### ❌ Error: "serviceAccountKey.json no encontrado"

**Problema:** Falta el service account.

**Solución:**
1. Descarga desde Firebase Console
2. Renombra a `serviceAccountKey.json`
3. Coloca en `firebase/serviceAccountKey.json`

### ❌ Error: "PERMISSION_DENIED"

**Problema:** Firestore Rules bloquean la escritura.

**Solución Temporal:**
1. Firebase Console → Firestore → Rules
2. Cambia a:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ Solo para importación
    }
  }
}
```
3. Ejecuta la importación
4. **🚨 IMPORTANTE:** Restaura las reglas de producción después

### ❌ Error: "ECONNREFUSED" o "Network Error"

**Problema:** No puede conectar a Firebase.

**Solución:**
1. Verifica tu conexión a internet
2. Verifica que Firebase esté activo
3. Prueba: `ping firestore.googleapis.com`

### ❌ Los datos no aparecen en Chronos-System

**Problema:** Estructura de datos incorrecta.

**Solución:**
1. Verifica en Firebase Console que las colecciones se crearon
2. Compara nombres de colecciones:
   - Frontend espera: `bancos`, `gastos`, `transferencias`, etc.
   - Verifica que coincidan exactamente (case-sensitive)
3. Revisa que los campos tengan los nombres correctos

---

## ❓ FAQ

### ¿Cuánto tiempo toma la importación?

Depende de la cantidad de datos:
- **100 documentos**: ~5 segundos
- **500 documentos**: ~10-15 segundos
- **1000+ documentos**: ~30-60 segundos

### ¿Puedo importar varias veces?

Sí, pero los documentos se **sobrescribirán** si usan el mismo ID.

Para limpiar Firestore antes de reimportar:
```bash
firebase firestore:delete --all-collections
```

### ¿Es seguro subir este código a GitHub?

✅ **SÍ**, siempre que:
- No subas `serviceAccountKey.json`
- No subas los archivos CSV con datos reales
- No subas logs con información sensible

El `.gitignore` ya está configurado para ignorar estos archivos.

### ¿Funciona con el emulador de Firebase?

Sí, cambia la URL en `.env`:
```env
FIREBASE_DATABASE_URL=http://localhost:8080
```

Y ejecuta:
```bash
npm run emulator:start
npm run import:csv
```

### ¿Cómo puedo personalizar la estructura?

Edita `scripts/importar-csv-firestore.ts`:
- Modifica las interfaces de TypeScript
- Ajusta las funciones `procesarXXX()`
- Cambia los nombres de colecciones

### ¿Qué pasa si un CSV tiene estructura diferente?

El validador te mostrará los errores. Debes:
1. Ejecutar `npm run validate:csv`
2. Ver qué columnas faltan
3. Ajustar el CSV o el script

---

## 📚 Referencias

- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firestore Batch Operations](https://firebase.google.com/docs/firestore/manage-data/transactions)
- [CSV Parser npm](https://www.npmjs.com/package/csv-parser)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

---

## 🆘 Soporte

Si encuentras problemas:

1. **Revisa los logs** en `/logs/`
2. **Ejecuta el validador** con `npm run validate:csv`
3. **Verifica Firebase Console** manualmente
4. **Contacta** al equipo de desarrollo

---

## 📝 Changelog

### v2.0.0 (2025-11-14)
- ✅ Reescritura completa en TypeScript
- ✅ Logging profesional con chalk + ora
- ✅ Validador de CSVs independiente
- ✅ Test de conexión a Firebase
- ✅ Progress tracking en tiempo real
- ✅ Manejo robusto de errores
- ✅ Documentación completa
- ✅ Scripts npm optimizados

### v1.0.0 (Original)
- Script básico en JavaScript
- Importación funcional pero sin validaciones

---

**🔥 Creado con ❤️ por el equipo de Premium Ecosystem**

**Compatible con Chronos-System Awwwards 2025 Level**
