# 🧠 Sistema AGI (Artificial General Intelligence)

## 📋 Tabla de Contenidos
- [Visión General](#visión-general)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Capacidades Avanzadas](#capacidades-avanzadas)
- [Setup y Deployment](#setup-y-deployment)
- [Uso del Sistema](#uso-del-sistema)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visión General

El **Sistema AGI** es una plataforma de inteligencia artificial avanzada que:

✨ **Aprende constantemente** de cada interacción
🤖 **Automatiza tareas** complejas
🎯 **Predice necesidades** del usuario
🗣️ **Conversa naturalmente** (texto + voz)
📊 **Genera análisis** y visualizaciones
🚀 **Navega autónomamente** el sistema
📝 **Crea documentos** y reportes

### 🆚 Comparación con Asistentes Tradicionales

| Característica | Asistente Tradicional | Sistema AGI |
|----------------|----------------------|-------------|
| **Memoria** | ❌ No recuerda | ✅ Memoria permanente |
| **Aprendizaje** | ❌ Estático | ✅ Aprende constantemente |
| **Predicción** | ❌ Reactivo | ✅ Proactivo |
| **Automatización** | ❌ Limitada | ✅ Function Calling completo |
| **Análisis** | ❌ Básico | ✅ Análisis profundo + visualizaciones |
| **Personalización** | ❌ Genérico | ✅ Se adapta a cada usuario |

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │         AGIAssistant.tsx (Componente UI)         │  │
│  │  - Interfaz conversacional                        │  │
│  │  - Reconocimiento de voz                          │  │
│  │  - Visualización de patrones                      │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↕ WebSocket/HTTP
┌─────────────────────────────────────────────────────────┐
│                  SERVIDOR AGI (Python)                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │         FastAPI (api_server.py)                   │  │
│  │  - Endpoints REST                                 │  │
│  │  - WebSocket real-time                            │  │
│  │  - CORS configurado                               │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │    Sistema de Memoria (memory_system.py)         │  │
│  │  - ChromaDB (búsqueda semántica)                 │  │
│  │  - Redis (memoria de sesión)                     │  │
│  │  - PostgreSQL (almacenamiento permanente)        │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Function Calling (function_calling.py)          │  │
│  │  - Registro de funciones                         │  │
│  │  - Ejecución automática                          │  │
│  │  - Navegación del sistema                        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                   OLLAMA (Modelos IA)                    │
│  - qwen2.5:72b (Razonamiento principal - 70B params)   │
│  - deepseek-coder:33b (Código especializado)           │
│  - llava:34b (Visión y multimodal)                     │
│  - llama3.1:70b (Conversación natural)                 │
│  - sqlcoder:15b (Análisis de datos)                    │
│  - nomic-embed-text (Embeddings para RAG)              │
│  - functionary:medium (Function calling)               │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                    BASES DE DATOS                        │
│  - PostgreSQL (agi_learning)                            │
│    ├── user_patterns (patrones aprendidos)             │
│    ├── interactions (historial completo)               │
│    └── user_preferences (preferencias)                 │
│  - Redis (sesiones activas)                            │
│  - ChromaDB (vectores semánticos)                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Capacidades Avanzadas

### 1. 🧠 **Memoria y Aprendizaje**

El sistema aprende de **CADA interacción**:

```python
# Ejemplo de aprendizaje automático
user_action = {
    "user_id": "user_123",
    "panel": "SmartSales",
    "action": "create_invoice",
    "context": {"client": "Acme Corp", "amount": 5000}
}

# El sistema aprende:
# 1. Frecuencia de acciones
# 2. Patrones temporales
# 3. Contexto de uso
# 4. Preferencias implícitas
```

**Resultado:** Después de 3-5 interacciones similares, el sistema **predice** que probablemente quieras crear otra factura para ese cliente.

### 2. 🎯 **Predicción Proactiva**

```javascript
// Predicciones basadas en patrones
GET /api/user/{user_id}/predictions?panel=SmartSales

Response:
[
  {
    "action": "create_invoice",
    "confidence": 0.87,
    "context": "Últimas 5 veces a las 10 AM"
  },
  {
    "action": "check_payments",
    "confidence": 0.65,
    "context": "Siempre después de crear factura"
  }
]
```

### 3. 🤖 **Function Calling Automático**

El sistema puede **ejecutar acciones** directamente:

```typescript
// Usuario dice: "Llévame a ventas y crea una factura para Acme"

// La IA ejecuta automáticamente:
1. navigate_to_panel({ panel_name: "SmartSales" })
2. create_invoice({ client: "Acme Corp", template: "default" })
3. Responde: "✅ Navegado a Ventas. Factura creada para Acme Corp."
```

**Funciones disponibles:**
- `navigate_to_panel()` - Navegación automática
- `create_report()` - Generación de reportes
- `analyze_data()` - Análisis y insights
- `search_clients()` - Búsqueda en BD
- `export_data()` - Exportación de datos
- Y más... (extensible)

### 4. 📊 **Análisis y Visualizaciones**

```typescript
// Usuario: "Analiza las ventas de este mes"

// La IA:
1. Consulta base de datos
2. Calcula métricas (promedio, tendencia, anomalías)
3. Genera gráficos (Chart.js/D3.js)
4. Explica insights en lenguaje natural
5. Sugiere acciones
```

### 5. 🗣️ **Conversación Natural con Voz**

- **Speech-to-Text**: Reconocimiento de voz en español
- **Text-to-Speech**: Respuestas audibles (opcional)
- **Contexto conversacional**: Recuerda toda la conversación
- **Interrupciones**: Puede interrumpir y aclarar

### 6. 🔄 **Navegación Autónoma**

```typescript
// Usuario: "Quiero ver el dashboard de analíticas y luego ir a clientes"

// La IA ejecuta:
1. navigate_to_panel("AnalyticsPro")
   → Espera 2 segundos para que veas
2. navigate_to_panel("ClientHub")
   → Navega automáticamente
3. Responde: "✅ Ahora estás en Clientes. ¿Qué necesitas?"
```

### 7. 📝 **Generación de Documentos**

```typescript
// Usuario: "Genera un reporte de ventas trimestral en PDF"

// La IA:
1. Consulta datos (Q1 2025)
2. Calcula métricas clave
3. Genera gráficos
4. Crea documento PDF
5. Envía link de descarga
```

---

## ⚙️ Setup y Deployment

### 🔧 **Paso 1: Ejecutar Script de Setup**

```powershell
# En PowerShell
.\setup-ollama-aws.ps1

# Opciones personalizadas:
.\setup-ollama-aws.ps1 -Region "us-east-1" -InstanceType "g5.xlarge" -UseSpotInstances
```

**Tiempo estimado:** 20-30 minutos (descarga de modelos)

### 🔧 **Paso 2: Verificar Instalación**

```bash
# SSH al servidor
ssh -i ~/.ssh/ollama-key.pem ubuntu@<IP_PUBLICA>

# Verificar estado completo
ollama-status.sh

# Output esperado:
╔══════════════════════════════════════════════════════╗
║          🧠 ESTADO SISTEMA AGI COMPLETO            ║
╚══════════════════════════════════════════════════════╝

🤖 Servicio Ollama:
   Active: active (running)

🚀 API AGI:
   Active: active (running)

💾 Redis (Memoria de Sesión):
   Active: active (running)

🗄️  PostgreSQL (Base de Aprendizaje):
   Active: active (running)

🤖 Modelos instalados:
   qwen2.5:72b        (70B params)
   deepseek-coder:33b (33B params)
   llava:34b          (34B params)
   llama3.1:70b       (70B params)
   sqlcoder:15b       (15B params)
   nomic-embed-text   (embeddings)
   functionary:medium (function calling)
```

### 🔧 **Paso 3: Configurar Frontend**

```bash
# 1. Actualizar .env
echo "VITE_AGI_HOST=http://<IP_PUBLICA>" >> .env

# 2. Actualizar App.tsx
# Reemplazar AIAssistant con AGIAssistant:
import AGIAssistant from './components/shared/AGIAssistant'

function App() {
  return (
    <div>
      {/* ... tu app ... */}
      <AGIAssistant />
    </div>
  )
}

# 3. Deploy
npm run build
vercel --prod --yes
```

### 🔧 **Paso 4: Configurar Vercel**

```bash
# Añadir variable de entorno
vercel env add VITE_AGI_HOST

# Valor: http://<IP_PUBLICA>
# Environments: Production, Preview, Development

# Re-deploy
vercel --prod --yes
```

---

## 💬 Uso del Sistema

### 🎤 **Conversación por Voz**

1. Clic en botón 🧠 (esquina inferior derecha)
2. Clic en 🎤 (micrófono)
3. Habla claramente: *"Navega a ventas"*
4. La IA ejecuta y responde

### ⌨️ **Conversación por Texto**

```typescript
// Ejemplos de comandos:

"Analiza las ventas de esta semana"
→ Genera análisis + gráficos

"Llévame al dashboard"
→ Navega automáticamente

"Crea un reporte de clientes activos"
→ Genera PDF descargable

"¿Qué hice ayer a las 3 PM?"
→ Busca en historial de interacciones

"Recomiéndame qué hacer ahora"
→ Sugiere basándose en patrones
```

### 🔍 **Ver Patrones Aprendidos**

El sistema muestra tus patrones en tiempo real:

```
🎯 Patrones Detectados (5):
- Creas facturas todos los lunes 10 AM
- Revisas pagos después de crear facturas
- Exportas reportes los viernes
- Prefieres vista de tabla en clientes
- Usas filtro "activos" frecuentemente
```

### 💡 **Sugerencias Predictivas**

Basándose en contexto y patrones:

```
Panel actual: SmartSales

💡 Sugerencias:
- "Crear factura" (85% probabilidad)
- "Revisar pagos pendientes" (70%)
- "Contactar cliente Acme" (60%)
```

---

## 📚 Ejemplos de Uso

### Ejemplo 1: **Análisis de Datos**

```typescript
Usuario: "Analiza las ventas del Q1"

AGI:
✅ Analizando datos de ventas (Enero-Marzo 2025)...

📊 Resumen:
- Total: $125,450
- Promedio diario: $1,393
- Tendencia: ↗️ +15% vs Q4 2024

🔍 Insights:
- Marzo fue el mejor mes ($52,000)
- Cliente top: Acme Corp ($35,000)
- Producto top: Plan Premium

💡 Recomendaciones:
1. Focus en clientes corporativos
2. Promocionar Plan Premium
3. Replicar estrategia de Marzo

¿Quieres que genere un reporte detallado?
```

### Ejemplo 2: **Automatización Completa**

```typescript
Usuario: "Prepara el reporte semanal y envíalo por email"

AGI:
✅ Ejecutando automatización...

1️⃣ Generando reporte de ventas... ✅
2️⃣ Creando visualizaciones... ✅
3️⃣ Exportando a PDF... ✅
4️⃣ Enviando email a stakeholders... ✅

📧 Email enviado a:
- director@empresa.com
- ventas@empresa.com
- gerencia@empresa.com

📎 Adjunto: reporte_semanal_2025-10-30.pdf
```

### Ejemplo 3: **Aprendizaje y Predicción**

```typescript
// Primera vez
Usuario: "Crea factura para Acme Corp"
AGI: "✅ Factura creada"

// Segunda vez (después de 3-5 veces)
Usuario: "Voy a facturar"
AGI: "¿Para Acme Corp? Sueles facturarles los lunes a esta hora. ¿Quieres que use la misma plantilla?"

// Tercera vez (predicción proactiva)
[Lunes 10 AM - El sistema sugiere automáticamente]
AGI: "📍 Detecté que sueles crear facturas para Acme Corp los lunes. ¿Quieres que prepare una?"
```

---

## 📖 API Reference

### REST Endpoints

#### `POST /api/chat`
Envía mensaje al AGI

```typescript
Request:
{
  "message": "Analiza las ventas",
  "user_id": "user_123",
  "session_id": "session_abc",
  "panel": "SmartSales",
  "context": {
    "url": "/smartsales/dashboard",
    "timestamp": "2025-10-30T10:00:00Z"
  }
}

Response:
{
  "response": "Analizando ventas...",
  "function_calls": [
    {
      "name": "analyze_data",
      "arguments": { "data_source": "sales", "type": "trend" }
    }
  ],
  "learned_patterns": [...],
  "suggestions": ["Ver reporte completo", "Exportar datos"]
}
```

#### `GET /api/user/{user_id}/patterns`
Obtiene patrones aprendidos

```typescript
Response:
[
  {
    "type": "action_hash_abc",
    "data": {
      "panel": "SmartSales",
      "action": "create_invoice",
      "context": {...}
    },
    "frequency": 15,
    "last_seen": "2025-10-30T09:45:00Z"
  }
]
```

#### `GET /api/user/{user_id}/predictions?panel={panel}`
Obtiene predicciones

```typescript
Response:
[
  {
    "type": "action_prediction",
    "data": { "action": "create_invoice" },
    "confidence": 0.87
  }
]
```

#### `POST /api/function/execute`
Ejecuta función del sistema

```typescript
Request:
{
  "function_name": "navigate_to_panel",
  "arguments": { "panel_name": "SmartSales", "user_id": "user_123" }
}

Response:
{
  "success": true,
  "result": { "action": "navigate", "panel": "SmartSales" }
}
```

### WebSocket

#### `WS /ws/chat`
Conexión en tiempo real

```typescript
// Enviar
ws.send(JSON.stringify({
  message: "Hola",
  user_id: "user_123",
  session_id: "session_abc",
  panel: "home"
}))

// Recibir
{
  "response": "¡Hola! ¿En qué puedo ayudarte?",
  "function_calls": [],
  "learned_patterns": [...],
  "suggestions": [...]
}
```

---

## 🐛 Troubleshooting

### ❌ "WebSocket connection failed"

```bash
# Verificar que API AGI esté corriendo
ssh -i ~/.ssh/ollama-key.pem ubuntu@<IP> 'systemctl status agi-api'

# Si no está activo:
systemctl start agi-api
systemctl enable agi-api
```

### ❌ "Ollama not responding"

```bash
# Verificar servicio
systemctl status ollama

# Ver logs
journalctl -u ollama -f

# Reiniciar
systemctl restart ollama
```

### ❌ "No patterns learned"

```bash
# Verificar base de datos
ssh -i ~/.ssh/ollama-key.pem ubuntu@<IP>
sudo -u postgres psql -d agi_learning -c "SELECT COUNT(*) FROM interactions;"

# Si está vacía, la API no está guardando interacciones
# Verificar logs:
journalctl -u agi-api -f
```

### ❌ "Slow responses"

```bash
# Verificar uso de RAM/GPU
ollama-status.sh

# Si memoria está llena:
# 1. Reiniciar servicios
systemctl restart ollama agi-api

# 2. O upgrade a instancia más grande
# g5.xlarge → g5.2xlarge (32GB RAM)
```

---

## 💰 Costos

### AWS EC2 Pricing

| Instancia | RAM | GPU | Spot (mes) | On-Demand (mes) |
|-----------|-----|-----|------------|-----------------|
| t3.large | 8GB | ❌ | $18 | $60 |
| **g5.xlarge** | 16GB | ✅ 24GB | **$100-120** | $300-400 |
| g5.2xlarge | 32GB | ✅ 24GB | $180-200 | $600-800 |

**Recomendación:** `g5.xlarge` con Spot Instances = **$100-120/mes**

### vs OpenAI API

- OpenAI GPT-4: **$100-300/mes** (uso moderado)
- Sistema AGI propio: **$100-120/mes** (uso ilimitado)
- **Ahorro anual:** $1,000 - $2,000

---

## 🎯 Roadmap Futuro

- [ ] **Multimodal completo** (imágenes, PDFs, audio)
- [ ] **Auto-actualización de modelos**
- [ ] **Fine-tuning automático** por usuario
- [ ] **Plugins del sistema** (Zapier, Make, n8n)
- [ ] **Dashboard de analytics de IA**
- [ ] **Multi-idioma** (EN, ES, PT, FR)
- [ ] **Voice cloning** (voz personalizada)
- [ ] **Modo offline** (PWA + IndexedDB)

---

## 📞 Soporte

¿Problemas? Contacta:
- 📧 Email: soporte@premiumecosystem.com
- 💬 Discord: [Link]
- 📖 Docs: https://docs.premiumecosystem.com

---

**🚀 ¡Tu sistema AGI está listo para revolucionar la productividad!**
