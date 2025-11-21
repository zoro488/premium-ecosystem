# 👑 Guía Completa: Buchona Assistant

## 🎯 ¿Qué es?

**BuchonaAssistant** es un personaje animado e interactivo que flota sobre toda la interfaz, reacciona a las acciones del usuario, y proporciona feedback visual y contextual en tiempo real.

## 🎨 Características Principales

### 1. Estados Emocionales (7)
- **idle**: Estado de reposo con animación de respiración
- **thinking**: Pensando con partículas brillantes
- **celebrating**: Celebrando con explosión de partículas
- **working**: Trabajando con rayos
- **surprised**: Sorprendida
- **confident**: Confiada con brillo en lentes
- **dancing**: Bailando con movimiento de cabello

### 2. Sistema de Partículas
- Partículas doradas, rosas y moradas
- Física realista (gravedad, velocidad)
- Se activa en celebraciones y eventos especiales

### 3. Movimiento Inteligente
- **Drag & Drop**: Arrastrar con el mouse
- **Auto-movimiento**: Se mueve automáticamente cada 15 segundos
- **Movimiento a componentes**: Puede ir a elementos específicos

### 4. Interacciones
- **Click**: Celebración aleatoria
- **Double Click**: Explosión de partículas
- **Hover**: Muestra botones de acción rápida
- **Drag**: Movimiento libre

### 5. Estética Buchona
- Chaleco táctico con bordes dorados
- Cadenas de oro con medallón
- Corona (accesorio)
- Lentes oscuros
- Aretes grandes
- Cabello negro
- Colores: Rosa (#FF1493), Oro (#FFD700), Morado (#9D00FF)

## 📦 Instalación

Ya está integrada en `App.jsx`, pero si quieres usarla en un componente específico:

```jsx
import BuchonaAssistant from './components/shared/BuchonaAssistant';

function MiComponente() {
  return (
    <>
      {/* Tu contenido */}

      <BuchonaAssistant
        onInteract={(action) => console.log('Acción:', action)}
        initialPosition={{ x: 100, y: 100 }}
      />
    </>
  );
}
```

## 🎮 Uso del Hook de Integración

El hook `useBuchonaIntegration` permite controlar la buchona desde cualquier componente:

### Ejemplo Básico

```jsx
import { useBuchonaIntegration } from '../hooks/useBuchonaIntegration';

function MiPanel() {
  const buchona = useBuchonaIntegration();

  const handleSuccess = () => {
    // Celebrar cuando algo sale bien
    buchona.trackInteraction('success');
  };

  const handleError = () => {
    // Reaccionar a errores
    buchona.trackInteraction('error');
  };

  return (
    <div>
      <button onClick={handleSuccess}>
        Guardar
      </button>

      <button onClick={() => buchona.celebrate()}>
        ¡Celebrar!
      </button>
    </div>
  );
}
```

### Ejemplo Avanzado

```jsx
import { useBuchonaIntegration } from '../hooks/useBuchonaIntegration';

function Dashboard() {
  const buchona = useBuchonaIntegration();

  // Celebrar cuando se cargan datos
  useEffect(() => {
    if (dataLoaded) {
      buchona.say('¡Datos listos! 📊', 'confident');
    }
  }, [dataLoaded]);

  // Ir a un componente específico
  const handleViewDetails = (itemId) => {
    buchona.moveToComponent(`item-${itemId}`);
    buchona.say('¡Vamos a ver eso! 👀', 'working');
  };

  // Bailar cuando se completa una tarea
  const handleTaskComplete = () => {
    buchona.dance();
    setTimeout(() => {
      buchona.say('¡De lujo! 💎', 'celebrating');
    }, 1000);
  };

  return (
    <div>
      {/* Botones de control */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => buchona.celebrate()}>
          Celebrar
        </button>
        <button onClick={() => buchona.think()}>
          Pensar
        </button>
        <button onClick={() => buchona.dance()}>
          Bailar
        </button>
        <button onClick={() => buchona.toggle()}>
          Mostrar/Ocultar
        </button>
      </div>

      {/* Lista con IDs para navegación */}
      {items.map(item => (
        <div key={item.id} id={`item-${item.id}`}>
          <h3>{item.title}</h3>
          <button onClick={() => handleViewDetails(item.id)}>
            Ver Detalles
          </button>
        </div>
      ))}

      {/* Estado de la buchona */}
      <div className="fixed bottom-4 right-4 glass p-4 rounded-xl">
        <p>Estado: {buchona.state.emotional}</p>
        <p>Mensaje: {buchona.state.message}</p>
        <p>Visible: {buchona.state.isVisible ? 'Sí' : 'No'}</p>
      </div>
    </div>
  );
}
```

## 🎯 API del Hook

### Estado

```typescript
interface BuchonaState {
  emotional: 'idle' | 'celebrating' | 'thinking' | 'working' | 'surprised' | 'confident' | 'dancing';
  position: { x: number; y: number };
  message: string;
  isVisible: boolean;
}
```

### Métodos

#### `trackInteraction(type, target?)`
Registra una interacción del usuario:
```jsx
buchona.trackInteraction('success'); // Celebra
buchona.trackInteraction('error'); // Reacciona sorprendida
buchona.trackInteraction('click', 'button-save');
```

Tipos: `'click' | 'hover' | 'navigate' | 'error' | 'success'`

#### `moveToComponent(componentId)`
Mueve la buchona a un componente específico:
```jsx
buchona.moveToComponent('my-card-123');
```

El componente debe tener el atributo `id`:
```jsx
<div id="my-card-123">...</div>
```

#### `celebrate()`
Activa el estado de celebración:
```jsx
buchona.celebrate();
```

#### `think()`
Activa el estado de pensamiento:
```jsx
buchona.think();
```

#### `dance()`
Activa el estado de baile:
```jsx
buchona.dance();
```

#### `toggle()`
Muestra/oculta la buchona:
```jsx
buchona.toggle();
```

#### `say(message, emotional?)`
Muestra un mensaje personalizado:
```jsx
buchona.say('¡Hola!', 'confident');
buchona.say('Procesando...', 'thinking');
```

### Propiedades

```jsx
const {
  state,              // Estado actual
  trackInteraction,   // Registrar interacciones
  moveToComponent,    // Mover a componente
  celebrate,          // Celebrar
  think,              // Pensar
  dance,              // Bailar
  toggle,             // Mostrar/ocultar
  say,                // Mensaje personalizado
  recentInteractions  // Últimas 10 interacciones
} = useBuchonaIntegration();
```

## 🎨 Personalización de Mensajes

### Mensajes por Contexto

El hook ya incluye mensajes contextuales según la ruta:

```javascript
// En FlowDistributor
'¡A darle con los flujos! 💼'
'Vamos a organizar esto bien 📋'

// En SmartSales
'¡A vender se ha dicho! 💰'
'Hora de hacer dinero 💵'

// En ClientHub
'Vamos a ver a los clientes 👥'
'¡A cuidar a la clientela! 💎'

// En AnalyticsPro
'¡Vamos con los números! 📊'
'A ver esos datos 📈'

// En TeamSync
'¡Vamos equipo! 🤝'
'A coordinar con la raza 👥'
```

### Reacciones Automáticas

```javascript
// Success
'¡A huevo! ✨'
'¡Eso! 👑'
'¡De lujo! 💎'

// Error
'Órale, algo pasó 😅'
'No hay pedo, lo arreglamos 🔧'
'Dale otra vez 💪'

// Thinking
'Déjame pensar... 🤔'
'Analizando... 🧠'
'Viendo... 👀'
```

## 🔌 Integración con AGI Backend

La buchona se conecta automáticamente al backend AGI (si está disponible):

```javascript
// WebSocket en: ws://localhost:8000/ws/assistant
// o
// WebSocket en: ws://<TU_SERVIDOR_AGI>/ws/assistant

// Mensajes que envía:
{
  action: 'track_interaction',
  user_id: 'demo_user',
  event: {
    type: 'success',
    target: 'button-save',
    timestamp: 1234567890
  }
}

// Mensajes que recibe:
{
  action: 'state_change',
  emotional: 'celebrating',
  message: '¡Excelente! 🎉'
}

{
  action: 'move_to',
  position: { x: 100, y: 200 }
}
```

## 📱 Responsive

La buchona se adapta automáticamente a diferentes tamaños de pantalla:
- En móviles se posiciona en la esquina superior derecha
- En tablets y desktop puede flotar libremente
- El tamaño es fijo (120x120px) para consistencia

## ⚡ Performance

- **SVG**: Gráficos vectoriales ligeros (~30KB)
- **Framer Motion**: Animaciones optimizadas con GPU
- **React Spring**: Física realista sin lag
- **Debouncing**: Movimiento automático optimizado

## 🎮 Atajos de Teclado

Puedes agregar atajos globales en CommandPaletteGlobal.jsx:

```jsx
// Ejemplo: Ctrl+B para celebrar
useEffect(() => {
  const handleKeyPress = (e) => {
    if (e.ctrlKey && e.key === 'b') {
      buchona.celebrate();
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

## 🐛 Troubleshooting

### La buchona no aparece
- Verifica que esté en App.jsx después del Router
- Revisa que no haya errores en la consola
- Asegúrate de que z-index: 9999 no esté siendo sobrescrito

### Las animaciones van lentas
- Reduce la cantidad de partículas en el estado de celebración
- Desactiva animaciones complejas en dispositivos móviles

### El WebSocket no conecta
- La buchona funciona sin backend AGI
- Verifica la variable VITE_AGI_HOST
- Revisa que el servidor AGI esté corriendo

## 🚀 Próximas Mejoras

- [ ] Reconocimiento de voz para comandos
- [ ] Más estados emocionales (enojada, cansada, emocionada)
- [ ] Sistema de logros y recompensas
- [ ] Modo mini (versión reducida)
- [ ] Temas personalizables
- [ ] Animaciones de entrada/salida de pantalla
- [ ] Integración con notificaciones del sistema
- [ ] Modo tutorial interactivo

## 📚 Ejemplos de Uso Real

### 1. Formulario con Validación

```jsx
function MiFormulario() {
  const buchona = useBuchonaIntegration();

  const handleSubmit = async (data) => {
    try {
      buchona.say('Guardando...', 'working');
      await saveData(data);
      buchona.celebrate();
      buchona.say('¡Guardado! 💾', 'celebrating');
    } catch (error) {
      buchona.trackInteraction('error');
      buchona.say('Error al guardar 😅', 'surprised');
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 2. Dashboard con Métricas

```jsx
function MetricsDashboard() {
  const buchona = useBuchonaIntegration();
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    loadMetrics().then(data => {
      setMetrics(data);

      if (data.sales > data.goal) {
        buchona.dance();
        buchona.say('¡Meta superada! 🎯', 'celebrating');
      }
    });
  }, []);

  return (
    <div>
      {metrics?.map(metric => (
        <div key={metric.id} id={`metric-${metric.id}`}>
          <h3>{metric.name}</h3>
          <p>{metric.value}</p>
          <button onClick={() => buchona.moveToComponent(`metric-${metric.id}`)}>
            Analizar
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 3. Tutorial Interactivo

```jsx
function Tutorial() {
  const buchona = useBuchonaIntegration();
  const [step, setStep] = useState(0);

  const steps = [
    { id: 'welcome', message: '¡Bienvenido! 👋', emotional: 'confident' },
    { id: 'step1', message: 'Primero, vamos aquí', emotional: 'working' },
    { id: 'step2', message: '¡Muy bien! Sigue así', emotional: 'celebrating' },
    { id: 'complete', message: '¡Completado! 🎉', emotional: 'dancing' }
  ];

  useEffect(() => {
    const currentStep = steps[step];
    if (currentStep) {
      buchona.say(currentStep.message, currentStep.emotional);
      if (currentStep.id !== 'welcome') {
        buchona.moveToComponent(currentStep.id);
      }
    }
  }, [step]);

  return (
    <div>
      <div id="step1">Paso 1</div>
      <div id="step2">Paso 2</div>
      <button onClick={() => setStep(s => s + 1)}>
        Siguiente
      </button>
    </div>
  );
}
```

## 🎯 Best Practices

1. **Usa IDs descriptivos**: `item-${id}` mejor que solo `${id}`
2. **Feedback inmediato**: Llama a buchona al inicio de acciones largas
3. **Mensajes cortos**: Máximo 30 caracteres para legibilidad
4. **Estados apropiados**: 'working' para procesos, 'celebrating' para éxitos
5. **No abuses**: No celebres cada click, solo logros importantes
6. **Contexto**: Usa mensajes relevantes a la acción del usuario

---

¡Disfruta de tu asistente buchona! 👑💎✨
