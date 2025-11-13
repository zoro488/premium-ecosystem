# 🔥 MIGRACIÓN MASIVA A FIRESTORE - CHRONOS SYSTEM

## 📋 RESUMEN EJECUTIVO

Este script migra **TODOS los datos** del archivo Excel unificado (`datos_bovedas_completos.json`) a Firestore en tiempo real para los **7 BANCOS COMPLETOS** del sistema FlowDistributor CHRONOS.

## 🏦 BANCOS MIGRADOS (7 Bancos Completos)

### 1. **Almacén Monte** (3 colecciones)

- `almacen_monte_ordenes` - Órdenes de Compra
- `almacen_monte_salidas` - Salidas de almacén
- `almacen_monte_cortes` - Cortes de almacén

### 2. **Bóveda Monte** (3 colecciones)

- `boveda_monte_ingresos` - Ventas e Ingresos
- `boveda_monte_gastos` - Gastos y Salidas
- `boveda_monte_cortes` - Cortes de caja

### 3. **Bóveda USA** (3 colecciones)

- `boveda_usa_ingresos` - Ingresos y Abonos (USD)
- `boveda_usa_gastos` - Gastos (USD)
- `boveda_usa_cortes` - Cortes de caja (USD)

### 4. **Azteca** (2 colecciones)

- `azteca_ingresos` - Ingresos
- `azteca_gastos` - Gastos

### 5. **Utilidades** (3 colecciones)

- `utilidades_ingresos` - Ingresos
- `utilidades_gastos` - Gastos
- `utilidades_cortes` - Cortes de caja

### 6. **Flete Sur** (3 colecciones)

- `flete_sur_ingresos` - Ingresos por fletes
- `flete_sur_gastos` - Gastos de fletes
- `flete_sur_cortes` - Cortes de caja

### 7. **Leftie** (3 colecciones)

- `leftie_ingresos` - Ingresos
- `leftie_gastos` - Gastos
- `leftie_cortes` - Cortes de caja

**TOTAL**: **21 colecciones** creadas en Firestore

---

## ⚙️ REQUISITOS PREVIOS

### 1. Habilitar Firestore API

**⚠️ IMPORTANTE**: Antes de ejecutar el script, debes habilitar la API de Firestore:

1. Ve a: [https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=chronos-system](https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=chronos-system)
2. Haz clic en **"ENABLE"** (Habilitar)
3. Espera 2-3 minutos para que se propague

### 2. Verificar Archivo JSON

Asegúrate de que el archivo existe en:

```text
src/data/datos_bovedas_completos.json
```

### 3. Node.js y Dependencias

```bash
node --version  # v18 o superior
npm install     # Instalar dependencias
```

---

## 🚀 EJECUCIÓN DEL SCRIPT

### Comando Principal

```bash
node scripts/migrate-to-firestore.js
```

### Salida Esperada

```text
╔════════════════════════════════════════════════════════════════╗
║   MIGRACIÓN MASIVA A FIRESTORE - CHRONOS FLOWDISTRIBUTOR     ║
╚════════════════════════════════════════════════════════════════╝

📂 Leyendo archivo: C:\...\datos_bovedas_completos.json
✅ JSON cargado exitosamente
📊 Total de paneles encontrados: 8

🚀 INICIANDO MIGRACIÓN...

══════════════════════════════════════════════════════════════════════
⚡ MIGRANDO: Almacen_Monte
══════════════════════════════════════════════════════════════════════
[09:27:07] [ALMACEN_MONTE] [ordenes] Iniciando migración de 9 órdenes...
✅ [ALMACEN_MONTE] [ordenes] Migrados 9 registros
[09:27:08] [ALMACEN_MONTE] [salidas] Iniciando migración de 123 salidas...
✅ [ALMACEN_MONTE] [salidas] Migrados 123 registros

🎉 ALMACEN_MONTE COMPLETADO: 132 registros migrados

... (continúa con los demás bancos)

╔══════════════════════════════════════════════════════════════════╗
║                    🎉 MIGRACIÓN COMPLETADA                       ║
╚══════════════════════════════════════════════════════════════════╝

📊 ESTADÍSTICAS FINALES:
   ├─ Total de bancos migrados: 7
   ├─ Total de registros: 3,456
   ├─ Colecciones creadas: ~21
   └─ Tiempo de ejecución: 45.23s

✅ Todos los datos han sido migrados exitosamente a Firestore
🔥 Firebase Project: chronos-system
📦 Las colecciones están listas para usarse con listeners en tiempo real
```

---

## 📊 ESTRUCTURA DE DATOS

### Almacén Monte

#### Ordenes de Compra

```javascript
{
  oc: "OC0001",              // ID de orden
  fecha: "2025-08-25",       // Fecha de orden
  distribuidor: "Q-MAYA",    // Nombre del distribuidor
  cantidad: 423,             // Cantidad de productos
  createdAt: Timestamp       // Fecha de creación en Firestore
}
```

#### Salidas

```javascript
{
  fecha: "2025-08-23",
  cliente: "Bódega M-P",
  cantidad: 150,
  concepto: "Venta local",
  observaciones: "",
  createdAt: Timestamp
}
```

### Bóveda Monte

#### Ingresos

```javascript
{
  fecha: "2025-08-23",
  cliente: "Ax",
  ingreso: 315000,           // Monto en pesos
  concepto: "",
  createdAt: Timestamp
}
```

#### Gastos

```javascript
{
  fecha: "2025-08-23",
  origenGastos: 0,
  gasto: 50000,              // Monto del gasto
  tc: 18.5,                  // Tipo de cambio
  pesos: 925000,             // Equivalente en pesos
  destino: "Proveedor XYZ",
  concepto: "Compra materia prima",
  observaciones: "",
  createdAt: Timestamp
}
```

### Bóveda USA

#### Ingresos (USD)

```javascript
{
  fecha: "2025-08-18",
  cliente: "",
  ingreso: 65919,            // Monto en USD
  tc: 18.5,                  // Tipo de cambio
  createdAt: Timestamp
}
```

#### Gastos (USD)

```javascript
{
  fecha: "2025-08-18",
  origenGastos: 0,
  gasto: 5000,               // Monto en USD
  tc: 18.5,
  destino: "Proveedor USA",
  concepto: "Compra",
  observaciones: "",
  createdAt: Timestamp
}
```

---

## 🔄 CARACTERÍSTICAS DEL SCRIPT

### 1. Batch Writing

- Usa **batch writes** de Firestore para eficiencia
- Máximo **500 operaciones por batch**
- Commits automáticos cuando se alcanza el límite

### 2. Limpieza de Datos

- Elimina valores `null`, `undefined` y strings vacíos
- Convierte strings numéricos a números
- Preserva la integridad de los datos

### 3. Timestamps Automáticos

- Cada documento incluye `createdAt` con `serverTimestamp()`
- Útil para ordenar y filtrar datos

### 4. Logging Detallado

- Logs por banco y tabla
- Contadores de progreso
- Reportes de éxito/error en tiempo real

### 5. Manejo de Errores

- Try-catch en cada función de migración
- Logs detallados de errores
- Exit codes apropiados (0 = éxito, 1 = error)

---

## 🛠️ SOLUCIÓN DE PROBLEMAS

### Error: `PERMISSION_DENIED`

**Causa**: Firestore API no está habilitada

**Solución**:

1. Habilita Firestore API en: [https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=chronos-system](https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=chronos-system)
2. Espera 2-3 minutos
3. Ejecuta el script nuevamente

### Error: `ENOENT: no such file`

**Causa**: Archivo JSON no encontrado

**Solución**:

```bash
# Verifica que el archivo exista
ls src/data/datos_bovedas_completos.json

# Si no existe, copia desde public/
cp public/datos_bovedas_completos.json src/data/
```

### Error: `Firebase quota exceeded`

**Causa**: Límite de escrituras gratuitas alcanzado

**Solución**:

- Verifica tu plan de Firebase (Spark/Blaze)
- Considera ejecutar el script en horarios de menor carga
- Revisa los límites en: [https://console.firebase.google.com/project/chronos-system/usage](https://console.firebase.google.com/project/chronos-system/usage)

---

## 📈 PRÓXIMOS PASOS

### 1. Verificar Migración en Firebase Console

```text
https://console.firebase.google.com/project/chronos-system/firestore
```

Revisa que las colecciones existan con datos

### 2. Actualizar Componentes a Firestore

Reemplaza las importaciones de JSON por listeners de Firestore:

```javascript
// ❌ ANTES (JSON estático)
import bovedaData from '@/data/boveda_monte.json'

// ✅ DESPUÉS (Firestore en tiempo real)
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/config/firebase'

onSnapshot(collection(db, 'boveda_monte_ingresos'), (snapshot) => {
  const ingresos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  // Actualizar estado...
})
```

### 3. Implementar CRUD Operations

Ver ejemplo en: `src/apps/FlowDistributor/chronos-system/components/bancos/PanelProfit.tsx`

```javascript
// CREATE
await addDoc(collection(db, 'boveda_monte_ingresos'), {
  fecha: '2025-11-13',
  cliente: 'Cliente XYZ',
  ingreso: 50000,
  concepto: 'Venta',
  createdAt: serverTimestamp()
})

// READ (con listener)
const unsubscribe = onSnapshot(
  collection(db, 'boveda_monte_ingresos'),
  (snapshot) => {
    setIngresos(snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })))
  }
)

// UPDATE
await updateDoc(doc(db, 'boveda_monte_ingresos', id), {
  ingreso: 60000,
  updatedAt: serverTimestamp()
})

// DELETE
await deleteDoc(doc(db, 'boveda_monte_ingresos', id))
```

### 4. Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

---

## 📝 NOTAS IMPORTANTES

1. **Backup**: Guarda una copia del JSON original antes de migrar
2. **Reversión**: Si algo sale mal, puedes volver a ejecutar el script (Firestore sobreescribirá datos existentes)
3. **Performance**: El script usa batches para máxima eficiencia, pero puede tomar 5-10 minutos con datos masivos
4. **Costos**: Verifica los límites del plan Spark (gratis) en Firebase
5. **Seguridad**: Las reglas de Firestore deben configurarse después de la migración

---

## 🎯 CHECKLIST DE MIGRACIÓN

- [ ] Habilitar Firestore API
- [ ] Verificar archivo JSON existe
- [ ] Ejecutar script de migración
- [ ] Verificar colecciones en Firebase Console
- [ ] Actualizar componentes para usar Firestore
- [ ] Implementar CRUD operations
- [ ] Configurar reglas de seguridad
- [ ] Testing completo
- [ ] Deploy a producción

---

## 💡 RECURSOS ADICIONALES

- [Documentación Firestore](https://firebase.google.com/docs/firestore)
- [Batch Writes](https://firebase.google.com/docs/firestore/manage-data/transactions)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Best Practices](https://firebase.google.com/docs/firestore/best-practices)

---

## 🤝 SOPORTE

Si encuentras problemas:

1. Revisa los logs del script
2. Verifica la consola de Firebase
3. Consulta esta documentación
4. Revisa el código del script en `scripts/migrate-to-firestore.js`

---

**🎉 ¡Listo! Con este script tendrás todos tus 7 bancos migrados a Firestore en tiempo real.**
