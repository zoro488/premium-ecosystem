# 🗄️ FLOWDISTRIBUTOR - BASE DE DATOS

## 📋 ESTRUCTURA GENERAL

La base de datos del sistema está almacenada en:
```
public/excel_data.json
```

**Backup disponible en:**
```
public/excel_data.backup.json
```

---

## 📊 ESQUEMA COMPLETO

```json
{
  "ventas": Array<Venta>,          // 96 ventas
  "compras": Array<Compra>,        // 9 órdenes de compra
  "distribuidores": Array<Distribuidor>,  // 6 distribuidores
  "clientes": Array<Cliente>,      // 31 clientes
  "gastosAbonos": Array,           // Gastos y abonos generales
  "bancos": {
    "bovedaMonte": Banco,
    "bovedaUsa": Banco,
    "utilidades": Banco,
    "fleteSur": Banco,
    "azteca": Banco,
    "leftie": Banco,
    "profit": Banco
  },
  "almacen": Almacen,              // Inventario
  "movimientos": Array,            // Movimientos generales
  "metricasFinancieras": Object,   // Métricas calculadas
  "resumen": Object,               // Resumen general
  "ultimaActualizacion": String,   // ISO timestamp
  "version": String,               // "3.0-excel-completo"
  "estado": String                 // "sincronizado-excel"
}
```

---

## 💰 BANCOS

### Estructura de un Banco

```typescript
interface Banco {
  nombre: string;           // "bovedaMonte"
  capitalActual: number;    // Saldo actual
  ingresos: Ingreso[];      // Array de ingresos
  gastos: Gasto[];          // Array de gastos
  estado: "activo" | "negativo";
}

interface Ingreso {
  fecha: string;            // "2025-08-23"
  cliente: string;          // "Ax"
  monto: number;            // 315000
  concepto: string;         // "Ax - "
  origen?: string;          // Origen del ingreso
}

interface Gasto {
  fecha: string;            // "2025-08-22"
  origen: string;           // "Gasto Bóveda Monte"
  monto: number;            // 189000
  concepto: string;         // "corporativo-boveda valle"
  destino?: string;         // Destino del gasto
}
```

### Ejemplo Real: Bóveda Monte

```json
{
  "nombre": "bovedaMonte",
  "capitalActual": 0,
  "ingresos": [
    {
      "fecha": "2025-08-23",
      "cliente": "Ax",
      "monto": 315000,
      "concepto": "Ax - "
    },
    {
      "fecha": "2025-08-23",
      "cliente": "Negrito",
      "monto": 157500,
      "concepto": "Negrito - "
    },
    {
      "fecha": "2025-08-23",
      "cliente": "Valle",
      "monto": 189000,
      "concepto": "Valle - "
    }
  ],
  "gastos": [
    {
      "fecha": "2025-08-22",
      "origen": "Gasto Bóveda Monte",
      "monto": 189000,
      "concepto": "Gasto Bóveda Monte - corporativo-boveda valle"
    },
    {
      "fecha": "2025-08-22",
      "origen": "Gasto Bóveda Monte",
      "monto": 136000,
      "concepto": "Gasto Bóveda Monte - corporativo-boveda valle"
    }
  ],
  "estado": "activo"
}
```

### Resumen de Todos los Bancos

| Banco | Capital Actual | Ingresos | Gastos | Estado |
|-------|----------------|----------|---------|---------|
| bovedaMonte | $0 | 69 ($5,722,280) | 26 ($5,722,280) | ✅ Activo |
| bovedaUsa | $128,005 | 17 ($1,888,275) | 49 ($1,760,270) | ✅ Activo |
| utilidades | $102,658 | 50 ($280,758) | 13 ($178,100) | ✅ Activo |
| fleteSur | $185,792 | 58 ($652,512) | 103 ($466,720) | ✅ Activo |
| azteca | **-$178,715** | 6 ($1,880,970) | 24 ($1,844,692) | ⚠️ Negativo |
| leftie | $45,844 | 9 ($1,252,100) | 4 ($1,206,256) | ✅ Activo |
| profit | $12,577,748 | 55 ($12,577,748) | 0 ($0) | ✅ Activo |

**Total Sistema:** $12,861,332

---

## 📦 ALMACÉN

### Estructura del Almacén

```typescript
interface Almacen {
  stockActual: number;          // Unidades disponibles
  totalEntradas: number;        // Total unidades ingresadas
  totalSalidas: number;         // Total unidades vendidas
  movimientos: Movimiento[];    // Historial completo
  entradas?: Entrada[];         // Array de entradas
  salidas?: Salida[];           // Array de salidas
}

interface Movimiento {
  tipo: "entrada" | "salida";
  fecha: string;
  cantidad: number;
  origen?: string;              // Para entradas
  destino?: string;             // Para salidas
  oc?: string;                  // OC relacionada (entradas)
}
```

### Ejemplo Real

```json
{
  "stockActual": 17,
  "totalEntradas": 2296,
  "totalSalidas": 2279,
  "movimientos": [
    {
      "tipo": "entrada",
      "fecha": "2025-08-25",
      "cantidad": 423,
      "origen": "Q-MAYA",
      "oc": "OC0001"
    },
    {
      "tipo": "salida",
      "fecha": "2025-08-23",
      "cantidad": 150,
      "destino": "Bódega M-P"
    },
    {
      "tipo": "salida",
      "fecha": "2025-08-23",
      "cantidad": 60,
      "destino": "Valle"
    }
  ]
}
```

**Estado Actual:**
- Stock disponible: **17 unidades**
- Total entradas: **2,296 unidades**
- Total salidas: **2,279 unidades**
- Movimientos registrados: **105**

---

## 📋 DISTRIBUIDORES

### Estructura de un Distribuidor

```typescript
interface Distribuidor {
  id: string;                   // "DIST-001"
  nombre: string;               // "PACMAN"
  totalComprado: number;        // Total histórico
  totalPagado: number;          // Pagos realizados
  adeudo: number;               // Deuda pendiente
  ordenesCompra: number;        // Cantidad de OCs
  estado: "activo" | "inactivo";
  ordenes: string[];            // IDs de OCs
  pagos: Pago[];               // Historial de pagos
}

interface Pago {
  monto: number;
  fecha: string;
  banco: string;                // Banco desde donde se pagó
}
```

### Ejemplo Real: PACMAN

```json
{
  "id": "DIST-001",
  "nombre": "PACMAN",
  "totalComprado": 6142500,
  "totalPagado": 0,
  "adeudo": 6142500,
  "ordenesCompra": 0,
  "estado": "activo",
  "ordenes": [],
  "pagos": []
}
```

### Lista de Distribuidores

| ID | Nombre | Total Comprado | Pagado | Adeudo |
|----|--------|----------------|---------|---------|
| DIST-001 | PACMAN | $6,142,500 | $0 | $6,142,500 |
| DIST-002 | Q-MAYA | $6,098,400 | $0 | $6,098,400 |
| DIST-003 | A/X🌶️🦀 | $207,900 | $0 | $207,900 |
| DIST-004 | CH-MONTE | $630,000 | $0 | $630,000 |
| DIST-005 | VALLE-MONTE | $140,000 | $0 | $140,000 |
| DIST-006 | Q-MAYA-MP | $863,100 | $0 | $863,100 |

**Deuda Total con Distribuidores:** $14,081,900

---

## 👥 CLIENTES

### Estructura de un Cliente

```typescript
interface Cliente {
  id: string;                   // "CLI-001"
  nombre: string;               // "Ax"
  totalComprado: number;        // Total histórico
  totalAbonado: number;         // Pagos realizados
  adeudo: number;               // Deuda pendiente (puede ser negativo)
  estado: "activo" | "saldado";
  observaciones: string;
  ventas: Venta[];             // Ventas asociadas
}
```

### Ejemplo Real: Ax

```json
{
  "id": "CLI-002",
  "nombre": "Ax",
  "totalComprado": 365400,
  "totalAbonado": 682780,
  "adeudo": -317380,
  "estado": "saldado",
  "observaciones": "",
  "ventas": []
}
```

### Top 10 Clientes por Adeudo

| Cliente | Total Comprado | Abonado | Adeudo | Estado |
|---------|----------------|---------|---------|---------|
| Bódega M-P | $945,000 | $0 | $945,000 | ⚠️ Activo |
| amigo playa azul | $355,000 | $0 | $355,000 | ⚠️ Activo |
| flama | $335,000 | $0 | $335,000 | ⚠️ Activo |
| Tio Tocayo | $315,000 | $0 | $315,000 | ⚠️ Activo |
| Tocayo | $255,200 | $0 | $255,200 | ⚠️ Activo |
| Robalo | $660,000 | $426,000 | $234,000 | ⚠️ Activo |
| tx8 | $0 | $0 | $151,500 | ⚠️ Activo |
| mg | $100,100 | $0 | $100,100 | ⚠️ Activo |
| cabo | $0 | $0 | $63,000 | ⚠️ Activo |
| Valle | $880,500 | $845,500 | $35,000 | ⚠️ Activo |

**Cartera Total:** $2,753,100

---

## 📊 VENTAS

### Estructura de una Venta

```typescript
interface Venta {
  id: string;                   // "VENTA-2025-08-23T00:00:00-Ax-6"
  tipo: "venta";
  fecha: string;                // "2025-08-23T00:00:00"
  ocRelacionada: string;        // "OC0001"
  cantidad: number;             // 50
  cliente: string;              // "Ax"
  productos: Producto[];
  totalVenta: number;           // Total facturado
  totalFletes: number;          // Costos de flete
  totalUtilidades: number;      // Ganancia
  estatus: "Pendiente" | "Pagado";
  estadoPago: "pendiente" | "pagado";
  adeudo: number;
  montoPagado: number;
  destino: string;              // Banco destino
  concepto: string;
  aplicaFlete: boolean;
  bovedaMonte?: number;         // Monto a bóveda
}

interface Producto {
  nombre: string;               // "Producto"
  cantidad: number;
  precio: number;
  subtotal: number;
}
```

### Ejemplo Real

```json
{
  "id": "VENTA-2025-08-23T00:00:00-Ax-6",
  "tipo": "venta",
  "fecha": "2025-08-23T00:00:00",
  "ocRelacionada": "OC0001",
  "cantidad": 50,
  "cliente": "Ax",
  "productos": [
    {
      "nombre": "Producto",
      "cantidad": 50,
      "precio": 7000,
      "subtotal": 350000
    }
  ],
  "totalVenta": 350000,
  "totalFletes": 25000,
  "totalUtilidades": 10000,
  "estatus": "Pagado",
  "estadoPago": "pendiente",
  "adeudo": 0,
  "montoPagado": 0,
  "destino": "bovedaMonte",
  "concepto": "",
  "aplicaFlete": true,
  "bovedaMonte": 315000
}
```

### Estadísticas de Ventas

- **Total ventas:** 96
- **Ventas pendientes:** 42
- **Ventas pagadas:** 54
- **Total facturado:** Variable
- **Ticket promedio:** ~$300,000

---

## 🛒 COMPRAS (ÓRDENES)

### Estructura de una Orden de Compra

```typescript
interface Compra {
  id: string;                   // "OC0001"
  tipo: "compra";
  fecha: string;                // "2025-08-25"
  distribuidor: string;         // "Q-MAYA"
  cantidad: number;             // 423
  costoUnitario: number;        // 6300
  costoTotal: number;           // 2664900
  costoDistribuidor: number;    // 6100
  costoTransporte: number;      // 200
  stockActual?: number;
  montoPagado?: number;
  adeudo?: number;
  estado: "completada" | "pendiente";
}
```

### Ejemplo Real: OC0001

```json
{
  "id": "OC0001",
  "tipo": "compra",
  "fecha": "2025-08-25",
  "distribuidor": "Q-MAYA",
  "cantidad": 423,
  "costoUnitario": 6300,
  "costoTotal": 2664900,
  "costoDistribuidor": 6100,
  "costoTransporte": 200,
  "estado": "completada"
}
```

### Lista de Órdenes de Compra

| OC | Fecha | Distribuidor | Cantidad | Costo Total |
|----|-------|--------------|----------|-------------|
| OC0001 | 2025-08-25 | Q-MAYA | 423 | $2,664,900 |
| OC0002 | 2025-08-25 | Q-MAYA | 32 | $201,600 |
| OC0003 | 2025-08-25 | A/X🌶️🦀 | 33 | $207,900 |
| OC0004 | 2025-08-30 | PACMAN | 487 | $3,068,100 |
| OC0005 | 2025-09-06 | Q-MAYA | 513 | $3,231,900 |
| OC0006 | 2025-09-10 | CH-MONTE | 100 | $630,000 |
| OC0007 | 2025-09-15 | PACMAN | 487 | $3,074,400 |
| OC0008 | 2025-09-20 | VALLE-MONTE | 20 | $140,000 |
| OC0009 | 2025-09-25 | Q-MAYA-MP | 137 | $863,100 |

**Total Comprado:** $14,081,900

---

## 📈 MÉTRICAS FINANCIERAS

### Cálculos Automáticos

```typescript
interface MetricasFinancieras {
  capitalTotal: number;         // Suma de todos los bancos
  totalVentas: number;          // Suma de todas las ventas
  totalGastos: number;          // Suma de todos los gastos
  utilidadNeta: number;         // capitalTotal - totalGastos
  stockValor: number;           // stockActual * costoPromedio
  deudaDistribuidores: number;  // Suma adeudos distribuidores
  deudaClientes: number;        // Suma adeudos clientes
  liquidez: number;             // Capital disponible
}
```

### Valores Actuales

```json
{
  "capitalTotal": 12861332,
  "totalVentas": 5722280,
  "totalGastos": 10000000,
  "utilidadNeta": 2861332,
  "stockValor": 107100,
  "deudaDistribuidores": 14081900,
  "deudaClientes": 2753100,
  "liquidez": 12861332
}
```

---

## 🔄 OPERACIONES COMUNES

### Registrar Ingreso a Banco

```javascript
// Agregar ingreso a bovedaMonte
const nuevoIngreso = {
  fecha: new Date().toISOString().split('T')[0],
  cliente: "Nombre Cliente",
  monto: 50000,
  concepto: "Pago de venta #123"
};

data.bancos.bovedaMonte.ingresos.push(nuevoIngreso);
data.bancos.bovedaMonte.capitalActual += nuevoIngreso.monto;
```

### Registrar Gasto de Banco

```javascript
// Agregar gasto a bovedaMonte
const nuevoGasto = {
  fecha: new Date().toISOString().split('T')[0],
  origen: "Compra de mercancía",
  monto: 30000,
  concepto: "Pago a proveedor XYZ"
};

data.bancos.bovedaMonte.gastos.push(nuevoGasto);
data.bancos.bovedaMonte.capitalActual -= nuevoGasto.monto;
```

### Registrar Venta

```javascript
const nuevaVenta = {
  id: `VENTA-${Date.now()}`,
  tipo: "venta",
  fecha: new Date().toISOString(),
  cliente: "Cliente ABC",
  cantidad: 10,
  totalVenta: 70000,
  estatus: "Pendiente",
  destino: "bovedaMonte"
};

data.ventas.push(nuevaVenta);

// Actualizar almacén
data.almacen.stockActual -= nuevaVenta.cantidad;
data.almacen.movimientos.push({
  tipo: "salida",
  fecha: nuevaVenta.fecha,
  cantidad: nuevaVenta.cantidad,
  destino: nuevaVenta.cliente
});
```

### Actualizar Adeudo Cliente

```javascript
const cliente = data.clientes.find(c => c.nombre === "Ax");
cliente.totalAbonado += 50000;
cliente.adeudo -= 50000;

if (cliente.adeudo <= 0) {
  cliente.estado = "saldado";
}
```

---

## 💾 PERSISTENCIA

### LocalStorage

Los datos se guardan automáticamente en `localStorage` con las siguientes keys:

```javascript
// Claves de almacenamiento
STORAGE_KEYS = {
  FLOW_DATA: 'flowDistributor_data',
  FLOW_BANCOS: 'flowDistributor_bancos',
  FLOW_ALMACEN: 'flowDistributor_almacen',
  FLOW_CLIENTES: 'flowDistributor_clientes',
  FLOW_VENTAS: 'flowDistributor_ventas',
  FLOW_THEME: 'flowDistributor_theme',
  FLOW_HISTORY: 'flowDistributor_history'
}
```

### Backup y Restore

```javascript
// Crear backup
const backup = JSON.stringify(data);
localStorage.setItem('backup_' + Date.now(), backup);

// Restaurar desde backup
const backupData = localStorage.getItem('backup_timestamp');
const data = JSON.parse(backupData);
```

---

## 🔍 CONSULTAS ÚTILES

### Obtener clientes con deuda

```javascript
const clientesConDeuda = data.clientes.filter(c => c.adeudo > 0);
```

### Calcular total en bancos

```javascript
const totalBancos = Object.values(data.bancos)
  .reduce((sum, banco) => sum + banco.capitalActual, 0);
```

### Ventas del día

```javascript
const hoy = new Date().toISOString().split('T')[0];
const ventasHoy = data.ventas.filter(v => v.fecha.startsWith(hoy));
```

### Stock bajo (< 50 unidades)

```javascript
const stockBajo = data.almacen.stockActual < 50;
```

---

**Última actualización:** 2025-10-21
**Versión:** 3.0-excel-completo
