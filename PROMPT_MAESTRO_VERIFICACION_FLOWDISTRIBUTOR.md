# 🔍 PROMPT MAESTRO DE VERIFICACIÓN - FLOWDISTRIBUTOR
## Sistema Completo de Validación y Testing

---

## 📋 RESUMEN EJECUTIVO

Este prompt maestro sirve para verificar que **TODO** el sistema FlowDistributor funciona al 100%, sin errores, con todas las funcionalidades implementadas correctamente y todos los componentes conectados en tiempo real.

---

## 🎯 OBJETIVO

Verificar y validar:
1. ✅ **Configuración Firebase** (chronos-176d8)
2. ✅ **Estructura de Firestore** (7 bancos + colecciones)
3. ✅ **Servicios y lógica de negocio**
4. ✅ **Stores con real-time listeners**
5. ✅ **Formularios con validación Zod**
6. ✅ **Paneles con actualización automática**
7. ✅ **Flujos completos de operaciones**
8. ✅ **UI/UX responsive y animaciones**
9. ✅ **Análisis con IA (Genkit + Gemini)**
10. ✅ **Testing E2E completo**

---

## 🔥 SECCIÓN 1: CONFIGURACIÓN Y CONEXIÓN

### 1.1 Firebase Configuration
**Verificar:**
- [ ] Firebase inicializado con proyecto `chronos-176d8`
- [ ] Credenciales correctas en `.env`
- [ ] Conexión exitosa a Firestore
- [ ] Auth configurado y funcional
- [ ] Storage accesible

**Test:**
```typescript
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Debe conectar sin errores
const testConnection = async () => {
  const bancosSnap = await getDocs(collection(db, 'bancos'));
  console.log('✅ Firebase conectado. Bancos encontrados:', bancosSnap.size);
};
```

### 1.2 Genkit AI Configuration
**Verificar:**
- [ ] Genkit instalado (`genkit`, `@genkit-ai/googleai`)
- [ ] API Key de Gemini en `.env` (`GOOGLE_GENAI_API_KEY`)
- [ ] Servicio GenkitAI funcional
- [ ] Flows de análisis creados

**Test:**
```typescript
import { GenkitAIService } from '@/services/genkit-ai.service';

// Debe generar análisis
const testAI = async () => {
  const analysis = await GenkitAIService.getDashboardExecutivo({});
  console.log('✅ Gemini AI funcional:', analysis);
};
```

---

## 🏦 SECCIÓN 2: ESTRUCTURA DE DATOS

### 2.1 Colecciones Firestore
**Verificar que existen:**
- [ ] `bancos` (7 documentos: boveda_monte, utilidades, fletes, azteca, leftie, profit, boveda_usa)
- [ ] `productos`
- [ ] `distribuidores`
- [ ] `clientes`
- [ ] `ordenes_compra`
- [ ] `ventas`
- [ ] `pagos`
- [ ] `gastos`
- [ ] `transferencias`
- [ ] `ingresos`
- [ ] `movimientos_stock`
- [ ] `historial_operaciones`

**Test:**
```bash
# En Firebase Console
https://console.firebase.google.com/project/chronos-176d8/firestore/databases/-default-/data

# Verificar cada colección existe y tiene la estructura correcta
```

### 2.2 Estructura de Bancos
Cada banco debe tener:
```typescript
interface Banco {
  tipo: 'boveda_monte' | 'utilidades' | 'fletes' | 'azteca' | 'leftie' | 'profit' | 'boveda_usa';
  nombre: string;
  capital: number; // Capital actual
  capitalHistorico: number; // Suma histórica (nunca disminuye)
  totalGastos: number;
  totalTransferenciasEnviadas: number;
  totalTransferenciasRecibidas: number;
  fechaCreacion: Timestamp;
  fechaActualizacion: Timestamp;
}
```

---

## 🔄 SECCIÓN 3: FLUJOS DE OPERACIONES

### 3.1 FLUJO: Crear Orden de Compra
**Pasos a verificar:**
1. [ ] Usuario llena formulario con:
   - Nombre distribuidor
   - Productos (nombre, cantidad, precio unitario)
   - Fecha entrega estimada (opcional)
2. [ ] Al submitir:
   - [ ] Se crea/actualiza distribuidor en `distribuidores`
   - [ ] Se genera `adeudoPendiente` al distribuidor por el total
   - [ ] Se crea documento en `ordenes_compra`
   - [ ] Se crean entradas de stock en `movimientos_stock` (tipo: 'entrada')
   - [ ] Se actualiza `stockActual` en `productos` (suma cantidad)
3. [ ] Todo se refleja automáticamente en los paneles

**Test Manual:**
```
1. Ir a panel "Órdenes de Compra"
2. Crear nueva OC:
   - Distribuidor: "Proveedor A"
   - Producto: "Producto X", cantidad: 10, precio: 50 USD
3. Verificar:
   - Distribuidor creado con adeudo 500 USD
   - Stock de "Producto X" aumentó en 10 unidades
   - Movimiento de entrada registrado
   - OC visible en panel Distribuidores
```

### 3.2 FLUJO: Registrar Venta
**Pasos a verificar:**
1. [ ] Usuario llena formulario con:
   - Nombre cliente
   - Productos (cantidad, precio venta, precio flete = 500 USD editable)
   - Estado pago: COMPLETO / PARCIAL / PENDIENTE
   - Si PARCIAL → monto pagado
2. [ ] Al submitir:
   - [ ] Se crea/actualiza cliente en `clientes`
   - [ ] Se genera `adeudoPendiente` si no pagó completo
   - [ ] Se crea documento en `ventas`
   - [ ] Se distribuye automáticamente en 3 bancos:
     - **Bóveda Monte**: `precioVenta * cantidad`
     - **Utilidades**: `(precioVenta - precioCompra) * cantidad`
     - **Fletes**: `precioFlete * cantidad`
   - [ ] `capitalHistorico` de los 3 bancos aumenta SIEMPRE
   - [ ] `capital` aumenta SOLO si cliente pagó (completo o parcial proporcionalmente)
   - [ ] Se crean salidas de stock en `movimientos_stock` (tipo: 'salida')
   - [ ] Se actualiza `stockActual` en `productos` (resta cantidad)
3. [ ] Todo se refleja automáticamente en los paneles

**Test Manual:**
```
1. Ir a panel "Ventas"
2. Crear nueva venta:
   - Cliente: "Cliente A"
   - Producto: "Producto X", cantidad: 2, precio venta: 100 USD, flete: 500 USD
   - Estado: COMPLETO
3. Verificar:
   - Cliente creado sin adeudo
   - Bóveda Monte: +200 USD (100*2) en capital e histórico
   - Utilidades: +100 USD (50 utilidad*2) en capital e histórico
   - Fletes: +1000 USD (500*2) en capital e histórico
   - Stock de "Producto X" disminuyó en 2 unidades
   - Movimiento de salida registrado
   - Venta visible en panel Clientes
```

**Test con Pago PARCIAL:**
```
1. Crear venta:
   - Cliente: "Cliente B"
   - Producto: "Producto Y", cantidad: 5, precio venta: 80 USD, flete: 500 USD
   - Total: (80+500)*5 = 2900 USD
   - Estado: PARCIAL, monto pagado: 1450 USD (50%)
2. Verificar:
   - Cliente creado con adeudo 1450 USD
   - Bóveda Monte: +200 USD en capital (50% de 400), +400 USD en histórico
   - Utilidades: +75 USD en capital (50% de 150), +150 USD en histórico
   - Fletes: +1250 USD en capital (50% de 2500), +2500 USD en histórico
   - Stock disminuyó correctamente
```

### 3.3 FLUJO: Abono de Cliente
**Pasos a verificar:**
1. [ ] Usuario selecciona cliente con adeudo
2. [ ] Ingresa monto del abono
3. [ ] Al submitir:
   - [ ] Se reduce `adeudoPendiente` del cliente
   - [ ] Se distribuye proporcionalmente en los 3 bancos según las ventas pendientes
   - [ ] Se aumenta `capital` de Bóveda Monte, Utilidades, Fletes
   - [ ] Se actualiza `montoPagado` y `montoRestante` en ventas
   - [ ] Se registra en `pagos`
4. [ ] Todo se refleja automáticamente

**Test Manual:**
```
1. Ir a panel "Clientes" → Cliente B (adeudo 1450 USD)
2. Registrar abono: 725 USD
3. Verificar:
   - Adeudo ahora es 725 USD
   - Bancos aumentaron capital proporcionalmente
   - Venta actualizada con montoPagado += 725
```

### 3.4 FLUJO: Pago a Distribuidor
**Pasos a verificar:**
1. [ ] Usuario selecciona distribuidor con adeudo
2. [ ] Selecciona banco origen del pago
3. [ ] Ingresa monto
4. [ ] Al submitir:
   - [ ] Se reduce `adeudoPendiente` del distribuidor
   - [ ] Se reduce `capital` del banco origen
   - [ ] Se incrementa `totalGastos` del banco
   - [ ] Se registra como gasto en `gastos`
   - [ ] Se registra en `pagos`
5. [ ] Todo se refleja automáticamente

**Test Manual:**
```
1. Ir a panel "Distribuidores" → Proveedor A (adeudo 500 USD)
2. Pagar desde banco "Azteca": 500 USD
3. Verificar:
   - Adeudo del distribuidor ahora es 0 USD
   - Capital de Azteca disminuyó 500 USD
   - Gasto registrado en panel Azteca
```

### 3.5 FLUJO: Gasto
**Pasos a verificar:**
1. [ ] Usuario selecciona banco
2. [ ] Ingresa concepto, monto, categoría
3. [ ] Al submitir:
   - [ ] Se reduce `capital` del banco
   - [ ] Se incrementa `totalGastos` del banco
   - [ ] Se registra en `gastos`
4. [ ] Todo se refleja automáticamente

**Test Manual:**
```
1. Ir a panel "Azteca" → Registrar gasto
2. Concepto: "Renta oficina", monto: 1000 USD
3. Verificar:
   - Capital de Azteca disminuyó 1000 USD
   - Gasto visible en registros de Azteca
```

### 3.6 FLUJO: Transferencia entre Bancos
**Pasos a verificar:**
1. [ ] Usuario selecciona banco origen y destino
2. [ ] Ingresa monto y concepto
3. [ ] Al submitir:
   - [ ] Se reduce `capital` del banco origen
   - [ ] Se incrementa `totalTransferenciasEnviadas` del origen
   - [ ] Se aumenta `capital` del banco destino
   - [ ] Se incrementa `totalTransferenciasRecibidas` del destino
   - [ ] Se incrementa `capitalHistorico` del destino
   - [ ] Se registra en `transferencias`
4. [ ] Todo se refleja automáticamente

**Test Manual:**
```
1. Transferir de "Bóveda Monte" a "Leftie": 2000 USD
2. Verificar:
   - Bóveda Monte: -2000 USD capital
   - Leftie: +2000 USD capital y histórico
   - Transferencia visible en ambos paneles
```

### 3.7 FLUJO: Ingreso Directo (Azteca, Leftie, Profit)
**Pasos a verificar:**
1. [ ] Usuario selecciona banco (Azteca, Leftie o Profit)
2. [ ] Ingresa monto, concepto, fuente
3. [ ] Al submitir:
   - [ ] Se aumenta `capital` del banco
   - [ ] Se aumenta `capitalHistorico` del banco
   - [ ] Se registra en `ingresos`
4. [ ] Todo se refleja automáticamente

**Test Manual:**
```
1. Ir a panel "Leftie" → Registrar ingreso
2. Concepto: "Depósito inicial", monto: 5000 USD
3. Verificar:
   - Capital de Leftie: +5000 USD
   - Histórico de Leftie: +5000 USD
   - Ingreso visible en registros
```

---

## 📊 SECCIÓN 4: PANELES Y VISUALIZACIÓN

### 4.1 Panel Bancos (7 paneles)
Cada panel de banco debe mostrar:
- [ ] **Marcador Capital Actual**: número grande con animación
- [ ] **Marcador Capital Histórico**: acumulado total
- [ ] **Marcador Total Gastos**: suma de gastos
- [ ] **Tabla de Gastos**: lista con fecha, concepto, monto
- [ ] **Tabla de Ingresos**: (solo para los 3 bancos operativos)
- [ ] **Tabla de Transferencias**: enviadas y recibidas
- [ ] **Botones/Forms**:
  - Registrar Gasto
  - Registrar Ingreso (Azteca, Leftie, Profit)
  - Transferir a otro banco
- [ ] **Gráficos**:
  - Línea: evolución del capital en el tiempo
  - Barra: gastos por categoría
  - Pie: distribución de capital entre bancos

### 4.2 Panel Almacén
Debe mostrar:
- [ ] **Marcador Stock Total**: suma de todas las unidades
- [ ] **Marcador Valor Inventario**: stock * precio compra
- [ ] **Marcador Total Entradas**: histórico acumulado
- [ ] **Marcador Total Salidas**: histórico acumulado
- [ ] **Tabla de Productos**: con stock actual, bajo stock (< 10)
- [ ] **Tabla de Movimientos**: entradas y salidas con trazabilidad a OC/Venta
- [ ] **Alertas**: productos con bajo stock
- [ ] **Gráfico**: evolución del stock en el tiempo

### 4.3 Panel Distribuidores
Debe mostrar:
- [ ] **Lista de Distribuidores**: con adeudo pendiente
- [ ] **Para cada distribuidor**:
  - Nombre, contacto
  - Total órdenes de compra
  - Monto total comprado
  - Adeudo pendiente
  - Historial de pagos
  - Botón "Abonar/Pagar"
- [ ] **Tabla de Órdenes de Compra**: con estado de pago
- [ ] **Gráfico**: distribuidores por volumen de compra

### 4.4 Panel Clientes
Debe mostrar:
- [ ] **Lista de Clientes**: con adeudo pendiente
- [ ] **Para cada cliente**:
  - Nombre, contacto
  - Total ventas
  - Monto total vendido
  - Adeudo pendiente
  - Historial de pagos
  - Botón "Registrar Abono"
- [ ] **Tabla de Ventas**: con estado de pago
- [ ] **Gráfico**: clientes por volumen de compra
- [ ] **Clasificación**: VIP, Regular, Moroso

### 4.5 Panel Ventas
Debe mostrar:
- [ ] **Marcador Total Ventas**: número de ventas
- [ ] **Marcador Monto Total Vendido**: suma de ventas
- [ ] **Marcador Promedio por Venta**
- [ ] **Distribución por Estado**:
  - Completas
  - Parciales
  - Pendientes
- [ ] **Tabla de Ventas**: todas las ventas con filtros
- [ ] **Botón**: "Nueva Venta"
- [ ] **Gráficos**:
  - Línea: ventas en el tiempo
  - Barra: ventas por producto
  - Pie: distribución por estado de pago

### 4.6 Panel Órdenes de Compra
Debe mostrar:
- [ ] **Marcador Total OC**
- [ ] **Marcador Monto Total Comprado**
- [ ] **Tabla de Órdenes**: con estado de pago
- [ ] **Botón**: "Nueva Orden de Compra"
- [ ] **Gráficos**: OC por distribuidor

---

## 🤖 SECCIÓN 5: ANÁLISIS CON IA

### 5.1 Análisis de Ventas
**Verificar que Gemini genera:**
- [ ] Resumen de tendencias
- [ ] Top productos vendidos
- [ ] Top clientes
- [ ] Patrones de pago
- [ ] Recomendaciones para aumentar ventas
- [ ] Alertas y áreas de atención

### 5.2 Análisis de Bancos
**Verificar que Gemini genera:**
- [ ] Estado de liquidez de cada banco
- [ ] Bancos con más capital
- [ ] Recomendaciones de transferencias óptimas
- [ ] Alertas de bajo capital
- [ ] Proyección de flujo de caja

### 5.3 Análisis de Inventario
**Verificar que Gemini genera:**
- [ ] Productos con bajo stock
- [ ] Productos de alta/baja rotación
- [ ] Recomendaciones de reorden
- [ ] Predicción de necesidades de compra

### 5.4 Dashboard Ejecutivo
**Verificar que Gemini genera:**
- [ ] Salud del negocio (0-100)
- [ ] Estado general
- [ ] Métricas clave
- [ ] Top 3 logros recientes
- [ ] Top 3 áreas de atención
- [ ] Proyección próximos 30 días
- [ ] Recomendación ejecutiva principal

---

## 🎨 SECCIÓN 6: UI/UX Y EXPERIENCIA

### 6.1 Responsive Design
**Verificar en:**
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### 6.2 Animaciones
**Verificar:**
- [ ] Framer Motion en transiciones de página
- [ ] Animaciones de números (CountUp)
- [ ] Hover effects en tarjetas
- [ ] Loading states suaves
- [ ] Skeleton loaders mientras carga

### 6.3 Dark Mode
**Verificar:**
- [ ] Toggle funcional
- [ ] Todos los componentes se adaptan
- [ ] Contrastes adecuados (WCAG AA)
- [ ] Persistencia en localStorage

### 6.4 Glassmorphism & Premium Design
**Verificar:**
- [ ] Efectos de glass en tarjetas
- [ ] Gradientes en fondos
- [ ] Sombras sutiles
- [ ] Iconos animados
- [ ] Tipografía clara y legible

---

## 🧪 SECCIÓN 7: TESTING E2E

### 7.1 Test: Flujo Completo OC → Stock
```typescript
test('Crear OC genera entrada de stock', async ({ page }) => {
  await page.goto('/ordenes-compra');
  await page.click('button:has-text("Nueva Orden")');

  await page.fill('input[name="distribuidorNombre"]', 'Test Distribuidor');
  await page.fill('input[name="productos[0].productoNombre"]', 'Test Producto');
  await page.fill('input[name="productos[0].cantidad"]', '10');
  await page.fill('input[name="productos[0].precioUnitario"]', '50');

  await page.click('button[type="submit"]');

  // Verificar distribuidor creado
  await expect(page.locator('text=Test Distribuidor')).toBeVisible();

  // Verificar stock aumentó
  await page.goto('/almacen');
  await expect(page.locator('text=Test Producto')).toBeVisible();
  await expect(page.locator('td:has-text("10")')).toBeVisible();
});
```

### 7.2 Test: Flujo Completo Venta → Bancos → Cliente
```typescript
test('Crear venta distribuye en bancos y crea cliente', async ({ page }) => {
  await page.goto('/ventas');
  await page.click('button:has-text("Nueva Venta")');

  await page.fill('input[name="clienteNombre"]', 'Test Cliente');
  await page.fill('input[name="productos[0].cantidad"]', '2');
  await page.fill('input[name="productos[0].precioVenta"]', '100');
  await page.select('select[name="estadoPago"]', 'completo');

  await page.click('button[type="submit"]');

  // Verificar cliente creado sin adeudo
  await page.goto('/clientes');
  await expect(page.locator('text=Test Cliente')).toBeVisible();
  await expect(page.locator('text=0.00')).toBeVisible();

  // Verificar bancos actualizados
  await page.goto('/bancos/boveda-monte');
  await expect(page.locator('text=200')).toBeVisible(); // 100*2
});
```

### 7.3 Test: Flujo Abono Cliente → Bancos
```typescript
test('Abono de cliente aumenta capital de bancos', async ({ page }) => {
  // ... código para crear cliente con adeudo

  await page.goto('/clientes/test-cliente');
  await page.click('button:has-text("Abonar")');
  await page.fill('input[name="monto"]', '100');
  await page.click('button[type="submit"]');

  // Verificar adeudo reducido
  await expect(page.locator('text=Adeudo:')).toContainText('menor');

  // Verificar bancos aumentaron
  await page.goto('/bancos/boveda-monte');
  const capitalAntes = await page.locator('.capital-actual').textContent();
  // ... verificar incremento
});
```

---

## ✅ SECCIÓN 8: CHECKLIST FINAL

### 8.1 Configuración
- [ ] Firebase conectado (chronos-176d8)
- [ ] Genkit AI configurado
- [ ] Variables de entorno correctas
- [ ] Dependencias instaladas

### 8.2 Backend
- [ ] 12 colecciones en Firestore
- [ ] 7 bancos inicializados
- [ ] Servicios funcionando
- [ ] Lógica de negocio correcta

### 8.3 Frontend - Stores
- [ ] useBancosStore con real-time
- [ ] useVentasStore con real-time
- [ ] useOrdenesCompraStore con real-time
- [ ] useAlmacenStore con real-time
- [ ] useDashboardStore con métricas

### 8.4 Frontend - Forms
- [ ] OrdenCompraForm con validación
- [ ] VentaForm con validación
- [ ] AbonoClienteForm con validación
- [ ] AbonoDistribuidorForm con validación
- [ ] GastoForm con validación
- [ ] TransferenciaForm con validación
- [ ] IngresoForm con validación

### 8.5 Frontend - Paneles
- [ ] 7 paneles de bancos funcionales
- [ ] Panel Almacén funcional
- [ ] Panel Distribuidores funcional
- [ ] Panel Clientes funcional
- [ ] Panel Ventas funcional
- [ ] Panel Órdenes de Compra funcional

### 8.6 Frontend - Dashboard
- [ ] Métricas calculadas correctamente
- [ ] Gráficos con recharts
- [ ] KPIs animados
- [ ] Análisis IA integrados

### 8.7 UX
- [ ] Responsive en todos los dispositivos
- [ ] Animaciones suaves (Framer Motion)
- [ ] Dark mode funcional
- [ ] Loading states
- [ ] Error handling

### 8.8 Testing
- [ ] Unit tests (80% coverage)
- [ ] E2E tests críticos
- [ ] Tests de integración
- [ ] Performance tests

---

## 🚀 SECCIÓN 9: COMANDOS DE VALIDACIÓN

### Ejecutar tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

### Ejecutar migración
```bash
# Migrar datos a Firestore
npm run migrate:flowdistributor:v2
```

### Iniciar aplicación
```bash
# Development
npm run dev

# Build
npm run build

# Preview
npm run preview
```

### Validar código
```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Formatting
npm run format
```

---

## 📈 SECCIÓN 10: MÉTRICAS DE ÉXITO

El sistema está **100% funcional** si:

1. ✅ Todas las operaciones CRUD funcionan sin errores
2. ✅ Los datos se actualizan en tiempo real en todos los paneles
3. ✅ Las fórmulas de distribución de ventas son correctas
4. ✅ Los adeudos se calculan y actualizan correctamente
5. ✅ Los movimientos de stock se registran y el stock es preciso
6. ✅ Las transferencias y gastos afectan los bancos correctamente
7. ✅ Los análisis de IA se generan sin errores
8. ✅ La UI es responsive y se ve premium
9. ✅ No hay errores en consola
10. ✅ Los tests E2E pasan al 100%

---

## 🎓 CONCLUSIÓN

Este prompt maestro asegura que **cada aspecto** del sistema FlowDistributor está verificado, validado y funcionando correctamente. Úsalo para auditar el sistema completo y garantizar 0 errores antes de production.

**Estado esperado**: Sistema robusto, limpio, perfectamente organizado y funcional al 100%.
