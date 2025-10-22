# 🚀 GUÍA RÁPIDA: COMPONENTES ÉPICOS DE FLOWDISTRIBUTOR

## 📦 UBICACIÓN DE ARCHIVOS

Todos los componentes están en:
```
src/apps/FlowDistributor/components/
├── AnimatedBackground.jsx    # Fondos y efectos visuales
├── GlassCard.jsx             # Cards con glassmorphism
├── AnimatedTransitions.jsx   # 12 tipos de transiciones
├── PremiumModal.jsx          # Modales, drawers, tooltips
├── PremiumLoading.jsx        # Loaders y skeleton screens
├── VirtualizedTable.jsx      # Tabla virtualizada
└── index.js                  # Exportaciones centralizadas
```

---

## 🎯 PASO 1: IMPORTAR COMPONENTES

### Importación individual:
```jsx
import {
  AnimatedBackground,
  CursorGlow,
  GlassCard,
  StatCard,
  PageTransition,
  PremiumModal,
  VirtualizedTable
} from '@/apps/FlowDistributor/components';
```

### O importar todo:
```jsx
import * as FlowComponents from '@/apps/FlowDistributor/components';
```

---

## 🎨 PASO 2: AGREGAR FONDOS ANIMADOS

### En tu componente principal:

```jsx
function FlowDistributor() {
  return (
    <>
      {/* Partículas flotantes en el fondo */}
      <AnimatedBackground variant="particles" />

      {/* Efecto de cursor glow */}
      <CursorGlow />

      {/* Elementos flotantes decorativos */}
      <FloatingElements />

      {/* Tu contenido aquí */}
      <div className="relative z-10">
        {/* ... */}
      </div>
    </>
  );
}
```

**Resultado:** Fondo con partículas conectadas y efecto de brillo siguiendo el cursor.

---

## 💎 PASO 3: USAR GLASS CARDS

### Card básico con glassmorphism:

```jsx
<GlassCard
  variant="primary"  // default, primary, success, warning, danger, purple
  hover              // Efecto hover activado
  glow               // Brillo al hacer hover
  gradient           // Gradiente de fondo
>
  <h3 className="text-white">Mi contenido</h3>
</GlassCard>
```

### Tarjeta de estadística:

```jsx
<StatCard
  title="Capital Total"
  value="$12,861,332"
  icon={DollarSign}
  trend="up"         // "up" o "down"
  trendValue="+15.2%"
  color="blue"       // blue, green, purple, red, yellow
  loading={false}
/>
```

### Tarjeta de métrica con progreso:

```jsx
<MetricCard
  label="Stock Actual"
  value="17"
  maxValue={3000}
  percentage={0.5}
  icon={Package}
  color="yellow"
  showProgress={true}
/>
```

---

## 🎬 PASO 4: AGREGAR TRANSICIONES

### Transición de página:

```jsx
<PageTransition>
  <Dashboard />
</PageTransition>
```

### Lista con animación escalonada:

```jsx
<StaggerContainer staggerDelay={0.1}>
  {items.map((item, index) => (
    <StaggerItem key={index}>
      <ItemCard {...item} />
    </StaggerItem>
  ))}
</StaggerContainer>
```

### Desvanecimiento con deslizamiento:

```jsx
<FadeSlide
  direction="up"    // up, down, left, right
  delay={0.2}
  duration={0.5}
>
  <Content />
</FadeSlide>
```

### Tarjeta con flip 3D:

```jsx
<FlipCard
  front={
    <div className="bg-blue-500 p-6 rounded-xl">
      Frente
    </div>
  }
  back={
    <div className="bg-purple-500 p-6 rounded-xl">
      Reverso
    </div>
  }
/>
```

---

## 🎭 PASO 5: IMPLEMENTAR MODALES

### Modal premium:

```jsx
const [showModal, setShowModal] = useState(false);

<PremiumModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Nueva Transacción"
  size="lg"                    // sm, md, lg, xl, full
  variant="glass"              // default, glass, gradient
  showCloseButton={true}
  closeOnBackdrop={true}
>
  <div className="space-y-4">
    <input className="w-full px-4 py-2 bg-gray-700 rounded-lg" />
    <button className="w-full py-2 bg-blue-500 rounded-lg">
      Guardar
    </button>
  </div>
</PremiumModal>
```

### Drawer lateral:

```jsx
<Drawer
  isOpen={showDrawer}
  onClose={() => setShowDrawer(false)}
  title="Filtros"
  position="right"   // left, right, top, bottom
  width="400px"
>
  <FilterContent />
</Drawer>
```

### Tooltip:

```jsx
<Tooltip
  content="Información adicional"
  position="top"   // top, bottom, left, right
  delay={0}
>
  <button>Hover aquí</button>
</Tooltip>
```

---

## ⏳ PASO 6: ESTADOS DE CARGA

### Loader simple:

```jsx
<PremiumLoader
  variant="spinner"   // spinner, dots, pulse, bars
  size="lg"          // sm, md, lg, xl
/>
```

### Skeleton card:

```jsx
<SkeletonCard
  showImage={true}
  lines={3}
/>
```

### Skeleton table:

```jsx
<SkeletonTable
  rows={5}
  columns={4}
/>
```

### Loading overlay:

```jsx
{isLoading && (
  <LoadingOverlay
    message="Procesando transacción..."
    fullScreen={true}
  />
)}
```

### Progress bar:

```jsx
<ProgressBar
  progress={75}
  variant="success"   // default, success, warning, danger
  showPercentage={true}
/>
```

---

## 📊 PASO 7: TABLA VIRTUALIZADA

```jsx
const columns = [
  {
    key: 'fecha',
    label: 'Fecha',
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    key: 'cliente',
    label: 'Cliente',
  },
  {
    key: 'monto',
    label: 'Monto',
    render: (value) => `$${value.toLocaleString()}`,
  },
  {
    key: 'estado',
    label: 'Estado',
    render: (value) => (
      <span className={`px-2 py-1 rounded ${
        value === 'Pagado' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
      }`}>
        {value}
      </span>
    ),
  },
];

<VirtualizedTable
  data={transactions}
  columns={columns}
  pageSize={50}
  sortable={true}
  searchable={true}
  loading={false}
  onRowClick={(row) => console.log('Clicked:', row)}
/>
```

---

## 🎯 EJEMPLO COMPLETO: DASHBOARD

```jsx
import React, { useState } from 'react';
import {
  AnimatedBackground,
  CursorGlow,
  FloatingElements,
  GlassCard,
  StatCard,
  PageTransition,
  StaggerContainer,
  StaggerItem,
  PremiumModal,
  VirtualizedTable,
  PremiumLoader,
} from '@/apps/FlowDistributor/components';
import { DollarSign, Package, Users, TrendingUp } from 'lucide-react';

function Dashboard() {
  const [showModal, setShowModal] = useState(false);

  const stats = [
    { title: 'Capital Total', value: '$12,861,332', icon: DollarSign, trend: 'up', trendValue: '+15.2%', color: 'green' },
    { title: 'Stock Actual', value: '17 unidades', icon: Package, trend: 'down', trendValue: 'Bajo', color: 'yellow' },
    { title: 'Clientes', value: '31 activos', icon: Users, trend: 'up', trendValue: '+3', color: 'blue' },
    { title: 'Ventas', value: '96 totales', icon: TrendingUp, trend: 'up', trendValue: '+12%', color: 'purple' },
  ];

  return (
    <>
      {/* Efectos de fondo */}
      <AnimatedBackground variant="particles" />
      <CursorGlow />
      <FloatingElements />

      {/* Contenido principal */}
      <PageTransition>
        <div className="relative z-10 p-6 min-h-screen">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Dashboard FlowDistributor
            </h1>
            <p className="text-gray-400">
              Bienvenido a tu sistema de gestión premium
            </p>
          </div>

          {/* Grid de estadísticas */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StaggerItem key={index}>
                <StatCard {...stat} />
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Tabla de transacciones */}
          <GlassCard variant="default" className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">
                Transacciones Recientes
              </h2>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Nueva Transacción
              </button>
            </div>

            <VirtualizedTable
              data={[/* tus datos */]}
              columns={[/* tus columnas */]}
              sortable
              searchable
            />
          </GlassCard>
        </div>
      </PageTransition>

      {/* Modal */}
      <PremiumModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Nueva Transacción"
        size="lg"
        variant="glass"
      >
        <div className="space-y-4">
          {/* Formulario aquí */}
        </div>
      </PremiumModal>
    </>
  );
}

export default Dashboard;
```

---

## 🎨 PERSONALIZACIÓN DE COLORES

Todos los componentes usan estas variantes de color:

```jsx
// Variantes disponibles
variants = {
  default: 'gris',
  primary: 'azul',
  success: 'verde',
  warning: 'amarillo',
  danger: 'rojo',
  purple: 'púrpura',
}
```

Para personalizar, modifica las clases de Tailwind en cada componente.

---

## 📱 RESPONSIVE

Todos los componentes son responsive por defecto. Usa las clases de Tailwind:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* Se adapta automáticamente */}
</div>
```

---

## ⚡ TIPS DE PERFORMANCE

1. **Lazy load** componentes pesados:
```jsx
const VirtualizedTable = lazy(() => import('./components/VirtualizedTable'));
```

2. **Memoizar** datos grandes:
```jsx
const sortedData = useMemo(() => /* ... */, [dependencies]);
```

3. **useCallback** para funciones:
```jsx
const handleClick = useCallback(() => /* ... */, []);
```

---

## 🐛 TROUBLESHOOTING

### Animaciones no funcionan:
- Verifica que Framer Motion esté instalado: `npm install framer-motion`

### Estilos no se aplican:
- Asegúrate de que Tailwind esté configurado correctamente
- Verifica que `backdrop-blur` esté habilitado en `tailwind.config.js`

### Tabla no muestra datos:
- Verifica que el prop `data` sea un array
- Asegúrate de que las `columns` tengan las `keys` correctas

---

## 📚 RECURSOS

- [Documentación completa](./MEJORAS_FLOWDISTRIBUTOR_EPIC.md)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

---

## 🎯 SIGUIENTE PASO

¡Empieza a usar los componentes en tu FlowDistributor!

1. Copia el ejemplo completo de arriba
2. Adapta con tus datos
3. Personaliza colores y efectos
4. ¡Disfruta de tu aplicación épica!

---

**¿Necesitas ayuda?** Revisa la documentación completa en `MEJORAS_FLOWDISTRIBUTOR_EPIC.md`
