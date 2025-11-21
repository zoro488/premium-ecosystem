# 🧠 GEMINI CLI - GUÍA COMPLETA DE USO

## 📦 Instalación y Configuración

### 1️⃣ Instalación Rápida
```bash
# Asegurar que las dependencias están instaladas
npm install

# Configurar aliases globales (PowerShell)
.\setup-gemini-aliases.ps1

# Recargar el perfil de PowerShell
. $PROFILE
```

### 2️⃣ Verificación
```bash
# Verificar que funciona
node gemini-cli.js help

# O con el alias (después de reiniciar terminal)
gemini help
```

---

## 🎯 COMANDOS PRINCIPALES

### 1. `ask` - Preguntas Rápidas
Hacer cualquier pregunta a Gemini

```bash
# Sintaxis básica
gemini ask "¿Cómo implemento un hook personalizado en React?"

# Con modelo específico
gemini ask "¿Cuál es la diferencia entre useMemo y useCallback?" --model creative

# Guardar respuesta
gemini ask "Explica el patrón Observer" --output respuesta.md

# Usar alias corto
gask "¿Cómo optimizo un componente React?"
```

**Casos de Uso:**
- Consultas rápidas de documentación
- Preguntas sobre mejores prácticas
- Dudas de sintaxis
- Conceptos técnicos

---

### 2. `code` - Generación de Código
Generar código para cualquier necesidad

```bash
# Generar componente React
gemini code "Crea un componente de tarjeta de producto con imagen, título, precio y botón de compra usando TailwindCSS"

# Generar hook personalizado
gemini code "Hook useLocalStorage que sincroniza estado con localStorage" --model code

# Generar función específica
gemini code "Función para validar email con regex" --output validateEmail.js

# Con streaming para ver código en tiempo real
gemini code "Componente de formulario con React Hook Form y Zod" --stream

# Usar alias
gcode "Custom hook para fetch con retry automático"
```

**Casos de Uso:**
- Componentes de UI
- Custom hooks
- Funciones utilitarias
- Configuraciones
- Tests

---

### 3. `analyze` - Analizar Archivos
Analizar código existente para mejoras

```bash
# Analizar un componente
gemini analyze src/components/ProductCard.jsx

# Analizar con modelo preciso
gemini analyze src/hooks/useAuth.js --model precise

# Analizar y guardar reporte
gemini analyze src/services/api.js --output analisis.md

# Usar alias
ganalyze src/App.jsx
```

**Qué Analiza:**
- Performance y optimizaciones
- Problemas de seguridad
- Code smells
- Mejores prácticas
- Accesibilidad
- Sugerencias de refactoring

---

### 4. `explain` - Explicar Código
Entender código complejo

```bash
# Explicar un archivo
gemini explain src/hooks/useGemini.js

# Explicación detallada
gemini explain src/lib/gemini/config.js --model precise

# Guardar explicación
gemini explain src/services/analytics.js --output explicacion.md

# Usar alias
gexplain src/utils/helpers.js
```

**Incluye:**
- Propósito del código
- Flujo de ejecución
- Dependencias
- Casos de uso
- Ejemplos de implementación

---

### 5. `fix` - Sugerir Mejoras
Mejorar código existente

```bash
# Sugerir mejoras
gemini fix src/components/OldComponent.jsx

# Con modelo creativo para soluciones innovadoras
gemini fix src/utils/legacy.js --model creative

# Guardar sugerencias
gemini fix src/services/old-api.js --output mejoras.md

# Usar alias
gfix src/hooks/useFetch.js
```

**Tipos de Mejoras:**
- Modernización de código
- Performance
- Legibilidad
- Seguridad
- TypeScript migrations
- Reducción de complejidad

---

### 6. `translate` - Traducción
Traducir texto entre idiomas

```bash
# Traducir a inglés
gemini translate "Hola mundo" --to english

# Traducir documentación
gemini translate "Esta función valida emails" --to english --output translation.txt

# Traducir desde archivo
gemini translate docs/README-ES.md --to english --output README.md
```

**Idiomas Soportados:**
- Español ↔ Inglés
- Español ↔ Francés
- Español ↔ Alemán
- Y muchos más

---

### 7. `summarize` - Resumir Texto
Crear resúmenes de documentos largos

```bash
# Resumir archivo
gemini summarize DOCUMENTACION_LARGA.md

# Resumen breve
gemini summarize articulo.txt --model summary

# Guardar resumen
gemini summarize informe.md --output resumen.txt
```

**Casos de Uso:**
- Documentación extensa
- Logs de errores
- Artículos técnicos
- Changelogs
- PRs grandes

---

### 8. `chat` - Modo Interactivo
Conversación continua con contexto

```bash
# Iniciar chat
gemini chat

# Chat con modelo específico
gemini chat --model creative

# Usar alias
gchat
```

**Dentro del Chat:**
```
Tu: Estoy desarrollando un e-commerce en React
Gemini: [respuesta]

Tu: ¿Cómo manejo el carrito de compras?
Gemini: [respuesta con contexto previo]

Tu: Muéstrame código para el componente
Gemini: [código específico]

Tu: exit  # Para salir
```

**Ventajas:**
- Mantiene contexto de conversación
- No necesitas repetir información
- Iteración sobre soluciones
- Debugging colaborativo

---

## 🎨 OPCIONES AVANZADAS

### Modelos Disponibles (`--model`)

```bash
# Creative (Gemini 1.5 Flash) - Más rápido y creativo
--model creative

# Precise (Gemini Pro) - Más preciso y detallado
--model precise

# Balanced (default) - Balance entre velocidad y calidad
--model balanced

# Code (optimizado para código)
--model code

# Summary (optimizado para resúmenes)
--model summary
```

### Flags Comunes

```bash
# Streaming (ver respuesta en tiempo real)
--stream

# Guardar output
--output archivo.txt

# Combinar opciones
gemini code "hook de autenticación" --model code --stream --output useAuth.js
```

---

## 💡 CASOS DE USO REALES

### Desarrollo de FlowDistributor

#### 1️⃣ Crear Nuevo Feature
```bash
# Generar componente
gcode "Componente FlowCard que muestre estado del flujo, progreso, asignados y acciones (editar, eliminar, duplicar) usando TailwindCSS" --output src/components/FlowCard.jsx

# Generar hook
gcode "Hook useFlowStatus que escuche cambios en Firestore y actualice estado del flujo en tiempo real" --output src/hooks/useFlowStatus.js

# Generar test
gcode "Tests unitarios para FlowCard usando Vitest y React Testing Library" --output src/components/FlowCard.test.jsx
```

#### 2️⃣ Refactorizar Código Legacy
```bash
# Analizar archivo viejo
ganalyze src/legacy/OldFlowManager.js --output analisis-legacy.md

# Pedir sugerencias
gfix src/legacy/OldFlowManager.js --output plan-refactoring.md

# Implementar nuevo código
gcode "Refactoriza OldFlowManager.js a código moderno con hooks, TypeScript y mejores prácticas" --model precise
```

#### 3️⃣ Debugging
```bash
# Chat interactivo para debugging
gchat

Tu: Tengo un error en src/hooks/useFlowData.js
    El hook no actualiza cuando cambian los datos de Firestore
    [pegar código]

Gemini: [análisis del problema]

Tu: ¿Cómo implemento el listener correctamente?

Gemini: [solución detallada con código]
```

### SmartSales - Integración con Gemini AI

#### 1️⃣ Generar Descripciones de Productos
```bash
# Desde CLI
gask "Genera descripción de producto premium para una laptop gaming con RTX 4080"

# O dentro de la app usando el servicio
// En SmartSales component
import { generateProductDescription } from '@/services/geminiAI'

const description = await generateProductDescription(productData)
```

#### 2️⃣ Análisis de Sentimiento
```bash
# Analizar reseñas
gask "Analiza el sentimiento de estas reseñas: [pegar reseñas]"

# O programáticamente
import { analyzeSentiment } from '@/services/geminiAI'
const sentiment = await analyzeSentiment(reviews)
```

### ClientHub - CRM Inteligente

#### 1️⃣ Resumir Conversaciones
```bash
# Generar resumen de chat largo
gemini summarize conversacion-cliente-123.txt --output resumen-cliente.md

# Programáticamente
import { summarizeConversation } from '@/services/geminiAI'
const summary = await summarizeConversation(messages)
```

#### 2️⃣ Sugerir Respuestas
```bash
# Obtener sugerencias
gask "Cliente pregunta sobre reembolso de producto defectuoso. Sugiere 3 respuestas profesionales"

# En la app
import { suggestResponses } from '@/services/geminiAI'
const suggestions = await suggestResponses(customerMessage, conversationHistory)
```

### AnalyticsPro - Insights con IA

#### 1️⃣ Predecir Tendencias
```bash
# Analizar datos
gask "Tengo estos datos de ventas mensuales: [datos]. Predice tendencia próximos 3 meses"

# Programáticamente
import { predictTrends } from '@/services/geminiAI'
const prediction = await predictTrends(salesData, 'ventas')
```

#### 2️⃣ Generar Insights
```bash
# Análisis de dashboard
gcode "Función que analice métricas de dashboard y genere insights automáticos" --model code

# En la app
import { generateInsights } from '@/services/geminiAI'
const insights = await generateInsights(metrics)
```

### TeamSync - Colaboración

#### 1️⃣ Generar Documentación
```bash
# Documentar componente
gemini explain src/components/TeamBoard.jsx --output docs/TeamBoard.md

# Generar README
gcode "README.md completo para módulo de colaboración en tiempo real con Firebase"
```

#### 2️⃣ Code Reviews Automáticos
```bash
# Revisar PR
ganalyze src/features/new-feature.js --output code-review.md

# Sugerir mejoras
gfix src/features/new-feature.js --output improvements.md
```

---

## 🚀 WORKFLOW RECOMENDADO

### 1️⃣ Antes de Codear
```bash
# Planear feature
gchat
Tu: Necesito implementar autenticación con Firebase Auth en React
Gemini: [explica opciones]
Tu: Quiero usar Google y Email/Password
Gemini: [plan detallado]
```

### 2️⃣ Generar Código Base
```bash
# Crear estructura
gcode "Hook useAuth con Firebase Auth, Google y Email/Password, error handling y persistencia" --output src/hooks/useAuth.js
```

### 3️⃣ Revisar y Mejorar
```bash
# Analizar código generado
ganalyze src/hooks/useAuth.js

# Implementar mejoras sugeridas
gfix src/hooks/useAuth.js
```

### 4️⃣ Documentar
```bash
# Generar documentación
gexplain src/hooks/useAuth.js --output docs/useAuth.md
```

### 5️⃣ Crear Tests
```bash
# Generar tests
gcode "Tests completos para useAuth.js con Vitest, mock de Firebase y casos edge" --output src/hooks/useAuth.test.js
```

---

## 🎯 TIPS & TRUCOS

### 1. Preguntas Específicas
❌ Malo: `gask "React"`
✅ Bueno: `gask "¿Cómo optimizo re-renders en un componente React que recibe props de array?"`

### 2. Contexto en Code Generation
❌ Malo: `gcode "botón"`
✅ Bueno: `gcode "Botón reutilizable con variantes (primary, secondary, danger), sizes (sm, md, lg), loading state y TailwindCSS"`

### 3. Iteración en Chat
```bash
gchat
Tu: Genera hook de fetch
Gemini: [código]
Tu: Agrega retry automático con exponential backoff
Gemini: [código mejorado]
Tu: Añade TypeScript types
Gemini: [código final]
```

### 4. Usar Modelos Apropiados
- **Creative**: Brainstorming, ideas nuevas, alternativas
- **Precise**: Código crítico, análisis profundo, debugging
- **Code**: Generación de código optimizado
- **Summary**: Resúmenes, documentación

### 5. Guardar Outputs Útiles
```bash
# Crear carpeta de recursos
mkdir gemini-outputs

# Guardar análisis importantes
ganalyze src/critical-component.jsx --output gemini-outputs/analisis-$(Get-Date -Format 'yyyy-MM-dd').md
```

---

## 🔧 TROUBLESHOOTING

### Error: "API Key not found"
```bash
# Verificar .env
cat .env | Select-String "VITE_GEMINI_API_KEY"

# Si no existe, agregar
echo "VITE_GEMINI_API_KEY=tu-api-key" >> .env
```

### Error: "Rate limit exceeded"
```bash
# Esperar 60 segundos o usar otro modelo
gemini ask "pregunta" --model creative  # Más rápido, menos rate limit
```

### Chat No Responde
```bash
# Verificar conexión a internet
Test-Connection google.com

# Reintentar con modelo diferente
gemini chat --model balanced
```

### Alias No Funcionan
```bash
# Recargar perfil
. $PROFILE

# Verificar que se ejecutó el setup
cat $PROFILE | Select-String "GEMINI"

# Si no está, ejecutar setup nuevamente
.\setup-gemini-aliases.ps1
```

---

## 📚 RECURSOS ADICIONALES

### Archivos de Referencia
- `GEMINI_IMPLEMENTATION_GUIDE.md` - Guía completa de implementación
- `GEMINI_SETUP_COMPLETE.md` - Resumen de setup
- `src/lib/gemini/config.js` - Configuración de modelos
- `src/hooks/useGemini.js` - Hook de React
- `src/services/geminiAI.js` - Servicios de alto nivel

### Servicios Programáticos

```javascript
// Importar servicios
import {
  analyzeText,
  generateProductDescription,
  analyzeSentiment,
  summarizeConversation,
  suggestResponses,
  predictTrends,
  generateInsights,
  generateCode,
  explainCode,
  translate,
  summarize,
  improveText
} from '@/services/geminiAI'

// Usar en componentes
const ProductGenerator = () => {
  const handleGenerate = async () => {
    const desc = await generateProductDescription({
      name: 'Laptop Gaming',
      features: ['RTX 4080', '32GB RAM'],
      target: 'gamers profesionales'
    })
    console.log(desc)
  }
}
```

### Componentes UI Disponibles
```javascript
// GeminiAssistant - Asistente completo
import GeminiAssistant from '@/components/ai/GeminiAssistant'
<GeminiAssistant />

// GeminiChat - Chat interactivo
import GeminiChat from '@/components/ai/GeminiChat'
<GeminiChat />

// GeminiQuickAction - Botones de acción rápida
import GeminiQuickAction from '@/components/ai/GeminiQuickAction'
<GeminiQuickAction action="summarize" data={text} />
```

---

## 🎉 ¡LISTO PARA USAR!

```bash
# Empezar con lo básico
gemini help

# Hacer tu primera pregunta
gask "¿Cómo te puedo usar mejor?"

# O iniciar un chat
gchat
```

**¡Happy coding with Gemini! 🚀✨**
