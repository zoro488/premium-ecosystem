# 🤖 Sistema de Automatización CrewAI - FlowDistributor

Sistema inteligente de auto-implementación de componentes faltantes usando **CrewAI** y **agents especializados**.

## 📊 Estado Actual

### Completitud Global: **65%**

| Sección                        | Estado | Faltante    | Prioridad |
| ------------------------------ | ------ | ----------- | --------- |
| **Bancos (6 bancos × 4 tabs)** | 20%    | 24 tabs     | 🔴 CRÍTICA |
| **Dashboard IA**               | 15%    | 10+ widgets | 🟡 ALTA    |
| **Sistema ML**                 | 0%     | 5 módulos   | 🟡 MEDIA   |
| **Reportes Avanzados**         | 30%    | 8 tipos     | 🟡 MEDIA   |

### Impacto Estimado

Implementando los **4 gaps críticos**, se aumentaría la completitud de **65% → 95%+** (+30%).

---

## 🤖 Agents CrewAI

El sistema utiliza **5 agents especializados** que trabajan en secuencia:

### 1. **AnalystAgent** 📊
- **Rol:** Analista de Código Senior
- **Tarea:** Analiza el Plan Maestro vs código actual, identifica gaps, prioriza tareas
- **Output:** JSON con análisis completo y plan de implementación

### 2. **ArchitectAgent** 🏗️
- **Rol:** Arquitecto de Software
- **Tarea:** Diseña arquitectura de componentes (interfaces, props, state, hooks)
- **Output:** Diseño arquitectónico completo con TypeScript interfaces

### 3. **DeveloperAgent** 👨‍💻
- **Rol:** Desarrollador Full-Stack Senior
- **Tarea:** Implementa componentes siguiendo el diseño arquitectónico
- **Output:** Código TypeScript/React completo listo para producción

### 4. **TesterAgent** 🧪
- **Rol:** QA Engineer & Test Automation Specialist
- **Tarea:** Crea tests unitarios (Vitest + RTL) con cobertura >80%
- **Output:** Suite completa de tests

### 5. **ReviewerAgent** ✅
- **Rol:** Code Reviewer & Quality Assurance Lead
- **Tarea:** Revisa código, tests, documentación, asegura calidad enterprise
- **Output:** Reporte de revisión con aprobación o lista de cambios

---

## 🚀 Instalación

### Prerrequisitos

- **Python 3.10+**
- **PowerShell 7+** (Windows) o **Bash** (Linux/Mac)
- **API Key:** `OPENAI_API_KEY` o `GITHUB_TOKEN`

### 1. Setup Inicial

```powershell
# Ejecutar setup (crea venv, instala dependencias)
.\scripts\crew-ai-automation.ps1 -Action setup
```

Esto hará:
- ✅ Verificar Python 3.10+
- ✅ Crear virtual environment (`.venv/`)
- ✅ Instalar CrewAI y dependencias
- ✅ Verificar variables de entorno

### 2. Configurar API Key

**Opción A: Variable de entorno**
```powershell
$env:OPENAI_API_KEY = "sk-..."
```

**Opción B: Archivo `.env` en la raíz**
```bash
OPENAI_API_KEY=sk-...
# O usando GitHub Models (gratis):
GITHUB_TOKEN=ghp_...
```

---

## 📚 Uso

### Comando 1: Analizar Gaps

```powershell
.\scripts\crew-ai-automation.ps1 -Action analyze
```

**Output:**
- Lista de gaps críticos con prioridad
- Componentes faltantes por gap
- Estimaciones de líneas y tiempo
- Estadísticas del proyecto

### Comando 2: Crear Boilerplates

```powershell
.\scripts\crew-ai-automation.ps1 -Action boilerplate
```

**Crea archivos base para:**
- `components/bancos/BancoTabs.tsx`
- `components/bancos/TabIngresosBanco.tsx`
- `components/bancos/TabGastosBanco.tsx`
- `components/bancos/TabTransferenciasBanco.tsx`
- `components/bancos/TabCortesBanco.tsx`
- `components/dashboard/DashboardIAComplete.tsx`
- `components/dashboard/PredictiveWidgets.tsx`
- Y más...

### Comando 3: Implementar un Gap Específico

```powershell
# Implementar solo bancos_tabs (el más crítico)
.\scripts\crew-ai-automation.ps1 -Action implement -Gap bancos_tabs
```

**Gaps disponibles:**
- `bancos_tabs` - 6 bancos × 4 tabs (Prioridad CRÍTICA, Impacto 35%)
- `dashboard_ia` - Dashboard IA completo (Prioridad ALTA, Impacto 20%)
- `sistema_ml` - Machine Learning con TensorFlow.js (Prioridad MEDIA, Impacto 15%)
- `reportes_avanzados` - 8 tipos de reportes + export (Prioridad MEDIA, Impacto 10%)

**Proceso (por gap):**
1. AnalystAgent analiza el gap y crea plan de implementación
2. ArchitectAgent diseña arquitectura de cada componente
3. DeveloperAgent implementa código TypeScript/React
4. TesterAgent crea tests con Vitest + RTL
5. ReviewerAgent revisa calidad y genera reporte

**Duración estimada:** 15-30 minutos por gap (depende del LLM)

### Comando 4: Implementar TODOS los Gaps

```powershell
# ⚠️ ADVERTENCIA: Esto tarda mucho (1-2 horas)
.\scripts\crew-ai-automation.ps1 -Action implement-all
```

Implementará **todos los gaps** en orden de prioridad:
1. `bancos_tabs` (CRÍTICA)
2. `dashboard_ia` (ALTA)
3. `sistema_ml` (MEDIA)
4. `reportes_avanzados` (MEDIA)

### Comando 5: Generar Reporte

```powershell
.\scripts\crew-ai-automation.ps1 -Action report
```

**Output:**
- Total de gaps
- Total de componentes faltantes
- Total de líneas estimadas
- Desglose por prioridad

---

## 🎯 Gaps Críticos Detallados

### 1. **bancos_tabs** (Prioridad CRÍTICA)

**Problema:** 6 bancos solo tienen wrappers básicos, **faltan las 4 tabs obligatorias**.

**Componentes a crear (5 archivos, ~3,000 líneas):**

#### `BancoTabs.tsx` (400 líneas)
- Container principal con navegación de tabs
- Layout responsive
- Animaciones Framer Motion
- Gestión de estado (tab activa)

#### `TabIngresosBanco.tsx` (500 líneas)
- Tabla de ingresos con 9 columnas:
  - Fecha, Concepto, Monto, Origen, Categoría, Método Pago, Banco Destino, Usuario, Notas
- 2 charts:
  - Line Chart: Ingresos por día
  - Bar Chart: Ingresos por categoría
- Filtros avanzados
- Export Excel/PDF
- Paginación

#### `TabGastosBanco.tsx` (600 líneas)
- Tabla de gastos con 11 columnas:
  - Fecha, Concepto, Monto, Proveedor, Categoría, Subcategoría, Método Pago, Banco Origen, Usuario, Estado, Notas
- Sistema de alertas (gastos > $10,000)
- 2 charts:
  - Donut Chart: Gastos por categoría
  - Area Chart: Tendencia de gastos
- Comparativa con presupuesto
- Filtros y búsqueda

#### `TabTransferenciasBanco.tsx` (700 líneas)
- Tabla de transferencias con 10 columnas:
  - Fecha, Banco Origen, Banco Destino, Monto, Tipo, Concepto, Usuario, Estado, Comisión, Notas
- **Sankey Diagram:** Flujo de dinero entre bancos
- **Network Graph:** Relaciones entre bancos
- Análisis de flujos
- Validaciones (saldos, límites)

#### `TabCortesBanco.tsx` (800 líneas)
- Tabla de cortes con 10 columnas:
  - Fecha Corte, Saldo Inicial, Total Ingresos, Total Gastos, Total Transferencias Entrada, Total Transferencias Salida, Saldo Final, Diferencia, Usuario, Notas
- 5 charts:
  1. Line Chart: Evolución del saldo
  2. Waterfall Chart: Desglose de movimientos
  3. Gauge Chart: Health score del banco
  4. Heatmap Calendar: Actividad por día
  5. Comparison Chart: vs mes anterior
- Análisis automático de anomalías
- Predicciones ML (próximo corte)
- Export completo

**Integración en 6 bancos:**
- `pages/bancos/BovedaMontePage.jsx`
- `pages/bancos/BovedaUSAPage.jsx`
- `pages/bancos/UtilidadesPage.jsx`
- `pages/bancos/FletesPage.jsx`
- `pages/bancos/AztecaPage.jsx`
- `pages/bancos/LeftiePage.jsx`

### 2. **dashboard_ia** (Prioridad ALTA)

**Componentes:**
- `DashboardIAComplete.tsx` - Dashboard principal con grid responsive
- `PredictiveWidgets.tsx` - Widgets de predicción (ventas, inventario, flujo)
- `RealtimeMetricsPanel.tsx` - Métricas en tiempo real con WebSocket

### 3. **sistema_ml** (Prioridad MEDIA)

**Componentes:**
- `MLPredictionService.ts` - Predicciones con TensorFlow.js
- `AnomalyDetector.ts` - Detección de anomalías en transacciones

### 4. **reportes_avanzados** (Prioridad MEDIA)

**Componentes:**
- `ReportBuilderV2.tsx` - Constructor visual con drag & drop
- `ExportService.ts` - Export Excel, PDF, CSV

---

## 📈 Roadmap de Implementación

### Semana 1: Bancos (CRÍTICA)
```
Día 1-2: BancoTabs.tsx + TabIngresosBanco.tsx
Día 3-4: TabGastosBanco.tsx + TabTransferenciasBanco.tsx
Día 5: TabCortesBanco.tsx
Día 6-7: Integración en 6 bancos + tests
```

**Resultado:** 65% → 85% (+20%)

### Semana 2: Dashboard IA (ALTA)
```
Día 8-10: DashboardIAComplete.tsx + widgets
Día 11-12: Integración Firebase + WebSocket
Día 13-14: Tests + optimización
```

**Resultado:** 85% → 90% (+5%)

### Semana 3-4: Sistema ML + Reportes (MEDIA)
```
Día 15-18: MLPredictionService + AnomalyDetector
Día 19-22: ReportBuilderV2 + ExportService
Día 23-28: Tests E2E + documentación
```

**Resultado:** 90% → 95%+ (+5%)

---

## 🔧 Configuración Avanzada

### Cambiar LLM

Por defecto usa **OpenAI GPT-4**. Para usar otro LLM:

**Archivo:** `.github/agents/crew-ai-implementation-agent.py`

```python
# GitHub Models (gratis, requiere GitHub token)
from langchain_github import ChatGitHub
LLM = ChatGitHub(
    model="gpt-4o",
    github_token=os.getenv("GITHUB_TOKEN")
)

# Anthropic Claude
from langchain_anthropic import ChatAnthropic
LLM = ChatAnthropic(
    model="claude-3-opus-20240229",
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

# Azure OpenAI
from langchain_openai import AzureChatOpenAI
LLM = AzureChatOpenAI(
    azure_deployment="gpt-4",
    api_version="2024-02-01",
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY")
)
```

### Dry Run (sin ejecutar)

```powershell
.\scripts\crew-ai-automation.ps1 -Action implement -Gap bancos_tabs -DryRun
```

### Verbose Mode (debug)

```powershell
.\scripts\crew-ai-automation.ps1 -Action implement -Gap bancos_tabs -Verbose
```

---

## 📊 Métricas de Éxito

### Antes de Automatización
- **Completitud:** 65%
- **Componentes faltantes:** ~30
- **Líneas estimadas:** ~10,000
- **Tiempo manual:** 2-3 meses

### Después de Automatización
- **Completitud:** 95%+
- **Componentes generados:** 30
- **Líneas generadas:** 10,000+
- **Tiempo con CrewAI:** 2-4 semanas (70% reducción)

---

## 🐛 Troubleshooting

### Error: "Python no encontrado"
```powershell
# Instalar Python 3.10+
winget install Python.Python.3.11
```

### Error: "No module named 'crewai'"
```powershell
# Reinstalar dependencias
.\scripts\crew-ai-automation.ps1 -Action setup
```

### Error: "API key not found"
```powershell
# Configurar API key
$env:OPENAI_API_KEY = "sk-..."
# O crear archivo .env en la raíz
```

### Error: "Rate limit exceeded"
```powershell
# Esperar o usar otro LLM (GitHub Models es gratis)
$env:GITHUB_TOKEN = "ghp_..."
```

---

## 📚 Recursos

- **CrewAI Docs:** https://docs.crewai.com/
- **LangChain Docs:** https://python.langchain.com/
- **Plan Maestro:** `src/apps/FlowDistributor/chronos-system/gg/PLAN_MAESTRO_COMPLETO_Version2.md`
- **Análisis Comparativo:** Generado por subagent

---

## 🤝 Contribuir

Para agregar nuevos gaps o modificar agents:

1. **Editar gaps en:** `.github/agents/crew-ai-implementation-agent.py`
   ```python
   GAPS_CRITICOS = {
       "nuevo_gap": {
           "prioridad": "ALTA",
           "impacto": "15%",
           "componentes": [...]
       }
   }
   ```

2. **Ejecutar:**
   ```powershell
   .\scripts\crew-ai-automation.ps1 -Action analyze
   ```

---

## ✅ Checklist de Uso

- [ ] Instalado Python 3.10+
- [ ] Ejecutado `.\scripts\crew-ai-automation.ps1 -Action setup`
- [ ] Configurada API key (`OPENAI_API_KEY` o `GITHUB_TOKEN`)
- [ ] Ejecutado `.\scripts\crew-ai-automation.ps1 -Action analyze`
- [ ] Creados boilerplates: `.\scripts\crew-ai-automation.ps1 -Action boilerplate`
- [ ] Implementado gap crítico: `.\scripts\crew-ai-automation.ps1 -Action implement -Gap bancos_tabs`
- [ ] Revisado código generado
- [ ] Ejecutados tests: `npm run test`
- [ ] Build exitoso: `npm run build`

---

**¿Listo para empezar?**

```powershell
# 1. Setup inicial
.\scripts\crew-ai-automation.ps1 -Action setup

# 2. Analizar gaps
.\scripts\crew-ai-automation.ps1 -Action analyze

# 3. Crear boilerplates
.\scripts\crew-ai-automation.ps1 -Action boilerplate

# 4. Implementar gap más crítico
.\scripts\crew-ai-automation.ps1 -Action implement -Gap bancos_tabs
```

🚀 **¡Deja que los agents hagan el trabajo por ti!**
