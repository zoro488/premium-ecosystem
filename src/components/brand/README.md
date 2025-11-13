# 🌌 CHRONOS Brand Components

Sistema completo de branding ultra-premium para el ecosistema CHRONOS, inspirado en estética Interstellar con animaciones cósmicas épicas.

## 📦 Componentes Incluidos

### 1. **ChronosLogos** (4 variantes)
- ✨ **ChronosLogoFull**: Logo completo con planeta y eje cósmico
- ⚡ **ChronosLogoCompact**: Reloj cósmico con marcadores radiales
- 🎯 **ChronosLogoIcon**: Ícono minimalista con líneas paralelas
- 📝 **ChronosLogoWithText**: Logo + texto "CHRONOS PREMIUM ECOSYSTEM"

### 2. **ChronosSplashScreen**
- 🚀 Pantalla de carga estilo Interstellar
- ⏱️ Progreso animado con 6 fases
- 🌟 150 estrellas animadas
- 🔵 Anillos cósmicos rotatorios
- ✅ Indicador visual de "Sistema Listo"

### 3. **ChronosLoginPage**
- 🔐 Login con glassmorphism ultra-premium
- 📧 Email + Password con validación
- 🌐 Login social (Google, GitHub)
- 🎨 100 estrellas de fondo animadas
- 💫 Partículas flotantes cósmicas
- ⚠️ Manejo de errores integrado

### 4. **useChronosSplash** (Hook)
- 🎣 Control del estado del splash screen
- 📍 `showSplash`: Boolean del estado
- 🔄 `hideSplash()`: Función para ocultar

---

## 🚀 Instalación

```bash
# Ya está incluido en tu proyecto
# Los componentes están en: src/components/brand/
```

---

## 💻 Uso Básico

### App Completa (Splash → Login → Dashboard)

```jsx
import { useState } from 'react';
import {
  ChronosSplashScreen,
  ChronosLoginPage,
  useChronosSplash
} from './components/brand';

function App() {
  const { showSplash, hideSplash } = useChronosSplash();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Handler de login
  const handleLogin = async (email, password) => {
    // Tu lógica con Firebase
    await signInWithEmailAndPassword(auth, email, password);
    setIsAuthenticated(true);
  };

  // Handler de login social
  const handleSocialLogin = async (provider) => {
    const authProvider = provider === 'google'
      ? new GoogleAuthProvider()
      : new GithubAuthProvider();
    await signInWithPopup(auth, authProvider);
    setIsAuthenticated(true);
  };

  return (
    <>
      {showSplash && (
        <ChronosSplashScreen onComplete={hideSplash} />
      )}

      {!showSplash && !isAuthenticated && (
        <ChronosLoginPage
          onLogin={handleLogin}
          onSocialLogin={handleSocialLogin}
        />
      )}

      {!showSplash && isAuthenticated && (
        <Dashboard />
      )}
    </>
  );
}
```

### Usar Logos Individualmente

```jsx
import {
  ChronosLogoFull,
  ChronosLogoCompact,
  ChronosLogoIcon,
  ChronosLogoWithText
} from './components/brand';

// Logo Full (Splash, Hero)
<ChronosLogoFull size={280} animated={true} glowIntensity="high" />

// Logo Compact (Header)
<ChronosLogoCompact size={120} animated={true} />

// Logo Icon (Favicon, Sidebar)
<ChronosLogoIcon size={60} animated={true} />

// Logo con Texto (Landing)
<ChronosLogoWithText size={300} logoVariant="full" />
```

---

## 🎨 Props API

### ChronosLogoFull / Compact / Icon

| Prop | Type | Default | Descripción |
|------|------|---------|-------------|
| `size` | `number` | `200/120/60` | Tamaño del logo en px |
| `animated` | `boolean` | `true` | Activar animaciones |
| `glowIntensity` | `'low' \| 'medium' \| 'high'` | `'medium'` | Intensidad del resplandor |
| `className` | `string` | `''` | Clases CSS adicionales |

### ChronosLogoWithText

| Prop | Type | Default | Descripción |
|------|------|---------|-------------|
| `size` | `number` | `300` | Tamaño del contenedor |
| `logoVariant` | `'full' \| 'compact' \| 'icon'` | `'full'` | Variante del logo |
| `animated` | `boolean` | `true` | Activar animaciones |
| `glowIntensity` | `'low' \| 'medium' \| 'high'` | `'medium'` | Intensidad del resplandor |
| `className` | `string` | `''` | Clases CSS adicionales |

### ChronosSplashScreen

| Prop | Type | Required | Descripción |
|------|------|----------|-------------|
| `onComplete` | `() => void` | ✅ | Callback cuando termina (6s) |

### ChronosLoginPage

| Prop | Type | Required | Descripción |
|------|------|----------|-------------|
| `onLogin` | `(email: string, password: string) => Promise<void>` | ✅ | Handler de login email/password |
| `onSocialLogin` | `(provider: 'google' \| 'github') => Promise<void>` | ✅ | Handler de login social |

---

## 🎭 Animaciones Incluidas

### Logos
- 🔄 Rotación orbital (12-25s)
- ✨ Pulsación de estrellas (2-3s)
- 💫 Partículas flotantes (3-5s)
- 🌊 Efecto ondulante en líneas
- 🔆 Resplandor pulsante

### Splash Screen
- 🌟 150 estrellas parpadeantes
- 🔵 3 anillos cósmicos rotando (80s)
- 🌀 5 partículas orbitales (25s)
- 📊 Barra de progreso animada
- ✨ Efecto shimmer en barra
- 💨 30 partículas flotantes
- 🎯 Resplandor central pulsante
- ✅ Animación "Sistema Listo"

### Login Page
- 🌌 100 estrellas de fondo
- 🔵 3 anillos cósmicos
- 💫 20 partículas flotantes
- 🎨 Gradiente radial dinámico
- 🪟 Glassmorphism en card
- ✨ Shimmer en botón
- 🔄 Indicador de carga

---

## 🎨 Paleta de Colores CHRONOS

```css
/* Primary */
--chronos-blue: #667eea;

/* Secondary */
--chronos-purple: #764ba2;

/* Accent */
--chronos-pink: #f093fb;

/* Highlight */
--chronos-red-pink: #f5576c;

/* Gradients */
background: linear-gradient(135deg, #667eea 0%, #764ba2 40%, #f093fb 70%, #f5576c 100%);
```

---

## 📁 Estructura de Archivos

```
src/components/brand/
├── ChronosLogos.jsx              # 4 variantes de logos
├── ChronosSplashScreen.jsx       # Splash screen épico
├── ChronosLoginPage.jsx          # Login ultra-premium
├── useChronosSplash.js           # Hook de control
├── index.js                      # Exportaciones
├── EXAMPLE_USAGE.jsx             # Ejemplos de uso
└── README.md                     # Esta documentación
```

---

## 🔧 Integración con Firebase Auth

```jsx
import { auth } from './lib/firebase';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup
} from 'firebase/auth';

<ChronosLoginPage
  onLogin={async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error(error.message);
    }
  }}
  onSocialLogin={async (provider) => {
    try {
      const authProvider = provider === 'google'
        ? new GoogleAuthProvider()
        : new GithubAuthProvider();
      await signInWithPopup(auth, authProvider);
    } catch (error) {
      throw new Error(error.message);
    }
  }}
/>
```

---

## 🎯 Casos de Uso

### 1. **Landing Page**
```jsx
<ChronosLogoWithText size={400} logoVariant="full" />
```

### 2. **Header / Navbar**
```jsx
<ChronosLogoCompact size={100} animated={false} />
```

### 3. **Favicon** (Exportar SVG)
```jsx
<ChronosLogoIcon size={32} animated={false} />
```

### 4. **Splash Screen con Timer Custom**
```jsx
const [showSplash, setShowSplash] = useState(true);

useEffect(() => {
  setTimeout(() => setShowSplash(false), 8000); // 8 segundos
}, []);

{showSplash && <ChronosSplashScreen onComplete={() => setShowSplash(false)} />}
```

---

## ⚡ Performance Tips

1. **Lazy Loading**: Carga el splash solo cuando se necesita
```jsx
const ChronosSplashScreen = lazy(() => import('./components/brand/ChronosSplashScreen'));
```

2. **Reducir Animaciones**: Para dispositivos lentos
```jsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<ChronosLogoFull animated={!prefersReducedMotion} />
```

3. **Preload del Logo**: Carga el logo antes del splash
```jsx
<link rel="preload" as="image" href="/logo-chronos.svg" />
```

---

## 🐛 Troubleshooting

### El splash no se oculta
**Solución**: Verifica que `onComplete` esté llamando a `hideSplash()`
```jsx
const { showSplash, hideSplash } = useChronosSplash();
<ChronosSplashScreen onComplete={hideSplash} /> ✅
```

### Animaciones lentas
**Solución**: Reduce el número de partículas o desactiva animaciones
```jsx
<ChronosLogoFull animated={false} />
```

### Login no funciona
**Solución**: Asegúrate de manejar errores correctamente
```jsx
const handleLogin = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    // 🚨 IMPORTANTE: Lanzar el error para que el componente lo capture
    throw new Error(error.message);
  }
};
```

---

## 📝 Changelog

### v1.0.0 (2024)
- ✅ ChronosLogos.jsx creado (4 variantes)
- ✅ ChronosSplashScreen.jsx creado (Interstellar-style)
- ✅ ChronosLoginPage.jsx creado (glassmorphism)
- ✅ useChronosSplash hook creado
- ✅ Sistema de colores CHRONOS definido
- ✅ Animaciones cósmicas implementadas
- ✅ Documentación completa

---

## 🤝 Contribuir

Si encuentras bugs o quieres mejorar los componentes:
1. Reporta issues específicos
2. Propón mejoras con ejemplos
3. Mantén la estética cósmica CHRONOS

---

## 📄 Licencia

Parte del ecosistema **premium-ecosystem** de CHRONOS.

---

## 🎉 ¡Listo para usar!

Ahora tienes un sistema de branding completo ultra-premium. Implementa estos componentes y tendrás una experiencia de usuario que rivaliza con **Stripe**, **Vercel**, **Linear** y **Notion**.

**¿Necesitas ayuda?** Revisa `EXAMPLE_USAGE.jsx` para ver más ejemplos.

---

**Made with 💜 for CHRONOS Premium Ecosystem**
