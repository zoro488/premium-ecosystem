# 🛒 Sistema de Gestión de Compras Premium

Sistema completo de gestión de órdenes de compra y distribuidores con diseño premium, widgets interactivos y análisis avanzado.

## 📋 Componentes Principales

### 1. **Panel de Órdenes de Compra** (`PanelOrdenesCompra.jsx`)
Widget flotante interactivo para cada orden con:
- ✨ **Microanimaciones fluidas** con spring physics
- 📊 **Métricas en tiempo real** con barras de progreso animadas
- 🎨 **Glassmorphism design** con gradientes premium
- 🔄 **Expansión al hover** para mostrar detalles completos
- 🤖 **Insights IA** con recomendaciones inteligentes
- 📈 **Análisis comparativo** vs promedio de órdenes
- 🎯 **Estados visuales** con color coding dinámico

#### Características de los Widgets:
```jsx
- Entrada escalonada con delay por índice
- Efecto de brillo horizontal al hover
- Badge de estado con rotación animada
- Icono rotatorio (360°) al hover
- Barra de progreso de pago con shimmer
- Transiciones suaves GPU-accelerated
- Sección expandible con detalles completos
```

### 2. **Panel de Distribuidores** (`PanelDistribuidores.jsx`)
Perfiles interactivos de distribuidores con:
- 👤 **Widgets de perfil premium** con avatar y métricas
- 💳 **Sistema de pagos/abonos** con formulario modal
- 📊 **Dashboard consolidado** desde órdenes
- 📈 **Análisis de tendencias** automático
- 💰 **Tracking de deudas** en tiempo real
- 📋 **Historial expandible** de órdenes por distribuidor
- 🎯 **Estado de pagos visual** con barras de progreso

#### Características de los Perfiles:
```jsx
- Consolidación automática de datos desde órdenes
- Cálculo de tendencias (últimas 3 vs anteriores 3 órdenes)
- Indicadores visuales de deuda
- Sistema de abonos con validación
- Tabla mini de órdenes asociadas
- Filtros y ordenamiento inteligente
```

### 3. **Gestión Integrada** (`GestionCompras.jsx`)
Navegación unificada entre ambos paneles:
- 🧭 **Navegación superior sticky** con tabs animados
- 🔄 **Transiciones suaves** entre vistas
- 🎨 **Indicadores visuales** de vista activa
- 📱 **Responsive design** mobile-first

## 🎨 Diseño y Animaciones

### Paleta de Colores
```javascript
// Estados de Órdenes
pendiente: 'from-yellow-500 to-amber-500'
en_transito: 'from-blue-500 to-cyan-500'
completada: 'from-green-500 to-emerald-500'
cancelada: 'from-red-500 to-rose-500'
parcial: 'from-orange-500 to-amber-500'

// Distribuidores
perfil: 'from-purple-500 to-pink-600'
pagos: 'from-green-500 to-emerald-600'
deuda: 'from-orange-500 to-red-600'
```

### Microanimaciones
- **Entrada**: Spring animation con stagger delay
- **Hover**: Scale 1.02 + elevación -4px
- **Tap**: Scale 0.98 con bounce
- **Expansión**: Height auto con smooth transition
- **Barras de progreso**: Width animado con shimmer effect
- **Badges**: Rotate + scale entrance

## 📊 Estructura de Datos

### Orden de Compra
```typescript
{
  id: string;
  oc: string;          // Identificador único
  fecha: string;       // ISO date
  origen: string;      // Origen de compra
  distribuidor: string;
  cantidad: number;
  costoDistribuidor: number;
  costoTransporte: number;
  costoPorUnidad: number;
  costoTotal: number;
  pagoDistribuidor: number;
  deuda: number;
  estado: 'pendiente' | 'en_transito' | 'completada' | 'cancelada' | 'parcial';
  notas?: string;
}
```

### Distribuidor (Consolidado)
```typescript
{
  id: string;
  nombre: string;
  costoTotal: number;
  abonos: number;
  pendiente: number;
  ordenesTotal: number;
  unidadesTotales: number;
  ultimaOrden: string;
  ordenes: Orden[];
  promedioPorOrden: number;
  tendencia: 'up' | 'down' | 'neutral';
}
```

## 🚀 Uso

### Integración Básica
```jsx
import GestionCompras from './components/GestionCompras';

function App() {
  return <GestionCompras />;
}
```

### Uso Individual de Paneles
```jsx
// Solo Órdenes
import PanelOrdenesCompra from './components/PanelOrdenesCompra';

// Solo Distribuidores
import PanelDistribuidores from './components/PanelDistribuidores';
```

## 🔧 Funcionalidades

### Panel de Órdenes
1. **Vista Tabla** (Grid/Lista)
   - Widgets flotantes interactivos
   - Filtros por distribuidor, estado, búsqueda
   - Ordenamiento múltiple
   - Toggle entre vista grid y lista

2. **Vista Analytics** (En desarrollo)
   - Gráficos de tendencias
   - Análisis comparativo
   - Métricas avanzadas

3. **Vista Insights IA** (En desarrollo)
   - Predicciones
   - Recomendaciones automáticas
   - Análisis de patrones

### Panel de Distribuidores
1. **Vista Perfiles**
   - Widgets de perfil interactivos
   - Sistema de pagos/abonos
   - Historial de órdenes expandible
   - Métricas consolidadas

2. **Vista Analytics** (En desarrollo)
   - Comparativas entre distribuidores
   - Gráficos de costos
   - Análisis de rendimiento

## 💳 Sistema de Pagos

### Modal de Abono
```jsx
Campos:
- Monto (validado contra saldo pendiente)
- Tipo de pago (efectivo, transferencia, cheque, tarjeta)
- Fecha del pago
- Concepto/Notas

Validaciones:
- Monto > 0
- Monto <= Saldo Pendiente
- Cálculo automático de nuevo saldo
```

## 📈 KPIs Principales

### Órdenes de Compra
- Total de órdenes
- Total invertido
- Unidades totales
- Deuda total
- Costo promedio por orden
- Costo promedio por unidad

### Distribuidores
- Distribuidores activos
- Costo total general
- Abonos realizados
- Pendiente total
- Promedio por orden
- Tendencias de compra

## 🎯 Mejores Prácticas

### Performance
- Uso de `useMemo` para cálculos pesados
- `AnimatePresence` para transiciones suaves
- Layout mode para GPU acceleration
- Virtualización para listas largas (futuro)

### UX
- Feedback visual inmediato
- Estados de loading (futuro)
- Confirmaciones para acciones destructivas
- Tooltips informativos
- Responsive en todos los breakpoints

### Accesibilidad
- Keyboard navigation
- ARIA labels
- Focus states visibles
- Contrast ratios WCAG AA
- Screen reader friendly

## 🔄 Sincronización

Los datos se sincronizan automáticamente entre paneles:
- Las órdenes alimentan los datos de distribuidores
- Los abonos actualizan las órdenes relacionadas
- Cálculos en tiempo real sin recargas

## 📱 Responsive Design

```css
Breakpoints:
- Mobile: < 768px (1 columna)
- Tablet: 768px - 1024px (2 columnas)
- Desktop: > 1024px (3-4 columnas en grid)
```

## 🎨 Personalización

### Colores
Edita los gradientes en cada componente:
```jsx
color: 'from-cyan-500 to-blue-600'
```

### Animaciones
Ajusta los parámetros de spring:
```jsx
transition={{
  type: 'spring',
  stiffness: 300,
  damping: 25
}}
```

### Layout
Cambia entre grid y lista:
```jsx
layoutMode: 'grid' | 'list'
```

## 🚧 Roadmap

### Próximas Funcionalidades
- [ ] Vista Analytics completa con Recharts
- [ ] Insights IA con predicciones
- [ ] Exportar a Excel/PDF
- [ ] Filtros avanzados por rango de fechas
- [ ] Modo dark/light
- [ ] Notificaciones push para deudas
- [ ] Integración con backend
- [ ] Sistema de comentarios en órdenes
- [ ] Adjuntar archivos (facturas, comprobantes)
- [ ] Historial de cambios/auditoría

## 🛠️ Dependencias

```json
{
  "framer-motion": "^10.x",
  "lucide-react": "^0.x",
  "react": "^18.x"
}
```

## 📝 Notas de Implementación

1. **LocalStorage**: Los datos se persisten automáticamente
2. **Consolidación**: Los distribuidores se generan dinámicamente desde órdenes
3. **Validación**: Usa Zod schemas (ver `ordenesCompra.types.js`)
4. **Formateo**: Funciones de formato en utilities

## 🎓 Ejemplos de Uso

### Crear Nueva Orden
```jsx
const nuevaOrden = {
  oc: 'OC0010',
  fecha: '2025-10-23',
  origen: 'Q-MAYA',
  distribuidor: 'Q-MAYA',
  cantidad: 500,
  costoDistribuidor: 6100,
  costoTransporte: 200,
  // ... campos calculados automáticamente
};
```

### Registrar Abono
```jsx
const abono = {
  distribuidor: 'PACMAN',
  monto: 50000,
  tipoPago: 'transferencia',
  concepto: 'Pago parcial OC0008',
  fecha: '2025-10-23'
};
```

## 🐛 Troubleshooting

### Los widgets no se animan
- Verifica que `framer-motion` esté instalado
- Revisa que no haya errores en consola

### Los datos no persisten
- Verifica localStorage en DevTools
- Revisa las keys en `storageKeys.js`

### El scrollbar no se ve
- Importa `PanelDistribuidores.css`
- Verifica que la clase `custom-scrollbar` esté aplicada

---

**Desarrollado con ❤️ para FlowDistributor Premium**

Sistema de gestión empresarial de próxima generación con diseño moderno, animaciones fluidas y experiencia de usuario excepcional.
