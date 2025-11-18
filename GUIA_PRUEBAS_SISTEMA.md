# 🧪 GUÍA DE PRUEBAS DEL SISTEMA

## 📋 CHECKLIST COMPLETO DE PRUEBAS

### ✅ Preparación (Antes de Empezar)

- [ ] **Verificar que tienes los 601 documentos en Firestore**
  ```bash
  node scripts/check-firestore-counts.js
  ```
  Resultado esperado:
  - 31 clientes
  - 2 distribuidores
  - 9 ordenesCompra
  - 72 ventas
  - 1 capital
  - 96 gastosAbonos
  - 9 inventario
  - 300 transaccionesBoveda
  - 81 transaccionesBanco

- [ ] **Verificar balance correcto**
  Balance esperado: **$12,861,332.12**

- [ ] **Abrir DevTools en navegador** (F12)
  - Pestaña Console para ver logs
  - Pestaña Network para ver requests
  - Pestaña Application > Firestore para ver datos en tiempo real

---

## 🎯 PRUEBA 1: DASHBOARD INTELIGENTE

### Objetivo:
Verificar que las predicciones ML/IA funcionan correctamente y muestran datos coherentes.

### Pasos:

1. **Abrir Dashboard** (Ctrl + D)
   - [ ] Dashboard se carga sin errores
   - [ ] Todos los KPIs son visibles

2. **Verificar KPIs**:
   - [ ] **Ventas Esta Semana**: Muestra número y tendencia (%)
   - [ ] **Margen Promedio**: Muestra porcentaje
   - [ ] **Adeudos Totales**: Muestra monto total
   - [ ] **Ingresos Predichos (7 días)**: Muestra predicción

3. **Verificar Alertas Automáticas**:
   - [ ] Se muestran alertas (si aplica)
   - [ ] Alertas tienen colores correctos:
     * 🔴 Rojo: Riesgo alto
     * 🟡 Amarillo: Riesgo medio
     * 🔵 Azul: Información
   - [ ] Click en "Ver Detalles" funciona
   - [ ] Click en "Acción" funciona

4. **Verificar Recomendaciones IA**:
   - [ ] Se muestran 2-3 recomendaciones
   - [ ] Recomendaciones son relevantes
   - [ ] Botones de acción funcionan

5. **Verificar Clientes Próximos a Comprar**:
   - [ ] Muestra lista de clientes
   - [ ] Muestra probabilidad de compra (%)
   - [ ] Muestra días desde última compra
   - [ ] Botón "Contactar" funciona

### Validaciones Manuales:
```javascript
// En Console de DevTools:
// 1. Verificar cálculo de ingresos predichos
const ventasRecientes = ventas.filter(v => {
  const fecha = new Date(v.fecha)
  const hace30Dias = new Date(Date.now() - 30*24*60*60*1000)
  return fecha >= hace30Dias
})
const promedioVentasDiarias = ventasRecientes.length / 30
const promedioMonto = ventasRecientes.reduce((sum, v) => sum + v.total, 0) / ventasRecientes.length
const prediccion7Dias = promedioVentasDiarias * 7 * promedioMonto
console.log('Predicción esperada:', prediccion7Dias)

// 2. Verificar margen promedio
const margen = ventas.reduce((sum, v) => sum + (v.utilidad || 0), 0) /
               ventas.reduce((sum, v) => sum + v.total, 0) * 100
console.log('Margen promedio:', margen.toFixed(2) + '%')
```

### Resultado Esperado:
✅ Dashboard muestra datos en tiempo real
✅ Predicciones ML son coherentes con histórico
✅ Alertas se disparan correctamente
✅ Recomendaciones son relevantes

---

## 🛒 PRUEBA 2: FORMULARIO DE VENTAS OPTIMIZADO

### Objetivo:
Verificar que el formulario de ventas tiene todas las optimizaciones y validaciones funcionando.

### Pasos:

1. **Abrir Panel de Ventas** (Ctrl + V)
   - [ ] Panel se abre correctamente
   - [ ] Click en "Nueva Venta" abre el formulario optimizado

2. **Probar Autocompletado de Cliente**:
   - [ ] Escribir "Ax" en campo de cliente
   - [ ] Debe aparecer dropdown con sugerencias
   - [ ] Click en sugerencia autocompleta el campo
   - [ ] Campo muestra checkmark verde ✅

3. **Verificar Alerta de Riesgo Crediticio**:
   - [ ] Si cliente tiene adeudo > $50,000:
     * ⚠️ Aparece alerta amarilla/roja
     * Muestra monto del adeudo
   - [ ] Si cliente tiene buen crédito:
     * ✅ Sin alertas

4. **Agregar Productos con Autocompletado**:
   - [ ] Click en "➕ Agregar Producto"
   - [ ] Escribir nombre de producto (ej: "Celular")
   - [ ] Aparecen sugerencias de OCs disponibles
   - [ ] Click en sugerencia autocompleta:
     * Nombre del producto
     * Costo unitario
     * Stock disponible
   - [ ] **Verificar precio sugerido ML**:
     * Aparece precio basado en ventas previas del producto
     * Se puede editar manualmente

5. **Verificar Cálculos Automáticos**:
   - [ ] Cambiar cantidad → Actualiza totales
   - [ ] Cambiar precio → Actualiza utilidad y margen
   - [ ] **Utilidad por producto** se muestra en verde
   - [ ] **Panel Resumen** se actualiza en tiempo real:
     * Subtotal
     * Costos
     * Flete (default $500)
     * Utilidad Neta
     * Margen %

6. **Probar Validación de Margen Bajo**:
   - [ ] Ajustar precio para que margen < 15%
   - [ ] Debe aparecer alerta amarilla: ⚠️ "Margen bajo"
   - [ ] Sugerencia de aumentar precio

7. **Probar Validación de Stock**:
   - [ ] Intentar vender cantidad mayor al stock
   - [ ] Debe mostrar error: ❌ "Stock insuficiente"
   - [ ] Botón Guardar deshabilitado

8. **Seleccionar Estado de Pago**:
   - [ ] Probar cada opción:
     * 🟢 PAGADA: montoAbonado = total, adeudo = 0
     * 🟡 PARCIAL: montoAbonado < total, adeudo > 0
     * 🔴 CREDITO: montoAbonado = 0, adeudo = total

9. **Guardar Venta** (Ctrl + S):
   - [ ] Formulario valida todos los campos
   - [ ] Muestra loading spinner
   - [ ] Toast de éxito: "✅ Venta creada exitosamente"
   - [ ] Venta aparece en la lista
   - [ ] Se cierra el formulario

10. **Verificar en Firestore**:
    - [ ] Abrir DevTools > Application > Firestore > ventas
    - [ ] Nueva venta está guardada con:
      * clienteNombre correcto
      * productos array completo
      * total calculado correctamente
      * utilidad calculada correctamente
      * estadoPago correcto
      * montoAbonado y adeudo correctos

### Validaciones Manuales:
```javascript
// Calcular manualmente utilidad esperada:
const productos = [
  { nombre: 'Celular', cantidad: 5, precioVenta: 3000, costo: 2000 }
]
const subtotal = 5 * 3000 // 15,000
const costos = 5 * 2000 // 10,000
const flete = 500
const utilidadEsperada = subtotal - costos - flete // 4,500
const margenEsperado = (4500 / 15000) * 100 // 30%

console.log('Utilidad esperada:', utilidadEsperada)
console.log('Margen esperado:', margenEsperado + '%')

// Comparar con valores mostrados en el formulario
```

### Resultado Esperado:
✅ Autocompletado funciona instantáneamente
✅ Predicciones ML son precisas
✅ Validaciones previenen errores
✅ Cálculos son exactos
✅ Datos se guardan correctamente en Firestore

---

## 💰 PRUEBA 3: FORMULARIO DE ABONOS OPTIMIZADO

### Objetivo:
Verificar que el registro de abonos y la distribución automática funcionan correctamente.

### Pasos:

1. **Abrir Panel de Abonos** (Ctrl + A)
   - [ ] Panel se abre correctamente
   - [ ] Click en "Registrar Abono" abre formulario optimizado

2. **Ver Lista de Ventas Pendientes**:
   - [ ] Aparece lista de ventas con estado CREDITO o PARCIAL
   - [ ] Cada tarjeta muestra:
     * Nombre del cliente
     * Fecha de venta
     * Total de la venta
     * Adeudo pendiente
     * Barra de progreso visual
   - [ ] Tarjetas ordenadas por fecha (más recientes primero)

3. **Buscar Venta Específica**:
   - [ ] Escribir nombre de cliente en búsqueda
   - [ ] Lista se filtra en tiempo real
   - [ ] Escribir ID de venta
   - [ ] Muestra solo esa venta

4. **Seleccionar Venta**:
   - [ ] Click en una tarjeta
   - [ ] Tarjeta se marca con borde azul ✓
   - [ ] Se muestran detalles de la venta:
     * Cliente
     * Fecha
     * Total original
     * Saldo pendiente actual

5. **Ingresar Monto de Abono**:
   - [ ] Escribir monto manualmente
   - [ ] **Panel de Distribución** se actualiza automáticamente:
     * Bóveda Monte (% costo)
     * Flete Sur (% flete)
     * Utilidades (% utilidad)
   - [ ] Suma de distribución = monto ingresado

6. **Probar Botones Rápidos**:
   - [ ] Click en "50%":
     * Campo monto = saldoPendiente / 2
     * Distribución se actualiza
   - [ ] Click en "100% (Pagar Todo)":
     * Campo monto = saldoPendiente
     * Nuevo estado = "PAGADA"
     * Barra de progreso llega a 100%

7. **Verificar Cálculos Automáticos**:
   - [ ] **Porcentaje de Pago** se actualiza: (monto / total) × 100
   - [ ] **Nuevo Saldo** se calcula: adeudo actual - monto
   - [ ] **Nuevo Estado** se determina:
     * Si nuevo saldo = 0 → "PAGADA" 🟢
     * Si nuevo saldo > 0 → "PARCIAL" 🟡
     * Si nuevo saldo = total → "PENDIENTE" 🔴

8. **Validar Monto Máximo**:
   - [ ] Intentar ingresar monto > saldo pendiente
   - [ ] Debe mostrar error: ❌ "El monto no puede exceder el saldo pendiente"
   - [ ] Botón Guardar deshabilitado

9. **Seleccionar Banco Destino**:
   - [ ] Seleccionar "Bóveda Monte"
   - [ ] Seleccionar "Banco Azteca"
   - [ ] Campo marcado con checkmark ✅

10. **Guardar Abono** (Ctrl + S):
    - [ ] Formulario valida todos los campos
    - [ ] Muestra loading spinner
    - [ ] Toast de éxito: "✅ Abono registrado exitosamente"
    - [ ] Venta desaparece de pendientes (si se pagó 100%)
    - [ ] Venta actualiza barra de progreso (si parcial)

11. **Verificar Actualización en Firestore**:
    - [ ] **Colección: ventas**
      * montoAbonado aumentó
      * adeudo disminuyó
      * estadoPago actualizado
    - [ ] **Colección: gastosAbonos**
      * Nuevo documento de abono creado
      * tipo: "abono"
      * monto correcto
    - [ ] **Colección: transaccionesBanco**
      * Nueva transacción creada
      * tipo: "ingreso"
      * monto correcto
      * banco correcto
    - [ ] **Paneles actualizados**:
      * bovedaMonte.capitalActual aumentó (proporción)
      * fleteSur.capitalActual aumentó (proporción)
      * utilidades.capitalActual aumentó (proporción)

### Validaciones Manuales:
```javascript
// Ejemplo: Venta de $15,000 con:
// - Costo: $10,000 (66.67%)
// - Flete: $500 (3.33%)
// - Utilidad: $4,500 (30%)

// Si se paga abono de $6,000:
const abono = 6000
const total = 15000
const distribucion = {
  bovedaMonte: 6000 * (10000/15000), // $4,000
  fleteSur: 6000 * (500/15000),     // $200
  utilidades: 6000 * (4500/15000)   // $1,800
}

console.log('Distribución esperada:')
console.log('Bóveda Monte:', distribucion.bovedaMonte)
console.log('Flete Sur:', distribucion.fleteSur)
console.log('Utilidades:', distribucion.utilidades)
console.log('Total:', Object.values(distribucion).reduce((a,b) => a+b, 0)) // Debe ser 6000

// Verificar que coincide con lo mostrado en el formulario
```

### Resultado Esperado:
✅ Lista de ventas pendientes correcta
✅ Búsqueda funciona instantáneamente
✅ Distribución automática es proporcional
✅ Cálculos de estado son precisos
✅ Todas las transacciones se registran en Firestore

---

## 🔄 PRUEBA 4: FLUJO COMPLETO END-TO-END

### Objetivo:
Probar un flujo completo desde crear OC → Venta → Abono → Verificar balance

### Escenario de Prueba:

**PASO 1: Crear Orden de Compra**
- [ ] Ir a Panel de OCs
- [ ] Crear nueva OC:
  * Distribuidor: "Distribuidora Monte"
  * Producto: "Celular Samsung A54"
  * Cantidad: 10 unidades
  * Costo unitario: $3,000
  * Total OC: $30,000
- [ ] Verificar que se actualizó:
  * bovedaMonte.capitalActual disminuyó $30,000
  * inventario tiene 10 unidades disponibles

**PASO 2: Crear Venta**
- [ ] Ir a Panel de Ventas (Ctrl + V)
- [ ] Nueva Venta:
  * Cliente: "Ax" (autocompletar)
  * Producto: "Celular Samsung A54"
  * Cantidad: 3 unidades
  * Precio venta: $5,000/u (ML sugiere precio)
  * Flete: $500
  * Estado: CREDITO (pago después)
- [ ] Verificar cálculos:
  * Subtotal: 3 × $5,000 = $15,000
  * Costo: 3 × $3,000 = $9,000
  * Utilidad: $15,000 - $9,000 - $500 = $5,500
  * Margen: ($5,500 / $15,000) × 100 = 36.67% ✅
- [ ] Guardar venta
- [ ] Verificar en Firestore:
  * ventas: Nueva venta con adeudo = $15,000
  * inventario: Stock bajó de 10 a 7 unidades

**PASO 3: Registrar Abono Parcial**
- [ ] Ir a Panel de Abonos (Ctrl + A)
- [ ] Registrar abono:
  * Venta: Buscar "Ax"
  * Monto: $7,500 (click en "50%")
  * Banco: Bóveda Monte
- [ ] Verificar distribución automática:
  * Bóveda Monte: $7,500 × (9000/15000) = $4,500
  * Flete Sur: $7,500 × (500/15000) = $250
  * Utilidades: $7,500 × (5500/15000) = $2,750
- [ ] Guardar abono
- [ ] Verificar actualizaciones:
  * ventas: montoAbonado = $7,500, adeudo = $7,500, estado = PARCIAL
  * gastosAbonos: Nuevo documento de abono
  * bovedaMonte: capitalActual aumentó $4,500
  * fleteSur: capitalActual aumentó $250
  * utilidades: capitalActual aumentó $2,750

**PASO 4: Liquidar Venta**
- [ ] Registrar segundo abono:
  * Venta: Misma venta (Ax)
  * Monto: $7,500 (click en "100%")
  * Banco: Banco Azteca
- [ ] Verificar:
  * Nuevo estado = PAGADA ✅
  * Barra de progreso = 100%
  * Venta desaparece de lista de pendientes

**PASO 5: Verificar Balance Final**
- [ ] Ir a Dashboard (Ctrl + D)
- [ ] Verificar KPIs actualizados:
  * Ventas esta semana aumentó +1
  * Adeudos totales disminuyó $15,000
  * Margen promedio se recalculó
- [ ] Verificar paneles:
  * Bóveda Monte: -$30,000 (OC) + $9,000 (abonos) = -$21,000 neto
  * Flete Sur: +$500
  * Utilidades: +$5,500

### Validación Final Balance:
```javascript
// Balance Esperado:
const balanceInicial = 12861332.12

// Movimientos:
const oc = -30000           // Gasto en OC
const recuperadoCosto = 9000    // Recuperado en abonos
const gananciaFlete = 500       // Ingreso flete
const gananciaUtil = 5500       // Ingreso utilidad

const balanceFinal = balanceInicial + oc + recuperadoCosto + gananciaFlete + gananciaUtil
// = 12861332.12 - 30000 + 9000 + 500 + 5500
// = 12846332.12

console.log('Balance final esperado:', balanceFinal)
// Verificar que coincide con el mostrado en Dashboard
```

### Resultado Esperado:
✅ Flujo completo funciona sin errores
✅ Todos los cálculos son precisos
✅ Firestore se actualiza correctamente
✅ Balance final es correcto

---

## ⚙️ PRUEBA 5: VALIDACIONES Y MANEJO DE ERRORES

### Objetivo:
Verificar que el sistema previene errores y muestra mensajes apropiados.

### Casos de Prueba:

1. **Venta sin Cliente**:
   - [ ] Intentar guardar venta sin seleccionar cliente
   - [ ] Debe mostrar: ❌ "Selecciona un cliente"
   - [ ] Botón Guardar deshabilitado

2. **Venta sin Productos**:
   - [ ] Intentar guardar venta sin productos
   - [ ] Debe mostrar: ❌ "Agrega al menos un producto"
   - [ ] Botón Guardar deshabilitado

3. **Stock Insuficiente**:
   - [ ] Intentar vender 100 unidades cuando solo hay 7
   - [ ] Debe mostrar: ❌ "Stock insuficiente. Disponible: 7"
   - [ ] Botón Guardar deshabilitado

4. **Cliente con Alto Riesgo Crediticio**:
   - [ ] Seleccionar cliente con adeudo > $100,000
   - [ ] Debe mostrar: ⚠️ "Cliente con riesgo crediticio alto"
   - [ ] Puede guardar pero con advertencia visible

5. **Margen Muy Bajo**:
   - [ ] Configurar venta con margen < 10%
   - [ ] Debe mostrar: ⚠️ "Margen muy bajo (8%). Recomendado: 20%+"
   - [ ] Puede guardar pero con advertencia visible

6. **Abono Mayor al Adeudo**:
   - [ ] Intentar abonar $20,000 a una venta con adeudo de $10,000
   - [ ] Debe mostrar: ❌ "El monto no puede exceder $10,000"
   - [ ] Botón Guardar deshabilitado

7. **Error de Red (Simular)**:
   - [ ] Desconectar internet
   - [ ] Intentar guardar venta
   - [ ] Debe mostrar: ❌ "Error de conexión. Verifica tu internet."
   - [ ] Reconectar y reintentar

### Resultado Esperado:
✅ Todas las validaciones funcionan
✅ Mensajes de error son claros
✅ Sistema previene guardar datos incorrectos
✅ Manejo de errores de red apropiado

---

## 📱 PRUEBA 6: UX Y SHORTCUTS

### Objetivo:
Verificar que la experiencia de usuario es fluida e intuitiva.

### Pasos:

1. **Probar Shortcuts de Navegación**:
   - [ ] Ctrl + D → Abre Dashboard
   - [ ] Ctrl + V → Abre Panel Ventas
   - [ ] Ctrl + A → Abre Panel Abonos
   - [ ] Ctrl + C → Abre Panel Clientes
   - [ ] Escape → Cierra modal/formulario

2. **Probar Shortcuts de Formulario**:
   - [ ] Abrir formulario de venta
   - [ ] Llenar campos
   - [ ] Ctrl + S → Guarda formulario
   - [ ] Sin usar mouse ✓

3. **Verificar Animaciones**:
   - [ ] Modales aparecen con fade + slide
   - [ ] Hover en tarjetas tiene efecto de elevación
   - [ ] Transiciones suaves entre paneles
   - [ ] Loading spinners animados

4. **Probar Autocompletado**:
   - [ ] Escribir en cualquier campo con autocomplete
   - [ ] Sugerencias aparecen < 200ms
   - [ ] Navegación con teclado (↑ ↓ Enter)
   - [ ] Click con mouse también funciona

5. **Verificar Feedback Visual**:
   - [ ] Campos validados muestran ✅ verde
   - [ ] Errores muestran ❌ rojo
   - [ ] Advertencias muestran ⚠️ amarillo
   - [ ] Loading muestra spinner
   - [ ] Éxito muestra toast verde con ✅

6. **Probar Responsividad** (opcional):
   - [ ] Resize ventana del navegador
   - [ ] Layout se adapta correctamente
   - [ ] Todos los botones accesibles
   - [ ] No hay overflow horizontal

7. **Probar en Diferentes Navegadores**:
   - [ ] Chrome
   - [ ] Firefox
   - [ ] Edge
   - [ ] Safari (si Mac disponible)

### Resultado Esperado:
✅ Shortcuts funcionan en todos los contextos
✅ Animaciones son suaves (60fps)
✅ Autocompletado es instantáneo
✅ Feedback visual es claro
✅ Funciona en todos los navegadores

---

## 🔍 CHECKLIST FINAL

### Sistema General:
- [ ] ✅ 601 documentos en Firestore verificados
- [ ] ✅ Balance correcto: $12,861,332.12
- [ ] ✅ Lógica de negocio correcta (Bóveda = costo, Utilidad = precio-costo-flete)
- [ ] ✅ Sin errores en Console de DevTools

### Dashboard Inteligente:
- [ ] ✅ KPIs se actualizan en tiempo real
- [ ] ✅ Predicciones ML son coherentes
- [ ] ✅ Alertas se disparan correctamente
- [ ] ✅ Recomendaciones son relevantes
- [ ] ✅ Clientes próximos a comprar listados

### Formulario de Ventas:
- [ ] ✅ Autocompletado funciona
- [ ] ✅ Predicciones ML precisas
- [ ] ✅ Cálculos automáticos correctos
- [ ] ✅ Validaciones previenen errores
- [ ] ✅ Datos se guardan correctamente

### Formulario de Abonos:
- [ ] ✅ Lista de pendientes correcta
- [ ] ✅ Distribución proporcional exacta
- [ ] ✅ Cálculos de estado precisos
- [ ] ✅ Todas las transacciones registradas
- [ ] ✅ Paneles se actualizan correctamente

### UX y Shortcuts:
- [ ] ✅ Shortcuts funcionan
- [ ] ✅ Animaciones fluidas
- [ ] ✅ Feedback visual claro
- [ ] ✅ Autocompletado instantáneo
- [ ] ✅ Responsivo en diferentes resoluciones

---

## 🎉 RESULTADO FINAL

### Si Todas las Pruebas Pasan:
✅ **SISTEMA 100% FUNCIONAL Y LISTO PARA PRODUCCIÓN**

### Siguiente Paso:
```bash
# 1. Build de producción
npm run build

# 2. Deploy a Firebase
npm run deploy

# 3. Abrir URL de producción
# 4. Repetir pruebas críticas en producción
# 5. Monitorear logs en Firebase Console
```

---

## 🐛 SI ENCUENTRAS ERRORES

### Reportar con:
1. **Descripción del error**: ¿Qué esperabas vs qué pasó?
2. **Pasos para reproducir**: ¿Cómo llegaste al error?
3. **Screenshots**: Captura de pantalla del error
4. **Console logs**: Copiar errores de DevTools Console
5. **Datos de prueba**: ¿Qué datos usaste?

### Formato:
```markdown
## Error: [Título del error]

**Esperado**: [Comportamiento esperado]
**Actual**: [Comportamiento actual]

**Pasos**:
1. ...
2. ...
3. ...

**Console**:
```
[logs aquí]
```

**Screenshot**: [adjuntar]
```

---

**Guía creada**: 24 de Octubre 2025
**Versión**: 1.0
**Componentes**: VentaFormOptimizado, AbonoFormOptimizado, DashboardInteligente
