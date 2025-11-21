# 🚀 GitHub Actions - Alternativa Gratuita a Cloud Functions

## ✅ Ventajas

- **100% Gratuito** (2,000 minutos/mes gratis en GitHub)
- **Sin necesidad de plan Blaze** en Firebase
- **Mismo resultado** que Cloud Functions
- **Fácil de configurar**

## 📋 Configuración en 3 Pasos

### 1️⃣ Generar Service Account Key

```bash
# Ir a Firebase Console
https://console.firebase.google.com/project/premium-ecosystem-1760790572/settings/serviceaccounts/adminsdk

# Clic en "Generate new private key"
# Descargar el archivo JSON
```

### 2️⃣ Agregar Secret en GitHub

```bash
# Ir a tu repositorio GitHub
https://github.com/zoro488/chronos-system/settings/secrets/actions

# Clic en "New repository secret"
# Name: FIREBASE_SERVICE_ACCOUNT
# Value: [Pegar todo el contenido del JSON descargado]
```

### 3️⃣ Push del Código

```powershell
cd C:\Users\xpovo\Documents\premium-ecosystem

git add .
git commit -m "feat: Add GitHub Actions automation (free alternative to Cloud Functions)"
git push origin main
```

## 🎯 Funcionalidades Implementadas

### ✅ Backup Diario
- **Cuándo**: Todos los días a las 2 AM (hora México)
- **Qué hace**: Respaldo automático de todas las colecciones críticas
- **Dónde**: Firestore > `backups` collection
- **Retención**: 7 días (borra backups antiguos)

### ✅ Reporte Semanal
- **Cuándo**: Todos los lunes a las 8 AM (hora México)
- **Qué hace**: Genera estadísticas de ventas, transacciones, capital
- **Dónde**: Firestore > `reportes` collection

### ✅ Verificación de Integridad
- **Cuándo**: Manual (desde GitHub Actions)
- **Qué hace**: Verifica consistencia de datos
- **Dónde**: Logs de GitHub Actions

## 🎮 Ejecución Manual

Puedes ejecutar cualquier tarea manualmente desde:
```
https://github.com/zoro488/chronos-system/actions
```

1. Selecciona "Chronos System Automation"
2. Clic en "Run workflow"
3. Selecciona la tarea (backup, weekly-report, verify-integrity, all)
4. Clic en "Run workflow"

## 📊 Monitoreo

Ver resultados de las ejecuciones:
```
https://github.com/zoro488/chronos-system/actions
```

## 🔧 Scripts Creados

### `scripts/backup-daily.js`
- Backup automático de colecciones críticas
- Limpieza de backups antiguos (>7 días)
- Logs detallados en GitHub Actions

### `scripts/weekly-report.js`
- Reporte de ventas de la última semana
- Métricas financieras (capital, adeudos, liquidez)
- Estadísticas de transacciones

## 💰 Costos

**$0.00 USD/mes** 
- GitHub Actions: 2,000 minutos gratis/mes
- Uso estimado: ~5 minutos/mes
- Firebase Spark Plan: Gratis (sin Cloud Functions)

## 🆚 Comparación con Cloud Functions

| Característica | GitHub Actions | Cloud Functions |
|---|---|---|
| Costo | **Gratis** | $3-10/mes |
| Setup | Secret de GitHub | Plan Blaze |
| Backups diarios | ✅ | ✅ |
| Reportes semanales | ✅ | ✅ |
| Triggers en tiempo real | ❌ | ✅ |
| HTTP endpoints | ❌ | ✅ |

## ⚡ Para Triggers en Tiempo Real

Si necesitas triggers (ej: actualizar RF Actual al crear operación), implementa la lógica en el **frontend**:

```javascript
// En lugar de Cloud Function trigger
async function crearOperacionBanco(data) {
  // 1. Crear operación
  await db.collection('transaccionesBanco').add(data);
  
  // 2. Actualizar RF Actual (manualmente)
  const banco = await db.collection('bancos').doc(data.bancoId).get();
  const nuevoSaldo = banco.data().saldo + data.monto;
  await db.collection('bancos').doc(data.bancoId).update({ saldo: nuevoSaldo });
  
  // 3. Crear registro histórico
  await db.collection('bancosRfActual').add({
    bancoId: data.bancoId,
    saldo: nuevoSaldo,
    fecha: new Date()
  });
}
```

## 🎯 Siguiente Paso

**Ejecuta los comandos del paso 3** para activar la automatización:

```powershell
cd C:\Users\xpovo\Documents\premium-ecosystem
git add .
git commit -m "feat: Add GitHub Actions automation"
git push origin main
```

¡Y listo! Sistema completamente automatizado **sin costos** 🎉
