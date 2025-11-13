# 🧪 Guía de Pruebas en Producción - Premium Ecosystem

**URL de Producción**: https://premium-ecosystem-1760790572.web.app
**Fecha Deploy**: 28 de Enero de 2025
**Versión**: 3.0.0 Optimizada

---

## 🎯 Objetivo

Identificar bugs, errores o funcionalidades faltantes en la aplicación desplegada, específicamente en **FlowDistributor**.

---

## 📋 Checklist de Pruebas FlowDistributor

### 1. ✅ Acceso y Autenticación

**Pruebas**:
- [ ] La página principal carga correctamente
- [ ] Se muestra el dashboard de selección de apps
- [ ] FlowDistributor aparece en el menú de aplicaciones
- [ ] El login con Firebase funciona (si está implementado)
- [ ] La navegación entre apps funciona sin errores

**Errores a Buscar**:
- ❌ Pantalla blanca (white screen of death)
- ❌ Error "Cannot access 'f' before initialization" (ya resuelto)
- ❌ Problemas de CORS con Firebase
- ❌ Credenciales inválidas

---

### 2. 🏠 Dashboard Principal FlowDistributor

**URL**: `/flowdistributor` o acceso desde dashboard principal

**Pruebas**:
- [ ] El dashboard carga correctamente
- [ ] Se muestran las tarjetas de resumen (ventas, clientes, etc.)
- [ ] Los gráficos premium (Three.js) se renderizan
- [ ] Las animaciones con Framer Motion funcionan
- [ ] Los íconos de Lucide React se muestran
- [ ] El menú lateral funciona correctamente

**Errores a Buscar**:
- ❌ Componentes no se cargan (lazy loading fail)
- ❌ Gráficos 3D no aparecen o causan lag
- ❌ Íconos faltantes o rotos
- ❌ Errores de consola JavaScript
- ❌ Performance lento (>3s de carga)

**Comandos en Consola para Debug**:
```javascript
// Ver localStorage
localStorage

// Ver errores de React
window.__REACT_DEVTOOLS_GLOBAL_HOOK__

// Verificar Firebase
firebase.apps.length > 0
```

---

### 3. 📊 Panel de Ventas

**Navegación**: Dashboard → "Ventas"

**Pruebas Básicas**:
- [ ] La tabla de ventas carga correctamente
- [ ] Se muestran las ventas existentes (si hay datos)
- [ ] El botón "Nueva Venta" funciona
- [ ] El formulario de venta se abre correctamente
- [ ] La paginación funciona (si hay >50 ventas)
- [ ] El scroll es fluido (virtual scrolling)
- [ ] Los filtros funcionan (por fecha, cliente, estado)

**Pruebas de Formulario**:
- [ ] FormVenta se abre sin errores
- [ ] Todos los campos se muestran
- [ ] La validación funciona (campos requeridos)
- [ ] Se puede seleccionar cliente del dropdown
- [ ] Se pueden añadir productos/ítems
- [ ] Los cálculos automáticos funcionan (subtotal, IVA, total)
- [ ] El botón "Guardar" funciona
- [ ] La venta se guarda en Firebase correctamente

**Pruebas CRUD**:
- [ ] **Crear**: Nueva venta se añade correctamente
- [ ] **Leer**: Las ventas se muestran en la tabla
- [ ] **Actualizar**: Editar una venta funciona
- [ ] **Eliminar**: Eliminar una venta funciona (si está implementado)

**Errores a Buscar**:
- ❌ Tabla vacía cuando debería haber datos
- ❌ "Cannot read property of undefined" en formulario
- ❌ Validaciones no funcionan (campos vacíos se aceptan)
- ❌ Cálculos incorrectos (totales, IVA)
- ❌ No se guardan en Firebase (check consola y Firestore)
- ❌ Re-renders excesivos (lag al escribir)
- ❌ Dropdowns vacíos (clientes no cargan)

**Consultas Firebase a Verificar**:
```javascript
// En consola del navegador
import { collection, getDocs } from 'firebase/firestore';
import { db } from './lib/firebase';

// Ver todas las ventas
getDocs(collection(db, 'ventas')).then(snap => {
  console.log('Ventas:', snap.size);
  snap.forEach(doc => console.log(doc.id, doc.data()));
});
```

---

### 4. 👥 Panel de Clientes

**Navegación**: Dashboard → "Clientes"

**Pruebas Básicas**:
- [ ] La tabla de clientes carga
- [ ] Se muestran clientes existentes
- [ ] Botón "Nuevo Cliente" funciona
- [ ] FormCliente se abre correctamente
- [ ] Los filtros funcionan (búsqueda por nombre, categoría)

**Pruebas de Formulario**:
- [ ] Todos los campos se muestran (nombre, email, teléfono, dirección)
- [ ] Validación de email funciona
- [ ] Se puede seleccionar categoría (A, B, C)
- [ ] Se puede seleccionar nivel de riesgo
- [ ] El botón "Guardar" guarda correctamente

**Pruebas CRUD**:
- [ ] **Crear**: Nuevo cliente se añade
- [ ] **Leer**: Clientes se muestran en tabla
- [ ] **Actualizar**: Editar cliente funciona
- [ ] **Eliminar**: Eliminar cliente funciona

**Errores a Buscar**:
- ❌ Validación de email no funciona
- ❌ Categorías no se muestran
- ❌ No se guardan en Firestore
- ❌ Búsqueda/filtros no funcionan

---

### 5. 📦 Panel de Órdenes de Compra

**Navegación**: Dashboard → "Órdenes de Compra"

**Pruebas Básicas**:
- [ ] Tabla de órdenes carga
- [ ] Se muestran órdenes existentes
- [ ] Botón "Nueva Orden" funciona
- [ ] FormOrdenCompra se abre
- [ ] Estados se muestran correctamente (Pendiente, En Proceso, Completada)

**Pruebas de Formulario**:
- [ ] Se puede seleccionar proveedor
- [ ] Se pueden añadir productos/ítems
- [ ] Los cálculos funcionan (subtotal, total)
- [ ] Se puede cambiar el estado
- [ ] El botón "Guardar" funciona

**Pruebas CRUD**:
- [ ] **Crear**: Nueva orden se añade
- [ ] **Leer**: Órdenes se muestran
- [ ] **Actualizar**: Editar orden funciona
- [ ] **Eliminar**: Eliminar orden funciona

**Errores a Buscar**:
- ❌ Proveedores no cargan
- ❌ Estados no se actualizan
- ❌ Cálculos incorrectos

---

### 6. 💰 Panel de Pagos

**Navegación**: Dashboard → "Pagos"

**Pruebas Básicas**:
- [ ] Tabla de pagos carga
- [ ] Se muestran pagos existentes
- [ ] Botón "Registrar Pago" funciona
- [ ] FormPago se abre correctamente
- [ ] Estados se muestran (Pendiente, Pagado, Parcial)

**Pruebas de Formulario**:
- [ ] Se puede seleccionar venta asociada
- [ ] Se puede ingresar monto
- [ ] Se puede seleccionar método de pago (Efectivo, Tarjeta, Transferencia)
- [ ] Se puede añadir comprobante/referencia
- [ ] El botón "Guardar" funciona

**Pruebas CRUD**:
- [ ] **Crear**: Nuevo pago se registra
- [ ] **Leer**: Pagos se muestran
- [ ] **Actualizar**: Editar pago funciona
- [ ] **Eliminar**: Eliminar pago funciona

**Errores a Buscar**:
- ❌ Ventas no cargan en dropdown
- ❌ Cálculos de saldos incorrectos
- ❌ Estados no se actualizan

---

### 7. 💸 Panel de Gastos

**Navegación**: Dashboard → "Gastos"

**Pruebas Básicas**:
- [ ] Tabla de gastos carga
- [ ] Se muestran gastos existentes
- [ ] Botón "Nuevo Gasto" funciona
- [ ] FormGasto se abre correctamente
- [ ] Categorías se muestran (Operativo, Marketing, etc.)

**Pruebas de Formulario**:
- [ ] Se puede ingresar descripción
- [ ] Se puede ingresar monto
- [ ] Se puede seleccionar categoría
- [ ] Se puede subir comprobante (si está implementado)
- [ ] El botón "Guardar" funciona

**Pruebas CRUD**:
- [ ] **Crear**: Nuevo gasto se añade
- [ ] **Leer**: Gastos se muestran
- [ ] **Actualizar**: Editar gasto funciona
- [ ] **Eliminar**: Eliminar gasto funciona

**Errores a Buscar**:
- ❌ Categorías no cargan
- ❌ Upload de comprobantes falla
- ❌ Cálculos de totales incorrectos

---

### 8. 📈 Panel de Informes

**Navegación**: Dashboard → "Informes"

**Pruebas Básicas**:
- [ ] Panel de informes carga
- [ ] Los gráficos se renderizan (Recharts)
- [ ] Se muestran estadísticas resumidas
- [ ] Los filtros por fecha funcionan
- [ ] Se puede exportar a PDF/Excel (si está implementado)

**Gráficos a Verificar**:
- [ ] Gráfico de ventas por mes
- [ ] Gráfico de clientes por categoría
- [ ] Gráfico de gastos por categoría
- [ ] Gráfico de flujo de caja

**Errores a Buscar**:
- ❌ Gráficos no se muestran
- ❌ Datos incorrectos en gráficos
- ❌ Filtros no funcionan
- ❌ Exportación falla

---

### 9. 🏦 Panel Bóveda USA Supremo

**Navegación**: Dashboard → "Bóveda USA"

**Pruebas Básicas**:
- [ ] Panel carga correctamente
- [ ] Se muestran tasas de cambio (USD/MXN)
- [ ] Se muestran saldos en ambas monedas
- [ ] Calculadora de conversión funciona
- [ ] Se pueden registrar transacciones en USD

**Errores a Buscar**:
- ❌ Tasas no se actualizan
- ❌ Conversiones incorrectas
- ❌ No se guardan transacciones

---

### 10. ⚙️ Configuración

**Navegación**: Dashboard → "Configuración"

**Pruebas Básicas**:
- [ ] Panel de configuración carga
- [ ] Se pueden modificar ajustes generales
- [ ] Se pueden gestionar categorías
- [ ] Se pueden gestionar usuarios (si está implementado)
- [ ] Los cambios se guardan correctamente

**Errores a Buscar**:
- ❌ Cambios no se persisten
- ❌ Validaciones no funcionan

---

### 11. 📊 Gráficos Premium (Three.js)

**Navegación**: Dashboard → Botón "Gráficos Premium"

**Pruebas Básicas**:
- [ ] Modal/Panel de gráficos 3D se abre
- [ ] Los gráficos Three.js se renderizan
- [ ] Las animaciones funcionan suavemente
- [ ] Los controles de cámara funcionan (zoom, rotación)
- [ ] No hay lag excesivo

**Errores a Buscar**:
- ❌ Gráficos no se muestran (pantalla negra)
- ❌ Lag severo (FPS <30)
- ❌ Errores de WebGL
- ❌ Controles no responden

---

## 🐛 Errores Comunes a Buscar en Consola

### Errores de Firebase
```
❌ "Firebase: No Firebase App '[DEFAULT]' has been created"
❌ "Permission denied" en Firestore
❌ "CORS policy" errors
❌ "Invalid API key"
```

### Errores de React
```
❌ "Cannot access 'X' before initialization"
❌ "Cannot read property 'map' of undefined"
❌ "Maximum update depth exceeded"
❌ "Warning: Each child in a list should have a unique 'key' prop"
```

### Errores de Lazy Loading
```
❌ "ChunkLoadError: Loading chunk X failed"
❌ "Failed to fetch dynamically imported module"
```

### Errores de TypeScript/Runtime
```
❌ "X is not defined"
❌ "Unexpected token"
❌ "Syntax error"
```

---

## 📊 Métricas de Performance a Verificar

### 🚀 Lighthouse Metrics (Chrome DevTools)

**Ejecutar en incógnito**:
1. Abrir DevTools (F12)
2. Ir a pestaña "Lighthouse"
3. Seleccionar "Performance"
4. Click "Generate report"

**Metas**:
- **Performance**: >90 ✅
- **Accessibility**: >90 ✅
- **Best Practices**: >90 ✅
- **SEO**: >90 ✅

### 📈 Core Web Vitals

**Verificar en DevTools → Performance**:
- **LCP (Largest Contentful Paint)**: <2.5s ✅
- **FID (First Input Delay)**: <100ms ✅
- **CLS (Cumulative Layout Shift)**: <0.1 ✅
- **TTI (Time to Interactive)**: <3.8s ✅

### 🔍 Network Analysis

**DevTools → Network**:
- [ ] Todos los recursos cargan correctamente (200 OK)
- [ ] No hay errores 404 (archivos faltantes)
- [ ] No hay errores 500 (server errors)
- [ ] Los assets están en caché (304 Not Modified)
- [ ] El bundle gzipped es ~600KB total

---

## 🔧 Comandos de Debug en Consola del Navegador

### Ver Estado de Firebase
```javascript
// Verificar Firebase está inicializado
console.log('Firebase apps:', window.firebase?.apps?.length || 0);

// Ver configuración actual
import { getApp } from 'firebase/app';
console.log('Firebase config:', getApp().options);
```

### Ver Datos de Firestore
```javascript
// Listar todas las colecciones (si tienes permisos)
import { collection, getDocs } from 'firebase/firestore';
import { db } from './lib/firebase';

// Ventas
getDocs(collection(db, 'ventas')).then(snap => {
  console.log('Total ventas:', snap.size);
});

// Clientes
getDocs(collection(db, 'clientes')).then(snap => {
  console.log('Total clientes:', snap.size);
});

// Órdenes
getDocs(collection(db, 'ordenesCompra')).then(snap => {
  console.log('Total órdenes:', snap.size);
});
```

### Limpiar Cache y Probar de Nuevo
```javascript
// Limpiar localStorage
localStorage.clear();

// Limpiar sessionStorage
sessionStorage.clear();

// Recargar sin cache
location.reload(true);
```

### Ver Performance de React
```javascript
// Habilitar React DevTools Profiler
// 1. Instalar extensión React DevTools
// 2. Ir a pestaña "Profiler"
// 3. Click "Start profiling"
// 4. Realizar acciones en la app
// 5. Click "Stop profiling"
// 6. Ver componentes lentos
```

---

## 📝 Template de Reporte de Bugs

Usa este template para documentar bugs encontrados:

```markdown
### Bug #X: [Título breve del bug]

**Severidad**: 🔴 Crítico / 🟡 Medio / 🟢 Bajo

**Ubicación**: [Panel/Componente específico]

**Descripción**:
[Describe qué está fallando]

**Pasos para Reproducir**:
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

**Comportamiento Esperado**:
[Qué debería pasar]

**Comportamiento Actual**:
[Qué pasa en realidad]

**Errores de Consola**:
```
[Pegar errores de consola aquí]
```

**Screenshots/Video**:
[Adjuntar si es posible]

**Navegador y OS**:
- Navegador: [Chrome/Firefox/Edge] versión [XX]
- OS: [Windows/Mac/Linux]

**Datos Adicionales**:
[Cualquier información extra relevante]
```

---

## ✅ Funcionalidades Esperadas (Checklist Completa)

### FlowDistributor Core
- [ ] Dashboard principal funcional
- [ ] Navegación entre paneles
- [ ] Lazy loading de componentes
- [ ] Performance fluido (<3s carga)

### CRUD Completo
- [ ] Ventas: Crear, Leer, Actualizar, Eliminar
- [ ] Clientes: Crear, Leer, Actualizar, Eliminar
- [ ] Órdenes: Crear, Leer, Actualizar, Eliminar
- [ ] Pagos: Crear, Leer, Actualizar, Eliminar
- [ ] Gastos: Crear, Leer, Actualizar, Eliminar

### Cálculos y Validaciones
- [ ] Cálculos automáticos de totales
- [ ] Validación de campos requeridos
- [ ] Validación de emails
- [ ] Validación de números/montos
- [ ] Cálculos de IVA correctos
- [ ] Conversiones de moneda (USD/MXN)

### Firebase Integration
- [ ] Autenticación funciona
- [ ] Firestore lee datos correctamente
- [ ] Firestore guarda datos correctamente
- [ ] Offline persistence funciona
- [ ] Real-time updates funcionan

### UI/UX
- [ ] Animaciones suaves (Framer Motion)
- [ ] Gráficos 3D funcionan (Three.js)
- [ ] Gráficos 2D funcionan (Recharts)
- [ ] Íconos se muestran (Lucide React)
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Dark mode (si está implementado)

### Performance
- [ ] Lazy loading funciona
- [ ] React.memo() optimiza re-renders
- [ ] Virtual scrolling en tablas largas
- [ ] Bundle size optimizado
- [ ] Firebase queries optimizadas con batching

---

## 🎯 Prioridades de Testing

### 🔴 CRÍTICO (Probar Primero)
1. Login/Autenticación
2. Crear nueva venta
3. Ver tabla de ventas
4. Guardar en Firebase
5. Cálculos de totales

### 🟡 IMPORTANTE (Probar Después)
1. Editar venta existente
2. Filtros y búsqueda
3. Gráficos e informes
4. Configuración

### 🟢 OPCIONAL (Probar Si Hay Tiempo)
1. Gráficos 3D Premium
2. Exportar a PDF/Excel
3. Dark mode
4. Responsive mobile

---

## 📞 Siguiente Paso

**Una vez hayas probado la aplicación**:

1. Anota todos los bugs encontrados usando el template
2. Identifica funcionalidades faltantes
3. Toma screenshots de errores
4. Copia errores de consola
5. Comparte el reporte completo

**Yo podré**:
- Corregir bugs prioritarios inmediatamente
- Implementar funcionalidades faltantes
- Optimizar áreas con problemas de performance
- Mejorar la experiencia de usuario

---

**URL de Producción**: 🌐 https://premium-ecosystem-1760790572.web.app

**¡Empieza las pruebas y documenta todo lo que encuentres!** 🚀
