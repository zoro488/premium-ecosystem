# 🚀 FlowDistributor 3.0 - Sistema de Administración Profesional

## 📊 Basado 100% en tu Excel de Administración General

---

## ✨ ¿QUÉ ES FLOWDISTRIBUTOR 3.0?

**FlowDistributor** es un sistema web moderno que **replica, optimiza y automatiza completamente** la lógica de tu archivo Excel **Administación_General.xlsx**, eliminando la necesidad de usar Excel y llevando tu administración a un nivel profesional.

### 🎯 Características Principales

✅ **Importación Completa del Excel**: 80 ventas, 29 clientes, 9 órdenes, 6 bancos
✅ **Cálculos Automáticos**: Todo se calcula en tiempo real (fletes, utilidades, adeudos)
✅ **Dashboard Interactivo**: KPIs, gráficas y métricas en vivo
✅ **Gestión de Inventario**: Control automático de stock con entradas/salidas
✅ **Multi-Banco**: 6 cuentas bancarias con ingresos/gastos/transferencias
✅ **Trazabilidad Total**: Cada operación está vinculada y se puede rastrear
✅ **Menús Contextuales**: Clic derecho para acciones rápidas en todas las tablas
✅ **Respaldos Automáticos**: Exporta/Importa JSON, localStorage persistente
✅ **Validación Avanzada**: Imposible cometer errores de entrada
✅ **Diseño Moderno**: Interfaz oscura con animaciones y efectos visuales

---

## 🚀 INICIO RÁPIDO

### 1️⃣ Importar Datos del Excel

```bash
# Opción A: Script automático (Recomendado)
IMPORTAR-EXCEL.bat

# Opción B: Manual
python scripts/excel_to_flowdistributor.py
```

### 2️⃣ Iniciar FlowDistributor

```bash
npm run dev
```

Abre en navegador: `http://localhost:3002`

### 3️⃣ Cargar Datos en la App

1. Clic en **⚙️ Configuración** (esquina superior derecha)
2. Clic en **"📊 Importar desde Excel"**
3. Confirmar importación
4. **¡Listo!** Todos los datos están cargados

---

## 📂 ESTRUCTURA DEL SISTEMA

```
FlowDistributor/
├── 📊 Dashboard          → Vista general con KPIs y gráficas
├── 📦 Órdenes de Compra  → Gestión de compras a distribuidores
├── 👥 Distribuidores     → Control de proveedores y adeudos
├── 🏭 Almacén            → Inventario con entradas/salidas automáticas
├── 💰 Ventas             → Registro de ventas con control de pagos
├── 👤 Clientes           → Seguimiento de adeudos y abonos
└── 🏦 Bancos             → 6 cuentas con movimientos financieros
    ├── Bóveda Monte
    ├── Utilidades
    ├── Fletes
    ├── Azteca
    ├── Leftie
    └── Profit
```

---

## 🔄 FLUJO DE TRABAJO

### 1️⃣ Compra a Distribuidor
```
Panel "Órdenes de Compra" → + Nueva Orden
↓
Ingresa: Distribuidor, Cantidad, Costos
↓
Sistema automáticamente:
  ✓ Crea la orden
  ✓ Registra entrada en almacén
  ✓ Calcula costo total
  ✓ Actualiza stock
```

### 2️⃣ Venta a Cliente
```
Panel "Ventas" → + Nueva Venta
↓
Ingresa: Cliente, Productos, Precio
↓
Sistema automáticamente:
  ✓ Calcula fletes ($500/unidad si aplica)
  ✓ Calcula utilidades
  ✓ Resta stock del almacén
  ✓ Crea/Actualiza cliente
  ✓ Distribuye dinero a bancos
  ✓ Registra adeudo si es pendiente
```

### 3️⃣ Pago de Cliente
```
Panel "Clientes" → Seleccionar Cliente → Registrar Abono
↓
Sistema automáticamente:
  ✓ Ingresa dinero al banco
  ✓ Reduce adeudo del cliente
  ✓ Actualiza estado de pago
  ✓ Registra en historial
```

### 4️⃣ Movimientos Bancarios
```
Panel "Bancos" → Seleccionar Banco → + Ingreso/Gasto
↓
Sistema automáticamente:
  ✓ Actualiza saldo actual
  ✓ Registra en historial
  ✓ Calcula capital disponible
```

---

## 🎨 CARACTERÍSTICAS AVANZADAS

### 🔍 Búsqueda Inteligente
- **Tiempo Real**: Escribe y filtra instantáneamente
- **Multi-Campo**: Busca en cliente, OC, producto, fecha
- **Resaltado**: Resultados destacados visualmente

### 📊 Dashboard Dinámico
- **KPIs en Vivo**: Total ventas, adeudos, stock, capital
- **Gráficas Automáticas**: Tendencias y distribución
- **Alertas**: Stock bajo, pagos pendientes

### 🖱️ Menús Contextuales
- **Clic Derecho** en cualquier registro:
  - Ver detalles
  - Copiar ID
  - Editar (próximamente)
  - Eliminar (con cascade update)

### 🗑️ Eliminación Inteligente
Al eliminar un registro, el sistema automáticamente:
- ✅ Revierte productos al stock
- ✅ Actualiza adeudos de clientes
- ✅ Revierte movimientos bancarios
- ✅ Mantiene integridad total

### 💾 Sistema de Respaldos
- **Exportar**: Descarga JSON con todos los datos
- **Importar**: Restaura desde archivo JSON
- **Excel**: Importa directamente desde el Excel original
- **Auto-Save**: localStorage guarda automáticamente

### 🎯 Validación Avanzada
- ✅ No permite cantidades negativas
- ✅ Verifica stock antes de vender
- ✅ Valida formatos de datos
- ✅ Confirmaciones para acciones críticas
- ✅ Mensajes de error claros

---

## 📊 DATOS IMPORTADOS DEL EXCEL

### ✅ 80 Ventas
- Desde **08/2025** hasta **10/2025**
- Clientes: Bódega M-P, Valle, Ax, Negrito, Wero Benavides, Lamas, etc.
- Con estado de pago, fletes, utilidades calculadas

### ✅ 29 Clientes
- Nombres únicos extraídos de ventas
- Adeudos pendientes: algunos con deudas activas
- Abonos registrados
- Observaciones especiales

### ✅ 9 Órdenes de Compra
- IDs: OC0001 a OC0009
- Distribuidores: Q-MAYA, PACMAN, A/X, CH-MONTE, VALLE-MONTE
- Cantidades: desde 20 hasta 513 unidades
- Costos completos con transporte

### ✅ 6 Distribuidores
- Con totales de compra
- Saldos pendientes de pago
- Historial de órdenes

### ✅ 89 Movimientos de Almacén
- 9 entradas desde órdenes de compra
- 80 salidas por ventas
- Stock calculado automáticamente

### ✅ 6 Bancos Configurados
| Banco | Ingresos | Gastos | Saldo |
|-------|----------|--------|-------|
| Bóveda Monte | 51 | 20 | Calculado |
| Utilidades | 37 | 11 | Calculado |
| Fletes | 46 | 83 | Calculado |
| Azteca | 6 | 0 | Calculado |
| Leftie | 7 | 0 | Calculado |
| Profit | 37 | 0 | Calculado |

---

## 🆚 EXCEL vs FLOWDISTRIBUTOR

| Característica | Excel | FlowDistributor |
|----------------|-------|-----------------|
| **Velocidad** | Lento con datos | Instantáneo |
| **Errores** | Fórmulas se rompen | Imposible |
| **Interfaz** | Celdas grises | Dashboard moderno |
| **Búsqueda** | Ctrl+F básico | Búsqueda avanzada |
| **Gráficas** | Crear manualmente | Automáticas |
| **Móvil** | No funciona bien | Responsive |
| **Respaldos** | Guardar .xlsx | JSON automático |
| **Multi-usuario** | ❌ | ✅ (potencial) |
| **Validación** | Manual | Automática |
| **Actualización** | Copiar fórmulas | Auto-calculado |

---

## 📚 DOCUMENTACIÓN COMPLETA

### 📖 Guías Disponibles

1. **[ANALISIS_EXCEL_Y_ADAPTACION.md](./ANALISIS_EXCEL_Y_ADAPTACION.md)**
   - Análisis profundo del Excel
   - Mapeo completo de datos
   - Lógica de negocio identificada
   - Fórmulas convertidas

2. **[GUIA_IMPORTACION_EXCEL.md](./GUIA_IMPORTACION_EXCEL.md)**
   - Guía paso a paso de importación
   - Solución de problemas
   - Verificación post-importación

3. **Este README**
   - Visión general del sistema
   - Características principales
   - Inicio rápido

### 🛠️ Scripts Disponibles

- **`IMPORTAR-EXCEL.bat`**: Conversión automática Excel → JSON
- **`scripts/excel_to_flowdistributor.py`**: Parser de Python
- **`npm run dev`**: Iniciar servidor de desarrollo
- **`npm run build`**: Compilar para producción

---

## 🔧 CONFIGURACIÓN Y OPCIONES

### ⚙️ Modal de Configuración

Acceso: Clic en **⚙️** en la esquina superior derecha

**Opciones disponibles**:
1. **Crear Respaldo**: Exporta JSON con todos los datos
2. **Restaurar Respaldo**: Importa JSON previo
3. **Importar desde Excel**: Carga datos del Excel original
4. **Resetear Sistema**: Limpia TODO y pone marcadores en $0

### 🎨 Personalización

El sistema ya incluye:
- Modo oscuro por defecto
- Animaciones suaves
- Efectos de hover
- Transiciones fluidas
- Glow effects en botones
- Gradientes modernos

---

## 🚨 NOTAS IMPORTANTES

⚠️ **Antes de importar desde Excel**:
1. Crea un respaldo de tus datos actuales
2. Ejecuta `IMPORTAR-EXCEL.bat` para generar el JSON
3. Verifica que el archivo `public/excel_data.json` exista

⚠️ **La importación REEMPLAZA todos los datos actuales**

⚠️ **Respaldos recomendados**:
- Semanal: Descarga JSON de respaldo
- Antes de importaciones masivas
- Después de sesiones importantes

---

## 🎯 ROADMAP FUTURO

### Versión 3.1 (Próximo)
- [ ] Edición inline de registros
- [ ] Filtros avanzados por rango de fechas
- [ ] Exportación a PDF
- [ ] Gráficas personalizables

### Versión 3.2
- [ ] Base de datos persistente (Firebase/Supabase)
- [ ] Multi-usuario con roles
- [ ] Notificaciones push
- [ ] API REST

### Versión 4.0
- [ ] Machine Learning para predicciones
- [ ] App móvil nativa
- [ ] Integración con facturación electrónica
- [ ] Dashboard de BI avanzado

---

## 🆘 SOPORTE

### ❓ Preguntas Frecuentes

**P: ¿Puedo usar mi Excel actualizado?**
R: Sí, ejecuta `IMPORTAR-EXCEL.bat` cada vez que actualices el Excel y luego importa en la app.

**P: ¿Se pierden datos al importar?**
R: La importación reemplaza datos actuales. Haz respaldo antes.

**P: ¿Funciona offline?**
R: Sí, una vez cargado, usa localStorage. Requiere internet solo para primera carga.

**P: ¿Puedo agregar nuevos registros?**
R: ¡Sí! Todos los paneles tienen botones "+ Nuevo" para agregar datos.

**P: ¿Cómo actualizo un registro?**
R: Por ahora, elimina y crea nuevo. Edición inline viene en v3.1.

### 🐛 Reportar Problemas

Si encuentras errores:
1. Revisa [GUIA_IMPORTACION_EXCEL.md](./GUIA_IMPORTACION_EXCEL.md)
2. Verifica la consola del navegador (F12)
3. Crea un respaldo antes de cualquier acción

---

## 🎉 CONCLUSIÓN

**FlowDistributor 3.0** es tu Excel en esteroides:
- ✅ Todos los datos importados correctamente
- ✅ Todas las fórmulas automatizadas
- ✅ Interfaz moderna y profesional
- ✅ Sin posibilidad de errores manuales
- ✅ Escalable y preparado para crecer

**¡Adiós Excel, hola FlowDistributor!** 🚀

---

**Versión**: 3.0.0
**Fecha**: 2025-10-20
**Estado**: ✅ Producción - Completamente Funcional
**Datos Importados**: ✅ 80 ventas, 29 clientes, 9 OCs, 6 bancos
