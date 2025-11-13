# 📊 FlowDistributor - Sistema de Gestión Empresarial

**Versión:** 2.0.0
**Estado:** ✅ PRODUCCIÓN
**Fecha:** Enero 2025
**Moneda Base:** USD (Dólares)

---

## 🎯 Descripción

FlowDistributor es un sistema completo de gestión empresarial que permite controlar:

- ✅ **Órdenes de Compra** con control de stock en tiempo real
- ✅ **Ventas** con validación automática de inventario
- ✅ **Clientes** con gestión de crédito y bloqueos
- ✅ **Gastos y Abonos** categorizados
- ✅ **Bóvedas** (Monte y USA) con flujo de caja
- ✅ **Almacenes** con trazabilidad completa
- ✅ **Dashboard** con métricas en tiempo real

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

```
Frontend:
├── React 18.2+ (Concurrent Features)
├── TypeScript 5.0+ (Strict Mode)
├── Vite 5.0+ (Build Tool)
├── TailwindCSS 3.4+ (Estilos)
└── Framer Motion (Animaciones)

State Management:
├── Zustand 4.4+ (Estado Global)
├── TanStack Query v5 (Server State)
└── React Hook Form + Zod (Formularios)

Backend:
├── Firebase v12 (Firestore)
├── Firebase Auth (Autenticación)
├── Firebase Storage (Archivos)
└── Firebase Analytics (Métricas)

Testing:
├── Vitest (Unit Tests)
├── Playwright (E2E Tests)
└── Testing Library (Component Tests)

DevOps:
├── GitHub Actions (CI/CD)
├── Sentry (Error Tracking)
└── Google Analytics 4 (Analytics)
```

### Estructura del Proyecto

```
src/apps/FlowDistributor/
├── components/
│   ├── forms/              # Formularios con validación
│   │   ├── OrdenCompraForm.tsx
│   │   ├── VentaForm.tsx
│   │   └── ClienteForm.tsx
│   ├── tables/             # Tablas con sorting/filtering
│   │   ├── OrdenesCompraTable.tsx
│   │   ├── VentasTable.tsx
│   │   └── ClientesTable.tsx
│   ├── dashboard/          # Componentes de Dashboard
│   │   ├── StatsCard.tsx
│   │   ├── RevenueChart.tsx
│   │   └── StockAlerts.tsx
│   └── panels/             # Paneles principales
│       ├── PanelDistribuidores.tsx
│       ├── PanelVentas.tsx
│       └── PanelDashboard.tsx
├── services/               # Servicios Firestore
│   ├── ordenesCompra.service.ts
│   ├── ventas.service.ts
│   ├── clientes.service.ts
│   └── gastos.service.ts
├── hooks/                  # Custom Hooks
│   ├── useOrdenesCompra.ts
│   ├── useVentas.ts
│   └── useClientes.ts
├── stores/                 # Zustand Stores
│   └── flowDistributor.store.ts
├── utils/                  # Utilidades
│   ├── formatters.ts
│   ├── validators.ts
│   └── calculations.ts
├── schemas/                # Esquemas Zod
│   ├── ordenCompra.schema.ts
│   └── venta.schema.ts
├── types/                  # TypeScript Types
│   └── index.ts
└── data/                   # Datos estáticos
    └── FlowDistributorData.js
```

---

## 🚀 Instalación

### Prerequisitos

- Node.js 18+ LTS
- npm 9+ o pnpm 8+
- Python 3.9+ (para scripts)
- Git 2.40+

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-org/premium-ecosystem.git
cd premium-ecosystem

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local

# Editar .env.local con tus credenciales de Firebase:
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id

# 4. Ejecutar en desarrollo
npm run dev

# 5. Abrir en el navegador
# http://localhost:5173
```

---

## 📦 Configuración de Firebase

### 1. Crear Proyecto Firebase

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar proyecto
firebase init
```

### 2. Configurar Firestore

En Firebase Console:

1. **Firestore Database** → Crear base de datos
2. **Modo:** Producción
3. **Región:** us-central1 (o la más cercana)

### 3. Reglas de Seguridad (firestore.rules)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function hasRole(role) {
      return isSignedIn() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }

    // Órdenes de Compra
    match /ordenesCompra/{ordenId} {
      allow read: if isSignedIn();
      allow create, update: if hasRole('admin') || hasRole('gerente');
      allow delete: if hasRole('admin');
    }

    // Ventas
    match /ventas/{ventaId} {
      allow read: if isSignedIn();
      allow create, update: if hasRole('admin') || hasRole('gerente') || hasRole('vendedor');
      allow delete: if hasRole('admin');
    }

    // Clientes
    match /clientes/{clienteId} {
      allow read: if isSignedIn();
      allow write: if hasRole('admin') || hasRole('gerente');
    }

    // Gastos y Abonos
    match /gastos/{gastoId} {
      allow read: if isSignedIn();
      allow write: if hasRole('admin') || hasRole('contador');
    }
  }
}
```

### 4. Índices de Firestore

```javascript
// En Firebase Console → Firestore → Índices
// Crear índices compuestos para queries complejas:

ordenesCompra:
  - estado (Ascending) + fecha (Descending)
  - origen (Ascending) + stockActual (Descending)

ventas:
  - clienteId (Ascending) + fecha (Descending)
  - fecha (Ascending) + estatus (Ascending)

clientes:
  - bloqueado (Ascending) + nombre (Ascending)
  - creditoDisponible (Ascending)
```

---

## 💻 Uso del Sistema

### 1. Gestión de Órdenes de Compra

```typescript
// Crear nueva orden
import { useOrdenesCompra } from '@/apps/FlowDistributor/hooks/useOrdenesCompra'

const { createOrden, isCreating } = useOrdenesCompra()

const nuevaOrden = {
  id: 'OC-001',
  fecha: '2025-01-15',
  origen: 'Distribuidor ABC',
  cantidad: 1000,
  costoDistribuidor: 45000,  // USD
  costoTransporte: 5000,      // USD
  stockMinimo: 100,
  estado: 'pendiente',
  moneda: 'USD'
}

createOrden(nuevaOrden)
```

### 2. Registrar Ventas (con validación de stock)

```typescript
import { useVentas } from '@/apps/FlowDistributor/hooks/useVentas'

const { createVenta, isCreating } = useVentas()

const nuevaVenta = {
  fecha: '2025-01-20',
  ocRelacionada: 'OC-001',  // Opcional
  cantidad: 100,
  cliente: 'Cliente XYZ',
  precioVenta: 550,          // USD
  flete: 50,                 // USD
  moneda: 'USD'
}

// Automáticamente:
// - Valida stock disponible
// - Actualiza stock de la OC
// - Calcula utilidad y margen
createVenta(nuevaVenta)
```

### 3. Gestión de Clientes

```typescript
import { useClientes } from '@/apps/FlowDistributor/hooks/useClientes'

const { createCliente, bloquearCliente } = useClientes()

const nuevoCliente = {
  nombre: 'Empresa ABC S.A.',
  rfc: 'ABC123456DEF',
  telefono: '+52 555-1234',
  email: 'contacto@abc.com',
  creditoAutorizado: 100000,  // USD
  diasCredito: 30
}

createCliente(nuevoCliente)

// Bloquear cliente por morosidad
bloquearCliente('cliente-id', 'Pago vencido hace 60 días')
```

---

## 🧪 Testing

### Unit Tests

```bash
# Ejecutar todos los tests
npm run test

# Con coverage
npm run test:coverage

# Watch mode
npm run test:watch

# Test específico
npm run test -- ordenesCompra.service.test.ts
```

### E2E Tests

```bash
# Ejecutar tests E2E
npm run test:e2e

# Con UI
npm run test:e2e:ui

# Modo debug
npm run test:e2e:debug
```

### Estructura de Tests

```
__tests__/
├── services/
│   ├── ordenesCompra.service.test.ts
│   ├── ventas.service.test.ts
│   └── clientes.service.test.ts
├── utils/
│   └── formatters.test.ts
├── hooks/
│   ├── useOrdenesCompra.test.ts
│   └── useVentas.test.ts
└── components/
    ├── OrdenCompraForm.test.tsx
    └── VentaForm.test.tsx
```

---

## 📊 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor desarrollo (puerto 5173)
npm run dev:host         # Servidor accesible en red local

# Build
npm run build            # Build producción
npm run preview          # Preview del build

# Testing
npm run test             # Unit tests
npm run test:e2e         # E2E tests
npm run test:coverage    # Coverage report

# Linting
npm run lint             # ESLint
npm run lint:fix         # ESLint con autofix
npm run format           # Prettier

# Firebase
npm run deploy           # Deploy a Firebase Hosting
npm run deploy:functions # Deploy Cloud Functions
npm run deploy:rules     # Deploy Firestore Rules

# Utilidades
npm run analyze          # Analizar bundle
npm run clean            # Limpiar cache
npm run typecheck        # Verificar tipos TypeScript
```

---

## 📈 Monitoreo y Analytics

### Sentry (Error Tracking)

```typescript
// Configurado en src/lib/sentry.ts
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0
})
```

### Google Analytics 4

```typescript
// Configurado en src/lib/analytics.ts
import { getAnalytics, logEvent } from 'firebase/analytics'

const analytics = getAnalytics(app)

// Trackear eventos
logEvent(analytics, 'venta_registrada', {
  monto: 55000,
  moneda: 'USD',
  cliente: 'Cliente XYZ'
})
```

---

## 🔒 Seguridad

### Best Practices Implementadas

✅ **Validación de datos** con Zod en cliente y servidor
✅ **Sanitización de inputs** para prevenir XSS
✅ **CORS** configurado correctamente
✅ **Variables de entorno** para secrets
✅ **Firestore Rules** con permisos granulares
✅ **Rate limiting** en operaciones sensibles
✅ **Auditoría** de todas las operaciones críticas
✅ **Encriptación** de datos sensibles en tránsito (HTTPS)

---

## 🌐 Deploy en Producción

### Firebase Hosting

```bash
# 1. Build optimizado
npm run build

# 2. Preview local
npm run preview

# 3. Deploy a Firebase
firebase deploy --only hosting

# 4. Deploy con funciones
firebase deploy
```

### Variables de Entorno en Producción

```bash
# En Firebase Console → Project Settings → Service Accounts
# Configurar:
firebase functions:config:set \
  app.url="https://tu-dominio.com" \
  app.env="production"
```

---

## 📝 Changelog

### v2.0.0 (2025-01-XX)

**🎉 Major Release - Sistema Completo**

#### ✨ Nuevas Funcionalidades
- ✅ Sistema completo de Órdenes de Compra con control de stock
- ✅ Ventas con validación automática de inventario
- ✅ Gestión de clientes con crédito y bloqueos
- ✅ Formularios con validación en tiempo real (React Hook Form + Zod)
- ✅ Tablas con sorting, filtering y búsqueda
- ✅ Dashboard con métricas en tiempo real
- ✅ Integración completa con Firebase Firestore
- ✅ Moneda base en USD (Dólares)

#### 🔧 Mejoras Técnicas
- ✅ TypeScript estricto en todo el código
- ✅ React Query para caching optimizado
- ✅ Zustand para estado global
- ✅ Transacciones de Firestore para operaciones críticas
- ✅ Error Boundaries y manejo de errores robusto
- ✅ Lazy loading y code splitting
- ✅ Accesibilidad WCAG AA completa

#### 📚 Documentación
- ✅ README completo con guías de uso
- ✅ Análisis detallado del sistema
- ✅ Documentación de arquitectura
- ✅ Guías de testing

---

## 🤝 Contribución

### Cómo Contribuir

1. Fork el proyecto
2. Crear branch de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'feat: añadir nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

### Convención de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formateo, punto y coma faltante, etc
refactor: refactorización de código
test: añadir tests
chore: actualizar dependencias, etc
```

---

## 📞 Soporte

- **Issues:** [GitHub Issues](https://github.com/tu-org/premium-ecosystem/issues)
- **Discusiones:** [GitHub Discussions](https://github.com/tu-org/premium-ecosystem/discussions)
- **Email:** soporte@tuempresa.com

---

## 📄 Licencia

Copyright © 2025 Premium Ecosystem
Todos los derechos reservados.

---

## 🙏 Agradecimientos

- React Team por React 18
- Vercel por Vite
- Firebase Team por Firebase v12
- TanStack por React Query
- Tailwind Labs por TailwindCSS

---

**Desarrollado con ❤️ por el equipo de Premium Ecosystem**
