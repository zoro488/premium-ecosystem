# 🎨 Sistema de Widgets Flotantes - FlowDistributor

## ✨ Características Implementadas

Sistema moderno de **widgets flotantes arrastables** con diseño premium y funcionalidades avanzadas.

### 🏗️ Arquitectura

```
src/apps/FlowDistributor/components/widgets/
├── FloatingWidget.tsx          # Componente base de widget flotante
├── WidgetManager.tsx           # Gestor central de widgets
├── widgetsConfig.tsx           # Configuración de widgets disponibles
├── WidgetVentasChart.tsx       # Gráfico de evolución de ventas
├── WidgetKPIRealTime.tsx       # KPIs en tiempo real con sparklines
├── WidgetDistribucionBancos.tsx # Distribución de capital por bóveda
└── WidgetAlertasInteligentes.tsx # Sistema de alertas inteligentes
```

## 🎯 FloatingWidget - Componente Base

### Características:
- ✅ **Draggable**: Arrastra los widgets libremente por la pantalla
- ✅ **Estados**: Normal, minimizado, maximizado
- ✅ **Glassmorphism**: Diseño premium con blur y transparencias
- ✅ **Z-index Management**: Sistema automático de apilamiento
- ✅ **Persistencia**: Guarda posición y estado en localStorage
- ✅ **Constraints**: Límites para que no salgan de la pantalla
- ✅ **Animaciones**: Transiciones suaves con Framer Motion

### Props:
```typescript
interface FloatingWidgetProps {
  id: string;                    // ID único del widget
  title: string;                 // Título mostrado en header
  children: React.ReactNode;     // Contenido del widget
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  onClose?: () => void;
  onMinimize?: () => void;
  icon?: React.ReactNode;
  className?: string;
  resizable?: boolean;
  zIndex?: number;
  onFocus?: () => void;
}
```

### Controles:
- **➖ Minimizar**: Reduce el widget solo al header
- **⬜ Maximizar**: Expande el widget a pantalla completa
- **❌ Cerrar**: Cierra y elimina el widget

## 🎛️ WidgetManager - Gestor Central

### Funcionalidades:
- ✅ **Catálogo de Widgets**: Menú flotante con todos los widgets disponibles
- ✅ **Control de Visibilidad**: Abre/cierra widgets desde el catálogo
- ✅ **Z-index Automático**: Gestión inteligente del orden de apilamiento
- ✅ **Persistencia**: Recuerda qué widgets estaban abiertos
- ✅ **Categorías**: Organización por Analytics, Charts, Monitoring, AI
- ✅ **Estado Activo**: Indica qué widgets están abiertos

### Uso:
```jsx
<WidgetManager availableWidgets={availableWidgets}>
  {(activeWidgets, openWidget, closeWidget, focusWidget) => (
    <>
      {activeWidgets.map((widget) => (
        <FloatingWidget
          key={widget.id}
          {...widget}
          onClose={() => closeWidget(widget.id)}
          onFocus={() => focusWidget(widget.id)}
        >
          <widget.component />
        </FloatingWidget>
      ))}
    </>
  )}
</WidgetManager>
```

### Launcher:
- **Botón flotante** en la esquina inferior derecha
- **Catálogo desplegable** con todos los widgets
- **Filtros por categoría**: Analytics, Charts, Monitoring, AI
- **Contador de widgets activos**

## 📊 Widgets Implementados

### 1. WidgetKPIRealTime
**📍 Categoría:** Analytics

**Características:**
- 6 KPIs principales en tiempo real:
  - 💵 Ventas del Mes
  - 📈 Utilidades
  - 💰 Capital Total
  - 🛒 Ventas Pendientes
  - 📦 Stock Almacén
  - 👥 Clientes Activos
- **Sparklines SVG personalizados** mostrando tendencias de 7 días
- **Comparación con mes anterior** con porcentaje de cambio
- **Indicadores visuales** (TrendingUp/Down con colores)
- **Colores distintivos** para cada KPI
- **Animaciones staggered** en entrada

**Datos Calculados:**
- Capital total sumado de todas las bóvedas
- Ventas y utilidades del mes vs mes anterior
- Stock total del almacén
- Clientes activos (con compras en últimos 30 días)

---

### 2. WidgetVentasChart
**📍 Categoría:** Charts

**Características:**
- **Gráfico de área con Recharts** mostrando:
  - Ventas (verde)
  - Utilidades (morado)
  - Fletes (cyan)
- **Filtros de período**: Hoy, Semana, Mes, Año
- **Tooltips personalizados** con glassmorphism
- **Gradientes animados** en las áreas
- **KPI cards** con métricas resumidas:
  - Total de ventas del período
  - Margen de utilidad porcentual
- **Animación escalonada** de las áreas (1000ms, 1200ms, 1400ms)

**Interactividad:**
- Click en filtros para cambiar período
- Hover sobre gráfico muestra tooltip con detalles
- Escala automática del eje Y

---

### 3. WidgetDistribucionBancos
**📍 Categoría:** Charts

**Características:**
- **Gráfico de pastel/donut** con Recharts
- **8 colores distintivos** para cada bóveda
- **Etiquetas con porcentajes** directamente en el gráfico
- **Leyenda personalizada** con:
  - Color identificador
  - Nombre de la bóveda
  - Capital en formato moneda
  - Porcentaje de distribución
- **Tooltips premium** con datos detallados
- **KPI card** con capital total destacado
- **Estadísticas adicionales**:
  - Bóveda con mayor capital
  - Capital promedio

**Análisis:**
- Ordenación automática de mayor a menor capital
- Cálculo de porcentajes de distribución
- Filtrado de bóvedas sin capital

---

### 4. WidgetAlertasInteligentes
**📍 Categoría:** Monitoring

**Características:**
- **Sistema de alertas clasificadas por prioridad**:
  - 🔴 Crítica (rojo)
  - 🟠 Alta (naranja)
  - 🔵 Media (azul)
  - 🟢 Baja (verde)
- **Análisis automático de datos** para generar alertas:
  - Ventas pendientes de cobro
  - Ventas con atraso significativo (>30 días)
  - Stock por debajo del mínimo
  - Bóvedas con capital bajo
  - Margen de utilidad bajo
  - Clientes inactivos (>60 días sin comprar)
  - Productos con mayor demanda
- **Botones de acción rápida** en cada alerta
- **Filtros por prioridad** con contadores
- **Descarte de alertas** (dismiss)
- **Animaciones de entrada/salida** con AnimatePresence

**Inteligencia:**
- Detección automática de patrones
- Umbrales configurables
- Recomendaciones contextuales
- Tiempo real

---

## 🎨 Diseño Visual

### Glassmorphism
Todos los widgets implementan el efecto glassmorphism:
```css
backdropFilter: blur(20px)
backgroundColor: rgba(15, 23, 42, 0.8)
border: 1px solid rgba(148, 163, 184, 0.2)
```

### Colores Premium
- **Indigo-Purple Gradient**: Elementos principales
- **Color coding por tipo**: Verde (positivo), Rojo (negativo), Azul (neutral)
- **Transparencias**: Overlays con opacidad para profundidad

### Animaciones
- **Entrada**: Scale + Fade (0.2s)
- **Hover**: Scale 1.02 + Shadow
- **Drag**: Smooth momentum false
- **Transiciones**: Duration 0.2s ease-in-out

## 📦 Persistencia

### localStorage Keys:
- `widget-{id}`: Estado individual del widget (posición, tamaño, estado)
- `active-widgets`: Array de IDs de widgets activos

### Datos guardados:
```typescript
{
  position: { x: number, y: number },
  size: { width: number, height: number },
  state: 'normal' | 'minimized' | 'maximized'
}
```

## 🚀 Cómo Añadir un Nuevo Widget

### 1. Crear el componente
```typescript
// src/apps/FlowDistributor/components/widgets/WidgetMiNuevo.tsx
import React from 'react';
import { motion } from 'framer-motion';

export const WidgetMiNuevo: React.FC = () => {
  return (
    <div className="h-full">
      {/* Contenido del widget */}
    </div>
  );
};

export default WidgetMiNuevo;
```

### 2. Registrar en widgetsConfig.tsx
```typescript
import WidgetMiNuevo from './WidgetMiNuevo';

export const availableWidgets: WidgetConfig[] = [
  // ... widgets existentes
  {
    id: 'mi-nuevo-widget',
    type: 'custom',
    title: 'Mi Nuevo Widget',
    icon: <Star className="w-5 h-5" />,
    component: WidgetMiNuevo,
    category: 'analytics', // o 'charts', 'monitoring', 'ai'
    defaultPosition: { x: 200, y: 200 },
    defaultSize: { width: 400, height: 300 },
  },
];
```

### 3. Listo! ✅
El widget aparecerá automáticamente en el catálogo y será funcional.

## 📊 Métricas de Performance

### Build Output:
- **FlowDistributor**: 377.34 KB (antes: 308.78 KB sin widgets)
- **Incremento**: +69 KB por sistema completo de widgets
- **vendor-charts**: 765.98 KB (Recharts)
- **Build time**: 14.29s

### Optimizaciones:
- ✅ Lazy loading de componentes
- ✅ useMemo para cálculos pesados
- ✅ AnimatePresence para montaje/desmontaje eficiente
- ✅ SVG sparklines (no imágenes)
- ✅ Persistencia solo en cambios (no en cada render)

## 🎯 Próximas Mejoras

### Potenciales características:
- [ ] Resize handles en las 8 esquinas
- [ ] Snap to grid opcional
- [ ] Widget templates predefinidos
- [ ] Export/Import configuraciones
- [ ] Widget shortcuts (Ctrl+1, Ctrl+2, etc.)
- [ ] Multi-monitor support
- [ ] Widget grouping
- [ ] Custom themes per widget

## 🔧 Troubleshooting

### Widget no se muestra:
1. Verificar que esté en `availableWidgets`
2. Revisar consola por errores de importación
3. Confirmar que el componente exporta default

### Posición se resetea:
1. Verificar que el ID sea único y constante
2. Revisar que localStorage esté habilitado
3. Confirmar que no haya conflictos con otros widgets

### Z-index problems:
- El WidgetManager gestiona automáticamente el z-index
- Al hacer click en un widget, se trae al frente (maxZIndex + 1)
- No manipular z-index manualmente

---

## 📄 Licencia
© 2025 Premium Ecosystem - Todos los derechos reservados

## 👥 Autor
**Premium Ecosystem Team**
GitHub Copilot AI Assistant
