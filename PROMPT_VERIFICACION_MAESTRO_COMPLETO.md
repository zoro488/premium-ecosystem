# 🎯 PROMPT MAESTRO DE VERIFICACIÓN - FLOWDISTRIBUTOR SYSTEM

## OBJETIVO
Verificar y asegurar la implementación completa del sistema FlowDistributor con **0 errores** y **funcionalidad al 100%**. Este prompt debe ser usado para auditar cada aspecto del sistema de forma sistemática y exhaustiva.

---

## 📋 CHECKLIST DE VERIFICACIÓN COMPLETA

### 1. MIGRACIÓN DE DATOS ✓

**Verificar que TODOS los datos estén correctamente migrados a Firestore:**

```
🔍 Ejecutar verificación:
- Conectar a Firestore
- Contar documentos en cada colección
- Comparar con datos fuente (JSON)
- Validar integridad de datos

✅ Clientes: Debe haber exactamente 31 clientes válidos
   - Filtrar registros vacíos (nombre != '' y != '0')
   - Cada cliente debe tener: id, nombre, contacto, deudaTotal
   - Validar que no haya duplicados

✅ Distribuidores: Debe haber entre 2-6 distribuidores
   - 2 sin adeudo (adeudo = 0)
   - 4-6 con adeudo (adeudo > 0)
   - Cada distribuidor debe tener: id, nombre, contacto, adeudo

✅ Órdenes de Compra: Debe haber exactamente 9 OCs únicas
   - IDs: OC0001, OC0002, OC0003, OC0004, OC0005, OC0006, OC0007, OC0008, OC0009
   - Cada OC debe tener: id, distribuidorId, productos[], total, fecha, estado

✅ Ventas: Debe haber exactamente 96 ventas (del Control Maestro)
   - Cada venta debe tener: id, clienteId, productos[], cantidad, precioVenta, flete, estado
   - Estados válidos: "Pagado" o "Pendiente"
   - Validar que todas las ventas tengan OC asociada

✅ Gastos y Abonos: Debe haber aproximadamente 306 registros
   - Cada registro debe tener: id, concepto, monto, tipo, fecha, bancoId
   - Tipos: "gasto", "abono", "ingreso"

✅ RF Actual (Saldos Iniciales): Colección 'bancos' o 'rfActual'
   - Debe contener saldo actual de cada banco:
     * almacenMonte: 17 unidades
     * bovedaMonte: $0
     * fleteSur: $185,792
     * utilidades: $102,658
     * azteca: -$178,714.88
     * leftie: $45,844
     * profit: $12,577,748
     * bovedaUsa: $128,005
   - Total sistema: $12,861,332.12

✅ Tablas de Bancos: Movimientos históricos por cada banco
   - Verificar colecciones: bovedaMonte, bovedaUsa, azteca, leftie, profit, utilidades, fleteSur
   - Cada movimiento debe tener: id, tipo, monto, fecha, concepto, saldoAnterior, saldoNuevo

🔍 COMANDO VERIFICACIÓN:
node scripts/verificar-datos-firestore-completo.js
```

---

### 2. FORMULARIOS FUNCIONALES ✓

**Probar CADA formulario con datos reales y verificar resultados:**

#### 2.1 Formulario de Orden de Compra

```javascript
🧪 TEST CASO 1: Crear OC con distribuidor existente
INPUT:
{
  distribuidorId: "dist_001",
  productos: [
    { nombre: "Producto A", cantidad: 100, precioUnitario: 6300 }
  ],
  fecha: "2025-11-18",
  observaciones: "Orden de prueba"
}

VERIFICAR:
✓ OC creada en Firestore (colección 'ordenesCompra')
✓ Adeudo del distribuidor actualizado (+630,000)
✓ Entrada registrada en almacén (+100 unidades)
✓ Stock actual incrementado (+100)
✓ Histórico de entradas actualizado (registro fijo)
✓ Visualización automática en:
  - Panel Distribuidores (perfil + nueva OC + adeudo actualizado)
  - Panel Almacén (nueva entrada + stock actualizado)

🧪 TEST CASO 2: Crear OC con distribuidor nuevo
INPUT:
{
  distribuidorNombre: "Distribuidor Nuevo",
  distribuidorContacto: "+52 123 456 7890",
  productos: [
    { nombre: "Producto B", cantidad: 50, precioUnitario: 7000 }
  ]
}

VERIFICAR:
✓ Distribuidor creado automáticamente
✓ OC vinculada al nuevo distribuidor
✓ Adeudo inicial = total de la OC
✓ Todo lo demás igual que CASO 1
```

#### 2.2 Formulario de Venta

```javascript
🧪 TEST CASO 1: Venta PAGADA COMPLETA
INPUT:
{
  clienteNombre: "Cliente Test",
  productos: [
    { nombre: "Producto A", cantidad: 10, precioVenta: 7000 }
  ],
  flete: 500, // por unidad
  estadoPago: "completo"
}

VERIFICAR:
✓ Cliente creado/actualizado
✓ Venta registrada con estado "Pagado"
✓ Salida de almacén (-10 unidades)
✓ Stock actualizado correctamente
✓ Registro en BÓVEDA MONTE:
  - Monto: 10 × 7000 = $70,000
  - Estado: "Pagado"
  - Capital actualizado: +$70,000
  - Histórico fijo: +$70,000
✓ Registro en FLETES:
  - Monto: 10 × 500 = $5,000
  - Estado: "Pagado"
  - Capital actualizado: +$5,000
  - Histórico fijo: +$5,000
✓ Registro en UTILIDADES:
  - Fórmula: (precioVenta - costo) × cantidad
  - Estado: "Pagado"
  - Capital actualizado
  - Histórico fijo actualizado
✓ Visualización automática en:
  - Panel Clientes (perfil + venta + deuda = 0)
  - Panel Bóveda Monte (registro + capital actualizado)
  - Panel Fletes (registro + capital actualizado)
  - Panel Utilidades (registro + capital actualizado)
  - Panel Almacén (salida + stock actualizado)

🧪 TEST CASO 2: Venta PARCIAL (abono $30,000 de $70,000)
INPUT:
{
  clienteNombre: "Cliente Test 2",
  productos: [
    { nombre: "Producto A", cantidad: 10, precioVenta: 7000 }
  ],
  flete: 500,
  estadoPago: "parcial",
  montoAbonado: 30000
}

VERIFICAR:
✓ Venta registrada con estado "Parcial"
✓ Adeudo cliente: $40,000
✓ HISTÓRICO FIJO de bancos: $70,000 total registrado
✓ CAPITAL de bancos: Solo $30,000 distribuido proporcionalmente
✓ Distribución proporcional del abono:
  - Bóveda Monte: 30000 × (70000/75000) = $28,000
  - Fletes: 30000 × (5000/75000) = $2,000
  - Utilidades: según proporción
✓ Panel Clientes muestra: Adeudo $40,000, Monto pagado $30,000

🧪 TEST CASO 3: Venta PENDIENTE (sin pago)
INPUT:
{
  clienteNombre: "Cliente Test 3",
  productos: [
    { nombre: "Producto A", cantidad: 10, precioVenta: 7000 }
  ],
  flete: 500,
  estadoPago: "pendiente"
}

VERIFICAR:
✓ Venta registrada con estado "Pendiente"
✓ Adeudo cliente: $75,000 (total completo)
✓ HISTÓRICO FIJO: $75,000 registrado
✓ CAPITAL bancos: SIN CAMBIO (0 abonado)
✓ Panel Clientes muestra: Adeudo $75,000, Monto pagado $0
```

#### 2.3 Formulario de Pago a Distribuidor

```javascript
🧪 TEST: Abonar a distribuidor desde banco
INPUT:
{
  distribuidorId: "dist_001",
  montoAPagar: 50000,
  bancoOrigen: "bovedaMonte",
  tipo: "abono" // o "saldar"
}

VERIFICAR:
✓ Adeudo distribuidor: -$50,000
✓ Capital Bóveda Monte: -$50,000
✓ Registro de gasto en Bóveda Monte
✓ Histórico gastos Bóveda Monte: +registro
✓ Visualización actualizada en Panel Distribuidores
✓ Visualización actualizada en Panel Bóveda Monte
```

#### 2.4 Formulario de Cobro a Cliente

```javascript
🧪 TEST: Cliente abona a su deuda
INPUT:
{
  clienteId: "cli_001",
  montoRecibido: 20000
}

VERIFICAR:
✓ Adeudo cliente: -$20,000
✓ Distribución proporcional a bancos:
  - Bóveda Monte: capital += proporción
  - Fletes: capital += proporción
  - Utilidades: capital += proporción
✓ Registros de ingreso en cada banco
✓ Visualización actualizada en Panel Clientes
✓ Visualización actualizada en paneles de bancos
```

#### 2.5 Formulario de Transferencia entre Bancos

```javascript
🧪 TEST: Transferir de Profit a Azteca
INPUT:
{
  bancoOrigen: "profit",
  bancoDestino: "azteca",
  monto: 100000,
  concepto: "Capitalización Azteca"
}

VERIFICAR:
✓ Capital Profit: -$100,000
✓ Capital Azteca: +$100,000
✓ Registro de transferencia en ambos bancos
✓ Histórico transferencias actualizado
✓ Visualización en Panel Profit (salida)
✓ Visualización en Panel Azteca (entrada)
```

#### 2.6 Formulario de Gasto Bancario

```javascript
🧪 TEST: Registrar gasto desde banco
INPUT:
{
  bancoId: "utilidades",
  monto: 5000,
  concepto: "Gastos operativos",
  descripcion: "Pago de servicios"
}

VERIFICAR:
✓ Capital Utilidades: -$5,000
✓ Registro de gasto creado
✓ Histórico gastos Utilidades: +registro
✓ Visualización en Panel Utilidades
```

---

### 3. PANELES Y VISUALIZACIÓN ✓

**Verificar que CADA panel muestre datos correctos y actualizados en tiempo real:**

#### 3.1 Panel Dashboard (Principal)

```
✓ KPIs principales visibles y correctos:
  - Total ventas del mes
  - Total ingresos
  - Total gastos
  - Utilidad neta
  - Clientes con adeudo
  - Distribuidores con adeudo
  - Stock crítico (alertas)

✓ Gráficas interactivas:
  - Ventas por mes (últimos 6 meses)
  - Distribución de ingresos (pie chart)
  - Flujo de caja (line chart)
  - Top 10 clientes
  - Top 5 productos más vendidos

✓ Resumen de bancos:
  - Saldo de cada banco
  - Total sistema
  - Indicadores de estado
```

#### 3.2 Panel Distribuidores

```
✓ Lista de todos los distribuidores
✓ Filtros funcionales: nombre, adeudo, estado
✓ Búsqueda en tiempo real
✓ Click en distribuidor abre perfil con:
  - Información de contacto
  - Lista de OCs registradas (tabla con detalles)
  - Adeudo total actual
  - Histórico de pagos/abonos
  - Botón "Abonar" (abre formulario)
  - Botón "Saldar" (abre formulario con monto total)

✓ Formulario abonar/saldar funcional:
  - Campo monto
  - Selector de banco origen
  - Validación de saldo suficiente
  - Confirmación con resumen
  - Actualización automática al confirmar
```

#### 3.3 Panel Clientes

```
✓ Lista de todos los clientes (31 válidos)
✓ Filtros: nombre, adeudo, estado
✓ Búsqueda en tiempo real
✓ Click en cliente abre perfil con:
  - Información de contacto
  - Lista de ventas registradas (tabla detallada)
  - Adeudo total actual
  - Histórico de pagos/abonos
  - Botón "Registrar Pago" (abre formulario)
  - Botón "Saldar" (abre formulario con monto total)

✓ Formulario registrar pago funcional:
  - Campo monto recibido
  - Distribución automática proporcional
  - Confirmación con resumen
  - Actualización automática
```

#### 3.4 Paneles de Bancos (×6)

**Verificar CADA banco individualmente:**

##### Bóveda Monte
```
✓ Saldo/Capital actual: correcto según operaciones
✓ Tarjetas de resumen:
  - Total histórico ingresos (fijo, acumulativo)
  - Total histórico gastos (fijo, acumulativo)
  - Total histórico transferencias (fijo, acumulativo)
  - Capital actual (variable)

✓ Gráficas:
  - Evolución del capital (line chart)
  - Distribución ingresos vs gastos (pie chart)
  - Tendencia mensual (bar chart)

✓ Tabla de movimientos:
  - Fecha, Tipo, Concepto, Monto, Saldo Anterior, Saldo Nuevo
  - Paginación funcional
  - Filtros: fecha, tipo, monto
  - Búsqueda
  - Exportar CSV/Excel

✓ Formularios:
  - Registrar Gasto (funcional, valida saldo)
  - Registrar Ingreso Manual (funcional)
  - Transferir a otro banco (funcional, valida saldo)

✓ Botones de acción funcionan correctamente
✓ Actualizaciones en tiempo real
```

**Repetir verificación para:**
- ✓ Bóveda USA
- ✓ Utilidades
- ✓ Fletes (Flete Sur)
- ✓ Azteca
- ✓ Leftie
- ✓ Profit

#### 3.5 Panel Almacén

```
✓ Sección STOCK ACTUAL:
  - Lista de todos los productos
  - Cantidad en stock correcta (entradas - salidas)
  - Alertas de stock bajo (< 10 unidades)
  - Alertas de stock crítico (< 5 unidades)
  - Filtros y búsqueda funcionales

✓ Sección ENTRADAS (Histórico Fijo):
  - Tabla con todas las entradas desde inicio
  - Columnas: Fecha, OC, Producto, Cantidad, Proveedor
  - Total acumulativo correcto
  - NUNCA se elimina ningún registro
  - Paginación y filtros

✓ Sección SALIDAS (Histórico Fijo):
  - Tabla con todas las salidas desde inicio
  - Columnas: Fecha, Venta ID, Producto, Cantidad, Cliente
  - Total acumulativo correcto
  - NUNCA se elimina ningún registro
  - Paginación y filtros

✓ KPIs:
  - Total entradas históricas
  - Total salidas históricas
  - Stock actual total
  - Valor del inventario

✓ Gráficas:
  - Evolución del stock (line chart)
  - Entradas vs Salidas por mes (bar chart)
  - Productos más rotados (bar chart)
```

#### 3.6 Panel Órdenes de Compra

```
✓ Lista de todas las OCs (9 únicas mínimo)
✓ Filtros: fecha, distribuidor, estado, monto
✓ Búsqueda funcional
✓ Click en OC abre detalle con:
  - Información distribuidor
  - Lista de productos
  - Total de la orden
  - Estado
  - Fecha
  - Link al perfil del distribuidor

✓ Botón "Nueva OC" abre formulario funcional
✓ Estados de OC: Pendiente, Recibida, Cancelada
```

#### 3.7 Panel Ventas

```
✓ Lista de todas las ventas (96 mínimo)
✓ Filtros: fecha, cliente, estado pago, monto
✓ Búsqueda funcional
✓ Click en venta abre detalle con:
  - Información cliente
  - Productos vendidos
  - Precio de venta
  - Flete aplicado
  - Estado de pago
  - Monto pagado / Monto pendiente
  - Link al perfil del cliente

✓ Botón "Nueva Venta" abre formulario funcional
✓ Indicadores de estado claros (Pagado/Parcial/Pendiente)
```

#### 3.8 Panel Gastos y Abonos

```
✓ Lista de todos los gastos y abonos (~306 registros)
✓ Filtros: fecha, tipo, banco, monto
✓ Búsqueda funcional
✓ Tabla con columnas:
  - Fecha, Tipo, Concepto, Banco, Monto, Saldo Anterior, Saldo Nuevo

✓ KPIs:
  - Total gastos
  - Total abonos/ingresos
  - Balance neto
  - Por banco

✓ Gráficas:
  - Gastos por banco (pie chart)
  - Evolución mensual (line chart)
  - Top categorías de gastos (bar chart)
```

#### 3.9 Panel Reportes

```
✓ Constructor de reportes personalizado:
  - Seleccionar colección
  - Seleccionar campos
  - Aplicar filtros
  - Seleccionar rango de fechas
  - Generar reporte

✓ Reportes predefinidos (mínimo 20):
  01. Ventas por cliente
  02. Compras por distribuidor
  03. Estado de cuenta por banco
  04. Flujo de caja mensual
  05. Rentabilidad por producto
  06. Clientes con adeudo
  07. Distribuidores con adeudo
  08. Movimientos bancarios
  09. Histórico de stock
  10. Análisis de utilidades
  11. Comparativo mensual
  12. Top 10 clientes
  13. Top 10 productos
  14. Gastos por categoría
  15. Ingresos por fuente
  16. Estado financiero general
  17. Proyección de flujo de caja
  18. Análisis de rentabilidad
  19. Reporte de adeudos
  20. Balance general

✓ Exportar reportes:
  - PDF
  - Excel
  - CSV
  - Imprimir

✓ Programar reportes automáticos:
  - Seleccionar reporte
  - Seleccionar frecuencia (diario/semanal/mensual)
  - Seleccionar destinatarios (email)
  - Activar/Desactivar
```

---

### 4. CÁLCULOS Y FÓRMULAS ✓

**Verificar que TODAS las fórmulas se apliquen correctamente:**

#### 4.1 Fórmulas de Venta

```
🧮 VENTA COMPLETA:

PrecioTotal = (PrecioVenta + Flete) × Cantidad

Distribución:
  • Bóveda Monte = PrecioVenta × Cantidad
  • Fletes = Flete × Cantidad
  • Utilidades = (PrecioVenta - CostoUnitario) × Cantidad

TEST EJEMPLO:
  PrecioVenta = $7,000
  Flete = $500
  Cantidad = 10
  CostoUnitario = $6,300

  Total = (7000 + 500) × 10 = $75,000

  Bóveda Monte = 7000 × 10 = $70,000
  Fletes = 500 × 10 = $5,000
  Utilidades = (7000 - 6300) × 10 = $7,000

VERIFICAR:
✓ Total calculado: $75,000
✓ Bóveda Monte recibe: $70,000
✓ Fletes recibe: $5,000
✓ Utilidades recibe: $7,000
✓ Suma correcta: 70000 + 5000 + 7000 = 82000 ⚠️ REVISAR FÓRMULA
```

#### 4.2 Fórmulas de Stock

```
🧮 STOCK DINÁMICO:

StockActual = Σ(Entradas) - Σ(Salidas)

TEST EJEMPLO:
  Entradas: 100 + 50 + 75 = 225
  Salidas: 10 + 20 + 30 = 60
  Stock = 225 - 60 = 165

VERIFICAR:
✓ Stock calculado correctamente
✓ Se actualiza automáticamente con cada entrada
✓ Se actualiza automáticamente con cada salida
✓ NUNCA puede ser negativo (validación)
```

#### 4.3 Fórmulas de Capital Bancario

```
🧮 CAPITAL VARIABLE:

CapitalActual = SaldoInicial + Σ(Ingresos) - Σ(Gastos) + Σ(TransferenciasEntrada) - Σ(TransferenciasSalida)

Históricos (FIJOS, ACUMULATIVOS):
  HistóricoIngresos = Σ(Ingresos) + Σ(TransferenciasEntrada)
  HistóricoGastos = Σ(Gastos) + Σ(TransferenciasSalida)

VERIFICAR:
✓ Capital se actualiza correctamente
✓ Históricos NUNCA disminuyen
✓ Balance correcto: CapitalActual + GastosHistóricos = SaldoInicial + IngresosHistóricos
```

#### 4.4 Fórmulas de Adeudos

```
🧮 ADEUDO CLIENTE:

AdeudoInicial = TotalVenta - MontoAbonado
AdeudoActual = AdeudoInicial - Σ(Pagos)

🧮 ADEUDO DISTRIBUIDOR:

AdeudoInicial = TotalOC
AdeudoActual = AdeudoInicial - Σ(Pagos)

VERIFICAR:
✓ Adeudos se calculan correctamente
✓ Se actualizan con cada pago
✓ NUNCA pueden ser negativos
✓ Al llegar a 0, estado cambia a "Saldado"
```

---

### 5. FLUJOS COMPLETOS END-TO-END ✓

**Probar flujos completos que involucran múltiples operaciones:**

#### 5.1 Flujo Completo: Desde OC hasta Venta

```
PASO 1: Crear Orden de Compra
  → Distribuidor "Test Dist"
  → 100 unidades × $6,300
  → Total: $630,000

VERIFICAR:
✓ OC creada
✓ Distribuidor con adeudo $630,000
✓ Stock +100 unidades

PASO 2: Pagar OC (parcial $300,000 desde Profit)
  → Abonar $300,000

VERIFICAR:
✓ Adeudo distribuidor: $330,000
✓ Capital Profit: -$300,000

PASO 3: Registrar Venta (20 unidades)
  → Cliente "Test Cliente"
  → 20 × $7,000 + $500 flete
  → Pago completo

VERIFICAR:
✓ Venta registrada
✓ Cliente sin adeudo
✓ Stock: 80 unidades (100 - 20)
✓ Bóveda Monte: +$140,000
✓ Fletes: +$10,000
✓ Utilidades: +$14,000

PASO 4: Transferir utilidades a Azteca
  → $10,000 de Utilidades → Azteca

VERIFICAR:
✓ Capital Utilidades: -$10,000 (ahora $4,000)
✓ Capital Azteca: +$10,000

PASO 5: Pagar gasto desde Azteca
  → Gasto operativo $5,000

VERIFICAR:
✓ Capital Azteca: -$5,000
✓ Histórico gastos Azteca: +registro

RESULTADO FINAL ESPERADO:
✓ Stock: 80 unidades
✓ Bóveda Monte: +$140,000
✓ Fletes: +$10,000
✓ Utilidades: +$4,000 (14000 - 10000)
✓ Azteca: +$5,000 (10000 - 5000)
✓ Profit: -$300,000
✓ Adeudo distribuidor: $330,000
✓ Todos los históricos actualizados
✓ Todas las tablas con registros correctos
```

---

### 6. UI/UX Y DISEÑO PREMIUM ✓

**Verificar implementación de diseño ultra premium:**

```
✓ Paleta de colores:
  - Fondo principal: #000000 (negro puro)
  - Fondo secundario: #111827 (gray-900)
  - Acentos: Gradientes (#667eea → #764ba2 → #f093fb)
  - Texto: #ffffff, rgba(255,255,255,0.9), rgba(255,255,255,0.7)

✓ Glassmorphism:
  - backdrop-filter: blur(24px) saturate(180%)
  - background: rgba(255,255,255,0.05)
  - border: 1px solid rgba(255,255,255,0.08)
  - box-shadow: 0 8px 32px rgba(0,0,0,0.12)

✓ Animaciones y transiciones:
  - Framer Motion en todos los componentes
  - Transiciones suaves (300-400ms)
  - Hover effects en todos los botones
  - Micro-interacciones en formularios
  - Loading states animados
  - Skeleton loaders mientras carga datos

✓ Tipografía:
  - Font: Inter, sans-serif
  - Tamaños jerárquicos correctos
  - Line-height adecuado
  - Letter-spacing optimizado

✓ Espaciado:
  - Padding y margin consistentes
  - Sistema de espaciado (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px)
  - Uso correcto de gap en flex/grid

✓ Iconos:
  - Lucide React para todos los iconos
  - Tamaño consistente (20px o 24px)
  - Colores coherentes con el tema

✓ Componentes UI:
  - Botones con variantes (primary, secondary, danger, ghost)
  - Inputs con focus states animados
  - Selects estilizados
  - Badges con colores por estado
  - Cards con glassmorphism
  - Modals con overlay blur
  - Toasts con animaciones
  - Tooltips informativos

✓ Responsive:
  - Breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
  - Mobile-first approach
  - Grid y flex responsive
  - Menú hamburguesa en mobile
  - Tablas scrolleables en mobile

✓ Dark Mode:
  - Todo el sistema en dark mode por defecto
  - Contraste WCAG AA mínimo
  - Sin blanco puro (usar off-white)

✓ Performance:
  - Lazy loading de componentes pesados
  - Virtual scrolling en listas largas
  - Debounce en búsquedas (300ms)
  - Optimistic updates en mutaciones
  - Cache de React Query (5 minutos)
```

---

### 7. TESTING Y CALIDAD ✓

**Ejecutar batería completa de tests:**

```
🧪 TESTS UNITARIOS:
  ✓ Funciones de cálculo (fórmulas)
  ✓ Validaciones de formularios
  ✓ Transformaciones de datos
  ✓ Helpers y utilidades
  ✓ Hooks personalizados

  Comando: npm run test
  Cobertura mínima: 80%

🧪 TESTS DE INTEGRACIÓN:
  ✓ Servicios de Firebase
  ✓ Flujos de CRUD
  ✓ Lógica de negocio
  ✓ Actualización de stocks
  ✓ Cálculo de adeudos

  Comando: npm run test:integration

🧪 TESTS E2E:
  ✓ Flujo completo de OC
  ✓ Flujo completo de Venta
  ✓ Flujo de pagos
  ✓ Flujo de transferencias
  ✓ Navegación entre paneles

  Comando: npm run test:e2e

🔍 LINTING Y FORMATTING:
  ✓ ESLint sin errores
  ✓ Sin warnings críticos
  ✓ Prettier aplicado
  ✓ Imports organizados

  Comandos:
    npm run lint
    npm run format

🚀 BUILD DE PRODUCCIÓN:
  ✓ Build exitoso sin errores
  ✓ Bundle size optimizado (< 1MB gzipped)
  ✓ Tree shaking aplicado
  ✓ Code splitting por rutas

  Comando: npm run build

🔒 SEGURIDAD:
  ✓ Firestore Rules validadas
  ✓ No hay secretos en el código
  ✓ Validación en frontend Y backend
  ✓ Sanitización de inputs
  ✓ Rate limiting en operaciones sensibles

  Comando: npm audit

📊 PERFORMANCE:
  ✓ Lighthouse score > 90
  ✓ First Contentful Paint < 1.5s
  ✓ Time to Interactive < 3s
  ✓ No memory leaks
  ✓ No console errors/warnings

  Comando: npm run lighthouse
```

---

### 8. NAVEGACIÓN Y ACCESIBILIDAD ✓

```
✓ Navegación:
  - Sidebar con todos los paneles
  - Breadcrumbs en cada página
  - Navegación por teclado funcional
  - Links y botones accesibles
  - Estados de hover/focus claros

✓ Accesibilidad (A11y):
  - Contraste WCAG AA
  - ARIA labels en elementos interactivos
  - Semantic HTML correcto
  - Focus trapping en modals
  - Screen reader friendly
  - Keyboard shortcuts documentados

✓ SEO:
  - Meta tags dinámicos
  - Títulos de página descriptivos
  - Open Graph tags
  - Sitemap.xml
```

---

### 9. VALIDACIONES Y MANEJO DE ERRORES ✓

```
✓ Validaciones Frontend:
  - Campos requeridos marcados
  - Validación en tiempo real
  - Mensajes de error claros
  - Prevención de submit inválido
  - Feedback visual inmediato

✓ Validaciones Backend (Firestore Rules):
  - Solo usuarios autenticados pueden escribir
  - Validación de tipos de datos
  - Validación de rangos (montos > 0)
  - Prevención de datos maliciosos

✓ Manejo de Errores:
  - Try-catch en todas las operaciones async
  - Error Boundaries en componentes React
  - Toasts informativos de errores
  - Logging de errores (Sentry o similar)
  - Retry logic en operaciones fallidas
  - Fallbacks para datos no disponibles

✓ Estados de Carga:
  - Skeleton loaders mientras carga
  - Spinners en operaciones largas
  - Feedback de "Guardando..."
  - Confirmación de éxito con toast
```

---

### 10. DOCUMENTACIÓN ✓

```
✓ README.md actualizado:
  - Descripción del proyecto
  - Tecnologías usadas
  - Instrucciones de instalación
  - Comandos disponibles
  - Estructura de carpetas
  - Guía de contribución

✓ JSDoc en funciones complejas:
  - Descripción de la función
  - @param con tipos
  - @returns con tipo de retorno
  - @example con caso de uso

✓ Comentarios en código:
  - Explicación de lógica compleja
  - TODOs para mejoras futuras
  - Warnings para código sensible

✓ Guías de usuario:
  - Cómo crear una OC
  - Cómo registrar una venta
  - Cómo gestionar adeudos
  - Cómo hacer transferencias
  - Cómo generar reportes

✓ Changelog:
  - Versiones y fechas
  - Cambios importantes
  - Bugs corregidos
  - Features nuevas
```

---

## 🚀 COMANDO DE VERIFICACIÓN MAESTRA

```bash
# Ejecutar TODOS los checks automáticamente
npm run verify:all

# Este comando debe ejecutar en secuencia:
# 1. Verificar datos en Firestore
# 2. Lint
# 3. Tests unitarios
# 4. Tests de integración
# 5. Build de producción
# 6. Lighthouse
# 7. Generar reporte completo

# Al final, debe generar:
# ✅ VERIFICACION_COMPLETA_REPORT.md
#    Con resumen de TODOS los checks y su estado
```

---

## ✅ CRITERIO DE APROBACIÓN

El sistema está **100% completo y funcional** cuando:

- [ ] **TODOS** los datos están migrados correctamente (31 clientes, 2-6 dist, 9 OCs, 96 ventas, ~306 gastos)
- [ ] **TODOS** los formularios funcionan sin errores
- [ ] **TODOS** los paneles muestran datos correctos
- [ ] **TODAS** las fórmulas calculan correctamente
- [ ] **TODOS** los flujos end-to-end funcionan
- [ ] **TODOS** los tests pasan (unit + integration + e2e)
- [ ] **CERO** errores en consola
- [ ] **CERO** warnings críticos
- [ ] Build de producción exitoso
- [ ] Lighthouse score > 90
- [ ] UI/UX premium implementada
- [ ] Responsive en mobile y desktop
- [ ] Documentación completa
- [ ] Performance optimizado
- [ ] Seguridad validada

---

## 📋 REPORTE FINAL

Después de completar TODAS las verificaciones, generar reporte con:

```markdown
# REPORTE DE VERIFICACIÓN COMPLETA

## Fecha: [fecha]
## Verificado por: [nombre]

### Resumen Ejecutivo
- Estado General: ✅ APROBADO / ❌ RECHAZADO
- Tests Pasados: X/Y (Z%)
- Cobertura de Tests: X%
- Errores Encontrados: X
- Warnings: X

### Detalles por Sección
[Detalle de cada sección con ✅ o ❌]

### Issues Encontrados
[Lista de problemas pendientes con prioridad]

### Recomendaciones
[Mejoras sugeridas]

### Conclusión
[Resumen final y próximos pasos]
```

---

**🎯 ESTE PROMPT DEBE SER EJECUTADO PERIÓDICAMENTE PARA MANTENER LA CALIDAD AL 100%**
