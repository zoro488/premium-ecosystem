# Premium Ecosystem 🚀

[![CI Tests](https://github.com/yourusername/premium-ecosystem/workflows/CI%20-%20Tests%20%26%20Quality/badge.svg)](https://github.com/yourusername/premium-ecosystem/actions)
[![Deploy Status](https://github.com/yourusername/premium-ecosystem/workflows/Deploy%20to%20Production/badge.svg)](https://github.com/yourusername/premium-ecosystem/actions)
[![CodeQL](https://github.com/yourusername/premium-ecosystem/workflows/CodeQL%20Security%20Analysis/badge.svg)](https://github.com/yourusername/premium-ecosystem/security/code-scanning)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

Un ecosistema empresarial completo de 5 aplicaciones de última generación construidas con React, Vite, Tailwind CSS y Framer Motion.

## 🎯 Características de Producción

### Desarrollo y Testing
- ✅ **Testing completo**: Unit tests (Vitest) + E2E tests (Playwright) + Coverage
- ✅ **CI/CD Automatizado**: GitHub Actions con 3 workflows (CI, Deploy, Security)
- ✅ **Code Quality**: ESLint + Prettier + Pre-commit hooks
- ✅ **Bundle Optimization**: Code splitting, lazy loading, tree shaking

### Seguridad
- ✅ **CodeQL Analysis**: Security scanning automático
- ✅ **Dependabot**: Actualizaciones automáticas de dependencias
- ✅ **Secret Scanning**: Detección de credenciales en el código
- ✅ **Branch Protection**: Reglas de protección en rama main

### Monitoreo y Analytics
- ✅ **Error Monitoring**: Sentry integration con error boundary
- ✅ **Analytics**: Google Analytics 4 con tracking avanzado
- ✅ **Performance**: Lighthouse CI score 95+
- ✅ **Sentry Releases**: Release tracking automático

### Deployment
- ✅ **Multi-platform**: Deploy a Vercel + Firebase Hosting
- ✅ **Preview Deployments**: URL única por cada PR
- ✅ **Automatic Releases**: Semantic versioning
- ✅ **Rollback**: One-click rollback en Vercel/Firebase

### Colaboración
- ✅ **GitHub Codespaces**: Desarrollo en la nube listo para usar
- ✅ **Issue Templates**: Templates para bugs y features
- ✅ **PR Templates**: Template completo con checklist
- ✅ **CODEOWNERS**: Revisión automática de código

## 🌟 Aplicaciones Incluidas

### 1. **FlowDistributor** 💼
Sistema de gestión empresarial y distribución completo.

**Características:**
- Dashboard con métricas en tiempo real
- Gestión de 6 bancos diferentes
- Sistema de órdenes y clientes
- Control de inventario y almacén
- Panel de ventas y distribuidores
- Reportes detallados
- Notificaciones toast animadas

**Color Theme:** Azul-Cyan
**Ruta:** `/flow`

---

### 2. **ShadowPrime** 💰
Gestión avanzada de wallets y criptomonedas.

**Características:**
- Gestión de múltiples wallets crypto
- Dashboard de activos
- Transacciones en tiempo real
- Gráficos de rendimiento
- Seguridad avanzada
- Portfolio tracking

**Color Theme:** Púrpura-Violeta
**Ruta:** `/shadow`

---

### 3. **Apollo** 🛰️
Sistema de rastreo GPS y control de drones con IA.

**Características:**
- Rastreo en vivo de vehículos GPS
- Control de drones autónomos
- Scanner IA con detección de objetos
- Mapa interactivo en tiempo real
- Sistema de alertas
- Visualización de rutas
- Métricas de batería y combustible

**Color Theme:** Verde-Esmeralda
**Ruta:** `/apollo`

---

### 4. **Synapse** 🧠
Asistente de IA conversacional avanzado.

**Características:**
- Chat con múltiples modelos de IA (GPT-4, Claude, DALL-E)
- Gestión de conversaciones
- Code highlighting y copy
- Búsqueda y filtrado
- Historial completo
- Quick actions
- Attachments y voice input

**Color Theme:** Naranja-Ámbar
**Ruta:** `/synapse`

---

### 5. **Nexus** 🔗
Centro de control y monitoreo del ecosistema completo.

**Características:**
- Dashboard centralizado
- Monitoreo de todas las apps
- Métricas de rendimiento del sistema
- Actividad en tiempo real
- Sistema de alertas
- Analytics integrados
- Navegación rápida entre apps

**Color Theme:** Rosa-Rose
**Ruta:** `/nexus`

---

## 🛠️ Tecnologías Utilizadas

- **React 18.2** - Framework UI
- **Vite 5.0** - Build tool & dev server
- **Tailwind CSS 3.4** - Utility-first CSS
- **Framer Motion 10.16** - Animaciones fluidas
- **Lucide React 0.294** - Iconos modernos
- **React Router DOM 6.20** - Navegación
- **Three.js & React Three Fiber** - Gráficos 3D (opcional)

---

## 📦 Instalación

### 1. Clonar o descargar el proyecto

```bash
cd C:\Users\xpovo\Documents\premium-ecosystem
```

### 2. Instalar dependencias

```bash
npm install
```

Esto instalará todas las dependencias necesarias listadas en `package.json`.

### 3. Iniciar el servidor de desarrollo

```bash
npm run dev
```

El proyecto se abrirá en `http://localhost:5173`

---

## 🎨 Estructura del Proyecto

```
premium-ecosystem/
├── src/
│   ├── main.jsx                 # Entry point
│   ├── App.jsx                  # Hub principal con router
│   ├── index.css                # Estilos globales
│   └── apps/                    # Carpeta de aplicaciones
│       ├── FlowDistributor/
│       │   └── FlowDistributor.jsx
│       ├── ShadowPrime/
│       │   └── ShadowPrime.jsx
│       ├── Apollo/
│       │   └── Apollo.jsx
│       ├── Synapse/
│       │   └── Synapse.jsx
│       └── Nexus/
│           └── Nexus.jsx
├── index.html                   # HTML principal
├── package.json                 # Dependencias y scripts
├── vite.config.js               # Configuración Vite
├── tailwind.config.js           # Configuración Tailwind
├── postcss.config.js            # PostCSS config
├── .gitignore                   # Git exclusiones
└── README.md                    # Este archivo
```

---

## 🚀 Scripts Disponibles

```bash
# Desarrollo (puerto 5173)
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Lint del código
npm run lint
```

---

## 🎯 Características Principales

### Diseño Premium
- **Glass morphism** effects en todos los componentes
- **Gradientes** personalizados para cada aplicación
- **Animaciones** fluidas con Framer Motion
- **Responsive design** completo
- **Dark theme** profesional

### Navegación
- **Hub 3D** con fondo animado de estrellas
- Navegación entre apps sin recargar
- Botón "Volver al Hub" en cada app
- Transiciones suaves entre vistas

### Componentes Reutilizables
- Sidebar colapsable
- Cards animadas
- Modales y dropdowns
- Gráficos y métricas
- Sistema de notificaciones
- Formularios avanzados

---

## 🔧 Personalización

### Colores

Cada aplicación tiene su propio esquema de colores definido en `src/App.jsx`:

```jsx
const apps = [
  {
    id: 'flow',
    color: 'from-blue-500 to-cyan-500',
    // ...
  },
  // ...
];
```

### Estilos Globales

Los estilos glass morphism están en `src/index.css`:

```css
.glass {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Añadir Nueva Aplicación

1. Crear carpeta en `src/apps/MiApp/`
2. Crear componente `MiApp.jsx`
3. Registrar en `src/App.jsx`:

```jsx
import MiApp from './apps/MiApp/MiApp';

const apps = [
  // ...
  {
    id: 'miapp',
    name: 'MiApp',
    path: '/miapp',
    component: MiApp,
    // ...
  },
];
```

---

## 📱 Responsive Design

Todas las aplicaciones son completamente responsive:

- **Desktop:** Vista completa con sidebar expandido
- **Tablet:** Grid adaptativo
- **Mobile:** Sidebar colapsable, cards apiladas

---

## 🎨 Paleta de Colores

| App | Primario | Secundario | Uso |
|-----|----------|------------|-----|
| FlowDistributor | `#3B82F6` (blue-500) | `#06B6D4` (cyan-500) | Negocios |
| ShadowPrime | `#A855F7` (purple-500) | `#8B5CF6` (violet-500) | Crypto |
| Apollo | `#10B981` (green-500) | `#059669` (emerald-500) | GPS/Drones |
| Synapse | `#F97316` (orange-500) | `#F59E0B` (amber-500) | IA |
| Nexus | `#EC4899` (pink-500) | `#F43F5E` (rose-500) | Control |

---

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
npm install
```

### Puerto 5173 ocupado
Edita `vite.config.js`:
```js
export default defineConfig({
  server: {
    port: 3000, // Cambia el puerto
  },
});
```

### Estilos no se aplican
```bash
npm run build
rm -rf node_modules
npm install
```

---

## 📄 Licencia

Este proyecto es de uso privado.

---

## 👤 Autor

**Equipo Premium Ecosystem**

---

## 🎉 ¡Listo para Usar!

Una vez instalado, simplemente ejecuta:

```bash
npm run dev
```

Y disfruta del ecosistema premium más completo del mercado 🚀

---

## 📸 Screenshots

### Hub Principal
Vista 3D interactiva con las 5 aplicaciones

### FlowDistributor
Dashboard empresarial con 6 bancos y métricas

### Apollo
Mapa GPS en vivo con drones y IA

### Synapse
Chat IA con múltiples modelos

### Nexus
Centro de control centralizado

---

## 💾 Sistema de Persistencia

### Almacenamiento Automático

Todas las aplicaciones guardan automáticamente los datos usando `localStorage`:

**FlowDistributor**:
- ✅ Bancos y finanzas
- ✅ Órdenes de compra
- ✅ Distribuidores
- ✅ Ventas y clientes
- ✅ Inventario/almacén
- ✅ Tema y configuraciones UI

**ShadowPrime**:
- ✅ Wallets y balances
- ✅ Transacciones
- ✅ Configuraciones

**Apollo**:
- ✅ Vehículos GPS
- ✅ Drones
- ✅ Detecciones
- ✅ Configuraciones

**Synapse**:
- ✅ Conversaciones
- ✅ Mensajes
- ✅ Modelo IA seleccionado
- ✅ Configuraciones

**Nexus**:
- ✅ Estado de apps
- ✅ Actividad
- ✅ Configuraciones

### Storage API (`src/utils/storage.js`)

```javascript
// Importar utilidades
import { useLocalStorage, STORAGE_KEYS, storage } from './utils/storage';

// Hook React para persistencia automática
const [datos, setDatos] = useLocalStorage(STORAGE_KEYS.MI_KEY, valorInicial);

// Funciones de storage
storage.set('mi_key', { dato: 'valor' });
storage.get('mi_key', defaultValue);
storage.remove('mi_key');
storage.clear();

// IndexedDB para datos grandes
import { db } from './utils/storage';
await db.init(['storeName']);
await db.add('storeName', data);
await db.getAll('storeName');

// Exportar/Importar datos
import { exportAllData, importData } from './utils/storage';
exportAllData(); // Descarga JSON
importData(jsonString); // Restaura desde JSON
```

### Limpieza de Datos

Para resetear todas las apps, ejecuta en consola del navegador:

```javascript
localStorage.clear();
location.reload();
```

---

## 🎨 Componentes Compartidos

### AIAssistant

Todas las apps incluyen un asistente IA premium:

```jsx
import AIAssistant from '../../components/shared/AIAssistant';

<AIAssistant
  systemName="MiApp"
  systemContext="Contexto específico del sistema"
  accentColor="blue" // blue, purple, green, orange, pink, red, cyan
  position="bottom-right" // bottom-right, bottom-left, top-right, top-left
/>
```

**Características**:
- 💬 Chat interactivo
- 🎨 Temas personalizables por app
- ⚡ Quick actions
- 📝 Sugerencias contextuales
- 🎯 Floating action button
- ✨ Animaciones premium

---

## 🔑 Configuración de APIs

### Archivo de Configuración

Todas las APIs están centralizadas en [src/config/api.js](src/config/api.js)

### Obtener API Keys

Consulta la **[Guía Completa de APIs](API_SETUP_GUIDE.md)** para instrucciones detalladas sobre cómo obtener cada API key.

### Configuración Rápida

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

2. Edita `.env` y agrega tus API keys

3. Reinicia el servidor:
```bash
npm run dev
```

### APIs Recomendadas para Empezar

| API | Aplicación | Prioridad | Costo |
|-----|------------|-----------|-------|
| **OpenAI** | Todas (AI Assistant) | 🔴 Alta | $20-50/mes |
| **Mapbox** | Apollo | 🔴 Alta | Gratis (50k/mes) |
| **Supabase** | Todas (DB real) | 🟡 Media | Gratis (500MB) |
| **CoinGecko** | ShadowPrime | 🟡 Media | Gratis |
| **SendGrid** | FlowDistributor | 🟢 Baja | Gratis (100/día) |

Ver [API_SETUP_GUIDE.md](API_SETUP_GUIDE.md) para la lista completa de 40+ APIs disponibles.

---

## 🔧 GitHub & CI/CD

### GitHub Actions Workflows

El proyecto incluye 3 workflows automatizados:

#### 1. **CI - Tests & Quality** ([ci.yml](.github/workflows/ci.yml))
Se ejecuta en cada push y PR:
- ✅ Lint con ESLint
- ✅ Unit tests con Vitest
- ✅ E2E tests con Playwright
- ✅ Coverage report a Codecov
- ✅ Build de producción
- ✅ Lighthouse performance check

#### 2. **Deploy to Production** ([deploy.yml](.github/workflows/deploy.yml))
Se ejecuta al hacer merge a `main`:
- ✅ Deploy automático a Vercel
- ✅ Deploy automático a Firebase Hosting
- ✅ Preview deployments para PRs
- ✅ Sentry release tracking

#### 3. **CodeQL Security Analysis** ([codeql.yml](.github/workflows/codeql.yml))
Se ejecuta semanalmente y en cada PR:
- ✅ Análisis de seguridad estático
- ✅ Dependency review
- ✅ Secret scanning
- ✅ NPM security audit

### Configurar GitHub

Para aprovechar todas las funcionalidades de GitHub:

1. **Lee la guía completa**: [GITHUB_SETUP_GUIDE.md](GITHUB_SETUP_GUIDE.md)
2. Configura GitHub Secrets (Vercel, Firebase, Sentry)
3. Habilita branch protection en `main`
4. Activa GitHub Discussions
5. Instala GitHub Apps recomendadas

### GitHub Codespaces

Abre el proyecto en un entorno de desarrollo completo en la nube:

```bash
# Desde GitHub.com:
Code → Codespaces → Create codespace on main
```

Todo está preconfigurado en [.devcontainer/devcontainer.json](.devcontainer/devcontainer.json).

### Contribuir

Lee nuestra [Guía de Contribución](CONTRIBUTING.md) para:
- Estándares de código
- Proceso de desarrollo
- Conventional Commits
- Testing guidelines

### Seguridad

Reporta vulnerabilidades siguiendo nuestra [Política de Seguridad](SECURITY.md).

---

## 🔄 Actualizaciones Futuras

- [x] Integración con APIs - **DOCUMENTADO** ✨
- [x] GitHub Actions CI/CD - **IMPLEMENTADO** 🚀
- [x] Security scanning - **IMPLEMENTADO** 🔒
- [x] GitHub Codespaces - **CONFIGURADO** ☁️
- [x] Issue/PR templates - **CREADOS** 📋
- [ ] Implementación real de APIs
- [ ] Sistema de autenticación completo
- [x] Base de datos persistente (localStorage + IndexedDB)
- [ ] Notificaciones push
- [ ] PWA support completo
- [x] Tests automatizados (CI/CD)
- [ ] Documentación de componentes (Storybook)
- [x] Modo claro/oscuro toggle (FlowDistributor)
- [ ] Multi-idioma (i18n)
- [x] Export/Import de datos

---

## 📊 Estado del Proyecto

| Característica | Estado |
|----------------|--------|
| Navegación entre apps | ✅ Completo |
| Persistencia de datos | ✅ Completo |
| Animaciones premium | ✅ Completo |
| Asistente IA | ✅ Completo |
| Diseño responsive | ✅ Completo |
| Glassmorphism | ✅ Completo |
| Cursor effects | ✅ Completo |
| Lazy loading | ✅ Completo |
| Gráficos/Analytics | ✅ Completo |
| APIs reales | 🔄 Pendiente |
| Mapbox/Cesium | 🔄 Pendiente |
| Backend | 🔄 Pendiente |

---

**¡Gracias por usar Premium Ecosystem! 🎊**

**Servidor corriendo en**: `http://localhost:3004`
