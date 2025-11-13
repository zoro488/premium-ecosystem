# ====================================
# GEMINI AI - CONFIGURACIÓN AVANZADA
# ====================================
# Configuración para VS Code settings.json

# Agregar estas líneas a .vscode/settings.json

## Google Cloud Code Extension
{
  "cloudcode.duetAI.project": "premium-ecosystem",
  "cloudcode.duetAI.inlineCompletion.enabled": true,
  "cloudcode.duetAI.inlineCompletion.enableCodeSuggestions": true,
  "cloudcode.duetAI.inlineCompletion.enableTestGeneration": true,
  "cloudcode.duetAI.completionMaxTokens": 2048,

  ## Gemini API Settings
  "gemini.apiKey": "${env:VITE_GEMINI_API_KEY}",
  "gemini.model": "gemini-pro",
  "gemini.temperature": 0.7,
  "gemini.maxTokens": 2048,

  ## AI Inline Suggestions
  "editor.inlineSuggest.enabled": true,
  "editor.inlineSuggest.showToolbar": "always",
  "editor.quickSuggestions": {
    "comments": true,
    "strings": true,
    "other": true
  },

  ## Copilot + Gemini Integration
  "github.copilot.enable": {
    "*": true
  },
  "github.copilot.advanced": {
    "temperature": 0.5,
    "top_p": 1,
    "listCount": 3
  },

  ## Multi-AI Strategy
  "copilot.experimental.multiModelPredictions": true,
  "copilot.experimental.contextualInlineSuggestions": true
}

# ====================================
# SNIPPETS PERSONALIZADOS
# ====================================

## JavaScript/TypeScript (.vscode/gemini.code-snippets)
{
  "Gemini Ask": {
    "prefix": "gask",
    "body": [
      "import { geminiService } from '@/services/geminiAI'",
      "",
      "const response = await geminiService.analyzeText('${1:prompt}')",
      "console.log(response)"
    ],
    "description": "Quick Gemini API call"
  },

  "Gemini Hook": {
    "prefix": "ghook",
    "body": [
      "import { useGemini } from '@/hooks/useGemini'",
      "",
      "const { generateContent, loading, error, response } = useGemini()",
      "",
      "const handleGenerate = async () => {",
      "  await generateContent('${1:prompt}')",
      "}"
    ],
    "description": "Use Gemini hook"
  },

  "Gemini Component": {
    "prefix": "gcomp",
    "body": [
      "import { GeminiAssistant } from '@/components/ai/GeminiAssistant'",
      "",
      "export default function ${1:ComponentName}() {",
      "  return (",
      "    <div>",
      "      <GeminiAssistant />",
      "    </div>",
      "  )",
      "}"
    ],
    "description": "Component with Gemini Assistant"
  }
}

# ====================================
# TASKS PERSONALIZADAS
# ====================================

## .vscode/tasks.json (agregar)
{
  "label": "🧠 Gemini: Ask",
  "type": "shell",
  "command": "node gemini-cli.js ask \"${input:geminiQuery}\"",
  "group": "none",
  "presentation": {
    "reveal": "always",
    "panel": "new"
  }
},
{
  "label": "🧠 Gemini: Analyze Current File",
  "type": "shell",
  "command": "node gemini-cli.js analyze \"${file}\"",
  "group": "test",
  "presentation": {
    "reveal": "always",
    "panel": "new"
  }
},
{
  "label": "🧠 Gemini: Chat Interactive",
  "type": "shell",
  "command": "node gemini-cli.js chat",
  "group": "none",
  "isBackground": false,
  "presentation": {
    "reveal": "always",
    "panel": "new",
    "focus": true
  }
}

# ====================================
# KEYBINDINGS RECOMENDADOS
# ====================================

## .vscode/keybindings.json
[
  {
    "key": "ctrl+shift+g ctrl+shift+a",
    "command": "workbench.action.tasks.runTask",
    "args": "🧠 Gemini: Ask"
  },
  {
    "key": "ctrl+shift+g ctrl+shift+c",
    "command": "workbench.action.tasks.runTask",
    "args": "🧠 Gemini: Chat Interactive"
  },
  {
    "key": "ctrl+shift+g ctrl+shift+e",
    "command": "workbench.action.tasks.runTask",
    "args": "🧠 Gemini: Analyze Current File"
  },
  {
    "key": "ctrl+shift+g ctrl+shift+h",
    "command": "editor.action.showHover"
  }
]

# ====================================
# EXTENSIONES RECOMENDADAS
# ====================================

## Instalar
code --install-extension googlecloudtools.cloudcode
code --install-extension github.copilot
code --install-extension github.copilot-chat
code --install-extension visualstudioexptteam.vscodeintellicode
code --install-extension continue.continue

# ====================================
# VARIABLES DE ENTORNO
# ====================================

## .env (verificar)
VITE_GEMINI_API_KEY=AIzaSyAh-W4sEjQaIsz52xQfy4ypi4gZ8S4S1xA
VITE_GEMINI_MODEL=gemini-pro
VITE_GEMINI_TEMPERATURE=0.7

## .env.local (para desarrollo local)
VITE_GEMINI_DEBUG=true
VITE_GEMINI_LOG_REQUESTS=true

# ====================================
# USO AVANZADO
# ====================================

## 1. Inline Completions
# Escribe código y espera sugerencias automáticas
# Ctrl+Space para forzar sugerencias

## 2. Chat Contextual
# Selecciona código → Ctrl+Shift+G C → Pregunta sobre él

## 3. Análisis Automático
# Guarda archivo → Gemini analiza automáticamente (requiere extensión)

## 4. Multi-AI Workflow
# 1. Copilot genera código base
# 2. Gemini optimiza y revisa
# 3. Claude (si disponible) documenta
# 4. IntelliCode sugiere mejoras

## 5. CLI + VS Code Integration
# Terminal integrada → gemini chat
# O usa tasks con Ctrl+Shift+P → Tasks: Run Task → Gemini

# ====================================
# TROUBLESHOOTING
# ====================================

## Si Cloud Code no funciona:
# 1. Verificar Google Cloud SDK instalado
# 2. Ejecutar: gcloud auth login
# 3. Configurar proyecto: gcloud config set project premium-ecosystem
# 4. Reiniciar VS Code

## Si API no responde:
# 1. Verificar .env tiene VITE_GEMINI_API_KEY
# 2. Verificar conexión internet
# 3. Verificar cuota API en Google AI Studio
# 4. Revisar Console de errores (Ctrl+Shift+I)

## Si snippets no aparecen:
# 1. Verificar archivo .vscode/gemini.code-snippets existe
# 2. Reload window: Ctrl+Shift+P → Reload Window
# 3. Verificar lenguaje del archivo (bottom-right)
