# 🚀 Script de Importación CSV → Firestore - COMPLETADO

## ✅ Archivos Creados

### 1. Script Principal de Importación
📄 **`scripts/importar-csv-firestore.js`**
- ✅ Importación completa de 12 archivos CSV a Firestore
- ✅ Separación inteligente de gastos vs transferencias
- ✅ Manejo robusto de errores con rollback
- ✅ Validación de datos pre-importación
- ✅ Progress tracking en tiempo real
- ✅ Soporte para dry-run y modo verbose
- ✅ Compatible con Firebase Admin SDK v12

**Características principales:**
- Lee 12 archivos CSV y los estructura correctamente
- Separa gastos reales de transferencias entre bancos
- Procesa deudas/abonos históricos de clientes y distribuidores
- Usa batches de Firestore para operaciones atómicas
- Genera 9 colecciones/documentos en Firestore
- Metadata de importación en cada documento

### 2. Script de Validación
📄 **`scripts/validar-csv.js`**
- ✅ Valida existencia de todos los archivos
- ✅ Verifica estructura de headers
- ✅ Detecta filas vacías o incompletas
- ✅ Valida tipos de datos (números, fechas)
- ✅ Identifica duplicados
- ✅ Genera reporte JSON detallado

### 3. Documentación Completa
📄 **`scripts/README-IMPORTACION-CSV.md`**
- ✅ Guía detallada de 8000+ palabras
- ✅ Requisitos previos paso a paso
- ✅ Estructura de datos esperada
- ✅ Troubleshooting completo
- ✅ FAQ con 15+ preguntas comunes
- ✅ Mejores prácticas de importación

### 4. Guía de Inicio Rápido
📄 **`scripts/QUICKSTART-CSV.md`**
- ✅ Setup en 5 minutos
- ✅ Comandos esenciales
- ✅ Verificación post-importación
- ✅ Resolución rápida de problemas

### 5. README de Carpeta CSV
📄 **`data/csv/README.md`**
- ✅ Listado de archivos requeridos
- ✅ Instrucciones de colocación
- ✅ Tips de formato y encoding
- ✅ Comandos de verificación

### 6. Protección de Datos
📄 **`data/csv/.gitignore`**
- ✅ Ignora archivos CSV reales (datos sensibles)
- ✅ Permite templates y ejemplos
- ✅ Protección automática contra commits accidentales

### 7. Configuración de Variables
📄 **`.env.example`** (actualizado)
- ✅ Sección de configuración CSV añadida
- ✅ Variables para dry-run, force, verbose
- ✅ Configuración de batch limits

### 8. Scripts NPM
📄 **`package.json`** (actualizado)
- ✅ `npm run import:csv` - Importación normal
- ✅ `npm run import:csv:dry-run` - Solo validación
- ✅ `npm run import:csv:verbose` - Logs detallados
- ✅ `npm run import:csv:force` - Sobrescribir existentes
- ✅ `npm run validate:csv` - Validar archivos CSV

---

## 📊 Estructura de Datos Generada

### Colecciones Creadas (9 en total)

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
  _importedAt: Timestamp
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
  tipo: "transferencia",
  _importedAt: Timestamp
}
```

#### 4. `clientes` (N documentos)
```javascript
{
  id: "Cliente-ABC",
  cliente: "Cliente ABC",
  deuda: 30000.00,
  abonos: 20000.00,
  pendiente: 10000.00,
  activo: true,
  _importedAt: Timestamp
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
  _importedAt: Timestamp
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
  _importedAt: Timestamp
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
  utilidad: 40000.00,
  estatus: "completada",
  _importedAt: Timestamp
}
```

#### 8. `estadoGlobal/almacen` (1 documento)
```javascript
{
  ingresos: 5000,
  stockActual: 3200,
  salidas: 1800,
  ultimaActualizacion: Timestamp,
  _importedAt: Timestamp
}
```

#### 9. `productos/PROD-001` (1 documento)
```javascript
{
  id: "PROD-001",
  nombre: "Producto Principal",
  descripcion: "Producto principal de distribución",
  costo: 6300.00,
  precioVenta: 6300.00,
  activo: true,
  categoria: "general",
  _importedAt: Timestamp
}
```

---

## 🎯 Flujo de Uso Completo

### 1️⃣ Preparación (Primera vez)

```bash
# Instalar dependencias
npm install

# Crear carpeta de CSVs
mkdir -p data/csv

# Descargar Service Account Key desde Firebase Console
# Guardarlo como serviceAccountKey.json en la raíz
```

### 2️⃣ Colocar Archivos CSV

```bash
# Copiar los 12 archivos CSV a data/csv/
cp /ruta/origen/*.csv data/csv/
```

### 3️⃣ Validar Archivos

```bash
# Validar estructura y contenido
npm run validate:csv
```

**Salida esperada:**
```
✓ Clientes (45.23 KB)
✓ Distribuidores (23.45 KB)
✓ Control Maestro (89.12 KB)
...
✓ Todos los archivos CSV son válidos
✓ Puedes proceder con la importación
```

### 4️⃣ Dry-Run (Simulación)

```bash
# Validar SIN importar a Firestore
npm run import:csv:dry-run
```

**Salida esperada:**
```
✓ Bancos: 7, Gastos: 150, Transferencias: 45
✓ Clientes: 25
✓ Distribuidores: 8
[DRY-RUN] Se importarían 7 documentos a 'bancos'
[DRY-RUN] Se importarían 150 documentos a 'gastos'
...
```

### 5️⃣ Importar Datos

```bash
# Importación real a Firestore
npm run import:csv
```

**Salida esperada:**
```
✓ Firebase inicializado correctamente (Proyecto: premium-ecosystem)
✓ Todos los archivos CSV encontrados
✓ bancos: 7 documentos importados
✓ gastos: 150 documentos importados
✓ transferencias: 45 documentos importados
...
✅ IMPORTACIÓN COMPLETADA EXITOSAMENTE
```

### 6️⃣ Verificación Post-Importación

```bash
# Ver estadísticas de Firestore
npm run db:stats

# Verificar consistencia de datos
npm run db:check-consistency

# Verificar índices necesarios
npm run health:indexes
```

---

## 🔧 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run validate:csv` | Validar archivos CSV (existencia, estructura, datos) |
| `npm run import:csv` | Importar datos a Firestore (modo normal) |
| `npm run import:csv:dry-run` | Solo validar SIN importar |
| `npm run import:csv:verbose` | Importar con logs detallados |
| `npm run import:csv:force` | Sobrescribir documentos existentes |
| `npm run import:csv -- --dry-run --verbose` | Combinar opciones |

---

## ✅ Características Destacadas

### 🔐 Seguridad
- ✅ Archivos CSV excluidos de Git automáticamente
- ✅ Validación de Service Account Key
- ✅ Metadata de auditoría en cada documento
- ✅ Protección contra commits accidentales

### 🚀 Performance
- ✅ Batches de Firestore (hasta 499 operaciones)
- ✅ Operaciones atómicas con rollback
- ✅ Procesamiento paralelo de archivos
- ✅ Progress tracking en tiempo real

### 🛡️ Robustez
- ✅ Validación exhaustiva pre-importación
- ✅ Manejo de errores detallado
- ✅ Sanitización de IDs (caracteres especiales)
- ✅ Normalización de strings (acentos, espacios)
- ✅ Parseo inteligente de monedas y fechas

### 📊 Observabilidad
- ✅ Logs con colores y emojis
- ✅ Modo verbose para debugging
- ✅ Reporte de validación en JSON
- ✅ Timestamps de importación
- ✅ Source tracking (`_source`)

### 🎨 UX
- ✅ Documentación exhaustiva en español
- ✅ Ejemplos de uso reales
- ✅ Troubleshooting completo
- ✅ FAQ con 15+ preguntas
- ✅ ASCII art y UI amigable

---

## 📚 Documentación Relacionada

| Archivo | Descripción |
|---------|-------------|
| [README-IMPORTACION-CSV.md](./scripts/README-IMPORTACION-CSV.md) | Guía completa de importación |
| [QUICKSTART-CSV.md](./scripts/QUICKSTART-CSV.md) | Inicio rápido (5 minutos) |
| [data/csv/README.md](./data/csv/README.md) | Instrucciones de la carpeta CSV |
| [.env.example](./.env.example) | Variables de entorno |

---

## 🎓 Mejores Prácticas

### Antes de Importar
1. ✅ **Siempre ejecuta `validate:csv`** primero
2. ✅ **Usa `--dry-run`** para simular la importación
3. ✅ **Haz backup** de Firestore: `npm run backup:firestore`
4. ✅ **Verifica el Service Account Key** tenga permisos

### Durante la Importación
1. ✅ **Monitorea la consola** para detectar errores
2. ✅ **No interrumpas** el proceso (los batches son atómicos)
3. ✅ **Usa `--verbose`** si necesitas debugging

### Después de Importar
1. ✅ **Verifica datos**: `npm run db:stats`
2. ✅ **Revisa índices**: `npm run health:indexes`
3. ✅ **Valida consistencia**: `npm run db:check-consistency`
4. ✅ **Crea índices compuestos** si es necesario

---

## 🐛 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| Archivo no encontrado | Verifica nombres exactos en `data/csv/` |
| Service Account error | Descarga nueva key desde Firebase Console |
| Permission denied | Verifica roles en IAM (Firebase Admin SDK Administrator) |
| CSV parsing failed | Verifica encoding UTF-8 y formato correcto |
| Batch write failed | Revisa cuotas de Firestore y plan actual |

---

## 🎉 Resultado Final

Al completar la importación, tendrás:

- ✅ **9 colecciones/documentos** en Firestore
- ✅ **Datos históricos** de gastos, ventas, clientes
- ✅ **Separación clara** de gastos vs transferencias
- ✅ **Metadata completa** para auditoría
- ✅ **Estructura optimizada** para FlowDistributor/Chronos System

**Estructura compatible con:**
- 🎯 FlowDistributor - Gestión de flujos
- 💰 Chronos System - Dashboard financiero
- 📊 SmartSales - Sistema de ventas
- 👥 ClientHub - CRM empresarial
- 📈 AnalyticsPro - Analytics

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa la sección Troubleshooting en [README-IMPORTACION-CSV.md](./scripts/README-IMPORTACION-CSV.md)
2. Ejecuta en modo verbose: `npm run import:csv:verbose`
3. Revisa logs de Firebase Console
4. Consulta el reporte de validación: `validation-report.json`

---

## 📄 Licencia

Este script es parte del proyecto Premium Ecosystem.

---

**¡Todo listo para importar tus datos! 🚀**

```bash
# Validar → Dry-Run → Importar
npm run validate:csv && npm run import:csv:dry-run && npm run import:csv
```
