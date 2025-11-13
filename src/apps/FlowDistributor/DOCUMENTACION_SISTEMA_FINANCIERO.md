# 📊 Sistema de Gestión Financiera - FlowDistributor

## 🎯 Descripción General

Sistema premium integrado de gestión financiera que consolida 5 módulos principales:

1. **Dashboard RF Actual** - Vista ejecutiva con $12,861,332.12 consolidados
2. **Panel de Ventas Locales** - 89 transacciones con análisis completo
3. **Panel de Gastos y Abonos (GYA)** - Control de flujo de caja
4. **Panel de Órdenes de Compra** - Gestión de compras
5. **Panel de Distribuidores** - Relación con proveedores

## 🚀 Características Premium

### ✨ Diseño y UX
- **Glassmorphism avanzado** con efectos de cristal y blur
- **Microanimaciones** con Framer Motion
- **GPU-accelerated effects** para máximo performance
- **Floating widgets** que expanden al hover
- **Drag & drop** para reorganización de elementos
- **Dark mode** optimizado
- **Responsive design** mobile-first

### 📈 Funcionalidades
- **Real-time updates** con localStorage
- **Drill-down interactivo** en todas las métricas
- **Filtros avanzados** multicriteria
- **Búsqueda semántica** instantánea
- **Exportación de datos** a Excel/PDF
- **Visualizaciones dinámicas** con gráficos interactivos
- **Timeline de movimientos** con agrupación por fecha
- **KPIs en tiempo real** con comparativas

## 📦 Estructura de Archivos

```
src/apps/FlowDistributor/
├── components/
│   ├── SistemaGestionFinanciera.jsx     # 🎯 Componente integrador principal
│   ├── DashboardRFActual.jsx            # 💰 Dashboard ejecutivo RF
│   ├── PanelVentaLocal.jsx              # 🛒 Panel de ventas
│   ├── PanelGYA.jsx                     # 💸 Panel de gastos y abonos
│   ├── PanelOrdenesCompra.jsx           # 📦 Panel de órdenes
│   └── PanelDistribuidores.jsx          # 👥 Panel de distribuidores
├── data/
│   ├── datosEjemploVentas.js            # 📊 89 registros de ventas
│   ├── datosEjemploGYA.js               # 💰 56 movimientos financieros
│   ├── datosEjemploOrdenes.js           # 📋 Datos de órdenes
│   └── datosEjemploDistribuidores.js    # 🏢 Datos de distribuidores
├── styles/
│   └── gestion-financiera.css           # 🎨 Estilos personalizados
├── constants/
│   └── storageKeys.js                   # 🔑 Claves de localStorage
└── utils/
    └── formatters.js                    # 🔧 Utilidades de formato
```

## 🛠️ Instalación

### Prerrequisitos

```bash
node >= 18.0.0
npm >= 9.0.0
```

### Dependencias

```bash
npm install react@18 react-dom@18
npm install framer-motion@10
npm install lucide-react@0.263
npm install clsx
```

### Instalación Rápida

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/premium-ecosystem

# 2. Instalar dependencias
cd premium-ecosystem
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

## 📚 Uso del Sistema

### 1. Importación Básica

```javascript
import SistemaGestionFinanciera from './apps/FlowDistributor/components/SistemaGestionFinanciera';

function App() {
  return <SistemaGestionFinanciera />;
}
```

### 2. Uso de Paneles Individuales

```javascript
import DashboardRFActual from './apps/FlowDistributor/components/DashboardRFActual';
import PanelVentaLocal from './apps/FlowDistributor/components/PanelVentaLocal';
import PanelGYA from './apps/FlowDistributor/components/PanelGYA';

function MiComponente() {
  return (
    <div>
      <DashboardRFActual />
      <PanelVentaLocal />
      <PanelGYA />
    </div>
  );
}
```

### 3. Estilos Personalizados

```javascript
// Importar estilos globales
import './apps/FlowDistributor/styles/gestion-financiera.css';
```

## 📊 Estructura de Datos

### Ventas Locales

```javascript
const venta = {
  id: 'VL-001',
  fecha: '2025-08-05',
  ocRelacionada: 'OC-2024-0847',
  cantidad: 500,
  cliente: 'Bodega Aurrera',
  precioVenta: 68.00,
  ingreso: 34000.00,
  flete: 3500.00,
  utilidad: 2250.00,
  estatus: 'Pagado', // 'Pagado' | 'Pendiente'
  concepto: 'VENTA LOCAL TIENDAS AURRERA'
};
```

### Gastos y Abonos (GYA)

```javascript
const movimiento = {
  id: 'GYA-001',
  fecha: '2025-08-02',
  tipo: 'Abono a RF', // Ver TIPOS_MOVIMIENTO
  monto: 200000.00,
  destino: 'Profit', // Ver DESTINOS
  categoria: 'Abonos', // Ver CATEGORIAS_GASTOS
  tc: 18.50,
  descripcion: 'Abono mensual agosto',
  moneda: 'MXN' // 'MXN' | 'USD'
};

// Tipos de movimiento
const TIPOS_MOVIMIENTO = {
  ABONO_RF: 'Abono a RF',
  GASTO_VIATICO: 'Gasto en viáticos',
  GASTO_PERSONAL: 'Gasto de personal',
  INGRESO_VENTA: 'Ingreso por venta',
  FLETE: 'Flete',
  DEVOLUCION: 'Devolución',
  COMISION: 'Comisión',
  OTRO: 'Otro'
};

// Destinos
const DESTINOS = {
  PROFIT: 'Profit',
  FLETE_SUR: 'Flete Sur',
  BOVEDA_USA: 'Bóveda USA',
  UTILIDADES: 'Utilidades',
  LEFTIE: 'Leftie',
  ALMACEN_VILLA: 'Almacén Villa',
  BOVEDA_MONTE: 'Bóveda Monte',
  AZTECA: 'Azteca'
};
```

### Dashboard RF Actual

```javascript
const RF_ACTUAL = {
  total: 12861332.12,
  paneles: [
    {
      nombre: 'Profit',
      monto: 12577748.12,
      tipo: 'positivo',
      icono: 'TrendingUp',
      color: 'green'
    },
    {
      nombre: 'Flete Sur',
      monto: 185792.00,
      tipo: 'positivo',
      icono: 'Truck',
      color: 'blue'
    },
    // ... más paneles
  ]
};
```

## 🎨 Personalización de Estilos

### Variables CSS

```css
:root {
  /* Colores Premium */
  --color-primary: #8b5cf6;
  --color-secondary: #ec4899;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;

  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-blur: 20px;
}
```

### Clases Utility

```javascript
// Efectos glassmorphism
<div className="glass-panel hover-lift">
  Contenido con efecto cristal
</div>

// Animaciones
<div className="shimmer fade-in-up">
  Contenido con shimmer
</div>

// Gradientes animados
<div className="gradient-animated gradient-premium">
  Fondo con gradiente animado
</div>
```

## 📈 API de Funciones

### Calcular Estadísticas de Ventas

```javascript
import { calcularEstadisticasVentas } from './data/datosEjemploVentas';

const stats = calcularEstadisticasVentas();
// {
//   ingresoTotal: 2431500.00,
//   utilidadTotal: 175750.00,
//   totalVentas: 89,
//   cantidadTotal: 40000,
//   promedioUtilidad: 1975.00
// }
```

### Calcular Estadísticas de GYA

```javascript
import { calcularEstadisticasGYA } from './data/datosEjemploGYA';

const stats = calcularEstadisticasGYA();
// {
//   totalAbonos: 600000.00,
//   totalGastos: 85000.00,
//   totalIngresos: 150000.00,
//   balanceNeto: 515000.00,
//   cantidadMovimientos: 56,
//   promedioMovimiento: 9196.43
// }
```

### Guardar y Cargar Datos

```javascript
import { guardarDatosVentas, cargarDatosVentas } from './data/datosEjemploVentas';

// Guardar en localStorage
guardarDatosVentas(ventasActualizadas);

// Cargar desde localStorage
const ventas = cargarDatosVentas();
```

## 🎯 Componentes Principales

### SistemaGestionFinanciera

Componente integrador principal con navegación entre módulos.

**Props:** Ninguna (auto-contenido)

**Ejemplo:**
```javascript
<SistemaGestionFinanciera />
```

### DashboardRFActual

Dashboard ejecutivo con vista consolidada de RF.

**Props:** Ninguna

**Features:**
- Vista hero con total consolidado
- 8 paneles interactivos con drill-down
- Estadísticas de balance positivo/negativo
- Cambio de vista: Grid / Chart / Table

**Ejemplo:**
```javascript
<DashboardRFActual />
```

### PanelVentaLocal

Panel de ventas con 89 transacciones.

**Props:** Ninguna

**Features:**
- Búsqueda en tiempo real
- Filtro por estatus (Pagado/Pendiente)
- Vista Grid/List toggle
- KPIs: Ingresos, Utilidad, Total ventas, Cantidad
- Widgets expandibles con hover

**Ejemplo:**
```javascript
<PanelVentaLocal />
```

### PanelGYA

Panel de gastos y abonos con timeline.

**Props:** Ninguna

**Features:**
- Timeline agrupado por mes
- Filtro por tipo de movimiento (8 tipos)
- Filtro por destino (7 destinos)
- Búsqueda semántica
- Balance neto calculado
- Animaciones direccionales (entrada/salida)

**Ejemplo:**
```javascript
<PanelGYA />
```

## 🎭 Animaciones y Transiciones

### Configuración de Framer Motion

```javascript
// Animación de entrada para widgets
const widgetAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  whileHover: { y: -4, scale: 1.02 },
  transition: {
    type: 'spring',
    stiffness: 300,
    damping: 30
  }
};

<motion.div {...widgetAnimation}>
  Contenido
</motion.div>
```

### Stagger para Listas

```javascript
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.div variants={containerVariants} initial="hidden" animate="show">
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

## 🔧 Configuración Avanzada

### localStorage Keys

```javascript
// src/constants/storageKeys.js
export const STORAGE_KEYS = {
  VENTAS_LOCAL: 'flowdistributor_ventas_local',
  MOVIMIENTOS_GYA: 'flowdistributor_gya',
  ORDENES_COMPRA: 'flowdistributor_ordenes',
  DISTRIBUIDORES: 'flowdistributor_distribuidores',
  RF_ACTUAL: 'flowdistributor_rf_actual'
};
```

### Formatters Personalizados

```javascript
// src/utils/formatters.js
export const formatearMoneda = (valor, moneda = 'MXN') => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: moneda
  }).format(valor);
};

export const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const formatearPorcentaje = (valor) => {
  return `${(valor * 100).toFixed(2)}%`;
};
```

## 📱 Responsive Design

### Breakpoints

```javascript
const breakpoints = {
  sm: '640px',   // Mobile
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large Desktop
  '2xl': '1536px' // Extra Large
};
```

### Ejemplo de Uso

```javascript
<div className="
  grid
  grid-cols-1
  md:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
  gap-4
  md:gap-6
  lg:gap-8
">
  {/* Contenido responsive */}
</div>
```

## 🚀 Performance

### Optimizaciones Implementadas

1. **React.memo** en componentes pesados
2. **useMemo** para cálculos complejos
3. **useCallback** para funciones en props
4. **Lazy loading** de componentes
5. **Virtual scrolling** para listas largas
6. **Debounce** en búsquedas (300ms)
7. **GPU acceleration** en animaciones
8. **Code splitting** por ruta

### Ejemplo de Optimización

```javascript
import React, { useMemo, useCallback, memo } from 'react';

const VentaWidget = memo(({ venta }) => {
  // Memoizar cálculos pesados
  const estadisticas = useMemo(() => {
    return calcularEstadisticas(venta);
  }, [venta]);

  // Memoizar callbacks
  const handleClick = useCallback(() => {
    console.log('Venta clickeada:', venta.id);
  }, [venta.id]);

  return (
    <div onClick={handleClick}>
      {/* Contenido */}
    </div>
  );
});
```

## 🧪 Testing

### Unit Tests con Vitest

```javascript
import { describe, it, expect } from 'vitest';
import { calcularEstadisticasVentas } from './datosEjemploVentas';

describe('Estadísticas de Ventas', () => {
  it('debe calcular el total de ingresos correctamente', () => {
    const stats = calcularEstadisticasVentas();
    expect(stats.ingresoTotal).toBe(2431500);
  });

  it('debe calcular el promedio de utilidad', () => {
    const stats = calcularEstadisticasVentas();
    expect(stats.promedioUtilidad).toBeCloseTo(1975, 2);
  });
});
```

### E2E Tests con Playwright

```javascript
import { test, expect } from '@playwright/test';

test('debe navegar entre paneles', async ({ page }) => {
  await page.goto('/gestion-financiera');

  // Click en panel de ventas
  await page.click('text=Ventas Locales');
  await expect(page).toHaveURL(/.*ventas/);

  // Verificar que se muestran las ventas
  await expect(page.locator('.venta-widget')).toHaveCount(89);
});
```

## 🐛 Troubleshooting

### Problema: Animaciones lentas

**Solución:** Habilitar GPU acceleration

```css
.animated-element {
  will-change: transform, opacity;
  transform: translateZ(0);
}
```

### Problema: localStorage lleno

**Solución:** Limpiar datos antiguos

```javascript
const limpiarDatosAntiguos = () => {
  const keys = Object.values(STORAGE_KEYS);
  keys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      // Mantener solo últimos 90 días
      const filtered = parsed.filter(item => {
        const fecha = new Date(item.fecha);
        const diff = Date.now() - fecha.getTime();
        return diff < 90 * 24 * 60 * 60 * 1000;
      });
      localStorage.setItem(key, JSON.stringify(filtered));
    }
  });
};
```

### Problema: Datos no se actualizan

**Solución:** Forzar re-render con key

```javascript
const [refreshKey, setRefreshKey] = useState(0);

const refrescarDatos = () => {
  setRefreshKey(prev => prev + 1);
};

<PanelVentaLocal key={refreshKey} />
```

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

- 📧 Email: support@flowdistributor.com
- 💬 Discord: https://discord.gg/flowdistributor
- 📚 Docs: https://docs.flowdistributor.com

## 🎓 Recursos Adicionales

- [Guía de Framer Motion](https://www.framer.com/motion/)
- [Lucide React Icons](https://lucide.dev/guide/packages/lucide-react)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [React Best Practices](https://react.dev/learn)

---

**Creado con ❤️ por el equipo de FlowDistributor**

**Versión:** 1.0.0
**Última actualización:** Enero 2025
