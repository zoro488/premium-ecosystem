# 📊 Análisis de Lógica de Negocio del Excel "Administración_General.xlsx"

## 🎯 Resumen Ejecutivo

Se analizó el archivo Excel que contiene la lógica real del negocio con **620+ fórmulas** distribuidas en múltiples hojas. El sistema maneja:
- Ventas y pagos de clientes
- Gestión de gastos por destino (bancos)
- Control de adeudos y abonos
- Movimientos entre diferentes "bancos" o cuentas

---

## 📁 Estructura del Excel

### Hojas Identificadas:
1. **Clientes** - Gestión de clientes y adeudos
2. **DATA** - Datos maestros y listas de referencia
3. **Control_Maestro** - Referencias cruzadas
4. **V_Monte** - Ventas de Bóveda Monte
5. **G_Monte** - Gastos de Bóveda Monte

---

## 🔑 Entidades Clave Identificadas

### 1. **Bancos/Destinos**
```
- Bóveda Monte (Boveda Monte)
- Utilidades
- Flete Sur
- Azteca
- Leftie
- Profit
- Bóveda USA
```

### 2. **Clientes**
```
- Primo
- Tavo
- Ax
- Robalo
- Valle
- Tio Tocayo
- Lamas
- Chendo
- Galvan
- Trámite
- Negrito
- Sierra47
- Chucho
- Don Rafa
- Don Alex
- Tocayo
- Rojo
- 470
- Valle Local
- tx8
```

### 3. **Tipos de Transacciones**
```
- Ventas (V_Monte)
- Gastos (G_Monte)
- Abonos
- Transferencias entre bancos
```

---

## 📐 Lógica de Negocio Detectada

### 🔴 **Fórmula Principal de Adeudos**

Para cada cliente se calcula:

```excel
Deuda_Cliente = Ingresos_Pendientes - Abonos_Realizados
```

**Fórmula Excel:**
```excel
=SUMIFS(V_Monte[Ingreso], V_Monte[Cliente], NombreCliente, V_Monte[Estatus], "Pendiente") 
- SUMIF(G_Monte[Origen del Gasto o Abono], NombreCliente, G_Monte[Valor])
```

**Columnas:**
- **Columna G**: Ingresos pendientes del cliente
- **Columna H**: Abonos realizados por el cliente
- **Columna I**: Deuda neta (G - H)

---

### 💰 **Estructura de Ventas (V_Monte)**

Campos identificados:
```
- Fecha
- Cliente
- Ingreso (monto)
- Bóveda Monte (destino del dinero)
- Concepto
- Estatus ("Pagado" o "Pendiente")
```

**Lógica:**
- Si estatus = "Pendiente" → Se suma al adeudo del cliente
- Si estatus = "Pagado" → Ingresa al banco correspondiente

---

### 💸 **Estructura de Gastos (G_Monte)**

Campos identificados:
```
- Fecha
- Origen del Gasto o Abono (cliente/concepto)
- Valor (monto)
- Destino (banco destino)
- Observaciones
```

**Lógica:**
- Los gastos se restan del banco origen
- Si es un "Abono", reduce la deuda del cliente
- Si el destino es un banco, se transfiere ahí

---

## 🏦 **Sistema de Bancos**

### Bancos de Ventas (Principales):
1. **Bóveda Monte** - Recibe ventas locales
2. **Utilidades** - Recibe ganancias
3. **Fletes** - Para transporte

### Bancos de Distribuidores:
4. **Azteca**
5. **Leftie**  
6. **Profit**

### Otros:
7. **Bóveda USA** - Operaciones internacionales

---

## 📊 **Flujo de Dinero Identificado**

```
┌─────────────────┐
│  VENTA (V_Monte)│
│  Cliente: Ax    │
│  Monto: $315,000│
│  Estatus: Pagado│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Bóveda Monte   │
│  +$315,000      │
└────────┬────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌────────────────┐  ┌──────────────┐
│   Utilidades   │  │ Gasto/Abono  │
│  Transferencia │  │ Distribuidor │
└────────────────┘  └──────────────┘
```

---

## 🎲 **Cálculos de Movimientos**

### Ejemplo Real del Excel:

**Fecha: 23/08/2025**
```
VENTA:
- Cliente: Ax
- Monto: $315,000
- Destino: Bóveda Monte
- Estatus: Pagado

VENTA:
- Cliente: Valle
- Monto: $189,000
- Destino: Bóveda Monte  
- Estatus: Pagado

VENTA:
- Cliente: Negrito
- Monto: $157,500
- Destino: Bóveda Monte
- Estatus: Pagado
```

**TOTAL BÓVEDA MONTE ese día: $661,500**

---

## 🔍 **Tipos de Gastos Identificados**

```
1. Gasto Azteca
2. Gasto Bóveda Monte
3. Gasto Bóveda Usa
4. Gasto Flete Sur
5. Gasto Profit
6. Gasto Utilidades
7. Gasto Leftie
```

Cada gasto reduce el capital del banco correspondiente.

---

## 📋 **Campos de Control de Maestro**

Se detectaron referencias a `Control_Maestro!D43` hasta `D226`, lo que indica un sistema de control centralizado para validaciones y datos maestros.

---

## ⚠️ **Discrepancias Identificadas vs FlowDistributor Actual**

### 1. **Sistema de Adeudos**
❌ **Actual**: Solo suma ventas pendientes  
✅ **Correcto**: `Adeudo = Ventas_Pendientes - Abonos_Realizados`

### 2. **Estatus de Ventas**
❌ **Actual**: No distingue entre "Pagado" y "Pendiente"  
✅ **Correcto**: Debe tener campo `estatus` con valores "Pagado" o "Pendiente"

### 3. **Gastos con Destino**
❌ **Actual**: Gastos simples  
✅ **Correcto**: Gastos deben tener `destino` (banco) y pueden ser transferencias

### 4. **Abonos de Clientes**
❌ **Actual**: No implementados como tipo de transacción  
✅ **Correcto**: Los abonos reducen el adeudo y se registran en G_Monte

### 5. **Tipos de Ventas**
❌ **Actual**: Ventas genéricas  
✅ **Correcto**: Ventas locales vs ventas a distribuidores tienen conceptos específicos

### 6. **Sistema de Bancos**
❌ **Actual**: 6 bancos predefinidos  
✅ **Correcto**: Bancos tienen jerarquía (ventas vs distribuidores vs operacionales)

---

## 🛠️ **Cambios Necesarios en FlowDistributor**

### A. **Modelo de Datos**

#### Ventas:
```javascript
{
  id: string,
  fecha: Date,
  cliente: string,
  monto: number,
  destino: 'bovedaMonte' | 'utilidades' | 'fletes',
  concepto: string,
  estatus: 'Pagado' | 'Pendiente', // ⭐ NUEVO
  productos: Array,
}
```

#### Gastos/Abonos:
```javascript
{
  id: string,
  fecha: Date,
  tipo: 'gasto' | 'abono' | 'transferencia', // ⭐ NUEVO
  origenGastoOAbono: string, // Cliente o concepto
  valor: number,
  destino: string, // Banco destino
  observaciones: string,
}
```

#### Clientes:
```javascript
{
  nombre: string,
  ventasPendientes: number,  // SUMIFS con Estatus="Pendiente"
  abonosRealizados: number,  // SUMIF de gastos tipo "abono"
  adeudo: number,           // ventasPendientes - abonosRealizados ⭐
}
```

### B. **Funciones a Actualizar**

```javascript
// ⭐ NUEVA: Calcular adeudo real
const calcularAdeudoCliente = (cliente) => {
  const ventasPendientes = ventas
    .filter(v => v.cliente === cliente && v.estatus === 'Pendiente')
    .reduce((sum, v) => sum + v.monto, 0);
  
  const abonosRealizados = gastos
    .filter(g => g.tipo === 'abono' && g.origenGastoOAbono === cliente)
    .reduce((sum, g) => sum + g.valor, 0);
  
  return ventasPendientes - abonosRealizados;
};

// ⭐ NUEVA: Registrar abono de cliente
const registrarAbono = (cliente, monto, bancoDestino) => {
  const nuevoGasto = {
    id: generateId(),
    fecha: new Date(),
    tipo: 'abono',
    origenGastoOAbono: cliente,
    valor: monto,
    destino: bancoDestino,
    observaciones: `Abono de ${cliente}`,
  };
  
  setGastos([...gastos, nuevoGasto]);
  
  // El abono aumenta el capital del banco
  setBancos({
    ...bancos,
    [bancoDestino]: {
      ...bancos[bancoDestino],
      capitalActual: bancos[bancoDestino].capitalActual + monto,
    }
  });
};

// ⭐ ACTUALIZAR: Al crear venta, definir estatus
const crearVenta = (datosVenta) => {
  const nuevaVenta = {
    ...datosVenta,
    estatus: 'Pendiente', // Por defecto pendiente
  };
  
  setVentas([...ventas, nuevaVenta]);
  
  // NO se suma al banco hasta que estatus cambie a "Pagado"
};

// ⭐ NUEVA: Marcar venta como pagada
const marcarVentaPagada = (ventaId) => {
  const venta = ventas.find(v => v.id === ventaId);
  
  setVentas(ventas.map(v => 
    v.id === ventaId 
      ? { ...v, estatus: 'Pagado' }
      : v
  ));
  
  // AHORA sí se suma al banco
  setBancos({
    ...bancos,
    [venta.destino]: {
      ...bancos[venta.destino],
      capitalActual: bancos[venta.destino].capitalActual + venta.monto,
    }
  });
};
```

---

## 🎯 **Prioridades de Implementación**

### FASE 1: Crítico (Lógica de Negocio)
1. ✅ Agregar campo `estatus` a ventas
2. ✅ Implementar cálculo de adeudo: `Pendientes - Abonos`
3. ✅ Crear tipo de transacción "Abono"
4. ✅ Actualizar panel de clientes con adeudo real

### FASE 2: Importante (Funcionalidad)
5. ⭐ Agregar botón "Marcar como Pagado" en ventas
6. ⭐ Agregar botón "Registrar Abono" en clientes
7. ⭐ Gastos con destino (transferencias)
8. ⭐ Filtros por estatus en ventas

### FASE 3: Mejoras (UI/UX)
9. 🎨 Dashboard con ventas pagadas vs pendientes
10. 🎨 Historial de abonos por cliente
11. 🎨 Alertas de adeudos altos
12. 🎨 Reportes de cobranza

---

## 📈 **Métricas del Excel**

- **Hojas analizadas**: 4+ (Clientes, DATA, Control_Maestro, más tablas V_Monte y G_Monte)
- **Fórmulas detectadas**: 620+
- **Clientes activos**: 20+
- **Bancos/Destinos**: 7
- **Rango de fechas**: Agosto 2025 - Enero 2026
- **Montos procesados**: Millones de pesos

---

## ✅ **Conclusión**

El Excel implementa un sistema **MUCHO más complejo** que el FlowDistributor actual:

1. **Manejo de estatus** de ventas (Pagado/Pendiente)
2. **Abonos** que reducen adeudos
3. **Transferencias** entre bancos
4. **Control centralizado** con hoja maestra
5. **Cálculos precisos** de deudas netas

**Recomendación**: Implementar los cambios en FASE 1 de inmediato para que FlowDistributor refleje la lógica real del negocio.

---

**Fecha de Análisis**: 20 de Octubre 2025  
**Archivo Analizado**: `Administación_General.xlsx`  
**Herramientas**: Python + openpyxl + pandas
