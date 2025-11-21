# 📊 Sistema de Importación CSV → Firestore

> Sistema completo para importar los 12 archivos CSV del sistema administrativo a Firebase Firestore con validación, separación de gastos/transferencias y manejo robusto de errores.

---

## 🚀 Inicio Rápido (3 Pasos)

### 1. Instalar Dependencias
```bash
npm install firebase-admin csv-parser
```

### 2. Verificar Setup
```bash
npm run test:csv-setup
```

### 3. Importar Datos
```bash
npm run validate:csv              # Validar archivos
npm run import:csv:dry-run        # Simular importación
npm run import:csv                # Importar a Firestore
```

---

## 📚 Documentación

### Para Empezar
- **[INSTALACION-CSV-IMPORT.md](../INSTALACION-CSV-IMPORT.md)** - Instalación y requisitos
- **[QUICKSTART-CSV.md](./QUICKSTART-CSV.md)** - Guía de 5 minutos

### Documentación Completa
- **[README-IMPORTACION-CSV.md](./README-IMPORTACION-CSV.md)** - Guía detallada (8,000+ palabras)
- **[RESUMEN-IMPORTACION-CSV.md](./RESUMEN-IMPORTACION-CSV.md)** - Overview técnico completo

### Recursos
- **[data/csv/README.md](../data/csv/README.md)** - Instrucciones para archivos CSV

---

## 🎯 Archivos del Sistema

### Scripts Principales

| Archivo | Descripción | Líneas |
|---------|-------------|--------|
| `importar-csv-firestore.js` | Script principal de importación | 952 |
| `validar-csv.js` | Validador de archivos CSV | 370 |
| `test-csv-setup.js` | Test de preparación | 150 |

### Características

✅ Lee 12 archivos CSV y los estructura para Firestore
✅ Separa gastos reales de transferencias entre bancos
✅ Procesa deudas/abonos históricos de clientes
✅ Validación exhaustiva antes de importar
✅ Manejo robusto de errores con rollback
✅ Progress tracking en tiempo real
✅ Modo dry-run para simulación
✅ Compatible con Firebase Admin SDK v12

---

## 📦 Comandos Disponibles

### Validación
```bash
npm run validate:csv              # Validar archivos CSV
npm run test:csv-setup            # Test de preparación
```

### Importación
```bash
npm run import:csv                # Importación normal
npm run import:csv:dry-run        # Solo simular (no importa)
npm run import:csv:verbose        # Con logs detallados
npm run import:csv:force          # Sobrescribir existentes
```

### Verificación
```bash
npm run db:stats                  # Estadísticas de Firestore
npm run db:check-consistency      # Validar consistencia
npm run health:firestore          # Health check
```

---

## 📊 Datos Generados

### 9 Colecciones en Firestore

| Colección | Documentos | Descripción |
|-----------|-----------|-------------|
| `bancos` | 7 | Cuentas bancarias |
| `gastos` | ~150 | Gastos reales |
| `transferencias` | ~45 | Movimientos entre bancos |
| `clientes` | ~25 | Base de clientes |
| `distribuidores` | ~8 | Proveedores |
| `ordenesCompra` | ~35 | Historial OCs |
| `ventas` | ~120 | Historial ventas |
| `estadoGlobal/almacen` | 1 | Estado inventario |
| `productos/PROD-001` | 1 | Producto principal |

---

## 🔧 Requisitos

### Dependencias NPM
- `firebase-admin` - SDK de Firebase Admin
- `csv-parser` - Parser de archivos CSV
- `dotenv` - Variables de entorno ✅ (ya instalado)

### Archivos Necesarios
- `serviceAccountKey.json` - Credenciales de Firebase (descargar desde Console)
- 12 archivos CSV en `data/csv/` (listado en documentación)

---

## 🎓 Flujo de Trabajo

```mermaid
graph LR
    A[Instalar Deps] --> B[Test Setup]
    B --> C[Preparar CSVs]
    C --> D[Validar]
    D --> E[Dry-Run]
    E --> F[Importar]
    F --> G[Verificar]
```

1. **Instalar** → `npm install firebase-admin csv-parser`
2. **Test** → `npm run test:csv-setup`
3. **Preparar** → Colocar CSVs y serviceAccountKey.json
4. **Validar** → `npm run validate:csv`
5. **Dry-Run** → `npm run import:csv:dry-run`
6. **Importar** → `npm run import:csv`
7. **Verificar** → `npm run db:stats`

---

## 📖 Guías por Nivel

### 🟢 Principiante
1. Lee **[INSTALACION-CSV-IMPORT.md](../INSTALACION-CSV-IMPORT.md)**
2. Sigue **[QUICKSTART-CSV.md](./QUICKSTART-CSV.md)**
3. Ejecuta `npm run test:csv-setup`

### 🟡 Intermedio
1. Lee **[README-IMPORTACION-CSV.md](./README-IMPORTACION-CSV.md)**
2. Revisa estructura de datos esperada
3. Personaliza configuración en `.env`

### 🔴 Avanzado
1. Lee **[RESUMEN-IMPORTACION-CSV.md](./RESUMEN-IMPORTACION-CSV.md)**
2. Revisa código fuente de los scripts
3. Customiza lógica de procesamiento

---

## ❓ FAQ Rápido

**¿Cuánto tiempo toma?**
→ 1-2 minutos para ~400 documentos

**¿Puedo ejecutarlo múltiples veces?**
→ Sí, usa `--force` para sobrescribir

**¿Cómo revierto si algo sale mal?**
→ Haz backup antes: `npm run backup:firestore`

**¿Los datos son seguros?**
→ Sí, los CSVs no se commitean a Git (`.gitignore`)

**¿Funciona con Firebase gratuito?**
→ Sí, el plan Spark es suficiente

---

## 🐛 Troubleshooting

| Error | Solución |
|-------|----------|
| `firebase-admin not found` | `npm install firebase-admin` |
| `csv-parser not found` | `npm install csv-parser` |
| `serviceAccountKey.json not found` | Descargar desde Firebase Console |
| `CSV files not found` | Colocar en `data/csv/` |
| `Permission denied` | Verificar roles en Firebase IAM |

---

## 🎯 Estado del Proyecto

- ✅ Scripts implementados (3)
- ✅ Documentación completa (5 archivos)
- ✅ Comandos NPM configurados (6)
- ✅ Validación de archivos
- ✅ Test de preparación
- ✅ Protección de datos sensibles
- ⏳ Pendiente: Instalar `firebase-admin` y `csv-parser`
- ⏳ Pendiente: Obtener `serviceAccountKey.json`
- ⏳ Pendiente: Colocar archivos CSV

---

## 📞 Soporte

**Documentación Completa:**
→ [README-IMPORTACION-CSV.md](./README-IMPORTACION-CSV.md)

**Problemas Comunes:**
→ Sección Troubleshooting en README

**Test de Setup:**
→ `npm run test:csv-setup`

**Logs Detallados:**
→ `npm run import:csv:verbose`

---

## 📄 Licencia

Este sistema es parte del proyecto Premium Ecosystem.

---

**¡Listo para importar tus datos a Firestore! 🚀**

```bash
npm install firebase-admin csv-parser && npm run import:csv
```
