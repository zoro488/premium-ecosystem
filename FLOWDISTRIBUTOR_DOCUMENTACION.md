# 📊 FLOWDISTRIBUTOR - DOCUMENTACIÓN COMPLETA

## 🎯 DESCRIPCIÓN GENERAL

**FlowDistributor** es un sistema empresarial completo para la gestión financiera y operativa de distribución de productos. Integra control de múltiples bancos, inventario, distribuidores, clientes, ventas y reportes en tiempo real.

---

## 🏗️ ARQUITECTURA DEL SISTEMA

### Stack Tecnológico

```
Frontend:
├── React 18.2.0
├── Vite 5.0.8 (build tool)
├── TailwindCSS 3.4.0 (estilos)
├── Framer Motion 10.16.16 (animaciones)
└── Lucide React (iconos)

Gráficos y Visualización:
├── Recharts 2.15.4 (gráficos)
└── AdvancedCharts (componentes custom)

Estado y Datos:
├── React Hooks (useState, useEffect, useCallback)
├── LocalStorage (persistencia)
└── Excel Data JSON (base de datos)

Características Avanzadas:
├── Búsqueda Avanzada (useAdvancedSearch)
├── Undo/Redo (useActionHistory)
├── Drag & Drop (useDragAndDrop)
├── Bulk Actions (useBulkActions)
├── Keyboard Shortcuts
├── AI Assistant
├── Notificaciones
└── Temas personalizables
```

### Estructura de Archivos

```
src/apps/FlowDistributor/
│
├── FlowDistributor.jsx               # Componente principal (9000+ líneas)
│
├── components/
│   ├── Charts.jsx                    # Gráficos y reportes
│   ├── ChartsLoading.jsx             # Loading states
│   ├── CursorGlow.jsx                # Efecto cursor
│   └── ToastContainer.jsx            # Notificaciones toast
│
├── hooks/
│   └── useFlowDistributorState.js    # Estado global
│
└── utils/
    ├── aiResponses.js                # Respuestas del AI
    ├── bulkActions.js                # Acciones masivas
    ├── dataManagement.js             # Gestión de datos
    └── validation.js                 # Validaciones
```

---

## 📦 BASE DE DATOS

### Estructura del archivo `excel_data.json`

```json
{
  "bancos": {
    "bovedaMonte": { ... },
    "bovedaUsa": { ... },
    "utilidades": { ... },
    "fleteSur": { ... },
    "azteca": { ... },
    "leftie": { ... },
    "profit": { ... }
  },
  "almacen": {
    "stockActual": 17,
    "entradas": [...],
    "salidas": [...],
    "movimientos": [...]
  },
  "distribuidores": [
    {
      "id": "DIST-001",
      "nombre": "PACMAN",
      "totalComprado": 6142500,
      "totalPagado": 0,
      "adeudo": 6142500,
      "ordenesCompra": 0,
      "estado": "activo",
      "ordenes": [],
      "pagos": []
    }
  ],
  "clientes": [
    {
      "id": "CLI-001",
      "nombre": "Ax",
      "totalComprado": 365400,
      "totalAbonado": 682780,
      "adeudo": -317380,
      "estado": "saldado",
      "observaciones": "",
      "ventas": []
    }
  ],
  "ventas": [
    {
      "id": "VENTA-2025-08-23T00:00:00-Ax-6",
      "tipo": "venta",
      "fecha": "2025-08-23T00:00:00",
      "ocRelacionada": "OC0001",
      "cantidad": 50,
      "cliente": "Ax",
      "productos": [...],
      "totalVenta": 350000,
      "totalFletes": 25000,
      "totalUtilidades": 10000,
      "estatus": "Pagado",
      "estadoPago": "pendiente",
      "adeudo": 0,
      "montoPagado": 0,
      "destino": "bovedaMonte",
      "concepto": "",
      "aplicaFlete": true,
      "bovedaMonte": 315000
    }
  ],
  "compras": [
    {
      "id": "OC0001",
      "tipo": "compra",
      "fecha": "2025-08-25",
      "distribuidor": "Q-MAYA",
      "cantidad": 423,
      "costoUnitario": 6300,
      "costoTotal": 2664900,
      "costoDistribuidor": 6100,
      "costoTransporte": 200,
      "stockActual": null,
      "montoPagado": null,
      "adeudo": null,
      "estado": "completada"
    }
  ],
  "gastosAbonos": [],
  "movimientos": [...],
  "metricasFinancieras": {...},
  "resumen": {...},
  "ultimaActualizacion": "2025-10-21T...",
  "version": "3.0-excel-completo",
  "estado": "sincronizado-excel"
}
```

### Esquema de Bancos

Cada banco tiene la siguiente estructura:

```json
{
  "nombre": "bovedaMonte",
  "capitalActual": 0,
  "ingresos": [
    {
      "fecha": "2025-08-23",
      "cliente": "Ax",
      "monto": 315000,
      "concepto": "Ax - "
    }
  ],
  "gastos": [
    {
      "fecha": "2025-08-22",
      "origen": "Gasto Bóveda Monte",
      "monto": 189000,
      "concepto": "Gasto Bóveda Monte - corporativo-boveda valle"
    }
  ],
  "estado": "activo"
}
```

### Los 7 Bancos del Sistema

1. **bovedaMonte** - Saldo: $0 | 69 ingresos | 26 gastos
2. **bovedaUsa** - Saldo: $128,005 | 17 ingresos | 49 gastos
3. **utilidades** - Saldo: $102,658 | 50 ingresos | 13 gastos
4. **fleteSur** - Saldo: $185,792 | 58 ingresos | 103 gastos
5. **azteca** - Saldo: **-$178,715** ⚠️ | 6 ingresos | 24 gastos
6. **leftie** - Saldo: $45,844 | 9 ingresos | 4 gastos
7. **profit** - Saldo: $12,577,748 | 55 ingresos | 0 gastos

---

## 🎨 FUNCIONALIDADES PRINCIPALES

### 1. 📊 DASHBOARD

Panel principal con métricas en tiempo real:

- **Capital Total**: Suma de todos los bancos
- **Total Ventas**: Ingresos totales
- **Total Gastos**: Egresos totales
- **Stock Almacén**: Unidades disponibles
- **Distribuidores Activos**: Cantidad
- **Clientes Activos**: Cantidad
- **Órdenes de Compra**: Total
- **Utilidad Neta**: Capital - Gastos

**Gráficos:**
- Flujo de capital (últimos 7 días)
- Distribución de ventas por cliente
- Estado de bancos
- Tendencias de inventario

### 2. 💰 BANCOS (7 PANELES INDIVIDUALES)

Cada banco tiene su propio panel con:

**Información:**
- Saldo actual
- Total de ingresos
- Total de gastos
- Estado (activo/negativo)

**Acciones:**
- Registrar ingreso
- Registrar gasto
- Ver historial completo
- Transferencias entre bancos
- Exportar movimientos

**Vista de Movimientos:**
```
┌─────────────────────────────────────────────┐
│ BÓVEDA MONTE                  Saldo: $0    │
├─────────────────────────────────────────────┤
│ INGRESOS (69)          Total: $5,722,280   │
│ ├─ 2025-08-23  Ax           $315,000       │
│ ├─ 2025-08-23  Negrito      $157,500       │
│ └─ 2025-08-23  Valle        $189,000       │
│                                             │
│ GASTOS (26)            Total: $5,722,280   │
│ ├─ 2025-08-22  Profit       $189,000       │
│ ├─ 2025-08-22  Profit       $136,000       │
│ └─ 2025-08-25  Profit       $350,000       │
└─────────────────────────────────────────────┘
```

### 3. 📦 ALMACÉN MONTE (INVENTARIO)

**Datos Actuales:**
- Stock: **17 unidades**
- Total entradas: 9 movimientos
- Total salidas: 96 movimientos
- Total movimientos: 105 registros

**Funcionalidades:**
- Registrar entrada (desde OC)
- Registrar salida (a cliente)
- Ver historial de movimientos
- Alertas de stock bajo
- Reporte de rotación

**Tabla de Movimientos:**
```
┌────────────┬───────┬──────────────┬──────────┬──────┐
│   Fecha    │ Tipo  │    Origen    │ Destino  │ Cant │
├────────────┼───────┼──────────────┼──────────┼──────┤
│ 2025-08-25 │ Entrada│ OC0001      │ Almacén  │ 423  │
│ 2025-08-23 │ Salida │ Almacén     │ Ax       │  50  │
│ 2025-08-23 │ Salida │ Almacén     │ Valle    │  60  │
└────────────┴───────┴──────────────┴──────────┴──────┘
```

### 4. 📋 DISTRIBUIDORES

**Distribuidores Registrados:**
1. **PACMAN** - Deuda: $6,142,500
2. **Q-MAYA** - Deuda: $6,098,400

**Funcionalidades:**
- Ver deudas totales
- Registrar pagos
- Historial de pagos
- Órdenes de compra asociadas
- Limpieza de distribuidores sin actividad

**Panel de Distribuidor:**
```
┌─────────────────────────────────────────────┐
│ PACMAN                  Deuda: $6,142,500   │
├─────────────────────────────────────────────┤
│ Total Comprado:         $6,142,500          │
│ Total Pagado:           $0                  │
│ Órdenes:                0                   │
│                                             │
│ [Realizar Pago]  [Ver Detalles]            │
└─────────────────────────────────────────────┘
```

### 5. 🛒 ÓRDENES DE COMPRA

**Total:** 9 órdenes (OC0001 - OC0009)

**Información por OC:**
- ID único (OC0001)
- Fecha de compra
- Distribuidor origen
- Cantidad de unidades
- Costo distribuidor
- Costo transporte
- Costo por unidad
- Costo total
- Estado

**Acciones:**
- Crear nueva OC
- Editar OC existente
- Vincular a distribuidor
- Registrar entrada a almacén
- Ver historial

### 6. 👥 CLIENTES

**Total:** 31 clientes activos

**Información por Cliente:**
- Nombre
- Total comprado
- Total abonado
- Adeudo actual
- Estado (activo/saldado)
- Observaciones
- Historial de ventas

**Top 5 Clientes con Adeudo:**
1. Bódega M-P: $945,000
2. amigo playa azul: $355,000
3. flama: $335,000
4. Tio Tocayo: $315,000
5. Tocayo: $255,200

**Acciones:**
- Registrar venta
- Registrar abono
- Ver historial
- Exportar estado de cuenta
- Enviar recordatorio

### 7. 📊 VENTAS

**Total:** 96 ventas registradas

**Información por Venta:**
- ID único
- Fecha
- Cliente
- OC relacionada
- Cantidad
- Precio de venta
- Total venta
- Fletes
- Utilidades
- Estado (Pendiente/Pagado)
- Destino (banco)

**Filtros:**
- Por cliente
- Por fecha
- Por estado de pago
- Por OC relacionada
- Por rango de montos

**Estadísticas:**
- Ventas del día/semana/mes
- Cliente más frecuente
- Ticket promedio
- Utilidad total

### 8. 📈 REPORTES Y ANÁLISIS

**Reportes Disponibles:**

1. **Reporte Financiero**
   - Balance de todos los bancos
   - Flujo de efectivo
   - Proyecciones

2. **Reporte de Inventario**
   - Rotación de producto
   - Stock actual vs histórico
   - Entradas y salidas

3. **Reporte de Distribuidores**
   - Deudas totales
   - Pagos realizados
   - Antigüedad de saldos

4. **Reporte de Clientes**
   - Cartera total
   - Clientes con adeudo
   - Historial de pagos

5. **Reporte de Ventas**
   - Ventas por período
   - Productos más vendidos
   - Utilidades por cliente

**Gráficos Avanzados:**
- Embudo de conversión
- Análisis de tendencias
- Comparación de períodos
- Mapa de calor de ventas
- Predicción de tendencias
- Gráfico gauge de métricas
- Análisis radar

---

## 🎯 CARACTERÍSTICAS AVANZADAS

### 1. 🔍 Búsqueda Avanzada

- Búsqueda en tiempo real
- Filtros múltiples
- Resaltado de coincidencias
- Búsqueda por voz (opcional)
- Historial de búsquedas

### 2. ↩️ Deshacer/Rehacer

- Historial de acciones ilimitado
- Atajos: Ctrl+Z / Ctrl+Y
- Vista de historial
- Restaurar a punto específico

### 3. ⌨️ Atajos de Teclado

```
Ctrl+Z        - Deshacer
Ctrl+Y        - Rehacer
Ctrl+K        - Búsqueda rápida
Ctrl+N        - Nueva transacción
Ctrl+S        - Guardar
Ctrl+E        - Exportar
Ctrl+D        - Dashboard
Esc           - Cerrar modal
?             - Ayuda de atajos
```

### 4. 🎨 Temas Personalizables

- Modo oscuro/claro
- Temas predefinidos:
  - Deep Ocean (azul oscuro)
  - Purple Dream (morado)
  - Forest Green (verde)
  - Sunset Orange (naranja)
- Editor de temas custom

### 5. 🤖 AI Assistant (ZeroForce)

**Comandos disponibles:**
- "¿Cuál es el saldo de Bóveda Monte?"
- "Muestra las ventas de hoy"
- "¿Cuánto debo a PACMAN?"
- "Exporta reporte de clientes"
- "¿Cuál es el stock actual?"

### 6. 🔔 Sistema de Notificaciones

**Tipos de notificación:**
- ✅ Éxito (verde)
- ❌ Error (rojo)
- ℹ️ Info (azul)
- ⚠️ Advertencia (amarillo)

**Prioridades:**
- Alta (urgente)
- Media (normal)
- Baja (informativa)

**Categorías:**
- Sistema
- Transacciones
- Inventario
- Pagos
- Reportes

### 7. 📤 Exportación de Datos

**Formatos disponibles:**
- Excel (.xlsx)
- CSV (.csv)
- JSON (.json)
- PDF (reportes)

**Datos exportables:**
- Todos los bancos
- Movimientos específicos
- Reporte de clientes
- Estado de inventario
- Ventas por período

### 8. 🎯 Acciones Masivas

- Selección múltiple
- Marcar como pagado (múltiples ventas)
- Eliminar múltiples registros
- Exportar selección
- Aplicar descuento masivo

### 9. 🖱️ Drag & Drop

- Reorganizar paneles
- Reordenar bancos
- Mover elementos en listas
- Orden persistente (guardado en localStorage)

### 10. 📱 Responsive Design

- Optimizado para desktop (1920x1080)
- Tablet (768px+)
- Mobile (480px+)
- Adaptación automática

---

## 🛠️ CONFIGURACIÓN Y USO

### Instalación

```bash
# Clonar repositorio
git clone [url-repositorio]

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
http://localhost:3001
```

### Configuración Inicial

1. **Cargar datos del Excel**:
   - Los datos ya están cargados en `public/excel_data.json`
   - Backup disponible en `public/excel_data.backup.json`

2. **Configurar Firebase (opcional)**:
   - Editar `src/config/firebase.js`
   - Agregar credenciales

3. **Personalizar tema**:
   - Editar `tailwind.config.js`
   - Colores en sección `theme.extend.colors`

### Scripts Disponibles

```bash
npm run dev              # Servidor desarrollo
npm run build            # Build producción
npm run preview          # Preview build
npm test                 # Ejecutar tests
npm run lint             # Linter
npm run format           # Formatear código
npm run deploy           # Deploy a Firebase
```

---

## 📊 FLUJO DE TRABAJO TÍPICO

### Caso 1: Registrar Nueva Compra

1. Ir a panel "Órdenes de Compra"
2. Click en "Nueva Orden"
3. Llenar formulario:
   - Distribuidor
   - Cantidad
   - Costos
4. Guardar
5. Automáticamente se registra entrada en Almacén

### Caso 2: Realizar Venta

1. Ir a panel "Ventas"
2. Click en "Nueva Venta"
3. Seleccionar:
   - Cliente
   - Cantidad
   - Precio
   - Banco destino
4. Calcular fletes/utilidades
5. Guardar
6. Se actualiza:
   - Stock de almacén
   - Saldo del banco
   - Adeudo del cliente

### Caso 3: Pagar a Distribuidor

1. Ir a panel "Distribuidores"
2. Seleccionar distribuidor
3. Click en "Realizar Pago"
4. Ingresar monto
5. Seleccionar banco origen
6. Confirmar
7. Se actualiza:
   - Deuda del distribuidor
   - Saldo del banco

### Caso 4: Ver Estado Financiero

1. Ir a "Dashboard"
2. Ver métricas principales
3. Click en "Reportes"
4. Seleccionar "Reporte Financiero"
5. Filtrar por período
6. Exportar si necesario

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Cannot read properties of undefined"

**Causa:** Datos faltantes en `excel_data.json`

**Solución:**
```bash
# Restaurar desde backup
cp public/excel_data.backup.json public/excel_data.json
```

### Error: Stock negativo en almacén

**Causa:** Salidas no registradas correctamente

**Solución:**
1. Ir a panel "Almacén"
2. Verificar historial de movimientos
3. Corregir manualmente desde consola:
```javascript
localStorage.setItem('almacen', JSON.stringify({stockActual: 17}))
```

### Error: Sumas incorrectas en bancos

**Causa:** Movimientos duplicados

**Solución:**
1. Exportar datos actuales
2. Limpiar localStorage
3. Recargar página
4. Reimportar datos limpios

---

## 📈 MÉTRICAS Y RENDIMIENTO

### Performance

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: 90+
- **Bundle Size**: ~800KB (gzipped)

### Optimizaciones Aplicadas

- Code splitting por rutas
- Lazy loading de componentes pesados
- Virtualización de listas largas
- Debouncing en búsquedas
- Memoización de cálculos pesados
- Cache de datos en localStorage

---

## 🔐 SEGURIDAD

### Medidas Implementadas

1. **Validación de datos**:
   - Zod schemas
   - Validación en tiempo real
   - Sanitización de inputs

2. **Persistencia segura**:
   - localStorage con validación
   - Backups automáticos
   - Versionado de datos

3. **Prevención de errores**:
   - Error boundaries
   - Fallbacks
   - Validación de tipos

---

## 📝 CHANGELOG

### Versión 3.0-excel-completo (Actual)

✅ **Agregado:**
- 7 bancos completos con movimientos
- Inventario de Almacén Monte
- Deudas reales de distribuidores
- 96 ventas sincronizadas
- 9 órdenes de compra
- 31 clientes actualizados

✅ **Mejorado:**
- Performance de renderizado
- Sistema de búsqueda
- Exportación de datos
- UI/UX general

🐛 **Corregido:**
- Error de distribuidores undefined
- Cálculos de saldos
- Sincronización de datos

---

## 👥 SOPORTE

Para soporte o preguntas:
- Revisar esta documentación
- Consultar código en `src/apps/FlowDistributor/`
- Revisar ejemplos en la aplicación

---

**Última actualización**: 2025-10-21
**Versión**: 3.0-excel-completo
**Estado**: ✅ Producción
