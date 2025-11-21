# 🎉 ¡GEMINI ESTÁ LISTO! - GUÍA DE USO RÁPIDO

## ✅ ESTADO: TOTALMENTE FUNCIONAL

**Modelo**: `gemini-2.0-flash-exp` (Experimental, más reciente)
**API Key**: Configurada y funcionando
**CLI**: Operativo con todos los comandos
**Aliases**: Activados en PowerShell

---

## 🚀 COMANDOS RÁPIDOS (ALIASES)

### 1. Hacer Preguntas (`gask`)

```bash
gask "¿Cómo funciona async/await en JavaScript?"
gask "Explica el patrón Observer"
gask "¿Cuál es la mejor práctica para manejar errores en React?"
```

### 2. Generar Código (`gcode`)

```bash
gcode "Función para validar emails con regex"
gcode "Hook personalizado para fetch con retry automático"
gcode "Componente de tarjeta de producto con TailwindCSS"
```

### 3. Chat Interactivo (`gchat`)

```bash
gchat
# Inicia conversación con contexto
# Escribe "exit" para salir
```

### 4. Analizar Archivos (`ganalyze`)

```bash
ganalyze src/App.jsx
ganalyze src/hooks/useAuth.js
```

### 5. Explicar Código (`gexplain`)

```bash
gexplain src/components/Dashboard.jsx
gexplain src/utils/helpers.js
```

### 6. Sugerir Mejoras (`gfix`)

```bash
gfix src/legacy/OldComponent.jsx
gfix src/services/api.js
```

---

## 🎯 COMANDOS COMPLETOS (sin alias)

Si prefieres usar el comando completo:

```bash
node gemini-cli.js ask "pregunta"
node gemini-cli.js code "descripción"
node gemini-cli.js chat
node gemini-cli.js analyze archivo.js
node gemini-cli.js explain archivo.js
node gemini-cli.js fix archivo.js
node gemini-cli.js translate "texto" --to english
node gemini-cli.js summarize archivo.md
```

---

## 🎨 MODELOS DISPONIBLES

Usa `--model` para especificar el modelo:

```bash
# Creativo (ideas, brainstorming)
gask "Dame ideas para features" --model creative

# Preciso (análisis, debugging)
gask "Analiza este error" --model precise

# Código (generación optimizada)
gcode "algoritmo de búsqueda" --model code

# Balanceado (uso general) - DEFAULT
gask "pregunta cualquiera"
```

---

## 💡 CASOS DE USO PRÁCTICOS

### Desarrollo de Features

```bash
# 1. Planificar
gchat
Tu: Necesito implementar autenticación con Firebase
Gemini: [plan detallado]

# 2. Generar código
gcode "Hook useAuth con Firebase Auth, Google y Email/Password"

# 3. Revisar
ganalyze src/hooks/useAuth.js

# 4. Mejorar
gfix src/hooks/useAuth.js
```

### Code Review Rápido

```bash
# Revisar cambios
ganalyze src/features/nueva-feature.js

# Sugerir mejoras
gfix src/features/nueva-feature.js
```

### Debugging

```bash
# Modo chat para debugging
gchat

Tu: Tengo un error en useEffect, el componente re-renderiza infinitamente
Gemini: [análisis]
Tu: [pegar código]
Gemini: [solución]
```

### Documentación

```bash
# Explicar componente
gexplain src/components/Dashboard.jsx --output docs/Dashboard.md

# Generar README
gcode "README completo para módulo de autenticación"
```

### Refactoring

```bash
# Analizar código legacy
ganalyze src/legacy/OldCode.js

# Obtener plan de refactoring
gfix src/legacy/OldCode.js

# Generar código modernizado
gcode "Refactoriza OldCode.js con hooks y mejores prácticas"
```

---

## 📊 OPCIONES AVANZADAS

### Guardar Output

```bash
gcode "función compleja" --output codigo.js
gask "explicación larga" --output explicacion.md
```

### Streaming (ver respuesta en tiempo real)

```bash
gask "explicación detallada" --stream
```

### JSON Output

```bash
gask "datos estructurados" --json
```

---

## 🔥 WORKFLOWS RECOMENDADOS

### 1. Desarrollo Full-Stack

```bash
# Backend: Generar API endpoint
gcode "Express endpoint para crear usuario con validación y hash de password"

# Frontend: Generar componente
gcode "Componente React de formulario de registro con validación Zod"

# Tests: Generar pruebas
gcode "Tests para endpoint de registro con Vitest"
```

### 2. Optimización de Performance

```bash
# Analizar componente
ganalyze src/components/SlowComponent.jsx

# Obtener sugerencias
gfix src/components/SlowComponent.jsx

# Implementar mejoras
gcode "Optimiza SlowComponent.jsx con React.memo, useMemo y useCallback"
```

### 3. Migración de Tecnología

```bash
# Analizar código actual
gexplain src/legacy/ClassComponent.jsx

# Generar versión moderna
gcode "Convierte ClassComponent.jsx a hooks con TypeScript"
```

---

## 🎓 TIPS & TRUCOS

### 1. Sé Específico

❌ `gcode "botón"`
✅ `gcode "Botón reutilizable con variantes (primary, secondary), loading state y TailwindCSS"`

### 2. Usa Contexto en Chat

```bash
gchat
Tu: Estoy desarrollando un dashboard
Gemini: [respuesta]
Tu: Necesito mostrar métricas en tiempo real
Gemini: [usa contexto previo]
Tu: Con gráficos de Chart.js
Gemini: [solución integrada]
```

### 3. Combina Comandos

```bash
# Analizar → Mejorar → Implementar
ganalyze archivo.js
gfix archivo.js
gcode "implementa las mejoras sugeridas en archivo.js"
```

### 4. Usa Modelos Apropiados

- **creative**: Ideas, alternativas, brainstorming
- **precise**: Análisis profundo, debugging, código crítico
- **code**: Generación de código optimizado
- **balanced**: Uso general (default)

---

## 🔧 INTEGRACIÓN EN TU APP

### Usar desde React Components

```javascript
import { useGemini } from '@/hooks/useGemini'

function MyComponent() {
  const { generateContent, loading, response } = useGemini()

  const handleAsk = async () => {
    await generateContent('Tu pregunta aquí')
  }

  return (
    <div>
      <button onClick={handleAsk} disabled={loading}>
        {loading ? 'Pensando...' : 'Preguntar a Gemini'}
      </button>
      {response && <p>{response}</p>}
    </div>
  )
}
```

### Usar Servicios Directamente

```javascript
import {
  generateProductDescription,
  analyzeSentiment,
  predictTrends
} from '@/services/geminiAI'

// En SmartSales
const desc = await generateProductDescription(product)

// En ClientHub
const sentiment = await analyzeSentiment(reviews)

// En AnalyticsPro
const prediction = await predictTrends(salesData)
```

### Componentes UI Pre-construidos

```jsx
import GeminiAssistant from '@/components/ai/GeminiAssistant'
import GeminiChat from '@/components/ai/GeminiChat'

// Asistente completo
<GeminiAssistant />

// Chat interactivo
<GeminiChat />
```

---

## 📚 DOCUMENTACIÓN COMPLETA

- **Guía de Implementación**: `GEMINI_IMPLEMENTATION_GUIDE.md`
- **Guía CLI Completa**: `GEMINI_CLI_GUIDE.md`
- **Configuración Avanzada**: `GEMINI_ADVANCED_CONFIG.md`
- **Setup de API**: `GEMINI_API_SETUP.md`
- **Resumen Final**: `GEMINI_FINAL_SUMMARY.md`

---

## 🆘 TROUBLESHOOTING RÁPIDO

### Si algo falla

```bash
# 1. Verificar setup completo
.\verify-gemini-complete.ps1

# 2. Verificar API key
cat .env | Select-String "VITE_GEMINI_API_KEY"

# 3. Probar conexión básica
gask "test"

# 4. Recargar aliases
. $PROFILE

# 5. Ver ayuda
gemini help
```

---

## 🎉 ¡EMPIEZA AHORA

```bash
# Tu primer comando
gask "¿Cómo puedo usar Gemini en mi código React?"

# O inicia un chat
gchat
```

---

**¡Disfruta del poder de Gemini AI en tu workflow! 🚀✨**

*Última actualización: Noviembre 2025*
*Modelo: gemini-2.0-flash-exp*
*Status: ✅ Totalmente Operacional*
