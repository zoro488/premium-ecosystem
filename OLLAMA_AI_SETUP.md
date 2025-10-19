# 🧠 Configuración AI Local con Ollama

## 🎯 ¿Qué es Ollama?

**Ollama** es la mejor plataforma para ejecutar modelos de IA de última generación **completamente gratis y en tu computadora local**.

### ✅ Ventajas
- **100% Gratis**: Sin límites de uso, sin API keys
- **100% Privado**: Tus datos nunca salen de tu PC
- **Sin Internet**: Funciona offline después de descargar el modelo
- **Modelos Potentes**: llama3.2, mistral, codellama, phi3, qwen2.5, deepseek, gemma2
- **Aprendizaje Continuo**: Sistema de caché inteligente que mejora con el tiempo

---

## 🚀 Instalación Rápida (3 pasos)

### 1️⃣ Descarga e Instala Ollama

**Windows:**
```bash
# Descarga desde: https://ollama.com/download
# Ejecuta el instalador y sigue las instrucciones
```

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### 2️⃣ Inicia el Servidor

```bash
# Ejecuta en terminal (se queda corriendo en background)
ollama serve
```

### 3️⃣ Descarga un Modelo Potente

```bash
# Opción 1: Llama 3.2 - Rápido y eficiente (RECOMENDADO)
ollama pull llama3.2

# Opción 2: Mistral - Muy inteligente
ollama pull mistral

# Opción 3: Qwen 2.5 - Excelente en español
ollama pull qwen2.5

# Opción 4: CodeLlama - Especializado en código
ollama pull codellama

# Opción 5: Phi 3 - Ultra rápido de Microsoft
ollama pull phi3
```

---

## 🎨 Uso en la Aplicación

### Configurar en FlowDistributor

1. **Abre el AI Assistant** (ícono de cerebro 🧠 flotante)
2. **Haz clic en ⚙️** (botón de configuración)
3. **Selecciona tu modelo** en el dropdown
4. **Guarda la configuración**

### Modelos Disponibles

| Modelo | Tamaño | Velocidad | Inteligencia | Uso Recomendado |
|--------|--------|-----------|--------------|-----------------|
| 🚀 **llama3.2** | 3B | ⚡⚡⚡⚡⚡ | ⭐⭐⭐⭐ | General (RECOMENDADO) |
| 🧠 **mistral** | 7B | ⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ | Tareas complejas |
| 💻 **codellama** | 7B | ⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ | Programación |
| ⚡ **phi3** | 3.8B | ⚡⚡⚡⚡⚡ | ⭐⭐⭐⭐ | Respuestas rápidas |
| 🌍 **qwen2.5** | 7B | ⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ | Multilingüe/Español |
| 🔧 **deepseek-coder** | 33B | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | Código avanzado |
| 💎 **gemma2** | 9B | ⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ | Google, muy bueno |

---

## 🔧 Comandos Útiles

```bash
# Ver modelos instalados
ollama list

# Eliminar un modelo
ollama rm llama3.2

# Actualizar un modelo
ollama pull llama3.2

# Ver información del modelo
ollama show llama3.2

# Probar un modelo en terminal
ollama run llama3.2

# Ver logs
ollama logs
```

---

## 🎯 Sistema de Aprendizaje Continuo

### Cómo Funciona

1. **Caché Inteligente**: Guarda las últimas 200 conversaciones
2. **Fallback Inteligente**: Si Ollama no está disponible, usa respuestas previas similares
3. **Mejora Continua**: Aprende patrones de tus preguntas para mejorar respuestas

### Datos Guardados (localStorage)

```javascript
// Ver datos de aprendizaje en consola del navegador
JSON.parse(localStorage.getItem('ai_learning_data'))

// Limpiar caché si es necesario
localStorage.removeItem('ai_learning_data')
```

---

## 🐛 Solución de Problemas

### ❌ Error: "No se pudo conectar con Ollama"

**Solución 1:** Verifica que Ollama esté corriendo
```bash
ollama serve
```

**Solución 2:** Verifica el host en configuración
- Por defecto: `http://localhost:11434`
- Cambia en ⚙️ si usas puerto diferente

### ❌ Error: "Modelo no encontrado"

**Solución:** Descarga el modelo
```bash
ollama pull llama3.2
```

### ❌ Respuestas lentas

**Solución 1:** Usa un modelo más pequeño (llama3.2 o phi3)
**Solución 2:** Cierra aplicaciones pesadas
**Solución 3:** Aumenta RAM del modelo en Ollama config

---

## 📊 Requisitos del Sistema

### Mínimos
- **RAM**: 8 GB (para modelos 3B)
- **Almacenamiento**: 5 GB por modelo
- **CPU**: Cualquier procesador moderno

### Recomendados
- **RAM**: 16 GB+ (para modelos 7B+)
- **GPU**: NVIDIA/AMD (opcional, acelera respuestas)
- **Almacenamiento**: SSD (mejora velocidad de carga)

---

## 🎓 Mejores Prácticas

### Para Mejor Rendimiento
1. **Usa llama3.2** si quieres velocidad + calidad
2. **Usa mistral** si necesitas máxima inteligencia
3. **Mantén Ollama siempre corriendo** en background
4. **No cambies de modelo** constantemente (carga en RAM)

### Para Mejor Privacidad
1. ✅ Todo es local, nada se envía a servidores
2. ✅ No se requiere internet después de descargar
3. ✅ Los datos de aprendizaje están en tu navegador (localStorage)

---

## 🌟 Próximas Mejoras

- [ ] Streaming de respuestas (ver texto mientras se genera)
- [ ] Modo multi-modelo (combina varios modelos)
- [ ] Fine-tuning personalizado por sistema
- [ ] Integración con archivos adjuntos
- [ ] Exportar/importar caché de aprendizaje

---

## 📚 Recursos

- **Sitio Oficial**: https://ollama.com
- **Documentación**: https://github.com/ollama/ollama/blob/main/docs/api.md
- **Modelos Disponibles**: https://ollama.com/library
- **Comunidad**: https://discord.gg/ollama

---

## ✅ Checklist de Configuración

- [ ] Ollama instalado
- [ ] `ollama serve` corriendo
- [ ] Modelo descargado (`ollama pull llama3.2`)
- [ ] Configuración guardada en AI Assistant (⚙️)
- [ ] Primera pregunta de prueba realizada
- [ ] Sistema funcionando correctamente

---

**¡Listo!** Ahora tienes un asistente IA de última generación corriendo 100% gratis y privado en tu computadora 🚀
