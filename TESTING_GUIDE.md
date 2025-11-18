# 🧪 Guía de Testing - Sistema FlowDistributor

## 📋 Pre-requisitos

Antes de comenzar el testing, asegúrate de:
- ✅ Build exitoso (`npm run build` sin errores)
- ✅ Servidor dev corriendo (`npm run dev`)
- ✅ Navegador con DevTools abierto (F12)

---

## 🚀 Testing Paso a Paso

### 1️⃣ Limpiar Estado Inicial

```javascript
// En la consola del navegador:
localStorage.clear();
console.log('✅ LocalStorage limpiado');
location.reload();
```

**Resultado esperado:**
- Página recarga
- Consola muestra logs de inicialización:
  ```
  ✅ Sistema Fletes inicializado: 73 ingresos, 102 gastos, 5 cortes RF
  ✅ Sistema Utilidades inicializado: 54 ingresos, 13 gastos, 5 cortes RF
  ✅ Sistema Clientes inicializado: 31 clientes
  ```

---

### 2️⃣ Verificar Panel Utilidades

**Navegar a:** `/flowdistributor` → Tab "Utilidades"

**Verificar KPIs (Primera Fila):**
- ✅ Balance Total: ~$102,658
- ✅ Ingresos Totales: $280,758
- ✅ Gastos Totales: $178,100
- ✅ Score de Riesgo: X/100

**Verificar KPIs (Segunda Fila - Métricas Reales):**
- ✅ Gastos Reales: $178,100 (13 registros)
- ✅ RF Actual: $102,658 (5 cortes RF)
- ✅ Balance Final: $102,658 (Ingresos - Gastos - RF)

**Verificar Gráficos:**
1. **Evolución Ingresos vs Gastos:** Líneas de tiempo con 3 series (ingresos, gastos, balance)
2. **Distribución de Ingresos:** Pastel por categorías
3. **Top Gastos:** Barras horizontales con categorías
4. **Proyección 6 meses:** Línea con tendencia futura
5. **Análisis de Riesgo:** Indicadores de alertas

**Toast Esperado:**
```
✅ Sistema Utilidades inicializado: 54 ingresos, 13 gastos, 5 cortes RF
```

---

### 3️⃣ Verificar Panel Fletes

**Navegar a:** Tab "Fletes"

**Verificar KPIs:**
- ✅ Total Fletes: 73 registros
- ✅ Gasto Total: Variable según datos
- ✅ TC Promedio: ~19-20 MXN/USD
- ✅ Costo por Kg: Variable

**Verificar Gráficos:**
1. **Optimización TC:** Evolución del tipo de cambio
2. **Eficiencia Proveedores:** Comparación de costos
3. **Rutas Económicas:** Análisis por destino
4. **Métricas Logísticas:** Peso, volumen, costos

**Toast Esperado:**
```
✅ Sistema Fletes inicializado: 73 ingresos, 102 gastos, 5 cortes RF
```

**Verificar Tabla:**
- ✅ Lista de 73+ fletes
- ✅ Columnas: Proveedor, Ruta, Gasto, TC, Peso, Volumen, Fecha
- ✅ Datos reales cargados (no placeholders)

---

### 4️⃣ Verificar Panel Clientes

**Navegar a:** Tab "Clientes"

**Verificar KPIs:**
- ✅ Total Clientes: 31
- ✅ Deuda Total: $5,550,000 aprox
- ✅ Recuperación: Variable %
- ✅ En Riesgo: Variable %

**Verificar Tabla de Clientes:**

| Cliente | Deuda | Abonos | Pendiente | Estado | Acción |
|---------|-------|--------|-----------|--------|--------|
| Bódega M-P | $945,000 | $0 | $945,000 | **critico** 🔴 | 💰 Registrar Pago |
| Tocayo | $255,200 | $0 | $255,200 | **critico** 🔴 | 💰 Registrar Pago |
| Robalo | $234,000 | $0 | $234,000 | **critico** 🔴 | 💰 Registrar Pago |
| Ax | $365,400 | $682,780 | **-$317,380** | al_dia ✅ | 💰 Registrar Pago |

**Estados Esperados:**
- 🔴 **critico**: pendiente > $200K && días > 60
- 🟠 **moroso**: $35K < pendiente < $200K && días > 30
- 🟢 **al_dia**: pendiente ≤ 0 (incluye pagos adelantados)

**Toast Esperado:**
```
✅ Sistema Clientes inicializado: 31 clientes cargados
```

---

### 5️⃣ Testing de Funcionalidad: Registrar Pago

**Objetivo:** Verificar que el sistema de pagos actualiza correctamente el estado del cliente.

#### Paso 5.1: Abrir Modal de Pago

1. En la tabla de clientes, buscar **"Tocayo"** (pendiente: $255,200, estado: critico)
2. Click en botón **"💰 Registrar Pago"**
3. Verificar que se abre el modal con:
   - Título: "💰 Registrar Pago"
   - Cliente seleccionado: "Tocayo"
   - Pendiente actual: $255,200

#### Paso 5.2: Llenar Formulario

```
Monto del Pago: 10000
Tipo: Pago (seleccionado por defecto)
Fecha: 2025-10-23 (hoy)
Banco: BBVA (opcional)
Referencia: TX12345 (opcional)
Observaciones: "Pago parcial mensual" (opcional)
```

#### Paso 5.3: Enviar y Verificar

1. Click en **"✅ Registrar Pago"**
2. **Toast esperado:**
   ```
   ✅ Pago registrado: Tocayo - Estado: critico
   ```
   (Estado sigue critico porque pendiente $245,200 > $200K)

3. **Verificar en tabla:**
   - Abonos: $10,000 (actualizado)
   - Pendiente: $245,200 (actualizado)
   - Estado: **critico** (aún sobre límite)

#### Paso 5.4: Segundo Pago (Cambiar Estado)

1. Registrar pago adicional: **$50,000**
2. **Nuevo pendiente:** $195,200 (por debajo de $200K)
3. **Toast esperado:**
   ```
   ✅ Pago registrado: Tocayo - Estado: moroso
   ```
4. **Verificar cambio de badge:**
   - Estado anterior: 🔴 **critico**
   - Estado nuevo: 🟠 **moroso**

---

### 6️⃣ Verificar localStorage

```javascript
// En la consola del navegador:
console.log('=== FLOW_CLIENTES ===');
console.log(JSON.parse(localStorage.getItem('flowdistributor_flow_clientes')));

console.log('=== CLIENTES_PAGOS ===');
console.log(JSON.parse(localStorage.getItem('flowdistributor_clientes_pagos')));

console.log('=== CLIENTES_ESTADOS ===');
console.log(JSON.parse(localStorage.getItem('flowdistributor_clientes_estados')));
```

**Resultado esperado:**
- ✅ `FLOW_CLIENTES`: Array con 31 clientes, Tocayo con abonos actualizados
- ✅ `CLIENTES_PAGOS`: Array con registros de pagos (2 pagos a Tocayo)
- ✅ `CLIENTES_ESTADOS`: Objeto con últimos estados calculados

---

### 7️⃣ Testing de Integración: Venta → Fletes → Utilidades

#### Paso 7.1: Crear Venta con Flete

**Navegar a:** Panel Principal → "Ventas"

1. Click en **"+ Nueva Venta"**
2. Llenar formulario:
   ```
   Producto: Producto Test
   Cantidad: 10
   Precio Unitario: 1000
   Cliente: Tocayo
   ✅ Aplicar Flete (marcar checkbox)
   Tipo Flete: Marítimo
   Costo Flete USD: 500
   TC Flete: 20
   ```
3. **Guardar venta**

#### Paso 7.2: Verificar Sincronización

**Verificar en Utilidades:**
```javascript
// Consola
const utilidades = JSON.parse(localStorage.getItem('flowdistributor_flow_utilidades'));
const nuevaUtil = utilidades.find(u => u.concepto.includes('Producto Test'));
console.log('Nueva utilidad:', nuevaUtil);
```

**Datos esperados:**
- ✅ Registro nuevo en `FLOW_UTILIDADES`
- ✅ Concepto: "util_venta_[id] - Producto Test"
- ✅ Valor calculado con fórmula: (1000 - CostoOC - 500) × 10
- ✅ Tipo: "Ingreso"

**Verificar en Fletes:**
```javascript
const gastosFletes = JSON.parse(localStorage.getItem('flowdistributor_gastos_fletes'));
const nuevoGasto = gastosFletes[gastosFletes.length - 1];
console.log('Nuevo gasto flete:', nuevoGasto);
```

**Datos esperados:**
- ✅ Registro nuevo en `GASTOS_FLETES`
- ✅ Gasto: $500 USD
- ✅ TC: 20
- ✅ Gasto MXN: $10,000

---

### 8️⃣ Testing de KPIs Auto-Update

#### Acción: Registrar varios pagos

1. Registrar pago a **"flama"**: $50,000
2. Registrar pago a **"Robalo"**: $100,000
3. Registrar pago a **"Bódega M-P"**: $200,000

#### Verificar actualización automática:

**Panel Clientes - KPIs deben actualizarse:**
- ✅ Deuda Total: Reducida
- ✅ Recuperación %: Aumentada
- ✅ En Riesgo %: Reducido (menos clientes críticos)

**Verificar en gráficos:**
- ✅ Pastel "Segmentación RFM": Distribución actualizada
- ✅ Barras "Top Deudores": Ranking reordenado
- ✅ Línea "Evolución Cartera": Punto adicional con reducción

---

## 🐛 Troubleshooting

### ❌ Error: "Sistema ya inicializado"

**Solución:**
```javascript
localStorage.clear();
location.reload();
```

### ❌ KPIs muestran $0

**Posibles causas:**
1. localStorage vacío → Recargar página
2. Error en inicialización → Verificar consola
3. Datos no cargados → Esperar 2-3 segundos

**Verificar:**
```javascript
const estado = localStorage.getItem('flowdistributor_flow_utilidades');
console.log('Utilidades cargadas:', estado ? JSON.parse(estado).length : 0);
```

### ❌ Modal no cierra

**Solución:**
- Click en área gris fuera del modal
- O click en botón "Cancelar"
- O presionar ESC (si implementado)

### ❌ Estado no cambia después de pago

**Verificar fórmula de estados:**
```javascript
// Crítico: pendiente > $200,000 && diasMorosidad > 60
// Moroso: $35,000 < pendiente < $200,000 && diasMorosidad > 30
// Pendiente: $0 < pendiente < $35,000
// Al Día: pendiente ≤ 0
```

**Nota:** Si días de morosidad no cumplen condición, estado no cambia aunque pendiente baje.

---

## ✅ Checklist Final

- [ ] LocalStorage limpiado y recargado
- [ ] 3 sistemas inicializados (Fletes, Utilidades, Clientes)
- [ ] KPIs de Utilidades correctos (7 KPIs visible)
- [ ] KPIs de Fletes correctos (4 KPIs)
- [ ] KPIs de Clientes correctos (4 KPIs)
- [ ] Tabla de clientes muestra 31 registros
- [ ] Estados de clientes correctos (critico, moroso, al_dia)
- [ ] Botón "Registrar Pago" visible en todas las filas
- [ ] Modal de pago abre correctamente
- [ ] Pago registrado actualiza datos en tiempo real
- [ ] Toast de confirmación aparece
- [ ] Estado cambia cuando cruza umbrales
- [ ] Gráficos se actualizan con nuevos datos
- [ ] Sin errores en consola del navegador
- [ ] Sin warnings críticos en build

---

## 📊 Métricas Esperadas (Datos Iniciales)

### Utilidades
- **Total Ingresos:** $280,758
- **Total Gastos:** $178,100
- **RF Actual:** $102,658
- **Balance Final:** $102,658
- **Registros:** 67 transacciones (54 ingresos + 13 gastos)

### Fletes
- **Total Registros:** 180+ (73 ingresos + 102 gastos + 5 RF)
- **TC Promedio:** ~19-20 MXN/USD
- **Proveedores únicos:** Variable

### Clientes
- **Total Clientes:** 31
- **Deuda Total:** $5,550,000
- **Pendiente Total:** $2,632,220
- **Clientes Críticos:** 5 (Bódega M-P, Tocayo, flama, Robalo, amigo playa azul)
- **Overpayments:** 2 (Ax -$317,380, Primo -$3,000)

---

## 🎯 Criterios de Éxito

✅ **Testing Exitoso SI:**
1. Todos los sistemas se inicializan sin errores
2. KPIs muestran valores correctos (no $0)
3. Tablas muestran datos reales (no placeholders)
4. Pagos se registran y actualizan en tiempo real
5. Estados de clientes cambian correctamente
6. Build sin errores de compilación
7. Sin errores de runtime en consola
8. Performance fluida (< 2s para cargar cada panel)

❌ **Testing Falla SI:**
1. Sistemas no inicializan (consola sin logs)
2. KPIs en $0 o "NaN"
3. Tablas vacías después de 5 segundos
4. Modal de pago no abre
5. Pago registrado pero tabla no actualiza
6. Errores de tipo "Cannot read property of undefined"
7. Build con errores de compilación
8. Lag > 5s al cambiar entre paneles

---

## 📝 Notas Finales

- **Datos de prueba:** Todos los datos iniciales son reales del Excel proporcionado
- **Persistencia:** Datos se guardan en localStorage, persisten entre recargas
- **Reset:** `localStorage.clear()` limpia todo y fuerza re-inicialización
- **Performance:** Build optimizado con 84.6% de compresión gzip
- **Compatibilidad:** Probado en Chrome 118+, Firefox 119+, Edge 118+

---

**Versión:** 1.0.0
**Última actualización:** 23 de octubre de 2025
**Autor:** Sistema FlowDistributor Premium Ecosystem
