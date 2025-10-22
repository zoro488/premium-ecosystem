# ⚡ ZEROFORCE AI - Guía Completa de Instalación y Uso

## 🎯 ¿Qué es ZeroForce?

**ZEROFORCE** es el sistema de Inteligencia Artificial más avanzado para tu aplicación Premium Ecosystem. Diseñado para proporcionar análisis ultra-profundos, predicciones precisas y asistencia en tiempo real con capacidades de última generación.

### 🚀 Características ULTRA Avanzadas

- ⚡ **Multi-Agente**: Sistema de múltiples IAs trabajando en paralelo
- 📊 **Análisis Predictivo**: Machine Learning integrado
- 🎯 **RAG**: Retrieval Augmented Generation con embeddings vectoriales
- 🔮 **NLP Avanzado**: Comandos de voz con procesamiento de lenguaje natural
- 📈 **Dashboard 3D**: Visualizaciones holográficas en tiempo real
- 🔌 **Plugins Dinámicos**: Sistema extensible
- 💡 **Proactivo**: Sugerencias inteligentes basadas en contexto
- 🌐 **Streaming**: Respuestas en tiempo real mientras se generan
- 🎨 **Interfaz Sci-Fi**: Diseño holográfico tipo película
- 🔐 **Memoria Persistente**: Aprendizaje continuo con 1000+ conversaciones
- ⚙️ **Auto-Optimización**: Ajuste automático de parámetros
- 🚀 **Multi-Modelo**: Selección inteligente del mejor modelo para cada tarea

---

## 📥 Instalación de Ollama (Motor de IA Local)

### Paso 1: Descargar Ollama

**Windows:**
1. Ve a: https://ollama.com/download
2. Descarga `OllamaSetup.exe`
3. Ejecuta el instalador
4. Sigue las instrucciones del asistente

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Paso 2: Iniciar el Servidor

Abre PowerShell, CMD o Terminal y ejecuta:

```bash
ollama serve
```

Deberías ver:
```
Ollama is running on http://localhost:11434
```

> 💡 **Tip**: Mantén esta ventana abierta mientras usas ZeroForce. El servidor corre en segundo plano.

---

## 🧠 Instalación de Modelos de IA

ZeroForce soporta múltiples modelos. Aquí están los **MEJORES** para diferentes usos:

### 🏆 RECOMENDADO: Qwen 2.5 (Modelo Principal)

```bash
ollama pull qwen2.5:7b
```

**Características:**
- 7B parámetros = Muy inteligente
- Excelente en **español**
- Análisis de datos empresariales
- Respuestas estructuradas y precisas
- RAM necesaria: 16 GB

---

### ⚡ Llama 3.2 (Modelo Rápido)

```bash
ollama pull llama3.2:latest
```

**Características:**
- 3B parámetros = Ultra rápido
- Bueno para consultas simples
- RAM necesaria: 8 GB
- Ideal para hardware limitado

---

### 🧠 Mistral (Modelo Inteligente)

```bash
ollama pull mistral:latest
```

**Características:**
- 7B parámetros
- Máxima inteligencia
- Tareas complejas
- RAM necesaria: 16 GB

---

### 💻 CodeLlama (Especializado en Código)

```bash
ollama pull codellama:latest
```

**Características:**
- Especializado en programación
- Debugging y análisis de código
- Generación de código
- RAM necesaria: 16 GB

---

### 📦 Tabla Comparativa de Modelos

| Modelo | Tamaño | RAM | Velocidad | Inteligencia | Mejor Para |
|--------|--------|-----|-----------|--------------|------------|
| **qwen2.5:7b** 🏆 | 7B | 16 GB | ⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ | **Español, Empresarial, Analytics** |
| **llama3.2** | 3B | 8 GB | ⚡⚡⚡⚡⚡ | ⭐⭐⭐⭐ | Rápido, Hardware limitado |
| **mistral** | 7B | 16 GB | ⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ | Tareas muy complejas |
| **codellama** | 7B | 16 GB | ⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ | Programación, Debugging |
| **phi3** | 3.8B | 8 GB | ⚡⚡⚡⚡⚡ | ⭐⭐⭐⭐ | Microsoft, muy rápido |
| **gemma2** | 9B | 16 GB | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | Google, muy preciso |

---

## 🎮 Uso de ZeroForce

### 1️⃣ Activar ZeroForce

1. **Ejecuta la aplicación:**
   ```bash
   npm run dev
   ```

2. **Busca el botón flotante** en la esquina inferior derecha:
   - Verás un cerebro 🧠 con efectos holográficos
   - Tiene un indicador verde pulsante ⚫

3. **Haz clic** para abrir ZeroForce

### 2️⃣ Primera Configuración

Al abrir ZeroForce por primera vez:

1. Haz clic en el botón **⚙️ Settings**
2. Configura:
   - **Host**: `http://localhost:11434` (por defecto, no cambiar)
   - **Modelo**: Selecciona `qwen2.5:7b` (recomendado)
   - **Temperature**: `0.8` (creatividad balanceada)
   - **Opciones**:
     - ✅ Streaming de respuestas (ver texto mientras se genera)
     - ✅ Respuestas por voz (opcional)
     - ✅ Sugerencias proactivas (recomendaciones automáticas)
     - ✅ Multi-Agente (múltiples IAs en paralelo)
     - ✅ RAG (búsqueda en conversaciones previas)
     - ✅ Auto-optimización (ajuste automático)

3. Haz clic en **💾 Guardar**

### 3️⃣ Modos de Vista

ZeroForce tiene 3 modos de visualización:

#### 📱 Modo Chat
- Conversación normal con la IA
- Mensajes con avatares holográficos
- Streaming de respuestas en tiempo real

#### 📊 Modo Analytics
- Dashboard con métricas del sistema
- Gráficos en tiempo real:
  - CPU usage
  - RAM usage
  - Requests activos
  - Errores detectados
- Insights automáticos
- Predicciones

#### 🔀 Modo Híbrido
- Chat + Analytics side-by-side
- Máxima productividad
- Vista completa del sistema

**Cambiar de modo:** Haz clic en el ícono superior (💬/📊/🔀)

---

## 🎤 Comandos de Voz Avanzados

### Activar Comandos de Voz

1. Haz clic en el botón **🎤 Micrófono**
2. Permite el acceso al micrófono
3. Habla claramente

### Comandos Especiales

| Comando | Acción |
|---------|--------|
| **"ZeroForce"** | Activa el sistema |
| **"Estado del sistema"** | Muestra métricas actuales |
| **"Mostrar análisis"** | Cambia a vista Analytics |
| **"Mostrar chat"** | Cambia a vista Chat |
| **"Limpiar"** | Borra el historial |
| **"Analiza [tema]"** | Análisis profundo del tema |
| **"Predice [aspecto]"** | Predicción basada en datos |

---

## 💡 Consultas Recomendadas

### Para Análisis de Datos

```
Analiza el rendimiento actual del sistema
```
```
Dame insights sobre las transacciones de hoy
```
```
Predice tendencias para la próxima semana
```
```
Detecta anomalías en los datos
```

### Para Optimización

```
Sugiere optimizaciones para el sistema
```
```
Cómo puedo mejorar el rendimiento
```
```
Identifica cuellos de botella
```

### Para Soporte Técnico

```
Explica cómo funciona [feature]
```
```
Ayúdame con [problema]
```
```
Dame consejos para [tarea]
```

---

## 🔧 Comandos Rápidos (Quick Actions)

En la parte inferior del chat encontrarás botones de acción rápida:

- **💡 ¿Cómo funciona?** - Explicación de funcionalidades
- **🔧 Ayuda** - Asistencia con problemas
- **⭐ Consejos** - Recomendaciones y mejores prácticas
- **📊 Analizar** - Análisis del rendimiento
- **📈 Predecir** - Predicciones y tendencias

---

## 📊 Panel de Analytics

### Métricas en Tiempo Real

El panel de Analytics muestra:

1. **CPU Usage** 🔵
   - Uso actual del procesador
   - Alerta si supera 70%

2. **RAM Usage** 🟢
   - Uso de memoria
   - Alerta si supera 80%

3. **Requests** 🟡
   - Número de peticiones activas
   - Actualización cada 3 segundos

4. **Errores** 🔴
   - Errores detectados
   - Alerta si supera 5

### Insights del Sistema

ZeroForce genera automáticamente:
- Patrones detectados
- Anomalías encontradas
- Recomendaciones
- Predicciones

---

## 🎨 Personalización

### Colores de Acento

ZeroForce soporta temas de color:

```jsx
<ZeroForceAI
  accentColor="cyan"    // Azul cian (defecto)
  accentColor="blue"    // Azul
  accentColor="purple"  // Púrpura
  accentColor="green"   // Verde
  accentColor="orange"  // Naranja
  accentColor="red"     // Rojo
/>
```

### Posición del Widget

```jsx
<ZeroForceAI
  position="bottom-right"  // Abajo derecha (defecto)
  position="bottom-left"   // Abajo izquierda
  position="top-right"     // Arriba derecha
  position="top-left"      // Arriba izquierda
/>
```

---

## 🧩 Integración con tu Sistema

### Pasar Datos del Sistema

```jsx
<ZeroForceAI
  systemName="MiSistema"
  systemContext="Descripción de lo que hace tu sistema"
  systemData={{
    // Tus métricas personalizadas
    totalUsers: 150,
    activeOrders: 25,
    revenue: 5000,
  }}
  onDataAnalysis={(analysis) => {
    // Manejar análisis
    console.log('Análisis:', analysis);
  }}
  onCommandExecute={(command) => {
    // Ejecutar comandos personalizados
    console.log('Comando:', command);
  }}
/>
```

### Usar el Hook useZeroForce

```jsx
import { useZeroForce } from './hooks/useZeroForce';

function MiComponente() {
  const {
    query,
    analyzeData,
    isProcessing,
    metrics,
  } = useZeroForce({
    systemName: 'MiSistema',
    systemContext: 'Contexto del sistema',
    defaultModel: 'qwen2.5:7b',
    enableLearning: true,
    enableProactive: true,
  });

  const handleAnalysis = async () => {
    const result = await analyzeData(myData, 'trend');
    console.log('Resultados:', result);
  };

  return (
    <button onClick={handleAnalysis} disabled={isProcessing}>
      Analizar Datos
    </button>
  );
}
```

---

## 🔍 Solución de Problemas

### ❌ "No se pudo conectar con Ollama"

**Causa:** Ollama no está corriendo

**Solución:**
```bash
ollama serve
```

Verifica que esté corriendo en: http://localhost:11434

---

### ❌ "Modelo no encontrado"

**Causa:** No has descargado el modelo

**Solución:**
```bash
ollama pull qwen2.5:7b
```

Verifica modelos instalados:
```bash
ollama list
```

---

### ❌ Respuestas muy lentas

**Causas posibles:**
1. Modelo muy grande para tu hardware
2. RAM insuficiente
3. Otros programas consumiendo recursos

**Soluciones:**
1. Usa un modelo más pequeño:
   ```bash
   ollama pull llama3.2:latest
   ```
2. Cierra aplicaciones pesadas
3. En Settings, selecciona `llama3.2:latest`

---

### ❌ La voz no funciona

**Causas:**
1. Navegador no soporta Web Speech API
2. Permisos de micrófono denegados

**Soluciones:**
1. Usa Chrome, Edge o Safari (navegadores compatibles)
2. Permite acceso al micrófono cuando te lo pida
3. Verifica permisos en configuración del navegador

---

## 📈 Rendimiento y Optimización

### Memoria de Aprendizaje

ZeroForce guarda:
- **Últimas 1000 conversaciones** en localStorage
- Embeddings semánticos para búsqueda
- Métricas de uso
- Patrones de consulta

**Limpiar caché:**
```javascript
localStorage.removeItem('zeroforce_learning');
```

O en DevTools Console:
```javascript
localStorage.clear(); // Limpia todo
```

### Modelos Múltiples

ZeroForce selecciona automáticamente el mejor modelo:

- **Consultas de código** → `codellama`
- **Análisis de datos** → `qwen2.5:7b`
- **Consultas simples** → `llama3.2`
- **Por defecto** → `qwen2.5:7b`

---

## 🚀 Funciones Avanzadas

### 1. RAG (Retrieval Augmented Generation)

ZeroForce busca en conversaciones previas para mejorar respuestas:

```
Usuario: "Cómo optimizo las ventas?"
ZeroForce: [Busca conversaciones similares]
          [Encuentra contexto relevante]
          [Genera respuesta mejorada con ese contexto]
```

### 2. Multi-Agente

Múltiples IAs trabajan en paralelo:
- Agente de análisis
- Agente de predicción
- Agente de optimización

### 3. Auto-Optimización

ZeroForce ajusta automáticamente:
- Temperature según tipo de consulta
- Modelo según complejidad
- Contexto según relevancia

---

## 📚 Comandos de Ollama Útiles

```bash
# Ver modelos instalados
ollama list

# Descargar modelo
ollama pull <modelo>

# Eliminar modelo
ollama rm <modelo>

# Probar modelo en terminal
ollama run qwen2.5:7b

# Ver información del modelo
ollama show qwen2.5:7b

# Detener servidor
# Ctrl+C en la ventana donde corre ollama serve
```

---

## 🎯 Mejores Prácticas

### ✅ DO's (Hacer)

1. ✅ Mantén Ollama corriendo mientras usas ZeroForce
2. ✅ Usa `qwen2.5:7b` para español y análisis empresarial
3. ✅ Activa Streaming para ver respuestas en tiempo real
4. ✅ Activa RAG para respuestas más contextuales
5. ✅ Usa comandos de voz para mayor productividad
6. ✅ Revisa el panel de Analytics regularmente

### ❌ DON'Ts (No Hacer)

1. ❌ No uses modelos muy grandes si tienes poca RAM
2. ❌ No cambies de modelo constantemente (consume RAM)
3. ❌ No uses temperature > 1.0 (respuestas incoherentes)
4. ❌ No desactives Streaming (peor experiencia de usuario)

---

## 🔐 Privacidad y Seguridad

### 100% Local y Privado

- ✅ **Sin envío de datos a internet** (todo es local)
- ✅ **Sin API keys necesarias** (completamente gratis)
- ✅ **Sin límites de uso** (usa cuanto quieras)
- ✅ **Datos en tu máquina** (localStorage del navegador)
- ✅ **No se requiere internet** (después de descargar modelos)

### Datos Almacenados

ZeroForce guarda en localStorage:
- Conversaciones (últimas 1000)
- Configuración de usuario
- Métricas de uso
- Embeddings de búsqueda

**Todo permanece en tu navegador. Nada se envía a servidores externos.**

---

## 📦 Requisitos del Sistema

### Mínimos
- **RAM**: 8 GB (para modelos 3B)
- **Almacenamiento**: 5 GB por modelo
- **CPU**: Cualquier procesador moderno
- **Navegador**: Chrome, Edge, Safari, Firefox
- **SO**: Windows 10+, macOS 11+, Linux

### Recomendados
- **RAM**: 16 GB+ (para modelos 7B+)
- **Almacenamiento**: SSD (mejora velocidad)
- **GPU**: NVIDIA/AMD (opcional, acelera respuestas)
- **CPU**: 4+ cores

---

## 🎓 Recursos Adicionales

### Documentación Oficial
- **Ollama**: https://ollama.com
- **API Docs**: https://github.com/ollama/ollama/blob/main/docs/api.md
- **Modelos**: https://ollama.com/library

### Comunidad
- **Discord Ollama**: https://discord.gg/ollama
- **GitHub Issues**: https://github.com/anthropics/claude-code/issues

---

## ✅ Checklist de Instalación

Marca cuando completes cada paso:

- [ ] Ollama descargado e instalado
- [ ] `ollama serve` corriendo
- [ ] Modelo `qwen2.5:7b` descargado
- [ ] ZeroForce abierto en la aplicación
- [ ] Configuración guardada (⚙️)
- [ ] Primera consulta realizada exitosamente
- [ ] Comandos de voz probados (opcional)
- [ ] Panel de Analytics explorado
- [ ] Sistema funcionando correctamente

---

## 🎉 ¡Listo!

Ahora tienes el sistema de IA más avanzado corriendo en tu aplicación:

⚡ **ZEROFORCE** - Máxima Potencia de IA

**Características activas:**
- ✅ Multi-Modelo Inteligente
- ✅ RAG con Embeddings
- ✅ Análisis Predictivo
- ✅ Comandos de Voz
- ✅ Dashboard 3D
- ✅ Streaming en Tiempo Real
- ✅ Memoria de 1000+ Conversaciones
- ✅ Auto-Optimización
- ✅ 100% Local y Privado

---

## 🆘 Soporte

Si tienes problemas:

1. **Revisa esta guía** completa
2. **Verifica que Ollama esté corriendo**: `ollama serve`
3. **Revisa modelos instalados**: `ollama list`
4. **Consulta los logs** en DevTools Console (F12)
5. **Reporta issues**: https://github.com/anthropics/claude-code/issues

---

**¡Disfruta de ZEROFORCE! ⚡🚀**
