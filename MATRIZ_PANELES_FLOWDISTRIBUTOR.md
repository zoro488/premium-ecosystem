# 📊 MATRIZ DE PANELES FLOWDISTRIBUTOR - ESTADO DE MIGRACIÓN

**Fecha actualización:** 2025-01-28
**Sistema:** FlowDistributor / Chronos Premium Ecosystem
**Progreso Total:** ██░░░░░░░░░░░░░░░░░░ 2% (1/50 paneles)

---

## 🎯 RESUMEN EJECUTIVO

| Métrica | Actual | Objetivo |
|---------|--------|----------|
| **Paneles Totales** | 50 | 50 |
| **Firebase Conectados** | 1 (GYA) | 50 |
| **Usando Zustand** | 13 | 0 |
| **Usando JSON Local** | 36 | 0 |
| **Colecciones Firebase** | 1 | 15+ |
| **Documentos Firestore** | 306 | ~5,000+ |
| **Progreso** | 2% | 100% |

---

## 📋 TABLA MAESTRA DE PANELES

### Leyenda de Estados
- ✅ **Completado** - Migrado a Firebase, funcionando
- 🟡 **Verificar** - Ya tiene hook Firebase, confirmar datos
- 🔄 **En Proceso** - Migración iniciada
- ⏳ **Pendiente** - Sin iniciar migración
- 🚫 **No Migrar** - Backup/deprecated

### Leyenda de Prioridades
- 🔥 **CRÍTICA** - Impacta operación diaria
- ⚡ **ALTA** - Datos financieros importantes
- 📊 **MEDIA** - Reportes y análisis
- 📝 **BAJA** - Duplicados o secundarios

---

## 🏦 CATEGORÍA A: PANELES BANCARIOS (13 paneles)

| # | Panel | Estado | Prioridad | Colección Firebase | Fuente Actual | Registros Est. | Fase |
|---|-------|--------|-----------|-------------------|---------------|----------------|------|
| ✅ | **PanelGYA.jsx** | ✅ Completado | 🔥 CRÍTICA | `gya` | N/A | **306** | 0 |
| 1 | **PanelBovedaMonte.jsx** | ⏳ Pendiente | ⚡ ALTA | `boveda_monte` | Zustand `bancos.bovedaMonte` | ~200 | 1 |
| 2 | **PanelBovedaMonteNuevo.jsx** | ⏳ Pendiente | 📝 BAJA | `boveda_monte` | Zustand `bancos.bovedaMonte` | Duplicado ↑ | 6 |
| 3 | **PanelBovedaUSA.jsx** | ⏳ Pendiente | ⚡ ALTA | `boveda_usa` | Zustand `bancos.bovedaUsa` | ~180 | 1 |
| 4 | **PanelBovedaUSASupremo.jsx** | ⏳ Pendiente | 📝 BAJA | `boveda_usa` | Zustand `bancos.bovedaUsa` | Duplicado ↑ | 6 |
| 5 | **PanelAzteca.jsx** | ⏳ Pendiente | ⚡ ALTA | `azteca` | Zustand `bancos.azteca` | ~250 | 1 |
| 6 | **PanelFleteSur.jsx** | ⏳ Pendiente | ⚡ ALTA | `flete_sur` | Zustand `bancos.fleteSur` | ~150 | 1 |
| 7 | **PanelLeftie.jsx** | ⏳ Pendiente | ⚡ ALTA | `leftie` | Zustand `bancos.leftie` | ~100 | 1 |
| 8 | **PanelUtilidades.jsx** | ⏳ Pendiente | ⚡ ALTA | `utilidades` | Zustand `bancos.utilidades` | ~180 | 2 |
| 9 | **PanelUtilidadesNuevo.jsx** | ⏳ Pendiente | 📝 BAJA | `utilidades` | Zustand `bancos.utilidades` | Duplicado ↑ | 6 |
| 10 | **PanelProfit.jsx** | ⏳ Pendiente | ⚡ ALTA | `profit` | Zustand `bancos.profit` | ~400 | 2 |
| 11 | **PanelGYA.OLD.jsx** | 🚫 No Migrar | 📝 BAJA | N/A | Backup antiguo | 0 | - |
| 12 | **PanelGYA.backup.jsx** | 🚫 No Migrar | 📝 BAJA | N/A | Backup antiguo | 0 | - |
| 13 | **PanelGYAReal.jsx** | ⏳ Pendiente | 📊 MEDIA | `gya_real` | JSON `gyaData` | ~300 | 4 |

**Subtotal:** 13 paneles | 1 completado | 9 pendientes críticos | 3 duplicados/backup

---

## 📦 CATEGORÍA B: PANELES DE ALMACÉN (3 paneles)

| # | Panel | Estado | Prioridad | Colecciones Firebase | Fuente Actual | Registros Est. | Fase |
|---|-------|--------|-----------|---------------------|---------------|----------------|------|
| 14 | **PanelAlmacen.jsx** | ⏳ Pendiente | ⚡ ALTA | `almacen_ordenes`<br>`almacen_salidas`<br>`almacen_cortes` | JSON `datosEjemploAlmacen`<br>`ORDENES_COMPRA_ALMACEN`<br>`SALIDAS_ALMACEN`<br>`RF_ACTUAL_CORTES` | ~50<br>~40<br>~30 | 3 |

**Notas Almacén:**
- **Complejidad:** 3 colecciones relacionadas
- **Datos:** Órdenes de compra, salidas de productos, cortes RF actual
- **Widgets Custom:** OrdenWidget, SalidaWidget requieren adaptación

**Subtotal:** 1 panel (multi-colección) | 0 completados | 1 pendiente crítico

---

## 📊 CATEGORÍA C: PANELES DE VENTAS (4 paneles)

| # | Panel | Estado | Prioridad | Colección Firebase | Fuente Actual | Registros Est. | Fase |
|---|-------|--------|-----------|-------------------|---------------|----------------|------|
| 15 | **PanelVentas.jsx** | ⏳ Pendiente | 🔥 CRÍTICA | `ventas_local` | JSON `VENTAS_LOCAL` | **97** | 4 |
| 16 | **PanelVentaLocal.jsx** | ⏳ Pendiente | 📝 BAJA | `ventas_local` | JSON `VENTAS_LOCAL` | Duplicado ↑ | 6 |
| 17 | **PanelControlMaestro.jsx** | ⏳ Pendiente | 🔥 CRÍTICA | `control_maestro` | JSON `ventasLocalesData` | ~97 | 4 |
| 18 | **PanelReportes.jsx** | ⏳ Pendiente | 📊 MEDIA | `reportes` | Calculado dinámicamente | 0 (agregaciones) | 8 |

**Notas Ventas:**
- **PanelVentas**: Sistema IA predictivo, análisis 360° clientes
- **PanelControlMaestro**: Control maestro con RF Actual consolidado
- **PanelReportes**: Reportes generados desde otras colecciones

**Subtotal:** 4 paneles | 0 completados | 2 críticos | 1 duplicado | 1 reportes

---

## 👥 CATEGORÍA D: PANELES DE CLIENTES (2 paneles)

| # | Panel | Estado | Prioridad | Colección Firebase | Hook Actual | Registros Est. | Fase |
|---|-------|--------|-----------|-------------------|-------------|----------------|------|
| 19 | **PanelClientes.jsx** | 🟡 Verificar | ⚡ ALTA | `clientes` | ✅ `useClientes()` | ~50 | 5 |

**Estado Actual:**
```javascript
// ✅ YA USA FIREBASE
const { clientes, estadisticas, isLoading, error } = useClientes({
  nombre: searchTerm,
  categoria: filtroCategoria
});
```

**Acciones Requeridas:**
- ✅ Hook existe: `useClientes()`
- ⚠️ **Verificar:** ¿Datos cargados en Firestore?
- ⚠️ **Verificar:** ¿Estructura de colección correcta?
- ⚠️ **Verificar:** ¿Stats calculados correctamente?

**Subtotal:** 1 panel | Hook Firebase existente | Requiere verificación

---

## 🚚 CATEGORÍA E: PANELES DE DISTRIBUIDORES (3 paneles)

| # | Panel | Estado | Prioridad | Colección Firebase | Fuente Actual | Registros Est. | Fase |
|---|-------|--------|-----------|-------------------|---------------|----------------|------|
| 20 | **PanelDistribuidores.jsx** | ⏳ Pendiente | ⚡ ALTA | `distribuidores` | LocalStorage + JSON `ORDENES_COMPRA` | ~30 | 5 |
| 21 | **PanelDistribuidoresCompleto.jsx** | ⏳ Pendiente | 📝 BAJA | `distribuidores` | Similar al anterior | Duplicado ↑ | 6 |

**Notas Distribuidores:**
- **Fuente actual:** LocalStorage con `useLocalStorage` hook
- **Consolidación:** Datos consolidados desde órdenes de compra
- **Funcionalidad:** Perfiles, pagos, abonos, tracking órdenes

**Subtotal:** 2 paneles | 0 completados | 1 crítico | 1 duplicado

---

## 📝 CATEGORÍA F: PANELES DE ÓRDENES DE COMPRA (2 paneles)

| # | Panel | Estado | Prioridad | Colección Firebase | Hook Actual | Registros Est. | Fase |
|---|-------|--------|-----------|-------------------|-------------|----------------|------|
| 22 | **PanelOrdenesCompra.jsx** | 🟡 Verificar | 🔥 CRÍTICA | `ordenes_compra` | ✅ `useOrdenesCompra()` | ~150 | 5 |
| 23 | **PanelOrdenesCompraAAA.jsx** | ⏳ Pendiente | 📝 BAJA | `ordenes_compra` | Similar al anterior | Duplicado ↑ | 6 |

**Estado Actual:**
```javascript
// ✅ YA USA FIREBASE + TANSTACK QUERY
const {
  ordenes,
  todasLasOrdenes,
  estadisticas,
  distribuidoresUnicos,
  isLoading,
  error,
  addOrden,
  removeOrden,
} = useOrdenesCompra(filtros);
```

**Acciones Requeridas:**
- ✅ Hook existe: `useOrdenesCompra()`
- ✅ Integrado con TanStack Query
- ⚠️ **Verificar:** ¿Datos cargados en Firestore?
- ⚠️ **Verificar:** ¿CRUD operations funcionan?
- ⚠️ **Verificar:** ¿Filtros y estadísticas correctos?

**Subtotal:** 2 paneles | 1 con hook Firebase (verificar) | 1 duplicado

---

## 🗂️ CATEGORÍA G: OTROS PANELES (25 paneles restantes)

| # | Panel | Estado | Prioridad | Categoría | Fase |
|---|-------|--------|-----------|-----------|------|
| 24 | **PanelDashboard.jsx** | ⏳ Pendiente | 🔥 CRÍTICA | Dashboard Principal | 7 |
| 25 | **PanelResumen.jsx** | ⏳ Pendiente | ⚡ ALTA | Resumen Ejecutivo | 7 |
| 26 | **PanelTransferencias.jsx** | ⏳ Pendiente | ⚡ ALTA | Transferencias Entre Bancos | 2 |
| 27 | **PanelCortesRF.jsx** | ⏳ Pendiente | ⚡ ALTA | Cortes RF Consolidados | 2 |
| 28 | **PanelGastos.jsx** | ⏳ Pendiente | ⚡ ALTA | Gastos Generales | 4 |
| 29 | **PanelAbonos.jsx** | ⏳ Pendiente | ⚡ ALTA | Abonos y Pagos | 4 |
| 30 | **PanelFletes.jsx** | ⏳ Pendiente | ⚡ ALTA | Gestión de Fletes | 4 |
| 31 | **PanelProductos.jsx** | ⏳ Pendiente | 📊 MEDIA | Catálogo Productos | 5 |
| 32 | **PanelInventario.jsx** | ⏳ Pendiente | 📊 MEDIA | Control Inventario | 5 |
| 33 | **PanelProveedores.jsx** | ⏳ Pendiente | 📊 MEDIA | Gestión Proveedores | 5 |
| 34 | **PanelAnalytics.jsx** | ⏳ Pendiente | 📊 MEDIA | Analytics Avanzado | 7 |
| 35 | **PanelIA.jsx** | ⏳ Pendiente | 📊 MEDIA | IA Predictiva | 7 |
| 36 | **PanelExportar.jsx** | ⏳ Pendiente | 📝 BAJA | Exportación Datos | 8 |
| 37 | **PanelConfiguracion.jsx** | ⏳ Pendiente | 📝 BAJA | Configuración Sistema | 8 |
| 38-50 | **Otros paneles específicos** | ⏳ Pendiente | Variado | Funcionalidades específicas | 6-8 |

**Nota:** Listado completo requiere inspección detallada de todos los archivos Panel*.jsx

**Subtotal:** ~25 paneles adicionales | Todos pendientes | Prioridades variadas

---

## 📈 GRÁFICO DE PROGRESO POR FASE

```
Fase 0: PanelGYA                    ████████████████████ 100% ✅ COMPLETADA
Fase 1: Bancos Críticos (5)         ░░░░░░░░░░░░░░░░░░░░   0% ⏳ Pendiente
Fase 2: Bancos Secundarios (2)      ░░░░░░░░░░░░░░░░░░░░   0% ⏳ Pendiente
Fase 3: Almacén (1)                 ░░░░░░░░░░░░░░░░░░░░   0% ⏳ Pendiente
Fase 4: Ventas (4)                  ░░░░░░░░░░░░░░░░░░░░   0% ⏳ Pendiente
Fase 5: Clientes/Distrib (4)       ░░░░░░░░░░░░░░░░░░░░   0% 🟡 Verificar hooks
Fase 6: Consolidación (10)          ░░░░░░░░░░░░░░░░░░░░   0% ⏳ Pendiente
Fase 7: Seguridad/Optimización      ░░░░░░░░░░░░░░░░░░░░   0% ⏳ Pendiente
Fase 8: Testing/Validación          ░░░░░░░░░░░░░░░░░░░░   0% ⏳ Pendiente

PROGRESO TOTAL:                     ██░░░░░░░░░░░░░░░░░░   2% (1/50 paneles)
```

---

## 🔥 PRIORIDADES DE MIGRACIÓN (Top 15)

| Prioridad | Panel | Razón | Fase | Impacto |
|-----------|-------|-------|------|---------|
| 🔥 1 | PanelBovedaMonte | Banco principal, alto volumen transacciones | 1 | Crítico |
| 🔥 2 | PanelBovedaUSA | Operaciones USD, balance mayor | 1 | Crítico |
| 🔥 3 | PanelAzteca | Cuenta corriente activa | 1 | Crítico |
| ⚡ 4 | PanelFleteSur | Gastos operativos recurrentes | 1 | Alto |
| ⚡ 5 | PanelLeftie | Cuenta operativa secundaria | 1 | Alto |
| ⚡ 6 | PanelVentas | Sistema ventas con IA predictiva | 4 | Alto |
| ⚡ 7 | PanelControlMaestro | Control maestro RF Actual | 4 | Alto |
| ⚡ 8 | PanelOrdenesCompra | Gestión compras crítica (verificar hook) | 5 | Alto |
| ⚡ 9 | PanelClientes | Gestión clientes (verificar hook) | 5 | Alto |
| ⚡ 10 | PanelAlmacén | Control inventario multi-colección | 3 | Alto |
| 📊 11 | PanelUtilidades | Análisis utilidades | 2 | Medio |
| 📊 12 | PanelProfit | Mayor balance del sistema (12M+) | 2 | Medio |
| 📊 13 | PanelDistribuidores | Gestión proveedores | 5 | Medio |
| 📊 14 | PanelGastos | Gastos consolidados | 4 | Medio |
| 📊 15 | PanelAbonos | Abonos y pagos | 4 | Medio |

---

## 📊 ESTADÍSTICAS DE COLECCIONES FIREBASE

### Colecciones Planificadas (15+)

| Colección | Documentos Est. | Campos Clave | Índices | Prioridad | Estado |
|-----------|----------------|--------------|---------|-----------|--------|
| ✅ `gya` | **306** | fecha, tipo, valor, tc, origen, destino | fecha(desc), tipo | 🔥 CRÍTICA | ✅ Listo |
| `boveda_monte` | ~200 | fecha, tipo, monto, concepto | fecha(desc), tipo | 🔥 CRÍTICA | ⏳ Pendiente |
| `boveda_usa` | ~180 | fecha, tipo, monto, tc, montoMXN | fecha(desc), tipo | 🔥 CRÍTICA | ⏳ Pendiente |
| `azteca` | ~250 | fecha, tipo, ingreso, gasto, saldo | fecha(desc), tipo | 🔥 CRÍTICA | ⏳ Pendiente |
| `flete_sur` | ~150 | fecha, tipo, monto, cliente, origen | fecha(desc), cliente | ⚡ ALTA | ⏳ Pendiente |
| `leftie` | ~100 | fecha, tipo, monto, concepto | fecha(desc), tipo | ⚡ ALTA | ⏳ Pendiente |
| `utilidades` | ~180 | fecha, tipo, monto, categoria | fecha(desc), categoria | ⚡ ALTA | ⏳ Pendiente |
| `profit` | ~400 | fecha, tipo, monto, origen | fecha(desc), monto(desc) | ⚡ ALTA | ⏳ Pendiente |
| `almacen_ordenes` | ~50 | fecha, distribuidor, cantidad, estatus | fecha(desc), distribuidor | ⚡ ALTA | ⏳ Pendiente |
| `almacen_salidas` | ~40 | fecha, cliente, cantidad, destino | fecha(desc), cliente | ⚡ ALTA | ⏳ Pendiente |
| `almacen_cortes` | ~30 | fecha, corte, saldo | fecha(desc) | ⚡ ALTA | ⏳ Pendiente |
| `ventas_local` | ~97 | fecha, cliente, utilidad, estatus | fecha(desc), cliente, estatus | 🔥 CRÍTICA | ⏳ Pendiente |
| `control_maestro` | ~97 | fecha, ocRelacionada, bovedaMonte, utilidad | fecha(desc), cliente | 🔥 CRÍTICA | ⏳ Pendiente |
| `clientes` | ~50 | nombre, categoria, adeudo, totalComprado | nombre, adeudo(desc) | ⚡ ALTA | 🟡 Hook existe |
| `distribuidores` | ~30 | nombre, pendiente, costoTotal | nombre, pendiente(desc) | ⚡ ALTA | ⏳ Pendiente |
| `ordenes_compra` | ~150 | fecha, distribuidor, deuda, estatus | fecha(desc), distribuidor | 🔥 CRÍTICA | 🟡 Hook existe |

**Total Documentos Estimados:** ~2,310 documentos

---

## ⚙️ COLECCIONES CON HOOKS FIREBASE EXISTENTES

### 🟡 Paneles que Requieren Verificación

| Panel | Hook | Archivo Hook | Colección | Estado Verificación |
|-------|------|--------------|-----------|---------------------|
| **PanelClientes** | `useClientes()` | `src/hooks/useClientes.js` | `clientes` | ⏳ Por verificar |
| **PanelOrdenesCompra** | `useOrdenesCompra()` | `src/hooks/useOrdenesCompra.js` | `ordenes_compra` | ⏳ Por verificar |

**Acciones de Verificación:**
1. Leer archivo del hook
2. Verificar query Firestore
3. Probar en dev server
4. Confirmar datos en Firebase Console
5. Testing CRUD operations
6. Validar estadísticas calculadas

**Si Hook Funciona:**
- ✅ Marcar panel como completado
- ✅ Documentar en README
- ✅ Agregar a lista de referencia

**Si Hook No Funciona:**
- ⚠️ Migrar siguiendo patrón PanelGYA
- ⚠️ Crear scripts de carga
- ⚠️ Refactorizar componente

---

## 🔄 DUPLICADOS A CONSOLIDAR (Fase 6)

| Panel Principal | Versión Duplicada | Acción Recomendada | Prioridad |
|----------------|-------------------|-------------------|-----------|
| **PanelBovedaMonte** | PanelBovedaMonteNuevo | Evaluar cual es más completa, eliminar otra | 📝 BAJA |
| **PanelBovedaUSA** | PanelBovedaUSASupremo | Evaluar cual es más completa, eliminar otra | 📝 BAJA |
| **PanelUtilidades** | PanelUtilidadesNuevo | Evaluar cual es más completa, eliminar otra | 📝 BAJA |
| **PanelVentas** | PanelVentaLocal | Consolidar en uno solo | 📝 BAJA |
| **PanelDistribuidores** | PanelDistribuidoresCompleto | Evaluar cual es más completa, eliminar otra | 📝 BAJA |
| **PanelOrdenesCompra** | PanelOrdenesCompraAAA | Evaluar cual es más completa, eliminar otra | 📝 BAJA |

**Total Duplicados:** 6 pares (12 archivos)

**Proceso de Consolidación:**
1. Comparar features entre versiones
2. Elegir versión más completa/actualizada
3. Migrar datos de la versión elegida
4. Deprecated la versión antigua
5. Actualizar imports en `FlowDistributor.jsx`
6. Testing de componente consolidado

---

## 🚫 ARCHIVOS A NO MIGRAR (Backups)

| Archivo | Tipo | Razón | Acción |
|---------|------|-------|--------|
| **PanelGYA.OLD.jsx** | Backup | Versión antigua pre-Firebase | Mantener como referencia, luego eliminar |
| **PanelGYA.backup.jsx** | Backup | Versión antigua pre-Firebase | Mantener como referencia, luego eliminar |
| **PanelGYAReal.backup2.jsx** | Backup | Versión antigua | Mantener como referencia, luego eliminar |

---

## 📅 TIMELINE ESTIMADO

### Semana 1 (5 días)
- ✅ **Día 1:** Análisis completo (COMPLETADO)
- 🔄 **Día 2-3:** Fase 1 - Paneles bancarios críticos (5 paneles)
- 🔄 **Día 4:** Fase 2 - Paneles bancarios secundarios (2 paneles)
- 🔄 **Día 5:** Fase 3 - Panel almacén (1 panel multi-colección)

### Semana 2 (5 días)
- 🔄 **Día 6-7:** Fase 4 - Paneles de ventas (4 paneles)
- 🔄 **Día 8-9:** Fase 5 - Clientes/Distribuidores (4 paneles + verificación hooks)
- 🔄 **Día 10:** Fase 6 - Consolidación duplicados (6 pares)

### Semana 3 (2 días)
- 🔄 **Día 11:** Fase 7 - Seguridad y optimización
- 🔄 **Día 12:** Fase 8 - Testing y validación final

**Tiempo Total Estimado:** 12 días laborales (2.4 semanas)

---

## ✅ CHECKLIST DE MIGRACIÓN POR PANEL

### Template de Verificación

```markdown
## Panel: _______________

### Pre-Migración
- [ ] Backup de datos originales creado
- [ ] Schema Firestore diseñado
- [ ] Índices definidos
- [ ] Scripts de carga generados

### Migración
- [ ] Scripts ejecutados (todos los lotes)
- [ ] Datos verificados en Firebase Console
- [ ] Componente actualizado con onSnapshot
- [ ] Loading state implementado
- [ ] Error handling implementado

### Post-Migración
- [ ] Navegación funciona
- [ ] Datos se cargan correctamente
- [ ] Real-time sync funciona (2 browsers)
- [ ] Filtros operativos
- [ ] Búsqueda funciona
- [ ] CRUD operations (si aplica)
- [ ] Performance < 2s
- [ ] No errores en console

### Testing
- [ ] Unit tests escritos
- [ ] Integration tests pasando
- [ ] E2E test ejecutado
- [ ] Performance audit aprobado
- [ ] Security audit aprobado

### Documentación
- [ ] README actualizado
- [ ] Schema documentado
- [ ] Índices documentados
- [ ] Hook documentado (si aplica)
```

---

## 📚 RECURSOS Y REFERENCIAS

### Archivos Clave
- **Referencia Migración:** `src/apps/FlowDistributor/components/PanelGYA.jsx`
- **Config Firebase:** `src/lib/firebase.ts`
- **Router Principal:** `src/apps/FlowDistributor/FlowDistributor.jsx`
- **Zustand Store:** `src/stores/flowStore.js` (a deprecar)

### Hooks Existentes
- `src/hooks/useClientes.js` - Hook Firebase para clientes
- `src/hooks/useOrdenesCompra.js` - Hook Firebase + TanStack Query

### Scripts de Carga (Referencia)
- `scripts/cargar-gya-lote[1-7].js` - Scripts GYA exitosos

### Documentación
- `ANALISIS_MAESTRO_FIREBASE_MIGRACION.md` - Plan maestro completo
- `FIREBASE_SETUP.md` - Configuración Firebase
- `MATRIZ_PANELES_FLOWDISTRIBUTOR.md` - Este documento

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

### 1. Iniciar Fase 1: Bancos Críticos (5 paneles)
```bash
# Paso 1: Generar scripts de extracción
node scripts/extraer-datos-zustand.js

# Paso 2: Generar scripts de carga
node scripts/generar-scripts-carga.js

# Paso 3: Ejecutar carga por banco
node scripts/cargar-bovedaMonte-lote1.js
# ... (resto de lotes)

# Paso 4: Verificar en Firebase Console
# Abrir https://console.firebase.google.com

# Paso 5: Actualizar componentes
# Editar PanelBovedaMonte.jsx con patrón onSnapshot

# Paso 6: Testing
npm run dev
# Navegar a cada panel y verificar
```

### 2. Verificar Hooks Existentes
```bash
# Revisar hooks actuales
code src/hooks/useClientes.js
code src/hooks/useOrdenesCompra.js

# Probar en dev
npm run dev

# Verificar en Firebase Console
# Colecciones: clientes, ordenes_compra
```

---

**Documento creado:** 2025-01-28
**Última actualización:** 2025-01-28 12:00
**Versión:** 1.0.0
**Estado:** 📋 Matriz Completa - Lista para Ejecución
**Mantenedor:** AI Agent + Equipo FlowDistributor
