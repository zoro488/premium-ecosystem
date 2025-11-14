# ✅ Checklist de Verificación Post-Migración

Usa este checklist para asegurarte de que la migración fue exitosa y tu sistema está listo para operar.

---

## 🔍 1. Verificación en Firebase Console

### Colecciones Principales
- [ ] `ordenesCompra` - Verificar que contenga documentos con IDs tipo "OC0001"
- [ ] `distribuidores` - Verificar documentos con nombres de distribuidores
- [ ] `ventas` - Verificar ventas con fechas y montos
- [ ] `clientes` - Verificar clientes con deudas y abonos
- [ ] `bancos` - Verificar 7 documentos de bancos
- [ ] `gastosAbonos` - Verificar gastos y abonos generales

### Colecciones de Movimientos Bancarios
- [ ] `movimientosBancarios_bovedaMonte` - Ingresos Bóveda Monte
- [ ] `movimientosBancarios_bovedaUsa` - Ingresos Bóveda USA
- [ ] `movimientosBancarios_utilidades` - Ingresos Utilidades
- [ ] `movimientosBancarios_fletes` - Ingresos Fletes
- [ ] `movimientosBancarios_azteca` - Ingresos Azteca

### Colecciones de Gastos Detallados
- [ ] `gastos_bovedaMonte` - Gastos Bóveda Monte
- [ ] `gastos_bovedaUsa` - Gastos Bóveda USA
- [ ] `gastos_utilidades` - Gastos Utilidades
- [ ] `gastos_fletes` - Gastos Fletes
- [ ] `gastos_azteca` - Gastos Azteca

### Documentos en estadoGlobal
- [ ] `estadoGlobal/almacen` - Inventario de productos
- [ ] `estadoGlobal/cortesBovedaMonte` - Cortes de caja
- [ ] `estadoGlobal/cortesBovedaUsa` - Cortes de caja
- [ ] `estadoGlobal/cortesUtilidades` - Cortes de caja
- [ ] `estadoGlobal/cortesFletes` - Cortes de caja
- [ ] `estadoGlobal/metadata` - Metadata del sistema

---

## 📊 2. Validación de Datos

### Órdenes de Compra
```javascript
// Abrir una orden y verificar:
{
  ✓ id existe y no está vacío
  ✓ fecha es válida
  ✓ origen tiene nombre de distribuidor
  ✓ cantidad > 0
  ✓ costoTotal = cantidad × costoPorUnidad
}
```

### Bancos
```javascript
// Abrir un banco y verificar:
{
  ✓ id es un string válido (ej: "bovedaMonte")
  ✓ nombre es legible
  ✓ saldo es un número
  ✓ tipo es "nacional" o "internacional"
  ✓ moneda es "MXN" o "USD"
}
```

### Ventas
```javascript
// Abrir una venta y verificar:
{
  ✓ fecha existe
  ✓ cliente tiene nombre
  ✓ total es un número positivo
  ✓ deudaRestante ≤ total
}
```

---

## 🔧 3. Pruebas en la Aplicación

### Iniciar chronos-system
```bash
cd src/apps/FlowDistributor/chronos-system
npm run dev
```

### Dashboards a Verificar
- [ ] **Dashboard Principal** - Muestra métricas generales
- [ ] **Bancos** - Muestra saldos correctos de todas las cuentas
- [ ] **Ventas** - Lista de ventas con montos
- [ ] **Clientes** - Lista de clientes con deudas
- [ ] **Órdenes de Compra** - Lista de órdenes
- [ ] **Almacén** - Inventario de productos
- [ ] **Gastos** - Lista de gastos por categoría

### Funcionalidades a Probar
- [ ] **Crear nueva venta** - Sistema permite crear y guardar
- [ ] **Registrar abono** - Sistema actualiza deudas
- [ ] **Ver movimientos bancarios** - Se muestran ingresos/gastos
- [ ] **Generar reportes** - PDFs se generan correctamente
- [ ] **Filtros de fecha** - Funcionan en todos los módulos

---

## 🚨 4. Verificación de Integridad

### Totales Esperados (Basado en tu Excel)
- [ ] **Total Órdenes de Compra:** ~12,900,000 MXN
- [ ] **Total Ventas:** Verificar contra Excel
- [ ] **Deuda Clientes:** Suma debe coincidir con Excel
- [ ] **Saldos Bancarios:**
  - Bóveda Monte: ~5,722,280 MXN
  - Bóveda USA: ~1,760,270 USD
  - Utilidades: ~2,059,684 MXN
  - Fletes: ~1,206,256 MXN

### Queries de Verificación en Firestore
```javascript
// Contar documentos en cada colección
db.collection('ordenesCompra').count().get()
db.collection('ventas').count().get()
db.collection('clientes').count().get()
db.collection('bancos').count().get() // Debe ser 7
```

---

## ⚙️ 5. Configuración de Seguridad

### Reglas de Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Requiere autenticación para todas las operaciones
    match /{document=**} {
      allow read, write: if request.auth != null;
    }

    // Solo administradores pueden borrar
    match /{collection}/{document} {
      allow delete: if request.auth != null &&
                       request.auth.token.admin == true;
    }
  }
}
```

- [ ] Reglas de seguridad aplicadas
- [ ] Usuarios autorizados creados en Firebase Auth
- [ ] Roles de administrador asignados

### Índices Compuestos
Crear índices para consultas comunes:
- [ ] `ventas` - (clienteId, fecha)
- [ ] `ordenesCompra` - (origen, fecha)
- [ ] `movimientosBancarios_*` - (fecha, tipo)

---

## 📝 6. Documentación y Backup

### Backup de Datos
- [ ] Exportar colecciones principales
```bash
gcloud firestore export gs://[BUCKET_NAME]/[EXPORT_FOLDER]
```

### Documentación Interna
- [ ] Actualizar docs con nueva estructura de Firestore
- [ ] Documentar cambios en servicios (si los hubo)
- [ ] Crear guía de usuario para equipo

---

## 🎯 7. Optimizaciones Opcionales

### Performance
- [ ] Implementar caché local con React Query
- [ ] Agregar paginación en listas grandes
- [ ] Implementar lazy loading en componentes pesados

### Monitoreo
- [ ] Configurar alertas en Firebase Console
- [ ] Implementar logging de errores con Sentry
- [ ] Configurar Google Analytics para tracking

### Mejoras de UX
- [ ] Agregar loading states
- [ ] Implementar skeleton screens
- [ ] Agregar notificaciones toast para feedback

---

## ❌ Problemas Comunes y Soluciones

### 1. "No se muestran datos en la app"
**Solución:**
- Verificar que Firebase config esté correcta en `.env`
- Revisar reglas de seguridad en Firebase Console
- Confirmar que usuario esté autenticado

### 2. "Error al leer colección X"
**Solución:**
- Verificar que la colección existe en Firestore
- Revisar nombre de colección en el servicio
- Confirmar estructura de datos coincide con schema

### 3. "Sumas no coinciden"
**Solución:**
- Verificar que todos los datos se importaron
- Revisar conversiones de tipo de cambio (USD → MXN)
- Validar cálculos en servicios

### 4. "Lentitud en la app"
**Solución:**
- Implementar índices compuestos en Firestore
- Agregar paginación en consultas grandes
- Usar listeners solo donde sea necesario

---

## ✅ Migración Completada

Una vez que todos los items estén marcados, tu sistema chronos-system está **100% operativo** con todos los datos del Excel migrados correctamente.

### Siguientes Pasos Recomendados:
1. **Capacitar al equipo** en el nuevo sistema
2. **Establecer proceso de backup** automático
3. **Configurar ambiente de testing** separado
4. **Documentar procesos críticos** de negocio
5. **Planear roadmap de mejoras** futuras

---

**🎉 ¡Felicidades! Tu migración a Firestore está completa y lista para producción.**
