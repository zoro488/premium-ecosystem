# 🚀 FlowDistributor - Sistema de Gestión Empresarial

**Sistema completo de administración comercial con gestión de compras, ventas, clientes e inventario**

💵 **Moneda del Sistema: USD (Dólares Estadounidenses)**

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Testing](#testing)
- [Deployment](#deployment)
- [Documentación](#documentación)

---

## ✨ Características

### 💰 Gestión Financiera (USD)
- ✅ **Órdenes de Compra**: Gestión completa con tracking de estados
- ✅ **Ventas**: Control de ventas con cálculo automático de utilidades
- ✅ **Clientes**: CRM con gestión de créditos en USD
- ✅ **Inventario**: Control de stock con alertas automáticas
- ✅ **Dashboard**: Métricas en tiempo real y analíticas

### 🔒 Seguridad
- ✅ Sistema de roles (Admin, Gerente, Vendedor)
- ✅ Autenticación con Firebase Auth
- ✅ Firestore Security Rules robustas
- ✅ Validación de datos en cliente y servidor
- ✅ Auditoría completa de acciones

### 📊 Reportes y Analíticas
- ✅ Dashboard con métricas clave
- ✅ Reportes de ventas y utilidades
- ✅ Análisis de inventario
- ✅ Seguimiento de cuentas por cobrar
- ✅ Exportación a CSV

### 🎨 UI/UX
- ✅ Interfaz moderna y responsiva
- ✅ Dark mode
- ✅ Componentes reutilizables
- ✅ Formularios con validación en tiempo real
- ✅ Notificaciones toast

---

## 🛠 Tecnologías

### Frontend
- **React 18** - Librería UI
- **TypeScript** - Tipado estricto
- **Vite** - Build tool
- **TailwindCSS** - Estilos
- **React Query** - State management para servidor
- **Zustand** - State management global
- **React Hook Form** - Formularios
- **Zod** - Validación de esquemas
- **Lucide React** - Iconos

### Backend
- **Firebase v12**
  - Firestore - Base de datos
  - Auth - Autenticación
  - Storage - Almacenamiento
  - Analytics - Métricas
  - Hosting - Deploy

### Testing
- **Vitest** - Unit tests
- **Playwright** - E2E tests
- **Testing Library** - Component tests

### DevOps
- **ESLint** - Linting
- **Prettier** - Formatting
- **GitHub Actions** - CI/CD
- **Sentry** - Error tracking

---

## 📦 Instalación

### Requisitos Previos
- Node.js 18+
- npm/yarn/pnpm
- Firebase CLI
- Python 3.8+ (para scripts)

### 1. Clonar Repositorio
```bash
git clone https://github.com/your-org/flowdistributor.git
cd flowdistributor
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Instalar Dependencias Específicas de FlowDistributor
```bash
npm install sonner zod @tanstack/react-query zustand firebase react-hook-form @hookform/resolvers lucide-react
```

### 4. Configurar Variables de Entorno
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de Firebase:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## ⚙️ Configuración

### Configurar Firebase

1. **Crear Proyecto en Firebase Console**
   - Ir a https://console.firebase.google.com
   - Crear nuevo proyecto
   - Habilitar Firestore, Auth, Storage

2. **Configurar Authentication**
   ```bash
   # Habilitar Email/Password en Firebase Console
   # Auth > Sign-in method > Email/Password > Enable
   ```

3. **Deploy Firestore Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

4. **Crear Índices de Firestore** (si es necesario)
   ```bash
   firebase deploy --only firestore:indexes
   ```

### Configurar Roles de Usuario

Crear primer usuario admin manualmente en Firestore:

```javascript
// En Firestore Console
// Colección: usuarios
// Documento ID: [UID del usuario]
{
  "email": "admin@example.com",
  "rol": "admin",
  "nombre": "Administrador",
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

---

## 🚀 Uso

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev

# El servidor estará disponible en http://localhost:5173
```

### Build
```bash
# Crear build de producción
npm run build

# Preview del build
npm run preview
```

### Linting & Formatting
```bash
# Ejecutar ESLint
npm run lint

# Corregir problemas automáticamente
npm run lint:fix

# Formatear código con Prettier
npm run format
```

### Scripts Útiles
```bash
# Limpiar caché y node_modules
npm run clean:all

# Quick deploy (lint + test + build + deploy)
npm run quick-deploy
```

---

## 📁 Estructura del Proyecto

```
src/apps/FlowDistributor/
├── components/
│   ├── forms/
│   │   ├── OrdenCompraForm.tsx     # Formulario de órdenes
│   │   └── VentaForm.tsx           # Formulario de ventas
│   ├── tables/
│   │   ├── OrdenesCompraTable.tsx  # Tabla de órdenes
│   │   ├── VentasTable.tsx         # Tabla de ventas
│   │   └── ClientesTable.tsx       # Tabla de clientes
│   └── dashboard/
│       └── DashboardMetrics.tsx    # Métricas del dashboard
├── hooks/
│   ├── useOrdenesCompra.ts         # Hook para órdenes
│   ├── useVentas.ts                # Hook para ventas
│   └── useClientes.ts              # Hook para clientes
├── services/
│   ├── ordenesCompra.service.ts    # Servicio de órdenes
│   ├── ventas.service.ts           # Servicio de ventas
│   └── clientes.service.ts         # Servicio de clientes
├── stores/
│   └── flowDistributor.store.ts    # Store global con Zustand
├── types/
│   └── index.ts                    # Tipos TypeScript
├── schemas/
│   └── ordenCompra.schema.ts       # Esquemas de validación
├── utils/
│   └── formatters.ts               # Utilidades de formateo
└── README.md                       # Este archivo
```

---

## 🧪 Testing

### Unit Tests
```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests con UI
npm run test:ui

# Ejecutar tests con coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### E2E Tests
```bash
# Ejecutar tests E2E
npm run test:e2e

# Ejecutar E2E en modo UI
npm run test:e2e:ui
```

### Coverage Goal
- **Target**: 80%+ coverage
- **Archivos críticos**: Servicios, Hooks, Utilidades

---

## 🌐 Deployment

### Deploy a Firebase Hosting
```bash
# Deploy completo
npm run deploy

# Deploy solo hosting
firebase deploy --only hosting

# Deploy solo rules
firebase deploy --only firestore:rules

# Deploy preview (con URL temporal)
npm run deploy:preview
```

### Deploy con GitHub Actions
El proyecto incluye workflows de CI/CD que se ejecutan automáticamente:

- **PR Check**: Lint + Tests al crear PR
- **Deploy Preview**: Deploy temporal en PR
- **Deploy Production**: Deploy automático en merge a `main`

---

## 📚 Documentación

### Documentos Principales
- [`ANALISIS_FLOWDISTRIBUTOR.md`](../../ANALISIS_FLOWDISTRIBUTOR.md) - Análisis completo del sistema
- [`RESUMEN_EJECUTIVO_FLOWDISTRIBUTOR.md`](../../RESUMEN_EJECUTIVO_FLOWDISTRIBUTOR.md) - Resumen ejecutivo de implementación
- [`IMPLEMENTACION_FLOWDISTRIBUTOR.md`](../../IMPLEMENTACION_FLOWDISTRIBUTOR.md) - Detalles de implementación

### Guías de Uso
```
docs/
├── API.md              # Documentación de API
├── COMPONENTS.md       # Guía de componentes
├── HOOKS.md            # Guía de hooks
├── SERVICES.md         # Guía de servicios
└── DEPLOYMENT.md       # Guía de deployment
```

### JSDoc
Todos los servicios, hooks y utilidades están documentados con JSDoc:

```typescript
/**
 * Crea una nueva orden de compra en Firestore
 * @param orden - Datos de la orden a crear
 * @returns ID de la orden creada
 * @throws Error si la validación falla
 */
async crear(orden: OrdenCompra): Promise<string>
```

---

## 💻 Comandos Disponibles

### Desarrollo
| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |

### Testing
| Comando | Descripción |
|---------|-------------|
| `npm run test` | Ejecutar unit tests |
| `npm run test:ui` | Tests con interfaz |
| `npm run test:coverage` | Tests con coverage |
| `npm run test:e2e` | Tests E2E con Playwright |

### Calidad de Código
| Comando | Descripción |
|---------|-------------|
| `npm run lint` | Ejecutar ESLint |
| `npm run lint:fix` | Corregir problemas automáticamente |
| `npm run format` | Formatear con Prettier |

### Deployment
| Comando | Descripción |
|---------|-------------|
| `npm run deploy` | Deploy completo a Firebase |
| `npm run deploy:preview` | Deploy preview temporal |
| `npm run quick-deploy` | Lint + Test + Build + Deploy |

### Utilidades
| Comando | Descripción |
|---------|-------------|
| `npm run clean` | Limpiar build cache |
| `npm run clean:all` | Limpiar todo (node_modules + cache) |

---

## 🐛 Troubleshooting

### Problema: Errores de TypeScript
**Solución:**
```bash
# Limpiar caché
npm run clean

# Reinstalar dependencias
npm install

# Reiniciar VS Code TypeScript server
# Cmd/Ctrl + Shift + P > "TypeScript: Restart TS Server"
```

### Problema: Firebase no conecta
**Solución:**
1. Verificar variables de entorno en `.env`
2. Verificar que el proyecto esté activo en Firebase Console
3. Verificar reglas de Firestore

### Problema: Tests fallan
**Solución:**
```bash
# Limpiar cache de tests
npm run test -- --clearCache

# Ejecutar tests en modo watch para debug
npm run test:watch
```

---

## 🤝 Contribución

### Flujo de Trabajo
1. Fork del repositorio
2. Crear branch: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Convenciones de Código
- TypeScript estricto
- ESLint + Prettier configurados
- Commits siguiendo [Conventional Commits](https://www.conventionalcommits.org/)
- Tests requeridos para nuevas funcionalidades

---

## 📄 Licencia

Este proyecto es privado y propietario. Todos los derechos reservados.

---

## 👥 Equipo

- **Desarrolladores**: Tu Equipo
- **Arquitectura**: GitHub Copilot AI
- **Análisis**: Sistema de IA Avanzada

---

## 📞 Soporte

Para soporte técnico:
- Email: support@flowdistributor.com
- Slack: #flowdistributor-support
- Documentación: https://docs.flowdistributor.com

---

## 🎯 Roadmap

### ✅ Fase 1 - MVP (Completado)
- [x] Órdenes de compra
- [x] Ventas
- [x] Clientes
- [x] Dashboard básico

### ⏳ Fase 2 - Mejoras (En Progreso)
- [ ] Reportes avanzados
- [ ] Gráficos interactivos
- [ ] Exportación a Excel/PDF
- [ ] Notificaciones push

### 📋 Fase 3 - Enterprise (Planificado)
- [ ] Multi-tenant
- [ ] API REST pública
- [ ] Integraciones (SAT, Stripe)
- [ ] App móvil

---

**Última actualización:** 2025-01-XX
**Versión:** 1.0.0
**Moneda:** 💵 USD
