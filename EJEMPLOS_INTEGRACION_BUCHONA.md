# 🎯 Guía de Integración: Buchona en Componentes Específicos

## 📚 Índice
1. [Integración Básica](#integración-básica)
2. [Formularios con Validación](#formularios-con-validación)
3. [Dashboard con Métricas](#dashboard-con-métricas)
4. [Tablas de Datos](#tablas-de-datos)
5. [Tutorial Interactivo](#tutorial-interactivo)
6. [Panel de Ventas](#panel-de-ventas)
7. [CRM con Clientes](#crm-con-clientes)
8. [Configuración Avanzada](#configuración-avanzada)

---

## 1. Integración Básica

### Paso 1: Importar el Hook

```jsx
import { useBuchonaIntegration } from '../hooks/useBuchonaIntegration';
```

### Paso 2: Usar en tu Componente

```jsx
function MiComponente() {
  const buchona = useBuchonaIntegration();

  return (
    <div>
      <h1>Mi Componente</h1>
      <button onClick={() => buchona.celebrate()}>
        ¡Celebrar!
      </button>
    </div>
  );
}
```

---

## 2. Formularios con Validación

### Ejemplo: Formulario de Registro de Cliente

```jsx
import { useState } from 'react';
import { useBuchonaIntegration } from '../hooks/useBuchonaIntegration';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Schema de validación
const clienteSchema = z.object({
  nombre: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(10, 'Teléfono inválido'),
  empresa: z.string().optional(),
});

function FormularioCliente() {
  const buchona = useBuchonaIntegration();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(clienteSchema)
  });

  const onSubmit = async (data) => {
    try {
      // Buchona indica que está trabajando
      buchona.say('Guardando cliente...', 'working');
      setLoading(true);

      // Simular guardado
      await saveCliente(data);

      // Celebrar éxito
      buchona.celebrate();
      buchona.say('¡Cliente registrado! 💎', 'celebrating');

      // Trackear interacción
      buchona.trackInteraction('success', 'form-cliente');

      reset();
    } catch (error) {
      // Reaccionar a error
      buchona.trackInteraction('error', 'form-cliente');
      buchona.say('Órale, algo pasó 😅', 'surprised');
    } finally {
      setLoading(false);

      // Volver a idle después de 3s
      setTimeout(() => {
        buchona.say('¿Qué sigue? 👀', 'idle');
      }, 3000);
    }
  };

  // Reaccionar a errores de validación
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      buchona.say('Revisa los campos 🔍', 'thinking');
    }
  }, [errors]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Nombre</label>
        <input
          {...register('nombre')}
          className="w-full p-2 border rounded"
        />
        {errors.nombre && (
          <p className="text-red-500 text-sm">{errors.nombre.message}</p>
        )}
      </div>

      <div>
        <label>Email</label>
        <input
          {...register('email')}
          type="email"
          className="w-full p-2 border rounded"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label>Teléfono</label>
        <input
          {...register('telefono')}
          className="w-full p-2 border rounded"
        />
        {errors.telefono && (
          <p className="text-red-500 text-sm">{errors.telefono.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        {loading ? 'Guardando...' : 'Guardar Cliente'}
      </button>
    </form>
  );
}
```

---

## 3. Dashboard con Métricas

### Ejemplo: Dashboard de Ventas

```jsx
import { useState, useEffect } from 'react';
import { useBuchonaIntegration } from '../hooks/useBuchonaIntegration';
import { TrendingUp, DollarSign, Users, ShoppingCart } from 'lucide-react';

function DashboardVentas() {
  const buchona = useBuchonaIntegration();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      buchona.say('Cargando métricas...', 'working');

      const data = await fetchMetrics();
      setMetrics(data);

      // Analizar y reaccionar
      if (data.ventas > data.meta) {
        buchona.dance();
        buchona.say('¡Meta superada! 🎯💰', 'celebrating');
      } else if (data.ventas > data.meta * 0.8) {
        buchona.say('¡Casi llegamos! 💪', 'confident');
      } else {
        buchona.say('A darle con las ventas 📈', 'working');
      }

      setLoading(false);
    } catch (error) {
      buchona.trackInteraction('error', 'dashboard-load');
      setLoading(false);
    }
  };

  const handleMetricClick = (metricId) => {
    // Mover buchona al componente
    buchona.moveToComponent(`metric-${metricId}`);
    buchona.say('¡Vamos a ver esto! 👀', 'working');

    // Trackear interacción
    buchona.trackInteraction('click', `metric-${metricId}`);
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard de Ventas</h1>

      {/* Grid de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ventas Totales */}
        <div
          id="metric-ventas"
          onClick={() => handleMetricClick('ventas')}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Ventas Totales</p>
              <p className="text-2xl font-bold">${metrics.ventas.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600">+{metrics.ventasCrecimiento}%</span>
          </div>
        </div>

        {/* Clientes */}
        <div
          id="metric-clientes"
          onClick={() => handleMetricClick('clientes')}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Clientes</p>
              <p className="text-2xl font-bold">{metrics.clientes}</p>
            </div>
          </div>
        </div>

        {/* Órdenes */}
        <div
          id="metric-ordenes"
          onClick={() => handleMetricClick('ordenes')}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Órdenes</p>
              <p className="text-2xl font-bold">{metrics.ordenes}</p>
            </div>
          </div>
        </div>

        {/* Progreso de Meta */}
        <div
          id="metric-meta"
          onClick={() => handleMetricClick('meta')}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div>
            <p className="text-sm text-gray-600">Meta del Mes</p>
            <p className="text-2xl font-bold">{Math.round((metrics.ventas / metrics.meta) * 100)}%</p>
          </div>

          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              style={{ width: `${Math.min((metrics.ventas / metrics.meta) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Botón de refresh */}
      <button
        onClick={() => {
          buchona.say('Actualizando...', 'working');
          loadMetrics();
        }}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
      >
        Actualizar Métricas
      </button>
    </div>
  );
}
```

---

## 4. Tablas de Datos

### Ejemplo: Tabla de Clientes con Acciones

```jsx
import { useState } from 'react';
import { useBuchonaIntegration } from '../hooks/useBuchonaIntegration';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';

function TablaClientes() {
  const buchona = useBuchonaIntegration();
  const [clientes, setClientes] = useState([
    { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', ventas: 15000 },
    { id: 2, nombre: 'María García', email: 'maria@example.com', ventas: 25000 },
    { id: 3, nombre: 'Carlos López', email: 'carlos@example.com', ventas: 10000 },
  ]);

  const handleView = (cliente) => {
    buchona.moveToComponent(`cliente-${cliente.id}`);
    buchona.say(`Viendo a ${cliente.nombre} 👤`, 'confident');
    buchona.trackInteraction('click', `view-cliente-${cliente.id}`);
  };

  const handleEdit = (cliente) => {
    buchona.say('Editando... ✏️', 'working');
    buchona.trackInteraction('click', `edit-cliente-${cliente.id}`);
    // Lógica de edición
  };

  const handleDelete = async (cliente) => {
    try {
      buchona.say('Eliminando...', 'working');

      // Confirmar
      const confirmed = confirm(`¿Eliminar a ${cliente.nombre}?`);
      if (!confirmed) {
        buchona.say('Cancelado', 'idle');
        return;
      }

      // Eliminar
      await deleteCliente(cliente.id);
      setClientes(prev => prev.filter(c => c.id !== cliente.id));

      buchona.celebrate();
      buchona.say('¡Eliminado! 🗑️', 'celebrating');
      buchona.trackInteraction('success', `delete-cliente-${cliente.id}`);
    } catch (error) {
      buchona.trackInteraction('error', `delete-cliente-${cliente.id}`);
    }
  };

  const handleAdd = () => {
    buchona.say('¡A agregar! ➕', 'confident');
    buchona.trackInteraction('click', 'add-cliente');
    // Abrir modal o navegar
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clientes</h1>

        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <Plus className="w-4 h-4" />
          Agregar Cliente
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ventas
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clientes.map((cliente) => (
              <tr
                key={cliente.id}
                id={`cliente-${cliente.id}`}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{cliente.nombre}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-500">{cliente.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">${cliente.ventas.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleView(cliente)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Ver"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(cliente)}
                      className="text-green-600 hover:text-green-800"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cliente)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## 5. Tutorial Interactivo

### Ejemplo: Onboarding Guiado

```jsx
import { useState, useEffect } from 'react';
import { useBuchonaIntegration } from '../hooks/useBuchonaIntegration';
import { ChevronRight, Check } from 'lucide-react';

const tutorialSteps = [
  {
    id: 'welcome',
    title: '¡Bienvenido! 👋',
    description: 'Vamos a hacer un tour por el sistema',
    message: '¡Qué onda! Vamos a empezar 💎',
    emotional: 'confident',
    targetId: null
  },
  {
    id: 'dashboard',
    title: 'Dashboard Principal',
    description: 'Aquí ves todas tus métricas',
    message: '¡Mira todas las métricas! 📊',
    emotional: 'working',
    targetId: 'dashboard-section'
  },
  {
    id: 'ventas',
    title: 'Panel de Ventas',
    description: 'Gestiona tus ventas aquí',
    message: '¡Hora de vender! 💰',
    emotional: 'confident',
    targetId: 'ventas-section'
  },
  {
    id: 'clientes',
    title: 'Clientes',
    description: 'Administra tu cartera',
    message: 'A cuidar a los clientes 👥',
    emotional: 'working',
    targetId: 'clientes-section'
  },
  {
    id: 'complete',
    title: '¡Listo! 🎉',
    description: 'Ya sabes usar el sistema',
    message: '¡Completado! De lujo 💎',
    emotional: 'dancing',
    targetId: null
  }
];

function TutorialInteractivo() {
  const buchona = useBuchonaIntegration();
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const step = tutorialSteps[currentStep];

  useEffect(() => {
    if (!isActive) return;

    // Mover buchona y mostrar mensaje
    if (step.targetId) {
      setTimeout(() => {
        buchona.moveToComponent(step.targetId);
      }, 500);
    }

    buchona.say(step.message, step.emotional);

    // Trackear paso
    buchona.trackInteraction('navigate', `tutorial-${step.id}`);
  }, [currentStep, isActive]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Tutorial completado
      buchona.celebrate();
      buchona.dance();
      setIsActive(false);

      // Guardar que completó el tutorial
      localStorage.setItem('tutorial_completed', 'true');
    }
  };

  const handleSkip = () => {
    buchona.say('¡Nos vemos! 👋', 'idle');
    setIsActive(false);
  };

  if (!isActive) return null;

  return (
    <>
      {/* Overlay semi-transparente */}
      <div className="fixed inset-0 bg-black/50 z-40" />

      {/* Card del tutorial */}
      <div className="fixed bottom-8 right-8 z-50 max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{step.description}</p>
            </div>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Paso {currentStep + 1} de {tutorialSteps.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Steps completados */}
          <div className="space-y-2 mb-4">
            {tutorialSteps.slice(0, currentStep + 1).map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-700">{s.title}</span>
              </div>
            ))}
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Saltar
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
            >
              {currentStep < tutorialSteps.length - 1 ? 'Siguiente' : 'Finalizar'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sections del tutorial (con IDs para navegación) */}
      <div className="p-6 space-y-6">
        <div id="dashboard-section" className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          <p>Contenido del dashboard...</p>
        </div>

        <div id="ventas-section" className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Ventas</h2>
          <p>Contenido de ventas...</p>
        </div>

        <div id="clientes-section" className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Clientes</h2>
          <p>Contenido de clientes...</p>
        </div>
      </div>
    </>
  );
}
```

---

## 6. Panel de Ventas Completo

Ver archivo: `EJEMPLOS_BUCHONA_VENTAS.md`

---

## 7. CRM con Clientes

Ver archivo: `EJEMPLOS_BUCHONA_CRM.md`

---

## 8. Configuración Avanzada

### Personalizar Mensajes por Usuario

```jsx
const buchona = useBuchonaIntegration();

// Configurar mensajes personalizados
useEffect(() => {
  const userName = getUserName();

  buchona.say(`¡Qué onda, ${userName}! 👋`, 'confident');
}, []);
```

### Integración con Analytics

```jsx
const buchona = useBuchonaIntegration();

// Trackear todas las interacciones
useEffect(() => {
  // Escuchar interacciones
  const unsubscribe = buchona.recentInteractions.subscribe((interaction) => {
    // Enviar a Google Analytics
    gtag('event', 'buchona_interaction', {
      type: interaction.type,
      target: interaction.target,
      timestamp: interaction.timestamp
    });
  });

  return unsubscribe;
}, []);
```

### Modo Silencioso

```jsx
const buchona = useBuchonaIntegration();

// Deshabilitar temporalmente
const handleFocus = () => {
  buchona.toggle(); // Ocultar
};

const handleBlur = () => {
  buchona.toggle(); // Mostrar
};
```

---

## 🎯 Tips y Best Practices

1. **Usa IDs descriptivos**: `producto-${id}` en lugar de solo `${id}`

2. **Feedback inmediato**: Llama a buchona al **inicio** de acciones largas

3. **Mensajes cortos**: Máximo 30 caracteres

4. **Estados apropiados**:
   - `working`: Procesos en curso
   - `celebrating`: Éxitos importantes
   - `thinking`: Análisis o cálculos
   - `confident`: Navegación normal

5. **No abuses**: Solo celebra logros **significativos**

6. **Contextual**: Mensajes relevantes a la acción del usuario

7. **Testing**: Verifica que los IDs de elementos existen antes de moverla

---

¡Ahora tienes todo para usar la Buchona en cualquier componente! 🎉👑💎
