# 🧠 Guía Completa: Ollama + ZeroForce AI

## 📋 Índice
1. [Instalación Automática](#instalación-automática)
2. [Instalación Manual](#instalación-manual)
3. [Configuración en ZeroForce](#configuración-en-zeroforce)
4. [Modelos Recomendados](#modelos-recomendados)
5. [Solución de Problemas](#solución-de-problemas)

---

## 🚀 Instalación Automática

### Opción 1: Script Automatizado (Recomendado)

```powershell
# Ejecutar el script de configuración automática
.\SETUP_OLLAMA.ps1
```

Este script hará todo por ti:
- ✅ Verificar si Ollama está instalado
- ✅ Descargar e instalar Ollama si es necesario
- ✅ Iniciar el servidor automáticamente
- ✅ Descargar el modelo que elijas
- ✅ Configurar todo listo para usar

---

## 🛠️ Instalación Manual

### Paso 1: Instalar Ollama

#### Windows
1. Descarga el instalador desde: https://ollama.com/download
2. Ejecuta `OllamaSetup.exe`
3. Sigue el asistente de instalación
4. Reinicia tu terminal

#### Verificar Instalación
```powershell
ollama --version
```

### Paso 2: Iniciar el Servidor

#### Opción A - Ventana Visible (Para monitorear)
```powershell
ollama serve
```
✅ **DÉJALO CORRIENDO** - No cierres esta ventana

#### Opción B - En Segundo Plano
```powershell
Start-Process ollama -ArgumentList "serve" -WindowStyle Minimized
```

#### Verificar que está corriendo
Abre tu navegador y ve a: http://localhost:11434

Deberías ver:
```
Ollama is running
```

### Paso 3: Descargar un Modelo

#### Modelo Recomendado - Mejor para Español
```powershell
ollama pull qwen2.5:7b
```
- ⏱️ Tiempo: 5-10 minutos
- 📦 Tamaño: ~4.7 GB
- 🌟 Mejor rendimiento en español
- 💪 Requiere ~8 GB RAM

#### Modelo Rápido - Si tienes poca RAM
```powershell
ollama pull llama3.2
```
- ⏱️ Tiempo: 3-5 minutos
- 📦 Tamaño: ~2 GB
- ⚡ Respuestas rápidas
- 💻 Funciona con ~4 GB RAM

#### Otros Modelos Útiles

**Para Español Avanzado:**
```powershell
ollama pull mistral
```
- 📦 ~4.1 GB
- 🇪🇸 Excelente con español
- ⚖️ Equilibrado velocidad/calidad

**Para Código:**
```powershell
ollama pull codellama
```
- 📦 ~3.8 GB
- 💻 Especializado en programación
- 🔧 Ideal para desarrollo

**Modelos Pequeños (Para computadoras limitadas):**
```powershell
ollama pull phi
```
- 📦 ~1.6 GB
- ⚡ Muy rápido
- 💻 Mínimo uso de RAM

### Paso 4: Verificar Modelos Instalados

```powershell
ollama list
```

Salida esperada:
```
NAME              ID              SIZE      MODIFIED
qwen2.5:7b        a1b2c3d4e5f6   4.7 GB    2 minutes ago
```

---

## ⚙️ Configuración en ZeroForce

### 1️⃣ Iniciar tu Aplicación

```powershell
npm run dev
```

### 2️⃣ Abrir en el Navegador

Navega a: **http://localhost:3001**

### 3️⃣ Abrir ZeroForce

Busca el **botón flotante 🧠** en la esquina **inferior derecha** de la pantalla.

### 4️⃣ Acceder a Configuración

Haz clic en el icono **⚙️ Settings** en la parte superior del panel de ZeroForce.

### 5️⃣ Configurar Ollama

Completa los siguientes campos:

| Campo | Valor |
|-------|-------|
| **Ollama Host** | `http://localhost:11434` |
| **Modelo** | Selecciona el que descargaste (ej: `qwen2.5:7b`) |
| **Streaming** | ✅ Activado (recomendado) |
| **Temperatura** | `0.7` (creatividad moderada) |
| **Max Tokens** | `2048` (respuestas completas) |

### 6️⃣ Opciones Adicionales (Opcional)

- **🔊 Texto a Voz**: Activa si quieres que ZeroForce hable
- **🎤 Voz a Texto**: Activa para dictar mensajes
- **🎨 Tema**: Elige entre claro/oscuro
- **💾 Historial**: Guardar conversaciones

### 7️⃣ Guardar Configuración

Haz clic en **💾 Guardar** en la parte inferior.

### 8️⃣ ¡Empieza a Chatear!

Escribe tu primer mensaje en el campo de texto y presiona Enter.

**Ejemplos de consultas:**
```
- "Explícame cómo funciona React"
- "Ayúdame a optimizar este código"
- "¿Cuáles son las mejores prácticas de Firebase?"
```

---

## 📊 Modelos Recomendados

### Comparativa de Modelos

| Modelo | Tamaño | RAM Mínima | Velocidad | Español | Código | Uso |
|--------|--------|------------|-----------|---------|--------|-----|
| **qwen2.5:7b** | 4.7 GB | 8 GB | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | **Recomendado para español** |
| **llama3.2** | 2 GB | 4 GB | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | **Rápido y ligero** |
| **mistral** | 4.1 GB | 8 GB | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Equilibrado |
| **codellama** | 3.8 GB | 8 GB | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | **Especializado en código** |
| **phi** | 1.6 GB | 2 GB | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | Ultra ligero |

### Recomendaciones por Caso de Uso

#### 🇪🇸 Para Español General
```powershell
ollama pull qwen2.5:7b
```

#### 💻 Para Programación
```powershell
ollama pull codellama
```

#### ⚡ Para Velocidad
```powershell
ollama pull llama3.2
```

#### 🖥️ Para Computadoras Limitadas
```powershell
ollama pull phi
```

---

## 🔧 Solución de Problemas

### ❌ Error: "Ollama is not running"

**Solución:**
```powershell
# Verificar si está corriendo
curl http://localhost:11434

# Si no responde, iniciar el servidor
ollama serve
```

### ❌ Error: "Model not found"

**Solución:**
```powershell
# Ver modelos instalados
ollama list

# Descargar el modelo que falta
ollama pull qwen2.5:7b
```

### ❌ Error: "Connection refused"

**Causa:** El servidor Ollama no está iniciado.

**Solución:**
```powershell
# Iniciar el servidor
Start-Process ollama -ArgumentList "serve" -WindowStyle Minimized

# Esperar 5 segundos
Start-Sleep -Seconds 5

# Verificar
curl http://localhost:11434
```

### ❌ Respuestas Muy Lentas

**Causas posibles:**
1. Modelo muy grande para tu RAM
2. CPU/GPU sobrecargada

**Soluciones:**
```powershell
# Opción 1: Cambiar a un modelo más pequeño
ollama pull llama3.2

# Opción 2: Cerrar aplicaciones innecesarias

# Opción 3: Ajustar parámetros en ZeroForce:
# - Reducir "Max Tokens" a 1024
# - Reducir "Temperatura" a 0.5
```

### ❌ Error: "Out of Memory"

**Solución:**
```powershell
# Usar un modelo más pequeño
ollama pull phi

# O liberar memoria RAM
# Cerrar aplicaciones pesadas
```

### ❌ Puerto 11434 Ya Está en Uso

**Solución:**
```powershell
# Ver qué proceso está usando el puerto
netstat -ano | findstr :11434

# Detener el proceso (reemplaza <PID> con el número real)
taskkill /PID <PID> /F

# Reiniciar Ollama
ollama serve
```

### ❌ ZeroForce No Encuentra Ollama

**Verificación:**
1. ✅ ¿Ollama está instalado? → `ollama --version`
2. ✅ ¿El servidor está corriendo? → `curl http://localhost:11434`
3. ✅ ¿Hay modelos descargados? → `ollama list`
4. ✅ ¿La URL en ZeroForce es correcta? → `http://localhost:11434`

---

## 📚 Comandos Útiles

### Gestión de Modelos

```powershell
# Listar modelos instalados
ollama list

# Descargar un modelo
ollama pull <nombre-modelo>

# Eliminar un modelo
ollama rm <nombre-modelo>

# Información de un modelo
ollama show <nombre-modelo>
```

### Servidor

```powershell
# Iniciar servidor (ventana visible)
ollama serve

# Iniciar en segundo plano
Start-Process ollama -ArgumentList "serve" -WindowStyle Hidden

# Verificar estado
curl http://localhost:11434

# Detener servidor (Windows)
Get-Process ollama | Stop-Process
```

### Testing

```powershell
# Probar un modelo directamente
ollama run qwen2.5:7b

# Chat interactivo
ollama run qwen2.5:7b "Hola, ¿cómo estás?"

# Salir del chat
/bye
```

---

## 🎯 Mejores Prácticas

### ✅ DO's

1. **Mantén el servidor corriendo** mientras uses ZeroForce
2. **Usa streaming** para respuestas más fluidas
3. **Selecciona el modelo apropiado** según tu hardware
4. **Actualiza Ollama** regularmente: `ollama update`
5. **Monitorea el uso de RAM** con el Administrador de Tareas

### ❌ DON'Ts

1. **No descargues todos los modelos** - Ocupan mucho espacio
2. **No uses modelos grandes** si tienes poca RAM
3. **No cierres el servidor** si estás usando ZeroForce
4. **No ignores los errores** - Siempre verifica los logs

---

## 🔗 Enlaces Útiles

- **Ollama Oficial**: https://ollama.com
- **Documentación**: https://github.com/ollama/ollama
- **Modelos Disponibles**: https://ollama.com/library
- **Discord Ollama**: https://discord.gg/ollama
- **Repositorio ZeroForce**: (Tu repo)

---

## 📞 Soporte

¿Problemas? Contacta:
- 💬 Discord: [Tu servidor]
- 📧 Email: [Tu email]
- 🐛 Issues: [GitHub Issues]

---

## 🎉 ¡Todo Listo!

Si has llegado hasta aquí, ¡felicidades! Ya tienes Ollama configurado con ZeroForce.

**Próximos pasos:**
1. Experimenta con diferentes modelos
2. Ajusta los parámetros según tus necesidades
3. Integra ZeroForce en tu flujo de trabajo
4. ¡Disfruta de tu asistente AI local!

---

*Última actualización: Octubre 2025*
*Versión: 1.0.0*
