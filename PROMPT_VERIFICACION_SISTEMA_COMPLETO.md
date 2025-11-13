# 🔍 PROMPT DE VERIFICACIÓN SISTEMA FLOWDISTRIBUTOR - 100% COMPLETO

## 🎯 OBJETIVO
Verificar que el sistema FlowDistributor esté 100% funcional, sin errores, con todas las operaciones implementadas correctamente y con diseño elevado premium.

## 📋 CHECKLIST COMPLETO DE VERIFICACIÓN

### 1. ✅ FLUJO DE ÓRDENES DE COMPRA (OC)

**Verificar que:**
- [ ] Formulario de OC aparece con todos los campos necesarios
- [ ] Campo "Nombre del Distribuidor" funciona correctamente
- [ ] Campo "Cantidad" acepta números positivos
- [ ] Campo "Precio por unidad (USD)" calcula automáticamente total
- [ ] Campo "Concepto/Descripción" es opcional
- [ ] Botón "Generar OC" está habilitado cuando formulario es válido
- [ ] Al generar OC se crea automáticamente perfil de distribuidor
- [ ] Se genera automáticamente adeudo con el distribuidor
- [ ] OC se registra y visualiza en Panel Almacén
- [ ] Entrada se suma al stock actual en Panel Almacén
- [ ] Marcador histórico de entradas se actualiza correctamente
- [ ] Registro de entrada aparece con todos los datos: ID, fecha, distribuidor, cantidad

**Fórmulas a verificar:**
```
Adeudo Distribuidor = Cantidad × Precio por Unidad
Stock Actual = Stock Anterior + Cantidad (al generar OC)
Entradas Históricas += Cantidad (siempre acumulativo)
```

---

### 2. ✅ PANEL DISTRIBUIDORES Y GESTIÓN DE ADEUDOS

**Verificar que:**
- [ ] Panel Distribuidores muestra todos los perfiles creados
- [ ] Cada perfil muestra: Nombre, OC registradas, Adeudo pendiente
- [ ] Lista de OC por distribuidor está completa con todos los detalles
- [ ] Formulario "Abonar Adeudo" aparece correctamente
- [ ] Campo "Monto a Abonar" valida que no exceda el adeudo
- [ ] Selector "Pagar desde Banco" muestra los 6 bancos: Bóveda Monte, Utilidades, Fletes, Azteca, Leftie, Profit
- [ ] Botón "Saldar Por Completo" calcula automáticamente el total
- [ ] Al abonar, el adeudo se actualiza automáticamente
- [ ] El pago se registra como gasto en el banco seleccionado
- [ ] Capital del banco seleccionado se reduce correctamente
- [ ] El gasto aparece en tabla de gastos del banco
- [ ] Estado del distribuidor actualiza a "Saldado" cuando adeudo = 0

**Fórmulas a verificar:**
```
Adeudo Nuevo = Adeudo Actual - Monto Abonado
Capital Banco = Capital Anterior - Monto Abonado
Registro Gasto = { tipo: "Pago a Distribuidor", monto, distribuidor, fecha }
```

---

### 3. ✅ PANEL ALMACÉN - GESTIÓN COMPLETA

**Verificar que:**
- [ ] Panel tiene 4 secciones/tabs: Órdenes de Compra, Entradas, Salidas, Stock Actual
- [ ] Tab "Órdenes de Compra" muestra todas las OC generadas
- [ ] Tab "Entradas" muestra histórico acumulativo (nunca disminuye)
- [ ] Tab "Salidas" muestra todas las salidas (generadas por ventas)
- [ ] Tab "Stock Actual" muestra cantidad disponible en tiempo real
- [ ] Marcador "Total Entradas Históricas" siempre va en aumento
- [ ] Marcador "Stock Actual" varía según entradas y salidas
- [ ] Salida se genera automáticamente al registrar venta
- [ ] Stock Actual = Entradas - Salidas

**Tabla Entradas debe mostrar:**
- ID de OC
- Fecha
- Distribuidor
- Cantidad
- Estado (Completado)

**Tabla Salidas debe mostrar:**
- ID de Venta
- Fecha
- Cliente
- Cantidad
- Concepto

---

### 4. ✅ FLUJO DE VENTAS Y DISTRIBUCIÓN AUTOMÁTICA

**Verificar que:**
- [ ] Formulario de Venta aparece con todos los campos
- [ ] Campo "Nombre del Cliente" crea automáticamente perfil
- [ ] Campo "Cantidad de Productos" valida contra stock disponible
- [ ] Campo "Precio de Venta por Unidad (USD)" funciona correctamente
- [ ] Campo "Precio de Flete por Unidad" aparece fijo en $500 USD pero es editable
- [ ] Cálculo automático: Precio Total por Unidad = Precio Venta + Precio Flete
- [ ] Selector "Estado de Pago" con opciones: Pagado, Parcial, Pendiente
- [ ] Si selecciona "Parcial", aparece campo "Monto Abonado"
- [ ] Campo "Monto Abonado" valida que no exceda el total
- [ ] Botón "Generar Venta" habilitado cuando formulario válido

**Al generar venta, verificar que se crean AUTOMÁTICAMENTE:**
1. [ ] Perfil del cliente en Panel Clientes
2. [ ] Registro en Panel Bóveda Monte con distribución calculada
3. [ ] Registro en Panel Utilidades con utilidad calculada
4. [ ] Registro en Panel Fletes con monto de fletes
5. [ ] Stock en Almacén se reduce por la cantidad vendida
6. [ ] Salida se registra en Panel Almacén

**Fórmulas CRÍTICAS a verificar:**
```javascript
// Valores base
const cantidad = form.cantidad
const precioVentaUnidad = form.precioVenta
const precioFleteUnidad = form.precioFlete // Default: 500
const costoPorUnidad = [obtener de OC]

// Cálculos principales
const precioTotalPorUnidad = precioVentaUnidad + precioFleteUnidad
const totalVenta = cantidad × precioTotalPorUnidad
const costoTotal = cantidad × costoPorUnidad
const utilidadTotal = totalVenta - costoTotal

// Distribución a bancos
const montoBovedaMonte = totalVenta // TODA la venta va a Bóveda Monte
const montoFletes = cantidad × precioFleteUnidad
const montoUtilidades = utilidadTotal

// Stock
stockActual = stockAnterior - cantidad
```

---

### 5. ✅ PANEL CLIENTES Y GESTIÓN DE ADEUDOS

**Verificar que:**
- [ ] Panel Clientes muestra todos los perfiles creados
- [ ] Cada perfil muestra: Nombre, Ventas registradas, Adeudo pendiente
- [ ] Lista de ventas por cliente con todos los detalles
- [ ] Formulario "Abonar Adeudo" funciona correctamente
- [ ] Muestra estado de pago: Pagado, Parcial, Pendiente
- [ ] Si es "Parcial", muestra: Monto Pagado / Total y Restante
- [ ] Botón "Saldar Por Completo" calcula automáticamente
- [ ] Al saldar deuda, capital de bancos se actualiza
- [ ] Estado de pago de la venta se actualiza a "Pagado"

**Estados de venta a verificar:**
- **Pagado**: El cliente pagó el total completo al momento de la venta
- **Parcial**: El cliente abonó una parte, queda adeudo pendiente
- **Pendiente**: El cliente no pagó nada, todo es adeudo

**Actualización de capital de bancos al saldar deuda:**
```
Si estado era "Pendiente":
  - Capital Bóveda Monte += totalVenta
  - Capital Fletes += montoFletes
  - Capital Utilidades += montoUtilidades

Si estado era "Parcial":
  - Capital Bóveda Monte += totalVenta - montoAbonado
  - Capital Fletes += (montoFletes / totalVenta) × restante
  - Capital Utilidades += (montoUtilidades / totalVenta) × restante
```

---

### 6. ✅ PANEL BÓVEDA MONTE - BANCO PRINCIPAL

**Verificar que tiene 4 tablas:**
1. **Tabla Histórico (Fijo)**
   - [ ] Muestra TODAS las ventas registradas
   - [ ] Nunca se reduce, siempre acumulativo
   - [ ] Columnas: ID Venta, Fecha, Cliente, Cantidad, Monto Total, Estado Pago
   - [ ] Marcador "Total Histórico" siempre en aumento

2. **Tabla Capital (Variable)**
   - [ ] Muestra solo ventas con estado "Pagado" o parcialmente abonadas
   - [ ] Se actualiza cuando cliente paga
   - [ ] Marcador "Capital Actual" varía según pagos recibidos
   - [ ] Capital = Suma de pagos recibidos - Gastos - Transferencias

3. **Tabla Gastos**
   - [ ] Muestra todos los gastos registrados
   - [ ] Columnas: ID, Fecha, Concepto, Descripción, Monto
   - [ ] Formulario para registrar nuevo gasto
   - [ ] Al registrar gasto, capital se reduce

4. **Tabla Transferencias**
   - [ ] Muestra todas las transferencias enviadas y recibidas
   - [ ] Columnas: ID, Fecha, Origen, Destino, Monto, Concepto
   - [ ] Formulario para crear transferencia
   - [ ] Selector de banco destino (5 opciones: Utilidades, Fletes, Azteca, Leftie, Profit)
   - [ ] Al transferir, capital origen se reduce y capital destino aumenta

**Fórmulas Bóveda Monte:**
```
Histórico Total = Σ todas las ventas (totalVenta)
Capital Actual = Σ ventas pagadas - Σ gastos - Σ transferencias enviadas + Σ transferencias recibidas
```

---

### 7. ✅ PANEL UTILIDADES - REGISTRO DE MÁRGENES

**Verificar 4 tablas:**
1. **Histórico (Fijo)**: Todas las utilidades de ventas
2. **Capital (Variable)**: Utilidades de ventas pagadas
3. **Gastos**: Con formulario para registrar gastos
4. **Transferencias**: Enviadas y recibidas

**Fórmulas Utilidades:**
```
Utilidad por Venta = (Precio Venta + Precio Flete - Costo) × Cantidad
Histórico Total = Σ todas las utilidades
Capital Actual = Σ utilidades pagadas - Σ gastos - Σ transferencias salientes + Σ transferencias entrantes
```

---

### 8. ✅ PANEL FLETES - REGISTRO DE COSTOS DE ENVÍO

**Verificar 4 tablas:**
1. **Histórico (Fijo)**: Todos los fletes de ventas
2. **Capital (Variable)**: Fletes de ventas pagadas
3. **Gastos**: Con formulario para registrar gastos
4. **Transferencias**: Enviadas y recibidas

**Fórmulas Fletes:**
```
Flete por Venta = Precio Flete × Cantidad
Histórico Total = Σ todos los fletes
Capital Actual = Σ fletes pagados - Σ gastos - Σ transferencias salientes + Σ transferencias entrantes
```

---

### 9. ✅ PANELES AZTECA, LEFTIE Y PROFIT - BANCOS INDEPENDIENTES

**Para cada uno verificar:**
- [ ] Panel tiene 4 tablas: Ingresos, Capital, Gastos, Transferencias
- [ ] Formulario "Registrar Ingreso" funciona correctamente
- [ ] Al registrar ingreso, histórico y capital aumentan
- [ ] Formulario "Registrar Gasto" reduce solo el capital (no el histórico)
- [ ] Formulario "Transferencia" permite enviar/recibir a/de otros bancos
- [ ] Marcador "Histórico Total" = Σ ingresos (nunca disminuye)
- [ ] Marcador "Capital Actual" = Σ ingresos - Σ gastos - Σ transfers out + Σ transfers in

**Estos bancos NO reciben automáticamente de ventas**, solo mediante:
- Ingresos manuales
- Transferencias de otros bancos

---

### 10. ✅ OPERACIONES DE TRANSFERENCIAS ENTRE BANCOS

**Verificar que:**
- [ ] Formulario de transferencia aparece en cada panel de banco
- [ ] Selector "Banco Destino" muestra los otros 5 bancos
- [ ] Campo "Monto" valida que no exceda capital disponible
- [ ] Campos "Concepto" y "Descripción" son obligatorios
- [ ] Al transferir se registra en ambos bancos:
  - Origen: Como transferencia saliente (reduce capital)
  - Destino: Como transferencia entrante (aumenta capital)
- [ ] Transferencia aparece en tabla de ambos bancos con indicador claro

---

### 11. ✅ OPERACIONES DE GASTOS EN BANCOS

**Verificar que:**
- [ ] Formulario "Registrar Gasto" aparece en cada panel
- [ ] Campo "Monto" valida contra capital disponible
- [ ] Campos "Concepto" y "Descripción" obligatorios
- [ ] Al registrar gasto, solo capital se reduce (histórico NO cambia)
- [ ] Gasto aparece en tabla con todos los detalles
- [ ] Marcador "Total Gastos" se actualiza correctamente

---

### 12. ✅ ACTUALIZACIÓN AUTOMÁTICA Y TRAZABILIDAD

**Verificar que TODO se actualiza automáticamente sin recargar página:**
- [ ] Generar OC → Panel Almacén se actualiza
- [ ] Generar OC → Panel Distribuidores se actualiza
- [ ] Generar Venta → Panel Almacén stock se reduce
- [ ] Generar Venta → Panel Clientes se actualiza
- [ ] Generar Venta → Panel Bóveda Monte se actualiza
- [ ] Generar Venta → Panel Utilidades se actualiza
- [ ] Generar Venta → Panel Fletes se actualiza
- [ ] Pagar adeudo cliente → Capitales de bancos se actualizan
- [ ] Transferencia → Ambos bancos se actualizan
- [ ] Gasto → Capital del banco se actualiza

**Trazabilidad completa:**
- [ ] Cada operación tiene ID único
- [ ] Cada operación tiene fecha y hora
- [ ] Cada operación tiene concepto/descripción
- [ ] Se puede rastrear origen de cada monto en cualquier banco
- [ ] Histórico nunca se borra, siempre acumulativo

---

### 13. ✅ DISEÑO UI/UX PREMIUM

**Verificar inspiración de referencia Pinterest:**
- [ ] Animaciones suaves en transiciones de paneles (Framer Motion)
- [ ] Efectos de glassmorphism en tarjetas y modales
- [ ] Partículas cinematográficas en fondo (30-50 partículas)
- [ ] Microinteracciones en botones (hover, click, focus)
- [ ] Contador animado en marcadores (números crecen con animación)
- [ ] Gráficos interactivos con tooltips detallados
- [ ] Transiciones de tabs con fade + slide
- [ ] Loading states elegantes (skeleton screens)
- [ ] Toast notifications con animaciones
- [ ] Scroll progress bar en tablas largas
- [ ] Hover effects en filas de tablas
- [ ] Focus states accesibles en formularios
- [ ] Theme dark con acentos de color vibrantes
- [ ] Tipografía jerárquica clara (Tailwind font scales)
- [ ] Espaciado consistente (Tailwind spacing scale)
- [ ] Responsive design (móvil, tablet, desktop)

**Paleta de colores por banco:**
- Bóveda Monte: Gold/Amber (#f59e0b, #fbbf24)
- Bóveda USA: Blue/Indigo (#3b82f6, #4f46e5)
- Utilidades: Purple/Violet (#a855f7, #7c3aed)
- Fletes: Red/Rose (#ef4444, #f43f5e)
- Azteca: Green/Emerald (#22c55e, #10b981)
- Leftie: Teal/Cyan (#14b8a6, #06b6d4)
- Profit: Pink/Fuchsia (#ec4899, #d946ef)

---

### 14. ✅ VALIDACIONES Y MANEJO DE ERRORES

**Verificar que:**
- [ ] Formularios validan campos obligatorios
- [ ] Campos numéricos solo aceptan números positivos
- [ ] No se puede vender más de lo que hay en stock
- [ ] No se puede gastar más del capital disponible
- [ ] No se puede transferir más del capital disponible
- [ ] Fechas válidas y en formato correcto
- [ ] Mensajes de error claros y específicos
- [ ] Toast notifications en operaciones exitosas
- [ ] Confirmación antes de operaciones críticas
- [ ] Prevención de double-submit en formularios

---

### 15. ✅ RENDIMIENTO Y OPTIMIZACIÓN

**Verificar que:**
- [ ] Tablas con +100 registros usan virtualización
- [ ] Lazy loading en gráficos pesados
- [ ] Debounce en campos de búsqueda
- [ ] Optimistic updates en formularios
- [ ] React.memo en componentes que rerrenderizan frecuentemente
- [ ] useMemo y useCallback en cálculos complejos
- [ ] Code splitting por panel (React.lazy)
- [ ] Imágenes optimizadas con lazy loading
- [ ] Bundle size < 1MB después de build
- [ ] Build completa sin errores en < 10 segundos

---

## 🧪 PLAN DE TESTING

### Paso 1: Testing Manual de Flujos Principales
1. Crear 3 OC diferentes
2. Generar 5 ventas con estados diferentes (Pagado, Parcial, Pendiente)
3. Abonar deudas de 2 clientes
4. Registrar 2 gastos en diferentes bancos
5. Hacer 3 transferencias entre bancos diferentes
6. Verificar que todos los marcadores son correctos

### Paso 2: Testing de Fórmulas
1. Verificar manualmente cada cálculo con calculadora
2. Comparar resultados con Excel de referencia
3. Validar que sumas de marcadores coinciden

### Paso 3: Testing de UI/UX
1. Probar en Chrome, Firefox, Edge
2. Probar en móvil, tablet, desktop
3. Verificar todas las animaciones funcionan
4. Confirmar que todos los botones responden

### Paso 4: Testing de Performance
```bash
npm run build
# Verificar bundle size
npm run lighthouse
# Score > 90 en Performance
```

---

## 📝 REPORTE DE VERIFICACIÓN

Completar después del testing:

**Fecha de verificación:** _______________
**Verificado por:** _______________

**Resultados:**
- Funcionalidad: ___/15 módulos funcionando perfectamente
- Fórmulas: ___/10 cálculos correctos
- UI/UX: ___/16 características implementadas
- Performance: ___/10 optimizaciones aplicadas
- Sin errores en consola: [ ] Sí / [ ] No
- Build exitoso: [ ] Sí / [ ] No

**Errores encontrados:**
1. _______________
2. _______________
3. _______________

**Estado final:** [ ] APROBADO / [ ] REQUIERE CORRECCIONES

---

## 🚀 COMANDOS DE VERIFICACIÓN

```bash
# Verificar sin errores TypeScript
npx tsc --noEmit

# Build de producción
npm run build

# Ejecutar tests
npm run test

# Verificar lint
npm run lint

# Análisis de bundle
npm run analyze

# Lighthouse audit
npx lighthouse http://localhost:5173 --view
```

---

## ✅ CRITERIOS DE ÉXITO

El sistema se considera **100% completo y funcional** cuando:
- ✅ Todos los checkboxes están marcados
- ✅ Todas las fórmulas calculan correctamente
- ✅ No hay errores en consola del navegador
- ✅ Build completa exitosamente sin warnings críticos
- ✅ UI/UX cumple con diseño de referencia
- ✅ Performance score > 90 en Lighthouse
- ✅ Responsive en todos los dispositivos
- ✅ Accesibilidad WCAG AA cumplida

---

**Firma de aprobación final:** _______________
**Fecha:** _______________
