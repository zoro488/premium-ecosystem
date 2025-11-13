# 🌟 Premium Components Guide

## Tabla de Contenidos
1. [Componentes de UI](#componentes-de-ui)
2. [Componentes de Layout](#componentes-de-layout)
3. [Componentes de Animación](#componentes-de-animación)
4. [Custom Hooks de Performance](#custom-hooks-de-performance)
5. [Sistema de Toasts](#sistema-de-toasts)
6. [Testing E2E](#testing-e2e)
7. [Routing System](#routing-system)

---

## 📦 Componentes de UI

### DataCard
**Ubicación:** `src/components/premium/ui/DataCard.jsx`

Tarjeta premium para mostrar KPIs con animaciones y múltiples variantes de color.

#### Características
- 6 variantes de color (blue, green, purple, orange, red, pink)
- Indicador de tendencia con porcentaje
- Badge opcional
- Estado de loading con skeleton
- Animaciones al hover (scale, lift, icon rotation)
- Glow effects

#### Uso Básico
```jsx
import { DataCard, DataCardGrid, DataCardSkeleton } from '@/components/premium/ui/DataCard';
import { TrendingUp } from 'lucide-react';

// Card individual
<DataCard
  title="Total Ventas"
  value="$125,450"
  icon={TrendingUp}
  variant="blue"
  trend={{ value: 12.5, isPositive: true }}
  subtitle="Últimos 30 días"
  badge="Top Performer"
  onClick={() => console.log('Card clicked')}
/>

// Grid con múltiples cards
<DataCardGrid>
  <DataCard title="Ventas" value="$100K" variant="blue" />
  <DataCard title="Clientes" value="450" variant="green" />
  <DataCard title="Inventario" value="$50K" variant="purple" />
</DataCardGrid>

// Skeleton loading
<DataCardSkeleton count={3} />
```

#### Props
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `title` | string | - | Título de la tarjeta |
| `value` | string/number | - | Valor principal a mostrar |
| `icon` | Component | - | Icono de Lucide React |
| `variant` | string | 'blue' | Color: blue, green, purple, orange, red, pink |
| `trend` | object | - | `{ value: number, isPositive: boolean }` |
| `subtitle` | string | - | Subtítulo descriptivo |
| `badge` | string | - | Badge opcional |
| `loading` | boolean | false | Mostrar skeleton |
| `onClick` | function | - | Handler de click |

---

### StatusBadge
**Ubicación:** `src/components/premium/ui/StatusBadge.jsx`

Sistema de badges para indicadores de estado con animaciones.

#### Características
- 7 variantes (success, error, warning, info, pending, active, inactive)
- 3 tamaños (sm, md, lg)
- Animación de pulso opcional
- Glow effects
- Tooltips opcionales
- Soporte para clicks

#### Uso Básico
```jsx
import {
  StatusBadge,
  StatusBadgeGroup,
  CountBadge,
  ProgressBadge
} from '@/components/premium/ui/StatusBadge';

// Badge simple
<StatusBadge variant="success" label="Activo" />

// Con animación de pulso
<StatusBadge variant="pending" label="En proceso" pulse />

// Con tooltip
<StatusBadge
  variant="warning"
  label="Alerta"
  tooltip="Requiere atención"
/>

// Grupo de badges
<StatusBadgeGroup>
  <StatusBadge variant="success" label="Pagado" />
  <StatusBadge variant="pending" label="Pendiente" />
</StatusBadgeGroup>

// Badge de conteo (notificaciones)
<CountBadge count={5} variant="error" />

// Badge con barra de progreso
<ProgressBadge
  progress={75}
  label="Completado"
  variant="success"
/>
```

#### Props
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `variant` | string | 'info' | success, error, warning, info, pending, active, inactive |
| `label` | string | - | Texto del badge |
| `size` | string | 'md' | sm, md, lg |
| `pulse` | boolean | false | Animación de pulso |
| `glow` | boolean | true | Efecto de brillo |
| `tooltip` | string | - | Tooltip al hover |
| `onClick` | function | - | Handler de click |

---

### SmartTable
**Ubicación:** `src/components/premium/ui/SmartTable.jsx`

Tabla avanzada con búsqueda, filtros, ordenamiento, paginación y exportación.

#### Características
- Búsqueda global en todas las columnas
- Filtros por columna
- Ordenamiento multi-columna
- Paginación con tamaño customizable
- Selección de filas con checkboxes
- Exportar a CSV
- Render custom de celdas
- Skeleton loading
- Estado vacío con iconos
- Responsive con scroll horizontal

#### Uso Básico
```jsx
import SmartTable from '@/components/premium/ui/SmartTable';
import { User, Mail, Calendar } from 'lucide-react';

const columns = [
  {
    key: 'name',
    label: 'Cliente',
    sortable: true,
    filterable: true,
    render: (value, row) => (
      <div className="flex items-center gap-2">
        <User className="w-4 h-4" />
        <span>{value}</span>
      </div>
    )
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
    filterable: true
  },
  {
    key: 'date',
    label: 'Fecha',
    sortable: true
  },
  {
    key: 'amount',
    label: 'Monto',
    sortable: true,
    render: (value) => `$${value.toLocaleString()}`
  }
];

const data = [
  { id: 1, name: 'Juan Pérez', email: 'juan@email.com', date: '2024-01-15', amount: 1500 },
  { id: 2, name: 'María García', email: 'maria@email.com', date: '2024-01-16', amount: 2300 },
  // ...más datos
];

<SmartTable
  data={data}
  columns={columns}
  title="Ventas Recientes"
  searchPlaceholder="Buscar en ventas..."
  emptyMessage="No hay ventas registradas"
  emptyIcon={Mail}
  onRowClick={(row) => console.log('Row clicked:', row)}
  exportFilename="ventas_export"
  pageSize={10}
/>
```

#### Props de Columnas
| Prop | Tipo | Descripción |
|------|------|-------------|
| `key` | string | Clave del dato (requerido) |
| `label` | string | Encabezado de columna |
| `sortable` | boolean | Habilitar ordenamiento |
| `filterable` | boolean | Habilitar filtro |
| `render` | function | Render custom `(value, row) => JSX` |

#### Props de Tabla
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `data` | array | [] | Datos a mostrar |
| `columns` | array | [] | Configuración de columnas |
| `title` | string | - | Título de la tabla |
| `searchPlaceholder` | string | 'Buscar...' | Placeholder del buscador |
| `emptyMessage` | string | 'No hay datos' | Mensaje cuando está vacía |
| `emptyIcon` | Component | - | Icono para estado vacío |
| `onRowClick` | function | - | Handler de click en fila |
| `exportFilename` | string | 'export' | Nombre del archivo CSV |
| `pageSize` | number | 10 | Filas por página |
| `loading` | boolean | false | Mostrar skeleton |

---

## 🏗️ Componentes de Layout

### PremiumLayout
**Ubicación:** `src/components/premium/layout/PremiumLayout.jsx`

Layout maestro que combina Header + Sidebar + Background cósmico.

#### Características
- Header con búsqueda Cmd+K, notificaciones, user menu
- Sidebar colapsable con glassmorphism
- Background animado con estrellas y gradientes
- Integración con React Router (Outlet)
- State management para sidebar

#### Uso
```jsx
import { PremiumLayout } from '@/components/premium/layout/PremiumLayout';

<PremiumLayout
  user={{
    name: 'Juan Pérez',
    email: 'juan@chronos.com',
    avatar: 'https://...'
  }}
  notifications={[
    { id: 1, title: 'Nueva venta', message: 'Venta #1234 completada', time: '5m', unread: true },
    { id: 2, title: 'Recordatorio', message: 'Pago pendiente cliente #45', time: '1h', unread: false }
  ]}
  menuItems={[
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/', badge: null },
    { id: 'ventas', label: 'Ventas', icon: 'TrendingUp', path: '/ventas', badge: 5 },
    // ...más items
  ]}
  quickActions={[
    { id: 'new-sale', label: 'Nueva Venta', icon: 'Plus', onClick: () => {} },
    { id: 'export', label: 'Exportar', icon: 'Download', onClick: () => {} }
  ]}
  onSearch={(query) => console.log('Search:', query)}
  onLogout={() => console.log('Logout')}
  showSidebar={true}
  sidebarCollapsed={false}
  onSidebarCollapse={(collapsed) => console.log('Collapsed:', collapsed)}
/>
```

---

### UltraHeader
**Ubicación:** `src/components/premium/layout/UltraHeader.jsx`

Header premium con búsqueda avanzada, notificaciones y breadcrumbs.

#### Características
- Búsqueda con Cmd+K / Ctrl+K (modal)
- Dropdown de notificaciones con badge de no leídas
- User menu (perfil, configuración, logout)
- Dark mode toggle
- Breadcrumbs automáticos desde URL
- Quick actions bar
- Glassmorphism con scroll detection
- ChronosLogoIcon integrado

#### Props Principales
```jsx
<UltraHeader
  user={{ name, email, avatar }}
  notifications={[...]}
  onSearch={(query) => {}}
  onNotificationClick={(notif) => {}}
  onLogout={() => {}}
  quickActions={[...]}
  darkMode={false}
  onDarkModeToggle={() => {}}
/>
```

---

### UltraSidebar
**Ubicación:** `src/components/premium/layout/UltraSidebar.jsx`

Sidebar colapsable con búsqueda integrada y submenús expandibles.

#### Características
- Glassmorphism background
- Animación de colapso/expansión
- Búsqueda de items integrada
- Submenús expandibles
- Tooltips en modo colapsado
- Estado activo con glow
- CHRONOS branding
- Badge de notificaciones por item

#### Props Principales
```jsx
<UltraSidebar
  items={[
    {
      id: 'ventas',
      label: 'Ventas',
      icon: 'TrendingUp',
      path: '/ventas',
      badge: 5,
      subItems: [
        { id: 'nueva-venta', label: 'Nueva Venta', path: '/ventas/nueva' },
        { id: 'historial', label: 'Historial', path: '/ventas/historial' }
      ]
    }
  ]}
  collapsed={false}
  onCollapse={(collapsed) => {}}
  activePath="/ventas"
/>
```

---

## 🎬 Componentes de Animación

### AdvancedAnimations
**Ubicación:** `src/components/premium/animations/AdvancedAnimations.jsx`

14 componentes de animación avanzados para UX premium.

#### PageTransition
Transición entre páginas con fade + slide.

```jsx
import { PageTransition } from '@/components/premium/animations/AdvancedAnimations';

<PageTransition>
  <YourPageContent />
</PageTransition>
```

#### MagneticButton
Botón con efecto de atracción magnética al hover.

```jsx
import { MagneticButton } from '@/components/premium/animations/AdvancedAnimations';

<MagneticButton strength={30}>
  <button className="px-6 py-3 bg-blue-500 rounded-lg">
    Click Me
  </button>
</MagneticButton>
```

#### FloatingElement
Elemento con animación de flotación continua.

```jsx
import { FloatingElement } from '@/components/premium/animations/AdvancedAnimations';

<FloatingElement duration={3} distance={20}>
  <div className="p-4 bg-white rounded-lg shadow-xl">
    <h3>Floating Card</h3>
  </div>
</FloatingElement>
```

#### Card3DTilt
Tarjeta con efecto 3D que sigue el mouse.

```jsx
import { Card3DTilt } from '@/components/premium/animations/AdvancedAnimations';

<Card3DTilt intensity={15}>
  <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-500">
    <h3>3D Card</h3>
  </div>
</Card3DTilt>
```

#### ParallaxScroll
Efecto parallax con múltiples capas.

```jsx
import { ParallaxScroll } from '@/components/premium/animations/AdvancedAnimations';

<ParallaxScroll baseSpeed={0.5}>
  <div className="text-center py-20">
    <h1 className="text-6xl">Parallax Title</h1>
  </div>
</ParallaxScroll>
```

#### TextReveal
Texto que se revela palabra por palabra con stagger.

```jsx
import { TextReveal } from '@/components/premium/animations/AdvancedAnimations';

<TextReveal text="Welcome to CHRONOS System" staggerDelay={0.05} />
```

#### GlowCursor
Cursor custom con efecto de brillo que sigue el mouse.

```jsx
import { GlowCursor } from '@/components/premium/animations/AdvancedAnimations';

<GlowCursor color="rgb(59, 130, 246)" size={400} />
```

#### ShimmerEffect
Efecto shimmer animado (ideal para loading states).

```jsx
import { ShimmerEffect } from '@/components/premium/animations/AdvancedAnimations';

<ShimmerEffect>
  <div className="h-20 bg-slate-200 rounded-lg" />
</ShimmerEffect>
```

#### StaggerContainer
Contenedor con animación stagger para hijos.

```jsx
import { StaggerContainer } from '@/components/premium/animations/AdvancedAnimations';

<StaggerContainer staggerDelay={0.1}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</StaggerContainer>
```

#### ScaleOnHover
Efecto de escala suave al hacer hover.

```jsx
import { ScaleOnHover } from '@/components/premium/animations/AdvancedAnimations';

<ScaleOnHover scale={1.05}>
  <button className="px-4 py-2 bg-blue-500">
    Hover Me
  </button>
</ScaleOnHover>
```

#### SlideInView
Animación de entrada cuando el elemento es visible (Intersection Observer).

```jsx
import { SlideInView } from '@/components/premium/animations/AdvancedAnimations';

<SlideInView direction="left" delay={0.2}>
  <div className="p-6">
    <h3>Slide In Content</h3>
  </div>
</SlideInView>
```

#### AnimatedGradientText
Texto con gradiente animado.

```jsx
import { AnimatedGradientText } from '@/components/premium/animations/AdvancedAnimations';

<AnimatedGradientText
  text="Premium Feature"
  colors={['#3b82f6', '#8b5cf6', '#ec4899']}
  className="text-4xl font-bold"
/>
```

#### BounceOnLoad
Animación de rebote al cargar (ideal para iconos).

```jsx
import { BounceOnLoad } from '@/components/premium/animations/AdvancedAnimations';
import { Sparkles } from 'lucide-react';

<BounceOnLoad delay={0.5}>
  <Sparkles className="w-12 h-12 text-yellow-500" />
</BounceOnLoad>
```

#### Typewriter
Efecto de escritura automática.

```jsx
import { Typewriter } from '@/components/premium/animations/AdvancedAnimations';

<Typewriter
  text="Sistema de gestión empresarial..."
  speed={50}
  cursor={true}
  onComplete={() => console.log('Done!')}
/>
```

---

## ⚡ Custom Hooks de Performance

### PerformanceOptimizations
**Ubicación:** `src/utils/PerformanceOptimizations.js`

15 custom hooks para optimización de rendimiento.

#### useDebounce
Retrasa la actualización de un valor (ideal para búsquedas).

```jsx
import { useDebounce } from '@/utils/PerformanceOptimizations';

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  // Se ejecuta 500ms después del último cambio
  fetchResults(debouncedSearch);
}, [debouncedSearch]);
```

#### useThrottle
Limita la frecuencia de ejecución de una función.

```jsx
import { useThrottle } from '@/utils/PerformanceOptimizations';

const handleScroll = useThrottle((event) => {
  console.log('Scroll event:', event);
}, 200);

useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [handleScroll]);
```

#### useIntersectionObserver
Detecta visibilidad de elementos (lazy loading).

```jsx
import { useIntersectionObserver } from '@/utils/PerformanceOptimizations';

const [ref, isVisible, entry] = useIntersectionObserver({
  threshold: 0.5,
  rootMargin: '100px'
});

return (
  <div ref={ref}>
    {isVisible ? <HeavyComponent /> : <Placeholder />}
  </div>
);
```

#### useLocalStorage
Sincroniza estado con localStorage.

```jsx
import { useLocalStorage } from '@/utils/PerformanceOptimizations';

const [theme, setTheme] = useLocalStorage('theme', 'dark');

// Persiste automáticamente en localStorage
<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
  Toggle Theme
</button>
```

#### useMediaQuery
Detecta breakpoints responsive.

```jsx
import { useMediaQuery } from '@/utils/PerformanceOptimizations';

const isMobile = useMediaQuery('(max-width: 768px)');
const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
const isDesktop = useMediaQuery('(min-width: 1025px)');

return (
  <div>
    {isMobile && <MobileView />}
    {isTablet && <TabletView />}
    {isDesktop && <DesktopView />}
  </div>
);
```

#### usePrevious
Accede al valor anterior de un state.

```jsx
import { usePrevious } from '@/utils/PerformanceOptimizations';

const [count, setCount] = useState(0);
const prevCount = usePrevious(count);

// prevCount es el valor anterior de count
<p>Ahora: {count}, Antes: {prevCount}</p>
```

#### useOnClickOutside
Detecta clicks fuera de un elemento (cerrar modales/dropdowns).

```jsx
import { useOnClickOutside } from '@/utils/PerformanceOptimizations';

const [isOpen, setIsOpen] = useState(false);
const ref = useRef();

useOnClickOutside(ref, () => setIsOpen(false));

return (
  <div ref={ref}>
    {isOpen && <DropdownMenu />}
  </div>
);
```

#### useWindowSize
Tamaño de ventana reactivo.

```jsx
import { useWindowSize } from '@/utils/PerformanceOptimizations';

const { width, height } = useWindowSize();

<p>Ventana: {width}x{height}px</p>
```

#### useNetworkStatus
Estado de conexión online/offline.

```jsx
import { useNetworkStatus } from '@/utils/PerformanceOptimizations';

const { isOnline, effectiveType, downlink } = useNetworkStatus();

{!isOnline && (
  <div className="banner-offline">
    Sin conexión a internet
  </div>
)}
```

#### useMemoCompare
Memoización con comparación custom.

```jsx
import { useMemoCompare } from '@/utils/PerformanceOptimizations';

const memoizedValue = useMemoCompare(
  expensiveValue,
  (prev, next) => prev.id === next.id
);
```

#### useInterval
Intervalo declarativo con cleanup automático.

```jsx
import { useInterval } from '@/utils/PerformanceOptimizations';

const [count, setCount] = useState(0);
const [delay, setDelay] = useState(1000);

useInterval(() => {
  setCount(count + 1);
}, delay);

// Pausar: setDelay(null)
```

#### useTimeout
Timeout declarativo con cleanup automático.

```jsx
import { useTimeout } from '@/utils/PerformanceOptimizations';

const [showMessage, setShowMessage] = useState(true);

useTimeout(() => {
  setShowMessage(false);
}, 3000);
```

#### useAsync
Manejo de promesas con estados loading/error.

```jsx
import { useAsync } from '@/utils/PerformanceOptimizations';

const { execute, data, loading, error } = useAsync(
  async (userId) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  }
);

// Ejecutar manualmente
<button onClick={() => execute(123)}>Load User</button>

{loading && <Spinner />}
{error && <Error message={error.message} />}
{data && <UserProfile data={data} />}
```

#### useCopyToClipboard
Copiar al portapapeles con feedback.

```jsx
import { useCopyToClipboard } from '@/utils/PerformanceOptimizations';

const [copiedText, copy] = useCopyToClipboard();

<button onClick={() => copy('Texto a copiar')}>
  {copiedText ? 'Copiado!' : 'Copiar'}
</button>
```

#### useToggle
Toggle booleano simplificado.

```jsx
import { useToggle } from '@/utils/PerformanceOptimizations';

const [isOpen, toggle, setIsOpen] = useToggle(false);

<button onClick={toggle}>Toggle</button>
<button onClick={() => setIsOpen(true)}>Abrir</button>
```

---

## 🔔 Sistema de Toasts

### UltraToastSystem
**Ubicación:** `src/components/premium/ui/UltraToastSystem.jsx`

Sistema avanzado de notificaciones con cola, swipe y progress bars.

#### Características
- 5 tipos: success, error, warning, info, loading
- 9 posiciones: top/center/bottom + left/center/right
- Sistema de cola (max 5 toasts)
- Swipe to dismiss (drag gesture)
- Progress bar animado
- Action buttons en toasts
- Helper para promesas (auto loading → success/error)
- Auto-remove con duración customizable

#### Setup
```jsx
import { ToastProvider } from '@/components/premium/ui/UltraToastSystem';

// En tu App.jsx o layout principal
<ToastProvider position="top-right" maxToasts={5}>
  <YourApp />
</ToastProvider>
```

#### Uso Básico
```jsx
import { useToast } from '@/components/premium/ui/UltraToastSystem';

function MyComponent() {
  const { success, error, warning, info, loading, promise } = useToast();

  const handleSave = () => {
    success('Guardado exitosamente!');
  };

  const handleError = () => {
    error('Ocurrió un error', {
      duration: 5000,
      action: {
        label: 'Reintentar',
        onClick: () => console.log('Retry')
      }
    });
  };

  const handleWarning = () => {
    warning('Revisa esta información', {
      duration: 4000
    });
  };

  const handleInfo = () => {
    info('Nueva actualización disponible');
  };

  const handleLoading = () => {
    const id = loading('Procesando...');

    // Actualizar después
    setTimeout(() => {
      success('Completado!');
    }, 2000);
  };

  const handlePromise = async () => {
    await promise(
      fetchData(), // Tu promesa
      {
        loading: 'Cargando datos...',
        success: 'Datos cargados!',
        error: 'Error al cargar'
      }
    );
  };

  return (
    <div>
      <button onClick={handleSave}>Success Toast</button>
      <button onClick={handleError}>Error Toast</button>
      <button onClick={handleWarning}>Warning Toast</button>
      <button onClick={handleInfo}>Info Toast</button>
      <button onClick={handleLoading}>Loading Toast</button>
      <button onClick={handlePromise}>Promise Toast</button>
    </div>
  );
}
```

#### API Completa
```jsx
const toast = useToast();

// Success
toast.success(message, options);

// Error
toast.error(message, options);

// Warning
toast.warning(message, options);

// Info
toast.info(message, options);

// Loading
const toastId = toast.loading(message, options);

// Promise helper
await toast.promise(promiseFn, {
  loading: 'Loading...',
  success: 'Success!',
  error: 'Error!'
});
```

#### Options
```javascript
{
  duration: 3000,           // Duración en ms (null = no auto-close)
  action: {                 // Botón de acción
    label: 'Undo',
    onClick: () => {}
  }
}
```

#### Posiciones Disponibles
- `'top-left'`
- `'top-center'`
- `'top-right'` (default)
- `'center-left'`
- `'center-center'`
- `'center-right'`
- `'bottom-left'`
- `'bottom-center'`
- `'bottom-right'`

---

## 🧪 Testing E2E

### Playwright Tests
**Configuración:** `playwright.config.js`
**Tests:** `e2e/*.spec.js`

#### Tests Implementados

##### 1. Login Flow (`e2e/login.spec.js`)
- ✅ Display login form
- ✅ Validation errors for empty fields
- ✅ Email format validation
- ✅ Password visibility toggle
- ✅ Successful login with redirect
- ✅ Toggle between login and register
- ✅ Remember me checkbox
- ✅ Social login buttons (Google, Microsoft)
- ✅ CHRONOS logo display
- ✅ Responsive design (mobile, desktop)
- ✅ Loading state during submission
- ✅ Error handling scenarios

##### 2. Dashboard Flow (`e2e/dashboard.spec.js`)
- ✅ Display dashboard header
- ✅ Display KPI cards
- ✅ Date range filters
- ✅ Switch date ranges
- ✅ Recent sales table
- ✅ Top products table
- ✅ Search functionality
- ✅ Export table data
- ✅ Filter tables
- ✅ Sidebar navigation
- ✅ Navigate to ventas
- ✅ Navigate to clientes
- ✅ User menu
- ✅ Notifications
- ✅ Search with Cmd+K
- ✅ Responsive (mobile, tablet, desktop)

#### Ejecutar Tests
```bash
# Ejecutar todos los tests
npm run test:e2e

# Ejecutar en UI mode (debug)
npm run test:e2e:ui

# Ejecutar un test específico
npx playwright test e2e/login.spec.js

# Ver reporte
npx playwright show-report
```

#### Crear Nuevos Tests
```javascript
import { expect, test } from '@playwright/test';

test.describe('Mi Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Setup antes de cada test
    await page.goto('/mi-pagina');
  });

  test('should do something', async ({ page }) => {
    // Interactuar
    await page.getByRole('button', { name: /click me/i }).click();

    // Verificar
    await expect(page.getByText(/success/i)).toBeVisible();
  });

  test('should handle errors', async ({ page }) => {
    // Test de error
    await page.getByRole('button', { name: /error/i }).click();
    await expect(page.getByText(/error/i)).toBeVisible();
  });
});
```

---

## 🗺️ Routing System

### AppRoutes
**Ubicación:** `src/routes/AppRoutes.jsx`

Sistema de routing completo con lazy loading y protected routes.

#### Estructura de Rutas
```
/premium
  /login (public)
  /dashboard (protected)
  /ventas/* (protected)
    /ventas
    /ventas/nueva
    /ventas/historial
    /ventas/abonos
  /clientes/* (protected)
    /clientes
    /clientes/:id
  /finanzas/* (protected)
    /finanzas
    /finanzas/bovedas
    /finanzas/transferencias
    /finanzas/gastos
  /analytics (protected)
  /settings (protected)
  * (404 Not Found)
```

#### Integración en App.jsx
```jsx
import { AppRoutes } from './routes/AppRoutes';
import { ToastProvider } from './components/premium/ui/UltraToastSystem';
import { SplashScreen } from './components/premium/brand/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);

  // Show splash for 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);

  if (showSplash) return <SplashScreen />;

  return (
    <Router>
      <ToastProvider position="top-right" maxToasts={5}>
        <Routes>
          <Route
            path="/premium/*"
            element={
              <AppRoutes
                user={user}
                onLogin={handleLogin}
                onLogout={handleLogout}
              />
            }
          />
          {/* Otras rutas legacy */}
        </Routes>
      </ToastProvider>
    </Router>
  );
}
```

#### Protected Routes
Todas las rutas excepto `/login` requieren autenticación. Si el usuario no está logueado, se redirige automáticamente a `/premium/login`.

#### Lazy Loading
Todos los componentes de página se cargan de forma lazy para optimizar el performance inicial:
- LoginPage
- MasterDashboard
- VentasPage, NuevaVentaPage, HistorialVentasPage, AbonosPage
- ClientesPage, ClienteDetallePage
- FinanzasPage, BovedasPage, TransferenciasPage, GastosPage
- AnalyticsPage
- SettingsPage
- NotFoundPage

---

## 📚 Recursos Adicionales

### Dependencias Principales
- **React 18.3.1** - Framework core
- **Framer Motion 11.11** - Animaciones avanzadas
- **Lucide React 0.441** - Sistema de iconos
- **React Router DOM 6.30** - Routing
- **TailwindCSS** - Utility-first CSS
- **Playwright** - E2E testing

### Estructura de Archivos
```
src/
├── components/
│   └── premium/
│       ├── ui/
│       │   ├── DataCard.jsx
│       │   ├── StatusBadge.jsx
│       │   ├── SmartTable.jsx
│       │   └── UltraToastSystem.jsx
│       ├── layout/
│       │   ├── PremiumLayout.jsx
│       │   ├── UltraHeader.jsx
│       │   └── UltraSidebar.jsx
│       ├── animations/
│       │   └── AdvancedAnimations.jsx
│       └── brand/
│           ├── ChronosLogos.tsx
│           └── SplashScreen.tsx
├── routes/
│   └── AppRoutes.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── MasterDashboard.jsx
│   ├── VentasPage.jsx
│   └── [otros...]
└── utils/
    └── PerformanceOptimizations.js
```

### Próximos Pasos
1. Implementar Firebase Auth en LoginPage
2. Conectar Firestore a MasterDashboard
3. Crear más páginas de detalle
4. Expandir suite de tests E2E
5. Implementar más animaciones custom
6. Agregar más hooks de optimización

---

**Documentación generada para CHRONOS Premium Ecosystem**
Última actualización: 2024
