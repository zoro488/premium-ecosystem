# 🚀 GUÍA DE DEMOSTRACIÓN - FLOWDISTRIBUTOR

## 📋 PREPARACIÓN ANTES DE LA DEMO

### 1. Limpiar Datos de Prueba (SI ES NECESARIO)

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Limpiar SOLO datos de FlowDistributor
localStorage.removeItem('flow_bancos');
localStorage.removeItem('flow_ordenes_compra');
localStorage.removeItem('flow_distribuidores');
localStorage.removeItem('flow_ventas');
localStorage.removeItem('flow_clientes');
localStorage.removeItem('flow_almacen');

// Recargar la página
location.reload();
```

### 2. Verificar que el Servidor Esté Corriendo

```bash
npm run dev
```

Abrir: http://localhost:3002

---

## 🎯 FLUJO DE DEMOSTRACIÓN COMPLETO

### DEMO 1: Registro de Orden de Compra (3 minutos)

**Historia:** "Vamos a registrar una orden de compra de productos que queremos vender"

1. **Ir a "Órdenes de Compra"** (sidebar izquierdo)

2. **Click en "Nueva Orden"**

3. **Llenar el formulario:**
   - Distribuidor: `TechSupply México`
   - Producto 1:
     - Nombre: `Laptop Dell Inspiron 15`
     - Cantidad: `10`
     - Precio unitario: `12000`
   - Click "Agregar producto"
   - Producto 2:
     - Nombre: `Mouse Logitech MX Master`
     - Cantidad: `25`
     - Precio unitario: `800`

4. **Mostrar cálculo automático:**
   - Total: `$140,000` (calculado en tiempo real)

5. **Click "Crear Orden"**

6. **Verificar:**
   - ✅ Orden aparece en el historial
   - ✅ Distribuidor "TechSupply México" se crea automáticamente
   - ✅ Adeudo del distribuidor: `$140,000`
   - ✅ Productos se agregan al almacén

---

### DEMO 2: Verificar Inventario Actualizado (2 minutos)

**Historia:** "Vamos a verificar que los productos entraron al almacén"

1. **Ir a "Almacén"** (sidebar)

2. **Mostrar:**
   - ✅ 2 productos nuevos en stock
   - ✅ Cantidades correctas
   - ✅ Búsqueda en tiempo real (buscar "Laptop")
   - ✅ Filtros por categoría

3. **Mostrar KPIs:**
   - Total de productos
   - Stock actual
   - Valor del inventario

---

### DEMO 3: Realizar una Venta (4 minutos)

**Historia:** "Un cliente compra productos, vamos a registrar la venta"

1. **Ir a "Ventas"** (sidebar)

2. **Click "Nueva Venta"**

3. **Llenar formulario:**
   - Cliente: `Corporativo ABC S.A.`
   - Producto 1:
     - Nombre: `Laptop Dell Inspiron 15`
     - Cantidad: `3`
     - Precio unitario (venta): `18000`
     - Precio compra: `12000`
   - Producto 2:
     - Nombre: `Mouse Logitech MX Master`
     - Cantidad: `10`
     - Precio unitario: `1200`
     - Precio compra: `800`
   - Estado de pago: `Completo`
   - Precio flete: `500`

4. **Mostrar cálculos automáticos:**
   - **Fletes:** `$500` → Va a banco "Fletes"
   - **Utilidades:** Se calculan automáticamente
   - **Total venta:** Se muestra en tiempo real

5. **Click "Registrar Venta"**

6. **Verificar actualización INSTANTÁNEA:**
   - ✅ Venta registrada
   - ✅ Cliente creado con datos
   - ✅ Stock disminuyó en almacén
   - ✅ Bancos actualizados (Fletes + Utilidades)

---

### DEMO 4: Verificar Flujo de Dinero (2 minutos)

**Historia:** "Veamos cómo se distribuyó el dinero de la venta"

1. **Click en "Bóveda Monte"** (sidebar, sección de bancos)

2. **Mostrar panel del banco:**
   - Capital actual
   - Histórico
   - Gráficos de movimientos

3. **Click en "Utilidades"** (sidebar)
   - Verificar ingreso de utilidades
   - Mostrar registro de la venta

4. **Click en "Fletes"** (sidebar)
   - Verificar ingreso de $500
   - Mostrar historial

---

### DEMO 5: Gestión de Clientes (2 minutos)

**Historia:** "Verificamos que el cliente se registró automáticamente"

1. **Ir a "Clientes"** (sidebar)

2. **Mostrar:**
   - ✅ Cliente "Corporativo ABC S.A." creado
   - ✅ Adeudo: $0 (porque pagó completo)
   - ✅ Historial de compras

3. **Demo de pago parcial (opcional):**
   - Crear otra venta con "Pago Parcial"
   - Mostrar adeudo del cliente
   - Realizar abono
   - Mostrar actualización

---

### DEMO 6: Distribuidores y Pagos (2 minutos)

**Historia:** "Pagamos al distribuidor que nos vendió los productos"

1. **Ir a "Distribuidores"** (sidebar)

2. **Mostrar:**
   - Distribuidor "TechSupply México"
   - Adeudo: `$140,000`
   - Órdenes registradas

3. **Realizar pago:**
   - Click en el distribuidor
   - Monto: `50000`
   - Banco origen: `Bóveda Monte`
   - Click "Pagar"

4. **Verificar:**
   - ✅ Adeudo actualizado: `$90,000`
   - ✅ Banco "Bóveda Monte" disminuyó
   - ✅ Pago registrado en historial

---

### DEMO 7: Reportes y Exportación (2 minutos)

**Historia:** "Generamos un reporte del estado del negocio"

1. **Ir a "Reportes"** (sidebar)

2. **Mostrar dashboard:**
   - 📊 Gráficos de ingresos vs egresos
   - 💰 Balance financiero
   - 📈 Tendencias

3. **Exportar reporte:**
   - Click "Exportar"
   - Seleccionar formato (PDF o CSV)
   - Descargar

4. **Mostrar contenido del reporte:**
   - Resumen financiero completo
   - Distribución por banco
   - Operaciones realizadas
   - Adeudos pendientes

---

### DEMO 8: Dashboard General (1 minuto)

**Historia:** "Vista general del negocio en tiempo real"

1. **Ir a "Dashboard"** (sidebar)

2. **Mostrar KPIs principales:**
   - 💰 Capital total en bancos
   - 📈 Ganancia neta
   - 📦 Operaciones totales
   - ⚠️ Alertas de stock bajo

3. **Mostrar gráficos animados:**
   - Ingresos vs Egresos por mes
   - Distribución de bancos

---

## 🎨 FEATURES PREMIUM A DESTACAR

### Durante cualquier demo, mencionar:

1. **✅ Persistencia Automática**
   - "Todo se guarda automáticamente, incluso si cierras el navegador"
   - Recargar página para demostrarlo

2. **⚡ Actualización en Tiempo Real**
   - "Nota cómo todos los números se actualizan instantáneamente"
   - Mostrar cambios en múltiples paneles

3. **🎯 Cálculos Automáticos**
   - "No necesitas calculadora, el sistema calcula todo"
   - Fletes, utilidades, totales, adeudos

4. **🔔 Notificaciones Inteligentes**
   - Aparecen cuando hay stock bajo
   - Alertas de operaciones importantes

5. **🎨 Interfaz Moderna**
   - Animaciones suaves
   - Gráficos interactivos
   - Responsive design

---

## 📊 DATOS RECOMENDADOS PARA DEMO

### Productos Ejemplo:
- Laptop Dell Inspiron 15 - $12,000 (compra) / $18,000 (venta)
- Mouse Logitech MX Master - $800 (compra) / $1,200 (venta)
- Teclado Mecánico RGB - $1,500 (compra) / $2,200 (venta)
- Monitor LG 27" 4K - $5,500 (compra) / $8,000 (venta)
- Impresora HP LaserJet - $3,200 (compra) / $4,800 (venta)

### Distribuidores Ejemplo:
- TechSupply México
- Computadoras y Más
- Mayorista Tech Pro
- Digital Warehouse

### Clientes Ejemplo:
- Corporativo ABC S.A.
- Oficinas Premium
- Startup XYZ
- Gobierno Municipal

---

## ⚠️ TROUBLESHOOTING

### Si algo sale mal durante la demo:

1. **Datos no se guardan:**
   ```javascript
   // Verificar localStorage
   console.log(localStorage.getItem('flow_almacen'));
   ```

2. **Página en blanco:**
   - Abrir consola (F12)
   - Verificar errores
   - Recargar (Ctrl+F5)

3. **Resetear SOLO FlowDistributor:**
   ```javascript
   localStorage.removeItem('flow_bancos');
   localStorage.removeItem('flow_ordenes_compra');
   localStorage.removeItem('flow_distribuidores');
   localStorage.removeItem('flow_ventas');
   localStorage.removeItem('flow_clientes');
   localStorage.removeItem('flow_almacen');
   location.reload();
   ```

---

## 💡 TIPS PARA LA PRESENTACIÓN

1. **Antes de empezar:**
   - Cerrar otras pestañas
   - Zoom del navegador al 100%
   - Modo pantalla completa (F11)

2. **Durante la demo:**
   - Hablar mientras haces clicks
   - Explicar QUÉ hace cada botón ANTES de presionarlo
   - Mostrar las notificaciones que aparecen

3. **Destacar ventajas:**
   - "Todo automático"
   - "Sin errores de cálculo"
   - "Historial completo"
   - "Reportes profesionales al instante"

4. **Final:**
   - Mostrar Dashboard completo
   - Resumir todo lo que se hizo
   - Preguntar si quieren ver algo específico

---

## 🎬 SCRIPT RÁPIDO (5 MINUTOS)

**Si tienes poco tiempo, este es el flujo express:**

1. **Nueva Orden** (1 min)
   - TechSupply → 10 Laptops a $12,000

2. **Verificar Almacén** (30 seg)
   - Mostrar productos

3. **Nueva Venta** (1.5 min)
   - Corporativo ABC → 3 Laptops a $18,000

4. **Ver Bancos** (1 min)
   - Mostrar actualización de Utilidades y Fletes

5. **Dashboard Final** (1 min)
   - Mostrar todos los KPIs actualizados
   - Gráficos

---

## ✅ CHECKLIST PRE-DEMO

- [ ] Servidor corriendo (npm run dev)
- [ ] Navegador en http://localhost:3002
- [ ] localStorage limpio (estado fresco)
- [ ] Consola del navegador cerrada
- [ ] Notas de productos/precios a mano
- [ ] Zoom 100%
- [ ] Internet estable

---

**¡FlowDistributor listo para impresionar! 🚀**

*Última actualización: 2025-10-20*
