# 📊 GUÍA COMPLETA DE IMPORTACIÓN DE EXCEL

## 🎯 Objetivo

Importar todos los datos del archivo Excel `Copia de Administación_General.xlsx` a Firestore con la siguiente estructura:

```
Excel → Script de Importación → Firestore
```

## 📋 Datos a Importar

### Hojas del Excel:
1. **Órdenes de Compra (OC)** → `ordenesCompra` collection
2. **Ventas Locales** → `ventas` collection
3. **Clientes** → `clientes` collection
4. **Distribuidores/Proveedores** → `distribuidores` collection
5. **Gastos y Abonos** → `gastos` collection
6. **Movimientos Almacén** → `inventario` collection
7. **Movimientos Bancarios** → `transacciones` collection

## 🚀 Instalación

### 1. Instalar Dependencias

```bash
# Ya instaladas en el proyecto:
npm install xlsx firebase --save --legacy-peer-deps
```

### 2. Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id

# Excel Import Path
EXCEL_PATH=C:\Users\xpovo\Downloads\Copia de Administación_General.xlsx
```

## 📝 Uso del Script

### Modo 1: Dry Run (Prueba sin escribir en Firestore)

```bash
npm run excel:import:dry
```

Esto procesará el Excel y mostrará cuántos registros se importarían **sin escribir nada en Firestore**.

**Salida esperada:**
```
========================================
📊 IMPORTACIÓN COMPLETA DE EXCEL
========================================

🔍 MODO DRY RUN - No se escribirá en Firestore

📁 Archivo: C:\Users\xpovo\Downloads\Copia de Administación_General.xlsx
💵 Moneda: USD

📖 Leyendo archivo Excel...
✅ Hojas encontradas: OC, Ventas Locales, Clientes, Distribuidores, Gastos

📦 Importando Órdenes de Compra...
  ✅ 150 órdenes procesadas (DRY RUN)

💰 Importando Ventas...
  ✅ 320 ventas procesadas (DRY RUN)

👥 Importando Clientes...
  ✅ 85 clientes procesados (DRY RUN)

🏭 Importando Distribuidores...
  ✅ 12 distribuidores procesados (DRY RUN)

💸 Importando Gastos...
  ✅ 210 gastos procesados (DRY RUN)

========================================
✅ IMPORTACIÓN COMPLETADA
========================================

📊 Resumen de registros importados:

  ordenesCompra       : 150 registros
  ventas              : 320 registros
  clientes            : 85 registros
  distribuidores      : 12 distribuidores
  gastos              : 210 registros

  TOTAL               : 777 registros

📄 Reporte guardado en: scripts/import-report.json
```

### Modo 2: Importación Real (Escribe en Firestore)

```bash
npm run excel:import
```

Esto importará **todos los datos** a Firestore.

**⚠️ ADVERTENCIA:** Esta acción escribirá datos en tu base de datos. Asegúrate de tener un backup.

### Modo 3: Script Directo con Variables de Entorno

```bash
# Windows PowerShell
$env:EXCEL_PATH="C:\Users\xpovo\Downloads\Copia de Administación_General.xlsx"
npm run excel:import
```

## 🔍 Verificación Post-Importación

### 1. Revisar Reporte Generado

```bash
cat scripts/import-report.json
```

**Ejemplo de reporte:**
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "excelFile": "C:\\Users\\xpovo\\Downloads\\Copia de Administación_General.xlsx",
  "mode": "PRODUCTION",
  "results": {
    "ordenesCompra": { "count": 150 },
    "ventas": { "count": 320 },
    "clientes": { "count": 85 },
    "distribuidores": { "count": 12 },
    "gastos": { "count": 210 }
  },
  "total": 777
}
```

### 2. Verificar en Firebase Console

Ir a: https://console.firebase.google.com/project/TU_PROYECTO/firestore/data

Verificar las siguientes colecciones:
- ✅ `ordenesCompra` - Debe tener registros
- ✅ `ventas` - Debe tener registros
- ✅ `clientes` - Debe tener registros
- ✅ `distribuidores` - Debe tener registros
- ✅ `gastos` - Debe tener registros

### 3. Ejecutar Queries de Verificación

```javascript
// En la consola de Firebase o en tu aplicación
const ordenesSnapshot = await getDocs(collection(db, 'ordenesCompra'));
console.log('Órdenes importadas:', ordenesSnapshot.size);

const ventasSnapshot = await getDocs(collection(db, 'ventas'));
console.log('Ventas importadas:', ventasSnapshot.size);
```

## 📊 Estructura de Datos Importados

### Órdenes de Compra

```typescript
{
  numeroOrden: string;
  fecha: string;
  proveedor: string;
  producto: string;
  cantidad: number;
  precioUnitario: number;
  costoTotal: number;
  moneda: 'USD';
  estado: 'PENDIENTE' | 'EN_TRANSITO' | 'RECIBIDA' | 'CANCELADA';
  origen: string;
  observaciones: string;
  fechaEstimadaEntrega: string;
  createdAt: string;
  updatedAt: string;
}
```

### Ventas

```typescript
{
  numeroVenta: string;
  fecha: string;
  clienteId: string;
  clienteNombre: string;
  producto: string;
  cantidad: number;
  precioUnitario: number;
  precioVenta: number;
  costoUnitario: number;
  costoTotal: number;
  utilidad: number;
  margen: string; // Porcentaje
  moneda: 'USD';
  estado: 'PENDIENTE' | 'COMPLETADA' | 'CANCELADA';
  tipoPago: string;
  observaciones: string;
  createdAt: string;
  updatedAt: string;
}
```

### Clientes

```typescript
{
  nombre: string;
  rfc: string;
  empresa: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  creditoAutorizado: number;
  creditoDisponible: number;
  bloqueado: boolean;
  motivoBloqueo: string;
  createdAt: string;
  updatedAt: string;
}
```

### Distribuidores

```typescript
{
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
  pais: string;
  productos: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Gastos

```typescript
{
  fecha: string;
  concepto: string;
  categoria: string;
  monto: number;
  moneda: 'USD';
  metodoPago: string;
  proveedor: string;
  referencia: string;
  observaciones: string;
  createdAt: string;
  updatedAt: string;
}
```

## ⚙️ Mapeo de Columnas

### Órdenes de Compra

| Excel | Firestore | Tipo | Requerido |
|-------|-----------|------|-----------|
| N° OC / Número OC | numeroOrden | string | ✅ |
| Fecha / Fecha OC | fecha | ISO string | ✅ |
| Proveedor / Distribuidor | proveedor | string | ✅ |
| Producto / Descripción | producto | string | ✅ |
| Cantidad | cantidad | number | ✅ |
| Precio Unitario / Costo Unitario | precioUnitario | number | ✅ |
| Total / Costo Total | costoTotal | number | ✅ |
| Estado | estado | enum | - |
| Origen | origen | string | - |
| Observaciones / Notas | observaciones | string | - |
| Fecha Entrega / ETA | fechaEstimadaEntrega | ISO string | - |

### Ventas

| Excel | Firestore | Tipo | Requerido |
|-------|-----------|------|-----------|
| N° Venta / Folio | numeroVenta | string | ✅ |
| Fecha | fecha | ISO string | ✅ |
| Cliente ID | clienteId | string | - |
| Cliente / Razón Social | clienteNombre | string | ✅ |
| Producto / Descripción | producto | string | ✅ |
| Cantidad | cantidad | number | ✅ |
| Precio Unitario / Precio Venta | precioUnitario | number | ✅ |
| Total / Monto Total | precioVenta | number | ✅ |
| Costo Unitario | costoUnitario | number | - |
| Costo Total | costoTotal | number | - |
| Estado | estado | enum | - |
| Tipo Pago / Forma Pago | tipoPago | string | - |
| Observaciones | observaciones | string | - |

### Clientes

| Excel | Firestore | Tipo | Requerido |
|-------|-----------|------|-----------|
| Cliente / Razón Social / Nombre | nombre | string | ✅ |
| RFC | rfc | string | - |
| Empresa / Razón Social | empresa | string | - |
| Teléfono / Tel | telefono | string | - |
| Email / Correo | email | string | - |
| Dirección | direccion | string | - |
| Ciudad | ciudad | string | - |
| Estado | estado | string | - |
| CP / Código Postal | codigoPostal | string | - |
| Crédito Autorizado / Límite Crédito | creditoAutorizado | number | - |
| Crédito Disponible | creditoDisponible | number | - |
| Bloqueado / Status | bloqueado | boolean | - |
| Motivo Bloqueo | motivoBloqueo | string | - |

## 🔒 Validaciones Aplicadas

1. **Moneda**: Todos los montos se guardan en USD
2. **Fechas**: Convertidas a formato ISO 8601
3. **Números**: Limpieza de caracteres especiales ($, comas)
4. **Strings**: Trim y normalización de espacios
5. **Duplicados**: Prevención de clientes y distribuidores duplicados
6. **Cálculos automáticos**:
   - `costoTotal = cantidad × precioUnitario` (si falta)
   - `utilidad = precioVenta - costoTotal`
   - `margen = (utilidad / precioVenta) × 100`

## 🐛 Resolución de Problemas

### Error: "Cannot find module 'xlsx'"

```bash
npm install xlsx --save --legacy-peer-deps
```

### Error: "Firebase app not initialized"

Verificar que el archivo `.env` existe y tiene las variables correctas.

```bash
# Ver variables de entorno
cat .env
```

### Error: "Permission denied" en Firestore

1. Ir a Firebase Console
2. Navegar a Firestore → Rules
3. Temporalmente permitir escritura:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // SOLO PARA IMPORTACIÓN INICIAL
    }
  }
}
```

**⚠️ IMPORTANTE:** Después de importar, restaurar las reglas de seguridad.

### Error: "Cannot read file" o "File not found"

Verificar la ruta del archivo Excel:

```bash
# Windows PowerShell
Test-Path "C:\Users\xpovo\Downloads\Copia de Administación_General.xlsx"
```

Si devuelve `False`, actualizar la variable `EXCEL_PATH` en `.env`.

### Importación muy lenta

El script procesa datos en lotes de 500 registros. Si tienes más de 10,000 registros, considera:

1. Aumentar `BATCH_SIZE` en el script
2. Usar Cloud Functions para importaciones masivas
3. Importar en horarios de bajo tráfico

## 📈 Siguientes Pasos

1. ✅ Ejecutar `npm run excel:import:dry` (verificar conteo)
2. ✅ Revisar el reporte generado
3. ✅ Ejecutar `npm run excel:import` (importación real)
4. ✅ Verificar datos en Firebase Console
5. ✅ Probar la aplicación FlowDistributor con datos reales
6. ✅ Configurar Firestore Security Rules definitivas
7. ✅ Crear índices compuestos necesarios

## 🔐 Índices Compuestos Recomendados

Después de importar, crear estos índices en Firebase Console:

### ordenesCompra
- `(estado, fecha)` - desc
- `(proveedor, fecha)` - desc
- `(estado, proveedor, fecha)` - desc

### ventas
- `(clienteId, fecha)` - desc
- `(estado, fecha)` - desc
- `(clienteId, estado, fecha)` - desc

### clientes
- `(bloqueado, creditoAutorizado)` - desc

## 📞 Soporte

Si encuentras problemas:

1. Revisar logs del script
2. Verificar el archivo `import-report.json`
3. Consultar la documentación de Firebase
4. Revisar las Security Rules de Firestore

---

**Versión:** 1.0.0
**Última actualización:** 2024-01-15
**Autor:** Premium Ecosystem Team
