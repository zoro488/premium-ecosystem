# 🔥 GUÍA DE MIGRACIÓN A FIRESTORE - FlowDistributor

## 📋 Resumen Ejecutivo

**Objetivo**: Migrar todos los paneles de FlowDistributor para que lean datos desde Firestore en tiempo real, en lugar de archivos JSON estáticos.

**Estado Actual**: ✅ **Servicio de migración completo** + ✅ **Hook service creado** + ✅ **PanelAlmacen actualizado**

---

## 🎯 Estrategia de Implementación

### Fase 1: Preparación (✅ COMPLETADO)
1. ✅ Servicio de migración completo (`migration-complete.service.ts`)
   - 37 colecciones Firestore
   - 7 bancos × 4 tablas cada uno
   - GYA, Almacén, Dashboard, Ventas, Clientes, etc.

2. ✅ MigrationControl component (`MigrationControl.tsx`)
   - UI para cargar datos JSON → Firestore (una sola vez)
   - Modo compacto (badge) y completo (interfaz full)

3. ✅ Firestore Hooks Service (`firestore-hooks.service.ts`)
   - `useFirestoreCollection` - Hook genérico
   - `useBancoData` - Hook para bancos
   - `useAlmacenData` - Hook para almacén
   - `useDashboardData` - Hook para dashboard
   - `useGYAData` - Hook para GYA
   - `useClientesData`, `useDistribuidoresData`, `useVentasData`, `useOrdenesCompraData`

### Fase 2: Actualización de Componentes (🔄 EN PROGRESO)

#### ✅ PanelAlmacen.jsx - COMPLETADO
```jsx
// Antes (JSON estático):
import ORDENES_COMPRA_ALMACEN_DATA from '../../../../data/excel/ordenes-compra.json';
const SALIDAS_ALMACEN_DATA = [];
const RF_ACTUAL_CORTES_DATA = [];

// Después (Firestore tiempo real):
import { useAlmacenData } from '../services/firestore-hooks.service';
const { ingresos, salidas, ordenes, loading } = useAlmacenData();
```

**Características implementadas:**
- ✅ Loading state con spinner
- ✅ Suscripción en tiempo real con `onSnapshot`
- ✅ Manejo de errores
- ✅ Tablas actualizadas automáticamente

---

## 📦 Paneles Pendientes de Actualización

### 🏦 Bancos (7 paneles - ALTA PRIORIDAD)

#### 1. PanelAztecaUltra.jsx ⚠️
```jsx
// Estado actual:
import aztecaData from '../data/panel-azteca-manual.json';
const data = aztecaData.azteca;

// Cambiar a:
import { useBancoData } from '../services/firestore-hooks.service';
const { gastos, ingresos, loading, stats } = useBancoData('azteca');
```

**Colecciones Firestore:**
- `azteca_gastos` ← gastosList
- `azteca_ingresos` ← ingresosList

#### 2. PanelBovedaMonteUltra.jsx ⚠️
```jsx
// Colecciones:
// boveda_monte_gastos
// boveda_monte_ingresos
const { gastos, ingresos, loading } = useBancoData('boveda_monte');
```

#### 3. PanelBovedaUSAUltra.jsx ⚠️
```jsx
const { gastos, ingresos, loading } = useBancoData('boveda_usa');
```

#### 4. PanelFletesUltra.jsx ⚠️
```jsx
const { gastos, ingresos, loading } = useBancoData('fletes');
```

#### 5. PanelLeftieUltra.jsx ⚠️
```jsx
const { gastos, ingresos, loading } = useBancoData('leftie');
```

#### 6. PanelProfitUltra.jsx ⚠️
```jsx
const { gastos, ingresos, loading } = useBancoData('profit');
```

#### 7. PanelUtilidadesUltra.jsx ⚠️
```jsx
const { gastos, ingresos, loading } = useBancoData('utilidades');
```

---

### 📊 Paneles de Negocio (4 paneles)

#### 8. PanelVentasUltra.jsx ⚠️
```jsx
import { useVentasData } from '../services/firestore-hooks.service';
const { data: ventas, loading } = useVentasData();
```
**Colección:** `ventas`

#### 9. PanelClientesUltra.jsx ⚠️
```jsx
import { useClientesData } from '../services/firestore-hooks.service';
const { data: clientes, loading } = useClientesData();
```
**Colección:** `clientes`

#### 10. PanelDistribuidoresUltra.jsx ⚠️
```jsx
import { useDistribuidoresData } from '../services/firestore-hooks.service';
const { data: distribuidores, loading } = useDistribuidoresData();
```
**Colección:** `distribuidores`

#### 11. PanelOrdenesCompraUltra.jsx ⚠️
```jsx
import { useOrdenesCompraData } from '../services/firestore-hooks.service';
const { data: ordenes, loading } = useOrdenesCompraData();
```
**Colección:** `ordenes_compra`

---

### 🎛️ Paneles Especiales (2 paneles)

#### 12. DashboardUltra.tsx ⚠️
```jsx
import { useDashboardData } from '../services/firestore-hooks.service';
const { paneles, totales, loading } = useDashboardData();
```
**Colecciones:**
- `dashboard_saldos` ← paneles array con rfActual
- `dashboard_totales` ← capitalEfectivo, inventarioFisico, totalRfActual

#### 13. PanelGYAUltra.jsx ⚠️
```jsx
import { useGYAData } from '../services/firestore-hooks.service';
const { transacciones, loading } = useGYAData();
```
**Colección:** `gya_transacciones`

---

## 🔧 Patrón de Implementación

### Template para Actualizar un Panel

```jsx
// ============================================
// PASO 1: Agregar imports
// ============================================
import { useBancoData } from '../services/firestore-hooks.service';
import { Loader2 } from 'lucide-react';

// ============================================
// PASO 2: Dentro del componente, reemplazar datos estáticos
// ============================================
const PanelXXX = () => {
  // ❌ ELIMINAR: import de JSON
  // import data from '../data/panel-xxx-manual.json';

  // ✅ AGREGAR: Hook de Firestore
  const { gastos, ingresos, loading, stats } = useBancoData('nombre_banco');

  // ============================================
  // PASO 3: Agregar loading state
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />
          <div className="text-white text-xl font-semibold">Cargando datos...</div>
          <div className="text-gray-400 text-sm">Conectando con Firestore</div>
        </motion.div>
      </div>
    );
  }

  // ============================================
  // PASO 4: Usar datos de Firestore
  // ============================================
  // Los datos ya están disponibles en: gastos[], ingresos[], stats

  return (
    <div>
      {/* Tablas, gráficos, etc. ahora usan gastos e ingresos en tiempo real */}
    </div>
  );
};
```

---

## 📊 Estructura de Datos por Colección

### Bancos (gastos/ingresos)
```typescript
// Estructura común para todos los bancos
{
  fecha: string,          // "2024-03-15"
  concepto: string,       // "Pago proveedor"
  valor: number,          // 1500.50
  tc: number,             // 17.25 (tipo de cambio)
  mxnTotal: number,       // 25883.625
  origen?: string,        // Para gastos
  destino?: string,       // Para gastos
  cliente?: string,       // Para ingresos
  observaciones?: string
}
```

### Almacén
```typescript
// almacen_ingresos
{
  fecha: string,
  distribuidor: string,
  cantidad: number,
  concepto: string,
  valor: number
}

// almacen_salidas
{
  fecha: string,
  cliente: string,
  cantidad: number,
  concepto: string,
  valor: number
}

// almacen_ordenes_compra
{
  OC: string,
  Origen: string,
  Cantidad: number,
  Fecha: string
}
```

### Dashboard
```typescript
// dashboard_saldos (array de paneles)
{
  panel: string,      // "Azteca", "Almacén Monte", etc.
  rfActual: number,   // -178714.88
  tipo: string,       // "banco" | "almacen"
  unidades?: number   // Solo para almacén
}

// dashboard_totales (documento único)
{
  capitalEfectivo: number,    // 12861315.12
  inventarioFisico: number,   // 107220.66
  totalRfActual: number       // 12968535.78
}
```

---

## 🚀 Proceso de Migración de Datos

### Carga Inicial (Una sola vez)
1. Usuario abre cualquier panel
2. Ve el `MigrationControl` badge en modo compacto
3. Hace clic en "Cargar Datos"
4. El servicio `migration-complete.service.ts` ejecuta:
   - Lee 11 archivos JSON manuales
   - Carga 37 colecciones a Firestore
   - Progreso visible en tiempo real
5. ✅ Datos cargados permanentemente

### Lectura Continua (Siempre)
1. Cada panel usa su hook correspondiente
2. El hook establece un `onSnapshot` listener
3. Los datos se actualizan automáticamente cuando cambian en Firestore
4. ✨ Tiempo real sin recargar página

---

## ✅ Checklist de Progreso

### Infraestructura
- [x] Servicio de migración completo
- [x] MigrationControl UI
- [x] Firestore hooks service
- [x] PanelAlmacen actualizado

### Bancos (0/7)
- [ ] PanelAztecaUltra
- [ ] PanelBovedaMonteUltra
- [ ] PanelBovedaUSAUltra
- [ ] PanelFletesUltra
- [ ] PanelLeftieUltra
- [ ] PanelProfitUltra
- [ ] PanelUtilidadesUltra

### Negocio (0/4)
- [ ] PanelVentasUltra
- [ ] PanelClientesUltra
- [ ] PanelDistribuidoresUltra
- [ ] PanelOrdenesCompraUltra

### Especiales (0/2)
- [ ] DashboardUltra
- [ ] PanelGYAUltra

**Total: 1/14 paneles completados (7%)**

---

## 🎯 Próximos Pasos

1. **Prioridad 1**: Actualizar los 7 paneles de bancos
   - Todos usan el mismo patrón (`useBancoData`)
   - Son los más críticos para operación diaria

2. **Prioridad 2**: Actualizar paneles de negocio
   - Ventas, Clientes, Distribuidores, Órdenes

3. **Prioridad 3**: Dashboard y GYA
   - Dashboard necesita mostrar rfActual de todos los paneles
   - GYA es tabla de transacciones general

---

## 🛠️ Comandos Útiles

```bash
# Ver estructura de colecciones Firestore
# (desde Firebase Console)

# Verificar imports en un componente
Get-Content PanelXXX.jsx | Select-String "import.*from"

# Buscar componentes que usan JSON estático
Get-ChildItem -Filter "*Ultra.jsx" | Select-String "import.*\.json"

# Listar todos los paneles Ultra
ls *Ultra.jsx -Name
```

---

## 📝 Notas Importantes

1. **No eliminar archivos JSON** - Pueden ser útiles como backup
2. **Testing incremental** - Probar cada panel después de actualizarlo
3. **Manejo de errores** - Todos los hooks incluyen error handling
4. **Loading states** - Siempre mostrar feedback visual durante carga
5. **Compatibilidad** - Los componentes existentes (tablas, gráficos) siguen funcionando igual, solo cambia la fuente de datos

---

**Última actualización**: 2024-11-07
**Versión**: 1.0.0
**Estado**: 🔄 En Progreso (7% completado)
