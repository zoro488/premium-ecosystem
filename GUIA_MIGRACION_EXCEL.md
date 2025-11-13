# 🔥 GUÍA DE MIGRACIÓN: Excel → Firestore

## 📋 Descripción

Este script migra **TODOS los datos** del archivo `excel_data.json` (5,175+ registros) a Firestore con la estructura correcta para que se reflejen en todas las vistas de FlowDistributor.

## 📊 Datos que se migran

### 1. **Clientes** (30+ registros)
- Extraídos automáticamente de las ventas
- Incluye: nombre, adeudo, total de ventas, cantidad de ventas
- Se calcula límite de crédito (150% del total de ventas)

### 2. **Ventas** (5,175+ registros)
- Todas las ventas del Excel con todos sus datos
- Incluye: productos, montos, fletes, utilidades, estado de pago
- Se vincula automáticamente con clientes

### 3. **Órdenes de Compra** (9+ registros)
- Órdenes a proveedores
- Incluye: productos, montos, adeudos, estado de pago

### 4. **Distribuidores/Proveedores** (6+ registros)
- Extraídos de órdenes de compra
- Incluye: nombre, adeudo, total de compras

### 5. **Productos** (variedad)
- Extraídos de ventas y órdenes
- Incluye: nombre, SKU, precios, stock

### 6. **Bancos** (7 bancos)
- Bóveda Monte, Leftie, Banorte, BBVA, Santander, HSBC, Scotiabank
- Incluye: capital actual, saldo, número de tarjeta

### 7. **Inventario** (2,296 entradas + 2,279 salidas)
- Movimientos de almacén
- Incluye: fecha, cantidad, origen/destino

### 8. **Movimientos Bancarios** (1+ registros)
- Gastos, abonos, transferencias
- Incluye: monto, fecha, concepto, banco

### 9. **Metadata del Sistema**
- Estadísticas de migración
- Resumen financiero
- Versión y estado

## 🚀 Cómo ejecutar la migración

### **Paso 1: Configurar Variables de Entorno**

Asegúrate de que tu archivo `.env` en la raíz del proyecto tenga las credenciales de Firebase:

```env
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-project-id
VITE_FIREBASE_STORAGE_BUCKET=tu-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### **Paso 2: Verificar que el archivo Excel existe**

```bash
# Verificar que existe
ls public/excel_data.json

# Ver primeras líneas
Get-Content public/excel_data.json -Head 50
```

### **Paso 3: Ejecutar la migración**

```bash
# Opción 1: Usando npm script
npm run migrate:excel

# Opción 2: Directo con node
node scripts/migrate-excel-to-firestore.js
```

### **Paso 4: Esperar a que termine**

El script mostrará el progreso en consola:

```
╔════════════════════════════════════════════╗
║   🔥 MIGRACIÓN EXCEL → FIRESTORE 🔥       ║
║   Premium Ecosystem - FlowDistributor      ║
╚════════════════════════════════════════════╝

📂 Leyendo excel_data.json...
✅ Archivo leído correctamente

📊 RESUMEN DEL ARCHIVO:
  - Ventas: 5175
  - Órdenes de Compra: 9
  - Entradas Almacén: 2296
  - Salidas Almacén: 2279
  - Movimientos: 1

🚀 Iniciando migración en 3 segundos...

🏦 Migrando BANCOS...
✅ 7 bancos migrados correctamente

📦 Migrando CLIENTES...
  ✅ Batch de 30 clientes guardado
✅ 30 clientes migrados correctamente

💰 Migrando VENTAS...
  ✅ Batch de 500 ventas guardado
  ✅ Batch de 500 ventas guardado
  ...
✅ 5175 ventas migradas correctamente

... (continúa con todas las colecciones)

╔════════════════════════════════════════════╗
║          ✅ MIGRACIÓN COMPLETADA ✅         ║
╚════════════════════════════════════════════╝

📊 ESTADÍSTICAS:
  ✅ Bancos:            7 registros
  ✅ Clientes:          30 registros
  ✅ Distribuidores:    6 registros
  ✅ Productos:         25 registros
  ✅ Ventas:            5175 registros
  ✅ Órdenes Compra:    9 registros
  ✅ Inventario:        4575 movimientos
  ✅ Movimientos:       1 registros

⏱️  Tiempo total: 45.32 segundos

🎉 Todos los datos han sido migrados exitosamente a Firestore!
```

## 📱 Verificar en la UI

Una vez completada la migración, los datos se reflejarán automáticamente en todas las vistas:

### **1. Dashboard Master**
```
http://localhost:5173/dashboard
```
- ✅ KPIs actualizados (Capital Total, Ingresos Reales, Por Cobrar)
- ✅ Charts con datos reales (Gauge, Sankey, Radar, Heatmap)
- ✅ Últimas 10 ventas reales

### **2. Ventas View**
```
http://localhost:5173/ventas
```
- ✅ 5,175 ventas visibles en tabla
- ✅ Funnel con pipeline real
- ✅ Gauge con cumplimiento vs meta real
- ✅ Radar con KPIs reales

### **3. Clientes View**
```
http://localhost:5173/clientes
```
- ✅ 30 clientes con adeudos reales
- ✅ Scatter con adeudo vs actividad real
- ✅ Heatmap con actividad por hora/día
- ✅ Treemap con segmentación real (VIP, Premium, Regular, Básico)

### **4. Reportes View**
```
http://localhost:5173/reportes
```
- ✅ Funnel con ventas por mes reales
- ✅ Sankey con flujo de capital real
- ✅ Treemap con Top 10 clientes reales
- ✅ Gauge con % órdenes pagadas vs total real

### **5. Distribuidores View**
```
http://localhost:5173/distribuidores
```
- ✅ 6 proveedores con adeudos reales
- ✅ Órdenes de compra reales

## 🔍 Validar en Firestore Console

1. Ir a [Firebase Console](https://console.firebase.google.com)
2. Seleccionar tu proyecto
3. Ir a **Firestore Database**
4. Verificar que existen las colecciones:
   - ✅ `clientes` (30 documentos)
   - ✅ `ventas` (5,175 documentos)
   - ✅ `ordenesCompra` (9 documentos)
   - ✅ `distribuidores` (6 documentos)
   - ✅ `productos` (~25 documentos)
   - ✅ `bancos` (7 documentos)
   - ✅ `inventario` (4,575 documentos)
   - ✅ `movimientos` (1+ documentos)
   - ✅ `system/metadata` (1 documento)

## ⚠️ ADVERTENCIAS

### **1. Sobrescritura de datos**
- ⚠️ Este script **SOBRESCRIBE** documentos existentes con el mismo ID
- ⚠️ No hace backup automático de datos anteriores
- ⚠️ Si tienes datos importantes, haz un backup manual antes de ejecutar

### **2. Firestore Limits**
- ⚠️ Firestore permite máximo **500 operaciones por batch**
- ⚠️ El script maneja esto automáticamente
- ⚠️ Con 5,175+ ventas, se crearán ~11 batches

### **3. Costos**
- ⚠️ Firestore cobra por **escrituras** ($0.18 por 100,000)
- ⚠️ Esta migración hará ~8,000 escrituras ≈ $0.015 USD
- ⚠️ Es un costo mínimo pero ten en cuenta

### **4. Tiempo de ejecución**
- ⏱️ Con 8,000+ registros, puede tomar **30-60 segundos**
- ⏱️ No interrumpir el proceso
- ⏱️ Esperar a ver el mensaje de éxito

## 🛠️ Troubleshooting

### **Error: "Unable to read file excel_data.json"**
**Solución**: Verificar que el archivo existe en `public/excel_data.json`
```bash
ls public/excel_data.json
```

### **Error: "Firebase not configured"**
**Solución**: Verificar variables de entorno en `.env`
```bash
cat .env | Select-String "FIREBASE"
```

### **Error: "Permission denied"**
**Solución**: Verificar reglas de seguridad de Firestore
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ Solo para desarrollo
    }
  }
}
```

### **Error: "Quota exceeded"**
**Solución**: Esperar unos minutos y reintentar. Firestore tiene límites de tasa.

## 🔄 Re-ejecutar la migración

Si necesitas volver a cargar los datos:

1. **Borrar datos anteriores** (opcional):
   ```bash
   # Ir a Firebase Console → Firestore
   # Borrar todas las colecciones manualmente
   ```

2. **Ejecutar migración nuevamente**:
   ```bash
   npm run migrate:excel
   ```

## 📊 Estructura de datos en Firestore

### **Clientes**
```javascript
{
  id: "bodega-m-p",
  nombre: "Bódega M-P",
  razonSocial: "Bódega M-P",
  adeudo: 945000,
  totalVentas: 2835000,
  cantidadVentas: 3,
  limiteCredito: 4252500, // 150% de totalVentas
  activo: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### **Ventas**
```javascript
{
  id: "VENTA-2025-08-23T00:00:00-Bódega M-P-4",
  tipo: "venta",
  fecha: Timestamp,
  clienteId: "bodega-m-p",
  clienteNombre: "Bódega M-P",
  productos: [
    {
      nombre: "Producto",
      cantidad: 150,
      precio: 6300,
      subtotal: 945000
    }
  ],
  totalVenta: 945000,
  totalFletes: 75000,
  estatus: "Pendiente",
  estadoPago: "pendiente",
  adeudo: 0,
  bancoId: "bovedaMonte",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 📚 Documentación adicional

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Batch Writes](https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes)
- [Data Model Best Practices](https://firebase.google.com/docs/firestore/data-model)

## 🎯 Siguiente paso

Una vez completada la migración exitosamente:

1. ✅ Verificar datos en Firebase Console
2. ✅ Abrir FlowDistributor en navegador
3. ✅ Verificar que todas las vistas muestran datos reales
4. ✅ Probar funcionalidad de formularios (crear cliente, registrar venta)
5. ✅ Exportar reportes en PDF/Excel/PNG

## 🎉 ¡Listo!

Ahora tienes **5,175+ ventas reales** y **todos los datos del Excel** cargados en Firestore y visibles en la UI de FlowDistributor.

---

**Autor**: GitHub Copilot
**Fecha**: 2025-11-11
**Versión**: 1.0.0
**Script**: `scripts/migrate-excel-to-firestore.js`
