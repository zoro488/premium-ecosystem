# 🎯 PROMPT MAESTRO: VERIFICACIÓN E IMPLEMENTACIÓN COMPLETA

## FlowDistributor - Sistema de Gestión Operacional y Financiera

---

## 📌 OBJETIVO FINAL

Implementar y verificar **al 100%** el sistema FlowDistributor con:

- ✅ **0 errores** en compilación, linting y tests
- ✅ **Lógica operacional perfecta** según especificaciones
- ✅ **UI/UX responsiva** con actualizaciones automáticas en tiempo real
- ✅ **Trazabilidad completa** de todas las operaciones
- ✅ **Performance óptima** (LCP < 2.0s, INP < 200ms)
- ✅ **Accesibilidad A11y** (axe 0 críticos)

---

## 🧮 REGLAS DE NEGOCIO FUNDAMENTALES

### **FÓRMULA MAESTRA (INVARIANTE)**

```
PV = FL + BM + UT

Donde:
- PV = Precio de Venta Total
- FL = Fletes (500 × unidades, editable)
- BM = Bóveda Monte (Σ costo_compra × unidades)
- UT = Utilidades (PV - FL - BM)

CASOS EDGE:
- Si PV < FL → {FL=PV, BM=0, UT=0} ⚠️ Pérdida por flete
- Si PV ≈ FL+BM → UT ≈ 0
- Si PV ≫ FL+BM → UT > 0
```

### **HISTÓRICO vs CAPITAL (CRÍTICO)**

**HISTÓRICO (Acumulativo Fijo):**

- ✅ Se registra **AL GENERAR LA VENTA** (independiente del pago)
- ✅ Siempre va **SUBIENDO** (nunca disminuye)
- ✅ Muestra el total de operaciones registradas

**CAPITAL (Variable):**

- ✅ Se actualiza **AL COBRAR/ABONAR**
- ✅ Varía según: +Ingresos +Transferencias_IN -Gastos -Transferencias_OUT
- ✅ Representa el dinero **disponible** en cada banco

---

## 🏗️ ARQUITECTURA DEL SISTEMA

### **MÓDULOS PRINCIPALES**

#### **1. ÓRDENES DE COMPRA (OC)**

```
FLUJO:
1. Usuario llena OCForm → Proveedor + Items (producto, cantidad, costo_unitario)
2. Sistema crea/actualiza perfil Distribuidor
3. Total OC → Adeudo con Distribuidor
4. OC → Panel Distribuidores (visualización automática)
5. OC → Panel Almacén:
   - Stock Actual: +cantidad
   - Histórico Entradas: +cantidad (fijo, acumulativo)
```

**COMPONENTES:**

- ✅ `OCForm`: Formulario registro OC
- ✅ `DistribuidorList`: Panel con perfiles + adeudos
- ✅ `PagoDistribuidorDialog`: Abono/Saldar + Selección banco origen

**VALIDACIONES:**

- ❌ No permitir cantidad ≤ 0
- ❌ No permitir costo unitario < 0
- ✅ Crear distribuidor si no existe

---

#### **2. VENTAS**

```
FLUJO:
1. Usuario llena VentaForm:
   - Cliente (texto libre)
   - Productos: [{ nombre, cantidad, precio_venta_unitario, precio_compra_unitario }]
   - Flete por unidad: 500 USD (editable)
   - Estado: COMPLETO | PARCIAL | NADA
   - Si PARCIAL → Monto Abonado (visible solo si PARCIAL)

2. Cálculos automáticos:
   FL = flete × Σ cantidad
   BM = Σ (precio_compra × cantidad)
   UT = PV - FL - BM
   PV = Σ [(precio_venta + flete) × cantidad]

3. Sistema crea/actualiza perfil Cliente
4. Adeudo Cliente = PV - Monto Abonado

5. REGISTROS AUTOMÁTICOS:

   BÓVEDA MONTE:
   - Histórico: +PV (siempre)
   - Capital: +Monto Pagado (según estado)
   - Registro: { cliente, productos, PV, estado, monto_pagado, adeudo }

   FLETES:
   - Histórico: +FL (siempre)
   - Capital: +FL (solo si COMPLETO, o proporcional si PARCIAL)
   - Registro: { venta_id, FL, estado }

   UTILIDADES:
   - Histórico: +UT (siempre)
   - Capital: +UT (solo si COMPLETO, o proporcional si PARCIAL)
   - Registro: { venta_id, UT, estado }

6. ALMACÉN:
   - Stock Actual: -cantidad
   - Histórico Salidas: +cantidad (fijo, acumulativo)
```

**COMPONENTES:**

- ✅ `VentaForm`: Formulario registro venta
  - ✅ Input Cliente
  - ✅ Select Estado (COMPLETO/PARCIAL/NADA)
  - ✅ Input Monto Abonado (visible solo si PARCIAL)
  - ✅ Input Flete (default 500, editable)
  - ✅ Tabla Productos (agregar/eliminar filas)
  - ✅ Preview cálculos FL/BM/UT en tiempo real
- ✅ `ClientesList`: Panel con perfiles + adeudos
- ✅ `AbonoClienteDialog`: Abono/Saldar + Selección banco destino

**VALIDACIONES:**

- ❌ No permitir cantidad ≤ 0
- ❌ No permitir precio_venta < 0
- ❌ No permitir flete < 0
- ⚠️ Alertar si PV < FL (pérdida por flete)
- ❌ No permitir venta si stock insuficiente
- ❌ Si PARCIAL: Monto Abonado debe ser > 0 y < PV

---

#### **3. ALMACÉN**

```
ESTRUCTURA:
- Stock Actual: Cantidad disponible (Entradas - Salidas)
- Histórico Entradas: Acumulativo (solo +, nunca -)
- Histórico Salidas: Acumulativo (solo +, nunca -)
```

**COMPONENTES:**

- ✅ `AlmacenPanel`:
  - ✅ Tabla Stock Actual (producto, cantidad)
  - ✅ Tabla Histórico Entradas (OC, producto, cantidad, fecha)
  - ✅ Tabla Histórico Salidas (Venta, producto, cantidad, fecha)
  - ✅ Indicador visual: Entradas (verde), Salidas (rojo)

**REGLAS:**

- ✅ Stock NUNCA puede ser negativo
- ✅ Entradas/Salidas son **inmutables** (WORM: Write Once Read Many)

---

#### **4. BANCOS (6 TOTALES)**

**BANCOS CON REGISTRO AUTOMÁTICO POR VENTAS:**

1. **Bóveda Monte** (BM)
2. **Fletes** (FL)
3. **Utilidades** (UT)

**BANCOS CON INGRESO MANUAL:**
4. **Azteca**
5. **Leftie**
6. **Profit**

**ESTRUCTURA DE CADA BANCO:**

```javascript
{
  nombre: string,
  historico: number,          // Acumulativo (↑ siempre)
  capital: number,            // Variable (ingresos - egresos)
  registros: [
    {
      tipo: 'ingreso' | 'venta' | 'abono' | 'transferencia_in',
      concepto: string,
      monto: number,
      estado?: 'completo' | 'parcial' | 'pendiente',
      fecha: timestamp
    }
  ],
  gastos: [
    {
      concepto: string,
      descripcion: string,
      monto: number,
      fecha: timestamp
    }
  ],
  transferencias: [
    {
      tipo: 'entrada' | 'salida',
      desde?: string,  // Si es entrada
      hacia?: string,  // Si es salida
      monto: number,
      concepto: string,
      descripcion: string,
      fecha: timestamp
    }
  ]
}
```

**COMPONENTES POR BANCO:**

- ✅ Card **Histórico** (solo lectura, badge verde)
- ✅ Card **Capital** (editable vía operaciones, badge azul)
- ✅ Card **Total Gastos** (histórico acumulativo, badge rojo)
- ✅ Card **Total Transferencias** (netas, badge púrpura)
- ✅ `TransferenciaForm`:
  - Input Monto
  - Select Banco Destino
  - Input Concepto
  - Textarea Descripción
  - Botón "Transferir"
- ✅ `GastoForm`:
  - Input Monto
  - Input Concepto (con autosuggest IA)
  - Textarea Descripción
  - Botón "Registrar Gasto"
- ✅ `IngresoForm` (solo Azteca/Leftie/Profit):
  - Input Monto
  - Input Concepto
  - Textarea Descripción
  - Botón "Registrar Ingreso"
- ✅ Tabla Registros (histórico de operaciones)
- ✅ Tabla Gastos (con filtros por concepto/fecha)
- ✅ Tabla Transferencias (entrada/salida con banco origen/destino)

**OPERACIONES:**

**A. TRANSFERENCIA (Banco → Banco):**

```
1. Usuario selecciona Banco Origen (ej: BM)
2. Llena TransferenciaForm:
   - Monto: 5000
   - Banco Destino: Azteca
   - Concepto: "Rebalanceo"
   - Descripción: "Ajuste trimestral"

3. Sistema valida:
   ✅ Monto > 0
   ✅ Monto ≤ Capital del Banco Origen
   ✅ Banco Destino ≠ Banco Origen

4. Actualiza:
   Banco Origen (BM):
   - capital: -5000
   - transferencias: +{ tipo:'salida', hacia:'Azteca', monto:5000, ... }

   Banco Destino (Azteca):
   - historico: +5000
   - capital: +5000
   - transferencias: +{ tipo:'entrada', desde:'BM', monto:5000, ... }

5. Notificación: "Transferencia de $5,000 de BM a Azteca realizada ✅"
```

**B. GASTO (Banco → Egreso):**

```
1. Usuario selecciona Banco (ej: Azteca)
2. Llena GastoForm:
   - Monto: 1500
   - Concepto: "Renta"
   - Descripción: "Oficina mes de octubre"

3. Sistema valida:
   ✅ Monto > 0
   ✅ Monto ≤ Capital del Banco

4. Actualiza:
   Banco (Azteca):
   - capital: -1500
   - gastos: +{ concepto:'Renta', monto:1500, ... }

5. Notificación: "Gasto de $1,500 registrado en Azteca ✅"
```

**C. INGRESO (Solo Azteca/Leftie/Profit):**

```
1. Usuario selecciona Banco (ej: Profit)
2. Llena IngresoForm:
   - Monto: 10000
   - Concepto: "Inversión"
   - Descripción: "Depósito trimestral"

3. Actualiza:
   Banco (Profit):
   - historico: +10000
   - capital: +10000
   - registros: +{ tipo:'ingreso', concepto:'Inversión', monto:10000, ... }

4. Notificación: "Ingreso de $10,000 registrado en Profit ✅"
```

---

#### **5. DEUDAS DE CLIENTES**

```
FLUJO ABONO:
1. Usuario va a ClientesList
2. Selecciona cliente con adeudo > 0
3. Abre AbonoClienteDialog:
   - Monto: 3000 (máximo: adeudo actual)
   - Botón "Abonar" / "Saldar" (saldar = pagar todo)

4. Sistema actualiza:
   Cliente:
   - adeudo: -3000
   - abonos: +{ monto:3000, fecha }

   Bóveda Monte:
   - capital: +3000 (va directo a BM)

5. DISTRIBUCIÓN PROPORCIONAL (opcional avanzada):
   Si se implementa distribución FL→BM→UT:

   Ejemplo: Venta de $10,000 con FL=$4,000, BM=$3,000, UT=$3,000
   Abono de $5,000 se distribuye:
   - FL: $5,000 × (4,000/10,000) = $2,000 → Banco Fletes capital +$2,000
   - BM: $5,000 × (3,000/10,000) = $1,500 → Banco BM capital +$1,500
   - UT: $5,000 × (3,000/10,000) = $1,500 → Banco UT capital +$1,500

6. Notificación: "Abono de $3,000 registrado para Cliente X ✅"
```

**COMPONENTES:**

- ✅ `ClientesList`: Panel clientes
  - ✅ Cards por cliente (nombre, total ventas, adeudo)
  - ✅ Badge rojo si adeudo > 0, verde si = 0
  - ✅ Botón "Ver detalle" → ClienteDetail
- ✅ `ClienteDetail`:
  - ✅ Tabla ventas del cliente
  - ✅ Tabla abonos realizados
  - ✅ Botón "Abonar"/"Saldar"
- ✅ `AbonoClienteDialog`:
  - ✅ Input Monto (con validación ≤ adeudo)
  - ✅ Botón "Abonar" / "Saldar"

---

#### **6. DEUDAS CON DISTRIBUIDORES**

```
FLUJO PAGO:
1. Usuario va a DistribuidorList
2. Selecciona distribuidor con adeudo > 0
3. Abre PagoDistribuidorDialog:
   - Select Banco Origen (BM, FL, UT, Azteca, Leftie, Profit)
   - Monto: 8000 (máximo: adeudo actual)
   - Botón "Abonar" / "Saldar"

4. Sistema valida:
   ✅ Monto > 0
   ✅ Monto ≤ Adeudo distribuidor
   ✅ Monto ≤ Capital del Banco Origen

5. Actualiza:
   Distribuidor:
   - adeudo: -8000
   - pagos: +{ monto:8000, banco:'Azteca', fecha }

   Banco Origen (Azteca):
   - capital: -8000
   - gastos: +{ concepto:'Pago a Distribuidor X', monto:8000, ... }

6. Notificación: "Pago de $8,000 a Distribuidor X desde Azteca ✅"
```

**COMPONENTES:**

- ✅ `DistribuidorList`: Panel distribuidores
  - ✅ Cards por distribuidor (nombre, total OCs, adeudo)
  - ✅ Badge rojo si adeudo > 0, verde si = 0
  - ✅ Botón "Ver detalle" → DistribuidorDetail
- ✅ `DistribuidorDetail`:
  - ✅ Tabla OCs del distribuidor
  - ✅ Tabla pagos realizados
  - ✅ Botón "Pagar"
- ✅ `PagoDistribuidorDialog`:
  - ✅ Select Banco Origen
  - ✅ Input Monto (con validación)
  - ✅ Botón "Abonar" / "Saldar"

---

## 🧪 CHECKLIST DE VERIFICACIÓN (100+ PUNTOS)

### **A. ÓRDENES DE COMPRA**

- [ ] 1. OCForm valida campos obligatorios (proveedor, productos)
- [ ] 2. OCForm valida cantidad > 0
- [ ] 3. OCForm valida costo_unitario ≥ 0
- [ ] 4. Al crear OC, se crea/actualiza perfil distribuidor
- [ ] 5. Total OC se calcula correctamente: Σ(cantidad × costo_unitario)
- [ ] 6. Adeudo distribuidor = Total OC
- [ ] 7. OC aparece en DistribuidorList automáticamente
- [ ] 8. OC aparece en AlmacenPanel > Histórico Entradas
- [ ] 9. Stock Actual se incrementa correctamente
- [ ] 10. Stock NUNCA es negativo
- [ ] 11. Histórico Entradas es inmutable (no se puede editar/borrar)
- [ ] 12. UI se actualiza en tiempo real (sin refresh manual)

### **B. VENTAS**

- [ ] 13. VentaForm muestra todos los campos requeridos
- [ ] 14. Campo "Monto Abonado" solo visible si Estado = PARCIAL
- [ ] 15. VentaForm valida cantidad > 0
- [ ] 16. VentaForm valida precio_venta ≥ 0
- [ ] 17. VentaForm valida flete ≥ 0
- [ ] 18. Flete tiene valor por defecto 500 USD (editable)
- [ ] 19. FL se calcula correctamente: flete × Σ cantidad
- [ ] 20. BM se calcula correctamente: Σ(precio_compra × cantidad)
- [ ] 21. UT se calcula correctamente: PV - FL - BM
- [ ] 22. PV se calcula correctamente: Σ[(precio_venta + flete) × cantidad]
- [ ] 23. Valida PV = FL + BM + UT (con tolerancia ±0.01)
- [ ] 24. Si PV < FL → Alerta "Pérdida por flete"
- [ ] 25. No permite venta si stock insuficiente
- [ ] 26. Si PARCIAL: Monto Abonado > 0 y < PV
- [ ] 27. Preview cálculos FL/BM/UT se muestra en tiempo real
- [ ] 28. Al crear venta, se crea/actualiza perfil cliente
- [ ] 29. Adeudo cliente = PV - Monto Abonado

### **C. REGISTROS AUTOMÁTICOS (BÓVEDA MONTE)**

- [ ] 30. BM.historico aumenta en +PV (siempre, sin importar estado)
- [ ] 31. Si Estado = COMPLETO: BM.capital aumenta en +PV
- [ ] 32. Si Estado = PARCIAL: BM.capital aumenta en +Monto Abonado
- [ ] 33. Si Estado = NADA: BM.capital NO cambia
- [ ] 34. Registro en BM incluye: cliente, PV, estado, monto_pagado, adeudo
- [ ] 35. Registro muestra badge según estado (verde/amarillo/rojo)

### **D. REGISTROS AUTOMÁTICOS (FLETES)**

- [ ] 36. FL.historico aumenta en +FL (siempre)
- [ ] 37. Si Estado = COMPLETO: FL.capital aumenta en +FL
- [ ] 38. Si Estado = PARCIAL: FL.capital aumenta proporcional
- [ ] 39. Si Estado = NADA: FL.capital NO cambia
- [ ] 40. Registro en FL incluye: venta_id, FL, estado

### **E. REGISTROS AUTOMÁTICOS (UTILIDADES)**

- [ ] 41. UT.historico aumenta en +UT (siempre)
- [ ] 42. Si Estado = COMPLETO: UT.capital aumenta en +UT
- [ ] 43. Si Estado = PARCIAL: UT.capital aumenta proporcional
- [ ] 44. Si Estado = NADA: UT.capital NO cambia
- [ ] 45. Registro en UT incluye: venta_id, UT, estado

### **F. ALMACÉN (SALIDAS POR VENTA)**

- [ ] 46. Stock Actual se decrementa correctamente
- [ ] 47. Stock NUNCA puede ser < 0
- [ ] 48. Histórico Salidas se incrementa correctamente
- [ ] 49. Histórico Salidas es inmutable
- [ ] 50. Salida incluye: venta_id, producto, cantidad, fecha

### **G. ABONOS DE CLIENTES**

- [ ] 51. ClientesList muestra todos los clientes con ventas
- [ ] 52. Badge rojo si adeudo > 0, verde si = 0
- [ ] 53. AbonoClienteDialog valida monto > 0
- [ ] 54. AbonoClienteDialog valida monto ≤ adeudo
- [ ] 55. Al abonar: cliente.adeudo disminuye
- [ ] 56. Al abonar: BM.capital aumenta
- [ ] 57. Botón "Saldar" paga el adeudo completo
- [ ] 58. Registro abono incluye: monto, fecha
- [ ] 59. UI se actualiza en tiempo real

### **H. PAGOS A DISTRIBUIDORES**

- [ ] 60. DistribuidorList muestra todos los distribuidores
- [ ] 61. Badge rojo si adeudo > 0, verde si = 0
- [ ] 62. PagoDistribuidorDialog muestra select de bancos
- [ ] 63. PagoDistribuidorDialog valida monto > 0
- [ ] 64. PagoDistribuidorDialog valida monto ≤ adeudo
- [ ] 65. PagoDistribuidorDialog valida monto ≤ capital banco origen
- [ ] 66. Al pagar: distribuidor.adeudo disminuye
- [ ] 67. Al pagar: banco_origen.capital disminuye
- [ ] 68. Pago se registra como gasto en banco_origen
- [ ] 69. Botón "Saldar" paga el adeudo completo
- [ ] 70. Registro pago incluye: monto, banco, fecha
- [ ] 71. UI se actualiza en tiempo real

### **I. TRANSFERENCIAS (BANCO → BANCO)**

- [ ] 72. TransferenciaForm valida monto > 0
- [ ] 73. TransferenciaForm valida monto ≤ capital banco origen
- [ ] 74. TransferenciaForm valida banco_destino ≠ banco_origen
- [ ] 75. TransferenciaForm valida concepto no vacío
- [ ] 76. Al transferir: banco_origen.capital disminuye
- [ ] 77. Al transferir: banco_destino.capital aumenta
- [ ] 78. Al transferir: banco_destino.historico aumenta
- [ ] 79. Registro en banco_origen: tipo='salida', hacia, monto
- [ ] 80. Registro en banco_destino: tipo='entrada', desde, monto
- [ ] 81. UI se actualiza en tiempo real

### **J. GASTOS**

- [ ] 82. GastoForm valida monto > 0
- [ ] 83. GastoForm valida monto ≤ capital banco
- [ ] 84. GastoForm valida concepto no vacío
- [ ] 85. Al registrar gasto: banco.capital disminuye
- [ ] 86. Gasto se agrega a banco.gastos
- [ ] 87. Registro incluye: concepto, descripcion, monto, fecha
- [ ] 88. Autosuggest de conceptos funciona (IA)
- [ ] 89. UI se actualiza en tiempo real

### **K. INGRESOS (AZTECA/LEFTIE/PROFIT)**

- [ ] 90. IngresoForm solo visible en Azteca/Leftie/Profit
- [ ] 91. IngresoForm valida monto > 0
- [ ] 92. IngresoForm valida concepto no vacío
- [ ] 93. Al registrar ingreso: banco.historico aumenta
- [ ] 94. Al registrar ingreso: banco.capital aumenta
- [ ] 95. Registro incluye: concepto, descripcion, monto, fecha
- [ ] 96. UI se actualiza en tiempo real

### **L. VISUALIZACIÓN DE DATOS**

- [ ] 97. Todos los paneles muestran datos actualizados sin refresh
- [ ] 98. Cards Histórico muestran valores acumulativos
- [ ] 99. Cards Capital muestran valores actuales
- [ ] 100. Badges de estado (verde/rojo) funcionan correctamente
- [ ] 101. Tablas tienen scroll si muchos registros
- [ ] 102. Filtros de búsqueda funcionan
- [ ] 103. Export CSV/JSON funciona
- [ ] 104. Gráficos se actualizan en tiempo real

### **M. VALIDACIONES GENERALES**

- [ ] 105. No se permiten valores negativos en montos
- [ ] 106. No se permiten campos vacíos en formularios obligatorios
- [ ] 107. Notificaciones se muestran en cada operación
- [ ] 108. Notificaciones success (verde), error (rojo), warning (amarillo)
- [ ] 109. Stock nunca puede ser negativo
- [ ] 110. Capital nunca puede ser negativo
- [ ] 111. Adeudos nunca pueden ser negativos

### **N. PERFORMANCE**

- [ ] 112. LCP (Largest Contentful Paint) < 2.0s
- [ ] 113. INP (Interaction to Next Paint) < 200ms
- [ ] 114. CLS (Cumulative Layout Shift) < 0.1
- [ ] 115. No memory leaks detectados
- [ ] 116. Animaciones smooth (60 FPS)

### **O. ACCESIBILIDAD (A11Y)**

- [ ] 117. axe-core: 0 errores críticos
- [ ] 118. Todos los botones tienen focus-visible
- [ ] 119. Formularios tienen labels correctos
- [ ] 120. Navegación por teclado funciona (Tab, Enter, Esc)
- [ ] 121. Roles ARIA correctos
- [ ] 122. Contraste de colores WCAG AA

---

## 🔍 PROCEDIMIENTO DE VERIFICACIÓN

### **PASO 1: ANÁLISIS ESTÁTICO**

```bash
# TypeScript
pnpm dlx tsc --noEmit

# ESLint
pnpm dlx eslint src --ext .js,.jsx,.ts,.tsx --max-warnings=0

# Prettier
pnpm dlx prettier --check "src/**/*.{js,jsx,ts,tsx,json,css,md}"
```

### **PASO 2: TESTS UNITARIOS**

```bash
# Vitest
pnpm test:unit

# Tests específicos de lógica de negocio
- calc.spec.ts: Fórmulas PV=FL+BM+UT
- banks.spec.ts: Transferencias, gastos, ingresos
- stock.spec.ts: Entradas, salidas, validaciones
```

### **PASO 3: TESTS DE INTEGRACIÓN**

```bash
# Con Firebase/LocalStorage
pnpm test:integration

# Flujos completos:
- OC → Almacén → Distribuidor
- Venta → Almacén → Cliente → Bancos
- Abono Cliente → Banco
- Pago Distribuidor → Banco
```

### **PASO 4: TESTS E2E (PLAYWRIGHT)**

```bash
pnpm test:e2e

# Escenarios:
1. Crear OC → Ver en Distribuidores → Ver en Almacén
2. Registrar Venta COMPLETO → Ver registros BM/FL/UT
3. Registrar Venta PARCIAL → Abonar → Saldar
4. Transferencia Banco → Banco
5. Registrar Gasto → Ver en Banco
6. Pagar Distribuidor → Ver adeudo disminuir
```

### **PASO 5: TESTS A11Y**

```bash
pnpm test:a11y

# Páginas a probar:
- /dashboard
- /ventas
- /distribuidores
- /almacen
- /bancos/:nombre
- /clientes
```

### **PASO 6: TESTS PERFORMANCE**

```bash
# Lighthouse CI
pnpm test:perf

# Métricas objetivo:
- Performance: ≥ 90
- Accessibility: 100
- Best Practices: ≥ 90
- SEO: ≥ 90
```

---

## 🛠️ POLÍTICA DE REPARACIÓN

### **SI UNA VERIFICACIÓN FALLA:**

1. **Imprime error detallado:**

   ```
   ❌ FALLO: [Archivo:Línea]
   Razón: [Descripción del error]
   Esperado: [Valor esperado]
   Recibido: [Valor actual]
   ```

2. **Genera diff/patch sugerido:**

   ```diff
   - código_actual
   + código_corregido
   ```

3. **Aplica patch automáticamente**

4. **Re-ejecuta verificación**

5. **Repite hasta "verde" (✅)**

### **SI FALTA UN COMPONENTE:**

1. Crea con implementación mínima real
2. Agrega test asociado
3. Verifica que pasa todas las validaciones

---

## 📊 REPORTE FINAL ESPERADO

Al finalizar todas las verificaciones, genera:

```markdown
# ✅ REPORTE DE VERIFICACIÓN FLOWDISTRIBUTOR

## RESUMEN EJECUTIVO
- ✅ Compilación: OK (0 errores TypeScript)
- ✅ Linting: OK (0 warnings)
- ✅ Tests Unitarios: OK (120/120 pasando)
- ✅ Tests Integración: OK (50/50 pasando)
- ✅ Tests E2E: OK (25/25 pasando)
- ✅ A11y: OK (0 errores críticos)
- ✅ Performance: OK (LCP 1.8s, INP 150ms, CLS 0.05)

## VERIFICACIONES COMPLETADAS

### Órdenes de Compra (12/12 ✅)
- ✅ Todos los checks pasaron

### Ventas (17/17 ✅)
- ✅ Todos los checks pasaron

### Registros Automáticos (15/15 ✅)
- ✅ BM: Histórico/Capital correctos
- ✅ FL: Histórico/Capital correctos
- ✅ UT: Histórico/Capital correctos

### Almacén (5/5 ✅)
- ✅ Stock nunca negativo
- ✅ Históricos inmutables

### Deudas (19/19 ✅)
- ✅ Clientes: Abonos correctos
- ✅ Distribuidores: Pagos correctos

### Bancos (35/35 ✅)
- ✅ Transferencias correctas
- ✅ Gastos correctos
- ✅ Ingresos correctos

### Validaciones (7/7 ✅)
- ✅ No valores negativos
- ✅ Notificaciones funcionando

### Performance (5/5 ✅)
- ✅ LCP: 1.8s (< 2.0s)
- ✅ INP: 150ms (< 200ms)
- ✅ CLS: 0.05 (< 0.1)

### Accesibilidad (6/6 ✅)
- ✅ axe-core: 0 errores
- ✅ Navegación teclado: OK

## CAPTURAS E2E
- [Ver carpeta screenshots/]

## CONCLUSIÓN
🎉 SISTEMA 100% FUNCIONAL Y VERIFICADO
```

---

## 🚀 COMANDOS DE EJECUCIÓN

```bash
# Verificación completa (ejecutar en orden)
pnpm install
pnpm dlx tsc --noEmit
pnpm dlx eslint src --ext .js,.jsx,.ts,.tsx --max-warnings=0
pnpm test:unit
pnpm test:integration
pnpm test:e2e
pnpm test:a11y
pnpm test:perf

# O ejecutar todo de una vez:
pnpm run verify:all
```

---

## 📝 NOTAS FINALES

1. **PRIORIDAD MÁXIMA**: Cumplir regla PV = FL + BM + UT
2. **CRÍTICO**: Histórico sube al registrar venta, Capital sube al cobrar
3. **INMUTABILIDAD**: Stock histórico (entradas/salidas) NUNCA se edita
4. **TRAZABILIDAD**: Cada operación debe tener registro con timestamp
5. **UX**: Actualizaciones en tiempo real (sin refresh manual)
6. **VALIDACIONES**: No permitir operaciones inválidas (stock negativo, capital negativo, etc.)

---

**OBJETIVO FINAL CUMPLIDO = TODOS LOS CHECKS ✅ + REPORTE VERDE + 0 ERRORES**
