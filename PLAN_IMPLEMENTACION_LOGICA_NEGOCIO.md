# 🚀 PLAN DE IMPLEMENTACIÓN - Adaptación Lógica de Negocio del Excel

## ✅ FASE 1: CAMBIOS CRÍTICOS EN MODELOS DE DATOS

### 1.1 Modificar Estructura de Ventas
**Archivo**: `FlowDistributor.jsx` línea ~276

**Cambio Actual →  Nuevo**:
```javascript
// ❌ ANTES
{
  id: '1',
  fecha: '2025-01-15',
  cliente: 'Ax',
  productos: [...],
  total: 315000,
}

// ✅ DESPUÉS
{
  id: '1',
  fecha: '2025-01-15',
  cliente: 'Ax',
  productos: [...],
  total: 315000,
  destino: 'bovedaMonte', // ⭐ NUEVO
  estatus: 'Pendiente',   // ⭐ NUEVO: 'Pagado' | 'Pendiente'
  concepto: 'Venta local monte #15', // ⭐ NUEVO
}
```

### 1.2 Crear Nuevo Modelo de Gastos/Abonos
**Archivo**: Nuevo estado en FlowDistributor

```javascript
const [gastosAbonos, setGastosAbonos] = useLocalStorage(STORAGE_KEYS.FLOW_GASTOS_ABONOS, []);

// Estructura:
{
  id: '1',
  fecha: '2025-01-15',
  tipo: 'abono' | 'gasto' | 'transferencia',
  origenGastoOAbono: 'Ax', // Cliente o concepto
  valor: 50000,
  destino: 'bovedaMonte', // Banco destino
  observaciones: 'Abono parcial',
}
```

### 1.3 Actualizar Cálculo de Adeudos en Clientes
**Archivo**: FlowDistributor.jsx

**Lógica Actual → Nueva**:
```javascript
// ❌ ANTES: Solo suma ventas
const adeudo = ventas
  .filter(v => v.cliente === nombreCliente)
  .reduce((sum, v) => sum + v.total, 0);

// ✅ DESPUÉS: Ventas Pendientes - Abonos
const calcularAdeudoCliente = (nombreCliente) => {
  const ventasPendientes = ventas
    .filter(v => v.cliente === nombreCliente && v.estatus === 'Pendiente')
    .reduce((sum, v) => sum + v.total, 0);
  
  const abonosRealizados = gastosAbonos
    .filter(g => g.tipo === 'abono' && g.origenGastoOAbono === nombreCliente)
    .reduce((sum, g) => sum + g.valor, 0);
  
  return ventasPendientes - abonosRealizados;
};
```

---

## ✅ FASE 2: NUEVAS FUNCIONES DE NEGOCIO

### 2.1 Función: Marcar Venta como Pagada
```javascript
const marcarVentaPagada = (ventaId) => {
  const venta = ventas.find(v => v.id === ventaId);
  if (!venta) return;
  
  // Actualizar estatus
  setVentas(ventas.map(v => 
    v.id === ventaId 
      ? { ...v, estatus: 'Pagado', fechaPago: new Date().toISOString() }
      : v
  ));
  
  // Sumar al banco destino
  setBancos({
    ...bancos,
    [venta.destino]: {
      ...bancos[venta.destino],
      capitalActual: bancos[venta.destino].capitalActual + venta.total,
      historico: bancos[venta.destino].historico + venta.total,
      registros: [
        ...bancos[venta.destino].registros,
        {
          concepto: `Venta pagada: ${venta.cliente} - ${venta.concepto}`,
          monto: venta.total,
          fecha: new Date().toLocaleString(),
        }
      ],
    }
  });
  
  showNotification(`Venta de ${venta.cliente} marcada como pagada`, 'success');
};
```

### 2.2 Función: Registrar Abono de Cliente
```javascript
const registrarAbono = (cliente, monto, bancoDestino, observaciones = '') => {
  if (monto <= 0) {
    showNotification('El monto debe ser mayor a 0', 'error');
    return;
  }
  
  const nuevoAbono = {
    id: `abono_${Date.now()}`,
    fecha: new Date().toISOString(),
    tipo: 'abono',
    origenGastoOAbono: cliente,
    valor: monto,
    destino: bancoDestino,
    observaciones: observaciones || `Abono de ${cliente}`,
  };
  
  setGastosAbonos([...gastosAbonos, nuevoAbono]);
  
  // Aumentar capital del banco
  setBancos({
    ...bancos,
    [bancoDestino]: {
      ...bancos[bancoDestino],
      capitalActual: bancos[bancoDestino].capitalActual + monto,
      registros: [
        ...bancos[bancoDestino].registros,
        {
          concepto: nuevoAbono.observaciones,
          monto: monto,
          fecha: new Date().toLocaleString(),
        }
      ],
    }
  });
  
  showNotification(`Abono de $${monto.toLocaleString()} registrado para ${cliente}`, 'success');
};
```

### 2.3 Función: Crear Venta (Actualizada)
```javascript
const crearVenta = (datosVenta) => {
  const nuevaVenta = {
    id: `venta_${Date.now()}`,
    fecha: new Date().toISOString(),
    ...datosVenta,
    estatus: 'Pendiente', // ⭐ Por defecto pendiente
    destino: datosVenta.destino || 'bovedaMonte', // ⭐ Banco destino
  };
  
  setVentas([...ventas, nuevaVenta]);
  
  // ⚠️ NO se suma al banco hasta marcar como pagada
  
  showNotification(
    `Venta creada para ${nuevaVenta.cliente}. Estatus: Pendiente`,
    'info'
  );
};
```

---

## ✅ FASE 3: COMPONENTES UI

### 3.1 Panel de Ventas - Agregar Columna de Estatus
```jsx
// En tabla de ventas
<TableCell>
  <motion.span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      venta.estatus === 'Pagado'
        ? 'bg-green-100 text-green-800'
        : 'bg-yellow-100 text-yellow-800'
    }`}
  >
    {venta.estatus}
  </motion.span>
</TableCell>

<TableCell>
  {venta.estatus === 'Pendiente' && (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => marcarVentaPagada(venta.id)}
      className="px-3 py-1 bg-green-500 text-white rounded-lg"
    >
      <CheckCircle2 className="w-4 h-4 inline mr-1" />
      Marcar Pagado
    </motion.button>
  )}
</TableCell>
```

### 3.2 Panel de Clientes - Agregar Botón de Abono
```jsx
// En cada cliente
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => {
    setClienteSeleccionado(cliente.nombre);
    setShowAbonoModal(true);
  }}
  className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2"
>
  <DollarSign className="w-4 h-4" />
  Registrar Abono
</motion.button>
```

### 3.3 Modal de Abono
```jsx
const AbonoModal = ({ cliente, onClose, onSubmit }) => {
  const [monto, setMonto] = useState(0);
  const [banco, setBanco] = useState('bovedaMonte');
  const [observaciones, setObservaciones] = useState('');
  
  return (
    <motion.div className="modal-overlay">
      <motion.div className="modal-content">
        <h2>Registrar Abono - {cliente}</h2>
        
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(Number(e.target.value))}
          placeholder="Monto del abono"
        />
        
        <select value={banco} onChange={(e) => setBanco(e.target.value)}>
          <option value="bovedaMonte">Bóveda Monte</option>
          <option value="utilidades">Utilidades</option>
          <option value="fletes">Fletes</option>
          <option value="azteca">Azteca</option>
          <option value="leftie">Leftie</option>
          <option value="profit">Profit</option>
        </select>
        
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Observaciones (opcional)"
        />
        
        <button onClick={() => onSubmit(cliente, monto, banco, observaciones)}>
          Registrar Abono
        </button>
        <button onClick={onClose}>Cancelar</button>
      </motion.div>
    </motion.div>
  );
};
```

---

## ✅ FASE 4: ACTUALIZAR STORAGE KEYS

**Archivo**: `src/utils/storage.js`

```javascript
export const STORAGE_KEYS = {
  // ... existentes
  FLOW_VENTAS: 'flow_ventas',
  FLOW_CLIENTES: 'flow_clientes',
  FLOW_BANCOS: 'flow_bancos',
  
  // ⭐ NUEVO
  FLOW_GASTOS_ABONOS: 'flow_gastos_abonos',
};
```

---

## ✅ FASE 5: ACTUALIZAR DASHBOARD

### 5.1 Agregar Métricas de Cobranza
```jsx
const metricasCobranza = {
  totalPendiente: ventas
    .filter(v => v.estatus === 'Pendiente')
    .reduce((sum, v) => sum + v.total, 0),
  
  totalPagado: ventas
    .filter(v => v.estatus === 'Pagado')
    .reduce((sum, v) => sum + v.total, 0),
  
  tasaCobro: (
    (ventas.filter(v => v.estatus === 'Pagado').length / ventas.length) * 100
  ).toFixed(1),
};

// Tarjeta en Dashboard
<DashboardCard
  title="Pendiente de Cobro"
  value={`$${metricasCobranza.totalPendiente.toLocaleString()}`}
  icon={Clock}
  trend={metricasCobranza.tasaCobro}
  trendLabel={`${metricasCobranza.tasaCobro}% cobrado`}
  color="yellow"
/>
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### ✅ FASE 1: Modelos de Datos
- [ ] Agregar campo `estatus` a ventas
- [ ] Agregar campo `destino` a ventas
- [ ] Agregar campo `concepto` a ventas
- [ ] Crear estado `gastosAbonos`
- [ ] Actualizar función `calcularAdeudoCliente`

### ✅ FASE 2: Funciones de Negocio
- [ ] Implementar `marcarVentaPagada`
- [ ] Implementar `registrarAbono`
- [ ] Actualizar `crearVenta`
- [ ] Actualizar `registrarGasto` para incluir tipo

### ✅ FASE 3: UI/UX
- [ ] Agregar columna "Estatus" en tabla de ventas
- [ ] Agregar botón "Marcar como Pagado" en ventas pendientes
- [ ] Crear componente `AbonoModal`
- [ ] Agregar botón "Registrar Abono" en panel de clientes
- [ ] Actualizar panel de clientes para mostrar adeudo real
- [ ] Agregar filtros por estatus en ventas

### ✅ FASE 4: Dashboard
- [ ] Agregar métrica "Pendiente de Cobro"
- [ ] Agregar métrica "Tasa de Cobro"
- [ ] Agregar gráfico Pagado vs Pendiente
- [ ] Agregar lista de clientes con mayor adeudo

### ✅ FASE 5: Testing
- [ ] Probar creación de venta (debe quedar pendiente)
- [ ] Probar marcar venta como pagada (debe actualizar banco)
- [ ] Probar registrar abono (debe reducir adeudo y actualizar banco)
- [ ] Probar cálculo de adeudo con múltiples ventas y abonos
- [ ] Verificar persistencia en localStorage

---

## 🎯 ORDEN DE IMPLEMENTACIÓN

1. **Primero**: Actualizar modelos de datos (FASE 1)
2. **Segundo**: Crear nuevas funciones (FASE 2)
3. **Tercero**: Actualizar UI para ventas y clientes (FASE 3)
4. **Cuarto**: Actualizar dashboard (FASE 4)
5. **Quinto**: Testing completo (FASE 5)

---

## ⚠️ NOTAS IMPORTANTES

1. **Migración de Datos**: Las ventas existentes no tienen `estatus`, por defecto asignarles `'Pendiente'`
2. **Compatibilidad**: Mantener retrocompatibilidad con datos antiguos
3. **Validaciones**: Siempre validar que montos sean > 0
4. **Notificaciones**: Usar sistema de notificaciones para feedback al usuario
5. **Performance**: Los cálculos de adeudos pueden ser costosos, usar `useMemo`

---

**Fecha de Creación**: 20 de Octubre 2025  
**Archivo Base**: FlowDistributor.jsx  
**Basado en**: Análisis de Administación_General.xlsx
