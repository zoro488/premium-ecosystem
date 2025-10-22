# 🚀 FLOWDISTRIBUTOR - STACK TECNOLÓGICO

## 📦 DEPENDENCIAS PRINCIPALES

### Core Framework

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0"
}
```

**React 18.2**
- Framework principal
- Concurrent rendering
- Automatic batching
- Suspense mejorado
- Server Components ready

---

## 🎨 UI Y ESTILOS

### TailwindCSS

```json
{
  "tailwindcss": "^3.4.0",
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.32"
}
```

**Configuración Custom:**
- Deep Ocean Theme
- 7 paletas de colores (flow, shadow, apollo, synapse, nexus)
- Animaciones custom (float, shimmer, glow)
- Glassmorphism utilities
- Responsive breakpoints

**Colores Principales:**
```javascript
// Deep Ocean Theme
primary: '#0ea5e9'      // Azul océano
bg-primary: '#09111A'   // Fondo oscuro
bg-glass: 'rgba(15, 23, 41, 0.6)'  // Glassmorphism
```

### Animaciones

```json
{
  "framer-motion": "^10.16.16"
}
```

**Características:**
- Page transitions
- Component animations
- Drag & drop
- Gestures
- Variants system
- Spring physics
- Layout animations

**Ejemplos de uso:**
```jsx
// Entrada de elementos
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
>
```

### Iconos

```json
{
  "lucide-react": "^0.441.0"
}
```

**Iconos utilizados:**
- DollarSign, Wallet (finanzas)
- Package, Warehouse (inventario)
- Users, UserCheck (clientes)
- TrendingUp, BarChart3 (métricas)
- Sparkles, Zap (acciones)
- +150 iconos más

---

## 📊 GRÁFICOS Y VISUALIZACIÓN

### Recharts

```json
{
  "recharts": "^2.15.4"
}
```

**Gráficos implementados:**
- LineChart - Tendencias de capital
- BarChart - Comparación de ventas
- PieChart - Distribución de clientes
- AreaChart - Flujo de efectivo
- ComposedChart - Métricas combinadas

**Componentes custom:**
- AdvancedCharts
  - ConversionFunnel
  - GaugeChart
  - PeriodComparison
  - RadarAnalysis
  - SalesHeatmap
  - TrendPrediction

---

## 🔄 ESTADO Y DATOS

### State Management

```json
{
  "zustand": "^4.5.7"
}
```

**Stores principales:**
- FlowDistributor state
- Theme state
- User preferences
- Cache state

**Ejemplo:**
```javascript
const useFlowStore = create((set) => ({
  bancos: {},
  setBancos: (bancos) => set({ bancos }),
  // ...
}));
```

### Data Fetching

```json
{
  "@tanstack/react-query": "^5.90.5"
}
```

**Features:**
- Cache automático
- Refetch en background
- Optimistic updates
- Infinite queries
- Mutations

### Forms & Validation

```json
{
  "react-hook-form": "^7.65.0",
  "@hookform/resolvers": "^3.3.2",
  "zod": "^3.25.76"
}
```

**Validación de formularios:**
```javascript
const schema = z.object({
  monto: z.number().positive(),
  fecha: z.string(),
  concepto: z.string().min(3)
});
```

---

## 💾 PERSISTENCIA Y STORAGE

### LocalStorage

```json
{
  "idb-keyval": "^6.2.2"
}
```

**Storage keys:**
```javascript
STORAGE_KEYS = {
  FLOW_DATA: 'flowDistributor_data',
  FLOW_BANCOS: 'flowDistributor_bancos',
  FLOW_ALMACEN: 'flowDistributor_almacen',
  FLOW_THEME: 'flowDistributor_theme',
  FLOW_HISTORY: 'flowDistributor_history'
}
```

### Excel Import/Export

```json
{
  "xlsx": "^0.18.5"
}
```

**Funcionalidades:**
- Importar datos desde Excel
- Exportar reportes a Excel
- Múltiples hojas
- Formato personalizado
- Validación de datos

---

## 🔥 BACKEND Y DATABASE

### Firebase

```json
{
  "firebase": "^12.4.0"
}
```

**Servicios utilizados:**
- **Authentication**: Login/registro usuarios
- **Firestore**: Base de datos NoSQL
- **Storage**: Archivos y backups
- **Hosting**: Deploy de la app

**Configuración:**
```javascript
// src/config/firebase.js
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

---

## 🛠️ BUILD Y DESARROLLO

### Vite

```json
{
  "vite": "^5.0.8",
  "@vitejs/plugin-react": "^4.2.1"
}
```

**Optimizaciones:**
- Hot Module Replacement (HMR)
- Code splitting automático
- Tree shaking
- Lazy loading
- Chunk optimization

**Chunks configurados:**
```javascript
manualChunks: {
  'react-vendor': ['react', 'react-dom'],
  'state-vendor': ['zustand', '@tanstack/react-query'],
  'animation-vendor': ['framer-motion'],
  'charts-vendor': ['recharts'],
  'firebase-vendor': ['firebase/app', 'firebase/firestore']
}
```

---

## 🧪 TESTING

### Unit Testing

```json
{
  "vitest": "^3.2.4",
  "@vitest/ui": "^3.2.4",
  "@vitest/coverage-v8": "^3.2.4"
}
```

**Testing Library:**
```json
{
  "@testing-library/react": "^16.3.0",
  "@testing-library/jest-dom": "^6.9.1",
  "@testing-library/user-event": "^14.6.1"
}
```

**Configuración:**
```javascript
// vitest.config.js
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      lines: 80,
      functions: 80,
      branches: 75
    }
  }
});
```

### E2E Testing

```json
{
  "@playwright/test": "^1.56.1"
}
```

**Tests implementados:**
- flow-complete.spec.js
- navigation.spec.js
- flowdistributor-basic.spec.js

---

## 📱 PWA (PRÓXIMAMENTE)

```json
{
  "vite-plugin-pwa": "^1.1.0"
}
```

**Features planeadas:**
- Instalación en dispositivo
- Modo offline
- Notificaciones push
- Background sync
- Cache de assets

---

## 🎯 UTILIDADES

### Class Utilities

```json
{
  "clsx": "^2.1.1",
  "class-variance-authority": "^0.7.1",
  "tailwind-merge": "^2.6.0"
}
```

**Uso:**
```javascript
import { cn } from '@/lib/utils';

const className = cn(
  'base-class',
  isActive && 'active-class',
  'additional-class'
);
```

### Fechas

```json
{
  "date-fns": "^3.6.0"
}
```

**Funciones usadas:**
- format()
- parseISO()
- differenceInDays()
- startOfWeek()
- endOfMonth()

### HTTP Client

```json
{
  "axios": "^1.12.2"
}
```

**Configuración:**
```javascript
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### Debouncing

```json
{
  "use-debounce": "^10.0.6"
}
```

**Búsqueda optimizada:**
```javascript
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearch] = useDebounce(searchTerm, 300);
```

---

## 🔒 SEGURIDAD Y MONITOREO

### Error Tracking

```json
{
  "@sentry/react": "^10.20.0"
}
```

**Configuración:**
```javascript
Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
});
```

### Analytics

```json
{
  "react-ga4": "^2.1.0"
}
```

**Eventos trackeados:**
- Pageviews
- Transacciones
- Clicks en botones
- Búsquedas
- Exportaciones

---

## 🎨 CALIDAD DE CÓDIGO

### Linting

```json
{
  "eslint": "^8.55.0",
  "eslint-config-prettier": "^10.1.8",
  "eslint-plugin-react": "^7.33.2",
  "eslint-plugin-react-hooks": "^4.6.0"
}
```

### Formatting

```json
{
  "prettier": "^3.6.2",
  "prettier-plugin-tailwindcss": "^0.7.1"
}
```

**Reglas:**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100,
  "trailingComma": "es5"
}
```

---

## 📐 VIRTUALIZACIÓN

### Virtual Scroll

```json
{
  "@tanstack/react-virtual": "^3.13.12"
}
```

**Uso en listas largas:**
```javascript
const rowVirtualizer = useVirtualizer({
  count: 1000,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 50
});
```

---

## 🌐 PERFORMANCE

### Optimizaciones Implementadas

1. **Code Splitting**
   - Lazy loading de rutas
   - Dynamic imports
   - Chunk optimization

2. **Memoization**
   - useMemo para cálculos
   - useCallback para funciones
   - React.memo para componentes

3. **Bundle Size**
   - Tree shaking
   - Minificación con esbuild
   - Compresión gzip
   - Target: < 800KB

4. **Runtime**
   - Virtualización de listas
   - Debouncing de búsquedas
   - Optimistic updates
   - Cache estratégico

---

## 📊 MÉTRICAS DE RENDIMIENTO

### Lighthouse Scores (Target)

```
Performance:     90+
Accessibility:   95+
Best Practices:  90+
SEO:            90+
```

### Web Vitals (Target)

```
FCP (First Contentful Paint):     < 1.5s
LCP (Largest Contentful Paint):   < 2.5s
FID (First Input Delay):          < 100ms
CLS (Cumulative Layout Shift):    < 0.1
TTI (Time to Interactive):        < 3s
```

---

## 🔧 HERRAMIENTAS DE DESARROLLO

### DevTools

```json
{
  "@tanstack/react-query-devtools": "incluido",
  "zustand/middleware": "incluido"
}
```

**DevTools disponibles:**
- React DevTools
- Redux DevTools (para Zustand)
- React Query DevTools
- Vite DevTools

### Análisis de Bundle

```json
{
  "rollup-plugin-visualizer": "^6.0.5"
}
```

**Comando:**
```bash
npm run build -- --analyze
```

---

## 🐳 DOCKER (OPCIONAL)

### Containerización

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3001:3001"
    volumes:
      - ./src:/app/src
    environment:
      - NODE_ENV=development
```

---

## 📦 SCRIPTS NPM

```json
{
  "dev": "vite",                          // Desarrollo
  "build": "vite build",                  // Producción
  "preview": "vite preview",              // Preview build
  "test": "vitest",                       // Tests unitarios
  "test:e2e": "playwright test",          // Tests E2E
  "lint": "eslint src --ext js,jsx",      // Linter
  "format": "prettier --write 'src/**'",  // Formatear
  "deploy": "npm run build && firebase deploy"  // Deploy
}
```

---

## 🌍 VARIABLES DE ENTORNO

```env
# .env.local
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_SENTRY_DSN=xxx
VITE_GA_TRACKING_ID=xxx
NODE_ENV=development
```

---

## 📚 DOCUMENTACIÓN DE DEPENDENCIAS

### Links Útiles

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [TailwindCSS Docs](https://tailwindcss.com)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Recharts Docs](https://recharts.org)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [React Query Docs](https://tanstack.com/query)
- [Firebase Docs](https://firebase.google.com/docs)

---

## 🔄 ACTUALIZACIONES

### Última Actualización de Dependencias

```bash
# Actualizar todas las dependencias
npm update

# Actualizar dependencia específica
npm update react@latest

# Verificar dependencias obsoletas
npm outdated
```

### Versionado

**Versión actual:** 3.0.0

**Sistema de versionado:** Semantic Versioning (SemVer)
- MAJOR: Cambios incompatibles
- MINOR: Nueva funcionalidad compatible
- PATCH: Correcciones de bugs

---

**Última actualización:** 2025-10-21
**Versión del sistema:** 3.0-excel-completo
