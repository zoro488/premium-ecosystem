# 🏗️ Arquitectura de Datos - Chronos System

## 📊 Mapeo Completo: Excel → Firestore → Servicios

Esta herramienta migra **TODOS** los datos del archivo Excel a Firestore, organizados exactamente como los servicios de `chronos-system` los esperan.

---

## 🗂️ Estructura Completa de Colecciones

### 1️⃣ **Órdenes de Compra** (`ordenesCompra`)

**Origen Excel:** `ordenesCompra.distribuidores.ordenesCompra[]`

**Servicio:** `src/apps/FlowDistributor/chronos-system/services/ordenes-compra.service.js`

**Estructura:**
```javascript
{
  id: "OC0001",
  fecha: "2025-08-25",
  origen: "Q-MAYA",
  cantidad: 423,
  costoDistribuidor: 6100.0,
  costoTransporte: 200.0,
  costoPorUnidad: 6300.0,
  stockActual: 0,
  costoTotal: 2664900.0,
  pagoDistribuidor: 0.0,
  deuda: 0.0
}
```

**Uso:** Gestión de compras a distribuidores, control de inventario y deudas.

---

### 2️⃣ **Distribuidores** (`distribuidores`)

**Origen Excel:** `ordenesCompra.distribuidores.resumen[]`

**Servicio:** `src/apps/FlowDistributor/chronos-system/services/distribuidores.service.js`

**Estructura:**
```javascript
{
  distribuidor: "PACMAN",
  compraTotal: 3068100.0,
  pagos: 0.0,
  deudaTotal: 0.0
}
```

**Uso:** Resumen de deudas y pagos por distribuidor.

---

### 3️⃣ **Ventas** (`ventas`)

**Origen Excel:** `ventas.ventas[]`

**Servicio:** `src/apps/FlowDistributor/chronos-system/services/ventas.service.js`

**Estructura:**
```javascript
{
  id: "V0001" | auto-generado,
  fecha: "2025-08-25",
  cliente: "Buchona",
  producto: "Gaviota",
  cantidad: 50,
  precioUnitario: 12000.0,
  total: 600000.0,
  abonos: 300000.0,
  deudaRestante: 300000.0
}
```

**Uso:** Registro de ventas, control de cobros y análisis de ventas.

---

### 4️⃣ **Clientes** (`clientes`)

**Origen Excel:** `ventas.clientes[]`

**Servicio:** `src/apps/FlowDistributor/chronos-system/services/clientes.service.js`

**Estructura:**
```javascript
{
  cliente: "Buchona",
  actual: 300000.0,
  deuda: 900000.0,
  abonos: 600000.0,
  pendiente: 300000.0,
  observaciones: ""
}
```

**Uso:** Resumen de deudas por cliente, cartera de cobros.

---

### 5️⃣ **Bancos** (`bancos`)

**Origen Excel:** `bancos{}` (objeto con propiedades)

**Servicio:** `src/apps/FlowDistributor/chronos-system/services/bancos.service.js`

**Estructura:** Un documento por banco
```javascript
{
  id: "bovedaMonte",
  nombre: "Bóveda Monte",
  saldo: 5722280.00,
  tipo: "nacional",
  moneda: "MXN"
}
```

**Bancos Migrados:**
- `bovedaMonte` - Bóveda Monte (MXN)
- `bovedaUsa` - Bóveda USA (USD)
- `utilidades` - Utilidades (MXN)
- `fletes` - Fletes (MXN)
- `azteca` - Banco Azteca (MXN)
- `leftie` - Leftie (MXN)
- `profit` - Profit (MXN)

**Uso:** Control de saldos bancarios, flujo de efectivo.

---

### 6️⃣ **Gastos y Abonos** (`gastosAbonos`)

**Origen Excel:** `gastosAbonos.gastosAbonos[]`

**Estructura:**
```javascript
{
  fecha: "2025-08-25",
  origen: "Bóveda Monte",
  destino: "Distribuidor X",
  monto: 50000.0,
  concepto: "Abono OC0001",
  tipo: "abono" | "gasto",
  observaciones: ""
}
```

**Uso:** Registro de gastos operativos y abonos a distribuidores.

---

### 7️⃣ **Movimientos Bancarios por Cuenta**

**Colecciones Creadas:**
- `movimientosBancarios_bovedaMonte`
- `movimientosBancarios_bovedaUsa`
- `movimientosBancarios_utilidades`
- `movimientosBancarios_fletes`
- `movimientosBancarios_azteca`

**Origen Excel:** `[nombreBanco].ingresos[]`

**Servicio:** `src/apps/FlowDistributor/chronos-system/services/bancos.service.js`

**Estructura:**
```javascript
{
  fecha: "2025-08-25",
  cliente: "Buchona",
  ingreso: 300000.0,
  concepto: "Abono venta #50",
  tipo: "ingreso"
}
```

**Uso:** Tracking detallado de movimientos por cuenta bancaria.

---

### 8️⃣ **Gastos Detallados por Cuenta**

**Colecciones Creadas:**
- `gastos_bovedaMonte`
- `gastos_bovedaUsa`
- `gastos_utilidades`
- `gastos_fletes`
- `gastos_azteca`

**Origen Excel:** `[nombreBanco].gastos[]` o `[nombreBanco].gastosList[]`

**Servicio:** `src/apps/FlowDistributor/chronos-system/services/gastos.service.js`

**Estructura:**
```javascript
{
  fecha: "2025-08-25",
  origen: "Bóveda Monte",
  gasto: 50000.0,
  tc: 19.0,        // Tipo de cambio (si aplica)
  pesos: 950000.0, // Conversión a pesos
  destino: "Profit",
  concepto: "Traspaso corporativo",
  observaciones: "corporativo-boveda valle"
}
```

**Uso:** Control de gastos operativos, análisis de egresos.

---

### 9️⃣ **Estado Global** (Documentos Únicos)

**Colección:** `estadoGlobal`

#### **Almacén** (`estadoGlobal/almacen`)
**Origen Excel:** `almacen{}`

**Servicio:** `src/apps/FlowDistributor/chronos-system/services/almacen.service.js`

**Estructura:**
```javascript
{
  productos: {
    "gaviota": {
      stock: 100,
      costoPromedio: 6300.0,
      valorTotal: 630000.0
    }
  },
  totalInventario: 630000.0,
  actualizado: "2025-11-13T..."
}
```

#### **Cortes de Caja por Cuenta**
- `estadoGlobal/cortesBovedaMonte`
- `estadoGlobal/cortesBovedaUsa`
- `estadoGlobal/cortesUtilidades`
- `estadoGlobal/cortesFletes`

**Origen Excel:** `[nombreBanco].rfCortes[]` o `[nombreBanco].cortesRF[]`

**Estructura:**
```javascript
{
  cortes: [
    { fecha: "2025-08-25", corte: 188500.0 },
    { fecha: "2025-09-08", corte: 0.0 }
  ],
  actualizado: "2025-11-13T..."
}
```

#### **Metadata del Sistema** (`estadoGlobal/metadata`)
**Origen Excel:** `metadata{}`

**Estructura:**
```javascript
{
  version: "1.0",
  fecha: "2025-11-03",
  descripcion: "Datos consolidados manuales de FlowDistributor",
  importadoEl: "2025-11-13T...",
  origen: "BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json"
}
```

---

## 🔄 Flujo de Datos: Excel → Firestore → App

```
BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json
              ↓
    [importar.js ejecuta]
              ↓
        Firestore DB
         /         \
    ordenesCompra  ventas
    distribuidores clientes
    bancos         gastosAbonos
    movimientos*   gastos*
    estadoGlobal   productos
              ↓
    Servicios chronos-system
         /    |    \
    ventas  bancos  almacen
    compras clientes gastos
              ↓
    UI Components (React)
```

---

## ✅ Validación de Integridad

### Datos Incluidos (✅)
- [x] Órdenes de compra completas
- [x] Deudas de distribuidores
- [x] Ventas con detalles
- [x] Clientes y cartera
- [x] Saldos bancarios
- [x] Movimientos por cuenta
- [x] Gastos detallados por cuenta
- [x] Gastos/abonos generales
- [x] Inventario de almacén
- [x] Cortes de caja históricos
- [x] Metadata del sistema

### Servicios Compatibles (✅)
- [x] `ventas.service.js` - ✅ Lee de `ventas`
- [x] `clientes.service.js` - ✅ Lee de `clientes`
- [x] `bancos.service.js` - ✅ Lee de `bancos` y `movimientosBancarios_*`
- [x] `almacen.service.js` - ✅ Lee de `estadoGlobal/almacen`
- [x] `gastos.service.js` - ✅ Lee de `gastos_*` y `gastosAbonos`
- [x] `ordenes-compra.service.js` - ✅ Lee de `ordenesCompra`
- [x] `distribuidores.service.js` - ✅ Lee de `distribuidores`

---

## 🎯 Próximos Pasos Después de Migrar

1. **Verificar en Firebase Console:**
   - Ve a Firestore Database
   - Confirma que todas las colecciones se crearon
   - Revisa algunos documentos para validar estructura

2. **Actualizar Servicios (si es necesario):**
   - Algunos servicios pueden necesitar ajustes menores
   - La mayoría funcionará directamente con esta estructura

3. **Probar la Aplicación:**
   - Inicia `chronos-system`
   - Verifica que los dashboards muestren datos
   - Prueba las operaciones CRUD

4. **Configurar Reglas de Seguridad:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

---

## 📚 Referencias

- **Firestore Docs:** [firebase.google.com/docs/firestore](https://firebase.google.com/docs/firestore)
- **Batch Writes:** [firebase.google.com/docs/firestore/manage-data/transactions#batched-writes](https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes)
- **Data Modeling:** [firebase.google.com/docs/firestore/data-model](https://firebase.google.com/docs/firestore/data-model)

---

**🚀 Con esta migración, tu sistema chronos-system tendrá TODOS los datos del Excel listos para operar en producción.**
