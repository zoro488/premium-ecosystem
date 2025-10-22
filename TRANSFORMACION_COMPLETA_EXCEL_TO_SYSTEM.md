# 🚀 TRANSFORMACIÓN COMPLETA: EXCEL → FLOWDISTRIBUTOR

## 📋 ANÁLISIS DEL EXCEL REAL

### Sheets Identificados (12 total):
1. **Distribuidores** - Gestión de proveedores
2. **Control_Maestro** - Control de inventario y costos
3. **Almacen_Monte** - Inventario principal
4. **Bóveda_Monte** - Banco principal
5. **Bóveda_USA** - Banco secundario
6. **Flete_Sur** - Gastos de transporte
7. **Utilidades** - Ganancias
8. **Azteca** - Banco Azteca
9. **Leftie** - Banco Leftie
10. **Profit** - Banco Profit
11. **Clientes** - Lista de clientes
12. **DATA** - Datos maestros

### Bancos Identificados (7 únicos):
1. ✅ Bóveda Monte (Principal)
2. ✅ Bóveda USA
3. ✅ Utilidades
4. ✅ Flete Sur
5. ✅ Azteca
6. ✅ Leftie
7. ✅ Profit

### Fórmulas Críticas: **1,462 fórmulas**

---

## 🎯 MODELO DE DATOS DEFINITIVO (BASADO EN EXCEL)

### 1. MODELO DE VENTAS
```javascript
{
  id: 'V_001',
  fecha: '2025-10-20',
  cliente: 'Ax',
  concepto: 'Venta local monte #15',
  destino: 'bovedaMonte', // A qué banco va el dinero
  ingreso: 315000, // Monto total de la venta
  estatus: 'Pendiente', // 'Pendiente' | 'Pagado'
  fechaPago: null, // Se llena al marcar como pagado
  
  // Detalle de productos (opcional)
  productos: [
    {
      producto: 'Producto A',
      cantidad: 10,
      precioUnitario: 31500
    }
  ],
  
  // Excel: V_Monte sheet
  // Formula relevante: SUMIFS(V_Monte[Ingreso], V_Monte[Cliente], "Ax", V_Monte[Estatus], "Pendiente")
}
```

### 2. MODELO DE GASTOS/ABONOS
```javascript
{
  id: 'G_001',
  fecha: '2025-10-20',
  tipo: 'abono', // 'abono' | 'gasto' | 'transferencia'
  origenGastoOAbono: 'Ax', // Cliente o concepto del gasto
  valor: 50000,
  destino: 'bovedaMonte', // A qué banco se acredita
  observaciones: 'Abono parcial cliente Ax',
  
  // Para transferencias
  origen: null, // Banco de origen (solo para transferencias)
  
  // Excel: G_Monte sheet
  // Formula relevante: SUMIF(G_Monte[Origen del Gasto o Abono], "Ax", G_Monte[Valor])
}
```

### 3. MODELO DE CLIENTES
```javascript
{
  id: 'C_001',
  nombre: 'Ax',
  contacto: '+52 555 1234',
  email: 'ax@email.com',
  
  // CALCULADO - No se almacena
  adeudo: 0, // Se calcula: ventasPendientes - abonosRealizados
  
  // Historial
  ventasRealizadas: 25,
  totalComprado: 5000000,
  abonosRealizados: 3500000,
  
  // Excel: Clientes sheet
  // Formula adeudo: =SUMIFS(V_Monte[Ingreso], V_Monte[Cliente], nombre, V_Monte[Estatus], "Pendiente") - SUMIF(G_Monte[Origen], nombre, G_Monte[Valor])
}
```

### 4. MODELO DE BANCOS
```javascript
{
  bovedaMonte: {
    nombre: 'Bóveda Monte',
    capitalActual: 0, // Se calcula en tiempo real
    historico: 0, // Total acumulado histórico
    
    // Registros detallados
    registros: [
      {
        id: 'R_001',
        fecha: '2025-10-20',
        concepto: 'Venta pagada: Ax',
        tipo: 'ingreso', // 'ingreso' | 'egreso' | 'transferencia'
        monto: 315000,
        relacionadoCon: 'V_001', // ID de venta, gasto, etc.
      }
    ],
    
    // Cálculos automáticos
    ingresosMes: 0,
    egresosMes: 0,
  },
  
  // Excel: Hojas individuales por banco (Bóveda_Monte, Bóveda_USA, etc.)
  // Formula capital: =SUM(Ingresos) - SUM(Egresos)
}
```

### 5. MODELO DE ÓRDENES DE COMPRA
```javascript
{
  id: 'OC_001',
  fecha: '2025-10-20',
  origen: 'Distribuidor A', // Distribuidor
  
  productos: [
    {
      producto: 'Producto X',
      cantidad: 100,
      costoUnitario: 500,
      costoTotal: 50000
    }
  ],
  
  total: 50000,
  estatus: 'completada', // 'pendiente' | 'completada' | 'cancelada'
  
  // Excel: OC table (Orden de Compra)
  // Formula: =SUMIF(OC[Origen], "Distribuidor A", OC[Costo Total])
}
```

### 6. MODELO DE ALMACÉN
```javascript
{
  id: 'ALM_001',
  producto: 'Producto X',
  
  // Stock actual (calculado)
  cantidad: 500, // entradas - salidas
  
  // Control
  cantidadMinima: 50,
  cantidadMaxima: 1000,
  
  // Costos (del Control_Maestro)
  costoUnitario: 500, // Desde última OC
  valorInventario: 250000, // cantidad * costoUnitario
  
  // Tracking
  ultimaEntrada: '2025-10-15',
  ultimaSalida: '2025-10-18',
  
  // Excel: Almacen_Monte sheet + Control_Maestro
  // Formula valor: =PRODUCT(SUMIF(OC[OC], producto, OC[Costo Por Unidad]), cantidad)
}
```

---

## 🔄 FÓRMULAS CLAVE A IMPLEMENTAR

### Fórmula 1: Adeudo de Cliente
```excel
=SUMIFS(V_Monte[Ingreso], V_Monte[Cliente], "Ax", V_Monte[Estatus], "Pendiente") 
- SUMIF(G_Monte[Origen del Gasto o Abono], "Ax", G_Monte[Valor])
```

**Implementación JavaScript**:
```javascript
const calcularAdeudoCliente = (nombreCliente) => {
  const ventasPendientes = ventas
    .filter(v => v.cliente === nombreCliente && v.estatus === 'Pendiente')
    .reduce((sum, v) => sum + v.ingreso, 0);
  
  const abonosRealizados = gastosAbonos
    .filter(g => g.tipo === 'abono' && g.origenGastoOAbono === nombreCliente)
    .reduce((sum, g) => sum + g.valor, 0);
  
  return ventasPendientes - abonosRealizados;
};
```

### Fórmula 2: Costo Total Distribuidor
```excel
=SUMIF(OC[Origen], "Distribuidor A", OC[Costo Total])
```

**Implementación JavaScript**:
```javascript
const calcularTotalDistribuidor = (nombreDistribuidor) => {
  return ordenesCompra
    .filter(oc => oc.origen === nombreDistribuidor)
    .reduce((sum, oc) => sum + oc.total, 0);
};
```

### Fórmula 3: Valor de Inventario
```excel
=PRODUCT(SUMIF(OC[OC], producto, OC[Costo Por Unidad]), cantidad)
```

**Implementación JavaScript**:
```javascript
const calcularValorInventario = (producto, cantidad) => {
  const ultimaOC = ordenesCompra
    .flatMap(oc => oc.productos)
    .filter(p => p.producto === producto)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
  
  const costoUnitario = ultimaOC?.costoUnitario || 0;
  return costoUnitario * cantidad;
};
```

### Fórmula 4: Capital de Banco
```excel
=SUM(FILTER(Registros, tipo="ingreso")) - SUM(FILTER(Registros, tipo="egreso"))
```

**Implementación JavaScript**:
```javascript
const calcularCapitalBanco = (nombreBanco) => {
  const banco = bancos[nombreBanco];
  const ingresos = banco.registros
    .filter(r => r.tipo === 'ingreso')
    .reduce((sum, r) => sum + r.monto, 0);
  
  const egresos = banco.registros
    .filter(r => r.tipo === 'egreso')
    .reduce((sum, r) => sum + r.monto, 0);
  
  return ingresos - egresos;
};
```

---

## 🎨 ESTRUCTURA DE PANELES (BASADO EN SHEETS DEL EXCEL)

### Panel 1: Dashboard General
- Vista consolidada de todos los bancos
- Gráficos de ingresos vs egresos
- Alertas de stock bajo
- KPIs principales

### Panel 2: Bóveda Monte (Sheet: Bóveda_Monte)
- Historial de transacciones
- Ventas pagadas que ingresaron
- Gastos y abonos registrados
- Transferencias

### Panel 3: Bóveda USA (Sheet: Bóveda_USA)
- Mismo formato que Bóveda Monte
- Transacciones en USD (opcional)

### Panel 4: Bancos Secundarios (Utilidades, Flete Sur, Azteca, Leftie, Profit)
- Tabs individuales
- Historial de movimientos
- Saldo actual

### Panel 5: Clientes (Sheet: Clientes)
- Lista de clientes con adeudos calculados
- Botón "Registrar Abono"
- Historial de ventas por cliente
- Filtros por adeudo

### Panel 6: Distribuidores (Sheet: Distribuidores)
- Lista de distribuidores
- Total comprado por distribuidor
- Órdenes de compra asociadas

### Panel 7: Almacén (Sheet: Almacen_Monte + Control_Maestro)
- Stock actual con valores
- Productos bajo mínimo
- Entradas y salidas
- Costo por unidad actualizado

### Panel 8: Ventas (Sheet: V_Monte)
- Todas las ventas
- Filtro por estatus (Pendiente/Pagado)
- Botón "Marcar como Pagado"
- Asignar banco destino

### Panel 9: Gastos y Abonos (Sheet: G_Monte)
- Registro de gastos
- Registro de abonos
- Transferencias entre bancos

### Panel 10: Reportes
- Exportar a Excel
- Gráficos avanzados
- Comparativas

---

## 🚀 PLAN DE IMPLEMENTACIÓN

### FASE 1: Actualizar Modelos de Datos ✅ (COMPLETADO)
- [x] Agregar campo `estatus` a ventas
- [x] Agregar campo `destino` a ventas
- [x] Crear modelo `gastosAbonos`
- [x] Actualizar `STORAGE_KEYS`

### FASE 2: Implementar Funciones de Negocio ✅ (COMPLETADO)
- [x] `calcularAdeudoCliente()`
- [x] `marcarVentaPagada()`
- [x] `registrarAbono()`

### FASE 3: Agregar Bóveda USA (NUEVO BANCO)
- [ ] Agregar `bovedaUSA` al estado de bancos
- [ ] Crear panel individual para Bóveda USA
- [ ] Implementar conversión de divisas (opcional)

### FASE 4: Actualizar UI - Panel de Ventas
- [ ] Agregar columna "Estatus" (Pendiente/Pagado)
- [ ] Agregar columna "Destino" (Banco)
- [ ] Botón "Marcar como Pagado"
- [ ] Filtros por estatus
- [ ] Modal para seleccionar banco destino

### FASE 5: Actualizar UI - Panel de Clientes
- [ ] Mostrar adeudo REAL (con nueva fórmula)
- [ ] Botón "Registrar Abono"
- [ ] Modal de abono con selección de banco
- [ ] Historial de abonos por cliente

### FASE 6: Crear Panel de Gastos y Abonos
- [ ] Lista de todos los gastos/abonos
- [ ] Filtros por tipo (gasto/abono/transferencia)
- [ ] Formulario de registro
- [ ] Asignación de destino

### FASE 7: Actualizar Paneles de Bancos
- [ ] Separar ingresos por tipo (ventas, abonos, transferencias)
- [ ] Mostrar egresos (gastos, transferencias salientes)
- [ ] Gráfico de flujo de caja
- [ ] Timeline de transacciones

### FASE 8: Mejorar Almacén
- [ ] Calcular `valorInventario` con fórmula del Excel
- [ ] Mostrar costo unitario actual
- [ ] Alertas de reorden automático
- [ ] Historial de cambios de precio

### FASE 9: Dashboard Avanzado
- [ ] KPI: Total en todos los bancos
- [ ] KPI: Cuentas por cobrar (adeudos totales)
- [ ] KPI: Valor de inventario
- [ ] Gráfico: Flujo de caja mensual
- [ ] Gráfico: Top 10 clientes con mayor adeudo
- [ ] Alertas inteligentes

### FASE 10: Exportación y Reportes
- [ ] Exportar a formato Excel compatible
- [ ] Generar reporte de adeudos
- [ ] Generar estado de cuenta por cliente
- [ ] Generar estado de cuenta por banco

---

## 📊 MÉTRICAS Y KPIs (BASADOS EN EXCEL)

### KPIs Principales:
1. **Capital Total**: Suma de todos los bancos
2. **Cuentas por Cobrar**: Suma de adeudos de todos los clientes
3. **Valor de Inventario**: Suma del valor de todo el stock
4. **Deuda con Distribuidores**: Total pendiente de pagar
5. **Ganancia del Mes**: Ingresos - Egresos del mes actual
6. **Tasa de Cobro**: % de ventas marcadas como pagadas

### Gráficos Clave:
1. **Flujo de Caja**: Ingresos vs Egresos por mes
2. **Distribución de Capital**: Pie chart de bancos
3. **Top Clientes**: Bar chart de mayores adeudos
4. **Stock Crítico**: Productos bajo mínimo
5. **Trend de Ventas**: Line chart de ventas mensuales

---

## 🔒 REGLAS DE NEGOCIO (EXTRAÍDAS DEL EXCEL)

### Regla 1: Ventas Pendientes
- Toda venta nueva tiene estatus "Pendiente"
- NO se acredita al banco hasta marcarla como "Pagado"
- Cuenta para el adeudo del cliente

### Regla 2: Marcar Venta como Pagada
- Cambia estatus a "Pagado"
- Acredita el monto al banco destino
- Actualiza fecha de pago
- Genera registro en el banco

### Regla 3: Abonos
- Reduce el adeudo del cliente
- Se acredita al banco destino
- NO marca ventas como pagadas automáticamente
- Puede haber abonos parciales

### Regla 4: Gastos
- Restan del banco especificado
- Pueden ser transferencias entre bancos
- Requieren observaciones/concepto

### Regla 5: Adeudo de Cliente
- Adeudo = Ventas Pendientes - Abonos Realizados
- Si adeudo ≤ 0, cliente está al corriente
- Puede haber saldo a favor (adeudo negativo = anticipo)

### Regla 6: Valor de Inventario
- Se calcula con el costo de la última OC
- Se actualiza automáticamente al recibir nueva OC
- Valor Total = Cantidad × Costo Unitario Actual

### Regla 7: Capital de Banco
- Capital = Ingresos - Egresos
- Ingresos: Ventas pagadas, abonos, transferencias entrantes
- Egresos: Gastos, transferencias salientes

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

1. ✅ **COMPLETADO**: Agregar estado `gastosAbonos`
2. ✅ **COMPLETADO**: Implementar `calcularAdeudoCliente()`
3. ✅ **COMPLETADO**: Implementar `marcarVentaPagada()`
4. ✅ **COMPLETADO**: Implementar `registrarAbono()`
5. ⏳ **SIGUIENTE**: Agregar Bóveda USA al sistema
6. ⏳ **SIGUIENTE**: Actualizar UI de Panel de Ventas
7. ⏳ **SIGUIENTE**: Actualizar UI de Panel de Clientes
8. ⏳ **SIGUIENTE**: Crear Panel de Gastos y Abonos

---

## 📝 NOTAS IMPORTANTES

- **1,462 fórmulas** identificadas en el Excel
- El sistema debe ser **más inteligente** que el Excel
- Automatizar cálculos que en Excel son manuales
- Mantener compatibilidad para importar/exportar datos del Excel
- Todas las fechas en formato ISO 8601
- Todos los montos en números (no strings)
- Validaciones en tiempo real

---

**Fecha de Creación**: 20 de Octubre 2025  
**Basado en**: Administación_General.xlsx (12 sheets, 1462 fórmulas)  
**Estado**: FASE 2 COMPLETADA - Continuando con FASE 3
