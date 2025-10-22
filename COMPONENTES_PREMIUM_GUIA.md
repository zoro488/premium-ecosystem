# 🎨 Guía de Componentes Premium

## Componentes Implementados

### 1. 📊 AdvancedDataTable

Tabla interactiva avanzada con todas las funciones modernas:

**Features:**
- ✅ Ordenamiento por columnas con animaciones
- ✅ Búsqueda global en tiempo real
- ✅ Filtrado por columna
- ✅ Paginación fluida con animaciones
- ✅ Acciones rápidas (ver/editar/eliminar)
- ✅ Microinteracciones en hover
- ✅ Responsive design
- ✅ Selector de filas por página

**Uso:**

```jsx
import { AdvancedDataTable } from '@/components';

// Definir columnas
const columns = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'nombre',
    header: 'Nombre',
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ getValue }) => `$${getValue().toLocaleString()}`,
  },
];

// Usar componente
<AdvancedDataTable
  data={ventas}
  columns={columns}
  onRowClick={(row) => console.log('Click en:', row)}
  onEdit={(row) => handleEdit(row)}
  onDelete={(row) => handleDelete(row)}
  onView={(row) => handleView(row)}
  pageSize={20}
/>
```

---

### 2. 📈 AnimatedChart

Gráficos animados con múltiples tipos de visualización:

**Features:**
- ✅ Tipos: Line, Bar, Area, Pie
- ✅ Cambio dinámico de tipo de gráfico
- ✅ Tooltips personalizados animados
- ✅ Estadísticas automáticas (total, promedio, máximo, tendencia)
- ✅ Animaciones fluidas en entrada
- ✅ Responsive container
- ✅ Gradientes personalizados

**Uso:**

```jsx
import { AnimatedChart } from '@/components';

const data = [
  { name: 'Ene', ingresos: 85000, egresos: 65000 },
  { name: 'Feb', ingresos: 92000, egresos: 70000 },
  { name: 'Mar', ingresos: 78000, egresos: 58000 },
];

<AnimatedChart
  data={data}
  type="line"
  title="Tendencia Financiera"
  description="Ingresos vs Egresos mensuales"
  dataKeys={['ingresos', 'egresos']}
  colors={['#10b981', '#ef4444']}
  enableTypeSwitch={true}
  height={400}
/>
```

---

### 3. 💎 StatCard

Tarjetas de estadísticas con animaciones premium:

**Features:**
- ✅ Animación de contador
- ✅ Indicador de tendencia (up/down)
- ✅ Efectos de glassmorphism
- ✅ Gradientes personalizados
- ✅ Efecto de brillo animado
- ✅ Barra de progreso
- ✅ Microinteracciones en hover

**Uso:**

```jsx
import { StatCard } from '@/components';
import { DollarSign } from 'lucide-react';

<StatCard
  title="Ganancia Neta"
  value="$125,000"
  icon={DollarSign}
  trend="up"
  trendValue={18.5}
  gradient="from-green-400 to-emerald-500"
  bgGradient="from-green-500/10 to-emerald-500/5"
  onClick={() => navigate('/reportes')}
  delay={0.1}
/>
```

---

### 4. 📊 KPICard

Tarjetas de KPI con comparación de períodos:

**Features:**
- ✅ Comparación con valor anterior
- ✅ Cálculo automático de cambio porcentual
- ✅ Sparkline mini gráfico
- ✅ Progress hacia meta
- ✅ Status visual (success/warning/danger)
- ✅ Formateo de valores (number/currency/percent)
- ✅ Animaciones de entrada

**Uso:**

```jsx
import { KPICard } from '@/components';

<KPICard
  label="Ventas Totales"
  value={125000}
  previousValue={105000}
  format="currency"
  sparklineData={[85, 92, 78, 105, 118, 125]}
  target={150000}
  status="success"
  onClick={() => showDetails()}
/>
```

---

## 🎯 Ejemplo Completo: Dashboard Premium

```jsx
import {
  AdvancedDataTable,
  AnimatedChart,
  StatCard,
  KPICard,
} from '@/components';
import { DollarSign, TrendingUp, Package, Users } from 'lucide-react';

const DashboardPremium = () => {
  return (
    <div className="space-y-6">
      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Capital Total"
          value="$450,000"
          icon={DollarSign}
          trend="up"
          trendValue={12.5}
          gradient="from-cyan-400 to-blue-500"
          bgGradient="from-cyan-500/10 to-blue-500/5"
        />
        <StatCard
          title="Ganancia Neta"
          value="$125,000"
          icon={TrendingUp}
          trend="up"
          trendValue={18.5}
          gradient="from-green-400 to-emerald-500"
          bgGradient="from-green-500/10 to-emerald-500/5"
        />
        <StatCard
          title="Inventario"
          value="2,547"
          icon={Package}
          trend="down"
          trendValue={3.2}
          gradient="from-orange-400 to-red-500"
          bgGradient="from-orange-500/10 to-red-500/5"
        />
        <StatCard
          title="Clientes"
          value="1,234"
          icon={Users}
          trend="up"
          trendValue={5.8}
          gradient="from-purple-400 to-pink-500"
          bgGradient="from-purple-500/10 to-pink-500/5"
        />
      </div>

      {/* KPI Cards con Comparación */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          label="Ventas del Mes"
          value={125000}
          previousValue={105000}
          format="currency"
          sparklineData={[85, 92, 78, 105, 118, 125]}
          target={150000}
          status="success"
        />
        <KPICard
          label="Margen de Ganancia"
          value={32}
          previousValue={28}
          format="percent"
          sparklineData={[25, 27, 29, 30, 31, 32]}
          target={35}
          status="warning"
        />
        <KPICard
          label="Productos Vendidos"
          value={1547}
          previousValue={1823}
          format="number"
          sparklineData={[1200, 1350, 1500, 1650, 1700, 1547]}
          target={2000}
          status="danger"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedChart
          data={chartData}
          type="line"
          title="Tendencia Mensual"
          description="Ingresos y Egresos"
          dataKeys={['ingresos', 'egresos']}
          colors={['#10b981', '#ef4444']}
          enableTypeSwitch={true}
        />
        <AnimatedChart
          data={categoryData}
          type="pie"
          title="Distribución por Categoría"
          dataKeys={['value']}
          colors={['#8b5cf6', '#ec4899', '#06b6d4', '#10b981']}
        />
      </div>

      {/* Tabla Avanzada */}
      <AdvancedDataTable
        data={ventas}
        columns={ventasColumns}
        onRowClick={handleRowClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pageSize={15}
      />
    </div>
  );
};
```

---

## 🎨 Personalización de Estilos

Todos los componentes usan el sistema de diseño global:

```jsx
// Colores de gradientes disponibles
const gradients = {
  purple: 'from-purple-500 to-pink-500',
  blue: 'from-cyan-400 to-blue-500',
  green: 'from-green-400 to-emerald-500',
  orange: 'from-orange-400 to-red-500',
  pink: 'from-pink-400 to-rose-500',
};

// Backgrounds glassmorphism
const backgrounds = {
  light: 'from-white/10 to-white/5',
  medium: 'from-white/5 to-white/[0.02]',
  dark: 'from-slate-500/10 to-gray-500/5',
};
```

---

## ⚡ Performance

Todos los componentes están optimizados para rendimiento:

- ✅ Animaciones con GPU (transform, opacity)
- ✅ Memoización de cálculos pesados
- ✅ Virtual scrolling preparado
- ✅ Lazy loading de imágenes
- ✅ Debouncing en búsquedas
- ✅ Optimistic updates

---

## 📱 Responsive Design

Todos los componentes son completamente responsive:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Usan `grid` con breakpoints automáticos:
```jsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
```

---

## 🚀 Próximos Componentes

- [ ] TreeView con drag & drop
- [ ] Kanban Board animado
- [ ] Timeline con eventos
- [ ] Calendar con citas
- [ ] File Upload con preview
- [ ] Forms wizard multi-step

