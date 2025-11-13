# 🎨 CHRONOS DESIGN SYSTEM - Documentación Completa

## 📋 Tabla de Contenidos
- [Introducción](#introducción)
- [Instalación](#instalación)
- [Componentes Core](#componentes-core)
- [Componentes UI](#componentes-ui)
- [Sistema de Tema](#sistema-de-tema)
- [Animaciones](#animaciones)
- [Utilidades](#utilidades)
- [Ejemplos de Uso](#ejemplos-de-uso)

---

## 🚀 Introducción

CHRONOS es el sistema de diseño unificado para FlowDistributor, creado con principios de:
- **Minimalismo Premium**: Diseño limpio, negro/blanco, sin excesos
- **Microanimaciones**: Interacciones sutiles y fluidas
- **Performance**: Optimizado con GPU acceleration
- **Consistencia**: Componentes reutilizables en todo el sistema

### Filosofía de Diseño
- Fondo negro (#000000)
- Elementos blancos (#FFFFFF)
- Glassmorphism sutil
- Tipografía Helvetica Neue
- Animaciones con GSAP + Framer Motion

---

## 📦 Instalación

```javascript
// Importar todo el sistema
import {
  ChronosLogo,
  ChronosHeader,
  ChronosPanelContainer,
  ChronosCard,
  ChronosStatCard,
  ChronosTable,
  ChronosButton,
  ChronosInput,
  ChronosBadge,
  ChronosTabs,
  ChronosProgress,
  ChronosTheme,
  ChronosAnimations,
  ChronosUtils
} from './components/shared';
```

---

## 🎯 Componentes Core

### ChronosLogo
Logo orbital animado con 3 anillos y rotación continua.

```jsx
import { ChronosLogo } from './components/shared';

<ChronosLogo
  size="md" // sm, md, lg, xl
  animated={true}
/>
```

**Tamaños disponibles:**
- `sm`: 12px (para headers)
- `md`: 24px (para tarjetas)
- `lg`: 48px (para splash screens)
- `xl`: 96px (para pantallas completas)

---

### ChronosHeader
Header unificado para todos los paneles.

```jsx
<ChronosHeader
  title="DASHBOARD"
  subtitle="Financial Control System"
  showSearch={true}
  searchPlaceholder="Search transactions..."
  onSearchChange={(query) => console.log(query)}
  notificationCount={5}
  onNotificationClick={() => {}}
  onRefresh={() => {}}
  customActions={
    <ChronosButton variant="ghost" size="sm">
      Export
    </ChronosButton>
  }
/>
```

**Props:**
- `title`: string - Título principal
- `subtitle`: string - Subtítulo opcional
- `showSearch`: boolean - Mostrar barra de búsqueda
- `showActions`: boolean - Mostrar botones de acción
- `notificationCount`: number - Número de notificaciones
- `customActions`: ReactNode - Acciones personalizadas

---

### ChronosPanelContainer
Contenedor base para todos los paneles con grid animado y partículas.

```jsx
<ChronosPanelContainer showParticles={true}>
  {/* Contenido del panel */}
</ChronosPanelContainer>
```

**Features:**
- Grid de fondo animado (40s loop)
- 30 partículas flotantes opcionales
- Animación de entrada (fade + slide up)
- Background negro sólido

---

### ChronosCard
Card premium con glassmorphism y microanimaciones.

```jsx
<ChronosCard
  title="Bank Status"
  subtitle="Real-time overview"
  icon={Building2}
  onClick={() => navigate('/banks')}
  hoverable={true}
  glowOnHover={true}
  index={0} // Para stagger animation
>
  {/* Contenido */}
</ChronosCard>
```

**Effects:**
- Hover: scale 1.02, y -4px
- Shine sweep (3s delay, 5s repeat)
- Glow radial en hover
- Border gradient
- Index delay para stagger (index * 0.05s)

---

### ChronosStatCard
Card especializada para KPIs con trend indicator.

```jsx
<ChronosStatCard
  title="Total Capital"
  value="$250,000"
  icon={DollarSign}
  trend={8.5} // positivo = verde, negativo = rojo
  trendLabel="vs last month"
  color="#10B981"
  index={0}
/>
```

**Features:**
- Icon rotatorio en hover (360°)
- Value animado con counter
- Trend arrow animado (bounce)
- Background glow del color especificado
- Shine effect automático

---

### ChronosTable
Tabla premium con row hover y animaciones.

```jsx
<ChronosTable
  headers={['Name', 'Amount', 'Date', 'Status']}
  data={transactions}
  onRowClick={(row) => console.log(row)}
  hoverable={true}
  striped={false}
  renderCell={(row, header, index) => {
    if (header === 'Status') {
      return <ChronosBadge variant="success">{row.status}</ChronosBadge>;
    }
    return row[header];
  }}
/>
```

**Features:**
- Headers con stagger (delay * 0.05s)
- Rows con slide in from left
- Hover: bg white/5%, scale 1.01
- Custom cell rendering
- Empty state automático
- Striped rows opcional

---

### ChronosTableCard
Tabla envuelta en card con título y acciones.

```jsx
<ChronosTableCard
  title="Recent Transactions"
  subtitle="Last 7 days"
  icon={TrendingUp}
  actions={
    <ChronosButton variant="ghost" size="sm" icon={Plus}>
      Add New
    </ChronosButton>
  }
  headers={['Type', 'Amount', 'Date']}
  data={data}
/>
```

---

## 🎨 Componentes UI

### ChronosButton
Botón premium con 4 variantes y loading state.

```jsx
<ChronosButton
  variant="primary" // primary, secondary, ghost, danger
  size="md" // sm, md, lg
  icon={Plus}
  iconPosition="left" // left, right
  onClick={() => {}}
  disabled={false}
  loading={false}
  fullWidth={false}
>
  Click Me
</ChronosButton>
```

**Variantes:**
- `primary`: Blanco con texto negro, shadow glow
- `secondary`: White/10 con border
- `ghost`: Transparente con border sutil
- `danger`: Red/20 con border rojo

**Effects:**
- Hover: scale 1.02, y -2px
- Tap: scale 0.98
- Loading: spinner rotatorio
- Shine sweep automático

---

### ChronosInput
Input premium con icon y validación.

```jsx
<ChronosInput
  type="text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Enter amount..."
  icon={DollarSign}
  label="Amount"
  error={error}
/>
```

**Features:**
- Focus: border white/30, glow effect
- Error: border red/30, mensaje en rojo
- Icon animado (color change en focus)
- Label opcional
- Glow shadow en focus

---

### ChronosModal
Modal premium con backdrop blur.

```jsx
<ChronosModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  subtitle="This action cannot be undone"
  size="md" // sm, md, lg, xl
  showClose={true}
>
  {/* Contenido del modal */}
</ChronosModal>
```

**Effects:**
- Backdrop: blur-xl, bg-black/60
- Modal: scale 0.9 → 1, y 20 → 0
- Close button: rotate 90° en hover
- Shadow premium con blur

---

### ChronosBadge
Badge pequeño con variantes y pulse.

```jsx
<ChronosBadge
  variant="success" // default, success, warning, danger, info
  size="md" // sm, md, lg
  pulse={true}
>
  Active
</ChronosBadge>
```

**Features:**
- Scale 0 → 1 en mount
- Pulse dot opcional (scale + opacity loop)
- Border colored según variante
- Rounded full

---

### ChronosTabs
Tabs horizontales con active indicator animado.

```jsx
<ChronosTabs
  tabs={[
    { id: 'overview', label: 'Overview' },
    { id: 'sales', label: 'Sales', badge: 3 }
  ]}
  activeTab={activeTab}
  onChange={setActiveTab}
/>
```

**Features:**
- Active indicator con layoutId (smooth transition)
- Hover: y -2px
- Badge opcional en esquina
- Bottom border line

---

### ChronosProgress
Barra de progreso con gradiente y shine.

```jsx
<ChronosProgress
  value={75}
  max={100}
  label="Completion"
  showValue={true}
  color="rgba(16, 185, 129, 1)"
  height={8}
/>
```

**Effects:**
- Width animation (0 → value%)
- Shine sweep (1.5s loop)
- Gradient fill
- Label + percentage display

---

### ChronosTooltip
Tooltip premium con posicionamiento.

```jsx
<ChronosTooltip
  content="Click to view details"
  position="top" // top, bottom, left, right
>
  <button>Hover me</button>
</ChronosTooltip>
```

**Features:**
- Scale 0.9 → 1 en show
- Arrow dinámico según position
- Backdrop blur
- Border white/20

---

## 🎨 Sistema de Tema

### ChronosTheme
Constantes de colores, fuentes, espaciados.

```javascript
import { ChronosTheme } from './components/shared';

const { colors, fonts, spacing, shadows } = ChronosTheme;

// Uso
<div style={{
  background: colors.background,
  fontFamily: fonts.primary,
  padding: spacing.lg
}}>
  Content
</div>
```

**Colores disponibles:**
- `background`: #000000
- `foreground`: #FFFFFF
- `primary`: rgba(255, 255, 255, 0.9)
- `secondary`: rgba(255, 255, 255, 0.6)
- `success`: #10B981
- `warning`: #F59E0B
- `danger`: #EF4444
- `info`: #3B82F6

---

## ✨ Animaciones

### ChronosAnimations
Presets de animaciones comunes.

```javascript
import { motion } from 'framer-motion';
import { ChronosAnimations } from './components/shared';

<motion.div {...ChronosAnimations.fadeIn}>
  Fade In
</motion.div>

<motion.div {...ChronosAnimations.slideUp}>
  Slide Up
</motion.div>

<motion.div {...ChronosAnimations.scaleIn}>
  Scale In
</motion.div>
```

**Presets disponibles:**
- `fadeIn`: opacity 0 → 1
- `slideUp`: opacity 0, y 20 → opacity 1, y 0
- `scaleIn`: opacity 0, scale 0.9 → opacity 1, scale 1
- `slideInFromRight`: x 100 → 0
- `slideInFromLeft`: x -100 → 0

---

## 🛠 Utilidades

### ChronosUtils
Funciones helper comunes.

```javascript
import { ChronosUtils } from './components/shared';

// Format currency
ChronosUtils.formatCurrency(250000); // "$250,000.00"
ChronosUtils.formatCurrency(250000, 'EUR'); // "€250,000.00"

// Format number
ChronosUtils.formatNumber(1234.5678, 2); // "1,234.57"

// Format date
ChronosUtils.formatDate('2025-11-07', 'short'); // "Nov 7, 2025"
ChronosUtils.formatDate('2025-11-07', 'long'); // "Thursday, November 7, 2025"

// Calculate percentage
ChronosUtils.calculatePercentage(75, 100); // "75.0"

// Truncate text
ChronosUtils.truncate("Very long text here...", 10); // "Very long..."
```

---

## 📚 Ejemplos de Uso

### Dashboard Completo

```jsx
import {
  ChronosHeader,
  ChronosPanelContainer,
  ChronosStatCard,
  ChronosTableCard,
  ChronosTabs,
  ChronosButton,
  ChronosUtils
} from './components/shared';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <ChronosPanelContainer>
      <ChronosHeader
        title="DASHBOARD"
        subtitle="Real-time overview"
        onSearchChange={(q) => console.log(q)}
        notificationCount={3}
      />

      <div className="p-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          <ChronosStatCard
            title="Total Sales"
            value={ChronosUtils.formatCurrency(125000)}
            icon={DollarSign}
            trend={12.5}
            index={0}
          />
          {/* Más stats... */}
        </div>

        {/* Tabs */}
        <ChronosTabs
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'details', label: 'Details' }
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Table */}
        <ChronosTableCard
          title="Recent Activity"
          icon={Activity}
          headers={['Type', 'Amount', 'Date']}
          data={transactions}
        />
      </div>
    </ChronosPanelContainer>
  );
};
```

### Form Modal

```jsx
import {
  ChronosModal,
  ChronosInput,
  ChronosButton
} from './components/shared';

const AddTransactionModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  return (
    <ChronosModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Transaction"
      subtitle="Fill in the details"
      size="md"
    >
      <div className="space-y-4">
        <ChronosInput
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          icon={DollarSign}
          placeholder="0.00"
        />

        <ChronosInput
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description..."
        />

        <div className="flex gap-3">
          <ChronosButton
            variant="primary"
            fullWidth
            onClick={() => {}}
          >
            Save
          </ChronosButton>

          <ChronosButton
            variant="ghost"
            fullWidth
            onClick={onClose}
          >
            Cancel
          </ChronosButton>
        </div>
      </div>
    </ChronosModal>
  );
};
```

---

## 🎯 Best Practices

1. **Consistencia**: Usar siempre los componentes CHRONOS, no crear variaciones custom
2. **Performance**: Usar `index` prop para stagger animations en listas
3. **Colores**: Usar ChronosTheme.colors en lugar de hardcodear
4. **Spacing**: Usar Tailwind spacing (p-4, gap-6, etc.)
5. **Animaciones**: No abusar, mantener sutileza
6. **Loading States**: Siempre proveer loading en botones/forms
7. **Responsive**: Usar grid responsive (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)

---

## 📱 Responsive Design

Todos los componentes CHRONOS son responsive por defecto:

```jsx
// Stats grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <ChronosStatCard {...} />
</div>

// Table responsive
<ChronosTableCard> {/* Scroll horizontal automático */}
  <ChronosTable {...} />
</ChronosTableCard>

// Modal responsive
<ChronosModal size="lg"> {/* Se adapta a mobile */}
  Content
</ChronosModal>
```

---

## 🚀 Roadmap

- [ ] Dark/Light mode toggle
- [ ] Export to PDF components
- [ ] Chart components con CHRONOS styling
- [ ] Date picker premium
- [ ] File upload con drag & drop
- [ ] Advanced filters panel
- [ ] Real-time notifications panel

---

## 📞 Soporte

Para dudas o issues con el sistema CHRONOS:
1. Revisar esta documentación
2. Ver ejemplos en `ChronosDashboard.jsx`
3. Consultar `shared/index.js` para exports disponibles

**Diseñado y desarrollado con ❤️ para FlowDistributor**
