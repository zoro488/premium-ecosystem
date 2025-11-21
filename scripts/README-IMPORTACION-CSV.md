# 📊 Guía de Importación CSV → Firestore

> Script avanzado para importar los 12 archivos CSV del sistema administrativo a Firestore con validación completa, separación de gastos/transferencias, y manejo robusto de errores.

---

## 📋 Tabla de Contenidos

- [Requisitos Previos](#-requisitos-previos)
- [Estructura de Archivos](#-estructura-de-archivos)
- [Instalación](#-instalación)
- [Uso Básico](#-uso-básico)
- [Modos de Ejecución](#-modos-de-ejecución)
- [Estructura de Datos](#-estructura-de-datos)
- [Troubleshooting](#-troubleshooting)
- [FAQ](#-faq)

---

## ✅ Requisitos Previos

### 1. Dependencias de Node.js

```bash
npm install firebase-admin csv-parser dotenv
```

### 2. Service Account Key

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Project Settings** → **Service Accounts**
4. Click en **Generate New Private Key**
5. Guarda el archivo como `serviceAccountKey.json` en la raíz del proyecto

```
premium-ecosystem/
├── serviceAccountKey.json  ← Aquí
├── scripts/
│   └── importar-csv-firestore.js
└── data/
    └── csv/  ← Los 12 archivos CSV aquí
```

### 3. Archivos CSV

Asegúrate de tener los 12 archivos CSV en la carpeta `data/csv/`:

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

## 📁 Estructura de Archivos

Antes de ejecutar el script, asegúrate de tener esta estructura:

```
premium-ecosystem/
│
├── serviceAccountKey.json          # Credenciales de Firebase Admin
├── .env                             # Variables de entorno (opcional)
│
├── data/
│   └── csv/                         # Carpeta con los 12 CSVs
│       ├── Copia de Administación_General - Clientes.csv
│       ├── Copia de Administación_General - Distribuidores.csv
│       └── ... (resto de CSVs)
│
├── scripts/
│   ├── importar-csv-firestore.js   # Script principal
│   └── README-IMPORTACION-CSV.md   # Esta guía
│
└── package.json
```

---

## 🚀 Instalación

### Paso 1: Instalar Dependencias

```bash
cd premium-ecosystem
npm install
```

### Paso 2: Crear Carpeta de CSVs

```bash
# Windows (PowerShell)
New-Item -ItemType Directory -Force -Path "data\csv"

# macOS/Linux
mkdir -p data/csv
```

### Paso 3: Copiar Archivos CSV

Copia los 12 archivos CSV a la carpeta `data/csv/`

### Paso 4: Descargar Service Account Key

1. Descarga `serviceAccountKey.json` desde Firebase Console
2. Colócalo en la raíz del proyecto

---

## 🎯 Uso Básico

### Importación Normal

```bash
npm run import:csv
```

### Dry-Run (Solo Validar, No Importar)

```bash
npm run import:csv -- --dry-run
```

### Modo Verbose (Más Detalles)

```bash
npm run import:csv -- --verbose
```

### Forzar Sobrescritura

```bash
npm run import:csv -- --force
```

### Combinar Opciones

```bash
npm run import:csv -- --dry-run --verbose
```

---

## 🔧 Modos de Ejecución

| Modo | Comando | Descripción |
|------|---------|-------------|
| **Normal** | `npm run import:csv` | Importa los datos a Firestore (no sobrescribe existentes) |
| **Dry-Run** | `npm run import:csv -- --dry-run` | Solo valida, NO escribe en Firestore |
| **Force** | `npm run import:csv -- --force` | Sobrescribe documentos existentes |
| **Verbose** | `npm run import:csv -- --verbose` | Muestra logs detallados de cada paso |

---

## 📊 Estructura de Datos

El script crea las siguientes colecciones y documentos en Firestore:

### Colecciones

#### 1. `bancos` (7 documentos)

```javascript
{
  id: "bovedaMonte",
  nombre: "Boveda Monte",
  saldo: 150000.00,
  tipo: "nacional",
  moneda: "MXN",
  activo: true,
  _importedAt: Timestamp,
  _source: "csv_import_script"
}
```

#### 2. `gastos` (N documentos)

```javascript
{
  fecha: "2024-01-15",
  monto: 5000.00,
  bancoOrigen: "bovedaMonte",
  destino: "Proveedor XYZ",
  concepto: "Compra de materiales",
  observaciones: "",
  tipo: "gasto",
  _importedAt: Timestamp,
  _source: "csv_import_script"
}
```

#### 3. `transferencias` (N documentos)

```javascript
{
  fecha: "2024-01-15",
  monto: 10000.00,
  bancoOrigen: "bovedaMonte",
  bancoDestino: "profit",
  concepto: "Transferencia interna",
  observaciones: "",
  tipo: "transferencia",
  _importedAt: Timestamp,
  _source: "csv_import_script"
}
```

#### 4. `clientes` (N documentos)

```javascript
{
  id: "Cliente-ABC",
  cliente: "Cliente ABC",
  actual: 50000.00,
  deuda: 30000.00,
  abonos: 20000.00,
  pendiente: 10000.00,
  observaciones: "",
  activo: true,
  _importedAt: Timestamp,
  _source: "csv_import_script"
}
```

#### 5. `distribuidores` (N documentos)

```javascript
{
  id: "Distribuidor-XYZ",
  distribuidor: "Distribuidor XYZ",
  costoTotal: 100000.00,
  abonos: 60000.00,
  pendiente: 40000.00,
  activo: true,
  _importedAt: Timestamp,
  _source: "csv_import_script"
}
```

#### 6. `ordenesCompra` (N documentos)

```javascript
{
  id: "OC-001",
  fecha: "2024-01-10",
  origen: "China",
  cantidad: 100,
  costoDistribuidor: 500000.00,
  costoTransporte: 50000.00,
  costoPorUnidad: 5500.00,
  costoTotal: 550000.00,
  deuda: 100000.00,
  estatus: "completada",
  _importedAt: Timestamp,
  _source: "csv_import_script"
}
```

#### 7. `ventas` (N documentos)

```javascript
{
  fecha: "2024-01-20",
  ocRelacionada: "OC-001",
  cantidad: 50,
  cliente: "Cliente ABC",
  ingresoBovedaMonte: 315000.00,
  precioVenta: 6300.00,
  ingresoTotal: 315000.00,
  flete: 5000.00,
  fleteUtilidad: 1000.00,
  utilidad: 40000.00,
  estatus: "completada",
  concepto: "",
  _importedAt: Timestamp,
  _source: "csv_import_script"
}
```

### Documentos Únicos

#### 8. `estadoGlobal/almacen`

```javascript
{
  ingresos: 5000,
  stockActual: 3200,
  salidas: 1800,
  ultimaActualizacion: Timestamp,
  _importedAt: Timestamp,
  _source: "csv_import_script"
}
```

#### 9. `productos/PROD-001`

```javascript
{
  id: "PROD-001",
  nombre: "Producto Principal",
  descripcion: "Producto principal de distribución",
  costo: 6300.00,
  precioVenta: 6300.00,
  activo: true,
  categoria: "general",
  _importedAt: Timestamp,
  _source: "csv_import_script"
}
```

---

## 🔍 Troubleshooting

### Error: "Archivo no encontrado"

**Problema:** El script no encuentra los archivos CSV.

**Solución:**

1. Verifica que los CSVs estén en `data/csv/`
2. Verifica que los nombres sean **exactamente** como se especifica
3. Ejecuta en modo verbose para ver la ruta completa:
   ```bash
   npm run import:csv -- --dry-run --verbose
   ```

### Error: "serviceAccountKey.json no encontrado"

**Problema:** Falta la clave de servicio de Firebase.

**Solución:**

1. Descarga la clave desde Firebase Console
2. Guárdala en la raíz del proyecto como `serviceAccountKey.json`
3. O en `config/serviceAccountKey.json`

### Error: "Permission denied"

**Problema:** La cuenta de servicio no tiene permisos suficientes.

**Solución:**

1. Ve a Firebase Console → IAM & Admin
2. Asegúrate de que la cuenta de servicio tenga el rol:
   - **Firebase Admin SDK Administrator Service Agent**
   - O **Owner**

### Error: "CSV parsing failed"

**Problema:** Algún CSV tiene formato incorrecto.

**Solución:**

1. Abre el CSV en un editor de texto
2. Verifica que tenga codificación UTF-8
3. Verifica que las comas estén correctamente escapadas
4. Elimina filas vacías al final del archivo

### Datos Incorrectos en Firestore

**Problema:** Los datos no se ven como esperabas.

**Solución:**

1. Ejecuta primero en modo `--dry-run` para validar
2. Revisa los logs detallados con `--verbose`
3. Verifica la estructura de los CSVs (headers, skipLines, etc.)

---

## ❓ FAQ

### ¿Puedo ejecutar el script múltiples veces?

**Sí**, pero ten en cuenta:

- **Sin `--force`**: Solo crea documentos nuevos, no sobrescribe existentes
- **Con `--force`**: Sobrescribe todos los documentos

### ¿Cómo valido antes de importar?

Usa el modo dry-run:

```bash
npm run import:csv -- --dry-run --verbose
```

Esto te mostrará:
- ✅ Archivos CSV encontrados
- ✅ Cantidad de documentos que se crearían
- ✅ Validaciones de estructura
- ❌ Errores de formato

### ¿Qué pasa si falla a mitad de la importación?

El script usa **batches** de Firestore, que son transacciones atómicas:

- Si un batch falla, solo ese batch se deshace
- Los batches anteriores ya están escritos
- Puedes volver a ejecutar el script (sin `--force`) para completar los faltantes

### ¿Cómo veo el progreso en tiempo real?

Usa el modo verbose:

```bash
npm run import:csv -- --verbose
```

Esto muestra:
- 📄 Cada archivo CSV siendo procesado
- 📊 Cantidad de filas parseadas
- 📦 Cada colección siendo importada
- ✅ Confirmaciones de éxito

### ¿Puedo personalizar los nombres de archivos?

**Sí**, edita el objeto `FILE_PATHS` en `importar-csv-firestore.js`:

```javascript
const FILE_PATHS = {
  clientes: 'MI_ARCHIVO_CLIENTES.csv',
  distribuidores: 'MI_ARCHIVO_DISTRIBUIDORES.csv',
  // ... etc
};
```

### ¿Cómo revierto la importación?

Si necesitas eliminar todos los datos importados:

```bash
# Modo manual desde Firebase Console
# O usa este script de limpieza:

npm run firestore:delete-all -- --collection bancos
npm run firestore:delete-all -- --collection gastos
# ... etc
```

> ⚠️ **ADVERTENCIA:** Esto eliminará TODOS los documentos de la colección.

### ¿El script maneja errores de red?

**Sí**, el script tiene manejo de errores que:

1. Captura errores de lectura de archivos
2. Captura errores de parsing de CSV
3. Captura errores de Firestore
4. Muestra mensajes descriptivos
5. Sale con código de error apropiado

### ¿Puedo usar esto en producción?

**SÍ**, pero sigue estas recomendaciones:

1. **Siempre ejecuta `--dry-run` primero**
2. **Haz un backup de Firestore antes**:
   ```bash
   npm run backup:firestore
   ```
3. **Ejecuta en horarios de bajo tráfico**
4. **Monitorea el uso de Firestore** (cuotas y costos)

### ¿Cómo actualizo datos existentes?

Usa el modo `--force`:

```bash
npm run import:csv -- --force
```

Esto **sobrescribirá** todos los documentos con los datos de los CSVs.

---

## 🎓 Mejores Prácticas

### 1. Validación Pre-Importación

```bash
# Paso 1: Validar archivos
npm run import:csv -- --dry-run

# Paso 2: Ver detalles
npm run import:csv -- --dry-run --verbose

# Paso 3: Importar
npm run import:csv
```

### 2. Backup Antes de Importar

```bash
npm run backup:firestore
npm run import:csv
```

### 3. Monitoreo Post-Importación

```bash
# Validar consistencia de datos
npm run db:check-consistency

# Ver estadísticas
npm run db:stats

# Verificar índices
npm run health:indexes
```

### 4. Limpieza de Datos Antiguos

Si necesitas limpiar antes de importar:

```javascript
// Usa Firebase Console o un script personalizado
// para eliminar colecciones antiguas
```

---

## 📚 Recursos Adicionales

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Firestore Batch Writes](https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes)
- [CSV Parser Documentation](https://github.com/mafintosh/csv-parser)
- [Project Documentation](../README.md)

---

## 🤝 Soporte

Si encuentras problemas:

1. Revisa la sección [Troubleshooting](#-troubleshooting)
2. Ejecuta en modo verbose para más detalles
3. Revisa los logs de Firebase Console
4. Abre un issue en el repositorio

---

## 📄 Licencia

Este script es parte del proyecto Premium Ecosystem.

---

**¡Listo para importar! 🚀**

```bash
npm run import:csv -- --dry-run --verbose
```
