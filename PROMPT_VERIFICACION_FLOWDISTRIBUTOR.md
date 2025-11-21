# 🔍 PROMPT DE VERIFICACIÓN COMPLETA DEL SISTEMA FLOWDISTRIBUTOR

## 📋 CHECKLIST DE VERIFICACIÓN

Usa este prompt para verificar que el sistema FlowDistributor esté completamente funcional y cumpla con todos los requisitos establecidos.

---

## 1️⃣ VERIFICACIÓN DE ARQUITECTURA

### Servicios Backend
```
✅ Verificar que existen estos archivos:
- src/chronos-system/services/distribuidores.service.js
- src/chronos-system/services/ordenes-compra.service.js
- src/chronos-system/services/almacen.service.js
- src/chronos-system/services/ventas.service.js (mejorado)
- src/chronos-system/services/clientes.service.js (mejorado)
- src/chronos-system/services/bancos.service.js

✅ Cada servicio debe tener:
- Funciones de lectura (get*)
- Funciones de escritura (create*, update*)
- Funciones de eliminación (delete*)
- Manejo de errores con try/catch
- Uso de transacciones de Firestore donde sea necesario
```

### Páginas y Componentes
```
✅ Verificar que existe:
- src/chronos-system/pages/FlowDistributorPage.jsx (página principal)
- Navegación funcional entre 7 módulos
- Integración en src/App.jsx con ruta /flow
```

### Script de Migración
```
✅ Verificar:
- src/utils/migracion-firestore.js existe
- Importa correctamente datos_excel_reales_completos.json
- Función migrarDatosCompletos() implementada
- Función verificarMigracion() implementada
```

---

## 2️⃣ VERIFICACIÓN DE LÓGICA DE NEGOCIO

### A. Órdenes de Compra
```javascript
// Probar crear OC manualmente:
import { createOrdenCompra } from '@/chronos-system/services/ordenes-compra.service';

await createOrdenCompra({
  distribuidorNombre: 'Test Distribuidor',
  productos: [{
    nombre: 'Producto Test',
    cantidad: 10,
    precioUnitario: 100,
    unidad: 'pza'
  }],
  metodoPago: 'credito',
  notas: 'Test de orden de compra'
});

✅ DEBE CREAR AUTOMÁTICAMENTE:
1. Distribuidor en colección 'distribuidores'
2. Orden en colección 'ordenesCompra' con folio OC0001
3. Adeudo en 'adeudosDistribuidores' por $1000
4. Entrada en 'movimientosAlmacen' de 10 unidades
5. Stock en 'stock' incrementado en 10
6. Actualizar distribuidor.adeudoTotal = 1000
```

### B. Ventas Completas
```javascript
// Probar crear venta:
import { createVenta } from '@/chronos-system/services/ventas.service';

await createVenta({
  clienteNombre: 'Cliente Test',
  productos: [{
    nombre: 'Producto Test',
    cantidad: 5,
    precioUnitario: 150,
    costoUnitario: 100,
    aplicaFlete: true
  }],
  precioFlete: 500, // USD por defecto
  estadoPago: 'pagado', // o 'parcial' o 'pendiente'
  montoPagado: 3250, // (150 + 500) × 5 = 3250
  metodoPago: 'efectivo'
});

✅ DEBE HACER AUTOMÁTICAMENTE:

1. Crear/buscar cliente en 'clientes'
2. Crear venta en 'ventas' con folio V-0001
3. Calcular correctamente:
   - Total venta = (150 + 500) × 5 = 3250
   - Total flete = 500 × 5 = 2500
   - Total utilidad = (150 - 100) × 5 = 250

4. Registrar en Bóveda Monte:
   - Histórico: +3250
   - Capital: +3250 (porque está pagado)

5. Registrar en Fletes:
   - Histórico: +2500
   - Capital: +2500

6. Registrar en Utilidades:
   - Histórico: +250
   - Capital: +250

7. Salida de almacén: -5 unidades
8. Stock actualizado correctamente

Si estadoPago = 'parcial' con montoPagado = 1625:
   - Capital debe ser proporcionalmente la mitad en cada banco
   - Crear adeudo de cliente por $1625
```

### C. Pago a Distribuidor
```javascript
import { registrarPagoDistribuidor } from '@/chronos-system/services/distribuidores.service';

await registrarPagoDistribuidor(
  'distribuidorId',
  500, // monto
  'azteca', // banco origen
  'transferencia',
  'Pago parcial'
);

✅ DEBE HACER:
1. Aplicar $500 al adeudo más antiguo (FIFO)
2. Actualizar distribuidor.adeudoTotal -= 500
3. Crear registro en 'pagosDistribuidores'
4. Registrar gasto en banco 'azteca' por $500
5. Actualizar capital del banco azteca -= 500
```

### D. Abono de Cliente
```javascript
import { registrarPagoCliente } from '@/chronos-system/services/clientes.service';

// Similar a pago distribuidor
// Debe aplicar pago proporcionalmente a los bancos donde se registró la venta
```

---

## 3️⃣ VERIFICACIÓN DE CONTADORES Y HISTÓRICOS

### Bancos Operativos (Bóveda Monte, Fletes, Utilidades)
```javascript
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/chronos-system/config/firebase';

// Verificar contador de Bóveda Monte
const contadorRef = doc(db, 'contadoresBancos', 'bovedaMonte');
const contador = await getDoc(contadorRef);

✅ DEBE TENER:
{
  totalHistorico: número (solo aumenta, nunca disminuye),
  totalCapital: número (varía con gastos y transferencias),
  totalVentas: número,
  createdAt: timestamp,
  updatedAt: timestamp
}

✅ REGLA:
totalHistorico >= totalCapital (siempre)
```

### Almacén - Histórico vs Stock
```javascript
// Verificar contadores de almacén
const contadorAlmacenRef = doc(db, 'contadoresAlmacen', 'principal');
const contadorAlmacen = await getDoc(contadorAlmacenRef);

✅ DEBE TENER:
{
  totalEntradas: suma acumulativa de todas las entradas,
  totalSalidas: suma acumulativa de todas las salidas,
  totalMovimientos: count de todos los movimientos
}

✅ Stock actual de un producto:
const stockRef = collection(db, 'stock');
// stock.cantidad = entradas - salidas (en tiempo real)
```

---

## 4️⃣ VERIFICACIÓN DE UI/NAVEGACIÓN

### Página Principal
```
✅ Ir a http://localhost:3001/flow

✅ DEBE MOSTRAR:
1. Header con título "FlowDistributor"
2. Botón "Migrar Datos" (si no hay datos)
3. Menú lateral con 7 módulos:
   - Dashboard Principal
   - Ventas
   - Órdenes de Compra
   - Almacén
   - Clientes
   - Distribuidores
   - Bancos

4. Click en cada módulo debe cambiar el contenido
5. Animaciones suaves de transición
6. Responsive en mobile y desktop
```

### Migración de Datos
```
✅ Click en "Migrar Datos"
✅ Confirmar en el alert
✅ Esperar proceso (puede tardar 10-30 segundos)
✅ Ver mensaje de éxito con contadores
✅ Verificar en Firestore que se crearon las colecciones

✅ Colecciones creadas:
- bancos (6 documentos)
- contadoresBancos (6 documentos)
- ventas (~96+ documentos del JSON)
- clientes (según datos únicos)
- ingresosBancos (3 por cada venta pagada)
```

---

## 5️⃣ VERIFICACIÓN DE FÓRMULAS

### Venta con Flete
```
Datos:
- Producto: Precio = $200, Costo = $150
- Cantidad: 10 unidades
- Flete: $500 (aplica)
- Estado: Pagado

Cálculos esperados:
precioTotal = 200 + 500 = 700
totalVenta = 700 × 10 = 7000
totalFlete = 500 × 10 = 5000
totalUtilidad = (200 - 150) × 10 = 500

✅ Bóveda Monte:
   Histórico: +7000
   Capital: +7000

✅ Fletes:
   Histórico: +5000
   Capital: +5000

✅ Utilidades:
   Histórico: +500
   Capital: +500
```

### Venta Parcial
```
Mismos datos pero:
- Estado: Parcial
- Monto pagado: $3500 (50%)

✅ Bóveda Monte:
   Histórico: +7000 (SIEMPRE el total)
   Capital: +3500 (solo lo pagado)

✅ Fletes:
   Histórico: +5000
   Capital: +2500 (50%)

✅ Utilidades:
   Histórico: +500
   Capital: +250 (50%)

✅ Cliente:
   Adeudo creado: $3500
```

---

## 6️⃣ VERIFICACIÓN DE INTEGRIDAD

### Transacciones Atómicas
```
✅ TODAS estas operaciones deben ser atómicas (todo o nada):
1. Crear OC:
   - Distribuidor + OC + Adeudo + Entrada almacén

2. Crear Venta:
   - Cliente + Venta + Ingresos bancos + Salida almacén + Adeudo (si aplica)

3. Pagar Distribuidor:
   - Actualizar adeudos + Pago + Gasto banco + Actualizar totales

✅ Si una falla, todas se revierten
```

### Validaciones
```
✅ NO debe permitir:
1. Salida de almacén si stock insuficiente
2. Eliminar distribuidor con adeudos pendientes
3. Pago mayor al adeudo
4. Montos negativos
5. Fechas futuras (opcional)
```

---

## 7️⃣ VERIFICACIÓN DE RENDIMIENTO

### Consultas Optimizadas
```
✅ Usar índices de Firestore para:
- where('clienteId', '==', id)
- where('distribuidorId', '==', id)
- where('fecha', '>=', startDate)
- where('saldado', '==', false)

✅ Implementar paginación en listas grandes
✅ Usar cache donde sea posible
```

---

## 8️⃣ TEST COMPLETO END-TO-END

### Flujo Completo de Prueba:

```
1. Ejecutar migración de datos
   ✅ Verificar que se crearon todos los registros

2. Crear Orden de Compra:
   - Nombre: "Proveedor ABC"
   - Producto: "Widget", 100 unidades, $50 c/u
   ✅ Verificar distribuidor creado
   ✅ Verificar OC con folio OC0001
   ✅ Verificar adeudo $5000
   ✅ Verificar entrada almacén +100
   ✅ Verificar stock = 100

3. Registrar Venta:
   - Cliente: "Cliente XYZ"
   - Producto: Widget, 20 unidades, Precio $80, Costo $50
   - Flete: $500 (aplica)
   - Estado: Pagado
   ✅ Total venta = (80+500)×20 = $11,600
   ✅ Bóveda Monte: +11,600 (histórico y capital)
   ✅ Fletes: +10,000
   ✅ Utilidades: +600
   ✅ Salida almacén: -20
   ✅ Stock = 80

4. Crear otra venta parcial:
   - Mismo cliente
   - 30 unidades
   - 50% pagado = $8,700
   ✅ Adeudo cliente: $8,700
   ✅ Bancos histórico vs capital diferente

5. Pagar a Distribuidor:
   - Desde banco Azteca
   - $2,000
   ✅ Adeudo distribuidor: $3,000
   ✅ Azteca capital: -$2,000
   ✅ Gasto registrado

6. Abonar a Cliente:
   - $5,000
   ✅ Adeudo cliente: $3,700
   ✅ Bancos actualizados proporcionalmente

✅ RESULTADO FINAL ESPERADO:
- Stock: 50 unidades (100 entrada - 50 salidas)
- Bóveda Monte histórico: ~$28,900
- Bóveda Monte capital: variable según pagos
- Adeudo distribuidor: $3,000
- Adeudo cliente: $3,700
- Todas las transacciones registradas
- Trazabilidad completa
```

---

## 🎯 CRITERIOS DE ÉXITO

### ✅ Sistema Perfecto Si:

1. **Todas las operaciones CRUD funcionan sin errores**
2. **Actualizaciones automáticas entre módulos**
3. **Histórico vs Capital calculado correctamente**
4. **Stock dinámico funciona (suma/resta)**
5. **Adeudos se crean y pagan correctamente**
6. **Fórmulas de bancos son exactas**
7. **UI navega sin errores**
8. **Migración de datos exitosa**
9. **Transacciones son atómicas**
10. **Validaciones previenen errores**

### 🚨 Reportar Si:

1. Alguna operación falla
2. Stock no actualiza
3. Bancos no registran correctamente
4. Adeudos no se crean
5. Histórico disminuye (no debe pasar)
6. UI tiene errores o no navega
7. Migración falla
8. Transacción parcial (debe ser todo o nada)

---

## 📊 VERIFICACIÓN CON DATOS REALES

### Usar los datos del JSON:
```javascript
// El JSON tiene:
- controlMaestro: ~150+ ventas históricas
- Clientes únicos: ~50+
- Montos variados con estados: Pagado, Parcial, Pendiente

✅ Después de migrar, verificar:
1. Número de ventas = registros en controlMaestro
2. Clientes creados = clientes únicos en ventas
3. Suma Bóveda Monte histórico = suma de todos los ingresos
4. Adeudos pendientes = ventas con estado "Pendiente"
```

---

## 🔧 HERRAMIENTAS DE VERIFICACIÓN

### Firebase Console
```
1. Ir a https://console.firebase.google.com
2. Seleccionar proyecto
3. Ir a Firestore Database
4. Verificar colecciones creadas
5. Revisar documentos individuales
6. Verificar timestamps, campos, estructura
```

### DevTools
```
1. Abrir Chrome DevTools (F12)
2. Console: Ver errores de JavaScript
3. Network: Ver llamadas a Firestore
4. Application > Storage: Ver localStorage
```

### React DevTools
```
1. Instalar extensión React DevTools
2. Ver componentes renderizados
3. Ver hooks y state
4. Verificar props pasadas
```

---

## ✅ CHECKLIST FINAL

```
[ ] Servicios creados y sin errores de lint
[ ] FlowDistributorPage renderiza correctamente
[ ] Navegación entre módulos funciona
[ ] Migración de datos exitosa
[ ] Crear OC funciona end-to-end
[ ] Crear venta funciona end-to-end
[ ] Pago a distribuidor funciona
[ ] Abono a cliente funciona
[ ] Stock se actualiza correctamente
[ ] Bancos registran histórico vs capital
[ ] Adeudos se crean y actualizan
[ ] Contadores acumulativos funcionan
[ ] UI responsive y sin errores
[ ] Animaciones suaves
[ ] Console sin errores críticos
[ ] Firestore tiene todas las colecciones
[ ] Fórmulas calculan correctamente
[ ] Validaciones previenen errores
[ ] Transacciones son atómicas
[ ] Sistema listo para producción
```

---

## 🎉 SI TODO ESTÁ ✅ = SISTEMA 100% FUNCIONAL

**¡Felicidades! FlowDistributor está completo y listo para usar en producción.**

---

**Usa este documento para verificar cada aspecto del sistema y asegurar 0 errores.**
