# 🚀 Inicio Rápido - Importación CSV

> Guía de 5 minutos para importar tus datos CSV a Firestore

## ⚡ Setup Rápido

### 1️⃣ Instalar Dependencias (30 seg)

```bash
npm install
```

### 2️⃣ Obtener Service Account Key (2 min)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Abre tu proyecto → **⚙️ Project Settings**
3. Pestaña **Service Accounts**
4. Click **Generate New Private Key**
5. Guarda como `serviceAccountKey.json` en la raíz del proyecto

```
premium-ecosystem/
├── serviceAccountKey.json  ← Aquí
└── scripts/
```

### 3️⃣ Preparar Archivos CSV (1 min)

Crea la carpeta y copia tus CSVs:

```bash
# Windows (PowerShell)
New-Item -ItemType Directory -Force -Path "data\csv"

# macOS/Linux
mkdir -p data/csv
```

Copia tus 12 archivos CSV a `data/csv/`:

```
data/csv/
├── Copia de Administación_General - Clientes.csv
├── Copia de Administación_General - Distribuidores.csv
├── Copia de Administación_General - Control_Maestro.csv
├── Copia de Administación_General - Almacen_Monte.csv
└── ... (7 archivos de bancos más)
```

### 4️⃣ Validar Antes de Importar (30 seg)

```bash
npm run import:csv:dry-run
```

✅ Si todo está bien, verás:
```
✓ Bancos: 7, Gastos: 150, Transferencias: 45
✓ Clientes: 25
✓ Distribuidores: 8
✓ Órdenes de Compra: 35
✓ Ventas: 120
```

### 5️⃣ Importar Datos (1 min)

```bash
npm run import:csv
```

## ✅ Verificación Post-Importación

```bash
# Ver estadísticas
npm run db:stats

# Verificar consistencia
npm run db:check-consistency
```

## 📊 ¿Qué Colecciones se Crean?

| Colección | Documentos | Descripción |
|-----------|-----------|-------------|
| `bancos` | 7 | Cuentas bancarias |
| `gastos` | ~150 | Gastos reales |
| `transferencias` | ~45 | Movimientos entre bancos |
| `clientes` | ~25 | Base de clientes |
| `distribuidores` | ~8 | Proveedores |
| `ordenesCompra` | ~35 | Historial OCs |
| `ventas` | ~120 | Historial ventas |
| `estadoGlobal/almacen` | 1 | Estado del inventario |
| `productos/PROD-001` | 1 | Producto principal |

## 🔧 Comandos Útiles

### Modo Desarrollo
```bash
# Validar sin importar
npm run import:csv:dry-run

# Ver logs detallados
npm run import:csv:verbose

# Combinar ambos
npm run import:csv -- --dry-run --verbose
```

### Modo Producción
```bash
# Backup antes de importar
npm run backup:firestore

# Importar datos
npm run import:csv

# Forzar sobrescritura (⚠️ CUIDADO)
npm run import:csv:force
```

## ❌ Problemas Comunes

### "serviceAccountKey.json no encontrado"
```bash
# Asegúrate de que esté en la raíz
ls serviceAccountKey.json  # macOS/Linux
dir serviceAccountKey.json # Windows
```

### "Archivo CSV no encontrado"
```bash
# Verifica que estén en data/csv/
ls data/csv/  # macOS/Linux
dir data\csv\ # Windows
```

### "Permission denied"
Ve a Firebase Console → IAM & Admin y verifica que la cuenta tenga permisos.

## 📚 Documentación Completa

Para más detalles, consulta:
- [README-IMPORTACION-CSV.md](./README-IMPORTACION-CSV.md) - Guía completa
- [FAQ](#) - Preguntas frecuentes
- [Troubleshooting](#) - Solución de problemas

## 🎯 Próximos Pasos

Después de importar:

1. **Verificar datos**: `npm run db:stats`
2. **Crear índices**: Revisa Firebase Console → Firestore → Indexes
3. **Configurar reglas de seguridad**: `firestore.rules`
4. **Iniciar aplicación**: `npm run dev`

---

**¿Listo? ¡Vamos!** 🚀

```bash
npm run import:csv:dry-run && npm run import:csv
```
