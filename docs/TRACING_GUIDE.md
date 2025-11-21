# 📊 CHRONOS Tracing System

Sistema de observabilidad completo usando **OpenTelemetry** para monitorear, depurar y optimizar el rendimiento de CHRONOS Premium Ecosystem.

## 🎯 ¿Qué es Tracing?

El tracing distribuido permite:
- 🔍 **Visualizar flujos completos** de operaciones
- ⚡ **Detectar cuellos de botella** de rendimiento
- 🐛 **Depurar errores** con contexto completo
- 📈 **Monitorear métricas** en tiempo real
- 🔗 **Rastrear dependencias** entre servicios

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
npm install
```

Las dependencias de OpenTelemetry ya están incluidas en `package.json`.

### 2. Configurar Variables de Entorno

Copia `.env.example` a `.env` y configura:

```env
# OpenTelemetry Tracing
VITE_OTLP_ENDPOINT=http://localhost:4318/v1/traces
VITE_ENABLE_TRACING=true
```

### 3. Iniciar AI Toolkit Trace Viewer

En VSCode, ejecuta:
- **Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Busca: `AI Toolkit: Open Trace Viewer`
- O usa el comando directo: `ai-mlstudio.tracing.open`

Esto iniciará el **OTLP Collector** en `http://localhost:4318`.

### 4. Ejecutar la Aplicación

```bash
npm run dev
```

El tracing se inicializa automáticamente en modo desarrollo.

## 📦 Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    CHRONOS Application                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Firebase   │  │    React     │  │   Banking    │     │
│  │  Operations  │  │  Components  │  │ Transactions │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
│         └─────────────┬────┴──────────────────┘             │
│                       │                                      │
│              ┌────────▼────────┐                            │
│              │  OpenTelemetry  │                            │
│              │    Tracer       │                            │
│              └────────┬────────┘                            │
│                       │                                      │
└───────────────────────┼──────────────────────────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │  OTLP Exporter  │
              └────────┬────────┘
                       │
                       ▼
         ┌─────────────────────────┐
         │  AI Toolkit Collector   │
         │  http://localhost:4318  │
         └─────────────────────────┘
                       │
                       ▼
         ┌─────────────────────────┐
         │   Trace Viewer (UI)     │
         │   Análisis Visual       │
         └─────────────────────────┘
```

## 🔧 Uso

### Tracing Automático

El sistema captura automáticamente:

#### 1. **Operaciones de Firebase**
```javascript
// src/config/tracing.js ya instrumenta automáticamente:
- Fetch API (usado por Firebase)
- XMLHttpRequest
- Queries de Firestore
- Autenticación
- Storage
```

#### 2. **Transacciones Bancarias**
```javascript
// Ejemplo: src/apps/FlowDistributor/chronos-system/services/bancos-v2.service.js
import { traceTransaction } from '../../../../config/tracing';

export async function crearTransferencia(data) {
  return traceTransaction('transferencia', data, async (span) => {
    // Tu lógica aquí
    // Automáticamente captura: monto, origen, destino, duración
  });
}
```

#### 3. **Operaciones de Firestore**
```javascript
import { traceFirestoreOperation } from '../../../../config/tracing';

export async function getBanco(bancoId) {
  return traceFirestoreOperation('getBanco', 'bancos', async (span) => {
    span.setAttribute('banco.id', bancoId);
    // Tu query aquí
  });
}
```

### Tracing Manual

#### Crear Spans Personalizados

```javascript
import { withSpan } from './config/tracing';

async function operacionCompleja() {
  return withSpan(
    'operacion.compleja',
    async (span) => {
      span.setAttribute('custom.attribute', 'value');

      // Tu lógica aquí
      const result = await fetch('/api/data');

      span.addEvent('data_fetched', {
        size: result.length,
      });

      return result;
    },
    {
      'service.type': 'custom',
    }
  );
}
```

#### Tracing en Componentes React

```javascript
import { useTracing } from './config/tracing';

function MiComponente({ userId }) {
  const { traceRender, traceEvent } = useTracing('MiComponente');

  useEffect(() => {
    traceRender({ userId });
  }, [userId]);

  const handleClick = () => {
    traceEvent('button_clicked', { action: 'submit' });
    // Tu lógica aquí
  };

  return <button onClick={handleClick}>Enviar</button>;
}
```

## 📊 Visualizar Traces

### En AI Toolkit Trace Viewer

1. Abre el Trace Viewer desde VSCode
2. Realiza operaciones en la aplicación
3. Observa los traces en tiempo real
4. Analiza:
   - ⏱️ **Duración** de cada operación
   - 🔗 **Dependencias** entre servicios
   - 📝 **Atributos** personalizados
   - 🐛 **Errores** con stack traces
   - 📈 **Waterfall** de llamadas

### Métricas Capturadas

| Métrica | Descripción | Ejemplo |
|---------|-------------|---------|
| `db.operation` | Tipo de operación en DB | `getBanco`, `crearTransferencia` |
| `db.collection` | Colección de Firestore | `bancos`, `movimientosBancarios` |
| `transaction.amount` | Monto de transacción | `5000` |
| `transaction.from` | Banco origen | `boveda-monte` |
| `transaction.to` | Banco destino | `utilidades` |
| `http.url` | URL de request | `https://firestore.googleapis.com/...` |
| `http.status_code` | Código HTTP | `200`, `404`, `500` |
| `error.message` | Mensaje de error | `Fondos insuficientes` |

## 🎨 Ejemplos de Queries

### Ver todas las transferencias
```
operation.name = "transaction.transferencia"
```

### Transferencias lentas (> 1s)
```
operation.name = "transaction.transferencia" AND duration > 1000ms
```

### Errores en Firestore
```
db.system = "firestore" AND status.code = "ERROR"
```

### Operaciones en banco específico
```
banco.id = "boveda-monte"
```

## 🔥 Casos de Uso Reales

### 1. Optimizar Transacciones Lentas

**Problema**: Transferencias tardan más de 2 segundos

**Solución**:
1. Filtrar traces: `operation.name = "transaction.transferencia" AND duration > 2000ms`
2. Analizar waterfall: identificar operación lenta
3. Optimizar query o agregar índice

### 2. Depurar Error de Fondos Insuficientes

**Problema**: Usuario reporta error al transferir

**Solución**:
1. Buscar trace por `transaction.from` o `transaction.to`
2. Ver atributos: `transaction.amount`, `banco.capitalActual`
3. Identificar lógica de validación

### 3. Monitorear Rendimiento de Firebase

**Problema**: Queries lentas en Firestore

**Solución**:
1. Filtrar: `db.system = "firestore" AND duration > 500ms`
2. Revisar `db.collection` y `db.operation`
3. Agregar índices compuestos

## 🛠️ Configuración Avanzada

### Cambiar Endpoint OTLP

Para usar Jaeger, Zipkin u otro backend:

```env
# Jaeger
VITE_OTLP_ENDPOINT=http://localhost:14268/api/traces

# Zipkin
VITE_OTLP_ENDPOINT=http://localhost:9411/api/v2/spans

# Cloud (Azure Monitor, AWS X-Ray, etc.)
VITE_OTLP_ENDPOINT=https://your-cloud-endpoint.com/v1/traces
```

### Deshabilitar Tracing en Producción

```env
VITE_ENABLE_TRACING=false
```

O en el código:

```javascript
// src/config/tracing.js
if (import.meta.env.PROD) {
  // No inicializar en producción
  console.log('Tracing deshabilitado en producción');
} else {
  initializeTracing();
}
```

### Sampling (Muestreo)

Para reducir overhead en producción:

```javascript
// src/config/tracing.js
import { TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-web';

const provider = new WebTracerProvider({
  resource,
  sampler: new TraceIdRatioBasedSampler(0.1), // 10% de traces
});
```

## 📚 Recursos

- [OpenTelemetry Docs](https://opentelemetry.io/docs/)
- [AI Toolkit Tracing](https://github.com/microsoft/vscode-ai-toolkit)
- [OTLP Specification](https://opentelemetry.io/docs/specs/otlp/)
- [Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/)

## 🤝 Contribuir

Para agregar tracing a nuevas funciones:

1. Importa helpers:
```javascript
import { withSpan, traceFirestoreOperation } from './config/tracing';
```

2. Envuelve tu función:
```javascript
export async function miFuncion(params) {
  return withSpan('mi.funcion', async (span) => {
    span.setAttribute('param.id', params.id);
    // Tu lógica
  });
}
```

3. Documenta atributos personalizados en este README

## ⚠️ Troubleshooting

### Problema: No veo traces

**Solución**:
1. Verificar que AI Toolkit Trace Viewer esté abierto
2. Confirmar `VITE_ENABLE_TRACING=true` en `.env`
3. Revisar consola: debe mostrar `[Tracing] ✅ OpenTelemetry inicializado`
4. Verificar endpoint: `http://localhost:4318` accesible

### Problema: Errores de CORS

**Solución**:
```javascript
// src/config/tracing.js
propagateTraceHeaderCorsUrls: [
  /^https:\/\/your-domain\.com/,
  // Agregar tu dominio
],
```

### Problema: Demasiados traces (lento)

**Solución**:
1. Habilitar sampling (ver arriba)
2. Filtrar spans innecesarios
3. Reducir `maxQueueSize` en BatchSpanProcessor

---

**🎉 Sistema de Tracing Completo Implementado**

Ahora puedes monitorear, depurar y optimizar CHRONOS con visibilidad completa de todas las operaciones.
